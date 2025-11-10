/**
 * LOC: S1E2Q3O4P5
 * File: /reuse/sequelize-optimization-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - @types/node (v18.x)
 *
 * DOWNSTREAM (imported by):
 *   - Service layers
 *   - Performance monitoring
 *   - Database optimization modules
 */
/**
 * File: /reuse/sequelize-optimization-kit.ts
 * Locator: WC-UTL-SEQ-OKIT-001
 * Purpose: Sequelize Optimization Kit - Performance analysis and optimization helpers
 *
 * Upstream: sequelize v6.x, @types/node
 * Downstream: All database services, performance monitoring, and optimization modules
 * Dependencies: Sequelize v6.x, Node 18+, TypeScript 5.x
 * Exports: 45 optimization utilities for performance analysis, N+1 prevention, caching, batch loading, and monitoring
 *
 * LLM Context: Production-grade Sequelize v6.x optimization kit for White Cross healthcare platform.
 * Provides advanced helpers for query performance analysis, index suggestions, N+1 query detection and prevention,
 * eager loading optimization, connection pool management, query caching strategies, batch loading utilities,
 * database sharding, read replica routing, and comprehensive performance monitoring. HIPAA-compliant.
 */
import { Model, ModelStatic, Sequelize, FindOptions, Includeable } from 'sequelize';
/**
 * Query performance metrics
 */
export interface QueryPerformanceMetrics {
    query: string;
    executionTime: number;
    rowsReturned: number;
    rowsExamined?: number;
    indexUsed?: boolean;
    indexNames?: string[];
    queryPlan?: any;
    timestamp: Date;
    queryType: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'OTHER';
}
/**
 * Index suggestion
 */
export interface IndexSuggestion {
    table: string;
    columns: string[];
    indexType: 'BTREE' | 'HASH' | 'GIN' | 'GIST';
    reason: string;
    estimatedImprovement: number;
    priority: 'high' | 'medium' | 'low';
    createStatement: string;
}
/**
 * N+1 query detection result
 */
export interface NPlusOneDetection {
    detected: boolean;
    mainQuery: string;
    additionalQueries: string[];
    affectedModels: string[];
    suggestion: string;
    severity: 'critical' | 'warning' | 'info';
}
/**
 * Connection pool statistics
 */
export interface ConnectionPoolStats {
    size: number;
    available: number;
    using: number;
    waiting: number;
    maxSize: number;
    minSize: number;
    idleConnections: number;
    utilizationPercent: number;
}
/**
 * Query cache entry
 */
export interface QueryCacheEntry<T = any> {
    key: string;
    data: T;
    createdAt: Date;
    expiresAt: Date;
    hits: number;
    size: number;
    tags?: string[];
}
/**
 * Batch loader configuration
 */
export interface BatchLoaderConfig<K = any, V = any> {
    batchSize?: number;
    maxBatchSize?: number;
    batchScheduleFn?: (callback: () => void) => void;
    cacheKeyFn?: (key: K) => string;
    cacheFn?: (key: K, value: V) => void;
}
/**
 * Shard configuration
 */
export interface ShardConfig {
    name: string;
    sequelize: Sequelize;
    weight?: number;
    readOnly?: boolean;
    priority?: number;
    healthCheck?: () => Promise<boolean>;
}
/**
 * Read replica configuration
 */
export interface ReadReplicaConfig {
    sequelize: Sequelize;
    weight?: number;
    lag?: number;
    healthCheck?: () => Promise<boolean>;
}
/**
 * Performance monitoring configuration
 */
export interface PerformanceMonitorConfig {
    slowQueryThreshold?: number;
    enableQueryLogging?: boolean;
    enableMetrics?: boolean;
    metricsInterval?: number;
    onSlowQuery?: (metrics: QueryPerformanceMetrics) => void;
    onNPlusOne?: (detection: NPlusOneDetection) => void;
}
/**
 * Query optimization suggestion
 */
export interface OptimizationSuggestion {
    type: 'index' | 'query_rewrite' | 'schema_change' | 'configuration';
    description: string;
    impact: 'high' | 'medium' | 'low';
    effort: 'high' | 'medium' | 'low';
    code?: string;
}
/**
 * Eager loading strategy
 */
export interface EagerLoadingStrategy {
    model: ModelStatic<Model>;
    includes: Includeable[];
    strategy: 'join' | 'separate' | 'subquery';
    estimatedRows?: number;
}
/**
 * 1. Analyzes query execution plan and provides insights.
 * Examines EXPLAIN output for optimization opportunities.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} query - SQL query to analyze
 * @param {object} options - Analysis options
 * @returns {Promise<QueryPerformanceMetrics>} Performance metrics and analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeQueryPerformance(
 *   sequelize,
 *   'SELECT * FROM users WHERE email = ?',
 *   { includeExplain: true }
 * );
 * console.log(analysis.indexUsed, analysis.executionTime);
 * ```
 */
