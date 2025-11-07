/**
 * Create From Template DTO
 * Data transfer object for creating documents from templates
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateFromTemplateDto {
  @ApiProperty({
    description: 'Title for the new document created from template',
    minLength: 3,
    maxLength: 255,
    example: 'Student Annual Physical 2024',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: 'User ID creating the document',
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
    description: 'Template data to merge with template fields',
    example: {
      studentName: 'John Doe',
      examDate: '2024-10-28',
      findings: 'Healthy',
    },
  })
  @IsOptional()
  templateData?: any;
}
