/**
 * NestJS Exception Filter Strategies - Production-Ready Error Handling
 *
 * Enterprise-grade exception filter functions supporting:
 * - Global exception handling and standardization
 * - HTTP exception mapping and transformation
 * - Error logging and monitoring integration
 * - Error alerting and notification
 * - Validation error formatting
 * - Database error handling
 * - External service error handling
 * - Healthcare-specific error handling (HIPAA)
 * - Stack trace sanitization
 * - Error correlation and tracing
 *
 * @module exception-filter-strategies
 */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DatabaseError, EmptyResultError } from 'sequelize';
import { ValidationError } from 'class-validator';

import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Standard error response structure
 */
export interface ErrorResponse {
  success: false;
  statusCode: number;
  error: string;
  message: string | string[];
  timestamp: string;
  path?: string;
  method?: string;
  correlationId?: string;
  stack?: string;
  errors?: ValidationErrorDetail[];
  meta?: Record<string, any>;
}

/**
 * Validation error detail
 */
export interface ValidationErrorDetail {
  field: string;
  value: any;
  constraints: Record<string, string>;
  children?: ValidationErrorDetail[];
}

/**
 * Database error detail
 */
export interface DatabaseErrorDetail {
  code: string;
  detail?: string;
  table?: string;
  column?: string;
  constraint?: string;
}

/**
 * Error logging options
 */
export interface ErrorLoggingOptions {
  logStackTrace?: boolean;
  logRequestBody?: boolean;
  logHeaders?: boolean;
  sensitiveFields?: string[];
  alertOnCritical?: boolean;
}

/**
 * Error notification configuration
 */
export interface ErrorNotificationConfig {
  enabled: boolean;
  channels: ('email' | 'slack' | 'pagerduty' | 'webhook')[];
  criticalOnly?: boolean;
  throttleMs?: number;
}

// ============================================================================
// 1. Global Exception Filters
// ============================================================================

/**
 * Global exception filter that catches all exceptions.
 * Provides standardized error responses across the entire application.
 *
 * @example
 * ```typescript
 * // In main.ts
 * app.useGlobalFilters(new GlobalExceptionFilter());
 * ```
 */
@Catch()
@Injectable()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'InternalServerError';
    let stack: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || message;
        error = (exceptionResponse as any).error || error;
      }

      stack = exception.stack;
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
      stack = exception.stack;
    }

    const errorResponse: ErrorResponse = {
      success: false,
      statusCode: status,
      error,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      correlationId: this.getCorrelationId(request),
    };

    if (process.env.NODE_ENV === 'development') {
      errorResponse.stack = stack;
    }

    this.logError(
      `${request.method} ${request.url} - ${status} - ${message}`,
      stack,
    );

    response.status(status).json(errorResponse);
  }

  private getCorrelationId(request: Request): string {
    return (
      (request.headers['x-correlation-id'] as string) ||
      (request as any).correlationId ||
      this.generateCorrelationId()
    );
  }

  private generateCorrelationId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * HTTP exception filter with enhanced error details.
 *
 * @example
 * ```typescript
 * @UseFilters(HttpExceptionFilter)
 * @Controller('users')
 * export class UsersController { ... }
 * ```
 */
@Catch(HttpException)
@Injectable()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message: string | string[];
    let error = 'HttpException';
    let errors: any[] | undefined;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object') {
      message = (exceptionResponse as any).message || exception.message;
      error = (exceptionResponse as any).error || error;
      errors = (exceptionResponse as any).errors;
    } else {
      message = exception.message;
    }

    const errorResponse: ErrorResponse = {
      success: false,
      statusCode: status,
      error,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      correlationId: (request.headers['x-correlation-id'] as string) || '',
      ...(errors && { errors }),
    };

    this.logWarning(
      `HTTP ${status} - ${request.method} ${request.url} - ${JSON.stringify(message)}`,
    );

    response.status(status).json(errorResponse);
  }
}

/**
 * All exceptions filter with comprehensive logging.
 *
 * @param options - Error logging options
 * @returns All exceptions filter
 *
 * @example
 * ```typescript
 * app.useGlobalFilters(AllExceptionsFilter({
 *   logStackTrace: true,
 *   logRequestBody: false,
 *   sensitiveFields: ['password', 'token']
 * }));
 * ```
 */
