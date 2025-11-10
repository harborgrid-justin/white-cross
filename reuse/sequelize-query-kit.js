"use strict";
/**
 * LOC: SEQQ1234567
 * File: /reuse/sequelize-query-kit.ts
 *
 * UPSTREAM (imports from):
 *   - Sequelize (database ORM)
 *   - Database models and schemas
 *
 * DOWNSTREAM (imported by):
 *   - NestJS service layer
 *   - Repository implementations
 *   - Query builders
 *   - Data access objects
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.disableSubquery = exports.explainAnalyzeQuery = exports.explainQuery = exports.executeRecursiveCTE = exports.executeWithCTE = exports.executeStoredProcedure = exports.executeRawQuery = exports.executeNotExistsSubquery = exports.executeExistsSubquery = exports.buildSubquery = exports.executeInnerJoin = exports.executeLeftJoin = exports.buildJoinIncludes = exports.averageByGroup = exports.sumByGroup = exports.countByGroup = exports.executeAggregation = exports.buildDynamicFilter = exports.executeSearch = exports.buildNestedOrderClause = exports.buildOrderClause = exports.executeCursorPagination = exports.executePaginatedQuery = exports.calculatePagination = exports.buildArrayOverlap = exports.buildStringPattern = exports.buildNumericComparison = exports.buildInWhere = exports.buildNullCheckWhere = exports.buildFullTextSearchWhere = exports.buildContainsWhere = exports.buildDateRangeWhere = exports.buildComplexWhere = exports.buildWhereClause = exports.buildFindOptions = exports.createQueryBuilder = void 0;
/**
 * File: /reuse/sequelize-query-kit.ts
 * Locator: WC-UTL-SEQQ-005
 * Purpose: Sequelize Query Kit - Comprehensive query building and execution utilities
 *
 * Upstream: Sequelize ORM, database connection pools
 * Downstream: ../backend/*, ../services/*, repository layers, API endpoints
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize 6.x
 * Exports: 45 utility functions for query building, filtering, pagination, aggregation, joins, subqueries
 *
 * LLM Context: Comprehensive Sequelize query utilities for White Cross healthcare system.
 * Provides query builders, advanced WHERE clause construction, operator helpers, pagination,
 * sorting, filtering, search, aggregation, grouping, joins, subqueries, and raw query execution.
 * Essential for efficient, secure, and maintainable database queries in healthcare applications.
 */
const sequelize_1 = require("sequelize");
// ============================================================================
// QUERY BUILDER CONSTRUCTION
// ============================================================================
/**
 * Creates a fluent query builder for constructing complex Sequelize queries.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @returns {object} Fluent query builder interface
 *
 * @example
 * ```typescript
 * const query = createQueryBuilder(Patient)
 *   .where({ status: 'active' })
 *   .include([{ model: MedicalRecord }])
 *   .orderBy('createdAt', 'DESC')
 *   .limit(20)
 *   .build();
 * const results = await Patient.findAll(query);
 * ```
 */
const createQueryBuilder = (model) => {
    const queryOptions = {};
    return {
        where(conditions) {
            queryOptions.where = conditions;
            return this;
        },
        include(includes) {
            queryOptions.include = includes;
            return this;
        },
        attributes(attrs) {
            queryOptions.attributes = attrs;
            return this;
        },
        orderBy(field, direction = 'ASC') {
            queryOptions.order = queryOptions.order || [];
            queryOptions.order.push([field, direction]);
            return this;
        },
        limit(count) {
            queryOptions.limit = count;
            return this;
        },
        offset(count) {
            queryOptions.offset = count;
            return this;
        },
        groupBy(fields) {
            queryOptions.group = fields;
            return this;
        },
        having(conditions) {
            queryOptions.having = conditions;
            return this;
        },
        distinct(value = true) {
            queryOptions.distinct = value;
            return this;
        },
        subQuery(value = true) {
            queryOptions.subQuery = value;
            return this;
        },
        build() {
            return queryOptions;
        },
    };
};
exports.createQueryBuilder = createQueryBuilder;
/**
 * Builds a complete FindOptions object from individual components.
 *
 * @template T
 * @param {Partial<FindOptions<T>>} options - Query options components
 * @returns {FindOptions<T>} Complete FindOptions object
 *
 * @example
 * ```typescript
 * const options = buildFindOptions({
 *   where: { status: 'active' },
 *   include: [{ model: MedicalRecord }],
 *   order: [['createdAt', 'DESC']],
 *   limit: 20
 * });
 * ```
 */
const buildFindOptions = (options) => {
    return {
        ...options,
    };
};
exports.buildFindOptions = buildFindOptions;
// ============================================================================
// WHERE CLAUSE BUILDERS
// ============================================================================
/**
 * Builds a WHERE clause from filter conditions array.
 *
 * @param {FilterCondition[]} conditions - Array of filter conditions
 * @returns {WhereOptions<any>} Sequelize WHERE clause
 *
 * @example
 * ```typescript
 * const where = buildWhereClause([
 *   { field: 'age', operator: 'gte', value: 18 },
 *   { field: 'status', operator: 'eq', value: 'active' },
 *   { field: 'email', operator: 'like', value: '@example.com' }
 * ]);
 * ```
 */
