"use strict";
/**
 * LOC: LOG1234567
 * File: /reuse/logging-utils.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Logger services
 *   - NestJS logging modules
 *   - Error tracking services
 *   - Performance monitoring
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateLogStats = exports.filterLogsByTimeRange = exports.groupLogsByLevel = exports.addLogTags = exports.addLogMetadata = exports.addLogContext = exports.createContextLogger = exports.createSamplingConfig = exports.shouldSampleLog = exports.parseLogLevel = exports.getLogLevelPriority = exports.shouldLog = exports.addCorrelationId = exports.extractCorrelationId = exports.generateCorrelationId = exports.colorizeLogLevel = exports.formatLogAsECS = exports.formatLogAsText = exports.formatLogAsJson = exports.createSlowQueryLog = exports.sanitizeDatabaseQuery = exports.createDatabaseQueryLog = exports.createSlowOperationLog = exports.exceedsPerformanceThreshold = exports.createPerformanceTimer = exports.createPerformanceLog = exports.extractRequestContext = exports.createRequestEndLog = exports.createRequestStartLog = exports.createRequestLog = exports.createHttpErrorLog = exports.sanitizeError = exports.formatStackTrace = exports.extractErrorDetails = exports.createDebugLog = exports.createInfoLog = exports.createWarningLog = exports.createErrorLog = exports.createLogEntry = exports.LogFormat = exports.LogLevel = void 0;
/**
 * File: /reuse/logging-utils.ts
 * Locator: WC-UTL-LOG-001
 * Purpose: Comprehensive Logging Utilities - Structured logging for healthcare applications
 *
 * Upstream: Independent utility module for logging operations
 * Downstream: ../backend/*, logger services, error tracking, monitoring services
 * Dependencies: TypeScript 5.x, Node 18+, Winston/Pino compatible
 * Exports: 42 utility functions for structured logging, error tracking, performance monitoring
 *
 * LLM Context: Comprehensive logging utilities for White Cross healthcare platform.
 * Provides structured logging with Winston/Pino support, context-aware logging, request
 * tracking, error logging with stack traces, performance monitoring, log formatting,
 * correlation ID management, and distributed tracing. Essential for production-grade
 * healthcare applications requiring comprehensive observability and debugging capabilities.
 */
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
var LogLevel;
(function (LogLevel) {
    LogLevel["ERROR"] = "error";
    LogLevel["WARN"] = "warn";
    LogLevel["INFO"] = "info";
    LogLevel["HTTP"] = "http";
    LogLevel["VERBOSE"] = "verbose";
    LogLevel["DEBUG"] = "debug";
    LogLevel["SILLY"] = "silly";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
var LogFormat;
(function (LogFormat) {
    LogFormat["JSON"] = "json";
    LogFormat["TEXT"] = "text";
    LogFormat["PRETTY"] = "pretty";
    LogFormat["ECS"] = "ecs";
})(LogFormat || (exports.LogFormat = LogFormat = {}));
// ============================================================================
// STRUCTURED LOGGING
// ============================================================================
/**
 * Creates a structured log entry.
 *
 * @param {LogLevel} level - Log level
 * @param {string} message - Log message
 * @param {Partial<LogEntry>} [options] - Additional log entry options
 * @returns {LogEntry} Complete log entry
 *
 * @example
 * ```typescript
 * const log = createLogEntry(LogLevel.INFO, 'User login successful', {
 *   userId: 'user123',
 *   context: 'AuthService',
 *   metadata: { loginMethod: 'email' }
 * });
 * ```
 */
const createLogEntry = (level, message, options) => {
    return {
        level,
        message,
        timestamp: new Date(),
        ...options,
    };
};
exports.createLogEntry = createLogEntry;
/**
 * Creates an error log entry with stack trace.
 *
 * @param {string} message - Error message
 * @param {Error} error - Error object
 * @param {Partial<LogEntry>} [options] - Additional log entry options
 * @returns {LogEntry} Error log entry
 *
 * @example
 * ```typescript
 * try {
 *   throw new Error('Database connection failed');
 * } catch (error) {
 *   const log = createErrorLog('Failed to connect to database', error, {
 *     context: 'DatabaseService'
 *   });
 * }
 * ```
 */
const createErrorLog = (message, error, options) => {
    return (0, exports.createLogEntry)(LogLevel.ERROR, message, {
        ...options,
        error: (0, exports.extractErrorDetails)(error),
    });
};
exports.createErrorLog = createErrorLog;
/**
 * Creates a warning log entry.
 *
 * @param {string} message - Warning message
 * @param {Partial<LogEntry>} [options] - Additional log entry options
 * @returns {LogEntry} Warning log entry
 *
 * @example
 * ```typescript
 * const log = createWarningLog('Cache miss, falling back to database', {
 *   context: 'CacheService',
 *   metadata: { key: 'patient:12345' }
 * });
 * ```
 */
const createWarningLog = (message, options) => {
    return (0, exports.createLogEntry)(LogLevel.WARN, message, options);
};
exports.createWarningLog = createWarningLog;
/**
 * Creates an info log entry.
 *
 * @param {string} message - Info message
 * @param {Partial<LogEntry>} [options] - Additional log entry options
 * @returns {LogEntry} Info log entry
 *
 * @example
 * ```typescript
 * const log = createInfoLog('User profile updated successfully', {
 *   userId: 'user123',
 *   context: 'UserService'
 * });
 * ```
 */
const createInfoLog = (message, options) => {
    return (0, exports.createLogEntry)(LogLevel.INFO, message, options);
};
exports.createInfoLog = createInfoLog;
/**
 * Creates a debug log entry.
 *
 * @param {string} message - Debug message
 * @param {Partial<LogEntry>} [options] - Additional log entry options
 * @returns {LogEntry} Debug log entry
 *
 * @example
 * ```typescript
 * const log = createDebugLog('Cache lookup result', {
 *   context: 'CacheService',
 *   metadata: { hit: true, key: 'patient:12345' }
 * });
 * ```
 */
const createDebugLog = (message, options) => {
    return (0, exports.createLogEntry)(LogLevel.DEBUG, message, options);
};
exports.createDebugLog = createDebugLog;
// ============================================================================
// ERROR LOGGING
// ============================================================================
/**
 * Extracts detailed error information from Error object.
 *
 * @param {Error} error - Error object
 * @returns {ErrorDetails} Extracted error details
 *
 * @example
 * ```typescript
 * try {
 *   throw new Error('Something went wrong');
 * } catch (error) {
 *   const details = extractErrorDetails(error);
 *   // Result: { name: 'Error', message: 'Something went wrong', stack: '...' }
 * }
 * ```
 */
const extractErrorDetails = (error) => {
    return {
        name: error.name || 'Error',
        message: error.message || String(error),
        stack: error.stack,
        code: error.code,
        statusCode: error.statusCode || error.status,
        context: error.context,
    };
};
exports.extractErrorDetails = extractErrorDetails;
/**
 * Formats error stack trace for logging.
 *
 * @param {string | undefined} stack - Error stack trace
 * @param {number} [maxLines] - Maximum number of stack trace lines to include
 * @returns {string | undefined} Formatted stack trace
 *
 * @example
 * ```typescript
 * const formatted = formatStackTrace(error.stack, 5);
 * // Returns first 5 lines of stack trace
 * ```
 */
const formatStackTrace = (stack, maxLines) => {
    if (!stack)
        return undefined;
    const lines = stack.split('\n');
    if (maxLines && lines.length > maxLines) {
        return lines.slice(0, maxLines).join('\n') + '\n... (truncated)';
    }
    return stack;
};
exports.formatStackTrace = formatStackTrace;
/**
 * Sanitizes error object to remove sensitive information.
 *
 * @param {Error} error - Error object
 * @param {string[]} [sensitiveKeys] - Keys to remove from error
 * @returns {ErrorDetails} Sanitized error details
 *
 * @example
 * ```typescript
 * const sanitized = sanitizeError(error, ['password', 'apiKey', 'token']);
 * ```
 */
const sanitizeError = (error, sensitiveKeys = ['password', 'token', 'apiKey', 'secret']) => {
    const details = (0, exports.extractErrorDetails)(error);
    if (details.context) {
        const sanitizedContext = { ...details.context };
        sensitiveKeys.forEach((key) => {
            if (sanitizedContext[key]) {
                sanitizedContext[key] = '[REDACTED]';
            }
        });
        details.context = sanitizedContext;
    }
    return details;
};
exports.sanitizeError = sanitizeError;
/**
 * Creates an HTTP error log entry.
 *
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {RequestLogContext} requestContext - Request context
 * @returns {LogEntry} HTTP error log entry
 *
 * @example
 * ```typescript
 * const log = createHttpErrorLog(404, 'Patient not found', {
 *   requestId: 'req-123',
 *   method: 'GET',
 *   url: '/api/patients/999'
 * });
 * ```
 */
const createHttpErrorLog = (statusCode, message, requestContext) => {
    return (0, exports.createLogEntry)(LogLevel.ERROR, message, {
        metadata: {
            statusCode,
            ...requestContext,
        },
        tags: ['http', 'error'],
    });
};
exports.createHttpErrorLog = createHttpErrorLog;
// ============================================================================
// REQUEST LOGGING
// ============================================================================
/**
 * Creates a request log entry.
 *
 * @param {RequestLogContext} context - Request context
 * @returns {LogEntry} Request log entry
 *
 * @example
 * ```typescript
 * const log = createRequestLog({
 *   requestId: 'req-123',
 *   method: 'POST',
 *   url: '/api/patients',
 *   userId: 'user123',
 *   duration: 150
 * });
 * ```
 */
const createRequestLog = (context) => {
    const level = context.statusCode && context.statusCode >= 400
        ? LogLevel.ERROR
        : LogLevel.INFO;
    return (0, exports.createLogEntry)(level, `${context.method} ${context.url} ${context.statusCode || 'pending'}`, {
        requestId: context.requestId,
        correlationId: context.correlationId,
        userId: context.userId,
        duration: context.duration,
        metadata: {
            method: context.method,
            url: context.url,
            statusCode: context.statusCode,
            userAgent: context.userAgent,
            ipAddress: context.ipAddress,
        },
        tags: ['http', 'request'],
    });
};
exports.createRequestLog = createRequestLog;
/**
 * Creates a request start log entry.
 *
 * @param {string} requestId - Request ID
 * @param {string} method - HTTP method
 * @param {string} url - Request URL
 * @returns {LogEntry} Request start log entry
 *
 * @example
 * ```typescript
 * const log = createRequestStartLog('req-123', 'GET', '/api/patients');
 * ```
 */
const createRequestStartLog = (requestId, method, url) => {
    return (0, exports.createLogEntry)(LogLevel.HTTP, `→ ${method} ${url}`, {
        requestId,
        metadata: { method, url },
        tags: ['http', 'request', 'start'],
    });
};
exports.createRequestStartLog = createRequestStartLog;
/**
 * Creates a request end log entry with duration.
 *
 * @param {string} requestId - Request ID
 * @param {string} method - HTTP method
 * @param {string} url - Request URL
 * @param {number} statusCode - Response status code
 * @param {number} duration - Request duration in milliseconds
 * @returns {LogEntry} Request end log entry
 *
 * @example
 * ```typescript
 * const log = createRequestEndLog('req-123', 'GET', '/api/patients', 200, 150);
 * ```
 */
const createRequestEndLog = (requestId, method, url, statusCode, duration) => {
    const level = statusCode >= 400 ? LogLevel.WARN : LogLevel.HTTP;
    return (0, exports.createLogEntry)(LogLevel.HTTP, `← ${method} ${url} ${statusCode} (${duration}ms)`, {
        requestId,
        duration,
        metadata: { method, url, statusCode },
        tags: ['http', 'request', 'end'],
    });
};
exports.createRequestEndLog = createRequestEndLog;
/**
 * Extracts request context from Express/NestJS request object.
 *
 * @param {any} request - Express/NestJS request object
 * @returns {Partial<RequestLogContext>} Extracted request context
 *
 * @example
 * ```typescript
 * const context = extractRequestContext(req);
 * // Result: { method: 'GET', url: '/api/patients', userAgent: '...' }
 * ```
 */
const extractRequestContext = (request) => {
    return {
        method: request.method,
        url: request.url || request.originalUrl,
        userAgent: request.headers['user-agent'],
        ipAddress: request.ip || request.connection?.remoteAddress,
        userId: request.user?.id || request.userId,
        correlationId: request.headers['x-correlation-id'],
    };
};
exports.extractRequestContext = extractRequestContext;
// ============================================================================
// PERFORMANCE LOGGING
// ============================================================================
/**
 * Creates a performance log entry.
 *
 * @param {string} operation - Operation name
 * @param {number} duration - Duration in milliseconds
 * @param {Record<string, any>} [metadata] - Additional metadata
 * @returns {PerformanceLogEntry} Performance log entry
 *
 * @example
 * ```typescript
 * const log = createPerformanceLog('database_query', 150, {
 *   query: 'SELECT * FROM patients WHERE id = ?',
 *   rows: 1
 * });
 * ```
 */
const createPerformanceLog = (operation, duration, metadata) => {
    return {
        operation,
        duration,
        timestamp: new Date(),
        metadata,
    };
};
exports.createPerformanceLog = createPerformanceLog;
/**
 * Creates a performance timer for measuring operation duration.
 *
 * @param {string} operation - Operation name
 * @returns {object} Timer object with end method
 *
 * @example
 * ```typescript
 * const timer = createPerformanceTimer('database_query');
 * await executeQuery();
 * const log = timer.end({ query: 'SELECT ...' });
 * ```
 */
const createPerformanceTimer = (operation) => {
    const startTime = Date.now();
    return {
        end: (metadata) => {
            const duration = Date.now() - startTime;
            return (0, exports.createPerformanceLog)(operation, duration, metadata);
        },
    };
};
exports.createPerformanceTimer = createPerformanceTimer;
/**
 * Checks if operation duration exceeds threshold.
 *
 * @param {number} duration - Operation duration in milliseconds
 * @param {number} threshold - Threshold in milliseconds
 * @returns {boolean} True if threshold exceeded
 *
 * @example
 * ```typescript
 * if (exceedsPerformanceThreshold(duration, 1000)) {
 *   logger.warn('Slow operation detected');
 * }
 * ```
 */
const exceedsPerformanceThreshold = (duration, threshold) => {
    return duration > threshold;
};
exports.exceedsPerformanceThreshold = exceedsPerformanceThreshold;
/**
 * Creates a slow operation warning log.
 *
 * @param {string} operation - Operation name
 * @param {number} duration - Operation duration
 * @param {number} threshold - Performance threshold
 * @returns {LogEntry} Warning log entry
 *
 * @example
 * ```typescript
 * const log = createSlowOperationLog('database_query', 5000, 1000);
 * ```
 */
const createSlowOperationLog = (operation, duration, threshold) => {
    return (0, exports.createWarningLog)(`Slow operation detected: ${operation}`, {
        metadata: {
            operation,
            duration,
            threshold,
            exceededBy: duration - threshold,
        },
        tags: ['performance', 'slow'],
    });
};
exports.createSlowOperationLog = createSlowOperationLog;
// ============================================================================
// DATABASE QUERY LOGGING
// ============================================================================
/**
 * Creates a database query log entry.
 *
 * @param {string} query - SQL query
 * @param {number} duration - Query duration in milliseconds
 * @param {number} [rows] - Number of rows affected/returned
 * @returns {LogEntry} Database query log entry
 *
 * @example
 * ```typescript
 * const log = createDatabaseQueryLog(
 *   'SELECT * FROM patients WHERE active = true',
 *   45,
 *   150
 * );
 * ```
 */
const createDatabaseQueryLog = (query, duration, rows) => {
    return (0, exports.createDebugLog)('Database query executed', {
        duration,
        metadata: {
            query: (0, exports.sanitizeDatabaseQuery)(query),
            duration,
            rows,
        },
        tags: ['database', 'query'],
    });
};
exports.createDatabaseQueryLog = createDatabaseQueryLog;
/**
 * Sanitizes database query to remove sensitive values.
 *
 * @param {string} query - SQL query
 * @returns {string} Sanitized query
 *
 * @example
 * ```typescript
 * const sanitized = sanitizeDatabaseQuery(
 *   "SELECT * FROM users WHERE password = 'secret123'"
 * );
 * // Result: "SELECT * FROM users WHERE password = '***'"
 * ```
 */
const sanitizeDatabaseQuery = (query) => {
    // Replace string values with ***
    return query.replace(/'[^']*'/g, "'***'");
};
exports.sanitizeDatabaseQuery = sanitizeDatabaseQuery;
/**
 * Creates a slow database query warning log.
 *
 * @param {string} query - SQL query
 * @param {number} duration - Query duration in milliseconds
 * @param {number} threshold - Performance threshold
 * @returns {LogEntry} Warning log entry
 *
 * @example
 * ```typescript
 * const log = createSlowQueryLog('SELECT * FROM large_table', 5000, 1000);
 * ```
 */
const createSlowQueryLog = (query, duration, threshold) => {
    return (0, exports.createWarningLog)('Slow database query detected', {
        duration,
        metadata: {
            query: (0, exports.sanitizeDatabaseQuery)(query),
            duration,
            threshold,
        },
        tags: ['database', 'slow', 'performance'],
    });
};
exports.createSlowQueryLog = createSlowQueryLog;
// ============================================================================
// LOG FORMATTING
// ============================================================================
/**
 * Formats log entry as JSON string.
 *
 * @param {LogEntry} entry - Log entry
 * @param {boolean} [pretty] - Enable pretty printing
 * @returns {string} JSON formatted log
 *
 * @example
 * ```typescript
 * const json = formatLogAsJson(logEntry, true);
 * ```
 */
const formatLogAsJson = (entry, pretty = false) => {
    return pretty ? JSON.stringify(entry, null, 2) : JSON.stringify(entry);
};
exports.formatLogAsJson = formatLogAsJson;
/**
 * Formats log entry as human-readable text.
 *
 * @param {LogEntry} entry - Log entry
 * @returns {string} Text formatted log
 *
 * @example
 * ```typescript
 * const text = formatLogAsText(logEntry);
 * // Result: "[2024-01-15T10:30:00Z] INFO: User login successful"
 * ```
 */
const formatLogAsText = (entry) => {
    const timestamp = entry.timestamp.toISOString();
    const level = entry.level.toUpperCase().padEnd(7);
    const context = entry.context ? `[${entry.context}]` : '';
    const requestId = entry.requestId ? `[${entry.requestId}]` : '';
    return `[${timestamp}] ${level} ${context}${requestId} ${entry.message}`;
};
exports.formatLogAsText = formatLogAsText;
/**
 * Formats log entry in Elastic Common Schema (ECS) format.
 *
 * @param {LogEntry} entry - Log entry
 * @returns {Record<string, any>} ECS formatted log
 *
 * @example
 * ```typescript
 * const ecs = formatLogAsECS(logEntry);
 * // Compatible with Elasticsearch/Elastic Stack
 * ```
 */
const formatLogAsECS = (entry) => {
    return {
        '@timestamp': entry.timestamp.toISOString(),
        'log.level': entry.level,
        message: entry.message,
        'trace.id': entry.correlationId,
        'transaction.id': entry.requestId,
        'user.id': entry.userId,
        labels: entry.tags,
        error: entry.error
            ? {
                message: entry.error.message,
                stack_trace: entry.error.stack,
                type: entry.error.name,
                code: entry.error.code,
            }
            : undefined,
        ...entry.metadata,
    };
};
exports.formatLogAsECS = formatLogAsECS;
/**
 * Adds color codes to log level for terminal output.
 *
 * @param {LogLevel} level - Log level
 * @returns {string} Colorized log level
 *
 * @example
 * ```typescript
 * const colored = colorizeLogLevel(LogLevel.ERROR);
 * // Returns ANSI color-coded string for terminal
 * ```
 */
const colorizeLogLevel = (level) => {
    const colors = {
        [LogLevel.ERROR]: '\x1b[31m', // Red
        [LogLevel.WARN]: '\x1b[33m', // Yellow
        [LogLevel.INFO]: '\x1b[36m', // Cyan
        [LogLevel.HTTP]: '\x1b[35m', // Magenta
        [LogLevel.VERBOSE]: '\x1b[37m', // White
        [LogLevel.DEBUG]: '\x1b[32m', // Green
        [LogLevel.SILLY]: '\x1b[90m', // Gray
    };
    const reset = '\x1b[0m';
    return `${colors[level]}${level.toUpperCase()}${reset}`;
};
exports.colorizeLogLevel = colorizeLogLevel;
// ============================================================================
// CORRELATION ID MANAGEMENT
// ============================================================================
/**
 * Generates a unique correlation ID for request tracking.
 *
 * @returns {string} Correlation ID
 *
 * @example
 * ```typescript
 * const correlationId = generateCorrelationId();
 * // Result: 'corr-1a2b3c4d5e6f7g8h'
 * ```
 */
const generateCorrelationId = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 15);
    return `corr-${timestamp}-${random}`;
};
exports.generateCorrelationId = generateCorrelationId;
/**
 * Extracts correlation ID from request headers.
 *
 * @param {any} headers - Request headers
 * @param {string} [headerName] - Correlation ID header name
 * @returns {string | undefined} Correlation ID
 *
 * @example
 * ```typescript
 * const correlationId = extractCorrelationId(req.headers);
 * ```
 */
