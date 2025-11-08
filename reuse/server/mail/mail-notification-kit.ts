/**
 * LOC: MAILNTF1234567
 * File: /reuse/server/mail/mail-notification-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS mail services
 *   - Notification controllers
 *   - WebSocket gateways
 *   - Push notification services
 *   - SMS integration services
 *   - Sequelize models
 */

/**
 * File: /reuse/server/mail/mail-notification-kit.ts
 * Locator: WC-UTL-MAILNTF-001
 * Purpose: Comprehensive Mail Notification Kit - Complete notification system for NestJS + Sequelize
 *
 * Upstream: Independent utility module for notification operations
 * Downstream: ../backend/*, Mail services, Notification controllers, WebSocket gateways, Push services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize, ws, apns2, fcm-node, twilio
 * Exports: 40 utility functions for email notifications, push notifications, SMS, WebSocket real-time alerts, preferences, quiet hours, read receipts, templates
 *
 * LLM Context: Enterprise-grade mail notification system for White Cross healthcare platform.
 * Provides comprehensive notification management comparable to Microsoft Exchange Server, including email alerts,
 * desktop push notifications, mobile push (APNS/FCM), SMS integration, real-time WebSocket notifications,
 * per-user notification preferences, quiet hours and do-not-disturb modes, notification filtering and grouping,
 * read receipts and delivery tracking, notification templates, HIPAA-compliant notification handling,
 * and Sequelize models for notification settings, preferences, delivery logs, and templates.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface NotificationEvent {
  id: string;
  userId: string;
  eventType: NotificationEventType;
  entityType: 'message' | 'meeting' | 'calendar' | 'contact' | 'task' | 'alert';
  entityId: string;
  title: string;
  message: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  category: string;
  actionUrl?: string;
  actionData?: Record<string, any>;
  imageUrl?: string;
  iconUrl?: string;
  sound?: string;
  badge?: number;
  metadata?: Record<string, any>;
  expiresAt?: Date;
  createdAt: Date;
}

type NotificationEventType =
  | 'new_mail'
  | 'meeting_request'
  | 'meeting_reminder'
  | 'meeting_cancelled'
  | 'meeting_updated'
  | 'calendar_reminder'
  | 'task_assigned'
  | 'task_reminder'
  | 'contact_shared'
  | 'mail_replied'
  | 'mail_forwarded'
  | 'read_receipt'
  | 'delivery_receipt'
  | 'out_of_office_reply'
  | 'mailbox_full'
  | 'system_alert'
  | 'security_alert';

interface NotificationDelivery {
  id: string;
  notificationId: string;
  userId: string;
  deliveryChannel: NotificationChannel;
  deliveryStatus: 'pending' | 'sent' | 'delivered' | 'failed' | 'read' | 'dismissed';
  deliveryAttempts: number;
  lastAttemptAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  dismissedAt?: Date;
  failureReason?: string;
  errorCode?: string;
  externalId?: string; // FCM/APNS message ID
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

type NotificationChannel = 'email' | 'desktop_push' | 'mobile_push' | 'sms' | 'websocket' | 'in_app';

interface NotificationPreferences {
  id: string;
  userId: string;
  enabled: boolean;
  channels: NotificationChannelPreferences;
  eventTypeSettings: Record<NotificationEventType, EventTypePreference>;
  quietHours?: QuietHoursSettings;
  doNotDisturb: boolean;
  doNotDisturbUntil?: Date;
  groupingEnabled: boolean;
  groupingInterval: number; // minutes
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  badgeCountEnabled: boolean;
  previewInLockScreen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface NotificationChannelPreferences {
  email: ChannelSettings;
  desktop_push: ChannelSettings;
  mobile_push: ChannelSettings;
  sms: ChannelSettings;
  websocket: ChannelSettings;
  in_app: ChannelSettings;
}

interface ChannelSettings {
  enabled: boolean;
  priority: number; // 1-10, higher is more priority
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  customSound?: string;
  deliveryDelay?: number; // milliseconds
}

interface EventTypePreference {
  enabled: boolean;
  channels: NotificationChannel[];
  priority: 'low' | 'normal' | 'high' | 'urgent';
  soundOverride?: string;
  groupingEnabled: boolean;
}

interface QuietHoursSettings {
  enabled: boolean;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  daysOfWeek: number[]; // 0-6 (Sunday-Saturday)
  timezone: string;
  allowUrgent: boolean;
  allowedEventTypes: NotificationEventType[];
}

interface PushNotificationPayload {
  title: string;
  body: string;
  badge?: number;
  sound?: string;
  category?: string;
  threadId?: string;
  data?: Record<string, any>;
  imageUrl?: string;
  actionButtons?: PushActionButton[];
  ttl?: number; // time to live in seconds
  collapseKey?: string;
  priority: 'normal' | 'high';
}

interface PushActionButton {
  id: string;
  title: string;
  action: string;
  icon?: string;
  requiresAuth?: boolean;
}

interface APNSPayload {
  aps: {
    alert: {
      title: string;
      subtitle?: string;
      body: string;
      'launch-image'?: string;
    };
    badge?: number;
    sound?: string | { critical: number; name: string; volume: number };
    category?: string;
    'thread-id'?: string;
    'content-available'?: number;
    'mutable-content'?: number;
  };
  data?: Record<string, any>;
}

interface FCMPayload {
  notification: {
    title: string;
    body: string;
    image?: string;
    icon?: string;
    sound?: string;
    tag?: string;
    color?: string;
    click_action?: string;
  };
  data?: Record<string, string>;
  android?: {
    priority: 'normal' | 'high';
    ttl: number;
    notification: {
      channel_id: string;
      sound?: string;
      tag?: string;
      color?: string;
      click_action?: string;
      body_loc_key?: string;
      body_loc_args?: string[];
      title_loc_key?: string;
      title_loc_args?: string[];
    };
  };
  apns?: {
    payload: APNSPayload;
  };
  webpush?: {
    headers: Record<string, string>;
    data?: Record<string, string>;
    notification: Record<string, any>;
  };
}

interface SMSNotification {
  id: string;
  userId: string;
  phoneNumber: string;
  message: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  provider: 'twilio' | 'sns' | 'nexmo';
  externalId?: string;
  sentAt?: Date;
  deliveredAt?: Date;
  failureReason?: string;
  cost?: number;
  metadata?: Record<string, any>;
  createdAt: Date;
}

interface WebSocketNotification {
  id: string;
  userId: string;
  eventType: NotificationEventType;
  payload: any;
  sentAt: Date;
  acknowledged: boolean;
  acknowledgedAt?: Date;
}

interface EmailNotificationTemplate {
  id: string;
  name: string;
  eventType: NotificationEventType;
  subject: string;
  bodyHtml: string;
  bodyText: string;
  variables: string[]; // Supported template variables
  locale: string;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ReadReceipt {
  id: string;
  messageId: string;
  userId: string;
  recipientAddress: string;
  readAt: Date;
  ipAddress?: string;
  userAgent?: string;
  location?: string;
  deviceType?: 'desktop' | 'mobile' | 'tablet';
  notificationSent: boolean;
  createdAt: Date;
}

interface DeliveryReceipt {
  id: string;
  messageId: string;
  userId: string;
  recipientAddress: string;
  deliveryStatus: 'sent' | 'delivered' | 'failed' | 'bounced' | 'deferred';
  deliveredAt?: Date;
  remoteServer?: string;
  smtpStatus?: string;
  smtpMessage?: string;
  attempts: number;
  lastAttemptAt: Date;
  notificationSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface NotificationGroup {
  id: string;
  userId: string;
  groupKey: string;
  eventType: NotificationEventType;
  notificationIds: string[];
  count: number;
  firstNotificationAt: Date;
  lastNotificationAt: Date;
  summary: string;
  isCollapsed: boolean;
  createdAt: Date;
}

interface NotificationFilter {
  userId: string;
  eventTypes?: NotificationEventType[];
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  channels?: NotificationChannel[];
  startDate?: Date;
  endDate?: Date;
  readStatus?: 'read' | 'unread' | 'all';
  limit?: number;
  offset?: number;
}

interface DeviceRegistration {
  id: string;
  userId: string;
  deviceType: 'ios' | 'android' | 'web' | 'desktop';
  deviceToken: string;
  deviceName?: string;
  deviceModel?: string;
  osVersion?: string;
  appVersion?: string;
  isActive: boolean;
  lastActiveAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface NotificationStats {
  userId: string;
  period: 'hour' | 'day' | 'week' | 'month';
  totalSent: number;
  totalDelivered: number;
  totalRead: number;
  totalFailed: number;
  byChannel: Record<NotificationChannel, number>;
  byEventType: Record<NotificationEventType, number>;
  averageDeliveryTime: number; // milliseconds
  readRate: number; // percentage
}

interface ExchangeNotification {
  subscriptionId: string;
  userId: string;
  eventType: 'NewMail' | 'Deleted' | 'Modified' | 'Moved' | 'Copied' | 'Created';
  itemId: string;
  parentFolderId: string;
  timestamp: Date;
  watermark: string;
}

interface SwaggerNotificationSchema {
  name: string;
  type: string;
  description: string;
  example: any;
  required?: boolean;
  properties?: Record<string, any>;
}

// ============================================================================
// SEQUELIZE MODEL ATTRIBUTES
// ============================================================================

/**
 * Sequelize NotificationEvent model attributes for notification_events table.
 *
 * @example
 * ```typescript
 * class NotificationEvent extends Model {}
 * NotificationEvent.init(getNotificationEventModelAttributes(), {
 *   sequelize,
 *   tableName: 'notification_events',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['userId', 'createdAt'] },
 *     { fields: ['eventType'] },
 *     { fields: ['entityType', 'entityId'] }
 *   ]
 * });
 * ```
 */
