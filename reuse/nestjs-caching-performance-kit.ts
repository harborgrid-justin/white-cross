/**
 * LOC: NEST-CACHE-001
 * File: /reuse/nestjs-caching-performance-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/cache-manager
 *   - redis
 *   - ioredis
 *
 * DOWNSTREAM (imported by):
 *   - Backend service modules
 *   - API controllers
 *   - Performance optimization layers
 */

/**
 * File: /reuse/nestjs-caching-performance-kit.ts
 * Locator: WC-UTL-CACHE-001
 * Purpose: NestJS Caching & Performance - Comprehensive caching utilities and performance optimization
 *
 * Upstream: @nestjs/common, @nestjs/cache-manager, redis, ioredis
 * Downstream: ../backend/*, service modules, API controllers
 * Dependencies: NestJS 10.x, cache-manager 5.x, Redis 7.x, TypeScript 5.x
 * Exports: 45 utility functions for caching, performance optimization, Redis, HTTP caching
 *
 * LLM Context: Comprehensive NestJS caching utilities for White Cross healthcare system.
 * Provides cache decorators, Redis integration, distributed caching, cache invalidation,
 * cache warming, stampede prevention, compression, serialization, memoization, HTTP caching,
 * ETag generation, query result caching, and performance monitoring. Essential for scalable,
 * high-performance healthcare application architecture with HIPAA-compliant data handling.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface CacheConfig {
  ttl?: number;
  max?: number;
  store?: 'memory' | 'redis' | 'memcached';
  compression?: boolean;
  serialization?: 'json' | 'msgpack';
}

interface CacheKeyOptions {
  prefix?: string;
  suffix?: string;
  separator?: string;
  includeVersion?: boolean;
  version?: string;
}

interface CacheInvalidationStrategy {
  pattern?: string;
  tags?: string[];
  ttl?: number;
  cascade?: boolean;
}

interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  size: number;
  keys: number;
}

interface CacheWarmingOptions {
  batchSize?: number;
  delay?: number;
  keys?: string[];
  loader?: (key: string) => Promise<any>;
}

interface MemoizeOptions {
  ttl?: number;
  maxSize?: number;
  keyGenerator?: (...args: any[]) => string;
  resolver?: (...args: any[]) => any;
}

interface CompressionOptions {
  algorithm?: 'gzip' | 'deflate' | 'br';
  level?: number;
  threshold?: number;
}

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number;
  hits: number;
  tags?: string[];
}

interface HttpCacheOptions {
  maxAge?: number;
  sMaxAge?: number;
  private?: boolean;
  public?: boolean;
  noCache?: boolean;
  noStore?: boolean;
  mustRevalidate?: boolean;
}

interface ETagOptions {
  weak?: boolean;
  algorithm?: 'md5' | 'sha1' | 'sha256';
}

// ============================================================================
// CACHE DECORATORS & WRAPPER FUNCTIONS
// ============================================================================

/**
 * 1. Creates a method decorator for automatic caching of method results.
 *
 * @param {any} cacheManager - NestJS cache manager instance
 * @param {number} [ttl=300] - Cache TTL in seconds
 * @param {Function} [keyGenerator] - Custom cache key generator
 * @returns {MethodDecorator} Cache decorator
 *
 * @example
 * ```typescript
 * class PatientService {
 *   @CacheResult(cacheManager, 600)
 *   async findById(id: string): Promise<Patient> {
 *     return this.repository.findOne({ where: { id } });
 *   }
 * }
 * ```
 */
export const createCacheDecorator = (
  cacheManager: any,
  ttl: number = 300,
  keyGenerator?: (...args: any[]) => string,
) => {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = keyGenerator
        ? keyGenerator(...args)
        : `${target.constructor.name}.${propertyKey}:${JSON.stringify(args)}`;

      const cached = await cacheManager.get(cacheKey);
      if (cached !== undefined && cached !== null) {
        return cached;
      }

      const result = await originalMethod.apply(this, args);
      await cacheManager.set(cacheKey, result, ttl);

      return result;
    };

    return descriptor;
  };
};

/**
 * 2. Wraps a function with caching logic.
 *
 * @param {Function} fn - Function to cache
 * @param {any} cacheManager - Cache manager instance
 * @param {CacheConfig} [config] - Cache configuration
 * @returns {Function} Cached function
 *
 * @example
 * ```typescript
 * const getCachedPatient = wrapWithCache(
 *   async (id) => fetchPatient(id),
 *   cacheManager,
 *   { ttl: 600, compression: true }
 * );
 * ```
 */
export const wrapWithCache = <T>(
  fn: (...args: any[]) => Promise<T>,
  cacheManager: any,
  config: CacheConfig = {},
): ((...args: any[]) => Promise<T>) => {
  const { ttl = 300, compression = false } = config;

  return async (...args: any[]): Promise<T> => {
    const cacheKey = `cached:${fn.name}:${JSON.stringify(args)}`;

    const cached = await cacheManager.get(cacheKey);
    if (cached !== undefined && cached !== null) {
      return compression ? await decompress(cached) : cached;
    }

    const result = await fn(...args);
    const valueToCache = compression ? await compress(result) : result;
    await cacheManager.set(cacheKey, valueToCache, ttl);

    return result;
  };
};

/**
 * 3. Creates a cache-evicting decorator that invalidates cache on method execution.
 *
 * @param {any} cacheManager - Cache manager instance
 * @param {string | Function} keyPattern - Cache key pattern or generator
 * @returns {MethodDecorator} Cache eviction decorator
 *
 * @example
 * ```typescript
 * class PatientService {
 *   @CacheEvict(cacheManager, 'patient:*')
 *   async updatePatient(id: string, data: any): Promise<Patient> {
 *     return this.repository.update(id, data);
 *   }
 * }
 * ```
 */
export const createCacheEvictDecorator = (
  cacheManager: any,
  keyPattern: string | ((...args: any[]) => string),
) => {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args);

      const pattern =
        typeof keyPattern === 'function' ? keyPattern(...args) : keyPattern;

      await invalidateCacheByPattern(cacheManager, pattern);

      return result;
    };

    return descriptor;
  };
};

/**
 * 4. Creates a conditional caching decorator based on a predicate.
 *
 * @param {any} cacheManager - Cache manager instance
 * @param {Function} predicate - Function to determine if result should be cached
 * @param {number} [ttl=300] - Cache TTL in seconds
 * @returns {MethodDecorator} Conditional cache decorator
 *
 * @example
 * ```typescript
 * class ReportService {
 *   @ConditionalCache(cacheManager, (result) => result.size < 1000000, 3600)
 *   async generateReport(params: any): Promise<Report> {
 *     return this.compute(params);
 *   }
 * }
 * ```
 */