const extractCorrelationId = (headers, headerName = 'x-correlation-id') => {
    return headers[headerName] || headers[headerName.toLowerCase()];
};
exports.extractCorrelationId = extractCorrelationId;
/**
 * Adds correlation ID to log entry.
 *
 * @param {LogEntry} entry - Log entry
 * @param {string} correlationId - Correlation ID
 * @returns {LogEntry} Log entry with correlation ID
 *
 * @example
 * ```typescript
 * const log = addCorrelationId(logEntry, 'corr-123');
 * ```
 */
const addCorrelationId = (entry, correlationId) => {
    return {
        ...entry,
        correlationId,
    };
};
exports.addCorrelationId = addCorrelationId;
// ============================================================================
// LOG LEVEL MANAGEMENT
// ============================================================================
/**
 * Checks if log should be written based on configured level.
 *
 * @param {LogLevel} entryLevel - Log entry level
 * @param {LogLevel} configuredLevel - Configured minimum log level
 * @returns {boolean} True if log should be written
 *
 * @example
 * ```typescript
 * if (shouldLog(LogLevel.DEBUG, LogLevel.INFO)) {
 *   // This debug log will NOT be written
 * }
 * ```
 */
const shouldLog = (entryLevel, configuredLevel) => {
    const levels = Object.values(LogLevel);
    const entryIndex = levels.indexOf(entryLevel);
    const configIndex = levels.indexOf(configuredLevel);
    return entryIndex <= configIndex;
};
exports.shouldLog = shouldLog;
/**
 * Gets numeric priority for log level.
 *
 * @param {LogLevel} level - Log level
 * @returns {number} Numeric priority (0 = highest)
 *
 * @example
 * ```typescript
 * const priority = getLogLevelPriority(LogLevel.ERROR);
 * // Result: 0 (highest priority)
 * ```
 */
