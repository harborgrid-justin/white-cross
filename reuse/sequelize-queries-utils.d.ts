/**
 * @fileoverview Sequelize Query Utilities
 * @module reuse/sequelize-queries-utils
 * @description Comprehensive query utilities for Sequelize v6 covering query builders, finders,
 * where clauses, operators, aggregation, subqueries, transactions, bulk operations, and pagination.
 *
 * Key Features:
 * - Advanced query builder helpers
 * - Enhanced finder utilities (findOne, findAll)
 * - Where clause and operator builders
 * - Aggregation and grouping helpers
 * - Subquery and correlated query builders
 * - Raw query utilities with parameter binding
 * - Transaction management helpers
 * - Bulk operation optimizers
 * - Pagination and cursor utilities
 * - Sorting and ordering helpers
 * - Search and filter builders
 * - Query optimization and caching
 * - Lazy and eager loading utilities
 * - Healthcare-specific query patterns
 *
 * @target Sequelize v6.x, Node 18+, TypeScript 5.x
 *
 * @security
 * - SQL injection prevention through parameterized queries
 * - HIPAA-compliant data filtering
 * - Audit trail query builders
 * - Soft delete support
 * - Row-level security helpers
 * - Data masking utilities
 *
 * @example Basic usage
 * ```typescript
 * import { buildWhereClause, createPagination, safeFindOne } from './sequelize-queries-utils';
 *
 * // Build complex where clause
 * const where = buildWhereClause({
 *   status: 'active',
 *   age: { gt: 18 }
 * });
 *
 * // Safe finder with error handling
 * const user = await safeFindOne(User, { where });
 *
 * // Pagination
 * const pagination = createPagination(1, 20);
 * ```
 *
 * @example Advanced usage
 * ```typescript
 * import {
 *   buildSubquery,
 *   createTransactionWrapper,
 *   buildAggregationQuery,
 *   createCursorPagination
 * } from './sequelize-queries-utils';
 *
 * // Subquery builder
 * const subquery = buildSubquery(Post, {
 *   attributes: ['authorId'],
 *   where: { status: 'published' }
 * });
 *
 * // Transaction wrapper
 * const result = await createTransactionWrapper(sequelize, async (t) => {
 *   await User.create({ name: 'John' }, { transaction: t });
 * });
 * ```
 *
 * LOC: SQ48K7M923
 * UPSTREAM: sequelize, @types/sequelize
 * DOWNSTREAM: services, repositories, models
 *
 * @version 1.0.0
 * @since 2025-11-08
 */
import { Model, ModelStatic, FindOptions, WhereOptions, Transaction, Sequelize, QueryTypes, Order, Includeable, CreationAttributes, Literal, FindAndCountOptions, CreateOptions } from 'sequelize';
/**
 * @interface PaginationOptions
 * @description Options for pagination queries
 */
export interface PaginationOptions {
    /** Page number (1-indexed) */
    page: number;
    /** Items per page */
    limit: number;
    /** Offset override */
    offset?: number;
}
/**
 * @interface PaginationResult
 * @description Pagination metadata result
 */
export interface PaginationResult {
    /** SQL LIMIT value */
    limit: number;
    /** SQL OFFSET value */
    offset: number;
    /** Current page number */
    page: number;
    /** Total pages */
    totalPages?: number;
}
/**
 * @interface CursorPaginationOptions
 * @description Options for cursor-based pagination
 */
export interface CursorPaginationOptions {
    /** Cursor value (timestamp, id, etc) */
    cursor?: string | Date | number;
    /** Items per page */
    limit: number;
    /** Sort direction */
    direction?: 'ASC' | 'DESC';
    /** Cursor field name */
    cursorField?: string;
}
/**
 * @interface SearchOptions
 * @description Options for search queries
 */
export interface SearchOptions {
    /** Search term */
    query: string;
    /** Fields to search in */
    fields: string[];
    /** Case sensitive search */
    caseSensitive?: boolean;
    /** Exact match vs partial */
    exact?: boolean;
}
/**
 * @interface FilterOptions
 * @description Generic filter options
 */
export interface FilterOptions {
    /** Filter conditions */
    filters: Record<string, any>;
    /** AND/OR logic */
    logic?: 'AND' | 'OR';
    /** Include soft deleted */
    paranoid?: boolean;
}
/**
 * @interface AggregationOptions
 * @description Options for aggregation queries
 */
