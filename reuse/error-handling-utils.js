"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTimeoutError = exports.createErrorFromValidation = exports.groupErrorsByType = exports.isOperationalError = exports.createNestJsExceptionFilter = exports.reportErrorToMonitoring = exports.createCircuitBreaker = exports.withGracefulDegradation = exports.createRetryOptions = exports.retryOnError = exports.combineErrorMessages = exports.aggregateErrors = exports.withRecovery = exports.withFallback = exports.redactSensitiveInfo = exports.transformErrorToMessage = exports.makeSafe = exports.to = exports.catchAsync = exports.setupUncaughtExceptionHandler = exports.setupUnhandledRejectionHandler = exports.logErrorJson = exports.logError = exports.createErrorLogEntry = exports.cleanStackTrace = exports.getTopStackFrames = exports.parseStackTrace = exports.errorToJson = exports.deserializeError = exports.serializeError = exports.wrapError = exports.createErrorFromStatus = exports.createNotFoundError = exports.createValidationError = exports.ExternalServiceError = exports.DatabaseError = exports.ConflictError = exports.ForbiddenError = exports.UnauthorizedError = exports.NotFoundError = exports.ValidationError = exports.ApplicationError = void 0;
// ============================================================================
// CUSTOM ERROR CLASSES
// ============================================================================
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
class ApplicationError extends Error {
    constructor(message, statusCode = 500, code, context) {
        super(message);
        this.name = 'ApplicationError';
        this.statusCode = statusCode;
        this.code = code || 'APP_ERROR';
        this.context = context;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ApplicationError = ApplicationError;
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
class ValidationError extends ApplicationError {
    constructor(message, validationErrors, context) {
        super(message, 400, 'VALIDATION_ERROR', context);
        this.name = 'ValidationError';
        this.validationErrors = validationErrors;
    }
}
exports.ValidationError = ValidationError;
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
class NotFoundError extends ApplicationError {
    constructor(resourceType, resourceId, context) {
        super(`${resourceType} with ID ${resourceId} not found`, 404, 'NOT_FOUND', context);
        this.name = 'NotFoundError';
        this.resourceType = resourceType;
        this.resourceId = resourceId;
    }
}
exports.NotFoundError = NotFoundError;
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
class UnauthorizedError extends ApplicationError {
    constructor(message = 'Unauthorized', context) {
        super(message, 401, 'UNAUTHORIZED', context);
        this.name = 'UnauthorizedError';
    }
}
exports.UnauthorizedError = UnauthorizedError;
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
class ForbiddenError extends ApplicationError {
    constructor(message = 'Forbidden', requiredPermission, context) {
        super(message, 403, 'FORBIDDEN', context);
        this.name = 'ForbiddenError';
    }
}
exports.ForbiddenError = ForbiddenError;
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
class ConflictError extends ApplicationError {
    constructor(message, context) {
        super(message, 409, 'CONFLICT', context);
        this.name = 'ConflictError';
    }
}
exports.ConflictError = ConflictError;
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
class DatabaseError extends ApplicationError {
    constructor(message, originalError, context) {
        super(message, 500, 'DATABASE_ERROR', context);
        this.name = 'DatabaseError';
        this.originalError = originalError;
    }
}
exports.DatabaseError = DatabaseError;
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
class ExternalServiceError extends ApplicationError {
    constructor(serviceName, message, context) {
        super(message, 502, 'EXTERNAL_SERVICE_ERROR', context);
        this.name = 'ExternalServiceError';
        this.serviceName = serviceName;
    }
}
exports.ExternalServiceError = ExternalServiceError;
// ============================================================================
// ERROR FACTORY FUNCTIONS
// ============================================================================
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
const createValidationError = (errors, context) => {
    const message = Object.entries(errors)
        .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
        .join('; ');
    return new ValidationError(message, errors, context);
};
exports.createValidationError = createValidationError;
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
const createNotFoundError = (resourceType, resourceId, context) => {
    return new NotFoundError(resourceType, resourceId, context);
};
exports.createNotFoundError = createNotFoundError;
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
const createErrorFromStatus = (statusCode, message, context) => {
    switch (statusCode) {
        case 400:
            return new ValidationError(message, undefined, context);
        case 401:
            return new UnauthorizedError(message, context);
        case 403:
            return new ForbiddenError(message, undefined, context);
        case 404:
            return new ApplicationError(message, 404, 'NOT_FOUND', context);
        case 409:
            return new ConflictError(message, context);
        case 500:
            return new ApplicationError(message, 500, 'INTERNAL_ERROR', context);
        case 502:
            return new ApplicationError(message, 502, 'BAD_GATEWAY', context);
        case 503:
            return new ApplicationError(message, 503, 'SERVICE_UNAVAILABLE', context);
        default:
            return new ApplicationError(message, statusCode, 'UNKNOWN_ERROR', context);
    }
};
exports.createErrorFromStatus = createErrorFromStatus;
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
const wrapError = (error, context) => {
    if (error instanceof ApplicationError) {
        return error;
    }
    if (error instanceof Error) {
        return new ApplicationError(error.message, 500, 'WRAPPED_ERROR', {
            ...context,
            metadata: { ...context?.metadata, originalName: error.name },
        });
    }
    return new ApplicationError(String(error), 500, 'UNKNOWN_ERROR', context);
};
exports.wrapError = wrapError;
// ============================================================================
// ERROR SERIALIZATION
// ============================================================================
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
const serializeError = (error, includeStack = false) => {
    const serialized = {
        name: error.name,
        message: error.message,
    };
    if (error instanceof ApplicationError) {
        serialized.statusCode = error.statusCode;
        serialized.code = error.code;
        serialized.context = error.context;
    }
    if (error instanceof ValidationError && error.validationErrors) {
        serialized.details = error.validationErrors;
    }
    if (includeStack && error.stack) {
        serialized.stack = error.stack;
    }
    return serialized;
};
exports.serializeError = serializeError;
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
const deserializeError = (serialized) => {
    const { name, message, statusCode, code, context } = serialized;
    switch (name) {
        case 'ValidationError':
            return new ValidationError(message, serialized.details, context);
        case 'NotFoundError':
            return new ApplicationError(message, 404, 'NOT_FOUND', context);
        case 'UnauthorizedError':
            return new UnauthorizedError(message, context);
        case 'ForbiddenError':
            return new ForbiddenError(message, undefined, context);
        case 'ConflictError':
            return new ConflictError(message, context);
        default:
            return new ApplicationError(message, statusCode || 500, code, context);
    }
};
exports.deserializeError = deserializeError;
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
const errorToJson = (error, includeStack = process.env.NODE_ENV !== 'production') => {
    const serialized = (0, exports.serializeError)(error, includeStack);
    return {
        statusCode: serialized.statusCode || 500,
        message: serialized.message,
        code: serialized.code || 'INTERNAL_ERROR',
        ...(serialized.details && { details: serialized.details }),
        ...(includeStack && serialized.stack && { stack: serialized.stack }),
    };
};
exports.errorToJson = errorToJson;
// ============================================================================
// STACK TRACE PARSING
// ============================================================================
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
const parseStackTrace = (error) => {
    if (!error.stack)
        return [];
    const lines = error.stack.split('\n').slice(1);
    return lines.map((line) => {
        const match = line.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/);
        if (match) {
            return {
                function: match[1],
                file: match[2],
                line: parseInt(match[3], 10),
                column: parseInt(match[4], 10),
            };
        }
        const simpleMatch = line.match(/at\s+(.+?):(\d+):(\d+)/);
        if (simpleMatch) {
            return {
                function: 'anonymous',
                file: simpleMatch[1],
                line: parseInt(simpleMatch[2], 10),
                column: parseInt(simpleMatch[3], 10),
            };
        }
        return { raw: line.trim() };
    });
};
exports.parseStackTrace = parseStackTrace;
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
const getTopStackFrames = (error, count = 5) => {
    if (!error.stack)
        return [];
    const lines = error.stack.split('\n');
    return lines.slice(0, count + 1);
};
exports.getTopStackFrames = getTopStackFrames;
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
const cleanStackTrace = (error, excludePatterns = ['node_modules', 'node:internal']) => {
    if (!error.stack)
        return '';
    const lines = error.stack.split('\n');
    const filtered = lines.filter((line) => {
        return !excludePatterns.some((pattern) => line.includes(pattern));
    });
    return filtered.join('\n');
};
exports.cleanStackTrace = cleanStackTrace;
// ============================================================================
// ERROR LOGGING HELPERS
// ============================================================================
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
const createErrorLogEntry = (error, context, level = 'error') => {
    return {
        level,
        message: error.message,
        error: (0, exports.serializeError)(error, true),
        context: {
            ...context,
            timestamp: context.timestamp || new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
    };
};
exports.createErrorLogEntry = createErrorLogEntry;
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
const logError = (error, context) => {
    const entry = (0, exports.createErrorLogEntry)(error, context || { timestamp: new Date().toISOString() });
    console.error(`[${entry.level.toUpperCase()}] ${entry.timestamp}:`, {
        message: entry.message,
        code: entry.error.code,
        context: entry.context,
        stack: entry.error.stack,
    });
};
exports.logError = logError;
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
const logErrorJson = (error, context) => {
    const entry = (0, exports.createErrorLogEntry)(error, context || { timestamp: new Date().toISOString() });
    console.error(JSON.stringify(entry));
};
exports.logErrorJson = logErrorJson;
// ============================================================================
// GLOBAL ERROR HANDLERS
// ============================================================================
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
const setupUnhandledRejectionHandler = (handler) => {
    process.on('unhandledRejection', (reason) => {
        const error = (0, exports.wrapError)(reason);
        if (handler) {
            handler(error);
        }
        else {
            (0, exports.logError)(error, { timestamp: new Date().toISOString() });
        }
    });
};
exports.setupUnhandledRejectionHandler = setupUnhandledRejectionHandler;
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
const setupUncaughtExceptionHandler = (handler) => {
    process.on('uncaughtException', (error) => {
        if (handler) {
            handler(error);
        }
        else {
            (0, exports.logError)(error, { timestamp: new Date().toISOString() });
            process.exit(1);
        }
    });
};
exports.setupUncaughtExceptionHandler = setupUncaughtExceptionHandler;
// ============================================================================
// ASYNC ERROR CATCHING WRAPPERS
// ============================================================================
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
const catchAsync = (fn, errorHandler) => {
    return async (...args) => {
        try {
            return await fn(...args);
        }
        catch (error) {
            const appError = (0, exports.wrapError)(error);
            if (errorHandler) {
                errorHandler(appError);
            }
            else {
                (0, exports.logError)(appError);
            }
            return undefined;
        }
    };
};
exports.catchAsync = catchAsync;
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
const to = async (promise) => {
    try {
        const data = await promise;
        return [null, data];
    }
    catch (error) {
        return [(0, exports.wrapError)(error), undefined];
    }
};
exports.to = to;
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
const makeSafe = (fn) => {
    return async (...args) => {
        return (0, exports.to)(fn(...args));
    };
};
exports.makeSafe = makeSafe;
// ============================================================================
// ERROR TRANSFORMATION
// ============================================================================
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
const transformErrorToMessage = (error) => {
    if (error instanceof ValidationError) {
        return 'Please check your input and try again.';
    }
    if (error instanceof NotFoundError) {
        return 'The requested resource was not found.';
    }
    if (error instanceof UnauthorizedError) {
        return 'Please log in to continue.';
    }
    if (error instanceof ForbiddenError) {
        return 'You do not have permission to perform this action.';
    }
    if (error instanceof ConflictError) {
        return 'A conflict occurred. Please try again.';
    }
    return 'An unexpected error occurred. Please try again later.';
};
exports.transformErrorToMessage = transformErrorToMessage;
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
const redactSensitiveInfo = (error, patterns = ['password', 'token', 'secret', 'key', 'ssn']) => {
    let message = error.message;
    patterns.forEach((pattern) => {
        const regex = new RegExp(`${pattern}[=:]\\s*\\S+`, 'gi');
        message = message.replace(regex, `${pattern}=[REDACTED]`);
    });
    const redactedError = new Error(message);
    redactedError.name = error.name;
    redactedError.stack = error.stack;
    return redactedError;
};
exports.redactSensitiveInfo = redactSensitiveInfo;
// ============================================================================
// ERROR RECOVERY STRATEGIES
// ============================================================================
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
const withFallback = async (fn, fallback) => {
    try {
        return await fn();
    }
    catch (error) {
        return await fallback();
    }
};
exports.withFallback = withFallback;
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
const withRecovery = async (fn, strategies) => {
    try {
        return await fn();
    }
    catch (error) {
        const appError = (0, exports.wrapError)(error);
        for (const strategy of strategies) {
            if (!strategy.condition || strategy.condition(appError)) {
                try {
                    return await strategy.handler(appError);
                }
                catch {
                    // Try next strategy
                }
            }
        }
        throw appError;
    }
};
exports.withRecovery = withRecovery;
// ============================================================================
// ERROR AGGREGATION
// ============================================================================
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
const aggregateErrors = (errors) => {
    return {
        errors,
        count: errors.length,
        firstError: errors[0],
        lastError: errors[errors.length - 1],
    };
};
exports.aggregateErrors = aggregateErrors;
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
const combineErrorMessages = (errors, separator = '; ') => {
    return errors.map((e) => e.message).join(separator);
};
exports.combineErrorMessages = combineErrorMessages;
// ============================================================================
// RETRY ON ERROR HELPERS
// ============================================================================
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
const retryOnError = async (fn, options) => {
    const { maxAttempts, delayMs, backoffMultiplier = 2, shouldRetry } = options;
    let lastError;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = (0, exports.wrapError)(error);
            if (shouldRetry && !shouldRetry(lastError)) {
                throw lastError;
            }
            if (attempt === maxAttempts) {
                throw lastError;
            }
            const delay = delayMs * Math.pow(backoffMultiplier, attempt - 1);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
    throw lastError;
};
exports.retryOnError = retryOnError;
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
const createRetryOptions = (overrides) => {
    return {
        maxAttempts: 3,
        delayMs: 1000,
        backoffMultiplier: 2,
        ...overrides,
    };
};
exports.createRetryOptions = createRetryOptions;
// ============================================================================
// GRACEFUL DEGRADATION
// ============================================================================
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
const withGracefulDegradation = async (fn, defaultValue, onError) => {
    try {
        return await fn();
    }
    catch (error) {
        const appError = (0, exports.wrapError)(error);
        if (onError) {
            onError(appError);
        }
        return defaultValue;
    }
};
exports.withGracefulDegradation = withGracefulDegradation;
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
const createCircuitBreaker = (failureThreshold, resetTimeoutMs) => {
    let failures = 0;
    let state = 'closed';
    let nextAttempt = Date.now();
    return {
        execute: async (fn) => {
            if (state === 'open') {
                if (Date.now() < nextAttempt) {
                    throw new ApplicationError('Circuit breaker is open', 503);
                }
                state = 'half-open';
            }
            try {
                const result = await fn();
                if (state === 'half-open') {
                    state = 'closed';
                    failures = 0;
                }
                return result;
            }
            catch (error) {
                failures++;
                if (failures >= failureThreshold) {
                    state = 'open';
                    nextAttempt = Date.now() + resetTimeoutMs;
                }
                throw error;
            }
        },
        getState: () => state,
        reset: () => {
            failures = 0;
            state = 'closed';
        },
    };
};
exports.createCircuitBreaker = createCircuitBreaker;
// ============================================================================
// ERROR REPORTING TO MONITORING SERVICES
// ============================================================================
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
const reportErrorToMonitoring = async (error, context) => {
    const payload = {
        error: (0, exports.serializeError)(error, true),
        context,
        timestamp: new Date().toISOString(),
    };
    // Try Sentry if available
    try {
        const Sentry = require('@sentry/node');
        Sentry.captureException(error, {
            contexts: {
                custom: context,
            },
            tags: {
                userId: context.userId,
                requestId: context.requestId,
            },
        });
        return;
    }
    catch {
        // Sentry not available, try other options
    }
    // Try Datadog if available
    try {
        const tracer = require('dd-trace');
        const span = tracer.scope().active();
        if (span) {
            span.setTag('error', true);
            span.setTag('error.type', error.name);
            span.setTag('error.message', error.message);
            span.setTag('error.stack', error.stack);
        }
        return;
    }
    catch {
        // Datadog not available
    }
    // Fallback to console logging with structured format
    console.error('[ERROR_MONITORING]', JSON.stringify(payload, null, 2));
    // In production, could also send to custom logging service
    // For example, HTTP POST to logging endpoint:
    // await fetch(process.env.ERROR_LOGGING_ENDPOINT, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload)
    // });
};
exports.reportErrorToMonitoring = reportErrorToMonitoring;
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
const createNestJsExceptionFilter = (includeStack = false) => {
    return {
        catch(exception, host) {
            const ctx = host.switchToHttp();
            const response = ctx.getResponse();
            const request = ctx.getRequest();
            const status = exception instanceof ApplicationError
                ? exception.statusCode
                : 500;
            const errorResponse = (0, exports.errorToJson)(exception, includeStack);
            response.status(status).json({
                ...errorResponse,
                path: request.url,
                timestamp: new Date().toISOString(),
            });
        },
    };
};
exports.createNestJsExceptionFilter = createNestJsExceptionFilter;
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
const isOperationalError = (error) => {
    if (error instanceof ApplicationError) {
        return error.statusCode < 500;
    }
    return false;
};
exports.isOperationalError = isOperationalError;
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
const groupErrorsByType = (errors) => {
    const grouped = new Map();
    for (const error of errors) {
        const type = error.name;
        if (!grouped.has(type)) {
            grouped.set(type, []);
        }
        grouped.get(type).push(error);
    }
    return grouped;
};
exports.groupErrorsByType = groupErrorsByType;
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
const createErrorFromValidation = (validationResult) => {
    const errors = {};
    if (validationResult.details) {
        // Joi format
        validationResult.details.forEach((detail) => {
            const field = detail.path.join('.');
            if (!errors[field]) {
                errors[field] = [];
            }
            errors[field].push(detail.message);
        });
    }
    else if (validationResult.errors) {
        // Yup format
        Object.entries(validationResult.errors).forEach(([field, msgs]) => {
            errors[field] = Array.isArray(msgs) ? msgs : [msgs];
        });
    }
    return (0, exports.createValidationError)(errors);
};
exports.createErrorFromValidation = createErrorFromValidation;
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
const createTimeoutError = (operation, timeoutMs) => {
    return new ApplicationError(`Operation '${operation}' timed out after ${timeoutMs}ms`, 408, 'TIMEOUT_ERROR', {
        timestamp: new Date().toISOString(),
        metadata: { operation, timeoutMs },
    });
};
exports.createTimeoutError = createTimeoutError;
exports.default = {
    // Custom error classes
    ApplicationError,
    ValidationError,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError,
    ConflictError,
    DatabaseError,
    ExternalServiceError,
    // Error factory functions
    createValidationError: exports.createValidationError,
    createNotFoundError: exports.createNotFoundError,
    createErrorFromStatus: exports.createErrorFromStatus,
    wrapError: exports.wrapError,
    // Error serialization
    serializeError: exports.serializeError,
    deserializeError: exports.deserializeError,
    errorToJson: exports.errorToJson,
    // Stack trace parsing
    parseStackTrace: exports.parseStackTrace,
    getTopStackFrames: exports.getTopStackFrames,
    cleanStackTrace: exports.cleanStackTrace,
    // Error logging helpers
    createErrorLogEntry: exports.createErrorLogEntry,
    logError: exports.logError,
    logErrorJson: exports.logErrorJson,
    // Global error handlers
    setupUnhandledRejectionHandler: exports.setupUnhandledRejectionHandler,
    setupUncaughtExceptionHandler: exports.setupUncaughtExceptionHandler,
    // Async error catching wrappers
    catchAsync: exports.catchAsync,
    to: exports.to,
    makeSafe: exports.makeSafe,
    // Error transformation
    transformErrorToMessage: exports.transformErrorToMessage,
    redactSensitiveInfo: exports.redactSensitiveInfo,
    // Error recovery strategies
    withFallback: exports.withFallback,
    withRecovery: exports.withRecovery,
    // Error aggregation
    aggregateErrors: exports.aggregateErrors,
    combineErrorMessages: exports.combineErrorMessages,
    // Retry on error helpers
    retryOnError: exports.retryOnError,
    createRetryOptions: exports.createRetryOptions,
    // Graceful degradation
    withGracefulDegradation: exports.withGracefulDegradation,
    createCircuitBreaker: exports.createCircuitBreaker,
    // Error reporting
    reportErrorToMonitoring: exports.reportErrorToMonitoring,
    // NestJS integration
    createNestJsExceptionFilter: exports.createNestJsExceptionFilter,
    // Error utilities
    isOperationalError: exports.isOperationalError,
    groupErrorsByType: exports.groupErrorsByType,
    createErrorFromValidation: exports.createErrorFromValidation,
    createTimeoutError: exports.createTimeoutError,
};
//# sourceMappingURL=error-handling-utils.js.map