import { Op, Transaction } from 'sequelize';
import { logger } from '../utils/logger';
import { handleSequelizeError } from '../../utils/sequelizeErrorHandler';
import {
  Message,
  MessageTemplate,
  MessageDelivery,
  User,
  Student,
  EmergencyContact,
  sequelize
} from '../database/models';
import {
  MessageType,
  MessagePriority,
  MessageCategory,
  RecipientType,
  DeliveryStatus
} from '../database/types/enums';
import {
  validateEmail,
  validatePhoneNumber,
  validateMessageContent,
  validateRecipientForChannel,
  validateScheduledTime,
  validateEmergencyAlert,
  validateTemplateVariables,
  extractTemplateVariables,
  validateHIPAACompliance,
  COMMUNICATION_LIMITS,
  createMessageTemplateSchema,
  updateMessageTemplateSchema,
  createMessageSchema,
  broadcastMessageSchema,
  emergencyAlertSchema
} from '../utils/communicationValidation';

/**
 * Interface for creating a new message template
 */
export interface CreateMessageTemplateData {
  name: string;
  subject?: string;
  content: string;
  type: MessageType;
  category: MessageCategory;
  variables?: string[];
  isActive?: boolean;
  createdBy: string;
}

/**
 * Interface for creating a new message
 */
export interface CreateMessageData {
  recipients: Array<{
    type: RecipientType;
    id: string;
    email?: string;
    phoneNumber?: string;
    pushToken?: string;
    preferredLanguage?: string;
  }>;
  channels: MessageType[];
  subject?: string;
  content: string;
  priority: MessagePriority;
  category: MessageCategory;
  templateId?: string;
  scheduledAt?: Date;
  attachments?: string[];
  senderId: string;
  translateTo?: string[];
}

/**
 * Interface for message delivery status tracking
 */
export interface MessageDeliveryStatusResult {
  messageId: string;
  recipientId: string;
  channel: MessageType;
  status: DeliveryStatus;
  sentAt?: Date;
  deliveredAt?: Date;
  failureReason?: string;
  externalId?: string;
}

/**
 * Interface for broadcast message data
 */
export interface BroadcastMessageData {
  audience: {
    grades?: string[];
    nurseIds?: string[];
    studentIds?: string[];
    includeParents?: boolean;
    includeEmergencyContacts?: boolean;
  };
  channels: MessageType[];
  subject?: string;
  content: string;
  priority: MessagePriority;
  category: MessageCategory;
  senderId: string;
  scheduledAt?: Date;
  translateTo?: string[];
}

/**
 * Interface for message query filters
 */
export interface MessageFilters {
  senderId?: string;
  category?: MessageCategory;
  priority?: MessagePriority;
  status?: DeliveryStatus;
  dateFrom?: Date;
  dateTo?: Date;
}

/**
 * Communication Service
 * Handles all message template, message sending, and delivery tracking operations
 */
export class CommunicationService {
  /**
   * Create message template
   * @param data - Template creation data
   * @returns Created message template with creator details
   */
  static async createMessageTemplate(data: CreateMessageTemplateData): Promise<MessageTemplate> {
    try {
      // Validate input data
      const { error, value } = createMessageTemplateSchema.validate(data, { abortEarly: false });

      if (error) {
        const validationErrors = error.details.map((detail) => detail.message).join(', ');
        throw new Error(`Validation failed: ${validationErrors}`);
      }

      // Verify creator exists
      const creator = await User.findByPk(data.createdBy);

      if (!creator) {
        throw new Error('Creator not found');
      }

      // Extract and validate template variables
      const extractedVariables = extractTemplateVariables(data.content);
      const declaredVariables = data.variables || [];

      const variableValidation = validateTemplateVariables(data.content, declaredVariables);

      // Log warnings if any
      if (variableValidation.warnings.length > 0) {
        logger.warn(`Template variable warnings: ${variableValidation.warnings.join(', ')}`);
      }

      // Use extracted variables if none were declared
      const finalVariables = declaredVariables.length > 0 ? declaredVariables : extractedVariables;

      // Validate content for the specified message type
      if (data.type !== MessageType.EMAIL && data.type !== MessageType.PUSH_NOTIFICATION) {
        const contentValidation = validateMessageContent(data.content, data.type, data.subject);

        if (!contentValidation.isValid) {
          throw new Error(`Content validation failed: ${contentValidation.errors.join(', ')}`);
        }

        if (contentValidation.warnings.length > 0) {
          logger.warn(`Template content warnings: ${contentValidation.warnings.join(', ')}`);
        }
      }

      const template = await MessageTemplate.create({
        name: data.name,
        subject: data.subject,
        content: data.content,
        type: data.type,
        category: data.category,
        variables: finalVariables,
        isActive: data.isActive !== undefined ? data.isActive : true,
        createdById: data.createdBy
      });

      // Reload with associations
      await template.reload({
        include: [
          {
            model: User,
            as: 'createdBy',
            attributes: ['id', 'firstName', 'lastName', 'role']
          }
        ]
      });

      logger.info(`Message template created: ${template.name} (${template.type}) by ${creator.firstName} ${creator.lastName}`);
      return template;
    } catch (error) {
      throw handleSequelizeError(error as Error);
    }
  }

