/**
 * LOC: EMAILNOT1234568
 * File: /reuse/email-notification-kit-v2.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS notification services
 *   - Email queue processors
 *   - SMS services
 *   - Push notification services
 *   - Template engines
 */
import { Model, Sequelize } from 'sequelize';
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
    trackOpens?: boolean;
    trackClicks?: boolean;
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
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    configurationSetName?: string;
    returnPath?: string;
}
interface TwilioConfig {
    accountSid: string;
    authToken: string;
    fromNumber: string;
}
interface FCMConfig {
    projectId: string;
    privateKey: string;
    clientEmail: string;
    serverKey?: string;
}
interface NotificationTemplate {
    id: string;
    name: string;
    type: 'email' | 'sms' | 'push';
    subject?: string;
    body: string;
    variables: string[];
    language: string;
}
interface NotificationPreference {
    userId: string;
    email: boolean;
    sms: boolean;
    push: boolean;
    categories: Record<string, boolean>;
    frequency: 'immediate' | 'daily' | 'weekly';
    quietHours?: {
        start: string;
        end: string;
    };
}
interface SMSMessage {
    to: string;
    body: string;
    from?: string;
    mediaUrls?: string[];
    statusCallback?: string;
}
interface PushNotification {
    tokens: string[];
    title: string;
    body: string;
    data?: Record<string, string>;
    badge?: number;
    sound?: string;
    priority?: 'high' | 'normal';
    ttl?: number;
}
/**
 * Sequelize model for Email Logs with delivery tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} EmailLog model
 *
 * @example
 * const EmailLog = defineEmailLogModel(sequelize);
 * await EmailLog.create({
 *   recipientEmail: 'user@example.com',
 *   subject: 'Welcome',
 *   status: 'sent',
 *   provider: 'sendgrid'
 * });
 */
export declare function defineEmailLogModel(sequelize: Sequelize): typeof Model;
/**
 * Sequelize model for Notification Templates.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} NotificationTemplate model
 *
 * @example
 * const Template = defineNotificationTemplateModel(sequelize);
 * await Template.create({
 *   name: 'welcome_email',
 *   type: 'email',
 *   subject: 'Welcome {{name}}!',
 *   body: 'Hello {{name}}, welcome to our platform.',
 *   variables: ['name'],
 *   language: 'en'
 * });
 */
export declare function defineNotificationTemplateModel(sequelize: Sequelize): typeof Model;
/**
 * Sequelize model for User Notification Preferences.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} NotificationPreference model
 *
 * @example
 * const Preference = defineNotificationPreferenceModel(sequelize);
 * await Preference.create({
 *   userId: 'user-123',
 *   email: true,
 *   sms: false,
 *   push: true,
 *   frequency: 'immediate'
 * });
 */
export declare function defineNotificationPreferenceModel(sequelize: Sequelize): typeof Model;
/**
 * Zod schema for email configuration validation.
 */
export declare const emailConfigSchema: any;
/**
 * Zod schema for SMTP configuration validation.
 */
export declare const smtpConfigSchema: any;
/**
 * Zod schema for SMS message validation.
 */
export declare const smsMessageSchema: any;
/**
 * Zod schema for push notification validation.
 */
export declare const pushNotificationSchema: any;
/**
 * Zod schema for notification template validation.
 */
export declare const notificationTemplateSchema: any;
/**
 * Creates SMTP transporter with configuration.
 *
 * @param {SMTPConfig} config - SMTP configuration
 * @returns {any} Nodemailer transporter
 *
 * @example
 * const transporter = createSMTPTransporter({
 *   host: 'smtp.gmail.com',
 *   port: 587,
 *   secure: false,
 *   auth: { user: 'user@gmail.com', pass: 'password' }
 * });
 */
export declare function createSMTPTransporter(config: SMTPConfig): any;
/**
 * Sends email via SMTP.
 *
 * @param {any} transporter - SMTP transporter
 * @param {EmailConfig} emailConfig - Email configuration
 * @returns {Promise<any>} Send result
 *
 * @example
 * const result = await sendSMTPEmail(transporter, {
 *   from: 'sender@example.com',
 *   to: 'recipient@example.com',
 *   subject: 'Hello',
 *   html: '<h1>Hello World</h1>'
 * });
 */
