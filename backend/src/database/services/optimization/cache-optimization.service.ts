/**
 * Cache Optimization Service
 * 
 * Extracted from database-optimization-utilities.service.ts (Functions 41-45)
 * Handles database cache analysis, optimization, and configuration
 */

import { Sequelize, QueryTypes } from 'sequelize';
import { CacheMetrics } from './types';
import { listAllIndexes } from './index-management.service';

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

    const stats = result[0] as Record<string, unknown>;
    const totalHits = ((stats.heap_hit as number) || 0) + ((stats.idx_hit as number) || 0);
    const totalMisses = ((stats.heap_read as number) || 0) + ((stats.idx_read as number) || 0);
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

    for (const setting of settings as Record<string, unknown>[]) {
      currentSettings[setting.name as string] = (setting.setting as string) + ((setting.unit as string) || '');
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
