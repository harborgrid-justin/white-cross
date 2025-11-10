/**
 * LOC: CACHE1234567
 * File: /reuse/caching-performance-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend services and controllers
 *   - API gateway implementations
 *   - Database access layers
 */
/**
 * File: /reuse/caching-performance-kit.ts
 * Locator: WC-UTL-CACHE-001
 * Purpose: Comprehensive Caching & Performance Utilities - Multi-layer caching, compression, optimization
 *
 * Upstream: Independent utility module for caching and performance optimization
 * Downstream: ../backend/*, services, controllers, database layers
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Redis, Sequelize 6.x
 * Exports: 45 utility functions for caching strategies, compression, performance optimization, monitoring
 *
 * LLM Context: Production-grade caching and performance utilities for White Cross healthcare system.
 * Provides multi-layer caching (memory, Redis, distributed), cache invalidation patterns, TTL management,
 * cache-aside/write-through/write-behind patterns, memoization, HTTP response caching, query result caching,
 * cache warming, statistics, compression (gzip/brotli), lazy loading, and CDN integration.
 */
import { Model, Sequelize, Optional } from 'sequelize';
export interface CacheEntry<T = unknown> {
    key: string;
    value: T;
    ttl: number;
    createdAt: number;
    expiresAt: number;
    tags?: string[];
    metadata?: Record<string, unknown>;
}
export interface CacheOptions {
    ttl?: number;
    tags?: string[];
    namespace?: string;
    compress?: boolean;
    metadata?: Record<string, unknown>;
}
export interface CacheKeyConfig {
    prefix?: string;
    namespace?: string;
    separator?: string;
    includeVersion?: boolean;
    version?: string;
}
export interface CacheStats {
    hits: number;
    misses: number;
    sets: number;
    deletes: number;
    size: number;
    hitRate: number;
    memoryUsage: number;
}
export interface CacheLayer {
    name: string;
    priority: number;
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T, options?: CacheOptions): Promise<void>;
    delete(key: string): Promise<void>;
    clear(): Promise<void>;
}
interface CacheInvalidationPattern {
    type: 'time-based' | 'tag-based' | 'dependency-based' | 'event-based';
    handler: () => Promise<void>;
}
interface CompressionOptions {
    algorithm: 'gzip' | 'brotli' | 'deflate';
    level?: number;
    threshold?: number;
}
interface MemoizeOptions {
    ttl?: number;
    maxSize?: number;
    keyGenerator?: (...args: any[]) => string;
    resolver?: (...args: any[]) => any;
}
interface CacheWarmingStrategy {
    enabled: boolean;
    interval?: number;
    keys: string[] | (() => Promise<string[]>);
    loader: (key: string) => Promise<any>;
}
interface CDNConfig {
    provider: 'cloudflare' | 'cloudfront' | 'fastly' | 'akamai';
    endpoint: string;
    apiKey: string;
    zone?: string;
}
interface PerformanceMetrics {
    responseTime: number;
    throughput: number;
    errorRate: number;
    cacheHitRate: number;
    timestamp: number;
}
interface LazyLoadConfig<T> {
    loader: () => Promise<T>;
    cacheKey?: string;
    ttl?: number;
    preload?: boolean;
}
interface CacheEntryAttributes {
    id: number;
    key: string;
    value: string;
    namespace: string;
    ttl: number;
    expiresAt: Date;
    tags: string[];
    metadata: Record<string, any>;
    size: number;
    compressed: boolean;
    createdAt: Date;
    updatedAt: Date;
}
interface CacheEntryCreationAttributes extends Optional<CacheEntryAttributes, 'id' | 'createdAt' | 'updatedAt'> {
}
/**
 * Sequelize model for persistent cache entries.
 */
export declare class CacheEntryModel extends Model<CacheEntryAttributes, CacheEntryCreationAttributes> implements CacheEntryAttributes {
    id: number;
    key: string;
    value: string;
    namespace: string;
    ttl: number;
    expiresAt: Date;
    tags: string[];
    metadata: Record<string, any>;
    size: number;
    compressed: boolean;
    createdAt: Date;
    updatedAt: Date;
    static initModel(sequelize: Sequelize): typeof CacheEntryModel;
}
interface CacheStatisticsAttributes {
    id: number;
    namespace: string;
    operation: 'get' | 'set' | 'delete' | 'clear';
    hit: boolean;
    responseTime: number;
    keyPattern: string;
    timestamp: Date;
    metadata: Record<string, any>;
    createdAt: Date;
}
interface CacheStatisticsCreationAttributes extends Optional<CacheStatisticsAttributes, 'id' | 'createdAt'> {
}
/**
 * Sequelize model for cache statistics and monitoring.
 */
