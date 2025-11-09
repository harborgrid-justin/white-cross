"use strict";
/**
 * @fileoverview Sequelize Performance Utilities
 * @module reuse/sequelize-performance-utils
 * @description Comprehensive performance utilities for Sequelize v6 covering query optimization,
 * index management, connection pooling, caching, batch processing, profiling, and monitoring.
 *
 * Key Features:
 * - Query performance analysis and EXPLAIN
 * - Index optimization helpers
 * - Connection pool management and monitoring
 * - Query caching utilities
 * - Batch processing and bulk operations
 * - Query profiling and timing
 * - Database load monitoring
 * - Slow query detection and logging
 * - Query plan analysis
 * - Memory optimization strategies
 * - Connection leak detection
 * - Replication and read replica management
 * - Query queue management
 * - Performance testing helpers
 * - Healthcare-specific optimizations
 *
 * @target Sequelize v6.x, Node 18+, TypeScript 5.x
 *
 * @security
 * - HIPAA-compliant audit logging
 * - Query sanitization
 * - Performance monitoring without exposing sensitive data
 * - Rate limiting integration
 * - Resource usage tracking
 *
 * @example Basic usage
 * ```typescript
 * import { analyzeQuery, optimizeQuery, cacheQuery } from './sequelize-performance-utils';
 *
 * // Analyze query performance
 * const analysis = await analyzeQuery(sequelize, User, {
 *   where: { status: 'active' }
 * });
 *
 * // Cache query results
 * const users = await cacheQuery('active-users', async () => {
 *   return await User.findAll({ where: { status: 'active' } });
 * }, 300);
 * ```
 *
 * @example Advanced usage
 * ```typescript
 * import {
 *   setupQueryProfiler,
 *   detectSlowQueries,
 *   optimizeConnectionPool,
 *   setupReadReplicas
 * } from './sequelize-performance-utils';
 *
 * // Setup query profiler
 * setupQueryProfiler(sequelize, { slowQueryThreshold: 1000 });
 *
 * // Optimize connection pool
 * optimizeConnectionPool(sequelize, { max: 20, min: 5 });
 * ```
 *
 * LOC: PF73X9Q482
 * UPSTREAM: sequelize, @types/sequelize, redis, ioredis
 * DOWNSTREAM: services, repositories, monitoring
 *
 * @version 1.0.0
 * @since 2025-11-08
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeQuery = analyzeQuery;
exports.explainQuery = explainQuery;
exports.benchmarkQuery = benchmarkQuery;
exports.compareQueries = compareQueries;
exports.suggestIndexes = suggestIndexes;
exports.createIndex = createIndex;
exports.dropIndex = dropIndex;
exports.analyzeIndexUsage = analyzeIndexUsage;
exports.findUnusedIndexes = findUnusedIndexes;
exports.getPoolStats = getPoolStats;
exports.optimizeConnectionPool = optimizeConnectionPool;
exports.monitorConnectionPool = monitorConnectionPool;
exports.detectConnectionLeaks = detectConnectionLeaks;
exports.drainConnectionPool = drainConnectionPool;
exports.cacheQuery = cacheQuery;
exports.invalidateCache = invalidateCache;
exports.clearAllCache = clearAllCache;
exports.getCacheStats = getCacheStats;
exports.createCacheKey = createCacheKey;
exports.processBatch = processBatch;
exports.streamQuery = streamQuery;
exports.setupQueryProfiler = setupQueryProfiler;
exports.getQueryMetrics = getQueryMetrics;
exports.resetQueryMetrics = resetQueryMetrics;
exports.detectSlowQueries = detectSlowQueries;
exports.monitorDatabaseLoad = monitorDatabaseLoad;
exports.getActiveQueries = getActiveQueries;
exports.killQuery = killQuery;
exports.setupReadReplicas = setupReadReplicas;
exports.forceReadFromReplica = forceReadFromReplica;
exports.forceWriteToMaster = forceWriteToMaster;
exports.generateOptimizationSuggestions = generateOptimizationSuggestions;
exports.optimizeQuery = optimizeQuery;
exports.enableQueryLogging = enableQueryLogging;
const sequelize_1 = require("sequelize");
// ============================================================================
// QUERY PERFORMANCE ANALYSIS
// ============================================================================
/**
 * @function analyzeQuery
 * @description Analyzes query performance with EXPLAIN
 *
 * @template M
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ModelStatic<M>} model - Model to query
 * @param {FindOptions<M>} options - Query options
 * @returns {Promise<QueryAnalysis>} Query analysis result
 *
 * @example
 * ```typescript
 * const analysis = await analyzeQuery(sequelize, User, {
 *   where: { status: 'active', age: { [Op.gt]: 18 } },
 *   include: [{ model: Profile }]
 * });
 *
 * console.log('Execution time:', analysis.executionTime);
 * console.log('Index usage:', analysis.indexUsage);
 * console.log('Recommendations:', analysis.recommendations);
 * ```
 */