export declare function analyzeQueryPerformance(sequelize: Sequelize, query: string, options?: {
    replacements?: any;
    includeExplain?: boolean;
    includeAnalyze?: boolean;
}): Promise<QueryPerformanceMetrics>;
/**
 * 2. Profiles a Sequelize query with detailed metrics.
 * Captures comprehensive performance data for Sequelize queries.
 *
 * @param {Function} queryFn - Query function to profile
 * @param {object} options - Profiling options
 * @returns {Promise<{ result: any; metrics: QueryPerformanceMetrics }>} Results and metrics
 *
 * @example
 * ```typescript
 * const { result, metrics } = await profileQuery(
 *   () => User.findAll({ where: { status: 'active' }, include: [Profile] }),
 *   { logQueries: true }
 * );
 * ```
 */
export declare function profileQuery<T>(queryFn: () => Promise<T>, options?: {
    logQueries?: boolean;
    captureStackTrace?: boolean;
}): Promise<{
    result: T;
    metrics: QueryPerformanceMetrics[];
}>;
/**
 * 3. Compares query performance between different approaches.
 * A/B tests different query strategies.
 *
 * @param {object} scenarios - Named query scenarios
 * @param {object} options - Comparison options
 * @returns {Promise<object>} Performance comparison results
 *
 * @example
 * ```typescript
 * const comparison = await compareQueryPerformance({
 *   eager: () => User.findAll({ include: [Post] }),
 *   lazy: () => User.findAll().then(users => Promise.all(users.map(u => u.getPosts()))),
 *   separate: () => User.findAll({ include: [{ model: Post, separate: true }] })
 * }, { iterations: 10 });
 * ```
 */
export declare function compareQueryPerformance(scenarios: Record<string, () => Promise<any>>, options?: {
    iterations?: number;
    warmup?: number;
}): Promise<Record<string, {
    avgTime: number;
    minTime: number;
    maxTime: number;
    stdDev: number;
    queriesPerExecution: number;
}>>;
/**
 * 4. Identifies slow queries in real-time.
 * Monitors and logs queries exceeding threshold.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} thresholdMs - Slow query threshold in milliseconds
 * @param {Function} callback - Callback for slow queries
 * @returns {Function} Cleanup function to stop monitoring
 *
 * @example
 * ```typescript
 * const stopMonitoring = monitorSlowQueries(
 *   sequelize,
 *   1000,
 *   (query, time) => console.log(`Slow query: ${query} (${time}ms)`)
 * );
 * // Later: stopMonitoring();
 * ```
 */
export declare function monitorSlowQueries(sequelize: Sequelize, thresholdMs: number, callback: (query: string, executionTime: number, metrics: QueryPerformanceMetrics) => void): () => void;
/**
 * 5. Generates query performance report.
 * Creates comprehensive performance analysis report.
 *
 * @param {QueryPerformanceMetrics[]} metrics - Collected metrics
 * @returns {object} Performance report
 *
 * @example
 * ```typescript
 * const report = generatePerformanceReport(collectedMetrics);
 * console.log(report.summary, report.slowestQueries, report.recommendations);
 * ```
 */
export declare function generatePerformanceReport(metrics: QueryPerformanceMetrics[]): {
    summary: {
        totalQueries: number;
        avgExecutionTime: number;
        slowQueries: number;
        fastQueries: number;
        totalExecutionTime: number;
    };
    slowestQueries: QueryPerformanceMetrics[];
    queryTypeDistribution: Record<string, number>;
    recommendations: string[];
};
/**
 * 6. Tracks query execution statistics over time.
 * Maintains running statistics for query monitoring.
 *
 * @returns {object} Query statistics tracker
 *
 * @example
 * ```typescript
 * const tracker = createQueryStatisticsTracker();
 * tracker.recordQuery(query, 150);
 * const stats = tracker.getStatistics();
 * ```
 */
export declare function createQueryStatisticsTracker(): {
    recordQuery: (query: string, executionTime: number) => void;
    getStatistics: () => {
        count: number;
        avgTime: number;
        minTime: number;
        maxTime: number;
        p50: number;
        p95: number;
        p99: number;
    };
    reset: () => void;
};
/**
 * 7. Detects query performance regressions.
 * Compares current performance against baseline.
 *
 * @param {QueryPerformanceMetrics[]} baseline - Baseline metrics
 * @param {QueryPerformanceMetrics[]} current - Current metrics
 * @param {number} threshold - Regression threshold percentage
 * @returns {object[]} Detected regressions
 *
 * @example
 * ```typescript
 * const regressions = detectQueryRegressions(
 *   baselineMetrics,
 *   currentMetrics,
 *   20 // 20% slower is a regression
 * );
 * ```
 */
