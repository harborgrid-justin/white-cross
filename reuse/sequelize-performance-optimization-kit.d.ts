/**
 * LOC: SPOK1234567
 * File: /reuse/sequelize-performance-optimization-kit.ts
 *
 * UPSTREAM (imports from):
 *   - Sequelize ORM 6.x
 *   - @nestjs/common
 *   - ioredis (for caching)
 *
 * DOWNSTREAM (imported by):
 *   - Service layer components
 *   - Repository implementations
 *   - Performance monitoring services
 *   - Database optimization modules
 */
/**
 * File: /reuse/sequelize-performance-optimization-kit.ts
 * Locator: WC-UTL-SPOK-001
 * Purpose: Sequelize Performance Optimization Kit - Advanced performance tuning, monitoring, and optimization utilities
 *
 * Upstream: Sequelize 6.x, @nestjs/common, ioredis, pg/mysql2 drivers
 * Downstream: ../backend/*, ../services/*, repository layer, monitoring services
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize 6.x, ioredis 5.x
 * Exports: 45 utility functions for N+1 detection, query optimization, index analysis, caching, batching, profiling, monitoring
 *
 * LLM Context: Comprehensive Sequelize performance optimization utilities for White Cross healthcare system.
 * Provides N+1 query detection and prevention, query optimization analysis, index recommendations, EXPLAIN plan parsing,
 * connection pool tuning, multi-layer caching, eager/lazy loading optimization, bulk operation batching, query profiling,
 * slow query logging, deadlock detection, lock optimization, transaction isolation strategies, query hints, database statistics,
 * and real-time performance monitoring. Essential for maintaining high-performance, scalable healthcare database operations.
 */
