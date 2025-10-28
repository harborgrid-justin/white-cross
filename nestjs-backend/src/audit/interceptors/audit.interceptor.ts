import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from '../audit.service';
import { AuditAction } from '../enums';

/**
 * Audit Interceptor
 *
 * Automatically logs actions when applied to controllers or methods.
 * Extracts request context (user, IP, user agent) and logs after completion.
 *
 * Usage:
 * @UseInterceptors(AuditInterceptor)
 * or use @Audit() decorator
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user } = request;

    // Extract audit information from request
    const action = this.getActionFromMethod(method);
    const entityType = this.getEntityTypeFromUrl(url);
    const userId = user?.id || user?.userId;
    const ipAddress = this.auditService.extractIPAddress(request);
    const userAgent = this.auditService.extractUserAgent(request);

    return next.handle().pipe(
      tap({
        next: (data) => {
          // Log successful action (async, fail-safe)
          this.auditService
            .logAction({
              userId,
              action,
              entityType,
              entityId: data?.id,
              changes: { method, url, success: true },
              ipAddress,
              userAgent,
              success: true,
            })
            .catch((error) => {
              this.logger.error('Failed to log audit action:', error);
            });
        },
        error: (error) => {
          // Log failed action (async, fail-safe)
          this.auditService
            .logAction({
              userId,
              action,
              entityType,
              changes: { method, url, success: false },
              ipAddress,
              userAgent,
              success: false,
              errorMessage: error.message,
            })
            .catch((err) => {
              this.logger.error('Failed to log audit action error:', err);
            });
        },
      }),
    );
  }

  private getActionFromMethod(method: string): AuditAction {
    switch (method.toUpperCase()) {
      case 'POST':
        return AuditAction.CREATE;
      case 'GET':
        return AuditAction.READ;
      case 'PUT':
      case 'PATCH':
        return AuditAction.UPDATE;
      case 'DELETE':
        return AuditAction.DELETE;
      default:
        return AuditAction.READ;
    }
  }

  private getEntityTypeFromUrl(url: string): string {
    // Extract entity type from URL (e.g., /api/users/123 -> User)
    const parts = url.split('/').filter((p) => p && !p.match(/^\d+$/) && p !== 'api');
    if (parts.length > 0) {
      // Capitalize first letter and singularize
      const entity = parts[0];
      return entity.charAt(0).toUpperCase() + entity.slice(1, -1);
    }
    return 'Unknown';
  }
}
