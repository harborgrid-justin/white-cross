/**
 * @fileoverview Retryable Exception Base Class
 * @module common/exceptions/exceptions/retryable
 * @description Base exception for transient errors that can be retried
 *
 * Migrated from /shared/errors/ServiceErrors.ts to consolidate error handling
 * @see /shared/errors/ServiceErrors.ts - Legacy implementation (DEPRECATED)
 */

import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode, SystemErrorCodes } from '../constants/error-codes';

/**
 * Retryable Exception Base Class
 *
 * @class RetryableException
 * @extends {HttpException}
 *
 * @description Base exception for transient errors that may succeed on retry
 *
 * @example
 * throw new RetryableException(
 *   'Database connection timeout',
 *   SystemErrorCodes.TIMEOUT,
 *   { operation: 'fetchUser', timeout: 5000 }
 * );
 */
export class RetryableException extends HttpException {
  public readonly errorCode: ErrorCode;
  public readonly context: Record<string, any>;
  public readonly isRetryable: boolean = true;
  public readonly timestamp: Date;
  public readonly innerError?: Error;

  constructor(
    message: string,
    errorCode: ErrorCode = SystemErrorCodes.INTERNAL_SERVER_ERROR,
    context: Record<string, any> = {},
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
    innerError?: Error,
  ) {
    const response = {
      success: false,
      error: 'Retryable Error',
      message,
      errorCode,
      context,
      isRetryable: true,
    };

    super(response, statusCode);

    this.errorCode = errorCode;
    this.context = context;
    this.timestamp = new Date();
    this.innerError = innerError;
    this.name = 'RetryableException';
  }

  /**
   * Convert to JSON for logging/API responses
   */
  toJSON() {
    return {
      name: this.name,
      errorCode: this.errorCode,
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
 * Database Error Exception
 *
 * @class DatabaseException
 * @extends {RetryableException}
 *
 * @description Exception for database operation failures
 */
export class DatabaseException extends RetryableException {
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

    super(
      message,
      SystemErrorCodes.DATABASE_ERROR,
      fullContext,
      HttpStatus.INTERNAL_SERVER_ERROR,
      originalError,
    );

    this.operation = operation;
    this.originalError = originalError;
    this.name = 'DatabaseException';
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
 * Timeout Error Exception
 *
 * @class TimeoutException
 * @extends {RetryableException}
 *
 * @description Exception for operation timeouts
 */
export class TimeoutException extends RetryableException {
  public readonly operation: string;
  public readonly timeout: number;

  constructor(
    operation: string,
    timeout: number,
    context: Record<string, any> = {},
  ) {
    const message = `Operation '${operation}' timed out after ${timeout}ms`;
    const fullContext = { operation, timeout, ...context };

    super(
      message,
      SystemErrorCodes.TIMEOUT,
      fullContext,
      HttpStatus.REQUEST_TIMEOUT,
    );

    this.operation = operation;
    this.timeout = timeout;
    this.name = 'TimeoutException';
  }
}

/**
 * External Service Error Exception
 *
 * @class ExternalServiceException
 * @extends {RetryableException}
 *
 * @description Exception for external service failures
 */
export class ExternalServiceException extends RetryableException {
  public readonly service: string;
  public readonly endpoint?: string;

  constructor(
    service: string,
    message: string,
    context: Record<string, any> = {},
    endpoint?: string,
  ) {
    const fullContext = { service, endpoint, ...context };

    super(
      message,
      SystemErrorCodes.EXTERNAL_SERVICE_ERROR,
      fullContext,
      HttpStatus.BAD_GATEWAY,
    );

    this.service = service;
    this.endpoint = endpoint;
    this.name = 'ExternalServiceException';
  }
}

/**
 * Type guard to check if error is retryable
 */
export function isRetryable(error: unknown): boolean {
  if (error instanceof RetryableException) {
    return error.isRetryable;
  }
  if (error instanceof HttpException) {
    const response = error.getResponse();
    if (typeof response === 'object' && 'isRetryable' in response) {
      return (response as any).isRetryable === true;
    }
  }
  return false;
}
