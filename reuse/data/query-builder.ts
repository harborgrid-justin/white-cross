/**
 * @fileoverview Advanced Query Builder for Sequelize + NestJS
 * @module reuse/data/query-builder
 * @description Production-ready dynamic query construction with type safety,
 * complex joins, subqueries, aggregations, and optimization utilities
 *
 * @version 1.0.0
 * @requires sequelize ^6.x
 * @requires @nestjs/common ^10.x
 */

import { Logger, BadRequestException } from '@nestjs/common';
import {
  Model,
  ModelCtor,
  FindOptions,
  WhereOptions,
  Op,
  Sequelize,
  OrderItem,
  IncludeOptions,
  Attributes,
  Transaction,
  literal,
  fn,
  col,
  where as sequelizeWhere,
  ProjectionAlias,
  GroupOption
} from 'sequelize';

/**
 * Pagination parameters
 */
export interface PaginationOptions {
  page: number;
  limit: number;
  offset?: number;
}

/**
 * Sort options
 */
export interface SortOptions {
  field: string;
  direction: 'ASC' | 'DESC';
  nulls?: 'FIRST' | 'LAST';
}

/**
 * Filter operator types
 */
export enum FilterOperator {
  EQ = 'eq',
  NE = 'ne',
  GT = 'gt',
  GTE = 'gte',
  LT = 'lt',
  LTE = 'lte',
  IN = 'in',
  NOT_IN = 'notIn',
  LIKE = 'like',
  ILIKE = 'iLike',
  NOT_LIKE = 'notLike',
  BETWEEN = 'between',
  IS_NULL = 'isNull',
  NOT_NULL = 'notNull',
  CONTAINS = 'contains',
  CONTAINED = 'contained',
  OVERLAP = 'overlap',
  REGEXP = 'regexp',
}

/**
 * Filter definition
 */
export interface Filter {
  field: string;
  operator: FilterOperator;
  value?: any;
  caseSensitive?: boolean;
}

/**
 * Query builder configuration
 */
export interface QueryBuilderConfig<M extends Model> {
  model: ModelCtor<M>;
  where?: WhereOptions<any>;
  include?: IncludeOptions[];
  order?: OrderItem[];
  attributes?: string[] | { include?: string[]; exclude?: string[] };
  group?: GroupOption;
  having?: WhereOptions<any>;
  limit?: number;
  offset?: number;
  distinct?: boolean;
  subQuery?: boolean;
  transaction?: Transaction;
}

/**
 * Paginated query result
 */
export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Build a basic where clause from filters
 *
 * @param filters - Array of filter definitions
 * @returns Sequelize where options
 */
export function buildWhereClause(filters: Filter[]): WhereOptions<any> {
  const logger = new Logger('QueryBuilder::buildWhereClause');
  const where: WhereOptions<any> = {};

  filters.forEach(filter => {
    try {
      const { field, operator, value, caseSensitive } = filter;

      switch (operator) {
        case FilterOperator.EQ:
          where[field] = value;
          break;

        case FilterOperator.NE:
          where[field] = { [Op.ne]: value };
          break;

        case FilterOperator.GT:
          where[field] = { [Op.gt]: value };
          break;

        case FilterOperator.GTE:
          where[field] = { [Op.gte]: value };
          break;

        case FilterOperator.LT:
          where[field] = { [Op.lt]: value };
          break;

        case FilterOperator.LTE:
          where[field] = { [Op.lte]: value };
          break;

        case FilterOperator.IN:
          where[field] = { [Op.in]: value };
          break;

        case FilterOperator.NOT_IN:
          where[field] = { [Op.notIn]: value };
          break;

        case FilterOperator.LIKE:
          where[field] = caseSensitive
            ? { [Op.like]: value }
            : { [Op.iLike]: value };
          break;

        case FilterOperator.ILIKE:
          where[field] = { [Op.iLike]: value };
          break;

        case FilterOperator.NOT_LIKE:
          where[field] = { [Op.notLike]: value };
          break;

        case FilterOperator.BETWEEN:
          where[field] = { [Op.between]: value };
          break;

        case FilterOperator.IS_NULL:
          where[field] = { [Op.is]: null };
          break;

        case FilterOperator.NOT_NULL:
          where[field] = { [Op.not]: null };
          break;

        case FilterOperator.CONTAINS:
          where[field] = { [Op.contains]: value };
          break;

        case FilterOperator.CONTAINED:
          where[field] = { [Op.contained]: value };
          break;

        case FilterOperator.OVERLAP:
          where[field] = { [Op.overlap]: value };
          break;

        case FilterOperator.REGEXP:
          where[field] = { [Op.regexp]: value };
          break;

        default:
          logger.warn(`Unknown filter operator: ${operator}`);
      }
    } catch (error) {
      logger.error(`Failed to build filter for field ${filter.field}`, error);
    }
  });

  return where;
}

