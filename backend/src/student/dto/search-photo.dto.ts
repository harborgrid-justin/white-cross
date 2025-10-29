/**
 * @fileoverview Search Student by Photo DTO
 * @module student/dto
 * @description DTO for facial recognition search
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Search Student by Photo DTO
 *
 * Used for facial recognition search:
 * - Upload photo to search for matching students
 * - Adjustable confidence threshold
 * - Returns ranked matches with confidence scores
 *
 * Use Cases:
 * - Emergency student identification when name unknown
 * - Verify student identity during medication administration
 * - Lost student identification
 *
 * PHI Protected: Facial recognition queries are logged for compliance
 */
export class SearchPhotoDto {
  @ApiPropertyOptional({
    description: 'Base64 encoded image data for facial recognition search',
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA...',
  })
  @IsOptional()
  @IsString()
  imageData?: string;

  @ApiPropertyOptional({
    description: 'Confidence threshold for matches (0.0 to 1.0, default: 0.85)',
    example: 0.85,
    minimum: 0,
    maximum: 1,
    default: 0.85,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1)
  threshold?: number = 0.85;

  @ApiPropertyOptional({
    description: 'Maximum number of results to return',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Metadata filters for narrowing search',
    example: { grade: '5', gender: 'M' },
  })
  @IsOptional()
  @IsObject()
  metadata?: {
    grade?: string;
    gender?: string;
  };
}
