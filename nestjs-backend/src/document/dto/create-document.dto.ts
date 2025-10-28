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
  Min,
  Max,
  ArrayMinSize,
  Matches,
} from 'class-validator';

export enum DocumentCategory {
  MEDICAL_RECORD = 'MEDICAL_RECORD',
  CONSENT_FORM = 'CONSENT_FORM',
  POLICY = 'POLICY',
  INCIDENT_REPORT = 'INCIDENT_REPORT',
  TRAINING = 'TRAINING',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  STUDENT_FILE = 'STUDENT_FILE',
  INSURANCE = 'INSURANCE',
  OTHER = 'OTHER',
}

export enum DocumentAccessLevel {
  PUBLIC = 'PUBLIC',
  STAFF_ONLY = 'STAFF_ONLY',
  RESTRICTED = 'RESTRICTED',
  PRIVATE = 'PRIVATE',
}

export class CreateDocumentDto {
  @ApiProperty({ description: 'Document title', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({ description: 'Detailed document description' })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({ description: 'Document category', enum: DocumentCategory })
  @IsEnum(DocumentCategory)
  @IsNotEmpty()
  category: DocumentCategory;

  @ApiProperty({ description: 'MIME type of the file' })
  @IsString()
  @IsNotEmpty()
  fileType: string;

  @ApiProperty({ description: 'Original filename with extension' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  fileName: string;

  @ApiProperty({ description: 'File size in bytes', minimum: 1, maximum: 52428800 })
  @IsNumber()
  @Min(1)
  @Max(52428800)
  fileSize: number;

  @ApiProperty({ description: 'Storage URL or S3 key for document retrieval' })
  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  @ApiProperty({ description: 'User ID of the uploader' })
  @IsString()
  @IsNotEmpty()
  uploadedBy: string;

  @ApiPropertyOptional({ description: 'Student ID for student-specific documents' })
  @IsUUID('4')
  @IsOptional()
  studentId?: string;

  @ApiPropertyOptional({ description: 'Searchable tags', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ description: 'Is this a reusable template', default: false })
  @IsBoolean()
  @IsOptional()
  isTemplate?: boolean;

  @ApiPropertyOptional({ description: 'Template configuration data' })
  @IsOptional()
  templateData?: any;

  @ApiPropertyOptional({ description: 'Access control level', enum: DocumentAccessLevel })
  @IsEnum(DocumentAccessLevel)
  @IsOptional()
  accessLevel?: DocumentAccessLevel;
}
