/**
 * @fileoverview Sequelize Performance Utilities
 * @module reuse/sequelize-performance-utils
 * @description Comprehensive performance utilities for Sequelize v6 covering query optimization,
 * index management, connection pooling, caching, batch processing, profiling, and monitoring.
 *
 * Key Features:
 * - Query performance analysis and EXPLAIN
 * - Index optimization helpers
 * - Connection pool management and monitoring
 * - Query caching utilities
 * - Batch processing and bulk operations
 * - Query profiling and timing
 * - Database load monitoring
 * - Slow query detection and logging
 * - Query plan analysis
 * - Memory optimization strategies
 * - Connection leak detection
 * - Replication and read replica management
 * - Query queue management
 * - Performance testing helpers
 * - Healthcare-specific optimizations
 *
 * @target Sequelize v6.x, Node 18+, TypeScript 5.x
 *
 * @security
 * - HIPAA-compliant audit logging
 * - Query sanitization
 * - Performance monitoring without exposing sensitive data
 * - Rate limiting integration
 * - Resource usage tracking
 *
 * @example Basic usage
 * ```typescript
 * import { analyzeQuery, optimizeQuery, cacheQuery } from './sequelize-performance-utils';
 *
 * // Analyze query performance
 * const analysis = await analyzeQuery(sequelize, User, {
 *   where: { status: 'active' }
 * });
 *
 * // Cache query results
 * const users = await cacheQuery('active-users', async () => {
 *   return await User.findAll({ where: { status: 'active' } });
 * }, 300);
 * ```
 *
 * @example Advanced usage
 * ```typescript
 * import {
 *   setupQueryProfiler,
 *   detectSlowQueries,
 *   optimizeConnectionPool,
 *   setupReadReplicas
 * } from './sequelize-performance-utils';
 *
 * // Setup query profiler
 * setupQueryProfiler(sequelize, { slowQueryThreshold: 1000 });
 *
 * // Optimize connection pool
 * optimizeConnectionPool(sequelize, { max: 20, min: 5 });
 * ```
 *
 * LOC: PF73X9Q482
 * UPSTREAM: sequelize, @types/sequelize, redis, ioredis
 * DOWNSTREAM: services, repositories, monitoring
 *
 * @version 1.0.0
 * @since 2025-11-08
 */
import { Sequelize, Model, ModelStatic, FindOptions, ConnectionOptions, Options } from 'sequelize';
/**
 * @interface QueryAnalysis
 * @description Query performance analysis result
 */
export interface QueryAnalysis {
    /** Query SQL */
    sql: string;
    /** Execution time in ms */
    executionTime: number;
    /** Number of rows returned */
    rowCount: number;
    /** Query plan */
    plan?: any[];
    /** Index usage */
    indexUsage: string[];
    /** Table scans detected */
    hasTableScan: boolean;
    /** Recommendations */
    recommendations: string[];
}
/**
 * @interface PoolStats
 * @description Connection pool statistics
 */
export interface PoolStats {
    /** Total connections */
    total: number;
    /** Active connections */
    active: number;
    /** Idle connections */
    idle: number;
    /** Waiting requests */
    waiting: number;
    /** Pool size */
    size: number;
    /** Max pool size */
    max: number;
    /** Min pool size */
    min: number;
}
/**
 * @interface CacheOptions
 * @description Query caching options
 */
export interface CacheOptions {
    /** Cache key */
    key: string;
    /** TTL in seconds */
    ttl: number;
    /** Cache tags for invalidation */
    tags?: string[];
    /** Cache prefix */
    prefix?: string;
    /** Force refresh */
    refresh?: boolean;
}
/**
 * @interface ProfilerOptions
 * @description Query profiler options
 */
export interface ProfilerOptions {
    /** Slow query threshold in ms */
    slowQueryThreshold?: number;
    /** Log all queries */
    logAllQueries?: boolean;
    /** Log slow queries */
    logSlowQueries?: boolean;
    /** Include stack traces */
    includeStackTrace?: boolean;
    /** Custom logger */
    logger?: (message: string, meta?: any) => void;
}
/**
 * @interface BatchProcessOptions
 * @description Batch processing options
 */
export interface BatchProcessOptions<T> {
    /** Batch size */
    batchSize: number;
    /** Delay between batches (ms) */
    delay?: number;
    /** Transaction per batch */
    useTransaction?: boolean;
    /** Progress callback */
    onProgress?: (processed: number, total: number) => void;
    /** Error handler */
    onError?: (error: Error, batch: T[], batchIndex: number) => void | Promise<void>;
}
/**
 * @interface OptimizationSuggestion
 * @description Query optimization suggestion
 */
