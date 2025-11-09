/**
 * LOC: EMAILNOTIFS001
 * File: /reuse/email-notifications-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS notification services
 *   - Email queue processors
 *   - Multi-channel notification orchestrators
 *   - Healthcare communication modules
 *   - Patient engagement services
 */
import { Transporter } from 'nodemailer';
import * as handlebars from 'handlebars';
/**
 * Email configuration for sending individual emails
 */
export interface EmailConfig {
    from: string;
    to: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    replyTo?: string;
    subject: string;
    html?: string;
    text?: string;
    attachments?: EmailAttachment[];
    headers?: Record<string, string>;
    priority?: 'high' | 'normal' | 'low';
    references?: string;
    inReplyTo?: string;
    messageId?: string;
    metadata?: Record<string, any>;
}
/**
 * Email attachment configuration
 */
export interface EmailAttachment {
    filename: string;
    content?: Buffer | string;
    path?: string;
    contentType?: string;
    cid?: string;
    encoding?: string;
    href?: string;
}
/**
 * SMTP server configuration
 */
export interface SMTPConfig {
    host: string;
    port: number;
    secure?: boolean;
    auth?: {
        user: string;
        pass: string;
    };
    tls?: {
        rejectUnauthorized?: boolean;
        minVersion?: string;
    };
    pool?: boolean;
    maxConnections?: number;
    maxMessages?: number;
    rateDelta?: number;
    rateLimit?: number;
    connectionTimeout?: number;
    greetingTimeout?: number;
    socketTimeout?: number;
}
/**
 * Email template structure
 */
export interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    htmlTemplate: string;
    textTemplate?: string;
    variables: string[];
    category?: string;
    locale?: string;
    version: number;
    isActive?: boolean;
    previewText?: string;
    layoutId?: string;
    metadata?: Record<string, any>;
}
/**
 * Template data for rendering
 */
export interface TemplateData {
    [key: string]: any;
}
/**
 * Email queue job configuration
 */
export interface EmailQueueJob {
    id: string;
    emailConfig: EmailConfig;
    templateId?: string;
    templateData?: TemplateData;
    priority?: number;
    delay?: number;
    attempts?: number;
    backoff?: {
        type: 'fixed' | 'exponential';
        delay: number;
    };
    removeOnComplete?: boolean;
    removeOnFail?: boolean;
    timeout?: number;
}
/**
 * Email tracking data
 */
export interface EmailTracking {
    emailId: string;
    recipientEmail: string;
    trackingToken: string;
    opened: boolean;
    openedAt?: Date;
    openCount: number;
    clickedLinks: Array<{
        url: string;
        clickedAt: Date;
        count: number;
    }>;
    lastClickedAt?: Date;
    clickCount: number;
    userAgent?: string;
    ipAddress?: string;
    location?: {
        country?: string;
        city?: string;
    };
}
/**
 * Email validation result
 */
export interface EmailValidationResult {
    email: string;
    isValid: boolean;
    isSyntaxValid: boolean;
    isDomainValid: boolean;
    isMxValid: boolean;
    isDisposable: boolean;
    isRoleBased: boolean;
    isCatchAll?: boolean;
    suggestions?: string[];
    errors?: string[];
    score?: number;
}
/**
 * Bulk email recipient
 */
export interface BulkEmailRecipient {
    email: string;
    name?: string;
    templateData?: TemplateData;
    metadata?: Record<string, any>;
    unsubscribeToken?: string;
}
/**
 * Bulk email job configuration
 */
export interface BulkEmailJob {
    templateId: string;
    recipients: BulkEmailRecipient[];
    subject?: string;
    from?: string;
    replyTo?: string;
    batchSize?: number;
    throttleMs?: number;
    trackOpens?: boolean;
    trackClicks?: boolean;
    metadata?: Record<string, any>;
}
/**
 * Email bounce information
 */
export interface EmailBounce {
    emailId: string;
    recipientEmail: string;
    bounceType: 'hard' | 'soft' | 'transient' | 'undetermined';
    bounceSubType?: string;
    bouncedAt: Date;
    diagnosticCode?: string;
    action?: string;
    status?: string;
    metadata?: Record<string, any>;
}
/**
 * Email complaint information
 */
export interface EmailComplaint {
    emailId: string;
    recipientEmail: string;
    complaintType: 'abuse' | 'fraud' | 'virus' | 'not-spam' | 'other';
    complainedAt: Date;
    feedbackId?: string;
    userAgent?: string;
    complaintFeedbackType?: string;
    metadata?: Record<string, any>;
}
/**
 * Unsubscribe token data
 */