/**
 * Build complex AND/OR where clause
 *
 * @param conditions - Array of where conditions
 * @param operator - Logical operator (AND/OR)
 * @returns Combined where clause
 */
export function buildLogicalWhere(
  conditions: WhereOptions<any>[],
  operator: 'AND' | 'OR' = 'AND'
): WhereOptions<any> {
  if (conditions.length === 0) {
    return {};
  }

  if (conditions.length === 1) {
    return conditions[0];
  }

  const op = operator === 'AND' ? Op.and : Op.or;
  return { [op]: conditions };
}

/**
 * Build date range filter
 *
 * @param field - Date field name
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Date range where clause
 */
export function buildDateRangeFilter(
  field: string,
  startDate?: Date,
  endDate?: Date
): WhereOptions<any> {
  const where: WhereOptions<any> = {};

  if (startDate && endDate) {
    where[field] = { [Op.between]: [startDate, endDate] };
  } else if (startDate) {
    where[field] = { [Op.gte]: startDate };
  } else if (endDate) {
    where[field] = { [Op.lte]: endDate };
  }

  return where;
}

/**
 * Build full-text search filter across multiple fields
 *
 * @param searchTerm - Search term
 * @param fields - Fields to search
 * @param caseSensitive - Case sensitivity
 * @returns Full-text search where clause
 */
export function buildFullTextSearch(
  searchTerm: string,
  fields: string[],
  caseSensitive: boolean = false
): WhereOptions<any> {
  if (!searchTerm || fields.length === 0) {
    return {};
  }

  const searchPattern = `%${searchTerm}%`;
  const operator = caseSensitive ? Op.like : Op.iLike;

  return {
    [Op.or]: fields.map(field => ({
      [field]: { [operator]: searchPattern }
    }))
  };
}

/**
 * Build pagination options
 *
 * @param page - Page number (1-based)
 * @param limit - Items per page
 * @returns Pagination options with offset
 */
export function buildPagination(page: number, limit: number): PaginationOptions {
  const validPage = Math.max(1, page);
  const validLimit = Math.max(1, Math.min(limit, 1000)); // Max 1000 per page

  return {
    page: validPage,
    limit: validLimit,
    offset: (validPage - 1) * validLimit
  };
}

/**
 * Build cursor-based pagination
 *
 * @param cursor - Cursor value (timestamp or ID)
 * @param cursorField - Field to use for cursor
 * @param direction - Pagination direction
 * @param limit - Items per page
 * @returns Where clause and limit for cursor pagination
 */
export function buildCursorPagination(
  cursor: any,
  cursorField: string,
  direction: 'next' | 'prev' = 'next',
  limit: number = 20
): { where: WhereOptions<any>; limit: number; order: OrderItem[] } {
  const where: WhereOptions<any> = {};
  const order: OrderItem[] = [];

  if (cursor) {
    where[cursorField] = direction === 'next'
      ? { [Op.gt]: cursor }
      : { [Op.lt]: cursor };
  }

  order.push([cursorField, direction === 'next' ? 'ASC' : 'DESC']);

  return { where, limit: limit + 1, order }; // +1 to check if there's a next page
}

/**
 * Build order clause from sort options
 *
 * @param sorts - Array of sort options
 * @returns Sequelize order array
 */
export function buildOrderClause(sorts: SortOptions[]): OrderItem[] {
  return sorts.map(sort => {
    const orderItem: OrderItem = [sort.field, sort.direction];

    if (sort.nulls) {
      return [...orderItem, `NULLS ${sort.nulls}`] as OrderItem;
    }

    return orderItem;
  });
}