export declare function detectQueryRegressions(baseline: QueryPerformanceMetrics[], current: QueryPerformanceMetrics[], threshold?: number): Array<{
    query: string;
    baselineTime: number;
    currentTime: number;
    degradationPercent: number;
}>;
/**
 * 8. Estimates query cost before execution.
 * Provides cost estimates using EXPLAIN without executing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} query - Query to estimate
 * @param {object} replacements - Query parameters
 * @returns {Promise<object>} Cost estimation
 *
 * @example
 * ```typescript
 * const cost = await estimateQueryCost(
 *   sequelize,
 *   'SELECT * FROM users WHERE age > ?',
 *   { age: 18 }
 * );
 * console.log(cost.estimatedRows, cost.estimatedCost);
 * ```
 */
export declare function estimateQueryCost(sequelize: Sequelize, query: string, replacements?: any): Promise<{
    estimatedRows: number;
    estimatedCost: number;
    indexUsed: boolean;
    recommendation: string;
}>;
/**
 * 9. Analyzes query patterns and suggests indexes.
 * Identifies missing indexes based on query analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {QueryPerformanceMetrics[]} metrics - Query metrics to analyze
 * @returns {Promise<IndexSuggestion[]>} Index suggestions
 *
 * @example
 * ```typescript
 * const suggestions = await suggestIndexes(sequelize, queryMetrics);
 * suggestions.forEach(s => console.log(s.createStatement));
 * ```
 */
export declare function suggestIndexes(sequelize: Sequelize, metrics: QueryPerformanceMetrics[]): Promise<IndexSuggestion[]>;
/**
 * 10. Validates existing indexes against query patterns.
 * Identifies unused or redundant indexes.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name to analyze
 * @param {QueryPerformanceMetrics[]} metrics - Query metrics
 * @returns {Promise<object[]>} Index analysis results
 *
 * @example
 * ```typescript
 * const analysis = await analyzeIndexUsage(sequelize, 'users', queryMetrics);
 * analysis.forEach(idx => {
 *   if (!idx.used) console.log(`Unused index: ${idx.name}`);
 * });
 * ```
 */
export declare function analyzeIndexUsage(sequelize: Sequelize, tableName: string, metrics: QueryPerformanceMetrics[]): Promise<Array<{
    name: string;
    columns: string[];
    used: boolean;
    usageCount: number;
    recommendation: string;
}>>;
/**
 * 11. Detects redundant or duplicate indexes.
 * Finds indexes that can be consolidated.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name to analyze
 * @returns {Promise<object[]>} Redundant index pairs
 *
 * @example
 * ```typescript
 * const redundant = await detectRedundantIndexes(sequelize, 'users');
 * redundant.forEach(pair => {
 *   console.log(`Drop ${pair.redundantIndex}, keep ${pair.coveringIndex}`);
 * });
 * ```
 */
export declare function detectRedundantIndexes(sequelize: Sequelize, tableName: string): Promise<Array<{
    redundantIndex: string;
    coveringIndex: string;
    reason: string;
}>>;
/**
 * 12. Generates optimal composite index recommendations.
 * Suggests multi-column indexes based on query patterns.
 *
 * @param {QueryPerformanceMetrics[]} metrics - Query metrics
 * @param {object} options - Recommendation options
 * @returns {IndexSuggestion[]} Composite index suggestions
 *
 * @example
 * ```typescript
 * const composites = generateCompositeIndexRecommendations(
 *   queryMetrics,
 *   { minOccurrences: 5, maxColumns: 3 }
 * );
 * ```
 */
export declare function generateCompositeIndexRecommendations(metrics: QueryPerformanceMetrics[], options?: {
    minOccurrences?: number;
    maxColumns?: number;
}): IndexSuggestion[];
/**
 * 13. Calculates index selectivity and effectiveness.
 * Measures how well an index filters data.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {string} columnName - Column name
 * @returns {Promise<object>} Selectivity analysis
 *
 * @example
 * ```typescript
 * const selectivity = await calculateIndexSelectivity(sequelize, 'users', 'email');
 * if (selectivity.selectivity < 0.1) {
 *   console.log('High selectivity - good index candidate');
 * }
 * ```
 */