const getLogLevelPriority = (level) => {
    const priorities = {
        [LogLevel.ERROR]: 0,
        [LogLevel.WARN]: 1,
        [LogLevel.INFO]: 2,
        [LogLevel.HTTP]: 3,
        [LogLevel.VERBOSE]: 4,
        [LogLevel.DEBUG]: 5,
        [LogLevel.SILLY]: 6,
    };
    return priorities[level];
};
exports.getLogLevelPriority = getLogLevelPriority;
/**
 * Parses log level from string (case-insensitive).
 *
 * @param {string} level - Log level string
 * @param {LogLevel} [defaultLevel] - Default level if parsing fails
 * @returns {LogLevel} Parsed log level
 *
 * @example
 * ```typescript
 * const level = parseLogLevel('ERROR'); // LogLevel.ERROR
 * const level2 = parseLogLevel('invalid', LogLevel.INFO); // LogLevel.INFO
 * ```
 */
const parseLogLevel = (level, defaultLevel = LogLevel.INFO) => {
    const normalized = level.toLowerCase();
    return Object.values(LogLevel).includes(normalized) ? normalized : defaultLevel;
};
exports.parseLogLevel = parseLogLevel;
// ============================================================================
// LOG SAMPLING
// ============================================================================
/**
 * Determines if log should be sampled based on sampling configuration.
 *
 * @param {LogEntry} entry - Log entry
 * @param {LogSamplingConfig} config - Sampling configuration
 * @returns {boolean} True if log should be written
 *
 * @example
 * ```typescript
 * const shouldWrite = shouldSampleLog(logEntry, {
 *   sampleRate: 0.1, // 10% sampling
 *   excludeLevels: [LogLevel.ERROR] // Always log errors
 * });
 * ```
 */
