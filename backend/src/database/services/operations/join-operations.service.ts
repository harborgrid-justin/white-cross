/**
 * @fileoverview Complex Join Operations Service for Database Operations
 * @module @/database/services/operations/join-operations
 * @description Advanced join operations with CTEs, subqueries, and complex table relationships
 *
 * @version 1.0.0
 */

import { Logger, InternalServerErrorException } from '@nestjs/common';
import { Sequelize, QueryTypes, Transaction } from 'sequelize';
import type { ComplexJoinConfig, CTEConfig } from './interfaces';

/**
 * Execute complex multi-table join
 */
export async function executeComplexJoin(
  sequelize: Sequelize,
  baseTable: string,
  joins: ComplexJoinConfig[],
  select: string[],
  where?: string,
  orderBy?: string[],
  limit?: number,
  transaction?: Transaction
): Promise<unknown[]> {
  const logger = new Logger('JoinOperations::executeComplexJoin');

  try {
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
 */
export async function executeWithCTE(
  sequelize: Sequelize,
  ctes: CTEConfig[],
  mainQuery: string,
  transaction?: Transaction
): Promise<unknown[]> {
  const logger = new Logger('JoinOperations::executeWithCTE');

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
 * Execute recursive CTE query
 */
export async function executeRecursiveCTE(
  sequelize: Sequelize,
  recursiveCTE: {
    name: string;
    columns?: string[];
    baseQuery: string;
    recursiveQuery: string;
    unionType?: 'UNION' | 'UNION ALL';
  },
  mainQuery: string,
  transaction?: Transaction
): Promise<unknown[]> {
  const logger = new Logger('JoinOperations::executeRecursiveCTE');

  try {
    const columns = recursiveCTE.columns ? `(${recursiveCTE.columns.join(', ')})` : '';
    const unionType = recursiveCTE.unionType || 'UNION ALL';

    const recursiveCTEDefinition = `
      ${recursiveCTE.name}${columns} AS (
        ${recursiveCTE.baseQuery}
        ${unionType}
        ${recursiveCTE.recursiveQuery}
      )
    `;

    const fullQuery = `WITH RECURSIVE ${recursiveCTEDefinition}\n${mainQuery}`;

    const results = await sequelize.query(fullQuery, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Recursive CTE query executed: ${results.length} results`);
    return results;
  } catch (error) {
    logger.error('Recursive CTE query failed', error);
    throw new InternalServerErrorException('Recursive CTE query failed');
  }
}

/**
 * Execute lateral join query
 */
export async function executeLateralJoin(
  sequelize: Sequelize,
  baseTable: string,
  lateralJoins: Array<{
    alias: string;
    subquery: string;
    joinType: 'LEFT' | 'INNER';
  }>,
  select: string[],
  where?: string,
  orderBy?: string[],
  limit?: number,
  transaction?: Transaction
): Promise<unknown[]> {
  const logger = new Logger('JoinOperations::executeLateralJoin');

  try {
    const lateralClauses = lateralJoins.map(lateral => {
      return `${lateral.joinType} JOIN LATERAL (${lateral.subquery}) AS ${lateral.alias} ON TRUE`;
    });

    const selectClause = select.join(', ');
    const whereClause = where ? `WHERE ${where}` : '';
    const orderByClause = orderBy && orderBy.length > 0 ? `ORDER BY ${orderBy.join(', ')}` : '';
    const limitClause = limit ? `LIMIT ${limit}` : '';

    const query = `
      SELECT ${selectClause}
      FROM ${baseTable}
      ${lateralClauses.join('\n')}
      ${whereClause}
      ${orderByClause}
      ${limitClause}
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Lateral join executed: ${results.length} results with ${lateralJoins.length} lateral joins`);
    return results;
  } catch (error) {
    logger.error('Lateral join failed', error);
    throw new InternalServerErrorException('Lateral join failed');
  }
}

/**
 * Execute cross join with conditions
 */
export async function executeCrossJoin(
  sequelize: Sequelize,
  tables: Array<{ name: string; alias?: string }>,
  select: string[],
  where?: string,
  orderBy?: string[],
  limit?: number,
  transaction?: Transaction
): Promise<unknown[]> {
  const logger = new Logger('JoinOperations::executeCrossJoin');

  try {
    const baseTable = tables[0];
    const crossJoins = tables.slice(1);

    const baseTableRef = baseTable.alias ? `${baseTable.name} AS ${baseTable.alias}` : baseTable.name;
    
    const crossJoinClauses = crossJoins.map(table => {
      const tableRef = table.alias ? `${table.name} AS ${table.alias}` : table.name;
      return `CROSS JOIN ${tableRef}`;
    });

    const selectClause = select.join(', ');
    const whereClause = where ? `WHERE ${where}` : '';
    const orderByClause = orderBy && orderBy.length > 0 ? `ORDER BY ${orderBy.join(', ')}` : '';
    const limitClause = limit ? `LIMIT ${limit}` : '';

    const query = `
      SELECT ${selectClause}
      FROM ${baseTableRef}
      ${crossJoinClauses.join('\n')}
      ${whereClause}
      ${orderByClause}
      ${limitClause}
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Cross join executed: ${results.length} results from ${tables.length} tables`);
    return results;
  } catch (error) {
    logger.error('Cross join failed', error);
    throw new InternalServerErrorException('Cross join failed');
  }
}

/**
 * Execute self join query
 */
export async function executeSelfJoin(
  sequelize: Sequelize,
  table: string,
  alias1: string,
  alias2: string,
  joinCondition: string,
  select: string[],
  where?: string,
  orderBy?: string[],
  limit?: number,
  transaction?: Transaction
): Promise<unknown[]> {
  const logger = new Logger('JoinOperations::executeSelfJoin');

  try {
    const selectClause = select.join(', ');
    const whereClause = where ? `WHERE ${where}` : '';
    const orderByClause = orderBy && orderBy.length > 0 ? `ORDER BY ${orderBy.join(', ')}` : '';
    const limitClause = limit ? `LIMIT ${limit}` : '';

    const query = `
      SELECT ${selectClause}
      FROM ${table} AS ${alias1}
      JOIN ${table} AS ${alias2} ON ${joinCondition}
      ${whereClause}
      ${orderByClause}
      ${limitClause}
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Self join executed: ${results.length} results`);
    return results;
  } catch (error) {
    logger.error('Self join failed', error);
    throw new InternalServerErrorException('Self join failed');
  }
}

/**
 * Execute hierarchical query using recursive CTE
 */
export async function executeHierarchicalQuery(
  sequelize: Sequelize,
  table: string,
  config: {
    idField: string;
    parentIdField: string;
    rootCondition: string;
    maxDepth?: number;
    depthField?: string;
    pathField?: string;
  },
  select: string[],
  orderBy?: string[],
  transaction?: Transaction
): Promise<unknown[]> {
  const logger = new Logger('JoinOperations::executeHierarchicalQuery');

  try {
    const depthSelect = config.depthField ? `, 1 AS ${config.depthField}` : '';
    const pathSelect = config.pathField ? `, CAST(${config.idField} AS TEXT) AS ${config.pathField}` : '';
    const maxDepthCondition = config.maxDepth ? `WHERE ${config.depthField || 'depth'} < ${config.maxDepth}` : '';

    const depthSelectRecursive = config.depthField ? `, parent.${config.depthField} + 1` : '';
    const pathSelectRecursive = config.pathField 
      ? `, parent.${config.pathField} || '/' || child.${config.idField}` 
      : '';

    const baseQuery = `
      SELECT ${select.join(', ')}${depthSelect}${pathSelect}
      FROM ${table}
      WHERE ${config.rootCondition}
    `;

    const recursiveQuery = `
      SELECT ${select.map(s => `child.${s}`).join(', ')}${depthSelectRecursive}${pathSelectRecursive}
      FROM ${table} child
      JOIN hierarchy parent ON child.${config.parentIdField} = parent.${config.idField}
      ${maxDepthCondition}
    `;

    const recursiveCTE = {
      name: 'hierarchy',
      baseQuery,
      recursiveQuery,
    };

    const mainQuery = `
      SELECT * FROM hierarchy
      ${orderBy && orderBy.length > 0 ? `ORDER BY ${orderBy.join(', ')}` : ''}
    `;

    const results = await executeRecursiveCTE(sequelize, recursiveCTE, mainQuery, transaction);

    logger.log(`Hierarchical query executed: ${results.length} results`);
    return results;
  } catch (error) {
    logger.error('Hierarchical query failed', error);
    throw new InternalServerErrorException('Hierarchical query failed');
  }
}

/**
 * Execute graph traversal query using recursive CTE
 */
export async function executeGraphTraversal(
  sequelize: Sequelize,
  edgeTable: string,
  config: {
    fromField: string;
    toField: string;
    startNodes: (string | number)[];
    maxDepth?: number;
    direction: 'forward' | 'backward' | 'both';
  },
  transaction?: Transaction
): Promise<Array<{ node: string | number; depth: number; path: string }>> {
  const logger = new Logger('JoinOperations::executeGraphTraversal');

  try {
    const startNodesList = config.startNodes.map(n => `'${n}'`).join(', ');
    
    let recursiveJoinCondition: string;
    switch (config.direction) {
      case 'forward':
        recursiveJoinCondition = `parent.node = edge.${config.fromField}`;
        break;
      case 'backward':
        recursiveJoinCondition = `parent.node = edge.${config.toField}`;
        break;
      case 'both':
        recursiveJoinCondition = `(parent.node = edge.${config.fromField} OR parent.node = edge.${config.toField})`;
        break;
    }

    const maxDepthCondition = config.maxDepth ? `WHERE depth < ${config.maxDepth}` : '';

    let nextNodeExpression: string;
    switch (config.direction) {
      case 'forward':
        nextNodeExpression = `edge.${config.toField}`;
        break;
      case 'backward':
        nextNodeExpression = `edge.${config.fromField}`;
        break;
      case 'both':
        nextNodeExpression = `CASE WHEN parent.node = edge.${config.fromField} THEN edge.${config.toField} ELSE edge.${config.fromField} END`;
        break;
    }

    const baseQuery = `
      SELECT node, 0 as depth, CAST(node AS TEXT) as path
      FROM (VALUES ${config.startNodes.map(n => `('${n}')`).join(', ')}) AS start_nodes(node)
    `;

    const recursiveQuery = `
      SELECT ${nextNodeExpression} as node, 
             parent.depth + 1 as depth,
             parent.path || '/' || ${nextNodeExpression} as path
      FROM ${edgeTable} edge
      JOIN graph_traversal parent ON ${recursiveJoinCondition}
      ${maxDepthCondition}
      AND ${nextNodeExpression} NOT LIKE '%' || parent.path || '%'
    `;

    const recursiveCTE = {
      name: 'graph_traversal',
      baseQuery,
      recursiveQuery,
    };

    const mainQuery = `
      SELECT DISTINCT node, depth, path 
      FROM graph_traversal 
      ORDER BY depth, node
    `;

    const results = await executeRecursiveCTE(sequelize, recursiveCTE, mainQuery, transaction);

    logger.log(`Graph traversal executed: ${results.length} nodes visited`);
    return results as Array<{ node: string | number; depth: number; path: string }>;
  } catch (error) {
    logger.error('Graph traversal failed', error);
    throw new InternalServerErrorException('Graph traversal failed');
  }
}

/**
 * Execute pivot query (transform rows to columns)
 */
export async function executePivotQuery(
  sequelize: Sequelize,
  table: string,
  config: {
    groupByFields: string[];
    pivotField: string;
    valueField: string;
    pivotValues: (string | number)[];
    aggregateFunction?: 'SUM' | 'COUNT' | 'AVG' | 'MIN' | 'MAX';
  },
  where?: string,
  transaction?: Transaction
): Promise<unknown[]> {
  const logger = new Logger('JoinOperations::executePivotQuery');

  try {
    const aggregateFunc = config.aggregateFunction || 'SUM';
    const whereClause = where ? `WHERE ${where}` : '';

    const pivotColumns = config.pivotValues.map(value => {
      return `${aggregateFunc}(CASE WHEN ${config.pivotField} = '${value}' THEN ${config.valueField} END) AS "${value}"`;
    }).join(', ');

    const query = `
      SELECT ${config.groupByFields.join(', ')}, ${pivotColumns}
      FROM ${table}
      ${whereClause}
      GROUP BY ${config.groupByFields.join(', ')}
      ORDER BY ${config.groupByFields.join(', ')}
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Pivot query executed: ${results.length} results`);
    return results;
  } catch (error) {
    logger.error('Pivot query failed', error);
    throw new InternalServerErrorException('Pivot query failed');
  }
}

/**
 * Execute unpivot query (transform columns to rows)
 */
export async function executeUnpivotQuery(
  sequelize: Sequelize,
  table: string,
  config: {
    staticFields: string[];
    unpivotColumns: string[];
    columnNameField: string;
    valueField: string;
  },
  where?: string,
  transaction?: Transaction
): Promise<unknown[]> {
  const logger = new Logger('JoinOperations::executeUnpivotQuery');

  try {
    const whereClause = where ? `WHERE ${where}` : '';

    const unpivotUnions = config.unpivotColumns.map(column => {
      return `
        SELECT ${config.staticFields.join(', ')}, 
               '${column}' AS ${config.columnNameField},
               ${column} AS ${config.valueField}
        FROM ${table}
        ${whereClause}
      `;
    }).join(' UNION ALL ');

    const query = `
      SELECT * FROM (
        ${unpivotUnions}
      ) unpivoted
      WHERE ${config.valueField} IS NOT NULL
      ORDER BY ${config.staticFields.join(', ')}, ${config.columnNameField}
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Unpivot query executed: ${results.length} results`);
    return results;
  } catch (error) {
    logger.error('Unpivot query failed', error);
    throw new InternalServerErrorException('Unpivot query failed');
  }
}
