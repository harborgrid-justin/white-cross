/**
 * @fileoverview Transfer Student DTO
 * @module student/dto/transfer-student.dto
 * @description DTO for transferring students to different nurses or grades
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, Length } from 'class-validator';

/**
 * Transfer Student DTO
 *
 * Used for PATCH /students/:id/transfer endpoint
 * Allows updating nurse assignment and/or grade level
 */
export class TransferStudentDto {
  @ApiProperty({
    description: 'UUID of new assigned nurse',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID(4, { message: 'Nurse ID must be a valid UUID' })
  nurseId?: string;

  @ApiProperty({
    description: 'New grade level',
    example: '4',
    required: false,
    minLength: 1,
    maxLength: 10,
  })
  @IsOptional()
  @IsString()
  @Length(1, 10, { message: 'Grade must be between 1 and 10 characters' })
  grade?: string;

  @ApiProperty({
    description: 'Reason for transfer (for audit trail)',
    example: 'Student promoted to next grade',
    required: false,
  })
  @IsOptional()
  @IsString()
  reason?: string;
}
