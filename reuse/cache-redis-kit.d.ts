/**
 * LOC: CACHERED1234567
 * File: /reuse/cache-redis-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS caching services
 *   - Redis cache providers
 *   - In-memory cache services
 *   - Cache warming strategies
 *   - Distributed caching modules
 */
/**
 * File: /reuse/cache-redis-kit.ts
 * Locator: WC-UTL-CACHERED-001
 * Purpose: Comprehensive Caching & Redis Kit - Complete caching toolkit for NestJS
 *
 * Upstream: Independent utility module for caching and Redis operations
 * Downstream: ../backend/*, Cache services, Redis providers, Performance optimization modules
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/cache-manager, redis, ioredis, Sequelize
 * Exports: 40+ utility functions for Redis, in-memory caching, TTL management, cache invalidation, warming, distributed caching
 *
 * LLM Context: Enterprise-grade caching utilities for White Cross healthcare platform.
 * Provides comprehensive Redis integration (cluster, sentinel), in-memory caching (LRU),
 * cache strategies (write-through, write-behind, read-through), TTL management, cache warming,
 * invalidation patterns (tag-based, pattern-based), distributed locking, pub/sub, cache analytics,
 * compression, serialization, multi-layer caching, cache-aside patterns, and HIPAA-compliant caching.
 */
import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Model, Sequelize } from 'sequelize';
import { Observable } from 'rxjs';
interface CacheConfig {
    ttl: number;
    max?: number;
    strategy?: 'LRU' | 'LFU' | 'FIFO';
    compression?: boolean;
    namespace?: string;
}
interface RedisConfig {
    host: string;
    port: number;
    password?: string;
    db?: number;
    keyPrefix?: string;
    enableReadyCheck?: boolean;
    maxRetriesPerRequest?: number;
    retryStrategy?: (times: number) => number | void;
    connectTimeout?: number;
    lazyConnect?: boolean;
}
interface RedisClusterConfig {
    nodes: Array<{
        host: string;
        port: number;
    }>;
    options?: {
        enableReadyCheck?: boolean;
        maxRedirections?: number;
        retryDelayOnFailover?: number;
        retryDelayOnClusterDown?: number;
        scaleReads?: 'master' | 'slave' | 'all';
    };
}
interface CacheEntry<T = any> {
    key: string;
    value: T;
    ttl: number;
    createdAt: number;
    expiresAt: number;
    hits: number;
    size: number;
    tags?: string[];
    metadata?: Record<string, any>;
}
interface CacheStats {
    hits: number;
    misses: number;
    sets: number;
    deletes: number;
    evictions: number;
    hitRate: number;
    missRate: number;
    totalKeys: number;
    memoryUsage: number;
    avgTTL: number;
}
interface CacheInvalidationPattern {
    pattern: string;
    type: 'prefix' | 'suffix' | 'contains' | 'regex' | 'tags';
    timestamp: number;
    reason?: string;
}
interface DistributedLockConfig {
    key: string;
    ttl: number;
    retryCount?: number;
    retryDelay?: number;
    identifier?: string;
}
interface CacheWarmingStrategy {
    keys: string[];
    loader: (key: string) => Promise<any>;
    ttl: number;
    priority?: number;
    schedule?: string;
}
interface CachePubSubMessage {
    type: 'invalidate' | 'update' | 'clear' | 'stats';
    pattern?: string;
    key?: string;
    value?: any;
    timestamp: number;
    source: string;
}
/**
 * Sequelize model for Cache Analytics with hit/miss tracking and performance metrics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CacheAnalytics model
 *
 * @example
 * const CacheAnalytics = defineCacheAnalyticsModel(sequelize);
 * await CacheAnalytics.create({
 *   cacheKey: 'user:123',
 *   operation: 'get',
 *   hit: true,
 *   responseTime: 5
 * });
 */
export declare function defineCacheAnalyticsModel(sequelize: Sequelize): typeof Model;
/**
 * Sequelize model for Cache Configuration with TTL and invalidation rules.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CacheConfiguration model
 *
 * @example
 * const CacheConfiguration = defineCacheConfigurationModel(sequelize);
 * await CacheConfiguration.create({
 *   namespace: 'user-data',
 *   defaultTTL: 3600,
 *   maxSize: 1000,
 *   strategy: 'LRU'
 * });
 */
