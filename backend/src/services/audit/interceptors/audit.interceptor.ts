import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Optional } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditAction } from '../enums/audit-action.enum';
import { AuditService } from '../audit.service';
import { BaseInterceptor } from '../../../common/interceptors/base.interceptor';

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
export class AuditInterceptor extends BaseInterceptor implements NestInterceptor {
  constructor(@Optional() private readonly auditService?: AuditService) {
    super();
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const { userId } = this.getUserContext(request);
    const { handler, controller } = this.getHandlerInfo(context);

    // Extract audit information from request
    const action = this.getActionFromMethod(method);
    const entityType = this.getEntityTypeFromUrl(url);
    const ipAddress = this.getClientIp(request);
    const userAgent = request.headers['user-agent'] || 'unknown';

    // Log audit interception start using base class
    this.logRequest('debug', `Audit interception started for ${controller}.${handler}`, {
      method,
      url,
      action,
      entityType,
      userId,
    });

    return next.handle().pipe(
      tap({
        next: (data) => {
          // Log successful action (async, fail-safe)
          if (this.auditService) {
            this.auditService
              .logAction({
                userId,
                action,
                entityType,
                entityId: data && typeof data === 'object' && 'id' in data ? String(data.id) : undefined,
                changes: { method, url, success: true },
                ipAddress,
                userAgent,
                success: true,
              })
              .catch((error) => {
                this.logError('Failed to log audit action', error, {
                  controller,
                  handler,
                  method,
                  url,
                });
              });
          }

          // Log successful audit completion using base class
          this.logResponse('debug', `Audit action completed successfully`, {
            controller,
            handler,
            action,
            entityType,
            success: true,
          });
        },
        error: (error) => {
          // Log failed action (async, fail-safe)
          if (this.auditService) {
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
                this.logError('Failed to log audit action error', err, {
                  controller,
                  handler,
                  method,
                  url,
                  originalError: error.message,
                });
              });
          }

          // Log audit error using base class
          this.logError(`Audit action failed in ${controller}.${handler}`, error, {
            controller,
            handler,
            action,
            entityType,
            success: false,
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
