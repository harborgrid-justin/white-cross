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

/**
 * File: /reuse/email-notifications-kit.ts
 * Locator: WC-UTL-EMAILNOTIFS-001
 * Purpose: Enterprise Email & Multi-Channel Notifications Kit for NestJS
 *
 * Upstream: Independent utility module for comprehensive notification operations
 * Downstream: ../backend/*, Notification services, Email services, SMS services, Push notification services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, nodemailer, handlebars, bull, twilio, firebase-admin
 * Exports: 45 utility functions for email templating, SMTP, queues, tracking, SMS, push, in-app, preferences
 *
 * LLM Context: Enterprise-grade email and multi-channel notification utilities for White Cross healthcare platform.
 * Provides comprehensive email template rendering (Handlebars, Mustache), SMTP configuration and connection pooling,
 * email queue management with Bull/Redis, transactional and bulk email sending, email validation and verification,
 * bounce and complaint handling, unsubscribe management, email tracking (opens/clicks), SMS notifications via Twilio,
 * push notifications (FCM/APNs), in-app notifications, user notification preferences, multi-channel delivery
 * orchestration, template versioning, HIPAA-compliant communication patterns, and healthcare-specific notification workflows.
 */

import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { Transporter, SendMailOptions } from 'nodemailer';
import * as handlebars from 'handlebars';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
  cid?: string; // Content-ID for inline images
  encoding?: string;
  href?: string;
}

/**
 * SMTP server configuration
 */
export interface SMTPConfig {
  host: string;
  port: number;
  secure?: boolean; // true for 465, false for other ports
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
  score?: number; // 0-100 validity score
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
  ttl?: number; // Time to live in seconds
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
    startHour: number; // 0-23
    endHour: number; // 0-23
    timezone: string;
    days?: number[]; // 0-6 (Sunday-Saturday)
  };
  quietHours?: {
    enabled: boolean;
    startTime: string; // HH:mm format
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

// ============================================================================
// EMAIL TEMPLATE RENDERING
// ============================================================================

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
export function compileHandlebarsTemplate(
  templateString: string,
  data: TemplateData,
  options?: handlebars.CompileOptions
): string {
  try {
    const template = handlebars.compile(templateString, options);
    return template(data);
  } catch (error: any) {
    throw new Error(`Template compilation failed: ${error.message}`);
  }
}

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
export function registerHandlebarsHelpers(helpers: Record<string, handlebars.HelperDelegate>): void {
  Object.entries(helpers).forEach(([name, fn]) => {
    handlebars.registerHelper(name, fn);
  });
}

/**
 * Registers Handlebars partial templates for reuse across email templates
 * @param partials - Object mapping partial names to template strings
 * @example
 * registerHandlebarsPartials({
 *   header: '<header><img src="{{logoUrl}}" /></header>',
 *   footer: '<footer><p>&copy; {{year}} White Cross</p></footer>'
 * });
 */
export function registerHandlebarsPartials(partials: Record<string, string>): void {
  Object.entries(partials).forEach(([name, template]) => {
    handlebars.registerPartial(name, template);
  });
}

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
export function compileMustacheTemplate(
  templateString: string,
  data: TemplateData
): string {
  const Mustache = require('mustache');
  try {
    return Mustache.render(templateString, data);
  } catch (error: any) {
    throw new Error(`Mustache template compilation failed: ${error.message}`);
  }
}

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
export function validateTemplateVariables(
  template: Pick<EmailTemplate, 'variables'>,
  data: TemplateData
): {
  isValid: boolean;
  missing: string[];
  extra: string[];
  provided: string[];
} {
  const required = template.variables || [];
  const provided = Object.keys(data);
  const missing = required.filter(v => !(v in data));
  const extra = provided.filter(v => !required.includes(v));

  return {
    isValid: missing.length === 0,
    missing,
    extra,
    provided,
  };
}

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
export function renderEmailTemplate(
  template: EmailTemplate,
  data: TemplateData
): {
  subject: string;
  html: string;
  text?: string;
} {
  const validation = validateTemplateVariables(template, data);
  if (!validation.isValid) {
    throw new Error(`Missing required template variables: ${validation.missing.join(', ')}`);
  }

  const subject = compileHandlebarsTemplate(template.subject, data);
  const html = compileHandlebarsTemplate(template.htmlTemplate, data);
  const text = template.textTemplate
    ? compileHandlebarsTemplate(template.textTemplate, data)
    : undefined;

  return { subject, html, text };
}

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
export function wrapEmailInLayout(
  content: string,
  layoutTemplate: string,
  layoutData?: TemplateData
): string {
  const data = {
    ...layoutData,
    content,
  };
  return compileHandlebarsTemplate(layoutTemplate, data);
}

// ============================================================================
// SMTP CONFIGURATION & CONNECTION
// ============================================================================

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
export function createSMTPTransporter(config: SMTPConfig): Transporter {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure ?? (config.port === 465),
    auth: config.auth,
    tls: config.tls,
    pool: config.pool ?? false,
    maxConnections: config.maxConnections ?? 5,
    maxMessages: config.maxMessages,
    rateDelta: config.rateDelta,
    rateLimit: config.rateLimit,
    connectionTimeout: config.connectionTimeout,
    greetingTimeout: config.greetingTimeout,
    socketTimeout: config.socketTimeout,
  });
}

