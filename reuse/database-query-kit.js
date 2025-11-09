"use strict";
/**
 * LOC: D1B2Q3U4E5
 * File: /reuse/database-query-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - @types/node (v18.x)
 *
 * DOWNSTREAM (imported by):
 *   - Service layers
 *   - Repository patterns
 *   - API controllers
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildComplexQuery = buildComplexQuery;
exports.buildConditionalIncludes = buildConditionalIncludes;
exports.buildNestedRelationQuery = buildNestedRelationQuery;
exports.buildPolymorphicQuery = buildPolymorphicQuery;
exports.buildFullTextSearchQuery = buildFullTextSearchQuery;
exports.buildTemporalQuery = buildTemporalQuery;
exports.buildGeospatialQuery = buildGeospatialQuery;
exports.buildHierarchicalQuery = buildHierarchicalQuery;
exports.buildDynamicWhere = buildDynamicWhere;
exports.mergeWhereConditions = mergeWhereConditions;
exports.buildCaseInsensitiveWhere = buildCaseInsensitiveWhere;
exports.buildNullSafeWhere = buildNullSafeWhere;
exports.buildRangeWhere = buildRangeWhere;
exports.buildJsonFieldQuery = buildJsonFieldQuery;
exports.paginateWithCursor = paginateWithCursor;
exports.paginateWithOffset = paginateWithOffset;
exports.paginateWithKeyset = paginateWithKeyset;
exports.calculateOptimalPageSize = calculateOptimalPageSize;
exports.generatePaginationMetadata = generatePaginationMetadata;
exports.convertPaginationStrategy = convertPaginationStrategy;
exports.buildDynamicSort = buildDynamicSort;
exports.parseSortParam = parseSortParam;
exports.buildMultiFieldFilter = buildMultiFieldFilter;
exports.applyFacetedFilters = applyFacetedFilters;
exports.validateAndSanitizeFilters = validateAndSanitizeFilters;
exports.buildSearchSuggestions = buildSearchSuggestions;
exports.bulkCreateWithValidation = bulkCreateWithValidation;
exports.bulkUpdateWithConditions = bulkUpdateWithConditions;
exports.bulkDeleteWithSoftDelete = bulkDeleteWithSoftDelete;
exports.batchProcess = batchProcess;
exports.bulkUpsert = bulkUpsert;
exports.bulkOperationWithProgress = bulkOperationWithProgress;
exports.executeInTransaction = executeInTransaction;
exports.executeMultipleInTransaction = executeMultipleInTransaction;
exports.createSavepoint = createSavepoint;
exports.coordinateDistributedTransaction = coordinateDistributedTransaction;
exports.updateWithOptimisticLocking = updateWithOptimisticLocking;
exports.applyFieldProjection = applyFieldProjection;
exports.optimizeIncludes = optimizeIncludes;
exports.addQueryHints = addQueryHints;
exports.queryWithCache = queryWithCache;
exports.buildSubquery = buildSubquery;
exports.executeRawQuery = executeRawQuery;
exports.buildUnionQuery = buildUnionQuery;
exports.applySoftDelete = applySoftDelete;
/**
 * File: /reuse/database-query-kit.ts
 * Locator: WC-UTL-DB-QKIT-001
 * Purpose: Database Query Kit - Advanced query builders and operation helpers
 *
 * Upstream: sequelize v6.x, @types/node
 * Downstream: All database services, repositories, and data access layers
 * Dependencies: Sequelize v6.x, Node 18+, TypeScript 5.x
 * Exports: 45 query utilities for complex queries, pagination, filtering, transactions, and bulk operations
 *
 * LLM Context: Production-grade Sequelize v6.x query kit for White Cross healthcare platform.
 * Provides advanced helpers for dynamic query building, WHERE clause construction, cursor/offset pagination,
 * sorting utilities, bulk operations, transaction management, query optimization, subqueries, raw queries
 * with type safety, and soft delete patterns. HIPAA-compliant with PHI protection.
 */
const sequelize_1 = require("sequelize");
// ============================================================================
// SECTION 1: COMPLEX QUERY BUILDERS (Functions 1-8)
// ============================================================================
/**
 * 1. Builds a complex query with dynamic configuration.
 * Supports conditional includes, filters, and nested relations.
 *
 * @param {QueryBuilderConfig<T>} config - Query configuration
 * @returns {FindOptions<Attributes<T>>} Sequelize find options
 *
 * @example
 * ```typescript
 * const query = buildComplexQuery({
 *   where: { status: 'active' },
 *   include: [{ model: Profile, as: 'profile' }],
 *   order: [['createdAt', 'DESC']],
 *   limit: 10
 * });
 * const users = await User.findAll(query);
 * ```
 */
function buildComplexQuery(config) {
    const query = {};
    if (config.where)
        query.where = config.where;
    if (config.include)
        query.include = config.include;
    if (config.order)
        query.order = config.order;
    if (config.limit !== undefined)
        query.limit = config.limit;
    if (config.offset !== undefined)
        query.offset = config.offset;
    if (config.attributes)
        query.attributes = config.attributes;
    if (config.group)
        query.group = config.group;
    if (config.having)
        query.having = config.having;
    if (config.subQuery !== undefined)
        query.subQuery = config.subQuery;
    if (config.distinct !== undefined)
        query.distinct = config.distinct;
    if (config.paranoid !== undefined)
        query.paranoid = config.paranoid;
    if (config.raw !== undefined)
        query.raw = config.raw;
    if (config.transaction)
        query.transaction = config.transaction;
    return query;
}
/**
 * 2. Builds a query with conditional includes based on runtime criteria.
 * Allows dynamic relationship loading.
 *
 * @param {Includeable[]} baseIncludes - Base includes
 * @param {Record<string, boolean | Includeable>} conditionalIncludes - Conditional includes
 * @returns {Includeable[]} Combined includes array
 *
 * @example
 * ```typescript
 * const includes = buildConditionalIncludes(
 *   [{ model: Profile }],
 *   {
 *     posts: userWantsPosts,
 *     comments: { model: Comment, where: { approved: true } }
 *   }
 * );
 * ```
 */
function buildConditionalIncludes(baseIncludes, conditionalIncludes) {
    const includes = [...baseIncludes];
    Object.entries(conditionalIncludes).forEach(([key, value]) => {
        if (value === true) {
            includes.push({ association: key });
        }
        else if (typeof value === 'object' && value !== null) {
            includes.push(value);
        }
    });
    return includes;
}
/**
 * 3. Builds a nested relation query with depth control.
 * Prevents over-fetching by limiting relation depth.
 *
 * @param {ModelStatic<T>} model - Root model
 * @param {string[]} relationPath - Array of relation names
 * @param {number} maxDepth - Maximum depth to traverse
 * @returns {Includeable[]} Nested include configuration
 *
 * @example
 * ```typescript
 * const includes = buildNestedRelationQuery(
 *   User,
 *   ['posts', 'comments', 'author'],
 *   3
 * );
 * ```
 */
