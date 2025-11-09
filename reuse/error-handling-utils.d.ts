/**
 * LOC: ERR1234567
 * File: /reuse/error-handling-utils.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend services
 *   - API middleware
 *   - Frontend error handlers
 *   - NestJS exception filters
 */
/**
 * File: /reuse/error-handling-utils.ts
 * Locator: WC-UTL-ERR-003
 * Purpose: Error Handling Utilities - Comprehensive error management and recovery helpers
 *
 * Upstream: Independent utility module for error handling
 * Downstream: ../backend/*, ../frontend/*, Exception filters, Error middleware
 * Dependencies: TypeScript 5.x, Node 18+
 * Exports: 42 utility functions for error handling, custom errors, logging, recovery
 *
 * LLM Context: Comprehensive error handling utilities for White Cross system.
 * Provides custom error classes, error factories, serialization, stack trace parsing,
 * logging helpers, async wrappers, transformation, recovery strategies, aggregation,
 * retry helpers, graceful degradation, and monitoring integration. Essential for
 * robust healthcare application error management and debugging.
 */
interface ErrorContext {
    timestamp: string;
    userId?: string;
    requestId?: string;
    path?: string;
    method?: string;
    metadata?: Record<string, any>;
}
interface SerializedError {
    name: string;
    message: string;
    statusCode?: number;
    code?: string;
    stack?: string;
    context?: ErrorContext;
    details?: any;
}
interface RetryOptions {
    maxAttempts: number;
    delayMs: number;
    backoffMultiplier?: number;
    shouldRetry?: (error: Error) => boolean;
}
interface ErrorLogEntry {
    level: 'error' | 'warn' | 'info';
    message: string;
    error: SerializedError;
    context: ErrorContext;
    timestamp: string;
}
interface RecoveryStrategy {
    name: string;
    handler: (error: Error) => any;
    condition?: (error: Error) => boolean;
}
interface AggregatedError {
    errors: Error[];
    count: number;
    firstError: Error;
    lastError: Error;
}
/**
 * Base application error class with context support.
 *
 * @class ApplicationError
 * @extends Error
 *
 * @example
 * ```typescript
 * throw new ApplicationError('Invalid operation', { userId: '123' });
 * ```
 */
export declare class ApplicationError extends Error {
    readonly statusCode: number;
    readonly code: string;
    readonly context?: ErrorContext;
    constructor(message: string, statusCode?: number, code?: string, context?: ErrorContext);
}
/**
 * Validation error for input validation failures.
 *
 * @class ValidationError
 * @extends ApplicationError
 *
 * @example
 * ```typescript
 * throw new ValidationError('Invalid email format', { field: 'email', value: 'invalid' });
 * ```
 */
export declare class ValidationError extends ApplicationError {
    readonly validationErrors?: Record<string, string[]>;
    constructor(message: string, validationErrors?: Record<string, string[]>, context?: ErrorContext);
}
/**
 * Not found error for missing resources.
 *
 * @class NotFoundError
 * @extends ApplicationError
 *
 * @example
 * ```typescript
 * throw new NotFoundError('Student', '123');
 * ```
 */
export declare class NotFoundError extends ApplicationError {
    readonly resourceType: string;
    readonly resourceId: string;
    constructor(resourceType: string, resourceId: string, context?: ErrorContext);
}
/**
 * Unauthorized error for authentication failures.
 *
 * @class UnauthorizedError
 * @extends ApplicationError
 *
 * @example
 * ```typescript
 * throw new UnauthorizedError('Invalid credentials');
 * ```
 */
export declare class UnauthorizedError extends ApplicationError {
    constructor(message?: string, context?: ErrorContext);
}
/**
 * Forbidden error for authorization failures.
 *
 * @class ForbiddenError
 * @extends ApplicationError
 *
 * @example
 * ```typescript
 * throw new ForbiddenError('Insufficient permissions');
 * ```
 */
export declare class ForbiddenError extends ApplicationError {
    constructor(message?: string, requiredPermission?: string, context?: ErrorContext);
}
/**
 * Conflict error for resource conflicts.
 *
 * @class ConflictError
 * @extends ApplicationError
 *
 * @example
 * ```typescript
 * throw new ConflictError('Email already exists');
 * ```
 */
