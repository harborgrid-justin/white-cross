/**
 * LOC: EDU-COMM-001
 * File: /reuse/education/student-communication-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - ../email-notification-kit.ts (email utilities)
 *   - ../validation-kit.ts (validation utilities)
 *
 * DOWNSTREAM (imported by):
 *   - backend/education/communication/*
 *   - backend/controllers/communication.controller.ts
 *   - backend/services/notification.service.ts
 *   - backend/services/messaging.service.ts
 */

/**
 * File: /reuse/education/student-communication-kit.ts
 * Locator: WC-EDU-COMM-KIT-001
 * Purpose: Education SIS Student Communication System - messaging, notifications, alerts, preferences
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, email-notification-kit, validation-kit
 * Downstream: Communication controllers, notification services, messaging modules, alert systems
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45 production-ready functions for messaging, notifications, alerts, templates, preferences, tracking
 *
 * LLM Context: Production-grade student communication system for education SIS platforms.
 * Provides comprehensive communication management including email notifications, SMS alerts,
 * push notifications, message templates, bulk communications, emergency alerts, parent-teacher messaging,
 * communication preferences, delivery tracking, read receipts, scheduled messages, multi-channel delivery,
 * and communication analytics. Optimized Sequelize queries with N+1 prevention and batch operations.
 */

import {
  Model,
  DataTypes,
  Sequelize,
  Transaction,
  Op,
  QueryTypes,
  WhereOptions,
  FindOptions,
  IncludeOptions,
  literal,
  fn,
  col,
} from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Message type enumeration
 */
export enum MessageType {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  IN_APP = 'in_app',
  VOICE = 'voice',
}

/**
 * Message priority enumeration
 */
export enum MessagePriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
  EMERGENCY = 'emergency',
}

/**
 * Message status enumeration
 */
export enum MessageStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  QUEUED = 'queued',
  SENDING = 'sending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
  BOUNCED = 'bounced',
  CANCELLED = 'cancelled',
}

/**
 * Notification category enumeration
 */
export enum NotificationCategory {
  ACADEMIC = 'academic',
  ATTENDANCE = 'attendance',
  BEHAVIOR = 'behavior',
  HEALTH = 'health',
  EVENT = 'event',
  FINANCIAL = 'financial',
  ADMINISTRATIVE = 'administrative',
  EMERGENCY = 'emergency',
  GENERAL = 'general',
}

/**
 * Alert severity enumeration
 */
export enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

/**
 * Communication channel preference
 */
export enum CommunicationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  PHONE = 'phone',
  IN_APP = 'in_app',
  NONE = 'none',
}

interface MessageData {
  senderId: string;
  recipientType: 'student' | 'parent' | 'teacher' | 'staff' | 'group';
  recipientIds: string[];
  subject: string;
  body: string;
  messageType: MessageType;
  priority: MessagePriority;
  category: NotificationCategory;
  templateId?: string;
  scheduledFor?: Date;
  expiresAt?: Date;
  requiresReadReceipt?: boolean;
  attachments?: string[];
  metadata?: Record<string, any>;
}

interface NotificationData {
  recipientId: string;
  recipientType: 'student' | 'parent' | 'teacher' | 'staff';
  title: string;
  message: string;
  category: NotificationCategory;
  priority: MessagePriority;
  actionUrl?: string;
  actionLabel?: string;
  expiresAt?: Date;
  metadata?: Record<string, any>;
}

interface AlertData {
  alertType: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  affectedUsers: string[];
  schoolId?: string;
  expiresAt?: Date;
  actionRequired: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

interface CommunicationPreferenceData {
  userId: string;
  userType: 'student' | 'parent' | 'teacher' | 'staff';
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  phoneEnabled: boolean;
  preferredChannel: CommunicationChannel;
  categoryPreferences: Record<NotificationCategory, CommunicationChannel[]>;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  timezone: string;
}

interface MessageTemplateData {
  name: string;
  description?: string;
  category: NotificationCategory;
  messageType: MessageType;
  subject?: string;
  bodyTemplate: string;
  variables: string[];
  isActive: boolean;
  schoolId?: string;
  createdBy: string;
}

interface BulkMessageData {
  senderId: string;
  recipientType: 'student' | 'parent' | 'teacher' | 'staff';
  recipientIds: string[];
  subject: string;
  body: string;
  messageType: MessageType;
  priority: MessagePriority;
  category: NotificationCategory;
  templateId?: string;
  scheduledFor?: Date;
  batchSize?: number;
}

interface MessageDeliveryStatus {
  messageId: string;
  recipientId: string;
  status: MessageStatus;
  deliveredAt?: Date;
  readAt?: Date;
  failureReason?: string;
  attempts: number;
}

interface CommunicationAnalytics {
  totalSent: number;
  totalDelivered: number;
  totalRead: number;
  totalFailed: number;
  deliveryRate: number;
  readRate: number;
  averageReadTime: number;
  byChannel: Record<MessageType, number>;
  byCategory: Record<NotificationCategory, number>;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Message model - stores all messages sent through the system
 */
export class Message extends Model {
  public id!: string;
  public senderId!: string;
  public recipientType!: 'student' | 'parent' | 'teacher' | 'staff' | 'group';
  public subject!: string;
  public body!: string;
  public messageType!: MessageType;
  public priority!: MessagePriority;
  public category!: NotificationCategory;
  public status!: MessageStatus;
  public templateId!: string | null;
  public scheduledFor!: Date | null;
  public sentAt!: Date | null;
  public expiresAt!: Date | null;
  public requiresReadReceipt!: boolean;
  public attachments!: string[] | null;
  public metadata!: Record<string, any> | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

/**
 * Initialize Message model
 */
export function initMessageModel(sequelize: Sequelize): typeof Message {
  Message.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      senderId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      recipientType: {
        type: DataTypes.ENUM('student', 'parent', 'teacher', 'staff', 'group'),
        allowNull: false,
      },
      subject: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      messageType: {
        type: DataTypes.ENUM(...Object.values(MessageType)),
        allowNull: false,
      },
      priority: {
        type: DataTypes.ENUM(...Object.values(MessagePriority)),
        allowNull: false,
        defaultValue: MessagePriority.NORMAL,
      },
      category: {
        type: DataTypes.ENUM(...Object.values(NotificationCategory)),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(MessageStatus)),
        allowNull: false,
        defaultValue: MessageStatus.DRAFT,
      },
      templateId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'message_templates',
          key: 'id',
        },
      },
      scheduledFor: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      sentAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      requiresReadReceipt: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      attachments: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
    },
    {
      sequelize,
      tableName: 'messages',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          fields: ['sender_id'],
          name: 'messages_sender_idx',
        },
        {
          fields: ['status', 'scheduled_for'],
          name: 'messages_status_scheduled_idx',
        },
        {
          fields: ['priority', 'status'],
          name: 'messages_priority_status_idx',
        },
        {
          fields: ['category'],
          name: 'messages_category_idx',
        },
        {
          fields: ['sent_at'],
          name: 'messages_sent_at_idx',
        },
        {
          fields: ['created_at'],
          name: 'messages_created_at_idx',
        },
      ],
    }
  );

  return Message;
}

/**
 * MessageRecipient model - tracks individual recipients and delivery status
 */
