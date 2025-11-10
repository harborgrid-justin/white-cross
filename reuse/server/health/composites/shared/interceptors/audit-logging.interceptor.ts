/**
 * LOC: INTERCEPTOR-AUDIT-001
 * File: /reuse/server/health/composites/shared/interceptors/audit-logging.interceptor.ts
 * Purpose: Automatic audit logging interceptor
 *
 * @description
 * Intercepts all requests/responses and automatically logs them to audit trail
 * based on @AuditLog decorator configuration
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { AuditLoggingService, AuditSeverity } from '../services/audit-logging.service';
import { AUDIT_LOG_KEY, AuditLogConfig } from '../decorators/audit-log.decorator';
import { UserPayload } from '../guards/jwt-auth.guard';

@Injectable()
export class AuditLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditLoggingInterceptor.name);

  constructor(
    private readonly auditService: AuditLoggingService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const auditConfig = this.reflector.get<AuditLogConfig>(
      AUDIT_LOG_KEY,
      context.getHandler(),
    );

    // If no audit logging configured, pass through
    if (!auditConfig) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const { method, url, user, ip, headers, body, phiAccessMetadata } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap(async (response) => {
        const executionTime = Date.now() - startTime;

        await this.logAuditEvent(
          auditConfig,
          user,
          {
            method,
            url,
            ip,
            userAgent: headers['user-agent'],
            body: auditConfig.includeRequestBody ? body : undefined,
            response: auditConfig.includeResponseBody ? response : undefined,
            executionTime,
            outcome: 'success',
            phiAccessMetadata,
          },
        );
      }),
      catchError(async (error) => {
        const executionTime = Date.now() - startTime;

        await this.logAuditEvent(
          auditConfig,
          user,
          {
            method,
            url,
            ip,
            userAgent: headers['user-agent'],
            body: auditConfig.includeRequestBody ? body : undefined,
            executionTime,
            outcome: 'failure',
            error: error.message,
            phiAccessMetadata,
          },
        );

        return throwError(() => error);
      }),
    );
  }

  private async logAuditEvent(
    config: AuditLogConfig,
    user: UserPayload,
    context: any,
  ): Promise<void> {
    try {
      await this.auditService.logSecurityEvent({
        eventType: config.eventType,
        severity: config.severity || AuditSeverity.MEDIUM,
        userId: user?.id,
        userRole: user?.role,
        action: `${context.method} ${context.url}`,
        resource: config.resourceType,
        ipAddress: context.ip,
        userAgent: context.userAgent,
        details: {
          description: config.description,
          executionTime: context.executionTime,
          requestBody: context.body,
          responseBody: context.response,
          phiAccess: context.phiAccessMetadata,
        },
        outcome: context.outcome,
        errorMessage: context.error,
      });
    } catch (error) {
      this.logger.error(`Failed to log audit event: ${error.message}`);
    }
  }
}
