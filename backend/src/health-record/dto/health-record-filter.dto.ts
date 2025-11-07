/**
 * @fileoverview Health Record Filter DTO
 * @module health-record/dto/health-record-filter.dto
 * @description DTO for filtering and querying health records
 */

import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsDate,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class HealthRecordFilterDto {
  @ApiProperty({
    description: 'Start date for filtering records',
    example: '2024-01-01',
    required: false,
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDate({ message: 'Start date must be a valid date' })
  @Type(() => Date)
  startDate?: Date;

  @ApiProperty({
    description: 'End date for filtering records',
    example: '2024-12-31',
    required: false,
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDate({ message: 'End date must be a valid date' })
  @Type(() => Date)
  endDate?: Date;

  @ApiProperty({
    description: 'Filter by record type',
    example: 'clinic_visit',
    required: false,
  })
  @IsOptional()
  @IsString()
  recordType?: string;

  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;

  @ApiProperty({
    description: 'Number of records per page',
    example: 20,
    required: false,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  limit?: number = 20;
}
