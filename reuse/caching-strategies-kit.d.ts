/**
 * @fileoverview Caching Strategies Kit - Comprehensive caching utilities for NestJS
 * @module reuse/caching-strategies-kit
 * @description Complete caching solution with Redis, in-memory LRU, multi-level caching,
 * cache patterns (cache-aside, write-through, write-behind), invalidation strategies,
 * TTL management, cache warming, stampede prevention, and performance monitoring.
 *
 * Key Features:
 * - Redis caching with connection pooling and clustering
 * - In-memory LRU cache with automatic eviction
 * - Cache-aside (lazy loading) pattern implementation
 * - Write-through and write-behind caching strategies
 * - Advanced cache invalidation (TTL, tags, patterns)
 * - Cache key generation and normalization
 * - Cache warming and preloading strategies
 * - Multi-level caching (L1/L2/L3 hierarchy)
 * - Cache stampede prevention with locking
 * - Distributed caching coordination
 * - Automatic serialization/deserialization
 * - Decorator-based caching for methods
 * - Comprehensive cache statistics and monitoring
 * - HIPAA-compliant caching with encryption
 * - Cache versioning and migration support
 *
 * @target NestJS v10.x, Redis v7.x, Node 18+, TypeScript 5.x
 *
 * @security
 * - Encrypted cache storage for PHI/PII data
 * - Secure key generation and namespace isolation
 * - Access control for distributed cache operations
 * - Audit logging for cache access patterns
 * - Automatic expiration of sensitive data
 * - Cache poisoning prevention
 * - DoS protection via rate limiting
 *
 * @example Basic Redis caching
 * ```typescript
 * import { redisCacheSet, redisCacheGet, redisCacheDel } from './caching-strategies-kit';
 * import Redis from 'ioredis';
 *
 * const redis = new Redis();
 *
 * // Set cache value
 * await redisCacheSet(redis, 'user:123', { name: 'John' }, { ttl: 3600 });
 *
 * // Get cache value
 * const user = await redisCacheGet(redis, 'user:123');
 *
 * // Delete cache value
 * await redisCacheDel(redis, 'user:123');
 * ```
 *
 * @example In-memory LRU caching
 * ```typescript
 * import { createLRUCache, lruSet, lruGet } from './caching-strategies-kit';
 *
 * const cache = createLRUCache({ maxSize: 1000, ttl: 3600 });
 *
 * // Set and get values
 * lruSet(cache, 'key', 'value', 300);
 * const value = lruGet(cache, 'key');
 * ```
 *
 * @example Cache-aside pattern
 * ```typescript
 * import { cacheAsideGet, cacheAsideSet } from './caching-strategies-kit';
 *
 * const value = await cacheAsideGet(redis, 'product:456', async () => {
 *   // Fetch from database if cache miss
 *   return await productRepository.findById('456');
 * }, { ttl: 1800 });
 * ```
 *
 * @example Multi-level caching
 * ```typescript
 * import { multiLevelGet, multiLevelSet, createCacheHierarchy } from './caching-strategies-kit';
 *
 * const hierarchy = createCacheHierarchy({
 *   l1: lruCache,
 *   l2: redis,
 *   l3: database
 * });
 *
 * const data = await multiLevelGet(hierarchy, 'key');
 * ```
 *
 * LOC: CACHE-STRAT-001
 * UPSTREAM: ioredis, @nestjs/cache-manager, cache-manager
 * DOWNSTREAM: service layer, repository pattern, API endpoints
 *
 * @version 1.0.0
 * @since 2025-11-08
 */
/**
 * @enum CacheStrategy
 * @description Supported caching strategies
 */
export declare enum CacheStrategy {
    CACHE_ASIDE = "CACHE_ASIDE",
    WRITE_THROUGH = "WRITE_THROUGH",
    WRITE_BEHIND = "WRITE_BEHIND",
    REFRESH_AHEAD = "REFRESH_AHEAD",
    READ_THROUGH = "READ_THROUGH"
}
/**
 * @enum CacheLevel
 * @description Cache hierarchy levels
 */
