/**
 * @fileoverview Create Health Record DTO
 * @module health-record/dto/create-health-record.dto
 * @description DTO for creating new health records
 */

import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsDate,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateHealthRecordDto {
  @ApiProperty({
    description: 'Student UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsNotEmpty({ message: 'Student ID is required' })
  @IsUUID(4, { message: 'Student ID must be a valid UUID' })
  studentId: string;

  @ApiProperty({
    description: 'Date of health record/visit',
    example: '2024-10-28',
    type: 'string',
    format: 'date-time',
  })
  @IsNotEmpty({ message: 'Record date is required' })
  @IsDate({ message: 'Record date must be a valid date' })
  @Type(() => Date)
  recordDate: Date;

  @ApiProperty({
    description: 'Type of health record (visit, screening, incident, etc.)',
    example: 'clinic_visit',
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'Record type is required' })
  @IsString()
  @MaxLength(100, { message: 'Record type cannot exceed 100 characters' })
  recordType: string;

  @ApiProperty({
    description: "Patient's chief complaint or reason for visit",
    example: 'Headache and fever',
    required: false,
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Chief complaint cannot exceed 1000 characters' })
  chiefComplaint?: string;

  @ApiProperty({
    description: 'Assessment and diagnosis',
    example: 'Viral infection, fever 101.5F',
    required: false,
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Assessment cannot exceed 2000 characters' })
  assessment?: string;

  @ApiProperty({
    description: 'Treatment provided',
    example: 'Rest, fluids, acetaminophen 500mg',
    required: false,
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Treatment cannot exceed 2000 characters' })
  treatment?: string;

  @ApiProperty({
    description: 'Additional notes',
    required: false,
    maxLength: 5000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000, { message: 'Notes cannot exceed 5000 characters' })
  notes?: string;

  @ApiProperty({
    description: 'UUID of provider/nurse creating record',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID(4, { message: 'Provider ID must be a valid UUID' })
  providerId?: string;
}
