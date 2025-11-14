import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ThreatDetectionService } from '../services/threat-detection.service';
import { BaseInterceptor } from '@/common/interceptors/base.interceptor';

/**
 * Security Logging Interceptor
 * Logs security-relevant requests and performs automatic threat detection
 */
@Injectable()
export class SecurityLoggingInterceptor extends BaseInterceptor implements NestInterceptor {
  constructor(
    private readonly threatDetectionService: ThreatDetectionService,
  ) {
    super();
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const startTime = Date.now();
    const { userId } = this.getUserContext(request);
    const { handler, controller } = this.getHandlerInfo(context);

    const securityContext = {
      userId,
      ipAddress: this.getClientIp(request),
      userAgent: request.headers['user-agent'],
      requestPath: request.url,
      requestMethod: request.method,
      timestamp: new Date(),
    };

    // Log security interception start using base class
    this.logRequest('info', `Security interception started for ${controller}.${handler}`, {
      controller,
      handler,
      userId,
      ipAddress: securityContext.ipAddress,
      requestPath: securityContext.requestPath,
      requestMethod: securityContext.requestMethod,
    });

    // Perform threat detection on sensitive inputs
    await this.performThreatDetection(request, securityContext);

    return next.handle().pipe(
      tap({
        next: () => {
          const { duration, durationMs } = this.getDurationString(startTime);

          // Log successful security request using base class
          this.logResponse('info', `Security request completed for ${controller}.${handler}`, {
            controller,
            handler,
            userId,
            duration,
            durationMs,
            status: 'success',
          });
        },
        error: (error) => {
          const { duration, durationMs } = this.getDurationString(startTime);

          // Log security request error using base class
          this.logError(`Security request failed in ${controller}.${handler}`, error, {
            controller,
            handler,
            userId,
            duration,
            durationMs,
            status: 'error',
          });
        },
      }),
    );
  }

  /**
   * Perform threat detection on request inputs
   */
  private async performThreatDetection(
    request: any,
    context: { userId?: string; ipAddress?: string },
  ): Promise<void> {
    try {
      // Check query parameters
      const queryString = JSON.stringify(request.query);
      if (queryString.length > 2) {
        await this.threatDetectionService.scanInput(queryString, context);
      }

      // Check body parameters
      if (request.body && Object.keys(request.body).length > 0) {
        const bodyString = JSON.stringify(request.body);
        await this.threatDetectionService.scanInput(bodyString, context);
      }
    } catch (error) {
      this.logError('Error in threat detection', error);
      // Don't block the request
    }
  }
}
