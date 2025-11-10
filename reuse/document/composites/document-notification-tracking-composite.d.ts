/**
 * LOC: DOCNOTIFTRACK001
 * File: /reuse/document/composites/document-notification-tracking-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *   - nodemailer
 *   - twilio
 *   - firebase-admin
 *   - handlebars
 *   - node-cron
 *   - ../document-notification-advanced-kit
 *   - ../document-workflow-kit
 *   - ../document-analytics-kit
 *   - ../document-audit-trail-advanced-kit
 *   - ../document-api-integration-kit
 *
 * DOWNSTREAM (imported by):
 *   - Multi-channel notification services
 *   - Email/SMS delivery systems
 *   - Activity tracking modules
 *   - Reminder scheduling services
 *   - Healthcare alert systems
 *   - Patient notification dashboards
 */
/**
 * File: /reuse/document/composites/document-notification-tracking-composite.ts
 * Locator: WC-NOTIFICATION-TRACKING-COMPOSITE-001
 * Purpose: Comprehensive Notification & Tracking Composite - Production-ready email, SMS, push, activity tracking, reminders
 *
 * Upstream: Composed from document-notification-advanced-kit, document-workflow-kit, document-analytics-kit, document-audit-trail-advanced-kit, document-api-integration-kit
 * Downstream: ../backend/*, Notification services, Email systems, SMS gateways, Activity trackers, Alert handlers
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, nodemailer 6.x, twilio, firebase-admin
 * Exports: 47 utility functions for multi-channel notifications, delivery tracking, reminders, alerts, templates, analytics
 *
 * LLM Context: Enterprise-grade notification and tracking composite for White Cross healthcare platform.
 * Provides comprehensive notification capabilities including multi-channel delivery (email, SMS, push, in-app),
 * dynamic template engine with Handlebars, real-time delivery tracking and status monitoring, user preference
 * management with opt-in/opt-out, scheduled and recurring notifications, delivery rate limiting, retry mechanisms,
 * notification batching, analytics and reporting, HIPAA-compliant audit logging, emergency broadcast capabilities,
 * activity tracking, document view/edit events, reminder scheduling, and webhook integrations. Exceeds SendGrid
 * and Twilio capabilities with healthcare-specific features. Composes functions from notification-advanced, workflow,
 * analytics, audit-trail, and API integration kits to provide unified notification operations for patient alerts,
 * appointment reminders, test result notifications, document sharing alerts, and healthcare communications.
 */
import { Model } from 'sequelize-typescript';
/**
 * Notification channel types
 */
export declare enum NotificationChannel {
    EMAIL = "EMAIL",
    SMS = "SMS",
    PUSH = "PUSH",
    IN_APP = "IN_APP",
    WEBHOOK = "WEBHOOK"
}
/**
 * Notification priority levels
 */
export declare enum NotificationPriority {
    URGENT = "URGENT",
    HIGH = "HIGH",
    NORMAL = "NORMAL",
    LOW = "LOW"
}
/**
 * Delivery status
 */
export declare enum DeliveryStatus {
    PENDING = "PENDING",
    QUEUED = "QUEUED",
    SENDING = "SENDING",
    SENT = "SENT",
    DELIVERED = "DELIVERED",
    FAILED = "FAILED",
    BOUNCED = "BOUNCED",
    REJECTED = "REJECTED",
    READ = "READ",
    CLICKED = "CLICKED"
}
/**
 * Activity event types
 */
export declare enum ActivityEventType {
    DOCUMENT_VIEWED = "DOCUMENT_VIEWED",
    DOCUMENT_DOWNLOADED = "DOCUMENT_DOWNLOADED",
    DOCUMENT_SHARED = "DOCUMENT_SHARED",
    DOCUMENT_SIGNED = "DOCUMENT_SIGNED",
    DOCUMENT_EDITED = "DOCUMENT_EDITED",
    DOCUMENT_COMMENTED = "DOCUMENT_COMMENTED",
    DOCUMENT_DELETED = "DOCUMENT_DELETED",
    USER_LOGIN = "USER_LOGIN",
    USER_LOGOUT = "USER_LOGOUT",
    PERMISSION_CHANGED = "PERMISSION_CHANGED"
}
/**
 * Reminder frequency
 */
