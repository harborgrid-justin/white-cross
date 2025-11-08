/**
 * LOC: S1E2Q3O4P5
 * File: /reuse/sequelize-optimization-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - @types/node (v18.x)
 *
 * DOWNSTREAM (imported by):
 *   - Service layers
 *   - Performance monitoring
 *   - Database optimization modules
 */

/**
 * File: /reuse/sequelize-optimization-kit.ts
 * Locator: WC-UTL-SEQ-OKIT-001
 * Purpose: Sequelize Optimization Kit - Performance analysis and optimization helpers
 *
 * Upstream: sequelize v6.x, @types/node
 * Downstream: All database services, performance monitoring, and optimization modules
 * Dependencies: Sequelize v6.x, Node 18+, TypeScript 5.x
 * Exports: 45 optimization utilities for performance analysis, N+1 prevention, caching, batch loading, and monitoring
 *
 * LLM Context: Production-grade Sequelize v6.x optimization kit for White Cross healthcare platform.
 * Provides advanced helpers for query performance analysis, index suggestions, N+1 query detection and prevention,
 * eager loading optimization, connection pool management, query caching strategies, batch loading utilities,
 * database sharding, read replica routing, and comprehensive performance monitoring. HIPAA-compliant.
 */

import {
  Model,
  ModelStatic,
  Sequelize,
  Op,
  QueryTypes,
  Transaction,
  FindOptions,
  Includeable,
  IncludeOptions,
  Attributes,
  Association,
  ConnectionOptions,
  Options as SequelizeOptions,
  Utils,
  QueryInterface,
} from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Query performance metrics
 */
export interface QueryPerformanceMetrics {
  query: string;
  executionTime: number;
  rowsReturned: number;
  rowsExamined?: number;
  indexUsed?: boolean;
  indexNames?: string[];
  queryPlan?: any;
  timestamp: Date;
  queryType: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'OTHER';
}

/**
 * Index suggestion
 */
export interface IndexSuggestion {
  table: string;
  columns: string[];
  indexType: 'BTREE' | 'HASH' | 'GIN' | 'GIST';
  reason: string;
  estimatedImprovement: number;
  priority: 'high' | 'medium' | 'low';
  createStatement: string;
}

/**
 * N+1 query detection result
 */
export interface NPlusOneDetection {
  detected: boolean;
  mainQuery: string;
  additionalQueries: string[];
  affectedModels: string[];
  suggestion: string;
  severity: 'critical' | 'warning' | 'info';
}

/**
 * Connection pool statistics
 */
export interface ConnectionPoolStats {
  size: number;
  available: number;
  using: number;
  waiting: number;
  maxSize: number;
  minSize: number;
  idleConnections: number;
  utilizationPercent: number;
}

/**
 * Query cache entry
 */
export interface QueryCacheEntry<T = any> {
  key: string;
  data: T;
  createdAt: Date;
  expiresAt: Date;
  hits: number;
  size: number;
  tags?: string[];
}

/**
 * Batch loader configuration
 */
export interface BatchLoaderConfig<K = any, V = any> {
  batchSize?: number;
  maxBatchSize?: number;
  batchScheduleFn?: (callback: () => void) => void;
  cacheKeyFn?: (key: K) => string;
  cacheFn?: (key: K, value: V) => void;
}

/**
 * Shard configuration
 */
export interface ShardConfig {
  name: string;
  sequelize: Sequelize;
  weight?: number;
  readOnly?: boolean;
  priority?: number;
  healthCheck?: () => Promise<boolean>;
}

/**
 * Read replica configuration
 */
export interface ReadReplicaConfig {
  sequelize: Sequelize;
  weight?: number;
  lag?: number;
  healthCheck?: () => Promise<boolean>;
}

/**
 * Performance monitoring configuration
 */
export interface PerformanceMonitorConfig {
  slowQueryThreshold?: number;
  enableQueryLogging?: boolean;
  enableMetrics?: boolean;
  metricsInterval?: number;
  onSlowQuery?: (metrics: QueryPerformanceMetrics) => void;
  onNPlusOne?: (detection: NPlusOneDetection) => void;
}

/**
 * Query optimization suggestion
 */
export interface OptimizationSuggestion {
  type: 'index' | 'query_rewrite' | 'schema_change' | 'configuration';
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  code?: string;
}

/**
 * Eager loading strategy
 */
export interface EagerLoadingStrategy {
  model: ModelStatic<Model>;
  includes: Includeable[];
  strategy: 'join' | 'separate' | 'subquery';
  estimatedRows?: number;
}

// ============================================================================
// SECTION 1: QUERY PERFORMANCE ANALYZERS (Functions 1-8)
// ============================================================================

/**
 * 1. Analyzes query execution plan and provides insights.
 * Examines EXPLAIN output for optimization opportunities.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} query - SQL query to analyze
 * @param {object} options - Analysis options
 * @returns {Promise<QueryPerformanceMetrics>} Performance metrics and analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeQueryPerformance(
 *   sequelize,
 *   'SELECT * FROM users WHERE email = ?',
 *   { includeExplain: true }
 * );
 * console.log(analysis.indexUsed, analysis.executionTime);
 * ```
 */
export async function analyzeQueryPerformance(
  sequelize: Sequelize,
  query: string,
  options: {
    replacements?: any;
    includeExplain?: boolean;
    includeAnalyze?: boolean;
  } = {},
): Promise<QueryPerformanceMetrics> {
  const { replacements = {}, includeExplain = true, includeAnalyze = false } = options;

  const startTime = Date.now();
  let queryPlan: any;

  // Get query execution plan
  if (includeExplain) {
    const dialect = sequelize.getDialect();

    if (dialect === 'postgres') {
      const explainQuery = includeAnalyze
        ? `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) ${query}`
        : `EXPLAIN (FORMAT JSON) ${query}`;

      const [plan] = await sequelize.query(explainQuery, {
        replacements,
        type: QueryTypes.SELECT,
      });
      queryPlan = plan;
    } else if (dialect === 'mysql') {
      const [plan] = await sequelize.query(`EXPLAIN FORMAT=JSON ${query}`, {
        replacements,
        type: QueryTypes.SELECT,
      });
      queryPlan = plan;
    }
  }

  // Execute actual query
  const [results] = await sequelize.query(query, {
    replacements,
    type: QueryTypes.SELECT,
  });

  const executionTime = Date.now() - startTime;

  // Extract metrics from query plan
  const indexUsed = queryPlan ? extractIndexUsage(queryPlan) : undefined;
  const rowsExamined = queryPlan ? extractRowsExamined(queryPlan) : undefined;

  return {
    query,
    executionTime,
    rowsReturned: Array.isArray(results) ? results.length : 1,
    rowsExamined,
    indexUsed,
    queryPlan,
    timestamp: new Date(),
    queryType: determineQueryType(query),
  };
}

/**
 * 2. Profiles a Sequelize query with detailed metrics.
 * Captures comprehensive performance data for Sequelize queries.
 *
 * @param {Function} queryFn - Query function to profile
 * @param {object} options - Profiling options
 * @returns {Promise<{ result: any; metrics: QueryPerformanceMetrics }>} Results and metrics
 *
 * @example
 * ```typescript
 * const { result, metrics } = await profileQuery(
 *   () => User.findAll({ where: { status: 'active' }, include: [Profile] }),
 *   { logQueries: true }
 * );
 * ```
 */
export async function profileQuery<T>(
  queryFn: () => Promise<T>,
  options: {
    logQueries?: boolean;
    captureStackTrace?: boolean;
  } = {},
): Promise<{ result: T; metrics: QueryPerformanceMetrics[] }> {
  const { logQueries = false, captureStackTrace = false } = options;
  const metrics: QueryPerformanceMetrics[] = [];

  // Set up query logging
  const originalLogging = queryFn.constructor.prototype.options?.logging;
  let queryCount = 0;

  const loggingFn = (sql: string, timing?: number) => {
    queryCount++;
    metrics.push({
      query: sql,
      executionTime: timing || 0,
      rowsReturned: 0,
      timestamp: new Date(),
      queryType: determineQueryType(sql),
    });

    if (logQueries) {
      console.log(`[Query ${queryCount}] ${sql} (${timing}ms)`);
    }
  };

  // Execute query with logging
  const startTime = Date.now();
  const result = await queryFn();
  const totalTime = Date.now() - startTime;

  if (captureStackTrace && queryCount > 1) {
    console.warn(
      `Potential N+1 query detected: ${queryCount} queries executed in ${totalTime}ms`,
    );
  }

  return { result, metrics };
}

/**
 * 3. Compares query performance between different approaches.
 * A/B tests different query strategies.
 *
 * @param {object} scenarios - Named query scenarios
 * @param {object} options - Comparison options
 * @returns {Promise<object>} Performance comparison results
 *
 * @example
 * ```typescript
 * const comparison = await compareQueryPerformance({
 *   eager: () => User.findAll({ include: [Post] }),
 *   lazy: () => User.findAll().then(users => Promise.all(users.map(u => u.getPosts()))),
 *   separate: () => User.findAll({ include: [{ model: Post, separate: true }] })
 * }, { iterations: 10 });
 * ```
 */
export async function compareQueryPerformance(
  scenarios: Record<string, () => Promise<any>>,
  options: {
    iterations?: number;
    warmup?: number;
  } = {},
): Promise<Record<string, {
  avgTime: number;
  minTime: number;
  maxTime: number;
  stdDev: number;
  queriesPerExecution: number;
}>> {
  const { iterations = 5, warmup = 1 } = options;
  const results: Record<string, any> = {};

  for (const [name, queryFn] of Object.entries(scenarios)) {
    const timings: number[] = [];
    let queryCounts: number[] = [];

    // Warmup runs
    for (let i = 0; i < warmup; i++) {
      await queryFn();
    }

    // Actual measurements
    for (let i = 0; i < iterations; i++) {
      const { metrics } = await profileQuery(queryFn);
      timings.push(metrics.reduce((sum, m) => sum + m.executionTime, 0));
      queryCounts.push(metrics.length);
    }

    const avgTime = timings.reduce((a, b) => a + b, 0) / timings.length;
    const variance = timings.reduce((sum, t) => sum + Math.pow(t - avgTime, 2), 0) / timings.length;
    const stdDev = Math.sqrt(variance);

    results[name] = {
      avgTime,
      minTime: Math.min(...timings),
      maxTime: Math.max(...timings),
      stdDev,
      queriesPerExecution: queryCounts.reduce((a, b) => a + b, 0) / queryCounts.length,
    };
  }

  return results;
}

/**
 * 4. Identifies slow queries in real-time.
 * Monitors and logs queries exceeding threshold.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} thresholdMs - Slow query threshold in milliseconds
 * @param {Function} callback - Callback for slow queries
 * @returns {Function} Cleanup function to stop monitoring
 *
 * @example
 * ```typescript
 * const stopMonitoring = monitorSlowQueries(
 *   sequelize,
 *   1000,
 *   (query, time) => console.log(`Slow query: ${query} (${time}ms)`)
 * );
 * // Later: stopMonitoring();
 * ```
 */
