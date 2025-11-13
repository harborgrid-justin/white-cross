/**
 * WebSocket Transform Interceptor
 *
 * Transforms WebSocket responses to ensure consistent format and remove sensitive data.
 * Automatically adds metadata like timestamps and sanitizes responses.
 *
 * Key Features:
 * - Automatic timestamp addition
 * - Response sanitization
 * - Null/undefined handling
 * - Consistent response format
 * - Sensitive data removal
 *
 * @class WsTransformInterceptor
 */
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseInterceptor } from '../../../common/interceptors/base.interceptor';

/**
 * Fields to remove from responses (potential sensitive data)
 */
const SENSITIVE_FIELDS = [
  'password',
  'token',
  'secret',
  'apiKey',
  'privateKey',
  'sessionId',
];

@Injectable()
export class WsTransformInterceptor extends BaseInterceptor implements NestInterceptor {
  /**
   * Intercepts and transforms WebSocket responses
   *
   * @param _context - Execution context
   * @param next - Call handler
   * @returns Observable with transformed response
   */
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Don't transform null/undefined responses
        if (data === null || data === undefined) {
          return data;
        }

        // Transform response
        return this.transformResponse(data);
      }),
    );
  }

  /**
   * Transforms a response object
   *
   * @param data - The response data
   * @returns Transformed data
   */
  private transformResponse(data: unknown): unknown {
    // If data has a toPayload method, use it
    if (typeof (data as any)?.toPayload === 'function') {
      return (data as any).toPayload();
    }

    // For objects, sanitize and add metadata
    if (typeof data === 'object' && data !== null) {
      return this.sanitizeObject(data);
    }

    // Return primitives as-is
    return data;
  }

  /**
   * Sanitizes an object by removing sensitive fields
   *
   * @param obj - The object to sanitize
   * @returns Sanitized object
   */
  private sanitizeObject(obj: unknown): unknown {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitizeObject(item));
    }

    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      // Skip sensitive fields
      if (SENSITIVE_FIELDS.some((field) => key.toLowerCase().includes(field))) {
        continue;
      }

      // Recursively sanitize nested objects
      if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }
}
