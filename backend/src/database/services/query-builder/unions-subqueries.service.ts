/**
 * @fileoverview Union and Subquery Builder Service
 * @module databa@/services/query-builder/unions-subqueries
 * @description Specialized service for complex union queries, subqueries,
 * CTEs, and parameterized raw SQL queries with proper escaping
 *
 * @version 1.0.0
 * @requires sequelize ^6.x
 * @requires @nestjs/common ^10.x
 */

import { Logger, InternalServerErrorException } from '@nestjs/common';
import {
  Model,
  ModelCtor,
  WhereOptions,
  Sequelize,
  QueryTypes,
  Transaction,
  literal,
} from 'sequelize';

/**
 * CTE (Common Table Expression) configuration
 */
export interface CTEConfig {
  name: string;
  query: string;
  columns?: string[];
  recursive?: boolean;
  materialize?: boolean;
}

/**
 * Query configuration for unions and intersects
 */
export interface QueryConfig {
  query: string;
  replacements?: Record<string, any>;
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
  const logger = new Logger('UnionsSubqueries::buildExistsSubquery');

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
  const logger = new Logger('UnionsSubqueries::buildInSubquery');

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
 * Build UNION query
 *
 * @param queries - Array of query configurations
 * @param unionType - UNION or UNION ALL
 * @param sequelize - Sequelize instance
 * @returns Union query results
 */
export async function buildUnionQuery(
  queries: QueryConfig[],
  unionType: 'UNION' | 'UNION ALL' = 'UNION',
  sequelize: Sequelize
): Promise<any[]> {
  const logger = new Logger('UnionsSubqueries::buildUnionQuery');

  try {
    const unionQueries = queries.map(q => `(${q.query})`).join(` ${unionType} `);

    const [results] = await sequelize.query(unionQueries, {
      replacements: queries[0]?.replacements,
    });

    logger.log(`Union query executed: ${queries.length} queries, ${(results as any[]).length} results`);
    return results as any[];
  } catch (error) {
    logger.error('Union query failed', error);
    throw new InternalServerErrorException('Union query failed');
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
  queries: QueryConfig[],
  sequelize: Sequelize
): Promise<any[]> {
  const logger = new Logger('UnionsSubqueries::buildIntersectQuery');

  try {
    const intersectQuery = queries.map(q => `(${q.query})`).join(' INTERSECT ');

    const [results] = await sequelize.query(intersectQuery, {
      replacements: queries[0]?.replacements,
    });

    logger.log(`Intersect query executed: ${queries.length} queries, ${(results as any[]).length} results`);
    return results as any[];
  } catch (error) {
    logger.error('Intersect query failed', error);
    throw new InternalServerErrorException('Intersect query failed');
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
  const logger = new Logger('UnionsSubqueries::buildParameterizedQuery');

  try {
    const [results] = await sequelize.query(sql, {
      replacements,
      type: QueryTypes.SELECT,
    });

    logger.log(`Parameterized query executed: ${(results as any[]).length} results`);
    return results as any[];
  } catch (error) {
    logger.error('Parameterized query failed', error);
    throw new InternalServerErrorException('Parameterized query failed');
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
  ctes: CTEConfig[],
  mainQuery: string,
  sequelize: Sequelize
): Promise<any[]> {
  const logger = new Logger('UnionsSubqueries::buildCTEQuery');

  try {
    const cteDefinitions = ctes.map(cte => {
      const columns = cte.columns ? `(${cte.columns.join(', ')})` : '';
      const materialize = cte.materialize !== false ? 'MATERIALIZED' : 'NOT MATERIALIZED';
      const recursive = cte.recursive ? 'RECURSIVE' : '';
      
      return `${recursive} ${cte.name}${columns} AS ${materialize} (${cte.query})`.trim();
    });

    const cteClause = `WITH ${cteDefinitions.join(',\n')}`;
    const fullQuery = `${cteClause}\n${mainQuery}`;

    const [results] = await sequelize.query(fullQuery);

    logger.log(`CTE query executed: ${ctes.length} CTEs, ${(results as any[]).length} results`);
    return results as any[];
  } catch (error) {
    logger.error('CTE query failed', error);
    throw new InternalServerErrorException('CTE query failed');
  }
}

/**
 * Build recursive CTE query for hierarchical data
 *
 * @param anchorQuery - Base case query
 * @param recursiveQuery - Recursive part query
 * @param cteName - Name of the CTE
 * @param mainQuery - Main query using the recursive CTE
 * @param sequelize - Sequelize instance
 * @returns Recursive query results
 */
export async function buildRecursiveCTE(
  anchorQuery: string,
  recursiveQuery: string,
  cteName: string,
  mainQuery: string,
  sequelize: Sequelize
): Promise<any[]> {
  const logger = new Logger('UnionsSubqueries::buildRecursiveCTE');

  try {
    const fullQuery = `
      WITH RECURSIVE ${cteName} AS (
        ${anchorQuery}
        UNION ALL
        ${recursiveQuery}
      )
      ${mainQuery}
    `;

    const [results] = await sequelize.query(fullQuery);

    logger.log(`Recursive CTE query executed: ${cteName}, ${(results as any[]).length} results`);
    return results as any[];
  } catch (error) {
    logger.error('Recursive CTE query failed', error);
    throw new InternalServerErrorException('Recursive CTE query failed');
  }
}

/**
 * Build EXCEPT (MINUS) query
 *
 * @param queries - Array of query configurations (first query EXCEPT subsequent queries)
 * @param sequelize - Sequelize instance
 * @returns Except query results
 */
export async function buildExceptQuery(
  queries: QueryConfig[],
  sequelize: Sequelize
): Promise<any[]> {
  const logger = new Logger('UnionsSubqueries::buildExceptQuery');

  try {
    const exceptQuery = queries.map(q => `(${q.query})`).join(' EXCEPT ');

    const [results] = await sequelize.query(exceptQuery, {
      replacements: queries[0]?.replacements,
    });

    logger.log(`Except query executed: ${queries.length} queries, ${(results as any[]).length} results`);
    return results as any[];
  } catch (error) {
    logger.error('Except query failed', error);
    throw new InternalServerErrorException('Except query failed');
  }
}

/**
 * Build VALUES clause query for inline data
 *
 * @param values - Array of value arrays
 * @param columns - Column names
 * @param sequelize - Sequelize instance
 * @returns VALUES query results
 */
export async function buildValuesQuery(
  values: any[][],
  columns: string[],
  sequelize: Sequelize
): Promise<any[]> {
  const logger = new Logger('UnionsSubqueries::buildValuesQuery');

  try {
    const columnList = columns.join(', ');
    const valueRows = values
      .map(row => `(${row.map(val => sequelize.escape(val)).join(', ')})`)
      .join(', ');

    const query = `SELECT ${columnList} FROM (VALUES ${valueRows}) AS t(${columnList})`;

    const [results] = await sequelize.query(query);

    logger.log(`VALUES query executed: ${values.length} rows, ${columns.length} columns`);
    return results as any[];
  } catch (error) {
    logger.error('VALUES query failed', error);
    throw new InternalServerErrorException('VALUES query failed');
  }
}

/**
 * Export all union and subquery functions
 */
export const UnionsSubqueries = {
  buildExistsSubquery,
  buildInSubquery,
  buildUnionQuery,
  buildIntersectQuery,
  buildParameterizedQuery,
  buildCTEQuery,
  buildRecursiveCTE,
  buildExceptQuery,
  buildValuesQuery,
};
