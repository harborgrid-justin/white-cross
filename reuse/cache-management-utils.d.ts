/**
 * LOC: CACHE12345
 * File: /reuse/cache-management-utils.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Sequelize models and services
 *   - API controllers
 *   - Database query layers
 *   - Redis integration modules
 */
/**
 * File: /reuse/cache-management-utils.ts
 * Locator: WC-UTL-CACHE-001
 * Purpose: Comprehensive Cache Management Utilities - Redis, in-memory, multi-level caching
 *
 * Upstream: Independent utility module for cache operations
 * Downstream: ../backend/*, Sequelize services, API middleware, query optimizers
 * Dependencies: TypeScript 5.x, Node 18+, Redis client, ioredis
 * Exports: 42 utility functions for cache management, invalidation, compression, and coordination
 *
 * LLM Context: Complete cache management utilities for White Cross healthcare system.
 * Provides Redis integration, in-memory LRU caching, multi-level cache hierarchies,
 * cache-aside/write-through patterns, TTL management, distributed coordination, and
 * Sequelize query result caching. Essential for high-performance healthcare data access.
 */
interface CacheOptions {
    ttl?: number;
    namespace?: string;
    compress?: boolean;
    tags?: string[];
}
interface CacheEntry<T> {
    value: T;
    expiresAt: number;
    tags?: string[];
    hits?: number;
    createdAt: number;
}
interface CacheStats {
    hits: number;
    misses: number;
    sets: number;
    deletes: number;
    hitRate: number;
    size: number;
}
interface LRUCacheOptions {
    maxSize: number;
    ttl?: number;
    onEvict?: (key: string, value: any) => void;
}
interface CacheKeyOptions {
    prefix?: string;
    namespace?: string;
    version?: string;
    separator?: string;
}
interface MultiLevelCacheOptions {
    l1Ttl?: number;
    l2Ttl?: number;
    l1MaxSize?: number;
    skipL1?: boolean;
    skipL2?: boolean;
}
interface CacheWarmingConfig {
    batchSize: number;
    concurrency: number;
    delay?: number;
}
interface DistributedLockOptions {
    ttl: number;
    retryDelay?: number;
    maxRetries?: number;
}
/**
 * Sets a value in Redis cache with optional TTL and compression.
 *
 * @param {any} redisClient - Redis client instance
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await setRedisCache(redis, 'user:123', userData, { ttl: 3600, compress: true });
 * ```
 */
export declare const setRedisCache: (redisClient: any, key: string, value: any, options?: CacheOptions) => Promise<boolean>;
/**
 * Gets a value from Redis cache with decompression support.
 *
 * @param {any} redisClient - Redis client instance
 * @param {string} key - Cache key
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<any>} Cached value or null
 *
 * @example
 * ```typescript
 * const userData = await getRedisCache(redis, 'user:123', { compress: true });
 * ```
 */
export declare const getRedisCache: (redisClient: any, key: string, options?: CacheOptions) => Promise<any>;
/**
 * Deletes a key or pattern from Redis cache.
 *
 * @param {any} redisClient - Redis client instance
 * @param {string} pattern - Key or pattern to delete
 * @param {boolean} [isPattern=false] - Whether pattern is a wildcard pattern
 * @returns {Promise<number>} Number of keys deleted
 *
 * @example
 * ```typescript
 * await deleteRedisCache(redis, 'user:*', true); // Delete all user keys
 * ```
 */
export declare const deleteRedisCache: (redisClient: any, pattern: string, isPattern?: boolean) => Promise<number>;
/**
 * Performs atomic increment operation in Redis.
 *
 * @param {any} redisClient - Redis client instance
 * @param {string} key - Counter key
 * @param {number} [increment=1] - Increment value
 * @param {number} [ttl] - Optional TTL for key
 * @returns {Promise<number>} New counter value
 *
 * @example
 * ```typescript
 * const count = await incrementRedisCounter(redis, 'api:hits:endpoint', 1, 3600);
 * ```
 */