export interface OptimizationSuggestion {
    /** Suggestion type */
    type: 'index' | 'query' | 'schema' | 'cache';
    /** Priority (1-5, 5 highest) */
    priority: number;
    /** Description */
    description: string;
    /** Implementation details */
    implementation?: string;
    /** Estimated impact */
    impact?: string;
}
/**
 * @interface IndexSuggestion
 * @description Index creation suggestion
 */
export interface IndexSuggestion {
    /** Table name */
    table: string;
    /** Column names */
    columns: string[];
    /** Index type */
    type: 'BTREE' | 'HASH' | 'GIN' | 'GIST';
    /** Reason for suggestion */
    reason: string;
    /** Priority */
    priority: number;
}
/**
 * @interface QueryMetrics
 * @description Query execution metrics
 */
export interface QueryMetrics {
    /** Query identifier */
    queryId: string;
    /** Execution count */
    count: number;
    /** Average execution time */
    avgTime: number;
    /** Min execution time */
    minTime: number;
    /** Max execution time */
    maxTime: number;
    /** Total execution time */
    totalTime: number;
    /** Last executed at */
    lastExecutedAt: Date;
}
/**
 * @interface ReplicationConfig
 * @description Read replica configuration
 */
export interface ReplicationConfig {
    /** Read replicas */
    read: ConnectionOptions[];
    /** Write master */
    write: ConnectionOptions;
    /** Load balancing strategy */
    loadBalancing?: 'RANDOM' | 'ROUND_ROBIN' | 'LEAST_CONNECTIONS';
}
/**
 * @function analyzeQuery
 * @description Analyzes query performance with EXPLAIN
 *
 * @template M
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ModelStatic<M>} model - Model to query
 * @param {FindOptions<M>} options - Query options
 * @returns {Promise<QueryAnalysis>} Query analysis result
 *
 * @example
 * ```typescript
 * const analysis = await analyzeQuery(sequelize, User, {
 *   where: { status: 'active', age: { [Op.gt]: 18 } },
 *   include: [{ model: Profile }]
 * });
 *
 * console.log('Execution time:', analysis.executionTime);
 * console.log('Index usage:', analysis.indexUsage);
 * console.log('Recommendations:', analysis.recommendations);
 * ```
 */
export declare function analyzeQuery<M extends Model>(sequelize: Sequelize, model: ModelStatic<M>, options: FindOptions<M>): Promise<QueryAnalysis>;
/**
 * @function explainQuery
 * @description Gets EXPLAIN plan for a query
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sql - SQL query
 * @param {boolean} analyze - Include EXPLAIN ANALYZE
 * @returns {Promise<any[]>} Query plan
 *
 * @example
 * ```typescript
 * const plan = await explainQuery(
 *   sequelize,
 *   'SELECT * FROM users WHERE status = $1',
 *   true
 * );
 * ```
 */
export declare function explainQuery(sequelize: Sequelize, sql: string, analyze?: boolean): Promise<any[]>;
/**
 * @function benchmarkQuery
 * @description Benchmarks a query with multiple executions
 *
 * @template T
 * @param {() => Promise<T>} queryFn - Query function
 * @param {number} iterations - Number of iterations
 * @returns {Promise<{ avgTime: number; minTime: number; maxTime: number; totalTime: number }>}
 *
 * @example
 * ```typescript
 * const benchmark = await benchmarkQuery(
 *   () => User.findAll({ where: { status: 'active' } }),
 *   10
 * );
 *
 * console.log(`Average: ${benchmark.avgTime}ms`);
 * ```
 */
export declare function benchmarkQuery<T>(queryFn: () => Promise<T>, iterations?: number): Promise<{
    avgTime: number;
    minTime: number;
    maxTime: number;
    totalTime: number;
}>;
/**
 * @function compareQueries
 * @description Compares performance of multiple query approaches
 *
 * @template T
 * @param {Record<string, () => Promise<T>>} queries - Named query functions
 * @param {number} iterations - Iterations per query
 * @returns {Promise<Record<string, any>>} Comparison results
 *
 * @example
 * ```typescript
 * const comparison = await compareQueries({
 *   'with-include': () => User.findAll({ include: [Post] }),
 *   'separate-queries': async () => {
 *     const users = await User.findAll();
 *     await Post.findAll();
 *     return users;
 *   }
 * }, 5);
 * ```
 */
