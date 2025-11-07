/**
 * Pagination Type Definitions
 *
 * Standard pagination types for consistent data fetching across the application.
 * Supports cursor-based and offset-based pagination strategies.
 *
 * @module types/pagination
 */

/**
 * Sort order direction
 */
export type SortOrder = 'ASC' | 'DESC' | 'asc' | 'desc';

/**
 * Sort field specification
 */
export interface SortField {
  /**
   * Field name to sort by
   */
  field: string;

  /**
   * Sort direction
   */
  order: SortOrder;
}

/**
 * Offset-based pagination parameters
 */
export interface OffsetPaginationParams {
  /**
   * Number of items to return (default: 10)
   */
  limit?: number;

  /**
   * Number of items to skip (default: 0)
   */
  offset?: number;

  /**
   * Current page number (alternative to offset)
   */
  page?: number;

  /**
   * Items per page (alternative to limit)
   */
  perPage?: number;

  /**
   * Sort parameters
   */
  sort?: SortField[];
}

/**
 * Cursor-based pagination parameters
 */
export interface CursorPaginationParams {
  /**
   * Number of items to return
   */
  limit?: number;

  /**
   * Cursor for the next page
   */
  after?: string;

  /**
   * Cursor for the previous page
   */
  before?: string;

  /**
   * Sort parameters
   */
  sort?: SortField[];
}

/**
 * Pagination metadata for offset-based pagination
 */
export interface OffsetPaginationMeta {
  /**
   * Total number of items
   */
  total: number;

  /**
   * Current page number
   */
  page: number;

  /**
   * Items per page
   */
  perPage: number;

  /**
   * Total number of pages
   */
  totalPages: number;

  /**
   * Whether there is a next page
   */
  hasNextPage: boolean;

  /**
   * Whether there is a previous page
   */
  hasPreviousPage: boolean;
}

/**
 * Pagination metadata for cursor-based pagination
 */
export interface CursorPaginationMeta {
  /**
   * Cursor for the next page
   */
  nextCursor: string | null;

  /**
   * Cursor for the previous page
   */
  previousCursor: string | null;

  /**
   * Whether there is a next page
   */
  hasNextPage: boolean;

  /**
   * Whether there is a previous page
   */
  hasPreviousPage: boolean;

  /**
   * Number of items in current page
   */
  count: number;
}

/**
 * Paginated result with offset pagination
 */
export interface PaginatedResult<T> {
  /**
   * Array of items for current page
   */
  data: T[];

  /**
   * Pagination metadata
   */
  meta: OffsetPaginationMeta;
}

/**
 * Paginated result with cursor pagination
 */
export interface CursorPaginatedResult<T> {
  /**
   * Array of items for current page
   */
  data: T[];

  /**
   * Pagination metadata
   */
  meta: CursorPaginationMeta;

  /**
   * Edge information for GraphQL compatibility
   */
  edges?: Array<{
    node: T;
    cursor: string;
  }>;

  /**
   * Page information for GraphQL compatibility
   */
  pageInfo?: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
  };
}

/**
 * Generic pagination options
 */
export type PaginationParams = OffsetPaginationParams | CursorPaginationParams;

/**
 * Type guard to check if pagination is offset-based
 */
export function isOffsetPagination(
  params: PaginationParams,
): params is OffsetPaginationParams {
  return 'offset' in params || 'page' in params;
}

/**
 * Type guard to check if pagination is cursor-based
 */
export function isCursorPagination(
  params: PaginationParams,
): params is CursorPaginationParams {
  return 'after' in params || 'before' in params;
}
