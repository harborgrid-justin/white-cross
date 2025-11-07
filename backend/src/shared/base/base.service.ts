/**
 * @fileoverview Base Service Class
 * @module shared/base/base.service
 * @description Abstract base class providing common service patterns
 *
 * This base class provides:
 * - Standardized error handling with HIPAA compliance
 * - Automatic request context integration
 * - Common validation methods
 * - Structured logging with context
 * - Audit trail helpers
 */

import {
  Injectable,
  Logger,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { RequestContextService } from '../context/request-context.service';
import { validate as isUUID } from 'uuid';

/**
 * Base Service Options
 * Configuration options for base service
 */
export interface BaseServiceOptions {
  /**
   * Service name for logging
   * Defaults to constructor name
   */
  serviceName?: string;

  /**
   * Whether to automatically log all errors
   * Default: true
   */
  autoLogErrors?: boolean;

  /**
   * Whether to include stack traces in error logs
   * Default: true (but never exposed to clients)
   */
  includeStackTrace?: boolean;
}

/**
 * Base Service
 *
 * Abstract base class for all services in the application.
 * Provides common patterns and utilities for:
 * - Error handling with HIPAA compliance
 * - Request context integration
 * - Validation helpers
 * - Audit logging
 *
 * Usage:
 * ```typescript
 * @Injectable()
 * export class MyService extends BaseService {
 *   constructor(
 *     protected readonly requestContext: RequestContextService,
 *   ) {
 *     super(requestContext);
 *   }
 *
 *   async doSomething() {
 *     try {
 *       // Business logic
 *     } catch (error) {
 *       this.handleError('Failed to do something', error);
 *     }
 *   }
 * }
 * ```
 */
@Injectable()
export abstract class BaseService {
  protected readonly logger: Logger;
  protected readonly options: Required<BaseServiceOptions>;

  constructor(
    protected readonly requestContext: RequestContextService,
    options: BaseServiceOptions = {},
  ) {
    this.options = {
      serviceName: options.serviceName || this.constructor.name,
      autoLogErrors: options.autoLogErrors ?? true,
      includeStackTrace: options.includeStackTrace ?? true,
    };

    this.logger = new Logger(this.options.serviceName);
  }

  // ==================== Error Handling ====================

  /**
   * Handle errors with HIPAA-compliant logging
   * Logs full error details internally but never exposes PHI to clients
   */
  protected handleError(message: string, error: any): never {
    // Build context for logging
    const context = {
      ...this.requestContext.getLogContext(),
      message,
      errorType: error?.constructor?.name || 'Unknown',
    };

    if (this.options.autoLogErrors) {
      if (this.options.includeStackTrace && error?.stack) {
        this.logger.error(
          `${message}: ${error.message || error}`,
          error.stack,
          context,
        );
      } else {
        this.logger.error(`${message}: ${error.message || error}`, context);
      }
    }

    // Rethrow known exceptions as-is
    if (
      error instanceof BadRequestException ||
      error instanceof NotFoundException ||
      error instanceof InternalServerErrorException
    ) {
      throw error;
    }

    // Wrap unknown errors in InternalServerErrorException
    // Never expose internal details to clients (HIPAA compliance)
    throw new InternalServerErrorException(
      message || 'An unexpected error occurred',
    );
  }

  /**
   * Log information with request context
   */
  protected logInfo(message: string, data?: any): void {
    const context = this.requestContext.getLogContext();
    this.logger.log(message, { ...context, ...data });
  }

  /**
   * Log warning with request context
   */
  protected logWarn(message: string, data?: any): void {
    const context = this.requestContext.getLogContext();
    this.logger.warn(message, { ...context, ...data });
  }

  /**
   * Log debug information with request context
   */
  protected logDebug(message: string, data?: any): void {
    const context = this.requestContext.getLogContext();
    this.logger.debug(message, { ...context, ...data });
  }

  // ==================== Validation Helpers ====================

  /**
   * Validate UUID format
   * @throws BadRequestException if invalid
   */
  protected validateUUID(id: string, fieldName: string = 'ID'): void {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid ${fieldName} format`);
    }
  }

  /**
   * Validate required field
   * @throws BadRequestException if missing or empty
   */
  protected validateRequired(value: any, fieldName: string): void {
    if (value === undefined || value === null || value === '') {
      throw new BadRequestException(`${fieldName} is required`);
    }
  }

  /**
   * Validate date is not in the future
   * @throws BadRequestException if date is future
   */
  protected validateNotFuture(date: Date | string, fieldName: string): void {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (dateObj > new Date()) {
      throw new BadRequestException(`${fieldName} cannot be in the future`);
    }
  }

  /**
   * Validate date is not in the past
   * @throws BadRequestException if date is past
   */
  protected validateNotPast(date: Date | string, fieldName: string): void {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (dateObj < new Date()) {
      throw new BadRequestException(`${fieldName} cannot be in the past`);
    }
  }

  /**
   * Validate email format
   * @throws BadRequestException if invalid
   */
  protected validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Invalid email format');
    }
  }

  /**
   * Validate phone number format (US format)
   * @throws BadRequestException if invalid
   */
  protected validatePhoneNumber(phone: string): void {
    const phoneRegex =
      /^\+?1?\s*\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
    if (!phoneRegex.test(phone)) {
      throw new BadRequestException(
        'Invalid phone number format. Expected: (123) 456-7890',
      );
    }
  }

  // ==================== Audit Helpers ====================

  /**
   * Get current user ID from request context
   * @throws BadRequestException if not authenticated
   */
  protected requireUserId(): string {
    const userId = this.requestContext.userId;
    if (!userId) {
      throw new BadRequestException('User authentication required');
    }
    return userId;
  }

  /**
   * Check if user has required role
   * @throws BadRequestException if role missing
   */
  protected requireRole(role: string): void {
    if (!this.requestContext.hasRole(role)) {
      throw new BadRequestException(`Requires ${role} role`);
    }
  }

  /**
   * Check if user has any of the required roles
   * @throws BadRequestException if no matching role
   */
  protected requireAnyRole(roles: string[]): void {
    if (!this.requestContext.hasAnyRole(roles)) {
      throw new BadRequestException(
        `Requires one of the following roles: ${roles.join(', ')}`,
      );
    }
  }

  /**
   * Get audit context for logging operations
   * Returns structured audit information including:
   * - Request ID for tracing
   * - User ID for accountability
   * - Timestamp for temporal tracking
   * - IP address for security
   */
  protected getAuditContext() {
    return this.requestContext.getAuditContext();
  }

  /**
   * Create audit log entry
   * Helper for structured audit logging
   */
  protected createAuditLog(
    action: string,
    resource: string,
    resourceId?: string,
    details?: any,
  ) {
    return {
      ...this.getAuditContext(),
      action,
      resource,
      resourceId,
      details,
    };
  }
}
