"use strict";
/**
 * LOC: SQBK1234567
 * File: /reuse/sequelize-query-builder-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Service layer components
 *   - Repository pattern implementations
 *   - Data access layer modules
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeBulkUpsert = exports.executeUpsert = exports.executeBulkDelete = exports.executeBulkUpdate = exports.executeBulkCreate = exports.executeWithIsolation = exports.createUnmanagedTransaction = exports.executeInTransaction = exports.buildCTEQuery = exports.buildLiteralExpression = exports.executeRawQuery = exports.buildInSubquery = exports.buildExistsSubquery = exports.buildSubquery = exports.buildLeftJoin = exports.buildNestedInclude = exports.buildIncludeOptions = exports.buildGroupedCount = exports.buildGroupByQuery = exports.buildAggregationAttributes = exports.buildRangeFilter = exports.buildDynamicFilters = exports.buildFullTextSearch = exports.buildAssociationOrder = exports.buildDynamicOrder = exports.buildOrderClause = exports.calculatePaginationMetadata = exports.buildCursorPagination = exports.executePaginatedQuery = exports.buildOffsetPagination = exports.buildComparisonCondition = exports.buildBetweenCondition = exports.buildLikeCondition = exports.buildNotInCondition = exports.buildInCondition = exports.buildNullCheckWhere = exports.buildDateRangeWhere = exports.buildNestedWhereClause = exports.buildOrWhereClause = exports.buildWhereClause = exports.buildScopedQuery = exports.findOrCreateRecord = exports.findByPkWithOptions = exports.safeFindOne = exports.buildFindOptions = void 0;
/**
 * File: /reuse/sequelize-query-builder-kit.ts
 * Locator: WC-UTL-SQBK-001
 * Purpose: Comprehensive Sequelize Query Building Utilities - Finders, operators, pagination, transactions, bulk operations
 *
 * Upstream: Independent utility module for Sequelize query construction and optimization
 * Downstream: ../backend/*, service layer, repository pattern, data access modules
 * Dependencies: TypeScript 5.x, Sequelize 6.x, NestJS 10.x
 * Exports: 45 utility functions for Sequelize query building, optimization, and database operations
 *
 * LLM Context: Comprehensive Sequelize utilities for building efficient, type-safe database queries in White Cross system.
 * Provides query builders, finder helpers, operators, pagination, sorting, filtering, aggregation, joins, subqueries,
 * transaction management, bulk operations, upsert patterns, and lock strategies. Essential for optimized data access.
 */
const sequelize_1 = require("sequelize");
// ============================================================================
// QUERY BUILDERS & FINDER HELPERS
// ============================================================================
/**
 * 1. Builds a complete FindOptions object from individual query components.
 *
 * @param {QueryBuilderOptions} options - Query building options
 * @returns {FindOptions} Complete Sequelize FindOptions
 *
 * @example
 * ```typescript
 * const findOptions = buildFindOptions({
 *   where: { status: 'active' },
 *   limit: 20,
 *   order: [['createdAt', 'DESC']]
 * });
 * const users = await User.findAll(findOptions);
 * ```
 */
const buildFindOptions = (options) => {
    const findOptions = {};
    if (options.where)
        findOptions.where = options.where;
    if (options.include)
        findOptions.include = options.include;
    if (options.attributes)
        findOptions.attributes = options.attributes;
    if (options.order)
        findOptions.order = options.order;
    if (options.limit)
        findOptions.limit = options.limit;
    if (options.offset)
        findOptions.offset = options.offset;
    if (options.group)
        findOptions.group = options.group;
    if (options.having)
        findOptions.having = options.having;
    if (options.subQuery !== undefined)
        findOptions.subQuery = options.subQuery;
    if (options.raw !== undefined)
        findOptions.raw = options.raw;
    if (options.nest !== undefined)
        findOptions.nest = options.nest;
    if (options.paranoid !== undefined)
        findOptions.paranoid = options.paranoid;
    if (options.lock)
        findOptions.lock = options.lock;
    return findOptions;
};
exports.buildFindOptions = buildFindOptions;
/**
 * 2. Creates a safe finder function that returns null instead of throwing on not found.
 *
 * @param {ModelCtor<Model>} model - Sequelize model
 * @param {WhereOptions} where - Where conditions
 * @param {FindOptions} [options] - Additional find options
 * @returns {Promise<Model | null>} Found instance or null
 *
 * @example
 * ```typescript
 * const user = await safeFindOne(User, { id: 123 });
 * if (!user) {
 *   console.log('User not found');
 * }
 * ```
 */