/**
 * Build include options for associations with N+1 prevention
 *
 * @param associations - Array of association configurations
 * @returns Sequelize include options optimized to prevent N+1 queries
 *
 * @remarks
 * **N+1 Prevention Best Practices:**
 * - Always specify `attributes` to limit columns fetched
 * - Use `required: true` for INNER JOINs (excludes parent if relation is null)
 * - Use `required: false` (default) for LEFT JOINs (includes parent even if relation is null)
 * - Use `separate: true` for hasMany/belongsToMany to prevent row multiplication
 * - Nest includes carefully - each level can multiply queries
 * - Consider using `subQuery: false` in parent query for JOIN-based loading
 *
 * @example
 * ```typescript
 * // Prevent N+1 with proper includes:
 * const includes = buildIncludeOptions([
 *   {
 *     association: 'posts',
 *     required: false, // LEFT JOIN - include users without posts
 *     attributes: ['id', 'title', 'createdAt'], // Limit columns
 *     where: { status: 'published' },
 *     separate: true, // Separate query to avoid row multiplication
 *     nested: [{
 *       association: 'comments',
 *       required: false,
 *       attributes: ['id', 'content'],
 *       separate: true // Nested hasMany should also use separate
 *     }]
 *   },
 *   {
 *     association: 'profile',
 *     required: true, // INNER JOIN - only users with profiles
 *     attributes: ['id', 'firstName', 'lastName'] // Don't fetch all profile fields
 *   }
 * ]);
 *
 * // Use with findAll:
 * const users = await User.findAll({
 *   include: includes,
 *   subQuery: false // Use JOINs for better performance
 * });
 * ```
 */
export function buildIncludeOptions(
  associations: Array<{
    association: string;
    required?: boolean;
    attributes?: string[];
    where?: WhereOptions<any>;
    nested?: any[];
    separate?: boolean; // For hasMany/belongsToMany to prevent row multiplication
  }>
): IncludeOptions[] {
  return associations.map(assoc => {
    const include: IncludeOptions = {
      association: assoc.association,
      required: assoc.required ?? false, // Default to LEFT JOIN
    };

    // Always specify attributes to reduce data transfer
    if (assoc.attributes) {
      include.attributes = assoc.attributes;
    }

    // Add WHERE clause for filtering related records
    if (assoc.where) {
      include.where = assoc.where;
    }

    // Use separate queries for hasMany/belongsToMany to prevent row multiplication
    if (assoc.separate !== undefined) {
      include.separate = assoc.separate;
    }

    // Recursively build nested includes
    if (assoc.nested && assoc.nested.length > 0) {
      include.include = buildIncludeOptions(assoc.nested);
    }

    return include;
  });
}

/**
 * Build attributes selection with inclusion/exclusion
 *
 * @param include - Attributes to include
 * @param exclude - Attributes to exclude
 * @returns Attributes configuration
 */
export function buildAttributes(
  include?: string[],
  exclude?: string[]
): { include?: string[]; exclude?: string[] } | string[] {
  if (!include && !exclude) {
    return [];
  }

  const attributes: { include?: string[]; exclude?: string[] } = {};

  if (include) {
    return include;
  }

  if (exclude) {
    attributes.exclude = exclude;
  }

  return attributes;
}

/**
 * Build subquery for EXISTS check with proper parameterization
 *
 * @param model - Model to query
 * @param where - Where conditions for subquery (use Sequelize Op operators)
 * @param correlationField - Field to correlate with parent query
 * @returns Literal SQL for EXISTS subquery
 * @throws Error if correlation field is invalid
 *
 * @warning This function builds raw SQL. Use model.findAll with includes for safer N+1 prevention.
 *
 * @example
 * ```typescript
 * // Prefer using includes for N+1 prevention:
 * const users = await User.findAll({
 *   include: [{
 *     model: Post,
 *     as: 'posts',
 *     required: true,
 *     where: { status: 'published' }
 *   }]
 * });
 *
 * // Only use EXISTS subquery when includes are not suitable:
 * const existsClause = buildExistsSubquery(Post, { status: 'published' }, 'authorId');
 * ```
 */
