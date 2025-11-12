/**
 * Enterprise Logging Decorators
 *
 * Provides comprehensive logging capabilities for methods, controllers, and services
 * with support for different log levels, structured logging, and performance metrics.
 */

import { Injectable, Logger, SetMetadata } from '@nestjs/common';
import { LogLevel, EnterpriseRequest } from './types';

/**
 * Metadata key for logging configuration
 */
export const LOGGING_METADATA = 'enterprise:logging';

/**
 * Logging service for enterprise applications
 */
@Injectable()
export class EnterpriseLogger extends Logger {
  private formatMessage(
    level: LogLevel,
    message: string,
    context?: string,
    metadata?: Record<string, any>,
  ): string {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      context: context || 'EnterpriseLogger',
      ...metadata,
    };

    return JSON.stringify(logEntry);
  }

  debug(message: string, context?: string, metadata?: Record<string, any>) {
    super.debug(this.formatMessage(LogLevel.DEBUG, message, context, metadata));
  }

  log(message: string, context?: string, metadata?: Record<string, any>) {
    super.log(this.formatMessage(LogLevel.INFO, message, context, metadata));
  }

  warn(message: string, context?: string, metadata?: Record<string, any>) {
    super.warn(this.formatMessage(LogLevel.WARN, message, context, metadata));
  }

  error(message: string, trace?: string, context?: string, metadata?: Record<string, any>) {
    super.error(this.formatMessage(LogLevel.ERROR, message, context, { trace, ...metadata }));
  }

  critical(message: string, context?: string, metadata?: Record<string, any>) {
    super.error(this.formatMessage(LogLevel.CRITICAL, `CRITICAL: ${message}`, context, metadata));
  }

  logRequest(request: EnterpriseRequest, responseTime?: number) {
    const metadata = {
      correlationId: request.correlationId,
      method: request.method,
      url: request.url,
      userAgent: request.get('User-Agent'),
      ip: request.ip,
      responseTime,
      userId: request.userContext?.id
    };

    this.log(`HTTP ${request.method} ${request.url}`, 'HTTP', metadata);
  }

  logPerformance(methodName: string, executionTime: number, metadata?: Record<string, any>) {
    const level = executionTime > 1000 ? LogLevel.WARN : LogLevel.DEBUG;
    const message = `Method ${methodName} executed in ${executionTime}ms`;

    if (level === LogLevel.WARN) {
      this.warn(message, 'Performance', { executionTime, ...metadata });
    } else {
      this.debug(message, 'Performance', { executionTime, ...metadata });
    }
  }
}

/**
 * Method-level logging decorator
 */
export function LogMethod(
  level: LogLevel = LogLevel.INFO,
  options: {
    includeArgs?: boolean;
    includeResult?: boolean;
    includeExecutionTime?: boolean;
    customMessage?: string;
  } = {}
) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const methodName = `${target.constructor.name}.${propertyKey}`;

    descriptor.value = async function (...args: any[]) {
      const logger = new EnterpriseLogger();
      const startTime = Date.now();

      // Log method entry
      const entryMessage = options.customMessage || `Executing ${methodName}`;
      const entryMetadata: Record<string, any> = {
        method: methodName,
        includeArgs: options.includeArgs
      };

      if (options.includeArgs) {
        entryMetadata.args = args.map((arg, index) => ({
          index,
          type: typeof arg,
          value: typeof arg === 'object' ? '[Object]' : String(arg)
        }));
      }

      logger.log(entryMessage, 'MethodEntry', entryMetadata);

      try {
        const result = await originalMethod.apply(this, args);
        const executionTime = Date.now() - startTime;

        // Log method success
        const successMetadata: Record<string, any> = {
          method: methodName,
          executionTime,
          success: true
        };

        if (options.includeResult) {
          successMetadata.result = typeof result === 'object' ? '[Object]' : String(result);
        }

        if (options.includeExecutionTime) {
          successMetadata.executionTime = executionTime;
        }

        const successMessage = options.customMessage
          ? `${options.customMessage} completed`
          : `${methodName} completed successfully`;

        logger.log(successMessage, 'MethodSuccess', successMetadata);

        return result;
      } catch (error) {
        const executionTime = Date.now() - startTime;

        // Log method error
        const errorMetadata = {
          method: methodName,
          executionTime,
          error: error.message,
          stack: error.stack
        };

        logger.error(
          `${methodName} failed: ${error.message}`,
          error.stack,
          'MethodError',
          errorMetadata
        );

        throw error;
      }
    };

    // Store metadata for reflection
    SetMetadata(LOGGING_METADATA, { level, ...options })(target, propertyKey, descriptor);
  };
}

/**
 * Controller-level logging decorator
 */
export function LogController(options: {
  logRequests?: boolean;
  logResponses?: boolean;
  includeHeaders?: boolean;
  excludePaths?: string[];
} = {}) {
  return function (target: any) {
    const logger = new EnterpriseLogger();
    const controllerName = target.name;

    // Log controller initialization
    logger.log(`Controller ${controllerName} initialized`, 'ControllerInit', {
      controller: controllerName
    });

    // Store metadata
    SetMetadata(LOGGING_METADATA, { controller: true, ...options })(target);
  };
}

/**
 * Service-level logging decorator
 */
export function LogService(options: {
  logMethodCalls?: boolean;
  logErrors?: boolean;
  includePerformance?: boolean;
} = {}) {
  return function (target: any) {
    const logger = new EnterpriseLogger();
    const serviceName = target.name;

    // Log service initialization
    logger.log(`Service ${serviceName} initialized`, 'ServiceInit', {
      service: serviceName
    });

    // Store metadata
    SetMetadata(LOGGING_METADATA, { service: true, ...options })(target);
  };
}

/**
 * Error boundary logging decorator
 */
export function LogErrors(options: {
  rethrow?: boolean;
  includeStack?: boolean;
  alertThreshold?: number; // Number of errors before alerting
} = { rethrow: true }) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const methodName = `${target.constructor.name}.${propertyKey}`;
    const logger = new EnterpriseLogger();

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        const errorMetadata = {
          method: methodName,
          error: error.message,
          args: options.includeStack ? args : undefined,
          stack: options.includeStack ? error.stack : undefined
        };

        logger.error(
          `Error in ${methodName}: ${error.message}`,
          options.includeStack ? error.stack : undefined,
          'ErrorBoundary',
          errorMetadata
        );

        if (options.rethrow !== false) {
          throw error;
        }
      }
    };
  };
}