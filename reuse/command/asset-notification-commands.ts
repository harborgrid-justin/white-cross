/**
 * ASSET NOTIFICATION COMMAND FUNCTIONS
 *
 * Enterprise-grade notification management system providing comprehensive
 * functionality for notification rules engine, multi-channel delivery
 * (email/SMS/push), escalation workflows, notification templates, user
 * preferences, notification history, batch processing, scheduling, and
 * delivery tracking. Competes with Twilio and SendGrid solutions.
 *
 * Features:
 * - Multi-channel notification delivery (email, SMS, push, in-app)
 * - Advanced rules engine with conditions
 * - Escalation workflows and hierarchies
 * - Rich notification templates
 * - User notification preferences
 * - Batch and scheduled notifications
 * - Delivery tracking and analytics
 * - Rate limiting and throttling
 * - Priority-based queuing
 * - Retry mechanisms
 *
 * @module AssetNotificationCommands
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.0.7
 * @requires @nestjs/sequelize ^10.0.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 *
 * @example
 * ```typescript
 * import {
 *   sendNotification,
 *   createNotificationRule,
 *   createEscalationPolicy,
 *   NotificationChannel,
 *   NotificationPriority
 * } from './asset-notification-commands';
 *
 * // Send notification
 * await sendNotification({
 *   recipientIds: ['user-123', 'user-456'],
 *   subject: 'Asset Maintenance Due',
 *   message: 'Asset ABC-123 requires maintenance',
 *   priority: NotificationPriority.HIGH,
 *   channels: [NotificationChannel.EMAIL, NotificationChannel.SMS]
 * });
 *
 * // Create notification rule
 * const rule = await createNotificationRule({
 *   name: 'Maintenance Alert',
 *   eventType: 'maintenance_due',
 *   conditions: { daysUntilDue: { lte: 7 } },
 *   recipients: ['maintenance-team']
 * });
 * ```
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  Index,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  BeforeCreate,
} from 'sequelize-typescript';
import {
  IsString,
  IsNumber,
  IsDate,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsObject,
  IsUUID,
  IsArray,
  IsEmail,
  IsPhoneNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Transaction, Op, WhereOptions, FindOptions } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Notification Channel
 */
export enum NotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  IN_APP = 'in_app',
  WEBHOOK = 'webhook',
  SLACK = 'slack',
  TEAMS = 'teams',
}

/**
 * Notification Priority
 */
export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
  CRITICAL = 'critical',
}

/**
 * Notification Status
 */
export enum NotificationStatus {
  PENDING = 'pending',
  QUEUED = 'queued',
  SENDING = 'sending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  BOUNCED = 'bounced',
  CANCELLED = 'cancelled',
}

/**
 * Template Type
 */
export enum TemplateType {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  IN_APP = 'in_app',
}

/**
 * Event Type
 */
export enum EventType {
  ASSET_CREATED = 'asset_created',
  ASSET_UPDATED = 'asset_updated',
  ASSET_DELETED = 'asset_deleted',
  MAINTENANCE_DUE = 'maintenance_due',
  INSPECTION_DUE = 'inspection_due',
  WARRANTY_EXPIRING = 'warranty_expiring',
  CALIBRATION_DUE = 'calibration_due',
  COMPLIANCE_VIOLATION = 'compliance_violation',
  THRESHOLD_EXCEEDED = 'threshold_exceeded',
  STATUS_CHANGED = 'status_changed',
  LOCATION_CHANGED = 'location_changed',
  CUSTOM = 'custom',
}

/**
 * Escalation Level
 */
export enum EscalationLevel {
  LEVEL_1 = 'level_1',
  LEVEL_2 = 'level_2',
  LEVEL_3 = 'level_3',
  LEVEL_4 = 'level_4',
  EXECUTIVE = 'executive',
}

/**
 * Notification Data
 */
export interface NotificationData {
  recipientIds: string[];
  subject: string;
  message: string;
  priority: NotificationPriority;
  channels: NotificationChannel[];
  templateId?: string;
  templateData?: Record<string, any>;
  scheduledFor?: Date;
  expiresAt?: Date;
  metadata?: Record<string, any>;
  attachments?: string[];
}

/**
 * Notification Rule Data
 */
export interface NotificationRuleData {
  name: string;
  description?: string;
  eventType: EventType;
  conditions?: Record<string, any>;
  recipients: string[];
  channels: NotificationChannel[];
  templateId?: string;
  priority?: NotificationPriority;
  isActive?: boolean;
  throttleMinutes?: number;
}

/**
 * Template Data
 */
export interface TemplateData {
  name: string;
  description?: string;
  templateType: TemplateType;
  subject?: string;
  body: string;
  variables?: string[];
  isActive?: boolean;
}

/**
 * Escalation Policy Data
 */
export interface EscalationPolicyData {
  name: string;
  description?: string;
  eventType: EventType;
  levels: EscalationLevel[];
  levelRecipients: Record<EscalationLevel, string[]>;
  levelDelayMinutes: Record<EscalationLevel, number>;
  isActive?: boolean;
}

/**
 * User Preference Data
 */
export interface UserPreferenceData {
  userId: string;
  enabledChannels: NotificationChannel[];
  quietHoursStart?: string;
  quietHoursEnd?: string;
  timezone?: string;
  emailFrequency?: string;
  preferences?: Record<string, any>;
}

/**
 * Batch Notification Data
 */
export interface BatchNotificationData {
  recipientIds: string[];
  subject: string;
  message: string;
  channels: NotificationChannel[];
  priority?: NotificationPriority;
  scheduledFor?: Date;
  batchSize?: number;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Notification Model
 */
@Table({
  tableName: 'notifications',
  timestamps: true,
  indexes: [
    { fields: ['recipient_id'] },
    { fields: ['status'] },
    { fields: ['priority'] },
    { fields: ['channel'] },
    { fields: ['scheduled_for'] },
    { fields: ['sent_at'] },
  ],
})
export class Notification extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Recipient user ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  recipientId!: string;

  @ApiProperty({ description: 'Subject' })
  @Column({ type: DataType.STRING(500), allowNull: false })
  subject!: string;

  @ApiProperty({ description: 'Message body' })
  @Column({ type: DataType.TEXT, allowNull: false })
  message!: string;

  @ApiProperty({ description: 'Channel' })
  @Column({ type: DataType.ENUM(...Object.values(NotificationChannel)), allowNull: false })
  @Index
  channel!: NotificationChannel;

  @ApiProperty({ description: 'Priority' })
  @Column({ type: DataType.ENUM(...Object.values(NotificationPriority)), defaultValue: NotificationPriority.MEDIUM })
  @Index
  priority!: NotificationPriority;

  @ApiProperty({ description: 'Status' })
  @Column({ type: DataType.ENUM(...Object.values(NotificationStatus)), defaultValue: NotificationStatus.PENDING })
  @Index
  status!: NotificationStatus;

  @ApiProperty({ description: 'Template ID' })
  @ForeignKey(() => NotificationTemplate)
  @Column({ type: DataType.UUID })
  templateId?: string;

  @ApiProperty({ description: 'Template data' })
  @Column({ type: DataType.JSONB })
  templateData?: Record<string, any>;

  @ApiProperty({ description: 'Scheduled for' })
  @Column({ type: DataType.DATE })
  @Index
  scheduledFor?: Date;

  @ApiProperty({ description: 'Sent at' })
  @Column({ type: DataType.DATE })
  @Index
  sentAt?: Date;

  @ApiProperty({ description: 'Delivered at' })
  @Column({ type: DataType.DATE })
  deliveredAt?: Date;