export declare function calculateIndexSelectivity(sequelize: Sequelize, tableName: string, columnName: string): Promise<{
    selectivity: number;
    uniqueValues: number;
    totalRows: number;
    recommendation: string;
}>;
/**
 * 14. Detects N+1 query patterns in real-time.
 * Monitors query execution to identify N+1 issues.
 *
 * @param {QueryPerformanceMetrics[]} metrics - Query metrics
 * @param {object} options - Detection options
 * @returns {NPlusOneDetection[]} Detected N+1 patterns
 *
 * @example
 * ```typescript
 * const detections = detectNPlusOneQueries(queryMetrics);
 * detections.forEach(d => {
 *   if (d.severity === 'critical') console.error(d.suggestion);
 * });
 * ```
 */
export declare function detectNPlusOneQueries(metrics: QueryPerformanceMetrics[], options?: {
    threshold?: number;
    timeWindow?: number;
}): NPlusOneDetection[];
/**
 * 15. Automatically optimizes includes to prevent N+1.
 * Rewrites query options to use optimal eager loading.
 *
 * @param {FindOptions} options - Original find options
 * @param {object} config - Optimization configuration
 * @returns {FindOptions} Optimized find options
 *
 * @example
 * ```typescript
 * const optimized = preventNPlusOne(
 *   { where: { status: 'active' }, include: [Post] },
 *   { useSeparate: true, maxDepth: 2 }
 * );
 * ```
 */
export declare function preventNPlusOne(options: FindOptions, config?: {
    useSeparate?: boolean;
    useSubQuery?: boolean;
    maxDepth?: number;
}): FindOptions;
/**
 * 16. Implements DataLoader pattern for batch loading.
 * Creates a batch loader for preventing N+1 queries.
 *
 * @param {Function} batchLoadFn - Batch loading function
 * @param {BatchLoaderConfig} config - Loader configuration
 * @returns {object} DataLoader instance
 *
 * @example
 * ```typescript
 * const userLoader = createDataLoader(
 *   async (ids) => User.findAll({ where: { id: { [Op.in]: ids } } }),
 *   { batchSize: 100 }
 * );
 * const user = await userLoader.load(123);
 * ```
 */
export declare function createDataLoader<K, V>(batchLoadFn: (keys: K[]) => Promise<V[]>, config?: BatchLoaderConfig<K, V>): {
    load: (key: K) => Promise<V>;
    loadMany: (keys: K[]) => Promise<V[]>;
    clear: (key: K) => void;
    clearAll: () => void;
};
/**
 * 17. Prefetches associations to prevent lazy loading.
 * Eagerly loads all necessary associations.
 *
 * @param {T[]} instances - Model instances
 * @param {string[]} associations - Associations to prefetch
 * @returns {Promise<T[]>} Instances with prefetched associations
 *
 * @example
 * ```typescript
 * const users = await User.findAll({ where: { status: 'active' } });
 * const usersWithData = await prefetchAssociations(users, ['posts', 'comments']);
 * ```
 */
export declare function prefetchAssociations<T extends Model>(instances: T[], associations: string[]): Promise<T[]>;
/**
 * 18. Analyzes association loading strategy effectiveness.
 * Compares different loading strategies.
 *
 * @param {ModelStatic<T>} model - Model to analyze
 * @param {FindOptions} baseQuery - Base query options
 * @returns {Promise<object>} Strategy comparison
 *
 * @example
 * ```typescript
 * const analysis = await analyzeLoadingStrategy(
 *   User,
 *   { where: { status: 'active' }, include: [Post] }
 * );
 * console.log(analysis.recommended);
 * ```
 */
export declare function analyzeLoadingStrategy<T extends Model>(model: ModelStatic<T>, baseQuery: FindOptions): Promise<{
    strategies: Record<string, {
        time: number;
        queries: number;
    }>;
    recommended: string;
}>;
/**
 * 19. Implements association caching to reduce queries.
 * Caches frequently accessed associations.
 *
 * @param {ModelStatic<T>} model - Model to cache associations for
 * @param {string} associationName - Association to cache
 * @param {object} cacheOptions - Cache configuration
 * @returns {object} Cached association accessor
 *
 * @example
 * ```typescript
 * const getCachedPosts = cacheAssociation(User, 'posts', { ttl: 300 });
 * const posts = await getCachedPosts(userId);
 * ```
 */