export class MessageRecipient extends Model {
  public id!: string;
  public messageId!: string;
  public recipientId!: string;
  public recipientType!: 'student' | 'parent' | 'teacher' | 'staff';
  public status!: MessageStatus;
  public deliveredAt!: Date | null;
  public readAt!: Date | null;
  public failureReason!: string | null;
  public attempts!: number;
  public lastAttemptAt!: Date | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

/**
 * Initialize MessageRecipient model
 */
export function initMessageRecipientModel(sequelize: Sequelize): typeof MessageRecipient {
  MessageRecipient.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      messageId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'messages',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      recipientId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      recipientType: {
        type: DataTypes.ENUM('student', 'parent', 'teacher', 'staff'),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(MessageStatus)),
        allowNull: false,
        defaultValue: MessageStatus.QUEUED,
      },
      deliveredAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      readAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      failureReason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      lastAttemptAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'message_recipients',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          fields: ['message_id', 'recipient_id'],
          unique: true,
          name: 'message_recipients_message_recipient_unique',
        },
        {
          fields: ['recipient_id', 'status'],
          name: 'message_recipients_recipient_status_idx',
        },
        {
          fields: ['status', 'last_attempt_at'],
          name: 'message_recipients_status_attempt_idx',
        },
        {
          fields: ['delivered_at'],
          name: 'message_recipients_delivered_idx',
        },
        {
          fields: ['read_at'],
          name: 'message_recipients_read_idx',
        },
      ],
    }
  );

  return MessageRecipient;
}

/**
 * Notification model - in-app notifications
 */
export class Notification extends Model {
  public id!: string;
  public recipientId!: string;
  public recipientType!: 'student' | 'parent' | 'teacher' | 'staff';
  public title!: string;
  public message!: string;
  public category!: NotificationCategory;
  public priority!: MessagePriority;
  public isRead!: boolean;
  public readAt!: Date | null;
  public actionUrl!: string | null;
  public actionLabel!: string | null;
  public expiresAt!: Date | null;
  public metadata!: Record<string, any> | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

/**
 * Initialize Notification model
 */
export function initNotificationModel(sequelize: Sequelize): typeof Notification {
  Notification.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      recipientId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      recipientType: {
        type: DataTypes.ENUM('student', 'parent', 'teacher', 'staff'),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      category: {
        type: DataTypes.ENUM(...Object.values(NotificationCategory)),
        allowNull: false,
      },
      priority: {
        type: DataTypes.ENUM(...Object.values(MessagePriority)),
        allowNull: false,
        defaultValue: MessagePriority.NORMAL,
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      readAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      actionUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      actionLabel: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
    },
    {
      sequelize,
      tableName: 'notifications',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          fields: ['recipient_id', 'is_read'],
          name: 'notifications_recipient_read_idx',
        },
        {
          fields: ['recipient_id', 'created_at'],
          name: 'notifications_recipient_created_idx',
        },
        {
          fields: ['category', 'priority'],
          name: 'notifications_category_priority_idx',
        },
        {
          fields: ['expires_at'],
          name: 'notifications_expires_idx',
        },
      ],
    }
  );

  return Notification;
}

/**
 * Alert model - system-wide alerts
 */
export class Alert extends Model {
  public id!: string;
  public alertType!: string;
  public severity!: AlertSeverity;
  public title!: string;
  public message!: string;
  public schoolId!: string | null;
  public isActive!: boolean;
  public publishedAt!: Date | null;
  public expiresAt!: Date | null;
  public actionRequired!: boolean;
  public actionUrl!: string | null;
  public acknowledgedBy!: string[] | null;
  public metadata!: Record<string, any> | null;
  public createdBy!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

/**
 * Initialize Alert model
 */
export function initAlertModel(sequelize: Sequelize): typeof Alert {
  Alert.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      alertType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      severity: {
        type: DataTypes.ENUM(...Object.values(AlertSeverity)),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      schoolId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'schools',
          key: 'id',
        },
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      publishedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      actionRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      actionUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      acknowledgedBy: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: true,
        defaultValue: [],
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      tableName: 'alerts',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          fields: ['is_active', 'severity'],
          name: 'alerts_active_severity_idx',
        },
        {
          fields: ['school_id', 'is_active'],
          name: 'alerts_school_active_idx',
        },
        {
          fields: ['published_at'],
          name: 'alerts_published_idx',
        },
        {
          fields: ['expires_at'],
          name: 'alerts_expires_idx',
        },
      ],
    }
  );

  return Alert;
}

/**
 * CommunicationPreference model - user communication preferences
 */
export class CommunicationPreference extends Model {
  public id!: string;
  public userId!: string;
  public userType!: 'student' | 'parent' | 'teacher' | 'staff';
  public emailEnabled!: boolean;
  public smsEnabled!: boolean;
  public pushEnabled!: boolean;
  public phoneEnabled!: boolean;
  public preferredChannel!: CommunicationChannel;
  public categoryPreferences!: Record<string, string[]>;
  public quietHoursStart!: string | null;
  public quietHoursEnd!: string | null;
  public timezone!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

/**
 * Initialize CommunicationPreference model
 */
export function initCommunicationPreferenceModel(
  sequelize: Sequelize
): typeof CommunicationPreference {
  CommunicationPreference.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
      },
      userType: {
        type: DataTypes.ENUM('student', 'parent', 'teacher', 'staff'),
        allowNull: false,
      },
      emailEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      smsEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      pushEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      phoneEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      preferredChannel: {
        type: DataTypes.ENUM(...Object.values(CommunicationChannel)),
        allowNull: false,
        defaultValue: CommunicationChannel.EMAIL,
      },
      categoryPreferences: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      quietHoursStart: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      quietHoursEnd: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      timezone: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'America/New_York',
      },
    },
    {
      sequelize,
      tableName: 'communication_preferences',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          fields: ['user_id'],
          unique: true,
          name: 'comm_preferences_user_unique',
        },
        {
          fields: ['user_type'],
          name: 'comm_preferences_user_type_idx',
        },
      ],
    }
  );

  return CommunicationPreference;
}

/**
 * MessageTemplate model - reusable message templates
 */
export class MessageTemplate extends Model {
  public id!: string;
  public name!: string;
  public description!: string | null;
  public category!: NotificationCategory;
  public messageType!: MessageType;
  public subject!: string | null;
  public bodyTemplate!: string;
  public variables!: string[];
  public isActive!: boolean;
  public schoolId!: string | null;
  public createdBy!: string;
  public usageCount!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

/**
 * Initialize MessageTemplate model
 */
export function initMessageTemplateModel(sequelize: Sequelize): typeof MessageTemplate {
  MessageTemplate.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      category: {
        type: DataTypes.ENUM(...Object.values(NotificationCategory)),
        allowNull: false,
      },
      messageType: {
        type: DataTypes.ENUM(...Object.values(MessageType)),
        allowNull: false,
      },
      subject: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      bodyTemplate: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      variables: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      schoolId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'schools',
          key: 'id',
        },
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      usageCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      tableName: 'message_templates',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          fields: ['category', 'is_active'],
          name: 'message_templates_category_active_idx',
        },
        {
          fields: ['school_id'],
          name: 'message_templates_school_idx',
        },
        {
          fields: ['usage_count'],
          name: 'message_templates_usage_idx',
        },
      ],
    }
  );

  return MessageTemplate;
}

// ============================================================================
// MESSAGE SENDING FUNCTIONS
// ============================================================================

/**
 * 1. Creates a new message
 */