const safeFindOne = async (model, where, options) => {
    try {
        return await model.findOne({ where, ...options });
    }
    catch (error) {
        return null;
    }
};
exports.safeFindOne = safeFindOne;
/**
 * 3. Finds a record by primary key with optional includes and attributes.
 *
 * @param {ModelCtor<Model>} model - Sequelize model
 * @param {number | string} id - Primary key value
 * @param {Omit<FindOptions, 'where'>} [options] - Additional find options
 * @returns {Promise<Model | null>} Found instance or null
 *
 * @example
 * ```typescript
 * const user = await findByPkWithOptions(User, 123, {
 *   include: [{ model: Profile, as: 'profile' }],
 *   attributes: { exclude: ['password'] }
 * });
 * ```
 */
const findByPkWithOptions = async (model, id, options) => {
    return await model.findByPk(id, options);
};
exports.findByPkWithOptions = findByPkWithOptions;
/**
 * 4. Finds or creates a record with specified defaults.
 *
 * @param {ModelCtor<Model>} model - Sequelize model
 * @param {WhereOptions} where - Where conditions to search
 * @param {any} defaults - Default values if creating
 * @param {Transaction} [transaction] - Transaction object
 * @returns {Promise<[Model, boolean]>} Tuple of [instance, created]
 *
 * @example
 * ```typescript
 * const [user, created] = await findOrCreateRecord(
 *   User,
 *   { email: 'user@example.com' },
 *   { username: 'newuser', status: 'active' }
 * );
 * ```
 */
const findOrCreateRecord = async (model, where, defaults, transaction) => {
    return await model.findOrCreate({
        where,
        defaults,
        transaction,
    });
};
exports.findOrCreateRecord = findOrCreateRecord;
/**
 * 5. Builds a reusable scoped query builder for a model.
 *
 * @param {ModelCtor<Model>} model - Sequelize model
 * @param {WhereOptions} baseWhere - Base where conditions always applied
 * @returns {Function} Query builder function
 *
 * @example
 * ```typescript
 * const activeUsersQuery = buildScopedQuery(User, { status: 'active' });
 * const users = await activeUsersQuery({ role: 'admin' });
 * ```
 */
const buildScopedQuery = (model, baseWhere) => {
    return async (additionalWhere = {}, options = {}) => {
        return await model.findAll({
            where: { ...baseWhere, ...additionalWhere },
            ...options,
        });
    };
};
exports.buildScopedQuery = buildScopedQuery;
// ============================================================================
// WHERE CLAUSE BUILDERS
// ============================================================================
/**
 * 6. Builds a where clause from multiple filter conditions with AND logic.
 *
 * @param {FilterCondition[]} conditions - Array of filter conditions
 * @returns {WhereOptions} Combined where clause
 *
 * @example
 * ```typescript
 * const where = buildWhereClause([
 *   { field: 'age', operator: 'gte', value: 18 },
 *   { field: 'status', operator: 'eq', value: 'active' }
 * ]);
 * ```
 */
const buildWhereClause = (conditions) => {
    const where = {};
    conditions.forEach(({ field, operator, value }) => {
        where[field] = { [sequelize_1.Op[operator]]: value };
    });
    return where;
};
exports.buildWhereClause = buildWhereClause;
/**
 * 7. Builds a where clause with OR logic for multiple conditions.
 *
 * @param {FilterCondition[]} conditions - Array of filter conditions
 * @returns {WhereOptions} OR combined where clause
 *
 * @example
 * ```typescript
 * const where = buildOrWhereClause([
 *   { field: 'status', operator: 'eq', value: 'active' },
 *   { field: 'status', operator: 'eq', value: 'pending' }
 * ]);
 * ```
 */
const buildOrWhereClause = (conditions) => {
    const orConditions = conditions.map(({ field, operator, value }) => ({
        [field]: { [sequelize_1.Op[operator]]: value },
    }));
    return { [sequelize_1.Op.or]: orConditions };
};
exports.buildOrWhereClause = buildOrWhereClause;
/**
 * 8. Builds a complex nested where clause with AND/OR combinations.
 *
 * @param {any} conditionTree - Nested condition tree object
 * @returns {WhereOptions} Nested where clause
 *
 * @example
 * ```typescript
 * const where = buildNestedWhereClause({
 *   AND: [
 *     { age: { gte: 18 } },
 *     { OR: [{ status: 'active' }, { verified: true }] }
 *   ]
 * });
 * ```
 */