import { Sequelize, Model, ModelStatic, FindOptions, Transaction, WhereOptions } from 'sequelize';
export interface N1DetectionResult {
    detected: boolean;
    queryCount: number;
    suspiciousPatterns: string[];
    recommendations: string[];
    severity: 'low' | 'medium' | 'high' | 'critical';
}
export interface QueryOptimizationResult {
    originalQuery: string;
    optimizedQuery?: string;
    estimatedImprovement: number;
    recommendations: string[];
    indexSuggestions: string[];
    warnings: string[];
}
export interface ExplainPlanResult {
    planSteps: ExplainPlanStep[];
    totalCost: number;
    estimatedRows: number;
    warnings: string[];
    indexUsage: IndexUsageInfo[];
    recommendations: string[];
}
interface ExplainPlanStep {
    operation: string;
    table?: string;
    cost: number;
    rows: number;
    accessMethod: string;
    filter?: string;
}
interface IndexUsageInfo {
    indexName: string;
    table: string;
    used: boolean;
    reason?: string;
}
interface IndexAnalysisResult {
    table: string;
    existingIndexes: IndexInfo[];
    missingIndexes: IndexRecommendation[];
    unusedIndexes: string[];
    duplicateIndexes: string[][];
    fragmentationLevel: number;
}
interface IndexInfo {
    name: string;
    columns: string[];
    unique: boolean;
    type: string;
    size: number;
    usageCount: number;
}
interface IndexRecommendation {
    columns: string[];
    reason: string;
    estimatedImprovement: number;
    priority: 'low' | 'medium' | 'high';
    createStatement: string;
}
export interface ConnectionPoolMetrics {
    activeConnections: number;
    idleConnections: number;
    waitingRequests: number;
    totalConnections: number;
    maxConnections: number;
    utilizationPercent: number;
    averageWaitTime: number;
    peakConnections: number;
}
interface CacheConfig {
    ttl: number;
    maxSize?: number;
    strategy: 'lru' | 'lfu' | 'fifo';
    keyPrefix?: string;
    invalidateOn?: string[];
}
export interface CacheStats {
    hits: number;
    misses: number;
    hitRate: number;
    size: number;
    evictions: number;
}
interface BatchProcessingConfig {
    batchSize: number;
    concurrency?: number;
    delayBetweenBatches?: number;
    onProgress?: (processed: number, total: number) => void;
    onError?: (error: Error, batch: any[]) => void;
}
interface QueryProfile {
    query: string;
    duration: number;
    timestamp: Date;
    executionPlan?: ExplainPlanResult;
    rowsAffected: number;
    cacheHit: boolean;
    source?: string;
}
interface SlowQueryLog {
    query: string;
    duration: number;
    timestamp: Date;
    stackTrace?: string;
    parameters?: any[];
    threshold: number;
    severity: 'warning' | 'critical';
}
interface DeadlockInfo {
    timestamp: Date;
    transactions: TransactionInfo[];
    resolution: string;
    affectedTables: string[];
    waitGraph: DeadlockEdge[];
}
interface TransactionInfo {
    id: string;
    query: string;
    locksHeld: string[];
    locksWaiting: string[];
    duration: number;
}
interface DeadlockEdge {
    from: string;
    to: string;
    resource: string;
}
interface LockOptimizationResult {
    currentLockMode: string;
    recommendedLockMode: string;
    reason: string;
    estimatedImpact: number;
}
interface IsolationLevelRecommendation {
    currentLevel: string;
    recommendedLevel: string;
    reason: string;
    tradeoffs: string[];
}
interface QueryHint {
    hint: string;
    applicability: string;
    expectedImprovement: number;
    risks: string[];
}
export interface DatabaseStatistics {
    tableStats: TableStats[];
    indexStats: IndexStats[];
    queryStats: QueryStats;
    connectionStats: ConnectionPoolMetrics;
    cacheStats: CacheStats;
}
interface TableStats {
    table: string;
    rowCount: number;
    dataSize: number;
    indexSize: number;
    fragmentationPercent: number;
    lastAnalyzed?: Date;
    lastVacuum?: Date;
}
interface IndexStats {
    index: string;
    table: string;
    scans: number;
    tuplesRead: number;
    tuplesReturned: number;
    selectivity: number;
}
interface QueryStats {
    totalQueries: number;
    slowQueries: number;
    averageDuration: number;
    medianDuration: number;
    p95Duration: number;
    p99Duration: number;
}
export interface PerformanceAlert {
    type: string;
    severity: 'info' | 'warning' | 'critical';
    message: string;
    timestamp: Date;
    metrics: Record<string, unknown>;
    recommendations: string[];
}
interface EagerLoadingConfig {
    associations: string[];
    attributes?: string[];
    separate?: boolean;
    required?: boolean;
    paranoid?: boolean;
}
interface LazyLoadingConfig {
    preload?: string[];
    lazyAttributes?: string[];
    fetchStrategy?: 'immediate' | 'batched' | 'deferred';
}
export interface BulkOperationResult {
    processed: number;
    succeeded: number;
    failed: number;
    duration: number;
    errors: Array<{
        batch?: unknown;
        error: Error | unknown;
    }>;
}
interface QueryBatchResult {
    queries: number;
    totalDuration: number;
    averageDuration: number;
    cacheHits: number;
    errors: number;
}
/**
 * 1. Detects N+1 query patterns in Sequelize operations by monitoring query execution.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} threshold - Number of similar queries to trigger detection (default: 5)
 * @returns {Promise<N1DetectionResult>} Detection results with recommendations
 * @throws {Error} When threshold is invalid
 *
 * @example
 * ```typescript
 * const result = await detectN1Queries(sequelize, 10);
 * if (result.detected) {
 *   console.log('N+1 detected:', result.recommendations);
 * }
 * ```
 */
export declare const detectN1Queries: (sequelize: Sequelize, threshold?: number) => Promise<N1DetectionResult>;
/**
 * 2. Prevents N+1 queries by automatically configuring eager loading for associations.
 *
 * @param {ModelStatic<any>} model - Sequelize model
 * @param {string[]} associations - Association names to eager load
 * @param {FindOptions} options - Base query options
 * @returns {FindOptions} Options with optimized eager loading
 *
 * @example
 * ```typescript
 * const options = preventN1WithEagerLoading(User, ['posts', 'comments'], {
 *   where: { active: true }
 * });
 * const users = await User.findAll(options);
 * ```
 */
