/**
 * LOC: ERRHDL1234567
 * File: /reuse/error-handling-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS exception filters
 *   - Backend error handlers
 *   - API controllers and services
 */
/**
 * File: /reuse/error-handling-kit.ts
 * Locator: WC-UTL-ERRHDL-001
 * Purpose: Comprehensive Error Handling Utilities - custom exceptions, filters, transformations, retry strategies, circuit breakers
 *
 * Upstream: Independent utility module for error handling implementation
 * Downstream: ../backend/*, API controllers, services, middleware, exception filters
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 40+ utility functions for error handling, retry strategies, circuit breakers, error logging, notifications
 *
 * LLM Context: Comprehensive error handling utilities for production-ready NestJS applications.
 * Provides custom exception classes, global filters, error transformation, HTTP responses, validation formatting,
 * database error handling, retry strategies, circuit breakers, error aggregation, notifications (Sentry/Bugsnag),
 * user-friendly messages, code standardization, stack trace sanitization, context enrichment, and graceful degradation.
 */
import { Request, Response } from 'express';
import { Sequelize } from 'sequelize';
interface ErrorContext {
    requestId?: string;
    userId?: string;
    timestamp?: string;
    path?: string;
    method?: string;
    userAgent?: string;
    ip?: string;
    metadata?: Record<string, any>;
}
interface ErrorResponse {
    code: string;
    message: string;
    statusCode: number;
    timestamp: string;
    traceId?: string;
    path?: string;
    details?: any[];
    stack?: string;
    context?: ErrorContext;
}
interface ValidationErrorDetail {
    field: string;
    value: any;
    constraint: string;
    message: string;
}
interface RetryOptions {
    maxAttempts: number;
    initialDelay: number;
    maxDelay: number;
    backoffMultiplier: number;
    retryableErrors?: string[];
    onRetry?: (error: Error, attempt: number) => void;
}
interface CircuitBreakerConfig {
    failureThreshold: number;
    resetTimeout: number;
    monitoringPeriod: number;
    halfOpenRequests?: number;
}
interface CircuitBreakerState {
    status: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
    failureCount: number;
    successCount: number;
    lastFailureTime?: number;
    nextAttemptTime?: number;
}
interface ErrorAggregation {
    errorCode: string;
    count: number;
    firstOccurrence: string;
    lastOccurrence: string;
    affectedUsers: Set<string>;
    contexts: ErrorContext[];
}
interface NotificationConfig {
    provider: 'sentry' | 'bugsnag' | 'custom';
    dsn?: string;
    apiKey?: string;
    environment?: string;
    release?: string;
    enabled: boolean;
    sampleRate?: number;
}
interface ErrorCodeMapping {
    internal: string;
    http: number;
    userMessage: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: string;
}
interface SanitizationOptions {
    includeStack: boolean;
    includeSensitiveData: boolean;
    maxStackFrames?: number;
    allowedPaths?: string[];
}
interface DegradationStrategy {
    feature: string;
    fallback: () => Promise<any>;
    timeout: number;
    enabled: boolean;
}
interface DatabaseErrorInfo {
    type: 'connection' | 'validation' | 'constraint' | 'query' | 'transaction' | 'timeout';
    originalError: Error;
    query?: string;
    table?: string;
    constraint?: string;
    fields?: string[];
}
/**
 * Sequelize model for Error Logs with context, stack traces, and categorization.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ErrorLog model
 *
 * @example
 * ```typescript
 * const ErrorLog = createErrorLogModel(sequelize);
 * const log = await ErrorLog.create({
 *   errorCode: 'USR_001',
 *   message: 'User not found',
 *   statusCode: 404,
 *   stack: error.stack,
 *   context: { userId: '123', path: '/api/users/456' }
 * });
 * ```
 */
export declare const createErrorLogModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        errorCode: string;
        message: string;
        statusCode: number;
        severity: string;
        category: string;
        stack: string | null;
        context: ErrorContext;
        userId: string | null;
        requestId: string | null;
        path: string | null;
        method: string | null;
        userAgent: string | null;
        ip: string | null;
        resolved: boolean;
        resolvedAt: Date | null;
        resolvedBy: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Error Reports with aggregation and trend analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ErrorReport model
 *
 * @example
 * ```typescript
 * const ErrorReport = createErrorReportModel(sequelize);
 * const report = await ErrorReport.create({
 *   errorCode: 'DB_001',
 *   occurrenceCount: 15,
 *   affectedUserCount: 8,
 *   firstOccurrence: new Date(),
 *   lastOccurrence: new Date(),
 *   trend: 'increasing'
 * });
 * ```
 */