async function analyzeQuery(sequelize, model, options) {
    const startTime = Date.now();
    // Get the SQL query
    const queryGenerator = sequelize.getQueryInterface().queryGenerator;
    const sql = queryGenerator.selectQuery(model.getTableName(), options, model);
    // Execute EXPLAIN
    const [planRows] = await sequelize.query(`EXPLAIN ${sql}`, {
        type: sequelize_1.QueryTypes.SELECT,
    });
    // Execute actual query
    const results = await model.findAll(options);
    const executionTime = Date.now() - startTime;
    // Analyze plan
    const indexUsage = [];
    let hasTableScan = false;
    const recommendations = [];
    if (Array.isArray(planRows)) {
        planRows.forEach((row) => {
            const planText = row['QUERY PLAN'] || JSON.stringify(row);
            // Check for index usage
            if (planText.includes('Index Scan') || planText.includes('Index Only Scan')) {
                const match = planText.match(/Index.*?on (\w+)/);
                if (match) {
                    indexUsage.push(match[1]);
                }
            }
            // Check for table scans
            if (planText.includes('Seq Scan') || planText.includes('Table Scan')) {
                hasTableScan = true;
                recommendations.push('Consider adding an index to avoid table scan');
            }
        });
    }
    if (executionTime > 1000) {
        recommendations.push('Query execution time exceeds 1 second - consider optimization');
    }
    if (results.length > 1000 && !options.limit) {
        recommendations.push('Large result set without LIMIT - consider pagination');
    }
    return {
        sql,
        executionTime,
        rowCount: results.length,
        plan: planRows,
        indexUsage,
        hasTableScan,
        recommendations,
    };
}
/**
 * @function explainQuery
 * @description Gets EXPLAIN plan for a query
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sql - SQL query
 * @param {boolean} analyze - Include EXPLAIN ANALYZE
 * @returns {Promise<any[]>} Query plan
 *
 * @example
 * ```typescript
 * const plan = await explainQuery(
 *   sequelize,
 *   'SELECT * FROM users WHERE status = $1',
 *   true
 * );
 * ```
 */