export declare enum CacheLevel {
    L1_MEMORY = "L1_MEMORY",
    L2_REDIS = "L2_REDIS",
    L3_DATABASE = "L3_DATABASE"
}
/**
 * @enum InvalidationStrategy
 * @description Cache invalidation strategies
 */
export declare enum InvalidationStrategy {
    TTL = "TTL",
    TAG_BASED = "TAG_BASED",
    PATTERN = "PATTERN",
    EVENT_DRIVEN = "EVENT_DRIVEN",
    MANUAL = "MANUAL"
}
/**
 * @interface CacheOptions
 * @description Common cache operation options
 */
export interface CacheOptions {
    ttl?: number;
    tags?: string[];
    namespace?: string;
    compress?: boolean;
    encrypt?: boolean;
    version?: string;
}
/**
 * @interface RedisClient
 * @description Redis client interface
 */
export interface RedisClient {
    get(key: string): Promise<string | null>;
    set(key: string, value: string, mode?: string, duration?: number): Promise<'OK' | null>;
    setex(key: string, seconds: number, value: string): Promise<'OK'>;
    del(...keys: string[]): Promise<number>;
    exists(...keys: string[]): Promise<number>;
    expire(key: string, seconds: number): Promise<number>;
    ttl(key: string): Promise<number>;
    keys(pattern: string): Promise<string[]>;
    mget(...keys: string[]): Promise<(string | null)[]>;
    mset(...args: any[]): Promise<'OK'>;
    incr(key: string): Promise<number>;
    decr(key: string): Promise<number>;
    sadd(key: string, ...members: string[]): Promise<number>;
    smembers(key: string): Promise<string[]>;
    srem(key: string, ...members: string[]): Promise<number>;
    zadd(key: string, ...args: any[]): Promise<number>;
    zrange(key: string, start: number, stop: number): Promise<string[]>;
    zrem(key: string, ...members: string[]): Promise<number>;
    pipeline(): any;
    multi(): any;
}
/**
 * @interface LRUCache
 * @description In-memory LRU cache structure
 */
export interface LRUCache<T = any> {
    cache: Map<string, LRUCacheEntry<T>>;
    order: string[];
    maxSize: number;
    defaultTTL?: number;
    stats: CacheStats;
}
/**
 * @interface LRUCacheEntry
 * @description LRU cache entry with metadata
 */
export interface LRUCacheEntry<T = any> {
    value: T;
    expiresAt?: number;
    createdAt: number;
    accessCount: number;
    size?: number;
}
/**
 * @interface CacheHierarchy
 * @description Multi-level cache configuration
 */
export interface CacheHierarchy {
    l1?: LRUCache;
    l2?: RedisClient;
    l3?: DatabaseCache;
    options?: {
        promoteOnHit?: boolean;
        replicateDownward?: boolean;
    };
}
/**
 * @interface DatabaseCache
 * @description Database-backed cache interface
 */
export interface DatabaseCache {
    get(key: string): Promise<any>;
    set(key: string, value: any, ttl?: number): Promise<void>;
    del(key: string): Promise<void>;
    clear(): Promise<void>;
}
/**
 * @interface CacheStats
 * @description Cache statistics and metrics
 */
export interface CacheStats {
    hits: number;
    misses: number;
    sets: number;
    deletes: number;
    evictions: number;
    errors: number;
    totalSize?: number;
    avgAccessTime?: number;
}
/**
 * @interface CacheKey
 * @description Structured cache key
 */
export interface CacheKey {
    namespace: string;
    resource: string;
    identifier: string;
    version?: string;
    tags?: string[];
}
/**
 * @interface WriteBehindQueue
 * @description Queue for write-behind operations
 */
export interface WriteBehindQueue {
    entries: Map<string, WriteBehindEntry>;
    flushInterval: number;
    batchSize: number;
}
/**
 * @interface WriteBehindEntry
 * @description Entry in write-behind queue
 */
