/**
 * @fileoverview Analytics Query DTO
 * @module academic-transcript/dto/analytics-query.dto
 * @description DTO for querying academic performance analytics
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * Analytics Query DTO
 *
 * Used for GET /academic-transcript/:studentId/analytics endpoint
 * Specifies which analytics and trend data to include
 */
export class AnalyticsQueryDto {
  @ApiProperty({
    description: 'Include GPA and grade trend analysis',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  includeTrends?: boolean = true;

  @ApiProperty({
    description: 'Include academic recommendations based on performance',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  includeRecommendations?: boolean = true;

  @ApiProperty({
    description: 'Include attendance trend analysis',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  includeAttendanceTrends?: boolean = true;

  @ApiProperty({
    description: 'Include behavior trend analysis',
    example: false,
    required: false,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  includeBehaviorTrends?: boolean = false;

  @ApiProperty({
    description: 'Academic year to analyze (leave empty for all years)',
    example: '2024-2025',
    required: false,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'Academic year cannot exceed 20 characters' })
  academicYear?: string;

  @ApiProperty({
    description: 'Compare with class or grade average',
    example: false,
    required: false,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  compareWithAverage?: boolean = false;
}
