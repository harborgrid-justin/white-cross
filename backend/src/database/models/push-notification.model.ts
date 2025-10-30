import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Index
  } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

export enum NotificationPriority {
  CRITICAL = 'CRITICAL',   // Immediate delivery, sound, vibration
  HIGH = 'HIGH',           // High priority, sound
  NORMAL = 'NORMAL',       // Normal delivery
  LOW = 'LOW'              // Low priority, no sound
}

export enum NotificationCategory {
  MEDICATION = 'MEDICATION',
  APPOINTMENT = 'APPOINTMENT',
  INCIDENT = 'INCIDENT',
  SCREENING = 'SCREENING',
  IMMUNIZATION = 'IMMUNIZATION',
  MESSAGE = 'MESSAGE',
  EMERGENCY = 'EMERGENCY',
  REMINDER = 'REMINDER',
  ALERT = 'ALERT',
  SYSTEM = 'SYSTEM'
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  SCHEDULED = 'SCHEDULED',
  SENDING = 'SENDING',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED'
}

export enum DeliveryStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  RATE_LIMITED = 'RATE_LIMITED',
  TIMEOUT = 'TIMEOUT'
}

/**
 * Notification Action Interface
 */
export interface NotificationAction {
  label: string;
  action: string;
  icon?: string;
}

/**
 * Notification Delivery Result Interface
 */
export interface NotificationDeliveryResult {
  platform: string;
  deviceToken: string;
  status: string;
  response?: any;
  error?: string;
  deliveredAt?: Date;
}

export interface PushNotificationAttributes {
  id?: string;
  userIds: string[];
  deviceTokens?: string[];
  title: string;
  body: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  data?: Record<string, string>;
  actions?: NotificationAction[];
  imageUrl?: string;
  iconUrl?: string;
  sound?: string;
  badge?: number;
  ttl?: number;
  collapseKey?: string;
  requireInteraction: boolean;
  silent: boolean;
  scheduledFor?: Date;
  expiresAt?: Date;
  status: NotificationStatus;
  sentAt?: Date;
  deliveredAt?: Date;
  failedAt?: Date;
  deliveryResults: NotificationDeliveryResult[];
  totalRecipients: number;
  successfulDeliveries: number;
  failedDeliveries: number;
  clickedCount: number;
  dismissedCount: number;
  retryCount: number;
  maxRetries: number;
  nextRetryAt?: Date;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PushNotificationCreationAttributes {
  id?: string;
  userIds: string[];
  deviceTokens?: string[];
  title: string;
  body: string;
  category: NotificationCategory;
  priority?: NotificationPriority;
  data?: Record<string, string>;
  actions?: NotificationAction[];
  imageUrl?: string;
  iconUrl?: string;
  sound?: string;
  badge?: number;
  ttl?: number;
  collapseKey?: string;
  requireInteraction?: boolean;
  silent?: boolean;
  scheduledFor?: Date;
  expiresAt?: Date;
  status?: NotificationStatus;
  sentAt?: Date;
  deliveredAt?: Date;
  failedAt?: Date;
  deliveryResults?: NotificationDeliveryResult[];
  totalRecipients?: number;
  successfulDeliveries?: number;
  failedDeliveries?: number;
  clickedCount?: number;
  dismissedCount?: number;
  retryCount?: number;
  maxRetries?: number;
  nextRetryAt?: Date;
  createdBy: string;
}

@Table({
  tableName: 'push_notifications',
  timestamps: true,
  indexes: [
    {
      fields: ['status']
  },
    {
      fields: ['category']
  },
    {
      fields: ['createdAt']
  },
  ]
  })
export class PushNotification extends Model<PushNotificationAttributes, PushNotificationCreationAttributes> implements PushNotificationAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id?: string;

  // Recipients
  @Column({
    type: DataType.JSON,
    allowNull: false
  })
  userIds: string[];

  @AllowNull
  @Column({
    type: DataType.JSON
  })
  deviceTokens?: string[];

  // Content
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  body: string;

  @Column({
    type: DataType.ENUM(...(Object.values(NotificationCategory) as string[])),
    allowNull: false
  })
  @Index
  category: NotificationCategory;

  @Column({
    type: DataType.ENUM(...(Object.values(NotificationPriority) as string[])),
    allowNull: false,
    defaultValue: NotificationPriority.NORMAL
  })
  priority: NotificationPriority;

  // Data payload
  @AllowNull
  @Column(DataType.JSONB)
  data?: Record<string, string>;

  // Actions
  @AllowNull
  @Column(DataType.JSON)
  actions?: NotificationAction[];

  // Presentation
  @AllowNull
  @Column({
    type: DataType.STRING
  })
  imageUrl?: string;

  @AllowNull
  @Column({
    type: DataType.STRING
  })
  iconUrl?: string;

  @AllowNull
  @Column(DataType.STRING)
  sound?: string;

  @AllowNull
  @Column(DataType.INTEGER)
  badge?: number;

  // Behavior
  @AllowNull
  @Column(DataType.INTEGER)
  ttl?: number; // Time to live in seconds

  @AllowNull
  @Column({
    type: DataType.STRING
  })
  collapseKey?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
  requireInteraction: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
  silent: boolean;

  // Scheduling
  @AllowNull
  @Column({
    type: DataType.DATE
  })
  scheduledFor?: Date;

  @AllowNull
  @Column({
    type: DataType.DATE
  })
  expiresAt?: Date;

  // Delivery tracking
  @Column({
    type: DataType.ENUM(...(Object.values(NotificationStatus) as string[])),
    allowNull: false,
    defaultValue: NotificationStatus.PENDING
  })
  @Index
  status: NotificationStatus;

  @AllowNull
  @Column({
    type: DataType.DATE
  })
  sentAt?: Date;

  @AllowNull
  @Column({
    type: DataType.DATE
  })
  deliveredAt?: Date;

  @AllowNull
  @Column({
    type: DataType.DATE
  })
  failedAt?: Date;

  // Delivery results
  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: []
  })
  deliveryResults: NotificationDeliveryResult[];

  // Statistics
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0
  })
  totalRecipients: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0
  })
  successfulDeliveries: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0
  })
  failedDeliveries: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0
  })
  clickedCount: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0
  })
  dismissedCount: number;

  // Retry
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0
  })
  retryCount: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 3
  })
  maxRetries: number;

  @AllowNull
  @Column({
    type: DataType.DATE
  })
  nextRetryAt?: Date;

  // Metadata
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  createdBy: string;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;
}
