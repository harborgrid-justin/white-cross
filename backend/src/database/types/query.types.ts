/**
 * Query Type Definitions
 * Common types for repository queries and results
 */

/**
 * Query options for find operations
 */
export interface QueryOptions {
  /**
   * Relations to include in the result
   * Can be nested for complex includes
   */
  include?: Record<string, boolean | QueryOptions>;

  /**
   * Sorting configuration
   */
  orderBy?: OrderByClause;

  /**
   * Number of records to skip (for pagination)
   */
  skip?: number;

  /**
   * Maximum number of records to return
   */
  take?: number;

  /**
   * Number of records to return (alias for take, for compatibility)
   */
  limit?: number;

  /**
   * Cursor-based pagination cursor
   */
  cursor?: string;

  /**
   * Cache key for result caching
   */
  cacheKey?: string;

  /**
   * Cache TTL in seconds
   */
  cacheTTL?: number;

  /**
   * Select specific fields only
   */
  select?: Record<string, boolean>;
}

/**
 * Query criteria for complex queries
 */
export interface QueryCriteria<T> {
  /**
   * Where clause - can be partial entity or complex conditions
   */
  where: Partial<T> | ComplexWhereClause;

  /**
   * Sorting configuration
   */
  orderBy?: OrderByClause;

  /**
   * Pagination parameters
   */
  pagination?: PaginationParams;
}

/**
 * Complex where clause supporting advanced filters
 */
export interface ComplexWhereClause {
  AND?: any[];
  OR?: any[];
  NOT?: any;
  [key: string]: any;
}

/**
 * Order by clause for sorting
 */
export type OrderByClause =
  | { [key: string]: 'asc' | 'desc' | 'ASC' | 'DESC' }
  | Array<{ [key: string]: 'asc' | 'desc' | 'ASC' | 'DESC' }>;

/**
 * Pagination parameters
 */
export interface PaginationParams {
  /**
   * Page number (1-indexed)
   */
  page?: number;

  /**
   * Number of records per page
   */
  limit?: number;

  /**
   * Number of records to skip
   */
  skip?: number;
}

/**
 * Paginated result wrapper
 */
export interface PaginatedResult<T> {
  /**
   * Result data
   */
  data: T[];

  /**
   * Pagination metadata
   */
  pagination: PaginationMetadata;

  /**
   * Additional metadata (e.g., aggregations, totals)
   */
  metadata?: Record<string, any>;
}

/**
 * Pagination metadata
 */
export interface PaginationMetadata {
  /**
   * Current page number (1-indexed)
   */
  page: number;

  /**
   * Number of items per page
   */
  limit: number;

  /**
   * Total number of items across all pages
   */
  total: number;

  /**
   * Total number of pages
   */
  pages: number;

  /**
   * Whether there is a next page
   */
  hasNext?: boolean;

  /**
   * Whether there is a previous page
   */
  hasPrevious?: boolean;
}

/**
 * Helper function to create pagination metadata
 */
export function createPaginationMetadata(
  page: number,
  limit: number,
  total: number,
): PaginationMetadata {
  const pages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    pages,
    hasNext: page < pages,
    hasPrevious: page > 1,
  };
}

/**
 * Helper function to calculate skip value from page and limit
 */
export function calculateSkip(page: number, limit: number): number {
  return (page - 1) * limit;
}

/**
 * Query builder helper class
 */
export class QueryBuilder<T> {
  private criteria: QueryCriteria<T>;
  private options: QueryOptions;

  constructor() {
    this.criteria = {
      where: {},
    };
    this.options = {};
  }

  where(conditions: Partial<T> | ComplexWhereClause): this {
    this.criteria.where = conditions;
    return this;
  }

  orderBy(orderBy: OrderByClause): this {
    this.criteria.orderBy = orderBy;
    return this;
  }

  paginate(page: number, limit: number): this {
    this.criteria.pagination = {
      page,
      limit,
      skip: calculateSkip(page, limit),
    };
    return this;
  }

  include(include: Record<string, boolean | QueryOptions>): this {
    this.options.include = include;
    return this;
  }

  select(select: Record<string, boolean>): this {
    this.options.select = select;
    return this;
  }

  cache(key: string, ttl: number): this {
    this.options.cacheKey = key;
    this.options.cacheTTL = ttl;
    return this;
  }

  build(): { criteria: QueryCriteria<T>; options: QueryOptions } {
    return {
      criteria: this.criteria,
      options: this.options,
    };
  }
}
