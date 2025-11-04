/**
 * Type Guard Utilities
 *
 * Runtime type checking and type narrowing functions for TypeScript.
 * Enables safe type assertions in catch blocks and dynamic data.
 *
 * @module lib/utils/type-guards
 */

import type { ApiResponse, PaginatedResponse, ApiError, ValidationError } from '@/types';

// ============================================================================
// BASIC TYPE GUARDS
// ============================================================================

/**
 * Type guard for standard Error instances.
 *
 * @param error - Value to check
 * @returns True if value is an Error
 *
 * @example
 * ```typescript
 * try {
 *   await operation();
 * } catch (error) {
 *   if (isError(error)) {
 *     console.error(error.message);
 *   }
 * }
 * ```
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Type guard for objects with a message property.
 *
 * @param value - Value to check
 * @returns True if has message property
 *
 * @example
 * ```typescript
 * if (hasMessage(error)) {
 *   console.log(error.message);
 * }
 * ```
 */
export function hasMessage(value: unknown): value is { message: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof (value as Record<string, unknown>).message === 'string'
  );
}

/**
 * Type guard for objects with a code property.
 *
 * @param value - Value to check
 * @returns True if has code property
 *
 * @example
 * ```typescript
 * if (hasCode(error)) {
 *   switch (error.code) {
 *     case 'NOT_FOUND':
 *       // Handle not found
 *       break;
 *   }
 * }
 * ```
 */
export function hasCode(value: unknown): value is { code: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    typeof (value as Record<string, unknown>).code === 'string'
  );
}

/**
 * Type guard for objects with a statusCode property.
 *
 * @param value - Value to check
 * @returns True if has statusCode property
 *
 * @example
 * ```typescript
 * if (hasStatusCode(error) && error.statusCode === 404) {
 *   // Handle not found
 * }
 * ```
 */
export function hasStatusCode(value: unknown): value is { statusCode: number } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'statusCode' in value &&
    typeof (value as Record<string, unknown>).statusCode === 'number'
  );
}

// ============================================================================
// API RESPONSE TYPE GUARDS
// ============================================================================

/**
 * Type guard for ApiResponse.
 *
 * @param value - Value to check
 * @returns True if value is ApiResponse
 *
 * @example
 * ```typescript
 * if (isApiResponse(response)) {
 *   console.log(response.data);
 * }
 * ```
 */
export function isApiResponse<T = any>(value: unknown): value is ApiResponse<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'success' in value &&
    'data' in value &&
    typeof (value as Record<string, unknown>).success === 'boolean'
  );
}

/**
 * Type guard for successful ApiResponse.
 *
 * @param value - Value to check
 * @returns True if value is successful ApiResponse
 *
 * @example
 * ```typescript
 * if (isSuccessResponse(response)) {
 *   // TypeScript knows response.data exists and success is true
 *   console.log(response.data);
 * }
 * ```
 */
export function isSuccessResponse<T = any>(value: unknown): value is ApiResponse<T> & { success: true } {
  return isApiResponse(value) && value.success === true;
}

/**
 * Type guard for failed ApiResponse.
 *
 * @param value - Value to check
 * @returns True if value is failed ApiResponse
 *
 * @example
 * ```typescript
 * if (isErrorResponse(response)) {
 *   console.error(response.message);
 * }
 * ```
 */
export function isErrorResponse(value: unknown): value is ApiResponse & { success: false } {
  return isApiResponse(value) && value.success === false;
}

/**
 * Type guard for PaginatedResponse.
 *
 * @param value - Value to check
 * @returns True if value is PaginatedResponse
 *
 * @example
 * ```typescript
 * if (isPaginatedResponse(response)) {
 *   console.log(`Page ${response.pagination.page} of ${response.pagination.pages}`);
 * }
 * ```
 */
export function isPaginatedResponse<T = any>(value: unknown): value is PaginatedResponse<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'data' in value &&
    'pagination' in value &&
    Array.isArray((value as Record<string, unknown>).data) &&
    typeof (value as Record<string, unknown>).pagination === 'object'
  );
}

// ============================================================================
// ERROR TYPE GUARDS
// ============================================================================

/**
 * Type guard for ApiError.
 *
 * @param value - Value to check
 * @returns True if value is ApiError
 *
 * @example
 * ```typescript
 * if (isApiError(error)) {
 *   console.error(`API Error [${error.code}]: ${error.message}`);
 * }
 * ```
 */
