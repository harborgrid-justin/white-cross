import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Index,
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
  id: string;
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

@Table({
  tableName: 'push_notifications',
  timestamps: true,
  indexes: [
    {
      fields: ['status'],
    },
    {
      fields: ['category'],
    },
    {
      fields: ['created_at'],
    },
  ],
})
export class PushNotification extends Model<PushNotificationAttributes> implements PushNotificationAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  // Recipients
  @Column({
    type: DataType.JSON,
    allowNull: false,
    field: 'user_ids',
  })
  userIds: string[];

  @AllowNull
  @Column({
    type: DataType.JSON,
    field: 'device_tokens',
  })
  deviceTokens?: string[];

  // Content
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  body: string;

  @Column({
    type: DataType.ENUM(...Object.values(NotificationCategory)),
    allowNull: false,
  })
  @Index
  category: NotificationCategory;

  @Column({
    type: DataType.ENUM(...Object.values(NotificationPriority)),
    allowNull: false,
    defaultValue: NotificationPriority.NORMAL,
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
    type: DataType.STRING,
    field: 'image_url',
  })
  imageUrl?: string;

  @AllowNull
  @Column({
    type: DataType.STRING,
    field: 'icon_url',
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
    type: DataType.STRING,
    field: 'collapse_key',
  })
  collapseKey?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'require_interaction',
  })
  requireInteraction: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  silent: boolean;

  // Scheduling
  @AllowNull
  @Column({
    type: DataType.DATE,
    field: 'scheduled_for',
  })
  scheduledFor?: Date;

  @AllowNull
  @Column({
    type: DataType.DATE,
    field: 'expires_at',
  })
  expiresAt?: Date;

  // Delivery tracking
  @Column({
    type: DataType.ENUM(...Object.values(NotificationStatus)),
    allowNull: false,
    defaultValue: NotificationStatus.PENDING,
  })
  @Index
  status: NotificationStatus;

  @AllowNull
  @Column({
    type: DataType.DATE,
    field: 'sent_at',
  })
  sentAt?: Date;

  @AllowNull
  @Column({
    type: DataType.DATE,
    field: 'delivered_at',
  })
  deliveredAt?: Date;

  @AllowNull
  @Column({
    type: DataType.DATE,
    field: 'failed_at',
  })
  failedAt?: Date;

  // Delivery results
  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: [],
    field: 'delivery_results',
  })
  deliveryResults: NotificationDeliveryResult[];

  // Statistics
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'total_recipients',
  })
  totalRecipients: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'successful_deliveries',
  })
  successfulDeliveries: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'failed_deliveries',
  })
  failedDeliveries: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'clicked_count',
  })
  clickedCount: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'dismissed_count',
  })
  dismissedCount: number;

  // Retry
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'retry_count',
  })
  retryCount: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 3,
    field: 'max_retries',
  })
  maxRetries: number;

  @AllowNull
  @Column({
    type: DataType.DATE,
    field: 'next_retry_at',
  })
  nextRetryAt?: Date;

  // Metadata
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'created_by',
  })
  createdBy: string;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;
}