export declare enum ReminderFrequency {
    ONCE = "ONCE",
    HOURLY = "HOURLY",
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    MONTHLY = "MONTHLY",
    CUSTOM = "CUSTOM"
}
/**
 * Notification configuration
 */
export interface NotificationConfig {
    id: string;
    channels: NotificationChannel[];
    priority: NotificationPriority;
    templateId?: string;
    variables?: Record<string, any>;
    scheduledAt?: Date;
    expiresAt?: Date;
    retryAttempts?: number;
    retryDelay?: number;
    metadata?: Record<string, any>;
}
/**
 * Notification result
 */
export interface NotificationResult {
    id: string;
    recipientId: string;
    channel: NotificationChannel;
    status: DeliveryStatus;
    sentAt?: Date;
    deliveredAt?: Date;
    readAt?: Date;
    clickedAt?: Date;
    errorMessage?: string;
    metadata?: Record<string, any>;
}
/**
 * Email notification data
 */
export interface EmailNotification {
    to: string[];
    cc?: string[];
    bcc?: string[];
    subject: string;
    body: string;
    attachments?: Array<{
        filename: string;
        content: Buffer;
        contentType?: string;
    }>;
    replyTo?: string;
    headers?: Record<string, string>;
}
/**
 * SMS notification data
 */
export interface SMSNotification {
    to: string;
    body: string;
    from?: string;
    mediaUrl?: string[];
}
/**
 * Push notification data
 */
export interface PushNotification {
    userId: string;
    title: string;
    body: string;
    data?: Record<string, any>;
    badge?: number;
    sound?: string;
    icon?: string;
    clickAction?: string;
}
/**
 * Activity tracking data
 */
export interface ActivityEvent {
    id: string;
    eventType: ActivityEventType;
    userId: string;
    resourceId: string;
    resourceType: string;
    timestamp: Date;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
}
/**
 * Reminder configuration
 */
export interface ReminderConfig {
    id: string;
    userId: string;
    resourceId: string;
    resourceType: string;
    frequency: ReminderFrequency;
    channels: NotificationChannel[];
    message: string;
    scheduledAt: Date;
    nextScheduledAt?: Date;
    enabled: boolean;
    metadata?: Record<string, any>;
}
/**
 * Notification template
 */
export interface NotificationTemplate {
    id: string;
    name: string;
    channel: NotificationChannel;
    subject?: string;
    body: string;
    variables: string[];
    isDefault: boolean;
    metadata?: Record<string, any>;
}
/**
 * User notification preferences
 */
export interface NotificationPreferences {
    userId: string;
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
    inAppEnabled: boolean;
    quietHoursStart?: string;
    quietHoursEnd?: string;
    frequency: ReminderFrequency;
    categories: Record<string, boolean>;
}
/**
 * Delivery analytics
 */
export interface DeliveryAnalytics {
    totalSent: number;
    totalDelivered: number;
    totalFailed: number;
    totalRead: number;
    totalClicked: number;
    deliveryRate: number;
    openRate: number;
    clickRate: number;
    bounceRate: number;
}
/**
 * Notification Model
 * Stores notification records and delivery status
 */
export declare class NotificationModel extends Model {
    id: string;
    recipientId: string;
    channel: NotificationChannel;
    priority: NotificationPriority;
    templateId?: string;
    content: string;
    status: DeliveryStatus;
    scheduledAt?: Date;
    sentAt?: Date;
    deliveredAt?: Date;
    readAt?: Date;
    clickedAt?: Date;
    retryCount: number;
    errorMessage?: string;
    metadata?: Record<string, any>;
}
/**
 * Activity Event Model
 * Stores activity tracking events
 */
export declare class ActivityEventModel extends Model {
    id: string;
    eventType: ActivityEventType;
    userId: string;
    resourceId: string;
    resourceType: string;
    timestamp: Date;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, any>;
}
/**
 * Reminder Model
 * Stores scheduled reminders
 */