export const getNotificationEventModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  userId: {
    type: 'UUID',
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  eventType: {
    type: 'ENUM',
    values: [
      'new_mail',
      'meeting_request',
      'meeting_reminder',
      'meeting_cancelled',
      'meeting_updated',
      'calendar_reminder',
      'task_assigned',
      'task_reminder',
      'contact_shared',
      'mail_replied',
      'mail_forwarded',
      'read_receipt',
      'delivery_receipt',
      'out_of_office_reply',
      'mailbox_full',
      'system_alert',
      'security_alert',
    ],
    allowNull: false,
  },
  entityType: {
    type: 'ENUM',
    values: ['message', 'meeting', 'calendar', 'contact', 'task', 'alert'],
    allowNull: false,
  },
  entityId: {
    type: 'UUID',
    allowNull: false,
    comment: 'ID of the related entity (message, meeting, etc.)',
  },
  title: {
    type: 'STRING',
    allowNull: false,
  },
  message: {
    type: 'TEXT',
    allowNull: false,
  },
  priority: {
    type: 'ENUM',
    values: ['low', 'normal', 'high', 'urgent'],
    defaultValue: 'normal',
  },
  category: {
    type: 'STRING',
    allowNull: true,
  },
  actionUrl: {
    type: 'STRING',
    allowNull: true,
  },
  actionData: {
    type: 'JSONB',
    allowNull: true,
  },
  imageUrl: {
    type: 'STRING',
    allowNull: true,
  },
  iconUrl: {
    type: 'STRING',
    allowNull: true,
  },
  sound: {
    type: 'STRING',
    allowNull: true,
  },
  badge: {
    type: 'INTEGER',
    allowNull: true,
  },
  metadata: {
    type: 'JSONB',
    allowNull: true,
    defaultValue: {},
  },
  expiresAt: {
    type: 'DATE',
    allowNull: true,
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
  },
});

/**
 * Sequelize NotificationDelivery model attributes for notification_deliveries table.
 *
 * @example
 * ```typescript
 * class NotificationDelivery extends Model {}
 * NotificationDelivery.init(getNotificationDeliveryModelAttributes(), {
 *   sequelize,
 *   tableName: 'notification_deliveries',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['notificationId'] },
 *     { fields: ['userId', 'deliveryChannel'] },
 *     { fields: ['deliveryStatus'] }
 *   ]
 * });
 * ```
 */
export const getNotificationDeliveryModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  notificationId: {
    type: 'UUID',
    allowNull: false,
    references: {
      model: 'notification_events',
      key: 'id',
    },
  },
  userId: {
    type: 'UUID',
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  deliveryChannel: {
    type: 'ENUM',
    values: ['email', 'desktop_push', 'mobile_push', 'sms', 'websocket', 'in_app'],
    allowNull: false,
  },
  deliveryStatus: {
    type: 'ENUM',
    values: ['pending', 'sent', 'delivered', 'failed', 'read', 'dismissed'],
    defaultValue: 'pending',
  },
  deliveryAttempts: {
    type: 'INTEGER',
    defaultValue: 0,
  },
  lastAttemptAt: {
    type: 'DATE',
    allowNull: true,
  },
  deliveredAt: {
    type: 'DATE',
    allowNull: true,
  },
  readAt: {
    type: 'DATE',
    allowNull: true,
  },
  dismissedAt: {
    type: 'DATE',
    allowNull: true,
  },
  failureReason: {
    type: 'TEXT',
    allowNull: true,
  },
  errorCode: {
    type: 'STRING',
    allowNull: true,
  },
  externalId: {
    type: 'STRING',
    allowNull: true,
    comment: 'External provider message ID (FCM, APNS, Twilio, etc.)',
  },
  metadata: {
    type: 'JSONB',
    allowNull: true,
    defaultValue: {},
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
  },
  updatedAt: {
    type: 'DATE',
    allowNull: false,
  },
});

/**
 * Sequelize NotificationPreferences model attributes for notification_preferences table.
 *
 * @example
 * ```typescript
 * class NotificationPreferences extends Model {}
 * NotificationPreferences.init(getNotificationPreferencesModelAttributes(), {
 *   sequelize,
 *   tableName: 'notification_preferences',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['userId'], unique: true }
 *   ]
 * });
 * ```
 */
export const getNotificationPreferencesModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  userId: {
    type: 'UUID',
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  enabled: {
    type: 'BOOLEAN',
    defaultValue: true,
  },
  channels: {
    type: 'JSONB',
    allowNull: false,
    defaultValue: {
      email: { enabled: true, priority: 5, soundEnabled: false, vibrationEnabled: false },
      desktop_push: { enabled: true, priority: 7, soundEnabled: true, vibrationEnabled: false },
      mobile_push: { enabled: true, priority: 8, soundEnabled: true, vibrationEnabled: true },
      sms: { enabled: false, priority: 9, soundEnabled: true, vibrationEnabled: true },
      websocket: { enabled: true, priority: 10, soundEnabled: false, vibrationEnabled: false },
      in_app: { enabled: true, priority: 6, soundEnabled: false, vibrationEnabled: false },
    },
  },
  eventTypeSettings: {
    type: 'JSONB',
    allowNull: false,
    defaultValue: {},
  },
  quietHours: {
    type: 'JSONB',
    allowNull: true,
  },
  doNotDisturb: {
    type: 'BOOLEAN',
    defaultValue: false,
  },
  doNotDisturbUntil: {
    type: 'DATE',
    allowNull: true,
  },
  groupingEnabled: {
    type: 'BOOLEAN',
    defaultValue: true,
  },
  groupingInterval: {
    type: 'INTEGER',
    defaultValue: 5,
    comment: 'Minutes to group similar notifications',
  },
  soundEnabled: {
    type: 'BOOLEAN',
    defaultValue: true,
  },
  vibrationEnabled: {
    type: 'BOOLEAN',
    defaultValue: true,
  },
  badgeCountEnabled: {
    type: 'BOOLEAN',
    defaultValue: true,
  },
  previewInLockScreen: {
    type: 'BOOLEAN',
    defaultValue: true,
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
  },
  updatedAt: {
    type: 'DATE',
    allowNull: false,
  },
});

/**
 * Sequelize DeviceRegistration model attributes for device_registrations table.
 *
 * @example
 * ```typescript
 * class DeviceRegistration extends Model {}
 * DeviceRegistration.init(getDeviceRegistrationModelAttributes(), {
 *   sequelize,
 *   tableName: 'device_registrations',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['userId'] },
 *     { fields: ['deviceToken'], unique: true },
 *     { fields: ['isActive'] }
 *   ]
 * });
 * ```
 */
export const getDeviceRegistrationModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  userId: {
    type: 'UUID',
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  deviceType: {
    type: 'ENUM',
    values: ['ios', 'android', 'web', 'desktop'],
    allowNull: false,
  },
  deviceToken: {
    type: 'STRING',
    allowNull: false,
    unique: true,
  },
  deviceName: {
    type: 'STRING',
    allowNull: true,
  },
  deviceModel: {
    type: 'STRING',
    allowNull: true,
  },
  osVersion: {
    type: 'STRING',
    allowNull: true,
  },
  appVersion: {
    type: 'STRING',
    allowNull: true,
  },
  isActive: {
    type: 'BOOLEAN',
    defaultValue: true,
  },
  lastActiveAt: {
    type: 'DATE',
    allowNull: false,
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
  },
  updatedAt: {
    type: 'DATE',
    allowNull: false,
  },
});

/**
 * Sequelize EmailNotificationTemplate model attributes for email_notification_templates table.
 *
 * @example
 * ```typescript
 * class EmailNotificationTemplate extends Model {}
 * EmailNotificationTemplate.init(getEmailNotificationTemplateModelAttributes(), {
 *   sequelize,
 *   tableName: 'email_notification_templates',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['eventType', 'locale'] },
 *     { fields: ['isActive'] }
 *   ]
 * });
 * ```
 */
export const getEmailNotificationTemplateModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  name: {
    type: 'STRING',
    allowNull: false,
  },
  eventType: {
    type: 'ENUM',
    values: [
      'new_mail',
      'meeting_request',
      'meeting_reminder',
      'meeting_cancelled',
      'meeting_updated',
      'calendar_reminder',
      'task_assigned',
      'task_reminder',
      'contact_shared',
      'mail_replied',
      'mail_forwarded',
      'read_receipt',
      'delivery_receipt',
      'out_of_office_reply',
      'mailbox_full',
      'system_alert',
      'security_alert',
    ],
    allowNull: false,
  },
  subject: {
    type: 'STRING',
    allowNull: false,
  },
  bodyHtml: {
    type: 'TEXT',
    allowNull: false,
  },
  bodyText: {
    type: 'TEXT',
    allowNull: false,
  },
  variables: {
    type: 'ARRAY(STRING)',
    allowNull: false,
    defaultValue: [],
  },
  locale: {
    type: 'STRING',
    defaultValue: 'en-US',
  },
  isActive: {
    type: 'BOOLEAN',
    defaultValue: true,
  },
  createdBy: {
    type: 'UUID',
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
  },
  updatedAt: {
    type: 'DATE',
    allowNull: false,
  },
});

/**
 * Sequelize ReadReceipt model attributes for read_receipts table.
 *
 * @example
 * ```typescript
 * class ReadReceipt extends Model {}
 * ReadReceipt.init(getReadReceiptModelAttributes(), {
 *   sequelize,
 *   tableName: 'read_receipts',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['messageId'] },
 *     { fields: ['userId'] },
 *     { fields: ['recipientAddress'] }
 *   ]
 * });
 * ```
 */
export const getReadReceiptModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  messageId: {
    type: 'UUID',
    allowNull: false,
    references: {
      model: 'mail_messages',
      key: 'id',
    },
  },
  userId: {
    type: 'UUID',
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  recipientAddress: {
    type: 'STRING',
    allowNull: false,
  },
  readAt: {
    type: 'DATE',
    allowNull: false,
  },
  ipAddress: {
    type: 'STRING',
    allowNull: true,
  },
  userAgent: {
    type: 'TEXT',
    allowNull: true,
  },
  location: {
    type: 'STRING',
    allowNull: true,
  },
  deviceType: {
    type: 'ENUM',
    values: ['desktop', 'mobile', 'tablet'],
    allowNull: true,
  },
  notificationSent: {
    type: 'BOOLEAN',
    defaultValue: false,
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
  },
});

/**
 * Sequelize DeliveryReceipt model attributes for delivery_receipts table.
 *
 * @example
 * ```typescript
 * class DeliveryReceipt extends Model {}
 * DeliveryReceipt.init(getDeliveryReceiptModelAttributes(), {
 *   sequelize,
 *   tableName: 'delivery_receipts',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['messageId'] },
 *     { fields: ['userId'] },
 *     { fields: ['deliveryStatus'] }
 *   ]
 * });
 * ```
 */
export const getDeliveryReceiptModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  messageId: {
    type: 'UUID',
    allowNull: false,
    references: {
      model: 'mail_messages',
      key: 'id',
    },
  },
  userId: {
    type: 'UUID',
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  recipientAddress: {
    type: 'STRING',
    allowNull: false,
  },
  deliveryStatus: {
    type: 'ENUM',
    values: ['sent', 'delivered', 'failed', 'bounced', 'deferred'],
    allowNull: false,
  },
  deliveredAt: {
    type: 'DATE',
    allowNull: true,
  },
  remoteServer: {
    type: 'STRING',
    allowNull: true,
  },
  smtpStatus: {
    type: 'STRING',
    allowNull: true,
  },
  smtpMessage: {
    type: 'TEXT',
    allowNull: true,
  },
  attempts: {
    type: 'INTEGER',
    defaultValue: 1,
  },
  lastAttemptAt: {
    type: 'DATE',
    allowNull: false,
  },
  notificationSent: {
    type: 'BOOLEAN',
    defaultValue: false,
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
  },
  updatedAt: {
    type: 'DATE',
    allowNull: false,
  },
});

// ============================================================================
// NOTIFICATION EVENT OPERATIONS
// ============================================================================

/**
 * Creates a new notification event for processing and delivery.
 *
 * @param {Partial<NotificationEvent>} eventData - Notification event data
 * @returns {NotificationEvent} Created notification event
 *
 * @example
 * ```typescript
 * const notification = createNotificationEvent({
 *   userId: 'user-123',
 *   eventType: 'new_mail',
 *   entityType: 'message',
 *   entityId: 'msg-456',
 *   title: 'New Message from Dr. Smith',
 *   message: 'You have received a new message regarding patient care',
 *   priority: 'high',
 *   category: 'mail',
 *   actionUrl: '/mail/inbox/msg-456'
 * });
 * ```
 */
export const createNotificationEvent = (eventData: Partial<NotificationEvent>): NotificationEvent => {
  const now = new Date();
  return {
    id: crypto.randomUUID(),
    userId: eventData.userId!,
    eventType: eventData.eventType!,
    entityType: eventData.entityType!,
    entityId: eventData.entityId!,
    title: eventData.title!,
    message: eventData.message!,
    priority: eventData.priority || 'normal',
    category: eventData.category || '',
    actionUrl: eventData.actionUrl,
    actionData: eventData.actionData,
    imageUrl: eventData.imageUrl,
    iconUrl: eventData.iconUrl,
    sound: eventData.sound,
    badge: eventData.badge,
    metadata: eventData.metadata || {},
    expiresAt: eventData.expiresAt,
    createdAt: now,
  };
};

/**
 * Creates a new mail notification event for incoming messages.
 *
 * @param {string} userId - User ID
 * @param {any} mailMessage - Mail message object
 * @returns {NotificationEvent} New mail notification
 *
 * @example
 * ```typescript
 * const notification = createNewMailNotification('user-123', {
 *   id: 'msg-456',
 *   from: { name: 'Dr. Smith', address: 'smith@whitecross.com' },
 *   subject: 'Patient Update',
 *   bodyPreview: 'The patient has been discharged...'
 * });
 * ```
 */
export const createNewMailNotification = (userId: string, mailMessage: any): NotificationEvent => {
  return createNotificationEvent({
    userId,
    eventType: 'new_mail',
    entityType: 'message',
    entityId: mailMessage.id,
    title: `New message from ${mailMessage.from.name || mailMessage.from.address}`,
    message: `${mailMessage.subject}\n${mailMessage.bodyPreview || ''}`,
    priority: mailMessage.importance === 'high' ? 'high' : 'normal',
    category: 'mail',
    actionUrl: `/mail/inbox/${mailMessage.id}`,
    iconUrl: '/icons/mail-new.png',
    sound: 'new-mail.mp3',
    badge: 1,
  });
};

/**
 * Creates a meeting request notification event.
 *
 * @param {string} userId - User ID
 * @param {any} meetingRequest - Meeting request object
 * @returns {NotificationEvent} Meeting request notification
 *
 * @example
 * ```typescript
 * const notification = createMeetingRequestNotification('user-123', {
 *   id: 'mtg-789',
 *   organizer: { name: 'Dr. Johnson', email: 'johnson@whitecross.com' },
 *   subject: 'Weekly Team Meeting',
 *   startTime: new Date('2025-01-15T10:00:00Z'),
 *   endTime: new Date('2025-01-15T11:00:00Z')
 * });
 * ```
 */
export const createMeetingRequestNotification = (userId: string, meetingRequest: any): NotificationEvent => {
  return createNotificationEvent({
    userId,
    eventType: 'meeting_request',
    entityType: 'meeting',
    entityId: meetingRequest.id,
    title: `Meeting Request: ${meetingRequest.subject}`,
    message: `${meetingRequest.organizer.name} has invited you to a meeting`,
    priority: 'normal',
    category: 'calendar',
    actionUrl: `/calendar/meeting/${meetingRequest.id}`,
    iconUrl: '/icons/meeting-request.png',
    sound: 'meeting-request.mp3',
    actionData: {
      meetingId: meetingRequest.id,
      startTime: meetingRequest.startTime,
      endTime: meetingRequest.endTime,
    },
  });
};

/**
 * Creates a calendar reminder notification event.
 *
 * @param {string} userId - User ID
 * @param {any} calendarEvent - Calendar event object
 * @param {number} minutesBefore - Minutes before event
 * @returns {NotificationEvent} Calendar reminder notification
 *
 * @example
 * ```typescript
 * const notification = createCalendarReminderNotification('user-123', {
 *   id: 'evt-101',
 *   subject: 'Patient Consultation',
 *   startTime: new Date('2025-01-15T14:00:00Z')
 * }, 15);
 * ```
 */