export declare function cacheAssociation<T extends Model>(model: ModelStatic<T>, associationName: string, cacheOptions?: {
    ttl?: number;
    maxSize?: number;
}): (instanceId: string | number) => Promise<any>;
/**
 * 20. Optimizes nested include depth and structure.
 * Restructures includes for optimal performance.
 *
 * @param {Includeable[]} includes - Include options to optimize
 * @param {number} maxDepth - Maximum nesting depth
 * @returns {Includeable[]} Optimized includes
 *
 * @example
 * ```typescript
 * const optimized = optimizeIncludeDepth([
 *   { model: Post, include: [{ model: Comment, include: [Author] }] }
 * ], 2);
 * ```
 */
export declare function optimizeIncludeDepth(includes: Includeable[], maxDepth?: number): Includeable[];
/**
 * 21. Determines optimal join vs. separate query strategy.
 * Chooses best loading strategy based on data characteristics.
 *
 * @param {object} config - Strategy determination config
 * @returns {EagerLoadingStrategy} Recommended strategy
 *
 * @example
 * ```typescript
 * const strategy = determineEagerLoadingStrategy({
 *   parentCount: 100,
 *   childrenPerParent: 50,
 *   associationType: 'hasMany'
 * });
 * console.log(strategy.strategy); // 'separate' or 'join'
 * ```
 */
export declare function determineEagerLoadingStrategy(config: {
    parentCount?: number;
    childrenPerParent?: number;
    associationType?: 'hasMany' | 'hasOne' | 'belongsTo';
    dataSize?: number;
}): {
    strategy: 'join' | 'separate' | 'subquery';
    reason: string;
};
/**
 * 22. Implements selective eager loading based on data access patterns.
 * Loads only frequently accessed associations.
 *
 * @param {FindOptions} options - Original options
 * @param {object} accessPatterns - Recorded access patterns
 * @returns {FindOptions} Options with selective includes
 *
 * @example
 * ```typescript
 * const selective = applySelectiveEagerLoading(
 *   baseOptions,
 *   { posts: 0.8, comments: 0.3, profile: 0.95 }
 * );
 * // Only includes posts and profile (threshold 0.5)
 * ```
 */
export declare function applySelectiveEagerLoading(options: FindOptions, accessPatterns: Record<string, number>, threshold?: number): FindOptions;
/**
 * 23. Parallelizes independent include queries.
 * Executes non-dependent includes in parallel.
 *
 * @param {ModelStatic<T>} model - Model to query
 * @param {FindOptions} options - Query options with includes
 * @returns {Promise<T[]>} Results with parallel-loaded includes
 *
 * @example
 * ```typescript
 * const users = await parallelLoadIncludes(User, {
 *   where: { status: 'active' },
 *   include: [Profile, Posts, Comments]
 * });
 * ```
 */
export declare function parallelLoadIncludes<T extends Model>(model: ModelStatic<T>, options: FindOptions): Promise<T[]>;
/**
 * 24. Implements lazy loading with prefetch hints.
 * Lazy loads with intelligent prefetching.
 *
 * @param {ModelStatic<T>} model - Model class
 * @param {string} associationName - Association to lazy load
 * @param {object} options - Lazy loading options
 * @returns {Function} Lazy loader with prefetch
 *
 * @example
 * ```typescript
 * const lazyLoadPosts = createLazyLoader(User, 'posts', {
 *   prefetchSize: 10,
 *   cache: true
 * });
 * const posts = await lazyLoadPosts(userId);
 * ```
 */
export declare function createLazyLoader<T extends Model>(model: ModelStatic<T>, associationName: string, options?: {
    prefetchSize?: number;
    cache?: boolean;
    ttl?: number;
}): (instanceId: string | number) => Promise<any>;
/**
 * 25. Monitors and reports connection pool statistics.
 * Provides real-time pool health metrics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ConnectionPoolStats} Pool statistics
 *
 * @example
 * ```typescript
 * const stats = getConnectionPoolStats(sequelize);
 * console.log(`Pool utilization: ${stats.utilizationPercent}%`);
 * ```
 */
export declare function getConnectionPoolStats(sequelize: Sequelize): ConnectionPoolStats;
/**
 * 26. Optimizes connection pool configuration based on workload.
 * Suggests pool settings for current usage patterns.
 *
 * @param {ConnectionPoolStats} currentStats - Current pool stats
 * @param {object} workloadMetrics - Workload characteristics
 * @returns {object} Recommended pool configuration
 *
 * @example
 * ```typescript
 * const recommended = optimizeConnectionPool(
 *   currentStats,
 *   { avgQps: 1000, peakQps: 5000, avgQueryTime: 50 }
 * );
 * ```
 */