export declare function compareQueries<T>(queries: Record<string, () => Promise<T>>, iterations?: number): Promise<Record<string, any>>;
/**
 * @function suggestIndexes
 * @description Suggests indexes based on query patterns
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {WhereOptions[]} whereConditions - Common where conditions
 * @returns {Promise<IndexSuggestion[]>} Index suggestions
 *
 * @example
 * ```typescript
 * const suggestions = await suggestIndexes(
 *   sequelize,
 *   'users',
 *   [
 *     { status: 'active' },
 *     { email: 'test@example.com' },
 *     { createdAt: { [Op.gte]: new Date() } }
 *   ]
 * );
 * ```
 */
export declare function suggestIndexes(sequelize: Sequelize, tableName: string, whereConditions: any[]): Promise<IndexSuggestion[]>;
/**
 * @function createIndex
 * @description Creates an index on a table
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {string[]} columns - Column names
 * @param {object} options - Index options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createIndex(sequelize, 'users', ['email'], {
 *   unique: true,
 *   name: 'idx_users_email'
 * });
 * ```
 */
export declare function createIndex(sequelize: Sequelize, tableName: string, columns: string[], options?: {
    name?: string;
    unique?: boolean;
    type?: 'BTREE' | 'HASH' | 'GIN' | 'GIST';
    where?: string;
    concurrent?: boolean;
}): Promise<void>;
/**
 * @function dropIndex
 * @description Drops an index from a table
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} indexName - Index name
 * @param {boolean} concurrent - Use CONCURRENTLY
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await dropIndex(sequelize, 'idx_users_email', true);
 * ```
 */
export declare function dropIndex(sequelize: Sequelize, indexName: string, concurrent?: boolean): Promise<void>;
/**
 * @function analyzeIndexUsage
 * @description Analyzes index usage statistics
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @returns {Promise<any[]>} Index usage statistics
 *
 * @example
 * ```typescript
 * const usage = await analyzeIndexUsage(sequelize, 'users');
 * usage.forEach(idx => {
 *   console.log(`${idx.indexname}: ${idx.idx_scan} scans`);
 * });
 * ```
 */
export declare function analyzeIndexUsage(sequelize: Sequelize, tableName: string): Promise<any[]>;
/**
 * @function findUnusedIndexes
 * @description Finds indexes that are never used
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @returns {Promise<string[]>} Unused index names
 *
 * @example
 * ```typescript
 * const unused = await findUnusedIndexes(sequelize, 'users');
 * console.log('Consider dropping:', unused);
 * ```
 */
export declare function findUnusedIndexes(sequelize: Sequelize, tableName: string): Promise<string[]>;
/**
 * @function getPoolStats
 * @description Gets connection pool statistics
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {PoolStats} Pool statistics
 *
 * @example
 * ```typescript
 * const stats = getPoolStats(sequelize);
 * console.log(`Active: ${stats.active}, Idle: ${stats.idle}`);
 * ```
 */
export declare function getPoolStats(sequelize: Sequelize): PoolStats;
/**
 * @function optimizeConnectionPool
 * @description Optimizes connection pool settings
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} settings - Pool settings
 * @returns {void}
 *
 * @example
 * ```typescript
 * optimizeConnectionPool(sequelize, {
 *   max: 20,
 *   min: 5,
 *   acquire: 30000,
 *   idle: 10000
 * });
 * ```
 */
export declare function optimizeConnectionPool(sequelize: Sequelize, settings: {
    max?: number;
    min?: number;
    acquire?: number;
    idle?: number;
    evict?: number;
}): void;
/**
 * @function monitorConnectionPool
 * @description Monitors connection pool health
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} interval - Check interval in ms
 * @param {(stats: PoolStats) => void} callback - Callback with stats
 * @returns {NodeJS.Timeout} Interval timer
 *
 * @example
 * ```typescript
 * const monitor = monitorConnectionPool(sequelize, 5000, (stats) => {
 *   if (stats.waiting > 5) {
 *     console.warn('High connection wait queue:', stats.waiting);
 *   }
 * });
 *
 * // Stop monitoring
 * clearInterval(monitor);
 * ```
 */
export declare function monitorConnectionPool(sequelize: Sequelize, interval: number, callback: (stats: PoolStats) => void): NodeJS.Timeout;
/**
 * @function detectConnectionLeaks
 * @description Detects potential connection leaks
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} threshold - Leak threshold (active connections)
 * @returns {boolean} True if leak detected
 *
 * @example
 * ```typescript
 * if (detectConnectionLeaks(sequelize, 15)) {
 *   console.error('Connection leak detected!');
 * }
 * ```
 */