export function buildExistsSubquery(
  model: ModelCtor<any>,
  where: WhereOptions<any>,
  correlationField: string
): ReturnType<typeof literal> {
  const logger = new Logger('QueryBuilder::buildExistsSubquery');

  // Validate correlation field to prevent SQL injection
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(correlationField)) {
    throw new Error(`Invalid correlation field name: ${correlationField}`);
  }

  const sequelize = model.sequelize;
  if (!sequelize) {
    throw new Error('Model does not have sequelize instance');
  }

  const tableName = model.getTableName();
  const quotedTableName = sequelize.getQueryInterface().quoteTable(tableName as string);
  const quotedCorrelationField = sequelize.getQueryInterface().quoteIdentifier(correlationField);

  // Build WHERE clause using Sequelize's query generator for safety
  // Note: This is still a simplified version. For production, consider using
  // model.findAll with includes instead to prevent N+1 and ensure type safety.
  const whereConditions = Object.entries(where)
    .map(([key, value]) => {
      const quotedKey = sequelize.getQueryInterface().quoteIdentifier(key);
      // For complex operators, this needs more sophisticated handling
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        return `${quotedKey} = ${sequelize.escape(value)}`;
      } else {
        logger.warn('Complex WHERE conditions in EXISTS subquery may not be properly escaped');
        return `${quotedKey} = ${sequelize.escape(String(value))}`;
      }
    })
    .join(' AND ');

  return literal(`EXISTS (
    SELECT 1 FROM ${quotedTableName}
    WHERE ${quotedCorrelationField} = "${model.name}"."id"
    ${whereConditions ? `AND ${whereConditions}` : ''}
  )`);
}

/**
 * Build IN subquery with proper escaping
 *
 * @param model - Model to query
 * @param selectField - Field to select in subquery
 * @param where - Where conditions (use Sequelize Op operators for safety)
 * @returns Literal SQL for IN subquery
 * @throws Error if field names are invalid
 *
 * @warning For better N+1 prevention and type safety, prefer using:
 * ```typescript
 * where: { id: { [Op.in]: await RelatedModel.findAll({ where, attributes: ['id'], raw: true }) } }
 * ```
 *
 * @example
 * ```typescript
 * // Safer approach using Sequelize operators:
 * const publishedAuthorIds = await Post.findAll({
 *   where: { status: 'published' },
 *   attributes: ['authorId'],
 *   raw: true
 * }).then(posts => posts.map(p => p.authorId));
 *
 * const users = await User.findAll({
 *   where: { id: { [Op.in]: publishedAuthorIds } }
 * });
 * ```
 */
export function buildInSubquery(
  model: ModelCtor<any>,
  selectField: string,
  where: WhereOptions<any>
): ReturnType<typeof literal> {
  const logger = new Logger('QueryBuilder::buildInSubquery');

  // Validate field name to prevent SQL injection
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(selectField)) {
    throw new Error(`Invalid select field name: ${selectField}`);
  }

  const sequelize = model.sequelize;
  if (!sequelize) {
    throw new Error('Model does not have sequelize instance');
  }

  const tableName = model.getTableName();
  const quotedTableName = sequelize.getQueryInterface().quoteTable(tableName as string);
  const quotedSelectField = sequelize.getQueryInterface().quoteIdentifier(selectField);

  // Build WHERE clause with proper escaping
  const whereConditions = Object.entries(where)
    .map(([key, value]) => {
      const quotedKey = sequelize.getQueryInterface().quoteIdentifier(key);
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        return `${quotedKey} = ${sequelize.escape(value)}`;
      } else {
        logger.warn('Complex WHERE conditions in IN subquery may not be properly escaped');
        return `${quotedKey} = ${sequelize.escape(String(value))}`;
      }
    })
    .join(' AND ');

  return literal(`(
    SELECT ${quotedSelectField} FROM ${quotedTableName}
    ${whereConditions ? `WHERE ${whereConditions}` : ''}
  )`);
}

/**
 * Build aggregate query (COUNT, SUM, AVG, MIN, MAX)
 *
 * @param model - Model to aggregate
 * @param aggregateType - Type of aggregation
 * @param field - Field to aggregate
 * @param where - Where conditions
 * @param groupBy - Group by fields
 * @param transaction - Optional transaction
 * @returns Aggregate result
 */
