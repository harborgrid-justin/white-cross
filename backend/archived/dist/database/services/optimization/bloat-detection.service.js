"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectTableBloat = detectTableBloat;
exports.detectIndexBloat = detectIndexBloat;
exports.findBloatedTables = findBloatedTables;
exports.estimateBloatReduction = estimateBloatReduction;
exports.createBloatReport = createBloatReport;
const sequelize_1 = require("sequelize");
const statistics_analysis_service_1 = require("./statistics-analysis.service");
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
    const dbStats = await (0, statistics_analysis_service_1.getDatabaseSizeStatistics)(sequelize);
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
//# sourceMappingURL=bloat-detection.service.js.map