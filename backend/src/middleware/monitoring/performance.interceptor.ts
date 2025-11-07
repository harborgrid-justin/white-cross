/**
 * LOC: WC-INT-PERF-001
 * NestJS Performance Interceptor - Method-level performance tracking
 *
 * Provides detailed performance monitoring at the controller/service method level
 * for fine-grained performance analysis and optimization.
 */

import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PerformanceMiddleware } from './performance.middleware';

/**
 * Performance Interceptor for method-level tracking
 *
 * @description Intercepts controller methods to measure execution time,
 * memory usage, and identify performance bottlenecks at the method level.
 * Complements the performance middleware with fine-grained operation tracking.
 */
@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private readonly logger = new Logger(PerformanceInterceptor.name);

  constructor(private readonly performanceMiddleware: PerformanceMiddleware) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const handler = context.getHandler();
    const controller = context.getClass();
    const methodName = handler.name;
    const controllerName = controller.name;

    const startTime = Date.now();
    const startMemory = process.memoryUsage();

    this.logger.debug(`Starting ${controllerName}.${methodName}`);

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        const endMemory = process.memoryUsage();
        const memoryDelta = {
          heapUsed: endMemory.heapUsed - startMemory.heapUsed,
          heapTotal: endMemory.heapTotal - startMemory.heapTotal,
          external: endMemory.external - startMemory.external,
          rss: endMemory.rss - startMemory.rss,
        };

        this.logger.debug(`Completed ${controllerName}.${methodName}`, {
          duration: `${duration}ms`,
          memoryDelta: {
            heapUsed: `${(memoryDelta.heapUsed / 1024 / 1024).toFixed(2)}MB`,
            heapTotal: `${(memoryDelta.heapTotal / 1024 / 1024).toFixed(2)}MB`,
          },
        });

        // Warn on slow methods
        if (duration > 1000) {
          this.logger.warn(
            `Slow method detected: ${controllerName}.${methodName}`,
            {
              duration: `${duration}ms`,
            },
          );
        }

        // Warn on high memory usage
        if (memoryDelta.heapUsed > 10 * 1024 * 1024) {
          // 10MB
          this.logger.warn(
            `High memory usage detected: ${controllerName}.${methodName}`,
            {
              heapUsed: `${(memoryDelta.heapUsed / 1024 / 1024).toFixed(2)}MB`,
            },
          );
        }
      }),
    );
  }
}