export function AllExceptionsFilter(options?: ErrorLoggingOptions): ExceptionFilter {
  @Catch()
  @Injectable()
  class AllExceptionsFilterImpl implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();

      const { status, error, message, stack } = this.parseException(exception);

      const errorResponse: ErrorResponse = {
        success: false,
        statusCode: status,
        error,
        message,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
      };

      if (options?.logStackTrace && process.env.NODE_ENV === 'development') {
        errorResponse.stack = stack;
      }

      // Log error with optional details
      this.logError(request, errorResponse, options);

      // Alert on critical errors
      if (options?.alertOnCritical && status >= 500) {
        this.alertCriticalError(errorResponse);
      }

      response.status(status).json(errorResponse);
    }

    private parseException(exception: unknown): {
      status: number;
      error: string;
      message: string;
      stack?: string;
    } {
      if (exception instanceof HttpException) {
        return {
          status: exception.getStatus(),
          error: exception.name,
          message: exception.message,
          stack: exception.stack,
        };
      }

      if (exception instanceof Error) {
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: exception.name,
          message: exception.message,
          stack: exception.stack,
        };
      }

      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'UnknownError',
        message: 'An unknown error occurred',
      };
    }

    private logError(
      request: Request,
      errorResponse: ErrorResponse,
      options?: ErrorLoggingOptions,
    ): void {
      const logData: any = {
        ...errorResponse,
        ip: request.ip,
        userAgent: request.headers['user-agent'],
      };

      if (options?.logRequestBody && request.body) {
        logData.requestBody = this.sanitizeData(request.body, options.sensitiveFields);
      }

      if (options?.logHeaders) {
        logData.headers = this.sanitizeData(request.headers, options.sensitiveFields);
      }

      this.logError(JSON.stringify(logData));
    }

    private sanitizeData(data: any, sensitiveFields?: string[]): any {
      if (!sensitiveFields || sensitiveFields.length === 0) {
        return data;
      }

      const sanitized = { ...data };
      sensitiveFields.forEach((field) => {
        if (field in sanitized) {
          sanitized[field] = '[REDACTED]';
        }
      });

      return sanitized;
    }

    private alertCriticalError(error: ErrorResponse): void {
      // Placeholder for alerting logic (email, Slack, PagerDuty, etc.)
      this.logError(`CRITICAL ERROR ALERT: ${JSON.stringify(error)}`);
    }
  }

  return new AllExceptionsFilterImpl();
}

// ============================================================================
// 2. Validation Exception Filters
// ============================================================================

/**
 * Validation exception filter for class-validator errors.
 *
 * @example
 * ```typescript
 * @UseFilters(ValidationExceptionFilter)
 * @Post('users')
 * create(@Body() createUserDto: CreateUserDto) {
 *   return this.service.create(createUserDto);
 * }
 * ```
 */
@Catch(BadRequestException)
@Injectable()
export class ValidationExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ValidationExceptionFilter.name);

  catch(exception: BadRequestException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();

    let validationErrors: ValidationErrorDetail[] = [];

    if (exceptionResponse.message && Array.isArray(exceptionResponse.message)) {
      validationErrors = this.formatValidationErrors(exceptionResponse.message);
    }

    const errorResponse: ErrorResponse = {
      success: false,
      statusCode: status,
      error: 'ValidationError',
      message: 'Validation failed',
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      errors: validationErrors,
    };

    this.logWarning(`Validation failed: ${JSON.stringify(validationErrors)}`);

    response.status(status).json(errorResponse);
  }

  private formatValidationErrors(errors: any[]): ValidationErrorDetail[] {
    return errors.map((error) => {
      if (typeof error === 'string') {
        return {
          field: 'unknown',
          value: undefined,
          constraints: { error },
        };
      }

      return {
        field: error.property || 'unknown',
        value: error.value,
        constraints: error.constraints || {},
        ...(error.children?.length > 0 && {
          children: this.formatValidationErrors(error.children),
        }),
      };
    });
  }
}

