/**
 * LOC: DOC-NOTIFY-QUEUE-001
 * File: /reuse/document/composites/downstream/notification-queue-services.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *   - ../document-notification-tracking-composite
 *
 * DOWNSTREAM (imported by):
 *   - Email notification handlers
 *   - SMS notification services
 *   - Push notification systems
 *   - Webhook event handlers
 */

/**
 * File: /reuse/document/composites/downstream/notification-queue-services.ts
 * Locator: WC-NOTIFY-QUEUE-001
 * Purpose: Notification Queue Management Services - Asynchronous notification processing and delivery
 *
 * Upstream: Composed from document-notification-tracking-composite
 * Downstream: Email handlers, SMS services, push notifications, webhook handlers
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 11.x, Sequelize 6.x
 * Exports: 15 production-ready functions for notification queue management and delivery
 *
 * LLM Context: Production-grade notification queue system for White Cross healthcare platform.
 * Provides asynchronous notification processing with delivery tracking, retry logic,
 * and support for multiple notification channels. Ensures timely delivery of critical
 * healthcare notifications while maintaining HIPAA compliance.
 */

import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  Model,
  Column,
  Table,
  DataType,
  Index,
  PrimaryKey,
  Default,
  AllowNull,
  Unique,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsObject,
  IsArray,
  IsDate,
  IsEmail,
  IsOptional,
  IsUUID,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Sequelize, Transaction, Op } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Notification channel enumeration
 */
export enum NotificationChannel {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
  WEBHOOK = 'WEBHOOK',
  IN_APP = 'IN_APP',
}

/**
 * Notification status enumeration
 */
export enum NotificationStatus {
  PENDING = 'PENDING',
  QUEUED = 'QUEUED',
  PROCESSING = 'PROCESSING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  RETRYING = 'RETRYING',
  BOUNCED = 'BOUNCED',
  UNSUBSCRIBED = 'UNSUBSCRIBED',
}

/**
 * Notification priority enumeration
 */
export enum NotificationPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/**
 * Notification template interface
 */
export interface NotificationTemplate {
  id: string;
  name: string;
  channel: NotificationChannel;
  subject?: string;
  body: string;
  variables: string[];
  isActive: boolean;
}

/**
 * Notification payload interface
 */
export interface NotificationPayload {
  documentId: string;
  recipient: string;
  channel: NotificationChannel;
  templateId: string;
  variables: Record<string, string | number>;
  priority?: NotificationPriority;
  scheduledFor?: Date;
}

/**
 * Notification queue DTO
 */
export class NotificationQueueDto {
  @ApiProperty({ description: 'Notification queue record identifier' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Associated document identifier' })
  @IsUUID()
  documentId: string;

  @ApiProperty({ description: 'Notification channel' })
  @IsEnum(NotificationChannel)
  channel: NotificationChannel;

  @ApiProperty({ description: 'Current status' })
  @IsEnum(NotificationStatus)
  status: NotificationStatus;

  @ApiProperty({ description: 'Notification priority' })
  @IsEnum(NotificationPriority)
  priority: NotificationPriority;

  @ApiPropertyOptional({ description: 'Recipient email or phone' })
  @IsString()
  recipient?: string;

  @ApiPropertyOptional({ description: 'Notification body' })
  @IsString()
  body?: string;

  @ApiPropertyOptional({ description: 'Sent timestamp' })
  @IsDate()
  sentAt?: Date;

  @ApiPropertyOptional({ description: 'Creation timestamp' })
  @IsDate()
  createdAt?: Date;
}

// ============================================================================
// DATABASE MODELS
// ============================================================================

/**
 * Notification Queue Model - Tracks queued notifications
 */
@Table({
  tableName: 'notification_queue',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    { fields: ['document_id'] },
    { fields: ['status'] },
    { fields: ['channel'] },
    { fields: ['priority'] },
    { fields: ['created_at'] },
    { fields: ['scheduled_for'] },
  ],
})
export class NotificationQueue extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Column(DataType.UUID)
  documentId: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(NotificationChannel)))
  channel: NotificationChannel;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(NotificationStatus)))
  status: NotificationStatus;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(NotificationPriority)))
  priority: NotificationPriority;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  recipient: string;

  @Column(DataType.UUID)
  templateId: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  body: string;

  @Column(DataType.STRING(255))
  subject: string;

  @Column(DataType.JSON)
  templateVariables: Record<string, any>;

  @Column(DataType.DATE)
  scheduledFor: Date;

  @Column(DataType.DATE)
  sentAt: Date;

  @Column(DataType.DATE)
  deliveredAt: Date;

  @Default(0)
  @Column(DataType.INTEGER)
  retryCount: number;

  @Default(0)
  @Column(DataType.INTEGER)
  maxRetries: number;

  @Column(DataType.TEXT)
  failureReason: string;

  @Column(DataType.STRING(100))
  externalId: string;

  @Column(DataType.JSON)
  metadata: Record<string, any>;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt: Date;

  @DeletedAt
  @Column(DataType.DATE)
  deletedAt: Date;
}

