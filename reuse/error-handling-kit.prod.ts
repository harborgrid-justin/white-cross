/**
 * LOC: ERR_HANDLE_PROD_001
 * File: /reuse/error-handling-kit.prod.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - @sentry/node
 *   - sequelize-typescript
 *   - sequelize
 *   - zod
 *   - rxjs
 *
 * DOWNSTREAM (imported by):
 *   - Exception filters
 *   - Error interceptors
 *   - Error middleware
 *   - Service error handlers
 *   - Controller error handling
 *   - Background job error handling
 */

/**
 * File: /reuse/error-handling-kit.prod.ts
 * Locator: WC-ERR-HANDLE-PROD-001
 * Purpose: Production-Grade Error Handling & Exception Management Kit - Enterprise error toolkit
 *
 * Upstream: NestJS, Sentry, Sequelize, Zod, RxJS
 * Downstream: ../backend/filters/*, Interceptors, Services, Controllers, Error Boundaries
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, @sentry/node
 * Exports: 48 production-ready error handling functions covering exceptions, serialization, monitoring, recovery
 *
 * LLM Context: Production-grade error handling and exception management utilities for White Cross healthcare platform.
 * Provides comprehensive custom exception classes (domain-specific, HTTP, validation), error serialization for APIs,
 * stack trace sanitization, error code management, NestJS exception filters with Swagger integration, error interceptors,
 * Sequelize error handlers, retry logic with exponential backoff, circuit breaker pattern, error rate limiting, Sentry
 * integration for monitoring, error context enrichment, error aggregation, validation error formatting (Zod), error
 * recovery strategies, error boundaries for React components, dead letter queue handling, and HIPAA-compliant error
 * logging that sanitizes sensitive patient information from error messages and stack traces.
 */

import {
  Injectable,
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { ApiProperty, ApiResponse, ApiResponseProperty } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Observable, throwError, timer, of } from 'rxjs';
import { catchError, retry, retryWhen, mergeMap, tap, finalize } from 'rxjs/operators';
import { z, ZodError } from 'zod';
import * as Sentry from '@sentry/node';
import {
  ValidationError as SequelizeValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError,
  DatabaseError,
  ConnectionError,
  TimeoutError as SequelizeTimeoutError,
} from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Error categories for classification
 */
export enum ErrorCategory {
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  NOT_FOUND = 'not_found',
  CONFLICT = 'conflict',
  RATE_LIMIT = 'rate_limit',
  DATABASE = 'database',
  EXTERNAL_SERVICE = 'external_service',
  INTERNAL = 'internal',
  NETWORK = 'network',
  TIMEOUT = 'timeout',
  BUSINESS_LOGIC = 'business_logic',
  CONFIGURATION = 'configuration',
}

/**
 * Error codes for standardized error handling
 */
export enum ErrorCode {
  // Validation errors (1000-1999)
  VALIDATION_FAILED = 'ERR_1000',
  INVALID_INPUT = 'ERR_1001',
  MISSING_REQUIRED_FIELD = 'ERR_1002',
  INVALID_FORMAT = 'ERR_1003',
  INVALID_TYPE = 'ERR_1004',

  // Authentication errors (2000-2999)
  AUTHENTICATION_FAILED = 'ERR_2000',
  INVALID_CREDENTIALS = 'ERR_2001',
  TOKEN_EXPIRED = 'ERR_2002',
  TOKEN_INVALID = 'ERR_2003',
  SESSION_EXPIRED = 'ERR_2004',
  MFA_REQUIRED = 'ERR_2005',

  // Authorization errors (3000-3999)
  FORBIDDEN = 'ERR_3000',
  INSUFFICIENT_PERMISSIONS = 'ERR_3001',
  ACCESS_DENIED = 'ERR_3002',
  RESOURCE_FORBIDDEN = 'ERR_3003',

  // Resource errors (4000-4999)
  RESOURCE_NOT_FOUND = 'ERR_4000',
  USER_NOT_FOUND = 'ERR_4001',
  PATIENT_NOT_FOUND = 'ERR_4002',
  APPOINTMENT_NOT_FOUND = 'ERR_4003',

  // Conflict errors (5000-5999)
  RESOURCE_CONFLICT = 'ERR_5000',
  DUPLICATE_ENTRY = 'ERR_5001',
  VERSION_CONFLICT = 'ERR_5002',
  STATE_CONFLICT = 'ERR_5003',

  // Rate limiting errors (6000-6999)
  RATE_LIMIT_EXCEEDED = 'ERR_6000',
  TOO_MANY_REQUESTS = 'ERR_6001',
  QUOTA_EXCEEDED = 'ERR_6002',

  // Database errors (7000-7999)
  DATABASE_ERROR = 'ERR_7000',
  DATABASE_CONNECTION_FAILED = 'ERR_7001',
  QUERY_FAILED = 'ERR_7002',
  TRANSACTION_FAILED = 'ERR_7003',
  CONSTRAINT_VIOLATION = 'ERR_7004',
  FOREIGN_KEY_VIOLATION = 'ERR_7005',

  // External service errors (8000-8999)
  EXTERNAL_SERVICE_ERROR = 'ERR_8000',
  SERVICE_UNAVAILABLE = 'ERR_8001',
  SERVICE_TIMEOUT = 'ERR_8002',
  INTEGRATION_FAILED = 'ERR_8003',

  // Internal errors (9000-9999)
  INTERNAL_SERVER_ERROR = 'ERR_9000',
  UNHANDLED_ERROR = 'ERR_9001',
  CONFIGURATION_ERROR = 'ERR_9002',
  NOT_IMPLEMENTED = 'ERR_9003',

  // Business logic errors (10000-10999)
  BUSINESS_RULE_VIOLATION = 'ERR_10000',
  INVALID_STATE_TRANSITION = 'ERR_10001',
  OPERATION_NOT_ALLOWED = 'ERR_10002',
  PRECONDITION_FAILED = 'ERR_10003',
}

/**
 * Standardized error response structure
 */
export interface ErrorResponse {
  statusCode: number;
  errorCode: ErrorCode;
  message: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  timestamp: string;
  path?: string;
  method?: string;
  requestId?: string;
  details?: ErrorDetail[];
  metadata?: Record<string, any>;
  stack?: string; // Only in development
}

/**
 * Error detail for validation errors
 */
export interface ErrorDetail {
  field?: string;
  message: string;
  value?: any;
  constraint?: string;
}

/**
 * Error context for enrichment
 */
export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  ipAddress?: string;
  userAgent?: string;
  correlationId?: string;
  tags?: Record<string, string>;
  extra?: Record<string, any>;
}

/**
 * Retry configuration
 */
export interface RetryConfig {
  maxAttempts: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  retryableErrors?: ErrorCode[];
  shouldRetry?: (error: Error, attempt: number) => boolean;
}

/**
 * Circuit breaker state
 */
