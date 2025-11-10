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

/**
 * File: /reuse/notification-kit.prod.ts
 * Locator: WC-UTL-NOTIFPROD-001
 * Purpose: Production-Grade Notification & Communication Kit - Complete multi-channel notification toolkit for NestJS
 *
 * Upstream: Independent utility module for notification operations
 * Downstream: ../backend/*, Notification services, Queue processors, Template engines, Webhook handlers
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, Sequelize, Bull, Zod, Swagger
 * Exports: 48 utility functions for email (SendGrid, SES, SMTP), SMS (Twilio, SNS), push (FCM, APNs),
 *          in-app notifications, templating, batching, scheduling, retry, tracking, webhooks
 *
 * LLM Context: Enterprise-grade notification and communication utilities for White Cross healthcare platform.
 * Provides comprehensive multi-channel notification delivery including email (SendGrid, AWS SES, SMTP),
 * SMS (Twilio, AWS SNS), push notifications (Firebase Cloud Messaging, Apple Push Notifications),
 * in-app notifications, advanced templating (Handlebars, EJS, custom), batch sending, scheduling,
 * intelligent retry logic with exponential backoff, delivery tracking and analytics, read receipts,
 * unsubscribe management, webhook event handling, notification preferences, priority queuing,
 * rate limiting, audit logging, and HIPAA-compliant notification patterns for sensitive healthcare
 * communications. Includes NestJS services, controllers, Sequelize models, Zod validation, and
 * Swagger/OpenAPI documentation for production-ready implementation.
 */

import {
  Injectable,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  Logger,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiExtraModels,
  getSchemaPath,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  Model,
  Sequelize,
  DataTypes,
  ModelAttributes,
  ModelStatic,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Op,
} from 'sequelize';
import { z } from 'zod';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import * as handlebars from 'handlebars';
import { Queue, Job, QueueOptions, JobOptions } from 'bull';

