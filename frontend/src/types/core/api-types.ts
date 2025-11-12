/**
 * WF-COMP-319 | api-types.ts - API Communication Type Definitions
 * Purpose: Type definitions for API responses, pagination, and search parameters
 * Upstream: Backend API contracts | Dependencies: None
 * Downstream: API services, data fetching hooks | Called by: Service layer
 * Related: enums.ts, base-entities.ts
 * Exports: API response interfaces, pagination types, filter types
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: API call → Type validation → Data transformation → UI rendering
 * LLM Context: API communication types extracted from common.ts for better modularity
 */

/**
 * API Types Module
 *
 * Type definitions for API communication patterns including responses,
 * pagination, filtering, and search functionality. These types ensure
 * consistent API contract handling across the application.
 *
 * @module types/core/api-types
 * @category Types
 */

/**
 * Generic API response wrapper for all HTTP endpoints.
 *
 * Provides a consistent response structure across all API calls,
 * enabling standardized error handling and data extraction.
 *
 * @template T - The type of data contained in the response
 *
 * @property {T} data - Response payload data
 * @property {boolean} success - Operation success status
 * @property {string} [message] - Optional human-readable message
 * @property {string} [timestamp] - Optional ISO 8601 timestamp of response
 *
 * @example
 * ```typescript
 * const response: ApiResponse<Student> = {
 *   data: { id: '123', firstName: 'John', ... },
 *   success: true,
 *   message: 'Student retrieved successfully',
 *   timestamp: '2025-10-24T00:00:00Z'
 * };
 * ```
 */
export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
  timestamp?: string;
}

/**
 * Paginated API response for list endpoints.
 *
 * Wraps array data with pagination metadata for implementing
 * efficient list views with page navigation.
 *
 * @template T - The type of items in the data array
 *
 * @property {T[]} data - Array of items for current page
 * @property {Object} pagination - Pagination metadata
 * @property {number} pagination.page - Current page number (1-indexed)
 * @property {number} pagination.limit - Items per page
 * @property {number} pagination.total - Total number of items across all pages
 * @property {number} pagination.pages - Total number of pages
 * @property {boolean} success - Operation success status
 *
 * @example
 * ```typescript
 * const response: PaginatedResponse<Student> = {
 *   data: [student1, student2, ...],
 *   pagination: { page: 1, limit: 20, total: 150, pages: 8 },
 *   success: true
 * };
 * ```
 */
export interface PaginatedResponse<T = unknown> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  success: boolean;
}

/**
 * Pagination metadata for list responses.
 *
 * Standalone pagination information used in various response formats.
 *
 * @property {number} page - Current page number (1-indexed)
 * @property {number} limit - Maximum items per page
 * @property {number} total - Total number of items
 * @property {number} pages - Total number of pages (calculated from total/limit)
 */
export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/**
 * Pagination request parameters for list endpoints.
 *
 * Used to request specific pages of data from paginated endpoints.
 *
 * @property {number} [page] - Page number (1-indexed, default: 1)
 * @property {number} [limit] - Items per page (default varies by endpoint, typically 10-20)
 *
 * @example
 * ```typescript
 * const params: PaginationParams = { page: 2, limit: 25 };
 * ```
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Date range filter for time-based queries.
 *
 * Used to filter records by creation date, modification date,
 * or other timestamp fields.
 *
 * @property {string} [startDate] - ISO 8601 start date (inclusive)
 * @property {string} [endDate] - ISO 8601 end date (inclusive)
 *
 * @example
 * ```typescript
 * const filter: DateRangeFilter = {
 *   startDate: '2025-01-01T00:00:00Z',
 *   endDate: '2025-01-31T23:59:59Z'
 * };
 * ```
 */
export interface DateRangeFilter {
  startDate?: string;
  endDate?: string;
}

/**
 * Search and filter parameters for query endpoints.
 *
 * Standardized search interface for implementing advanced
 * filtering, sorting, and text search.
 *
 * @property {string} [q] - Full-text search query string
 * @property {Record<string, unknown>} [filters] - Key-value pairs for filtering
 * @property {string} [sort] - Field name to sort by
 * @property {'asc' | 'desc'} [order] - Sort direction (ascending/descending)
 *
 * @example
 * ```typescript
 * const params: SearchParams = {
 *   q: 'john',
 *   filters: { grade: '10', isActive: true },
 *   sort: 'lastName',
 *   order: 'asc'
 * };
 * ```
 */
export interface SearchParams {
  q?: string;
  filters?: Record<string, unknown>;
  sort?: string;
  order?: 'asc' | 'desc';
}

/**
 * Base filters for common query parameters.
 *
 * Provides standard filtering fields that can be extended by
 * entity-specific filter interfaces.
 *
 * @property {boolean} [isActive] - Filter by active/inactive status
 * @property {string} [createdAfter] - ISO 8601 timestamp for creation date lower bound
 * @property {string} [createdBefore] - ISO 8601 timestamp for creation date upper bound
 * @property {string} [updatedAfter] - ISO 8601 timestamp for update date lower bound
 * @property {string} [updatedBefore] - ISO 8601 timestamp for update date upper bound
 */
export interface BaseFilters {
  isActive?: boolean;
  createdAfter?: string;
  createdBefore?: string;
  updatedAfter?: string;
  updatedBefore?: string;
}

/**
 * Person-specific filters extending base filters.
 *
 * Additional filtering options for person entities (users, contacts, students).
 * Import UserRole from './enums' when using the role filter.
 *
 * @extends {BaseFilters}
 * @property {string} [name] - Filter by full name or partial name match
 * @property {string} [email] - Filter by email address
 * @property {string} [role] - Filter by user role (use UserRole type from enums.ts)
 */
export interface PersonFilters extends BaseFilters {
  name?: string;
  email?: string;
  role?: string; // Should be UserRole from enums.ts, but kept as string to avoid circular dependency
}

/**
 * Sort parameters for ordering query results.
 *
 * Specifies field name and sort direction for database queries.
 *
 * @property {string} field - Database field name to sort by
 * @property {'ASC' | 'DESC'} direction - Sort direction (ascending or descending)
 *
 * @example
 * ```typescript
 * const sort: SortParams = { field: 'lastName', direction: 'ASC' };
 * ```
 */
export interface SortParams {
  field: string;
  direction: 'ASC' | 'DESC';
}

/**
 * Comprehensive paginated request with filtering and sorting.
 *
 * Combines pagination, filtering, sorting, and search into a single
 * request interface for complex list queries.
 *
 * @extends {PaginationParams}
 * @property {SortParams[]} [sort] - Array of sort parameters for multi-field sorting
 * @property {Record<string, unknown>} [filters] - Dynamic filter key-value pairs
 * @property {string} [search] - Global search query string
 *
 * @example
 * ```typescript
 * const request: PaginatedRequest = {
 *   page: 1,
 *   limit: 20,
 *   sort: [{ field: 'lastName', direction: 'ASC' }],
 *   filters: { isActive: true, grade: '10' },
 *   search: 'john'
 * };
 * ```
 */
export interface PaginatedRequest extends PaginationParams {
  sort?: SortParams[];
  filters?: Record<string, unknown>;
  search?: string;
}