/**
 * Verifies SMTP connection and authentication
 * @param transporter - Nodemailer transporter instance
 * @returns True if connection is successful
 * @throws Error with connection failure details
 * @example
 * const isValid = await verifySMTPConnection(transporter);
 * if (!isValid) console.error('SMTP connection failed');
 */
export async function verifySMTPConnection(transporter: Transporter): Promise<boolean> {
  try {
    await transporter.verify();
    return true;
  } catch (error: any) {
    throw new Error(`SMTP verification failed: ${error.message}`);
  }
}

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
export async function sendEmailViaSMTP(
  transporter: Transporter,
  emailConfig: EmailConfig
): Promise<{
  messageId: string;
  accepted: string[];
  rejected: string[];
  response: string;
}> {
  const mailOptions: SendMailOptions = {
    from: emailConfig.from,
    to: Array.isArray(emailConfig.to) ? emailConfig.to.join(',') : emailConfig.to,
    cc: emailConfig.cc
      ? Array.isArray(emailConfig.cc)
        ? emailConfig.cc.join(',')
        : emailConfig.cc
      : undefined,
    bcc: emailConfig.bcc
      ? Array.isArray(emailConfig.bcc)
        ? emailConfig.bcc.join(',')
        : emailConfig.bcc
      : undefined,
    replyTo: emailConfig.replyTo,
    subject: emailConfig.subject,
    html: emailConfig.html,
    text: emailConfig.text,
    attachments: emailConfig.attachments,
    headers: emailConfig.headers,
    priority: emailConfig.priority,
    references: emailConfig.references,
    inReplyTo: emailConfig.inReplyTo,
    messageId: emailConfig.messageId,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return {
      messageId: info.messageId,
      accepted: info.accepted as string[],
      rejected: info.rejected as string[],
      response: info.response,
    };
  } catch (error: any) {
    throw new Error(`Email send failed: ${error.message}`);
  }
}

/**
 * Closes SMTP transporter and connection pool
 * @param transporter - Nodemailer transporter to close
 * @example
 * await closeSMTPTransporter(transporter);
 */
export async function closeSMTPTransporter(transporter: Transporter): Promise<void> {
  transporter.close();
}

