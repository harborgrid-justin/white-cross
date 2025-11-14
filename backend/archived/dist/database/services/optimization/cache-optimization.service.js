"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeBufferCacheHitRatio = analyzeBufferCacheHitRatio;
exports.analyzeQueryCache = analyzeQueryCache;
exports.optimizeCacheSettings = optimizeCacheSettings;
exports.warmDatabaseCache = warmDatabaseCache;
exports.analyzeCachedObjects = analyzeCachedObjects;
exports.recommendCacheConfiguration = recommendCacheConfiguration;
const sequelize_1 = require("sequelize");
const index_management_service_1 = require("./index-management.service");
async function analyzeBufferCacheHitRatio(sequelize) {
    return await analyzeQueryCache(sequelize);
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
            const indexes = await (0, index_management_service_1.listAllIndexes)(sequelize, tableName);
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
//# sourceMappingURL=cache-optimization.service.js.map