export declare function detectConnectionLeaks(sequelize: Sequelize, threshold?: number): boolean;
/**
 * @function drainConnectionPool
 * @description Drains the connection pool gracefully
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await drainConnectionPool(sequelize);
 * console.log('Pool drained');
 * ```
 */
export declare function drainConnectionPool(sequelize: Sequelize): Promise<void>;
export declare function cacheQuery<T>(key: string, queryFn: () => Promise<T>, ttl: number): Promise<T>;
/**
 * @function invalidateCache
 * @description Invalidates cached query results
 *
 * @param {string | string[]} keys - Cache key(s) to invalidate
 * @returns {void}
 *
 * @example
 * ```typescript
 * invalidateCache('active-users');
 * invalidateCache(['active-users', 'user-count']);
 * ```
 */
export declare function invalidateCache(keys: string | string[]): void;
/**
 * @function clearAllCache
 * @description Clears all cached queries
 *
 * @returns {void}
 *
 * @example
 * ```typescript
 * clearAllCache();
 * ```
 */
export declare function clearAllCache(): void;
/**
 * @function getCacheStats
 * @description Gets cache statistics
 *
 * @returns {{ size: number; keys: string[] }}
 *
 * @example
 * ```typescript
 * const stats = getCacheStats();
 * console.log(`Cache size: ${stats.size} entries`);
 * ```
 */
export declare function getCacheStats(): {
    size: number;
    keys: string[];
};
/**
 * @function createCacheKey
 * @description Creates a cache key from query parameters
 *
 * @param {string} prefix - Key prefix
 * @param {any} params - Query parameters
 * @returns {string} Cache key
 *
 * @example
 * ```typescript
 * const key = createCacheKey('users', {
 *   where: { status: 'active' },
 *   limit: 10
 * });
 * ```
 */
export declare function createCacheKey(prefix: string, params: any): string;
/**
 * @function processBatch
 * @description Processes items in batches
 *
 * @template T, R
 * @param {T[]} items - Items to process
 * @param {(batch: T[]) => Promise<R>} processor - Batch processor
 * @param {BatchProcessOptions<T>} options - Batch options
 * @returns {Promise<R[]>} Processing results
 *
 * @example
 * ```typescript
 * await processBatch(
 *   largeDataArray,
 *   async (batch) => {
 *     return await User.bulkCreate(batch);
 *   },
 *   {
 *     batchSize: 1000,
 *     delay: 100,
 *     useTransaction: true,
 *     onProgress: (processed, total) => {
 *       console.log(`${processed}/${total}`);
 *     }
 *   }
 * );
 * ```
 */
export declare function processBatch<T, R>(items: T[], processor: (batch: T[]) => Promise<R>, options: BatchProcessOptions<T>): Promise<R[]>;
/**
 * @function streamQuery
 * @description Streams query results for memory efficiency
 *
 * @template M
 * @param {ModelStatic<M>} model - Model to query
 * @param {FindOptions<M>} options - Query options
 * @param {(row: M) => void | Promise<void>} callback - Row callback
 * @param {number} batchSize - Batch size for streaming
 * @returns {Promise<number>} Total rows processed
 *
 * @example
 * ```typescript
 * let count = 0;
 * await streamQuery(
 *   User,
 *   { where: { status: 'active' } },
 *   async (user) => {
 *     await processUser(user);
 *     count++;
 *   },
 *   100
 * );
 * ```
 */
export declare function streamQuery<M extends Model>(model: ModelStatic<M>, options: FindOptions<M>, callback: (row: M) => void | Promise<void>, batchSize?: number): Promise<number>;
export declare function setupQueryProfiler(sequelize: Sequelize, options?: ProfilerOptions): void;
/**
 * @function getQueryMetrics
 * @description Gets query execution metrics
 *
 * @param {number} topN - Number of top queries to return
 * @returns {QueryMetrics[]} Query metrics
 *
 * @example
 * ```typescript
 * const topQueries = getQueryMetrics(10);
 * topQueries.forEach(q => {
 *   console.log(`${q.queryId}: ${q.count} executions, ${q.avgTime}ms avg`);
 * });
 * ```
 */
export declare function getQueryMetrics(topN?: number): QueryMetrics[];
/**
 * @function resetQueryMetrics
 * @description Resets query metrics
 *
 * @returns {void}
 *
 * @example
 * ```typescript
 * resetQueryMetrics();
 * ```
 */
export declare function resetQueryMetrics(): void;
/**
 * @function detectSlowQueries
 * @description Detects and returns slow queries
 *
 * @param {number} threshold - Threshold in ms
 * @returns {QueryMetrics[]} Slow queries
 *
 * @example
 * ```typescript
 * const slowQueries = detectSlowQueries(500);
 * ```
 */
