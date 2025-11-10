/**
 * LOC: NOTIFPROD001
 * File: /reuse/notification-kit.prod.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS notification services
 *   - Email queue processors
 *   - SMS notification services
 *   - Push notification services
 *   - In-app notification services
 *   - Webhook handlers
 *   - Communication modules
 */
import { ModelAttributes } from 'sequelize';
import { Queue, Job, QueueOptions } from 'bull';
/**
 * Email configuration interface for sending emails across multiple providers.
 */
export interface EmailConfig {
    /** Sender email address */
    from: string;
    /** Recipient email address(es) */
    to: string | string[];
    /** Carbon copy recipients */
    cc?: string | string[];
    /** Blind carbon copy recipients */
    bcc?: string | string[];
    /** Email subject line */
    subject: string;
    /** HTML content */
    html?: string;
    /** Plain text content */
    text?: string;
    /** Email attachments */
    attachments?: EmailAttachment[];
    /** Reply-to address */
    replyTo?: string;
    /** Custom email headers */
    headers?: Record<string, string>;
    /** Email priority level */
    priority?: 'high' | 'normal' | 'low';
    /** Additional metadata */
    metadata?: Record<string, any>;
    /** Template ID (for provider templates) */
    templateId?: string;
    /** Template variables */
    templateData?: Record<string, any>;
    /** Tracking settings */
    tracking?: {
        opens?: boolean;
        clicks?: boolean;
        unsubscribe?: boolean;
    };
}
/**
 * Email attachment interface.
 */
export interface EmailAttachment {
    /** Attachment filename */
    filename: string;
    /** Attachment content (Buffer or string) */
    content?: Buffer | string;
    /** File path (alternative to content) */
    path?: string;
    /** Content type (MIME type) */
    contentType?: string;
    /** Content ID for inline images */
    cid?: string;
    /** Content encoding */
    encoding?: string;
    /** Content disposition */
    disposition?: 'attachment' | 'inline';
    /** File size in bytes */
    size?: number;
}
/**
 * SMTP configuration for direct email sending.
 */
export interface SMTPConfig {
    /** SMTP server hostname */
    host: string;
    /** SMTP server port */
    port: number;
    /** Use secure connection (TLS) */
    secure?: boolean;
    /** Authentication credentials */
    auth?: {
        user: string;
        pass: string;
    };
    /** TLS options */
    tls?: {
        rejectUnauthorized?: boolean;
        minVersion?: string;
        ciphers?: string;
    };
    /** Use connection pooling */
    pool?: boolean;
    /** Maximum number of connections */
    maxConnections?: number;
    /** Rate limiting delta (ms) */
    rateDelta?: number;
    /** Rate limit (emails per delta) */
    rateLimit?: number;
    /** Connection timeout (ms) */
    connectionTimeout?: number;
    /** Greeting timeout (ms) */
    greetingTimeout?: number;
}
/**
 * SendGrid API configuration.
 */
export interface SendGridConfig {
    /** SendGrid API key */
    apiKey: string;
    /** Default sender address */
    from: string;
    /** Dynamic template ID */
    templateId?: string;
    /** Template data */
    dynamicTemplateData?: Record<string, any>;
    /** Tracking settings */
    trackingSettings?: {
        clickTracking?: {
            enable: boolean;
            enableText?: boolean;
        };
        openTracking?: {
            enable: boolean;
            substitutionTag?: string;
        };
        subscriptionTracking?: {
            enable: boolean;
        };
        ganalytics?: {
            enable: boolean;
            utmSource?: string;
        };
    };
    /** Mail settings */
    mailSettings?: {
        sandboxMode?: {
            enable: boolean;
        };
        bypassListManagement?: {
            enable: boolean;
        };
        footer?: {
            enable: boolean;
            text?: string;
            html?: string;
        };
    };
    /** IP pool name */
    ipPoolName?: string;
}
/**
 * AWS SES configuration.
 */
export interface SESConfig {
    /** AWS access key ID */
    accessKeyId: string;
    /** AWS secret access key */
    secretAccessKey: string;
    /** AWS region */
    region: string;
    /** SES configuration set name */
    configurationSetName?: string;
    /** Return path for bounces */
    returnPath?: string;
    /** Source ARN */
    sourceArn?: string;
    /** Return path ARN */
    returnPathArn?: string;
    /** API version */
    apiVersion?: string;
    /** Maximum send rate */
    maxSendRate?: number;
}
/**
 * SMS configuration interface for sending text messages.
 */
export interface SMSConfig {
    /** Recipient phone number(s) */
    to: string | string[];
    /** SMS message body */
    message: string;
    /** Sender ID or phone number */
    from?: string;
    /** Message type */
    messageType?: 'transactional' | 'promotional' | 'otp';
    /** Additional metadata */
    metadata?: Record<string, any>;
    /** Template ID (for provider templates) */
    templateId?: string;
    /** Template variables */
    templateData?: Record<string, any>;
    /** Priority level */
    priority?: 'high' | 'normal' | 'low';
    /** Validity period (seconds) */
    validityPeriod?: number;
    /** Delivery receipt requested */
    deliveryReceipt?: boolean;
}
/**
 * Twilio SMS configuration.
 */
export interface TwilioConfig {
    /** Twilio account SID */
    accountSid: string;
    /** Twilio auth token */
    authToken: string;
    /** Default from phone number */
    fromNumber: string;
    /** Messaging service SID */
    messagingServiceSid?: string;
    /** Status callback URL */
    statusCallback?: string;
    /** Max price per message */
    maxPrice?: number;
    /** Validity period */
    validityPeriod?: number;
}
/**
 * AWS SNS SMS configuration.
 */
export interface SNSConfig {
    /** AWS access key ID */
    accessKeyId: string;
    /** AWS secret access key */
    secretAccessKey: string;
    /** AWS region */
    region: string;
    /** Default sender ID */
    senderId?: string;
    /** SMS type (Promotional or Transactional) */
    smsType?: 'Promotional' | 'Transactional';
    /** Maximum spend limit */
    monthlySpendLimit?: number;
    /** Default data protection policy ARN */
    dataProtectionPolicyArn?: string;
}
/**
 * Push notification configuration.
 */