/**
 * Enhanced validation filter with detailed error messages.
 *
 * @example
 * ```typescript
 * @UseFilters(EnhancedValidationFilter)
 * @Controller('api')
 * export class ApiController { ... }
 * ```
 */
@Catch(BadRequestException)
@Injectable()
export class EnhancedValidationFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const exceptionResponse: any = exception.getResponse();

    const errorResponse: ErrorResponse = {
      success: false,
      statusCode: HttpStatus.BAD_REQUEST,
      error: 'ValidationError',
      message: 'Request validation failed',
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      errors: this.extractValidationErrors(exceptionResponse),
    };

    response.status(HttpStatus.BAD_REQUEST).json(errorResponse);
  }

  private extractValidationErrors(exceptionResponse: any): ValidationErrorDetail[] {
    if (!exceptionResponse.message) {
      return [];
    }

    if (Array.isArray(exceptionResponse.message)) {
      return exceptionResponse.message.map((error: any) => ({
        field: error.property || error.field || 'unknown',
        value: error.value,
        constraints: error.constraints || {},
      }));
    }

    return [
      {
        field: 'general',
        value: undefined,
        constraints: { error: exceptionResponse.message },
      },
    ];
  }
}

// ============================================================================
// 3. Database Exception Filters
// ============================================================================

/**
 * Database exception filter for TypeORM errors.
 *
 * @example
 * ```typescript
 * @UseFilters(DatabaseExceptionFilter)
 * @Controller('users')
 * export class UsersController { ... }
 * ```
 */
@Catch(DatabaseError, EmptyResultError)
@Injectable()
export class DatabaseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DatabaseExceptionFilter.name);

  catch(exception: DatabaseError | EmptyResultError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database error occurred';
    let error = 'DatabaseError';

    if (exception instanceof EmptyResultError) {
      status = HttpStatus.NOT_FOUND;
      message = 'Resource not found';
      error = 'NotFoundError';
    } else if (exception instanceof DatabaseError) {
      const dbError = this.parseQueryError(exception);
      status = dbError.status;
      message = dbError.message;
      error = dbError.error;
    }

    const errorResponse: ErrorResponse = {
      success: false,
      statusCode: status,
      error,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };

    this.logError(
      `Database error: ${message}`,
      process.env.NODE_ENV === 'development' ? exception.stack : undefined,
    );

    response.status(status).json(errorResponse);
  }

  private parseQueryError(exception: DatabaseError): {
    status: number;
    message: string;
    error: string;
  } {
    const driverError = (exception as any).driverError;

    // PostgreSQL error codes
    if (driverError?.code === '23505') {
      // Unique violation
      return {
        status: HttpStatus.CONFLICT,
        message: 'Resource already exists',
        error: 'UniqueConstraintViolation',
      };
    }

    if (driverError?.code === '23503') {
      // Foreign key violation
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Referenced resource does not exist',
        error: 'ForeignKeyViolation',
      };
    }

    if (driverError?.code === '23502') {
      // Not null violation
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Required field is missing',
        error: 'NotNullViolation',
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Database operation failed',
      error: 'DatabaseError',
    };
  }
}

/**
 * SQL injection prevention filter.
 *
 * @example
 * ```typescript
 * @UseFilters(SQLInjectionFilter)
 * @Controller('search')
 * export class SearchController { ... }
 * ```
 */
@Catch(DatabaseError)
@Injectable()
export class SQLInjectionFilter implements ExceptionFilter {
  private readonly logger = new Logger(SQLInjectionFilter.name);
  private readonly suspiciousPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
    /(--|\;|\/\*|\*\/)/,
    /(\bOR\b.*=.*)/i,
    /(\bAND\b.*=.*)/i,
  ];

  catch(exception: DatabaseError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isSuspicious = this.detectSQLInjection(request);

    if (isSuspicious) {
      this.logError(`Potential SQL injection attempt detected from ${request.ip}`);

      const errorResponse: ErrorResponse = {
        success: false,
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'InvalidRequest',
        message: 'Invalid request parameters',
        timestamp: new Date().toISOString(),
        path: request.url,
      };

      response.status(HttpStatus.BAD_REQUEST).json(errorResponse);
    } else {
      // Standard database error
      const errorResponse: ErrorResponse = {
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'DatabaseError',
        message: 'Database operation failed',
        timestamp: new Date().toISOString(),
        path: request.url,
      };

      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
    }
  }

  private detectSQLInjection(request: Request): boolean {
    const checkValue = (value: any): boolean => {
      if (typeof value === 'string') {
        return this.suspiciousPatterns.some((pattern) => pattern.test(value));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some((v) => checkValue(v));
      }
      return false;
    };

    return (
      checkValue(request.query) || checkValue(request.body) || checkValue(request.params)
    );
  }
}

