/**
 * Pagination-related types and interfaces
 */

// Pagination request parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

// Pagination metadata
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
  offset: number;
}

// Paginated response wrapper
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// Paginated result from database query
export interface PaginatedResult<T> {
  rows: T[];
  count: number;
}

// Sort options for pagination
export interface SortOptions {
  field: string;
  direction: 'ASC' | 'DESC';
}

// Advanced pagination with sorting
export interface PaginationWithSort extends PaginationParams {
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  orderBy?: SortOptions[];
}

// Cursor-based pagination (for large datasets)
export interface CursorPagination {
  cursor?: string;
  limit?: number;
  direction?: 'next' | 'prev';
}

// Cursor pagination response
export interface CursorPaginatedResponse<T> {
  data: T[];
  nextCursor?: string;
  prevCursor?: string;
  hasNext: boolean;
  hasPrev: boolean;
}

// Pagination constants
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
} as const;

// Pagination validation constraints
export interface PaginationConstraints {
  maxLimit?: number;
  minLimit?: number;
  defaultLimit?: number;
  defaultPage?: number;
}