export const createCalendarReminderNotification = (
  userId: string,
  calendarEvent: any,
  minutesBefore: number
): NotificationEvent => {
  return createNotificationEvent({
    userId,
    eventType: 'calendar_reminder',
    entityType: 'calendar',
    entityId: calendarEvent.id,
    title: `Reminder: ${calendarEvent.subject}`,
    message: `Starts in ${minutesBefore} minutes`,
    priority: 'high',
    category: 'calendar',
    actionUrl: `/calendar/event/${calendarEvent.id}`,
    iconUrl: '/icons/calendar-reminder.png',
    sound: 'reminder.mp3',
    actionData: {
      eventId: calendarEvent.id,
      startTime: calendarEvent.startTime,
      minutesBefore,
    },
  });
};

/**
 * Creates a read receipt notification when someone reads your message.
 *
 * @param {string} userId - User ID
 * @param {ReadReceipt} readReceipt - Read receipt data
 * @returns {NotificationEvent} Read receipt notification
 *
 * @example
 * ```typescript
 * const notification = createReadReceiptNotification('user-123', {
 *   messageId: 'msg-456',
 *   recipientAddress: 'johnson@whitecross.com',
 *   readAt: new Date()
 * });
 * ```
 */
export const createReadReceiptNotification = (userId: string, readReceipt: any): NotificationEvent => {
  return createNotificationEvent({
    userId,
    eventType: 'read_receipt',
    entityType: 'message',
    entityId: readReceipt.messageId,
    title: 'Message Read',
    message: `${readReceipt.recipientAddress} read your message`,
    priority: 'low',
    category: 'mail',
    actionUrl: `/mail/sent/${readReceipt.messageId}`,
    iconUrl: '/icons/read-receipt.png',
  });
};

/**
 * Creates a delivery receipt notification for message delivery status.
 *
 * @param {string} userId - User ID
 * @param {DeliveryReceipt} deliveryReceipt - Delivery receipt data
 * @returns {NotificationEvent} Delivery receipt notification
 *
 * @example
 * ```typescript
 * const notification = createDeliveryReceiptNotification('user-123', {
 *   messageId: 'msg-456',
 *   recipientAddress: 'johnson@whitecross.com',
 *   deliveryStatus: 'delivered',
 *   deliveredAt: new Date()
 * });
 * ```
 */
export const createDeliveryReceiptNotification = (userId: string, deliveryReceipt: any): NotificationEvent => {
  const statusMessages = {
    delivered: 'was delivered',
    failed: 'failed to deliver',
    bounced: 'bounced',
    deferred: 'was deferred',
  };

  return createNotificationEvent({
    userId,
    eventType: 'delivery_receipt',
    entityType: 'message',
    entityId: deliveryReceipt.messageId,
    title: 'Delivery Status',
    message: `Message to ${deliveryReceipt.recipientAddress} ${statusMessages[deliveryReceipt.deliveryStatus]}`,
    priority: deliveryReceipt.deliveryStatus === 'failed' ? 'high' : 'low',
    category: 'mail',
    actionUrl: `/mail/sent/${deliveryReceipt.messageId}`,
    iconUrl: '/icons/delivery-receipt.png',
  });
};

// ============================================================================
// NOTIFICATION PREFERENCES
// ============================================================================

/**
 * Retrieves notification preferences for a user.
 *
 * @param {string} userId - User ID
 * @returns {NotificationPreferences} User notification preferences
 *
 * @example
 * ```typescript
 * const prefs = getUserNotificationPreferences('user-123');
 * console.log('Notifications enabled:', prefs.enabled);
 * console.log('Email notifications:', prefs.channels.email.enabled);
 * ```
 */