const buildWhereClause = (conditions) => {
    const where = {};
    conditions.forEach(({ field, operator, value, options = {} }) => {
        const sequelizeOp = sequelize_1.Op[operator];
        if (!sequelizeOp) {
            throw new Error(`Invalid operator: ${operator}`);
        }
        let processedValue = value;
        if (operator === 'like' || operator === 'iLike') {
            if (!value.includes('%')) {
                processedValue = `%${value}%`;
            }
        }
        if (options.negated) {
            where[field] = { [sequelize_1.Op.not]: { [sequelizeOp]: processedValue } };
        }
        else {
            where[field] = { [sequelizeOp]: processedValue };
        }
    });
    return where;
};
exports.buildWhereClause = buildWhereClause;
/**
 * Builds a complex WHERE clause with AND/OR logic.
 *
 * @param {object} conditions - Object with and/or arrays
 * @returns {WhereOptions<any>} Sequelize WHERE clause with logic operators
 *
 * @example
 * ```typescript
 * const where = buildComplexWhere({
 *   and: [
 *     { status: 'active' },
 *     { or: [{ age: { [Op.gte]: 18 } }, { hasGuardianConsent: true }] }
 *   ]
 * });
 * ```
 */
const buildComplexWhere = (conditions) => {
    const where = {};
    if (conditions.and && conditions.and.length > 0) {
        where[sequelize_1.Op.and] = conditions.and;
    }
    if (conditions.or && conditions.or.length > 0) {
        where[sequelize_1.Op.or] = conditions.or;
    }
    return where;
};
exports.buildComplexWhere = buildComplexWhere;
/**
 * Creates a WHERE clause for date range filtering.
 *
 * @param {string} field - Date field name
 * @param {Date} startDate - Start date (inclusive)
 * @param {Date} endDate - End date (inclusive)
 * @returns {WhereOptions<any>} Date range WHERE clause
 *
 * @example
 * ```typescript
 * const where = buildDateRangeWhere('appointmentDate',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * // Result: { appointmentDate: { [Op.between]: [start, end] } }
 * ```
 */
const buildDateRangeWhere = (field, startDate, endDate) => {
    return {
        [field]: {
            [sequelize_1.Op.between]: [startDate, endDate],
        },
    };
};
exports.buildDateRangeWhere = buildDateRangeWhere;
/**
 * Creates a WHERE clause for array/JSON field containment.
 *
 * @param {string} field - Field name (array or JSON field)
 * @param {any} values - Values to check for containment
 * @returns {WhereOptions<any>} Containment WHERE clause
 *
 * @example
 * ```typescript
 * const where = buildContainsWhere('permissions', ['read', 'write']);
 * const jsonWhere = buildContainsWhere('metadata', { active: true });
 * ```
 */
const buildContainsWhere = (field, values) => {
    return {
        [field]: {
            [sequelize_1.Op.contains]: values,
        },
    };
};
exports.buildContainsWhere = buildContainsWhere;
/**
 * Creates a WHERE clause for full-text search.
 *
 * @param {string[]} fields - Fields to search in
 * @param {string} searchTerm - Search term
 * @param {boolean} [caseSensitive] - Case-sensitive search (default: false)
 * @returns {WhereOptions<any>} Full-text search WHERE clause
 *
 * @example
 * ```typescript
 * const where = buildFullTextSearchWhere(
 *   ['firstName', 'lastName', 'email'],
 *   'john doe'
 * );
 * ```
 */
const buildFullTextSearchWhere = (fields, searchTerm, caseSensitive = false) => {
    const operator = caseSensitive ? sequelize_1.Op.like : sequelize_1.Op.iLike;
    return {
        [sequelize_1.Op.or]: fields.map((field) => ({
            [field]: {
                [operator]: `%${searchTerm}%`,
            },
        })),
    };
};
exports.buildFullTextSearchWhere = buildFullTextSearchWhere;
/**
 * Creates a WHERE clause for NULL/NOT NULL checks.
 *
 * @param {string} field - Field name
 * @param {boolean} isNull - True for IS NULL, false for IS NOT NULL
 * @returns {WhereOptions<any>} NULL check WHERE clause
 *
 * @example
 * ```typescript
 * const whereNull = buildNullCheckWhere('deletedAt', true);
 * const whereNotNull = buildNullCheckWhere('assignedDoctorId', false);
 * ```
 */
