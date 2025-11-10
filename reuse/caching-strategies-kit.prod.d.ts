/**
 * LOC: CACHE-STRAT-2024
 * File: /reuse/caching-strategies-kit.prod.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend services and controllers
 *   - API gateway implementations
 *   - Database access layers
 *   - NestJS modules
 */
/**
 * File: /reuse/caching-strategies-kit.prod.ts
 * Locator: WC-UTL-CACHE-STRAT-001
 * Purpose: Production-Grade Caching Strategies - Multi-level, distributed, and intelligent caching
 *
 * Upstream: Independent utility module for advanced caching strategies
 * Downstream: ../backend/*, services, controllers, database layers, NestJS modules
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Redis 7.x, Sequelize 6.x, Zod 3.x
 * Exports: 48 utility functions for caching strategies, invalidation, distributed caching, monitoring
 *
 * LLM Context: Production-grade caching strategies for White Cross healthcare system.
 * Provides multi-level caching (L1 memory/LRU, L2 Redis, L3 database), cache invalidation patterns,
 * distributed caching, cache-aside/write-through/write-back/read-through patterns, TTL management,
 * cache warming, compression, serialization, NestJS interceptors, Sequelize hooks, and monitoring.
 */
import { Model, Sequelize, Optional, ModelStatic } from 'sequelize';
import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
/**
 * Zod schema for cache configuration validation
 */
export declare const CacheConfigSchema: any;
/**
 * Zod schema for cache key configuration
 */
export declare const CacheKeyConfigSchema: any;
/**
 * Zod schema for cache invalidation rules
 */
export declare const CacheInvalidationRuleSchema: any;
/**
 * Zod schema for distributed cache configuration
 */
export declare const DistributedCacheConfigSchema: any;
export interface CacheEntry<T = any> {
    key: string;
    value: T;
    ttl: number;
    createdAt: number;
    expiresAt: number;
    lastAccessedAt: number;
    accessCount: number;
    tags?: string[];
    metadata?: Record<string, any>;
    size: number;
    compressed: boolean;
    layer: 'L1' | 'L2' | 'L3';
}
export interface CacheOptions {
    ttl?: number;
    tags?: string[];
    namespace?: string;
    compress?: boolean;
    compressionThreshold?: number;
    metadata?: Record<string, any>;
    priority?: 'low' | 'medium' | 'high' | 'critical';
}
export interface CacheKeyConfig {
    prefix?: string;
    namespace?: string;
    separator?: string;
    includeVersion?: boolean;
    version?: string;
    includeTimestamp?: boolean;
}
export interface CacheStats {
    hits: number;
    misses: number;
    sets: number;
    deletes: number;
    evictions: number;
    size: number;
    hitRate: number;
    missRate: number;
    avgResponseTime: number;
    memoryUsage: number;
    l1Stats?: LayerStats;
    l2Stats?: LayerStats;
    l3Stats?: LayerStats;
}
export interface LayerStats {
    hits: number;
    misses: number;
    size: number;
    hitRate: number;
    avgResponseTime: number;
}
export interface CacheLayer<T = any> {
    name: string;
    priority: number;
    maxSize?: number;
    get(key: string): Promise<T | null>;
    set(key: string, value: T, options?: CacheOptions): Promise<void>;
    delete(key: string): Promise<void>;
    clear(): Promise<void>;
    has(key: string): Promise<boolean>;
    size(): Promise<number>;
}
export interface CacheInvalidationRule {
    pattern: string;
    strategy: 'immediate' | 'lazy' | 'scheduled' | 'ttl-based';
    delay?: number;
    condition?: (entry: CacheEntry) => boolean;
}
export interface CacheWarmingStrategy {
    enabled: boolean;
    interval?: number;
    priority?: 'low' | 'medium' | 'high';
    keys: string[] | (() => Promise<string[]>);
    loader: (key: string) => Promise<any>;
    onError?: (key: string, error: Error) => void;
}
export interface CompressionOptions {
    algorithm: 'gzip' | 'brotli' | 'deflate';
    level?: number;
    threshold?: number;
}
export interface SerializationOptions {
    format: 'json' | 'msgpack' | 'avro' | 'protobuf';
    schema?: any;
}
export interface DistributedCacheConfig {
    nodes: Array<{
        host: string;
        port: number;
        weight?: number;
    }>;
    replicationFactor?: number;
    consistencyLevel?: 'one' | 'quorum' | 'all';
    partitionStrategy?: 'hash' | 'consistent-hash' | 'range';
}
export interface CachePolicyConfig {
    evictionPolicy: 'lru' | 'lfu' | 'fifo' | 'lifo' | 'ttl';
    maxSize: number;
    maxMemory?: number;
    ttl?: number;
}
interface CacheEntryAttributes {
    id: number;
    key: string;
    value: Buffer;
    namespace: string;
    ttl: number;
    expiresAt: Date;
    lastAccessedAt: Date;
    accessCount: number;
    tags: string[];
    metadata: Record<string, any>;
    size: number;
    compressed: boolean;
    compressionAlgorithm: string | null;
    priority: 'low' | 'medium' | 'high' | 'critical';
    createdAt: Date;
    updatedAt: Date;
}
interface CacheEntryCreationAttributes extends Optional<CacheEntryAttributes, 'id' | 'createdAt' | 'updatedAt'> {
}
/**
 * Sequelize model for persistent cache entries in L3 layer
 */