export declare function defineCacheConfigurationModel(sequelize: Sequelize): typeof Model;
/**
 * Zod schema for cache configuration validation.
 */
export declare const cacheConfigSchema: any;
/**
 * Zod schema for Redis configuration validation.
 */
export declare const redisConfigSchema: any;
/**
 * Zod schema for cache entry validation.
 */
export declare const cacheEntrySchema: any;
/**
 * Zod schema for distributed lock configuration.
 */
export declare const distributedLockSchema: any;
/**
 * Zod schema for cache warming strategy.
 */
export declare const cacheWarmingSchema: any;
/**
 * Creates a Redis client with connection pooling and retry strategy.
 *
 * @param {RedisConfig} config - Redis configuration
 * @returns {Promise<any>} Connected Redis client
 *
 * @example
 * const redis = await createRedisClient({
 *   host: 'localhost',
 *   port: 6379,
 *   password: 'secret'
 * });
 */
export declare function createRedisClient(config: RedisConfig): Promise<any>;
/**
 * Creates a Redis cluster client with failover support.
 *
 * @param {RedisClusterConfig} config - Redis cluster configuration
 * @returns {Promise<any>} Connected Redis cluster client
 *
 * @example
 * const cluster = await createRedisClusterClient({
 *   nodes: [
 *     { host: 'node1', port: 6379 },
 *     { host: 'node2', port: 6379 }
 *   ]
 * });
 */
export declare function createRedisClusterClient(config: RedisClusterConfig): Promise<any>;
/**
 * Implements Redis Sentinel for high availability.
 *
 * @param {Array<{host: string, port: number}>} sentinels - Sentinel nodes
 * @param {string} masterName - Master name
 * @returns {Promise<any>} Redis client with Sentinel support
 *
 * @example
 * const redis = await createRedisSentinelClient(
 *   [{ host: 'sentinel1', port: 26379 }],
 *   'mymaster'
 * );
 */
export declare function createRedisSentinelClient(sentinels: Array<{
    host: string;
    port: number;
}>, masterName: string): Promise<any>;
/**
 * Creates a Redis pipeline for batched operations.
 *
 * @param {any} redisClient - Redis client
 * @param {Array<{command: string, args: any[]}>} commands - Commands to execute
 * @returns {Promise<any[]>} Pipeline results
 *
 * @example
 * const results = await executeRedisPipeline(redis, [
 *   { command: 'set', args: ['key1', 'value1'] },
 *   { command: 'get', args: ['key1'] }
 * ]);
 */
export declare function executeRedisPipeline(redisClient: any, commands: Array<{
    command: string;
    args: any[];
}>): Promise<any[]>;
/**
 * Implements Redis pub/sub for cache invalidation across instances.
 *
 * @param {any} redisClient - Redis client
 * @param {string} channel - Pub/sub channel
 * @param {(message: CachePubSubMessage) => void} handler - Message handler
 * @returns {Promise<void>}
 *
 * @example
 * await subscribeToInvalidationChannel(redis, 'cache:invalidate', (msg) => {
 *   console.log('Invalidate:', msg.key);
 * });
 */
export declare function subscribeToInvalidationChannel(redisClient: any, channel: string, handler: (message: CachePubSubMessage) => void): Promise<void>;
/**
 * Creates an in-memory LRU cache with TTL support.
 *
 * @param {CacheConfig} config - Cache configuration
 * @returns {Map<string, CacheEntry>} In-memory cache
 *
 * @example
 * const cache = createInMemoryCache({ ttl: 3600, max: 1000 });
 */
export declare function createInMemoryCache(config: CacheConfig): Map<string, CacheEntry>;
/**
 * Implements cache-aside (lazy loading) pattern.
 *
 * @param {string} key - Cache key
 * @param {() => Promise<T>} loader - Data loader function
 * @param {Map<string, CacheEntry>} cache - Cache instance
 * @param {number} ttl - Time to live in seconds
 * @returns {Promise<T>} Cached or loaded value
 *
 * @example
 * const user = await cacheAsideGet('user:123', async () => {
 *   return await db.users.findOne({ id: 123 });
 * }, cache, 3600);
 */
