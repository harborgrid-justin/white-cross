/**
 * @fileoverview Base Interceptor Class
 * @module common/interceptors/base
 * @description Common functionality for all interceptors in the White Cross platform
 */

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { LoggerService } from '../../shared/logging/logger.service';
import { SentryService } from '../../infrastructure/monitoring/sentry.service';
import { AuthenticatedRequest } from '../types/utility-types';
import type { Response } from 'express';

/**
 * Base Interceptor
 *
 * Provides common functionality used across all interceptors:
 * - Request ID generation and management
 * - Client IP extraction
 * - PHI/Sensitive data redaction
 * - Structured logging with metadata
 * - Duration tracking
 * - User context extraction
 * - Sentry integration
 * - Error handling utilities
 *
 * All interceptors should extend this base class to ensure consistent
 * behavior and reduce code duplication.
 */
@Injectable()
export abstract class BaseInterceptor implements NestInterceptor {
  protected readonly logger: LoggerService;
  protected readonly sentryService: SentryService;

  // Fields that should be redacted in logs
  protected readonly sensitiveFields = [
    'password',
    'ssn',
    'socialSecurityNumber',
    'token',
    'refreshToken',
    'accessToken',
    'medicalRecordNumber',
    'mrn',
    'dateOfBirth',
    'dob',
    'email',
    'phone',
    'address',
    'firstName',
    'lastName',
    'fullName',
    'healthData',
    'medicalHistory',
    'diagnosis',
    'treatment',
    'medication',
  ];

  constructor(logger?: LoggerService, sentryService?: SentryService) {
    this.logger = logger || new LoggerService();
    this.sentryService = sentryService;
  }

  /**
   * Abstract method to be implemented by concrete interceptors
   */
  abstract intercept(context: ExecutionContext, next: CallHandler): Observable<unknown>;

  /**
   * Generate or retrieve request ID from headers
   */
  protected getOrGenerateRequestId(request: AuthenticatedRequest): string {
    const existingId = request.headers['x-request-id'] as string;
    if (existingId) {
      return existingId;
    }

    const requestId = uuidv4();
    request.headers['x-request-id'] = requestId;
    return requestId;
  }

  /**
   * Set request ID header on response
   */
  protected setRequestIdHeader(response: Response, requestId: string): void {
    response.setHeader('X-Request-ID', requestId);
  }

  /**
   * Extract client IP address from request
   */
  protected getClientIp(request: AuthenticatedRequest): string {
    return (
      (request.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      (request.headers['x-real-ip'] as string) ||
      request.socket?.remoteAddress ||
      request.connection?.remoteAddress ||
      'unknown'
    );
  }

  /**
   * Extract user context from request
   */
  protected getUserContext(request: AuthenticatedRequest): {
    userId: string;
    organizationId?: string;
    roles?: string[];
  } {
    const user = request.user;
    return {
      userId: user?.id || 'anonymous',
      organizationId: user?.organizationId,
      roles: user?.roles,
    };
  }

  /**
   * Redact sensitive data from objects for logging
   */
  protected redactSensitiveData(obj: unknown): unknown {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    // Handle arrays
    if (Array.isArray(obj)) {
      return obj.map((item) => this.redactSensitiveData(item));
    }

    // Handle objects
    const redacted: Record<string, unknown> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (this.isSensitiveField(key)) {
          redacted[key] = '[REDACTED]';
        } else {
          const value = (obj as Record<string, unknown>)[key];
          if (typeof value === 'object' && value !== null) {
            redacted[key] = this.redactSensitiveData(value);
          } else {
            redacted[key] = value;
          }
        }
      }
    }

    return redacted;
  }

  /**
   * Check if a field name indicates sensitive data
   */
  protected isSensitiveField(field: string): boolean {
    const fieldLower = field.toLowerCase();
    return this.sensitiveFields.some((sensitive) => fieldLower.includes(sensitive));
  }

  /**
   * Log request with structured metadata
   */
  protected logRequest(
    level: 'info' | 'warn' | 'error' | 'debug',
    message: string,
    metadata: Record<string, any>,
  ): void {
    this.logger.logWithMetadata(level, message, {
      type: 'REQUEST',
      timestamp: new Date().toISOString(),
      ...metadata,
    });
  }

  /**
   * Log response with structured metadata
   */
  protected logResponse(
    level: 'info' | 'warn' | 'error' | 'debug',
    message: string,
    metadata: Record<string, any>,
  ): void {
    this.logger.logWithMetadata(level, message, {
      type: 'RESPONSE',
      timestamp: new Date().toISOString(),
      ...metadata,
    });
  }

  /**
   * Log error with structured metadata
   */
  protected logError(message: string, error: Error, metadata: Record<string, any>): void {
    this.logger.logWithMetadata('error', message, {
      type: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message,
      errorName: error.name,
      stack: error.stack,
      ...metadata,
    });
  }

  /**
   * Add Sentry breadcrumb for request tracking
   */
  protected addSentryBreadcrumb(
    message: string,
    category: string,
    level: 'info' | 'warning' | 'error' | 'debug' = 'info',
    data?: Record<string, any>,
  ): void {
    if (this.sentryService) {
      this.sentryService.addBreadcrumb({
        message,
        category,
        level,
        data,
      });
    }
  }

  /**
   * Report error to Sentry with context
   */
  protected reportToSentry(
    error: Error,
    context: Record<string, any>,
    level: 'error' | 'warning' | 'info' = 'error',
  ): void {
    if (this.sentryService) {
      this.sentryService.captureException(error, {
        ...context,
        level,
      });
    }
  }

  /**
   * Calculate duration and format for logging
   */
  protected getDurationString(startTime: number): {
    duration: number;
    durationMs: string;
  } {
    const duration = Date.now() - startTime;
    return {
      duration,
      durationMs: `${duration}ms`,
    };
  }

  /**
   * Check if execution was slow (for performance monitoring)
   */
  protected isSlowExecution(duration: number, threshold: number = 1000): boolean {
    return duration > threshold;
  }

  /**
   * Get handler and controller names for logging
   */
  protected getHandlerInfo(context: ExecutionContext): {
    handler: string;
    controller: string;
  } {
    return {
      handler: context.getHandler().name,
      controller: context.getClass().name,
    };
  }
}