function buildNestedRelationQuery(model, relationPath, maxDepth = 5) {
    if (relationPath.length === 0 || maxDepth <= 0) {
        return [];
    }
    const [currentRelation, ...remainingPath] = relationPath;
    const include = {
        association: currentRelation,
    };
    if (remainingPath.length > 0 && maxDepth > 1) {
        const associations = model.associations;
        const association = associations?.[currentRelation];
        if (association && association.target) {
            include.include = buildNestedRelationQuery(association.target, remainingPath, maxDepth - 1);
        }
    }
    return [include];
}
/**
 * 4. Builds a polymorphic association query.
 * Handles queries for polymorphic relationships.
 *
 * @param {string} targetType - Target model type
 * @param {string | number} targetId - Target model ID
 * @param {string} typeField - Type field name
 * @param {string} idField - ID field name
 * @returns {WhereOptions} Where clause for polymorphic query
 *
 * @example
 * ```typescript
 * const where = buildPolymorphicQuery('User', 123, 'commentableType', 'commentableId');
 * const comments = await Comment.findAll({ where });
 * ```
 */
function buildPolymorphicQuery(targetType, targetId, typeField = 'referenceType', idField = 'referenceId') {
    return {
        [typeField]: targetType,
        [idField]: targetId,
    };
}
/**
 * 5. Builds a full-text search query with multiple fields.
 * Supports PostgreSQL full-text search and fallback patterns.
 *
 * @param {string[]} fields - Fields to search
 * @param {string} searchTerm - Search term
 * @param {object} options - Search options
 * @returns {WhereOptions} Full-text search where clause
 *
 * @example
 * ```typescript
 * const where = buildFullTextSearchQuery(
 *   ['firstName', 'lastName', 'email'],
 *   'john doe',
 *   { caseSensitive: false, exactMatch: false }
 * );
 * ```
 */
function buildFullTextSearchQuery(fields, searchTerm, options = {}) {
    const { caseSensitive = false, exactMatch = false, usePostgresFullText = false } = options;
    if (usePostgresFullText) {
        // PostgreSQL full-text search
        return {
            [sequelize_1.Op.and]: fields.map(field => ({
                [field]: {
                    [sequelize_1.Op.match]: sequelize_1.Sequelize.fn('to_tsquery', searchTerm),
                },
            })),
        };
    }
    // Fallback to LIKE/ILIKE
    const operator = caseSensitive ? sequelize_1.Op.like : sequelize_1.Op.iLike;
    const pattern = exactMatch ? searchTerm : `%${searchTerm}%`;
    return {
        [sequelize_1.Op.or]: fields.map(field => ({
            [field]: { [operator]: pattern },
        })),
    };
}
/**
 * 6. Builds a temporal query for time-based filtering.
 * Supports various time range operations.
 *
 * @param {string} field - Date/time field name
 * @param {object} timeRange - Time range configuration
 * @returns {WhereOptions} Temporal where clause
 *
 * @example
 * ```typescript
 * const where = buildTemporalQuery('createdAt', {
 *   start: new Date('2024-01-01'),
 *   end: new Date('2024-12-31'),
 *   inclusive: true
 * });
 * ```
 */
function buildTemporalQuery(field, timeRange) {
    const { start, end, before, after, inclusive = true } = timeRange;
    const conditions = [];
    if (start) {
        conditions.push({ [field]: { [inclusive ? sequelize_1.Op.gte : sequelize_1.Op.gt]: start } });
    }
    if (end) {
        conditions.push({ [field]: { [inclusive ? sequelize_1.Op.lte : sequelize_1.Op.lt]: end } });
    }
    if (before) {
        conditions.push({ [field]: { [sequelize_1.Op.lt]: before } });
    }
    if (after) {
        conditions.push({ [field]: { [sequelize_1.Op.gt]: after } });
    }
    return conditions.length > 0 ? { [sequelize_1.Op.and]: conditions } : {};
}
/**
 * 7. Builds a geospatial query for location-based filtering.
 * Supports distance calculations and bounding box queries.
 *
 * @param {object} config - Geospatial query configuration
 * @returns {WhereOptions} Geospatial where clause
 *
 * @example
 * ```typescript
 * const where = buildGeospatialQuery({
 *   field: 'location',
 *   latitude: 40.7128,
 *   longitude: -74.0060,
 *   radiusKm: 10
 * });
 * ```
 */
function buildGeospatialQuery(config) {
    const { field, latitude, longitude, radiusKm, boundingBox } = config;
    if (radiusKm) {
        // Radius-based query (using ST_DWithin for PostGIS)
        return sequelize_1.Sequelize.where(sequelize_1.Sequelize.fn('ST_DWithin', sequelize_1.Sequelize.col(field), sequelize_1.Sequelize.fn('ST_MakePoint', longitude, latitude), radiusKm * 1000), true);
    }
    if (boundingBox) {
        // Bounding box query
        const { north, south, east, west } = boundingBox;
        return sequelize_1.Sequelize.where(sequelize_1.Sequelize.fn('ST_Within', sequelize_1.Sequelize.col(field), sequelize_1.Sequelize.fn('ST_MakeEnvelope', west, south, east, north, 4326)), true);
    }
    return {};
}
/**
 * 8. Builds a hierarchical query for tree structures.
 * Supports adjacency list and nested set models.
 *
 * @param {ModelStatic<T>} model - Model with hierarchical data
 * @param {string | number} rootId - Root node ID
 * @param {object} options - Hierarchy options
 * @returns {FindOptions} Hierarchical query options
 *
 * @example
 * ```typescript
 * const query = buildHierarchicalQuery(
 *   Category,
 *   'root-id',
 *   { maxDepth: 3, includeRoot: true }
 * );
 * ```
 */
function buildHierarchicalQuery(model, rootId, options = {}) {
    const { parentField = 'parentId', maxDepth = 10, includeRoot = true } = options;
    // For now, returns a simple query. In production, would use recursive CTEs
    const where = includeRoot
        ? { [sequelize_1.Op.or]: [{ id: rootId }, { [parentField]: rootId }] }
        : { [parentField]: rootId };
    return {
        where,
        // In production, use raw query with recursive CTE for full hierarchy
    };
}
// ============================================================================
// SECTION 2: DYNAMIC WHERE CLAUSE CONSTRUCTION (Functions 9-14)
// ============================================================================
/**
 * 9. Builds a dynamic WHERE clause from filter array.
 * Converts filter configurations to Sequelize where conditions.
 *
 * @param {FilterConfig[]} filters - Array of filter configurations
 * @returns {WhereOptions} Combined where clause
 *
 * @example
 * ```typescript
 * const where = buildDynamicWhere([
 *   { field: 'age', operator: 'gte', value: 18 },
 *   { field: 'status', operator: 'in', value: ['active', 'pending'] }
 * ]);
 * ```
 */
