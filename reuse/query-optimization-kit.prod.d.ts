/**
 * LOC: QOK9X2Y5Z8
 * File: /reuse/query-optimization-kit.prod.ts
 *
 * UPSTREAM (imports from):
 *   - Sequelize v6.x (database ORM)
 *   - Zod (schema validation)
 *   - Redis/Cache layer
 *   - Database connection pools
 *
 * DOWNSTREAM (imported by):
 *   - NestJS service layer
 *   - Repository implementations
 *   - GraphQL resolvers
 *   - REST API controllers
 *   - Background job processors
 */
/**
 * File: /reuse/query-optimization-kit.prod.ts
 * Locator: WC-UTL-QOK-001
 * Purpose: Query Optimization Kit - Production-grade Sequelize query optimization utilities
 *
 * Upstream: Sequelize v6.x, PostgreSQL 14+, Redis, Connection pooling
 * Downstream: ../backend/*, ../services/*, ../resolvers/*, repository layers
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize 6.x, Zod, PostgreSQL 14+
 * Exports: 47 optimization functions for N+1 prevention, eager loading, caching, bulk ops,
 *          raw queries, CTEs, window functions, pagination, filtering, sorting, full-text search,
 *          aggregations, subqueries, transaction management, and performance monitoring
 *
 * LLM Context: Comprehensive query optimization utilities for White Cross healthcare system.
 * Provides advanced N+1 query prevention, intelligent eager/lazy loading strategies, multi-layer
 * query caching with invalidation, optimized bulk operations, raw SQL with type safety, Common Table
 * Expressions (CTEs), window functions for analytics, cursor and offset pagination, dynamic filtering,
 * multi-field sorting, PostgreSQL full-text search, complex aggregations, subquery optimization,
 * transaction isolation management, query performance profiling, execution plan analysis, index
 * recommendations, connection pool optimization, and real-time performance monitoring. Essential
 * for high-performance, HIPAA-compliant healthcare data operations with sub-second response times.
 *
 * Key Features:
 * - N+1 query detection and prevention with dataloader patterns
 * - Smart eager loading with include optimization
 * - Multi-tier caching (L1: memory, L2: Redis) with TTL and invalidation
 * - Optimized bulk insert/update/delete with batching
 * - Type-safe raw queries with parameter binding
 * - CTEs for complex hierarchical queries
 * - Window functions for analytics and ranking
 * - Cursor-based and offset pagination
 * - Dynamic multi-field filtering with operators
 * - Compound sorting with nulls handling
 * - PostgreSQL full-text search with ranking
 * - Complex aggregations with grouping and HAVING
 * - Subquery optimization and correlation
 * - Transaction isolation levels and savepoints
 * - Query performance profiling with metrics
 * - EXPLAIN ANALYZE for query plans
 * - Index usage analysis and recommendations
 * - Connection pool monitoring
 * - Slow query detection and alerting
 */
import { Sequelize, Model, ModelStatic, FindOptions, WhereOptions, Transaction, IsolationLevel, QueryTypes, Includeable, Order } from 'sequelize';
import { z } from 'zod';
/**
 * @description Zod schema for pagination options
 */
export declare const PaginationSchema: any;
/**
 * @description Zod schema for cursor pagination options
 */
export declare const CursorPaginationSchema: any;
/**
 * @description Zod schema for filter operators
 */
export declare const FilterOperatorSchema: any;
/**
 * @description Zod schema for sorting options
 */
export declare const SortSchema: any;
/**
 * @description Zod schema for full-text search options
 */
export declare const FullTextSearchSchema: any;
/**
 * @description Zod schema for aggregation options
 */
export declare const AggregationSchema: any;
/**
 * @description Zod schema for cache options
 */
export declare const CacheOptionsSchema: any;
/**
 * @description Zod schema for bulk operation options
 */
export declare const BulkOperationSchema: any;
/**
 * @description Zod schema for query performance metrics
 */
export declare const QueryMetricsSchema: any;
export type PaginationOptions = z.infer<typeof PaginationSchema>;
export type CursorPaginationOptions = z.infer<typeof CursorPaginationSchema>;
export type FilterOperator = z.infer<typeof FilterOperatorSchema>;
export type SortOptions = z.infer<typeof SortSchema>;
export type FullTextSearchOptions = z.infer<typeof FullTextSearchSchema>;
export type AggregationOptions = z.infer<typeof AggregationSchema>;
export type CacheOptions = z.infer<typeof CacheOptionsSchema>;
export type BulkOperationOptions = z.infer<typeof BulkOperationSchema>;
export type QueryMetrics = z.infer<typeof QueryMetricsSchema>;
/**
 * @interface PaginatedResult
 * @description Paginated query result with metadata
 */
export interface PaginatedResult<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasMore: boolean;
        hasPrev: boolean;
    };
}
/**
 * @interface CursorPaginatedResult
 * @description Cursor-based paginated result with cursors
 */
export interface CursorPaginatedResult<T> {
    data: T[];
    cursors: {
        next: string | null;
        prev: string | null;
        hasMore: boolean;
        hasPrev: boolean;
    };
}
/**
 * @interface QueryBuilderConfig
 * @description Configuration for advanced query builder
 */