export async function createMessage(
  sequelize: Sequelize,
  messageData: MessageData,
  transaction?: Transaction
): Promise<Message> {
  const t = transaction || await sequelize.transaction();

  try {
    // Create message
    const message = await Message.create(
      {
        ...messageData,
        status: messageData.scheduledFor ? MessageStatus.SCHEDULED : MessageStatus.QUEUED,
      } as any,
      { transaction: t }
    );

    // Create recipient records
    const recipientRecords = messageData.recipientIds.map(recipientId => ({
      messageId: message.id,
      recipientId,
      recipientType: messageData.recipientType === 'group' ? 'student' : messageData.recipientType,
      status: MessageStatus.QUEUED,
      attempts: 0,
    }));

    await MessageRecipient.bulkCreate(recipientRecords as any[], { transaction: t });

    if (!transaction) await t.commit();
    return message;
  } catch (error) {
    if (!transaction) await t.rollback();
    throw error;
  }
}

/**
 * 2. Sends an email notification
 */
export async function sendEmailNotification(
  sequelize: Sequelize,
  recipientId: string,
  subject: string,
  body: string,
  category: NotificationCategory = NotificationCategory.GENERAL,
  priority: MessagePriority = MessagePriority.NORMAL,
  senderId?: string,
  transaction?: Transaction
): Promise<Message> {
  return createMessage(
    sequelize,
    {
      senderId: senderId || recipientId,
      recipientType: 'parent',
      recipientIds: [recipientId],
      subject,
      body,
      messageType: MessageType.EMAIL,
      priority,
      category,
    },
    transaction
  );
}

/**
 * 3. Sends an SMS alert
 */
export async function sendSmsAlert(
  sequelize: Sequelize,
  recipientId: string,
  message: string,
  priority: MessagePriority = MessagePriority.NORMAL,
  senderId?: string,
  transaction?: Transaction
): Promise<Message> {
  return createMessage(
    sequelize,
    {
      senderId: senderId || recipientId,
      recipientType: 'parent',
      recipientIds: [recipientId],
      subject: 'SMS Alert',
      body: message,
      messageType: MessageType.SMS,
      priority,
      category: NotificationCategory.GENERAL,
    },
    transaction
  );
}

/**
 * 4. Sends a push notification
 */
export async function sendPushNotification(
  sequelize: Sequelize,
  recipientIds: string[],
  title: string,
  message: string,
  category: NotificationCategory = NotificationCategory.GENERAL,
  priority: MessagePriority = MessagePriority.NORMAL,
  senderId?: string,
  transaction?: Transaction
): Promise<Message> {
  return createMessage(
    sequelize,
    {
      senderId: senderId || recipientIds[0],
      recipientType: 'parent',
      recipientIds,
      subject: title,
      body: message,
      messageType: MessageType.PUSH,
      priority,
      category,
    },
    transaction
  );
}

/**
 * 5. Sends a multi-channel message (email, SMS, push)
 */
export async function sendMultiChannelMessage(
  sequelize: Sequelize,
  recipientId: string,
  recipientType: 'student' | 'parent' | 'teacher' | 'staff',
  subject: string,
  body: string,
  category: NotificationCategory,
  priority: MessagePriority = MessagePriority.NORMAL,
  senderId?: string,
  transaction?: Transaction
): Promise<Message[]> {
  const t = transaction || await sequelize.transaction();

  try {
    // Get user preferences
    const preferences = await getUserCommunicationPreferences(sequelize, recipientId);
    const channels = getPreferredChannelsForCategory(preferences, category);

    const messages: Message[] = [];

    for (const channel of channels) {
      let messageType: MessageType;

      switch (channel) {
        case CommunicationChannel.EMAIL:
          messageType = MessageType.EMAIL;
          break;
        case CommunicationChannel.SMS:
          messageType = MessageType.SMS;
          break;
        case CommunicationChannel.PUSH:
          messageType = MessageType.PUSH;
          break;
        default:
          continue;
      }

      const message = await createMessage(
        sequelize,
        {
          senderId: senderId || recipientId,
          recipientType,
          recipientIds: [recipientId],
          subject,
          body,
          messageType,
          priority,
          category,
        },
        t
      );

      messages.push(message);
    }

    if (!transaction) await t.commit();
    return messages;
  } catch (error) {
    if (!transaction) await t.rollback();
    throw error;
  }
}

// ============================================================================
// BULK COMMUNICATION FUNCTIONS
// ============================================================================

/**
 * 6. Sends bulk messages to multiple recipients
 */
export async function sendBulkMessages(
  sequelize: Sequelize,
  bulkData: BulkMessageData,
  transaction?: Transaction
): Promise<{ messageId: string; recipientCount: number }> {
  const t = transaction || await sequelize.transaction();

  try {
    const batchSize = bulkData.batchSize || 100;
    const batches = chunkArray(bulkData.recipientIds, batchSize);

    const message = await Message.create(
      {
        senderId: bulkData.senderId,
        recipientType: bulkData.recipientType,
        subject: bulkData.subject,
        body: bulkData.body,
        messageType: bulkData.messageType,
        priority: bulkData.priority,
        category: bulkData.category,
        templateId: bulkData.templateId,
        scheduledFor: bulkData.scheduledFor,
        status: bulkData.scheduledFor ? MessageStatus.SCHEDULED : MessageStatus.QUEUED,
      } as any,
      { transaction: t }
    );

    // Create recipients in batches
    let totalRecipients = 0;

    for (const batch of batches) {
      const recipientRecords = batch.map(recipientId => ({
        messageId: message.id,
        recipientId,
        recipientType: bulkData.recipientType,
        status: MessageStatus.QUEUED,
        attempts: 0,
      }));

      await MessageRecipient.bulkCreate(recipientRecords as any[], { transaction: t });
      totalRecipients += batch.length;
    }

    if (!transaction) await t.commit();

    return {
      messageId: message.id,
      recipientCount: totalRecipients,
    };
  } catch (error) {
    if (!transaction) await t.rollback();
    throw error;
  }
}

/**
 * 7. Sends class-wide announcement
 */
export async function sendClassAnnouncement(
  sequelize: Sequelize,
  classId: string,
  senderId: string,
  subject: string,
  body: string,
  includeParents: boolean = true,
  priority: MessagePriority = MessagePriority.NORMAL,
  transaction?: Transaction
): Promise<{ students: string; parents?: string }> {
  const t = transaction || await sequelize.transaction();

  try {
    // Get all students in class
    const students = await sequelize.query(
      `SELECT id FROM students WHERE class_id = :classId AND active = true`,
      {
        replacements: { classId },
        type: QueryTypes.SELECT,
        transaction: t,
      }
    );

    const studentIds = (students as any[]).map(s => s.id);

    // Send to students
    const studentMessage = await sendBulkMessages(
      sequelize,
      {
        senderId,
        recipientType: 'student',
        recipientIds: studentIds,
        subject,
        body,
        messageType: MessageType.IN_APP,
        priority,
        category: NotificationCategory.ACADEMIC,
      },
      t
    );

    let parentMessage;

    if (includeParents) {
      // Get parent IDs
      const parents = await sequelize.query(
        `
        SELECT DISTINCT c.id
        FROM contacts c
        INNER JOIN student_contacts sc ON c.id = sc.contact_id
        WHERE sc.student_id = ANY(:studentIds)
          AND c.relationship IN ('parent', 'guardian')
          AND c.active = true
        `,
        {
          replacements: { studentIds },
          type: QueryTypes.SELECT,
          transaction: t,
        }
      );

      const parentIds = (parents as any[]).map(p => p.id);

      parentMessage = await sendBulkMessages(
        sequelize,
        {
          senderId,
          recipientType: 'parent',
          recipientIds: parentIds,
          subject,
          body,
          messageType: MessageType.EMAIL,
          priority,
          category: NotificationCategory.ACADEMIC,
        },
        t
      );
    }

    if (!transaction) await t.commit();

    return {
      students: studentMessage.messageId,
      parents: parentMessage?.messageId,
    };
  } catch (error) {
    if (!transaction) await t.rollback();
    throw error;
  }
}

