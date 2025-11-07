/**
 * @fileoverview Service Error Classes - Enhanced Error Handling for Services
 * @module shared/errors/ServiceErrors
 * @description Custom error classes with retry semantics for service layer
 *
 * @deprecated This file is DEPRECATED. Use /common/exceptions/ instead.
 * @see /common/exceptions/exceptions/retryable.exception.ts - Modern implementation
 * @see /common/exceptions/exceptions/business.exception.ts - Business logic errors
 *
 * MIGRATION PATH:
 * - ServiceError -> RetryableException or BusinessException
 * - ValidationError -> ValidationException from /common/exceptions/
 * - NotFoundError -> BusinessException.notFound()
 * - DatabaseError -> DatabaseException from /common/exceptions/exceptions/retryable.exception.ts
 * - TimeoutError -> TimeoutException from /common/exceptions/exceptions/retryable.exception.ts
 * - ConflictError -> BusinessException.alreadyExists()
 * - isRetryable() -> Use exception.isRetryable property
 *
 * These error classes complement the existing AppError/ErrorCode system
 * and provide service-specific error handling with retry semantics.
 *
 * Based on patterns from resilientMedicationService.ts and code review recommendations.
 *
 * @see shared/errors/ErrorCode.ts - Base error code system
 * @see services/resilientMedicationService.ts - Reference implementation
 * @author White-Cross Platform Team
 * @version 1.0.0
 * @since 2025-10-23
 */

import { ErrorCode, AppError } from './ErrorCode';

/**
 * Base ServiceError class with retry semantics
 *
 * Extends Error and includes:
 * - Error code for categorization
 * - Context for debugging
 * - isRetryable flag for retry logic
 * - Integration with existing AppError system
 */
export class ServiceError extends Error {
  public readonly code: string;
  public readonly context: Record<string, any>;
  public readonly isRetryable: boolean;
  public readonly timestamp: Date;
  public readonly innerError?: Error;

  constructor(
    code: string,
    message: string,
    context: Record<string, any> = {},
    isRetryable: boolean = false,
    innerError?: Error,
  ) {
    super(message);
    this.name = 'ServiceError';
    this.code = code;
    this.context = context;
    this.isRetryable = isRetryable;
    this.timestamp = new Date();
    this.innerError = innerError;

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ServiceError);
    }
  }

  /**
   * Convert to AppError for compatibility with existing error handling
   */
  toAppError(errorCode: ErrorCode = ErrorCode.ErrInternal): AppError {
    return new AppError(
      errorCode,
      this.message,
      this.innerError || this,
      this.context,
    );
  }

  /**
   * Convert to JSON for logging/API responses
   */
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      context: this.context,
      isRetryable: this.isRetryable,
      timestamp: this.timestamp.toISOString(),
      innerError: this.innerError
        ? {
            name: this.innerError.name,
            message: this.innerError.message,
          }
        : undefined,
      stack: process.env.NODE_ENV === 'development' ? this.stack : undefined,
    };
  }
}

/**
 * ValidationError - Input validation failures
 *
 * Used for:
 * - Invalid input parameters
 * - Schema validation failures
 * - Business rule violations
 * - Constraint violations
 *
 * isRetryable: false (validation errors won't succeed on retry)
 */
export class ValidationError extends ServiceError {
  public readonly field?: string;
  public readonly value?: any;

  constructor(
    message: string,
    context: Record<string, any> = {},
    field?: string,
    value?: any,
  ) {
    const fullContext = {
      ...context,
      ...(field && { field }),
      ...(value !== undefined && { value }),
    };

    super('VALIDATION_ERROR', message, fullContext, false);
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
  }

  /**
   * Convert to AppError with validation error code
   */
  toAppError(): AppError {
    return super.toAppError(ErrorCode.ErrValidationFailed);
  }

  /**
   * Factory method for missing field errors
   */
  static missingField(
    field: string,
    context?: Record<string, any>,
  ): ValidationError {
    return new ValidationError(
      `Required field '${field}' is missing`,
      context,
      field,
    );
  }

  /**
   * Factory method for invalid format errors
   */
  static invalidFormat(
    field: string,
    expectedFormat: string,
    value?: any,
    context?: Record<string, any>,
  ): ValidationError {
    return new ValidationError(
      `Field '${field}' has invalid format. Expected: ${expectedFormat}`,
      { ...context, expectedFormat },
      field,
      value,
    );
  }

  /**
   * Factory method for out of range errors
   */
  static outOfRange(
    field: string,
    min: number,
    max: number,
    value: any,
    context?: Record<string, any>,
  ): ValidationError {
    return new ValidationError(
      `Field '${field}' is out of range. Expected: ${min}-${max}, Got: ${value}`,
      { ...context, min, max },
      field,
      value,
    );
  }
}

/**
 * NotFoundError - Resource not found
 *
 * Used for:
 * - Database entity not found
 * - File not found
 * - Missing configuration
 *
 * isRetryable: false (resource won't appear on retry)
 */
export class NotFoundError extends ServiceError {
  public readonly resource: string;
  public readonly id: string;

  constructor(resource: string, id: string, context: Record<string, any> = {}) {
    const message = `${resource} not found: ${id}`;
    const fullContext = { resource, id, ...context };

    super('NOT_FOUND', message, fullContext, false);
    this.name = 'NotFoundError';
    this.resource = resource;
    this.id = id;
  }

  /**
   * Convert to AppError with not found error code
   */
  toAppError(): AppError {
    return super.toAppError(ErrorCode.ErrNotFound);
  }
}

