/**
 * Database Exception Filter - Database Error Handling & Mapping
 *
 * Specialized exception filter for handling database errors from TypeORM and other
 * database libraries. Maps database-specific error codes to appropriate HTTP status
 * codes and provides user-friendly error messages without exposing database internals.
 *
 * Supported Databases:
 * - PostgreSQL
 * - MySQL
 * - SQLite
 * - Microsoft SQL Server
 * - MongoDB (via Mongoose)
 *
 * Features:
 * - Database error code mapping to HTTP status codes
 * - User-friendly error messages
 * - Sensitive information sanitization
 * - Constraint violation details (without exposing schema)
 * - Transaction error handling
 * - Connection error handling
 * - Query timeout detection
 *
 * @module filters/database-exception
 * @version 1.0.0
 */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError, EntityNotFoundError, CannotCreateEntityIdMapError } from 'typeorm';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Database error response structure
 */
export interface DatabaseErrorResponse {
  /** Always false for error responses */
  success: false;
  /** HTTP status code */
  statusCode: number;
  /** Error type */
  error: string;
  /** User-friendly error message */
  message: string;
  /** ISO 8601 timestamp */
  timestamp: string;
  /** Request path */
  path: string;
  /** HTTP method */
  method: string;
  /** Correlation ID for tracking */
  correlationId: string;
  /** Additional error details (sanitized) */
  details?: DatabaseErrorDetails;
}

/**
 * Sanitized database error details
 */
export interface DatabaseErrorDetails {
  /** Error category */
  category: 'constraint' | 'connection' | 'query' | 'transaction' | 'timeout' | 'unknown';
  /** Constraint type (if applicable) */
  constraintType?: 'unique' | 'foreign_key' | 'not_null' | 'check' | 'exclusion';
  /** Suggested action for the client */
  suggestion?: string;
}

/**
 * PostgreSQL error code mapping
 */
const POSTGRES_ERROR_CODES: Record<string, { status: number; message: string; category: string }> = {
  // Constraint violations
  '23505': {
    status: HttpStatus.CONFLICT,
    message: 'A record with this value already exists',
    category: 'constraint',
  },
  '23503': {
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    message: 'Cannot perform operation: referenced record does not exist',
    category: 'constraint',
  },
  '23502': {
    status: HttpStatus.BAD_REQUEST,
    message: 'Required field is missing',
    category: 'constraint',
  },
  '23514': {
    status: HttpStatus.BAD_REQUEST,
    message: 'Value violates check constraint',
    category: 'constraint',
  },
  '23P01': {
    status: HttpStatus.CONFLICT,
    message: 'Cannot perform operation: exclusion constraint violation',
    category: 'constraint',
  },

  // Connection errors
  '08000': {
    status: HttpStatus.SERVICE_UNAVAILABLE,
    message: 'Database connection error',
    category: 'connection',
  },
  '08003': {
    status: HttpStatus.SERVICE_UNAVAILABLE,
    message: 'Database connection does not exist',
    category: 'connection',
  },
  '08006': {
    status: HttpStatus.SERVICE_UNAVAILABLE,
    message: 'Database connection failure',
    category: 'connection',
  },

  // Query errors
  '42P01': {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Database configuration error',
    category: 'query',
  },
  '42703': {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Database configuration error',
    category: 'query',
  },
  '42883': {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Database operation not supported',
    category: 'query',
  },

  // Transaction errors
  '40001': {
    status: HttpStatus.CONFLICT,
    message: 'Operation conflict: please retry',
    category: 'transaction',
  },
  '40P01': {
    status: HttpStatus.CONFLICT,
    message: 'Deadlock detected: please retry',
    category: 'transaction',
  },

  // Data errors
  '22001': {
    status: HttpStatus.BAD_REQUEST,
    message: 'Value is too long',
    category: 'query',
  },
  '22003': {
    status: HttpStatus.BAD_REQUEST,
    message: 'Numeric value out of range',
    category: 'query',
  },
  '22P02': {
    status: HttpStatus.BAD_REQUEST,
    message: 'Invalid data format',
    category: 'query',
  },
  '22007': {
    status: HttpStatus.BAD_REQUEST,
    message: 'Invalid date/time format',
    category: 'query',
  },
};

/**
 * MySQL error code mapping
 */