export interface WriteBehindEntry {
    key: string;
    value: any;
    timestamp: number;
    retries: number;
}
/**
 * @interface CacheLock
 * @description Distributed cache lock for stampede prevention
 */
export interface CacheLock {
    key: string;
    lockId: string;
    expiresAt: number;
}
/**
 * Sets a value in Redis cache with optional TTL and compression
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await redisCacheSet(redis, 'user:123', userData, { ttl: 3600, encrypt: true });
 * ```
 */
export declare const redisCacheSet: (redis: RedisClient, key: string, value: any, options?: CacheOptions) => Promise<boolean>;
/**
 * Gets a value from Redis cache with automatic deserialization
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {string} key - Cache key
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<T | null>} Cached value or null
 *
 * @example
 * ```typescript
 * const user = await redisCacheGet<User>(redis, 'user:123', { encrypt: true });
 * ```
 */
export declare const redisCacheGet: <T = any>(redis: RedisClient, key: string, options?: CacheOptions) => Promise<T | null>;
/**
 * Deletes one or more keys from Redis cache
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {...string} keys - Cache keys to delete
 * @returns {Promise<number>} Number of keys deleted
 *
 * @example
 * ```typescript
 * const deleted = await redisCacheDel(redis, 'user:123', 'user:456');
 * ```
 */
export declare const redisCacheDel: (redis: RedisClient, ...keys: string[]) => Promise<number>;
/**
 * Checks if a key exists in Redis cache
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {string} key - Cache key
 * @returns {Promise<boolean>} True if key exists
 *
 * @example
 * ```typescript
 * const exists = await redisCacheExists(redis, 'user:123');
 * ```
 */
export declare const redisCacheExists: (redis: RedisClient, key: string) => Promise<boolean>;
/**
 * Gets multiple values from Redis cache in a single operation
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {string[]} keys - Array of cache keys
 * @returns {Promise<Map<string, any>>} Map of key-value pairs
 *
 * @example
 * ```typescript
 * const users = await redisCacheMGet(redis, ['user:123', 'user:456']);
 * ```
 */
export declare const redisCacheMGet: (redis: RedisClient, keys: string[]) => Promise<Map<string, any>>;
/**
 * Sets multiple key-value pairs in Redis cache atomically
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {Map<string, any>} entries - Map of key-value pairs
 * @param {number} [ttl] - Optional TTL for all entries
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * const entries = new Map([['user:123', userData1], ['user:456', userData2]]);
 * await redisCacheMSet(redis, entries, 3600);
 * ```
 */
export declare const redisCacheMSet: (redis: RedisClient, entries: Map<string, any>, ttl?: number) => Promise<boolean>;
/**
 * Creates a new LRU cache instance with specified configuration
 *
 * @param {object} config - LRU cache configuration
 * @param {number} config.maxSize - Maximum number of entries
 * @param {number} [config.ttl] - Default TTL in seconds
 * @returns {LRUCache} LRU cache instance
 *
 * @example
 * ```typescript
 * const cache = createLRUCache({ maxSize: 1000, ttl: 3600 });
 * ```
 */
export declare const createLRUCache: <T = any>(config: {
    maxSize: number;
    ttl?: number;
}) => LRUCache<T>;
/**
 * Sets a value in LRU cache with automatic eviction
 *
 * @param {LRUCache} cache - LRU cache instance
 * @param {string} key - Cache key
 * @param {T} value - Value to cache
 * @param {number} [ttl] - Optional TTL in seconds
 * @returns {void}
 *
 * @example
 * ```typescript
 * lruSet(cache, 'user:123', userData, 300);
 * ```
 */
export declare const lruSet: <T = any>(cache: LRUCache<T>, key: string, value: T, ttl?: number) => void;
/**
 * Gets a value from LRU cache with automatic expiration check
 *
 * @param {LRUCache} cache - LRU cache instance
 * @param {string} key - Cache key
 * @returns {T | null} Cached value or null
 *
 * @example
 * ```typescript
 * const user = lruGet<User>(cache, 'user:123');
 * ```
 */