export interface QueryBuilderConfig<T> {
    filters?: Record<string, any>;
    search?: {
        fields: string[];
        term: string;
    };
    fullTextSearch?: FullTextSearchOptions;
    sort?: SortOptions[];
    includes?: Includeable[];
    pagination?: PaginationOptions | CursorPaginationOptions;
    attributes?: string[] | {
        include?: string[];
        exclude?: string[];
    };
    distinct?: boolean;
    paranoid?: boolean;
    raw?: boolean;
    nest?: boolean;
    subQuery?: boolean;
    lock?: Transaction.LOCK;
    transaction?: Transaction;
}
/**
 * @interface EagerLoadConfig
 * @description Configuration for eager loading optimization
 */
export interface EagerLoadConfig {
    association: string;
    required?: boolean;
    separate?: boolean;
    attributes?: string[];
    where?: WhereOptions<any>;
    limit?: number;
    order?: Order;
    include?: EagerLoadConfig[];
}
/**
 * @interface BulkInsertConfig
 * @description Configuration for optimized bulk insert
 */
export interface BulkInsertConfig<T> {
    data: Partial<T>[];
    options?: BulkOperationOptions;
    onProgress?: (processed: number, total: number) => void;
}
/**
 * @interface BulkUpdateConfig
 * @description Configuration for optimized bulk update
 */
export interface BulkUpdateConfig<T> {
    updates: Array<{
        where: WhereOptions<any>;
        data: Partial<T>;
    }>;
    options?: BulkOperationOptions;
    onProgress?: (processed: number, total: number) => void;
}
/**
 * @interface CTEConfig
 * @description Configuration for Common Table Expressions
 */
export interface CTEConfig {
    name: string;
    query: string;
    columns?: string[];
    recursive?: boolean;
    materialized?: boolean;
}
/**
 * @interface WindowFunctionConfig
 * @description Configuration for window functions
 */
export interface WindowFunctionConfig {
    function: 'row_number' | 'rank' | 'dense_rank' | 'percent_rank' | 'ntile' | 'lag' | 'lead' | 'first_value' | 'last_value';
    partitionBy?: string[];
    orderBy?: Array<{
        field: string;
        direction: 'ASC' | 'DESC';
    }>;
    frame?: {
        type: 'ROWS' | 'RANGE' | 'GROUPS';
        start: string;
        end?: string;
    };
    alias: string;
}
/**
 * @interface SubqueryConfig
 * @description Configuration for subquery optimization
 */
export interface SubqueryConfig {
    type: 'scalar' | 'exists' | 'in' | 'any' | 'all';
    query: string | FindOptions<any>;
    alias?: string;
    correlated?: boolean;
}
/**
 * @interface TransactionConfig
 * @description Configuration for transaction management
 */
export interface TransactionConfig {
    isolationLevel?: IsolationLevel;
    autocommit?: boolean;
    deferrable?: string;
    type?: 'DEFERRED' | 'IMMEDIATE' | 'EXCLUSIVE';
    logging?: boolean | ((sql: string, timing?: number) => void);
}
/**
 * @interface PerformanceProfile
 * @description Query performance profiling result
 */
export interface PerformanceProfile {
    metrics: QueryMetrics;
    explain: any;
    recommendations: string[];
    warnings: string[];
    optimizationScore: number;
}
/**
 * @interface IndexRecommendation
 * @description Index recommendation for query optimization
 */
export interface IndexRecommendation {
    table: string;
    columns: string[];
    type: 'btree' | 'hash' | 'gin' | 'gist' | 'spgist' | 'brin';
    reason: string;
    estimatedImprovement: number;
    priority: 'high' | 'medium' | 'low';
}
/**
 * @interface ConnectionPoolStats
 * @description Connection pool statistics
 */
export interface ConnectionPoolStats {
    total: number;
    active: number;
    idle: number;
    waiting: number;
    max: number;
    min: number;
    acquireCount: number;
    createCount: number;
    destroyCount: number;
    timeoutCount: number;
}
/**
 * Detects potential N+1 query patterns in query configuration.
 * Analyzes include patterns to identify unoptimized association loading.
 *
 * @param {FindOptions<any>} options - Sequelize find options
 * @returns {object} Detection result with warnings and suggestions
 *
 * @example
 * ```typescript
 * const result = detectN1Queries({
 *   include: [{ model: Post }] // Missing 'separate: true' or proper eager loading
 * });
 * // { hasN1Risk: true, warnings: [...], suggestions: [...] }
 * ```
 */
export declare const detectN1Queries: (options: FindOptions<any>) => {
    hasN1Risk: boolean;
    warnings: string[];
    suggestions: string[];
};
/**
 * Optimizes query includes to prevent N+1 queries using intelligent batching.
 * Automatically applies 'separate: true' where beneficial.
 *
 * @param {FindOptions<any>} options - Original find options
 * @returns {FindOptions<any>} Optimized find options
 *
 * @example
 * ```typescript
 * const optimized = optimizeIncludes({
 *   include: [
 *     { model: Post, include: [{ model: Comment }] }
 *   ]
 * });
 * // Automatically adds 'separate: true' where needed
 * ```
 */