/**
 * 8. Sends school-wide announcement
 */
export async function sendSchoolAnnouncement(
  sequelize: Sequelize,
  schoolId: string,
  senderId: string,
  subject: string,
  body: string,
  targetAudience: ('students' | 'parents' | 'teachers' | 'staff')[],
  priority: MessagePriority = MessagePriority.NORMAL,
  transaction?: Transaction
): Promise<Record<string, string>> {
  const t = transaction || await sequelize.transaction();

  try {
    const messageIds: Record<string, string> = {};

    for (const audience of targetAudience) {
      let recipientIds: string[] = [];

      if (audience === 'students') {
        const students = await sequelize.query(
          `SELECT id FROM students WHERE school_id = :schoolId AND active = true`,
          {
            replacements: { schoolId },
            type: QueryTypes.SELECT,
            transaction: t,
          }
        );
        recipientIds = (students as any[]).map(s => s.id);
      } else if (audience === 'parents') {
        const parents = await sequelize.query(
          `
          SELECT DISTINCT c.id
          FROM contacts c
          INNER JOIN student_contacts sc ON c.id = sc.contact_id
          INNER JOIN students s ON sc.student_id = s.id
          WHERE s.school_id = :schoolId
            AND c.relationship IN ('parent', 'guardian')
            AND c.active = true
          `,
          {
            replacements: { schoolId },
            type: QueryTypes.SELECT,
            transaction: t,
          }
        );
        recipientIds = (parents as any[]).map(p => p.id);
      } else if (audience === 'teachers') {
        const teachers = await sequelize.query(
          `SELECT id FROM teachers WHERE school_id = :schoolId AND active = true`,
          {
            replacements: { schoolId },
            type: QueryTypes.SELECT,
            transaction: t,
          }
        );
        recipientIds = (teachers as any[]).map(t => t.id);
      } else if (audience === 'staff') {
        const staff = await sequelize.query(
          `SELECT id FROM staff WHERE school_id = :schoolId AND active = true`,
          {
            replacements: { schoolId },
            type: QueryTypes.SELECT,
            transaction: t,
          }
        );
        recipientIds = (staff as any[]).map(s => s.id);
      }

      if (recipientIds.length > 0) {
        const result = await sendBulkMessages(
          sequelize,
          {
            senderId,
            recipientType: audience as any,
            recipientIds,
            subject,
            body,
            messageType: MessageType.EMAIL,
            priority,
            category: NotificationCategory.ADMINISTRATIVE,
          },
          t
        );

        messageIds[audience] = result.messageId;
      }
    }

    if (!transaction) await t.commit();
    return messageIds;
  } catch (error) {
    if (!transaction) await t.rollback();
    throw error;
  }
}

// ============================================================================
// EMERGENCY ALERT FUNCTIONS
// ============================================================================

/**
 * 9. Sends emergency alert to all users
 */
export async function sendEmergencyAlert(
  sequelize: Sequelize,
  alertData: AlertData,
  transaction?: Transaction
): Promise<Alert> {
  const t = transaction || await sequelize.transaction();

  try {
    // Create alert
    const alert = await Alert.create(
      {
        ...alertData,
        severity: AlertSeverity.CRITICAL,
        isActive: true,
        publishedAt: new Date(),
      } as any,
      { transaction: t }
    );

    // Send to all affected users via all channels
    for (const userId of alertData.affectedUsers) {
      await sendMultiChannelMessage(
        sequelize,
        userId,
        'parent',
        alertData.title,
        alertData.message,
        NotificationCategory.EMERGENCY,
        MessagePriority.EMERGENCY,
        undefined,
        t
      );
    }

    if (!transaction) await t.commit();
    return alert;
  } catch (error) {
    if (!transaction) await t.rollback();
    throw error;
  }
}

/**
 * 10. Sends critical safety alert
 */
export async function sendSafetyAlert(
  sequelize: Sequelize,
  schoolId: string,
  title: string,
  message: string,
  actionUrl?: string,
  transaction?: Transaction
): Promise<Alert> {
  const t = transaction || await sequelize.transaction();

  try {
    // Get all users associated with school
    const users = await sequelize.query(
      `
      SELECT DISTINCT user_id
      FROM (
        SELECT id as user_id FROM students WHERE school_id = :schoolId
        UNION
        SELECT id as user_id FROM teachers WHERE school_id = :schoolId
        UNION
        SELECT id as user_id FROM staff WHERE school_id = :schoolId
        UNION
        SELECT c.id as user_id
        FROM contacts c
        INNER JOIN student_contacts sc ON c.id = sc.contact_id
        INNER JOIN students s ON sc.student_id = s.id
        WHERE s.school_id = :schoolId
      ) AS all_users
      `,
      {
        replacements: { schoolId },
        type: QueryTypes.SELECT,
        transaction: t,
      }
    );

    const userIds = (users as any[]).map(u => u.user_id);

    const alert = await sendEmergencyAlert(
      sequelize,
      {
        alertType: 'safety',
        severity: AlertSeverity.CRITICAL,
        title,
        message,
        affectedUsers: userIds,
        schoolId,
        actionRequired: true,
        actionUrl,
        metadata: {
          type: 'safety',
          schoolId,
        },
      },
      t
    );

    if (!transaction) await t.commit();
    return alert;
  } catch (error) {
    if (!transaction) await t.rollback();
    throw error;
  }
}

// ============================================================================
// NOTIFICATION MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * 11. Creates in-app notification
 */
export async function createNotification(
  sequelize: Sequelize,
  notificationData: NotificationData,
  transaction?: Transaction
): Promise<Notification> {
  return Notification.create(notificationData as any, { transaction });
}

/**
 * 12. Gets unread notifications for a user
 */
export async function getUnreadNotifications(
  sequelize: Sequelize,
  recipientId: string,
  limit: number = 50
): Promise<Notification[]> {
  return Notification.findAll({
    where: {
      recipientId,
      isRead: false,
      [Op.or]: [
        { expiresAt: null },
        { expiresAt: { [Op.gt]: new Date() } },
      ],
    },
    order: [
      ['priority', 'DESC'],
      ['createdAt', 'DESC'],
    ],
    limit,
  });
}

/**
 * 13. Marks notification as read
 */
export async function markNotificationAsRead(
  sequelize: Sequelize,
  notificationId: string,
  transaction?: Transaction
): Promise<Notification> {
  const notification = await Notification.findByPk(notificationId, { transaction });

  if (!notification) {
    throw new Error(`Notification not found: ${notificationId}`);
  }

  await notification.update(
    {
      isRead: true,
      readAt: new Date(),
    },
    { transaction }
  );

  return notification;
}

/**
 * 14. Marks all notifications as read for a user
 */
export async function markAllNotificationsAsRead(
  sequelize: Sequelize,
  recipientId: string,
  transaction?: Transaction
): Promise<number> {
  const [affectedCount] = await Notification.update(
    {
      isRead: true,
      readAt: new Date(),
    },
    {
      where: {
        recipientId,
        isRead: false,
      },
      transaction,
    }
  );

  return affectedCount;
}

/**
 * 15. Deletes old notifications
 */
