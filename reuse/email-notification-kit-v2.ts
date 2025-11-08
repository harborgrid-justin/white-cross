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

/**
 * File: /reuse/email-notification-kit-v2.ts
 * Locator: WC-UTL-EMAILNOT-002
 * Purpose: Comprehensive Email & Notification Kit V2 - Complete communication toolkit for NestJS
 *
 * Upstream: Independent utility module for email and notification operations
 * Downstream: ../backend/*, Email services, SMS services, Push notifications, Queue processors
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/bull, nodemailer, @sendgrid/mail, aws-sdk, twilio, firebase-admin, handlebars, Sequelize
 * Exports: 40+ utility functions for SMTP, SendGrid, SES, templating, scheduling, SMS, push notifications, tracking
 *
 * LLM Context: Enterprise-grade email and notification utilities for White Cross healthcare platform.
 * Provides comprehensive email sending (SMTP, SendGrid, AWS SES), SMS (Twilio), push notifications (FCM, APNs),
 * templating (Handlebars, EJS), email tracking (opens, clicks), delivery status, bounce handling,
 * bulk sending, queue management (Bull), scheduling, preferences, unsubscribe, HIPAA-compliant notifications.
 */

import { Injectable, Inject } from '@nestjs/common';
import { Model, DataTypes, Sequelize } from 'sequelize';
import * as crypto from 'crypto';
import { z } from 'zod';

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
    clickTracking?: { enable: boolean };
    openTracking?: { enable: boolean };
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

interface EmailTracking {
  emailId: string;
  recipientEmail: string;
  opened: boolean;
  openedAt?: Date;
  clicked: boolean;
  clickedAt?: Date;
  clicks: Array<{ url: string; timestamp: Date }>;
  bounced: boolean;
  bouncedAt?: Date;
  bounceReason?: string;
}

