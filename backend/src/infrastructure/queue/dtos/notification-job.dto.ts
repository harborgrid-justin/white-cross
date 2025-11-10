/**
 * @fileoverview Notification Job DTOs
 * @module infrastructure/queue/dtos
 * @description Data transfer objects for notification jobs
 */

import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BaseQueueJob } from '../interfaces';

/**
 * Notification type enumeration
 */
export enum NotificationType {
  PUSH = 'push',
  EMAIL = 'email',
  SMS = 'sms',
  IN_APP = 'in_app',
}

/**
 * Notification priority
 */
export enum NotificationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

/**
 * Push notification payload
 */
export class PushNotificationPayload {
  /**
   * Notification title
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  /**
   * Notification body
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  body: string;

  /**
   * Icon URL
   */
  @IsUrl()
  @IsOptional()
  icon?: string;

  /**
   * Action URL when notification is clicked
   */
  @IsString()
  @IsOptional()
  clickAction?: string;

  /**
   * Custom data
   */
  @IsObject()
  @IsOptional()
  data?: Record<string, any>;
}

/**
 * Email notification payload
 */
export class EmailNotificationPayload {
  /**
   * Email subject
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  subject: string;

  /**
   * Email body (HTML)
   */
  @IsString()
  @IsNotEmpty()
  htmlBody: string;

  /**
   * Email body (plain text)
   */
  @IsString()
  @IsOptional()
  textBody?: string;

  /**
   * Template ID to use
   */
  @IsString()
  @IsOptional()
  templateId?: string;

  /**
   * Template variables
   */
  @IsObject()
  @IsOptional()
  templateData?: Record<string, any>;
}

/**
 * DTO for notification job
 * Handles sending notifications (push, email, SMS, in-app)
 */
export class NotificationJobDto implements BaseQueueJob {
  /**
   * Notification ID
   */
  @IsUUID()
  @IsOptional()
  notificationId?: string;

  /**
   * Related message ID (if triggered by a message)
   */
  @IsUUID()
  @IsOptional()
  messageId?: string;

  /**
   * Recipient user ID
   */
  @IsUUID()
  @IsNotEmpty()
  recipientId: string;

  /**
   * Notification type
   */
  @IsEnum(NotificationType)
  @IsNotEmpty()
  type: NotificationType;

  /**
   * Notification priority
   */
  @IsEnum(NotificationPriority)
  @IsOptional()
  priority?: NotificationPriority;

  /**
   * Push notification payload (if type is PUSH)
   */
  @ValidateNested()
  @Type(() => PushNotificationPayload)
  @IsOptional()
  pushPayload?: PushNotificationPayload;

  /**
   * Email notification payload (if type is EMAIL)
   */
  @ValidateNested()
  @Type(() => EmailNotificationPayload)
  @IsOptional()
  emailPayload?: EmailNotificationPayload;

  /**
   * Recipient email address (for EMAIL type)
   */
  @IsEmail()
  @IsOptional()
  recipientEmail?: string;

  /**
   * Recipient phone number (for SMS type)
   */
  @IsString()
  @IsOptional()
  recipientPhone?: string;

  /**
   * Device tokens for push notifications
   */
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  deviceTokens?: string[];

  /**
   * Notification title
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  /**
   * Notification message
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  message: string;

  /**
   * Job creation timestamp
   */
  @IsDateString()
  createdAt: Date;

  /**
   * User who initiated the job
   */
  @IsString()
  @IsOptional()
  initiatedBy?: string;

  /**
   * Job identifier
   */
  @IsString()
  @IsOptional()
  jobId?: string;

  /**
   * Additional metadata
   */
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