export async function deleteOldNotifications(
  sequelize: Sequelize,
  olderThanDays: number = 30,
  transaction?: Transaction
): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

  return Notification.destroy({
    where: {
      isRead: true,
      readAt: { [Op.lt]: cutoffDate },
    },
    transaction,
  });
}

// ============================================================================
// MESSAGE TEMPLATE FUNCTIONS
// ============================================================================

/**
 * 16. Creates a message template
 */
export async function createMessageTemplate(
  sequelize: Sequelize,
  templateData: MessageTemplateData,
  transaction?: Transaction
): Promise<MessageTemplate> {
  return MessageTemplate.create(templateData as any, { transaction });
}

/**
 * 17. Gets message template by ID
 */
export async function getMessageTemplate(
  sequelize: Sequelize,
  templateId: string
): Promise<MessageTemplate | null> {
  return MessageTemplate.findByPk(templateId);
}

/**
 * 18. Gets templates by category
 */
export async function getTemplatesByCategory(
  sequelize: Sequelize,
  category: NotificationCategory,
  schoolId?: string
): Promise<MessageTemplate[]> {
  const whereClause: WhereOptions = {
    category,
    isActive: true,
  };

  if (schoolId) {
    whereClause[Op.or] = [
      { schoolId },
      { schoolId: null }, // Global templates
    ];
  }

  return MessageTemplate.findAll({
    where: whereClause,
    order: [
      ['usageCount', 'DESC'],
      ['name', 'ASC'],
    ],
  });
}

/**
 * 19. Renders message from template
 */
export async function renderMessageFromTemplate(
  sequelize: Sequelize,
  templateId: string,
  variables: Record<string, any>
): Promise<{ subject: string; body: string }> {
  const template = await MessageTemplate.findByPk(templateId);

  if (!template) {
    throw new Error(`Template not found: ${templateId}`);
  }

  // Simple template rendering (replace {{variable}} with value)
  let subject = template.subject || '';
  let body = template.bodyTemplate;

  for (const [key, value] of Object.entries(variables)) {
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    subject = subject.replace(placeholder, String(value));
    body = body.replace(placeholder, String(value));
  }

  // Increment usage count
  await template.increment('usageCount');

  return { subject, body };
}

/**
 * 20. Sends message using template
 */
export async function sendTemplateMessage(
  sequelize: Sequelize,
  templateId: string,
  recipientIds: string[],
  recipientType: 'student' | 'parent' | 'teacher' | 'staff',
  variables: Record<string, any>,
  senderId: string,
  priority: MessagePriority = MessagePriority.NORMAL,
  transaction?: Transaction
): Promise<Message> {
  const { subject, body } = await renderMessageFromTemplate(sequelize, templateId, variables);

  const template = await MessageTemplate.findByPk(templateId);

  if (!template) {
    throw new Error(`Template not found: ${templateId}`);
  }

  return createMessage(
    sequelize,
    {
      senderId,
      recipientType,
      recipientIds,
      subject,
      body,
      messageType: template.messageType,
      priority,
      category: template.category,
      templateId,
    },
    transaction
  );
}

// ============================================================================
// COMMUNICATION PREFERENCE FUNCTIONS
// ============================================================================

/**
 * 21. Creates or updates communication preferences
 */
export async function updateCommunicationPreferences(
  sequelize: Sequelize,
  userId: string,
  preferences: Partial<CommunicationPreferenceData>,
  transaction?: Transaction
): Promise<CommunicationPreference> {
  const [preference, created] = await CommunicationPreference.findOrCreate({
    where: { userId },
    defaults: preferences as any,
    transaction,
  });

  if (!created) {
    await preference.update(preferences, { transaction });
  }

  return preference;
}

/**
 * 22. Gets user communication preferences
 */
export async function getUserCommunicationPreferences(
  sequelize: Sequelize,
  userId: string
): Promise<CommunicationPreference | null> {
  return CommunicationPreference.findOne({
    where: { userId },
  });
}

/**
 * 23. Checks if user accepts communication channel
 */
export async function canSendViaChannel(
  sequelize: Sequelize,
  userId: string,
  channel: CommunicationChannel,
  category: NotificationCategory
): Promise<boolean> {
  const preferences = await getUserCommunicationPreferences(sequelize, userId);

  if (!preferences) {
    return channel === CommunicationChannel.EMAIL; // Default to email
  }

  // Check if channel is enabled globally
  switch (channel) {
    case CommunicationChannel.EMAIL:
      if (!preferences.emailEnabled) return false;
      break;
    case CommunicationChannel.SMS:
      if (!preferences.smsEnabled) return false;
      break;
    case CommunicationChannel.PUSH:
      if (!preferences.pushEnabled) return false;
      break;
    case CommunicationChannel.PHONE:
      if (!preferences.phoneEnabled) return false;
      break;
    default:
      return false;
  }

  // Check category-specific preferences
  const categoryPrefs = preferences.categoryPreferences[category];
  if (categoryPrefs && Array.isArray(categoryPrefs)) {
    return categoryPrefs.includes(channel);
  }

  return true; // Allow if no category-specific preference
}

/**
 * 24. Gets preferred channels for a category
 */
function getPreferredChannelsForCategory(
  preferences: CommunicationPreference | null,
  category: NotificationCategory
): CommunicationChannel[] {
  if (!preferences) {
    return [CommunicationChannel.EMAIL];
  }

  const categoryPrefs = preferences.categoryPreferences[category];

  if (categoryPrefs && Array.isArray(categoryPrefs)) {
    return categoryPrefs.filter(ch => {
      switch (ch) {
        case CommunicationChannel.EMAIL:
          return preferences.emailEnabled;
        case CommunicationChannel.SMS:
          return preferences.smsEnabled;
        case CommunicationChannel.PUSH:
          return preferences.pushEnabled;
        case CommunicationChannel.PHONE:
          return preferences.phoneEnabled;
        default:
          return false;
      }
    });
  }

  // Default based on enabled channels
  const channels: CommunicationChannel[] = [];
  if (preferences.emailEnabled) channels.push(CommunicationChannel.EMAIL);
  if (preferences.pushEnabled) channels.push(CommunicationChannel.PUSH);
  if (preferences.smsEnabled) channels.push(CommunicationChannel.SMS);

  return channels.length > 0 ? channels : [CommunicationChannel.EMAIL];
}

/**
 * 25. Checks if within quiet hours
 */
export async function isWithinQuietHours(
  sequelize: Sequelize,
  userId: string
): Promise<boolean> {
  const preferences = await getUserCommunicationPreferences(sequelize, userId);

  if (!preferences || !preferences.quietHoursStart || !preferences.quietHoursEnd) {
    return false;
  }

  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  return (
    currentTime >= preferences.quietHoursStart &&
    currentTime <= preferences.quietHoursEnd
  );
}

// ============================================================================
// MESSAGE DELIVERY TRACKING FUNCTIONS
// ============================================================================

/**
 * 26. Updates message delivery status
 */
export async function updateDeliveryStatus(
  sequelize: Sequelize,
  messageId: string,
  recipientId: string,
  status: MessageStatus,
  failureReason?: string,
  transaction?: Transaction
): Promise<MessageRecipient> {
  const recipient = await MessageRecipient.findOne({
    where: { messageId, recipientId },
    transaction,
  });

  if (!recipient) {
    throw new Error(`Recipient not found for message ${messageId}`);
  }

  const updates: any = {
    status,
    lastAttemptAt: new Date(),
    attempts: recipient.attempts + 1,
  };

  if (status === MessageStatus.DELIVERED) {
    updates.deliveredAt = new Date();
  }

  if (status === MessageStatus.FAILED && failureReason) {
    updates.failureReason = failureReason;
  }

  await recipient.update(updates, { transaction });
  return recipient;
}