export async function buildAggregateQuery<M extends Model>(
  model: ModelCtor<M>,
  aggregateType: 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX',
  field?: string,
  where?: WhereOptions<any>,
  groupBy?: string[],
  transaction?: Transaction
): Promise<any> {
  const logger = new Logger('QueryBuilder::buildAggregateQuery');

  try {
    const options: any = {
      where,
      transaction,
      raw: true,
    };

    if (groupBy) {
      options.group = groupBy;
      options.attributes = [
        ...groupBy,
        [fn(aggregateType, field ? col(field) : col('*')), 'aggregate']
      ];

      return await model.findAll(options);
    }

    // Single aggregate value
    const aggregateFn = fn(aggregateType, field ? col(field) : col('*'));

    switch (aggregateType) {
      case 'COUNT':
        return await model.count({ where, transaction } as any);

      case 'SUM':
        return await model.sum(field!, { where, transaction } as any);

      case 'MIN':
        return await model.min(field!, { where, transaction } as any);

      case 'MAX':
        return await model.max(field!, { where, transaction } as any);

      case 'AVG':
        const result = await model.findOne({
          attributes: [[fn('AVG', col(field!)), 'average']],
          where,
          transaction,
          raw: true,
        } as any);
        return result ? (result as any).average : null;

      default:
        throw new BadRequestException(`Unknown aggregate type: ${aggregateType}`);
    }
  } catch (error) {
    logger.error(`Aggregate query failed for ${model.name}`, error);
    throw error;
  }
}

/**
 * Build grouped aggregate query
 *
 * @param model - Model to query
 * @param groupBy - Fields to group by
 * @param aggregates - Aggregations to perform
 * @param where - Where conditions
 * @param having - Having conditions
 * @param transaction - Optional transaction
 * @returns Grouped results
 */
export async function buildGroupedAggregate<M extends Model>(
  model: ModelCtor<M>,
  groupBy: string[],
  aggregates: Array<{
    type: 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX';
    field?: string;
    alias: string;
  }>,
  where?: WhereOptions<any>,
  having?: WhereOptions<any>,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('QueryBuilder::buildGroupedAggregate');

  try {
    const attributes: any[] = [...groupBy];

    aggregates.forEach(agg => {
      const aggregateFn = fn(
        agg.type,
        agg.field ? col(agg.field) : col('*')
      );
      attributes.push([aggregateFn, agg.alias]);
    });

    const results = await model.findAll({
      attributes,
      where,
      group: groupBy,
      having,
      transaction,
      raw: true,
    } as any);

    return results;
  } catch (error) {
    logger.error(`Grouped aggregate query failed for ${model.name}`, error);
    throw error;
  }
}

/**
 * Build UNION query
 *
 * @param queries - Array of query configurations
 * @param unionType - UNION or UNION ALL
 * @param sequelize - Sequelize instance
 * @returns Union query results
 */
export async function buildUnionQuery(
  queries: Array<{ query: string; replacements?: any }>,
  unionType: 'UNION' | 'UNION ALL' = 'UNION',
  sequelize: Sequelize
): Promise<any[]> {
  const logger = new Logger('QueryBuilder::buildUnionQuery');

  try {
    const unionQueries = queries.map(q => `(${q.query})`).join(` ${unionType} `);

    const [results] = await sequelize.query(unionQueries, {
      replacements: queries[0]?.replacements,
    });

    return results as any[];
  } catch (error) {
    logger.error('Union query failed', error);
    throw error;
  }
}

/**
 * Build INTERSECT query
 *
 * @param queries - Array of query configurations
 * @param sequelize - Sequelize instance
 * @returns Intersect query results
 */
export async function buildIntersectQuery(
  queries: Array<{ query: string; replacements?: any }>,
  sequelize: Sequelize
): Promise<any[]> {
  const logger = new Logger('QueryBuilder::buildIntersectQuery');

  try {
    const intersectQuery = queries.map(q => `(${q.query})`).join(' INTERSECT ');

    const [results] = await sequelize.query(intersectQuery, {
      replacements: queries[0]?.replacements,
    });

    return results as any[];
  } catch (error) {
    logger.error('Intersect query failed', error);
    throw error;
  }
}

/**
 * Build parameterized raw SQL query
 *
 * @param sql - SQL query with named parameters
 * @param replacements - Parameter replacements
 * @param sequelize - Sequelize instance
 * @returns Query results
 */
export async function buildParameterizedQuery(
  sql: string,
  replacements: Record<string, any>,
  sequelize: Sequelize
): Promise<any[]> {
  const logger = new Logger('QueryBuilder::buildParameterizedQuery');

  try {
    const [results] = await sequelize.query(sql, {
      replacements,
      type: 'SELECT',
    });

    return results as any[];
  } catch (error) {
    logger.error('Parameterized query failed', error);
    throw error;
  }
}

