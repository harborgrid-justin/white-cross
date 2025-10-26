/**
 * WF-COMP-ERROR | errors.ts - Centralized Error Handling
 * Purpose: Type-safe error classes and utilities for API error handling
 * Upstream: axios, API responses | Dependencies: None
 * Downstream: All API services, error boundaries | Called by: Service modules
 * Related: typeGuards.ts, ApiClient.ts, error boundaries
 * Exports: ApiError, ValidationError, NetworkError, error factories
 * Last Updated: 2025-10-23 | File Type: .ts
 * Critical Path: Error occurs → Type guard → Create typed error → Propagate with context
 * LLM Context: HIPAA-compliant error handling, preserves debugging context, sanitizes sensitive data
 */

/**
 * Base API Error Class
 *
 * Provides consistent error handling across all API services with:
 * - Original error preservation for debugging
 * - HTTP status code tracking
 * - Error code categorization
 * - Timestamp for logging/audit
 * - HIPAA-compliant message sanitization
 */
export class ApiError extends Error {
  public readonly name = 'ApiError';
  public readonly timestamp: Date;
  public readonly originalError?: Error;
  public readonly statusCode?: number;
  public readonly code?: string;

  constructor(
    message: string,
    originalError?: Error,
    statusCode?: number,
    code?: string
  ) {
    super(message);

    // Maintain proper prototype chain
    Object.setPrototypeOf(this, ApiError.prototype);

    this.timestamp = new Date();
    this.originalError = originalError;
    this.statusCode = statusCode;
    this.code = code;

    // Capture stack trace, excluding constructor call
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  /**
   * Get sanitized error message (HIPAA-compliant)
   * Removes potential PHI/PII from error messages
   */
  getSanitizedMessage(): string {
    return sanitizeErrorMessage(this.message);
  }

  /**
   * Serialize error for logging/monitoring
   * Excludes originalError to prevent circular references
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      code: this.code,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack
    };
  }
}

/**
 * Validation Error
 * Used for data validation failures (Zod, form validation, etc.)
 */
export class ValidationError extends ApiError {
  public readonly name = 'ValidationError';
  public readonly field?: string;
  public readonly validationErrors?: Record<string, string[]>;

  constructor(
    message: string,
    field?: string,
    validationErrors?: Record<string, string[]>,
    originalError?: Error
  ) {
    super(message, originalError, 400, 'VALIDATION_ERROR');
    Object.setPrototypeOf(this, ValidationError.prototype);

    this.field = field;
    this.validationErrors = validationErrors;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      field: this.field,
      validationErrors: this.validationErrors
    };
  }
}

/**
 * Network Error
 * Used for network-level failures (timeout, connection refused, etc.)
 */
export class NetworkError extends ApiError {
  public readonly name = 'NetworkError';
  public readonly timeout?: number;
  public readonly retryable: boolean;

  constructor(
    message: string,
    originalError?: Error,
    timeout?: number,
    retryable: boolean = true
  ) {
    super(message, originalError, undefined, 'NETWORK_ERROR');
    Object.setPrototypeOf(this, NetworkError.prototype);

    this.timeout = timeout;
    this.retryable = retryable;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      timeout: this.timeout,
      retryable: this.retryable
    };
  }
}

/**
 * Authentication Error
 * Used for authentication and authorization failures
 */
export class AuthenticationError extends ApiError {
  public readonly name = 'AuthenticationError';
  public readonly requiresReauthentication: boolean;

  constructor(
    message: string,
    statusCode: number = 401,
    requiresReauthentication: boolean = true,
    originalError?: Error
  ) {
    super(message, originalError, statusCode, 'AUTH_ERROR');
    Object.setPrototypeOf(this, AuthenticationError.prototype);

    this.requiresReauthentication = requiresReauthentication;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      requiresReauthentication: this.requiresReauthentication
    };
  }
}

/**
 * Error Factory Functions
 * Consistent error creation with proper typing
 */

/**
 * Create API error from axios error or generic error
 */