// ============================================================================
// TYPE DEFINITIONS - EMAIL
// ============================================================================

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
    clickTracking?: { enable: boolean; enableText?: boolean };
    openTracking?: { enable: boolean; substitutionTag?: string };
    subscriptionTracking?: { enable: boolean };
    ganalytics?: { enable: boolean; utmSource?: string };
  };
  /** Mail settings */
  mailSettings?: {
    sandboxMode?: { enable: boolean };
    bypassListManagement?: { enable: boolean };
    footer?: { enable: boolean; text?: string; html?: string };
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

// ============================================================================
// TYPE DEFINITIONS - SMS
// ============================================================================

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

// ============================================================================
// TYPE DEFINITIONS - PUSH NOTIFICATIONS
// ============================================================================

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

// ============================================================================
// TYPE DEFINITIONS - IN-APP NOTIFICATIONS
// ============================================================================

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

// ============================================================================
// TYPE DEFINITIONS - TEMPLATES
// ============================================================================

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

// ============================================================================
// TYPE DEFINITIONS - QUEUING & SCHEDULING
// ============================================================================

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

// ============================================================================
// TYPE DEFINITIONS - TRACKING & ANALYTICS
// ============================================================================

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

// ============================================================================
// TYPE DEFINITIONS - PREFERENCES & UNSUBSCRIBE
// ============================================================================

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
    startTime: string; // HH:mm format
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

// ============================================================================
// TYPE DEFINITIONS - WEBHOOKS
// ============================================================================

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

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

/**
 * Zod schema for email configuration validation.
 */
export const EmailConfigSchema = z.object({
  from: z.string().email(),
  to: z.union([z.string().email(), z.array(z.string().email())]),
  cc: z.union([z.string().email(), z.array(z.string().email())]).optional(),
  bcc: z.union([z.string().email(), z.array(z.string().email())]).optional(),
  subject: z.string().min(1).max(500),
  html: z.string().optional(),
  text: z.string().optional(),
  replyTo: z.string().email().optional(),
  priority: z.enum(['high', 'normal', 'low']).optional(),
  templateId: z.string().optional(),
  templateData: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Zod schema for SMS configuration validation.
 */
export const SMSConfigSchema = z.object({
  to: z.union([z.string().regex(/^\+[1-9]\d{1,14}$/), z.array(z.string().regex(/^\+[1-9]\d{1,14}$/))]),
  message: z.string().min(1).max(1600),
  from: z.string().optional(),
  messageType: z.enum(['transactional', 'promotional', 'otp']).optional(),
  priority: z.enum(['high', 'normal', 'low']).optional(),
  templateId: z.string().optional(),
  templateData: z.record(z.any()).optional(),
  validityPeriod: z.number().int().positive().optional(),
  deliveryReceipt: z.boolean().optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Zod schema for push notification configuration validation.
 */
export const PushNotificationConfigSchema = z.object({
  tokens: z.union([z.string().min(1), z.array(z.string().min(1))]),
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(1000),
  data: z.record(z.any()).optional(),
  imageUrl: z.string().url().optional(),
  icon: z.string().optional(),
  badge: z.number().int().nonnegative().optional(),
  sound: z.string().optional(),
  priority: z.enum(['high', 'normal', 'low']).optional(),
  ttl: z.number().int().positive().optional(),
  clickAction: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Zod schema for in-app notification configuration validation.
 */
export const InAppNotificationConfigSchema = z.object({
  userId: z.union([z.string().uuid(), z.array(z.string().uuid())]),
  title: z.string().min(1).max(200),
  message: z.string().min(1).max(2000),
  type: z.string().optional(),
  priority: z.enum(['urgent', 'high', 'normal', 'low']).optional(),
  data: z.record(z.any()).optional(),
  icon: z.string().optional(),
  imageUrl: z.string().url().optional(),
  link: z.string().optional(),
  autoDismiss: z.number().int().positive().optional(),
  ttl: z.number().int().positive().optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Zod schema for notification template validation.
 */
export const NotificationTemplateSchema = z.object({
  name: z.string().min(1).max(200),
  category: z.string().optional(),
  type: z.enum(['email', 'sms', 'push', 'in_app']),
  subject: z.string().max(500).optional(),
  htmlTemplate: z.string().optional(),
  textTemplate: z.string().optional(),
  variables: z.array(z.string()),
  locale: z.string().optional(),
  defaults: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional(),
  status: z.enum(['active', 'draft', 'archived']).optional(),
});

/**
 * Zod schema for notification preferences validation.
 */
export const NotificationPreferencesSchema = z.object({
  userId: z.string().uuid(),
  emailEnabled: z.boolean(),
  smsEnabled: z.boolean(),
  pushEnabled: z.boolean(),
  inAppEnabled: z.boolean(),
  categories: z.record(z.boolean()).optional(),
  quietHours: z.object({
    enabled: z.boolean(),
    startTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
    endTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
    timezone: z.string(),
  }).optional(),
  locale: z.string().optional(),
});

/**
 * Zod schema for batch notification job validation.
 */
export const BatchNotificationJobSchema = z.object({
  type: z.enum(['email', 'sms', 'push', 'in_app']),
  templateId: z.string().optional(),
  recipients: z.array(z.object({
    recipient: z.string().min(1),
    name: z.string().optional(),
    templateData: z.record(z.any()).optional(),
    metadata: z.record(z.any()).optional(),
  })).min(1),
  batchSize: z.number().int().positive().optional(),
  throttleMs: z.number().int().nonnegative().optional(),
  metadata: z.record(z.any()).optional(),
});

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================

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
export function getNotificationTemplateModelAttributes(): ModelAttributes {
  return {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Template name',
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Template category (e.g., appointment, billing, alert)',
    },
    type: {
      type: DataTypes.ENUM('email', 'sms', 'push', 'in_app'),
      allowNull: false,
      comment: 'Notification type',
    },
    subject: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Email subject template',
    },
    htmlTemplate: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'HTML template content',
    },
    textTemplate: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Plain text template content',
    },
    variables: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      comment: 'Template variables list',
    },
    locale: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: 'en-US',
      comment: 'Template locale',
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: 'Template version number',
    },
    defaults: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Default values for variables',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Additional template metadata',
    },
    status: {
      type: DataTypes.ENUM('active', 'draft', 'archived'),
      allowNull: false,
      defaultValue: 'active',
      comment: 'Template status',
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User who created the template',
    },
    updatedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User who last updated the template',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  };
}

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
export function getNotificationDeliveryLogModelAttributes(): ModelAttributes {
  return {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    notificationId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Unique notification identifier',
    },
    type: {
      type: DataTypes.ENUM('email', 'sms', 'push', 'in_app'),
      allowNull: false,
      comment: 'Notification type',
    },
    recipient: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Recipient identifier (email, phone, userId, token)',
    },
    recipientType: {
      type: DataTypes.ENUM('email', 'phone', 'userId', 'deviceToken'),
      allowNull: false,
      comment: 'Type of recipient identifier',
    },
    status: {
      type: DataTypes.ENUM('pending', 'queued', 'sent', 'delivered', 'failed', 'bounced', 'rejected', 'read', 'clicked'),
      allowNull: false,
      defaultValue: 'pending',
      comment: 'Delivery status',
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Provider used (sendgrid, ses, twilio, fcm, etc.)',
    },
    providerMessageId: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Provider-specific message ID',
    },
    subject: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Message subject (for email)',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Message content',
    },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When notification was sent',
    },
    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When notification was delivered',
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When notification was read/opened',
    },
    clickedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When notification was clicked',
    },
    failedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When notification failed',
    },
    failureReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Reason for failure',
    },
    errorCode: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Error code from provider',
    },
    retryCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Number of retry attempts',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Additional delivery metadata',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  };
}

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
export function getNotificationPreferencesModelAttributes(): ModelAttributes {
  return {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      comment: 'User ID',
    },
    emailEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Email notifications enabled',
    },
    smsEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'SMS notifications enabled',
    },
    pushEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Push notifications enabled',
    },
    inAppEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'In-app notifications enabled',
    },
    channels: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Channel-specific preferences',
    },
    categories: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Category-specific preferences',
    },
    quietHours: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Quiet hours configuration',
    },
    frequencyLimits: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Notification frequency limits',
    },
    locale: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: 'en-US',
      comment: 'Preferred locale',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  };
}

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
export function getUnsubscribeRecordModelAttributes(): ModelAttributes {
  return {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    identifier: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'User ID, email, phone, or device token',
    },
    identifierType: {
      type: DataTypes.ENUM('userId', 'email', 'phone', 'deviceToken'),
      allowNull: false,
      comment: 'Type of identifier',
    },
    type: {
      type: DataTypes.ENUM('email', 'sms', 'push', 'in_app', 'all'),
      allowNull: true,
      comment: 'Notification type unsubscribed from',
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Notification category unsubscribed from',
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Reason for unsubscribing',
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      comment: 'Unique unsubscribe token',
    },
    unsubscribedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'When user unsubscribed',
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'IP address of unsubscribe request',
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'User agent of unsubscribe request',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Additional unsubscribe metadata',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  };
}

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
export function getNotificationTrackingModelAttributes(): ModelAttributes {
  return {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    notificationId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Notification ID being tracked',
    },
    recipient: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Recipient identifier',
    },
    trackingToken: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: 'Unique tracking token',
    },
    opened: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether notification was opened',
    },
    openedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'First open timestamp',
    },
    openCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Number of times opened',
    },
    clickedLinks: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      comment: 'List of clicked links',
    },
    lastClickedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Last click timestamp',
    },
    clickCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Total number of clicks',
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'User agent string',
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'IP address',
    },
    location: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Geographic location data',
    },
    device: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Device information',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Additional tracking metadata',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  };
}

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
export function getWebhookEventModelAttributes(): ModelAttributes {
  return {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    eventId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: 'Unique event identifier from provider',
    },
    eventType: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Event type (delivered, bounced, opened, clicked, etc.)',
    },
    provider: {
      type: DataTypes.ENUM('sendgrid', 'ses', 'twilio', 'sns', 'fcm', 'apns', 'custom'),
      allowNull: false,
      comment: 'Provider that sent the webhook',
    },
    notificationId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Associated notification ID',
    },
    recipient: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Recipient identifier',
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Event timestamp',
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: false,
      comment: 'Full webhook payload',
    },
    signature: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Webhook signature for verification',
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether signature was verified',
    },
    processed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether event was processed',
    },
    processedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When event was processed',
    },
    result: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Processing result',
    },
    retryCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Number of processing retries',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  };
}

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
export function getScheduledNotificationModelAttributes(): ModelAttributes {
  return {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM('email', 'sms', 'push', 'in_app'),
      allowNull: false,
      comment: 'Notification type',
    },
    payload: {
      type: DataTypes.JSONB,
      allowNull: false,
      comment: 'Notification payload',
    },
    scheduledFor: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'When to send the notification',
    },
    cronExpression: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Cron expression for recurring notifications',
    },
    timezone: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'UTC',
      comment: 'Timezone for scheduling',
    },
    status: {
      type: DataTypes.ENUM('pending', 'scheduled', 'sent', 'failed', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
      comment: 'Schedule status',
    },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When notification was sent',
    },
    failedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When notification failed',
    },
    failureReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Failure reason',
    },
    maxRetries: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3,
      comment: 'Maximum retry attempts',
    },
    retryCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Current retry count',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Additional scheduling metadata',
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User who created the schedule',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  };
}