// ============================================================================
// 4. Authorization Exception Filters
// ============================================================================

/**
 * Unauthorized exception filter with detailed messages.
 *
 * @example
 * ```typescript
 * @UseFilters(UnauthorizedExceptionFilter)
 * @Controller('auth')
 * export class AuthController { ... }
 * ```
 */
@Catch(UnauthorizedException)
@Injectable()
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(UnauthorizedExceptionFilter.name);

  catch(exception: UnauthorizedException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorResponse: ErrorResponse = {
      success: false,
      statusCode: HttpStatus.UNAUTHORIZED,
      error: 'Unauthorized',
      message: exception.message || 'Authentication required',
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      meta: {
        authHeader: !!request.headers.authorization,
        loginUrl: '/auth/login',
      },
    };

    this.logWarning(`Unauthorized access attempt: ${request.method} ${request.url}`);

    response.status(HttpStatus.UNAUTHORIZED).json(errorResponse);
  }
}

/**
 * Forbidden exception filter.
 *
 * @example
 * ```typescript
 * @UseFilters(ForbiddenExceptionFilter)
 * @Controller('admin')
 * export class AdminController { ... }
 * ```
 */
@Catch(ForbiddenException)
@Injectable()
export class ForbiddenExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ForbiddenExceptionFilter.name);

  catch(exception: ForbiddenException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const user = (request as any).user;

    const errorResponse: ErrorResponse = {
      success: false,
      statusCode: HttpStatus.FORBIDDEN,
      error: 'Forbidden',
      message: exception.message || 'Access denied',
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      meta: {
        userId: user?.id,
        roles: user?.roles,
      },
    };

    this.logWarning(
      `Forbidden access: User ${user?.id} attempted to access ${request.url}`,
    );

    response.status(HttpStatus.FORBIDDEN).json(errorResponse);
  }
}

// ============================================================================
// 5. Not Found Exception Filters
// ============================================================================

/**
 * Not found exception filter with suggestions.
 *
 * @example
 * ```typescript
 * @UseFilters(NotFoundExceptionFilter)
 * @Controller()
 * export class AppController { ... }
 * ```
 */
@Catch(NotFoundException)
@Injectable()
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorResponse: ErrorResponse = {
      success: false,
      statusCode: HttpStatus.NOT_FOUND,
      error: 'NotFound',
      message: exception.message || 'Resource not found',
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      meta: {
        suggestions: this.generateSuggestions(request.url),
      },
    };

    response.status(HttpStatus.NOT_FOUND).json(errorResponse);
  }

  private generateSuggestions(url: string): string[] {
    // Generate helpful suggestions based on URL
    const suggestions: string[] = [];

    if (url.includes('/api/')) {
      suggestions.push('Check API documentation for available endpoints');
    }

    if (/\/\d+/.test(url)) {
      suggestions.push('Verify the resource ID is correct');
    }

    return suggestions;
  }
}

// ============================================================================
// 6. External Service Exception Filters
// ============================================================================

/**
 * External service error filter for API integration failures.
 *
 * @example
 * ```typescript
 * @UseFilters(ExternalServiceErrorFilter)
 * @Get('external-data')
 * getExternalData() {
 *   return this.externalService.fetchData();
 * }
 * ```
 */