export declare const incrementRedisCounter: (redisClient: any, key: string, increment?: number, ttl?: number) => Promise<number>;
/**
 * Sets multiple key-value pairs in Redis atomically.
 *
 * @param {any} redisClient - Redis client instance
 * @param {Record<string, any>} entries - Key-value pairs to set
 * @param {number} [ttl] - Optional TTL for all keys
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await setRedisMultiple(redis, { 'key1': 'val1', 'key2': 'val2' }, 3600);
 * ```
 */
export declare const setRedisMultiple: (redisClient: any, entries: Record<string, any>, ttl?: number) => Promise<boolean>;
/**
 * Gets multiple values from Redis in a single operation.
 *
 * @param {any} redisClient - Redis client instance
 * @param {string[]} keys - Array of keys to retrieve
 * @returns {Promise<Record<string, any>>} Key-value map of results
 *
 * @example
 * ```typescript
 * const results = await getRedisMultiple(redis, ['user:1', 'user:2', 'user:3']);
 * ```
 */
export declare const getRedisMultiple: (redisClient: any, keys: string[]) => Promise<Record<string, any>>;
/**
 * Creates an in-memory cache instance with TTL support.
 *
 * @returns {Map<string, CacheEntry<any>>} Cache map instance
 *
 * @example
 * ```typescript
 * const cache = createMemoryCache();
 * ```
 */
export declare const createMemoryCache: () => Map<string, CacheEntry<any>>;
/**
 * Sets a value in memory cache with TTL and metadata.
 *
 * @param {Map<string, CacheEntry<T>>} cache - Cache map instance
 * @param {string} key - Cache key
 * @param {T} value - Value to cache
 * @param {CacheOptions} [options] - Cache options
 * @returns {boolean} Success status
 *
 * @example
 * ```typescript
 * setMemoryCache(cache, 'user:123', userData, { ttl: 300, tags: ['user'] });
 * ```
 */
export declare const setMemoryCache: <T>(cache: Map<string, CacheEntry<T>>, key: string, value: T, options?: CacheOptions) => boolean;
/**
 * Gets a value from memory cache, checking TTL.
 *
 * @param {Map<string, CacheEntry<T>>} cache - Cache map instance
 * @param {string} key - Cache key
 * @returns {T | null} Cached value or null if expired
 *
 * @example
 * ```typescript
 * const userData = getMemoryCache(cache, 'user:123');
 * ```
 */
export declare const getMemoryCache: <T>(cache: Map<string, CacheEntry<T>>, key: string) => T | null;
/**
 * Deletes a key from memory cache.
 *
 * @param {Map<string, CacheEntry<any>>} cache - Cache map instance
 * @param {string} key - Cache key
 * @returns {boolean} Whether key was deleted
 *
 * @example
 * ```typescript
 * deleteMemoryCache(cache, 'user:123');
 * ```
 */
export declare const deleteMemoryCache: (cache: Map<string, CacheEntry<any>>, key: string) => boolean;
/**
 * Clears all expired entries from memory cache.
 *
 * @param {Map<string, CacheEntry<any>>} cache - Cache map instance
 * @returns {number} Number of entries cleared
 *
 * @example
 * ```typescript
 * const cleared = clearExpiredMemoryCache(cache);
 * console.log(`Cleared ${cleared} expired entries`);
 * ```
 */
export declare const clearExpiredMemoryCache: (cache: Map<string, CacheEntry<any>>) => number;
/**
 * Creates an LRU (Least Recently Used) cache with size limits.
 *
 * @param {LRUCacheOptions} options - LRU cache configuration
 * @returns {Map<string, CacheEntry<any>>} LRU cache instance
 *
 * @example
 * ```typescript
 * const lruCache = createLRUCache({ maxSize: 1000, ttl: 300 });
 * ```
 */