export declare const lruGet: <T = any>(cache: LRUCache<T>, key: string) => T | null;
/**
 * Deletes a value from LRU cache
 *
 * @param {LRUCache} cache - LRU cache instance
 * @param {string} key - Cache key
 * @returns {boolean} True if key was deleted
 *
 * @example
 * ```typescript
 * lruDel(cache, 'user:123');
 * ```
 */
export declare const lruDel: <T = any>(cache: LRUCache<T>, key: string) => boolean;
/**
 * Clears all entries from LRU cache
 *
 * @param {LRUCache} cache - LRU cache instance
 * @returns {void}
 *
 * @example
 * ```typescript
 * lruClear(cache);
 * ```
 */
export declare const lruClear: <T = any>(cache: LRUCache<T>) => void;
/**
 * Gets LRU cache statistics
 *
 * @param {LRUCache} cache - LRU cache instance
 * @returns {CacheStats & {hitRate: number, size: number}} Cache statistics
 *
 * @example
 * ```typescript
 * const stats = lruStats(cache);
 * console.log(`Hit rate: ${stats.hitRate}%`);
 * ```
 */
export declare const lruStats: <T = any>(cache: LRUCache<T>) => CacheStats & {
    hitRate: number;
    size: number;
};
/**
 * Implements cache-aside pattern with automatic fallback to data source
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {string} key - Cache key
 * @param {() => Promise<T>} fetchFn - Function to fetch data on cache miss
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<T | null>} Cached or fetched value
 *
 * @example
 * ```typescript
 * const user = await cacheAsideGet(redis, 'user:123', async () => {
 *   return await userRepository.findById('123');
 * }, { ttl: 3600 });
 * ```
 */
export declare const cacheAsideGet: <T = any>(redis: RedisClient, key: string, fetchFn: () => Promise<T>, options?: CacheOptions) => Promise<T | null>;
/**
 * Implements cache-aside pattern for multi-level cache
 *
 * @param {CacheHierarchy} hierarchy - Cache hierarchy
 * @param {string} key - Cache key
 * @param {() => Promise<T>} fetchFn - Function to fetch data on cache miss
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<T | null>} Cached or fetched value
 *
 * @example
 * ```typescript
 * const data = await cacheAsideMultiLevel(hierarchy, 'product:456',
 *   async () => await productRepo.find('456'),
 *   { ttl: 1800 }
 * );
 * ```
 */
export declare const cacheAsideMultiLevel: <T = any>(hierarchy: CacheHierarchy, key: string, fetchFn: () => Promise<T>, options?: CacheOptions) => Promise<T | null>;
/**
 * Invalidates cache entry in cache-aside pattern
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {string} key - Cache key
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await cacheAsideInvalidate(redis, 'user:123');
 * ```
 */
export declare const cacheAsideInvalidate: (redis: RedisClient, key: string) => Promise<boolean>;
/**
 * Implements write-through caching pattern
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {string} key - Cache key
 * @param {T} value - Value to write
 * @param {(key: string, value: T) => Promise<void>} writeFn - Function to write to persistent storage
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await writeThroughSet(redis, 'user:123', userData, async (key, value) => {
 *   await userRepository.save(value);
 * }, { ttl: 3600 });
 * ```
 */
export declare const writeThroughSet: <T = any>(redis: RedisClient, key: string, value: T, writeFn: (key: string, value: T) => Promise<void>, options?: CacheOptions) => Promise<boolean>;
/**
 * Implements write-through caching for updates
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {string} key - Cache key
 * @param {Partial<T>} updates - Partial updates to apply
 * @param {(key: string, updates: Partial<T>) => Promise<T>} updateFn - Function to update persistent storage
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<T | null>} Updated value
 *
 * @example
 * ```typescript
 * const updated = await writeThroughUpdate(redis, 'user:123', { name: 'Jane' },
 *   async (key, updates) => await userRepository.update(key, updates),
 *   { ttl: 3600 }
 * );
 * ```
 */