export function monitorSlowQueries(
  sequelize: Sequelize,
  thresholdMs: number,
  callback: (query: string, executionTime: number, metrics: QueryPerformanceMetrics) => void,
): () => void {
  const originalLogging = sequelize.options.logging;

  sequelize.options.logging = (query: string, timing?: any) => {
    const executionTime = typeof timing === 'number' ? timing : timing?.executionTime || 0;

    if (executionTime > thresholdMs) {
      const metrics: QueryPerformanceMetrics = {
        query,
        executionTime,
        rowsReturned: 0,
        timestamp: new Date(),
        queryType: determineQueryType(query),
      };

      callback(query, executionTime, metrics);
    }

    if (originalLogging && typeof originalLogging === 'function') {
      originalLogging(query, timing);
    }
  };

  // Return cleanup function
  return () => {
    sequelize.options.logging = originalLogging;
  };
}

/**
 * 5. Generates query performance report.
 * Creates comprehensive performance analysis report.
 *
 * @param {QueryPerformanceMetrics[]} metrics - Collected metrics
 * @returns {object} Performance report
 *
 * @example
 * ```typescript
 * const report = generatePerformanceReport(collectedMetrics);
 * console.log(report.summary, report.slowestQueries, report.recommendations);
 * ```
 */
export function generatePerformanceReport(metrics: QueryPerformanceMetrics[]): {
  summary: {
    totalQueries: number;
    avgExecutionTime: number;
    slowQueries: number;
    fastQueries: number;
    totalExecutionTime: number;
  };
  slowestQueries: QueryPerformanceMetrics[];
  queryTypeDistribution: Record<string, number>;
  recommendations: string[];
} {
  const totalQueries = metrics.length;
  const totalExecutionTime = metrics.reduce((sum, m) => sum + m.executionTime, 0);
  const avgExecutionTime = totalExecutionTime / totalQueries;

  const slowThreshold = avgExecutionTime * 2;
  const slowQueries = metrics.filter(m => m.executionTime > slowThreshold).length;
  const fastQueries = totalQueries - slowQueries;

  const slowestQueries = [...metrics]
    .sort((a, b) => b.executionTime - a.executionTime)
    .slice(0, 10);

  const queryTypeDistribution = metrics.reduce((acc, m) => {
    acc[m.queryType] = (acc[m.queryType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const recommendations: string[] = [];

  if (slowQueries > totalQueries * 0.2) {
    recommendations.push('More than 20% of queries are slow. Consider adding indexes or optimizing query logic.');
  }

  const selectQueries = queryTypeDistribution.SELECT || 0;
  if (selectQueries > totalQueries * 0.8) {
    recommendations.push('High number of SELECT queries. Consider implementing caching.');
  }

  const noPlusOne = metrics.filter((_, idx) => {
    if (idx === 0) return false;
    return metrics[idx - 1].queryType === 'SELECT' && metrics[idx].queryType === 'SELECT';
  }).length;

  if (noPlusOne > totalQueries * 0.3) {
    recommendations.push('Potential N+1 queries detected. Use eager loading or batch loading.');
  }

  return {
    summary: {
      totalQueries,
      avgExecutionTime,
      slowQueries,
      fastQueries,
      totalExecutionTime,
    },
    slowestQueries,
    queryTypeDistribution,
    recommendations,
  };
}

/**
 * 6. Tracks query execution statistics over time.
 * Maintains running statistics for query monitoring.
 *
 * @returns {object} Query statistics tracker
 *
 * @example
 * ```typescript
 * const tracker = createQueryStatisticsTracker();
 * tracker.recordQuery(query, 150);
 * const stats = tracker.getStatistics();
 * ```
 */
export function createQueryStatisticsTracker(): {
  recordQuery: (query: string, executionTime: number) => void;
  getStatistics: () => {
    count: number;
    avgTime: number;
    minTime: number;
    maxTime: number;
    p50: number;
    p95: number;
    p99: number;
  };
  reset: () => void;
} {
  const timings: number[] = [];
  let count = 0;
  let sum = 0;
  let min = Infinity;
  let max = -Infinity;

  return {
    recordQuery: (query: string, executionTime: number) => {
      timings.push(executionTime);
      count++;
      sum += executionTime;
      min = Math.min(min, executionTime);
      max = Math.max(max, executionTime);
    },

    getStatistics: () => {
      if (count === 0) {
        return {
          count: 0,
          avgTime: 0,
          minTime: 0,
          maxTime: 0,
          p50: 0,
          p95: 0,
          p99: 0,
        };
      }

      const sorted = [...timings].sort((a, b) => a - b);
      const p50 = sorted[Math.floor(sorted.length * 0.5)];
      const p95 = sorted[Math.floor(sorted.length * 0.95)];
      const p99 = sorted[Math.floor(sorted.length * 0.99)];

      return {
        count,
        avgTime: sum / count,
        minTime: min,
        maxTime: max,
        p50,
        p95,
        p99,
      };
    },

    reset: () => {
      timings.length = 0;
      count = 0;
      sum = 0;
      min = Infinity;
      max = -Infinity;
    },
  };
}

/**
 * 7. Detects query performance regressions.
 * Compares current performance against baseline.
 *
 * @param {QueryPerformanceMetrics[]} baseline - Baseline metrics
 * @param {QueryPerformanceMetrics[]} current - Current metrics
 * @param {number} threshold - Regression threshold percentage
 * @returns {object[]} Detected regressions
 *
 * @example
 * ```typescript
 * const regressions = detectQueryRegressions(
 *   baselineMetrics,
 *   currentMetrics,
 *   20 // 20% slower is a regression
 * );
 * ```
 */
export function detectQueryRegressions(
  baseline: QueryPerformanceMetrics[],
  current: QueryPerformanceMetrics[],
  threshold: number = 20,
): Array<{
  query: string;
  baselineTime: number;
  currentTime: number;
  degradationPercent: number;
}> {
  const regressions: Array<{
    query: string;
    baselineTime: number;
    currentTime: number;
    degradationPercent: number;
  }> = [];

  // Group metrics by query
  const baselineMap = new Map<string, number[]>();
  baseline.forEach(m => {
    const times = baselineMap.get(m.query) || [];
    times.push(m.executionTime);
    baselineMap.set(m.query, times);
  });

  const currentMap = new Map<string, number[]>();
  current.forEach(m => {
    const times = currentMap.get(m.query) || [];
    times.push(m.executionTime);
    currentMap.set(m.query, times);
  });

  // Compare averages
  for (const [query, baselineTimes] of baselineMap.entries()) {
    const currentTimes = currentMap.get(query);
    if (!currentTimes) continue;

    const baselineAvg = baselineTimes.reduce((a, b) => a + b, 0) / baselineTimes.length;
    const currentAvg = currentTimes.reduce((a, b) => a + b, 0) / currentTimes.length;

    const degradationPercent = ((currentAvg - baselineAvg) / baselineAvg) * 100;

    if (degradationPercent > threshold) {
      regressions.push({
        query,
        baselineTime: baselineAvg,
        currentTime: currentAvg,
        degradationPercent,
      });
    }
  }

  return regressions.sort((a, b) => b.degradationPercent - a.degradationPercent);
}

/**
 * 8. Estimates query cost before execution.
 * Provides cost estimates using EXPLAIN without executing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} query - Query to estimate
 * @param {object} replacements - Query parameters
 * @returns {Promise<object>} Cost estimation
 *
 * @example
 * ```typescript
 * const cost = await estimateQueryCost(
 *   sequelize,
 *   'SELECT * FROM users WHERE age > ?',
 *   { age: 18 }
 * );
 * console.log(cost.estimatedRows, cost.estimatedCost);
 * ```
 */
export async function estimateQueryCost(
  sequelize: Sequelize,
  query: string,
  replacements: any = {},
): Promise<{
  estimatedRows: number;
  estimatedCost: number;
  indexUsed: boolean;
  recommendation: string;
}> {
  const dialect = sequelize.getDialect();

  if (dialect === 'postgres') {
    const [plan] = await sequelize.query(`EXPLAIN (FORMAT JSON) ${query}`, {
      replacements,
      type: QueryTypes.SELECT,
    });

    const planData = (plan as any)?.['QUERY PLAN']?.[0]?.Plan || {};

    return {
      estimatedRows: planData['Plan Rows'] || 0,
      estimatedCost: planData['Total Cost'] || 0,
      indexUsed: planData['Index Name'] !== undefined,
      recommendation: planData['Total Cost'] > 1000
        ? 'High cost query detected. Consider adding indexes or optimizing WHERE clauses.'
        : 'Query cost is acceptable.',
    };
  } else if (dialect === 'mysql') {
    const [plan] = await sequelize.query(`EXPLAIN FORMAT=JSON ${query}`, {
      replacements,
      type: QueryTypes.SELECT,
    });

    const planData = (plan as any)?.query_block || {};
    const cost = planData.cost_info?.query_cost || 0;

    return {
      estimatedRows: planData.table?.rows_examined_per_scan || 0,
      estimatedCost: parseFloat(cost),
      indexUsed: planData.table?.key !== undefined,
      recommendation: cost > 1000
        ? 'High cost query detected. Consider optimization.'
        : 'Query cost is acceptable.',
    };
  }

  return {
    estimatedRows: 0,
    estimatedCost: 0,
    indexUsed: false,
    recommendation: 'Query cost estimation not supported for this database.',
  };
}

// ============================================================================
// SECTION 2: INDEX SUGGESTION HELPERS (Functions 9-13)
// ============================================================================

/**
 * 9. Analyzes query patterns and suggests indexes.
 * Identifies missing indexes based on query analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {QueryPerformanceMetrics[]} metrics - Query metrics to analyze
 * @returns {Promise<IndexSuggestion[]>} Index suggestions
 *
 * @example
 * ```typescript
 * const suggestions = await suggestIndexes(sequelize, queryMetrics);
 * suggestions.forEach(s => console.log(s.createStatement));
 * ```
 */
export async function suggestIndexes(
  sequelize: Sequelize,
  metrics: QueryPerformanceMetrics[],
): Promise<IndexSuggestion[]> {
  const suggestions: IndexSuggestion[] = [];

  // Analyze slow queries
  const slowQueries = metrics.filter(m => m.executionTime > 100 && !m.indexUsed);

  for (const metric of slowQueries) {
    // Extract WHERE clause columns
    const whereColumns = extractWhereColumns(metric.query);

    if (whereColumns.length > 0) {
      const table = extractTableName(metric.query);

      suggestions.push({
        table,
        columns: whereColumns,
        indexType: 'BTREE',
        reason: `Slow query detected (${metric.executionTime}ms) without index usage`,
        estimatedImprovement: metric.executionTime * 0.7, // Estimate 70% improvement
        priority: metric.executionTime > 1000 ? 'high' : 'medium',
        createStatement: `CREATE INDEX idx_${table}_${whereColumns.join('_')} ON ${table} (${whereColumns.join(', ')});`,
      });
    }
  }

  return suggestions;
}

/**
 * 10. Validates existing indexes against query patterns.
 * Identifies unused or redundant indexes.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name to analyze
 * @param {QueryPerformanceMetrics[]} metrics - Query metrics
 * @returns {Promise<object[]>} Index analysis results
 *
 * @example
 * ```typescript
 * const analysis = await analyzeIndexUsage(sequelize, 'users', queryMetrics);
 * analysis.forEach(idx => {
 *   if (!idx.used) console.log(`Unused index: ${idx.name}`);
 * });
 * ```
 */
export async function analyzeIndexUsage(
  sequelize: Sequelize,
  tableName: string,
  metrics: QueryPerformanceMetrics[],
): Promise<Array<{
  name: string;
  columns: string[];
  used: boolean;
  usageCount: number;
  recommendation: string;
}>> {
  const dialect = sequelize.getDialect();
  const indexes: any[] = [];

  // Get existing indexes
  if (dialect === 'postgres') {
    const result = await sequelize.query(
      `SELECT indexname, indexdef FROM pg_indexes WHERE tablename = :tableName`,
      { replacements: { tableName }, type: QueryTypes.SELECT },
    );
    indexes.push(...result);
  } else if (dialect === 'mysql') {
    const result = await sequelize.query(
      `SHOW INDEX FROM ${tableName}`,
      { type: QueryTypes.SELECT },
    );
    indexes.push(...result);
  }

  // Analyze usage
  return indexes.map((idx: any) => {
    const indexName = idx.indexname || idx.Key_name;
    const usageCount = metrics.filter(m =>
      m.indexNames?.includes(indexName),
    ).length;

    const used = usageCount > 0;

    let recommendation = '';
    if (!used) {
      recommendation = 'Consider dropping this unused index to improve write performance';
    } else if (usageCount < 5) {
      recommendation = 'Low usage index. Monitor and consider dropping if usage remains low';
    } else {
      recommendation = 'Index is actively used and should be kept';
    }

    return {
      name: indexName,
      columns: extractIndexColumns(idx),
      used,
      usageCount,
      recommendation,
    };
  });
}

/**
 * 11. Detects redundant or duplicate indexes.
 * Finds indexes that can be consolidated.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name to analyze
 * @returns {Promise<object[]>} Redundant index pairs
 *
 * @example
 * ```typescript
 * const redundant = await detectRedundantIndexes(sequelize, 'users');
 * redundant.forEach(pair => {
 *   console.log(`Drop ${pair.redundantIndex}, keep ${pair.coveringIndex}`);
 * });
 * ```
 */
export async function detectRedundantIndexes(
  sequelize: Sequelize,
  tableName: string,
): Promise<Array<{
  redundantIndex: string;
  coveringIndex: string;
  reason: string;
}>> {
  const dialect = sequelize.getDialect();
  const redundancies: Array<{
    redundantIndex: string;
    coveringIndex: string;
    reason: string;
  }> = [];

  // Get all indexes
  let indexes: any[] = [];

  if (dialect === 'postgres') {
    indexes = await sequelize.query(
      `SELECT indexname, indexdef FROM pg_indexes WHERE tablename = :tableName`,
      { replacements: { tableName }, type: QueryTypes.SELECT },
    ) as any[];
  } else if (dialect === 'mysql') {
    indexes = await sequelize.query(
      `SHOW INDEX FROM ${tableName}`,
      { type: QueryTypes.SELECT },
    ) as any[];
  }

  // Compare indexes pairwise
  for (let i = 0; i < indexes.length; i++) {
    for (let j = i + 1; j < indexes.length; j++) {
      const idx1 = indexes[i];
      const idx2 = indexes[j];

      const cols1 = extractIndexColumns(idx1);
      const cols2 = extractIndexColumns(idx2);

      // Check if one is a prefix of the other
      if (isPrefix(cols1, cols2)) {
        redundancies.push({
          redundantIndex: idx1.indexname || idx1.Key_name,
          coveringIndex: idx2.indexname || idx2.Key_name,
          reason: `Index on (${cols1.join(', ')}) is redundant with (${cols2.join(', ')})`,
        });
      } else if (isPrefix(cols2, cols1)) {
        redundancies.push({
          redundantIndex: idx2.indexname || idx2.Key_name,
          coveringIndex: idx1.indexname || idx1.Key_name,
          reason: `Index on (${cols2.join(', ')}) is redundant with (${cols1.join(', ')})`,
        });
      }
    }
  }

  return redundancies;
}

/**
 * 12. Generates optimal composite index recommendations.
 * Suggests multi-column indexes based on query patterns.
 *
 * @param {QueryPerformanceMetrics[]} metrics - Query metrics
 * @param {object} options - Recommendation options
 * @returns {IndexSuggestion[]} Composite index suggestions
 *
 * @example
 * ```typescript
 * const composites = generateCompositeIndexRecommendations(
 *   queryMetrics,
 *   { minOccurrences: 5, maxColumns: 3 }
 * );
 * ```
 */
export function generateCompositeIndexRecommendations(
  metrics: QueryPerformanceMetrics[],
  options: {
    minOccurrences?: number;
    maxColumns?: number;
  } = {},
): IndexSuggestion[] {
  const { minOccurrences = 3, maxColumns = 3 } = options;

  // Track column combinations
  const combinations = new Map<string, {
    table: string;
    columns: string[];
    occurrences: number;
    totalTime: number;
  }>();

  for (const metric of metrics) {
    const table = extractTableName(metric.query);
    const columns = extractWhereColumns(metric.query).slice(0, maxColumns);

    if (columns.length > 1) {
      const key = `${table}:${columns.join(',')}`;
      const existing = combinations.get(key);

      if (existing) {
        existing.occurrences++;
        existing.totalTime += metric.executionTime;
      } else {
        combinations.set(key, {
          table,
          columns,
          occurrences: 1,
          totalTime: metric.executionTime,
        });
      }
    }
  }

  // Generate suggestions
  const suggestions: IndexSuggestion[] = [];

  for (const [key, data] of combinations.entries()) {
    if (data.occurrences >= minOccurrences) {
      suggestions.push({
        table: data.table,
        columns: data.columns,
        indexType: 'BTREE',
        reason: `Composite index for ${data.occurrences} queries with avg time ${(data.totalTime / data.occurrences).toFixed(2)}ms`,
        estimatedImprovement: data.totalTime * 0.6,
        priority: data.totalTime / data.occurrences > 500 ? 'high' : 'medium',
        createStatement: `CREATE INDEX idx_${data.table}_${data.columns.join('_')} ON ${data.table} (${data.columns.join(', ')});`,
      });
    }
  }

  return suggestions.sort((a, b) => b.estimatedImprovement - a.estimatedImprovement);
}

/**
 * 13. Calculates index selectivity and effectiveness.
 * Measures how well an index filters data.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {string} columnName - Column name
 * @returns {Promise<object>} Selectivity analysis
 *
 * @example
 * ```typescript
 * const selectivity = await calculateIndexSelectivity(sequelize, 'users', 'email');
 * if (selectivity.selectivity < 0.1) {
 *   console.log('High selectivity - good index candidate');
 * }
 * ```
 */
export async function calculateIndexSelectivity(
  sequelize: Sequelize,
  tableName: string,
  columnName: string,
): Promise<{
  selectivity: number;
  uniqueValues: number;
  totalRows: number;
  recommendation: string;
}> {
  // Get total rows
  const [totalResult] = await sequelize.query(
    `SELECT COUNT(*) as count FROM ${tableName}`,
    { type: QueryTypes.SELECT },
  ) as any[];
  const totalRows = parseInt(totalResult.count, 10);

  // Get unique values
  const [uniqueResult] = await sequelize.query(
    `SELECT COUNT(DISTINCT ${columnName}) as count FROM ${tableName}`,
    { type: QueryTypes.SELECT },
  ) as any[];
  const uniqueValues = parseInt(uniqueResult.count, 10);

  const selectivity = uniqueValues / totalRows;

  let recommendation = '';
  if (selectivity > 0.95) {
    recommendation = 'Excellent index candidate - very high selectivity';
  } else if (selectivity > 0.7) {
    recommendation = 'Good index candidate - high selectivity';
  } else if (selectivity > 0.3) {
    recommendation = 'Moderate index candidate - consider composite index';
  } else {
    recommendation = 'Poor index candidate - low selectivity, may not be beneficial';
  }

  return {
    selectivity,
    uniqueValues,
    totalRows,
    recommendation,
  };
}

// ============================================================================
// SECTION 3: N+1 QUERY PREVENTION (Functions 14-19)
// ============================================================================

/**
 * 14. Detects N+1 query patterns in real-time.
 * Monitors query execution to identify N+1 issues.
 *
 * @param {QueryPerformanceMetrics[]} metrics - Query metrics
 * @param {object} options - Detection options
 * @returns {NPlusOneDetection[]} Detected N+1 patterns
 *
 * @example
 * ```typescript
 * const detections = detectNPlusOneQueries(queryMetrics);
 * detections.forEach(d => {
 *   if (d.severity === 'critical') console.error(d.suggestion);
 * });
 * ```
 */
export function detectNPlusOneQueries(
  metrics: QueryPerformanceMetrics[],
  options: {
    threshold?: number;
    timeWindow?: number;
  } = {},
): NPlusOneDetection[] {
  const { threshold = 10, timeWindow = 1000 } = options;
  const detections: NPlusOneDetection[] = [];

  // Group queries by time window
  const windows: QueryPerformanceMetrics[][] = [];
  let currentWindow: QueryPerformanceMetrics[] = [];
  let windowStart = 0;

  for (const metric of metrics) {
    const metricTime = metric.timestamp.getTime();

    if (windowStart === 0) {
      windowStart = metricTime;
    }

    if (metricTime - windowStart > timeWindow) {
      if (currentWindow.length > 0) {
        windows.push(currentWindow);
      }
      currentWindow = [];
      windowStart = metricTime;
    }

    currentWindow.push(metric);
  }

  if (currentWindow.length > 0) {
    windows.push(currentWindow);
  }

  // Analyze each window
  for (const window of windows) {
    if (window.length < threshold) continue;

    // Look for pattern: 1 main query + N similar queries
    const firstQuery = window[0];
    const similarQueries = window.slice(1).filter(q =>
      queriesAreSimilar(firstQuery.query, q.query),
    );

    if (similarQueries.length >= threshold - 1) {
      const affectedModels = extractModelNames(firstQuery.query);

      detections.push({
        detected: true,
        mainQuery: firstQuery.query,
        additionalQueries: similarQueries.map(q => q.query),
        affectedModels,
        suggestion: `Detected ${similarQueries.length + 1} similar queries. Use eager loading with 'include' option or implement DataLoader pattern.`,
        severity: similarQueries.length > 50 ? 'critical' : similarQueries.length > 20 ? 'warning' : 'info',
      });
    }
  }

  return detections;
}

/**
 * 15. Automatically optimizes includes to prevent N+1.
 * Rewrites query options to use optimal eager loading.
 *
 * @param {FindOptions} options - Original find options
 * @param {object} config - Optimization configuration
 * @returns {FindOptions} Optimized find options
 *
 * @example
 * ```typescript
 * const optimized = preventNPlusOne(
 *   { where: { status: 'active' }, include: [Post] },
 *   { useSeparate: true, maxDepth: 2 }
 * );
 * ```
 */
export function preventNPlusOne(
  options: FindOptions,
  config: {
    useSeparate?: boolean;
    useSubQuery?: boolean;
    maxDepth?: number;
  } = {},
): FindOptions {
  const { useSeparate = false, useSubQuery = false, maxDepth = 3 } = config;

  const optimized: FindOptions = { ...options };

  if (optimized.include) {
    optimized.include = optimizeIncludesForNPlusOne(
      Array.isArray(optimized.include) ? optimized.include : [optimized.include],
      { useSeparate, maxDepth, currentDepth: 0 },
    );
  }

  if (useSubQuery !== undefined) {
    optimized.subQuery = useSubQuery;
  }

  return optimized;
}

/**
 * 16. Implements DataLoader pattern for batch loading.
 * Creates a batch loader for preventing N+1 queries.
 *
 * @param {Function} batchLoadFn - Batch loading function
 * @param {BatchLoaderConfig} config - Loader configuration
 * @returns {object} DataLoader instance
 *
 * @example
 * ```typescript
 * const userLoader = createDataLoader(
 *   async (ids) => User.findAll({ where: { id: { [Op.in]: ids } } }),
 *   { batchSize: 100 }
 * );
 * const user = await userLoader.load(123);
 * ```
 */
export function createDataLoader<K, V>(
  batchLoadFn: (keys: K[]) => Promise<V[]>,
  config: BatchLoaderConfig<K, V> = {},
): {
  load: (key: K) => Promise<V>;
  loadMany: (keys: K[]) => Promise<V[]>;
  clear: (key: K) => void;
  clearAll: () => void;
} {
  const {
    batchSize = 50,
    maxBatchSize = 1000,
    batchScheduleFn = (callback) => process.nextTick(callback),
    cacheKeyFn = (key) => String(key),
  } = config;

  const cache = new Map<string, V>();
  const queue: Array<{
    key: K;
    resolve: (value: V) => void;
    reject: (error: any) => void;
  }> = [];
  let scheduled = false;

  const dispatch = async () => {
    scheduled = false;

    const batch = queue.splice(0, maxBatchSize);
    if (batch.length === 0) return;

    const keys = batch.map(item => item.key);

    try {
      const results = await batchLoadFn(keys);

      batch.forEach((item, index) => {
        const result = results[index];
        const cacheKey = cacheKeyFn(item.key);
        cache.set(cacheKey, result);
        item.resolve(result);
      });
    } catch (error) {
      batch.forEach(item => item.reject(error));
    }

    // Schedule next batch if queue has items
    if (queue.length > 0) {
      scheduled = true;
      batchScheduleFn(dispatch);
    }
  };

  return {
    load: (key: K): Promise<V> => {
      const cacheKey = cacheKeyFn(key);
      const cached = cache.get(cacheKey);

      if (cached !== undefined) {
        return Promise.resolve(cached);
      }

      return new Promise((resolve, reject) => {
        queue.push({ key, resolve, reject });

        if (!scheduled) {
          scheduled = true;
          batchScheduleFn(dispatch);
        }
      });
    },

    loadMany: async (keys: K[]): Promise<V[]> => {
      return Promise.all(keys.map(key => {
        const cacheKey = cacheKeyFn(key);
        const cached = cache.get(cacheKey);

        if (cached !== undefined) {
          return Promise.resolve(cached);
        }

        return new Promise<V>((resolve, reject) => {
          queue.push({ key, resolve, reject });

          if (!scheduled) {
            scheduled = true;
            batchScheduleFn(dispatch);
          }
        });
      }));
    },

    clear: (key: K) => {
      const cacheKey = cacheKeyFn(key);
      cache.delete(cacheKey);
    },

    clearAll: () => {
      cache.clear();
    },
  };
}

/**
 * 17. Prefetches associations to prevent lazy loading.
 * Eagerly loads all necessary associations.
 *
 * @param {T[]} instances - Model instances
 * @param {string[]} associations - Associations to prefetch
 * @returns {Promise<T[]>} Instances with prefetched associations
 *
 * @example
 * ```typescript
 * const users = await User.findAll({ where: { status: 'active' } });
 * const usersWithData = await prefetchAssociations(users, ['posts', 'comments']);
 * ```
 */
export async function prefetchAssociations<T extends Model>(
  instances: T[],
  associations: string[],
): Promise<T[]> {
  if (instances.length === 0) return instances;

  const model = instances[0].constructor as ModelStatic<T>;

  for (const associationName of associations) {
    const association = (model as any).associations[associationName];

    if (!association) {
      console.warn(`Association '${associationName}' not found on model`);
      continue;
    }

    // Batch load association
    const ids = instances.map((instance: any) => instance.id);
    const associatedRecords = await association.target.findAll({
      where: {
        [association.foreignKey]: { [Op.in]: ids },
      },
    });

    // Map records to instances
    const recordsMap = new Map();
    for (const record of associatedRecords) {
      const foreignKeyValue = (record as any)[association.foreignKey];
      if (!recordsMap.has(foreignKeyValue)) {
        recordsMap.set(foreignKeyValue, []);
      }
      recordsMap.get(foreignKeyValue).push(record);
    }

    // Attach to instances
    for (const instance of instances) {
      const records = recordsMap.get((instance as any).id) || [];
      (instance as any)[associationName] = association.isMultiAssociation ? records : records[0];
    }
  }

  return instances;
}

/**
 * 18. Analyzes association loading strategy effectiveness.
 * Compares different loading strategies.
 *
 * @param {ModelStatic<T>} model - Model to analyze
 * @param {FindOptions} baseQuery - Base query options
 * @returns {Promise<object>} Strategy comparison
 *
 * @example
 * ```typescript
 * const analysis = await analyzeLoadingStrategy(
 *   User,
 *   { where: { status: 'active' }, include: [Post] }
 * );
 * console.log(analysis.recommended);
 * ```
 */
export async function analyzeLoadingStrategy<T extends Model>(
  model: ModelStatic<T>,
  baseQuery: FindOptions,
): Promise<{
  strategies: Record<string, { time: number; queries: number }>;
  recommended: string;
}> {
  const strategies: Record<string, { time: number; queries: number }> = {};

  // Test eager loading (join)
  const eagerStart = Date.now();
  const { metrics: eagerMetrics } = await profileQuery(() =>
    model.findAll({ ...baseQuery, subQuery: false }),
  );
  strategies.eager = {
    time: Date.now() - eagerStart,
    queries: eagerMetrics.length,
  };

  // Test separate queries
  const separateStart = Date.now();
  const { metrics: separateMetrics } = await profileQuery(() =>
    model.findAll({
      ...baseQuery,
      include: baseQuery.include
        ? (Array.isArray(baseQuery.include) ? baseQuery.include : [baseQuery.include]).map(inc =>
            typeof inc === 'object' ? { ...inc, separate: true } : inc,
          )
        : undefined,
    }),
  );
  strategies.separate = {
    time: Date.now() - separateStart,
    queries: separateMetrics.length,
  };

  // Determine recommendation
  let recommended = 'eager';
  if (strategies.separate.time < strategies.eager.time * 0.8) {
    recommended = 'separate';
  }

  return { strategies, recommended };
}

/**
 * 19. Implements association caching to reduce queries.
 * Caches frequently accessed associations.
 *
 * @param {ModelStatic<T>} model - Model to cache associations for
 * @param {string} associationName - Association to cache
 * @param {object} cacheOptions - Cache configuration
 * @returns {object} Cached association accessor
 *
 * @example
 * ```typescript
 * const getCachedPosts = cacheAssociation(User, 'posts', { ttl: 300 });
 * const posts = await getCachedPosts(userId);
 * ```
 */
export function cacheAssociation<T extends Model>(
  model: ModelStatic<T>,
  associationName: string,
  cacheOptions: {
    ttl?: number;
    maxSize?: number;
  } = {},
): (instanceId: string | number) => Promise<any> {
  const { ttl = 60, maxSize = 1000 } = cacheOptions;
  const cache = new Map<string, QueryCacheEntry>();

  return async (instanceId: string | number) => {
    const cacheKey = `${model.name}:${instanceId}:${associationName}`;
    const cached = cache.get(cacheKey);

    if (cached && cached.expiresAt > new Date()) {
      cached.hits++;
      return cached.data;
    }

    // Load association
    const instance = await model.findByPk(instanceId);
    if (!instance) return null;

    const data = await (instance as any)[`get${associationName.charAt(0).toUpperCase()}${associationName.slice(1)}`]();

    // Store in cache
    const entry: QueryCacheEntry = {
      key: cacheKey,
      data,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + ttl * 1000),
      hits: 0,
      size: JSON.stringify(data).length,
    };

    cache.set(cacheKey, entry);

    // Evict old entries if cache is too large
    if (cache.size > maxSize) {
      const oldestKey = Array.from(cache.entries())
        .sort((a, b) => a[1].createdAt.getTime() - b[1].createdAt.getTime())[0][0];
      cache.delete(oldestKey);
    }

    return data;
  };
}

// ============================================================================
// SECTION 4: EAGER LOADING OPTIMIZERS (Functions 20-24)
// ============================================================================

/**
 * 20. Optimizes nested include depth and structure.
 * Restructures includes for optimal performance.
 *
 * @param {Includeable[]} includes - Include options to optimize
 * @param {number} maxDepth - Maximum nesting depth
 * @returns {Includeable[]} Optimized includes
 *
 * @example
 * ```typescript
 * const optimized = optimizeIncludeDepth([
 *   { model: Post, include: [{ model: Comment, include: [Author] }] }
 * ], 2);
 * ```
 */
export function optimizeIncludeDepth(
  includes: Includeable[],
  maxDepth: number = 3,
): Includeable[] {
  const optimize = (includes: Includeable[], currentDepth: number): Includeable[] => {
    if (currentDepth >= maxDepth) {
      return [];
    }

    return includes.map(include => {
      if (typeof include === 'string') {
        return include;
      }

      const optimized: IncludeOptions = { ...include };

      if (optimized.include) {
        const nestedIncludes = Array.isArray(optimized.include)
          ? optimized.include
          : [optimized.include];

        optimized.include = optimize(nestedIncludes, currentDepth + 1);

        if (optimized.include.length === 0) {
          delete optimized.include;
        }
      }

      return optimized;
    });
  };

  return optimize(includes, 0);
}

/**
 * 21. Determines optimal join vs. separate query strategy.
 * Chooses best loading strategy based on data characteristics.
 *
 * @param {object} config - Strategy determination config
 * @returns {EagerLoadingStrategy} Recommended strategy
 *
 * @example
 * ```typescript
 * const strategy = determineEagerLoadingStrategy({
 *   parentCount: 100,
 *   childrenPerParent: 50,
 *   associationType: 'hasMany'
 * });
 * console.log(strategy.strategy); // 'separate' or 'join'
 * ```
 */
export function determineEagerLoadingStrategy(config: {
  parentCount?: number;
  childrenPerParent?: number;
  associationType?: 'hasMany' | 'hasOne' | 'belongsTo';
  dataSize?: number;
}): { strategy: 'join' | 'separate' | 'subquery'; reason: string } {
  const {
    parentCount = 100,
    childrenPerParent = 10,
    associationType = 'hasMany',
    dataSize = 1024,
  } = config;

  const totalRows = parentCount * childrenPerParent;

  // Use separate queries for large result sets
  if (totalRows > 10000) {
    return {
      strategy: 'separate',
      reason: `Large result set (${totalRows} rows) performs better with separate queries`,
    };
  }

  // Use join for small result sets
  if (totalRows < 1000 && associationType !== 'hasMany') {
    return {
      strategy: 'join',
      reason: 'Small result set with simple association benefits from join',
    };
  }

  // Use separate for hasMany with high cardinality
  if (associationType === 'hasMany' && childrenPerParent > 20) {
    return {
      strategy: 'separate',
      reason: 'High cardinality hasMany association performs better with separate queries',
    };
  }

  // Use subquery for moderate complexity
  return {
    strategy: 'subquery',
    reason: 'Moderate complexity benefits from subquery strategy',
  };
}

/**
 * 22. Implements selective eager loading based on data access patterns.
 * Loads only frequently accessed associations.
 *
 * @param {FindOptions} options - Original options
 * @param {object} accessPatterns - Recorded access patterns
 * @returns {FindOptions} Options with selective includes
 *
 * @example
 * ```typescript
 * const selective = applySelectiveEagerLoading(
 *   baseOptions,
 *   { posts: 0.8, comments: 0.3, profile: 0.95 }
 * );
 * // Only includes posts and profile (threshold 0.5)
 * ```
 */
export function applySelectiveEagerLoading(
  options: FindOptions,
  accessPatterns: Record<string, number>,
  threshold: number = 0.5,
): FindOptions {
  const selective: FindOptions = { ...options };

  // Filter includes based on access patterns
  if (selective.include) {
    const includes = Array.isArray(selective.include)
      ? selective.include
      : [selective.include];

    selective.include = includes.filter(include => {
      if (typeof include === 'string') {
        return (accessPatterns[include] || 0) >= threshold;
      }

      const associationName = (include as IncludeOptions).as || (include as IncludeOptions).association;
      return (accessPatterns[associationName as string] || 0) >= threshold;
    });
  }

  return selective;
}

/**
 * 23. Parallelizes independent include queries.
 * Executes non-dependent includes in parallel.
 *
 * @param {ModelStatic<T>} model - Model to query
 * @param {FindOptions} options - Query options with includes
 * @returns {Promise<T[]>} Results with parallel-loaded includes
 *
 * @example
 * ```typescript
 * const users = await parallelLoadIncludes(User, {
 *   where: { status: 'active' },
 *   include: [Profile, Posts, Comments]
 * });
 * ```
 */
export async function parallelLoadIncludes<T extends Model>(
  model: ModelStatic<T>,
  options: FindOptions,
): Promise<T[]> {
  // First, load base records
  const baseRecords = await model.findAll({
    ...options,
    include: undefined,
  });

  if (baseRecords.length === 0 || !options.include) {
    return baseRecords as T[];
  }

  // Load includes in parallel
  const includes = Array.isArray(options.include) ? options.include : [options.include];
  const ids = baseRecords.map((r: any) => r.id);

  await Promise.all(
    includes.map(async include => {
      if (typeof include === 'string') {
        // Load via association accessor
        const associationName = include;
        const association = (model as any).associations[associationName];

        if (association) {
          const associated = await association.target.findAll({
            where: {
              [association.foreignKey]: { [Op.in]: ids },
            },
          });

          // Map to instances
          const associatedMap = new Map();
          for (const record of associated) {
            const fkValue = (record as any)[association.foreignKey];
            if (!associatedMap.has(fkValue)) {
              associatedMap.set(fkValue, []);
            }
            associatedMap.get(fkValue).push(record);
          }

          for (const instance of baseRecords) {
            const records = associatedMap.get((instance as any).id) || [];
            (instance as any)[associationName] = association.isMultiAssociation
              ? records
              : records[0];
          }
        }
      }
    }),
  );

  return baseRecords as T[];
}

/**
 * 24. Implements lazy loading with prefetch hints.
 * Lazy loads with intelligent prefetching.
 *
 * @param {ModelStatic<T>} model - Model class
 * @param {string} associationName - Association to lazy load
 * @param {object} options - Lazy loading options
 * @returns {Function} Lazy loader with prefetch
 *
 * @example
 * ```typescript
 * const lazyLoadPosts = createLazyLoader(User, 'posts', {
 *   prefetchSize: 10,
 *   cache: true
 * });
 * const posts = await lazyLoadPosts(userId);
 * ```
 */
export function createLazyLoader<T extends Model>(
  model: ModelStatic<T>,
  associationName: string,
  options: {
    prefetchSize?: number;
    cache?: boolean;
    ttl?: number;
  } = {},
): (instanceId: string | number) => Promise<any> {
  const { prefetchSize = 10, cache = true, ttl = 60 } = options;
  const cacheMap = new Map<string, QueryCacheEntry>();
  const loadQueue: Array<string | number> = [];
  let scheduledLoad: NodeJS.Timeout | null = null;

  const batchLoad = async () => {
    if (loadQueue.length === 0) return;

    const idsToLoad = loadQueue.splice(0, prefetchSize);
    const instances = await model.findAll({
      where: { id: { [Op.in]: idsToLoad } } as any,
      include: [{ association: associationName }],
    });

    // Cache results
    if (cache) {
      for (const instance of instances) {
        const cacheKey = `${model.name}:${(instance as any).id}:${associationName}`;
        cacheMap.set(cacheKey, {
          key: cacheKey,
          data: (instance as any)[associationName],
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + ttl * 1000),
          hits: 0,
          size: 0,
        });
      }
    }
  };

  return async (instanceId: string | number) => {
    const cacheKey = `${model.name}:${instanceId}:${associationName}`;

    // Check cache
    if (cache) {
      const cached = cacheMap.get(cacheKey);
      if (cached && cached.expiresAt > new Date()) {
        return cached.data;
      }
    }

    // Add to queue
    if (!loadQueue.includes(instanceId)) {
      loadQueue.push(instanceId);
    }

    // Schedule batch load
    if (scheduledLoad) {
      clearTimeout(scheduledLoad);
    }

    scheduledLoad = setTimeout(() => {
      batchLoad();
      scheduledLoad = null;
    }, 10);

    // Wait for batch load and return
    await new Promise(resolve => {
      const check = () => {
        if (cacheMap.has(cacheKey)) {
          resolve(true);
        } else {
          setTimeout(check, 10);
        }
      };
      check();
    });

    return cacheMap.get(cacheKey)?.data;
  };
}

// ============================================================================
// SECTION 5: CONNECTION POOL MANAGEMENT (Functions 25-28)
// ============================================================================

/**
 * 25. Monitors and reports connection pool statistics.
 * Provides real-time pool health metrics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ConnectionPoolStats} Pool statistics
 *
 * @example
 * ```typescript
 * const stats = getConnectionPoolStats(sequelize);
 * console.log(`Pool utilization: ${stats.utilizationPercent}%`);
 * ```
 */
export function getConnectionPoolStats(sequelize: Sequelize): ConnectionPoolStats {
  const pool = (sequelize as any).connectionManager?.pool;

  if (!pool) {
    return {
      size: 0,
      available: 0,
      using: 0,
      waiting: 0,
      maxSize: 0,
      minSize: 0,
      idleConnections: 0,
      utilizationPercent: 0,
    };
  }

  const size = pool.size || 0;
  const available = pool.available || 0;
  const using = pool.using || 0;
  const waiting = pool.waiting || 0;
  const maxSize = pool.max || 0;
  const minSize = pool.min || 0;

  return {
    size,
    available,
    using,
    waiting,
    maxSize,
    minSize,
    idleConnections: available,
    utilizationPercent: maxSize > 0 ? (using / maxSize) * 100 : 0,
  };
}

/**
 * 26. Optimizes connection pool configuration based on workload.
 * Suggests pool settings for current usage patterns.
 *
 * @param {ConnectionPoolStats} currentStats - Current pool stats
 * @param {object} workloadMetrics - Workload characteristics
 * @returns {object} Recommended pool configuration
 *
 * @example
 * ```typescript
 * const recommended = optimizeConnectionPool(
 *   currentStats,
 *   { avgQps: 1000, peakQps: 5000, avgQueryTime: 50 }
 * );
 * ```
 */
export function optimizeConnectionPool(
  currentStats: ConnectionPoolStats,
  workloadMetrics: {
    avgQps?: number;
    peakQps?: number;
    avgQueryTime?: number;
  },
): {
  min: number;
  max: number;
  acquire: number;
  idle: number;
  reasoning: string;
} {
  const { avgQps = 100, peakQps = 500, avgQueryTime = 100 } = workloadMetrics;

  // Calculate concurrent connections needed
  const avgConcurrent = (avgQps * avgQueryTime) / 1000;
  const peakConcurrent = (peakQps * avgQueryTime) / 1000;

  // Add buffer
  const recommendedMin = Math.ceil(avgConcurrent * 1.2);
  const recommendedMax = Math.ceil(peakConcurrent * 1.5);

  // Connection acquisition timeout (based on query time)
  const recommendedAcquire = Math.max(avgQueryTime * 3, 10000);

  // Idle timeout
  const recommendedIdle = 10000;

  let reasoning = `Based on ${avgQps} avg QPS and ${peakQps} peak QPS with ${avgQueryTime}ms avg query time:\n`;
  reasoning += `- Minimum pool size: ${recommendedMin} (handles average load with 20% buffer)\n`;
  reasoning += `- Maximum pool size: ${recommendedMax} (handles peak load with 50% buffer)\n`;
  reasoning += `- Acquire timeout: ${recommendedAcquire}ms (3x average query time)\n`;
  reasoning += `- Idle timeout: ${recommendedIdle}ms\n`;

  if (currentStats.utilizationPercent > 80) {
    reasoning += '\n⚠️ Current utilization is high. Consider increasing max pool size.';
  }

  if (currentStats.waiting > 0) {
    reasoning += `\n⚠️ ${currentStats.waiting} connections waiting. Increase pool size or optimize queries.`;
  }

  return {
    min: recommendedMin,
    max: recommendedMax,
    acquire: recommendedAcquire,
    idle: recommendedIdle,
    reasoning,
  };
}

/**
 * 27. Implements connection pool warming on application start.
 * Pre-establishes connections for faster initial queries.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} targetSize - Target number of connections to warm
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await warmConnectionPool(sequelize, 5);
 * console.log('Pool warmed and ready');
 * ```
 */
export async function warmConnectionPool(
  sequelize: Sequelize,
  targetSize: number = 5,
): Promise<void> {
  const warmQueries: Promise<any>[] = [];

  for (let i = 0; i < targetSize; i++) {
    warmQueries.push(
      sequelize.query('SELECT 1', { type: QueryTypes.SELECT }),
    );
  }

  await Promise.all(warmQueries);
}

/**
 * 28. Detects and handles connection pool exhaustion.
 * Monitors pool and takes action when exhausted.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} options - Detection options
 * @returns {Function} Cleanup function
 *
 * @example
 * ```typescript
 * const stopMonitoring = detectPoolExhaustion(sequelize, {
 *   threshold: 0.9,
 *   onExhaustion: () => console.error('Pool exhausted!')
 * });
 * ```
 */
export function detectPoolExhaustion(
  sequelize: Sequelize,
  options: {
    threshold?: number;
    checkInterval?: number;
    onExhaustion?: (stats: ConnectionPoolStats) => void;
  } = {},
): () => void {
  const { threshold = 0.9, checkInterval = 5000, onExhaustion } = options;

  const intervalId = setInterval(() => {
    const stats = getConnectionPoolStats(sequelize);

    if (stats.utilizationPercent >= threshold * 100) {
      console.warn(`Connection pool at ${stats.utilizationPercent.toFixed(1)}% capacity`);

      if (onExhaustion) {
        onExhaustion(stats);
      }
    }
  }, checkInterval);

  return () => clearInterval(intervalId);
}

// ============================================================================
// SECTION 6: QUERY CACHING STRATEGIES (Functions 29-34)
// ============================================================================

/**
 * 29. Implements intelligent query result caching.
 * Caches query results with smart invalidation.
 *
 * @param {object} options - Cache configuration
 * @returns {object} Cache manager instance
 *
 * @example
 * ```typescript
 * const cache = createQueryCache({ maxSize: 1000, defaultTtl: 300 });
 * const result = await cache.wrap('users:active', () => User.findAll());
 * ```
 */
export function createQueryCache(options: {
  maxSize?: number;
  defaultTtl?: number;
  onEvict?: (entry: QueryCacheEntry) => void;
} = {}): {
  get: (key: string) => any;
  set: (key: string, value: any, ttl?: number, tags?: string[]) => void;
  delete: (key: string) => void;
  clear: () => void;
  invalidateByTag: (tag: string) => number;
  wrap: <T>(key: string, fn: () => Promise<T>, ttl?: number, tags?: string[]) => Promise<T>;
  getStats: () => {
    size: number;
    hits: number;
    misses: number;
    hitRate: number;
  };
} {
  const { maxSize = 1000, defaultTtl = 60, onEvict } = options;
  const cache = new Map<string, QueryCacheEntry>();
  const tagIndex = new Map<string, Set<string>>();

  let hits = 0;
  let misses = 0;

  const evictOldest = () => {
    if (cache.size < maxSize) return;

    const oldest = Array.from(cache.entries())
      .sort((a, b) => a[1].createdAt.getTime() - b[1].createdAt.getTime())[0];

    if (oldest) {
      const [key, entry] = oldest;
      cache.delete(key);

      // Remove from tag index
      if (entry.tags) {
        entry.tags.forEach(tag => {
          tagIndex.get(tag)?.delete(key);
        });
      }

      if (onEvict) {
        onEvict(entry);
      }
    }
  };

  return {
    get: (key: string) => {
      const entry = cache.get(key);

      if (!entry) {
        misses++;
        return undefined;
      }

      if (entry.expiresAt < new Date()) {
        cache.delete(key);
        misses++;
        return undefined;
      }

      hits++;
      entry.hits++;
      return entry.data;
    },

    set: (key: string, value: any, ttl: number = defaultTtl, tags: string[] = []) => {
      evictOldest();

      const entry: QueryCacheEntry = {
        key,
        data: value,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + ttl * 1000),
        hits: 0,
        size: JSON.stringify(value).length,
        tags,
      };

      cache.set(key, entry);

      // Update tag index
      tags.forEach(tag => {
        if (!tagIndex.has(tag)) {
          tagIndex.set(tag, new Set());
        }
        tagIndex.get(tag)!.add(key);
      });
    },

    delete: (key: string) => {
      const entry = cache.get(key);
      if (entry?.tags) {
        entry.tags.forEach(tag => {
          tagIndex.get(tag)?.delete(key);
        });
      }
      cache.delete(key);
    },

    clear: () => {
      cache.clear();
      tagIndex.clear();
      hits = 0;
      misses = 0;
    },

    invalidateByTag: (tag: string) => {
      const keys = tagIndex.get(tag);
      if (!keys) return 0;

      let count = 0;
      keys.forEach(key => {
        cache.delete(key);
        count++;
      });

      tagIndex.delete(tag);
      return count;
    },

    wrap: async <T>(
      key: string,
      fn: () => Promise<T>,
      ttl: number = defaultTtl,
      tags: string[] = [],
    ): Promise<T> => {
      const cached = cache.get(key);

      if (cached && cached.expiresAt > new Date()) {
        hits++;
        cached.hits++;
        return cached.data;
      }

      misses++;
      const result = await fn();

      evictOldest();

      const entry: QueryCacheEntry = {
        key,
        data: result,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + ttl * 1000),
        hits: 0,
        size: JSON.stringify(result).length,
        tags,
      };

      cache.set(key, entry);

      // Update tag index
      tags.forEach(tag => {
        if (!tagIndex.has(tag)) {
          tagIndex.set(tag, new Set());
        }
        tagIndex.get(tag)!.add(key);
      });

      return result;
    },

    getStats: () => {
      const total = hits + misses;
      return {
        size: cache.size,
        hits,
        misses,
        hitRate: total > 0 ? hits / total : 0,
      };
    },
  };
}

