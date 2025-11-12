/**
 * @fileoverview API Response Types
 * @module common/types/api-response
 * @description Provides standardized type definitions for API responses and errors.
 *
 * @since 1.0.0
 * @category API Response
 */

/**
 * Standardized API error response structure.
 *
 * @interface ApiError
 * @category Error Handling
 *
 * @property {string} code - Machine-readable error code (e.g., 'STUDENT_NOT_FOUND')
 * @property {string} message - Human-readable error message
 * @property {Record<string, unknown>} [details] - Additional error context
 * @property {Date} timestamp - When the error occurred
 * @property {string} [path] - API endpoint where error occurred
 *
 * @example
 * ```typescript
 * const error: ApiError = {
 *   code: 'VALIDATION_ERROR',
 *   message: 'Student number must be unique',
 *   details: {
 *     field: 'studentNumber',
 *     value: 'STU2025001',
 *     constraint: 'unique'
 *   },
 *   timestamp: new Date(),
 *   path: '/api/students'
 * };
 * ```
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: Date;
  path?: string;
}

/**
 * Generic API response wrapper with optional metadata.
 *
 * @template T - The response data type
 * @interface ApiResponse
 * @category API Response
 *
 * @property {boolean} success - Indicates if the operation succeeded
 * @property {T} [data] - Response data (present on success)
 * @property {ApiError} [error] - Error details (present on failure)
 * @property {Record<string, unknown>} [metadata] - Additional response metadata
 *
 * @example
 * ```typescript
 * // Success response
 * const successResponse: ApiResponse<Student> = {
 *   success: true,
 *   data: {
 *     id: 'uuid-1',
 *     firstName: 'John',
 *     lastName: 'Doe'
 *   },
 *   metadata: {
 *     processingTime: 45,
 *     cached: false
 *   }
 * };
 *
 * // Error response
 * const errorResponse: ApiResponse<Student> = {
 *   success: false,
 *   error: {
 *     code: 'STUDENT_NOT_FOUND',
 *     message: 'Student with ID uuid-999 not found',
 *     timestamp: new Date(),
 *     path: '/api/students/uuid-999'
 *   }
 * };
 * ```
 *
 * @see {@link ApiError}
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata?: Record<string, unknown>;
}
