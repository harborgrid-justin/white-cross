/**
 * @fileoverview Query Optimization Service
 * @module database/services/query-builder/optimization
 * @description Specialized service for query optimization, performance tuning,
 * pagination, dynamic queries, and spatial/JSON queries
 *
 * @version 1.0.0
 * @requires sequelize ^6.x
 * @requires @nestjs/common ^10.x
 */

import { Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import {
  Model,
  ModelCtor,
  WhereOptions,
  FindOptions,
  IncludeOptions,
  OrderItem,
  Transaction,
  Op,
  literal,
  fn,
  col,
  where as sequelizeWhere,
  Attributes,
} from 'sequelize';

// Import interfaces from other modules
import {
  PaginationOptions,
  PaginatedResult,
  SortOptions,
  Filter,
  FilterOperator,
  QueryBuilderConfig,
} from './interfaces';

/**
 * Batch query configuration for multiple IDs
 */
export interface BatchQueryConfig {
  batchSize?: number;
  includeOptions?: IncludeOptions[];
  transaction?: Transaction;
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
  pagination: PaginationOptions,
): Promise<PaginatedResult<M>> {
  const logger = new Logger('Optimization::buildPaginatedQuery');

  try {
    const { rows: data, count: total } = await model.findAndCountAll({
      ...options,
      limit: pagination.limit,
      offset: pagination.offset ?? (pagination.page - 1) * pagination.limit,
      distinct: true,
    });

    const totalPages = Math.ceil(total / pagination.limit);

    const result: PaginatedResult<M> = {
      data,
      pagination: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages,
        hasNext: pagination.page < totalPages,
        hasPrev: pagination.page > 1,
      },
    };

    logger.log(
      `Paginated query executed for ${model.name}: page ${pagination.page}, ${data.length}/${total} records`,
    );
    return result;
  } catch (error) {
    logger.error(`Paginated query failed for ${model.name}`, error);
    throw new InternalServerErrorException(`Paginated query failed for ${model.name}`);
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
  config: QueryBuilderConfig<M>,
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
  } else if (
    config.include &&
    config.include.length > 0 &&
    (config.limit || config.offset !== undefined)
  ) {
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
  },
): FindOptions<Attributes<M>> {
  const options: FindOptions<Attributes<M>> = {};

  // Build where clause
  const whereConditions: WhereOptions<any>[] = [];

  if (params.filters && params.filters.length > 0) {
    whereConditions.push(buildWhereClause(params.filters));
  }

  if (params.search && params.search.term && params.search.fields.length > 0) {
    whereConditions.push(buildFullTextSearch(params.search.term, params.search.fields));
  }

  if (whereConditions.length > 0) {
    options.where = buildLogicalWhere(whereConditions, 'AND');
  }

  // Build order clause
  if (params.sort && params.sort.length > 0) {
    options.order = buildOrderClause(params.sort);
  }

  // Build pagination
  if (params.page && params.limit) {
    const pagination = buildPagination(params.page, params.limit);
    options.limit = pagination.limit;
    options.offset = pagination.offset;
  }

  // Build includes
  if (params.include && params.include.length > 0) {
    options.include = params.include.map((assoc) => ({
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
 * @param config - Batch query configuration
 * @returns Map of ID to record
 */
export async function buildBatchQuery<M extends Model>(
  model: ModelCtor<M>,
  ids: string[],
  config: BatchQueryConfig = {},
): Promise<Map<string, M>> {
  const logger = new Logger('Optimization::buildBatchQuery');

  try {
    const { batchSize = 100, includeOptions, transaction } = config;
    const recordMap = new Map<string, M>();

    // Process in batches to avoid query size limits
    for (let i = 0; i < ids.length; i += batchSize) {
      const batchIds = ids.slice(i, i + batchSize);

      const records = await model.findAll({
        where: { id: { [Op.in]: batchIds } } as any,
        include: includeOptions,
        transaction,
      });

      records.forEach((record) => {
        recordMap.set((record as any).id, record);
      });
    }

    logger.log(
      `Batch query executed for ${model.name}: ${recordMap.size}/${ids.length} records found`,
    );
    return recordMap;
  } catch (error) {
    logger.error(`Batch query failed for ${model.name}`, error);
    throw new InternalServerErrorException(`Batch query failed for ${model.name}`);
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
  },
): FindOptions<Attributes<M>> {
  const optimized = { ...options };

  // Disable subQuery for better performance with includes
  if (optimization.disableSubQuery) {
    optimized.subQuery = false;
  }

  // Limit attributes in includes
  if (optimization.limitIncludes && optimized.include) {
    optimized.include = (optimized.include as IncludeOptions[]).map((inc) => ({
      ...inc,
      attributes: inc.attributes || ['id'],
    }));
  }

  return optimized;
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
  value: any,
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
  value: any,
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
 * @param distance - Distance for distance queries
 * @returns Spatial where clause
 */
export function buildSpatialQuery(
  field: string,
  operator: 'intersects' | 'contains' | 'within' | 'distance',
  value: any,
  distance?: number,
): WhereOptions<any> {
  switch (operator) {
    case 'intersects':
      return sequelizeWhere(fn('ST_Intersects', col(field), fn('ST_GeomFromGeoJSON', value)), true);

    case 'contains':
      return sequelizeWhere(fn('ST_Contains', col(field), fn('ST_GeomFromGeoJSON', value)), true);

    case 'within':
      return sequelizeWhere(fn('ST_Within', col(field), fn('ST_GeomFromGeoJSON', value)), true);

    case 'distance':
      return sequelizeWhere(
        fn('ST_DWithin', col(field), fn('ST_GeomFromGeoJSON', value), distance || 1000),
        true,
      );

    default:
      throw new BadRequestException(`Unknown spatial operator: ${operator}`);
  }
}

// Helper functions (extracted from basic-builders for consistency)

/**
 * Build a basic where clause from filters
 *
 * @param filters - Array of filter definitions
 * @returns Sequelize where options
 */
function buildWhereClause(filters: Filter[]): WhereOptions<any> {
  const logger = new Logger('Optimization::buildWhereClause');
  const where: WhereOptions<any> = {};

  filters.forEach((filter) => {
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
          where[field] = caseSensitive ? { [Op.like]: value } : { [Op.iLike]: value };
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
function buildLogicalWhere(
  conditions: WhereOptions<any>[],
  operator: 'AND' | 'OR' = 'AND',
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
 * Build full-text search filter across multiple fields
 *
 * @param searchTerm - Search term
 * @param fields - Fields to search
 * @param caseSensitive - Case sensitivity
 * @returns Full-text search where clause
 */
function buildFullTextSearch(
  searchTerm: string,
  fields: string[],
  caseSensitive: boolean = false,
): WhereOptions<any> {
  if (!searchTerm || fields.length === 0) {
    return {};
  }

  const searchPattern = `%${searchTerm}%`;
  const operator = caseSensitive ? Op.like : Op.iLike;

  return {
    [Op.or]: fields.map((field) => ({
      [field]: { [operator]: searchPattern },
    })),
  };
}

/**
 * Build order clause from sort options
 *
 * @param sorts - Array of sort options
 * @returns Sequelize order array
 */
function buildOrderClause(sorts: SortOptions[]): OrderItem[] {
  return sorts.map((sort) => {
    const orderItem: OrderItem = [sort.field, sort.direction];

    if (sort.nulls) {
      return [...orderItem, `NULLS ${sort.nulls}`] as OrderItem;
    }

    return orderItem;
  });
}

/**
 * Build pagination options
 *
 * @param page - Page number (1-based)
 * @param limit - Items per page
 * @returns Pagination options with offset
 */
function buildPagination(page: number, limit: number): PaginationOptions {
  const validPage = Math.max(1, page);
  const validLimit = Math.max(1, Math.min(limit, 1000)); // Max 1000 per page

  return {
    page: validPage,
    limit: validLimit,
    offset: (validPage - 1) * validLimit,
  };
}

/**
 * Export all optimization functions
 */
export const Optimization = {
  buildPaginatedQuery,
  buildOptimizedQuery,
  buildDynamicQuery,
  buildBatchQuery,
  optimizeQuery,
  buildJSONQuery,
  buildArrayQuery,
  buildSpatialQuery,
};