export declare function optimizeConnectionPool(currentStats: ConnectionPoolStats, workloadMetrics: {
    avgQps?: number;
    peakQps?: number;
    avgQueryTime?: number;
}): {
    min: number;
    max: number;
    acquire: number;
    idle: number;
    reasoning: string;
};
/**
 * 27. Implements connection pool warming on application start.
 * Pre-establishes connections for faster initial queries.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} targetSize - Target number of connections to warm
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await warmConnectionPool(sequelize, 5);
 * console.log('Pool warmed and ready');
 * ```
 */
export declare function warmConnectionPool(sequelize: Sequelize, targetSize?: number): Promise<void>;
/**
 * 28. Detects and handles connection pool exhaustion.
 * Monitors pool and takes action when exhausted.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} options - Detection options
 * @returns {Function} Cleanup function
 *
 * @example
 * ```typescript
 * const stopMonitoring = detectPoolExhaustion(sequelize, {
 *   threshold: 0.9,
 *   onExhaustion: () => console.error('Pool exhausted!')
 * });
 * ```
 */
export declare function detectPoolExhaustion(sequelize: Sequelize, options?: {
    threshold?: number;
    checkInterval?: number;
    onExhaustion?: (stats: ConnectionPoolStats) => void;
}): () => void;
/**
 * 29. Implements intelligent query result caching.
 * Caches query results with smart invalidation.
 *
 * @param {object} options - Cache configuration
 * @returns {object} Cache manager instance
 *
 * @example
 * ```typescript
 * const cache = createQueryCache({ maxSize: 1000, defaultTtl: 300 });
 * const result = await cache.wrap('users:active', () => User.findAll());
 * ```
 */
export declare function createQueryCache(options?: {
    maxSize?: number;
    defaultTtl?: number;
    onEvict?: (entry: QueryCacheEntry) => void;
}): {
    get: (key: string) => any;
    set: (key: string, value: any, ttl?: number, tags?: string[]) => void;
    delete: (key: string) => void;
    clear: () => void;
    invalidateByTag: (tag: string) => number;
    wrap: <T>(key: string, fn: () => Promise<T>, ttl?: number, tags?: string[]) => Promise<T>;
    getStats: () => {
        size: number;
        hits: number;
        misses: number;
        hitRate: number;
    };
};
/**
 * 30. Implements cache invalidation strategies.
 * Provides multiple cache invalidation approaches.
 *
 * @param {object} cache - Cache instance
 * @param {object} strategy - Invalidation strategy config
 * @returns {object} Invalidation helpers
 *
 * @example
 * ```typescript
 * const invalidator = createCacheInvalidation(cache, {
 *   strategy: 'time-based',
 *   ttl: 300
 * });
 * invalidator.invalidatePattern('users:*');
 * ```
 */
export declare function createCacheInvalidation(cache: ReturnType<typeof createQueryCache>, strategy?: {
    type?: 'time-based' | 'event-based' | 'manual';
    patterns?: string[];
}): {
    invalidatePattern: (pattern: string) => void;
    invalidateTag: (tag: string) => number;
    invalidateAll: () => void;
    scheduleInvalidation: (key: string, delay: number) => void;
};
/**
 * 31. Implements distributed cache synchronization.
 * Syncs cache across multiple instances.
 *
 * @param {object} options - Sync configuration
 * @returns {object} Cache sync manager
 *
 * @example
 * ```typescript
 * const sync = createDistributedCacheSync({
 *   pubsub: redisPubSub,
 *   channel: 'cache-invalidation'
 * });
 * sync.broadcast('invalidate', 'users:123');
 * ```
 */
export declare function createDistributedCacheSync(options?: {
    pubsub?: any;
    channel?: string;
}): {
    broadcast: (action: string, key: string) => void;
    subscribe: (callback: (action: string, key: string) => void) => void;
};
/**
 * 32. Calculates optimal cache TTL based on data volatility.
 * Determines best TTL for different data types.
 *
 * @param {object} metrics - Data volatility metrics
 * @returns {number} Recommended TTL in seconds
 *
 * @example
 * ```typescript
 * const ttl = calculateOptimalCacheTTL({
 *   updateFrequency: 0.1, // 10% of records updated per hour
 *   readFrequency: 100,   // 100 reads per hour
 *   dataSize: 1024
 * });
 * ```
 */
export declare function calculateOptimalCacheTTL(metrics: {
    updateFrequency?: number;
    readFrequency?: number;
    dataSize?: number;
    staleTolerance?: number;
}): number;
/**
 * 33. Implements cache warming for frequently accessed data.
 * Preloads cache with hot data.
 *
 * @param {object} cache - Cache instance
 * @param {Function[]} loaders - Data loading functions
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await warmCache(cache, [
 *   () => User.findAll({ where: { role: 'admin' } }),
 *   () => Setting.findAll()
 * ]);
 * ```
 */