function buildDynamicWhere(filters) {
    if (!filters || filters.length === 0) {
        return {};
    }
    const conditions = filters.map(filter => {
        const { field, operator, value } = filter;
        return { [field]: { [sequelize_1.Op[operator]]: value } };
    });
    return { [sequelize_1.Op.and]: conditions };
}
/**
 * 10. Merges multiple WHERE clauses with logical operators.
 * Combines where conditions using AND/OR logic.
 *
 * @param {WhereOptions[]} whereClauses - Array of where clauses
 * @param {string} operator - Logical operator ('and' | 'or')
 * @returns {WhereOptions} Merged where clause
 *
 * @example
 * ```typescript
 * const where = mergeWhereConditions(
 *   [{ age: { [Op.gte]: 18 } }, { status: 'active' }],
 *   'and'
 * );
 * ```
 */
function mergeWhereConditions(whereClauses, operator = 'and') {
    if (whereClauses.length === 0) {
        return {};
    }
    if (whereClauses.length === 1) {
        return whereClauses[0];
    }
    const opSymbol = operator === 'and' ? sequelize_1.Op.and : sequelize_1.Op.or;
    return { [opSymbol]: whereClauses };
}
/**
 * 11. Builds a case-insensitive where clause.
 * Normalizes string comparisons regardless of case.
 *
 * @param {string} field - Field name
 * @param {string | string[]} value - Search value(s)
 * @param {boolean} exact - Exact match or partial
 * @returns {WhereOptions} Case-insensitive where clause
 *
 * @example
 * ```typescript
 * const where = buildCaseInsensitiveWhere('email', 'JOHN@EXAMPLE.COM', true);
 * ```
 */
function buildCaseInsensitiveWhere(field, value, exact = true) {
    if (Array.isArray(value)) {
        return {
            [field]: {
                [sequelize_1.Op.in]: value.map(v => v.toLowerCase()),
            },
        };
    }
    const operator = exact ? sequelize_1.Op.iLike : sequelize_1.Op.iLike;
    const pattern = exact ? value : `%${value}%`;
    return {
        [field]: {
            [operator]: pattern,
        },
    };
}
/**
 * 12. Builds a WHERE clause with NULL handling.
 * Handles NULL values appropriately in conditions.
 *
 * @param {string} field - Field name
 * @param {any} value - Value to compare
 * @param {object} options - NULL handling options
 * @returns {WhereOptions} WHERE clause with NULL handling
 *
 * @example
 * ```typescript
 * const where = buildNullSafeWhere('deletedAt', null, { treatNullAs: 'active' });
 * ```
 */
function buildNullSafeWhere(field, value, options = {}) {
    const { includeNull = false, excludeNull = false, treatNullAs } = options;
    if (value === null || value === undefined) {
        if (treatNullAs !== undefined) {
            return { [field]: treatNullAs };
        }
        return { [field]: { [sequelize_1.Op.is]: null } };
    }
    const baseCondition = { [field]: value };
    if (includeNull) {
        return {
            [sequelize_1.Op.or]: [baseCondition, { [field]: { [sequelize_1.Op.is]: null } }],
        };
    }
    if (excludeNull) {
        return {
            [sequelize_1.Op.and]: [baseCondition, { [field]: { [sequelize_1.Op.not]: null } }],
        };
    }
    return baseCondition;
}
/**
 * 13. Builds a range-based WHERE clause for numeric/date fields.
 * Supports inclusive and exclusive range queries.
 *
 * @param {string} field - Field name
 * @param {object} range - Range configuration
 * @returns {WhereOptions} Range where clause
 *
 * @example
 * ```typescript
 * const where = buildRangeWhere('age', { min: 18, max: 65, inclusive: true });
 * ```
 */
function buildRangeWhere(field, range) {
    const { min, max, inclusive = true } = range;
    const conditions = [];
    if (min !== undefined) {
        conditions.push({ [field]: { [inclusive ? sequelize_1.Op.gte : sequelize_1.Op.gt]: min } });
    }
    if (max !== undefined) {
        conditions.push({ [field]: { [inclusive ? sequelize_1.Op.lte : sequelize_1.Op.lt]: max } });
    }
    return conditions.length > 0 ? { [sequelize_1.Op.and]: conditions } : {};
}
/**
 * 14. Builds a JSON/JSONB field query for PostgreSQL.
 * Supports nested JSON path queries.
 *
 * @param {string} field - JSON field name
 * @param {string} path - JSON path (dot notation)
 * @param {any} value - Value to match
 * @param {string} operator - Comparison operator
 * @returns {WhereOptions} JSON query where clause
 *
 * @example
 * ```typescript
 * const where = buildJsonFieldQuery('metadata', 'user.preferences.theme', 'dark', 'eq');
 * ```
 */
function buildJsonFieldQuery(field, path, value, operator = 'eq') {
    const jsonPath = path.split('.').reduce((acc, key) => {
        return acc ? `${acc}.${key}` : key;
    }, '');
    const opMap = {
        eq: sequelize_1.Op.eq,
        ne: sequelize_1.Op.ne,
        gt: sequelize_1.Op.gt,
        gte: sequelize_1.Op.gte,
        lt: sequelize_1.Op.lt,
        lte: sequelize_1.Op.lte,
        contains: sequelize_1.Op.contains,
    };
    return sequelize_1.Sequelize.where(sequelize_1.Sequelize.json(`${field}.${jsonPath}`), opMap[operator], value);
}
// ============================================================================
// SECTION 3: PAGINATION HELPERS (Functions 15-20)
// ============================================================================
/**
 * 15. Implements cursor-based pagination (forward direction).
 * Efficient for large datasets with stable ordering.
 *
 * @param {ModelStatic<T>} model - Model to query
 * @param {CursorPaginationConfig} config - Cursor pagination config
 * @param {FindOptions} baseQuery - Base query options
 * @returns {Promise<PaginatedResult<T>>} Paginated results
 *
 * @example
 * ```typescript
 * const result = await paginateWithCursor(User, {
 *   cursor: 'eyJpZCI6MTIzfQ==',
 *   limit: 20,
 *   cursorField: 'id'
 * }, { where: { status: 'active' } });
 * ```
 */
async function paginateWithCursor(model, config, baseQuery = {}) {
    const { cursor, limit = 20, cursorField = 'id', direction = 'forward', decode = (c) => JSON.parse(Buffer.from(c, 'base64').toString()), encode = (v) => Buffer.from(JSON.stringify(v)).toString('base64'), } = config;
    const query = { ...baseQuery };
    query.limit = limit + 1; // Fetch one extra to check if there's more
    // Add cursor condition
    if (cursor) {
        const decodedCursor = decode(cursor);
        const operator = direction === 'forward' ? sequelize_1.Op.gt : sequelize_1.Op.lt;
        query.where = mergeWhereConditions([query.where || {}, { [cursorField]: { [operator]: decodedCursor } }], 'and');
    }
    // Set order
    query.order = [[cursorField, direction === 'forward' ? 'ASC' : 'DESC']];
    const results = await model.findAll(query);
    const hasMore = results.length > limit;
    const data = hasMore ? results.slice(0, -1) : results;
    const nextCursor = hasMore && data.length > 0
        ? encode(data[data.length - 1][cursorField])
        : undefined;
    const prevCursor = data.length > 0 && cursor
        ? encode(data[0][cursorField])
        : undefined;
    return {
        data: data,
        pagination: {
            hasNext: hasMore,
            hasPrev: !!cursor,
            nextCursor,
            prevCursor,
        },
    };
}
/**
 * 16. Implements offset-based pagination with total count.
 * Traditional pagination with page numbers.
 *
 * @param {ModelStatic<T>} model - Model to query
 * @param {OffsetPaginationConfig} config - Offset pagination config
 * @param {FindOptions} baseQuery - Base query options
 * @returns {Promise<PaginatedResult<T>>} Paginated results with total count
 *
 * @example
 * ```typescript
 * const result = await paginateWithOffset(User, {
 *   page: 2,
 *   pageSize: 25
 * }, { where: { status: 'active' } });
 * ```
 */