export declare class ConflictError extends ApplicationError {
    constructor(message: string, context?: ErrorContext);
}
/**
 * Database error for database operation failures.
 *
 * @class DatabaseError
 * @extends ApplicationError
 *
 * @example
 * ```typescript
 * throw new DatabaseError('Connection failed', originalError);
 * ```
 */
export declare class DatabaseError extends ApplicationError {
    readonly originalError?: Error;
    constructor(message: string, originalError?: Error, context?: ErrorContext);
}
/**
 * External service error for third-party API failures.
 *
 * @class ExternalServiceError
 * @extends ApplicationError
 *
 * @example
 * ```typescript
 * throw new ExternalServiceError('PaymentGateway', 'Payment processing failed');
 * ```
 */
export declare class ExternalServiceError extends ApplicationError {
    readonly serviceName: string;
    constructor(serviceName: string, message: string, context?: ErrorContext);
}
/**
 * Creates a validation error from validation result.
 *
 * @param {Record<string, string[]>} errors - Validation errors by field
 * @param {ErrorContext} [context] - Error context
 * @returns {ValidationError} Validation error instance
 *
 * @example
 * ```typescript
 * const error = createValidationError({
 *   email: ['Invalid format', 'Required'],
 *   age: ['Must be positive']
 * });
 * ```
 */
export declare const createValidationError: (errors: Record<string, string[]>, context?: ErrorContext) => ValidationError;
/**
 * Creates a not found error for a resource.
 *
 * @param {string} resourceType - Type of resource
 * @param {string} resourceId - Resource identifier
 * @param {ErrorContext} [context] - Error context
 * @returns {NotFoundError} Not found error instance
 *
 * @example
 * ```typescript
 * const error = createNotFoundError('Student', '123');
 * ```
 */
export declare const createNotFoundError: (resourceType: string, resourceId: string, context?: ErrorContext) => NotFoundError;
/**
 * Creates an error from HTTP status code.
 *
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {ErrorContext} [context] - Error context
 * @returns {ApplicationError} Appropriate error instance
 *
 * @example
 * ```typescript
 * const error = createErrorFromStatus(404, 'Resource not found');
 * ```
 */
export declare const createErrorFromStatus: (statusCode: number, message: string, context?: ErrorContext) => ApplicationError;
/**
 * Wraps an unknown error into ApplicationError.
 *
 * @param {unknown} error - Error to wrap
 * @param {ErrorContext} [context] - Error context
 * @returns {ApplicationError} Application error instance
 *
 * @example
 * ```typescript
 * try {
 *   // some operation
 * } catch (err) {
 *   throw wrapError(err);
 * }
 * ```
 */
export declare const wrapError: (error: unknown, context?: ErrorContext) => ApplicationError;
/**
 * Serializes an error to a plain object.
 *
 * @param {Error} error - Error to serialize
 * @param {boolean} [includeStack] - Include stack trace (default: false)
 * @returns {SerializedError} Serialized error object
 *
 * @example
 * ```typescript
 * const serialized = serializeError(new ValidationError('Invalid input'), true);
 * // { name: 'ValidationError', message: 'Invalid input', stack: '...' }
 * ```
 */
export declare const serializeError: (error: Error, includeStack?: boolean) => SerializedError;
/**
 * Deserializes a plain object to an error instance.
 *
 * @param {SerializedError} serialized - Serialized error object
 * @returns {Error} Error instance
 *
 * @example
 * ```typescript
 * const error = deserializeError({ name: 'ValidationError', message: 'Invalid' });
 * ```
 */
export declare const deserializeError: (serialized: SerializedError) => Error;
/**
 * Converts error to JSON-safe object for API responses.
 *
 * @param {Error} error - Error to convert
 * @param {boolean} [includeStack] - Include stack in development
 * @returns {object} JSON-safe error object
 *
 * @example
 * ```typescript
 * const json = errorToJson(new NotFoundError('Student', '123'));
 * // { statusCode: 404, message: 'Student with ID 123 not found', code: 'NOT_FOUND' }
 * ```
 */