export declare const preventN1WithEagerLoading: <M extends Model>(model: ModelStatic<M>, associations: string[], options?: FindOptions<M>) => FindOptions<M>;
/**
 * 3. Implements dataloader pattern for efficient batch loading of associations.
 *
 * @param {ModelStatic<any>} model - Sequelize model
 * @param {string} foreignKey - Foreign key field
 * @param {any[]} ids - IDs to load
 * @returns {Promise<Map<any, any[]>>} Map of ID to loaded records
 *
 * @example
 * ```typescript
 * const userPosts = await batchLoadAssociations(Post, 'userId', [1, 2, 3]);
 * const user1Posts = userPosts.get(1);
 * ```
 */
export declare const batchLoadAssociations: <M extends Model>(model: ModelStatic<M>, foreignKey: string, ids: any[]) => Promise<Map<any, M[]>>;
/**
 * 4. Monitors query execution to identify sequential query patterns indicating N+1.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Function} operation - Async operation to monitor
 * @returns {Promise<{ result: any; analysis: N1DetectionResult }>} Operation result and analysis
 *
 * @example
 * ```typescript
 * const { result, analysis } = await monitorN1Patterns(sequelize, async () => {
 *   return await User.findAll({ include: [Post] });
 * });
 * ```
 */
export declare const monitorN1Patterns: <T>(sequelize: Sequelize, operation: () => Promise<T>) => Promise<{
    result: T;
    analysis: N1DetectionResult;
}>;
/**
 * 5. Analyzes and optimizes Sequelize query options for better performance.
 *
 * @param {FindOptions} options - Original query options
 * @param {ModelStatic<any>} model - Sequelize model
 * @returns {QueryOptimizationResult} Optimization analysis and suggestions
 *
 * @example
 * ```typescript
 * const optimization = analyzeQueryOptimization({
 *   where: { status: 'active' },
 *   include: [{ all: true }]
 * }, User);
 * ```
 */
export declare const analyzeQueryOptimization: <M extends Model>(options: FindOptions<M>, model: ModelStatic<M>) => QueryOptimizationResult;
/**
 * 6. Optimizes WHERE clause conditions for better query performance.
 *
 * @param {WhereOptions} where - WHERE conditions
 * @returns {WhereOptions} Optimized WHERE conditions
 *
 * @example
 * ```typescript
 * const optimized = optimizeWhereClause({
 *   [Op.or]: [{ status: 'active' }, { priority: 'high' }]
 * });
 * ```
 */
export declare const optimizeWhereClause: (where: WhereOptions) => WhereOptions;
/**
 * 7. Generates optimized query hints for specific database dialects.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} queryType - Type of query ('select' | 'insert' | 'update' | 'delete')
 * @returns {QueryHint[]} Applicable query hints
 *
 * @example
 * ```typescript
 * const hints = generateQueryHints(sequelize, 'select');
 * // Apply hints to optimize query execution
 * ```
 */
export declare const generateQueryHints: (sequelize: Sequelize, queryType: string) => QueryHint[];
/**
 * 8. Rewrites queries to use more efficient patterns.
 *
 * @param {string} sql - Original SQL query
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {string} Rewritten query
 *
 * @example
 * ```typescript
 * const optimizedSql = rewriteQueryForPerformance(
 *   'SELECT * FROM users WHERE id IN (SELECT user_id FROM posts)',
 *   sequelize
 * );
 * ```
 */
export declare const rewriteQueryForPerformance: (sql: string, sequelize: Sequelize) => string;
/**
 * 9. Analyzes table indexes and provides optimization recommendations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name to analyze
 * @returns {Promise<IndexAnalysisResult>} Index analysis results
 *
 * @example
 * ```typescript
 * const analysis = await analyzeTableIndexes(sequelize, 'users');
 * console.log('Missing indexes:', analysis.missingIndexes);
 * ```
 */