export declare const createLRUCache: (options: LRUCacheOptions) => Map<string, CacheEntry<any>>;
/**
 * Sets a value in LRU cache with automatic eviction.
 *
 * @param {Map<string, CacheEntry<T>>} cache - LRU cache instance
 * @param {string} key - Cache key
 * @param {T} value - Value to cache
 * @param {number} [ttl] - Optional TTL in seconds
 * @returns {boolean} Success status
 *
 * @example
 * ```typescript
 * setLRUCache(lruCache, 'product:456', productData, 600);
 * ```
 */
export declare const setLRUCache: <T>(cache: Map<string, CacheEntry<T>>, key: string, value: T, ttl?: number) => boolean;
/**
 * Gets a value from LRU cache and updates access order.
 *
 * @param {Map<string, CacheEntry<T>>} cache - LRU cache instance
 * @param {string} key - Cache key
 * @returns {T | null} Cached value or null
 *
 * @example
 * ```typescript
 * const productData = getLRUCache(lruCache, 'product:456');
 * ```
 */
export declare const getLRUCache: <T>(cache: Map<string, CacheEntry<T>>, key: string) => T | null;
/**
 * Generates a standardized cache key from components.
 *
 * @param {string[]} parts - Key components
 * @param {CacheKeyOptions} [options] - Key generation options
 * @returns {string} Generated cache key
 *
 * @example
 * ```typescript
 * const key = generateCacheKey(['user', '123', 'profile'], { prefix: 'app', version: 'v1' });
 * // Returns: 'app:v1:user:123:profile'
 * ```
 */
export declare const generateCacheKey: (parts: string[], options?: CacheKeyOptions) => string;
/**
 * Generates a cache key from object properties for query caching.
 *
 * @param {string} base - Base key component
 * @param {Record<string, any>} params - Parameters to include in key
 * @returns {string} Generated cache key
 *
 * @example
 * ```typescript
 * const key = generateQueryCacheKey('students', { grade: 10, status: 'active' });
 * // Returns: 'students:grade=10:status=active'
 * ```
 */
export declare const generateQueryCacheKey: (base: string, params: Record<string, any>) => string;
/**
 * Generates a namespaced cache key with automatic prefixing.
 *
 * @param {string} namespace - Namespace for the key
 * @param {string} identifier - Unique identifier
 * @param {string} [suffix] - Optional suffix
 * @returns {string} Namespaced cache key
 *
 * @example
 * ```typescript
 * const key = namespaceCacheKey('medical-records', '123', 'history');
 * // Returns: 'medical-records:123:history'
 * ```
 */
export declare const namespaceCacheKey: (namespace: string, identifier: string, suffix?: string) => string;
/**
 * Hashes a complex object into a short cache key component.
 *
 * @param {any} obj - Object to hash
 * @returns {string} Hashed key component
 *
 * @example
 * ```typescript
 * const hash = hashCacheKey({ where: { age: { gt: 18 } }, order: [['name', 'ASC']] });
 * // Returns: 'a3f2c9d8'
 * ```
 */
export declare const hashCacheKey: (obj: any) => string;
/**
 * Implements cache-aside pattern: check cache, query on miss, cache result.
 *
 * @param {string} key - Cache key
 * @param {() => Promise<T>} loader - Function to load data on cache miss
 * @param {any} cache - Cache instance (Redis or Map)
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<T>} Data from cache or loader
 *
 * @example
 * ```typescript
 * const user = await cacheAside(
 *   'user:123',
 *   () => User.findByPk(123),
 *   redisClient,
 *   { ttl: 300 }
 * );
 * ```
 */
export declare const cacheAside: <T>(key: string, loader: () => Promise<T>, cache: any, options?: CacheOptions) => Promise<T>;
/**
 * Implements cache-aside with fallback to stale data on error.
 *
 * @param {string} key - Cache key
 * @param {() => Promise<T>} loader - Function to load data
 * @param {any} cache - Cache instance
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<T | null>} Data or null
 *
 * @example
 * ```typescript
 * const user = await cacheAsideWithFallback('user:123', () => User.findByPk(123), redis);
 * ```
 */
