/**
 * @fileoverview Search Analytics DTOs
 * @module ai-search/dto/search-analytics.dto
 * @description DTOs for search analytics and usage statistics
 */

import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  Min,
  Max,
} from 'class-validator';

export enum AnalyticsPeriod {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export class SearchAnalyticsDto {
  @ApiProperty({
    description: 'Time period for analytics',
    enum: AnalyticsPeriod,
    default: AnalyticsPeriod.WEEK,
    required: false,
  })
  @IsOptional()
  @IsEnum(AnalyticsPeriod)
  period?: AnalyticsPeriod;

  @ApiProperty({
    description: 'Maximum number of top queries to return',
    default: 10,
    required: false,
    minimum: 1,
    maximum: 50,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  limit?: number;
}