export declare const errorToJson: (error: Error, includeStack?: boolean) => object;
/**
 * Parses error stack trace into structured frames.
 *
 * @param {Error} error - Error with stack trace
 * @returns {Array<object>} Parsed stack frames
 *
 * @example
 * ```typescript
 * const frames = parseStackTrace(new Error('test'));
 * // [{ function: 'main', file: 'app.ts', line: 10, column: 5 }]
 * ```
 */
export declare const parseStackTrace: (error: Error) => Array<object>;
/**
 * Gets the top N frames from error stack.
 *
 * @param {Error} error - Error with stack trace
 * @param {number} [count] - Number of frames to return (default: 5)
 * @returns {string[]} Top stack frames
 *
 * @example
 * ```typescript
 * const topFrames = getTopStackFrames(error, 3);
 * ```
 */
export declare const getTopStackFrames: (error: Error, count?: number) => string[];
/**
 * Cleans stack trace by removing internal frames.
 *
 * @param {Error} error - Error to clean
 * @param {string[]} [excludePatterns] - Patterns to exclude
 * @returns {string} Cleaned stack trace
 *
 * @example
 * ```typescript
 * const cleaned = cleanStackTrace(error, ['node_modules', 'internal']);
 * ```
 */
export declare const cleanStackTrace: (error: Error, excludePatterns?: string[]) => string;
/**
 * Creates a standardized error log entry.
 *
 * @param {Error} error - Error to log
 * @param {ErrorContext} context - Error context
 * @param {'error' | 'warn' | 'info'} [level] - Log level (default: 'error')
 * @returns {ErrorLogEntry} Log entry object
 *
 * @example
 * ```typescript
 * const logEntry = createErrorLogEntry(error, { userId: '123' });
 * ```
 */
export declare const createErrorLogEntry: (error: Error, context: ErrorContext, level?: "error" | "warn" | "info") => ErrorLogEntry;
/**
 * Logs error to console with formatting.
 *
 * @param {Error} error - Error to log
 * @param {ErrorContext} [context] - Error context
 * @returns {void}
 *
 * @example
 * ```typescript
 * logError(new ValidationError('Invalid input'), { userId: '123' });
 * ```
 */
export declare const logError: (error: Error, context?: ErrorContext) => void;
/**
 * Logs error with structured JSON format.
 *
 * @param {Error} error - Error to log
 * @param {ErrorContext} [context] - Error context
 * @returns {void}
 *
 * @example
 * ```typescript
 * logErrorJson(error, { requestId: 'req-123' });
 * ```
 */
export declare const logErrorJson: (error: Error, context?: ErrorContext) => void;
/**
 * Sets up global unhandled rejection handler.
 *
 * @param {(error: Error) => void} [handler] - Custom handler
 * @returns {void}
 *
 * @example
 * ```typescript
 * setupUnhandledRejectionHandler((error) => {
 *   console.error('Unhandled rejection:', error);
 * });
 * ```
 */
export declare const setupUnhandledRejectionHandler: (handler?: (error: Error) => void) => void;
/**
 * Sets up global uncaught exception handler.
 *
 * @param {(error: Error) => void} [handler] - Custom handler
 * @returns {void}
 *
 * @example
 * ```typescript
 * setupUncaughtExceptionHandler((error) => {
 *   console.error('Uncaught exception:', error);
 *   process.exit(1);
 * });
 * ```
 */
export declare const setupUncaughtExceptionHandler: (handler?: (error: Error) => void) => void;
/**
 * Wraps an async function to catch and handle errors.
 *
 * @template T
 * @param {(...args: any[]) => Promise<T>} fn - Async function to wrap
 * @param {(error: Error) => void} [errorHandler] - Error handler
 * @returns {(...args: any[]) => Promise<T | undefined>} Wrapped function
 *
 * @example
 * ```typescript
 * const safeFn = catchAsync(async (id: string) => {
 *   return await fetchUser(id);
 * });
 * ```
 */