export declare const cacheAsideWithFallback: <T>(key: string, loader: () => Promise<T>, cache: any, options?: CacheOptions) => Promise<T | null>;
/**
 * Implements write-through caching: write to cache and database simultaneously.
 *
 * @param {string} key - Cache key
 * @param {T} value - Value to write
 * @param {() => Promise<void>} persister - Function to persist to database
 * @param {any} cache - Cache instance
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await writeThrough('user:123', userData, () => user.save(), redis, { ttl: 300 });
 * ```
 */
export declare const writeThrough: <T>(key: string, value: T, persister: () => Promise<void>, cache: any, options?: CacheOptions) => Promise<boolean>;
/**
 * Implements write-back caching: write to cache immediately, persist later.
 *
 * @param {string} key - Cache key
 * @param {T} value - Value to write
 * @param {() => Promise<void>} persister - Function to persist to database
 * @param {any} cache - Cache instance
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await writeBack('counter:hits', hitCount, () => Counter.update(hitCount), redis);
 * ```
 */
export declare const writeBack: <T>(key: string, value: T, persister: () => Promise<void>, cache: any, options?: CacheOptions) => Promise<boolean>;
/**
 * Invalidates cache entries by tag.
 *
 * @param {Map<string, CacheEntry<any>>} cache - Cache map instance
 * @param {string} tag - Tag to invalidate
 * @returns {number} Number of entries invalidated
 *
 * @example
 * ```typescript
 * const count = invalidateByTag(cache, 'user');
 * console.log(`Invalidated ${count} user-related cache entries`);
 * ```
 */
export declare const invalidateByTag: (cache: Map<string, CacheEntry<any>>, tag: string) => number;
/**
 * Invalidates cache entries matching a key pattern.
 *
 * @param {any} cache - Cache instance
 * @param {string} pattern - Key pattern to match
 * @returns {Promise<number>} Number of entries invalidated
 *
 * @example
 * ```typescript
 * await invalidateByPattern(redis, 'user:*:profile');
 * ```
 */
export declare const invalidateByPattern: (cache: any, pattern: string) => Promise<number>;
/**
 * Invalidates cache entries older than specified age.
 *
 * @param {Map<string, CacheEntry<any>>} cache - Cache map instance
 * @param {number} maxAge - Maximum age in seconds
 * @returns {number} Number of entries invalidated
 *
 * @example
 * ```typescript
 * const count = invalidateByAge(cache, 3600); // Invalidate entries older than 1 hour
 * ```
 */
export declare const invalidateByAge: (cache: Map<string, CacheEntry<any>>, maxAge: number) => number;
/**
 * Updates TTL for an existing cache entry.
 *
 * @param {any} cache - Cache instance
 * @param {string} key - Cache key
 * @param {number} ttl - New TTL in seconds
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await updateCacheTTL(redis, 'session:abc123', 1800);
 * ```
 */
export declare const updateCacheTTL: (cache: any, key: string, ttl: number) => Promise<boolean>;
/**
 * Gets remaining TTL for a cache entry.
 *
 * @param {any} cache - Cache instance
 * @param {string} key - Cache key
 * @returns {Promise<number>} Remaining TTL in seconds, -1 if no expiry, -2 if not found
 *
 * @example
 * ```typescript
 * const ttl = await getCacheTTL(redis, 'session:abc123');
 * ```
 */
export declare const getCacheTTL: (cache: any, key: string) => Promise<number>;
/**
 * Refreshes TTL for a cache entry (extends expiration).
 *
 * @param {any} cache - Cache instance
 * @param {string} key - Cache key
 * @param {number} ttl - New TTL in seconds
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await refreshCacheTTL(redis, 'active-session:xyz', 3600);
 * ```
 */
export declare const refreshCacheTTL: (cache: any, key: string, ttl: number) => Promise<boolean>;
/**
 * Warms up cache by preloading data in batches.
 *
 * @param {string[]} keys - Keys to warm
 * @param {(key: string) => Promise<any>} loader - Function to load each key
 * @param {any} cache - Cache instance
 * @param {CacheWarmingConfig} config - Warming configuration
 * @returns {Promise<number>} Number of keys warmed
 *
 * @example
 * ```typescript
 * await warmCache(
 *   ['user:1', 'user:2', 'user:3'],
 *   (key) => User.findByPk(key.split(':')[1]),
 *   redis,
 *   { batchSize: 10, concurrency: 3 }
 * );
 * ```
 */