export declare function warmCache(cache: ReturnType<typeof createQueryCache>, loaders: Array<{
    key: string;
    loader: () => Promise<any>;
    ttl?: number;
    tags?: string[];
}>): Promise<void>;
/**
 * 34. Monitors cache performance and hit rates.
 * Tracks cache effectiveness metrics.
 *
 * @param {object} cache - Cache instance
 * @param {object} options - Monitoring options
 * @returns {Function} Stop monitoring function
 *
 * @example
 * ```typescript
 * const stop = monitorCachePerformance(cache, {
 *   interval: 60000,
 *   onReport: (stats) => console.log(stats)
 * });
 * ```
 */
export declare function monitorCachePerformance(cache: ReturnType<typeof createQueryCache>, options?: {
    interval?: number;
    onReport?: (stats: any) => void;
}): () => void;
/**
 * 35. Routes queries to appropriate database shard.
 * Implements consistent hashing for shard selection.
 *
 * @param {ShardConfig[]} shards - Available shards
 * @param {string | number} shardKey - Sharding key
 * @returns {Sequelize} Selected shard
 *
 * @example
 * ```typescript
 * const shard = routeToShard(shards, userId);
 * const user = await shard.models.User.findByPk(userId);
 * ```
 */
export declare function routeToShard(shards: ShardConfig[], shardKey: string | number): Sequelize;
/**
 * 36. Implements read replica load balancing.
 * Distributes read queries across replicas.
 *
 * @param {ReadReplicaConfig[]} replicas - Available read replicas
 * @param {object} options - Load balancing options
 * @returns {Sequelize} Selected replica
 *
 * @example
 * ```typescript
 * const replica = selectReadReplica(replicas, { strategy: 'round-robin' });
 * const users = await replica.models.User.findAll();
 * ```
 */
export declare function selectReadReplica(replicas: ReadReplicaConfig[], options?: {
    strategy?: 'round-robin' | 'weighted' | 'least-lag';
}): Sequelize;
/**
 * 37. Monitors replication lag across replicas.
 * Checks replica health and lag.
 *
 * @param {ReadReplicaConfig[]} replicas - Read replicas to monitor
 * @returns {Promise<object[]>} Replication status
 *
 * @example
 * ```typescript
 * const status = await monitorReplicationLag(replicas);
 * status.forEach(s => {
 *   if (s.lagMs > 1000) console.warn(`High lag: ${s.lagMs}ms`);
 * });
 * ```
 */
export declare function monitorReplicationLag(replicas: ReadReplicaConfig[]): Promise<Array<{
    name: string;
    healthy: boolean;
    lagMs: number;
    error?: string;
}>>;
/**
 * 38. Implements automatic failover for database instances.
 * Switches to backup when primary fails.
 *
 * @param {object} config - Failover configuration
 * @returns {object} Failover manager
 *
 * @example
 * ```typescript
 * const manager = createFailoverManager({
 *   primary: primaryDb,
 *   replicas: [replica1, replica2],
 *   healthCheckInterval: 10000
 * });
 * const db = manager.getActiveConnection();
 * ```
 */
export declare function createFailoverManager(config: {
    primary: Sequelize;
    replicas: Sequelize[];
    healthCheckInterval?: number;
    onFailover?: (from: string, to: string) => void;
}): {
    getActiveConnection: () => Sequelize;
    getCurrentRole: () => 'primary' | 'replica';
    forceFailover: () => void;
};
/**
 * 39. Distributes writes across multiple shards.
 * Implements multi-shard write operations.
 *
 * @param {ShardConfig[]} shards - Target shards
 * @param {object[]} data - Data to write
 * @param {Function} shardKeyFn - Function to extract shard key
 * @returns {Promise<object>} Write results
 *
 * @example
 * ```typescript
 * const results = await distributeWrites(
 *   shards,
 *   users,
 *   (user) => user.id
 * );
 * ```
 */
export declare function distributeWrites<T>(shards: ShardConfig[], data: T[], shardKeyFn: (item: T) => string | number): Promise<{
    success: number;
    failed: number;
    errors: Error[];
}>;
/**
 * 40. Implements cross-shard query aggregation.
 * Aggregates results from multiple shards.
 *
 * @param {ShardConfig[]} shards - Shards to query
 * @param {Function} queryFn - Query function
 * @param {Function} aggregateFn - Aggregation function
 * @returns {Promise<any>} Aggregated results
 *
 * @example
 * ```typescript
 * const totalUsers = await aggregateCrossShard(
 *   shards,
 *   (shard) => shard.models.User.count(),
 *   (counts) => counts.reduce((a, b) => a + b, 0)
 * );
 * ```
 */
