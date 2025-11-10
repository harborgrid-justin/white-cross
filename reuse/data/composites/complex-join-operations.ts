/**
 * @fileoverview Complex Join Operations for Sequelize + NestJS
 * @module reuse/data/composites/complex-join-operations
 * @description Production-ready complex join operations with multi-table joins,
 * CTEs, recursive queries, graph traversal, hierarchical data, and advanced SQL patterns.
 * Exceeds Informatica capabilities with sophisticated join strategies and optimizations.
 *
 * @version 1.0.0
 * @requires sequelize ^6.x
 * @requires @nestjs/common ^10.x
 */

import { Logger, InternalServerErrorException } from '@nestjs/common';
import {
  Sequelize,
  Model,
  ModelCtor,
  FindOptions,
  WhereOptions,
  Op,
  Transaction,
  QueryTypes,
  Attributes,
  OrderItem,
  literal,
  fn,
  col,
} from 'sequelize';

/**
 * Join configuration
 */
export interface JoinConfig {
  table: string;
  alias?: string;
  type: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL' | 'CROSS' | 'LATERAL';
  on: string | { left: string; right: string; operator?: string };
  where?: string;
}

/**
 * CTE configuration
 */
export interface CTEConfig {
  name: string;
  query: string;
  columns?: string[];
  recursive?: boolean;
  materialize?: boolean;
}

/**
 * Hierarchical query configuration
 */
export interface HierarchicalConfig {
  idField: string;
  parentIdField: string;
  startWith?: WhereOptions<any>;
  maxDepth?: number;
  includeLevel?: boolean;
  includePath?: boolean;
}

/**
 * Graph traversal configuration
 */
export interface GraphTraversalConfig {
  nodeTable: string;
  edgeTable: string;
  nodeIdField: string;
  sourceField: string;
  targetField: string;
  startNodeId: any;
  maxDepth?: number;
  direction?: 'forward' | 'backward' | 'both';
}

/**
 * Pivot table configuration
 */
export interface PivotConfig {
  sourceTable: string;
  rowField: string;
  columnField: string;
  valueField: string;
  aggregateFunction: 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX';
  columnValues: string[];
}

/**
 * Execute complex multi-table join
 *
 * @param sequelize - Sequelize instance
 * @param baseTable - Base table name
 * @param joins - Array of join configurations
 * @param select - Array of columns to select
 * @param where - Where conditions
 * @param orderBy - Order by configuration
 * @param limit - Result limit
 * @param transaction - Optional transaction
 * @returns Join query results
 *
 * @example
 * ```typescript
 * const results = await executeComplexJoin(
 *   sequelize,
 *   'orders',
 *   [
 *     {
 *       table: 'customers',
 *       alias: 'c',
 *       type: 'INNER',
 *       on: { left: 'orders.customer_id', right: 'c.id' }
 *     },
 *     {
 *       table: 'order_items',
 *       alias: 'oi',
 *       type: 'LEFT',
 *       on: { left: 'orders.id', right: 'oi.order_id' }
 *     }
 *   ],
 *   ['orders.*', 'c.name as customer_name', 'COUNT(oi.id) as item_count'],
 *   "orders.status = 'completed'",
 *   ['orders.created_at DESC'],
 *   100
 * );
 * ```
 */
export async function executeComplexJoin(
  sequelize: Sequelize,
  baseTable: string,
  joins: JoinConfig[],
  select: string[],
  where?: string,
  orderBy?: string[],
  limit?: number,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('ComplexJoins::executeComplexJoin');

  try {
    // Build JOIN clauses
    const joinClauses = joins.map(join => {
      const tableRef = join.alias ? `${join.table} AS ${join.alias}` : join.table;

      let onClause: string;
      if (typeof join.on === 'string') {
        onClause = join.on;
      } else {
        const operator = join.on.operator || '=';
        onClause = `${join.on.left} ${operator} ${join.on.right}`;
      }

      let joinClause = `${join.type} JOIN ${tableRef} ON ${onClause}`;

      if (join.where) {
        joinClause += ` AND ${join.where}`;
      }

      return joinClause;
    });

    // Build complete query
    const selectClause = select.join(', ');
    const whereClause = where ? `WHERE ${where}` : '';
    const orderByClause = orderBy && orderBy.length > 0 ? `ORDER BY ${orderBy.join(', ')}` : '';
    const limitClause = limit ? `LIMIT ${limit}` : '';

    const query = `
      SELECT ${selectClause}
      FROM ${baseTable}
      ${joinClauses.join('\n')}
      ${whereClause}
      ${orderByClause}
      ${limitClause}
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Complex join executed: ${results.length} results from ${joins.length + 1} tables`);
    return results;
  } catch (error) {
    logger.error('Complex join failed', error);
    throw new InternalServerErrorException('Complex join failed');
  }
}