export declare const warmCache: (keys: string[], loader: (key: string) => Promise<any>, cache: any, config: CacheWarmingConfig) => Promise<number>;
/**
 * Warms cache for frequently accessed items based on access patterns.
 *
 * @param {Map<string, CacheEntry<any>>} cache - Cache map instance
 * @param {number} topN - Number of top items to warm
 * @param {(key: string) => Promise<any>} loader - Function to reload data
 * @returns {Promise<number>} Number of items warmed
 *
 * @example
 * ```typescript
 * await warmFrequentlyAccessed(cache, 100, (key) => loadFromDB(key));
 * ```
 */
export declare const warmFrequentlyAccessed: (cache: Map<string, CacheEntry<any>>, topN: number, loader: (key: string) => Promise<any>) => Promise<number>;
/**
 * Gets data from multi-level cache (L1 memory, L2 Redis).
 *
 * @param {string} key - Cache key
 * @param {Map<string, CacheEntry<any>>} l1Cache - L1 memory cache
 * @param {any} l2Cache - L2 Redis cache
 * @param {MultiLevelCacheOptions} [options] - Cache options
 * @returns {Promise<any>} Cached value or null
 *
 * @example
 * ```typescript
 * const data = await getMultiLevelCache('user:123', memCache, redis);
 * ```
 */
export declare const getMultiLevelCache: (key: string, l1Cache: Map<string, CacheEntry<any>>, l2Cache: any, options?: MultiLevelCacheOptions) => Promise<any>;
/**
 * Sets data in multi-level cache with different TTLs.
 *
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 * @param {Map<string, CacheEntry<any>>} l1Cache - L1 memory cache
 * @param {any} l2Cache - L2 Redis cache
 * @param {MultiLevelCacheOptions} [options] - Cache options
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await setMultiLevelCache('user:123', userData, memCache, redis, {
 *   l1Ttl: 60,
 *   l2Ttl: 300
 * });
 * ```
 */
export declare const setMultiLevelCache: (key: string, value: any, l1Cache: Map<string, CacheEntry<any>>, l2Cache: any, options?: MultiLevelCacheOptions) => Promise<boolean>;
/**
 * Invalidates data from all cache levels.
 *
 * @param {string} key - Cache key or pattern
 * @param {Map<string, CacheEntry<any>>} l1Cache - L1 memory cache
 * @param {any} l2Cache - L2 Redis cache
 * @param {boolean} [isPattern=false] - Whether key is a pattern
 * @returns {Promise<number>} Total number of entries invalidated
 *
 * @example
 * ```typescript
 * await invalidateMultiLevelCache('user:*', memCache, redis, true);
 * ```
 */
export declare const invalidateMultiLevelCache: (key: string, l1Cache: Map<string, CacheEntry<any>>, l2Cache: any, isPattern?: boolean) => Promise<number>;
/**
 * Acquires a distributed lock using Redis.
 *
 * @param {any} redisClient - Redis client instance
 * @param {string} lockKey - Lock identifier
 * @param {string} lockValue - Unique lock value
 * @param {DistributedLockOptions} options - Lock options
 * @returns {Promise<boolean>} Whether lock was acquired
 *
 * @example
 * ```typescript
 * const acquired = await acquireDistributedLock(
 *   redis,
 *   'lock:cache-rebuild',
 *   'worker-123',
 *   { ttl: 30, maxRetries: 3 }
 * );
 * ```
 */
export declare const acquireDistributedLock: (redisClient: any, lockKey: string, lockValue: string, options: DistributedLockOptions) => Promise<boolean>;
/**
 * Releases a distributed lock using Redis.
 *
 * @param {any} redisClient - Redis client instance
 * @param {string} lockKey - Lock identifier
 * @param {string} lockValue - Unique lock value
 * @returns {Promise<boolean>} Whether lock was released
 *
 * @example
 * ```typescript
 * await releaseDistributedLock(redis, 'lock:cache-rebuild', 'worker-123');
 * ```
 */
