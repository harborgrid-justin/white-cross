/**
 * Cache Invalidation Interceptor
 * Automatically invalidates cache when health data is updated
 * HIPAA Compliance: Ensures cached PHI data is always current
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HealthDataCacheService } from '../services/health-data-cache.service';

export interface CacheInvalidationConfig {
  studentIdPath?: string; // Path to extract student ID from request/response
  invalidateTypes?: (
    | 'vaccinations'
    | 'allergies'
    | 'chronic-conditions'
    | 'health-summary'
  )[];
  invalidateAll?: boolean;
}

/**
 * Decorator to configure cache invalidation
 */
export function InvalidateCache(config: CacheInvalidationConfig) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    Reflect.defineMetadata('cache:invalidate', config, target, propertyKey);

    return descriptor;
  };
}

@Injectable()
export class CacheInvalidationInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CacheInvalidationInterceptor.name);

  constructor(private readonly cacheService: HealthDataCacheService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const handler = context.getHandler();
    const config: CacheInvalidationConfig = Reflect.getMetadata(
      'cache:invalidate',
      context.getClass().prototype,
      handler.name,
    );

    // If no cache invalidation configured, pass through
    if (!config) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap(async (response) => {
        try {
          await this.invalidateCache(config, request, response);
        } catch (error) {
          this.logger.error('Error invalidating cache:', error);
          // Don't fail the request if cache invalidation fails
        }
      }),
    );
  }

  private async invalidateCache(
    config: CacheInvalidationConfig,
    request: any,
    response: any,
  ): Promise<void> {
    // Extract student ID
    const studentId = this.extractStudentId(config, request, response);

    if (!studentId) {
      this.logger.warn('Could not extract student ID for cache invalidation');
      return;
    }

    // Invalidate based on configuration
    if (config.invalidateAll) {
      await this.cacheService.invalidateStudentHealthData(studentId);
      this.logger.debug(`Invalidated all cache for student ${studentId}`);
      return;
    }

    // Invalidate specific types
    if (config.invalidateTypes) {
      const promises = [];

      for (const type of config.invalidateTypes) {
        switch (type) {
          case 'vaccinations':
            promises.push(
              this.cacheService.delete(`student:vaccinations:${studentId}`),
            );
            break;
          case 'allergies':
            promises.push(
              this.cacheService.delete(`student:allergies:${studentId}`),
            );
            break;
          case 'chronic-conditions':
            promises.push(
              this.cacheService.delete(
                `student:chronic-conditions:${studentId}`,
              ),
            );
            break;
          case 'health-summary':
            promises.push(
              this.cacheService.delete(`student:health:${studentId}`),
            );
            break;
        }
      }

      await Promise.all(promises);
      this.logger.debug(
        `Invalidated cache types [${config.invalidateTypes.join(', ')}] for student ${studentId}`,
      );
    }
  }

  private extractStudentId(
    config: CacheInvalidationConfig,
    request: any,
    response: any,
  ): string | null {
    const path = config.studentIdPath || 'params.studentId';
    const parts = path.split('.');

    // Try to extract from request first
    let value = request;
    for (const part of parts) {
      value = value?.[part];
      if (value === undefined) {
        break;
      }
    }

    if (value) {
      return value;
    }

    // Try to extract from response body
    value = response;
    for (const part of parts) {
      value = value?.[part];
      if (value === undefined) {
        break;
      }
    }

    return value || null;
  }
}

/**
 * Bulk Cache Invalidation Interceptor
 * For operations that affect multiple students
 */
@Injectable()
export class BulkCacheInvalidationInterceptor implements NestInterceptor {
  private readonly logger = new Logger(BulkCacheInvalidationInterceptor.name);

  constructor(private readonly cacheService: HealthDataCacheService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(async (response) => {
        try {
          await this.invalidateBulkCache(response);
        } catch (error) {
          this.logger.error('Error invalidating bulk cache:', error);
        }
      }),
    );
  }

  private async invalidateBulkCache(response: any): Promise<void> {
    // Extract student IDs from bulk operation response
    const studentIds = this.extractStudentIds(response);

    if (studentIds.length === 0) {
      return;
    }

    // Invalidate cache for all affected students
    await Promise.all(
      studentIds.map((studentId) =>
        this.cacheService.invalidateStudentHealthData(studentId),
      ),
    );

    this.logger.debug(`Invalidated cache for ${studentIds.length} students`);
  }

  private extractStudentIds(response: any): string[] {
    const ids: string[] = [];

    // Handle different response formats
    if (Array.isArray(response)) {
      response.forEach((item) => {
        if (item?.studentId) {
          ids.push(item.studentId);
        }
      });
    } else if (response?.records && Array.isArray(response.records)) {
      response.records.forEach((item: any) => {
        if (item?.studentId) {
          ids.push(item.studentId);
        }
      });
    } else if (response?.studentId) {
      ids.push(response.studentId);
    }

    return [...new Set(ids)]; // Remove duplicates
  }
}
