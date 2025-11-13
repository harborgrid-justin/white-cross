/**
 * @fileoverview Request/Response Logging Interceptor
 * @module common/interceptors/logging
 * @description Comprehensive structured logging with Winston, PHI redaction, and Sentry integration
 */

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import type { Response } from 'express';
import { BaseInterceptor } from './base.interceptor';
import { AuthenticatedRequest } from '../types/utility-types';

/**
 * Logging Interceptor
 *
 * @class LoggingInterceptor
 * @extends {BaseInterceptor}
 * @implements {NestInterceptor}
 *
 * @description Logs all HTTP requests and responses with PHI redaction using Winston and Sentry
 */
@Injectable()
export class LoggingInterceptor extends BaseInterceptor implements NestInterceptor {
  constructor() {
    super();
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const response = context.switchToHttp().getResponse<Response>();

    // Generate or retrieve request ID using base class
    const requestId = this.getOrGenerateRequestId(request);
    this.setRequestIdHeader(response, requestId);

    const { method, url, body, query, params } = request;
    const userAgent = request.headers['user-agent'] || 'unknown';
    const { userId, organizationId } = this.getUserContext(request);
    const ipAddress = this.getClientIp(request);

    const startTime = Date.now();

    // Log incoming request with structured format using base class
    this.logRequest('info', `${method} ${url}`, {
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
    });

    // Add Sentry breadcrumb for request using base class
    this.addSentryBreadcrumb(
      `${method} ${url}`,
      'http.request',
      'info',
      {
        requestId,
        method,
        url,
        userId: userId !== 'anonymous' ? userId : undefined,
      },
    );

    return next.handle().pipe(
      tap({
        next: () => {
          const { duration, durationMs } = this.getDurationString(startTime);

          // Log successful response with structured format using base class
          this.logResponse('info', `${method} ${url} - ${response.statusCode}`, {
            requestId,
            method,
            url,
            statusCode: response.statusCode,
            duration,
            durationMs,
            userId,
            organizationId,
          });

          // Add Sentry breadcrumb for successful response using base class
          this.addSentryBreadcrumb(
            `${method} ${url} - ${response.statusCode}`,
            'http.response',
            'info',
            {
              requestId,
              statusCode: response.statusCode,
              duration,
            },
          );
        },
        error: (error: Error & { status?: number; name: string }) => {
          const { duration, durationMs } = this.getDurationString(startTime);
          const statusCode = error.status || 500;

          // Log error response with structured format using base class
          this.logError(`${method} ${url} - ${statusCode}`, error, {
            requestId,
            method,
            url,
            statusCode,
            duration,
            durationMs,
            userId,
            organizationId,
          });

          // Report to Sentry for 5xx errors and critical issues using base class
          if (statusCode >= 500) {
            this.reportToSentry(error, {
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
            });
          }
        },
      }),
    );
  }
}