export declare const optimizeIncludes: (options: FindOptions<any>) => FindOptions<any>;
/**
 * Creates a dataloader-style batch function for association loading.
 * Prevents N+1 by batching multiple association loads into single query.
 *
 * @template T
 * @template K
 * @param {ModelStatic<T>} model - Target model for association
 * @param {string} foreignKey - Foreign key field
 * @param {FindOptions<T>} options - Additional find options
 * @returns {Function} Batch loader function
 *
 * @example
 * ```typescript
 * const postLoader = createBatchLoader(Post, 'authorId', {
 *   attributes: ['id', 'title', 'content']
 * });
 * const posts = await postLoader.load([1, 2, 3]);
 * ```
 */
export declare const createBatchLoader: <T extends Model, K = any>(model: ModelStatic<T>, foreignKey: string, options?: FindOptions<T>) => {
    load: (keys: K[]) => Promise<T[][]>;
    loadOne: (key: K) => Promise<T[]>;
};
/**
 * Implements dataloader pattern with configurable batching and caching.
 * Prevents N+1 queries through intelligent request batching.
 *
 * @template K
 * @template V
 * @param {Function} batchFn - Batch loading function
 * @param {object} options - Dataloader options
 * @returns {object} Dataloader instance with load methods
 *
 * @example
 * ```typescript
 * const userLoader = createDataLoader(
 *   async (ids) => User.findAll({ where: { id: ids } }),
 *   { batchSize: 100, cacheEnabled: true }
 * );
 * const user = await userLoader.load(1);
 * ```
 */
export declare const createDataLoader: <K, V>(batchFn: (keys: K[]) => Promise<V[]>, options?: {
    batchSize?: number;
    cacheEnabled?: boolean;
    cacheTTL?: number;
}) => {
    load: (key: K) => Promise<V>;
    loadMany: (keys: K[]) => Promise<V[]>;
    clear: (key: K) => void;
    clearAll: () => void;
};
/**
 * Creates optimized eager loading configuration with intelligent defaults.
 * Automatically determines best loading strategy based on data patterns.
 *
 * @param {EagerLoadConfig[]} associations - Association configurations
 * @param {object} options - Optimization options
 * @returns {Includeable[]} Optimized include array
 *
 * @example
 * ```typescript
 * const includes = createOptimizedEagerLoad([
 *   { association: 'posts', attributes: ['id', 'title'] },
 *   { association: 'profile', required: true }
 * ]);
 * const users = await User.findAll({ include: includes });
 * ```
 */
export declare const createOptimizedEagerLoad: (associations: EagerLoadConfig[], options?: {
    maxDepth?: number;
    autoSeparate?: boolean;
}) => Includeable[];
/**
 * Implements lazy loading with automatic caching for associations.
 * Loads associations on-demand with intelligent cache management.
 *
 * @template T
 * @param {T} instance - Model instance
 * @param {string} association - Association name
 * @param {FindOptions<any>} options - Find options
 * @returns {Promise<any>} Loaded association
 *
 * @example
 * ```typescript
 * const user = await User.findByPk(1);
 * const posts = await lazyLoadWithCache(user, 'posts', {
 *   where: { status: 'published' }
 * });
 * ```
 */
export declare const lazyLoadWithCache: <T extends Model>(instance: T, association: string, options?: FindOptions<any>) => Promise<any>;
/**
 * Determines optimal loading strategy (eager vs lazy) based on query patterns.
 * Analyzes historical query patterns to recommend best approach.
 *
 * @param {string} modelName - Model name
 * @param {string} association - Association name
 * @param {object} context - Query context
 * @returns {Promise<object>} Loading strategy recommendation
 *
 * @example
 * ```typescript
 * const strategy = await determineLoadingStrategy('User', 'posts', {
 *   expectedResultCount: 100,
 *   associationSize: 'large'
 * });
 * // { strategy: 'lazy', reason: '...', confidence: 0.85 }
 * ```
 */
export declare const determineLoadingStrategy: (modelName: string, association: string, context: {
    expectedResultCount?: number;
    associationSize?: "small" | "medium" | "large";
    frequency?: "rare" | "occasional" | "frequent";
}) => Promise<{
    strategy: "eager" | "lazy" | "dataloader";
    reason: string;
    confidence: number;
}>;
/**
 * Implements multi-layer query caching with L1 (memory) and L2 (Redis).
 * Provides intelligent cache warming and invalidation.
 *
 * @template T
 * @param {string} key - Cache key
 * @param {Function} queryFn - Query function to execute
 * @param {CacheOptions} options - Cache options
 * @returns {Promise<T>} Cached or fresh query result
 *
 * @example
 * ```typescript
 * const users = await cacheQuery('active-users', async () => {
 *   return await User.findAll({ where: { status: 'active' } });
 * }, { ttl: 300, layer: 'both' });
 * ```
 */
export declare const cacheQuery: <T>(key: string, queryFn: () => Promise<T>, options?: Partial<CacheOptions>) => Promise<T>;
/**
 * Invalidates cached queries by key pattern or tags.
 * Supports wildcard patterns and tag-based invalidation.
 *
 * @param {object} criteria - Invalidation criteria
 * @returns {Promise<number>} Number of invalidated cache entries
 *
 * @example
 * ```typescript
 * // Invalidate by pattern
 * await invalidateCache({ pattern: 'user:*' });
 *
 * // Invalidate by tags
 * await invalidateCache({ tags: ['users', 'posts'] });
 * ```
 */