export declare function detectSlowQueries(threshold: number): QueryMetrics[];
/**
 * @function monitorDatabaseLoad
 * @description Monitors database load and active queries
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Load statistics
 *
 * @example
 * ```typescript
 * const load = await monitorDatabaseLoad(sequelize);
 * console.log(`Active queries: ${load.activeQueries}`);
 * ```
 */
export declare function monitorDatabaseLoad(sequelize: Sequelize): Promise<any>;
/**
 * @function getActiveQueries
 * @description Gets currently active queries
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Active queries
 *
 * @example
 * ```typescript
 * const active = await getActiveQueries(sequelize);
 * active.forEach(q => console.log(q.query, q.duration));
 * ```
 */
export declare function getActiveQueries(sequelize: Sequelize): Promise<any[]>;
/**
 * @function killQuery
 * @description Kills a long-running query
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} pid - Process ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await killQuery(sequelize, 12345);
 * ```
 */
export declare function killQuery(sequelize: Sequelize, pid: number): Promise<void>;
/**
 * @function setupReadReplicas
 * @description Sets up read replica configuration
 *
 * @param {ReplicationConfig} config - Replication configuration
 * @returns {Options} Sequelize options with replication
 *
 * @example
 * ```typescript
 * const options = setupReadReplicas({
 *   write: { host: 'master.db', username: 'user', password: 'pass' },
 *   read: [
 *     { host: 'replica1.db', username: 'user', password: 'pass' },
 *     { host: 'replica2.db', username: 'user', password: 'pass' }
 *   ],
 *   loadBalancing: 'RANDOM'
 * });
 *
 * const sequelize = new Sequelize({ ...options, database: 'mydb' });
 * ```
 */
export declare function setupReadReplicas(config: ReplicationConfig): Partial<Options>;
/**
 * @function forceReadFromReplica
 * @description Forces a query to use read replica
 *
 * @template M
 * @param {ModelStatic<M>} model - Model to query
 * @param {FindOptions<M>} options - Query options
 * @returns {FindOptions<M>} Options with replica flag
 *
 * @example
 * ```typescript
 * const options = forceReadFromReplica(User, {
 *   where: { status: 'active' }
 * });
 *
 * const users = await User.findAll(options);
 * ```
 */
export declare function forceReadFromReplica<M extends Model>(model: ModelStatic<M>, options: FindOptions<M>): FindOptions<M>;
/**
 * @function forceWriteToMaster
 * @description Forces a query to use master database
 *
 * @template M
 * @param {ModelStatic<M>} model - Model to query
 * @param {FindOptions<M>} options - Query options
 * @returns {FindOptions<M>} Options with master flag
 *
 * @example
 * ```typescript
 * const options = forceWriteToMaster(User, {
 *   where: { id: 123 }
 * });
 *
 * const user = await User.findOne(options);
 * ```
 */
export declare function forceWriteToMaster<M extends Model>(model: ModelStatic<M>, options: FindOptions<M>): FindOptions<M>;
/**
 * @function generateOptimizationSuggestions
 * @description Generates optimization suggestions based on metrics
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<OptimizationSuggestion[]>} Suggestions
 *
 * @example
 * ```typescript
 * const suggestions = await generateOptimizationSuggestions(sequelize);
 * suggestions.forEach(s => {
 *   console.log(`[${s.priority}] ${s.type}: ${s.description}`);
 * });
 * ```
 */
export declare function generateOptimizationSuggestions(sequelize: Sequelize): Promise<OptimizationSuggestion[]>;
/**
 * @function optimizeQuery
 * @description Applies automatic optimizations to a query
 *
 * @template M
 * @param {FindOptions<M>} options - Original query options
 * @returns {FindOptions<M>} Optimized query options
 *
 * @example
 * ```typescript
 * const original = {
 *   where: { status: 'active' },
 *   include: [{ model: Post, include: [Comment] }]
 * };
 *
 * const optimized = optimizeQuery(original);
 * // Adds subQuery: false, separate: true where appropriate
 * ```
 */
export declare function optimizeQuery<M extends Model>(options: FindOptions<M>): FindOptions<M>;
/**
 * @function enableQueryLogging
 * @description Enables comprehensive query logging
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} logFile - Log file path
 * @returns {void}
 *
 * @example
 * ```typescript
 * enableQueryLogging(sequelize, '/var/log/queries.log');
 * ```
 */
export declare function enableQueryLogging(sequelize: Sequelize, logFile?: string): void;
//# sourceMappingURL=sequelize-performance-utils.d.ts.map