export declare const analyzeTableIndexes: (sequelize: Sequelize, tableName: string) => Promise<IndexAnalysisResult>;
/**
 * 10. Recommends composite indexes based on query patterns.
 *
 * @param {string[]} queryPatterns - Array of WHERE clause patterns
 * @param {string} tableName - Table name
 * @returns {IndexRecommendation[]} Recommended composite indexes
 *
 * @example
 * ```typescript
 * const recommendations = recommendCompositeIndexes(
 *   ['status = ? AND created_at > ?', 'user_id = ? AND status = ?'],
 *   'orders'
 * );
 * ```
 */
export declare const recommendCompositeIndexes: (queryPatterns: string[], tableName: string) => IndexRecommendation[];
/**
 * 11. Checks index fragmentation and suggests maintenance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @returns {Promise<{ fragmentation: number; recommendation: string }>} Fragmentation analysis
 *
 * @example
 * ```typescript
 * const { fragmentation, recommendation } = await checkIndexFragmentation(sequelize, 'users');
 * ```
 */
export declare const checkIndexFragmentation: (sequelize: Sequelize, tableName: string) => Promise<{
    fragmentation: number;
    recommendation: string;
}>;
/**
 * 12. Generates covering index suggestions for specific queries.
 *
 * @param {FindOptions} queryOptions - Sequelize query options
 * @param {string} tableName - Table name
 * @returns {IndexRecommendation[]} Covering index recommendations
 *
 * @example
 * ```typescript
 * const coveringIndexes = suggestCoveringIndexes({
 *   where: { status: 'active' },
 *   attributes: ['id', 'name', 'email']
 * }, 'users');
 * ```
 */
export declare const suggestCoveringIndexes: (queryOptions: FindOptions, tableName: string) => IndexRecommendation[];
/**
 * 13. Executes EXPLAIN on a query and parses the execution plan.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sql - SQL query to explain
 * @param {any[]} bindings - Query parameter bindings
 * @returns {Promise<ExplainPlanResult>} Parsed execution plan
 *
 * @example
 * ```typescript
 * const plan = await explainQuery(sequelize, 'SELECT * FROM users WHERE id = ?', [1]);
 * console.log('Estimated cost:', plan.totalCost);
 * ```
 */
export declare const explainQuery: (sequelize: Sequelize, sql: string, bindings?: any[]) => Promise<ExplainPlanResult>;
/**
 * 14. Parses raw EXPLAIN output into structured format.
 *
 * @param {any} explainOutput - Raw EXPLAIN output
 * @param {string} dialect - Database dialect
 * @returns {ExplainPlanResult} Structured execution plan
 *
 * @example
 * ```typescript
 * const parsed = parseExplainPlan(rawOutput, 'postgres');
 * ```
 */
export declare const parseExplainPlan: (explainOutput: any, dialect: string) => ExplainPlanResult;
/**
 * 15. Compares execution plans to identify performance regressions.
 *
 * @param {ExplainPlanResult} baseline - Baseline execution plan
 * @param {ExplainPlanResult} current - Current execution plan
 * @returns {{ regression: boolean; details: string[] }} Comparison result
 *
 * @example
 * ```typescript
 * const comparison = compareExecutionPlans(baselinePlan, currentPlan);
 * if (comparison.regression) {
 *   console.log('Performance regression detected!');
 * }
 * ```
 */
export declare const compareExecutionPlans: (baseline: ExplainPlanResult, current: ExplainPlanResult) => {
    regression: boolean;
    details: string[];
};
/**
 * 16. Analyzes connection pool metrics and suggests optimal configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<ConnectionPoolMetrics>} Pool metrics
 *
 * @example
 * ```typescript
 * const metrics = await analyzeConnectionPool(sequelize);
 * console.log('Utilization:', metrics.utilizationPercent + '%');
 * ```
 */