@Catch()
@Injectable()
export class ExternalServiceErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(ExternalServiceErrorFilter.name);

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (this.isExternalServiceError(exception)) {
      const errorResponse: ErrorResponse = {
        success: false,
        statusCode: HttpStatus.BAD_GATEWAY,
        error: 'ExternalServiceError',
        message: 'External service is currently unavailable',
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        meta: {
          service: this.extractServiceName(exception),
          retryAfter: 60,
        },
      };

      this.logError(
        `External service error: ${exception.message}`,
        exception.stack,
      );

      response.status(HttpStatus.BAD_GATEWAY).json(errorResponse);
    }
  }

  private isExternalServiceError(exception: any): boolean {
    return (
      exception.code === 'ECONNREFUSED' ||
      exception.code === 'ETIMEDOUT' ||
      exception.code === 'ENOTFOUND' ||
      exception.message?.includes('timeout') ||
      exception.message?.includes('ECONNRESET')
    );
  }

  private extractServiceName(exception: any): string {
    // Extract service name from error or config
    return exception.config?.baseURL || 'Unknown service';
  }
}

/**
 * Timeout exception filter.
 *
 * @example
 * ```typescript
 * @UseFilters(TimeoutExceptionFilter)
 * @Get('slow-operation')
 * slowOperation() {
 *   return this.service.performSlowOperation();
 * }
 * ```
 */
@Catch()
@Injectable()
export class TimeoutExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(TimeoutExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception.name === 'TimeoutError' || exception.code === 'ETIMEDOUT') {
      const errorResponse: ErrorResponse = {
        success: false,
        statusCode: HttpStatus.REQUEST_TIMEOUT,
        error: 'TimeoutError',
        message: 'Request timeout - operation took too long',
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
      };

      this.logWarning(`Request timeout: ${request.method} ${request.url}`);

      response.status(HttpStatus.REQUEST_TIMEOUT).json(errorResponse);
    }
  }
}

// ============================================================================
// 7. Custom Business Logic Exception Filters
// ============================================================================

/**
 * Business logic exception filter.
 *
 * @example
 * ```typescript
 * @UseFilters(BusinessLogicExceptionFilter)
 * @Post('transfer')
 * transfer(@Body() transferDto: TransferDto) {
 *   return this.service.transfer(transferDto);
 * }
 * ```
 */
export class BusinessLogicException extends HttpException {
  constructor(
    @Inject(LoggerService) logger: LoggerService,
    message: string,
    public readonly errorCode: string,
    public readonly details?: any,
  ) {
    super({
      serviceName: 'ExternalService',
      logger,
      enableAuditLogging: true,
    });

    super(message, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}

@Catch(BusinessLogicException)
@Injectable()
export class BusinessLogicExceptionFilter implements ExceptionFilter {
  catch(exception: BusinessLogicException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorResponse: ErrorResponse = {
      success: false,
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      error: 'BusinessLogicError',
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      meta: {
        errorCode: exception.errorCode,
        details: exception.details,
      },
    };

    response.status(HttpStatus.UNPROCESSABLE_ENTITY).json(errorResponse);
  }
}

// ============================================================================
// 8. Healthcare-Specific Exception Filters
// ============================================================================

/**
 * HIPAA compliance exception filter.
 *
 * @example
 * ```typescript
 * @UseFilters(HIPAAComplianceFilter)
 * @Controller('patients')
 * export class PatientsController { ... }
 * ```
 */
@Catch()
@Injectable()
export class HIPAAComplianceFilter implements ExceptionFilter {
  private readonly logger = new Logger('HIPAACompliance');

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const user = (request as any).user;

    // Log HIPAA-compliant error (no PHI in logs)
    this.logHIPAAError(exception, request, user);

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An error occurred processing your request';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
    }

    // Sanitize error message to prevent PHI leakage
    const errorResponse: ErrorResponse = {
      success: false,
      statusCode: status,
      error: 'Error',
      message: this.sanitizeErrorMessage(message),
      timestamp: new Date().toISOString(),
      correlationId: this.generateCorrelationId(),
    };

    response.status(status).json(errorResponse);
  }