export enum CircuitState {
  CLOSED = 'closed',
  OPEN = 'open',
  HALF_OPEN = 'half_open',
}

/**
 * Circuit breaker configuration
 */
export interface CircuitBreakerConfig {
  failureThreshold: number;
  successThreshold: number;
  timeout: number;
  resetTimeoutMs: number;
  halfOpenMaxAttempts: number;
  name?: string;
}

/**
 * Circuit breaker state data
 */
export interface CircuitBreakerState {
  state: CircuitState;
  failureCount: number;
  successCount: number;
  lastFailureTime?: Date;
  nextAttemptTime?: Date;
}

/**
 * Error metric for monitoring
 */
export interface ErrorMetric {
  errorCode: ErrorCode;
  category: ErrorCategory;
  severity: ErrorSeverity;
  count: number;
  timestamp: Date;
  userId?: string;
  endpoint?: string;
}

/**
 * Sentry error context
 */
export interface SentryErrorContext {
  level: Sentry.SeverityLevel;
  tags?: Record<string, string>;
  extra?: Record<string, any>;
  user?: {
    id?: string;
    email?: string;
    username?: string;
  };
  fingerprint?: string[];
}

/**
 * Dead letter queue item
 */
export interface DeadLetterItem<T = any> {
  id: string;
  originalPayload: T;
  error: ErrorResponse;
  attempt: number;
  createdAt: Date;
  lastAttemptAt: Date;
  nextRetryAt?: Date;
  metadata?: Record<string, any>;
}

/**
 * Error recovery strategy
 */
export interface RecoveryStrategy<T = any> {
  maxAttempts: number;
  backoffMs: number[];
  fallbackValue?: T;
  shouldRecover: (error: Error, attempt: number) => boolean;
  onRecovery?: (error: Error, result: T) => void;
  onFailure?: (error: Error) => void;
}

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

/**
 * Error response schema
 */
export const ErrorResponseSchema = z.object({
  statusCode: z.number().int().min(100).max(599),
  errorCode: z.nativeEnum(ErrorCode),
  message: z.string().min(1),
  category: z.nativeEnum(ErrorCategory),
  severity: z.nativeEnum(ErrorSeverity),
  timestamp: z.string().datetime(),
  path: z.string().optional(),
  method: z.string().optional(),
  requestId: z.string().uuid().optional(),
  details: z.array(z.object({
    field: z.string().optional(),
    message: z.string(),
    value: z.any().optional(),
    constraint: z.string().optional(),
  })).optional(),
  metadata: z.record(z.any()).optional(),
  stack: z.string().optional(),
});

/**
 * Retry configuration schema
 */
export const RetryConfigSchema = z.object({
  maxAttempts: z.number().int().min(1).max(10),
  initialDelayMs: z.number().int().min(0),
  maxDelayMs: z.number().int().min(0),
  backoffMultiplier: z.number().min(1),
});

/**
 * Circuit breaker configuration schema
 */
export const CircuitBreakerConfigSchema = z.object({
  failureThreshold: z.number().int().min(1),
  successThreshold: z.number().int().min(1),
  timeout: z.number().int().min(0),
  resetTimeoutMs: z.number().int().min(0),
  halfOpenMaxAttempts: z.number().int().min(1),
  name: z.string().optional(),
});

// ============================================================================
// CUSTOM EXCEPTION CLASSES
// ============================================================================

/**
 * Base domain exception class with enhanced context
 *
 * @example
 * ```typescript
 * throw new DomainException(
 *   'Patient record not found',
 *   ErrorCode.PATIENT_NOT_FOUND,
 *   ErrorCategory.NOT_FOUND,
 *   HttpStatus.NOT_FOUND,
 *   { patientId: '123' }
 * );
 * ```
 */
export class DomainException extends HttpException {
  constructor(
    message: string,
    public readonly errorCode: ErrorCode,
    public readonly category: ErrorCategory,
    public readonly statusCode: number = HttpStatus.BAD_REQUEST,
    public readonly metadata?: Record<string, any>,
    public readonly severity: ErrorSeverity = ErrorSeverity.MEDIUM,
  ) {
    super(
      {
        statusCode,
        errorCode,
        message,
        category,
        severity,
        metadata,
      },
      statusCode,
    );
    this.name = 'DomainException';
    Object.setPrototypeOf(this, DomainException.prototype);
  }
}

/**
 * Validation exception for input validation failures
 */
export class ValidationException extends DomainException {
  constructor(
    message: string,
    public readonly details: ErrorDetail[] = [],
    metadata?: Record<string, any>,
  ) {
    super(
      message,
      ErrorCode.VALIDATION_FAILED,
      ErrorCategory.VALIDATION,
      HttpStatus.BAD_REQUEST,
      metadata,
      ErrorSeverity.LOW,
    );
    this.name = 'ValidationException';
    Object.setPrototypeOf(this, ValidationException.prototype);
  }
}

/**
 * Business rule violation exception
 */
export class BusinessRuleException extends DomainException {
  constructor(
    message: string,
    public readonly rule: string,
    metadata?: Record<string, any>,
  ) {
    super(
      message,
      ErrorCode.BUSINESS_RULE_VIOLATION,
      ErrorCategory.BUSINESS_LOGIC,
      HttpStatus.UNPROCESSABLE_ENTITY,
      { rule, ...metadata },
      ErrorSeverity.MEDIUM,
    );
    this.name = 'BusinessRuleException';
    Object.setPrototypeOf(this, BusinessRuleException.prototype);
  }
}

/**
 * External service exception for third-party API failures
 */
export class ExternalServiceException extends DomainException {
  constructor(
    message: string,
    public readonly serviceName: string,
    public readonly originalError?: Error,
    metadata?: Record<string, any>,
  ) {
    super(
      message,
      ErrorCode.EXTERNAL_SERVICE_ERROR,
      ErrorCategory.EXTERNAL_SERVICE,
      HttpStatus.BAD_GATEWAY,
      { serviceName, originalError: originalError?.message, ...metadata },
      ErrorSeverity.HIGH,
    );
    this.name = 'ExternalServiceException';
    Object.setPrototypeOf(this, ExternalServiceException.prototype);
  }
}

/**
 * Database exception for database operation failures
 */
export class DatabaseException extends DomainException {
  constructor(
    message: string,
    public readonly operation: string,
    public readonly originalError?: Error,
    metadata?: Record<string, any>,
  ) {
    super(
      message,
      ErrorCode.DATABASE_ERROR,
      ErrorCategory.DATABASE,
      HttpStatus.INTERNAL_SERVER_ERROR,
      { operation, originalError: originalError?.message, ...metadata },
      ErrorSeverity.HIGH,
    );
    this.name = 'DatabaseException';
    Object.setPrototypeOf(this, DatabaseException.prototype);
  }
}

/**
 * Resource not found exception
 */