export declare const createErrorReportModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        errorCode: string;
        errorCategory: string;
        occurrenceCount: number;
        affectedUserCount: number;
        firstOccurrence: Date;
        lastOccurrence: Date;
        averageSeverity: string;
        trend: string;
        topPaths: string[];
        topUserAgents: string[];
        resolutionStatus: string;
        assignedTo: string | null;
        notes: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Base application exception class with error code and context support.
 *
 * @param {string} message - Error message
 * @param {string} code - Error code
 * @param {number} statusCode - HTTP status code
 * @param {ErrorContext} [context] - Additional context
 * @returns {AppException} Custom exception instance
 *
 * @example
 * ```typescript
 * throw new AppException(
 *   'Resource not found',
 *   'RES_NOT_FOUND',
 *   404,
 *   { userId: '123', resourceId: '456' }
 * );
 * ```
 */
export declare class AppException extends Error {
    readonly code: string;
    readonly statusCode: number;
    readonly context?: ErrorContext | undefined;
    readonly severity: 'low' | 'medium' | 'high' | 'critical';
    constructor(message: string, code: string, statusCode: number, context?: ErrorContext | undefined, severity?: 'low' | 'medium' | 'high' | 'critical');
}
/**
 * Business logic validation exception for domain rule violations.
 *
 * @param {string} message - Validation error message
 * @param {ValidationErrorDetail[]} details - Validation error details
 * @param {ErrorContext} [context] - Additional context
 * @returns {BusinessValidationException} Validation exception instance
 *
 * @example
 * ```typescript
 * throw new BusinessValidationException(
 *   'Invalid order total',
 *   [{ field: 'total', value: -10, constraint: 'min', message: 'Total must be positive' }],
 *   { orderId: '789' }
 * );
 * ```
 */
export declare class BusinessValidationException extends AppException {
    readonly details: ValidationErrorDetail[];
    constructor(message: string, details: ValidationErrorDetail[], context?: ErrorContext);
}
/**
 * External service integration exception for third-party API failures.
 *
 * @param {string} service - Service name that failed
 * @param {string} message - Error message
 * @param {Error} [originalError] - Original error from service
 * @param {ErrorContext} [context] - Additional context
 * @returns {ExternalServiceException} Service exception instance
 *
 * @example
 * ```typescript
 * throw new ExternalServiceException(
 *   'PaymentGateway',
 *   'Payment processing failed',
 *   originalError,
 *   { transactionId: 'tx_123' }
 * );
 * ```
 */
export declare class ExternalServiceException extends AppException {
    readonly service: string;
    readonly originalError?: Error | undefined;
    constructor(service: string, message: string, originalError?: Error | undefined, context?: ErrorContext);
}
/**
 * Resource conflict exception for concurrent modification issues.
 *
 * @param {string} resource - Resource type
 * @param {string} resourceId - Resource identifier
 * @param {string} message - Conflict description
 * @param {ErrorContext} [context] - Additional context
 * @returns {ResourceConflictException} Conflict exception instance
 *
 * @example
 * ```typescript
 * throw new ResourceConflictException(
 *   'Order',
 *   'ord_456',
 *   'Order has been modified by another user',
 *   { version: 2, expectedVersion: 1 }
 * );
 * ```
 */
export declare class ResourceConflictException extends AppException {
    readonly resource: string;
    readonly resourceId: string;
    constructor(resource: string, resourceId: string, message: string, context?: ErrorContext);
}
/**
 * Rate limit exceeded exception for throttling scenarios.
 *
 * @param {string} message - Rate limit message
 * @param {number} retryAfter - Seconds until retry allowed
 * @param {ErrorContext} [context] - Additional context
 * @returns {RateLimitException} Rate limit exception instance
 *
 * @example
 * ```typescript
 * throw new RateLimitException(
 *   'Too many requests',
 *   60,
 *   { limit: 100, window: '1 minute' }
 * );
 * ```
 */
