/**
 * Response Transform Interceptor
 *
 * Transforms all controller responses to match the standard API response format
 * used in the legacy backend. Ensures backward compatibility while using NestJS patterns.
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface StandardResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, StandardResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<StandardResponse<T>> {
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data) => {
        // If data is already in standard format, return as-is
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }

        // Transform to standard format
        const isSuccess = statusCode >= 200 && statusCode < 300;

        return {
          success: isSuccess,
          data,
        };
      }),
    );
  }
}