/**
 * Execute query with Common Table Expressions (CTEs)
 *
 * @param sequelize - Sequelize instance
 * @param ctes - Array of CTE configurations
 * @param mainQuery - Main query using CTEs
 * @param transaction - Optional transaction
 * @returns Query results
 *
 * @example
 * ```typescript
 * const results = await executeWithCTE(
 *   sequelize,
 *   [
 *     {
 *       name: 'monthly_sales',
 *       query: `SELECT DATE_TRUNC('month', order_date) AS month,
 *               SUM(amount) AS total FROM orders GROUP BY month`
 *     },
 *     {
 *       name: 'monthly_avg',
 *       query: 'SELECT AVG(total) AS avg_monthly FROM monthly_sales'
 *     }
 *   ],
 *   `SELECT ms.month, ms.total, ma.avg_monthly
 *    FROM monthly_sales ms, monthly_avg ma
 *    WHERE ms.total > ma.avg_monthly`
 * );
 * ```
 */
export async function executeWithCTE(
  sequelize: Sequelize,
  ctes: CTEConfig[],
  mainQuery: string,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('ComplexJoins::executeWithCTE');

  try {
    const cteDefinitions = ctes.map(cte => {
      const columns = cte.columns ? `(${cte.columns.join(', ')})` : '';
      const materialize = cte.materialize !== false ? 'MATERIALIZED' : 'NOT MATERIALIZED';
      return `${cte.name}${columns} AS ${materialize} (${cte.query})`;
    });

    const cteClause = `WITH ${cteDefinitions.join(',\n')}`;

    const fullQuery = `${cteClause}\n${mainQuery}`;

    const results = await sequelize.query(fullQuery, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`CTE query executed: ${ctes.length} CTEs, ${results.length} results`);
    return results;
  } catch (error) {
    logger.error('CTE query failed', error);
    throw new InternalServerErrorException('CTE query failed');
  }
}

/**
 * Execute recursive CTE for hierarchical data
 *
 * @param sequelize - Sequelize instance
 * @param config - Hierarchical query configuration
 * @param tableName - Table name
 * @param transaction - Optional transaction
 * @returns Hierarchical data with levels
 *
 * @example
 * ```typescript
 * const hierarchy = await executeRecursiveCTE(
 *   sequelize,
 *   {
 *     idField: 'id',
 *     parentIdField: 'parent_id',
 *     startWith: { parent_id: null },
 *     maxDepth: 10,
 *     includeLevel: true,
 *     includePath: true
 *   },
 *   'categories'
 * );
 * ```
 */
export async function executeRecursiveCTE(
  sequelize: Sequelize,
  config: HierarchicalConfig,
  tableName: string,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('ComplexJoins::executeRecursiveCTE');

  try {
    const startCondition = config.startWith
      ? Object.entries(config.startWith)
          .map(([key, value]) => {
            if (value === null) {
              return `${key} IS NULL`;
            }
            return `${key} = ${sequelize.escape(value)}`;
          })
          .join(' AND ')
      : `${config.parentIdField} IS NULL`;

    const maxDepthCondition = config.maxDepth ? `level < ${config.maxDepth}` : '1=1';

    const pathColumn = config.includePath
      ? `, ARRAY["${config.idField}"] AS path`
      : '';

    const pathJoin = config.includePath
      ? `, h.path || t."${config.idField}"`
      : '';

    const query = `
      WITH RECURSIVE hierarchy AS (
        -- Anchor: root nodes
        SELECT
          *,
          1 AS level
          ${pathColumn}
        FROM "${tableName}"
        WHERE ${startCondition}

        UNION ALL

        -- Recursive: children nodes
        SELECT
          t.*,
          h.level + 1
          ${pathJoin}
        FROM "${tableName}" t
        INNER JOIN hierarchy h ON t."${config.parentIdField}" = h."${config.idField}"
        WHERE ${maxDepthCondition}
      )
      SELECT * FROM hierarchy
      ORDER BY ${config.includePath ? 'path' : `level, "${config.idField}"`}
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Recursive CTE executed: ${results.length} nodes retrieved`);
    return results;
  } catch (error) {
    logger.error('Recursive CTE failed', error);
    throw new InternalServerErrorException('Recursive CTE failed');
  }
}

/**
 * Execute lateral join for correlated subqueries
 *
 * @param sequelize - Sequelize instance
 * @param baseTable - Base table name
 * @param lateralQuery - Lateral subquery (use {alias} placeholder for base table)
 * @param lateralAlias - Alias for lateral result
 * @param where - Where conditions
 * @param transaction - Optional transaction
 * @returns Query results with lateral join
 *
 * @example
 * ```typescript
 * const results = await executeLateralJoin(
 *   sequelize,
 *   'customers',
 *   `SELECT * FROM orders
 *    WHERE orders.customer_id = {alias}.id
 *    ORDER BY order_date DESC
 *    LIMIT 5`,
 *   'recent_orders',
 *   "customers.status = 'active'"
 * );
 * ```
 */