export declare const analyzeConnectionPool: (sequelize: Sequelize) => Promise<ConnectionPoolMetrics>;
/**
 * 17. Recommends optimal pool size based on workload analysis.
 *
 * @param {number} avgQueryDuration - Average query duration in ms
 * @param {number} requestsPerSecond - Expected requests per second
 * @returns {{ min: number; max: number; idle: number; acquire: number }} Pool config
 *
 * @example
 * ```typescript
 * const config = recommendPoolSize(50, 100);
 * ```
 */
export declare const recommendPoolSize: (avgQueryDuration: number, requestsPerSecond: number) => {
    min: number;
    max: number;
    idle: number;
    acquire: number;
};
/**
 * 18. Detects and reports connection pool exhaustion issues.
 *
 * @param {ConnectionPoolMetrics} metrics - Current pool metrics
 * @returns {PerformanceAlert[]} Alerts for pool issues
 *
 * @example
 * ```typescript
 * const alerts = detectPoolExhaustion(metrics);
 * ```
 */
export declare const detectPoolExhaustion: (metrics: ConnectionPoolMetrics) => PerformanceAlert[];
/**
 * 19. Monitors connection acquisition times and identifies bottlenecks.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} duration - Monitoring duration in ms
 * @returns {Promise<{ avgTime: number; maxTime: number; p95Time: number }>} Acquisition metrics
 *
 * @example
 * ```typescript
 * const times = await monitorConnectionAcquisition(sequelize, 60000);
 * ```
 */
export declare const monitorConnectionAcquisition: (sequelize: Sequelize, duration?: number) => Promise<{
    avgTime: number;
    maxTime: number;
    p95Time: number;
}>;
/**
 * 20. Implements query result caching with automatic invalidation.
 *
 * @param {string} key - Cache key
 * @param {Function} queryFn - Query function to cache
 * @param {CacheConfig} config - Cache configuration
 * @returns {Promise<any>} Cached or fresh query result
 *
 * @example
 * ```typescript
 * const users = await cacheQueryResult('active_users',
 *   () => User.findAll({ where: { active: true }}),
 *   { ttl: 300, strategy: 'lru' }
 * );
 * ```
 */
export declare const cacheQueryResult: <T>(key: string, queryFn: () => Promise<T>, config: CacheConfig) => Promise<T>;
/**
 * 21. Creates a cache wrapper for Sequelize models with smart invalidation.
 *
 * @param {ModelStatic<any>} model - Sequelize model to cache
 * @param {CacheConfig} config - Cache configuration
 * @returns {ModelStatic<any>} Cached model wrapper
 *
 * @example
 * ```typescript
 * const CachedUser = createCachedModel(User, {
 *   ttl: 600,
 *   strategy: 'lru',
 *   invalidateOn: ['create', 'update', 'destroy']
 * });
 * ```
 */
export declare const createCachedModel: <M extends Model>(model: ModelStatic<M>, config: CacheConfig) => any;
/**
 * 22. Implements cache warming for frequently accessed queries.
 *
 * @param {Map<string, Function>} queries - Map of cache keys to query functions
 * @param {CacheConfig} config - Cache configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await warmQueryCache(new Map([
 *   ['active_users', () => User.findAll({ where: { active: true }})],
 *   ['recent_posts', () => Post.findAll({ limit: 100, order: [['createdAt', 'DESC']]})]
 * ]), { ttl: 600, strategy: 'lru' });
 * ```
 */
export declare const warmQueryCache: (queries: Map<string, () => Promise<any>>, config: CacheConfig) => Promise<void>;
/**
 * 23. Provides cache statistics and hit rate analysis.
 *
 * @returns {CacheStats} Cache statistics
 *
 * @example
 * ```typescript
 * const stats = getCacheStats();
 * console.log('Hit rate:', stats.hitRate * 100 + '%');
 * ```
 */
export declare const getCacheStats: () => CacheStats;
/**
 * 24. Optimizes eager loading to minimize query count and data transfer.
 *
 * @param {FindOptions} options - Base query options
 * @param {EagerLoadingConfig[]} associations - Associations to eager load
 * @returns {FindOptions} Optimized options with eager loading
 *
 * @example
 * ```typescript
 * const options = optimizeEagerLoading({}, [
 *   { associations: ['posts', 'comments'], separate: true }
 * ]);
 * ```
 */
