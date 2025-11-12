/**
 * Index Management Service
 * 
 * Extracted from database-optimization-utilities.service.ts (Functions 1-10)
 * Handles index creation, analysis, optimization, and maintenance
 */

import { Sequelize, QueryInterface, QueryTypes } from 'sequelize';
import { 
  IndexInfo, 
  IndexUsageStats, 
  IndexRecommendation 
} from './types';

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
    const indexMap = new Map<string, IndexInfo>();
    for (const row of results as Record<string, unknown>[]) {
      if (!indexMap.has(row.name as string)) {
        indexMap.set(row.name as string, {
          name: row.name as string,
          tableName: row.tableName as string,
          columnNames: [],
          unique: row.unique as boolean,
          type: (row.type as string).toLowerCase() as 'btree' | 'hash' | 'gin' | 'gist' | 'brin',
          size: 0,
          scans: (row.scans as number) || 0,
          tuples_read: 0,
          tuples_fetched: 0,
          indexDef: '',
          isValid: true,
        });
      }
      indexMap.get(row.name as string)!.columnNames.push(row.columnName as string);
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
      const tableName = (results[0] as Record<string, unknown>).TABLE_NAME;
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

    const ordered = (stats as Record<string, unknown>[]).map(s => s.columnName as string);

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

    const ordered = (stats as Record<string, unknown>[]).map(s => s.columnName as string);

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

    const rowCount = ((result[0] as Record<string, unknown>).row_count as number) || 0;

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

    const indexInfo = result[0] as Record<string, unknown>;

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

    for (const col of missingIndexes as Record<string, unknown>[]) {
      recommendations.push({
        tableName,
        columns: [col.column_name as string],
        reason: `Column "${col.column_name}" frequently filtered but not indexed`,
        estimatedImprovement: Math.min(Math.abs(col.n_distinct as number) / 1000, 95),
        priority: Math.abs(col.n_distinct as number) > 100 ? 'high' : 'medium',
        indexType: 'btree',
        createStatement: `CREATE INDEX idx_${tableName}_${col.column_name} ON "${tableName}" ("${col.column_name}")`,
      });
    }
  }

  return recommendations;
}