export interface PushNotificationConfig {
    /** Device token(s) */
    tokens: string | string[];
    /** Notification title */
    title: string;
    /** Notification body */
    body: string;
    /** Notification data payload */
    data?: Record<string, any>;
    /** Notification image URL */
    imageUrl?: string;
    /** Notification icon */
    icon?: string;
    /** Notification badge count */
    badge?: number;
    /** Notification sound */
    sound?: string;
    /** Notification tag */
    tag?: string;
    /** Priority level */
    priority?: 'high' | 'normal' | 'low';
    /** Time to live (seconds) */
    ttl?: number;
    /** Click action URL */
    clickAction?: string;
    /** Collapse key */
    collapseKey?: string;
    /** Additional metadata */
    metadata?: Record<string, any>;
}
/**
 * Firebase Cloud Messaging (FCM) configuration.
 */
export interface FCMConfig {
    /** Firebase project ID */
    projectId: string;
    /** Service account credentials */
    credentials: {
        type: string;
        project_id: string;
        private_key_id: string;
        private_key: string;
        client_email: string;
        client_id: string;
        auth_uri: string;
        token_uri: string;
        auth_provider_x509_cert_url: string;
        client_x509_cert_url: string;
    };
    /** Default notification channel */
    defaultChannel?: string;
}
/**
 * Apple Push Notification Service (APNs) configuration.
 */
export interface APNsConfig {
    /** Team ID */
    teamId: string;
    /** Key ID */
    keyId: string;
    /** Private key path or content */
    key: string;
    /** Bundle ID */
    bundleId: string;
    /** Production environment */
    production?: boolean;
    /** Default topic */
    defaultTopic?: string;
}
/**
 * In-app notification configuration.
 */
export interface InAppNotificationConfig {
    /** User ID(s) to notify */
    userId: string | string[];
    /** Notification title */
    title: string;
    /** Notification message */
    message: string;
    /** Notification type/category */
    type?: string;
    /** Notification priority */
    priority?: 'urgent' | 'high' | 'normal' | 'low';
    /** Notification data payload */
    data?: Record<string, any>;
    /** Action buttons */
    actions?: NotificationAction[];
    /** Icon or avatar URL */
    icon?: string;
    /** Image URL */
    imageUrl?: string;
    /** Link/URL to navigate to */
    link?: string;
    /** Auto-dismiss after duration (ms) */
    autoDismiss?: number;
    /** Notification TTL (time to live in seconds) */
    ttl?: number;
    /** Tags for categorization */
    tags?: string[];
    /** Additional metadata */
    metadata?: Record<string, any>;
}
/**
 * Notification action button.
 */
export interface NotificationAction {
    /** Action ID */
    id: string;
    /** Action label */
    label: string;
    /** Action type */
    type?: 'primary' | 'secondary' | 'danger';
    /** Action URL or route */
    action?: string;
    /** Icon for action */
    icon?: string;
}
/**
 * Notification template definition.
 */
export interface NotificationTemplate {
    /** Template ID */
    id: string;
    /** Template name */
    name: string;
    /** Template category */
    category?: string;
    /** Template type */
    type: 'email' | 'sms' | 'push' | 'in_app';
    /** Subject (for email) */
    subject?: string;
    /** HTML template (for email) */
    htmlTemplate?: string;
    /** Text template */
    textTemplate?: string;
    /** Template variables */
    variables: string[];
    /** Template locale */
    locale?: string;
    /** Template version */
    version?: number;
    /** Default values for variables */
    defaults?: Record<string, any>;
    /** Template metadata */
    metadata?: Record<string, any>;
    /** Template status */
    status?: 'active' | 'draft' | 'archived';
    /** Created timestamp */
    createdAt?: Date;
    /** Updated timestamp */
    updatedAt?: Date;
}
/**
 * Template data for rendering.
 */
export interface TemplateData {
    [key: string]: any;
}
/**
 * Template rendering result.
 */
export interface RenderedTemplate {
    /** Rendered subject */
    subject?: string;
    /** Rendered HTML content */
    html?: string;
    /** Rendered text content */
    text?: string;
    /** Template ID used */
    templateId: string;
    /** Variables used */
    variables: Record<string, any>;
    /** Rendering timestamp */
    renderedAt: Date;
}
/**
 * Notification queue job configuration.
 */
export interface NotificationQueueJob {
    /** Job ID */
    id: string;
    /** Notification type */
    type: 'email' | 'sms' | 'push' | 'in_app';
    /** Notification payload */
    payload: EmailConfig | SMSConfig | PushNotificationConfig | InAppNotificationConfig;
    /** Job priority */
    priority?: number;
    /** Delay before processing (ms) */
    delay?: number;
    /** Maximum retry attempts */
    attempts?: number;
    /** Backoff strategy */
    backoff?: {
        type: 'fixed' | 'exponential';
        delay: number;
    };
    /** Remove on completion */
    removeOnComplete?: boolean;
    /** Remove on failure */
    removeOnFail?: boolean;
    /** Job timeout (ms) */
    timeout?: number;
    /** Job metadata */
    metadata?: Record<string, any>;
}
/**
 * Scheduled notification configuration.
 */
export interface ScheduledNotification {
    /** Schedule ID */
    id: string;
    /** Notification type */
    type: 'email' | 'sms' | 'push' | 'in_app';
    /** Notification payload */
    payload: EmailConfig | SMSConfig | PushNotificationConfig | InAppNotificationConfig;
    /** Scheduled send time */
    scheduledFor: Date;
    /** Recurring schedule (cron expression) */
    cronExpression?: string;
    /** Timezone for scheduling */
    timezone?: string;
    /** Maximum retry attempts */
    maxRetries?: number;
    /** Schedule status */
    status?: 'pending' | 'scheduled' | 'sent' | 'failed' | 'cancelled';
    /** Additional metadata */
    metadata?: Record<string, any>;
}
/**
 * Batch notification job configuration.
 */
export interface BatchNotificationJob {
    /** Batch ID */
    id: string;
    /** Notification type */
    type: 'email' | 'sms' | 'push' | 'in_app';
    /** Template ID */
    templateId?: string;
    /** Recipients list */
    recipients: BatchRecipient[];
    /** Batch size */
    batchSize?: number;
    /** Throttle delay between batches (ms) */
    throttleMs?: number;
    /** Total recipients */
    totalRecipients?: number;
    /** Processed count */
    processedCount?: number;
    /** Success count */
    successCount?: number;
    /** Failure count */
    failureCount?: number;
    /** Batch status */
    status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
    /** Additional metadata */
    metadata?: Record<string, any>;
}
/**
 * Batch recipient configuration.
 */
