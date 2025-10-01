import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export interface CreateMessageTemplateData {
  name: string;
  subject?: string;
  content: string;
  type: 'EMAIL' | 'SMS' | 'PUSH_NOTIFICATION' | 'VOICE';
  category: 'EMERGENCY' | 'HEALTH_UPDATE' | 'APPOINTMENT_REMINDER' | 'MEDICATION_REMINDER' | 'GENERAL' | 'INCIDENT_NOTIFICATION' | 'COMPLIANCE';
  variables?: string[]; // Available template variables like {studentName}, {date}, etc.
  isActive?: boolean;
  createdBy: string;
}

export interface CreateMessageData {
  recipients: Array<{
    type: 'STUDENT' | 'EMERGENCY_CONTACT' | 'PARENT' | 'NURSE' | 'ADMIN';
    id: string;
    email?: string;
    phoneNumber?: string;
    pushToken?: string;
  }>;
  channels: ('EMAIL' | 'SMS' | 'PUSH_NOTIFICATION' | 'VOICE')[];
  subject?: string;
  content: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category: 'EMERGENCY' | 'HEALTH_UPDATE' | 'APPOINTMENT_REMINDER' | 'MEDICATION_REMINDER' | 'GENERAL' | 'INCIDENT_NOTIFICATION' | 'COMPLIANCE';
  templateId?: string;
  scheduledAt?: Date;
  attachments?: string[];
  senderId: string;
}

export interface MessageDeliveryStatus {
  messageId: string;
  recipientId: string;
  channel: 'EMAIL' | 'SMS' | 'PUSH_NOTIFICATION' | 'VOICE';
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED' | 'BOUNCED';
  sentAt?: Date;
  deliveredAt?: Date;
  failureReason?: string;
  externalId?: string; // ID from third-party service (Twilio, SendGrid, etc.)
}

export interface BroadcastMessageData {
  audience: {
    grades?: string[];
    nurseIds?: string[];
    studentIds?: string[];
    includeParents?: boolean;
    includeEmergencyContacts?: boolean;
  };
  channels: ('EMAIL' | 'SMS' | 'PUSH_NOTIFICATION' | 'VOICE')[];
  subject?: string;
  content: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category: 'EMERGENCY' | 'HEALTH_UPDATE' | 'APPOINTMENT_REMINDER' | 'MEDICATION_REMINDER' | 'GENERAL' | 'INCIDENT_NOTIFICATION' | 'COMPLIANCE';
  senderId: string;
  scheduledAt?: Date;
}

