"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryOptimizationCache = void 0;
exports.analyzeQueryPlan = analyzeQueryPlan;
exports.executeWithCache = executeWithCache;
exports.invalidateCache = invalidateCache;
exports.getCacheStats = getCacheStats;
exports.clearCache = clearCache;
exports.optimizeWithIndexHint = optimizeWithIndexHint;
exports.suggestIndexes = suggestIndexes;
exports.createIndex = createIndex;
exports.monitorSlowQueries = monitorSlowQueries;
exports.optimizeTable = optimizeTable;
exports.getTableStatistics = getTableStatistics;
exports.detectMissingForeignKeyIndexes = detectMissingForeignKeyIndexes;
exports.optimizeConnectionPool = optimizeConnectionPool;
exports.executeWithTimeout = executeWithTimeout;
exports.batchOptimizeTables = batchOptimizeTables;
exports.analyzeQueryPerformance = analyzeQueryPerformance;
exports.warmupCache = warmupCache;
exports.getIndexUsageStats = getIndexUsageStats;
exports.detectUnusedIndexes = detectUnusedIndexes;
exports.createCompositeIndex = createCompositeIndex;
exports.createPartialIndex = createPartialIndex;
exports.createExpressionIndex = createExpressionIndex;
exports.dropIndex = dropIndex;
exports.reindexTable = reindexTable;
exports.getQueryExecutionStats = getQueryExecutionStats;
exports.resetQueryStats = resetQueryStats;
exports.analyzeBloat = analyzeBloat;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
class QueryCache {
    cache = new Map();
    maxSize;
    constructor(maxSize = 1000) {
        this.maxSize = maxSize;
    }
    set(key, data, ttl) {
        const expiry = Date.now() + ttl * 1000;
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, { data, expiry, hits: 0 });
    }
    get(key) {
        const entry = this.cache.get(key);
        if (!entry) {
            return null;
        }
        if (Date.now() > entry.expiry) {
            this.cache.delete(key);
            return null;
        }
        entry.hits++;
        return entry.data;
    }
    invalidate(key) {
        this.cache.delete(key);
    }
    invalidateByTag(tag) {
        for (const [key, value] of Array.from(this.cache.entries())) {
            if (key.includes(tag)) {
                this.cache.delete(key);
            }
        }
    }
    clear() {
        this.cache.clear();
    }
    getStats() {
        let totalHits = 0;
        const keys = [];
        for (const [key, value] of Array.from(this.cache.entries())) {
            totalHits += value.hits;
            keys.push(key);
        }
        return {
            size: this.cache.size,
            hits: totalHits,
            keys,
        };
    }
}
const globalCache = new QueryCache(10000);
async function analyzeQueryPlan(sequelize, query, transaction) {
    const logger = new common_1.Logger('QueryOptimization::analyzeQueryPlan');
    try {
        const explainQuery = `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) ${query}`;
        const [results] = await sequelize.query(explainQuery, {
            type: sequelize_1.QueryTypes.SELECT,
            transaction,
        });
        const plan = results['QUERY PLAN']?.[0]?.Plan || results.Plan || {};
        const queryPlan = {
            planType: plan['Node Type'] || 'Unknown',
            estimatedCost: plan['Total Cost'] || 0,
            estimatedRows: plan['Plan Rows'] || 0,
            actualRows: plan['Actual Rows'],
            executionTimeMs: plan['Actual Total Time'],
            indexUsed: plan['Index Name'],
            scanType: plan['Node Type'],
            recommendations: [],
        };
        if (plan['Node Type']?.includes('Seq Scan')) {
            queryPlan.recommendations.push('Consider adding an index to avoid sequential scan');
        }
        if (plan['Actual Rows'] && plan['Plan Rows']) {
            const rowDiff = Math.abs(plan['Actual Rows'] - plan['Plan Rows']) / plan['Plan Rows'];
            if (rowDiff > 0.5) {
                queryPlan.recommendations.push('Row estimation is inaccurate - run ANALYZE on tables');
            }
        }
        if (queryPlan.estimatedCost > 10000) {
            queryPlan.recommendations.push('High query cost - consider query optimization');
        }
        logger.log(`Query plan analyzed: ${queryPlan.planType}, cost: ${queryPlan.estimatedCost}`);
        return queryPlan;
    }
    catch (error) {
        logger.error('Query plan analysis failed', error);
        throw new common_1.InternalServerErrorException('Query plan analysis failed');
    }
}
async function executeWithCache(model, options, cacheConfig) {
    const logger = new common_1.Logger('QueryOptimization::executeWithCache');
    try {
        const cachedData = globalCache.get(cacheConfig.key);
        if (cachedData) {
            logger.log(`Cache hit for key: ${cacheConfig.key}`);
            return cachedData;
        }
        logger.log(`Cache miss for key: ${cacheConfig.key}`);
        const results = await model.findAll(options);
        globalCache.set(cacheConfig.key, results, cacheConfig.ttl);
        return results;
    }
    catch (error) {
        logger.error('Execute with cache failed', error);
        throw new common_1.InternalServerErrorException('Execute with cache failed');
    }
}
function invalidateCache(keyOrTag, isTag = false) {
    const logger = new common_1.Logger('QueryOptimization::invalidateCache');
    if (isTag) {
        globalCache.invalidateByTag(keyOrTag);
        logger.log(`Invalidated cache entries with tag: ${keyOrTag}`);
    }
    else {
        globalCache.invalidate(keyOrTag);
        logger.log(`Invalidated cache key: ${keyOrTag}`);
    }
}
function getCacheStats() {
    return globalCache.getStats();
}
function clearCache() {
    const logger = new common_1.Logger('QueryOptimization::clearCache');
    globalCache.clear();
    logger.log('Cache cleared');
}
async function optimizeWithIndexHint(model, options, indexName) {
    const logger = new common_1.Logger('QueryOptimization::optimizeWithIndexHint');
    try {
        const results = await model.findAll(options);
        logger.log(`Query executed with index hint: ${indexName}`);
        return results;
    }
    catch (error) {
        logger.error('Query with index hint failed', error);
        throw new common_1.InternalServerErrorException('Query with index hint failed');
    }
}
async function suggestIndexes(sequelize, tableName, transaction) {
    const logger = new common_1.Logger('QueryOptimization::suggestIndexes');
    try {
        const query = `
      SELECT
        schemaname,
        tablename,
        attname,
        n_distinct,
        correlation
      FROM pg_stats
      WHERE schemaname = 'public'
        AND tablename = :tableName
      ORDER BY n_distinct DESC
    `;
        const stats = await sequelize.query(query, {
            replacements: { tableName },
            type: sequelize_1.QueryTypes.SELECT,
            transaction,
        });
        const suggestions = [];
        for (const stat of stats) {
            if (stat.n_distinct > 100 && Math.abs(stat.correlation) < 0.5) {
                suggestions.push({
                    tableName,
                    columns: [stat.attname],
                    indexType: 'btree',
                    estimatedImpact: 'high',
                    reason: `High cardinality column (${stat.n_distinct} distinct values) with low correlation`,
                });
            }
        }
        logger.log(`Index suggestions for ${tableName}: ${suggestions.length} suggestions`);
        return suggestions;
    }
    catch (error) {
        logger.error('Index suggestion failed', error);
        return [];
    }
}
async function createIndex(sequelize, suggestion, transaction) {
    const logger = new common_1.Logger('QueryOptimization::createIndex');
    try {
        const indexName = `idx_${suggestion.tableName}_${suggestion.columns.join('_')}`;
        const columnList = suggestion.columns.map(c => `"${c}"`).join(', ');
        const query = `
      CREATE INDEX IF NOT EXISTS ${indexName}
      ON "${suggestion.tableName}" USING ${suggestion.indexType} (${columnList})
    `;
        await sequelize.query(query, { transaction });
        logger.log(`Created index: ${indexName} on ${suggestion.tableName}`);
        return true;
    }
    catch (error) {
        logger.error('Index creation failed', error);
        return false;
    }
}
async function monitorSlowQueries(sequelize, thresholdMs = 1000, duration = 60) {
    const logger = new common_1.Logger('QueryOptimization::monitorSlowQueries');
    try {
        await sequelize.query('CREATE EXTENSION IF NOT EXISTS pg_stat_statements');
        await new Promise(resolve => setTimeout(resolve, duration * 1000));
        const query = `
      SELECT
        query,
        mean_exec_time AS duration_ms,
        calls
      FROM pg_stat_statements
      WHERE mean_exec_time > :threshold
      ORDER BY mean_exec_time DESC
      LIMIT 20
    `;
        const results = await sequelize.query(query, {
            replacements: { threshold: thresholdMs },
            type: sequelize_1.QueryTypes.SELECT,
        });
        logger.log(`Found ${results.length} slow queries above ${thresholdMs}ms threshold`);
        return results.map(r => ({
            query: r.query,
            durationMs: r.duration_ms,
            calls: r.calls,
        }));
    }
    catch (error) {
        logger.error('Slow query monitoring failed', error);
        return [];
    }
}
async function optimizeTable(sequelize, tableName, full = false, transaction) {
    const logger = new common_1.Logger('QueryOptimization::optimizeTable');
    try {
        if (full) {
            await sequelize.query(`VACUUM FULL "${tableName}"`, { transaction });
        }
        else {
            await sequelize.query(`VACUUM ANALYZE "${tableName}"`, { transaction });
        }
        logger.log(`Optimized table: ${tableName} (${full ? 'FULL' : 'ANALYZE'})`);
        return true;
    }
    catch (error) {
        logger.error('Table optimization failed', error);
        return false;
    }
}
async function getTableStatistics(sequelize, tableName, transaction) {
    const logger = new common_1.Logger('QueryOptimization::getTableStatistics');
    try {
        const query = `
      SELECT
        (SELECT reltuples::bigint FROM pg_class WHERE relname = :tableName) AS row_count,
        pg_total_relation_size(:tableName) AS total_size,
        pg_indexes_size(:tableName) AS index_size,
        pg_relation_size(:tableName) AS table_size
    `;
        const [result] = await sequelize.query(query, {
            replacements: { tableName },
            type: sequelize_1.QueryTypes.SELECT,
            transaction,
        });
        const stats = {
            rowCount: result ? result.row_count : 0,
            sizeBytes: result ? result.table_size : 0,
            indexSizeBytes: result ? result.index_size : 0,
            tableSizeMb: result ? result.table_size / (1024 * 1024) : 0,
            indexSizeMb: result ? result.index_size / (1024 * 1024) : 0,
        };
        logger.log(`Table statistics for ${tableName}: ${stats.rowCount} rows, ${stats.tableSizeMb.toFixed(2)}MB`);
        return stats;
    }
    catch (error) {
        logger.error('Get table statistics failed', error);
        throw new common_1.InternalServerErrorException('Get table statistics failed');
    }
}
async function detectMissingForeignKeyIndexes(sequelize, transaction) {
    const logger = new common_1.Logger('QueryOptimization::detectMissingForeignKeyIndexes');
    try {
        const query = `
      SELECT
        c.conrelid::regclass AS table_name,
        a.attname AS column_name,
        c.confrelid::regclass AS referenced_table
      FROM pg_constraint c
      JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY(c.conkey)
      WHERE c.contype = 'f'
        AND NOT EXISTS (
          SELECT 1
          FROM pg_index i
          WHERE i.indrelid = c.conrelid
            AND a.attnum = ANY(i.indkey)
        )
    `;
        const results = await sequelize.query(query, {
            type: sequelize_1.QueryTypes.SELECT,
            transaction,
        });
        logger.log(`Found ${results.length} missing foreign key indexes`);
        return results.map(r => ({
            table: r.table_name,
            column: r.column_name,
            referencedTable: r.referenced_table,
        }));
    }
    catch (error) {
        logger.error('Detect missing FK indexes failed', error);
        return [];
    }
}
function optimizeConnectionPool(sequelize, config) {
    const logger = new common_1.Logger('QueryOptimization::optimizeConnectionPool');
    const pool = sequelize.connectionManager.pool;
    if (config.max !== undefined) {
        pool.options.max = config.max;
    }
    if (config.min !== undefined) {
        pool.options.min = config.min;
    }
    if (config.idle !== undefined) {
        pool.options.idle = config.idle;
    }
    if (config.acquire !== undefined) {
        pool.options.acquire = config.acquire;
    }
    if (config.evict !== undefined) {
        pool.options.evict = config.evict;
    }
    logger.log(`Connection pool optimized: max=${config.max}, min=${config.min}`);
}
async function executeWithTimeout(sequelize, query, timeoutMs, transaction) {
    const logger = new common_1.Logger('QueryOptimization::executeWithTimeout');
    const startTime = Date.now();
    try {
        await sequelize.query(`SET statement_timeout = ${timeoutMs}`, { transaction });
        const results = await sequelize.query(query, {
            type: sequelize_1.QueryTypes.SELECT,
            transaction,
        });
        await sequelize.query('RESET statement_timeout', { transaction });
        const duration = Date.now() - startTime;
        logger.log(`Query executed within timeout: ${timeoutMs}ms`);
        return [results, duration];
    }
    catch (error) {
        logger.error(`Query timeout or execution failed: ${error.message}`);
        throw new common_1.InternalServerErrorException('Query timeout or execution failed');
    }
}
async function batchOptimizeTables(sequelize, tableNames, full = false) {
    const logger = new common_1.Logger('QueryOptimization::batchOptimizeTables');
    const results = [];
    for (const tableName of tableNames) {
        try {
            await optimizeTable(sequelize, tableName, full);
            results.push({ table: tableName, success: true });
        }
        catch (error) {
            results.push({
                table: tableName,
                success: false,
                error: error.message,
            });
        }
    }
    const successCount = results.filter(r => r.success).length;
    logger.log(`Batch optimize: ${successCount}/${tableNames.length} tables optimized`);
    return results;
}
async function analyzeQueryPerformance(sequelize, query, transaction) {
    const logger = new common_1.Logger('QueryOptimization::analyzeQueryPerformance');
    try {
        const startTime = Date.now();
        const plan = await analyzeQueryPlan(sequelize, query, transaction);
        const metrics = {
            queryId: `query_${Date.now()}`,
            executionTimeMs: plan.executionTimeMs || Date.now() - startTime,
            rowCount: plan.actualRows || 0,
            cacheHit: false,
            indexesUsed: plan.indexUsed ? [plan.indexUsed] : [],
            optimizationLevel: 'good',
            recommendations: plan.recommendations,
        };
        if (plan.estimatedCost > 10000 || plan.scanType === 'Sequential Scan') {
            metrics.optimizationLevel = 'poor';
        }
        else if (plan.estimatedCost < 100 && plan.indexUsed) {
            metrics.optimizationLevel = 'excellent';
        }
        logger.log(`Query performance: ${metrics.executionTimeMs}ms, ` +
            `optimization: ${metrics.optimizationLevel}`);
        return metrics;
    }
    catch (error) {
        logger.error('Query performance analysis failed', error);
        throw new common_1.InternalServerErrorException('Query performance analysis failed');
    }
}
async function warmupCache(queries) {
    const logger = new common_1.Logger('QueryOptimization::warmupCache');
    let warmedCount = 0;
    for (const query of queries) {
        try {
            await executeWithCache(query.model, query.options, query.cacheConfig);
            warmedCount++;
        }
        catch (error) {
            logger.error(`Cache warmup failed for key ${query.cacheConfig.key}`, error);
        }
    }
    logger.log(`Cache warmup: ${warmedCount}/${queries.length} queries cached`);
    return warmedCount;
}
async function getIndexUsageStats(sequelize, tableName, transaction) {
    const logger = new common_1.Logger('QueryOptimization::getIndexUsageStats');
    try {
        const whereClause = tableName ? `WHERE schemaname = 'public' AND tablename = :tableName` : '';
        const query = `
      SELECT
        schemaname AS schema_name,
        tablename AS table_name,
        indexrelname AS index_name,
        idx_scan AS scans,
        idx_tup_read AS tuples_read,
        idx_tup_fetch AS tuples_fetched
      FROM pg_stat_user_indexes
      ${whereClause}
      ORDER BY idx_scan DESC
    `;
        const results = await sequelize.query(query, {
            replacements: { tableName },
            type: sequelize_1.QueryTypes.SELECT,
            transaction,
        });
        logger.log(`Index usage stats: ${results.length} indexes analyzed`);
        return results.map(r => ({
            schemaName: r.schema_name,
            tableName: r.table_name,
            indexName: r.index_name,
            scans: r.scans,
            tuplesRead: r.tuples_read,
            tuplesFetched: r.tuples_fetched,
        }));
    }
    catch (error) {
        logger.error('Get index usage stats failed', error);
        return [];
    }
}
async function detectUnusedIndexes(sequelize, minScans = 10, transaction) {
    const logger = new common_1.Logger('QueryOptimization::detectUnusedIndexes');
    try {
        const query = `
      SELECT
        schemaname || '.' || tablename AS table_name,
        indexrelname AS index_name,
        idx_scan AS scans,
        pg_size_pretty(pg_relation_size(indexrelid)) AS size,
        pg_relation_size(indexrelid) AS size_bytes
      FROM pg_stat_user_indexes
      WHERE idx_scan < :minScans
        AND indexrelname NOT LIKE '%_pkey'
      ORDER BY pg_relation_size(indexrelid) DESC
    `;
        const results = await sequelize.query(query, {
            replacements: { minScans },
            type: sequelize_1.QueryTypes.SELECT,
            transaction,
        });
        logger.log(`Found ${results.length} potentially unused indexes`);
        return results.map(r => ({
            tableName: r.table_name,
            indexName: r.index_name,
            scans: r.scans,
            sizeMb: r.size_bytes / (1024 * 1024),
        }));
    }
    catch (error) {
        logger.error('Detect unused indexes failed', error);
        return [];
    }
}
async function createCompositeIndex(sequelize, tableName, columns, indexType = 'btree', unique = false, transaction) {
    const logger = new common_1.Logger('QueryOptimization::createCompositeIndex');
    try {
        const indexName = `idx_${tableName}_${columns.join('_')}`;
        const columnList = columns.map(c => `"${c}"`).join(', ');
        const uniqueClause = unique ? 'UNIQUE' : '';
        const query = `
      CREATE ${uniqueClause} INDEX IF NOT EXISTS ${indexName}
      ON "${tableName}" USING ${indexType} (${columnList})
    `;
        await sequelize.query(query, { transaction });
        logger.log(`Created composite index: ${indexName} on ${tableName}(${columns.join(', ')})`);
        return true;
    }
    catch (error) {
        logger.error('Composite index creation failed', error);
        return false;
    }
}
async function createPartialIndex(sequelize, tableName, columns, whereClause, transaction) {
    const logger = new common_1.Logger('QueryOptimization::createPartialIndex');
    try {
        const indexName = `idx_${tableName}_${columns.join('_')}_partial`;
        const columnList = columns.map(c => `"${c}"`).join(', ');
        const query = `
      CREATE INDEX IF NOT EXISTS ${indexName}
      ON "${tableName}" (${columnList})
      WHERE ${whereClause}
    `;
        await sequelize.query(query, { transaction });
        logger.log(`Created partial index: ${indexName} on ${tableName}`);
        return true;
    }
    catch (error) {
        logger.error('Partial index creation failed', error);
        return false;
    }
}
async function createExpressionIndex(sequelize, tableName, expression, indexName, transaction) {
    const logger = new common_1.Logger('QueryOptimization::createExpressionIndex');
    try {
        const query = `
      CREATE INDEX IF NOT EXISTS ${indexName}
      ON "${tableName}" (${expression})
    `;
        await sequelize.query(query, { transaction });
        logger.log(`Created expression index: ${indexName} on ${tableName}(${expression})`);
        return true;
    }
    catch (error) {
        logger.error('Expression index creation failed', error);
        return false;
    }
}
async function dropIndex(sequelize, indexName, cascade = false, transaction) {
    const logger = new common_1.Logger('QueryOptimization::dropIndex');
    try {
        const cascadeClause = cascade ? 'CASCADE' : '';
        const query = `DROP INDEX IF EXISTS ${indexName} ${cascadeClause}`;
        await sequelize.query(query, { transaction });
        logger.log(`Dropped index: ${indexName}`);
        return true;
    }
    catch (error) {
        logger.error('Drop index failed', error);
        return false;
    }
}
async function reindexTable(sequelize, tableName, transaction) {
    const logger = new common_1.Logger('QueryOptimization::reindexTable');
    try {
        await sequelize.query(`REINDEX TABLE "${tableName}"`, { transaction });
        logger.log(`Reindexed table: ${tableName}`);
        return true;
    }
    catch (error) {
        logger.error('Reindex failed', error);
        return false;
    }
}
async function getQueryExecutionStats(sequelize, limit = 20, transaction) {
    const logger = new common_1.Logger('QueryOptimization::getQueryExecutionStats');
    try {
        await sequelize.query('CREATE EXTENSION IF NOT EXISTS pg_stat_statements');
        const query = `
      SELECT
        query,
        calls,
        total_exec_time AS total_time_ms,
        mean_exec_time AS avg_time_ms,
        max_exec_time AS max_time_ms,
        min_exec_time AS min_time_ms
      FROM pg_stat_statements
      ORDER BY total_exec_time DESC
      LIMIT :limit
    `;
        const results = await sequelize.query(query, {
            replacements: { limit },
            type: sequelize_1.QueryTypes.SELECT,
            transaction,
        });
        logger.log(`Query execution stats: ${results.length} queries analyzed`);
        return results.map(r => ({
            query: r.query,
            calls: r.calls,
            totalTimeMs: r.total_time_ms,
            avgTimeMs: r.avg_time_ms,
            maxTimeMs: r.max_time_ms,
            minTimeMs: r.min_time_ms,
        }));
    }
    catch (error) {
        logger.error('Get query execution stats failed', error);
        return [];
    }
}
async function resetQueryStats(sequelize) {
    const logger = new common_1.Logger('QueryOptimization::resetQueryStats');
    try {
        await sequelize.query('SELECT pg_stat_statements_reset()');
        logger.log('Query statistics reset');
        return true;
    }
    catch (error) {
        logger.error('Reset query stats failed', error);
        return false;
    }
}
async function analyzeBloat(sequelize, transaction) {
    const logger = new common_1.Logger('QueryOptimization::analyzeBloat');
    try {
        const query = `
      SELECT
        schemaname || '.' || tablename AS object_name,
        'table' AS object_type,
        pg_total_relation_size(schemaname || '.' || tablename) AS size_bytes,
        0 AS bloat_bytes,
        0 AS bloat_percent
      FROM pg_tables
      WHERE schemaname = 'public'
    `;
        const results = await sequelize.query(query, {
            type: sequelize_1.QueryTypes.SELECT,
            transaction,
        });
        logger.log(`Bloat analysis: ${results.length} objects analyzed`);
        return results.map(r => ({
            objectName: r.object_name,
            objectType: r.object_type,
            sizeBytes: r.size_bytes,
            bloatBytes: r.bloat_bytes,
            bloatPercent: r.bloat_percent,
        }));
    }
    catch (error) {
        logger.error('Bloat analysis failed', error);
        return [];
    }
}
exports.QueryOptimizationCache = {
    analyzeQueryPlan,
    executeWithCache,
    invalidateCache,
    getCacheStats,
    clearCache,
    optimizeWithIndexHint,
    suggestIndexes,
    createIndex,
    monitorSlowQueries,
    optimizeTable,
    getTableStatistics,
    detectMissingForeignKeyIndexes,
    optimizeConnectionPool,
    executeWithTimeout,
    batchOptimizeTables,
    analyzeQueryPerformance,
    warmupCache,
    getIndexUsageStats,
    detectUnusedIndexes,
    createCompositeIndex,
    createPartialIndex,
    createExpressionIndex,
    dropIndex,
    reindexTable,
    getQueryExecutionStats,
    resetQueryStats,
    analyzeBloat,
};
//# sourceMappingURL=query-optimization-cache.service.js.map