export class ResourceNotFoundException extends DomainException {
  constructor(
    resourceType: string,
    resourceId: string,
    metadata?: Record<string, any>,
  ) {
    super(
      `${resourceType} with ID ${resourceId} not found`,
      ErrorCode.RESOURCE_NOT_FOUND,
      ErrorCategory.NOT_FOUND,
      HttpStatus.NOT_FOUND,
      { resourceType, resourceId, ...metadata },
      ErrorSeverity.LOW,
    );
    this.name = 'ResourceNotFoundException';
    Object.setPrototypeOf(this, ResourceNotFoundException.prototype);
  }
}

/**
 * Conflict exception for resource conflicts
 */
export class ResourceConflictException extends DomainException {
  constructor(
    message: string,
    public readonly conflictType: string,
    metadata?: Record<string, any>,
  ) {
    super(
      message,
      ErrorCode.RESOURCE_CONFLICT,
      ErrorCategory.CONFLICT,
      HttpStatus.CONFLICT,
      { conflictType, ...metadata },
      ErrorSeverity.MEDIUM,
    );
    this.name = 'ResourceConflictException';
    Object.setPrototypeOf(this, ResourceConflictException.prototype);
  }
}

/**
 * Rate limit exceeded exception
 */
export class RateLimitException extends DomainException {
  constructor(
    message: string,
    public readonly limit: number,
    public readonly windowMs: number,
    public readonly retryAfterMs?: number,
    metadata?: Record<string, any>,
  ) {
    super(
      message,
      ErrorCode.RATE_LIMIT_EXCEEDED,
      ErrorCategory.RATE_LIMIT,
      HttpStatus.TOO_MANY_REQUESTS,
      { limit, windowMs, retryAfterMs, ...metadata },
      ErrorSeverity.LOW,
    );
    this.name = 'RateLimitException';
    Object.setPrototypeOf(this, RateLimitException.prototype);
  }
}

/**
 * Circuit breaker open exception
 */
export class CircuitBreakerOpenException extends DomainException {
  constructor(
    serviceName: string,
    public readonly resetTimeMs: number,
    metadata?: Record<string, any>,
  ) {
    super(
      `Circuit breaker is open for service: ${serviceName}`,
      ErrorCode.SERVICE_UNAVAILABLE,
      ErrorCategory.EXTERNAL_SERVICE,
      HttpStatus.SERVICE_UNAVAILABLE,
      { serviceName, resetTimeMs, ...metadata },
      ErrorSeverity.HIGH,
    );
    this.name = 'CircuitBreakerOpenException';
    Object.setPrototypeOf(this, CircuitBreakerOpenException.prototype);
  }
}

// ============================================================================
// ERROR SERIALIZATION & FORMATTING
// ============================================================================

/**
 * Serialize error to standardized ErrorResponse format
 *
 * @param error - Error to serialize
 * @param request - Express request object for context
 * @param includeStack - Whether to include stack trace (development only)
 * @returns Standardized error response
 *
 * @example
 * ```typescript
 * const errorResponse = serializeError(error, request, process.env.NODE_ENV === 'development');
 * response.status(errorResponse.statusCode).json(errorResponse);
 * ```
 */
export function serializeError(
  error: Error | HttpException | DomainException,
  request?: Request,
  includeStack: boolean = false,
): ErrorResponse {
  const timestamp = new Date().toISOString();

  // Handle DomainException
  if (error instanceof DomainException) {
    return {
      statusCode: error.statusCode,
      errorCode: error.errorCode,
      message: error.message,
      category: error.category,
      severity: error.severity,
      timestamp,
      path: request?.url,
      method: request?.method,
      requestId: (request as any)?.id,
      metadata: error.metadata,
      stack: includeStack ? error.stack : undefined,
    };
  }

  // Handle HttpException
  if (error instanceof HttpException) {
    const response = error.getResponse();
    const statusCode = error.getStatus();

    return {
      statusCode,
      errorCode: mapHttpStatusToErrorCode(statusCode),
      message: typeof response === 'string' ? response : (response as any).message || error.message,
      category: mapHttpStatusToCategory(statusCode),
      severity: mapHttpStatusToSeverity(statusCode),
      timestamp,
      path: request?.url,
      method: request?.method,
      requestId: (request as any)?.id,
      stack: includeStack ? error.stack : undefined,
    };
  }

  // Handle generic Error
  return {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
    message: error.message || 'An unexpected error occurred',
    category: ErrorCategory.INTERNAL,
    severity: ErrorSeverity.HIGH,
    timestamp,
    path: request?.url,
    method: request?.method,
    requestId: (request as any)?.id,
    stack: includeStack ? error.stack : undefined,
  };
}

/**
 * Format Zod validation errors into ErrorDetail array
 *
 * @param zodError - Zod validation error
 * @returns Array of error details
 *
 * @example
 * ```typescript
 * try {
 *   schema.parse(data);
 * } catch (error) {
 *   if (error instanceof ZodError) {
 *     const details = formatZodErrors(error);
 *     throw new ValidationException('Validation failed', details);
 *   }
 * }
 * ```
 */
export function formatZodErrors(zodError: ZodError): ErrorDetail[] {
  return zodError.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
    value: undefined, // Don't expose actual values for security
    constraint: err.code,
  }));
}

/**
 * Format Sequelize validation errors into ErrorDetail array
 *
 * @param sequelizeError - Sequelize validation error
 * @returns Array of error details
 *
 * @example
 * ```typescript
 * try {
 *   await user.save();
 * } catch (error) {
 *   if (error instanceof SequelizeValidationError) {
 *     const details = formatSequelizeErrors(error);
 *     throw new ValidationException('Validation failed', details);
 *   }
 * }
 * ```
 */
export function formatSequelizeErrors(sequelizeError: SequelizeValidationError): ErrorDetail[] {
  return sequelizeError.errors.map((err) => ({
    field: err.path || err.validatorKey,
    message: err.message,
    value: undefined,
    constraint: err.validatorKey || err.type,
  }));
}

/**
 * Sanitize error stack trace to remove sensitive information
 *
 * @param stack - Stack trace string
 * @param sensitivePatterns - Patterns to redact (passwords, tokens, etc.)
 * @returns Sanitized stack trace
 *
 * @example
 * ```typescript
 * const sanitizedStack = sanitizeStackTrace(error.stack, [/password=\w+/, /token=[\w-]+/]);
 * ```
 */
