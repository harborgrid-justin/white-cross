/**
 * API Type Definitions
 *
 * Standard API response and request types for consistent API contracts.
 * Ensures type safety for HTTP endpoints and GraphQL resolvers.
 *
 * @module types/api
 */

import { CursorPaginatedResult, PaginatedResult } from './pagination';

/**
 * HTTP status codes
 */
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

/**
 * API error code enumeration
 */
export enum ApiErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INVALID_INPUT = 'INVALID_INPUT',
}

/**
 * Validation error detail
 */
export interface ValidationErrorDetail {
  /**
   * Field name that failed validation
   */
  field: string;

  /**
   * Validation error message
   */
  message: string;

  /**
   * Error code for the validation failure
   */
  code?: string;

  /**
   * Rejected value
   */
  value?: any;
}

/**
 * API error response structure
 */
export interface ApiError {
  /**
   * Error code for programmatic handling
   */
  code: ApiErrorCode | string;

  /**
   * Human-readable error message
   */
  message: string;

  /**
   * Detailed error information
   */
  details?: ValidationErrorDetail[] | Record<string, any>;

  /**
   * Error stack trace (only in development)
   */
  stack?: string;

  /**
   * Request ID for tracing
   */
  requestId?: string;

  /**
   * Timestamp of the error
   */
  timestamp?: string;
}

/**
 * Successful API response
 */
export interface ApiSuccessResponse<T = any> {
  /**
   * Success indicator
   */
  success: true;

  /**
   * Response data
   */
  data: T;

  /**
   * Optional metadata
   */
  meta?: Record<string, any>;

  /**
   * Request ID for tracing
   */
  requestId?: string;

  /**
   * Response timestamp
   */
  timestamp?: string;
}

/**
 * Error API response
 */
export interface ApiErrorResponse {
  /**
   * Success indicator (always false)
   */
  success: false;

  /**
   * Error information
   */
  error: ApiError;

  /**
   * Request ID for tracing
   */
  requestId?: string;

  /**
   * Response timestamp
   */
  timestamp?: string;
}

/**
 * Generic API response (success or error)
 */
export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Paginated API response
 */
export interface PaginatedApiResponse<T> extends ApiSuccessResponse<T[]> {
  /**
   * Pagination metadata
   */
  pagination: PaginatedResult<T>['meta'];
}

/**
 * Cursor paginated API response
 */
export interface CursorPaginatedApiResponse<T>
  extends ApiSuccessResponse<T[]> {
  /**
   * Cursor pagination metadata
   */
  pagination: CursorPaginatedResult<T>['meta'];
}

/**
 * Batch operation result
 */
export interface BatchOperationResult<T = any> {
  /**
   * Successfully processed items
   */
  successful: T[];

  /**
   * Failed items with error details
   */
  failed: Array<{
    item: T;
    error: ApiError;
  }>;

  /**
   * Summary statistics
   */
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}

/**
 * Health check response
 */
export interface HealthCheckResponse {
  /**
   * Overall system status
   */
  status: 'healthy' | 'degraded' | 'unhealthy';

  /**
   * Timestamp of the check
   */
  timestamp: string;

  /**
   * Service uptime in milliseconds
   */
  uptime: number;

  /**
   * Individual service checks
   */
  checks: {
    database?: { status: 'up' | 'down'; responseTime?: number };
    redis?: { status: 'up' | 'down'; responseTime?: number };
    [service: string]: { status: 'up' | 'down'; responseTime?: number } | undefined;
  };
}

/**
 * Type guard to check if response is successful
 */
export function isApiSuccess<T>(
  response: ApiResponse<T>,
): response is ApiSuccessResponse<T> {
  return response.success;
}

/**
 * Type guard to check if response is an error
 */
export function isApiError(response: ApiResponse): response is ApiErrorResponse {
  return !response.success;
}