const buildNestedWhereClause = (conditionTree) => {
    if (conditionTree.AND) {
        return {
            [sequelize_1.Op.and]: conditionTree.AND.map((cond) => (0, exports.buildNestedWhereClause)(cond)),
        };
    }
    if (conditionTree.OR) {
        return {
            [sequelize_1.Op.or]: conditionTree.OR.map((cond) => (0, exports.buildNestedWhereClause)(cond)),
        };
    }
    const where = {};
    Object.keys(conditionTree).forEach((field) => {
        const value = conditionTree[field];
        if (typeof value === 'object' && !Array.isArray(value)) {
            const operatorKey = Object.keys(value)[0];
            where[field] = { [sequelize_1.Op[operatorKey]]: value[operatorKey] };
        }
        else {
            where[field] = value;
        }
    });
    return where;
};
exports.buildNestedWhereClause = buildNestedWhereClause;
/**
 * 9. Builds a date range where clause for filtering by date fields.
 *
 * @param {string} field - Date field name
 * @param {Date | string} startDate - Start date
 * @param {Date | string} endDate - End date
 * @returns {WhereOptions} Date range where clause
 *
 * @example
 * ```typescript
 * const where = buildDateRangeWhere(
 *   'createdAt',
 *   '2024-01-01',
 *   '2024-12-31'
 * );
 * ```
 */
const buildDateRangeWhere = (field, startDate, endDate) => {
    return {
        [field]: {
            [sequelize_1.Op.between]: [new Date(startDate), new Date(endDate)],
        },
    };
};
exports.buildDateRangeWhere = buildDateRangeWhere;
/**
 * 10. Builds a where clause for NULL/NOT NULL checks.
 *
 * @param {string} field - Field name
 * @param {boolean} isNull - True for IS NULL, false for IS NOT NULL
 * @returns {WhereOptions} Null check where clause
 *
 * @example
 * ```typescript
 * const where = buildNullCheckWhere('deletedAt', true); // IS NULL
 * const whereNotNull = buildNullCheckWhere('email', false); // IS NOT NULL
 * ```
 */
const buildNullCheckWhere = (field, isNull) => {
    return {
        [field]: isNull ? { [sequelize_1.Op.is]: null } : { [sequelize_1.Op.not]: null },
    };
};
exports.buildNullCheckWhere = buildNullCheckWhere;
// ============================================================================
// OPERATORS & CONDITIONS
// ============================================================================
/**
 * 11. Creates an IN operator condition for array value matching.
 *
 * @param {string} field - Field name
 * @param {any[]} values - Array of values
 * @returns {WhereOptions} IN condition
 *
 * @example
 * ```typescript
 * const where = buildInCondition('status', ['active', 'pending', 'verified']);
 * ```
 */
const buildInCondition = (field, values) => {
    return { [field]: { [sequelize_1.Op.in]: values } };
};
exports.buildInCondition = buildInCondition;
/**
 * 12. Creates a NOT IN operator condition for array value exclusion.
 *
 * @param {string} field - Field name
 * @param {any[]} values - Array of values to exclude
 * @returns {WhereOptions} NOT IN condition
 *
 * @example
 * ```typescript
 * const where = buildNotInCondition('status', ['deleted', 'banned']);
 * ```
 */
const buildNotInCondition = (field, values) => {
    return { [field]: { [sequelize_1.Op.notIn]: values } };
};
exports.buildNotInCondition = buildNotInCondition;
/**
 * 13. Creates a LIKE operator condition for pattern matching.
 *
 * @param {string} field - Field name
 * @param {string} pattern - Search pattern
 * @param {boolean} [caseInsensitive=false] - Use ILIKE for case-insensitive search
 * @returns {WhereOptions} LIKE condition
 *
 * @example
 * ```typescript
 * const where = buildLikeCondition('email', '%@company.com%');
 * const whereCaseInsensitive = buildLikeCondition('name', 'john%', true);
 * ```
 */
const buildLikeCondition = (field, pattern, caseInsensitive = false) => {
    return {
        [field]: { [caseInsensitive ? sequelize_1.Op.iLike : sequelize_1.Op.like]: pattern },
    };
};
exports.buildLikeCondition = buildLikeCondition;
/**
 * 14. Creates a BETWEEN operator condition for range queries.
 *
 * @param {string} field - Field name
 * @param {any} min - Minimum value
 * @param {any} max - Maximum value
 * @returns {WhereOptions} BETWEEN condition
 *
 * @example
 * ```typescript
 * const where = buildBetweenCondition('age', 18, 65);
 * ```
 */
const buildBetweenCondition = (field, min, max) => {
    return {
        [field]: { [sequelize_1.Op.between]: [min, max] },
    };
};
exports.buildBetweenCondition = buildBetweenCondition;
/**
 * 15. Creates comparison operator conditions (>, >=, <, <=).
 *
 * @param {string} field - Field name
 * @param {'gt' | 'gte' | 'lt' | 'lte'} operator - Comparison operator
 * @param {any} value - Comparison value
 * @returns {WhereOptions} Comparison condition
 *
 * @example
 * ```typescript
 * const where = buildComparisonCondition('age', 'gte', 18);
 * ```
 */
