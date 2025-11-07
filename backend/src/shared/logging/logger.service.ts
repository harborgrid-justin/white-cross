/**
 * @fileoverview NestJS Logger Service - Centralized Logging
 * @module shared/logging/logger.service
 * @description Production-ready logging service using Winston
 *
 * Features:
 * - Winston-based logging with multiple transports
 * - Structured JSON logging for production
 * - Colored console output for development
 * - File-based logging (error.log, combined.log)
 * - Automatic metadata injection
 * - Error stack trace logging
 * - Context-aware logging
 *
 * LOC: LOGGER_SERVICE_NESTJS
 * UPSTREAM: winston
 * DOWNSTREAM: All NestJS modules, services, controllers
 */

import {
  Injectable,
  LoggerService as NestLoggerService,
  Scope,
  Inject,
} from '@nestjs/common';
import * as winston from 'winston';
import { AppConfigService } from '../../config/app-config.service';

/**
 * @class LoggerService
 * @description NestJS-compatible logger service using Winston
 * Implements NestJS LoggerService interface for framework integration
 * while providing additional logging capabilities
 *
 * @example
 * ```typescript
 * // In a service
 * constructor(private readonly logger: LoggerService) {}
 *
 * someMethod() {
 *   this.logger.log('Operation started', 'SomeService');
 *   this.logger.error('Operation failed', 'error details', 'SomeService');
 * }
 * ```
 */
@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements NestLoggerService {
  private readonly winston: winston.Logger;
  private context?: string;

  constructor(
    @Inject(AppConfigService) private readonly config: AppConfigService,
  ) {
    const logFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json(),
    );

    const consoleFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.colorize(),
      winston.format.printf(
        ({ timestamp, level, message, context, stack, ...meta }) => {
          let log = `${timestamp} [${context || 'Application'}] [${level}]: ${message}`;

          // If there's a stack trace, include it
          if (stack) {
            log += `\n${stack}`;
          }

          // If there's additional metadata, include it
          if (Object.keys(meta).length > 0) {
            log += `\n${JSON.stringify(meta, null, 2)}`;
          }

          return log;
        },
      ),
    );

    const logLevel = this.config.get<string>('app.logging.level', 'info');
    const isProduction = this.config.isProduction;

    this.winston = winston.createLogger({
      level: logLevel,
      format: logFormat,
      defaultMeta: { service: 'white-cross-api' },
      transports: [
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
        }),
      ],
    });

    if (!isProduction) {
      this.winston.add(
        new winston.transports.Console({
          format: consoleFormat,
        }),
      );
    }
  }

  /**
   * Set the logger context for all subsequent log messages
   * @param context - Context identifier (typically class name)
   */
  setContext(context: string): void {
    this.context = context;
  }

  /**
   * Log an informational message
   * @param message - Log message
   * @param context - Optional context override
   */
  log(message: any, context?: string): void {
    const logContext = context || this.context || 'Application';
    this.winston.info(message, { context: logContext });
  }

  /**
   * Log an informational message (alias for log)
   * @param message - Log message
   * @param context - Optional context override
   */
  info(message: any, context?: string): void {
    this.log(message, context);
  }

  /**
   * Log an error message with optional trace
   * @param message - Error message
   * @param trace - Stack trace or error details
   * @param context - Optional context override
   */
  error(message: any, trace?: string | Error, context?: string): void {
    const logContext = context || this.context || 'Application';

    if (trace instanceof Error) {
      this.winston.error(message, {
        context: logContext,
        error: trace.message,
        stack: trace.stack,
      });
    } else if (trace && typeof trace === 'object') {
      this.winston.error(message, {
        context: logContext,
        error: JSON.stringify(trace),
      });
    } else if (trace) {
      this.winston.error(`${message} ${trace}`, { context: logContext });
    } else {
      this.winston.error(message, { context: logContext });
    }
  }

  /**
   * Log a warning message
   * @param message - Warning message
   * @param context - Optional context override
   */
  warn(message: any, context?: string): void {
    const logContext = context || this.context || 'Application';
    this.winston.warn(message, { context: logContext });
  }

  /**
   * Log a debug message
   * @param message - Debug message
   * @param context - Optional context override
   */
  debug(message: any, context?: string): void {
    const logContext = context || this.context || 'Application';
    this.winston.debug(message, { context: logContext });
  }

  /**
   * Log a verbose message
   * @param message - Verbose message
   * @param context - Optional context override
   */
  verbose(message: any, context?: string): void {
    const logContext = context || this.context || 'Application';
    this.winston.verbose(message, { context: logContext });
  }

  /**
   * Log with metadata
   * @param level - Log level
   * @param message - Log message
   * @param metadata - Additional metadata
   * @param context - Optional context override
   */
  logWithMetadata(
    level: 'info' | 'error' | 'warn' | 'debug',
    message: string,
    metadata: Record<string, any>,
    context?: string,
  ): void {
    const logContext = context || this.context || 'Application';
    this.winston.log(level, message, { ...metadata, context: logContext });
  }
}

/**
 * Create a logger instance with a specific context
 * @param context - Logger context (typically class name)
 * @returns LoggerService instance with context set
 */
export function createLogger(context: string): LoggerService {
  const logger = new LoggerService();
  logger.setContext(context);
  return logger;
}

/**
 * Singleton logger instance for convenience
 */
export const logger = new LoggerService();

/**
 * Default export for convenience
 */
export default LoggerService;