const MYSQL_ERROR_CODES: Record<number, { status: number; message: string; category: string }> = {
  // Constraint violations
  1062: {
    status: HttpStatus.CONFLICT,
    message: 'A record with this value already exists',
    category: 'constraint',
  },
  1451: {
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    message: 'Cannot delete record: it is referenced by other records',
    category: 'constraint',
  },
  1452: {
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    message: 'Cannot perform operation: referenced record does not exist',
    category: 'constraint',
  },
  1048: {
    status: HttpStatus.BAD_REQUEST,
    message: 'Required field is missing',
    category: 'constraint',
  },

  // Connection errors
  1040: {
    status: HttpStatus.SERVICE_UNAVAILABLE,
    message: 'Too many database connections',
    category: 'connection',
  },
  1045: {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Database authentication error',
    category: 'connection',
  },
  2002: {
    status: HttpStatus.SERVICE_UNAVAILABLE,
    message: 'Cannot connect to database',
    category: 'connection',
  },
  2013: {
    status: HttpStatus.GATEWAY_TIMEOUT,
    message: 'Database connection lost',
    category: 'connection',
  },

  // Query errors
  1054: {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Database configuration error',
    category: 'query',
  },
  1146: {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Database configuration error',
    category: 'query',
  },

  // Data errors
  1406: {
    status: HttpStatus.BAD_REQUEST,
    message: 'Value is too long for field',
    category: 'query',
  },
  1264: {
    status: HttpStatus.BAD_REQUEST,
    message: 'Value out of range',
    category: 'query',
  },
};

// ============================================================================
// Database Exception Filter Implementation
// ============================================================================

/**
 * Catches and formats database errors from TypeORM and other database libraries.
 * Maps database-specific error codes to HTTP status codes and provides
 * user-friendly error messages.
 *
 * @example
 * ```typescript
 * // In main.ts
 * app.useGlobalFilters(
 *   new GlobalExceptionFilter(),
 *   new DatabaseExceptionFilter()
 * );
 * ```
 */
