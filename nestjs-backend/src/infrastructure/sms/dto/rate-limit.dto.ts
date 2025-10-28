/**
 * @fileoverview Rate Limit DTO
 * @module infrastructure/sms/dto/rate-limit.dto
 * @description DTOs for rate limiting configuration and tracking
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

/**
 * Rate limit configuration DTO
 */
export class RateLimitConfigDto {
  @ApiProperty({
    description: 'Maximum messages per time window',
    example: 10,
    minimum: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  maxMessages: number;

  @ApiProperty({
    description: 'Time window in seconds',
    example: 60,
    minimum: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  windowSeconds: number;

  @ApiProperty({
    description: 'Identifier for rate limiting (phone number or account ID)',
    example: '+15551234567',
  })
  @IsNotEmpty()
  @IsString()
  identifier: string;
}

/**
 * Rate limit status DTO
 */
export class RateLimitStatusDto {
  @ApiProperty({
    description: 'Whether rate limit is exceeded',
    example: false,
  })
  isLimited: boolean;

  @ApiProperty({
    description: 'Current message count in window',
    example: 7,
  })
  currentCount: number;

  @ApiProperty({
    description: 'Maximum allowed messages',
    example: 10,
  })
  maxMessages: number;

  @ApiProperty({
    description: 'Remaining messages in current window',
    example: 3,
  })
  remainingMessages: number;

  @ApiProperty({
    description: 'Seconds until rate limit resets',
    example: 45,
  })
  resetInSeconds: number;

  @ApiProperty({
    description: 'Timestamp when rate limit resets',
    example: '2025-10-28T15:31:00Z',
  })
  resetAt: string;
}