export declare class ReminderModel extends Model {
    id: string;
    userId: string;
    resourceId: string;
    resourceType: string;
    frequency: ReminderFrequency;
    channels: NotificationChannel[];
    message: string;
    scheduledAt: Date;
    nextScheduledAt?: Date;
    enabled: boolean;
    metadata?: Record<string, any>;
}
/**
 * Notification Template Model
 * Stores notification templates
 */
export declare class NotificationTemplateModel extends Model {
    id: string;
    name: string;
    channel: NotificationChannel;
    subject?: string;
    body: string;
    variables: string[];
    isDefault: boolean;
    metadata?: Record<string, any>;
}
/**
 * Sends multi-channel notification to recipient.
 * Supports email, SMS, push, and in-app notifications with priority handling and scheduling.
 *
 * @param {NotificationConfig} config - Notification configuration
 * @returns {Promise<NotificationResult[]>} Delivery results for each channel
 * @throws {Error} If config is invalid or no channels specified
 * @throws {Error} If delivery fails for critical priority notifications
 *
 * @example
 * ```typescript
 * // Success case
 * const results = await sendMultiChannelNotification({
 *   id: crypto.randomUUID(),
 *   channels: [NotificationChannel.EMAIL, NotificationChannel.SMS],
 *   priority: NotificationPriority.HIGH,
 *   templateId: 'tpl_welcome',
 *   variables: { name: 'John Doe' }
 * });
 * console.log('Sent:', results.length, 'notifications');
 *
 * // Error case
 * try {
 *   await sendMultiChannelNotification({ id: '', channels: [], priority: NotificationPriority.NORMAL });
 * } catch (error) {
 *   console.error('Failed:', error.message);
 * }
 * ```
 *
 * REST API: POST /api/v1/notifications/send
 * Request:
 * {
 *   "recipientId": "user123",
 *   "channels": ["EMAIL", "SMS"],
 *   "priority": "HIGH",
 *   "templateId": "tpl_welcome",
 *   "variables": { "name": "John Doe" }
 * }
 * Response: 200 OK
 * {
 *   "results": [{
 *     "channel": "EMAIL",
 *     "status": "SENT",
 *     "sentAt": "2025-01-15T10:30:00Z"
 *   }]
 * }
 */
export declare const sendMultiChannelNotification: (config: NotificationConfig) => Promise<NotificationResult[]>;
/**
 * Sends email notification using SMTP/nodemailer.
 * Validates email addresses and handles attachments.
 *
 * @param {EmailNotification} email - Email notification data
 * @returns {Promise<NotificationResult>} Email delivery result
 * @throws {Error} If email data is invalid or SMTP delivery fails
 *
 * @example
 * ```typescript
 * const result = await sendEmailNotification({
 *   to: ['patient@example.com'],
 *   subject: 'Test Results Available',
 *   body: '<p>Your test results are ready for review.</p>',
 *   attachments: [{ filename: 'results.pdf', content: pdfBuffer }]
 * });
 * console.log('Email status:', result.status);
 * ```
 */
export declare const sendEmailNotification: (email: EmailNotification) => Promise<NotificationResult>;
/**
 * Sends SMS notification using Twilio SMS gateway.
 * Validates phone numbers and enforces message length limits.
 *
 * @param {SMSNotification} sms - SMS notification data
 * @returns {Promise<NotificationResult>} SMS delivery result
 * @throws {Error} If SMS data is invalid or delivery fails
 *
 * @example
 * ```typescript
 * const result = await sendSMSNotification({
 *   to: '+15551234567',
 *   body: 'Your appointment is tomorrow at 2pm',
 *   from: '+15559876543'
 * });
 * console.log('SMS delivered:', result.status === DeliveryStatus.SENT);
 * ```
 */
export declare const sendSMSNotification: (sms: SMSNotification) => Promise<NotificationResult>;
/**
 * Sends push notification using Firebase.
 *
 * @param {PushNotification} push - Push notification data
 * @returns {Promise<NotificationResult>} Delivery result
 */
export declare const sendPushNotification: (push: PushNotification) => Promise<NotificationResult>;
/**
 * Creates in-app notification.
 *
 * @param {string} userId - User identifier
 * @param {string} message - Notification message
 * @param {Record<string, any>} data - Additional data
 * @returns {Promise<NotificationResult>} Notification result
 */
