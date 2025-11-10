/**
 * @fileoverview Query Options DTOs
 * @module interfaces/dtos/query-options
 * @description Type-safe query option interfaces for data access layer
 */

import { SortOrder } from '../enums/common-types.enum';
import { Op, WhereOptions, Order, Attributes, Includeable } from 'sequelize';

/**
 * Base query options for all data access operations
 */
export interface BaseQueryOptions<T = any> {
  /** WHERE clause filters */
  where?: WhereOptions<T>;

  /** Attributes/fields to select */
  attributes?: Attributes<T>;

  /** Relations to include (eager loading) */
  include?: Includeable[];

  /** Sort order */
  order?: Order;

  /** Limit number of results */
  limit?: number;

  /** Offset for pagination */
  offset?: number;

  /** Group by clause */
  group?: string | string[];

  /** Having clause (with GROUP BY) */
  having?: WhereOptions<T>;

  /** Enable paranoid (soft delete) mode */
  paranoid?: boolean;

  /** Raw query mode */
  raw?: boolean;

  /** Enable subQuery */
  subQuery?: boolean;

  /** Lock mode for transactions */
  lock?: boolean | { level: 'UPDATE' | 'SHARE'; of: any };
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  /** Page number (1-based) */
  page: number;

  /** Number of items per page */
  pageSize: number;

  /** Total count of items (optional, for response) */
  totalCount?: number;

  /** Total pages (optional, for response) */
  totalPages?: number;
}

/**
 * Sort options
 */
export interface SortOptions {
  /** Field to sort by */
  field: string;

  /** Sort order (ASC/DESC) */
  order: SortOrder;
}

/**
 * Filter criteria for complex queries
 */
export interface FilterCriteria {
  /** Field name to filter */
  field: string;

  /** Operator (eq, ne, gt, lt, like, in, etc.) */
  operator: FilterOperator;

  /** Value to compare */
  value: any;

  /** Logical operator for combining with other filters */
  logicalOperator?: 'AND' | 'OR';
}

/**
 * Supported filter operators
 */
export type FilterOperator =
  | 'eq'       // Equal
  | 'ne'       // Not equal
  | 'gt'       // Greater than
  | 'gte'      // Greater than or equal
  | 'lt'       // Less than
  | 'lte'      // Less than or equal
  | 'like'     // LIKE pattern
  | 'ilike'    // Case-insensitive LIKE
  | 'notLike'  // NOT LIKE
  | 'in'       // IN array
  | 'notIn'    // NOT IN array
  | 'between'  // BETWEEN range
  | 'isNull'   // IS NULL
  | 'notNull'  // IS NOT NULL
  | 'contains' // Array contains
  | 'overlap'  // Array overlap
  | 'regexp'   // Regular expression match
  | 'iRegexp'; // Case-insensitive regex

/**
 * Advanced query options with filtering, sorting, pagination
 */
export interface AdvancedQueryOptions<T = any> extends BaseQueryOptions<T> {
  /** Multiple filter criteria */
  filters?: FilterCriteria[];

  /** Sort options */
  sort?: SortOptions[];

  /** Pagination options */
  pagination?: PaginationOptions;

  /** Search term for full-text search */
  search?: string;

  /** Search fields for full-text search */
  searchFields?: string[];

  /** Field projection (include/exclude) */
  fields?: string[];

  /** Fields to exclude */
  excludeFields?: string[];

  /** Distinct results */
  distinct?: boolean;

  /** Enable caching */
  cache?: boolean;

  /** Cache TTL in seconds */
  cacheTTL?: number;

  /** Cache key override */
  cacheKey?: string;

  /** Cache tags for invalidation */
  cacheTags?: string[];
}

/**
 * Query result wrapper with metadata
 */
export interface QueryResult<T> {
  /** Result data */
  data: T[];

  /** Total count (for pagination) */
  totalCount: number;

  /** Current page */
  page?: number;

  /** Page size */
  pageSize?: number;

  /** Total pages */
  totalPages?: number;

  /** Has next page */
  hasNextPage?: boolean;

  /** Has previous page */
  hasPreviousPage?: boolean;

  /** Query execution time in ms */
  executionTimeMs?: number;

  /** Cache hit indicator */
  fromCache?: boolean;

  /** Query metadata */
  metadata?: QueryMetadata;
}

/**
 * Single result wrapper
 */
export interface SingleResult<T> {
  /** Result data */
  data: T | null;

  /** Execution time in ms */
  executionTimeMs?: number;

  /** Cache hit indicator */
  fromCache?: boolean;

  /** Result found */
  found: boolean;
}

/**
 * Query execution metadata
 */
export interface QueryMetadata {
  /** Query ID for tracing */
  queryId?: string;

  /** Execution time in ms */
  executionTimeMs: number;

  /** Number of rows affected */
  rowCount: number;

  /** Cache hit/miss */
  cacheHit: boolean;

  /** Indexes used */
  indexesUsed?: string[];

  /** Query optimization level */
  optimizationLevel?: 'poor' | 'good' | 'excellent';

  /** Performance recommendations */
  recommendations?: string[];

  /** SQL query executed (for debugging) */
  sql?: string;
}

/**
 * Batch query options
 */
export interface BatchQueryOptions {
  /** Batch size */
  batchSize: number;

  /** Process in parallel */
  parallel?: boolean;

  /** Max parallel workers */
  maxParallel?: number;

  /** Continue on error */
  continueOnError?: boolean;
}

/**
 * Aggregation query options
 */
export interface AggregationOptions {
  /** Aggregation function */
  function: 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX';

  /** Field to aggregate */
  field: string;

  /** Group by fields */
  groupBy?: string[];

  /** Alias for result */
  alias?: string;
}

/**
 * Transaction options
 */
export interface TransactionOptions {
  /** Isolation level */
  isolationLevel?: 'READ_UNCOMMITTED' | 'READ_COMMITTED' | 'REPEATABLE_READ' | 'SERIALIZABLE';

  /** Auto-commit */
  autoCommit?: boolean;

  /** Timeout in ms */
  timeout?: number;
}

/**
 * Bulk operation options
 */
export interface BulkOperationOptions {
  /** Validate records before operation */
  validate?: boolean;

  /** Run hooks */
  hooks?: boolean;

  /** Individual writes (vs single statement) */
  individualHooks?: boolean;

  /** Return updated records */
  returning?: boolean;

  /** Update on duplicate key */
  updateOnDuplicate?: string[];
}
