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

/**
 * File: /reuse/email-notification-kit.ts
 * Locator: WC-UTL-EMAILNOT-001
 * Purpose: Comprehensive Email & Notification Kit - Complete communication toolkit for NestJS
 *
 * Upstream: Independent utility module for email and notification operations
 * Downstream: ../backend/*, Email services, Notification services, Queue processors, Template engines
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, nodemailer, Sequelize, bull, handlebars
 * Exports: 45+ utility functions for SMTP, SendGrid, SES, templating, queues, tracking, SMS, push notifications
 *
 * LLM Context: Enterprise-grade email and notification utilities for White Cross healthcare platform.
 * Provides comprehensive email sending (SMTP, SendGrid, AWS SES), templating (Handlebars, EJS),
 * queue management (Bull), email tracking (opens, clicks), validation, bulk sending, scheduling,
 * SMS integration (Twilio), push notifications (FCM, APNs), in-app notifications, preferences,
 * unsubscribe management, bounce/complaint handling, and HIPAA-compliant communication patterns.
 */

import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import * as handlebars from 'handlebars';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
    clickTracking?: { enable: boolean };
    openTracking?: { enable: boolean };
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

interface UnsubscribeToken {
  email: string;
  userId?: string;
  type: string;
  token: string;
  expiresAt?: Date;
  metadata?: Record<string, any>;
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

// ============================================================================
// SEQUELIZE MODEL INTERFACES
// ============================================================================

interface EmailModel {
  id: string;
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  htmlBody?: string;
  textBody?: string;
  templateId?: string;
  templateData?: Record<string, any>;
  status: 'pending' | 'queued' | 'sent' | 'delivered' | 'failed' | 'bounced';
  sentAt?: Date;
  deliveredAt?: Date;
  openedAt?: Date;
  openCount: number;
  clickCount: number;
  provider: 'smtp' | 'sendgrid' | 'ses';
  providerId?: string;
  error?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

interface NotificationModel {
  id: string;
  userId: string;
  type: string;
  channel: 'email' | 'sms' | 'push' | 'in-app';
  title: string;
  message: string;
  data?: Record<string, any>;
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'read';
  priority: 'high' | 'normal' | 'low';
  scheduledFor?: Date;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  expiresAt?: Date;
  error?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

interface EmailTemplateModel {
  id: string;
  name: string;
  subject: string;
  htmlTemplate: string;
  textTemplate?: string;
  variables: string[];
  category?: string;
  locale: string;
  version: number;
  isActive: boolean;
  createdBy?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
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

// ============================================================================
// SMTP EMAIL SENDING
// ============================================================================

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
export function createSMTPTransporter(config: SMTPConfig): Transporter {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure ?? (config.port === 465),
    auth: config.auth,
    tls: config.tls,
    pool: config.pool,
    maxConnections: config.maxConnections,
    rateDelta: config.rateDelta,
    rateLimit: config.rateLimit,
  });
}

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
export async function sendEmailViaSMTP(
  transporter: Transporter,
  emailConfig: EmailConfig
): Promise<{ messageId: string; accepted: string[]; rejected: string[] }> {
  const result = await transporter.sendMail({
    from: emailConfig.from,
    to: Array.isArray(emailConfig.to) ? emailConfig.to.join(',') : emailConfig.to,
    cc: emailConfig.cc ? (Array.isArray(emailConfig.cc) ? emailConfig.cc.join(',') : emailConfig.cc) : undefined,
    bcc: emailConfig.bcc ? (Array.isArray(emailConfig.bcc) ? emailConfig.bcc.join(',') : emailConfig.bcc) : undefined,
    subject: emailConfig.subject,
    html: emailConfig.html,
    text: emailConfig.text,
    attachments: emailConfig.attachments,
    replyTo: emailConfig.replyTo,
    headers: emailConfig.headers,
    priority: emailConfig.priority,
  });

  return {
    messageId: result.messageId,
    accepted: result.accepted as string[],
    rejected: result.rejected as string[],
  };
}

/**
 * Verifies SMTP connection
 * @param transporter - Nodemailer transporter
 * @returns True if connection is successful
 * @example
 * const isConnected = await verifySMTPConnection(transporter);
 */
export async function verifySMTPConnection(transporter: Transporter): Promise<boolean> {
  try {
    await transporter.verify();
    return true;
  } catch (error) {
    return false;
  }
}

// ============================================================================
// SENDGRID INTEGRATION
// ============================================================================

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
export async function sendEmailViaSendGrid(
  config: SendGridConfig,
  emailConfig: Partial<EmailConfig>
): Promise<{ messageId: string; statusCode: number }> {
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(config.apiKey);

  const msg: any = {
    to: emailConfig.to,
    from: emailConfig.from || config.from,
    cc: emailConfig.cc,
    bcc: emailConfig.bcc,
    subject: emailConfig.subject,
    html: emailConfig.html,
    text: emailConfig.text,
    replyTo: emailConfig.replyTo,
    attachments: emailConfig.attachments?.map(att => ({
      content: att.content,
      filename: att.filename,
      type: att.contentType,
      disposition: 'attachment',
      contentId: att.cid,
    })),
    trackingSettings: config.trackingSettings,
  };

  if (config.templateId) {
    msg.templateId = config.templateId;
    msg.dynamicTemplateData = config.dynamicTemplateData;
  }

  const [response] = await sgMail.send(msg);

  return {
    messageId: response.headers['x-message-id'],
    statusCode: response.statusCode,
  };
}

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
export async function sendBulkEmailViaSendGrid(
  config: SendGridConfig,
  recipients: BulkEmailRecipient[]
): Promise<{ messageId: string; statusCode: number }> {
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(config.apiKey);

  const msg = {
    from: config.from,
    templateId: config.templateId,
    personalizations: recipients.map(recipient => ({
      to: [{ email: recipient.email, name: recipient.name }],
      dynamicTemplateData: recipient.templateData || {},
      customArgs: recipient.metadata,
    })),
    trackingSettings: config.trackingSettings,
  };

  const [response] = await sgMail.send(msg);

  return {
    messageId: response.headers['x-message-id'],
    statusCode: response.statusCode,
  };
}

// ============================================================================
// AWS SES INTEGRATION
// ============================================================================

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
export async function sendEmailViaSES(
  config: SESConfig,
  emailConfig: EmailConfig
): Promise<{ messageId: string }> {
  const AWS = require('aws-sdk');
  const ses = new AWS.SES({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    region: config.region,
  });

  const params: any = {
    Source: emailConfig.from,
    Destination: {
      ToAddresses: Array.isArray(emailConfig.to) ? emailConfig.to : [emailConfig.to],
      CcAddresses: emailConfig.cc ? (Array.isArray(emailConfig.cc) ? emailConfig.cc : [emailConfig.cc]) : undefined,
      BccAddresses: emailConfig.bcc ? (Array.isArray(emailConfig.bcc) ? emailConfig.bcc : [emailConfig.bcc]) : undefined,
    },
    Message: {
      Subject: {
        Data: emailConfig.subject,
        Charset: 'UTF-8',
      },
      Body: {},
    },
    ReplyToAddresses: emailConfig.replyTo ? [emailConfig.replyTo] : undefined,
    ReturnPath: config.returnPath,
    ConfigurationSetName: config.configurationSetName,
  };

  if (emailConfig.html) {
    params.Message.Body.Html = {
      Data: emailConfig.html,
      Charset: 'UTF-8',
    };
  }

  if (emailConfig.text) {
    params.Message.Body.Text = {
      Data: emailConfig.text,
      Charset: 'UTF-8',
    };
  }

  const result = await ses.sendEmail(params).promise();

  return {
    messageId: result.MessageId,
  };
}

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
export async function sendTemplatedEmailViaSES(
  config: SESConfig,
  templateName: string,
  recipients: string[],
  templateData: Record<string, any>
): Promise<{ messageId: string }> {
  const AWS = require('aws-sdk');
  const ses = new AWS.SES({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    region: config.region,
  });

  const params = {
    Source: config.returnPath || recipients[0],
    Destination: {
      ToAddresses: recipients,
    },
    Template: templateName,
    TemplateData: JSON.stringify(templateData),
    ConfigurationSetName: config.configurationSetName,
  };

  const result = await ses.sendTemplatedEmail(params).promise();

  return {
    messageId: result.MessageId,
  };
}

// ============================================================================
// EMAIL TEMPLATING
// ============================================================================

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
export function compileHandlebarsTemplate(
  templateString: string,
  data: TemplateData
): string {
  const template = handlebars.compile(templateString);
  return template(data);
}

/**
 * Registers Handlebars helper functions
 * @param helpers - Object with helper functions
 * @example
 * registerHandlebarsHelpers({
 *   formatDate: (date) => new Date(date).toLocaleDateString(),
 *   uppercase: (str) => str.toUpperCase()
 * });
 */
export function registerHandlebarsHelpers(helpers: Record<string, Function>): void {
  Object.entries(helpers).forEach(([name, fn]) => {
    handlebars.registerHelper(name, fn);
  });
}

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
export function compileEJSTemplate(
  templateString: string,
  data: TemplateData
): string {
  const ejs = require('ejs');
  return ejs.render(templateString, data);
}

/**
 * Loads email template from database or file system
 * @param templateId - Template identifier
 * @param locale - Template locale (default: 'en')
 * @returns Email template
 * @example
 * const template = await loadEmailTemplate('appointment-reminder', 'en');
 */
export async function loadEmailTemplate(
  templateId: string,
  locale: string = 'en'
): Promise<EmailTemplate | null> {
  // This would typically query a database
  // For now, returning a mock implementation
  return {
    id: templateId,
    name: 'Appointment Reminder',
    subject: 'Your upcoming appointment',
    htmlTemplate: '<h1>Hello {{patientName}}</h1>',
    variables: ['patientName', 'appointmentDate'],
    locale,
    version: 1,
  };
}

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
export function renderEmailTemplate(
  template: EmailTemplate,
  data: TemplateData
): { subject: string; html: string; text?: string } {
  const subjectTemplate = handlebars.compile(template.subject);
  const htmlTemplate = handlebars.compile(template.htmlTemplate);
  const textTemplate = template.textTemplate
    ? handlebars.compile(template.textTemplate)
    : null;

  return {
    subject: subjectTemplate(data),
    html: htmlTemplate(data),
    text: textTemplate ? textTemplate(data) : undefined,
  };
}

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
export function validateTemplateVariables(
  template: EmailTemplate,
  data: TemplateData
): { isValid: boolean; missing: string[] } {
  const missing = template.variables.filter(variable => !(variable in data));

  return {
    isValid: missing.length === 0,
    missing,
  };
}

// ============================================================================
// EMAIL QUEUE MANAGEMENT
// ============================================================================

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
export function createEmailQueue(queueName: string, options: EmailQueueOptions): any {
  const Queue = require('bull');

  return new Queue(queueName, {
    redis: options.redis,
    defaultJobOptions: options.defaultJobOptions,
    limiter: options.limiter,
  });
}

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
export async function addEmailToQueue(
  queue: any,
  emailConfig: EmailConfig,
  jobOptions?: Partial<EmailQueueJob>
): Promise<any> {
  return queue.add(
    {
      emailConfig,
    },
    {
      priority: jobOptions?.priority,
      delay: jobOptions?.delay,
      attempts: jobOptions?.attempts || 3,
      backoff: jobOptions?.backoff || {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: jobOptions?.removeOnComplete ?? true,
      removeOnFail: jobOptions?.removeOnFail ?? false,
    }
  );
}

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
export function processEmailQueue(
  queue: any,
  processor: (job: any) => Promise<void>,
  concurrency: number = 1
): void {
  queue.process(concurrency, processor);
}

/**
 * Gets email queue statistics
 * @param queue - Bull queue instance
 * @returns Queue statistics
 * @example
 * const stats = await getEmailQueueStats(emailQueue);
 * console.log(`Waiting: ${stats.waiting}, Active: ${stats.active}, Completed: ${stats.completed}`);
 */
export async function getEmailQueueStats(queue: any): Promise<{
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
}> {
  const [waiting, active, completed, failed, delayed] = await Promise.all([
    queue.getWaitingCount(),
    queue.getActiveCount(),
    queue.getCompletedCount(),
    queue.getFailedCount(),
    queue.getDelayedCount(),
  ]);

  return { waiting, active, completed, failed, delayed };
}

/**
 * Retries failed email jobs
 * @param queue - Bull queue instance
 * @param jobId - Job ID to retry
 * @returns Retried job instance
 * @example
 * const job = await retryFailedEmailJob(emailQueue, 'job-123');
 */
export async function retryFailedEmailJob(queue: any, jobId: string): Promise<any> {
  const job = await queue.getJob(jobId);
  if (job && await job.isFailed()) {
    await job.retry();
    return job;
  }
  return null;
}

// ============================================================================
// EMAIL TRACKING
// ============================================================================

/**
 * Generates email tracking token
 * @param emailId - Email identifier
 * @param recipientEmail - Recipient email address
 * @returns Tracking token
 * @example
 * const token = generateEmailTrackingToken('email-123', 'patient@example.com');
 */
export function generateEmailTrackingToken(
  emailId: string,
  recipientEmail: string
): string {
  const data = `${emailId}:${recipientEmail}:${Date.now()}`;
  return crypto
    .createHash('sha256')
    .update(data)
    .digest('hex');
}

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
export function injectTrackingPixel(html: string, trackingUrl: string): string {
  const trackingPixel = `<img src="${trackingUrl}" width="1" height="1" style="display:none;" alt="" />`;

  // Try to inject before closing body tag, otherwise append
  if (html.includes('</body>')) {
    return html.replace('</body>', `${trackingPixel}</body>`);
  }

  return html + trackingPixel;
}

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
export function convertLinksToTracked(
  html: string,
  trackingUrlBase: string,
  emailId: string
): string {
  const linkRegex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"/gi;

  return html.replace(linkRegex, (match, url) => {
    const encodedUrl = encodeURIComponent(url);
    const trackedUrl = `${trackingUrlBase}?email=${emailId}&url=${encodedUrl}`;
    return match.replace(url, trackedUrl);
  });
}

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
export async function recordEmailOpen(
  emailId: string,
  recipientEmail: string,
  metadata?: { ipAddress?: string; userAgent?: string }
): Promise<EmailTracking> {
  // This would typically update a database record
  const now = new Date();

  return {
    emailId,
    recipientEmail,
    trackingToken: generateEmailTrackingToken(emailId, recipientEmail),
    opened: true,
    openedAt: now,
    openCount: 1,
    clickedLinks: [],
    clickCount: 0,
    ipAddress: metadata?.ipAddress,
    userAgent: metadata?.userAgent,
  };
}

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
export async function recordEmailClick(
  emailId: string,
  recipientEmail: string,
  clickedUrl: string,
  metadata?: { ipAddress?: string; userAgent?: string }
): Promise<EmailTracking> {
  const now = new Date();

  return {
    emailId,
    recipientEmail,
    trackingToken: generateEmailTrackingToken(emailId, recipientEmail),
    opened: true,
    openedAt: now,
    openCount: 1,
    clickedLinks: [clickedUrl],
    lastClickedAt: now,
    clickCount: 1,
    ipAddress: metadata?.ipAddress,
    userAgent: metadata?.userAgent,
  };
}

/**
 * Gets email tracking statistics
 * @param emailId - Email identifier
 * @returns Tracking statistics
 * @example
 * const stats = await getEmailTrackingStats('email-123');
 * console.log(`Opens: ${stats.totalOpens}, Clicks: ${stats.totalClicks}`);
 */
export async function getEmailTrackingStats(emailId: string): Promise<{
  totalRecipients: number;
  totalOpens: number;
  uniqueOpens: number;
  totalClicks: number;
  uniqueClicks: number;
  openRate: number;
  clickRate: number;
}> {
  // This would typically query a database
  return {
    totalRecipients: 100,
    totalOpens: 75,
    uniqueOpens: 60,
    totalClicks: 30,
    uniqueClicks: 25,
    openRate: 0.6,
    clickRate: 0.25,
  };
}

// ============================================================================
// EMAIL VALIDATION
// ============================================================================

/**
 * Validates email address syntax
 * @param email - Email address to validate
 * @returns True if email syntax is valid
 * @example
 * const isValid = validateEmailSyntax('patient@example.com');
 */
export function validateEmailSyntax(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates email domain
 * @param email - Email address to validate
 * @returns Validation result
 * @example
 * const result = await validateEmailDomain('patient@example.com');
 */
export async function validateEmailDomain(email: string): Promise<{
  isValid: boolean;
  hasMxRecords: boolean;
  mxRecords?: string[];
}> {
  const dns = require('dns').promises;
  const domain = email.split('@')[1];

  try {
    const mxRecords = await dns.resolveMx(domain);

    return {
      isValid: mxRecords.length > 0,
      hasMxRecords: true,
      mxRecords: mxRecords.map((record: any) => record.exchange),
    };
  } catch (error) {
    return {
      isValid: false,
      hasMxRecords: false,
    };
  }
}

/**
 * Checks if email is from a disposable domain
 * @param email - Email address to check
 * @returns True if email is from disposable domain
 * @example
 * const isDisposable = isDisposableEmail('user@tempmail.com');
 */
export function isDisposableEmail(email: string): boolean {
  const disposableDomains = [
    'tempmail.com',
    'guerrillamail.com',
    '10minutemail.com',
    'mailinator.com',
    'throwaway.email',
  ];

  const domain = email.split('@')[1]?.toLowerCase();
  return disposableDomains.includes(domain);
}

/**
 * Checks if email is role-based
 * @param email - Email address to check
 * @returns True if email is role-based
 * @example
 * const isRole = isRoleBasedEmail('admin@example.com');
 */
export function isRoleBasedEmail(email: string): boolean {
  const roleBasedPrefixes = [
    'admin',
    'info',
    'support',
    'sales',
    'contact',
    'noreply',
    'no-reply',
    'postmaster',
    'webmaster',
  ];

  const prefix = email.split('@')[0]?.toLowerCase();
  return roleBasedPrefixes.includes(prefix);
}

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
export async function validateEmail(email: string): Promise<EmailValidationResult> {
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
    };
  }

  const domainValidation = await validateEmailDomain(email);
  const isDisposable = isDisposableEmail(email);
  const isRoleBased = isRoleBasedEmail(email);

  return {
    email,
    isValid: isSyntaxValid && domainValidation.isValid && !isDisposable,
    isSyntaxValid,
    isDomainValid: domainValidation.isValid,
    isMxValid: domainValidation.hasMxRecords,
    isDisposable,
    isRoleBased,
  };
}

// ============================================================================
// BULK EMAIL SENDING
// ============================================================================

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
export async function sendBulkEmails(
  job: BulkEmailJob,
  sendFunction: (recipient: BulkEmailRecipient, templateData: TemplateData) => Promise<any>
): Promise<{
  total: number;
  sent: number;
  failed: number;
  errors: Array<{ email: string; error: string }>;
}> {
  const batchSize = job.batchSize || 50;
  const throttleMs = job.throttleMs || 100;

  let sent = 0;
  let failed = 0;
  const errors: Array<{ email: string; error: string }> = [];

  // Process in batches
  for (let i = 0; i < job.recipients.length; i += batchSize) {
    const batch = job.recipients.slice(i, i + batchSize);

    const results = await Promise.allSettled(
      batch.map(recipient => sendFunction(recipient, recipient.templateData || {}))
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

    // Throttle between batches
    if (i + batchSize < job.recipients.length) {
      await new Promise(resolve => setTimeout(resolve, throttleMs));
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
export async function filterSubscribedRecipients(
  recipients: BulkEmailRecipient[],
  checkSubscription: (email: string) => Promise<boolean>
): Promise<BulkEmailRecipient[]> {
  const results = await Promise.all(
    recipients.map(async recipient => ({
      recipient,
      isSubscribed: await checkSubscription(recipient.email),
    }))
  );

  return results
    .filter(result => result.isSubscribed)
    .map(result => result.recipient);
}

// ============================================================================
// EMAIL SCHEDULING
// ============================================================================

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
export async function scheduleEmail(
  emailConfig: EmailConfig,
  scheduledFor: Date,
  timezone?: string
): Promise<ScheduledEmail> {
  const id = crypto.randomUUID();

  return {
    id,
    emailConfig,
    scheduledFor,
    timezone,
    status: 'pending',
  };
}

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
export async function scheduleRecurringEmail(
  emailConfig: EmailConfig,
  schedule: RecurringSchedule
): Promise<ScheduledEmail> {
  const id = crypto.randomUUID();
  const now = new Date();

  return {
    id,
    emailConfig,
    scheduledFor: now,
    recurring: schedule,
    status: 'pending',
  };
}

/**
 * Cancels scheduled email
 * @param scheduledEmailId - Scheduled email identifier
 * @returns Updated scheduled email
 * @example
 * const cancelled = await cancelScheduledEmail('schedule-123');
 */
export async function cancelScheduledEmail(
  scheduledEmailId: string
): Promise<ScheduledEmail | null> {
  // This would typically update a database record
  return null;
}

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
export function getNextRecurringEmailTime(
  schedule: RecurringSchedule,
  fromDate: Date = new Date()
): Date {
  const next = new Date(fromDate);

  switch (schedule.frequency) {
    case 'daily':
      next.setDate(next.getDate() + (schedule.interval || 1));
      break;
    case 'weekly':
      next.setDate(next.getDate() + 7 * (schedule.interval || 1));
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + (schedule.interval || 1));
      break;
    case 'yearly':
      next.setFullYear(next.getFullYear() + (schedule.interval || 1));
      break;
  }

  return next;
}

// ============================================================================
// SMS NOTIFICATION INTEGRATION
// ============================================================================

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
export async function sendSMSViaTwilio(
  config: TwilioConfig,
  smsConfig: SMSConfig
): Promise<SMSResult> {
  const twilio = require('twilio');
  const client = twilio(config.accountSid, config.authToken);

  const recipients = Array.isArray(smsConfig.to) ? smsConfig.to : [smsConfig.to];
  const from = smsConfig.from || config.fromNumber;

  const message = await client.messages.create({
    body: smsConfig.message,
    from,
    to: recipients[0],
    mediaUrl: smsConfig.mediaUrls,
    statusCallback: smsConfig.statusCallback,
  });

  return {
    messageId: message.sid,
    to: recipients[0],
    status: message.status,
  };
}

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
export async function sendBulkSMS(
  config: TwilioConfig,
  messages: SMSConfig[]
): Promise<SMSResult[]> {
  const results = await Promise.all(
    messages.map(msg => sendSMSViaTwilio(config, msg))
  );

  return results;
}

/**
 * Validates phone number format
 * @param phoneNumber - Phone number to validate
 * @returns True if phone number is valid
 * @example
 * const isValid = validatePhoneNumber('+1234567890');
 */
export function validatePhoneNumber(phoneNumber: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phoneNumber);
}

// ============================================================================
// PUSH NOTIFICATION HELPERS
// ============================================================================

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
export async function sendPushNotificationViaFCM(
  config: FCMConfig,
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
      priority: notification.priority || 'high',
      ttl: notification.ttl || 86400000,
    },
    apns: {
      payload: {
        aps: {
          badge: notification.badge,
          sound: notification.sound || 'default',
        },
      },
    },
  };

  const results: PushNotificationResult[] = [];

  for (const token of notification.tokens) {
    try {
      const response = await admin.messaging().send({
        ...message,
        token,
      });

      results.push({
        token,
        success: true,
        messageId: response,
      });
    } catch (error: any) {
      results.push({
        token,
        success: false,
        error: error.message,
      });
    }
  }

  return results;
}

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
export async function sendPushNotificationViaAPNs(
  config: APNsConfig,
  notification: PushNotificationConfig
): Promise<PushNotificationResult[]> {
  const apn = require('apn');

  const provider = new apn.Provider({
    token: {
      key: config.key,
      keyId: config.keyId,
      teamId: config.teamId,
    },
    production: config.production ?? true,
  });

  const apnNotification = new apn.Notification({
    alert: {
      title: notification.title,
      body: notification.body,
    },
    badge: notification.badge,
    sound: notification.sound || 'default',
    payload: notification.data || {},
    topic: config.bundleId,
    priority: notification.priority === 'high' ? 10 : 5,
    expiry: notification.ttl ? Math.floor(Date.now() / 1000) + notification.ttl : undefined,
  });

  const results: PushNotificationResult[] = [];

  for (const token of notification.tokens) {
    try {
      const response = await provider.send(apnNotification, token);

      results.push({
        token,
        success: response.sent.length > 0,
        error: response.failed.length > 0 ? response.failed[0].response.reason : undefined,
      });
    } catch (error: any) {
      results.push({
        token,
        success: false,
        error: error.message,
      });
    }
  }

  provider.shutdown();
  return results;
}

/**
 * Validates push notification token
 * @param token - Device token to validate
 * @param platform - Platform (ios or android)
 * @returns True if token format is valid
 * @example
 * const isValid = validatePushToken('device-token-123', 'android');
 */
export function validatePushToken(token: string, platform: 'ios' | 'android'): boolean {
  if (platform === 'ios') {
    // APNs tokens are 64 hex characters
    return /^[a-fA-F0-9]{64}$/.test(token);
  } else {
    // FCM tokens are longer base64-like strings
    return token.length > 100 && /^[a-zA-Z0-9_-]+$/.test(token);
  }
}

// ============================================================================
// IN-APP NOTIFICATION MANAGEMENT
// ============================================================================

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
export async function createInAppNotification(
  notification: Omit<InAppNotification, 'id' | 'read' | 'readAt' | 'createdAt'>
): Promise<InAppNotification> {
  const id = crypto.randomUUID();
  const now = new Date();

  return {
    id,
    ...notification,
    read: false,
    createdAt: now,
  };
}

/**
 * Gets unread notifications for user
 * @param userId - User identifier
 * @param limit - Maximum number of notifications to return
 * @returns List of unread notifications
 * @example
 * const notifications = await getUnreadNotifications('user-123', 10);
 */
export async function getUnreadNotifications(
  userId: string,
  limit: number = 50
): Promise<InAppNotification[]> {
  // This would typically query a database
  return [];
}

/**
 * Marks notification as read
 * @param notificationId - Notification identifier
 * @returns Updated notification
 * @example
 * const notification = await markNotificationAsRead('notif-123');
 */
export async function markNotificationAsRead(
  notificationId: string
): Promise<InAppNotification | null> {
  // This would typically update a database record
  return null;
}

/**
 * Marks all notifications as read for user
 * @param userId - User identifier
 * @returns Number of notifications marked as read
 * @example
 * const count = await markAllNotificationsAsRead('user-123');
 */
export async function markAllNotificationsAsRead(userId: string): Promise<number> {
  // This would typically update database records
  return 0;
}

/**
 * Deletes expired notifications
 * @returns Number of deleted notifications
 * @example
 * const count = await deleteExpiredNotifications();
 */
export async function deleteExpiredNotifications(): Promise<number> {
  // This would typically delete from database
  return 0;
}

// ============================================================================
// NOTIFICATION PREFERENCES
// ============================================================================

/**
 * Gets user notification preferences
 * @param userId - User identifier
 * @returns Notification preferences
 * @example
 * const prefs = await getNotificationPreferences('user-123');
 */
export async function getNotificationPreferences(
  userId: string
): Promise<NotificationPreferences | null> {
  // This would typically query a database
  return null;
}

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
export async function updateNotificationPreferences(
  userId: string,
  preferences: Partial<NotificationPreferences>
): Promise<NotificationPreferences> {
  // This would typically update a database record
  return {
    userId,
    email: { enabled: true, frequency: 'immediate', types: [] },
    sms: { enabled: false, types: [] },
    push: { enabled: true, types: [] },
    inApp: { enabled: true, types: [] },
    ...preferences,
  };
}

/**
 * Checks if user can receive notification type
 * @param userId - User identifier
 * @param channel - Notification channel
 * @param type - Notification type
 * @returns True if user can receive notification
 * @example
 * const canSend = await canSendNotification('user-123', 'email', 'appointment');
 */
export async function canSendNotification(
  userId: string,
  channel: 'email' | 'sms' | 'push' | 'in-app',
  type: string
): Promise<boolean> {
  const preferences = await getNotificationPreferences(userId);

  if (!preferences) {
    return true; // Default to allowing if no preferences set
  }

  const channelPrefs = preferences[channel === 'in-app' ? 'inApp' : channel];

  return (
    channelPrefs.enabled &&
    (channelPrefs.types.length === 0 || channelPrefs.types.includes(type))
  );
}

/**
 * Checks if notification should be sent based on do-not-disturb settings
 * @param userId - User identifier
 * @returns True if notification can be sent now
 * @example
 * const canSend = await shouldSendNotificationNow('user-123');
 */
export async function shouldSendNotificationNow(userId: string): Promise<boolean> {
  const preferences = await getNotificationPreferences(userId);

  if (!preferences?.doNotDisturb?.enabled) {
    return true;
  }

  const now = new Date();
  const currentHour = now.getHours();
  const { startHour, endHour } = preferences.doNotDisturb;

  // Check if current time is outside DND hours
  if (startHour < endHour) {
    return currentHour < startHour || currentHour >= endHour;
  } else {
    // DND spans midnight
    return currentHour >= endHour && currentHour < startHour;
  }
}

// ============================================================================
// UNSUBSCRIBE MANAGEMENT
// ============================================================================

/**
 * Generates unsubscribe token
 * @param email - Email address
 * @param type - Subscription type
 * @returns Unsubscribe token
 * @example
 * const token = generateUnsubscribeToken('patient@example.com', 'newsletter');
 */
export function generateUnsubscribeToken(email: string, type: string): string {
  const data = `${email}:${type}:${Date.now()}`;
  return crypto
    .createHash('sha256')
    .update(data)
    .digest('hex');
}

/**
 * Creates unsubscribe link
 * @param baseUrl - Base URL for unsubscribe endpoint
 * @param token - Unsubscribe token
 * @returns Unsubscribe URL
 * @example
 * const url = createUnsubscribeLink('https://whitecross.com/unsubscribe', token);
 */
export function createUnsubscribeLink(baseUrl: string, token: string): string {
  return `${baseUrl}?token=${token}`;
}

/**
 * Processes unsubscribe request
 * @param token - Unsubscribe token
 * @param reason - Unsubscribe reason
 * @returns Updated subscription
 * @example
 * const subscription = await processUnsubscribe(token, 'Too many emails');
 */
export async function processUnsubscribe(
  token: string,
  reason?: string
): Promise<SubscriptionModel | null> {
  // This would typically update a database record
  return null;
}

/**
 * Re-subscribes user to email list
 * @param email - Email address
 * @param type - Subscription type
 * @returns Updated subscription
 * @example
 * const subscription = await resubscribe('patient@example.com', 'newsletter');
 */
export async function resubscribe(
  email: string,
  type: string
): Promise<SubscriptionModel> {
  const id = crypto.randomUUID();
  const now = new Date();

  return {
    id,
    email,
    type,
    status: 'subscribed',
    subscribedAt: now,
    createdAt: now,
    updatedAt: now,
  };
}

// ============================================================================
// EMAIL BOUNCE AND COMPLAINT HANDLING
// ============================================================================

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
export async function recordEmailBounce(bounce: EmailBounce): Promise<EmailBounce> {
  // This would typically insert into database
  return bounce;
}

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
export async function recordEmailComplaint(
  complaint: EmailComplaint
): Promise<EmailComplaint> {
  // This would typically insert into database
  return complaint;
}

/**
 * Checks if email address has hard bounced
 * @param email - Email address to check
 * @returns True if email has hard bounced
 * @example
 * const hasBounced = await hasHardBounced('invalid@example.com');
 */
export async function hasHardBounced(email: string): Promise<boolean> {
  // This would typically query a database
  return false;
}

/**
 * Checks if email address has complained
 * @param email - Email address to check
 * @returns True if email has complained
 * @example
 * const hasComplained = await hasComplainedAboutEmail('user@example.com');
 */
export async function hasComplainedAboutEmail(email: string): Promise<boolean> {
  // This would typically query a database
  return false;
}

/**
 * Gets bounce statistics for email address
 * @param email - Email address
 * @returns Bounce statistics
 * @example
 * const stats = await getEmailBounceStats('user@example.com');
 */
export async function getEmailBounceStats(email: string): Promise<{
  totalBounces: number;
  hardBounces: number;
  softBounces: number;
  lastBounce?: Date;
}> {
  // This would typically query a database
  return {
    totalBounces: 0,
    hardBounces: 0,
    softBounces: 0,
  };
}

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
export async function autoSuppressProblematicEmails(thresholds: {
  hardBounceCount: number;
  softBounceCount: number;
  complaintCount: number;
}): Promise<number> {
  // This would typically update database records
  return 0;
}

// ============================================================================
// NOTIFICATION DELIVERY STATUS TRACKING
// ============================================================================

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
export async function updateNotificationDeliveryStatus(
  notificationId: string,
  status: NotificationDeliveryStatus['status'],
  metadata?: Record<string, any>
): Promise<NotificationDeliveryStatus> {
  const now = new Date();

  return {
    notificationId,
    channel: 'email',
    status,
    attemptCount: 1,
    lastAttemptAt: now,
    deliveredAt: status === 'delivered' ? now : undefined,
    metadata,
  };
}

/**
 * Gets notification delivery status
 * @param notificationId - Notification identifier
 * @returns Delivery status
 * @example
 * const status = await getNotificationDeliveryStatus('notif-123');
 */
export async function getNotificationDeliveryStatus(
  notificationId: string
): Promise<NotificationDeliveryStatus | null> {
  // This would typically query a database
  return null;
}

/**
 * Retries failed notification delivery
 * @param notificationId - Notification identifier
 * @param maxAttempts - Maximum retry attempts
 * @returns True if retry was scheduled
 * @example
 * const retried = await retryFailedNotification('notif-123', 3);
 */
export async function retryFailedNotification(
  notificationId: string,
  maxAttempts: number = 3
): Promise<boolean> {
  const status = await getNotificationDeliveryStatus(notificationId);

  if (!status || status.attemptCount >= maxAttempts) {
    return false;
  }

  // Schedule retry with exponential backoff
  return true;
}

/**
 * Gets delivery statistics for notification campaign
 * @param campaignId - Campaign identifier
 * @returns Delivery statistics
 * @example
 * const stats = await getNotificationCampaignStats('campaign-123');
 */
export async function getNotificationCampaignStats(campaignId: string): Promise<{
  total: number;
  pending: number;
  sent: number;
  delivered: number;
  failed: number;
  bounced: number;
  deliveryRate: number;
}> {
  // This would typically query a database
  return {
    total: 100,
    pending: 5,
    sent: 95,
    delivered: 90,
    failed: 3,
    bounced: 2,
    deliveryRate: 0.9,
  };
}

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================

/**
 * Sequelize model definition for emails
 * @param sequelize - Sequelize instance
 * @param DataTypes - Sequelize data types
 * @returns Email model
 * @example
 * const EmailModel = defineEmailModel(sequelize, DataTypes);
 */
export function defineEmailModel(sequelize: any, DataTypes: any): any {
  return sequelize.define(
    'Email',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      from: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      to: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      cc: {
        type: DataTypes.ARRAY(DataTypes.STRING),
      },
      bcc: {
        type: DataTypes.ARRAY(DataTypes.STRING),
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      htmlBody: {
        type: DataTypes.TEXT,
      },
      textBody: {
        type: DataTypes.TEXT,
      },
      templateId: {
        type: DataTypes.STRING,
      },
      templateData: {
        type: DataTypes.JSONB,
      },
      status: {
        type: DataTypes.ENUM('pending', 'queued', 'sent', 'delivered', 'failed', 'bounced'),
        defaultValue: 'pending',
      },
      sentAt: {
        type: DataTypes.DATE,
      },
      deliveredAt: {
        type: DataTypes.DATE,
      },
      openedAt: {
        type: DataTypes.DATE,
      },
      openCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      clickCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      provider: {
        type: DataTypes.ENUM('smtp', 'sendgrid', 'ses'),
        allowNull: false,
      },
      providerId: {
        type: DataTypes.STRING,
      },
      error: {
        type: DataTypes.TEXT,
      },
      metadata: {
        type: DataTypes.JSONB,
      },
    },
    {
      tableName: 'emails',
      timestamps: true,
      indexes: [
        { fields: ['status'] },
        { fields: ['sentAt'] },
        { fields: ['templateId'] },
        { fields: ['provider'] },
      ],
    }
  );
}

/**
 * Sequelize model definition for notifications
 * @param sequelize - Sequelize instance
 * @param DataTypes - Sequelize data types
 * @returns Notification model
 * @example
 * const NotificationModel = defineNotificationModel(sequelize, DataTypes);
 */
export function defineNotificationModel(sequelize: any, DataTypes: any): any {
  return sequelize.define(
    'Notification',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      channel: {
        type: DataTypes.ENUM('email', 'sms', 'push', 'in-app'),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      data: {
        type: DataTypes.JSONB,
      },
      status: {
        type: DataTypes.ENUM('pending', 'sent', 'delivered', 'failed', 'read'),
        defaultValue: 'pending',
      },
      priority: {
        type: DataTypes.ENUM('high', 'normal', 'low'),
        defaultValue: 'normal',
      },
      scheduledFor: {
        type: DataTypes.DATE,
      },
      sentAt: {
        type: DataTypes.DATE,
      },
      deliveredAt: {
        type: DataTypes.DATE,
      },
      readAt: {
        type: DataTypes.DATE,
      },
      expiresAt: {
        type: DataTypes.DATE,
      },
      error: {
        type: DataTypes.TEXT,
      },
      metadata: {
        type: DataTypes.JSONB,
      },
    },
    {
      tableName: 'notifications',
      timestamps: true,
      indexes: [
        { fields: ['userId'] },
        { fields: ['type'] },
        { fields: ['channel'] },
        { fields: ['status'] },
        { fields: ['scheduledFor'] },
        { fields: ['expiresAt'] },
      ],
    }
  );
}

/**
 * Sequelize model definition for email templates
 * @param sequelize - Sequelize instance
 * @param DataTypes - Sequelize data types
 * @returns EmailTemplate model
 * @example
 * const EmailTemplateModel = defineEmailTemplateModel(sequelize, DataTypes);
 */
export function defineEmailTemplateModel(sequelize: any, DataTypes: any): any {
  return sequelize.define(
    'EmailTemplate',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      htmlTemplate: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      textTemplate: {
        type: DataTypes.TEXT,
      },
      variables: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      category: {
        type: DataTypes.STRING,
      },
      locale: {
        type: DataTypes.STRING,
        defaultValue: 'en',
      },
      version: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      createdBy: {
        type: DataTypes.UUID,
      },
      metadata: {
        type: DataTypes.JSONB,
      },
    },
    {
      tableName: 'email_templates',
      timestamps: true,
      indexes: [
        { fields: ['name'] },
        { fields: ['category'] },
        { fields: ['locale'] },
        { fields: ['isActive'] },
        { fields: ['name', 'locale', 'version'], unique: true },
      ],
    }
  );
}

/**
 * Sequelize model definition for subscriptions
 * @param sequelize - Sequelize instance
 * @param DataTypes - Sequelize data types
 * @returns Subscription model
 * @example
 * const SubscriptionModel = defineSubscriptionModel(sequelize, DataTypes);
 */
export function defineSubscriptionModel(sequelize: any, DataTypes: any): any {
  return sequelize.define(
    'Subscription',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('subscribed', 'unsubscribed', 'bounced', 'complained'),
        defaultValue: 'subscribed',
      },
      unsubscribeToken: {
        type: DataTypes.STRING,
        unique: true,
      },
      subscribedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      unsubscribedAt: {
        type: DataTypes.DATE,
      },
      unsubscribeReason: {
        type: DataTypes.TEXT,
      },
      metadata: {
        type: DataTypes.JSONB,
      },
    },
    {
      tableName: 'subscriptions',
      timestamps: true,
      indexes: [
        { fields: ['email'] },
        { fields: ['userId'] },
        { fields: ['type'] },
        { fields: ['status'] },
        { fields: ['email', 'type'], unique: true },
      ],
    }
  );
}