export declare const createInAppNotification: (userId: string, message: string, data?: Record<string, any>) => Promise<NotificationResult>;
/**
 * Schedules notification for future delivery.
 *
 * @param {NotificationConfig} config - Notification configuration
 * @param {Date} scheduledAt - Scheduled delivery time
 * @returns {Promise<string>} Scheduled notification ID
 */
export declare const scheduleNotification: (config: NotificationConfig, scheduledAt: Date) => Promise<string>;
/**
 * Cancels scheduled notification.
 *
 * @param {string} notificationId - Notification identifier
 * @returns {Promise<void>}
 */
export declare const cancelScheduledNotification: (notificationId: string) => Promise<void>;
/**
 * Tracks notification delivery status.
 *
 * @param {string} notificationId - Notification identifier
 * @returns {Promise<NotificationResult>} Current delivery status
 */
export declare const trackDeliveryStatus: (notificationId: string) => Promise<NotificationResult>;
/**
 * Marks notification as read.
 *
 * @param {string} notificationId - Notification identifier
 * @returns {Promise<void>}
 */
export declare const markNotificationAsRead: (notificationId: string) => Promise<void>;
/**
 * Tracks notification click event.
 *
 * @param {string} notificationId - Notification identifier
 * @param {string} linkUrl - Clicked link URL
 * @returns {Promise<void>}
 */
export declare const trackNotificationClick: (notificationId: string, linkUrl?: string) => Promise<void>;
/**
 * Retrieves user notification preferences.
 *
 * @param {string} userId - User identifier
 * @returns {Promise<NotificationPreferences>} User preferences
 */
export declare const getUserNotificationPreferences: (userId: string) => Promise<NotificationPreferences>;
/**
 * Updates user notification preferences.
 *
 * @param {string} userId - User identifier
 * @param {Partial<NotificationPreferences>} preferences - Preference updates
 * @returns {Promise<NotificationPreferences>} Updated preferences
 */
export declare const updateNotificationPreferences: (userId: string, preferences: Partial<NotificationPreferences>) => Promise<NotificationPreferences>;
/**
 * Creates notification template with variables.
 *
 * @param {string} name - Template name
 * @param {NotificationChannel} channel - Target channel
 * @param {string} body - Template body with {{variables}}
 * @param {string[]} variables - Variable names
 * @returns {Promise<NotificationTemplate>} Created template
 */
export declare const createNotificationTemplate: (name: string, channel: NotificationChannel, body: string, variables: string[]) => Promise<NotificationTemplate>;
/**
 * Renders notification template with variables.
 *
 * @param {NotificationTemplate} template - Template configuration
 * @param {Record<string, any>} variables - Variable values
 * @returns {string} Rendered content
 */
export declare const renderNotificationTemplate: (template: NotificationTemplate, variables: Record<string, any>) => string;
/**
 * Sends batch notifications to multiple recipients.
 *
 * @param {string[]} recipientIds - Recipient user IDs
 * @param {NotificationConfig} config - Notification configuration
 * @returns {Promise<NotificationResult[]>} Batch delivery results
 */
export declare const sendBatchNotifications: (recipientIds: string[], config: NotificationConfig) => Promise<NotificationResult[]>;
/**
 * Creates recurring reminder.
 *
 * @param {ReminderConfig} config - Reminder configuration
 * @returns {Promise<ReminderConfig>} Created reminder
 */
export declare const createRecurringReminder: (config: ReminderConfig) => Promise<ReminderConfig>;
/**
 * Updates reminder schedule.
 *
 * @param {string} reminderId - Reminder identifier
 * @param {Date} nextScheduledAt - Next scheduled time
 * @returns {Promise<void>}
 */
export declare const updateReminderSchedule: (reminderId: string, nextScheduledAt: Date) => Promise<void>;
/**
 * Disables reminder.
 *
 * @param {string} reminderId - Reminder identifier
 * @returns {Promise<void>}
 */
export declare const disableReminder: (reminderId: string) => Promise<void>;
/**
 * Retrieves upcoming reminders for user.
 *
 * @param {string} userId - User identifier
 * @param {number} limit - Maximum number of reminders
 * @returns {Promise<ReminderConfig[]>} Upcoming reminders
 */
