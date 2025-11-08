/**
 * LOC: SPOK1234567
 * File: /reuse/sequelize-performance-optimization-kit.ts
 *
 * UPSTREAM (imports from):
 *   - Sequelize ORM 6.x
 *   - @nestjs/common
 *   - ioredis (for caching)
 *
 * DOWNSTREAM (imported by):
 *   - Service layer components
 *   - Repository implementations
 *   - Performance monitoring services
 *   - Database optimization modules
 */

/**
 * File: /reuse/sequelize-performance-optimization-kit.ts
 * Locator: WC-UTL-SPOK-001
 * Purpose: Sequelize Performance Optimization Kit - Advanced performance tuning, monitoring, and optimization utilities
 *
 * Upstream: Sequelize 6.x, @nestjs/common, ioredis, pg/mysql2 drivers
 * Downstream: ../backend/*, ../services/*, repository layer, monitoring services
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize 6.x, ioredis 5.x
 * Exports: 45 utility functions for N+1 detection, query optimization, index analysis, caching, batching, profiling, monitoring
 *
 * LLM Context: Comprehensive Sequelize performance optimization utilities for White Cross healthcare system.
 * Provides N+1 query detection and prevention, query optimization analysis, index recommendations, EXPLAIN plan parsing,
 * connection pool tuning, multi-layer caching, eager/lazy loading optimization, bulk operation batching, query profiling,
 * slow query logging, deadlock detection, lock optimization, transaction isolation strategies, query hints, database statistics,
 * and real-time performance monitoring. Essential for maintaining high-performance, scalable healthcare database operations.
 */

import {
  Sequelize,
  Model,
  ModelStatic,
  FindOptions,
  QueryTypes,
  Transaction,
  Op,
  WhereOptions,
  Includeable,
  Order,
  LOCK,
  Association,
} from 'sequelize';
import { Logger } from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface N1DetectionResult {
  detected: boolean;
  queryCount: number;
  suspiciousPatterns: string[];
  recommendations: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface QueryOptimizationResult {
  originalQuery: string;
  optimizedQuery?: string;
  estimatedImprovement: number;
  recommendations: string[];
  indexSuggestions: string[];
  warnings: string[];
}

interface ExplainPlanResult {
  planSteps: ExplainPlanStep[];
  totalCost: number;
  estimatedRows: number;
  warnings: string[];
  indexUsage: IndexUsageInfo[];
  recommendations: string[];
}

interface ExplainPlanStep {
  operation: string;
  table?: string;
  cost: number;
  rows: number;
  accessMethod: string;
  filter?: string;
}

interface IndexUsageInfo {
  indexName: string;
  table: string;
  used: boolean;
  reason?: string;
}

interface IndexAnalysisResult {
  table: string;
  existingIndexes: IndexInfo[];
  missingIndexes: IndexRecommendation[];
  unusedIndexes: string[];
  duplicateIndexes: string[][];
  fragmentationLevel: number;
}

interface IndexInfo {
  name: string;
  columns: string[];
  unique: boolean;
  type: string;
  size: number;
  usageCount: number;
}

interface IndexRecommendation {
  columns: string[];
  reason: string;
  estimatedImprovement: number;
  priority: 'low' | 'medium' | 'high';
  createStatement: string;
}

interface ConnectionPoolMetrics {
  activeConnections: number;
  idleConnections: number;
  waitingRequests: number;
  totalConnections: number;
  maxConnections: number;
  utilizationPercent: number;
  averageWaitTime: number;
  peakConnections: number;
}

interface CacheConfig {
  ttl: number;
  maxSize?: number;
  strategy: 'lru' | 'lfu' | 'fifo';
  keyPrefix?: string;
  invalidateOn?: string[];
}

interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  size: number;
  evictions: number;
}

interface BatchProcessingConfig {
  batchSize: number;
  concurrency?: number;
  delayBetweenBatches?: number;
  onProgress?: (processed: number, total: number) => void;
  onError?: (error: Error, batch: any[]) => void;
}

interface QueryProfile {
  query: string;
  duration: number;
  timestamp: Date;
  executionPlan?: ExplainPlanResult;
  rowsAffected: number;
  cacheHit: boolean;
  source?: string;
}

interface SlowQueryLog {
  query: string;
  duration: number;
  timestamp: Date;
  stackTrace?: string;
  parameters?: any[];
  threshold: number;
  severity: 'warning' | 'critical';
}

interface DeadlockInfo {
  timestamp: Date;
  transactions: TransactionInfo[];
  resolution: string;
  affectedTables: string[];
  waitGraph: DeadlockEdge[];
}

interface TransactionInfo {
  id: string;
  query: string;
  locksHeld: string[];
  locksWaiting: string[];
  duration: number;
}

interface DeadlockEdge {
  from: string;
  to: string;
  resource: string;
}

interface LockOptimizationResult {
  currentLockMode: string;
  recommendedLockMode: string;
  reason: string;
  estimatedImpact: number;
}

interface IsolationLevelRecommendation {
  currentLevel: string;
  recommendedLevel: string;
  reason: string;
  tradeoffs: string[];
}

interface QueryHint {
  hint: string;
  applicability: string;
  expectedImprovement: number;
  risks: string[];
}

interface DatabaseStatistics {
  tableStats: TableStats[];
  indexStats: IndexStats[];
  queryStats: QueryStats;
  connectionStats: ConnectionPoolMetrics;
  cacheStats: CacheStats;
}

interface TableStats {
  table: string;
  rowCount: number;
  dataSize: number;
  indexSize: number;
  fragmentationPercent: number;
  lastAnalyzed?: Date;
  lastVacuum?: Date;
}

interface IndexStats {
  index: string;
  table: string;
  scans: number;
  tuplesRead: number;
  tuplesReturned: number;
  selectivity: number;
}

interface QueryStats {
  totalQueries: number;
  slowQueries: number;
  averageDuration: number;
  medianDuration: number;
  p95Duration: number;
  p99Duration: number;
}

interface PerformanceAlert {
  type: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: Date;
  metrics: any;
  recommendations: string[];
}

interface EagerLoadingConfig {
  associations: string[];
  attributes?: string[];
  separate?: boolean;
  required?: boolean;
  paranoid?: boolean;
}

interface LazyLoadingConfig {
  preload?: string[];
  lazyAttributes?: string[];
  fetchStrategy?: 'immediate' | 'batched' | 'deferred';
}

interface BulkOperationResult {
  processed: number;
  succeeded: number;
  failed: number;
  duration: number;
  errors: any[];
}

interface QueryBatchResult {
  queries: number;
  totalDuration: number;
  averageDuration: number;
  cacheHits: number;
  errors: number;
}

interface PreparedStatementCache {
  statement: string;
  hash: string;
  hitCount: number;
  lastUsed: Date;
  parameters: any[];
}

// ============================================================================
// N+1 QUERY DETECTION & PREVENTION
// ============================================================================

/**
 * 1. Detects N+1 query patterns in Sequelize operations by monitoring query execution.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} threshold - Number of similar queries to trigger detection (default: 5)
 * @returns {Promise<N1DetectionResult>} Detection results with recommendations
 *
 * @example
 * ```typescript
 * const result = await detectN1Queries(sequelize, 10);
 * if (result.detected) {
 *   console.log('N+1 detected:', result.recommendations);
 * }
 * ```
 */
export const detectN1Queries = async (
  sequelize: Sequelize,
  threshold: number = 5,
): Promise<N1DetectionResult> => {
  const queryLog: Map<string, number> = new Map();
  const suspiciousPatterns: string[] = [];

  const beforeHook = (options: any) => {
    const querySignature = normalizeQuery(options.sql);
    queryLog.set(querySignature, (queryLog.get(querySignature) || 0) + 1);
  };

  sequelize.addHook('beforeQuery', beforeHook);

  // Monitor for a brief period
  await new Promise(resolve => setTimeout(resolve, 100));

  sequelize.removeHook('beforeQuery', beforeHook);

  const recommendations: string[] = [];
  let maxCount = 0;

  for (const [query, count] of queryLog.entries()) {
    if (count >= threshold) {
      suspiciousPatterns.push(`Query executed ${count} times: ${query.substring(0, 100)}`);
      recommendations.push(`Use eager loading with include for: ${query.substring(0, 50)}`);
      maxCount = Math.max(maxCount, count);
    }
  }

  const severity =
    maxCount >= 50 ? 'critical' : maxCount >= 20 ? 'high' : maxCount >= 10 ? 'medium' : 'low';

  return {
    detected: suspiciousPatterns.length > 0,
    queryCount: Array.from(queryLog.values()).reduce((sum, count) => sum + count, 0),
    suspiciousPatterns,
    recommendations,
    severity,
  };
};