export declare function sendSMTPEmail(transporter: any, emailConfig: EmailConfig): Promise<any>;
/**
 * Sends bulk emails via SMTP with rate limiting.
 *
 * @param {any} transporter - SMTP transporter
 * @param {EmailConfig[]} emails - Array of email configurations
 * @param {number} rateLimit - Emails per second
 * @returns {Promise<Array<{success: boolean, result?: any, error?: any}>>} Send results
 *
 * @example
 * const results = await sendBulkSMTPEmails(transporter, emailConfigs, 5);
 */
export declare function sendBulkSMTPEmails(transporter: any, emails: EmailConfig[], rateLimit?: number): Promise<Array<{
    success: boolean;
    result?: any;
    error?: any;
}>>;
/**
 * Validates email address format.
 *
 * @param {string} email - Email address
 * @returns {boolean} Validation result
 *
 * @example
 * const valid = validateEmailAddress('user@example.com');
 */
export declare function validateEmailAddress(email: string): boolean;
/**
 * Parses email headers from sent email.
 *
 * @param {any} emailResult - Email send result
 * @returns {Record<string, string>} Parsed headers
 *
 * @example
 * const headers = parseEmailHeaders(sendResult);
 */
export declare function parseEmailHeaders(emailResult: any): Record<string, string>;
/**
 * Creates SendGrid client.
 *
 * @param {SendGridConfig} config - SendGrid configuration
 * @returns {any} SendGrid client
 *
 * @example
 * const sgClient = createSendGridClient({
 *   apiKey: 'SG.xxx',
 *   from: 'noreply@example.com'
 * });
 */
export declare function createSendGridClient(config: SendGridConfig): any;
/**
 * Sends email via SendGrid.
 *
 * @param {any} sgClient - SendGrid client
 * @param {EmailConfig} emailConfig - Email configuration
 * @returns {Promise<any>} Send result
 *
 * @example
 * const result = await sendSendGridEmail(sgClient, {
 *   from: 'sender@example.com',
 *   to: 'recipient@example.com',
 *   subject: 'Hello',
 *   html: '<h1>Hello World</h1>'
 * });
 */
export declare function sendSendGridEmail(sgClient: any, emailConfig: EmailConfig): Promise<any>;
/**
 * Sends templated email via SendGrid.
 *
 * @param {any} sgClient - SendGrid client
 * @param {string} to - Recipient email
 * @param {string} templateId - SendGrid template ID
 * @param {Record<string, any>} dynamicData - Template data
 * @returns {Promise<any>} Send result
 *
 * @example
 * const result = await sendSendGridTemplate(sgClient, 'user@example.com', 'd-xxx', {
 *   name: 'John',
 *   verificationLink: 'https://example.com/verify'
 * });
 */
export declare function sendSendGridTemplate(sgClient: any, to: string, templateId: string, dynamicData: Record<string, any>): Promise<any>;
/**
 * Handles SendGrid webhook events.
 *
 * @param {any} event - Webhook event
 * @param {typeof Model} emailLogModel - Email log model
 * @returns {Promise<void>}
 *
 * @example
 * await handleSendGridWebhook(webhookEvent, EmailLog);
 */
export declare function handleSendGridWebhook(event: any, emailLogModel: typeof Model): Promise<void>;
/**
 * Creates AWS SES client.
 *
 * @param {SESConfig} config - SES configuration
 * @returns {any} SES client
 *
 * @example
 * const ses = createSESClient({
 *   region: 'us-east-1',
 *   accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
 *   secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
 * });
 */