export declare function cacheAsideGet<T>(key: string, loader: () => Promise<T>, cache: Map<string, CacheEntry>, ttl: number): Promise<T>;
/**
 * Implements write-through caching pattern.
 *
 * @param {string} key - Cache key
 * @param {T} value - Value to cache and persist
 * @param {(value: T) => Promise<void>} persister - Persistence function
 * @param {Map<string, CacheEntry>} cache - Cache instance
 * @param {number} ttl - Time to live in seconds
 * @returns {Promise<void>}
 *
 * @example
 * await writeThroughSet('user:123', userData, async (data) => {
 *   await db.users.update({ id: 123 }, data);
 * }, cache, 3600);
 */
export declare function writeThroughSet<T>(key: string, value: T, persister: (value: T) => Promise<void>, cache: Map<string, CacheEntry>, ttl: number): Promise<void>;
/**
 * Implements write-behind (write-back) caching pattern.
 *
 * @param {string} key - Cache key
 * @param {T} value - Value to cache
 * @param {(value: T) => Promise<void>} persister - Async persistence function
 * @param {Map<string, CacheEntry>} cache - Cache instance
 * @param {number} ttl - Time to live in seconds
 * @param {number} writeDelay - Delay before persisting (ms)
 * @returns {Promise<void>}
 *
 * @example
 * await writeBehindSet('user:123', userData, async (data) => {
 *   await db.users.update({ id: 123 }, data);
 * }, cache, 3600, 5000);
 */
export declare function writeBehindSet<T>(key: string, value: T, persister: (value: T) => Promise<void>, cache: Map<string, CacheEntry>, ttl: number, writeDelay?: number): Promise<void>;
/**
 * Implements refresh-ahead caching pattern.
 *
 * @param {string} key - Cache key
 * @param {() => Promise<T>} loader - Data loader function
 * @param {Map<string, CacheEntry>} cache - Cache instance
 * @param {number} ttl - Time to live in seconds
 * @param {number} refreshThreshold - Refresh when TTL below this (seconds)
 * @returns {Promise<T>} Cached value
 *
 * @example
 * const data = await refreshAheadGet('hot-data', loadData, cache, 3600, 300);
 */
export declare function refreshAheadGet<T>(key: string, loader: () => Promise<T>, cache: Map<string, CacheEntry>, ttl: number, refreshThreshold?: number): Promise<T>;
/**
 * Sets TTL for a cache key with Redis.
 *
 * @param {any} redisClient - Redis client
 * @param {string} key - Cache key
 * @param {number} ttl - Time to live in seconds
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * await setTTL(redis, 'user:123', 3600);
 */
export declare function setTTL(redisClient: any, key: string, ttl: number): Promise<boolean>;
/**
 * Gets remaining TTL for a cache key.
 *
 * @param {any} redisClient - Redis client
 * @param {string} key - Cache key
 * @returns {Promise<number>} Remaining TTL in seconds (-2 if key doesn't exist, -1 if no TTL)
 *
 * @example
 * const ttl = await getTTL(redis, 'user:123');
 */
export declare function getTTL(redisClient: any, key: string): Promise<number>;
/**
 * Extends TTL for a cache key by adding additional time.
 *
 * @param {any} redisClient - Redis client
 * @param {string} key - Cache key
 * @param {number} additionalSeconds - Additional seconds to add
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * await extendTTL(redis, 'user:123', 600);
 */
export declare function extendTTL(redisClient: any, key: string, additionalSeconds: number): Promise<boolean>;
/**
 * Implements sliding window TTL refresh on access.
 *
 * @param {any} redisClient - Redis client
 * @param {string} key - Cache key
 * @param {number} ttl - Time to live in seconds
 * @returns {Promise<any>} Cache value with refreshed TTL
 *
 * @example
 * const value = await getWithSlidingTTL(redis, 'user:123', 3600);
 */
export declare function getWithSlidingTTL(redisClient: any, key: string, ttl: number): Promise<any>;
/**
 * Implements absolute expiration (non-sliding) TTL.
 *
 * @param {any} redisClient - Redis client
 * @param {string} key - Cache key
 * @param {Date} expirationDate - Absolute expiration date
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * const expiration = new Date('2024-12-31T23:59:59Z');
 * await setAbsoluteExpiration(redis, 'promo:holiday', expiration);
 */