export declare class RateLimitException extends AppException {
    readonly retryAfter: number;
    constructor(message: string, retryAfter: number, context?: ErrorContext);
}
/**
 * Database operation exception for database-specific errors.
 *
 * @param {string} operation - Database operation type
 * @param {string} message - Error message
 * @param {Error} [originalError] - Original database error
 * @param {ErrorContext} [context] - Additional context
 * @returns {DatabaseException} Database exception instance
 *
 * @example
 * ```typescript
 * throw new DatabaseException(
 *   'INSERT',
 *   'Unique constraint violation',
 *   dbError,
 *   { table: 'users', field: 'email' }
 * );
 * ```
 */
export declare class DatabaseException extends AppException {
    readonly operation: string;
    readonly originalError?: Error | undefined;
    constructor(operation: string, message: string, originalError?: Error | undefined, context?: ErrorContext);
}
/**
 * Creates a global exception filter for NestJS applications.
 *
 * @param {Function} logger - Logging function
 * @param {boolean} includeStack - Whether to include stack traces
 * @returns {Function} Exception filter function
 *
 * @example
 * ```typescript
 * const filter = createGlobalExceptionFilter(console.error, false);
 * app.useGlobalFilters(new HttpExceptionFilter(filter));
 * ```
 */
export declare const createGlobalExceptionFilter: (logger: (message: string, context?: any) => void, includeStack?: boolean) => (exception: Error, req: Request, res: Response) => void;
/**
 * Transforms any error type into a standardized error response.
 *
 * @param {Error} error - Error to transform
 * @param {Request} [req] - Express request object
 * @param {boolean} [includeStack=false] - Whether to include stack trace
 * @returns {ErrorResponse} Standardized error response
 *
 * @example
 * ```typescript
 * const response = transformErrorToResponse(error, req, true);
 * // Returns standardized error with code, message, statusCode, etc.
 * ```
 */
export declare const transformErrorToResponse: (error: Error, req?: Request, includeStack?: boolean) => ErrorResponse;
/**
 * Filters errors by severity level for conditional handling.
 *
 * @param {Error} error - Error to check
 * @param {string[]} severityLevels - Allowed severity levels
 * @returns {boolean} Whether error matches severity criteria
 *
 * @example
 * ```typescript
 * if (filterBySeverity(error, ['high', 'critical'])) {
 *   await sendUrgentAlert(error);
 * }
 * ```
 */
export declare const filterBySeverity: (error: Error, severityLevels: Array<"low" | "medium" | "high" | "critical">) => boolean;
/**
 * Creates error response middleware for Express/NestJS.
 *
 * @param {SanitizationOptions} options - Sanitization options
 * @returns {Function} Middleware function
 *
 * @example
 * ```typescript
 * const middleware = createErrorResponseMiddleware({
 *   includeStack: false,
 *   includeSensitiveData: false,
 *   maxStackFrames: 10
 * });
 * app.use(middleware);
 * ```
 */
export declare const createErrorResponseMiddleware: (options: SanitizationOptions) => (err: Error, req: Request, res: Response, next: any) => void;
/**
 * Maps internal error codes to standardized HTTP status codes and messages.
 *
 * @param {string} errorCode - Internal error code
 * @param {Map<string, ErrorCodeMapping>} mappings - Code mapping configuration
 * @returns {ErrorCodeMapping} Mapped error information
 *
 * @example
 * ```typescript
 * const mapping = mapErrorCode('USR_NOT_FOUND', errorMappings);
 * // Returns: { internal: 'USR_NOT_FOUND', http: 404, userMessage: 'User not found', ... }
 * ```
 */
export declare const mapErrorCode: (errorCode: string, mappings: Map<string, ErrorCodeMapping>) => ErrorCodeMapping;
/**
 * Creates default error code mappings for common scenarios.
 *
 * @returns {Map<string, ErrorCodeMapping>} Default error mappings
 *
 * @example
 * ```typescript
 * const mappings = createDefaultErrorMappings();
 * const mapping = mappings.get('AUTH_FAILED');
 * ```
 */
export declare const createDefaultErrorMappings: () => Map<string, ErrorCodeMapping>;
/**
 * Transforms database errors into application-specific exceptions.
 *
 * @param {Error} dbError - Database error
 * @returns {AppException} Transformed application exception
 *
 * @example
 * ```typescript
 * try {
 *   await User.create({ email: 'duplicate@test.com' });
 * } catch (error) {
 *   throw transformDatabaseError(error);
 * }
 * ```
 */
