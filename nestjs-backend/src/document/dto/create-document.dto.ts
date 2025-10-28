/**
 * Create Document DTO
 * Data transfer object for creating new documents
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsUrl,
  IsUUID,
  IsArray,
  IsOptional,
  IsBoolean,
  MaxLength,
  MinLength,
  Min,
  Max,
  ArrayMaxSize,
} from 'class-validator';
import { DocumentCategory, DocumentAccessLevel } from '../enums';

export class CreateDocumentDto {
  @ApiProperty({
    description: 'Document title',
    minLength: 3,
    maxLength: 255,
    example: 'Annual Physical Examination 2024',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({
    description: 'Detailed document description',
    maxLength: 5000,
    example: 'Complete physical examination results for student',
  })
  @IsString()
  @IsOptional()
  @MaxLength(5000)
  description?: string;

  @ApiProperty({
    description: 'Document category - determines retention and compliance requirements',
    enum: DocumentCategory,
    example: DocumentCategory.MEDICAL_RECORD,
  })
  @IsEnum(DocumentCategory)
  @IsNotEmpty()
  category: DocumentCategory;

  @ApiProperty({
    description: 'MIME type of the file',
    example: 'application/pdf',
  })
  @IsString()
  @IsNotEmpty()
  fileType: string;

  @ApiProperty({
    description: 'Original filename with extension',
    maxLength: 255,
    example: 'physical_exam_2024.pdf',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  fileName: string;

  @ApiProperty({
    description: 'File size in bytes (1KB - 50MB)',
    minimum: 1024,
    maximum: 52428800,
    example: 524288,
  })
  @IsNumber()
  @Min(1024)
  @Max(52428800)
  fileSize: number;

  @ApiProperty({
    description: 'Storage URL or file path for document retrieval (HTTPS required for PHI)',
    example: 'https://secure.storage/docs/abc123.pdf',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  fileUrl: string;

  @ApiProperty({
    description: 'User ID of the uploader',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  uploadedBy: string;

  @ApiPropertyOptional({
    description: 'Student ID for student-specific documents',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID('4')
  @IsOptional()
  studentId?: string;

  @ApiPropertyOptional({
    description: 'Searchable tags (maximum 10)',
    type: [String],
    maxItems: 10,
    example: ['physical', 'annual', '2024'],
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Is this a reusable template for creating similar documents',
    default: false,
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isTemplate?: boolean;

  @ApiPropertyOptional({
    description: 'Template configuration and field definitions (JSON)',
    example: { fields: ['studentName', 'examDate', 'findings'] },
  })
  @IsOptional()
  templateData?: any;

  @ApiPropertyOptional({
    description: 'Access control level (auto-adjusted for PHI documents)',
    enum: DocumentAccessLevel,
    default: DocumentAccessLevel.STAFF_ONLY,
    example: DocumentAccessLevel.STAFF_ONLY,
  })
  @IsEnum(DocumentAccessLevel)
  @IsOptional()
  accessLevel?: DocumentAccessLevel;
}
