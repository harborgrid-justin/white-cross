/**
 * LOC: Q1U2E3R4Y5
 * File: /reuse/query-builder-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - @types/node (v18.x)
 *
 * DOWNSTREAM (imported by):
 *   - Service layers
 *   - Repository patterns
 *   - Data access layers
 */
/**
 * File: /reuse/query-builder-kit.ts
 * Locator: WC-UTL-SEQ-QBKIT-001
 * Purpose: Sequelize Query Builder Kit - Advanced query construction and optimization utilities
 *
 * Upstream: sequelize v6.x, @types/node
 * Downstream: All service layers, repositories, data access patterns, and API endpoints
 * Dependencies: Sequelize v6.x, Node 18+, TypeScript 5.x
 * Exports: 45 query utilities covering finders, WHERE clauses, subqueries, aggregations, window functions,
 *          raw queries, optimization, bulk operations, transactions, locking, search/filter, dynamic construction
 *
 * LLM Context: Production-grade Sequelize v6.x query builder kit for White Cross healthcare platform.
 * Provides advanced query construction utilities including complex WHERE builders, subquery generators,
 * aggregation helpers, window functions, raw query utilities, optimization tools, bulk operations,
 * transaction management, locking strategies, search/filter builders, dynamic query construction,
 * and result transformers. HIPAA-compliant with comprehensive audit logging and performance optimization.
 */
import { Model, ModelStatic, Sequelize, Op, WhereOptions, FindOptions, Transaction, QueryTypes, Order, Includeable, Literal, OrderItem, InferAttributes, InferCreationAttributes } from 'sequelize';
/**
 * Advanced WHERE clause builder options
 */
export interface WhereBuilderOptions<T = any> {
    operator?: typeof Op.and | typeof Op.or;
    nested?: boolean;
    caseInsensitive?: boolean;
    fuzzy?: boolean;
    jsonPath?: string;
}
/**
 * Subquery configuration
 */
export interface SubqueryConfig<T extends Model = Model> {
    model: ModelStatic<T>;
    attributes: string[];
    where?: WhereOptions;
    include?: Includeable[];
    distinct?: boolean;
    limit?: number;
}
/**
 * Aggregation query options
 */
export interface AggregationOptions {
    groupBy: string[];
    having?: WhereOptions;
    aggregates: {
        field: string;
        function: 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX' | 'STDDEV' | 'VARIANCE';
        alias: string;
        distinct?: boolean;
    }[];
    includeNulls?: boolean;
}
/**
 * Window function configuration
 */
export interface WindowFunctionConfig {
    function: 'ROW_NUMBER' | 'RANK' | 'DENSE_RANK' | 'LAG' | 'LEAD' | 'FIRST_VALUE' | 'LAST_VALUE' | 'NTH_VALUE';
    alias: string;
    partitionBy?: string[];
    orderBy?: OrderItem[];
    frameType?: 'ROWS' | 'RANGE';
    frameStart?: string;
    frameEnd?: string;
    lag?: number;
    lead?: number;
}
/**
 * Pagination configuration
 */
export interface PaginationConfig {
    page: number;
    pageSize: number;
    cursorField?: string;
    cursor?: any;
    includeTotal?: boolean;
}
/**
 * Search configuration
 */
export interface SearchConfig {
    fields: string[];
    query: string;
    exact?: boolean;
    fuzzy?: boolean;
    wildcard?: 'both' | 'start' | 'end';
    caseInsensitive?: boolean;
    minLength?: number;
}
/**
 * Filter configuration
 */
export interface FilterConfig {
    field: string;
    operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'notIn' | 'like' | 'notLike' | 'between' | 'isNull' | 'isNotNull';
    value?: any;
    values?: any[];
    caseInsensitive?: boolean;
}
/**
 * Sort configuration
 */
export interface SortConfig {
    field: string;
    direction: 'ASC' | 'DESC';
    nulls?: 'FIRST' | 'LAST';
    caseInsensitive?: boolean;
}
/**
 * Bulk operation configuration
 */
export interface BulkOperationConfig<T = any> {
    batchSize?: number;
    validate?: boolean;
    hooks?: boolean;
    ignoreDuplicates?: boolean;
    updateOnDuplicate?: string[];
    returning?: boolean;
    transaction?: Transaction;
    individualHooks?: boolean;
}
/**
 * Query optimization hints
 */
export interface QueryOptimizationHints {
    indexHints?: string[];
    forceIndex?: string;
    ignoreIndex?: string;
    useSubquery?: boolean;
    materialize?: boolean;
    prefetch?: string[];
}
/**
 * Lock configuration
 */
export interface LockConfig {
    level: 'UPDATE' | 'SHARE' | 'KEY_SHARE' | 'NO_KEY_UPDATE';
    tables?: string[];
    skipLocked?: boolean;
    nowait?: boolean;
}
/**
 * Query result transformer configuration
 */