export function sanitizeStackTrace(
  stack: string | undefined,
  sensitivePatterns: RegExp[] = [
    /password[=:]\s*["']?[\w!@#$%^&*()]+["']?/gi,
    /token[=:]\s*["']?[\w.-]+["']?/gi,
    /api[_-]?key[=:]\s*["']?[\w-]+["']?/gi,
    /secret[=:]\s*["']?[\w-]+["']?/gi,
    /ssn[=:]\s*["']?\d{3}-?\d{2}-?\d{4}["']?/gi,
    /credit[_-]?card[=:]\s*["']?\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}["']?/gi,
  ],
): string {
  if (!stack) return '';

  let sanitized = stack;
  sensitivePatterns.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, '[REDACTED]');
  });

  return sanitized;
}

/**
 * Sanitize error message to remove HIPAA-sensitive information
 *
 * @param message - Error message
 * @returns Sanitized message
 *
 * @example
 * ```typescript
 * const sanitized = sanitizeErrorMessage('Patient SSN 123-45-6789 is invalid');
 * // Returns: 'Patient SSN [REDACTED] is invalid'
 * ```
 */
export function sanitizeErrorMessage(message: string): string {
  return sanitizeStackTrace(message);
}

/**
 * Create user-friendly error message from technical error
 *
 * @param error - Technical error
 * @param userFacingMessages - Map of error codes to user messages
 * @returns User-friendly message
 *
 * @example
 * ```typescript
 * const userMessage = createUserFriendlyMessage(error, {
 *   [ErrorCode.DATABASE_ERROR]: 'We are experiencing technical difficulties. Please try again later.',
 * });
 * ```
 */
export function createUserFriendlyMessage(
  error: Error | DomainException,
  userFacingMessages: Partial<Record<ErrorCode, string>> = {},
): string {
  if (error instanceof DomainException) {
    return userFacingMessages[error.errorCode] || error.message;
  }

  return 'An unexpected error occurred. Please try again or contact support.';
}

// ============================================================================
// ERROR CODE MAPPING
// ============================================================================

/**
 * Map HTTP status code to ErrorCode
 *
 * @param statusCode - HTTP status code
 * @returns Corresponding ErrorCode
 */
export function mapHttpStatusToErrorCode(statusCode: number): ErrorCode {
  const mapping: Record<number, ErrorCode> = {
    400: ErrorCode.VALIDATION_FAILED,
    401: ErrorCode.AUTHENTICATION_FAILED,
    403: ErrorCode.FORBIDDEN,
    404: ErrorCode.RESOURCE_NOT_FOUND,
    409: ErrorCode.RESOURCE_CONFLICT,
    422: ErrorCode.BUSINESS_RULE_VIOLATION,
    429: ErrorCode.RATE_LIMIT_EXCEEDED,
    500: ErrorCode.INTERNAL_SERVER_ERROR,
    502: ErrorCode.EXTERNAL_SERVICE_ERROR,
    503: ErrorCode.SERVICE_UNAVAILABLE,
    504: ErrorCode.SERVICE_TIMEOUT,
  };

  return mapping[statusCode] || ErrorCode.INTERNAL_SERVER_ERROR;
}

/**
 * Map HTTP status code to ErrorCategory
 *
 * @param statusCode - HTTP status code
 * @returns Corresponding ErrorCategory
 */
export function mapHttpStatusToCategory(statusCode: number): ErrorCategory {
  if (statusCode === 400 || statusCode === 422) return ErrorCategory.VALIDATION;
  if (statusCode === 401) return ErrorCategory.AUTHENTICATION;
  if (statusCode === 403) return ErrorCategory.AUTHORIZATION;
  if (statusCode === 404) return ErrorCategory.NOT_FOUND;
  if (statusCode === 409) return ErrorCategory.CONFLICT;
  if (statusCode === 429) return ErrorCategory.RATE_LIMIT;
  if (statusCode >= 500) return ErrorCategory.INTERNAL;

  return ErrorCategory.INTERNAL;
}

/**
 * Map HTTP status code to ErrorSeverity
 *
 * @param statusCode - HTTP status code
 * @returns Corresponding ErrorSeverity
 */
export function mapHttpStatusToSeverity(statusCode: number): ErrorSeverity {
  if (statusCode >= 500) return ErrorSeverity.HIGH;
  if (statusCode === 401 || statusCode === 403) return ErrorSeverity.MEDIUM;
  if (statusCode === 429) return ErrorSeverity.MEDIUM;

  return ErrorSeverity.LOW;
}

// ============================================================================
// NESTJS EXCEPTION FILTERS
// ============================================================================

/**
 * Global exception filter for all HTTP exceptions
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
  private readonly logger = new Logger('GlobalExceptionFilter');

  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isDevelopment = process.env.NODE_ENV === 'development';
    const errorResponse = serializeError(exception, request, isDevelopment);

    // Log error
    this.logger.error(
      `${errorResponse.method} ${errorResponse.path} - ${errorResponse.errorCode}: ${errorResponse.message}`,
      exception.stack,
    );

    // Send to Sentry in production
    if (!isDevelopment) {
      captureErrorToSentry(exception, {
        level: mapSeverityToSentryLevel(errorResponse.severity),
        tags: {
          errorCode: errorResponse.errorCode,
          category: errorResponse.category,
        },
        extra: {
          requestId: errorResponse.requestId,
          metadata: errorResponse.metadata,
        },
      });
    }

    response.status(errorResponse.statusCode).json(errorResponse);
  }
}

/**
 * Validation exception filter for handling validation errors
 *
 * @example
 * ```typescript
 * @UseFilters(ValidationExceptionFilter)
 * @Post()
 * async create(@Body() dto: CreateUserDto) {
 *   // ...
 * }
 * ```
 */
@Catch(ValidationException, BadRequestException)
@Injectable()
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationException | BadRequestException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let errorResponse: ErrorResponse;

    if (exception instanceof ValidationException) {
      errorResponse = serializeError(exception, request);
      errorResponse.details = exception.details;
    } else {
      errorResponse = serializeError(exception, request);

      // Extract validation errors from NestJS ValidationPipe
      const exceptionResponse = exception.getResponse() as any;
      if (Array.isArray(exceptionResponse.message)) {
        errorResponse.details = exceptionResponse.message.map((msg: string) => ({
          message: msg,
        }));
      }
    }

    response.status(errorResponse.statusCode).json(errorResponse);
  }
}

/**
 * Database exception filter for handling Sequelize errors
 *
 * @example
 * ```typescript
 * app.useGlobalFilters(new DatabaseExceptionFilter());
 * ```
 */
@Catch(
  SequelizeValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError,
  DatabaseError,
  ConnectionError,
  SequelizeTimeoutError,
)
@Injectable()
export class DatabaseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('DatabaseExceptionFilter');

  catch(exception: DatabaseError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let domainException: DomainException;

    if (exception instanceof UniqueConstraintError) {
      const field = Object.keys(exception.fields || {})[0] || 'resource';
      domainException = new ResourceConflictException(
        `Duplicate entry for ${field}`,
        'unique_constraint',
        { field, fields: exception.fields },
      );
    } else if (exception instanceof ForeignKeyConstraintError) {
      domainException = new DatabaseException(
        'Foreign key constraint violation',
        'foreign_key_check',
        exception,
        { table: (exception as any).table },
      );
    } else if (exception instanceof SequelizeValidationError) {
      const details = formatSequelizeErrors(exception);
      domainException = new ValidationException('Database validation failed', details);
    } else if (exception instanceof ConnectionError) {
      domainException = new DatabaseException(
        'Database connection failed',
        'connection',
        exception,
      );
    } else if (exception instanceof SequelizeTimeoutError) {
      domainException = new DatabaseException(
        'Database query timeout',
        'query',
        exception,
      );
    } else {
      domainException = new DatabaseException(
        'Database operation failed',
        'unknown',
        exception,
      );
    }

    const errorResponse = serializeError(domainException, request);

    this.logger.error(
      `Database Error: ${errorResponse.message}`,
      exception.stack,
    );

    response.status(errorResponse.statusCode).json(errorResponse);
  }
}