export declare const transformDatabaseError: (dbError: Error) => AppException;
/**
 * Enriches error with additional context from request and application state.
 *
 * @param {Error} error - Error to enrich
 * @param {Request} req - Express request object
 * @param {Record<string, any>} [additionalContext] - Additional context data
 * @returns {Error} Enriched error with context
 *
 * @example
 * ```typescript
 * const enrichedError = enrichErrorContext(error, req, {
 *   tenantId: 'tenant_123',
 *   operation: 'CREATE_ORDER'
 * });
 * ```
 */
export declare const enrichErrorContext: (error: Error, req: Request, additionalContext?: Record<string, any>) => Error;
/**
 * Chains multiple error transformers for complex error handling pipelines.
 *
 * @param {Error} error - Error to transform
 * @param {Function[]} transformers - Array of transformer functions
 * @returns {Error} Transformed error
 *
 * @example
 * ```typescript
 * const error = chainErrorTransformers(originalError, [
 *   transformDatabaseError,
 *   (e) => enrichErrorContext(e, req),
 *   sanitizeError
 * ]);
 * ```
 */
export declare const chainErrorTransformers: (error: Error, transformers: Array<(error: Error) => Error>) => Error;
/**
 * Creates standardized HTTP error response object.
 *
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {string} [code] - Error code
 * @param {any} [details] - Additional details
 * @returns {ErrorResponse} HTTP error response
 *
 * @example
 * ```typescript
 * const response = createHttpErrorResponse(404, 'User not found', 'USR_NOT_FOUND');
 * res.status(404).json(response);
 * ```
 */
export declare const createHttpErrorResponse: (statusCode: number, message: string, code?: string, details?: any) => ErrorResponse;
/**
 * Formats validation errors into user-friendly HTTP response.
 *
 * @param {ValidationErrorDetail[]} errors - Validation errors
 * @returns {ErrorResponse} Formatted validation error response
 *
 * @example
 * ```typescript
 * const response = formatValidationErrors([
 *   { field: 'email', value: 'invalid', constraint: 'email', message: 'Invalid email format' }
 * ]);
 * ```
 */
export declare const formatValidationErrors: (errors: ValidationErrorDetail[]) => ErrorResponse;
/**
 * Sends JSON error response with proper headers and formatting.
 *
 * @param {Response} res - Express response object
 * @param {ErrorResponse} errorResponse - Error response object
 * @returns {void}
 *
 * @example
 * ```typescript
 * sendJsonErrorResponse(res, {
 *   code: 'AUTH_FAILED',
 *   message: 'Invalid credentials',
 *   statusCode: 401,
 *   timestamp: new Date().toISOString()
 * });
 * ```
 */
export declare const sendJsonErrorResponse: (res: Response, errorResponse: ErrorResponse) => void;
/**
 * Creates problem details response following RFC 7807 standard.
 *
 * @param {Error} error - Error object
 * @param {Request} req - Express request object
 * @returns {object} RFC 7807 problem details
 *
 * @example
 * ```typescript
 * const problemDetails = createProblemDetails(error, req);
 * res.status(problemDetails.status).json(problemDetails);
 * ```
 */
export declare const createProblemDetails: (error: Error, req: Request) => object;
/**
 * Parses Sequelize error into structured database error information.
 *
 * @param {Error} error - Sequelize error
 * @returns {DatabaseErrorInfo} Parsed error information
 *
 * @example
 * ```typescript
 * const dbError = parseSequelizeError(error);
 * if (dbError.type === 'constraint') {
 *   console.log('Constraint violation on:', dbError.constraint);
 * }
 * ```
 */
export declare const parseSequelizeError: (error: Error) => DatabaseErrorInfo;
/**
 * Handles database connection errors with retry logic.
 *
 * @param {Error} error - Connection error
 * @param {Function} reconnectFn - Reconnection function
 * @param {RetryOptions} options - Retry configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await handleDatabaseConnectionError(error, () => sequelize.authenticate(), {
 *   maxAttempts: 3,
 *   initialDelay: 1000,
 *   maxDelay: 10000,
 *   backoffMultiplier: 2
 * });
 * ```
 */
export declare const handleDatabaseConnectionError: (error: Error, reconnectFn: () => Promise<void>, options: RetryOptions) => Promise<void>;
/**
 * Extracts constraint name and affected columns from database error.
 *
 * @param {Error} error - Database error
 * @returns {{ constraint: string | null; columns: string[] }} Constraint info
 *
 * @example
 * ```typescript
 * const { constraint, columns } = extractConstraintInfo(error);
 * console.log(`Constraint ${constraint} violated on columns:`, columns);
 * ```
 */