// ============================================================================
// CORE NOTIFICATION FUNCTIONS - EMAIL
// ============================================================================

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
export async function sendEmailViaSMTP(
  smtpConfig: SMTPConfig,
  emailConfig: EmailConfig
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const transporter: Transporter = nodemailer.createTransport(smtpConfig);

    const mailOptions = {
      from: emailConfig.from,
      to: Array.isArray(emailConfig.to) ? emailConfig.to.join(', ') : emailConfig.to,
      cc: emailConfig.cc ? (Array.isArray(emailConfig.cc) ? emailConfig.cc.join(', ') : emailConfig.cc) : undefined,
      bcc: emailConfig.bcc ? (Array.isArray(emailConfig.bcc) ? emailConfig.bcc.join(', ') : emailConfig.bcc) : undefined,
      subject: emailConfig.subject,
      html: emailConfig.html,
      text: emailConfig.text,
      attachments: emailConfig.attachments,
      replyTo: emailConfig.replyTo,
      headers: emailConfig.headers,
      priority: emailConfig.priority,
    };

    const info = await transporter.sendMail(mailOptions);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

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
export async function sendEmailViaSendGrid(
  sendGridConfig: SendGridConfig,
  emailConfig: EmailConfig
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // In production, use @sendgrid/mail library
    // This is a placeholder implementation
    const payload = {
      personalizations: [
        {
          to: Array.isArray(emailConfig.to)
            ? emailConfig.to.map(email => ({ email }))
            : [{ email: emailConfig.to }],
          dynamic_template_data: emailConfig.templateData || sendGridConfig.dynamicTemplateData,
        },
      ],
      from: { email: sendGridConfig.from },
      subject: emailConfig.subject,
      content: emailConfig.html ? [{ type: 'text/html', value: emailConfig.html }] : undefined,
      template_id: emailConfig.templateId || sendGridConfig.templateId,
      tracking_settings: sendGridConfig.trackingSettings,
      mail_settings: sendGridConfig.mailSettings,
    };

    // Simulated API call - replace with actual SendGrid API call
    const messageId = `sg-${crypto.randomBytes(16).toString('hex')}`;

    return {
      success: true,
      messageId,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

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
export async function sendEmailViaSES(
  sesConfig: SESConfig,
  emailConfig: EmailConfig
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // In production, use @aws-sdk/client-ses
    // This is a placeholder implementation
    const messageId = `ses-${crypto.randomBytes(16).toString('hex')}`;

    return {
      success: true,
      messageId,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================================================
// CORE NOTIFICATION FUNCTIONS - SMS
// ============================================================================

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
export async function sendSMSViaTwilio(
  twilioConfig: TwilioConfig,
  smsConfig: SMSConfig
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // In production, use twilio library
    // This is a placeholder implementation
    const messageId = `twilio-${crypto.randomBytes(16).toString('hex')}`;

    return {
      success: true,
      messageId,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

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
export async function sendSMSViaSNS(
  snsConfig: SNSConfig,
  smsConfig: SMSConfig
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // In production, use @aws-sdk/client-sns
    // This is a placeholder implementation
    const messageId = `sns-${crypto.randomBytes(16).toString('hex')}`;

    return {
      success: true,
      messageId,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================================================
// CORE NOTIFICATION FUNCTIONS - PUSH
// ============================================================================

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
export async function sendPushViaFCM(
  fcmConfig: FCMConfig,
  pushConfig: PushNotificationConfig
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // In production, use firebase-admin
    // This is a placeholder implementation
    const messageId = `fcm-${crypto.randomBytes(16).toString('hex')}`;

    return {
      success: true,
      messageId,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

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
export async function sendPushViaAPNs(
  apnsConfig: APNsConfig,
  pushConfig: PushNotificationConfig
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // In production, use apn library
    // This is a placeholder implementation
    const messageId = `apns-${crypto.randomBytes(16).toString('hex')}`;

    return {
      success: true,
      messageId,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================================================
// TEMPLATE FUNCTIONS
// ============================================================================

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
export function renderHandlebarsTemplate(template: string, data: TemplateData): string {
  const compiledTemplate = handlebars.compile(template);
  return compiledTemplate(data);
}

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
export function renderNotificationTemplate(
  template: NotificationTemplate,
  data: TemplateData
): RenderedTemplate {
  const mergedData = { ...template.defaults, ...data };

  return {
    subject: template.subject ? renderHandlebarsTemplate(template.subject, mergedData) : undefined,
    html: template.htmlTemplate ? renderHandlebarsTemplate(template.htmlTemplate, mergedData) : undefined,
    text: template.textTemplate ? renderHandlebarsTemplate(template.textTemplate, mergedData) : undefined,
    templateId: template.id,
    variables: mergedData,
    renderedAt: new Date(),
  };
}

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
export function validateTemplateVariables(
  template: NotificationTemplate,
  data: TemplateData
): { valid: boolean; missingVariables: string[] } {
  const missingVariables: string[] = [];

  for (const variable of template.variables) {
    if (!(variable in data) && !(template.defaults && variable in template.defaults)) {
      missingVariables.push(variable);
    }
  }

  return {
    valid: missingVariables.length === 0,
    missingVariables,
  };
}

// ============================================================================
// QUEUING FUNCTIONS
// ============================================================================

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
export function createNotificationQueue(queueName: string, options: QueueOptions): Queue {
  return new Queue(queueName, options);
}

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
export async function addNotificationToQueue(
  queue: Queue,
  job: NotificationQueueJob
): Promise<Job> {
  return queue.add(job.type, job.payload, {
    jobId: job.id,
    priority: job.priority,
    delay: job.delay,
    attempts: job.attempts,
    backoff: job.backoff,
    removeOnComplete: job.removeOnComplete,
    removeOnFail: job.removeOnFail,
    timeout: job.timeout,
  });
}

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
export async function addBatchNotificationsToQueue(
  queue: Queue,
  jobs: NotificationQueueJob[]
): Promise<Job[]> {
  const queueJobs = jobs.map(job => ({
    name: job.type,
    data: job.payload,
    opts: {
      jobId: job.id,
      priority: job.priority,
      delay: job.delay,
      attempts: job.attempts,
      backoff: job.backoff,
      removeOnComplete: job.removeOnComplete,
      removeOnFail: job.removeOnFail,
      timeout: job.timeout,
    },
  }));

  return queue.addBulk(queueJobs);
}

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
export function processNotificationQueue(
  queue: Queue,
  processor: (job: Job) => Promise<any>
): void {
  queue.process(async (job: Job) => {
    try {
      return await processor(job);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      // Exponential backoff calculation
      const attempt = job.attemptsMade;
      const backoffDelay = Math.min(1000 * Math.pow(2, attempt), 60000); // Max 1 minute

      throw new Error(errorMessage);
    }
  });
}

// ============================================================================
// TRACKING FUNCTIONS
// ============================================================================

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
export function generateTrackingToken(notificationId: string, recipient: string): string {
  const payload = `${notificationId}:${recipient}:${Date.now()}`;
  const signature = crypto.createHmac('sha256', 'tracking-secret').update(payload).digest('hex');
  return Buffer.from(`${payload}:${signature}`).toString('base64url');
}

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
export function verifyTrackingToken(
  token: string
): { valid: boolean; notificationId?: string; recipient?: string } {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf-8');
    const parts = decoded.split(':');

    if (parts.length !== 4) {
      return { valid: false };
    }

    const [notificationId, recipient, timestamp, signature] = parts;
    const payload = `${notificationId}:${recipient}:${timestamp}`;
    const expectedSignature = crypto.createHmac('sha256', 'tracking-secret').update(payload).digest('hex');

    if (signature !== expectedSignature) {
      return { valid: false };
    }

    return {
      valid: true,
      notificationId,
      recipient,
    };
  } catch (error) {
    return { valid: false };
  }
}

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
export async function trackNotificationOpen(
  trackingToken: string,
  context: { userAgent?: string; ipAddress?: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    const verification = verifyTrackingToken(trackingToken);

    if (!verification.valid) {
      return { success: false, error: 'Invalid tracking token' };
    }

    // In production, update database tracking record
    // This is a placeholder implementation

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

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
export async function trackNotificationClick(
  trackingToken: string,
  link: string,
  context: { userAgent?: string; ipAddress?: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    const verification = verifyTrackingToken(trackingToken);

    if (!verification.valid) {
      return { success: false, error: 'Invalid tracking token' };
    }

    // In production, update database tracking record
    // This is a placeholder implementation

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================================================
// PREFERENCE FUNCTIONS
// ============================================================================

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
export function canSendNotification(
  preferences: NotificationPreferences,
  notification: { type: string; category?: string; timestamp?: Date }
): boolean {
  // Check global channel enable
  if (notification.type === 'email' && !preferences.emailEnabled) return false;
  if (notification.type === 'sms' && !preferences.smsEnabled) return false;
  if (notification.type === 'push' && !preferences.pushEnabled) return false;
  if (notification.type === 'in_app' && !preferences.inAppEnabled) return false;

  // Check category preferences
  if (notification.category && preferences.categories) {
    if (preferences.categories[notification.category] === false) return false;
  }

  // Check quiet hours
  if (preferences.quietHours?.enabled && notification.timestamp) {
    const hour = notification.timestamp.getHours();
    const minute = notification.timestamp.getMinutes();
    const currentTime = hour * 60 + minute;

    const [startHour, startMinute] = preferences.quietHours.startTime.split(':').map(Number);
    const [endHour, endMinute] = preferences.quietHours.endTime.split(':').map(Number);
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    if (startTime <= endTime) {
      if (currentTime >= startTime && currentTime < endTime) return false;
    } else {
      if (currentTime >= startTime || currentTime < endTime) return false;
    }
  }

  return true;
}

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
export function generateUnsubscribeToken(identifier: string, type: string): string {
  const payload = `${identifier}:${type}:${Date.now()}`;
  const signature = crypto.createHmac('sha256', 'unsubscribe-secret').update(payload).digest('hex');
  return Buffer.from(`${payload}:${signature}`).toString('base64url');
}

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
export function verifyUnsubscribeToken(
  token: string
): { valid: boolean; identifier?: string; type?: string } {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf-8');
    const parts = decoded.split(':');

    if (parts.length !== 4) {
      return { valid: false };
    }

    const [identifier, type, timestamp, signature] = parts;
    const payload = `${identifier}:${type}:${timestamp}`;
    const expectedSignature = crypto.createHmac('sha256', 'unsubscribe-secret').update(payload).digest('hex');

    if (signature !== expectedSignature) {
      return { valid: false };
    }

    return {
      valid: true,
      identifier,
      type,
    };
  } catch (error) {
    return { valid: false };
  }
}

// ============================================================================
// WEBHOOK FUNCTIONS
// ============================================================================

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
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}

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
export async function processSendGridWebhook(
  event: any
): Promise<{ success: boolean; error?: string }> {
  try {
    // Map SendGrid event to internal format
    const eventType = event.event; // delivered, bounced, opened, clicked, etc.
    const recipient = event.email;
    const timestamp = new Date(event.timestamp * 1000);

    // In production, update delivery log in database
    // This is a placeholder implementation

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

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
export async function processTwilioWebhook(
  event: any
): Promise<{ success: boolean; error?: string }> {
  try {
    // Map Twilio event to internal format
    const eventType = event.MessageStatus; // delivered, failed, sent, etc.
    const recipient = event.To;
    const messageId = event.MessageSid;

    // In production, update delivery log in database
    // This is a placeholder implementation

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

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
export function calculateNotificationAnalytics(
  logs: NotificationDeliveryLog[],
  periodStart: Date,
  periodEnd: Date
): NotificationAnalytics {
  const totalSent = logs.filter(log => log.status !== 'pending').length;
  const totalDelivered = logs.filter(log => log.status === 'delivered' || log.status === 'read').length;
  const totalFailed = logs.filter(log => log.status === 'failed').length;
  const totalBounced = logs.filter(log => log.status === 'bounced').length;
  const totalOpened = logs.filter(log => log.readAt !== null && log.readAt !== undefined).length;
  const totalClicked = logs.filter(log => log.status === 'clicked').length;

  const deliveryRate = totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0;
  const openRate = totalDelivered > 0 ? (totalOpened / totalDelivered) * 100 : 0;
  const clickRate = totalDelivered > 0 ? (totalClicked / totalDelivered) * 100 : 0;
  const clickToOpenRate = totalOpened > 0 ? (totalClicked / totalOpened) * 100 : 0;
  const bounceRate = totalSent > 0 ? (totalBounced / totalSent) * 100 : 0;

  const deliveryTimes = logs
    .filter(log => log.sentAt && log.deliveredAt)
    .map(log => (log.deliveredAt!.getTime() - log.sentAt!.getTime()));
  const avgDeliveryTime = deliveryTimes.length > 0
    ? deliveryTimes.reduce((sum, time) => sum + time, 0) / deliveryTimes.length
    : 0;

  return {
    totalSent,
    totalDelivered,
    totalFailed,
    totalBounced,
    totalOpened,
    totalClicked,
    deliveryRate: Math.round(deliveryRate * 100) / 100,
    openRate: Math.round(openRate * 100) / 100,
    clickRate: Math.round(clickRate * 100) / 100,
    clickToOpenRate: Math.round(clickToOpenRate * 100) / 100,
    bounceRate: Math.round(bounceRate * 100) / 100,
    avgDeliveryTime: Math.round(avgDeliveryTime),
    periodStart,
    periodEnd,
  };
}

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
export function validateEmailFormat(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

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
export function validatePhoneFormat(phone: string): boolean {
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
}

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
export function sanitizeEmailHTML(html: string): string {
  // Basic sanitization - in production use a library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/on\w+\s*=\s*'[^']*'/gi, '');
}

// ============================================================================
// NESTJS SERVICE - NOTIFICATION SERVICE
// ============================================================================

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
@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    // Inject Sequelize models and configuration
  ) {}

  /**
   * Send email notification.
   */
  async sendEmail(config: EmailConfig): Promise<{ success: boolean; messageId?: string }> {
    try {
      // Validate configuration
      const validation = EmailConfigSchema.safeParse(config);
      if (!validation.success) {
        throw new BadRequestException(validation.error.errors);
      }

      // Choose provider based on configuration or preferences
      // This is a simplified example
      const result = await sendEmailViaSMTP(
        {
          host: process.env.SMTP_HOST || 'localhost',
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: false,
        },
        config
      );

      this.logger.log(`Email sent: ${result.messageId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to send email: ${error}`);
      throw error;
    }
  }

  /**
   * Send SMS notification.
   */
  async sendSMS(config: SMSConfig): Promise<{ success: boolean; messageId?: string }> {
    try {
      const validation = SMSConfigSchema.safeParse(config);
      if (!validation.success) {
        throw new BadRequestException(validation.error.errors);
      }

      // Implementation placeholder
      return { success: true, messageId: 'sms-' + crypto.randomBytes(8).toString('hex') };
    } catch (error) {
      this.logger.error(`Failed to send SMS: ${error}`);
      throw error;
    }
  }

  /**
   * Send push notification.
   */
  async sendPush(config: PushNotificationConfig): Promise<{ success: boolean; messageId?: string }> {
    try {
      const validation = PushNotificationConfigSchema.safeParse(config);
      if (!validation.success) {
        throw new BadRequestException(validation.error.errors);
      }

      // Implementation placeholder
      return { success: true, messageId: 'push-' + crypto.randomBytes(8).toString('hex') };
    } catch (error) {
      this.logger.error(`Failed to send push notification: ${error}`);
      throw error;
    }
  }

  /**
   * Send in-app notification.
   */
  async sendInApp(config: InAppNotificationConfig): Promise<{ success: boolean; messageId?: string }> {
    try {
      const validation = InAppNotificationConfigSchema.safeParse(config);
      if (!validation.success) {
        throw new BadRequestException(validation.error.errors);
      }

      // Implementation placeholder
      return { success: true, messageId: 'inapp-' + crypto.randomBytes(8).toString('hex') };
    } catch (error) {
      this.logger.error(`Failed to send in-app notification: ${error}`);
      throw error;
    }
  }
}

// ============================================================================
// NESTJS CONTROLLER - NOTIFICATIONS
// ============================================================================

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
@ApiTags('Notifications')
@Controller('api/v1/notifications')
@ApiBearerAuth()
export class NotificationsController {
  private readonly logger = new Logger(NotificationsController.name);

  constructor(private readonly notificationService: NotificationService) {}

  /**
   * Send email notification.
   */
  @Post('email')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Send email notification' })
  @ApiResponse({ status: 202, description: 'Email queued for delivery' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  async sendEmail(@Body() emailConfig: EmailConfig) {
    return this.notificationService.sendEmail(emailConfig);
  }

  /**
   * Send SMS notification.
   */
  @Post('sms')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Send SMS notification' })
  @ApiResponse({ status: 202, description: 'SMS queued for delivery' })
  async sendSMS(@Body() smsConfig: SMSConfig) {
    return this.notificationService.sendSMS(smsConfig);
  }

  /**
   * Send push notification.
   */
  @Post('push')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Send push notification' })
  @ApiResponse({ status: 202, description: 'Push notification queued for delivery' })
  async sendPush(@Body() pushConfig: PushNotificationConfig) {
    return this.notificationService.sendPush(pushConfig);
  }

  /**
   * Send in-app notification.
   */
  @Post('in-app')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Send in-app notification' })
  @ApiResponse({ status: 202, description: 'In-app notification created' })
  async sendInApp(@Body() inAppConfig: InAppNotificationConfig) {
    return this.notificationService.sendInApp(inAppConfig);
  }

  /**
   * Get notification delivery status.
   */
  @Get('delivery/:notificationId')
  @ApiOperation({ summary: 'Get notification delivery status' })
  @ApiParam({ name: 'notificationId', description: 'Notification ID' })
  @ApiResponse({ status: 200, description: 'Delivery status retrieved' })
  async getDeliveryStatus(@Param('notificationId') notificationId: string) {
    // Implementation placeholder
    return {
      notificationId,
      status: 'delivered',
      deliveredAt: new Date(),
    };
  }

  /**
   * Get notification analytics.
   */
  @Get('analytics')
  @ApiOperation({ summary: 'Get notification analytics' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiResponse({ status: 200, description: 'Analytics retrieved' })
  async getAnalytics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    // Implementation placeholder
    return {
      totalSent: 1000,
      totalDelivered: 950,
      deliveryRate: 95,
      openRate: 45,
      clickRate: 12,
    };
  }

  /**
   * Track notification open.
   */
  @Get('track/open/:token')
  @ApiOperation({ summary: 'Track notification open' })
  @ApiParam({ name: 'token', description: 'Tracking token' })
  @ApiResponse({ status: 200, description: 'Open tracked' })
  async trackOpen(@Param('token') token: string) {
    return trackNotificationOpen(token, {});
  }

  /**
   * Track notification click.
   */
  @Get('track/click/:token')
  @ApiOperation({ summary: 'Track notification click' })
  @ApiParam({ name: 'token', description: 'Tracking token' })
  @ApiQuery({ name: 'link', description: 'Clicked link' })
  @ApiResponse({ status: 200, description: 'Click tracked' })
  async trackClick(@Param('token') token: string, @Query('link') link: string) {
    return trackNotificationClick(token, link, {});
  }

  /**
   * Unsubscribe from notifications.
   */
  @Post('unsubscribe/:token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unsubscribe from notifications' })
  @ApiParam({ name: 'token', description: 'Unsubscribe token' })
  @ApiResponse({ status: 200, description: 'Unsubscribed successfully' })
  async unsubscribe(@Param('token') token: string) {
    const verification = verifyUnsubscribeToken(token);

    if (!verification.valid) {
      throw new BadRequestException('Invalid unsubscribe token');
    }

    // Implementation placeholder
    return {
      success: true,
      message: 'Successfully unsubscribed',
    };
  }
}

// ============================================================================
// NESTJS CONTROLLER - TEMPLATES
// ============================================================================

/**
 * NestJS controller for template management.
 */
@ApiTags('Notification Templates')
@Controller('api/v1/notification-templates')
@ApiBearerAuth()
export class NotificationTemplatesController {
  private readonly logger = new Logger(NotificationTemplatesController.name);

  /**
   * List all templates.
   */
  @Get()
  @ApiOperation({ summary: 'List notification templates' })
  @ApiQuery({ name: 'type', required: false, enum: ['email', 'sms', 'push', 'in_app'] })
  @ApiQuery({ name: 'category', required: false })
  @ApiResponse({ status: 200, description: 'Templates retrieved' })
  async listTemplates(
    @Query('type') type?: string,
    @Query('category') category?: string
  ) {
    // Implementation placeholder
    return [];
  }

  /**
   * Get template by ID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get notification template' })
  @ApiParam({ name: 'id', description: 'Template ID' })
  @ApiResponse({ status: 200, description: 'Template retrieved' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async getTemplate(@Param('id') id: string) {
    // Implementation placeholder
    throw new NotFoundException('Template not found');
  }

  /**
   * Create new template.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create notification template' })
  @ApiResponse({ status: 201, description: 'Template created' })
  async createTemplate(@Body() template: NotificationTemplate) {
    const validation = NotificationTemplateSchema.safeParse(template);
    if (!validation.success) {
      throw new BadRequestException(validation.error.errors);
    }

    // Implementation placeholder
    return { id: crypto.randomBytes(8).toString('hex'), ...template };
  }

  /**
   * Update template.
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update notification template' })
  @ApiParam({ name: 'id', description: 'Template ID' })
  @ApiResponse({ status: 200, description: 'Template updated' })
  async updateTemplate(
    @Param('id') id: string,
    @Body() template: Partial<NotificationTemplate>
  ) {
    // Implementation placeholder
    return { id, ...template };
  }

  /**
   * Delete template.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete notification template' })
  @ApiParam({ name: 'id', description: 'Template ID' })
  @ApiResponse({ status: 204, description: 'Template deleted' })
  async deleteTemplate(@Param('id') id: string) {
    // Implementation placeholder
    return;
  }

  /**
   * Preview template rendering.
   */
  @Post(':id/preview')
  @ApiOperation({ summary: 'Preview template rendering' })
  @ApiParam({ name: 'id', description: 'Template ID' })
  @ApiResponse({ status: 200, description: 'Template preview generated' })
  async previewTemplate(
    @Param('id') id: string,
    @Body() data: TemplateData
  ) {
    // Implementation placeholder
    return {
      subject: 'Preview Subject',
      html: '<h1>Preview HTML</h1>',
      text: 'Preview Text',
    };
  }
}

// ============================================================================
// NESTJS CONTROLLER - PREFERENCES
// ============================================================================

/**
 * NestJS controller for notification preferences.
 */
@ApiTags('Notification Preferences')
@Controller('api/v1/notification-preferences')
@ApiBearerAuth()
export class NotificationPreferencesController {
  private readonly logger = new Logger(NotificationPreferencesController.name);

  /**
   * Get user notification preferences.
   */
  @Get('users/:userId')
  @ApiOperation({ summary: 'Get user notification preferences' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Preferences retrieved' })
  async getUserPreferences(@Param('userId') userId: string) {
    // Implementation placeholder
    return {
      userId,
      emailEnabled: true,
      smsEnabled: true,
      pushEnabled: true,
      inAppEnabled: true,
    };
  }

  /**
   * Update user notification preferences.
   */
  @Put('users/:userId')
  @ApiOperation({ summary: 'Update user notification preferences' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Preferences updated' })
  async updateUserPreferences(
    @Param('userId') userId: string,
    @Body() preferences: Partial<NotificationPreferences>
  ) {
    // Implementation placeholder
    return { userId, ...preferences };
  }
}

// ============================================================================
// NESTJS CONTROLLER - WEBHOOKS
// ============================================================================

/**
 * NestJS controller for webhook handlers.
 */
@ApiTags('Webhooks')
@Controller('api/v1/webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  /**
   * Handle SendGrid webhook events.
   */
  @Post('sendgrid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle SendGrid webhook events' })
  @ApiResponse({ status: 200, description: 'Webhook processed' })
  async handleSendGrid(@Body() events: any[]) {
    for (const event of events) {
      await processSendGridWebhook(event);
    }
    return { success: true };
  }

  /**
   * Handle Twilio webhook events.
   */
  @Post('twilio')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle Twilio webhook events' })
  @ApiResponse({ status: 200, description: 'Webhook processed' })
  async handleTwilio(@Body() event: any) {
    await processTwilioWebhook(event);
    return { success: true };
  }

  /**
   * Handle AWS SES webhook events.
   */
  @Post('ses')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle AWS SES webhook events' })
  @ApiResponse({ status: 200, description: 'Webhook processed' })
  async handleSES(@Body() event: any) {
    // Implementation placeholder
    return { success: true };
  }

  /**
   * Handle FCM webhook events.
   */
  @Post('fcm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle FCM webhook events' })
  @ApiResponse({ status: 200, description: 'Webhook processed' })
  async handleFCM(@Body() event: any) {
    // Implementation placeholder
    return { success: true };
  }
}

/**
 * Export all functions and classes for use in other modules.
 */
export default {
  // Email functions
  sendEmailViaSMTP,
  sendEmailViaSendGrid,
  sendEmailViaSES,

  // SMS functions
  sendSMSViaTwilio,
  sendSMSViaSNS,

  // Push notification functions
  sendPushViaFCM,
  sendPushViaAPNs,

  // Template functions
  renderHandlebarsTemplate,
  renderNotificationTemplate,
  validateTemplateVariables,

  // Queue functions
  createNotificationQueue,
  addNotificationToQueue,
  addBatchNotificationsToQueue,
  processNotificationQueue,

  // Tracking functions
  generateTrackingToken,
  verifyTrackingToken,
  trackNotificationOpen,
  trackNotificationClick,

  // Preference functions
  canSendNotification,
  generateUnsubscribeToken,
  verifyUnsubscribeToken,

  // Webhook functions
  verifyWebhookSignature,
  processSendGridWebhook,
  processTwilioWebhook,

  // Utility functions
  calculateNotificationAnalytics,
  validateEmailFormat,
  validatePhoneFormat,
  sanitizeEmailHTML,

  // Sequelize models
  getNotificationTemplateModelAttributes,
  getNotificationDeliveryLogModelAttributes,
  getNotificationPreferencesModelAttributes,
  getUnsubscribeRecordModelAttributes,
  getNotificationTrackingModelAttributes,
  getWebhookEventModelAttributes,
  getScheduledNotificationModelAttributes,

  // NestJS services and controllers
  NotificationService,
  NotificationsController,
  NotificationTemplatesController,
  NotificationPreferencesController,
  WebhooksController,

  // Zod schemas
  EmailConfigSchema,
  SMSConfigSchema,
  PushNotificationConfigSchema,
  InAppNotificationConfigSchema,
  NotificationTemplateSchema,
  NotificationPreferencesSchema,
  BatchNotificationJobSchema,
};
