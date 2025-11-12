/**
 * @fileoverview API Response Utility Functions
 * @module types/core/api/response-utilities
 * @category Types
 *
 * Utility functions for creating and extracting data from API responses.
 * Provides type-safe wrappers and unwrappers for standard operations.
 *
 * Key Features:
 * - `wrapSuccessResponse` - Create standard success responses
 * - `createErrorResponse` - Create structured error responses
 * - `unwrapApiResponse` - Safely extract data from responses
 * - Consistent response creation across the application
 * - Type-safe data extraction with error handling
 *
 * Design Principles:
 * - Pure functions with no side effects
 * - Type-safe transformations
 * - Automatic timestamp generation
 * - Clear error messages for unwrap failures
 * - Support for mocking and testing
 *
 * @example
 * ```typescript
 * // Create success response
 * const student = { id: '123', firstName: 'John', lastName: 'Doe' };
 * const response = wrapSuccessResponse(student, 'Student retrieved');
 *
 * // Create error response
 * const errorResponse = createErrorResponse(
 *   'Validation failed',
 *   [{ field: 'email', message: 'Email is required', code: 'REQUIRED' }],
 *   400,
 *   'VALIDATION_ERROR'
 * );
 *
 * // Extract data safely
 * const data = unwrapApiResponse(response);
 * ```
 */

import type {
  ApiResponse,
  SuccessResponse,
  ErrorResponse,
  ErrorDetail,
} from './base-responses';

// ==========================================
// RESPONSE WRAPPER UTILITIES
// ==========================================

/**
 * Wrap data in standard API response format
 *
 * Utility function to create a consistent ApiResponse object.
 * Useful for mock data, testing, and response transformation.
 *
 * @template T - Type of data to wrap
 * @param data - The data to wrap
 * @param message - Optional success message
 * @param status - Optional HTTP status code (defaults to 200)
 * @returns ApiResponse with wrapped data
 *
 * @example
 * ```typescript
 * const student = { id: '123', firstName: 'John', lastName: 'Doe' };
 * const response = wrapSuccessResponse(student, 'Student retrieved');
 * // { success: true, data: student, message: 'Student retrieved' }
 * ```
 */
export function wrapSuccessResponse<T>(
  data: T,
  message?: string,
  status?: number
): SuccessResponse<T> {
  return {
    success: true,
    data,
    message,
    status: status || 200,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create error response object
 *
 * Utility function to create a consistent ErrorResponse object.
 *
 * @param message - General error message
 * @param errors - Array of detailed errors
 * @param status - HTTP status code (defaults to 500)
 * @param code - Machine-readable error code
 * @param traceId - Request trace ID for debugging
 * @returns ErrorResponse object
 *
 * @example
 * ```typescript
 * const errorResponse = createErrorResponse(
 *   'Validation failed',
 *   [{ field: 'email', message: 'Email is required', code: 'REQUIRED' }],
 *   400,
 *   'VALIDATION_ERROR'
 * );
 * ```
 */
export function createErrorResponse(
  message: string,
  errors: ErrorDetail[] = [],
  status: number = 500,
  code?: string,
  traceId?: string
): ErrorResponse {
  return {
    success: false,
    errors: errors.length > 0 ? errors : [{ message }],
    status,
    message,
    code,
    traceId,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Extract data from ApiResponse safely
 *
 * Type-safe utility to extract data from an API response.
 * Throws error if response indicates failure.
 *
 * @template T - Type of data to extract
 * @param response - The API response
 * @returns Extracted data
 * @throws Error if response indicates failure
 *
 * @example
 * ```typescript
 * const response: ApiResponse<Student> = await api.get('/students/123');
 * const student = unwrapApiResponse(response);
 * // student is of type Student
 * ```
 */
export function unwrapApiResponse<T>(response: ApiResponse<T>): T {
  if (!response.success) {
    const errorMessage = response.message || 'API request failed';
    throw new Error(errorMessage);
  }
  return response.data;
}