export interface AggregationOptions {
    /** Function to apply (COUNT, SUM, AVG, etc) */
    fn: 'COUNT' | 'SUM' | 'AVG' | 'MAX' | 'MIN';
    /** Field to aggregate */
    field: string;
    /** Alias for result */
    alias?: string;
    /** DISTINCT aggregation */
    distinct?: boolean;
}
/**
 * @interface SubqueryOptions
 * @description Options for building subqueries
 */
export interface SubqueryOptions<M extends Model> {
    /** Model to query */
    model: ModelStatic<M>;
    /** Attributes to select */
    attributes: string[];
    /** Where conditions */
    where?: WhereOptions;
    /** Include associations */
    include?: Includeable[];
}
/**
 * @interface BulkOperationOptions
 * @description Options for bulk operations
 */
export interface BulkOperationOptions {
    /** Batch size for processing */
    batchSize?: number;
    /** Validate each record */
    validate?: boolean;
    /** Run hooks */
    hooks?: boolean;
    /** Transaction to use */
    transaction?: Transaction;
}
/**
 * @interface QueryBuilderOptions
 * @description Comprehensive query builder options
 */
export interface QueryBuilderOptions {
    /** Where conditions */
    where?: WhereOptions;
    /** Attributes to select */
    attributes?: string[];
    /** Attributes to exclude */
    exclude?: string[];
    /** Include associations */
    include?: Includeable[];
    /** Order by */
    order?: Order;
    /** Limit */
    limit?: number;
    /** Offset */
    offset?: number;
    /** Group by */
    group?: string[];
    /** Having clause */
    having?: WhereOptions;
    /** Use subquery */
    subQuery?: boolean;
    /** Include paranoid */
    paranoid?: boolean;
}
/**
 * @function buildWhereClause
 * @description Builds a Sequelize where clause from a simple object
 *
 * @template T
 * @param {Record<string, any>} conditions - Simple conditions object
 * @param {WhereOptions} options - Additional where options
 * @returns {WhereOptions} Sequelize where clause
 *
 * @example
 * ```typescript
 * const where = buildWhereClause({
 *   status: 'active',
 *   age: { gt: 18 },
 *   email: { like: '%@example.com' }
 * });
 *
 * const users = await User.findAll({ where });
 * ```
 */
export declare function buildWhereClause(conditions: Record<string, any>, options?: WhereOptions): WhereOptions;
/**
 * @function buildQueryOptions
 * @description Builds comprehensive Sequelize query options
 *
 * @template M
 * @param {QueryBuilderOptions} options - Query builder options
 * @returns {FindOptions<M>} Sequelize find options
 *
 * @example
 * ```typescript
 * const options = buildQueryOptions({
 *   where: { status: 'active' },
 *   attributes: ['id', 'name'],
 *   order: [['createdAt', 'DESC']],
 *   limit: 10
 * });
 *
 * const users = await User.findAll(options);
 * ```
 */
export declare function buildQueryOptions<M extends Model>(options: QueryBuilderOptions): FindOptions<M>;
/**
 * @function buildSelectAttributes
 * @description Builds attribute selection with inclusions and exclusions
 *
 * @param {string[]} include - Attributes to include
 * @param {string[]} exclude - Attributes to exclude
 * @param {Array<[any, string]>} computed - Computed attributes
 * @returns {any} Sequelize attributes configuration
 *
 * @example
 * ```typescript
 * const attributes = buildSelectAttributes(
 *   ['id', 'name', 'email'],
 *   ['password', 'resetToken'],
 *   [[sequelize.fn('COUNT', sequelize.col('posts.id')), 'postCount']]
 * );
 * ```
 */
export declare function buildSelectAttributes(include?: string[], exclude?: string[], computed?: Array<[any, string]>): any;
/**
 * @function buildOrderClause
 * @description Builds Sequelize order clause from simple format
 *
 * @param {string | string[] | [string, string][]} orderBy - Order specification
 * @returns {Order} Sequelize order clause
 *
 * @example
 * ```typescript
 * // Simple string
 * const order1 = buildOrderClause('createdAt DESC');
 *
 * // Array of fields
 * const order2 = buildOrderClause(['name', 'createdAt DESC']);
 *
 * // Tuples
 * const order3 = buildOrderClause([['name', 'ASC'], ['createdAt', 'DESC']]);
 * ```
 */
