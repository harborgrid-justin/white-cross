/**
 * @fileoverview Send SMS DTO
 * @module infrastructure/sms/dto/send-sms.dto
 * @description DTO for sending SMS messages with full configuration
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

/**
 * SMS Priority levels for queue processing
 */
export enum SmsPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

/**
 * DTO for sending SMS with advanced options
 */
export class SendSmsDto {
  @ApiProperty({
    description: 'SMS message content',
    example: 'This is a notification message',
    maxLength: 1600,
  })
  @IsNotEmpty({ message: 'Message is required' })
  @IsString()
  @MaxLength(1600, { message: 'Message cannot exceed 1600 characters' })
  message: string;

  @ApiPropertyOptional({
    description: 'Template variables for substitution',
    example: { studentName: 'John Doe', time: '2:30 PM' },
  })
  @IsOptional()
  @IsObject()
  templateVariables?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'SMS priority for queue processing',
    enum: SmsPriority,
    default: SmsPriority.NORMAL,
  })
  @IsOptional()
  @IsEnum(SmsPriority)
  priority?: SmsPriority = SmsPriority.NORMAL;

  @ApiPropertyOptional({
    description: 'Schedule SMS for future delivery (ISO 8601 timestamp)',
    example: '2025-10-28T15:30:00Z',
  })
  @IsOptional()
  @IsString()
  scheduledFor?: string;

  @ApiPropertyOptional({
    description: 'Enable delivery status tracking',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  trackDelivery?: boolean = true;

  @ApiPropertyOptional({
    description: 'Maximum retry attempts on failure',
    minimum: 0,
    maximum: 5,
    default: 3,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  maxRetries?: number = 3;

  @ApiPropertyOptional({
    description: 'Custom metadata for tracking',
    example: { userId: '123', alertId: '456' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
