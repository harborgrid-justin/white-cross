/**
 * @fileoverview Advanced Batch Query Operations for Sequelize + NestJS
 * @module reuse/data/composites/advanced-batch-queries
 * @description Production-ready batch query operations with parallel execution,
 * query pooling, result aggregation, and enterprise-grade performance optimization.
 * Exceeds Informatica capabilities with intelligent batching and resource management.
 *
 * @version 1.0.0
 * @requires sequelize ^6.x
 * @requires @nestjs/common ^10.x
 */

import { Logger, InternalServerErrorException } from '@nestjs/common';
import {
  Sequelize,
  Model,
  ModelCtor,
  FindOptions,
  WhereOptions,
  Op,
  Transaction,
  QueryTypes,
  Attributes,
  literal,
  fn,
  col,
} from 'sequelize';

/**
 * Batch execution result with comprehensive metrics
 */
export interface BatchExecutionResult<T = any> {
  success: boolean;
  totalBatches: number;
  successfulBatches: number;
  failedBatches: number;
  results: T[];
  errors: Array<{ batchIndex: number; error: string }>;
  executionTimeMs: number;
  averageBatchTimeMs: number;
  throughput: number; // Records per second
}

/**
 * Batch configuration for optimized execution
 */
export interface BatchConfig {
  batchSize: number;
  maxConcurrency: number;
  delayBetweenBatchesMs?: number;
  failFast?: boolean;
  retryFailedBatches?: number;
  transaction?: Transaction;
}

/**
 * Query pool configuration for connection reuse
 */
export interface QueryPoolConfig {
  poolName: string;
  maxPoolSize: number;
  minPoolSize: number;
  acquireTimeoutMs: number;
  idleTimeoutMs: number;
  evictionIntervalMs: number;
}

/**
 * Parallel query execution result
 */
export interface ParallelQueryResult<T = any> {
  queryId: string;
  success: boolean;
  result: T[] | null;
  error: string | null;
  executionTimeMs: number;
}

/**
 * Execute batch queries with parallel processing and intelligent throttling
 *
 * @param model - Sequelize model to query
 * @param queries - Array of where conditions for batch execution
 * @param config - Batch execution configuration
 * @returns Batch execution result with comprehensive metrics
 * @throws InternalServerErrorException if batch execution fails critically
 *
 * @example
 * ```typescript
 * const result = await executeBatchQueries(
 *   User,
 *   [
 *     { status: 'active', role: 'admin' },
 *     { status: 'active', role: 'user' },
 *     { status: 'pending' }
 *   ],
 *   {
 *     batchSize: 10,
 *     maxConcurrency: 5,
 *     delayBetweenBatchesMs: 100,
 *     failFast: false
 *   }
 * );
 * console.log(`Processed ${result.throughput} records/sec`);
 * ```
 */