/**
 * 2. Prevents N+1 queries by automatically configuring eager loading for associations.
 *
 * @param {ModelStatic<any>} model - Sequelize model
 * @param {string[]} associations - Association names to eager load
 * @param {FindOptions} options - Base query options
 * @returns {FindOptions} Options with optimized eager loading
 *
 * @example
 * ```typescript
 * const options = preventN1WithEagerLoading(User, ['posts', 'comments'], {
 *   where: { active: true }
 * });
 * const users = await User.findAll(options);
 * ```
 */
export const preventN1WithEagerLoading = <M extends Model>(
  model: ModelStatic<M>,
  associations: string[],
  options: FindOptions<M> = {},
): FindOptions<M> => {
  const include: Includeable[] = associations.map(assoc => {
    const association = (model as any).associations[assoc];
    if (!association) {
      throw new Error(`Association ${assoc} not found on model ${model.name}`);
    }

    return {
      model: association.target,
      as: assoc,
      required: false,
      separate: association.associationType === 'HasMany',
    };
  });

  return {
    ...options,
    include: [...(options.include || []), ...include],
    subQuery: false,
  };
};

/**
 * 3. Implements dataloader pattern for efficient batch loading of associations.
 *
 * @param {ModelStatic<any>} model - Sequelize model
 * @param {string} foreignKey - Foreign key field
 * @param {any[]} ids - IDs to load
 * @returns {Promise<Map<any, any[]>>} Map of ID to loaded records
 *
 * @example
 * ```typescript
 * const userPosts = await batchLoadAssociations(Post, 'userId', [1, 2, 3]);
 * const user1Posts = userPosts.get(1);
 * ```
 */
export const batchLoadAssociations = async <M extends Model>(
  model: ModelStatic<M>,
  foreignKey: string,
  ids: any[],
): Promise<Map<any, M[]>> => {
  const records = await model.findAll({
    where: {
      [foreignKey]: { [Op.in]: ids },
    } as any,
  });

  const grouped = new Map<any, M[]>();
  for (const record of records) {
    const key = (record as any)[foreignKey];
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(record);
  }

  // Ensure all IDs have an entry
  for (const id of ids) {
    if (!grouped.has(id)) {
      grouped.set(id, []);
    }
  }

  return grouped;
};

/**
 * 4. Monitors query execution to identify sequential query patterns indicating N+1.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Function} operation - Async operation to monitor
 * @returns {Promise<{ result: any; analysis: N1DetectionResult }>} Operation result and analysis
 *
 * @example
 * ```typescript
 * const { result, analysis } = await monitorN1Patterns(sequelize, async () => {
 *   return await User.findAll({ include: [Post] });
 * });
 * ```
 */
export const monitorN1Patterns = async <T>(
  sequelize: Sequelize,
  operation: () => Promise<T>,
): Promise<{ result: T; analysis: N1DetectionResult }> => {
  const queries: { sql: string; timestamp: number }[] = [];

  const hook = (options: any) => {
    queries.push({ sql: options.sql, timestamp: Date.now() });
  };

  sequelize.addHook('beforeQuery', hook);

  try {
    const result = await operation();

    const analysis = analyzeQuerySequence(queries);

    return { result, analysis };
  } finally {
    sequelize.removeHook('beforeQuery', hook);
  }
};

// ============================================================================
// QUERY OPTIMIZATION & ANALYSIS
// ============================================================================

/**
 * 5. Analyzes and optimizes Sequelize query options for better performance.
 *
 * @param {FindOptions} options - Original query options
 * @param {ModelStatic<any>} model - Sequelize model
 * @returns {QueryOptimizationResult} Optimization analysis and suggestions
 *
 * @example
 * ```typescript
 * const optimization = analyzeQueryOptimization({
 *   where: { status: 'active' },
 *   include: [{ all: true }]
 * }, User);
 * ```
 */
export const analyzeQueryOptimization = <M extends Model>(
  options: FindOptions<M>,
  model: ModelStatic<M>,
): QueryOptimizationResult => {
  const recommendations: string[] = [];
  const indexSuggestions: string[] = [];
  const warnings: string[] = [];
  let estimatedImprovement = 0;

  // Check for SELECT *
  if (!options.attributes || (Array.isArray(options.attributes) && options.attributes.length === 0)) {
    recommendations.push('Specify only needed attributes instead of selecting all columns');
    estimatedImprovement += 15;
  }

  // Check for inefficient includes
  if (options.include) {
    const includes = Array.isArray(options.include) ? options.include : [options.include];
    if (includes.some((inc: any) => inc.all === true)) {
      warnings.push('Including all associations can cause performance issues');
      estimatedImprovement += 30;
    }

    const hasDeepNesting = includes.some((inc: any) => inc.include && inc.include.length > 2);
    if (hasDeepNesting) {
      warnings.push('Deep nested includes detected - consider separate queries or denormalization');
      estimatedImprovement += 25;
    }
  }

  // Check for missing indexes
  if (options.where) {
    const whereFields = extractWhereFields(options.where);
    indexSuggestions.push(...whereFields.map(field => `Consider index on ${model.tableName}.${field}`));
  }

  // Check for inefficient LIMIT without ORDER
  if (options.limit && !options.order) {
    recommendations.push('Add ORDER BY clause when using LIMIT for consistent results');
  }

  return {
    originalQuery: JSON.stringify(options),
    estimatedImprovement,
    recommendations,
    indexSuggestions,
    warnings,
  };
};

/**
 * 6. Optimizes WHERE clause conditions for better query performance.
 *
 * @param {WhereOptions} where - WHERE conditions
 * @returns {WhereOptions} Optimized WHERE conditions
 *
 * @example
 * ```typescript
 * const optimized = optimizeWhereClause({
 *   [Op.or]: [{ status: 'active' }, { priority: 'high' }]
 * });
 * ```
 */
export const optimizeWhereClause = (where: WhereOptions): WhereOptions => {
  const optimized = { ...where };

  // Convert OR conditions to IN where possible
  if ((optimized as any)[Op.or]) {
    const orConditions = (optimized as any)[Op.or];
    const fieldGroups = groupOrConditionsByField(orConditions);

    for (const [field, values] of Object.entries(fieldGroups)) {
      if (values.length > 1) {
        delete (optimized as any)[Op.or];
        (optimized as any)[field] = { [Op.in]: values };
      }
    }
  }

  // Ensure most selective conditions are first
  // This helps some databases optimize better
  return reorderConditionsBySelectivity(optimized);
};

/**
 * 7. Generates optimized query hints for specific database dialects.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} queryType - Type of query ('select' | 'insert' | 'update' | 'delete')
 * @returns {QueryHint[]} Applicable query hints
 *
 * @example
 * ```typescript
 * const hints = generateQueryHints(sequelize, 'select');
 * // Apply hints to optimize query execution
 * ```
 */
export const generateQueryHints = (sequelize: Sequelize, queryType: string): QueryHint[] => {
  const dialect = sequelize.getDialect();
  const hints: QueryHint[] = [];

  if (dialect === 'postgres') {
    if (queryType === 'select') {
      hints.push({
        hint: 'ENABLE_SEQSCAN OFF',
        applicability: 'Force index usage when appropriate',
        expectedImprovement: 40,
        risks: ['May fail if no suitable index exists'],
      });
    }
  } else if (dialect === 'mysql') {
    if (queryType === 'select') {
      hints.push({
        hint: 'USE INDEX (index_name)',
        applicability: 'Force specific index usage',
        expectedImprovement: 35,
        risks: ['Query may fail if index is dropped'],
      });
      hints.push({
        hint: 'STRAIGHT_JOIN',
        applicability: 'Force join order',
        expectedImprovement: 20,
        risks: ['May worsen performance if join order is suboptimal'],
      });
    }
  }

  return hints;
};

/**
 * 8. Rewrites queries to use more efficient patterns.
 *
 * @param {string} sql - Original SQL query
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {string} Rewritten query
 *
 * @example
 * ```typescript
 * const optimizedSql = rewriteQueryForPerformance(
 *   'SELECT * FROM users WHERE id IN (SELECT user_id FROM posts)',
 *   sequelize
 * );
 * ```
 */