export interface BatchRecipient {
    /** Recipient identifier (email, phone, userId, token) */
    recipient: string;
    /** Recipient name */
    name?: string;
    /** Template data for this recipient */
    templateData?: TemplateData;
    /** Recipient metadata */
    metadata?: Record<string, any>;
}
/**
 * Notification delivery log.
 */
export interface NotificationDeliveryLog {
    /** Log ID */
    id: string;
    /** Notification ID */
    notificationId: string;
    /** Notification type */
    type: 'email' | 'sms' | 'push' | 'in_app';
    /** Recipient identifier */
    recipient: string;
    /** Delivery status */
    status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced' | 'rejected' | 'read';
    /** Provider used */
    provider?: string;
    /** Provider message ID */
    providerMessageId?: string;
    /** Sent timestamp */
    sentAt?: Date;
    /** Delivered timestamp */
    deliveredAt?: Date;
    /** Read timestamp */
    readAt?: Date;
    /** Failed timestamp */
    failedAt?: Date;
    /** Failure reason */
    failureReason?: string;
    /** Number of retry attempts */
    retryCount?: number;
    /** Additional metadata */
    metadata?: Record<string, any>;
    /** Created timestamp */
    createdAt?: Date;
    /** Updated timestamp */
    updatedAt?: Date;
}
/**
 * Notification tracking data.
 */
export interface NotificationTracking {
    /** Notification ID */
    notificationId: string;
    /** Recipient identifier */
    recipient: string;
    /** Tracking token */
    trackingToken: string;
    /** Notification opened */
    opened: boolean;
    /** Opened timestamp */
    openedAt?: Date;
    /** Open count */
    openCount: number;
    /** Links clicked */
    clickedLinks: string[];
    /** Last clicked timestamp */
    lastClickedAt?: Date;
    /** Click count */
    clickCount: number;
    /** User agent */
    userAgent?: string;
    /** IP address */
    ipAddress?: string;
    /** Geographic location */
    location?: {
        country?: string;
        region?: string;
        city?: string;
    };
    /** Device information */
    device?: {
        type?: string;
        os?: string;
        browser?: string;
    };
}
/**
 * Notification analytics summary.
 */
export interface NotificationAnalytics {
    /** Total notifications sent */
    totalSent: number;
    /** Total delivered */
    totalDelivered: number;
    /** Total failed */
    totalFailed: number;
    /** Total bounced */
    totalBounced: number;
    /** Total opened */
    totalOpened: number;
    /** Total clicked */
    totalClicked: number;
    /** Delivery rate (%) */
    deliveryRate: number;
    /** Open rate (%) */
    openRate: number;
    /** Click rate (%) */
    clickRate: number;
    /** Click-to-open rate (%) */
    clickToOpenRate: number;
    /** Bounce rate (%) */
    bounceRate: number;
    /** Average delivery time (ms) */
    avgDeliveryTime: number;
    /** Period start */
    periodStart: Date;
    /** Period end */
    periodEnd: Date;
}
/**
 * Notification preferences for a user.
 */
export interface NotificationPreferences {
    /** User ID */
    userId: string;
    /** Email notifications enabled */
    emailEnabled: boolean;
    /** SMS notifications enabled */
    smsEnabled: boolean;
    /** Push notifications enabled */
    pushEnabled: boolean;
    /** In-app notifications enabled */
    inAppEnabled: boolean;
    /** Channel-specific preferences */
    channels?: {
        email?: ChannelPreferences;
        sms?: ChannelPreferences;
        push?: ChannelPreferences;
        inApp?: ChannelPreferences;
    };
    /** Category preferences */
    categories?: Record<string, boolean>;
    /** Quiet hours */
    quietHours?: {
        enabled: boolean;
        startTime: string;
        endTime: string;
        timezone: string;
    };
    /** Frequency limits */
    frequencyLimits?: {
        maxPerHour?: number;
        maxPerDay?: number;
        maxPerWeek?: number;
    };
    /** Preferred language */
    locale?: string;
    /** Created timestamp */
    createdAt?: Date;
    /** Updated timestamp */
    updatedAt?: Date;
}
/**
 * Channel-specific preferences.
 */
export interface ChannelPreferences {
    /** Channel enabled */
    enabled: boolean;
    /** Notification types enabled */
    types?: string[];
    /** Delivery schedule */
    schedule?: {
        days?: string[];
        startTime?: string;
        endTime?: string;
    };
}
/**
 * Unsubscribe record.
 */
export interface UnsubscribeRecord {
    /** Record ID */
    id: string;
    /** User ID or email/phone */
    identifier: string;
    /** Identifier type */
    identifierType: 'userId' | 'email' | 'phone' | 'deviceToken';
    /** Notification type unsubscribed from */
    type?: 'email' | 'sms' | 'push' | 'in_app' | 'all';
    /** Category unsubscribed from */
    category?: string;
    /** Unsubscribe reason */
    reason?: string;
    /** Unsubscribe timestamp */
    unsubscribedAt: Date;
    /** Unsubscribe token */
    token?: string;
    /** IP address of unsubscribe */
    ipAddress?: string;
    /** User agent */
    userAgent?: string;
    /** Additional metadata */
    metadata?: Record<string, any>;
}
/**
 * Webhook event data.
 */
export interface WebhookEvent {
    /** Event ID */
    id: string;
    /** Event type */
    type: string;
    /** Event timestamp */
    timestamp: Date;
    /** Provider name */
    provider: 'sendgrid' | 'ses' | 'twilio' | 'sns' | 'fcm' | 'apns' | 'custom';
    /** Notification ID */
    notificationId?: string;
    /** Recipient */
    recipient?: string;
    /** Event data payload */
    data: Record<string, any>;
    /** Webhook signature */
    signature?: string;
    /** Processing status */
    processed?: boolean;
    /** Processing timestamp */
    processedAt?: Date;
    /** Processing result */
    result?: {
        success: boolean;
        error?: string;
    };
}
/**
 * Webhook configuration.
 */