export interface TransformerConfig<T = any, R = any> {
    map?: (item: T) => R;
    filter?: (item: T) => boolean;
    reduce?: (acc: any, item: T) => any;
    group?: (item: T) => string;
    flatten?: boolean;
    distinct?: boolean;
}
/**
 * Dynamic query builder configuration
 */
export interface DynamicQueryConfig {
    select?: string[];
    where?: Record<string, any>;
    include?: string[];
    order?: SortConfig[];
    limit?: number;
    offset?: number;
    group?: string[];
    having?: Record<string, any>;
}
/**
 * Join configuration
 */
export interface JoinConfig {
    type: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL';
    model: string;
    on: WhereOptions;
    required?: boolean;
    attributes?: string[];
    where?: WhereOptions;
}
/**
 * CTE (Common Table Expression) configuration
 */
export interface CTEConfig {
    name: string;
    query: string;
    recursive?: boolean;
    materialized?: boolean;
}
/**
 * Finds a single record with comprehensive error handling and null checks.
 * Returns null if not found instead of throwing an error.
 *
 * @template T - Model type
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {FindOptions<InferAttributes<T>>} options - Find options
 * @returns {Promise<T | null>} Found instance or null
 *
 * @example
 * ```typescript
 * const user = await findOneSafe(User, {
 *   where: { email: 'user@example.com' },
 *   include: [{ model: Profile }]
 * });
 * if (user) {
 *   console.log('User found:', user.email);
 * }
 * ```
 */
export declare function findOneSafe<T extends Model>(model: ModelStatic<T>, options: FindOptions<InferAttributes<T>>): Promise<T | null>;
/**
 * Finds records with automatic retry on transient failures.
 * Implements exponential backoff for resilience.
 *
 * @template T - Model type
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {FindOptions<InferAttributes<T>>} options - Find options
 * @param {number} maxRetries - Maximum retry attempts (default: 3)
 * @param {number} baseDelay - Base delay in ms (default: 100)
 * @returns {Promise<T[]>} Array of found instances
 *
 * @example
 * ```typescript
 * const users = await findWithRetry(User, {
 *   where: { status: 'active' },
 *   limit: 100
 * }, 3, 100);
 * ```
 */
export declare function findWithRetry<T extends Model>(model: ModelStatic<T>, options: FindOptions<InferAttributes<T>>, maxRetries?: number, baseDelay?: number): Promise<T[]>;
/**
 * Finds records with cursor-based pagination for efficient large dataset navigation.
 * More performant than offset-based pagination for large tables.
 *
 * @template T - Model type
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {PaginationConfig} config - Pagination configuration
 * @param {FindOptions<InferAttributes<T>>} baseOptions - Base find options
 * @returns {Promise<{ data: T[]; nextCursor: any; hasMore: boolean }>} Paginated results
 *
 * @example
 * ```typescript
 * const result = await findWithCursor(User, {
 *   page: 1,
 *   pageSize: 20,
 *   cursorField: 'createdAt',
 *   cursor: lastCreatedAt
 * }, { where: { status: 'active' }, order: [['createdAt', 'DESC']] });
 * ```
 */
export declare function findWithCursor<T extends Model>(model: ModelStatic<T>, config: PaginationConfig, baseOptions?: FindOptions<InferAttributes<T>>): Promise<{
    data: T[];
    nextCursor: any;
    hasMore: boolean;
    total?: number;
}>;
/**
 * Finds or creates a record with additional validation and hooks.
 * Ensures uniqueness and provides detailed creation metadata.
 *
 * @template T - Model type
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {WhereOptions} where - Where clause for finding
 * @param {Partial<InferCreationAttributes<T>>} defaults - Default values for creation
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<{ instance: T; created: boolean }>} Instance and creation flag
 *
 * @example
 * ```typescript
 * const { instance, created } = await findOrCreateSafe(User,
 *   { email: 'user@example.com' },
 *   { firstName: 'John', lastName: 'Doe', status: 'active' }
 * );
 * ```
 */
export declare function findOrCreateSafe<T extends Model>(model: ModelStatic<T>, where: WhereOptions, defaults: Partial<InferCreationAttributes<T>>, transaction?: Transaction): Promise<{
    instance: T;
    created: boolean;
}>;
/**
 * Finds records with optimized includes to prevent N+1 queries.
 * Automatically configures subQuery and separate options.
 *
 * @template T - Model type
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {FindOptions<InferAttributes<T>>} options - Find options
 * @returns {Promise<T[]>} Optimized query results
 *
 * @example
 * ```typescript
 * const users = await findWithOptimizedIncludes(User, {
 *   include: [
 *     { model: Profile, as: 'profile' },
 *     { model: Post, as: 'posts', separate: true }
 *   ],
 *   limit: 20
 * });
 * ```
 */