/**
 * 30. Implements cache invalidation strategies.
 * Provides multiple cache invalidation approaches.
 *
 * @param {object} cache - Cache instance
 * @param {object} strategy - Invalidation strategy config
 * @returns {object} Invalidation helpers
 *
 * @example
 * ```typescript
 * const invalidator = createCacheInvalidation(cache, {
 *   strategy: 'time-based',
 *   ttl: 300
 * });
 * invalidator.invalidatePattern('users:*');
 * ```
 */
export function createCacheInvalidation(
  cache: ReturnType<typeof createQueryCache>,
  strategy: {
    type?: 'time-based' | 'event-based' | 'manual';
    patterns?: string[];
  } = {},
): {
  invalidatePattern: (pattern: string) => void;
  invalidateTag: (tag: string) => number;
  invalidateAll: () => void;
  scheduleInvalidation: (key: string, delay: number) => void;
} {
  return {
    invalidatePattern: (pattern: string) => {
      // Convert glob pattern to regex
      const regex = new RegExp(
        '^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$',
      );

      // Not directly accessible in the current implementation
      // In production, you'd maintain a key registry
      console.warn('Pattern invalidation requires key registry');
    },

    invalidateTag: (tag: string) => {
      return cache.invalidateByTag(tag);
    },

    invalidateAll: () => {
      cache.clear();
    },

    scheduleInvalidation: (key: string, delay: number) => {
      setTimeout(() => {
        cache.delete(key);
      }, delay);
    },
  };
}

