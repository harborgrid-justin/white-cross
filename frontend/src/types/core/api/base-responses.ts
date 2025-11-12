/**
 * @fileoverview Core API Response Type Definitions
 * @module types/core/api/base-responses
 * @category Types
 *
 * Fundamental response type definitions that serve as building blocks
 * for all other API response types in the application.
 *
 * Key Features:
 * - Generic `ApiResponse<T>` for standard responses
 * - `SuccessResponse<T>` with type-safe success guarantee
 * - `ErrorResponse` for consistent error handling
 * - `ErrorDetail` for field-level validation errors
 * - Type guards for runtime type checking
 *
 * Design Principles:
 * - Type safety through discriminated unions (success: true/false)
 * - Impossible states made unrepresentable
 * - Unknown default for generic types (never any)
 * - Comprehensive error information with optional tracing
 *
 * @example
 * ```typescript
 * // Standard API response
 * const response: ApiResponse<User> = await api.get('/users/123');
 * if (response.success) {
 *   console.log(response.data); // Type-safe access
 * }
 *
 * // Error handling
 * if (!response.success) {
 *   console.error(response.errors); // Type-safe error access
 * }
 * ```
 */

// ==========================================
// CORE RESPONSE INTERFACES
// ==========================================

/**
 * Standard API Response Wrapper
 *
 * Generic interface for all successful API responses. Wraps data with
 * metadata about success status and optional messages.
 *
 * Properties:
 * - data: The actual response payload (generic type T)
 * - success: Indicates if the request was successful
 * - message: Optional human-readable message
 * - status: HTTP status code (optional)
 * - timestamp: ISO timestamp of response generation (optional)
 *
 * @template T - The type of the response data
 *
 * @example
 * ```typescript
 * // Simple data response
 * const response: ApiResponse<User> = {
 *   success: true,
 *   data: { id: '123', name: 'John Doe' },
 *   message: 'User retrieved successfully'
 * };
 *
 * // Empty success response
 * const deleteResponse: ApiResponse<void> = {
 *   success: true,
 *   data: undefined,
 *   message: 'Resource deleted'
 * };
 * ```
 */
export interface ApiResponse<T = unknown> {
  /** Indicates if the request was successful */
  success: boolean;

  /** The actual response payload */
  data: T;

  /** Optional human-readable message about the operation */
  message?: string;

  /** HTTP status code */
  status?: number;

  /** ISO timestamp when response was generated */
  timestamp?: string;

  /** Optional error details (present when success is false) */
  errors?: ErrorDetail[];
}

/**
 * Success Response
 *
 * Type alias for successful API responses. Ensures success flag is true
 * and data is present.
 *
 * @template T - The type of the response data
 *
 * @example
 * ```typescript
 * const response: SuccessResponse<Student> = {
 *   success: true,
 *   data: { id: '123', firstName: 'Jane', lastName: 'Doe' },
 *   message: 'Student created successfully',
 *   status: 201
 * };
 * ```
 */
export interface SuccessResponse<T = unknown> extends ApiResponse<T> {
  success: true;
  data: T;
  errors?: never;
}

/**
 * Error Response
 *
 * Interface for API error responses. Provides structured error information
 * including field-level validation errors and error codes.
 *
 * Properties:
 * - success: Always false for error responses
 * - errors: Array of detailed error information
 * - status: HTTP status code
 * - message: General error message
 * - code: Machine-readable error code (optional)
 * - traceId: Request trace ID for debugging (optional)
 *
 * @example
 * ```typescript
 * const errorResponse: ErrorResponse = {
 *   success: false,
 *   errors: [
 *     { field: 'email', message: 'Email is required', code: 'REQUIRED' },
 *     { field: 'email', message: 'Email format is invalid', code: 'INVALID_FORMAT' }
 *   ],
 *   status: 400,
 *   message: 'Validation failed',
 *   code: 'VALIDATION_ERROR',
 *   traceId: 'req-123-456'
 * };
 * ```
 */
export interface ErrorResponse {
  /** Always false for error responses */
  success: false;

  /** Array of detailed error information */
  errors: ErrorDetail[];

  /** HTTP status code */
  status: number;

  /** General error message */
  message: string;

  /** Machine-readable error code */
  code?: string;

  /** Request trace ID for debugging */
  traceId?: string;

  /** ISO timestamp when error occurred */
  timestamp?: string;

  /** No data property in error responses */
  data?: never;
}

/**
 * Error Detail
 *
 * Detailed information about a specific error, including field-level
 * validation errors.
 *
 * @example
 * ```typescript
 * const validationError: ErrorDetail = {
 *   field: 'dateOfBirth',
 *   message: 'Date of birth must be in the past',
 *   code: 'INVALID_DATE'
 * };
 *
 * const generalError: ErrorDetail = {
 *   message: 'Database connection failed',
 *   code: 'DATABASE_ERROR'
 * };
 * ```
 */
export interface ErrorDetail {
  /** Field name for validation errors (optional) */
  field?: string;

  /** Human-readable error message */
  message: string;

  /** Machine-readable error code */
  code?: string;

  /** Additional context about the error */
  details?: unknown;
}

// ==========================================
// TYPE GUARDS
// ==========================================

/**
 * Type guard to check if response is an error response
 *
 * Narrows the type to ErrorResponse if success is false.
 * Useful for error handling and control flow type narrowing.
 *
 * @param response - The API response to check
 * @returns True if response is an error response
 *
 * @example
 * ```typescript
 * const response: ApiResponse<User> = await api.get('/users/123');
 * if (isErrorResponse(response)) {
 *   // TypeScript knows response is ErrorResponse here
 *   console.error(response.errors);
 *   console.error(response.code);
 * }
 * ```
 */
export function isErrorResponse(
  response: ApiResponse<unknown> | ErrorResponse
): response is ErrorResponse {
  return response.success === false;
}

/**
 * Type guard to check if response is a success response
 *
 * Narrows the type to SuccessResponse<T> if success is true.
 * Enables type-safe access to response data.
 *
 * @template T - The type of the response data
 * @param response - The API response to check
 * @returns True if response is a success response
 *
 * @example
 * ```typescript
 * const response: ApiResponse<User> = await api.get('/users/123');
 * if (isSuccessResponse(response)) {
 *   // TypeScript knows response.data is User here
 *   console.log(response.data.name);
 * }
 * ```
 */
export function isSuccessResponse<T>(
  response: ApiResponse<T>
): response is SuccessResponse<T> {
  return response.success === true;
}