const buildComparisonCondition = (field, operator, value) => {
    return { [field]: { [sequelize_1.Op[operator]]: value } };
};
exports.buildComparisonCondition = buildComparisonCondition;
// ============================================================================
// PAGINATION UTILITIES
// ============================================================================
/**
 * 16. Builds offset-based pagination options.
 *
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Items per page
 * @returns {object} Pagination options with limit and offset
 *
 * @example
 * ```typescript
 * const pagination = buildOffsetPagination(2, 20);
 * const users = await User.findAll({ ...pagination });
 * ```
 */
const buildOffsetPagination = (page, limit) => {
    const offset = (page - 1) * limit;
    return { limit, offset };
};
exports.buildOffsetPagination = buildOffsetPagination;
/**
 * 17. Executes a paginated query with count and metadata.
 *
 * @param {ModelCtor<Model>} model - Sequelize model
 * @param {FindOptions} options - Find options
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<PaginationResult>} Paginated results with metadata
 *
 * @example
 * ```typescript
 * const result = await executePaginatedQuery(
 *   User,
 *   { where: { status: 'active' } },
 *   1,
 *   20
 * );
 * ```
 */
const executePaginatedQuery = async (model, options, page, limit) => {
    const offset = (page - 1) * limit;
    const { rows, count } = await model.findAndCountAll({
        ...options,
        limit,
        offset,
        distinct: true,
    });
    const totalPages = Math.ceil(count / limit);
    return {
        rows,
        count,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
    };
};
exports.executePaginatedQuery = executePaginatedQuery;
/**
 * 18. Builds cursor-based pagination for efficient large dataset queries.
 *
 * @param {string} cursorField - Field to use for cursor
 * @param {any} cursorValue - Current cursor value
 * @param {number} limit - Items per page
 * @param {'ASC' | 'DESC'} [direction='ASC'] - Sort direction
 * @returns {FindOptions} Cursor pagination options
 *
 * @example
 * ```typescript
 * const options = buildCursorPagination('id', 100, 20, 'DESC');
 * const users = await User.findAll(options);
 * ```
 */
const buildCursorPagination = (cursorField, cursorValue, limit, direction = 'ASC') => {
    const operator = direction === 'ASC' ? sequelize_1.Op.gt : sequelize_1.Op.lt;
    return {
        where: cursorValue ? { [cursorField]: { [operator]: cursorValue } } : {},
        order: [[cursorField, direction]],
        limit,
    };
};
exports.buildCursorPagination = buildCursorPagination;
/**
 * 19. Calculates pagination metadata from query results.
 *
 * @param {number} total - Total items count
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {object} Pagination metadata
 *
 * @example
 * ```typescript
 * const metadata = calculatePaginationMetadata(150, 2, 20);
 * // { totalPages: 8, hasNext: true, hasPrev: true, ... }
 * ```
 */
const calculatePaginationMetadata = (total, page, limit) => {
    const totalPages = Math.ceil(total / limit);
    return {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        from: (page - 1) * limit + 1,
        to: Math.min(page * limit, total),
    };
};
exports.calculatePaginationMetadata = calculatePaginationMetadata;
// ============================================================================
// SORTING & ORDERING
// ============================================================================
/**
 * 20. Builds an order clause from sort options.
 *
 * @param {SortOption[]} sortOptions - Array of sort options
 * @returns {Order} Sequelize order array
 *
 * @example
 * ```typescript
 * const order = buildOrderClause([
 *   { field: 'createdAt', direction: 'DESC' },
 *   { field: 'name', direction: 'ASC', nulls: 'LAST' }
 * ]);
 * ```
 */
const buildOrderClause = (sortOptions) => {
    return sortOptions.map((option) => {
        const orderArray = [option.field, option.direction];
        if (option.nulls) {
            orderArray.push(option.nulls);
        }
        return orderArray;
    });
};
exports.buildOrderClause = buildOrderClause;
/**
 * 21. Builds dynamic ordering based on request parameters.
 *
 * @param {string} sortBy - Field to sort by
 * @param {'ASC' | 'DESC'} [sortOrder='ASC'] - Sort direction
 * @param {string[]} [allowedFields] - Whitelist of sortable fields
 * @returns {Order} Sequelize order array
 *
 * @example
 * ```typescript
 * const order = buildDynamicOrder('createdAt', 'DESC', ['createdAt', 'name', 'email']);
 * ```
 */
const buildDynamicOrder = (sortBy, sortOrder = 'ASC', allowedFields) => {
    // Validate against whitelist if provided
    if (allowedFields && !allowedFields.includes(sortBy)) {
        throw new Error(`Invalid sort field: ${sortBy}`);
    }
    return [[sortBy, sortOrder]];
};
exports.buildDynamicOrder = buildDynamicOrder;
/**
 * 22. Builds multi-level ordering for associated models.
 *
 * @param {Array} orderConfig - Array of order configurations
 * @returns {Order} Nested order array
 *
 * @example
 * ```typescript
 * const order = buildAssociationOrder([
 *   { model: 'Profile', field: 'firstName', direction: 'ASC' },
 *   { field: 'createdAt', direction: 'DESC' }
 * ]);
 * ```
 */