const shouldSampleLog = (entry, config) => {
    // Always include excluded levels (typically errors)
    if (config.excludeLevels?.includes(entry.level)) {
        return true;
    }
    // Random sampling
    return Math.random() < config.sampleRate;
};
exports.shouldSampleLog = shouldSampleLog;
/**
 * Creates a log sampling configuration.
 *
 * @param {Partial<LogSamplingConfig>} config - Sampling configuration
 * @returns {LogSamplingConfig} Complete sampling configuration
 *
 * @example
 * ```typescript
 * const config = createSamplingConfig({
 *   sampleRate: 0.1,
 *   excludeLevels: [LogLevel.ERROR, LogLevel.WARN]
 * });
 * ```
 */
const createSamplingConfig = (config) => {
    return {
        sampleRate: 1.0,
        excludeLevels: [LogLevel.ERROR, LogLevel.WARN],
        ...config,
    };
};
exports.createSamplingConfig = createSamplingConfig;
// ============================================================================
// CONTEXT-AWARE LOGGING
// ============================================================================
/**
 * Creates a context-aware logger function.
 *
 * @param {string} context - Logger context (e.g., service name)
 * @returns {object} Logger with context methods
 *
 * @example
 * ```typescript
 * const logger = createContextLogger('UserService');
 * logger.info('User created', { userId: '123' });
 * ```
 */
