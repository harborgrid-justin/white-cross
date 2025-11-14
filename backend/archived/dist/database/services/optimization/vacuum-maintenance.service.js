"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.performVacuum = performVacuum;
exports.scheduleAutovacuum = scheduleAutovacuum;
exports.detectVacuumNeeded = detectVacuumNeeded;
exports.vacuumFreeze = vacuumFreeze;
exports.monitorVacuumProgress = monitorVacuumProgress;
exports.reclaimWastedSpace = reclaimWastedSpace;
exports.optimizeTableStructure = optimizeTableStructure;
const sequelize_1 = require("sequelize");
const statistics_analysis_service_1 = require("./statistics-analysis.service");
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
    const beforeStats = await (0, statistics_analysis_service_1.getTableStatistics)(sequelize, tableName);
    const beforeSize = beforeStats.totalSize;
    if (aggressive) {
        await performVacuum(sequelize, tableName, { full: true, analyze: true });
    }
    else {
        await performVacuum(sequelize, tableName, { analyze: true });
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    const afterStats = await (0, statistics_analysis_service_1.getTableStatistics)(sequelize, tableName);
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
//# sourceMappingURL=vacuum-maintenance.service.js.map