/**
 * DatabaseError - Database operation failures
 *
 * Used for:
 * - Connection failures
 * - Query timeouts
 * - Constraint violations
 * - Lock contention
 *
 * isRetryable: true (many database errors are transient)
 */
export class DatabaseError extends ServiceError {
  public readonly operation: string;
  public readonly originalError: Error;

  constructor(
    operation: string,
    originalError: Error,
    context: Record<string, any> = {},
  ) {
    const message = `Database error during ${operation}`;
    const fullContext = {
      operation,
      originalError: originalError.message,
      originalErrorName: originalError.name,
      ...context,
    };

    super('DATABASE_ERROR', message, fullContext, true, originalError);
    this.name = 'DatabaseError';
    this.operation = operation;
    this.originalError = originalError;
  }

  /**
   * Convert to AppError with database error code
   */
  toAppError(): AppError {
    return super.toAppError(ErrorCode.ErrDatabaseQuery);
  }

  /**
   * Check if error is a connection error (highly retryable)
   */
  isConnectionError(): boolean {
    const errorName = this.originalError.name.toLowerCase();
    return (
      errorName.includes('connection') ||
      errorName.includes('econnrefused') ||
      errorName.includes('enotfound')
    );
  }

  /**
   * Check if error is a timeout error (retryable)
   */
  isTimeoutError(): boolean {
    const errorName = this.originalError.name.toLowerCase();
    const errorMsg = this.originalError.message.toLowerCase();
    return (
      errorName.includes('timeout') ||
      errorMsg.includes('timeout') ||
      errorMsg.includes('timed out')
    );
  }

  /**
   * Check if error is a lock error (retryable with backoff)
   */
  isLockError(): boolean {
    const errorMsg = this.originalError.message.toLowerCase();
    return (
      errorMsg.includes('lock') ||
      errorMsg.includes('deadlock') ||
      errorMsg.includes('could not obtain lock')
    );
  }
}

/**
 * TimeoutError - Operation timeout
 *
 * Used for:
 * - Long-running operations
 * - Network timeouts
 * - Resource acquisition timeouts
 *
 * isRetryable: true (timeouts may succeed on retry)
 */
export class TimeoutError extends ServiceError {
  public readonly operation: string;
  public readonly timeout: number;

  constructor(
    operation: string,
    timeout: number,
    context: Record<string, any> = {},
  ) {
    const message = `Operation '${operation}' timed out after ${timeout}ms`;
    const fullContext = { operation, timeout, ...context };

    super('TIMEOUT_ERROR', message, fullContext, true);
    this.name = 'TimeoutError';
    this.operation = operation;
    this.timeout = timeout;
  }

  /**
   * Convert to AppError with timeout error code
   */
  toAppError(): AppError {
    return super.toAppError(ErrorCode.ErrTimeout);
  }
}

/**
 * ConflictError - Resource conflict
 *
 * Used for:
 * - Duplicate entries
 * - Concurrent modification
 * - State conflicts
 *
 * isRetryable: false (conflicts require manual resolution)
 */
export class ConflictError extends ServiceError {
  public readonly resource: string;
  public readonly conflictType: string;

  constructor(
    resource: string,
    conflictType: string,
    message: string,
    context: Record<string, any> = {},
  ) {
    const fullContext = { resource, conflictType, ...context };

    super('CONFLICT_ERROR', message, fullContext, false);
    this.name = 'ConflictError';
    this.resource = resource;
    this.conflictType = conflictType;
  }

  /**
   * Convert to AppError with conflict error code
   */
  toAppError(): AppError {
    return super.toAppError(ErrorCode.ErrConflict);
  }

  /**
   * Factory method for duplicate entry errors
   */
  static duplicate(
    resource: string,
    identifier: string,
    context?: Record<string, any>,
  ): ConflictError {
    return new ConflictError(
      resource,
      'duplicate',
      `${resource} with identifier '${identifier}' already exists`,
      { ...context, identifier },
    );
  }
}

/**
 * Type guard to check if error is a ServiceError
 */
export function isServiceError(err: unknown): err is ServiceError {
  return err instanceof ServiceError;
}

/**
 * Type guard to check if error is retryable
 */
export function isRetryable(err: unknown): boolean {
  if (isServiceError(err)) {
    return err.isRetryable;
  }
  return false;
}

/**
 * Factory functions for common service errors
 */
export class ServiceErrorFactory {
  /**
   * Create a validation error
   */
  static validation(
    message: string,
    field?: string,
    value?: any,
    context?: Record<string, any>,
  ): ValidationError {
    return new ValidationError(message, context, field, value);
  }

  /**
   * Create a not found error
   */
  static notFound(
    resource: string,
    id: string,
    context?: Record<string, any>,
  ): NotFoundError {
    return new NotFoundError(resource, id, context);
  }

  /**
   * Create a database error
   */
  static database(
    operation: string,
    originalError: Error,
    context?: Record<string, any>,
  ): DatabaseError {
    return new DatabaseError(operation, originalError, context);
  }

  /**
   * Create a timeout error
   */
  static timeout(
    operation: string,
    timeout: number,
    context?: Record<string, any>,
  ): TimeoutError {
    return new TimeoutError(operation, timeout, context);
  }

  /**
   * Create a conflict error
   */
  static conflict(
    resource: string,
    conflictType: string,
    message: string,
    context?: Record<string, any>,
  ): ConflictError {
    return new ConflictError(resource, conflictType, message, context);
  }
}
