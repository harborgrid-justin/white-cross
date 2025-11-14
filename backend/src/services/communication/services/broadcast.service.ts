import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message, MessageDelivery } from '@/database/models';
import { Op } from 'sequelize';

import { BaseService } from '@/common/base';

/**
 * BroadcastService
 *
 * Handles broadcast message creation and management.
 * Broadcasts are messages sent to multiple recipients simultaneously.
 */
@Injectable()
export class BroadcastService extends BaseService {
  constructor(
    @InjectModel(Message) private messageModel: typeof Message,
    @InjectModel(MessageDelivery) private deliveryModel: typeof MessageDelivery,
  ) {
    super('BroadcastService');
  }

  /**
   * Create and send a broadcast message
   */
  async createBroadcast(data: {
    subject: string;
    content: string;
    priority: string;
    category: string;
    channels: string[];
    scheduledAt?: Date;
    senderId: string;
    audience: string;
    recipients: Array<{ type: string; id: string; email?: string; phoneNumber?: string }>;
  }) {
    this.logInfo(`Creating broadcast message: ${data.subject}`);

    if (data.recipients.length === 0) {
      throw new BadRequestException('Broadcast must have at least one recipient');
    }

    // Create broadcast message record
    const message = await this.messageModel.create({
      subject: data.subject,
      content: data.content,
      priority: data.priority as any,
      category: data.category as any,
      recipientCount: data.recipients.length,
      scheduledAt: data.scheduledAt || null,
      attachments: [],
      senderId: data.senderId,
      templateId: null,
    });

    this.logInfo(`Broadcast message created with ID: ${message.id}`);

    // Create delivery records for each recipient and channel
    const deliveryRecords: any[] = [];
    const sentAt = !data.scheduledAt ? new Date() : null;
    const status = data.scheduledAt ? 'PENDING' : 'SENT';

    for (const recipient of data.recipients) {
      for (const channel of data.channels) {
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

    const deliveries = await this.deliveryModel.bulkCreate(deliveryRecords);

    this.logInfo(
      `Created ${deliveries.length} delivery records for ${data.recipients.length} recipients across ${data.channels.length} channels`
    );

    return {
      message: message.toJSON(),
      deliveryStatuses: deliveries.map((d) => ({
        messageId: message.id,
        recipientId: d.recipientId,
        channel: d.channel,
        status: d.status,
        sentAt: d.sentAt,
      })),
    };
  }

  /**
   * List broadcast messages with filtering and pagination
   */
  async listBroadcasts(page: number, limit: number, filters: {
    senderId?: string;
    category?: string;
    priority?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const offset = (page - 1) * limit;
    const where: any = {
      recipientCount: { [Op.gt]: 1 }, // Only messages with multiple recipients
    };

    if (filters.senderId) where.senderId = filters.senderId;
    if (filters.category) where.category = filters.category;
    if (filters.priority) where.priority = filters.priority;

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt[Op.gte] = filters.startDate;
      if (filters.endDate) where.createdAt[Op.lte] = filters.endDate;
    }

    const { rows: messages, count: total } = await this.messageModel.findAndCountAll({
      where,
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });

    return {
      broadcasts: messages.map((m) => m.toJSON()),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * List scheduled broadcasts
   */
  async listScheduled() {
    const scheduledMessages = await this.messageModel.findAll({
      where: {
        scheduledAt: { [Op.gt]: new Date() },
        recipientCount: { [Op.gt]: 1 },
      },
      order: [['scheduledAt', 'ASC']],
    });

    return {
      scheduledBroadcasts: scheduledMessages.map((m) => m.toJSON()),
    };
  }

  /**
   * Get broadcast by ID
   */
  async getBroadcastById(id: string) {
    const broadcast = await this.messageModel.findByPk(id);

    if (!broadcast) {
      throw new NotFoundException('Broadcast not found');
    }

    if (broadcast.recipientCount <= 1) {
      throw new BadRequestException('Message is not a broadcast');
    }

    return { broadcast: broadcast.toJSON() };
  }

  /**
   * Get delivery report for broadcast
   */
  async getDeliveryReport(id: string) {
    const broadcast = await this.messageModel.findByPk(id);

    if (!broadcast) {
      throw new NotFoundException('Broadcast not found');
    }

    const deliveries = await this.deliveryModel.findAll({
      where: { messageId: id },
    });

    // Summary statistics
    const summary = {
      total: deliveries.length,
      pending: deliveries.filter((d) => d.status === 'PENDING').length,
      sent: deliveries.filter((d) => d.status === 'SENT').length,
      delivered: deliveries.filter((d) => d.status === 'DELIVERED').length,
      failed: deliveries.filter((d) => d.status === 'FAILED').length,
      bounced: deliveries.filter((d) => d.status === 'BOUNCED').length,
    };

    // Group by channel
    const byChannel: Record<string, any> = {};
    deliveries.forEach((d) => {
      if (!byChannel[d.channel]) {
        byChannel[d.channel] = { total: 0, sent: 0, delivered: 0, failed: 0 };
      }
      byChannel[d.channel].total++;
      if (d.status === 'SENT' || d.status === 'DELIVERED') {
        byChannel[d.channel].sent++;
      }
      if (d.status === 'DELIVERED') {
        byChannel[d.channel].delivered++;
      }
      if (d.status === 'FAILED' || d.status === 'BOUNCED') {
        byChannel[d.channel].failed++;
      }
    });

    // Group by recipient type
    const byRecipientType: Record<string, any> = {};
    deliveries.forEach((d) => {
      if (!byRecipientType[d.recipientType]) {
        byRecipientType[d.recipientType] = { total: 0, sent: 0, delivered: 0, failed: 0 };
      }
      byRecipientType[d.recipientType].total++;
      if (d.status === 'SENT' || d.status === 'DELIVERED') {
        byRecipientType[d.recipientType].sent++;
      }
      if (d.status === 'DELIVERED') {
        byRecipientType[d.recipientType].delivered++;
      }
      if (d.status === 'FAILED' || d.status === 'BOUNCED') {
        byRecipientType[d.recipientType].failed++;
      }
    });

    return {
      report: {
        messageId: id,
        summary,
        byChannel,
        byRecipientType,
      },
    };
  }

  /**
   * Get recipients for broadcast with pagination
   */
  async getRecipients(id: string, page: number, limit: number) {
    const offset = (page - 1) * limit;

    const { rows: deliveries, count: total } = await this.deliveryModel.findAndCountAll({
      where: { messageId: id },
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });

    return {
      recipients: deliveries.map((d) => ({
        recipientId: d.recipientId,
        recipientType: d.recipientType,
        channel: d.channel,
        status: d.status,
        contactInfo: d.contactInfo,
        sentAt: d.sentAt,
        deliveredAt: d.deliveredAt,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Cancel a scheduled broadcast
   */
  async cancelBroadcast(id: string, userId: string) {
    const broadcast = await this.messageModel.findByPk(id);

    if (!broadcast) {
      throw new NotFoundException('Broadcast not found');
    }

    if (broadcast.senderId !== userId) {
      throw new BadRequestException('Only the sender can cancel this broadcast');
    }

    if (!broadcast.scheduledAt || broadcast.scheduledAt <= new Date()) {
      throw new BadRequestException('Cannot cancel broadcast that has already been sent');
    }

    // Delete the broadcast and its deliveries
    await this.deliveryModel.destroy({ where: { messageId: id } });
    await broadcast.destroy();

    this.logInfo(`Broadcast ${id} cancelled by user ${userId}`);

    return { success: true, message: 'Broadcast cancelled successfully' };
  }

  /**
   * Schedule a broadcast for future delivery
   */
  async scheduleBroadcast(data: {
    subject: string;
    content: string;
    priority: string;
    category: string;
    channels: string[];
    scheduledAt: Date;
    senderId: string;
    recipients: Array<{ type: string; id: string; email?: string; phoneNumber?: string }>;
  }) {
    if (data.scheduledAt <= new Date()) {
      throw new BadRequestException('Scheduled time must be in the future');
    }

    this.logInfo(`Scheduling broadcast for ${data.scheduledAt.toISOString()}`);

    return this.createBroadcast({
      ...data,
      audience: 'SCHEDULED',
    });
  }
}
