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
import { Model, ModelStatic, Sequelize, Op, WhereOptions, FindOptions, Order, Includeable, Attributes, CreationAttributes, Transaction, TransactionOptions, BulkCreateOptions, UpdateOptions, DestroyOptions, QueryTypes, Literal, GroupOption } from 'sequelize';
/**
 * Dynamic query builder configuration
 */
export interface QueryBuilderConfig<T extends Model = Model> {
    where?: WhereOptions<Attributes<T>>;
    include?: Includeable[];
    order?: Order;
    limit?: number;
    offset?: number;
    attributes?: string[] | {
        include?: string[];
        exclude?: string[];
    };
    group?: GroupOption;
    having?: WhereOptions;
    subQuery?: boolean;
    distinct?: boolean;
    paranoid?: boolean;
    raw?: boolean;
    transaction?: Transaction;
}
/**
 * Pagination configuration for cursor-based pagination
 */
export interface CursorPaginationConfig {
    cursor?: string;
    limit?: number;
    cursorField?: string;
    direction?: 'forward' | 'backward';
    decode?: (cursor: string) => any;
    encode?: (value: any) => string;
}
/**
 * Pagination configuration for offset-based pagination
 */
export interface OffsetPaginationConfig {
    page?: number;
    pageSize?: number;
    offset?: number;
    limit?: number;
}
/**
 * Paginated result wrapper
 */
export interface PaginatedResult<T> {
    data: T[];
    pagination: {
        total?: number;
        page?: number;
        pageSize?: number;
        totalPages?: number;
        hasNext?: boolean;
        hasPrev?: boolean;
        nextCursor?: string;
        prevCursor?: string;
    };
}
/**
 * Filter configuration for dynamic filtering
 */
export interface FilterConfig {
    field: string;
    operator: keyof typeof Op;
    value: any;
    type?: 'string' | 'number' | 'boolean' | 'date' | 'array';
}
/**
 * Sort configuration
 */
export interface SortConfig {
    field: string;
    direction: 'ASC' | 'DESC' | 'NULLS FIRST' | 'NULLS LAST';
    nulls?: 'first' | 'last';
    collate?: string;
}
/**
 * Bulk operation result
 */
export interface BulkOperationResult<T = any> {
    success: boolean;
    count: number;
    data?: T[];
    errors?: Error[];
    affectedIds?: (string | number)[];
}
/**
 * Transaction wrapper configuration
 */
export interface TransactionWrapperConfig extends TransactionOptions {
    retries?: number;
    retryDelay?: number;
    onRetry?: (attempt: number, error: Error) => void;
}
/**
 * Subquery configuration
 */
export interface SubqueryConfig<T extends Model = Model> {
    model: ModelStatic<T>;
    attributes?: string[];
    where?: WhereOptions<Attributes<T>>;
    include?: Includeable[];
    as?: string;
}
/**
 * Raw query parameter
 */
export interface RawQueryParam {
    [key: string]: any;
}
/**
 * Soft delete configuration
 */
export interface SoftDeleteConfig {
    field?: string;
    value?: any;
    restore?: boolean;
    force?: boolean;
    hooks?: boolean;
}
/**
 * Join configuration
 */
export interface JoinConfig {
    model: ModelStatic<Model>;
    as?: string;
    on?: WhereOptions;
    required?: boolean;
    attributes?: string[];
    include?: JoinConfig[];
}
/**
 * Aggregation configuration
 */