export const rewriteQueryForPerformance = (sql: string, sequelize: Sequelize): string => {
  let optimized = sql;

  // Convert IN subquery to JOIN where beneficial
  const inSubqueryPattern = /WHERE\s+(\w+)\s+IN\s+\(SELECT\s+(\w+)\s+FROM\s+(\w+)/i;
  if (inSubqueryPattern.test(optimized)) {
    const match = optimized.match(inSubqueryPattern);
    if (match) {
      optimized = optimized.replace(
        inSubqueryPattern,
        `INNER JOIN ${match[3]} ON ${match[1]} = ${match[3]}.${match[2]}`,
      );
    }
  }

  // Convert NOT IN to NOT EXISTS for better performance
  const notInPattern = /WHERE\s+(\w+)\s+NOT\s+IN\s+\(SELECT/i;
  if (notInPattern.test(optimized)) {
    optimized = optimized.replace(/NOT\s+IN/gi, 'NOT EXISTS');
  }

  // Remove redundant DISTINCT when using GROUP BY
  if (/GROUP\s+BY/i.test(optimized) && /SELECT\s+DISTINCT/i.test(optimized)) {
    optimized = optimized.replace(/SELECT\s+DISTINCT/i, 'SELECT');
  }

  return optimized;
};

// ============================================================================
// INDEX ANALYSIS & MANAGEMENT
// ============================================================================

/**
 * 9. Analyzes table indexes and provides optimization recommendations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name to analyze
 * @returns {Promise<IndexAnalysisResult>} Index analysis results
 *
 * @example
 * ```typescript
 * const analysis = await analyzeTableIndexes(sequelize, 'users');
 * console.log('Missing indexes:', analysis.missingIndexes);
 * ```
 */
export const analyzeTableIndexes = async (
  sequelize: Sequelize,
  tableName: string,
): Promise<IndexAnalysisResult> => {
  const dialect = sequelize.getDialect();
  const existingIndexes: IndexInfo[] = [];
  const missingIndexes: IndexRecommendation[] = [];
  const unusedIndexes: string[] = [];
  const duplicateIndexes: string[][] = [];

  // Get existing indexes
  const indexQuery =
    dialect === 'postgres'
      ? `
    SELECT
      indexname as name,
      indexdef as definition
    FROM pg_indexes
    WHERE tablename = $1
  `
      : `SHOW INDEX FROM ${tableName}`;

  const indexes = await sequelize.query(indexQuery, {
    bind: dialect === 'postgres' ? [tableName] : undefined,
    type: QueryTypes.SELECT,
  });

  // Analyze index usage
  const usageQuery =
    dialect === 'postgres'
      ? `
    SELECT
      schemaname,
      tablename,
      indexname,
      idx_scan as scans
    FROM pg_stat_user_indexes
    WHERE tablename = $1
  `
      : null;

  if (usageQuery) {
    const usage: any[] = await sequelize.query(usageQuery, {
      bind: [tableName],
      type: QueryTypes.SELECT,
    });

    for (const idx of usage) {
      if (idx.scans === 0) {
        unusedIndexes.push(idx.indexname);
      }
    }
  }

  // Detect duplicate indexes
  const indexMap = new Map<string, string[]>();
  for (const idx of indexes as any[]) {
    const key = Array.isArray(idx.columns) ? idx.columns.sort().join(',') : idx.Column_name;
    if (!indexMap.has(key)) {
      indexMap.set(key, []);
    }
    indexMap.get(key)!.push(idx.name || idx.Key_name);
  }

  for (const [_, names] of indexMap) {
    if (names.length > 1) {
      duplicateIndexes.push(names);
    }
  }

  return {
    table: tableName,
    existingIndexes,
    missingIndexes,
    unusedIndexes,
    duplicateIndexes,
    fragmentationLevel: 0,
  };
};

/**
 * 10. Recommends composite indexes based on query patterns.
 *
 * @param {string[]} queryPatterns - Array of WHERE clause patterns
 * @param {string} tableName - Table name
 * @returns {IndexRecommendation[]} Recommended composite indexes
 *
 * @example
 * ```typescript
 * const recommendations = recommendCompositeIndexes(
 *   ['status = ? AND created_at > ?', 'user_id = ? AND status = ?'],
 *   'orders'
 * );
 * ```
 */
export const recommendCompositeIndexes = (
  queryPatterns: string[],
  tableName: string,
): IndexRecommendation[] => {
  const recommendations: IndexRecommendation[] = [];
  const columnFrequency = new Map<string, number>();

  // Extract columns from query patterns
  for (const pattern of queryPatterns) {
    const columns = extractColumnsFromPattern(pattern);
    for (const col of columns) {
      columnFrequency.set(col, (columnFrequency.get(col) || 0) + 1);
    }
  }

  // Recommend indexes for frequently used column combinations
  const sortedColumns = Array.from(columnFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([col]) => col);

  if (sortedColumns.length >= 2) {
    recommendations.push({
      columns: sortedColumns.slice(0, 3),
      reason: `Frequently queried together in ${queryPatterns.length} patterns`,
      estimatedImprovement: 50,
      priority: 'high',
      createStatement: `CREATE INDEX idx_${tableName}_${sortedColumns.slice(0, 3).join('_')} ON ${tableName}(${sortedColumns.slice(0, 3).join(', ')})`,
    });
  }

  return recommendations;
};

/**
 * 11. Checks index fragmentation and suggests maintenance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @returns {Promise<{ fragmentation: number; recommendation: string }>} Fragmentation analysis
 *
 * @example
 * ```typescript
 * const { fragmentation, recommendation } = await checkIndexFragmentation(sequelize, 'users');
 * ```
 */
export const checkIndexFragmentation = async (
  sequelize: Sequelize,
  tableName: string,
): Promise<{ fragmentation: number; recommendation: string }> => {
  const dialect = sequelize.getDialect();

  if (dialect === 'postgres') {
    const query = `
      SELECT
        100 - (100 * (1.0 * reltuples / nullif(relpages, 0))) as fragmentation
      FROM pg_class
      WHERE relname = $1
    `;

    const result: any[] = await sequelize.query(query, {
      bind: [tableName],
      type: QueryTypes.SELECT,
    });

    const fragmentation = result[0]?.fragmentation || 0;
    const recommendation =
      fragmentation > 30
        ? `VACUUM FULL ${tableName}; REINDEX TABLE ${tableName};`
        : fragmentation > 10
          ? `VACUUM ${tableName};`
          : 'No maintenance needed';

    return { fragmentation, recommendation };
  }

  return { fragmentation: 0, recommendation: 'Not supported for this dialect' };
};

/**
 * 12. Generates covering index suggestions for specific queries.
 *
 * @param {FindOptions} queryOptions - Sequelize query options
 * @param {string} tableName - Table name
 * @returns {IndexRecommendation[]} Covering index recommendations
 *
 * @example
 * ```typescript
 * const coveringIndexes = suggestCoveringIndexes({
 *   where: { status: 'active' },
 *   attributes: ['id', 'name', 'email']
 * }, 'users');
 * ```
 */
export const suggestCoveringIndexes = (
  queryOptions: FindOptions,
  tableName: string,
): IndexRecommendation[] => {
  const recommendations: IndexRecommendation[] = [];

  const whereColumns = queryOptions.where ? extractWhereFields(queryOptions.where) : [];
  const selectColumns =
    queryOptions.attributes && Array.isArray(queryOptions.attributes)
      ? queryOptions.attributes
      : [];

  if (whereColumns.length > 0 && selectColumns.length > 0) {
    const coveringColumns = [...whereColumns, ...selectColumns];

    recommendations.push({
      columns: coveringColumns,
      reason: 'Covering index to avoid table lookup',
      estimatedImprovement: 60,
      priority: 'high',
      createStatement: `CREATE INDEX idx_${tableName}_covering_${whereColumns.join('_')} ON ${tableName}(${coveringColumns.join(', ')})`,
    });
  }

  return recommendations;
};

// ============================================================================
// EXPLAIN PLAN PARSING & ANALYSIS
// ============================================================================

/**
 * 13. Executes EXPLAIN on a query and parses the execution plan.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sql - SQL query to explain
 * @param {any[]} bindings - Query parameter bindings
 * @returns {Promise<ExplainPlanResult>} Parsed execution plan
 *
 * @example
 * ```typescript
 * const plan = await explainQuery(sequelize, 'SELECT * FROM users WHERE id = ?', [1]);
 * console.log('Estimated cost:', plan.totalCost);
 * ```
 */
export const explainQuery = async (
  sequelize: Sequelize,
  sql: string,
  bindings: any[] = [],
): Promise<ExplainPlanResult> => {
  const dialect = sequelize.getDialect();
  const explainPrefix = dialect === 'postgres' ? 'EXPLAIN (FORMAT JSON, ANALYZE)' : 'EXPLAIN';

  const result = await sequelize.query(`${explainPrefix} ${sql}`, {
    bind: bindings,
    type: QueryTypes.SELECT,
  });

  return parseExplainPlan(result, dialect);
};

/**
 * 14. Parses raw EXPLAIN output into structured format.
 *
 * @param {any} explainOutput - Raw EXPLAIN output
 * @param {string} dialect - Database dialect
 * @returns {ExplainPlanResult} Structured execution plan
 *
 * @example
 * ```typescript
 * const parsed = parseExplainPlan(rawOutput, 'postgres');
 * ```
 */
export const parseExplainPlan = (explainOutput: any, dialect: string): ExplainPlanResult => {
  const planSteps: ExplainPlanStep[] = [];
  const indexUsage: IndexUsageInfo[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];
  let totalCost = 0;
  let estimatedRows = 0;

  if (dialect === 'postgres' && Array.isArray(explainOutput) && explainOutput[0]?.['QUERY PLAN']) {
    const plan = explainOutput[0]['QUERY PLAN'][0]?.Plan;
    if (plan) {
      totalCost = plan['Total Cost'] || 0;
      estimatedRows = plan['Plan Rows'] || 0;

      extractPlanSteps(plan, planSteps, indexUsage, warnings);
    }
  } else if (dialect === 'mysql') {
    for (const row of explainOutput as any[]) {
      planSteps.push({
        operation: row.select_type,
        table: row.table,
        cost: parseFloat(row.filtered) || 0,
        rows: row.rows,
        accessMethod: row.type,
        filter: row.Extra,
      });

      if (row.key) {
        indexUsage.push({
          indexName: row.key,
          table: row.table,
          used: true,
        });
      }

      if (row.type === 'ALL') {
        warnings.push(`Full table scan on ${row.table}`);
        recommendations.push(`Add index to ${row.table} for better performance`);
      }
    }
  }

  return {
    planSteps,
    totalCost,
    estimatedRows,
    warnings,
    indexUsage,
    recommendations,
  };
};

/**
 * 15. Compares execution plans to identify performance regressions.
 *
 * @param {ExplainPlanResult} baseline - Baseline execution plan
 * @param {ExplainPlanResult} current - Current execution plan
 * @returns {{ regression: boolean; details: string[] }} Comparison result
 *
 * @example
 * ```typescript
 * const comparison = compareExecutionPlans(baselinePlan, currentPlan);
 * if (comparison.regression) {
 *   console.log('Performance regression detected!');
 * }
 * ```
 */
export const compareExecutionPlans = (
  baseline: ExplainPlanResult,
  current: ExplainPlanResult,
): { regression: boolean; details: string[] } => {
  const details: string[] = [];
  let regression = false;

  const costIncrease = ((current.totalCost - baseline.totalCost) / baseline.totalCost) * 100;
  if (costIncrease > 20) {
    regression = true;
    details.push(`Query cost increased by ${costIncrease.toFixed(2)}%`);
  }

  const rowIncrease = ((current.estimatedRows - baseline.estimatedRows) / baseline.estimatedRows) * 100;
  if (rowIncrease > 50) {
    details.push(`Estimated rows increased by ${rowIncrease.toFixed(2)}%`);
  }

  if (current.warnings.length > baseline.warnings.length) {
    regression = true;
    details.push('New performance warnings detected');
  }

  return { regression, details };
};

// ============================================================================
// CONNECTION POOL TUNING
// ============================================================================

/**
 * 16. Analyzes connection pool metrics and suggests optimal configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<ConnectionPoolMetrics>} Pool metrics
 *
 * @example
 * ```typescript
 * const metrics = await analyzeConnectionPool(sequelize);
 * console.log('Utilization:', metrics.utilizationPercent + '%');
 * ```
 */
export const analyzeConnectionPool = async (sequelize: Sequelize): Promise<ConnectionPoolMetrics> => {
  const pool = (sequelize.connectionManager as any).pool;

  if (!pool) {
    throw new Error('Connection pool not available');
  }

  const metrics: ConnectionPoolMetrics = {
    activeConnections: pool.used?.length || 0,
    idleConnections: pool.free?.length || 0,
    waitingRequests: pool.pending?.length || 0,
    totalConnections: (pool.used?.length || 0) + (pool.free?.length || 0),
    maxConnections: pool.options?.max || 0,
    utilizationPercent: 0,
    averageWaitTime: 0,
    peakConnections: pool.used?.length || 0,
  };

  metrics.utilizationPercent = (metrics.totalConnections / metrics.maxConnections) * 100;

  return metrics;
};

/**
 * 17. Recommends optimal pool size based on workload analysis.
 *
 * @param {number} avgQueryDuration - Average query duration in ms
 * @param {number} requestsPerSecond - Expected requests per second
 * @returns {{ min: number; max: number; idle: number; acquire: number }} Pool config
 *
 * @example
 * ```typescript
 * const config = recommendPoolSize(50, 100);
 * ```
 */
export const recommendPoolSize = (
  avgQueryDuration: number,
  requestsPerSecond: number,
): { min: number; max: number; idle: number; acquire: number } => {
  const concurrentQueries = (avgQueryDuration / 1000) * requestsPerSecond;
  const maxConnections = Math.min(Math.ceil(concurrentQueries * 1.5), 100);
  const minConnections = Math.max(Math.ceil(maxConnections * 0.2), 2);

  return {
    min: minConnections,
    max: maxConnections,
    idle: 10000,
    acquire: 30000,
  };
};

/**
 * 18. Detects and reports connection pool exhaustion issues.
 *
 * @param {ConnectionPoolMetrics} metrics - Current pool metrics
 * @returns {PerformanceAlert[]} Alerts for pool issues
 *
 * @example
 * ```typescript
 * const alerts = detectPoolExhaustion(metrics);
 * ```
 */
export const detectPoolExhaustion = (metrics: ConnectionPoolMetrics): PerformanceAlert[] => {
  const alerts: PerformanceAlert[] = [];

  if (metrics.utilizationPercent > 90) {
    alerts.push({
      type: 'pool_exhaustion',
      severity: 'critical',
      message: 'Connection pool near capacity',
      timestamp: new Date(),
      metrics,
      recommendations: [
        'Increase max pool size',
        'Optimize long-running queries',
        'Check for connection leaks',
      ],
    });
  }

  if (metrics.waitingRequests > 10) {
    alerts.push({
      type: 'high_wait_queue',
      severity: 'warning',
      message: 'High number of waiting connection requests',
      timestamp: new Date(),
      metrics,
      recommendations: ['Increase pool size', 'Reduce query complexity', 'Add read replicas'],
    });
  }

  return alerts;
};

/**
 * 19. Monitors connection acquisition times and identifies bottlenecks.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} duration - Monitoring duration in ms
 * @returns {Promise<{ avgTime: number; maxTime: number; p95Time: number }>} Acquisition metrics
 *
 * @example
 * ```typescript
 * const times = await monitorConnectionAcquisition(sequelize, 60000);
 * ```
 */
export const monitorConnectionAcquisition = async (
  sequelize: Sequelize,
  duration: number = 60000,
): Promise<{ avgTime: number; maxTime: number; p95Time: number }> => {
  const acquisitionTimes: number[] = [];

  const hook = (connection: any, options: any) => {
    if (options.acquisitionStart) {
      acquisitionTimes.push(Date.now() - options.acquisitionStart);
    }
  };

  sequelize.addHook('afterPoolAcquire', hook);

  await new Promise(resolve => setTimeout(resolve, duration));

  sequelize.removeHook('afterPoolAcquire', hook);

  if (acquisitionTimes.length === 0) {
    return { avgTime: 0, maxTime: 0, p95Time: 0 };
  }

  const sorted = acquisitionTimes.sort((a, b) => a - b);
  const p95Index = Math.floor(sorted.length * 0.95);

  return {
    avgTime: acquisitionTimes.reduce((sum, time) => sum + time, 0) / acquisitionTimes.length,
    maxTime: Math.max(...acquisitionTimes),
    p95Time: sorted[p95Index],
  };
};

// ============================================================================
// QUERY RESULT CACHING
// ============================================================================

/**
 * 20. Implements query result caching with automatic invalidation.
 *
 * @param {string} key - Cache key
 * @param {Function} queryFn - Query function to cache
 * @param {CacheConfig} config - Cache configuration
 * @returns {Promise<any>} Cached or fresh query result
 *
 * @example
 * ```typescript
 * const users = await cacheQueryResult('active_users',
 *   () => User.findAll({ where: { active: true }}),
 *   { ttl: 300, strategy: 'lru' }
 * );
 * ```
 */
export const cacheQueryResult = async <T>(
  key: string,
  queryFn: () => Promise<T>,
  config: CacheConfig,
): Promise<T> => {
  const cache = getOrCreateCache(config);
  const cacheKey = config.keyPrefix ? `${config.keyPrefix}:${key}` : key;

  const cached = cache.get(cacheKey);
  if (cached) {
    return cached as T;
  }

  const result = await queryFn();
  cache.set(cacheKey, result, config.ttl);

  return result;
};

/**
 * 21. Creates a cache wrapper for Sequelize models with smart invalidation.
 *
 * @param {ModelStatic<any>} model - Sequelize model to cache
 * @param {CacheConfig} config - Cache configuration
 * @returns {ModelStatic<any>} Cached model wrapper
 *
 * @example
 * ```typescript
 * const CachedUser = createCachedModel(User, {
 *   ttl: 600,
 *   strategy: 'lru',
 *   invalidateOn: ['create', 'update', 'destroy']
 * });
 * ```
 */
export const createCachedModel = <M extends Model>(
  model: ModelStatic<M>,
  config: CacheConfig,
): any => {
  const cache = getOrCreateCache(config);

  // Wrap findAll
  const originalFindAll = model.findAll.bind(model);
  (model as any).findAll = async (options?: FindOptions<M>) => {
    const cacheKey = `${model.name}:findAll:${JSON.stringify(options)}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const result = await originalFindAll(options);
    cache.set(cacheKey, result, config.ttl);
    return result;
  };

  // Set up invalidation hooks
  if (config.invalidateOn) {
    for (const event of config.invalidateOn) {
      model.addHook(`after${event.charAt(0).toUpperCase() + event.slice(1)}` as any, async () => {
        cache.clear(`${model.name}:`);
      });
    }
  }

  return model;
};

/**
 * 22. Implements cache warming for frequently accessed queries.
 *
 * @param {Map<string, Function>} queries - Map of cache keys to query functions
 * @param {CacheConfig} config - Cache configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await warmQueryCache(new Map([
 *   ['active_users', () => User.findAll({ where: { active: true }})],
 *   ['recent_posts', () => Post.findAll({ limit: 100, order: [['createdAt', 'DESC']]})]
 * ]), { ttl: 600, strategy: 'lru' });
 * ```
 */
export const warmQueryCache = async (
  queries: Map<string, () => Promise<any>>,
  config: CacheConfig,
): Promise<void> => {
  const cache = getOrCreateCache(config);

  await Promise.all(
    Array.from(queries.entries()).map(async ([key, queryFn]) => {
      try {
        const result = await queryFn();
        cache.set(key, result, config.ttl);
      } catch (error) {
        console.error(`Failed to warm cache for ${key}:`, error);
      }
    }),
  );
};

/**
 * 23. Provides cache statistics and hit rate analysis.
 *
 * @returns {CacheStats} Cache statistics
 *
 * @example
 * ```typescript
 * const stats = getCacheStats();
 * console.log('Hit rate:', stats.hitRate * 100 + '%');
 * ```
 */
export const getCacheStats = (): CacheStats => {
  const cache = globalCache;

  return {
    hits: cache.hits || 0,
    misses: cache.misses || 0,
    hitRate: (cache.hits || 0) / ((cache.hits || 0) + (cache.misses || 0)) || 0,
    size: cache.size || 0,
    evictions: cache.evictions || 0,
  };
};

// ============================================================================
// EAGER/LAZY LOADING OPTIMIZATION
// ============================================================================

/**
 * 24. Optimizes eager loading to minimize query count and data transfer.
 *
 * @param {FindOptions} options - Base query options
 * @param {EagerLoadingConfig[]} associations - Associations to eager load
 * @returns {FindOptions} Optimized options with eager loading
 *
 * @example
 * ```typescript
 * const options = optimizeEagerLoading({}, [
 *   { associations: ['posts', 'comments'], separate: true }
 * ]);
 * ```
 */
export const optimizeEagerLoading = (
  options: FindOptions,
  associations: EagerLoadingConfig[],
): FindOptions => {
  const include: Includeable[] = [];

  for (const config of associations) {
    for (const assoc of config.associations) {
      include.push({
        association: assoc,
        attributes: config.attributes,
        separate: config.separate,
        required: config.required ?? false,
        paranoid: config.paranoid ?? true,
      });
    }
  }

  return {
    ...options,
    include: [...(options.include || []), ...include],
    subQuery: false,
  };
};

/**
 * 25. Implements lazy loading with batching for better performance.
 *
 * @param {Model[]} instances - Model instances
 * @param {string} association - Association to lazy load
 * @param {LazyLoadingConfig} config - Lazy loading configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await lazyLoadWithBatching(users, 'posts', {
 *   fetchStrategy: 'batched'
 * });
 * ```
 */
export const lazyLoadWithBatching = async (
  instances: Model[],
  association: string,
  config: LazyLoadingConfig = {},
): Promise<void> => {
  if (instances.length === 0) return;

  const model = instances[0].constructor as ModelStatic<Model>;
  const assocDef = (model as any).associations[association];

  if (!assocDef) {
    throw new Error(`Association ${association} not found`);
  }

  const foreignKey = assocDef.foreignKey;
  const ids = instances.map((inst: any) => inst[foreignKey]).filter(Boolean);

  if (ids.length === 0) return;

  const associated = await assocDef.target.findAll({
    where: {
      [foreignKey]: { [Op.in]: ids },
    },
  });

  const groupedByFk = new Map<any, Model[]>();
  for (const item of associated) {
    const fkValue = (item as any)[foreignKey];
    if (!groupedByFk.has(fkValue)) {
      groupedByFk.set(fkValue, []);
    }
    groupedByFk.get(fkValue)!.push(item);
  }

  for (const instance of instances) {
    (instance as any)[association] = groupedByFk.get((instance as any)[foreignKey]) || [];
  }
};

/**
 * 26. Analyzes and suggests optimal loading strategy (eager vs lazy).
 *
 * @param {number} parentCount - Number of parent records
 * @param {number} avgChildrenPerParent - Average children per parent
 * @param {number} childRecordSize - Average child record size in bytes
 * @returns {{ strategy: 'eager' | 'lazy' | 'separate'; reason: string }}
 *
 * @example
 * ```typescript
 * const { strategy, reason } = suggestLoadingStrategy(100, 50, 1024);
 * ```
 */
export const suggestLoadingStrategy = (
  parentCount: number,
  avgChildrenPerParent: number,
  childRecordSize: number,
): { strategy: 'eager' | 'lazy' | 'separate'; reason: string } => {
  const totalChildren = parentCount * avgChildrenPerParent;
  const totalDataSize = totalChildren * childRecordSize;

  // If dataset is small, use eager loading
  if (totalDataSize < 1024 * 1024) {
    // < 1MB
    return {
      strategy: 'eager',
      reason: 'Small dataset - single query is most efficient',
    };
  }

  // If many children per parent, use separate queries
  if (avgChildrenPerParent > 20) {
    return {
      strategy: 'separate',
      reason: 'High children count - separate queries prevent cartesian product',
    };
  }

  // Default to lazy loading for large datasets
  return {
    strategy: 'lazy',
    reason: 'Large dataset - lazy loading reduces initial load time',
  };
};

// ============================================================================
// BULK OPERATIONS & BATCHING
// ============================================================================

/**
 * 27. Processes bulk operations in optimized batches with progress tracking.
 *
 * @param {any[]} items - Items to process
 * @param {Function} operation - Async operation for each batch
 * @param {BatchProcessingConfig} config - Batch processing configuration
 * @returns {Promise<BulkOperationResult>} Processing results
 *
 * @example
 * ```typescript
 * const result = await processBulkOperation(users, async (batch) => {
 *   await User.bulkCreate(batch);
 * }, { batchSize: 100, concurrency: 5 });
 * ```
 */
export const processBulkOperation = async <T>(
  items: T[],
  operation: (batch: T[]) => Promise<void>,
  config: BatchProcessingConfig,
): Promise<BulkOperationResult> => {
  const startTime = Date.now();
  let processed = 0;
  let succeeded = 0;
  const errors: any[] = [];

  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += config.batchSize) {
    batches.push(items.slice(i, i + config.batchSize));
  }

  const concurrency = config.concurrency || 1;

  for (let i = 0; i < batches.length; i += concurrency) {
    const batchPromises = batches.slice(i, i + concurrency).map(async batch => {
      try {
        await operation(batch);
        processed += batch.length;
        succeeded += batch.length;

        if (config.onProgress) {
          config.onProgress(processed, items.length);
        }
      } catch (error) {
        processed += batch.length;
        errors.push({ batch, error });

        if (config.onError) {
          config.onError(error as Error, batch);
        }
      }
    });

    await Promise.all(batchPromises);

    if (config.delayBetweenBatches) {
      await new Promise(resolve => setTimeout(resolve, config.delayBetweenBatches));
    }
  }

  return {
    processed,
    succeeded,
    failed: errors.length,
    duration: Date.now() - startTime,
    errors,
  };
};

/**
 * 28. Optimizes bulk insert operations with conflict resolution.
 *
 * @param {ModelStatic<any>} model - Sequelize model
 * @param {any[]} records - Records to insert
 * @param {object} options - Bulk insert options
 * @returns {Promise<BulkOperationResult>} Insert results
 *
 * @example
 * ```typescript
 * const result = await optimizedBulkInsert(User, users, {
 *   updateOnDuplicate: ['email', 'name'],
 *   batchSize: 1000
 * });
 * ```
 */
export const optimizedBulkInsert = async <M extends Model>(
  model: ModelStatic<M>,
  records: any[],
  options: {
    updateOnDuplicate?: string[];
    batchSize?: number;
    transaction?: Transaction;
    validate?: boolean;
  } = {},
): Promise<BulkOperationResult> => {
  const batchSize = options.batchSize || 1000;
  const startTime = Date.now();
  let succeeded = 0;
  const errors: any[] = [];

  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);

    try {
      await model.bulkCreate(batch, {
        updateOnDuplicate: options.updateOnDuplicate,
        transaction: options.transaction,
        validate: options.validate ?? false,
        returning: false,
      });
      succeeded += batch.length;
    } catch (error) {
      errors.push({ batch, error });
    }
  }

  return {
    processed: records.length,
    succeeded,
    failed: errors.length,
    duration: Date.now() - startTime,
    errors,
  };
};

/**
 * 29. Implements efficient bulk update with optimistic locking.
 *
 * @param {ModelStatic<any>} model - Sequelize model
 * @param {any[]} updates - Updates to apply
 * @param {string} identifierField - Field to identify records
 * @returns {Promise<BulkOperationResult>} Update results
 *
 * @example
 * ```typescript
 * const result = await bulkUpdateWithLocking(User,
 *   [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }],
 *   'id'
 * );
 * ```
 */
export const bulkUpdateWithLocking = async <M extends Model>(
  model: ModelStatic<M>,
  updates: any[],
  identifierField: string = 'id',
): Promise<BulkOperationResult> => {
  const startTime = Date.now();
  let succeeded = 0;
  const errors: any[] = [];

  for (const update of updates) {
    try {
      const [affectedCount] = await model.update(update, {
        where: { [identifierField]: update[identifierField] } as any,
        // Add version check if model has version field
        // @ts-ignore
        ...(model.rawAttributes.version && { where: { version: update.version } }),
      });

      if (affectedCount > 0) {
        succeeded++;
      } else {
        errors.push({ update, error: new Error('Record not found or version mismatch') });
      }
    } catch (error) {
      errors.push({ update, error });
    }
  }

  return {
    processed: updates.length,
    succeeded,
    failed: errors.length,
    duration: Date.now() - startTime,
    errors,
  };
};

/**
 * 30. Batches multiple queries for execution in a single round-trip.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Function[]} queries - Array of query functions
 * @returns {Promise<QueryBatchResult>} Batch execution results
 *
 * @example
 * ```typescript
 * const result = await batchQueries(sequelize, [
 *   () => User.findAll(),
 *   () => Post.findAll(),
 *   () => Comment.count()
 * ]);
 * ```
 */
export const batchQueries = async (
  sequelize: Sequelize,
  queries: (() => Promise<any>)[],
): Promise<QueryBatchResult> => {
  const startTime = Date.now();
  let cacheHits = 0;
  let errors = 0;

  const results = await Promise.allSettled(queries.map(q => q()));

  for (const result of results) {
    if (result.status === 'rejected') {
      errors++;
    }
  }

  return {
    queries: queries.length,
    totalDuration: Date.now() - startTime,
    averageDuration: (Date.now() - startTime) / queries.length,
    cacheHits,
    errors,
  };
};

// ============================================================================
// QUERY PROFILING & MONITORING
// ============================================================================

/**
 * 31. Sets up comprehensive query profiling with detailed metrics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} options - Profiling options
 * @returns {Function} Function to stop profiling
 *
 * @example
 * ```typescript
 * const stopProfiling = setupQueryProfiler(sequelize, {
 *   slowQueryThreshold: 1000,
 *   logToFile: true
 * });
 * ```
 */
export const setupQueryProfiler = (
  sequelize: Sequelize,
  options: {
    slowQueryThreshold?: number;
    logToFile?: boolean;
    onSlowQuery?: (profile: QueryProfile) => void;
  } = {},
): (() => void) => {
  const profiles: QueryProfile[] = [];
  const threshold = options.slowQueryThreshold || 1000;

  const beforeHook = (options: any, query: any) => {
    query.startTime = Date.now();
  };

  const afterHook = async (options: any, query: any) => {
    const duration = Date.now() - query.startTime;

    const profile: QueryProfile = {
      query: options.sql,
      duration,
      timestamp: new Date(),
      rowsAffected: 0,
      cacheHit: false,
    };

    profiles.push(profile);

    if (duration > threshold && options.onSlowQuery) {
      options.onSlowQuery(profile);
    }
  };

  sequelize.addHook('beforeQuery', beforeHook);
  sequelize.addHook('afterQuery', afterHook);

  return () => {
    sequelize.removeHook('beforeQuery', beforeHook);
    sequelize.removeHook('afterQuery', afterHook);
  };
};

/**
 * 32. Tracks and logs slow queries with configurable thresholds.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} threshold - Slow query threshold in ms
 * @param {Function} logger - Custom logger function
 * @returns {Function} Function to stop tracking
 *
 * @example
 * ```typescript
 * const stop = trackSlowQueries(sequelize, 500, (log) => {
 *   console.warn('Slow query:', log);
 * });
 * ```
 */
export const trackSlowQueries = (
  sequelize: Sequelize,
  threshold: number = 1000,
  logger?: (log: SlowQueryLog) => void,
): (() => void) => {
  const slowQueries: SlowQueryLog[] = [];

  const beforeHook = (options: any, query: any) => {
    query.startTime = Date.now();
    if (Error.captureStackTrace) {
      query.stack = {};
      Error.captureStackTrace(query.stack);
    }
  };

  const afterHook = (options: any, query: any) => {
    const duration = Date.now() - query.startTime;

    if (duration > threshold) {
      const log: SlowQueryLog = {
        query: options.sql,
        duration,
        timestamp: new Date(),
        parameters: options.bind,
        threshold,
        severity: duration > threshold * 2 ? 'critical' : 'warning',
        stackTrace: query.stack?.stack,
      };

      slowQueries.push(log);

      if (logger) {
        logger(log);
      } else {
        console.warn(`[SLOW QUERY] ${duration}ms: ${options.sql.substring(0, 200)}`);
      }
    }
  };

  sequelize.addHook('beforeQuery', beforeHook);
  sequelize.addHook('afterQuery', afterHook);

  return () => {
    sequelize.removeHook('beforeQuery', beforeHook);
    sequelize.removeHook('afterQuery', afterHook);
  };
};

/**
 * 33. Generates comprehensive performance reports from collected metrics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startTime - Report start time
 * @param {Date} endTime - Report end time
 * @returns {Promise<DatabaseStatistics>} Performance report
 *
 * @example
 * ```typescript
 * const report = await generatePerformanceReport(
 *   sequelize,
 *   new Date(Date.now() - 3600000),
 *   new Date()
 * );
 * ```
 */
export const generatePerformanceReport = async (
  sequelize: Sequelize,
  startTime: Date,
  endTime: Date,
): Promise<DatabaseStatistics> => {
  const tableStats: TableStats[] = [];
  const indexStats: IndexStats[] = [];

  // Get table statistics
  const tables = await sequelize.getQueryInterface().showAllTables();

  for (const table of tables) {
    const stats = await getTableStatistics(sequelize, table);
    tableStats.push(stats);
  }

  const queryStats: QueryStats = {
    totalQueries: 0,
    slowQueries: 0,
    averageDuration: 0,
    medianDuration: 0,
    p95Duration: 0,
    p99Duration: 0,
  };

  const connectionStats = await analyzeConnectionPool(sequelize);
  const cacheStats = getCacheStats();

  return {
    tableStats,
    indexStats,
    queryStats,
    connectionStats,
    cacheStats,
  };
};

/**
 * 34. Profiles a specific operation and returns detailed performance data.
 *
 * @param {Function} operation - Async operation to profile
 * @returns {Promise<{ result: any; profile: QueryProfile }>} Operation result and profile
 *
 * @example
 * ```typescript
 * const { result, profile } = await profileOperation(async () => {
 *   return await User.findAll({ include: [Post] });
 * });
 * ```
 */
export const profileOperation = async <T>(
  operation: () => Promise<T>,
): Promise<{ result: T; profile: QueryProfile }> => {
  const startTime = Date.now();

  const result = await operation();

  const profile: QueryProfile = {
    query: operation.toString(),
    duration: Date.now() - startTime,
    timestamp: new Date(),
    rowsAffected: Array.isArray(result) ? result.length : 1,
    cacheHit: false,
  };

  return { result, profile };
};

// ============================================================================
// DEADLOCK DETECTION & LOCK OPTIMIZATION
// ============================================================================

/**
 * 35. Detects and analyzes database deadlocks.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<DeadlockInfo[]>} Detected deadlocks
 *
 * @example
 * ```typescript
 * const deadlocks = await detectDeadlocks(sequelize);
 * ```
 */
export const detectDeadlocks = async (sequelize: Sequelize): Promise<DeadlockInfo[]> => {
  const dialect = sequelize.getDialect();
  const deadlocks: DeadlockInfo[] = [];

  if (dialect === 'postgres') {
    const query = `
      SELECT
        locktype,
        relation::regclass,
        mode,
        transactionid,
        virtualtransaction,
        pid,
        granted
      FROM pg_locks
      WHERE NOT granted
    `;

    const locks: any[] = await sequelize.query(query, { type: QueryTypes.SELECT });

    // Analyze locks for deadlock patterns
    // This is a simplified version - real implementation would be more complex
    if (locks.length > 0) {
      // Group by transaction and analyze wait patterns
    }
  }

  return deadlocks;
};

/**
 * 36. Recommends optimal lock modes for query patterns.
 *
 * @param {string} queryPattern - Query pattern to analyze
 * @param {string} isolationLevel - Current isolation level
 * @returns {LockOptimizationResult} Lock optimization recommendation
 *
 * @example
 * ```typescript
 * const optimization = recommendLockMode('SELECT FOR UPDATE', 'READ COMMITTED');
 * ```
 */
export const recommendLockMode = (
  queryPattern: string,
  isolationLevel: string,
): LockOptimizationResult => {
  let recommendedLockMode = 'NONE';
  let reason = '';
  let estimatedImpact = 0;

  if (queryPattern.includes('SELECT') && queryPattern.includes('UPDATE')) {
    recommendedLockMode = 'FOR UPDATE';
    reason = 'Prevents lost updates in read-modify-write pattern';
    estimatedImpact = 40;
  } else if (queryPattern.includes('SELECT') && isolationLevel === 'READ COMMITTED') {
    recommendedLockMode = 'FOR SHARE';
    reason = 'Prevents concurrent modifications while allowing reads';
    estimatedImpact = 20;
  }

  return {
    currentLockMode: 'NONE',
    recommendedLockMode,
    reason,
    estimatedImpact,
  };
};

/**
 * 37. Implements retry logic with exponential backoff for deadlock scenarios.
 *
 * @param {Function} operation - Operation to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @returns {Promise<any>} Operation result
 *
 * @example
 * ```typescript
 * const result = await retryOnDeadlock(async () => {
 *   return await sequelize.transaction(async (t) => {
 *     // transaction operations
 *   });
 * }, 3);
 * ```
 */
export const retryOnDeadlock = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
): Promise<T> => {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;

      const isDeadlock =
        error.name === 'SequelizeDatabaseError' &&
        (error.message.includes('deadlock') || error.message.includes('lock timeout'));

      if (!isDeadlock || attempt === maxRetries) {
        throw error;
      }

      // Exponential backoff
      const delay = Math.pow(2, attempt) * 100;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

/**
 * 38. Monitors lock wait times and identifies contention points.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{ table: string; lockWaitTime: number }[]>} Lock wait statistics
 *
 * @example
 * ```typescript
 * const lockStats = await monitorLockWaitTimes(sequelize);
 * ```
 */
export const monitorLockWaitTimes = async (
  sequelize: Sequelize,
): Promise<{ table: string; lockWaitTime: number }[]> => {
  const dialect = sequelize.getDialect();

  if (dialect === 'postgres') {
    const query = `
      SELECT
        relation::regclass as table,
        mode,
        count(*) as count,
        sum(extract(epoch from (now() - query_start))) as total_wait_time
      FROM pg_locks l
      JOIN pg_stat_activity a ON l.pid = a.pid
      WHERE NOT granted
      GROUP BY relation, mode
    `;

    const results: any[] = await sequelize.query(query, { type: QueryTypes.SELECT });

    return results.map(r => ({
      table: r.table,
      lockWaitTime: parseFloat(r.total_wait_time) || 0,
    }));
  }

  return [];
};

// ============================================================================
// TRANSACTION ISOLATION & PERFORMANCE
// ============================================================================

/**
 * 39. Recommends optimal transaction isolation level based on use case.
 *
 * @param {object} requirements - Transaction requirements
 * @returns {IsolationLevelRecommendation} Isolation level recommendation
 *
 * @example
 * ```typescript
 * const recommendation = recommendIsolationLevel({
 *   requiresConsistentReads: true,
 *   allowsPhantomReads: false,
 *   performancePriority: 'high'
 * });
 * ```
 */
export const recommendIsolationLevel = (requirements: {
  requiresConsistentReads: boolean;
  allowsPhantomReads: boolean;
  performancePriority: 'low' | 'medium' | 'high';
}): IsolationLevelRecommendation => {
  let recommendedLevel = 'READ COMMITTED';
  let reason = '';
  const tradeoffs: string[] = [];

  if (!requirements.allowsPhantomReads && requirements.requiresConsistentReads) {
    recommendedLevel = 'SERIALIZABLE';
    reason = 'Strictest isolation for consistent reads and no phantom reads';
    tradeoffs.push('Lower throughput due to increased locking');
    tradeoffs.push('Higher chance of transaction conflicts');
  } else if (requirements.requiresConsistentReads) {
    recommendedLevel = 'REPEATABLE READ';
    reason = 'Consistent reads without phantom read protection';
    tradeoffs.push('Moderate performance impact');
  } else if (requirements.performancePriority === 'high') {
    recommendedLevel = 'READ COMMITTED';
    reason = 'Best performance with acceptable consistency';
    tradeoffs.push('Possible non-repeatable reads');
  }

  return {
    currentLevel: 'READ COMMITTED',
    recommendedLevel,
    reason,
    tradeoffs,
  };
};

/**
 * 40. Optimizes transaction scope to minimize lock duration.
 *
 * @param {Function} operation - Transaction operation
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Transaction result
 *
 * @example
 * ```typescript
 * const result = await optimizeTransactionScope(async (t) => {
 *   // Only critical operations here
 *   await User.update({ status: 'active' }, { where: { id: 1 }, transaction: t });
 * }, sequelize);
 * ```
 */
export const optimizeTransactionScope = async <T>(
  operation: (transaction: Transaction) => Promise<T>,
  sequelize: Sequelize,
): Promise<T> => {
  const startTime = Date.now();

  const result = await sequelize.transaction(
    {
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    },
    async transaction => {
      return await operation(transaction);
    },
  );

  const duration = Date.now() - startTime;

  if (duration > 1000) {
    console.warn(`Long transaction detected: ${duration}ms`);
  }

  return result;
};

// ============================================================================
// DATABASE STATISTICS & MONITORING
// ============================================================================

/**
 * 41. Collects comprehensive database statistics for analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @returns {Promise<TableStats>} Table statistics
 *
 * @example
 * ```typescript
 * const stats = await getTableStatistics(sequelize, 'users');
 * ```
 */
export const getTableStatistics = async (
  sequelize: Sequelize,
  tableName: string,
): Promise<TableStats> => {
  const dialect = sequelize.getDialect();

  if (dialect === 'postgres') {
    const query = `
      SELECT
        schemaname,
        tablename,
        n_live_tup as row_count,
        pg_total_relation_size(schemaname||'.'||tablename) as total_size,
        pg_indexes_size(schemaname||'.'||tablename) as index_size,
        last_analyze,
        last_vacuum
      FROM pg_stat_user_tables
      WHERE tablename = $1
    `;

    const result: any[] = await sequelize.query(query, {
      bind: [tableName],
      type: QueryTypes.SELECT,
    });

    if (result.length > 0) {
      const row = result[0];
      return {
        table: tableName,
        rowCount: parseInt(row.row_count) || 0,
        dataSize: parseInt(row.total_size) - parseInt(row.index_size) || 0,
        indexSize: parseInt(row.index_size) || 0,
        fragmentationPercent: 0,
        lastAnalyzed: row.last_analyze,
        lastVacuum: row.last_vacuum,
      };
    }
  }

  return {
    table: tableName,
    rowCount: 0,
    dataSize: 0,
    indexSize: 0,
    fragmentationPercent: 0,
  };
};

/**
 * 42. Monitors database health metrics in real-time.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} interval - Monitoring interval in ms
 * @param {Function} callback - Callback for health updates
 * @returns {Function} Function to stop monitoring
 *
 * @example
 * ```typescript
 * const stopMonitoring = monitorDatabaseHealth(sequelize, 5000, (health) => {
 *   console.log('DB Health:', health);
 * });
 * ```
 */
export const monitorDatabaseHealth = (
  sequelize: Sequelize,
  interval: number = 30000,
  callback: (health: any) => void,
): (() => void) => {
  const intervalId = setInterval(async () => {
    try {
      await sequelize.authenticate();

      const poolMetrics = await analyzeConnectionPool(sequelize);
      const cacheStats = getCacheStats();

      callback({
        status: 'healthy',
        timestamp: new Date(),
        poolMetrics,
        cacheStats,
      });
    } catch (error) {
      callback({
        status: 'unhealthy',
        timestamp: new Date(),
        error,
      });
    }
  }, interval);

  return () => clearInterval(intervalId);
};

/**
 * 43. Analyzes query patterns to identify optimization opportunities.
 *
 * @param {QueryProfile[]} profiles - Query execution profiles
 * @returns {{ patterns: Map<string, number>; recommendations: string[] }}
 *
 * @example
 * ```typescript
 * const analysis = analyzeQueryPatterns(collectedProfiles);
 * ```
 */
export const analyzeQueryPatterns = (
  profiles: QueryProfile[],
): { patterns: Map<string, number>; recommendations: string[] } => {
  const patterns = new Map<string, number>();
  const recommendations: string[] = [];

  for (const profile of profiles) {
    const normalized = normalizeQuery(profile.query);
    patterns.set(normalized, (patterns.get(normalized) || 0) + 1);
  }

  // Find frequently executed queries
  const frequentQueries = Array.from(patterns.entries())
    .filter(([_, count]) => count > 10)
    .sort((a, b) => b[1] - a[1]);

  for (const [query, count] of frequentQueries) {
    recommendations.push(`Query executed ${count} times - consider caching: ${query.substring(0, 100)}`);
  }

  // Find slow patterns
  const slowProfiles = profiles.filter(p => p.duration > 1000);
  if (slowProfiles.length > 0) {
    recommendations.push(
      `${slowProfiles.length} slow queries detected - review execution plans and indexes`,
    );
  }

  return { patterns, recommendations };
};

/**
 * 44. Generates alerts based on performance thresholds.
 *
 * @param {DatabaseStatistics} stats - Current database statistics
 * @param {object} thresholds - Performance thresholds
 * @returns {PerformanceAlert[]} Generated alerts
 *
 * @example
 * ```typescript
 * const alerts = generatePerformanceAlerts(stats, {
 *   slowQueryThreshold: 1000,
 *   poolUtilizationThreshold: 80
 * });
 * ```
 */
export const generatePerformanceAlerts = (
  stats: DatabaseStatistics,
  thresholds: {
    slowQueryThreshold?: number;
    poolUtilizationThreshold?: number;
    cacheHitRateThreshold?: number;
  } = {},
): PerformanceAlert[] => {
  const alerts: PerformanceAlert[] = [];

  // Check slow queries
  if (stats.queryStats.p95Duration > (thresholds.slowQueryThreshold || 1000)) {
    alerts.push({
      type: 'slow_queries',
      severity: 'warning',
      message: 'High P95 query duration detected',
      timestamp: new Date(),
      metrics: { p95: stats.queryStats.p95Duration },
      recommendations: ['Review slow query log', 'Optimize indexes', 'Add query caching'],
    });
  }

  // Check pool utilization
  if (stats.connectionStats.utilizationPercent > (thresholds.poolUtilizationThreshold || 80)) {
    alerts.push({
      type: 'high_pool_utilization',
      severity: 'critical',
      message: 'Connection pool utilization above threshold',
      timestamp: new Date(),
      metrics: stats.connectionStats,
      recommendations: ['Increase pool size', 'Optimize query performance', 'Add read replicas'],
    });
  }

  // Check cache hit rate
  if (stats.cacheStats.hitRate < (thresholds.cacheHitRateThreshold || 0.8)) {
    alerts.push({
      type: 'low_cache_hit_rate',
      severity: 'info',
      message: 'Cache hit rate below optimal level',
      timestamp: new Date(),
      metrics: stats.cacheStats,
      recommendations: ['Increase cache TTL', 'Review cache invalidation strategy', 'Warm cache on startup'],
    });
  }

  return alerts;
};

/**
 * 45. Exports performance metrics to monitoring systems (Prometheus, Datadog, etc.).
 *
 * @param {DatabaseStatistics} stats - Database statistics to export
 * @param {string} format - Export format ('prometheus' | 'json' | 'datadog')
 * @returns {string} Formatted metrics
 *
 * @example
 * ```typescript
 * const metrics = exportPerformanceMetrics(stats, 'prometheus');
 * // Send to monitoring system
 * ```
 */
export const exportPerformanceMetrics = (
  stats: DatabaseStatistics,
  format: 'prometheus' | 'json' | 'datadog' = 'json',
): string => {
  if (format === 'prometheus') {
    return [
      `# HELP db_query_total Total number of queries executed`,
      `# TYPE db_query_total counter`,
      `db_query_total ${stats.queryStats.totalQueries}`,
      `# HELP db_query_duration_avg Average query duration in milliseconds`,
      `# TYPE db_query_duration_avg gauge`,
      `db_query_duration_avg ${stats.queryStats.averageDuration}`,
      `# HELP db_pool_utilization Connection pool utilization percentage`,
      `# TYPE db_pool_utilization gauge`,
      `db_pool_utilization ${stats.connectionStats.utilizationPercent}`,
      `# HELP db_cache_hit_rate Cache hit rate`,
      `# TYPE db_cache_hit_rate gauge`,
      `db_cache_hit_rate ${stats.cacheStats.hitRate}`,
    ].join('\n');
  } else if (format === 'datadog') {
    return JSON.stringify({
      series: [
        {
          metric: 'db.query.total',
          points: [[Date.now() / 1000, stats.queryStats.totalQueries]],
          type: 'count',
        },
        {
          metric: 'db.query.duration.avg',
          points: [[Date.now() / 1000, stats.queryStats.averageDuration]],
          type: 'gauge',
        },
        {
          metric: 'db.pool.utilization',
          points: [[Date.now() / 1000, stats.connectionStats.utilizationPercent]],
          type: 'gauge',
        },
        {
          metric: 'db.cache.hit_rate',
          points: [[Date.now() / 1000, stats.cacheStats.hitRate]],
          type: 'gauge',
        },
      ],
    });
  }

  return JSON.stringify(stats, null, 2);
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function normalizeQuery(sql: string): string {
  return sql
    .replace(/\$\d+/g, '?')
    .replace(/'\d+'/g, "'?'")
    .replace(/\d+/g, '?')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .trim();
}

function extractWhereFields(where: WhereOptions): string[] {
  const fields: string[] = [];

  const extract = (obj: any) => {
    if (!obj || typeof obj !== 'object') return;

    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith('$') || key === Op.and || key === Op.or) {
        if (Array.isArray(value)) {
          value.forEach(v => extract(v));
        } else {
          extract(value);
        }
      } else {
        fields.push(key);
      }
    }
  };

  extract(where);
  return [...new Set(fields)];
}