export declare function createSESClient(config: SESConfig): any;
/**
 * Sends email via AWS SES.
 *
 * @param {any} sesClient - SES client
 * @param {EmailConfig} emailConfig - Email configuration
 * @returns {Promise<any>} Send result
 *
 * @example
 * const result = await sendSESEmail(ses, {
 *   from: 'sender@example.com',
 *   to: 'recipient@example.com',
 *   subject: 'Hello',
 *   html: '<h1>Hello World</h1>'
 * });
 */
export declare function sendSESEmail(sesClient: any, emailConfig: EmailConfig): Promise<any>;
/**
 * Sends templated email via AWS SES.
 *
 * @param {any} sesClient - SES client
 * @param {string} to - Recipient email
 * @param {string} templateName - SES template name
 * @param {Record<string, any>} templateData - Template data
 * @returns {Promise<any>} Send result
 *
 * @example
 * const result = await sendSESTemplate(ses, 'user@example.com', 'WelcomeEmail', {
 *   name: 'John'
 * });
 */
export declare function sendSESTemplate(sesClient: any, to: string, templateName: string, templateData: Record<string, any>): Promise<any>;
/**
 * Handles AWS SES bounce notifications.
 *
 * @param {any} notification - SNS notification
 * @param {typeof Model} emailLogModel - Email log model
 * @returns {Promise<void>}
 *
 * @example
 * await handleSESBounce(snsNotification, EmailLog);
 */
export declare function handleSESBounce(notification: any, emailLogModel: typeof Model): Promise<void>;
/**
 * Compiles Handlebars template.
 *
 * @param {string} template - Template string
 * @returns {(data: any) => string} Compiled template function
 *
 * @example
 * const compiled = compileHandlebarsTemplate('Hello {{name}}!');
 * const result = compiled({ name: 'John' });
 */
export declare function compileHandlebarsTemplate(template: string): (data: any) => string;
/**
 * Renders email template with data.
 *
 * @param {typeof Model} templateModel - Template model
 * @param {string} templateName - Template name
 * @param {Record<string, any>} data - Template data
 * @returns {Promise<{subject: string, body: string, html: string}>} Rendered template
 *
 * @example
 * const rendered = await renderEmailTemplate(Template, 'welcome_email', {
 *   name: 'John',
 *   verificationUrl: 'https://example.com/verify'
 * });
 */
export declare function renderEmailTemplate(templateModel: typeof Model, templateName: string, data: Record<string, any>): Promise<{
    subject: string;
    body: string;
    html: string;
}>;
/**
 * Validates template variables.
 *
 * @param {string[]} requiredVars - Required variables
 * @param {Record<string, any>} data - Provided data
 * @returns {boolean} Validation result
 *
 * @example
 * const valid = validateTemplateVariables(['name', 'email'], { name: 'John', email: 'john@example.com' });
 */
export declare function validateTemplateVariables(requiredVars: string[], data: Record<string, any>): boolean;
/**
 * Creates email template.
 *
 * @param {typeof Model} templateModel - Template model
 * @param {NotificationTemplate} template - Template data
 * @returns {Promise<any>} Created template
 *
 * @example
 * const template = await createEmailTemplate(Template, {
 *   name: 'password_reset',
 *   type: 'email',
 *   subject: 'Reset your password',
 *   body: 'Click here: {{resetLink}}',
 *   variables: ['resetLink'],
 *   language: 'en'
 * });
 */
export declare function createEmailTemplate(templateModel: typeof Model, template: Partial<NotificationTemplate>): Promise<any>;
/**
 * Generates unsubscribe link with token.
 *
 * @param {string} userId - User ID
 * @param {string} baseUrl - Base URL
 * @returns {string} Unsubscribe link
 *
 * @example
 * const link = generateUnsubscribeLink('user-123', 'https://example.com');
 */
export declare function generateUnsubscribeLink(userId: string, baseUrl: string): string;
/**
 * Creates Twilio client.
 *
 * @param {TwilioConfig} config - Twilio configuration
 * @returns {any} Twilio client
 *
 * @example
 * const twilio = createTwilioClient({
 *   accountSid: 'ACxxx',
 *   authToken: 'xxx',
 *   fromNumber: '+1234567890'
 * });
 */