  @ApiProperty({ description: 'Read at' })
  @Column({ type: DataType.DATE })
  readAt?: Date;

  @ApiProperty({ description: 'Expires at' })
  @Column({ type: DataType.DATE })
  expiresAt?: Date;

  @ApiProperty({ description: 'Retry count' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  retryCount!: number;

  @ApiProperty({ description: 'Max retries' })
  @Column({ type: DataType.INTEGER, defaultValue: 3 })
  maxRetries!: number;

  @ApiProperty({ description: 'Error message' })
  @Column({ type: DataType.TEXT })
  errorMessage?: string;

  @ApiProperty({ description: 'Metadata' })
  @Column({ type: DataType.JSONB })
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'Attachments' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  attachments?: string[];

  @ApiProperty({ description: 'Batch ID' })
  @Column({ type: DataType.UUID })
  batchId?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => NotificationTemplate)
  template?: NotificationTemplate;
}

/**
 * Notification Rule Model
 */
@Table({
  tableName: 'notification_rules',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['name'], unique: true },
    { fields: ['event_type'] },
    { fields: ['is_active'] },
  ],
})
export class NotificationRule extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Rule name' })
  @Column({ type: DataType.STRING(200), unique: true, allowNull: false })
  @Index
  name!: string;

  @ApiProperty({ description: 'Description' })
  @Column({ type: DataType.TEXT })
  description?: string;

  @ApiProperty({ description: 'Event type' })
  @Column({ type: DataType.ENUM(...Object.values(EventType)), allowNull: false })
  @Index
  eventType!: EventType;

  @ApiProperty({ description: 'Conditions' })
  @Column({ type: DataType.JSONB })
  conditions?: Record<string, any>;

  @ApiProperty({ description: 'Recipient user IDs' })
  @Column({ type: DataType.ARRAY(DataType.UUID), allowNull: false })
  recipients!: string[];

  @ApiProperty({ description: 'Notification channels' })
  @Column({ type: DataType.ARRAY(DataType.ENUM(...Object.values(NotificationChannel))), allowNull: false })
  channels!: NotificationChannel[];

  @ApiProperty({ description: 'Template ID' })
  @ForeignKey(() => NotificationTemplate)
  @Column({ type: DataType.UUID })
  templateId?: string;

  @ApiProperty({ description: 'Priority' })
  @Column({ type: DataType.ENUM(...Object.values(NotificationPriority)), defaultValue: NotificationPriority.MEDIUM })
  priority!: NotificationPriority;

  @ApiProperty({ description: 'Is active' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  @Index
  isActive!: boolean;

  @ApiProperty({ description: 'Throttle minutes' })
  @Column({ type: DataType.INTEGER })
  throttleMinutes?: number;

  @ApiProperty({ description: 'Last triggered' })
  @Column({ type: DataType.DATE })
  lastTriggered?: Date;

  @ApiProperty({ description: 'Trigger count' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  triggerCount!: number;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => NotificationTemplate)
  template?: NotificationTemplate;
}

/**
 * Notification Template Model
 */
@Table({
  tableName: 'notification_templates',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['name'], unique: true },
    { fields: ['template_type'] },
    { fields: ['is_active'] },
  ],
})
export class NotificationTemplate extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Template name' })
  @Column({ type: DataType.STRING(200), unique: true, allowNull: false })
  @Index
  name!: string;

  @ApiProperty({ description: 'Description' })
  @Column({ type: DataType.TEXT })
  description?: string;

  @ApiProperty({ description: 'Template type' })
  @Column({ type: DataType.ENUM(...Object.values(TemplateType)), allowNull: false })
  @Index
  templateType!: TemplateType;

  @ApiProperty({ description: 'Subject template' })
  @Column({ type: DataType.STRING(500) })
  subject?: string;

  @ApiProperty({ description: 'Body template' })
  @Column({ type: DataType.TEXT, allowNull: false })
  body!: string;

  @ApiProperty({ description: 'Template variables' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  variables?: string[];

  @ApiProperty({ description: 'Is active' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  @Index
  isActive!: boolean;

  @ApiProperty({ description: 'Version' })
  @Column({ type: DataType.INTEGER, defaultValue: 1 })
  version!: number;

  @ApiProperty({ description: 'Usage count' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  usageCount!: number;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @HasMany(() => Notification)
  notifications?: Notification[];

  @HasMany(() => NotificationRule)
  rules?: NotificationRule[];
}

/**
 * Escalation Policy Model
 */
@Table({
  tableName: 'escalation_policies',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['name'], unique: true },
    { fields: ['event_type'] },
    { fields: ['is_active'] },
  ],
})
export class EscalationPolicy extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Policy name' })
  @Column({ type: DataType.STRING(200), unique: true, allowNull: false })
  @Index
  name!: string;

  @ApiProperty({ description: 'Description' })
  @Column({ type: DataType.TEXT })
  description?: string;

  @ApiProperty({ description: 'Event type' })
  @Column({ type: DataType.ENUM(...Object.values(EventType)), allowNull: false })
  @Index
  eventType!: EventType;

  @ApiProperty({ description: 'Escalation levels' })
  @Column({ type: DataType.ARRAY(DataType.ENUM(...Object.values(EscalationLevel))), allowNull: false })
  levels!: EscalationLevel[];

  @ApiProperty({ description: 'Recipients per level' })
  @Column({ type: DataType.JSONB, allowNull: false })
  levelRecipients!: Record<EscalationLevel, string[]>;

  @ApiProperty({ description: 'Delay per level in minutes' })
  @Column({ type: DataType.JSONB, allowNull: false })
  levelDelayMinutes!: Record<EscalationLevel, number>;

  @ApiProperty({ description: 'Is active' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  @Index
  isActive!: boolean;

  @ApiProperty({ description: 'Trigger count' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  triggerCount!: number;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @HasMany(() => EscalationInstance)
  instances?: EscalationInstance[];
}

/**
 * Escalation Instance Model
 */
@Table({
  tableName: 'escalation_instances',
  timestamps: true,
  indexes: [
    { fields: ['policy_id'] },
    { fields: ['current_level'] },
    { fields: ['is_resolved'] },
    { fields: ['started_at'] },
  ],
})
export class EscalationInstance extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Policy ID' })
  @ForeignKey(() => EscalationPolicy)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  policyId!: string;

  @ApiProperty({ description: 'Triggered by event' })
  @Column({ type: DataType.STRING(100), allowNull: false })
  triggeredBy!: string;

  @ApiProperty({ description: 'Event data' })
  @Column({ type: DataType.JSONB })
  eventData?: Record<string, any>;

  @ApiProperty({ description: 'Current escalation level' })
  @Column({ type: DataType.ENUM(...Object.values(EscalationLevel)), allowNull: false })
  @Index
  currentLevel!: EscalationLevel;

  @ApiProperty({ description: 'Started at' })
  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  @Index
  startedAt!: Date;

  @ApiProperty({ description: 'Next escalation at' })
  @Column({ type: DataType.DATE })
  nextEscalationAt?: Date;

  @ApiProperty({ description: 'Is resolved' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  @Index
  isResolved!: boolean;

  @ApiProperty({ description: 'Resolved at' })
  @Column({ type: DataType.DATE })
  resolvedAt?: Date;

  @ApiProperty({ description: 'Resolved by user ID' })
  @Column({ type: DataType.UUID })
  resolvedBy?: string;

  @ApiProperty({ description: 'Resolution notes' })
  @Column({ type: DataType.TEXT })
  resolutionNotes?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => EscalationPolicy)
  policy?: EscalationPolicy;
}

/**
 * User Notification Preference Model
 */
@Table({
  tableName: 'user_notification_preferences',
  timestamps: true,
  indexes: [
    { fields: ['user_id'], unique: true },
  ],
})
export class UserNotificationPreference extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'User ID' })
  @Column({ type: DataType.UUID, unique: true, allowNull: false })
  @Index
  userId!: string;

  @ApiProperty({ description: 'Enabled channels' })
  @Column({ type: DataType.ARRAY(DataType.ENUM(...Object.values(NotificationChannel))), allowNull: false })
  enabledChannels!: NotificationChannel[];

  @ApiProperty({ description: 'Quiet hours start' })
  @Column({ type: DataType.STRING(10) })
  quietHoursStart?: string;

  @ApiProperty({ description: 'Quiet hours end' })
  @Column({ type: DataType.STRING(10) })
  quietHoursEnd?: string;

  @ApiProperty({ description: 'Timezone' })
  @Column({ type: DataType.STRING(50) })
  timezone?: string;

  @ApiProperty({ description: 'Email frequency' })
  @Column({ type: DataType.STRING(50) })
  emailFrequency?: string;

  @ApiProperty({ description: 'Custom preferences' })
  @Column({ type: DataType.JSONB })
  preferences?: Record<string, any>;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

/**
 * Notification Queue Model
 */
@Table({
  tableName: 'notification_queue',
  timestamps: true,
  indexes: [
    { fields: ['status'] },
    { fields: ['priority'] },
    { fields: ['scheduled_for'] },
    { fields: ['batch_id'] },
  ],
})
export class NotificationQueue extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Notification ID' })
  @ForeignKey(() => Notification)
  @Column({ type: DataType.UUID, allowNull: false })
  notificationId!: string;

  @ApiProperty({ description: 'Status' })
  @Column({ type: DataType.ENUM(...Object.values(NotificationStatus)), defaultValue: NotificationStatus.QUEUED })
  @Index
  status!: NotificationStatus;

  @ApiProperty({ description: 'Priority' })
  @Column({ type: DataType.ENUM(...Object.values(NotificationPriority)), defaultValue: NotificationPriority.MEDIUM })
  @Index
  priority!: NotificationPriority;

  @ApiProperty({ description: 'Scheduled for' })
  @Column({ type: DataType.DATE })
  @Index
  scheduledFor?: Date;

  @ApiProperty({ description: 'Batch ID' })
  @Column({ type: DataType.UUID })
  @Index
  batchId?: string;

  @ApiProperty({ description: 'Attempts' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  attempts!: number;

  @ApiProperty({ description: 'Last attempt at' })
  @Column({ type: DataType.DATE })
  lastAttemptAt?: Date;

  @ApiProperty({ description: 'Next attempt at' })
  @Column({ type: DataType.DATE })
  nextAttemptAt?: Date;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => Notification)
  notification?: Notification;
}

// ============================================================================
// NOTIFICATION FUNCTIONS
// ============================================================================

/**
 * Sends notification
 *
 * @param data - Notification data
 * @param transaction - Optional database transaction
 * @returns Created notifications
 *
 * @example
 * ```typescript
 * const notifications = await sendNotification({
 *   recipientIds: ['user-123', 'user-456'],
 *   subject: 'Critical Alert',
 *   message: 'Asset requires immediate attention',
 *   priority: NotificationPriority.CRITICAL,
 *   channels: [NotificationChannel.EMAIL, NotificationChannel.SMS, NotificationChannel.PUSH],
 *   metadata: { assetId: 'asset-789' }
 * });
 * ```
 */
export async function sendNotification(
  data: NotificationData,
  transaction?: Transaction
): Promise<Notification[]> {
  const notifications: Notification[] = [];

  for (const recipientId of data.recipientIds) {
    // Get user preferences
    const preferences = await getUserPreferences(recipientId);

    // Filter channels based on user preferences
    const enabledChannels = data.channels.filter(channel =>
      !preferences || preferences.enabledChannels.includes(channel)
    );

    // Check quiet hours
    const isQuietHours = preferences && isInQuietHours(preferences);

    for (const channel of enabledChannels) {
      // Skip non-urgent notifications during quiet hours
      if (isQuietHours && data.priority !== NotificationPriority.CRITICAL && data.priority !== NotificationPriority.URGENT) {
        continue;
      }

      const notification = await Notification.create(
        {
          recipientId,
          subject: data.subject,
          message: data.message,
          channel,
          priority: data.priority,
          status: NotificationStatus.PENDING,
          templateId: data.templateId,
          templateData: data.templateData,
          scheduledFor: data.scheduledFor,
          expiresAt: data.expiresAt,
          metadata: data.metadata,
          attachments: data.attachments,
        },
        { transaction }
      );

      // Queue for delivery
      await queueNotification(notification.id, data.priority, data.scheduledFor, transaction);

      notifications.push(notification);
    }
  }

  return notifications;
}

/**
 * Sends batch notification
 *
 * @param data - Batch notification data
 * @param transaction - Optional database transaction
 * @returns Batch ID
 *
 * @example
 * ```typescript
 * const batchId = await sendBatchNotification({
 *   recipientIds: allUsers,
 *   subject: 'System Maintenance',
 *   message: 'Scheduled maintenance on Saturday',
 *   channels: [NotificationChannel.EMAIL],
 *   batchSize: 100
 * });
 * ```
 */
export async function sendBatchNotification(
  data: BatchNotificationData,
  transaction?: Transaction
): Promise<string> {
  const batchId = generateBatchId();
  const batchSize = data.batchSize || 100;

  // Process in batches
  for (let i = 0; i < data.recipientIds.length; i += batchSize) {
    const batch = data.recipientIds.slice(i, i + batchSize);

    await sendNotification({
      recipientIds: batch,
      subject: data.subject,
      message: data.message,
      priority: data.priority || NotificationPriority.MEDIUM,
      channels: data.channels,
      scheduledFor: data.scheduledFor,
    }, transaction);
  }

  return batchId;
}

/**
 * Queues notification for delivery
 *
 * @param notificationId - Notification ID
 * @param priority - Priority
 * @param scheduledFor - Scheduled time
 * @param transaction - Optional database transaction
 * @returns Queue entry
 *
 * @example
 * ```typescript
 * await queueNotification('notification-123', NotificationPriority.HIGH, new Date());
 * ```
 */
export async function queueNotification(
  notificationId: string,
  priority: NotificationPriority,
  scheduledFor?: Date,
  transaction?: Transaction
): Promise<NotificationQueue> {
  const queue = await NotificationQueue.create(
    {
      notificationId,
      priority,
      scheduledFor: scheduledFor || new Date(),
      status: NotificationStatus.QUEUED,
    },
    { transaction }
  );

  return queue;
}

/**
 * Processes notification queue
 *
 * @param limit - Maximum notifications to process
 * @param transaction - Optional database transaction
 * @returns Processed count
 *
 * @example
 * ```typescript
 * const processed = await processNotificationQueue(100);
 * ```
 */
export async function processNotificationQueue(
  limit: number = 100,
  transaction?: Transaction
): Promise<number> {
  const queue = await NotificationQueue.findAll({
    where: {
      status: NotificationStatus.QUEUED,
      scheduledFor: { [Op.lte]: new Date() },
    },
    order: [
      ['priority', 'DESC'],
      ['scheduledFor', 'ASC'],
    ],
    limit,
    include: [{ model: Notification }],
    transaction,
  });

  let processed = 0;

  for (const entry of queue) {
    try {
      await deliverNotification(entry.notificationId, transaction);
      await entry.update({ status: NotificationStatus.SENT }, { transaction });
      processed++;
    } catch (error: any) {
      await entry.update({
        status: NotificationStatus.FAILED,
        attempts: entry.attempts + 1,
        lastAttemptAt: new Date(),
      }, { transaction });
    }
  }

  return processed;
}

/**
 * Delivers notification
 *
 * @param notificationId - Notification ID
 * @param transaction - Optional database transaction
 * @returns Updated notification
 *
 * @example
 * ```typescript
 * await deliverNotification('notification-123');
 * ```
 */
export async function deliverNotification(
  notificationId: string,
  transaction?: Transaction
): Promise<Notification> {
  const notification = await Notification.findByPk(notificationId, { transaction });
  if (!notification) {
    throw new NotFoundException(`Notification ${notificationId} not found`);
  }

  await notification.update({
    status: NotificationStatus.SENDING,
  }, { transaction });

  try {
    // Simulate delivery based on channel
    switch (notification.channel) {
      case NotificationChannel.EMAIL:
        await sendEmail(notification);
        break;
      case NotificationChannel.SMS:
        await sendSMS(notification);
        break;
      case NotificationChannel.PUSH:
        await sendPush(notification);
        break;
      case NotificationChannel.IN_APP:
        // In-app notifications are immediately available
        break;
      default:
        throw new Error(`Unsupported channel: ${notification.channel}`);
    }

    await notification.update({
      status: NotificationStatus.SENT,
      sentAt: new Date(),
    }, { transaction });

    // Increment template usage
    if (notification.templateId) {
      await NotificationTemplate.increment('usageCount', {
        where: { id: notification.templateId },
        transaction,
      });
    }

    return notification;
  } catch (error: any) {
    await notification.update({
      status: NotificationStatus.FAILED,
      errorMessage: error.message,
      retryCount: notification.retryCount + 1,
    }, { transaction });

    throw error;
  }
}

/**
 * Marks notification as read
 *
 * @param notificationId - Notification ID
 * @param transaction - Optional database transaction
 * @returns Updated notification
 *
 * @example
 * ```typescript
 * await markNotificationRead('notification-123');
 * ```
 */
export async function markNotificationRead(
  notificationId: string,
  transaction?: Transaction
): Promise<Notification> {
  const notification = await Notification.findByPk(notificationId, { transaction });
  if (!notification) {
    throw new NotFoundException(`Notification ${notificationId} not found`);
  }

  await notification.update({
    readAt: new Date(),
  }, { transaction });

  return notification;
}

/**
 * Gets user notifications
 *
 * @param userId - User ID
 * @param unreadOnly - Get unread only
 * @param limit - Maximum notifications
 * @returns Notifications
 *
 * @example
 * ```typescript
 * const unread = await getUserNotifications('user-123', true, 50);
 * ```
 */
export async function getUserNotifications(
  userId: string,
  unreadOnly: boolean = false,
  limit: number = 100
): Promise<Notification[]> {
  const where: WhereOptions = { recipientId: userId };

  if (unreadOnly) {
    where.readAt = null;
  }

  return Notification.findAll({
    where,
    order: [['createdAt', 'DESC']],
    limit,
  });
}

// ============================================================================
// NOTIFICATION RULE FUNCTIONS
// ============================================================================

/**
 * Creates notification rule
 *
 * @param data - Rule data
 * @param transaction - Optional database transaction
 * @returns Created rule
 *
 * @example
 * ```typescript
 * const rule = await createNotificationRule({
 *   name: 'Warranty Expiration Alert',
 *   eventType: EventType.WARRANTY_EXPIRING,
 *   conditions: { daysUntilExpiry: { lte: 30 } },
 *   recipients: ['asset-manager-123'],
 *   channels: [NotificationChannel.EMAIL],
 *   priority: NotificationPriority.MEDIUM
 * });
 * ```
 */
export async function createNotificationRule(
  data: NotificationRuleData,
  transaction?: Transaction
): Promise<NotificationRule> {
  const rule = await NotificationRule.create(
    {
      ...data,
      isActive: data.isActive !== false,
    },
    { transaction }
  );

  return rule;
}

/**
 * Evaluates notification rules
 *
 * @param eventType - Event type
 * @param eventData - Event data
 * @param transaction - Optional database transaction
 * @returns Triggered notifications
 *
 * @example
 * ```typescript
 * await evaluateNotificationRules(EventType.MAINTENANCE_DUE, {
 *   assetId: 'asset-123',
 *   dueDate: new Date('2024-12-31'),
 *   daysUntilDue: 7
 * });
 * ```
 */
export async function evaluateNotificationRules(
  eventType: EventType,
  eventData: Record<string, any>,
  transaction?: Transaction
): Promise<Notification[]> {
  const rules = await NotificationRule.findAll({
    where: {
      eventType,
      isActive: true,
    },
    transaction,
  });

  const notifications: Notification[] = [];

  for (const rule of rules) {
    // Check throttling
    if (rule.throttleMinutes && rule.lastTriggered) {
      const minutesSinceLastTrigger = (Date.now() - rule.lastTriggered.getTime()) / (1000 * 60);
      if (minutesSinceLastTrigger < rule.throttleMinutes) {
        continue;
      }
    }

    // Evaluate conditions
    const conditionsMet = evaluateConditions(rule.conditions, eventData);

    if (conditionsMet) {
      // Render template if specified
      let subject = `${eventType} Event`;
      let message = JSON.stringify(eventData);

      if (rule.templateId) {
        const template = await NotificationTemplate.findByPk(rule.templateId, { transaction });
        if (template) {
          subject = renderTemplate(template.subject || '', eventData);
          message = renderTemplate(template.body, eventData);
        }
      }

      // Send notifications
      const sent = await sendNotification({
        recipientIds: rule.recipients,
        subject,
        message,
        priority: rule.priority,
        channels: rule.channels,
        metadata: { eventType, eventData, ruleId: rule.id },
      }, transaction);

      notifications.push(...sent);

      // Update rule
      await rule.update({
        lastTriggered: new Date(),
        triggerCount: rule.triggerCount + 1,
      }, { transaction });
    }
  }

  return notifications;
}

/**
 * Gets active notification rules
 *
 * @param eventType - Optional event type filter
 * @returns Active rules
 *
 * @example
 * ```typescript
 * const rules = await getActiveNotificationRules(EventType.MAINTENANCE_DUE);
 * ```
 */
export async function getActiveNotificationRules(
  eventType?: EventType
): Promise<NotificationRule[]> {
  const where: WhereOptions = { isActive: true };
  if (eventType) {
    where.eventType = eventType;
  }

  return NotificationRule.findAll({
    where,
    order: [['name', 'ASC']],
  });
}

// ============================================================================
// TEMPLATE FUNCTIONS
// ============================================================================

/**
 * Creates notification template
 *
 * @param data - Template data
 * @param transaction - Optional database transaction
 * @returns Created template
 *
 * @example
 * ```typescript
 * const template = await createNotificationTemplate({
 *   name: 'Maintenance Due Template',
 *   templateType: TemplateType.EMAIL,
 *   subject: 'Maintenance Due: {{assetName}}',
 *   body: 'Asset {{assetName}} requires maintenance on {{dueDate}}.',
 *   variables: ['assetName', 'dueDate']
 * });
 * ```
 */
export async function createNotificationTemplate(
  data: TemplateData,
  transaction?: Transaction
): Promise<NotificationTemplate> {
  const template = await NotificationTemplate.create(
    {
      ...data,
      isActive: data.isActive !== false,
    },
    { transaction }
  );

  return template;
}

/**
 * Renders template
 *
 * @param template - Template string
 * @param data - Data to inject
 * @returns Rendered template
 *
 * @example
 * ```typescript
 * const rendered = renderTemplate('Hello {{name}}', { name: 'John' });
 * // Returns: 'Hello John'
 * ```
 */
export function renderTemplate(
  template: string,
  data: Record<string, any>
): string {
  let rendered = template;

  for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    rendered = rendered.replace(regex, String(value));
  }

  return rendered;
}

/**
 * Gets active templates
 *
 * @param templateType - Optional template type filter
 * @returns Active templates
 *
 * @example
 * ```typescript
 * const emailTemplates = await getActiveTemplates(TemplateType.EMAIL);
 * ```
 */
export async function getActiveTemplates(
  templateType?: TemplateType
): Promise<NotificationTemplate[]> {
  const where: WhereOptions = { isActive: true };
  if (templateType) {
    where.templateType = templateType;
  }

  return NotificationTemplate.findAll({
    where,
    order: [['name', 'ASC']],
  });
}

// ============================================================================
// ESCALATION FUNCTIONS
// ============================================================================

/**
 * Creates escalation policy
 *
 * @param data - Policy data
 * @param transaction - Optional database transaction
 * @returns Created policy
 *
 * @example
 * ```typescript
 * const policy = await createEscalationPolicy({
 *   name: 'Critical Asset Escalation',
 *   eventType: EventType.COMPLIANCE_VIOLATION,
 *   levels: [EscalationLevel.LEVEL_1, EscalationLevel.LEVEL_2, EscalationLevel.EXECUTIVE],
 *   levelRecipients: {
 *     level_1: ['manager-123'],
 *     level_2: ['director-456'],
 *     executive: ['ceo-789']
 *   },
 *   levelDelayMinutes: {
 *     level_1: 0,
 *     level_2: 30,
 *     executive: 60
 *   }
 * });
 * ```
 */
export async function createEscalationPolicy(
  data: EscalationPolicyData,
  transaction?: Transaction
): Promise<EscalationPolicy> {
  const policy = await EscalationPolicy.create(
    {
      ...data,
      isActive: data.isActive !== false,
    },
    { transaction }
  );

  return policy;
}

/**
 * Triggers escalation
 *
 * @param policyId - Policy ID
 * @param triggeredBy - Event that triggered escalation
 * @param eventData - Event data
 * @param transaction - Optional database transaction
 * @returns Escalation instance
 *
 * @example
 * ```typescript
 * await triggerEscalation('policy-123', 'compliance-violation', {
 *   assetId: 'asset-456',
 *   violationType: 'safety'
 * });
 * ```
 */
export async function triggerEscalation(
  policyId: string,
  triggeredBy: string,
  eventData: Record<string, any>,
  transaction?: Transaction
): Promise<EscalationInstance> {
  const policy = await EscalationPolicy.findByPk(policyId, { transaction });
  if (!policy) {
    throw new NotFoundException(`Escalation policy ${policyId} not found`);
  }

  if (!policy.isActive) {
    throw new BadRequestException('Escalation policy is not active');
  }

  const firstLevel = policy.levels[0];
  const firstDelay = policy.levelDelayMinutes[firstLevel];

  const instance = await EscalationInstance.create(
    {
      policyId,
      triggeredBy,
      eventData,
      currentLevel: firstLevel,
      startedAt: new Date(),
      nextEscalationAt: new Date(Date.now() + firstDelay * 60 * 1000),
    },
    { transaction }
  );

  // Send notifications for first level
  await sendEscalationNotifications(instance, transaction);

  // Update policy
  await policy.update({
    triggerCount: policy.triggerCount + 1,
  }, { transaction });

  return instance;
}

/**
 * Processes escalations
 *
 * @param transaction - Optional database transaction
 * @returns Processed count
 *
 * @example
 * ```typescript
 * const processed = await processEscalations();
 * ```
 */
export async function processEscalations(
  transaction?: Transaction
): Promise<number> {
  const instances = await EscalationInstance.findAll({
    where: {
      isResolved: false,
      nextEscalationAt: { [Op.lte]: new Date() },
    },
    include: [{ model: EscalationPolicy }],
    transaction,
  });

  let processed = 0;

  for (const instance of instances) {
    const policy = instance.policy!;
    const currentIndex = policy.levels.indexOf(instance.currentLevel);

    if (currentIndex < policy.levels.length - 1) {
      // Escalate to next level
      const nextLevel = policy.levels[currentIndex + 1];
      const nextDelay = policy.levelDelayMinutes[nextLevel];

      await instance.update({
        currentLevel: nextLevel,
        nextEscalationAt: new Date(Date.now() + nextDelay * 60 * 1000),
      }, { transaction });

      await sendEscalationNotifications(instance, transaction);
      processed++;
    }
  }

  return processed;
}

/**
 * Resolves escalation
 *
 * @param instanceId - Instance ID
 * @param userId - User resolving
 * @param notes - Resolution notes
 * @param transaction - Optional database transaction
 * @returns Updated instance
 *
 * @example
 * ```typescript
 * await resolveEscalation('instance-123', 'user-456', 'Issue resolved');
 * ```
 */
export async function resolveEscalation(
  instanceId: string,
  userId: string,
  notes?: string,
  transaction?: Transaction
): Promise<EscalationInstance> {
  const instance = await EscalationInstance.findByPk(instanceId, { transaction });
  if (!instance) {
    throw new NotFoundException(`Escalation instance ${instanceId} not found`);
  }

  await instance.update({
    isResolved: true,
    resolvedAt: new Date(),
    resolvedBy: userId,
    resolutionNotes: notes,
  }, { transaction });

  return instance;
}

/**
 * Sends escalation notifications
 *
 * @param instance - Escalation instance
 * @param transaction - Optional database transaction
 */
async function sendEscalationNotifications(
  instance: EscalationInstance,
  transaction?: Transaction
): Promise<void> {
  const policy = instance.policy!;
  const recipients = policy.levelRecipients[instance.currentLevel];

  await sendNotification({
    recipientIds: recipients,
    subject: `Escalation: ${instance.triggeredBy}`,
    message: `Event escalated to ${instance.currentLevel}`,
    priority: NotificationPriority.URGENT,
    channels: [NotificationChannel.EMAIL, NotificationChannel.SMS],
    metadata: { escalationInstanceId: instance.id },
  }, transaction);
}

// ============================================================================
// USER PREFERENCE FUNCTIONS
// ============================================================================

/**
 * Sets user notification preferences
 *
 * @param data - Preference data
 * @param transaction - Optional database transaction
 * @returns Preference record
 *
 * @example
 * ```typescript
 * await setUserPreferences({
 *   userId: 'user-123',
 *   enabledChannels: [NotificationChannel.EMAIL, NotificationChannel.PUSH],
 *   quietHoursStart: '22:00',
 *   quietHoursEnd: '07:00',
 *   timezone: 'America/New_York'
 * });
 * ```
 */
export async function setUserPreferences(
  data: UserPreferenceData,
  transaction?: Transaction
): Promise<UserNotificationPreference> {
  const [preference] = await UserNotificationPreference.upsert(
    data,
    { transaction }
  );

  return preference;
}

/**
 * Gets user preferences
 *
 * @param userId - User ID
 * @returns User preferences
 *
 * @example
 * ```typescript
 * const prefs = await getUserPreferences('user-123');
 * ```
 */
export async function getUserPreferences(
  userId: string
): Promise<UserNotificationPreference | null> {
  return UserNotificationPreference.findOne({
    where: { userId },
  });
}

/**
 * Checks if in quiet hours
 *
 * @param preferences - User preferences
 * @returns Is in quiet hours
 */
function isInQuietHours(preferences: UserNotificationPreference): boolean {
  if (!preferences.quietHoursStart || !preferences.quietHoursEnd) {
    return false;
  }

  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  return currentTime >= preferences.quietHoursStart && currentTime <= preferences.quietHoursEnd;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Evaluates conditions
 */
function evaluateConditions(
  conditions: Record<string, any> | undefined,
  data: Record<string, any>
): boolean {
  if (!conditions) return true;

  for (const [key, condition] of Object.entries(conditions)) {
    const value = data[key];

    if (typeof condition === 'object') {
      for (const [operator, expected] of Object.entries(condition)) {
        switch (operator) {
          case 'eq':
            if (value !== expected) return false;
            break;
          case 'ne':
            if (value === expected) return false;
            break;
          case 'gt':
            if (!(value > expected)) return false;
            break;
          case 'gte':
            if (!(value >= expected)) return false;
            break;
          case 'lt':
            if (!(value < expected)) return false;
            break;
          case 'lte':
            if (!(value <= expected)) return false;
            break;
          case 'in':
            if (!Array.isArray(expected) || !expected.includes(value)) return false;
            break;
        }
      }
    } else {
      if (value !== condition) return false;
    }
  }

  return true;
}

/**
 * Generates batch ID
 */
function generateBatchId(): string {
  return `batch_${Date.now()}_${Math.random().toString(36).substring(2)}`;
}

/**
 * Simulates sending email
 */
async function sendEmail(notification: Notification): Promise<void> {
  // In real implementation, use email service like SendGrid, SES, etc.
  await new Promise(resolve => setTimeout(resolve, 100));
}

/**
 * Simulates sending SMS
 */
async function sendSMS(notification: Notification): Promise<void> {
  // In real implementation, use SMS service like Twilio
  await new Promise(resolve => setTimeout(resolve, 100));
}

/**
 * Simulates sending push notification
 */
async function sendPush(notification: Notification): Promise<void> {
  // In real implementation, use push service like Firebase, APNS
  await new Promise(resolve => setTimeout(resolve, 100));
}

// ============================================================================
// NOTIFICATION ANALYTICS FUNCTIONS
// ============================================================================

/**
 * Notification Analytics Model
 */
@Table({
  tableName: 'notification_analytics',
  timestamps: true,
  indexes: [
    { fields: ['notification_id'], unique: true },
    { fields: ['template_id'] },
    { fields: ['sent_date'] },
  ],
})
export class NotificationAnalytics extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Notification ID' })
  @ForeignKey(() => Notification)
  @Column({ type: DataType.UUID, unique: true, allowNull: false })
  @Index
  notificationId!: string;

  @ApiProperty({ description: 'Template ID' })
  @Column({ type: DataType.UUID })
  @Index
  templateId?: string;

  @ApiProperty({ description: 'Sent date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  sentDate!: Date;

  @ApiProperty({ description: 'Delivered' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  delivered!: boolean;

  @ApiProperty({ description: 'Opened' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  opened!: boolean;

  @ApiProperty({ description: 'Clicked' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  clicked!: boolean;

  @ApiProperty({ description: 'Bounced' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  bounced!: boolean;

  @ApiProperty({ description: 'Open count' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  openCount!: number;

  @ApiProperty({ description: 'Click count' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  clickCount!: number;

  @ApiProperty({ description: 'First opened at' })
  @Column({ type: DataType.DATE })
  firstOpenedAt?: Date;

  @ApiProperty({ description: 'Last opened at' })
  @Column({ type: DataType.DATE })
  lastOpenedAt?: Date;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => Notification)
  notification?: Notification;
}

/**
 * Tracks notification delivery
 *
 * @param notificationId - Notification ID
 * @param delivered - Delivery status
 * @param transaction - Optional database transaction
 * @returns Analytics record
 *
 * @example
 * ```typescript
 * await trackNotificationDelivery('notification-123', true);
 * ```
 */
export async function trackNotificationDelivery(
  notificationId: string,
  delivered: boolean,
  transaction?: Transaction
): Promise<NotificationAnalytics> {
  const notification = await Notification.findByPk(notificationId, { transaction });
  if (!notification) {
    throw new NotFoundException(`Notification ${notificationId} not found`);
  }

  const [analytics] = await NotificationAnalytics.upsert(
    {
      notificationId,
      templateId: notification.templateId,
      sentDate: notification.sentAt || new Date(),
      delivered,
    },
    { transaction }
  );

  return analytics;
}

/**
 * Tracks notification open
 *
 * @param notificationId - Notification ID
 * @param transaction - Optional database transaction
 * @returns Analytics record
 *
 * @example
 * ```typescript
 * await trackNotificationOpen('notification-123');
 * ```
 */
export async function trackNotificationOpen(
  notificationId: string,
  transaction?: Transaction
): Promise<NotificationAnalytics> {
  const analytics = await NotificationAnalytics.findOne({
    where: { notificationId },
    transaction,
  });

  if (!analytics) {
    throw new NotFoundException(`Analytics for notification ${notificationId} not found`);
  }

  const now = new Date();

  await analytics.update({
    opened: true,
    openCount: analytics.openCount + 1,
    firstOpenedAt: analytics.firstOpenedAt || now,
    lastOpenedAt: now,
  }, { transaction });

  return analytics;
}

/**
 * Gets notification analytics report
 *
 * @param startDate - Start date
 * @param endDate - End date
 * @param templateId - Optional template filter
 * @returns Analytics report
 *
 * @example
 * ```typescript
 * const report = await getNotificationAnalyticsReport(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export async function getNotificationAnalyticsReport(
  startDate: Date,
  endDate: Date,
  templateId?: string
): Promise<Record<string, any>> {
  const where: WhereOptions = {
    sentDate: {
      [Op.between]: [startDate, endDate],
    },
  };

  if (templateId) {
    where.templateId = templateId;
  }

  const analytics = await NotificationAnalytics.findAll({ where });

  const total = analytics.length;
  const delivered = analytics.filter(a => a.delivered).length;
  const opened = analytics.filter(a => a.opened).length;
  const clicked = analytics.filter(a => a.clicked).length;
  const bounced = analytics.filter(a => a.bounced).length;

  return {
    period: { startDate, endDate },
    total,
    delivered,
    deliveryRate: total > 0 ? (delivered / total) * 100 : 0,
    opened,
    openRate: delivered > 0 ? (opened / delivered) * 100 : 0,
    clicked,
    clickRate: opened > 0 ? (clicked / opened) * 100 : 0,
    bounced,
    bounceRate: total > 0 ? (bounced / total) * 100 : 0,
  };
}

// ============================================================================
// NOTIFICATION DIGEST FUNCTIONS
// ============================================================================

/**
 * Notification Digest Model
 */
@Table({
  tableName: 'notification_digests',
  timestamps: true,
  indexes: [
    { fields: ['user_id', 'digest_type', 'period_start'] },
    { fields: ['is_sent'] },
  ],
})
export class NotificationDigest extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'User ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  userId!: string;

  @ApiProperty({ description: 'Digest type' })
  @Column({ type: DataType.STRING(50), allowNull: false })
  @Index
  digestType!: string;

  @ApiProperty({ description: 'Period start' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  periodStart!: Date;

  @ApiProperty({ description: 'Period end' })
  @Column({ type: DataType.DATE, allowNull: false })
  periodEnd!: Date;

  @ApiProperty({ description: 'Notification IDs' })
  @Column({ type: DataType.ARRAY(DataType.UUID), allowNull: false })
  notificationIds!: string[];

  @ApiProperty({ description: 'Is sent' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  @Index
  isSent!: boolean;

  @ApiProperty({ description: 'Sent at' })
  @Column({ type: DataType.DATE })
  sentAt?: Date;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

/**
 * Creates notification digest
 *
 * @param userId - User ID
 * @param digestType - Digest type (daily, weekly)
 * @param periodStart - Period start
 * @param periodEnd - Period end
 * @param transaction - Optional database transaction
 * @returns Created digest
 *
 * @example
 * ```typescript
 * const digest = await createNotificationDigest(
 *   'user-123',
 *   'daily',
 *   new Date('2024-01-01'),
 *   new Date('2024-01-02')
 * );
 * ```
 */
export async function createNotificationDigest(
  userId: string,
  digestType: string,
  periodStart: Date,
  periodEnd: Date,
  transaction?: Transaction
): Promise<NotificationDigest> {
  const notifications = await Notification.findAll({
    where: {
      recipientId: userId,
      createdAt: {
        [Op.between]: [periodStart, periodEnd],
      },
    },
    transaction,
  });

  const digest = await NotificationDigest.create(
    {
      userId,
      digestType,
      periodStart,
      periodEnd,
      notificationIds: notifications.map(n => n.id),
      isSent: false,
    },
    { transaction }
  );

  return digest;
}

/**
 * Sends pending digests
 *
 * @param transaction - Optional database transaction
 * @returns Sent count
 *
 * @example
 * ```typescript
 * const sent = await sendPendingDigests();
 * ```
 */
export async function sendPendingDigests(
  transaction?: Transaction
): Promise<number> {
  const digests = await NotificationDigest.findAll({
    where: {
      isSent: false,
      periodEnd: { [Op.lt]: new Date() },
    },
    transaction,
  });

  let sent = 0;

  for (const digest of digests) {
    // Send digest notification
    await sendNotification({
      recipientIds: [digest.userId],
      subject: `${digest.digestType} Notification Digest`,
      message: `You have ${digest.notificationIds.length} notifications`,
      priority: NotificationPriority.LOW,
      channels: [NotificationChannel.EMAIL],
      metadata: { digestId: digest.id },
    }, transaction);

    await digest.update({
      isSent: true,
      sentAt: new Date(),
    }, { transaction });

    sent++;
  }

  return sent;
}

// ============================================================================
// NOTIFICATION SEARCH FUNCTIONS
// ============================================================================

/**
 * Searches notifications
 *
 * @param userId - User ID
 * @param query - Search query
 * @param filters - Optional filters
 * @param limit - Maximum results
 * @returns Matching notifications
 *
 * @example
 * ```typescript
 * const results = await searchNotifications('user-123', 'maintenance', {
 *   priority: NotificationPriority.HIGH,
 *   startDate: new Date('2024-01-01')
 * });
 * ```
 */
export async function searchNotifications(
  userId: string,
  query: string,
  filters?: {
    priority?: NotificationPriority;
    channel?: NotificationChannel;
    status?: NotificationStatus;
    startDate?: Date;
    endDate?: Date;
  },
  limit: number = 100
): Promise<Notification[]> {
  const where: WhereOptions = {
    recipientId: userId,
    [Op.or]: [
      { subject: { [Op.iLike]: `%${query}%` } },
      { message: { [Op.iLike]: `%${query}%` } },
    ],
  };

  if (filters?.priority) where.priority = filters.priority;
  if (filters?.channel) where.channel = filters.channel;
  if (filters?.status) where.status = filters.status;

  if (filters?.startDate || filters?.endDate) {
    where.createdAt = {};
    if (filters.startDate) {
      (where.createdAt as any)[Op.gte] = filters.startDate;
    }
    if (filters.endDate) {
      (where.createdAt as any)[Op.lte] = filters.endDate;
    }
  }

  return Notification.findAll({
    where,
    order: [['createdAt', 'DESC']],
    limit,
  });
}

// ============================================================================
// BULK NOTIFICATION OPERATIONS
// ============================================================================

/**
 * Marks all notifications as read
 *
 * @param userId - User ID
 * @param transaction - Optional database transaction
 * @returns Updated count
 *
 * @example
 * ```typescript
 * await markAllNotificationsRead('user-123');
 * ```
 */
export async function markAllNotificationsRead(
  userId: string,
  transaction?: Transaction
): Promise<number> {
  const [count] = await Notification.update(
    { readAt: new Date() },
    {
      where: {
        recipientId: userId,
        readAt: null,
      },
      transaction,
    }
  );

  return count;
}

/**
 * Deletes old notifications
 *
 * @param olderThan - Delete notifications older than this date
 * @param transaction - Optional database transaction
 * @returns Deleted count
 *
 * @example
 * ```typescript
 * const deleted = await deleteOldNotifications(new Date('2023-01-01'));
 * ```
 */
export async function deleteOldNotifications(
  olderThan: Date,
  transaction?: Transaction
): Promise<number> {
  const count = await Notification.destroy({
    where: {
      createdAt: { [Op.lt]: olderThan },
      readAt: { [Op.not]: null },
    },
    transaction,
  });

  return count;
}

/**
 * Archives notifications
 *
 * @param userId - User ID
 * @param notificationIds - Notification IDs to archive
 * @param transaction - Optional database transaction
 * @returns Archived count
 *
 * @example
 * ```typescript
 * await archiveNotifications('user-123', ['notif-1', 'notif-2']);
 * ```
 */
export async function archiveNotifications(
  userId: string,
  notificationIds: string[],
  transaction?: Transaction
): Promise<number> {
  const [count] = await Notification.update(
    { metadata: { archived: true } },
    {
      where: {
        id: { [Op.in]: notificationIds },
        recipientId: userId,
      },
      transaction,
    }
  );

  return count;
}

// ============================================================================
// SCHEDULED RECURRING NOTIFICATIONS
// ============================================================================

/**
 * Scheduled Notification Model
 */
@Table({
  tableName: 'scheduled_notifications',
  timestamps: true,
  indexes: [
    { fields: ['name'], unique: true },
    { fields: ['is_active'] },
    { fields: ['next_run_at'] },
  ],
})
export class ScheduledNotification extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Schedule name' })
  @Column({ type: DataType.STRING(200), unique: true, allowNull: false })
  @Index
  name!: string;

  @ApiProperty({ description: 'Description' })
  @Column({ type: DataType.TEXT })
  description?: string;

  @ApiProperty({ description: 'Cron expression' })
  @Column({ type: DataType.STRING(100), allowNull: false })
  cronExpression!: string;

  @ApiProperty({ description: 'Template ID' })
  @ForeignKey(() => NotificationTemplate)
  @Column({ type: DataType.UUID, allowNull: false })
  templateId!: string;

  @ApiProperty({ description: 'Recipient IDs' })
  @Column({ type: DataType.ARRAY(DataType.UUID), allowNull: false })
  recipientIds!: string[];

  @ApiProperty({ description: 'Channels' })
  @Column({ type: DataType.ARRAY(DataType.ENUM(...Object.values(NotificationChannel))), allowNull: false })
  channels!: NotificationChannel[];

  @ApiProperty({ description: 'Is active' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  @Index
  isActive!: boolean;

  @ApiProperty({ description: 'Next run at' })
  @Column({ type: DataType.DATE })
  @Index
  nextRunAt?: Date;

  @ApiProperty({ description: 'Last run at' })
  @Column({ type: DataType.DATE })
  lastRunAt?: Date;

  @ApiProperty({ description: 'Run count' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  runCount!: number;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => NotificationTemplate)
  template?: NotificationTemplate;
}

/**
 * Creates scheduled notification
 *
 * @param name - Schedule name
 * @param cronExpression - Cron expression
 * @param templateId - Template ID
 * @param recipientIds - Recipient IDs
 * @param channels - Notification channels
 * @param transaction - Optional database transaction
 * @returns Created schedule
 *
 * @example
 * ```typescript
 * const schedule = await createScheduledNotification(
 *   'Weekly Report',
 *   '0 9 * * 1',
 *   'template-123',
 *   ['user-1', 'user-2'],
 *   [NotificationChannel.EMAIL]
 * );
 * ```
 */
export async function createScheduledNotification(
  name: string,
  cronExpression: string,
  templateId: string,
  recipientIds: string[],
  channels: NotificationChannel[],
  transaction?: Transaction
): Promise<ScheduledNotification> {
  const schedule = await ScheduledNotification.create(
    {
      name,
      cronExpression,
      templateId,
      recipientIds,
      channels,
      isActive: true,
    },
    { transaction }
  );

  return schedule;
}

/**
 * Processes scheduled notifications
 *
 * @param transaction - Optional database transaction
 * @returns Processed count
 *
 * @example
 * ```typescript
 * const processed = await processScheduledNotifications();
 * ```
 */
export async function processScheduledNotifications(
  transaction?: Transaction
): Promise<number> {
  const schedules = await ScheduledNotification.findAll({
    where: {
      isActive: true,
      nextRunAt: { [Op.lte]: new Date() },
    },
    include: [{ model: NotificationTemplate }],
    transaction,
  });

  let processed = 0;

  for (const schedule of schedules) {
    const template = schedule.template!;

    // Send notifications
    await sendNotification({
      recipientIds: schedule.recipientIds,
      subject: template.subject || 'Scheduled Notification',
      message: template.body,
      priority: NotificationPriority.MEDIUM,
      channels: schedule.channels,
      templateId: schedule.templateId,
      metadata: { scheduleId: schedule.id },
    }, transaction);

    // Update schedule
    await schedule.update({
      lastRunAt: new Date(),
      runCount: schedule.runCount + 1,
      nextRunAt: calculateNextRun(schedule.cronExpression),
    }, { transaction });

    processed++;
  }

  return processed;
}

/**
 * Cancels scheduled notification
 *
 * @param scheduleId - Schedule ID
 * @param transaction - Optional database transaction
 * @returns Updated schedule
 *
 * @example
 * ```typescript
 * await cancelScheduledNotification('schedule-123');
 * ```
 */
export async function cancelScheduledNotification(
  scheduleId: string,
  transaction?: Transaction
): Promise<ScheduledNotification> {
  const schedule = await ScheduledNotification.findByPk(scheduleId, { transaction });
  if (!schedule) {
    throw new NotFoundException(`Scheduled notification ${scheduleId} not found`);
  }

  await schedule.update({ isActive: false }, { transaction });
  return schedule;
}

/**
 * Calculates next run time from cron expression
 */
function calculateNextRun(cronExpression: string): Date {
  // Simplified - in real implementation, use a cron parser library
  return new Date(Date.now() + 24 * 60 * 60 * 1000);
}

// ============================================================================
// WEBHOOK DELIVERY FUNCTIONS
// ============================================================================

/**
 * Sends webhook notification
 *
 * @param url - Webhook URL
 * @param payload - Notification payload
 * @param transaction - Optional database transaction
 * @returns Success status
 *
 * @example
 * ```typescript
 * await sendWebhookNotification('https://api.example.com/webhook', {
 *   event: 'asset.maintenance_due',
 *   assetId: 'asset-123'
 * });
 * ```
 */
export async function sendWebhookNotification(
  url: string,
  payload: Record<string, any>,
  transaction?: Transaction
): Promise<boolean> {
  // In real implementation, make HTTP POST request to webhook URL
  // For now, simplified implementation
  await new Promise(resolve => setTimeout(resolve, 100));
  return true;
}

// ============================================================================
// IN-APP BADGE FUNCTIONS
// ============================================================================

/**
 * Gets unread notification count
 *
 * @param userId - User ID
 * @returns Unread count
 *
 * @example
 * ```typescript
 * const count = await getUnreadNotificationCount('user-123');
 * ```
 */
export async function getUnreadNotificationCount(
  userId: string
): Promise<number> {
  return Notification.count({
    where: {
      recipientId: userId,
      channel: NotificationChannel.IN_APP,
      readAt: null,
    },
  });
}

/**
 * Gets unread count by priority
 *
 * @param userId - User ID
 * @returns Counts by priority
 *
 * @example
 * ```typescript
 * const counts = await getUnreadCountByPriority('user-123');
 * // { critical: 2, high: 5, medium: 10, low: 3 }
 * ```
 */
export async function getUnreadCountByPriority(
  userId: string
): Promise<Record<string, number>> {
  const notifications = await Notification.findAll({
    where: {
      recipientId: userId,
      channel: NotificationChannel.IN_APP,
      readAt: null,
    },
    attributes: ['priority'],
  });

  const counts: Record<string, number> = {};
  notifications.forEach(n => {
    counts[n.priority] = (counts[n.priority] || 0) + 1;
  });

  return counts;
}

// ============================================================================
// EMERGENCY BROADCAST FUNCTIONS
// ============================================================================

/**
 * Sends emergency broadcast
 *
 * @param subject - Subject
 * @param message - Message
 * @param targetUserIds - Target user IDs (or 'all')
 * @param transaction - Optional database transaction
 * @returns Sent notifications
 *
 * @example
 * ```typescript
 * await sendEmergencyBroadcast(
 *   'System Emergency',
 *   'Critical system failure detected',
 *   'all'
 * );
 * ```
 */
export async function sendEmergencyBroadcast(
  subject: string,
  message: string,
  targetUserIds: string[] | 'all',
  transaction?: Transaction
): Promise<Notification[]> {
  // In real implementation, fetch all user IDs if 'all'
  const recipientIds = Array.isArray(targetUserIds) ? targetUserIds : [];

  return sendNotification({
    recipientIds,
    subject,
    message,
    priority: NotificationPriority.CRITICAL,
    channels: [
      NotificationChannel.EMAIL,
      NotificationChannel.SMS,
      NotificationChannel.PUSH,
      NotificationChannel.IN_APP,
    ],
    metadata: { emergency: true },
  }, transaction);
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Models
  Notification,
  NotificationRule,
  NotificationTemplate,
  EscalationPolicy,
  EscalationInstance,
  UserNotificationPreference,
  NotificationQueue,
  NotificationAnalytics,
  NotificationDigest,
  ScheduledNotification,

  // Notification Functions
  sendNotification,
  sendBatchNotification,
  queueNotification,
  processNotificationQueue,
  deliverNotification,
  markNotificationRead,
  getUserNotifications,

  // Notification Rule Functions
  createNotificationRule,
  evaluateNotificationRules,
  getActiveNotificationRules,

  // Template Functions
  createNotificationTemplate,
  renderTemplate,
  getActiveTemplates,

  // Escalation Functions
  createEscalationPolicy,
  triggerEscalation,
  processEscalations,
  resolveEscalation,

  // User Preference Functions
  setUserPreferences,
  getUserPreferences,

  // Analytics Functions
  trackNotificationDelivery,
  trackNotificationOpen,
  getNotificationAnalyticsReport,

  // Digest Functions
  createNotificationDigest,
  sendPendingDigests,

  // Search Functions
  searchNotifications,

  // Bulk Operations
  markAllNotificationsRead,
  deleteOldNotifications,
  archiveNotifications,

  // Scheduled Notifications
  createScheduledNotification,
  processScheduledNotifications,
  cancelScheduledNotification,

  // Webhook Functions
  sendWebhookNotification,

  // Badge Functions
  getUnreadNotificationCount,
  getUnreadCountByPriority,

  // Emergency Functions
  sendEmergencyBroadcast,
};
