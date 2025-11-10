/**
 * @fileoverview Record Measurement DTO
 * @module advanced-features/dto/record-measurement.dto
 * @description DTO for recording student growth measurements
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

export class RecordMeasurementDto {
  @ApiProperty({
    description: 'Student ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsNotEmpty({ message: 'Student ID is required' })
  @IsUUID(4, { message: 'Student ID must be a valid UUID' })
  studentId: string;

  @ApiProperty({
    description: 'Height in centimeters',
    example: 152.4,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Height must be a positive number' })
  height?: number;

  @ApiProperty({
    description: 'Weight in kilograms',
    example: 45.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Weight must be a positive number' })
  weight?: number;

  @ApiProperty({
    description: 'BMI (calculated automatically if height and weight provided)',
    example: 19.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  bmi?: number;

  @ApiProperty({
    description: 'Measurement date',
    example: '2025-10-28T12:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  measurementDate?: string;
}
