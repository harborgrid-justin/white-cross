/**
 * @fileoverview Bulk Grade Transition DTO
 * @module student/dto
 * @description DTO for performing bulk grade transitions at end of school year
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsDateString, IsBoolean, IsOptional, IsObject } from 'class-validator';

/**
 * Bulk Grade Transition DTO
 *
 * Used for end-of-year grade transitions:
 * - Promotes all eligible students to next grade
 * - Processes retention decisions
 * - Handles graduation for senior students
 * - Can run in dry-run mode for testing
 *
 * Critical Operation: Only administrators can perform bulk transitions
 * Always run in dry-run mode first to verify results
 */
export class BulkGradeTransitionDto {
  @ApiProperty({
    description: 'Effective date for the grade transition (ISO 8601 format)',
    example: '2025-06-15T00:00:00Z',
  })
  @IsNotEmpty()
  @IsDateString()
  effectiveDate: string;

  @ApiPropertyOptional({
    description: 'Dry-run mode: preview results without making changes (default: false)',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  dryRun?: boolean = false;

  @ApiPropertyOptional({
    description: 'Promotion criteria configuration',
    example: {
      minimumGpa: 2.0,
      minimumAttendance: 0.9,
      requirePassingGrades: true,
    },
  })
  @IsOptional()
  @IsObject()
  criteria?: {
    minimumGpa?: number;
    minimumAttendance?: number;
    requirePassingGrades?: boolean;
  };
}