export declare function createTwilioClient(config: TwilioConfig): any;
/**
 * Sends SMS via Twilio.
 *
 * @param {any} twilioClient - Twilio client
 * @param {SMSMessage} sms - SMS message
 * @returns {Promise<any>} Send result
 *
 * @example
 * const result = await sendTwilioSMS(twilio, {
 *   to: '+1234567890',
 *   body: 'Your verification code is 123456',
 *   from: '+0987654321'
 * });
 */
export declare function sendTwilioSMS(twilioClient: any, sms: SMSMessage): Promise<any>;
/**
 * Sends bulk SMS messages.
 *
 * @param {any} twilioClient - Twilio client
 * @param {SMSMessage[]} messages - Array of SMS messages
 * @returns {Promise<Array<{success: boolean, result?: any, error?: any}>>} Send results
 *
 * @example
 * const results = await sendBulkSMS(twilio, smsMessages);
 */
export declare function sendBulkSMS(twilioClient: any, messages: SMSMessage[]): Promise<Array<{
    success: boolean;
    result?: any;
    error?: any;
}>>;
/**
 * Validates phone number format.
 *
 * @param {string} phone - Phone number
 * @returns {boolean} Validation result
 *
 * @example
 * const valid = validatePhoneNumber('+1234567890');
 */
export declare function validatePhoneNumber(phone: string): boolean;
/**
 * Creates Firebase Cloud Messaging client.
 *
 * @param {FCMConfig} config - FCM configuration
 * @returns {any} FCM admin instance
 *
 * @example
 * const fcm = createFCMClient({
 *   projectId: 'my-project',
 *   privateKey: 'xxx',
 *   clientEmail: 'firebase-adminsdk@my-project.iam.gserviceaccount.com'
 * });
 */
export declare function createFCMClient(config: FCMConfig): any;
/**
 * Sends push notification via FCM.
 *
 * @param {any} fcmClient - FCM admin instance
 * @param {PushNotification} notification - Push notification
 * @returns {Promise<any>} Send result
 *
 * @example
 * const result = await sendFCMPushNotification(fcm, {
 *   tokens: ['token1', 'token2'],
 *   title: 'New Message',
 *   body: 'You have a new message',
 *   data: { messageId: '123' }
 * });
 */
export declare function sendFCMPushNotification(fcmClient: any, notification: PushNotification): Promise<any>;
/**
 * Sends silent push notification for data sync.
 *
 * @param {any} fcmClient - FCM admin instance
 * @param {string[]} tokens - Device tokens
 * @param {Record<string, string>} data - Data payload
 * @returns {Promise<any>} Send result
 *
 * @example
 * const result = await sendSilentPush(fcm, ['token1'], { syncType: 'messages' });
 */
export declare function sendSilentPush(fcmClient: any, tokens: string[], data: Record<string, string>): Promise<any>;
/**
 * Subscribes device tokens to topic.
 *
 * @param {any} fcmClient - FCM admin instance
 * @param {string[]} tokens - Device tokens
 * @param {string} topic - Topic name
 * @returns {Promise<any>} Subscription result
 *
 * @example
 * const result = await subscribeToTopic(fcm, ['token1', 'token2'], 'news');
 */
export declare function subscribeToTopic(fcmClient: any, tokens: string[], topic: string): Promise<any>;
/**
 * Tracks email open event.
 *
 * @param {typeof Model} emailLogModel - Email log model
 * @param {string} trackingId - Tracking ID
 * @returns {Promise<void>}
 *
 * @example
 * await trackEmailOpen(EmailLog, 'abc123');
 */
export declare function trackEmailOpen(emailLogModel: typeof Model, trackingId: string): Promise<void>;
/**
 * Tracks email click event.
 *
 * @param {typeof Model} emailLogModel - Email log model
 * @param {string} trackingId - Tracking ID
 * @param {string} url - Clicked URL
 * @returns {Promise<void>}
 *
 * @example
 * await trackEmailClick(EmailLog, 'abc123', 'https://example.com');
 */