export async function executeBatchQueries<M extends Model>(
  model: ModelCtor<M>,
  queries: WhereOptions<any>[],
  config: BatchConfig
): Promise<BatchExecutionResult<M>> {
  const logger = new Logger('BatchQueries::executeBatchQueries');
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
    const batches: WhereOptions<any>[][] = [];
    for (let i = 0; i < queries.length; i += config.batchSize) {
      batches.push(queries.slice(i, i + config.batchSize));
    }

    const batchTimes: number[] = [];

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      const batchStart = Date.now();

      try {
        // Execute queries in batch with concurrency control
        const batchPromises = batch.map(where =>
          model.findAll({
            where,
            transaction: config.transaction,
          })
        );

        // Process with concurrency limit
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

        // Delay between batches if configured
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
 * Execute queries in parallel with controlled concurrency
 *
 * @param model - Sequelize model
 * @param queries - Array of query configurations
 * @param maxConcurrency - Maximum concurrent queries
 * @returns Array of parallel query results
 *
 * @example
 * ```typescript
 * const results = await executeParallelQueries(
 *   Patient,
 *   [
 *     { id: 'q1', where: { status: 'active' } },
 *     { id: 'q2', where: { lastVisit: { [Op.gte]: yesterday } } }
 *   ],
 *   10
 * );
 * ```
 */
export async function executeParallelQueries<M extends Model>(
  model: ModelCtor<M>,
  queries: Array<{ id: string; where: WhereOptions<any>; options?: FindOptions<Attributes<M>> }>,
  maxConcurrency: number = 10
): Promise<ParallelQueryResult<M>[]> {
  const logger = new Logger('BatchQueries::executeParallelQueries');

  try {
    const results: ParallelQueryResult<M>[] = [];

    // Process queries in chunks based on concurrency
    const chunks: typeof queries[] = [];
    for (let i = 0; i < queries.length; i += maxConcurrency) {
      chunks.push(queries.slice(i, i + maxConcurrency));
    }

    for (const chunk of chunks) {
      const chunkResults = await Promise.allSettled(
        chunk.map(async query => {
          const startTime = Date.now();
          try {
            const result = await model.findAll({
              where: query.where,
              ...query.options,
            });

            return {
              queryId: query.id,
              success: true,
              result,
              error: null,
              executionTimeMs: Date.now() - startTime,
            };
          } catch (error) {
            return {
              queryId: query.id,
              success: false,
              result: null,
              error: (error as Error).message,
              executionTimeMs: Date.now() - startTime,
            };
          }
        })
      );

      chunkResults.forEach(outcome => {
        if (outcome.status === 'fulfilled') {
          results.push(outcome.value);
        }
      });
    }

    logger.log(`Executed ${queries.length} parallel queries in ${results.length} batches`);
    return results;
  } catch (error) {
    logger.error('Parallel query execution failed', error);
    throw new InternalServerErrorException('Parallel query execution failed');
  }
}

/**
 * Batch find by primary keys with intelligent chunking
 *
 * @param model - Sequelize model
 * @param ids - Array of primary key IDs
 * @param batchSize - Number of IDs per batch
 * @param options - Additional find options
 * @returns Array of found records
 *
 * @example
 * ```typescript
 * const users = await batchFindByPk(User, userIds, 100, {
 *   include: [{ model: Profile }]
 * });
 * ```
 */
export async function batchFindByPk<M extends Model>(
  model: ModelCtor<M>,
  ids: string[],
  batchSize: number = 100,
  options?: Omit<FindOptions<Attributes<M>>, 'where'>
): Promise<M[]> {
  const logger = new Logger('BatchQueries::batchFindByPk');

  try {
    const results: M[] = [];
    const batches: string[][] = [];

    for (let i = 0; i < ids.length; i += batchSize) {
      batches.push(ids.slice(i, i + batchSize));
    }

    for (const batch of batches) {
      const batchResults = await model.findAll({
        where: { id: { [Op.in]: batch } } as any,
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
 *
 * @param model - Sequelize model
 * @param records - Array of records to create
 * @param config - Batch configuration
 * @returns Batch execution result
 *
 * @example
 * ```typescript
 * const result = await batchCreate(
 *   MedicalRecord,
 *   records,
 *   { batchSize: 50, maxConcurrency: 5, transaction: t }
 * );
 * ```
 */
export async function batchCreate<M extends Model>(
  model: ModelCtor<M>,
  records: any[],
  config: BatchConfig
): Promise<BatchExecutionResult<M>> {
  const logger = new Logger('BatchQueries::batchCreate');
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
    const batches: any[][] = [];
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
 *
 * @param model - Sequelize model
 * @param updates - Array of {where, data} update operations
 * @param config - Batch configuration
 * @returns Batch execution result
 *
 * @example
 * ```typescript
 * const result = await batchUpdate(
 *   Appointment,
 *   [
 *     { where: { status: 'pending' }, data: { status: 'confirmed' } },
 *     { where: { date: oldDate }, data: { date: newDate } }
 *   ],
 *   { batchSize: 10, maxConcurrency: 3 }
 * );
 * ```
 */
export async function batchUpdate<M extends Model>(
  model: ModelCtor<M>,
  updates: Array<{ where: WhereOptions<any>; data: Partial<any> }>,
  config: BatchConfig
): Promise<BatchExecutionResult<number>> {
  const logger = new Logger('BatchQueries::batchUpdate');
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
 *
 * @param model - Sequelize model
 * @param whereConditions - Array of where conditions for deletion
 * @param config - Batch configuration
 * @returns Batch execution result with deletion counts
 *
 * @example
 * ```typescript
 * const result = await batchDelete(
 *   TempFile,
 *   [
 *     { createdAt: { [Op.lt]: yesterday } },
 *     { status: 'expired' }
 *   ],
 *   { batchSize: 50, transaction: t }
 * );
 * ```
 */
export async function batchDelete<M extends Model>(
  model: ModelCtor<M>,
  whereConditions: WhereOptions<any>[],
  config: BatchConfig
): Promise<BatchExecutionResult<number>> {
  const logger = new Logger('BatchQueries::batchDelete');
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
    const batches: WhereOptions<any>[][] = [];
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

/**
 * Execute batch upserts with conflict resolution
 *
 * @param model - Sequelize model
 * @param records - Array of records to upsert
 * @param conflictFields - Fields that define uniqueness
 * @param config - Batch configuration
 * @returns Batch execution result
 *
 * @example
 * ```typescript
 * const result = await batchUpsert(
 *   Patient,
 *   patientRecords,
 *   ['medicalRecordNumber'],
 *   { batchSize: 100, maxConcurrency: 5 }
 * );
 * ```
 */
export async function batchUpsert<M extends Model>(
  model: ModelCtor<M>,
  records: any[],
  conflictFields: string[],
  config: BatchConfig
): Promise<BatchExecutionResult<M>> {
  const logger = new Logger('BatchQueries::batchUpsert');
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
    const batches: any[][] = [];
    for (let i = 0; i < records.length; i += config.batchSize) {
      batches.push(records.slice(i, i + config.batchSize));
    }

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];

      try {
        const upserted = await model.bulkCreate(batch, {
          updateOnDuplicate: conflictFields,
          transaction: config.transaction,
          returning: true,
        });

        result.results.push(...upserted);
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

    logger.log(`Batch upsert: ${result.results.length} records upserted`);
    return result;
  } catch (error) {
    logger.error('Batch upsert failed', error);
    throw new InternalServerErrorException('Batch upsert failed');
  }
}

/**
 * Batch aggregate queries with result consolidation
 *
 * @param model - Sequelize model
 * @param aggregations - Array of aggregation configurations
 * @param config - Batch configuration
 * @returns Aggregated results
 *
 * @example
 * ```typescript
 * const results = await batchAggregate(
 *   Order,
 *   [
 *     { field: 'amount', function: 'SUM', where: { status: 'completed' } },
 *     { field: 'id', function: 'COUNT', where: { status: 'pending' } }
 *   ],
 *   { maxConcurrency: 5 }
 * );
 * ```
 */
export async function batchAggregate<M extends Model>(
  model: ModelCtor<M>,
  aggregations: Array<{
    field: string;
    function: 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX';
    where?: WhereOptions<any>;
    alias: string;
  }>,
  config: Partial<BatchConfig>
): Promise<Record<string, any>> {
  const logger = new Logger('BatchQueries::batchAggregate');

  try {
    const maxConcurrency = config.maxConcurrency || 10;
    const chunks: typeof aggregations[] = [];

    for (let i = 0; i < aggregations.length; i += maxConcurrency) {
      chunks.push(aggregations.slice(i, i + maxConcurrency));
    }

    const results: Record<string, any> = {};

    for (const chunk of chunks) {
      const chunkResults = await Promise.all(
        chunk.map(async agg => {
          const aggregateFn = fn(agg.function, col(agg.field));

          const result = await model.findOne({
            attributes: [[aggregateFn, 'value']],
            where: agg.where,
            transaction: config.transaction,
            raw: true,
          } as any);

          return { alias: agg.alias, value: result ? (result as any).value : null };
        })
      );

      chunkResults.forEach(({ alias, value }) => {
        results[alias] = value;
      });
    }

    logger.log(`Batch aggregate: ${aggregations.length} aggregations completed`);
    return results;
  } catch (error) {
    logger.error('Batch aggregate failed', error);
    throw new InternalServerErrorException('Batch aggregate failed');
  }
}

/**
 * Execute batch count queries
 *
 * @param model - Sequelize model
 * @param whereConditions - Array of where conditions to count
 * @param config - Batch configuration
 * @returns Array of count results
 *
 * @example
 * ```typescript
 * const counts = await batchCount(
 *   Appointment,
 *   [
 *     { status: 'scheduled' },
 *     { status: 'completed' },
 *     { status: 'cancelled' }
 *   ],
 *   { maxConcurrency: 5 }
 * );
 * ```
 */
export async function batchCount<M extends Model>(
  model: ModelCtor<M>,
  whereConditions: WhereOptions<any>[],
  config: Partial<BatchConfig>
): Promise<number[]> {
  const logger = new Logger('BatchQueries::batchCount');

  try {
    const maxConcurrency = config.maxConcurrency || 10;
    const chunks: WhereOptions<any>[][] = [];

    for (let i = 0; i < whereConditions.length; i += maxConcurrency) {
      chunks.push(whereConditions.slice(i, i + maxConcurrency));
    }

    const results: number[] = [];

    for (const chunk of chunks) {
      const counts = await Promise.all(
        chunk.map(where =>
          model.count({
            where,
            transaction: config.transaction,
          } as any)
        )
      );

      results.push(...counts);
    }

    logger.log(`Batch count: ${whereConditions.length} count queries completed`);
    return results;
  } catch (error) {
    logger.error('Batch count failed', error);
    throw new InternalServerErrorException('Batch count failed');
  }
}

/**
 * Batch exists checks for efficient record validation
 *
 * @param model - Sequelize model
 * @param whereConditions - Array of conditions to check existence
 * @param config - Batch configuration
 * @returns Array of boolean existence results
 *
 * @example
 * ```typescript
 * const existsResults = await batchExists(
 *   User,
 *   [
 *     { email: 'user1@example.com' },
 *     { email: 'user2@example.com' }
 *   ],
 *   { maxConcurrency: 10 }
 * );
 * ```
 */
export async function batchExists<M extends Model>(
  model: ModelCtor<M>,
  whereConditions: WhereOptions<any>[],
  config: Partial<BatchConfig>
): Promise<boolean[]> {
  const logger = new Logger('BatchQueries::batchExists');

  try {
    const counts = await batchCount(model, whereConditions, config);
    return counts.map(count => count > 0);
  } catch (error) {
    logger.error('Batch exists check failed', error);
    throw new InternalServerErrorException('Batch exists check failed');
  }
}

/**
 * Execute batch raw queries with parameterization
 *
 * @param sequelize - Sequelize instance
 * @param queries - Array of SQL queries with replacements
 * @param config - Batch configuration
 * @returns Array of query results
 *
 * @example
 * ```typescript
 * const results = await batchRawQuery(
 *   sequelize,
 *   [
 *     { sql: 'SELECT * FROM users WHERE id = :id', replacements: { id: 1 } },
 *     { sql: 'SELECT * FROM posts WHERE author_id = :id', replacements: { id: 1 } }
 *   ],
 *   { maxConcurrency: 5 }
 * );
 * ```
 */
export async function batchRawQuery(
  sequelize: Sequelize,
  queries: Array<{ sql: string; replacements?: Record<string, any>; type?: QueryTypes }>,
  config: Partial<BatchConfig>
): Promise<any[][]> {
  const logger = new Logger('BatchQueries::batchRawQuery');

  try {
    const maxConcurrency = config.maxConcurrency || 10;
    const chunks: typeof queries[] = [];

    for (let i = 0; i < queries.length; i += maxConcurrency) {
      chunks.push(queries.slice(i, i + maxConcurrency));
    }

    const results: any[][] = [];

    for (const chunk of chunks) {
      const chunkResults = await Promise.all(
        chunk.map(query =>
          sequelize.query(query.sql, {
            replacements: query.replacements,
            type: query.type || QueryTypes.SELECT,
            transaction: config.transaction,
          })
        )
      );

      results.push(...chunkResults.map(r => (Array.isArray(r) ? r : [r])));
    }

    logger.log(`Batch raw query: ${queries.length} queries executed`);
    return results;
  } catch (error) {
    logger.error('Batch raw query failed', error);
    throw new InternalServerErrorException('Batch raw query failed');
  }
}

/**
 * Batch increment operations with atomic updates
 *
 * @param model - Sequelize model
 * @param increments - Array of increment operations
 * @param config - Batch configuration
 * @returns Array of affected counts
 *
 * @example
 * ```typescript
 * const results = await batchIncrement(
 *   Product,
 *   [
 *     { where: { id: 1 }, field: 'viewCount', amount: 1 },
 *     { where: { id: 2 }, field: 'viewCount', amount: 5 }
 *   ],
 *   { maxConcurrency: 5 }
 * );
 * ```
 */
export async function batchIncrement<M extends Model>(
  model: ModelCtor<M>,
  increments: Array<{ where: WhereOptions<any>; field: string; amount: number }>,
  config: Partial<BatchConfig>
): Promise<number[]> {
  const logger = new Logger('BatchQueries::batchIncrement');

  try {
    const maxConcurrency = config.maxConcurrency || 10;
    const chunks: typeof increments[] = [];

    for (let i = 0; i < increments.length; i += maxConcurrency) {
      chunks.push(increments.slice(i, i + maxConcurrency));
    }

    const results: number[] = [];

    for (const chunk of chunks) {
      const chunkResults = await Promise.all(
        chunk.map(async inc => {
          const [affectedCount] = await model.update(
            { [inc.field]: literal(`"${inc.field}" + ${inc.amount}`) } as any,
            {
              where: inc.where,
              transaction: config.transaction,
            } as any
          );
          return affectedCount;
        })
      );

      results.push(...chunkResults);
    }

    logger.log(`Batch increment: ${increments.length} increment operations completed`);
    return results;
  } catch (error) {
    logger.error('Batch increment failed', error);
    throw new InternalServerErrorException('Batch increment failed');
  }
}

/**
 * Batch soft delete operations
 *
 * @param model - Sequelize model (must have paranoid: true)
 * @param whereConditions - Array of conditions for soft delete
 * @param config - Batch configuration
 * @returns Array of affected counts
 *
 * @example
 * ```typescript
 * const results = await batchSoftDelete(
 *   Post,
 *   [
 *     { status: 'draft', createdAt: { [Op.lt]: oldDate } },
 *     { authorId: deletedUserId }
 *   ],
 *   { batchSize: 50, transaction: t }
 * );
 * ```
 */
export async function batchSoftDelete<M extends Model>(
  model: ModelCtor<M>,
  whereConditions: WhereOptions<any>[],
  config: BatchConfig
): Promise<number[]> {
  const logger = new Logger('BatchQueries::batchSoftDelete');

  try {
    const batches: WhereOptions<any>[][] = [];
    for (let i = 0; i < whereConditions.length; i += config.batchSize) {
      batches.push(whereConditions.slice(i, i + config.batchSize));
    }

    const results: number[] = [];

    for (const batch of batches) {
      const batchResults = await Promise.all(
        batch.map(where =>
          model.destroy({
            where,
            transaction: config.transaction,
          })
        )
      );

      results.push(...batchResults);
    }

    const totalDeleted = results.reduce((sum, count) => sum + count, 0);
    logger.log(`Batch soft delete: ${totalDeleted} records soft deleted`);

    return results;
  } catch (error) {
    logger.error('Batch soft delete failed', error);
    throw new InternalServerErrorException('Batch soft delete failed');
  }
}

/**
 * Batch restore operations for paranoid models
 *
 * @param model - Sequelize model (must have paranoid: true)
 * @param whereConditions - Array of conditions for restore
 * @param config - Batch configuration
 * @returns Array of affected counts
 *
 * @example
 * ```typescript
 * const results = await batchRestore(
 *   User,
 *   [
 *     { email: { [Op.in]: emailsToRestore } },
 *     { id: { [Op.in]: idsToRestore } }
 *   ],
 *   { batchSize: 50 }
 * );
 * ```
 */
export async function batchRestore<M extends Model>(
  model: ModelCtor<M>,
  whereConditions: WhereOptions<any>[],
  config: BatchConfig
): Promise<number[]> {
  const logger = new Logger('BatchQueries::batchRestore');

  try {
    const batches: WhereOptions<any>[][] = [];
    for (let i = 0; i < whereConditions.length; i += config.batchSize) {
      batches.push(whereConditions.slice(i, i + config.batchSize));
    }

    const results: number[] = [];

    for (const batch of batches) {
      const batchResults = await Promise.all(
        batch.map(async where => {
          const [affectedCount] = await model.update(
            { deletedAt: null } as any,
            {
              where: { ...where, deletedAt: { [Op.not]: null } },
              transaction: config.transaction,
              paranoid: false,
            } as any
          );
          return affectedCount;
        })
      );

      results.push(...batchResults);
    }

    const totalRestored = results.reduce((sum, count) => sum + count, 0);
    logger.log(`Batch restore: ${totalRestored} records restored`);

    return results;
  } catch (error) {
    logger.error('Batch restore failed', error);
    throw new InternalServerErrorException('Batch restore failed');
  }
}

/**
 * Execute batch queries with result aggregation
 *
 * @param model - Sequelize model
 * @param queries - Array of query configurations
 * @param aggregator - Function to aggregate results
 * @param config - Batch configuration
 * @returns Aggregated result
 *
 * @example
 * ```typescript
 * const totalPatients = await batchQueryWithAggregation(
 *   Patient,
 *   [
 *     { where: { status: 'active' } },
 *     { where: { status: 'inactive' } }
 *   ],
 *   (results) => results.flat().length,
 *   { maxConcurrency: 5 }
 * );
 * ```
 */
export async function batchQueryWithAggregation<M extends Model, R>(
  model: ModelCtor<M>,
  queries: Array<{ where: WhereOptions<any>; options?: FindOptions<Attributes<M>> }>,
  aggregator: (results: M[][]) => R,
  config: Partial<BatchConfig>
): Promise<R> {
  const logger = new Logger('BatchQueries::batchQueryWithAggregation');

  try {
    const maxConcurrency = config.maxConcurrency || 10;
    const chunks: typeof queries[] = [];

    for (let i = 0; i < queries.length; i += maxConcurrency) {
      chunks.push(queries.slice(i, i + maxConcurrency));
    }

    const allResults: M[][] = [];

    for (const chunk of chunks) {
      const chunkResults = await Promise.all(
        chunk.map(query =>
          model.findAll({
            where: query.where,
            ...query.options,
            transaction: config.transaction,
          })
        )
      );

      allResults.push(...chunkResults);
    }

    const aggregatedResult = aggregator(allResults);
    logger.log(`Batch query with aggregation: ${queries.length} queries aggregated`);

    return aggregatedResult;
  } catch (error) {
    logger.error('Batch query with aggregation failed', error);
    throw new InternalServerErrorException('Batch query with aggregation failed');
  }
}

/**
 * Batch find with includes to prevent N+1 queries
 *
 * @param model - Sequelize model
 * @param whereConditions - Array of where conditions
 * @param include - Include options for associations
 * @param config - Batch configuration
 * @returns Array of records with eager-loaded associations
 *
 * @example
 * ```typescript
 * const users = await batchFindWithIncludes(
 *   User,
 *   [
 *     { role: 'admin' },
 *     { role: 'user' }
 *   ],
 *   [{ model: Profile }, { model: Post }],
 *   { batchSize: 50 }
 * );
 * ```
 */
export async function batchFindWithIncludes<M extends Model>(
  model: ModelCtor<M>,
  whereConditions: WhereOptions<any>[],
  include: any[],
  config: BatchConfig
): Promise<M[]> {
  const logger = new Logger('BatchQueries::batchFindWithIncludes');

  try {
    const batches: WhereOptions<any>[][] = [];
    for (let i = 0; i < whereConditions.length; i += config.batchSize) {
      batches.push(whereConditions.slice(i, i + config.batchSize));
    }

    const results: M[] = [];

    for (const batch of batches) {
      const batchResults = await Promise.all(
        batch.map(where =>
          model.findAll({
            where,
            include,
            transaction: config.transaction,
            subQuery: false, // Prevent N+1
          })
        )
      );

      results.push(...batchResults.flat());
    }

    logger.log(`Batch find with includes: ${results.length} records loaded`);
    return results;
  } catch (error) {
    logger.error('Batch find with includes failed', error);
    throw new InternalServerErrorException('Batch find with includes failed');
  }
}

/**
 * Execute batch transactions with rollback on failure
 *
 * @param sequelize - Sequelize instance
 * @param operations - Array of transaction operations
 * @param config - Batch configuration
 * @returns Array of transaction results
 *
 * @example
 * ```typescript
 * const results = await batchTransactions(
 *   sequelize,
 *   [
 *     async (t) => User.create({ name: 'John' }, { transaction: t }),
 *     async (t) => Profile.create({ userId: 1 }, { transaction: t })
 *   ],
 *   { maxConcurrency: 3 }
 * );
 * ```
 */
export async function batchTransactions<T = any>(
  sequelize: Sequelize,
  operations: Array<(transaction: Transaction) => Promise<T>>,
  config: Partial<BatchConfig>
): Promise<Array<{ success: boolean; result: T | null; error: string | null }>> {
  const logger = new Logger('BatchQueries::batchTransactions');

  try {
    const maxConcurrency = config.maxConcurrency || 5;
    const chunks: typeof operations[] = [];

    for (let i = 0; i < operations.length; i += maxConcurrency) {
      chunks.push(operations.slice(i, i + maxConcurrency));
    }

    const results: Array<{ success: boolean; result: T | null; error: string | null }> = [];

    for (const chunk of chunks) {
      const chunkResults = await Promise.allSettled(
        chunk.map(async operation => {
          return await sequelize.transaction(async t => {
            return await operation(t);
          });
        })
      );

      chunkResults.forEach(outcome => {
        if (outcome.status === 'fulfilled') {
          results.push({ success: true, result: outcome.value, error: null });
        } else {
          results.push({
            success: false,
            result: null,
            error: outcome.reason?.message || 'Unknown error',
          });
        }
      });
    }

    logger.log(
      `Batch transactions: ${results.filter(r => r.success).length}/${operations.length} succeeded`
    );

    return results;
  } catch (error) {
    logger.error('Batch transactions failed', error);
    throw new InternalServerErrorException('Batch transactions failed');
  }
}

/**
 * Batch query with retry logic for failed operations
 *
 * @param model - Sequelize model
 * @param queries - Array of query configurations
 * @param config - Batch configuration with retry settings
 * @returns Batch execution result
 *
 * @example
 * ```typescript
 * const result = await batchQueryWithRetry(
 *   Order,
 *   [{ where: { status: 'pending' } }, { where: { status: 'processing' } }],
 *   { batchSize: 10, maxConcurrency: 5, retryFailedBatches: 3 }
 * );
 * ```
 */
export async function batchQueryWithRetry<M extends Model>(
  model: ModelCtor<M>,
  queries: Array<{ where: WhereOptions<any>; options?: FindOptions<Attributes<M>> }>,
  config: BatchConfig & { retryFailedBatches?: number }
): Promise<BatchExecutionResult<M>> {
  const logger = new Logger('BatchQueries::batchQueryWithRetry');
  const maxRetries = config.retryFailedBatches || 3;

  let result = await executeBatchQueries(
    model,
    queries.map(q => q.where),
    config
  );

  if (result.failedBatches > 0 && maxRetries > 0) {
    logger.log(`Retrying ${result.failedBatches} failed batches (max ${maxRetries} retries)`);

    for (let retry = 1; retry <= maxRetries && result.failedBatches > 0; retry++) {
      const failedIndexes = result.errors.map(e => e.batchIndex);
      const retryQueries = failedIndexes.map(idx => queries[idx].where);

      const retryResult = await executeBatchQueries(model, retryQueries, config);

      result.results.push(...retryResult.results);
      result.successfulBatches += retryResult.successfulBatches;
      result.failedBatches = retryResult.failedBatches;
      result.errors = retryResult.errors;

      logger.log(`Retry ${retry}: ${retryResult.successfulBatches} batches succeeded`);
    }
  }

  return result;
}

/**
 * Batch query with progress tracking callback
 *
 * @param model - Sequelize model
 * @param queries - Array of query configurations
 * @param config - Batch configuration
 * @param onProgress - Progress callback function
 * @returns Batch execution result
 *
 * @example
 * ```typescript
 * const result = await batchQueryWithProgress(
 *   User,
 *   queries,
 *   { batchSize: 50, maxConcurrency: 5 },
 *   (completed, total) => console.log(`${completed}/${total} batches completed`)
 * );
 * ```
 */
export async function batchQueryWithProgress<M extends Model>(
  model: ModelCtor<M>,
  queries: WhereOptions<any>[],
  config: BatchConfig,
  onProgress: (completed: number, total: number) => void
): Promise<BatchExecutionResult<M>> {
  const logger = new Logger('BatchQueries::batchQueryWithProgress');
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
    const batches: WhereOptions<any>[][] = [];
    for (let i = 0; i < queries.length; i += config.batchSize) {
      batches.push(queries.slice(i, i + config.batchSize));
    }

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];

      try {
        const batchResults = await Promise.all(
          batch.map(where => model.findAll({ where, transaction: config.transaction }))
        );

        batchResults.forEach(batchResult => result.results.push(...batchResult));
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

      onProgress(batchIndex + 1, batches.length);

      if (config.delayBetweenBatchesMs && batchIndex < batches.length - 1) {
        await delay(config.delayBetweenBatchesMs);
      }
    }

    result.success = result.successfulBatches > 0;
    result.executionTimeMs = Date.now() - startTime;
    result.throughput = (result.results.length / result.executionTimeMs) * 1000;

    logger.log(`Batch query with progress: ${result.results.length} records processed`);
    return result;
  } catch (error) {
    logger.error('Batch query with progress failed', error);
    throw new InternalServerErrorException('Batch query with progress failed');
  }
}

/**
 * Batch query with result streaming for memory efficiency
 *
 * @param model - Sequelize model
 * @param queries - Array of query configurations
 * @param config - Batch configuration
 * @param onBatchComplete - Callback for each batch completion
 * @returns Total count of processed records
 *
 * @example
 * ```typescript
 * const total = await batchQueryWithStreaming(
 *   Patient,
 *   queries,
 *   { batchSize: 100, maxConcurrency: 5 },
 *   (batch, index) => processBatch(batch)
 * );
 * ```
 */
export async function batchQueryWithStreaming<M extends Model>(
  model: ModelCtor<M>,
  queries: WhereOptions<any>[],
  config: BatchConfig,
  onBatchComplete: (batch: M[], batchIndex: number) => Promise<void> | void
): Promise<number> {
  const logger = new Logger('BatchQueries::batchQueryWithStreaming');
  let totalProcessed = 0;

  try {
    const batches: WhereOptions<any>[][] = [];
    for (let i = 0; i < queries.length; i += config.batchSize) {
      batches.push(queries.slice(i, i + config.batchSize));
    }

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];

      const batchResults = await Promise.all(
        batch.map(where => model.findAll({ where, transaction: config.transaction }))
      );

      const flatResults = batchResults.flat();
      totalProcessed += flatResults.length;

      await onBatchComplete(flatResults, batchIndex);

      if (config.delayBetweenBatchesMs && batchIndex < batches.length - 1) {
        await delay(config.delayBetweenBatchesMs);
      }
    }

    logger.log(`Batch query with streaming: ${totalProcessed} records streamed`);
    return totalProcessed;
  } catch (error) {
    logger.error('Batch query with streaming failed', error);
    throw new InternalServerErrorException('Batch query with streaming failed');
  }
}

/**
 * Batch query with dynamic batch size adjustment based on performance
 *
 * @param model - Sequelize model
 * @param queries - Array of query configurations
 * @param config - Initial batch configuration
 * @returns Batch execution result with optimized batch sizes
 *
 * @example
 * ```typescript
 * const result = await batchQueryWithDynamicSizing(
 *   Appointment,
 *   queries,
 *   { batchSize: 50, maxConcurrency: 5 }
 * );
 * ```
 */
export async function batchQueryWithDynamicSizing<M extends Model>(
  model: ModelCtor<M>,
  queries: WhereOptions<any>[],
  config: BatchConfig
): Promise<BatchExecutionResult<M>> {
  const logger = new Logger('BatchQueries::batchQueryWithDynamicSizing');
  const startTime = Date.now();

  const result: BatchExecutionResult<M> = {
    success: false,
    totalBatches: 0,
    successfulBatches: 0,
    failedBatches: 0,
    results: [],
    errors: [],
    executionTimeMs: 0,
    averageBatchTimeMs: 0,
    throughput: 0,
  };

  try {
    let currentBatchSize = config.batchSize;
    let index = 0;

    while (index < queries.length) {
      const batchStart = Date.now();
      const batch = queries.slice(index, index + currentBatchSize);

      try {
        const batchResults = await Promise.all(
          batch.map(where => model.findAll({ where, transaction: config.transaction }))
        );

        batchResults.forEach(r => result.results.push(...r));
        result.successfulBatches++;

        const batchTime = Date.now() - batchStart;

        // Adjust batch size based on performance
        if (batchTime < 100) {
          // Too fast, increase batch size
          currentBatchSize = Math.min(currentBatchSize * 2, 1000);
        } else if (batchTime > 1000) {
          // Too slow, decrease batch size
          currentBatchSize = Math.max(Math.floor(currentBatchSize / 2), 10);
        }

        logger.debug(`Adjusted batch size to ${currentBatchSize} based on ${batchTime}ms execution`);
      } catch (error) {
        result.failedBatches++;
        result.errors.push({
          batchIndex: result.totalBatches,
          error: (error as Error).message,
        });

        if (config.failFast) {
          throw error;
        }
      }

      index += currentBatchSize;
      result.totalBatches++;

      if (config.delayBetweenBatchesMs) {
        await delay(config.delayBetweenBatchesMs);
      }
    }

    result.success = result.successfulBatches > 0;
    result.executionTimeMs = Date.now() - startTime;
    result.throughput = (result.results.length / result.executionTimeMs) * 1000;

    logger.log(`Dynamic batch sizing: ${result.results.length} records in ${result.totalBatches} batches`);
    return result;
  } catch (error) {
    logger.error('Batch query with dynamic sizing failed', error);
    throw new InternalServerErrorException('Batch query with dynamic sizing failed');
  }
}

/**
 * Batch query with result caching for repeated queries
 *
 * @param model - Sequelize model
 * @param queries - Array of query configurations
 * @param config - Batch configuration
 * @param cacheKeyFn - Function to generate cache keys
 * @returns Batch execution result with cached results
 *
 * @example
 * ```typescript
 * const result = await batchQueryWithCache(
 *   User,
 *   queries,
 *   { batchSize: 50, maxConcurrency: 5 },
 *   (where) => JSON.stringify(where)
 * );
 * ```
 */
export async function batchQueryWithCache<M extends Model>(
  model: ModelCtor<M>,
  queries: WhereOptions<any>[],
  config: BatchConfig,
  cacheKeyFn: (where: WhereOptions<any>) => string
): Promise<BatchExecutionResult<M>> {
  const logger = new Logger('BatchQueries::batchQueryWithCache');
  const cache = new Map<string, M[]>();

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

  const startTime = Date.now();

  try {
    const batches: WhereOptions<any>[][] = [];
    for (let i = 0; i < queries.length; i += config.batchSize) {
      batches.push(queries.slice(i, i + config.batchSize));
    }

    for (const batch of batches) {
      const batchResults = await Promise.all(
        batch.map(async where => {
          const cacheKey = cacheKeyFn(where);

          if (cache.has(cacheKey)) {
            return cache.get(cacheKey)!;
          }

          const results = await model.findAll({ where, transaction: config.transaction });
          cache.set(cacheKey, results);
          return results;
        })
      );

      batchResults.forEach(r => result.results.push(...r));
      result.successfulBatches++;
    }

    result.success = true;
    result.executionTimeMs = Date.now() - startTime;
    result.throughput = (result.results.length / result.executionTimeMs) * 1000;

    logger.log(`Batch query with cache: ${cache.size} unique queries, ${result.results.length} results`);
    return result;
  } catch (error) {
    logger.error('Batch query with cache failed', error);
    throw new InternalServerErrorException('Batch query with cache failed');
  }
}

/**
 * Batch query with memory-aware processing
 *
 * @param model - Sequelize model
 * @param queries - Array of query configurations
 * @param config - Batch configuration
 * @param maxMemoryMb - Maximum memory usage in MB
 * @returns Batch execution result
 *
 * @example
 * ```typescript
 * const result = await batchQueryMemoryAware(
 *   LargeRecord,
 *   queries,
 *   { batchSize: 100, maxConcurrency: 5 },
 *   500 // 500MB limit
 * );
 * ```
 */
export async function batchQueryMemoryAware<M extends Model>(
  model: ModelCtor<M>,
  queries: WhereOptions<any>[],
  config: BatchConfig,
  maxMemoryMb: number = 500
): Promise<BatchExecutionResult<M>> {
  const logger = new Logger('BatchQueries::batchQueryMemoryAware');

  let totalProcessed = 0;
  let batchIndex = 0;

  const result: BatchExecutionResult<M> = {
    success: false,
    totalBatches: 0,
    successfulBatches: 0,
    failedBatches: 0,
    results: [],
    errors: [],
    executionTimeMs: 0,
    averageBatchTimeMs: 0,
    throughput: 0,
  };

  const startTime = Date.now();

  try {
    while (totalProcessed < queries.length) {
      const memUsage = process.memoryUsage();
      const heapUsedMb = memUsage.heapUsed / 1024 / 1024;

      if (heapUsedMb > maxMemoryMb * 0.8) {
        logger.warn(`Memory usage high (${heapUsedMb.toFixed(2)}MB), forcing GC`);
        if (global.gc) {
          global.gc();
        }
        await delay(100);
      }

      const batchSize = heapUsedMb > maxMemoryMb * 0.6 ? Math.floor(config.batchSize / 2) : config.batchSize;
      const batch = queries.slice(totalProcessed, totalProcessed + batchSize);

      try {
        const batchResults = await Promise.all(
          batch.map(where => model.findAll({ where, transaction: config.transaction }))
        );

        batchResults.forEach(r => result.results.push(...r));
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

      totalProcessed += batchSize;
      batchIndex++;
      result.totalBatches++;
    }

    result.success = result.successfulBatches > 0;
    result.executionTimeMs = Date.now() - startTime;
    result.throughput = (result.results.length / result.executionTimeMs) * 1000;

    logger.log(`Memory-aware batch: ${result.results.length} records, peak ${process.memoryUsage().heapUsed / 1024 / 1024}MB`);
    return result;
  } catch (error) {
    logger.error('Memory-aware batch query failed', error);
    throw new InternalServerErrorException('Memory-aware batch query failed');
  }
}

/**
 * Batch query with priority queue for important queries
 *
 * @param model - Sequelize model
 * @param queries - Array of queries with priorities
 * @param config - Batch configuration
 * @returns Batch execution result
 *
 * @example
 * ```typescript
 * const result = await batchQueryWithPriority(
 *   Order,
 *   [
 *     { where: { status: 'urgent' }, priority: 1 },
 *     { where: { status: 'normal' }, priority: 5 }
 *   ],
 *   { batchSize: 50, maxConcurrency: 5 }
 * );
 * ```
 */
export async function batchQueryWithPriority<M extends Model>(
  model: ModelCtor<M>,
  queries: Array<{ where: WhereOptions<any>; priority: number }>,
  config: BatchConfig
): Promise<BatchExecutionResult<M>> {
  const logger = new Logger('BatchQueries::batchQueryWithPriority');

  // Sort queries by priority (lower number = higher priority)
  const sortedQueries = [...queries].sort((a, b) => a.priority - b.priority);

  const result = await executeBatchQueries(
    model,
    sortedQueries.map(q => q.where),
    config
  );

  logger.log(`Priority batch: processed ${result.results.length} records by priority`);
  return result;
}

/**
 * Batch query with timeout handling
 *
 * @param model - Sequelize model
 * @param queries - Array of query configurations
 * @param config - Batch configuration
 * @param timeoutMs - Timeout per query in milliseconds
 * @returns Batch execution result
 *
 * @example
 * ```typescript
 * const result = await batchQueryWithTimeout(
 *   SlowTable,
 *   queries,
 *   { batchSize: 10, maxConcurrency: 3 },
 *   5000 // 5 second timeout per query
 * );
 * ```
 */
export async function batchQueryWithTimeout<M extends Model>(
  model: ModelCtor<M>,
  queries: WhereOptions<any>[],
  config: BatchConfig,
  timeoutMs: number = 10000
): Promise<BatchExecutionResult<M>> {
  const logger = new Logger('BatchQueries::batchQueryWithTimeout');
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
    const batches: WhereOptions<any>[][] = [];
    for (let i = 0; i < queries.length; i += config.batchSize) {
      batches.push(queries.slice(i, i + config.batchSize));
    }

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];

      const batchResults = await Promise.allSettled(
        batch.map(where =>
          Promise.race([
            model.findAll({ where, transaction: config.transaction }),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error('Query timeout')), timeoutMs)
            ),
          ])
        )
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
    }

    result.success = result.successfulBatches > 0;
    result.executionTimeMs = Date.now() - startTime;
    result.throughput = (result.results.length / result.executionTimeMs) * 1000;

    logger.log(`Batch with timeout: ${result.results.length} records, ${result.errors.length} timeouts`);
    return result;
  } catch (error) {
    logger.error('Batch query with timeout failed', error);
    throw new InternalServerErrorException('Batch query with timeout failed');
  }
}

/**
 * Batch query with exponential backoff for rate limiting
 *
 * @param model - Sequelize model
 * @param queries - Array of query configurations
 * @param config - Batch configuration
 * @returns Batch execution result
 *
 * @example
 * ```typescript
 * const result = await batchQueryWithBackoff(
 *   ExternalApi,
 *   queries,
 *   { batchSize: 10, maxConcurrency: 2 }
 * );
 * ```
 */
export async function batchQueryWithBackoff<M extends Model>(
  model: ModelCtor<M>,
  queries: WhereOptions<any>[],
  config: BatchConfig
): Promise<BatchExecutionResult<M>> {
  const logger = new Logger('BatchQueries::batchQueryWithBackoff');
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
    const batches: WhereOptions<any>[][] = [];
    for (let i = 0; i < queries.length; i += config.batchSize) {
      batches.push(queries.slice(i, i + config.batchSize));
    }

    let backoffDelay = 100;

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];

      try {
        const batchResults = await Promise.all(
          batch.map(where => model.findAll({ where, transaction: config.transaction }))
        );

        batchResults.forEach(r => result.results.push(...r));
        result.successfulBatches++;

        // Reset backoff on success
        backoffDelay = 100;
      } catch (error) {
        result.failedBatches++;
        result.errors.push({
          batchIndex,
          error: (error as Error).message,
        });

        // Exponential backoff
        await delay(backoffDelay);
        backoffDelay = Math.min(backoffDelay * 2, 10000);

        if (config.failFast) {
          throw error;
        }
      }
    }

    result.success = result.successfulBatches > 0;
    result.executionTimeMs = Date.now() - startTime;
    result.throughput = (result.results.length / result.executionTimeMs) * 1000;

    logger.log(`Batch with backoff: ${result.results.length} records processed`);
    return result;
  } catch (error) {
    logger.error('Batch query with backoff failed', error);
    throw new InternalServerErrorException('Batch query with backoff failed');
  }
}

