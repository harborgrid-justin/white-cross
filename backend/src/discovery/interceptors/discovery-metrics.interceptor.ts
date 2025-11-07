import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';
import { DiscoveryMetricsService } from '../services/discovery-metrics.service';

@Injectable()
export class DiscoveryMetricsInterceptor implements NestInterceptor {
  constructor(private readonly metricsService: DiscoveryMetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const startTime = process.hrtime.bigint();

    const { method, url, route } = request;
    const user = (request as any).user;
    const endpoint = route?.path || url;

    // Increment request counter
    this.metricsService.incrementCounter('discovery_requests_total', {
      method,
      endpoint,
      user_role: user?.role || 'anonymous',
    });

    return next.handle().pipe(
      tap({
        next: (responseData) => {
          const duration = this.calculateDuration(startTime);
          const statusCode = response.statusCode;

          // Record successful request metrics
          this.recordSuccessMetrics(
            method,
            endpoint,
            duration,
            statusCode,
            responseData,
            user,
          );
        },
        error: (error) => {
          const duration = this.calculateDuration(startTime);
          const statusCode = error.status || 500;

          // Record error metrics
          this.recordErrorMetrics(
            method,
            endpoint,
            duration,
            statusCode,
            error,
            user,
          );
        },
      }),
      catchError((error) => {
        // Re-throw the error after recording metrics
        throw error;
      }),
    );
  }

  private calculateDuration(startTime: bigint): number {
    return Number(process.hrtime.bigint() - startTime) / 1000000; // Convert to milliseconds
  }

  private recordSuccessMetrics(
    method: string,
    endpoint: string,
    duration: number,
    statusCode: number,
    responseData: any,
    user?: any,
  ): void {
    const labels = {
      method,
      endpoint,
      status: 'success',
      status_code: statusCode.toString(),
    };

    // Record response time
    this.metricsService.recordHistogram(
      'discovery_request_duration_ms',
      duration,
      labels,
    );

    // Record response size if available
    if (responseData) {
      const responseSize = this.calculateResponseSize(responseData);
      this.metricsService.recordHistogram(
        'discovery_response_size_bytes',
        responseSize,
        {
          endpoint,
          method,
        },
      );
    }

    // Record status code distribution
    this.metricsService.incrementCounter('discovery_response_status_total', {
      method,
      endpoint,
      status_code: statusCode.toString(),
    });

    // Record user-specific metrics if available
    if (user) {
      this.metricsService.incrementCounter('discovery_user_requests_total', {
        user_role: user.role || 'unknown',
        endpoint,
      });
    }

    // Record performance categories
    if (duration > 1000) {
      this.metricsService.incrementCounter('discovery_slow_requests_total', {
        method,
        endpoint,
        category: 'very_slow', // > 1 second
      });
    } else if (duration > 500) {
      this.metricsService.incrementCounter('discovery_slow_requests_total', {
        method,
        endpoint,
        category: 'slow', // > 500ms
      });
    }
  }

  private recordErrorMetrics(
    method: string,
    endpoint: string,
    duration: number,
    statusCode: number,
    error: any,
    user?: any,
  ): void {
    const labels = {
      method,
      endpoint,
      status: 'error',
      status_code: statusCode.toString(),
      error_type: error.constructor.name,
    };

    // Record error count
    this.metricsService.incrementCounter('discovery_errors_total', labels);

    // Record error response time
    this.metricsService.recordHistogram(
      'discovery_request_duration_ms',
      duration,
      {
        method,
        endpoint,
        status: 'error',
      },
    );

    // Record error by category
    const errorCategory = this.categorizeError(statusCode);
    this.metricsService.incrementCounter('discovery_errors_by_category_total', {
      method,
      endpoint,
      category: errorCategory,
    });

    // Record user-specific error metrics if available
    if (user) {
      this.metricsService.incrementCounter('discovery_user_errors_total', {
        user_role: user.role || 'unknown',
        endpoint,
        error_type: error.constructor.name,
      });
    }
  }

  private calculateResponseSize(data: any): number {
    if (!data) return 0;

    try {
      return JSON.stringify(data).length;
    } catch {
      return 0;
    }
  }

  private categorizeError(statusCode: number): string {
    if (statusCode >= 400 && statusCode < 500) {
      return 'client_error';
    } else if (statusCode >= 500) {
      return 'server_error';
    } else {
      return 'unknown';
    }
  }
}
