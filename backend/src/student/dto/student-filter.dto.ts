/**
 * @fileoverview Student Filter DTO
 * @module student/dto/student-filter.dto
 * @description DTO for filtering and paginating student queries
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Gender } from '../entities/student.entity';

/**
 * Student Filter DTO
 *
 * Used for GET /students endpoint with query parameters
 * Supports pagination, search, and various filters
 */
export class StudentFilterDto {
  @ApiProperty({
    description: 'Page number (1-based)',
    example: 1,
    required: false,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;

  @ApiProperty({
    description: 'Number of records per page',
    example: 20,
    required: false,
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  limit?: number = 20;

  @ApiProperty({
    description: 'Search query (searches firstName, lastName, studentNumber)',
    example: 'Emma',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Filter by grade level',
    example: '3',
    required: false,
  })
  @IsOptional()
  @IsString()
  grade?: string;

  @ApiProperty({
    description: 'Filter by active status',
    example: true,
    required: false,
    type: 'boolean',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean({ message: 'IsActive must be a boolean' })
  isActive?: boolean;

  @ApiProperty({
    description: 'Filter by assigned nurse UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID(4, { message: 'Nurse ID must be a valid UUID' })
  nurseId?: string;

  @ApiProperty({
    description: 'Filter by gender',
    enum: Gender,
    required: false,
  })
  @IsOptional()
  @IsEnum(Gender, {
    message: 'Gender must be MALE, FEMALE, OTHER, or PREFER_NOT_TO_SAY',
  })
  gender?: Gender;

  @ApiProperty({
    description: 'Filter students with allergies',
    example: true,
    required: false,
    type: 'boolean',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean({ message: 'HasAllergies must be a boolean' })
  hasAllergies?: boolean;

  @ApiProperty({
    description: 'Filter students with active medications',
    example: true,
    required: false,
    type: 'boolean',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean({ message: 'HasMedications must be a boolean' })
  hasMedications?: boolean;
}
