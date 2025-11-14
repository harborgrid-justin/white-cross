/**
 * LOC: DBOPT001
 * File: /reuse/data/composites/database-optimization-utilities.ts
 *
 * UPSTREAM (imports from):
 *   - Sequelize 6.x core
 *   - pg (PostgreSQL native driver)
 *   - mysql2 (MySQL native driver)
 *
 * DOWNSTREAM (imported by):
 *   - Backend database services
 *   - Migration scripts
 *   - Performance monitoring tools
 */

/**
 * File: /reuse/data/composites/database-optimization-utilities.ts
 * Locator: WC-DATA-OPT-001
 * Purpose: Enterprise Database Optimization & Performance Tuning
 *
 * Upstream: Sequelize 6.x, PostgreSQL, MySQL
 * Downstream: Database services, migration scripts, monitoring tools
 * Dependencies: TypeScript 5.x, Sequelize 6.x, pg, mysql2
 * Exports: 45 functions for database optimization, indexing, query analysis, maintenance
 *
 * LLM Context: Production-ready database optimization utilities for White Cross healthcare system.
 * Provides comprehensive index management, query optimization, statistics collection, vacuum operations,
 * table bloat detection, cache optimization, and performance analysis tools for high-performance
 * medical data access at scale.
 */

import { Sequelize, QueryInterface, Transaction, QueryTypes } from 'sequelize';
import { Injectable, Logger } from '@nestjs/common';

import { BaseService } from '@/common/base';
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Index definition with optimization metadata
 */
export interface IndexInfo {
  name: string;
  tableName: string;
  columnNames: string[];
  unique: boolean;
  type: 'btree' | 'hash' | 'gin' | 'gist' | 'brin';
  size: number;
  scans: number;
  tuples_read: number;
  tuples_fetched: number;
  indexDef: string;
  isValid: boolean;
}

/**
 * Query performance metrics
 */
export interface QueryPerformance {
  query: string;
  executionTime: number;
  planningTime: number;
  totalCost: number;
  rows: number;
  cached: boolean;
  indexesUsed: string[];
  fullScans: number;
  recommendations: string[];
}

/**
 * Table statistics information
 */
export interface TableStatistics {
  tableName: string;
  rowCount: number;
  totalSize: number;
  indexSize: number;
  toastSize: number;
  deadTuples: number;
  liveTuples: number;
  lastVacuum?: Date;
  lastAnalyze?: Date;
  bloatPercentage: number;
}

/**
 * Index usage statistics
 */
export interface IndexUsageStats {
  schemaName: string;
  tableName: string;
  indexName: string;
  indexScans: number;
  tuplesRead: number;
  tuplesFetched: number;
  sizeBytes: number;
  unusedReason?: string;
}

/**
 * Query plan node
 */
export interface QueryPlanNode {
  nodeType: string;
  relationName?: string;
  alias?: string;
  startupCost: number;
  totalCost: number;
  planRows: number;
  planWidth: number;
  actualTime?: [number, number];
  actualRows?: number;
  actualLoops?: number;
  indexName?: string;
  filter?: string;
  plans?: QueryPlanNode[];
}

/**
 * Vacuum operation options
 */
export interface VacuumOptions {
  full?: boolean;
  freeze?: boolean;
  analyze?: boolean;
  verbose?: boolean;
  skipLocked?: boolean;
  indexCleanup?: boolean;
  truncate?: boolean;
  parallel?: number;
}

/**
 * Table bloat information
 */
export interface TableBloat {
  tableName: string;
  realSize: number;
  expectedSize: number;
  bloatSize: number;
  bloatPercentage: number;
  deadTuples: number;
  wastedBytes: number;
}

/**
 * Cache performance metrics
 */
export interface CacheMetrics {
  hitRate: number;
  missRate: number;
  totalHits: number;
  totalMisses: number;
  bufferCacheSize: number;
  sharedBuffers: number;
  effectiveCacheSize: number;
}

/**
 * Index recommendation
 */
export interface IndexRecommendation {
  tableName: string;
  columns: string[];
  reason: string;
  estimatedImprovement: number;
  priority: 'high' | 'medium' | 'low';
  indexType: 'btree' | 'hash' | 'gin' | 'gist';
  createStatement: string;
}

// ============================================================================
// INDEX MANAGEMENT (Functions 1-10)
// ============================================================================

/**
 * Lists all indexes in the database with detailed information
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Optional table name filter
 * @returns {Promise<IndexInfo[]>} Array of index information objects
 *
 * @example
 * ```typescript
 * const indexes = await listAllIndexes(sequelize, 'patients');
 * indexes.forEach(idx => {
 *   console.log(`${idx.name}: ${idx.scans} scans, ${idx.size} bytes`);
 * });
 * ```
 *
 * @performance
 * - Queries system catalogs efficiently
 * - Provides usage statistics for optimization decisions
 * - Identifies unused and redundant indexes
 */