export declare function setAbsoluteExpiration(redisClient: any, key: string, expirationDate: Date): Promise<boolean>;
/**
 * Invalidates cache by key pattern (prefix, suffix, contains).
 *
 * @param {any} redisClient - Redis client
 * @param {CacheInvalidationPattern} pattern - Invalidation pattern
 * @returns {Promise<number>} Number of keys deleted
 *
 * @example
 * const deleted = await invalidateByPattern(redis, {
 *   pattern: 'user:*',
 *   type: 'prefix',
 *   timestamp: Date.now()
 * });
 */
export declare function invalidateByPattern(redisClient: any, pattern: CacheInvalidationPattern): Promise<number>;
/**
 * Invalidates cache by tags (tag-based invalidation).
 *
 * @param {any} redisClient - Redis client
 * @param {string[]} tags - Tags to invalidate
 * @returns {Promise<number>} Number of keys deleted
 *
 * @example
 * const deleted = await invalidateByTags(redis, ['user', 'profile']);
 */
export declare function invalidateByTags(redisClient: any, tags: string[]): Promise<number>;
/**
 * Implements cache stampede prevention with locking.
 *
 * @param {any} redisClient - Redis client
 * @param {string} key - Cache key
 * @param {() => Promise<T>} loader - Data loader function
 * @param {number} ttl - Time to live in seconds
 * @param {number} lockTTL - Lock TTL in seconds
 * @returns {Promise<T>} Cached or loaded value
 *
 * @example
 * const data = await preventCacheStampede(redis, 'expensive:data', loadData, 3600, 10);
 */
export declare function preventCacheStampede<T>(redisClient: any, key: string, loader: () => Promise<T>, ttl: number, lockTTL?: number): Promise<T>;
/**
 * Implements time-based cache invalidation with versioning.
 *
 * @param {any} redisClient - Redis client
 * @param {string} key - Cache key
 * @param {T} value - Value to cache
 * @param {number} ttl - Time to live in seconds
 * @param {string} version - Version identifier
 * @returns {Promise<void>}
 *
 * @example
 * await setWithVersion(redis, 'config', configData, 3600, 'v2');
 */
export declare function setWithVersion<T>(redisClient: any, key: string, value: T, ttl: number, version: string): Promise<void>;
/**
 * Clears all cache entries (flush all).
 *
 * @param {any} redisClient - Redis client
 * @param {string} namespace - Optional namespace to clear
 * @returns {Promise<void>}
 *
 * @example
 * await clearAllCache(redis, 'user');
 */
export declare function clearAllCache(redisClient: any, namespace?: string): Promise<void>;
/**
 * Warms cache with predefined keys and loaders.
 *
 * @param {any} redisClient - Redis client
 * @param {CacheWarmingStrategy} strategy - Cache warming strategy
 * @returns {Promise<number>} Number of keys warmed
 *
 * @example
 * const warmed = await warmCache(redis, {
 *   keys: ['user:popular:1', 'user:popular:2'],
 *   loader: async (key) => await loadUserData(key),
 *   ttl: 3600
 * });
 */
export declare function warmCache(redisClient: any, strategy: CacheWarmingStrategy): Promise<number>;
/**
 * Pre-warms cache for frequently accessed data.
 *
 * @param {any} redisClient - Redis client
 * @param {Map<string, () => Promise<any>>} loaders - Key-loader map
 * @param {number} ttl - Time to live in seconds
 * @returns {Promise<string[]>} Warmed keys
 *
 * @example
 * const warmed = await prewarmFrequentData(redis, new Map([
 *   ['config:app', loadAppConfig],
 *   ['config:db', loadDbConfig]
 * ]), 3600);
 */
export declare function prewarmFrequentData(redisClient: any, loaders: Map<string, () => Promise<any>>, ttl: number): Promise<string[]>;
/**
 * Implements scheduled cache warming with cron-like pattern.
 *
 * @param {any} redisClient - Redis client
 * @param {CacheWarmingStrategy} strategy - Warming strategy with schedule
 * @param {() => void} callback - Callback after warming
 * @returns {NodeJS.Timer} Interval timer
 *
 * @example
 * const timer = scheduleWarmup(redis, {
 *   keys: ['popular:data'],
 *   loader: loadData,
 *   ttl: 3600,
 *   schedule: '0 * * * *' // Every hour
 * }, () => console.log('Warmed'));
 */
