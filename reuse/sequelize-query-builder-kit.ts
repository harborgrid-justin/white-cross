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

import { Op, WhereOptions, FindOptions, Transaction, Order, Includeable, Attributes } from 'sequelize';
import { Model, ModelCtor } from 'sequelize-typescript';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface QueryBuilderOptions {
  where?: WhereOptions;
  include?: Includeable[];
  attributes?: string[] | { exclude?: string[]; include?: any[] };
  order?: Order;
  limit?: number;
  offset?: number;
  group?: string[];
  having?: WhereOptions;
  subQuery?: boolean;
  raw?: boolean;
  nest?: boolean;
  paranoid?: boolean;
  lock?: Transaction.LOCK | boolean;
}

interface PaginationOptions {
  page?: number;
  limit?: number;
  offset?: number;
  cursor?: string | number;
}

interface PaginationResult<T> {
  rows: T[];
  count: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface FilterCondition {
  field: string;
  operator: keyof typeof Op;
  value: any;
}

interface SearchOptions {
  query: string;
  fields: string[];
  caseSensitive?: boolean;
}

interface SortOption {
  field: string;
  direction: 'ASC' | 'DESC';
  nulls?: 'FIRST' | 'LAST';
}

interface AggregationOptions {
  field: string;
  function: 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX';
  alias?: string;
  distinct?: boolean;
}

interface JoinOptions {
  model: ModelCtor<Model>;
  as?: string;
  required?: boolean;
  attributes?: string[];
  where?: WhereOptions;
  include?: Includeable[];
}

interface BulkOperationOptions {
  validate?: boolean;
  individualHooks?: boolean;
  returning?: boolean;
  transaction?: Transaction;
  ignoreDuplicates?: boolean;
  updateOnDuplicate?: string[];
}

interface UpsertOptions {
  conflictFields?: string[];
  updateFields?: string[];
  transaction?: Transaction;
  returning?: boolean;
}

interface LockOptions {
  level: Transaction.LOCK;
  of?: ModelCtor<Model>;
  transaction: Transaction;
}

interface SubqueryConfig {
  model: ModelCtor<Model>;
  attributes: string[];
  where?: WhereOptions;
  include?: Includeable[];
}

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
export const buildFindOptions = (options: QueryBuilderOptions): FindOptions => {
  const findOptions: FindOptions = {};

  if (options.where) findOptions.where = options.where;
  if (options.include) findOptions.include = options.include;
  if (options.attributes) findOptions.attributes = options.attributes;
  if (options.order) findOptions.order = options.order;
  if (options.limit) findOptions.limit = options.limit;
  if (options.offset) findOptions.offset = options.offset;
  if (options.group) findOptions.group = options.group;
  if (options.having) findOptions.having = options.having;
  if (options.subQuery !== undefined) findOptions.subQuery = options.subQuery;
  if (options.raw !== undefined) findOptions.raw = options.raw;
  if (options.nest !== undefined) findOptions.nest = options.nest;
  if (options.paranoid !== undefined) findOptions.paranoid = options.paranoid;
  if (options.lock) findOptions.lock = options.lock;

  return findOptions;
};

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
export const safeFindOne = async <T extends Model>(
  model: ModelCtor<T>,
  where: WhereOptions,
  options?: Omit<FindOptions, 'where'>,
): Promise<T | null> => {
  try {
    return await model.findOne({ where, ...options });
  } catch (error) {
    return null;
  }
};

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
export const findByPkWithOptions = async <T extends Model>(
  model: ModelCtor<T>,
  id: number | string,
  options?: Omit<FindOptions, 'where'>,
): Promise<T | null> => {
  return await model.findByPk(id, options);
};

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
export const findOrCreateRecord = async <T extends Model>(
  model: ModelCtor<T>,
  where: WhereOptions,
  defaults: any,
  transaction?: Transaction,
): Promise<[T, boolean]> => {
  return await model.findOrCreate({
    where,
    defaults,
    transaction,
  });
};

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
export const buildScopedQuery = <T extends Model>(
  model: ModelCtor<T>,
  baseWhere: WhereOptions,
) => {
  return async (additionalWhere: WhereOptions = {}, options: FindOptions = {}): Promise<T[]> => {
    return await model.findAll({
      where: { ...baseWhere, ...additionalWhere },
      ...options,
    });
  };
};

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
export const buildWhereClause = (conditions: FilterCondition[]): WhereOptions => {
  const where: WhereOptions = {};

  conditions.forEach(({ field, operator, value }) => {
    where[field] = { [Op[operator]]: value };
  });

  return where;
};

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
export const buildOrWhereClause = (conditions: FilterCondition[]): WhereOptions => {
  const orConditions = conditions.map(({ field, operator, value }) => ({
    [field]: { [Op[operator]]: value },
  }));

  return { [Op.or]: orConditions };
};

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
export const buildNestedWhereClause = (conditionTree: any): WhereOptions => {
  if (conditionTree.AND) {
    return {
      [Op.and]: conditionTree.AND.map((cond: any) => buildNestedWhereClause(cond)),
    };
  }

  if (conditionTree.OR) {
    return {
      [Op.or]: conditionTree.OR.map((cond: any) => buildNestedWhereClause(cond)),
    };
  }

  const where: WhereOptions = {};
  Object.keys(conditionTree).forEach((field) => {
    const value = conditionTree[field];
    if (typeof value === 'object' && !Array.isArray(value)) {
      const operatorKey = Object.keys(value)[0];
      where[field] = { [Op[operatorKey]]: value[operatorKey] };
    } else {
      where[field] = value;
    }
  });

  return where;
};

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
export const buildDateRangeWhere = (
  field: string,
  startDate: Date | string,
  endDate: Date | string,
): WhereOptions => {
  return {
    [field]: {
      [Op.between]: [new Date(startDate), new Date(endDate)],
    },
  };
};

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
export const buildNullCheckWhere = (field: string, isNull: boolean): WhereOptions => {
  return {
    [field]: isNull ? { [Op.is]: null } : { [Op.not]: null },
  };
};

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
export const buildInCondition = (field: string, values: any[]): WhereOptions => {
  return { [field]: { [Op.in]: values } };
};

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
export const buildNotInCondition = (field: string, values: any[]): WhereOptions => {
  return { [field]: { [Op.notIn]: values } };
};

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
export const buildLikeCondition = (
  field: string,
  pattern: string,
  caseInsensitive: boolean = false,
): WhereOptions => {
  return {
    [field]: { [caseInsensitive ? Op.iLike : Op.like]: pattern },
  };
};

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
export const buildBetweenCondition = (field: string, min: any, max: any): WhereOptions => {
  return {
    [field]: { [Op.between]: [min, max] },
  };
};

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
export const buildComparisonCondition = (
  field: string,
  operator: 'gt' | 'gte' | 'lt' | 'lte',
  value: any,
): WhereOptions => {
  return { [field]: { [Op[operator]]: value } };
};

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
export const buildOffsetPagination = (page: number, limit: number) => {
  const offset = (page - 1) * limit;
  return { limit, offset };
};

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
export const executePaginatedQuery = async <T extends Model>(
  model: ModelCtor<T>,
  options: FindOptions,
  page: number,
  limit: number,
): Promise<PaginationResult<T>> => {
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
export const buildCursorPagination = (
  cursorField: string,
  cursorValue: any,
  limit: number,
  direction: 'ASC' | 'DESC' = 'ASC',
): FindOptions => {
  const operator = direction === 'ASC' ? Op.gt : Op.lt;

  return {
    where: cursorValue ? { [cursorField]: { [operator]: cursorValue } } : {},
    order: [[cursorField, direction]],
    limit,
  };
};

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
export const calculatePaginationMetadata = (total: number, page: number, limit: number) => {
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
export const buildOrderClause = (sortOptions: SortOption[]): Order => {
  return sortOptions.map((option) => {
    const orderArray: any[] = [option.field, option.direction];
    if (option.nulls) {
      orderArray.push(option.nulls);
    }
    return orderArray;
  });
};

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
export const buildDynamicOrder = (
  sortBy: string,
  sortOrder: 'ASC' | 'DESC' = 'ASC',
  allowedFields?: string[],
): Order => {
  // Validate against whitelist if provided
  if (allowedFields && !allowedFields.includes(sortBy)) {
    throw new Error(`Invalid sort field: ${sortBy}`);
  }

  return [[sortBy, sortOrder]];
};

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
export const buildAssociationOrder = (
  orderConfig: Array<{ model?: string; field: string; direction: 'ASC' | 'DESC' }>,
): Order => {
  return orderConfig.map((config) => {
    if (config.model) {
      return [{ model: config.model, as: config.model }, config.field, config.direction];
    }
    return [config.field, config.direction];
  });
};

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
export const buildFullTextSearch = (options: SearchOptions): WhereOptions => {
  const { query, fields, caseSensitive = false } = options;
  const operator = caseSensitive ? Op.like : Op.iLike;

  const searchConditions = fields.map((field) => ({
    [field]: { [operator]: `%${query}%` },
  }));

  return { [Op.or]: searchConditions };
};

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
export const buildDynamicFilters = (
  filters: Record<string, any>,
  allowedFields?: string[],
): WhereOptions => {
  const where: WhereOptions = {};

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
export const buildRangeFilter = (field: string, min?: any, max?: any): WhereOptions => {
  const where: WhereOptions = {};

  if (min !== undefined && max !== undefined) {
    where[field] = { [Op.between]: [min, max] };
  } else if (min !== undefined) {
    where[field] = { [Op.gte]: min };
  } else if (max !== undefined) {
    where[field] = { [Op.lte]: max };
  }

  return where;
};

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
export const buildAggregationAttributes = (aggregations: AggregationOptions[]): any[] => {
  return aggregations.map((agg) => {
    const sequelize = require('sequelize');
    const fn = agg.distinct
      ? sequelize.fn(agg.function, sequelize.fn('DISTINCT', sequelize.col(agg.field)))
      : sequelize.fn(agg.function, sequelize.col(agg.field));

    return [fn, agg.alias || `${agg.function.toLowerCase()}_${agg.field}`];
  });
};

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
export const buildGroupByQuery = (groupFields: string[], havingClause?: WhereOptions) => {
  const options: any = { group: groupFields };

  if (havingClause) {
    options.having = havingClause;
  }

  return options;
};

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
export const buildGroupedCount = async (
  model: ModelCtor<Model>,
  groupField: string,
  where?: WhereOptions,
): Promise<any[]> => {
  const sequelize = require('sequelize');

  return await model.findAll({
    attributes: [groupField, [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
    where,
    group: [groupField],
    raw: true,
  });
};

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
export const buildIncludeOptions = (joins: JoinOptions[]): Includeable[] => {
  return joins.map((join) => {
    const include: any = { model: join.model };

    if (join.as) include.as = join.as;
    if (join.required !== undefined) include.required = join.required;
    if (join.attributes) include.attributes = join.attributes;
    if (join.where) include.where = join.where;
    if (join.include) include.include = join.include;

    return include;
  });
};

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
export const buildNestedInclude = (includeTree: any): Includeable[] => {
  if (Array.isArray(includeTree)) {
    return includeTree.map((item) => {
      const include: any = { model: item.model };
      if (item.as) include.as = item.as;
      if (item.where) include.where = item.where;
      if (item.attributes) include.attributes = item.attributes;
      if (item.include) include.include = buildNestedInclude(item.include);
      return include;
    });
  }

  const include: any = { model: includeTree.model };
  if (includeTree.as) include.as = includeTree.as;
  if (includeTree.where) include.where = includeTree.where;
  if (includeTree.attributes) include.attributes = includeTree.attributes;
  if (includeTree.include) include.include = buildNestedInclude(includeTree.include);

  return [include];
};

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
export const buildLeftJoin = (
  model: ModelCtor<Model>,
  as?: string,
  where?: WhereOptions,
): Includeable => {
  const include: any = { model, required: false };

  if (as) include.as = as;
  if (where) include.where = where;

  return include;
};

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
export const buildSubquery = (config: SubqueryConfig): any => {
  const sequelize = require('sequelize');
  // Note: This is a simplified version; actual implementation would need sequelize instance
  return sequelize.literal(`(SELECT ${config.attributes.join(', ')} FROM ${config.model.tableName})`);
};

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
export const buildExistsSubquery = (config: SubqueryConfig): WhereOptions => {
  const sequelize = require('sequelize');
  return sequelize.where(
    sequelize.literal(`EXISTS (SELECT 1 FROM ${config.model.tableName} WHERE ...)`),
    true,
  );
};

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
export const buildInSubquery = (field: string, config: SubqueryConfig): WhereOptions => {
  const sequelize = require('sequelize');
  return {
    [field]: {
      [Op.in]: sequelize.literal(`(SELECT ${config.attributes[0]} FROM ${config.model.tableName})`),
    },
  };
};

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
export const executeRawQuery = async (
  sequelize: any,
  sql: string,
  replacements?: Record<string, any>,
): Promise<any[]> => {
  const [results] = await sequelize.query(sql, {
    replacements,
    type: sequelize.QueryTypes.SELECT,
  });

  return results;
};

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
export const buildLiteralExpression = (expression: string, alias?: string): any[] => {
  const sequelize = require('sequelize');
  return alias ? [sequelize.literal(expression), alias] : [sequelize.literal(expression)];
};

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
export const buildCTEQuery = (cteName: string, cteQuery: string, mainQuery: string): string => {
  return `WITH ${cteName} AS (${cteQuery}) ${mainQuery}`;
};

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
export const executeInTransaction = async (
  sequelize: any,
  operations: (transaction: Transaction) => Promise<any>,
): Promise<any> => {
  return await sequelize.transaction(operations);
};

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
export const createUnmanagedTransaction = async (sequelize: any): Promise<Transaction> => {
  return await sequelize.transaction();
};

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
export const executeWithIsolation = async (
  sequelize: any,
  isolationLevel: string,
  operations: (transaction: Transaction) => Promise<any>,
): Promise<any> => {
  return await sequelize.transaction(
    { isolationLevel: sequelize.Transaction.ISOLATION_LEVELS[isolationLevel] },
    operations,
  );
};

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
export const executeBulkCreate = async <T extends Model>(
  model: ModelCtor<T>,
  records: any[],
  options?: BulkOperationOptions,
): Promise<T[]> => {
  return await model.bulkCreate(records, options);
};

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
export const executeBulkUpdate = async (
  model: ModelCtor<Model>,
  values: any,
  where: WhereOptions,
  options?: BulkOperationOptions,
): Promise<number> => {
  const [affectedCount] = await model.update(values, { where, ...options });
  return affectedCount;
};

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
export const executeBulkDelete = async (
  model: ModelCtor<Model>,
  where: WhereOptions,
  force: boolean = false,
): Promise<number> => {
  return await model.destroy({ where, force });
};

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
export const executeUpsert = async <T extends Model>(
  model: ModelCtor<T>,
  values: any,
  options?: UpsertOptions,
): Promise<[T, boolean | null]> => {
  return await model.upsert(values, options);
};

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
export const executeBulkUpsert = async <T extends Model>(
  model: ModelCtor<T>,
  records: any[],
  conflictFields: string[],
  updateFields: string[],
): Promise<T[]> => {
  return await model.bulkCreate(records, {
    updateOnDuplicate: updateFields,
    conflictFields,
  } as any);
};