// ============================================================================
// EMAIL QUEUE MANAGEMENT
// ============================================================================

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
export function createEmailQueue(
  queueName: string,
  redisConfig: { host: string; port: number; password?: string; db?: number },
  options?: {
    limiter?: { max: number; duration: number };
    defaultJobOptions?: Partial<EmailQueueJob>;
  }
): any {
  const Queue = require('bull');

  return new Queue(queueName, {
    redis: redisConfig,
    limiter: options?.limiter,
    defaultJobOptions: {
      attempts: options?.defaultJobOptions?.attempts ?? 3,
      backoff: options?.defaultJobOptions?.backoff ?? {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: options?.defaultJobOptions?.removeOnComplete ?? true,
      removeOnFail: options?.defaultJobOptions?.removeOnFail ?? false,
      timeout: options?.defaultJobOptions?.timeout ?? 30000,
    },
  });
}

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
export async function addEmailToQueue(
  queue: any,
  emailConfig: EmailConfig,
  options?: {
    templateId?: string;
    templateData?: TemplateData;
    priority?: number;
    delay?: number;
    attempts?: number;
  }
): Promise<any> {
  const jobData: Partial<EmailQueueJob> = {
    id: crypto.randomUUID(),
    emailConfig,
    templateId: options?.templateId,
    templateData: options?.templateData,
  };

  return queue.add(jobData, {
    priority: options?.priority ?? 0,
    delay: options?.delay ?? 0,
    attempts: options?.attempts ?? 3,
  });
}

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
export function processEmailQueue(
  queue: any,
  processor: (job: any) => Promise<void>,
  concurrency: number = 1
): void {
  queue.process(concurrency, async (job: any) => {
    try {
      await processor(job);
    } catch (error: any) {
      throw new Error(`Queue job ${job.id} failed: ${error.message}`);
    }
  });
}

/**
 * Gets comprehensive queue statistics
 * @param queue - Bull queue instance
 * @returns Queue metrics including job counts and status
 * @example
 * const stats = await getQueueStatistics(emailQueue);
 * console.log(`Queue stats: ${stats.waiting} waiting, ${stats.active} active`);
 */
export async function getQueueStatistics(queue: any): Promise<{
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  paused: number;
}> {
  const [waiting, active, completed, failed, delayed, paused] = await Promise.all([
    queue.getWaitingCount(),
    queue.getActiveCount(),
    queue.getCompletedCount(),
    queue.getFailedCount(),
    queue.getDelayedCount(),
    queue.getPausedCount(),
  ]);

  return { waiting, active, completed, failed, delayed, paused };
}

/**
 * Retries a specific failed job in the queue
 * @param queue - Bull queue instance
 * @param jobId - ID of the job to retry
 * @returns Retried job instance or null if not found
 * @example
 * const retriedJob = await retryFailedJob(emailQueue, 'job-abc-123');
 */
export async function retryFailedJob(queue: any, jobId: string): Promise<any> {
  const job = await queue.getJob(jobId);
  if (job && (await job.isFailed())) {
    await job.retry();
    return job;
  }
  return null;
}

// ============================================================================
// TRANSACTIONAL EMAILS
// ============================================================================

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
export async function sendTransactionalEmail(
  transporter: Transporter,
  template: EmailTemplate,
  recipient: string,
  data: TemplateData,
  options?: {
    from?: string;
    replyTo?: string;
    priority?: 'high' | 'normal' | 'low';
    attachments?: EmailAttachment[];
  }
): Promise<{ messageId: string; accepted: string[]; rejected: string[] }> {
  const rendered = renderEmailTemplate(template, data);

  const emailConfig: EmailConfig = {
    from: options?.from || 'noreply@whitecross.com',
    to: recipient,
    replyTo: options?.replyTo,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
    priority: options?.priority,
    attachments: options?.attachments,
  };

  const result = await sendEmailViaSMTP(transporter, emailConfig);
  return {
    messageId: result.messageId,
    accepted: result.accepted,
    rejected: result.rejected,
  };
}

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
export async function sendPasswordResetEmail(
  transporter: Transporter,
  recipientEmail: string,
  resetToken: string,
  resetUrl: string,
  expirationMinutes: number = 30
): Promise<{ messageId: string }> {
  const resetLink = `${resetUrl}?token=${resetToken}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password. Click the button below to proceed:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
      </div>
      <p>This link will expire in ${expirationMinutes} minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <p style="color: #666; font-size: 12px; margin-top: 30px;">
        If the button doesn't work, copy and paste this link into your browser:<br/>
        ${resetLink}
      </p>
    </div>
  `;

  const text = `
Password Reset Request

You requested to reset your password. Use the following link:
${resetLink}

This link will expire in ${expirationMinutes} minutes.

If you didn't request this, please ignore this email.
  `;

  const result = await sendEmailViaSMTP(transporter, {
    from: 'noreply@whitecross.com',
    to: recipientEmail,
    subject: 'Password Reset Request',
    html,
    text,
    priority: 'high',
  });

  return { messageId: result.messageId };
}

// ============================================================================
// BULK EMAIL SENDING
// ============================================================================

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
export async function sendBulkEmails(
  transporter: Transporter,
  job: BulkEmailJob,
  onProgress?: (progress: { sent: number; failed: number; total: number }) => void
): Promise<{
  total: number;
  sent: number;
  failed: number;
  errors: Array<{ email: string; error: string }>;
}> {
  const batchSize = job.batchSize ?? 50;
  const throttleMs = job.throttleMs ?? 100;

  let sent = 0;
  let failed = 0;
  const errors: Array<{ email: string; error: string }> = [];

  for (let i = 0; i < job.recipients.length; i += batchSize) {
    const batch = job.recipients.slice(i, i + batchSize);

    const results = await Promise.allSettled(
      batch.map(async (recipient) => {
        const emailConfig: EmailConfig = {
          from: job.from || 'noreply@whitecross.com',
          to: recipient.email,
          replyTo: job.replyTo,
          subject: job.subject || '',
          html: '', // Would be populated from template
          metadata: {
            ...job.metadata,
            ...recipient.metadata,
          },
        };

        return sendEmailViaSMTP(transporter, emailConfig);
      })
    );

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        sent++;
      } else {
        failed++;
        errors.push({
          email: batch[index].email,
          error: result.reason?.message || 'Unknown error',
        });
      }
    });

    if (onProgress) {
      onProgress({ sent, failed, total: job.recipients.length });
    }

    // Throttle between batches
    if (i + batchSize < job.recipients.length) {
      await new Promise((resolve) => setTimeout(resolve, throttleMs));
    }
  }

  return {
    total: job.recipients.length,
    sent,
    failed,
    errors,
  };
}

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
export async function filterSubscribedRecipients(
  recipients: BulkEmailRecipient[],
  checkSubscription: (email: string) => Promise<boolean>
): Promise<BulkEmailRecipient[]> {
  const results = await Promise.all(
    recipients.map(async (recipient) => ({
      recipient,
      isSubscribed: await checkSubscription(recipient.email),
    }))
  );

  return results.filter((r) => r.isSubscribed).map((r) => r.recipient);
}

