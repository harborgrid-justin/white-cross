/**
 * @fileoverview Student Health Records Query DTO
 * @module student/dto
 * @description Query parameters for retrieving student health records with pagination
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, Max } from 'class-validator';

/**
 * Student Health Records Query DTO
 *
 * Used for paginated retrieval of student health records including:
 * - Medications
 * - Allergies
 * - Immunizations
 * - Visit logs
 * - Health assessments
 *
 * PHI Protected: This endpoint returns sensitive health information
 */
export class StudentHealthRecordsDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of records per page',
    example: 20,
    minimum: 1,
    maximum: 100,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