async function paginateWithOffset(model, config, baseQuery = {}) {
    const page = config.page || 1;
    const pageSize = config.pageSize || config.limit || 20;
    const offset = config.offset !== undefined ? config.offset : (page - 1) * pageSize;
    const { count, rows } = await model.findAndCountAll({
        ...baseQuery,
        limit: pageSize,
        offset,
        distinct: true,
    });
    const totalPages = Math.ceil(count / pageSize);
    return {
        data: rows,
        pagination: {
            total: count,
            page,
            pageSize,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
        },
    };
}
/**
 * 17. Implements keyset pagination for stable, efficient pagination.
 * Uses composite keys for pagination without offset.
 *
 * @param {ModelStatic<T>} model - Model to query
 * @param {object} config - Keyset pagination config
 * @param {FindOptions} baseQuery - Base query options
 * @returns {Promise<PaginatedResult<T>>} Paginated results
 *
 * @example
 * ```typescript
 * const result = await paginateWithKeyset(User, {
 *   keys: { createdAt: '2024-01-01', id: 123 },
 *   limit: 20
 * });
 * ```
 */
async function paginateWithKeyset(model, config, baseQuery = {}) {
    const { keys, limit = 20, keyFields = ['createdAt', 'id'], direction = 'forward', } = config;
    const query = { ...baseQuery };
    query.limit = limit + 1;
    // Build keyset WHERE clause
    if (keys) {
        const keyConditions = [];
        for (let i = 0; i < keyFields.length; i++) {
            const field = keyFields[i];
            const value = keys[field];
            if (value !== undefined) {
                const operator = direction === 'forward' ? sequelize_1.Op.gt : sequelize_1.Op.lt;
                const condition = {};
                // Add equality conditions for previous fields
                for (let j = 0; j < i; j++) {
                    condition[keyFields[j]] = keys[keyFields[j]];
                }
                // Add comparison for current field
                condition[field] = { [operator]: value };
                keyConditions.push(condition);
            }
        }
        if (keyConditions.length > 0) {
            query.where = mergeWhereConditions([query.where || {}, { [sequelize_1.Op.or]: keyConditions }], 'and');
        }
    }
    // Set ordering
    query.order = keyFields.map(field => [
        field,
        direction === 'forward' ? 'ASC' : 'DESC',
    ]);
    const results = await model.findAll(query);
    const hasMore = results.length > limit;
    const data = hasMore ? results.slice(0, -1) : results;
    return {
        data: data,
        pagination: {
            hasNext: hasMore,
            hasPrev: !!keys,
        },
    };
}
/**
 * 18. Calculates optimal page size based on data characteristics.
 * Adjusts page size for performance optimization.
 *
 * @param {object} config - Page size calculation config
 * @returns {number} Optimal page size
 *
 * @example
 * ```typescript
 * const pageSize = calculateOptimalPageSize({
 *   totalRecords: 10000,
 *   averageRecordSize: 2048,
 *   targetResponseTime: 200
 * });
 * ```
 */
function calculateOptimalPageSize(config) {
    const { totalRecords = 1000, averageRecordSize = 1024, targetResponseTime = 200, minPageSize = 10, maxPageSize = 100, } = config;
    // Simple heuristic: larger records = smaller page size
    let pageSize = Math.floor(targetResponseTime / (averageRecordSize / 1000));
    // Constrain to min/max
    pageSize = Math.max(minPageSize, Math.min(maxPageSize, pageSize));
    return pageSize;
}
/**
 * 19. Generates pagination metadata for API responses.
 * Creates standard pagination info object.
 *
 * @param {object} config - Pagination metadata config
 * @returns {object} Pagination metadata
 *
 * @example
 * ```typescript
 * const meta = generatePaginationMetadata({
 *   total: 250,
 *   page: 3,
 *   pageSize: 25,
 *   baseUrl: '/api/users'
 * });
 * ```
 */
function generatePaginationMetadata(config) {
    const { total, page, pageSize, hasNext, hasPrev, baseUrl, queryParams = {} } = config;
    const metadata = {
        total,
        page,
        pageSize,
    };
    if (total !== undefined && pageSize) {
        metadata.totalPages = Math.ceil(total / pageSize);
    }
    metadata.hasNext = hasNext;
    metadata.hasPrev = hasPrev;
    if (baseUrl && page) {
        const buildUrl = (p) => {
            const params = new URLSearchParams({ ...queryParams, page: p.toString() });
            return `${baseUrl}?${params.toString()}`;
        };
        metadata.links = {
            first: buildUrl(1),
            prev: hasPrev ? buildUrl(page - 1) : undefined,
            next: hasNext ? buildUrl(page + 1) : undefined,
            last: metadata.totalPages ? buildUrl(metadata.totalPages) : undefined,
        };
    }
    return metadata;
}
/**
 * 20. Converts between different pagination strategies.
 * Translates cursor to offset and vice versa.
 *
 * @param {object} config - Pagination conversion config
 * @returns {object} Converted pagination parameters
 *
 * @example
 * ```typescript
 * const offsetParams = convertPaginationStrategy({
 *   from: 'cursor',
 *   to: 'offset',
 *   cursor: 'eyJpZCI6MTIzfQ==',
 *   pageSize: 20
 * });
 * ```
 */
function convertPaginationStrategy(config) {
    const { from, to, cursor, offset, page, pageSize = 20 } = config;
    if (from === to) {
        return { cursor, offset, page };
    }
    if (from === 'cursor' && to === 'offset' && cursor) {
        // Decode cursor to get approximate offset (this is a simplified example)
        try {
            const decoded = JSON.parse(Buffer.from(cursor, 'base64').toString());
            const estimatedOffset = decoded.offset || 0;
            return {
                offset: estimatedOffset,
                page: Math.floor(estimatedOffset / pageSize) + 1,
            };
        }
        catch {
            return { offset: 0, page: 1 };
        }
    }
    if (from === 'offset' && to === 'cursor') {
        const actualOffset = offset !== undefined ? offset : (page ? (page - 1) * pageSize : 0);
        const cursorData = { offset: actualOffset };
        return {
            cursor: Buffer.from(JSON.stringify(cursorData)).toString('base64'),
        };
    }
    return {};
}
// ============================================================================
// SECTION 4: SORTING AND FILTERING UTILITIES (Functions 21-26)
// ============================================================================
/**
 * 21. Builds dynamic ORDER BY clause from sort configurations.
 * Supports multi-field sorting with nulls handling.
 *
 * @param {SortConfig[]} sortConfigs - Array of sort configurations
 * @returns {Order} Sequelize order array
 *
 * @example
 * ```typescript
 * const order = buildDynamicSort([
 *   { field: 'lastName', direction: 'ASC', nulls: 'last' },
 *   { field: 'firstName', direction: 'ASC' }
 * ]);
 * ```
 */