export declare const writeThroughUpdate: <T = any>(redis: RedisClient, key: string, updates: Partial<T>, updateFn: (key: string, updates: Partial<T>) => Promise<T>, options?: CacheOptions) => Promise<T | null>;
/**
 * Implements write-through deletion
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {string} key - Cache key
 * @param {(key: string) => Promise<void>} deleteFn - Function to delete from persistent storage
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await writeThroughDelete(redis, 'user:123', async (key) => {
 *   await userRepository.delete(key);
 * });
 * ```
 */
export declare const writeThroughDelete: (redis: RedisClient, key: string, deleteFn: (key: string) => Promise<void>) => Promise<boolean>;
/**
 * Creates a write-behind queue
 *
 * @param {number} flushInterval - Flush interval in milliseconds
 * @param {number} batchSize - Maximum batch size for flush operations
 * @returns {WriteBehindQueue} Write-behind queue instance
 *
 * @example
 * ```typescript
 * const queue = createWriteBehindQueue(5000, 100);
 * ```
 */
export declare const createWriteBehindQueue: (flushInterval?: number, batchSize?: number) => WriteBehindQueue;
/**
 * Adds entry to write-behind queue and updates cache immediately
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {WriteBehindQueue} queue - Write-behind queue
 * @param {string} key - Cache key
 * @param {T} value - Value to write
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await writeBehindSet(redis, queue, 'user:123', userData, { ttl: 3600 });
 * ```
 */
export declare const writeBehindSet: <T = any>(redis: RedisClient, queue: WriteBehindQueue, key: string, value: T, options?: CacheOptions) => Promise<boolean>;
/**
 * Flushes write-behind queue to persistent storage
 *
 * @param {WriteBehindQueue} queue - Write-behind queue
 * @param {(entries: WriteBehindEntry[]) => Promise<void>} flushFn - Function to flush entries to storage
 * @returns {Promise<number>} Number of entries flushed
 *
 * @example
 * ```typescript
 * const flushed = await flushWriteBehindQueue(queue, async (entries) => {
 *   await repository.batchWrite(entries);
 * });
 * ```
 */
export declare const flushWriteBehindQueue: (queue: WriteBehindQueue, flushFn: (entries: WriteBehindEntry[]) => Promise<void>) => Promise<number>;
/**
 * Starts automatic flush interval for write-behind queue
 *
 * @param {WriteBehindQueue} queue - Write-behind queue
 * @param {(entries: WriteBehindEntry[]) => Promise<void>} flushFn - Function to flush entries
 * @returns {NodeJS.Timer} Interval timer
 *
 * @example
 * ```typescript
 * const timer = startWriteBehindFlush(queue, async (entries) => {
 *   await repository.batchWrite(entries);
 * });
 * ```
 */
export declare const startWriteBehindFlush: (queue: WriteBehindQueue, flushFn: (entries: WriteBehindEntry[]) => Promise<void>) => NodeJS.Timer;
/**
 * Invalidates cache by TTL (time-based expiration)
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {string} key - Cache key
 * @param {number} ttl - Time to live in seconds
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await invalidateByTTL(redis, 'temp:data', 300);
 * ```
 */
export declare const invalidateByTTL: (redis: RedisClient, key: string, ttl: number) => Promise<boolean>;
/**
 * Invalidates cache by tag (grouped invalidation)
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {string} tag - Tag to invalidate
 * @returns {Promise<number>} Number of keys invalidated
 *
 * @example
 * ```typescript
 * await invalidateByTag(redis, 'user-data');
 * ```
 */
