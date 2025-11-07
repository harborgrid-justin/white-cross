/**
 * Update Document DTO
 * Data transfer object for updating document metadata
 * Note: File content cannot be updated - use versioning instead
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsArray,
  IsOptional,
  MaxLength,
  MinLength,
  IsDateString,
  ArrayMaxSize,
} from 'class-validator';
import { DocumentStatus, DocumentAccessLevel } from '../enums';

export class UpdateDocumentDto {
  @ApiPropertyOptional({
    description: 'Updated document title',
    minLength: 3,
    maxLength: 255,
    example: 'Annual Physical Examination 2024 - Updated',
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({
    description: 'Updated description',
    maxLength: 5000,
    example: 'Updated physical examination results with additional notes',
  })
  @IsString()
  @IsOptional()
  @MaxLength(5000)
  description?: string;

  @ApiPropertyOptional({
    description: 'New document status (DRAFT → PENDING_REVIEW → APPROVED)',
    enum: DocumentStatus,
    example: DocumentStatus.APPROVED,
  })
  @IsEnum(DocumentStatus)
  @IsOptional()
  status?: DocumentStatus;

  @ApiPropertyOptional({
    description: 'Updated searchable tags (maximum 10)',
    type: [String],
    maxItems: 10,
    example: ['physical', 'annual', '2024', 'updated'],
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Document retention/destruction date (ISO 8601 format)',
    example: '2031-12-31T23:59:59Z',
  })
  @IsDateString()
  @IsOptional()
  retentionDate?: Date;

  @ApiPropertyOptional({
    description:
      'Updated access control level (cannot downgrade PHI documents to PUBLIC)',
    enum: DocumentAccessLevel,
    example: DocumentAccessLevel.STAFF_ONLY,
  })
  @IsEnum(DocumentAccessLevel)
  @IsOptional()
  accessLevel?: DocumentAccessLevel;
}
