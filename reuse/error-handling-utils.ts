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

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
export class ApplicationError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly context?: ErrorContext;

  constructor(
    message: string,
    statusCode: number = 500,
    code?: string,
    context?: ErrorContext,
  ) {
    super(message);
    this.name = 'ApplicationError';
    this.statusCode = statusCode;
    this.code = code || 'APP_ERROR';
    this.context = context;
    Error.captureStackTrace(this, this.constructor);
  }
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
export class ValidationError extends ApplicationError {
  public readonly validationErrors?: Record<string, string[]>;

  constructor(
    message: string,
    validationErrors?: Record<string, string[]>,
    context?: ErrorContext,
  ) {
    super(message, 400, 'VALIDATION_ERROR', context);
    this.name = 'ValidationError';
    this.validationErrors = validationErrors;
  }
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
export class NotFoundError extends ApplicationError {
  public readonly resourceType: string;
  public readonly resourceId: string;

  constructor(
    resourceType: string,
    resourceId: string,
    context?: ErrorContext,
  ) {
    super(
      `${resourceType} with ID ${resourceId} not found`,
      404,
      'NOT_FOUND',
      context,
    );
    this.name = 'NotFoundError';
    this.resourceType = resourceType;
    this.resourceId = resourceId;
  }
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
export class UnauthorizedError extends ApplicationError {
  constructor(message: string = 'Unauthorized', context?: ErrorContext) {
    super(message, 401, 'UNAUTHORIZED', context);
    this.name = 'UnauthorizedError';
  }
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
export class ForbiddenError extends ApplicationError {
  constructor(
    message: string = 'Forbidden',
    requiredPermission?: string,
    context?: ErrorContext,
  ) {
    super(message, 403, 'FORBIDDEN', context);
    this.name = 'ForbiddenError';
  }
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
export class ConflictError extends ApplicationError {
  constructor(message: string, context?: ErrorContext) {
    super(message, 409, 'CONFLICT', context);
    this.name = 'ConflictError';
  }
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
export class DatabaseError extends ApplicationError {
  public readonly originalError?: Error;

  constructor(message: string, originalError?: Error, context?: ErrorContext) {
    super(message, 500, 'DATABASE_ERROR', context);
    this.name = 'DatabaseError';
    this.originalError = originalError;
  }
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
export class ExternalServiceError extends ApplicationError {
  public readonly serviceName: string;