export declare const extractConstraintInfo: (error: Error) => {
    constraint: string | null;
    columns: string[];
};
/**
 * Creates user-friendly message from database error for end users.
 *
 * @param {Error} error - Database error
 * @returns {string} User-friendly error message
 *
 * @example
 * ```typescript
 * const message = createUserFriendlyDbError(error);
 * // Returns: "This email address is already registered"
 * ```
 */
export declare const createUserFriendlyDbError: (error: Error) => string;
/**
 * Logs database error with query details for debugging.
 *
 * @param {Error} error - Database error
 * @param {string} [query] - SQL query that caused error
 * @param {any[]} [params] - Query parameters
 * @returns {void}
 *
 * @example
 * ```typescript
 * logDatabaseError(error, 'SELECT * FROM users WHERE id = ?', [userId]);
 * ```
 */
export declare const logDatabaseError: (error: Error, query?: string, params?: any[]) => void;
/**
 * Retries a function with exponential backoff strategy.
 *
 * @param {Function} fn - Function to retry
 * @param {RetryOptions} options - Retry configuration
 * @returns {Promise<T>} Result of successful execution
 *
 * @example
 * ```typescript
 * const result = await retryWithBackoff(
 *   () => fetchUserData(userId),
 *   { maxAttempts: 3, initialDelay: 1000, maxDelay: 10000, backoffMultiplier: 2 }
 * );
 * ```
 */
export declare const retryWithBackoff: <T>(fn: () => Promise<T>, options: RetryOptions) => Promise<T>;
/**
 * Creates retry decorator for class methods.
 *
 * @param {RetryOptions} options - Retry configuration
 * @returns {Function} Method decorator
 *
 * @example
 * ```typescript
 * class UserService {
 *   @Retry({ maxAttempts: 3, initialDelay: 1000 })
 *   async fetchUser(id: string) {
 *     return await api.getUser(id);
 *   }
 * }
 * ```
 */
export declare const Retry: (options: RetryOptions) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
/**
 * Determines if an error is retryable based on error type and configuration.
 *
 * @param {Error} error - Error to check
 * @param {string[]} [retryableErrors] - List of retryable error codes
 * @returns {boolean} Whether error is retryable
 *
 * @example
 * ```typescript
 * if (isRetryableError(error, ['TIMEOUT', 'SERVICE_UNAVAILABLE'])) {
 *   await retry(() => operation());
 * }
 * ```
 */
export declare const isRetryableError: (error: Error, retryableErrors?: string[]) => boolean;
/**
 * Creates jittered delay to prevent thundering herd problem.
 *
 * @param {number} baseDelay - Base delay in milliseconds
 * @param {number} [jitterFactor=0.1] - Jitter factor (0-1)
 * @returns {number} Jittered delay
 *
 * @example
 * ```typescript
 * const delay = createJitteredDelay(1000, 0.2);
 * await sleep(delay); // 800-1200ms random delay
 * ```
 */
export declare const createJitteredDelay: (baseDelay: number, jitterFactor?: number) => number;
/**
 * Creates a circuit breaker for protecting against cascading failures.
 *
 * @param {CircuitBreakerConfig} config - Circuit breaker configuration
 * @returns {object} Circuit breaker instance with execute method
 *
 * @example
 * ```typescript
 * const breaker = createCircuitBreaker({
 *   failureThreshold: 5,
 *   resetTimeout: 60000,
 *   monitoringPeriod: 10000
 * });
 * const result = await breaker.execute(() => callExternalAPI());
 * ```
 */
export declare const createCircuitBreaker: (config: CircuitBreakerConfig) => {
    execute: <T>(fn: () => Promise<T>) => Promise<T>;
    getState: () => {
        status: "CLOSED" | "OPEN" | "HALF_OPEN";
        failureCount: number;
        successCount: number;
        lastFailureTime?: number;
        nextAttemptTime?: number;
    };
    reset: () => void;
};
/**
 * Gets current state of circuit breaker.
 *
 * @param {object} breaker - Circuit breaker instance
 * @returns {CircuitBreakerState} Current state
 *
 * @example
 * ```typescript
 * const state = getCircuitBreakerState(breaker);
 * if (state.status === 'OPEN') {
 *   console.log('Circuit is open, requests will fail');
 * }
 * ```
 */