export declare const invalidateCache: (criteria: {
    pattern?: string;
    tags?: string[];
    exact?: string;
}) => Promise<number>;
/**
 * Warms up cache with pre-computed query results.
 * Useful for frequently accessed data with predictable patterns.
 *
 * @param {Array} queries - Array of queries to warm up
 * @returns {Promise<object>} Warming results
 *
 * @example
 * ```typescript
 * await warmCache([
 *   { key: 'popular-posts', fn: () => Post.findAll({ limit: 10, order: [['views', 'DESC']] }) },
 *   { key: 'active-users', fn: () => User.findAll({ where: { status: 'active' } }) }
 * ]);
 * ```
 */
export declare const warmCache: (queries: Array<{
    key: string;
    fn: () => Promise<any>;
    options?: Partial<CacheOptions>;
}>) => Promise<{
    success: number;
    failed: number;
    errors: Array<{
        key: string;
        error: string;
    }>;
}>;
/**
 * Optimized bulk insert with automatic batching and error handling.
 * Supports validation, conflict resolution, and progress tracking.
 *
 * @template T
 * @param {ModelStatic<T>} model - Target model
 * @param {BulkInsertConfig<T>} config - Bulk insert configuration
 * @returns {Promise<object>} Insert results with statistics
 *
 * @example
 * ```typescript
 * const result = await bulkInsertOptimized(User, {
 *   data: users,
 *   options: { batchSize: 500, updateOnDuplicate: ['email', 'name'] },
 *   onProgress: (processed, total) => console.log(`${processed}/${total}`)
 * });
 * ```
 */
export declare const bulkInsertOptimized: <T extends Model>(model: ModelStatic<T>, config: BulkInsertConfig<T>) => Promise<{
    inserted: number;
    updated: number;
    failed: number;
    errors: Array<{
        index: number;
        error: string;
    }>;
}>;
/**
 * Optimized bulk update with conditional updates and batching.
 * Supports different update conditions per batch.
 *
 * @template T
 * @param {ModelStatic<T>} model - Target model
 * @param {BulkUpdateConfig<T>} config - Bulk update configuration
 * @returns {Promise<object>} Update results with statistics
 *
 * @example
 * ```typescript
 * const result = await bulkUpdateOptimized(User, {
 *   updates: [
 *     { where: { status: 'pending' }, data: { status: 'active' } },
 *     { where: { lastLogin: { [Op.lt]: oldDate } }, data: { status: 'inactive' } }
 *   ],
 *   options: { batchSize: 1000 }
 * });
 * ```
 */
export declare const bulkUpdateOptimized: <T extends Model>(model: ModelStatic<T>, config: BulkUpdateConfig<T>) => Promise<{
    updated: number;
    failed: number;
    errors: Array<{
        index: number;
        error: string;
    }>;
}>;
/**
 * Optimized bulk delete with batching and soft delete support.
 *
 * @template T
 * @param {ModelStatic<T>} model - Target model
 * @param {WhereOptions<T>} where - Delete conditions
 * @param {object} options - Delete options
 * @returns {Promise<number>} Number of deleted records
 *
 * @example
 * ```typescript
 * const deleted = await bulkDeleteOptimized(User, {
 *   status: 'inactive',
 *   lastLogin: { [Op.lt]: thresholdDate }
 * }, { batchSize: 500, force: false });
 * ```
 */
export declare const bulkDeleteOptimized: <T extends Model>(model: ModelStatic<T>, where: WhereOptions<T>, options?: {
    batchSize?: number;
    force?: boolean;
    hooks?: boolean;
}) => Promise<number>;
/**
 * Implements cursor-based pagination for efficient large dataset traversal.
 * Superior to offset pagination for real-time data and large tables.
 *
 * @template T
 * @param {ModelStatic<T>} model - Target model
 * @param {CursorPaginationOptions} options - Cursor pagination options
 * @param {FindOptions<T>} findOptions - Additional find options
 * @returns {Promise<CursorPaginatedResult<T>>} Paginated results with cursors
 *
 * @example
 * ```typescript
 * const result = await cursorPaginate(User, {
 *   cursor: 'eyJpZCI6MTAwfQ==',
 *   limit: 20,
 *   cursorField: 'createdAt'
 * }, {
 *   where: { status: 'active' },
 *   order: [['createdAt', 'DESC']]
 * });
 * ```
 */
export declare const cursorPaginate: <T extends Model>(model: ModelStatic<T>, options: Partial<CursorPaginationOptions>, findOptions?: FindOptions<T>) => Promise<CursorPaginatedResult<T>>;
/**
 * Implements offset-based pagination with total count and page metadata.
 * Suitable for smaller datasets with stable ordering.
 *
 * @template T
 * @param {ModelStatic<T>} model - Target model
 * @param {PaginationOptions} options - Pagination options
 * @param {FindOptions<T>} findOptions - Additional find options
 * @returns {Promise<PaginatedResult<T>>} Paginated results with metadata
 *
 * @example
 * ```typescript
 * const result = await offsetPaginate(User, { page: 2, limit: 20 }, {
 *   where: { status: 'active' },
 *   order: [['createdAt', 'DESC']]
 * });
 * ```
 */