export declare const optimizeEagerLoading: (options: FindOptions, associations: EagerLoadingConfig[]) => FindOptions;
/**
 * 25. Implements lazy loading with batching for better performance.
 *
 * @param {Model[]} instances - Model instances
 * @param {string} association - Association to lazy load
 * @param {LazyLoadingConfig} config - Lazy loading configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await lazyLoadWithBatching(users, 'posts', {
 *   fetchStrategy: 'batched'
 * });
 * ```
 */
export declare const lazyLoadWithBatching: (instances: Model[], association: string, config?: LazyLoadingConfig) => Promise<void>;
/**
 * 26. Analyzes and suggests optimal loading strategy (eager vs lazy).
 *
 * @param {number} parentCount - Number of parent records
 * @param {number} avgChildrenPerParent - Average children per parent
 * @param {number} childRecordSize - Average child record size in bytes
 * @returns {{ strategy: 'eager' | 'lazy' | 'separate'; reason: string }}
 *
 * @example
 * ```typescript
 * const { strategy, reason } = suggestLoadingStrategy(100, 50, 1024);
 * ```
 */
export declare const suggestLoadingStrategy: (parentCount: number, avgChildrenPerParent: number, childRecordSize: number) => {
    strategy: "eager" | "lazy" | "separate";
    reason: string;
};
/**
 * 27. Processes bulk operations in optimized batches with progress tracking.
 *
 * @param {any[]} items - Items to process
 * @param {Function} operation - Async operation for each batch
 * @param {BatchProcessingConfig} config - Batch processing configuration
 * @returns {Promise<BulkOperationResult>} Processing results
 *
 * @example
 * ```typescript
 * const result = await processBulkOperation(users, async (batch) => {
 *   await User.bulkCreate(batch);
 * }, { batchSize: 100, concurrency: 5 });
 * ```
 */
export declare const processBulkOperation: <T>(items: T[], operation: (batch: T[]) => Promise<void>, config: BatchProcessingConfig) => Promise<BulkOperationResult>;
/**
 * 28. Optimizes bulk insert operations with conflict resolution.
 *
 * @param {ModelStatic<any>} model - Sequelize model
 * @param {any[]} records - Records to insert
 * @param {object} options - Bulk insert options
 * @returns {Promise<BulkOperationResult>} Insert results
 *
 * @example
 * ```typescript
 * const result = await optimizedBulkInsert(User, users, {
 *   updateOnDuplicate: ['email', 'name'],
 *   batchSize: 1000
 * });
 * ```
 */
export declare const optimizedBulkInsert: <M extends Model>(model: ModelStatic<M>, records: any[], options?: {
    updateOnDuplicate?: string[];
    batchSize?: number;
    transaction?: Transaction;
    validate?: boolean;
}) => Promise<BulkOperationResult>;
/**
 * 29. Implements efficient bulk update with optimistic locking.
 *
 * @param {ModelStatic<any>} model - Sequelize model
 * @param {any[]} updates - Updates to apply
 * @param {string} identifierField - Field to identify records
 * @returns {Promise<BulkOperationResult>} Update results
 *
 * @example
 * ```typescript
 * const result = await bulkUpdateWithLocking(User,
 *   [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }],
 *   'id'
 * );
 * ```
 */
export declare const bulkUpdateWithLocking: <M extends Model>(model: ModelStatic<M>, updates: any[], identifierField?: string) => Promise<BulkOperationResult>;
/**
 * 30. Batches multiple queries for execution in a single round-trip.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Function[]} queries - Array of query functions
 * @returns {Promise<QueryBatchResult>} Batch execution results
 *
 * @example
 * ```typescript
 * const result = await batchQueries(sequelize, [
 *   () => User.findAll(),
 *   () => Post.findAll(),
 *   () => Comment.count()
 * ]);
 * ```
 */