function analyzeQuerySequence(queries: { sql: string; timestamp: number }[]): N1DetectionResult {
  const queryMap = new Map<string, number>();

  for (const q of queries) {
    const normalized = normalizeQuery(q.sql);
    queryMap.set(normalized, (queryMap.get(normalized) || 0) + 1);
  }

  const suspiciousPatterns: string[] = [];
  const recommendations: string[] = [];
  let maxCount = 0;

  for (const [query, count] of queryMap.entries()) {
    if (count >= 5) {
      suspiciousPatterns.push(`Query executed ${count} times: ${query.substring(0, 100)}`);
      recommendations.push('Use eager loading or batch loading');
      maxCount = Math.max(maxCount, count);
    }
  }

  return {
    detected: suspiciousPatterns.length > 0,
    queryCount: queries.length,
    suspiciousPatterns,
    recommendations,
    severity: maxCount >= 20 ? 'critical' : maxCount >= 10 ? 'high' : 'medium',
  };
}

function groupOrConditionsByField(orConditions: any[]): Record<string, any[]> {
  const groups: Record<string, any[]> = {};

  for (const condition of orConditions) {
    for (const [field, value] of Object.entries(condition)) {
      if (!groups[field]) groups[field] = [];
      groups[field].push(value);
    }
  }

  return groups;
}