export declare const offsetPaginate: <T extends Model>(model: ModelStatic<T>, options: Partial<PaginationOptions>, findOptions?: FindOptions<T>) => Promise<PaginatedResult<T>>;
/**
 * Implements keyset pagination for optimal performance on indexed columns.
 * More efficient than cursor pagination for multi-column sorting.
 *
 * @template T
 * @param {ModelStatic<T>} model - Target model
 * @param {object} options - Keyset pagination options
 * @param {FindOptions<T>} findOptions - Additional find options
 * @returns {Promise<object>} Paginated results with keyset
 *
 * @example
 * ```typescript
 * const result = await keysetPaginate(Post, {
 *   keyset: { createdAt: '2024-01-01', id: 100 },
 *   limit: 20,
 *   direction: 'forward'
 * }, {
 *   order: [['createdAt', 'DESC'], ['id', 'DESC']]
 * });
 * ```
 */
export declare const keysetPaginate: <T extends Model>(model: ModelStatic<T>, options: {
    keyset?: Record<string, any>;
    limit?: number;
    direction?: "forward" | "backward";
}, findOptions?: FindOptions<T>) => Promise<{
    data: T[];
    nextKeyset: Record<string, any> | null;
    prevKeyset: Record<string, any> | null;
    hasMore: boolean;
}>;
/**
 * Builds dynamic filter conditions from query parameters.
 * Supports complex operators and nested conditions.
 *
 * @param {Record<string, any>} filters - Filter object
 * @param {object} options - Filter options
 * @returns {WhereOptions<any>} Sequelize where conditions
 *
 * @example
 * ```typescript
 * const where = buildDynamicFilters({
 *   'age[gte]': 18,
 *   'status[in]': ['active', 'pending'],
 *   'email[like]': '%@example.com'
 * });
 * ```
 */
export declare const buildDynamicFilters: (filters: Record<string, any>, options?: {
    allowedFields?: string[];
    operatorMap?: Record<string, symbol>;
}) => WhereOptions<any>;
/**
 * Builds dynamic sort order from query parameters.
 * Supports multi-field sorting with nulls handling.
 *
 * @param {SortOptions[]} sorts - Sort configurations
 * @param {object} options - Sort options
 * @returns {Order} Sequelize order array
 *
 * @example
 * ```typescript
 * const order = buildDynamicSort([
 *   { field: 'priority', direction: 'DESC', nulls: 'LAST' },
 *   { field: 'createdAt', direction: 'DESC' }
 * ]);
 * ```
 */
export declare const buildDynamicSort: (sorts: SortOptions[], options?: {
    allowedFields?: string[];
    defaultSort?: SortOptions;
}) => Order;
/**
 * Implements PostgreSQL full-text search with ranking.
 * Supports multiple search configurations and result ranking.
 *
 * @template T
 * @param {ModelStatic<T>} model - Target model
 * @param {FullTextSearchOptions} options - Search options
 * @param {FindOptions<T>} findOptions - Additional find options
 * @returns {Promise<T[]>} Ranked search results
 *
 * @example
 * ```typescript
 * const results = await fullTextSearch(Article, {
 *   query: 'healthcare technology',
 *   fields: ['title', 'content'],
 *   minRank: 0.1
 * });
 * ```
 */
export declare const fullTextSearch: <T extends Model>(model: ModelStatic<T>, options: Partial<FullTextSearchOptions>, findOptions?: FindOptions<T>) => Promise<T[]>;
/**
 * Performs complex aggregations with grouping and having clauses.
 * Supports multiple aggregation operations and group by.
 *
 * @template T
 * @param {ModelStatic<T>} model - Target model
 * @param {object} config - Aggregation configuration
 * @returns {Promise<any[]>} Aggregation results
 *
 * @example
 * ```typescript
 * const stats = await complexAggregation(Order, {
 *   aggregations: [
 *     { field: 'total', operation: 'sum', alias: 'totalRevenue' },
 *     { field: 'id', operation: 'count', alias: 'orderCount' }
 *   ],
 *   groupBy: ['customerId', 'status'],
 *   having: { totalRevenue: { [Op.gt]: 1000 } }
 * });
 * ```
 */
export declare const complexAggregation: <T extends Model>(model: ModelStatic<T>, config: {
    aggregations: AggregationOptions[];
    groupBy?: string[];
    having?: Record<string, any>;
    where?: WhereOptions<T>;
    include?: Includeable[];
    order?: Order;
}) => Promise<any[]>;
/**
 * Implements window functions for advanced analytics.
 * Supports ranking, row numbering, lag/lead, and custom frames.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} table - Table name
 * @param {WindowFunctionConfig[]} windows - Window function configurations
 * @param {object} options - Query options
 * @returns {Promise<any[]>} Results with window function columns
 *
 * @example
 * ```typescript
 * const ranked = await windowFunction(sequelize, 'orders', [
 *   {
 *     function: 'row_number',
 *     partitionBy: ['customerId'],
 *     orderBy: [{ field: 'createdAt', direction: 'DESC' }],
 *     alias: 'orderRank'
 *   }
 * ]);
 * ```
 */
