/**
 * @fileoverview Logger Service Interface
 * @module shared/interfaces/logger.interface
 * @description Interface for logging services
 */

/**
 * Logger Service Interface
 *
 * Defines the contract for logging services.
 * Implementations can be simple console loggers, Winston, or external services.
 */
export interface ILoggerService {
  /**
   * Log informational message
   */
  log(message: string, context?: any): void;

  /**
   * Log error message
   */
  error(message: string, trace?: string, context?: any): void;

  /**
   * Log warning message
   */
  warn(message: string, context?: any): void;

  /**
   * Log debug message
   */
  debug(message: string, context?: any): void;

  /**
   * Log verbose message
   */
  verbose?(message: string, context?: any): void;
}
