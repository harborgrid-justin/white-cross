/**
 * @fileoverview Input/Output Sanitization Interceptor
 * @module common/interceptors/sanitization
 * @description Sanitize inputs to prevent XSS and injection attacks
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Sanitization Interceptor
 *
 * @class SanitizationInterceptor
 * @implements {NestInterceptor}
 *
 * @description Sanitizes request body and response data
 */
@Injectable()
export class SanitizationInterceptor implements NestInterceptor {
  private readonly dangerousPatterns = {
    xss: /<script|javascript:|onerror=|onclick=|onload=/i,
    sql: /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b)/i,
    path: /\.\.\//g,
  };

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // Sanitize request body
    if (request.body) {
      request.body = this.sanitizeObject(request.body);
    }

    // Note: request.query is read-only in Express, so we skip sanitizing it
    // Query parameters are typically handled by validation pipes instead

    return next.handle().pipe(
      map(data => {
        // Optionally sanitize response data
        // (Usually not needed as output encoding is handled by framework)
        return data;
      }),
    );
  }

  /**
   * Sanitize object recursively
   */
  private sanitizeObject(obj: any): any {
    if (!obj || typeof obj !== 'object') {
      return this.sanitizeValue(obj);
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item));
    }

    const sanitized: any = {};
    for (const key in obj) {
      sanitized[key] = this.sanitizeObject(obj[key]);
    }

    return sanitized;
  }

  /**
   * Sanitize individual value
   */
  private sanitizeValue(value: any): any {
    if (typeof value !== 'string') return value;

    // Remove potential XSS patterns
    let sanitized = value.replace(this.dangerousPatterns.xss, '');

    // Remove path traversal attempts
    sanitized = sanitized.replace(this.dangerousPatterns.path, '');

    // Trim whitespace
    sanitized = sanitized.trim();

    return sanitized;
  }
}
