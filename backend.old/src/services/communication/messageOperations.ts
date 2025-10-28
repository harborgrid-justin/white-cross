/**
 * LOC: C6BF3D5EA9-MSG
 * WC-SVC-COM-017-MSG | messageOperations.ts - Core Message Operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - database/models
 *   - types.ts
 *   - channelService.ts
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (main service aggregator)
 */

/**
 * WC-SVC-COM-017-MSG | messageOperations.ts - Core Message Operations
 * Purpose: Core message sending and retrieval operations with HIPAA compliance
 * Upstream: database models, validation utilities, channel service | Dependencies: sequelize, joi
 * Downstream: index.ts | Called by: CommunicationService, routes
 * Related: channelService, deliveryOperations, templateOperations
 * Exports: Message sending and retrieval functions
 * Last Updated: 2025-10-18 | File Type: .ts | HIPAA: Contains PHI - compliance validation required
 * Critical Path: Message creation → HIPAA validation → Channel delivery → Status tracking
 * LLM Context: Core message operations - handles individual and transactional message sending
 */

import { Op, Transaction } from 'sequelize';
import { logger } from '../../utils/logger';
import {
  Message,
  MessageTemplate,
  MessageDelivery,
  User,
  sequelize
} from '../../database/models';
import {
  MessageType,
  MessagePriority,
  MessageCategory,
  DeliveryStatus
} from '../../database/types/enums';
import {
  CreateMessageData,
  MessageDeliveryStatusResult,
  MessageFilters
} from './types';
import {
  validateMessageContent,
  validateRecipientForChannel,
  validateScheduledTime,
  validateHIPAACompliance,
  createMessageSchema
} from '../../utils/communicationValidation';
import { sendViaChannel } from './channelService';

/**
 * Send message to specific recipients
 * Uses transaction to ensure atomicity of message creation and delivery tracking
 * @param data - Message data with recipients and channels
 * @returns Created message and delivery statuses
 */
export async function sendMessage(data: CreateMessageData): Promise<{
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
            const result = await sendViaChannel(channel, {
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
    logger.error('Error sending message:', error);
    throw error;
  }
}

/**
 * Get messages with pagination and filters
 * @param page - Page number (1-indexed)
 * @param limit - Number of items per page
 * @param filters - Optional filters
 * @returns Paginated messages with metadata
 */
export async function getMessages(
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
    logger.error('Error fetching messages:', error);
    throw error;
  }
}

/**
 * Get a single message by ID
 * @param id - Message ID
 * @returns Message with details
 */
export async function getMessageById(id: string): Promise<Message | null> {
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
    throw error;
  }
}