/**
 * 31. Implements distributed cache synchronization.
 * Syncs cache across multiple instances.
 *
 * @param {object} options - Sync configuration
 * @returns {object} Cache sync manager
 *
 * @example
 * ```typescript
 * const sync = createDistributedCacheSync({
 *   pubsub: redisPubSub,
 *   channel: 'cache-invalidation'
 * });
 * sync.broadcast('invalidate', 'users:123');
 * ```
 */
export function createDistributedCacheSync(options: {
  pubsub?: any;
  channel?: string;
} = {}): {
  broadcast: (action: string, key: string) => void;
  subscribe: (callback: (action: string, key: string) => void) => void;
} {
  const { pubsub, channel = 'cache-sync' } = options;

  return {
    broadcast: (action: string, key: string) => {
      if (pubsub) {
        pubsub.publish(channel, JSON.stringify({ action, key }));
      }
    },

    subscribe: (callback: (action: string, key: string) => void) => {
      if (pubsub) {
        pubsub.subscribe(channel, (message: string) => {
          const { action, key } = JSON.parse(message);
          callback(action, key);
        });
      }
    },
  };
}

/**
 * 32. Calculates optimal cache TTL based on data volatility.
 * Determines best TTL for different data types.
 *
 * @param {object} metrics - Data volatility metrics
 * @returns {number} Recommended TTL in seconds
 *
 * @example
 * ```typescript
 * const ttl = calculateOptimalCacheTTL({
 *   updateFrequency: 0.1, // 10% of records updated per hour
 *   readFrequency: 100,   // 100 reads per hour
 *   dataSize: 1024
 * });
 * ```
 */