export declare class CacheEntryModel extends Model<CacheEntryAttributes, CacheEntryCreationAttributes> implements CacheEntryAttributes {
    id: number;
    key: string;
    value: Buffer;
    namespace: string;
    ttl: number;
    expiresAt: Date;
    lastAccessedAt: Date;
    accessCount: number;
    tags: string[];
    metadata: Record<string, any>;
    size: number;
    compressed: boolean;
    compressionAlgorithm: string | null;
    priority: 'low' | 'medium' | 'high' | 'critical';
    createdAt: Date;
    updatedAt: Date;
    static initModel(sequelize: Sequelize): typeof CacheEntryModel;
}
interface CacheInvalidationLogAttributes {
    id: number;
    namespace: string;
    pattern: string;
    strategy: string;
    invalidatedKeys: string[];
    invalidatedCount: number;
    reason: string;
    triggeredBy: string;
    metadata: Record<string, any>;
    createdAt: Date;
}
interface CacheInvalidationLogCreationAttributes extends Optional<CacheInvalidationLogAttributes, 'id' | 'createdAt'> {
}
/**
 * Sequelize model for cache invalidation audit log
 */
export declare class CacheInvalidationLogModel extends Model<CacheInvalidationLogAttributes, CacheInvalidationLogCreationAttributes> implements CacheInvalidationLogAttributes {
    id: number;
    namespace: string;
    pattern: string;
    strategy: string;
    invalidatedKeys: string[];
    invalidatedCount: number;
    reason: string;
    triggeredBy: string;
    metadata: Record<string, any>;
    createdAt: Date;
    static initModel(sequelize: Sequelize): typeof CacheInvalidationLogModel;
}
/**
 * Production-grade LRU (Least Recently Used) cache implementation.
 * Provides O(1) get, set, and delete operations using hash map + doubly-linked list.
 *
 * @template T - Type of cached values
 *
 * @example
 * ```typescript
 * const cache = new LRUCache<User>({ maxSize: 1000, ttl: 300000 });
 * await cache.set('user:123', userData, { ttl: 600000 });
 * const user = await cache.get('user:123');
 * ```
 */
export declare class LRUCache<T = any> implements CacheLayer<T> {
    private config;
    name: string;
    priority: number;
    private cache;
    private head;
    private tail;
    private stats;
    constructor(config: CachePolicyConfig);
    /**
     * Gets a value from the LRU cache and updates access order
     */
    get(key: string): Promise<T | null>;
    /**
     * Sets a value in the LRU cache with automatic eviction if needed
     */
    set(key: string, value: T, options?: CacheOptions): Promise<void>;
    /**
     * Deletes a value from the LRU cache
     */
    delete(key: string): Promise<void>;
    /**
     * Clears all entries from the cache
     */
    clear(): Promise<void>;
    /**
     * Checks if a key exists in the cache
     */
    has(key: string): Promise<boolean>;
    /**
     * Returns the current size of the cache
     */
    size(): Promise<number>;
    /**
     * Gets cache statistics
     */
    getStats(): CacheStats;
    private moveToHead;
    private addToHead;
    private removeNode;
    private evictLRU;
    private estimateSize;
    private updateStats;
}
/**
 * Generates a deterministic cache key from arguments with version support.
 *
 * @param {CacheKeyConfig} config - Cache key configuration
 * @param {...any[]} args - Arguments to include in key
 * @returns {string} Generated cache key
 *
 * @example
 * ```typescript
 * const key = generateCacheKey(
 *   { prefix: 'user', namespace: 'auth', version: 'v2' },
 *   'getUserById',
 *   123
 * );
 * // Result: 'auth:user:v2:getUserById:123'
 * ```
 */
