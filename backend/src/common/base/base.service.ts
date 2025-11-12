import { Injectable, Logger } from '@nestjs/common';

/**
 * Base service class that provides common functionality for all services.
 * Eliminates duplication of Logger initialization and common service patterns.
 */
@Injectable()
export abstract class BaseService {
  protected readonly logger: Logger;

  constructor(context?: string) {
    this.logger = new Logger(context || this.constructor.name);
  }

  /**
   * Log an info message with consistent formatting
   */
  protected logInfo(message: string, context?: string): void {
    this.logger.log(message, context);
  }

  /**
   * Log an error message with consistent formatting
   */
  protected logError(message: string, trace?: string, context?: string): void {
    this.logger.error(message, trace, context);
  }

  /**
   * Log a warning message with consistent formatting
   */
  protected logWarning(message: string, context?: string): void {
    this.logger.warn(message, context);
  }

  /**
   * Log a debug message with consistent formatting
   */
  protected logDebug(message: string, context?: string): void {
    this.logger.debug(message, context);
  }

  /**
   * Log a verbose message with consistent formatting
   */
  protected logVerbose(message: string, context?: string): void {
    this.logger.verbose(message, context);
  }

  /**
   * Handle and log errors consistently across services
   */
  protected handleError(error: any, operation: string, context?: string): void {
    const errorMessage = `Failed to ${operation}: ${
      error instanceof Error ? error.message : String(error)
    }`;
    this.logError(errorMessage, error instanceof Error ? error.stack : undefined, context);
    throw error;
  }

  /**
   * Validate required parameters and throw descriptive errors
   */
  protected validateRequired(params: Record<string, any>, operation: string): void {
    const missing = Object.entries(params)
      .filter(([, value]) => value === undefined || value === null)
      .map(([key]) => key);

    if (missing.length > 0) {
      const error = new Error(
        `Missing required parameters for ${operation}: ${missing.join(', ')}`,
      );
      this.handleError(error, operation);
    }
  }

  /**
   * Execute operation with standardized error handling and logging
   */
  protected async executeWithLogging<T>(
    operation: string,
    fn: () => Promise<T>,
    context?: string,
  ): Promise<T> {
    try {
      this.logDebug(`Starting ${operation}`, context);
      const result = await fn();
      this.logDebug(`Completed ${operation}`, context);
      return result;
    } catch (error) {
      this.handleError(error, operation, context);
      throw error; // This won't be reached due to handleError throwing, but keeps TypeScript happy
    }
  }

  /**
   * Execute operation synchronously with standardized error handling and logging
   */
  protected executeSync<T>(operation: string, fn: () => T, context?: string): T {
    try {
      this.logDebug(`Starting ${operation}`, context);
      const result = fn();
      this.logDebug(`Completed ${operation}`, context);
      return result;
    } catch (error) {
      this.handleError(error, operation, context);
      throw error; // This won't be reached due to handleError throwing, but keeps TypeScript happy
    }
  }
}
