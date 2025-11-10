/**
 * @fileoverview Update Student DTO
 * @module student/dto/update-student.dto
 * @description DTO for updating existing student records with partial validation
 */

import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { CreateStudentDto } from './create-student.dto';

/**
 * Update Student DTO
 *
 * Extends CreateStudentDto with all fields optional
 * Adds isActive field for deactivation/reactivation
 * Used for PATCH /students/:id endpoint
 */
export class UpdateStudentDto extends PartialType(CreateStudentDto) {
  @ApiProperty({
    description: 'Active enrollment status',
    example: true,
    required: false,
    type: 'boolean',
  })
  @IsOptional()
  @IsBoolean({ message: 'Active status must be a boolean' })
  isActive?: boolean;

  @ApiProperty({
    description: 'UUID of user updating this record (for audit trail)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID(4, { message: 'Updated by must be a valid UUID' })
  updatedBy?: string;
}
