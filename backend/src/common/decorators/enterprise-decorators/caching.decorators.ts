/**
 * Enterprise Caching Decorators
 *
 * Provides Redis-based caching capabilities for methods and controllers
 * with support for TTL, cache invalidation, and cache warming strategies.
 */

import { Injectable, Inject, SetMetadata } from '@nestjs/common';
import { CacheOptions } from './types';

/**
 * Metadata key for caching configuration
 */
export const CACHING_METADATA = 'enterprise:caching';

/**
 * Cache manager interface for enterprise caching
 */
export interface IEnterpriseCacheManager {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  del(key: string): Promise<void>;
  delPattern(pattern: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  ttl(key: string): Promise<number>;
}

/**
 * Redis-based cache manager implementation
 */
@Injectable()
export class RedisCacheManager implements IEnterpriseCacheManager {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: any,
  ) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redisClient.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.warn(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      if (ttl) {
        await this.redisClient.setex(key, ttl, serializedValue);
      } else {
        await this.redisClient.set(key, serializedValue);
      }
    } catch (error) {
      console.warn(`Cache set error for key ${key}:`, error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redisClient.del(key);
    } catch (error) {
      console.warn(`Cache delete error for key ${key}:`, error);
    }
  }

  async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redisClient.keys(pattern);
      if (keys.length > 0) {
        await this.redisClient.del(keys);
      }
    } catch (error) {
      console.warn(`Cache delete pattern error for ${pattern}:`, error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redisClient.exists(key);
      return result === 1;
    } catch (error) {
      console.warn(`Cache exists error for key ${key}:`, error);
      return false;
    }
  }

  async ttl(key: string): Promise<number> {
    try {
      return await this.redisClient.ttl(key);
    } catch (error) {
      console.warn(`Cache TTL error for key ${key}:`, error);
      return -1;
    }
  }
}

/**
 * Method-level caching decorator
 */
export function CacheResult(options: CacheOptions = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const methodName = `${target.constructor.name}.${propertyKey}`;

    descriptor.value = async function (...args: any[]) {
      const cacheManager = (this as any).cacheManager as IEnterpriseCacheManager;
      if (!cacheManager) {
        console.warn(`No cache manager available for ${methodName}`);
        return await originalMethod.apply(this, args);
      }

      // Generate cache key
      const cacheKey = options.keyGenerator
        ? options.keyGenerator({} as any) // Would need proper ExecutionContext
        : `${methodName}:${JSON.stringify(args)}`;

      const fullKey = `${options.keyPrefix || 'cache'}:${cacheKey}`;

      try {
        // Try to get from cache first
        const cachedResult = await cacheManager.get(fullKey);
        if (cachedResult !== null || (cachedResult === null && options.cacheNulls)) {
          return cachedResult;
        }

        // Execute method and cache result
        const result = await originalMethod.apply(this, args);

        if (result !== null || options.cacheNulls) {
          await cacheManager.set(fullKey, result, options.ttl || 300); // 5 minutes default
        }

        return result;
      } catch (error) {
        console.warn(`Cache operation failed for ${methodName}:`, error);
        // Fallback to original method
        return await originalMethod.apply(this, args);
      }
    };

    // Store metadata for reflection
    SetMetadata(CACHING_METADATA, options)(target, propertyKey, descriptor);
  };
}

/**
 * Cache invalidation decorator
 */
export function CacheInvalidate(patterns: string | string[]) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const methodName = `${target.constructor.name}.${propertyKey}`;

    descriptor.value = async function (...args: any[]) {
      const cacheManager = (this as any).cacheManager as IEnterpriseCacheManager;

      try {
        // Execute original method first
        const result = await originalMethod.apply(this, args);

        // Invalidate cache patterns
        if (cacheManager) {
          const patternArray = Array.isArray(patterns) ? patterns : [patterns];
          for (const pattern of patternArray) {
            await cacheManager.delPattern(pattern);
          }
        }

        return result;
      } catch (error) {
        console.warn(`Cache invalidation failed for ${methodName}:`, error);
        // Still execute original method even if cache invalidation fails
        return await originalMethod.apply(this, args);
      }
    };
  };
}

/**
 * Cache warming decorator for pre-populating cache
 */
export function CacheWarmup(options: {
  interval?: number; // Warmup interval in milliseconds
  enabled?: boolean;
}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const methodName = `${target.constructor.name}.${propertyKey}`;

    // Store warmup configuration
    SetMetadata('enterprise:cache-warmup', {
      method: methodName,
      interval: options.interval || 300000, // 5 minutes default
      enabled: options.enabled !== false
    })(target, propertyKey, descriptor);

    // Return original descriptor (warmup is handled by a separate service)
    return descriptor;
  };
}

/**
 * Conditional caching decorator
 */
export function CacheConditional(condition: (result: any) => boolean, options: CacheOptions = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const methodName = `${target.constructor.name}.${propertyKey}`;

    descriptor.value = async function (...args: any[]) {
      const cacheManager = (this as any).cacheManager as IEnterpriseCacheManager;
      if (!cacheManager) {
        return await originalMethod.apply(this, args);
      }

      // Generate cache key
      const cacheKey = options.keyGenerator
        ? options.keyGenerator({} as any)
        : `${methodName}:${JSON.stringify(args)}`;

      const fullKey = `${options.keyPrefix || 'cache'}:${cacheKey}`;

      try {
        // Try to get from cache first
        const cachedResult = await cacheManager.get(fullKey);
        if (cachedResult !== null) {
          return cachedResult;
        }

        // Execute method
        const result = await originalMethod.apply(this, args);

        // Cache only if condition is met
        if (condition(result)) {
          await cacheManager.set(fullKey, result, options.ttl || 300);
        }

        return result;
      } catch (error) {
        console.warn(`Conditional cache operation failed for ${methodName}:`, error);
        return await originalMethod.apply(this, args);
      }
    };

    SetMetadata(CACHING_METADATA, { ...options, conditional: true })(target, propertyKey, descriptor);
  };
}