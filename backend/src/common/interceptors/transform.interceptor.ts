/**
 * @fileoverview Transform Interceptor
 * @module common/interceptors/transform
 * @description Standardizes API response format across all endpoints
 */

import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseInterceptor } from './base.interceptor';
import type { Response } from 'express';

/**
 * Standard API Response Interface
 */
export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: T;
  meta?: {
    timestamp: string;
    path: string;
    method: string;
    requestId?: string;
    [key: string]: any;
  };
}

/**
 * Transform Interceptor
 *
 * Wraps all successful responses in a standard format:
 * {
 *   success: true,
 *   statusCode: 200,
 *   message: "Success",
 *   data: { ... },
 *   meta: {
 *     timestamp: "2024-01-01T00:00:00.000Z",
 *     path: "/api/students",
 *     method: "GET",
 *     requestId: "uuid"
 *   }
 * }
 *
 * Benefits:
 * - Consistent response structure across all endpoints
 * - Easier frontend parsing and error handling
 * - Automatic metadata injection
 * - Request tracking with requestId
 *
 * @example
 * // Before: return { id: 1, name: "John" }
 * // After:  return { success: true, data: { id: 1, name: "John" }, meta: {...} }
 */
@Injectable()
export class TransformInterceptor<T> extends BaseInterceptor implements NestInterceptor<T, ApiResponse<T>> {
  constructor() {
    super();
  }
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse<Response>();
    const { handler, controller } = this.getHandlerInfo(context);

    return next.handle().pipe(
      map((data) => {
        // If response is already in standard format, return as-is
        if (
          data &&
          typeof data === 'object' &&
          'success' in data &&
          'statusCode' in data
        ) {
          return data as ApiResponse<T>;
        }

        // Extract pagination metadata if present
        const meta: any = {
          timestamp: new Date().toISOString(),
          path: request.url,
          method: request.method,
          requestId: request.headers['x-request-id'],
        };

        // If data has a 'meta' property, merge it
        if (data && typeof data === 'object' && 'meta' in data) {
          const { meta: dataMeta, ...rest } = data;
          Object.assign(meta, dataMeta);
          data = rest as T;
        }

        // Get status code from response
        const statusCode = response.statusCode || HttpStatus.OK;

        // Build standard response
        const standardResponse: ApiResponse<T> = {
          success: true,
          statusCode,
          message: this.getDefaultMessage(statusCode, request.method),
          data,
          meta,
        };

        // Log response transformation using base class
        this.logResponse('debug', `Response transformed in ${controller}.${handler}`, {
          statusCode,
          hasData: !!data,
          controller,
          handler,
        });

        return standardResponse;
      }),
    );
  }

  /**
   * Get default success message based on HTTP method and status
   */
  private getDefaultMessage(statusCode: number, method: string): string {
    if (statusCode === HttpStatus.CREATED) {
      return 'Resource created successfully';
    }

    if (statusCode === HttpStatus.NO_CONTENT) {
      return 'Resource deleted successfully';
    }

    switch (method) {
      case 'GET':
        return 'Data retrieved successfully';
      case 'POST':
        return 'Resource created successfully';
      case 'PUT':
      case 'PATCH':
        return 'Resource updated successfully';
      case 'DELETE':
        return 'Resource deleted successfully';
      default:
        return 'Operation completed successfully';
    }
  }
}