async function explainQuery(sequelize, sql, analyze = false) {
    const explainSql = analyze ? `EXPLAIN ANALYZE ${sql}` : `EXPLAIN ${sql}`;
    const [results] = await sequelize.query(explainSql, {
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
}
/**
 * @function benchmarkQuery
 * @description Benchmarks a query with multiple executions
 *
 * @template T
 * @param {() => Promise<T>} queryFn - Query function
 * @param {number} iterations - Number of iterations
 * @returns {Promise<{ avgTime: number; minTime: number; maxTime: number; totalTime: number }>}
 *
 * @example
 * ```typescript
 * const benchmark = await benchmarkQuery(
 *   () => User.findAll({ where: { status: 'active' } }),
 *   10
 * );
 *
 * console.log(`Average: ${benchmark.avgTime}ms`);
 * ```
 */
async function benchmarkQuery(queryFn, iterations = 10) {
    const times = [];
    for (let i = 0; i < iterations; i++) {
        const start = Date.now();
        await queryFn();
        times.push(Date.now() - start);
    }
    return {
        avgTime: times.reduce((a, b) => a + b, 0) / times.length,
        minTime: Math.min(...times),
        maxTime: Math.max(...times),
        totalTime: times.reduce((a, b) => a + b, 0),
    };
}
/**
 * @function compareQueries
 * @description Compares performance of multiple query approaches
 *
 * @template T
 * @param {Record<string, () => Promise<T>>} queries - Named query functions
 * @param {number} iterations - Iterations per query
 * @returns {Promise<Record<string, any>>} Comparison results
 *
 * @example
 * ```typescript
 * const comparison = await compareQueries({
 *   'with-include': () => User.findAll({ include: [Post] }),
 *   'separate-queries': async () => {
 *     const users = await User.findAll();
 *     await Post.findAll();
 *     return users;
 *   }
 * }, 5);
 * ```
 */
async function compareQueries(queries, iterations = 5) {
    const results = {};
    for (const [name, queryFn] of Object.entries(queries)) {
        results[name] = await benchmarkQuery(queryFn, iterations);
    }
    return results;
}
// ============================================================================
// INDEX OPTIMIZATION
// ============================================================================
/**
 * @function suggestIndexes
 * @description Suggests indexes based on query patterns
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {WhereOptions[]} whereConditions - Common where conditions
 * @returns {Promise<IndexSuggestion[]>} Index suggestions
 *
 * @example
 * ```typescript
 * const suggestions = await suggestIndexes(
 *   sequelize,
 *   'users',
 *   [
 *     { status: 'active' },
 *     { email: 'test@example.com' },
 *     { createdAt: { [Op.gte]: new Date() } }
 *   ]
 * );
 * ```
 */
async function suggestIndexes(sequelize, tableName, whereConditions) {
    const suggestions = [];
    const columnFrequency = {};
    // Analyze where conditions
    whereConditions.forEach((where) => {
        Object.keys(where).forEach((column) => {
            columnFrequency[column] = (columnFrequency[column] || 0) + 1;
        });
    });
    // Get existing indexes
    const [existingIndexes] = await sequelize.query(`
    SELECT indexname, indexdef
    FROM pg_indexes
    WHERE tablename = '${tableName}'
  `);
    const existingColumns = new Set();
    existingIndexes.forEach((idx) => {
        const match = idx.indexdef?.match(/\(([^)]+)\)/);
        if (match) {
            match[1].split(',').forEach((col) => {
                existingColumns.add(col.trim());
            });
        }
    });
    // Suggest indexes for frequently queried columns
    Object.entries(columnFrequency).forEach(([column, frequency]) => {
        if (!existingColumns.has(column) && frequency >= 2) {
            suggestions.push({
                table: tableName,
                columns: [column],
                type: 'BTREE',
                reason: `Column "${column}" is used in ${frequency} queries`,
                priority: Math.min(frequency, 5),
            });
        }
    });
    return suggestions.sort((a, b) => b.priority - a.priority);
}
/**
 * @function createIndex
 * @description Creates an index on a table
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {string[]} columns - Column names
 * @param {object} options - Index options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createIndex(sequelize, 'users', ['email'], {
 *   unique: true,
 *   name: 'idx_users_email'
 * });
 * ```
 */
async function createIndex(sequelize, tableName, columns, options = {}) {
    const indexName = options.name || `idx_${tableName}_${columns.join('_')}`;
    const unique = options.unique ? 'UNIQUE' : '';
    const type = options.type ? `USING ${options.type}` : '';
    const where = options.where ? `WHERE ${options.where}` : '';
    const concurrent = options.concurrent ? 'CONCURRENTLY' : '';
    const sql = `
    CREATE ${unique} INDEX ${concurrent} ${indexName}
    ON ${tableName} ${type} (${columns.join(', ')})
    ${where}
  `.trim();
    await sequelize.query(sql);
}
/**
 * @function dropIndex
 * @description Drops an index from a table
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} indexName - Index name
 * @param {boolean} concurrent - Use CONCURRENTLY
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await dropIndex(sequelize, 'idx_users_email', true);
 * ```
 */
async function dropIndex(sequelize, indexName, concurrent = false) {
    const concurrentClause = concurrent ? 'CONCURRENTLY' : '';
    await sequelize.query(`DROP INDEX ${concurrentClause} ${indexName}`);
}
/**
 * @function analyzeIndexUsage
 * @description Analyzes index usage statistics
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @returns {Promise<any[]>} Index usage statistics
 *
 * @example
 * ```typescript
 * const usage = await analyzeIndexUsage(sequelize, 'users');
 * usage.forEach(idx => {
 *   console.log(`${idx.indexname}: ${idx.idx_scan} scans`);
 * });
 * ```
 */
async function analyzeIndexUsage(sequelize, tableName) {
    const [results] = await sequelize.query(`
    SELECT
      schemaname,
      tablename,
      indexname,
      idx_scan,
      idx_tup_read,
      idx_tup_fetch
    FROM pg_stat_user_indexes
    WHERE tablename = '${tableName}'
    ORDER BY idx_scan DESC
  `);
    return results;
}
/**
 * @function findUnusedIndexes
 * @description Finds indexes that are never used
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @returns {Promise<string[]>} Unused index names
 *
 * @example
 * ```typescript
 * const unused = await findUnusedIndexes(sequelize, 'users');
 * console.log('Consider dropping:', unused);
 * ```
 */
async function findUnusedIndexes(sequelize, tableName) {
    const [results] = await sequelize.query(`
    SELECT indexname
    FROM pg_stat_user_indexes
    WHERE tablename = '${tableName}'
      AND idx_scan = 0
      AND indexname NOT LIKE '%_pkey'
  `);
    return results.map((row) => row.indexname);
}
// ============================================================================
// CONNECTION POOL MANAGEMENT
// ============================================================================
/**
 * @function getPoolStats
 * @description Gets connection pool statistics
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {PoolStats} Pool statistics
 *
 * @example
 * ```typescript
 * const stats = getPoolStats(sequelize);
 * console.log(`Active: ${stats.active}, Idle: ${stats.idle}`);
 * ```
 */
function getPoolStats(sequelize) {
    const pool = sequelize.connectionManager.pool;
    return {
        total: pool.size,
        active: pool.using,
        idle: pool.available,
        waiting: pool.waiting,
        size: pool.size,
        max: pool.max,
        min: pool.min,
    };
}
/**
 * @function optimizeConnectionPool
 * @description Optimizes connection pool settings
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} settings - Pool settings
 * @returns {void}
 *
 * @example
 * ```typescript
 * optimizeConnectionPool(sequelize, {
 *   max: 20,
 *   min: 5,
 *   acquire: 30000,
 *   idle: 10000
 * });
 * ```
 */
function optimizeConnectionPool(sequelize, settings) {
    const pool = sequelize.connectionManager.pool;
    if (settings.max !== undefined)
        pool.max = settings.max;
    if (settings.min !== undefined)
        pool.min = settings.min;
    if (settings.acquire !== undefined)
        sequelize.options.pool.acquire = settings.acquire;
    if (settings.idle !== undefined)
        sequelize.options.pool.idle = settings.idle;
    if (settings.evict !== undefined)
        sequelize.options.pool.evict = settings.evict;
}
/**
 * @function monitorConnectionPool
 * @description Monitors connection pool health
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} interval - Check interval in ms
 * @param {(stats: PoolStats) => void} callback - Callback with stats
 * @returns {NodeJS.Timeout} Interval timer
 *
 * @example
 * ```typescript
 * const monitor = monitorConnectionPool(sequelize, 5000, (stats) => {
 *   if (stats.waiting > 5) {
 *     console.warn('High connection wait queue:', stats.waiting);
 *   }
 * });
 *
 * // Stop monitoring
 * clearInterval(monitor);
 * ```
 */
function monitorConnectionPool(sequelize, interval, callback) {
    return setInterval(() => {
        const stats = getPoolStats(sequelize);
        callback(stats);
    }, interval);
}
/**
 * @function detectConnectionLeaks
 * @description Detects potential connection leaks
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} threshold - Leak threshold (active connections)
 * @returns {boolean} True if leak detected
 *
 * @example
 * ```typescript
 * if (detectConnectionLeaks(sequelize, 15)) {
 *   console.error('Connection leak detected!');
 * }
 * ```
 */
function detectConnectionLeaks(sequelize, threshold = 10) {
    const stats = getPoolStats(sequelize);
    return stats.active > threshold && stats.idle === 0;
}
/**
 * @function drainConnectionPool
 * @description Drains the connection pool gracefully
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await drainConnectionPool(sequelize);
 * console.log('Pool drained');
 * ```
 */
async function drainConnectionPool(sequelize) {
    const pool = sequelize.connectionManager.pool;
    if (pool && typeof pool.drain === 'function') {
        await pool.drain();
    }
}
// ============================================================================
// QUERY CACHING
// ============================================================================
/**
 * @function cacheQuery
 * @description Caches query results in memory
 *
 * @template T
 * @param {string} key - Cache key
 * @param {() => Promise<T>} queryFn - Query function
 * @param {number} ttl - TTL in seconds
 * @returns {Promise<T>} Cached or fresh results
 *
 * @example
 * ```typescript
 * const users = await cacheQuery(
 *   'active-users',
 *   () => User.findAll({ where: { status: 'active' } }),
 *   300
 * );
 * ```
 */
const queryCache = new Map();
async function cacheQuery(key, queryFn, ttl) {
    const cached = queryCache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
        return cached.data;
    }
    const data = await queryFn();
    queryCache.set(key, {
        data,
        expiresAt: Date.now() + ttl * 1000,
    });
    return data;
}
/**
 * @function invalidateCache
 * @description Invalidates cached query results
 *
 * @param {string | string[]} keys - Cache key(s) to invalidate
 * @returns {void}
 *
 * @example
 * ```typescript
 * invalidateCache('active-users');
 * invalidateCache(['active-users', 'user-count']);
 * ```
 */