export interface MessageFilters {
  senderId?: string;
  category?: string;
  priority?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export class CommunicationService {
  /**
   * Create message template
   */
  static async createMessageTemplate(data: CreateMessageTemplateData) {
    try {
      // Verify creator exists
      const creator = await prisma.user.findUnique({
        where: { id: data.createdBy }
      });

      if (!creator) {
        throw new Error('Creator not found');
      }

      const template = await prisma.messageTemplate.create({
        data,
        include: {
          createdByUser: {
            select: {
              firstName: true,
              lastName: true,
              role: true
            }
          }
        }
      });

      logger.info(`Message template created: ${template.name} (${template.type}) by ${creator.firstName} ${creator.lastName}`);
      return template;
    } catch (error) {
      logger.error('Error creating message template:', error);
      throw error;
    }
  }

  /**
   * Get message templates
   */
  static async getMessageTemplates(
    type?: 'EMAIL' | 'SMS' | 'PUSH_NOTIFICATION' | 'VOICE',
    category?: string,
    isActive: boolean = true
  ) {
    try {
      const whereClause: any = { isActive };
      
      if (type) {
        whereClause.type = type;
      }
      
      if (category) {
        whereClause.category = category;
      }

      const templates = await prisma.messageTemplate.findMany({
        where: whereClause,
        include: {
          createdByUser: {
            select: {
              firstName: true,
              lastName: true,
              role: true
            }
          }
        },
        orderBy: [
          { category: 'asc' },
          { name: 'asc' }
        ]
      });

      return templates;
    } catch (error) {
      logger.error('Error fetching message templates:', error);
      throw error;
    }
  }

  /**
   * Send message to specific recipients
   */
  static async sendMessage(data: CreateMessageData) {
    try {
      // Verify sender exists
      const sender = await prisma.user.findUnique({
        where: { id: data.senderId }
      });

      if (!sender) {
        throw new Error('Sender not found');
      }

      // Create message record
      const message = await prisma.message.create({
        data: {
          subject: data.subject,
          content: data.content,
          priority: data.priority,
          category: data.category,
          templateId: data.templateId,
          scheduledAt: data.scheduledAt,
          attachments: data.attachments || [],
          senderId: data.senderId,
          recipientCount: data.recipients.length
        }
      });

      // Process each recipient and channel combination
      const deliveryStatuses: MessageDeliveryStatus[] = [];

      for (const recipient of data.recipients) {
        for (const channel of data.channels) {
          // Validate recipient has required contact info for channel
          let canSend = false;
          
          switch (channel) {
            case 'EMAIL':
              canSend = !!recipient.email;
              break;
            case 'SMS':
            case 'VOICE':
              canSend = !!recipient.phoneNumber;
              break;
            case 'PUSH_NOTIFICATION':
              canSend = !!recipient.pushToken;
              break;
          }

          if (!canSend) {
            deliveryStatuses.push({
              messageId: message.id,
              recipientId: recipient.id,
              channel,
              status: 'FAILED',
              failureReason: `Missing ${channel.toLowerCase()} contact information`
            });
            continue;
          }

          // Create delivery record
          const delivery = await prisma.messageDelivery.create({
            data: {
              messageId: message.id,
              recipientId: recipient.id,
              recipientType: recipient.type,
              channel,
              status: data.scheduledAt ? 'PENDING' : 'SENT',
              contactInfo: channel === 'EMAIL' ? recipient.email : 
                          (channel === 'SMS' || channel === 'VOICE') ? recipient.phoneNumber :
                          channel === 'PUSH_NOTIFICATION' ? recipient.pushToken : null
            }
          });

          // If not scheduled, send immediately
          if (!data.scheduledAt) {
            try {
              const result = await this.sendViaChannel(channel, {
                to: channel === 'EMAIL' ? recipient.email! : 
                    (channel === 'SMS' || channel === 'VOICE') ? recipient.phoneNumber! :
                    recipient.pushToken!,
                subject: data.subject,
                content: data.content,
                priority: data.priority,
                attachments: data.attachments
              });

              await prisma.messageDelivery.update({
                where: { id: delivery.id },
                data: {
                  status: 'DELIVERED',
                  sentAt: new Date(),
                  deliveredAt: new Date(),
                  externalId: result.externalId
                }
              });

              deliveryStatuses.push({
                messageId: message.id,
                recipientId: recipient.id,
                channel,
                status: 'DELIVERED',
                sentAt: new Date(),
                deliveredAt: new Date(),
                externalId: result.externalId
              });
            } catch (error) {
              await prisma.messageDelivery.update({
                where: { id: delivery.id },
                data: {
                  status: 'FAILED',
                  failureReason: (error as Error).message
                }
              });

              deliveryStatuses.push({
                messageId: message.id,
                recipientId: recipient.id,
                channel,
                status: 'FAILED',
                failureReason: (error as Error).message
              });
            }
          } else {
            deliveryStatuses.push({
              messageId: message.id,
              recipientId: recipient.id,
              channel,
              status: 'PENDING'
            });
          }
        }
      }

      logger.info(`Message sent: ${message.id} to ${data.recipients.length} recipients via ${data.channels.join(', ')}`);
      
      return {
        message,
        deliveryStatuses
      };
    } catch (error) {
      logger.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Send broadcast message to multiple audiences
   */
  static async sendBroadcastMessage(data: BroadcastMessageData) {
    try {
      // Build recipient list based on audience criteria
      const recipients = [];

      // Get students based on criteria
      if (data.audience.grades || data.audience.nurseIds || data.audience.studentIds) {
        const studentWhereClause: any = { isActive: true };
        
        if (data.audience.grades?.length) {
          studentWhereClause.grade = { in: data.audience.grades };
        }
        
        if (data.audience.nurseIds?.length) {
          studentWhereClause.nurseId = { in: data.audience.nurseIds };
        }
        
        if (data.audience.studentIds?.length) {
          studentWhereClause.id = { in: data.audience.studentIds };
        }

        const students = await prisma.student.findMany({
          where: studentWhereClause,
          include: {
            emergencyContacts: {
              where: { isActive: true },
              orderBy: { priority: 'asc' }
            }
          }
        });

        // Add emergency contacts if requested
        if (data.audience.includeEmergencyContacts || data.audience.includeParents) {
          for (const student of students) {
            for (const contact of student.emergencyContacts) {
              recipients.push({
                type: 'EMERGENCY_CONTACT' as const,
                id: contact.id,
                email: contact.email,
                phoneNumber: contact.phoneNumber
              });
            }
          }
        }
      }

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
      throw error;
    }
  }

  /**
   * Get messages with filters
   */
  static async getMessages(
    page: number = 1,
    limit: number = 20,
    filters: MessageFilters = {}
  ) {
    try {
      const skip = (page - 1) * limit;
      
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
          whereClause.createdAt.gte = filters.dateFrom;
        }
        if (filters.dateTo) {
          whereClause.createdAt.lte = filters.dateTo;
        }
      }

      const [messages, total] = await Promise.all([
        prisma.message.findMany({
          where: whereClause,
          skip,
          take: limit,
          include: {
            sender: {
              select: {
                firstName: true,
                lastName: true,
                role: true
              }
            },
            template: {
              select: {
                name: true,
                type: true
              }
            },
            _count: {
              select: {
                deliveries: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.message.count({ where: whereClause })
      ]);

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
   * Get message delivery status
   */
  static async getMessageDeliveryStatus(messageId: string) {
    try {
      const deliveries = await prisma.messageDelivery.findMany({
        where: { messageId },
        orderBy: [
          { recipientType: 'asc' },
          { channel: 'asc' }
        ]
      });

      const summary = {
        total: deliveries.length,
        pending: deliveries.filter((d: any) => d.status === 'PENDING').length,
        sent: deliveries.filter((d: any) => d.status === 'SENT').length,
        delivered: deliveries.filter((d: any) => d.status === 'DELIVERED').length,
        failed: deliveries.filter((d: any) => d.status === 'FAILED').length,
        bounced: deliveries.filter((d: any) => d.status === 'BOUNCED').length
      };

      return {
        deliveries,
        summary
      };
    } catch (error) {
      logger.error('Error fetching message delivery status:', error);
      throw error;
    }
  }

  /**
   * Process scheduled messages
   */
  static async processScheduledMessages() {
    try {
      const now = new Date();
      const pendingMessages = await prisma.message.findMany({
        where: {
          scheduledAt: {
            lte: now
          },
          deliveries: {
            some: {
              status: 'PENDING'
            }
          }
        },
        include: {
          deliveries: {
            where: {
              status: 'PENDING'
            }
          }
        }
      });

      let processedCount = 0;

      for (const message of pendingMessages) {
        for (const delivery of message.deliveries) {
          try {
            const result = await this.sendViaChannel(delivery.channel as any, {
              to: delivery.contactInfo!,
              subject: message.subject,
              content: message.content,
              priority: message.priority as any
            });

            await prisma.messageDelivery.update({
              where: { id: delivery.id },
              data: {
                status: 'DELIVERED',
                sentAt: new Date(),
                deliveredAt: new Date(),
                externalId: result.externalId
              }
            });

            processedCount++;
          } catch (error) {
            await prisma.messageDelivery.update({
              where: { id: delivery.id },
              data: {
                status: 'FAILED',
                failureReason: (error as Error).message
              }
            });
          }
        }
      }

      logger.info(`Processed ${processedCount} scheduled messages`);
      return processedCount;
    } catch (error) {
      logger.error('Error processing scheduled messages:', error);
      throw error;
    }
  }

  /**
   * Get communication statistics
   */
  static async getCommunicationStatistics(dateFrom?: Date, dateTo?: Date) {
    try {
      const whereClause: any = {};
      
      if (dateFrom || dateTo) {
        whereClause.createdAt = {};
        if (dateFrom) {
          whereClause.createdAt.gte = dateFrom;
        }
        if (dateTo) {
          whereClause.createdAt.lte = dateTo;
        }
      }

      const [categoryStats, priorityStats, channelStats, totalMessages] = await Promise.all([
        prisma.message.groupBy({
          by: ['category'],
          where: whereClause,
          _count: { category: true }
        }),
        prisma.message.groupBy({
          by: ['priority'],
          where: whereClause,
          _count: { priority: true }
        }),
        prisma.messageDelivery.groupBy({
          by: ['channel'],
          where: {
            message: whereClause
          },
          _count: { channel: true }
        }),
        prisma.message.count({ where: whereClause })
      ]);

      const deliveryStats = await prisma.messageDelivery.groupBy({
        by: ['status'],
        where: {
          message: whereClause
        },
        _count: { status: true }
      });

      return {
        totalMessages,
        byCategory: categoryStats.reduce((acc: Record<string, number>, curr: any) => {
          acc[curr.category] = curr._count.category;
          return acc;
        }, {}),
        byPriority: priorityStats.reduce((acc: Record<string, number>, curr: any) => {
          acc[curr.priority] = curr._count.priority;
          return acc;
        }, {}),
        byChannel: channelStats.reduce((acc: Record<string, number>, curr: any) => {
          acc[curr.channel] = curr._count.channel;
          return acc;
        }, {}),
        deliveryStatus: deliveryStats.reduce((acc: Record<string, number>, curr: any) => {
          acc[curr.status] = curr._count.status;
          return acc;
        }, {})
      };
    } catch (error) {
      logger.error('Error fetching communication statistics:', error);
      throw error;
    }
  }

  /**
   * Send emergency alert
   */
  static async sendEmergencyAlert(alert: {
    title: string;
    message: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    audience: 'ALL_STAFF' | 'NURSES_ONLY' | 'SPECIFIC_GROUPS';
    groups?: string[];
    channels: ('EMAIL' | 'SMS' | 'PUSH_NOTIFICATION' | 'VOICE')[];
    senderId: string;
  }) {
    try {
      // Build recipient list based on audience
      let recipients = [];

      if (alert.audience === 'ALL_STAFF') {
        const staff = await prisma.user.findMany({
          where: { isActive: true },
          select: { id: true, email: true }
        });
        recipients = staff.map((s: any) => ({
          type: 'NURSE' as const,
          id: s.id,
          email: s.email
        }));
      } else if (alert.audience === 'NURSES_ONLY') {
        const nurses = await prisma.user.findMany({
          where: { 
            isActive: true,
            role: 'NURSE'
          },
          select: { id: true, email: true }
        });
        recipients = nurses.map((n: any) => ({
          type: 'NURSE' as const,
          id: n.id,
          email: n.email
        }));
      }

      // Send with highest priority
      return await this.sendMessage({
        recipients,
        channels: alert.channels,
        subject: `🚨 EMERGENCY ALERT: ${alert.title}`,
        content: alert.message,
        priority: 'URGENT',
        category: 'EMERGENCY',
        senderId: alert.senderId
      });
    } catch (error) {
      logger.error('Error sending emergency alert:', error);
      throw error;
    }
  }

  // Private helper methods for actual message sending
  private static async sendViaChannel(
    channel: 'EMAIL' | 'SMS' | 'PUSH_NOTIFICATION' | 'VOICE',
    data: {
      to: string;
      subject?: string;
      content: string;
      priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
      attachments?: string[];
    }
  ) {
    // Mock implementation - replace with actual service integrations
    switch (channel) {
      case 'EMAIL':
        logger.info(`Email would be sent to ${data.to}: ${data.subject}`);
        return { externalId: `email_${Date.now()}` };
      
      case 'SMS':
        logger.info(`SMS would be sent to ${data.to}: ${data.content}`);
        return { externalId: `sms_${Date.now()}` };
        
      case 'PUSH_NOTIFICATION':
        logger.info(`Push notification would be sent to ${data.to}: ${data.content}`);
        return { externalId: `push_${Date.now()}` };
        
      case 'VOICE':
        logger.info(`Voice call would be made to ${data.to}: ${data.content}`);
        return { externalId: `voice_${Date.now()}` };
        
      default:
        throw new Error(`Unsupported communication channel: ${channel}`);
    }
  }
}