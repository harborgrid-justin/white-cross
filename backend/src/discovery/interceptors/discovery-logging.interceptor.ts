import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class DiscoveryLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(DiscoveryLoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, ip, headers } = request;

    // Extract relevant information
    const userAgent = headers['user-agent'] || 'Unknown';
    const correlationId =
      headers['x-correlation-id'] ||
      headers['x-request-id'] ||
      this.generateCorrelationId();
    const startTime = Date.now();
    const user = (request as any).user;

    // Build log context
    const logContext = {
      method,
      url,
      ip,
      userAgent,
      correlationId,
      userId: user?.id,
      userRole: user?.role,
      timestamp: new Date().toISOString(),
    };

    // Log request start
    this.logger.log(
      `Discovery API Request Started: ${method} ${url}`,
      logContext,
    );

    return next.handle().pipe(
      tap({
        next: (responseData) => {
          const duration = Date.now() - startTime;
          const responseSize = this.calculateResponseSize(responseData);
          const statusCode = response.statusCode;

          const successContext = {
            ...logContext,
            duration,
            responseSize,
            statusCode,
            success: true,
          };

          this.logger.log(
            `Discovery API Request Completed: ${method} ${url} - ${statusCode} (${duration}ms)`,
            successContext,
          );

          // Log slow requests as warnings
          if (duration > 1000) {
            // > 1 second
            this.logger.warn(
              `Slow Discovery API Request: ${method} ${url} took ${duration}ms`,
              successContext,
            );
          }
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          const statusCode = error.status || 500;

          const errorContext = {
            ...logContext,
            duration,
            statusCode,
            success: false,
            errorType: error.constructor.name,
            errorMessage: error.message,
            errorStack: error.stack,
          };

          this.logger.error(
            `Discovery API Request Failed: ${method} ${url} - ${statusCode} (${duration}ms)`,
            error.stack,
            errorContext,
          );
        },
      }),
      catchError((error) => {
        // Re-throw the error after logging
        throw error;
      }),
    );
  }

  private generateCorrelationId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private calculateResponseSize(data: any): number {
    if (!data) return 0;

    try {
      return JSON.stringify(data).length;
    } catch {
      return 0;
    }
  }
}