export declare const releaseDistributedLock: (redisClient: any, lockKey: string, lockValue: string) => Promise<boolean>;
/**
 * Collects comprehensive cache statistics.
 *
 * @param {Map<string, CacheEntry<any>>} cache - Cache map instance
 * @returns {CacheStats} Cache statistics
 *
 * @example
 * ```typescript
 * const stats = getCacheStats(cache);
 * console.log(`Hit rate: ${stats.hitRate}%`);
 * ```
 */
export declare const getCacheStats: (cache: Map<string, CacheEntry<any>>) => CacheStats;
/**
 * Tracks cache hit/miss and updates statistics.
 *
 * @param {CacheStats} stats - Statistics object
 * @param {boolean} isHit - Whether operation was a hit
 * @returns {void}
 *
 * @example
 * ```typescript
 * trackCacheAccess(stats, true); // Record a hit
 * trackCacheAccess(stats, false); // Record a miss
 * ```
 */
export declare const trackCacheAccess: (stats: CacheStats, isHit: boolean) => void;
/**
 * Caches Sequelize query results with automatic key generation.
 *
 * @param {any} model - Sequelize model
 * @param {any} queryOptions - Sequelize query options
 * @param {any} cache - Cache instance
 * @param {CacheOptions} [cacheOptions] - Cache options
 * @returns {Promise<any>} Query results
 *
 * @example
 * ```typescript
 * const users = await cacheSequelizeQuery(
 *   User,
 *   { where: { status: 'active' }, limit: 10 },
 *   redis,
 *   { ttl: 300, namespace: 'users' }
 * );
 * ```
 */
export declare const cacheSequelizeQuery: (model: any, queryOptions: any, cache: any, cacheOptions?: CacheOptions) => Promise<any>;
/**
 * Invalidates Sequelize model cache on data changes.
 *
 * @param {any} model - Sequelize model
 * @param {any} cache - Cache instance
 * @param {string} [namespace] - Optional namespace
 * @returns {Promise<number>} Number of entries invalidated
 *
 * @example
 * ```typescript
 * await invalidateSequelizeCache(User, redis, 'users');
 * ```
 */
export declare const invalidateSequelizeCache: (model: any, cache: any, namespace?: string) => Promise<number>;
/**
 * Sets up automatic cache invalidation hooks for Sequelize model.
 *
 * @param {any} model - Sequelize model
 * @param {any} cache - Cache instance
 * @param {string} [namespace] - Optional namespace
 * @returns {void}
 *
 * @example
 * ```typescript
 * setupSequelizeCacheHooks(User, redis, 'users');
 * ```
 */
export declare const setupSequelizeCacheHooks: (model: any, cache: any, namespace?: string) => void;
/**
 * Exports cache data to JSON for backup or migration.
 *
 * @param {Map<string, CacheEntry<any>>} cache - Cache map instance
 * @returns {string} JSON representation of cache
 *
 * @example
 * ```typescript
 * const backup = exportCacheToJSON(cache);
 * await fs.writeFile('cache-backup.json', backup);
 * ```
 */
export declare const exportCacheToJSON: (cache: Map<string, CacheEntry<any>>) => string;
/**
 * Imports cache data from JSON backup.
 *
 * @param {Map<string, CacheEntry<any>>} cache - Cache map instance
 * @param {string} jsonData - JSON representation of cache
 * @returns {number} Number of entries imported
 *
 * @example
 * ```typescript
 * const backup = await fs.readFile('cache-backup.json', 'utf-8');
 * const count = importCacheFromJSON(cache, backup);
 * console.log(`Imported ${count} cache entries`);
 * ```
 */
export declare const importCacheFromJSON: (cache: Map<string, CacheEntry<any>>, jsonData: string) => number;
export {};
//# sourceMappingURL=cache-management-utils.d.ts.map