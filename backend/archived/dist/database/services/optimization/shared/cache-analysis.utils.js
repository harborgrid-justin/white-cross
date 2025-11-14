"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeQueryCache = analyzeQueryCache;
const sequelize_1 = require("sequelize");
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
    if (dialect === 'mysql' || dialect === 'mariadb') {
        const [result] = await sequelize.query(`
      SHOW GLOBAL STATUS WHERE Variable_name IN (
        'Innodb_buffer_pool_read_requests',
        'Innodb_buffer_pool_reads'
      )
    `, { type: sequelize_1.QueryTypes.SELECT });
        const stats = result;
        const readRequests = parseInt(stats.find((s) => s.Variable_name === 'Innodb_buffer_pool_read_requests')?.Value || '0', 10);
        const reads = parseInt(stats.find((s) => s.Variable_name === 'Innodb_buffer_pool_reads')?.Value || '0', 10);
        const totalHits = readRequests - reads;
        const totalMisses = reads;
        const total = readRequests;
        return {
            hitRate: total > 0 ? totalHits / total : 0,
            missRate: total > 0 ? totalMisses / total : 0,
            totalHits,
            totalMisses,
            bufferCacheSize: 0,
        };
    }
    return {
        hitRate: 0,
        missRate: 0,
        totalHits: 0,
        totalMisses: 0,
        bufferCacheSize: 0,
    };
}
//# sourceMappingURL=cache-analysis.utils.js.map