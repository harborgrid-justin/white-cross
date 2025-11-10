/**
 * LOC: DOC-NOTIF-ADV-001
 * File: /reuse/document/document-notification-advanced-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - nodemailer
 *   - twilio
 *   - firebase-admin
 *   - handlebars
 *   - sequelize (v6.x)
 *   - node-cron
 *
 * DOWNSTREAM (imported by):
 *   - Document notification controllers
 *   - Multi-channel notification services
 *   - Template management modules
 *   - Notification preference services
 *   - Healthcare alert systems
 */
/**
 * File: /reuse/document/document-notification-advanced-kit.ts
 * Locator: WC-UTL-DOCNOTIF-001
 * Purpose: Advanced Multi-Channel Notification System - Email, SMS, push, in-app notifications with templates, delivery tracking, preferences, scheduling
 *
 * Upstream: @nestjs/common, nodemailer, twilio, firebase-admin, handlebars, sequelize, node-cron
 * Downstream: Notification controllers, multi-channel services, template engines, preference managers, healthcare alerts
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, Nodemailer 6.x, Twilio SDK, Firebase Admin SDK
 * Exports: 38 utility functions for multi-channel delivery, templates, tracking, preferences, scheduling, analytics
 *
 * LLM Context: Production-grade notification system for White Cross healthcare platform.
 * Provides multi-channel notification delivery (email, SMS, push, in-app), dynamic template engine with
 * Handlebars, delivery tracking and status monitoring, user preference management with opt-in/opt-out,
 * scheduled and recurring notifications, delivery rate limiting, retry mechanisms, notification batching,
 * analytics and reporting, HIPAA-compliant audit logging, and emergency broadcast capabilities.
 * Essential for patient alerts, appointment reminders, test result notifications, and healthcare communications.
 */
import { Sequelize } from 'sequelize';
/**
 * Notification channel types
 */
export type NotificationChannel = 'email' | 'sms' | 'push' | 'in-app' | 'webhook';
/**
 * Notification priority levels
 */
export type NotificationPriority = 'urgent' | 'high' | 'normal' | 'low';
/**
 * Notification delivery status
 */
export type DeliveryStatus = 'pending' | 'queued' | 'sending' | 'sent' | 'delivered' | 'failed' | 'bounced' | 'rejected' | 'read';
/**
 * Template variable types
 */
export type TemplateVariableType = 'string' | 'number' | 'date' | 'boolean' | 'object' | 'array';
/**
 * Notification preference frequency
 */
export type NotificationFrequency = 'immediate' | 'hourly' | 'daily' | 'weekly' | 'never';
/**
 * Multi-channel notification configuration
 */
export interface NotificationConfig {
    channels: NotificationChannel[];
    priority: NotificationPriority;
    templateId?: string;
    variables?: Record<string, any>;
    scheduledAt?: Date;
    expiresAt?: Date;
    retryAttempts?: number;
    retryDelay?: number;
    batchId?: string;
    metadata?: Record<string, any>;
}
/**
 * Email notification configuration
 */
export interface EmailConfig {
    to: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    from: string;
    replyTo?: string;
    subject: string;
    html?: string;
    text?: string;
    attachments?: EmailAttachment[];
    headers?: Record<string, string>;
}
/**
 * Email attachment
 */
export interface EmailAttachment {
    filename: string;
    content?: Buffer | string;
    path?: string;
    contentType?: string;
    cid?: string;
}
/**
 * SMS notification configuration
 */
export interface SmsConfig {
    to: string | string[];
    from: string;
    body: string;
    mediaUrls?: string[];
    statusCallback?: string;
}
/**
 * Push notification configuration
 */
export interface PushConfig {
    tokens: string[];
    title: string;
    body: string;
    data?: Record<string, any>;
    badge?: number;
    sound?: string;
    icon?: string;
    image?: string;
    clickAction?: string;
    priority?: 'high' | 'normal';
}
/**
 * In-app notification configuration
 */
export interface InAppConfig {
    userId: string | string[];
    title: string;
    message: string;
    category?: string;
    actionUrl?: string;
    icon?: string;
    imageUrl?: string;
    expiresAt?: Date;
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
    variables: TemplateVariable[];
    isActive: boolean;
    locale?: string;
    category?: string;
}
/**
 * Template variable definition
 */
export interface TemplateVariable {
    name: string;
    type: TemplateVariableType;
    required: boolean;
    defaultValue?: any;
    description?: string;
}
/**
 * Compiled template
 */
export interface CompiledTemplate {
    subject?: string;
    body: string;
    variables: Record<string, any>;
}
/**
 * Notification delivery record
 */