export declare class CacheStatisticsModel extends Model<CacheStatisticsAttributes, CacheStatisticsCreationAttributes> implements CacheStatisticsAttributes {
    id: number;
    namespace: string;
    operation: 'get' | 'set' | 'delete' | 'clear';
    hit: boolean;
    responseTime: number;
    keyPattern: string;
    timestamp: Date;
    metadata: Record<string, any>;
    createdAt: Date;
    static initModel(sequelize: Sequelize): typeof CacheStatisticsModel;
}
/**
 * Generates a deterministic cache key from arguments.
 *
 * @param {CacheKeyConfig} config - Cache key configuration
 * @param {...unknown[]} args - Arguments to include in key
 * @returns {string} Generated cache key
 * @throws {Error} When config is null or undefined
 *
 * @example
 * ```typescript
 * const key = generateCacheKey(
 *   { prefix: 'user', namespace: 'auth', version: 'v1' },
 *   'getUserById',
 *   123
 * );
 * // Result: 'auth:user:v1:getUserById:123'
 * ```
 */
export declare const generateCacheKey: (config: CacheKeyConfig, ...args: unknown[]) => string;
/**
 * Generates a hash-based cache key for complex objects.
 *
 * @param {CacheKeyConfig} config - Cache key configuration
 * @param {Record<string, any>} obj - Object to hash
 * @returns {string} Hash-based cache key
 *
 * @example
 * ```typescript
 * const key = generateHashKey(
 *   { prefix: 'query', namespace: 'db' },
 *   { table: 'users', where: { active: true }, limit: 10 }
 * );
 * // Result: 'db:query:a3f5e9b2c1d4...'
 * ```
 */
export declare const generateHashKey: (config: CacheKeyConfig, obj: Record<string, any>) => string;
/**
 * Generates a pattern-based cache key for wildcard matching.
 *
 * @param {CacheKeyConfig} config - Cache key configuration
 * @param {string} pattern - Pattern template
 * @param {Record<string, any>} values - Values to substitute
 * @returns {string} Pattern-based cache key
 *
 * @example
 * ```typescript
 * const key = generatePatternKey(
 *   { namespace: 'user' },
 *   'profile:{userId}:{section}',
 *   { userId: 123, section: 'settings' }
 * );
 * // Result: 'user:profile:123:settings'
 * ```
 */
export declare const generatePatternKey: (config: CacheKeyConfig, pattern: string, values: Record<string, any>) => string;
/**
 * Generates a semantic cache key based on meaning rather than exact match.
 *
 * @param {CacheKeyConfig} config - Cache key configuration
 * @param {string} query - Query or operation description
 * @returns {string} Semantic cache key
 *
 * @example
 * ```typescript
 * const key = generateSemanticKey(
 *   { namespace: 'ai' },
 *   'Find all active users in California'
 * );
 * // Result: 'ai:semantic:3f8a9c2e...'
 * ```
 */
export declare const generateSemanticKey: (config: CacheKeyConfig, query: string) => string;
/**
 * In-memory LRU cache implementation with TTL support.
 */
export declare class MemoryCache implements CacheLayer {
    private maxSize;
    private defaultTTL;
    name: string;
    priority: number;
    private cache;
    private stats;
    constructor(maxSize?: number, defaultTTL?: number);
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T, options?: CacheOptions): Promise<void>;
    delete(key: string): Promise<void>;
    clear(): Promise<void>;
    getStats(): CacheStats;
    private updateHitRate;
}
/**
 * Creates a multi-layer cache with fallback support.
 *
 * @param {CacheLayer[]} layers - Cache layers in priority order
 * @returns {MultiLayerCache} Multi-layer cache instance
 *
 * @example
 * ```typescript
 * const cache = createMultiLayerCache([
 *   new MemoryCache(1000, 60000),
 *   new RedisCache(),
 *   new DatabaseCache()
 * ]);
 *
 * await cache.get('user:123'); // Checks memory → Redis → Database
 * ```
 */
