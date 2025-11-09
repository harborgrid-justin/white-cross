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
import { Model, Sequelize, Transaction, WhereOptions } from 'sequelize';
/**
 * Message type enumeration
 */
export declare enum MessageType {
    EMAIL = "email",
    SMS = "sms",
    PUSH = "push",
    IN_APP = "in_app",
    VOICE = "voice"
}
/**
 * Message priority enumeration
 */
export declare enum MessagePriority {
    LOW = "low",
    NORMAL = "normal",
    HIGH = "high",
    URGENT = "urgent",
    EMERGENCY = "emergency"
}
/**
 * Message status enumeration
 */
export declare enum MessageStatus {
    DRAFT = "draft",
    SCHEDULED = "scheduled",
    QUEUED = "queued",
    SENDING = "sending",
    SENT = "sent",
    DELIVERED = "delivered",
    READ = "read",
    FAILED = "failed",
    BOUNCED = "bounced",
    CANCELLED = "cancelled"
}
/**
 * Notification category enumeration
 */
export declare enum NotificationCategory {
    ACADEMIC = "academic",
    ATTENDANCE = "attendance",
    BEHAVIOR = "behavior",
    HEALTH = "health",
    EVENT = "event",
    FINANCIAL = "financial",
    ADMINISTRATIVE = "administrative",
    EMERGENCY = "emergency",
    GENERAL = "general"
}
/**
 * Alert severity enumeration
 */
export declare enum AlertSeverity {
    INFO = "info",
    WARNING = "warning",
    ERROR = "error",
    CRITICAL = "critical"
}
/**
 * Communication channel preference
 */