export async function executeLateralJoin(
  sequelize: Sequelize,
  baseTable: string,
  lateralQuery: string,
  lateralAlias: string,
  where?: string,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('ComplexJoins::executeLateralJoin');

  try {
    // Replace placeholder with base table alias
    const processedQuery = lateralQuery.replace(/\{alias\}/g, 'base');

    const whereClause = where ? `WHERE ${where}` : '';

    const query = `
      SELECT base.*, ${lateralAlias}.*
      FROM "${baseTable}" AS base
      LEFT JOIN LATERAL (
        ${processedQuery}
      ) AS ${lateralAlias} ON true
      ${whereClause}
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Lateral join executed: ${results.length} results`);
    return results;
  } catch (error) {
    logger.error('Lateral join failed', error);
    throw new InternalServerErrorException('Lateral join failed');
  }
}

/**
 * Execute self-join
 *
 * @param sequelize - Sequelize instance
 * @param tableName - Table name
 * @param alias1 - First table alias
 * @param alias2 - Second table alias
 * @param joinCondition - Join condition
 * @param select - Select columns
 * @param where - Where conditions
 * @param transaction - Optional transaction
 * @returns Self-join results
 *
 * @example
 * ```typescript
 * const results = await executeSelfJoin(
 *   sequelize,
 *   'employees',
 *   'e1',
 *   'e2',
 *   'e1.manager_id = e2.id',
 *   ['e1.name as employee_name', 'e2.name as manager_name'],
 *   "e1.department = 'Engineering'"
 * );
 * ```
 */
export async function executeSelfJoin(
  sequelize: Sequelize,
  tableName: string,
  alias1: string,
  alias2: string,
  joinCondition: string,
  select: string[],
  where?: string,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('ComplexJoins::executeSelfJoin');

  try {
    const selectClause = select.join(', ');
    const whereClause = where ? `WHERE ${where}` : '';

    const query = `
      SELECT ${selectClause}
      FROM "${tableName}" AS ${alias1}
      INNER JOIN "${tableName}" AS ${alias2} ON ${joinCondition}
      ${whereClause}
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Self-join executed: ${results.length} results`);
    return results;
  } catch (error) {
    logger.error('Self-join failed', error);
    throw new InternalServerErrorException('Self-join failed');
  }
}

/**
 * Execute cross join (Cartesian product)
 *
 * @param sequelize - Sequelize instance
 * @param table1 - First table
 * @param table2 - Second table
 * @param where - Where conditions to filter results
 * @param limit - Result limit (recommended for cross joins)
 * @param transaction - Optional transaction
 * @returns Cross join results
 *
 * @example
 * ```typescript
 * const combinations = await executeCrossJoin(
 *   sequelize,
 *   'colors',
 *   'sizes',
 *   "colors.available = true AND sizes.in_stock = true",
 *   1000
 * );
 * ```
 */
export async function executeCrossJoin(
  sequelize: Sequelize,
  table1: string,
  table2: string,
  where?: string,
  limit?: number,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('ComplexJoins::executeCrossJoin');

  try {
    const whereClause = where ? `WHERE ${where}` : '';
    const limitClause = limit ? `LIMIT ${limit}` : '';

    const query = `
      SELECT *
      FROM "${table1}"
      CROSS JOIN "${table2}"
      ${whereClause}
      ${limitClause}
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Cross join executed: ${results.length} combinations`);
    return results;
  } catch (error) {
    logger.error('Cross join failed', error);
    throw new InternalServerErrorException('Cross join failed');
  }
}

/**
 * Execute full outer join
 *
 * @param sequelize - Sequelize instance
 * @param leftTable - Left table
 * @param rightTable - Right table
 * @param joinCondition - Join condition
 * @param select - Select columns
 * @param where - Where conditions
 * @param transaction - Optional transaction
 * @returns Full outer join results
 *
 * @example
 * ```typescript
 * const results = await executeFullOuterJoin(
 *   sequelize,
 *   'orders',
 *   'shipments',
 *   'orders.id = shipments.order_id',
 *   ['orders.*, shipments.tracking_number'],
 *   "orders.created_at > '2024-01-01'"
 * );
 * ```
 */
export async function executeFullOuterJoin(
  sequelize: Sequelize,
  leftTable: string,
  rightTable: string,
  joinCondition: string,
  select: string[],
  where?: string,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('ComplexJoins::executeFullOuterJoin');

  try {
    const selectClause = select.join(', ');
    const whereClause = where ? `WHERE ${where}` : '';

    const query = `
      SELECT ${selectClause}
      FROM "${leftTable}"
      FULL OUTER JOIN "${rightTable}" ON ${joinCondition}
      ${whereClause}
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Full outer join executed: ${results.length} results`);
    return results;
  } catch (error) {
    logger.error('Full outer join failed', error);
    throw new InternalServerErrorException('Full outer join failed');
  }
}

