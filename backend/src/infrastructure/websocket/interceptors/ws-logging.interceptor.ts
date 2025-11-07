/**
 * WebSocket Logging Interceptor
 *
 * Logs WebSocket events for monitoring, debugging, and audit compliance.
 * Captures request/response timing and provides structured logging.
 *
 * Key Features:
 * - Request/response logging with timing
 * - Event pattern tracking
 * - User context logging
 * - Performance monitoring
 * - HIPAA-compliant logging (no PHI)
 * - Error tracking
 *
 * @class WsLoggingInterceptor
 */
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Socket } from 'socket.io';

@Injectable()
export class WsLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('WebSocket');

  /**
   * Intercepts WebSocket event handling
   *
   * @param context - Execution context
   * @param next - Call handler
   * @returns Observable with logging
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const client = context.switchToWs().getClient<Socket>();
    const data = context.switchToWs().getData();
    const pattern = context.switchToWs().getPattern();

    // Extract user info (HIPAA-compliant: only IDs, no PHI)
    const user = (client as any).user;
    const userId = user?.userId || 'anonymous';
    const organizationId = user?.organizationId || 'unknown';

    // Log incoming event
    this.logger.debug(`[${pattern}] ← Received from socket ${client.id}`, {
      pattern,
      userId,
      organizationId,
      socketId: client.id,
      dataKeys: this.getDataKeys(data),
    });

    const startTime = Date.now();

    return next.handle().pipe(
      tap((response) => {
        const duration = Date.now() - startTime;

        // Log successful response
        this.logger.debug(
          `[${pattern}] → Response sent to socket ${client.id} (${duration}ms)`,
          {
            pattern,
            userId,
            organizationId,
            socketId: client.id,
            duration,
            hasResponse: !!response,
          },
        );
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;

        // Log error
        this.logger.error(
          `[${pattern}] ✗ Error in socket ${client.id} (${duration}ms)`,
          {
            pattern,
            userId,
            organizationId,
            socketId: client.id,
            duration,
            error: error.message,
          },
        );

        return throwError(() => error);
      }),
    );
  }

  /**
   * Safely extracts data keys for logging
   * Prevents logging of potentially sensitive data values
   *
   * @param data - The data object
   * @returns Array of top-level keys
   */
  private getDataKeys(data: unknown): string[] {
    if (!data || typeof data !== 'object') {
      return [];
    }

    return Object.keys(data);
  }
}
