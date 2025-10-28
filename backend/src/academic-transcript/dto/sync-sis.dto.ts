/**
 * @fileoverview Sync SIS DTO
 * @module academic-transcript/dto/sync-sis.dto
 * @description DTO for synchronizing with external Student Information System
 */

import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUrl,
  IsOptional,
  MaxLength,
} from 'class-validator';

/**
 * Sync SIS DTO
 *
 * Used for POST /academic-transcript/:studentId/sync endpoint
 * Provides configuration for syncing with external SIS
 */
export class SyncSISDto {
  @ApiProperty({
    description: 'External SIS API endpoint URL',
    example: 'https://sis.example.com/api/v1/students/transcript',
    maxLength: 500,
  })
  @IsNotEmpty({ message: 'SIS API endpoint is required' })
  @IsString()
  @MaxLength(500, { message: 'SIS API endpoint cannot exceed 500 characters' })
  @IsUrl(
    { protocols: ['http', 'https'], require_protocol: true },
    { message: 'SIS API endpoint must be a valid URL' },
  )
  sisApiEndpoint: string;

  @ApiProperty({
    description: 'API key or authentication token for SIS access',
    example: 'Bearer eyJhbGciOiJIUzI1NiIs...',
    required: false,
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'API key cannot exceed 1000 characters' })
  apiKey?: string;

  @ApiProperty({
    description: 'Academic year to sync (e.g., 2024-2025)',
    example: '2024-2025',
    required: false,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'Academic year cannot exceed 20 characters' })
  academicYear?: string;

  @ApiProperty({
    description: 'Semester to sync (Fall, Spring, Summer)',
    example: 'Fall',
    required: false,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'Semester cannot exceed 20 characters' })
  semester?: string;
}