export declare enum CommunicationChannel {
    EMAIL = "email",
    SMS = "sms",
    PUSH = "push",
    PHONE = "phone",
    IN_APP = "in_app",
    NONE = "none"
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
/**
 * Message model - stores all messages sent through the system
 */
export declare class Message extends Model {
    id: string;
    senderId: string;
    recipientType: 'student' | 'parent' | 'teacher' | 'staff' | 'group';
    subject: string;
    body: string;
    messageType: MessageType;
    priority: MessagePriority;
    category: NotificationCategory;
    status: MessageStatus;
    templateId: string | null;
    scheduledFor: Date | null;
    sentAt: Date | null;
    expiresAt: Date | null;
    requiresReadReceipt: boolean;
    attachments: string[] | null;
    metadata: Record<string, any> | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt: Date | null;
}
/**
 * Initialize Message model
 */
export declare function initMessageModel(sequelize: Sequelize): typeof Message;
/**
 * MessageRecipient model - tracks individual recipients and delivery status
 */
export declare class MessageRecipient extends Model {
    id: string;
    messageId: string;
    recipientId: string;
    recipientType: 'student' | 'parent' | 'teacher' | 'staff';
    status: MessageStatus;
    deliveredAt: Date | null;
    readAt: Date | null;
    failureReason: string | null;
    attempts: number;
    lastAttemptAt: Date | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
/**
 * Initialize MessageRecipient model
 */
export declare function initMessageRecipientModel(sequelize: Sequelize): typeof MessageRecipient;
/**
 * Notification model - in-app notifications
 */
export declare class Notification extends Model {
    id: string;
    recipientId: string;
    recipientType: 'student' | 'parent' | 'teacher' | 'staff';
    title: string;
    message: string;
    category: NotificationCategory;
    priority: MessagePriority;
    isRead: boolean;
    readAt: Date | null;
    actionUrl: string | null;
    actionLabel: string | null;
    expiresAt: Date | null;
    metadata: Record<string, any> | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
/**
 * Initialize Notification model
 */
export declare function initNotificationModel(sequelize: Sequelize): typeof Notification;
/**
 * Alert model - system-wide alerts
 */
export declare class Alert extends Model {
    id: string;
    alertType: string;
    severity: AlertSeverity;
    title: string;
    message: string;
    schoolId: string | null;
    isActive: boolean;
    publishedAt: Date | null;
    expiresAt: Date | null;
    actionRequired: boolean;
    actionUrl: string | null;
    acknowledgedBy: string[] | null;
    metadata: Record<string, any> | null;
    createdBy: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
/**
 * Initialize Alert model
 */
export declare function initAlertModel(sequelize: Sequelize): typeof Alert;
/**
 * CommunicationPreference model - user communication preferences
 */
export declare class CommunicationPreference extends Model {
    id: string;
    userId: string;
    userType: 'student' | 'parent' | 'teacher' | 'staff';
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
    phoneEnabled: boolean;
    preferredChannel: CommunicationChannel;
    categoryPreferences: Record<string, string[]>;
    quietHoursStart: string | null;
    quietHoursEnd: string | null;
    timezone: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
/**
 * Initialize CommunicationPreference model
 */
export declare function initCommunicationPreferenceModel(sequelize: Sequelize): typeof CommunicationPreference;
/**
 * MessageTemplate model - reusable message templates
 */
export declare class MessageTemplate extends Model {
    id: string;
    name: string;
    description: string | null;
    category: NotificationCategory;
    messageType: MessageType;
    subject: string | null;
    bodyTemplate: string;
    variables: string[];
    isActive: boolean;
    schoolId: string | null;
    createdBy: string;
    usageCount: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
/**
 * Initialize MessageTemplate model
 */
export declare function initMessageTemplateModel(sequelize: Sequelize): typeof MessageTemplate;
/**
 * 1. Creates a new message
 */
export declare function createMessage(sequelize: Sequelize, messageData: MessageData, transaction?: Transaction): Promise<Message>;
/**
 * 2. Sends an email notification
 */
export declare function sendEmailNotification(sequelize: Sequelize, recipientId: string, subject: string, body: string, category?: NotificationCategory, priority?: MessagePriority, senderId?: string, transaction?: Transaction): Promise<Message>;
/**
 * 3. Sends an SMS alert
 */
export declare function sendSmsAlert(sequelize: Sequelize, recipientId: string, message: string, priority?: MessagePriority, senderId?: string, transaction?: Transaction): Promise<Message>;
/**
 * 4. Sends a push notification
 */
export declare function sendPushNotification(sequelize: Sequelize, recipientIds: string[], title: string, message: string, category?: NotificationCategory, priority?: MessagePriority, senderId?: string, transaction?: Transaction): Promise<Message>;
/**
 * 5. Sends a multi-channel message (email, SMS, push)
 */
export declare function sendMultiChannelMessage(sequelize: Sequelize, recipientId: string, recipientType: 'student' | 'parent' | 'teacher' | 'staff', subject: string, body: string, category: NotificationCategory, priority?: MessagePriority, senderId?: string, transaction?: Transaction): Promise<Message[]>;
/**
 * 6. Sends bulk messages to multiple recipients
 */
export declare function sendBulkMessages(sequelize: Sequelize, bulkData: BulkMessageData, transaction?: Transaction): Promise<{
    messageId: string;
    recipientCount: number;
}>;
/**
 * 7. Sends class-wide announcement
 */
export declare function sendClassAnnouncement(sequelize: Sequelize, classId: string, senderId: string, subject: string, body: string, includeParents?: boolean, priority?: MessagePriority, transaction?: Transaction): Promise<{
    students: string;
    parents?: string;
}>;
/**
 * 8. Sends school-wide announcement
 */
export declare function sendSchoolAnnouncement(sequelize: Sequelize, schoolId: string, senderId: string, subject: string, body: string, targetAudience: ('students' | 'parents' | 'teachers' | 'staff')[], priority?: MessagePriority, transaction?: Transaction): Promise<Record<string, string>>;
/**
 * 9. Sends emergency alert to all users
 */
export declare function sendEmergencyAlert(sequelize: Sequelize, alertData: AlertData, transaction?: Transaction): Promise<Alert>;
/**
 * 10. Sends critical safety alert
 */
export declare function sendSafetyAlert(sequelize: Sequelize, schoolId: string, title: string, message: string, actionUrl?: string, transaction?: Transaction): Promise<Alert>;
/**
 * 11. Creates in-app notification
 */
export declare function createNotification(sequelize: Sequelize, notificationData: NotificationData, transaction?: Transaction): Promise<Notification>;
/**
 * 12. Gets unread notifications for a user
 */
export declare function getUnreadNotifications(sequelize: Sequelize, recipientId: string, limit?: number): Promise<Notification[]>;
/**
 * 13. Marks notification as read
 */
export declare function markNotificationAsRead(sequelize: Sequelize, notificationId: string, transaction?: Transaction): Promise<Notification>;
/**
 * 14. Marks all notifications as read for a user
 */
export declare function markAllNotificationsAsRead(sequelize: Sequelize, recipientId: string, transaction?: Transaction): Promise<number>;
/**
 * 15. Deletes old notifications
 */
export declare function deleteOldNotifications(sequelize: Sequelize, olderThanDays?: number, transaction?: Transaction): Promise<number>;
/**
 * 16. Creates a message template
 */
export declare function createMessageTemplate(sequelize: Sequelize, templateData: MessageTemplateData, transaction?: Transaction): Promise<MessageTemplate>;
/**
 * 17. Gets message template by ID
 */
export declare function getMessageTemplate(sequelize: Sequelize, templateId: string): Promise<MessageTemplate | null>;
/**
 * 18. Gets templates by category
 */
export declare function getTemplatesByCategory(sequelize: Sequelize, category: NotificationCategory, schoolId?: string): Promise<MessageTemplate[]>;
/**
 * 19. Renders message from template
 */
export declare function renderMessageFromTemplate(sequelize: Sequelize, templateId: string, variables: Record<string, any>): Promise<{
    subject: string;
    body: string;
}>;
/**
 * 20. Sends message using template
 */
export declare function sendTemplateMessage(sequelize: Sequelize, templateId: string, recipientIds: string[], recipientType: 'student' | 'parent' | 'teacher' | 'staff', variables: Record<string, any>, senderId: string, priority?: MessagePriority, transaction?: Transaction): Promise<Message>;
/**
 * 21. Creates or updates communication preferences
 */
export declare function updateCommunicationPreferences(sequelize: Sequelize, userId: string, preferences: Partial<CommunicationPreferenceData>, transaction?: Transaction): Promise<CommunicationPreference>;
/**
 * 22. Gets user communication preferences
 */
export declare function getUserCommunicationPreferences(sequelize: Sequelize, userId: string): Promise<CommunicationPreference | null>;
/**
 * 23. Checks if user accepts communication channel
 */
export declare function canSendViaChannel(sequelize: Sequelize, userId: string, channel: CommunicationChannel, category: NotificationCategory): Promise<boolean>;
/**
 * 24. Gets preferred channels for a category
 */
declare function getPreferredChannelsForCategory(preferences: CommunicationPreference | null, category: NotificationCategory): CommunicationChannel[];
/**
 * 25. Checks if within quiet hours
 */
export declare function isWithinQuietHours(sequelize: Sequelize, userId: string): Promise<boolean>;
/**
 * 26. Updates message delivery status
 */
export declare function updateDeliveryStatus(sequelize: Sequelize, messageId: string, recipientId: string, status: MessageStatus, failureReason?: string, transaction?: Transaction): Promise<MessageRecipient>;
/**
 * 27. Marks message as read
 */
export declare function markMessageAsRead(sequelize: Sequelize, messageId: string, recipientId: string, transaction?: Transaction): Promise<MessageRecipient>;
/**
 * 28. Gets message delivery statistics
 */
export declare function getMessageDeliveryStats(sequelize: Sequelize, messageId: string): Promise<{
    total: number;
    queued: number;
    sending: number;
    sent: number;
    delivered: number;
    read: number;
    failed: number;
    deliveryRate: number;
    readRate: number;
}>;
/**
 * 29. Gets failed message deliveries for retry
 */
export declare function getFailedDeliveries(sequelize: Sequelize, maxAttempts?: number, limit?: number): Promise<MessageRecipient[]>;
/**
 * 30. Retries failed message deliveries
 */
export declare function retryFailedDeliveries(sequelize: Sequelize, maxAttempts?: number, transaction?: Transaction): Promise<number>;
/**
 * 31. Schedules a message for future delivery
 */
export declare function scheduleMessage(sequelize: Sequelize, messageData: MessageData, scheduledFor: Date, transaction?: Transaction): Promise<Message>;
/**
 * 32. Gets scheduled messages ready to send
 */
export declare function getScheduledMessagesReadyToSend(sequelize: Sequelize, limit?: number): Promise<Message[]>;
/**
 * 33. Processes scheduled messages
 */
export declare function processScheduledMessages(sequelize: Sequelize, transaction?: Transaction): Promise<number>;
/**
 * 34. Cancels scheduled message
 */
export declare function cancelScheduledMessage(sequelize: Sequelize, messageId: string, transaction?: Transaction): Promise<Message>;
/**
 * 35. Gets communication analytics for a period
 */
export declare function getCommunicationAnalytics(sequelize: Sequelize, startDate: Date, endDate: Date, schoolId?: string): Promise<CommunicationAnalytics>;
/**
 * 36. Gets message engagement metrics
 */
export declare function getMessageEngagementMetrics(sequelize: Sequelize, senderId: string, days?: number): Promise<any>;
/**
 * 37. Gets most active message senders
 */
export declare function getMostActiveSenders(sequelize: Sequelize, schoolId: string, limit?: number, days?: number): Promise<any[]>;
/**
 * 38. Gets messages with optimized eager loading (prevents N+1)
 */
export declare function getMessagesWithRelations(sequelize: Sequelize, whereClause: WhereOptions, limit?: number, offset?: number): Promise<{
    rows: Message[];
    count: number;
}>;
/**
 * 39. Bulk fetches recipient messages (optimized)
 */
export declare function bulkFetchRecipientMessages(sequelize: Sequelize, recipientIds: string[], startDate: Date, endDate: Date): Promise<Map<string, Message[]>>;
/**
 * 40. Gets conversation thread between users
 */
export declare function getConversationThread(sequelize: Sequelize, user1Id: string, user2Id: string, limit?: number): Promise<Message[]>;
/**
 * 41. Searches messages with full-text search
 */
export declare function searchMessages(sequelize: Sequelize, searchTerm: string, userId?: string, category?: NotificationCategory, limit?: number): Promise<Message[]>;
/**
 * 42. Gets message statistics by category
 */
export declare function getMessageStatsByCategory(sequelize: Sequelize, schoolId: string, startDate: Date, endDate: Date): Promise<any[]>;
/**
 * 43. Gets user inbox with pagination and filtering
 */
export declare function getUserInbox(sequelize: Sequelize, userId: string, options?: {
    unreadOnly?: boolean;
    category?: NotificationCategory;
    priority?: MessagePriority;
    limit?: number;
    offset?: number;
}): Promise<{
    rows: any[];
    count: number;
}>;
/**
 * 44. Archives old messages
 */
export declare function archiveOldMessages(sequelize: Sequelize, olderThanDays?: number, transaction?: Transaction): Promise<{
    archived: number;
    deleted: number;
}>;
/**
 * 45. Cleans up expired notifications
 */
export declare function cleanupExpiredNotifications(sequelize: Sequelize, transaction?: Transaction): Promise<number>;
declare const _default: {
    Message: typeof Message;
    MessageRecipient: typeof MessageRecipient;
    Notification: typeof Notification;
    Alert: typeof Alert;
    CommunicationPreference: typeof CommunicationPreference;
    MessageTemplate: typeof MessageTemplate;
    initMessageModel: typeof initMessageModel;
    initMessageRecipientModel: typeof initMessageRecipientModel;
    initNotificationModel: typeof initNotificationModel;
    initAlertModel: typeof initAlertModel;
    initCommunicationPreferenceModel: typeof initCommunicationPreferenceModel;
    initMessageTemplateModel: typeof initMessageTemplateModel;
    createMessage: typeof createMessage;
    sendEmailNotification: typeof sendEmailNotification;
    sendSmsAlert: typeof sendSmsAlert;
    sendPushNotification: typeof sendPushNotification;
    sendMultiChannelMessage: typeof sendMultiChannelMessage;
    sendBulkMessages: typeof sendBulkMessages;
    sendClassAnnouncement: typeof sendClassAnnouncement;
    sendSchoolAnnouncement: typeof sendSchoolAnnouncement;
    sendEmergencyAlert: typeof sendEmergencyAlert;
    sendSafetyAlert: typeof sendSafetyAlert;
    createNotification: typeof createNotification;
    getUnreadNotifications: typeof getUnreadNotifications;
    markNotificationAsRead: typeof markNotificationAsRead;
    markAllNotificationsAsRead: typeof markAllNotificationsAsRead;
    deleteOldNotifications: typeof deleteOldNotifications;
    createMessageTemplate: typeof createMessageTemplate;
    getMessageTemplate: typeof getMessageTemplate;
    getTemplatesByCategory: typeof getTemplatesByCategory;
    renderMessageFromTemplate: typeof renderMessageFromTemplate;
    sendTemplateMessage: typeof sendTemplateMessage;
    updateCommunicationPreferences: typeof updateCommunicationPreferences;
    getUserCommunicationPreferences: typeof getUserCommunicationPreferences;
    canSendViaChannel: typeof canSendViaChannel;
    getPreferredChannelsForCategory: typeof getPreferredChannelsForCategory;
    isWithinQuietHours: typeof isWithinQuietHours;
    updateDeliveryStatus: typeof updateDeliveryStatus;
    markMessageAsRead: typeof markMessageAsRead;
    getMessageDeliveryStats: typeof getMessageDeliveryStats;
    getFailedDeliveries: typeof getFailedDeliveries;
    retryFailedDeliveries: typeof retryFailedDeliveries;
    scheduleMessage: typeof scheduleMessage;
    getScheduledMessagesReadyToSend: typeof getScheduledMessagesReadyToSend;
    processScheduledMessages: typeof processScheduledMessages;
    cancelScheduledMessage: typeof cancelScheduledMessage;
    getCommunicationAnalytics: typeof getCommunicationAnalytics;
    getMessageEngagementMetrics: typeof getMessageEngagementMetrics;
    getMostActiveSenders: typeof getMostActiveSenders;
    getMessagesWithRelations: typeof getMessagesWithRelations;
    bulkFetchRecipientMessages: typeof bulkFetchRecipientMessages;
    getConversationThread: typeof getConversationThread;
    searchMessages: typeof searchMessages;
    getMessageStatsByCategory: typeof getMessageStatsByCategory;
    getUserInbox: typeof getUserInbox;
    archiveOldMessages: typeof archiveOldMessages;
    cleanupExpiredNotifications: typeof cleanupExpiredNotifications;
};
export default _default;
//# sourceMappingURL=student-communication-kit.d.ts.map