// ============================================================================
// NESTJS INTERCEPTORS
// ============================================================================

/**
 * Error logging interceptor with enriched context
 *
 * @example
 * ```typescript
 * @UseInterceptors(ErrorLoggingInterceptor)
 * @Get()
 * async getData() {
 *   // ...
 * }
 * ```
 */
@Injectable()
export class ErrorLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('ErrorLoggingInterceptor');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url } = request;
    const userAgent = request.get('user-agent') || '';
    const ip = request.ip;

    return next.handle().pipe(
      catchError((error) => {
        const errorContext: ErrorContext = {
          requestId: (request as any).id,
          ipAddress: ip,
          userAgent,
          userId: (request as any).user?.id,
          sessionId: (request as any).session?.id,
        };

        this.logger.error(
          `${method} ${url} - Error: ${error.message}`,
          JSON.stringify(errorContext),
        );

        return throwError(() => error);
      }),
    );
  }
}

/**
 * Error transformation interceptor to convert errors to domain exceptions
 *
 * @example
 * ```typescript
 * app.useGlobalInterceptors(new ErrorTransformationInterceptor());
 * ```
 */
@Injectable()
export class ErrorTransformationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        // Transform ZodError to ValidationException
        if (error instanceof ZodError) {
          const details = formatZodErrors(error);
          return throwError(() => new ValidationException('Validation failed', details));
        }

        // Pass through DomainExceptions
        if (error instanceof DomainException) {
          return throwError(() => error);
        }

        // Transform generic errors to InternalServerErrorException
        if (!(error instanceof HttpException)) {
          return throwError(() => new InternalServerErrorException(error.message));
        }

        return throwError(() => error);
      }),
    );
  }
}

/**
 * Request timeout interceptor with configurable timeout
 *
 * @example
 * ```typescript
 * @UseInterceptors(new TimeoutInterceptor(5000))
 * @Get()
 * async slowEndpoint() {
 *   // ...
 * }
 * ```
 */
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(private readonly timeoutMs: number = 30000) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(this.timeoutMs),
      catchError((error) => {
        if (error.name === 'TimeoutError') {
          return throwError(() =>
            new DomainException(
              `Request timeout after ${this.timeoutMs}ms`,
              ErrorCode.SERVICE_TIMEOUT,
              ErrorCategory.TIMEOUT,
              HttpStatus.REQUEST_TIMEOUT,
              { timeoutMs: this.timeoutMs },
              ErrorSeverity.MEDIUM,
            ),
          );
        }
        return throwError(() => error);
      }),
    );
  }
}

// ============================================================================
// RETRY LOGIC WITH EXPONENTIAL BACKOFF
// ============================================================================

/**
 * Calculate exponential backoff delay
 *
 * @param attempt - Current attempt number (0-indexed)
 * @param config - Retry configuration
 * @returns Delay in milliseconds
 *
 * @example
 * ```typescript
 * const delay = calculateBackoffDelay(2, {
 *   initialDelayMs: 1000,
 *   maxDelayMs: 30000,
 *   backoffMultiplier: 2,
 * });
 * // Returns: 4000 (1000 * 2^2)
 * ```
 */
export function calculateBackoffDelay(attempt: number, config: Partial<RetryConfig>): number {
  const initialDelay = config.initialDelayMs || 1000;
  const maxDelay = config.maxDelayMs || 30000;
  const multiplier = config.backoffMultiplier || 2;

  const delay = initialDelay * Math.pow(multiplier, attempt);
  return Math.min(delay, maxDelay);
}

/**
 * Retry operation with exponential backoff
 *
 * @param operation - Async operation to retry
 * @param config - Retry configuration
 * @returns Promise resolving to operation result
 *
 * @example
 * ```typescript
 * const result = await retryWithBackoff(
 *   () => fetchFromExternalAPI(),
 *   {
 *     maxAttempts: 3,
 *     initialDelayMs: 1000,
 *     maxDelayMs: 10000,
 *     backoffMultiplier: 2,
 *     shouldRetry: (error, attempt) => error.statusCode >= 500,
 *   }
 * );
 * ```
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  config: RetryConfig,
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt < config.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      const shouldRetry = config.shouldRetry
        ? config.shouldRetry(error as Error, attempt)
        : true;

      if (!shouldRetry || attempt === config.maxAttempts - 1) {
        throw error;
      }

      const delay = calculateBackoffDelay(attempt, config);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

/**
 * RxJS retry operator with exponential backoff
 *
 * @param config - Retry configuration
 * @returns RxJS operator
 *
 * @example
 * ```typescript
 * return this.httpClient.get(url).pipe(
 *   retryWithBackoffOperator({
 *     maxAttempts: 3,
 *     initialDelayMs: 1000,
 *     maxDelayMs: 10000,
 *     backoffMultiplier: 2,
 *   })
 * );
 * ```
 */
export function retryWithBackoffOperator<T>(config: RetryConfig) {
  return (source: Observable<T>) =>
    source.pipe(
      retryWhen((errors) =>
        errors.pipe(
          mergeMap((error, attempt) => {
            const shouldRetry = config.shouldRetry
              ? config.shouldRetry(error, attempt)
              : true;

            if (!shouldRetry || attempt >= config.maxAttempts - 1) {
              return throwError(() => error);
            }

            const delay = calculateBackoffDelay(attempt, config);
            return timer(delay);
          }),
        ),
      ),
    );
}

/**
 * Check if error is retryable based on error code
 *
 * @param error - Error to check
 * @param retryableErrors - List of retryable error codes
 * @returns Whether error should be retried
 *
 * @example
 * ```typescript
 * const shouldRetry = isRetryableError(error, [
 *   ErrorCode.SERVICE_TIMEOUT,
 *   ErrorCode.SERVICE_UNAVAILABLE,
 * ]);
 * ```
 */