export declare function buildOrderClause(orderBy: string | string[] | Array<[string, string]>): Order;
/**
 * @function safeFindOne
 * @description Safely finds one record with error handling
 *
 * @template M
 * @param {ModelStatic<M>} model - Sequelize model
 * @param {FindOptions<M>} options - Find options
 * @returns {Promise<M | null>} Found model or null
 *
 * @example
 * ```typescript
 * const user = await safeFindOne(User, {
 *   where: { email: 'user@example.com' }
 * });
 *
 * if (user) {
 *   console.log('User found:', user.name);
 * }
 * ```
 */
export declare function safeFindOne<M extends Model>(model: ModelStatic<M>, options: FindOptions<M>): Promise<M | null>;
/**
 * @function safeFindAll
 * @description Safely finds all records with error handling
 *
 * @template M
 * @param {ModelStatic<M>} model - Sequelize model
 * @param {FindOptions<M>} options - Find options
 * @returns {Promise<M[]>} Array of found models
 *
 * @example
 * ```typescript
 * const users = await safeFindAll(User, {
 *   where: { status: 'active' },
 *   limit: 10
 * });
 * ```
 */
export declare function safeFindAll<M extends Model>(model: ModelStatic<M>, options?: FindOptions<M>): Promise<M[]>;
/**
 * @function findByPkOrFail
 * @description Finds by primary key or throws error
 *
 * @template M
 * @param {ModelStatic<M>} model - Sequelize model
 * @param {string | number} id - Primary key value
 * @param {Omit<FindOptions<M>, 'where'>} options - Find options
 * @returns {Promise<M>} Found model
 * @throws {Error} If not found
 *
 * @example
 * ```typescript
 * try {
 *   const user = await findByPkOrFail(User, 123);
 * } catch (error) {
 *   console.error('User not found');
 * }
 * ```
 */
export declare function findByPkOrFail<M extends Model>(model: ModelStatic<M>, id: string | number, options?: Omit<FindOptions<M>, 'where'>): Promise<M>;
/**
 * @function findOneOrCreate
 * @description Finds one record or creates it if not found
 *
 * @template M
 * @param {ModelStatic<M>} model - Sequelize model
 * @param {FindOptions<M>} findOptions - Find options
 * @param {CreationAttributes<M>} defaults - Default values for creation
 * @param {CreateOptions<M>} createOptions - Create options
 * @returns {Promise<[M, boolean]>} Tuple of [instance, created]
 *
 * @example
 * ```typescript
 * const [user, created] = await findOneOrCreate(
 *   User,
 *   { where: { email: 'user@example.com' } },
 *   { name: 'New User', email: 'user@example.com' }
 * );
 *
 * console.log(created ? 'Created' : 'Found existing');
 * ```
 */
export declare function findOneOrCreate<M extends Model>(model: ModelStatic<M>, findOptions: FindOptions<M>, defaults: CreationAttributes<M>, createOptions?: CreateOptions<M>): Promise<[M, boolean]>;
/**
 * @function findOrBuild
 * @description Finds one record or builds (doesn't save) a new instance
 *
 * @template M
 * @param {ModelStatic<M>} model - Sequelize model
 * @param {FindOptions<M>} findOptions - Find options
 * @param {Partial<M>} defaults - Default values for build
 * @returns {Promise<[M, boolean]>} Tuple of [instance, found]
 *
 * @example
 * ```typescript
 * const [user, found] = await findOrBuild(
 *   User,
 *   { where: { email: 'user@example.com' } },
 *   { name: 'New User', email: 'user@example.com' }
 * );
 *
 * if (!found) {
 *   await user.save();
 * }
 * ```
 */
export declare function findOrBuild<M extends Model>(model: ModelStatic<M>, findOptions: FindOptions<M>, defaults?: Partial<M>): Promise<[M, boolean]>;
/**
 * @function findAndCountAllWithMeta
 * @description Find and count with additional metadata
 *
 * @template M
 * @param {ModelStatic<M>} model - Sequelize model
 * @param {FindAndCountOptions<M>} options - Find and count options
 * @returns {Promise<{rows: M[], count: number, totalPages: number, currentPage: number}>}
 *
 * @example
 * ```typescript
 * const result = await findAndCountAllWithMeta(User, {
 *   where: { status: 'active' },
 *   limit: 20,
 *   offset: 0
 * });
 *
 * console.log(`Page 1 of ${result.totalPages}, found ${result.count} total`);
 * ```
 */