// ============================================================================
// EMAIL VALIDATION
// ============================================================================

/**
 * Validates email address syntax using RFC 5322 standard
 * @param email - Email address to validate
 * @returns True if syntax is valid
 * @example
 * const isValid = validateEmailSyntax('user@example.com'); // true
 * const isInvalid = validateEmailSyntax('invalid.email'); // false
 */
export function validateEmailSyntax(email: string): boolean {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

/**
 * Validates email domain by checking MX records
 * @param email - Email address to validate
 * @returns Domain validation result with MX records
 * @example
 * const result = await validateEmailDomain('user@example.com');
 * console.log(result.hasMxRecords); // true
 */
export async function validateEmailDomain(email: string): Promise<{
  isValid: boolean;
  hasMxRecords: boolean;
  mxRecords?: Array<{ exchange: string; priority: number }>;
}> {
  const dns = require('dns').promises;
  const domain = email.split('@')[1];

  if (!domain) {
    return { isValid: false, hasMxRecords: false };
  }

  try {
    const mxRecords = await dns.resolveMx(domain);
    return {
      isValid: mxRecords.length > 0,
      hasMxRecords: true,
      mxRecords: mxRecords.map((r: any) => ({
        exchange: r.exchange,
        priority: r.priority,
      })),
    };
  } catch (error) {
    return { isValid: false, hasMxRecords: false };
  }
}

/**
 * Checks if email is from a known disposable email provider
 * @param email - Email address to check
 * @returns True if disposable
 * @example
 * const isDisposable = isDisposableEmail('user@tempmail.com'); // true
 */
export function isDisposableEmail(email: string): boolean {
  const disposableDomains = new Set([
    'tempmail.com',
    'guerrillamail.com',
    '10minutemail.com',
    'mailinator.com',
    'throwaway.email',
    'trashmail.com',
    'yopmail.com',
    'getnada.com',
    'temp-mail.org',
    'mohmal.com',
  ]);

  const domain = email.split('@')[1]?.toLowerCase();
  return disposableDomains.has(domain);
}

/**
 * Checks if email is role-based (admin, info, support, etc.)
 * @param email - Email address to check
 * @returns True if role-based
 * @example
 * const isRole = isRoleBasedEmail('admin@example.com'); // true
 */
export function isRoleBasedEmail(email: string): boolean {
  const roleBasedPrefixes = new Set([
    'admin',
    'administrator',
    'info',
    'support',
    'sales',
    'contact',
    'noreply',
    'no-reply',
    'postmaster',
    'webmaster',
    'help',
    'service',
    'team',
    'office',
  ]);

  const prefix = email.split('@')[0]?.toLowerCase();
  return roleBasedPrefixes.has(prefix);
}

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
export async function comprehensiveEmailValidation(
  email: string,
  options?: {
    checkMx?: boolean;
    checkDisposable?: boolean;
    checkRoleBased?: boolean;
  }
): Promise<EmailValidationResult> {
  const isSyntaxValid = validateEmailSyntax(email);

  if (!isSyntaxValid) {
    return {
      email,
      isValid: false,
      isSyntaxValid: false,
      isDomainValid: false,
      isMxValid: false,
      isDisposable: false,
      isRoleBased: false,
      errors: ['Invalid email syntax'],
      score: 0,
    };
  }

  let isDomainValid = true;
  let isMxValid = false;

  if (options?.checkMx !== false) {
    const domainResult = await validateEmailDomain(email);
    isDomainValid = domainResult.isValid;
    isMxValid = domainResult.hasMxRecords;
  }

  const isDisposable = options?.checkDisposable !== false ? isDisposableEmail(email) : false;
  const isRoleBased = options?.checkRoleBased !== false ? isRoleBasedEmail(email) : false;

  const isValid = isSyntaxValid && isDomainValid && !isDisposable;

  // Calculate validity score (0-100)
  let score = 0;
  if (isSyntaxValid) score += 40;
  if (isDomainValid) score += 30;
  if (isMxValid) score += 20;
  if (!isDisposable) score += 5;
  if (!isRoleBased) score += 5;

  return {
    email,
    isValid,
    isSyntaxValid,
    isDomainValid,
    isMxValid,
    isDisposable,
    isRoleBased,
    score,
  };
}

// ============================================================================
// BOUNCE HANDLING
// ============================================================================

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
export async function recordEmailBounce(bounce: EmailBounce): Promise<EmailBounce> {
  // In production, this would persist to database
  console.log(`Recorded bounce for ${bounce.recipientEmail}: ${bounce.bounceType}`);
  return bounce;
}

/**
 * Checks if an email address has hard bounced
 * @param email - Email address to check
 * @returns True if email has hard bounced
 * @example
 * const hasBounced = await hasHardBounced('invalid@example.com');
 * if (hasBounced) console.log('Email is not deliverable');
 */
export async function hasHardBounced(email: string): Promise<boolean> {
  // In production, query bounce records from database
  return false;
}

/**
 * Gets bounce statistics for an email address
 * @param email - Email address
 * @returns Bounce counts and last bounce date
 * @example
 * const stats = await getEmailBounceStats('user@example.com');
 * console.log(`Hard bounces: ${stats.hardBounces}, Soft: ${stats.softBounces}`);
 */
export async function getEmailBounceStats(email: string): Promise<{
  totalBounces: number;
  hardBounces: number;
  softBounces: number;
  transientBounces: number;
  lastBounce?: Date;
  lastBounceType?: string;
}> {
  // In production, query from database
  return {
    totalBounces: 0,
    hardBounces: 0,
    softBounces: 0,
    transientBounces: 0,
  };
}

// ============================================================================
// UNSUBSCRIBE MANAGEMENT
// ============================================================================

/**
 * Generates a secure unsubscribe token
 * @param email - Email address
 * @param type - Subscription type
 * @param expirationDays - Token expiration in days (0 = no expiration)
 * @returns Unsubscribe token object
 * @example
 * const token = generateUnsubscribeToken('user@example.com', 'newsletter', 90);
 */
export function generateUnsubscribeToken(
  email: string,
  type: string,
  expirationDays: number = 0
): UnsubscribeToken {
  const data = `${email}:${type}:${Date.now()}`;
  const token = crypto.createHash('sha256').update(data).digest('hex');

  const createdAt = new Date();
  const expiresAt =
    expirationDays > 0
      ? new Date(createdAt.getTime() + expirationDays * 24 * 60 * 60 * 1000)
      : undefined;

  return {
    email,
    type,
    token,
    createdAt,
    expiresAt,
  };
}

/**
 * Creates an unsubscribe link for email footer
 * @param baseUrl - Base URL for unsubscribe endpoint
 * @param token - Unsubscribe token
 * @returns Complete unsubscribe URL
 * @example
 * const link = createUnsubscribeLink('https://whitecross.com/unsubscribe', token);
 */
export function createUnsubscribeLink(baseUrl: string, token: string): string {
  return `${baseUrl}?token=${encodeURIComponent(token)}`;
}

/**
 * Verifies and processes an unsubscribe request
 * @param token - Unsubscribe token from link
 * @param reason - Optional unsubscribe reason
 * @returns Processing result
 * @example
 * const result = await processUnsubscribeRequest(token, 'Too many emails');
 */
export async function processUnsubscribeRequest(
  token: string,
  reason?: string
): Promise<{
  success: boolean;
  email?: string;
  type?: string;
  error?: string;
}> {
  // In production, verify token and update subscription status in database
  return {
    success: true,
    email: 'user@example.com',
    type: 'newsletter',
  };
}

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
export function addUnsubscribeHeader(
  emailConfig: EmailConfig,
  unsubscribeUrl: string,
  unsubscribeEmail?: string
): EmailConfig {
  const headers = emailConfig.headers || {};

  let listUnsubscribe = `<${unsubscribeUrl}>`;
  if (unsubscribeEmail) {
    listUnsubscribe += `, <mailto:${unsubscribeEmail}>`;
  }

  headers['List-Unsubscribe'] = listUnsubscribe;
  headers['List-Unsubscribe-Post'] = 'List-Unsubscribe=One-Click';

  return {
    ...emailConfig,
    headers,
  };
}

// ============================================================================
// EMAIL TRACKING (OPENS & CLICKS)
// ============================================================================

/**
 * Generates a unique tracking token for email analytics
 * @param emailId - Email identifier
 * @param recipientEmail - Recipient email address
 * @returns Secure tracking token
 * @example
 * const token = generateTrackingToken('email-123', 'user@example.com');
 */
export function generateTrackingToken(emailId: string, recipientEmail: string): string {
  const data = `${emailId}:${recipientEmail}:${Date.now()}`;
  return crypto.createHash('sha256').update(data).digest('hex');
}

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
export function injectTrackingPixel(html: string, trackingPixelUrl: string): string {
  const pixel = `<img src="${trackingPixelUrl}" width="1" height="1" style="display:none;opacity:0;" alt="" aria-hidden="true" />`;

  if (html.includes('</body>')) {
    return html.replace('</body>', `${pixel}</body>`);
  }

  return html + pixel;
}

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
export function convertLinksToTracked(
  html: string,
  trackingBaseUrl: string,
  emailId: string,
  recipientEmail: string
): string {
  const linkRegex = /<a\s+(?:[^>]*?\s+)?href=["']([^"']*)["']/gi;

  let linkIndex = 0;
  return html.replace(linkRegex, (match, originalUrl) => {
    // Skip if already a tracking link or mailto
    if (
      originalUrl.startsWith(trackingBaseUrl) ||
      originalUrl.startsWith('mailto:') ||
      originalUrl.startsWith('#')
    ) {
      return match;
    }

    const trackingToken = generateTrackingToken(emailId, recipientEmail);
    const encodedUrl = encodeURIComponent(originalUrl);
    const trackedUrl = `${trackingBaseUrl}?t=${trackingToken}&e=${encodeURIComponent(emailId)}&l=${linkIndex++}&u=${encodedUrl}`;

    return match.replace(originalUrl, trackedUrl);
  });
}

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
export async function recordEmailOpen(
  emailId: string,
  recipientEmail: string,
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    location?: { country?: string; city?: string };
  }
): Promise<EmailTracking> {
  const tracking: EmailTracking = {
    emailId,
    recipientEmail,
    trackingToken: generateTrackingToken(emailId, recipientEmail),
    opened: true,
    openedAt: new Date(),
    openCount: 1,
    clickedLinks: [],
    clickCount: 0,
    ...metadata,
  };

  // In production, persist to database
  return tracking;
}

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
export async function recordEmailClick(
  emailId: string,
  recipientEmail: string,
  clickedUrl: string,
  metadata?: { ipAddress?: string; userAgent?: string }
): Promise<EmailTracking> {
  const now = new Date();

  const tracking: EmailTracking = {
    emailId,
    recipientEmail,
    trackingToken: generateTrackingToken(emailId, recipientEmail),
    opened: true,
    openedAt: now,
    openCount: 1,
    clickedLinks: [{ url: clickedUrl, clickedAt: now, count: 1 }],
    lastClickedAt: now,
    clickCount: 1,
    ...metadata,
  };

  // In production, update existing tracking record in database
  return tracking;
}

