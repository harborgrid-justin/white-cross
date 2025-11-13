import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { MemoryOptimizedCacheService } from '@/services/memory-optimized-cache.service';
import { AuthenticatedRequest, CacheableData } from '../types/resource.types';
import { BaseInterceptor } from '../../../common/interceptors/base.interceptor';

/**
 * Smart Cache Interceptor
 *
 * Uses Discovery Service to automatically cache responses based on
 * provider metadata and current memory conditions
 */
@Injectable()
export class SmartCacheInterceptor extends BaseInterceptor implements NestInterceptor {

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
    private readonly cacheService: MemoryOptimizedCacheService,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<CacheableData> {
    const request = context.switchToHttp().getRequest();
    const handler = context.getHandler();
    const controller = context.getClass();

    // Check if caching is enabled for this controller/handler
    const cacheMetadata =
      this.reflector.get('cacheable', controller) ||
      this.reflector.get('cacheable', handler);

    if (!cacheMetadata?.enabled) {
      return next.handle();
    }

    // Generate cache key
    const cacheKey = this.generateCacheKey(
      request,
      controller.name,
      handler.name,
    );

    // Try to get from cache first
    return new Observable((observer) => {
      this.cacheService
        .get(cacheKey)
        .then((cachedResult) => {
          if (cachedResult !== null) {
            this.logRequest('debug', `Cache hit for ${cacheKey}`, {
              operation: 'CACHE_HIT',
              cacheKey: cacheKey.substring(0, 50),
            });
            observer.next(cachedResult);
            observer.complete();
            return;
          }

          // Cache miss - execute handler and cache result
          next
            .handle()
            .pipe(
              tap((result) => {
                // Cache the result
                this.cacheService
                  .set(cacheKey, result, controller.name, cacheMetadata.ttl)
                  .catch((error) => {
                    this.logError(`Failed to cache result for ${cacheKey}`, error, {
                      operation: 'CACHE_SET',
                      cacheKey: cacheKey.substring(0, 50),
                    });
                  });
              }),
            )
            .subscribe({
              next: (result) => observer.next(result),
              error: (error) => observer.error(error),
              complete: () => observer.complete(),
            });
        })
        .catch((error) => {
          this.logError(`Cache lookup failed for ${cacheKey}`, error, {
            operation: 'CACHE_LOOKUP',
            cacheKey: cacheKey.substring(0, 50),
          });
          // Fall back to normal execution
          next.handle().subscribe({
            next: (result) => observer.next(result),
            error: (error) => observer.error(error),
            complete: () => observer.complete(),
          });
        });
    });
  }

  private generateCacheKey(
    request: Partial<AuthenticatedRequest>,
    controllerName: string,
    handlerName: string,
  ): string {
    const method = request.method;
    const url = request.url;
    const queryString = JSON.stringify(request.query || {});
    const bodyHash = request.body
      ? JSON.stringify(request.body).slice(0, 100)
      : '';

    return `${controllerName}:${handlerName}:${method}:${url}:${queryString}:${bodyHash}`;
  }
}