export declare function findAndCountAllWithMeta<M extends Model>(model: ModelStatic<M>, options: FindAndCountOptions<M>): Promise<{
    rows: M[];
    count: number;
    totalPages: number;
    currentPage: number;
}>;
/**
 * @function buildAndCondition
 * @description Builds an AND condition from multiple where clauses
 *
 * @param {WhereOptions[]} conditions - Array of where conditions
 * @returns {WhereOptions} Combined AND condition
 *
 * @example
 * ```typescript
 * const where = buildAndCondition([
 *   { status: 'active' },
 *   { age: { [Op.gte]: 18 } },
 *   { verified: true }
 * ]);
 *
 * const users = await User.findAll({ where });
 * ```
 */
export declare function buildAndCondition(conditions: WhereOptions[]): WhereOptions;
/**
 * @function buildOrCondition
 * @description Builds an OR condition from multiple where clauses
 *
 * @param {WhereOptions[]} conditions - Array of where conditions
 * @returns {WhereOptions} Combined OR condition
 *
 * @example
 * ```typescript
 * const where = buildOrCondition([
 *   { email: 'user1@example.com' },
 *   { username: 'user1' }
 * ]);
 *
 * const user = await User.findOne({ where });
 * ```
 */
export declare function buildOrCondition(conditions: WhereOptions[]): WhereOptions;
/**
 * @function buildDateRangeCondition
 * @description Builds a date range where condition
 *
 * @param {string} field - Field name
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {WhereOptions} Date range condition
 *
 * @example
 * ```typescript
 * const where = buildDateRangeCondition(
 *   'createdAt',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 *
 * const records = await Model.findAll({ where });
 * ```
 */
export declare function buildDateRangeCondition(field: string, startDate: Date, endDate: Date): WhereOptions;
/**
 * @function buildInCondition
 * @description Builds an IN condition for array values
 *
 * @param {string} field - Field name
 * @param {any[]} values - Array of values
 * @returns {WhereOptions} IN condition
 *
 * @example
 * ```typescript
 * const where = buildInCondition('status', ['active', 'pending', 'verified']);
 * const users = await User.findAll({ where });
 * ```
 */
export declare function buildInCondition(field: string, values: any[]): WhereOptions;
/**
 * @function buildLikeCondition
 * @description Builds a LIKE condition with wildcards
 *
 * @param {string} field - Field name
 * @param {string} value - Search value
 * @param {object} options - Options for like condition
 * @returns {WhereOptions} LIKE condition
 *
 * @example
 * ```typescript
 * // Contains
 * const where1 = buildLikeCondition('email', 'example.com', { position: 'contains' });
 *
 * // Starts with
 * const where2 = buildLikeCondition('name', 'John', { position: 'start' });
 *
 * // Case insensitive
 * const where3 = buildLikeCondition('email', 'EXAMPLE', { caseSensitive: false });
 * ```
 */
export declare function buildLikeCondition(field: string, value: string, options?: {
    position?: 'start' | 'end' | 'contains';
    caseSensitive?: boolean;
}): WhereOptions;
/**
 * @function buildNullCheckCondition
 * @description Builds IS NULL or IS NOT NULL condition
 *
 * @param {string} field - Field name
 * @param {boolean} isNull - True for IS NULL, false for IS NOT NULL
 * @returns {WhereOptions} Null check condition
 *
 * @example
 * ```typescript
 * // Find records where deletedAt IS NULL
 * const activeWhere = buildNullCheckCondition('deletedAt', true);
 *
 * // Find records where email IS NOT NULL
 * const verifiedWhere = buildNullCheckCondition('email', false);
 * ```
 */
export declare function buildNullCheckCondition(field: string, isNull: boolean): WhereOptions;
/**
 * @function buildCountQuery
 * @description Builds a COUNT aggregation query
 *
 * @template M
 * @param {ModelStatic<M>} model - Sequelize model
 * @param {WhereOptions} where - Where conditions
 * @param {string} field - Field to count (default: '*')
 * @param {boolean} distinct - Use COUNT DISTINCT
 * @returns {Promise<number>} Count result
 *
 * @example
 * ```typescript
 * const activeUsers = await buildCountQuery(
 *   User,
 *   { status: 'active' }
 * );
 *
 * const uniqueEmails = await buildCountQuery(
 *   User,
 *   {},
 *   'email',
 *   true
 * );
 * ```
 */