export declare const invalidateByTag: (redis: RedisClient, tag: string) => Promise<number>;
/**
 * Invalidates cache by pattern (wildcard matching)
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {string} pattern - Key pattern (e.g., 'user:*')
 * @returns {Promise<number>} Number of keys invalidated
 *
 * @example
 * ```typescript
 * await invalidateByPattern(redis, 'user:*');
 * ```
 */
export declare const invalidateByPattern: (redis: RedisClient, pattern: string) => Promise<number>;
/**
 * Invalidates multiple cache keys atomically
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {string[]} keys - Array of cache keys
 * @returns {Promise<number>} Number of keys invalidated
 *
 * @example
 * ```typescript
 * await invalidateMultiple(redis, ['user:123', 'user:456', 'session:789']);
 * ```
 */
export declare const invalidateMultiple: (redis: RedisClient, keys: string[]) => Promise<number>;
/**
 * Invalidates cache with cascading effect (parent-child relationships)
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {string} parentKey - Parent cache key
 * @param {string[]} childPatterns - Child key patterns
 * @returns {Promise<number>} Total number of keys invalidated
 *
 * @example
 * ```typescript
 * await invalidateCascading(redis, 'organization:123', ['org:123:users:*', 'org:123:projects:*']);
 * ```
 */
export declare const invalidateCascading: (redis: RedisClient, parentKey: string, childPatterns: string[]) => Promise<number>;
/**
 * Gets remaining TTL for a cache key
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {string} key - Cache key
 * @returns {Promise<number>} Remaining TTL in seconds (-1 if no TTL, -2 if key doesn't exist)
 *
 * @example
 * ```typescript
 * const ttl = await getTTL(redis, 'user:123');
 * ```
 */
export declare const getTTL: (redis: RedisClient, key: string) => Promise<number>;
/**
 * Extends TTL for a cache key
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {string} key - Cache key
 * @param {number} additionalSeconds - Additional seconds to add
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await extendTTL(redis, 'session:abc', 1800);
 * ```
 */
export declare const extendTTL: (redis: RedisClient, key: string, additionalSeconds: number) => Promise<boolean>;
/**
 * Refreshes TTL to original value
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {string} key - Cache key
 * @param {number} ttl - TTL in seconds
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await refreshTTL(redis, 'user:123', 3600);
 * ```
 */
export declare const refreshTTL: (redis: RedisClient, key: string, ttl: number) => Promise<boolean>;
/**
 * Sets TTL for multiple keys atomically
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {Map<string, number>} keyTTLs - Map of key to TTL
 * @returns {Promise<number>} Number of keys updated
 *
 * @example
 * ```typescript
 * const keyTTLs = new Map([['key1', 300], ['key2', 600]]);
 * await setMultipleTTLs(redis, keyTTLs);
 * ```
 */
export declare const setMultipleTTLs: (redis: RedisClient, keyTTLs: Map<string, number>) => Promise<number>;
/**
 * Builds a structured cache key from components
 *
 * @param {CacheKey} components - Cache key components
 * @returns {string} Formatted cache key
 *
 * @example
 * ```typescript
 * const key = buildCacheKey({
 *   namespace: 'healthcare',
 *   resource: 'patient',
 *   identifier: '12345',
 *   version: 'v1'
 * });
 * // Result: 'healthcare:patient:12345:v1'
 * ```
 */
export declare const buildCacheKey: (components: CacheKey) => string;
/**
 * Parses a cache key into components
 *
 * @param {string} key - Cache key
 * @returns {Partial<CacheKey>} Parsed components
 *
 * @example
 * ```typescript
 * const components = parseCacheKey('healthcare:patient:12345:v1');
 * ```
 */
export declare const parseCacheKey: (key: string) => Partial<CacheKey>;
/**
 * Generates cache key with hash for complex identifiers
 *
 * @param {string} namespace - Cache namespace
 * @param {any} identifier - Complex identifier object
 * @returns {string} Hashed cache key
 *
 * @example
 * ```typescript
 * const key = generateHashedKey('products', { category: 'electronics', brand: 'Apple' });
 * ```
 */
