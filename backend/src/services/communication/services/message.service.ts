import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message, MessageDelivery } from '@/database/models';
import { SendMessageDto } from '../dto/send-message.dto';
import { BaseService } from '@/common/base';
import { PaginatedResponse } from '@/database/types/pagination.types';

export interface MessageFilters {
  senderId?: string;
  category?: string;
  priority?: string;
}

@Injectable()
export class MessageService extends BaseService {
  constructor(
    @InjectModel(Message) private messageModel: typeof Message,
    @InjectModel(MessageDelivery) private deliveryModel: typeof MessageDelivery,
  ) {
    super({
      serviceName: 'MessageService',
      tableName: 'messages',
    });
  }

  /**
   * Send message to multiple recipients
   *
   * OPTIMIZATION: Fixed N+1 query problem
   * Before: 1 + N queries (1 for message + N for each delivery) = 101 queries for 100 recipients
   * After: 2 queries (1 for message + 1 bulk create for all deliveries) = 2 queries
   * Performance improvement: ~98% query reduction
   */
  async sendMessage(data: SendMessageDto & { senderId: string }) {
    return this.executeWithLogging('sendMessage', async () => {
      this.validateRequiredField(data.senderId, 'senderId');
      this.validateUUID(data.senderId, 'senderId');
      this.validateRequiredField(data.recipients, 'recipients');

      if (!Array.isArray(data.recipients) || data.recipients.length === 0) {
        throw new BadRequestException('Recipients array cannot be empty');
      }

      this.logInfo(`Sending message to ${data.recipients.length} recipients`);

      // Create message record
      const message = await this.messageModel.create({
        subject: data.subject,
        content: data.content,
        priority: data.priority || 'MEDIUM',
        category: data.category,
        recipientCount: data.recipients.length,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
        attachments: data.attachments || [],
        senderId: data.senderId,
        templateId: data.templateId,
      });

      // OPTIMIZATION: Build all delivery records first, then bulk create instead of N individual creates
      const deliveryRecords: any[] = [];
      const channels = data.channels || ['EMAIL'];
      const sentAt = !data.scheduledAt ? new Date() : null;
      const status = data.scheduledAt ? 'PENDING' : 'SENT';

      for (const recipient of data.recipients) {
        for (const channel of channels) {
          deliveryRecords.push({
            recipientType: recipient.type,
            recipientId: recipient.id,
            channel: channel,
            status: status,
            contactInfo: channel === 'EMAIL' ? recipient.email : recipient.phoneNumber,
            messageId: message.id,
            sentAt: sentAt,
          });
        }
      }

      // Bulk create all deliveries in a single query
      const deliveries = await this.deliveryModel.bulkCreate(deliveryRecords);

      // Build delivery statuses from bulk-created records
      const deliveryStatuses = deliveries.map((delivery) => ({
        messageId: message.id,
        recipientId: delivery.recipientId,
        channel: delivery.channel,
        status: delivery.status,
        sentAt: delivery.sentAt,
      }));

      return {
        message: message.toJSON(),
        deliveryStatuses,
      };
    });
  }

  async getMessages(
    page: number = 1,
    limit: number = 20,
    filters: MessageFilters = {},
  ): Promise<PaginatedResponse<Message>> {
    return this.executeWithLogging('getMessages', async () => {
      const whereClause: any = {};

      if (filters.senderId) {
        this.validateUUID(filters.senderId, 'senderId');
        whereClause.senderId = filters.senderId;
      }
      if (filters.category) whereClause.category = filters.category;
      if (filters.priority) whereClause.priority = filters.priority;

      return this.createPaginatedQuery(this.messageModel, {
        page,
        limit,
        where: whereClause,
        order: [['createdAt', 'DESC']],
      });
    });
  }

  async getInbox(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResponse<MessageDelivery>> {
    return this.executeWithLogging('getInbox', async () => {
      this.validateUUID(userId, 'userId');

      return this.createPaginatedQuery(this.deliveryModel, {
        page,
        limit,
        where: { recipientId: userId },
        include: [{ model: this.messageModel, as: 'message' }],
        order: [['createdAt', 'DESC']],
      });
    });
  }

  async getSentMessages(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResponse<Message>> {
    return this.executeWithLogging('getSentMessages', async () => {
      this.validateUUID(userId, 'userId');
      return this.getMessages(page, limit, { senderId: userId });
    });
  }

  async getMessageById(id: string): Promise<Message> {
    return this.executeWithLogging('getMessageById', async () => {
      this.validateUUID(id, 'message ID');

      return this.findEntityOrFail(this.messageModel, id, 'Message');
    });
  }

  async getMessageDeliveryStatus(id: string) {
    return this.executeWithLogging('getMessageDeliveryStatus', async () => {
      this.validateUUID(id, 'message ID');

      const message = await this.findEntityOrFail(this.messageModel, id, 'Message');

      const deliveries = await this.deliveryModel.findAll({
        where: { messageId: id },
      });

      const summary = {
        total: deliveries.length,
        pending: deliveries.filter((d) => d.status === 'PENDING').length,
        sent: deliveries.filter((d) => d.status === 'SENT').length,
        delivered: deliveries.filter((d) => d.status === 'DELIVERED').length,
        failed: deliveries.filter((d) => d.status === 'FAILED').length,
        bounced: deliveries.filter((d) => d.status === 'BOUNCED').length,
      };

      return {
        deliveries: deliveries.map((d) => d.toJSON()),
        summary,
      };
    });
  }

  async replyToMessage(originalId: string, senderId: string, replyData: any) {
    return this.executeWithLogging('replyToMessage', async () => {
      this.validateUUID(originalId, 'original message ID');
      this.validateUUID(senderId, 'sender ID');

      const originalMessage = await this.findEntityOrFail(
        this.messageModel,
        originalId,
        'Original message',
      );

      // Create reply message to original sender
      return this.sendMessage({
        recipients: [
          {
            type: 'NURSE',
            id: originalMessage.senderId,
            email: undefined,
          },
        ],
        channels: replyData.channels || ['EMAIL'],
        subject: `Re: ${originalMessage.subject || 'Your message'}`,
        content: replyData.content,
        priority: 'MEDIUM',
        category: originalMessage.category,
        senderId,
      });
    });
  }

  async deleteScheduledMessage(id: string, userId: string) {
    return this.executeWithLogging('deleteScheduledMessage', async () => {
      this.validateUUID(id, 'message ID');
      this.validateUUID(userId, 'user ID');

      const message = await this.findEntityOrFail(this.messageModel, id, 'Message');

      if (message.senderId !== userId) {
        throw new ForbiddenException('Not authorized to delete this message');
      }

      if (!message.scheduledAt || message.scheduledAt <= new Date()) {
        throw new BadRequestException('Cannot delete messages that have already been sent');
      }

      await message.destroy();
    });
  }
}