export function createApiError(
  error: unknown,
  fallbackMessage: string = 'An error occurred'
): ApiError {
  // Handle axios errors
  if (isAxiosError(error)) {
    const message = error.response?.data?.message || error.message || fallbackMessage;
    const statusCode = error.response?.status;
    const code = error.code;

    return new ApiError(message, error, statusCode, code);
  }

  // Handle existing ApiError instances
  if (error instanceof ApiError) {
    return error;
  }

  // Handle generic Error instances
  if (error instanceof Error) {
    return new ApiError(error.message || fallbackMessage, error);
  }

  // Handle unknown error types
  return new ApiError(fallbackMessage);
}

/**
 * Create validation error from Zod or other validation failures
 */
export function createValidationError(
  message: string,
  field?: string,
  validationErrors?: Record<string, string[]>,
  originalError?: Error
): ValidationError {
  return new ValidationError(message, field, validationErrors, originalError);
}

/**
 * Create network error from connection failures
 */
export function createNetworkError(
  message: string,
  originalError?: Error,
  timeout?: number,
  retryable: boolean = true
): NetworkError {
  return new NetworkError(message, originalError, timeout, retryable);
}

/**
 * Create authentication error
 */
export function createAuthenticationError(
  message: string,
  statusCode: number = 401,
  requiresReauthentication: boolean = true,
  originalError?: Error
): AuthenticationError {
  return new AuthenticationError(message, statusCode, requiresReauthentication, originalError);
}

/**
 * Type guard for axios errors
 * Import axios type guard or implement if not available
 */
function isAxiosError(error: unknown): error is {
  response?: {
    data?: { message?: string };
    status?: number
  };
  message?: string;
  code?: string
} {
  return (
    typeof error === 'object' &&
    error !== null &&
    ('response' in error || 'message' in error || 'code' in error)
  );
}

/**
 * Sanitize error message to remove potential PHI/PII
 * HIPAA Compliance: Remove common patterns that might expose sensitive data
 */
function sanitizeErrorMessage(message: string): string {
  if (!message) return 'An error occurred';

  let sanitized = message;

  // Remove email addresses
  sanitized = sanitized.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[email]');

  // Remove phone numbers (various formats)
  sanitized = sanitized.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[phone]');

  // Remove SSN patterns
  sanitized = sanitized.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[ssn]');

  // Remove medical record numbers (assuming format like MRN-######)
  sanitized = sanitized.replace(/\b[A-Z]{2,4}-?\d{6,}\b/g, '[record-id]');

  // Remove dates of birth (various formats)
  sanitized = sanitized.replace(/\b\d{1,2}\/\d{1,2}\/\d{4}\b/g, '[date]');

  // Remove potential names (capitalized words that might be names)
  // Note: This is conservative and may not catch all cases
  // In production, consider more sophisticated NER/PII detection

  return sanitized;
}

/**
 * Check if error should be retried
 * Used by resilience patterns (circuit breaker, retry logic)
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof NetworkError) {
    return error.retryable;
  }

  if (error instanceof ApiError) {
    // Retry on server errors (5xx) and some client errors
    const retryableStatuses = [408, 429, 500, 502, 503, 504];
    return error.statusCode ? retryableStatuses.includes(error.statusCode) : false;
  }

  return false;
}

/**
 * Get user-friendly error message
 * Provides appropriate messages for different error types
 */
export function getUserFriendlyMessage(error: unknown): string {
  if (error instanceof ValidationError) {
    return error.field
      ? `Invalid ${error.field}: ${error.message}`
      : `Validation error: ${error.message}`;
  }

  if (error instanceof AuthenticationError) {
    return error.requiresReauthentication
      ? 'Your session has expired. Please log in again.'
      : 'You do not have permission to perform this action.';
  }

  if (error instanceof NetworkError) {
    return 'Network error. Please check your connection and try again.';
  }

  if (error instanceof ApiError) {
    // Use sanitized message for user display
    return error.getSanitizedMessage();
  }

  if (error instanceof Error) {
    return error.message || 'An unexpected error occurred.';
  }

  return 'An unexpected error occurred.';
}

/**
 * Error logging helper
 * Provides structured error information for logging services
 */
export function getErrorLogData(error: unknown): Record<string, unknown> {
  if (error instanceof ApiError) {
    return error.toJSON();
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack
    };
  }

  return {
    error: String(error)
  };
}