export declare function findWithOptimizedIncludes<T extends Model>(model: ModelStatic<T>, options: FindOptions<InferAttributes<T>>): Promise<T[]>;
/**
 * Builds a complex nested WHERE clause with AND/OR operators.
 * Supports deep nesting and multiple condition types.
 *
 * @param {WhereOptions[]} conditions - Array of conditions
 * @param {WhereBuilderOptions} options - Builder options
 * @returns {WhereOptions} Constructed WHERE clause
 *
 * @example
 * ```typescript
 * const where = buildNestedWhere([
 *   { age: { [Op.gte]: 18 } },
 *   { status: 'active' },
 *   { role: { [Op.in]: ['admin', 'moderator'] } }
 * ], { operator: Op.and });
 * ```
 */
export declare function buildNestedWhere(conditions: WhereOptions[], options?: WhereBuilderOptions): WhereOptions;
/**
 * Builds a WHERE clause for JSON/JSONB field queries.
 * Supports path navigation and various operators.
 *
 * @param {string} field - JSON field name
 * @param {string} path - JSON path (e.g., 'address.city')
 * @param {any} value - Value to compare
 * @param {string} operator - Comparison operator
 * @returns {WhereOptions} JSON WHERE clause
 *
 * @example
 * ```typescript
 * const where = buildJsonWhere('metadata', 'settings.notifications', true, 'eq');
 * // Finds records where metadata.settings.notifications === true
 * ```
 */
