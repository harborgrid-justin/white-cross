/**
 * @fileoverview Shared Database Cache Analysis Utilities
 * @module databa@/services/optimization/shared
 * @description Common cache analysis functions shared between optimization services
 *
 * @version 1.0.0
 */

import { Sequelize, QueryTypes } from 'sequelize';

export interface CacheMetrics {
  hitRate: number;
  missRate: number;
  totalHits: number;
  totalMisses: number;
  bufferCacheSize: number;
  sharedBuffers?: number;
  effectiveCacheSize?: number;
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
  sequelize: Sequelize,
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
      { type: QueryTypes.SELECT },
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

  if (dialect === 'mysql' || dialect === 'mariadb') {
    const [result] = await sequelize.query(
      `
      SHOW GLOBAL STATUS WHERE Variable_name IN (
        'Innodb_buffer_pool_read_requests',
        'Innodb_buffer_pool_reads'
      )
    `,
      { type: QueryTypes.SELECT },
    );

    const stats = result as Array<{ Variable_name: string; Value: string }>;
    const readRequests = parseInt(
      stats.find((s) => s.Variable_name === 'Innodb_buffer_pool_read_requests')?.Value || '0',
      10,
    );
    const reads = parseInt(
      stats.find((s) => s.Variable_name === 'Innodb_buffer_pool_reads')?.Value || '0',
      10,
    );

    const totalHits = readRequests - reads;
    const totalMisses = reads;
    const total = readRequests;

    return {
      hitRate: total > 0 ? totalHits / total : 0,
      missRate: total > 0 ? totalMisses / total : 0,
      totalHits,
      totalMisses,
      bufferCacheSize: 0,
    };
  }

  // Default fallback for unsupported dialects
  return {
    hitRate: 0,
    missRate: 0,
    totalHits: 0,
    totalMisses: 0,
    bufferCacheSize: 0,
  };
}