export declare const createMultiLayerCache: (layers: CacheLayer[]) => {
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T, options?: CacheOptions): Promise<void>;
    delete(key: string): Promise<void>;
    clear(): Promise<void>;
};
/**
 * Calculates adaptive TTL based on access patterns.
 *
 * @param {string} key - Cache key
 * @param {number} accessCount - Number of accesses
 * @param {number} baselineTTL - Baseline TTL in milliseconds
 * @returns {number} Calculated TTL
 *
 * @example
 * ```typescript
 * const ttl = calculateAdaptiveTTL('hot-data', 1000, 60000);
 * // Result: Higher TTL for frequently accessed data
 * ```
 */
export declare const calculateAdaptiveTTL: (key: string, accessCount: number, baselineTTL: number) => number;
/**
 * Calculates time-of-day based TTL for predictable traffic patterns.
 *
 * @param {number} baselineTTL - Baseline TTL in milliseconds
 * @param {number} peakHourStart - Peak hour start (0-23)
 * @param {number} peakHourEnd - Peak hour end (0-23)
 * @returns {number} Calculated TTL
 *
 * @example
 * ```typescript
 * const ttl = calculateTimeBasedTTL(60000, 9, 17);
 * // Result: Longer TTL during peak hours (9 AM - 5 PM)
 * ```
 */
export declare const calculateTimeBasedTTL: (baselineTTL: number, peakHourStart: number, peakHourEnd: number) => number;
/**
 * Implements TTL jitter to prevent thundering herd problem.
 *
 * @param {number} ttl - Base TTL in milliseconds
 * @param {number} jitterPercent - Jitter percentage (0-100)
 * @returns {number} TTL with jitter applied
 *
 * @example
 * ```typescript
 * const ttl = applyTTLJitter(60000, 10);
 * // Result: 54000-66000 (60s ± 10%)
 * ```
 */
export declare const applyTTLJitter: (ttl: number, jitterPercent: number) => number;
/**
 * Implements probabilistic early expiration to prevent cache stampede.
 *
 * @param {number} currentTTL - Current remaining TTL
 * @param {number} originalTTL - Original TTL
 * @param {number} delta - Computation time delta
 * @returns {boolean} Whether to refresh early
 *
 * @example
 * ```typescript
 * const shouldRefresh = shouldRefreshEarly(5000, 60000, 100);
 * // Result: Probabilistically true as expiration approaches
 * ```
 */
export declare const shouldRefreshEarly: (currentTTL: number, originalTTL: number, delta: number) => boolean;
/**
 * Implements cache-aside (lazy loading) pattern.
 *
 * @param {string} key - Cache key
 * @param {() => Promise<T>} loader - Data loader function
 * @param {CacheLayer} cache - Cache layer
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<T>} Cached or loaded data
 *
 * @example
 * ```typescript
 * const user = await cacheAside(
 *   'user:123',
 *   async () => await db.users.findByPk(123),
 *   memoryCache,
 *   { ttl: 300000 }
 * );
 * ```
 */
export declare const cacheAside: <T>(key: string, loader: () => Promise<T>, cache: CacheLayer, options?: CacheOptions) => Promise<T>;
/**
 * Implements write-through caching pattern.
 *
 * @param {string} key - Cache key
 * @param {T} value - Value to write
 * @param {(value: T) => Promise<void>} writer - Data writer function
 * @param {CacheLayer} cache - Cache layer
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await writeThrough(
 *   'user:123',
 *   updatedUser,
 *   async (user) => await db.users.update(user, { where: { id: 123 } }),
 *   memoryCache
 * );
 * ```
 */
export declare const writeThrough: <T>(key: string, value: T, writer: (value: T) => Promise<void>, cache: CacheLayer, options?: CacheOptions) => Promise<void>;
/**
 * Implements write-behind (write-back) caching pattern.
 *
 * @param {string} key - Cache key
 * @param {T} value - Value to write
 * @param {(value: T) => Promise<void>} writer - Data writer function
 * @param {CacheLayer} cache - Cache layer
 * @param {number} [delay=1000] - Write delay in milliseconds
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await writeBehind(
 *   'counter:123',
 *   { count: 100 },
 *   async (data) => await db.counters.update(data, { where: { id: 123 } }),
 *   memoryCache,
 *   5000 // Flush after 5 seconds
 * );
 * ```
 */