export declare const catchAsync: <T>(fn: (...args: any[]) => Promise<T>, errorHandler?: (error: Error) => void) => ((...args: any[]) => Promise<T | undefined>);
/**
 * Wraps a promise to return [error, data] tuple.
 *
 * @template T
 * @param {Promise<T>} promise - Promise to wrap
 * @returns {Promise<[Error | null, T | undefined]>} Tuple of [error, data]
 *
 * @example
 * ```typescript
 * const [error, user] = await to(fetchUser('123'));
 * if (error) {
 *   console.error('Failed to fetch user:', error);
 * }
 * ```
 */
export declare const to: <T>(promise: Promise<T>) => Promise<[Error | null, T | undefined]>;
/**
 * Creates a safe version of an async function that never throws.
 *
 * @template T
 * @param {(...args: any[]) => Promise<T>} fn - Async function
 * @returns {(...args: any[]) => Promise<[Error | null, T | undefined]>} Safe function
 *
 * @example
 * ```typescript
 * const safeFetchUser = makeSafe(fetchUser);
 * const [error, user] = await safeFetchUser('123');
 * ```
 */
export declare const makeSafe: <T>(fn: (...args: any[]) => Promise<T>) => ((...args: any[]) => Promise<[Error | null, T | undefined]>);
/**
 * Transforms error to a user-friendly message.
 *
 * @param {Error} error - Error to transform
 * @returns {string} User-friendly message
 *
 * @example
 * ```typescript
 * const message = transformErrorToMessage(new ValidationError('Invalid email'));
 * // Returns: 'Please check your input and try again.'
 * ```
 */
export declare const transformErrorToMessage: (error: Error) => string;
/**
 * Redacts sensitive information from error messages.
 *
 * @param {Error} error - Error to redact
 * @param {string[]} [patterns] - Patterns to redact
 * @returns {Error} Redacted error
 *
 * @example
 * ```typescript
 * const redacted = redactSensitiveInfo(error, ['password', 'token', 'ssn']);
 * ```
 */
export declare const redactSensitiveInfo: (error: Error, patterns?: string[]) => Error;
/**
 * Executes function with fallback on error.
 *
 * @template T
 * @param {() => Promise<T>} fn - Primary function
 * @param {() => Promise<T>} fallback - Fallback function
 * @returns {Promise<T>} Result from primary or fallback
 *
 * @example
 * ```typescript
 * const data = await withFallback(
 *   () => fetchFromPrimary(),
 *   () => fetchFromCache()
 * );
 * ```
 */
export declare const withFallback: <T>(fn: () => Promise<T>, fallback: () => Promise<T>) => Promise<T>;
/**
 * Executes function with multiple recovery strategies.
 *
 * @template T
 * @param {() => Promise<T>} fn - Function to execute
 * @param {RecoveryStrategy[]} strategies - Recovery strategies
 * @returns {Promise<T>} Result from function or recovery
 *
 * @example
 * ```typescript
 * const result = await withRecovery(
 *   () => fetchData(),
 *   [
 *     { name: 'cache', handler: () => getFromCache() },
 *     { name: 'default', handler: () => getDefaultValue() }
 *   ]
 * );
 * ```
 */
export declare const withRecovery: <T>(fn: () => Promise<T>, strategies: RecoveryStrategy[]) => Promise<T>;
/**
 * Aggregates multiple errors into a single error object.
 *
 * @param {Error[]} errors - Errors to aggregate
 * @returns {AggregatedError} Aggregated error object
 *
 * @example
 * ```typescript
 * const aggregated = aggregateErrors([error1, error2, error3]);
 * console.log(`${aggregated.count} errors occurred`);
 * ```
 */
export declare const aggregateErrors: (errors: Error[]) => AggregatedError;
/**
 * Creates a combined error message from multiple errors.
 *
 * @param {Error[]} errors - Errors to combine
 * @param {string} [separator] - Separator between messages (default: '; ')
 * @returns {string} Combined error message
 *
 * @example
 * ```typescript
 * const message = combineErrorMessages([error1, error2]);
 * // Returns: 'Error 1; Error 2'
 * ```
 */