export interface WebhookConfig {
    /** Webhook ID */
    id: string;
    /** Webhook URL */
    url: string;
    /** Event types to receive */
    events: string[];
    /** Webhook secret for signature verification */
    secret?: string;
    /** Headers to include */
    headers?: Record<string, string>;
    /** Webhook status */
    status?: 'active' | 'inactive' | 'failed';
    /** Retry configuration */
    retryConfig?: {
        maxAttempts: number;
        backoffMs: number;
    };
    /** Additional metadata */
    metadata?: Record<string, any>;
}
/**
 * Zod schema for email configuration validation.
 */
export declare const EmailConfigSchema: any;
/**
 * Zod schema for SMS configuration validation.
 */
export declare const SMSConfigSchema: any;
/**
 * Zod schema for push notification configuration validation.
 */
export declare const PushNotificationConfigSchema: any;
/**
 * Zod schema for in-app notification configuration validation.
 */
export declare const InAppNotificationConfigSchema: any;
/**
 * Zod schema for notification template validation.
 */
export declare const NotificationTemplateSchema: any;
/**
 * Zod schema for notification preferences validation.
 */
export declare const NotificationPreferencesSchema: any;
/**
 * Zod schema for batch notification job validation.
 */
export declare const BatchNotificationJobSchema: any;
/**
 * Sequelize NotificationTemplate model attributes.
 *
 * @example
 * ```typescript
 * import { DataTypes, Model } from 'sequelize';
 *
 * class NotificationTemplate extends Model {}
 *
 * NotificationTemplate.init(getNotificationTemplateModelAttributes(), {
 *   sequelize,
 *   tableName: 'notification_templates',
 *   timestamps: true
 * });
 * ```
 */
export declare function getNotificationTemplateModelAttributes(): ModelAttributes;
/**
 * Sequelize NotificationDeliveryLog model attributes.
 *
 * @example
 * ```typescript
 * import { DataTypes, Model } from 'sequelize';
 *
 * class NotificationDeliveryLog extends Model {}
 *
 * NotificationDeliveryLog.init(getNotificationDeliveryLogModelAttributes(), {
 *   sequelize,
 *   tableName: 'notification_delivery_logs',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['notificationId'] },
 *     { fields: ['recipient'] },
 *     { fields: ['status'] },
 *     { fields: ['type'] },
 *     { fields: ['sentAt'] }
 *   ]
 * });
 * ```
 */
export declare function getNotificationDeliveryLogModelAttributes(): ModelAttributes;
/**
 * Sequelize NotificationPreferences model attributes.
 *
 * @example
 * ```typescript
 * import { DataTypes, Model } from 'sequelize';
 *
 * class NotificationPreferences extends Model {}
 *
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
export declare function getNotificationPreferencesModelAttributes(): ModelAttributes;
/**
 * Sequelize UnsubscribeRecord model attributes.
 *
 * @example
 * ```typescript
 * import { DataTypes, Model } from 'sequelize';
 *
 * class UnsubscribeRecord extends Model {}
 *
 * UnsubscribeRecord.init(getUnsubscribeRecordModelAttributes(), {
 *   sequelize,
 *   tableName: 'unsubscribe_records',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['identifier', 'type'], unique: true },
 *     { fields: ['token'], unique: true }
 *   ]
 * });
 * ```
 */
export declare function getUnsubscribeRecordModelAttributes(): ModelAttributes;
/**
 * Sequelize NotificationTracking model attributes.
 *
 * @example
 * ```typescript
 * import { DataTypes, Model } from 'sequelize';
 *
 * class NotificationTracking extends Model {}
 *
 * NotificationTracking.init(getNotificationTrackingModelAttributes(), {
 *   sequelize,
 *   tableName: 'notification_tracking',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['notificationId'] },
 *     { fields: ['trackingToken'], unique: true },
 *     { fields: ['recipient'] }
 *   ]
 * });
 * ```
 */
export declare function getNotificationTrackingModelAttributes(): ModelAttributes;
/**
 * Sequelize WebhookEvent model attributes.
 *
 * @example
 * ```typescript
 * import { DataTypes, Model } from 'sequelize';
 *
 * class WebhookEvent extends Model {}
 *
 * WebhookEvent.init(getWebhookEventModelAttributes(), {
 *   sequelize,
 *   tableName: 'webhook_events',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['eventType'] },
 *     { fields: ['provider'] },
 *     { fields: ['notificationId'] },
 *     { fields: ['processed'] },
 *     { fields: ['timestamp'] }
 *   ]
 * });
 * ```
 */
export declare function getWebhookEventModelAttributes(): ModelAttributes;
/**
 * Sequelize ScheduledNotification model attributes.
 *
 * @example
 * ```typescript
 * import { DataTypes, Model } from 'sequelize';
 *
 * class ScheduledNotification extends Model {}
 *
 * ScheduledNotification.init(getScheduledNotificationModelAttributes(), {
 *   sequelize,
 *   tableName: 'scheduled_notifications',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['scheduledFor'] },
 *     { fields: ['status'] },
 *     { fields: ['type'] }
 *   ]
 * });
 * ```
 */
export declare function getScheduledNotificationModelAttributes(): ModelAttributes;
/**
 * Send email via SMTP.
 *
 * @param {SMTPConfig} smtpConfig - SMTP server configuration
 * @param {EmailConfig} emailConfig - Email configuration
 * @returns {Promise<{ success: boolean; messageId?: string; error?: string }>} Send result
 *
 * @example
 * ```typescript
 * const smtpConfig = {
 *   host: 'smtp.gmail.com',
 *   port: 587,
 *   secure: false,
 *   auth: { user: 'user@example.com', pass: 'password' }
 * };
 *
 * const result = await sendEmailViaSMTP(smtpConfig, {
 *   from: 'noreply@whitecross.com',
 *   to: 'patient@example.com',
 *   subject: 'Appointment Reminder',
 *   html: '<p>Your appointment is tomorrow at 2pm</p>'
 * });
 * ```
 */
export declare function sendEmailViaSMTP(smtpConfig: SMTPConfig, emailConfig: EmailConfig): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
}>;
/**
 * Send email via SendGrid API.
 *
 * @param {SendGridConfig} sendGridConfig - SendGrid configuration
 * @param {EmailConfig} emailConfig - Email configuration
 * @returns {Promise<{ success: boolean; messageId?: string; error?: string }>} Send result
 *
 * @example
 * ```typescript
 * const result = await sendEmailViaSendGrid(
 *   { apiKey: 'SG.xxx', from: 'noreply@whitecross.com' },
 *   {
 *     to: 'patient@example.com',
 *     subject: 'Test Results Available',
 *     templateId: 'd-xxxxx',
 *     templateData: { patientName: 'John Doe' }
 *   }
 * );
 * ```
 */