/**
 * Build window function query
 *
 * @param model - Model to query
 * @param windowFunction - Window function configuration
 * @param where - Where conditions
 * @param transaction - Optional transaction
 * @returns Query results with window function
 */
export async function buildWindowFunctionQuery<M extends Model>(
  model: ModelCtor<M>,
  windowFunction: {
    function: 'ROW_NUMBER' | 'RANK' | 'DENSE_RANK' | 'LAG' | 'LEAD' | 'FIRST_VALUE' | 'LAST_VALUE';
    partitionBy?: string[];
    orderBy: OrderItem[];
    alias: string;
  },
  where?: WhereOptions<any>,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('QueryBuilder::buildWindowFunctionQuery');

  try {
    const partitionClause = windowFunction.partitionBy
      ? `PARTITION BY ${windowFunction.partitionBy.map(f => `"${f}"`).join(', ')}`
      : '';

    const orderClause = windowFunction.orderBy
      .map(order => {
        if (Array.isArray(order)) {
          return `"${order[0]}" ${order[1] || 'ASC'}`;
        }
        return `"${order}" ASC`;
      })
      .join(', ');

    const windowFn = literal(`${windowFunction.function}() OVER (${partitionClause} ORDER BY ${orderClause})`);

    const results = await model.findAll({
      attributes: {
        include: [[windowFn, windowFunction.alias]]
      },
      where,
      transaction,
      raw: true,
    } as any);

    return results;
  } catch (error) {
    logger.error(`Window function query failed for ${model.name}`, error);
    throw error;
  }
}

/**
 * Build CTE (Common Table Expression) query
 *
 * @param ctes - Array of CTE definitions
 * @param mainQuery - Main query using CTEs
 * @param sequelize - Sequelize instance
 * @returns Query results
 */
export async function buildCTEQuery(
  ctes: Array<{ name: string; query: string }>,
  mainQuery: string,
  sequelize: Sequelize
): Promise<any[]> {
  const logger = new Logger('QueryBuilder::buildCTEQuery');

  try {
    const cteClause = ctes
      .map(cte => `${cte.name} AS (${cte.query})`)
      .join(', ');

    const fullQuery = `WITH ${cteClause} ${mainQuery}`;

    const [results] = await sequelize.query(fullQuery);

    return results as any[];
  } catch (error) {
    logger.error('CTE query failed', error);
    throw error;
  }
}

/**
 * Build paginated query
 *
 * @param model - Model to query
 * @param options - Query options
 * @param pagination - Pagination options
 * @returns Paginated results
 */
export async function buildPaginatedQuery<M extends Model>(
  model: ModelCtor<M>,
  options: Omit<FindOptions<Attributes<M>>, 'limit' | 'offset'>,
  pagination: PaginationOptions
): Promise<PaginatedResult<M>> {
  const logger = new Logger('QueryBuilder::buildPaginatedQuery');

  try {
    const { rows: data, count: total } = await model.findAndCountAll({
      ...options,
      limit: pagination.limit,
      offset: pagination.offset ?? (pagination.page - 1) * pagination.limit,
      distinct: true,
    });

    const totalPages = Math.ceil(total / pagination.limit);

    return {
      data,
      pagination: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages,
        hasNext: pagination.page < totalPages,
        hasPrev: pagination.page > 1,
      }
    };
  } catch (error) {
    logger.error(`Paginated query failed for ${model.name}`, error);
    throw error;
  }
}

/**
 * Build optimized query with includes to prevent N+1 queries
 *
 * @param config - Query configuration with model, includes, and options
 * @returns Optimized find options with N+1 prevention strategies
 *
 * @remarks
 * **N+1 Prevention Strategies:**
 * - Sets `subQuery: false` by default when includes are present to use JOINs instead of subqueries
 * - Uses `distinct: true` for accurate counts with multiple joins
 * - Optimizes attribute selection to reduce data transfer
 * - Supports separate queries for better performance with many-to-many relations
 *
 * **Performance Considerations:**
 * - `subQuery: false`: Faster for most cases, uses JOINs
 * - `subQuery: true`: Better for LIMIT/OFFSET with includes, but can cause N+1 if not careful
 * - Always specify `attributes` to limit columns fetched
 * - Use `required: true` in includes for INNER JOINs (filters out null relations)
 * - Use `separate: true` for hasMany/belongsToMany to avoid row multiplication
 *
 * @example
 * ```typescript
 * // Optimized query preventing N+1:
 * const options = buildOptimizedQuery({
 *   model: User,
 *   where: { status: 'active' },
 *   include: [{
 *     model: Post,
 *     as: 'posts',
 *     required: false, // LEFT JOIN
 *     attributes: ['id', 'title', 'createdAt'], // Limit columns
 *     where: { published: true },
 *     separate: true // Separate query to avoid row multiplication
 *   }],
 *   attributes: ['id', 'name', 'email'], // Don't fetch unnecessary columns
 *   subQuery: false, // Use JOIN instead of subquery
 *   distinct: true // Accurate count with joins
 * });
 * ```
 */
