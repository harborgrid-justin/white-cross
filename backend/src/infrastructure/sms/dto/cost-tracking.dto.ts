/**
 * @fileoverview Cost Tracking DTO
 * @module infrastructure/sms/dto/cost-tracking.dto
 * @description DTOs for SMS cost tracking and analytics
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

/**
 * DTO for SMS cost entry
 */
export class SmsCostEntryDto {
  @ApiProperty({
    description: 'Recipient phone number',
    example: '+15551234567',
  })
  @IsNotEmpty()
  @IsString()
  to: string;

  @ApiProperty({
    description: 'Country code',
    example: 'US',
  })
  @IsNotEmpty()
  @IsString()
  countryCode: string;

  @ApiProperty({
    description: 'Number of message segments',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  segmentCount: number;

  @ApiProperty({
    description: 'Cost per segment in USD',
    example: 0.0075,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  costPerSegment: number;

  @ApiProperty({
    description: 'Total cost in USD',
    example: 0.0075,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  totalCost: number;

  @ApiProperty({
    description: 'Timestamp of SMS',
    example: '2025-10-28T15:30:00Z',
  })
  @IsNotEmpty()
  @IsString()
  timestamp: string;

  @ApiPropertyOptional({
    description: 'Provider message ID',
    example: 'SM1234567890abcdef',
  })
  @IsOptional()
  @IsString()
  messageId?: string;

  @ApiPropertyOptional({
    description: 'Custom metadata',
  })
  @IsOptional()
  metadata?: Record<string, unknown>;
}

/**
 * DTO for cost analytics query
 */
export class CostAnalyticsQueryDto {
  @ApiProperty({
    description: 'Start date (ISO 8601)',
    example: '2025-10-01T00:00:00Z',
  })
  @IsNotEmpty()
  @IsString()
  startDate: string;

  @ApiProperty({
    description: 'End date (ISO 8601)',
    example: '2025-10-31T23:59:59Z',
  })
  @IsNotEmpty()
  @IsString()
  endDate: string;

  @ApiPropertyOptional({
    description: 'Filter by country code',
    example: 'US',
  })
  @IsOptional()
  @IsString()
  countryCode?: string;
}

/**
 * SMS cost analytics result
 */
export class SmsCostAnalyticsDto {
  @ApiProperty({
    description: 'Total messages sent',
    example: 1250,
  })
  totalMessages: number;

  @ApiProperty({
    description: 'Total cost in USD',
    example: 9.38,
  })
  totalCost: number;

  @ApiProperty({
    description: 'Average cost per message in USD',
    example: 0.0075,
  })
  averageCostPerMessage: number;

  @ApiProperty({
    description: 'Cost breakdown by country',
    example: {
      US: { messages: 1000, cost: 7.5 },
      CA: { messages: 250, cost: 1.88 },
    },
  })
  costByCountry: Record<string, { messages: number; cost: number }>;

  @ApiProperty({
    description: 'Query start date',
    example: '2025-10-01T00:00:00Z',
  })
  startDate: string;

  @ApiProperty({
    description: 'Query end date',
    example: '2025-10-31T23:59:59Z',
  })
  endDate: string;
}