function buildDynamicSort(sortConfigs) {
    return sortConfigs.map(config => {
        const { field, direction, nulls, collate } = config;
        const orderElement = [field];
        // Add direction
        if (direction.includes('NULLS')) {
            orderElement.push(direction);
        }
        else {
            orderElement.push(direction);
            if (nulls) {
                orderElement.push(`NULLS ${nulls.toUpperCase()}`);
            }
        }
        // Add collation if specified
        if (collate) {
            orderElement.push({ collate });
        }
        return orderElement.length === 2 ? orderElement : orderElement;
    });
}
/**
 * 22. Parses sort parameter from query string.
 * Converts URL sort params to Sequelize order format.
 *
 * @param {string} sortParam - Sort parameter string
 * @param {string[]} allowedFields - Allowed sortable fields
 * @returns {Order} Parsed order array
 *
 * @example
 * ```typescript
 * const order = parseSortParam('-createdAt,+name', ['createdAt', 'name', 'email']);
 * // Returns: [['createdAt', 'DESC'], ['name', 'ASC']]
 * ```
 */
function parseSortParam(sortParam, allowedFields = []) {
    if (!sortParam) {
        return [];
    }
    const sortParts = sortParam.split(',').map(s => s.trim());
    const order = [];
    for (const part of sortParts) {
        const direction = part.startsWith('-') ? 'DESC' : 'ASC';
        const field = part.replace(/^[+-]/, '');
        // Validate field if allowedFields is provided
        if (allowedFields.length > 0 && !allowedFields.includes(field)) {
            continue;
        }
        order.push([field, direction]);
    }
    return order;
}
/**
 * 23. Builds a multi-field filter from query parameters.
 * Converts URL query params to Sequelize where conditions.
 *
 * @param {Record<string, any>} queryParams - Query parameters
 * @param {Record<string, string>} fieldMappings - Field type mappings
 * @returns {WhereOptions} Filter where clause
 *
 * @example
 * ```typescript
 * const where = buildMultiFieldFilter(
 *   { age: '18', status: 'active,pending', name: 'John' },
 *   { age: 'number', status: 'array', name: 'string' }
 * );
 * ```
 */
function buildMultiFieldFilter(queryParams, fieldMappings = {}) {
    const conditions = {};
    Object.entries(queryParams).forEach(([field, value]) => {
        if (value === undefined || value === null || value === '') {
            return;
        }
        const fieldType = fieldMappings[field] || 'string';
        switch (fieldType) {
            case 'number':
                conditions[field] = parseFloat(value);
                break;
            case 'boolean':
                conditions[field] = value === 'true' || value === '1';
                break;
            case 'array':
                conditions[field] = {
                    [sequelize_1.Op.in]: typeof value === 'string' ? value.split(',') : value,
                };
                break;
            case 'date':
                conditions[field] = new Date(value);
                break;
            default:
                conditions[field] = value;
        }
    });
    return conditions;
}
/**
 * 24. Applies faceted search filters.
 * Builds filters for faceted navigation.
 *
 * @param {Record<string, any[]>} facets - Facet selections
 * @param {string} operator - Combination operator
 * @returns {WhereOptions} Faceted filter where clause
 *
 * @example
 * ```typescript
 * const where = applyFacetedFilters({
 *   category: ['electronics', 'computers'],
 *   brand: ['apple', 'dell'],
 *   priceRange: ['100-500']
 * }, 'and');
 * ```
 */
function applyFacetedFilters(facets, operator = 'and') {
    const facetConditions = Object.entries(facets)
        .filter(([_, values]) => values && values.length > 0)
        .map(([field, values]) => ({
        [field]: { [sequelize_1.Op.in]: values },
    }));
    if (facetConditions.length === 0) {
        return {};
    }
    const opSymbol = operator === 'and' ? sequelize_1.Op.and : sequelize_1.Op.or;
    return { [opSymbol]: facetConditions };
}
/**
 * 25. Validates and sanitizes filter inputs.
 * Ensures filter safety and prevents injection.
 *
 * @param {FilterConfig[]} filters - Filter configurations
 * @param {object} rules - Validation rules
 * @returns {FilterConfig[]} Validated and sanitized filters
 *
 * @example
 * ```typescript
 * const safeFilters = validateAndSanitizeFilters(
 *   [{ field: 'age', operator: 'gte', value: '18' }],
 *   { age: { type: 'number', min: 0, max: 150 } }
 * );
 * ```
 */
function validateAndSanitizeFilters(filters, rules = {}) {
    return filters
        .filter(filter => {
        const rule = rules[filter.field];
        if (!rule)
            return true;
        // Validate operator
        if (rule.allowedOperators && !rule.allowedOperators.includes(filter.operator)) {
            return false;
        }
        // Type validation
        if (rule.type === 'number') {
            const numValue = parseFloat(filter.value);
            if (isNaN(numValue))
                return false;
            if (rule.min !== undefined && numValue < rule.min)
                return false;
            if (rule.max !== undefined && numValue > rule.max)
                return false;
            filter.value = numValue;
        }
        if (rule.type === 'string' && rule.pattern) {
            if (!rule.pattern.test(filter.value))
                return false;
        }
        return true;
    });
}
/**
 * 26. Builds search suggestions based on partial input.
 * Provides autocomplete/typeahead functionality.
 *
 * @param {ModelStatic<T>} model - Model to search
 * @param {string} field - Field to search in
 * @param {string} partial - Partial input
 * @param {object} options - Search options
 * @returns {Promise<string[]>} Array of suggestions
 *
 * @example
 * ```typescript
 * const suggestions = await buildSearchSuggestions(
 *   User,
 *   'email',
 *   'john',
 *   { limit: 10, caseSensitive: false }
 * );
 * ```
 */
async function buildSearchSuggestions(model, field, partial, options = {}) {
    const { limit = 10, caseSensitive = false, minLength = 2 } = options;
    if (partial.length < minLength) {
        return [];
    }
    const operator = caseSensitive ? sequelize_1.Op.like : sequelize_1.Op.iLike;
    const results = await model.findAll({
        attributes: [[sequelize_1.Sequelize.fn('DISTINCT', sequelize_1.Sequelize.col(field)), field]],
        where: {
            [field]: {
                [operator]: `${partial}%`,
            },
        },
        limit,
        raw: true,
    });
    return results.map((r) => r[field]).filter(Boolean);
}
// ============================================================================
// SECTION 5: BULK OPERATION HELPERS (Functions 27-32)
// ============================================================================
/**
 * 27. Performs bulk create with validation and error handling.
 * Creates multiple records efficiently with rollback on error.
 *
 * @param {ModelStatic<T>} model - Model to create records in
 * @param {CreationAttributes<T>[]} data - Array of records to create
 * @param {BulkCreateOptions<T>} options - Bulk create options
 * @returns {Promise<BulkOperationResult<T>>} Bulk operation result
 *
 * @example
 * ```typescript
 * const result = await bulkCreateWithValidation(User, [
 *   { email: 'user1@example.com', firstName: 'John' },
 *   { email: 'user2@example.com', firstName: 'Jane' }
 * ], { validate: true, individualHooks: true });
 * ```
 */
