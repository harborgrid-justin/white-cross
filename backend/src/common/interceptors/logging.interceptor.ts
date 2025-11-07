/**
 * @fileoverview Request/Response Logging Interceptor
 * @module common/interceptors/logging
 * @description Comprehensive structured logging with Winston, PHI redaction, and Sentry integration
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import type { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { LoggerService } from '../../shared/logging/logger.service';
import { SentryService } from '../../infrastructure/monitoring/sentry.service';
import { AuthenticatedRequest } from '../types/utility-types';

/**
 * Logging Interceptor
 *
 * @class LoggingInterceptor
 * @implements {NestInterceptor}
 *
 * @description Logs all HTTP requests and responses with PHI redaction using Winston and Sentry
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger: LoggerService;
  private readonly sensitiveFields = [
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
  ];

  constructor(private readonly sentryService: SentryService) {
    this.logger = new LoggerService();
    this.logger.setContext('HTTP');
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const response = context.switchToHttp().getResponse<Response>();

    // Generate or retrieve request ID
    const requestId = (request.headers['x-request-id'] as string) || uuidv4();
    request.headers['x-request-id'] = requestId;
    response.setHeader('X-Request-ID', requestId);

    const { method, url, body, query, params } = request;
    const userAgent = request.headers['user-agent'] || 'unknown';
    const userId = request.user?.id || 'anonymous';
    const organizationId = request.user?.organizationId;
    const ipAddress = this.getClientIp(request);

    const startTime = Date.now();

    // Log incoming request with structured format
    this.logger.logWithMetadata('info', `${method} ${url}`, {
      type: 'REQUEST',
      requestId,
      method,
      url,
      userId,
      organizationId,
      userAgent,
      ipAddress,
      body: this.redactSensitiveData(body),
      query: this.redactSensitiveData(query),
      params: this.redactSensitiveData(params),
      timestamp: new Date().toISOString(),
    });

    // Add Sentry breadcrumb for request
    this.sentryService.addBreadcrumb({
      message: `${method} ${url}`,
      category: 'http.request',
      level: 'info',
      data: {
        requestId,
        method,
        url,
        userId: userId !== 'anonymous' ? userId : undefined,
      },
    });

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;

          // Log successful response with structured format
          this.logger.logWithMetadata(
            'info',
            `${method} ${url} - ${response.statusCode}`,
            {
              type: 'RESPONSE',
              requestId,
              method,
              url,
              statusCode: response.statusCode,
              duration,
              durationMs: `${duration}ms`,
              userId,
              organizationId,
              timestamp: new Date().toISOString(),
            },
          );

          // Add Sentry breadcrumb for successful response
          this.sentryService.addBreadcrumb({
            message: `${method} ${url} - ${response.statusCode}`,
            category: 'http.response',
            level: 'info',
            data: {
              requestId,
              statusCode: response.statusCode,
              duration,
            },
          });
        },
        error: (error: Error & { status?: number; name: string }) => {
          const duration = Date.now() - startTime;
          const statusCode = error.status || 500;

          // Log error response with structured format
          this.logger.logWithMetadata(
            'error',
            `${method} ${url} - ${statusCode}`,
            {
              type: 'ERROR',
              requestId,
              method,
              url,
              statusCode,
              duration,
              durationMs: `${duration}ms`,
              userId,
              organizationId,
              error: error.message,
              errorName: error.name,
              timestamp: new Date().toISOString(),
            },
          );

          // Report to Sentry for 5xx errors and critical issues
          if (statusCode >= 500) {
            this.sentryService.captureException(error, {
              userId: userId !== 'anonymous' ? userId : undefined,
              organizationId,
              tags: {
                method,
                url,
                statusCode: String(statusCode),
              },
              extra: {
                requestId,
                duration,
                userAgent,
              },
              level: 'error',
            });
          }
        },
      }),
    );
  }

  /**
   * Get client IP address
   * @param request - HTTP request
   * @returns Client IP address
   */
  private getClientIp(request: AuthenticatedRequest): string {
    return (
      (request.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      (request.headers['x-real-ip'] as string) ||
      request.socket?.remoteAddress ||
      request.connection?.remoteAddress ||
      'unknown'
    );
  }

  /**
   * Redact sensitive data from object
   * @param obj - Object to redact
   * @returns Redacted object
   */
  private redactSensitiveData(obj: unknown): unknown {
    if (!obj || typeof obj !== 'object') return obj;

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
   * Check if field is sensitive
   * @param field - Field name to check
   * @returns True if field is sensitive
   */
  private isSensitiveField(field: string): boolean {
    const fieldLower = field.toLowerCase();
    return this.sensitiveFields.some((sensitive) =>
      fieldLower.includes(sensitive),
    );
  }
}