export interface AggregationConfig {
    function: 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX';
    field: string;
    as?: string;
    distinct?: boolean;
    group?: string[];
    having?: WhereOptions;
}
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
export declare function buildComplexQuery<T extends Model>(config: QueryBuilderConfig<T>): FindOptions<Attributes<T>>;
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
export declare function buildConditionalIncludes(baseIncludes: Includeable[], conditionalIncludes: Record<string, boolean | Includeable>): Includeable[];
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
export declare function buildNestedRelationQuery<T extends Model>(model: ModelStatic<T>, relationPath: string[], maxDepth?: number): Includeable[];
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
export declare function buildPolymorphicQuery(targetType: string, targetId: string | number, typeField?: string, idField?: string): WhereOptions;
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
export declare function buildFullTextSearchQuery(fields: string[], searchTerm: string, options?: {
    caseSensitive?: boolean;
    exactMatch?: boolean;
    usePostgresFullText?: boolean;
}): WhereOptions;
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
export declare function buildTemporalQuery(field: string, timeRange: {
    start?: Date;
    end?: Date;
    before?: Date;
    after?: Date;
    inclusive?: boolean;
}): WhereOptions;
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
export declare function buildGeospatialQuery(config: {
    field: string;
    latitude: number;
    longitude: number;
    radiusKm?: number;
    boundingBox?: {
        north: number;
        south: number;
        east: number;
        west: number;
    };
}): WhereOptions;
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
export declare function buildHierarchicalQuery<T extends Model>(model: ModelStatic<T>, rootId: string | number, options?: {
    parentField?: string;
    maxDepth?: number;
    includeRoot?: boolean;
}): FindOptions;
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
export declare function buildDynamicWhere(filters: FilterConfig[]): WhereOptions;
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
export declare function mergeWhereConditions(whereClauses: WhereOptions[], operator?: 'and' | 'or'): WhereOptions;
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
export declare function buildCaseInsensitiveWhere(field: string, value: string | string[], exact?: boolean): WhereOptions;
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
export declare function buildNullSafeWhere(field: string, value: any, options?: {
    includeNull?: boolean;
    excludeNull?: boolean;
    treatNullAs?: any;
}): WhereOptions;
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
export declare function buildRangeWhere(field: string, range: {
    min?: number | Date;
    max?: number | Date;
    inclusive?: boolean;
}): WhereOptions;
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
export declare function buildJsonFieldQuery(field: string, path: string, value: any, operator?: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains'): WhereOptions;
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
export declare function paginateWithCursor<T extends Model>(model: ModelStatic<T>, config: CursorPaginationConfig, baseQuery?: FindOptions): Promise<PaginatedResult<T>>;
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
export declare function paginateWithOffset<T extends Model>(model: ModelStatic<T>, config: OffsetPaginationConfig, baseQuery?: FindOptions): Promise<PaginatedResult<T>>;
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
export declare function paginateWithKeyset<T extends Model>(model: ModelStatic<T>, config: {
    keys?: Record<string, any>;
    limit?: number;
    keyFields?: string[];
    direction?: 'forward' | 'backward';
}, baseQuery?: FindOptions): Promise<PaginatedResult<T>>;
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
export declare function calculateOptimalPageSize(config: {
    totalRecords?: number;
    averageRecordSize?: number;
    targetResponseTime?: number;
    minPageSize?: number;
    maxPageSize?: number;
}): number;
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
export declare function generatePaginationMetadata(config: {
    total?: number;
    page?: number;
    pageSize?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
    baseUrl?: string;
    queryParams?: Record<string, any>;
}): {
    total?: number;
    page?: number;
    pageSize?: number;
    totalPages?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
    links?: {
        first?: string;
        prev?: string;
        next?: string;
        last?: string;
    };
};
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
export declare function convertPaginationStrategy(config: {
    from: 'cursor' | 'offset';
    to: 'cursor' | 'offset';
    cursor?: string;
    offset?: number;
    page?: number;
    pageSize?: number;
}): {
    cursor?: string;
    offset?: number;
    page?: number;
};
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
export declare function buildDynamicSort(sortConfigs: SortConfig[]): Order;
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
export declare function parseSortParam(sortParam: string, allowedFields?: string[]): Order;
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
export declare function buildMultiFieldFilter(queryParams: Record<string, any>, fieldMappings?: Record<string, string>): WhereOptions;
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
export declare function applyFacetedFilters(facets: Record<string, any[]>, operator?: 'and' | 'or'): WhereOptions;
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
export declare function validateAndSanitizeFilters(filters: FilterConfig[], rules?: Record<string, {
    type?: string;
    allowedOperators?: string[];
    min?: number;
    max?: number;
    pattern?: RegExp;
}>): FilterConfig[];
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
export declare function buildSearchSuggestions<T extends Model>(model: ModelStatic<T>, field: string, partial: string, options?: {
    limit?: number;
    caseSensitive?: boolean;
    minLength?: number;
}): Promise<string[]>;
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
export declare function bulkCreateWithValidation<T extends Model>(model: ModelStatic<T>, data: CreationAttributes<T>[], options?: BulkCreateOptions<Attributes<T>>): Promise<BulkOperationResult<T>>;
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
export declare function bulkUpdateWithConditions<T extends Model>(model: ModelStatic<T>, updates: Partial<Attributes<T>>, where: WhereOptions<Attributes<T>>, options?: UpdateOptions<Attributes<T>>): Promise<BulkOperationResult>;
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
export declare function bulkDeleteWithSoftDelete<T extends Model>(model: ModelStatic<T>, where: WhereOptions<Attributes<T>>, options?: DestroyOptions<Attributes<T>>): Promise<BulkOperationResult>;
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
export declare function batchProcess<T>(data: T[], batchSize: number, processor: (batch: T[]) => Promise<any>): Promise<BulkOperationResult>;
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
export declare function bulkUpsert<T extends Model>(model: ModelStatic<T>, data: CreationAttributes<T>[], options?: {
    conflictFields?: string[];
    updateFields?: string[];
    transaction?: Transaction;
}): Promise<BulkOperationResult<T>>;
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
export declare function bulkOperationWithProgress<T>(data: T[], operation: (item: T, index: number) => Promise<any>, options?: {
    onProgress?: (current: number, total: number, item?: T) => void;
    concurrency?: number;
}): Promise<BulkOperationResult>;
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
export declare function executeInTransaction<T>(sequelize: Sequelize, callback: (transaction: Transaction) => Promise<T>, options?: TransactionWrapperConfig): Promise<T>;
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
export declare function executeMultipleInTransaction(sequelize: Sequelize, operations: ((transaction: Transaction) => Promise<any>)[], options?: TransactionOptions): Promise<any[]>;
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
export declare function createSavepoint<T>(transaction: Transaction, savepointName: string, callback: () => Promise<T>): Promise<T>;
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
export declare function coordinateDistributedTransaction<T>(transactionConfigs: Array<{
    sequelize: Sequelize;
    options?: TransactionOptions;
}>, callback: (transactions: Transaction[]) => Promise<T>): Promise<T>;
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
export declare function updateWithOptimisticLocking<T extends Model>(model: ModelStatic<T>, id: string | number, updates: Partial<Attributes<T>>, options?: {
    versionField?: string;
    maxRetries?: number;
    transaction?: Transaction;
}): Promise<T | null>;
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
export declare function applyFieldProjection(requestedFields: string[], allowedFields: string[], defaultFields?: string[]): string[];
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
export declare function optimizeIncludes(includes: Includeable[], options?: {
    preventNPlusOne?: boolean;
    maxDepth?: number;
    currentDepth?: number;
}): Includeable[];
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
export declare function addQueryHints(query: FindOptions, hints: string[]): FindOptions;
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
export declare function queryWithCache<T extends Model>(model: ModelStatic<T>, query: FindOptions, cacheOptions: {
    key: string;
    ttl?: number;
    cacheStore?: Map<string, {
        data: any;
        expires: number;
    }>;
}): Promise<T[]>;
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
export declare function buildSubquery<T extends Model>(config: SubqueryConfig<T>): Literal;
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
export declare function executeRawQuery<T = any>(sequelize: Sequelize, sql: string, replacements?: RawQueryParam, options?: {
    type?: QueryTypes;
    transaction?: Transaction;
    mapToModel?: ModelStatic<Model>;
}): Promise<T[]>;
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
export declare function buildUnionQuery(sequelize: Sequelize, queries: Array<{
    model: ModelStatic<Model>;
    options: FindOptions;
}>, options?: {
    unionAll?: boolean;
    orderBy?: Order;
    limit?: number;
}): Promise<any[]>;
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
export declare function applySoftDelete<T extends Model>(model: ModelStatic<T>, where: WhereOptions<Attributes<T>>, config?: SoftDeleteConfig): Promise<number>;
//# sourceMappingURL=database-query-kit.d.ts.map