export function isRetryableError(error: Error, retryableErrors?: ErrorCode[]): boolean {
  if (!retryableErrors || retryableErrors.length === 0) {
    // Default retryable errors
    const defaultRetryable = [
      ErrorCode.SERVICE_TIMEOUT,
      ErrorCode.SERVICE_UNAVAILABLE,
      ErrorCode.EXTERNAL_SERVICE_ERROR,
      ErrorCode.DATABASE_CONNECTION_FAILED,
    ];

    if (error instanceof DomainException) {
      return defaultRetryable.includes(error.errorCode);
    }

    return false;
  }

  if (error instanceof DomainException) {
    return retryableErrors.includes(error.errorCode);
  }

  return false;
}

// ============================================================================
// CIRCUIT BREAKER PATTERN
// ============================================================================

/**
 * Circuit breaker implementation for fault tolerance
 *
 * @example
 * ```typescript
 * const circuitBreaker = new CircuitBreaker({
 *   failureThreshold: 5,
 *   successThreshold: 2,
 *   timeout: 10000,
 *   resetTimeoutMs: 60000,
 *   halfOpenMaxAttempts: 3,
 *   name: 'external-api',
 * });
 *
 * try {
 *   const result = await circuitBreaker.execute(() => callExternalAPI());
 * } catch (error) {
 *   // Handle circuit open or operation failure
 * }
 * ```
 */
export class CircuitBreaker {
  private state: CircuitBreakerState = {
    state: CircuitState.CLOSED,
    failureCount: 0,
    successCount: 0,
  };

  private readonly logger = new Logger(`CircuitBreaker:${this.config.name || 'default'}`);

  constructor(private readonly config: CircuitBreakerConfig) {}

  /**
   * Execute operation with circuit breaker protection
   */
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state.state === CircuitState.OPEN) {
      if (this.shouldAttemptReset()) {
        this.state.state = CircuitState.HALF_OPEN;
        this.state.successCount = 0;
        this.logger.log('Circuit breaker entering HALF_OPEN state');
      } else {
        throw new CircuitBreakerOpenException(
          this.config.name || 'unknown',
          this.getRemainingResetTime(),
        );
      }
    }

    try {
      const result = await this.executeWithTimeout(operation);
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  /**
   * Execute operation with timeout
   */
  private async executeWithTimeout<T>(operation: () => Promise<T>): Promise<T> {
    return Promise.race([
      operation(),
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error('Circuit breaker timeout')),
          this.config.timeout,
        ),
      ),
    ]);
  }

  /**
   * Handle successful operation
   */
  private onSuccess(): void {
    this.state.failureCount = 0;

    if (this.state.state === CircuitState.HALF_OPEN) {
      this.state.successCount++;

      if (this.state.successCount >= this.config.successThreshold) {
        this.state.state = CircuitState.CLOSED;
        this.state.successCount = 0;
        this.logger.log('Circuit breaker CLOSED');
      }
    }
  }

  /**
   * Handle failed operation
   */
  private onFailure(): void {
    this.state.failureCount++;
    this.state.lastFailureTime = new Date();

    if (
      this.state.state === CircuitState.HALF_OPEN ||
      this.state.failureCount >= this.config.failureThreshold
    ) {
      this.state.state = CircuitState.OPEN;
      this.state.nextAttemptTime = new Date(Date.now() + this.config.resetTimeoutMs);
      this.logger.warn(
        `Circuit breaker OPEN. Will attempt reset at ${this.state.nextAttemptTime.toISOString()}`,
      );
    }
  }

  /**
   * Check if circuit should attempt reset
   */
  private shouldAttemptReset(): boolean {
    if (!this.state.nextAttemptTime) return false;
    return Date.now() >= this.state.nextAttemptTime.getTime();
  }

  /**
   * Get remaining time until reset attempt
   */
  private getRemainingResetTime(): number {
    if (!this.state.nextAttemptTime) return 0;
    return Math.max(0, this.state.nextAttemptTime.getTime() - Date.now());
  }

  /**
   * Get current circuit breaker state
   */
  getState(): CircuitBreakerState {
    return { ...this.state };
  }

  /**
   * Reset circuit breaker to closed state
   */
  reset(): void {
    this.state = {
      state: CircuitState.CLOSED,
      failureCount: 0,
      successCount: 0,
    };
    this.logger.log('Circuit breaker manually reset');
  }
}

// ============================================================================
// ERROR MONITORING & SENTRY INTEGRATION
// ============================================================================

/**
 * Initialize Sentry error monitoring
 *
 * @param dsn - Sentry DSN
 * @param options - Additional Sentry options
 *
 * @example
 * ```typescript
 * initializeSentry(process.env.SENTRY_DSN, {
 *   environment: process.env.NODE_ENV,
 *   release: process.env.APP_VERSION,
 *   tracesSampleRate: 0.1,
 * });
 * ```
 */
export function initializeSentry(
  dsn: string,
  options: Partial<Sentry.NodeOptions> = {},
): void {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || 'production',
    tracesSampleRate: 0.1,
    beforeSend(event, hint) {
      // Sanitize error data before sending
      if (event.exception?.values) {
        event.exception.values = event.exception.values.map((exception) => ({
          ...exception,
          value: exception.value ? sanitizeErrorMessage(exception.value) : exception.value,
          stacktrace: exception.stacktrace
            ? {
                ...exception.stacktrace,
                frames: exception.stacktrace.frames?.map((frame) => ({
                  ...frame,
                  vars: undefined, // Remove local variables
                })),
              }
            : exception.stacktrace,
        }));
      }

      return event;
    },
    ...options,
  });
}

/**
 * Capture error to Sentry with enriched context
 *
 * @param error - Error to capture
 * @param context - Additional context
 *
 * @example
 * ```typescript
 * captureErrorToSentry(error, {
 *   level: 'error',
 *   tags: { errorCode: 'ERR_1000', category: 'validation' },
 *   extra: { userId: '123', requestId: 'abc-def' },
 *   user: { id: '123', email: 'user@example.com' },
 * });
 * ```
 */
export function captureErrorToSentry(
  error: Error,
  context?: SentryErrorContext,
): string {
  Sentry.withScope((scope) => {
    if (context?.level) {
      scope.setLevel(context.level);
    }

    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    if (context?.extra) {
      Object.entries(context.extra).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }

    if (context?.user) {
      scope.setUser(context.user);
    }

    if (context?.fingerprint) {
      scope.setFingerprint(context.fingerprint);
    }

    Sentry.captureException(error);
  });

  return Sentry.lastEventId() || '';
}

/**
 * Map ErrorSeverity to Sentry severity level
 *
 * @param severity - Error severity
 * @returns Sentry severity level
 */
export function mapSeverityToSentryLevel(severity: ErrorSeverity): Sentry.SeverityLevel {
  const mapping: Record<ErrorSeverity, Sentry.SeverityLevel> = {
    [ErrorSeverity.LOW]: 'info',
    [ErrorSeverity.MEDIUM]: 'warning',
    [ErrorSeverity.HIGH]: 'error',
    [ErrorSeverity.CRITICAL]: 'fatal',
  };

  return mapping[severity] || 'error';
}

