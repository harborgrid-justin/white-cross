/**
 * @fileoverview Search Query DTO
 * @module ai-search/dto/search-query.dto
 * @description DTO for AI-powered semantic search queries
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * Data Transfer Object for AI-powered semantic search queries
 *
 * @description
 * Encapsulates search query text and optional filters for AI-powered semantic search.
 * Used with vector embeddings to find semantically similar content across healthcare data.
 *
 * Validation rules:
 * - query: Required, non-empty string, max 500 characters
 * - options: Optional object with filters and search parameters
 *
 * @example
 * ```typescript
 * const searchDto = new SearchQueryDto();
 * searchDto.query = 'students with asthma requiring daily medication';
 * searchDto.options = {
 *   limit: 10,
 *   threshold: 0.7,
 *   dataTypes: ['student', 'health-record']
 * };
 * ```
 *
 * @see {@link AiSearchService.search} for usage
 * @since 1.0.0
 */
export class SearchQueryDto {
  /**
   * Natural language search query text
   *
   * @type {string}
   * @required
   * @minLength 1
   * @maxLength 500
   *
   * @description
   * Free-form text query that will be converted to vector embeddings
   * for semantic similarity matching. Supports natural language questions
   * and medical terminology.
   *
   * @example 'students with asthma requiring daily medication'
   * @example 'find all Type 1 diabetes patients with recent insulin adjustments'
   * @example 'medication administration errors in the last 30 days'
   */
  @ApiProperty({
    description: 'Search query text',
    example: 'students with asthma requiring daily medication',
    maxLength: 500,
  })
  @IsNotEmpty({ message: 'Search query is required' })
  @IsString()
  @MaxLength(500, { message: 'Query cannot exceed 500 characters' })
  query: string;

  /**
   * Optional search filters and parameters
   *
   * @type {object}
   * @optional
   *
   * @description
   * Fine-tune search behavior with the following options:
   * - limit: Maximum number of results to return (default: 10, max: 100)
   * - threshold: Minimum similarity score (0.0-1.0, default: 0.7)
   * - dataTypes: Filter by content types (student, health-record, appointment, etc.)
   * - studentIds: Filter by specific student IDs
   * - dateRange: Filter by date range {start, end}
   *
   * @example
   * ```typescript
   * {
   *   limit: 20,
   *   threshold: 0.8,
   *   dataTypes: ['student', 'health-record'],
   *   studentIds: ['uuid-123', 'uuid-456'],
   *   dateRange: { start: new Date('2024-01-01'), end: new Date('2024-12-31') }
   * }
   * ```
   */
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
    /** Maximum number of results (default: 10, max: 100) */
    limit?: number;
    /** Minimum similarity score 0.0-1.0 (default: 0.7) */
    threshold?: number;
    /** Filter by content types: student, health-record, appointment, medication, incident */
    dataTypes?: string[];
    /** Filter by specific student UUIDs */
    studentIds?: string[];
    /** Filter by date range */
    dateRange?: { start?: Date; end?: Date };
  };
}
