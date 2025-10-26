/**
 * WF-COMP-GUARDS | typeGuards.ts - Type Guard Utilities
 * Purpose: Type-safe type guards for error handling and runtime type checking
 * Upstream: axios, Error types | Dependencies: @/services/core/errors
 * Downstream: All API services | Called by: Error handling in catch blocks
 * Related: errors.ts, API services
 * Exports: Type guard functions for runtime type narrowing
 * Last Updated: 2025-10-23 | File Type: .ts
 * Critical Path: Error caught → Type guard → Type narrowed → Handle correctly
 * LLM Context: Enables TypeScript type narrowing in catch blocks without any types
 */

import { AxiosError } from 'axios';
import axios from 'axios';
import {
  ApiError,
  ValidationError,
  NetworkError,
  AuthenticationError
} from '@/services/core/errors';

/**
 * Type guard for Axios errors
 * Uses official axios.isAxiosError for accurate detection
 *
 * @example
 * try {
 *   await api.get('/data');
 * } catch (error) {
 *   if (isAxiosError(error)) {
 *     console.log(error.response?.status);
 *   }
 * }
 */
export function isAxiosError(error: unknown): error is AxiosError {
  return axios.isAxiosError(error);
}

/**
 * Type guard for ApiError instances
 * Use to check if error is our custom ApiError
 *
 * @example
 * try {
 *   await someOperation();
 * } catch (error) {
 *   if (isApiError(error)) {
 *     console.log(error.statusCode, error.code);
 *   }
 * }
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Type guard for ValidationError instances
 * Use to check for validation-specific errors
 *
 * @example
 * try {
 *   await validateData(input);
 * } catch (error) {
 *   if (isValidationError(error)) {
 *     console.log(error.validationErrors);
 *   }
 * }
 */
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

/**
 * Type guard for NetworkError instances
 * Use to check for network-level failures
 *
 * @example
 * try {
 *   await fetchData();
 * } catch (error) {
 *   if (isNetworkError(error)) {
 *     if (error.retryable) {
 *       // Retry logic
 *     }
 *   }
 * }
 */
export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

/**
 * Type guard for AuthenticationError instances
 * Use to handle authentication failures
 *
 * @example
 * try {
 *   await authenticatedRequest();
 * } catch (error) {
 *   if (isAuthenticationError(error)) {
 *     if (error.requiresReauthentication) {
 *       // Redirect to login
 *     }
 *   }
 * }
 */
export function isAuthenticationError(error: unknown): error is AuthenticationError {
  return error instanceof AuthenticationError;
}

/**
 * Type guard for objects with a message property
 * Useful for generic error-like objects
 *
 * @example
 * try {
 *   await operation();
 * } catch (error) {
 *   if (hasMessage(error)) {
 *     console.log(error.message);
 *   }
 * }
 */
export function hasMessage(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

/**
 * Type guard for errors with response objects
 * Useful for checking if error has HTTP response data
 *
 * @example
 * try {
 *   await apiCall();
 * } catch (error) {
 *   if (isErrorWithResponse(error)) {
 *     console.log(error.response.data);
 *   }
 * }
 */
export function isErrorWithResponse(
  error: unknown
): error is {
  response: {
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
    status?: number;
    statusText?: string;
  }
} {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as Record<string, unknown>).response === 'object' &&
    (error as Record<string, unknown>).response !== null
  );
}

/**
 * Type guard for errors with status code
 * Useful for HTTP status code checking
 *
 * @example
 * try {
 *   await request();
 * } catch (error) {
 *   if (hasStatusCode(error) && error.statusCode === 404) {
 *     // Handle not found
 *   }
 * }
 */
export function hasStatusCode(error: unknown): error is { statusCode: number } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    typeof (error as Record<string, unknown>).statusCode === 'number'
  );
}

/**
 * Type guard for errors with error code
 * Useful for error code classification
 *
 * @example
 * try {
 *   await operation();
 * } catch (error) {
 *   if (hasErrorCode(error)) {
 *     switch (error.code) {
 *       case 'VALIDATION_ERROR':
 *         // Handle validation error
 *         break;
 *     }
 *   }
 * }
 */
export function hasErrorCode(error: unknown): error is { code: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as Record<string, unknown>).code === 'string'
  );
}

/**
 * Type guard for standard Error instances
 * Use when you need to ensure error is at least an Error object
 *
 * @example
 * try {
 *   await something();
 * } catch (error) {
 *   if (isError(error)) {
 *     console.error(error.stack);
 *   }
 * }
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Comprehensive error handler
 * Returns properly typed error with fallback
 *
 * @example
 * try {
 *   await operation();
 * } catch (error) {
 *   const typedError = ensureError(error, 'Operation failed');
 *   throw typedError;
 * }
 */
export function ensureError(error: unknown, fallbackMessage: string = 'An error occurred'): Error {
  if (isError(error)) {
    return error;
  }

  if (hasMessage(error)) {
    return new Error(error.message);
  }

  if (typeof error === 'string') {
    return new Error(error);
  }

  return new Error(fallbackMessage);
}

/**
 * Get error message safely
 * Returns error message or fallback without type assertions
 *
 * @example
 * try {
 *   await operation();
 * } catch (error) {
 *   const message = getErrorMessage(error);
 *   console.error(message);
 * }
 */
export function getErrorMessage(error: unknown, fallback: string = 'An error occurred'): string {
  if (isError(error)) {
    return error.message || fallback;
  }

  if (hasMessage(error)) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return fallback;
}

/**
 * Get status code from error safely
 * Returns status code or undefined
 *
 * @example
 * try {
 *   await apiCall();
 * } catch (error) {
 *   const status = getStatusCode(error);
 *   if (status === 404) {
 *     // Handle not found
 *   }
 * }
 */
export function getStatusCode(error: unknown): number | undefined {
  if (isAxiosError(error)) {
    return error.response?.status;
  }

  if (hasStatusCode(error)) {
    return error.statusCode;
  }

  return undefined;
}

/**
 * Get error code from error safely
 * Returns error code or undefined
 *
 * @example
 * try {
 *   await operation();
 * } catch (error) {
 *   const code = getErrorCode(error);
 *   if (code === 'NETWORK_ERROR') {
 *     // Handle network error
 *   }
 * }
 */
export function getErrorCode(error: unknown): string | undefined {
  if (hasErrorCode(error)) {
    return error.code;
  }

  if (isAxiosError(error)) {
    return error.code;
  }

  return undefined;
}
