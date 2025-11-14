/**
 * WF-COMP-319 | api-responses.ts - API Response Type Definitions
 * Purpose: Centralized API response, pagination, and search parameter types
 * Upstream: Backend API responses | Dependencies: None
 * Downstream: API hooks, services, components | Called by: Data fetching layer
 * Related: Base entities, utility types
 * Exports: ApiResponse, PaginatedResponse, SearchParams, etc. | Key Features: Type-safe API contracts
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: API call → Response parsing → Type validation → Data consumption
 * LLM Context: Type definitions for API responses, part of type system refactoring
 */

/**
 * API Response and Search Parameter Types Module
 *
 * Provides type definitions for API responses, pagination, filtering,
 * and search functionality across the application.
 *
 * @module types/core/api-responses
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
 * Base filter parameters for entity queries.
 *
 * Common filter fields applicable to most entities.
 *
 * @property {boolean} [isActive] - Filter by active status
 * @property {string} [createdAfter] - ISO 8601 date to filter entities created after
 * @property {string} [createdBefore] - ISO 8601 date to filter entities created before
 * @property {string} [updatedAfter] - ISO 8601 date to filter entities updated after
 * @property {string} [updatedBefore] - ISO 8601 date to filter entities updated before
 */
export interface BaseFilters {
  isActive?: boolean;
  createdAfter?: string;
  createdBefore?: string;
  updatedAfter?: string;
  updatedBefore?: string;
}

/**
 * Person-specific filter parameters.
 *
 * Extends base filters with person-specific search fields.
 *
 * @extends {BaseFilters}
 * @property {string} [name] - Filter by name (first or last name)
 * @property {string} [email] - Filter by email address
 * @property {string} [role] - Filter by user role (use UserRole type)
 */
export interface PersonFilters extends BaseFilters {
  name?: string;
  email?: string;
  role?: string; // Should be UserRole but avoiding circular dependency
}

/**
 * Sort parameters for list queries.
 *
 * Defines field and direction for sorting results.
 *
 * @property {string} field - Field name to sort by
 * @property {'ASC' | 'DESC'} direction - Sort direction (ascending/descending)
 */
export interface SortParams {
  field: string;
  direction: 'ASC' | 'DESC';
}

/**
 * Paginated request with sorting and filtering.
 *
 * Combines pagination, sorting, filtering, and search into a single request type.
 *
 * @extends {PaginationParams}
 * @property {SortParams[]} [sort] - Array of sort parameters for multi-field sorting
 * @property {Record<string, unknown>} [filters] - Key-value filter pairs
 * @property {string} [search] - Full-text search query
 */
export interface PaginatedRequest extends PaginationParams {
  sort?: SortParams[];
  filters?: Record<string, unknown>;
  search?: string;
}

/**
 * Validation error for a specific form field.
 *
 * Used in form validation and API error responses to indicate
 * which field failed validation and why.
 *
 * @property {string} field - Field name that failed validation
 * @property {string} message - Human-readable error message
 * @property {string} [code] - Machine-readable error code
 *
 * @example
 * ```typescript
 * const error: ValidationError = {
 *   field: 'email',
 *   message: 'Email address is invalid',
 *   code: 'INVALID_EMAIL'
 * };
 * ```
 */
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

/**
 * API error response structure.
 *
 * Standardized error format returned by all API endpoints.
 *
 * @property {string} message - Human-readable error description
 * @property {string} [code] - Machine-readable error code
 * @property {number} [statusCode] - HTTP status code (400, 404, 500, etc.)
 * @property {unknown} [details] - Additional error context
 * @property {ValidationError[]} [validation] - Field-level validation errors
 *
 * @example
 * ```typescript
 * const error: ApiError = {
 *   message: 'Validation failed',
 *   code: 'VALIDATION_ERROR',
 *   statusCode: 400,
 *   validation: [
 *     { field: 'email', message: 'Email is required' },
 *     { field: 'age', message: 'Age must be a positive number' }
 *   ]
 * };
 * ```
 */
export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: unknown;
  validation?: ValidationError[];
}
