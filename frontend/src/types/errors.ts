/**
 * Error type definitions and utilities
 *
 * @module types/errors
 * @category Core Types
 */

/**
 * Custom API Error class with enhanced error details
 */
export class ApiError extends Error {
  public readonly statusCode?: number;
  public readonly code?: string;
  public readonly endpoint?: string;
  public readonly details?: unknown;

  constructor(
    message: string,
    endpoint?: string,
    code?: string,
    statusCode?: number,
    details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    this.endpoint = endpoint;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

/**
 * Type guard to check if error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Type guard to check if error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
  if (isApiError(error)) {
    return error.statusCode === 401 || error.statusCode === 403 || error.code === 'UNAUTHORIZED';
  }
  return false;
}

/**
 * Type guard to check if error is a validation error
 */
export function isValidationError(error: unknown): boolean {
  if (isApiError(error)) {
    return error.statusCode === 400 || error.statusCode === 422 || error.code === 'VALIDATION_ERROR';
  }
  return false;
}

/**
 * Type guard to check if error is a not found error
 */
export function isNotFoundError(error: unknown): boolean {
  if (isApiError(error)) {
    return error.statusCode === 404 || error.code === 'NOT_FOUND';
  }
  return false;
}

/**
 * Extract error message from unknown error type
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  return 'An unknown error occurred';
}

/**
 * Extract error code from unknown error type
 */
export function getErrorCode(error: unknown): string | undefined {
  if (isApiError(error)) {
    return error.code;
  }
  if (error && typeof error === 'object' && 'code' in error) {
    return String(error.code);
  }
  return undefined;
}

/**
 * Extract status code from unknown error type
 */
export function getStatusCode(error: unknown): number | undefined {
  if (isApiError(error)) {
    return error.statusCode;
  }
  if (error && typeof error === 'object' && 'statusCode' in error) {
    const code = (error as any).statusCode;
    return typeof code === 'number' ? code : undefined;
  }
  return undefined;
}

/**
 * Error response type from API
 */
export interface ErrorResponse {
  error: string;
  message: string;
  statusCode?: number;
  code?: string;
  details?: unknown;
  validation?: Array<{
    field: string;
    message: string;
    code?: string;
  }>;
}

/**
 * Type guard for error response
 */
export function isErrorResponse(value: unknown): value is ErrorResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'error' in value &&
    typeof (value as any).error === 'string'
  );
}

/**
 * Network error class
 */
export class NetworkError extends Error {
  constructor(message: string = 'Network request failed') {
    super(message);
    this.name = 'NetworkError';
  }
}

/**
 * Timeout error class
 */
export class TimeoutError extends Error {
  constructor(message: string = 'Request timeout') {
    super(message);
    this.name = 'TimeoutError';
  }
}

/**
 * Validation error class
 */
export class ValidationError extends ApiError {
  public readonly validation: Array<{
    field: string;
    message: string;
    code?: string;
  }>;

  constructor(
    message: string,
    validation: Array<{ field: string; message: string; code?: string }>
  ) {
    super(message, undefined, 'VALIDATION_ERROR', 422, { validation });
    this.name = 'ValidationError';
    this.validation = validation;
  }
}

/**
 * Type guard for ValidationError
 */
export function isValidationErrorInstance(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}