const buildNullCheckWhere = (field, isNull) => {
    return {
        [field]: isNull ? { [sequelize_1.Op.is]: null } : { [sequelize_1.Op.not]: null },
    };
};
exports.buildNullCheckWhere = buildNullCheckWhere;
/**
 * Creates a WHERE clause for IN operator with array of values.
 *
 * @param {string} field - Field name
 * @param {any[]} values - Array of values
 * @param {boolean} [negate] - Use NOT IN (default: false)
 * @returns {WhereOptions<any>} IN/NOT IN WHERE clause
 *
 * @example
 * ```typescript
 * const where = buildInWhere('status', ['active', 'pending', 'approved']);
 * const whereNotIn = buildInWhere('department', ['finance', 'legal'], true);
 * ```
 */
const buildInWhere = (field, values, negate = false) => {
    return {
        [field]: {
            [negate ? sequelize_1.Op.notIn : sequelize_1.Op.in]: values,
        },
    };
};
exports.buildInWhere = buildInWhere;
// ============================================================================
// OPERATOR HELPERS
// ============================================================================
/**
 * Creates comparison operators for numeric fields.
 *
 * @param {string} field - Field name
 * @param {object} comparisons - Comparison operators and values
 * @returns {WhereOptions<any>} Numeric comparison WHERE clause
 *
 * @example
 * ```typescript
 * const where = buildNumericComparison('age', {
 *   gte: 18,
 *   lt: 65
 * });
 * // Result: { age: { [Op.gte]: 18, [Op.lt]: 65 } }
 * ```
 */
const buildNumericComparison = (field, comparisons) => {
    const conditions = {};
    if (comparisons.gt !== undefined)
        conditions[sequelize_1.Op.gt] = comparisons.gt;
    if (comparisons.gte !== undefined)
        conditions[sequelize_1.Op.gte] = comparisons.gte;
    if (comparisons.lt !== undefined)
        conditions[sequelize_1.Op.lt] = comparisons.lt;
    if (comparisons.lte !== undefined)
        conditions[sequelize_1.Op.lte] = comparisons.lte;
    if (comparisons.eq !== undefined)
        conditions[sequelize_1.Op.eq] = comparisons.eq;
    if (comparisons.ne !== undefined)
        conditions[sequelize_1.Op.ne] = comparisons.ne;
    return { [field]: conditions };
};
exports.buildNumericComparison = buildNumericComparison;
/**
 * Creates string pattern matching operators.
 *
 * @param {string} field - Field name
 * @param {object} patterns - Pattern matching options
 * @returns {WhereOptions<any>} String pattern WHERE clause
 *
 * @example
 * ```typescript
 * const where = buildStringPattern('email', {
 *   startsWith: 'admin',
 *   endsWith: '@example.com',
 *   caseSensitive: false
 * });
 * ```
 */
const buildStringPattern = (field, patterns) => {
    const operator = patterns.caseSensitive ? sequelize_1.Op.like : sequelize_1.Op.iLike;
    const conditions = [];
    if (patterns.exact) {
        return { [field]: patterns.exact };
    }
    if (patterns.startsWith) {
        conditions.push({ [field]: { [operator]: `${patterns.startsWith}%` } });
    }
    if (patterns.endsWith) {
        conditions.push({ [field]: { [operator]: `%${patterns.endsWith}` } });
    }
    if (patterns.contains) {
        conditions.push({ [field]: { [operator]: `%${patterns.contains}%` } });
    }
    if (conditions.length === 0) {
        return {};
    }
    if (conditions.length === 1) {
        return conditions[0];
    }
    return { [sequelize_1.Op.and]: conditions };
};
exports.buildStringPattern = buildStringPattern;
/**
 * Creates array overlap operator for PostgreSQL arrays.
 *
 * @param {string} field - Array field name
 * @param {any[]} values - Values to check for overlap
 * @returns {WhereOptions<any>} Array overlap WHERE clause
 *
 * @example
 * ```typescript
 * const where = buildArrayOverlap('tags', ['urgent', 'critical', 'emergency']);
 * ```
 */
const buildArrayOverlap = (field, values) => {
    return {
        [field]: {
            [sequelize_1.Op.overlap]: values,
        },
    };
};
exports.buildArrayOverlap = buildArrayOverlap;
// ============================================================================
// PAGINATION UTILITIES
// ============================================================================
/**
 * Calculates offset and limit for pagination.
 *
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Items per page
 * @returns {PaginationParams} Pagination parameters with offset
 *
 * @example
 * ```typescript
 * const params = calculatePagination(2, 20);
 * // Result: { page: 2, limit: 20, offset: 20 }
 * ```
 */
const calculatePagination = (page, limit) => {
    const offset = (page - 1) * limit;
    return { page, limit, offset };
};
exports.calculatePagination = calculatePagination;
/**
 * Executes a paginated query with count.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {PaginationParams} pagination - Pagination parameters
 * @param {FindOptions<T>} [options] - Additional query options
 * @returns {Promise<PaginatedResults<T>>} Paginated results with metadata
 *
 * @example
 * ```typescript
 * const results = await executePaginatedQuery(
 *   Patient,
 *   { page: 1, limit: 20 },
 *   { where: { status: 'active' }, order: [['createdAt', 'DESC']] }
 * );
 * ```
 */