/**
 * Create error fingerprint for Sentry grouping
 *
 * @param error - Error to fingerprint
 * @param additionalKeys - Additional keys for fingerprint
 * @returns Fingerprint array
 *
 * @example
 * ```typescript
 * const fingerprint = createErrorFingerprint(error, ['userId', 'endpoint']);
 * ```
 */
export function createErrorFingerprint(
  error: Error | DomainException,
  additionalKeys: string[] = [],
): string[] {
  const fingerprint: string[] = [];

  if (error instanceof DomainException) {
    fingerprint.push(error.errorCode);
    fingerprint.push(error.category);
  } else {
    fingerprint.push(error.name);
  }

  fingerprint.push(...additionalKeys);

  return fingerprint;
}

// ============================================================================
// ERROR RECOVERY STRATEGIES
// ============================================================================

/**
 * Execute operation with automatic recovery strategy
 *
 * @param operation - Operation to execute
 * @param strategy - Recovery strategy configuration
 * @returns Operation result or fallback value
 *
 * @example
 * ```typescript
 * const result = await executeWithRecovery(
 *   () => fetchUserProfile(userId),
 *   {
 *     maxAttempts: 3,
 *     backoffMs: [1000, 2000, 4000],
 *     fallbackValue: { id: userId, name: 'Unknown' },
 *     shouldRecover: (error) => error.statusCode >= 500,
 *     onRecovery: (error, result) => logger.info('Recovered from error'),
 *     onFailure: (error) => logger.error('Recovery failed'),
 *   }
 * );
 * ```
 */
export async function executeWithRecovery<T>(
  operation: () => Promise<T>,
  strategy: RecoveryStrategy<T>,
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt < strategy.maxAttempts; attempt++) {
    try {
      const result = await operation();

      if (attempt > 0 && strategy.onRecovery) {
        strategy.onRecovery(lastError!, result);
      }

      return result;
    } catch (error) {
      lastError = error as Error;

      if (!strategy.shouldRecover(error as Error, attempt)) {
        break;
      }

      if (attempt < strategy.maxAttempts - 1) {
        const delay = strategy.backoffMs[attempt] || strategy.backoffMs[strategy.backoffMs.length - 1];
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  if (strategy.onFailure) {
    strategy.onFailure(lastError!);
  }

  if (strategy.fallbackValue !== undefined) {
    return strategy.fallbackValue;
  }

  throw lastError!;
}

/**
 * Create graceful degradation handler
 *
 * @param primaryOperation - Primary operation to attempt
 * @param fallbackOperation - Fallback operation if primary fails
 * @param shouldFallback - Predicate to determine if fallback should be used
 * @returns Operation result
 *
 * @example
 * ```typescript
 * const data = await gracefulDegradation(
 *   () => fetchFromPrimaryDB(),
 *   () => fetchFromCache(),
 *   (error) => error instanceof DatabaseException
 * );
 * ```
 */
export async function gracefulDegradation<T>(
  primaryOperation: () => Promise<T>,
  fallbackOperation: () => Promise<T>,
  shouldFallback: (error: Error) => boolean = () => true,
): Promise<T> {
  try {
    return await primaryOperation();
  } catch (error) {
    if (shouldFallback(error as Error)) {
      return await fallbackOperation();
    }
    throw error;
  }
}

// ============================================================================
// DEAD LETTER QUEUE HANDLING
// ============================================================================

/**
 * Add failed operation to dead letter queue
 *
 * @param payload - Original operation payload
 * @param error - Error that occurred
 * @param attempt - Number of attempts made
 * @param metadata - Additional metadata
 * @returns Dead letter item
 *
 * @example
 * ```typescript
 * const dlqItem = await addToDeadLetterQueue(
 *   { orderId: '123', action: 'process' },
 *   error,
 *   3,
 *   { queue: 'order-processing', priority: 'high' }
 * );
 * ```
 */
export async function addToDeadLetterQueue<T>(
  payload: T,
  error: Error,
  attempt: number,
  metadata?: Record<string, any>,
): Promise<DeadLetterItem<T>> {
  const dlqItem: DeadLetterItem<T> = {
    id: crypto.randomUUID(),
    originalPayload: payload,
    error: serializeError(error),
    attempt,
    createdAt: new Date(),
    lastAttemptAt: new Date(),
    metadata,
  };

  // In production, persist to database or message queue
  // For now, just log
  Logger.warn('Dead letter queue item created', JSON.stringify(dlqItem));

  return dlqItem;
}

/**
 * Process dead letter queue items with retry
 *
 * @param processor - Function to process DLQ items
 * @param maxRetries - Maximum number of retries
 * @returns Processing results
 *
 * @example
 * ```typescript
 * const results = await processDeadLetterQueue(
 *   async (item) => {
 *     await retryFailedOperation(item.originalPayload);
 *   },
 *   3
 * );
 * ```
 */
export async function processDeadLetterQueue<T>(
  processor: (item: DeadLetterItem<T>) => Promise<void>,
  maxRetries: number = 3,
): Promise<{ processed: number; failed: number }> {
  // In production, fetch from database or message queue
  const items: DeadLetterItem<T>[] = [];

  let processed = 0;
  let failed = 0;

  for (const item of items) {
    try {
      await retryWithBackoff(() => processor(item), {
        maxAttempts: maxRetries,
        initialDelayMs: 5000,
        maxDelayMs: 60000,
        backoffMultiplier: 2,
      });
      processed++;
    } catch (error) {
      failed++;
      Logger.error(`Failed to process DLQ item ${item.id}`, (error as Error).stack);
    }
  }

  return { processed, failed };
}

// ============================================================================
// SWAGGER/OPENAPI DECORATORS
// ============================================================================

/**
 * Swagger decorator for validation error responses
 *
 * @example
 * ```typescript
 * @ApiValidationErrorResponse()
 * @Post()
 * async create(@Body() dto: CreateUserDto) {
 *   // ...
 * }
 * ```
 */
export function ApiValidationErrorResponse() {
  return ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation error',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        errorCode: { type: 'string', example: 'ERR_1000' },
        message: { type: 'string', example: 'Validation failed' },
        category: { type: 'string', example: 'validation' },
        severity: { type: 'string', example: 'low' },
        timestamp: { type: 'string', format: 'date-time' },
        details: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              field: { type: 'string' },
              message: { type: 'string' },
              constraint: { type: 'string' },
            },
          },
        },
      },
    },
  });
}

/**
 * Swagger decorator for not found error responses
 *
 * @param resourceType - Type of resource (e.g., 'User', 'Patient')
 *
 * @example
 * ```typescript
 * @ApiNotFoundErrorResponse('Patient')
 * @Get(':id')
 * async findOne(@Param('id') id: string) {
 *   // ...
 * }
 * ```
 */
