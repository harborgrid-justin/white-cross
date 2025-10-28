/**
 * @fileoverview Graduating Students Query DTO
 * @module student/dto
 * @description Query parameters for retrieving students eligible for graduation
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Graduating Students Query DTO
 *
 * Used for querying graduation-eligible students:
 * - Students who meet credit requirements
 * - Students who meet assessment requirements
 * - Students who meet attendance thresholds
 *
 * Used for graduation planning and ceremonies
 */
export class GraduatingStudentsDto {
  @ApiPropertyOptional({
    description: 'Academic year for graduation (e.g., "2025")',
    example: '2025',
  })
  @IsOptional()
  @IsString()
  academicYear?: string;

  @ApiPropertyOptional({
    description: 'Minimum GPA requirement (0.0 to 4.0 scale)',
    example: 2.0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minimumGpa?: number;

  @ApiPropertyOptional({
    description: 'Minimum total credits required',
    example: 24,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minimumCredits?: number;
}