  /**
   * Get message templates with optional filters
   * @param type - Filter by message type
   * @param category - Filter by message category
   * @param isActive - Filter by active status
   * @returns Array of message templates
   */
  static async getMessageTemplates(
    type?: MessageType,
    category?: MessageCategory,
    isActive: boolean = true
  ): Promise<MessageTemplate[]> {
    try {
      const whereClause: any = { isActive };

      if (type) {
        whereClause.type = type;
      }

      if (category) {
        whereClause.category = category;
      }

      const templates = await MessageTemplate.findAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: 'createdBy',
            attributes: ['id', 'firstName', 'lastName', 'role']
          }
        ],
        order: [
          ['category', 'ASC'],
          ['name', 'ASC']
        ]
      });

      return templates;
    } catch (error) {
      logger.error('Error fetching message templates:', error);
      throw handleSequelizeError(error as Error);
    }
  }

  /**
   * Send message to specific recipients
   * Uses transaction to ensure atomicity of message creation and delivery tracking
   * @param data - Message data with recipients and channels
   * @returns Created message and delivery statuses
   */
  static async sendMessage(data: CreateMessageData): Promise<{
    message: Message;
    deliveryStatuses: MessageDeliveryStatusResult[];
  }> {
    const transaction = await sequelize.transaction();

    try {
      // Validate input data
      const { error, value } = createMessageSchema.validate(data, { abortEarly: false });

      if (error) {
        await transaction.rollback();
        const validationErrors = error.details.map((detail) => detail.message).join(', ');
        throw new Error(`Validation failed: ${validationErrors}`);
      }

      // Verify sender exists
      const sender = await User.findByPk(data.senderId);

      if (!sender) {
        await transaction.rollback();
        throw new Error('Sender not found');
      }

      // Validate scheduled time if provided
      if (data.scheduledAt) {
        const scheduledValidation = validateScheduledTime(data.scheduledAt);
        if (!scheduledValidation.isValid) {
          await transaction.rollback();
          throw new Error(scheduledValidation.error);
        }
      }

      // HIPAA compliance check for content
      const hipaaValidation = validateHIPAACompliance(data.content);
      if (!hipaaValidation.isValid) {
        await transaction.rollback();
        throw new Error(`HIPAA compliance failed: ${hipaaValidation.errors.join(', ')}`);
      }

      if (hipaaValidation.warnings.length > 0) {
        logger.warn(`HIPAA compliance warnings: ${hipaaValidation.warnings.join(', ')}`);
      }

      // HIPAA compliance check for subject if present
      if (data.subject) {
        const subjectHipaaValidation = validateHIPAACompliance(data.subject);
        if (!subjectHipaaValidation.isValid) {
          await transaction.rollback();
          throw new Error(`HIPAA compliance failed in subject: ${subjectHipaaValidation.errors.join(', ')}`);
        }
      }

      // Validate message content for each channel
      const contentValidationErrors: string[] = [];
      const contentValidationWarnings: string[] = [];

      for (const channel of data.channels) {
        const contentValidation = validateMessageContent(data.content, channel, data.subject);

        if (!contentValidation.isValid) {
          contentValidationErrors.push(...contentValidation.errors.map(err => `[${channel}] ${err}`));
        }

        if (contentValidation.warnings.length > 0) {
          contentValidationWarnings.push(...contentValidation.warnings.map(warn => `[${channel}] ${warn}`));
        }
      }

      if (contentValidationErrors.length > 0) {
        await transaction.rollback();
        throw new Error(`Content validation failed: ${contentValidationErrors.join(', ')}`);
      }

      if (contentValidationWarnings.length > 0) {
        logger.warn(`Message content warnings: ${contentValidationWarnings.join(', ')}`);
      }

      // Validate recipients have required contact info for their channels
      const recipientValidationErrors: string[] = [];

      for (const recipient of data.recipients) {
        for (const channel of data.channels) {
          const recipientValidation = validateRecipientForChannel(recipient, channel);

          if (!recipientValidation.isValid) {
            recipientValidationErrors.push(`Recipient ${recipient.id}: ${recipientValidation.error}`);
          }
        }
      }

      if (recipientValidationErrors.length > 0) {
        logger.warn(`Recipient validation warnings: ${recipientValidationErrors.join(', ')}`);
      }

      // Validate emergency messages have URGENT priority
      if (data.category === MessageCategory.EMERGENCY && data.priority !== MessagePriority.URGENT) {
        logger.warn('Emergency messages should have URGENT priority. Auto-adjusting priority.');
        data.priority = MessagePriority.URGENT;
      }

      // Create message record
      const message = await Message.create(
        {
          subject: data.subject,
          content: data.content,
          priority: data.priority,
          category: data.category,
          templateId: data.templateId,
          scheduledAt: data.scheduledAt,
          attachments: data.attachments || [],
          senderId: data.senderId,
          recipientCount: data.recipients.length
        },
        { transaction }
      );

      // Process each recipient and channel combination
      const deliveryStatuses: MessageDeliveryStatusResult[] = [];

      for (const recipient of data.recipients) {
        for (const channel of data.channels) {
          // Validate recipient has required contact info for channel
          let canSend = false;

          switch (channel) {
            case MessageType.EMAIL:
              canSend = !!recipient.email;
              break;
            case MessageType.SMS:
            case MessageType.VOICE:
              canSend = !!recipient.phoneNumber;
              break;
            case MessageType.PUSH_NOTIFICATION:
              canSend = !!recipient.pushToken;
              break;
          }

          if (!canSend) {
            deliveryStatuses.push({
              messageId: message.id,
              recipientId: recipient.id,
              channel,
              status: DeliveryStatus.FAILED,
              failureReason: `Missing ${channel.toLowerCase()} contact information`
            });
            continue;
          }

          // Create delivery record
          const delivery = await MessageDelivery.create(
            {
              messageId: message.id,
              recipientId: recipient.id,
              recipientType: recipient.type,
              channel,
              status: data.scheduledAt ? DeliveryStatus.PENDING : DeliveryStatus.SENT,
              contactInfo:
                channel === MessageType.EMAIL
                  ? recipient.email!
                  : channel === MessageType.SMS || channel === MessageType.VOICE
                  ? recipient.phoneNumber!
                  : channel === MessageType.PUSH_NOTIFICATION
                  ? recipient.pushToken!
                  : undefined
            },
            { transaction }
          );

          // If not scheduled, send immediately
          if (!data.scheduledAt) {
            try {
              const result = await this.sendViaChannel(channel, {
                to:
                  channel === MessageType.EMAIL
                    ? recipient.email!
                    : channel === MessageType.SMS || channel === MessageType.VOICE
                    ? recipient.phoneNumber!
                    : recipient.pushToken!,
                subject: data.subject,
                content: data.content,
                priority: data.priority,
                attachments: data.attachments
              });

              await delivery.update(
                {
                  status: DeliveryStatus.DELIVERED,
                  sentAt: new Date(),
                  deliveredAt: new Date(),
                  externalId: result.externalId
                },
                { transaction }
              );

              deliveryStatuses.push({
                messageId: message.id,
                recipientId: recipient.id,
                channel,
                status: DeliveryStatus.DELIVERED,
                sentAt: new Date(),
                deliveredAt: new Date(),
                externalId: result.externalId
              });
            } catch (error) {
              await delivery.update(
                {
                  status: DeliveryStatus.FAILED,
                  failureReason: (error as Error).message
                },
                { transaction }
              );

              deliveryStatuses.push({
                messageId: message.id,
                recipientId: recipient.id,
                channel,
                status: DeliveryStatus.FAILED,
                failureReason: (error as Error).message
              });
            }
          } else {
            deliveryStatuses.push({
              messageId: message.id,
              recipientId: recipient.id,
              channel,
              status: DeliveryStatus.PENDING
            });
          }
        }
      }

      await transaction.commit();

      logger.info(
        `Message sent: ${message.id} to ${data.recipients.length} recipients via ${data.channels.join(', ')}`
      );

      return {
        message,
        deliveryStatuses
      };
    } catch (error) {
      await transaction.rollback();
      throw handleSequelizeError(error as Error);
    }
  }

  /**
   * Send broadcast message to multiple audiences
   * Builds recipient list based on audience criteria and sends message
   * @param data - Broadcast message data with audience targeting
   * @returns Created message and delivery statuses
   */
  static async sendBroadcastMessage(data: BroadcastMessageData): Promise<{
    message: Message;
    deliveryStatuses: MessageDeliveryStatusResult[];
  }> {
    try {
      // Validate input data
      const { error, value } = broadcastMessageSchema.validate(data, { abortEarly: false });

      if (error) {
        const validationErrors = error.details.map((detail) => detail.message).join(', ');
        throw new Error(`Validation failed: ${validationErrors}`);
      }

      // Validate scheduled time if provided
      if (data.scheduledAt) {
        const scheduledValidation = validateScheduledTime(data.scheduledAt);
        if (!scheduledValidation.isValid) {
          throw new Error(scheduledValidation.error);
        }
      }

      // HIPAA compliance check for broadcast content
      const hipaaValidation = validateHIPAACompliance(data.content);
      if (!hipaaValidation.isValid) {
        throw new Error(`HIPAA compliance failed: ${hipaaValidation.errors.join(', ')}`);
      }

      if (hipaaValidation.warnings.length > 0) {
        logger.warn(`Broadcast HIPAA compliance warnings: ${hipaaValidation.warnings.join(', ')}`);
      }

      // HIPAA compliance check for subject if present
      if (data.subject) {
        const subjectHipaaValidation = validateHIPAACompliance(data.subject);
        if (!subjectHipaaValidation.isValid) {
          throw new Error(`HIPAA compliance failed in subject: ${subjectHipaaValidation.errors.join(', ')}`);
        }
      }

      // Validate message content for each channel
      const contentValidationErrors: string[] = [];
      const contentValidationWarnings: string[] = [];

      for (const channel of data.channels) {
        const contentValidation = validateMessageContent(data.content, channel, data.subject);

        if (!contentValidation.isValid) {
          contentValidationErrors.push(...contentValidation.errors.map(err => `[${channel}] ${err}`));
        }

        if (contentValidation.warnings.length > 0) {
          contentValidationWarnings.push(...contentValidation.warnings.map(warn => `[${channel}] ${warn}`));
        }
      }

      if (contentValidationErrors.length > 0) {
        throw new Error(`Content validation failed: ${contentValidationErrors.join(', ')}`);
      }

      if (contentValidationWarnings.length > 0) {
        logger.warn(`Broadcast message content warnings: ${contentValidationWarnings.join(', ')}`);
      }

      // Validate emergency messages have URGENT priority
      if (data.category === MessageCategory.EMERGENCY && data.priority !== MessagePriority.URGENT) {
        logger.warn('Emergency broadcast messages should have URGENT priority. Auto-adjusting priority.');
        data.priority = MessagePriority.URGENT;
      }

      // Build recipient list based on audience criteria
      const recipients: CreateMessageData['recipients'] = [];

      // Get students based on criteria
      if (data.audience.grades || data.audience.nurseIds || data.audience.studentIds) {
        const studentWhereClause: any = { isActive: true };

        if (data.audience.grades?.length) {
          studentWhereClause.grade = { [Op.in]: data.audience.grades };
        }

        if (data.audience.nurseIds?.length) {
          studentWhereClause.nurseId = { [Op.in]: data.audience.nurseIds };
        }

        if (data.audience.studentIds?.length) {
          studentWhereClause.id = { [Op.in]: data.audience.studentIds };
        }

        const students = await Student.findAll({
          where: studentWhereClause,
          include: [
            {
              model: EmergencyContact,
              as: 'emergencyContacts',
              where: { isActive: true },
              required: false,
              separate: true,
              order: [['priority', 'ASC']]
            }
          ]
        });

        // Add emergency contacts if requested
        if (data.audience.includeEmergencyContacts || data.audience.includeParents) {
          for (const student of students) {
            const studentWithContacts = student as any;
            if (studentWithContacts.emergencyContacts && Array.isArray(studentWithContacts.emergencyContacts)) {
              for (const contact of studentWithContacts.emergencyContacts) {
                recipients.push({
                  type: RecipientType.EMERGENCY_CONTACT,
                  id: contact.id,
                  email: contact.email || undefined,
                  phoneNumber: contact.phoneNumber
                });
              }
            }
          }
        }
      }

      // Validate recipient count doesn't exceed broadcast limit
      if (recipients.length > COMMUNICATION_LIMITS.MAX_RECIPIENTS_BROADCAST) {
        throw new Error(
          `Broadcast message exceeds maximum recipient limit of ${COMMUNICATION_LIMITS.MAX_RECIPIENTS_BROADCAST}. ` +
          `Current recipient count: ${recipients.length}`
        );
      }

      if (recipients.length === 0) {
        throw new Error('No recipients found matching the specified audience criteria');
      }

      logger.info(`Broadcast message will be sent to ${recipients.length} recipients`);

      // Convert to message format and send
      const messageData: CreateMessageData = {
        recipients,
        channels: data.channels,
        subject: data.subject,
        content: data.content,
        priority: data.priority,
        category: data.category,
        scheduledAt: data.scheduledAt,
        senderId: data.senderId
      };

      return await this.sendMessage(messageData);
    } catch (error) {
                logger.error('Error sending broadcast message:', error);
                throw handleSequelizeError(error as Error);    }
  }

  /**
   * Get messages with pagination and filters
   * @param page - Page number (1-indexed)
   * @param limit - Number of items per page
   * @param filters - Optional filters
   * @returns Paginated messages with metadata
   */
  static async getMessages(
    page: number = 1,
    limit: number = 20,
    filters: MessageFilters = {}
  ): Promise<{
    messages: Message[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    try {
      const offset = (page - 1) * limit;

      const whereClause: any = {};

      if (filters.senderId) {
        whereClause.senderId = filters.senderId;
      }

      if (filters.category) {
        whereClause.category = filters.category;
      }

      if (filters.priority) {
        whereClause.priority = filters.priority;
      }

      if (filters.dateFrom || filters.dateTo) {
        whereClause.createdAt = {};
        if (filters.dateFrom) {
          whereClause.createdAt[Op.gte] = filters.dateFrom;
        }
        if (filters.dateTo) {
          whereClause.createdAt[Op.lte] = filters.dateTo;
        }
      }

      const { rows: messages, count: total } = await Message.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        include: [
          {
            model: User,
            as: 'sender',
            attributes: ['id', 'firstName', 'lastName', 'role']
          },
          {
            model: MessageTemplate,
            as: 'template',
            attributes: ['id', 'name', 'type']
          },
          {
            model: MessageDelivery,
            as: 'deliveries',
            attributes: []
          }
        ],
        order: [['createdAt', 'DESC']],
        distinct: true
      });

      return {
        messages,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw handleSequelizeError(error as Error);
    }
  }

  /**
   * Get message delivery status for a specific message
   * @param messageId - Message ID
   * @returns Delivery records and summary statistics
   */
  static async getMessageDeliveryStatus(messageId: string): Promise<{
    deliveries: MessageDelivery[];
    summary: {
      total: number;
      pending: number;
      sent: number;
      delivered: number;
      failed: number;
      bounced: number;
    };
  }> {
    try {
      const deliveries = await MessageDelivery.findAll({
        where: { messageId },
        order: [
          ['recipientType', 'ASC'],
          ['channel', 'ASC']
        ]
      });

      const summary = {
        total: deliveries.length,
        pending: deliveries.filter((d) => d.status === DeliveryStatus.PENDING).length,
        sent: deliveries.filter((d) => d.status === DeliveryStatus.SENT).length,
        delivered: deliveries.filter((d) => d.status === DeliveryStatus.DELIVERED).length,
        failed: deliveries.filter((d) => d.status === DeliveryStatus.FAILED).length,
        bounced: deliveries.filter((d) => d.status === DeliveryStatus.BOUNCED).length
      };

      return {
        deliveries,
        summary
      };
    } catch (error) {
      throw handleSequelizeError(error as Error);
    }
  }

  /**
   * Process scheduled messages that are due for delivery
   * Should be called by a cron job or scheduled task
   * @returns Number of messages processed
   */
  static async processScheduledMessages(): Promise<number> {
    try {
      const now = new Date();

      // Find messages with scheduled time in the past and pending deliveries
      const pendingMessages = await Message.findAll({
        where: {
          scheduledAt: {
            [Op.lte]: now
          }
        },
        include: [
          {
            model: MessageDelivery,
            as: 'deliveries',
            where: {
              status: DeliveryStatus.PENDING
            },
            required: true
          }
        ]
      });

      let processedCount = 0;

      for (const message of pendingMessages) {
        const messageWithDeliveries = message as any;
        if (messageWithDeliveries.deliveries && Array.isArray(messageWithDeliveries.deliveries)) {
          for (const delivery of messageWithDeliveries.deliveries) {
            try {
              const result = await this.sendViaChannel(delivery.channel, {
                to: delivery.contactInfo!,
                subject: message.subject || undefined,
                content: message.content,
                priority: message.priority
              });

              await delivery.update({
                status: DeliveryStatus.DELIVERED,
                sentAt: new Date(),
                deliveredAt: new Date(),
                externalId: result.externalId
              });

              processedCount++;
            } catch (error) {
              await delivery.update({
                status: DeliveryStatus.FAILED,
                failureReason: (error as Error).message
              });
            }
          }
        }
      }

      logger.info(`Processed ${processedCount} scheduled messages`);
      return processedCount;
    } catch (error) {
      logger.error('Error processing scheduled messages:', error);
      throw handleSequelizeError(error as Error);
    }
  }

  /**
   * Get communication statistics with optional date filtering
   * @param dateFrom - Start date for statistics
   * @param dateTo - End date for statistics
   * @returns Aggregated statistics
   */
  static async getCommunicationStatistics(dateFrom?: Date, dateTo?: Date): Promise<{
    totalMessages: number;
    byCategory: Record<string, number>;
    byPriority: Record<string, number>;
    byChannel: Record<string, number>;
    deliveryStatus: Record<string, number>;
  }> {
    try {
      const whereClause: any = {};

      if (dateFrom || dateTo) {
        whereClause.createdAt = {};
        if (dateFrom) {
          whereClause.createdAt[Op.gte] = dateFrom;
        }
        if (dateTo) {
          whereClause.createdAt[Op.lte] = dateTo;
        }
      }

      // Get total messages count
      const totalMessages = await Message.count({ where: whereClause });

      // Get statistics by category
      const categoryStats = await Message.findAll({
        where: whereClause,
        attributes: [
          'category',
          [sequelize.fn('COUNT', sequelize.col('category')), 'count']
        ],
        group: ['category'],
        raw: true
      });

      // Get statistics by priority
      const priorityStats = await Message.findAll({
        where: whereClause,
        attributes: [
          'priority',
          [sequelize.fn('COUNT', sequelize.col('priority')), 'count']
        ],
        group: ['priority'],
        raw: true
      });

      // Get statistics by channel (from deliveries)
      const channelStats = await MessageDelivery.findAll({
        attributes: [
          'channel',
          [sequelize.fn('COUNT', sequelize.col('channel')), 'count']
        ],
        include: [
          {
            model: Message,
            as: 'message',
            where: whereClause,
            attributes: []
          }
        ],
        group: ['channel'],
        raw: true
      });

      // Get delivery status statistics
      const deliveryStats = await MessageDelivery.findAll({
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('status')), 'count']
        ],
        include: [
          {
            model: Message,
            as: 'message',
            where: whereClause,
            attributes: []
          }
        ],
        group: ['status'],
        raw: true
      });

      return {
        totalMessages,
        byCategory: categoryStats.reduce((acc: Record<string, number>, curr: any) => {
          acc[curr.category] = parseInt(curr.count, 10);
          return acc;
        }, {}),
        byPriority: priorityStats.reduce((acc: Record<string, number>, curr: any) => {
          acc[curr.priority] = parseInt(curr.count, 10);
          return acc;
        }, {}),
        byChannel: channelStats.reduce((acc: Record<string, number>, curr: any) => {
          acc[curr.channel] = parseInt(curr.count, 10);
          return acc;
        }, {}),
        deliveryStatus: deliveryStats.reduce((acc: Record<string, number>, curr: any) => {
          acc[curr.status] = parseInt(curr.count, 10);
          return acc;
        }, {})
      };
    } catch (error) {
      logger.error('Error fetching communication statistics:', error);
      throw handleSequelizeError(error as Error);
    }
  }

  /**
   * Send emergency alert to staff
   * @param alert - Emergency alert configuration
   * @returns Created message and delivery statuses
   */
  static async sendEmergencyAlert(alert: {
    title: string;
    message: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    audience: 'ALL_STAFF' | 'NURSES_ONLY' | 'SPECIFIC_GROUPS';
    groups?: string[];
    channels: MessageType[];
    senderId: string;
  }): Promise<{
    message: Message;
    deliveryStatuses: MessageDeliveryStatusResult[];
  }> {
    try {
      // Validate input data
      const { error, value } = emergencyAlertSchema.validate(alert, { abortEarly: false });

      if (error) {
        const validationErrors = error.details.map((detail) => detail.message).join(', ');
        throw new Error(`Validation failed: ${validationErrors}`);
      }

      // Validate emergency alert requirements
      const emergencyValidation = validateEmergencyAlert({
        title: alert.title,
        message: alert.message,
        severity: alert.severity,
        priority: MessagePriority.URGENT,
        channels: alert.channels
      });

      if (!emergencyValidation.isValid) {
        throw new Error(`Emergency alert validation failed: ${emergencyValidation.errors.join(', ')}`);
      }

      if (emergencyValidation.warnings.length > 0) {
        logger.warn(`Emergency alert warnings: ${emergencyValidation.warnings.join(', ')}`);
      }

      // Build recipient list based on audience
      const recipients: CreateMessageData['recipients'] = [];

      if (alert.audience === 'ALL_STAFF') {
        const staff = await User.findAll({
          where: { isActive: true },
          attributes: ['id', 'email']
        });
        recipients.push(
          ...staff.map((s) => ({
            type: RecipientType.NURSE,
            id: s.id,
            email: s.email
          }))
        );
      } else if (alert.audience === 'NURSES_ONLY') {
        const nurses = await User.findAll({
          where: {
            isActive: true,
            role: 'NURSE'
          },
          attributes: ['id', 'email']
        });
        recipients.push(
          ...nurses.map((n) => ({
            type: RecipientType.NURSE,
            id: n.id,
            email: n.email
          }))
        );
      }

      // Send with highest priority
      return await this.sendMessage({
        recipients,
        channels: alert.channels,
        subject: `EMERGENCY ALERT: ${alert.title}`,
        content: alert.message,
        priority: MessagePriority.URGENT,
        category: MessageCategory.EMERGENCY,
        senderId: alert.senderId
      });
    } catch (error) {
      logger.error('Error sending emergency alert:', error);
      throw handleSequelizeError(error as Error);
    }
  }

  /**
   * Translate message content to target language
   * Mock implementation - should be replaced with actual translation service
   * @param content - Content to translate
   * @param targetLanguage - Target language code
   * @returns Translated content
   */
  static async translateMessage(content: string, targetLanguage: string): Promise<string> {
    try {
      // Mock implementation - replace with actual translation service (Google Translate, AWS Translate, etc.)
      logger.info(`Translating message to ${targetLanguage}: ${content.substring(0, 50)}...`);

      // In production, integrate with translation API like:
      // - Google Cloud Translation API
      // - AWS Translate
      // - Microsoft Translator Text API

      return `[${targetLanguage.toUpperCase()}] ${content}`;
    } catch (error) {
      logger.error('Error translating message:', error);
      // Return original content if translation fails
      return content;
    }
  }

  /**
   * Update message template
   * @param id - Template ID
   * @param data - Fields to update
   * @returns Updated template
   */
  static async updateMessageTemplate(
    id: string,
    data: Partial<CreateMessageTemplateData>
  ): Promise<MessageTemplate> {
    try {
      // Validate input data
      const { error, value } = updateMessageTemplateSchema.validate(data, { abortEarly: false });

      if (error) {
        const validationErrors = error.details.map((detail) => detail.message).join(', ');
        throw new Error(`Validation failed: ${validationErrors}`);
      }

      const template = await MessageTemplate.findByPk(id);

      if (!template) {
        throw new Error('Message template not found');
      }

      // If content is being updated, validate template variables
      if (data.content) {
        const extractedVariables = extractTemplateVariables(data.content);
        const declaredVariables = data.variables || template.variables || [];

        const variableValidation = validateTemplateVariables(data.content, declaredVariables);

        if (variableValidation.warnings.length > 0) {
          logger.warn(`Template variable warnings: ${variableValidation.warnings.join(', ')}`);
        }

        // Use extracted variables if none were declared
        if (!data.variables || data.variables.length === 0) {
          data.variables = extractedVariables;
        }
      }

      // If content and type are being updated, validate content for the type
      if (data.content && data.type) {
        const contentValidation = validateMessageContent(data.content, data.type, data.subject);

        if (!contentValidation.isValid) {
          throw new Error(`Content validation failed: ${contentValidation.errors.join(', ')}`);
        }

        if (contentValidation.warnings.length > 0) {
          logger.warn(`Template content warnings: ${contentValidation.warnings.join(', ')}`);
        }
      }

      await template.update({
        name: data.name,
        subject: data.subject,
        content: data.content,
        type: data.type,
        category: data.category,
        variables: data.variables,
        isActive: data.isActive
      });

      // Reload with associations
      await template.reload({
        include: [
          {
            model: User,
            as: 'createdBy',
            attributes: ['id', 'firstName', 'lastName', 'role']
          }
        ]
      });

      logger.info(`Message template updated: ${template.name} (${template.id})`);
      return template;
    } catch (error) {
      logger.error('Error updating message template:', error);
      throw handleSequelizeError(error as Error);
    }
  }

  /**
   * Delete message template
   * @param id - Template ID
   * @returns Success status
   */
  static async deleteMessageTemplate(id: string): Promise<{ success: boolean }> {
    try {
      const template = await MessageTemplate.findByPk(id);

      if (!template) {
        throw new Error('Message template not found');
      }

      const templateName = template.name;
      await template.destroy();

      logger.info(`Message template deleted: ${templateName} (${id})`);
      return { success: true };
    } catch (error) {
      throw handleSequelizeError(error as Error);
    }
  }

  /**
   * Get a single message template by ID
   * @param id - Template ID
   * @returns Message template
   */
  static async getMessageTemplateById(id: string): Promise<MessageTemplate | null> {
    try {
      const template = await MessageTemplate.findByPk(id, {
        include: [
          {
            model: User,
            as: 'createdBy',
            attributes: ['id', 'firstName', 'lastName', 'role']
          }
        ]
      });

      return template;
    } catch (error) {
      throw handleSequelizeError(error as Error);
    }
  }

  /**
   * Get a single message by ID
   * @param id - Message ID
   * @returns Message with details
   */
  static async getMessageById(id: string): Promise<Message | null> {
    try {
      const message = await Message.findByPk(id, {
        include: [
          {
            model: User,
            as: 'sender',
            attributes: ['id', 'firstName', 'lastName', 'role']
          },
          {
            model: MessageTemplate,
            as: 'template',
            attributes: ['id', 'name', 'type']
          },
          {
            model: MessageDelivery,
            as: 'deliveries'
          }
        ]
      });

      return message;
    } catch (error) {
      logger.error('Error fetching message:', error);
      throw handleSequelizeError(error as Error);
    }
  }

  /**
   * Private helper method for actual message sending via different channels
   * Mock implementation - replace with actual service integrations
   * @param channel - Communication channel
   * @param data - Message data
   * @returns External ID from the service provider
   */
  private static async sendViaChannel(
    channel: MessageType,
    data: {
      to: string;
      subject?: string;
      content: string;
      priority: MessagePriority;
      attachments?: string[];
    }
  ): Promise<{ externalId: string }> {
    // Mock implementation - replace with actual service integrations
    switch (channel) {
      case MessageType.EMAIL:
        // Integrate with SendGrid, AWS SES, or similar
        logger.info(`Email would be sent to ${data.to}: ${data.subject}`);
        return { externalId: `email_${Date.now()}` };

      case MessageType.SMS:
        // Integrate with Twilio, AWS SNS, or similar
        logger.info(`SMS would be sent to ${data.to}: ${data.content.substring(0, 50)}`);
        return { externalId: `sms_${Date.now()}` };

      case MessageType.PUSH_NOTIFICATION:
        // Integrate with FCM, APNS, or similar
        logger.info(`Push notification would be sent to ${data.to}: ${data.content.substring(0, 50)}`);
        return { externalId: `push_${Date.now()}` };

      case MessageType.VOICE:
        // Integrate with Twilio Voice, AWS Connect, or similar
        logger.info(`Voice call would be made to ${data.to}: ${data.content.substring(0, 50)}`);
        return { externalId: `voice_${Date.now()}` };

      default:
        throw new Error(`Unsupported communication channel: ${channel}`);
    }
  }
}