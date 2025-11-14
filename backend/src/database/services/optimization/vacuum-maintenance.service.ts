/**
 * Vacuum and Maintenance Service
 * 
 * Extracted from database-optimization-utilities.service.ts (Functions 29-35)
 * Handles vacuum operations, maintenance scheduling, and space reclamation
 */

import { Sequelize, QueryTypes } from 'sequelize';
import { VacuumOptions, TableStatistics } from './types';
import { getTableStatistics } from './statistics-analysis.service';

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
