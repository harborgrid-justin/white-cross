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
import { Model } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
/**
 * Notification Channel
 */
export declare enum NotificationChannel {
    EMAIL = "email",
    SMS = "sms",
    PUSH = "push",
    IN_APP = "in_app",
    WEBHOOK = "webhook",
    SLACK = "slack",
    TEAMS = "teams"
}
/**
 * Notification Priority
 */
export declare enum NotificationPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    URGENT = "urgent",
    CRITICAL = "critical"
}
/**
 * Notification Status
 */
export declare enum NotificationStatus {
    PENDING = "pending",
    QUEUED = "queued",
    SENDING = "sending",
    SENT = "sent",
    DELIVERED = "delivered",
    FAILED = "failed",
    BOUNCED = "bounced",
    CANCELLED = "cancelled"
}
/**
 * Template Type
 */
export declare enum TemplateType {
    EMAIL = "email",
    SMS = "sms",
    PUSH = "push",
    IN_APP = "in_app"
}
/**
 * Event Type
 */
export declare enum EventType {
    ASSET_CREATED = "asset_created",
    ASSET_UPDATED = "asset_updated",
    ASSET_DELETED = "asset_deleted",
    MAINTENANCE_DUE = "maintenance_due",
    INSPECTION_DUE = "inspection_due",
    WARRANTY_EXPIRING = "warranty_expiring",
    CALIBRATION_DUE = "calibration_due",
    COMPLIANCE_VIOLATION = "compliance_violation",
    THRESHOLD_EXCEEDED = "threshold_exceeded",
    STATUS_CHANGED = "status_changed",
    LOCATION_CHANGED = "location_changed",
    CUSTOM = "custom"
}
/**
 * Escalation Level
 */