export declare const windowFunction: (sequelize: Sequelize, table: string, windows: WindowFunctionConfig[], options?: {
    where?: string;
    limit?: number;
    offset?: number;
}) => Promise<any[]>;
/**
 * Builds queries using Common Table Expressions for complex hierarchical data.
 * Supports recursive and non-recursive CTEs with materialization.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CTEConfig[]} ctes - CTE configurations
 * @param {string} mainQuery - Main query using CTEs
 * @returns {Promise<any[]>} Query results
 *
 * @example
 * ```typescript
 * const result = await buildCTE(sequelize, [
 *   {
 *     name: 'category_tree',
 *     recursive: true,
 *     query: `
 *       SELECT id, name, parent_id, 1 as level FROM categories WHERE parent_id IS NULL
 *       UNION ALL
 *       SELECT c.id, c.name, c.parent_id, ct.level + 1
 *       FROM categories c JOIN category_tree ct ON c.parent_id = ct.id
 *     `
 *   }
 * ], 'SELECT * FROM category_tree ORDER BY level, name');
 * ```
 */
export declare const buildCTE: (sequelize: Sequelize, ctes: CTEConfig[], mainQuery: string) => Promise<any[]>;
/**
 * Implements recursive CTE for hierarchical data traversal.
 * Optimized for tree structures like org charts, categories, etc.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} config - Recursive CTE configuration
 * @returns {Promise<any[]>} Hierarchical results
 *
 * @example
 * ```typescript
 * const orgChart = await recursiveCTE(sequelize, {
 *   table: 'employees',
 *   anchorCondition: 'manager_id IS NULL',
 *   recursiveJoin: 'e.manager_id = emp.id',
 *   selectFields: ['id', 'name', 'manager_id'],
 *   levelField: 'level',
 *   maxDepth: 10
 * });
 * ```
 */
export declare const recursiveCTE: (sequelize: Sequelize, config: {
    table: string;
    anchorCondition: string;
    recursiveJoin: string;
    selectFields?: string[];
    levelField?: string;
    pathField?: string;
    maxDepth?: number;
    orderBy?: string;
}) => Promise<any[]>;
/**
 * Executes type-safe raw SQL queries with parameter binding.
 * Prevents SQL injection and provides type inference.
 *
 * @template T
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} query - SQL query with named parameters
 * @param {object} options - Query options
 * @returns {Promise<T[]>} Typed query results
 *
 * @example
 * ```typescript
 * const users = await typeSafeRawQuery<User>(sequelize,
 *   'SELECT * FROM users WHERE age >= :minAge AND status = :status',
 *   {
 *     replacements: { minAge: 18, status: 'active' },
 *     model: User
 *   }
 * );
 * ```
 */
export declare const typeSafeRawQuery: <T>(sequelize: Sequelize, query: string, options?: {
    replacements?: Record<string, any>;
    type?: QueryTypes;
    model?: ModelStatic<any>;
    mapToModel?: boolean;
    transaction?: Transaction;
}) => Promise<T[]>;
/**
 * Builds parameterized queries with automatic type conversion.
 * Ensures safe parameter binding for all data types.
 *
 * @param {string} query - Base SQL query
 * @param {Record<string, any>} params - Query parameters
 * @param {object} options - Build options
 * @returns {object} Query with replacements
 *
 * @example
 * ```typescript
 * const { query, replacements } = buildParameterizedQuery(
 *   'SELECT * FROM users WHERE created_at > :date AND status IN (:statuses)',
 *   { date: new Date(), statuses: ['active', 'pending'] }
 * );
 * ```
 */
export declare const buildParameterizedQuery: (query: string, params: Record<string, any>, options?: {
    arrayFormat?: "postgres" | "mysql";
    dateFormat?: "iso" | "timestamp";
}) => {
    query: string;
    replacements: Record<string, any>;
};
/**
 * Executes queries within managed transaction with auto-rollback.
 * Supports isolation levels and savepoints.
 *
 * @template T
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Function} callback - Transaction callback
 * @param {TransactionConfig} config - Transaction configuration
 * @returns {Promise<T>} Transaction result
 *
 * @example
 * ```typescript
 * const result = await withTransaction(sequelize, async (t) => {
 *   const user = await User.create({ name: 'John' }, { transaction: t });
 *   const profile = await Profile.create({ userId: user.id }, { transaction: t });
 *   return { user, profile };
 * }, { isolationLevel: IsolationLevel.SERIALIZABLE });
 * ```
 */
export declare const withTransaction: <T>(sequelize: Sequelize, callback: (transaction: Transaction) => Promise<T>, config?: TransactionConfig) => Promise<T>;
/**
 * Implements savepoint-based nested transactions.
 * Allows partial rollback within larger transactions.
 *
 * @param {Transaction} transaction - Parent transaction
 * @param {string} name - Savepoint name
 * @param {Function} callback - Savepoint callback
 * @returns {Promise<T>} Savepoint result
 *
 * @example
 * ```typescript
 * await withTransaction(sequelize, async (t) => {
 *   const user = await User.create({ name: 'John' }, { transaction: t });
 *
 *   try {
 *     await withSavepoint(t, 'profile_create', async () => {
 *       await Profile.create({ userId: user.id, invalid: true }, { transaction: t });
 *     });
 *   } catch (error) {
 *     // Profile creation failed, but user creation is preserved
 *   }
 *
 *   return user;
 * });
 * ```
 */