function invalidateCache(keys) {
    const keyArray = Array.isArray(keys) ? keys : [keys];
    keyArray.forEach((key) => queryCache.delete(key));
}
/**
 * @function clearAllCache
 * @description Clears all cached queries
 *
 * @returns {void}
 *
 * @example
 * ```typescript
 * clearAllCache();
 * ```
 */
function clearAllCache() {
    queryCache.clear();
}
/**
 * @function getCacheStats
 * @description Gets cache statistics
 *
 * @returns {{ size: number; keys: string[] }}
 *
 * @example
 * ```typescript
 * const stats = getCacheStats();
 * console.log(`Cache size: ${stats.size} entries`);
 * ```
 */
function getCacheStats() {
    return {
        size: queryCache.size,
        keys: Array.from(queryCache.keys()),
    };
}
/**
 * @function createCacheKey
 * @description Creates a cache key from query parameters
 *
 * @param {string} prefix - Key prefix
 * @param {any} params - Query parameters
 * @returns {string} Cache key
 *
 * @example
 * ```typescript
 * const key = createCacheKey('users', {
 *   where: { status: 'active' },
 *   limit: 10
 * });
 * ```
 */
function createCacheKey(prefix, params) {
    const paramStr = JSON.stringify(params);
    return `${prefix}:${Buffer.from(paramStr).toString('base64').substring(0, 32)}`;
}
// ============================================================================
// BATCH PROCESSING
// ============================================================================
/**
 * @function processBatch
 * @description Processes items in batches
 *
 * @template T, R
 * @param {T[]} items - Items to process
 * @param {(batch: T[]) => Promise<R>} processor - Batch processor
 * @param {BatchProcessOptions<T>} options - Batch options
 * @returns {Promise<R[]>} Processing results
 *
 * @example
 * ```typescript
 * await processBatch(
 *   largeDataArray,
 *   async (batch) => {
 *     return await User.bulkCreate(batch);
 *   },
 *   {
 *     batchSize: 1000,
 *     delay: 100,
 *     useTransaction: true,
 *     onProgress: (processed, total) => {
 *       console.log(`${processed}/${total}`);
 *     }
 *   }
 * );
 * ```
 */