export declare const generateHashedKey: (namespace: string, identifier: any) => string;
/**
 * Normalizes cache key to ensure consistency
 *
 * @param {string} key - Cache key
 * @returns {string} Normalized key
 *
 * @example
 * ```typescript
 * const normalized = normalizeCacheKey('User:123:Profile');
 * // Result: 'user:123:profile'
 * ```
 */
export declare const normalizeCacheKey: (key: string) => string;
/**
 * Warms cache with preloaded data
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {Map<string, any>} data - Data to preload
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<number>} Number of entries loaded
 *
 * @example
 * ```typescript
 * const warmData = new Map([['user:1', userData1], ['user:2', userData2]]);
 * await warmCache(redis, warmData, { ttl: 3600 });
 * ```
 */
export declare const warmCache: (redis: RedisClient, data: Map<string, any>, options?: CacheOptions) => Promise<number>;
/**
 * Warms cache progressively with batched loading
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {() => AsyncIterator<[string, any]>} dataIterator - Async iterator for data
 * @param {number} batchSize - Batch size for loading
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<number>} Total entries loaded
 *
 * @example
 * ```typescript
 * async function* dataGenerator() {
 *   for (const user of users) {
 *     yield [`user:${user.id}`, user];
 *   }
 * }
 * await warmCacheProgressive(redis, dataGenerator, 100, { ttl: 3600 });
 * ```
 */
export declare const warmCacheProgressive: (redis: RedisClient, dataIterator: () => AsyncIterator<[string, any]>, batchSize?: number, options?: CacheOptions) => Promise<number>;
/**
 * Schedules periodic cache warming
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {() => Promise<Map<string, any>>} loadFn - Function to load data
 * @param {number} intervalMs - Warming interval in milliseconds
 * @param {CacheOptions} [options] - Cache options
 * @returns {NodeJS.Timer} Interval timer
 *
 * @example
 * ```typescript
 * const timer = scheduleCacheWarming(redis, async () => {
 *   return await loadPopularProducts();
 * }, 3600000, { ttl: 7200 });
 * ```
 */
export declare const scheduleCacheWarming: (redis: RedisClient, loadFn: () => Promise<Map<string, any>>, intervalMs: number, options?: CacheOptions) => NodeJS.Timer;
/**
 * Creates a cache hierarchy with multiple levels
 *
 * @param {object} config - Cache hierarchy configuration
 * @returns {CacheHierarchy} Cache hierarchy instance
 *
 * @example
 * ```typescript
 * const hierarchy = createCacheHierarchy({
 *   l1: lruCache,
 *   l2: redisClient,
 *   options: { promoteOnHit: true }
 * });
 * ```
 */
export declare const createCacheHierarchy: (config: {
    l1?: LRUCache;
    l2?: RedisClient;
    l3?: DatabaseCache;
    options?: {
        promoteOnHit?: boolean;
        replicateDownward?: boolean;
    };
}) => CacheHierarchy;
/**
 * Gets value from multi-level cache hierarchy
 *
 * @param {CacheHierarchy} hierarchy - Cache hierarchy
 * @param {string} key - Cache key
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<T | null>} Cached value
 *
 * @example
 * ```typescript
 * const user = await multiLevelGet<User>(hierarchy, 'user:123');
 * ```
 */
export declare const multiLevelGet: <T = any>(hierarchy: CacheHierarchy, key: string, options?: CacheOptions) => Promise<T | null>;
/**
 * Sets value in multi-level cache hierarchy
 *
 * @param {CacheHierarchy} hierarchy - Cache hierarchy
 * @param {string} key - Cache key
 * @param {T} value - Value to cache
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await multiLevelSet(hierarchy, 'user:123', userData, { ttl: 3600 });
 * ```
 */
export declare const multiLevelSet: <T = any>(hierarchy: CacheHierarchy, key: string, value: T, options?: CacheOptions) => Promise<boolean>;
/**
 * Invalidates value across all cache levels
 *
 * @param {CacheHierarchy} hierarchy - Cache hierarchy
 * @param {string} key - Cache key
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await multiLevelInvalidate(hierarchy, 'user:123');
 * ```
 */