export declare function sendEmailViaSendGrid(sendGridConfig: SendGridConfig, emailConfig: EmailConfig): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
}>;
/**
 * Send email via AWS SES.
 *
 * @param {SESConfig} sesConfig - AWS SES configuration
 * @param {EmailConfig} emailConfig - Email configuration
 * @returns {Promise<{ success: boolean; messageId?: string; error?: string }>} Send result
 *
 * @example
 * ```typescript
 * const result = await sendEmailViaSES(
 *   {
 *     accessKeyId: 'AKIAXXXX',
 *     secretAccessKey: 'xxxx',
 *     region: 'us-east-1'
 *   },
 *   {
 *     from: 'noreply@whitecross.com',
 *     to: 'patient@example.com',
 *     subject: 'Billing Statement',
 *     html: '<p>Your statement is ready</p>'
 *   }
 * );
 * ```
 */
export declare function sendEmailViaSES(sesConfig: SESConfig, emailConfig: EmailConfig): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
}>;
/**
 * Send SMS via Twilio.
 *
 * @param {TwilioConfig} twilioConfig - Twilio configuration
 * @param {SMSConfig} smsConfig - SMS configuration
 * @returns {Promise<{ success: boolean; messageId?: string; error?: string }>} Send result
 *
 * @example
 * ```typescript
 * const result = await sendSMSViaTwilio(
 *   {
 *     accountSid: 'ACxxxx',
 *     authToken: 'xxxx',
 *     fromNumber: '+1234567890'
 *   },
 *   {
 *     to: '+0987654321',
 *     message: 'Your appointment is confirmed for tomorrow at 2pm'
 *   }
 * );
 * ```
 */
export declare function sendSMSViaTwilio(twilioConfig: TwilioConfig, smsConfig: SMSConfig): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
}>;
/**
 * Send SMS via AWS SNS.
 *
 * @param {SNSConfig} snsConfig - AWS SNS configuration
 * @param {SMSConfig} smsConfig - SMS configuration
 * @returns {Promise<{ success: boolean; messageId?: string; error?: string }>} Send result
 *
 * @example
 * ```typescript
 * const result = await sendSMSViaSNS(
 *   {
 *     accessKeyId: 'AKIAXXXX',
 *     secretAccessKey: 'xxxx',
 *     region: 'us-east-1',
 *     smsType: 'Transactional'
 *   },
 *   {
 *     to: '+1234567890',
 *     message: 'Your OTP is 123456'
 *   }
 * );
 * ```
 */
export declare function sendSMSViaSNS(snsConfig: SNSConfig, smsConfig: SMSConfig): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
}>;
/**
 * Send push notification via Firebase Cloud Messaging (FCM).
 *
 * @param {FCMConfig} fcmConfig - FCM configuration
 * @param {PushNotificationConfig} pushConfig - Push notification configuration
 * @returns {Promise<{ success: boolean; messageId?: string; error?: string }>} Send result
 *
 * @example
 * ```typescript
 * const result = await sendPushViaFCM(
 *   {
 *     projectId: 'white-cross',
 *     credentials: {...}
 *   },
 *   {
 *     tokens: ['device-token-1', 'device-token-2'],
 *     title: 'New Message',
 *     body: 'You have a new message from Dr. Smith',
 *     data: { chatId: '123' }
 *   }
 * );
 * ```
 */
export declare function sendPushViaFCM(fcmConfig: FCMConfig, pushConfig: PushNotificationConfig): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
}>;
/**
 * Send push notification via Apple Push Notification Service (APNs).
 *
 * @param {APNsConfig} apnsConfig - APNs configuration
 * @param {PushNotificationConfig} pushConfig - Push notification configuration
 * @returns {Promise<{ success: boolean; messageId?: string; error?: string }>} Send result
 *
 * @example
 * ```typescript
 * const result = await sendPushViaAPNs(
 *   {
 *     teamId: 'TEAM123',
 *     keyId: 'KEY123',
 *     key: '...',
 *     bundleId: 'com.whitecross.app'
 *   },
 *   {
 *     tokens: 'device-token',
 *     title: 'Appointment Reminder',
 *     body: 'Your appointment is in 1 hour',
 *     badge: 1
 *   }
 * );
 * ```
 */
export declare function sendPushViaAPNs(apnsConfig: APNsConfig, pushConfig: PushNotificationConfig): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
}>;
/**
 * Render Handlebars template with data.
 *
 * @param {string} template - Handlebars template string
 * @param {TemplateData} data - Template data
 * @returns {string} Rendered template
 *
 * @example
 * ```typescript
 * const html = renderHandlebarsTemplate(
 *   '<h1>Hello {{name}}</h1><p>Your appointment is on {{date}}</p>',
 *   { name: 'John Doe', date: '2025-11-15' }
 * );
 * ```
 */
export declare function renderHandlebarsTemplate(template: string, data: TemplateData): string;
/**
 * Render notification template.
 *
 * @param {NotificationTemplate} template - Notification template
 * @param {TemplateData} data - Template data
 * @returns {RenderedTemplate} Rendered template result
 *
 * @example
 * ```typescript
 * const rendered = renderNotificationTemplate(
 *   {
 *     id: 'tpl-001',
 *     type: 'email',
 *     subject: 'Welcome {{name}}',
 *     htmlTemplate: '<h1>Welcome {{name}}</h1>',
 *     variables: ['name']
 *   },
 *   { name: 'John Doe' }
 * );
 * ```
 */
export declare function renderNotificationTemplate(template: NotificationTemplate, data: TemplateData): RenderedTemplate;
/**
 * Validate template variables.
 *
 * @param {NotificationTemplate} template - Notification template
 * @param {TemplateData} data - Template data
 * @returns {{ valid: boolean; missingVariables: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateTemplateVariables(
 *   { variables: ['name', 'date'], ... },
 *   { name: 'John' }
 * );
 * // Returns: { valid: false, missingVariables: ['date'] }
 * ```
 */