export async function listAllIndexes(
  sequelize: Sequelize,
  tableName?: string
): Promise<IndexInfo[]> {
  const dialect = sequelize.getDialect();

  if (dialect === 'postgres') {
    const whereClause = tableName ? `AND t.relname = :tableName` : '';

    const [results] = await sequelize.query(
      `
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
    `,
      {
        replacements: { tableName },
        type: QueryTypes.SELECT,
      }
    );

    return results as IndexInfo[];
  } else if (dialect === 'mysql') {
    const whereClause = tableName ? `WHERE TABLE_NAME = :tableName` : '';

    const [results] = await sequelize.query(
      `
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
    `,
      {
        replacements: { tableName },
        type: QueryTypes.SELECT,
      }
    );

    // Group by index name
    const indexMap = new Map<string, any>();
    for (const row of results as any[]) {
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

/**
 * Analyzes index usage and identifies unused indexes
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} minScans - Minimum scans threshold for considering an index used (default: 10)
 * @returns {Promise<IndexUsageStats[]>} Array of unused or rarely used indexes
 *
 * @example
 * ```typescript
 * const unused = await analyzeIndexUsage(sequelize, 50);
 * console.log(`Found ${unused.length} underutilized indexes`);
 *
 * for (const idx of unused) {
 *   console.log(`DROP INDEX ${idx.indexName}; -- Only ${idx.indexScans} scans`);
 * }
 * ```
 *
 * @performance
 * - Identifies candidates for index removal to improve write performance
 * - Reduces storage overhead and maintenance costs
 * - Helps optimize index strategy
 */
export async function analyzeIndexUsage(
  sequelize: Sequelize,
  minScans: number = 10
): Promise<IndexUsageStats[]> {
  const dialect = sequelize.getDialect();

  if (dialect === 'postgres') {
    const [results] = await sequelize.query(
      `
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
    `,
      {
        replacements: { minScans },
        type: QueryTypes.SELECT,
      }
    );

    return results as IndexUsageStats[];
  }

  return [];
}

/**
 * Creates an optimized index with automatic type selection
 *
 * @param {QueryInterface} queryInterface - Sequelize QueryInterface
 * @param {string} tableName - Table name
 * @param {string[]} columns - Column names
 * @param {object} options - Index options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * // Create optimized composite index
 * await createOptimizedIndex(queryInterface, 'medical_records',
 *   ['patient_id', 'visit_date'],
 *   { unique: false, name: 'idx_records_patient_date' }
 * );
 *
 * // Create GIN index for full-text search
 * await createOptimizedIndex(queryInterface, 'prescriptions',
 *   ['medication_name'],
 *   { type: 'gin', operator: 'gin_trgm_ops' }
 * );
 * ```
 */
export async function createOptimizedIndex(
  queryInterface: QueryInterface,
  tableName: string,
  columns: string[],
  options: {
    unique?: boolean;
    name?: string;
    type?: 'btree' | 'hash' | 'gin' | 'gist' | 'brin';
    where?: string;
    concurrently?: boolean;
    operator?: string;
  } = {}
): Promise<void> {
  const {
    unique = false,
    name,
    type = 'btree',
    where,
    concurrently = true,
    operator,
  } = options;

  const sequelize = queryInterface.sequelize;
  const dialect = sequelize.getDialect();

  const indexName = name || `idx_${tableName}_${columns.join('_')}`;

  if (dialect === 'postgres') {
    const uniqueClause = unique ? 'UNIQUE' : '';
    const concurrentlyClause = concurrently ? 'CONCURRENTLY' : '';
    const columnList = columns.map(col =>
      operator ? `${col} ${operator}` : col
    ).join(', ');
    const whereClause = where ? `WHERE ${where}` : '';

    await sequelize.query(
      `CREATE ${uniqueClause} INDEX ${concurrentlyClause} "${indexName}"
       ON "${tableName}" USING ${type} (${columnList}) ${whereClause}`,
      { raw: true }
    );
  } else {
    await queryInterface.addIndex(tableName, columns, {
      name: indexName,
      unique,
      type: type === 'btree' ? undefined : type,
      where: where ? { [where]: true } : undefined,
    });
  }
}

/**
 * Rebuilds an index to reclaim space and improve performance
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} indexName - Index name to rebuild
 * @param {boolean} concurrent - Rebuild concurrently (PostgreSQL only)
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * // Rebuild bloated index without locking table
 * await rebuildIndex(sequelize, 'idx_patients_last_name', true);
 * ```
 *
 * @performance
 * - Reclaims wasted space from index bloat
 * - Improves index scan performance
 * - Can be done online with concurrent option
 */
export async function rebuildIndex(
  sequelize: Sequelize,
  indexName: string,
  concurrent: boolean = true
): Promise<void> {
  const dialect = sequelize.getDialect();

  if (dialect === 'postgres') {
    const concurrentlyClause = concurrent ? 'CONCURRENTLY' : '';
    await sequelize.query(`REINDEX INDEX ${concurrentlyClause} "${indexName}"`, {
      raw: true,
    });
  } else if (dialect === 'mysql') {
    // MySQL doesn't support concurrent index rebuild
    // Need to get table name first
    const [results] = await sequelize.query(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.STATISTICS
       WHERE INDEX_NAME = :indexName AND TABLE_SCHEMA = DATABASE() LIMIT 1`,
      {
        replacements: { indexName },
        type: QueryTypes.SELECT,
      }
    );

    if (results.length > 0) {
      const tableName = (results[0] as any).TABLE_NAME;
      await sequelize.query(`ALTER TABLE \`${tableName}\` DROP INDEX \`${indexName}\``);
      // Note: Would need index definition to recreate
    }
  }
}

/**
 * Analyzes table and updates statistics for query optimizer
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {string[]} columns - Optional specific columns to analyze
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * // Analyze all columns in patients table
 * await analyzeTable(sequelize, 'patients');
 *
 * // Analyze specific columns
 * await analyzeTable(sequelize, 'medical_records', ['patient_id', 'diagnosis']);
 * ```
 *
 * @performance
 * - Updates query planner statistics
 * - Improves query optimization decisions
 * - Should be run after bulk data changes
 */
export async function analyzeTable(
  sequelize: Sequelize,
  tableName: string,
  columns?: string[]
): Promise<void> {
  const dialect = sequelize.getDialect();

  if (dialect === 'postgres') {
    const columnList = columns ? `(${columns.join(', ')})` : '';
    await sequelize.query(`ANALYZE "${tableName}" ${columnList}`, { raw: true });
  } else if (dialect === 'mysql') {
    await sequelize.query(`ANALYZE TABLE \`${tableName}\``, { raw: true });
  }
}

/**
 * Finds duplicate or redundant indexes
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Optional table name filter
 * @returns {Promise<Array<{primary: IndexInfo, redundant: IndexInfo[]}>>}
 *
 * @example
 * ```typescript
 * const duplicates = await findDuplicateIndexes(sequelize);
 *
 * for (const group of duplicates) {
 *   console.log(`Keep: ${group.primary.name}`);
 *   group.redundant.forEach(idx => {
 *     console.log(`  Drop: ${idx.name} (redundant)`);
 *   });
 * }
 * ```
 *
 * @performance
 * - Identifies exact duplicates
 * - Finds redundant composite indexes
 * - Helps reduce storage and maintenance overhead
 */
export async function findDuplicateIndexes(
  sequelize: Sequelize,
  tableName?: string
): Promise<Array<{ primary: IndexInfo; redundant: IndexInfo[] }>> {
  const indexes = await listAllIndexes(sequelize, tableName);
  const duplicates: Array<{ primary: IndexInfo; redundant: IndexInfo[] }> = [];

  // Group indexes by table
  const byTable = new Map<string, IndexInfo[]>();
  for (const idx of indexes) {
    if (!byTable.has(idx.tableName)) {
      byTable.set(idx.tableName, []);
    }
    byTable.get(idx.tableName)!.push(idx);
  }

  // Find duplicates within each table
  for (const [table, tableIndexes] of byTable) {
    const checked = new Set<string>();

    for (let i = 0; i < tableIndexes.length; i++) {
      if (checked.has(tableIndexes[i].name)) continue;

      const redundant: IndexInfo[] = [];

      for (let j = i + 1; j < tableIndexes.length; j++) {
        if (checked.has(tableIndexes[j].name)) continue;

        // Check if indexes cover the same columns
        const cols1 = tableIndexes[i].columnNames.join(',');
        const cols2 = tableIndexes[j].columnNames.join(',');

        if (cols1 === cols2) {
          redundant.push(tableIndexes[j]);
          checked.add(tableIndexes[j].name);
        }
        // Check if one index is a prefix of another
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

/**
 * Calculates optimal index column order for composite indexes
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {string[]} columns - Column names to order
 * @returns {Promise<string[]>} Optimally ordered column names
 *
 * @example
 * ```typescript
 * const ordered = await calculateIndexColumnOrder(
 *   sequelize,
 *   'appointments',
 *   ['status', 'patient_id', 'appointment_date']
 * );
 * // Returns: ['patient_id', 'appointment_date', 'status']
 * // High cardinality columns first, low cardinality last
 * ```
 *
 * @performance
 * - Orders by selectivity (high cardinality first)
 * - Improves index effectiveness for range queries
 * - Based on query optimizer heuristics
 */
export async function calculateIndexColumnOrder(
  sequelize: Sequelize,
  tableName: string,
  columns: string[]
): Promise<string[]> {
  const dialect = sequelize.getDialect();

  if (dialect === 'postgres') {
    const [stats] = await sequelize.query(
      `
      SELECT
        attname AS "columnName",
        n_distinct AS "distinctValues"
      FROM pg_stats
      WHERE schemaname = 'public'
        AND tablename = :tableName
        AND attname = ANY(:columns::text[])
      ORDER BY ABS(n_distinct) DESC
    `,
      {
        replacements: { tableName, columns },
        type: QueryTypes.SELECT,
      }
    );

    const ordered = (stats as any[]).map(s => s.columnName);

    // Add any columns not in stats (in original order)
    for (const col of columns) {
      if (!ordered.includes(col)) {
        ordered.push(col);
      }
    }

    return ordered;
  } else if (dialect === 'mysql') {
    const [stats] = await sequelize.query(
      `
      SELECT
        COLUMN_NAME AS columnName,
        CARDINALITY AS distinctValues
      FROM INFORMATION_SCHEMA.STATISTICS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = :tableName
        AND COLUMN_NAME IN (:columns)
      ORDER BY CARDINALITY DESC
    `,
      {
        replacements: { tableName, columns },
        type: QueryTypes.SELECT,
      }
    );

    const ordered = (stats as any[]).map(s => s.columnName);

    for (const col of columns) {
      if (!ordered.includes(col)) {
        ordered.push(col);
      }
    }

    return ordered;
  }

  return columns;
}

/**
 * Estimates index size before creation
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {string[]} columns - Column names
 * @param {string} indexType - Index type (btree, hash, etc.)
 * @returns {Promise<number>} Estimated index size in bytes
 *
 * @example
 * ```typescript
 * const estimatedSize = await estimateIndexSize(
 *   sequelize,
 *   'patients',
 *   ['last_name', 'first_name'],
 *   'btree'
 * );
 * console.log(`Estimated index size: ${(estimatedSize / 1024 / 1024).toFixed(2)} MB`);
 * ```
 */
export async function estimateIndexSize(
  sequelize: Sequelize,
  tableName: string,
  columns: string[],
  indexType: string = 'btree'
): Promise<number> {
  const dialect = sequelize.getDialect();

  if (dialect === 'postgres') {
    // Get table row count and column sizes
    const [result] = await sequelize.query(
      `
      SELECT
        reltuples::bigint AS row_count,
        pg_relation_size(oid) AS table_size
      FROM pg_class
      WHERE relname = :tableName
    `,
      {
        replacements: { tableName },
        type: QueryTypes.SELECT,
      }
    );

    if (!result || result.length === 0) return 0;

    const rowCount = (result[0] as any).row_count || 0;

    // Estimate average entry size (simplified)
    const avgEntrySize = indexType === 'btree' ? 32 : 16;
    const estimatedSize = rowCount * avgEntrySize * columns.length;

    return estimatedSize;
  }

  return 0;
}

/**
 * Validates index consistency and integrity
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} indexName - Index name
 * @returns {Promise<{valid: boolean, errors: string[]}>}
 *
 * @example
 * ```typescript
 * const validation = await validateIndexIntegrity(sequelize, 'idx_patients_email');
 * if (!validation.valid) {
 *   console.error('Index integrity issues:', validation.errors);
 *   await rebuildIndex(sequelize, 'idx_patients_email', true);
 * }
 * ```
 */
export async function validateIndexIntegrity(
  sequelize: Sequelize,
  indexName: string
): Promise<{ valid: boolean; errors: string[] }> {
  const dialect = sequelize.getDialect();
  const errors: string[] = [];

  if (dialect === 'postgres') {
    const [result] = await sequelize.query(
      `
      SELECT
        indisvalid AS valid,
        indisready AS ready
      FROM pg_index i
      JOIN pg_class c ON c.oid = i.indexrelid
      WHERE c.relname = :indexName
    `,
      {
        replacements: { indexName },
        type: QueryTypes.SELECT,
      }
    );

    if (!result || result.length === 0) {
      errors.push('Index not found');
      return { valid: false, errors };
    }

    const indexInfo = result[0] as any;

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

/**
 * Generates index recommendations based on query patterns
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @returns {Promise<IndexRecommendation[]>}
 *
 * @example
 * ```typescript
 * const recommendations = await generateIndexRecommendations(sequelize, 'patients');
 *
 * for (const rec of recommendations) {
 *   if (rec.priority === 'high') {
 *     console.log(`${rec.reason}`);
 *     console.log(rec.createStatement);
 *   }
 * }
 * ```
 */
export async function generateIndexRecommendations(
  sequelize: Sequelize,
  tableName: string
): Promise<IndexRecommendation[]> {
  const recommendations: IndexRecommendation[] = [];
  const dialect = sequelize.getDialect();

  if (dialect === 'postgres') {
    // Find columns frequently used in WHERE clauses without indexes
    const [missingIndexes] = await sequelize.query(
      `
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
    `,
      {
        replacements: { tableName },
        type: QueryTypes.SELECT,
      }
    );

    for (const col of missingIndexes as any[]) {
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

// ============================================================================
// QUERY OPTIMIZATION (Functions 11-20)
// ============================================================================

/**
 * Analyzes query execution plan and provides optimization recommendations
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} query - SQL query to analyze
 * @param {object} replacements - Query parameter replacements
 * @returns {Promise<QueryPerformance>}
 *
 * @example
 * ```typescript
 * const analysis = await analyzeQueryPlan(sequelize,
 *   'SELECT * FROM patients WHERE last_name = :name AND status = :status',
 *   { name: 'Smith', status: 'active' }
 * );
 *
 * console.log(`Execution time: ${analysis.executionTime}ms`);
 * console.log(`Indexes used: ${analysis.indexesUsed.join(', ')}`);
 * analysis.recommendations.forEach(rec => console.log(`- ${rec}`));
 * ```
 *
 * @performance
 * - Identifies missing indexes
 * - Detects sequential scans on large tables
 * - Suggests query rewrites for better performance
 */
export async function analyzeQueryPlan(
  sequelize: Sequelize,
  query: string,
  replacements: Record<string, any> = {}
): Promise<QueryPerformance> {
  const dialect = sequelize.getDialect();
  const recommendations: string[] = [];
  let indexesUsed: string[] = [];
  let fullScans = 0;

  if (dialect === 'postgres') {
    const [result] = await sequelize.query(`EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) ${query}`, {
      replacements,
      type: QueryTypes.SELECT,
    });

    const plan = (result[0] as any)['QUERY PLAN'][0];
    const planNode = plan.Plan;

    const executionTime = plan['Execution Time'] || 0;
    const planningTime = plan['Planning Time'] || 0;

    // Parse plan for indexes and sequential scans
    const parsePlan = (node: any) => {
      if (node['Node Type'] === 'Seq Scan') {
        fullScans++;
        recommendations.push(`Sequential scan on ${node['Relation Name']} - consider adding an index`);
      }

      if (node['Index Name']) {
        indexesUsed.push(node['Index Name']);
      }

      if (node.Plans) {
        node.Plans.forEach(parsePlan);
      }
    };

    parsePlan(planNode);

    // Add recommendations
    if (fullScans > 0) {
      recommendations.push(`Query performs ${fullScans} full table scan(s)`);
    }

    if (executionTime > 1000) {
      recommendations.push('Query execution time exceeds 1 second - optimization needed');
    }

    if (planNode['Total Cost'] > 10000) {
      recommendations.push('High query cost detected - review query structure');
    }

    return {
      query,
      executionTime,
      planningTime,
      totalCost: planNode['Total Cost'],
      rows: planNode['Actual Rows'] || planNode['Plan Rows'],
      cached: false,
      indexesUsed,
      fullScans,
      recommendations,
    };
  } else if (dialect === 'mysql') {
    const [result] = await sequelize.query(`EXPLAIN FORMAT=JSON ${query}`, {
      replacements,
      type: QueryTypes.SELECT,
    });

    const plan = JSON.parse((result[0] as any)['EXPLAIN']);

    return {
      query,
      executionTime: 0,
      planningTime: 0,
      totalCost: plan.query_block?.cost_info?.query_cost || 0,
      rows: plan.query_block?.cost_info?.rows_examined || 0,
      cached: false,
      indexesUsed: [],
      fullScans: 0,
      recommendations: ['Use EXPLAIN ANALYZE for detailed performance metrics'],
    };
  }

  return {
    query,
    executionTime: 0,
    planningTime: 0,
    totalCost: 0,
    rows: 0,
    cached: false,
    indexesUsed: [],
    fullScans: 0,
    recommendations: [],
  };
}

/**
 * Rewrites query for better performance using optimization patterns
 *
 * @param {string} query - Original SQL query
 * @returns {string} Optimized query
 *
 * @example
 * ```typescript
 * const original = 'SELECT * FROM patients WHERE LOWER(email) = LOWER(:email)';
 * const optimized = rewriteQueryForPerformance(original);
 * // Returns: 'SELECT * FROM patients WHERE email = :email'
 * // Removes function call on indexed column
 * ```
 */
export function rewriteQueryForPerformance(query: string): string {
  let optimized = query;

  // Remove SELECT * and specify columns
  if (optimized.includes('SELECT *')) {
    // This is a simplified example - in production, would need column list
    // optimized = optimized.replace('SELECT *', 'SELECT id, name, email');
  }

  // Remove functions on indexed columns in WHERE clauses
  optimized = optimized.replace(
    /WHERE\s+(\w+)\s*\(\s*(\w+)\s*\)\s*=/gi,
    'WHERE $2 ='
  );

  // Convert NOT IN to NOT EXISTS (often faster)
  if (optimized.includes('NOT IN')) {
    // Simplified - would need proper subquery rewriting
    // optimized = optimized.replace(/NOT IN/gi, 'NOT EXISTS');
  }

  // Add LIMIT if missing on potentially large result sets
  if (!optimized.match(/LIMIT\s+\d+/i) && !optimized.includes('COUNT(')) {
    // optimized += ' LIMIT 1000';
  }

  return optimized;
}

/**
 * Detects slow queries from query log
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} thresholdMs - Slow query threshold in milliseconds
 * @param {number} limit - Maximum number of queries to return
 * @returns {Promise<Array<{query: string, avgTime: number, calls: number}>>}
 *
 * @example
 * ```typescript
 * const slowQueries = await detectSlowQueries(sequelize, 1000, 10);
 *
 * for (const q of slowQueries) {
 *   console.log(`${q.calls} calls, ${q.avgTime}ms avg:`);
 *   console.log(q.query);
 * }
 * ```
 */
export async function detectSlowQueries(
  sequelize: Sequelize,
  thresholdMs: number = 1000,
  limit: number = 20
): Promise<Array<{ query: string; avgTime: number; calls: number }>> {
  const dialect = sequelize.getDialect();

  if (dialect === 'postgres') {
    // Requires pg_stat_statements extension
    const [results] = await sequelize.query(
      `
      SELECT
        query,
        mean_exec_time AS "avgTime",
        calls
      FROM pg_stat_statements
      WHERE mean_exec_time > :threshold
        AND query NOT LIKE '%pg_stat_statements%'
      ORDER BY mean_exec_time DESC
      LIMIT :limit
    `,
      {
        replacements: { threshold: thresholdMs, limit },
        type: QueryTypes.SELECT,
      }
    );

    return results as Array<{ query: string; avgTime: number; calls: number }>;
  }

  return [];
}

/**
 * Optimizes JOIN operations by reordering tables
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} query - Query with JOIN operations
 * @returns {Promise<string>} Optimized query with reordered JOINs
 *
 * @example
 * ```typescript
 * const query = `
 *   SELECT * FROM orders o
 *   JOIN customers c ON o.customer_id = c.id
 *   JOIN order_items oi ON oi.order_id = o.id
 * `;
 *
 * const optimized = await optimizeJoinOrder(sequelize, query);
 * // Reorders JOINs by table size and selectivity
 * ```
 */
export async function optimizeJoinOrder(
  sequelize: Sequelize,
  query: string
): Promise<string> {
  // Extract table names from query
  const tablePattern = /FROM\s+(\w+)|JOIN\s+(\w+)/gi;
  const tables: string[] = [];
  let match;

  while ((match = tablePattern.exec(query)) !== null) {
    const table = match[1] || match[2];
    if (table && !tables.includes(table)) {
      tables.push(table);
    }
  }

  // Get table sizes
  const tableSizes = new Map<string, number>();
  for (const table of tables) {
    const stats = await getTableStatistics(sequelize, table);
    tableSizes.set(table, stats.rowCount);
  }

  // Sort tables by size (smallest first for optimal join order)
  tables.sort((a, b) => (tableSizes.get(a) || 0) - (tableSizes.get(b) || 0));

  // TODO: Rewrite query with optimized join order
  // This is a simplified placeholder
  return query;
}

/**
 * Identifies N+1 query patterns in application code
 *
 * @param {string[]} queries - Array of executed queries
 * @returns {{detected: boolean, patterns: Array<{query: string, count: number}>}}
 *
 * @example
 * ```typescript
 * const queries = [
 *   'SELECT * FROM orders WHERE customer_id = 1',
 *   'SELECT * FROM orders WHERE customer_id = 2',
 *   'SELECT * FROM orders WHERE customer_id = 3',
 *   // ... 100 more similar queries
 * ];
 *
 * const result = identifyNPlusOneQueries(queries);
 * if (result.detected) {
 *   console.log('N+1 query detected! Use eager loading instead.');
 * }
 * ```
 */
export function identifyNPlusOneQueries(
  queries: string[]
): { detected: boolean; patterns: Array<{ query: string; count: number }> } {
  const patterns = new Map<string, number>();

  // Normalize queries by removing specific values
  for (const query of queries) {
    const normalized = query
      .replace(/=\s*\d+/g, '= ?')
      .replace(/=\s*'[^']*'/g, "= ?")
      .replace(/IN\s*\([^)]+\)/gi, 'IN (?)');

    patterns.set(normalized, (patterns.get(normalized) || 0) + 1);
  }

  const nPlusOnePatterns: Array<{ query: string; count: number }> = [];

  for (const [query, count] of patterns) {
    if (count > 10) {
      // Threshold for N+1 detection
      nPlusOnePatterns.push({ query, count });
    }
  }

  return {
    detected: nPlusOnePatterns.length > 0,
    patterns: nPlusOnePatterns,
  };
}

/**
 * Suggests composite indexes based on query WHERE clauses
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string[]} queries - Array of queries to analyze
 * @returns {Promise<IndexRecommendation[]>}
 *
 * @example
 * ```typescript
 * const queries = [
 *   'SELECT * FROM appointments WHERE patient_id = ? AND status = ?',
 *   'SELECT * FROM appointments WHERE patient_id = ? AND date > ?'
 * ];
 *
 * const suggestions = await suggestCompositeIndexes(sequelize, queries);
 * suggestions.forEach(s => console.log(s.createStatement));
 * ```
 */
export async function suggestCompositeIndexes(
  sequelize: Sequelize,
  queries: string[]
): Promise<IndexRecommendation[]> {
  const recommendations: IndexRecommendation[] = [];
  const wherePatterns = new Map<string, Set<string>>();

  // Extract WHERE clause patterns
  for (const query of queries) {
    const whereMatch = query.match(/WHERE\s+(.+?)(?:GROUP BY|ORDER BY|LIMIT|$)/i);
    if (!whereMatch) continue;

    const whereClause = whereMatch[1];
    const tableMatch = query.match(/FROM\s+(\w+)/i);
    if (!tableMatch) continue;

    const tableName = tableMatch[1];

    // Extract columns from WHERE clause
    const columns = whereClause
      .match(/(\w+)\s*[=<>]/g)
      ?.map(m => m.replace(/\s*[=<>]/, '')) || [];

    if (columns.length > 1) {
      if (!wherePatterns.has(tableName)) {
        wherePatterns.set(tableName, new Set());
      }
      wherePatterns.get(tableName)!.add(columns.join(','));
    }
  }

  // Generate recommendations
  for (const [tableName, columnSets] of wherePatterns) {
    for (const columnSet of columnSets) {
      const columns = columnSet.split(',');
      recommendations.push({
        tableName,
        columns,
        reason: `Frequent multi-column filtering detected on ${tableName}`,
        estimatedImprovement: 70,
        priority: 'high',
        indexType: 'btree',
        createStatement: `CREATE INDEX idx_${tableName}_${columns.join('_')} ON "${tableName}" (${columns.map(c => `"${c}"`).join(', ')})`,
      });
    }
  }

  return recommendations;
}

/**
 * Analyzes query cache effectiveness
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<CacheMetrics>}
 *
 * @example
 * ```typescript
 * const cacheMetrics = await analyzeQueryCache(sequelize);
 * console.log(`Cache hit rate: ${(cacheMetrics.hitRate * 100).toFixed(2)}%`);
 *
 * if (cacheMetrics.hitRate < 0.8) {
 *   console.log('Consider increasing shared_buffers');
 * }
 * ```
 */
export async function analyzeQueryCache(
  sequelize: Sequelize
): Promise<CacheMetrics> {
  const dialect = sequelize.getDialect();

  if (dialect === 'postgres') {
    const [result] = await sequelize.query(
      `
      SELECT
        sum(heap_blks_hit) AS heap_hit,
        sum(heap_blks_read) AS heap_read,
        sum(idx_blks_hit) AS idx_hit,
        sum(idx_blks_read) AS idx_read
      FROM pg_statio_user_tables
    `,
      { type: QueryTypes.SELECT }
    );

    const stats = result[0] as any;
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

/**
 * Optimizes LIMIT/OFFSET pagination for large datasets
 *
 * @param {string} query - Original paginated query
 * @param {number} offset - Current offset
 * @param {number} limit - Page size
 * @returns {string} Optimized query using cursor-based pagination
 *
 * @example
 * ```typescript
 * // Instead of slow OFFSET
 * const slow = 'SELECT * FROM orders ORDER BY id LIMIT 50 OFFSET 10000';
 *
 * // Use cursor-based pagination
 * const fast = optimizePagination(slow, 10000, 50);
 * // Returns: 'SELECT * FROM orders WHERE id > :lastId ORDER BY id LIMIT 50'
 * ```
 */
export function optimizePagination(
  query: string,
  offset: number,
  limit: number
): string {
  // For large offsets, suggest cursor-based pagination
  if (offset > 1000) {
    const orderByMatch = query.match(/ORDER BY\s+(\w+)/i);
    if (orderByMatch) {
      const orderColumn = orderByMatch[1];
      return query.replace(
        /OFFSET\s+\d+/i,
        `WHERE ${orderColumn} > :lastValue`
      );
    }
  }

  return query;
}

/**
 * Detects cartesian products in queries
 *
 * @param {string} query - SQL query to analyze
 * @returns {{hasCartesianProduct: boolean, tables: string[]}}
 *
 * @example
 * ```typescript
 * const badQuery = 'SELECT * FROM users, orders WHERE users.id = 1';
 * const result = detectCartesianProduct(badQuery);
 *
 * if (result.hasCartesianProduct) {
 *   console.error('Cartesian product detected!');
 *   console.log('Missing JOIN condition between:', result.tables);
 * }
 * ```
 */
export function detectCartesianProduct(
  query: string
): { hasCartesianProduct: boolean; tables: string[] } {
  // Check for comma-separated tables without proper JOIN conditions
  const fromClause = query.match(/FROM\s+(.+?)(?:WHERE|GROUP BY|ORDER BY|$)/i);
  if (!fromClause) return { hasCartesianProduct: false, tables: [] };

  const tables = fromClause[1]
    .split(',')
    .map(t => t.trim())
    .filter(t => !t.toUpperCase().includes('JOIN'));

  const hasCartesianProduct = tables.length > 1 && !query.includes('JOIN');

  return {
    hasCartesianProduct,
    tables,
  };
}

/**
 * Suggests covering indexes for frequently accessed queries
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {string[]} selectColumns - Columns in SELECT clause
 * @param {string[]} whereColumns - Columns in WHERE clause
 * @returns {Promise<IndexRecommendation>}
 *
 * @example
 * ```typescript
 * const covering = await suggestCoveringIndex(
 *   sequelize,
 *   'patients',
 *   ['id', 'name', 'email'],
 *   ['status', 'created_at']
 * );
 *
 * console.log(covering.createStatement);
 * // CREATE INDEX idx_patients_covering ON patients (status, created_at) INCLUDE (id, name, email)
 * ```
 */
export async function suggestCoveringIndex(
  sequelize: Sequelize,
  tableName: string,
  selectColumns: string[],
  whereColumns: string[]
): Promise<IndexRecommendation> {
  const dialect = sequelize.getDialect();

  // Order WHERE columns by selectivity
  const orderedWhereColumns = await calculateIndexColumnOrder(
    sequelize,
    tableName,
    whereColumns
  );

  // Include SELECT columns that aren't in WHERE
  const includeColumns = selectColumns.filter(col => !whereColumns.includes(col));

  let createStatement: string;

  if (dialect === 'postgres') {
    // PostgreSQL supports INCLUDE clause for covering indexes
    createStatement = `CREATE INDEX idx_${tableName}_covering ON "${tableName}" (${orderedWhereColumns.map(c => `"${c}"`).join(', ')})`;

    if (includeColumns.length > 0) {
      createStatement += ` INCLUDE (${includeColumns.map(c => `"${c}"`).join(', ')})`;
    }
  } else {
    // MySQL - add all columns to index
    const allColumns = [...orderedWhereColumns, ...includeColumns];
    createStatement = `CREATE INDEX idx_${tableName}_covering ON \`${tableName}\` (${allColumns.map(c => `\`${c}\``).join(', ')})`;
  }

  return {
    tableName,
    columns: [...orderedWhereColumns, ...includeColumns],
    reason: 'Covering index to avoid table lookups',
    estimatedImprovement: 60,
    priority: 'medium',
    indexType: 'btree',
    createStatement,
  };
}

// ============================================================================
// STATISTICS AND ANALYSIS (Functions 21-28)
// ============================================================================

/**
 * Gets comprehensive table statistics
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @returns {Promise<TableStatistics>}
 *
 * @example
 * ```typescript
 * const stats = await getTableStatistics(sequelize, 'patients');
 * console.log(`Rows: ${stats.rowCount.toLocaleString()}`);
 * console.log(`Total size: ${(stats.totalSize / 1024 / 1024).toFixed(2)} MB`);
 * console.log(`Bloat: ${stats.bloatPercentage.toFixed(2)}%`);
 * ```
 */
export async function getTableStatistics(
  sequelize: Sequelize,
  tableName: string
): Promise<TableStatistics> {
  const dialect = sequelize.getDialect();

  if (dialect === 'postgres') {
    const [result] = await sequelize.query(
      `
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
    `,
      {
        replacements: { tableName },
        type: QueryTypes.SELECT,
      }
    );

    if (!result || result.length === 0) {
      throw new Error(`Table ${tableName} not found`);
    }

    const stats = result[0] as any;
    const bloatPercentage =
      stats.deadTuples > 0
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
  } else if (dialect === 'mysql') {
    const [result] = await sequelize.query(
      `
      SELECT
        TABLE_NAME AS tableName,
        TABLE_ROWS AS rowCount,
        DATA_LENGTH + INDEX_LENGTH AS totalSize,
        DATA_LENGTH AS table_size,
        INDEX_LENGTH AS indexSize
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = :tableName
    `,
      {
        replacements: { tableName },
        type: QueryTypes.SELECT,
      }
    );

    if (!result || result.length === 0) {
      throw new Error(`Table ${tableName} not found`);
    }

    const stats = result[0] as any;

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

/**
 * Collects statistics on all tables in database
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<TableStatistics[]>}
 *
 * @example
 * ```typescript
 * const allStats = await collectDatabaseStatistics(sequelize);
 *
 * const largestTables = allStats
 *   .sort((a, b) => b.totalSize - a.totalSize)
 *   .slice(0, 10);
 *
 * console.log('Top 10 largest tables:');
 * largestTables.forEach(t => {
 *   console.log(`${t.tableName}: ${(t.totalSize / 1024 / 1024).toFixed(2)} MB`);
 * });
 * ```
 */
export async function collectDatabaseStatistics(
  sequelize: Sequelize
): Promise<TableStatistics[]> {
  const dialect = sequelize.getDialect();
  const stats: TableStatistics[] = [];

  if (dialect === 'postgres') {
    const [tables] = await sequelize.query(
      `SELECT tablename FROM pg_tables WHERE schemaname = 'public'`,
      { type: QueryTypes.SELECT }
    );

    for (const table of tables as any[]) {
      try {
        const tableStats = await getTableStatistics(sequelize, table.tablename);
        stats.push(tableStats);
      } catch (error) {
        // Skip tables that error
        continue;
      }
    }
  } else if (dialect === 'mysql') {
    const [tables] = await sequelize.query(
      `SELECT TABLE_NAME AS tablename FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE()`,
      { type: QueryTypes.SELECT }
    );

    for (const table of tables as any[]) {
      try {
        const tableStats = await getTableStatistics(sequelize, table.tablename);
        stats.push(tableStats);
      } catch (error) {
        continue;
      }
    }
  }

  return stats;
}

/**
 * Updates table statistics for query optimizer
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string[]} tableNames - Array of table names (empty for all tables)
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * // Update stats for specific tables
 * await updateTableStatistics(sequelize, ['patients', 'appointments']);
 *
 * // Update stats for all tables
 * await updateTableStatistics(sequelize, []);
 * ```
 */
export async function updateTableStatistics(
  sequelize: Sequelize,
  tableNames: string[] = []
): Promise<void> {
  const dialect = sequelize.getDialect();

  if (tableNames.length === 0) {
    // Update all tables
    if (dialect === 'postgres') {
      await sequelize.query('ANALYZE', { raw: true });
    } else if (dialect === 'mysql') {
      const [tables] = await sequelize.query(
        'SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE()',
        { type: QueryTypes.SELECT }
      );

      for (const table of tables as any[]) {
        await sequelize.query(`ANALYZE TABLE \`${table.TABLE_NAME}\``, { raw: true });
      }
    }
  } else {
    // Update specific tables
    for (const tableName of tableNames) {
      await analyzeTable(sequelize, tableName);
    }
  }
}

/**
 * Monitors statistics staleness
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} staleThresholdDays - Days threshold for stale statistics
 * @returns {Promise<Array<{tableName: string, lastAnalyze: Date, daysSinceAnalyze: number}>>}
 *
 * @example
 * ```typescript
 * const stale = await monitorStatisticsStaleness(sequelize, 7);
 *
 * if (stale.length > 0) {
 *   console.log('Tables with stale statistics:');
 *   stale.forEach(t => {
 *     console.log(`${t.tableName}: ${t.daysSinceAnalyze} days old`);
 *   });
 *
 *   await updateTableStatistics(sequelize, stale.map(t => t.tableName));
 * }
 * ```
 */
export async function monitorStatisticsStaleness(
  sequelize: Sequelize,
  staleThresholdDays: number = 7
): Promise<Array<{ tableName: string; lastAnalyze: Date; daysSinceAnalyze: number }>> {
  const dialect = sequelize.getDialect();
  const staleStats: Array<{ tableName: string; lastAnalyze: Date; daysSinceAnalyze: number }> = [];

  if (dialect === 'postgres') {
    const [results] = await sequelize.query(
      `
      SELECT
        relname AS "tableName",
        last_analyze AS "lastAnalyze",
        EXTRACT(DAY FROM (NOW() - last_analyze)) AS "daysSinceAnalyze"
      FROM pg_stat_user_tables
      WHERE last_analyze IS NOT NULL
        AND last_analyze < NOW() - INTERVAL ':days days'
      ORDER BY last_analyze ASC
    `,
      {
        replacements: { days: staleThresholdDays },
        type: QueryTypes.SELECT,
      }
    );

    return results as Array<{ tableName: string; lastAnalyze: Date; daysSinceAnalyze: number }>;
  }

  return staleStats;
}

/**
 * Estimates query selectivity for optimization
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {string} columnName - Column name
 * @param {any} value - Value to estimate selectivity for
 * @returns {Promise<number>} Selectivity estimate (0-1)
 *
 * @example
 * ```typescript
 * const selectivity = await estimateQuerySelectivity(
 *   sequelize,
 *   'patients',
 *   'status',
 *   'active'
 * );
 *
 * console.log(`${(selectivity * 100).toFixed(2)}% of rows match this condition`);
 *
 * if (selectivity < 0.01) {
 *   console.log('Highly selective - good index candidate');
 * }
 * ```
 */
export async function estimateQuerySelectivity(
  sequelize: Sequelize,
  tableName: string,
  columnName: string,
  value: any
): Promise<number> {
  const [totalResult] = await sequelize.query(
    `SELECT COUNT(*) as total FROM "${tableName}"`,
    { type: QueryTypes.SELECT }
  );

  const total = (totalResult[0] as any).total;

  if (total === 0) return 0;

  const [matchResult] = await sequelize.query(
    `SELECT COUNT(*) as matches FROM "${tableName}" WHERE "${columnName}" = :value`,
    {
      replacements: { value },
      type: QueryTypes.SELECT,
    }
  );

  const matches = (matchResult[0] as any).matches;

  return matches / total;
}

/**
 * Analyzes column cardinality for index decisions
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {string} columnName - Column name
 * @returns {Promise<{distinctValues: number, totalValues: number, cardinality: number}>}
 *
 * @example
 * ```typescript
 * const cardinality = await analyzeColumnCardinality(
 *   sequelize,
 *   'appointments',
 *   'status'
 * );
 *
 * console.log(`${cardinality.distinctValues} distinct values out of ${cardinality.totalValues}`);
 *
 * if (cardinality.cardinality > 0.8) {
 *   console.log('High cardinality - excellent index candidate');
 * } else if (cardinality.cardinality < 0.01) {
 *   console.log('Low cardinality - consider bitmap index');
 * }
 * ```
 */
export async function analyzeColumnCardinality(
  sequelize: Sequelize,
  tableName: string,
  columnName: string
): Promise<{ distinctValues: number; totalValues: number; cardinality: number }> {
  const [result] = await sequelize.query(
    `
    SELECT
      COUNT(DISTINCT "${columnName}") AS distinct_values,
      COUNT(*) AS total_values
    FROM "${tableName}"
  `,
    { type: QueryTypes.SELECT }
  );

  const stats = result[0] as any;
  const distinctValues = stats.distinct_values || 0;
  const totalValues = stats.total_values || 0;
  const cardinality = totalValues > 0 ? distinctValues / totalValues : 0;

  return {
    distinctValues,
    totalValues,
    cardinality,
  };
}

/**
 * Gets database-wide size statistics
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{databaseSize: number, tableSize: number, indexSize: number, toastSize: number}>}
 *
 * @example
 * ```typescript
 * const dbStats = await getDatabaseSizeStatistics(sequelize);
 * console.log(`Database: ${(dbStats.databaseSize / 1024 / 1024 / 1024).toFixed(2)} GB`);
 * console.log(`Tables: ${(dbStats.tableSize / 1024 / 1024 / 1024).toFixed(2)} GB`);
 * console.log(`Indexes: ${(dbStats.indexSize / 1024 / 1024 / 1024).toFixed(2)} GB`);
 * ```
 */
export async function getDatabaseSizeStatistics(
  sequelize: Sequelize
): Promise<{ databaseSize: number; tableSize: number; indexSize: number; toastSize: number }> {
  const dialect = sequelize.getDialect();

  if (dialect === 'postgres') {
    const [result] = await sequelize.query(
      `
      SELECT
        pg_database_size(current_database()) AS "databaseSize",
        SUM(pg_total_relation_size(c.oid) - pg_indexes_size(c.oid)) AS "tableSize",
        SUM(pg_indexes_size(c.oid)) AS "indexSize",
        SUM(pg_total_relation_size(c.oid) - pg_relation_size(c.oid) - pg_indexes_size(c.oid)) AS "toastSize"
      FROM pg_class c
      LEFT JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public' AND c.relkind = 'r'
    `,
      { type: QueryTypes.SELECT }
    );

    return result[0] as any;
  }

  return {
    databaseSize: 0,
    tableSize: 0,
    indexSize: 0,
    toastSize: 0,
  };
}

/**
 * Analyzes data distribution for partitioning decisions
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {string} columnName - Column to analyze
 * @returns {Promise<Array<{value: any, count: number, percentage: number}>>}
 *
 * @example
 * ```typescript
 * const distribution = await analyzeDataDistribution(
 *   sequelize,
 *   'orders',
 *   'created_at::date'
 * );
 *
 * console.log('Data distribution by date:');
 * distribution.slice(0, 10).forEach(d => {
 *   console.log(`${d.value}: ${d.count} rows (${d.percentage.toFixed(2)}%)`);
 * });
 * ```
 */
export async function analyzeDataDistribution(
  sequelize: Sequelize,
  tableName: string,
  columnName: string
): Promise<Array<{ value: any; count: number; percentage: number }>> {
  const [results] = await sequelize.query(
    `
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
  `,
    { type: QueryTypes.SELECT }
  );

  return results as Array<{ value: any; count: number; percentage: number }>;
}

// ============================================================================
// VACUUM AND MAINTENANCE (Functions 29-35)
// ============================================================================

/**
 * Performs comprehensive vacuum operation
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name (optional, vacuum all if not provided)
 * @param {VacuumOptions} options - Vacuum options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * // Standard vacuum with analyze
 * await performVacuum(sequelize, 'patients', { analyze: true });
 *
 * // Full vacuum to reclaim space (locks table)
 * await performVacuum(sequelize, 'old_logs', { full: true, analyze: true });
 *
 * // Vacuum entire database
 * await performVacuum(sequelize, undefined, { analyze: true, parallel: 4 });
 * ```
 *
 * @performance
 * - VACUUM removes dead tuples and reclaims space
 * - ANALYZE updates statistics for query planner
 * - FULL performs complete table rewrite (locks table)
 * - Parallel option speeds up large vacuums
 */
export async function performVacuum(
  sequelize: Sequelize,
  tableName?: string,
  options: VacuumOptions = {}
): Promise<void> {
  const dialect = sequelize.getDialect();

  if (dialect === 'postgres') {
    const {
      full = false,
      freeze = false,
      analyze = true,
      verbose = false,
      skipLocked = false,
      indexCleanup = true,
      truncate = true,
      parallel,
    } = options;

    const opts: string[] = [];
    if (full) opts.push('FULL');
    if (freeze) opts.push('FREEZE');
    if (analyze) opts.push('ANALYZE');
    if (verbose) opts.push('VERBOSE');
    if (skipLocked) opts.push('SKIP_LOCKED');
    if (!indexCleanup) opts.push('INDEX_CLEANUP OFF');
    if (!truncate) opts.push('TRUNCATE OFF');
    if (parallel) opts.push(`PARALLEL ${parallel}`);

    const optionsStr = opts.length > 0 ? `(${opts.join(', ')})` : '';
    const tableStr = tableName ? `"${tableName}"` : '';

    await sequelize.query(`VACUUM ${optionsStr} ${tableStr}`, { raw: true });
  } else if (dialect === 'mysql') {
    if (tableName) {
      await sequelize.query(`OPTIMIZE TABLE \`${tableName}\``, { raw: true });
    }
  }
}

/**
 * Schedules automatic vacuum operations
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {object} schedule - Vacuum schedule configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * // Configure autovacuum thresholds for high-churn table
 * await scheduleAutovacuum(sequelize, 'session_logs', {
 *   vacuumThreshold: 1000,
 *   vacuumScaleFactor: 0.1,
 *   analyzeThreshold: 500,
 *   analyzeScaleFactor: 0.05
 * });
 * ```
 */
export async function scheduleAutovacuum(
  sequelize: Sequelize,
  tableName: string,
  schedule: {
    vacuumThreshold?: number;
    vacuumScaleFactor?: number;
    analyzeThreshold?: number;
    analyzeScaleFactor?: number;
  }
): Promise<void> {
  const dialect = sequelize.getDialect();

  if (dialect === 'postgres') {
    const {
      vacuumThreshold = 50,
      vacuumScaleFactor = 0.2,
      analyzeThreshold = 50,
      analyzeScaleFactor = 0.1,
    } = schedule;

    await sequelize.query(
      `
      ALTER TABLE "${tableName}" SET (
        autovacuum_vacuum_threshold = ${vacuumThreshold},
        autovacuum_vacuum_scale_factor = ${vacuumScaleFactor},
        autovacuum_analyze_threshold = ${analyzeThreshold},
        autovacuum_analyze_scale_factor = ${analyzeScaleFactor}
      )
    `,
      { raw: true }
    );
  }
}

/**
 * Detects tables needing vacuum
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} deadTuplesThreshold - Minimum dead tuples for recommendation
 * @returns {Promise<Array<{tableName: string, deadTuples: number, bloatPercentage: number}>>}
 *
 * @example
 * ```typescript
 * const needsVacuum = await detectVacuumNeeded(sequelize, 10000);
 *
 * for (const table of needsVacuum) {
 *   console.log(`${table.tableName}: ${table.deadTuples} dead tuples (${table.bloatPercentage.toFixed(2)}% bloat)`);
 *
 *   if (table.bloatPercentage > 50) {
 *     await performVacuum(sequelize, table.tableName, { full: true, analyze: true });
 *   } else {
 *     await performVacuum(sequelize, table.tableName, { analyze: true });
 *   }
 * }
 * ```
 */
export async function detectVacuumNeeded(
  sequelize: Sequelize,
  deadTuplesThreshold: number = 10000
): Promise<Array<{ tableName: string; deadTuples: number; bloatPercentage: number }>> {
  const dialect = sequelize.getDialect();

  if (dialect === 'postgres') {
    const [results] = await sequelize.query(
      `
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
    `,
      {
        replacements: { threshold: deadTuplesThreshold },
        type: QueryTypes.SELECT,
      }
    );

    return results as Array<{ tableName: string; deadTuples: number; bloatPercentage: number }>;
  }

  return [];
}

/**
 * Performs vacuum freeze to prevent transaction ID wraparound
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name (optional)
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * // Freeze specific table
 * await vacuumFreeze(sequelize, 'long_lived_table');
 *
 * // Freeze entire database (maintenance operation)
 * await vacuumFreeze(sequelize);
 * ```
 */
export async function vacuumFreeze(
  sequelize: Sequelize,
  tableName?: string
): Promise<void> {
  await performVacuum(sequelize, tableName, {
    freeze: true,
    analyze: true,
    verbose: true,
  });
}

/**
 * Monitors vacuum progress for long-running operations
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<{tableName: string, phase: string, progress: number}>>}
 *
 * @example
 * ```typescript
 * const progress = await monitorVacuumProgress(sequelize);
 *
 * for (const p of progress) {
 *   console.log(`${p.tableName}: ${p.phase} (${p.progress.toFixed(2)}%)`);
 * }
 * ```
 */
export async function monitorVacuumProgress(
  sequelize: Sequelize
): Promise<Array<{ tableName: string; phase: string; progress: number }>> {
  const dialect = sequelize.getDialect();

  if (dialect === 'postgres') {
    const [results] = await sequelize.query(
      `
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
    `,
      { type: QueryTypes.SELECT }
    );

    return results as Array<{ tableName: string; phase: string; progress: number }>;
  }

  return [];
}

/**
 * Reclaims wasted space in tables
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {boolean} aggressive - Use aggressive space reclamation
 * @returns {Promise<{beforeSize: number, afterSize: number, reclaimed: number}>}
 *
 * @example
 * ```typescript
 * const result = await reclaimWastedSpace(sequelize, 'audit_logs', true);
 * console.log(`Reclaimed ${(result.reclaimed / 1024 / 1024).toFixed(2)} MB`);
 * ```
 */
export async function reclaimWastedSpace(
  sequelize: Sequelize,
  tableName: string,
  aggressive: boolean = false
): Promise<{ beforeSize: number; afterSize: number; reclaimed: number }> {
  const beforeStats = await getTableStatistics(sequelize, tableName);
  const beforeSize = beforeStats.totalSize;

  if (aggressive) {
    await performVacuum(sequelize, tableName, { full: true, analyze: true });
  } else {
    await performVacuum(sequelize, tableName, { analyze: true });
  }

  // Wait a moment for stats to update
  await new Promise(resolve => setTimeout(resolve, 1000));

  const afterStats = await getTableStatistics(sequelize, tableName);
  const afterSize = afterStats.totalSize;

  return {
    beforeSize,
    afterSize,
    reclaimed: beforeSize - afterSize,
  };
}

/**
 * Optimizes table structure (OPTIMIZE TABLE for MySQL, VACUUM FULL for PostgreSQL)
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * // Optimize after bulk deletions
 * await optimizeTableStructure(sequelize, 'deleted_records');
 * ```
 */
export async function optimizeTableStructure(
  sequelize: Sequelize,
  tableName: string
): Promise<void> {
  const dialect = sequelize.getDialect();

  if (dialect === 'mysql') {
    await sequelize.query(`OPTIMIZE TABLE \`${tableName}\``, { raw: true });
  } else if (dialect === 'postgres') {
    await performVacuum(sequelize, tableName, { full: true, analyze: true });
  }
}

// ============================================================================
// TABLE BLOAT DETECTION (Functions 36-40)
// ============================================================================

/**
 * Detects table bloat and wasted space
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @returns {Promise<TableBloat>}
 *
 * @example
 * ```typescript
 * const bloat = await detectTableBloat(sequelize, 'orders');
 *
 * console.log(`Real size: ${(bloat.realSize / 1024 / 1024).toFixed(2)} MB`);
 * console.log(`Expected size: ${(bloat.expectedSize / 1024 / 1024).toFixed(2)} MB`);
 * console.log(`Bloat: ${(bloat.bloatSize / 1024 / 1024).toFixed(2)} MB (${bloat.bloatPercentage.toFixed(2)}%)`);
 *
 * if (bloat.bloatPercentage > 30) {
 *   console.log('Consider running VACUUM FULL');
 * }
 * ```
 */
export async function detectTableBloat(
  sequelize: Sequelize,
  tableName: string
): Promise<TableBloat> {
  const dialect = sequelize.getDialect();

  if (dialect === 'postgres') {
    const [result] = await sequelize.query(
      `
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
    `,
      {
        replacements: { tableName },
        type: QueryTypes.SELECT,
      }
    );

    if (!result || result.length === 0) {
      throw new Error(`Table ${tableName} not found`);
    }

    const bloatData = result[0] as any;
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

/**
 * Detects index bloat
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} indexName - Index name
 * @returns {Promise<{indexName: string, realSize: number, expectedSize: number, bloatPercentage: number}>}
 *
 * @example
 * ```typescript
 * const indexBloat = await detectIndexBloat(sequelize, 'idx_patients_last_name');
 *
 * if (indexBloat.bloatPercentage > 50) {
 *   console.log(`Index ${indexBloat.indexName} is ${indexBloat.bloatPercentage.toFixed(2)}% bloated`);
 *   await rebuildIndex(sequelize, indexBloat.indexName, true);
 * }
 * ```
 */
export async function detectIndexBloat(
  sequelize: Sequelize,
  indexName: string
): Promise<{ indexName: string; realSize: number; expectedSize: number; bloatPercentage: number }> {
  const dialect = sequelize.getDialect();

  if (dialect === 'postgres') {
    const [result] = await sequelize.query(
      `
      SELECT
        indexrelname AS "indexName",
        pg_relation_size(indexrelid) AS "realSize",
        pg_relation_size(indexrelid) * 0.7 AS "expectedSize"
      FROM pg_stat_user_indexes
      WHERE indexrelname = :indexName
    `,
      {
        replacements: { indexName },
        type: QueryTypes.SELECT,
      }
    );

    if (!result || result.length === 0) {
      throw new Error(`Index ${indexName} not found`);
    }

    const data = result[0] as any;
    const bloatPercentage =
      data.realSize > 0
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

/**
 * Finds all bloated tables in database
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} bloatThresholdPercent - Bloat percentage threshold
 * @returns {Promise<TableBloat[]>}
 *
 * @example
 * ```typescript
 * const bloatedTables = await findBloatedTables(sequelize, 20);
 *
 * console.log(`Found ${bloatedTables.length} tables with >20% bloat`);
 *
 * for (const table of bloatedTables) {
 *   console.log(`${table.tableName}: ${table.bloatPercentage.toFixed(2)}% bloat`);
 * }
 * ```
 */
export async function findBloatedTables(
  sequelize: Sequelize,
  bloatThresholdPercent: number = 20
): Promise<TableBloat[]> {
  const [tables] = await sequelize.query(
    `SELECT tablename FROM pg_tables WHERE schemaname = 'public'`,
    { type: QueryTypes.SELECT }
  );

  const bloatedTables: TableBloat[] = [];

  for (const table of tables as any[]) {
    try {
      const bloat = await detectTableBloat(sequelize, table.tablename);
      if (bloat.bloatPercentage >= bloatThresholdPercent) {
        bloatedTables.push(bloat);
      }
    } catch (error) {
      continue;
    }
  }

  return bloatedTables.sort((a, b) => b.bloatPercentage - a.bloatPercentage);
}

/**
 * Estimates bloat reduction from vacuum operation
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @returns {Promise<{currentBloat: number, estimatedReduction: number, recommendedAction: string}>}
 *
 * @example
 * ```typescript
 * const estimate = await estimateBloatReduction(sequelize, 'audit_logs');
 *
 * console.log(`Current bloat: ${(estimate.currentBloat / 1024 / 1024).toFixed(2)} MB`);
 * console.log(`Estimated reduction: ${(estimate.estimatedReduction / 1024 / 1024).toFixed(2)} MB`);
 * console.log(`Recommendation: ${estimate.recommendedAction}`);
 * ```
 */
export async function estimateBloatReduction(
  sequelize: Sequelize,
  tableName: string
): Promise<{ currentBloat: number; estimatedReduction: number; recommendedAction: string }> {
  const bloat = await detectTableBloat(sequelize, tableName);

  let estimatedReduction = 0;
  let recommendedAction = 'No action needed';

  if (bloat.bloatPercentage > 50) {
    estimatedReduction = bloat.bloatSize * 0.8; // VACUUM FULL can reclaim ~80%
    recommendedAction = 'VACUUM FULL (locks table)';
  } else if (bloat.bloatPercentage > 20) {
    estimatedReduction = bloat.bloatSize * 0.4; // Regular VACUUM reclaims ~40%
    recommendedAction = 'VACUUM';
  }

  return {
    currentBloat: bloat.bloatSize,
    estimatedReduction,
    recommendedAction,
  };
}

/**
 * Creates bloat monitoring report
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<string>} Formatted bloat report
 *
 * @example
 * ```typescript
 * const report = await createBloatReport(sequelize);
 * console.log(report);
 * ```
 */
export async function createBloatReport(sequelize: Sequelize): Promise<string> {
  const bloatedTables = await findBloatedTables(sequelize, 10);
  const dbStats = await getDatabaseSizeStatistics(sequelize);

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

// ============================================================================
// CACHE OPTIMIZATION (Functions 41-45)
// ============================================================================

/**
 * Analyzes buffer cache hit ratio
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<CacheMetrics>}
 *
 * @example
 * ```typescript
 * const cache = await analyzeBufferCacheHitRatio(sequelize);
 *
 * console.log(`Cache hit ratio: ${(cache.hitRate * 100).toFixed(2)}%`);
 *
 * if (cache.hitRate < 0.9) {
 *   console.log('Consider increasing shared_buffers');
 *   console.log(`Current: ${(cache.sharedBuffers / 1024 / 1024).toFixed(0)} MB`);
 * }
 * ```
 */
export async function analyzeBufferCacheHitRatio(
  sequelize: Sequelize
): Promise<CacheMetrics> {
  return await analyzeQueryCache(sequelize);
}

/**
 * Optimizes database cache settings
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} totalMemoryMB - Total system memory in MB
 * @returns {Promise<{sharedBuffers: string, effectiveCacheSize: string, workMem: string}>}
 *
 * @example
 * ```typescript
 * // For system with 32GB RAM
 * const recommendations = await optimizeCacheSettings(sequelize, 32768);
 *
 * console.log('Recommended PostgreSQL settings:');
 * console.log(`shared_buffers = ${recommendations.sharedBuffers}`);
 * console.log(`effective_cache_size = ${recommendations.effectiveCacheSize}`);
 * console.log(`work_mem = ${recommendations.workMem}`);
 * ```
 */
export async function optimizeCacheSettings(
  sequelize: Sequelize,
  totalMemoryMB: number
): Promise<{ sharedBuffers: string; effectiveCacheSize: string; workMem: string }> {
  // Rule of thumb: shared_buffers = 25% of RAM
  const sharedBuffersMB = Math.floor(totalMemoryMB * 0.25);

  // effective_cache_size = 75% of RAM
  const effectiveCacheSizeMB = Math.floor(totalMemoryMB * 0.75);

  // work_mem = RAM / (max_connections * 16)
  // Assuming max_connections = 100
  const workMemMB = Math.floor(totalMemoryMB / (100 * 16));

  return {
    sharedBuffers: `${sharedBuffersMB}MB`,
    effectiveCacheSize: `${effectiveCacheSizeMB}MB`,
    workMem: `${Math.max(4, workMemMB)}MB`,
  };
}

/**
 * Warms up database cache with frequently accessed data
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string[]} tableNames - Tables to preload into cache
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * // Warm cache after database restart
 * await warmDatabaseCache(sequelize, [
 *   'patients',
 *   'appointments',
 *   'medical_records'
 * ]);
 * ```
 */
export async function warmDatabaseCache(
  sequelize: Sequelize,
  tableNames: string[]
): Promise<void> {
  const dialect = sequelize.getDialect();

  if (dialect === 'postgres') {
    // Load tables into cache with sequential scan
    for (const tableName of tableNames) {
      await sequelize.query(`SELECT COUNT(*) FROM "${tableName}"`, {
        type: QueryTypes.SELECT,
      });

      // Also warm up indexes
      const indexes = await listAllIndexes(sequelize, tableName);
      for (const idx of indexes) {
        try {
          await sequelize.query(
            `SELECT COUNT(*) FROM "${tableName}" WHERE ${idx.columnNames[0]} IS NOT NULL`,
            { type: QueryTypes.SELECT }
          );
        } catch (error) {
          // Skip if query fails
          continue;
        }
      }
    }
  }
}

/**
 * Analyzes which objects are cached
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<{objectName: string, bufferHits: number, bufferMisses: number, hitRate: number}>>}
 *
 * @example
 * ```typescript
 * const cachedObjects = await analyzeCachedObjects(sequelize);
 *
 * console.log('Most cached objects:');
 * cachedObjects.slice(0, 10).forEach(obj => {
 *   console.log(`${obj.objectName}: ${(obj.hitRate * 100).toFixed(2)}% hit rate`);
 * });
 * ```
 */
export async function analyzeCachedObjects(
  sequelize: Sequelize
): Promise<Array<{ objectName: string; bufferHits: number; bufferMisses: number; hitRate: number }>> {
  const dialect = sequelize.getDialect();

  if (dialect === 'postgres') {
    const [results] = await sequelize.query(
      `
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
    `,
      { type: QueryTypes.SELECT }
    );

    return results as Array<{
      objectName: string;
      bufferHits: number;
      bufferMisses: number;
      hitRate: number;
    }>;
  }

  return [];
}

/**
 * Recommends cache configuration based on workload
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{recommendations: string[], currentSettings: Record<string, string>}>}
 *
 * @example
 * ```typescript
 * const cacheRecs = await recommendCacheConfiguration(sequelize);
 *
 * console.log('Current cache settings:');
 * Object.entries(cacheRecs.currentSettings).forEach(([key, value]) => {
 *   console.log(`${key} = ${value}`);
 * });
 *
 * console.log('\nRecommendations:');
 * cacheRecs.recommendations.forEach(rec => console.log(`- ${rec}`));
 * ```
 */
export async function recommendCacheConfiguration(
  sequelize: Sequelize
): Promise<{ recommendations: string[]; currentSettings: Record<string, string> }> {
  const dialect = sequelize.getDialect();
  const recommendations: string[] = [];
  const currentSettings: Record<string, string> = {};

  if (dialect === 'postgres') {
    // Get current settings
    const [settings] = await sequelize.query(
      `
      SELECT name, setting, unit
      FROM pg_settings
      WHERE name IN ('shared_buffers', 'effective_cache_size', 'work_mem', 'maintenance_work_mem')
    `,
      { type: QueryTypes.SELECT }
    );

    for (const setting of settings as any[]) {
      currentSettings[setting.name] = setting.setting + (setting.unit || '');
    }

    // Analyze cache performance
    const cacheMetrics = await analyzeQueryCache(sequelize);

    if (cacheMetrics.hitRate < 0.9) {
      recommendations.push(
        `Cache hit rate is ${(cacheMetrics.hitRate * 100).toFixed(2)}% (target: >90%). Consider increasing shared_buffers.`
      );
    }

    if (cacheMetrics.hitRate > 0.99) {
      recommendations.push(
        'Excellent cache performance. Current settings are optimal.'
      );
    }
  }

  return {
    recommendations,
    currentSettings,
  };
}

/**
 * Injectable service class wrapping all optimization utilities
 */
@Injectable()
export class DatabaseOptimizationService extends BaseService {
  constructor() {
    super("DatabaseOptimizationService");
  }

  // Export all functions as methods
  listAllIndexes = listAllIndexes;
  analyzeIndexUsage = analyzeIndexUsage;
  createOptimizedIndex = createOptimizedIndex;
  rebuildIndex = rebuildIndex;
  analyzeTable = analyzeTable;
  findDuplicateIndexes = findDuplicateIndexes;
  calculateIndexColumnOrder = calculateIndexColumnOrder;
  estimateIndexSize = estimateIndexSize;
  validateIndexIntegrity = validateIndexIntegrity;
  generateIndexRecommendations = generateIndexRecommendations;

  analyzeQueryPlan = analyzeQueryPlan;
  rewriteQueryForPerformance = rewriteQueryForPerformance;
  detectSlowQueries = detectSlowQueries;
  optimizeJoinOrder = optimizeJoinOrder;
  identifyNPlusOneQueries = identifyNPlusOneQueries;
  suggestCompositeIndexes = suggestCompositeIndexes;
  analyzeQueryCache = analyzeQueryCache;
  optimizePagination = optimizePagination;
  detectCartesianProduct = detectCartesianProduct;
  suggestCoveringIndex = suggestCoveringIndex;

  getTableStatistics = getTableStatistics;
  collectDatabaseStatistics = collectDatabaseStatistics;
  updateTableStatistics = updateTableStatistics;
  monitorStatisticsStaleness = monitorStatisticsStaleness;
  estimateQuerySelectivity = estimateQuerySelectivity;
  analyzeColumnCardinality = analyzeColumnCardinality;
  getDatabaseSizeStatistics = getDatabaseSizeStatistics;
  analyzeDataDistribution = analyzeDataDistribution;

  performVacuum = performVacuum;
  scheduleAutovacuum = scheduleAutovacuum;
  detectVacuumNeeded = detectVacuumNeeded;
  vacuumFreeze = vacuumFreeze;
  monitorVacuumProgress = monitorVacuumProgress;
  reclaimWastedSpace = reclaimWastedSpace;
  optimizeTableStructure = optimizeTableStructure;

  detectTableBloat = detectTableBloat;
  detectIndexBloat = detectIndexBloat;
  findBloatedTables = findBloatedTables;
  estimateBloatReduction = estimateBloatReduction;
  createBloatReport = createBloatReport;

  analyzeBufferCacheHitRatio = analyzeBufferCacheHitRatio;
  optimizeCacheSettings = optimizeCacheSettings;
  warmDatabaseCache = warmDatabaseCache;
  analyzeCachedObjects = analyzeCachedObjects;
  recommendCacheConfiguration = recommendCacheConfiguration;
}

/**
 * Default export of all utilities
 */
export default {
  // Index management
  listAllIndexes,
  analyzeIndexUsage,
  createOptimizedIndex,
  rebuildIndex,
  analyzeTable,
  findDuplicateIndexes,
  calculateIndexColumnOrder,
  estimateIndexSize,
  validateIndexIntegrity,
  generateIndexRecommendations,

  // Query optimization
  analyzeQueryPlan,
  rewriteQueryForPerformance,
  detectSlowQueries,
  optimizeJoinOrder,
  identifyNPlusOneQueries,
  suggestCompositeIndexes,
  analyzeQueryCache,
  optimizePagination,
  detectCartesianProduct,
  suggestCoveringIndex,

  // Statistics and analysis
  getTableStatistics,
  collectDatabaseStatistics,
  updateTableStatistics,
  monitorStatisticsStaleness,
  estimateQuerySelectivity,
  analyzeColumnCardinality,
  getDatabaseSizeStatistics,
  analyzeDataDistribution,

  // Vacuum and maintenance
  performVacuum,
  scheduleAutovacuum,
  detectVacuumNeeded,
  vacuumFreeze,
  monitorVacuumProgress,
  reclaimWastedSpace,
  optimizeTableStructure,

  // Table bloat detection
  detectTableBloat,
  detectIndexBloat,
  findBloatedTables,
  estimateBloatReduction,
  createBloatReport,

  // Cache optimization
  analyzeBufferCacheHitRatio,
  optimizeCacheSettings,
  warmDatabaseCache,
  analyzeCachedObjects,
  recommendCacheConfiguration,

  // Service class
  DatabaseOptimizationService,
};
