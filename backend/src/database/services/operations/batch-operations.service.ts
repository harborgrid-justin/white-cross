/**
 * @fileoverview Batch Operations Service for Database Operations
 * @module database/services/operations/batch-operations
 * @description Batch processing operations with parallel execution and intelligent throttling
 *
 * @version 1.0.0
 */

import { Logger, InternalServerErrorException } from '@nestjs/common';
import {
  Model,
  ModelCtor,
  WhereOptions,
  Op,
  FindOptions,
  Attributes,
} from 'sequelize';
import { BatchExecutionResult, BatchConfig } from './interfaces';

/**
 * Utility function to limit concurrency of promises
 */
async function limitConcurrency<T>(promises: Promise<T>[], limit: number): Promise<T[]> {
  const results: T[] = [];
  const executing: Promise<void>[] = [];

  for (const promise of promises) {
    const p = promise.then(result => {
      results.push(result);
    });

    executing.push(p);

    if (executing.length >= limit) {
      await Promise.race(executing);
      executing.splice(executing.findIndex(e => e === p), 1);
    }
  }

  await Promise.all(executing);
  return results;
}

/**
 * Delay helper for throttling
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Execute batch queries with parallel processing and intelligent throttling
 */
export async function executeBatchQueries<M extends Model>(
  model: ModelCtor<M>,
  queries: WhereOptions<Attributes<M>>[],
  config: BatchConfig
): Promise<BatchExecutionResult<M>> {
  const logger = new Logger('BatchOperations::executeBatchQueries');
  const startTime = Date.now();

  const result: BatchExecutionResult<M> = {
    success: false,
    totalBatches: Math.ceil(queries.length / config.batchSize),
    successfulBatches: 0,
    failedBatches: 0,
    results: [],
    errors: [],
    executionTimeMs: 0,
    averageBatchTimeMs: 0,
    throughput: 0,
  };

  try {
    const batches: WhereOptions<Attributes<M>>[][] = [];
    for (let i = 0; i < queries.length; i += config.batchSize) {
      batches.push(queries.slice(i, i + config.batchSize));
    }

    const batchTimes: number[] = [];

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      const batchStart = Date.now();

      try {
        const batchPromises = batch.map(where =>
          model.findAll({
            where,
            transaction: config.transaction,
          })
        );

        const batchResults = await Promise.allSettled(
          limitConcurrency(batchPromises, config.maxConcurrency)
        );

        batchResults.forEach((outcome, idx) => {
          if (outcome.status === 'fulfilled') {
            result.results.push(...outcome.value);
          } else {
            result.errors.push({
              batchIndex: batchIndex * config.batchSize + idx,
              error: outcome.reason?.message || 'Unknown error',
            });
          }
        });

        result.successfulBatches++;
        const batchTime = Date.now() - batchStart;
        batchTimes.push(batchTime);

        if (config.delayBetweenBatchesMs && batchIndex < batches.length - 1) {
          await delay(config.delayBetweenBatchesMs);
        }
      } catch (error) {
        result.failedBatches++;
        result.errors.push({
          batchIndex,
          error: (error as Error).message,
        });

        if (config.failFast) {
          throw error;
        }
      }
    }

    result.success = result.successfulBatches > 0;
    result.executionTimeMs = Date.now() - startTime;
    result.averageBatchTimeMs = batchTimes.reduce((a, b) => a + b, 0) / batchTimes.length;
    result.throughput = (result.results.length / result.executionTimeMs) * 1000;

    logger.log(
      `Batch execution complete: ${result.successfulBatches}/${result.totalBatches} batches, ` +
      `${result.results.length} records, ${result.throughput.toFixed(2)} records/sec`
    );

    return result;
  } catch (error) {
    logger.error('Batch query execution failed', error);
    throw new InternalServerErrorException('Batch query execution failed');
  }
}

/**
 * Batch find by primary keys with intelligent chunking
 */
export async function batchFindByPk<M extends Model>(
  model: ModelCtor<M>,
  ids: (string | number)[],
  batchSize: number = 100,
  options?: Omit<FindOptions<Attributes<M>>, 'where'>
): Promise<M[]> {
  const logger = new Logger('BatchOperations::batchFindByPk');

  try {
    const results: M[] = [];
    const batches: (string | number)[][] = [];

    for (let i = 0; i < ids.length; i += batchSize) {
      batches.push(ids.slice(i, i + batchSize));
    }

    for (const batch of batches) {
      const batchResults = await model.findAll({
        where: { id: { [Op.in]: batch } } as WhereOptions<Attributes<M>>,
        ...options,
      });

      results.push(...batchResults);
    }

    logger.log(`Batch found ${results.length}/${ids.length} records in ${batches.length} batches`);
    return results;
  } catch (error) {
    logger.error('Batch find by PK failed', error);
    throw new InternalServerErrorException('Batch find by PK failed');
  }
}

/**
 * Batch create with transaction support and rollback handling
 */
