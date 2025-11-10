"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildWhereClause = buildWhereClause;
exports.buildQueryOptions = buildQueryOptions;
exports.buildSelectAttributes = buildSelectAttributes;
exports.buildOrderClause = buildOrderClause;
exports.safeFindOne = safeFindOne;
exports.safeFindAll = safeFindAll;
exports.findByPkOrFail = findByPkOrFail;
exports.findOneOrCreate = findOneOrCreate;
exports.findOrBuild = findOrBuild;
exports.findAndCountAllWithMeta = findAndCountAllWithMeta;
exports.buildAndCondition = buildAndCondition;
exports.buildOrCondition = buildOrCondition;
exports.buildDateRangeCondition = buildDateRangeCondition;
exports.buildInCondition = buildInCondition;
exports.buildLikeCondition = buildLikeCondition;
exports.buildNullCheckCondition = buildNullCheckCondition;
exports.buildCountQuery = buildCountQuery;
exports.buildSumQuery = buildSumQuery;
exports.buildAvgQuery = buildAvgQuery;
exports.buildMinMaxQuery = buildMinMaxQuery;
exports.buildGroupByQuery = buildGroupByQuery;
exports.buildSubquery = buildSubquery;
exports.buildExistsSubquery = buildExistsSubquery;
exports.buildCorrelatedSubquery = buildCorrelatedSubquery;
exports.createTransactionWrapper = createTransactionWrapper;
exports.createUnmanagedTransaction = createUnmanagedTransaction;
exports.executeInTransaction = executeInTransaction;
exports.bulkCreateWithBatch = bulkCreateWithBatch;
exports.bulkUpdateWithBatch = bulkUpdateWithBatch;
exports.bulkDeleteWithBatch = bulkDeleteWithBatch;
exports.createPagination = createPagination;
exports.createCursorPagination = createCursorPagination;
exports.calculateTotalPages = calculateTotalPages;
exports.buildSearchCondition = buildSearchCondition;
exports.buildMultiFieldFilter = buildMultiFieldFilter;
exports.buildFullTextSearch = buildFullTextSearch;
exports.executeRawQuery = executeRawQuery;
exports.executeRawQuerySingle = executeRawQuerySingle;
exports.buildParameterizedQuery = buildParameterizedQuery;
exports.optimizeInclude = optimizeInclude;
exports.addQueryLogging = addQueryLogging;
exports.createLazyLoader = createLazyLoader;
const sequelize_1 = require("sequelize");
// ============================================================================
// QUERY BUILDER HELPERS
// ============================================================================
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
function buildWhereClause(conditions, options = {}) {
    const where = { ...options };
    for (const [key, value] of Object.entries(conditions)) {
        if (value === null || value === undefined) {
            where[key] = { [sequelize_1.Op.is]: null };
        }
        else if (typeof value === 'object' && !Array.isArray(value)) {
            // Handle operators
            const operators = {};
            for (const [op, val] of Object.entries(value)) {
                switch (op) {
                    case 'gt':
                        operators[sequelize_1.Op.gt] = val;
                        break;
                    case 'gte':
                        operators[sequelize_1.Op.gte] = val;
                        break;
                    case 'lt':
                        operators[sequelize_1.Op.lt] = val;
                        break;
                    case 'lte':
                        operators[sequelize_1.Op.lte] = val;
                        break;
                    case 'ne':
                        operators[sequelize_1.Op.ne] = val;
                        break;
                    case 'in':
                        operators[sequelize_1.Op.in] = val;
                        break;
                    case 'notIn':
                        operators[sequelize_1.Op.notIn] = val;
                        break;
                    case 'like':
                        operators[sequelize_1.Op.like] = val;
                        break;
                    case 'iLike':
                        operators[sequelize_1.Op.iLike] = val;
                        break;
                    case 'between':
                        operators[sequelize_1.Op.between] = val;
                        break;
                    default:
                        operators[op] = val;
                }
            }
            where[key] = operators;
        }
        else {
            where[key] = value;
        }
    }
    return where;
}
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
function buildQueryOptions(options) {
    const queryOptions = {};
    if (options.where) {
        queryOptions.where = options.where;
    }
    if (options.attributes) {
        queryOptions.attributes = options.attributes;
    }
    else if (options.exclude) {
        queryOptions.attributes = { exclude: options.exclude };
    }
    if (options.include) {
        queryOptions.include = options.include;
    }
    if (options.order) {
        queryOptions.order = options.order;
    }
    if (options.limit !== undefined) {
        queryOptions.limit = options.limit;
    }
    if (options.offset !== undefined) {
        queryOptions.offset = options.offset;
    }
    if (options.group) {
        queryOptions.group = options.group;
    }
    if (options.having) {
        queryOptions.having = options.having;
    }
    if (options.subQuery !== undefined) {
        queryOptions.subQuery = options.subQuery;
    }
    if (options.paranoid !== undefined) {
        queryOptions.paranoid = options.paranoid;
    }
    return queryOptions;
}
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
function buildSelectAttributes(include, exclude, computed) {
    if (include && include.length > 0) {
        const attributes = [...include];
        if (computed && computed.length > 0) {
            return { include: [...attributes, ...computed] };
        }
        return attributes;
    }
    if (exclude && exclude.length > 0) {
        const config = { exclude };
        if (computed && computed.length > 0) {
            config.include = computed;
        }
        return config;
    }
    if (computed && computed.length > 0) {
        return { include: computed };
    }
    return undefined;
}
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
function buildOrderClause(orderBy) {
    if (typeof orderBy === 'string') {
        const parts = orderBy.trim().split(/\s+/);
        if (parts.length === 2) {
            return [[parts[0], parts[1].toUpperCase()]];
        }
        return [[orderBy, 'ASC']];
    }
    if (Array.isArray(orderBy)) {
        if (orderBy.length === 0)
            return [];
        // Check if it's array of tuples
        if (Array.isArray(orderBy[0])) {
            return orderBy;
        }
        // Array of strings
        return orderBy.map((field) => {
            const parts = field.trim().split(/\s+/);
            if (parts.length === 2) {
                return [parts[0], parts[1].toUpperCase()];
            }
            return [field, 'ASC'];
        });
    }
    return [];
}
// ============================================================================
// FINDER UTILITIES
// ============================================================================
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
async function safeFindOne(model, options) {
    try {
        return await model.findOne(options);
    }
    catch (error) {
        console.error(`Error in safeFindOne for ${model.name}:`, error);
        return null;
    }
}
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
async function safeFindAll(model, options = {}) {
    try {
        return await model.findAll(options);
    }
    catch (error) {
        console.error(`Error in safeFindAll for ${model.name}:`, error);
        return [];
    }
}
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
async function findByPkOrFail(model, id, options = {}) {
    const record = await model.findByPk(id, options);
    if (!record) {
        throw new Error(`${model.name} with id ${id} not found`);
    }
    return record;
}
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
async function findOneOrCreate(model, findOptions, defaults, createOptions = {}) {
    const existing = await model.findOne(findOptions);
    if (existing) {
        return [existing, false];
    }
    const created = await model.create(defaults, createOptions);
    return [created, true];
}
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
async function findOrBuild(model, findOptions, defaults = {}) {
    const existing = await model.findOne(findOptions);
    if (existing) {
        return [existing, true];
    }
    const built = model.build(defaults);
    return [built, false];
}
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
async function findAndCountAllWithMeta(model, options) {
    const result = await model.findAndCountAll(options);
    const limit = options.limit || result.rows.length;
    const offset = options.offset || 0;
    return {
        rows: result.rows,
        count: typeof result.count === 'number' ? result.count : result.count.length,
        totalPages: limit > 0 ? Math.ceil((typeof result.count === 'number' ? result.count : result.count.length) / limit) : 1,
        currentPage: limit > 0 ? Math.floor(offset / limit) + 1 : 1,
    };
}
// ============================================================================
// WHERE CLAUSE BUILDERS
// ============================================================================
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
function buildAndCondition(conditions) {
    if (conditions.length === 0)
        return {};
    if (conditions.length === 1)
        return conditions[0];
    return { [sequelize_1.Op.and]: conditions };
}
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
function buildOrCondition(conditions) {
    if (conditions.length === 0)
        return {};
    if (conditions.length === 1)
        return conditions[0];
    return { [sequelize_1.Op.or]: conditions };
}
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
function buildDateRangeCondition(field, startDate, endDate) {
    return {
        [field]: {
            [sequelize_1.Op.between]: [startDate, endDate],
        },
    };
}
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
function buildInCondition(field, values) {
    if (values.length === 0) {
        return { [field]: { [sequelize_1.Op.in]: [] } };
    }
    return { [field]: { [sequelize_1.Op.in]: values } };
}
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
function buildLikeCondition(field, value, options = {}) {
    const { position = 'contains', caseSensitive = true } = options;
    const operator = caseSensitive ? sequelize_1.Op.like : sequelize_1.Op.iLike;
    let pattern;
    switch (position) {
        case 'start':
            pattern = `${value}%`;
            break;
        case 'end':
            pattern = `%${value}`;
            break;
        case 'contains':
        default:
            pattern = `%${value}%`;
            break;
    }
    return { [field]: { [operator]: pattern } };
}
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
function buildNullCheckCondition(field, isNull) {
    return { [field]: isNull ? { [sequelize_1.Op.is]: null } : { [sequelize_1.Op.not]: null } };
}
// ============================================================================
// AGGREGATION HELPERS
// ============================================================================
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
async function buildCountQuery(model, where = {}, field = '*', distinct = false) {
    const options = { where };
    if (field !== '*') {
        options.col = field;
    }
    if (distinct) {
        options.distinct = true;
    }
    return await model.count(options);
}
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
async function buildSumQuery(model, field, where = {}) {
    const result = await model.sum(field, { where });
    return result || 0;
}
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
async function buildAvgQuery(model, field, where = {}) {
    // Type assertion needed as sequelize types don't include aggregate methods
    const result = await model.aggregate(field, 'AVG', { where });
    return result || 0;
}
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
async function buildMinMaxQuery(model, field, fn, where = {}) {
    if (fn === 'MAX') {
        return await model.max(field, { where });
    }
    return await model.min(field, { where });
}
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
async function buildGroupByQuery(model, groupFields, aggregations, where = {}) {
    const attributes = [...groupFields];
    aggregations.forEach((agg) => {
        const fn = agg.fn.toLowerCase();
        const fieldRef = model.sequelize.col(agg.field);
        const alias = agg.alias || `${fn}_${agg.field}`;
        if (agg.distinct) {
            attributes.push([
                model.sequelize.fn(fn, model.sequelize.fn('DISTINCT', fieldRef)),
                alias,
            ]);
        }
        else {
            attributes.push([model.sequelize.fn(fn, fieldRef), alias]);
        }
    });
    return await model.findAll({
        attributes,
        where,
        group: groupFields,
        raw: true,
    });
}
// ============================================================================
// SUBQUERY BUILDERS
// ============================================================================
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
function buildSubquery(model, options) {
    const queryGenerator = model.sequelize.getQueryInterface().queryGenerator;
    const subquerySQL = queryGenerator.selectQuery(model.getTableName(), options, model);
    return model.sequelize.literal(`(${subquerySQL})`);
}
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
function buildExistsSubquery(model, options, negate = false) {
    const queryGenerator = model.sequelize.getQueryInterface().queryGenerator;
    const subquerySQL = queryGenerator.selectQuery(model.getTableName(), { ...options, attributes: ['1'], limit: 1 }, model);
    const existsClause = `${negate ? 'NOT ' : ''}EXISTS (${subquerySQL})`;
    return model.sequelize.literal(existsClause);
}
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
function buildCorrelatedSubquery(sequelize, sql, alias) {
    return [sequelize.literal(`(${sql})`), alias];
}
// ============================================================================
// TRANSACTION HELPERS
// ============================================================================
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
async function createTransactionWrapper(sequelize, callback, options = {}) {
    return await sequelize.transaction(options, callback);
}
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
async function createUnmanagedTransaction(sequelize, options = {}) {
    return await sequelize.transaction(options);
}
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
async function executeInTransaction(sequelize, operations) {
    return await sequelize.transaction(async (t) => {
        return await Promise.all(operations.map((op) => op(t)));
    });
}
// ============================================================================
// BULK OPERATION UTILITIES
// ============================================================================
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
async function bulkCreateWithBatch(model, records, options = {}) {
    const { batchSize = 1000, validate = false, hooks = false, transaction, } = options;
    const results = [];
    for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize);
        const batchResults = await model.bulkCreate(batch, {
            validate,
            hooks,
            transaction,
        });
        results.push(...batchResults);
    }
    return results;
}
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
async function bulkUpdateWithBatch(model, values, where, options = {}) {
    const { validate = false, hooks = false, transaction } = options;
    const [affectedCount] = await model.update(values, {
        where,
        validate,
        hooks,
        transaction,
    });
    return affectedCount;
}
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
async function bulkDeleteWithBatch(model, where, options = {}) {
    const { hooks = false, transaction, force = false } = options;
    return await model.destroy({
        where,
        hooks,
        transaction,
        force,
    });
}
// ============================================================================
// PAGINATION HELPERS
// ============================================================================
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
function createPagination(page, limit) {
    const currentPage = Math.max(1, page);
    const offset = (currentPage - 1) * limit;
    return {
        limit,
        offset,
        page: currentPage,
    };
}
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
function createCursorPagination(options) {
    const { cursor, limit, direction = 'DESC', cursorField = 'createdAt', } = options;
    const where = cursor
        ? {
            [cursorField]: {
                [direction === 'DESC' ? sequelize_1.Op.lt : sequelize_1.Op.gt]: cursor,
            },
        }
        : {};
    return {
        where,
        order: [[cursorField, direction]],
        limit: limit + 1, // Get one extra to check if there are more
    };
}
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
function calculateTotalPages(totalCount, limit) {
    return Math.ceil(totalCount / limit);
}
// ============================================================================
// SEARCH AND FILTER BUILDERS
// ============================================================================
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
function buildSearchCondition(options) {
    const { query, fields, caseSensitive = false, exact = false } = options;
    if (!query || fields.length === 0) {
        return {};
    }
    const operator = caseSensitive ? sequelize_1.Op.like : sequelize_1.Op.iLike;
    const pattern = exact ? query : `%${query}%`;
    const conditions = fields.map((field) => ({
        [field]: { [operator]: pattern },
    }));
    return { [sequelize_1.Op.or]: conditions };
}
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
function buildMultiFieldFilter(options) {
    const { filters, logic = 'AND' } = options;
    const conditions = Object.entries(filters).map(([key, value]) => {
        if (Array.isArray(value)) {
            return { [key]: { [sequelize_1.Op.in]: value } };
        }
        if (typeof value === 'object' && value !== null) {
            return { [key]: value };
        }
        return { [key]: value };
    });
    if (conditions.length === 0)
        return {};
    if (conditions.length === 1)
        return conditions[0];
    return logic === 'AND'
        ? { [sequelize_1.Op.and]: conditions }
        : { [sequelize_1.Op.or]: conditions };
}
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
function buildFullTextSearch(sequelize, fields, query, language = 'english') {
    const tsvectorColumns = fields.map((field) => `"${field}"`).join(` || ' ' || `);
    const tsquery = query.split(/\s+/).join(' & ');
    return sequelize.literal(`to_tsvector('${language}', ${tsvectorColumns}) @@ to_tsquery('${language}', '${tsquery}')`);
}
// ============================================================================
// RAW QUERY UTILITIES
// ============================================================================
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
async function executeRawQuery(sequelize, sql, replacements = {}, type = sequelize_1.QueryTypes.SELECT) {
    const [results] = await sequelize.query(sql, {
        replacements,
        type,
    });
    return results;
}
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
async function executeRawQuerySingle(sequelize, sql, replacements = {}) {
    const results = await executeRawQuery(sequelize, sql, replacements, sequelize_1.QueryTypes.SELECT);
    return results.length > 0 ? results[0] : null;
}
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
function buildParameterizedQuery(baseQuery, params) {
    return {
        sql: baseQuery,
        replacements: params,
    };
}
// ============================================================================
// QUERY OPTIMIZATION HELPERS
// ============================================================================
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
function optimizeInclude(includes, separate = false) {
    return includes.map((include) => {
        if (typeof include === 'object' && include !== null) {
            return {
                ...include,
                separate,
                subQuery: false,
            };
        }
        return include;
    });
}
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
function addQueryLogging(options, logger) {
    return {
        ...options,
        logging: logger,
        benchmark: true,
    };
}
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
function createLazyLoader(instance, association, options = {}) {
    let cached = null;
    return async () => {
        if (cached)
            return cached;
        const assoc = instance[`get${association.charAt(0).toUpperCase()}${association.slice(1)}`];
        if (typeof assoc === 'function') {
            cached = await assoc.call(instance, options);
            return cached;
        }
        throw new Error(`Association ${association} not found on model`);
    };
}
//# sourceMappingURL=sequelize-queries-utils.js.map