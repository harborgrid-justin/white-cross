"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseOptimizationService = void 0;
exports.listAllIndexes = listAllIndexes;
exports.analyzeIndexUsage = analyzeIndexUsage;
exports.createOptimizedIndex = createOptimizedIndex;
exports.rebuildIndex = rebuildIndex;
exports.analyzeTable = analyzeTable;
exports.findDuplicateIndexes = findDuplicateIndexes;
exports.calculateIndexColumnOrder = calculateIndexColumnOrder;
exports.estimateIndexSize = estimateIndexSize;
exports.validateIndexIntegrity = validateIndexIntegrity;
exports.generateIndexRecommendations = generateIndexRecommendations;
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
exports.getTableStatistics = getTableStatistics;
exports.collectDatabaseStatistics = collectDatabaseStatistics;
exports.updateTableStatistics = updateTableStatistics;
exports.monitorStatisticsStaleness = monitorStatisticsStaleness;
exports.estimateQuerySelectivity = estimateQuerySelectivity;
exports.analyzeColumnCardinality = analyzeColumnCardinality;
exports.getDatabaseSizeStatistics = getDatabaseSizeStatistics;
exports.analyzeDataDistribution = analyzeDataDistribution;
exports.performVacuum = performVacuum;
exports.scheduleAutovacuum = scheduleAutovacuum;
exports.detectVacuumNeeded = detectVacuumNeeded;
exports.vacuumFreeze = vacuumFreeze;
exports.monitorVacuumProgress = monitorVacuumProgress;
exports.reclaimWastedSpace = reclaimWastedSpace;
exports.optimizeTableStructure = optimizeTableStructure;
exports.detectTableBloat = detectTableBloat;
exports.detectIndexBloat = detectIndexBloat;
exports.findBloatedTables = findBloatedTables;
exports.estimateBloatReduction = estimateBloatReduction;
exports.createBloatReport = createBloatReport;
exports.analyzeBufferCacheHitRatio = analyzeBufferCacheHitRatio;
exports.optimizeCacheSettings = optimizeCacheSettings;
exports.warmDatabaseCache = warmDatabaseCache;
exports.analyzeCachedObjects = analyzeCachedObjects;
exports.recommendCacheConfiguration = recommendCacheConfiguration;
const sequelize_1 = require("sequelize");
const common_1 = require("@nestjs/common");
const base_1 = require("../../common/base");
async function listAllIndexes(sequelize, tableName) {
    const dialect = sequelize.getDialect();
    if (dialect === 'postgres') {
        const whereClause = tableName ? `AND t.relname = :tableName` : '';
        const [results] = await sequelize.query(`
      SELECT
        i.relname AS name,
        t.relname AS "tableName",
        array_agg(a.attname ORDER BY a.attnum) AS "columnNames",
        ix.indisunique AS unique,
        am.amname AS type,
        pg_relation_size(i.oid) AS size,
        COALESCE(s.idx_scan, 0) AS scans,
        COALESCE(s.idx_tup_read, 0) AS "tuples_read",
        COALESCE(s.idx_tup_fetch, 0) AS "tuples_fetched",
        pg_get_indexdef(i.oid) AS "indexDef",
        ix.indisvalid AS "isValid"
      FROM pg_class t
      JOIN pg_index ix ON t.oid = ix.indrelid
      JOIN pg_class i ON i.oid = ix.indexrelid
      JOIN pg_am am ON i.relam = am.oid
      JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(ix.indkey)
      LEFT JOIN pg_stat_user_indexes s ON s.indexrelid = i.oid
      WHERE t.relkind = 'r'
        AND t.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
        ${whereClause}
      GROUP BY i.relname, t.relname, ix.indisunique, am.amname, i.oid,
               s.idx_scan, s.idx_tup_read, s.idx_tup_fetch, ix.indisvalid
      ORDER BY t.relname, i.relname
    `, {
            replacements: { tableName },
            type: sequelize_1.QueryTypes.SELECT,
        });
        return results;
    }
    else if (dialect === 'mysql') {
        const whereClause = tableName ? `WHERE TABLE_NAME = :tableName` : '';
        const [results] = await sequelize.query(`
      SELECT
        INDEX_NAME AS name,
        TABLE_NAME AS tableName,
        COLUMN_NAME AS columnName,
        NON_UNIQUE = 0 AS \`unique\`,
        INDEX_TYPE AS type,
        CARDINALITY AS scans
      FROM INFORMATION_SCHEMA.STATISTICS
      WHERE TABLE_SCHEMA = DATABASE()
        ${whereClause}
      ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX
    `, {
            replacements: { tableName },
            type: sequelize_1.QueryTypes.SELECT,
        });
        const indexMap = new Map();
        for (const row of results) {
            if (!indexMap.has(row.name)) {
                indexMap.set(row.name, {
                    name: row.name,
                    tableName: row.tableName,
                    columnNames: [],
                    unique: row.unique,
                    type: row.type.toLowerCase(),
                    size: 0,
                    scans: row.scans || 0,
                    tuples_read: 0,
                    tuples_fetched: 0,
                    indexDef: '',
                    isValid: true,
                });
            }
            indexMap.get(row.name).columnNames.push(row.columnName);
        }
        return Array.from(indexMap.values());
    }
    return [];
}
async function analyzeIndexUsage(sequelize, minScans = 10) {
    const dialect = sequelize.getDialect();
    if (dialect === 'postgres') {
        const [results] = await sequelize.query(`
      SELECT
        schemaname AS "schemaName",
        tablename AS "tableName",
        indexname AS "indexName",
        idx_scan AS "indexScans",
        idx_tup_read AS "tuplesRead",
        idx_tup_fetch AS "tuplesFetched",
        pg_relation_size(indexrelid) AS "sizeBytes",
        CASE
          WHEN idx_scan = 0 THEN 'Never used'
          WHEN idx_scan < :minScans THEN 'Rarely used'
          ELSE NULL
        END AS "unusedReason"
      FROM pg_stat_user_indexes
      WHERE schemaname = 'public'
        AND idx_scan < :minScans
        AND indexname NOT LIKE '%_pkey'
      ORDER BY idx_scan ASC, pg_relation_size(indexrelid) DESC
    `, {
            replacements: { minScans },
            type: sequelize_1.QueryTypes.SELECT,
        });
        return results;
    }
    return [];
}
async function createOptimizedIndex(queryInterface, tableName, columns, options = {}) {
    const { unique = false, name, type = 'btree', where, concurrently = true, operator, } = options;
    const sequelize = queryInterface.sequelize;
    const dialect = sequelize.getDialect();
    const indexName = name || `idx_${tableName}_${columns.join('_')}`;
    if (dialect === 'postgres') {
        const uniqueClause = unique ? 'UNIQUE' : '';
        const concurrentlyClause = concurrently ? 'CONCURRENTLY' : '';
        const columnList = columns.map(col => operator ? `${col} ${operator}` : col).join(', ');
        const whereClause = where ? `WHERE ${where}` : '';
        await sequelize.query(`CREATE ${uniqueClause} INDEX ${concurrentlyClause} "${indexName}"
       ON "${tableName}" USING ${type} (${columnList}) ${whereClause}`, { raw: true });
    }
    else {
        await queryInterface.addIndex(tableName, columns, {
            name: indexName,
            unique,
            type: type === 'btree' ? undefined : type,
            where: where ? { [where]: true } : undefined,
        });
    }
}
async function rebuildIndex(sequelize, indexName, concurrent = true) {
    const dialect = sequelize.getDialect();
    if (dialect === 'postgres') {
        const concurrentlyClause = concurrent ? 'CONCURRENTLY' : '';
        await sequelize.query(`REINDEX INDEX ${concurrentlyClause} "${indexName}"`, {
            raw: true,
        });
    }
    else if (dialect === 'mysql') {
        const [results] = await sequelize.query(`SELECT TABLE_NAME FROM INFORMATION_SCHEMA.STATISTICS
       WHERE INDEX_NAME = :indexName AND TABLE_SCHEMA = DATABASE() LIMIT 1`, {
            replacements: { indexName },
            type: sequelize_1.QueryTypes.SELECT,
        });
        if (results.length > 0) {
            const tableName = results[0].TABLE_NAME;
            await sequelize.query(`ALTER TABLE \`${tableName}\` DROP INDEX \`${indexName}\``);
        }
    }
}
async function analyzeTable(sequelize, tableName, columns) {
    const dialect = sequelize.getDialect();
    if (dialect === 'postgres') {
        const columnList = columns ? `(${columns.join(', ')})` : '';
        await sequelize.query(`ANALYZE "${tableName}" ${columnList}`, { raw: true });
    }
    else if (dialect === 'mysql') {
        await sequelize.query(`ANALYZE TABLE \`${tableName}\``, { raw: true });
    }
}
async function findDuplicateIndexes(sequelize, tableName) {
    const indexes = await listAllIndexes(sequelize, tableName);
    const duplicates = [];
    const byTable = new Map();
    for (const idx of indexes) {
        if (!byTable.has(idx.tableName)) {
            byTable.set(idx.tableName, []);
        }
        byTable.get(idx.tableName).push(idx);
    }
    for (const [table, tableIndexes] of byTable) {
        const checked = new Set();
        for (let i = 0; i < tableIndexes.length; i++) {
            if (checked.has(tableIndexes[i].name))
                continue;
            const redundant = [];
            for (let j = i + 1; j < tableIndexes.length; j++) {
                if (checked.has(tableIndexes[j].name))
                    continue;
                const cols1 = tableIndexes[i].columnNames.join(',');
                const cols2 = tableIndexes[j].columnNames.join(',');
                if (cols1 === cols2) {
                    redundant.push(tableIndexes[j]);
                    checked.add(tableIndexes[j].name);
                }
                else if (cols2.startsWith(cols1)) {
                    redundant.push(tableIndexes[i]);
                    checked.add(tableIndexes[i].name);
                    break;
                }
            }
            if (redundant.length > 0) {
                duplicates.push({
                    primary: tableIndexes[i],
                    redundant,
                });
            }
        }
    }
    return duplicates;
}
async function calculateIndexColumnOrder(sequelize, tableName, columns) {
    const dialect = sequelize.getDialect();
    if (dialect === 'postgres') {
        const [stats] = await sequelize.query(`
      SELECT
        attname AS "columnName",
        n_distinct AS "distinctValues"
      FROM pg_stats
      WHERE schemaname = 'public'
        AND tablename = :tableName
        AND attname = ANY(:columns::text[])
      ORDER BY ABS(n_distinct) DESC
    `, {
            replacements: { tableName, columns },
            type: sequelize_1.QueryTypes.SELECT,
        });
        const ordered = stats.map(s => s.columnName);
        for (const col of columns) {
            if (!ordered.includes(col)) {
                ordered.push(col);
            }
        }
        return ordered;
    }
    else if (dialect === 'mysql') {
        const [stats] = await sequelize.query(`
      SELECT
        COLUMN_NAME AS columnName,
        CARDINALITY AS distinctValues
      FROM INFORMATION_SCHEMA.STATISTICS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = :tableName
        AND COLUMN_NAME IN (:columns)
      ORDER BY CARDINALITY DESC
    `, {
            replacements: { tableName, columns },
            type: sequelize_1.QueryTypes.SELECT,
        });
        const ordered = stats.map(s => s.columnName);
        for (const col of columns) {
            if (!ordered.includes(col)) {
                ordered.push(col);
            }
        }
        return ordered;
    }
    return columns;
}
async function estimateIndexSize(sequelize, tableName, columns, indexType = 'btree') {
    const dialect = sequelize.getDialect();
    if (dialect === 'postgres') {
        const [result] = await sequelize.query(`
      SELECT
        reltuples::bigint AS row_count,
        pg_relation_size(oid) AS table_size
      FROM pg_class
      WHERE relname = :tableName
    `, {
            replacements: { tableName },
            type: sequelize_1.QueryTypes.SELECT,
        });
        if (!result || result.length === 0)
            return 0;
        const rowCount = result[0].row_count || 0;
        const avgEntrySize = indexType === 'btree' ? 32 : 16;
        const estimatedSize = rowCount * avgEntrySize * columns.length;
        return estimatedSize;
    }
    return 0;
}
async function validateIndexIntegrity(sequelize, indexName) {
    const dialect = sequelize.getDialect();
    const errors = [];
    if (dialect === 'postgres') {
        const [result] = await sequelize.query(`
      SELECT
        indisvalid AS valid,
        indisready AS ready
      FROM pg_index i
      JOIN pg_class c ON c.oid = i.indexrelid
      WHERE c.relname = :indexName
    `, {
            replacements: { indexName },
            type: sequelize_1.QueryTypes.SELECT,
        });
        if (!result || result.length === 0) {
            errors.push('Index not found');
            return { valid: false, errors };
        }
        const indexInfo = result[0];
        if (!indexInfo.valid) {
            errors.push('Index marked as invalid');
        }
        if (!indexInfo.ready) {
            errors.push('Index not ready for queries');
        }
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
async function generateIndexRecommendations(sequelize, tableName) {
    const recommendations = [];
    const dialect = sequelize.getDialect();
    if (dialect === 'postgres') {
        const [missingIndexes] = await sequelize.query(`
      SELECT
        schemaname,
        tablename,
        attname AS column_name,
        n_distinct,
        correlation
      FROM pg_stats
      WHERE schemaname = 'public'
        AND tablename = :tableName
        AND attname NOT IN (
          SELECT a.attname
          FROM pg_index i
          JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
          WHERE i.indrelid = :tableName::regclass
        )
      ORDER BY ABS(n_distinct) DESC
      LIMIT 5
    `, {
            replacements: { tableName },
            type: sequelize_1.QueryTypes.SELECT,
        });
        for (const col of missingIndexes) {
            recommendations.push({
                tableName,
                columns: [col.column_name],
                reason: `Column "${col.column_name}" frequently filtered but not indexed`,
                estimatedImprovement: Math.min(Math.abs(col.n_distinct) / 1000, 95),
                priority: Math.abs(col.n_distinct) > 100 ? 'high' : 'medium',
                indexType: 'btree',
                createStatement: `CREATE INDEX idx_${tableName}_${col.column_name} ON "${tableName}" ("${col.column_name}")`,
            });
        }
    }
    return recommendations;
}
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
            rows: planNode['Actual Rows'] || planNode['Plan Rows'],
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
                const stats = await getTableStatistics(sequelize, table.name);
                tableSizes.set(table.name, stats.rowCount || 0);
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
        if (whereClause)
            optimizedQuery += ` WHERE ${whereClause}`;
        if (groupByClause)
            optimizedQuery += ` GROUP BY ${groupByClause}`;
        if (orderByClause)
            optimizedQuery += ` ORDER BY ${orderByClause}`;
        if (limitClause)
            optimizedQuery += ` LIMIT ${limitClause}`;
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
    const orderedWhereColumns = await calculateIndexColumnOrder(sequelize, tableName, whereColumns);
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
async function getTableStatistics(sequelize, tableName) {
    const dialect = sequelize.getDialect();
    if (dialect === 'postgres') {
        const [result] = await sequelize.query(`
      SELECT
        schemaname,
        relname AS "tableName",
        n_live_tup AS "liveTuples",
        n_dead_tup AS "deadTuples",
        last_vacuum AS "lastVacuum",
        last_analyze AS "lastAnalyze",
        pg_total_relation_size(relid) AS "totalSize",
        pg_relation_size(relid) AS table_size,
        pg_indexes_size(relid) AS "indexSize",
        pg_total_relation_size(relid) - pg_relation_size(relid) - pg_indexes_size(relid) AS "toastSize"
      FROM pg_stat_user_tables
      WHERE relname = :tableName
    `, {
            replacements: { tableName },
            type: sequelize_1.QueryTypes.SELECT,
        });
        if (!result || result.length === 0) {
            throw new Error(`Table ${tableName} not found`);
        }
        const stats = result[0];
        const bloatPercentage = stats.deadTuples > 0
            ? (stats.deadTuples / (stats.liveTuples + stats.deadTuples)) * 100
            : 0;
        return {
            tableName: stats.tableName,
            rowCount: stats.liveTuples || 0,
            totalSize: stats.totalSize || 0,
            indexSize: stats.indexSize || 0,
            toastSize: stats.toastSize || 0,
            deadTuples: stats.deadTuples || 0,
            liveTuples: stats.liveTuples || 0,
            lastVacuum: stats.lastVacuum,
            lastAnalyze: stats.lastAnalyze,
            bloatPercentage,
        };
    }
    else if (dialect === 'mysql') {
        const [result] = await sequelize.query(`
      SELECT
        TABLE_NAME AS tableName,
        TABLE_ROWS AS rowCount,
        DATA_LENGTH + INDEX_LENGTH AS totalSize,
        DATA_LENGTH AS table_size,
        INDEX_LENGTH AS indexSize
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = :tableName
    `, {
            replacements: { tableName },
            type: sequelize_1.QueryTypes.SELECT,
        });
        if (!result || result.length === 0) {
            throw new Error(`Table ${tableName} not found`);
        }
        const stats = result[0];
        return {
            tableName: stats.tableName,
            rowCount: stats.rowCount || 0,
            totalSize: stats.totalSize || 0,
            indexSize: stats.indexSize || 0,
            toastSize: 0,
            deadTuples: 0,
            liveTuples: stats.rowCount || 0,
            bloatPercentage: 0,
        };
    }
    throw new Error(`Unsupported dialect: ${dialect}`);
}
async function collectDatabaseStatistics(sequelize) {
    const dialect = sequelize.getDialect();
    const stats = [];
    if (dialect === 'postgres') {
        const [tables] = await sequelize.query(`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`, { type: sequelize_1.QueryTypes.SELECT });
        for (const table of tables) {
            try {
                const tableStats = await getTableStatistics(sequelize, table.tablename);
                stats.push(tableStats);
            }
            catch (error) {
                continue;
            }
        }
    }
    else if (dialect === 'mysql') {
        const [tables] = await sequelize.query(`SELECT TABLE_NAME AS tablename FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE()`, { type: sequelize_1.QueryTypes.SELECT });
        for (const table of tables) {
            try {
                const tableStats = await getTableStatistics(sequelize, table.tablename);
                stats.push(tableStats);
            }
            catch (error) {
                continue;
            }
        }
    }
    return stats;
}
async function updateTableStatistics(sequelize, tableNames = []) {
    const dialect = sequelize.getDialect();
    if (tableNames.length === 0) {
        if (dialect === 'postgres') {
            await sequelize.query('ANALYZE', { raw: true });
        }
        else if (dialect === 'mysql') {
            const [tables] = await sequelize.query('SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE()', { type: sequelize_1.QueryTypes.SELECT });
            for (const table of tables) {
                await sequelize.query(`ANALYZE TABLE \`${table.TABLE_NAME}\``, { raw: true });
            }
        }
    }
    else {
        for (const tableName of tableNames) {
            await analyzeTable(sequelize, tableName);
        }
    }
}
async function monitorStatisticsStaleness(sequelize, staleThresholdDays = 7) {
    const dialect = sequelize.getDialect();
    const staleStats = [];
    if (dialect === 'postgres') {
        const [results] = await sequelize.query(`
      SELECT
        relname AS "tableName",
        last_analyze AS "lastAnalyze",
        EXTRACT(DAY FROM (NOW() - last_analyze)) AS "daysSinceAnalyze"
      FROM pg_stat_user_tables
      WHERE last_analyze IS NOT NULL
        AND last_analyze < NOW() - INTERVAL ':days days'
      ORDER BY last_analyze ASC
    `, {
            replacements: { days: staleThresholdDays },
            type: sequelize_1.QueryTypes.SELECT,
        });
        return results;
    }
    return staleStats;
}
async function estimateQuerySelectivity(sequelize, tableName, columnName, value) {
    const [totalResult] = await sequelize.query(`SELECT COUNT(*) as total FROM "${tableName}"`, { type: sequelize_1.QueryTypes.SELECT });
    const total = totalResult[0].total;
    if (total === 0)
        return 0;
    const [matchResult] = await sequelize.query(`SELECT COUNT(*) as matches FROM "${tableName}" WHERE "${columnName}" = :value`, {
        replacements: { value },
        type: sequelize_1.QueryTypes.SELECT,
    });
    const matches = matchResult[0].matches;
    return matches / total;
}
async function analyzeColumnCardinality(sequelize, tableName, columnName) {
    const [result] = await sequelize.query(`
    SELECT
      COUNT(DISTINCT "${columnName}") AS distinct_values,
      COUNT(*) AS total_values
    FROM "${tableName}"
  `, { type: sequelize_1.QueryTypes.SELECT });
    const stats = result[0];
    const distinctValues = stats.distinct_values || 0;
    const totalValues = stats.total_values || 0;
    const cardinality = totalValues > 0 ? distinctValues / totalValues : 0;
    return {
        distinctValues,
        totalValues,
        cardinality,
    };
}
async function getDatabaseSizeStatistics(sequelize) {
    const dialect = sequelize.getDialect();
    if (dialect === 'postgres') {
        const [result] = await sequelize.query(`
      SELECT
        pg_database_size(current_database()) AS "databaseSize",
        SUM(pg_total_relation_size(c.oid) - pg_indexes_size(c.oid)) AS "tableSize",
        SUM(pg_indexes_size(c.oid)) AS "indexSize",
        SUM(pg_total_relation_size(c.oid) - pg_relation_size(c.oid) - pg_indexes_size(c.oid)) AS "toastSize"
      FROM pg_class c
      LEFT JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public' AND c.relkind = 'r'
    `, { type: sequelize_1.QueryTypes.SELECT });
        return result[0];
    }
    return {
        databaseSize: 0,
        tableSize: 0,
        indexSize: 0,
        toastSize: 0,
    };
}
async function analyzeDataDistribution(sequelize, tableName, columnName) {
    const [results] = await sequelize.query(`
    WITH total AS (
      SELECT COUNT(*) AS total_count FROM "${tableName}"
    )
    SELECT
      "${columnName}" AS value,
      COUNT(*) AS count,
      (COUNT(*) * 100.0 / total.total_count) AS percentage
    FROM "${tableName}", total
    GROUP BY "${columnName}", total.total_count
    ORDER BY count DESC
    LIMIT 100
  `, { type: sequelize_1.QueryTypes.SELECT });
    return results;
}
async function performVacuum(sequelize, tableName, options = {}) {
    const dialect = sequelize.getDialect();
    if (dialect === 'postgres') {
        const { full = false, freeze = false, analyze = true, verbose = false, skipLocked = false, indexCleanup = true, truncate = true, parallel, } = options;
        const opts = [];
        if (full)
            opts.push('FULL');
        if (freeze)
            opts.push('FREEZE');
        if (analyze)
            opts.push('ANALYZE');
        if (verbose)
            opts.push('VERBOSE');
        if (skipLocked)
            opts.push('SKIP_LOCKED');
        if (!indexCleanup)
            opts.push('INDEX_CLEANUP OFF');
        if (!truncate)
            opts.push('TRUNCATE OFF');
        if (parallel)
            opts.push(`PARALLEL ${parallel}`);
        const optionsStr = opts.length > 0 ? `(${opts.join(', ')})` : '';
        const tableStr = tableName ? `"${tableName}"` : '';
        await sequelize.query(`VACUUM ${optionsStr} ${tableStr}`, { raw: true });
    }
    else if (dialect === 'mysql') {
        if (tableName) {
            await sequelize.query(`OPTIMIZE TABLE \`${tableName}\``, { raw: true });
        }
    }
}
async function scheduleAutovacuum(sequelize, tableName, schedule) {
    const dialect = sequelize.getDialect();
    if (dialect === 'postgres') {
        const { vacuumThreshold = 50, vacuumScaleFactor = 0.2, analyzeThreshold = 50, analyzeScaleFactor = 0.1, } = schedule;
        await sequelize.query(`
      ALTER TABLE "${tableName}" SET (
        autovacuum_vacuum_threshold = ${vacuumThreshold},
        autovacuum_vacuum_scale_factor = ${vacuumScaleFactor},
        autovacuum_analyze_threshold = ${analyzeThreshold},
        autovacuum_analyze_scale_factor = ${analyzeScaleFactor}
      )
    `, { raw: true });
    }
}
async function detectVacuumNeeded(sequelize, deadTuplesThreshold = 10000) {
    const dialect = sequelize.getDialect();
    if (dialect === 'postgres') {
        const [results] = await sequelize.query(`
      SELECT
        relname AS "tableName",
        n_dead_tup AS "deadTuples",
        CASE
          WHEN n_live_tup + n_dead_tup > 0
          THEN (n_dead_tup * 100.0 / (n_live_tup + n_dead_tup))
          ELSE 0
        END AS "bloatPercentage"
      FROM pg_stat_user_tables
      WHERE n_dead_tup > :threshold
      ORDER BY n_dead_tup DESC
    `, {
            replacements: { threshold: deadTuplesThreshold },
            type: sequelize_1.QueryTypes.SELECT,
        });
        return results;
    }
    return [];
}
async function vacuumFreeze(sequelize, tableName) {
    await performVacuum(sequelize, tableName, {
        freeze: true,
        analyze: true,
        verbose: true,
    });
}
async function monitorVacuumProgress(sequelize) {
    const dialect = sequelize.getDialect();
    if (dialect === 'postgres') {
        const [results] = await sequelize.query(`
      SELECT
        c.relname AS "tableName",
        p.phase,
        CASE
          WHEN p.heap_blks_total > 0
          THEN (p.heap_blks_scanned * 100.0 / p.heap_blks_total)
          ELSE 0
        END AS progress
      FROM pg_stat_progress_vacuum p
      JOIN pg_class c ON c.oid = p.relid
    `, { type: sequelize_1.QueryTypes.SELECT });
        return results;
    }
    return [];
}
async function reclaimWastedSpace(sequelize, tableName, aggressive = false) {
    const beforeStats = await getTableStatistics(sequelize, tableName);
    const beforeSize = beforeStats.totalSize;
    if (aggressive) {
        await performVacuum(sequelize, tableName, { full: true, analyze: true });
    }
    else {
        await performVacuum(sequelize, tableName, { analyze: true });
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    const afterStats = await getTableStatistics(sequelize, tableName);
    const afterSize = afterStats.totalSize;
    return {
        beforeSize,
        afterSize,
        reclaimed: beforeSize - afterSize,
    };
}
async function optimizeTableStructure(sequelize, tableName) {
    const dialect = sequelize.getDialect();
    if (dialect === 'mysql') {
        await sequelize.query(`OPTIMIZE TABLE \`${tableName}\``, { raw: true });
    }
    else if (dialect === 'postgres') {
        await performVacuum(sequelize, tableName, { full: true, analyze: true });
    }
}
async function detectTableBloat(sequelize, tableName) {
    const dialect = sequelize.getDialect();
    if (dialect === 'postgres') {
        const [result] = await sequelize.query(`
      SELECT
        current_database() AS db,
        schemaname,
        tablename,
        reltuples::bigint AS row_count,
        relpages::bigint * 8192 AS real_size,
        CASE
          WHEN reltuples > 0 THEN
            CEIL((reltuples * (8 + ma)) / 8192) * 8192
          ELSE 0
        END AS expected_size,
        n_dead_tup AS dead_tuples
      FROM (
        SELECT
          schemaname,
          tablename,
          c.reltuples,
          c.relpages,
          s.n_dead_tup,
          pg_catalog.pg_relation_size(c.oid) / 8192 AS ma
        FROM pg_stat_user_tables s
        JOIN pg_class c ON c.oid = s.relid
        WHERE s.schemaname = 'public'
          AND s.tablename = :tableName
      ) AS sq
    `, {
            replacements: { tableName },
            type: sequelize_1.QueryTypes.SELECT,
        });
        if (!result || result.length === 0) {
            throw new Error(`Table ${tableName} not found`);
        }
        const bloatData = result[0];
        const realSize = bloatData.real_size || 0;
        const expectedSize = bloatData.expected_size || 0;
        const bloatSize = Math.max(0, realSize - expectedSize);
        const bloatPercentage = realSize > 0 ? (bloatSize / realSize) * 100 : 0;
        return {
            tableName,
            realSize,
            expectedSize,
            bloatSize,
            bloatPercentage,
            deadTuples: bloatData.dead_tuples || 0,
            wastedBytes: bloatSize,
        };
    }
    return {
        tableName,
        realSize: 0,
        expectedSize: 0,
        bloatSize: 0,
        bloatPercentage: 0,
        deadTuples: 0,
        wastedBytes: 0,
    };
}
async function detectIndexBloat(sequelize, indexName) {
    const dialect = sequelize.getDialect();
    if (dialect === 'postgres') {
        const [result] = await sequelize.query(`
      SELECT
        indexrelname AS "indexName",
        pg_relation_size(indexrelid) AS "realSize",
        pg_relation_size(indexrelid) * 0.7 AS "expectedSize"
      FROM pg_stat_user_indexes
      WHERE indexrelname = :indexName
    `, {
            replacements: { indexName },
            type: sequelize_1.QueryTypes.SELECT,
        });
        if (!result || result.length === 0) {
            throw new Error(`Index ${indexName} not found`);
        }
        const data = result[0];
        const bloatPercentage = data.realSize > 0
            ? ((data.realSize - data.expectedSize) / data.realSize) * 100
            : 0;
        return {
            indexName: data.indexName,
            realSize: data.realSize,
            expectedSize: data.expectedSize,
            bloatPercentage,
        };
    }
    return {
        indexName,
        realSize: 0,
        expectedSize: 0,
        bloatPercentage: 0,
    };
}
async function findBloatedTables(sequelize, bloatThresholdPercent = 20) {
    const [tables] = await sequelize.query(`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`, { type: sequelize_1.QueryTypes.SELECT });
    const bloatedTables = [];
    for (const table of tables) {
        try {
            const bloat = await detectTableBloat(sequelize, table.tablename);
            if (bloat.bloatPercentage >= bloatThresholdPercent) {
                bloatedTables.push(bloat);
            }
        }
        catch (error) {
            continue;
        }
    }
    return bloatedTables.sort((a, b) => b.bloatPercentage - a.bloatPercentage);
}
async function estimateBloatReduction(sequelize, tableName) {
    const bloat = await detectTableBloat(sequelize, tableName);
    let estimatedReduction = 0;
    let recommendedAction = 'No action needed';
    if (bloat.bloatPercentage > 50) {
        estimatedReduction = bloat.bloatSize * 0.8;
        recommendedAction = 'VACUUM FULL (locks table)';
    }
    else if (bloat.bloatPercentage > 20) {
        estimatedReduction = bloat.bloatSize * 0.4;
        recommendedAction = 'VACUUM';
    }
    return {
        currentBloat: bloat.bloatSize,
        estimatedReduction,
        recommendedAction,
    };
}
async function createBloatReport(sequelize) {
    const bloatedTables = await findBloatedTables(sequelize, 10);
    const dbStats = await getDatabaseSizeStatistics(sequelize);
    let report = '=== Database Bloat Report ===\n\n';
    report += `Total Database Size: ${(dbStats.databaseSize / 1024 / 1024 / 1024).toFixed(2)} GB\n`;
    report += `Total Table Size: ${(dbStats.tableSize / 1024 / 1024 / 1024).toFixed(2)} GB\n`;
    report += `Total Index Size: ${(dbStats.indexSize / 1024 / 1024 / 1024).toFixed(2)} GB\n\n`;
    if (bloatedTables.length === 0) {
        report += 'No significant bloat detected.\n';
        return report;
    }
    report += `Found ${bloatedTables.length} tables with >10% bloat:\n\n`;
    for (const table of bloatedTables.slice(0, 10)) {
        report += `${table.tableName}:\n`;
        report += `  Bloat: ${(table.bloatSize / 1024 / 1024).toFixed(2)} MB (${table.bloatPercentage.toFixed(2)}%)\n`;
        report += `  Dead tuples: ${table.deadTuples.toLocaleString()}\n`;
        const estimate = await estimateBloatReduction(sequelize, table.tableName);
        report += `  Recommended: ${estimate.recommendedAction}\n`;
        report += `  Potential savings: ${(estimate.estimatedReduction / 1024 / 1024).toFixed(2)} MB\n\n`;
    }
    return report;
}
async function analyzeBufferCacheHitRatio(sequelize) {
    return await analyzeQueryCache(sequelize);
}
async function optimizeCacheSettings(sequelize, totalMemoryMB) {
    const sharedBuffersMB = Math.floor(totalMemoryMB * 0.25);
    const effectiveCacheSizeMB = Math.floor(totalMemoryMB * 0.75);
    const workMemMB = Math.floor(totalMemoryMB / (100 * 16));
    return {
        sharedBuffers: `${sharedBuffersMB}MB`,
        effectiveCacheSize: `${effectiveCacheSizeMB}MB`,
        workMem: `${Math.max(4, workMemMB)}MB`,
    };
}
async function warmDatabaseCache(sequelize, tableNames) {
    const dialect = sequelize.getDialect();
    if (dialect === 'postgres') {
        for (const tableName of tableNames) {
            await sequelize.query(`SELECT COUNT(*) FROM "${tableName}"`, {
                type: sequelize_1.QueryTypes.SELECT,
            });
            const indexes = await listAllIndexes(sequelize, tableName);
            for (const idx of indexes) {
                try {
                    await sequelize.query(`SELECT COUNT(*) FROM "${tableName}" WHERE ${idx.columnNames[0]} IS NOT NULL`, { type: sequelize_1.QueryTypes.SELECT });
                }
                catch (error) {
                    continue;
                }
            }
        }
    }
}
async function analyzeCachedObjects(sequelize) {
    const dialect = sequelize.getDialect();
    if (dialect === 'postgres') {
        const [results] = await sequelize.query(`
      SELECT
        schemaname || '.' || tablename AS "objectName",
        heap_blks_hit AS "bufferHits",
        heap_blks_read AS "bufferMisses",
        CASE
          WHEN heap_blks_hit + heap_blks_read > 0
          THEN heap_blks_hit::numeric / (heap_blks_hit + heap_blks_read)
          ELSE 0
        END AS "hitRate"
      FROM pg_statio_user_tables
      WHERE heap_blks_hit + heap_blks_read > 0
      ORDER BY heap_blks_hit + heap_blks_read DESC
      LIMIT 50
    `, { type: sequelize_1.QueryTypes.SELECT });
        return results;
    }
    return [];
}
async function recommendCacheConfiguration(sequelize) {
    const dialect = sequelize.getDialect();
    const recommendations = [];
    const currentSettings = {};
    if (dialect === 'postgres') {
        const [settings] = await sequelize.query(`
      SELECT name, setting, unit
      FROM pg_settings
      WHERE name IN ('shared_buffers', 'effective_cache_size', 'work_mem', 'maintenance_work_mem')
    `, { type: sequelize_1.QueryTypes.SELECT });
        for (const setting of settings) {
            currentSettings[setting.name] = setting.setting + (setting.unit || '');
        }
        const cacheMetrics = await analyzeQueryCache(sequelize);
        if (cacheMetrics.hitRate < 0.9) {
            recommendations.push(`Cache hit rate is ${(cacheMetrics.hitRate * 100).toFixed(2)}% (target: >90%). Consider increasing shared_buffers.`);
        }
        if (cacheMetrics.hitRate > 0.99) {
            recommendations.push('Excellent cache performance. Current settings are optimal.');
        }
    }
    return {
        recommendations,
        currentSettings,
    };
}
let DatabaseOptimizationService = class DatabaseOptimizationService extends base_1.BaseService {
    constructor() {
        super("DatabaseOptimizationService");
    }
    listAllIndexes = listAllIndexes;
    analyzeIndexUsage = analyzeIndexUsage;
    createOptimizedIndex = createOptimizedIndex;
    rebuildIndex = rebuildIndex;
    analyzeTable = analyzeTable;
    findDuplicateIndexes = findDuplicateIndexes;
    calculateIndexColumnOrder = calculateIndexColumnOrder;
    estimateIndexSize = estimateIndexSize;
    validateIndexIntegrity = validateIndexIntegrity;
    generateIndexRecommendations = generateIndexRecommendations;
    analyzeQueryPlan = analyzeQueryPlan;
    rewriteQueryForPerformance = rewriteQueryForPerformance;
    detectSlowQueries = detectSlowQueries;
    optimizeJoinOrder = optimizeJoinOrder;
    identifyNPlusOneQueries = identifyNPlusOneQueries;
    suggestCompositeIndexes = suggestCompositeIndexes;
    analyzeQueryCache = analyzeQueryCache;
    optimizePagination = optimizePagination;
    detectCartesianProduct = detectCartesianProduct;
    suggestCoveringIndex = suggestCoveringIndex;
    getTableStatistics = getTableStatistics;
    collectDatabaseStatistics = collectDatabaseStatistics;
    updateTableStatistics = updateTableStatistics;
    monitorStatisticsStaleness = monitorStatisticsStaleness;
    estimateQuerySelectivity = estimateQuerySelectivity;
    analyzeColumnCardinality = analyzeColumnCardinality;
    getDatabaseSizeStatistics = getDatabaseSizeStatistics;
    analyzeDataDistribution = analyzeDataDistribution;
    performVacuum = performVacuum;
    scheduleAutovacuum = scheduleAutovacuum;
    detectVacuumNeeded = detectVacuumNeeded;
    vacuumFreeze = vacuumFreeze;
    monitorVacuumProgress = monitorVacuumProgress;
    reclaimWastedSpace = reclaimWastedSpace;
    optimizeTableStructure = optimizeTableStructure;
    detectTableBloat = detectTableBloat;
    detectIndexBloat = detectIndexBloat;
    findBloatedTables = findBloatedTables;
    estimateBloatReduction = estimateBloatReduction;
    createBloatReport = createBloatReport;
    analyzeBufferCacheHitRatio = analyzeBufferCacheHitRatio;
    optimizeCacheSettings = optimizeCacheSettings;
    warmDatabaseCache = warmDatabaseCache;
    analyzeCachedObjects = analyzeCachedObjects;
    recommendCacheConfiguration = recommendCacheConfiguration;
};
exports.DatabaseOptimizationService = DatabaseOptimizationService;
exports.DatabaseOptimizationService = DatabaseOptimizationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], DatabaseOptimizationService);
exports.default = {
    listAllIndexes,
    analyzeIndexUsage,
    createOptimizedIndex,
    rebuildIndex,
    analyzeTable,
    findDuplicateIndexes,
    calculateIndexColumnOrder,
    estimateIndexSize,
    validateIndexIntegrity,
    generateIndexRecommendations,
    analyzeQueryPlan,
    rewriteQueryForPerformance,
    detectSlowQueries,
    optimizeJoinOrder,
    identifyNPlusOneQueries,
    suggestCompositeIndexes,
    analyzeQueryCache,
    optimizePagination,
    detectCartesianProduct,
    suggestCoveringIndex,
    getTableStatistics,
    collectDatabaseStatistics,
    updateTableStatistics,
    monitorStatisticsStaleness,
    estimateQuerySelectivity,
    analyzeColumnCardinality,
    getDatabaseSizeStatistics,
    analyzeDataDistribution,
    performVacuum,
    scheduleAutovacuum,
    detectVacuumNeeded,
    vacuumFreeze,
    monitorVacuumProgress,
    reclaimWastedSpace,
    optimizeTableStructure,
    detectTableBloat,
    detectIndexBloat,
    findBloatedTables,
    estimateBloatReduction,
    createBloatReport,
    analyzeBufferCacheHitRatio,
    optimizeCacheSettings,
    warmDatabaseCache,
    analyzeCachedObjects,
    recommendCacheConfiguration,
    DatabaseOptimizationService,
};
//# sourceMappingURL=database-optimization-utilities.service.js.map