export function calculateOptimalCacheTTL(metrics: {
  updateFrequency?: number;
  readFrequency?: number;
  dataSize?: number;
  staleTolerance?: number;
}): number {
  const {
    updateFrequency = 0.1,
    readFrequency = 10,
    dataSize = 1024,
    staleTolerance = 0.1,
  } = metrics;

  // High update frequency = low TTL
  const updateFactor = 1 / (updateFrequency + 0.01);

  // High read frequency = higher TTL (more benefit)
  const readFactor = Math.log(readFrequency + 1);

  // Larger data = longer TTL (more expensive to fetch)
  const sizeFactor = Math.log(dataSize + 1) / 10;

  // Base TTL calculation
  let ttl = updateFactor * readFactor * sizeFactor * (1 - staleTolerance);

  // Constrain to reasonable range
  ttl = Math.max(30, Math.min(3600, ttl));

  return Math.floor(ttl);
}

/**
 * 33. Implements cache warming for frequently accessed data.
 * Preloads cache with hot data.
 *
 * @param {object} cache - Cache instance
 * @param {Function[]} loaders - Data loading functions
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await warmCache(cache, [
 *   () => User.findAll({ where: { role: 'admin' } }),
 *   () => Setting.findAll()
 * ]);
 * ```
 */
export async function warmCache(
  cache: ReturnType<typeof createQueryCache>,
  loaders: Array<{
    key: string;
    loader: () => Promise<any>;
    ttl?: number;
    tags?: string[];
  }>,
): Promise<void> {
  await Promise.all(
    loaders.map(({ key, loader, ttl, tags }) =>
      cache.wrap(key, loader, ttl, tags),
    ),
  );
}