const createContextLogger = (context) => {
    return {
        error: (message, error, metadata) => error
            ? (0, exports.createErrorLog)(message, error, { context, metadata })
            : (0, exports.createLogEntry)(LogLevel.ERROR, message, { context, metadata }),
        warn: (message, metadata) => (0, exports.createWarningLog)(message, { context, metadata }),
        info: (message, metadata) => (0, exports.createInfoLog)(message, { context, metadata }),
        debug: (message, metadata) => (0, exports.createDebugLog)(message, { context, metadata }),
        http: (message, metadata) => (0, exports.createLogEntry)(LogLevel.HTTP, message, { context, metadata }),
    };
};
exports.createContextLogger = createContextLogger;
/**
 * Adds context to existing log entry.
 *
 * @param {LogEntry} entry - Log entry
 * @param {string} context - Context to add
 * @returns {LogEntry} Log entry with context
 *
 * @example
 * ```typescript
 * const log = addLogContext(logEntry, 'DatabaseService');
 * ```
 */
const addLogContext = (entry, context) => {
    return {
        ...entry,
        context,
    };
};
exports.addLogContext = addLogContext;
/**
 * Adds metadata to existing log entry.
 *
 * @param {LogEntry} entry - Log entry
 * @param {Record<string, any>} metadata - Metadata to add
 * @returns {LogEntry} Log entry with merged metadata
 *
 * @example
 * ```typescript
 * const log = addLogMetadata(logEntry, { userId: '123', action: 'create' });
 * ```
 */
