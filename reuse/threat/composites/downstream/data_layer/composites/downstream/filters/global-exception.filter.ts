/**
 * Global Exception Filter - Enterprise-Grade Error Handling
 *
 * Provides standardized error responses across the entire threat intelligence API.
 * This filter catches ALL exceptions and transforms them into consistent,
 * client-friendly error responses with proper HTTP status codes and correlation IDs.
 *
 * Features:
 * - Standardized error response format
 * - HTTP status code mapping
 * - Correlation ID generation for error tracking
 * - Sensitive information sanitization
 * - Stack trace management (development vs production)
 * - Comprehensive error logging
 * - Request context capture
 *
 * @module filters/global-exception
 * @version 1.0.0
 */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError, EntityNotFoundError } from 'typeorm';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Standard error response structure returned to API clients
 */
export interface StandardErrorResponse {
  /** Always false for error responses */
  success: false;
  /** HTTP status code */
  statusCode: number;
  /** Error type/category */
  error: string;
  /** Human-readable error message(s) */
  message: string | string[];
  /** ISO 8601 timestamp of when error occurred */
  timestamp: string;
  /** Request path that caused the error */
  path: string;
  /** HTTP method used */
  method: string;
  /** Unique correlation ID for error tracking across services */
  correlationId: string;
  /** Stack trace (only in development mode) */
  stack?: string;
  /** Additional error metadata */
  meta?: Record<string, any>;
}

/**
 * Error severity levels for logging and alerting
 */
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Parsed exception details
 */
interface ParsedExceptionDetails {
  status: number;
  error: string;
  message: string | string[];
  stack?: string;
  severity: ErrorSeverity;
}

// ============================================================================
// Global Exception Filter Implementation
// ============================================================================

/**
 * Global exception filter that catches all unhandled exceptions.
 * Should be registered as the first filter in the application.
 *
 * @example
 * ```typescript
 * // In main.ts
 * const app = await NestFactory.create(AppModule);
 * app.useGlobalFilters(new GlobalExceptionFilter());
 * ```
 */
