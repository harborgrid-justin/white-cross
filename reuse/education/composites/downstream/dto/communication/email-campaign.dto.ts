/**
 * Email Campaign DTOs for communication domain
 * Manages email campaigns and bulk communications
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
  IsUrl,
  Min,
  Max,
} from 'class-validator';

export enum CampaignStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  SENDING = 'sending',
  COMPLETED = 'completed',
  PAUSED = 'paused',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
}

export enum CampaignType {
  ANNOUNCEMENT = 'announcement',
  PROMOTION = 'promotion',
  REMINDER = 'reminder',
  SURVEY = 'survey',
  EVENT = 'event',
  RECRUITMENT = 'recruitment',
  RETENTION = 'retention',
}

export enum AudienceSegment {
  ALL_STUDENTS = 'all_students',
  NEW_STUDENTS = 'new_students',
  GRADUATING_STUDENTS = 'graduating_students',
  AT_RISK_STUDENTS = 'at_risk_students',
  ALUMNI = 'alumni',
  PARENTS = 'parents',
  FACULTY = 'faculty',
  STAFF = 'staff',
}

/**
 * Email campaign DTO
 */
export class EmailCampaignDto {
  @ApiProperty({
    description: 'Campaign ID',
    example: 'CAMPAIGN-2025001',
  })
  @IsString()
  @IsNotEmpty()
  campaignId: string;

  @ApiProperty({
    description: 'Campaign name',
    example: 'Fall 2025 Registration Reminder',
  })
  @IsString()
  @IsNotEmpty()
  campaignName: string;

  @ApiPropertyOptional({
    description: 'Campaign description',
    example: 'Reminder email for students to complete fall registration',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Campaign type',
    enum: CampaignType,
    example: CampaignType.REMINDER,
  })
  @IsEnum(CampaignType)
  campaignType: CampaignType;

  @ApiProperty({
    description: 'Campaign status',
    enum: CampaignStatus,
    example: CampaignStatus.SCHEDULED,
  })
  @IsEnum(CampaignStatus)
  status: CampaignStatus;

  @ApiProperty({
    description: 'From email address',
    example: 'registrar@institution.edu',
  })
  @IsEmail()
  fromEmail: string;

  @ApiPropertyOptional({
    description: 'From display name',
    example: 'Registrar Office',
  })
  @IsOptional()
  @IsString()
  fromName?: string;

  @ApiProperty({
    description: 'Email subject',
    example: 'Important: Complete Your Fall 2025 Registration',
  })
  @IsString()
  @IsNotEmpty()
  emailSubject: string;

  @ApiPropertyOptional({
    description: 'Preview text shown in email clients',
    example: 'Complete your Fall 2025 registration by August 15...',
  })
  @IsOptional()
  @IsString()
  previewText?: string;

  @ApiProperty({
    description: 'Email body (HTML)',
    example: '<h1>Registration Reminder</h1><p>Please complete your fall registration...</p>',
  })
  @IsString()
  @IsNotEmpty()
  htmlContent: string;

  @ApiPropertyOptional({
    description: 'Email body (plain text)',
    example: 'Registration Reminder\n\nPlease complete your fall registration...',
  })
  @IsOptional()
  @IsString()
  plainTextContent?: string;

  @ApiProperty({
    description: 'Target audience segment',
    enum: AudienceSegment,
    example: AudienceSegment.ALL_STUDENTS,
  })
  @IsEnum(AudienceSegment)
  audienceSegment: AudienceSegment;

  @ApiPropertyOptional({
    description: 'Additional audience filters',
    type: 'object',
    example: { major: 'Computer Science', classYear: 2025 },
  })
  @IsOptional()
  audienceFilters?: Record<string, any>;

  @ApiProperty({
    description: 'Estimated recipient count',
    example: 2500,
  })
  @IsNumber()
  @Min(0)
  estimatedRecipientCount: number;

