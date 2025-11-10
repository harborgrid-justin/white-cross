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
export declare enum LogLevel {
    ERROR = "error",
    WARN = "warn",
    INFO = "info",
    HTTP = "http",
    VERBOSE = "verbose",
    DEBUG = "debug",
    SILLY = "silly"
}
export declare enum LogFormat {
    JSON = "json",
    TEXT = "text",
    PRETTY = "pretty",
    ECS = "ecs"
}
export interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: Date;
    correlationId?: string;
    requestId?: string;
    userId?: string;
    context?: string;
    metadata?: Record<string, any>;
    error?: ErrorDetails;
    duration?: number;
    tags?: string[];
}
export interface ErrorDetails {
    name: string;
    message: string;
    stack?: string;
    code?: string;
    statusCode?: number;
    context?: Record<string, any>;
}
export interface RequestLogContext {
    requestId: string;
    method: string;
    url: string;
    statusCode?: number;
    duration?: number;
    userId?: string;
    userAgent?: string;
    ipAddress?: string;
    correlationId?: string;
}
export interface PerformanceLogEntry {
    operation: string;
    duration: number;
    timestamp: Date;
    metadata?: Record<string, any>;
    threshold?: number;
    exceededThreshold?: boolean;
}
export interface LoggerConfig {
    level: LogLevel;
    format: LogFormat;
    enableConsole: boolean;
    enableFile: boolean;
    filePath?: string;
    maxFileSize?: string;
    maxFiles?: number;
    enableRotation: boolean;
    colorize?: boolean;
    prettyPrint?: boolean;
}
export interface LogSamplingConfig {
    sampleRate: number;
    excludeLevels?: LogLevel[];
    includePaths?: string[];
    excludePaths?: string[];
}
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
export declare const createLogEntry: (level: LogLevel, message: string, options?: Partial<LogEntry>) => LogEntry;
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
export declare const createErrorLog: (message: string, error: Error, options?: Partial<LogEntry>) => LogEntry;
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
export declare const createWarningLog: (message: string, options?: Partial<LogEntry>) => LogEntry;
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
export declare const createInfoLog: (message: string, options?: Partial<LogEntry>) => LogEntry;
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
export declare const createDebugLog: (message: string, options?: Partial<LogEntry>) => LogEntry;
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
export declare const extractErrorDetails: (error: Error | any) => ErrorDetails;
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
export declare const formatStackTrace: (stack: string | undefined, maxLines?: number) => string | undefined;
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
export declare const sanitizeError: (error: Error | any, sensitiveKeys?: string[]) => ErrorDetails;
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
export declare const createHttpErrorLog: (statusCode: number, message: string, requestContext: RequestLogContext) => LogEntry;
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
export declare const createRequestLog: (context: RequestLogContext) => LogEntry;
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
export declare const createRequestStartLog: (requestId: string, method: string, url: string) => LogEntry;
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
export declare const createRequestEndLog: (requestId: string, method: string, url: string, statusCode: number, duration: number) => LogEntry;
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
export declare const extractRequestContext: (request: any) => Partial<RequestLogContext>;
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
export declare const createPerformanceLog: (operation: string, duration: number, metadata?: Record<string, any>) => PerformanceLogEntry;
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
export declare const createPerformanceTimer: (operation: string) => {
    end: (metadata?: Record<string, any>) => PerformanceLogEntry;
};
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
export declare const exceedsPerformanceThreshold: (duration: number, threshold: number) => boolean;
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
export declare const createSlowOperationLog: (operation: string, duration: number, threshold: number) => LogEntry;
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
export declare const createDatabaseQueryLog: (query: string, duration: number, rows?: number) => LogEntry;
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
export declare const sanitizeDatabaseQuery: (query: string) => string;
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
export declare const createSlowQueryLog: (query: string, duration: number, threshold: number) => LogEntry;
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
export declare const formatLogAsJson: (entry: LogEntry, pretty?: boolean) => string;
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
export declare const formatLogAsText: (entry: LogEntry) => string;
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
export declare const formatLogAsECS: (entry: LogEntry) => Record<string, any>;
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
export declare const colorizeLogLevel: (level: LogLevel) => string;
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
export declare const generateCorrelationId: () => string;
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
export declare const extractCorrelationId: (headers: any, headerName?: string) => string | undefined;
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
export declare const addCorrelationId: (entry: LogEntry, correlationId: string) => LogEntry;
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
export declare const shouldLog: (entryLevel: LogLevel, configuredLevel: LogLevel) => boolean;
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
export declare const getLogLevelPriority: (level: LogLevel) => number;
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
export declare const parseLogLevel: (level: string, defaultLevel?: LogLevel) => LogLevel;
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
export declare const shouldSampleLog: (entry: LogEntry, config: LogSamplingConfig) => boolean;
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
export declare const createSamplingConfig: (config: Partial<LogSamplingConfig>) => LogSamplingConfig;
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
export declare const createContextLogger: (context: string) => {
    error: (message: string, error?: Error, metadata?: Record<string, any>) => LogEntry;
    warn: (message: string, metadata?: Record<string, any>) => LogEntry;
    info: (message: string, metadata?: Record<string, any>) => LogEntry;
    debug: (message: string, metadata?: Record<string, any>) => LogEntry;
    http: (message: string, metadata?: Record<string, any>) => LogEntry;
};
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
export declare const addLogContext: (entry: LogEntry, context: string) => LogEntry;
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
export declare const addLogMetadata: (entry: LogEntry, metadata: Record<string, any>) => LogEntry;
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
export declare const addLogTags: (entry: LogEntry, tags: string[]) => LogEntry;
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
export declare const groupLogsByLevel: (logs: LogEntry[]) => Record<string, LogEntry[]>;
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
export declare const filterLogsByTimeRange: (logs: LogEntry[], startTime: Date, endTime: Date) => LogEntry[];
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
export declare const calculateLogStats: (logs: LogEntry[]) => {
    total: number;
    errorCount: number;
    warnCount: number;
    infoCount: number;
    debugCount: number;
    avgDuration: number;
    uniqueUsers: number;
    uniqueContexts: number;
};
declare const _default: {
    createLogEntry: (level: LogLevel, message: string, options?: Partial<LogEntry>) => LogEntry;
    createErrorLog: (message: string, error: Error, options?: Partial<LogEntry>) => LogEntry;
    createWarningLog: (message: string, options?: Partial<LogEntry>) => LogEntry;
    createInfoLog: (message: string, options?: Partial<LogEntry>) => LogEntry;
    createDebugLog: (message: string, options?: Partial<LogEntry>) => LogEntry;
    extractErrorDetails: (error: Error | any) => ErrorDetails;
    formatStackTrace: (stack: string | undefined, maxLines?: number) => string | undefined;
    sanitizeError: (error: Error | any, sensitiveKeys?: string[]) => ErrorDetails;
    createHttpErrorLog: (statusCode: number, message: string, requestContext: RequestLogContext) => LogEntry;
    createRequestLog: (context: RequestLogContext) => LogEntry;
    createRequestStartLog: (requestId: string, method: string, url: string) => LogEntry;
    createRequestEndLog: (requestId: string, method: string, url: string, statusCode: number, duration: number) => LogEntry;
    extractRequestContext: (request: any) => Partial<RequestLogContext>;
    createPerformanceLog: (operation: string, duration: number, metadata?: Record<string, any>) => PerformanceLogEntry;
    createPerformanceTimer: (operation: string) => {
        end: (metadata?: Record<string, any>) => PerformanceLogEntry;
    };
    exceedsPerformanceThreshold: (duration: number, threshold: number) => boolean;
    createSlowOperationLog: (operation: string, duration: number, threshold: number) => LogEntry;
    createDatabaseQueryLog: (query: string, duration: number, rows?: number) => LogEntry;
    sanitizeDatabaseQuery: (query: string) => string;
    createSlowQueryLog: (query: string, duration: number, threshold: number) => LogEntry;
    formatLogAsJson: (entry: LogEntry, pretty?: boolean) => string;
    formatLogAsText: (entry: LogEntry) => string;
    formatLogAsECS: (entry: LogEntry) => Record<string, any>;
    colorizeLogLevel: (level: LogLevel) => string;
    generateCorrelationId: () => string;
    extractCorrelationId: (headers: any, headerName?: string) => string | undefined;
    addCorrelationId: (entry: LogEntry, correlationId: string) => LogEntry;
    shouldLog: (entryLevel: LogLevel, configuredLevel: LogLevel) => boolean;
    getLogLevelPriority: (level: LogLevel) => number;
    parseLogLevel: (level: string, defaultLevel?: LogLevel) => LogLevel;
    shouldSampleLog: (entry: LogEntry, config: LogSamplingConfig) => boolean;
    createSamplingConfig: (config: Partial<LogSamplingConfig>) => LogSamplingConfig;
    createContextLogger: (context: string) => {
        error: (message: string, error?: Error, metadata?: Record<string, any>) => LogEntry;
        warn: (message: string, metadata?: Record<string, any>) => LogEntry;
        info: (message: string, metadata?: Record<string, any>) => LogEntry;
        debug: (message: string, metadata?: Record<string, any>) => LogEntry;
        http: (message: string, metadata?: Record<string, any>) => LogEntry;
    };
    addLogContext: (entry: LogEntry, context: string) => LogEntry;
    addLogMetadata: (entry: LogEntry, metadata: Record<string, any>) => LogEntry;
    addLogTags: (entry: LogEntry, tags: string[]) => LogEntry;
    groupLogsByLevel: (logs: LogEntry[]) => Record<string, LogEntry[]>;
    filterLogsByTimeRange: (logs: LogEntry[], startTime: Date, endTime: Date) => LogEntry[];
    calculateLogStats: (logs: LogEntry[]) => {
        total: number;
        errorCount: number;
        warnCount: number;
        infoCount: number;
        debugCount: number;
        avgDuration: number;
        uniqueUsers: number;
        uniqueContexts: number;
    };
};
export default _default;
//# sourceMappingURL=logging-utils.d.ts.map