export declare const combineErrorMessages: (errors: Error[], separator?: string) => string;
/**
 * Retries a function on error with exponential backoff.
 *
 * @template T
 * @param {() => Promise<T>} fn - Function to retry
 * @param {RetryOptions} options - Retry options
 * @returns {Promise<T>} Result of successful execution
 *
 * @example
 * ```typescript
 * const data = await retryOnError(
 *   () => fetchData(),
 *   { maxAttempts: 3, delayMs: 1000, backoffMultiplier: 2 }
 * );
 * ```
 */
export declare const retryOnError: <T>(fn: () => Promise<T>, options: RetryOptions) => Promise<T>;
/**
 * Creates retry options with defaults.
 *
 * @param {Partial<RetryOptions>} [overrides] - Options to override
 * @returns {RetryOptions} Complete retry options
 *
 * @example
 * ```typescript
 * const options = createRetryOptions({ maxAttempts: 5 });
 * ```
 */
export declare const createRetryOptions: (overrides?: Partial<RetryOptions>) => RetryOptions;
/**
 * Executes function with graceful degradation on error.
 *
 * @template T
 * @param {() => Promise<T>} fn - Function to execute
 * @param {T} defaultValue - Default value on error
 * @param {(error: Error) => void} [onError] - Error callback
 * @returns {Promise<T>} Result or default value
 *
 * @example
 * ```typescript
 * const user = await withGracefulDegradation(
 *   () => fetchUser('123'),
 *   { id: '123', name: 'Guest' }
 * );
 * ```
 */
export declare const withGracefulDegradation: <T>(fn: () => Promise<T>, defaultValue: T, onError?: (error: Error) => void) => Promise<T>;
/**
 * Creates a circuit breaker for error handling.
 *
 * @param {number} failureThreshold - Number of failures before opening
 * @param {number} resetTimeoutMs - Time before attempting reset
 * @returns {object} Circuit breaker with execute method
 *
 * @example
 * ```typescript
 * const breaker = createCircuitBreaker(5, 60000);
 * const result = await breaker.execute(() => fetchData());
 * ```
 */
export declare const createCircuitBreaker: (failureThreshold: number, resetTimeoutMs: number) => {
    execute: <T>(fn: () => Promise<T>) => Promise<T>;
    getState: () => "closed" | "open" | "half-open";
    reset: () => void;
};
/**
 * Sends error to monitoring service (supports Sentry, Datadog, or custom integrations).
 *
 * @param {Error} error - Error to report
 * @param {ErrorContext} context - Error context
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await reportErrorToMonitoring(error, { userId: '123', requestId: 'req-456' });
 * ```
 */
export declare const reportErrorToMonitoring: (error: Error, context: ErrorContext) => Promise<void>;
/**
 * Creates a NestJS exception filter for custom errors.
 *
 * @param {boolean} [includeStack] - Include stack trace in response
 * @returns {object} NestJS exception filter
 *
 * @example
 * ```typescript
 * const filter = createNestJsExceptionFilter(false);
 * app.useGlobalFilters(filter);
 * ```
 */
export declare const createNestJsExceptionFilter: (includeStack?: boolean) => {
    catch(exception: Error, host: any): void;
};
/**
 * Checks if an error is operational (safe to expose to client).
 *
 * @param {Error} error - Error to check
 * @returns {boolean} True if operational error
 *
 * @example
 * ```typescript
 * if (isOperationalError(error)) {
 *   res.status(error.statusCode).json(errorToJson(error));
 * }
 * ```
 */
export declare const isOperationalError: (error: Error) => boolean;
/**
 * Groups errors by error type.
 *
 * @param {Error[]} errors - Errors to group
 * @returns {Map<string, Error[]>} Errors grouped by type
 *
 * @example
 * ```typescript
 * const grouped = groupErrorsByType([error1, error2, error3]);
 * grouped.get('ValidationError'); // [validationError1, validationError2]
 * ```
 */
export declare const groupErrorsByType: (errors: Error[]) => Map<string, Error[]>;
/**
 * Creates error from validation schema (Joi, Yup, etc.).
 *
 * @param {any} validationResult - Validation result object
 * @returns {ValidationError} Validation error
 *
 * @example
 * ```typescript
 * const error = createErrorFromValidation(joiResult);
 * throw error;
 * ```
 */
