/**
 * Audit Interceptor
 * Automatically logs all API requests for audit trails
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from '../services/audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, ip, headers } = request;

    return next.handle().pipe(
      tap(async () => {
        if (user?.userId) {
          await this.auditService.logApiRequest(
            user.userId,
            method,
            url,
            ip
          );
        }
      }),
    );
  }
}

export default AuditInterceptor;