/**
 * Execute graph traversal using recursive CTE
 *
 * @param sequelize - Sequelize instance
 * @param config - Graph traversal configuration
 * @param transaction - Optional transaction
 * @returns Graph traversal results with paths
 *
 * @example
 * ```typescript
 * const paths = await executeGraphTraversal(
 *   sequelize,
 *   {
 *     nodeTable: 'users',
 *     edgeTable: 'friendships',
 *     nodeIdField: 'id',
 *     sourceField: 'user_id',
 *     targetField: 'friend_id',
 *     startNodeId: 1,
 *     maxDepth: 6,
 *     direction: 'forward'
 *   }
 * );
 * ```
 */
export async function executeGraphTraversal(
  sequelize: Sequelize,
  config: GraphTraversalConfig,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('ComplexJoins::executeGraphTraversal');

  try {
    const maxDepthCondition = config.maxDepth ? `depth < ${config.maxDepth}` : '1=1';

    const directionCondition =
      config.direction === 'backward'
        ? `e."${config.targetField}" = g.node_id`
        : config.direction === 'both'
        ? `(e."${config.sourceField}" = g.node_id OR e."${config.targetField}" = g.node_id)`
        : `e."${config.sourceField}" = g.node_id`;

    const nextNode =
      config.direction === 'backward'
        ? `e."${config.sourceField}"`
        : `CASE
             WHEN e."${config.sourceField}" = g.node_id THEN e."${config.targetField}"
             ELSE e."${config.sourceField}"
           END`;

    const query = `
      WITH RECURSIVE graph_traversal AS (
        -- Start node
        SELECT
          n."${config.nodeIdField}" AS node_id,
          1 AS depth,
          ARRAY[n."${config.nodeIdField}"] AS path,
          n.*
        FROM "${config.nodeTable}" n
        WHERE n."${config.nodeIdField}" = :startNodeId

        UNION ALL

        -- Traverse edges
        SELECT
          ${nextNode} AS node_id,
          g.depth + 1,
          g.path || ${nextNode},
          n.*
        FROM graph_traversal g
        JOIN "${config.edgeTable}" e ON ${directionCondition}
        JOIN "${config.nodeTable}" n ON n."${config.nodeIdField}" = ${nextNode}
        WHERE ${maxDepthCondition}
          AND NOT (${nextNode} = ANY(g.path)) -- Prevent cycles
      )
      SELECT DISTINCT ON (node_id) *
      FROM graph_traversal
      ORDER BY node_id, depth
    `;

    const results = await sequelize.query(query, {
      replacements: { startNodeId: config.startNodeId },
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Graph traversal: ${results.length} nodes reached from node ${config.startNodeId}`);
    return results;
  } catch (error) {
    logger.error('Graph traversal failed', error);
    throw new InternalServerErrorException('Graph traversal failed');
  }
}

/**
 * Find shortest path between two nodes
 *
 * @param sequelize - Sequelize instance
 * @param config - Graph configuration
 * @param startNodeId - Start node ID
 * @param endNodeId - End node ID
 * @param transaction - Optional transaction
 * @returns Shortest path or null if no path exists
 *
 * @example
 * ```typescript
 * const path = await findShortestPath(
 *   sequelize,
 *   {
 *     nodeTable: 'cities',
 *     edgeTable: 'roads',
 *     nodeIdField: 'id',
 *     sourceField: 'from_city',
 *     targetField: 'to_city'
 *   },
 *   'NYC',
 *   'LAX'
 * );
 * ```
 */
export async function findShortestPath(
  sequelize: Sequelize,
  config: Omit<GraphTraversalConfig, 'startNodeId' | 'maxDepth' | 'direction'>,
  startNodeId: any,
  endNodeId: any,
  transaction?: Transaction
): Promise<{ path: any[]; distance: number } | null> {
  const logger = new Logger('ComplexJoins::findShortestPath');

  try {
    const query = `
      WITH RECURSIVE path_search AS (
        -- Start node
        SELECT
          n."${config.nodeIdField}" AS current_node,
          1 AS distance,
          ARRAY[n."${config.nodeIdField}"] AS path
        FROM "${config.nodeTable}" n
        WHERE n."${config.nodeIdField}" = :startNodeId

        UNION ALL

        -- Explore neighbors
        SELECT
          CASE
            WHEN e."${config.sourceField}" = ps.current_node THEN e."${config.targetField}"
            ELSE e."${config.sourceField}"
          END AS current_node,
          ps.distance + 1,
          ps.path || CASE
            WHEN e."${config.sourceField}" = ps.current_node THEN e."${config.targetField}"
            ELSE e."${config.sourceField}"
          END
        FROM path_search ps
        JOIN "${config.edgeTable}" e ON (
          e."${config.sourceField}" = ps.current_node OR
          e."${config.targetField}" = ps.current_node
        )
        WHERE NOT (
          CASE
            WHEN e."${config.sourceField}" = ps.current_node THEN e."${config.targetField}"
            ELSE e."${config.sourceField}"
          END = ANY(ps.path)
        )
      )
      SELECT path, distance
      FROM path_search
      WHERE current_node = :endNodeId
      ORDER BY distance
      LIMIT 1
    `;

    const [result] = await sequelize.query<{ path: any[]; distance: number }>(query, {
      replacements: { startNodeId, endNodeId },
      type: QueryTypes.SELECT,
      transaction,
    });

    if (result) {
      logger.log(`Shortest path found: ${result.distance} steps`);
      return result;
    }

    logger.log('No path found between nodes');
    return null;
  } catch (error) {
    logger.error('Shortest path search failed', error);
    throw new InternalServerErrorException('Shortest path search failed');
  }
}

/**
 * Execute pivot operation (convert rows to columns)
 *
 * @param sequelize - Sequelize instance
 * @param config - Pivot configuration
 * @param transaction - Optional transaction
 * @returns Pivoted data
 *
 * @example
 * ```typescript
 * const pivoted = await executePivot(
 *   sequelize,
 *   {
 *     sourceTable: 'sales',
 *     rowField: 'product_name',
 *     columnField: 'month',
 *     valueField: 'revenue',
 *     aggregateFunction: 'SUM',
 *     columnValues: ['Jan', 'Feb', 'Mar', 'Apr']
 *   }
 * );
 * ```
 */
export async function executePivot(
  sequelize: Sequelize,
  config: PivotConfig,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('ComplexJoins::executePivot');

  try {
    const pivotClauses = config.columnValues.map(
      value =>
        `${config.aggregateFunction}(CASE WHEN "${config.columnField}" = '${value}' THEN "${config.valueField}" END) AS "${value}"`
    );

    const query = `
      SELECT
        "${config.rowField}",
        ${pivotClauses.join(',\n')}
      FROM "${config.sourceTable}"
      GROUP BY "${config.rowField}"
      ORDER BY "${config.rowField}"
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Pivot executed: ${results.length} rows, ${config.columnValues.length} columns`);
    return results;
  } catch (error) {
    logger.error('Pivot operation failed', error);
    throw new InternalServerErrorException('Pivot operation failed');
  }
}

/**
 * Execute unpivot operation (convert columns to rows)
 *
 * @param sequelize - Sequelize instance
 * @param tableName - Table name
 * @param idColumns - Identifier columns to keep
 * @param valueColumns - Columns to unpivot
 * @param transaction - Optional transaction
 * @returns Unpivoted data
 *
 * @example
 * ```typescript
 * const unpivoted = await executeUnpivot(
 *   sequelize,
 *   'sales_pivot',
 *   ['product_name'],
 *   ['Jan', 'Feb', 'Mar', 'Apr']
 * );
 * ```
 */
export async function executeUnpivot(
  sequelize: Sequelize,
  tableName: string,
  idColumns: string[],
  valueColumns: string[],
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('ComplexJoins::executeUnpivot');

  try {
    const idSelect = idColumns.map(c => `"${c}"`).join(', ');

    const unpivotClauses = valueColumns.map(
      col => `SELECT ${idSelect}, '${col}' AS attribute, "${col}" AS value FROM "${tableName}"`
    );

    const query = unpivotClauses.join('\nUNION ALL\n');

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Unpivot executed: ${results.length} rows`);
    return results;
  } catch (error) {
    logger.error('Unpivot operation failed', error);
    throw new InternalServerErrorException('Unpivot operation failed');
  }
}

/**
 * Execute nested set model query (for hierarchical data)
 *
 * @param sequelize - Sequelize instance
 * @param tableName - Table name with left/right values
 * @param nodeId - Node ID to query
 * @param operation - Operation type
 * @param transaction - Optional transaction
 * @returns Query results
 *
 * @example
 * ```typescript
 * const descendants = await executeNestedSetQuery(
 *   sequelize,
 *   'categories',
 *   5,
 *   'descendants'
 * );
 * ```
 */
export async function executeNestedSetQuery(
  sequelize: Sequelize,
  tableName: string,
  nodeId: any,
  operation: 'ancestors' | 'descendants' | 'siblings' | 'path',
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('ComplexJoins::executeNestedSetQuery');

  try {
    let query: string;

    switch (operation) {
      case 'descendants':
        query = `
          SELECT child.*
          FROM "${tableName}" parent, "${tableName}" child
          WHERE child.lft BETWEEN parent.lft AND parent.rgt
            AND parent.id = :nodeId
            AND child.id != :nodeId
          ORDER BY child.lft
        `;
        break;

      case 'ancestors':
        query = `
          SELECT parent.*
          FROM "${tableName}" node, "${tableName}" parent
          WHERE node.lft BETWEEN parent.lft AND parent.rgt
            AND node.id = :nodeId
            AND parent.id != :nodeId
          ORDER BY parent.lft
        `;
        break;

      case 'siblings':
        query = `
          SELECT sibling.*
          FROM "${tableName}" node, "${tableName}" parent, "${tableName}" sibling
          WHERE node.id = :nodeId
            AND node.lft BETWEEN parent.lft AND parent.rgt
            AND sibling.lft BETWEEN parent.lft AND parent.rgt
            AND sibling.id != :nodeId
            AND sibling.parent_id = node.parent_id
          ORDER BY sibling.lft
        `;
        break;

      case 'path':
        query = `
          SELECT parent.*
          FROM "${tableName}" node, "${tableName}" parent
          WHERE node.lft BETWEEN parent.lft AND parent.rgt
            AND node.id = :nodeId
          ORDER BY parent.lft
        `;
        break;

      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    const results = await sequelize.query(query, {
      replacements: { nodeId },
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Nested set query (${operation}): ${results.length} nodes`);
    return results;
  } catch (error) {
    logger.error('Nested set query failed', error);
    throw new InternalServerErrorException('Nested set query failed');
  }
}

/**
 * Execute window function with partitioning
 *
 * @param sequelize - Sequelize instance
 * @param tableName - Table name
 * @param windowFunction - Window function configuration
 * @param partitionBy - Partition by fields
 * @param orderBy - Order by fields
 * @param where - Where conditions
 * @param transaction - Optional transaction
 * @returns Query results with window function
 *
 * @example
 * ```typescript
 * const ranked = await executeWindowFunction(
 *   sequelize,
 *   'sales',
 *   { function: 'RANK', alias: 'sales_rank' },
 *   ['region'],
 *   ['amount DESC'],
 *   "year = 2024"
 * );
 * ```
 */
export async function executeWindowFunction(
  sequelize: Sequelize,
  tableName: string,
  windowFunction: { function: string; alias: string; args?: string },
  partitionBy: string[],
  orderBy: string[],
  where?: string,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('ComplexJoins::executeWindowFunction');

  try {
    const partitionClause =
      partitionBy.length > 0 ? `PARTITION BY ${partitionBy.join(', ')}` : '';
    const orderClause = `ORDER BY ${orderBy.join(', ')}`;
    const args = windowFunction.args || '';

    const whereClause = where ? `WHERE ${where}` : '';

    const query = `
      SELECT
        *,
        ${windowFunction.function}${args} OVER (${partitionClause} ${orderClause}) AS ${windowFunction.alias}
      FROM "${tableName}"
      ${whereClause}
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Window function executed: ${results.length} results`);
    return results;
  } catch (error) {
    logger.error('Window function query failed', error);
    throw new InternalServerErrorException('Window function query failed');
  }
}

/**
 * Execute anti-join (find records without matches)
 *
 * @param sequelize - Sequelize instance
 * @param leftTable - Left table
 * @param rightTable - Right table
 * @param joinCondition - Join condition
 * @param select - Select columns from left table
 * @param where - Additional where conditions
 * @param transaction - Optional transaction
 * @returns Anti-join results
 *
 * @example
 * ```typescript
 * const orphans = await executeAntiJoin(
 *   sequelize,
 *   'orders',
 *   'shipments',
 *   'orders.id = shipments.order_id',
 *   ['orders.*'],
 *   "orders.status = 'pending'"
 * );
 * ```
 */
export async function executeAntiJoin(
  sequelize: Sequelize,
  leftTable: string,
  rightTable: string,
  joinCondition: string,
  select: string[],
  where?: string,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('ComplexJoins::executeAntiJoin');

  try {
    const selectClause = select.join(', ');
    const whereClause = where ? `AND ${where}` : '';

    const query = `
      SELECT ${selectClause}
      FROM "${leftTable}"
      WHERE NOT EXISTS (
        SELECT 1
        FROM "${rightTable}"
        WHERE ${joinCondition}
      )
      ${whereClause}
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Anti-join executed: ${results.length} unmatched records`);
    return results;
  } catch (error) {
    logger.error('Anti-join failed', error);
    throw new InternalServerErrorException('Anti-join failed');
  }
}

/**
 * Execute semi-join (find records with matches, return only left side)
 *
 * @param sequelize - Sequelize instance
 * @param leftTable - Left table
 * @param rightTable - Right table
 * @param joinCondition - Join condition
 * @param select - Select columns from left table
 * @param where - Additional where conditions
 * @param transaction - Optional transaction
 * @returns Semi-join results
 *
 * @example
 * ```typescript
 * const customersWithOrders = await executeSemiJoin(
 *   sequelize,
 *   'customers',
 *   'orders',
 *   'customers.id = orders.customer_id',
 *   ['customers.*'],
 *   "orders.amount > 1000"
 * );
 * ```
 */
export async function executeSemiJoin(
  sequelize: Sequelize,
  leftTable: string,
  rightTable: string,
  joinCondition: string,
  select: string[],
  where?: string,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('ComplexJoins::executeSemiJoin');

  try {
    const selectClause = select.join(', ');
    const whereClause = where ? `AND ${where}` : '';

    const query = `
      SELECT ${selectClause}
      FROM "${leftTable}"
      WHERE EXISTS (
        SELECT 1
        FROM "${rightTable}"
        WHERE ${joinCondition}
        ${whereClause}
      )
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Semi-join executed: ${results.length} matched records`);
    return results;
  } catch (error) {
    logger.error('Semi-join failed', error);
    throw new InternalServerErrorException('Semi-join failed');
  }
}

/**
 * Execute multiple CTEs with different materialization strategies
 *
 * @param sequelize - Sequelize instance
 * @param ctes - Array of CTE configurations
 * @param mainQuery - Main query
 * @param transaction - Optional transaction
 * @returns Query results
 *
 * @example
 * ```typescript
 * const results = await executeMaterializedCTEs(
 *   sequelize,
 *   [
 *     { name: 'large_scan', query: '...', materialize: true },
 *     { name: 'small_filter', query: '...', materialize: false }
 *   ],
 *   'SELECT * FROM large_scan JOIN small_filter ...'
 * );
 * ```
 */
export async function executeMaterializedCTEs(
  sequelize: Sequelize,
  ctes: Array<{ name: string; query: string; materialize: boolean }>,
  mainQuery: string,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('ComplexJoins::executeMaterializedCTEs');

  try {
    return await executeWithCTE(
      sequelize,
      ctes.map(cte => ({
        name: cte.name,
        query: cte.query,
        materialize: cte.materialize,
      })),
      mainQuery,
      transaction
    );
  } catch (error) {
    logger.error('Materialized CTEs failed', error);
    throw new InternalServerErrorException('Materialized CTEs failed');
  }
}

/**
 * Execute table function join (LATERAL with table functions)
 *
 * @param sequelize - Sequelize instance
 * @param baseTable - Base table
 * @param tableFunction - Table function call
 * @param functionAlias - Alias for function result
 * @param where - Where conditions
 * @param transaction - Optional transaction
 * @returns Query results
 *
 * @example
 * ```typescript
 * const results = await executeTableFunctionJoin(
 *   sequelize,
 *   'orders',
 *   'get_order_items(orders.id)',
 *   'items',
 *   "orders.status = 'completed'"
 * );
 * ```
 */
export async function executeTableFunctionJoin(
  sequelize: Sequelize,
  baseTable: string,
  tableFunction: string,
  functionAlias: string,
  where?: string,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('ComplexJoins::executeTableFunctionJoin');

  try {
    const whereClause = where ? `WHERE ${where}` : '';

    const query = `
      SELECT *
      FROM "${baseTable}"
      CROSS JOIN LATERAL ${tableFunction} AS ${functionAlias}
      ${whereClause}
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Table function join executed: ${results.length} results`);
    return results;
  } catch (error) {
    logger.error('Table function join failed', error);
    throw new InternalServerErrorException('Table function join failed');
  }
}

/**
 * Execute window function with custom frame
 *
 * @param sequelize - Sequelize instance
 * @param tableName - Table name
 * @param windowFunction - Window function
 * @param frameClause - Frame specification
 * @param partitionBy - Partition by fields
 * @param orderBy - Order by fields
 * @param transaction - Optional transaction
 * @returns Query results with windowed aggregates
 *
 * @example
 * ```typescript
 * const movingAvg = await executeWindowWithFrame(
 *   sequelize,
 *   'stock_prices',
 *   { function: 'AVG', field: 'price', alias: 'moving_avg' },
 *   'ROWS BETWEEN 6 PRECEDING AND CURRENT ROW',
 *   ['symbol'],
 *   ['date']
 * );
 * ```
 */
export async function executeWindowWithFrame(
  sequelize: Sequelize,
  tableName: string,
  windowFunction: { function: string; field: string; alias: string },
  frameClause: string,
  partitionBy: string[],
  orderBy: string[],
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('ComplexJoins::executeWindowWithFrame');

  try {
    const partitionClause =
      partitionBy.length > 0 ? `PARTITION BY ${partitionBy.join(', ')}` : '';
    const orderClause = `ORDER BY ${orderBy.join(', ')}`;

    const query = `
      SELECT
        *,
        ${windowFunction.function}("${windowFunction.field}") OVER (
          ${partitionClause}
          ${orderClause}
          ${frameClause}
        ) AS ${windowFunction.alias}
      FROM "${tableName}"
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Window with frame executed: ${results.length} results`);
    return results;
  } catch (error) {
    logger.error('Window with frame query failed', error);
    throw new InternalServerErrorException('Window with frame query failed');
  }
}

/**
 * Execute multi-way join with optimization hints
 *
 * @param sequelize - Sequelize instance
 * @param joins - Array of join configurations
 * @param select - Select columns
 * @param where - Where conditions
 * @param orderBy - Order by
 * @param limit - Result limit
 * @param transaction - Optional transaction
 * @returns Optimized multi-way join results
 *
 * @example
 * ```typescript
 * const results = await executeOptimizedMultiJoin(
 *   sequelize,
 *   [
 *     { table: 'orders', alias: 'o', type: 'base' },
 *     { table: 'customers', alias: 'c', type: 'INNER', on: 'o.customer_id = c.id' },
 *     { table: 'products', alias: 'p', type: 'INNER', on: 'o.product_id = p.id' }
 *   ],
 *   ['o.*, c.name, p.title'],
 *   "o.status = 'completed'",
 *   ['o.created_at DESC'],
 *   100
 * );
 * ```
 */
export async function executeOptimizedMultiJoin(
  sequelize: Sequelize,
  joins: Array<{ table: string; alias: string; type: 'base' | 'INNER' | 'LEFT' | 'RIGHT'; on?: string }>,
  select: string[],
  where?: string,
  orderBy?: string[],
  limit?: number,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('ComplexJoins::executeOptimizedMultiJoin');

  try {
    const baseJoin = joins.find(j => j.type === 'base');
    if (!baseJoin) {
      throw new Error('Base table not specified');
    }

    const otherJoins = joins.filter(j => j.type !== 'base');

    const joinClauses = otherJoins.map(join => {
      return `${join.type} JOIN ${join.table} AS ${join.alias} ON ${join.on}`;
    });

    const selectClause = select.join(', ');
    const whereClause = where ? `WHERE ${where}` : '';
    const orderByClause = orderBy && orderBy.length > 0 ? `ORDER BY ${orderBy.join(', ')}` : '';
    const limitClause = limit ? `LIMIT ${limit}` : '';

    const query = `
      SELECT ${selectClause}
      FROM ${baseJoin.table} AS ${baseJoin.alias}
      ${joinClauses.join('\n')}
      ${whereClause}
      ${orderByClause}
      ${limitClause}
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Optimized multi-join: ${results.length} results from ${joins.length} tables`);
    return results;
  } catch (error) {
    logger.error('Optimized multi-join failed', error);
    throw new InternalServerErrorException('Optimized multi-join failed');
  }
}

/**
 * Execute breadth-first search in graph
 *
 * @param sequelize - Sequelize instance
 * @param config - Graph configuration
 * @param startNodeId - Starting node
 * @param maxDepth - Maximum depth
 * @param transaction - Optional transaction
 * @returns BFS traversal results
 *
 * @example
 * ```typescript
 * const bfs = await executeBreadthFirstSearch(
 *   sequelize,
 *   {
 *     nodeTable: 'pages',
 *     edgeTable: 'links',
 *     nodeIdField: 'id',
 *     sourceField: 'from_page',
 *     targetField: 'to_page'
 *   },
 *   'home',
 *   5
 * );
 * ```
 */
export async function executeBreadthFirstSearch(
  sequelize: Sequelize,
  config: Omit<GraphTraversalConfig, 'startNodeId' | 'maxDepth' | 'direction'>,
  startNodeId: any,
  maxDepth: number = 10,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('ComplexJoins::executeBreadthFirstSearch');

  try {
    return await executeGraphTraversal(
      sequelize,
      {
        ...config,
        startNodeId,
        maxDepth,
        direction: 'forward',
      },
      transaction
    );
  } catch (error) {
    logger.error('Breadth-first search failed', error);
    throw new InternalServerErrorException('Breadth-first search failed');
  }
}

/**
 * Export all complex join functions
 */
export const ComplexJoinOperations = {
  executeComplexJoin,
  executeWithCTE,
  executeRecursiveCTE,
  executeLateralJoin,
  executeSelfJoin,
  executeCrossJoin,
  executeFullOuterJoin,
  executeGraphTraversal,
  findShortestPath,
  executePivot,
  executeUnpivot,
  executeNestedSetQuery,
  executeWindowFunction,
  executeAntiJoin,
  executeSemiJoin,
  executeMaterializedCTEs,
  executeTableFunctionJoin,
  executeWindowWithFrame,
  executeOptimizedMultiJoin,
  executeBreadthFirstSearch,
};