const executePaginatedQuery = async (model, pagination, options) => {
    const { page, limit, offset } = pagination.offset !== undefined
        ? pagination
        : (0, exports.calculatePagination)(pagination.page, pagination.limit);
    const queryOptions = {
        ...options,
        limit,
        offset,
    };
    const { count, rows } = await model.findAndCountAll(queryOptions);
    const totalPages = Math.ceil(count / limit);
    return {
        rows,
        count,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
    };
};
exports.executePaginatedQuery = executePaginatedQuery;
/**
 * Implements cursor-based pagination for efficient large dataset navigation.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {CursorPaginationParams} params - Cursor pagination parameters
 * @param {FindOptions<T>} [options] - Additional query options
 * @returns {Promise<CursorPaginatedResults<T>>} Cursor-paginated results
 *
 * @example
 * ```typescript
 * const results = await executeCursorPagination(
 *   Patient,
 *   { limit: 20, cursor: 'patient-123', cursorField: 'id' },
 *   { where: { status: 'active' } }
 * );
 * ```
 */
const executeCursorPagination = async (model, params, options) => {
    const { cursor, limit, cursorField = 'id', direction = 'forward' } = params;
    const where = { ...(options?.where || {}) };
    if (cursor) {
        where[cursorField] = direction === 'forward'
            ? { [sequelize_1.Op.gt]: cursor }
            : { [sequelize_1.Op.lt]: cursor };
    }
    const queryOptions = {
        ...options,
        where,
        limit: limit + 1,
        order: [[cursorField, direction === 'forward' ? 'ASC' : 'DESC']],
    };
    const results = await model.findAll(queryOptions);
    const hasMore = results.length > limit;
    const data = results.slice(0, limit);
    const nextCursor = hasMore && data.length > 0
        ? data[data.length - 1][cursorField]
        : null;
    const previousCursor = data.length > 0
        ? data[0][cursorField]
        : null;
    return {
        data,
        nextCursor,
        previousCursor,
        hasNextPage: direction === 'forward' && hasMore,
        hasPreviousPage: direction === 'backward' && hasMore,
    };
};
exports.executeCursorPagination = executeCursorPagination;
// ============================================================================
// SORTING UTILITIES
// ============================================================================
/**
 * Builds ORDER BY clause from sort conditions.
 *
 * @param {SortCondition[]} conditions - Array of sort conditions
 * @returns {Order} Sequelize ORDER clause
 *
 * @example
 * ```typescript
 * const order = buildOrderClause([
 *   { field: 'priority', direction: 'DESC', nulls: 'LAST' },
 *   { field: 'createdAt', direction: 'ASC' }
 * ]);
 * ```
 */
const buildOrderClause = (conditions) => {
    return conditions.map((condition) => {
        const orderArray = [condition.field, condition.direction];
        if (condition.nulls) {
            orderArray.push(`NULLS ${condition.nulls}`);
        }
        return orderArray;
    });
};
exports.buildOrderClause = buildOrderClause;
/**
 * Builds multi-level sorting with nested associations.
 *
 * @param {Array<{ model?: ModelStatic<any>; field: string; direction: 'ASC' | 'DESC' }>} sorts - Multi-level sorts
 * @returns {Order} Sequelize ORDER clause with associations
 *
 * @example
 * ```typescript
 * const order = buildNestedOrderClause([
 *   { model: Patient, field: 'lastName', direction: 'ASC' },
 *   { field: 'appointmentDate', direction: 'DESC' }
 * ]);
 * ```
 */
const buildNestedOrderClause = (sorts) => {
    return sorts.map((sort) => {
        if (sort.model) {
            return [sort.model, sort.field, sort.direction];
        }
        return [sort.field, sort.direction];
    });
};
exports.buildNestedOrderClause = buildNestedOrderClause;
// ============================================================================
// FILTERING AND SEARCH
// ============================================================================
/**
 * Executes a search query across multiple fields.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {SearchOptions} searchOptions - Search configuration
 * @param {FindOptions<T>} [queryOptions] - Additional query options
 * @returns {Promise<T[]>} Search results
 *
 * @example
 * ```typescript
 * const patients = await executeSearch(
 *   Patient,
 *   {
 *     fields: ['firstName', 'lastName', 'email', 'studentId'],
 *     query: 'john',
 *     caseSensitive: false
 *   }
 * );
 * ```
 */
