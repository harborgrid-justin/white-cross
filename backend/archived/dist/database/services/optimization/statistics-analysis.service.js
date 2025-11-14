"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTableStatistics = getTableStatistics;
exports.collectDatabaseStatistics = collectDatabaseStatistics;
exports.updateTableStatistics = updateTableStatistics;
exports.monitorStatisticsStaleness = monitorStatisticsStaleness;
exports.estimateQuerySelectivity = estimateQuerySelectivity;
exports.analyzeColumnCardinality = analyzeColumnCardinality;
exports.getDatabaseSizeStatistics = getDatabaseSizeStatistics;
exports.analyzeDataDistribution = analyzeDataDistribution;
const sequelize_1 = require("sequelize");
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
            if (dialect === 'postgres') {
                await sequelize.query(`ANALYZE "${tableName}"`, { raw: true });
            }
            else if (dialect === 'mysql') {
                await sequelize.query(`ANALYZE TABLE \`${tableName}\``, { raw: true });
            }
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
        AND last_analyze < NOW() - INTERVAL '${staleThresholdDays} days'
      ORDER BY last_analyze ASC
    `, {
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
//# sourceMappingURL=statistics-analysis.service.js.map