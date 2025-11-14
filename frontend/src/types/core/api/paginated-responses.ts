/**
 * @fileoverview Paginated API Response Type Definitions
 * @module types/core/api/paginated-responses
 * @category Types
 *
 * Type definitions for paginated list responses with comprehensive
 * pagination metadata.
 *
 * Key Features:
 * - `PaginatedResponse<T>` for list endpoints with pagination
 * - `PaginationInfo` with navigation metadata (hasNext, hasPrev)
 * - Legacy `PaginationResponse` for backward compatibility
 * - Utility functions for creating and unwrapping paginated responses
 *
 * Design Principles:
 * - Consistent pagination metadata across all list endpoints
 * - Type-safe data extraction with proper error handling
 * - Support for navigation flags (hasNext, hasPrev)
 * - Clear separation between data and pagination metadata
 *
 * @example
 * ```typescript
 * // Paginated response
 * const listResponse: PaginatedResponse<Student> = await api.get('/students');
 * console.log(listResponse.data); // Student[]
 * console.log(listResponse.pagination); // { page, limit, total, totalPages }
 *
 * // Check for more pages
 * if (listResponse.pagination.hasNext) {
 *   // Load next page
 * }
 * ```
 */

import type { ErrorDetail } from './base-responses';

// ==========================================
// PAGINATED RESPONSE INTERFACES
// ==========================================

/**
 * Paginated Response
 *
 * Interface for paginated list responses. Includes data array and
 * comprehensive pagination metadata.
 *
 * Properties:
 * - data: Array of items for the current page
 * - pagination: Metadata about pagination state
 * - success: Indicates if request was successful
 * - message: Optional message about the operation
 *
 * @template T - The type of items in the data array
 *
 * @example
 * ```typescript
 * const response: PaginatedResponse<Student> = {
 *   success: true,
 *   data: [
 *     { id: '1', firstName: 'John', lastName: 'Doe' },
 *     { id: '2', firstName: 'Jane', lastName: 'Smith' }
 *   ],
 *   pagination: {
 *     page: 1,
 *     limit: 10,
 *     total: 156,
 *     totalPages: 16,
 *     hasNext: true,
 *     hasPrev: false
 *   }
 * };
 * ```
 */
export interface PaginatedResponse<T = unknown> {
  /** Array of items for the current page */
  data: T[];

  /** Pagination metadata */
  pagination: PaginationInfo;

  /** Indicates if request was successful */
  success: boolean;

  /** Optional message about the operation */
  message?: string;

  /** HTTP status code */
  status?: number;

  /** Optional error details (present when success is false) */
  errors?: ErrorDetail[];
}

/**
 * Pagination Information
 *
 * Metadata about pagination state, including current page, total counts,
 * and navigation flags.
 *
 * @example
 * ```typescript
 * const paginationInfo: PaginationInfo = {
 *   page: 3,
 *   limit: 20,
 *   total: 156,
 *   totalPages: 8,
 *   hasNext: true,
 *   hasPrev: true
 * };
 * ```
 */
export interface PaginationInfo {
  /** Current page number (1-indexed) */
  page: number;

  /** Number of items per page */
  limit: number;

  /** Total number of items across all pages */
  total: number;

  /** Total number of pages */
  totalPages: number;

  /** Whether there is a next page */
  hasNext: boolean;

  /** Whether there is a previous page */
  hasPrev: boolean;
}

/**
 * Legacy Pagination Response
 *
 * @deprecated Use PaginationInfo instead
 *
 * Legacy pagination response format for backward compatibility.
 * New code should use PaginationInfo.
 */
export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Wrap array in paginated response format
 *
 * Utility function to create a PaginatedResponse from an array of data.
 * Useful for mock data and testing.
 *
 * @template T - Type of items in array
 * @param data - Array of items
 * @param page - Current page number
 * @param limit - Items per page
 * @param total - Total number of items
 * @returns PaginatedResponse with data and pagination info
 *
 * @example
 * ```typescript
 * const students = [{ id: '1', name: 'John' }, { id: '2', name: 'Jane' }];
 * const response = wrapPaginatedResponse(students, 1, 10, 156);
 * // { data: students, pagination: { page: 1, limit: 10, total: 156, ... } }
 * ```
 */
export function wrapPaginatedResponse<T>(
  data: T[],
  page: number = 1,
  limit: number = 10,
  total?: number
): PaginatedResponse<T> {
  const totalItems = total ?? data.length;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total: totalItems,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
    status: 200,
  };
}

/**
 * Extract data from PaginatedResponse safely
 *
 * Type-safe utility to extract data array from paginated response.
 *
 * @template T - Type of items in array
 * @param response - The paginated response
 * @returns Extracted data array
 * @throws Error if response indicates failure
 *
 * @example
 * ```typescript
 * const response: PaginatedResponse<Student> = await api.get('/students');
 * const students = unwrapPaginatedResponse(response);
 * // students is of type Student[]
 * ```
 */
export function unwrapPaginatedResponse<T>(response: PaginatedResponse<T>): T[] {
  if (!response.success) {
    const errorMessage = response.message || 'API request failed';
    throw new Error(errorMessage);
  }
  return response.data;
}
