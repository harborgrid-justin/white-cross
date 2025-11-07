/**
 * @fileoverview Message Job DTOs
 * @module infrastructure/queue/dtos
 * @description Data transfer objects for message delivery and processing jobs
 */

import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { BaseQueueJob } from '../interfaces';

/**
 * Encryption status for messages
 */
export enum EncryptionStatus {
  NONE = 'none',
  PENDING = 'pending',
  ENCRYPTED = 'encrypted',
  FAILED = 'failed',
}

/**
 * Message delivery status
 */
export enum DeliveryStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
}

/**
 * Notification types
 */
export enum NotificationType {
  PUSH = 'push',
  EMAIL = 'email',
  SMS = 'sms',
  IN_APP = 'in_app',
}

/**
 * Message cleanup types
 */
export enum CleanupType {
  OLD_MESSAGES = 'old_messages',
  DELETED_CONVERSATIONS = 'deleted_conversations',
  EXPIRED_ATTACHMENTS = 'expired_attachments',
}

/**
 * DTO for sending a message job
 * Handles asynchronous message delivery
 */
export class SendMessageJobDto implements BaseQueueJob {
  /**
   * Unique message identifier
   */
  @IsUUID()
  @IsNotEmpty()
  messageId: string;

  /**
   * Sender user ID
   */
  @IsUUID()
  @IsNotEmpty()
  senderId: string;

  /**
   * Recipient user ID
   */
  @IsUUID()
  @IsNotEmpty()
  recipientId: string;

  /**
   * Message content
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  content: string;

  /**
   * Conversation/thread ID
   */
  @IsUUID()
  @IsNotEmpty()
  conversationId: string;

  /**
   * Whether message requires encryption
   */
  @IsBoolean()
  @IsOptional()
  requiresEncryption?: boolean;

  /**
   * Message type (text, image, file, etc.)
   */
  @IsString()
  @IsOptional()
  messageType?: string;

  /**
   * Attached file URLs or IDs
   */
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attachments?: string[];

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

/**
 * DTO for notification job
 * Handles push notifications and email alerts
 */
export class NotificationJobDto implements BaseQueueJob {
  /**
   * Notification ID
   */
  @IsUUID()
  @IsNotEmpty()
  notificationId: string;

  /**
   * Notification type
   */
  @IsEnum(NotificationType)
  @IsNotEmpty()
  type: NotificationType;

  /**
   * Recipient user ID
   */
  @IsUUID()
  @IsNotEmpty()
  recipientId: string;

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
   * Related message ID
   */
  @IsUUID()
  @IsOptional()
  messageId?: string;

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

/**
 * DTO for batch message job
 * Handles sending messages to multiple recipients
 */
export class BatchMessageJobDto implements BaseQueueJob {
  /**
   * Batch ID
   */
  @IsUUID()
  @IsNotEmpty()
  batchId: string;

  /**
   * Sender user ID
   */
  @IsUUID()
  @IsNotEmpty()
  senderId: string;

  /**
   * Array of recipient user IDs
   */
  @IsArray()
  @IsUUID(4, { each: true })
  @IsNotEmpty()
  recipientIds: string[];

  /**
   * Array of conversation IDs
   */
  @IsArray()
  @IsUUID(4, { each: true })
  @IsOptional()
  conversationIds?: string[];

  /**
   * Message content
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  content: string;

  /**
   * Chunk size for batch processing
   */
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  chunkSize?: number;

  /**
   * Delay between chunks in milliseconds
   */
  @IsNumber()
  @Min(0)
  @Max(5000)
  @IsOptional()
  chunkDelay?: number;

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

/**
 * DTO for message cleanup job
 * Handles old message cleanup and retention policies
 */
export class MessageCleanupJobDto implements BaseQueueJob {
  /**
   * Type of cleanup to perform
   */
  @IsEnum(CleanupType)
  @IsNotEmpty()
  cleanupType: CleanupType;

  /**
   * Retention period in days
   */
  @IsNumber()
  @Min(1)
  @Max(3650) // 10 years max
  @IsOptional()
  retentionDays?: number;

  /**
   * Batch size for processing
   */
  @IsNumber()
  @Min(1)
  @Max(1000)
  @IsOptional()
  batchSize?: number;

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

/**
 * DTO for delivery confirmation job
 * Tracks message delivery status
 */
export class DeliveryConfirmationJobDto implements BaseQueueJob {
  /**
   * Message ID to confirm delivery for
   */
  @IsUUID()
  @IsNotEmpty()
  messageId: string;

  /**
   * Delivery status
   */
  @IsEnum(DeliveryStatus)
  @IsNotEmpty()
  status: DeliveryStatus;

  /**
   * Recipient user ID
   */
  @IsUUID()
  @IsNotEmpty()
  recipientId: string;

  /**
   * Delivery timestamp
   */
  @IsDateString()
  @IsOptional()
  deliveredAt?: Date;

  /**
   * Read timestamp
   */
  @IsDateString()
  @IsOptional()
  readAt?: Date;

  /**
   * Failure reason if delivery failed
   */
  @IsString()
  @IsOptional()
  @MaxLength(500)
  failureReason?: string;

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

/**
 * DTO for encryption job
 * Handles message encryption/decryption
 */
export class EncryptionJobDto implements BaseQueueJob {
  /**
   * Message ID to encrypt/decrypt
   */
  @IsUUID()
  @IsNotEmpty()
  messageId: string;

  /**
   * Operation type
   */
  @IsEnum(['encrypt', 'decrypt'])
  @IsNotEmpty()
  operation: 'encrypt' | 'decrypt';

  /**
   * Content to encrypt/decrypt
   */
  @IsString()
  @IsNotEmpty()
  content: string;

  /**
   * Encryption key identifier
   */
  @IsString()
  @IsOptional()
  keyId?: string;

  /**
   * Algorithm to use
   */
  @IsString()
  @IsOptional()
  algorithm?: string;

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

/**
 * DTO for indexing job
 * Handles message search indexing
 */
export class IndexingJobDto implements BaseQueueJob {
  /**
   * Message ID to index
   */
  @IsUUID()
  @IsNotEmpty()
  messageId: string;

  /**
   * Operation type
   */
  @IsEnum(['index', 'update', 'delete'])
  @IsNotEmpty()
  operation: 'index' | 'update' | 'delete';

  /**
   * Message content to index
   */
  @IsString()
  @IsOptional()
  content?: string;

  /**
   * Sender ID for indexing
   */
  @IsUUID()
  @IsOptional()
  senderId?: string;

  /**
   * Conversation ID for indexing
   */
  @IsUUID()
  @IsOptional()
  conversationId?: string;

  /**
   * Message timestamp
   */
  @IsDateString()
  @IsOptional()
  messageTimestamp?: Date;

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
