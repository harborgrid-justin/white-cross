/**
 * Shared pagination DTOs for downstream composites
 * Used across all services for consistent pagination
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, Max, IsString, IsEnum } from 'class-validator';

/**
 * Standard pagination query DTO
 */
export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Number of items per page',
    default: 20,
    minimum: 1,
    maximum: 100,
    example: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Number of items to skip',
    default: 0,
    minimum: 0,
    example: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;

  @ApiPropertyOptional({
    description: 'Page number (alternative to offset)',
    minimum: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Field to sort by',
    example: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Sort direction',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
    example: 'DESC',
  })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

/**
 * Standard pagination metadata response
 */
export class PaginationMetaDto {
  @ApiPropertyOptional({ description: 'Total number of items', example: 150 })
  total: number;

  @ApiPropertyOptional({ description: 'Current page number', example: 1 })
  page: number;

  @ApiPropertyOptional({ description: 'Items per page', example: 20 })
  limit: number;

  @ApiPropertyOptional({ description: 'Total number of pages', example: 8 })
  totalPages: number;

  @ApiPropertyOptional({ description: 'Whether there is a next page', example: true })
  hasNextPage: boolean;

  @ApiPropertyOptional({ description: 'Whether there is a previous page', example: false })
  hasPreviousPage: boolean;
}

/**
 * Generic paginated response wrapper
 */
export class PaginatedResponseDto<T> {
  @ApiPropertyOptional({ description: 'Array of items', type: 'array' })
  data: T[];

  @ApiPropertyOptional({ description: 'Pagination metadata', type: PaginationMetaDto })
  meta: PaginationMetaDto;
}

/**
 * Cursor-based pagination query DTO
 */
export class CursorPaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Cursor for next page',
    example: 'eyJpZCI6MTIzfQ==',
  })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiPropertyOptional({
    description: 'Number of items to fetch',
    default: 20,
    minimum: 1,
    maximum: 100,
    example: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

/**
 * Cursor-based pagination response
 */
export class CursorPaginatedResponseDto<T> {
  @ApiPropertyOptional({ description: 'Array of items', type: 'array' })
  data: T[];

  @ApiPropertyOptional({ description: 'Cursor for next page', example: 'eyJpZCI6MTQ1fQ==' })
  nextCursor?: string;

  @ApiPropertyOptional({ description: 'Whether there are more items', example: true })
  hasMore: boolean;
}