export declare const generateCacheKey: (config: CacheKeyConfig, ...args: any[]) => string;
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
 * ```
 */
export declare const generateHashKey: (config: CacheKeyConfig, obj: Record<string, any>) => string;
/**
 * Hashes an object to create a deterministic fingerprint.
 *
 * @param {any} obj - Object to hash
 * @returns {string} SHA-256 hash
 */
export declare const hashObject: (obj: any) => string;
/**
 * Generates a wildcard pattern for cache key matching.
 *
 * @param {CacheKeyConfig} config - Cache key configuration
 * @param {string} pattern - Pattern with wildcards (*)
 * @returns {RegExp} Regular expression for matching
 *
 * @example
 * ```typescript
 * const pattern = generateKeyPattern({ namespace: 'users' }, 'user:*:profile');
 * // Matches: users:user:123:profile, users:user:456:profile, etc.
 * ```
 */
export declare const generateKeyPattern: (config: CacheKeyConfig, pattern: string) => RegExp;
/**
 * Compresses data using specified algorithm.
 *
 * @param {any} data - Data to compress
 * @param {CompressionOptions} options - Compression options
 * @returns {Promise<Buffer>} Compressed data
 *
 * @example
 * ```typescript
 * const compressed = await compressData(largeObject, {
 *   algorithm: 'brotli',
 *   level: 6,
 *   threshold: 1024
 * });
 * ```
 */
export declare const compressData: (data: any, options?: CompressionOptions) => Promise<Buffer>;
/**
 * Decompresses data using specified algorithm.
 *
 * @param {Buffer} compressed - Compressed data
 * @param {CompressionOptions} options - Decompression options
 * @returns {Promise<any>} Decompressed data
 *
 * @example
 * ```typescript
 * const data = await decompressData(compressedBuffer, { algorithm: 'brotli' });
 * ```
 */
export declare const decompressData: (compressed: Buffer, options?: CompressionOptions) => Promise<any>;
/**
 * Serializes data with optional schema validation.
 *
 * @param {any} data - Data to serialize
 * @param {SerializationOptions} options - Serialization options
 * @returns {Buffer} Serialized data
 *
 * @example
 * ```typescript
 * const serialized = serializeData(userData, { format: 'json' });
 * ```
 */
export declare const serializeData: (data: any, options?: SerializationOptions) => Buffer;
/**
 * Deserializes data with optional schema validation.
 *
 * @param {Buffer} buffer - Serialized data
 * @param {SerializationOptions} options - Deserialization options
 * @returns {any} Deserialized data
 *
 * @example
 * ```typescript
 * const data = deserializeData(buffer, { format: 'json' });
 * ```
 */
export declare const deserializeData: (buffer: Buffer, options?: SerializationOptions) => any;
/**
 * Multi-level cache manager with L1 (memory), L2 (Redis), and L3 (database) layers.
 * Implements automatic promotion/demotion between layers.
 *
 * @example
 * ```typescript
 * const cacheManager = new MultiLevelCacheManager([l1Cache, l2Cache, l3Cache]);
 * await cacheManager.set('user:123', userData, { ttl: 300000 });
 * const data = await cacheManager.get('user:123');
 * ```
 */
export declare class MultiLevelCacheManager {
    private layers;
    private compressionOptions?;
    private stats;
    constructor(layers: CacheLayer[], compressionOptions?: CompressionOptions | undefined);
    /**
     * Gets a value from the cache, checking all layers in order.
     * Promotes cache hits to higher layers.
     */
    get<T>(key: string): Promise<T | null>;
    /**
     * Sets a value in all cache layers.
     */
    set<T>(key: string, value: T, options?: CacheOptions): Promise<void>;
    /**
     * Deletes a value from all cache layers.
     */
    delete(key: string): Promise<void>;
    /**
     * Clears all cache layers.
     */
    clear(): Promise<void>;
    /**
     * Gets aggregate statistics from all cache layers.
     */
    getStats(): Record<string, LayerStats>;
    private updateLayerStats;
}
/**
 * Cache-aside pattern implementation.
 * Application code is responsible for loading data on cache miss.
 *
 * @template T - Type of cached data
 * @param {string} key - Cache key
 * @param {() => Promise<T>} loader - Function to load data on cache miss
 * @param {CacheLayer} cache - Cache layer to use
 * @param {CacheOptions} options - Cache options
 * @returns {Promise<T>} Cached or loaded data
 *
 * @example
 * ```typescript
 * const user = await cacheAside(
 *   'user:123',
 *   async () => await userRepository.findById(123),
 *   l1Cache,
 *   { ttl: 300000 }
 * );
 * ```
 */
export declare const cacheAside: <T>(key: string, loader: () => Promise<T>, cache: CacheLayer, options?: CacheOptions) => Promise<T>;
/**
 * Write-through pattern implementation.
 * Writes data to cache and database synchronously.
 *
 * @template T - Type of data to write
 * @param {string} key - Cache key
 * @param {T} data - Data to write
 * @param {(data: T) => Promise<void>} writer - Function to write to database
 * @param {CacheLayer} cache - Cache layer to use
 * @param {CacheOptions} options - Cache options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await writeThrough(
 *   'user:123',
 *   userData,
 *   async (data) => await userRepository.save(data),
 *   l1Cache,
 *   { ttl: 300000 }
 * );
 * ```
 */
