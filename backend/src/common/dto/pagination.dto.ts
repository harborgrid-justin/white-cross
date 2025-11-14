import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

/**
 * Shared pagination Data Transfer Object for API endpoints
 *
 * @description
 * Provides standardized pagination parameters across all API endpoints.
 * Supports page-based pagination with configurable limits to ensure
 * consistent pagination behavior throughout the application.
 *
 * All paginated endpoints should extend or use this DTO to maintain
 * consistency in query parameter names and validation rules.
 *
 * Validation rules:
 * - page: Optional integer, minimum 1 (1-indexed), defaults to 1
 * - limit: Optional integer, minimum 1, maximum 100, defaults to 20
 *
 * @example
 * ```typescript
 * // In controller
 * @Get('students')
 * async findAll(@Query() paginationDto: PaginationDto) {
 *   return this.service.findAll(paginationDto.page, paginationDto.limit);
 * }
 *
 * // API request
 * GET /students?page=2&limit=50
 * ```
 *
 * @example
 * ```typescript
 * // Extending for custom pagination
 * export class StudentPaginationDto extends PaginationDto {
 *   @IsOptional()
 *   @IsString()
 *   grade?: string;
 * }
 * ```
 *
 * @see {@link PaginatedResponse} for the response structure
 * @since 1.0.0
 */
export class PaginationDto {
  /**
   * Page number for pagination (1-indexed)
   *
   * @type {number}
   * @optional
   * @minimum 1
   * @default 1
   *
   * @description
   * The page number to retrieve in a paginated result set.
   * Uses 1-based indexing (first page is 1, not 0).
   * If not provided, defaults to the first page.
   *
   * Validation:
   * - Must be a positive integer
   * - Minimum value: 1
   * - Automatically converted from query string to number
   *
   * @example 1 // First page
   * @example 5 // Fifth page
   */
  @ApiPropertyOptional({
    description: 'Page number (1-indexed)',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  /**
   * Number of items to return per page
   *
   * @type {number}
   * @optional
   * @minimum 1
   * @maximum 100
   * @default 20
   *
   * @description
   * Controls the number of items returned in a single page of results.
   * Limited to a maximum of 100 items to prevent performance issues
   * and excessive data transfer.
   *
   * Validation:
   * - Must be a positive integer
   * - Minimum value: 1
   * - Maximum value: 100
   * - Automatically converted from query string to number
   * - Defaults to 20 if not specified
   *
   * Common values:
   * - 10: Small lists or mobile displays
   * - 20: Default, balanced performance
   * - 50: Larger displays or data-heavy operations
   * - 100: Maximum allowed, use sparingly
   *
   * @example 20 // Default page size
   * @example 50 // Larger page size
   * @example 100 // Maximum page size
   */
  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 20,
    minimum: 1,
    maximum: 100,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}