const executeSearch = async (model, searchOptions, queryOptions) => {
    const { fields, query, exactMatch = false, caseSensitive = false } = searchOptions;
    const operator = caseSensitive ? sequelize_1.Op.like : sequelize_1.Op.iLike;
    const searchPattern = exactMatch ? query : `%${query}%`;
    const where = {
        ...(queryOptions?.where || {}),
        [sequelize_1.Op.or]: fields.map((field) => ({
            [field]: { [operator]: searchPattern },
        })),
    };
    return model.findAll({
        ...queryOptions,
        where,
    });
};
exports.executeSearch = executeSearch;
/**
 * Builds a dynamic filter from query parameters.
 *
 * @param {Record<string, any>} queryParams - Query parameters from request
 * @param {string[]} allowedFields - Fields allowed for filtering
 * @returns {WhereOptions<any>} WHERE clause from query params
 *
 * @example
 * ```typescript
 * const where = buildDynamicFilter(
 *   { status: 'active', 'age[gte]': '18', department: 'cardiology' },
 *   ['status', 'age', 'department']
 * );
 * ```
 */
const buildDynamicFilter = (queryParams, allowedFields) => {
    const where = {};
    Object.entries(queryParams).forEach(([key, value]) => {
        const operatorMatch = key.match(/^(\w+)\[(\w+)\]$/);
        if (operatorMatch) {
            const [, field, operator] = operatorMatch;
            if (allowedFields.includes(field) && sequelize_1.Op[operator]) {
                where[field] = { [sequelize_1.Op[operator]]: value };
            }
        }
        else if (allowedFields.includes(key)) {
            where[key] = value;
        }
    });
    return where;
};
exports.buildDynamicFilter = buildDynamicFilter;
// ============================================================================
// AGGREGATION FUNCTIONS
// ============================================================================
/**
 * Executes aggregation queries with grouping.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {AggregationOptions[]} aggregations - Aggregation configurations
 * @param {string[]} [groupBy] - Fields to group by
 * @param {WhereOptions<T>} [where] - WHERE clause
 * @returns {Promise<any[]>} Aggregation results
 *
 * @example
 * ```typescript
 * const stats = await executeAggregation(
 *   Appointment,
 *   [
 *     { field: 'id', function: 'COUNT', alias: 'totalAppointments' },
 *     { field: 'duration', function: 'AVG', alias: 'avgDuration' }
 *   ],
 *   ['status', 'departmentId']
 * );
 * ```
 */
const executeAggregation = async (model, aggregations, groupBy, where) => {
    const attributes = aggregations.map((agg) => {
        const fnCall = agg.distinct
            ? (0, sequelize_1.fn)(agg.function, (0, sequelize_1.fn)('DISTINCT', (0, sequelize_1.col)(agg.field)))
            : (0, sequelize_1.fn)(agg.function, (0, sequelize_1.col)(agg.field));
        return [fnCall, agg.alias || `${agg.function.toLowerCase()}_${agg.field}`];
    });
    if (groupBy) {
        attributes.unshift(...groupBy);
    }
    const options = {
        attributes: attributes,
        raw: true,
    };
    if (where) {
        options.where = where;
    }
    if (groupBy) {
        options.group = groupBy;
    }
    return model.findAll(options);
};
exports.executeAggregation = executeAggregation;
/**
 * Calculates count with grouping.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {string} groupField - Field to group by
 * @param {WhereOptions<T>} [where] - WHERE clause
 * @returns {Promise<Array<{ group: any; count: number }>>} Count by group
 *
 * @example
 * ```typescript
 * const counts = await countByGroup(Patient, 'status');
 * // Result: [{ group: 'active', count: 150 }, { group: 'inactive', count: 25 }]
 * ```
 */
const countByGroup = async (model, groupField, where) => {
    const results = await model.findAll({
        attributes: [
            groupField,
            [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('*')), 'count'],
        ],
        where,
        group: [groupField],
        raw: true,
    });
    return results.map((r) => ({
        group: r[groupField],
        count: parseInt(r.count, 10),
    }));
};
exports.countByGroup = countByGroup;
/**
 * Calculates sum with grouping.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {string} sumField - Field to sum
 * @param {string} groupField - Field to group by
 * @param {WhereOptions<T>} [where] - WHERE clause
 * @returns {Promise<Array<{ group: any; sum: number }>>} Sum by group
 *
 * @example
 * ```typescript
 * const sums = await sumByGroup(Invoice, 'amount', 'departmentId');
 * // Result: [{ group: 'dept1', sum: 15000 }, { group: 'dept2', sum: 23000 }]
 * ```
 */
const sumByGroup = async (model, sumField, groupField, where) => {
    const results = await model.findAll({
        attributes: [
            groupField,
            [(0, sequelize_1.fn)('SUM', (0, sequelize_1.col)(sumField)), 'sum'],
        ],
        where,
        group: [groupField],
        raw: true,
    });
    return results.map((r) => ({
        group: r[groupField],
        sum: parseFloat(r.sum) || 0,
    }));
};
exports.sumByGroup = sumByGroup;
/**
 * Calculates average with grouping.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {string} avgField - Field to average
 * @param {string} groupField - Field to group by
 * @param {WhereOptions<T>} [where] - WHERE clause
 * @returns {Promise<Array<{ group: any; average: number }>>} Average by group
 *
 * @example
 * ```typescript
 * const averages = await averageByGroup(Grade, 'score', 'courseId');
 * ```
 */