@Catch()
@Injectable()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  /**
   * Main exception handling method
   */
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Parse exception into standardized format
    const details = this.parseException(exception);

    // Generate correlation ID for tracking
    const correlationId = this.getCorrelationId(request);

    // Build standardized error response
    const errorResponse: StandardErrorResponse = {
      success: false,
      statusCode: details.status,
      error: details.error,
      message: details.message,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      correlationId,
    };

    // Include stack trace only in development
    if (process.env.NODE_ENV === 'development' && details.stack) {
      errorResponse.stack = details.stack;
    }

    // Log error with appropriate severity
    this.logError(request, errorResponse, details.severity, exception);

    // Send error response to client
    response.status(details.status).json(errorResponse);
  }

  /**
   * Parse any exception type into standardized error details
   */
  private parseException(exception: unknown): ParsedExceptionDetails {
    // Handle NestJS HTTP exceptions
    if (exception instanceof HttpException) {
      return this.parseHttpException(exception);
    }

    // Handle TypeORM database errors
    if (exception instanceof QueryFailedError) {
      return this.parseDatabaseError(exception);
    }

    // Handle TypeORM entity not found errors
    if (exception instanceof EntityNotFoundError) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: 'NotFound',
        message: 'The requested resource was not found',
        severity: ErrorSeverity.LOW,
      };
    }

    // Handle standard JavaScript errors
    if (exception instanceof Error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: exception.name || 'InternalServerError',
        message: this.sanitizeErrorMessage(exception.message),
        stack: exception.stack,
        severity: ErrorSeverity.CRITICAL,
      };
    }

    // Handle unknown exception types
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'UnknownError',
      message: 'An unexpected error occurred',
      severity: ErrorSeverity.CRITICAL,
    };
  }

  /**
   * Parse NestJS HTTP exceptions
   */
  private parseHttpException(exception: HttpException): ParsedExceptionDetails {
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message: string | string[];
    let error = exception.name;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object') {
      message = (exceptionResponse as any).message || exception.message;
      error = (exceptionResponse as any).error || error;
    } else {
      message = exception.message;
    }

    return {
      status,
      error,
      message,
      stack: exception.stack,
      severity: this.getSeverityFromStatus(status),
    };
  }

  /**
   * Parse database errors into user-friendly messages
   */
  private parseDatabaseError(error: QueryFailedError): ParsedExceptionDetails {
    const dbError = error as any;

    // PostgreSQL error codes
    switch (dbError.code) {
      case '23505': // Unique constraint violation
        return {
          status: HttpStatus.CONFLICT,
          error: 'Conflict',
          message: 'A record with this value already exists',
          severity: ErrorSeverity.LOW,
        };

      case '23503': // Foreign key violation
        return {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: 'UnprocessableEntity',
          message: 'Cannot perform operation: referenced record does not exist',
          severity: ErrorSeverity.MEDIUM,
        };

      case '23502': // Not null violation
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'BadRequest',
          message: 'Required field is missing',
          severity: ErrorSeverity.LOW,
        };

      default:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'DatabaseError',
          message: 'A database error occurred',
          severity: ErrorSeverity.HIGH,
        };
    }
  }

  /**
   * Determine error severity based on HTTP status code
   */
  private getSeverityFromStatus(status: number): ErrorSeverity {
    if (status >= 500) return ErrorSeverity.CRITICAL;
    if (status >= 400 && status < 500) return ErrorSeverity.LOW;
    return ErrorSeverity.MEDIUM;
  }

  /**
   * Sanitize error messages to remove sensitive information
   */
  private sanitizeErrorMessage(message: string): string {
    // Remove potential database connection strings
    message = message.replace(/postgres:\/\/[^@]+@[^\s]+/g, '[DATABASE_URL]');

    // Remove potential API keys
    message = message.replace(/api[_-]?key[=:]\s*['"]?[\w-]+['"]?/gi, 'api_key=[REDACTED]');

    // Remove potential JWT tokens
    message = message.replace(/eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g, '[JWT_TOKEN]');

    // Remove potential file paths that might leak system information
    message = message.replace(/\/[a-zA-Z0-9_\-/.]+\/[a-zA-Z0-9_\-/.]+/g, '[FILE_PATH]');

    return message;
  }

  /**
   * Get or generate correlation ID for request tracking
   */
  private getCorrelationId(request: Request): string {
    // Check for existing correlation ID in headers
    const headerCorrelationId = request.headers['x-correlation-id'] as string;
    if (headerCorrelationId) {
      return headerCorrelationId;
    }

    // Check if correlation ID was already generated for this request
    const existingId = (request as any).correlationId;
    if (existingId) {
      return existingId;
    }

    // Generate new correlation ID
    const correlationId = this.generateCorrelationId();
    (request as any).correlationId = correlationId;
    return correlationId;
  }

  /**
   * Generate unique correlation ID
   */
  private generateCorrelationId(): string {
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substring(2, 11);
    return `err-${timestamp}-${randomPart}`;
  }

  /**
   * Log error with appropriate level based on severity
   */
  private logError(
    request: Request,
    errorResponse: StandardErrorResponse,
    severity: ErrorSeverity,
    originalException: unknown,
  ): void {
    const logMessage = [
      `[${errorResponse.correlationId}]`,
      `${request.method} ${request.url}`,
      `- Status: ${errorResponse.statusCode}`,
      `- Error: ${errorResponse.error}`,
      `- Message: ${JSON.stringify(errorResponse.message)}`,
    ].join(' ');

    const logContext = {
      correlationId: errorResponse.correlationId,
      method: request.method,
      url: request.url,
      statusCode: errorResponse.statusCode,
      error: errorResponse.error,
      userAgent: request.headers['user-agent'],
      ip: request.ip,
    };

    // Log based on severity
    switch (severity) {
      case ErrorSeverity.CRITICAL:
        this.logger.error(logMessage, originalException instanceof Error ? originalException.stack : '', logContext);
        break;
      case ErrorSeverity.HIGH:
        this.logger.error(logMessage, '', logContext);
        break;
      case ErrorSeverity.MEDIUM:
        this.logger.warn(logMessage, logContext);
        break;
      case ErrorSeverity.LOW:
        this.logger.log(logMessage, logContext);
        break;
    }
  }
}
