/**
 * @fileoverview Input/Output Sanitization Interceptor
 * @module common/interceptors/sanitization
 * @description Sanitize inputs to prevent XSS and injection attacks
 */

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SanitizableObject, SanitizableValue } from '../types/utility-types';
import { BaseInterceptor } from './base.interceptor';

/**
 * Sanitization Interceptor
 *
 * @class SanitizationInterceptor
 * @extends {BaseInterceptor}
 * @implements {NestInterceptor}
 *
 * @description Sanitizes request body and response data
 */
@Injectable()
export class SanitizationInterceptor extends BaseInterceptor implements NestInterceptor {
  private readonly dangerousPatterns = {
    xss: /<script|javascript:|onerror=|onclick=|onload=/i,
    sql: /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b)/i,
    path: /\.\.\//g,
  };

  constructor() {
    super();
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const { handler, controller } = this.getHandlerInfo(context);

    // Sanitize request body
    if (request.body) {
      const originalBody = JSON.stringify(request.body);
      request.body = this.sanitizeObject(request.body);
      const sanitizedBody = JSON.stringify(request.body);

      // Log if sanitization occurred
      if (originalBody !== sanitizedBody) {
        this.logRequest('warn', `Input sanitized in ${controller}.${handler}`, {
          controller,
          handler,
          originalLength: originalBody.length,
          sanitizedLength: sanitizedBody.length,
        });
      }
    }

    // Note: request.query is read-only in Express, so we skip sanitizing it
    // Query parameters are typically handled by validation pipes instead

    return next.handle().pipe(
      map((data) => {
        // Optionally sanitize response data
        // (Usually not needed as output encoding is handled by framework)
        return data;
      }),
    );
  }

  /**
   * Sanitize object recursively
   * @param obj - Object to sanitize
   * @returns Sanitized object
   */
  private sanitizeObject(obj: SanitizableValue): SanitizableValue {
    if (!obj || typeof obj !== 'object') {
      return this.sanitizeValue(obj);
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitizeObject(item));
    }

    const sanitized: SanitizableObject = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        sanitized[key] = this.sanitizeObject(obj[key]);
      }
    }

    return sanitized;
  }

  /**
   * Sanitize individual value
   * @param value - Value to sanitize
   * @returns Sanitized value
   */
  private sanitizeValue(value: SanitizableValue): SanitizableValue {
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