export declare const batchQueries: (sequelize: Sequelize, queries: (() => Promise<any>)[]) => Promise<QueryBatchResult>;
/**
 * 31. Sets up comprehensive query profiling with detailed metrics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} options - Profiling options
 * @returns {Function} Function to stop profiling
 *
 * @example
 * ```typescript
 * const stopProfiling = setupQueryProfiler(sequelize, {
 *   slowQueryThreshold: 1000,
 *   logToFile: true
 * });
 * ```
 */
export declare const setupQueryProfiler: (sequelize: Sequelize, options?: {
    slowQueryThreshold?: number;
    logToFile?: boolean;
    onSlowQuery?: (profile: QueryProfile) => void;
}) => (() => void);
/**
 * 32. Tracks and logs slow queries with configurable thresholds.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} threshold - Slow query threshold in ms
 * @param {Function} logger - Custom logger function
 * @returns {Function} Function to stop tracking
 *
 * @example
 * ```typescript
 * const stop = trackSlowQueries(sequelize, 500, (log) => {
 *   console.warn('Slow query:', log);
 * });
 * ```
 */
export declare const trackSlowQueries: (sequelize: Sequelize, threshold?: number, logger?: (log: SlowQueryLog) => void) => (() => void);
/**
 * 33. Generates comprehensive performance reports from collected metrics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startTime - Report start time
 * @param {Date} endTime - Report end time
 * @returns {Promise<DatabaseStatistics>} Performance report
 *
 * @example
 * ```typescript
 * const report = await generatePerformanceReport(
 *   sequelize,
 *   new Date(Date.now() - 3600000),
 *   new Date()
 * );
 * ```
 */
export declare const generatePerformanceReport: (sequelize: Sequelize, startTime: Date, endTime: Date) => Promise<DatabaseStatistics>;
/**
 * 34. Profiles a specific operation and returns detailed performance data.
 *
 * @param {Function} operation - Async operation to profile
 * @returns {Promise<{ result: any; profile: QueryProfile }>} Operation result and profile
 *
 * @example
 * ```typescript
 * const { result, profile } = await profileOperation(async () => {
 *   return await User.findAll({ include: [Post] });
 * });
 * ```
 */
export declare const profileOperation: <T>(operation: () => Promise<T>) => Promise<{
    result: T;
    profile: QueryProfile;
}>;
/**
 * 35. Detects and analyzes database deadlocks.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<DeadlockInfo[]>} Detected deadlocks
 *
 * @example
 * ```typescript
 * const deadlocks = await detectDeadlocks(sequelize);
 * ```
 */
export declare const detectDeadlocks: (sequelize: Sequelize) => Promise<DeadlockInfo[]>;
/**
 * 36. Recommends optimal lock modes for query patterns.
 *
 * @param {string} queryPattern - Query pattern to analyze
 * @param {string} isolationLevel - Current isolation level
 * @returns {LockOptimizationResult} Lock optimization recommendation
 *
 * @example
 * ```typescript
 * const optimization = recommendLockMode('SELECT FOR UPDATE', 'READ COMMITTED');
 * ```
 */
export declare const recommendLockMode: (queryPattern: string, isolationLevel: string) => LockOptimizationResult;
/**
 * 37. Implements retry logic with exponential backoff for deadlock scenarios.
 *
 * @param {Function} operation - Operation to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @returns {Promise<any>} Operation result
 *
 * @example
 * ```typescript
 * const result = await retryOnDeadlock(async () => {
 *   return await sequelize.transaction(async (t) => {
 *     // transaction operations
 *   });
 * }, 3);
 * ```
 */
export declare const retryOnDeadlock: <T>(operation: () => Promise<T>, maxRetries?: number) => Promise<T>;
/**
 * 38. Monitors lock wait times and identifies contention points.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{ table: string; lockWaitTime: number }[]>} Lock wait statistics
 *
 * @example
 * ```typescript
 * const lockStats = await monitorLockWaitTimes(sequelize);
 * ```
 */