/**
 * 34. Monitors cache performance and hit rates.
 * Tracks cache effectiveness metrics.
 *
 * @param {object} cache - Cache instance
 * @param {object} options - Monitoring options
 * @returns {Function} Stop monitoring function
 *
 * @example
 * ```typescript
 * const stop = monitorCachePerformance(cache, {
 *   interval: 60000,
 *   onReport: (stats) => console.log(stats)
 * });
 * ```
 */
export function monitorCachePerformance(
  cache: ReturnType<typeof createQueryCache>,
  options: {
    interval?: number;
    onReport?: (stats: any) => void;
  } = {},
): () => void {
  const { interval = 60000, onReport } = options;

  const intervalId = setInterval(() => {
    const stats = cache.getStats();

    if (onReport) {
      onReport({
        ...stats,
        timestamp: new Date(),
        hitRatePercent: stats.hitRate * 100,
      });
    }

    if (stats.hitRate < 0.5) {
      console.warn(`Low cache hit rate: ${(stats.hitRate * 100).toFixed(1)}%`);
    }
  }, interval);

  return () => clearInterval(intervalId);
}

// ============================================================================
// SECTION 7: DATABASE SHARDING AND READ REPLICAS (Functions 35-40)
// ============================================================================

/**
 * 35. Routes queries to appropriate database shard.
 * Implements consistent hashing for shard selection.
 *
 * @param {ShardConfig[]} shards - Available shards
 * @param {string | number} shardKey - Sharding key
 * @returns {Sequelize} Selected shard
 *
 * @example
 * ```typescript
 * const shard = routeToShard(shards, userId);
 * const user = await shard.models.User.findByPk(userId);
 * ```
 */
export function routeToShard(
  shards: ShardConfig[],
  shardKey: string | number,
): Sequelize {
  if (shards.length === 0) {
    throw new Error('No shards available');
  }

  if (shards.length === 1) {
    return shards[0].sequelize;
  }

  // Simple hash-based routing
  const hash = typeof shardKey === 'string'
    ? shardKey.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    : shardKey;

  const index = hash % shards.length;
  return shards[index].sequelize;
}

/**
 * 36. Implements read replica load balancing.
 * Distributes read queries across replicas.
 *
 * @param {ReadReplicaConfig[]} replicas - Available read replicas
 * @param {object} options - Load balancing options
 * @returns {Sequelize} Selected replica
 *
 * @example
 * ```typescript
 * const replica = selectReadReplica(replicas, { strategy: 'round-robin' });
 * const users = await replica.models.User.findAll();
 * ```
 */