export declare function buildCountQuery<M extends Model>(model: ModelStatic<M>, where?: WhereOptions, field?: string, distinct?: boolean): Promise<number>;
/**
 * @function buildSumQuery
 * @description Builds a SUM aggregation query
 *
 * @template M
 * @param {ModelStatic<M>} model - Sequelize model
 * @param {string} field - Field to sum
 * @param {WhereOptions} where - Where conditions
 * @returns {Promise<number>} Sum result
 *
 * @example
 * ```typescript
 * const totalRevenue = await buildSumQuery(
 *   Order,
 *   'amount',
 *   { status: 'completed' }
 * );
 * ```
 */
export declare function buildSumQuery<M extends Model>(model: ModelStatic<M>, field: string, where?: WhereOptions): Promise<number>;
/**
 * @function buildAvgQuery
 * @description Builds an AVG aggregation query
 *
 * @template M
 * @param {ModelStatic<M>} model - Sequelize model
 * @param {string} field - Field to average
 * @param {WhereOptions} where - Where conditions
 * @returns {Promise<number>} Average result
 *
 * @example
 * ```typescript
 * const avgRating = await buildAvgQuery(
 *   Product,
 *   'rating',
 *   { category: 'electronics' }
 * );
 * ```
 */
export declare function buildAvgQuery<M extends Model>(model: ModelStatic<M>, field: string, where?: WhereOptions): Promise<number>;
/**
 * @function buildMinMaxQuery
 * @description Builds MIN or MAX aggregation query
 *
 * @template M
 * @param {ModelStatic<M>} model - Sequelize model
 * @param {string} field - Field to find min/max
 * @param {'MIN' | 'MAX'} fn - Aggregation function
 * @param {WhereOptions} where - Where conditions
 * @returns {Promise<any>} Min or max value
 *
 * @example
 * ```typescript
 * const maxPrice = await buildMinMaxQuery(
 *   Product,
 *   'price',
 *   'MAX',
 *   { inStock: true }
 * );
 *
 * const minAge = await buildMinMaxQuery(User, 'age', 'MIN');
 * ```
 */
export declare function buildMinMaxQuery<M extends Model>(model: ModelStatic<M>, field: string, fn: 'MIN' | 'MAX', where?: WhereOptions): Promise<any>;
/**
 * @function buildGroupByQuery
 * @description Builds a GROUP BY aggregation query
 *
 * @template M
 * @param {ModelStatic<M>} model - Sequelize model
 * @param {string[]} groupFields - Fields to group by
 * @param {AggregationOptions[]} aggregations - Aggregations to apply
 * @param {WhereOptions} where - Where conditions
 * @returns {Promise<any[]>} Aggregation results
 *
 * @example
 * ```typescript
 * const usersByStatus = await buildGroupByQuery(
 *   User,
 *   ['status'],
 *   [{ fn: 'COUNT', field: 'id', alias: 'count' }],
 *   {}
 * );
 * ```
 */
export declare function buildGroupByQuery<M extends Model>(model: ModelStatic<M>, groupFields: string[], aggregations: AggregationOptions[], where?: WhereOptions): Promise<any[]>;
/**
 * @function buildSubquery
 * @description Builds a subquery for use in WHERE IN clauses
 *
 * @template M
 * @param {ModelStatic<M>} model - Sequelize model
 * @param {FindOptions<M>} options - Query options
 * @returns {Literal} Sequelize literal subquery
 *
 * @example
 * ```typescript
 * const subquery = buildSubquery(Post, {
 *   attributes: ['authorId'],
 *   where: { status: 'published' }
 * });
 *
 * const users = await User.findAll({
 *   where: { id: { [Op.in]: subquery } }
 * });
 * ```
 */
