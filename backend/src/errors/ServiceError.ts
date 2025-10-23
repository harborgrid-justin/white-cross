/**
 * @fileoverview Custom Error Classes for Safe Error Handling
 * @module errors/ServiceError
 * @description Custom error classes that provide client-safe error messages
 * while logging full details server-side. Prevents information disclosure.
 *
 * SECURITY: Never expose stack traces or implementation details to clients
 * HIPAA: Ensure error messages don't contain PHI
 *
 * @security Information disclosure prevention
 * @security Safe error messages for clients
 */

/**
 * Base service error class
 *
 * Provides client-safe error responses while logging full details server-side
 * All service errors should extend this class
 */
export class ServiceError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly timestamp: Date;
  private readonly details?: any;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'SERVICE_ERROR',
    details?: any
  ) {
    super(message);
    this.name = 'ServiceError';
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true; // Indicates this is an expected operational error
    this.timestamp = new Date();
    this.details = details;

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Get client-safe error response
   * SECURITY: Never includes stack trace or implementation details
   */
  toClientResponse(): {
    error: string;
    code: string;
    timestamp: string;
  } {
    return {
      error: this.message,
      code: this.code,
      timestamp: this.timestamp.toISOString()
    };
  }

  /**
   * Get full error details for server-side logging
   * SECURITY: Only use this in server logs, never send to client
   */
  toLogObject(): {
    name: string;
    message: string;
    code: string;
    statusCode: number;
    stack?: string;
    details?: any;
    timestamp: string;
  } {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      stack: this.stack,
      details: this.details,
      timestamp: this.timestamp.toISOString()
    };
  }
}

/**
 * Validation error - user input failed validation
 */
export class ValidationError extends ServiceError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

/**
 * Authorization error - user not authorized for action
 */
export class AuthorizationError extends ServiceError {
  constructor(message: string = 'You are not authorized to perform this action', details?: any) {
    super(message, 403, 'AUTHORIZATION_ERROR', details);
    this.name = 'AuthorizationError';
  }
}

/**
 * Authentication error - user not authenticated
 */
export class AuthenticationError extends ServiceError {
  constructor(message: string = 'Authentication required', details?: any) {
    super(message, 401, 'AUTHENTICATION_ERROR', details);
    this.name = 'AuthenticationError';
  }
}

/**
 * Not found error - resource not found
 */
export class NotFoundError extends ServiceError {
  constructor(message: string = 'Resource not found', details?: any) {
    super(message, 404, 'NOT_FOUND_ERROR', details);
    this.name = 'NotFoundError';
  }
}

/**
 * Conflict error - resource conflict (e.g., duplicate entry)
 */
export class ConflictError extends ServiceError {
  constructor(message: string = 'Resource conflict', details?: any) {
    super(message, 409, 'CONFLICT_ERROR', details);
    this.name = 'ConflictError';
  }
}

/**
 * Rate limit error - too many requests
 */
export class RateLimitError extends ServiceError {
  public readonly retryAfter?: number;

  constructor(message: string = 'Too many requests', retryAfterSeconds?: number) {
    super(message, 429, 'RATE_LIMIT_ERROR');
    this.name = 'RateLimitError';
    this.retryAfter = retryAfterSeconds;
  }

  toClientResponse() {
    const response = super.toClientResponse();
    if (this.retryAfter) {
      return {
        ...response,
        retryAfter: this.retryAfter
      };
    }
    return response;
  }
}

/**
 * Database error - database operation failed
 * SECURITY: Never expose database details to client
 */
export class DatabaseError extends ServiceError {
  constructor(message: string = 'Database operation failed', details?: any) {
    // Client sees generic message, details only in logs
    super('An error occurred while processing your request', 500, 'DATABASE_ERROR', details);
    this.name = 'DatabaseError';
  }
}

/**
 * External service error - external API/service failed
 */
export class ExternalServiceError extends ServiceError {
  constructor(
    serviceName: string,
    message: string = 'External service unavailable',
    details?: any
  ) {
    super(
      `${serviceName} service is temporarily unavailable`,
      503,
      'EXTERNAL_SERVICE_ERROR',
      details
    );
    this.name = 'ExternalServiceError';
  }
}

/**
 * Encryption error - encryption/decryption failed
 * SECURITY: Never expose encryption details to client
 */
export class EncryptionError extends ServiceError {
  constructor(message: string = 'Encryption operation failed', details?: any) {
    // Client sees generic message, details only in logs
    super('Unable to process secure data', 500, 'ENCRYPTION_ERROR', details);
    this.name = 'EncryptionError';
  }
}

/**
 * File upload error - file upload validation failed
 */
export class FileUploadError extends ServiceError {
  constructor(message: string, details?: any) {
    super(message, 400, 'FILE_UPLOAD_ERROR', details);
    this.name = 'FileUploadError';
  }
}

/**
 * Helper to check if error is operational (expected) vs programming error
 */
export function isOperationalError(error: Error): boolean {
  if (error instanceof ServiceError) {
    return error.isOperational;
  }
  return false;
}

/**
 * Helper to safely convert any error to ServiceError
 */
export function toServiceError(error: any): ServiceError {
  if (error instanceof ServiceError) {
    return error;
  }

  if (error instanceof Error) {
    return new ServiceError(
      'An unexpected error occurred',
      500,
      'UNEXPECTED_ERROR',
      { originalError: error.message }
    );
  }

  return new ServiceError(
    'An unexpected error occurred',
    500,
    'UNKNOWN_ERROR',
    { error: String(error) }
  );
}