export declare const writeThrough: <T>(key: string, data: T, writer: (data: T) => Promise<void>, cache: CacheLayer, options?: CacheOptions) => Promise<void>;
/**
 * Write-back (write-behind) pattern implementation.
 * Writes to cache immediately and database asynchronously.
 *
 * @template T - Type of data to write
 * @param {string} key - Cache key
 * @param {T} data - Data to write
 * @param {(data: T) => Promise<void>} writer - Function to write to database
 * @param {CacheLayer} cache - Cache layer to use
 * @param {CacheOptions} options - Cache options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await writeBack(
 *   'user:123',
 *   userData,
 *   async (data) => await userRepository.save(data),
 *   l1Cache,
 *   { ttl: 300000 }
 * );
 * ```
 */
export declare const writeBack: <T>(key: string, data: T, writer: (data: T) => Promise<void>, cache: CacheLayer, options?: CacheOptions) => Promise<void>;
/**
 * Read-through pattern implementation.
 * Cache automatically loads data on miss.
 *
 * @template T - Type of cached data
 * @param {string} key - Cache key
 * @param {() => Promise<T>} loader - Function to load data on cache miss
 * @param {CacheLayer} cache - Cache layer to use
 * @param {CacheOptions} options - Cache options
 * @returns {Promise<T>} Cached or loaded data
 *
 * @example
 * ```typescript
 * const user = await readThrough(
 *   'user:123',
 *   async () => await userRepository.findById(123),
 *   l1Cache,
 *   { ttl: 300000 }
 * );
 * ```
 */
export declare const readThrough: <T>(key: string, loader: () => Promise<T>, cache: CacheLayer, options?: CacheOptions) => Promise<T>;
/**
 * Refresh-ahead pattern implementation.
 * Proactively refreshes cache before expiration.
 *
 * @template T - Type of cached data
 * @param {string} key - Cache key
 * @param {() => Promise<T>} loader - Function to load data
 * @param {CacheLayer} cache - Cache layer to use
 * @param {CacheOptions & { refreshThreshold: number }} options - Cache options with refresh threshold
 * @returns {Promise<T>} Cached data
 *
 * @example
 * ```typescript
 * const user = await refreshAhead(
 *   'user:123',
 *   async () => await userRepository.findById(123),
 *   l1Cache,
 *   { ttl: 300000, refreshThreshold: 0.8 }
 * );
 * ```
 */
export declare const refreshAhead: <T>(key: string, loader: () => Promise<T>, cache: CacheLayer, options?: CacheOptions & {
    refreshThreshold?: number;
}) => Promise<T>;
/**
 * Invalidates cache entries matching a pattern.
 *
 * @param {string} pattern - Pattern to match (supports wildcards)
 * @param {CacheLayer[]} layers - Cache layers to invalidate
 * @param {CacheInvalidationRule} rule - Invalidation rule
 * @returns {Promise<number>} Number of invalidated entries
 *
 * @example
 * ```typescript
 * const count = await invalidateByPattern('user:*', [l1Cache, l2Cache], {
 *   strategy: 'immediate',
 *   pattern: 'user:*'
 * });
 * ```
 */
export declare const invalidateByPattern: (pattern: string, layers: CacheLayer[], rule: CacheInvalidationRule) => Promise<number>;
/**
 * Invalidates cache entries by tags.
 *
 * @param {string[]} tags - Tags to match
 * @param {CacheLayer[]} layers - Cache layers to invalidate
 * @returns {Promise<number>} Number of invalidated entries
 *
 * @example
 * ```typescript
 * const count = await invalidateByTags(['user', 'profile'], [l1Cache, l2Cache]);
 * ```
 */
export declare const invalidateByTags: (tags: string[], layers: CacheLayer[]) => Promise<number>;
/**
 * Invalidates cache entries based on a dependency graph.
 *
 * @param {string} key - Key that changed
 * @param {Map<string, string[]>} dependencyGraph - Dependency graph
 * @param {CacheLayer[]} layers - Cache layers to invalidate
 * @returns {Promise<string[]>} Invalidated keys
 *
 * @example
 * ```typescript
 * const graph = new Map([
 *   ['user:123', ['user:123:profile', 'user:123:settings']],
 * ]);
 * const invalidated = await invalidateByDependency('user:123', graph, [l1Cache]);
 * ```
 */