/**
 * Batch query with result deduplication
 *
 * @param model - Sequelize model
 * @param queries - Array of query configurations
 * @param config - Batch configuration
 * @param dedupeKey - Key field for deduplication
 * @returns Batch execution result with deduplicated results
 *
 * @example
 * ```typescript
 * const result = await batchQueryWithDedupe(
 *   User,
 *   queries,
 *   { batchSize: 50, maxConcurrency: 5 },
 *   'id'
 * );
 * ```
 */
export async function batchQueryWithDedupe<M extends Model>(
  model: ModelCtor<M>,
  queries: WhereOptions<any>[],
  config: BatchConfig,
  dedupeKey: string = 'id'
): Promise<BatchExecutionResult<M>> {
  const logger = new Logger('BatchQueries::batchQueryWithDedupe');

  const result = await executeBatchQueries(model, queries, config);

  // Deduplicate results
  const seen = new Set<any>();
  const dedupedResults: M[] = [];

  result.results.forEach(record => {
    const keyValue = (record as any)[dedupeKey];
    if (!seen.has(keyValue)) {
      seen.add(keyValue);
      dedupedResults.push(record);
    }
  });

  result.results = dedupedResults;
  logger.log(`Batch with dedupe: ${result.results.length} unique records from ${seen.size} total`);

  return result;
}