const averageByGroup = async (model, avgField, groupField, where) => {
    const results = await model.findAll({
        attributes: [
            groupField,
            [(0, sequelize_1.fn)('AVG', (0, sequelize_1.col)(avgField)), 'average'],
        ],
        where,
        group: [groupField],
        raw: true,
    });
    return results.map((r) => ({
        group: r[groupField],
        average: parseFloat(r.average) || 0,
    }));
};
exports.averageByGroup = averageByGroup;
// ============================================================================
// JOIN UTILITIES
// ============================================================================
/**
 * Builds include options for eager loading associations.
 *
 * @param {JoinOptions[]} joins - Array of join configurations
 * @returns {Includeable[]} Sequelize include array
 *
 * @example
 * ```typescript
 * const includes = buildJoinIncludes([
 *   {
 *     model: MedicalRecord,
 *     as: 'medicalRecords',
 *     required: false,
 *     where: { type: 'diagnosis' }
 *   },
 *   {
 *     model: Doctor,
 *     as: 'assignedDoctor',
 *     required: true,
 *     attributes: ['id', 'firstName', 'lastName']
 *   }
 * ]);
 * ```
 */
const buildJoinIncludes = (joins) => {
    return joins.map((join) => {
        const include = {
            model: join.model,
            required: join.required ?? false,
        };
        if (join.as)
            include.as = join.as;
        if (join.where)
            include.where = join.where;
        if (join.attributes)
            include.attributes = join.attributes;
        if (join.include)
            include.include = (0, exports.buildJoinIncludes)(join.include);
        return include;
    });
};
exports.buildJoinIncludes = buildJoinIncludes;
/**
 * Executes query with left join.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {JoinOptions} join - Join configuration
 * @param {WhereOptions<T>} [where] - WHERE clause for main model
 * @returns {Promise<T[]>} Results with joined data
 *
 * @example
 * ```typescript
 * const patients = await executeLeftJoin(
 *   Patient,
 *   { model: MedicalRecord, as: 'medicalRecords', required: false }
 * );
 * ```
 */
const executeLeftJoin = async (model, join, where) => {
    return model.findAll({
        where,
        include: [{ ...join, required: false }],
    });
};
exports.executeLeftJoin = executeLeftJoin;
/**
 * Executes query with inner join.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {JoinOptions} join - Join configuration
 * @param {WhereOptions<T>} [where] - WHERE clause for main model
 * @returns {Promise<T[]>} Results with joined data (only matching records)
 *
 * @example
 * ```typescript
 * const patientsWithRecords = await executeInnerJoin(
 *   Patient,
 *   { model: MedicalRecord, as: 'medicalRecords', required: true }
 * );
 * ```
 */
const executeInnerJoin = async (model, join, where) => {
    return model.findAll({
        where,
        include: [{ ...join, required: true }],
    });
};
exports.executeInnerJoin = executeInnerJoin;
// ============================================================================
// SUBQUERY UTILITIES
// ============================================================================
/**
 * Builds a subquery for use in WHERE IN clauses.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {SubQueryOptions} options - Subquery options
 * @returns {any} Sequelize literal for subquery
 *
 * @example
 * ```typescript
 * const subquery = buildSubquery(sequelize, {
 *   select: 'patientId',
 *   from: 'appointments',
 *   where: { status: 'confirmed', date: { [Op.gte]: new Date() } },
 *   alias: 'confirmedPatients'
 * });
 * const where = { id: { [Op.in]: subquery } };
 * ```
 */
const buildSubquery = (sequelize, options) => {
    const { select, from, where, alias } = options;
    const selectFields = Array.isArray(select) ? select.join(', ') : select;
    let query = `SELECT ${selectFields} FROM ${from}`;
    if (where) {
        const whereClause = Object.entries(where)
            .map(([key, value]) => `${key} = ${sequelize.escape(value)}`)
            .join(' AND ');
        query += ` WHERE ${whereClause}`;
    }
    return (0, sequelize_1.literal)(`(${query})`);
};
exports.buildSubquery = buildSubquery;
/**
 * Executes EXISTS subquery check.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} existsQuery - EXISTS subquery SQL
 * @param {WhereOptions<T>} [where] - Additional WHERE conditions
 * @returns {Promise<T[]>} Records where subquery exists
 *
 * @example
 * ```typescript
 * const patientsWithAppointments = await executeExistsSubquery(
 *   Patient,
 *   sequelize,
 *   'SELECT 1 FROM appointments WHERE appointments.patientId = Patient.id AND status = \'confirmed\''
 * );
 * ```
 */
