import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from '../../database/models/message.model';
import { MessageDelivery } from '../../database/models/message-delivery.model';
import { SendMessageDto } from '../dto/send-message.dto';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    @InjectModel(Message) private messageModel: typeof Message,
    @InjectModel(MessageDelivery) private deliveryModel: typeof MessageDelivery,
  ) {}

  /**
   * Send message to multiple recipients
   *
   * OPTIMIZATION: Fixed N+1 query problem
   * Before: 1 + N queries (1 for message + N for each delivery) = 101 queries for 100 recipients
   * After: 2 queries (1 for message + 1 bulk create for all deliveries) = 2 queries
   * Performance improvement: ~98% query reduction
   */
  async sendMessage(data: SendMessageDto & { senderId: string }) {
    this.logger.log(`Sending message to ${data.recipients.length} recipients`);

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
          contactInfo:
            channel === 'EMAIL' ? recipient.email : recipient.phoneNumber,
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
  }

  async getMessages(page: number, limit: number, filters: any) {
    const offset = (page - 1) * limit;
    const where: any = {};

    if (filters.senderId) where.senderId = filters.senderId;
    if (filters.category) where.category = filters.category;
    if (filters.priority) where.priority = filters.priority;

    // Initialize searchWhere as an object, not undefined
    const searchWhere: any = {};

    const { rows: messages, count: total } =
      await this.messageModel.findAndCountAll({
        where,
        offset,
        limit,
        order: [['createdAt', 'DESC']],
      });

    return {
      messages: messages.map((m) => m.toJSON()),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getInbox(userId: string, page: number, limit: number) {
    const offset = (page - 1) * limit;

    const deliveries = await this.deliveryModel.findAll({
      where: { recipientId: userId },
      include: [{ model: Message, as: 'message' }],
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });

    const messages = deliveries.map((d: any) => d.message);

    return {
      messages: messages.map((m: any) => m?.toJSON()).filter(Boolean),
      total: deliveries.length,
      page,
      limit,
    };
  }

  async getSentMessages(userId: string, page: number, limit: number) {
    return this.getMessages(page, limit, { senderId: userId });
  }

  async getMessageById(id: string) {
    const message = await this.messageModel.findByPk(id, {
      include: [{ all: true }],
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return { message: message.toJSON() };
  }

  async getMessageDeliveryStatus(id: string) {
    const message = await this.messageModel.findByPk(id);

    if (!message) {
      throw new NotFoundException('Message not found');
    }

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
  }

  async replyToMessage(originalId: string, senderId: string, replyData: any) {
    const originalMessage = await this.messageModel.findByPk(originalId);

    if (!originalMessage) {
      throw new NotFoundException('Original message not found');
    }

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
  }

  async deleteScheduledMessage(id: string, userId: string) {
    const message = await this.messageModel.findByPk(id);

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.senderId !== userId) {
      throw new ForbiddenException('Not authorized to delete this message');
    }

    if (!message.scheduledAt || message.scheduledAt <= new Date()) {
      throw new BadRequestException(
        'Cannot delete messages that have already been sent',
      );
    }

    await message.destroy();
  }
}