export declare function scheduleWarmup(redisClient: any, strategy: CacheWarmingStrategy, callback?: () => void): NodeJS.Timer;
/**
 * Warms cache based on analytics (most accessed keys).
 *
 * @param {typeof Model} analyticsModel - Cache analytics model
 * @param {any} redisClient - Redis client
 * @param {(key: string) => Promise<any>} loader - Data loader
 * @param {number} topN - Number of top keys to warm
 * @param {number} ttl - Time to live in seconds
 * @returns {Promise<string[]>} Warmed keys
 *
 * @example
 * const warmed = await warmByAnalytics(CacheAnalytics, redis, loadData, 100, 3600);
 */
export declare function warmByAnalytics(analyticsModel: typeof Model, redisClient: any, loader: (key: string) => Promise<any>, topN?: number, ttl?: number): Promise<string[]>;
/**
 * Implements progressive cache warming to avoid load spikes.
 *
 * @param {any} redisClient - Redis client
 * @param {string[]} keys - Keys to warm
 * @param {(key: string) => Promise<any>} loader - Data loader
 * @param {number} ttl - Time to live in seconds
 * @param {number} batchSize - Batch size for progressive warming
 * @param {number} delayMs - Delay between batches (ms)
 * @returns {Promise<number>} Number of keys warmed
 *
 * @example
 * const warmed = await progressiveWarmup(redis, keys, loadData, 3600, 10, 1000);
 */
export declare function progressiveWarmup(redisClient: any, keys: string[], loader: (key: string) => Promise<any>, ttl: number, batchSize?: number, delayMs?: number): Promise<number>;
/**
 * Acquires a distributed lock with Redis.
 *
 * @param {any} redisClient - Redis client
 * @param {DistributedLockConfig} config - Lock configuration
 * @returns {Promise<string | null>} Lock identifier if acquired, null otherwise
 *
 * @example
 * const lockId = await acquireDistributedLock(redis, {
 *   key: 'resource:123',
 *   ttl: 5000,
 *   retryCount: 3
 * });
 */
export declare function acquireDistributedLock(redisClient: any, config: DistributedLockConfig): Promise<string | null>;
/**
 * Releases a distributed lock.
 *
 * @param {any} redisClient - Redis client
 * @param {string} key - Lock key
 * @param {string} lockId - Lock identifier
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * const released = await releaseDistributedLock(redis, 'resource:123', lockId);
 */
export declare function releaseDistributedLock(redisClient: any, key: string, lockId: string): Promise<boolean>;
/**
 * Implements Redlock algorithm for distributed locking across multiple Redis instances.
 *
 * @param {any[]} redisClients - Array of Redis clients
 * @param {DistributedLockConfig} config - Lock configuration
 * @returns {Promise<{success: boolean, lockIds: string[]}>} Lock result
 *
 * @example
 * const result = await redlockAcquire([redis1, redis2, redis3], {
 *   key: 'critical:resource',
 *   ttl: 10000
 * });
 */
export declare function redlockAcquire(redisClients: any[], config: DistributedLockConfig): Promise<{
    success: boolean;
    lockIds: string[];
}>;
/**
 * Collects cache statistics (hits, misses, hit rate).
 *
 * @param {typeof Model} analyticsModel - Cache analytics model
 * @param {string} namespace - Cache namespace
 * @param {Date} startDate - Start date for analysis
 * @param {Date} endDate - End date for analysis
 * @returns {Promise<CacheStats>} Cache statistics
 *
 * @example
 * const stats = await getCacheStats(CacheAnalytics, 'user', startDate, endDate);
 */
export declare function getCacheStats(analyticsModel: typeof Model, namespace: string, startDate: Date, endDate: Date): Promise<CacheStats>;
/**
 * Tracks cache performance metrics.
 *
 * @param {typeof Model} analyticsModel - Cache analytics model
 * @param {string} cacheKey - Cache key
 * @param {string} operation - Cache operation
 * @param {boolean} hit - Whether it was a cache hit
 * @param {number} responseTime - Response time in ms
 * @param {any} metadata - Additional metadata
 * @returns {Promise<void>}
 *
 * @example
 * await trackCacheMetrics(CacheAnalytics, 'user:123', 'get', true, 5, {});
 */