const executeExistsSubquery = async (model, sequelize, existsQuery, where) => {
    return model.findAll({
        where: {
            ...where,
            [sequelize_1.Op.and]: [(0, sequelize_1.literal)(`EXISTS (${existsQuery})`)],
        },
    });
};
exports.executeExistsSubquery = executeExistsSubquery;
/**
 * Executes NOT EXISTS subquery check.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} notExistsQuery - NOT EXISTS subquery SQL
 * @param {WhereOptions<T>} [where] - Additional WHERE conditions
 * @returns {Promise<T[]>} Records where subquery does not exist
 *
 * @example
 * ```typescript
 * const patientsWithoutAppointments = await executeNotExistsSubquery(
 *   Patient,
 *   sequelize,
 *   'SELECT 1 FROM appointments WHERE appointments.patientId = Patient.id'
 * );
 * ```
 */
const executeNotExistsSubquery = async (model, sequelize, notExistsQuery, where) => {
    return model.findAll({
        where: {
            ...where,
            [sequelize_1.Op.and]: [(0, sequelize_1.literal)(`NOT EXISTS (${notExistsQuery})`)],
        },
    });
};
exports.executeNotExistsSubquery = executeNotExistsSubquery;
// ============================================================================
// RAW QUERY UTILITIES
// ============================================================================
/**
 * Executes a raw SQL query with parameter binding.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {RawQueryOptions} options - Raw query options
 * @returns {Promise<any[]>} Query results
 *
 * @example
 * ```typescript
 * const results = await executeRawQuery(sequelize, {
 *   query: 'SELECT * FROM patients WHERE age > :minAge AND status = :status',
 *   replacements: { minAge: 18, status: 'active' },
 *   type: QueryTypes.SELECT
 * });
 * ```
 */
const executeRawQuery = async (sequelize, options) => {
    const { query, replacements = {}, type = sequelize_1.QueryTypes.SELECT, mapToModel, model } = options;
    const queryOptions = {
        replacements,
        type,
    };
    if (mapToModel && model) {
        queryOptions.model = model;
        queryOptions.mapToModel = true;
    }
    return sequelize.query(query, queryOptions);
};
exports.executeRawQuery = executeRawQuery;
/**
 * Executes a stored procedure.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} procedureName - Stored procedure name
 * @param {Record<string, any>} [params] - Procedure parameters
 * @returns {Promise<any>} Procedure results
 *
 * @example
 * ```typescript
 * const result = await executeStoredProcedure(
 *   sequelize,
 *   'calculate_patient_metrics',
 *   { patientId: 'patient-123', startDate: '2024-01-01' }
 * );
 * ```
 */
const executeStoredProcedure = async (sequelize, procedureName, params) => {
    const paramList = params
        ? Object.entries(params)
            .map(([key, value]) => `:${key}`)
            .join(', ')
        : '';
    return sequelize.query(`CALL ${procedureName}(${paramList})`, {
        replacements: params,
        type: sequelize_1.QueryTypes.RAW,
    });
};
exports.executeStoredProcedure = executeStoredProcedure;
/**
 * Executes a query with Common Table Expression (CTE).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} cteName - CTE name
 * @param {string} cteQuery - CTE query
 * @param {string} mainQuery - Main query using CTE
 * @param {Record<string, any>} [replacements] - Query parameters
 * @returns {Promise<any[]>} Query results
 *
 * @example
 * ```typescript
 * const results = await executeWithCTE(
 *   sequelize,
 *   'recent_patients',
 *   'SELECT * FROM patients WHERE createdAt > :startDate',
 *   'SELECT * FROM recent_patients WHERE status = :status',
 *   { startDate: '2024-01-01', status: 'active' }
 * );
 * ```
 */
const executeWithCTE = async (sequelize, cteName, cteQuery, mainQuery, replacements) => {
    const fullQuery = `WITH ${cteName} AS (${cteQuery}) ${mainQuery}`;
    return sequelize.query(fullQuery, {
        replacements,
        type: sequelize_1.QueryTypes.SELECT,
    });
};
exports.executeWithCTE = executeWithCTE;
/**
 * Executes a recursive CTE query (e.g., for hierarchical data).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} cteName - Recursive CTE name
 * @param {string} anchorQuery - Anchor member query
 * @param {string} recursiveQuery - Recursive member query
 * @param {string} mainQuery - Main query using recursive CTE
 * @param {Record<string, any>} [replacements] - Query parameters
 * @returns {Promise<any[]>} Query results
 *
 * @example
 * ```typescript
 * const hierarchy = await executeRecursiveCTE(
 *   sequelize,
 *   'org_hierarchy',
 *   'SELECT id, name, parent_id, 0 as level FROM departments WHERE parent_id IS NULL',
 *   'SELECT d.id, d.name, d.parent_id, oh.level + 1 FROM departments d INNER JOIN org_hierarchy oh ON d.parent_id = oh.id',
 *   'SELECT * FROM org_hierarchy ORDER BY level, name'
 * );
 * ```
 */