export declare function buildSubquery<M extends Model>(model: ModelStatic<M>, options: FindOptions<M>): Literal;
/**
 * @function buildExistsSubquery
 * @description Builds an EXISTS subquery condition
 *
 * @template M
 * @param {ModelStatic<M>} model - Sequelize model
 * @param {FindOptions<M>} options - Query options
 * @param {boolean} negate - Use NOT EXISTS
 * @returns {WhereOptions} EXISTS condition
 *
 * @example
 * ```typescript
 * // Find users who have published posts
 * const hasPostsCondition = buildExistsSubquery(
 *   Post,
 *   {
 *     where: {
 *       authorId: { [Op.col]: 'User.id' },
 *       status: 'published'
 *     }
 *   }
 * );
 *
 * const users = await User.findAll({
 *   where: hasPostsCondition
 * });
 * ```
 */
export declare function buildExistsSubquery<M extends Model>(model: ModelStatic<M>, options: FindOptions<M>, negate?: boolean): WhereOptions;
/**
 * @function buildCorrelatedSubquery
 * @description Builds a correlated subquery for computed fields
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sql - Raw SQL for subquery
 * @param {string} alias - Alias for the computed field
 * @returns {[Literal, string]} Attribute tuple for inclusion
 *
 * @example
 * ```typescript
 * const postCountSubquery = buildCorrelatedSubquery(
 *   sequelize,
 *   `SELECT COUNT(*) FROM posts WHERE posts.author_id = User.id`,
 *   'postCount'
 * );
 *
 * const users = await User.findAll({
 *   attributes: {
 *     include: [postCountSubquery]
 *   }
 * });
 * ```
 */
export declare function buildCorrelatedSubquery(sequelize: Sequelize, sql: string, alias: string): [Literal, string];
/**
 * @function createTransactionWrapper
 * @description Creates a managed transaction wrapper
 *
 * @template T
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {(t: Transaction) => Promise<T>} callback - Transaction callback
 * @param {object} options - Transaction options
 * @returns {Promise<T>} Transaction result
 *
 * @example
 * ```typescript
 * const result = await createTransactionWrapper(sequelize, async (t) => {
 *   const user = await User.create({ name: 'John' }, { transaction: t });
 *   await Profile.create({ userId: user.id }, { transaction: t });
 *   return user;
 * });
 * ```
 */
export declare function createTransactionWrapper<T>(sequelize: Sequelize, callback: (t: Transaction) => Promise<T>, options?: any): Promise<T>;
/**
 * @function createUnmanagedTransaction
 * @description Creates an unmanaged transaction for manual control
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} options - Transaction options
 * @returns {Promise<Transaction>} Transaction instance
 *
 * @example
 * ```typescript
 * const t = await createUnmanagedTransaction(sequelize);
 * try {
 *   await User.create({ name: 'John' }, { transaction: t });
 *   await t.commit();
 * } catch (error) {
 *   await t.rollback();
 *   throw error;
 * }
 * ```
 */
export declare function createUnmanagedTransaction(sequelize: Sequelize, options?: any): Promise<Transaction>;
/**
 * @function executeInTransaction
 * @description Executes multiple operations in a transaction
 *
 * @template T
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Array<(t: Transaction) => Promise<any>>} operations - Array of operations
 * @returns {Promise<T[]>} Array of operation results
 *
 * @example
 * ```typescript
 * const results = await executeInTransaction(sequelize, [
 *   (t) => User.create({ name: 'John' }, { transaction: t }),
 *   (t) => User.create({ name: 'Jane' }, { transaction: t }),
 * ]);
 * ```
 */
export declare function executeInTransaction<T = any>(sequelize: Sequelize, operations: Array<(t: Transaction) => Promise<T>>): Promise<T[]>;
/**
 * @function bulkCreateWithBatch
 * @description Creates records in batches for better performance
 *
 * @template M
 * @param {ModelStatic<M>} model - Sequelize model
 * @param {CreationAttributes<M>[]} records - Records to create
 * @param {BulkOperationOptions} options - Bulk operation options
 * @returns {Promise<M[]>} Created records
 *
 * @example
 * ```typescript
 * const users = await bulkCreateWithBatch(
 *   User,
 *   largeUserArray,
 *   { batchSize: 1000, validate: true }
 * );
 * ```
 */