export declare function validateTemplateVariables(template: NotificationTemplate, data: TemplateData): {
    valid: boolean;
    missingVariables: string[];
};
/**
 * Create notification queue with Bull.
 *
 * @param {string} queueName - Queue name
 * @param {QueueOptions} options - Queue options
 * @returns {Queue} Bull queue instance
 *
 * @example
 * ```typescript
 * const emailQueue = createNotificationQueue('email-notifications', {
 *   redis: { host: 'localhost', port: 6379 }
 * });
 * ```
 */
export declare function createNotificationQueue(queueName: string, options: QueueOptions): Queue;
/**
 * Add notification to queue.
 *
 * @param {Queue} queue - Bull queue instance
 * @param {NotificationQueueJob} job - Notification job
 * @returns {Promise<Job>} Queued job
 *
 * @example
 * ```typescript
 * const job = await addNotificationToQueue(emailQueue, {
 *   id: 'job-001',
 *   type: 'email',
 *   payload: {...},
 *   priority: 1,
 *   attempts: 3
 * });
 * ```
 */
export declare function addNotificationToQueue(queue: Queue, job: NotificationQueueJob): Promise<Job>;
/**
 * Add batch notifications to queue.
 *
 * @param {Queue} queue - Bull queue instance
 * @param {NotificationQueueJob[]} jobs - Array of notification jobs
 * @returns {Promise<Job[]>} Array of queued jobs
 *
 * @example
 * ```typescript
 * const jobs = await addBatchNotificationsToQueue(smsQueue, [
 *   { id: 'job-1', type: 'sms', payload: {...} },
 *   { id: 'job-2', type: 'sms', payload: {...} }
 * ]);
 * ```
 */
export declare function addBatchNotificationsToQueue(queue: Queue, jobs: NotificationQueueJob[]): Promise<Job[]>;
/**
 * Process notification queue with exponential backoff retry.
 *
 * @param {Queue} queue - Bull queue instance
 * @param {Function} processor - Job processor function
 * @returns {void}
 *
 * @example
 * ```typescript
 * processNotificationQueue(emailQueue, async (job) => {
 *   const result = await sendEmailViaSMTP(smtpConfig, job.data);
 *   if (!result.success) throw new Error(result.error);
 *   return result;
 * });
 * ```
 */
export declare function processNotificationQueue(queue: Queue, processor: (job: Job) => Promise<any>): void;
/**
 * Generate tracking token for notification.
 *
 * @param {string} notificationId - Notification ID
 * @param {string} recipient - Recipient identifier
 * @returns {string} Tracking token
 *
 * @example
 * ```typescript
 * const token = generateTrackingToken('notif-123', 'user@example.com');
 * // Returns: base64 encoded token
 * ```
 */
export declare function generateTrackingToken(notificationId: string, recipient: string): string;
/**
 * Verify tracking token.
 *
 * @param {string} token - Tracking token
 * @returns {{ valid: boolean; notificationId?: string; recipient?: string }} Verification result
 *
 * @example
 * ```typescript
 * const result = verifyTrackingToken(token);
 * if (result.valid) {
 *   console.log(`Valid token for notification ${result.notificationId}`);
 * }
 * ```
 */
export declare function verifyTrackingToken(token: string): {
    valid: boolean;
    notificationId?: string;
    recipient?: string;
};
/**
 * Track notification open event.
 *
 * @param {string} trackingToken - Tracking token
 * @param {Object} context - Tracking context
 * @returns {Promise<{ success: boolean; error?: string }>} Tracking result
 *
 * @example
 * ```typescript
 * await trackNotificationOpen(token, {
 *   userAgent: req.headers['user-agent'],
 *   ipAddress: req.ip
 * });
 * ```
 */
export declare function trackNotificationOpen(trackingToken: string, context: {
    userAgent?: string;
    ipAddress?: string;
}): Promise<{
    success: boolean;
    error?: string;
}>;
/**
 * Track notification link click.
 *
 * @param {string} trackingToken - Tracking token
 * @param {string} link - Clicked link URL
 * @param {Object} context - Tracking context
 * @returns {Promise<{ success: boolean; error?: string }>} Tracking result
 *
 * @example
 * ```typescript
 * await trackNotificationClick(token, 'https://whitecross.com/appointment', {
 *   userAgent: req.headers['user-agent'],
 *   ipAddress: req.ip
 * });
 * ```
 */
export declare function trackNotificationClick(trackingToken: string, link: string, context: {
    userAgent?: string;
    ipAddress?: string;
}): Promise<{
    success: boolean;
    error?: string;
}>;
/**
 * Check if user can receive notification based on preferences.
 *
 * @param {NotificationPreferences} preferences - User notification preferences
 * @param {Object} notification - Notification details
 * @returns {boolean} Whether notification can be sent
 *
 * @example
 * ```typescript
 * const canSend = canSendNotification(userPreferences, {
 *   type: 'email',
 *   category: 'appointment',
 *   timestamp: new Date()
 * });
 * ```
 */
export declare function canSendNotification(preferences: NotificationPreferences, notification: {
    type: string;
    category?: string;
    timestamp?: Date;
}): boolean;
/**
 * Generate unsubscribe token.
 *
 * @param {string} identifier - User identifier (email, userId, etc.)
 * @param {string} type - Notification type
 * @returns {string} Unsubscribe token
 *
 * @example
 * ```typescript
 * const token = generateUnsubscribeToken('user@example.com', 'email');
 * ```
 */
export declare function generateUnsubscribeToken(identifier: string, type: string): string;
/**
 * Verify unsubscribe token.
 *
 * @param {string} token - Unsubscribe token
 * @returns {{ valid: boolean; identifier?: string; type?: string }} Verification result
 *
 * @example
 * ```typescript
 * const result = verifyUnsubscribeToken(token);
 * if (result.valid) {
 *   await unsubscribeUser(result.identifier, result.type);
 * }
 * ```
 */
export declare function verifyUnsubscribeToken(token: string): {
    valid: boolean;
    identifier?: string;
    type?: string;
};
/**
 * Verify webhook signature.
 *
 * @param {string} payload - Webhook payload
 * @param {string} signature - Webhook signature
 * @param {string} secret - Webhook secret
 * @returns {boolean} Whether signature is valid
 *
 * @example
 * ```typescript
 * const isValid = verifyWebhookSignature(
 *   req.body,
 *   req.headers['x-webhook-signature'],
 *   process.env.WEBHOOK_SECRET
 * );
 * ```
 */
