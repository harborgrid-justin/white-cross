/**
 * Message DTOs for communication domain
 * Manages internal messages and communications between users
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

export enum MessageType {
  DIRECT = 'direct',
  GROUP = 'group',
  ANNOUNCEMENT = 'announcement',
  SYSTEM = 'system',
  ALERT = 'alert',
}

export enum MessageStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  ARCHIVED = 'archived',
}

export enum MessagePriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

/**
 * Message content DTO
 */
export class MessageContentDto {
  @ApiProperty({
    description: 'Message subject',
    example: 'Degree Audit Review',
  })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    description: 'Message body/content',
    example: 'Please review the attached degree audit for corrections',
  })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiPropertyOptional({
    description: 'HTML formatted content',
    example: '<p>Please review the attached degree audit for corrections</p>',
  })
  @IsOptional()
  @IsString()
  htmlContent?: string;

  @ApiPropertyOptional({
    description: 'Message tags/categories',
    type: [String],
    example: ['important', 'action_required'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Mention recipients',
    type: [String],
    example: ['jane.smith@institution.edu'],
  })
  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  mentions?: string[];
}

/**
 * Message attachment DTO
 */
export class MessageAttachmentDto {
  @ApiProperty({
    description: 'Attachment ID',
    example: 'ATT-2025001',
  })
  @IsString()
  @IsNotEmpty()
  attachmentId: string;

