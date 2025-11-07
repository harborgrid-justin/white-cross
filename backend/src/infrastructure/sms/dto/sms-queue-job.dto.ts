/**
 * @fileoverview SMS Queue Job DTO
 * @module infrastructure/sms/dto/sms-queue-job.dto
 * @description DTOs for SMS queue job processing
 */

import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsObject,
  IsNumber,
} from 'class-validator';
import { SmsPriority } from './send-sms.dto';

/**
 * SMS delivery status
 */
export enum SmsDeliveryStatus {
  QUEUED = 'queued',
  SENDING = 'sending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  UNDELIVERED = 'undelivered',
}

/**
 * DTO for SMS queue job data
 */
export class SmsQueueJobDto {
  @ApiProperty({
    description: 'Recipient phone number in E.164 format',
    example: '+15551234567',
  })
  @IsNotEmpty()
  @IsString()
  to: string;

  @ApiProperty({
    description: 'SMS message content',
    example: 'Your verification code is 123456',
  })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({
    description: 'SMS priority',
    enum: SmsPriority,
  })
  @IsNotEmpty()
  priority: SmsPriority;

  @ApiProperty({
    description: 'Attempt number for retry logic',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  attemptNumber: number;

  @ApiProperty({
    description: 'Maximum retry attempts',
    example: 3,
  })
  @IsNotEmpty()
  @IsNumber()
  maxRetries: number;

  @ApiProperty({
    description: 'Custom metadata for tracking',
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @ApiProperty({
    description: 'Original scheduled time for delivery',
    example: '2025-10-28T15:30:00Z',
  })
  @IsOptional()
  @IsString()
  scheduledFor?: string;
}

/**
 * SMS delivery result
 */
export class SmsDeliveryResultDto {
  @ApiProperty({
    description: 'SMS delivery status',
    enum: SmsDeliveryStatus,
  })
  status: SmsDeliveryStatus;

  @ApiProperty({
    description: 'Provider message ID',
    example: 'SM1234567890abcdef',
    required: false,
  })
  messageId?: string;

  @ApiProperty({
    description: 'Recipient phone number',
    example: '+15551234567',
  })
  to: string;

  @ApiProperty({
    description: 'Number of message segments',
    example: 1,
  })
  segmentCount: number;

  @ApiProperty({
    description: 'Estimated cost in USD',
    example: 0.0075,
  })
  cost: number;

  @ApiProperty({
    description: 'Timestamp of delivery',
    example: '2025-10-28T15:30:00Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Error message if delivery failed',
    required: false,
  })
  error?: string;

  @ApiProperty({
    description: 'Provider-specific error code',
    required: false,
  })
  errorCode?: string;
}