export declare const getCircuitBreakerState: (breaker: {
    getState: () => CircuitBreakerState;
}) => CircuitBreakerState;
/**
 * Resets circuit breaker to initial closed state.
 *
 * @param {object} breaker - Circuit breaker instance
 * @returns {void}
 *
 * @example
 * ```typescript
 * resetCircuitBreaker(breaker);
 * // Circuit is now closed and ready to accept requests
 * ```
 */
export declare const resetCircuitBreaker: (breaker: {
    reset: () => void;
}) => void;
/**
 * Creates circuit breaker decorator for class methods.
 *
 * @param {CircuitBreakerConfig} config - Circuit breaker configuration
 * @returns {Function} Method decorator
 *
 * @example
 * ```typescript
 * class PaymentService {
 *   @CircuitBreaker({ failureThreshold: 5, resetTimeout: 60000 })
 *   async processPayment(orderId: string) {
 *     return await paymentGateway.charge(orderId);
 *   }
 * }
 * ```
 */
export declare const CircuitBreaker: (config: CircuitBreakerConfig) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
/**
 * Aggregates errors by error code for trend analysis.
 *
 * @param {Error[]} errors - Array of errors
 * @returns {Map<string, ErrorAggregation>} Aggregated errors by code
 *
 * @example
 * ```typescript
 * const aggregation = aggregateErrorsByCode(errors);
 * aggregation.forEach((stats, code) => {
 *   console.log(`${code}: ${stats.count} occurrences`);
 * });
 * ```
 */
export declare const aggregateErrorsByCode: (errors: Error[]) => Map<string, ErrorAggregation>;
/**
 * Groups errors by time window for spike detection.
 *
 * @param {Error[]} errors - Array of errors with timestamps
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Map<string, Error[]>} Errors grouped by time window
 *
 * @example
 * ```typescript
 * const groups = groupErrorsByTimeWindow(errors, 60000); // 1 minute windows
 * ```
 */
export declare const groupErrorsByTimeWindow: (errors: Array<Error & {
    timestamp?: Date;
}>, windowMs: number) => Map<string, Error[]>;
/**
 * Detects error spikes based on historical baseline.
 *
 * @param {Map<string, Error[]>} timeWindows - Errors grouped by time
 * @param {number} thresholdMultiplier - Spike threshold multiplier
 * @returns {Array<{ window: string; count: number; isSpike: boolean }>} Spike detection results
 *
 * @example
 * ```typescript
 * const spikes = detectErrorSpikes(timeWindows, 2.5);
 * spikes.filter(s => s.isSpike).forEach(spike => {
 *   console.log(`Spike detected in window ${spike.window}: ${spike.count} errors`);
 * });
 * ```
 */
export declare const detectErrorSpikes: (timeWindows: Map<string, Error[]>, thresholdMultiplier?: number) => Array<{
    window: string;
    count: number;
    isSpike: boolean;
}>;
/**
 * Sends error notification to configured provider (Sentry, Bugsnag, etc.).
 *
 * @param {Error} error - Error to notify
 * @param {NotificationConfig} config - Notification configuration
 * @param {ErrorContext} [context] - Additional context
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await notifyError(error, {
 *   provider: 'sentry',
 *   dsn: 'https://key@sentry.io/project',
 *   environment: 'production',
 *   enabled: true
 * });
 * ```
 */
export declare const notifyError: (error: Error, config: NotificationConfig, context?: ErrorContext) => Promise<void>;
/**
 * Converts technical error into user-friendly message.
 *
 * @param {Error} error - Technical error
 * @param {Map<string, string>} [customMessages] - Custom message mappings
 * @returns {string} User-friendly error message
 *
 * @example
 * ```typescript
 * const message = createUserFriendlyMessage(error);
 * // Returns: "We're having trouble connecting. Please try again."
 * ```
 */
export declare const createUserFriendlyMessage: (error: Error, customMessages?: Map<string, string>) => string;
/**
 * Translates error messages to different languages.
 *
 * @param {Error} error - Error to translate
 * @param {string} locale - Target locale (e.g., 'en', 'es', 'fr')
 * @param {Map<string, Map<string, string>>} translations - Translation mappings
 * @returns {string} Translated error message
 *
 * @example
 * ```typescript
 * const message = translateErrorMessage(error, 'es', translations);
 * // Returns: "No se encontró el usuario"
 * ```
 */
