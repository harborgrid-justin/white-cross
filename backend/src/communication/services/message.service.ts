import { Injectable, Logger, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
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
    } as any);

    // Create delivery records
    const deliveryStatuses: any[] = [];
    const channels = data.channels || ['EMAIL'];

    for (const recipient of data.recipients) {
      for (const channel of channels) {
        const delivery = await this.deliveryModel.create({
          recipientType: recipient.type,
          recipientId: recipient.id,
          channel: channel,
          status: data.scheduledAt ? 'PENDING' : 'SENT',
          contactInfo: channel === 'EMAIL' ? recipient.email : recipient.phoneNumber,
          messageId: message.id,
          sentAt: !data.scheduledAt ? new Date() : null,
        } as any);

        deliveryStatuses.push({
          messageId: message.id,
          recipientId: recipient.id,
          channel: channel,
          status: delivery.status,
          sentAt: delivery.sentAt,
        });
      }
    }

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
    let searchWhere: any = {};

    const { rows: messages, count: total } = await this.messageModel.findAndCountAll({
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
      recipients: [{
        type: 'NURSE' as any,
        id: originalMessage.senderId,
        email: undefined,
      }],
      channels: replyData.channels || ['EMAIL'],
      subject: `Re: ${originalMessage.subject || 'Your message'}`,
      content: replyData.content,
      priority: 'MEDIUM' as any,
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
      throw new BadRequestException('Cannot delete messages that have already been sent');
    }

    await message.destroy();
  }
}