export declare function trackEmailClick(emailLogModel: typeof Model, trackingId: string, url: string): Promise<void>;
/**
 * Generates email analytics report.
 *
 * @param {typeof Model} emailLogModel - Email log model
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Record<string, any>>} Analytics report
 *
 * @example
 * const report = await generateEmailAnalytics(EmailLog, startDate, endDate);
 */
export declare function generateEmailAnalytics(emailLogModel: typeof Model, startDate: Date, endDate: Date): Promise<Record<string, any>>;
/**
 * Identifies best send times based on open rates.
 *
 * @param {typeof Model} emailLogModel - Email log model
 * @param {number} days - Days to analyze
 * @returns {Promise<Array<{hour: number, openRate: number}>>} Best send times
 *
 * @example
 * const bestTimes = await identifyBestSendTimes(EmailLog, 30);
 */
export declare function identifyBestSendTimes(emailLogModel: typeof Model, days?: number): Promise<Array<{
    hour: number;
    openRate: number;
}>>;
/**
 * Gets user notification preferences.
 *
 * @param {typeof Model} preferenceModel - Preference model
 * @param {string} userId - User ID
 * @returns {Promise<any>} User preferences
 *
 * @example
 * const prefs = await getUserPreferences(NotificationPreference, 'user-123');
 */
export declare function getUserPreferences(preferenceModel: typeof Model, userId: string): Promise<any>;
/**
 * Updates user notification preferences.
 *
 * @param {typeof Model} preferenceModel - Preference model
 * @param {string} userId - User ID
 * @param {Partial<NotificationPreference>} updates - Preference updates
 * @returns {Promise<any>} Updated preferences
 *
 * @example
 * const updated = await updateUserPreferences(NotificationPreference, 'user-123', {
 *   email: false,
 *   sms: true
 * });
 */
export declare function updateUserPreferences(preferenceModel: typeof Model, userId: string, updates: Partial<NotificationPreference>): Promise<any>;
/**
 * Checks if user should receive notification based on preferences.
 *
 * @param {typeof Model} preferenceModel - Preference model
 * @param {string} userId - User ID
 * @param {string} notificationType - Notification type
 * @param {string} category - Notification category
 * @returns {Promise<boolean>} Whether to send notification
 *
 * @example
 * const shouldSend = await shouldSendNotification(NotificationPreference, 'user-123', 'email', 'marketing');
 */
export declare function shouldSendNotification(preferenceModel: typeof Model, userId: string, notificationType: 'email' | 'sms' | 'push', category?: string): Promise<boolean>;
/**
 * Handles unsubscribe request.
 *
 * @param {typeof Model} preferenceModel - Preference model
 * @param {string} token - Unsubscribe token
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * const success = await handleUnsubscribe(NotificationPreference, 'token123');
 */
export declare function handleUnsubscribe(preferenceModel: typeof Model, token: string): Promise<boolean>;
/**
 * NestJS Injectable Notification Service with multi-channel support.
 *
 * @example
 * @Injectable()
 * export class UserService {
 *   constructor(private notificationService: NotificationService) {}
 *
 *   async createUser(data: any) {
 *     const user = await this.userRepo.create(data);
 *     await this.notificationService.sendEmail(
 *       user.email,
 *       'welcome_email',
 *       { name: user.name }
 *     );
 *   }
 * }
 */
export declare class NotificationService {
    private emailLogModel;
    private templateModel;
    private preferenceModel;
    private smtpTransporter?;
    private twilioClient?;
    private fcmClient?;
    constructor(emailLogModel: typeof Model, templateModel: typeof Model, preferenceModel: typeof Model, smtpTransporter?: any | undefined, twilioClient?: any | undefined, fcmClient?: any | undefined);
    sendEmail(to: string, templateName: string, data: Record<string, any>): Promise<any>;
    sendSMS(to: string, message: string): Promise<any>;
    sendPush(tokens: string[], title: string, body: string, data?: Record<string, string>): Promise<any>;
}
export {};
//# sourceMappingURL=email-notification-kit-v2.d.ts.map