export declare const invalidateByDependency: (key: string, dependencyGraph: Map<string, string[]>, layers: CacheLayer[]) => Promise<string[]>;
/**
 * Time-based cache invalidation with configurable intervals.
 *
 * @param {CacheLayer[]} layers - Cache layers to manage
 * @param {number} interval - Check interval in milliseconds
 * @returns {NodeJS.Timer} Interval timer
 *
 * @example
 * ```typescript
 * const timer = invalidateExpired([l1Cache, l2Cache, l3Cache], 60000);
 * ```
 */
export declare const invalidateExpired: (layers: CacheLayer[], interval?: number) => NodeJS.Timer;
/**
 * Warms the cache by preloading frequently accessed data.
 *
 * @param {CacheWarmingStrategy} strategy - Warming strategy configuration
 * @param {CacheLayer} cache - Cache layer to warm
 * @returns {Promise<number>} Number of warmed entries
 *
 * @example
 * ```typescript
 * const warmed = await warmCache({
 *   enabled: true,
 *   keys: ['user:123', 'user:456'],
 *   loader: async (key) => await userRepository.findById(key.split(':')[1])
 * }, l1Cache);
 * ```
 */
export declare const warmCache: (strategy: CacheWarmingStrategy, cache: CacheLayer) => Promise<number>;
/**
 * Schedules periodic cache warming.
 *
 * @param {CacheWarmingStrategy} strategy - Warming strategy configuration
 * @param {CacheLayer} cache - Cache layer to warm
 * @returns {NodeJS.Timer} Interval timer
 *
 * @example
 * ```typescript
 * const timer = scheduleWarmCache({
 *   enabled: true,
 *   interval: 300000, // 5 minutes
 *   keys: async () => await getFrequentlyAccessedKeys(),
 *   loader: async (key) => await loadData(key)
 * }, l1Cache);
 * ```
 */
export declare const scheduleWarmCache: (strategy: CacheWarmingStrategy, cache: CacheLayer) => NodeJS.Timer;
/**
 * Predictive cache warming based on access patterns.
 *
 * @param {Map<string, number>} accessPatterns - Access frequency map
 * @param {(key: string) => Promise<any>} loader - Data loader function
 * @param {CacheLayer} cache - Cache layer to warm
 * @param {number} threshold - Minimum access count to warm
 * @returns {Promise<number>} Number of warmed entries
 *
 * @example
 * ```typescript
 * const patterns = new Map([['user:123', 150], ['user:456', 80]]);
 * const warmed = await predictiveWarmCache(
 *   patterns,
 *   async (key) => await loadData(key),
 *   l1Cache,
 *   100
 * );
 * ```
 */
export declare const predictiveWarmCache: (accessPatterns: Map<string, number>, loader: (key: string) => Promise<any>, cache: CacheLayer, threshold?: number) => Promise<number>;
/**
 * Calculates adaptive TTL based on access patterns.
 *
 * @param {number} accessCount - Number of times accessed
 * @param {number} baseTTL - Base TTL in milliseconds
 * @param {number} maxTTL - Maximum TTL in milliseconds
 * @returns {number} Calculated TTL
 *
 * @example
 * ```typescript
 * const ttl = calculateAdaptiveTTL(150, 300000, 3600000);
 * // Returns higher TTL for frequently accessed items
 * ```
 */
export declare const calculateAdaptiveTTL: (accessCount: number, baseTTL?: number, maxTTL?: number) => number;
/**
 * Extends TTL for a cache entry on access.
 *
 * @param {string} key - Cache key
 * @param {CacheLayer} cache - Cache layer
 * @param {number} extensionTime - Time to extend in milliseconds
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await extendTTL('user:123', l1Cache, 300000);
 * ```
 */
export declare const extendTTL: (key: string, cache: CacheLayer, extensionTime: number) => Promise<boolean>;
/**
 * Implements sliding expiration (TTL resets on access).
 *
 * @template T - Type of cached data
 * @param {string} key - Cache key
 * @param {CacheLayer} cache - Cache layer
 * @param {number} ttl - TTL in milliseconds
 * @returns {Promise<T | null>} Cached value
 *
 * @example
 * ```typescript
 * const user = await slidingExpiration('user:123', l1Cache, 300000);
 * ```
 */
export declare const slidingExpiration: <T>(key: string, cache: CacheLayer, ttl: number) => Promise<T | null>;
/**
 * NestJS interceptor for automatic HTTP response caching.
 *
 * @example
 * ```typescript
 * @UseInterceptors(new CacheInterceptor(cacheManager, { ttl: 300000 }))
 * @Get('users/:id')
 * async getUser(@Param('id') id: string) {
 *   return await this.userService.findById(id);
 * }
 * ```
 */