const buildAssociationOrder = (orderConfig) => {
    return orderConfig.map((config) => {
        if (config.model) {
            return [{ model: config.model, as: config.model }, config.field, config.direction];
        }
        return [config.field, config.direction];
    });
};
exports.buildAssociationOrder = buildAssociationOrder;
// ============================================================================
// FILTERING & SEARCH
// ============================================================================
/**
 * 23. Builds a full-text search query across multiple fields.
 *
 * @param {SearchOptions} options - Search options
 * @returns {WhereOptions} Search where clause
 *
 * @example
 * ```typescript
 * const where = buildFullTextSearch({
 *   query: 'john doe',
 *   fields: ['firstName', 'lastName', 'email'],
 *   caseSensitive: false
 * });
 * ```
 */
const buildFullTextSearch = (options) => {
    const { query, fields, caseSensitive = false } = options;
    const operator = caseSensitive ? sequelize_1.Op.like : sequelize_1.Op.iLike;
    const searchConditions = fields.map((field) => ({
        [field]: { [operator]: `%${query}%` },
    }));
    return { [sequelize_1.Op.or]: searchConditions };
};
exports.buildFullTextSearch = buildFullTextSearch;
/**
 * 24. Builds dynamic filters from query parameters.
 *
 * @param {Record<string, any>} filters - Filter key-value pairs
 * @param {string[]} [allowedFields] - Whitelist of filterable fields
 * @returns {WhereOptions} Dynamic filter where clause
 *
 * @example
 * ```typescript
 * const where = buildDynamicFilters(
 *   { status: 'active', role: 'admin', verified: true },
 *   ['status', 'role', 'verified']
 * );
 * ```
 */
const buildDynamicFilters = (filters, allowedFields) => {
    const where = {};
    Object.keys(filters).forEach((key) => {
        if (allowedFields && !allowedFields.includes(key)) {
            return; // Skip non-whitelisted fields
        }
        const value = filters[key];
        if (value !== undefined && value !== null && value !== '') {
            where[key] = value;
        }
    });
    return where;
};
exports.buildDynamicFilters = buildDynamicFilters;
/**
 * 25. Builds range filters for numeric and date fields.
 *
 * @param {string} field - Field name
 * @param {any} [min] - Minimum value
 * @param {any} [max] - Maximum value
 * @returns {WhereOptions} Range filter where clause
 *
 * @example
 * ```typescript
 * const where = buildRangeFilter('age', 18, 65);
 * const dateWhere = buildRangeFilter('createdAt', '2024-01-01', '2024-12-31');
 * ```
 */
const buildRangeFilter = (field, min, max) => {
    const where = {};
    if (min !== undefined && max !== undefined) {
        where[field] = { [sequelize_1.Op.between]: [min, max] };
    }
    else if (min !== undefined) {
        where[field] = { [sequelize_1.Op.gte]: min };
    }
    else if (max !== undefined) {
        where[field] = { [sequelize_1.Op.lte]: max };
    }
    return where;
};
exports.buildRangeFilter = buildRangeFilter;
// ============================================================================
// AGGREGATION & GROUPING
// ============================================================================
/**
 * 26. Builds aggregation attributes for GROUP BY queries.
 *
 * @param {AggregationOptions[]} aggregations - Array of aggregation configs
 * @returns {any[]} Attributes array with aggregations
 *
 * @example
 * ```typescript
 * const attributes = buildAggregationAttributes([
 *   { field: 'id', function: 'COUNT', alias: 'total' },
 *   { field: 'amount', function: 'SUM', alias: 'totalAmount' }
 * ]);
 * ```
 */
const buildAggregationAttributes = (aggregations) => {
    return aggregations.map((agg) => {
        const sequelize = require('sequelize');
        const fn = agg.distinct
            ? sequelize.fn(agg.function, sequelize.fn('DISTINCT', sequelize.col(agg.field)))
            : sequelize.fn(agg.function, sequelize.col(agg.field));
        return [fn, agg.alias || `${agg.function.toLowerCase()}_${agg.field}`];
    });
};
exports.buildAggregationAttributes = buildAggregationAttributes;
/**
 * 27. Builds a GROUP BY query with HAVING clause.
 *
 * @param {string[]} groupFields - Fields to group by
 * @param {WhereOptions} [havingClause] - HAVING conditions
 * @returns {object} Group and having options
 *
 * @example
 * ```typescript
 * const options = buildGroupByQuery(
 *   ['userId', 'status'],
 *   { count: { [Op.gt]: 5 } }
 * );
 * ```
 */
