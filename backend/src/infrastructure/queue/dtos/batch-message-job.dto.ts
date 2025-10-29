/**
 * @fileoverview Batch Message Job DTOs
 * @module infrastructure/queue/dtos
 * @description Data transfer objects for batch message operations
 */

import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsObject,
  IsDateString,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BaseQueueJob } from '../interfaces';

/**
 * Individual message in a batch
 */
export class BatchMessageItem {
  /**
   * Recipient user ID
   */
  @IsUUID()
  @IsNotEmpty()
  recipientId: string;

  /**
   * Message content (can be customized per recipient)
   */
  @IsString()
  @IsOptional()
  @MaxLength(10000)
  content?: string;

  /**
   * Custom variables for templating
   */
  @IsObject()
  @IsOptional()
  variables?: Record<string, any>;
}

/**
 * DTO for batch message sending job
 * Handles sending messages to multiple recipients
 */
export class BatchMessageJobDto implements BaseQueueJob {
  /**
   * Batch job identifier
   */
  @IsUUID()
  @IsOptional()
  batchId?: string;

  /**
   * Sender user ID
   */
  @IsUUID()
  @IsNotEmpty()
  senderId: string;

  /**
   * Recipient user IDs
   */
  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsNotEmpty()
  recipientIds: string[];

  /**
   * Message content (used for all recipients if not customized)
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  content: string;

  /**
   * Message template ID (if using template)
   */
  @IsString()
  @IsOptional()
  templateId?: string;

  /**
   * Template variables (common for all recipients)
   */
  @IsObject()
  @IsOptional()
  templateVariables?: Record<string, any>;

  /**
   * Customized messages for individual recipients
   */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BatchMessageItem)
  @IsOptional()
  customizedMessages?: BatchMessageItem[];

  /**
   * Conversation IDs for each recipient (optional)
   * If provided, must match recipientIds length
   */
  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  conversationIds?: string[];

  /**
   * Whether to create new conversations if they don't exist
   */
  @IsOptional()
  createConversations?: boolean;

  /**
   * Batch processing chunk size
   * Controls how many messages are sent per chunk
   */
  @IsNumber()
  @Min(1)
  @Max(1000)
  @IsOptional()
  chunkSize?: number;

  /**
   * Delay between chunks in milliseconds
   */
  @IsNumber()
  @Min(0)
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
 * Handles deletion of old messages
 */
export class MessageCleanupJobDto implements BaseQueueJob {
  /**
   * Cleanup type
   */
  @IsString()
  @IsNotEmpty()
  cleanupType: 'old_messages' | 'deleted_conversations' | 'expired_attachments';

  /**
   * Delete messages older than this date
   */
  @IsDateString()
  @IsOptional()
  olderThan?: Date;

  /**
   * Number of days to keep messages
   */
  @IsNumber()
  @Min(1)
  @IsOptional()
  retentionDays?: number;

  /**
   * Specific conversation IDs to clean
   */
  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  conversationIds?: string[];

  /**
   * User IDs whose messages should be cleaned
   */
  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  userIds?: string[];

  /**
   * Maximum number of messages to delete in one run
   */
  @IsNumber()
  @Min(1)
  @Max(10000)
  @IsOptional()
  batchSize?: number;

  /**
   * Whether to perform a dry run (count only, no deletion)
   */
  @IsOptional()
  dryRun?: boolean;

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
