"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const sequelize_1 = require("sequelize");
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
//# sourceMappingURL=index-management.service.js.map