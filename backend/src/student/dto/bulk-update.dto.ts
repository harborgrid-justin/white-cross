/**
 * @fileoverview Bulk Update DTO
 * @module student/dto/bulk-update.dto
 * @description DTO for bulk updating multiple students
 */

import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsArray,
  IsUUID,
  IsOptional,
  IsString,
  IsBoolean,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Bulk Update DTO
 *
 * Used for POST /students/bulk-update endpoint
 * Allows applying same updates to multiple students at once
 */
export class StudentBulkUpdateDto {
  @ApiProperty({
    description: 'Array of student UUIDs to update',
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '223e4567-e89b-12d3-a456-426614174001',
    ],
    type: [String],
  })
  @IsNotEmpty({ message: 'Student IDs are required' })
  @IsArray({ message: 'Student IDs must be an array' })
  @IsUUID(4, { each: true, message: 'Each student ID must be a valid UUID' })
  studentIds: string[];

  @ApiProperty({
    description: 'New nurse assignment (optional)',
    example: '323e4567-e89b-12d3-a456-426614174002',
    required: false,
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID(4, { message: 'Nurse ID must be a valid UUID' })
  nurseId?: string;

  @ApiProperty({
    description: 'New grade level (optional)',
    example: '5',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 10, { message: 'Grade must be between 1 and 10 characters' })
  grade?: string;

  @ApiProperty({
    description: 'New active status (optional)',
    example: false,
    required: false,
    type: 'boolean',
  })
  @IsOptional()
  @IsBoolean({ message: 'Active status must be a boolean' })
  isActive?: boolean;
}
