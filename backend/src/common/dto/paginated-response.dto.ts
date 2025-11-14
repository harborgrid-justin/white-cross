import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * Pagination Metadata
 * Contains information about the current page and total results
 */
export class PaginationMetaDto {
  @ApiProperty({
    description: 'Current page number (1-indexed)',
    example: 1,
    minimum: 1,
    type: Number,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 20,
    minimum: 1,
    maximum: 100,
    type: Number,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of items across all pages',
    example: 150,
    minimum: 0,
    type: Number,
  })
  total: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 8,
    minimum: 0,
    type: Number,
  })
  pages: number;

  @ApiProperty({
    description: 'Whether there is a next page available',
    example: true,
    type: Boolean,
  })
  hasNext: boolean;

  @ApiProperty({
    description: 'Whether there is a previous page available',
    example: false,
    type: Boolean,
  })
  hasPrev: boolean;

  @ApiProperty({
    description: 'Number of the next page (null if no next page)',
    example: 2,
    nullable: true,
    type: Number,
  })
  nextPage: number | null;

  @ApiProperty({
    description: 'Number of the previous page (null if no previous page)',
    example: null,
    nullable: true,
    type: Number,
  })
  prevPage: number | null;

  /**
   * Create pagination metadata from query results
   */
  static create(params: {
    page: number;
    limit: number;
    total: number;
  }): PaginationMetaDto {
    const { page, limit, total } = params;
    const pages = Math.ceil(total / limit);
    const hasNext = page < pages;
    const hasPrev = page > 1;

    return {
      page,
      limit,
      total,
      pages,
      hasNext,
      hasPrev,
      nextPage: hasNext ? page + 1 : null,
      prevPage: hasPrev ? page - 1 : null,
    };
  }
}

/**
 * Generic Paginated Response DTO
 * Standard pagination response format for all list endpoints
 *
 * @example
 * // Usage in controller:
 * @ApiOkResponse({
 *   description: 'Students retrieved successfully',
 *   type: () => PaginatedResponseDto<StudentResponseDto>,
 * })
 * async findAll(): Promise<PaginatedResponseDto<StudentResponseDto>> {
 *   // ... implementation
 * }
 */
export class PaginatedResponseDto<T> {
  @ApiProperty({
    description: 'Array of items for the current page',
    isArray: true,
    type: () => Object, // Will be overridden by specific type in controllers
  })
  @Type(() => Object)
  data: T[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: () => PaginationMetaDto,
  })
  @Type(() => PaginationMetaDto)
  meta: PaginationMetaDto;

  /**
   * Create a paginated response
   */
  static create<T>(params: {
    data: T[];
    page: number;
    limit: number;
    total: number;
  }): PaginatedResponseDto<T> {
    return {
      data: params.data,
      meta: PaginationMetaDto.create({
        page: params.page,
        limit: params.limit,
        total: params.total,
      }),
    };
  }
}

/**
 * Pagination Query DTO
 * Standard query parameters for paginated endpoints
 *
 * @example
 * // Usage in controller:
 * @Get()
 * @ApiQuery({ type: PaginationQueryDto })
 * async findAll(@Query() query: PaginationQueryDto) {
 *   // ... implementation
 * }
 */
export class PaginationQueryDto {
  @ApiProperty({
    description: 'Page number (1-indexed)',
    example: 1,
    required: false,
    default: 1,
    minimum: 1,
    type: Number,
  })
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 20,
    required: false,
    default: 20,
    minimum: 1,
    maximum: 100,
    type: Number,
  })
  @Type(() => Number)
  limit?: number = 20;

  /**
   * Get pagination offset for database queries
   */
  getOffset(): number {
    return ((this.page || 1) - 1) * (this.limit || 20);
  }

  /**
   * Get pagination limit for database queries
   */
  getLimit(): number {
    return Math.min(this.limit || 20, 100);
  }
}

/**
 * Example usage:
 *
 * // In a service:
 * async findAll(query: PaginationQueryDto): Promise<PaginatedResponseDto<Student>> {
 *   const offset = query.getOffset();
 *   const limit = query.getLimit();
 *
 *   const { rows, count } = await this.studentModel.findAndCountAll({
 *     offset,
 *     limit,
 *   });
 *
 *   return PaginatedResponseDto.create({
 *     data: rows,
 *     page: query.page,
 *     limit: query.limit,
 *     total: count,
 *   });
 * }
 *
 * // In a controller:
 * @Get()
 * @ApiOkResponse({
 *   description: 'Students retrieved successfully',
 *   type: () => PaginatedResponseDto,
 * })
 * @ApiExtraModels(StudentResponseDto, PaginatedResponseDto)
 * async findAll(
 *   @Query() query: PaginationQueryDto,
 * ): Promise<PaginatedResponseDto<StudentResponseDto>> {
 *   return this.studentService.findAll(query);
 * }
 */
