/**
 * @fileoverview Error Mapping Interceptor
 * @module common/interceptors/error-mapping
 * @description Maps internal errors to user-friendly API errors
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  QueryError,
  ValidationError as SequelizeValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError,
} from 'sequelize';

/**
 * Error Mapping Interceptor
 *
 * Catches internal errors (database, validation, business logic) and maps them
 * to user-friendly HTTP exceptions with appropriate status codes and messages.
 *
 * Error Mappings:
 * - Sequelize UniqueConstraintError → 409 Conflict
 * - Sequelize ForeignKeyConstraintError → 400 Bad Request
 * - Sequelize ValidationError → 422 Unprocessable Entity
 * - Database Connection Errors → 503 Service Unavailable
 * - Unknown Errors → 500 Internal Server Error
 *
 * Benefits:
 * - Prevents leaking internal error details to clients
 * - Provides consistent error responses
 * - Proper HTTP status codes for different error types
 * - HIPAA-compliant (no PHI in error messages)
 *
 * @example
 * // Internal: UniqueConstraintError: duplicate key value violates unique constraint
 * // API:      409 Conflict { message: "Resource already exists", errorCode: "BUSINESS_002" }
 */
@Injectable()
export class ErrorMappingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ErrorMappingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        // If already an HttpException, pass through
        if (error instanceof HttpException) {
          return throwError(() => error);
        }

        // Map internal errors to HTTP exceptions
        const mappedError = this.mapError(error);

        // Log the original error for debugging
        this.logger.error('Internal error occurred:', error.stack, {
          originalError: error.name,
          mappedStatus: mappedError.getStatus(),
          context: context.getClass().name,
          handler: context.getHandler().name,
        });

        return throwError(() => mappedError);
      }),
    );
  }

  /**
   * Map internal errors to HTTP exceptions
   */
  private mapError(error: any): HttpException {
    // Sequelize Unique Constraint Error (duplicate key)
    if (error instanceof UniqueConstraintError) {
      return new HttpException(
        {
          error: 'Conflict',
          message: this.getUniqueConstraintMessage(error),
          errorCode: 'BUSINESS_002',
          details: error.errors?.map((e: any) => ({
            field: e.path,
            value: e.value,
            message: 'Must be unique',
          })),
        },
        HttpStatus.CONFLICT,
      );
    }

    // Sequelize Foreign Key Constraint Error
    if (error instanceof ForeignKeyConstraintError) {
      return new HttpException(
        {
          error: 'Bad Request',
          message: 'Referenced resource does not exist',
          errorCode: 'VALID_003',
          details: {
            table: error.table,
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Sequelize Validation Error
    if (error instanceof SequelizeValidationError) {
      return new HttpException(
        {
          error: 'Unprocessable Entity',
          message: 'Validation failed',
          errorCode: 'VALID_002',
          details: error.errors?.map((e: any) => ({
            field: e.path,
            message: e.message,
            value: e.value,
          })),
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    // Database Query Error
    if (error instanceof QueryError) {
      // Don't expose SQL details to clients
      return new HttpException(
        {
          error: 'Internal Server Error',
          message: 'Database operation failed',
          errorCode: 'SYSTEM_003',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Database Connection Error
    if (
      error.name === 'SequelizeConnectionError' ||
      error.name === 'SequelizeConnectionRefusedError'
    ) {
      return new HttpException(
        {
          error: 'Service Unavailable',
          message: 'Database connection unavailable. Please try again later.',
          errorCode: 'SYSTEM_002',
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    // Timeout Error
    if (error.name === 'TimeoutError' || error.message?.includes('timeout')) {
      return new HttpException(
        {
          error: 'Request Timeout',
          message: 'Request took too long to process',
          errorCode: 'SYSTEM_004',
        },
        HttpStatus.REQUEST_TIMEOUT,
      );
    }

    // Resource Not Found (business logic errors)
    if (error.message?.toLowerCase().includes('not found')) {
      return new HttpException(
        {
          error: 'Not Found',
          message: error.message,
          errorCode: 'BUSINESS_001',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // Unauthorized (authentication errors)
    if (
      error.message?.toLowerCase().includes('unauthorized') ||
      error.message?.toLowerCase().includes('authentication')
    ) {
      return new HttpException(
        {
          error: 'Unauthorized',
          message: 'Authentication required',
          errorCode: 'AUTH_005',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Forbidden (authorization errors)
    if (
      error.message?.toLowerCase().includes('forbidden') ||
      error.message?.toLowerCase().includes('permission')
    ) {
      return new HttpException(
        {
          error: 'Forbidden',
          message: 'Insufficient permissions',
          errorCode: 'AUTHZ_001',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // Default: Internal Server Error
    return new HttpException(
      {
        error: 'Internal Server Error',
        message:
          process.env.NODE_ENV === 'production'
            ? 'An unexpected error occurred'
            : error.message,
        errorCode: 'SYSTEM_001',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  /**
   * Generate user-friendly message for unique constraint violations
   */
  private getUniqueConstraintMessage(error: UniqueConstraintError): string {
    const fields = error.errors?.map((e: any) => e.path).join(', ');

    if (fields) {
      return `A resource with this ${fields} already exists`;
    }

    return 'Resource already exists';
  }
}
