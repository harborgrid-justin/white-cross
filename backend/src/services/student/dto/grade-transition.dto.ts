/**
 * @fileoverview Grade Transition DTO
 * @module student/dto/grade-transition.dto
 * @description DTO for individual student grade transition operations
 */

import { IsString, IsOptional, IsDateString, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Grade Transition DTO
 *
 * Used for individual student grade advancement or retention operations.
 */
export class GradeTransitionDto {
  /**
   * New grade level to assign
   */
  @ApiProperty({
    description: 'New grade level to assign (e.g., "2", "3", "K")',
    example: '3',
  })
  @IsString()
  newGrade: string;

  /**
   * Reason for the grade transition
   */
  @ApiPropertyOptional({
    description: 'Reason for the grade transition (e.g., "Academic performance", "Retention due to attendance")',
    example: 'Academic performance',
  })
  @IsOptional()
  @IsString()
  reason?: string;

  /**
   * Effective date for the transition
   */
  @ApiPropertyOptional({
    description: 'Effective date for the grade transition (ISO date string)',
    example: '2024-08-15',
  })
  @IsOptional()
  @IsDateString()
  effectiveDate?: string;

  /**
   * Additional metadata for the transition
   */
  @ApiPropertyOptional({
    description: 'Additional metadata for the transition',
    type: 'object',
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}