export declare const writeBehind: <T>(key: string, value: T, writer: (value: T) => Promise<void>, cache: CacheLayer, delay?: number, options?: CacheOptions) => Promise<void>;
/**
 * Implements refresh-ahead caching pattern.
 *
 * @param {string} key - Cache key
 * @param {() => Promise<T>} loader - Data loader function
 * @param {CacheLayer} cache - Cache layer
 * @param {number} refreshThreshold - Threshold percentage (0-100)
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<T>} Cached or loaded data
 *
 * @example
 * ```typescript
 * const data = await refreshAhead(
 *   'reports:daily',
 *   async () => await generateDailyReport(),
 *   memoryCache,
 *   80, // Refresh when 80% of TTL has elapsed
 *   { ttl: 3600000 }
 * );
 * ```
 */
export declare const refreshAhead: <T>(key: string, loader: () => Promise<T>, cache: CacheLayer, refreshThreshold: number, options?: CacheOptions) => Promise<T>;
/**
 * Invalidates cache entries by tags.
 *
 * @param {string[]} tags - Tags to invalidate
 * @param {CacheLayer} cache - Cache layer
 * @returns {Promise<number>} Number of invalidated entries
 *
 * @example
 * ```typescript
 * const count = await invalidateByTags(['user', 'profile'], memoryCache);
 * // Invalidates all entries tagged with 'user' or 'profile'
 * ```
 */
export declare const invalidateByTags: (tags: string[], cache: CacheLayer) => Promise<number>;
/**
 * Invalidates cache entries by pattern (wildcard matching).
 *
 * @param {string} pattern - Key pattern (supports * wildcard)
 * @param {CacheLayer} cache - Cache layer
 * @returns {Promise<number>} Number of invalidated entries
 *
 * @example
 * ```typescript
 * const count = await invalidateByPattern('user:*:profile', memoryCache);
 * // Invalidates all user profile entries
 * ```
 */
export declare const invalidateByPattern: (pattern: string, cache: CacheLayer) => Promise<number>;
/**
 * Implements dependency-based cache invalidation.
 *
 * @param {string} key - Primary key that changed
 * @param {Map<string, string[]>} dependencyGraph - Dependency graph
 * @param {CacheLayer} cache - Cache layer
 * @returns {Promise<string[]>} Invalidated keys
 *
 * @example
 * ```typescript
 * const graph = new Map([
 *   ['user:123', ['user:123:profile', 'user:123:settings', 'feed:123']],
 *   ['post:456', ['feed:123', 'feed:789']]
 * ]);
 *
 * const invalidated = await invalidateByDependency('user:123', graph, cache);
 * // Invalidates user:123:profile, user:123:settings, feed:123
 * ```
 */
export declare const invalidateByDependency: (key: string, dependencyGraph: Map<string, string[]>, cache: CacheLayer) => Promise<string[]>;
/**
 * Implements time-based cache invalidation with scheduled cleanup.
 *
 * @param {CacheLayer} cache - Cache layer
 * @param {number} interval - Cleanup interval in milliseconds
 * @returns {NodeJS.Timeout} Cleanup interval handle
 *
 * @example
 * ```typescript
 * const cleanup = scheduleTimeBasedInvalidation(memoryCache, 60000);
 * // Cleans up expired entries every minute
 *
 * // To stop: clearInterval(cleanup);
 * ```
 */
export declare const scheduleTimeBasedInvalidation: (cache: CacheLayer, interval: number) => NodeJS.Timeout;
/**
 * Creates a memoized version of a function with configurable options.
 *
 * @param {Function} fn - Function to memoize
 * @param {MemoizeOptions} [options] - Memoization options
 * @returns {Function} Memoized function
 *
 * @example
 * ```typescript
 * const expensiveCalculation = memoize(
 *   async (x: number, y: number) => {
 *     await new Promise(r => setTimeout(r, 1000));
 *     return x * y;
 *   },
 *   { ttl: 60000, maxSize: 100 }
 * );
 *
 * await expensiveCalculation(5, 10); // Takes 1 second
 * await expensiveCalculation(5, 10); // Instant (cached)
 * ```
 */
