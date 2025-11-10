/**
 * @fileoverview Caching & Performance Barrel Export
 * @module core/cache
 *
 * Comprehensive caching utilities including caching strategies, Redis patterns,
 * performance optimization, and cache management.
 *
 * @example Cache-aside pattern
 * ```typescript
 * import { createCacheManager } from '@reuse/core/cache';
 *
 * const cache = createCacheManager({ ttl: 3600000 });
 *
 * const data = await cache.get('key') || await cache.set('key', await fetchData());
 * ```
 *
 * @example Redis caching
 * ```typescript
 * import { RedisCache } from '@reuse/core/cache';
 *
 * const redis = new RedisCache({
 *   host: 'localhost',
 *   port: 6379
 * });
 *
 * await redis.set('user:123', userData, 3600);
 * ```
 */
export * from './strategies';
export * from './redis';
export * from './performance';
export * from './management-kit';
export * from './strategies-kit';
export { default as CacheManagementKit } from './management-kit';
export { default as CacheStrategiesKit } from './strategies-kit';
//# sourceMappingURL=index.d.ts.map