const executeRecursiveCTE = async (sequelize, cteName, anchorQuery, recursiveQuery, mainQuery, replacements) => {
    const fullQuery = `
    WITH RECURSIVE ${cteName} AS (
      ${anchorQuery}
      UNION ALL
      ${recursiveQuery}
    )
    ${mainQuery}
  `;
    return sequelize.query(fullQuery, {
        replacements,
        type: sequelize_1.QueryTypes.SELECT,
    });
};
exports.executeRecursiveCTE = executeRecursiveCTE;
// ============================================================================
// QUERY OPTIMIZATION UTILITIES
// ============================================================================
/**
 * Executes EXPLAIN to analyze query performance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} query - Query to analyze
 * @param {Record<string, any>} [replacements] - Query parameters
 * @returns {Promise<any[]>} Explain results
 *
 * @example
 * ```typescript
 * const plan = await explainQuery(
 *   sequelize,
 *   'SELECT * FROM patients WHERE status = :status',
 *   { status: 'active' }
 * );
 * ```
 */
const explainQuery = async (sequelize, query, replacements) => {
    return sequelize.query(`EXPLAIN ${query}`, {
        replacements,
        type: sequelize_1.QueryTypes.SELECT,
    });
};
exports.explainQuery = explainQuery;
/**
 * Executes EXPLAIN ANALYZE for query performance with actual execution.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} query - Query to analyze
 * @param {Record<string, any>} [replacements] - Query parameters
 * @returns {Promise<any[]>} Explain analyze results
 *
 * @example
 * ```typescript
 * const analysis = await explainAnalyzeQuery(
 *   sequelize,
 *   'SELECT * FROM patients WHERE age > :minAge',
 *   { minAge: 18 }
 * );
 * ```
 */
const explainAnalyzeQuery = async (sequelize, query, replacements) => {
    return sequelize.query(`EXPLAIN ANALYZE ${query}`, {
        replacements,
        type: sequelize_1.QueryTypes.SELECT,
    });
};
exports.explainAnalyzeQuery = explainAnalyzeQuery;
/**
 * Disables subqueries for optimization in queries with includes.
 *
 * @template T
 * @param {FindOptions<T>} options - Find options
 * @returns {FindOptions<T>} Options with subQuery disabled
 *
 * @example
 * ```typescript
 * const options = disableSubquery({
 *   include: [{ model: MedicalRecord }],
 *   limit: 20
 * });
 * ```
 */
const disableSubquery = (options) => {
    return {
        ...options,
        subQuery: false,
    };
};
exports.disableSubquery = disableSubquery;
exports.default = {
    // Query builder
    createQueryBuilder: exports.createQueryBuilder,
    buildFindOptions: exports.buildFindOptions,
    // WHERE clause builders
    buildWhereClause: exports.buildWhereClause,
    buildComplexWhere: exports.buildComplexWhere,
    buildDateRangeWhere: exports.buildDateRangeWhere,
    buildContainsWhere: exports.buildContainsWhere,
    buildFullTextSearchWhere: exports.buildFullTextSearchWhere,
    buildNullCheckWhere: exports.buildNullCheckWhere,
    buildInWhere: exports.buildInWhere,
    // Operator helpers
    buildNumericComparison: exports.buildNumericComparison,
    buildStringPattern: exports.buildStringPattern,
    buildArrayOverlap: exports.buildArrayOverlap,
    // Pagination
    calculatePagination: exports.calculatePagination,
    executePaginatedQuery: exports.executePaginatedQuery,
    executeCursorPagination: exports.executeCursorPagination,
    // Sorting
    buildOrderClause: exports.buildOrderClause,
    buildNestedOrderClause: exports.buildNestedOrderClause,
    // Filtering and search
    executeSearch: exports.executeSearch,
    buildDynamicFilter: exports.buildDynamicFilter,
    // Aggregation
    executeAggregation: exports.executeAggregation,
    countByGroup: exports.countByGroup,
    sumByGroup: exports.sumByGroup,
    averageByGroup: exports.averageByGroup,
    // Joins
    buildJoinIncludes: exports.buildJoinIncludes,
    executeLeftJoin: exports.executeLeftJoin,
    executeInnerJoin: exports.executeInnerJoin,
    // Subqueries
    buildSubquery: exports.buildSubquery,
    executeExistsSubquery: exports.executeExistsSubquery,
    executeNotExistsSubquery: exports.executeNotExistsSubquery,
    // Raw queries
    executeRawQuery: exports.executeRawQuery,
    executeStoredProcedure: exports.executeStoredProcedure,
    executeWithCTE: exports.executeWithCTE,
    executeRecursiveCTE: exports.executeRecursiveCTE,
    // Query optimization
    explainQuery: exports.explainQuery,
    explainAnalyzeQuery: exports.explainAnalyzeQuery,
    disableSubquery: exports.disableSubquery,
};
//# sourceMappingURL=sequelize-query-kit.js.map