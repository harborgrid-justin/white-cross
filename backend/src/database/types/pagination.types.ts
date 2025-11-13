/**
 * Pagination Types
 *
 * Type definitions for pagination functionality in the White Cross healthcare platform.
 */

/**
 * Pagination metadata interface
 */
export interface PaginationMeta {
  /** Current page number (1-indexed) */
  page: number;
  /** Number of items per page */
  limit: number;
  /** Total number of items */
  total: number;
  /** Total number of pages */
  pages: number;
}

/**
 * Paginated response interface
 */
export interface PaginatedResponse<T> {
  /** Array of data items */
  data: T[];
  /** Pagination metadata */
  meta: PaginationMeta;
}

/**
 * Pagination query parameters interface
 */
export interface PaginationQuery {
  /** Page number (1-indexed) */
  page?: number;
  /** Number of items per page */
  limit?: number;
  /** Offset for pagination */
  offset?: number;
}

/**
 * Sort direction type
 */
export type SortDirection = 'ASC' | 'DESC';

/**
 * Sort field interface
 */
export interface SortField {
  /** Field name to sort by */
  field: string;
  /** Sort direction */
  direction: SortDirection;
}

/**
 * Pagination options interface
 */
export interface PaginationOptions extends PaginationQuery {
  /** Sort fields */
  sort?: SortField[];
  /** Search query */
  search?: string;
}
