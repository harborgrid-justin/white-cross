/**
 * API Response Builder Utilities
 *
 * Helper functions for creating standardized API responses.
 * Ensures all responses follow the same format.
 *
 * @module lib/utils/api-response
 * @since 2025-11-04
 */

import type {
  ApiSuccessResponse,
  ApiErrorResponse,
  ApiError,
  ResponseMeta,
  PaginatedResponse,
  PaginationMeta,
} from '../../types/api.types';

/**
 * Create response metadata
 *
 * @param requestId - Optional request ID
 * @param version - Optional API version
 * @returns Response metadata
 */
export function createResponseMeta(requestId?: string, version?: string): ResponseMeta {
  return {
    timestamp: new Date().toISOString(),
    requestId: requestId || crypto.randomUUID(),
    version: version || process.env.NEXT_PUBLIC_API_VERSION || '1.0.0',
  };
}

/**
 * Create success response
 *
 * @template T - Type of response data
 * @param data - Response data
 * @param meta - Optional metadata
 * @returns Standardized success response
 *
 * @example
 * ```typescript
 * return successResponse({ user: { id: '123', name: 'John' } });
 * ```
 */
export function successResponse<T>(
  data: T,
  meta?: Partial<ResponseMeta>
): ApiSuccessResponse<T> {
  return {
    success: true,
    data,
    meta: {
      ...createResponseMeta(),
      ...meta,
    },
  };
}

/**
 * Create error response
 *
 * @param code - Error code
 * @param message - Error message
 * @param details - Optional field-level details
 * @param meta - Optional metadata
 * @returns Standardized error response
 *
 * @example
 * ```typescript
 * return errorResponse('VALIDATION_ERROR', 'Invalid email format', { email: ['Must be a valid email'] });
 * ```
 */
export function errorResponse(
  code: string,
  message: string,
  details?: Record<string, string[]>,
  meta?: Partial<ResponseMeta>
): ApiErrorResponse {
  const error: ApiError = {
    code,
    message,
    ...(details && { details }),
  };

  // Include stack trace only in development
  if (process.env.NODE_ENV === 'development') {
    error.stack = new Error().stack;
  }

  return {
    success: false,
    error,
    meta: {
      ...createResponseMeta(),
      ...meta,
    },
  };
}

/**
 * Create validation error response
 *
 * @param message - General error message
 * @param fieldErrors - Field-level validation errors
 * @param meta - Optional metadata
 * @returns Validation error response
 */
export function validationErrorResponse(
  message: string,
  fieldErrors: Record<string, string[]>,
  meta?: Partial<ResponseMeta>
): ApiErrorResponse {
  return errorResponse('VALIDATION_ERROR', message, fieldErrors, meta);
}

/**
 * Create authentication error response
 *
 * @param message - Error message (default: 'Authentication required')
 * @param meta - Optional metadata
 * @returns Authentication error response
 */
export function authenticationErrorResponse(
  message: string = 'Authentication required',
  meta?: Partial<ResponseMeta>
): ApiErrorResponse {
  return errorResponse('AUTHENTICATION_ERROR', message, undefined, meta);
}

/**
 * Create authorization error response
 *
 * @param message - Error message (default: 'Insufficient permissions')
 * @param meta - Optional metadata
 * @returns Authorization error response
 */
export function authorizationErrorResponse(
  message: string = 'Insufficient permissions',
  meta?: Partial<ResponseMeta>
): ApiErrorResponse {
  return errorResponse('AUTHORIZATION_ERROR', message, undefined, meta);
}

/**
 * Create not found error response
 *
 * @param resource - Resource type that was not found
 * @param meta - Optional metadata
 * @returns Not found error response
 */
export function notFoundErrorResponse(
  resource: string = 'Resource',
  meta?: Partial<ResponseMeta>
): ApiErrorResponse {
  return errorResponse('NOT_FOUND', `${resource} not found`, undefined, meta);
}

/**
 * Create internal server error response
 *
 * @param message - Error message (default: 'Internal server error')
 * @param meta - Optional metadata
 * @returns Internal server error response
 */
