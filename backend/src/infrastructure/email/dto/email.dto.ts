/**
 * @fileoverview Email DTOs and Interfaces
 * @module infrastructure/email/dto
 * @description Comprehensive data transfer objects and interfaces for email operations
 * with validation decorators and type safety
 */

import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AlertCategory, AlertSeverity } from '../../../services/alerts';

/**
 * Email priority levels
 */
export enum EmailPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

/**
 * Email template types
 */
export enum EmailTemplate {
  ALERT = 'alert',
  NOTIFICATION = 'notification',
  WELCOME = 'welcome',
  PASSWORD_RESET = 'password-reset',
  CUSTOM = 'custom',
}

/**
 * Email attachment DTO
 */
export class EmailAttachmentDto {
  /**
   * Filename of the attachment
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  filename: string;

  /**
   * Content of the attachment (base64 encoded or buffer)
   */
  @IsNotEmpty()
  content: string | Buffer;

  /**
   * MIME type of the attachment
   */
  @IsString()
  @IsOptional()
  contentType?: string;

  /**
   * Content disposition (attachment or inline)
   */
  @IsString()
  @IsOptional()
  disposition?: 'attachment' | 'inline';

  /**
   * Content ID for inline attachments (for embedding in HTML)
   */
  @IsString()
  @IsOptional()
  cid?: string;
}

/**
 * Alert email data structure
 * Used for sending alert notifications via email
 */
export interface AlertEmailData {
  title: string;
  message: string;
  severity: AlertSeverity;
  category: AlertCategory;
  alertId: string;
  timestamp?: Date;
  additionalInfo?: Record<string, unknown>;
}

/**
 * Generic email data structure
 * Used for sending general-purpose emails
 */
export interface GenericEmailData {
  subject: string;
  body: string;
  html?: string;
}

/**
 * Email delivery result
 * Returned after email send operations
 */
export interface EmailDeliveryResult {
  success: boolean;
  messageId?: string;
  error?: string;
  timestamp?: Date;
  recipients?: string[];
}

/**
 * Comprehensive email sending DTO
 */
export class SendEmailDto {
  /**
   * Recipient email address(es)
   */
  @IsArray()
  @IsEmail({}, { each: true })
  @IsNotEmpty()
  to: string[];

  /**
   * Sender email address (optional, uses default if not provided)
   */
  @IsEmail()
  @IsOptional()
  from?: string;

  /**
   * CC recipients
   */
  @IsArray()
  @IsEmail({}, { each: true })
  @IsOptional()
  cc?: string[];

  /**
   * BCC recipients
   */
  @IsArray()
  @IsEmail({}, { each: true })
  @IsOptional()
  bcc?: string[];

  /**
   * Reply-to email address
   */
  @IsEmail()
  @IsOptional()
  replyTo?: string;

  /**
   * Email subject line
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(500)
  subject: string;

  /**
   * Plain text body
   */
  @IsString()
  @IsNotEmpty()
  body: string;

  /**
   * HTML body (optional)
   */
  @IsString()
  @IsOptional()
  html?: string;

  /**
   * Email attachments
   */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EmailAttachmentDto)
  @IsOptional()
  attachments?: EmailAttachmentDto[];

  /**
   * Email priority
   */
  @IsEnum(EmailPriority)
  @IsOptional()
  priority?: EmailPriority;

  /**
   * Template to use (if any)
   */
  @IsEnum(EmailTemplate)
  @IsOptional()
  template?: EmailTemplate;

  /**
   * Template data (variables for template rendering)
   */
  @IsObject()
  @IsOptional()
  templateData?: Record<string, unknown>;

  /**
   * Whether to queue this email (default: true)
   */
  @IsBoolean()
  @IsOptional()
  queue?: boolean;

  /**
   * Delay before sending (in milliseconds, for queued emails)
   */
  @IsOptional()
  delay?: number;

  /**
   * Custom headers
   */
  @IsObject()
  @IsOptional()
  headers?: Record<string, string>;

  /**
   * Tags for tracking and categorization
   */
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}

/**
 * Email template data DTO
 */
export class EmailTemplateDataDto {
  /**
   * Template name
   */
  @IsEnum(EmailTemplate)
  template: EmailTemplate;

  /**
   * Variables for template rendering
   */
  @IsObject()
  @IsNotEmpty()
  data: Record<string, unknown>;
}

/**
 * Email tracking data
 */
export interface EmailTrackingData {
  messageId: string;
  recipients: string[];
  subject: string;
  template?: EmailTemplate;
  status: 'pending' | 'sent' | 'failed' | 'queued';
  sentAt?: Date;
  queuedAt?: Date;
  failedAt?: Date;
  error?: string;
  retryCount?: number;
  tags?: string[];
}

/**
 * Email queue job data
 */
export interface EmailQueueJobData {
  id: string;
  emailData: SendEmailDto;
  priority: EmailPriority;
  retryCount: number;
  maxRetries: number;
  createdAt: Date;
  scheduledFor?: Date;
}

/**
 * Email queue job result
 */
export interface EmailQueueJobResult {
  jobId: string;
  messageId?: string;
  success: boolean;
  error?: string;
  retryCount: number;
  completedAt: Date;
}

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  /**
   * Maximum emails per time window
   */
  maxEmails: number;

  /**
   * Time window in milliseconds
   */
  windowMs: number;

  /**
   * Rate limit scope (per-recipient or global)
   */
  scope: 'recipient' | 'global';
}

/**
 * Rate limit status
 */
export interface RateLimitStatus {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  identifier: string;
}

/**
 * Email configuration interface
 */
export interface EmailConfig {
  /**
   * SMTP configuration
   */
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };

  /**
   * Default sender information
   */
  defaults: {
    from: string;
    replyTo?: string;
  };

  /**
   * Queue configuration
   */
  queue: {
    enabled: boolean;
    redis: {
      host: string;
      port: number;
      password?: string;
    };
    defaultJobOptions: {
      attempts: number;
      backoff: {
        type: 'exponential' | 'fixed';
        delay: number;
      };
      removeOnComplete: boolean;
      removeOnFail: boolean;
    };
  };

  /**
   * Rate limiting configuration
   */
  rateLimit: {
    enabled: boolean;
    global: RateLimitConfig;
    perRecipient: RateLimitConfig;
  };

  /**
   * Template configuration
   */
  templates: {
    directory: string;
    cacheEnabled: boolean;
  };
}

/**
 * Bulk email DTO
 */
export class BulkEmailDto {
  /**
   * Array of individual email data
   */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SendEmailDto)
  @IsNotEmpty()
  emails: SendEmailDto[];

  /**
   * Whether to stop on first error
   */
  @IsBoolean()
  @IsOptional()
  stopOnError?: boolean;
}

/**
 * Email validation result
 */
export interface EmailValidationResult {
  valid: boolean;
  email: string;
  reason?: string;
}

/**
 * Email statistics
 */
export interface EmailStatistics {
  totalSent: number;
  totalFailed: number;
  totalQueued: number;
  averageDeliveryTime: number;
  successRate: number;
  period: {
    start: Date;
    end: Date;
  };
}