export declare function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean;
/**
 * Process SendGrid webhook event.
 *
 * @param {any} event - SendGrid webhook event
 * @returns {Promise<{ success: boolean; error?: string }>} Processing result
 *
 * @example
 * ```typescript
 * for (const event of req.body) {
 *   await processSendGridWebhook(event);
 * }
 * ```
 */
export declare function processSendGridWebhook(event: any): Promise<{
    success: boolean;
    error?: string;
}>;
/**
 * Process Twilio webhook event.
 *
 * @param {any} event - Twilio webhook event
 * @returns {Promise<{ success: boolean; error?: string }>} Processing result
 *
 * @example
 * ```typescript
 * const result = await processTwilioWebhook(req.body);
 * ```
 */
export declare function processTwilioWebhook(event: any): Promise<{
    success: boolean;
    error?: string;
}>;
/**
 * Calculate notification analytics.
 *
 * @param {NotificationDeliveryLog[]} logs - Array of delivery logs
 * @param {Date} periodStart - Analytics period start
 * @param {Date} periodEnd - Analytics period end
 * @returns {NotificationAnalytics} Analytics summary
 *
 * @example
 * ```typescript
 * const analytics = calculateNotificationAnalytics(
 *   deliveryLogs,
 *   new Date('2025-11-01'),
 *   new Date('2025-11-30')
 * );
 * ```
 */
export declare function calculateNotificationAnalytics(logs: NotificationDeliveryLog[], periodStart: Date, periodEnd: Date): NotificationAnalytics;
/**
 * Validate email address format.
 *
 * @param {string} email - Email address
 * @returns {boolean} Whether email is valid
 *
 * @example
 * ```typescript
 * if (validateEmailFormat('user@example.com')) {
 *   // Send email
 * }
 * ```
 */
export declare function validateEmailFormat(email: string): boolean;
/**
 * Validate phone number format (E.164).
 *
 * @param {string} phone - Phone number
 * @returns {boolean} Whether phone number is valid
 *
 * @example
 * ```typescript
 * if (validatePhoneFormat('+1234567890')) {
 *   // Send SMS
 * }
 * ```
 */
export declare function validatePhoneFormat(phone: string): boolean;
/**
 * Sanitize HTML content for email.
 *
 * @param {string} html - HTML content
 * @returns {string} Sanitized HTML
 *
 * @example
 * ```typescript
 * const safe = sanitizeEmailHTML(userGeneratedContent);
 * ```
 */
export declare function sanitizeEmailHTML(html: string): string;
/**
 * NestJS service for managing notifications.
 *
 * @example
 * ```typescript
 * @Module({
 *   providers: [NotificationService],
 *   exports: [NotificationService]
 * })
 * export class NotificationModule {}
 * ```
 */
export declare class NotificationService {
    private readonly logger;
    constructor();
    /**
     * Send email notification.
     */
    sendEmail(config: EmailConfig): Promise<{
        success: boolean;
        messageId?: string;
    }>;
    /**
     * Send SMS notification.
     */
    sendSMS(config: SMSConfig): Promise<{
        success: boolean;
        messageId?: string;
    }>;
    /**
     * Send push notification.
     */
    sendPush(config: PushNotificationConfig): Promise<{
        success: boolean;
        messageId?: string;
    }>;
    /**
     * Send in-app notification.
     */
    sendInApp(config: InAppNotificationConfig): Promise<{
        success: boolean;
        messageId?: string;
    }>;
}
/**
 * NestJS controller for notification management endpoints.
 *
 * @example
 * ```typescript
 * @Module({
 *   controllers: [NotificationsController],
 *   providers: [NotificationService]
 * })
 * export class NotificationModule {}
 * ```
 */