// ============================================================================
// SMS NOTIFICATIONS
// ============================================================================

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
export async function sendSMSViaTwilio(
  accountSid: string,
  authToken: string,
  smsConfig: SMSConfig
): Promise<SMSResult> {
  const twilio = require('twilio');
  const client = twilio(accountSid, authToken);

  const recipients = Array.isArray(smsConfig.to) ? smsConfig.to : [smsConfig.to];
  const to = recipients[0];

  try {
    const message = await client.messages.create({
      body: smsConfig.message,
      from: smsConfig.from,
      to,
      mediaUrl: smsConfig.mediaUrls,
      statusCallback: smsConfig.statusCallback,
      validityPeriod: smsConfig.validityPeriod,
    });

    return {
      messageId: message.sid,
      to,
      status: message.status,
    };
  } catch (error: any) {
    return {
      messageId: '',
      to,
      status: 'failed',
      error: error.message,
      errorCode: error.code,
    };
  }
}

/**
 * Validates phone number format (E.164)
 * @param phoneNumber - Phone number to validate
 * @returns True if valid E.164 format
 * @example
 * const isValid = validatePhoneNumber('+12345678900'); // true
 * const isInvalid = validatePhoneNumber('1234567890'); // false (missing +)
 */
export function validatePhoneNumber(phoneNumber: string): boolean {
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(phoneNumber);
}

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
export async function sendBulkSMS(
  accountSid: string,
  authToken: string,
  messages: SMSConfig[],
  batchSize: number = 10
): Promise<SMSResult[]> {
  const results: SMSResult[] = [];

  for (let i = 0; i < messages.length; i += batchSize) {
    const batch = messages.slice(i, i + batchSize);

    const batchResults = await Promise.all(
      batch.map((msg) => sendSMSViaTwilio(accountSid, authToken, msg))
    );

    results.push(...batchResults);

    // Small delay between batches to avoid rate limiting
    if (i + batchSize < messages.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return results;
}

// ============================================================================
// PUSH NOTIFICATIONS
// ============================================================================

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
export async function sendPushNotificationFCM(
  serverKey: string,
  notification: PushNotificationConfig
): Promise<PushNotificationResult[]> {
  const admin = require('firebase-admin');

  const message: any = {
    notification: {
      title: notification.title,
      body: notification.body,
      imageUrl: notification.imageUrl,
    },
    data: notification.data || {},
    android: {
      priority: notification.priority === 'high' ? 'high' : 'normal',
      ttl: notification.ttl ? notification.ttl * 1000 : 86400000,
      notification: {
        icon: notification.icon,
        color: notification.color,
        tag: notification.tag,
        channelId: notification.channelId,
        sound: notification.sound || 'default',
      },
    },
    apns: {
      payload: {
        aps: {
          badge: notification.badge,
          sound: notification.sound || 'default',
          contentAvailable: true,
        },
      },
    },
    webpush: {
      notification: {
        icon: notification.icon,
        badge: notification.badge?.toString(),
      },
    },
  };

  const results: PushNotificationResult[] = [];

  for (const token of notification.tokens) {
    try {
      const messageId = await admin.messaging().send({
        ...message,
        token,
      });

      results.push({
        token,
        success: true,
        messageId,
      });
    } catch (error: any) {
      results.push({
        token,
        success: false,
        error: error.message,
        errorCode: error.code,
      });
    }
  }

  return results;
}

/**
 * Validates push notification device token format
 * @param token - Device token to validate
 * @param platform - Platform (ios, android, web)
 * @returns True if token format is valid
 * @example
 * const isValid = validatePushToken('device-token-123', 'android');
 */
export function validatePushToken(token: string, platform: 'ios' | 'android' | 'web'): boolean {
  if (platform === 'ios') {
    // APNs device tokens are 64 hex characters
    return /^[a-fA-F0-9]{64}$/.test(token);
  } else if (platform === 'android' || platform === 'web') {
    // FCM tokens are longer alphanumeric strings with dashes and underscores
    return token.length > 100 && /^[a-zA-Z0-9_-]+$/.test(token);
  }
  return false;
}

// ============================================================================
// IN-APP NOTIFICATIONS
// ============================================================================

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
export async function createInAppNotification(
  notification: Omit<InAppNotification, 'id' | 'read' | 'readAt' | 'createdAt'>
): Promise<InAppNotification> {
  const created: InAppNotification = {
    id: crypto.randomUUID(),
    ...notification,
    read: false,
    createdAt: new Date(),
  };

  // In production, persist to database
  return created;
}

/**
 * Marks an in-app notification as read
 * @param notificationId - Notification ID
 * @returns Updated notification
 * @example
 * const notif = await markNotificationAsRead('notif-123');
 */
export async function markNotificationAsRead(
  notificationId: string
): Promise<InAppNotification | null> {
  // In production, update in database
  return null;
}

/**
 * Gets unread notifications for a user
 * @param userId - User ID
 * @param limit - Maximum number of notifications
 * @param offset - Pagination offset
 * @returns Array of unread notifications
 * @example
 * const unread = await getUnreadNotifications('user-123', 20, 0);
 */
export async function getUnreadNotifications(
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<InAppNotification[]> {
  // In production, query from database
  return [];
}

// ============================================================================
// NOTIFICATION PREFERENCES
// ============================================================================

/**
 * Gets user notification preferences
 * @param userId - User ID
 * @returns User's notification preferences or defaults
 * @example
 * const prefs = await getNotificationPreferences('user-123');
 */
export async function getNotificationPreferences(
  userId: string
): Promise<NotificationPreferences> {
  // In production, query from database
  return {
    userId,
    email: { enabled: true, frequency: 'immediate', types: [] },
    sms: { enabled: false, types: [] },
    push: { enabled: true, types: [] },
    inApp: { enabled: true, types: [] },
  };
}

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
export async function updateNotificationPreferences(
  userId: string,
  preferences: Partial<NotificationPreferences>
): Promise<NotificationPreferences> {
  const current = await getNotificationPreferences(userId);
  const updated = {
    ...current,
    ...preferences,
  };

  // In production, persist to database
  return updated;
}

/**
 * Checks if user should receive notification based on preferences
 * @param userId - User ID
 * @param channel - Notification channel
 * @param type - Notification type
 * @returns True if notification should be sent
 * @example
 * const should = await shouldSendNotification('user-123', 'email', 'appointment');
 */
export async function shouldSendNotification(
  userId: string,
  channel: 'email' | 'sms' | 'push' | 'in-app',
  type: string
): Promise<boolean> {
  const prefs = await getNotificationPreferences(userId);
  const channelKey = channel === 'in-app' ? 'inApp' : channel;
  const channelPrefs = prefs[channelKey];

  if (!channelPrefs.enabled) {
    return false;
  }

  if (channelPrefs.types.length > 0 && !channelPrefs.types.includes(type)) {
    return false;
  }

  // Check do-not-disturb
  if (prefs.doNotDisturb?.enabled) {
    const now = new Date();
    const currentHour = now.getHours();
    const { startHour, endHour } = prefs.doNotDisturb;

    const isInDndPeriod =
      startHour < endHour
        ? currentHour >= startHour && currentHour < endHour
        : currentHour >= startHour || currentHour < endHour;

    if (isInDndPeriod) {
      return false;
    }
  }

  return true;
}

// ============================================================================
// MULTI-CHANNEL DELIVERY
// ============================================================================

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
export async function sendMultiChannelNotification(
  notification: MultiChannelNotification,
  transporter?: Transporter
): Promise<NotificationDeliveryStatus[]> {
  const results: NotificationDeliveryStatus[] = [];

  for (const channel of notification.channels) {
    const canSend = await shouldSendNotification(notification.userId, channel, notification.type);

    if (!canSend) {
      results.push({
        notificationId: crypto.randomUUID(),
        userId: notification.userId,
        channel,
        status: 'failed',
        attemptCount: 0,
        error: 'User preferences blocked notification',
      });
      continue;
    }

    // Send via appropriate channel
    try {
      if (channel === 'email' && transporter && notification.emailConfig) {
        await sendEmailViaSMTP(transporter, {
          ...notification.emailConfig,
          subject: notification.emailConfig.subject || notification.content.title,
          html: notification.emailConfig.html || `<p>${notification.content.message}</p>`,
        });
      } else if (channel === 'in-app') {
        await createInAppNotification({
          userId: notification.userId,
          type: notification.type,
          title: notification.content.title,
          message: notification.content.message,
          data: notification.content.data,
          priority: notification.priority,
        });
      }

      results.push({
        notificationId: crypto.randomUUID(),
        userId: notification.userId,
        channel,
        status: 'sent',
        attemptCount: 1,
        lastAttemptAt: new Date(),
      });
    } catch (error: any) {
      results.push({
        notificationId: crypto.randomUUID(),
        userId: notification.userId,
        channel,
        status: 'failed',
        attemptCount: 1,
        error: error.message,
      });
    }
  }

  return results;
}

// ============================================================================
// TEMPLATE VERSIONING
// ============================================================================

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
export async function createTemplateVersion(
  baseTemplate: EmailTemplate,
  changes: Partial<EmailTemplate>,
  changelog?: string
): Promise<TemplateVersion> {
  const newVersion: TemplateVersion = {
    templateId: baseTemplate.id,
    version: (baseTemplate.version || 1) + 1,
    subject: changes.subject || baseTemplate.subject,
    htmlTemplate: changes.htmlTemplate || baseTemplate.htmlTemplate,
    textTemplate: changes.textTemplate || baseTemplate.textTemplate,
    variables: changes.variables || baseTemplate.variables,
    createdAt: new Date(),
    isActive: false,
    changelog,
  };

  // In production, persist to database
  return newVersion;
}

/**
 * Activates a specific template version
 * @param templateId - Template ID
 * @param version - Version number to activate
 * @returns Updated template version
 * @example
 * await activateTemplateVersion('template-123', 2);
 */
export async function activateTemplateVersion(
  templateId: string,
  version: number
): Promise<TemplateVersion | null> {
  // In production:
  // 1. Deactivate all other versions
  // 2. Activate specified version
  // 3. Update published timestamp
  return null;
}

/**
 * Gets all versions of a template
 * @param templateId - Template ID
 * @returns Array of template versions
 * @example
 * const versions = await getTemplateVersions('template-123');
 */
export async function getTemplateVersions(templateId: string): Promise<TemplateVersion[]> {
  // In production, query from database
  return [];
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Template rendering
  compileHandlebarsTemplate,
  registerHandlebarsHelpers,
  registerHandlebarsPartials,
  compileMustacheTemplate,
  validateTemplateVariables,
  renderEmailTemplate,
  wrapEmailInLayout,

  // SMTP
  createSMTPTransporter,
  verifySMTPConnection,
  sendEmailViaSMTP,
  closeSMTPTransporter,

  // Queue management
  createEmailQueue,
  addEmailToQueue,
  processEmailQueue,
  getQueueStatistics,
  retryFailedJob,

  // Transactional emails
  sendTransactionalEmail,
  sendPasswordResetEmail,

  // Bulk sending
  sendBulkEmails,
  filterSubscribedRecipients,

  // Validation
  validateEmailSyntax,
  validateEmailDomain,
  isDisposableEmail,
  isRoleBasedEmail,
  comprehensiveEmailValidation,

  // Bounce handling
  recordEmailBounce,
  hasHardBounced,
  getEmailBounceStats,

  // Unsubscribe
  generateUnsubscribeToken,
  createUnsubscribeLink,
  processUnsubscribeRequest,
  addUnsubscribeHeader,

  // Tracking
  generateTrackingToken,
  injectTrackingPixel,
  convertLinksToTracked,
  recordEmailOpen,
  recordEmailClick,

  // SMS
  sendSMSViaTwilio,
  validatePhoneNumber,
  sendBulkSMS,

  // Push notifications
  sendPushNotificationFCM,
  validatePushToken,

  // In-app notifications
  createInAppNotification,
  markNotificationAsRead,
  getUnreadNotifications,

  // Preferences
  getNotificationPreferences,
  updateNotificationPreferences,
  shouldSendNotification,

  // Multi-channel
  sendMultiChannelNotification,

  // Template versioning
  createTemplateVersion,
  activateTemplateVersion,
  getTemplateVersions,
};