  constructor(
    serviceName: string,
    message: string,
    context?: ErrorContext,
  ) {
    super(message, 502, 'EXTERNAL_SERVICE_ERROR', context);
    this.name = 'ExternalServiceError';
    this.serviceName = serviceName;
  }
}

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
export const createValidationError = (
  errors: Record<string, string[]>,
  context?: ErrorContext,
): ValidationError => {
  const message = Object.entries(errors)
    .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
    .join('; ');
  return new ValidationError(message, errors, context);
};

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
export const createNotFoundError = (
  resourceType: string,
  resourceId: string,
  context?: ErrorContext,
): NotFoundError => {
  return new NotFoundError(resourceType, resourceId, context);
};

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
export const createErrorFromStatus = (
  statusCode: number,
  message: string,
  context?: ErrorContext,
): ApplicationError => {
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
export const wrapError = (
  error: unknown,
  context?: ErrorContext,
): ApplicationError => {
  if (error instanceof ApplicationError) {
    return error;
  }
  if (error instanceof Error) {
    return new ApplicationError(error.message, 500, 'WRAPPED_ERROR', {
      ...context,
      metadata: { ...context?.metadata, originalName: error.name },
    });
  }
  return new ApplicationError(
    String(error),
    500,
    'UNKNOWN_ERROR',
    context,
  );
};

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
export const serializeError = (
  error: Error,
  includeStack: boolean = false,
): SerializedError => {
  const serialized: SerializedError = {
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
export const deserializeError = (serialized: SerializedError): Error => {
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
export const errorToJson = (
  error: Error,
  includeStack: boolean = process.env.NODE_ENV !== 'production',
): object => {
  const serialized = serializeError(error, includeStack);
  return {
    statusCode: serialized.statusCode || 500,
    message: serialized.message,
    code: serialized.code || 'INTERNAL_ERROR',
    ...(serialized.details && { details: serialized.details }),
    ...(includeStack && serialized.stack && { stack: serialized.stack }),
  };
};

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
export const parseStackTrace = (error: Error): Array<object> => {
  if (!error.stack) return [];

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
export const getTopStackFrames = (error: Error, count: number = 5): string[] => {
  if (!error.stack) return [];
  const lines = error.stack.split('\n');
  return lines.slice(0, count + 1);
};

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
export const cleanStackTrace = (
  error: Error,
  excludePatterns: string[] = ['node_modules', 'node:internal'],
): string => {
  if (!error.stack) return '';

  const lines = error.stack.split('\n');
  const filtered = lines.filter((line) => {
    return !excludePatterns.some((pattern) => line.includes(pattern));
  });

  return filtered.join('\n');
};

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
export const createErrorLogEntry = (
  error: Error,
  context: ErrorContext,
  level: 'error' | 'warn' | 'info' = 'error',
): ErrorLogEntry => {
  return {
    level,
    message: error.message,
    error: serializeError(error, true),
    context: {
      ...context,
      timestamp: context.timestamp || new Date().toISOString(),
    },
    timestamp: new Date().toISOString(),
  };
};

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
export const logError = (error: Error, context?: ErrorContext): void => {
  const entry = createErrorLogEntry(error, context || { timestamp: new Date().toISOString() });
  console.error(`[${entry.level.toUpperCase()}] ${entry.timestamp}:`, {
    message: entry.message,
    code: entry.error.code,
    context: entry.context,
    stack: entry.error.stack,
  });
};

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
export const logErrorJson = (error: Error, context?: ErrorContext): void => {
  const entry = createErrorLogEntry(error, context || { timestamp: new Date().toISOString() });
  console.error(JSON.stringify(entry));
};

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
export const setupUnhandledRejectionHandler = (
  handler?: (error: Error) => void,
): void => {
  process.on('unhandledRejection', (reason: any) => {
    const error = wrapError(reason);
    if (handler) {
      handler(error);
    } else {
      logError(error, { timestamp: new Date().toISOString() });
    }
  });
};

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
export const setupUncaughtExceptionHandler = (
  handler?: (error: Error) => void,
): void => {
  process.on('uncaughtException', (error: Error) => {
    if (handler) {
      handler(error);
    } else {
      logError(error, { timestamp: new Date().toISOString() });
      process.exit(1);
    }
  });
};

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
export const catchAsync = <T>(
  fn: (...args: any[]) => Promise<T>,
  errorHandler?: (error: Error) => void,
): ((...args: any[]) => Promise<T | undefined>) => {
  return async (...args: any[]): Promise<T | undefined> => {
    try {
      return await fn(...args);
    } catch (error) {
      const appError = wrapError(error);
      if (errorHandler) {
        errorHandler(appError);
      } else {
        logError(appError);
      }
      return undefined;
    }
  };
};

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
export const to = async <T>(
  promise: Promise<T>,
): Promise<[Error | null, T | undefined]> => {
  try {
    const data = await promise;
    return [null, data];
  } catch (error) {
    return [wrapError(error), undefined];
  }
};

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
export const makeSafe = <T>(
  fn: (...args: any[]) => Promise<T>,
): ((...args: any[]) => Promise<[Error | null, T | undefined]>) => {
  return async (...args: any[]): Promise<[Error | null, T | undefined]> => {
    return to(fn(...args));
  };
};

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
export const transformErrorToMessage = (error: Error): string => {
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
export const redactSensitiveInfo = (
  error: Error,
  patterns: string[] = ['password', 'token', 'secret', 'key', 'ssn'],
): Error => {
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
export const withFallback = async <T>(
  fn: () => Promise<T>,
  fallback: () => Promise<T>,
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    return await fallback();
  }
};

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
export const withRecovery = async <T>(
  fn: () => Promise<T>,
  strategies: RecoveryStrategy[],
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    const appError = wrapError(error);
    for (const strategy of strategies) {
      if (!strategy.condition || strategy.condition(appError)) {
        try {
          return await strategy.handler(appError);
        } catch {
          // Try next strategy
        }
      }
    }
    throw appError;
  }
};

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
export const aggregateErrors = (errors: Error[]): AggregatedError => {
  return {
    errors,
    count: errors.length,
    firstError: errors[0],
    lastError: errors[errors.length - 1],
  };
};

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
export const combineErrorMessages = (
  errors: Error[],
  separator: string = '; ',
): string => {
  return errors.map((e) => e.message).join(separator);
};

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
export const retryOnError = async <T>(
  fn: () => Promise<T>,
  options: RetryOptions,
): Promise<T> => {
  const { maxAttempts, delayMs, backoffMultiplier = 2, shouldRetry } = options;
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = wrapError(error);

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

  throw lastError!;
};

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
export const createRetryOptions = (
  overrides?: Partial<RetryOptions>,
): RetryOptions => {
  return {
    maxAttempts: 3,
    delayMs: 1000,
    backoffMultiplier: 2,
    ...overrides,
  };
};

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
export const withGracefulDegradation = async <T>(
  fn: () => Promise<T>,
  defaultValue: T,
  onError?: (error: Error) => void,
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    const appError = wrapError(error);
    if (onError) {
      onError(appError);
    }
    return defaultValue;
  }
};

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
export const createCircuitBreaker = (
  failureThreshold: number,
  resetTimeoutMs: number,
) => {
  let failures = 0;
  let state: 'closed' | 'open' | 'half-open' = 'closed';
  let nextAttempt = Date.now();

  return {
    execute: async <T>(fn: () => Promise<T>): Promise<T> => {
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
      } catch (error) {
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

// ============================================================================
// ERROR REPORTING TO MONITORING SERVICES
// ============================================================================

/**
 * Sends error to monitoring service (stub for integration).
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
export const reportErrorToMonitoring = async (
  error: Error,
  context: ErrorContext,
): Promise<void> => {
  // Integration point for services like Sentry, Datadog, etc.
  const payload = {
    error: serializeError(error, true),
    context,
    timestamp: new Date().toISOString(),
  };

  // Stub: Replace with actual monitoring service API call
  console.log('[MONITORING]', JSON.stringify(payload));
};

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
export const createNestJsExceptionFilter = (includeStack: boolean = false) => {
  return {
    catch(exception: Error, host: any) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest();

      const status =
        exception instanceof ApplicationError
          ? exception.statusCode
          : 500;

      const errorResponse = errorToJson(exception, includeStack);

      response.status(status).json({
        ...errorResponse,
        path: request.url,
        timestamp: new Date().toISOString(),
      });
    },
  };
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
export const isOperationalError = (error: Error): boolean => {
  if (error instanceof ApplicationError) {
    return error.statusCode < 500;
  }
  return false;
};

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
export const groupErrorsByType = (errors: Error[]): Map<string, Error[]> => {
  const grouped = new Map<string, Error[]>();

  for (const error of errors) {
    const type = error.name;
    if (!grouped.has(type)) {
      grouped.set(type, []);
    }
    grouped.get(type)!.push(error);
  }

  return grouped;
};

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
export const createErrorFromValidation = (validationResult: any): ValidationError => {
  const errors: Record<string, string[]> = {};

  if (validationResult.details) {
    // Joi format
    validationResult.details.forEach((detail: any) => {
      const field = detail.path.join('.');
      if (!errors[field]) {
        errors[field] = [];
      }
      errors[field].push(detail.message);
    });
  } else if (validationResult.errors) {
    // Yup format
    Object.entries(validationResult.errors).forEach(([field, msgs]) => {
      errors[field] = Array.isArray(msgs) ? msgs : [msgs as string];
    });
  }

  return createValidationError(errors);
};

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
export const createTimeoutError = (
  operation: string,
  timeoutMs: number,
): ApplicationError => {
  return new ApplicationError(
    `Operation '${operation}' timed out after ${timeoutMs}ms`,
    408,
    'TIMEOUT_ERROR',
    {
      timestamp: new Date().toISOString(),
      metadata: { operation, timeoutMs },
    },
  );
};

export default {
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
  createValidationError,
  createNotFoundError,
  createErrorFromStatus,
  wrapError,

  // Error serialization
  serializeError,
  deserializeError,
  errorToJson,

  // Stack trace parsing
  parseStackTrace,
  getTopStackFrames,
  cleanStackTrace,

  // Error logging helpers
  createErrorLogEntry,
  logError,
  logErrorJson,

  // Global error handlers
  setupUnhandledRejectionHandler,
  setupUncaughtExceptionHandler,

  // Async error catching wrappers
  catchAsync,
  to,
  makeSafe,

  // Error transformation
  transformErrorToMessage,
  redactSensitiveInfo,

  // Error recovery strategies
  withFallback,
  withRecovery,

  // Error aggregation
  aggregateErrors,
  combineErrorMessages,

  // Retry on error helpers
  retryOnError,
  createRetryOptions,

  // Graceful degradation
  withGracefulDegradation,
  createCircuitBreaker,

  // Error reporting
  reportErrorToMonitoring,

  // NestJS integration
  createNestJsExceptionFilter,

  // Error utilities
  isOperationalError,
  groupErrorsByType,
  createErrorFromValidation,
  createTimeoutError,
};