/**
 * 27. Marks message as read
 */
export async function markMessageAsRead(
  sequelize: Sequelize,
  messageId: string,
  recipientId: string,
  transaction?: Transaction
): Promise<MessageRecipient> {
  const recipient = await MessageRecipient.findOne({
    where: { messageId, recipientId },
    transaction,
  });

  if (!recipient) {
    throw new Error(`Recipient not found for message ${messageId}`);
  }

  await recipient.update(
    {
      status: MessageStatus.READ,
      readAt: new Date(),
    },
    { transaction }
  );

  return recipient;
}

/**
 * 28. Gets message delivery statistics
 */
export async function getMessageDeliveryStats(
  sequelize: Sequelize,
  messageId: string
): Promise<{
  total: number;
  queued: number;
  sending: number;
  sent: number;
  delivered: number;
  read: number;
  failed: number;
  deliveryRate: number;
  readRate: number;
}> {
  const [result] = await sequelize.query(
    `
    SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE status = 'queued') as queued,
      COUNT(*) FILTER (WHERE status = 'sending') as sending,
      COUNT(*) FILTER (WHERE status = 'sent') as sent,
      COUNT(*) FILTER (WHERE status = 'delivered') as delivered,
      COUNT(*) FILTER (WHERE status = 'read') as read,
      COUNT(*) FILTER (WHERE status = 'failed') as failed,
      ROUND(
        (COUNT(*) FILTER (WHERE status IN ('delivered', 'read'))::numeric / NULLIF(COUNT(*), 0)) * 100,
        2
      ) as delivery_rate,
      ROUND(
        (COUNT(*) FILTER (WHERE status = 'read')::numeric / NULLIF(COUNT(*), 0)) * 100,
        2
      ) as read_rate
    FROM message_recipients
    WHERE message_id = :messageId
    `,
    {
      replacements: { messageId },
      type: QueryTypes.SELECT,
    }
  );

  const stats = result as any;

  return {
    total: parseInt(stats.total) || 0,
    queued: parseInt(stats.queued) || 0,
    sending: parseInt(stats.sending) || 0,
    sent: parseInt(stats.sent) || 0,
    delivered: parseInt(stats.delivered) || 0,
    read: parseInt(stats.read) || 0,
    failed: parseInt(stats.failed) || 0,
    deliveryRate: parseFloat(stats.delivery_rate) || 0,
    readRate: parseFloat(stats.read_rate) || 0,
  };
}

/**
 * 29. Gets failed message deliveries for retry
 */
export async function getFailedDeliveries(
  sequelize: Sequelize,
  maxAttempts: number = 3,
  limit: number = 100
): Promise<MessageRecipient[]> {
  return MessageRecipient.findAll({
    where: {
      status: MessageStatus.FAILED,
      attempts: { [Op.lt]: maxAttempts },
    },
    include: [
      {
        association: 'message',
        attributes: ['id', 'subject', 'body', 'messageType', 'priority'],
      },
    ],
    limit,
    order: [
      ['lastAttemptAt', 'ASC'],
      ['priority', 'DESC'],
    ],
  });
}

/**
 * 30. Retries failed message deliveries
 */
export async function retryFailedDeliveries(
  sequelize: Sequelize,
  maxAttempts: number = 3,
  transaction?: Transaction
): Promise<number> {
  const t = transaction || await sequelize.transaction();

  try {
    const [affectedCount] = await MessageRecipient.update(
      {
        status: MessageStatus.QUEUED,
      },
      {
        where: {
          status: MessageStatus.FAILED,
          attempts: { [Op.lt]: maxAttempts },
        },
        transaction: t,
      }
    );

    if (!transaction) await t.commit();
    return affectedCount;
  } catch (error) {
    if (!transaction) await t.rollback();
    throw error;
  }
}

// ============================================================================
// SCHEDULED MESSAGE FUNCTIONS
// ============================================================================

/**
 * 31. Schedules a message for future delivery
 */
export async function scheduleMessage(
  sequelize: Sequelize,
  messageData: MessageData,
  scheduledFor: Date,
  transaction?: Transaction
): Promise<Message> {
  return createMessage(
    sequelize,
    {
      ...messageData,
      scheduledFor,
    },
    transaction
  );
}

/**
 * 32. Gets scheduled messages ready to send
 */
export async function getScheduledMessagesReadyToSend(
  sequelize: Sequelize,
  limit: number = 100
): Promise<Message[]> {
  return Message.findAll({
    where: {
      status: MessageStatus.SCHEDULED,
      scheduledFor: { [Op.lte]: new Date() },
    },
    limit,
    order: [
      ['priority', 'DESC'],
      ['scheduledFor', 'ASC'],
    ],
  });
}

/**
 * 33. Processes scheduled messages
 */