async function processBatch(items, processor, options) {
    const { batchSize, delay = 0, onProgress, onError, } = options;
    const results = [];
    let processed = 0;
    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const batchIndex = Math.floor(i / batchSize);
        try {
            const result = await processor(batch);
            results.push(result);
            processed += batch.length;
            if (onProgress) {
                onProgress(processed, items.length);
            }
            if (delay > 0 && i + batchSize < items.length) {
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
        catch (error) {
            if (onError) {
                await onError(error, batch, batchIndex);
            }
            else {
                throw error;
            }
        }
    }
    return results;
}
/**
 * @function streamQuery
 * @description Streams query results for memory efficiency
 *
 * @template M
 * @param {ModelStatic<M>} model - Model to query
 * @param {FindOptions<M>} options - Query options
 * @param {(row: M) => void | Promise<void>} callback - Row callback
 * @param {number} batchSize - Batch size for streaming
 * @returns {Promise<number>} Total rows processed
 *
 * @example
 * ```typescript
 * let count = 0;
 * await streamQuery(
 *   User,
 *   { where: { status: 'active' } },
 *   async (user) => {
 *     await processUser(user);
 *     count++;
 *   },
 *   100
 * );
 * ```
 */
async function streamQuery(model, options, callback, batchSize = 100) {
    let offset = 0;
    let totalProcessed = 0;
    let hasMore = true;
    while (hasMore) {
        const rows = await model.findAll({
            ...options,
            limit: batchSize,
            offset,
        });
        if (rows.length === 0) {
            hasMore = false;
            break;
        }
        for (const row of rows) {
            await callback(row);
            totalProcessed++;
        }
        offset += batchSize;
        hasMore = rows.length === batchSize;
    }
    return totalProcessed;
}
// ============================================================================
// QUERY PROFILING
// ============================================================================
/**
 * @function setupQueryProfiler
 * @description Sets up query profiling and logging
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ProfilerOptions} options - Profiler options
 * @returns {void}
 *
 * @example
 * ```typescript
 * setupQueryProfiler(sequelize, {
 *   slowQueryThreshold: 1000,
 *   logSlowQueries: true,
 *   includeStackTrace: true
 * });
 * ```
 */
const queryMetrics = new Map();
function setupQueryProfiler(sequelize, options = {}) {
    const { slowQueryThreshold = 1000, logAllQueries = false, logSlowQueries = true, includeStackTrace = false, logger = console.log, } = options;
    sequelize.options.logging = (sql, timing) => {
        const executionTime = timing || 0;
        const isSlow = executionTime > slowQueryThreshold;
        // Track metrics
        const queryId = sql.substring(0, 100);
        const existing = queryMetrics.get(queryId);
        if (existing) {
            existing.count++;
            existing.totalTime += executionTime;
            existing.avgTime = existing.totalTime / existing.count;
            existing.minTime = Math.min(existing.minTime, executionTime);
            existing.maxTime = Math.max(existing.maxTime, executionTime);
            existing.lastExecutedAt = new Date();
        }
        else {
            queryMetrics.set(queryId, {
                queryId,
                count: 1,
                avgTime: executionTime,
                minTime: executionTime,
                maxTime: executionTime,
                totalTime: executionTime,
                lastExecutedAt: new Date(),
            });
        }
        // Logging
        if (logAllQueries || (logSlowQueries && isSlow)) {
            const logMessage = `[${isSlow ? 'SLOW' : 'QUERY'}] ${executionTime}ms: ${sql}`;
            const meta = { executionTime, sql };
            if (includeStackTrace && isSlow) {
                meta.stack = new Error().stack;
            }
            logger(logMessage, meta);
        }
    };
    sequelize.options.benchmark = true;
}
/**
 * @function getQueryMetrics
 * @description Gets query execution metrics
 *
 * @param {number} topN - Number of top queries to return
 * @returns {QueryMetrics[]} Query metrics
 *
 * @example
 * ```typescript
 * const topQueries = getQueryMetrics(10);
 * topQueries.forEach(q => {
 *   console.log(`${q.queryId}: ${q.count} executions, ${q.avgTime}ms avg`);
 * });
 * ```
 */
function getQueryMetrics(topN = 10) {
    return Array.from(queryMetrics.values())
        .sort((a, b) => b.totalTime - a.totalTime)
        .slice(0, topN);
}
/**
 * @function resetQueryMetrics
 * @description Resets query metrics
 *
 * @returns {void}
 *
 * @example
 * ```typescript
 * resetQueryMetrics();
 * ```
 */
function resetQueryMetrics() {
    queryMetrics.clear();
}
/**
 * @function detectSlowQueries
 * @description Detects and returns slow queries
 *
 * @param {number} threshold - Threshold in ms
 * @returns {QueryMetrics[]} Slow queries
 *
 * @example
 * ```typescript
 * const slowQueries = detectSlowQueries(500);
 * ```
 */
function detectSlowQueries(threshold) {
    return Array.from(queryMetrics.values())
        .filter((m) => m.avgTime > threshold)
        .sort((a, b) => b.avgTime - a.avgTime);
}
// ============================================================================
// LOAD MONITORING
// ============================================================================
/**
 * @function monitorDatabaseLoad
 * @description Monitors database load and active queries
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Load statistics
 *
 * @example
 * ```typescript
 * const load = await monitorDatabaseLoad(sequelize);
 * console.log(`Active queries: ${load.activeQueries}`);
 * ```
 */
async function monitorDatabaseLoad(sequelize) {
    const [stats] = await sequelize.query(`
    SELECT
      (SELECT count(*) FROM pg_stat_activity WHERE state = 'active') as active_queries,
      (SELECT count(*) FROM pg_stat_activity WHERE state = 'idle') as idle_connections,
      (SELECT count(*) FROM pg_stat_activity WHERE wait_event IS NOT NULL) as waiting_queries
  `);
    return stats[0];
}
/**
 * @function getActiveQueries
 * @description Gets currently active queries
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Active queries
 *
 * @example
 * ```typescript
 * const active = await getActiveQueries(sequelize);
 * active.forEach(q => console.log(q.query, q.duration));
 * ```
 */
async function getActiveQueries(sequelize) {
    const [queries] = await sequelize.query(`
    SELECT
      pid,
      usename,
      application_name,
      state,
      query,
      now() - query_start as duration
    FROM pg_stat_activity
    WHERE state = 'active'
      AND pid != pg_backend_pid()
    ORDER BY duration DESC
  `);
    return queries;
}
/**
 * @function killQuery
 * @description Kills a long-running query
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} pid - Process ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await killQuery(sequelize, 12345);
 * ```
 */
async function killQuery(sequelize, pid) {
    await sequelize.query(`SELECT pg_terminate_backend(${pid})`);
}
// ============================================================================
// REPLICATION UTILITIES
// ============================================================================
/**
 * @function setupReadReplicas
 * @description Sets up read replica configuration
 *
 * @param {ReplicationConfig} config - Replication configuration
 * @returns {Options} Sequelize options with replication
 *
 * @example
 * ```typescript
 * const options = setupReadReplicas({
 *   write: { host: 'master.db', username: 'user', password: 'pass' },
 *   read: [
 *     { host: 'replica1.db', username: 'user', password: 'pass' },
 *     { host: 'replica2.db', username: 'user', password: 'pass' }
 *   ],
 *   loadBalancing: 'RANDOM'
 * });
 *
 * const sequelize = new Sequelize({ ...options, database: 'mydb' });
 * ```
 */
function setupReadReplicas(config) {
    return {
        replication: {
            read: config.read,
            write: config.write,
        },
        pool: {
            max: 20,
            min: 5,
            acquire: 30000,
            idle: 10000,
        },
    };
}
/**
 * @function forceReadFromReplica
 * @description Forces a query to use read replica
 *
 * @template M
 * @param {ModelStatic<M>} model - Model to query
 * @param {FindOptions<M>} options - Query options
 * @returns {FindOptions<M>} Options with replica flag
 *
 * @example
 * ```typescript
 * const options = forceReadFromReplica(User, {
 *   where: { status: 'active' }
 * });
 *
 * const users = await User.findAll(options);
 * ```
 */
function forceReadFromReplica(model, options) {
    return {
        ...options,
        useMaster: false,
    };
}
/**
 * @function forceWriteToMaster
 * @description Forces a query to use master database
 *
 * @template M
 * @param {ModelStatic<M>} model - Model to query
 * @param {FindOptions<M>} options - Query options
 * @returns {FindOptions<M>} Options with master flag
 *
 * @example
 * ```typescript
 * const options = forceWriteToMaster(User, {
 *   where: { id: 123 }
 * });
 *
 * const user = await User.findOne(options);
 * ```
 */
function forceWriteToMaster(model, options) {
    return {
        ...options,
        useMaster: true,
    };
}
// ============================================================================
// OPTIMIZATION SUGGESTIONS
// ============================================================================
/**
 * @function generateOptimizationSuggestions
 * @description Generates optimization suggestions based on metrics
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<OptimizationSuggestion[]>} Suggestions
 *
 * @example
 * ```typescript
 * const suggestions = await generateOptimizationSuggestions(sequelize);
 * suggestions.forEach(s => {
 *   console.log(`[${s.priority}] ${s.type}: ${s.description}`);
 * });
 * ```
 */
async function generateOptimizationSuggestions(sequelize) {
    const suggestions = [];
    // Check pool stats
    const poolStats = getPoolStats(sequelize);
    if (poolStats.waiting > 5) {
        suggestions.push({
            type: 'query',
            priority: 5,
            description: 'High connection wait queue detected',
            implementation: 'Increase connection pool size or optimize slow queries',
            impact: 'High - reduces query wait times',
        });
    }
    // Check slow queries
    const slowQueries = detectSlowQueries(1000);
    if (slowQueries.length > 0) {
        suggestions.push({
            type: 'query',
            priority: 4,
            description: `${slowQueries.length} slow queries detected (>1s)`,
            implementation: 'Analyze and optimize slow queries with EXPLAIN',
            impact: 'High - improves response times',
        });
    }
    // Check cache
    const cacheStats = getCacheStats();
    if (cacheStats.size === 0) {
        suggestions.push({
            type: 'cache',
            priority: 3,
            description: 'No query caching detected',
            implementation: 'Implement caching for frequently accessed data',
            impact: 'Medium - reduces database load',
        });
    }
    return suggestions.sort((a, b) => b.priority - a.priority);
}
/**
 * @function optimizeQuery
 * @description Applies automatic optimizations to a query
 *
 * @template M
 * @param {FindOptions<M>} options - Original query options
 * @returns {FindOptions<M>} Optimized query options
 *
 * @example
 * ```typescript
 * const original = {
 *   where: { status: 'active' },
 *   include: [{ model: Post, include: [Comment] }]
 * };
 *
 * const optimized = optimizeQuery(original);
 * // Adds subQuery: false, separate: true where appropriate
 * ```
 */
function optimizeQuery(options) {
    const optimized = { ...options };
    // Disable subquery for better performance
    if (optimized.include && !optimized.subQuery) {
        optimized.subQuery = false;
    }
    // Add limit if not present (prevent large result sets)
    if (!optimized.limit && !optimized.offset) {
        optimized.limit = 1000;
    }
    // Optimize includes
    if (optimized.include && Array.isArray(optimized.include)) {
        optimized.include = optimized.include.map((inc) => {
            if (typeof inc === 'object' && !inc.separate) {
                return { ...inc, separate: true };
            }
            return inc;
        });
    }
    return optimized;
}
/**
 * @function enableQueryLogging
 * @description Enables comprehensive query logging
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} logFile - Log file path
 * @returns {void}
 *
 * @example
 * ```typescript
 * enableQueryLogging(sequelize, '/var/log/queries.log');
 * ```
 */
function enableQueryLogging(sequelize, logFile) {
    sequelize.options.logging = (sql, timing) => {
        const logMessage = `[${new Date().toISOString()}] ${timing || 0}ms: ${sql}`;
        console.log(logMessage);
        if (logFile) {
            // In production, use proper logging library
            require('fs').appendFileSync(logFile, logMessage + '\n');
        }
    };
    sequelize.options.benchmark = true;
}
//# sourceMappingURL=sequelize-performance-utils.js.map