export interface NotificationDelivery {
    id: string;
    notificationId: string;
    channel: NotificationChannel;
    recipientId: string;
    recipientAddress: string;
    status: DeliveryStatus;
    sentAt?: Date;
    deliveredAt?: Date;
    readAt?: Date;
    failedAt?: Date;
    errorMessage?: string;
    retryCount: number;
    metadata?: Record<string, any>;
}
/**
 * User notification preferences
 */
export interface NotificationPreference {
    userId: string;
    channel: NotificationChannel;
    category?: string;
    enabled: boolean;
    frequency: NotificationFrequency;
    quietHoursStart?: string;
    quietHoursEnd?: string;
    timezone?: string;
}
/**
 * Scheduled notification
 */
export interface ScheduledNotification {
    id: string;
    config: NotificationConfig;
    scheduledAt: Date;
    recurring?: RecurringSchedule;
    status: 'pending' | 'sent' | 'cancelled';
}
/**
 * Recurring schedule configuration
 */
export interface RecurringSchedule {
    pattern: 'daily' | 'weekly' | 'monthly' | 'custom';
    interval?: number;
    daysOfWeek?: number[];
    daysOfMonth?: number[];
    cronExpression?: string;
    endDate?: Date;
}
/**
 * Notification batch
 */
export interface NotificationBatch {
    id: string;
    name: string;
    totalRecipients: number;
    sentCount: number;
    failedCount: number;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    createdAt: Date;
    completedAt?: Date;
}
/**
 * Delivery analytics
 */
export interface DeliveryAnalytics {
    channel: NotificationChannel;
    totalSent: number;
    totalDelivered: number;
    totalFailed: number;
    totalRead: number;
    deliveryRate: number;
    readRate: number;
    averageDeliveryTime: number;
    bounceRate: number;
}
/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
    channel: NotificationChannel;
    maxPerMinute: number;
    maxPerHour: number;
    maxPerDay: number;
}
/**
 * Notification audit log
 */
export interface NotificationAuditLog {
    notificationId: string;
    action: 'created' | 'sent' | 'delivered' | 'failed' | 'read' | 'cancelled';
    performedBy?: string;
    timestamp: Date;
    details?: Record<string, any>;
}
/**
 * NotificationTemplate model attributes
 */