  @ApiPropertyOptional({
    description: 'Scheduled send time',
    example: '2025-08-01T09:00:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  scheduledSendTime?: Date;

  @ApiPropertyOptional({
    description: 'Campaign start date',
    example: '2025-08-01',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  campaignStartDate?: Date;

  @ApiPropertyOptional({
    description: 'Campaign end date',
    example: '2025-08-15',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  campaignEndDate?: Date;

  @ApiPropertyOptional({
    description: 'Track open rates',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  trackOpens?: boolean;

  @ApiPropertyOptional({
    description: 'Track click rates',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  trackClicks?: boolean;

  @ApiPropertyOptional({
    description: 'Enable unsubscribe link',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  enableUnsubscribe?: boolean;

  @ApiPropertyOptional({
    description: 'Campaign created date',
    example: '2025-07-20',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdDate?: Date;

  @ApiPropertyOptional({
    description: 'Campaign created by user',
    example: 'admin@institution.edu',
  })
  @IsOptional()
  @IsString()
  createdBy?: string;

  @ApiPropertyOptional({
    description: 'Last modified date',
    example: '2025-07-25',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastModifiedDate?: Date;
}

/**
 * Email campaign analytics DTO
 */
export class EmailCampaignAnalyticsDto {
  @ApiProperty({
    description: 'Analytics ID',
    example: 'ANALYTICS-2025001',
  })
  @IsString()
  @IsNotEmpty()
  analyticsId: string;

  @ApiProperty({
    description: 'Campaign ID',
    example: 'CAMPAIGN-2025001',
  })
  @IsString()
  @IsNotEmpty()
  campaignId: string;

  @ApiProperty({
    description: 'Total emails sent',
    example: 2450,
  })
  @IsNumber()
  @Min(0)
  emailsSent: number;

  @ApiPropertyOptional({
    description: 'Emails delivered',
    example: 2410,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  emailsDelivered?: number;

  @ApiPropertyOptional({
    description: 'Delivery rate percentage',
    example: 98.4,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  deliveryRate?: number;

  @ApiPropertyOptional({
    description: 'Emails opened',
    example: 1204,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  emailsOpened?: number;

  @ApiPropertyOptional({
    description: 'Open rate percentage',
    example: 49.1,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  openRate?: number;

  @ApiPropertyOptional({
    description: 'Unique opens',
    example: 1050,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  uniqueOpens?: number;

  @ApiPropertyOptional({
    description: 'Click count',
    example: 456,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  clicks?: number;

  @ApiPropertyOptional({
    description: 'Click rate percentage',
    example: 18.6,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  clickRate?: number;

  @ApiPropertyOptional({
    description: 'Unsubscribe count',
    example: 12,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  unsubscribeCount?: number;

  @ApiPropertyOptional({
    description: 'Bounce count',
    example: 40,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bounceCount?: number;

  @ApiPropertyOptional({
    description: 'Hard bounce count',
    example: 25,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  hardBounceCount?: number;

  @ApiPropertyOptional({
    description: 'Complaint/spam count',
    example: 3,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  complaintCount?: number;

  @ApiPropertyOptional({
    description: 'Average time to open (minutes)',
    example: 45,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  averageTimeToOpen?: number;

  @ApiPropertyOptional({
    description: 'Top clicked links',
    type: 'object',
    example: { 'https://portal.institution.edu/register': 234, 'https://faq.institution.edu': 89 },
  })
  @IsOptional()
  topLinks?: Record<string, number>;

  @ApiPropertyOptional({
    description: 'Analytics timestamp',
    example: '2025-08-10T12:00:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  analyzedAt?: Date;
}

/**
 * Email list/segment DTO
 */
export class EmailListSegmentDto {
  @ApiProperty({
    description: 'List ID',
    example: 'LIST-2025001',
  })
  @IsString()
  @IsNotEmpty()
  listId: string;

  @ApiProperty({
    description: 'List name',
    example: 'Fall 2025 New Students',
  })
  @IsString()
  @IsNotEmpty()
  listName: string;

  @ApiPropertyOptional({
    description: 'List description',
    example: 'Students enrolling for first time in Fall 2025',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Predefined segment or custom',
    enum: ['predefined', 'custom', 'dynamic'],
    example: 'custom',
  })
  @IsEnum(['predefined', 'custom', 'dynamic'])
  listType: string;

  @ApiPropertyOptional({
    description: 'Segment criteria',
    type: 'object',
    example: { enrollmentYear: 2025, isFirstTime: true, status: 'enrolled' },
  })
  @IsOptional()
  segmentCriteria?: Record<string, any>;

  @ApiProperty({
    description: 'Current list size',
    example: 385,
  })
  @IsNumber()
  @Min(0)
  listSize: number;

  @ApiPropertyOptional({
    description: 'List is active',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Created date',
    example: '2025-07-01',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdDate?: Date;

  @ApiPropertyOptional({
    description: 'Last updated date',
    example: '2025-11-10',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastUpdatedDate?: Date;

  @ApiPropertyOptional({
    description: 'Used in campaigns count',
    example: 5,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  usageCount?: number;
}

/**
 * Email template library DTO
 */
export class EmailTemplateDto {
  @ApiProperty({
    description: 'Template ID',
    example: 'EMAIL-TEMPLATE-001',
  })
  @IsString()
  @IsNotEmpty()
  templateId: string;

  @ApiProperty({
    description: 'Template name',
    example: 'Registration Reminder',
  })
  @IsString()
  @IsNotEmpty()
  templateName: string;

  @ApiProperty({
    description: 'Template category',
    enum: CampaignType,
    example: CampaignType.REMINDER,
  })
  @IsEnum(CampaignType)
  category: CampaignType;

  @ApiProperty({
    description: 'Subject line template',
    example: 'Important: Complete Your {{semesterName}} Registration',
  })
  @IsString()
  @IsNotEmpty()
  subjectTemplate: string;

  @ApiProperty({
    description: 'HTML body template',
    example: '<html><body><h1>Hello {{firstName}}</h1>...</body></html>',
  })
  @IsString()
  @IsNotEmpty()
  htmlTemplate: string;

  @ApiPropertyOptional({
    description: 'Plain text template',
    example: 'Hello {{firstName}}\n\n...',
  })
  @IsOptional()
  @IsString()
  plainTextTemplate?: string;

  @ApiPropertyOptional({
    description: 'Template variables',
    type: [String],
    example: ['firstName', 'lastName', 'semesterName', 'deadline'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  variables?: string[];

  @ApiPropertyOptional({
    description: 'Preview image URL',
    example: 'https://templates.institution.edu/previews/template-001.png',
  })
  @IsOptional()
  @IsUrl()
  previewImageUrl?: string;

  @ApiProperty({
    description: 'Template is active',
    example: true,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Usage count across campaigns',
    example: 12,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  usageCount?: number;

  @ApiPropertyOptional({
    description: 'Created date',
    example: '2025-01-01',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdDate?: Date;
}
