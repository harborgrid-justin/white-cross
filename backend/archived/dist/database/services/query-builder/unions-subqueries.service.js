"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnionsSubqueries = void 0;
exports.buildExistsSubquery = buildExistsSubquery;
exports.buildInSubquery = buildInSubquery;
exports.buildUnionQuery = buildUnionQuery;
exports.buildIntersectQuery = buildIntersectQuery;
exports.buildParameterizedQuery = buildParameterizedQuery;
exports.buildCTEQuery = buildCTEQuery;
exports.buildRecursiveCTE = buildRecursiveCTE;
exports.buildExceptQuery = buildExceptQuery;
exports.buildValuesQuery = buildValuesQuery;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
function buildExistsSubquery(model, where, correlationField) {
    const logger = new common_1.Logger('UnionsSubqueries::buildExistsSubquery');
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(correlationField)) {
        throw new Error(`Invalid correlation field name: ${correlationField}`);
    }
    const sequelize = model.sequelize;
    if (!sequelize) {
        throw new Error('Model does not have sequelize instance');
    }
    const tableName = model.getTableName();
    const quotedTableName = sequelize.getQueryInterface().quoteTable(tableName);
    const quotedCorrelationField = sequelize.getQueryInterface().quoteIdentifier(correlationField);
    const whereConditions = Object.entries(where)
        .map(([key, value]) => {
        const quotedKey = sequelize.getQueryInterface().quoteIdentifier(key);
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            return `${quotedKey} = ${sequelize.escape(String(value))}`;
        }
        else {
            logger.warn('Complex WHERE conditions in EXISTS subquery may not be properly escaped');
            return `${quotedKey} = ${sequelize.escape(String(value))}`;
        }
    })
        .join(' AND ');
    return (0, sequelize_1.literal)(`EXISTS (
    SELECT 1 FROM ${quotedTableName}
    WHERE ${quotedCorrelationField} = "${model.name}"."id"
    ${whereConditions ? `AND ${whereConditions}` : ''}
  )`);
}
function buildInSubquery(model, selectField, where) {
    const logger = new common_1.Logger('UnionsSubqueries::buildInSubquery');
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(selectField)) {
        throw new Error(`Invalid select field name: ${selectField}`);
    }
    const sequelize = model.sequelize;
    if (!sequelize) {
        throw new Error('Model does not have sequelize instance');
    }
    const tableName = model.getTableName();
    const quotedTableName = sequelize.getQueryInterface().quoteTable(tableName);
    const quotedSelectField = sequelize.getQueryInterface().quoteIdentifier(selectField);
    const whereConditions = Object.entries(where)
        .map(([key, value]) => {
        const quotedKey = sequelize.getQueryInterface().quoteIdentifier(key);
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            return `${quotedKey} = ${sequelize.escape(String(value))}`;
        }
        else {
            logger.warn('Complex WHERE conditions in IN subquery may not be properly escaped');
            return `${quotedKey} = ${sequelize.escape(String(value))}`;
        }
    })
        .join(' AND ');
    return (0, sequelize_1.literal)(`(
    SELECT ${quotedSelectField} FROM ${quotedTableName}
    ${whereConditions ? `WHERE ${whereConditions}` : ''}
  )`);
}
async function buildUnionQuery(queries, unionType = 'UNION', sequelize) {
    const logger = new common_1.Logger('UnionsSubqueries::buildUnionQuery');
    try {
        const unionQueries = queries.map(q => `(${q.query})`).join(` ${unionType} `);
        const [results] = await sequelize.query(unionQueries, {
            replacements: queries[0]?.replacements,
        });
        logger.log(`Union query executed: ${queries.length} queries, ${results.length} results`);
        return results;
    }
    catch (error) {
        logger.error('Union query failed', error);
        throw new common_1.InternalServerErrorException('Union query failed');
    }
}
async function buildIntersectQuery(queries, sequelize) {
    const logger = new common_1.Logger('UnionsSubqueries::buildIntersectQuery');
    try {
        const intersectQuery = queries.map(q => `(${q.query})`).join(' INTERSECT ');
        const [results] = await sequelize.query(intersectQuery, {
            replacements: queries[0]?.replacements,
        });
        logger.log(`Intersect query executed: ${queries.length} queries, ${results.length} results`);
        return results;
    }
    catch (error) {
        logger.error('Intersect query failed', error);
        throw new common_1.InternalServerErrorException('Intersect query failed');
    }
}
async function buildParameterizedQuery(sql, replacements, sequelize) {
    const logger = new common_1.Logger('UnionsSubqueries::buildParameterizedQuery');
    try {
        const [results] = await sequelize.query(sql, {
            replacements,
            type: sequelize_1.QueryTypes.SELECT,
        });
        logger.log(`Parameterized query executed: ${results.length} results`);
        return results;
    }
    catch (error) {
        logger.error('Parameterized query failed', error);
        throw new common_1.InternalServerErrorException('Parameterized query failed');
    }
}
async function buildCTEQuery(ctes, mainQuery, sequelize) {
    const logger = new common_1.Logger('UnionsSubqueries::buildCTEQuery');
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
        logger.log(`CTE query executed: ${ctes.length} CTEs, ${results.length} results`);
        return results;
    }
    catch (error) {
        logger.error('CTE query failed', error);
        throw new common_1.InternalServerErrorException('CTE query failed');
    }
}
async function buildRecursiveCTE(anchorQuery, recursiveQuery, cteName, mainQuery, sequelize) {
    const logger = new common_1.Logger('UnionsSubqueries::buildRecursiveCTE');
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
        logger.log(`Recursive CTE query executed: ${cteName}, ${results.length} results`);
        return results;
    }
    catch (error) {
        logger.error('Recursive CTE query failed', error);
        throw new common_1.InternalServerErrorException('Recursive CTE query failed');
    }
}
async function buildExceptQuery(queries, sequelize) {
    const logger = new common_1.Logger('UnionsSubqueries::buildExceptQuery');
    try {
        const exceptQuery = queries.map(q => `(${q.query})`).join(' EXCEPT ');
        const [results] = await sequelize.query(exceptQuery, {
            replacements: queries[0]?.replacements,
        });
        logger.log(`Except query executed: ${queries.length} queries, ${results.length} results`);
        return results;
    }
    catch (error) {
        logger.error('Except query failed', error);
        throw new common_1.InternalServerErrorException('Except query failed');
    }
}
async function buildValuesQuery(values, columns, sequelize) {
    const logger = new common_1.Logger('UnionsSubqueries::buildValuesQuery');
    try {
        const columnList = columns.join(', ');
        const valueRows = values
            .map(row => `(${row.map(val => sequelize.escape(val)).join(', ')})`)
            .join(', ');
        const query = `SELECT ${columnList} FROM (VALUES ${valueRows}) AS t(${columnList})`;
        const [results] = await sequelize.query(query);
        logger.log(`VALUES query executed: ${values.length} rows, ${columns.length} columns`);
        return results;
    }
    catch (error) {
        logger.error('VALUES query failed', error);
        throw new common_1.InternalServerErrorException('VALUES query failed');
    }
}
exports.UnionsSubqueries = {
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
//# sourceMappingURL=unions-subqueries.service.js.map