/**
 * Notification Template Model - Stores notification templates
 */
@Table({
  tableName: 'notification_templates',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class NotificationTemplateModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(255))
  name: string;

  @Column(DataType.TEXT)
  description: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(NotificationChannel)))
  channel: NotificationChannel;

  @Column(DataType.STRING(255))
  subject: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  body: string;

  @Column(DataType.JSON)
  variables: string[];

  @Default(true)
  @Column(DataType.BOOLEAN)
  isActive: boolean;

  @Column(DataType.JSON)
  metadata: Record<string, any>;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt: Date;

  @DeletedAt
  @Column(DataType.DATE)
  deletedAt: Date;
}

/**
 * Notification Delivery Log Model - Tracks delivery attempts
 */
@Table({
  tableName: 'notification_delivery_logs',
  timestamps: true,
  paranoid: false,
  underscored: true,
})
export class NotificationDeliveryLog extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Column(DataType.UUID)
  queueId: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(NotificationStatus)))
  status: NotificationStatus;

  @Column(DataType.INTEGER)
  httpStatusCode: number;

  @Column(DataType.TEXT)
  response: string;

  @Column(DataType.TEXT)
  error: string;

  @Column(DataType.INTEGER)
  attemptNumber: number;

  @Column(DataType.DATE)
  attemptedAt: Date;

  @Column(DataType.INTEGER)
  durationMs: number;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt: Date;
}

// ============================================================================
// NESTJS SERVICE
// ============================================================================

/**
 * Notification Queue Service
 *
 * Manages notification queue with delivery tracking, retries,
 * and support for multiple notification channels.
 */
@Injectable()
export class NotificationQueueService {
  constructor(private sequelize: Sequelize) {}

