"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeQueryPlan = analyzeQueryPlan;
exports.rewriteQueryForPerformance = rewriteQueryForPerformance;
exports.detectSlowQueries = detectSlowQueries;
exports.optimizeJoinOrder = optimizeJoinOrder;
exports.identifyNPlusOneQueries = identifyNPlusOneQueries;
exports.suggestCompositeIndexes = suggestCompositeIndexes;
exports.analyzeQueryCache = analyzeQueryCache;
exports.optimizePagination = optimizePagination;
exports.detectCartesianProduct = detectCartesianProduct;
exports.suggestCoveringIndex = suggestCoveringIndex;
const sequelize_1 = require("sequelize");
const index_management_service_1 = require("./index-management.service");
async function analyzeQueryPlan(sequelize, query, replacements = {}) {
    const dialect = sequelize.getDialect();
    const recommendations = [];
    let indexesUsed = [];
    let fullScans = 0;
    if (dialect === 'postgres') {
        const [result] = await sequelize.query(`EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) ${query}`, {
            replacements,
            type: sequelize_1.QueryTypes.SELECT,
        });
        const plan = result[0]['QUERY PLAN'][0];
        const planNode = plan.Plan;
        const executionTime = plan['Execution Time'] || 0;
        const planningTime = plan['Planning Time'] || 0;
        const parsePlan = (node) => {
            if (node['Node Type'] === 'Seq Scan') {
                fullScans++;
                recommendations.push(`Sequential scan on ${node['Relation Name']} - consider adding an index`);
            }
            if (node['Index Name']) {
                indexesUsed.push(node['Index Name']);
            }
            if (node.Plans) {
                node.Plans.forEach(parsePlan);
            }
        };
        parsePlan(planNode);
        if (fullScans > 0) {
            recommendations.push(`Query performs ${fullScans} full table scan(s)`);
        }
        if (executionTime > 1000) {
            recommendations.push('Query execution time exceeds 1 second - optimization needed');
        }
        if (planNode['Total Cost'] > 10000) {
            recommendations.push('High query cost detected - review query structure');
        }
        return {
            query,
            executionTime,
            planningTime,
            totalCost: planNode['Total Cost'],
            rows: (planNode['Actual Rows'] || planNode['Plan Rows']),
            cached: false,
            indexesUsed,
            fullScans,
            recommendations,
        };
    }
    else if (dialect === 'mysql') {
        const [result] = await sequelize.query(`EXPLAIN FORMAT=JSON ${query}`, {
            replacements,
            type: sequelize_1.QueryTypes.SELECT,
        });
        const plan = JSON.parse(result[0]['EXPLAIN']);
        return {
            query,
            executionTime: 0,
            planningTime: 0,
            totalCost: plan.query_block?.cost_info?.query_cost || 0,
            rows: plan.query_block?.cost_info?.rows_examined || 0,
            cached: false,
            indexesUsed: [],
            fullScans: 0,
            recommendations: ['Use EXPLAIN ANALYZE for detailed performance metrics'],
        };
    }
    return {
        query,
        executionTime: 0,
        planningTime: 0,
        totalCost: 0,
        rows: 0,
        cached: false,
        indexesUsed: [],
        fullScans: 0,
        recommendations: [],
    };
}
function rewriteQueryForPerformance(query) {
    let optimized = query;
    if (optimized.includes('SELECT *')) {
    }
    optimized = optimized.replace(/WHERE\s+(\w+)\s*\(\s*(\w+)\s*\)\s*=/gi, 'WHERE $2 =');
    if (optimized.includes('NOT IN')) {
    }
    if (!optimized.match(/LIMIT\s+\d+/i) && !optimized.includes('COUNT(')) {
    }
    return optimized;
}
async function detectSlowQueries(sequelize, thresholdMs = 1000, limit = 20) {
    const dialect = sequelize.getDialect();
    if (dialect === 'postgres') {
        const [results] = await sequelize.query(`
      SELECT
        query,
        mean_exec_time AS "avgTime",
        calls
      FROM pg_stat_statements
      WHERE mean_exec_time > :threshold
        AND query NOT LIKE '%pg_stat_statements%'
      ORDER BY mean_exec_time DESC
      LIMIT :limit
    `, {
            replacements: { threshold: thresholdMs, limit },
            type: sequelize_1.QueryTypes.SELECT,
        });
        return results;
    }
    return [];
}
async function optimizeJoinOrder(sequelize, query) {
    try {
        const tablePattern = /FROM\s+(\w+)(?:\s+AS\s+)?(\w+)?|(?:INNER\s+|LEFT\s+|RIGHT\s+|FULL\s+)?JOIN\s+(\w+)(?:\s+AS\s+)?(\w+)?/gi;
        const tables = [];
        const joinConditions = [];
        let match;
        while ((match = tablePattern.exec(query)) !== null) {
            const tableName = match[1] || match[3];
            const alias = match[2] || match[4];
            if (tableName && !tables.some(t => t.name === tableName)) {
                tables.push({ name: tableName, alias: alias || tableName });
            }
        }
        if (tables.length < 2) {
            return query;
        }
        const onPattern = /ON\s+([^WHERE\s]+?)(?:WHERE|GROUP BY|ORDER BY|LIMIT|$)/gi;
        let onMatch;
        while ((onMatch = onPattern.exec(query)) !== null) {
            joinConditions.push(onMatch[1].trim());
        }
        const tableSizes = new Map();
        for (const table of tables) {
            try {
                const [result] = await sequelize.query(`SELECT COUNT(*) as count FROM "${table.name}"`, { type: sequelize_1.QueryTypes.SELECT });
                const row = result;
                tableSizes.set(table.name, row.count || 0);
            }
            catch (error) {
                tableSizes.set(table.name, 1000);
            }
        }
        tables.sort((a, b) => (tableSizes.get(a.name) || 0) - (tableSizes.get(b.name) || 0));
        const selectMatch = query.match(/SELECT\s+(.+?)\s+FROM/i);
        const whereMatch = query.match(/WHERE\s+(.+?)(?:GROUP BY|ORDER BY|LIMIT|$)/i);
        const groupByMatch = query.match(/GROUP BY\s+(.+?)(?:ORDER BY|LIMIT|$)/i);
        const orderByMatch = query.match(/ORDER BY\s+(.+?)(?:LIMIT|$)/i);
        const limitMatch = query.match(/LIMIT\s+(\d+)/i);
        if (!selectMatch) {
            return query;
        }
        const selectClause = selectMatch[1];
        const whereClause = whereMatch ? whereMatch[1] : null;
        const groupByClause = groupByMatch ? groupByMatch[1] : null;
        const orderByClause = orderByMatch ? orderByMatch[1] : null;
        const limitClause = limitMatch ? limitMatch[1] : null;
        let optimizedQuery = `SELECT ${selectClause} FROM `;
        const firstTable = tables[0];
        optimizedQuery += `"${firstTable.name}"`;
        if (firstTable.alias && firstTable.alias !== firstTable.name) {
            optimizedQuery += ` AS ${firstTable.alias}`;
        }
        for (let i = 1; i < tables.length; i++) {
            const table = tables[i];
            const joinTypePattern = new RegExp(`(INNER|LEFT|RIGHT|FULL)?\\s*JOIN\\s+${table.name}`, 'i');
            const joinTypeMatch = query.match(joinTypePattern);
            const joinType = joinTypeMatch?.[1] ? `${joinTypeMatch[1]} JOIN` : 'JOIN';
            optimizedQuery += ` ${joinType} "${table.name}"`;
            if (table.alias && table.alias !== table.name) {
                optimizedQuery += ` AS ${table.alias}`;
            }
            const relevantCondition = joinConditions.find(cond => cond.includes(table.alias || table.name));
            if (relevantCondition) {
                optimizedQuery += ` ON ${relevantCondition}`;
            }
        }
        if (whereClause) {
            optimizedQuery += ` WHERE ${whereClause}`;
        }
        if (groupByClause) {
            optimizedQuery += ` GROUP BY ${groupByClause}`;
        }
        if (orderByClause) {
            optimizedQuery += ` ORDER BY ${orderByClause}`;
        }
        if (limitClause) {
            optimizedQuery += ` LIMIT ${limitClause}`;
        }
        return optimizedQuery;
    }
    catch (error) {
        console.error('[QUERY OPTIMIZATION ERROR]', error);
        return query;
    }
}
function identifyNPlusOneQueries(queries) {
    const patterns = new Map();
    for (const query of queries) {
        const normalized = query
            .replace(/=\s*\d+/g, '= ?')
            .replace(/=\s*'[^']*'/g, "= ?")
            .replace(/IN\s*\([^)]+\)/gi, 'IN (?)');
        patterns.set(normalized, (patterns.get(normalized) || 0) + 1);
    }
    const nPlusOnePatterns = [];
    for (const [query, count] of patterns) {
        if (count > 10) {
            nPlusOnePatterns.push({ query, count });
        }
    }
    return {
        detected: nPlusOnePatterns.length > 0,
        patterns: nPlusOnePatterns,
    };
}
async function suggestCompositeIndexes(sequelize, queries) {
    const recommendations = [];
    const wherePatterns = new Map();
    for (const query of queries) {
        const whereMatch = query.match(/WHERE\s+(.+?)(?:GROUP BY|ORDER BY|LIMIT|$)/i);
        if (!whereMatch)
            continue;
        const whereClause = whereMatch[1];
        const tableMatch = query.match(/FROM\s+(\w+)/i);
        if (!tableMatch)
            continue;
        const tableName = tableMatch[1];
        const columns = whereClause
            .match(/(\w+)\s*[=<>]/g)
            ?.map(m => m.replace(/\s*[=<>]/, '')) || [];
        if (columns.length > 1) {
            if (!wherePatterns.has(tableName)) {
                wherePatterns.set(tableName, new Set());
            }
            wherePatterns.get(tableName).add(columns.join(','));
        }
    }
    for (const [tableName, columnSets] of wherePatterns) {
        for (const columnSet of columnSets) {
            const columns = columnSet.split(',');
            recommendations.push({
                tableName,
                columns,
                reason: `Frequent multi-column filtering detected on ${tableName}`,
                estimatedImprovement: 70,
                priority: 'high',
                indexType: 'btree',
                createStatement: `CREATE INDEX idx_${tableName}_${columns.join('_')} ON "${tableName}" (${columns.map(c => `"${c}"`).join(', ')})`,
            });
        }
    }
    return recommendations;
}
async function analyzeQueryCache(sequelize) {
    const dialect = sequelize.getDialect();
    if (dialect === 'postgres') {
        const [result] = await sequelize.query(`
      SELECT
        sum(heap_blks_hit) AS heap_hit,
        sum(heap_blks_read) AS heap_read,
        sum(idx_blks_hit) AS idx_hit,
        sum(idx_blks_read) AS idx_read
      FROM pg_statio_user_tables
    `, { type: sequelize_1.QueryTypes.SELECT });
        const stats = result[0];
        const totalHits = (stats.heap_hit || 0) + (stats.idx_hit || 0);
        const totalMisses = (stats.heap_read || 0) + (stats.idx_read || 0);
        const total = totalHits + totalMisses;
        return {
            hitRate: total > 0 ? totalHits / total : 0,
            missRate: total > 0 ? totalMisses / total : 0,
            totalHits,
            totalMisses,
            bufferCacheSize: 0,
            sharedBuffers: 0,
            effectiveCacheSize: 0,
        };
    }
    return {
        hitRate: 0,
        missRate: 0,
        totalHits: 0,
        totalMisses: 0,
        bufferCacheSize: 0,
        sharedBuffers: 0,
        effectiveCacheSize: 0,
    };
}
function optimizePagination(query, offset, limit) {
    if (offset > 1000) {
        const orderByMatch = query.match(/ORDER BY\s+(\w+)/i);
        if (orderByMatch) {
            const orderColumn = orderByMatch[1];
            return query.replace(/OFFSET\s+\d+/i, `WHERE ${orderColumn} > :lastValue`);
        }
    }
    return query;
}
function detectCartesianProduct(query) {
    const fromClause = query.match(/FROM\s+(.+?)(?:WHERE|GROUP BY|ORDER BY|$)/i);
    if (!fromClause)
        return { hasCartesianProduct: false, tables: [] };
    const tables = fromClause[1]
        .split(',')
        .map(t => t.trim())
        .filter(t => !t.toUpperCase().includes('JOIN'));
    const hasCartesianProduct = tables.length > 1 && !query.includes('JOIN');
    return {
        hasCartesianProduct,
        tables,
    };
}
async function suggestCoveringIndex(sequelize, tableName, selectColumns, whereColumns) {
    const dialect = sequelize.getDialect();
    const orderedWhereColumns = await (0, index_management_service_1.calculateIndexColumnOrder)(sequelize, tableName, whereColumns);
    const includeColumns = selectColumns.filter(col => !whereColumns.includes(col));
    let createStatement;
    if (dialect === 'postgres') {
        createStatement = `CREATE INDEX idx_${tableName}_covering ON "${tableName}" (${orderedWhereColumns.map(c => `"${c}"`).join(', ')})`;
        if (includeColumns.length > 0) {
            createStatement += ` INCLUDE (${includeColumns.map(c => `"${c}"`).join(', ')})`;
        }
    }
    else {
        const allColumns = [...orderedWhereColumns, ...includeColumns];
        createStatement = `CREATE INDEX idx_${tableName}_covering ON \`${tableName}\` (${allColumns.map(c => `\`${c}\``).join(', ')})`;
    }
    return {
        tableName,
        columns: [...orderedWhereColumns, ...includeColumns],
        reason: 'Covering index to avoid table lookups',
        estimatedImprovement: 60,
        priority: 'medium',
        indexType: 'btree',
        createStatement,
    };
}
//# sourceMappingURL=query-optimization.service.js.map