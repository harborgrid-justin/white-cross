/**
 * LOC: HLTH-SHARED-UTILS-002
 * File: /reuse/server/health/composites/shared/utils/pagination.util.ts
 * PURPOSE: Standardized pagination utilities for healthcare composites
 * IMPACT: Reduces memory usage and improves response times for large datasets
 */

export interface PaginationParams {
  page?: number; // 1-based page number
  limit?: number; // Items per page
  cursor?: string; // Cursor for cursor-based pagination
  sortBy?: string; // Sort field
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
    nextCursor?: string;
  };
}

export interface CursorPaginatedResult<T> {
  data: T[];
  pagination: {
    nextCursor?: string;
    previousCursor?: string;
    hasNext: boolean;
    hasPrevious: boolean;
    count: number;
  };
}

/**
 * Pagination helper class
 */
export class PaginationHelper {
  // Default and max limits
  static readonly DEFAULT_LIMIT = 20;
  static readonly MAX_LIMIT = 100;

  /**
   * Validate and sanitize pagination parameters
   */
  static validateParams(params: PaginationParams): {
    page: number;
    limit: number;
    skip: number;
  } {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(
      Math.max(1, params.limit || this.DEFAULT_LIMIT),
      this.MAX_LIMIT,
    );
    const skip = (page - 1) * limit;

    return { page, limit, skip };
  }

  /**
   * Create paginated result
   */
  static createPaginatedResult<T>(
    data: T[],
    total: number,
    params: PaginationParams,
  ): PaginatedResult<T> {
    const { page, limit } = this.validateParams(params);
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    };
  }

  /**
   * Create cursor-based paginated result
   */
  static createCursorPaginatedResult<T>(
    data: T[],
    limit: number,
    getCursor: (item: T) => string,
    hasPrevious = false,
  ): CursorPaginatedResult<T> {
    const hasNext = data.length > limit;
    const items = hasNext ? data.slice(0, limit) : data;

    return {
      data: items,
      pagination: {
        nextCursor: hasNext ? getCursor(items[items.length - 1]) : undefined,
        previousCursor: hasPrevious ? getCursor(items[0]) : undefined,
        hasNext,
        hasPrevious,
        count: items.length,
      },
    };
  }

  /**
   * Encode cursor
   */
  static encodeCursor(data: any): string {
    return Buffer.from(JSON.stringify(data)).toString('base64');
  }

  /**
   * Decode cursor
   */
  static decodeCursor<T = any>(cursor: string): T {
    try {
      return JSON.parse(Buffer.from(cursor, 'base64').toString('utf-8'));
    } catch (error) {
      throw new Error('Invalid cursor format');
    }
  }
}

/**
 * TypeORM pagination helper
 */
export class TypeORMPaginationHelper {
  /**
   * Apply pagination to TypeORM query builder
   */
  static applyPagination<T>(
    queryBuilder: any,
    params: PaginationParams,
  ): void {
    const { limit, skip } = PaginationHelper.validateParams(params);
    queryBuilder.take(limit).skip(skip);

    if (params.sortBy) {
      queryBuilder.orderBy(
        params.sortBy,
        params.sortOrder || 'ASC',
      );
    }
  }

  /**
   * Execute paginated query
   */
  static async executePaginatedQuery<T>(
    queryBuilder: any,
    params: PaginationParams,
  ): Promise<PaginatedResult<T>> {
    const { limit, skip, page } = PaginationHelper.validateParams(params);

    queryBuilder.take(limit).skip(skip);

    if (params.sortBy) {
      queryBuilder.orderBy(
        params.sortBy,
        params.sortOrder || 'ASC',
      );
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return PaginationHelper.createPaginatedResult(data, total, params);
  }
}

/**
 * Sequelize pagination helper
 */
export class SequelizePaginationHelper {
  /**
   * Create Sequelize pagination options
   */
  static getPaginationOptions(params: PaginationParams): {
    limit: number;
    offset: number;
    order?: any;
  } {
    const { limit, skip } = PaginationHelper.validateParams(params);

    const options: any = {
      limit,
      offset: skip,
    };

    if (params.sortBy) {
      options.order = [[params.sortBy, params.sortOrder || 'ASC']];
    }

    return options;
  }

  /**
   * Execute paginated query
   */
  static async executePaginatedQuery<T>(
    model: any,
    query: any,
    params: PaginationParams,
  ): Promise<PaginatedResult<T>> {
    const paginationOptions = this.getPaginationOptions(params);
    const { count, rows } = await model.findAndCountAll({
      ...query,
      ...paginationOptions,
    });

    return PaginationHelper.createPaginatedResult(rows, count, params);
  }
}

/**
 * Array pagination helper (for in-memory pagination)
 */
export class ArrayPaginationHelper {
  /**
   * Paginate an array
   */
  static paginate<T>(
    items: T[],
    params: PaginationParams,
  ): PaginatedResult<T> {
    const { page, limit, skip } = PaginationHelper.validateParams(params);

    // Sort if requested
    let sortedItems = items;
    if (params.sortBy) {
      sortedItems = [...items].sort((a, b) => {
        const aVal = (a as any)[params.sortBy!];
        const bVal = (b as any)[params.sortBy!];

        if (params.sortOrder === 'DESC') {
          return bVal > aVal ? 1 : bVal < aVal ? -1 : 0;
        }
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      });
    }

    // Slice array
    const paginatedData = sortedItems.slice(skip, skip + limit);

    return PaginationHelper.createPaginatedResult(
      paginatedData,
      items.length,
      params,
    );
  }
}

/**
 * Pagination decorator for controller methods
 */
export function Paginated(): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      // Find pagination params in arguments
      const paginationParams = args.find(
        (arg) =>
          arg &&
          typeof arg === 'object' &&
          ('page' in arg || 'limit' in arg || 'cursor' in arg),
      );

      // Validate pagination params
      if (paginationParams && !paginationParams.cursor) {
        const validated = PaginationHelper.validateParams(paginationParams);
        Object.assign(paginationParams, validated);
      }

      return await originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