export declare class CacheInterceptor implements NestInterceptor {
    private readonly cacheManager;
    private readonly options;
    constructor(cacheManager: MultiLevelCacheManager, options?: CacheOptions);
    intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>>;
    private generateKeyFromRequest;
}
/**
 * NestJS interceptor for cache invalidation on mutations.
 *
 * @example
 * ```typescript
 * @UseInterceptors(new CacheInvalidationInterceptor(cacheManager, 'user:*'))
 * @Put('users/:id')
 * async updateUser(@Param('id') id: string, @Body() data: UpdateUserDto) {
 *   return await this.userService.update(id, data);
 * }
 * ```
 */
export declare class CacheInvalidationInterceptor implements NestInterceptor {
    private readonly cacheManager;
    private readonly pattern;
    constructor(cacheManager: MultiLevelCacheManager, pattern: string);
    intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>>;
}
/**
 * Creates Sequelize hooks for automatic cache invalidation on model changes.
 *
 * @param {ModelStatic<Model>} model - Sequelize model
 * @param {MultiLevelCacheManager} cacheManager - Cache manager
 * @param {(instance: any) => string} keyGenerator - Function to generate cache key from instance
 *
 * @example
 * ```typescript
 * setupCacheInvalidationHooks(
 *   UserModel,
 *   cacheManager,
 *   (user) => `user:${user.id}`
 * );
 * ```
 */
export declare const setupCacheInvalidationHooks: (model: ModelStatic<Model>, cacheManager: MultiLevelCacheManager, keyGenerator: (instance: any) => string) => void;
/**
 * Creates Sequelize hooks for cache warming on model creation.
 *
 * @param {ModelStatic<Model>} model - Sequelize model
 * @param {MultiLevelCacheManager} cacheManager - Cache manager
 * @param {(instance: any) => string} keyGenerator - Function to generate cache key
 * @param {CacheOptions} options - Cache options
 *
 * @example
 * ```typescript
 * setupCacheWarmingHooks(
 *   UserModel,
 *   cacheManager,
 *   (user) => `user:${user.id}`,
 *   { ttl: 300000 }
 * );
 * ```
 */
export declare const setupCacheWarmingHooks: (model: ModelStatic<Model>, cacheManager: MultiLevelCacheManager, keyGenerator: (instance: any) => string, options?: CacheOptions) => void;
/**
 * Creates comprehensive Sequelize hooks for cache management.
 *
 * @param {ModelStatic<Model>} model - Sequelize model
 * @param {MultiLevelCacheManager} cacheManager - Cache manager
 * @param {object} config - Hook configuration
 *
 * @example
 * ```typescript
 * setupComprehensiveCacheHooks(UserModel, cacheManager, {
 *   keyGenerator: (user) => `user:${user.id}`,
 *   warmOnCreate: true,
 *   invalidateOnUpdate: true,
 *   options: { ttl: 300000 }
 * });
 * ```
 */
export declare const setupComprehensiveCacheHooks: (model: ModelStatic<Model>, cacheManager: MultiLevelCacheManager, config: {
    keyGenerator: (instance: any) => string;
    warmOnCreate?: boolean;
    invalidateOnUpdate?: boolean;
    invalidateOnDelete?: boolean;
    options?: CacheOptions;
}) => void;
/**
 * Consistent hashing for distributed cache key distribution.
 *
 * @param {string} key - Cache key
 * @param {DistributedCacheConfig} config - Distributed cache configuration
 * @returns {number} Node index
 *
 * @example
 * ```typescript
 * const nodeIndex = consistentHash('user:123', {
 *   nodes: [
 *     { host: 'cache1.example.com', port: 6379 },
 *     { host: 'cache2.example.com', port: 6379 }
 *   ]
 * });
 * ```
 */
export declare const consistentHash: (key: string, config: DistributedCacheConfig) => number;
/**
 * Distributes cache operations across multiple nodes.
 *
 * @template T - Type of cached data
 * @param {string} key - Cache key
 * @param {DistributedCacheConfig} config - Distributed cache configuration
 * @param {CacheLayer[]} nodes - Cache nodes
 * @returns {CacheLayer} Selected cache node
 *
 * @example
 * ```typescript
 * const node = selectCacheNode('user:123', config, cacheNodes);
 * await node.set('user:123', userData);
 * ```
 */