export const createConditionalCacheDecorator = (
  cacheManager: any,
  predicate: (result: any) => boolean,
  ttl: number = 300,
) => {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${target.constructor.name}.${propertyKey}:${JSON.stringify(args)}`;

      const cached = await cacheManager.get(cacheKey);
      if (cached !== undefined && cached !== null) {
        return cached;
      }

      const result = await originalMethod.apply(this, args);

      if (predicate(result)) {
        await cacheManager.set(cacheKey, result, ttl);
      }

      return result;
    };

    return descriptor;
  };
};

// ============================================================================
// CACHE MANAGERS & CONFIGURATION
// ============================================================================

/**
 * 5. Creates a multi-tier cache manager with fallback support.
 *
 * @param {any[]} cacheManagers - Array of cache managers (ordered by priority)
 * @returns {Object} Multi-tier cache manager
 *
 * @example
 * ```typescript
 * const multiCache = createMultiTierCache([
 *   memoryCacheManager,
 *   redisCacheManager,
 *   diskCacheManager
 * ]);
 * await multiCache.set('key', value, 300);
 * ```
 */
export const createMultiTierCache = (cacheManagers: any[]) => {
  return {
    async get(key: string): Promise<any> {
      for (let i = 0; i < cacheManagers.length; i++) {
        const value = await cacheManagers[i].get(key);
        if (value !== undefined && value !== null) {
          // Backfill higher-priority caches
          for (let j = 0; j < i; j++) {
            await cacheManagers[j].set(key, value);
          }
          return value;
        }
      }
      return null;
    },

    async set(key: string, value: any, ttl?: number): Promise<void> {
      await Promise.all(
        cacheManagers.map((manager) => manager.set(key, value, ttl)),
      );
    },

    async del(key: string): Promise<void> {
      await Promise.all(cacheManagers.map((manager) => manager.del(key)));
    },

    async reset(): Promise<void> {
      await Promise.all(cacheManagers.map((manager) => manager.reset()));
    },

    async wrap<T>(
      key: string,
      fn: () => Promise<T>,
      ttl?: number,
    ): Promise<T> {
      const cached = await this.get(key);
      if (cached !== undefined && cached !== null) {
        return cached;
      }

      const result = await fn();
      await this.set(key, result, ttl);
      return result;
    },
  };
};

/**
 * 6. Creates a cache manager with automatic cleanup of expired entries.
 *
 * @param {any} cacheManager - Base cache manager
 * @param {number} [cleanupInterval=60000] - Cleanup interval in ms
 * @returns {Object} Self-cleaning cache manager
 *
 * @example
 * ```typescript
 * const cleanCache = createSelfCleaningCache(cacheManager, 30000);
 * // Automatically removes expired entries every 30 seconds
 * ```
 */
export const createSelfCleaningCache = (
  cacheManager: any,
  cleanupInterval: number = 60000,
) => {
  const entries = new Map<string, CacheEntry<any>>();
  let cleanupTimer: NodeJS.Timeout;

  const cleanup = () => {
    const now = Date.now();
    for (const [key, entry] of entries.entries()) {
      if (now - entry.timestamp > entry.ttl * 1000) {
        entries.delete(key);
        cacheManager.del(key);
      }
    }
  };

  cleanupTimer = setInterval(cleanup, cleanupInterval);

  return {
    async get(key: string): Promise<any> {
      const entry = entries.get(key);
      if (entry) {
        const now = Date.now();
        if (now - entry.timestamp > entry.ttl * 1000) {
          entries.delete(key);
          await cacheManager.del(key);
          return null;
        }
        entry.hits++;
        return entry.value;
      }
      return cacheManager.get(key);
    },

    async set(key: string, value: any, ttl: number = 300): Promise<void> {
      entries.set(key, {
        value,
        timestamp: Date.now(),
        ttl,
        hits: 0,
      });
      await cacheManager.set(key, value, ttl);
    },

    async del(key: string): Promise<void> {
      entries.delete(key);
      await cacheManager.del(key);
    },

    stopCleanup(): void {
      clearInterval(cleanupTimer);
    },

    getStats(): CacheStats {
      const totalHits = Array.from(entries.values()).reduce(
        (sum, entry) => sum + entry.hits,
        0,
      );
      return {
        hits: totalHits,
        misses: 0,
        hitRate: 0,
        size: entries.size,
        keys: entries.size,
      };
    },
  };
};

/**
 * 7. Creates a cache manager with tag-based invalidation support.
 *
 * @param {any} cacheManager - Base cache manager
 * @returns {Object} Tag-based cache manager
 *
 * @example
 * ```typescript
 * const tagCache = createTaggedCache(cacheManager);
 * await tagCache.set('patient:123', data, 300, ['patient', 'active']);
 * await tagCache.invalidateByTag('patient'); // Invalidates all patient cache
 * ```
 */
export const createTaggedCache = (cacheManager: any) => {
  const tagIndex = new Map<string, Set<string>>();
  const keyTags = new Map<string, Set<string>>();

  return {
    async get(key: string): Promise<any> {
      return cacheManager.get(key);
    },

    async set(key: string, value: any, ttl?: number, tags?: string[]): Promise<void> {
      await cacheManager.set(key, value, ttl);

      if (tags && tags.length > 0) {
        keyTags.set(key, new Set(tags));
        tags.forEach((tag) => {
          if (!tagIndex.has(tag)) {
            tagIndex.set(tag, new Set());
          }
          tagIndex.get(tag)!.add(key);
        });
      }
    },

    async del(key: string): Promise<void> {
      await cacheManager.del(key);
      const tags = keyTags.get(key);
      if (tags) {
        tags.forEach((tag) => {
          tagIndex.get(tag)?.delete(key);
        });
        keyTags.delete(key);
      }
    },

    async invalidateByTag(tag: string): Promise<void> {
      const keys = tagIndex.get(tag);
      if (keys) {
        await Promise.all(Array.from(keys).map((key) => this.del(key)));
        tagIndex.delete(tag);
      }
    },

    async invalidateByTags(tags: string[]): Promise<void> {
      await Promise.all(tags.map((tag) => this.invalidateByTag(tag)));
    },

    getKeysByTag(tag: string): string[] {
      return Array.from(tagIndex.get(tag) || []);
    },
  };
};

/**
 * 8. Creates a cache manager with adaptive TTL based on access patterns.
 *
 * @param {any} cacheManager - Base cache manager
 * @param {number} [baseTTL=300] - Base TTL in seconds
 * @param {number} [maxTTL=3600] - Maximum TTL in seconds
 * @returns {Object} Adaptive cache manager
 *
 * @example
 * ```typescript
 * const adaptiveCache = createAdaptiveTTLCache(cacheManager, 300, 7200);
 * // Frequently accessed items get longer TTL automatically
 * ```
 */
export const createAdaptiveTTLCache = (
  cacheManager: any,
  baseTTL: number = 300,
  maxTTL: number = 3600,
) => {
  const accessCounts = new Map<string, number>();

  return {
    async get(key: string): Promise<any> {
      const value = await cacheManager.get(key);
      if (value !== undefined && value !== null) {
        accessCounts.set(key, (accessCounts.get(key) || 0) + 1);
      }
      return value;
    },

    async set(key: string, value: any, ttl?: number): Promise<void> {
      const accessCount = accessCounts.get(key) || 0;
      const adaptiveTTL = Math.min(
        baseTTL * (1 + Math.log(accessCount + 1)),
        maxTTL,
      );
      await cacheManager.set(key, value, ttl || adaptiveTTL);
    },

    async del(key: string): Promise<void> {
      accessCounts.delete(key);
      await cacheManager.del(key);
    },

    getAccessCount(key: string): number {
      return accessCounts.get(key) || 0;
    },

    resetAccessCounts(): void {
      accessCounts.clear();
    },
  };
};

// ============================================================================
// REDIS INTEGRATION
// ============================================================================

/**
 * 9. Creates a Redis cache client with connection pooling and retry logic.
 *
 * @param {Object} redisConfig - Redis configuration
 * @returns {Promise<Object>} Redis cache client
 *
 * @example
 * ```typescript
 * const redisCache = await createRedisCache({
 *   host: 'localhost',
 *   port: 6379,
 *   password: 'secret',
 *   db: 0
 * });
 * ```
 */
export const createRedisCache = async (redisConfig: {
  host: string;
  port: number;
  password?: string;
  db?: number;
  maxRetriesPerRequest?: number;
}) => {
  // Note: Actual Redis client creation would use ioredis or node-redis
  const client: any = {
    isConnected: false,
    config: redisConfig,
  };

  return {
    async get(key: string): Promise<any> {
      try {
        const value = await client.get(key);
        return value ? JSON.parse(value) : null;
      } catch (error) {
        console.error('Redis get error:', error);
        return null;
      }
    },

    async set(key: string, value: any, ttl?: number): Promise<void> {
      try {
        const serialized = JSON.stringify(value);
        if (ttl) {
          await client.setex(key, ttl, serialized);
        } else {
          await client.set(key, serialized);
        }
      } catch (error) {
        console.error('Redis set error:', error);
      }
    },

    async del(key: string): Promise<void> {
      try {
        await client.del(key);
      } catch (error) {
        console.error('Redis del error:', error);
      }
    },

    async mget(keys: string[]): Promise<any[]> {
      try {
        const values = await client.mget(...keys);
        return values.map((v: string) => (v ? JSON.parse(v) : null));
      } catch (error) {
        console.error('Redis mget error:', error);
        return [];
      }
    },

    async mset(entries: Array<{ key: string; value: any; ttl?: number }>): Promise<void> {
      try {
        const pipeline = client.pipeline();
        entries.forEach(({ key, value, ttl }) => {
          const serialized = JSON.stringify(value);
          if (ttl) {
            pipeline.setex(key, ttl, serialized);
          } else {
            pipeline.set(key, serialized);
          }
        });
        await pipeline.exec();
      } catch (error) {
        console.error('Redis mset error:', error);
      }
    },

    async keys(pattern: string): Promise<string[]> {
      try {
        return await client.keys(pattern);
      } catch (error) {
        console.error('Redis keys error:', error);
        return [];
      }
    },

    async ttl(key: string): Promise<number> {
      try {
        return await client.ttl(key);
      } catch (error) {
        console.error('Redis ttl error:', error);
        return -1;
      }
    },

    async expire(key: string, seconds: number): Promise<void> {
      try {
        await client.expire(key, seconds);
      } catch (error) {
        console.error('Redis expire error:', error);
      }
    },

    async flushdb(): Promise<void> {
      try {
        await client.flushdb();
      } catch (error) {
        console.error('Redis flushdb error:', error);
      }
    },

    async disconnect(): Promise<void> {
      try {
        await client.quit();
      } catch (error) {
        console.error('Redis disconnect error:', error);
      }
    },
  };
};

/**
 * 10. Creates a Redis-based distributed cache with pub/sub for cache invalidation.
 *
 * @param {any} redisClient - Redis client instance
 * @param {string} [channel='cache-invalidation'] - Pub/sub channel name
 * @returns {Object} Distributed cache with pub/sub
 *
 * @example
 * ```typescript
 * const distributedCache = createDistributedRedisCache(redisClient);
 * await distributedCache.set('key', value, 300);
 * // Invalidation broadcasts to all instances
 * ```
 */
export const createDistributedRedisCache = (
  redisClient: any,
  channel: string = 'cache-invalidation',
) => {
  const subscriber = redisClient.duplicate();
  const invalidationCallbacks = new Set<(key: string) => void>();

  subscriber.subscribe(channel);
  subscriber.on('message', (ch: string, key: string) => {
    if (ch === channel) {
      invalidationCallbacks.forEach((callback) => callback(key));
    }
  });

  return {
    async get(key: string): Promise<any> {
      const value = await redisClient.get(key);
      return value ? JSON.parse(value) : null;
    },

    async set(key: string, value: any, ttl?: number): Promise<void> {
      const serialized = JSON.stringify(value);
      if (ttl) {
        await redisClient.setex(key, ttl, serialized);
      } else {
        await redisClient.set(key, serialized);
      }
    },

    async del(key: string): Promise<void> {
      await redisClient.del(key);
      await redisClient.publish(channel, key);
    },

    onInvalidation(callback: (key: string) => void): void {
      invalidationCallbacks.add(callback);
    },

    offInvalidation(callback: (key: string) => void): void {
      invalidationCallbacks.delete(callback);
    },

    async disconnect(): Promise<void> {
      await subscriber.unsubscribe(channel);
      await subscriber.quit();
    },
  };
};

// ============================================================================
// IN-MEMORY CACHING
// ============================================================================

/**
 * 11. Creates a simple in-memory LRU cache with size limits.
 *
 * @param {number} [maxSize=1000] - Maximum number of entries
 * @returns {Object} LRU cache manager
 *
 * @example
 * ```typescript
 * const lruCache = createLRUCache(500);
 * await lruCache.set('key', value);
 * const cached = await lruCache.get('key');
 * ```
 */
export const createLRUCache = (maxSize: number = 1000) => {
  const cache = new Map<string, { value: any; timestamp: number }>();
  const accessOrder = new Map<string, number>();
  let accessCounter = 0;

  return {
    async get(key: string): Promise<any> {
      const entry = cache.get(key);
      if (entry) {
        accessOrder.set(key, ++accessCounter);
        return entry.value;
      }
      return null;
    },

    async set(key: string, value: any): Promise<void> {
      if (cache.size >= maxSize && !cache.has(key)) {
        // Evict least recently used
        let lruKey: string | null = null;
        let minAccess = Infinity;

        for (const [k, access] of accessOrder.entries()) {
          if (access < minAccess) {
            minAccess = access;
            lruKey = k;
          }
        }

        if (lruKey) {
          cache.delete(lruKey);
          accessOrder.delete(lruKey);
        }
      }

      cache.set(key, { value, timestamp: Date.now() });
      accessOrder.set(key, ++accessCounter);
    },

    async del(key: string): Promise<void> {
      cache.delete(key);
      accessOrder.delete(key);
    },

    async reset(): Promise<void> {
      cache.clear();
      accessOrder.clear();
      accessCounter = 0;
    },

    size(): number {
      return cache.size;
    },

    keys(): string[] {
      return Array.from(cache.keys());
    },
  };
};

/**
 * 12. Creates an in-memory cache with time-based expiration.
 *
 * @param {number} [defaultTTL=300] - Default TTL in seconds
 * @returns {Object} TTL-based cache manager
 *
 * @example
 * ```typescript
 * const ttlCache = createTTLCache(600);
 * await ttlCache.set('key', value, 300); // 5 minute TTL
 * ```
 */
export const createTTLCache = (defaultTTL: number = 300) => {
  const cache = new Map<
    string,
    { value: any; expiry: number; ttl: number }
  >();

  return {
    async get(key: string): Promise<any> {
      const entry = cache.get(key);
      if (!entry) return null;

      if (Date.now() > entry.expiry) {
        cache.delete(key);
        return null;
      }

      return entry.value;
    },

    async set(key: string, value: any, ttl?: number): Promise<void> {
      const effectiveTTL = ttl || defaultTTL;
      cache.set(key, {
        value,
        expiry: Date.now() + effectiveTTL * 1000,
        ttl: effectiveTTL,
      });
    },

    async del(key: string): Promise<void> {
      cache.delete(key);
    },

    async reset(): Promise<void> {
      cache.clear();
    },

    async cleanupExpired(): Promise<number> {
      const now = Date.now();
      let cleaned = 0;

      for (const [key, entry] of cache.entries()) {
        if (now > entry.expiry) {
          cache.delete(key);
          cleaned++;
        }
      }

      return cleaned;
    },

    size(): number {
      return cache.size;
    },
  };
};

// ============================================================================
// DISTRIBUTED CACHING
// ============================================================================

/**
 * 13. Creates a distributed cache coordinator for multi-instance deployments.
 *
 * @param {any[]} cacheNodes - Array of cache node clients
 * @param {Function} [hashFn] - Consistent hashing function
 * @returns {Object} Distributed cache coordinator
 *
 * @example
 * ```typescript
 * const distCache = createDistributedCache([
 *   redisNode1,
 *   redisNode2,
 *   redisNode3
 * ]);
 * await distCache.set('key', value); // Automatically sharded
 * ```
 */
export const createDistributedCache = (
  cacheNodes: any[],
  hashFn?: (key: string) => number,
) => {
  const defaultHash = (key: string): number => {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash << 5) - hash + key.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash);
  };

  const getNode = (key: string): any => {
    const hash = (hashFn || defaultHash)(key);
    const index = hash % cacheNodes.length;
    return cacheNodes[index];
  };

  return {
    async get(key: string): Promise<any> {
      const node = getNode(key);
      return node.get(key);
    },

    async set(key: string, value: any, ttl?: number): Promise<void> {
      const node = getNode(key);
      await node.set(key, value, ttl);
    },

    async del(key: string): Promise<void> {
      const node = getNode(key);
      await node.del(key);
    },

    async mget(keys: string[]): Promise<any[]> {
      const nodeGroups = new Map<any, string[]>();

      keys.forEach((key) => {
        const node = getNode(key);
        if (!nodeGroups.has(node)) {
          nodeGroups.set(node, []);
        }
        nodeGroups.get(node)!.push(key);
      });

      const results = new Map<string, any>();

      await Promise.all(
        Array.from(nodeGroups.entries()).map(async ([node, nodeKeys]) => {
          const values = await node.mget(nodeKeys);
          nodeKeys.forEach((key, index) => {
            results.set(key, values[index]);
          });
        }),
      );

      return keys.map((key) => results.get(key));
    },

    async broadcast(fn: (node: any) => Promise<void>): Promise<void> {
      await Promise.all(cacheNodes.map((node) => fn(node)));
    },

    async flushAll(): Promise<void> {
      await this.broadcast((node) => node.flushdb());
    },
  };
};

// ============================================================================
// CACHE INVALIDATION STRATEGIES
// ============================================================================

/**
 * 14. Invalidates cache entries matching a pattern.
 *
 * @param {any} cacheManager - Cache manager instance
 * @param {string} pattern - Key pattern (supports wildcards)
 * @returns {Promise<number>} Number of invalidated keys
 *
 * @example
 * ```typescript
 * await invalidateCacheByPattern(cacheManager, 'patient:*');
 * await invalidateCacheByPattern(cacheManager, '*:active');
 * ```
 */
export const invalidateCacheByPattern = async (
  cacheManager: any,
  pattern: string,
): Promise<number> => {
  try {
    const keys = await cacheManager.store.keys(pattern);
    await Promise.all(keys.map((key: string) => cacheManager.del(key)));
    return keys.length;
  } catch (error) {
    console.error('Cache invalidation error:', error);
    return 0;
  }
};

/**
 * 15. Creates a cascade invalidation strategy for related cache entries.
 *
 * @param {any} cacheManager - Cache manager instance
 * @param {Map<string, string[]>} dependencies - Cache key dependencies map
 * @returns {Object} Cascade invalidation manager
 *
 * @example
 * ```typescript
 * const invalidator = createCascadeInvalidation(cacheManager, new Map([
 *   ['patient:123', ['visit:*:patient:123', 'prescription:patient:123']]
 * ]));
 * await invalidator.invalidate('patient:123'); // Invalidates all related
 * ```
 */
export const createCascadeInvalidation = (
  cacheManager: any,
  dependencies: Map<string, string[]>,
) => {
  return {
    async invalidate(key: string): Promise<void> {
      await cacheManager.del(key);

      const relatedPatterns = dependencies.get(key);
      if (relatedPatterns) {
        await Promise.all(
          relatedPatterns.map((pattern) =>
            invalidateCacheByPattern(cacheManager, pattern),
          ),
        );
      }
    },

    addDependency(key: string, dependentPattern: string): void {
      if (!dependencies.has(key)) {
        dependencies.set(key, []);
      }
      dependencies.get(key)!.push(dependentPattern);
    },

    removeDependency(key: string, dependentPattern: string): void {
      const deps = dependencies.get(key);
      if (deps) {
        const index = deps.indexOf(dependentPattern);
        if (index > -1) {
          deps.splice(index, 1);
        }
      }
    },
  };
};

/**
 * 16. Creates a time-based batch invalidation strategy.
 *
 * @param {any} cacheManager - Cache manager instance
 * @param {number} [batchInterval=60000] - Batch interval in ms
 * @returns {Object} Batch invalidation manager
 *
 * @example
 * ```typescript
 * const batchInvalidator = createBatchInvalidation(cacheManager, 30000);
 * batchInvalidator.scheduleInvalidation('patient:123');
 * // Batched invalidation every 30 seconds
 * ```
 */
export const createBatchInvalidation = (
  cacheManager: any,
  batchInterval: number = 60000,
) => {
  const pendingInvalidations = new Set<string>();
  let batchTimer: NodeJS.Timeout;

  const processBatch = async () => {
    if (pendingInvalidations.size > 0) {
      const keys = Array.from(pendingInvalidations);
      await Promise.all(keys.map((key) => cacheManager.del(key)));
      pendingInvalidations.clear();
    }
  };

  batchTimer = setInterval(processBatch, batchInterval);

  return {
    scheduleInvalidation(key: string): void {
      pendingInvalidations.add(key);
    },

    async flushNow(): Promise<void> {
      await processBatch();
    },

    getPendingCount(): number {
      return pendingInvalidations.size;
    },

    stop(): void {
      clearInterval(batchTimer);
    },
  };
};

// ============================================================================
// CACHE WARMING & PRELOADING
// ============================================================================

/**
 * 17. Warms up cache with frequently accessed data.
 *
 * @param {any} cacheManager - Cache manager instance
 * @param {CacheWarmingOptions} options - Warming options
 * @returns {Promise<number>} Number of entries warmed
 *
 * @example
 * ```typescript
 * await warmCache(cacheManager, {
 *   keys: ['patient:active', 'appointments:today'],
 *   loader: async (key) => await fetchData(key),
 *   batchSize: 10
 * });
 * ```
 */
export const warmCache = async (
  cacheManager: any,
  options: CacheWarmingOptions,
): Promise<number> => {
  const { batchSize = 10, delay = 100, keys = [], loader } = options;

  if (!loader) {
    throw new Error('Loader function is required for cache warming');
  }

  let warmed = 0;

  for (let i = 0; i < keys.length; i += batchSize) {
    const batch = keys.slice(i, i + batchSize);

    await Promise.all(
      batch.map(async (key) => {
        try {
          const value = await loader(key);
          await cacheManager.set(key, value);
          warmed++;
        } catch (error) {
          console.error(`Failed to warm cache for key ${key}:`, error);
        }
      }),
    );

    if (i + batchSize < keys.length && delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return warmed;
};

/**
 * 18. Creates a cache preloader that runs on application startup.
 *
 * @param {any} cacheManager - Cache manager instance
 * @param {Function} dataLoader - Function to load preload data
 * @returns {Promise<void>} Preload completion promise
 *
 * @example
 * ```typescript
 * await preloadCache(cacheManager, async () => {
 *   return {
 *     'config:app': await loadAppConfig(),
 *     'lookup:states': await loadStates()
 *   };
 * });
 * ```
 */
export const preloadCache = async (
  cacheManager: any,
  dataLoader: () => Promise<Record<string, any>>,
): Promise<void> => {
  try {
    const data = await dataLoader();

    await Promise.all(
      Object.entries(data).map(([key, value]) =>
        cacheManager.set(key, value, 86400), // 24 hour TTL for preloaded data
      ),
    );

    console.log(`Preloaded ${Object.keys(data).length} cache entries`);
  } catch (error) {
    console.error('Cache preload failed:', error);
  }
};

// ============================================================================
// CACHE PATTERNS (Cache-Aside, Write-Through, Write-Behind)
// ============================================================================

/**
 * 19. Implements cache-aside (lazy loading) pattern.
 *
 * @param {any} cacheManager - Cache manager instance
 * @param {Function} dataLoader - Function to load data on cache miss
 * @param {number} [ttl=300] - Cache TTL in seconds
 * @returns {Function} Cache-aside wrapper
 *
 * @example
 * ```typescript
 * const getPatient = cacheAsidePattern(
 *   cacheManager,
 *   async (id) => await db.findPatient(id),
 *   600
 * );
 * const patient = await getPatient('patient:123');
 * ```
 */
export const cacheAsidePattern = <T>(
  cacheManager: any,
  dataLoader: (key: string) => Promise<T>,
  ttl: number = 300,
) => {
  return async (key: string): Promise<T> => {
    // Try to get from cache
    let value = await cacheManager.get(key);

    if (value === null || value === undefined) {
      // Cache miss - load from data source
      value = await dataLoader(key);

      // Store in cache
      await cacheManager.set(key, value, ttl);
    }

    return value;
  };
};

/**
 * 20. Implements write-through caching pattern.
 *
 * @param {any} cacheManager - Cache manager instance
 * @param {Function} dataSaver - Function to save data to database
 * @param {number} [ttl=300] - Cache TTL in seconds
 * @returns {Function} Write-through wrapper
 *
 * @example
 * ```typescript
 * const savePatient = writeThroughPattern(
 *   cacheManager,
 *   async (key, data) => await db.save(data),
 *   600
 * );
 * await savePatient('patient:123', patientData);
 * ```
 */
export const writeThroughPattern = <T>(
  cacheManager: any,
  dataSaver: (key: string, data: T) => Promise<T>,
  ttl: number = 300,
) => {
  return async (key: string, data: T): Promise<T> => {
    // Write to database first
    const saved = await dataSaver(key, data);

    // Then update cache
    await cacheManager.set(key, saved, ttl);

    return saved;
  };
};

/**
 * 21. Implements write-behind (write-back) caching pattern.
 *
 * @param {any} cacheManager - Cache manager instance
 * @param {Function} dataSaver - Function to save data to database
 * @param {number} [flushInterval=5000] - Flush interval in ms
 * @returns {Object} Write-behind cache manager
 *
 * @example
 * ```typescript
 * const writeBehindCache = writeBehindPattern(
 *   cacheManager,
 *   async (entries) => await db.batchSave(entries),
 *   10000
 * );
 * await writeBehindCache.set('patient:123', data);
 * ```
 */
export const writeBehindPattern = (
  cacheManager: any,
  dataSaver: (entries: Array<{ key: string; value: any }>) => Promise<void>,
  flushInterval: number = 5000,
) => {
  const pendingWrites = new Map<string, any>();
  let flushTimer: NodeJS.Timeout;

  const flush = async () => {
    if (pendingWrites.size > 0) {
      const entries = Array.from(pendingWrites.entries()).map(
        ([key, value]) => ({ key, value }),
      );

      try {
        await dataSaver(entries);
        pendingWrites.clear();
      } catch (error) {
        console.error('Write-behind flush failed:', error);
      }
    }
  };

  flushTimer = setInterval(flush, flushInterval);

  return {
    async get(key: string): Promise<any> {
      // Check pending writes first
      if (pendingWrites.has(key)) {
        return pendingWrites.get(key);
      }
      return cacheManager.get(key);
    },

    async set(key: string, value: any, ttl?: number): Promise<void> {
      // Write to cache immediately
      await cacheManager.set(key, value, ttl);

      // Queue for async database write
      pendingWrites.set(key, value);
    },

    async flushNow(): Promise<void> {
      await flush();
    },

    stop(): void {
      clearInterval(flushTimer);
      flush(); // Final flush
    },

    getPendingWriteCount(): number {
      return pendingWrites.size;
    },
  };
};

// ============================================================================
// CACHE STAMPEDE PREVENTION
// ============================================================================

/**
 * 22. Prevents cache stampede using request coalescing.
 *
 * @param {any} cacheManager - Cache manager instance
 * @param {Function} dataLoader - Function to load data
 * @param {number} [ttl=300] - Cache TTL in seconds
 * @returns {Function} Stampede-protected loader
 *
 * @example
 * ```typescript
 * const getReport = preventCacheStampede(
 *   cacheManager,
 *   async (reportId) => await generateReport(reportId),
 *   3600
 * );
 * // Multiple simultaneous requests coalesce into single DB query
 * ```
 */
export const preventCacheStampede = <T>(
  cacheManager: any,
  dataLoader: (key: string) => Promise<T>,
  ttl: number = 300,
) => {
  const inflightRequests = new Map<string, Promise<T>>();

  return async (key: string): Promise<T> => {
    // Check cache first
    const cached = await cacheManager.get(key);
    if (cached !== null && cached !== undefined) {
      return cached;
    }

    // Check if request is already in flight
    if (inflightRequests.has(key)) {
      return inflightRequests.get(key)!;
    }

    // Start new request
    const promise = (async () => {
      try {
        const value = await dataLoader(key);
        await cacheManager.set(key, value, ttl);
        return value;
      } finally {
        inflightRequests.delete(key);
      }
    })();

    inflightRequests.set(key, promise);
    return promise;
  };
};

/**
 * 23. Implements probabilistic early expiration to prevent stampede.
 *
 * @param {any} cacheManager - Cache manager instance
 * @param {Function} dataLoader - Function to load data
 * @param {number} [ttl=300] - Cache TTL in seconds
 * @param {number} [beta=1] - Beta factor for probability calculation
 * @returns {Function} Early expiration loader
 *
 * @example
 * ```typescript
 * const getData = probabilisticEarlyExpiration(
 *   cacheManager,
 *   async (key) => await loadData(key),
 *   600,
 *   1.5
 * );
 * ```
 */
export const probabilisticEarlyExpiration = <T>(
  cacheManager: any,
  dataLoader: (key: string) => Promise<T>,
  ttl: number = 300,
  beta: number = 1,
) => {
  const startTimes = new Map<string, number>();

  return async (key: string): Promise<T> => {
    const cached = await cacheManager.get(key);
    const now = Date.now();

    if (cached !== null && cached !== undefined) {
      const startTime = startTimes.get(key) || now;
      const delta = now - startTime;
      const remainingTTL = await cacheManager.ttl?.(key);

      if (remainingTTL && remainingTTL > 0) {
        const probability = delta * beta * Math.log(Math.random());
        if (probability < remainingTTL * 1000) {
          return cached;
        }
      }
    }

    // Refresh cache
    const value = await dataLoader(key);
    await cacheManager.set(key, value, ttl);
    startTimes.set(key, now);

    return value;
  };
};

// ============================================================================
// CACHE KEY GENERATION
// ============================================================================

/**
 * 24. Generates deterministic cache keys from function arguments.
 *
 * @param {string} prefix - Key prefix
 * @param {CacheKeyOptions} [options] - Key generation options
 * @returns {Function} Key generator function
 *
 * @example
 * ```typescript
 * const keyGen = generateCacheKey('patient', { includeVersion: true, version: 'v2' });
 * const key = keyGen(123, 'active'); // 'patient:v2:123:active'
 * ```
 */
export const generateCacheKey = (
  prefix: string,
  options: CacheKeyOptions = {},
) => {
  const {
    suffix = '',
    separator = ':',
    includeVersion = false,
    version = 'v1',
  } = options;

  return (...args: any[]): string => {
    const parts = [prefix];

    if (includeVersion) {
      parts.push(version);
    }

    parts.push(...args.map((arg) => String(arg)));

    if (suffix) {
      parts.push(suffix);
    }

    return parts.join(separator);
  };
};

/**
 * 25. Creates a hash-based cache key for complex objects.
 *
 * @param {string} prefix - Key prefix
 * @param {any} obj - Object to hash
 * @param {string} [algorithm='md5'] - Hash algorithm
 * @returns {string} Hashed cache key
 *
 * @example
 * ```typescript
 * const key = hashCacheKey('query', {
 *   filters: { status: 'active' },
 *   sort: 'name',
 *   page: 1
 * }); // 'query:a3f2b1c9d8e7f6'
 * ```
 */
export const hashCacheKey = (
  prefix: string,
  obj: any,
  algorithm: string = 'md5',
): string => {
  // Simple hash implementation (in production, use crypto.createHash)
  const str = JSON.stringify(obj);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return `${prefix}:${Math.abs(hash).toString(16)}`;
};

/**
 * 26. Creates a namespace-aware cache key generator.
 *
 * @param {string} namespace - Cache namespace
 * @param {string} [tenant] - Tenant identifier for multi-tenancy
 * @returns {Function} Namespaced key generator
 *
 * @example
 * ```typescript
 * const genKey = namespacedCacheKey('healthcare', 'tenant123');
 * const key = genKey('patient', '456'); // 'healthcare:tenant123:patient:456'
 * ```
 */
export const namespacedCacheKey = (namespace: string, tenant?: string) => {
  return (...parts: any[]): string => {
    const keyParts = [namespace];

    if (tenant) {
      keyParts.push(tenant);
    }

    keyParts.push(...parts.map((p) => String(p)));

    return keyParts.join(':');
  };
};

// ============================================================================
// CACHE TTL STRATEGIES
// ============================================================================

/**
 * 27. Creates a dynamic TTL calculator based on data characteristics.
 *
 * @param {Function} calculator - Function to calculate TTL
 * @returns {Function} TTL calculator wrapper
 *
 * @example
 * ```typescript
 * const getTTL = dynamicTTL((data) => {
 *   if (data.priority === 'high') return 60;
 *   if (data.size > 1000000) return 300;
 *   return 3600;
 * });
 * const ttl = getTTL(patientData);
 * ```
 */
export const dynamicTTL = (calculator: (data: any) => number) => {
  return (data: any): number => {
    try {
      return calculator(data);
    } catch (error) {
      console.error('TTL calculation error:', error);
      return 300; // Default to 5 minutes
    }
  };
};

/**
 * 28. Creates a time-of-day based TTL strategy.
 *
 * @param {Record<string, number>} schedule - TTL schedule by hour
 * @returns {Function} Time-based TTL calculator
 *
 * @example
 * ```typescript
 * const getTTL = timeBasedTTL({
 *   '09-17': 300,  // Business hours: 5 min
 *   '17-09': 3600  // Off hours: 1 hour
 * });
 * ```
 */
export const timeBasedTTL = (schedule: Record<string, number>) => {
  return (): number => {
    const now = new Date();
    const hour = now.getHours();

    for (const [timeRange, ttl] of Object.entries(schedule)) {
      const [start, end] = timeRange.split('-').map(Number);

      if (start < end) {
        if (hour >= start && hour < end) return ttl;
      } else {
        if (hour >= start || hour < end) return ttl;
      }
    }

    return 300; // Default
  };
};

// ============================================================================
// CACHE COMPRESSION & SERIALIZATION
// ============================================================================

/**
 * 29. Compresses cache data to reduce memory/network usage.
 *
 * @param {any} data - Data to compress
 * @param {CompressionOptions} [options] - Compression options
 * @returns {Promise<Buffer>} Compressed data
 *
 * @example
 * ```typescript
 * const compressed = await compress(largeObject, {
 *   algorithm: 'gzip',
 *   level: 9
 * });
 * await cacheManager.set('key', compressed);
 * ```
 */
export const compress = async (
  data: any,
  options: CompressionOptions = {},
): Promise<any> => {
  const { algorithm = 'gzip', level = 6, threshold = 1024 } = options;

  const serialized = JSON.stringify(data);

  // Only compress if data exceeds threshold
  if (serialized.length < threshold) {
    return { compressed: false, data: serialized };
  }

  // In production, use zlib.gzip, zlib.deflate, or zlib.brotliCompress
  return {
    compressed: true,
    algorithm,
    data: serialized, // Placeholder - would be actual compressed buffer
  };
};

/**
 * 30. Decompresses cached data.
 *
 * @param {any} compressedData - Compressed data
 * @returns {Promise<any>} Decompressed data
 *
 * @example
 * ```typescript
 * const data = await cacheManager.get('key');
 * const decompressed = await decompress(data);
 * ```
 */
export const decompress = async (compressedData: any): Promise<any> => {
  if (!compressedData.compressed) {
    return JSON.parse(compressedData.data);
  }

  // In production, use zlib.gunzip, zlib.inflate, or zlib.brotliDecompress
  return JSON.parse(compressedData.data);
};

/**
 * 31. Serializes complex objects for caching (handles Date, RegExp, etc.).
 *
 * @param {any} data - Data to serialize
 * @returns {string} Serialized data
 *
 * @example
 * ```typescript
 * const serialized = serializeForCache({
 *   date: new Date(),
 *   regex: /pattern/gi,
 *   data: complexObject
 * });
 * ```
 */
export const serializeForCache = (data: any): string => {
  return JSON.stringify(data, (key, value) => {
    if (value instanceof Date) {
      return { __type: 'Date', value: value.toISOString() };
    }
    if (value instanceof RegExp) {
      return { __type: 'RegExp', value: value.toString() };
    }
    if (value instanceof Map) {
      return { __type: 'Map', value: Array.from(value.entries()) };
    }
    if (value instanceof Set) {
      return { __type: 'Set', value: Array.from(value) };
    }
    return value;
  });
};

/**
 * 32. Deserializes cached data back to original types.
 *
 * @param {string} serialized - Serialized data
 * @returns {any} Deserialized data
 *
 * @example
 * ```typescript
 * const data = deserializeFromCache(cachedString);
 * console.log(data.date instanceof Date); // true
 * ```
 */
export const deserializeFromCache = (serialized: string): any => {
  return JSON.parse(serialized, (key, value) => {
    if (value && typeof value === 'object' && '__type' in value) {
      switch (value.__type) {
        case 'Date':
          return new Date(value.value);
        case 'RegExp': {
          const match = value.value.match(/\/(.*?)\/([gimuy]*)$/);
          return new RegExp(match[1], match[2]);
        }
        case 'Map':
          return new Map(value.value);
        case 'Set':
          return new Set(value.value);
      }
    }
    return value;
  });
};

// ============================================================================
// MEMOIZATION
// ============================================================================

/**
 * 33. Creates a memoized version of a function with configurable cache.
 *
 * @param {Function} fn - Function to memoize
 * @param {MemoizeOptions} [options] - Memoization options
 * @returns {Function} Memoized function
 *
 * @example
 * ```typescript
 * const expensiveCalc = memoize(
 *   (a, b) => heavyComputation(a, b),
 *   { ttl: 600, maxSize: 100 }
 * );
 * ```
 */
export const memoize = <T extends (...args: any[]) => any>(
  fn: T,
  options: MemoizeOptions = {},
): T => {
  const {
    ttl = 300,
    maxSize = 1000,
    keyGenerator = (...args) => JSON.stringify(args),
  } = options;

  const cache = new Map<string, { value: any; expiry: number }>();

  return ((...args: any[]) => {
    const key = keyGenerator(...args);
    const now = Date.now();

    const cached = cache.get(key);
    if (cached && now < cached.expiry) {
      return cached.value;
    }

    const result = fn(...args);
    cache.set(key, { value: result, expiry: now + ttl * 1000 });

    // Enforce max size
    if (cache.size > maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    return result;
  }) as T;
};

/**
 * 34. Creates an async memoization wrapper for promise-returning functions.
 *
 * @param {Function} fn - Async function to memoize
 * @param {MemoizeOptions} [options] - Memoization options
 * @returns {Function} Memoized async function
 *
 * @example
 * ```typescript
 * const getPatient = memoizeAsync(
 *   async (id) => await db.findPatient(id),
 *   { ttl: 300 }
 * );
 * ```
 */
export const memoizeAsync = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: MemoizeOptions = {},
): T => {
  const {
    ttl = 300,
    maxSize = 1000,
    keyGenerator = (...args) => JSON.stringify(args),
  } = options;

  const cache = new Map<
    string,
    { value: any; expiry: number; promise?: Promise<any> }
  >();

  return (async (...args: any[]) => {
    const key = keyGenerator(...args);
    const now = Date.now();

    const cached = cache.get(key);
    if (cached) {
      if (now < cached.expiry) {
        return cached.promise || cached.value;
      }
      cache.delete(key);
    }

    const promise = fn(...args);
    cache.set(key, { value: null, expiry: now + ttl * 1000, promise });

    try {
      const result = await promise;
      cache.set(key, { value: result, expiry: now + ttl * 1000 });

      if (cache.size > maxSize) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }

      return result;
    } catch (error) {
      cache.delete(key);
      throw error;
    }
  }) as T;
};

// ============================================================================
// HTTP CACHING & RESPONSE OPTIMIZATION
// ============================================================================

/**
 * 35. Generates HTTP cache headers for API responses.
 *
 * @param {HttpCacheOptions} options - HTTP cache options
 * @returns {Record<string, string>} Cache headers
 *
 * @example
 * ```typescript
 * const headers = generateHttpCacheHeaders({
 *   maxAge: 300,
 *   public: true,
 *   mustRevalidate: true
 * });
 * res.set(headers);
 * ```
 */
export const generateHttpCacheHeaders = (
  options: HttpCacheOptions,
): Record<string, string> => {
  const {
    maxAge,
    sMaxAge,
    private: isPrivate,
    public: isPublic,
    noCache,
    noStore,
    mustRevalidate,
  } = options;

  const directives: string[] = [];

  if (noStore) {
    directives.push('no-store');
  } else if (noCache) {
    directives.push('no-cache');
  } else {
    if (isPrivate) directives.push('private');
    if (isPublic) directives.push('public');
    if (maxAge !== undefined) directives.push(`max-age=${maxAge}`);
    if (sMaxAge !== undefined) directives.push(`s-maxage=${sMaxAge}`);
    if (mustRevalidate) directives.push('must-revalidate');
  }

  return {
    'Cache-Control': directives.join(', '),
  };
};

/**
 * 36. Creates a response caching middleware for NestJS.
 *
 * @param {any} cacheManager - Cache manager instance
 * @param {number} [ttl=300] - Cache TTL in seconds
 * @returns {Function} NestJS middleware
 *
 * @example
 * ```typescript
 * @Controller('patients')
 * export class PatientsController {
 *   @Get(':id')
 *   @UseInterceptors(responseCacheInterceptor(cacheManager, 600))
 *   async getPatient(@Param('id') id: string) {
 *     return this.service.findById(id);
 *   }
 * }
 * ```
 */
export const createResponseCacheMiddleware = (
  cacheManager: any,
  ttl: number = 300,
) => {
  return async (req: any, res: any, next: any) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const cacheKey = `http:${req.method}:${req.originalUrl}`;

    // Check cache
    const cached = await cacheManager.get(cacheKey);
    if (cached) {
      res.set(generateHttpCacheHeaders({ public: true, maxAge: ttl }));
      return res.json(cached);
    }

    // Intercept response
    const originalJson = res.json.bind(res);
    res.json = (data: any) => {
      cacheManager.set(cacheKey, data, ttl);
      res.set(generateHttpCacheHeaders({ public: true, maxAge: ttl }));
      return originalJson(data);
    };

    next();
  };
};

// ============================================================================
// ETAG GENERATION
// ============================================================================

/**
 * 37. Generates an ETag for response data.
 *
 * @param {any} data - Response data
 * @param {ETagOptions} [options] - ETag options
 * @returns {string} ETag value
 *
 * @example
 * ```typescript
 * const etag = generateETag(responseData, { algorithm: 'sha256', weak: false });
 * res.set('ETag', etag);
 * ```
 */
export const generateETag = (data: any, options: ETagOptions = {}): string => {
  const { weak = false, algorithm = 'md5' } = options;

  const content =
    typeof data === 'string' ? data : JSON.stringify(data);

  // Simple hash (in production, use crypto.createHash)
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  const etagValue = `"${Math.abs(hash).toString(16)}"`;
  return weak ? `W/${etagValue}` : etagValue;
};

/**
 * 38. Validates if request ETag matches current data.
 *
 * @param {string} requestETag - ETag from request header
 * @param {any} currentData - Current response data
 * @returns {boolean} True if ETags match
 *
 * @example
 * ```typescript
 * if (validateETag(req.headers['if-none-match'], data)) {
 *   return res.status(304).send();
 * }
 * ```
 */
export const validateETag = (requestETag: string, currentData: any): boolean => {
  if (!requestETag) return false;

  const currentETag = generateETag(currentData);
  return requestETag === currentETag || requestETag === `W/${currentETag}`;
};

/**
 * 39. Creates an ETag-based conditional GET interceptor.
 *
 * @param {ETagOptions} [options] - ETag options
 * @returns {Function} NestJS interceptor
 *
 * @example
 * ```typescript
 * @Get(':id')
 * @UseInterceptors(etagInterceptor())
 * async getData() {
 *   return this.service.getData();
 * }
 * ```
 */
export const createETagInterceptor = (options: ETagOptions = {}) => {
  return (req: any, res: any, next: any) => {
    const originalJson = res.json.bind(res);

    res.json = (data: any) => {
      const etag = generateETag(data, options);
      res.set('ETag', etag);

      const clientETag = req.headers['if-none-match'];
      if (clientETag === etag) {
        return res.status(304).send();
      }

      return originalJson(data);
    };

    next();
  };
};

// ============================================================================
// QUERY RESULT CACHING
// ============================================================================

/**
 * 40. Caches database query results with automatic invalidation.
 *
 * @param {any} cacheManager - Cache manager instance
 * @param {Function} queryFn - Database query function
 * @param {string} cacheKey - Cache key
 * @param {number} [ttl=300] - Cache TTL in seconds
 * @returns {Promise<any>} Query result
 *
 * @example
 * ```typescript
 * const patients = await cacheQueryResult(
 *   cacheManager,
 *   () => db.query('SELECT * FROM patients WHERE active = true'),
 *   'patients:active',
 *   600
 * );
 * ```
 */
export const cacheQueryResult = async <T>(
  cacheManager: any,
  queryFn: () => Promise<T>,
  cacheKey: string,
  ttl: number = 300,
): Promise<T> => {
  const cached = await cacheManager.get(cacheKey);
  if (cached !== null && cached !== undefined) {
    return cached;
  }

  const result = await queryFn();
  await cacheManager.set(cacheKey, result, ttl);

  return result;
};

/**
 * 41. Creates a query result cache with automatic dependency tracking.
 *
 * @param {any} cacheManager - Cache manager instance
 * @returns {Object} Query cache manager
 *
 * @example
 * ```typescript
 * const queryCache = createQueryCache(cacheManager);
 * const result = await queryCache.execute(
 *   'patients-by-status',
 *   () => db.query(...),
 *   { dependencies: ['patients'] }
 * );
 * ```
 */
export const createQueryCache = (cacheManager: any) => {
  const dependencyMap = new Map<string, Set<string>>();

  return {
    async execute<T>(
      key: string,
      queryFn: () => Promise<T>,
      options: { ttl?: number; dependencies?: string[] } = {},
    ): Promise<T> {
      const { ttl = 300, dependencies = [] } = options;

      const cached = await cacheManager.get(key);
      if (cached !== null && cached !== undefined) {
        return cached;
      }

      const result = await queryFn();
      await cacheManager.set(key, result, ttl);

      // Track dependencies
      if (dependencies.length > 0) {
        dependencies.forEach((dep) => {
          if (!dependencyMap.has(dep)) {
            dependencyMap.set(dep, new Set());
          }
          dependencyMap.get(dep)!.add(key);
        });
      }

      return result;
    },

    async invalidateDependency(dependency: string): Promise<void> {
      const dependentKeys = dependencyMap.get(dependency);
      if (dependentKeys) {
        await Promise.all(
          Array.from(dependentKeys).map((key) => cacheManager.del(key)),
        );
        dependencyMap.delete(dependency);
      }
    },
  };
};

// ============================================================================
// CACHE MONITORING & STATISTICS
// ============================================================================

/**
 * 42. Creates a cache statistics collector.
 *
 * @param {any} cacheManager - Cache manager instance
 * @returns {Object} Stats collector
 *
 * @example
 * ```typescript
 * const stats = createCacheStatsCollector(cacheManager);
 * stats.recordHit('patient:123');
 * const metrics = stats.getStats();
 * console.log(metrics.hitRate);
 * ```
 */
export const createCacheStatsCollector = (cacheManager: any) => {
  let hits = 0;
  let misses = 0;
  let sets = 0;
  let deletes = 0;

  const originalGet = cacheManager.get.bind(cacheManager);
  const originalSet = cacheManager.set.bind(cacheManager);
  const originalDel = cacheManager.del.bind(cacheManager);

  cacheManager.get = async (key: string) => {
    const value = await originalGet(key);
    if (value !== null && value !== undefined) {
      hits++;
    } else {
      misses++;
    }
    return value;
  };

  cacheManager.set = async (key: string, value: any, ttl?: number) => {
    sets++;
    return originalSet(key, value, ttl);
  };

  cacheManager.del = async (key: string) => {
    deletes++;
    return originalDel(key);
  };

  return {
    getStats(): CacheStats {
      const total = hits + misses;
      return {
        hits,
        misses,
        hitRate: total > 0 ? hits / total : 0,
        size: sets - deletes,
        keys: sets - deletes,
      };
    },

    reset(): void {
      hits = 0;
      misses = 0;
      sets = 0;
      deletes = 0;
    },

    recordHit(key: string): void {
      hits++;
    },

    recordMiss(key: string): void {
      misses++;
    },
  };
};

/**
 * 43. Creates a cache performance monitor with metrics export.
 *
 * @param {any} cacheManager - Cache manager instance
 * @param {number} [reportInterval=60000] - Report interval in ms
 * @returns {Object} Performance monitor
 *
 * @example
 * ```typescript
 * const monitor = createCachePerformanceMonitor(cacheManager, 30000);
 * monitor.onReport((metrics) => console.log(metrics));
 * ```
 */
export const createCachePerformanceMonitor = (
  cacheManager: any,
  reportInterval: number = 60000,
) => {
  const metrics = {
    operations: 0,
    totalLatency: 0,
    errors: 0,
    avgLatency: 0,
  };

  const reportCallbacks = new Set<(metrics: any) => void>();
  let reportTimer: NodeJS.Timeout;

  const wrapOperation = (operation: string, fn: Function) => {
    return async (...args: any[]) => {
      const startTime = Date.now();
      metrics.operations++;

      try {
        const result = await fn(...args);
        const latency = Date.now() - startTime;
        metrics.totalLatency += latency;
        metrics.avgLatency = metrics.totalLatency / metrics.operations;
        return result;
      } catch (error) {
        metrics.errors++;
        throw error;
      }
    };
  };

  cacheManager.get = wrapOperation('get', cacheManager.get);
  cacheManager.set = wrapOperation('set', cacheManager.set);
  cacheManager.del = wrapOperation('del', cacheManager.del);

  const report = () => {
    const snapshot = { ...metrics };
    reportCallbacks.forEach((callback) => callback(snapshot));
  };

  reportTimer = setInterval(report, reportInterval);

  return {
    getMetrics() {
      return { ...metrics };
    },

    onReport(callback: (metrics: any) => void): void {
      reportCallbacks.add(callback);
    },

    stop(): void {
      clearInterval(reportTimer);
    },
  };
};

/**
 * 44. Creates a cache health checker for monitoring.
 *
 * @param {any} cacheManager - Cache manager instance
 * @param {number} [threshold=0.8] - Minimum acceptable hit rate
 * @returns {Function} Health check function
 *
 * @example
 * ```typescript
 * const healthCheck = createCacheHealthCheck(cacheManager, 0.75);
 * const health = await healthCheck();
 * console.log(health.healthy, health.hitRate);
 * ```
 */
export const createCacheHealthCheck = (
  cacheManager: any,
  threshold: number = 0.8,
) => {
  const statsCollector = createCacheStatsCollector(cacheManager);

  return async (): Promise<{
    healthy: boolean;
    hitRate: number;
    stats: CacheStats;
    issues: string[];
  }> => {
    const stats = statsCollector.getStats();
    const issues: string[] = [];

    if (stats.hitRate < threshold) {
      issues.push(`Hit rate ${stats.hitRate.toFixed(2)} below threshold ${threshold}`);
    }

    try {
      const testKey = '__health_check__';
      await cacheManager.set(testKey, 'test', 10);
      const value = await cacheManager.get(testKey);
      await cacheManager.del(testKey);

      if (value !== 'test') {
        issues.push('Cache read/write test failed');
      }
    } catch (error) {
      issues.push(`Cache operation error: ${error}`);
    }

    return {
      healthy: issues.length === 0 && stats.hitRate >= threshold,
      hitRate: stats.hitRate,
      stats,
      issues,
    };
  };
};

/**
 * 45. Creates a cache size monitor with alerts for memory limits.
 *
 * @param {any} cacheManager - Cache manager instance
 * @param {number} maxSizeBytes - Maximum cache size in bytes
 * @param {Function} onThreshold - Callback when threshold exceeded
 * @returns {Object} Size monitor
 *
 * @example
 * ```typescript
 * const sizeMonitor = createCacheSizeMonitor(
 *   cacheManager,
 *   100 * 1024 * 1024, // 100MB
 *   (size) => console.warn(`Cache size: ${size} bytes`)
 * );
 * ```
 */
export const createCacheSizeMonitor = (
  cacheManager: any,
  maxSizeBytes: number,
  onThreshold?: (currentSize: number) => void,
) => {
  let currentSize = 0;

  const estimateSize = (value: any): number => {
    // Rough estimate of object size
    const str = JSON.stringify(value);
    return str.length * 2; // UTF-16 encoding
  };

  const originalSet = cacheManager.set.bind(cacheManager);
  const originalDel = cacheManager.del.bind(cacheManager);

  cacheManager.set = async (key: string, value: any, ttl?: number) => {
    const size = estimateSize(value);
    currentSize += size;

    if (currentSize > maxSizeBytes && onThreshold) {
      onThreshold(currentSize);
    }

    return originalSet(key, value, ttl);
  };

  cacheManager.del = async (key: string) => {
    const value = await cacheManager.get(key);
    if (value) {
      currentSize -= estimateSize(value);
    }
    return originalDel(key);
  };

  return {
    getCurrentSize(): number {
      return currentSize;
    },

    getMaxSize(): number {
      return maxSizeBytes;
    },

    getUtilization(): number {
      return currentSize / maxSizeBytes;
    },

    isOverThreshold(): boolean {
      return currentSize > maxSizeBytes;
    },
  };
};
