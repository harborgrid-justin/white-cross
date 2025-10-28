/**
 * @fileoverview Record Screening DTO
 * @module advanced-features/dto/record-screening.dto
 * @description DTO for recording health screenings
 */

import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsObject,
  IsDateString,
} from 'class-validator';

export class RecordScreeningDto {
  @ApiProperty({
    description: 'Student ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsNotEmpty({ message: 'Student ID is required' })
  @IsUUID(4, { message: 'Student ID must be a valid UUID' })
  studentId: string;

  @ApiProperty({
    description: 'Screening type',
    example: 'vision',
  })
  @IsNotEmpty({ message: 'Screening type is required' })
  @IsString()
  screeningType: string;

  @ApiProperty({
    description: 'Screening results',
    example: { leftEye: '20/20', rightEye: '20/20' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  results?: Record<string, any>;

  @ApiProperty({
    description: 'Screening notes',
    example: 'Student passed vision screening',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Screening date',
    example: '2025-10-28T12:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  screeningDate?: string;
}