const addLogMetadata = (entry, metadata) => {
    return {
        ...entry,
        metadata: {
            ...entry.metadata,
            ...metadata,
        },
    };
};
exports.addLogMetadata = addLogMetadata;
/**
 * Adds tags to existing log entry.
 *
 * @param {LogEntry} entry - Log entry
 * @param {string[]} tags - Tags to add
 * @returns {LogEntry} Log entry with merged tags
 *
 * @example
 * ```typescript
 * const log = addLogTags(logEntry, ['payment', 'stripe']);
 * ```
 */
const addLogTags = (entry, tags) => {
    return {
        ...entry,
        tags: [...(entry.tags || []), ...tags],
    };
};
exports.addLogTags = addLogTags;
// ============================================================================
// LOG AGGREGATION HELPERS
// ============================================================================
/**
 * Groups logs by level.
 *
 * @param {LogEntry[]} logs - Array of log entries
 * @returns {Record<LogLevel, LogEntry[]>} Logs grouped by level
 *
 * @example
 * ```typescript
 * const grouped = groupLogsByLevel(logEntries);
 * // Result: { error: [...], warn: [...], info: [...] }
 * ```
 */
const groupLogsByLevel = (logs) => {
    return logs.reduce((acc, log) => {
        if (!acc[log.level]) {
            acc[log.level] = [];
        }
        acc[log.level].push(log);
        return acc;
    }, {});
};
exports.groupLogsByLevel = groupLogsByLevel;
/**
 * Filters logs by time range.
 *
 * @param {LogEntry[]} logs - Array of log entries
 * @param {Date} startTime - Start time
 * @param {Date} endTime - End time
 * @returns {LogEntry[]} Filtered logs
 *
 * @example
 * ```typescript
 * const filtered = filterLogsByTimeRange(
 *   logs,
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * ```
 */
