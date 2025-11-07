import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ThreatDetectionService } from '../services/threat-detection.service';

/**
 * Security Logging Interceptor
 * Logs security-relevant requests and performs automatic threat detection
 */
@Injectable()
export class SecurityLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(SecurityLoggingInterceptor.name);

  constructor(
    private readonly threatDetectionService: ThreatDetectionService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const startTime = Date.now();

    const securityContext = {
      userId: request.user?.id,
      ipAddress: this.extractIP(request),
      userAgent: request.headers['user-agent'],
      requestPath: request.url,
      requestMethod: request.method,
      timestamp: new Date(),
    };

    // Perform threat detection on sensitive inputs
    await this.performThreatDetection(request, securityContext);

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          this.logger.log('Security request completed', {
            ...securityContext,
            duration,
            status: 'success',
          });
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.logger.error('Security request failed', {
            ...securityContext,
            duration,
            status: 'error',
            error: error.message,
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
      this.logger.error('Error in threat detection', { error });
      // Don't block the request
    }
  }

  /**
   * Extract IP address from request
   */
  private extractIP(request: any): string {
    const forwarded = request.headers['x-forwarded-for'];
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }

    const realIP = request.headers['x-real-ip'];
    if (realIP) {
      return realIP;
    }

    return request.ip || request.connection?.remoteAddress || '127.0.0.1';
  }
}