export declare enum EscalationLevel {
    LEVEL_1 = "level_1",
    LEVEL_2 = "level_2",
    LEVEL_3 = "level_3",
    LEVEL_4 = "level_4",
    EXECUTIVE = "executive"
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
/**
 * Notification Model
 */
export declare class Notification extends Model {
    id: string;
    recipientId: string;
    subject: string;
    message: string;
    channel: NotificationChannel;
    priority: NotificationPriority;
    status: NotificationStatus;
    templateId?: string;
    templateData?: Record<string, any>;
    scheduledFor?: Date;
    sentAt?: Date;
    deliveredAt?: Date;
    readAt?: Date;
    expiresAt?: Date;
    retryCount: number;
    maxRetries: number;
    errorMessage?: string;
    metadata?: Record<string, any>;
    attachments?: string[];
    batchId?: string;
    createdAt: Date;
    updatedAt: Date;
    template?: NotificationTemplate;
}
/**
 * Notification Rule Model
 */
export declare class NotificationRule extends Model {
    id: string;
    name: string;
    description?: string;
    eventType: EventType;
    conditions?: Record<string, any>;
    recipients: string[];
    channels: NotificationChannel[];
    templateId?: string;
    priority: NotificationPriority;
    isActive: boolean;
    throttleMinutes?: number;
    lastTriggered?: Date;
    triggerCount: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    template?: NotificationTemplate;
}
/**
 * Notification Template Model
 */
export declare class NotificationTemplate extends Model {
    id: string;
    name: string;
    description?: string;
    templateType: TemplateType;
    subject?: string;
    body: string;
    variables?: string[];
    isActive: boolean;
    version: number;
    usageCount: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    notifications?: Notification[];
    rules?: NotificationRule[];
}
/**
 * Escalation Policy Model
 */
export declare class EscalationPolicy extends Model {
    id: string;
    name: string;
    description?: string;
    eventType: EventType;
    levels: EscalationLevel[];
    levelRecipients: Record<EscalationLevel, string[]>;
    levelDelayMinutes: Record<EscalationLevel, number>;
    isActive: boolean;
    triggerCount: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    instances?: EscalationInstance[];
}
/**
 * Escalation Instance Model
 */
export declare class EscalationInstance extends Model {
    id: string;
    policyId: string;
    triggeredBy: string;
    eventData?: Record<string, any>;
    currentLevel: EscalationLevel;
    startedAt: Date;
    nextEscalationAt?: Date;
    isResolved: boolean;
    resolvedAt?: Date;
    resolvedBy?: string;
    resolutionNotes?: string;
    createdAt: Date;
    updatedAt: Date;
    policy?: EscalationPolicy;
}
/**
 * User Notification Preference Model
 */
export declare class UserNotificationPreference extends Model {
    id: string;
    userId: string;
    enabledChannels: NotificationChannel[];
    quietHoursStart?: string;
    quietHoursEnd?: string;
    timezone?: string;
    emailFrequency?: string;
    preferences?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Notification Queue Model
 */
export declare class NotificationQueue extends Model {
    id: string;
    notificationId: string;
    status: NotificationStatus;
    priority: NotificationPriority;
    scheduledFor?: Date;
    batchId?: string;
    attempts: number;
    lastAttemptAt?: Date;
    nextAttemptAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    notification?: Notification;
}
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
export declare function sendNotification(data: NotificationData, transaction?: Transaction): Promise<Notification[]>;
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
export declare function sendBatchNotification(data: BatchNotificationData, transaction?: Transaction): Promise<string>;
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
export declare function queueNotification(notificationId: string, priority: NotificationPriority, scheduledFor?: Date, transaction?: Transaction): Promise<NotificationQueue>;
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
export declare function processNotificationQueue(limit?: number, transaction?: Transaction): Promise<number>;
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
export declare function deliverNotification(notificationId: string, transaction?: Transaction): Promise<Notification>;
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
export declare function markNotificationRead(notificationId: string, transaction?: Transaction): Promise<Notification>;
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
export declare function getUserNotifications(userId: string, unreadOnly?: boolean, limit?: number): Promise<Notification[]>;
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
export declare function createNotificationRule(data: NotificationRuleData, transaction?: Transaction): Promise<NotificationRule>;
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
export declare function evaluateNotificationRules(eventType: EventType, eventData: Record<string, any>, transaction?: Transaction): Promise<Notification[]>;
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
export declare function getActiveNotificationRules(eventType?: EventType): Promise<NotificationRule[]>;
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
export declare function createNotificationTemplate(data: TemplateData, transaction?: Transaction): Promise<NotificationTemplate>;
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
export declare function renderTemplate(template: string, data: Record<string, any>): string;
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
export declare function getActiveTemplates(templateType?: TemplateType): Promise<NotificationTemplate[]>;
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
export declare function createEscalationPolicy(data: EscalationPolicyData, transaction?: Transaction): Promise<EscalationPolicy>;
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
export declare function triggerEscalation(policyId: string, triggeredBy: string, eventData: Record<string, any>, transaction?: Transaction): Promise<EscalationInstance>;
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
export declare function processEscalations(transaction?: Transaction): Promise<number>;
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
export declare function resolveEscalation(instanceId: string, userId: string, notes?: string, transaction?: Transaction): Promise<EscalationInstance>;
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
export declare function setUserPreferences(data: UserPreferenceData, transaction?: Transaction): Promise<UserNotificationPreference>;
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
export declare function getUserPreferences(userId: string): Promise<UserNotificationPreference | null>;
/**
 * Notification Analytics Model
 */
export declare class NotificationAnalytics extends Model {
    id: string;
    notificationId: string;
    templateId?: string;
    sentDate: Date;
    delivered: boolean;
    opened: boolean;
    clicked: boolean;
    bounced: boolean;
    openCount: number;
    clickCount: number;
    firstOpenedAt?: Date;
    lastOpenedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
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
export declare function trackNotificationDelivery(notificationId: string, delivered: boolean, transaction?: Transaction): Promise<NotificationAnalytics>;
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
export declare function trackNotificationOpen(notificationId: string, transaction?: Transaction): Promise<NotificationAnalytics>;
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
export declare function getNotificationAnalyticsReport(startDate: Date, endDate: Date, templateId?: string): Promise<Record<string, any>>;
/**
 * Notification Digest Model
 */
export declare class NotificationDigest extends Model {
    id: string;
    userId: string;
    digestType: string;
    periodStart: Date;
    periodEnd: Date;
    notificationIds: string[];
    isSent: boolean;
    sentAt?: Date;
    createdAt: Date;
    updatedAt: Date;
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
export declare function createNotificationDigest(userId: string, digestType: string, periodStart: Date, periodEnd: Date, transaction?: Transaction): Promise<NotificationDigest>;
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
export declare function sendPendingDigests(transaction?: Transaction): Promise<number>;
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
export declare function searchNotifications(userId: string, query: string, filters?: {
    priority?: NotificationPriority;
    channel?: NotificationChannel;
    status?: NotificationStatus;
    startDate?: Date;
    endDate?: Date;
}, limit?: number): Promise<Notification[]>;
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
export declare function markAllNotificationsRead(userId: string, transaction?: Transaction): Promise<number>;
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
export declare function deleteOldNotifications(olderThan: Date, transaction?: Transaction): Promise<number>;
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
export declare function archiveNotifications(userId: string, notificationIds: string[], transaction?: Transaction): Promise<number>;
/**
 * Scheduled Notification Model
 */
export declare class ScheduledNotification extends Model {
    id: string;
    name: string;
    description?: string;
    cronExpression: string;
    templateId: string;
    recipientIds: string[];
    channels: NotificationChannel[];
    isActive: boolean;
    nextRunAt?: Date;
    lastRunAt?: Date;
    runCount: number;
    createdAt: Date;
    updatedAt: Date;
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
export declare function createScheduledNotification(name: string, cronExpression: string, templateId: string, recipientIds: string[], channels: NotificationChannel[], transaction?: Transaction): Promise<ScheduledNotification>;
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
export declare function processScheduledNotifications(transaction?: Transaction): Promise<number>;
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
export declare function cancelScheduledNotification(scheduleId: string, transaction?: Transaction): Promise<ScheduledNotification>;
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
export declare function sendWebhookNotification(url: string, payload: Record<string, any>, transaction?: Transaction): Promise<boolean>;
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
export declare function getUnreadNotificationCount(userId: string): Promise<number>;
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
export declare function getUnreadCountByPriority(userId: string): Promise<Record<string, number>>;
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
export declare function sendEmergencyBroadcast(subject: string, message: string, targetUserIds: string[] | 'all', transaction?: Transaction): Promise<Notification[]>;
declare const _default: {
    Notification: typeof Notification;
    NotificationRule: typeof NotificationRule;
    NotificationTemplate: typeof NotificationTemplate;
    EscalationPolicy: typeof EscalationPolicy;
    EscalationInstance: typeof EscalationInstance;
    UserNotificationPreference: typeof UserNotificationPreference;
    NotificationQueue: typeof NotificationQueue;
    NotificationAnalytics: typeof NotificationAnalytics;
    NotificationDigest: typeof NotificationDigest;
    ScheduledNotification: typeof ScheduledNotification;
    sendNotification: typeof sendNotification;
    sendBatchNotification: typeof sendBatchNotification;
    queueNotification: typeof queueNotification;
    processNotificationQueue: typeof processNotificationQueue;
    deliverNotification: typeof deliverNotification;
    markNotificationRead: typeof markNotificationRead;
    getUserNotifications: typeof getUserNotifications;
    createNotificationRule: typeof createNotificationRule;
    evaluateNotificationRules: typeof evaluateNotificationRules;
    getActiveNotificationRules: typeof getActiveNotificationRules;
    createNotificationTemplate: typeof createNotificationTemplate;
    renderTemplate: typeof renderTemplate;
    getActiveTemplates: typeof getActiveTemplates;
    createEscalationPolicy: typeof createEscalationPolicy;
    triggerEscalation: typeof triggerEscalation;
    processEscalations: typeof processEscalations;
    resolveEscalation: typeof resolveEscalation;
    setUserPreferences: typeof setUserPreferences;
    getUserPreferences: typeof getUserPreferences;
    trackNotificationDelivery: typeof trackNotificationDelivery;
    trackNotificationOpen: typeof trackNotificationOpen;
    getNotificationAnalyticsReport: typeof getNotificationAnalyticsReport;
    createNotificationDigest: typeof createNotificationDigest;
    sendPendingDigests: typeof sendPendingDigests;
    searchNotifications: typeof searchNotifications;
    markAllNotificationsRead: typeof markAllNotificationsRead;
    deleteOldNotifications: typeof deleteOldNotifications;
    archiveNotifications: typeof archiveNotifications;
    createScheduledNotification: typeof createScheduledNotification;
    processScheduledNotifications: typeof processScheduledNotifications;
    cancelScheduledNotification: typeof cancelScheduledNotification;
    sendWebhookNotification: typeof sendWebhookNotification;
    getUnreadNotificationCount: typeof getUnreadNotificationCount;
    getUnreadCountByPriority: typeof getUnreadCountByPriority;
    sendEmergencyBroadcast: typeof sendEmergencyBroadcast;
};
export default _default;
//# sourceMappingURL=asset-notification-commands.d.ts.map