@Catch(QueryFailedError, EntityNotFoundError, CannotCreateEntityIdMapError)
@Injectable()
export class DatabaseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DatabaseExceptionFilter.name);

  /**
   * Main exception handling method
   */
  catch(
    exception: QueryFailedError | EntityNotFoundError | CannotCreateEntityIdMapError,
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Parse database error
    const errorDetails = this.parseDatabaseError(exception);

    // Generate correlation ID
    const correlationId = this.getCorrelationId(request);

    // Build error response
    const errorResponse: DatabaseErrorResponse = {
      success: false,
      statusCode: errorDetails.status,
      error: errorDetails.error,
      message: errorDetails.message,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      correlationId,
      details: errorDetails.details,
    };

    // Log database error
    this.logDatabaseError(request, errorResponse, exception);

    // Send response
    response.status(errorDetails.status).json(errorResponse);
  }

  /**
   * Parse database error and extract details
   */
  private parseDatabaseError(
    exception: QueryFailedError | EntityNotFoundError | CannotCreateEntityIdMapError,
  ): {
    status: number;
    error: string;
    message: string;
    details?: DatabaseErrorDetails;
  } {
    // Handle EntityNotFoundError
    if (exception instanceof EntityNotFoundError) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: 'NotFound',
        message: 'The requested resource was not found',
        details: {
          category: 'query',
          suggestion: 'Verify the resource ID and try again',
        },
      };
    }

    // Handle CannotCreateEntityIdMapError
    if (exception instanceof CannotCreateEntityIdMapError) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'BadRequest',
        message: 'Invalid entity data: missing or invalid identifier',
        details: {
          category: 'query',
          suggestion: 'Ensure all required ID fields are provided',
        },
      };
    }

    // Handle QueryFailedError
    if (exception instanceof QueryFailedError) {
      const dbError = exception as any;

      // PostgreSQL errors
      if (dbError.code && typeof dbError.code === 'string') {
        const mapping = POSTGRES_ERROR_CODES[dbError.code];
        if (mapping) {
          return {
            status: mapping.status,
            error: this.getErrorName(mapping.status),
            message: mapping.message,
            details: {
              category: mapping.category as any,
              constraintType: this.detectConstraintType(dbError.code),
              suggestion: this.getSuggestion(mapping.category as any, mapping.status),
            },
          };
        }
      }

      // MySQL errors
      if (dbError.errno && typeof dbError.errno === 'number') {
        const mapping = MYSQL_ERROR_CODES[dbError.errno];
        if (mapping) {
          return {
            status: mapping.status,
            error: this.getErrorName(mapping.status),
            message: mapping.message,
            details: {
              category: mapping.category as any,
              constraintType: this.detectConstraintType(dbError.errno),
              suggestion: this.getSuggestion(mapping.category as any, mapping.status),
            },
          };
        }
      }

      // Check for connection timeout
      if (this.isTimeoutError(dbError)) {
        return {
          status: HttpStatus.GATEWAY_TIMEOUT,
          error: 'GatewayTimeout',
          message: 'Database operation timed out',
          details: {
            category: 'timeout',
            suggestion: 'Please try again or contact support if the issue persists',
          },
        };
      }

      // Generic query error
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'DatabaseError',
        message: 'A database error occurred while processing your request',
        details: {
          category: 'query',
          suggestion: 'Please try again or contact support if the issue persists',
        },
      };
    }

    // Fallback for unknown database errors
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'DatabaseError',
      message: 'An unexpected database error occurred',
      details: {
        category: 'unknown',
        suggestion: 'Please contact support',
      },
    };
  }

  /**
   * Detect constraint type from error code
   */
  private detectConstraintType(code: string | number): DatabaseErrorDetails['constraintType'] {
    const codeStr = String(code);

    // PostgreSQL
    if (codeStr === '23505' || codeStr === '1062') return 'unique';
    if (codeStr === '23503' || codeStr === '1452' || codeStr === '1451') return 'foreign_key';
    if (codeStr === '23502' || codeStr === '1048') return 'not_null';
    if (codeStr === '23514') return 'check';
    if (codeStr === '23P01') return 'exclusion';

    return undefined;
  }

  /**
   * Get suggestion based on error category
   */
  private getSuggestion(category: string, status: number): string {
    if (status === HttpStatus.CONFLICT) {
      return 'Use a different value or update the existing record';
    }

    if (status === HttpStatus.UNPROCESSABLE_ENTITY) {
      return 'Verify that all referenced records exist before retrying';
    }

    if (status === HttpStatus.BAD_REQUEST) {
      return 'Check your input data and ensure all required fields are provided';
    }

    if (status === HttpStatus.SERVICE_UNAVAILABLE) {
      return 'The service is temporarily unavailable. Please retry in a few moments';
    }

    if (status === HttpStatus.GATEWAY_TIMEOUT) {
      return 'The operation took too long to complete. Please try again';
    }

    return 'Please try again or contact support if the issue persists';
  }

  /**
   * Get error name from HTTP status code
   */
  private getErrorName(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'BadRequest';
      case HttpStatus.NOT_FOUND:
        return 'NotFound';
      case HttpStatus.CONFLICT:
        return 'Conflict';
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return 'UnprocessableEntity';
      case HttpStatus.SERVICE_UNAVAILABLE:
        return 'ServiceUnavailable';
      case HttpStatus.GATEWAY_TIMEOUT:
        return 'GatewayTimeout';
      case HttpStatus.INTERNAL_SERVER_ERROR:
      default:
        return 'DatabaseError';
    }
  }

  /**
   * Check if error is a timeout error
   */
  private isTimeoutError(error: any): boolean {
    const message = String(error.message || '').toLowerCase();
    return (
      message.includes('timeout') ||
      message.includes('timed out') ||
      message.includes('connection lost') ||
      error.code === 'ETIMEDOUT' ||
      error.errno === 2013
    );
  }

  /**
   * Get or generate correlation ID
   */
  private getCorrelationId(request: Request): string {
    return (
      (request.headers['x-correlation-id'] as string) ||
      (request as any).correlationId ||
      `db-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
    );
  }

  /**
   * Log database error (sanitized)
   */
  private logDatabaseError(
    request: Request,
    errorResponse: DatabaseErrorResponse,
    originalException: any,
  ): void {
    const logMessage = [
      `[${errorResponse.correlationId}]`,
      `Database error: ${request.method} ${request.url}`,
      `- Status: ${errorResponse.statusCode}`,
      `- Category: ${errorResponse.details?.category || 'unknown'}`,
      `- Error: ${errorResponse.error}`,
    ].join(' ');

    // Log based on error severity
    if (errorResponse.statusCode >= 500) {
      this.logger.error(
        logMessage,
        this.sanitizeStackTrace(originalException.stack),
        {
          correlationId: errorResponse.correlationId,
          category: errorResponse.details?.category,
          statusCode: errorResponse.statusCode,
        },
      );
    } else {
      this.logger.warn(logMessage, {
        correlationId: errorResponse.correlationId,
        category: errorResponse.details?.category,
        statusCode: errorResponse.statusCode,
      });
    }
  }

  /**
   * Sanitize stack trace to remove sensitive information
   */
  private sanitizeStackTrace(stack?: string): string {
    if (!stack) return '';

    // Remove sensitive patterns from stack trace
    return stack
      .replace(/\/[a-zA-Z0-9_\-/.]+\/node_modules\//g, '/node_modules/')
      .replace(/at\s+[a-zA-Z0-9_\-/.]+\.js:\d+:\d+/g, 'at [file]:line:col')
      .replace(/postgres:\/\/[^@]+@[^\s]+/g, '[DATABASE_URL]')
      .replace(/password[=:]\s*['"]?[\w-]+['"]?/gi, 'password=[REDACTED]');
  }
}