export declare const getUpcomingReminders: (userId: string, limit?: number) => Promise<ReminderConfig[]>;
/**
 * Tracks activity event for document or resource.
 *
 * @param {ActivityEventType} eventType - Event type
 * @param {string} userId - User identifier
 * @param {string} resourceId - Resource identifier
 * @param {string} resourceType - Resource type
 * @param {Record<string, any>} metadata - Event metadata
 * @returns {Promise<ActivityEvent>} Created activity event
 */
export declare const trackActivityEvent: (eventType: ActivityEventType, userId: string, resourceId: string, resourceType: string, metadata?: Record<string, any>) => Promise<ActivityEvent>;
/**
 * Retrieves activity timeline for resource.
 *
 * @param {string} resourceId - Resource identifier
 * @param {number} limit - Maximum number of events
 * @returns {Promise<ActivityEvent[]>} Activity events
 */
export declare const getActivityTimeline: (resourceId: string, limit?: number) => Promise<ActivityEvent[]>;
/**
 * Retrieves user activity history.
 *
 * @param {string} userId - User identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<ActivityEvent[]>} User activity events
 */
export declare const getUserActivityHistory: (userId: string, startDate: Date, endDate: Date) => Promise<ActivityEvent[]>;
/**
 * Sends emergency broadcast notification.
 *
 * @param {string} message - Emergency message
 * @param {string[]} recipientIds - Recipient user IDs
 * @param {NotificationChannel[]} channels - Notification channels
 * @returns {Promise<NotificationResult[]>} Broadcast results
 */
export declare const sendEmergencyBroadcast: (message: string, recipientIds: string[], channels: NotificationChannel[]) => Promise<NotificationResult[]>;
/**
 * Retrieves notification delivery analytics.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<DeliveryAnalytics>} Analytics data
 */
export declare const getDeliveryAnalytics: (startDate: Date, endDate: Date) => Promise<DeliveryAnalytics>;
/**
 * Retries failed notification.
 *
 * @param {string} notificationId - Notification identifier
 * @returns {Promise<NotificationResult>} Retry result
 */
export declare const retryFailedNotification: (notificationId: string) => Promise<NotificationResult>;
/**
 * Validates notification rate limits.
 *
 * @param {string} userId - User identifier
 * @param {NotificationChannel} channel - Notification channel
 * @returns {Promise<boolean>} Whether rate limit allows sending
 */
export declare const validateRateLimits: (userId: string, channel: NotificationChannel) => Promise<boolean>;
/**
 * Unsubscribes user from notification category.
 *
 * @param {string} userId - User identifier
 * @param {string} category - Notification category
 * @returns {Promise<void>}
 */
export declare const unsubscribeFromCategory: (userId: string, category: string) => Promise<void>;
/**
 * Generates notification digest for batching.
 *
 * @param {string} userId - User identifier
 * @param {Date} startDate - Digest start date
 * @param {Date} endDate - Digest end date
 * @returns {Promise<any>} Notification digest
 */
export declare const generateNotificationDigest: (userId: string, startDate: Date, endDate: Date) => Promise<any>;
/**
 * Archives old notifications.
 *
 * @param {Date} beforeDate - Archive notifications before this date
 * @returns {Promise<number>} Number of archived notifications
 */
export declare const archiveOldNotifications: (beforeDate: Date) => Promise<number>;
/**
 * Sends webhook notification to external endpoint.
 *
 * @param {string} webhookUrl - Webhook URL
 * @param {Record<string, any>} payload - Notification payload
 * @returns {Promise<NotificationResult>} Webhook delivery result
 */
export declare const sendWebhookNotification: (webhookUrl: string, payload: Record<string, any>) => Promise<NotificationResult>;
/**
 * Validates email address format.
 *
 * @param {string} email - Email address
 * @returns {boolean} Whether email is valid
 */
export declare const validateEmailAddress: (email: string) => boolean;
/**
 * Validates phone number format.
 *
 * @param {string} phone - Phone number
 * @returns {boolean} Whether phone is valid
 */