export declare const selectCacheNode: (key: string, config: DistributedCacheConfig, nodes: CacheLayer[]) => CacheLayer;
/**
 * Replicates cache data across multiple nodes for high availability.
 *
 * @template T - Type of cached data
 * @param {string} key - Cache key
 * @param {T} value - Value to cache
 * @param {CacheLayer[]} nodes - Cache nodes
 * @param {number} replicationFactor - Number of replicas
 * @param {CacheOptions} options - Cache options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await replicateCacheData('user:123', userData, cacheNodes, 3, { ttl: 300000 });
 * ```
 */
export declare const replicateCacheData: <T>(key: string, value: T, nodes: CacheLayer[], replicationFactor?: number, options?: CacheOptions) => Promise<void>;
/**
 * Collects comprehensive cache metrics for monitoring.
 *
 * @param {CacheLayer[]} layers - Cache layers to monitor
 * @returns {Promise<CacheStats>} Aggregate cache statistics
 *
 * @example
 * ```typescript
 * const stats = await collectCacheMetrics([l1Cache, l2Cache, l3Cache]);
 * console.log(`Hit rate: ${stats.hitRate * 100}%`);
 * ```
 */
export declare const collectCacheMetrics: (layers: CacheLayer[]) => Promise<CacheStats>;
/**
 * Exports cache statistics in Prometheus format.
 *
 * @param {CacheStats} stats - Cache statistics
 * @param {string} namespace - Metric namespace
 * @returns {string} Prometheus metrics
 *
 * @example
 * ```typescript
 * const metrics = exportPrometheusMetrics(stats, 'white_cross_cache');
 * ```
 */
export declare const exportPrometheusMetrics: (stats: CacheStats, namespace?: string) => string;
/**
 * Creates a cache health check function.
 *
 * @param {CacheLayer[]} layers - Cache layers to check
 * @returns {() => Promise<{ healthy: boolean; details: any }>} Health check function
 *
 * @example
 * ```typescript
 * const healthCheck = createCacheHealthCheck([l1Cache, l2Cache]);
 * const health = await healthCheck();
 * ```
 */
export declare const createCacheHealthCheck: (layers: CacheLayer[]) => (() => Promise<{
    healthy: boolean;
    details: any;
}>);
/**
 * Memoizes a function with automatic cache management.
 *
 * @template T - Return type of function
 * @param {(...args: any[]) => Promise<T>} fn - Function to memoize
 * @param {CacheLayer} cache - Cache layer to use
 * @param {object} options - Memoization options
 * @returns {(...args: any[]) => Promise<T>} Memoized function
 *
 * @example
 * ```typescript
 * const memoizedGetUser = memoize(
 *   async (id: string) => await userRepository.findById(id),
 *   l1Cache,
 *   { ttl: 300000, keyPrefix: 'user' }
 * );
 * ```
 */
export declare const memoize: <T>(fn: (...args: any[]) => Promise<T>, cache: CacheLayer, options?: {
    ttl?: number;
    keyPrefix?: string;
    keyGenerator?: (...args: any[]) => string;
}) => ((...args: any[]) => Promise<T>);
/**
 * Batches cache operations for better performance.
 *
 * @template T - Type of cached data
 * @param {Array<{ key: string; value: T }>} operations - Batch operations
 * @param {CacheLayer} cache - Cache layer
 * @param {CacheOptions} options - Cache options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await batchSet([
 *   { key: 'user:1', value: user1 },
 *   { key: 'user:2', value: user2 }
 * ], l1Cache, { ttl: 300000 });
 * ```
 */
export declare const batchSet: <T>(operations: Array<{
    key: string;
    value: T;
}>, cache: CacheLayer, options?: CacheOptions) => Promise<void>;
/**
 * Batches cache get operations.
 *
 * @template T - Type of cached data
 * @param {string[]} keys - Cache keys
 * @param {CacheLayer} cache - Cache layer
 * @returns {Promise<Map<string, T | null>>} Map of keys to values
 *
 * @example
 * ```typescript
 * const results = await batchGet(['user:1', 'user:2'], l1Cache);
 * ```
 */