export declare const translateErrorMessage: (error: Error, locale: string, translations: Map<string, Map<string, string>>) => string;
/**
 * Sanitizes stack trace to remove sensitive information.
 *
 * @param {string} stack - Stack trace string
 * @param {SanitizationOptions} options - Sanitization options
 * @returns {string} Sanitized stack trace
 *
 * @example
 * ```typescript
 * const sanitized = sanitizeStackTrace(error.stack, {
 *   includeStack: true,
 *   maxStackFrames: 10,
 *   allowedPaths: ['/app/src']
 * });
 * ```
 */
export declare const sanitizeStackTrace: (stack: string | undefined, options: SanitizationOptions) => string;
/**
 * Removes sensitive data from error objects before logging.
 *
 * @param {Error} error - Error to sanitize
 * @param {string[]} sensitiveFields - Fields to remove
 * @returns {Error} Sanitized error
 *
 * @example
 * ```typescript
 * const sanitized = removeSensitiveData(error, ['password', 'apiKey', 'token']);
 * ```
 */
export declare const removeSensitiveData: (error: Error, sensitiveFields: string[]) => Error;
/**
 * Extracts error context from Express request object.
 *
 * @param {Request} req - Express request object
 * @returns {ErrorContext} Extracted context
 *
 * @example
 * ```typescript
 * const context = extractErrorContext(req);
 * // Returns: { requestId, userId, path, method, userAgent, ip, ... }
 * ```
 */
export declare const extractErrorContext: (req: Request) => ErrorContext;
/**
 * Adds request correlation ID to error for distributed tracing.
 *
 * @param {Error} error - Error to enrich
 * @param {string} correlationId - Correlation/trace ID
 * @returns {Error} Error with correlation ID
 *
 * @example
 * ```typescript
 * const enriched = addCorrelationId(error, req.headers['x-correlation-id']);
 * ```
 */
export declare const addCorrelationId: (error: Error, correlationId: string) => Error;
/**
 * Executes function with fallback on error.
 *
 * @param {Function} fn - Primary function to execute
 * @param {Function} fallback - Fallback function on error
 * @returns {Promise<T>} Result from primary or fallback
 *
 * @example
 * ```typescript
 * const data = await executeWithFallback(
 *   () => fetchFromCache(key),
 *   () => fetchFromDatabase(key)
 * );
 * ```
 */
export declare const executeWithFallback: <T>(fn: () => Promise<T>, fallback: () => Promise<T>) => Promise<T>;
/**
 * Creates degraded service response when feature is unavailable.
 *
 * @param {string} feature - Feature name
 * @param {any} [partialData] - Partial data if available
 * @returns {object} Degraded response
 *
 * @example
 * ```typescript
 * return createDegradedResponse('recommendations', { default: ['item1', 'item2'] });
 * ```
 */
export declare const createDegradedResponse: (feature: string, partialData?: any) => object;
/**
 * Implements graceful degradation strategy for a feature.
 *
 * @param {DegradationStrategy} strategy - Degradation strategy configuration
 * @returns {Promise<any>} Result or fallback
 *
 * @example
 * ```typescript
 * const result = await implementGracefulDegradation({
 *   feature: 'UserRecommendations',
 *   fallback: () => getDefaultRecommendations(),
 *   timeout: 3000,
 *   enabled: true
 * });
 * ```
 */
export declare const implementGracefulDegradation: (strategy: DegradationStrategy) => Promise<any>;
/**
 * Generates a unique trace ID for request tracking.
 */
export declare const generateTraceId: () => string;
/**
 * Default export with all utilities.
 */