export declare const validatePhoneNumber: (phone: string) => boolean;
/**
 * Retrieves notification by ID.
 *
 * @param {string} notificationId - Notification identifier
 * @returns {Promise<any>} Notification data
 */
export declare const getNotificationById: (notificationId: string) => Promise<any>;
/**
 * Retrieves user notifications with pagination.
 *
 * @param {string} userId - User identifier
 * @param {number} page - Page number
 * @param {number} pageSize - Page size
 * @returns {Promise<any>} Paginated notifications
 */
export declare const getUserNotifications: (userId: string, page?: number, pageSize?: number) => Promise<any>;
/**
 * Bulk marks notifications as read.
 *
 * @param {string[]} notificationIds - Notification identifiers
 * @returns {Promise<number>} Number of notifications marked
 */
export declare const bulkMarkAsRead: (notificationIds: string[]) => Promise<number>;
/**
 * Retrieves unread notification count for a user.
 * Queries database for notifications in unread status.
 *
 * @param {string} userId - User identifier
 * @returns {Promise<number>} Unread notification count
 * @throws {Error} If userId is invalid or database query fails
 *
 * @example
 * ```typescript
 * const count = await getUnreadNotificationCount('user123');
 * console.log('Unread notifications:', count);
 * ```
 */
export declare const getUnreadNotificationCount: (userId: string) => Promise<number>;
/**
 * Sends test notification for debugging.
 *
 * @param {NotificationChannel} channel - Test channel
 * @param {string} recipient - Test recipient
 * @returns {Promise<NotificationResult>} Test result
 */
export declare const sendTestNotification: (channel: NotificationChannel, recipient: string) => Promise<NotificationResult>;
/**
 * Generates notification report.
 *
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<any>} Notification report
 */
export declare const generateNotificationReport: (startDate: Date, endDate: Date) => Promise<any>;
/**
 * Configures notification retry policy.
 *
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} retryDelayMs - Delay between retries
 * @returns {Promise<any>} Retry policy configuration
 */
export declare const configureRetryPolicy: (maxRetries: number, retryDelayMs: number) => Promise<any>;
/**
 * Validates notification template syntax.
 *
 * @param {string} templateBody - Template body
 * @returns {boolean} Whether template is valid
 */
export declare const validateTemplateSyntax: (templateBody: string) => boolean;
/**
 * Processes a batch of queued notifications.
 * Retrieves pending notifications from queue and attempts delivery.
 *
 * @param {number} batchSize - Maximum number of notifications to process (default 100)
 * @returns {Promise<number>} Number of notifications successfully processed
 * @throws {Error} If batch processing fails
 *
 * @example
 * ```typescript
 * const processed = await processNotificationQueue(50);
 * console.log('Processed', processed, 'notifications from queue');
 * ```
 */
export declare const processNotificationQueue: (batchSize?: number) => Promise<number>;
/**
 * Monitors notification delivery health.
 *
 * @returns {Promise<any>} Health status
 */
export declare const monitorDeliveryHealth: () => Promise<any>;
/**
 * NotificationTrackingService
 *
 * Production-ready NestJS service for comprehensive notification and activity tracking.
 * Provides multi-channel notification delivery, user preferences, templates, reminders,
 * activity tracking, and delivery analytics for healthcare communications.
 *
 * @example
 * ```typescript
 * @Controller('notifications')
 * export class NotificationController {
 *   constructor(private readonly notificationService: NotificationTrackingService) {}
 *
 *   @Post('send')
 *   async send(@Body() dto: NotificationConfigDto) {
 *     return this.notificationService.sendNotification(dto);
 *   }
 *
 *   @Get('user/:userId/unread-count')
 *   async getUnreadCount(@Param('userId') userId: string) {
 *     return this.notificationService.getUnreadCount(userId);
 *   }
 * }
 * ```
 */
