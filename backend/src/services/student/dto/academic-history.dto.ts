/**
 * @fileoverview Academic History Query DTO
 * @module student/dto
 * @description Query parameters for retrieving student academic history
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Academic History Query DTO
 *
 * Used for querying academic history:
 * - All transcripts across years
 * - GPA trends over time
 * - Course history
 * - Academic achievements
 *
 * Supports filtering by academic year and including detailed information
 */
export class AcademicHistoryDto {
  @ApiPropertyOptional({
    description: 'Filter by specific academic year (e.g., "2024-2025")',
    example: '2024-2025',
  })
  @IsOptional()
  @IsString()
  academicYear?: string;

  @ApiPropertyOptional({
    description: 'Include detailed course information',
    example: true,
    default: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  includeDetails?: boolean = true;

  @ApiPropertyOptional({
    description: 'Include GPA calculations and trends',
    example: true,
    default: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  includeGpa?: boolean = true;

  @ApiPropertyOptional({
    description: 'Include attendance records',
    example: true,
    default: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  includeAttendance?: boolean = false;
}