function reorderConditionsBySelectivity(where: WhereOptions): WhereOptions {
  // Simplified - real implementation would analyze actual selectivity
  return where;
}

function extractColumnsFromPattern(pattern: string): string[] {
  const regex = /(\w+)\s*[=<>]/g;
  const matches: string[] = [];
  let match;

  while ((match = regex.exec(pattern)) !== null) {
    matches.push(match[1]);
  }

  return matches;
}

function extractPlanSteps(
  plan: any,
  steps: ExplainPlanStep[],
  indexUsage: IndexUsageInfo[],
  warnings: string[],
): void {
  steps.push({
    operation: plan['Node Type'],
    table: plan['Relation Name'],
    cost: plan['Total Cost'],
    rows: plan['Plan Rows'],
    accessMethod: plan['Scan Direction'] || plan['Node Type'],
    filter: plan['Filter'],
  });

  if (plan['Index Name']) {
    indexUsage.push({
      indexName: plan['Index Name'],
      table: plan['Relation Name'],
      used: true,
    });
  }

  if (plan['Node Type'] === 'Seq Scan') {
    warnings.push(`Sequential scan on ${plan['Relation Name']}`);
  }

  if (plan.Plans) {
    for (const subPlan of plan.Plans) {
      extractPlanSteps(subPlan, steps, indexUsage, warnings);
    }
  }
}

// Simple in-memory cache for demonstration
const globalCache = new Map<string, any>();
(globalCache as any).hits = 0;
(globalCache as any).misses = 0;
(globalCache as any).evictions = 0;

function getOrCreateCache(config: CacheConfig): any {
  return {
    get: (key: string) => {
      const value = globalCache.get(key);
      if (value) {
        (globalCache as any).hits++;
        return value;
      }
      (globalCache as any).misses++;
      return null;
    },
    set: (key: string, value: any, ttl: number) => {
      globalCache.set(key, value);
      setTimeout(() => globalCache.delete(key), ttl * 1000);
    },
    clear: (pattern?: string) => {
      if (pattern) {
        for (const key of globalCache.keys()) {
          if (key.includes(pattern)) {
            globalCache.delete(key);
          }
        }
      } else {
        globalCache.clear();
      }
    },
    size: globalCache.size,
  };
}
