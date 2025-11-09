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
import { ExceptionFilter, ArgumentsHost, HttpException, BadRequestException, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ZodError } from 'zod';
import * as Sentry from '@sentry/node';
import { ValidationError as SequelizeValidationError, DatabaseError } from 'sequelize';
/**
 * Error severity levels
 */
export declare enum ErrorSeverity {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical"
}
/**
 * Error categories for classification
 */
export declare enum ErrorCategory {
    VALIDATION = "validation",
    AUTHENTICATION = "authentication",
    AUTHORIZATION = "authorization",
    NOT_FOUND = "not_found",
    CONFLICT = "conflict",
    RATE_LIMIT = "rate_limit",
    DATABASE = "database",
    EXTERNAL_SERVICE = "external_service",
    INTERNAL = "internal",
    NETWORK = "network",
    TIMEOUT = "timeout",
    BUSINESS_LOGIC = "business_logic",
    CONFIGURATION = "configuration"
}
/**
 * Error codes for standardized error handling
 */
export declare enum ErrorCode {
    VALIDATION_FAILED = "ERR_1000",
    INVALID_INPUT = "ERR_1001",
    MISSING_REQUIRED_FIELD = "ERR_1002",
    INVALID_FORMAT = "ERR_1003",
    INVALID_TYPE = "ERR_1004",
    AUTHENTICATION_FAILED = "ERR_2000",
    INVALID_CREDENTIALS = "ERR_2001",
    TOKEN_EXPIRED = "ERR_2002",
    TOKEN_INVALID = "ERR_2003",
    SESSION_EXPIRED = "ERR_2004",
    MFA_REQUIRED = "ERR_2005",
    FORBIDDEN = "ERR_3000",
    INSUFFICIENT_PERMISSIONS = "ERR_3001",
    ACCESS_DENIED = "ERR_3002",
    RESOURCE_FORBIDDEN = "ERR_3003",
    RESOURCE_NOT_FOUND = "ERR_4000",
    USER_NOT_FOUND = "ERR_4001",
    PATIENT_NOT_FOUND = "ERR_4002",
    APPOINTMENT_NOT_FOUND = "ERR_4003",
    RESOURCE_CONFLICT = "ERR_5000",
    DUPLICATE_ENTRY = "ERR_5001",
    VERSION_CONFLICT = "ERR_5002",
    STATE_CONFLICT = "ERR_5003",
    RATE_LIMIT_EXCEEDED = "ERR_6000",
    TOO_MANY_REQUESTS = "ERR_6001",
    QUOTA_EXCEEDED = "ERR_6002",
    DATABASE_ERROR = "ERR_7000",
    DATABASE_CONNECTION_FAILED = "ERR_7001",
    QUERY_FAILED = "ERR_7002",
    TRANSACTION_FAILED = "ERR_7003",
    CONSTRAINT_VIOLATION = "ERR_7004",
    FOREIGN_KEY_VIOLATION = "ERR_7005",
    EXTERNAL_SERVICE_ERROR = "ERR_8000",
    SERVICE_UNAVAILABLE = "ERR_8001",
    SERVICE_TIMEOUT = "ERR_8002",
    INTEGRATION_FAILED = "ERR_8003",
    INTERNAL_SERVER_ERROR = "ERR_9000",
    UNHANDLED_ERROR = "ERR_9001",
    CONFIGURATION_ERROR = "ERR_9002",
    NOT_IMPLEMENTED = "ERR_9003",
    BUSINESS_RULE_VIOLATION = "ERR_10000",
    INVALID_STATE_TRANSITION = "ERR_10001",
    OPERATION_NOT_ALLOWED = "ERR_10002",
    PRECONDITION_FAILED = "ERR_10003"
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
    stack?: string;
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
export declare enum CircuitState {
    CLOSED = "closed",
    OPEN = "open",
    HALF_OPEN = "half_open"
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
/**
 * Error response schema
 */
export declare const ErrorResponseSchema: any;
/**
 * Retry configuration schema
 */
export declare const RetryConfigSchema: any;
/**
 * Circuit breaker configuration schema
 */
export declare const CircuitBreakerConfigSchema: any;
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
export declare class DomainException extends HttpException {
    readonly errorCode: ErrorCode;
    readonly category: ErrorCategory;
    readonly statusCode: number;
    readonly metadata?: Record<string, any> | undefined;
    readonly severity: ErrorSeverity;
    constructor(message: string, errorCode: ErrorCode, category: ErrorCategory, statusCode?: number, metadata?: Record<string, any> | undefined, severity?: ErrorSeverity);
}
/**
 * Validation exception for input validation failures
 */
export declare class ValidationException extends DomainException {
    readonly details: ErrorDetail[];
    constructor(message: string, details?: ErrorDetail[], metadata?: Record<string, any>);
}
/**
 * Business rule violation exception
 */
export declare class BusinessRuleException extends DomainException {
    readonly rule: string;
    constructor(message: string, rule: string, metadata?: Record<string, any>);
}
/**
 * External service exception for third-party API failures
 */
export declare class ExternalServiceException extends DomainException {
    readonly serviceName: string;
    readonly originalError?: Error | undefined;
    constructor(message: string, serviceName: string, originalError?: Error | undefined, metadata?: Record<string, any>);
}
/**
 * Database exception for database operation failures
 */
export declare class DatabaseException extends DomainException {
    readonly operation: string;
    readonly originalError?: Error | undefined;
    constructor(message: string, operation: string, originalError?: Error | undefined, metadata?: Record<string, any>);
}
/**
 * Resource not found exception
 */
export declare class ResourceNotFoundException extends DomainException {
    constructor(resourceType: string, resourceId: string, metadata?: Record<string, any>);
}
/**
 * Conflict exception for resource conflicts
 */
export declare class ResourceConflictException extends DomainException {
    readonly conflictType: string;
    constructor(message: string, conflictType: string, metadata?: Record<string, any>);
}
/**
 * Rate limit exceeded exception
 */
export declare class RateLimitException extends DomainException {
    readonly limit: number;
    readonly windowMs: number;
    readonly retryAfterMs?: number | undefined;
    constructor(message: string, limit: number, windowMs: number, retryAfterMs?: number | undefined, metadata?: Record<string, any>);
}
/**
 * Circuit breaker open exception
 */
export declare class CircuitBreakerOpenException extends DomainException {
    readonly resetTimeMs: number;
    constructor(serviceName: string, resetTimeMs: number, metadata?: Record<string, any>);
}
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
export declare function serializeError(error: Error | HttpException | DomainException, request?: Request, includeStack?: boolean): ErrorResponse;
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
export declare function formatZodErrors(zodError: ZodError): ErrorDetail[];
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
export declare function formatSequelizeErrors(sequelizeError: SequelizeValidationError): ErrorDetail[];
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
export declare function sanitizeStackTrace(stack: string | undefined, sensitivePatterns?: RegExp[]): string;
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
export declare function sanitizeErrorMessage(message: string): string;
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
export declare function createUserFriendlyMessage(error: Error | DomainException, userFacingMessages?: Partial<Record<ErrorCode, string>>): string;
/**
 * Map HTTP status code to ErrorCode
 *
 * @param statusCode - HTTP status code
 * @returns Corresponding ErrorCode
 */
export declare function mapHttpStatusToErrorCode(statusCode: number): ErrorCode;
/**
 * Map HTTP status code to ErrorCategory
 *
 * @param statusCode - HTTP status code
 * @returns Corresponding ErrorCategory
 */
export declare function mapHttpStatusToCategory(statusCode: number): ErrorCategory;
/**
 * Map HTTP status code to ErrorSeverity
 *
 * @param statusCode - HTTP status code
 * @returns Corresponding ErrorSeverity
 */
export declare function mapHttpStatusToSeverity(statusCode: number): ErrorSeverity;
/**
 * Global exception filter for all HTTP exceptions
 *
 * @example
 * ```typescript
 * // In main.ts
 * app.useGlobalFilters(new GlobalExceptionFilter());
 * ```
 */
export declare class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger;
    catch(exception: Error, host: ArgumentsHost): void;
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
export declare class ValidationExceptionFilter implements ExceptionFilter {
    catch(exception: ValidationException | BadRequestException, host: ArgumentsHost): void;
}
/**
 * Database exception filter for handling Sequelize errors
 *
 * @example
 * ```typescript
 * app.useGlobalFilters(new DatabaseExceptionFilter());
 * ```
 */
export declare class DatabaseExceptionFilter implements ExceptionFilter {
    private readonly logger;
    catch(exception: DatabaseError, host: ArgumentsHost): void;
}
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
export declare class ErrorLoggingInterceptor implements NestInterceptor {
    private readonly logger;
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
/**
 * Error transformation interceptor to convert errors to domain exceptions
 *
 * @example
 * ```typescript
 * app.useGlobalInterceptors(new ErrorTransformationInterceptor());
 * ```
 */
export declare class ErrorTransformationInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
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
export declare class TimeoutInterceptor implements NestInterceptor {
    private readonly timeoutMs;
    constructor(timeoutMs?: number);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
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
export declare function calculateBackoffDelay(attempt: number, config: Partial<RetryConfig>): number;
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
export declare function retryWithBackoff<T>(operation: () => Promise<T>, config: RetryConfig): Promise<T>;
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
export declare function retryWithBackoffOperator<T>(config: RetryConfig): (source: Observable<T>) => any;
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
export declare function isRetryableError(error: Error, retryableErrors?: ErrorCode[]): boolean;
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
export declare class CircuitBreaker {
    private readonly config;
    private state;
    private readonly logger;
    constructor(config: CircuitBreakerConfig);
    /**
     * Execute operation with circuit breaker protection
     */
    execute<T>(operation: () => Promise<T>): Promise<T>;
    /**
     * Execute operation with timeout
     */
    private executeWithTimeout;
    /**
     * Handle successful operation
     */
    private onSuccess;
    /**
     * Handle failed operation
     */
    private onFailure;
    /**
     * Check if circuit should attempt reset
     */
    private shouldAttemptReset;
    /**
     * Get remaining time until reset attempt
     */
    private getRemainingResetTime;
    /**
     * Get current circuit breaker state
     */
    getState(): CircuitBreakerState;
    /**
     * Reset circuit breaker to closed state
     */
    reset(): void;
}
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
export declare function initializeSentry(dsn: string, options?: Partial<Sentry.NodeOptions>): void;
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
export declare function captureErrorToSentry(error: Error, context?: SentryErrorContext): string;
/**
 * Map ErrorSeverity to Sentry severity level
 *
 * @param severity - Error severity
 * @returns Sentry severity level
 */
export declare function mapSeverityToSentryLevel(severity: ErrorSeverity): Sentry.SeverityLevel;
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
export declare function createErrorFingerprint(error: Error | DomainException, additionalKeys?: string[]): string[];
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
export declare function executeWithRecovery<T>(operation: () => Promise<T>, strategy: RecoveryStrategy<T>): Promise<T>;
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
export declare function gracefulDegradation<T>(primaryOperation: () => Promise<T>, fallbackOperation: () => Promise<T>, shouldFallback?: (error: Error) => boolean): Promise<T>;
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
export declare function addToDeadLetterQueue<T>(payload: T, error: Error, attempt: number, metadata?: Record<string, any>): Promise<DeadLetterItem<T>>;
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
export declare function processDeadLetterQueue<T>(processor: (item: DeadLetterItem<T>) => Promise<void>, maxRetries?: number): Promise<{
    processed: number;
    failed: number;
}>;
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
export declare function ApiValidationErrorResponse(): any;
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
export declare function ApiNotFoundErrorResponse(resourceType?: string): any;
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
export declare function ApiUnauthorizedErrorResponse(): any;
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
export declare function ApiForbiddenErrorResponse(): any;
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
export declare function ApiConflictErrorResponse(): any;
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
export declare function ApiInternalServerErrorResponse(): any;
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
export declare function ApiAllErrorResponses(): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
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
export declare function enrichErrorContext(error: Error | DomainException, context: ErrorContext): Error | DomainException;
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
export declare function extractErrorContextFromRequest(request: Request): ErrorContext;
/**
 * Check if error is an instance of DomainException
 *
 * @param error - Error to check
 * @returns True if error is DomainException
 */
export declare function isDomainException(error: unknown): error is DomainException;
/**
 * Check if error is an HTTP exception
 *
 * @param error - Error to check
 * @returns True if error is HttpException
 */
export declare function isHttpException(error: unknown): error is HttpException;
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
export declare function getStackTraceLines(error: Error): string[];
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
export declare function createErrorFromUnknown(thrown: unknown): Error;
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
export declare function aggregateErrors(errors: Error[]): Error;
//# sourceMappingURL=error-handling-kit.prod.d.ts.map