  @ApiProperty({
    description: 'File name',
    example: 'degree-audit-2025.pdf',
  })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 2048576,
  })
  @IsNumber()
  @Min(0)
  fileSize: number;

  @ApiProperty({
    description: 'MIME type',
    example: 'application/pdf',
  })
  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @ApiPropertyOptional({
    description: 'File path or URL',
    example: 's3://bucket/attachments/degree-audit-2025.pdf',
  })
  @IsOptional()
  @IsString()
  filePath?: string;

  @ApiPropertyOptional({
    description: 'Upload timestamp',
    example: '2025-11-10T10:30:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  uploadedAt?: Date;
}

/**
 * Direct message DTO
 */
export class DirectMessageDto {
  @ApiProperty({
    description: 'Message ID',
    example: 'MSG-2025001',
  })
  @IsString()
  @IsNotEmpty()
  messageId: string;

  @ApiProperty({
    description: 'Message type',
    enum: MessageType,
    example: MessageType.DIRECT,
  })
  @IsEnum(MessageType)
  messageType: MessageType;

  @ApiProperty({
    description: 'Sender email',
    example: 'john.doe@institution.edu',
  })
  @IsEmail()
  sender: string;

  @ApiProperty({
    description: 'Recipient email',
    example: 'jane.smith@institution.edu',
  })
  @IsEmail()
  recipient: string;

  @ApiProperty({
    description: 'Message content',
    type: MessageContentDto,
  })
  @ValidateNested()
  @Type(() => MessageContentDto)
  content: MessageContentDto;

  @ApiProperty({
    description: 'Message status',
    enum: MessageStatus,
    example: MessageStatus.DELIVERED,
  })
  @IsEnum(MessageStatus)
  status: MessageStatus;

  @ApiProperty({
    description: 'Message priority',
    enum: MessagePriority,
    example: MessagePriority.NORMAL,
  })
  @IsEnum(MessagePriority)
  priority: MessagePriority;

  @ApiProperty({
    description: 'Sent timestamp',
    example: '2025-11-10T10:30:00Z',
  })
  @IsDate()
  @Type(() => Date)
  sentAt: Date;

  @ApiPropertyOptional({
    description: 'Delivered timestamp',
    example: '2025-11-10T10:30:05Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  deliveredAt?: Date;

  @ApiPropertyOptional({
    description: 'Read timestamp',
    example: '2025-11-10T11:00:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readAt?: Date;

  @ApiPropertyOptional({
    description: 'Message attachments',
    type: [MessageAttachmentDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageAttachmentDto)
  attachments?: MessageAttachmentDto[];

  @ApiPropertyOptional({
    description: 'Message is archived',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;

  @ApiPropertyOptional({
    description: 'Reply to message ID',
    example: 'MSG-2025000',
  })
  @IsOptional()
  @IsString()
  replyToMessageId?: string;
}

/**
 * Group message DTO
 */
export class GroupMessageDto {
  @ApiProperty({
    description: 'Message ID',
    example: 'GMSG-2025001',
  })
  @IsString()
  @IsNotEmpty()
  messageId: string;

  @ApiProperty({
    description: 'Group ID/thread ID',
    example: 'GROUP-2025001',
  })
  @IsString()
  @IsNotEmpty()
  groupId: string;

  @ApiProperty({
    description: 'Group name',
    example: 'Registrar Team Discussion',
  })
  @IsString()
  @IsNotEmpty()
  groupName: string;

  @ApiProperty({
    description: 'Message sender',
    example: 'jane.smith@institution.edu',
  })
  @IsEmail()
  sender: string;

  @ApiProperty({
    description: 'Message content',
    type: MessageContentDto,
  })
  @ValidateNested()
  @Type(() => MessageContentDto)
  content: MessageContentDto;

  @ApiProperty({
    description: 'Message status',
    enum: MessageStatus,
    example: MessageStatus.DELIVERED,
  })
  @IsEnum(MessageStatus)
  status: MessageStatus;

  @ApiProperty({
    description: 'Message sent timestamp',
    example: '2025-11-10T10:30:00Z',
  })
  @IsDate()
  @Type(() => Date)
  sentAt: Date;

  @ApiPropertyOptional({
    description: 'Reactions to message (emoji)',
    type: 'object',
    example: { '+1': 2, 'thumbsup': 1 },
  })
  @IsOptional()
  reactions?: Record<string, number>;

  @ApiPropertyOptional({
    description: 'Message is pinned in group',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;

  @ApiPropertyOptional({
    description: 'Number of thread replies',
    example: 3,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  replyCount?: number;

  @ApiPropertyOptional({
    description: 'Message attachments',
    type: [MessageAttachmentDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageAttachmentDto)
  attachments?: MessageAttachmentDto[];
}

/**
 * Message thread DTO
 */
export class MessageThreadDto {
  @ApiProperty({
    description: 'Thread ID',
    example: 'THREAD-2025001',
  })
  @IsString()
  @IsNotEmpty()
  threadId: string;

  @ApiProperty({
    description: 'Original message in thread',
    example: 'MSG-2025001',
  })
  @IsString()
  @IsNotEmpty()
  originalMessageId: string;

  @ApiProperty({
    description: 'Thread participants',
    type: [String],
    example: ['john.doe@institution.edu', 'jane.smith@institution.edu', 'admin@institution.edu'],
  })
  @IsArray()
  @IsEmail({}, { each: true })
  participants: string[];

  @ApiProperty({
    description: 'Total replies in thread',
    example: 5,
  })
  @IsNumber()
  @Min(0)
  replyCount: number;

  @ApiProperty({
    description: 'Thread created timestamp',
    example: '2025-11-10T10:30:00Z',
  })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiPropertyOptional({
    description: 'Last activity timestamp',
    example: '2025-11-10T14:45:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastActivityAt?: Date;

  @ApiPropertyOptional({
    description: 'Thread is resolved',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isResolved?: boolean;

  @ApiPropertyOptional({
    description: 'Unread count for current user',
    example: 2,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  unreadCount?: number;
}

/**
 * Message search query DTO
 */
export class MessageSearchQueryDto {
  @ApiPropertyOptional({
    description: 'Search text in subject/content',
    example: 'degree audit',
  })
  @IsOptional()
  @IsString()
  searchText?: string;

  @ApiPropertyOptional({
    description: 'From sender (email)',
    example: 'jane.smith@institution.edu',
  })
  @IsOptional()
  @IsEmail()
  fromSender?: string;

  @ApiPropertyOptional({
    description: 'To recipient (email)',
    example: 'john.doe@institution.edu',
  })
  @IsOptional()
  @IsEmail()
  toRecipient?: string;

  @ApiPropertyOptional({
    description: 'After date filter',
    example: '2025-11-01',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  afterDate?: Date;

  @ApiPropertyOptional({
    description: 'Before date filter',
    example: '2025-11-10',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  beforeDate?: Date;

  @ApiPropertyOptional({
    description: 'Has attachments filter',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  hasAttachments?: boolean;

  @ApiPropertyOptional({
    description: 'Priority filter',
    enum: MessagePriority,
    example: MessagePriority.HIGH,
  })
  @IsOptional()
  @IsEnum(MessagePriority)
  priority?: MessagePriority;

  @ApiPropertyOptional({
    description: 'Status filter',
    enum: MessageStatus,
    example: MessageStatus.READ,
  })
  @IsOptional()
  @IsEnum(MessageStatus)
  status?: MessageStatus;

  @ApiPropertyOptional({
    description: 'Tags filter',
    type: [String],
    example: ['important'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

/**
 * Message read receipt DTO
 */
export class MessageReadReceiptDto {
  @ApiProperty({
    description: 'Receipt ID',
    example: 'RECEIPT-2025001',
  })
  @IsString()
  @IsNotEmpty()
  receiptId: string;

  @ApiProperty({
    description: 'Message ID being acknowledged',
    example: 'MSG-2025001',
  })
  @IsString()
  @IsNotEmpty()
  messageId: string;

  @ApiProperty({
    description: 'Reader email',
    example: 'jane.smith@institution.edu',
  })
  @IsEmail()
  readBy: string;

  @ApiProperty({
    description: 'Read timestamp',
    example: '2025-11-10T11:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  readAt: Date;

  @ApiPropertyOptional({
    description: 'Receipt type',
    enum: ['seen', 'opened', 'clicked'],
    example: 'opened',
  })
  @IsOptional()
  @IsEnum(['seen', 'opened', 'clicked'])
  receiptType?: string;
}