  private logHIPAAError(exception: any, request: Request, user: any): void {
    const auditLog = {
      timestamp: new Date().toISOString(),
      userId: user?.id || 'anonymous',
      action: `${request.method} ${request.url}`,
      result: 'ERROR',
      errorType: exception.name,
      ipAddress: request.ip,
      correlationId: this.generateCorrelationId(),
      // No PHI or sensitive data
    };

    this.logError(`HIPAA Audit - Error: ${JSON.stringify(auditLog)}`);
  }

  private sanitizeErrorMessage(message: string): string {
    // Remove any potential PHI from error messages
    return message.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]')
      .replace(/\b[A-Z0-9]{8,12}\b/g, '[MRN]')
      .replace(/\b[\w.-]+@[\w.-]+\.\w+\b/g, '[EMAIL]');
  }

  private generateCorrelationId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * PHI access violation filter.
 *
 * @example
 * ```typescript
 * @UseFilters(PHIAccessViolationFilter)
 * @Get('patients/:id/records')
 * getRecords(@Param('id') id: string) {
 *   return this.service.getRecords(id);
 * }
 * ```
 */
export class PHIAccessViolationException extends ForbiddenException {
  constructor(message: string = 'Unauthorized access to Protected Health Information') {
    super(message);
  }
}

@Catch(PHIAccessViolationException)
@Injectable()
export class PHIAccessViolationFilter implements ExceptionFilter {
  private readonly logger = new Logger('PHIAccessViolation');

  catch(exception: PHIAccessViolationException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const user = (request as any).user;

    // Log violation for compliance
    this.logError(`PHI Access Violation - User: ${user?.id}, Path: ${request.url}`);

    const errorResponse: ErrorResponse = {
      success: false,
      statusCode: HttpStatus.FORBIDDEN,
      error: 'AccessDenied',
      message: 'Access to Protected Health Information denied',
      timestamp: new Date().toISOString(),
      correlationId: `PHI-${Date.now()}`,
    };

    response.status(HttpStatus.FORBIDDEN).json(errorResponse);
  }
}

// ============================================================================
// 9. Error Transformation Filters
// ============================================================================

/**
 * Error standardization filter.
 *
 * @example
 * ```typescript
 * @UseFilters(ErrorStandardizationFilter)
 * @Controller()
 * export class AppController { ... }
 * ```
 */
@Catch()
@Injectable()
export class ErrorStandardizationFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const standardized = this.standardizeError(exception);

    const errorResponse: ErrorResponse = {
      success: false,
      statusCode: standardized.status,
      error: standardized.error,
      message: standardized.message,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };

    response.status(standardized.status).json(errorResponse);
  }

  private standardizeError(exception: any): {
    status: number;
    error: string;
    message: string;
  } {
    if (exception instanceof HttpException) {
      return {
        status: exception.getStatus(),
        error: exception.name,
        message: exception.message,
      };
    }

    // Map common error types
    const errorMap: Record<string, { status: number; error: string }> = {
      ValidationError: { status: HttpStatus.BAD_REQUEST, error: 'ValidationError' },
      CastError: { status: HttpStatus.BAD_REQUEST, error: 'InvalidData' },
      MongoError: { status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'DatabaseError' },
      JsonWebTokenError: { status: HttpStatus.UNAUTHORIZED, error: 'AuthenticationError' },
      TokenExpiredError: { status: HttpStatus.UNAUTHORIZED, error: 'TokenExpired' },
    };

    const mapped = errorMap[exception.name];
    if (mapped) {
      return {
        status: mapped.status,
        error: mapped.error,
        message: exception.message || 'An error occurred',
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'InternalServerError',
      message: 'An unexpected error occurred',
    };
  }
}

/**
 * Error masking filter - hides sensitive error details in production.
 *
 * @example
 * ```typescript
 * @UseFilters(ErrorMaskingFilter)
 * @Controller()
 * export class AppController { ... }
 * ```
 */
@Catch()
@Injectable()
export class ErrorMaskingFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isDevelopment = process.env.NODE_ENV === 'development';
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An error occurred';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = isDevelopment ? exception.message : this.getMaskedMessage(status);
    }

    const errorResponse: ErrorResponse = {
      success: false,
      statusCode: status,
      error: isDevelopment ? exception.name : 'Error',
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    if (isDevelopment) {
      errorResponse.stack = exception.stack;
    }

    response.status(status).json(errorResponse);
  }

  private getMaskedMessage(status: number): string {
    const messages: Record<number, string> = {
      400: 'Invalid request',
      401: 'Authentication required',
      403: 'Access denied',
      404: 'Resource not found',
      500: 'Internal server error',
    };

    return messages[status] || 'An error occurred';
  }
}