export async function processScheduledMessages(
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<number> {
  const t = transaction || await sequelize.transaction();

  try {
    const messages = await getScheduledMessagesReadyToSend(sequelize);

    for (const message of messages) {
      await message.update(
        {
          status: MessageStatus.QUEUED,
          sentAt: new Date(),
        },
        { transaction: t }
      );

      // Update recipient statuses
      await MessageRecipient.update(
        { status: MessageStatus.QUEUED },
        {
          where: {
            messageId: message.id,
            status: MessageStatus.SCHEDULED,
          },
          transaction: t,
        }
      );
    }

    if (!transaction) await t.commit();
    return messages.length;
  } catch (error) {
    if (!transaction) await t.rollback();
    throw error;
  }
}

/**
 * 34. Cancels scheduled message
 */
export async function cancelScheduledMessage(
  sequelize: Sequelize,
  messageId: string,
  transaction?: Transaction
): Promise<Message> {
  const message = await Message.findByPk(messageId, { transaction });

  if (!message) {
    throw new Error(`Message not found: ${messageId}`);
  }

  if (message.status !== MessageStatus.SCHEDULED) {
    throw new Error(`Message is not scheduled: ${messageId}`);
  }

  await message.update(
    {
      status: MessageStatus.CANCELLED,
    },
    { transaction }
  );

  return message;
}

// ============================================================================
// COMMUNICATION ANALYTICS FUNCTIONS
// ============================================================================

/**
 * 35. Gets communication analytics for a period
 */
export async function getCommunicationAnalytics(
  sequelize: Sequelize,
  startDate: Date,
  endDate: Date,
  schoolId?: string
): Promise<CommunicationAnalytics> {
  let whereClause = `WHERE m.created_at BETWEEN :startDate AND :endDate`;

  if (schoolId) {
    whereClause += ` AND EXISTS (
      SELECT 1 FROM users u WHERE u.id = m.sender_id AND u.school_id = :schoolId
    )`;
  }

  const [result] = await sequelize.query(
    `
    SELECT
      COUNT(DISTINCT m.id) as total_sent,
      COUNT(*) FILTER (WHERE mr.status IN ('delivered', 'read')) as total_delivered,
      COUNT(*) FILTER (WHERE mr.status = 'read') as total_read,
      COUNT(*) FILTER (WHERE mr.status = 'failed') as total_failed,
      ROUND(
        (COUNT(*) FILTER (WHERE mr.status IN ('delivered', 'read'))::numeric / NULLIF(COUNT(*), 0)) * 100,
        2
      ) as delivery_rate,
      ROUND(
        (COUNT(*) FILTER (WHERE mr.status = 'read')::numeric / NULLIF(COUNT(*), 0)) * 100,
        2
      ) as read_rate,
      ROUND(
        AVG(EXTRACT(EPOCH FROM (mr.read_at - mr.delivered_at)) / 3600)
        FILTER (WHERE mr.read_at IS NOT NULL AND mr.delivered_at IS NOT NULL),
        2
      ) as avg_read_time_hours
    FROM messages m
    LEFT JOIN message_recipients mr ON m.id = mr.message_id
    ${whereClause}
    `,
    {
      replacements: { startDate, endDate, schoolId },
      type: QueryTypes.SELECT,
    }
  );

  const stats = result as any;

  // Get by channel
  const byChannelResults = await sequelize.query(
    `
    SELECT
      m.message_type,
      COUNT(*) as count
    FROM messages m
    ${whereClause}
    GROUP BY m.message_type
    `,
    {
      replacements: { startDate, endDate, schoolId },
      type: QueryTypes.SELECT,
    }
  );

  const byChannel: Record<MessageType, number> = {} as any;
  for (const row of byChannelResults as any[]) {
    byChannel[row.message_type] = parseInt(row.count);
  }

  // Get by category
  const byCategoryResults = await sequelize.query(
    `
    SELECT
      m.category,
      COUNT(*) as count
    FROM messages m
    ${whereClause}
    GROUP BY m.category
    `,
    {
      replacements: { startDate, endDate, schoolId },
      type: QueryTypes.SELECT,
    }
  );

  const byCategory: Record<NotificationCategory, number> = {} as any;
  for (const row of byCategoryResults as any[]) {
    byCategory[row.category] = parseInt(row.count);
  }

  return {
    totalSent: parseInt(stats.total_sent) || 0,
    totalDelivered: parseInt(stats.total_delivered) || 0,
    totalRead: parseInt(stats.total_read) || 0,
    totalFailed: parseInt(stats.total_failed) || 0,
    deliveryRate: parseFloat(stats.delivery_rate) || 0,
    readRate: parseFloat(stats.read_rate) || 0,
    averageReadTime: parseFloat(stats.avg_read_time_hours) || 0,
    byChannel,
    byCategory,
  };
}

/**
 * 36. Gets message engagement metrics
 */
export async function getMessageEngagementMetrics(
  sequelize: Sequelize,
  senderId: string,
  days: number = 30
): Promise<any> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return sequelize.query(
    `
    SELECT
      DATE(m.created_at) as date,
      COUNT(DISTINCT m.id) as messages_sent,
      COUNT(*) FILTER (WHERE mr.status = 'delivered') as delivered,
      COUNT(*) FILTER (WHERE mr.status = 'read') as read,
      ROUND(
        (COUNT(*) FILTER (WHERE mr.status = 'read')::numeric / NULLIF(COUNT(*), 0)) * 100,
        2
      ) as engagement_rate
    FROM messages m
    LEFT JOIN message_recipients mr ON m.id = mr.message_id
    WHERE m.sender_id = :senderId
      AND m.created_at >= :startDate
    GROUP BY DATE(m.created_at)
    ORDER BY date DESC
    `,
    {
      replacements: { senderId, startDate },
      type: QueryTypes.SELECT,
    }
  );
}

/**
 * 37. Gets most active message senders
 */
export async function getMostActiveSenders(
  sequelize: Sequelize,
  schoolId: string,
  limit: number = 10,
  days: number = 30
): Promise<any[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return sequelize.query(
    `
    SELECT
      u.id,
      u.first_name,
      u.last_name,
      u.role,
      COUNT(DISTINCT m.id) as messages_sent,
      COUNT(mr.id) as total_recipients,
      ROUND(
        (COUNT(*) FILTER (WHERE mr.status = 'read')::numeric / NULLIF(COUNT(mr.id), 0)) * 100,
        2
      ) as read_rate
    FROM users u
    INNER JOIN messages m ON u.id = m.sender_id
    LEFT JOIN message_recipients mr ON m.id = mr.message_id
    WHERE u.school_id = :schoolId
      AND m.created_at >= :startDate
    GROUP BY u.id, u.first_name, u.last_name, u.role
    ORDER BY messages_sent DESC
    LIMIT :limit
    `,
    {
      replacements: { schoolId, startDate, limit },
      type: QueryTypes.SELECT,
    }
  );
}

// ============================================================================
// ADVANCED QUERY OPTIMIZATION FUNCTIONS
// ============================================================================

/**
 * 38. Gets messages with optimized eager loading (prevents N+1)
 */
export async function getMessagesWithRelations(
  sequelize: Sequelize,
  whereClause: WhereOptions,
  limit: number = 50,
  offset: number = 0
): Promise<{ rows: Message[]; count: number }> {
  return Message.findAndCountAll({
    where: whereClause,
    include: [
      {
        association: 'sender',
        attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
      },
      {
        association: 'recipients',
        attributes: ['id', 'recipientId', 'status', 'deliveredAt', 'readAt'],
        limit: 10, // Limit recipients shown
        separate: true, // Use separate query to avoid cartesian product
      },
      {
        association: 'template',
        attributes: ['id', 'name', 'category'],
        required: false,
      },
    ],
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    subQuery: false,
  });
}

/**
 * 39. Bulk fetches recipient messages (optimized)
 */
export async function bulkFetchRecipientMessages(
  sequelize: Sequelize,
  recipientIds: string[],
  startDate: Date,
  endDate: Date
): Promise<Map<string, Message[]>> {
  const messages = await sequelize.query(
    `
    SELECT
      mr.recipient_id,
      m.*
    FROM message_recipients mr
    INNER JOIN messages m ON mr.message_id = m.id
    WHERE mr.recipient_id = ANY(:recipientIds)
      AND m.created_at BETWEEN :startDate AND :endDate
    ORDER BY mr.recipient_id, m.created_at DESC
    `,
    {
      replacements: { recipientIds, startDate, endDate },
      type: QueryTypes.SELECT,
    }
  );

  const messageMap = new Map<string, Message[]>();

  for (const message of messages as any[]) {
    const recipientId = message.recipient_id;
    const existing = messageMap.get(recipientId) || [];
    existing.push(message);
    messageMap.set(recipientId, existing);
  }

  return messageMap;
}

/**
 * 40. Gets conversation thread between users
 */
export async function getConversationThread(
  sequelize: Sequelize,
  user1Id: string,
  user2Id: string,
  limit: number = 100
): Promise<Message[]> {
  return sequelize.query(
    `
    SELECT DISTINCT m.*
    FROM messages m
    INNER JOIN message_recipients mr ON m.id = mr.message_id
    WHERE (
      (m.sender_id = :user1Id AND mr.recipient_id = :user2Id)
      OR
      (m.sender_id = :user2Id AND mr.recipient_id = :user1Id)
    )
    ORDER BY m.created_at DESC
    LIMIT :limit
    `,
    {
      replacements: { user1Id, user2Id, limit },
      type: QueryTypes.SELECT,
      model: Message,
      mapToModel: true,
    }
  ) as any;
}

/**
 * 41. Searches messages with full-text search
 */
