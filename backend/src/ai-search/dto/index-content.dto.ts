/**
 * @fileoverview Index Content DTO
 * @module ai-search/dto/index-content.dto
 * @description DTO for indexing content in AI search
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class IndexContentDto {
  @ApiProperty({
    description: 'Content type to index',
    example: 'health-record',
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'Content type is required' })
  @IsString()
  @MaxLength(100, { message: 'Content type cannot exceed 100 characters' })
  contentType: string;

  @ApiProperty({
    description: 'Unique content identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
    maxLength: 200,
  })
  @IsNotEmpty({ message: 'Content ID is required' })
  @IsString()
  @MaxLength(200, { message: 'Content ID cannot exceed 200 characters' })
  contentId: string;

  @ApiProperty({
    description: 'Content text to index',
    example: 'Patient John Doe has asthma requiring daily inhaler...',
    maxLength: 10000,
  })
  @IsNotEmpty({ message: 'Content is required' })
  @IsString()
  @MaxLength(10000, { message: 'Content cannot exceed 10000 characters' })
  content: string;

  @ApiProperty({
    description: 'Additional metadata for filtering',
    required: false,
    example: { studentId: 'uuid', category: 'respiratory' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