export declare function buildJsonWhere(field: string, path: string, value: any, operator?: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains'): WhereOptions;
/**
 * Builds a fuzzy search WHERE clause using ILIKE or similarity functions.
 * Optimized for PostgreSQL full-text search.
 *
 * @param {string[]} fields - Fields to search
 * @param {string} query - Search query
 * @param {number} threshold - Similarity threshold (0-1)
 * @returns {WhereOptions} Fuzzy search WHERE clause
 *
 * @example
 * ```typescript
 * const where = buildFuzzyWhere(['firstName', 'lastName', 'email'], 'john', 0.3);
 * ```
 */
export declare function buildFuzzyWhere(fields: string[], query: string, threshold?: number): WhereOptions;
/**
 * Builds a date range WHERE clause with timezone support.
 * Handles various date formats and edge cases.
 *
 * @param {string} field - Date field name
 * @param {Date | string} startDate - Start date
 * @param {Date | string} endDate - End date
 * @param {boolean} inclusive - Include boundaries (default: true)
 * @returns {WhereOptions} Date range WHERE clause
 *
 * @example
 * ```typescript
 * const where = buildDateRangeWhere('createdAt', '2024-01-01', '2024-12-31', true);
 * ```
 */
export declare function buildDateRangeWhere(field: string, startDate: Date | string, endDate: Date | string, inclusive?: boolean): WhereOptions;
/**
 * Builds a WHERE clause for array field queries (PostgreSQL).
 * Supports overlap, contains, and contained by operators.
 *
 * @param {string} field - Array field name
 * @param {any[]} values - Values to check
 * @param {string} operator - Array operator type
 * @returns {WhereOptions} Array WHERE clause
 *
 * @example
 * ```typescript
 * const where = buildArrayWhere('tags', ['javascript', 'typescript'], 'overlap');
 * ```
 */
export declare function buildArrayWhere(field: string, values: any[], operator?: 'overlap' | 'contains' | 'contained'): WhereOptions;
/**
 * Builds a case-insensitive WHERE clause for multiple fields.
 * Automatically handles string normalization.
 *
 * @param {Record<string, string>} fieldValues - Field-value pairs
 * @returns {WhereOptions} Case-insensitive WHERE clause
 *
 * @example
 * ```typescript
 * const where = buildCaseInsensitiveWhere({
 *   email: 'USER@EXAMPLE.COM',
 *   username: 'JohnDoe'
 * });
 * ```
 */
export declare function buildCaseInsensitiveWhere(fieldValues: Record<string, string>): WhereOptions;
/**
 * Builds a subquery for use in WHERE IN clauses.
 * Optimized for performance with large datasets.
 *
 * @template T - Model type
 * @param {SubqueryConfig<T>} config - Subquery configuration
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Literal} Subquery literal
 *
 * @example
 * ```typescript
 * const subquery = buildSubqueryIn({
 *   model: Post,
 *   attributes: ['authorId'],
 *   where: { status: 'published' },
 *   distinct: true
 * }, sequelize);
 *
 * const users = await User.findAll({
 *   where: { id: { [Op.in]: subquery } }
 * });
 * ```
 */
export declare function buildSubqueryIn<T extends Model>(config: SubqueryConfig<T>, sequelize: Sequelize): Literal;
/**
 * Builds a correlated subquery for complex filtering.
 * Allows referencing parent query fields.
 *
 * @param {string} query - SQL query with placeholders
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Literal} Correlated subquery literal
 *
 * @example
 * ```typescript
 * const subquery = buildCorrelatedSubquery(
 *   `(SELECT COUNT(*) FROM posts WHERE posts.author_id = User.id AND posts.status = 'published')`,
 *   sequelize
 * );
 *
 * const users = await User.findAll({
 *   attributes: {
 *     include: [[subquery, 'publishedPostCount']]
 *   }
 * });
 * ```
 */
export declare function buildCorrelatedSubquery(query: string, sequelize: Sequelize): Literal;
/**
 * Builds an EXISTS subquery for efficient existence checks.
 * More performant than COUNT for large tables.
 *
 * @template T - Model type
 * @param {SubqueryConfig<T>} config - Subquery configuration
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {boolean} notExists - Use NOT EXISTS instead (default: false)
 * @returns {Where} EXISTS subquery
 *
 * @example
 * ```typescript
 * const existsSubquery = buildExistsSubquery({
 *   model: Post,
 *   attributes: ['id'],
 *   where: sequelize.literal('posts.author_id = User.id AND posts.status = \'published\'')
 * }, sequelize);
 * ```
 */
export declare function buildExistsSubquery<T extends Model>(config: SubqueryConfig<T>, sequelize: Sequelize, notExists?: boolean): Literal;
/**
 * Builds a complex aggregation query with grouping and HAVING clauses.
 * Supports multiple aggregate functions.
 *
 * @template T - Model type
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {AggregationOptions} options - Aggregation options
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Aggregation results
 *
 * @example
 * ```typescript
 * const results = await buildAggregationQuery(User, {
 *   groupBy: ['status', 'role'],
 *   aggregates: [
 *     { field: 'id', function: 'COUNT', alias: 'userCount' },
 *     { field: 'age', function: 'AVG', alias: 'avgAge' }
 *   ],
 *   having: { userCount: { [Op.gt]: 10 } }
 * }, sequelize);
 * ```
 */
export declare function buildAggregationQuery<T extends Model>(model: ModelStatic<T>, options: AggregationOptions, sequelize: Sequelize): Promise<any[]>;
/**
 * Calculates aggregate statistics for a numeric field.
 * Returns min, max, avg, sum, stddev, and count.
 *
 * @template T - Model type
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {string} field - Field to aggregate
 * @param {WhereOptions} where - Optional WHERE clause
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<object>} Aggregate statistics
 *
 * @example
 * ```typescript
 * const stats = await calculateFieldStats(Order, 'totalAmount',
 *   { status: 'completed' }, sequelize
 * );
 * // Returns: { min, max, avg, sum, stddev, count }
 * ```
 */
export declare function calculateFieldStats<T extends Model>(model: ModelStatic<T>, field: string, where: WhereOptions, sequelize: Sequelize): Promise<{
    min: number;
    max: number;
    avg: number;
    sum: number;
    stddev: number;
    count: number;
}>;
/**
 * Performs percentile calculations on a numeric field.
 * Useful for statistical analysis and reporting.
 *
 * @template T - Model type
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {string} field - Field to analyze
 * @param {number[]} percentiles - Percentiles to calculate (0-1)
 * @param {WhereOptions} where - Optional WHERE clause
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, number>>} Percentile values
 *
 * @example
 * ```typescript
 * const percentiles = await calculatePercentiles(Order, 'totalAmount',
 *   [0.25, 0.5, 0.75, 0.95], { status: 'completed' }, sequelize
 * );
 * // Returns: { p25: 100, p50: 250, p75: 500, p95: 1000 }
 * ```
 */
export declare function calculatePercentiles<T extends Model>(model: ModelStatic<T>, field: string, percentiles: number[], where: WhereOptions, sequelize: Sequelize): Promise<Record<string, number>>;
/**
 * Builds a window function expression for advanced analytics.
 * Supports ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, etc.
 *
 * @param {WindowFunctionConfig} config - Window function configuration
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Literal} Window function literal
 *
 * @example
 * ```typescript
 * const rowNumber = buildWindowFunction({
 *   function: 'ROW_NUMBER',
 *   alias: 'rowNum',
 *   partitionBy: ['categoryId'],
 *   orderBy: [['createdAt', 'DESC']]
 * }, sequelize);
 *
 * const results = await Post.findAll({
 *   attributes: { include: [[rowNumber, 'rowNum']] }
 * });
 * ```
 */
export declare function buildWindowFunction(config: WindowFunctionConfig, sequelize: Sequelize): [Literal, string];
/**
 * Builds a ranking query with multiple ranking methods.
 * Returns ROW_NUMBER, RANK, and DENSE_RANK for comparison.
 *
 * @template T - Model type
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {string[]} partitionBy - Partition fields
 * @param {OrderItem[]} orderBy - Order specification
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Ranked results
 *
 * @example
 * ```typescript
 * const ranked = await buildRankingQuery(Student,
 *   ['grade', 'section'],
 *   [['score', 'DESC']],
 *   sequelize
 * );
 * ```
 */
export declare function buildRankingQuery<T extends Model>(model: ModelStatic<T>, partitionBy: string[], orderBy: OrderItem[], sequelize: Sequelize): Promise<any[]>;
/**
 * Executes a parameterized raw SQL query with automatic type mapping.
 * Prevents SQL injection through proper parameter binding.
 *
 * @template T - Result type
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} query - SQL query with :param placeholders
 * @param {Record<string, any>} replacements - Parameter values
 * @param {QueryTypes} type - Query type
 * @returns {Promise<T[]>} Query results
 *
 * @example
 * ```typescript
 * const users = await executeRawQuery<User>(sequelize,
 *   'SELECT * FROM users WHERE status = :status AND age >= :minAge',
 *   { status: 'active', minAge: 18 },
 *   QueryTypes.SELECT
 * );
 * ```
 */
export declare function executeRawQuery<T = any>(sequelize: Sequelize, query: string, replacements?: Record<string, any>, type?: QueryTypes): Promise<T[]>;
/**
 * Builds and executes a CTE (Common Table Expression) query.
 * Supports recursive and materialized CTEs.
 *
 * @param {CTEConfig[]} ctes - CTE configurations
 * @param {string} mainQuery - Main query using CTEs
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Record<string, any>} replacements - Parameter replacements
 * @returns {Promise<any[]>} Query results
 *
 * @example
 * ```typescript
 * const results = await buildCTEQuery([
 *   {
 *     name: 'active_users',
 *     query: 'SELECT * FROM users WHERE status = \'active\'',
 *     materialized: true
 *   }
 * ], 'SELECT * FROM active_users WHERE age >= 18', sequelize);
 * ```
 */
export declare function buildCTEQuery(ctes: CTEConfig[], mainQuery: string, sequelize: Sequelize, replacements?: Record<string, any>): Promise<any[]>;
/**
 * Executes a query with EXPLAIN ANALYZE for performance analysis.
 * Returns query plan and execution statistics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} query - Query to analyze
 * @param {Record<string, any>} replacements - Parameter replacements
 * @returns {Promise<any[]>} Query execution plan
 *
 * @example
 * ```typescript
 * const plan = await explainQuery(sequelize,
 *   'SELECT * FROM users WHERE status = :status',
 *   { status: 'active' }
 * );
 * console.log('Execution plan:', plan);
 * ```
 */
export declare function explainQuery(sequelize: Sequelize, query: string, replacements?: Record<string, any>): Promise<any[]>;
/**
 * Performs bulk create with batch processing for large datasets.
 * Prevents memory issues and provides progress tracking.
 *
 * @template T - Model type
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {Array<Partial<InferCreationAttributes<T>>>} records - Records to create
 * @param {BulkOperationConfig} config - Bulk operation configuration
 * @returns {Promise<T[]>} Created instances
 *
 * @example
 * ```typescript
 * const users = await bulkCreateBatched(User, largeUserArray, {
 *   batchSize: 1000,
 *   validate: true,
 *   ignoreDuplicates: true
 * });
 * ```
 */
export declare function bulkCreateBatched<T extends Model>(model: ModelStatic<T>, records: Array<Partial<InferCreationAttributes<T>>>, config?: BulkOperationConfig): Promise<T[]>;
/**
 * Performs bulk update with optimized batching and progress tracking.
 * More efficient than individual updates for large datasets.
 *
 * @template T - Model type
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {Partial<InferAttributes<T>>} values - Values to update
 * @param {WhereOptions} where - WHERE clause
 * @param {BulkOperationConfig} config - Bulk operation configuration
 * @returns {Promise<number>} Number of affected rows
 *
 * @example
 * ```typescript
 * const updated = await bulkUpdateOptimized(User,
 *   { status: 'inactive' },
 *   { lastLogin: { [Op.lt]: sixMonthsAgo } },
 *   { hooks: false, validate: false }
 * );
 * ```
 */
export declare function bulkUpdateOptimized<T extends Model>(model: ModelStatic<T>, values: Partial<InferAttributes<T>>, where: WhereOptions, config?: BulkOperationConfig): Promise<number>;
/**
 * Performs upsert operation with conflict resolution.
 * Updates on conflict or creates new record.
 *
 * @template T - Model type
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {Partial<InferCreationAttributes<T>>} values - Values to upsert
 * @param {string[]} conflictFields - Fields that define uniqueness
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<{ instance: T; created: boolean }>} Upserted instance
 *
 * @example
 * ```typescript
 * const { instance, created } = await upsertWithConflict(User,
 *   { email: 'user@example.com', firstName: 'John', status: 'active' },
 *   ['email']
 * );
 * ```
 */
export declare function upsertWithConflict<T extends Model>(model: ModelStatic<T>, values: Partial<InferCreationAttributes<T>>, conflictFields: string[], transaction?: Transaction): Promise<{
    instance: T;
    created: boolean;
}>;
/**
 * Executes a function within a managed transaction with automatic retry.
 * Handles deadlocks and transient failures.
 *
 * @template T - Return type
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Function} callback - Function to execute in transaction
 * @param {object} options - Transaction options
 * @returns {Promise<T>} Transaction result
 *
 * @example
 * ```typescript
 * const result = await executeInTransaction(sequelize, async (t) => {
 *   const user = await User.create({ ... }, { transaction: t });
 *   const profile = await Profile.create({ userId: user.id }, { transaction: t });
 *   return { user, profile };
 * }, { isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE });
 * ```
 */
export declare function executeInTransaction<T>(sequelize: Sequelize, callback: (transaction: Transaction) => Promise<T>, options?: {
    isolationLevel?: string;
    maxRetries?: number;
    retryDelay?: number;
}): Promise<T>;
/**
 * Executes multiple operations in parallel within a single transaction.
 * Optimizes performance while maintaining ACID properties.
 *
 * @template T - Return type
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Array<Function>} operations - Array of async operations
 * @param {Transaction} transaction - Optional existing transaction
 * @returns {Promise<T[]>} Results of all operations
 *
 * @example
 * ```typescript
 * const results = await executeParallelInTransaction(sequelize, [
 *   (t) => User.findAll({ transaction: t }),
 *   (t) => Post.findAll({ transaction: t }),
 *   (t) => Comment.findAll({ transaction: t })
 * ]);
 * ```
 */
export declare function executeParallelInTransaction<T = any>(sequelize: Sequelize, operations: Array<(transaction: Transaction) => Promise<T>>, transaction?: Transaction): Promise<T[]>;
/**
 * Acquires a row-level lock with configurable lock type.
 * Prevents concurrent modifications.
 *
 * @template T - Model type
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {WhereOptions} where - WHERE clause
 * @param {LockConfig} config - Lock configuration
 * @param {Transaction} transaction - Transaction (required)
 * @returns {Promise<T | null>} Locked instance
 *
 * @example
 * ```typescript
 * await sequelize.transaction(async (t) => {
 *   const account = await acquireRowLock(Account,
 *     { id: accountId },
 *     { level: 'UPDATE', nowait: true },
 *     t
 *   );
 *   // Perform operations on locked row
 * });
 * ```
 */
export declare function acquireRowLock<T extends Model>(model: ModelStatic<T>, where: WhereOptions, config: LockConfig, transaction: Transaction): Promise<T | null>;
/**
 * Executes operations with pessimistic locking for data consistency.
 * Locks rows before modification to prevent race conditions.
 *
 * @template T - Return type
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Function} callback - Callback with locked resources
 * @param {LockConfig} config - Lock configuration
 * @returns {Promise<T>} Operation result
 *
 * @example
 * ```typescript
 * const result = await executeWithLock(sequelize, async (t) => {
 *   const account = await Account.findByPk(accountId, {
 *     lock: t.LOCK.UPDATE,
 *     transaction: t
 *   });
 *   // Perform locked operations
 *   return account;
 * }, { level: 'UPDATE' });
 * ```
 */
export declare function executeWithLock<T>(sequelize: Sequelize, callback: (transaction: Transaction) => Promise<T>, config: LockConfig): Promise<T>;
/**
 * Builds a comprehensive search query across multiple fields.
 * Supports exact, fuzzy, and wildcard matching.
 *
 * @param {SearchConfig} config - Search configuration
 * @returns {WhereOptions} Search WHERE clause
 *
 * @example
 * ```typescript
 * const where = buildSearchQuery({
 *   fields: ['firstName', 'lastName', 'email'],
 *   query: 'john',
 *   fuzzy: true,
 *   wildcard: 'both',
 *   caseInsensitive: true
 * });
 * ```
 */
export declare function buildSearchQuery(config: SearchConfig): WhereOptions;
/**
 * Builds filter conditions from an array of filter configurations.
 * Supports all common comparison operators.
 *
 * @param {FilterConfig[]} filters - Array of filter configurations
 * @returns {WhereOptions} Combined filter WHERE clause
 *
 * @example
 * ```typescript
 * const where = buildFilterQuery([
 *   { field: 'age', operator: 'gte', value: 18 },
 *   { field: 'status', operator: 'in', values: ['active', 'pending'] },
 *   { field: 'email', operator: 'like', value: '%@example.com' }
 * ]);
 * ```
 */
export declare function buildFilterQuery(filters: FilterConfig[]): WhereOptions;
/**
 * Builds sorting configuration from sort specifications.
 * Supports multi-field sorting with null handling.
 *
 * @param {SortConfig[]} sorts - Array of sort configurations
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Order} Sequelize order array
 *
 * @example
 * ```typescript
 * const order = buildSortQuery([
 *   { field: 'status', direction: 'ASC', nulls: 'LAST' },
 *   { field: 'createdAt', direction: 'DESC' }
 * ], sequelize);
 * ```
 */
export declare function buildSortQuery(sorts: SortConfig[], sequelize: Sequelize): Order;
/**
 * Builds a complete query from a dynamic configuration object.
 * Useful for API query builders and dynamic filtering.
 *
 * @template T - Model type
 * @param {DynamicQueryConfig} config - Dynamic query configuration
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {FindOptions<InferAttributes<T>>} Constructed query options
 *
 * @example
 * ```typescript
 * const queryOptions = buildDynamicQuery({
 *   select: ['id', 'name', 'email'],
 *   where: { status: 'active', age: { $gte: 18 } },
 *   order: [{ field: 'createdAt', direction: 'DESC' }],
 *   limit: 20,
 *   offset: 0
 * }, sequelize);
 *
 * const results = await User.findAll(queryOptions);
 * ```
 */
export declare function buildDynamicQuery<T extends Model>(config: DynamicQueryConfig, sequelize: Sequelize): FindOptions<InferAttributes<T>>;
/**
 * Converts dynamic where object to Sequelize WhereOptions.
 * Handles special operators like $gte, $in, etc.
 *
 * @param {Record<string, any>} dynamicWhere - Dynamic where object
 * @returns {WhereOptions} Sequelize where options
 *
 * @example
 * ```typescript
 * const where = convertDynamicWhere({
 *   age: { $gte: 18, $lte: 65 },
 *   status: { $in: ['active', 'pending'] },
 *   name: { $like: '%John%' }
 * });
 * ```
 */
export declare function convertDynamicWhere(dynamicWhere: Record<string, any>): WhereOptions;
/**
 * Transforms query results using custom mapping, filtering, and reduction.
 * Provides flexible result post-processing.
 *
 * @template T - Input type
 * @template R - Output type
 * @param {T[]} results - Query results
 * @param {TransformerConfig<T, R>} config - Transformer configuration
 * @returns {R[] | any} Transformed results
 *
 * @example
 * ```typescript
 * const transformed = transformQueryResults(users, {
 *   map: (user) => ({ id: user.id, fullName: `${user.firstName} ${user.lastName}` }),
 *   filter: (user) => user.age >= 18,
 *   distinct: true
 * });
 * ```
 */
export declare function transformQueryResults<T = any, R = any>(results: T[], config: TransformerConfig<T, R>): R[] | any;
/**
 * Converts flat query results into hierarchical tree structure.
 * Useful for nested categories, organizational charts, etc.
 *
 * @template T - Item type
 * @param {T[]} items - Flat array of items
 * @param {string} idField - ID field name
 * @param {string} parentField - Parent ID field name
 * @param {string} childrenField - Children field name
 * @returns {T[]} Hierarchical tree structure
 *
 * @example
 * ```typescript
 * const tree = buildHierarchicalTree(categories, 'id', 'parentId', 'children');
 * // Returns nested tree structure
 * ```
 */
export declare function buildHierarchicalTree<T extends Record<string, any>>(items: T[], idField?: string, parentField?: string, childrenField?: string): T[];
/**
 * Flattens hierarchical tree structure back to flat array.
 * Inverse operation of buildHierarchicalTree.
 *
 * @template T - Item type
 * @param {T[]} tree - Hierarchical tree structure
 * @param {string} childrenField - Children field name
 * @param {boolean} includeChildren - Keep children field in result
 * @returns {T[]} Flat array
 *
 * @example
 * ```typescript
 * const flat = flattenHierarchicalTree(tree, 'children', false);
 * ```
 */
export declare function flattenHierarchicalTree<T extends Record<string, any>>(tree: T[], childrenField?: string, includeChildren?: boolean): T[];
/**
 * Groups query results by a specified field or function.
 * Creates a map of grouped items.
 *
 * @template T - Item type
 * @param {T[]} items - Items to group
 * @param {string | ((item: T) => string)} groupBy - Group key field or function
 * @returns {Map<string, T[]>} Grouped results map
 *
 * @example
 * ```typescript
 * const grouped = groupQueryResults(users, 'status');
 * // Returns: Map { 'active' => [...], 'inactive' => [...] }
 *
 * const groupedByAge = groupQueryResults(users, (u) => u.age >= 18 ? 'adult' : 'minor');
 * ```
 */
export declare function groupQueryResults<T extends Record<string, any>>(items: T[], groupBy: string | ((item: T) => string)): Map<string, T[]>;
/**
 * Paginates an array of results with metadata.
 * Useful for in-memory pagination after complex transformations.
 *
 * @template T - Item type
 * @param {T[]} items - Items to paginate
 * @param {number} page - Page number (1-based)
 * @param {number} pageSize - Items per page
 * @returns {object} Paginated results with metadata
 *
 * @example
 * ```typescript
 * const paginated = paginateResults(allUsers, 2, 20);
 * // Returns: { data, page, pageSize, totalPages, totalItems, hasNext, hasPrev }
 * ```
 */
export declare function paginateResults<T>(items: T[], page: number, pageSize: number): {
    data: T[];
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
};
/**
 * Analyzes query performance and provides optimization suggestions.
 * Checks for common performance issues.
 *
 * @template T - Model type
 * @param {FindOptions<InferAttributes<T>>} options - Query options to analyze
 * @returns {object} Analysis results with suggestions
 *
 * @example
 * ```typescript
 * const analysis = analyzeQueryPerformance({
 *   include: [{ model: Post, include: [{ model: Comment }] }],
 *   limit: 1000
 * });
 * console.log('Warnings:', analysis.warnings);
 * console.log('Suggestions:', analysis.suggestions);
 * ```
 */
export declare function analyzeQueryPerformance<T extends Model>(options: FindOptions<InferAttributes<T>>): {
    warnings: string[];
    suggestions: string[];
    score: number;
};
/**
 * Creates an optimized version of a query with performance best practices.
 * Automatically applies common optimizations.
 *
 * @template T - Model type
 * @param {FindOptions<InferAttributes<T>>} options - Original query options
 * @returns {FindOptions<InferAttributes<T>>} Optimized query options
 *
 * @example
 * ```typescript
 * const optimized = optimizeQuery({
 *   include: [{ model: Post }],
 *   // ... other options
 * });
 * ```
 */
export declare function optimizeQuery<T extends Model>(options: FindOptions<InferAttributes<T>>): FindOptions<InferAttributes<T>>;
declare const _default: {
    findOneSafe: typeof findOneSafe;
    findWithRetry: typeof findWithRetry;
    findWithCursor: typeof findWithCursor;
    findOrCreateSafe: typeof findOrCreateSafe;
    findWithOptimizedIncludes: typeof findWithOptimizedIncludes;
    buildNestedWhere: typeof buildNestedWhere;
    buildJsonWhere: typeof buildJsonWhere;
    buildFuzzyWhere: typeof buildFuzzyWhere;
    buildDateRangeWhere: typeof buildDateRangeWhere;
    buildArrayWhere: typeof buildArrayWhere;
    buildCaseInsensitiveWhere: typeof buildCaseInsensitiveWhere;
    buildSubqueryIn: typeof buildSubqueryIn;
    buildCorrelatedSubquery: typeof buildCorrelatedSubquery;
    buildExistsSubquery: typeof buildExistsSubquery;
    buildAggregationQuery: typeof buildAggregationQuery;
    calculateFieldStats: typeof calculateFieldStats;
    calculatePercentiles: typeof calculatePercentiles;
    buildWindowFunction: typeof buildWindowFunction;
    buildRankingQuery: typeof buildRankingQuery;
    executeRawQuery: typeof executeRawQuery;
    buildCTEQuery: typeof buildCTEQuery;
    explainQuery: typeof explainQuery;
    bulkCreateBatched: typeof bulkCreateBatched;
    bulkUpdateOptimized: typeof bulkUpdateOptimized;
    upsertWithConflict: typeof upsertWithConflict;
    executeInTransaction: typeof executeInTransaction;
    executeParallelInTransaction: typeof executeParallelInTransaction;
    acquireRowLock: typeof acquireRowLock;
    executeWithLock: typeof executeWithLock;
    buildSearchQuery: typeof buildSearchQuery;
    buildFilterQuery: typeof buildFilterQuery;
    buildSortQuery: typeof buildSortQuery;
    buildDynamicQuery: typeof buildDynamicQuery;
    convertDynamicWhere: typeof convertDynamicWhere;
    transformQueryResults: typeof transformQueryResults;
    buildHierarchicalTree: typeof buildHierarchicalTree;
    flattenHierarchicalTree: typeof flattenHierarchicalTree;
    groupQueryResults: typeof groupQueryResults;
    paginateResults: typeof paginateResults;
    analyzeQueryPerformance: typeof analyzeQueryPerformance;
    optimizeQuery: typeof optimizeQuery;
};
export default _default;
//# sourceMappingURL=query-builder-kit.d.ts.map