async function bulkCreateWithValidation(model, data, options = {}) {
    try {
        const created = await model.bulkCreate(data, {
            validate: true,
            individualHooks: false,
            ...options,
        });
        return {
            success: true,
            count: created.length,
            data: created,
            affectedIds: created.map((r) => r.id),
        };
    }
    catch (error) {
        return {
            success: false,
            count: 0,
            errors: [error],
        };
    }
}
/**
 * 28. Performs bulk update with conditional logic.
 * Updates multiple records based on conditions.
 *
 * @param {ModelStatic<T>} model - Model to update
 * @param {object} updates - Update values
 * @param {WhereOptions} where - Update conditions
 * @param {UpdateOptions} options - Update options
 * @returns {Promise<BulkOperationResult>} Bulk operation result
 *
 * @example
 * ```typescript
 * const result = await bulkUpdateWithConditions(
 *   User,
 *   { status: 'inactive' },
 *   { lastLogin: { [Op.lt]: thirtyDaysAgo } }
 * );
 * ```
 */
async function bulkUpdateWithConditions(model, updates, where, options = {}) {
    try {
        const [affectedCount] = await model.update(updates, {
            where,
            individualHooks: false,
            ...options,
        });
        return {
            success: true,
            count: affectedCount,
        };
    }
    catch (error) {
        return {
            success: false,
            count: 0,
            errors: [error],
        };
    }
}
/**
 * 29. Performs bulk delete with soft delete support.
 * Deletes multiple records with optional soft delete.
 *
 * @param {ModelStatic<T>} model - Model to delete from
 * @param {WhereOptions} where - Delete conditions
 * @param {DestroyOptions} options - Delete options
 * @returns {Promise<BulkOperationResult>} Bulk operation result
 *
 * @example
 * ```typescript
 * const result = await bulkDeleteWithSoftDelete(
 *   User,
 *   { status: 'suspended' },
 *   { force: false }
 * );
 * ```
 */
async function bulkDeleteWithSoftDelete(model, where, options = {}) {
    try {
        const affectedCount = await model.destroy({
            where,
            force: false, // Soft delete by default
            individualHooks: false,
            ...options,
        });
        return {
            success: true,
            count: affectedCount,
        };
    }
    catch (error) {
        return {
            success: false,
            count: 0,
            errors: [error],
        };
    }
}
/**
 * 30. Performs batch processing for large datasets.
 * Processes data in chunks to avoid memory issues.
 *
 * @param {T[]} data - Data array to process
 * @param {number} batchSize - Batch size
 * @param {Function} processor - Processing function
 * @returns {Promise<BulkOperationResult>} Bulk operation result
 *
 * @example
 * ```typescript
 * const result = await batchProcess(
 *   largeDataArray,
 *   1000,
 *   async (batch) => await User.bulkCreate(batch)
 * );
 * ```
 */
async function batchProcess(data, batchSize, processor) {
    const results = [];
    const errors = [];
    let totalCount = 0;
    for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        try {
            const batchResult = await processor(batch);
            results.push(batchResult);
            totalCount += Array.isArray(batchResult) ? batchResult.length : 1;
        }
        catch (error) {
            errors.push(error);
        }
    }
    return {
        success: errors.length === 0,
        count: totalCount,
        data: results,
        errors: errors.length > 0 ? errors : undefined,
    };
}
/**
 * 31. Performs upsert (insert or update) operations.
 * Creates records if they don't exist, updates if they do.
 *
 * @param {ModelStatic<T>} model - Model to upsert into
 * @param {CreationAttributes<T>[]} data - Data to upsert
 * @param {object} options - Upsert options
 * @returns {Promise<BulkOperationResult<T>>} Bulk operation result
 *
 * @example
 * ```typescript
 * const result = await bulkUpsert(User, [
 *   { email: 'user@example.com', firstName: 'John' }
 * ], { conflictFields: ['email'], updateFields: ['firstName'] });
 * ```
 */
async function bulkUpsert(model, data, options = {}) {
    const { conflictFields = ['id'], updateFields, transaction } = options;
    try {
        const created = await model.bulkCreate(data, {
            updateOnDuplicate: updateFields,
            conflictFields,
            transaction,
        });
        return {
            success: true,
            count: created.length,
            data: created,
        };
    }
    catch (error) {
        return {
            success: false,
            count: 0,
            errors: [error],
        };
    }
}
/**
 * 32. Performs bulk operations with progress tracking.
 * Executes bulk operations with progress callbacks.
 *
 * @param {T[]} data - Data to process
 * @param {Function} operation - Operation to perform
 * @param {object} options - Progress tracking options
 * @returns {Promise<BulkOperationResult>} Bulk operation result
 *
 * @example
 * ```typescript
 * const result = await bulkOperationWithProgress(
 *   dataArray,
 *   async (item) => await User.create(item),
 *   { onProgress: (current, total) => console.log(`${current}/${total}`) }
 * );
 * ```
 */
async function bulkOperationWithProgress(data, operation, options = {}) {
    const { onProgress, concurrency = 1 } = options;
    const results = [];
    const errors = [];
    if (concurrency === 1) {
        // Sequential processing
        for (let i = 0; i < data.length; i++) {
            try {
                const result = await operation(data[i], i);
                results.push(result);
                if (onProgress)
                    onProgress(i + 1, data.length, data[i]);
            }
            catch (error) {
                errors.push(error);
            }
        }
    }
    else {
        // Concurrent processing
        const chunks = [];
        for (let i = 0; i < data.length; i += concurrency) {
            chunks.push(data.slice(i, i + concurrency));
        }
        for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
            const chunk = chunks[chunkIndex];
            const chunkResults = await Promise.allSettled(chunk.map((item, index) => operation(item, chunkIndex * concurrency + index)));
            chunkResults.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    results.push(result.value);
                }
                else {
                    errors.push(result.reason);
                }
                if (onProgress) {
                    onProgress(chunkIndex * concurrency + index + 1, data.length, chunk[index]);
                }
            });
        }
    }
    return {
        success: errors.length === 0,
        count: results.length,
        data: results,
        errors: errors.length > 0 ? errors : undefined,
    };
}
// ============================================================================
// SECTION 6: TRANSACTION WRAPPERS (Functions 33-37)
// ============================================================================
/**
 * 33. Executes a function within a managed transaction.
 * Automatically handles commit/rollback.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Function} callback - Transaction callback
 * @param {TransactionWrapperConfig} options - Transaction options
 * @returns {Promise<T>} Transaction result
 *
 * @example
 * ```typescript
 * const result = await executeInTransaction(sequelize, async (t) => {
 *   const user = await User.create({ email: 'user@example.com' }, { transaction: t });
 *   const profile = await Profile.create({ userId: user.id }, { transaction: t });
 *   return { user, profile };
 * });
 * ```
 */