export interface UnsubscribeToken {
    email: string;
    userId?: string;
    type: string;
    token: string;
    createdAt: Date;
    expiresAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * SMS configuration
 */
export interface SMSConfig {
    to: string | string[];
    message: string;
    from?: string;
    mediaUrls?: string[];
    statusCallback?: string;
    validityPeriod?: number;
    metadata?: Record<string, any>;
}
/**
 * SMS send result
 */
export interface SMSResult {
    messageId: string;
    to: string;
    status: 'queued' | 'sent' | 'delivered' | 'failed' | 'undelivered';
    error?: string;
    errorCode?: string;
    cost?: number;
    segments?: number;
}
/**
 * Push notification configuration
 */
export interface PushNotificationConfig {
    tokens: string[];
    title: string;
    body: string;
    data?: Record<string, any>;
    badge?: number;
    sound?: string;
    priority?: 'high' | 'normal' | 'low';
    ttl?: number;
    imageUrl?: string;
    clickAction?: string;
    icon?: string;
    color?: string;
    tag?: string;
    channelId?: string;
}
/**
 * Push notification result
 */
export interface PushNotificationResult {
    token: string;
    success: boolean;
    messageId?: string;
    error?: string;
    errorCode?: string;
}
/**
 * In-app notification
 */
export interface InAppNotification {
    id: string;
    userId: string;
    type: string;
    title: string;
    message: string;
    data?: Record<string, any>;
    priority: 'high' | 'normal' | 'low';
    category?: string;
    read: boolean;
    readAt?: Date;
    createdAt: Date;
    expiresAt?: Date;
    actionUrl?: string;
    actionLabel?: string;
    imageUrl?: string;
    iconUrl?: string;
}
/**
 * Notification preferences
 */
export interface NotificationPreferences {
    userId: string;
    email: {
        enabled: boolean;
        frequency: 'immediate' | 'hourly' | 'daily' | 'weekly' | 'never';
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
        days?: number[];
    };
    quietHours?: {
        enabled: boolean;
        startTime: string;
        endTime: string;
    };
}
/**
 * Multi-channel notification configuration
 */
export interface MultiChannelNotification {
    userId: string;
    type: string;
    priority: 'high' | 'normal' | 'low';
    channels: Array<'email' | 'sms' | 'push' | 'in-app'>;
    fallbackOrder?: Array<'email' | 'sms' | 'push' | 'in-app'>;
    content: {
        title: string;
        message: string;
        data?: Record<string, any>;
    };
    emailConfig?: Partial<EmailConfig>;
    smsConfig?: Partial<SMSConfig>;
    pushConfig?: Partial<PushNotificationConfig>;
    metadata?: Record<string, any>;
}
/**
 * Notification delivery status
 */
export interface NotificationDeliveryStatus {
    notificationId: string;
    userId: string;
    channel: 'email' | 'sms' | 'push' | 'in-app';
    status: 'pending' | 'queued' | 'sent' | 'delivered' | 'failed' | 'bounced' | 'read';
    attemptCount: number;
    lastAttemptAt?: Date;
    deliveredAt?: Date;
    readAt?: Date;
    error?: string;
    errorCode?: string;
    metadata?: Record<string, any>;
}
/**
 * Template version information
 */
export interface TemplateVersion {
    templateId: string;
    version: number;
    subject: string;
    htmlTemplate: string;
    textTemplate?: string;
    variables: string[];
    createdAt: Date;
    createdBy?: string;
    publishedAt?: Date;
    isActive: boolean;
    changelog?: string;
    metadata?: Record<string, any>;
}
/**
 * Compiles a Handlebars email template with data
 * @param templateString - Handlebars template string
 * @param data - Data to render into template
 * @param options - Handlebars compile options
 * @returns Rendered HTML string
 * @example
 * const html = compileHandlebarsTemplate(
 *   '<h1>Hello {{patientName}}</h1><p>Appointment: {{appointmentDate}}</p>',
 *   { patientName: 'John Doe', appointmentDate: '2024-12-15' }
 * );
 */
export declare function compileHandlebarsTemplate(templateString: string, data: TemplateData, options?: handlebars.CompileOptions): string;
/**
 * Registers custom Handlebars helper functions for email templates
 * @param helpers - Object mapping helper names to functions
 * @example
 * registerHandlebarsHelpers({
 *   formatDate: (date: Date) => date.toLocaleDateString('en-US'),
 *   formatCurrency: (amount: number) => `$${amount.toFixed(2)}`,
 *   uppercase: (str: string) => str.toUpperCase()
 * });
 */
export declare function registerHandlebarsHelpers(helpers: Record<string, handlebars.HelperDelegate>): void;
/**
 * Registers Handlebars partial templates for reuse across email templates
 * @param partials - Object mapping partial names to template strings
 * @example
 * registerHandlebarsPartials({
 *   header: '<header><img src="{{logoUrl}}" /></header>',
 *   footer: '<footer><p>&copy; {{year}} White Cross</p></footer>'
 * });
 */
export declare function registerHandlebarsPartials(partials: Record<string, string>): void;
/**
 * Compiles a Mustache email template with data
 * @param templateString - Mustache template string
 * @param data - Data to render into template
 * @returns Rendered HTML string
 * @example
 * const html = compileMustacheTemplate(
 *   '<h1>Hello {{patientName}}</h1>',
 *   { patientName: 'Jane Smith' }
 * );
 */
export declare function compileMustacheTemplate(templateString: string, data: TemplateData): string;
/**
 * Validates template variables against provided data
 * @param template - Email template with required variables
 * @param data - Data to validate
 * @returns Validation result with missing/extra variables
 * @example
 * const result = validateTemplateVariables(
 *   { variables: ['name', 'email', 'date'] } as EmailTemplate,
 *   { name: 'John', email: 'john@example.com' }
 * );
 * console.log(result.missing); // ['date']
 */
export declare function validateTemplateVariables(template: Pick<EmailTemplate, 'variables'>, data: TemplateData): {
    isValid: boolean;
    missing: string[];
    extra: string[];
    provided: string[];
};
/**
 * Renders a complete email template with subject and body
 * @param template - Email template to render
 * @param data - Template data
 * @returns Rendered email content (subject, html, text)
 * @example
 * const email = renderEmailTemplate(
 *   {
 *     subject: 'Hello {{name}}',
 *     htmlTemplate: '<p>Welcome {{name}}</p>',
 *     textTemplate: 'Welcome {{name}}'
 *   } as EmailTemplate,
 *   { name: 'John Doe' }
 * );
 */
export declare function renderEmailTemplate(template: EmailTemplate, data: TemplateData): {
    subject: string;
    html: string;
    text?: string;
};
/**
 * Wraps email content in a standard layout template
 * @param content - Email HTML content
 * @param layoutTemplate - Layout template with {{content}} placeholder
 * @param layoutData - Additional data for layout
 * @returns Complete HTML email with layout
 * @example
 * const email = wrapEmailInLayout(
 *   '<h1>Hello</h1>',
 *   '<html><body>{{header}}{{content}}{{footer}}</body></html>',
 *   { header: '<div>Logo</div>', footer: '<div>Footer</div>' }
 * );
 */
export declare function wrapEmailInLayout(content: string, layoutTemplate: string, layoutData?: TemplateData): string;
/**
 * Creates an SMTP email transporter with connection pooling
 * @param config - SMTP server configuration
 * @returns Configured Nodemailer transporter
 * @example
 * const transporter = createSMTPTransporter({
 *   host: 'smtp.gmail.com',
 *   port: 587,
 *   secure: false,
 *   auth: { user: 'user@gmail.com', pass: 'app-password' },
 *   pool: true,
 *   maxConnections: 5
 * });
 */
export declare function createSMTPTransporter(config: SMTPConfig): Transporter;
/**
 * Verifies SMTP connection and authentication
 * @param transporter - Nodemailer transporter instance
 * @returns True if connection is successful
 * @throws Error with connection failure details
 * @example
 * const isValid = await verifySMTPConnection(transporter);
 * if (!isValid) console.error('SMTP connection failed');
 */
export declare function verifySMTPConnection(transporter: Transporter): Promise<boolean>;
/**
 * Sends an email via SMTP with comprehensive error handling
 * @param transporter - Nodemailer transporter
 * @param emailConfig - Email configuration
 * @returns Send result with message ID and recipients
 * @example
 * const result = await sendEmailViaSMTP(transporter, {
 *   from: 'noreply@whitecross.com',
 *   to: 'patient@example.com',
 *   subject: 'Appointment Reminder',
 *   html: '<p>Your appointment is tomorrow at 2 PM</p>',
 *   text: 'Your appointment is tomorrow at 2 PM'
 * });
 */
export declare function sendEmailViaSMTP(transporter: Transporter, emailConfig: EmailConfig): Promise<{
    messageId: string;
    accepted: string[];
    rejected: string[];
    response: string;
}>;
/**
 * Closes SMTP transporter and connection pool
 * @param transporter - Nodemailer transporter to close
 * @example
 * await closeSMTPTransporter(transporter);
 */
export declare function closeSMTPTransporter(transporter: Transporter): Promise<void>;
/**
 * Creates a Bull email queue with Redis
 * @param queueName - Name of the queue
 * @param redisConfig - Redis connection configuration
 * @param options - Queue-specific options
 * @returns Bull queue instance
 * @example
 * const queue = createEmailQueue('emails', {
 *   host: 'localhost',
 *   port: 6379,
 *   password: 'redis-password'
 * }, {
 *   limiter: { max: 100, duration: 60000 },
 *   defaultJobOptions: { attempts: 3 }
 * });
 */
export declare function createEmailQueue(queueName: string, redisConfig: {
    host: string;
    port: number;
    password?: string;
    db?: number;
}, options?: {
    limiter?: {
        max: number;
        duration: number;
    };
    defaultJobOptions?: Partial<EmailQueueJob>;
}): any;
/**
 * Adds an email to the processing queue
 * @param queue - Bull queue instance
 * @param emailConfig - Email configuration
 * @param options - Job-specific options
 * @returns Queued job instance
 * @example
 * const job = await addEmailToQueue(emailQueue, {
 *   from: 'noreply@whitecross.com',
 *   to: 'patient@example.com',
 *   subject: 'Reminder',
 *   html: '<p>Don\'t forget!</p>'
 * }, {
 *   priority: 1,
 *   delay: 60000 // Send after 1 minute
 * });
 */
export declare function addEmailToQueue(queue: any, emailConfig: EmailConfig, options?: {
    templateId?: string;
    templateData?: TemplateData;
    priority?: number;
    delay?: number;
    attempts?: number;
}): Promise<any>;
/**
 * Processes email queue jobs with a worker function
 * @param queue - Bull queue instance
 * @param processor - Async function to process each job
 * @param concurrency - Number of concurrent jobs to process
 * @example
 * processEmailQueue(emailQueue, async (job) => {
 *   const { emailConfig } = job.data;
 *   await sendEmailViaSMTP(transporter, emailConfig);
 *   console.log(`Sent email ${job.id}`);
 * }, 5);
 */
export declare function processEmailQueue(queue: any, processor: (job: any) => Promise<void>, concurrency?: number): void;
/**
 * Gets comprehensive queue statistics
 * @param queue - Bull queue instance
 * @returns Queue metrics including job counts and status
 * @example
 * const stats = await getQueueStatistics(emailQueue);
 * console.log(`Queue stats: ${stats.waiting} waiting, ${stats.active} active`);
 */
export declare function getQueueStatistics(queue: any): Promise<{
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
    paused: number;
}>;
/**
 * Retries a specific failed job in the queue
 * @param queue - Bull queue instance
 * @param jobId - ID of the job to retry
 * @returns Retried job instance or null if not found
 * @example
 * const retriedJob = await retryFailedJob(emailQueue, 'job-abc-123');
 */
export declare function retryFailedJob(queue: any, jobId: string): Promise<any>;
/**
 * Sends a transactional email with template rendering
 * @param transporter - SMTP transporter
 * @param template - Email template
 * @param recipient - Recipient email address
 * @param data - Template data
 * @param options - Additional email options
 * @returns Send result
 * @example
 * const result = await sendTransactionalEmail(
 *   transporter,
 *   appointmentTemplate,
 *   'patient@example.com',
 *   { patientName: 'John Doe', appointmentDate: '2024-12-15' },
 *   { from: 'noreply@whitecross.com', priority: 'high' }
 * );
 */
export declare function sendTransactionalEmail(transporter: Transporter, template: EmailTemplate, recipient: string, data: TemplateData, options?: {
    from?: string;
    replyTo?: string;
    priority?: 'high' | 'normal' | 'low';
    attachments?: EmailAttachment[];
}): Promise<{
    messageId: string;
    accepted: string[];
    rejected: string[];
}>;
/**
 * Sends a password reset email with secure token
 * @param transporter - SMTP transporter
 * @param recipientEmail - User's email address
 * @param resetToken - Secure password reset token
 * @param resetUrl - Password reset URL
 * @param expirationMinutes - Token expiration time
 * @returns Send result
 * @example
 * await sendPasswordResetEmail(
 *   transporter,
 *   'user@example.com',
 *   'secure-token-123',
 *   'https://whitecross.com/reset-password',
 *   30
 * );
 */
export declare function sendPasswordResetEmail(transporter: Transporter, recipientEmail: string, resetToken: string, resetUrl: string, expirationMinutes?: number): Promise<{
    messageId: string;
}>;
/**
 * Sends bulk emails in batches with throttling
 * @param transporter - SMTP transporter
 * @param job - Bulk email job configuration
 * @param onProgress - Progress callback function
 * @returns Bulk send results with success/failure counts
 * @example
 * const results = await sendBulkEmails(transporter, {
 *   templateId: 'newsletter',
 *   recipients: [...],
 *   batchSize: 100,
 *   throttleMs: 1000
 * }, (progress) => {
 *   console.log(`Sent ${progress.sent}/${progress.total}`);
 * });
 */
export declare function sendBulkEmails(transporter: Transporter, job: BulkEmailJob, onProgress?: (progress: {
    sent: number;
    failed: number;
    total: number;
}) => void): Promise<{
    total: number;
    sent: number;
    failed: number;
    errors: Array<{
        email: string;
        error: string;
    }>;
}>;
/**
 * Filters bulk email recipients based on subscription status
 * @param recipients - List of recipients
 * @param checkSubscription - Function to verify subscription
 * @returns Filtered list of subscribed recipients
 * @example
 * const subscribed = await filterSubscribedRecipients(
 *   allRecipients,
 *   async (email) => {
 *     const sub = await getSubscription(email, 'newsletter');
 *     return sub?.status === 'subscribed';
 *   }
 * );
 */
export declare function filterSubscribedRecipients(recipients: BulkEmailRecipient[], checkSubscription: (email: string) => Promise<boolean>): Promise<BulkEmailRecipient[]>;
/**
 * Validates email address syntax using RFC 5322 standard
 * @param email - Email address to validate
 * @returns True if syntax is valid
 * @example
 * const isValid = validateEmailSyntax('user@example.com'); // true
 * const isInvalid = validateEmailSyntax('invalid.email'); // false
 */
export declare function validateEmailSyntax(email: string): boolean;
/**
 * Validates email domain by checking MX records
 * @param email - Email address to validate
 * @returns Domain validation result with MX records
 * @example
 * const result = await validateEmailDomain('user@example.com');
 * console.log(result.hasMxRecords); // true
 */
export declare function validateEmailDomain(email: string): Promise<{
    isValid: boolean;
    hasMxRecords: boolean;
    mxRecords?: Array<{
        exchange: string;
        priority: number;
    }>;
}>;
/**
 * Checks if email is from a known disposable email provider
 * @param email - Email address to check
 * @returns True if disposable
 * @example
 * const isDisposable = isDisposableEmail('user@tempmail.com'); // true
 */
export declare function isDisposableEmail(email: string): boolean;
/**
 * Checks if email is role-based (admin, info, support, etc.)
 * @param email - Email address to check
 * @returns True if role-based
 * @example
 * const isRole = isRoleBasedEmail('admin@example.com'); // true
 */
export declare function isRoleBasedEmail(email: string): boolean;
/**
 * Performs comprehensive email validation
 * @param email - Email address to validate
 * @param options - Validation options
 * @returns Detailed validation result
 * @example
 * const result = await comprehensiveEmailValidation('user@example.com', {
 *   checkMx: true,
 *   checkDisposable: true
 * });
 */
export declare function comprehensiveEmailValidation(email: string, options?: {
    checkMx?: boolean;
    checkDisposable?: boolean;
    checkRoleBased?: boolean;
}): Promise<EmailValidationResult>;
/**
 * Records an email bounce event
 * @param bounce - Bounce information
 * @returns Recorded bounce record
 * @example
 * await recordEmailBounce({
 *   emailId: 'email-123',
 *   recipientEmail: 'invalid@example.com',
 *   bounceType: 'hard',
 *   bounceSubType: 'no-email',
 *   bouncedAt: new Date(),
 *   diagnosticCode: '550 5.1.1 User unknown'
 * });
 */
export declare function recordEmailBounce(bounce: EmailBounce): Promise<EmailBounce>;
/**
 * Checks if an email address has hard bounced
 * @param email - Email address to check
 * @returns True if email has hard bounced
 * @example
 * const hasBounced = await hasHardBounced('invalid@example.com');
 * if (hasBounced) console.log('Email is not deliverable');
 */
export declare function hasHardBounced(email: string): Promise<boolean>;
/**
 * Gets bounce statistics for an email address
 * @param email - Email address
 * @returns Bounce counts and last bounce date
 * @example
 * const stats = await getEmailBounceStats('user@example.com');
 * console.log(`Hard bounces: ${stats.hardBounces}, Soft: ${stats.softBounces}`);
 */
export declare function getEmailBounceStats(email: string): Promise<{
    totalBounces: number;
    hardBounces: number;
    softBounces: number;
    transientBounces: number;
    lastBounce?: Date;
    lastBounceType?: string;
}>;
/**
 * Generates a secure unsubscribe token
 * @param email - Email address
 * @param type - Subscription type
 * @param expirationDays - Token expiration in days (0 = no expiration)
 * @returns Unsubscribe token object
 * @example
 * const token = generateUnsubscribeToken('user@example.com', 'newsletter', 90);
 */
export declare function generateUnsubscribeToken(email: string, type: string, expirationDays?: number): UnsubscribeToken;
/**
 * Creates an unsubscribe link for email footer
 * @param baseUrl - Base URL for unsubscribe endpoint
 * @param token - Unsubscribe token
 * @returns Complete unsubscribe URL
 * @example
 * const link = createUnsubscribeLink('https://whitecross.com/unsubscribe', token);
 */
export declare function createUnsubscribeLink(baseUrl: string, token: string): string;
/**
 * Verifies and processes an unsubscribe request
 * @param token - Unsubscribe token from link
 * @param reason - Optional unsubscribe reason
 * @returns Processing result
 * @example
 * const result = await processUnsubscribeRequest(token, 'Too many emails');
 */
export declare function processUnsubscribeRequest(token: string, reason?: string): Promise<{
    success: boolean;
    email?: string;
    type?: string;
    error?: string;
}>;
/**
 * Adds unsubscribe header to email (List-Unsubscribe)
 * @param emailConfig - Email configuration to modify
 * @param unsubscribeUrl - One-click unsubscribe URL
 * @param unsubscribeEmail - Mailto unsubscribe address
 * @returns Modified email config with unsubscribe headers
 * @example
 * const config = addUnsubscribeHeader(emailConfig,
 *   'https://whitecross.com/unsubscribe?token=abc',
 *   'unsubscribe@whitecross.com'
 * );
 */
export declare function addUnsubscribeHeader(emailConfig: EmailConfig, unsubscribeUrl: string, unsubscribeEmail?: string): EmailConfig;
/**
 * Generates a unique tracking token for email analytics
 * @param emailId - Email identifier
 * @param recipientEmail - Recipient email address
 * @returns Secure tracking token
 * @example
 * const token = generateTrackingToken('email-123', 'user@example.com');
 */
export declare function generateTrackingToken(emailId: string, recipientEmail: string): string;
/**
 * Injects a tracking pixel into email HTML
 * @param html - Email HTML content
 * @param trackingPixelUrl - Tracking pixel image URL
 * @returns HTML with embedded tracking pixel
 * @example
 * const tracked = injectTrackingPixel(
 *   emailHtml,
 *   'https://track.whitecross.com/pixel/abc123.png'
 * );
 */
export declare function injectTrackingPixel(html: string, trackingPixelUrl: string): string;
/**
 * Converts all links in email HTML to tracked links
 * @param html - Email HTML content
 * @param trackingBaseUrl - Base URL for click tracking
 * @param emailId - Email identifier
 * @param recipientEmail - Recipient email for tracking
 * @returns HTML with all links converted to tracked versions
 * @example
 * const trackedHtml = convertLinksToTracked(
 *   emailHtml,
 *   'https://track.whitecross.com/click',
 *   'email-123',
 *   'user@example.com'
 * );
 */
export declare function convertLinksToTracked(html: string, trackingBaseUrl: string, emailId: string, recipientEmail: string): string;
/**
 * Records an email open event
 * @param emailId - Email identifier
 * @param recipientEmail - Recipient email
 * @param metadata - Additional tracking metadata
 * @returns Tracking record
 * @example
 * await recordEmailOpen('email-123', 'user@example.com', {
 *   ipAddress: '192.168.1.1',
 *   userAgent: 'Mozilla/5.0...'
 * });
 */
export declare function recordEmailOpen(emailId: string, recipientEmail: string, metadata?: {
    ipAddress?: string;
    userAgent?: string;
    location?: {
        country?: string;
        city?: string;
    };
}): Promise<EmailTracking>;
/**
 * Records an email link click event
 * @param emailId - Email identifier
 * @param recipientEmail - Recipient email
 * @param clickedUrl - URL that was clicked
 * @param metadata - Additional tracking metadata
 * @returns Updated tracking record
 * @example
 * await recordEmailClick(
 *   'email-123',
 *   'user@example.com',
 *   'https://whitecross.com/appointments',
 *   { ipAddress: '192.168.1.1' }
 * );
 */
export declare function recordEmailClick(emailId: string, recipientEmail: string, clickedUrl: string, metadata?: {
    ipAddress?: string;
    userAgent?: string;
}): Promise<EmailTracking>;
/**
 * Sends SMS via Twilio
 * @param accountSid - Twilio account SID
 * @param authToken - Twilio auth token
 * @param smsConfig - SMS configuration
 * @returns SMS send result
 * @example
 * const result = await sendSMSViaTwilio(
 *   'AC123...',
 *   'auth_token',
 *   {
 *     from: '+1234567890',
 *     to: '+0987654321',
 *     message: 'Your appointment is tomorrow at 2 PM'
 *   }
 * );
 */
export declare function sendSMSViaTwilio(accountSid: string, authToken: string, smsConfig: SMSConfig): Promise<SMSResult>;
/**
 * Validates phone number format (E.164)
 * @param phoneNumber - Phone number to validate
 * @returns True if valid E.164 format
 * @example
 * const isValid = validatePhoneNumber('+12345678900'); // true
 * const isInvalid = validatePhoneNumber('1234567890'); // false (missing +)
 */
export declare function validatePhoneNumber(phoneNumber: string): boolean;
/**
 * Sends bulk SMS messages in batches
 * @param accountSid - Twilio account SID
 * @param authToken - Twilio auth token
 * @param messages - Array of SMS configurations
 * @param batchSize - Number of messages per batch
 * @returns Array of send results
 * @example
 * const results = await sendBulkSMS(sid, token, [
 *   { from: '+1111111111', to: '+2222222222', message: 'Hello 1' },
 *   { from: '+1111111111', to: '+3333333333', message: 'Hello 2' }
 * ], 10);
 */
export declare function sendBulkSMS(accountSid: string, authToken: string, messages: SMSConfig[], batchSize?: number): Promise<SMSResult[]>;
/**
 * Sends push notification via Firebase Cloud Messaging (FCM)
 * @param serverKey - FCM server key
 * @param notification - Push notification configuration
 * @returns Array of send results per device token
 * @example
 * const results = await sendPushNotificationFCM('fcm-key', {
 *   tokens: ['device-token-1', 'device-token-2'],
 *   title: 'Appointment Reminder',
 *   body: 'Your appointment is tomorrow at 2 PM',
 *   data: { appointmentId: '123' },
 *   priority: 'high'
 * });
 */
export declare function sendPushNotificationFCM(serverKey: string, notification: PushNotificationConfig): Promise<PushNotificationResult[]>;
/**
 * Validates push notification device token format
 * @param token - Device token to validate
 * @param platform - Platform (ios, android, web)
 * @returns True if token format is valid
 * @example
 * const isValid = validatePushToken('device-token-123', 'android');
 */
export declare function validatePushToken(token: string, platform: 'ios' | 'android' | 'web'): boolean;
/**
 * Creates an in-app notification for a user
 * @param notification - Notification data (without id, read status, timestamps)
 * @returns Created notification with generated ID
 * @example
 * const notif = await createInAppNotification({
 *   userId: 'user-123',
 *   type: 'appointment',
 *   title: 'New Appointment',
 *   message: 'You have a new appointment scheduled',
 *   priority: 'high',
 *   actionUrl: '/appointments/123'
 * });
 */
export declare function createInAppNotification(notification: Omit<InAppNotification, 'id' | 'read' | 'readAt' | 'createdAt'>): Promise<InAppNotification>;
/**
 * Marks an in-app notification as read
 * @param notificationId - Notification ID
 * @returns Updated notification
 * @example
 * const notif = await markNotificationAsRead('notif-123');
 */
export declare function markNotificationAsRead(notificationId: string): Promise<InAppNotification | null>;
/**
 * Gets unread notifications for a user
 * @param userId - User ID
 * @param limit - Maximum number of notifications
 * @param offset - Pagination offset
 * @returns Array of unread notifications
 * @example
 * const unread = await getUnreadNotifications('user-123', 20, 0);
 */
export declare function getUnreadNotifications(userId: string, limit?: number, offset?: number): Promise<InAppNotification[]>;
/**
 * Gets user notification preferences
 * @param userId - User ID
 * @returns User's notification preferences or defaults
 * @example
 * const prefs = await getNotificationPreferences('user-123');
 */
export declare function getNotificationPreferences(userId: string): Promise<NotificationPreferences>;
/**
 * Updates user notification preferences
 * @param userId - User ID
 * @param preferences - Partial preferences to update
 * @returns Updated preferences
 * @example
 * const updated = await updateNotificationPreferences('user-123', {
 *   email: { enabled: true, frequency: 'daily', types: ['newsletter'] }
 * });
 */
export declare function updateNotificationPreferences(userId: string, preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences>;
/**
 * Checks if user should receive notification based on preferences
 * @param userId - User ID
 * @param channel - Notification channel
 * @param type - Notification type
 * @returns True if notification should be sent
 * @example
 * const should = await shouldSendNotification('user-123', 'email', 'appointment');
 */
export declare function shouldSendNotification(userId: string, channel: 'email' | 'sms' | 'push' | 'in-app', type: string): Promise<boolean>;
/**
 * Sends notification across multiple channels based on user preferences
 * @param notification - Multi-channel notification configuration
 * @param transporter - SMTP transporter for email (optional)
 * @returns Delivery status for each channel
 * @example
 * const results = await sendMultiChannelNotification({
 *   userId: 'user-123',
 *   type: 'appointment',
 *   priority: 'high',
 *   channels: ['email', 'sms', 'push'],
 *   content: {
 *     title: 'Appointment Reminder',
 *     message: 'Your appointment is tomorrow'
 *   }
 * }, transporter);
 */
export declare function sendMultiChannelNotification(notification: MultiChannelNotification, transporter?: Transporter): Promise<NotificationDeliveryStatus[]>;
/**
 * Creates a new version of an email template
 * @param baseTemplate - Base template to version
 * @param changes - Changes for the new version
 * @param changelog - Description of changes
 * @returns New template version
 * @example
 * const v2 = await createTemplateVersion(
 *   existingTemplate,
 *   { subject: 'Updated subject line' },
 *   'Improved subject line clarity'
 * );
 */
export declare function createTemplateVersion(baseTemplate: EmailTemplate, changes: Partial<EmailTemplate>, changelog?: string): Promise<TemplateVersion>;
/**
 * Activates a specific template version
 * @param templateId - Template ID
 * @param version - Version number to activate
 * @returns Updated template version
 * @example
 * await activateTemplateVersion('template-123', 2);
 */
export declare function activateTemplateVersion(templateId: string, version: number): Promise<TemplateVersion | null>;
/**
 * Gets all versions of a template
 * @param templateId - Template ID
 * @returns Array of template versions
 * @example
 * const versions = await getTemplateVersions('template-123');
 */
export declare function getTemplateVersions(templateId: string): Promise<TemplateVersion[]>;
declare const _default: {
    compileHandlebarsTemplate: typeof compileHandlebarsTemplate;
    registerHandlebarsHelpers: typeof registerHandlebarsHelpers;
    registerHandlebarsPartials: typeof registerHandlebarsPartials;
    compileMustacheTemplate: typeof compileMustacheTemplate;
    validateTemplateVariables: typeof validateTemplateVariables;
    renderEmailTemplate: typeof renderEmailTemplate;
    wrapEmailInLayout: typeof wrapEmailInLayout;
    createSMTPTransporter: typeof createSMTPTransporter;
    verifySMTPConnection: typeof verifySMTPConnection;
    sendEmailViaSMTP: typeof sendEmailViaSMTP;
    closeSMTPTransporter: typeof closeSMTPTransporter;
    createEmailQueue: typeof createEmailQueue;
    addEmailToQueue: typeof addEmailToQueue;
    processEmailQueue: typeof processEmailQueue;
    getQueueStatistics: typeof getQueueStatistics;
    retryFailedJob: typeof retryFailedJob;
    sendTransactionalEmail: typeof sendTransactionalEmail;
    sendPasswordResetEmail: typeof sendPasswordResetEmail;
    sendBulkEmails: typeof sendBulkEmails;
    filterSubscribedRecipients: typeof filterSubscribedRecipients;
    validateEmailSyntax: typeof validateEmailSyntax;
    validateEmailDomain: typeof validateEmailDomain;
    isDisposableEmail: typeof isDisposableEmail;
    isRoleBasedEmail: typeof isRoleBasedEmail;
    comprehensiveEmailValidation: typeof comprehensiveEmailValidation;
    recordEmailBounce: typeof recordEmailBounce;
    hasHardBounced: typeof hasHardBounced;
    getEmailBounceStats: typeof getEmailBounceStats;
    generateUnsubscribeToken: typeof generateUnsubscribeToken;
    createUnsubscribeLink: typeof createUnsubscribeLink;
    processUnsubscribeRequest: typeof processUnsubscribeRequest;
    addUnsubscribeHeader: typeof addUnsubscribeHeader;
    generateTrackingToken: typeof generateTrackingToken;
    injectTrackingPixel: typeof injectTrackingPixel;
    convertLinksToTracked: typeof convertLinksToTracked;
    recordEmailOpen: typeof recordEmailOpen;
    recordEmailClick: typeof recordEmailClick;
    sendSMSViaTwilio: typeof sendSMSViaTwilio;
    validatePhoneNumber: typeof validatePhoneNumber;
    sendBulkSMS: typeof sendBulkSMS;
    sendPushNotificationFCM: typeof sendPushNotificationFCM;
    validatePushToken: typeof validatePushToken;
    createInAppNotification: typeof createInAppNotification;
    markNotificationAsRead: typeof markNotificationAsRead;
    getUnreadNotifications: typeof getUnreadNotifications;
    getNotificationPreferences: typeof getNotificationPreferences;
    updateNotificationPreferences: typeof updateNotificationPreferences;
    shouldSendNotification: typeof shouldSendNotification;
    sendMultiChannelNotification: typeof sendMultiChannelNotification;
    createTemplateVersion: typeof createTemplateVersion;
    activateTemplateVersion: typeof activateTemplateVersion;
    getTemplateVersions: typeof getTemplateVersions;
};
export default _default;
//# sourceMappingURL=email-notifications-kit.d.ts.map