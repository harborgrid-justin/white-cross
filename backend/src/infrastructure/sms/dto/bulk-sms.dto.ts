/**
 * @fileoverview Bulk SMS DTO
 * @module infrastructure/sms/dto/bulk-sms.dto
 * @description DTOs for bulk SMS operations
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { GenericSmsDto } from './generic-sms.dto';
import { SmsPriority } from './send-sms.dto';

/**
 * DTO for sending bulk SMS
 */
export class BulkSmsDto extends GenericSmsDto {
  @ApiProperty({
    description: 'Array of recipient phone numbers (max 100)',
    example: ['+15551234567', '+15559876543'],
    minItems: 1,
    maxItems: 100,
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one recipient is required' })
  @ArrayMaxSize(100, { message: 'Maximum 100 recipients allowed per batch' })
  @IsString({ each: true })
  recipients: string[];

  @ApiPropertyOptional({
    description: 'Priority for all messages in batch',
    enum: SmsPriority,
    default: SmsPriority.NORMAL,
  })
  @IsOptional()
  priority?: SmsPriority = SmsPriority.NORMAL;

  @ApiPropertyOptional({
    description: 'Custom metadata for tracking',
    example: { campaignId: '123', batchId: '456' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

/**
 * Response DTO for bulk SMS operation
 */
export class BulkSmsResultDto {
  @ApiProperty({
    description: 'Total number of recipients',
    example: 50,
  })
  totalRecipients: number;

  @ApiProperty({
    description: 'Number of successfully queued messages',
    example: 48,
  })
  successCount: number;

  @ApiProperty({
    description: 'Number of failed messages',
    example: 2,
  })
  failedCount: number;

  @ApiProperty({
    description: 'Failed recipients with error details',
    example: [{ phoneNumber: '+15551234567', error: 'Invalid phone number' }],
  })
  failures: Array<{ phoneNumber: string; error: string }>;

  @ApiProperty({
    description: 'Estimated total cost in USD',
    example: 0.36,
  })
  estimatedCost: number;

  @ApiProperty({
    description: 'Batch processing timestamp',
    example: '2025-10-28T15:30:00Z',
  })
  timestamp: string;
}
