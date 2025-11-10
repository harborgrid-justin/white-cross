/**
 * Notification DTOs for communication domain
 * Manages system notifications and alerts
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsArray,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsDate,
  IsBoolean,
  IsEmail,
  Min,
} from 'class-validator';

export enum NotificationType {
  SYSTEM = 'system',
  ACADEMIC = 'academic',
  FINANCIAL = 'financial',
  ADMINISTRATIVE = 'administrative',
  ALERT = 'alert',
  REMINDER = 'reminder',
  DEADLINE = 'deadline',
  STATUS_UPDATE = 'status_update',
}

export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
  SNOOZED = 'snoozed',
}

export enum NotificationChannel {
  IN_APP = 'in_app',
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  PORTAL = 'portal',
}

export enum NotificationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Notification DTO
 */
export class NotificationDto {
  @ApiProperty({
    description: 'Notification ID',
    example: 'NOTIF-2025001',
  })
  @IsString()
  @IsNotEmpty()
  notificationId: string;

  @ApiProperty({
    description: 'Recipient user email',
    example: 'student@institution.edu',
  })
  @IsEmail()
  recipient: string;

  @ApiProperty({
    description: 'Notification type',
    enum: NotificationType,
    example: NotificationType.ACADEMIC,
  })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({
    description: 'Notification title',
    example: 'Grades Posted for Fall 2025',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Notification message',
    example: 'Your grades for Fall 2025 semester have been posted. View your transcript.',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({
    description: 'HTML formatted message',
    example: '<p>Your grades for Fall 2025 semester have been posted. <a href=\"#\">View your transcript</a>.</p>',
  })
  @IsOptional()
  @IsString()
  htmlMessage?: string;

  @ApiProperty({
    description: 'Notification status',
    enum: NotificationStatus,
    example: NotificationStatus.UNREAD,
  })
  @IsEnum(NotificationStatus)
  status: NotificationStatus;

  @ApiProperty({
    description: 'Notification priority',
    enum: NotificationPriority,
    example: NotificationPriority.NORMAL,
  })
  @IsEnum(NotificationPriority)
  priority: NotificationPriority;

  @ApiProperty({
    description: 'Delivery channels',
    type: [String],
    enum: NotificationChannel,
    example: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
  })
  @IsArray()
  @IsEnum(NotificationChannel, { each: true })
  channels: NotificationChannel[];

  @ApiPropertyOptional({
    description: 'Related entity ID',
    example: 'COURSE-CS101',
  })
  @IsOptional()
  @IsString()
  relatedEntityId?: string;

  @ApiPropertyOptional({
    description: 'Related entity type',
    example: 'Course',
  })
  @IsOptional()
  @IsString()
  relatedEntityType?: string;

  @ApiPropertyOptional({
    description: 'Action URL or link',
    example: 'https://portal.institution.edu/grades',
  })
  @IsOptional()
  @IsString()
  actionUrl?: string;

  @ApiPropertyOptional({
    description: 'Action button text',
    example: 'View Grades',
  })
  @IsOptional()
  @IsString()
  actionButtonText?: string;

  @ApiProperty({
    description: 'Created timestamp',
    example: '2025-11-10T12:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiPropertyOptional({
    description: 'Read timestamp',
    example: '2025-11-10T12:30:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readAt?: Date;

  @ApiPropertyOptional({
    description: 'Expiration timestamp',
    example: '2025-12-10T12:00:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expiresAt?: Date;

  @ApiPropertyOptional({
    description: 'Snoozed until timestamp',
    example: '2025-11-11T09:00:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  snoozedUntil?: Date;

  @ApiPropertyOptional({
    description: 'Custom data/metadata',
    type: 'object',
  })
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Is critical notification',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isCritical?: boolean;

  @ApiPropertyOptional({
    description: 'Requires action',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  requiresAction?: boolean;
}

/**
 * Notification preference DTO
 */
export class NotificationPreferenceDto {
  @ApiProperty({
    description: 'Preference ID',
    example: 'PREF-2025001',
  })
  @IsString()
  @IsNotEmpty()
  preferenceId: string;

  @ApiProperty({
    description: 'User email',
    example: 'student@institution.edu',
  })
  @IsEmail()
  userEmail: string;

  @ApiProperty({
    description: 'Preferred notification channels',
    type: [String],
    enum: NotificationChannel,
  })
  @IsArray()
  @IsEnum(NotificationChannel, { each: true })
  preferredChannels: NotificationChannel[];

  @ApiPropertyOptional({
    description: 'Notification type preferences',
    type: 'object',
    example: {
      academic: true,
      financial: true,
      administrative: false,
      system: true,
    },
  })
  @IsOptional()
  typePreferences?: Record<string, boolean>;

  @ApiPropertyOptional({
    description: 'Do not disturb start time (HH:mm)',
    example: '22:00',
  })
  @IsOptional()
  @IsString()
  quietStartTime?: string;

  @ApiPropertyOptional({
    description: 'Do not disturb end time (HH:mm)',
    example: '08:00',
  })
  @IsOptional()
  @IsString()
  quietEndTime?: string;

  @ApiPropertyOptional({
    description: 'Email frequency preference',
    enum: ['immediate', 'hourly', 'daily', 'weekly', 'never'],
    example: 'daily',
  })
  @IsOptional()
  @IsEnum(['immediate', 'hourly', 'daily', 'weekly', 'never'])
  emailFrequency?: string;

  @ApiProperty({
    description: 'Notifications enabled globally',
    example: true,
  })
  @IsBoolean()
  notificationsEnabled: boolean;

  @ApiPropertyOptional({
    description: 'Last updated timestamp',
    example: '2025-11-10T10:30:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastUpdated?: Date;
}

/**
 * Notification template DTO
 */
export class NotificationTemplateDto {
  @ApiProperty({
    description: 'Template ID',
    example: 'TEMPLATE-001',
  })
  @IsString()
  @IsNotEmpty()
  templateId: string;

  @ApiProperty({
    description: 'Template name',
    example: 'Grades Posted Notification',
  })
  @IsString()
  @IsNotEmpty()
  templateName: string;

  @ApiProperty({
    description: 'Notification type this template is for',
    enum: NotificationType,
    example: NotificationType.ACADEMIC,
  })
  @IsEnum(NotificationType)
  notificationType: NotificationType;

  @ApiProperty({
    description: 'Email subject template',
    example: 'Your {{semesterName}} grades have been posted',
  })
  @IsString()
  @IsNotEmpty()
  emailSubject: string;

  @ApiProperty({
    description: 'Email body template',
    example: 'Hello {{studentName}}, your grades for {{semesterName}} have been posted.',
  })
  @IsString()
  @IsNotEmpty()
  emailBody: string;

  @ApiPropertyOptional({
    description: 'In-app title template',
    example: 'Grades Posted for {{semesterName}}',
  })
  @IsOptional()
  @IsString()
  inAppTitle?: string;

  @ApiPropertyOptional({
    description: 'In-app message template',
    example: 'Your grades for {{semesterName}} are now available.',
  })
  @IsOptional()
  @IsString()
  inAppMessage?: string;

  @ApiPropertyOptional({
    description: 'SMS message template',
    example: 'Your {{semesterName}} grades are posted. Check your portal.',
  })
  @IsOptional()
  @IsString()
  smsMessage?: string;

  @ApiPropertyOptional({
    description: 'Push notification template',
    example: 'Grades Posted for {{semesterName}}',
  })
  @IsOptional()
  @IsString()
  pushTitle?: string;

  @ApiPropertyOptional({
    description: 'Template variables/placeholders',
    type: [String],
    example: ['studentName', 'semesterName', 'gradeUrl'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  variables?: string[];

  @ApiProperty({
    description: 'Template is active',
    example: true,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Created date',
    example: '2025-01-01',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdDate?: Date;
}

/**
 * Notification batch send request DTO
 */
export class NotificationBatchSendRequestDto {
  @ApiProperty({
    description: 'Batch request ID',
    example: 'BATCH-2025001',
  })
  @IsString()
  @IsNotEmpty()
  batchId: string;

  @ApiProperty({
    description: 'Notification template ID to use',
    example: 'TEMPLATE-001',
  })
  @IsString()
  @IsNotEmpty()
  templateId: string;

  @ApiProperty({
    description: 'Recipients for batch send',
    type: [String],
    example: ['student1@institution.edu', 'student2@institution.edu'],
  })
  @IsArray()
  @IsEmail({}, { each: true })
  recipients: string[];

  @ApiProperty({
    description: 'Template variable values for all recipients',
    type: 'object',
    example: { semesterName: 'Fall 2025', gradeUrl: 'https://portal.institution.edu/grades' },
  })
  @IsNotEmpty()
  templateVariables: Record<string, string>;

  @ApiPropertyOptional({
    description: 'Schedule send time',
    example: '2025-11-10T12:00:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  scheduledTime?: Date;

  @ApiPropertyOptional({
    description: 'Notification channels to use',
    type: [String],
    enum: NotificationChannel,
    example: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(NotificationChannel, { each: true })
  channels?: NotificationChannel[];

  @ApiPropertyOptional({
    description: 'Send priority',
    enum: NotificationPriority,
    example: NotificationPriority.NORMAL,
  })
  @IsOptional()
  @IsEnum(NotificationPriority)
  priority?: NotificationPriority;

  @ApiProperty({
    description: 'Request submission timestamp',
    example: '2025-11-10T08:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  submittedAt: Date;

  @ApiPropertyOptional({
    description: 'Batch send status',
    enum: ['pending', 'queued', 'sending', 'completed', 'failed'],
    example: 'queued',
  })
  @IsOptional()
  @IsEnum(['pending', 'queued', 'sending', 'completed', 'failed'])
  status?: string;
}