export async function searchMessages(
  sequelize: Sequelize,
  searchTerm: string,
  userId?: string,
  category?: NotificationCategory,
  limit: number = 50
): Promise<Message[]> {
  const whereClause: WhereOptions = {
    [Op.or]: [
      { subject: { [Op.iLike]: `%${searchTerm}%` } },
      { body: { [Op.iLike]: `%${searchTerm}%` } },
    ],
  };

  if (userId) {
    whereClause[Op.or] = [
      { senderId: userId },
      literal(`
        EXISTS (
          SELECT 1 FROM message_recipients mr
          WHERE mr.message_id = "Message"."id"
            AND mr.recipient_id = :userId
        )
      `),
    ];
  }

  if (category) {
    whereClause.category = category;
  }

  return Message.findAll({
    where: whereClause,
    replacements: { searchTerm: `%${searchTerm}%`, userId },
    include: [
      {
        association: 'sender',
        attributes: ['id', 'firstName', 'lastName'],
      },
    ],
    limit,
    order: [['createdAt', 'DESC']],
  });
}

/**
 * 42. Gets message statistics by category
 */
export async function getMessageStatsByCategory(
  sequelize: Sequelize,
  schoolId: string,
  startDate: Date,
  endDate: Date
): Promise<any[]> {
  return sequelize.query(
    `
    SELECT
      m.category,
      m.message_type,
      COUNT(DISTINCT m.id) as message_count,
      COUNT(mr.id) as recipient_count,
      ROUND(AVG(
        CASE
          WHEN mr.delivered_at IS NOT NULL
          THEN EXTRACT(EPOCH FROM (mr.delivered_at - m.created_at)) / 60
          ELSE NULL
        END
      ), 2) as avg_delivery_time_minutes,
      ROUND(
        (COUNT(*) FILTER (WHERE mr.status = 'read')::numeric / NULLIF(COUNT(mr.id), 0)) * 100,
        2
      ) as read_rate
    FROM messages m
    LEFT JOIN message_recipients mr ON m.id = mr.message_id
    WHERE EXISTS (
      SELECT 1 FROM users u WHERE u.id = m.sender_id AND u.school_id = :schoolId
    )
    AND m.created_at BETWEEN :startDate AND :endDate
    GROUP BY m.category, m.message_type
    ORDER BY message_count DESC
    `,
    {
      replacements: { schoolId, startDate, endDate },
      type: QueryTypes.SELECT,
    }
  );
}

/**
 * 43. Gets user inbox with pagination and filtering
 */
export async function getUserInbox(
  sequelize: Sequelize,
  userId: string,
  options: {
    unreadOnly?: boolean;
    category?: NotificationCategory;
    priority?: MessagePriority;
    limit?: number;
    offset?: number;
  } = {}
): Promise<{ rows: any[]; count: number }> {
  let whereClause = 'WHERE mr.recipient_id = :userId';
  const replacements: any = { userId };

  if (options.unreadOnly) {
    whereClause += ' AND mr.status NOT IN (\'read\')';
  }

  if (options.category) {
    whereClause += ' AND m.category = :category';
    replacements.category = options.category;
  }

  if (options.priority) {
    whereClause += ' AND m.priority = :priority';
    replacements.priority = options.priority;
  }

  const limit = options.limit || 50;
  const offset = options.offset || 0;

  const [countResult] = await sequelize.query(
    `
    SELECT COUNT(*) as count
    FROM message_recipients mr
    INNER JOIN messages m ON mr.message_id = m.id
    ${whereClause}
    `,
    {
      replacements,
      type: QueryTypes.SELECT,
    }
  );

  const rows = await sequelize.query(
    `
    SELECT
      m.*,
      mr.status as recipient_status,
      mr.delivered_at,
      mr.read_at,
      u.first_name as sender_first_name,
      u.last_name as sender_last_name
    FROM message_recipients mr
    INNER JOIN messages m ON mr.message_id = m.id
    INNER JOIN users u ON m.sender_id = u.id
    ${whereClause}
    ORDER BY m.created_at DESC
    LIMIT :limit OFFSET :offset
    `,
    {
      replacements: { ...replacements, limit, offset },
      type: QueryTypes.SELECT,
    }
  );

  return {
    rows: rows as any[],
    count: parseInt((countResult as any).count) || 0,
  };
}

/**
 * 44. Archives old messages
 */
export async function archiveOldMessages(
  sequelize: Sequelize,
  olderThanDays: number = 365,
  transaction?: Transaction
): Promise<{ archived: number; deleted: number }> {
  const t = transaction || await sequelize.transaction();

  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    // Archive to separate table (if exists)
    const archived = await sequelize.query(
      `
      INSERT INTO messages_archive
      SELECT * FROM messages
      WHERE created_at < :cutoffDate
        AND status IN ('sent', 'delivered', 'read')
        AND deleted_at IS NULL
      ON CONFLICT DO NOTHING
      `,
      {
        replacements: { cutoffDate },
        type: QueryTypes.INSERT,
        transaction: t,
      }
    );

    // Soft delete archived messages
    const deleted = await Message.destroy({
      where: {
        createdAt: { [Op.lt]: cutoffDate },
        status: { [Op.in]: [MessageStatus.SENT, MessageStatus.DELIVERED, MessageStatus.READ] },
      },
      transaction: t,
    });

    if (!transaction) await t.commit();

    return {
      archived: (archived[1] as any) || 0,
      deleted,
    };
  } catch (error) {
    if (!transaction) await t.rollback();
    throw error;
  }
}

/**
 * 45. Cleans up expired notifications
 */
export async function cleanupExpiredNotifications(
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<number> {
  return Notification.destroy({
    where: {
      expiresAt: { [Op.lt]: new Date() },
    },
    transaction,
  });
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Helper: Chunks array into batches
 */
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Models
  Message,
  MessageRecipient,
  Notification,
  Alert,
  CommunicationPreference,
  MessageTemplate,

  // Model initializers
  initMessageModel,
  initMessageRecipientModel,
  initNotificationModel,
  initAlertModel,
  initCommunicationPreferenceModel,
  initMessageTemplateModel,

  // Message sending (1-5)
  createMessage,
  sendEmailNotification,
  sendSmsAlert,
  sendPushNotification,
  sendMultiChannelMessage,

  // Bulk communication (6-8)
  sendBulkMessages,
  sendClassAnnouncement,
  sendSchoolAnnouncement,

  // Emergency alerts (9-10)
  sendEmergencyAlert,
  sendSafetyAlert,

  // Notifications (11-15)
  createNotification,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteOldNotifications,

  // Templates (16-20)
  createMessageTemplate,
  getMessageTemplate,
  getTemplatesByCategory,
  renderMessageFromTemplate,
  sendTemplateMessage,

  // Preferences (21-25)
  updateCommunicationPreferences,
  getUserCommunicationPreferences,
  canSendViaChannel,
  getPreferredChannelsForCategory,
  isWithinQuietHours,

  // Delivery tracking (26-30)
  updateDeliveryStatus,
  markMessageAsRead,
  getMessageDeliveryStats,
  getFailedDeliveries,
  retryFailedDeliveries,

  // Scheduled messages (31-34)
  scheduleMessage,
  getScheduledMessagesReadyToSend,
  processScheduledMessages,
  cancelScheduledMessage,

  // Analytics (35-37)
  getCommunicationAnalytics,
  getMessageEngagementMetrics,
  getMostActiveSenders,

  // Advanced queries (38-45)
  getMessagesWithRelations,
  bulkFetchRecipientMessages,
  getConversationThread,
  searchMessages,
  getMessageStatsByCategory,
  getUserInbox,
  archiveOldMessages,
  cleanupExpiredNotifications,
};