export interface NotificationTemplateAttributes {
    id: string;
    name: string;
    channel: NotificationChannel;
    subject?: string;
    bodyTemplate: string;
    variables: Record<string, any>[];
    isActive: boolean;
    locale?: string;
    category?: string;
    description?: string;
    createdBy?: string;
    updatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * NotificationDelivery model attributes
 */
export interface NotificationDeliveryAttributes {
    id: string;
    notificationId: string;
    channel: NotificationChannel;
    recipientId: string;
    recipientAddress: string;
    status: DeliveryStatus;
    priority: NotificationPriority;
    subject?: string;
    body: string;
    sentAt?: Date;
    deliveredAt?: Date;
    readAt?: Date;
    failedAt?: Date;
    errorMessage?: string;
    retryCount: number;
    maxRetries: number;
    externalId?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * NotificationPreference model attributes
 */
export interface NotificationPreferenceAttributes {
    id: string;
    userId: string;
    channel: NotificationChannel;
    category?: string;
    enabled: boolean;
    frequency: NotificationFrequency;
    quietHoursStart?: string;
    quietHoursEnd?: string;
    timezone?: string;
    unsubscribedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates NotificationTemplate model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<NotificationTemplateAttributes>>} NotificationTemplate model
 *
 * @example
 * ```typescript
 * const TemplateModel = createNotificationTemplateModel(sequelize);
 * const template = await TemplateModel.create({
 *   name: 'appointment-reminder',
 *   channel: 'email',
 *   subject: 'Appointment Reminder: {{patientName}}',
 *   bodyTemplate: 'Dear {{patientName}}, your appointment is on {{appointmentDate}}',
 *   variables: [{ name: 'patientName', type: 'string', required: true }],
 *   isActive: true
 * });
 * ```
 */
export declare const createNotificationTemplateModel: (sequelize: Sequelize) => any;
/**
 * Creates NotificationDelivery model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<NotificationDeliveryAttributes>>} NotificationDelivery model
 *
 * @example
 * ```typescript
 * const DeliveryModel = createNotificationDeliveryModel(sequelize);
 * const delivery = await DeliveryModel.create({
 *   notificationId: 'notif-uuid',
 *   channel: 'email',
 *   recipientId: 'user-uuid',
 *   recipientAddress: 'patient@example.com',
 *   status: 'pending',
 *   priority: 'high',
 *   body: 'Your appointment is tomorrow'
 * });
 * ```
 */
export declare const createNotificationDeliveryModel: (sequelize: Sequelize) => any;
/**
 * Creates NotificationPreference model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<NotificationPreferenceAttributes>>} NotificationPreference model
 *
 * @example
 * ```typescript
 * const PreferenceModel = createNotificationPreferenceModel(sequelize);
 * const preference = await PreferenceModel.create({
 *   userId: 'user-uuid',
 *   channel: 'email',
 *   category: 'appointments',
 *   enabled: true,
 *   frequency: 'immediate',
 *   quietHoursStart: '22:00',
 *   quietHoursEnd: '08:00',
 *   timezone: 'America/Los_Angeles'
 * });
 * ```
 */
export declare const createNotificationPreferenceModel: (sequelize: Sequelize) => any;
/**
 * 1. Sends email notification.
 *
 * @param {EmailConfig} config - Email configuration
 * @returns {Promise<{ messageId: string; accepted: string[] }>} Email send result
 *
 * @example
 * ```typescript
 * const result = await sendEmailNotification({
 *   to: 'patient@example.com',
 *   from: 'noreply@whitecross.com',
 *   subject: 'Appointment Reminder',
 *   html: '<p>Your appointment is tomorrow at 2 PM</p>',
 *   text: 'Your appointment is tomorrow at 2 PM'
 * });
 * console.log('Email sent:', result.messageId);
 * ```
 */
export declare const sendEmailNotification: (config: EmailConfig) => Promise<{
    messageId: string;
    accepted: string[];
}>;
/**
 * 2. Sends SMS notification.
 *
 * @param {SmsConfig} config - SMS configuration
 * @returns {Promise<{ sid: string; status: string }>} SMS send result
 *
 * @example
 * ```typescript
 * const result = await sendSmsNotification({
 *   to: '+14155551234',
 *   from: '+14155559999',
 *   body: 'Your appointment is tomorrow at 2 PM'
 * });
 * console.log('SMS SID:', result.sid);
 * ```
 */
export declare const sendSmsNotification: (config: SmsConfig) => Promise<{
    sid: string;
    status: string;
}>;
/**
 * 3. Sends push notification.
 *
 * @param {PushConfig} config - Push notification configuration
 * @returns {Promise<{ successCount: number; failureCount: number }>} Push send result
 *
 * @example
 * ```typescript
 * const result = await sendPushNotification({
 *   tokens: ['device-token-1', 'device-token-2'],
 *   title: 'Appointment Reminder',
 *   body: 'Your appointment is tomorrow at 2 PM',
 *   priority: 'high'
 * });
 * console.log(`Sent to ${result.successCount} devices`);
 * ```
 */
export declare const sendPushNotification: (config: PushConfig) => Promise<{
    successCount: number;
    failureCount: number;
}>;
/**
 * 4. Sends in-app notification.
 *
 * @param {InAppConfig} config - In-app notification configuration
 * @returns {Promise<string[]>} Created notification IDs
 *
 * @example
 * ```typescript
 * const notificationIds = await sendInAppNotification({
 *   userId: 'user-123',
 *   title: 'Test Results Available',
 *   message: 'Your lab test results are ready for review',
 *   category: 'lab-results',
 *   actionUrl: '/results/12345'
 * });
 * ```
 */
export declare const sendInAppNotification: (config: InAppConfig) => Promise<string[]>;
/**
 * 5. Sends multi-channel notification.
 *
 * @param {string | string[]} recipients - Recipient user IDs
 * @param {NotificationConfig} config - Notification configuration
 * @returns {Promise<Record<NotificationChannel, any>>} Results by channel
 *
 * @example
 * ```typescript
 * const results = await sendMultiChannelNotification('user-123', {
 *   channels: ['email', 'sms', 'push'],
 *   priority: 'high',
 *   templateId: 'appointment-reminder',
 *   variables: { patientName: 'John Doe', appointmentDate: '2025-01-15' }
 * });
 * ```
 */
export declare const sendMultiChannelNotification: (recipients: string | string[], config: NotificationConfig) => Promise<Record<NotificationChannel, any>>;
/**
 * 6. Sends emergency broadcast notification.
 *
 * @param {string[]} recipientIds - Recipient user IDs
 * @param {string} message - Emergency message
 * @param {NotificationChannel[]} [channels] - Channels to use (defaults to all)
 * @returns {Promise<{ sent: number; failed: number }>} Broadcast results
 *
 * @example
 * ```typescript
 * const result = await sendEmergencyBroadcast(
 *   ['user-1', 'user-2', 'user-3'],
 *   'URGENT: Facility evacuation required. Follow emergency procedures.',
 *   ['email', 'sms', 'push', 'in-app']
 * );
 * console.log(`Emergency alert sent to ${result.sent} users`);
 * ```
 */
export declare const sendEmergencyBroadcast: (recipientIds: string[], message: string, channels?: NotificationChannel[]) => Promise<{
    sent: number;
    failed: number;
}>;
/**
 * 7. Sends batch notifications.
 *
 * @param {Array<{ recipientId: string; config: NotificationConfig }>} notifications - Batch notifications
 * @returns {Promise<NotificationBatch>} Batch processing result
 *
 * @example
 * ```typescript
 * const batch = await sendBatchNotifications([
 *   { recipientId: 'user-1', config: { channels: ['email'], templateId: 'welcome' } },
 *   { recipientId: 'user-2', config: { channels: ['email'], templateId: 'welcome' } },
 *   { recipientId: 'user-3', config: { channels: ['email'], templateId: 'welcome' } }
 * ]);
 * console.log(`Batch ${batch.id}: ${batch.sentCount} sent, ${batch.failedCount} failed`);
 * ```
 */
export declare const sendBatchNotifications: (notifications: Array<{
    recipientId: string;
    config: NotificationConfig;
}>) => Promise<NotificationBatch>;
/**
 * 8. Sends notification with retry logic.
 *
 * @param {string} recipientId - Recipient user ID
 * @param {NotificationConfig} config - Notification configuration
 * @param {number} [maxRetries] - Maximum retry attempts
 * @returns {Promise<{ success: boolean; attempts: number }>} Delivery result
 *
 * @example
 * ```typescript
 * const result = await sendNotificationWithRetry('user-123', {
 *   channels: ['email'],
 *   priority: 'high',
 *   templateId: 'payment-failed',
 *   retryAttempts: 3,
 *   retryDelay: 300000 // 5 minutes
 * }, 3);
 * ```
 */
export declare const sendNotificationWithRetry: (recipientId: string, config: NotificationConfig, maxRetries?: number) => Promise<{
    success: boolean;
    attempts: number;
}>;
/**
 * 9. Compiles notification template.
 *
 * @param {string} templateId - Template identifier
 * @param {Record<string, any>} variables - Template variables
 * @returns {Promise<CompiledTemplate>} Compiled template
 *
 * @example
 * ```typescript
 * const compiled = await compileNotificationTemplate('appointment-reminder', {
 *   patientName: 'John Doe',
 *   appointmentDate: '2025-01-15',
 *   appointmentTime: '2:00 PM',
 *   doctorName: 'Dr. Smith'
 * });
 * console.log('Subject:', compiled.subject);
 * console.log('Body:', compiled.body);
 * ```
 */
export declare const compileNotificationTemplate: (templateId: string, variables: Record<string, any>) => Promise<CompiledTemplate>;
/**
 * 10. Creates notification template.
 *
 * @param {Omit<NotificationTemplate, 'id'>} template - Template data
 * @returns {Promise<string>} Created template ID
 *
 * @example
 * ```typescript
 * const templateId = await createNotificationTemplate({
 *   name: 'lab-results-ready',
 *   channel: 'email',
 *   subject: 'Lab Results Ready - {{patientName}}',
 *   body: 'Hello {{patientName}}, your {{testType}} results are now available.',
 *   variables: [
 *     { name: 'patientName', type: 'string', required: true },
 *     { name: 'testType', type: 'string', required: true }
 *   ],
 *   isActive: true,
 *   category: 'lab-results'
 * });
 * ```
 */
export declare const createNotificationTemplate: (template: Omit<NotificationTemplate, "id">) => Promise<string>;
/**
 * 11. Validates template variables.
 *
 * @param {TemplateVariable[]} requiredVars - Required template variables
 * @param {Record<string, any>} providedVars - Provided variables
 * @returns {{ valid: boolean; missing?: string[]; invalid?: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateTemplateVariables(
 *   [
 *     { name: 'patientName', type: 'string', required: true },
 *     { name: 'appointmentDate', type: 'date', required: true }
 *   ],
 *   { patientName: 'John Doe', appointmentDate: new Date() }
 * );
 * if (!validation.valid) {
 *   console.error('Missing variables:', validation.missing);
 * }
 * ```
 */
export declare const validateTemplateVariables: (requiredVars: TemplateVariable[], providedVars: Record<string, any>) => {
    valid: boolean;
    missing?: string[];
    invalid?: string[];
};
/**
 * 12. Renders template with variables.
 *
 * @param {string} template - Template string with Handlebars syntax
 * @param {Record<string, any>} variables - Variables to inject
 * @returns {string} Rendered template
 *
 * @example
 * ```typescript
 * const rendered = renderTemplate(
 *   'Hello {{patientName}}, your appointment with {{doctorName}} is on {{appointmentDate}}.',
 *   { patientName: 'John Doe', doctorName: 'Dr. Smith', appointmentDate: '2025-01-15' }
 * );
 * console.log(rendered);
 * // Output: "Hello John Doe, your appointment with Dr. Smith is on 2025-01-15."
 * ```
 */
export declare const renderTemplate: (template: string, variables: Record<string, any>) => string;
/**
 * 13. Clones notification template.
 *
 * @param {string} templateId - Template to clone
 * @param {string} newName - New template name
 * @returns {Promise<string>} New template ID
 *
 * @example
 * ```typescript
 * const newTemplateId = await cloneNotificationTemplate(
 *   'appointment-reminder',
 *   'appointment-reminder-spanish'
 * );
 * // Update the cloned template for Spanish locale
 * ```
 */
export declare const cloneNotificationTemplate: (templateId: string, newName: string) => Promise<string>;
/**
 * 14. Gets template by name and locale.
 *
 * @param {string} name - Template name
 * @param {string} [locale] - Locale (defaults to 'en-US')
 * @returns {Promise<NotificationTemplate | null>} Template if found
 *
 * @example
 * ```typescript
 * const template = await getTemplateByLocale('appointment-reminder', 'es-ES');
 * if (template) {
 *   const compiled = await compileNotificationTemplate(template.id, variables);
 * }
 * ```
 */
export declare const getTemplateByLocale: (name: string, locale?: string) => Promise<NotificationTemplate | null>;
/**
 * 15. Previews template rendering.
 *
 * @param {string} templateId - Template identifier
 * @param {Record<string, any>} sampleVariables - Sample variables for preview
 * @returns {Promise<CompiledTemplate>} Preview of compiled template
 *
 * @example
 * ```typescript
 * const preview = await previewTemplate('appointment-reminder', {
 *   patientName: 'Sample Patient',
 *   appointmentDate: '2025-01-15',
 *   appointmentTime: '2:00 PM',
 *   doctorName: 'Dr. Sample'
 * });
 * console.log('Preview:', preview.body);
 * ```
 */
export declare const previewTemplate: (templateId: string, sampleVariables: Record<string, any>) => Promise<CompiledTemplate>;
/**
 * 16. Tracks notification delivery status.
 *
 * @param {string} deliveryId - Delivery record ID
 * @returns {Promise<NotificationDelivery>} Delivery status
 *
 * @example
 * ```typescript
 * const delivery = await trackNotificationDelivery('delivery-123');
 * console.log(`Status: ${delivery.status}`);
 * if (delivery.deliveredAt) {
 *   console.log(`Delivered at: ${delivery.deliveredAt}`);
 * }
 * ```
 */
export declare const trackNotificationDelivery: (deliveryId: string) => Promise<NotificationDelivery>;
/**
 * 17. Updates delivery status.
 *
 * @param {string} deliveryId - Delivery record ID
 * @param {DeliveryStatus} status - New status
 * @param {Record<string, any>} [metadata] - Additional metadata
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateDeliveryStatus('delivery-123', 'delivered', {
 *   deliveryTime: 1500, // milliseconds
 *   provider: 'AWS SES'
 * });
 * ```
 */
export declare const updateDeliveryStatus: (deliveryId: string, status: DeliveryStatus, metadata?: Record<string, any>) => Promise<void>;
/**
 * 18. Gets delivery history for user.
 *
 * @param {string} userId - User ID
 * @param {number} [limit] - Maximum records to return
 * @returns {Promise<NotificationDelivery[]>} Delivery history
 *
 * @example
 * ```typescript
 * const history = await getDeliveryHistory('user-123', 50);
 * console.log(`User has ${history.length} notifications`);
 * ```
 */
export declare const getDeliveryHistory: (userId: string, limit?: number) => Promise<NotificationDelivery[]>;
/**
 * 19. Marks notification as read.
 *
 * @param {string} deliveryId - Delivery record ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await markNotificationAsRead('delivery-123');
 * // Track when user opened/read the notification
 * ```
 */
export declare const markNotificationAsRead: (deliveryId: string) => Promise<void>;
/**
 * 20. Gets failed deliveries for retry.
 *
 * @param {number} [limit] - Maximum failed deliveries to return
 * @returns {Promise<NotificationDelivery[]>} Failed deliveries
 *
 * @example
 * ```typescript
 * const failed = await getFailedDeliveries(100);
 * for (const delivery of failed) {
 *   if (delivery.retryCount < delivery.maxRetries) {
 *     // Retry delivery
 *   }
 * }
 * ```
 */
export declare const getFailedDeliveries: (limit?: number) => Promise<NotificationDelivery[]>;
/**
 * 21. Archives old delivery records.
 *
 * @param {number} daysToKeep - Number of days to keep records
 * @returns {Promise<number>} Number of archived records
 *
 * @example
 * ```typescript
 * const archived = await archiveOldDeliveries(90);
 * console.log(`Archived ${archived} old delivery records`);
 * ```
 */
export declare const archiveOldDeliveries: (daysToKeep: number) => Promise<number>;
/**
 * 22. Gets user notification preferences.
 *
 * @param {string} userId - User ID
 * @returns {Promise<NotificationPreference[]>} User preferences
 *
 * @example
 * ```typescript
 * const preferences = await getUserNotificationPreferences('user-123');
 * const emailPref = preferences.find(p => p.channel === 'email');
 * if (emailPref?.enabled) {
 *   // Send email notification
 * }
 * ```
 */
export declare const getUserNotificationPreferences: (userId: string) => Promise<NotificationPreference[]>;
/**
 * 23. Updates notification preference.
 *
 * @param {string} userId - User ID
 * @param {NotificationChannel} channel - Channel to update
 * @param {Partial<NotificationPreference>} updates - Preference updates
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateNotificationPreference('user-123', 'email', {
 *   enabled: true,
 *   frequency: 'daily',
 *   quietHoursStart: '22:00',
 *   quietHoursEnd: '08:00'
 * });
 * ```
 */
export declare const updateNotificationPreference: (userId: string, channel: NotificationChannel, updates: Partial<NotificationPreference>) => Promise<void>;
/**
 * 24. Checks if user allows notification.
 *
 * @param {string} userId - User ID
 * @param {NotificationChannel} channel - Notification channel
 * @param {string} [category] - Notification category
 * @returns {Promise<boolean>} True if notification is allowed
 *
 * @example
 * ```typescript
 * const allowed = await checkNotificationAllowed('user-123', 'email', 'appointments');
 * if (allowed) {
 *   await sendEmailNotification(emailConfig);
 * }
 * ```
 */
export declare const checkNotificationAllowed: (userId: string, channel: NotificationChannel, category?: string) => Promise<boolean>;
/**
 * 25. Checks if within quiet hours.
 *
 * @param {NotificationPreference} preference - User preference
 * @returns {boolean} True if currently in quiet hours
 *
 * @example
 * ```typescript
 * const preference = await getUserNotificationPreferences('user-123');
 * const emailPref = preference.find(p => p.channel === 'email');
 * if (emailPref && !isWithinQuietHours(emailPref)) {
 *   // Safe to send notification
 * }
 * ```
 */
export declare const isWithinQuietHours: (preference: NotificationPreference) => boolean;
/**
 * 26. Unsubscribes user from channel.
 *
 * @param {string} userId - User ID
 * @param {NotificationChannel} channel - Channel to unsubscribe from
 * @param {string} [category] - Optional category filter
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await unsubscribeFromChannel('user-123', 'email', 'marketing');
 * // User will no longer receive marketing emails
 * ```
 */
export declare const unsubscribeFromChannel: (userId: string, channel: NotificationChannel, category?: string) => Promise<void>;
/**
 * 27. Resubscribes user to channel.
 *
 * @param {string} userId - User ID
 * @param {NotificationChannel} channel - Channel to resubscribe to
 * @param {string} [category] - Optional category filter
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await resubscribeToChannel('user-123', 'email', 'appointments');
 * // User will start receiving appointment emails again
 * ```
 */
export declare const resubscribeToChannel: (userId: string, channel: NotificationChannel, category?: string) => Promise<void>;
/**
 * 28. Schedules notification for future delivery.
 *
 * @param {string | string[]} recipients - Recipient user IDs
 * @param {NotificationConfig} config - Notification configuration
 * @param {Date} scheduledAt - When to send notification
 * @returns {Promise<string>} Scheduled notification ID
 *
 * @example
 * ```typescript
 * const scheduledId = await scheduleNotification(
 *   'user-123',
 *   {
 *     channels: ['email', 'sms'],
 *     templateId: 'appointment-reminder',
 *     variables: { appointmentDate: '2025-01-15', appointmentTime: '2:00 PM' }
 *   },
 *   new Date('2025-01-14T14:00:00Z') // Day before appointment
 * );
 * ```
 */
export declare const scheduleNotification: (recipients: string | string[], config: NotificationConfig, scheduledAt: Date) => Promise<string>;
/**
 * 29. Creates recurring notification schedule.
 *
 * @param {string | string[]} recipients - Recipient user IDs
 * @param {NotificationConfig} config - Notification configuration
 * @param {RecurringSchedule} schedule - Recurring schedule
 * @returns {Promise<string>} Recurring schedule ID
 *
 * @example
 * ```typescript
 * const scheduleId = await createRecurringNotification(
 *   'user-123',
 *   {
 *     channels: ['email'],
 *     templateId: 'weekly-health-tips',
 *     variables: { userName: 'John Doe' }
 *   },
 *   {
 *     pattern: 'weekly',
 *     daysOfWeek: [1], // Monday
 *     endDate: new Date('2025-12-31')
 *   }
 * );
 * ```
 */
export declare const createRecurringNotification: (recipients: string | string[], config: NotificationConfig, schedule: RecurringSchedule) => Promise<string>;
/**
 * 30. Cancels scheduled notification.
 *
 * @param {string} scheduledId - Scheduled notification ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await cancelScheduledNotification('scheduled-123');
 * // Notification will not be sent
 * ```
 */
export declare const cancelScheduledNotification: (scheduledId: string) => Promise<void>;
/**
 * 31. Gets scheduled notifications.
 *
 * @param {Date} [fromDate] - Start date range
 * @param {Date} [toDate] - End date range
 * @returns {Promise<ScheduledNotification[]>} Scheduled notifications
 *
 * @example
 * ```typescript
 * const tomorrow = new Date();
 * tomorrow.setDate(tomorrow.getDate() + 1);
 * const nextWeek = new Date();
 * nextWeek.setDate(nextWeek.getDate() + 7);
 *
 * const scheduled = await getScheduledNotifications(tomorrow, nextWeek);
 * console.log(`${scheduled.length} notifications scheduled for next week`);
 * ```
 */
export declare const getScheduledNotifications: (fromDate?: Date, toDate?: Date) => Promise<ScheduledNotification[]>;
/**
 * 32. Processes due scheduled notifications.
 *
 * @returns {Promise<{ processed: number; failed: number }>} Processing results
 *
 * @example
 * ```typescript
 * // Run this function via cron job every minute
 * const result = await processDueNotifications();
 * console.log(`Processed ${result.processed} notifications, ${result.failed} failed`);
 * ```
 */
export declare const processDueNotifications: () => Promise<{
    processed: number;
    failed: number;
}>;
/**
 * 33. Delays scheduled notification.
 *
 * @param {string} scheduledId - Scheduled notification ID
 * @param {number} delayMinutes - Minutes to delay
 * @returns {Promise<Date>} New scheduled time
 *
 * @example
 * ```typescript
 * const newTime = await delayNotification('scheduled-123', 30);
 * console.log(`Notification delayed until ${newTime}`);
 * ```
 */
export declare const delayNotification: (scheduledId: string, delayMinutes: number) => Promise<Date>;
/**
 * 34. Gets delivery analytics by channel.
 *
 * @param {NotificationChannel} channel - Channel to analyze
 * @param {Date} [startDate] - Start of date range
 * @param {Date} [endDate] - End of date range
 * @returns {Promise<DeliveryAnalytics>} Analytics data
 *
 * @example
 * ```typescript
 * const analytics = await getDeliveryAnalytics('email', lastMonth, today);
 * console.log(`Email delivery rate: ${analytics.deliveryRate}%`);
 * console.log(`Email read rate: ${analytics.readRate}%`);
 * ```
 */
export declare const getDeliveryAnalytics: (channel: NotificationChannel, startDate?: Date, endDate?: Date) => Promise<DeliveryAnalytics>;
/**
 * 35. Generates notification report.
 *
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<string>} Report in JSON format
 *
 * @example
 * ```typescript
 * const report = await generateNotificationReport(lastMonth, today);
 * const reportData = JSON.parse(report);
 * console.log('Total notifications:', reportData.totalNotifications);
 * ```
 */
export declare const generateNotificationReport: (startDate: Date, endDate: Date) => Promise<string>;
/**
 * 36. Tracks notification engagement metrics.
 *
 * @param {string} notificationId - Notification ID
 * @returns {Promise<{ opens: number; clicks: number; conversions: number }>} Engagement metrics
 *
 * @example
 * ```typescript
 * const metrics = await trackNotificationEngagement('notif-123');
 * console.log(`Opens: ${metrics.opens}, Clicks: ${metrics.clicks}`);
 * ```
 */
export declare const trackNotificationEngagement: (notificationId: string) => Promise<{
    opens: number;
    clicks: number;
    conversions: number;
}>;
/**
 * 37. Calculates optimal send time for user.
 *
 * @param {string} userId - User ID
 * @param {NotificationChannel} channel - Notification channel
 * @returns {Promise<{ hour: number; dayOfWeek: number }>} Optimal send time
 *
 * @example
 * ```typescript
 * const optimal = await getOptimalSendTime('user-123', 'email');
 * console.log(`Best time: ${optimal.dayOfWeek} at ${optimal.hour}:00`);
 * // Use this for scheduling to maximize engagement
 * ```
 */
export declare const getOptimalSendTime: (userId: string, channel: NotificationChannel) => Promise<{
    hour: number;
    dayOfWeek: number;
}>;
/**
 * 38. Exports notification data for compliance.
 *
 * @param {string} userId - User ID
 * @param {Date} [startDate] - Start date
 * @param {Date} [endDate] - End date
 * @returns {Promise<string>} Exported data in JSON format
 *
 * @example
 * ```typescript
 * const exportData = await exportNotificationData('user-123');
 * // For HIPAA compliance, GDPR data export, etc.
 * await fs.writeFile('user-notifications-export.json', exportData);
 * ```
 */
export declare const exportNotificationData: (userId: string, startDate?: Date, endDate?: Date) => Promise<string>;
declare const _default: {
    createNotificationTemplateModel: (sequelize: Sequelize) => any;
    createNotificationDeliveryModel: (sequelize: Sequelize) => any;
    createNotificationPreferenceModel: (sequelize: Sequelize) => any;
    sendEmailNotification: (config: EmailConfig) => Promise<{
        messageId: string;
        accepted: string[];
    }>;
    sendSmsNotification: (config: SmsConfig) => Promise<{
        sid: string;
        status: string;
    }>;
    sendPushNotification: (config: PushConfig) => Promise<{
        successCount: number;
        failureCount: number;
    }>;
    sendInAppNotification: (config: InAppConfig) => Promise<string[]>;
    sendMultiChannelNotification: (recipients: string | string[], config: NotificationConfig) => Promise<Record<NotificationChannel, any>>;
    sendEmergencyBroadcast: (recipientIds: string[], message: string, channels?: NotificationChannel[]) => Promise<{
        sent: number;
        failed: number;
    }>;
    sendBatchNotifications: (notifications: Array<{
        recipientId: string;
        config: NotificationConfig;
    }>) => Promise<NotificationBatch>;
    sendNotificationWithRetry: (recipientId: string, config: NotificationConfig, maxRetries?: number) => Promise<{
        success: boolean;
        attempts: number;
    }>;
    compileNotificationTemplate: (templateId: string, variables: Record<string, any>) => Promise<CompiledTemplate>;
    createNotificationTemplate: (template: Omit<NotificationTemplate, "id">) => Promise<string>;
    validateTemplateVariables: (requiredVars: TemplateVariable[], providedVars: Record<string, any>) => {
        valid: boolean;
        missing?: string[];
        invalid?: string[];
    };
    renderTemplate: (template: string, variables: Record<string, any>) => string;
    cloneNotificationTemplate: (templateId: string, newName: string) => Promise<string>;
    getTemplateByLocale: (name: string, locale?: string) => Promise<NotificationTemplate | null>;
    previewTemplate: (templateId: string, sampleVariables: Record<string, any>) => Promise<CompiledTemplate>;
    trackNotificationDelivery: (deliveryId: string) => Promise<NotificationDelivery>;
    updateDeliveryStatus: (deliveryId: string, status: DeliveryStatus, metadata?: Record<string, any>) => Promise<void>;
    getDeliveryHistory: (userId: string, limit?: number) => Promise<NotificationDelivery[]>;
    markNotificationAsRead: (deliveryId: string) => Promise<void>;
    getFailedDeliveries: (limit?: number) => Promise<NotificationDelivery[]>;
    archiveOldDeliveries: (daysToKeep: number) => Promise<number>;
    getUserNotificationPreferences: (userId: string) => Promise<NotificationPreference[]>;
    updateNotificationPreference: (userId: string, channel: NotificationChannel, updates: Partial<NotificationPreference>) => Promise<void>;
    checkNotificationAllowed: (userId: string, channel: NotificationChannel, category?: string) => Promise<boolean>;
    isWithinQuietHours: (preference: NotificationPreference) => boolean;
    unsubscribeFromChannel: (userId: string, channel: NotificationChannel, category?: string) => Promise<void>;
    resubscribeToChannel: (userId: string, channel: NotificationChannel, category?: string) => Promise<void>;
    scheduleNotification: (recipients: string | string[], config: NotificationConfig, scheduledAt: Date) => Promise<string>;
    createRecurringNotification: (recipients: string | string[], config: NotificationConfig, schedule: RecurringSchedule) => Promise<string>;
    cancelScheduledNotification: (scheduledId: string) => Promise<void>;
    getScheduledNotifications: (fromDate?: Date, toDate?: Date) => Promise<ScheduledNotification[]>;
    processDueNotifications: () => Promise<{
        processed: number;
        failed: number;
    }>;
    delayNotification: (scheduledId: string, delayMinutes: number) => Promise<Date>;
    getDeliveryAnalytics: (channel: NotificationChannel, startDate?: Date, endDate?: Date) => Promise<DeliveryAnalytics>;
    generateNotificationReport: (startDate: Date, endDate: Date) => Promise<string>;
    trackNotificationEngagement: (notificationId: string) => Promise<{
        opens: number;
        clicks: number;
        conversions: number;
    }>;
    getOptimalSendTime: (userId: string, channel: NotificationChannel) => Promise<{
        hour: number;
        dayOfWeek: number;
    }>;
    exportNotificationData: (userId: string, startDate?: Date, endDate?: Date) => Promise<string>;
};
export default _default;
//# sourceMappingURL=document-notification-advanced-kit.d.ts.map