export declare const multiLevelInvalidate: (hierarchy: CacheHierarchy, key: string) => Promise<boolean>;
/**
 * Acquires distributed lock for cache stampede prevention
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {string} key - Lock key
 * @param {number} ttl - Lock TTL in seconds
 * @returns {Promise<CacheLock | null>} Lock instance or null
 *
 * @example
 * ```typescript
 * const lock = await acquireCacheLock(redis, 'refresh:user:123', 10);
 * ```
 */
export declare const acquireCacheLock: (redis: RedisClient, key: string, ttl?: number) => Promise<CacheLock | null>;
/**
 * Releases distributed lock
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {CacheLock} lock - Lock instance
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await releaseCacheLock(redis, lock);
 * ```
 */
export declare const releaseCacheLock: (redis: RedisClient, lock: CacheLock) => Promise<boolean>;
/**
 * Gets value with stampede prevention using distributed locking
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {string} key - Cache key
 * @param {() => Promise<T>} fetchFn - Function to fetch data
 * @param {CacheOptions & {lockTTL?: number}} [options] - Cache and lock options
 * @returns {Promise<T | null>} Cached or fetched value
 *
 * @example
 * ```typescript
 * const data = await getWithStampedeProtection(redis, 'expensive:query', async () => {
 *   return await runExpensiveQuery();
 * }, { ttl: 3600, lockTTL: 30 });
 * ```
 */
export declare const getWithStampedeProtection: <T = any>(redis: RedisClient, key: string, fetchFn: () => Promise<T>, options?: CacheOptions & {
    lockTTL?: number;
}) => Promise<T | null>;
/**
 * Serializes value for cache storage
 *
 * @param {T} value - Value to serialize
 * @param {boolean} [compress] - Enable compression
 * @returns {Promise<string>} Serialized value
 *
 * @example
 * ```typescript
 * const serialized = await serializeForCache(complexObject, true);
 * ```
 */
export declare const serializeForCache: <T = any>(value: T, compress?: boolean) => Promise<string>;
/**
 * Deserializes value from cache storage
 *
 * @param {string} serialized - Serialized value
 * @param {boolean} [compressed] - Value is compressed
 * @returns {Promise<T | null>} Deserialized value
 *
 * @example
 * ```typescript
 * const value = await deserializeFromCache<User>(serialized, true);
 * ```
 */
export declare const deserializeFromCache: <T = any>(serialized: string, compressed?: boolean) => Promise<T | null>;
/**
 * Gets comprehensive cache statistics from Redis
 *
 * @param {RedisClient} redis - Redis client instance
 * @param {string} [namespace] - Optional namespace filter
 * @returns {Promise<any>} Cache statistics
 *
 * @example
 * ```typescript
 * const stats = await getCacheStatistics(redis, 'user');
 * ```
 */
export declare const getCacheStatistics: (redis: RedisClient, namespace?: string) => Promise<any>;
/**
 * Tracks cache hit/miss metrics
 *
 * @param {string} key - Cache key
 * @param {boolean} hit - Whether it was a hit or miss
 * @returns {void}
 *
 * @example
 * ```typescript
 * trackCacheMetric('user:123', true);
 * ```
 */
export declare const trackCacheMetric: (key: string, hit: boolean) => void;
/**
 * Calculates cache efficiency metrics
 *
 * @param {CacheStats} stats - Cache statistics
 * @returns {object} Efficiency metrics
 *
 * @example
 * ```typescript
 * const metrics = calculateCacheEfficiency(cacheStats);
 * ```
 */
export declare const calculateCacheEfficiency: (stats: CacheStats) => {
    hitRate: number;
    missRate: number;
    efficiency: number;
};
//# sourceMappingURL=caching-strategies-kit.d.ts.map