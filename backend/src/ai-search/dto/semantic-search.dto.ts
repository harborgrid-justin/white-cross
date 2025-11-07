/**
 * @fileoverview Semantic Search DTOs
 * @module ai-search/dto/semantic-search.dto
 * @description DTOs for semantic search with filters and parameters
 */

import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
  IsArray,
  ValidateNested,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SearchFiltersDto {
  @ApiProperty({
    description: 'Data types to search',
    required: false,
    example: ['patient', 'appointment'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dataTypes?: string[];

  @ApiProperty({ description: 'Date range filter', required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => Object)
  dateRange?: { start?: Date; end?: Date };

  @ApiProperty({ description: 'Student IDs filter', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  studentIds?: string[];

  @ApiProperty({ description: 'Nurse IDs filter', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  nurseIds?: string[];

  @ApiProperty({ description: 'Categories filter', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];
}

export class SemanticSearchDto {
  @ApiProperty({
    description: 'Search query text',
    example: 'students with respiratory conditions',
    maxLength: 500,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  query: string;

  @ApiProperty({
    description: 'Search filters',
    required: false,
    type: SearchFiltersDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SearchFiltersDto)
  filters?: SearchFiltersDto;

  @ApiProperty({
    description: 'Maximum number of results',
    required: false,
    default: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiProperty({
    description: 'Similarity threshold (0-1)',
    required: false,
    default: 0.7,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  threshold?: number;

  @ApiProperty({ description: 'User ID making the search', required: true })
  @IsNotEmpty()
  @IsString()
  userId: string;
}
