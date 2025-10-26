/**
 * Structured logging service for the White Cross Healthcare Platform
 *
 * Provides consistent, level-based logging with context support.
 * Automatically respects environment (development vs production).
 *
 * @module services/utils/logger
 * @security HIPAA Compliance - Ensure no PHI/PII is logged in production
 */

/**
 * Available log levels in order of severity
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

/**
 * Logger interface defining the contract for logging operations
 */
export interface Logger {
  /**
   * Log debug information (development only)
   * @param message - The message to log
   * @param context - Optional context object with additional data
   */
  debug(message: string, context?: Record<string, unknown>): void;

  /**
   * Log informational messages
   * @param message - The message to log
   * @param context - Optional context object with additional data
   */
  info(message: string, context?: Record<string, unknown>): void;

  /**
   * Log warning messages
   * @param message - The message to log
   * @param context - Optional context object with additional data
   */
  warn(message: string, context?: Record<string, unknown>): void;

  /**
   * Log error messages
   * @param message - The message to log
   * @param error - Optional Error object
   * @param context - Optional context object with additional data
   */
  error(message: string, error?: Error, context?: Record<string, unknown>): void;
}

/**
 * Console-based logger implementation with level filtering
 */
class ConsoleLogger implements Logger {
  private readonly minLevel: LogLevel;
  private readonly levelOrder: LogLevel[] = [
    LogLevel.DEBUG,
    LogLevel.INFO,
    LogLevel.WARN,
    LogLevel.ERROR,
  ];

  constructor(minLevel: LogLevel = LogLevel.INFO) {
    this.minLevel = minLevel;
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      const timestamp = new Date().toISOString();
      if (context && Object.keys(context).length > 0) {
        console.debug(`[${timestamp}] [DEBUG] ${message}`, context);
      } else {
        console.debug(`[${timestamp}] [DEBUG] ${message}`);
      }
    }
  }

  info(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog(LogLevel.INFO)) {
      const timestamp = new Date().toISOString();
      if (context && Object.keys(context).length > 0) {
        console.info(`[${timestamp}] [INFO] ${message}`, context);
      } else {
        console.info(`[${timestamp}] [INFO] ${message}`);
      }
    }
  }

  warn(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog(LogLevel.WARN)) {
      const timestamp = new Date().toISOString();
      if (context && Object.keys(context).length > 0) {
        console.warn(`[${timestamp}] [WARN] ${message}`, context);
      } else {
        console.warn(`[${timestamp}] [WARN] ${message}`);
      }
    }
  }

  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const timestamp = new Date().toISOString();
      const errorInfo: Record<string, unknown> = {
        ...(context || {}),
      };

      if (error) {
        errorInfo.error = {
          message: error.message,
          stack: error.stack,
          name: error.name,
        };
      }

      if (Object.keys(errorInfo).length > 0) {
        console.error(`[${timestamp}] [ERROR] ${message}`, errorInfo);
      } else {
        console.error(`[${timestamp}] [ERROR] ${message}`);
      }
    }
  }

  /**
   * Determines if a message at the given level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    const currentLevelIndex = this.levelOrder.indexOf(this.minLevel);
    const messageLevelIndex = this.levelOrder.indexOf(level);
    return messageLevelIndex >= currentLevelIndex;
  }
}

/**
 * Determine the appropriate log level based on environment
 */
function getLogLevel(): LogLevel {
  const env = process.env.NODE_ENV;

  // In development, show all logs including debug
  if (env === 'development') {
    return LogLevel.DEBUG;
  }

  // In test, only show warnings and errors
  if (env === 'test') {
    return LogLevel.WARN;
  }

  // In production, only show info and above (no debug)
  return LogLevel.INFO;
}

/**
 * Singleton logger instance configured based on environment
 *
 * @example
 * ```typescript
 * import { logger } from '@/services/utils/logger';
 *
 * // Simple logging
 * logger.info('User logged in successfully');
 *
 * // With context
 * logger.debug('API request started', { url: '/api/students', method: 'GET' });
 *
 * // Error logging
 * try {
 *   // ... some operation
 * } catch (error) {
 *   logger.error('Failed to fetch students', error as Error, { userId: '123' });
 * }
 * ```
 */
export const logger: Logger = new ConsoleLogger(getLogLevel());

/**
 * Create a logger with a specific context prefix
 * Useful for scoping logs to specific modules or services
 *
 * @param prefix - The prefix to prepend to all messages
 * @returns Logger instance with prefixed messages
 *
 * @example
 * ```typescript
 * const serviceLogger = createLogger('MedicationService');
 * serviceLogger.info('Fetching medications'); // Logs: [INFO] [MedicationService] Fetching medications
 * ```
 */
export function createLogger(prefix: string): Logger {
  return {
    debug: (message: string, context?: Record<string, unknown>) =>
      logger.debug(`[${prefix}] ${message}`, context),
    info: (message: string, context?: Record<string, unknown>) =>
      logger.info(`[${prefix}] ${message}`, context),
    warn: (message: string, context?: Record<string, unknown>) =>
      logger.warn(`[${prefix}] ${message}`, context),
    error: (message: string, error?: Error, context?: Record<string, unknown>) =>
      logger.error(`[${prefix}] ${message}`, error, context),
  };
}
