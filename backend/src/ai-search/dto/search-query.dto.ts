/**
 * @fileoverview Search Query DTO
 * @module ai-search/dto/search-query.dto
 * @description DTO for AI-powered semantic search queries
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class SearchQueryDto {
  @ApiProperty({
    description: 'Search query text',
    example: 'students with asthma requiring daily medication',
    maxLength: 500,
  })
  @IsNotEmpty({ message: 'Search query is required' })
  @IsString()
  @MaxLength(500, { message: 'Query cannot exceed 500 characters' })
  query: string;

  @ApiProperty({
    description: 'Search options and filters',
    required: false,
    example: {
      limit: 10,
      threshold: 0.7,
      dataTypes: ['student', 'health-record'],
    },
  })
  @IsOptional()
  @IsObject()
  options?: {
    limit?: number;
    threshold?: number;
    dataTypes?: string[];
    studentIds?: string[];
    dateRange?: { start?: Date; end?: Date };
  };
}
