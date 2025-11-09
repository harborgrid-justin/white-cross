/**
 * LOC: EMAILNOT1234567
 * File: /reuse/email-notification-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS notification services
 *   - Email queue processors
 *   - Push notification services
 *   - SMS notification services
 *   - Communication modules
 */
import { Transporter } from 'nodemailer';
interface EmailConfig {
    from: string;
    to: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    subject: string;
    html?: string;
    text?: string;
    attachments?: EmailAttachment[];
    replyTo?: string;
    headers?: Record<string, string>;
    priority?: 'high' | 'normal' | 'low';
    metadata?: Record<string, any>;
}
interface EmailAttachment {
    filename: string;
    content?: Buffer | string;
    path?: string;
    contentType?: string;
    cid?: string;
    encoding?: string;
}
interface SMTPConfig {
    host: string;
    port: number;
    secure?: boolean;
    auth?: {
        user: string;
        pass: string;
    };
    tls?: {
        rejectUnauthorized?: boolean;
    };
    pool?: boolean;
    maxConnections?: number;
    rateDelta?: number;
    rateLimit?: number;
}
interface SendGridConfig {
    apiKey: string;
    from: string;
    templateId?: string;
    dynamicTemplateData?: Record<string, any>;
    trackingSettings?: {
        clickTracking?: {
            enable: boolean;
        };
        openTracking?: {
            enable: boolean;
        };
    };
}
interface SESConfig {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    configurationSetName?: string;
    returnPath?: string;
}
interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    htmlTemplate: string;
    textTemplate?: string;
    variables: string[];
    category?: string;
    locale?: string;
    version?: number;
}
interface TemplateData {
    [key: string]: any;
}
interface EmailQueueJob {
    id: string;
    emailConfig: EmailConfig;
    priority?: number;
    delay?: number;
    attempts?: number;
    backoff?: {
        type: 'fixed' | 'exponential';
        delay: number;
    };
    removeOnComplete?: boolean;
    removeOnFail?: boolean;
}
interface EmailQueueOptions {
    redis: {
        host: string;
        port: number;
        password?: string;
        db?: number;
    };
    defaultJobOptions?: {
        attempts?: number;
        backoff?: {
            type: 'fixed' | 'exponential';
            delay: number;
        };
        removeOnComplete?: boolean;
        removeOnFail?: boolean;
    };
    limiter?: {
        max: number;
        duration: number;
    };
}
interface EmailTracking {
    emailId: string;
    recipientEmail: string;
    trackingToken: string;
    opened: boolean;
    openedAt?: Date;
    openCount: number;
    clickedLinks: string[];
    lastClickedAt?: Date;
    clickCount: number;
    userAgent?: string;
    ipAddress?: string;
}
interface EmailValidationResult {
    email: string;
    isValid: boolean;
    isSyntaxValid: boolean;
    isDomainValid: boolean;
    isMxValid: boolean;
    isDisposable: boolean;
    isRoleBased: boolean;
    suggestions?: string[];
    errors?: string[];
}
interface BulkEmailJob {
    templateId: string;
    recipients: BulkEmailRecipient[];
    subject?: string;
    batchSize?: number;
    throttleMs?: number;
    trackOpens?: boolean;
    trackClicks?: boolean;
    metadata?: Record<string, any>;
}
interface BulkEmailRecipient {
    email: string;
    name?: string;
    templateData?: TemplateData;
    metadata?: Record<string, any>;
}
interface ScheduledEmail {
    id: string;
    emailConfig: EmailConfig;
    scheduledFor: Date;
    timezone?: string;
    recurring?: RecurringSchedule;
    status: 'pending' | 'sent' | 'cancelled' | 'failed';
    sentAt?: Date;
    error?: string;
}
interface RecurringSchedule {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval?: number;
    daysOfWeek?: number[];
    dayOfMonth?: number;
    endDate?: Date;
}
interface SMSConfig {
    to: string | string[];
    message: string;
    from?: string;
    mediaUrls?: string[];
    statusCallback?: string;
    metadata?: Record<string, any>;
}
interface TwilioConfig {
    accountSid: string;
    authToken: string;
    fromNumber: string;
}
interface SMSResult {
    messageId: string;
    to: string;
    status: 'queued' | 'sent' | 'delivered' | 'failed';
    error?: string;
    cost?: number;
    segments?: number;
}
interface PushNotificationConfig {
    tokens: string[];
    title: string;
    body: string;
    data?: Record<string, any>;
    badge?: number;
    sound?: string;
    priority?: 'high' | 'normal';
    ttl?: number;
    imageUrl?: string;
    clickAction?: string;
}
interface FCMConfig {
    serverKey: string;
    projectId?: string;
}
interface APNsConfig {
    teamId: string;
    keyId: string;
    key: string;
    production?: boolean;
    bundleId: string;
}
interface PushNotificationResult {
    token: string;
    success: boolean;
    messageId?: string;
    error?: string;
}
interface InAppNotification {
    id: string;
    userId: string;
    type: string;
    title: string;
    message: string;
    data?: Record<string, any>;
    priority: 'high' | 'normal' | 'low';
    read: boolean;
    readAt?: Date;
    createdAt: Date;
    expiresAt?: Date;
    actionUrl?: string;
    actionLabel?: string;
}
interface NotificationPreferences {
    userId: string;
    email: {
        enabled: boolean;
        frequency: 'immediate' | 'daily' | 'weekly' | 'never';
        types: string[];
    };
    sms: {
        enabled: boolean;
        types: string[];
    };
    push: {
        enabled: boolean;
        types: string[];
    };
    inApp: {
        enabled: boolean;
        types: string[];
    };
    doNotDisturb?: {
        enabled: boolean;
        startHour: number;
        endHour: number;
        timezone: string;
    };
}
interface EmailBounce {
    emailId: string;
    recipientEmail: string;
    bounceType: 'hard' | 'soft' | 'transient';
    bounceSubType?: string;
    bouncedAt: Date;
    diagnosticCode?: string;
    metadata?: Record<string, any>;
}
interface EmailComplaint {
    emailId: string;
    recipientEmail: string;
    complaintType: 'abuse' | 'fraud' | 'virus' | 'other';
    complainedAt: Date;
    feedbackId?: string;
    userAgent?: string;
    metadata?: Record<string, any>;
}
interface NotificationDeliveryStatus {
    notificationId: string;
    channel: 'email' | 'sms' | 'push' | 'in-app';
    status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced';
    attemptCount: number;
    lastAttemptAt?: Date;
    deliveredAt?: Date;
    error?: string;
    metadata?: Record<string, any>;
}
interface SubscriptionModel {
    id: string;
    userId?: string;
    email: string;
    type: string;
    status: 'subscribed' | 'unsubscribed' | 'bounced' | 'complained';
    unsubscribeToken?: string;
    subscribedAt: Date;
    unsubscribedAt?: Date;
    unsubscribeReason?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates an SMTP email transporter
 * @param config - SMTP configuration
 * @returns Nodemailer transporter instance
 * @example
 * const transporter = createSMTPTransporter({
 *   host: 'smtp.gmail.com',
 *   port: 587,
 *   secure: false,
 *   auth: { user: 'user@gmail.com', pass: 'password' }
 * });
 */
export declare function createSMTPTransporter(config: SMTPConfig): Transporter;
/**
 * Sends an email via SMTP
 * @param transporter - Nodemailer transporter
 * @param emailConfig - Email configuration
 * @returns Email send result
 * @example
 * const result = await sendEmailViaSMTP(transporter, {
 *   from: 'noreply@whitecross.com',
 *   to: 'patient@example.com',
 *   subject: 'Appointment Reminder',
 *   html: '<p>Your appointment is tomorrow</p>'
 * });
 */
export declare function sendEmailViaSMTP(transporter: Transporter, emailConfig: EmailConfig): Promise<{
    messageId: string;
    accepted: string[];
    rejected: string[];
}>;
/**
 * Verifies SMTP connection
 * @param transporter - Nodemailer transporter
 * @returns True if connection is successful
 * @example
 * const isConnected = await verifySMTPConnection(transporter);
 */
export declare function verifySMTPConnection(transporter: Transporter): Promise<boolean>;
/**
 * Sends an email via SendGrid
 * @param config - SendGrid configuration
 * @param emailConfig - Email configuration
 * @returns SendGrid response
 * @example
 * const result = await sendEmailViaSendGrid(
 *   { apiKey: 'SG.xxx', from: 'noreply@whitecross.com' },
 *   { to: 'patient@example.com', subject: 'Test', html: '<p>Hello</p>' }
 * );
 */
export declare function sendEmailViaSendGrid(config: SendGridConfig, emailConfig: Partial<EmailConfig>): Promise<{
    messageId: string;
    statusCode: number;
}>;
/**
 * Sends bulk emails via SendGrid
 * @param config - SendGrid configuration
 * @param recipients - List of recipients with personalization
 * @returns SendGrid response
 * @example
 * const result = await sendBulkEmailViaSendGrid(
 *   { apiKey: 'SG.xxx', from: 'noreply@whitecross.com', templateId: 'template-123' },
 *   [
 *     { email: 'user1@example.com', name: 'User 1', templateData: { name: 'User 1' } },
 *     { email: 'user2@example.com', name: 'User 2', templateData: { name: 'User 2' } }
 *   ]
 * );
 */
export declare function sendBulkEmailViaSendGrid(config: SendGridConfig, recipients: BulkEmailRecipient[]): Promise<{
    messageId: string;
    statusCode: number;
}>;
/**
 * Sends an email via AWS SES
 * @param config - SES configuration
 * @param emailConfig - Email configuration
 * @returns SES response with message ID
 * @example
 * const result = await sendEmailViaSES(
 *   {
 *     accessKeyId: 'AWS_KEY',
 *     secretAccessKey: 'AWS_SECRET',
 *     region: 'us-east-1'
 *   },
 *   {
 *     from: 'noreply@whitecross.com',
 *     to: 'patient@example.com',
 *     subject: 'Test Email',
 *     html: '<p>Hello from SES</p>'
 *   }
 * );
 */
export declare function sendEmailViaSES(config: SESConfig, emailConfig: EmailConfig): Promise<{
    messageId: string;
}>;
/**
 * Sends templated email via AWS SES
 * @param config - SES configuration
 * @param templateName - SES template name
 * @param recipients - Recipient email addresses
 * @param templateData - Template variables
 * @returns SES response
 * @example
 * const result = await sendTemplatedEmailViaSES(
 *   sesConfig,
 *   'appointment-reminder',
 *   ['patient@example.com'],
 *   { appointmentDate: '2024-01-15', doctorName: 'Dr. Smith' }
 * );
 */
export declare function sendTemplatedEmailViaSES(config: SESConfig, templateName: string, recipients: string[], templateData: Record<string, any>): Promise<{
    messageId: string;
}>;
/**
 * Compiles a Handlebars email template
 * @param templateString - Handlebars template string
 * @param data - Template data
 * @returns Compiled HTML string
 * @example
 * const html = compileHandlebarsTemplate(
 *   '<h1>Hello {{name}}</h1><p>Your appointment is on {{date}}</p>',
 *   { name: 'John Doe', date: '2024-01-15' }
 * );
 */
export declare function compileHandlebarsTemplate(templateString: string, data: TemplateData): string;
/**
 * Registers Handlebars helper functions
 * @param helpers - Object with helper functions
 * @example
 * registerHandlebarsHelpers({
 *   formatDate: (date) => new Date(date).toLocaleDateString(),
 *   uppercase: (str) => str.toUpperCase()
 * });
 */
export declare function registerHandlebarsHelpers(helpers: Record<string, Function>): void;
/**
 * Compiles an EJS email template
 * @param templateString - EJS template string
 * @param data - Template data
 * @returns Compiled HTML string
 * @example
 * const html = compileEJSTemplate(
 *   '<h1>Hello <%= name %></h1><p>Your appointment is on <%= date %></p>',
 *   { name: 'John Doe', date: '2024-01-15' }
 * );
 */
export declare function compileEJSTemplate(templateString: string, data: TemplateData): string;
/**
 * Loads email template from database or file system
 * @param templateId - Template identifier
 * @param locale - Template locale (default: 'en')
 * @returns Email template
 * @example
 * const template = await loadEmailTemplate('appointment-reminder', 'en');
 */
export declare function loadEmailTemplate(templateId: string, locale?: string): Promise<EmailTemplate | null>;
/**
 * Renders email template with data
 * @param template - Email template
 * @param data - Template data
 * @returns Rendered email content
 * @example
 * const email = renderEmailTemplate(template, {
 *   patientName: 'John Doe',
 *   appointmentDate: '2024-01-15'
 * });
 */
export declare function renderEmailTemplate(template: EmailTemplate, data: TemplateData): {
    subject: string;
    html: string;
    text?: string;
};
/**
 * Validates template variables
 * @param template - Email template
 * @param data - Template data
 * @returns Validation result with missing variables
 * @example
 * const validation = validateTemplateVariables(template, { patientName: 'John' });
 * if (!validation.isValid) {
 *   console.log('Missing variables:', validation.missing);
 * }
 */
export declare function validateTemplateVariables(template: EmailTemplate, data: TemplateData): {
    isValid: boolean;
    missing: string[];
};
/**
 * Creates an email queue using Bull
 * @param queueName - Name of the queue
 * @param options - Queue options
 * @returns Bull queue instance
 * @example
 * const emailQueue = createEmailQueue('emails', {
 *   redis: { host: 'localhost', port: 6379 },
 *   limiter: { max: 100, duration: 60000 }
 * });
 */
export declare function createEmailQueue(queueName: string, options: EmailQueueOptions): any;
/**
 * Adds email to queue
 * @param queue - Bull queue instance
 * @param emailConfig - Email configuration
 * @param jobOptions - Job options
 * @returns Job instance
 * @example
 * const job = await addEmailToQueue(emailQueue, {
 *   from: 'noreply@whitecross.com',
 *   to: 'patient@example.com',
 *   subject: 'Appointment Reminder',
 *   html: '<p>Your appointment is tomorrow</p>'
 * }, { priority: 1, delay: 5000 });
 */
export declare function addEmailToQueue(queue: any, emailConfig: EmailConfig, jobOptions?: Partial<EmailQueueJob>): Promise<any>;
/**
 * Processes email queue jobs
 * @param queue - Bull queue instance
 * @param processor - Job processor function
 * @param concurrency - Number of concurrent jobs
 * @example
 * processEmailQueue(emailQueue, async (job) => {
 *   const { emailConfig } = job.data;
 *   await sendEmailViaSMTP(transporter, emailConfig);
 * }, 5);
 */
export declare function processEmailQueue(queue: any, processor: (job: any) => Promise<void>, concurrency?: number): void;
/**
 * Gets email queue statistics
 * @param queue - Bull queue instance
 * @returns Queue statistics
 * @example
 * const stats = await getEmailQueueStats(emailQueue);
 * console.log(`Waiting: ${stats.waiting}, Active: ${stats.active}, Completed: ${stats.completed}`);
 */
export declare function getEmailQueueStats(queue: any): Promise<{
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
}>;
/**
 * Retries failed email jobs
 * @param queue - Bull queue instance
 * @param jobId - Job ID to retry
 * @returns Retried job instance
 * @example
 * const job = await retryFailedEmailJob(emailQueue, 'job-123');
 */
export declare function retryFailedEmailJob(queue: any, jobId: string): Promise<any>;
/**
 * Generates email tracking token
 * @param emailId - Email identifier
 * @param recipientEmail - Recipient email address
 * @returns Tracking token
 * @example
 * const token = generateEmailTrackingToken('email-123', 'patient@example.com');
 */
export declare function generateEmailTrackingToken(emailId: string, recipientEmail: string): string;
/**
 * Injects tracking pixel into email HTML
 * @param html - Email HTML content
 * @param trackingUrl - Tracking pixel URL
 * @returns HTML with tracking pixel
 * @example
 * const trackedHtml = injectTrackingPixel(
 *   '<p>Hello</p>',
 *   'https://track.whitecross.com/open/abc123'
 * );
 */
export declare function injectTrackingPixel(html: string, trackingUrl: string): string;
/**
 * Converts links in email to tracked links
 * @param html - Email HTML content
 * @param trackingUrlBase - Base URL for tracking
 * @param emailId - Email identifier
 * @returns HTML with tracked links
 * @example
 * const trackedHtml = convertLinksToTracked(
 *   '<a href="https://example.com">Click here</a>',
 *   'https://track.whitecross.com/click',
 *   'email-123'
 * );
 */
export declare function convertLinksToTracked(html: string, trackingUrlBase: string, emailId: string): string;
/**
 * Records email open event
 * @param emailId - Email identifier
 * @param recipientEmail - Recipient email address
 * @param metadata - Additional metadata (IP, user agent, etc.)
 * @returns Updated tracking record
 * @example
 * const tracking = await recordEmailOpen('email-123', 'patient@example.com', {
 *   ipAddress: '192.168.1.1',
 *   userAgent: 'Mozilla/5.0...'
 * });
 */
export declare function recordEmailOpen(emailId: string, recipientEmail: string, metadata?: {
    ipAddress?: string;
    userAgent?: string;
}): Promise<EmailTracking>;
/**
 * Records email link click event
 * @param emailId - Email identifier
 * @param recipientEmail - Recipient email address
 * @param clickedUrl - Clicked URL
 * @param metadata - Additional metadata
 * @returns Updated tracking record
 * @example
 * const tracking = await recordEmailClick(
 *   'email-123',
 *   'patient@example.com',
 *   'https://example.com/page',
 *   { ipAddress: '192.168.1.1' }
 * );
 */
export declare function recordEmailClick(emailId: string, recipientEmail: string, clickedUrl: string, metadata?: {
    ipAddress?: string;
    userAgent?: string;
}): Promise<EmailTracking>;
/**
 * Gets email tracking statistics
 * @param emailId - Email identifier
 * @returns Tracking statistics
 * @example
 * const stats = await getEmailTrackingStats('email-123');
 * console.log(`Opens: ${stats.totalOpens}, Clicks: ${stats.totalClicks}`);
 */
export declare function getEmailTrackingStats(emailId: string): Promise<{
    totalRecipients: number;
    totalOpens: number;
    uniqueOpens: number;
    totalClicks: number;
    uniqueClicks: number;
    openRate: number;
    clickRate: number;
}>;
/**
 * Validates email address syntax
 * @param email - Email address to validate
 * @returns True if email syntax is valid
 * @example
 * const isValid = validateEmailSyntax('patient@example.com');
 */
export declare function validateEmailSyntax(email: string): boolean;
/**
 * Validates email domain
 * @param email - Email address to validate
 * @returns Validation result
 * @example
 * const result = await validateEmailDomain('patient@example.com');
 */
export declare function validateEmailDomain(email: string): Promise<{
    isValid: boolean;
    hasMxRecords: boolean;
    mxRecords?: string[];
}>;
/**
 * Checks if email is from a disposable domain
 * @param email - Email address to check
 * @returns True if email is from disposable domain
 * @example
 * const isDisposable = isDisposableEmail('user@tempmail.com');
 */
export declare function isDisposableEmail(email: string): boolean;
/**
 * Checks if email is role-based
 * @param email - Email address to check
 * @returns True if email is role-based
 * @example
 * const isRole = isRoleBasedEmail('admin@example.com');
 */
export declare function isRoleBasedEmail(email: string): boolean;
/**
 * Comprehensive email validation
 * @param email - Email address to validate
 * @returns Detailed validation result
 * @example
 * const result = await validateEmail('patient@example.com');
 * if (result.isValid) {
 *   console.log('Email is valid');
 * }
 */
export declare function validateEmail(email: string): Promise<EmailValidationResult>;
/**
 * Sends bulk emails in batches
 * @param job - Bulk email job configuration
 * @param sendFunction - Function to send individual email
 * @returns Bulk send results
 * @example
 * const results = await sendBulkEmails(
 *   {
 *     templateId: 'newsletter',
 *     recipients: [...],
 *     batchSize: 50,
 *     throttleMs: 1000
 *   },
 *   async (recipient, template) => await sendEmail(recipient, template)
 * );
 */
export declare function sendBulkEmails(job: BulkEmailJob, sendFunction: (recipient: BulkEmailRecipient, templateData: TemplateData) => Promise<any>): Promise<{
    total: number;
    sent: number;
    failed: number;
    errors: Array<{
        email: string;
        error: string;
    }>;
}>;
/**
 * Filters recipients based on subscription status
 * @param recipients - List of recipients
 * @param checkSubscription - Function to check subscription status
 * @returns Filtered recipients
 * @example
 * const filtered = await filterSubscribedRecipients(
 *   recipients,
 *   async (email) => await isSubscribed(email, 'newsletter')
 * );
 */
export declare function filterSubscribedRecipients(recipients: BulkEmailRecipient[], checkSubscription: (email: string) => Promise<boolean>): Promise<BulkEmailRecipient[]>;
/**
 * Schedules email for future delivery
 * @param emailConfig - Email configuration
 * @param scheduledFor - Scheduled send time
 * @param timezone - Timezone for scheduling
 * @returns Scheduled email record
 * @example
 * const scheduled = await scheduleEmail(
 *   emailConfig,
 *   new Date('2024-01-15T09:00:00'),
 *   'America/New_York'
 * );
 */
export declare function scheduleEmail(emailConfig: EmailConfig, scheduledFor: Date, timezone?: string): Promise<ScheduledEmail>;
/**
 * Creates recurring email schedule
 * @param emailConfig - Email configuration
 * @param schedule - Recurring schedule configuration
 * @returns Scheduled email record
 * @example
 * const recurring = await scheduleRecurringEmail(
 *   emailConfig,
 *   {
 *     frequency: 'weekly',
 *     daysOfWeek: [1, 3, 5], // Monday, Wednesday, Friday
 *     endDate: new Date('2024-12-31')
 *   }
 * );
 */
export declare function scheduleRecurringEmail(emailConfig: EmailConfig, schedule: RecurringSchedule): Promise<ScheduledEmail>;
/**
 * Cancels scheduled email
 * @param scheduledEmailId - Scheduled email identifier
 * @returns Updated scheduled email
 * @example
 * const cancelled = await cancelScheduledEmail('schedule-123');
 */
export declare function cancelScheduledEmail(scheduledEmailId: string): Promise<ScheduledEmail | null>;
/**
 * Gets next scheduled send time for recurring email
 * @param schedule - Recurring schedule
 * @param fromDate - Calculate from this date
 * @returns Next send time
 * @example
 * const nextSend = getNextRecurringEmailTime(
 *   { frequency: 'daily', interval: 2 },
 *   new Date()
 * );
 */
export declare function getNextRecurringEmailTime(schedule: RecurringSchedule, fromDate?: Date): Date;
/**
 * Sends SMS via Twilio
 * @param config - Twilio configuration
 * @param smsConfig - SMS configuration
 * @returns SMS send result
 * @example
 * const result = await sendSMSViaTwilio(
 *   { accountSid: 'AC...', authToken: 'xxx', fromNumber: '+1234567890' },
 *   { to: '+1987654321', message: 'Your appointment is tomorrow' }
 * );
 */
export declare function sendSMSViaTwilio(config: TwilioConfig, smsConfig: SMSConfig): Promise<SMSResult>;
/**
 * Sends bulk SMS messages
 * @param config - Twilio configuration
 * @param messages - List of SMS messages
 * @returns Bulk send results
 * @example
 * const results = await sendBulkSMS(twilioConfig, [
 *   { to: '+1111111111', message: 'Message 1' },
 *   { to: '+2222222222', message: 'Message 2' }
 * ]);
 */
export declare function sendBulkSMS(config: TwilioConfig, messages: SMSConfig[]): Promise<SMSResult[]>;
/**
 * Validates phone number format
 * @param phoneNumber - Phone number to validate
 * @returns True if phone number is valid
 * @example
 * const isValid = validatePhoneNumber('+1234567890');
 */
export declare function validatePhoneNumber(phoneNumber: string): boolean;
/**
 * Sends push notification via Firebase Cloud Messaging (FCM)
 * @param config - FCM configuration
 * @param notification - Push notification configuration
 * @returns Push notification results
 * @example
 * const results = await sendPushNotificationViaFCM(
 *   { serverKey: 'FCM_SERVER_KEY' },
 *   {
 *     tokens: ['device-token-1', 'device-token-2'],
 *     title: 'Appointment Reminder',
 *     body: 'Your appointment is tomorrow at 2 PM',
 *     data: { appointmentId: '123' }
 *   }
 * );
 */
export declare function sendPushNotificationViaFCM(config: FCMConfig, notification: PushNotificationConfig): Promise<PushNotificationResult[]>;
/**
 * Sends push notification via Apple Push Notification service (APNs)
 * @param config - APNs configuration
 * @param notification - Push notification configuration
 * @returns Push notification results
 * @example
 * const results = await sendPushNotificationViaAPNs(
 *   apnsConfig,
 *   {
 *     tokens: ['device-token-1'],
 *     title: 'New Message',
 *     body: 'You have a new message',
 *     badge: 1
 *   }
 * );
 */
export declare function sendPushNotificationViaAPNs(config: APNsConfig, notification: PushNotificationConfig): Promise<PushNotificationResult[]>;
/**
 * Validates push notification token
 * @param token - Device token to validate
 * @param platform - Platform (ios or android)
 * @returns True if token format is valid
 * @example
 * const isValid = validatePushToken('device-token-123', 'android');
 */
export declare function validatePushToken(token: string, platform: 'ios' | 'android'): boolean;
/**
 * Creates in-app notification
 * @param notification - Notification data
 * @returns Created notification
 * @example
 * const notification = await createInAppNotification({
 *   userId: 'user-123',
 *   type: 'appointment',
 *   title: 'Upcoming Appointment',
 *   message: 'You have an appointment tomorrow',
 *   priority: 'high'
 * });
 */
export declare function createInAppNotification(notification: Omit<InAppNotification, 'id' | 'read' | 'readAt' | 'createdAt'>): Promise<InAppNotification>;
/**
 * Gets unread notifications for user
 * @param userId - User identifier
 * @param limit - Maximum number of notifications to return
 * @returns List of unread notifications
 * @example
 * const notifications = await getUnreadNotifications('user-123', 10);
 */
export declare function getUnreadNotifications(userId: string, limit?: number): Promise<InAppNotification[]>;
/**
 * Marks notification as read
 * @param notificationId - Notification identifier
 * @returns Updated notification
 * @example
 * const notification = await markNotificationAsRead('notif-123');
 */
export declare function markNotificationAsRead(notificationId: string): Promise<InAppNotification | null>;
/**
 * Marks all notifications as read for user
 * @param userId - User identifier
 * @returns Number of notifications marked as read
 * @example
 * const count = await markAllNotificationsAsRead('user-123');
 */
export declare function markAllNotificationsAsRead(userId: string): Promise<number>;
/**
 * Deletes expired notifications
 * @returns Number of deleted notifications
 * @example
 * const count = await deleteExpiredNotifications();
 */
export declare function deleteExpiredNotifications(): Promise<number>;
/**
 * Gets user notification preferences
 * @param userId - User identifier
 * @returns Notification preferences
 * @example
 * const prefs = await getNotificationPreferences('user-123');
 */
export declare function getNotificationPreferences(userId: string): Promise<NotificationPreferences | null>;
/**
 * Updates user notification preferences
 * @param userId - User identifier
 * @param preferences - Updated preferences
 * @returns Updated preferences
 * @example
 * const prefs = await updateNotificationPreferences('user-123', {
 *   email: { enabled: true, frequency: 'daily', types: ['appointment'] }
 * });
 */
export declare function updateNotificationPreferences(userId: string, preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences>;
/**
 * Checks if user can receive notification type
 * @param userId - User identifier
 * @param channel - Notification channel
 * @param type - Notification type
 * @returns True if user can receive notification
 * @example
 * const canSend = await canSendNotification('user-123', 'email', 'appointment');
 */
export declare function canSendNotification(userId: string, channel: 'email' | 'sms' | 'push' | 'in-app', type: string): Promise<boolean>;
/**
 * Checks if notification should be sent based on do-not-disturb settings
 * @param userId - User identifier
 * @returns True if notification can be sent now
 * @example
 * const canSend = await shouldSendNotificationNow('user-123');
 */
export declare function shouldSendNotificationNow(userId: string): Promise<boolean>;
/**
 * Generates unsubscribe token
 * @param email - Email address
 * @param type - Subscription type
 * @returns Unsubscribe token
 * @example
 * const token = generateUnsubscribeToken('patient@example.com', 'newsletter');
 */
export declare function generateUnsubscribeToken(email: string, type: string): string;
/**
 * Creates unsubscribe link
 * @param baseUrl - Base URL for unsubscribe endpoint
 * @param token - Unsubscribe token
 * @returns Unsubscribe URL
 * @example
 * const url = createUnsubscribeLink('https://whitecross.com/unsubscribe', token);
 */
export declare function createUnsubscribeLink(baseUrl: string, token: string): string;
/**
 * Processes unsubscribe request
 * @param token - Unsubscribe token
 * @param reason - Unsubscribe reason
 * @returns Updated subscription
 * @example
 * const subscription = await processUnsubscribe(token, 'Too many emails');
 */
export declare function processUnsubscribe(token: string, reason?: string): Promise<SubscriptionModel | null>;
/**
 * Re-subscribes user to email list
 * @param email - Email address
 * @param type - Subscription type
 * @returns Updated subscription
 * @example
 * const subscription = await resubscribe('patient@example.com', 'newsletter');
 */
export declare function resubscribe(email: string, type: string): Promise<SubscriptionModel>;
/**
 * Records email bounce
 * @param bounce - Bounce data
 * @returns Recorded bounce
 * @example
 * const recorded = await recordEmailBounce({
 *   emailId: 'email-123',
 *   recipientEmail: 'invalid@example.com',
 *   bounceType: 'hard',
 *   bouncedAt: new Date()
 * });
 */
export declare function recordEmailBounce(bounce: EmailBounce): Promise<EmailBounce>;
/**
 * Records email complaint
 * @param complaint - Complaint data
 * @returns Recorded complaint
 * @example
 * const recorded = await recordEmailComplaint({
 *   emailId: 'email-123',
 *   recipientEmail: 'user@example.com',
 *   complaintType: 'abuse',
 *   complainedAt: new Date()
 * });
 */
export declare function recordEmailComplaint(complaint: EmailComplaint): Promise<EmailComplaint>;
/**
 * Checks if email address has hard bounced
 * @param email - Email address to check
 * @returns True if email has hard bounced
 * @example
 * const hasBounced = await hasHardBounced('invalid@example.com');
 */
export declare function hasHardBounced(email: string): Promise<boolean>;
/**
 * Checks if email address has complained
 * @param email - Email address to check
 * @returns True if email has complained
 * @example
 * const hasComplained = await hasComplainedAboutEmail('user@example.com');
 */
export declare function hasComplainedAboutEmail(email: string): Promise<boolean>;
/**
 * Gets bounce statistics for email address
 * @param email - Email address
 * @returns Bounce statistics
 * @example
 * const stats = await getEmailBounceStats('user@example.com');
 */
export declare function getEmailBounceStats(email: string): Promise<{
    totalBounces: number;
    hardBounces: number;
    softBounces: number;
    lastBounce?: Date;
}>;
/**
 * Automatically suppresses problematic email addresses
 * @param thresholds - Bounce/complaint thresholds
 * @returns Number of suppressed emails
 * @example
 * const count = await autoSuppressProblematicEmails({
 *   hardBounceCount: 1,
 *   softBounceCount: 5,
 *   complaintCount: 1
 * });
 */
export declare function autoSuppressProblematicEmails(thresholds: {
    hardBounceCount: number;
    softBounceCount: number;
    complaintCount: number;
}): Promise<number>;
/**
 * Updates notification delivery status
 * @param notificationId - Notification identifier
 * @param status - Delivery status
 * @param metadata - Additional metadata
 * @returns Updated status record
 * @example
 * const status = await updateNotificationDeliveryStatus(
 *   'notif-123',
 *   'delivered',
 *   { deliveredAt: new Date() }
 * );
 */
export declare function updateNotificationDeliveryStatus(notificationId: string, status: NotificationDeliveryStatus['status'], metadata?: Record<string, any>): Promise<NotificationDeliveryStatus>;
/**
 * Gets notification delivery status
 * @param notificationId - Notification identifier
 * @returns Delivery status
 * @example
 * const status = await getNotificationDeliveryStatus('notif-123');
 */
export declare function getNotificationDeliveryStatus(notificationId: string): Promise<NotificationDeliveryStatus | null>;
/**
 * Retries failed notification delivery
 * @param notificationId - Notification identifier
 * @param maxAttempts - Maximum retry attempts
 * @returns True if retry was scheduled
 * @example
 * const retried = await retryFailedNotification('notif-123', 3);
 */
export declare function retryFailedNotification(notificationId: string, maxAttempts?: number): Promise<boolean>;
/**
 * Gets delivery statistics for notification campaign
 * @param campaignId - Campaign identifier
 * @returns Delivery statistics
 * @example
 * const stats = await getNotificationCampaignStats('campaign-123');
 */
export declare function getNotificationCampaignStats(campaignId: string): Promise<{
    total: number;
    pending: number;
    sent: number;
    delivered: number;
    failed: number;
    bounced: number;
    deliveryRate: number;
}>;
/**
 * Sequelize model definition for emails
 * @param sequelize - Sequelize instance
 * @param DataTypes - Sequelize data types
 * @returns Email model
 * @example
 * const EmailModel = defineEmailModel(sequelize, DataTypes);
 */
export declare function defineEmailModel(sequelize: any, DataTypes: any): any;
/**
 * Sequelize model definition for notifications
 * @param sequelize - Sequelize instance
 * @param DataTypes - Sequelize data types
 * @returns Notification model
 * @example
 * const NotificationModel = defineNotificationModel(sequelize, DataTypes);
 */
export declare function defineNotificationModel(sequelize: any, DataTypes: any): any;
/**
 * Sequelize model definition for email templates
 * @param sequelize - Sequelize instance
 * @param DataTypes - Sequelize data types
 * @returns EmailTemplate model
 * @example
 * const EmailTemplateModel = defineEmailTemplateModel(sequelize, DataTypes);
 */
export declare function defineEmailTemplateModel(sequelize: any, DataTypes: any): any;
/**
 * Sequelize model definition for subscriptions
 * @param sequelize - Sequelize instance
 * @param DataTypes - Sequelize data types
 * @returns Subscription model
 * @example
 * const SubscriptionModel = defineSubscriptionModel(sequelize, DataTypes);
 */
export declare function defineSubscriptionModel(sequelize: any, DataTypes: any): any;
declare const _default: {
    createSMTPTransporter: typeof createSMTPTransporter;
    sendEmailViaSMTP: typeof sendEmailViaSMTP;
    verifySMTPConnection: typeof verifySMTPConnection;
    sendEmailViaSendGrid: typeof sendEmailViaSendGrid;
    sendBulkEmailViaSendGrid: typeof sendBulkEmailViaSendGrid;
    sendEmailViaSES: typeof sendEmailViaSES;
    sendTemplatedEmailViaSES: typeof sendTemplatedEmailViaSES;
    compileHandlebarsTemplate: typeof compileHandlebarsTemplate;
    registerHandlebarsHelpers: typeof registerHandlebarsHelpers;
    compileEJSTemplate: typeof compileEJSTemplate;
    loadEmailTemplate: typeof loadEmailTemplate;
    renderEmailTemplate: typeof renderEmailTemplate;
    validateTemplateVariables: typeof validateTemplateVariables;
    createEmailQueue: typeof createEmailQueue;
    addEmailToQueue: typeof addEmailToQueue;
    processEmailQueue: typeof processEmailQueue;
    getEmailQueueStats: typeof getEmailQueueStats;
    retryFailedEmailJob: typeof retryFailedEmailJob;
    generateEmailTrackingToken: typeof generateEmailTrackingToken;
    injectTrackingPixel: typeof injectTrackingPixel;
    convertLinksToTracked: typeof convertLinksToTracked;
    recordEmailOpen: typeof recordEmailOpen;
    recordEmailClick: typeof recordEmailClick;
    getEmailTrackingStats: typeof getEmailTrackingStats;
    validateEmailSyntax: typeof validateEmailSyntax;
    validateEmailDomain: typeof validateEmailDomain;
    isDisposableEmail: typeof isDisposableEmail;
    isRoleBasedEmail: typeof isRoleBasedEmail;
    validateEmail: typeof validateEmail;
    sendBulkEmails: typeof sendBulkEmails;
    filterSubscribedRecipients: typeof filterSubscribedRecipients;
    scheduleEmail: typeof scheduleEmail;
    scheduleRecurringEmail: typeof scheduleRecurringEmail;
    cancelScheduledEmail: typeof cancelScheduledEmail;
    getNextRecurringEmailTime: typeof getNextRecurringEmailTime;
    sendSMSViaTwilio: typeof sendSMSViaTwilio;
    sendBulkSMS: typeof sendBulkSMS;
    validatePhoneNumber: typeof validatePhoneNumber;
    sendPushNotificationViaFCM: typeof sendPushNotificationViaFCM;
    sendPushNotificationViaAPNs: typeof sendPushNotificationViaAPNs;
    validatePushToken: typeof validatePushToken;
    createInAppNotification: typeof createInAppNotification;
    getUnreadNotifications: typeof getUnreadNotifications;
    markNotificationAsRead: typeof markNotificationAsRead;
    markAllNotificationsAsRead: typeof markAllNotificationsAsRead;
    deleteExpiredNotifications: typeof deleteExpiredNotifications;
    getNotificationPreferences: typeof getNotificationPreferences;
    updateNotificationPreferences: typeof updateNotificationPreferences;
    canSendNotification: typeof canSendNotification;
    shouldSendNotificationNow: typeof shouldSendNotificationNow;
    generateUnsubscribeToken: typeof generateUnsubscribeToken;
    createUnsubscribeLink: typeof createUnsubscribeLink;
    processUnsubscribe: typeof processUnsubscribe;
    resubscribe: typeof resubscribe;
    recordEmailBounce: typeof recordEmailBounce;
    recordEmailComplaint: typeof recordEmailComplaint;
    hasHardBounced: typeof hasHardBounced;
    hasComplainedAboutEmail: typeof hasComplainedAboutEmail;
    getEmailBounceStats: typeof getEmailBounceStats;
    autoSuppressProblematicEmails: typeof autoSuppressProblematicEmails;
    updateNotificationDeliveryStatus: typeof updateNotificationDeliveryStatus;
    getNotificationDeliveryStatus: typeof getNotificationDeliveryStatus;
    retryFailedNotification: typeof retryFailedNotification;
    getNotificationCampaignStats: typeof getNotificationCampaignStats;
    defineEmailModel: typeof defineEmailModel;
    defineNotificationModel: typeof defineNotificationModel;
    defineEmailTemplateModel: typeof defineEmailTemplateModel;
    defineSubscriptionModel: typeof defineSubscriptionModel;
};
export default _default;
//# sourceMappingURL=email-notification-kit.d.ts.map