export async function batchCreate<M extends Model>(
  model: ModelCtor<M>,
  records: Partial<Attributes<M>>[],
  config: BatchConfig
): Promise<BatchExecutionResult<M>> {
  const logger = new Logger('BatchOperations::batchCreate');
  const startTime = Date.now();

  const result: BatchExecutionResult<M> = {
    success: false,
    totalBatches: Math.ceil(records.length / config.batchSize),
    successfulBatches: 0,
    failedBatches: 0,
    results: [],
    errors: [],
    executionTimeMs: 0,
    averageBatchTimeMs: 0,
    throughput: 0,
  };

  try {
    const batches: Partial<Attributes<M>>[][] = [];
    for (let i = 0; i < records.length; i += config.batchSize) {
      batches.push(records.slice(i, i + config.batchSize));
    }

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      const batchStart = Date.now();

      try {
        const created = await model.bulkCreate(batch, {
          validate: true,
          transaction: config.transaction,
          returning: true,
        });

        result.results.push(...created);
        result.successfulBatches++;
      } catch (error) {
        result.failedBatches++;
        result.errors.push({
          batchIndex,
          error: (error as Error).message,
        });

        if (config.failFast) {
          throw error;
        }
      }
    }

    result.success = result.successfulBatches > 0;
    result.executionTimeMs = Date.now() - startTime;
    result.throughput = (result.results.length / result.executionTimeMs) * 1000;

    logger.log(`Batch create: ${result.results.length}/${records.length} records created`);
    return result;
  } catch (error) {
    logger.error('Batch create failed', error);
    throw new InternalServerErrorException('Batch create failed');
  }
}

/**
 * Batch update with optimized bulk operations
 */
export async function batchUpdate<M extends Model>(
  model: ModelCtor<M>,
  updates: Array<{ where: WhereOptions<Attributes<M>>; data: Partial<Attributes<M>> }>,
  config: BatchConfig
): Promise<BatchExecutionResult<number>> {
  const logger = new Logger('BatchOperations::batchUpdate');
  const startTime = Date.now();

  const result: BatchExecutionResult<number> = {
    success: false,
    totalBatches: Math.ceil(updates.length / config.batchSize),
    successfulBatches: 0,
    failedBatches: 0,
    results: [],
    errors: [],
    executionTimeMs: 0,
    averageBatchTimeMs: 0,
    throughput: 0,
  };

  try {
    const batches: typeof updates[] = [];
    for (let i = 0; i < updates.length; i += config.batchSize) {
      batches.push(updates.slice(i, i + config.batchSize));
    }

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];

      try {
        const updatePromises = batch.map(async update => {
          const [affectedCount] = await model.update(update.data, {
            where: update.where,
            transaction: config.transaction,
          });
          return affectedCount;
        });

        const affectedCounts = await Promise.all(updatePromises);
        result.results.push(...affectedCounts);
        result.successfulBatches++;
      } catch (error) {
        result.failedBatches++;
        result.errors.push({
          batchIndex,
          error: (error as Error).message,
        });

        if (config.failFast) {
          throw error;
        }
      }
    }

    const totalAffected = result.results.reduce((sum, count) => sum + count, 0);
    result.success = result.successfulBatches > 0;
    result.executionTimeMs = Date.now() - startTime;
    result.throughput = (totalAffected / result.executionTimeMs) * 1000;

    logger.log(`Batch update: ${totalAffected} records updated`);
    return result;
  } catch (error) {
    logger.error('Batch update failed', error);
    throw new InternalServerErrorException('Batch update failed');
  }
}

/**
 * Batch delete with cascade handling
 */
export async function batchDelete<M extends Model>(
  model: ModelCtor<M>,
  whereConditions: WhereOptions<Attributes<M>>[],
  config: BatchConfig
): Promise<BatchExecutionResult<number>> {
  const logger = new Logger('BatchOperations::batchDelete');
  const startTime = Date.now();

  const result: BatchExecutionResult<number> = {
    success: false,
    totalBatches: Math.ceil(whereConditions.length / config.batchSize),
    successfulBatches: 0,
    failedBatches: 0,
    results: [],
    errors: [],
    executionTimeMs: 0,
    averageBatchTimeMs: 0,
    throughput: 0,
  };

  try {
    const batches: WhereOptions<Attributes<M>>[][] = [];
    for (let i = 0; i < whereConditions.length; i += config.batchSize) {
      batches.push(whereConditions.slice(i, i + config.batchSize));
    }

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];

      try {
        const deletePromises = batch.map(async where => {
          const deletedCount = await model.destroy({
            where,
            transaction: config.transaction,
          });
          return deletedCount;
        });

        const deleteCounts = await Promise.all(deletePromises);
        result.results.push(...deleteCounts);
        result.successfulBatches++;
      } catch (error) {
        result.failedBatches++;
        result.errors.push({
          batchIndex,
          error: (error as Error).message,
        });

        if (config.failFast) {
          throw error;
        }
      }
    }

    const totalDeleted = result.results.reduce((sum, count) => sum + count, 0);
    result.success = result.successfulBatches > 0;
    result.executionTimeMs = Date.now() - startTime;
    result.throughput = (totalDeleted / result.executionTimeMs) * 1000;

    logger.log(`Batch delete: ${totalDeleted} records deleted`);
    return result;
  } catch (error) {
    logger.error('Batch delete failed', error);
    throw new InternalServerErrorException('Batch delete failed');
  }
}