export declare function bulkCreateWithBatch<M extends Model>(model: ModelStatic<M>, records: CreationAttributes<M>[], options?: BulkOperationOptions): Promise<M[]>;
/**
 * @function bulkUpdateWithBatch
 * @description Updates records in batches
 *
 * @template M
 * @param {ModelStatic<M>} model - Sequelize model
 * @param {Partial<M>} values - Values to update
 * @param {WhereOptions} where - Where conditions
 * @param {BulkOperationOptions} options - Bulk operation options
 * @returns {Promise<number>} Number of affected rows
 *
 * @example
 * ```typescript
 * const affected = await bulkUpdateWithBatch(
 *   User,
 *   { status: 'inactive' },
 *   { lastLogin: { [Op.lt]: oldDate } }
 * );
 * ```
 */
export declare function bulkUpdateWithBatch<M extends Model>(model: ModelStatic<M>, values: Partial<M>, where: WhereOptions, options?: BulkOperationOptions): Promise<number>;
/**
 * @function bulkDeleteWithBatch
 * @description Deletes records in batches
 *
 * @template M
 * @param {ModelStatic<M>} model - Sequelize model
 * @param {WhereOptions} where - Where conditions
 * @param {BulkOperationOptions & { force?: boolean }} options - Delete options
 * @returns {Promise<number>} Number of deleted rows
 *
 * @example
 * ```typescript
 * const deleted = await bulkDeleteWithBatch(
 *   User,
 *   { status: 'deleted', deletedAt: { [Op.lt]: thirtyDaysAgo } },
 *   { force: true }
 * );
 * ```
 */
export declare function bulkDeleteWithBatch<M extends Model>(model: ModelStatic<M>, where: WhereOptions, options?: BulkOperationOptions & {
    force?: boolean;
}): Promise<number>;
/**
 * @function createPagination
 * @description Creates pagination parameters
 *
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Items per page
 * @returns {PaginationResult} Pagination parameters
 *
 * @example
 * ```typescript
 * const pagination = createPagination(2, 20);
 * // { limit: 20, offset: 20, page: 2 }
 *
 * const users = await User.findAll({
 *   ...pagination,
 *   where: { status: 'active' }
 * });
 * ```
 */
export declare function createPagination(page: number, limit: number): PaginationResult;
/**
 * @function createCursorPagination
 * @description Creates cursor-based pagination conditions
 *
 * @param {CursorPaginationOptions} options - Cursor pagination options
 * @returns {FindOptions} Sequelize find options with cursor
 *
 * @example
 * ```typescript
 * const options = createCursorPagination({
 *   cursor: lastUser.createdAt,
 *   limit: 20,
 *   direction: 'DESC',
 *   cursorField: 'createdAt'
 * });
 *
 * const users = await User.findAll(options);
 * ```
 */
export declare function createCursorPagination(options: CursorPaginationOptions): FindOptions;
/**
 * @function calculateTotalPages
 * @description Calculates total pages from count and limit
 *
 * @param {number} totalCount - Total record count
 * @param {number} limit - Items per page
 * @returns {number} Total pages
 *
 * @example
 * ```typescript
 * const count = await User.count({ where: { status: 'active' } });
 * const totalPages = calculateTotalPages(count, 20);
 * ```
 */
export declare function calculateTotalPages(totalCount: number, limit: number): number;
/**
 * @function buildSearchCondition
 * @description Builds a search condition across multiple fields
 *
 * @param {SearchOptions} options - Search options
 * @returns {WhereOptions} Search where condition
 *
 * @example
 * ```typescript
 * const where = buildSearchCondition({
 *   query: 'john',
 *   fields: ['firstName', 'lastName', 'email'],
 *   caseSensitive: false
 * });
 *
 * const users = await User.findAll({ where });
 * ```
 */
export declare function buildSearchCondition(options: SearchOptions): WhereOptions;
/**
 * @function buildMultiFieldFilter
 * @description Builds a filter from multiple field conditions
 *
 * @param {FilterOptions} options - Filter options
 * @returns {WhereOptions} Filter where condition
 *
 * @example
 * ```typescript
 * const where = buildMultiFieldFilter({
 *   filters: {
 *     status: ['active', 'pending'],
 *     age: { gt: 18 },
 *     verified: true
 *   },
 *   logic: 'AND'
 * });
 * ```
 */
export declare function buildMultiFieldFilter(options: FilterOptions): WhereOptions;
/**
 * @function buildFullTextSearch
 * @description Builds a full-text search condition (PostgreSQL)
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string[]} fields - Fields to search
 * @param {string} query - Search query
 * @param {string} language - Text search language
 * @returns {WhereOptions} Full-text search condition
 *
 * @example
 * ```typescript
 * const where = buildFullTextSearch(
 *   sequelize,
 *   ['title', 'description'],
 *   'medical records',
 *   'english'
 * );
 *
 * const articles = await Article.findAll({ where });
 * ```
 */
