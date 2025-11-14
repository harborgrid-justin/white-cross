/**
 * @fileoverview Upload Student Photo DTO
 * @module student/dto
 * @description DTO for uploading student photo with metadata
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';

/**
 * Upload Student Photo DTO
 *
 * Used for uploading student photos with metadata:
 * - Base64 encoded image data
 * - Metadata (capture date, device, location, etc.)
 * - Facial recognition indexing support
 *
 * PHI Protected: Student photos are considered personally identifiable information
 * All uploads are audited for compliance
 */
export class UploadPhotoDto {
  @ApiPropertyOptional({
    description: 'Base64 encoded image data (JPEG, PNG, or GIF)',
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA...',
  })
  @IsOptional()
  @IsString()
  imageData?: string;

  @ApiPropertyOptional({
    description: 'Photo URL/path (alternative to imageData)',
    example: 'https://example.com/photos/student-123.jpg',
  })
  @IsOptional()
  @IsString()
  photoUrl?: string;

  @ApiPropertyOptional({
    description: 'Photo metadata including capture date, device info, location',
    example: {
      captureDate: '2025-10-28T10:30:00Z',
      device: 'iPad Pro',
      location: 'School Nurse Office',
      photographer: 'Nurse Smith',
    },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