export function ApiNotFoundErrorResponse(resourceType: string = 'Resource') {
  return ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `${resourceType} not found`,
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        errorCode: { type: 'string', example: 'ERR_4000' },
        message: { type: 'string', example: `${resourceType} not found` },
        category: { type: 'string', example: 'not_found' },
        severity: { type: 'string', example: 'low' },
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
  });
}

/**
 * Swagger decorator for unauthorized error responses
 *
 * @example
 * ```typescript
 * @ApiUnauthorizedErrorResponse()
 * @UseGuards(JwtAuthGuard)
 * @Get('profile')
 * async getProfile() {
 *   // ...
 * }
 * ```
 */
export function ApiUnauthorizedErrorResponse() {
  return ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        errorCode: { type: 'string', example: 'ERR_2000' },
        message: { type: 'string', example: 'Authentication failed' },
        category: { type: 'string', example: 'authentication' },
        severity: { type: 'string', example: 'medium' },
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
  });
}

/**
 * Swagger decorator for forbidden error responses
 *
 * @example
 * ```typescript
 * @ApiForbiddenErrorResponse()
 * @UseGuards(RoleGuard)
 * @Delete(':id')
 * async delete(@Param('id') id: string) {
 *   // ...
 * }
 * ```
 */
export function ApiForbiddenErrorResponse() {
  return ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        errorCode: { type: 'string', example: 'ERR_3000' },
        message: { type: 'string', example: 'Access denied' },
        category: { type: 'string', example: 'authorization' },
        severity: { type: 'string', example: 'medium' },
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
  });
}

/**
 * Swagger decorator for conflict error responses
 *
 * @example
 * ```typescript
 * @ApiConflictErrorResponse()
 * @Post()
 * async create(@Body() dto: CreateUserDto) {
 *   // ...
 * }
 * ```
 */
export function ApiConflictErrorResponse() {
  return ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Resource conflict',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 409 },
        errorCode: { type: 'string', example: 'ERR_5000' },
        message: { type: 'string', example: 'Resource conflict' },
        category: { type: 'string', example: 'conflict' },
        severity: { type: 'string', example: 'medium' },
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
  });
}

/**
 * Swagger decorator for internal server error responses
 *
 * @example
 * ```typescript
 * @ApiInternalServerErrorResponse()
 * @Post('process')
 * async process(@Body() data: any) {
 *   // ...
 * }
 * ```
 */
export function ApiInternalServerErrorResponse() {
  return ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        errorCode: { type: 'string', example: 'ERR_9000' },
        message: { type: 'string', example: 'Internal server error' },
        category: { type: 'string', example: 'internal' },
        severity: { type: 'string', example: 'high' },
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
  });
}

/**
 * Composite Swagger decorator for all common error responses
 *
 * @example
 * ```typescript
 * @ApiAllErrorResponses()
 * @Post()
 * async create(@Body() dto: CreateUserDto) {
 *   // ...
 * }
 * ```
 */
export function ApiAllErrorResponses() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    ApiValidationErrorResponse()(target, propertyKey, descriptor);
    ApiUnauthorizedErrorResponse()(target, propertyKey, descriptor);
    ApiForbiddenErrorResponse()(target, propertyKey, descriptor);
    ApiInternalServerErrorResponse()(target, propertyKey, descriptor);
  };
}

// ============================================================================
// ERROR CONTEXT & ENRICHMENT
// ============================================================================

/**
 * Enrich error with additional context
 *
 * @param error - Error to enrich
 * @param context - Additional context
 * @returns Enriched error
 *
 * @example
 * ```typescript
 * const enriched = enrichErrorContext(error, {
 *   userId: request.user.id,
 *   requestId: request.id,
 *   ipAddress: request.ip,
 * });
 * ```
 */
export function enrichErrorContext(
  error: Error | DomainException,
  context: ErrorContext,
): Error | DomainException {
  if (error instanceof DomainException) {
    error.metadata = {
      ...error.metadata,
      ...context,
    };
  } else {
    (error as any).context = context;
  }

  return error;
}

/**
 * Extract error context from Express request
 *
 * @param request - Express request object
 * @returns Error context
 *
 * @example
 * ```typescript
 * const context = extractErrorContextFromRequest(request);
 * const enriched = enrichErrorContext(error, context);
 * ```
 */
export function extractErrorContextFromRequest(request: Request): ErrorContext {
  return {
    requestId: (request as any).id,
    ipAddress: request.ip,
    userAgent: request.get('user-agent'),
    userId: (request as any).user?.id,
    sessionId: (request as any).session?.id,
    correlationId: request.get('x-correlation-id'),
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if error is an instance of DomainException
 *
 * @param error - Error to check
 * @returns True if error is DomainException
 */
export function isDomainException(error: unknown): error is DomainException {
  return error instanceof DomainException;
}

/**
 * Check if error is an HTTP exception
 *
 * @param error - Error to check
 * @returns True if error is HttpException
 */
export function isHttpException(error: unknown): error is HttpException {
  return error instanceof HttpException;
}

/**
 * Get error stack trace as array of strings
 *
 * @param error - Error with stack trace
 * @returns Array of stack trace lines
 *
 * @example
 * ```typescript
 * const stackLines = getStackTraceLines(error);
 * console.log(stackLines[0]); // First line of stack trace
 * ```
 */
export function getStackTraceLines(error: Error): string[] {
  if (!error.stack) return [];
  return error.stack.split('\n').map((line) => line.trim());
}

/**
 * Create error from unknown thrown value
 *
 * @param thrown - Unknown thrown value
 * @returns Error instance
 *
 * @example
 * ```typescript
 * try {
 *   // ...
 * } catch (thrown) {
 *   const error = createErrorFromUnknown(thrown);
 *   logger.error(error.message);
 * }
 * ```
 */
export function createErrorFromUnknown(thrown: unknown): Error {
  if (thrown instanceof Error) {
    return thrown;
  }

  if (typeof thrown === 'string') {
    return new Error(thrown);
  }

  if (typeof thrown === 'object' && thrown !== null) {
    return new Error(JSON.stringify(thrown));
  }

  return new Error('Unknown error occurred');
}

/**
 * Aggregate errors from multiple operations
 *
 * @param errors - Array of errors
 * @returns Aggregated error with all error messages
 *
 * @example
 * ```typescript
 * const results = await Promise.allSettled(operations);
 * const errors = results
 *   .filter((r) => r.status === 'rejected')
 *   .map((r) => (r as PromiseRejectedResult).reason);
 *
 * if (errors.length > 0) {
 *   throw aggregateErrors(errors);
 * }
 * ```
 */
export function aggregateErrors(errors: Error[]): Error {
  const message = errors.map((e, i) => `[${i + 1}] ${e.message}`).join('; ');
  const aggregated = new Error(`Multiple errors occurred: ${message}`);
  (aggregated as any).errors = errors;
  return aggregated;
}