export declare class NotificationsController {
    private readonly notificationService;
    private readonly logger;
    constructor(notificationService: NotificationService);
    /**
     * Send email notification.
     */
    sendEmail(emailConfig: EmailConfig): Promise<{
        success: boolean;
        messageId?: string;
    }>;
    /**
     * Send SMS notification.
     */
    sendSMS(smsConfig: SMSConfig): Promise<{
        success: boolean;
        messageId?: string;
    }>;
    /**
     * Send push notification.
     */
    sendPush(pushConfig: PushNotificationConfig): Promise<{
        success: boolean;
        messageId?: string;
    }>;
    /**
     * Send in-app notification.
     */
    sendInApp(inAppConfig: InAppNotificationConfig): Promise<{
        success: boolean;
        messageId?: string;
    }>;
    /**
     * Get notification delivery status.
     */
    getDeliveryStatus(notificationId: string): Promise<{
        notificationId: string;
        status: string;
        deliveredAt: Date;
    }>;
    /**
     * Get notification analytics.
     */
    getAnalytics(startDate?: string, endDate?: string): Promise<{
        totalSent: number;
        totalDelivered: number;
        deliveryRate: number;
        openRate: number;
        clickRate: number;
    }>;
    /**
     * Track notification open.
     */
    trackOpen(token: string): Promise<{
        success: boolean;
        error?: string;
    }>;
    /**
     * Track notification click.
     */
    trackClick(token: string, link: string): Promise<{
        success: boolean;
        error?: string;
    }>;
    /**
     * Unsubscribe from notifications.
     */
    unsubscribe(token: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
/**
 * NestJS controller for template management.
 */
export declare class NotificationTemplatesController {
    private readonly logger;
    /**
     * List all templates.
     */
    listTemplates(type?: string, category?: string): Promise<never[]>;
    /**
     * Get template by ID.
     */
    getTemplate(id: string): Promise<void>;
    /**
     * Create new template.
     */
    createTemplate(template: NotificationTemplate): Promise<{
        /** Template ID */
        id: string;
        /** Template name */
        name: string;
        /** Template category */
        category?: string;
        /** Template type */
        type: "email" | "sms" | "push" | "in_app";
        /** Subject (for email) */
        subject?: string;
        /** HTML template (for email) */
        htmlTemplate?: string;
        /** Text template */
        textTemplate?: string;
        /** Template variables */
        variables: string[];
        /** Template locale */
        locale?: string;
        /** Template version */
        version?: number;
        /** Default values for variables */
        defaults?: Record<string, any>;
        /** Template metadata */
        metadata?: Record<string, any>;
        /** Template status */
        status?: "active" | "draft" | "archived";
        /** Created timestamp */
        createdAt?: Date;
        /** Updated timestamp */
        updatedAt?: Date;
    }>;
    /**
     * Update template.
     */
    updateTemplate(id: string, template: Partial<NotificationTemplate>): Promise<{
        id: string;
        name?: string | undefined;
        category?: string | undefined;
        type?: "push" | "email" | "sms" | "in_app" | undefined;
        subject?: string | undefined;
        htmlTemplate?: string | undefined;
        textTemplate?: string | undefined;
        variables?: string[] | undefined;
        locale?: string | undefined;
        version?: number | undefined;
        defaults?: Record<string, any> | undefined;
        metadata?: Record<string, any> | undefined;
        status?: "active" | "draft" | "archived" | undefined;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
    }>;
    /**
     * Delete template.
     */
    deleteTemplate(id: string): Promise<void>;
    /**
     * Preview template rendering.
     */
    previewTemplate(id: string, data: TemplateData): Promise<{
        subject: string;
        html: string;
        text: string;
    }>;
}
/**
 * NestJS controller for notification preferences.
 */
export declare class NotificationPreferencesController {
    private readonly logger;
    /**
     * Get user notification preferences.
     */
    getUserPreferences(userId: string): Promise<{
        userId: string;
        emailEnabled: boolean;
        smsEnabled: boolean;
        pushEnabled: boolean;
        inAppEnabled: boolean;
    }>;
    /**
     * Update user notification preferences.
     */
    updateUserPreferences(userId: string, preferences: Partial<NotificationPreferences>): Promise<{
        userId: string;
        emailEnabled?: boolean | undefined;
        smsEnabled?: boolean | undefined;
        pushEnabled?: boolean | undefined;
        inAppEnabled?: boolean | undefined;
        channels?: {
            email?: ChannelPreferences;
            sms?: ChannelPreferences;
            push?: ChannelPreferences;
            inApp?: ChannelPreferences;
        } | undefined;
        categories?: Record<string, boolean> | undefined;
        quietHours?: {
            enabled: boolean;
            startTime: string;
            endTime: string;
            timezone: string;
        } | undefined;
        frequencyLimits?: {
            maxPerHour?: number;
            maxPerDay?: number;
            maxPerWeek?: number;
        } | undefined;
        locale?: string | undefined;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
    }>;
}
/**
 * NestJS controller for webhook handlers.
 */
export declare class WebhooksController {
    private readonly logger;
    /**
     * Handle SendGrid webhook events.
     */
    handleSendGrid(events: any[]): Promise<{
        success: boolean;
    }>;
    /**
     * Handle Twilio webhook events.
     */
    handleTwilio(event: any): Promise<{
        success: boolean;
    }>;
    /**
     * Handle AWS SES webhook events.
     */
    handleSES(event: any): Promise<{
        success: boolean;
    }>;
    /**
     * Handle FCM webhook events.
     */
    handleFCM(event: any): Promise<{
        success: boolean;
    }>;
}
/**
 * Export all functions and classes for use in other modules.
 */
declare const _default: {
    sendEmailViaSMTP: typeof sendEmailViaSMTP;
    sendEmailViaSendGrid: typeof sendEmailViaSendGrid;
    sendEmailViaSES: typeof sendEmailViaSES;
    sendSMSViaTwilio: typeof sendSMSViaTwilio;
    sendSMSViaSNS: typeof sendSMSViaSNS;
    sendPushViaFCM: typeof sendPushViaFCM;
    sendPushViaAPNs: typeof sendPushViaAPNs;
    renderHandlebarsTemplate: typeof renderHandlebarsTemplate;
    renderNotificationTemplate: typeof renderNotificationTemplate;
    validateTemplateVariables: typeof validateTemplateVariables;
    createNotificationQueue: typeof createNotificationQueue;
    addNotificationToQueue: typeof addNotificationToQueue;
    addBatchNotificationsToQueue: typeof addBatchNotificationsToQueue;
    processNotificationQueue: typeof processNotificationQueue;
    generateTrackingToken: typeof generateTrackingToken;
    verifyTrackingToken: typeof verifyTrackingToken;
    trackNotificationOpen: typeof trackNotificationOpen;
    trackNotificationClick: typeof trackNotificationClick;
    canSendNotification: typeof canSendNotification;
    generateUnsubscribeToken: typeof generateUnsubscribeToken;
    verifyUnsubscribeToken: typeof verifyUnsubscribeToken;
    verifyWebhookSignature: typeof verifyWebhookSignature;
    processSendGridWebhook: typeof processSendGridWebhook;
    processTwilioWebhook: typeof processTwilioWebhook;
    calculateNotificationAnalytics: typeof calculateNotificationAnalytics;
    validateEmailFormat: typeof validateEmailFormat;
    validatePhoneFormat: typeof validatePhoneFormat;
    sanitizeEmailHTML: typeof sanitizeEmailHTML;
    getNotificationTemplateModelAttributes: typeof getNotificationTemplateModelAttributes;
    getNotificationDeliveryLogModelAttributes: typeof getNotificationDeliveryLogModelAttributes;
    getNotificationPreferencesModelAttributes: typeof getNotificationPreferencesModelAttributes;
    getUnsubscribeRecordModelAttributes: typeof getUnsubscribeRecordModelAttributes;
    getNotificationTrackingModelAttributes: typeof getNotificationTrackingModelAttributes;
    getWebhookEventModelAttributes: typeof getWebhookEventModelAttributes;
    getScheduledNotificationModelAttributes: typeof getScheduledNotificationModelAttributes;
    NotificationService: typeof NotificationService;
    NotificationsController: typeof NotificationsController;
    NotificationTemplatesController: typeof NotificationTemplatesController;
    NotificationPreferencesController: typeof NotificationPreferencesController;
    WebhooksController: typeof WebhooksController;
    EmailConfigSchema: any;
    SMSConfigSchema: any;
    PushNotificationConfigSchema: any;
    InAppNotificationConfigSchema: any;
    NotificationTemplateSchema: any;
    NotificationPreferencesSchema: any;
    BatchNotificationJobSchema: any;
};
export default _default;
//# sourceMappingURL=notification-kit.prod.d.ts.map