export declare function buildFullTextSearch(sequelize: Sequelize, fields: string[], query: string, language?: string): WhereOptions;
/**
 * @function executeRawQuery
 * @description Executes a raw SQL query with parameter binding
 *
 * @template T
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sql - SQL query
 * @param {Record<string, any>} replacements - Query parameters
 * @param {QueryTypes} type - Query type
 * @returns {Promise<T[]>} Query results
 *
 * @example
 * ```typescript
 * const users = await executeRawQuery<User>(
 *   sequelize,
 *   'SELECT * FROM users WHERE status = :status AND age > :age',
 *   { status: 'active', age: 18 },
 *   QueryTypes.SELECT
 * );
 * ```
 */
export declare function executeRawQuery<T = any>(sequelize: Sequelize, sql: string, replacements?: Record<string, any>, type?: QueryTypes): Promise<T[]>;
/**
 * @function executeRawQuerySingle
 * @description Executes a raw SQL query expecting a single result
 *
 * @template T
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sql - SQL query
 * @param {Record<string, any>} replacements - Query parameters
 * @returns {Promise<T | null>} Query result or null
 *
 * @example
 * ```typescript
 * const user = await executeRawQuerySingle<User>(
 *   sequelize,
 *   'SELECT * FROM users WHERE id = :id',
 *   { id: 123 }
 * );
 * ```
 */
export declare function executeRawQuerySingle<T = any>(sequelize: Sequelize, sql: string, replacements?: Record<string, any>): Promise<T | null>;
/**
 * @function buildParameterizedQuery
 * @description Builds a parameterized query string with replacements
 *
 * @param {string} baseQuery - Base SQL query with placeholders
 * @param {Record<string, any>} params - Query parameters
 * @returns {{ sql: string; replacements: Record<string, any> }}
 *
 * @example
 * ```typescript
 * const { sql, replacements } = buildParameterizedQuery(
 *   'SELECT * FROM users WHERE status = :status',
 *   { status: 'active' }
 * );
 * ```
 */
export declare function buildParameterizedQuery(baseQuery: string, params: Record<string, any>): {
    sql: string;
    replacements: Record<string, any>;
};
/**
 * @function optimizeInclude
 * @description Optimizes include options to prevent N+1 queries
 *
 * @param {Includeable[]} includes - Include options
 * @param {boolean} separate - Use separate queries
 * @returns {Includeable[]} Optimized include options
 *
 * @example
 * ```typescript
 * const includes = optimizeInclude([
 *   { model: Post, as: 'posts' },
 *   { model: Profile, as: 'profile' }
 * ]);
 * ```
 */
export declare function optimizeInclude(includes: Includeable[], separate?: boolean): Includeable[];
/**
 * @function addQueryLogging
 * @description Adds logging to query options
 *
 * @template T
 * @param {FindOptions<T>} options - Query options
 * @param {(sql: string, timing?: number) => void} logger - Logger function
 * @returns {FindOptions<T>} Options with logging
 *
 * @example
 * ```typescript
 * const options = addQueryLogging(
 *   { where: { status: 'active' } },
 *   (sql, timing) => console.log(`Query took ${timing}ms: ${sql}`)
 * );
 * ```
 */
export declare function addQueryLogging<T>(options: FindOptions<T>, logger: (sql: string, timing?: number) => void): FindOptions<T>;
/**
 * @function createLazyLoader
 * @description Creates a lazy loading function for associations
 *
 * @template M
 * @param {M} instance - Model instance
 * @param {string} association - Association name
 * @param {FindOptions} options - Find options
 * @returns {() => Promise<any>} Lazy loader function
 *
 * @example
 * ```typescript
 * const user = await User.findByPk(1);
 * const loadPosts = createLazyLoader(user, 'posts', { where: { status: 'published' } });
 *
 * // Later when needed
 * const posts = await loadPosts();
 * ```
 */
export declare function createLazyLoader<M extends Model>(instance: M, association: string, options?: FindOptions): () => Promise<any>;
//# sourceMappingURL=sequelize-queries-utils.d.ts.map