export declare const batchGet: <T>(keys: string[], cache: CacheLayer) => Promise<Map<string, T | null>>;
declare const _default: {
    LRUCache: typeof LRUCache;
    MultiLevelCacheManager: typeof MultiLevelCacheManager;
    CacheInterceptor: typeof CacheInterceptor;
    CacheInvalidationInterceptor: typeof CacheInvalidationInterceptor;
    CacheEntryModel: typeof CacheEntryModel;
    CacheInvalidationLogModel: typeof CacheInvalidationLogModel;
    generateCacheKey: (config: CacheKeyConfig, ...args: any[]) => string;
    generateHashKey: (config: CacheKeyConfig, obj: Record<string, any>) => string;
    hashObject: (obj: any) => string;
    generateKeyPattern: (config: CacheKeyConfig, pattern: string) => RegExp;
    compressData: (data: any, options?: CompressionOptions) => Promise<Buffer>;
    decompressData: (compressed: Buffer, options?: CompressionOptions) => Promise<any>;
    serializeData: (data: any, options?: SerializationOptions) => Buffer;
    deserializeData: (buffer: Buffer, options?: SerializationOptions) => any;
    cacheAside: <T>(key: string, loader: () => Promise<T>, cache: CacheLayer, options?: CacheOptions) => Promise<T>;
    writeThrough: <T>(key: string, data: T, writer: (data: T) => Promise<void>, cache: CacheLayer, options?: CacheOptions) => Promise<void>;
    writeBack: <T>(key: string, data: T, writer: (data: T) => Promise<void>, cache: CacheLayer, options?: CacheOptions) => Promise<void>;
    readThrough: <T>(key: string, loader: () => Promise<T>, cache: CacheLayer, options?: CacheOptions) => Promise<T>;
    refreshAhead: <T>(key: string, loader: () => Promise<T>, cache: CacheLayer, options?: CacheOptions & {
        refreshThreshold?: number;
    }) => Promise<T>;
    invalidateByPattern: (pattern: string, layers: CacheLayer[], rule: CacheInvalidationRule) => Promise<number>;
    invalidateByTags: (tags: string[], layers: CacheLayer[]) => Promise<number>;
    invalidateByDependency: (key: string, dependencyGraph: Map<string, string[]>, layers: CacheLayer[]) => Promise<string[]>;
    invalidateExpired: (layers: CacheLayer[], interval?: number) => NodeJS.Timer;
    warmCache: (strategy: CacheWarmingStrategy, cache: CacheLayer) => Promise<number>;
    scheduleWarmCache: (strategy: CacheWarmingStrategy, cache: CacheLayer) => NodeJS.Timer;
    predictiveWarmCache: (accessPatterns: Map<string, number>, loader: (key: string) => Promise<any>, cache: CacheLayer, threshold?: number) => Promise<number>;
    calculateAdaptiveTTL: (accessCount: number, baseTTL?: number, maxTTL?: number) => number;
    extendTTL: (key: string, cache: CacheLayer, extensionTime: number) => Promise<boolean>;
    slidingExpiration: <T>(key: string, cache: CacheLayer, ttl: number) => Promise<T | null>;
    setupCacheInvalidationHooks: (model: ModelStatic<Model>, cacheManager: MultiLevelCacheManager, keyGenerator: (instance: any) => string) => void;
    setupCacheWarmingHooks: (model: ModelStatic<Model>, cacheManager: MultiLevelCacheManager, keyGenerator: (instance: any) => string, options?: CacheOptions) => void;
    setupComprehensiveCacheHooks: (model: ModelStatic<Model>, cacheManager: MultiLevelCacheManager, config: {
        keyGenerator: (instance: any) => string;
        warmOnCreate?: boolean;
        invalidateOnUpdate?: boolean;
        invalidateOnDelete?: boolean;
        options?: CacheOptions;
    }) => void;
    consistentHash: (key: string, config: DistributedCacheConfig) => number;
    selectCacheNode: (key: string, config: DistributedCacheConfig, nodes: CacheLayer[]) => CacheLayer;
    replicateCacheData: <T>(key: string, value: T, nodes: CacheLayer[], replicationFactor?: number, options?: CacheOptions) => Promise<void>;
    collectCacheMetrics: (layers: CacheLayer[]) => Promise<CacheStats>;
    exportPrometheusMetrics: (stats: CacheStats, namespace?: string) => string;
    createCacheHealthCheck: (layers: CacheLayer[]) => (() => Promise<{
        healthy: boolean;
        details: any;
    }>);
    memoize: <T>(fn: (...args: any[]) => Promise<T>, cache: CacheLayer, options?: {
        ttl?: number;
        keyPrefix?: string;
        keyGenerator?: (...args: any[]) => string;
    }) => ((...args: any[]) => Promise<T>);
    batchSet: <T>(operations: Array<{
        key: string;
        value: T;
    }>, cache: CacheLayer, options?: CacheOptions) => Promise<void>;
    batchGet: <T>(keys: string[], cache: CacheLayer) => Promise<Map<string, T | null>>;
    CacheConfigSchema: any;
    CacheKeyConfigSchema: any;
    CacheInvalidationRuleSchema: any;
    DistributedCacheConfigSchema: any;
};
export default _default;
//# sourceMappingURL=caching-strategies-kit.prod.d.ts.map