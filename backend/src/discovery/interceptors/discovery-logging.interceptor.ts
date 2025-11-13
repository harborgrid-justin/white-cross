import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { BaseInterceptor } from '../../common/interceptors/base.interceptor';

@Injectable()
export class DiscoveryLoggingInterceptor extends BaseInterceptor implements NestInterceptor {

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url } = request;

    // Generate correlation ID using base class
    const correlationId = this.getOrGenerateRequestId(request);
    request.headers['x-correlation-id'] = correlationId;
    this.setRequestIdHeader(response, correlationId);

    const startTime = Date.now();
    const user = this.getUserContext(context);

    // Log request start using base class
    this.logRequest('log', `Discovery API Request Started: ${method} ${url}`, {
      correlationId,
      method,
      url,
      userId: user?.id,
      userRole: user?.role,
    });

    return next.handle().pipe(
      tap({
        next: (responseData) => {
          const duration = Date.now() - startTime;
          const responseSize = this.calculateResponseSize(responseData);
          const statusCode = response.statusCode;

          // Log successful request using base class
          this.logResponse('log', `Discovery API Request Completed: ${method} ${url} - ${statusCode} (${duration}ms)`, {
            correlationId,
            duration,
            responseSize,
            statusCode,
            success: true,
          });

          // Log slow requests as warnings using base class
          if (duration > 1000) {
            this.logRequest('warn', `Slow Discovery API Request: ${method} ${url} took ${duration}ms`, {
              correlationId,
              method,
              url,
              duration,
            });
          }
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          const statusCode = error.status || 500;

          // Log error using base class
          this.logError(`Discovery API Request Failed: ${method} ${url} - ${statusCode} (${duration}ms)`, error, {
            correlationId,
            method,
            url,
            duration,
            statusCode,
            success: false,
          });
        },
      }),
      catchError((error) => {
        // Re-throw the error after logging
        throw error;
      }),
    );
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