export declare const createErrorFromValidation: (validationResult: any) => ValidationError;
/**
 * Creates timeout error for async operations.
 *
 * @param {string} operation - Operation that timed out
 * @param {number} timeoutMs - Timeout duration in milliseconds
 * @returns {ApplicationError} Timeout error
 *
 * @example
 * ```typescript
 * throw createTimeoutError('fetchData', 5000);
 * ```
 */
export declare const createTimeoutError: (operation: string, timeoutMs: number) => ApplicationError;
declare const _default: {
    ApplicationError: typeof ApplicationError;
    ValidationError: typeof ValidationError;
    NotFoundError: typeof NotFoundError;
    UnauthorizedError: typeof UnauthorizedError;
    ForbiddenError: typeof ForbiddenError;
    ConflictError: typeof ConflictError;
    DatabaseError: typeof DatabaseError;
    ExternalServiceError: typeof ExternalServiceError;
    createValidationError: (errors: Record<string, string[]>, context?: ErrorContext) => ValidationError;
    createNotFoundError: (resourceType: string, resourceId: string, context?: ErrorContext) => NotFoundError;
    createErrorFromStatus: (statusCode: number, message: string, context?: ErrorContext) => ApplicationError;
    wrapError: (error: unknown, context?: ErrorContext) => ApplicationError;
    serializeError: (error: Error, includeStack?: boolean) => SerializedError;
    deserializeError: (serialized: SerializedError) => Error;
    errorToJson: (error: Error, includeStack?: boolean) => object;
    parseStackTrace: (error: Error) => Array<object>;
    getTopStackFrames: (error: Error, count?: number) => string[];
    cleanStackTrace: (error: Error, excludePatterns?: string[]) => string;
    createErrorLogEntry: (error: Error, context: ErrorContext, level?: "error" | "warn" | "info") => ErrorLogEntry;
    logError: (error: Error, context?: ErrorContext) => void;
    logErrorJson: (error: Error, context?: ErrorContext) => void;
    setupUnhandledRejectionHandler: (handler?: (error: Error) => void) => void;
    setupUncaughtExceptionHandler: (handler?: (error: Error) => void) => void;
    catchAsync: <T>(fn: (...args: any[]) => Promise<T>, errorHandler?: (error: Error) => void) => ((...args: any[]) => Promise<T | undefined>);
    to: <T>(promise: Promise<T>) => Promise<[Error | null, T | undefined]>;
    makeSafe: <T>(fn: (...args: any[]) => Promise<T>) => ((...args: any[]) => Promise<[Error | null, T | undefined]>);
    transformErrorToMessage: (error: Error) => string;
    redactSensitiveInfo: (error: Error, patterns?: string[]) => Error;
    withFallback: <T>(fn: () => Promise<T>, fallback: () => Promise<T>) => Promise<T>;
    withRecovery: <T>(fn: () => Promise<T>, strategies: RecoveryStrategy[]) => Promise<T>;
    aggregateErrors: (errors: Error[]) => AggregatedError;
    combineErrorMessages: (errors: Error[], separator?: string) => string;
    retryOnError: <T>(fn: () => Promise<T>, options: RetryOptions) => Promise<T>;
    createRetryOptions: (overrides?: Partial<RetryOptions>) => RetryOptions;
    withGracefulDegradation: <T>(fn: () => Promise<T>, defaultValue: T, onError?: (error: Error) => void) => Promise<T>;
    createCircuitBreaker: (failureThreshold: number, resetTimeoutMs: number) => {
        execute: <T>(fn: () => Promise<T>) => Promise<T>;
        getState: () => "closed" | "open" | "half-open";
        reset: () => void;
    };
    reportErrorToMonitoring: (error: Error, context: ErrorContext) => Promise<void>;
    createNestJsExceptionFilter: (includeStack?: boolean) => {
        catch(exception: Error, host: any): void;
    };
    isOperationalError: (error: Error) => boolean;
    groupErrorsByType: (errors: Error[]) => Map<string, Error[]>;
    createErrorFromValidation: (validationResult: any) => ValidationError;
    createTimeoutError: (operation: string, timeoutMs: number) => ApplicationError;
};
export default _default;
//# sourceMappingURL=error-handling-utils.d.ts.map