interface BulkEmailJob {
  id: string;
  campaignName: string;
  recipients: string[];
  template: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalSent: number;
  totalFailed: number;
  scheduledAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
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

// ============================================================================
// SEQUELIZE MODELS (1-3)
// ============================================================================

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
export function defineEmailLogModel(sequelize: Sequelize): typeof Model {
  class EmailLog extends Model {
    public id!: string;
    public recipientEmail!: string;
    public recipientName!: string;
    public senderEmail!: string;
    public subject!: string;
    public body!: string;
    public bodyHtml!: string;
    public status!: 'pending' | 'sent' | 'delivered' | 'bounced' | 'failed' | 'opened' | 'clicked';
    public provider!: 'smtp' | 'sendgrid' | 'ses';
    public providerId!: string;
    public trackingId!: string;
    public opened!: boolean;
    public openedAt!: Date;
    public clicked!: boolean;
    public clickedAt!: Date;
    public bounced!: boolean;
    public bouncedAt!: Date;
    public bounceReason!: string;
    public attempts!: number;
    public lastAttemptAt!: Date;
    public metadata!: Record<string, any>;
    public createdAt!: Date;
    public updatedAt!: Date;
  }

  EmailLog.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      recipientEmail: {
        type: DataTypes.STRING(500),
        allowNull: false,
        field: 'recipient_email',
      },
      recipientName: {
        type: DataTypes.STRING(200),
        allowNull: true,
        field: 'recipient_name',
      },
      senderEmail: {
        type: DataTypes.STRING(500),
        allowNull: false,
        field: 'sender_email',
      },
      subject: {
        type: DataTypes.STRING(1000),
        allowNull: false,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      bodyHtml: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'body_html',
      },
      status: {
        type: DataTypes.ENUM('pending', 'sent', 'delivered', 'bounced', 'failed', 'opened', 'clicked'),
        allowNull: false,
        defaultValue: 'pending',
      },
      provider: {
        type: DataTypes.ENUM('smtp', 'sendgrid', 'ses'),
        allowNull: false,
      },
      providerId: {
        type: DataTypes.STRING(200),
        allowNull: true,
        field: 'provider_id',
      },
      trackingId: {
        type: DataTypes.STRING(200),
        allowNull: true,
        field: 'tracking_id',
      },
      opened: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      openedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'opened_at',
      },
      clicked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      clickedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'clicked_at',
      },
      bounced: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      bouncedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'bounced_at',
      },
      bounceReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'bounce_reason',
      },
      attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      lastAttemptAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'last_attempt_at',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      tableName: 'email_logs',
      timestamps: true,
      indexes: [
        { fields: ['recipient_email'] },
        { fields: ['status'] },
        { fields: ['provider'] },
        { fields: ['tracking_id'] },
        { fields: ['created_at'] },
        { fields: ['opened'] },
        { fields: ['bounced'] },
      ],
    }
  );

  return EmailLog;
}

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
export function defineNotificationTemplateModel(sequelize: Sequelize): typeof Model {
  class NotificationTemplate extends Model {
    public id!: string;
    public name!: string;
    public type!: 'email' | 'sms' | 'push';
    public subject!: string;
    public body!: string;
    public bodyHtml!: string;
    public variables!: string[];
    public language!: string;
    public category!: string;
    public active!: boolean;
    public version!: number;
    public metadata!: Record<string, any>;
    public createdAt!: Date;
    public updatedAt!: Date;
  }

  NotificationTemplate.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        unique: true,
      },
      type: {
        type: DataTypes.ENUM('email', 'sms', 'push'),
        allowNull: false,
      },
      subject: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      bodyHtml: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'body_html',
      },
      variables: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      language: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: 'en',
      },
      category: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      version: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      tableName: 'notification_templates',
      timestamps: true,
      indexes: [
        { fields: ['name'], unique: true },
        { fields: ['type'] },
        { fields: ['language'] },
        { fields: ['active'] },
      ],
    }
  );

  return NotificationTemplate;
}

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
export function defineNotificationPreferenceModel(sequelize: Sequelize): typeof Model {
  class NotificationPreference extends Model {
    public id!: string;
    public userId!: string;
    public email!: boolean;
    public sms!: boolean;
    public push!: boolean;
    public categories!: Record<string, boolean>;
    public frequency!: 'immediate' | 'daily' | 'weekly';
    public quietHoursStart!: string;
    public quietHoursEnd!: string;
    public timezone!: string;
    public unsubscribeToken!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
  }

  NotificationPreference.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        field: 'user_id',
      },
      email: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      sms: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      push: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      categories: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      frequency: {
        type: DataTypes.ENUM('immediate', 'daily', 'weekly'),
        allowNull: false,
        defaultValue: 'immediate',
      },
      quietHoursStart: {
        type: DataTypes.STRING(5),
        allowNull: true,
        field: 'quiet_hours_start',
      },
      quietHoursEnd: {
        type: DataTypes.STRING(5),
        allowNull: true,
        field: 'quiet_hours_end',
      },
      timezone: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: 'UTC',
      },
      unsubscribeToken: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'unsubscribe_token',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      tableName: 'notification_preferences',
      timestamps: true,
      indexes: [
        { fields: ['user_id'], unique: true },
        { fields: ['unsubscribe_token'] },
      ],
    }
  );

  return NotificationPreference;
}

// ============================================================================
// ZOD SCHEMAS (4-6)
// ============================================================================

/**
 * Zod schema for email configuration validation.
 */
export const emailConfigSchema = z.object({
  from: z.string().email(),
  to: z.union([z.string().email(), z.array(z.string().email())]),
  cc: z.union([z.string().email(), z.array(z.string().email())]).optional(),
  bcc: z.union([z.string().email(), z.array(z.string().email())]).optional(),
  subject: z.string().min(1).max(1000),
  html: z.string().optional(),
  text: z.string().optional(),
  priority: z.enum(['high', 'normal', 'low']).optional(),
});

