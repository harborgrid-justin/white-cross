/**
 * @fileoverview API Response Type Guards
 * @module utils/adapters/apiAdapters.guards
 * @category Utilities
 *
 * Type guard utilities for runtime type checking of API responses.
 * Provides safe type narrowing for different response shapes.
 *
 * @example
 * ```typescript
 * if (isSuccessResponse(response)) {
 *   // response.data is available and type-safe
 *   console.log(response.data);
 * }
 *
 * if (isErrorResponse(response)) {
 *   // response.errors is available
 *   console.error(response.errors);
 * }
 * ```
 */

import type {
  ApiResponse,
  SuccessResponse,
  ErrorResponse,
  PaginatedResponse,
} from './apiAdapters.types';

// ==========================================
// TYPE GUARDS
// ==========================================

/**
 * Type guard to check if response is successful
 *
 * @param response - The API response to check
 * @returns True if response is successful
 *
 * @example
 * ```typescript
 * if (isSuccessResponse(response)) {
 *   // response.data is available
 *   console.log(response.data);
 * }
 * ```
 */
export function isSuccessResponse<T>(
  response: ApiResponse<T>
): response is SuccessResponse<T> {
  return response.success === true && 'data' in response;
}

/**
 * Type guard to check if response is an error
 *
 * @param {ApiResponse<unknown> | ErrorResponse} response - The API response to check
 * @returns {boolean} True if response is an error
 *
 * @example
 * ```typescript
 * if (isErrorResponse(response)) {
 *   console.error(response.errors);
 * }
 * ```
 */
export function isErrorResponse(
  response: ApiResponse<unknown> | ErrorResponse
): response is ErrorResponse {
  return response.success === false && 'errors' in response;
}

/**
 * Type guard for paginated responses
 *
 * @param response - The response to check
 * @returns True if response is paginated
 *
 * @example
 * ```typescript
 * if (isPaginatedResponse(response)) {
 *   console.log(response.pagination);
 * }
 * ```
 */
export function isPaginatedResponse<T>(
  response: unknown
): response is PaginatedResponse<T> {
  return (
    typeof response === 'object' &&
    response !== null &&
    'data' in response &&
    'pagination' in response &&
    Array.isArray((response as PaginatedResponse<T>).data)
  );
}
