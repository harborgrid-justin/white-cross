"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeComplexJoin = executeComplexJoin;
exports.executeWithCTE = executeWithCTE;
exports.executeRecursiveCTE = executeRecursiveCTE;
exports.executeLateralJoin = executeLateralJoin;
exports.executeCrossJoin = executeCrossJoin;
exports.executeSelfJoin = executeSelfJoin;
exports.executeHierarchicalQuery = executeHierarchicalQuery;
exports.executeGraphTraversal = executeGraphTraversal;
exports.executePivotQuery = executePivotQuery;
exports.executeUnpivotQuery = executeUnpivotQuery;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
async function executeComplexJoin(sequelize, baseTable, joins, select, where, orderBy, limit, transaction) {
    const logger = new common_1.Logger('JoinOperations::executeComplexJoin');
    try {
        const joinClauses = joins.map(join => {
            const tableRef = join.alias ? `${join.table} AS ${join.alias}` : join.table;
            let onClause;
            if (typeof join.on === 'string') {
                onClause = join.on;
            }
            else {
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
            type: sequelize_1.QueryTypes.SELECT,
            transaction,
        });
        logger.log(`Complex join executed: ${results.length} results from ${joins.length + 1} tables`);
        return results;
    }
    catch (error) {
        logger.error('Complex join failed', error);
        throw new common_1.InternalServerErrorException('Complex join failed');
    }
}
async function executeWithCTE(sequelize, ctes, mainQuery, transaction) {
    const logger = new common_1.Logger('JoinOperations::executeWithCTE');
    try {
        const cteDefinitions = ctes.map(cte => {
            const columns = cte.columns ? `(${cte.columns.join(', ')})` : '';
            const materialize = cte.materialize !== false ? 'MATERIALIZED' : 'NOT MATERIALIZED';
            return `${cte.name}${columns} AS ${materialize} (${cte.query})`;
        });
        const cteClause = `WITH ${cteDefinitions.join(',\n')}`;
        const fullQuery = `${cteClause}\n${mainQuery}`;
        const results = await sequelize.query(fullQuery, {
            type: sequelize_1.QueryTypes.SELECT,
            transaction,
        });
        logger.log(`CTE query executed: ${ctes.length} CTEs, ${results.length} results`);
        return results;
    }
    catch (error) {
        logger.error('CTE query failed', error);
        throw new common_1.InternalServerErrorException('CTE query failed');
    }
}
async function executeRecursiveCTE(sequelize, recursiveCTE, mainQuery, transaction) {
    const logger = new common_1.Logger('JoinOperations::executeRecursiveCTE');
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
            type: sequelize_1.QueryTypes.SELECT,
            transaction,
        });
        logger.log(`Recursive CTE query executed: ${results.length} results`);
        return results;
    }
    catch (error) {
        logger.error('Recursive CTE query failed', error);
        throw new common_1.InternalServerErrorException('Recursive CTE query failed');
    }
}
async function executeLateralJoin(sequelize, baseTable, lateralJoins, select, where, orderBy, limit, transaction) {
    const logger = new common_1.Logger('JoinOperations::executeLateralJoin');
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
            type: sequelize_1.QueryTypes.SELECT,
            transaction,
        });
        logger.log(`Lateral join executed: ${results.length} results with ${lateralJoins.length} lateral joins`);
        return results;
    }
    catch (error) {
        logger.error('Lateral join failed', error);
        throw new common_1.InternalServerErrorException('Lateral join failed');
    }
}
async function executeCrossJoin(sequelize, tables, select, where, orderBy, limit, transaction) {
    const logger = new common_1.Logger('JoinOperations::executeCrossJoin');
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
            type: sequelize_1.QueryTypes.SELECT,
            transaction,
        });
        logger.log(`Cross join executed: ${results.length} results from ${tables.length} tables`);
        return results;
    }
    catch (error) {
        logger.error('Cross join failed', error);
        throw new common_1.InternalServerErrorException('Cross join failed');
    }
}
async function executeSelfJoin(sequelize, table, alias1, alias2, joinCondition, select, where, orderBy, limit, transaction) {
    const logger = new common_1.Logger('JoinOperations::executeSelfJoin');
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
            type: sequelize_1.QueryTypes.SELECT,
            transaction,
        });
        logger.log(`Self join executed: ${results.length} results`);
        return results;
    }
    catch (error) {
        logger.error('Self join failed', error);
        throw new common_1.InternalServerErrorException('Self join failed');
    }
}
async function executeHierarchicalQuery(sequelize, table, config, select, orderBy, transaction) {
    const logger = new common_1.Logger('JoinOperations::executeHierarchicalQuery');
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
    }
    catch (error) {
        logger.error('Hierarchical query failed', error);
        throw new common_1.InternalServerErrorException('Hierarchical query failed');
    }
}
async function executeGraphTraversal(sequelize, edgeTable, config, transaction) {
    const logger = new common_1.Logger('JoinOperations::executeGraphTraversal');
    try {
        const startNodesList = config.startNodes.map(n => `'${n}'`).join(', ');
        let recursiveJoinCondition;
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
        let nextNodeExpression;
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
        return results;
    }
    catch (error) {
        logger.error('Graph traversal failed', error);
        throw new common_1.InternalServerErrorException('Graph traversal failed');
    }
}
async function executePivotQuery(sequelize, table, config, where, transaction) {
    const logger = new common_1.Logger('JoinOperations::executePivotQuery');
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
            type: sequelize_1.QueryTypes.SELECT,
            transaction,
        });
        logger.log(`Pivot query executed: ${results.length} results`);
        return results;
    }
    catch (error) {
        logger.error('Pivot query failed', error);
        throw new common_1.InternalServerErrorException('Pivot query failed');
    }
}
async function executeUnpivotQuery(sequelize, table, config, where, transaction) {
    const logger = new common_1.Logger('JoinOperations::executeUnpivotQuery');
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
            type: sequelize_1.QueryTypes.SELECT,
            transaction,
        });
        logger.log(`Unpivot query executed: ${results.length} results`);
        return results;
    }
    catch (error) {
        logger.error('Unpivot query failed', error);
        throw new common_1.InternalServerErrorException('Unpivot query failed');
    }
}
//# sourceMappingURL=join-operations.service.js.map