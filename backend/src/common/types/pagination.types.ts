/**
 * @fileoverview Pagination Types for API Responses
 * @module common/types/pagination
 * @description Provides type definitions for paginated API responses and metadata.
 *
 * @since 1.0.0
 * @category Pagination
 */

/**
 * Pagination metadata for paginated API responses.
 *
 * @interface PaginationMeta
 * @category Pagination
 *
 * @property {number} page - Current page number (1-indexed)
 * @property {number} limit - Maximum items per page
 * @property {number} total - Total number of items across all pages
 * @property {number} pages - Total number of pages available
 *
 * @example
 * ```typescript
 * const meta: PaginationMeta = {
 *   page: 1,
 *   limit: 20,
 *   total: 156,
 *   pages: 8
 * };
 * ```
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/**
 * Paginated response wrapper for list endpoints.
 *
 * @template T - The entity type being paginated
 * @interface PaginatedResponse
 * @category Pagination
 *
 * @property {T[]} data - Array of entities for the current page
 * @property {PaginationMeta} meta - Pagination metadata
 *
 * @example
 * ```typescript
 * interface Student {
 *   id: string;
 *   firstName: string;
 *   lastName: string;
 * }
 *
 * const response: PaginatedResponse<Student> = {
 *   data: [
 *     { id: 'uuid-1', firstName: 'John', lastName: 'Doe' },
 *     { id: 'uuid-2', firstName: 'Jane', lastName: 'Smith' }
 *   ],
 *   meta: {
 *     page: 1,
 *     limit: 20,
 *     total: 156,
 *     pages: 8
 *   }
 * };
 * ```
 *
 * @see {@link PaginationMeta}
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
