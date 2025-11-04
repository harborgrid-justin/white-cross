/**
 * @fileoverview All Exceptions Filter
 * @module common/exceptions/filters/all-exceptions
 * @description Catch-all exception filter for unhandled errors with Winston logging and Sentry integration
 */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ErrorResponse, ErrorSeverity, ErrorCategory } from '../types/error-response.types';
import { SystemErrorCodes } from '../constants/error-codes';
import { LoggerService } from '../../../shared/logging/logger.service';
import { SentryService } from '../../../infrastructure/monitoring/sentry.service';

/**
 * All Exceptions Filter
 *
 * @class AllExceptionsFilter
 * @implements {ExceptionFilter}
 *
 * @description Catches all unhandled exceptions and provides safe, HIPAA-compliant error responses
 * with structured Winston logging and Sentry error tracking
 *
 * @example
 * app.useGlobalFilters(new AllExceptionsFilter());
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger: LoggerService;
  private readonly isDevelopment = process.env.NODE_ENV === 'development';
  private readonly enableDetailedErrors =
    process.env.ENABLE_DETAILED_ERRORS === 'true' || this.isDevelopment;

  constructor(@Inject(SentryService) private readonly sentryService: SentryService) {
    this.logger = new LoggerService();
    this.logger.setContext(AllExceptionsFilter.name);
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const requestId = request.headers['x-request-id'] as string || uuidv4();

    // Determine if this is an HTTP exception
    const isHttpException = exception instanceof HttpException;

    // Extract status and error information
    const status = isHttpException
      ? (exception as HttpException).getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorInfo = this.extractErrorInfo(exception, isHttpException);

    // Build error response
    const errorResponse: ErrorResponse = {
      success: false,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      statusCode: status,
      error: errorInfo.error,
      message: errorInfo.message,
      errorCode: errorInfo.errorCode,
      requestId,
    };

    // Add details in development mode
    if (this.enableDetailedErrors && exception instanceof Error) {
      errorResponse.details = {
        name: exception.name,
        cause: (exception as any).cause,
      };
      errorResponse.stack = exception.stack;
    }

    // Log the error
    this.logError(exception, request, errorResponse);

    // Send response
    response.status(status).json(errorResponse);
  }

  /**
   * Extract error information from exception
   */
  private extractErrorInfo(
    exception: unknown,
    isHttpException: boolean,
  ): {
    error: string;
    message: string;
    errorCode: string;
  } {
    if (isHttpException) {
      const httpException = exception as HttpException;
      const response = httpException.getResponse();

      if (typeof response === 'string') {
        return {
          error: httpException.name,
          message: response,
          errorCode: SystemErrorCodes.INTERNAL_SERVER_ERROR,
        };
      }

      const responseObj = response as any;
      return {
        error: responseObj.error || httpException.name,
        message: responseObj.message || 'An error occurred',
        errorCode: responseObj.errorCode || SystemErrorCodes.INTERNAL_SERVER_ERROR,
      };
    }

    // Handle known error types
    if (exception instanceof Error) {
      return this.handleKnownError(exception);
    }

    // Unknown error type
    return {
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
      errorCode: SystemErrorCodes.INTERNAL_SERVER_ERROR,
    };
  }

  /**
   * Handle known error types
   */
  private handleKnownError(error: Error): {
    error: string;
    message: string;
    errorCode: string;
  } {
    const errorName = error.name.toLowerCase();

    // Database errors
    if (errorName.includes('sequelize') || errorName.includes('database')) {
      return {
        error: 'Database Error',
        message: this.isDevelopment ? error.message : 'A database error occurred',
        errorCode: SystemErrorCodes.DATABASE_ERROR,
      };
    }

    // Validation errors (should be caught earlier, but just in case)
    if (errorName.includes('validation')) {
      return {
        error: 'Validation Error',
        message: error.message,
        errorCode: 'VALID_001',
      };
    }

    // Timeout errors
    if (errorName.includes('timeout')) {
      return {
        error: 'Timeout Error',
        message: 'Request timeout',
        errorCode: SystemErrorCodes.TIMEOUT,
      };
    }

    // Configuration errors
    if (errorName.includes('config')) {
      return {
        error: 'Configuration Error',
        message: this.isDevelopment ? error.message : 'A configuration error occurred',
        errorCode: SystemErrorCodes.CONFIGURATION_ERROR,
      };
    }

    // Generic error
    return {
      error: error.name,
      message: this.isDevelopment ? error.message : 'An internal error occurred',
      errorCode: SystemErrorCodes.INTERNAL_SERVER_ERROR,
    };
  }

  /**
   * Log error with appropriate severity using Winston and Sentry
   */
  private logError(
    exception: unknown,
    request: Request,
    errorResponse: ErrorResponse,
  ): void {
    const userId = (request as any).user?.id;
    const organizationId = (request as any).user?.organizationId;

    const loggingContext = {
      category: ErrorCategory.SYSTEM,
      severity: ErrorSeverity.CRITICAL,
      requestId: errorResponse.requestId,
      userId,
      organizationId,
      userAgent: request.headers['user-agent'],
      ipAddress: this.getClientIp(request),
      containsPHI: false,
      path: request.url,
      method: request.method,
      statusCode: errorResponse.statusCode,
      errorCode: errorResponse.errorCode,
      errorType: exception instanceof Error ? exception.name : typeof exception,
    };

    const logMessage = `Unhandled exception: ${errorResponse.message}`;

    // Log with Winston using structured format
    if (exception instanceof Error) {
      this.logger.logWithMetadata('error', logMessage, {
        ...loggingContext,
        stack: exception.stack,
      });
    } else {
      this.logger.logWithMetadata('error', logMessage, {
        ...loggingContext,
        error: String(exception),
      });
    }

    // Report to Sentry for critical errors
    if (errorResponse.statusCode >= 500 && exception instanceof Error) {
      this.sentryService.captureException(exception, {
        userId,
        organizationId,
        tags: {
          category: ErrorCategory.SYSTEM,
          errorCode: errorResponse.errorCode,
          path: request.url,
          method: request.method,
        },
        extra: {
          requestId: errorResponse.requestId,
          statusCode: errorResponse.statusCode,
          userAgent: request.headers['user-agent'],
        },
        level: 'fatal',
      });
    }

    // Alert for critical errors
    if (errorResponse.statusCode >= 500) {
      this.sendAlert(errorResponse, loggingContext);
    }
  }

  /**
   * Get client IP address
   */
  private getClientIp(request: Request): string {
    return (
      (request.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      (request.headers['x-real-ip'] as string) ||
      request.socket.remoteAddress ||
      'unknown'
    );
  }

  /**
   * Send alert for critical errors
   */
  private sendAlert(errorResponse: ErrorResponse, context: any): void {
    // Log critical alert with structured format
    this.logger.logWithMetadata('error', 'CRITICAL ERROR ALERT', {
      ...errorResponse,
      ...context,
      alert: true,
      timestamp: new Date().toISOString(),
    });

    // Send to Sentry as high-priority message
    this.sentryService.captureMessage(
      `CRITICAL ERROR: ${errorResponse.error} - ${errorResponse.message}`,
      'fatal',
      {
        userId: context.userId,
        tags: {
          errorCode: errorResponse.errorCode,
          category: context.category,
        },
        extra: {
          requestId: errorResponse.requestId,
          statusCode: errorResponse.statusCode,
          path: errorResponse.path,
        },
      },
    );
  }
}