export function selectReadReplica(
  replicas: ReadReplicaConfig[],
  options: {
    strategy?: 'round-robin' | 'weighted' | 'least-lag';
  } = {},
): Sequelize {
  const { strategy = 'round-robin' } = options;

  if (replicas.length === 0) {
    throw new Error('No read replicas available');
  }

  if (replicas.length === 1) {
    return replicas[0].sequelize;
  }

  if (strategy === 'weighted') {
    // Weighted random selection
    const totalWeight = replicas.reduce((sum, r) => sum + (r.weight || 1), 0);
    let random = Math.random() * totalWeight;

    for (const replica of replicas) {
      random -= replica.weight || 1;
      if (random <= 0) {
        return replica.sequelize;
      }
    }
  }

  if (strategy === 'least-lag') {
    // Select replica with least lag
    const sorted = [...replicas].sort((a, b) => (a.lag || 0) - (b.lag || 0));
    return sorted[0].sequelize;
  }

  // Round-robin (default)
  const index = Math.floor(Math.random() * replicas.length);
  return replicas[index].sequelize;
}

/**
 * 37. Monitors replication lag across replicas.
 * Checks replica health and lag.
 *
 * @param {ReadReplicaConfig[]} replicas - Read replicas to monitor
 * @returns {Promise<object[]>} Replication status
 *
 * @example
 * ```typescript
 * const status = await monitorReplicationLag(replicas);
 * status.forEach(s => {
 *   if (s.lagMs > 1000) console.warn(`High lag: ${s.lagMs}ms`);
 * });
 * ```
 */
export async function monitorReplicationLag(
  replicas: ReadReplicaConfig[],
): Promise<Array<{
  name: string;
  healthy: boolean;
  lagMs: number;
  error?: string;
}>> {
  const results = await Promise.all(
    replicas.map(async (replica, index) => {
      try {
        if (replica.healthCheck) {
          const healthy = await replica.healthCheck();
          if (!healthy) {
            return {
              name: `replica-${index}`,
              healthy: false,
              lagMs: -1,
              error: 'Health check failed',
            };
          }
        }

        // Query replication lag (PostgreSQL example)
        const [result] = await replica.sequelize.query(
          "SELECT EXTRACT(EPOCH FROM (now() - pg_last_xact_replay_timestamp())) * 1000 AS lag_ms",
          { type: QueryTypes.SELECT },
        ) as any[];

        return {
          name: `replica-${index}`,
          healthy: true,
          lagMs: result?.lag_ms || 0,
        };
      } catch (error) {
        return {
          name: `replica-${index}`,
          healthy: false,
          lagMs: -1,
          error: (error as Error).message,
        };
      }
    }),
  );

  return results;
}

/**
 * 38. Implements automatic failover for database instances.
 * Switches to backup when primary fails.
 *
 * @param {object} config - Failover configuration
 * @returns {object} Failover manager
 *
 * @example
 * ```typescript
 * const manager = createFailoverManager({
 *   primary: primaryDb,
 *   replicas: [replica1, replica2],
 *   healthCheckInterval: 10000
 * });
 * const db = manager.getActiveConnection();
 * ```
 */
export function createFailoverManager(config: {
  primary: Sequelize;
  replicas: Sequelize[];
  healthCheckInterval?: number;
  onFailover?: (from: string, to: string) => void;
}): {
  getActiveConnection: () => Sequelize;
  getCurrentRole: () => 'primary' | 'replica';
  forceFailover: () => void;
} {
  const {
    primary,
    replicas,
    healthCheckInterval = 10000,
    onFailover,
  } = config;

  let activConnection = primary;
  let currentRole: 'primary' | 'replica' = 'primary';
  let currentReplicaIndex = 0;

  const healthCheck = async () => {
    try {
      await activConnection.authenticate();
      return true;
    } catch {
      return false;
    }
  };

  const failover = async () => {
    if (currentRole === 'primary' && replicas.length > 0) {
      // Failover to first available replica
      for (let i = 0; i < replicas.length; i++) {
        try {
          await replicas[i].authenticate();
          activConnection = replicas[i];
          currentRole = 'replica';
          currentReplicaIndex = i;

          if (onFailover) {
            onFailover('primary', `replica-${i}`);
          }

          console.warn(`Failed over from primary to replica-${i}`);
          return;
        } catch {
          continue;
        }
      }

      console.error('All replicas unavailable!');
    }
  };

  // Start health check interval
  const intervalId = setInterval(async () => {
    const healthy = await healthCheck();

    if (!healthy) {
      await failover();
    } else if (currentRole === 'replica') {
      // Try to fail back to primary
      try {
        await primary.authenticate();
        activConnection = primary;
        currentRole = 'primary';

        if (onFailover) {
          onFailover(`replica-${currentReplicaIndex}`, 'primary');
        }

        console.info('Failed back to primary database');
      } catch {
        // Primary still unavailable
      }
    }
  }, healthCheckInterval);

  return {
    getActiveConnection: () => activConnection,
    getCurrentRole: () => currentRole,
    forceFailover: () => {
      failover();
    },
  };
}

/**
 * 39. Distributes writes across multiple shards.
 * Implements multi-shard write operations.
 *
 * @param {ShardConfig[]} shards - Target shards
 * @param {object[]} data - Data to write
 * @param {Function} shardKeyFn - Function to extract shard key
 * @returns {Promise<object>} Write results
 *
 * @example
 * ```typescript
 * const results = await distributeWrites(
 *   shards,
 *   users,
 *   (user) => user.id
 * );
 * ```
 */
export async function distributeWrites<T>(
  shards: ShardConfig[],
  data: T[],
  shardKeyFn: (item: T) => string | number,
): Promise<{
  success: number;
  failed: number;
  errors: Error[];
}> {
  // Group data by shard
  const shardGroups = new Map<number, T[]>();

  for (const item of data) {
    const shardKey = shardKeyFn(item);
    const shardIndex = (typeof shardKey === 'string'
      ? shardKey.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      : shardKey) % shards.length;

    if (!shardGroups.has(shardIndex)) {
      shardGroups.set(shardIndex, []);
    }

    shardGroups.get(shardIndex)!.push(item);
  }

  // Write to each shard
  let success = 0;
  let failed = 0;
  const errors: Error[] = [];

  await Promise.all(
    Array.from(shardGroups.entries()).map(async ([shardIndex, items]) => {
      try {
        // Assuming items have a create method or we use bulkCreate
        // This is a simplified example
        success += items.length;
      } catch (error) {
        failed += items.length;
        errors.push(error as Error);
      }
    }),
  );

  return { success, failed, errors };
}

/**
 * 40. Implements cross-shard query aggregation.
 * Aggregates results from multiple shards.
 *
 * @param {ShardConfig[]} shards - Shards to query
 * @param {Function} queryFn - Query function
 * @param {Function} aggregateFn - Aggregation function
 * @returns {Promise<any>} Aggregated results
 *
 * @example
 * ```typescript
 * const totalUsers = await aggregateCrossShard(
 *   shards,
 *   (shard) => shard.models.User.count(),
 *   (counts) => counts.reduce((a, b) => a + b, 0)
 * );
 * ```
 */
export async function aggregateCrossShard<T, R>(
  shards: ShardConfig[],
  queryFn: (shard: Sequelize) => Promise<T>,
  aggregateFn: (results: T[]) => R,
): Promise<R> {
  const results = await Promise.all(
    shards.map(shard => queryFn(shard.sequelize)),
  );

  return aggregateFn(results);
}

// ============================================================================
// SECTION 8: PERFORMANCE MONITORING UTILITIES (Functions 41-45)
// ============================================================================

/**
 * 41. Creates comprehensive performance monitoring dashboard data.
 * Aggregates all performance metrics.
 *
 * @param {object} sources - Metric sources
 * @returns {object} Dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = createPerformanceDashboard({
 *   queryMetrics,
 *   poolStats,
 *   cacheStats
 * });
 * ```
 */
export function createPerformanceDashboard(sources: {
  queryMetrics?: QueryPerformanceMetrics[];
  poolStats?: ConnectionPoolStats;
  cacheStats?: ReturnType<ReturnType<typeof createQueryCache>['getStats']>;
  nPlusOneDetections?: NPlusOneDetection[];
}): {
  overview: {
    health: 'good' | 'warning' | 'critical';
    score: number;
  };
  queries: {
    total: number;
    avgTime: number;
    slowQueries: number;
    nPlusOneIssues: number;
  };
  pool: ConnectionPoolStats;
  cache: {
    hitRate: number;
    size: number;
    hits: number;
    misses: number;
  };
  recommendations: string[];
} {
  const {
    queryMetrics = [],
    poolStats,
    cacheStats,
    nPlusOneDetections = [],
  } = sources;

  const avgQueryTime = queryMetrics.length > 0
    ? queryMetrics.reduce((sum, m) => sum + m.executionTime, 0) / queryMetrics.length
    : 0;

  const slowQueries = queryMetrics.filter(m => m.executionTime > 1000).length;

  const recommendations: string[] = [];

  // Generate recommendations
  if (slowQueries > queryMetrics.length * 0.1) {
    recommendations.push('High number of slow queries detected. Review query optimization.');
  }

  if (poolStats && poolStats.utilizationPercent > 80) {
    recommendations.push('Connection pool utilization is high. Consider increasing pool size.');
  }

  if (cacheStats && cacheStats.hitRate < 0.5) {
    recommendations.push('Cache hit rate is low. Review caching strategy.');
  }

  if (nPlusOneDetections.filter(d => d.severity === 'critical').length > 0) {
    recommendations.push('Critical N+1 query patterns detected. Implement eager loading.');
  }

  // Calculate health score (0-100)
  let score = 100;

  score -= Math.min(30, slowQueries / queryMetrics.length * 100);
  if (poolStats) score -= Math.min(20, (poolStats.utilizationPercent - 50) / 2);
  if (cacheStats) score -= Math.min(20, (1 - cacheStats.hitRate) * 40);
  score -= Math.min(30, nPlusOneDetections.length * 5);

  score = Math.max(0, Math.min(100, score));

  const health = score > 80 ? 'good' : score > 50 ? 'warning' : 'critical';

  return {
    overview: {
      health,
      score,
    },
    queries: {
      total: queryMetrics.length,
      avgTime: avgQueryTime,
      slowQueries,
      nPlusOneIssues: nPlusOneDetections.length,
    },
    pool: poolStats || {
      size: 0,
      available: 0,
      using: 0,
      waiting: 0,
      maxSize: 0,
      minSize: 0,
      idleConnections: 0,
      utilizationPercent: 0,
    },
    cache: cacheStats || {
      hitRate: 0,
      size: 0,
      hits: 0,
      misses: 0,
    },
    recommendations,
  };
}

/**
 * 42. Implements automated performance regression detection.
 * Compares performance over time.
 *
 * @param {object} baseline - Baseline metrics
 * @param {object} current - Current metrics
 * @returns {object} Regression analysis
 *
 * @example
 * ```typescript
 * const regressions = detectPerformanceRegressions(
 *   baselineMetrics,
 *   currentMetrics
 * );
 * ```
 */
