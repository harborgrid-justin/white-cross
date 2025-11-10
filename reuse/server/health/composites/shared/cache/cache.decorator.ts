/**
 * LOC: HLTH-SHARED-CACHE-002
 * File: /reuse/server/health/composites/shared/cache/cache.decorator.ts
 * PURPOSE: Declarative caching decorators for healthcare composites
 * USAGE: @Cacheable('namespace', ttl) decorator on methods
 */

import { Logger } from '@nestjs/common';

export interface CacheableOptions {
  namespace?: string;
  ttl?: number; // seconds
  keyGenerator?: (...args: any[]) => string;
  condition?: (...args: any[]) => boolean;
  tags?: string[] | ((...args: any[]) => string[]);
}

const logger = new Logger('CacheDecorator');

/**
 * Cache method results with automatic key generation
 *
 * @example
 * ```typescript
 * @Cacheable('patient:demographics', 900) // 15 min cache
 * async getPatientDemographics(patientId: string) {
 *   return await this.patientRepository.findOne(patientId);
 * }
 * ```
 */
export function Cacheable(
  namespaceOrOptions: string | CacheableOptions,
  ttl?: number,
): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    const methodName = String(propertyKey);

    // Parse options
    const options: CacheableOptions = typeof namespaceOrOptions === 'string'
      ? { namespace: namespaceOrOptions, ttl }
      : namespaceOrOptions;

    descriptor.value = async function (...args: any[]) {
      // Check condition if provided
      if (options.condition && !options.condition(...args)) {
        return await originalMethod.apply(this, args);
      }

      // Get cache service from instance
      const cacheService = (this as any).cacheService || (this as any).cache;

      if (!cacheService) {
        logger.warn(`No cache service found for ${target.constructor.name}.${methodName}, executing without cache`);
        return await originalMethod.apply(this, args);
      }

      // Generate cache key
      const cacheKey = options.keyGenerator
        ? options.keyGenerator(...args)
        : generateDefaultKey(methodName, args);

      // Try to get from cache
      const cached = await cacheService.get(cacheKey, options.namespace);
      if (cached !== null) {
        logger.debug(`Cache HIT for ${options.namespace}:${cacheKey}`);
        return cached;
      }

      // Execute original method
      const result = await originalMethod.apply(this, args);

      // Generate tags if function provided
      const tags = typeof options.tags === 'function'
        ? options.tags(...args)
        : options.tags;

      // Store in cache
      await cacheService.set(cacheKey, result, {
        namespace: options.namespace,
        ttl: options.ttl,
        tags,
      });

      logger.debug(`Cache MISS for ${options.namespace}:${cacheKey}, cached result`);
      return result;
    };

    return descriptor;
  };
}

/**
 * Invalidate cache entries by pattern or tags
 *
 * @example
 * ```typescript
 * @CacheInvalidate('patient:*', { byPattern: true })
 * async updatePatient(patientId: string, data: any) {
 *   return await this.patientRepository.update(patientId, data);
 * }
 * ```
 */
export function CacheInvalidate(
  patternOrTag: string | string[],
  options: { byPattern?: boolean; byTag?: boolean } = {},
): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args);

      // Get cache service
      const cacheService = (this as any).cacheService || (this as any).cache;

      if (!cacheService) {
        logger.warn(`No cache service found for invalidation`);
        return result;
      }

      // Invalidate cache
      const patterns = Array.isArray(patternOrTag) ? patternOrTag : [patternOrTag];

      for (const pattern of patterns) {
        if (options.byTag) {
          await cacheService.invalidateByTag(pattern);
          logger.debug(`Cache invalidated by tag: ${pattern}`);
        } else if (options.byPattern) {
          await cacheService.deletePattern(pattern);
          logger.debug(`Cache invalidated by pattern: ${pattern}`);
        } else {
          await cacheService.delete(pattern);
          logger.debug(`Cache invalidated: ${pattern}`);
        }
      }

      return result;
    };

    return descriptor;
  };
}

/**
 * Generate default cache key from method arguments
 */
function generateDefaultKey(methodName: string, args: any[]): string {
  if (args.length === 0) {
    return methodName;
  }

  const keyParts = args.map((arg) => {
    if (arg === null || arg === undefined) {
      return 'null';
    }
    if (typeof arg === 'object') {
      // For objects, create a stable key from sorted properties
      try {
        return JSON.stringify(sortObject(arg));
      } catch {
        return String(arg);
      }
    }
    return String(arg);
  });

  return `${methodName}:${keyParts.join(':')}`;
}

/**
 * Sort object properties for consistent key generation
 */
function sortObject(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(sortObject);
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj)
      .sort()
      .reduce((result, key) => {
        result[key] = sortObject(obj[key]);
        return result;
      }, {} as any);
  }
  return obj;
}