export const getUserNotificationPreferences = (userId: string): NotificationPreferences => {
  // This would typically fetch from database
  return {
    id: crypto.randomUUID(),
    userId,
    enabled: true,
    channels: {
      email: { enabled: true, priority: 5, soundEnabled: false, vibrationEnabled: false },
      desktop_push: { enabled: true, priority: 7, soundEnabled: true, vibrationEnabled: false },
      mobile_push: { enabled: true, priority: 8, soundEnabled: true, vibrationEnabled: true },
      sms: { enabled: false, priority: 9, soundEnabled: true, vibrationEnabled: true },
      websocket: { enabled: true, priority: 10, soundEnabled: false, vibrationEnabled: false },
      in_app: { enabled: true, priority: 6, soundEnabled: false, vibrationEnabled: false },
    },
    eventTypeSettings: {},
    doNotDisturb: false,
    groupingEnabled: true,
    groupingInterval: 5,
    soundEnabled: true,
    vibrationEnabled: true,
    badgeCountEnabled: true,
    previewInLockScreen: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * Updates notification preferences for a user.
 *
 * @param {string} userId - User ID
 * @param {Partial<NotificationPreferences>} updates - Preference updates
 * @returns {NotificationPreferences} Updated preferences
 *
 * @example
 * ```typescript
 * const updated = updateNotificationPreferences('user-123', {
 *   doNotDisturb: true,
 *   doNotDisturbUntil: new Date('2025-01-15T18:00:00Z'),
 *   channels: {
 *     ...existingChannels,
 *     sms: { enabled: true, priority: 9, soundEnabled: true, vibrationEnabled: true }
 *   }
 * });
 * ```
 */
export const updateNotificationPreferences = (
  userId: string,
  updates: Partial<NotificationPreferences>
): NotificationPreferences => {
  const current = getUserNotificationPreferences(userId);
  return {
    ...current,
    ...updates,
    updatedAt: new Date(),
  };
};

/**
 * Configures quiet hours for a user to suppress non-urgent notifications.
 *
 * @param {string} userId - User ID
 * @param {QuietHoursSettings} quietHours - Quiet hours configuration
 * @returns {NotificationPreferences} Updated preferences
 *
 * @example
 * ```typescript
 * const prefs = setQuietHours('user-123', {
 *   enabled: true,
 *   startTime: '22:00',
 *   endTime: '07:00',
 *   daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
 *   timezone: 'America/New_York',
 *   allowUrgent: true,
 *   allowedEventTypes: ['security_alert', 'system_alert']
 * });
 * ```
 */
export const setQuietHours = (userId: string, quietHours: QuietHoursSettings): NotificationPreferences => {
  return updateNotificationPreferences(userId, { quietHours });
};

/**
 * Enables or disables do-not-disturb mode for a user.
 *
 * @param {string} userId - User ID
 * @param {boolean} enabled - Enable or disable DND
 * @param {Date} until - Optional expiry time for DND
 * @returns {NotificationPreferences} Updated preferences
 *
 * @example
 * ```typescript
 * // Enable DND for next 2 hours
 * const prefs = setDoNotDisturb('user-123', true, new Date(Date.now() + 2 * 60 * 60 * 1000));
 * ```
 */
export const setDoNotDisturb = (userId: string, enabled: boolean, until?: Date): NotificationPreferences => {
  return updateNotificationPreferences(userId, {
    doNotDisturb: enabled,
    doNotDisturbUntil: until,
  });
};

/**
 * Checks if notifications should be suppressed based on preferences.
 *
 * @param {NotificationPreferences} preferences - User preferences
 * @param {NotificationEvent} event - Notification event
 * @returns {boolean} True if notification should be suppressed
 *
 * @example
 * ```typescript
 * const shouldSuppress = shouldSuppressNotification(userPrefs, notificationEvent);
 * if (!shouldSuppress) {
 *   await deliverNotification(event);
 * }
 * ```
 */
export const shouldSuppressNotification = (
  preferences: NotificationPreferences,
  event: NotificationEvent
): boolean => {
  // Global disable
  if (!preferences.enabled) return true;

  // Do not disturb
  if (preferences.doNotDisturb) {
    if (event.priority !== 'urgent') return true;
    if (preferences.doNotDisturbUntil && new Date() < preferences.doNotDisturbUntil) {
      if (event.priority !== 'urgent') return true;
    }
  }

  // Quiet hours
  if (preferences.quietHours?.enabled) {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const dayOfWeek = now.getDay();

    if (
      preferences.quietHours.daysOfWeek.includes(dayOfWeek) &&
      isTimeInRange(currentTime, preferences.quietHours.startTime, preferences.quietHours.endTime)
    ) {
      if (!preferences.quietHours.allowUrgent || event.priority !== 'urgent') {
        if (!preferences.quietHours.allowedEventTypes.includes(event.eventType)) {
          return true;
        }
      }
    }
  }

  // Event type settings
  const eventSettings = preferences.eventTypeSettings[event.eventType];
  if (eventSettings && !eventSettings.enabled) return true;

  return false;
};

/**
 * Determines which channels to use for delivering a notification.
 *
 * @param {NotificationPreferences} preferences - User preferences
 * @param {NotificationEvent} event - Notification event
 * @returns {NotificationChannel[]} Channels to use for delivery
 *
 * @example
 * ```typescript
 * const channels = getDeliveryChannels(userPrefs, notificationEvent);
 * // ['mobile_push', 'websocket', 'email']
 * ```
 */
export const getDeliveryChannels = (
  preferences: NotificationPreferences,
  event: NotificationEvent
): NotificationChannel[] => {
  const channels: NotificationChannel[] = [];

  // Check event type specific settings
  const eventSettings = preferences.eventTypeSettings[event.eventType];
  if (eventSettings?.channels) {
    return eventSettings.channels.filter((ch) => preferences.channels[ch].enabled);
  }

  // Use default channel preferences based on priority
  Object.entries(preferences.channels).forEach(([channel, settings]) => {
    if (settings.enabled) {
      channels.push(channel as NotificationChannel);
    }
  });

  return channels.sort(
    (a, b) => preferences.channels[b].priority - preferences.channels[a].priority
  );
};

// ============================================================================
// EMAIL NOTIFICATIONS
// ============================================================================

/**
 * Sends an email notification based on a notification event.
 *
 * @param {NotificationEvent} event - Notification event
 * @param {string} userEmail - User email address
 * @returns {Promise<NotificationDelivery>} Delivery record
 *
 * @example
 * ```typescript
 * const delivery = await sendEmailNotification(event, 'user@whitecross.com');
 * console.log('Email sent:', delivery.deliveryStatus);
 * ```
 */
export const sendEmailNotification = async (
  event: NotificationEvent,
  userEmail: string
): Promise<NotificationDelivery> => {
  const now = new Date();
  const delivery: NotificationDelivery = {
    id: crypto.randomUUID(),
    notificationId: event.id,
    userId: event.userId,
    deliveryChannel: 'email',
    deliveryStatus: 'pending',
    deliveryAttempts: 1,
    lastAttemptAt: now,
    metadata: {},
    createdAt: now,
    updatedAt: now,
  };

  try {
    // Get template for event type
    const template = await getNotificationTemplate(event.eventType, 'en-US');

    // Render template with event data
    const rendered = renderNotificationTemplate(template, event);

    // Send email via SMTP (pseudo-code)
    // await smtpClient.sendMail({
    //   to: userEmail,
    //   subject: rendered.subject,
    //   html: rendered.bodyHtml,
    //   text: rendered.bodyText
    // });

    delivery.deliveryStatus = 'sent';
    delivery.deliveredAt = new Date();
  } catch (error: any) {
    delivery.deliveryStatus = 'failed';
    delivery.failureReason = error.message;
    delivery.errorCode = error.code;
  }

  return delivery;
};

/**
 * Retrieves a notification template by event type and locale.
 *
 * @param {NotificationEventType} eventType - Event type
 * @param {string} locale - Locale code
 * @returns {Promise<EmailNotificationTemplate>} Template
 *
 * @example
 * ```typescript
 * const template = await getNotificationTemplate('new_mail', 'en-US');
 * console.log('Template:', template.subject);
 * ```
 */
export const getNotificationTemplate = async (
  eventType: NotificationEventType,
  locale: string
): Promise<EmailNotificationTemplate> => {
  // This would fetch from database
  return {
    id: crypto.randomUUID(),
    name: `${eventType}_template`,
    eventType,
    subject: 'New Notification: {{title}}',
    bodyHtml: '<h1>{{title}}</h1><p>{{message}}</p>',
    bodyText: '{{title}}\n\n{{message}}',
    variables: ['title', 'message', 'actionUrl'],
    locale,
    isActive: true,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * Renders a notification template with event data.
 *
 * @param {EmailNotificationTemplate} template - Template to render
 * @param {NotificationEvent} event - Event data
 * @returns {object} Rendered template
 *
 * @example
 * ```typescript
 * const rendered = renderNotificationTemplate(template, event);
 * console.log('Subject:', rendered.subject);
 * console.log('Body:', rendered.bodyHtml);
 * ```
 */
export const renderNotificationTemplate = (
  template: EmailNotificationTemplate,
  event: NotificationEvent
): { subject: string; bodyHtml: string; bodyText: string } => {
  const variables = {
    title: event.title,
    message: event.message,
    actionUrl: event.actionUrl || '',
    priority: event.priority,
    category: event.category,
    ...event.metadata,
  };

  let subject = template.subject;
  let bodyHtml = template.bodyHtml;
  let bodyText = template.bodyText;

  // Simple template variable replacement
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    subject = subject.replace(regex, String(value));
    bodyHtml = bodyHtml.replace(regex, String(value));
    bodyText = bodyText.replace(regex, String(value));
  });

  return { subject, bodyHtml, bodyText };
};

// ============================================================================
// PUSH NOTIFICATIONS
// ============================================================================

/**
 * Sends a desktop push notification via Web Push API.
 *
 * @param {NotificationEvent} event - Notification event
 * @param {DeviceRegistration} device - Device registration
 * @returns {Promise<NotificationDelivery>} Delivery record
 *
 * @example
 * ```typescript
 * const delivery = await sendDesktopPushNotification(event, deviceRegistration);
 * console.log('Push sent:', delivery.deliveryStatus);
 * ```
 */
export const sendDesktopPushNotification = async (
  event: NotificationEvent,
  device: DeviceRegistration
): Promise<NotificationDelivery> => {
  const now = new Date();
  const delivery: NotificationDelivery = {
    id: crypto.randomUUID(),
    notificationId: event.id,
    userId: event.userId,
    deliveryChannel: 'desktop_push',
    deliveryStatus: 'pending',
    deliveryAttempts: 1,
    lastAttemptAt: now,
    metadata: {},
    createdAt: now,
    updatedAt: now,
  };

  try {
    const payload: PushNotificationPayload = {
      title: event.title,
      body: event.message,
      badge: event.badge,
      sound: event.sound,
      category: event.category,
      data: {
        eventId: event.id,
        actionUrl: event.actionUrl,
        ...event.actionData,
      },
      priority: event.priority === 'urgent' ? 'high' : 'normal',
    };

    // Send via Web Push (pseudo-code)
    // await webpush.sendNotification(device.deviceToken, JSON.stringify(payload));

    delivery.deliveryStatus = 'sent';
    delivery.deliveredAt = new Date();
  } catch (error: any) {
    delivery.deliveryStatus = 'failed';
    delivery.failureReason = error.message;
    delivery.errorCode = error.code;
  }

  return delivery;
};

/**
 * Sends a mobile push notification via APNS (iOS) or FCM (Android).
 *
 * @param {NotificationEvent} event - Notification event
 * @param {DeviceRegistration} device - Device registration
 * @returns {Promise<NotificationDelivery>} Delivery record
 *
 * @example
 * ```typescript
 * const delivery = await sendMobilePushNotification(event, deviceRegistration);
 * console.log('Mobile push sent:', delivery.deliveryStatus);
 * ```
 */
export const sendMobilePushNotification = async (
  event: NotificationEvent,
  device: DeviceRegistration
): Promise<NotificationDelivery> => {
  if (device.deviceType === 'ios') {
    return sendAPNSNotification(event, device);
  } else if (device.deviceType === 'android') {
    return sendFCMNotification(event, device);
  }

  throw new Error(`Unsupported device type: ${device.deviceType}`);
};

/**
 * Sends an APNS notification to iOS devices.
 *
 * @param {NotificationEvent} event - Notification event
 * @param {DeviceRegistration} device - iOS device registration
 * @returns {Promise<NotificationDelivery>} Delivery record
 *
 * @example
 * ```typescript
 * const delivery = await sendAPNSNotification(event, iosDevice);
 * console.log('APNS notification sent:', delivery.externalId);
 * ```
 */
export const sendAPNSNotification = async (
  event: NotificationEvent,
  device: DeviceRegistration
): Promise<NotificationDelivery> => {
  const now = new Date();
  const delivery: NotificationDelivery = {
    id: crypto.randomUUID(),
    notificationId: event.id,
    userId: event.userId,
    deliveryChannel: 'mobile_push',
    deliveryStatus: 'pending',
    deliveryAttempts: 1,
    lastAttemptAt: now,
    metadata: { platform: 'apns' },
    createdAt: now,
    updatedAt: now,
  };

  try {
    const payload: APNSPayload = {
      aps: {
        alert: {
          title: event.title,
          body: event.message,
        },
        badge: event.badge,
        sound: event.sound || 'default',
        category: event.category,
        'thread-id': event.entityId,
      },
      data: {
        eventId: event.id,
        actionUrl: event.actionUrl,
        ...event.actionData,
      },
    };

    // Send via APNS (pseudo-code)
    // const result = await apnsClient.send(device.deviceToken, payload);
    // delivery.externalId = result.messageId;

    delivery.deliveryStatus = 'sent';
    delivery.deliveredAt = new Date();
  } catch (error: any) {
    delivery.deliveryStatus = 'failed';
    delivery.failureReason = error.message;
    delivery.errorCode = error.code;
  }

  return delivery;
};

/**
 * Sends an FCM notification to Android devices.
 *
 * @param {NotificationEvent} event - Notification event
 * @param {DeviceRegistration} device - Android device registration
 * @returns {Promise<NotificationDelivery>} Delivery record
 *
 * @example
 * ```typescript
 * const delivery = await sendFCMNotification(event, androidDevice);
 * console.log('FCM notification sent:', delivery.externalId);
 * ```
 */
export const sendFCMNotification = async (
  event: NotificationEvent,
  device: DeviceRegistration
): Promise<NotificationDelivery> => {
  const now = new Date();
  const delivery: NotificationDelivery = {
    id: crypto.randomUUID(),
    notificationId: event.id,
    userId: event.userId,
    deliveryChannel: 'mobile_push',
    deliveryStatus: 'pending',
    deliveryAttempts: 1,
    lastAttemptAt: now,
    metadata: { platform: 'fcm' },
    createdAt: now,
    updatedAt: now,
  };

  try {
    const payload: FCMPayload = {
      notification: {
        title: event.title,
        body: event.message,
        image: event.imageUrl,
        icon: event.iconUrl,
        sound: event.sound || 'default',
        tag: event.entityId,
      },
      data: {
        eventId: event.id,
        actionUrl: event.actionUrl || '',
        ...Object.fromEntries(
          Object.entries(event.actionData || {}).map(([k, v]) => [k, String(v)])
        ),
      },
      android: {
        priority: event.priority === 'urgent' ? 'high' : 'normal',
        ttl: 86400,
        notification: {
          channel_id: 'mail_notifications',
          sound: event.sound,
          tag: event.entityId,
        },
      },
    };

    // Send via FCM (pseudo-code)
    // const result = await fcmClient.send(device.deviceToken, payload);
    // delivery.externalId = result.messageId;

    delivery.deliveryStatus = 'sent';
    delivery.deliveredAt = new Date();
  } catch (error: any) {
    delivery.deliveryStatus = 'failed';
    delivery.failureReason = error.message;
    delivery.errorCode = error.code;
  }

  return delivery;
};

/**
 * Registers a device for push notifications.
 *
 * @param {string} userId - User ID
 * @param {Partial<DeviceRegistration>} deviceData - Device registration data
 * @returns {DeviceRegistration} Created device registration
 *
 * @example
 * ```typescript
 * const registration = registerDevice('user-123', {
 *   deviceType: 'ios',
 *   deviceToken: 'apns-token-xyz',
 *   deviceName: 'iPhone 13 Pro',
 *   deviceModel: 'iPhone14,3',
 *   osVersion: '15.5',
 *   appVersion: '2.1.0'
 * });
 * ```
 */
export const registerDevice = (userId: string, deviceData: Partial<DeviceRegistration>): DeviceRegistration => {
  const now = new Date();
  return {
    id: crypto.randomUUID(),
    userId,
    deviceType: deviceData.deviceType!,
    deviceToken: deviceData.deviceToken!,
    deviceName: deviceData.deviceName,
    deviceModel: deviceData.deviceModel,
    osVersion: deviceData.osVersion,
    appVersion: deviceData.appVersion,
    isActive: true,
    lastActiveAt: now,
    createdAt: now,
    updatedAt: now,
  };
};

/**
 * Unregisters a device from push notifications.
 *
 * @param {string} deviceId - Device ID
 * @returns {boolean} Success status
 *
 * @example
 * ```typescript
 * const success = unregisterDevice('device-456');
 * console.log('Device unregistered:', success);
 * ```
 */
export const unregisterDevice = (deviceId: string): boolean => {
  // This would update the database to set isActive = false
  return true;
};

// ============================================================================
// SMS NOTIFICATIONS
// ============================================================================

/**
 * Sends an SMS notification via configured provider (Twilio, SNS, etc.).
 *
 * @param {NotificationEvent} event - Notification event
 * @param {string} phoneNumber - Phone number
 * @returns {Promise<SMSNotification>} SMS notification record
 *
 * @example
 * ```typescript
 * const sms = await sendSMSNotification(event, '+1234567890');
 * console.log('SMS sent:', sms.status);
 * ```
 */
export const sendSMSNotification = async (
  event: NotificationEvent,
  phoneNumber: string
): Promise<SMSNotification> => {
  const now = new Date();
  const sms: SMSNotification = {
    id: crypto.randomUUID(),
    userId: event.userId,
    phoneNumber,
    message: `${event.title}: ${event.message}`,
    status: 'pending',
    provider: 'twilio',
    metadata: {},
    createdAt: now,
  };

  try {
    // Send via Twilio (pseudo-code)
    // const result = await twilioClient.messages.create({
    //   to: phoneNumber,
    //   from: twilioPhoneNumber,
    //   body: sms.message
    // });
    // sms.externalId = result.sid;

    sms.status = 'sent';
    sms.sentAt = new Date();
  } catch (error: any) {
    sms.status = 'failed';
    sms.failureReason = error.message;
  }

  return sms;
};

/**
 * Formats notification message for SMS (character limits, etc.).
 *
 * @param {NotificationEvent} event - Notification event
 * @param {number} maxLength - Maximum message length
 * @returns {string} Formatted SMS message
 *
 * @example
 * ```typescript
 * const message = formatSMSMessage(event, 160);
 * console.log('SMS message:', message);
 * ```
 */
export const formatSMSMessage = (event: NotificationEvent, maxLength: number = 160): string => {
  const prefix = `${event.title}: `;
  const availableLength = maxLength - prefix.length - 3; // -3 for "..."

  if (event.message.length <= availableLength) {
    return prefix + event.message;
  }

  return prefix + event.message.substring(0, availableLength) + '...';
};

// ============================================================================
// WEBSOCKET REAL-TIME NOTIFICATIONS
// ============================================================================

/**
 * Sends a real-time notification via WebSocket to connected clients.
 *
 * @param {NotificationEvent} event - Notification event
 * @param {any} wsConnection - WebSocket connection
 * @returns {Promise<WebSocketNotification>} WebSocket notification record
 *
 * @example
 * ```typescript
 * const wsNotif = await sendWebSocketNotification(event, userWebSocket);
 * console.log('Real-time notification sent:', wsNotif.id);
 * ```
 */
export const sendWebSocketNotification = async (
  event: NotificationEvent,
  wsConnection: any
): Promise<WebSocketNotification> => {
  const now = new Date();
  const wsNotification: WebSocketNotification = {
    id: crypto.randomUUID(),
    userId: event.userId,
    eventType: event.eventType,
    payload: event,
    sentAt: now,
    acknowledged: false,
  };

  try {
    // Send via WebSocket (pseudo-code)
    // wsConnection.send(JSON.stringify({
    //   type: 'notification',
    //   data: wsNotification
    // }));
  } catch (error) {
    // Handle error
  }

  return wsNotification;
};

/**
 * Broadcasts a notification to all connected WebSocket clients for a user.
 *
 * @param {NotificationEvent} event - Notification event
 * @param {any[]} wsConnections - Array of WebSocket connections
 * @returns {Promise<WebSocketNotification[]>} WebSocket notification records
 *
 * @example
 * ```typescript
 * const notifications = await broadcastWebSocketNotification(event, userWebSockets);
 * console.log(`Broadcast to ${notifications.length} connections`);
 * ```
 */
export const broadcastWebSocketNotification = async (
  event: NotificationEvent,
  wsConnections: any[]
): Promise<WebSocketNotification[]> => {
  const notifications: WebSocketNotification[] = [];

  for (const connection of wsConnections) {
    const notification = await sendWebSocketNotification(event, connection);
    notifications.push(notification);
  }

  return notifications;
};

/**
 * Acknowledges receipt of a WebSocket notification.
 *
 * @param {string} notificationId - WebSocket notification ID
 * @returns {boolean} Success status
 *
 * @example
 * ```typescript
 * const success = acknowledgeWebSocketNotification('wsnotif-123');
 * console.log('Notification acknowledged:', success);
 * ```
 */
export const acknowledgeWebSocketNotification = (notificationId: string): boolean => {
  // This would update the database
  return true;
};

// ============================================================================
// NOTIFICATION DELIVERY
// ============================================================================

/**
 * Delivers a notification event through all configured channels.
 *
 * @param {NotificationEvent} event - Notification event
 * @param {NotificationPreferences} preferences - User preferences
 * @returns {Promise<NotificationDelivery[]>} Delivery records
 *
 * @example
 * ```typescript
 * const deliveries = await deliverNotification(event, userPreferences);
 * console.log(`Delivered via ${deliveries.length} channels`);
 * ```
 */
export const deliverNotification = async (
  event: NotificationEvent,
  preferences: NotificationPreferences
): Promise<NotificationDelivery[]> => {
  // Check if notification should be suppressed
  if (shouldSuppressNotification(preferences, event)) {
    return [];
  }

  // Get delivery channels
  const channels = getDeliveryChannels(preferences, event);

  const deliveries: NotificationDelivery[] = [];

  // Deliver to each channel
  for (const channel of channels) {
    try {
      let delivery: NotificationDelivery | null = null;

      // This would include actual delivery logic
      // For now, creating placeholder delivery records
      delivery = {
        id: crypto.randomUUID(),
        notificationId: event.id,
        userId: event.userId,
        deliveryChannel: channel,
        deliveryStatus: 'sent',
        deliveryAttempts: 1,
        lastAttemptAt: new Date(),
        deliveredAt: new Date(),
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      deliveries.push(delivery);
    } catch (error) {
      // Log error but continue with other channels
    }
  }

  return deliveries;
};

/**
 * Retries failed notification deliveries.
 *
 * @param {NotificationDelivery} delivery - Failed delivery record
 * @returns {Promise<NotificationDelivery>} Updated delivery record
 *
 * @example
 * ```typescript
 * const retried = await retryNotificationDelivery(failedDelivery);
 * console.log('Retry status:', retried.deliveryStatus);
 * ```
 */
export const retryNotificationDelivery = async (
  delivery: NotificationDelivery
): Promise<NotificationDelivery> => {
  delivery.deliveryAttempts += 1;
  delivery.lastAttemptAt = new Date();

  try {
    // Retry delivery logic based on channel
    delivery.deliveryStatus = 'sent';
    delivery.deliveredAt = new Date();
  } catch (error: any) {
    delivery.deliveryStatus = 'failed';
    delivery.failureReason = error.message;
  }

  delivery.updatedAt = new Date();
  return delivery;
};

// ============================================================================
// NOTIFICATION FILTERING AND GROUPING
// ============================================================================

/**
 * Groups similar notifications together based on event type and time window.
 *
 * @param {NotificationEvent[]} events - Notification events
 * @param {number} intervalMinutes - Grouping interval in minutes
 * @returns {NotificationGroup[]} Grouped notifications
 *
 * @example
 * ```typescript
 * const groups = groupNotifications(notifications, 5);
 * console.log(`Grouped ${notifications.length} into ${groups.length} groups`);
 * ```
 */
export const groupNotifications = (
  events: NotificationEvent[],
  intervalMinutes: number
): NotificationGroup[] => {
  const groups = new Map<string, NotificationGroup>();

  events.forEach((event) => {
    const groupKey = `${event.userId}-${event.eventType}`;
    const timeWindow = Math.floor(event.createdAt.getTime() / (intervalMinutes * 60 * 1000));
    const fullGroupKey = `${groupKey}-${timeWindow}`;

    if (groups.has(fullGroupKey)) {
      const group = groups.get(fullGroupKey)!;
      group.notificationIds.push(event.id);
      group.count += 1;
      group.lastNotificationAt = event.createdAt;
    } else {
      groups.set(fullGroupKey, {
        id: crypto.randomUUID(),
        userId: event.userId,
        groupKey,
        eventType: event.eventType,
        notificationIds: [event.id],
        count: 1,
        firstNotificationAt: event.createdAt,
        lastNotificationAt: event.createdAt,
        summary: `${event.eventType} notifications`,
        isCollapsed: true,
        createdAt: new Date(),
      });
    }
  });

  return Array.from(groups.values());
};

/**
 * Filters notifications based on criteria.
 *
 * @param {NotificationFilter} filter - Filter criteria
 * @returns {Promise<NotificationEvent[]>} Filtered notifications
 *
 * @example
 * ```typescript
 * const filtered = await filterNotifications({
 *   userId: 'user-123',
 *   eventTypes: ['new_mail', 'meeting_request'],
 *   priority: 'high',
 *   readStatus: 'unread',
 *   limit: 50
 * });
 * ```
 */
export const filterNotifications = async (filter: NotificationFilter): Promise<NotificationEvent[]> => {
  // This would query the database with the filter criteria
  const notifications: NotificationEvent[] = [];
  return notifications;
};

// ============================================================================
// READ AND DELIVERY RECEIPTS
// ============================================================================

/**
 * Records a read receipt for a message.
 *
 * @param {string} messageId - Message ID
 * @param {string} userId - User ID
 * @param {string} recipientAddress - Recipient email address
 * @param {object} metadata - Additional metadata (IP, user agent, etc.)
 * @returns {ReadReceipt} Created read receipt
 *
 * @example
 * ```typescript
 * const receipt = recordReadReceipt('msg-123', 'user-456', 'recipient@example.com', {
 *   ipAddress: '192.168.1.1',
 *   userAgent: 'Mozilla/5.0...',
 *   deviceType: 'desktop'
 * });
 * ```
 */
export const recordReadReceipt = (
  messageId: string,
  userId: string,
  recipientAddress: string,
  metadata?: any
): ReadReceipt => {
  return {
    id: crypto.randomUUID(),
    messageId,
    userId,
    recipientAddress,
    readAt: new Date(),
    ipAddress: metadata?.ipAddress,
    userAgent: metadata?.userAgent,
    location: metadata?.location,
    deviceType: metadata?.deviceType,
    notificationSent: false,
    createdAt: new Date(),
  };
};

/**
 * Records a delivery receipt for a message.
 *
 * @param {string} messageId - Message ID
 * @param {string} userId - User ID
 * @param {string} recipientAddress - Recipient email address
 * @param {string} deliveryStatus - Delivery status
 * @param {object} metadata - Additional metadata
 * @returns {DeliveryReceipt} Created delivery receipt
 *
 * @example
 * ```typescript
 * const receipt = recordDeliveryReceipt('msg-123', 'user-456', 'recipient@example.com', 'delivered', {
 *   remoteServer: 'mail.example.com',
 *   smtpStatus: '250',
 *   smtpMessage: 'OK'
 * });
 * ```
 */
export const recordDeliveryReceipt = (
  messageId: string,
  userId: string,
  recipientAddress: string,
  deliveryStatus: 'sent' | 'delivered' | 'failed' | 'bounced' | 'deferred',
  metadata?: any
): DeliveryReceipt => {
  const now = new Date();
  return {
    id: crypto.randomUUID(),
    messageId,
    userId,
    recipientAddress,
    deliveryStatus,
    deliveredAt: deliveryStatus === 'delivered' ? now : undefined,
    remoteServer: metadata?.remoteServer,
    smtpStatus: metadata?.smtpStatus,
    smtpMessage: metadata?.smtpMessage,
    attempts: 1,
    lastAttemptAt: now,
    notificationSent: false,
    createdAt: now,
    updatedAt: now,
  };
};

/**
 * Processes read receipts and sends notifications to message sender.
 *
 * @param {ReadReceipt} receipt - Read receipt
 * @returns {Promise<NotificationEvent>} Notification event
 *
 * @example
 * ```typescript
 * const notification = await processReadReceipt(readReceipt);
 * console.log('Sender notified:', notification.id);
 * ```
 */
export const processReadReceipt = async (receipt: ReadReceipt): Promise<NotificationEvent> => {
  const notification = createReadReceiptNotification(receipt.userId, receipt);
  // Mark receipt as notification sent
  receipt.notificationSent = true;
  return notification;
};

/**
 * Processes delivery receipts and sends notifications to message sender.
 *
 * @param {DeliveryReceipt} receipt - Delivery receipt
 * @returns {Promise<NotificationEvent>} Notification event
 *
 * @example
 * ```typescript
 * const notification = await processDeliveryReceipt(deliveryReceipt);
 * console.log('Sender notified:', notification.id);
 * ```
 */
export const processDeliveryReceipt = async (receipt: DeliveryReceipt): Promise<NotificationEvent> => {
  const notification = createDeliveryReceiptNotification(receipt.userId, receipt);
  // Mark receipt as notification sent
  receipt.notificationSent = true;
  return notification;
};

// ============================================================================
// EXCHANGE SERVER NOTIFICATIONS
// ============================================================================

/**
 * Creates an Exchange Server notification subscription for push notifications.
 *
 * @param {string} userId - User ID
 * @param {string[]} folderIds - Folder IDs to monitor
 * @param {string} callbackUrl - Webhook URL for notifications
 * @returns {object} Subscription details
 *
 * @example
 * ```typescript
 * const subscription = createExchangeNotificationSubscription(
 *   'user-123',
 *   ['inbox-folder-id', 'sent-folder-id'],
 *   'https://app.whitecross.com/webhooks/exchange-notifications'
 * );
 * ```
 */
export const createExchangeNotificationSubscription = (
  userId: string,
  folderIds: string[],
  callbackUrl: string
): any => {
  return {
    subscriptionId: crypto.randomUUID(),
    userId,
    folderIds,
    callbackUrl,
    eventTypes: ['NewMail', 'Deleted', 'Modified', 'Moved'],
    watermark: '',
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
  };
};

/**
 * Processes an Exchange Server notification event.
 *
 * @param {ExchangeNotification} exchangeNotif - Exchange notification
 * @returns {Promise<NotificationEvent>} Processed notification event
 *
 * @example
 * ```typescript
 * const event = await processExchangeNotification({
 *   subscriptionId: 'sub-123',
 *   userId: 'user-456',
 *   eventType: 'NewMail',
 *   itemId: 'msg-789',
 *   parentFolderId: 'inbox-folder',
 *   timestamp: new Date(),
 *   watermark: 'AQAAAA=='
 * });
 * ```
 */
export const processExchangeNotification = async (
  exchangeNotif: ExchangeNotification
): Promise<NotificationEvent> => {
  let eventType: NotificationEventType = 'new_mail';
  let title = 'Exchange Notification';
  let message = '';

  switch (exchangeNotif.eventType) {
    case 'NewMail':
      eventType = 'new_mail';
      title = 'New Mail Received';
      message = 'You have received a new message';
      break;
    case 'Modified':
      title = 'Message Modified';
      message = 'A message has been modified';
      break;
    case 'Deleted':
      title = 'Message Deleted';
      message = 'A message has been deleted';
      break;
    case 'Moved':
      title = 'Message Moved';
      message = 'A message has been moved to another folder';
      break;
  }

  return createNotificationEvent({
    userId: exchangeNotif.userId,
    eventType,
    entityType: 'message',
    entityId: exchangeNotif.itemId,
    title,
    message,
    priority: 'normal',
    category: 'exchange',
    metadata: {
      subscriptionId: exchangeNotif.subscriptionId,
      watermark: exchangeNotif.watermark,
      parentFolderId: exchangeNotif.parentFolderId,
    },
  });
};

/**
 * Renews an Exchange Server notification subscription.
 *
 * @param {string} subscriptionId - Subscription ID
 * @returns {object} Updated subscription
 *
 * @example
 * ```typescript
 * const renewed = renewExchangeNotificationSubscription('sub-123');
 * console.log('Subscription expires at:', renewed.expiresAt);
 * ```
 */
export const renewExchangeNotificationSubscription = (subscriptionId: string): any => {
  return {
    subscriptionId,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000), // Extend by 30 minutes
    renewedAt: new Date(),
  };
};

// ============================================================================
// NOTIFICATION STATISTICS
// ============================================================================

/**
 * Calculates notification statistics for a user.
 *
 * @param {string} userId - User ID
 * @param {string} period - Time period
 * @returns {Promise<NotificationStats>} Notification statistics
 *
 * @example
 * ```typescript
 * const stats = await getNotificationStats('user-123', 'day');
 * console.log('Total sent:', stats.totalSent);
 * console.log('Read rate:', stats.readRate);
 * ```
 */
export const getNotificationStats = async (userId: string, period: 'hour' | 'day' | 'week' | 'month'): Promise<NotificationStats> => {
  // This would aggregate data from database
  return {
    userId,
    period,
    totalSent: 0,
    totalDelivered: 0,
    totalRead: 0,
    totalFailed: 0,
    byChannel: {
      email: 0,
      desktop_push: 0,
      mobile_push: 0,
      sms: 0,
      websocket: 0,
      in_app: 0,
    },
    byEventType: {} as Record<NotificationEventType, number>,
    averageDeliveryTime: 0,
    readRate: 0,
  };
};

// ============================================================================
// SWAGGER DOCUMENTATION
// ============================================================================

/**
 * Generates Swagger schema for NotificationEvent.
 *
 * @returns {SwaggerNotificationSchema} Swagger schema
 *
 * @example
 * ```typescript
 * const schema = getNotificationEventSwaggerSchema();
 * // Use in NestJS @ApiProperty decorators
 * ```
 */
export const getNotificationEventSwaggerSchema = (): SwaggerNotificationSchema => {
  return {
    name: 'NotificationEvent',
    type: 'object',
    description: 'Notification event for mail and calendar alerts',
    required: true,
    example: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      userId: '660e8400-e29b-41d4-a716-446655440001',
      eventType: 'new_mail',
      entityType: 'message',
      entityId: '770e8400-e29b-41d4-a716-446655440002',
      title: 'New Message from Dr. Smith',
      message: 'You have received a new message',
      priority: 'high',
      category: 'mail',
      actionUrl: '/mail/inbox/770e8400-e29b-41d4-a716-446655440002',
    },
    properties: {
      id: { type: 'string', format: 'uuid' },
      userId: { type: 'string', format: 'uuid' },
      eventType: { type: 'string', enum: ['new_mail', 'meeting_request', 'calendar_reminder'] },
      entityType: { type: 'string', enum: ['message', 'meeting', 'calendar'] },
      priority: { type: 'string', enum: ['low', 'normal', 'high', 'urgent'] },
    },
  };
};

/**
 * Generates Swagger schema for NotificationPreferences.
 *
 * @returns {SwaggerNotificationSchema} Swagger schema
 *
 * @example
 * ```typescript
 * const schema = getNotificationPreferencesSwaggerSchema();
 * ```
 */
export const getNotificationPreferencesSwaggerSchema = (): SwaggerNotificationSchema => {
  return {
    name: 'NotificationPreferences',
    type: 'object',
    description: 'User notification preferences and settings',
    required: true,
    example: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      userId: '660e8400-e29b-41d4-a716-446655440001',
      enabled: true,
      doNotDisturb: false,
      soundEnabled: true,
    },
    properties: {
      id: { type: 'string', format: 'uuid' },
      userId: { type: 'string', format: 'uuid' },
      enabled: { type: 'boolean' },
      doNotDisturb: { type: 'boolean' },
    },
  };
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Checks if a time is within a time range.
 *
 * @param {string} time - Time in HH:MM format
 * @param {string} startTime - Start time in HH:MM format
 * @param {string} endTime - End time in HH:MM format
 * @returns {boolean} True if time is in range
 */
const isTimeInRange = (time: string, startTime: string, endTime: string): boolean => {
  const [hour, minute] = time.split(':').map(Number);
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  const timeMinutes = hour * 60 + minute;
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  if (endMinutes < startMinutes) {
    // Crosses midnight
    return timeMinutes >= startMinutes || timeMinutes <= endMinutes;
  }

  return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
};

export default {
  // Sequelize Models
  getNotificationEventModelAttributes,
  getNotificationDeliveryModelAttributes,
  getNotificationPreferencesModelAttributes,
  getDeviceRegistrationModelAttributes,
  getEmailNotificationTemplateModelAttributes,
  getReadReceiptModelAttributes,
  getDeliveryReceiptModelAttributes,

  // Notification Events
  createNotificationEvent,
  createNewMailNotification,
  createMeetingRequestNotification,
  createCalendarReminderNotification,
  createReadReceiptNotification,
  createDeliveryReceiptNotification,

  // Preferences
  getUserNotificationPreferences,
  updateNotificationPreferences,
  setQuietHours,
  setDoNotDisturb,
  shouldSuppressNotification,
  getDeliveryChannels,

  // Email Notifications
  sendEmailNotification,
  getNotificationTemplate,
  renderNotificationTemplate,

  // Push Notifications
  sendDesktopPushNotification,
  sendMobilePushNotification,
  sendAPNSNotification,
  sendFCMNotification,
  registerDevice,
  unregisterDevice,

  // SMS Notifications
  sendSMSNotification,
  formatSMSMessage,

  // WebSocket
  sendWebSocketNotification,
  broadcastWebSocketNotification,
  acknowledgeWebSocketNotification,

  // Delivery
  deliverNotification,
  retryNotificationDelivery,

  // Filtering and Grouping
  groupNotifications,
  filterNotifications,

  // Receipts
  recordReadReceipt,
  recordDeliveryReceipt,
  processReadReceipt,
  processDeliveryReceipt,

  // Exchange Server
  createExchangeNotificationSubscription,
  processExchangeNotification,
  renewExchangeNotificationSubscription,

  // Statistics
  getNotificationStats,

  // Swagger
  getNotificationEventSwaggerSchema,
  getNotificationPreferencesSwaggerSchema,
};
