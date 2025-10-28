/**
 * @fileoverview Performance Trends Query DTO
 * @module student/dto
 * @description Query parameters for analyzing student performance trends
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Performance Trends Query DTO
 *
 * Used for analyzing academic performance trends:
 * - GPA trends over time
 * - Subject-specific performance patterns
 * - Attendance correlation with performance
 * - Predictive analytics for intervention
 *
 * Helps identify students needing academic support
 */
export class PerformanceTrendsDto {
  @ApiPropertyOptional({
    description: 'Number of years to analyze (default: 3)',
    example: 3,
    minimum: 1,
    default: 3,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  yearsToAnalyze?: number = 3;

  @ApiPropertyOptional({
    description: 'Number of semesters to analyze (default: 6)',
    example: 6,
    minimum: 1,
    default: 6,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  semestersToAnalyze?: number = 6;
}