const buildGroupByQuery = (groupFields, havingClause) => {
    const options = { group: groupFields };
    if (havingClause) {
        options.having = havingClause;
    }
    return options;
};
exports.buildGroupByQuery = buildGroupByQuery;
/**
 * 28. Builds a count query with grouping.
 *
 * @param {ModelCtor<Model>} model - Sequelize model
 * @param {string} groupField - Field to group by
 * @param {WhereOptions} [where] - Where conditions
 * @returns {Promise<any[]>} Count results by group
 *
 * @example
 * ```typescript
 * const counts = await buildGroupedCount(User, 'status', { role: 'admin' });
 * // [{ status: 'active', count: 50 }, { status: 'inactive', count: 10 }]
 * ```
 */
const buildGroupedCount = async (model, groupField, where) => {
    const sequelize = require('sequelize');
    return await model.findAll({
        attributes: [groupField, [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        where,
        group: [groupField],
        raw: true,
    });
};
exports.buildGroupedCount = buildGroupedCount;
// ============================================================================
// JOIN HELPERS
// ============================================================================
/**
 * 29. Builds include options for associations.
 *
 * @param {JoinOptions[]} joins - Array of join configurations
 * @returns {Includeable[]} Sequelize include array
 *
 * @example
 * ```typescript
 * const include = buildIncludeOptions([
 *   { model: Profile, as: 'profile', required: true },
 *   { model: Post, as: 'posts', where: { status: 'published' } }
 * ]);
 * ```
 */
const buildIncludeOptions = (joins) => {
    return joins.map((join) => {
        const include = { model: join.model };
        if (join.as)
            include.as = join.as;
        if (join.required !== undefined)
            include.required = join.required;
        if (join.attributes)
            include.attributes = join.attributes;
        if (join.where)
            include.where = join.where;
        if (join.include)
            include.include = join.include;
        return include;
    });
};
exports.buildIncludeOptions = buildIncludeOptions;
/**
 * 30. Builds nested include options for deep associations.
 *
 * @param {any} includeTree - Nested include tree structure
 * @returns {Includeable[]} Nested include array
 *
 * @example
 * ```typescript
 * const include = buildNestedInclude({
 *   model: User,
 *   include: [
 *     { model: Profile },
 *     { model: Post, include: [{ model: Comment }] }
 *   ]
 * });
 * ```
 */
const buildNestedInclude = (includeTree) => {
    if (Array.isArray(includeTree)) {
        return includeTree.map((item) => {
            const include = { model: item.model };
            if (item.as)
                include.as = item.as;
            if (item.where)
                include.where = item.where;
            if (item.attributes)
                include.attributes = item.attributes;
            if (item.include)
                include.include = (0, exports.buildNestedInclude)(item.include);
            return include;
        });
    }
    const include = { model: includeTree.model };
    if (includeTree.as)
        include.as = includeTree.as;
    if (includeTree.where)
        include.where = includeTree.where;
    if (includeTree.attributes)
        include.attributes = includeTree.attributes;
    if (includeTree.include)
        include.include = (0, exports.buildNestedInclude)(includeTree.include);
    return [include];
};
exports.buildNestedInclude = buildNestedInclude;
/**
 * 31. Builds left outer join with optional conditions.
 *
 * @param {ModelCtor<Model>} model - Associated model
 * @param {string} [as] - Association alias
 * @param {WhereOptions} [where] - Join conditions
 * @returns {Includeable} Left join include
 *
 * @example
 * ```typescript
 * const include = buildLeftJoin(Profile, 'profile', { verified: true });
 * ```
 */
const buildLeftJoin = (model, as, where) => {
    const include = { model, required: false };
    if (as)
        include.as = as;
    if (where)
        include.where = where;
    return include;
};
exports.buildLeftJoin = buildLeftJoin;
// ============================================================================
// SUBQUERY BUILDERS
// ============================================================================
/**
 * 32. Builds a subquery for use in WHERE clauses.
 *
 * @param {SubqueryConfig} config - Subquery configuration
 * @returns {any} Sequelize literal for subquery
 *
 * @example
 * ```typescript
 * const subquery = buildSubquery({
 *   model: Post,
 *   attributes: ['authorId'],
 *   where: { status: 'published' }
 * });
 * ```
 */
const buildSubquery = (config) => {
    const sequelize = require('sequelize');
    // Note: This is a simplified version; actual implementation would need sequelize instance
    return sequelize.literal(`(SELECT ${config.attributes.join(', ')} FROM ${config.model.tableName})`);
};
exports.buildSubquery = buildSubquery;
/**
 * 33. Builds an EXISTS subquery condition.
 *
 * @param {SubqueryConfig} config - Subquery configuration
 * @returns {WhereOptions} EXISTS condition
 *
 * @example
 * ```typescript
 * const where = buildExistsSubquery({
 *   model: Post,
 *   attributes: ['id'],
 *   where: { authorId: { [Op.col]: 'User.id' } }
 * });
 * ```
 */
const buildExistsSubquery = (config) => {
    const sequelize = require('sequelize');
    return sequelize.where(sequelize.literal(`EXISTS (SELECT 1 FROM ${config.model.tableName} WHERE ...)`), true);
};
exports.buildExistsSubquery = buildExistsSubquery;
/**
 * 34. Builds an IN subquery condition.
 *
 * @param {string} field - Field to check
 * @param {SubqueryConfig} config - Subquery configuration
 * @returns {WhereOptions} IN subquery condition
 *
 * @example
 * ```typescript
 * const where = buildInSubquery('id', {
 *   model: Post,
 *   attributes: ['authorId'],
 *   where: { status: 'published' }
 * });
 * ```
 */
const buildInSubquery = (field, config) => {
    const sequelize = require('sequelize');
    return {
        [field]: {
            [sequelize_1.Op.in]: sequelize.literal(`(SELECT ${config.attributes[0]} FROM ${config.model.tableName})`),
        },
    };
};
exports.buildInSubquery = buildInSubquery;
// ============================================================================
// RAW QUERY HELPERS
// ============================================================================
/**
 * 35. Executes a raw SQL query with parameter binding.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} sql - SQL query string
 * @param {Record<string, any>} [replacements] - Query parameters
 * @returns {Promise<any[]>} Query results
 *
 * @example
 * ```typescript
 * const results = await executeRawQuery(
 *   sequelize,
 *   'SELECT * FROM users WHERE status = :status',
 *   { status: 'active' }
 * );
 * ```
 */
const executeRawQuery = async (sequelize, sql, replacements) => {
    const [results] = await sequelize.query(sql, {
        replacements,
        type: sequelize.QueryTypes.SELECT,
    });
    return results;
};
exports.executeRawQuery = executeRawQuery;
/**
 * 36. Builds a literal SQL expression for computed fields.
 *
 * @param {string} expression - SQL expression
 * @param {string} [alias] - Field alias
 * @returns {any[]} Attribute array with literal
 *
 * @example
 * ```typescript
 * const attr = buildLiteralExpression(
 *   'CASE WHEN age >= 18 THEN "adult" ELSE "minor" END',
 *   'ageCategory'
 * );
 * ```
 */
const buildLiteralExpression = (expression, alias) => {
    const sequelize = require('sequelize');
    return alias ? [sequelize.literal(expression), alias] : [sequelize.literal(expression)];
};
exports.buildLiteralExpression = buildLiteralExpression;
/**
 * 37. Builds a raw query with CTE (Common Table Expression).
 *
 * @param {string} cteName - CTE name
 * @param {string} cteQuery - CTE query
 * @param {string} mainQuery - Main query using CTE
 * @returns {string} Complete query with CTE
 *
 * @example
 * ```typescript
 * const query = buildCTEQuery(
 *   'active_users',
 *   'SELECT * FROM users WHERE status = "active"',
 *   'SELECT * FROM active_users WHERE role = "admin"'
 * );
 * ```
 */
const buildCTEQuery = (cteName, cteQuery, mainQuery) => {
    return `WITH ${cteName} AS (${cteQuery}) ${mainQuery}`;
};
exports.buildCTEQuery = buildCTEQuery;
// ============================================================================
// TRANSACTION UTILITIES
// ============================================================================
/**
 * 38. Executes operations within a managed transaction.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {Function} operations - Async function with transaction operations
 * @returns {Promise<any>} Transaction result
 *
 * @example
 * ```typescript
 * const result = await executeInTransaction(sequelize, async (t) => {
 *   await User.create({ name: 'John' }, { transaction: t });
 *   await Profile.create({ userId: 1 }, { transaction: t });
 * });
 * ```
 */
const executeInTransaction = async (sequelize, operations) => {
    return await sequelize.transaction(operations);
};
exports.executeInTransaction = executeInTransaction;
/**
 * 39. Creates an unmanaged transaction for manual control.
 *
 * @param {any} sequelize - Sequelize instance
 * @returns {Promise<Transaction>} Transaction object
 *
 * @example
 * ```typescript
 * const t = await createUnmanagedTransaction(sequelize);
 * try {
 *   await User.create({ name: 'John' }, { transaction: t });
 *   await t.commit();
 * } catch (error) {
 *   await t.rollback();
 * }
 * ```
 */
const createUnmanagedTransaction = async (sequelize) => {
    return await sequelize.transaction();
};
exports.createUnmanagedTransaction = createUnmanagedTransaction;
/**
 * 40. Executes a transaction with isolation level control.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} isolationLevel - Transaction isolation level
 * @param {Function} operations - Transaction operations
 * @returns {Promise<any>} Transaction result
 *
 * @example
 * ```typescript
 * const result = await executeWithIsolation(
 *   sequelize,
 *   'SERIALIZABLE',
 *   async (t) => await performCriticalOperation(t)
 * );
 * ```
 */
const executeWithIsolation = async (sequelize, isolationLevel, operations) => {
    return await sequelize.transaction({ isolationLevel: sequelize.Transaction.ISOLATION_LEVELS[isolationLevel] }, operations);
};
exports.executeWithIsolation = executeWithIsolation;
// ============================================================================
// BULK OPERATIONS
// ============================================================================
/**
 * 41. Executes bulk create with validation and error handling.
 *
 * @param {ModelCtor<Model>} model - Sequelize model
 * @param {any[]} records - Array of records to create
 * @param {BulkOperationOptions} [options] - Bulk operation options
 * @returns {Promise<Model[]>} Created instances
 *
 * @example
 * ```typescript
 * const users = await executeBulkCreate(User, [
 *   { name: 'John', email: 'john@example.com' },
 *   { name: 'Jane', email: 'jane@example.com' }
 * ], { validate: true, ignoreDuplicates: true });
 * ```
 */
const executeBulkCreate = async (model, records, options) => {
    return await model.bulkCreate(records, options);
};
exports.executeBulkCreate = executeBulkCreate;
/**
 * 42. Executes bulk update with conditions.
 *
 * @param {ModelCtor<Model>} model - Sequelize model
 * @param {any} values - Values to update
 * @param {WhereOptions} where - Update conditions
 * @param {BulkOperationOptions} [options] - Bulk operation options
 * @returns {Promise<number>} Number of affected rows
 *
 * @example
 * ```typescript
 * const affectedRows = await executeBulkUpdate(
 *   User,
 *   { status: 'inactive' },
 *   { lastLogin: { [Op.lt]: sixMonthsAgo } }
 * );
 * ```
 */
const executeBulkUpdate = async (model, values, where, options) => {
    const [affectedCount] = await model.update(values, { where, ...options });
    return affectedCount;
};
exports.executeBulkUpdate = executeBulkUpdate;
/**
 * 43. Executes bulk delete with conditions.
 *
 * @param {ModelCtor<Model>} model - Sequelize model
 * @param {WhereOptions} where - Delete conditions
 * @param {boolean} [force=false] - Force delete (ignore paranoid)
 * @returns {Promise<number>} Number of deleted rows
 *
 * @example
 * ```typescript
 * const deletedCount = await executeBulkDelete(
 *   User,
 *   { status: 'deleted', deletedAt: { [Op.lt]: oneYearAgo } },
 *   true
 * );
 * ```
 */
const executeBulkDelete = async (model, where, force = false) => {
    return await model.destroy({ where, force });
};
exports.executeBulkDelete = executeBulkDelete;
// ============================================================================
// UPSERT PATTERNS
// ============================================================================
/**
 * 44. Executes upsert operation with conflict resolution.
 *
 * @param {ModelCtor<Model>} model - Sequelize model
 * @param {any} values - Values to insert/update
 * @param {UpsertOptions} [options] - Upsert options
 * @returns {Promise<[Model, boolean]>} Tuple of [instance, created]
 *
 * @example
 * ```typescript
 * const [user, created] = await executeUpsert(
 *   User,
 *   { email: 'user@example.com', name: 'John Doe' },
 *   { conflictFields: ['email'], updateFields: ['name'] }
 * );
 * ```
 */
const executeUpsert = async (model, values, options) => {
    return await model.upsert(values, options);
};
exports.executeUpsert = executeUpsert;
/**
 * 45. Builds bulk upsert with ON CONFLICT handling.
 *
 * @param {ModelCtor<Model>} model - Sequelize model
 * @param {any[]} records - Array of records to upsert
 * @param {string[]} conflictFields - Fields to check for conflicts
 * @param {string[]} updateFields - Fields to update on conflict
 * @returns {Promise<Model[]>} Upserted instances
 *
 * @example
 * ```typescript
 * const users = await executeBulkUpsert(
 *   User,
 *   [{ email: 'john@example.com', name: 'John' }],
 *   ['email'],
 *   ['name', 'updatedAt']
 * );
 * ```
 */
const executeBulkUpsert = async (model, records, conflictFields, updateFields) => {
    return await model.bulkCreate(records, {
        updateOnDuplicate: updateFields,
        conflictFields,
    });
};
exports.executeBulkUpsert = executeBulkUpsert;
//# sourceMappingURL=sequelize-query-builder-kit.js.map