/**
 * Statistics and Analysis Service
 * 
 * Extracted from database-optimization-utilities.service.ts (Functions 21-28)
 * Handles table statistics, cardinality analysis, and query selectivity
 */

import { Sequelize, QueryTypes } from 'sequelize';
import { TableStatistics } from './types';

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

    const stats = result[0] as Record<string, unknown>;
    const bloatPercentage =
      (stats.deadTuples as number) > 0
        ? ((stats.deadTuples as number) / ((stats.liveTuples as number) + (stats.deadTuples as number))) * 100
        : 0;

    return {
      tableName: stats.tableName as string,
      rowCount: (stats.liveTuples as number) || 0,
      totalSize: (stats.totalSize as number) || 0,
      indexSize: (stats.indexSize as number) || 0,
      toastSize: (stats.toastSize as number) || 0,
      deadTuples: (stats.deadTuples as number) || 0,
      liveTuples: (stats.liveTuples as number) || 0,
      lastVacuum: stats.lastVacuum as Date,
      lastAnalyze: stats.lastAnalyze as Date,
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

    const stats = result[0] as Record<string, unknown>;

    return {
      tableName: stats.tableName as string,
      rowCount: (stats.rowCount as number) || 0,
      totalSize: (stats.totalSize as number) || 0,
      indexSize: (stats.indexSize as number) || 0,
      toastSize: 0,
      deadTuples: 0,
      liveTuples: (stats.rowCount as number) || 0,
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

    for (const table of tables as Record<string, unknown>[]) {
      try {
        const tableStats = await getTableStatistics(sequelize, table.tablename as string);
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

    for (const table of tables as Record<string, unknown>[]) {
      try {
        const tableStats = await getTableStatistics(sequelize, table.tablename as string);
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

      for (const table of tables as Record<string, unknown>[]) {
        await sequelize.query(`ANALYZE TABLE \`${table.TABLE_NAME}\``, { raw: true });
      }
    }
  } else {
    // Update specific tables
    for (const tableName of tableNames) {
      if (dialect === 'postgres') {
        await sequelize.query(`ANALYZE "${tableName}"`, { raw: true });
      } else if (dialect === 'mysql') {
        await sequelize.query(`ANALYZE TABLE \`${tableName}\``, { raw: true });
      }
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
        AND last_analyze < NOW() - INTERVAL '${staleThresholdDays} days'
      ORDER BY last_analyze ASC
    `,
      {
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
 * @param {unknown} value - Value to estimate selectivity for
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
  value: unknown
): Promise<number> {
  const [totalResult] = await sequelize.query(
    `SELECT COUNT(*) as total FROM "${tableName}"`,
    { type: QueryTypes.SELECT }
  );

  const total = (totalResult[0] as Record<string, unknown>).total as number;

  if (total === 0) return 0;

  const [matchResult] = await sequelize.query(
    `SELECT COUNT(*) as matches FROM "${tableName}" WHERE "${columnName}" = :value`,
    {
      replacements: { value },
      type: QueryTypes.SELECT,
    }
  );

  const matches = (matchResult[0] as Record<string, unknown>).matches as number;

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

  const stats = result[0] as Record<string, unknown>;
  const distinctValues = (stats.distinct_values as number) || 0;
  const totalValues = (stats.total_values as number) || 0;
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

    return result[0] as { databaseSize: number; tableSize: number; indexSize: number; toastSize: number };
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
 * @returns {Promise<Array<{value: unknown, count: number, percentage: number}>>}
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
): Promise<Array<{ value: unknown; count: number; percentage: number }>> {
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

  return results as Array<{ value: unknown; count: number; percentage: number }>;
}