export function internalErrorResponse(
  message: string = 'Internal server error',
  meta?: Partial<ResponseMeta>
): ApiErrorResponse {
  return errorResponse('INTERNAL_ERROR', message, undefined, meta);
}

/**
 * Create paginated response
 *
 * @template T - Type of items
 * @param data - Array of items
 * @param pagination - Pagination metadata
 * @param meta - Optional response metadata
 * @returns Paginated success response
 *
 * @example
 * ```typescript
 * return paginatedResponse(users, {
 *   page: 1,
 *   pageSize: 20,
 *   total: 100,
 *   totalPages: 5,
 *   hasMore: true,
 *   isFirst: true,
 *   isLast: false,
 * });
 * ```
 */
export function paginatedResponse<T>(
  data: T[],
  pagination: PaginationMeta,
  meta?: Partial<ResponseMeta>
): ApiSuccessResponse<PaginatedResponse<T>> {
  return successResponse(
    {
      data,
      pagination,
    },
    meta
  );
}

/**
 * Calculate pagination metadata
 *
 * @param page - Current page number
 * @param pageSize - Items per page
 * @param total - Total number of items
 * @returns Pagination metadata
 */
export function calculatePaginationMeta(
  page: number,
  pageSize: number,
  total: number
): PaginationMeta {
  const totalPages = Math.ceil(total / pageSize);

  return {
    page,
    pageSize,
    total,
    totalPages,
    hasMore: page < totalPages,
    isFirst: page === 1,
    isLast: page === totalPages,
  };
}

/**
 * Create paginated response from data array
 *
 * @template T - Type of items
 * @param allData - Complete data array
 * @param page - Current page number
 * @param pageSize - Items per page
 * @param meta - Optional response metadata
 * @returns Paginated response with sliced data
 */
export function createPaginatedResponse<T>(
  allData: T[],
  page: number,
  pageSize: number,
  meta?: Partial<ResponseMeta>
): ApiSuccessResponse<PaginatedResponse<T>> {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const data = allData.slice(start, end);
  const pagination = calculatePaginationMeta(page, pageSize, allData.length);

  return paginatedResponse(data, pagination, meta);
}

/**
 * Sanitize error for client
 * Removes sensitive information from errors
 *
 * @param error - Error to sanitize
 * @returns Safe error message
 */
export function sanitizeError(error: any): string {
  // Never expose internal error details in production
  if (process.env.NODE_ENV === 'production') {
    // Generic error messages for production
    if (error.code === 'ECONNREFUSED') {
      return 'Service temporarily unavailable';
    }

    if (error.code === 'ETIMEDOUT') {
      return 'Request timeout';
    }

    // Default safe message
    return 'An unexpected error occurred';
  }

  // In development, show more details
  return error.message || 'Unknown error';
}

/**
 * Convert unknown error to API error response
 *
 * @param error - Error of any type
 * @param defaultMessage - Default message if error has none
 * @returns API error response
 */
export function toErrorResponse(
  error: unknown,
  defaultMessage: string = 'An error occurred'
): ApiErrorResponse {
  if (error instanceof Error) {
    return errorResponse(
      'INTERNAL_ERROR',
      sanitizeError(error)
    );
  }

  if (typeof error === 'string') {
    return errorResponse('INTERNAL_ERROR', error);
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    return errorResponse(
      'INTERNAL_ERROR',
      sanitizeError(error)
    );
  }

  return errorResponse('INTERNAL_ERROR', defaultMessage);
}

/**
 * Map backend error to safe client error
 * Prevents sensitive backend information from leaking to client
 *
 * @param backendError - Error from backend
 * @returns Safe client error response
 */
export function mapBackendError(backendError: any): ApiErrorResponse {
  // Map known backend error codes to client-safe messages
  const errorMap: Record<string, string> = {
    'DB_CONNECTION_ERROR': 'Service temporarily unavailable',
    'QUERY_TIMEOUT': 'Request timeout',
    'INVALID_QUERY': 'Invalid request',
    'CONSTRAINT_VIOLATION': 'Operation violates data constraints',
  };

  const safeMessage = errorMap[backendError.code] || 'An unexpected error occurred';

  return errorResponse(
    backendError.code || 'INTERNAL_ERROR',
    safeMessage
  );
}