/**
 * Zod schema for SMTP configuration validation.
 */
export const smtpConfigSchema = z.object({
  host: z.string().min(1),
  port: z.number().min(1).max(65535),
  secure: z.boolean().optional(),
  auth: z.object({
    user: z.string().min(1),
    pass: z.string().min(1),
  }).optional(),
});

/**
 * Zod schema for SMS message validation.
 */
export const smsMessageSchema = z.object({
  to: z.string().min(10).max(15),
  body: z.string().min(1).max(1600),
  from: z.string().optional(),
  mediaUrls: z.array(z.string().url()).optional(),
});

/**
 * Zod schema for push notification validation.
 */
export const pushNotificationSchema = z.object({
  tokens: z.array(z.string().min(1)),
  title: z.string().min(1).max(100),
  body: z.string().min(1).max(500),
  data: z.record(z.string()).optional(),
  priority: z.enum(['high', 'normal']).optional(),
});

/**
 * Zod schema for notification template validation.
 */
export const notificationTemplateSchema = z.object({
  name: z.string().min(1).max(200),
  type: z.enum(['email', 'sms', 'push']),
  subject: z.string().max(1000).optional(),
  body: z.string().min(1),
  variables: z.array(z.string()),
  language: z.string().min(2).max(10),
});

// ============================================================================
// SMTP EMAIL UTILITIES (7-11)
// ============================================================================

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
export function createSMTPTransporter(config: SMTPConfig): any {
  const nodemailer = require('nodemailer');

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.auth,
    tls: config.tls,
    pool: config.pool,
    maxConnections: config.maxConnections,
    rateDelta: config.rateDelta,
    rateLimit: config.rateLimit,
  });
}

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
export async function sendSMTPEmail(transporter: any, emailConfig: EmailConfig): Promise<any> {
  const trackingId = crypto.randomBytes(16).toString('hex');

  const mailOptions: any = {
    from: emailConfig.from,
    to: emailConfig.to,
    cc: emailConfig.cc,
    bcc: emailConfig.bcc,
    subject: emailConfig.subject,
    text: emailConfig.text,
    html: emailConfig.html,
    attachments: emailConfig.attachments,
    replyTo: emailConfig.replyTo,
    headers: {
      ...emailConfig.headers,
      'X-Tracking-ID': trackingId,
    },
    priority: emailConfig.priority,
  };

  if (emailConfig.trackOpens && emailConfig.html) {
    mailOptions.html += `<img src="https://example.com/track/open/${trackingId}" width="1" height="1" />`;
  }

  const result = await transporter.sendMail(mailOptions);

  return {
    ...result,
    trackingId,
  };
}

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
export async function sendBulkSMTPEmails(
  transporter: any,
  emails: EmailConfig[],
  rateLimit: number = 5
): Promise<Array<{ success: boolean; result?: any; error?: any }>> {
  const results: Array<{ success: boolean; result?: any; error?: any }> = [];
  const delay = 1000 / rateLimit;

  for (const email of emails) {
    try {
      const result = await sendSMTPEmail(transporter, email);
      results.push({ success: true, result });
    } catch (error) {
      results.push({ success: false, error });
    }

    await new Promise(resolve => setTimeout(resolve, delay));
  }

  return results;
}

/**
 * Validates email address format.
 *
 * @param {string} email - Email address
 * @returns {boolean} Validation result
 *
 * @example
 * const valid = validateEmailAddress('user@example.com');
 */
