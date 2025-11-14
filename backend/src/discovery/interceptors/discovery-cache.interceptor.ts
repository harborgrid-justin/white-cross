import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { DiscoveryCacheService } from '../services/discovery-cache.service';
import { CacheConfig } from '../interfaces/cache-config.interface';
import { CACHE_CONFIG_KEY } from '../decorators/cache-config.decorator';
import * as crypto from 'crypto';
import { BaseInterceptor } from '../../common/interceptors/base.interceptor';

@Injectable()
export class DiscoveryCacheInterceptor extends BaseInterceptor implements NestInterceptor {
  constructor(
    private readonly cacheService: DiscoveryCacheService,
    private readonly reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const cacheConfig = this.reflector.getAllAndOverride<CacheConfig>(
      CACHE_CONFIG_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If caching is not enabled, proceed without caching
    if (!cacheConfig?.enabled) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<Request>();
    const cacheKey = this.generateCacheKey(request, cacheConfig);

    try {
      // Try to get from cache
      const cachedResult = await this.cacheService.get(cacheKey);
      if (cachedResult !== null) {
        // Log cache hit using base class
        this.logRequest('debug', `Cache HIT: ${cacheKey}`, {
          operation: 'CACHE_HIT',
          cacheKey: cacheKey.substring(0, 50),
        });
        // Return cached result as observable
        return of(cachedResult);
      }

      // Execute the handler and cache the result
      return next.handle().pipe(
        tap(async (response) => {
          // Only cache successful responses
          if (response !== null && response !== undefined) {
            await this.cacheService.set(cacheKey, response, cacheConfig.ttl);
            // Log cache set using base class
            this.logRequest('debug', `Cache SET: ${cacheKey}`, {
              operation: 'CACHE_SET',
              cacheKey: cacheKey.substring(0, 50),
              ttl: cacheConfig.ttl,
            });
          }
        }),
      );
    } catch (error) {
      // Log cache operation error using base class
      this.logError(`Cache operation failed for key ${cacheKey}`, error, {
        operation: 'CACHE_OPERATION',
        cacheKey: cacheKey.substring(0, 50),
      });
      // Continue with normal execution on cache failure
      return next.handle();
    }
  }

  private generateCacheKey(request: Request, config: CacheConfig): string {
    const keyParts: string[] = [];

    // Add prefix if specified
    if (config.keyPrefix) {
      keyParts.push(config.keyPrefix);
    }

    // Add method and base path
    keyParts.push(request.method);
    keyParts.push(request.route?.path || request.path);

    // Include query parameters if configured
    if (config.includeQuery && Object.keys(request.query).length > 0) {
      const sortedQuery = this.sortObject(request.query);
      keyParts.push('query', JSON.stringify(sortedQuery));
    }

    // Include route parameters if configured
    if (config.includeParams && Object.keys(request.params).length > 0) {
      const sortedParams = this.sortObject(request.params);
      keyParts.push('params', JSON.stringify(sortedParams));
    }

    // Include user information if configured
    if (config.includeUser && (request as any).user) {
      const user = (request as any).user;
      keyParts.push('user', user.id || 'anonymous');

      // Optionally include user role for role-specific caching
      if (user.role) {
        keyParts.push('role', user.role);
      }
    }

    // Create the final cache key
    const rawKey = keyParts.join('|');

    // Hash the key to keep it consistent and manageable
    return crypto.createHash('md5').update(rawKey).digest('hex');
  }

  private sortObject(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.sortObject(item));
    }

    const sortedKeys = Object.keys(obj).sort();
    const sortedObj: any = {};

    for (const key of sortedKeys) {
      sortedObj[key] = this.sortObject(obj[key]);
    }

    return sortedObj;
  }
}
