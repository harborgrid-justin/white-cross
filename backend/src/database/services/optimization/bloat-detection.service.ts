/**
 * Bloat Detection Service
 * 
 * Extracted from database-optimization-utilities.service.ts (Functions 36-40)
 * Handles table and index bloat detection and analysis
 */

import { Sequelize, QueryTypes } from 'sequelize';
import { TableBloat } from './types';
import { getDatabaseSizeStatistics } from './statistics-analysis.service';

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

    const bloatData = result[0] as Record<string, unknown>;
    const realSize = (bloatData.real_size as number) || 0;
    const expectedSize = (bloatData.expected_size as number) || 0;
    const bloatSize = Math.max(0, realSize - expectedSize);
    const bloatPercentage = realSize > 0 ? (bloatSize / realSize) * 100 : 0;

    return {
      tableName,
      realSize,
      expectedSize,
      bloatSize,
      bloatPercentage,
      deadTuples: (bloatData.dead_tuples as number) || 0,
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

    const data = result[0] as Record<string, unknown>;
    const bloatPercentage =
      (data.realSize as number) > 0
        ? (((data.realSize as number) - (data.expectedSize as number)) / (data.realSize as number)) * 100
        : 0;

    return {
      indexName: data.indexName as string,
      realSize: data.realSize as number,
      expectedSize: data.expectedSize as number,
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

  for (const table of tables as Record<string, unknown>[]) {
    try {
      const bloat = await detectTableBloat(sequelize, table.tablename as string);
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