export function buildOptimizedQuery<M extends Model>(
  config: QueryBuilderConfig<M>
): FindOptions<Attributes<M>> {
  const options: FindOptions<Attributes<M>> = {
    where: config.where,
    include: config.include,
    order: config.order,
    limit: config.limit,
    offset: config.offset,
    transaction: config.transaction,
  };

  // N+1 Prevention: Use subQuery: false by default with includes
  // This makes Sequelize use JOINs instead of separate queries
  if (config.include && config.include.length > 0) {
    // Default to false for better performance (uses JOINs)
    // Set to true if you need LIMIT/OFFSET to work correctly with includes
    options.subQuery = config.subQuery ?? false;
  }

  // Use distinct for accurate counts with joins
  // Prevents duplicate rows when using LEFT JOIN with hasMany relations
  if (config.distinct !== undefined) {
    options.distinct = config.distinct;
  } else if (config.include && config.include.length > 0 && (config.limit || config.offset !== undefined)) {
    // Auto-enable distinct when using pagination with includes
    options.distinct = true;
  }

  // Add attributes selection - always specify to reduce data transfer
  if (config.attributes) {
    options.attributes = config.attributes as any;
  }

  // Add group and having for aggregations
  if (config.group) {
    options.group = config.group;
  }

  if (config.having) {
    options.having = config.having;
  }

  return options;
}

/**
 * Build JSON query for JSONB fields (PostgreSQL)
 *
 * @param field - JSONB field name
 * @param path - JSON path
 * @param operator - Comparison operator
 * @param value - Value to compare
 * @returns JSON where clause
 */
export function buildJSONQuery(
  field: string,
  path: string,
  operator: FilterOperator,
  value: any
): WhereOptions<any> {
  const jsonPath = `${field}->'${path}'`;

  switch (operator) {
    case FilterOperator.EQ:
      return sequelizeWhere(literal(jsonPath), value);

    case FilterOperator.CONTAINS:
      return { [field]: { [Op.contains]: value } };

    case FilterOperator.CONTAINED:
      return { [field]: { [Op.contained]: value } };

    default:
      return sequelizeWhere(literal(jsonPath), { [Op.eq]: value });
  }
}

/**
 * Build array query for array fields (PostgreSQL)
 *
 * @param field - Array field name
 * @param operator - Array operator
 * @param value - Value to compare
 * @returns Array where clause
 */
export function buildArrayQuery(
  field: string,
  operator: 'contains' | 'contained' | 'overlap' | 'any',
  value: any
): WhereOptions<any> {
  switch (operator) {
    case 'contains':
      return { [field]: { [Op.contains]: value } };

    case 'contained':
      return { [field]: { [Op.contained]: value } };

    case 'overlap':
      return { [field]: { [Op.overlap]: value } };

    case 'any':
      return { [field]: { [Op.any]: value } };

    default:
      return { [field]: value };
  }
}

/**
 * Build spatial query (PostGIS)
 *
 * @param field - Geometry/Geography field
 * @param operator - Spatial operator
 * @param value - Spatial value (GeoJSON, WKT, etc.)
 * @returns Spatial where clause
 */
export function buildSpatialQuery(
  field: string,
  operator: 'intersects' | 'contains' | 'within' | 'distance',
  value: any,
  distance?: number
): WhereOptions<any> {
  switch (operator) {
    case 'intersects':
      return sequelizeWhere(
        fn('ST_Intersects', col(field), fn('ST_GeomFromGeoJSON', value)),
        true
      );

    case 'contains':
      return sequelizeWhere(
        fn('ST_Contains', col(field), fn('ST_GeomFromGeoJSON', value)),
        true
      );

    case 'within':
      return sequelizeWhere(
        fn('ST_Within', col(field), fn('ST_GeomFromGeoJSON', value)),
        true
      );

    case 'distance':
      return sequelizeWhere(
        fn('ST_DWithin', col(field), fn('ST_GeomFromGeoJSON', value), distance || 1000),
        true
      );

    default:
      throw new BadRequestException(`Unknown spatial operator: ${operator}`);
  }
}