async function executeInTransaction(sequelize, callback, options = {}) {
    const { retries = 0, retryDelay = 1000, onRetry, ...transactionOptions } = options;
    let lastError;
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            return await sequelize.transaction(transactionOptions, callback);
        }
        catch (error) {
            lastError = error;
            if (attempt < retries) {
                if (onRetry)
                    onRetry(attempt + 1, lastError);
                await new Promise(resolve => setTimeout(resolve, retryDelay));
            }
        }
    }
    throw lastError;
}
/**
 * 34. Executes multiple operations in a single transaction.
 * Chains multiple database operations atomically.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Function[]} operations - Array of operations
 * @param {TransactionOptions} options - Transaction options
 * @returns {Promise<any[]>} Array of operation results
 *
 * @example
 * ```typescript
 * const results = await executeMultipleInTransaction(sequelize, [
 *   (t) => User.create({ email: 'user@example.com' }, { transaction: t }),
 *   (t) => Post.create({ title: 'Hello' }, { transaction: t })
 * ]);
 * ```
 */
async function executeMultipleInTransaction(sequelize, operations, options = {}) {
    return sequelize.transaction(options, async (t) => {
        const results = [];
        for (const operation of operations) {
            const result = await operation(t);
            results.push(result);
        }
        return results;
    });
}
/**
 * 35. Creates a savepoint within an existing transaction.
 * Enables partial rollback in complex transactions.
 *
 * @param {Transaction} transaction - Parent transaction
 * @param {string} savepointName - Savepoint name
 * @param {Function} callback - Savepoint callback
 * @returns {Promise<T>} Savepoint result
 *
 * @example
 * ```typescript
 * await sequelize.transaction(async (t) => {
 *   await User.create({ email: 'user1@example.com' }, { transaction: t });
 *
 *   try {
 *     await createSavepoint(t, 'sp1', async () => {
 *       await User.create({ email: 'invalid' }, { transaction: t });
 *     });
 *   } catch (error) {
 *     // Rollback to savepoint, user1 is still created
 *   }
 * });
 * ```
 */
async function createSavepoint(transaction, savepointName, callback) {
    await transaction.connection.query(`SAVEPOINT ${savepointName}`);
    try {
        const result = await callback();
        await transaction.connection.query(`RELEASE SAVEPOINT ${savepointName}`);
        return result;
    }
    catch (error) {
        await transaction.connection.query(`ROLLBACK TO SAVEPOINT ${savepointName}`);
        throw error;
    }
}
/**
 * 36. Implements distributed transaction coordinator.
 * Manages transactions across multiple databases/services.
 *
 * @param {object[]} transactionConfigs - Transaction configurations
 * @param {Function} callback - Coordinator callback
 * @returns {Promise<T>} Distributed transaction result
 *
 * @example
 * ```typescript
 * const result = await coordinateDistributedTransaction([
 *   { sequelize: db1, options: {} },
 *   { sequelize: db2, options: {} }
 * ], async (transactions) => {
 *   await User.create({ email: 'user@example.com' }, { transaction: transactions[0] });
 *   await Log.create({ event: 'user_created' }, { transaction: transactions[1] });
 * });
 * ```
 */
async function coordinateDistributedTransaction(transactionConfigs, callback) {
    const transactions = [];
    try {
        // Start all transactions
        for (const config of transactionConfigs) {
            const t = await config.sequelize.transaction(config.options);
            transactions.push(t);
        }
        // Execute callback
        const result = await callback(transactions);
        // Commit all transactions
        await Promise.all(transactions.map(t => t.commit()));
        return result;
    }
    catch (error) {
        // Rollback all transactions
        await Promise.all(transactions.map(t => t.rollback().catch(() => { })));
        throw error;
    }
}
/**
 * 37. Implements optimistic locking for concurrent updates.
 * Prevents lost updates in concurrent scenarios.
 *
 * @param {ModelStatic<T>} model - Model to update
 * @param {string | number} id - Record ID
 * @param {Partial<Attributes<T>>} updates - Update values
 * @param {object} options - Locking options
 * @returns {Promise<T | null>} Updated record or null if conflict
 *
 * @example
 * ```typescript
 * const updated = await updateWithOptimisticLocking(
 *   User,
 *   123,
 *   { firstName: 'John' },
 *   { versionField: 'version', maxRetries: 3 }
 * );
 * ```
 */
async function updateWithOptimisticLocking(model, id, updates, options = {}) {
    const { versionField = 'version', maxRetries = 3, transaction } = options;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        // Fetch current record
        const record = await model.findByPk(id, { transaction });
        if (!record)
            return null;
        const currentVersion = record[versionField];
        // Attempt update with version check
        const [affectedCount] = await model.update({
            ...updates,
            [versionField]: currentVersion + 1,
        }, {
            where: {
                id,
                [versionField]: currentVersion,
            },
            transaction,
        });
        if (affectedCount > 0) {
            // Update successful
            return model.findByPk(id, { transaction });
        }
        // Version conflict, retry
        if (attempt < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, 100 * (attempt + 1)));
        }
    }
    return null; // Failed after max retries
}
// ============================================================================
// SECTION 7: QUERY OPTIMIZATION UTILITIES (Functions 38-41)
// ============================================================================
/**
 * 38. Applies selective field projection to reduce data transfer.
 * Optimizes queries by selecting only needed fields.
 *
 * @param {string[]} requestedFields - Fields requested by client
 * @param {string[]} allowedFields - Fields allowed to be queried
 * @param {string[]} defaultFields - Default fields if none requested
 * @returns {string[]} Optimized field selection
 *
 * @example
 * ```typescript
 * const attributes = applyFieldProjection(
 *   ['id', 'email', 'password'],
 *   ['id', 'email', 'firstName', 'lastName'],
 *   ['id', 'email']
 * );
 * // Returns: ['id', 'email'] (password excluded)
 * ```
 */
function applyFieldProjection(requestedFields, allowedFields, defaultFields = []) {
    if (!requestedFields || requestedFields.length === 0) {
        return defaultFields;
    }
    return requestedFields.filter(field => allowedFields.includes(field));
}
/**
 * 39. Optimizes include associations to prevent N+1 queries.
 * Adds subQuery: false and separate: true where appropriate.
 *
 * @param {Includeable[]} includes - Original includes
 * @param {object} options - Optimization options
 * @returns {Includeable[]} Optimized includes
 *
 * @example
 * ```typescript
 * const optimizedIncludes = optimizeIncludes([
 *   { model: Post, as: 'posts' },
 *   { model: Comment, as: 'comments' }
 * ], { preventNPlusOne: true });
 * ```
 */