export function validateEmailAddress(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Parses email headers from sent email.
 *
 * @param {any} emailResult - Email send result
 * @returns {Record<string, string>} Parsed headers
 *
 * @example
 * const headers = parseEmailHeaders(sendResult);
 */
export function parseEmailHeaders(emailResult: any): Record<string, string> {
  return {
    messageId: emailResult.messageId,
    accepted: emailResult.accepted?.join(', '),
    rejected: emailResult.rejected?.join(', '),
    response: emailResult.response,
  };
}

// ============================================================================
// SENDGRID UTILITIES (12-15)
// ============================================================================

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
export function createSendGridClient(config: SendGridConfig): any {
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(config.apiKey);
  return sgMail;
}

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
export async function sendSendGridEmail(sgClient: any, emailConfig: EmailConfig): Promise<any> {
  const msg = {
    to: emailConfig.to,
    from: emailConfig.from,
    cc: emailConfig.cc,
    bcc: emailConfig.bcc,
    subject: emailConfig.subject,
    text: emailConfig.text,
    html: emailConfig.html,
    attachments: emailConfig.attachments,
    replyTo: emailConfig.replyTo,
    headers: emailConfig.headers,
    trackingSettings: {
      clickTracking: { enable: emailConfig.trackClicks || false },
      openTracking: { enable: emailConfig.trackOpens || false },
    },
  };

  const [response] = await sgClient.send(msg);
  return response;
}

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
export async function sendSendGridTemplate(
  sgClient: any,
  to: string,
  templateId: string,
  dynamicData: Record<string, any>
): Promise<any> {
  const msg = {
    to,
    from: 'noreply@example.com',
    templateId,
    dynamicTemplateData: dynamicData,
  };

  const [response] = await sgClient.send(msg);
  return response;
}

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
export async function handleSendGridWebhook(event: any, emailLogModel: typeof Model): Promise<void> {
  const { email, event: eventType, sg_message_id } = event;

  const updates: Record<string, any> = {};

  switch (eventType) {
    case 'delivered':
      updates.status = 'delivered';
      break;
    case 'open':
      updates.opened = true;
      updates.openedAt = new Date();
      updates.status = 'opened';
      break;
    case 'click':
      updates.clicked = true;
      updates.clickedAt = new Date();
      updates.status = 'clicked';
      break;
    case 'bounce':
    case 'dropped':
      updates.bounced = true;
      updates.bouncedAt = new Date();
      updates.bounceReason = event.reason;
      updates.status = 'bounced';
      break;
  }

  await emailLogModel.update(updates, {
    where: { providerId: sg_message_id },
  });
}

// ============================================================================
// AWS SES UTILITIES (16-19)
// ============================================================================

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
export function createSESClient(config: SESConfig): any {
  const AWS = require('aws-sdk');

  return new AWS.SES({
    region: config.region,
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  });
}

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
export async function sendSESEmail(sesClient: any, emailConfig: EmailConfig): Promise<any> {
  const params = {
    Source: emailConfig.from,
    Destination: {
      ToAddresses: Array.isArray(emailConfig.to) ? emailConfig.to : [emailConfig.to],
      CcAddresses: emailConfig.cc ? (Array.isArray(emailConfig.cc) ? emailConfig.cc : [emailConfig.cc]) : [],
      BccAddresses: emailConfig.bcc ? (Array.isArray(emailConfig.bcc) ? emailConfig.bcc : [emailConfig.bcc]) : [],
    },
    Message: {
      Subject: {
        Data: emailConfig.subject,
        Charset: 'UTF-8',
      },
      Body: {
        Text: emailConfig.text ? {
          Data: emailConfig.text,
          Charset: 'UTF-8',
        } : undefined,
        Html: emailConfig.html ? {
          Data: emailConfig.html,
          Charset: 'UTF-8',
        } : undefined,
      },
    },
    ReplyToAddresses: emailConfig.replyTo ? [emailConfig.replyTo] : [],
  };

  return await sesClient.sendEmail(params).promise();
}

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
export async function sendSESTemplate(
  sesClient: any,
  to: string,
  templateName: string,
  templateData: Record<string, any>
): Promise<any> {
  const params = {
    Source: 'noreply@example.com',
    Destination: {
      ToAddresses: [to],
    },
    Template: templateName,
    TemplateData: JSON.stringify(templateData),
  };

  return await sesClient.sendTemplatedEmail(params).promise();
}

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
export async function handleSESBounce(notification: any, emailLogModel: typeof Model): Promise<void> {
  const message = JSON.parse(notification.Message);
  const { bounce } = message;

  if (!bounce) return;

  const { bouncedRecipients, bounceType } = bounce;

  for (const recipient of bouncedRecipients) {
    await emailLogModel.update(
      {
        bounced: true,
        bouncedAt: new Date(),
        bounceReason: bounceType,
        status: 'bounced',
      },
      {
        where: { recipientEmail: recipient.emailAddress },
      }
    );
  }
}

// ============================================================================
// TEMPLATING UTILITIES (20-24)
// ============================================================================

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
export function compileHandlebarsTemplate(template: string): (data: any) => string {
  const Handlebars = require('handlebars');
  return Handlebars.compile(template);
}

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
export async function renderEmailTemplate(
  templateModel: typeof Model,
  templateName: string,
  data: Record<string, any>
): Promise<{ subject: string; body: string; html: string }> {
  const template = await templateModel.findOne({
    where: { name: templateName, active: true },
  });

  if (!template) {
    throw new Error(`Template ${templateName} not found`);
  }

  const subjectTemplate = compileHandlebarsTemplate(template.get('subject') as string || '');
  const bodyTemplate = compileHandlebarsTemplate(template.get('body') as string);
  const htmlTemplate = template.get('bodyHtml')
    ? compileHandlebarsTemplate(template.get('bodyHtml') as string)
    : null;

  return {
    subject: subjectTemplate(data),
    body: bodyTemplate(data),
    html: htmlTemplate ? htmlTemplate(data) : '',
  };
}

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
export function validateTemplateVariables(
  requiredVars: string[],
  data: Record<string, any>
): boolean {
  for (const varName of requiredVars) {
    if (!(varName in data)) {
      throw new Error(`Missing required template variable: ${varName}`);
    }
  }
  return true;
}

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
export async function createEmailTemplate(
  templateModel: typeof Model,
  template: Partial<NotificationTemplate>
): Promise<any> {
  return await templateModel.create({
    name: template.name,
    type: template.type,
    subject: template.subject,
    body: template.body,
    variables: template.variables,
    language: template.language || 'en',
    active: true,
  });
}

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
export function generateUnsubscribeLink(userId: string, baseUrl: string): string {
  const token = crypto.createHash('sha256').update(userId + Date.now()).digest('hex');
  return `${baseUrl}/unsubscribe?token=${token}`;
}

// ============================================================================
// SMS UTILITIES (25-28)
// ============================================================================

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
export function createTwilioClient(config: TwilioConfig): any {
  const twilio = require('twilio');
  return twilio(config.accountSid, config.authToken);
}

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
export async function sendTwilioSMS(twilioClient: any, sms: SMSMessage): Promise<any> {
  return await twilioClient.messages.create({
    body: sms.body,
    to: sms.to,
    from: sms.from,
    mediaUrl: sms.mediaUrls,
    statusCallback: sms.statusCallback,
  });
}

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
export async function sendBulkSMS(
  twilioClient: any,
  messages: SMSMessage[]
): Promise<Array<{ success: boolean; result?: any; error?: any }>> {
  const results: Array<{ success: boolean; result?: any; error?: any }> = [];

  for (const message of messages) {
    try {
      const result = await sendTwilioSMS(twilioClient, message);
      results.push({ success: true, result });
    } catch (error) {
      results.push({ success: false, error });
    }
  }

  return results;
}

/**
 * Validates phone number format.
 *
 * @param {string} phone - Phone number
 * @returns {boolean} Validation result
 *
 * @example
 * const valid = validatePhoneNumber('+1234567890');
 */
export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
}