declare const _default: {
    createErrorLogModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            errorCode: string;
            message: string;
            statusCode: number;
            severity: string;
            category: string;
            stack: string | null;
            context: ErrorContext;
            userId: string | null;
            requestId: string | null;
            path: string | null;
            method: string | null;
            userAgent: string | null;
            ip: string | null;
            resolved: boolean;
            resolvedAt: Date | null;
            resolvedBy: string | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createErrorReportModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            errorCode: string;
            errorCategory: string;
            occurrenceCount: number;
            affectedUserCount: number;
            firstOccurrence: Date;
            lastOccurrence: Date;
            averageSeverity: string;
            trend: string;
            topPaths: string[];
            topUserAgents: string[];
            resolutionStatus: string;
            assignedTo: string | null;
            notes: string | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    AppException: typeof AppException;
    BusinessValidationException: typeof BusinessValidationException;
    ExternalServiceException: typeof ExternalServiceException;
    ResourceConflictException: typeof ResourceConflictException;
    RateLimitException: typeof RateLimitException;
    DatabaseException: typeof DatabaseException;
    createGlobalExceptionFilter: (logger: (message: string, context?: any) => void, includeStack?: boolean) => (exception: Error, req: Request, res: Response) => void;
    transformErrorToResponse: (error: Error, req?: Request, includeStack?: boolean) => ErrorResponse;
    filterBySeverity: (error: Error, severityLevels: Array<"low" | "medium" | "high" | "critical">) => boolean;
    createErrorResponseMiddleware: (options: SanitizationOptions) => (err: Error, req: Request, res: Response, next: any) => void;
    mapErrorCode: (errorCode: string, mappings: Map<string, ErrorCodeMapping>) => ErrorCodeMapping;
    createDefaultErrorMappings: () => Map<string, ErrorCodeMapping>;
    transformDatabaseError: (dbError: Error) => AppException;
    enrichErrorContext: (error: Error, req: Request, additionalContext?: Record<string, any>) => Error;
    chainErrorTransformers: (error: Error, transformers: Array<(error: Error) => Error>) => Error;
    createHttpErrorResponse: (statusCode: number, message: string, code?: string, details?: any) => ErrorResponse;
    formatValidationErrors: (errors: ValidationErrorDetail[]) => ErrorResponse;
    sendJsonErrorResponse: (res: Response, errorResponse: ErrorResponse) => void;
    createProblemDetails: (error: Error, req: Request) => object;
    parseSequelizeError: (error: Error) => DatabaseErrorInfo;
    handleDatabaseConnectionError: (error: Error, reconnectFn: () => Promise<void>, options: RetryOptions) => Promise<void>;
    extractConstraintInfo: (error: Error) => {
        constraint: string | null;
        columns: string[];
    };
    createUserFriendlyDbError: (error: Error) => string;
    logDatabaseError: (error: Error, query?: string, params?: any[]) => void;
    retryWithBackoff: <T>(fn: () => Promise<T>, options: RetryOptions) => Promise<T>;
    Retry: (options: RetryOptions) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
    isRetryableError: (error: Error, retryableErrors?: string[]) => boolean;
    createJitteredDelay: (baseDelay: number, jitterFactor?: number) => number;
    createCircuitBreaker: (config: CircuitBreakerConfig) => {
        execute: <T>(fn: () => Promise<T>) => Promise<T>;
        getState: () => {
            status: "CLOSED" | "OPEN" | "HALF_OPEN";
            failureCount: number;
            successCount: number;
            lastFailureTime?: number;
            nextAttemptTime?: number;
        };
        reset: () => void;
    };
    getCircuitBreakerState: (breaker: {
        getState: () => CircuitBreakerState;
    }) => CircuitBreakerState;
    resetCircuitBreaker: (breaker: {
        reset: () => void;
    }) => void;
    CircuitBreaker: (config: CircuitBreakerConfig) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
    aggregateErrorsByCode: (errors: Error[]) => Map<string, ErrorAggregation>;
    groupErrorsByTimeWindow: (errors: Array<Error & {
        timestamp?: Date;
    }>, windowMs: number) => Map<string, Error[]>;
    detectErrorSpikes: (timeWindows: Map<string, Error[]>, thresholdMultiplier?: number) => Array<{
        window: string;
        count: number;
        isSpike: boolean;
    }>;
    notifyError: (error: Error, config: NotificationConfig, context?: ErrorContext) => Promise<void>;
    createUserFriendlyMessage: (error: Error, customMessages?: Map<string, string>) => string;
    translateErrorMessage: (error: Error, locale: string, translations: Map<string, Map<string, string>>) => string;
    sanitizeStackTrace: (stack: string | undefined, options: SanitizationOptions) => string;
    removeSensitiveData: (error: Error, sensitiveFields: string[]) => Error;
    extractErrorContext: (req: Request) => ErrorContext;
    addCorrelationId: (error: Error, correlationId: string) => Error;
    executeWithFallback: <T>(fn: () => Promise<T>, fallback: () => Promise<T>) => Promise<T>;
    createDegradedResponse: (feature: string, partialData?: any) => object;
    implementGracefulDegradation: (strategy: DegradationStrategy) => Promise<any>;
    generateTraceId: () => string;
};
export default _default;
//# sourceMappingURL=error-handling-kit.d.ts.map