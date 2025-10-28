/**
 * @fileoverview Request/Response Logging Interceptor
 * @module common/interceptors/logging
 * @description Comprehensive logging with PHI redaction
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

/**
 * Logging Interceptor
 *
 * @class LoggingInterceptor
 * @implements {NestInterceptor}
 *
 * @description Logs all HTTP requests and responses with PHI redaction
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');
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
  ];

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    // Generate or retrieve request ID
    const requestId = (request.headers['x-request-id'] as string) || uuidv4();
    request.headers['x-request-id'] = requestId;
    response.setHeader('X-Request-ID', requestId);

    const { method, url, body, query, params } = request;
    const userAgent = request.headers['user-agent'] || 'unknown';
    const userId = (request as any).user?.id || 'anonymous';

    const startTime = Date.now();

    // Log incoming request
    this.logger.log({
      type: 'REQUEST',
      requestId,
      method,
      url,
      userId,
      userAgent,
      body: this.redactSensitiveData(body),
      query: this.redactSensitiveData(query),
      params: this.redactSensitiveData(params),
    });

    return next.handle().pipe(
      tap({
        next: (data) => {
          const duration = Date.now() - startTime;

          // Log successful response
          this.logger.log({
            type: 'RESPONSE',
            requestId,
            method,
            url,
            statusCode: response.statusCode,
            duration: `${duration}ms`,
            userId,
          });
        },
        error: (error) => {
          const duration = Date.now() - startTime;

          // Log error response
          this.logger.error({
            type: 'ERROR',
            requestId,
            method,
            url,
            statusCode: error.status || 500,
            duration: `${duration}ms`,
            userId,
            error: error.message,
          });
        },
      }),
    );
  }

  /**
   * Redact sensitive data from object
   */
  private redactSensitiveData(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;

    const redacted = Array.isArray(obj) ? [...obj] : { ...obj };

    for (const key in redacted) {
      if (this.isSensitiveField(key)) {
        redacted[key] = '[REDACTED]';
      } else if (typeof redacted[key] === 'object' && redacted[key] !== null) {
        redacted[key] = this.redactSensitiveData(redacted[key]);
      }
    }

    return redacted;
  }

  /**
   * Check if field is sensitive
   */
  private isSensitiveField(field: string): boolean {
    const fieldLower = field.toLowerCase();
    return this.sensitiveFields.some(sensitive => fieldLower.includes(sensitive));
  }
}