const filterLogsByTimeRange = (logs, startTime, endTime) => {
    return logs.filter((log) => {
        const timestamp = new Date(log.timestamp);
        return timestamp >= startTime && timestamp <= endTime;
    });
};
exports.filterLogsByTimeRange = filterLogsByTimeRange;
/**
 * Calculates log statistics.
 *
 * @param {LogEntry[]} logs - Array of log entries
 * @returns {object} Log statistics
 *
 * @example
 * ```typescript
 * const stats = calculateLogStats(logEntries);
 * // Result: { total: 1500, errorCount: 45, warnCount: 120, ... }
 * ```
 */
const calculateLogStats = (logs) => {
    const levelCounts = (0, exports.groupLogsByLevel)(logs);
    return {
        total: logs.length,
        errorCount: levelCounts[LogLevel.ERROR]?.length || 0,
        warnCount: levelCounts[LogLevel.WARN]?.length || 0,
        infoCount: levelCounts[LogLevel.INFO]?.length || 0,
        debugCount: levelCounts[LogLevel.DEBUG]?.length || 0,
        avgDuration: logs.reduce((sum, log) => sum + (log.duration || 0), 0) / logs.length || 0,
        uniqueUsers: new Set(logs.map((log) => log.userId).filter(Boolean)).size,
        uniqueContexts: new Set(logs.map((log) => log.context).filter(Boolean)).size,
    };
};
exports.calculateLogStats = calculateLogStats;
exports.default = {
    // Structured logging
    createLogEntry: exports.createLogEntry,
    createErrorLog: exports.createErrorLog,
    createWarningLog: exports.createWarningLog,
    createInfoLog: exports.createInfoLog,
    createDebugLog: exports.createDebugLog,
    // Error logging
    extractErrorDetails: exports.extractErrorDetails,
    formatStackTrace: exports.formatStackTrace,
    sanitizeError: exports.sanitizeError,
    createHttpErrorLog: exports.createHttpErrorLog,
    // Request logging
    createRequestLog: exports.createRequestLog,
    createRequestStartLog: exports.createRequestStartLog,
    createRequestEndLog: exports.createRequestEndLog,
    extractRequestContext: exports.extractRequestContext,
    // Performance logging
    createPerformanceLog: exports.createPerformanceLog,
    createPerformanceTimer: exports.createPerformanceTimer,
    exceedsPerformanceThreshold: exports.exceedsPerformanceThreshold,
    createSlowOperationLog: exports.createSlowOperationLog,
    // Database query logging
    createDatabaseQueryLog: exports.createDatabaseQueryLog,
    sanitizeDatabaseQuery: exports.sanitizeDatabaseQuery,
    createSlowQueryLog: exports.createSlowQueryLog,
    // Log formatting
    formatLogAsJson: exports.formatLogAsJson,
    formatLogAsText: exports.formatLogAsText,
    formatLogAsECS: exports.formatLogAsECS,
    colorizeLogLevel: exports.colorizeLogLevel,
    // Correlation ID management
    generateCorrelationId: exports.generateCorrelationId,
    extractCorrelationId: exports.extractCorrelationId,
    addCorrelationId: exports.addCorrelationId,
    // Log level management
    shouldLog: exports.shouldLog,
    getLogLevelPriority: exports.getLogLevelPriority,
    parseLogLevel: exports.parseLogLevel,
    // Log sampling
    shouldSampleLog: exports.shouldSampleLog,
    createSamplingConfig: exports.createSamplingConfig,
    // Context-aware logging
    createContextLogger: exports.createContextLogger,
    addLogContext: exports.addLogContext,
    addLogMetadata: exports.addLogMetadata,
    addLogTags: exports.addLogTags,
    // Log aggregation
    groupLogsByLevel: exports.groupLogsByLevel,
    filterLogsByTimeRange: exports.filterLogsByTimeRange,
    calculateLogStats: exports.calculateLogStats,
};
//# sourceMappingURL=logging-utils.js.map