export declare const monitorLockWaitTimes: (sequelize: Sequelize) => Promise<{
    table: string;
    lockWaitTime: number;
}[]>;
/**
 * 39. Recommends optimal transaction isolation level based on use case.
 *
 * @param {object} requirements - Transaction requirements
 * @returns {IsolationLevelRecommendation} Isolation level recommendation
 *
 * @example
 * ```typescript
 * const recommendation = recommendIsolationLevel({
 *   requiresConsistentReads: true,
 *   allowsPhantomReads: false,
 *   performancePriority: 'high'
 * });
 * ```
 */
export declare const recommendIsolationLevel: (requirements: {
    requiresConsistentReads: boolean;
    allowsPhantomReads: boolean;
    performancePriority: "low" | "medium" | "high";
}) => IsolationLevelRecommendation;
/**
 * 40. Optimizes transaction scope to minimize lock duration.
 *
 * @param {Function} operation - Transaction operation
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Transaction result
 *
 * @example
 * ```typescript
 * const result = await optimizeTransactionScope(async (t) => {
 *   // Only critical operations here
 *   await User.update({ status: 'active' }, { where: { id: 1 }, transaction: t });
 * }, sequelize);
 * ```
 */
export declare const optimizeTransactionScope: <T>(operation: (transaction: Transaction) => Promise<T>, sequelize: Sequelize) => Promise<T>;
/**
 * 41. Collects comprehensive database statistics for analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @returns {Promise<TableStats>} Table statistics
 *
 * @example
 * ```typescript
 * const stats = await getTableStatistics(sequelize, 'users');
 * ```
 */
export declare const getTableStatistics: (sequelize: Sequelize, tableName: string) => Promise<TableStats>;
/**
 * 42. Monitors database health metrics in real-time.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} interval - Monitoring interval in ms
 * @param {Function} callback - Callback for health updates
 * @returns {Function} Function to stop monitoring
 *
 * @example
 * ```typescript
 * const stopMonitoring = monitorDatabaseHealth(sequelize, 5000, (health) => {
 *   console.log('DB Health:', health);
 * });
 * ```
 */
export declare const monitorDatabaseHealth: (sequelize: Sequelize, interval: number | undefined, callback: (health: any) => void) => (() => void);
/**
 * 43. Analyzes query patterns to identify optimization opportunities.
 *
 * @param {QueryProfile[]} profiles - Query execution profiles
 * @returns {{ patterns: Map<string, number>; recommendations: string[] }}
 *
 * @example
 * ```typescript
 * const analysis = analyzeQueryPatterns(collectedProfiles);
 * ```
 */
export declare const analyzeQueryPatterns: (profiles: QueryProfile[]) => {
    patterns: Map<string, number>;
    recommendations: string[];
};
/**
 * 44. Generates alerts based on performance thresholds.
 *
 * @param {DatabaseStatistics} stats - Current database statistics
 * @param {object} thresholds - Performance thresholds
 * @returns {PerformanceAlert[]} Generated alerts
 *
 * @example
 * ```typescript
 * const alerts = generatePerformanceAlerts(stats, {
 *   slowQueryThreshold: 1000,
 *   poolUtilizationThreshold: 80
 * });
 * ```
 */
export declare const generatePerformanceAlerts: (stats: DatabaseStatistics, thresholds?: {
    slowQueryThreshold?: number;
    poolUtilizationThreshold?: number;
    cacheHitRateThreshold?: number;
}) => PerformanceAlert[];
/**
 * 45. Exports performance metrics to monitoring systems (Prometheus, Datadog, etc.).
 *
 * @param {DatabaseStatistics} stats - Database statistics to export
 * @param {string} format - Export format ('prometheus' | 'json' | 'datadog')
 * @returns {string} Formatted metrics
 *
 * @example
 * ```typescript
 * const metrics = exportPerformanceMetrics(stats, 'prometheus');
 * // Send to monitoring system
 * ```
 */
export declare const exportPerformanceMetrics: (stats: DatabaseStatistics, format?: "prometheus" | "json" | "datadog") => string;
export {};
//# sourceMappingURL=sequelize-performance-optimization-kit.d.ts.map