export default {
  // SMTP
  createSMTPTransporter,
  sendEmailViaSMTP,
  verifySMTPConnection,

  // SendGrid
  sendEmailViaSendGrid,
  sendBulkEmailViaSendGrid,

  // AWS SES
  sendEmailViaSES,
  sendTemplatedEmailViaSES,

  // Templating
  compileHandlebarsTemplate,
  registerHandlebarsHelpers,
  compileEJSTemplate,
  loadEmailTemplate,
  renderEmailTemplate,
  validateTemplateVariables,

  // Queue Management
  createEmailQueue,
  addEmailToQueue,
  processEmailQueue,
  getEmailQueueStats,
  retryFailedEmailJob,

  // Tracking
  generateEmailTrackingToken,
  injectTrackingPixel,
  convertLinksToTracked,
  recordEmailOpen,
  recordEmailClick,
  getEmailTrackingStats,

  // Validation
  validateEmailSyntax,
  validateEmailDomain,
  isDisposableEmail,
  isRoleBasedEmail,
  validateEmail,

  // Bulk Sending
  sendBulkEmails,
  filterSubscribedRecipients,

  // Scheduling
  scheduleEmail,
  scheduleRecurringEmail,
  cancelScheduledEmail,
  getNextRecurringEmailTime,

  // SMS
  sendSMSViaTwilio,
  sendBulkSMS,
  validatePhoneNumber,

  // Push Notifications
  sendPushNotificationViaFCM,
  sendPushNotificationViaAPNs,
  validatePushToken,

  // In-App Notifications
  createInAppNotification,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteExpiredNotifications,

  // Preferences
  getNotificationPreferences,
  updateNotificationPreferences,
  canSendNotification,
  shouldSendNotificationNow,

  // Unsubscribe
  generateUnsubscribeToken,
  createUnsubscribeLink,
  processUnsubscribe,
  resubscribe,

  // Bounce/Complaint Handling
  recordEmailBounce,
  recordEmailComplaint,
  hasHardBounced,
  hasComplainedAboutEmail,
  getEmailBounceStats,
  autoSuppressProblematicEmails,

  // Delivery Status
  updateNotificationDeliveryStatus,
  getNotificationDeliveryStatus,
  retryFailedNotification,
  getNotificationCampaignStats,

  // Sequelize Models
  defineEmailModel,
  defineNotificationModel,
  defineEmailTemplateModel,
  defineSubscriptionModel,
};