export declare const withSavepoint: <T>(transaction: Transaction, name: string, callback: () => Promise<T>) => Promise<T>;
/**
 * Profiles query execution with detailed performance metrics.
 * Captures execution time, row count, and resource usage.
 *
 * @template T
 * @param {Function} queryFn - Query function to profile
 * @param {object} options - Profiling options
 * @returns {Promise<object>} Query result with metrics
 *
 * @example
 * ```typescript
 * const { result, metrics } = await profileQuery(
 *   () => User.findAll({ where: { status: 'active' } }),
 *   { explain: true, captureSQL: true }
 * );
 * console.log(`Query took ${metrics.executionTime}ms`);
 * ```
 */
export declare const profileQuery: <T>(queryFn: () => Promise<T>, options?: {
    explain?: boolean;
    captureSQL?: boolean;
    threshold?: number;
}) => Promise<{
    result: T;
    metrics: QueryMetrics;
}>;
/**
 * Analyzes query execution plan using EXPLAIN ANALYZE.
 * Provides detailed insights into query performance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} query - SQL query to analyze
 * @param {object} options - Analysis options
 * @returns {Promise<PerformanceProfile>} Performance analysis
 *
 * @example
 * ```typescript
 * const profile = await analyzeQueryPlan(sequelize,
 *   'SELECT * FROM users WHERE status = $1',
 *   { replacements: ['active'], format: 'json' }
 * );
 * console.log('Optimization score:', profile.optimizationScore);
 * ```
 */
export declare const analyzeQueryPlan: (sequelize: Sequelize, query: string, options?: {
    replacements?: Record<string, any>;
    format?: "text" | "json" | "yaml" | "xml";
    analyze?: boolean;
    buffers?: boolean;
    timing?: boolean;
}) => Promise<PerformanceProfile>;
/**
 * Generates index recommendations based on query patterns.
 * Analyzes frequently used filters and joins.
 *
 * @param {object[]} queries - Array of query patterns
 * @returns {IndexRecommendation[]} Index recommendations
 *
 * @example
 * ```typescript
 * const recommendations = recommendIndexes([
 *   { table: 'users', filters: ['status', 'createdAt'], frequency: 100 },
 *   { table: 'posts', filters: ['authorId', 'publishedAt'], frequency: 50 }
 * ]);
 * ```
 */
export declare const recommendIndexes: (queries: Array<{
    table: string;
    filters?: string[];
    joins?: string[];
    frequency?: number;
}>) => IndexRecommendation[];
/**
 * Monitors connection pool health and statistics.
 * Tracks active connections, wait times, and bottlenecks.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ConnectionPoolStats} Pool statistics
 *
 * @example
 * ```typescript
 * const stats = getConnectionPoolStats(sequelize);
 * if (stats.waiting > 10) {
 *   console.warn('Connection pool bottleneck detected');
 * }
 * ```
 */
export declare const getConnectionPoolStats: (sequelize: Sequelize) => ConnectionPoolStats;
/**
 * Detects and logs slow queries with configurable threshold.
 * Integrates with logging system for monitoring.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} options - Detection options
 * @returns {Function} Cleanup function
 *
 * @example
 * ```typescript
 * const cleanup = detectSlowQueries(sequelize, {
 *   threshold: 1000,
 *   onSlowQuery: (query, time) => {
 *     logger.warn(`Slow query (${time}ms): ${query}`);
 *   }
 * });
 * ```
 */
