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
/**
 * 1. Creates a method decorator for automatic caching of method results.
 *
 * @param {any} cacheManager - NestJS cache manager instance
 * @param {number} [ttl=300] - Cache TTL in seconds
 * @param {Function} [keyGenerator] - Custom cache key generator
 * @returns {MethodDecorator} Cache decorator
 * @throws {Error} If cacheManager is null or undefined
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
export declare const createCacheDecorator: (cacheManager: any, ttl?: number, keyGenerator?: (...args: any[]) => string) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
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
export declare const wrapWithCache: <T>(fn: (...args: any[]) => Promise<T>, cacheManager: any, config?: CacheConfig) => ((...args: any[]) => Promise<T>);
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
export declare const createCacheEvictDecorator: (cacheManager: any, keyPattern: string | ((...args: any[]) => string)) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
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
export declare const createConditionalCacheDecorator: (cacheManager: any, predicate: (result: any) => boolean, ttl?: number) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
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
export declare const createMultiTierCache: (cacheManagers: any[]) => {
    get(key: string): Promise<any>;
    set(key: string, value: any, ttl?: number): Promise<void>;
    del(key: string): Promise<void>;
    reset(): Promise<void>;
    wrap<T>(key: string, fn: () => Promise<T>, ttl?: number): Promise<T>;
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
export declare const createSelfCleaningCache: (cacheManager: any, cleanupInterval?: number) => {
    get(key: string): Promise<any>;
    set(key: string, value: any, ttl?: number): Promise<void>;
    del(key: string): Promise<void>;
    stopCleanup(): void;
    getStats(): CacheStats;
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
export declare const createTaggedCache: (cacheManager: any) => {
    get(key: string): Promise<any>;
    set(key: string, value: any, ttl?: number, tags?: string[]): Promise<void>;
    del(key: string): Promise<void>;
    invalidateByTag(tag: string): Promise<void>;
    invalidateByTags(tags: string[]): Promise<void>;
    getKeysByTag(tag: string): string[];
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
export declare const createAdaptiveTTLCache: (cacheManager: any, baseTTL?: number, maxTTL?: number) => {
    get(key: string): Promise<any>;
    set(key: string, value: any, ttl?: number): Promise<void>;
    del(key: string): Promise<void>;
    getAccessCount(key: string): number;
    resetAccessCounts(): void;
};
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
export declare const createRedisCache: (redisConfig: {
    host: string;
    port: number;
    password?: string;
    db?: number;
    maxRetriesPerRequest?: number;
}) => Promise<{
    get(key: string): Promise<any>;
    set(key: string, value: any, ttl?: number): Promise<void>;
    del(key: string): Promise<void>;
    mget(keys: string[]): Promise<any[]>;
    mset(entries: Array<{
        key: string;
        value: any;
        ttl?: number;
    }>): Promise<void>;
    keys(pattern: string): Promise<string[]>;
    ttl(key: string): Promise<number>;
    expire(key: string, seconds: number): Promise<void>;
    flushdb(): Promise<void>;
    disconnect(): Promise<void>;
}>;
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
export declare const createDistributedRedisCache: (redisClient: any, channel?: string) => {
    get(key: string): Promise<any>;
    set(key: string, value: any, ttl?: number): Promise<void>;
    del(key: string): Promise<void>;
    onInvalidation(callback: (key: string) => void): void;
    offInvalidation(callback: (key: string) => void): void;
    disconnect(): Promise<void>;
};
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
export declare const createLRUCache: (maxSize?: number) => {
    get(key: string): Promise<any>;
    set(key: string, value: any): Promise<void>;
    del(key: string): Promise<void>;
    reset(): Promise<void>;
    size(): number;
    keys(): string[];
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
export declare const createTTLCache: (defaultTTL?: number) => {
    get(key: string): Promise<any>;
    set(key: string, value: any, ttl?: number): Promise<void>;
    del(key: string): Promise<void>;
    reset(): Promise<void>;
    cleanupExpired(): Promise<number>;
    size(): number;
};
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
export declare const createDistributedCache: (cacheNodes: any[], hashFn?: (key: string) => number) => {
    get(key: string): Promise<any>;
    set(key: string, value: any, ttl?: number): Promise<void>;
    del(key: string): Promise<void>;
    mget(keys: string[]): Promise<any[]>;
    broadcast(fn: (node: any) => Promise<void>): Promise<void>;
    flushAll(): Promise<void>;
};
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
export declare const invalidateCacheByPattern: (cacheManager: any, pattern: string) => Promise<number>;
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
export declare const createCascadeInvalidation: (cacheManager: any, dependencies: Map<string, string[]>) => {
    invalidate(key: string): Promise<void>;
    addDependency(key: string, dependentPattern: string): void;
    removeDependency(key: string, dependentPattern: string): void;
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
export declare const createBatchInvalidation: (cacheManager: any, batchInterval?: number) => {
    scheduleInvalidation(key: string): void;
    flushNow(): Promise<void>;
    getPendingCount(): number;
    stop(): void;
};
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
export declare const warmCache: (cacheManager: any, options: CacheWarmingOptions) => Promise<number>;
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
export declare const preloadCache: (cacheManager: any, dataLoader: () => Promise<Record<string, any>>) => Promise<void>;
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
export declare const cacheAsidePattern: <T>(cacheManager: any, dataLoader: (key: string) => Promise<T>, ttl?: number) => (key: string) => Promise<T>;
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
export declare const writeThroughPattern: <T>(cacheManager: any, dataSaver: (key: string, data: T) => Promise<T>, ttl?: number) => (key: string, data: T) => Promise<T>;
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
export declare const writeBehindPattern: (cacheManager: any, dataSaver: (entries: Array<{
    key: string;
    value: any;
}>) => Promise<void>, flushInterval?: number) => {
    get(key: string): Promise<any>;
    set(key: string, value: any, ttl?: number): Promise<void>;
    flushNow(): Promise<void>;
    stop(): void;
    getPendingWriteCount(): number;
};
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
export declare const preventCacheStampede: <T>(cacheManager: any, dataLoader: (key: string) => Promise<T>, ttl?: number) => (key: string) => Promise<T>;
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
export declare const probabilisticEarlyExpiration: <T>(cacheManager: any, dataLoader: (key: string) => Promise<T>, ttl?: number, beta?: number) => (key: string) => Promise<T>;
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
export declare const generateCacheKey: (prefix: string, options?: CacheKeyOptions) => (...args: any[]) => string;
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
export declare const hashCacheKey: (prefix: string, obj: any, algorithm?: string) => string;
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
export declare const namespacedCacheKey: (namespace: string, tenant?: string) => (...parts: any[]) => string;
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
export declare const dynamicTTL: (calculator: (data: any) => number) => (data: any) => number;
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
export declare const timeBasedTTL: (schedule: Record<string, number>) => () => number;
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
export declare const compress: (data: any, options?: CompressionOptions) => Promise<any>;
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
export declare const decompress: (compressedData: any) => Promise<any>;
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
export declare const serializeForCache: (data: any) => string;
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
export declare const deserializeFromCache: (serialized: string) => any;
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
export declare const memoize: <T extends (...args: any[]) => any>(fn: T, options?: MemoizeOptions) => T;
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
export declare const memoizeAsync: <T extends (...args: any[]) => Promise<any>>(fn: T, options?: MemoizeOptions) => T;
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
export declare const generateHttpCacheHeaders: (options: HttpCacheOptions) => Record<string, string>;
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
export declare const createResponseCacheMiddleware: (cacheManager: any, ttl?: number) => (req: any, res: any, next: any) => Promise<any>;
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
export declare const generateETag: (data: any, options?: ETagOptions) => string;
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
export declare const validateETag: (requestETag: string, currentData: any) => boolean;
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
export declare const createETagInterceptor: (options?: ETagOptions) => (req: any, res: any, next: any) => void;
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
export declare const cacheQueryResult: <T>(cacheManager: any, queryFn: () => Promise<T>, cacheKey: string, ttl?: number) => Promise<T>;
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
export declare const createQueryCache: (cacheManager: any) => {
    execute<T>(key: string, queryFn: () => Promise<T>, options?: {
        ttl?: number;
        dependencies?: string[];
    }): Promise<T>;
    invalidateDependency(dependency: string): Promise<void>;
};
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
export declare const createCacheStatsCollector: (cacheManager: any) => {
    getStats(): CacheStats;
    reset(): void;
    recordHit(key: string): void;
    recordMiss(key: string): void;
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
export declare const createCachePerformanceMonitor: (cacheManager: any, reportInterval?: number) => {
    getMetrics(): {
        operations: number;
        totalLatency: number;
        errors: number;
        avgLatency: number;
    };
    onReport(callback: (metrics: any) => void): void;
    stop(): void;
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
export declare const createCacheHealthCheck: (cacheManager: any, threshold?: number) => () => Promise<{
    healthy: boolean;
    hitRate: number;
    stats: CacheStats;
    issues: string[];
}>;
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
export declare const createCacheSizeMonitor: (cacheManager: any, maxSizeBytes: number, onThreshold?: (currentSize: number) => void) => {
    getCurrentSize(): number;
    getMaxSize(): number;
    getUtilization(): number;
    isOverThreshold(): boolean;
};
export {};
//# sourceMappingURL=nestjs-caching-performance-kit.d.ts.map