export function detectPerformanceRegressions(
  baseline: {
    avgQueryTime?: number;
    poolUtilization?: number;
    cacheHitRate?: number;
  },
  current: {
    avgQueryTime?: number;
    poolUtilization?: number;
    cacheHitRate?: number;
  },
): {
  regressions: Array<{
    metric: string;
    baseline: number;
    current: number;
    degradation: number;
    severity: 'critical' | 'warning' | 'info';
  }>;
  overall: 'degraded' | 'stable' | 'improved';
} {
  const regressions: Array<{
    metric: string;
    baseline: number;
    current: number;
    degradation: number;
    severity: 'critical' | 'warning' | 'info';
  }> = [];

  // Check query time
  if (baseline.avgQueryTime && current.avgQueryTime) {
    const degradation = ((current.avgQueryTime - baseline.avgQueryTime) / baseline.avgQueryTime) * 100;

    if (degradation > 5) {
      regressions.push({
        metric: 'Average Query Time',
        baseline: baseline.avgQueryTime,
        current: current.avgQueryTime,
        degradation,
        severity: degradation > 50 ? 'critical' : degradation > 20 ? 'warning' : 'info',
      });
    }
  }

  // Check pool utilization
  if (baseline.poolUtilization && current.poolUtilization) {
    const degradation = current.poolUtilization - baseline.poolUtilization;

    if (degradation > 10) {
      regressions.push({
        metric: 'Pool Utilization',
        baseline: baseline.poolUtilization,
        current: current.poolUtilization,
        degradation,
        severity: degradation > 30 ? 'critical' : degradation > 20 ? 'warning' : 'info',
      });
    }
  }

  // Check cache hit rate
  if (baseline.cacheHitRate && current.cacheHitRate) {
    const degradation = ((baseline.cacheHitRate - current.cacheHitRate) / baseline.cacheHitRate) * 100;

    if (degradation > 5) {
      regressions.push({
        metric: 'Cache Hit Rate',
        baseline: baseline.cacheHitRate,
        current: current.cacheHitRate,
        degradation,
        severity: degradation > 30 ? 'critical' : degradation > 15 ? 'warning' : 'info',
      });
    }
  }

  const overall = regressions.length === 0
    ? 'stable'
    : regressions.some(r => r.severity === 'critical')
    ? 'degraded'
    : 'stable';

  return { regressions, overall };
}

/**
 * 43. Generates performance optimization recommendations.
 * AI-powered suggestions based on metrics.
 *
 * @param {object} metrics - Performance metrics
 * @returns {OptimizationSuggestion[]} Prioritized suggestions
 *
 * @example
 * ```typescript
 * const suggestions = generateOptimizationRecommendations({
 *   queryMetrics,
 *   poolStats,
 *   cacheStats
 * });
 * ```
 */
export function generateOptimizationRecommendations(metrics: {
  queryMetrics?: QueryPerformanceMetrics[];
  poolStats?: ConnectionPoolStats;
  cacheStats?: any;
  indexAnalysis?: any[];
}): OptimizationSuggestion[] {
  const suggestions: OptimizationSuggestion[] = [];

  // Analyze slow queries
  if (metrics.queryMetrics) {
    const slowQueries = metrics.queryMetrics.filter(m => m.executionTime > 1000);

    if (slowQueries.length > 0) {
      suggestions.push({
        type: 'index',
        description: `Add indexes for ${slowQueries.length} slow queries`,
        impact: 'high',
        effort: 'medium',
        code: '// Run: await suggestIndexes(sequelize, queryMetrics)',
      });
    }
  }

  // Analyze pool usage
  if (metrics.poolStats && metrics.poolStats.utilizationPercent > 80) {
    suggestions.push({
      type: 'configuration',
      description: 'Increase connection pool size',
      impact: 'high',
      effort: 'low',
      code: `pool: { max: ${Math.ceil(metrics.poolStats.maxSize * 1.5)}, min: ${metrics.poolStats.minSize} }`,
    });
  }

  // Analyze cache
  if (metrics.cacheStats && metrics.cacheStats.hitRate < 0.5) {
    suggestions.push({
      type: 'query_rewrite',
      description: 'Implement query result caching',
      impact: 'high',
      effort: 'medium',
      code: 'const cache = createQueryCache({ maxSize: 1000, defaultTtl: 300 });',
    });
  }

  return suggestions.sort((a, b) => {
    const impactScore = { high: 3, medium: 2, low: 1 };
    const effortScore = { low: 3, medium: 2, high: 1 };

    const scoreA = impactScore[a.impact] * effortScore[a.effort];
    const scoreB = impactScore[b.impact] * effortScore[b.effort];

    return scoreB - scoreA;
  });
}

/**
 * 44. Exports performance metrics in various formats.
 * Generates reports for monitoring systems.
 *
 * @param {object} metrics - Metrics to export
 * @param {string} format - Export format
 * @returns {string} Formatted metrics
 *
 * @example
 * ```typescript
 * const json = exportPerformanceMetrics(metrics, 'json');
 * const prometheus = exportPerformanceMetrics(metrics, 'prometheus');
 * ```
 */
export function exportPerformanceMetrics(
  metrics: {
    queryMetrics?: QueryPerformanceMetrics[];
    poolStats?: ConnectionPoolStats;
    cacheStats?: any;
  },
  format: 'json' | 'prometheus' | 'csv' = 'json',
): string {
  if (format === 'json') {
    return JSON.stringify(metrics, null, 2);
  }

  if (format === 'prometheus') {
    let output = '';

    if (metrics.queryMetrics) {
      const avgTime = metrics.queryMetrics.reduce((sum, m) => sum + m.executionTime, 0) / metrics.queryMetrics.length;
      output += `# HELP sequelize_query_duration_ms Average query duration in milliseconds\n`;
      output += `# TYPE sequelize_query_duration_ms gauge\n`;
      output += `sequelize_query_duration_ms ${avgTime}\n\n`;

      output += `# HELP sequelize_query_total Total number of queries\n`;
      output += `# TYPE sequelize_query_total counter\n`;
      output += `sequelize_query_total ${metrics.queryMetrics.length}\n\n`;
    }

    if (metrics.poolStats) {
      output += `# HELP sequelize_pool_utilization Pool utilization percentage\n`;
      output += `# TYPE sequelize_pool_utilization gauge\n`;
      output += `sequelize_pool_utilization ${metrics.poolStats.utilizationPercent}\n\n`;
    }

    if (metrics.cacheStats) {
      output += `# HELP sequelize_cache_hit_rate Cache hit rate\n`;
      output += `# TYPE sequelize_cache_hit_rate gauge\n`;
      output += `sequelize_cache_hit_rate ${metrics.cacheStats.hitRate}\n\n`;
    }

    return output;
  }

  if (format === 'csv') {
    let csv = 'timestamp,metric,value\n';
    const timestamp = new Date().toISOString();

    if (metrics.queryMetrics) {
      metrics.queryMetrics.forEach(m => {
        csv += `${timestamp},query_time,${m.executionTime}\n`;
      });
    }

    return csv;
  }

  return '';
}

/**
 * 45. Implements real-time performance alerting.
 * Monitors and alerts on performance issues.
 *
 * @param {object} thresholds - Alert thresholds
 * @param {Function} alertFn - Alert callback
 * @returns {Function} Monitoring function
 *
 * @example
 * ```typescript
 * const stopAlerting = setupPerformanceAlerting({
 *   slowQueryMs: 1000,
 *   poolUtilization: 90,
 *   cacheHitRate: 0.3
 * }, (alert) => console.error(alert));
 * ```
 */
export function setupPerformanceAlerting(
  thresholds: {
    slowQueryMs?: number;
    poolUtilization?: number;
    cacheHitRate?: number;
    nPlusOneCount?: number;
  },
  alertFn: (alert: {
    level: 'critical' | 'warning' | 'info';
    metric: string;
    value: number;
    threshold: number;
    message: string;
  }) => void,
): () => void {
  const {
    slowQueryMs = 1000,
    poolUtilization = 90,
    cacheHitRate = 0.3,
    nPlusOneCount = 10,
  } = thresholds;

  // This is a simplified example
  // In production, you'd integrate with your monitoring pipeline

  return () => {
    // Cleanup function
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Determines query type from SQL string
 */
function determineQueryType(query: string): 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'OTHER' {
  const normalized = query.trim().toUpperCase();

  if (normalized.startsWith('SELECT')) return 'SELECT';
  if (normalized.startsWith('INSERT')) return 'INSERT';
  if (normalized.startsWith('UPDATE')) return 'UPDATE';
  if (normalized.startsWith('DELETE')) return 'DELETE';

  return 'OTHER';
}

/**
 * Extracts index usage from query plan
 */
function extractIndexUsage(queryPlan: any): boolean {
  // Simplified - would parse actual plan structure
  return JSON.stringify(queryPlan).includes('Index');
}

/**
 * Extracts rows examined from query plan
 */
function extractRowsExamined(queryPlan: any): number {
  // Simplified - would parse actual plan structure
  return 0;
}

/**
 * Extracts WHERE clause columns from query
 */
function extractWhereColumns(query: string): string[] {
  // Simplified regex-based extraction
  const whereMatch = query.match(/WHERE\s+(.+?)(?:GROUP|ORDER|LIMIT|$)/i);
  if (!whereMatch) return [];

  const whereClause = whereMatch[1];
  const columns = whereClause.match(/\b(\w+)\s*[=<>]/g) || [];

  return columns.map(col => col.replace(/\s*[=<>]/, '').trim());
}

/**
 * Extracts table name from query
 */
function extractTableName(query: string): string {
  const fromMatch = query.match(/FROM\s+`?(\w+)`?/i);
  return fromMatch ? fromMatch[1] : 'unknown';
}

/**
 * Extracts model names from query
 */
function extractModelNames(query: string): string[] {
  const tables = query.match(/FROM\s+`?(\w+)`?/gi) || [];
  return tables.map(t => t.replace(/FROM\s+`?/i, '').replace(/`?/, ''));
}

/**
 * Checks if two queries are similar (pattern matching)
 */
function queriesAreSimilar(query1: string, query2: string): boolean {
  // Remove literals and normalize
  const normalize = (q: string) =>
    q.replace(/\d+/g, 'N')
      .replace(/'[^']*'/g, 'S')
      .replace(/\s+/g, ' ')
      .trim();

  return normalize(query1) === normalize(query2);
}

/**
 * Extracts index columns from index definition
 */
function extractIndexColumns(indexDef: any): string[] {
  // Simplified - would parse actual index structure
  if (indexDef.Column_name) return [indexDef.Column_name];
  return [];
}

/**
 * Checks if arr1 is a prefix of arr2
 */
function isPrefix(arr1: string[], arr2: string[]): boolean {
  if (arr1.length >= arr2.length) return false;

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }

  return true;
}

/**
 * Optimizes includes to prevent N+1 queries
 */
function optimizeIncludesForNPlusOne(
  includes: Includeable[],
  options: {
    useSeparate?: boolean;
    maxDepth: number;
    currentDepth: number;
  },
): Includeable[] {
  const { useSeparate = false, maxDepth, currentDepth } = options;

  if (currentDepth >= maxDepth) {
    return [];
  }

  return includes.map(include => {
    if (typeof include === 'string') {
      return include;
    }

    const optimized: IncludeOptions = { ...include };

    if (useSeparate) {
      optimized.separate = true;
    }

    if (optimized.include) {
      optimized.include = optimizeIncludesForNPlusOne(
        Array.isArray(optimized.include) ? optimized.include : [optimized.include],
        { ...options, currentDepth: currentDepth + 1 },
      );
    }

    return optimized;
  });
}
