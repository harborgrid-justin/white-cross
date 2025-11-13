/**
 * Response Transform Interceptor
 *
 * @description Transforms all API responses to follow a consistent envelope format.
 * Ensures uniform structure across all endpoints for better developer experience.
 */

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseInterceptor } from './base.interceptor';
import { ApiSuccessResponse } from '../interfaces/api-response.interface';

/**
 * ResponseTransformInterceptor
 *
 * Automatically wraps all controller responses in a standard envelope format.
 *
 * Before:
 * ```json
 * { "id": "123", "name": "John" }
 * ```
 *
 * After:
 * ```json
 * {
 *   "success": true,
 *   "data": { "id": "123", "name": "John" },
 *   "timestamp": "2025-11-07T02:00:00.000Z"
 * }
 * ```
 *
 * Special handling:
 * - Responses already containing 'success' field are passed through unchanged
 * - Responses with 'data' and 'statusCode' (health checks) are passed through
 * - Null/undefined responses are wrapped with empty data
 * - Pagination metadata is preserved if present
 */
@Injectable()
export class ResponseTransformInterceptor<T> extends BaseInterceptor implements NestInterceptor<T, ApiSuccessResponse<T>> {
  constructor() {
    super();
  }
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiSuccessResponse<T>> {
    const { handler, controller } = this.getHandlerInfo(context);

    return next.handle().pipe(
      map((data) => {
        // Skip transformation if response is already in standard format
        if (this.isAlreadyFormatted(data)) {
          return data;
        }

        // Check if response contains pagination metadata
        const hasPagination =
          data && typeof data === 'object' && 'pagination' in data;

        // Build standard response envelope
        const response: ApiSuccessResponse<T> = {
          success: true,
          data: hasPagination ? data.data : data,
          timestamp: new Date().toISOString(),
        };

        // Add pagination metadata if present
        if (hasPagination) {
          response.pagination = data.pagination;
        }

        // Add message if present
        if (data && typeof data === 'object' && 'message' in data) {
          response.message = data.message;
        }

        // Log response transformation using base class
        this.logResponse('debug', `Response transformed in ${controller}.${handler}`, {
          hasPagination,
          hasMessage: !!response.message,
          controller,
          handler,
        });

        return response;
      }),
    );
  }

  /**
   * Check if response is already in standard format to avoid double-wrapping
   * @param data - Response data to check
   * @returns True if already formatted
   */
  private isAlreadyFormatted(data: unknown): boolean {
    if (!data || typeof data !== 'object') {
      return false;
    }

    // Response already has success field (standard format)
    if ('success' in data) {
      return true;
    }

    // Health check responses with data and statusCode (special format)
    if ('data' in data && 'statusCode' in data) {
      return true;
    }

    return false;
  }
}