  /**
   * Enqueue notification for delivery
   *
   * Adds notification to queue with priority handling,
   * scheduling support, and automatic retry configuration.
   *
   * @param payload - Notification payload
   * @returns Promise with queued notification record
   * @throws BadRequestException when validation fails
   * @throws InternalServerErrorException when queueing fails
   */
  async enqueueNotification(payload: NotificationPayload): Promise<NotificationQueueDto> {
    const transaction = await this.sequelize.transaction();

    try {
      // Validate recipient
      if (!payload.recipient) {
        throw new BadRequestException('Recipient required for notification');
      }

      // Get template
      const template = await NotificationTemplateModel.findByPk(
        payload.templateId,
        { transaction },
      );

      if (!template) {
        throw new NotFoundException('Notification template not found');
      }

      // Render template body
      const body = this.renderTemplate(template.body, payload.variables);

      // Create queue entry
      const notification = await NotificationQueue.create(
        {
          documentId: payload.documentId,
          channel: payload.channel,
          recipient: payload.recipient,
          templateId: payload.templateId,
          body,
          subject: template.subject,
          status: NotificationStatus.PENDING,
          priority: payload.priority || NotificationPriority.NORMAL,
          scheduledFor: payload.scheduledFor,
          templateVariables: payload.variables,
          maxRetries: 3,
        },
        { transaction },
      );

      await transaction.commit();
      return this.mapQueueToDto(notification);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Get next pending notifications to process
   *
   * Retrieves notifications ready for delivery,
   * ordered by priority and creation date.
   *
   * @param limit - Maximum notifications to retrieve
   * @param channel - Optional channel filter
   * @returns Promise with pending notifications
   */
  async getPendingNotifications(
    limit: number = 100,
    channel?: NotificationChannel,
  ): Promise<NotificationQueue[]> {
    const where: any = {
      status: { [Op.in]: [NotificationStatus.PENDING, NotificationStatus.RETRYING] },
      [Op.or]: [
        { scheduledFor: { [Op.lte]: new Date() } },
        { scheduledFor: null },
      ],
    };

    if (channel) {
      where.channel = channel;
    }

    return await NotificationQueue.findAll({
      where,
      order: [
        ['priority', 'DESC'],
        ['createdAt', 'ASC'],
      ],
      limit,
    });
  }

  /**
   * Mark notification as sent
   *
   * Updates notification status to sent with delivery tracking
   * and creates delivery log entry.
   *
   * @param notificationId - Notification queue identifier
   * @param externalId - External provider message ID
   * @returns Promise with updated notification
   * @throws NotFoundException when notification not found
   */
  async markAsSent(
    notificationId: string,
    externalId: string,
  ): Promise<NotificationQueueDto> {
    const transaction = await this.sequelize.transaction();

    try {
      const notification = await NotificationQueue.findByPk(
        notificationId,
        { transaction },
      );

      if (!notification) {
        throw new NotFoundException('Notification not found');
      }

      // Update status
      const updated = await notification.update(
        {
          status: NotificationStatus.SENT,
          sentAt: new Date(),
          externalId,
        },
        { transaction },
      );

      // Create delivery log
      await NotificationDeliveryLog.create(
        {
          queueId: notificationId,
          status: NotificationStatus.SENT,
          attemptNumber: 1,
          attemptedAt: new Date(),
        },
        { transaction },
      );

      await transaction.commit();
      return this.mapQueueToDto(updated);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Mark notification as delivered
   *
   * Updates notification status to delivered with timestamp.
   *
   * @param notificationId - Notification queue identifier
   * @returns Promise with delivered notification
   * @throws NotFoundException when notification not found
   */
  async markAsDelivered(notificationId: string): Promise<NotificationQueueDto> {
    const notification = await NotificationQueue.findByPk(notificationId);

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    const updated = await notification.update({
      status: NotificationStatus.DELIVERED,
      deliveredAt: new Date(),
    });

    return this.mapQueueToDto(updated);
  }

  /**
   * Mark notification as failed
   *
   * Handles delivery failure with retry logic and error tracking.
   *
   * @param notificationId - Notification queue identifier
   * @param error - Error message or details
   * @param httpStatusCode - HTTP status code if applicable
   * @returns Promise with updated notification
   * @throws NotFoundException when notification not found
   */
  async markAsFailed(
    notificationId: string,
    error: string,
    httpStatusCode?: number,
  ): Promise<NotificationQueueDto> {
    const transaction = await this.sequelize.transaction();

    try {
      const notification = await NotificationQueue.findByPk(
        notificationId,
        { transaction },
      );

      if (!notification) {
        throw new NotFoundException('Notification not found');
      }

      // Increment retry count
      const newRetryCount = notification.retryCount + 1;
      const shouldRetry = newRetryCount < notification.maxRetries;

      // Create delivery log
      await NotificationDeliveryLog.create(
        {
          queueId: notificationId,
          status: shouldRetry ? NotificationStatus.RETRYING : NotificationStatus.FAILED,
          httpStatusCode,
          error,
          attemptNumber: newRetryCount,
          attemptedAt: new Date(),
        },
        { transaction },
      );

      // Update notification status
      const updated = await notification.update(
        {
          status: shouldRetry ? NotificationStatus.RETRYING : NotificationStatus.FAILED,
          retryCount: newRetryCount,
          failureReason: error,
        },
        { transaction },
      );

      await transaction.commit();
      return this.mapQueueToDto(updated);
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  /**
   * Create notification template
   *
   * Defines reusable notification templates with variables
   * and channel-specific configurations.
   *
   * @param template - Template configuration
   * @returns Promise with created template
   * @throws ConflictException when template name exists
   */
  async createNotificationTemplate(
    template: Partial<NotificationTemplate>,
  ): Promise<NotificationTemplate> {
    const existing = await NotificationTemplateModel.findOne({
      where: { name: template.name },
    });

    if (existing) {
      throw new BadRequestException('Template name already exists');
    }

    const created = await NotificationTemplateModel.create(template as any);

    return {
      id: created.id,
      name: created.name,
      channel: created.channel,
      subject: created.subject,
      body: created.body,
      variables: created.variables || [],
      isActive: created.isActive,
    };
  }

  /**
   * List notification templates
   *
   * Retrieves available notification templates with filtering
   * by channel and active status.
   *
   * @param channel - Optional channel filter
   * @param activeOnly - Only return active templates
   * @returns Promise with template records
   */
  async listNotificationTemplates(
    channel?: NotificationChannel,
    activeOnly: boolean = true,
  ): Promise<NotificationTemplate[]> {
    const where: any = {};

    if (channel) where.channel = channel;
    if (activeOnly) where.isActive = true;

    const templates = await NotificationTemplateModel.findAll({ where });

    return templates.map((t) => ({
      id: t.id,
      name: t.name,
      channel: t.channel,
      subject: t.subject,
      body: t.body,
      variables: t.variables || [],
      isActive: t.isActive,
    }));
  }

  /**
   * Get notification delivery status
   *
   * Retrieves detailed delivery status including logs
   * and retry attempts.
   *
   * @param notificationId - Notification queue identifier
   * @returns Promise with delivery status details
   * @throws NotFoundException when notification not found
   */
  async getDeliveryStatus(
    notificationId: string,
  ): Promise<{
    notification: NotificationQueueDto;
    logs: NotificationDeliveryLog[];
  }> {
    const notification = await NotificationQueue.findByPk(notificationId);

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    const logs = await NotificationDeliveryLog.findAll({
      where: { queueId: notificationId },
      order: [['createdAt', 'DESC']],
    });

    return {
      notification: this.mapQueueToDto(notification),
      logs,
    };
  }

  /**
   * Get notification statistics
   *
   * Returns aggregate statistics for notification queue
   * including delivery rates and channel distribution.
   *
   * @param startDate - Statistics start date
   * @param endDate - Statistics end date
   * @returns Promise with notification statistics
   */
  async getNotificationStatistics(startDate: Date, endDate: Date): Promise<{
    totalNotifications: number;
    deliveredNotifications: number;
    failedNotifications: number;
    pendingNotifications: number;
    deliveryRate: number;
    channelDistribution: Record<NotificationChannel, number>;
    priorityDistribution: Record<NotificationPriority, number>;
  }> {
    const where = {
      createdAt: { [Op.between]: [startDate, endDate] },
    };

    const total = await NotificationQueue.count({ where });
    const delivered = await NotificationQueue.count({
      where: { ...where, status: NotificationStatus.DELIVERED },
    });
    const failed = await NotificationQueue.count({
      where: { ...where, status: NotificationStatus.FAILED },
    });
    const pending = await NotificationQueue.count({
      where: {
        ...where,
        status: { [Op.in]: [NotificationStatus.PENDING, NotificationStatus.RETRYING] },
      },
    });

    const channelStats = await NotificationQueue.findAll({
      attributes: [
        'channel',
        [this.sequelize.fn('COUNT', this.sequelize.col('id')), 'count'],
      ],
      where,
      group: ['channel'],
      raw: true,
    });

    const priorityStats = await NotificationQueue.findAll({
      attributes: [
        'priority',
        [this.sequelize.fn('COUNT', this.sequelize.col('id')), 'count'],
      ],
      where,
      group: ['priority'],
      raw: true,
    });

    const channelDist: Record<NotificationChannel, number> = {
      [NotificationChannel.EMAIL]: 0,
      [NotificationChannel.SMS]: 0,
      [NotificationChannel.PUSH]: 0,
      [NotificationChannel.WEBHOOK]: 0,
      [NotificationChannel.IN_APP]: 0,
    };

    const priorityDist: Record<NotificationPriority, number> = {
      [NotificationPriority.LOW]: 0,
      [NotificationPriority.NORMAL]: 0,
      [NotificationPriority.HIGH]: 0,
      [NotificationPriority.CRITICAL]: 0,
    };

    channelStats.forEach((c: any) => {
      channelDist[c.channel] = parseInt(c.count);
    });

    priorityStats.forEach((p: any) => {
      priorityDist[p.priority] = parseInt(p.count);
    });

    return {
      totalNotifications: total,
      deliveredNotifications: delivered,
      failedNotifications: failed,
      pendingNotifications: pending,
      deliveryRate: total > 0 ? (delivered / total) * 100 : 0,
      channelDistribution: channelDist,
      priorityDistribution: priorityDist,
    };
  }

  /**
   * Render notification template with variables
   *
   * @private
   * @param template - Template body with variable placeholders
   * @param variables - Template variable values
   * @returns Rendered template body
   */
  private renderTemplate(
    template: string,
    variables: Record<string, string | number>,
  ): string {
    let rendered = template;

    Object.entries(variables).forEach(([key, value]) => {
      rendered = rendered.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    });

    return rendered;
  }

  /**
   * Map NotificationQueue model to DTO
   *
   * @private
   * @param queue - Notification queue model instance
   * @returns DTO representation
   */
  private mapQueueToDto(queue: NotificationQueue): NotificationQueueDto {
    return {
      id: queue.id,
      documentId: queue.documentId,
      channel: queue.channel,
      status: queue.status,
      priority: queue.priority,
      recipient: queue.recipient,
      body: queue.body,
      sentAt: queue.sentAt,
      createdAt: queue.createdAt,
    };
  }
}