export function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof (value as Record<string, unknown>).message === 'string'
  );
}

/**
 * Type guard for ValidationError.
 *
 * @param value - Value to check
 * @returns True if value is ValidationError
 *
 * @example
 * ```typescript
 * if (isValidationError(error)) {
 *   console.error(`Field ${error.field}: ${error.message}`);
 * }
 * ```
 */
export function isValidationError(value: unknown): value is ValidationError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'field' in value &&
    'message' in value &&
    typeof (value as Record<string, unknown>).field === 'string' &&
    typeof (value as Record<string, unknown>).message === 'string'
  );
}

/**
 * Type guard for network errors.
 *
 * @param value - Value to check
 * @returns True if value is a network error
 *
 * @example
 * ```typescript
 * if (isNetworkError(error)) {
 *   console.error('Network error - check your connection');
 * }
 * ```
 */
export function isNetworkError(value: unknown): value is Error & { code: 'NETWORK_ERROR' } {
  return isError(value) && hasCode(value) && value.code === 'NETWORK_ERROR';
}

/**
 * Type guard for 401 Unauthorized errors.
 *
 * @param value - Value to check
 * @returns True if value is 401 error
 *
 * @example
 * ```typescript
 * if (isUnauthorizedError(error)) {
 *   // Redirect to login
 *   router.push('/login');
 * }
 * ```
 */
export function isUnauthorizedError(value: unknown): value is ApiError & { statusCode: 401 } {
  return isApiError(value) && hasStatusCode(value) && value.statusCode === 401;
}

/**
 * Type guard for 403 Forbidden errors.
 *
 * @param value - Value to check
 * @returns True if value is 403 error
 *
 * @example
 * ```typescript
 * if (isForbiddenError(error)) {
 *   console.error('Access denied');
 * }
 * ```
 */
export function isForbiddenError(value: unknown): value is ApiError & { statusCode: 403 } {
  return isApiError(value) && hasStatusCode(value) && value.statusCode === 403;
}

/**
 * Type guard for 404 Not Found errors.
 *
 * @param value - Value to check
 * @returns True if value is 404 error
 *
 * @example
 * ```typescript
 * if (isNotFoundError(error)) {
 *   console.error('Resource not found');
 * }
 * ```
 */
export function isNotFoundError(value: unknown): value is ApiError & { statusCode: 404 } {
  return isApiError(value) && hasStatusCode(value) && value.statusCode === 404;
}

/**
 * Type guard for 500+ Server errors.
 *
 * @param value - Value to check
 * @returns True if value is server error
 *
 * @example
 * ```typescript
 * if (isServerError(error)) {
 *   console.error('Server error - please try again later');
 * }
 * ```
 */
export function isServerError(value: unknown): value is ApiError {
  return isApiError(value) && hasStatusCode(value) && value.statusCode >= 500;
}

// ============================================================================
// DATA TYPE GUARDS
// ============================================================================

/**
 * Type guard for string.
 *
 * @param value - Value to check
 * @returns True if value is string
 *
 * @example
 * ```typescript
 * if (isString(value)) {
 *   console.log(value.toUpperCase());
 * }
 * ```
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Type guard for non-empty string.
 *
 * @param value - Value to check
 * @returns True if value is non-empty string
 *
 * @example
 * ```typescript
 * if (isNonEmptyString(value)) {
 *   // TypeScript knows value is string and not empty
 *   console.log(value);
 * }
 * ```
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Type guard for number.
 *
 * @param value - Value to check
 * @returns True if value is number
 *
 * @example
 * ```typescript
 * if (isNumber(value)) {
 *   console.log(value.toFixed(2));
 * }
 * ```
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Type guard for boolean.
 *
 * @param value - Value to check
 * @returns True if value is boolean
 *
 * @example
 * ```typescript
 * if (isBoolean(value)) {
 *   console.log(value ? 'yes' : 'no');
 * }
 * ```
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Type guard for array.
 *
 * @param value - Value to check
 * @returns True if value is array
 *
 * @example
 * ```typescript
 * if (isArray(value)) {
 *   console.log(value.length);
 * }
 * ```
 */
export function isArray<T = any>(value: unknown): value is T[] {
  return Array.isArray(value);
}