export declare const memoize: <T extends (...args: any[]) => any>(fn: T, options?: MemoizeOptions) => T;
/**
 * Creates a memoized async function with debouncing.
 *
 * @param {Function} fn - Async function to memoize
 * @param {number} wait - Debounce wait time in milliseconds
 * @param {MemoizeOptions} [options] - Memoization options
 * @returns {Function} Debounced memoized function
 *
 * @example
 * ```typescript
 * const searchAPI = memoizeWithDebounce(
 *   async (query: string) => await fetch(`/api/search?q=${query}`),
 *   300,
 *   { ttl: 300000 }
 * );
 *
 * // Only makes one API call for rapid successive calls
 * searchAPI('test');
 * searchAPI('test');
 * searchAPI('test');
 * ```
 */
export declare const memoizeWithDebounce: <T extends (...args: any[]) => Promise<any>>(fn: T, wait: number, options?: MemoizeOptions) => T;
/**
 * Compresses data using specified algorithm.
 *
 * @param {any} data - Data to compress
 * @param {CompressionOptions} [options] - Compression options
 * @returns {Promise<Buffer>} Compressed data
 *
 * @example
 * ```typescript
 * const compressed = await compressData(
 *   { large: 'object', with: 'lots', of: 'data' },
 *   { algorithm: 'brotli', level: 9 }
 * );
 * ```
 */
export declare const compressData: (data: any, options?: CompressionOptions) => Promise<Buffer>;
/**
 * Decompresses data using specified algorithm.
 *
 * @param {Buffer} data - Compressed data
 * @param {CompressionOptions} options - Compression options
 * @returns {Promise<any>} Decompressed data
 *
 * @example
 * ```typescript
 * const decompressed = await decompressData(compressed, { algorithm: 'brotli' });
 * ```
 */
export declare const decompressData: (data: Buffer, options: CompressionOptions) => Promise<any>;
/**
 * Determines best compression algorithm for data.
 *
 * @param {any} data - Data to analyze
 * @returns {Promise<CompressionOptions>} Recommended compression options
 *
 * @example
 * ```typescript
 * const options = await selectCompressionAlgorithm(largeDataset);
 * // Result: { algorithm: 'brotli', level: 11 }
 * ```
 */
export declare const selectCompressionAlgorithm: (data: any) => Promise<CompressionOptions>;
/**
 * Warms cache with preloaded data.
 *
 * @param {CacheWarmingStrategy} strategy - Cache warming strategy
 * @param {CacheLayer} cache - Cache layer
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<number>} Number of warmed entries
 *
 * @example
 * ```typescript
 * const warmed = await warmCache(
 *   {
 *     enabled: true,
 *     keys: ['user:123', 'user:456', 'user:789'],
 *     loader: async (key) => await db.users.findByPk(key.split(':')[1])
 *   },
 *   memoryCache,
 *   { ttl: 3600000 }
 * );
 * ```
 */
export declare const warmCache: (strategy: CacheWarmingStrategy, cache: CacheLayer, options?: CacheOptions) => Promise<number>;
/**
 * Schedules periodic cache warming.
 *
 * @param {CacheWarmingStrategy} strategy - Cache warming strategy
 * @param {CacheLayer} cache - Cache layer
 * @param {CacheOptions} [options] - Cache options
 * @returns {NodeJS.Timeout} Warming interval handle
 *
 * @example
 * ```typescript
 * const warming = scheduleCacheWarming(
 *   {
 *     enabled: true,
 *     interval: 3600000, // Every hour
 *     keys: async () => await getPopularProductIds(),
 *     loader: async (id) => await db.products.findByPk(id)
 *   },
 *   redisCache
 * );
 * ```
 */
export declare const scheduleCacheWarming: (strategy: CacheWarmingStrategy, cache: CacheLayer, options?: CacheOptions) => NodeJS.Timeout;
/**
 * Generates cache-control headers for HTTP responses.
 *
 * @param {number} maxAge - Max age in seconds
 * @param {object} [options] - Cache control options
 * @returns {string} Cache-Control header value
 *
 * @example
 * ```typescript
 * const cacheControl = generateCacheControlHeader(3600, {
 *   public: true,
 *   immutable: true
 * });
 * // Result: 'public, max-age=3600, immutable'
 * ```
 */