export declare function aggregateCrossShard<T, R>(shards: ShardConfig[], queryFn: (shard: Sequelize) => Promise<T>, aggregateFn: (results: T[]) => R): Promise<R>;
/**
 * 41. Creates comprehensive performance monitoring dashboard data.
 * Aggregates all performance metrics.
 *
 * @param {object} sources - Metric sources
 * @returns {object} Dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = createPerformanceDashboard({
 *   queryMetrics,
 *   poolStats,
 *   cacheStats
 * });
 * ```
 */
export declare function createPerformanceDashboard(sources: {
    queryMetrics?: QueryPerformanceMetrics[];
    poolStats?: ConnectionPoolStats;
    cacheStats?: ReturnType<ReturnType<typeof createQueryCache>['getStats']>;
    nPlusOneDetections?: NPlusOneDetection[];
}): {
    overview: {
        health: 'good' | 'warning' | 'critical';
        score: number;
    };
    queries: {
        total: number;
        avgTime: number;
        slowQueries: number;
        nPlusOneIssues: number;
    };
    pool: ConnectionPoolStats;
    cache: {
        hitRate: number;
        size: number;
        hits: number;
        misses: number;
    };
    recommendations: string[];
};
/**
 * 42. Implements automated performance regression detection.
 * Compares performance over time.
 *
 * @param {object} baseline - Baseline metrics
 * @param {object} current - Current metrics
 * @returns {object} Regression analysis
 *
 * @example
 * ```typescript
 * const regressions = detectPerformanceRegressions(
 *   baselineMetrics,
 *   currentMetrics
 * );
 * ```
 */
export declare function detectPerformanceRegressions(baseline: {
    avgQueryTime?: number;
    poolUtilization?: number;
    cacheHitRate?: number;
}, current: {
    avgQueryTime?: number;
    poolUtilization?: number;
    cacheHitRate?: number;
}): {
    regressions: Array<{
        metric: string;
        baseline: number;
        current: number;
        degradation: number;
        severity: 'critical' | 'warning' | 'info';
    }>;
    overall: 'degraded' | 'stable' | 'improved';
};
/**
 * 43. Generates performance optimization recommendations.
 * AI-powered suggestions based on metrics.
 *
 * @param {object} metrics - Performance metrics
 * @returns {OptimizationSuggestion[]} Prioritized suggestions
 *
 * @example
 * ```typescript
 * const suggestions = generateOptimizationRecommendations({
 *   queryMetrics,
 *   poolStats,
 *   cacheStats
 * });
 * ```
 */
export declare function generateOptimizationRecommendations(metrics: {
    queryMetrics?: QueryPerformanceMetrics[];
    poolStats?: ConnectionPoolStats;
    cacheStats?: any;
    indexAnalysis?: any[];
}): OptimizationSuggestion[];
/**
 * 44. Exports performance metrics in various formats.
 * Generates reports for monitoring systems.
 *
 * @param {object} metrics - Metrics to export
 * @param {string} format - Export format
 * @returns {string} Formatted metrics
 *
 * @example
 * ```typescript
 * const json = exportPerformanceMetrics(metrics, 'json');
 * const prometheus = exportPerformanceMetrics(metrics, 'prometheus');
 * ```
 */
export declare function exportPerformanceMetrics(metrics: {
    queryMetrics?: QueryPerformanceMetrics[];
    poolStats?: ConnectionPoolStats;
    cacheStats?: any;
}, format?: 'json' | 'prometheus' | 'csv'): string;
/**
 * 45. Implements real-time performance alerting.
 * Monitors and alerts on performance issues.
 *
 * @param {object} thresholds - Alert thresholds
 * @param {Function} alertFn - Alert callback
 * @returns {Function} Monitoring function
 *
 * @example
 * ```typescript
 * const stopAlerting = setupPerformanceAlerting({
 *   slowQueryMs: 1000,
 *   poolUtilization: 90,
 *   cacheHitRate: 0.3
 * }, (alert) => console.error(alert));
 * ```
 */
export declare function setupPerformanceAlerting(thresholds: {
    slowQueryMs?: number;
    poolUtilization?: number;
    cacheHitRate?: number;
    nPlusOneCount?: number;
}, alertFn: (alert: {
    level: 'critical' | 'warning' | 'info';
    metric: string;
    value: number;
    threshold: number;
    message: string;
}) => void): () => void;
//# sourceMappingURL=sequelize-optimization-kit.d.ts.map