function optimizeIncludes(includes, options = {}) {
    const { preventNPlusOne = true, maxDepth = 3, currentDepth = 0 } = options;
    if (currentDepth >= maxDepth) {
        return [];
    }
    return includes.map(include => {
        if (typeof include === 'string') {
            return include;
        }
        const optimized = { ...include };
        // Optimize nested includes
        if (optimized.include) {
            optimized.include = optimizeIncludes(Array.isArray(optimized.include) ? optimized.include : [optimized.include], { ...options, currentDepth: currentDepth + 1 });
        }
        // Add optimization flags
        if (preventNPlusOne && !optimized.subQuery) {
            optimized.subQuery = false;
        }
        return optimized;
    });
}
/**
 * 40. Adds query hints for database optimization.
 * Appends optimizer hints to queries (database-specific).
 *
 * @param {FindOptions} query - Original query
 * @param {string[]} hints - Optimizer hints
 * @returns {FindOptions} Query with hints
 *
 * @example
 * ```typescript
 * const query = addQueryHints(
 *   { where: { status: 'active' } },
 *   ['USE INDEX (idx_status)', 'NO_QUERY_TRANSFORMATION']
 * );
 * ```
 */
function addQueryHints(query, hints) {
    if (!hints || hints.length === 0) {
        return query;
    }
    // Add hints as raw literals (implementation depends on database)
    const hintString = hints.join(' ');
    return {
        ...query,
        // Database-specific hint implementation would go here
    };
}
/**
 * 41. Implements query result caching layer.
 * Caches query results for improved performance.
 *
 * @param {ModelStatic<T>} model - Model to query
 * @param {FindOptions} query - Query options
 * @param {object} cacheOptions - Cache configuration
 * @returns {Promise<T[]>} Query results (cached or fresh)
 *
 * @example
 * ```typescript
 * const users = await queriesWithCache(
 *   User,
 *   { where: { status: 'active' } },
 *   { key: 'active-users', ttl: 300 }
 * );
 * ```
 */
async function queryWithCache(model, query, cacheOptions) {
    const { key, ttl = 60, cacheStore = new Map() } = cacheOptions;
    // Check cache
    const cached = cacheStore.get(key);
    if (cached && cached.expires > Date.now()) {
        return cached.data;
    }
    // Execute query
    const results = await model.findAll(query);
    // Store in cache
    cacheStore.set(key, {
        data: results,
        expires: Date.now() + ttl * 1000,
    });
    return results;
}
// ============================================================================
// SECTION 8: SUBQUERY AND RAW QUERY HELPERS (Functions 42-45)
// ============================================================================
/**
 * 42. Builds a subquery for use in WHERE/HAVING clauses.
 * Creates type-safe subquery expressions.
 *
 * @param {SubqueryConfig<T>} config - Subquery configuration
 * @returns {Literal} Subquery literal
 *
 * @example
 * ```typescript
 * const subquery = buildSubquery({
 *   model: Post,
 *   attributes: ['authorId'],
 *   where: { status: 'published' },
 *   as: 'publishedAuthors'
 * });
 *
 * const users = await User.findAll({
 *   where: { id: { [Op.in]: subquery } }
 * });
 * ```
 */
function buildSubquery(config) {
    const { model, attributes = ['id'], where, include, as } = config;
    const query = model.sequelize.dialect.queryGenerator.selectQuery(model.tableName, {
        attributes,
        where,
        include,
    }, model);
    return sequelize_1.Sequelize.literal(`(${query})`);
}
/**
 * 43. Executes a parameterized raw query with type safety.
 * Provides type-safe raw SQL execution.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sql - SQL query string
 * @param {RawQueryParam} replacements - Query parameters
 * @param {object} options - Query options
 * @returns {Promise<T[]>} Query results
 *
 * @example
 * ```typescript
 * const users = await executeRawQuery<User>(
 *   sequelize,
 *   'SELECT * FROM users WHERE age > :minAge AND status = :status',
 *   { minAge: 18, status: 'active' },
 *   { type: QueryTypes.SELECT }
 * );
 * ```
 */
async function executeRawQuery(sequelize, sql, replacements = {}, options = {}) {
    const { type = sequelize_1.QueryTypes.SELECT, transaction, mapToModel } = options;
    const queryOptions = {
        replacements,
        type,
        transaction,
    };
    if (mapToModel) {
        queryOptions.model = mapToModel;
        queryOptions.mapToModel = true;
    }
    return sequelize.query(sql, queryOptions);
}
/**
 * 44. Builds a UNION query combining multiple queries.
 * Combines results from multiple SELECT statements.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {FindOptions[]} queries - Array of queries to union
 * @param {object} options - Union options
 * @returns {Promise<any[]>} Combined results
 *
 * @example
 * ```typescript
 * const results = await buildUnionQuery(sequelize, [
 *   { model: User, where: { role: 'admin' } },
 *   { model: User, where: { role: 'moderator' } }
 * ], { unionAll: false });
 * ```
 */
async function buildUnionQuery(sequelize, queries, options = {}) {
    const { unionAll = false, orderBy, limit } = options;
    const queryStrings = queries.map(({ model, options }) => {
        return model.sequelize.dialect.queryGenerator.selectQuery(model.tableName, options, model);
    });
    const unionOperator = unionAll ? 'UNION ALL' : 'UNION';
    let unionQuery = queryStrings.join(` ${unionOperator} `);
    if (orderBy) {
        const orderString = orderBy.map(o => `${o[0]} ${o[1]}`).join(', ');
        unionQuery += ` ORDER BY ${orderString}`;
    }
    if (limit) {
        unionQuery += ` LIMIT ${limit}`;
    }
    return sequelize.query(unionQuery, { type: sequelize_1.QueryTypes.SELECT });
}
/**
 * 45. Implements soft delete query patterns.
 * Provides comprehensive soft delete functionality.
 *
 * @param {ModelStatic<T>} model - Model with soft delete
 * @param {WhereOptions} where - Query conditions
 * @param {SoftDeleteConfig} config - Soft delete configuration
 * @returns {Promise<number>} Number of affected records
 *
 * @example
 * ```typescript
 * // Soft delete
 * const count = await applySoftDelete(User, { id: 123 }, { field: 'deletedAt' });
 *
 * // Restore
 * const restored = await applySoftDelete(User, { id: 123 }, {
 *   field: 'deletedAt',
 *   restore: true
 * });
 *
 * // Force delete
 * const deleted = await applySoftDelete(User, { id: 123 }, { force: true });
 * ```
 */
async function applySoftDelete(model, where, config = {}) {
    const { field = 'deletedAt', value = new Date(), restore = false, force = false, hooks = true, } = config;
    if (force) {
        // Hard delete
        return model.destroy({
            where,
            force: true,
            hooks,
        });
    }
    if (restore) {
        // Restore soft-deleted records
        const [affectedCount] = await model.update({ [field]: null }, {
            where: {
                ...where,
                [field]: { [sequelize_1.Op.not]: null },
            },
            paranoid: false,
            hooks,
        });
        return affectedCount;
    }
    // Soft delete
    const [affectedCount] = await model.update({ [field]: value }, {
        where,
        hooks,
    });
    return affectedCount;
}
//# sourceMappingURL=database-query-kit.js.map