// ============================================================================
// 10. Error Notification & Alerting Filters
// ============================================================================

/**
 * Error notification filter with multi-channel alerting.
 *
 * @param config - Notification configuration
 * @returns Error notification filter
 *
 * @example
 * ```typescript
 * app.useGlobalFilters(ErrorNotificationFilter({
 *   enabled: true,
 *   channels: ['slack', 'email'],
 *   criticalOnly: true
 * }));
 * ```
 */
export function ErrorNotificationFilter(config: ErrorNotificationConfig): ExceptionFilter {
  @Catch()
  @Injectable()
  class ErrorNotificationFilterImpl implements ExceptionFilter {
    private readonly logger = new Logger('ErrorNotification');
    private lastNotification = new Map<string, number>();

    catch(exception: any, host: ArgumentsHost): void {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();

      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      if (exception instanceof HttpException) {
        status = exception.getStatus();
      }

      // Send notification if conditions met
      if (config.enabled && this.shouldNotify(status, config)) {
        this.sendNotification(exception, request, status, config);
      }

      const errorResponse: ErrorResponse = {
        success: false,
        statusCode: status,
        error: exception.name || 'Error',
        message: exception.message || 'An error occurred',
        timestamp: new Date().toISOString(),
        path: request.url,
      };

      response.status(status).json(errorResponse);
    }

    private shouldNotify(status: number, config: ErrorNotificationConfig): boolean {
      if (config.criticalOnly && status < 500) {
        return false;
      }

      // Throttle notifications
      if (config.throttleMs) {
        const key = `${status}`;
        const lastSent = this.lastNotification.get(key) || 0;
        const now = Date.now();

        if (now - lastSent < config.throttleMs) {
          return false;
        }

        this.lastNotification.set(key, now);
      }

      return true;
    }

    private sendNotification(
      exception: any,
      request: Request,
      status: number,
      config: ErrorNotificationConfig,
    ): void {
      const notification = {
        error: exception.name,
        message: exception.message,
        status,
        path: request.url,
        method: request.method,
        timestamp: new Date().toISOString(),
      };

      config.channels.forEach((channel) => {
        switch (channel) {
          case 'email':
            this.sendEmailNotification(notification);
            break;
          case 'slack':
            this.sendSlackNotification(notification);
            break;
          case 'pagerduty':
            this.sendPagerDutyNotification(notification);
            break;
          case 'webhook':
            this.sendWebhookNotification(notification);
            break;
        }
      });
    }

    private sendEmailNotification(notification: any): void {
      this.logInfo(`[EMAIL] Error notification: ${JSON.stringify(notification)}`);
      // Implement email sending logic
    }

    private sendSlackNotification(notification: any): void {
      this.logInfo(`[SLACK] Error notification: ${JSON.stringify(notification)}`);
      // Implement Slack webhook logic
    }

    private sendPagerDutyNotification(notification: any): void {
      this.logInfo(`[PAGERDUTY] Error notification: ${JSON.stringify(notification)}`);
      // Implement PagerDuty API logic
    }

    private sendWebhookNotification(notification: any): void {
      this.logInfo(`[WEBHOOK] Error notification: ${JSON.stringify(notification)}`);
      // Implement custom webhook logic
    }
  }

  return new ErrorNotificationFilterImpl();
}

/**
 * Critical error filter with immediate alerting.
 *
 * @example
 * ```typescript
 * @UseFilters(CriticalErrorFilter)
 * @Controller()
 * export class AppController { ... }
 * ```
 */