export declare function trackCacheMetrics(analyticsModel: typeof Model, cacheKey: string, operation: 'get' | 'set' | 'delete' | 'invalidate', hit: boolean, responseTime: number, metadata?: Record<string, any>): Promise<void>;
/**
 * Identifies hot keys (most frequently accessed).
 *
 * @param {typeof Model} analyticsModel - Cache analytics model
 * @param {string} namespace - Cache namespace
 * @param {number} topN - Number of top keys to return
 * @param {number} hours - Hours to look back
 * @returns {Promise<Array<{key: string, hits: number}>>} Hot keys
 *
 * @example
 * const hotKeys = await identifyHotKeys(CacheAnalytics, 'user', 10, 24);
 */
export declare function identifyHotKeys(analyticsModel: typeof Model, namespace: string, topN?: number, hours?: number): Promise<Array<{
    key: string;
    hits: number;
}>>;
/**
 * Identifies cold keys (rarely accessed).
 *
 * @param {typeof Model} analyticsModel - Cache analytics model
 * @param {string} namespace - Cache namespace
 * @param {number} topN - Number of bottom keys to return
 * @param {number} hours - Hours to look back
 * @returns {Promise<Array<{key: string, hits: number}>>} Cold keys
 *
 * @example
 * const coldKeys = await identifyColdKeys(CacheAnalytics, 'user', 10, 24);
 */
export declare function identifyColdKeys(analyticsModel: typeof Model, namespace: string, topN?: number, hours?: number): Promise<Array<{
    key: string;
    hits: number;
}>>;
/**
 * Implements multi-layer caching (L1: memory, L2: Redis).
 *
 * @param {string} key - Cache key
 * @param {() => Promise<T>} loader - Data loader function
 * @param {Map<string, CacheEntry>} memoryCache - L1 cache
 * @param {any} redisClient - L2 cache
 * @param {number} l1TTL - L1 TTL in seconds
 * @param {number} l2TTL - L2 TTL in seconds
 * @returns {Promise<T>} Cached or loaded value
 *
 * @example
 * const data = await multiLayerGet('user:123', loadUser, memCache, redis, 300, 3600);
 */
export declare function multiLayerGet<T>(key: string, loader: () => Promise<T>, memoryCache: Map<string, CacheEntry>, redisClient: any, l1TTL: number, l2TTL: number): Promise<T>;
/**
 * Implements cache compression for large values.
 *
 * @param {any} redisClient - Redis client
 * @param {string} key - Cache key
 * @param {T} value - Value to cache
 * @param {number} ttl - Time to live in seconds
 * @param {boolean} compress - Whether to compress
 * @returns {Promise<void>}
 *
 * @example
 * await setWithCompression(redis, 'large:data', bigData, 3600, true);
 */
export declare function setWithCompression<T>(redisClient: any, key: string, value: T, ttl: number, compress?: boolean): Promise<void>;
/**
 * Gets cache value with automatic decompression.
 *
 * @param {any} redisClient - Redis client
 * @param {string} key - Cache key
 * @returns {Promise<T | null>} Cached value or null
 *
 * @example
 * const data = await getWithDecompression<UserData>(redis, 'large:data');
 */
export declare function getWithDecompression<T>(redisClient: any, key: string): Promise<T | null>;
/**
 * NestJS Injectable Cache Service with comprehensive caching strategies.
 *
 * @example
 * @Injectable()
 * export class UserService {
 *   constructor(private cacheService: CacheService) {}
 *
 *   async getUser(id: string) {
 *     return this.cacheService.get(`user:${id}`, () => this.loadUser(id));
 *   }
 * }
 */
export declare class CacheService {
    private memoryCache;
    private redisClient;
    constructor(redisClient?: any);
    get<T>(key: string, loader: () => Promise<T>, ttl?: number): Promise<T>;
    set<T>(key: string, value: T, ttl?: number): Promise<void>;
    delete(key: string): Promise<void>;
    invalidatePattern(pattern: CacheInvalidationPattern): Promise<number>;
}
/**
 * NestJS Cache Interceptor for automatic method result caching.
 *
 * @example
 * @UseInterceptors(CacheInterceptor)
 * @Get('users/:id')
 * async getUser(@Param('id') id: string) {
 *   return this.userService.findOne(id);
 * }
 */
export declare class CacheInterceptor implements NestInterceptor {
    private cacheService;
    constructor(cacheService: CacheService);
    intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>>;
}
export {};
//# sourceMappingURL=cache-redis-kit.d.ts.map