export declare class NotificationTrackingService {
    /**
     * Sends multi-channel notification with priority handling.
     *
     * @param {NotificationConfig} config - Notification configuration
     * @returns {Promise<NotificationResult[]>} Delivery results for each channel
     * @throws {Error} If notification sending fails
     */
    sendNotification(config: NotificationConfig): Promise<NotificationResult[]>;
    /**
     * Sends email notification.
     *
     * @param {EmailNotification} email - Email data
     * @returns {Promise<NotificationResult>} Email delivery result
     */
    sendEmail(email: EmailNotification): Promise<NotificationResult>;
    /**
     * Sends SMS notification.
     *
     * @param {SMSNotification} sms - SMS data
     * @returns {Promise<NotificationResult>} SMS delivery result
     */
    sendSMS(sms: SMSNotification): Promise<NotificationResult>;
    /**
     * Sends push notification.
     *
     * @param {PushNotification} push - Push notification data
     * @returns {Promise<NotificationResult>} Push delivery result
     */
    sendPush(push: PushNotification): Promise<NotificationResult>;
    /**
     * Gets user notification preferences.
     *
     * @param {string} userId - User identifier
     * @returns {Promise<NotificationPreferences>} User preferences
     */
    getUserPreferences(userId: string): Promise<NotificationPreferences>;
    /**
     * Updates user notification preferences.
     *
     * @param {string} userId - User identifier
     * @param {Partial<NotificationPreferences>} preferences - Preferences to update
     * @returns {Promise<NotificationPreferences>} Updated preferences
     */
    updatePreferences(userId: string, preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences>;
    /**
     * Creates a recurring reminder.
     *
     * @param {ReminderConfig} reminder - Reminder configuration
     * @returns {Promise<ReminderConfig>} Created reminder
     */
    createReminder(reminder: ReminderConfig): Promise<ReminderConfig>;
    /**
     * Gets upcoming reminders for a user.
     *
     * @param {string} userId - User identifier
     * @param {number} days - Number of days to look ahead
     * @returns {Promise<ReminderConfig[]>} Upcoming reminders
     */
    getUpcomingReminders(userId: string, days?: number): Promise<ReminderConfig[]>;
    /**
     * Tracks an activity event.
     *
     * @param {ActivityEventType} eventType - Event type
     * @param {string} userId - User identifier
     * @param {string} resourceId - Resource identifier
     * @param {string} resourceType - Resource type
     * @returns {Promise<ActivityEvent>} Tracked event
     */
    trackActivity(eventType: ActivityEventType, userId: string, resourceId: string, resourceType: string): Promise<ActivityEvent>;
    /**
     * Gets activity timeline for a resource.
     *
     * @param {string} resourceId - Resource identifier
     * @param {number} limit - Maximum events to return
     * @returns {Promise<ActivityEvent[]>} Activity events
     */
    getActivityTimeline(resourceId: string, limit?: number): Promise<ActivityEvent[]>;
    /**
     * Gets delivery analytics for a date range.
     *
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Promise<DeliveryAnalytics>} Delivery analytics
     */
    getAnalytics(startDate: Date, endDate: Date): Promise<DeliveryAnalytics>;
    /**
     * Gets unread notification count for a user.
     *
     * @param {string} userId - User identifier
     * @returns {Promise<number>} Unread count
     */
    getUnreadCount(userId: string): Promise<number>;
    /**
     * Marks multiple notifications as read.
     *
     * @param {string[]} notificationIds - Notification identifiers
     * @returns {Promise<number>} Number marked as read
     */
    markAsRead(notificationIds: string[]): Promise<number>;
    /**
     * Sends emergency broadcast notification.
     *
     * @param {string[]} userIds - User identifiers
     * @param {string} message - Emergency message
     * @returns {Promise<NotificationResult[]>} Broadcast results
     */
    sendEmergencyBroadcast(userIds: string[], message: string): Promise<NotificationResult[]>;
    /**
     * Processes notification queue batch.
     *
     * @param {number} batchSize - Batch size
     * @returns {Promise<number>} Number processed
     */
    processQueue(batchSize?: number): Promise<number>;
    /**
     * Monitors delivery health status.
     *
     * @returns {Promise<any>} Health status
     */
    monitorHealth(): Promise<any>;
}
declare const _default: {
    NotificationModel: typeof NotificationModel;
    ActivityEventModel: typeof ActivityEventModel;
    ReminderModel: typeof ReminderModel;
    NotificationTemplateModel: typeof NotificationTemplateModel;
    sendMultiChannelNotification: (config: NotificationConfig) => Promise<NotificationResult[]>;
    sendEmailNotification: (email: EmailNotification) => Promise<NotificationResult>;
    sendSMSNotification: (sms: SMSNotification) => Promise<NotificationResult>;
    sendPushNotification: (push: PushNotification) => Promise<NotificationResult>;
    createInAppNotification: (userId: string, message: string, data?: Record<string, any>) => Promise<NotificationResult>;
    scheduleNotification: (config: NotificationConfig, scheduledAt: Date) => Promise<string>;
    cancelScheduledNotification: (notificationId: string) => Promise<void>;
    trackDeliveryStatus: (notificationId: string) => Promise<NotificationResult>;
    markNotificationAsRead: (notificationId: string) => Promise<void>;
    trackNotificationClick: (notificationId: string, linkUrl?: string) => Promise<void>;
    getUserNotificationPreferences: (userId: string) => Promise<NotificationPreferences>;
    updateNotificationPreferences: (userId: string, preferences: Partial<NotificationPreferences>) => Promise<NotificationPreferences>;
    createNotificationTemplate: (name: string, channel: NotificationChannel, body: string, variables: string[]) => Promise<NotificationTemplate>;
    renderNotificationTemplate: (template: NotificationTemplate, variables: Record<string, any>) => string;
    sendBatchNotifications: (recipientIds: string[], config: NotificationConfig) => Promise<NotificationResult[]>;
    createRecurringReminder: (config: ReminderConfig) => Promise<ReminderConfig>;
    updateReminderSchedule: (reminderId: string, nextScheduledAt: Date) => Promise<void>;
    disableReminder: (reminderId: string) => Promise<void>;
    getUpcomingReminders: (userId: string, limit?: number) => Promise<ReminderConfig[]>;
    trackActivityEvent: (eventType: ActivityEventType, userId: string, resourceId: string, resourceType: string, metadata?: Record<string, any>) => Promise<ActivityEvent>;
    getActivityTimeline: (resourceId: string, limit?: number) => Promise<ActivityEvent[]>;
    getUserActivityHistory: (userId: string, startDate: Date, endDate: Date) => Promise<ActivityEvent[]>;
    sendEmergencyBroadcast: (message: string, recipientIds: string[], channels: NotificationChannel[]) => Promise<NotificationResult[]>;
    getDeliveryAnalytics: (startDate: Date, endDate: Date) => Promise<DeliveryAnalytics>;
    retryFailedNotification: (notificationId: string) => Promise<NotificationResult>;
    validateRateLimits: (userId: string, channel: NotificationChannel) => Promise<boolean>;
    unsubscribeFromCategory: (userId: string, category: string) => Promise<void>;
    generateNotificationDigest: (userId: string, startDate: Date, endDate: Date) => Promise<any>;
    archiveOldNotifications: (beforeDate: Date) => Promise<number>;
    sendWebhookNotification: (webhookUrl: string, payload: Record<string, any>) => Promise<NotificationResult>;
    validateEmailAddress: (email: string) => boolean;
    validatePhoneNumber: (phone: string) => boolean;
    getNotificationById: (notificationId: string) => Promise<any>;
    getUserNotifications: (userId: string, page?: number, pageSize?: number) => Promise<any>;
    bulkMarkAsRead: (notificationIds: string[]) => Promise<number>;
    getUnreadNotificationCount: (userId: string) => Promise<number>;
    sendTestNotification: (channel: NotificationChannel, recipient: string) => Promise<NotificationResult>;
    generateNotificationReport: (startDate: Date, endDate: Date) => Promise<any>;
    configureRetryPolicy: (maxRetries: number, retryDelayMs: number) => Promise<any>;
    validateTemplateSyntax: (templateBody: string) => boolean;
    processNotificationQueue: (batchSize?: number) => Promise<number>;
    monitorDeliveryHealth: () => Promise<any>;
    NotificationTrackingService: typeof NotificationTrackingService;
};
export default _default;
//# sourceMappingURL=document-notification-tracking-composite.d.ts.map