/**
 * Type guard for non-empty array.
 *
 * @param value - Value to check
 * @returns True if value is non-empty array
 *
 * @example
 * ```typescript
 * if (isNonEmptyArray(value)) {
 *   console.log(value[0]);
 * }
 * ```
 */
export function isNonEmptyArray<T = any>(value: unknown): value is [T, ...T[]] {
  return Array.isArray(value) && value.length > 0;
}

/**
 * Type guard for object.
 *
 * @param value - Value to check
 * @returns True if value is object (not null, not array)
 *
 * @example
 * ```typescript
 * if (isObject(value)) {
 *   console.log(Object.keys(value));
 * }
 * ```
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Type guard for null or undefined.
 *
 * @param value - Value to check
 * @returns True if value is null or undefined
 *
 * @example
 * ```typescript
 * if (isNullish(value)) {
 *   console.log('Value is null or undefined');
 * }
 * ```
 */
export function isNullish(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Type guard for Date object.
 *
 * @param value - Value to check
 * @returns True if value is valid Date
 *
 * @example
 * ```typescript
 * if (isDate(value)) {
 *   console.log(value.toISOString());
 * }
 * ```
 */
export function isDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

// ============================================================================
// UTILITY TYPE GUARDS
// ============================================================================

/**
 * Type guard for checking if object has a specific property.
 *
 * @param obj - Object to check
 * @param prop - Property name
 * @returns True if object has property
 *
 * @example
 * ```typescript
 * if (hasProperty(obj, 'id')) {
 *   console.log(obj.id);
 * }
 * ```
 */
export function hasProperty<K extends string>(
  obj: unknown,
  prop: K
): obj is Record<K, unknown> {
  return isObject(obj) && prop in obj;
}

/**
 * Type guard for checking if value is one of allowed values.
 *
 * @param value - Value to check
 * @param allowedValues - Array of allowed values
 * @returns True if value is in allowed values
 *
 * @example
 * ```typescript
 * const status = 'active';
 * if (isOneOf(status, ['active', 'inactive'])) {
 *   // TypeScript knows status is 'active' | 'inactive'
 * }
 * ```
 */
export function isOneOf<T>(value: unknown, allowedValues: readonly T[]): value is T {
  return allowedValues.includes(value as T);
}

/**
 * Ensures a value is an Error, converting if necessary.
 *
 * @param value - Value to convert
 * @param fallbackMessage - Message if not an error
 * @returns Error object
 *
 * @example
 * ```typescript
 * try {
 *   await operation();
 * } catch (error) {
 *   const err = ensureError(error);
 *   console.error(err.message);
 * }
 * ```
 */
export function ensureError(value: unknown, fallbackMessage: string = 'An error occurred'): Error {
  if (isError(value)) {
    return value;
  }

  if (hasMessage(value)) {
    return new Error(value.message);
  }

  if (isString(value)) {
    return new Error(value);
  }

  return new Error(fallbackMessage);
}

/**
 * Safely extracts error message from unknown error.
 *
 * @param value - Error value
 * @param fallback - Fallback message
 * @returns Error message string
 *
 * @example
 * ```typescript
 * const message = getErrorMessage(error, 'Failed to load data');
 * console.error(message);
 * ```
 */
export function getErrorMessage(value: unknown, fallback: string = 'An error occurred'): string {
  if (isError(value)) {
    return value.message || fallback;
  }

  if (hasMessage(value)) {
    return value.message;
  }

  if (isString(value)) {
    return value;
  }

  return fallback;
}

/**
 * Safely extracts status code from error.
 *
 * @param value - Error value
 * @returns Status code or undefined
 *
 * @example
 * ```typescript
 * const status = getStatusCode(error);
 * if (status === 404) {
 *   // Handle not found
 * }
 * ```
 */
export function getStatusCode(value: unknown): number | undefined {
  if (hasStatusCode(value)) {
    return value.statusCode;
  }

  return undefined;
}

/**
 * Safely extracts error code from error.
 *
 * @param value - Error value
 * @returns Error code or undefined
 *
 * @example
 * ```typescript
 * const code = getErrorCode(error);
 * if (code === 'VALIDATION_ERROR') {
 *   // Handle validation error
 * }
 * ```
 */
export function getErrorCode(value: unknown): string | undefined {
  if (hasCode(value)) {
    return value.code;
  }

  return undefined;
}