/**
 * Batch query with result pagination for large result sets
 *
 * @param model - Sequelize model
 * @param where - Base where condition
 * @param config - Batch configuration
 * @param pageSize - Results per page
 * @returns Async generator yielding pages of results
 *
 * @example
 * ```typescript
 * for await (const page of batchQueryPaginated(User, { status: 'active' }, config, 100)) {
 *   await processPage(page);
 * }
 * ```
 */
export async function* batchQueryPaginated<M extends Model>(
  model: ModelCtor<M>,
  where: WhereOptions<any>,
  config: BatchConfig,
  pageSize: number = 100
): AsyncGenerator<M[], void, unknown> {
  const logger = new Logger('BatchQueries::batchQueryPaginated');

  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    const page = await model.findAll({
      where,
      limit: pageSize,
      offset,
      transaction: config.transaction,
    });

    if (page.length > 0) {
      yield page;
      offset += pageSize;
      hasMore = page.length === pageSize;

      if (config.delayBetweenBatchesMs) {
        await delay(config.delayBetweenBatchesMs);
      }
    } else {
      hasMore = false;
    }
  }

  logger.log(`Batch paginated: processed ${offset} records`);
}

// Helper functions

/**
 * Limit concurrency of promises
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
 * Export all batch query functions
 */
export const AdvancedBatchQueries = {
  executeBatchQueries,
  executeParallelQueries,
  batchFindByPk,
  batchCreate,
  batchUpdate,
  batchDelete,
  batchUpsert,
  batchAggregate,
  batchCount,
  batchExists,
  batchRawQuery,
  batchIncrement,
  batchSoftDelete,
  batchRestore,
  batchQueryWithAggregation,
  batchFindWithIncludes,
  batchTransactions,
  batchQueryWithRetry,
  batchQueryWithProgress,
  batchQueryWithStreaming,
  batchQueryWithDynamicSizing,
  batchQueryWithCache,
  batchQueryMemoryAware,
  batchQueryWithPriority,
  batchQueryWithTimeout,
  batchQueryWithBackoff,
  batchQueryWithDedupe,
  batchQueryPaginated,
};