export declare const generateCacheControlHeader: (maxAge: number, options?: {
    public?: boolean;
    private?: boolean;
    noCache?: boolean;
    noStore?: boolean;
    immutable?: boolean;
    mustRevalidate?: boolean;
    sMaxAge?: number;
}) => string;
/**
 * Generates ETag for response content.
 *
 * @param {any} content - Response content
 * @param {boolean} [weak=false] - Whether to generate weak ETag
 * @returns {string} ETag header value
 *
 * @example
 * ```typescript
 * const etag = generateETag({ id: 123, name: 'John' });
 * // Result: '"a3f5e9b2c1d4..."'
 *
 * const weakEtag = generateETag(content, true);
 * // Result: 'W/"a3f5e9b2c1d4..."'
 * ```
 */
export declare const generateETag: (content: any, weak?: boolean) => string;
/**
 * Checks if cached response is still valid based on conditional headers.
 *
 * @param {string | undefined} ifNoneMatch - If-None-Match header value
 * @param {string | undefined} ifModifiedSince - If-Modified-Since header value
 * @param {string} etag - Current ETag
 * @param {Date} lastModified - Last modified date
 * @returns {boolean} Whether cached response is valid
 *
 * @example
 * ```typescript
 * const isValid = isCachedResponseValid(
 *   req.headers['if-none-match'],
 *   req.headers['if-modified-since'],
 *   currentEtag,
 *   lastModifiedDate
 * );
 *
 * if (isValid) {
 *   return res.status(304).send();
 * }
 * ```
 */
export declare const isCachedResponseValid: (ifNoneMatch: string | undefined, ifModifiedSince: string | undefined, etag: string, lastModified: Date) => boolean;
/**
 * Caches Sequelize query results with automatic invalidation.
 *
 * @param {Function} query - Sequelize query function
 * @param {string} cacheKey - Cache key
 * @param {CacheLayer} cache - Cache layer
 * @param {CacheOptions} [options] - Cache options
 * @returns {Promise<any>} Query results
 *
 * @example
 * ```typescript
 * const users = await cacheQueryResult(
 *   () => User.findAll({ where: { active: true } }),
 *   'users:active',
 *   redisCache,
 *   { ttl: 300000, tags: ['users'] }
 * );
 * ```
 */
export declare const cacheQueryResult: <T>(query: () => Promise<T>, cacheKey: string, cache: CacheLayer, options?: CacheOptions) => Promise<T>;
/**
 * Automatically generates cache key from Sequelize query options.
 *
 * @param {string} modelName - Model name
 * @param {any} queryOptions - Sequelize query options
 * @returns {string} Generated cache key
 *
 * @example
 * ```typescript
 * const key = generateQueryCacheKey('User', {
 *   where: { active: true, role: 'admin' },
 *   limit: 10,
 *   order: [['createdAt', 'DESC']]
 * });
 * // Result: 'query:User:hash...'
 * ```
 */
export declare const generateQueryCacheKey: (modelName: string, queryOptions: any) => string;
/**
 * Tracks cache operation metrics.
 *
 * @param {string} operation - Operation type
 * @param {boolean} hit - Whether operation was a cache hit
 * @param {number} responseTime - Response time in milliseconds
 * @param {string} keyPattern - Cache key pattern
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await trackCacheMetrics('get', true, 5.2, 'user:*', sequelize);
 * ```
 */
export declare const trackCacheMetrics: (operation: "get" | "set" | "delete" | "clear", hit: boolean, responseTime: number, keyPattern: string, sequelize: Sequelize) => Promise<void>;
/**
 * Calculates cache hit rate for a time period.
 *
 * @param {string} namespace - Cache namespace
 * @param {Date} startTime - Start time
 * @param {Date} endTime - End time
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<number>} Hit rate (0-1)
 *
 * @example
 * ```typescript
 * const hitRate = await calculateHitRate(
 *   'default',
 *   new Date(Date.now() - 3600000),
 *   new Date()
 * );
 * // Result: 0.85 (85% hit rate)
 * ```
 */
