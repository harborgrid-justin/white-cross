/**
 * @fileoverview Simple Logger Utility for Application-Wide Logging
 * @module utils/logger
 * @description Provides consistent logging interface for database operations,
 * business logic, and system events. Supports multiple log levels with
 * structured output for monitoring and debugging.
 *
 * OPERATIONS: Centralized logging for all application components
 * MONITORING: Structured logs for log aggregation systems
 * DEBUGGING: Support for debug-level logging in development
 *
 * @remarks This is a simple console-based logger implementation.
 * For production use, consider integrating Winston, Pino, or similar
 * logging frameworks with log rotation, file persistence, and remote logging.
 *
 * @example
 * ```typescript
 * import { logger } from '@/utils/logger';
 *
 * // Info level - general information
 * logger.info('User authenticated', { userId: '123' });
 *
 * // Error level - exceptions and failures
 * logger.error('Database connection failed', { error: err.message });
 *
 * // Warning level - potential issues
 * logger.warn('API rate limit approaching', { usage: '90%' });
 *
 * // Debug level - detailed diagnostic information
 * logger.debug('Query executed', { sql: query, params: values });
 * ```
 *
 * @since 1.0.0
 */

/**
 * Logger interface definition
 *
 * @interface Logger
 * @property {Function} info - Log informational messages
 * @property {Function} error - Log error messages
 * @property {Function} warn - Log warning messages
 * @property {Function} debug - Log debug messages
 */
export interface Logger {
  info: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
  debug: (message: string, ...args: any[]) => void;
}

/**
 * Application logger instance providing structured logging capabilities
 *
 * @description Centralized logger for all application components including
 * database operations, business logic, API requests, and system events.
 * Outputs to console with level prefixes for easy filtering.
 *
 * @example
 * ```typescript
 * // Log successful operations
 * logger.info('Student record created', { studentId: student.id, name: student.name });
 *
 * // Log errors with context
 * try {
 *   await saveData();
 * } catch (error) {
 *   logger.error('Failed to save data', { error: error.message, stack: error.stack });
 * }
 *
 * // Log warnings for potential issues
 * logger.warn('Deprecated API endpoint called', { endpoint: '/old/api', userId: user.id });
 *
 * // Log debug information
 * logger.debug('Cache hit', { key: cacheKey, ttl: 3600 });
 * ```
 *
 * @constant
 * @type {Logger}
 */
export const logger: Logger = {
  /**
   * Log informational messages for normal operations and events
   *
   * @description Use for tracking successful operations, state changes,
   * and general flow of the application. Info logs should be used for
   * events that are part of normal system operation.
   *
   * @param {string} message - Primary log message describing the event
   * @param {...any[]} args - Additional context data (objects, values, etc.)
   *
   * @example
   * ```typescript
   * logger.info('User logged in successfully', { userId: user.id, email: user.email });
   * logger.info('Medication administered', { medicationId, studentId, timestamp: new Date() });
   * ```
   */
  info: (message: string, ...args: any[]) => {
    console.log(`[INFO] ${message}`, ...args);
  },

  /**
   * Log error messages for failures, exceptions, and critical issues
   *
   * @description Use for errors that require attention or indicate system
   * failures. Should include error context, stack traces, and relevant data
   * for debugging and alerting.
   *
   * @param {string} message - Primary error message
   * @param {...any[]} args - Error context (error object, stack trace, request data)
   *
   * @example
   * ```typescript
   * logger.error('Database query failed', {
   *   error: err.message,
   *   query: 'SELECT * FROM users',
   *   params: [userId]
   * });
   *
   * logger.error('Authentication failed', {
   *   userId: attemptedUserId,
   *   reason: 'Invalid credentials',
   *   ipAddress: req.ip
   * });
   * ```
   */
  error: (message: string, ...args: any[]) => {
    console.error(`[ERROR] ${message}`, ...args);
  },

  /**
   * Log warning messages for potential issues or unusual conditions
   *
   * @description Use for situations that are not errors but may indicate
   * potential problems, deprecated features, resource constraints, or
   * conditions that should be monitored.
   *
   * @param {string} message - Warning message
   * @param {...any[]} args - Context about the warning condition
   *
   * @example
   * ```typescript
   * logger.warn('API rate limit threshold exceeded', {
   *   userId: user.id,
   *   currentRate: 95,
   *   limit: 100
   * });
   *
   * logger.warn('Deprecated function called', {
   *   function: 'oldApiEndpoint',
   *   replacement: 'newApiEndpoint',
   *   caller: requestPath
   * });
   * ```
   */
  warn: (message: string, ...args: any[]) => {
    console.warn(`[WARN] ${message}`, ...args);
  },

  /**
   * Log detailed debug information for development and troubleshooting
   *
   * @description Use for verbose logging that helps with debugging and
   * understanding system behavior. Debug logs should be disabled in
   * production or filtered by log level configuration.
   *
   * @param {string} message - Debug message
   * @param {...any[]} args - Detailed diagnostic data
   *
   * @example
   * ```typescript
   * logger.debug('Cache operation', {
   *   operation: 'set',
   *   key: 'user:123',
   *   value: userData,
   *   ttl: 3600
   * });
   *
   * logger.debug('Query execution plan', {
   *   query: sql,
   *   executionTime: '15ms',
   *   rowsAffected: 42
   * });
   * ```
   */
  debug: (message: string, ...args: any[]) => {
    console.debug(`[DEBUG] ${message}`, ...args);
  }
};

/**
 * Default export for convenient importing
 *
 * @example
 * ```typescript
 * import logger from '@/utils/logger';
 * logger.info('Application started');
 * ```
 */
export default logger;
