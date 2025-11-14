/**
 * @fileoverview Request Timeout Interceptor
 * @module common/interceptors/timeout
 * @description Prevent long-running requests from hanging
 */

import { CallHandler, ExecutionContext, Injectable, NestInterceptor, RequestTimeoutException } from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { BaseInterceptor } from './base.interceptor';

/**
 * Timeout Interceptor
 *
 * @class TimeoutInterceptor
 * @extends {BaseInterceptor}
 * @implements {NestInterceptor}
 *
 * @description Automatically timeout requests that take too long
 */
@Injectable()
export class TimeoutInterceptor extends BaseInterceptor implements NestInterceptor {
  private readonly defaultTimeout = parseInt(
    process.env.REQUEST_TIMEOUT || '30000',
    10,
  );

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { handler, controller } = this.getHandlerInfo(context);

    // Allow custom timeout per route via metadata
    const customTimeout = this.getTimeout(context);
    const timeoutMs = customTimeout || this.defaultTimeout;

    return next.handle().pipe(
      timeout(timeoutMs),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          // Log timeout using base class
          this.logError(
            `Request timeout in ${controller}.${handler}`,
            new Error(`Request exceeded timeout of ${timeoutMs}ms`),
            {
              timeoutMs,
              controller,
              handler,
            },
          );

          return throwError(
            () =>
              new RequestTimeoutException(
                `Request exceeded timeout of ${timeoutMs}ms`,
              ),
          );
        }
        return throwError(() => err);
      }),
    );
  }

  /**
   * Get timeout from route metadata
   */
  private getTimeout(context: ExecutionContext): number | null {
    const handler = context.getHandler();
    // This would be set via @SetMetadata('timeout', 60000)
    return Reflect.getMetadata('timeout', handler);
  }
}