@Catch()
@Injectable()
export class CriticalErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger('CriticalError');

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception instanceof HttpException) {
      status = exception.getStatus();
    }

    // Alert on critical errors (5xx)
    if (status >= 500) {
      this.alertCriticalError(exception, request);
    }

    const errorResponse: ErrorResponse = {
      success: false,
      statusCode: status,
      error: exception.name || 'CriticalError',
      message: exception.message || 'A critical error occurred',
      timestamp: new Date().toISOString(),
      path: request.url,
      correlationId: this.generateCorrelationId(),
    };

    response.status(status).json(errorResponse);
  }

  private alertCriticalError(exception: any, request: Request): void {
    const alert = {
      severity: 'CRITICAL',
      error: exception.name,
      message: exception.message,
      stack: exception.stack,
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
    };

    this.logError(`CRITICAL ERROR: ${JSON.stringify(alert)}`);

    // Trigger immediate alerts (email, SMS, PagerDuty, etc.)
    this.triggerImmediateAlert(alert);
  }

  private triggerImmediateAlert(alert: any): void {
    // Placeholder for immediate alerting logic
    console.error('[CRITICAL ALERT]', alert);
  }

  private generateCorrelationId(): string {
    return `CRIT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ============================================================================
// 11. Error Metrics & Monitoring Filters
// ============================================================================

/**
 * Error metrics collection filter.
 *
 * @example
 * ```typescript
 * @UseFilters(ErrorMetricsFilter)
 * @Controller()
 * export class AppController { ... }
 * ```
 */
@Catch()
@Injectable()
export class ErrorMetricsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ErrorMetrics');
  private errorCounts = new Map<string, number>();

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception instanceof HttpException) {
      status = exception.getStatus();
    }

    // Track error metrics
    this.trackErrorMetric(exception.name, status, request.url);

    const errorResponse: ErrorResponse = {
      success: false,
      statusCode: status,
      error: exception.name || 'Error',
      message: exception.message || 'An error occurred',
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(errorResponse);
  }

  private trackErrorMetric(errorType: string, status: number, path: string): void {
    const key = `${errorType}:${status}:${path}`;
    const count = this.errorCounts.get(key) || 0;
    this.errorCounts.set(key, count + 1);

    this.logInfo(`Error metric: ${key} = ${count + 1}`);

    // Send metrics to monitoring service (Prometheus, CloudWatch, etc.)
    this.sendMetric({
      type: errorType,
      status,
      path,
      count: count + 1,
      timestamp: Date.now(),
    });
  }

  private sendMetric(metric: any): void {
    // Placeholder for metrics service integration
    // e.g., Prometheus, CloudWatch, DataDog, New Relic
  }

  getMetrics(): Map<string, number> {
    return this.errorCounts;
  }
}

// ============================================================================
// 12. Utility Functions
// ============================================================================

/**
 * Creates a custom exception filter factory.
 *
 * @param handler - Custom error handler function
 * @returns Custom exception filter
 *
 * @example
 * ```typescript
 * const customFilter = createCustomFilter((exception, request) => ({
 *   statusCode: 500,
 *   message: 'Custom error handling'
 * }));
 *
 * app.useGlobalFilters(customFilter);
 * ```
 */
export function createCustomFilter(
  handler: (exception: any, request: Request) => ErrorResponse,
): ExceptionFilter {
  @Catch()
  @Injectable()
  class CustomExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost): void {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();

      const errorResponse = handler(exception, request);

      response.status(errorResponse.statusCode).json(errorResponse);
    }
  }

  return new CustomExceptionFilter();
}

/**
 * Combines multiple exception filters.
 *
 * @param filters - Array of exception filters
 * @returns Combined exception filter
 *
 * @example
 * ```typescript
 * const combinedFilter = combineFilters([
 *   new ValidationExceptionFilter(),
 *   new DatabaseExceptionFilter(),
 *   new GlobalExceptionFilter()
 * ]);
 * ```
 */
export function combineFilters(filters: ExceptionFilter[]): ExceptionFilter {
  @Catch()
  @Injectable()
  class CombinedExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost): void {
      for (const filter of filters) {
        try {
          filter.catch(exception, host);
          return;
        } catch (error) {
          // Continue to next filter
        }
      }

      // Fallback error response
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();

      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Error',
        message: 'An error occurred',
        timestamp: new Date().toISOString(),
      });
    }
  }

  return new CombinedExceptionFilter();
}