export declare const calculateHitRate: (namespace: string, startTime: Date, endTime: Date, sequelize: Sequelize) => Promise<number>;
/**
 * Generates cache performance report.
 *
 * @param {string} namespace - Cache namespace
 * @param {Date} startTime - Start time
 * @param {Date} endTime - End time
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<object>} Performance report
 *
 * @example
 * ```typescript
 * const report = await generateCacheReport(
 *   'default',
 *   new Date(Date.now() - 86400000),
 *   new Date(),
 *   sequelize
 * );
 * ```
 */
export declare const generateCacheReport: (namespace: string, startTime: Date, endTime: Date, sequelize: Sequelize) => Promise<{
    hitRate: number;
    avgResponseTime: number;
    totalOperations: number;
    operationBreakdown: Record<string, number>;
    topKeyPatterns: Array<{
        pattern: string;
        count: number;
    }>;
}>;
/**
 * Purges CDN cache for specified URLs.
 *
 * @param {string[]} urls - URLs to purge
 * @param {CDNConfig} config - CDN configuration
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await purgeCDNCache(
 *   ['https://cdn.example.com/styles.css', 'https://cdn.example.com/script.js'],
 *   {
 *     provider: 'cloudflare',
 *     endpoint: 'https://api.cloudflare.com/client/v4',
 *     apiKey: 'your-api-key',
 *     zone: 'your-zone-id'
 *   }
 * );
 * ```
 */
export declare const purgeCDNCache: (urls: string[], config: CDNConfig) => Promise<boolean>;
/**
 * Purges CDN cache by tags.
 *
 * @param {string[]} tags - Cache tags to purge
 * @param {CDNConfig} config - CDN configuration
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await purgeCDNCacheByTags(['product-images', 'user-avatars'], cdnConfig);
 * ```
 */
export declare const purgeCDNCacheByTags: (tags: string[], config: CDNConfig) => Promise<boolean>;
/**
 * Generates CDN-optimized URL with cache busting.
 *
 * @param {string} baseUrl - Base URL
 * @param {string} version - Version string for cache busting
 * @returns {string} CDN-optimized URL
 *
 * @example
 * ```typescript
 * const url = generateCDNUrl('/assets/styles.css', 'v1.2.3');
 * // Result: '/assets/styles.css?v=v1.2.3'
 * ```
 */
export declare const generateCDNUrl: (baseUrl: string, version: string) => string;
/**
 * Creates a lazy-loaded value that's computed on first access.
 *
 * @param {LazyLoadConfig<T>} config - Lazy load configuration
 * @param {CacheLayer} cache - Cache layer
 * @returns {() => Promise<T>} Lazy loader function
 *
 * @example
 * ```typescript
 * const getExpensiveData = createLazyLoader(
 *   {
 *     loader: async () => await computeExpensiveData(),
 *     cacheKey: 'expensive-data',
 *     ttl: 3600000
 *   },
 *   memoryCache
 * );
 *
 * const data = await getExpensiveData(); // Computed on first call
 * const data2 = await getExpensiveData(); // Cached
 * ```
 */
export declare const createLazyLoader: <T>(config: LazyLoadConfig<T>, cache: CacheLayer) => (() => Promise<T>);
/**
 * Implements intersection observer-based lazy loading for resources.
 *
 * @param {string[]} resourceUrls - Resource URLs to lazy load
 * @param {Function} onLoad - Callback when resource loads
 * @returns {object} Lazy loading controller
 *
 * @example
 * ```typescript
 * const lazyImages = createIntersectionLazyLoader(
 *   ['/images/photo1.jpg', '/images/photo2.jpg'],
 *   (url) => console.log(`Loaded: ${url}`)
 * );
 * ```
 */
export declare const createIntersectionLazyLoader: (resourceUrls: string[], onLoad: (url: string) => void) => {
    markAsLoaded(url: string): void;
    isLoaded(url: string): boolean;
    getPendingUrls(): string[];
};
export { CacheEntry, CacheOptions, CacheKeyConfig, CacheStats, CacheLayer, CacheInvalidationPattern, CompressionOptions, MemoizeOptions, CacheWarmingStrategy, CDNConfig, PerformanceMetrics, LazyLoadConfig, };
//# sourceMappingURL=caching-performance-kit.d.ts.map