// ============================================================================
// PUSH NOTIFICATION UTILITIES (29-32)
// ============================================================================

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
export function createFCMClient(config: FCMConfig): any {
  const admin = require('firebase-admin');

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: config.projectId,
      privateKey: config.privateKey,
      clientEmail: config.clientEmail,
    }),
  });

  return admin;
}

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
export async function sendFCMPushNotification(
  fcmClient: any,
  notification: PushNotification
): Promise<any> {
  const message = {
    notification: {
      title: notification.title,
      body: notification.body,
    },
    data: notification.data,
    tokens: notification.tokens,
    android: {
      priority: notification.priority || 'high',
      ttl: notification.ttl || 3600000,
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

  return await fcmClient.messaging().sendMulticast(message);
}

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
export async function sendSilentPush(
  fcmClient: any,
  tokens: string[],
  data: Record<string, string>
): Promise<any> {
  const message = {
    data,
    tokens,
    android: {
      priority: 'high',
    },
    apns: {
      payload: {
        aps: {
          contentAvailable: true,
        },
      },
      headers: {
        'apns-priority': '5',
      },
    },
  };

  return await fcmClient.messaging().sendMulticast(message);
}

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
export async function subscribeToTopic(
  fcmClient: any,
  tokens: string[],
  topic: string
): Promise<any> {
  return await fcmClient.messaging().subscribeToTopic(tokens, topic);
}

// ============================================================================
// TRACKING & ANALYTICS (33-36)
// ============================================================================

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
export async function trackEmailOpen(emailLogModel: typeof Model, trackingId: string): Promise<void> {
  await emailLogModel.update(
    {
      opened: true,
      openedAt: new Date(),
      status: 'opened',
    },
    {
      where: { trackingId },
    }
  );
}

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
export async function trackEmailClick(
  emailLogModel: typeof Model,
  trackingId: string,
  url: string
): Promise<void> {
  const email = await emailLogModel.findOne({ where: { trackingId } });

  if (email) {
    const clicks = (email.get('metadata') as any)?.clicks || [];
    clicks.push({ url, timestamp: new Date() });

    await email.update({
      clicked: true,
      clickedAt: new Date(),
      status: 'clicked',
      metadata: { ...email.get('metadata'), clicks },
    });
  }
}

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
export async function generateEmailAnalytics(
  emailLogModel: typeof Model,
  startDate: Date,
  endDate: Date
): Promise<Record<string, any>> {
  const emails = await emailLogModel.findAll({
    where: {
      createdAt: {
        [Sequelize.Op.between]: [startDate, endDate],
      },
    },
  });

  const total = emails.length;
  const sent = emails.filter(e => e.get('status') !== 'failed').length;
  const opened = emails.filter(e => e.get('opened')).length;
  const clicked = emails.filter(e => e.get('clicked')).length;
  const bounced = emails.filter(e => e.get('bounced')).length;

  return {
    period: `${startDate.toISOString()} to ${endDate.toISOString()}`,
    total,
    sent,
    opened,
    clicked,
    bounced,
    openRate: sent > 0 ? opened / sent : 0,
    clickRate: sent > 0 ? clicked / sent : 0,
    bounceRate: sent > 0 ? bounced / sent : 0,
  };
}

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
export async function identifyBestSendTimes(
  emailLogModel: typeof Model,
  days: number = 30
): Promise<Array<{ hour: number; openRate: number }>> {
  const startDate = new Date(Date.now() - days * 86400000);

  const emails = await emailLogModel.findAll({
    where: {
      createdAt: {
        [Sequelize.Op.gte]: startDate,
      },
    },
  });

  const hourlyStats = new Map<number, { sent: number; opened: number }>();

  for (const email of emails) {
    const hour = new Date(email.get('createdAt') as Date).getHours();
    const stats = hourlyStats.get(hour) || { sent: 0, opened: 0 };

    stats.sent++;
    if (email.get('opened')) stats.opened++;

    hourlyStats.set(hour, stats);
  }

  return Array.from(hourlyStats.entries())
    .map(([hour, stats]) => ({
      hour,
      openRate: stats.sent > 0 ? stats.opened / stats.sent : 0,
    }))
    .sort((a, b) => b.openRate - a.openRate);
}

// ============================================================================
// USER PREFERENCES (37-40)
// ============================================================================

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
export async function getUserPreferences(
  preferenceModel: typeof Model,
  userId: string
): Promise<any> {
  let preference = await preferenceModel.findOne({ where: { userId } });

  if (!preference) {
    preference = await preferenceModel.create({
      userId,
      email: true,
      sms: false,
      push: true,
      frequency: 'immediate',
    });
  }

  return preference;
}

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
export async function updateUserPreferences(
  preferenceModel: typeof Model,
  userId: string,
  updates: Partial<NotificationPreference>
): Promise<any> {
  const [updatedCount] = await preferenceModel.update(updates, {
    where: { userId },
  });

  if (updatedCount === 0) {
    return await preferenceModel.create({ userId, ...updates });
  }

  return await preferenceModel.findOne({ where: { userId } });
}

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
export async function shouldSendNotification(
  preferenceModel: typeof Model,
  userId: string,
  notificationType: 'email' | 'sms' | 'push',
  category?: string
): Promise<boolean> {
  const preference = await getUserPreferences(preferenceModel, userId);

  if (!preference.get(notificationType)) {
    return false;
  }

  if (category) {
    const categories = preference.get('categories') as Record<string, boolean>;
    if (categories && categories[category] === false) {
      return false;
    }
  }

  // Check quiet hours
  const quietStart = preference.get('quietHoursStart');
  const quietEnd = preference.get('quietHoursEnd');

  if (quietStart && quietEnd) {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    if (currentTime >= quietStart && currentTime <= quietEnd) {
      return false;
    }
  }

  return true;
}

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
export async function handleUnsubscribe(
  preferenceModel: typeof Model,
  token: string
): Promise<boolean> {
  const [updatedCount] = await preferenceModel.update(
    {
      email: false,
      sms: false,
      push: false,
    },
    {
      where: { unsubscribeToken: token },
    }
  );

  return updatedCount > 0;
}

// ============================================================================
// NESTJS INJECTABLE SERVICE
// ============================================================================

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
@Injectable()
export class NotificationService {
  constructor(
    @Inject('EMAIL_LOG_MODEL') private emailLogModel: typeof Model,
    @Inject('TEMPLATE_MODEL') private templateModel: typeof Model,
    @Inject('PREFERENCE_MODEL') private preferenceModel: typeof Model,
    @Inject('SMTP_TRANSPORTER') private smtpTransporter?: any,
    @Inject('TWILIO_CLIENT') private twilioClient?: any,
    @Inject('FCM_CLIENT') private fcmClient?: any
  ) {}

  async sendEmail(to: string, templateName: string, data: Record<string, any>): Promise<any> {
    const rendered = await renderEmailTemplate(this.templateModel, templateName, data);

    if (this.smtpTransporter) {
      const result = await sendSMTPEmail(this.smtpTransporter, {
        from: 'noreply@example.com',
        to,
        subject: rendered.subject,
        html: rendered.html,
        text: rendered.body,
      });

      await this.emailLogModel.create({
        recipientEmail: to,
        senderEmail: 'noreply@example.com',
        subject: rendered.subject,
        bodyHtml: rendered.html,
        body: rendered.body,
        status: 'sent',
        provider: 'smtp',
        trackingId: result.trackingId,
      });

      return result;
    }
  }

  async sendSMS(to: string, message: string): Promise<any> {
    if (this.twilioClient) {
      return sendTwilioSMS(this.twilioClient, { to, body: message });
    }
  }

  async sendPush(tokens: string[], title: string, body: string, data?: Record<string, string>): Promise<any> {
    if (this.fcmClient) {
      return sendFCMPushNotification(this.fcmClient, {
        tokens,
        title,
        body,
        data,
      });
    }
  }
}