/**
 * Build dynamic query from request parameters
 *
 * @param model - Model to query
 * @param params - Request parameters
 * @returns Dynamic query options
 */
export function buildDynamicQuery<M extends Model>(
  model: ModelCtor<M>,
  params: {
    filters?: Filter[];
    search?: { term: string; fields: string[] };
    sort?: SortOptions[];
    page?: number;
    limit?: number;
    include?: string[];
  }
): FindOptions<Attributes<M>> {
  const options: FindOptions<Attributes<M>> = {};

  // Build where clause
  const whereConditions: WhereOptions<any>[] = [];

  if (params.filters) {
    whereConditions.push(buildWhereClause(params.filters));
  }

  if (params.search) {
    whereConditions.push(
      buildFullTextSearch(params.search.term, params.search.fields)
    );
  }

  if (whereConditions.length > 0) {
    options.where = buildLogicalWhere(whereConditions, 'AND');
  }

  // Build order clause
  if (params.sort) {
    options.order = buildOrderClause(params.sort);
  }

  // Build pagination
  if (params.page && params.limit) {
    const pagination = buildPagination(params.page, params.limit);
    options.limit = pagination.limit;
    options.offset = pagination.offset;
  }

  // Build includes
  if (params.include) {
    options.include = params.include.map(assoc => ({
      association: assoc,
      required: false,
    }));
  }

  return options;
}

/**
 * Build batch query for multiple IDs
 *
 * @param model - Model to query
 * @param ids - Array of IDs
 * @param include - Include options
 * @param transaction - Optional transaction
 * @returns Map of ID to record
 */
export async function buildBatchQuery<M extends Model>(
  model: ModelCtor<M>,
  ids: string[],
  include?: IncludeOptions[],
  transaction?: Transaction
): Promise<Map<string, M>> {
  const logger = new Logger('QueryBuilder::buildBatchQuery');

  try {
    const records = await model.findAll({
      where: { id: { [Op.in]: ids } } as any,
      include,
      transaction,
    });

    const recordMap = new Map<string, M>();
    records.forEach(record => {
      recordMap.set((record as any).id, record);
    });

    return recordMap;
  } catch (error) {
    logger.error(`Batch query failed for ${model.name}`, error);
    throw error;
  }
}

/**
 * Optimize query for large datasets
 *
 * @param options - Base query options
 * @param optimization - Optimization strategy
 * @returns Optimized query options
 */
export function optimizeQuery<M extends Model>(
  options: FindOptions<Attributes<M>>,
  optimization: {
    streaming?: boolean;
    indexHints?: string[];
    forceIndex?: string;
    disableSubQuery?: boolean;
    limitIncludes?: boolean;
  }
): FindOptions<Attributes<M>> {
  const optimized = { ...options };

  // Disable subQuery for better performance with includes
  if (optimization.disableSubQuery) {
    optimized.subQuery = false;
  }

  // Limit attributes in includes
  if (optimization.limitIncludes && optimized.include) {
    optimized.include = (optimized.include as IncludeOptions[]).map(inc => ({
      ...inc,
      attributes: inc.attributes || ['id'],
    }));
  }

  return optimized;
}

/**
 * Export all query builder functions
 */
export const QueryBuilder = {
  buildWhereClause,
  buildLogicalWhere,
  buildDateRangeFilter,
  buildFullTextSearch,
  buildPagination,
  buildCursorPagination,
  buildOrderClause,
  buildIncludeOptions,
  buildAttributes,
  buildExistsSubquery,
  buildInSubquery,
  buildAggregateQuery,
  buildGroupedAggregate,
  buildUnionQuery,
  buildIntersectQuery,
  buildParameterizedQuery,
  buildWindowFunctionQuery,
  buildCTEQuery,
  buildPaginatedQuery,
  buildOptimizedQuery,
  buildJSONQuery,
  buildArrayQuery,
  buildSpatialQuery,
  buildDynamicQuery,
  buildBatchQuery,
  optimizeQuery,
};