export declare const detectSlowQueries: (sequelize: Sequelize, options?: {
    threshold?: number;
    onSlowQuery?: (sql: string, time: number) => void;
    includeStackTrace?: boolean;
}) => (() => void);
declare const _default: {
    detectN1Queries: (options: FindOptions<any>) => {
        hasN1Risk: boolean;
        warnings: string[];
        suggestions: string[];
    };
    optimizeIncludes: (options: FindOptions<any>) => FindOptions<any>;
    createBatchLoader: <T extends Model, K = any>(model: ModelStatic<T>, foreignKey: string, options?: FindOptions<T>) => {
        load: (keys: K[]) => Promise<T[][]>;
        loadOne: (key: K) => Promise<T[]>;
    };
    createDataLoader: <K, V>(batchFn: (keys: K[]) => Promise<V[]>, options?: {
        batchSize?: number;
        cacheEnabled?: boolean;
        cacheTTL?: number;
    }) => {
        load: (key: K) => Promise<V>;
        loadMany: (keys: K[]) => Promise<V[]>;
        clear: (key: K) => void;
        clearAll: () => void;
    };
    createOptimizedEagerLoad: (associations: EagerLoadConfig[], options?: {
        maxDepth?: number;
        autoSeparate?: boolean;
    }) => Includeable[];
    lazyLoadWithCache: <T extends Model>(instance: T, association: string, options?: FindOptions<any>) => Promise<any>;
    determineLoadingStrategy: (modelName: string, association: string, context: {
        expectedResultCount?: number;
        associationSize?: "small" | "medium" | "large";
        frequency?: "rare" | "occasional" | "frequent";
    }) => Promise<{
        strategy: "eager" | "lazy" | "dataloader";
        reason: string;
        confidence: number;
    }>;
    cacheQuery: <T>(key: string, queryFn: () => Promise<T>, options?: Partial<CacheOptions>) => Promise<T>;
    invalidateCache: (criteria: {
        pattern?: string;
        tags?: string[];
        exact?: string;
    }) => Promise<number>;
    warmCache: (queries: Array<{
        key: string;
        fn: () => Promise<any>;
        options?: Partial<CacheOptions>;
    }>) => Promise<{
        success: number;
        failed: number;
        errors: Array<{
            key: string;
            error: string;
        }>;
    }>;
    bulkInsertOptimized: <T extends Model>(model: ModelStatic<T>, config: BulkInsertConfig<T>) => Promise<{
        inserted: number;
        updated: number;
        failed: number;
        errors: Array<{
            index: number;
            error: string;
        }>;
    }>;
    bulkUpdateOptimized: <T extends Model>(model: ModelStatic<T>, config: BulkUpdateConfig<T>) => Promise<{
        updated: number;
        failed: number;
        errors: Array<{
            index: number;
            error: string;
        }>;
    }>;
    bulkDeleteOptimized: <T extends Model>(model: ModelStatic<T>, where: WhereOptions<T>, options?: {
        batchSize?: number;
        force?: boolean;
        hooks?: boolean;
    }) => Promise<number>;
    cursorPaginate: <T extends Model>(model: ModelStatic<T>, options: Partial<CursorPaginationOptions>, findOptions?: FindOptions<T>) => Promise<CursorPaginatedResult<T>>;
    offsetPaginate: <T extends Model>(model: ModelStatic<T>, options: Partial<PaginationOptions>, findOptions?: FindOptions<T>) => Promise<PaginatedResult<T>>;
    keysetPaginate: <T extends Model>(model: ModelStatic<T>, options: {
        keyset?: Record<string, any>;
        limit?: number;
        direction?: "forward" | "backward";
    }, findOptions?: FindOptions<T>) => Promise<{
        data: T[];
        nextKeyset: Record<string, any> | null;
        prevKeyset: Record<string, any> | null;
        hasMore: boolean;
    }>;
    buildDynamicFilters: (filters: Record<string, any>, options?: {
        allowedFields?: string[];
        operatorMap?: Record<string, symbol>;
    }) => WhereOptions<any>;
    buildDynamicSort: (sorts: SortOptions[], options?: {
        allowedFields?: string[];
        defaultSort?: SortOptions;
    }) => Order;
    fullTextSearch: <T extends Model>(model: ModelStatic<T>, options: Partial<FullTextSearchOptions>, findOptions?: FindOptions<T>) => Promise<T[]>;
    complexAggregation: <T extends Model>(model: ModelStatic<T>, config: {
        aggregations: AggregationOptions[];
        groupBy?: string[];
        having?: Record<string, any>;
        where?: WhereOptions<T>;
        include?: Includeable[];
        order?: Order;
    }) => Promise<any[]>;
    windowFunction: (sequelize: Sequelize, table: string, windows: WindowFunctionConfig[], options?: {
        where?: string;
        limit?: number;
        offset?: number;
    }) => Promise<any[]>;
    buildCTE: (sequelize: Sequelize, ctes: CTEConfig[], mainQuery: string) => Promise<any[]>;
    recursiveCTE: (sequelize: Sequelize, config: {
        table: string;
        anchorCondition: string;
        recursiveJoin: string;
        selectFields?: string[];
        levelField?: string;
        pathField?: string;
        maxDepth?: number;
        orderBy?: string;
    }) => Promise<any[]>;
    typeSafeRawQuery: <T>(sequelize: Sequelize, query: string, options?: {
        replacements?: Record<string, any>;
        type?: QueryTypes;
        model?: ModelStatic<any>;
        mapToModel?: boolean;
        transaction?: Transaction;
    }) => Promise<T[]>;
    buildParameterizedQuery: (query: string, params: Record<string, any>, options?: {
        arrayFormat?: "postgres" | "mysql";
        dateFormat?: "iso" | "timestamp";
    }) => {
        query: string;
        replacements: Record<string, any>;
    };
    withTransaction: <T>(sequelize: Sequelize, callback: (transaction: Transaction) => Promise<T>, config?: TransactionConfig) => Promise<T>;
    withSavepoint: <T>(transaction: Transaction, name: string, callback: () => Promise<T>) => Promise<T>;
    profileQuery: <T>(queryFn: () => Promise<T>, options?: {
        explain?: boolean;
        captureSQL?: boolean;
        threshold?: number;
    }) => Promise<{
        result: T;
        metrics: QueryMetrics;
    }>;
    analyzeQueryPlan: (sequelize: Sequelize, query: string, options?: {
        replacements?: Record<string, any>;
        format?: "text" | "json" | "yaml" | "xml";
        analyze?: boolean;
        buffers?: boolean;
        timing?: boolean;
    }) => Promise<PerformanceProfile>;
    recommendIndexes: (queries: Array<{
        table: string;
        filters?: string[];
        joins?: string[];
        frequency?: number;
    }>) => IndexRecommendation[];
    getConnectionPoolStats: (sequelize: Sequelize) => ConnectionPoolStats;
    detectSlowQueries: (sequelize: Sequelize, options?: {
        threshold?: number;
        onSlowQuery?: (sql: string, time: number) => void;
        includeStackTrace?: boolean;
    }) => (() => void);
};
export default _default;
//# sourceMappingURL=query-optimization-kit.prod.d.ts.map