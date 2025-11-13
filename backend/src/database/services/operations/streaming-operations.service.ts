/**
 * @fileoverview Streaming Operations Service for Database Operations
 * @module databa@/services/operations/streaming-operations
 * @description Streaming query operations with backpressure handling and cursor pagination
 *
 * @version 1.0.0
 */

import { Logger, InternalServerErrorException } from '@nestjs/common';
import { Readable } from 'stream';
import { Model, ModelCtor, WhereOptions, OrderItem, Op, Transaction, Attributes } from 'sequelize';
import {
  StreamingMetrics,
  StreamConfig,
  CursorPaginationConfig,
  CursorPaginationResult,
} from './interfaces';

/**
 * Delay helper for throttling and backpressure handling
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Common batch fetching logic to eliminate duplication
 */
async function fetchBatch<M extends Model>(
  model: ModelCtor<M>,
  where: WhereOptions<Attributes<M>>,
  config: StreamConfig,
  offset: number,
): Promise<{ batch: M[]; hasMore: boolean; newOffset: number }> {
  const batch = await model.findAll({
    where,
    limit: config.batchSize,
    offset,
    transaction: config.transaction,
  });

  const hasMore = batch.length === config.batchSize;
  const newOffset = offset + config.batchSize;

  return { batch, hasMore, newOffset };
}

/**
 * Create a readable stream from Sequelize query results
 */
export async function createQueryStream<M extends Model>(
  model: ModelCtor<M>,
  where: WhereOptions<Attributes<M>>,
  config: StreamConfig,
): Promise<Readable> {
  const logger = new Logger('StreamingOperations::createQueryStream');

  try {
    let offset = 0;
    let hasMore = true;

    const stream = new Readable({
      objectMode: config.objectMode ?? true,
      highWaterMark: config.highWaterMark || 16,
      async read() {
        try {
          if (!hasMore) {
            this.push(null);
            return;
          }

          const result = await fetchBatch(model, where, config, offset);
          
          if (result.batch.length === 0) {
            hasMore = false;
            this.push(null);
            return;
          }

          offset = result.newOffset;
          hasMore = result.hasMore;

          for (const record of result.batch) {
            if (!this.push(record)) {
              break;
            }
          }
        } catch (error) {
          logger.error('Stream read error', error);
          this.destroy(error as Error);
        }
      },
    });

    logger.log(`Created query stream for ${model.name}`);
    return stream;
  } catch (error) {
    logger.error('Failed to create query stream', error);
    throw new InternalServerErrorException('Failed to create query stream');
  }
}

/**
 * Stream query results with automatic batching and backpressure handling
 */
export async function streamQuery<M extends Model>(
  model: ModelCtor<M>,
  where: WhereOptions<Attributes<M>>,
  config: StreamConfig,
  processor: (record: M) => Promise<void> | void,
): Promise<StreamingMetrics> {
  const logger = new Logger('StreamingOperations::streamQuery');
  const startTime = Date.now();

  const metrics: StreamingMetrics = {
    totalRecords: 0,
    totalBatches: 0,
    averageBatchSize: 0,
    executionTimeMs: 0,
    throughput: 0,
    memoryPeakMb: 0,
    backpressureEvents: 0,
  };

  try {
    let offset = 0;
    let hasMore = true;
    const batchSizes: number[] = [];

    while (hasMore) {
      const memUsage = process.memoryUsage();
      const heapUsedMb = memUsage.heapUsed / 1024 / 1024;
      metrics.memoryPeakMb = Math.max(metrics.memoryPeakMb, heapUsedMb);

      if (config.backpressureThreshold && heapUsedMb > config.backpressureThreshold) {
        logger.warn(`Backpressure: memory usage ${heapUsedMb.toFixed(2)}MB, pausing`);
        metrics.backpressureEvents++;
        await delay(100);
        if (global.gc) {
          global.gc();
        }
      }

      const batch = await model.findAll({
        where,
        limit: config.batchSize,
        offset,
        transaction: config.transaction,
      });

      if (batch.length === 0) {
        hasMore = false;
        break;
      }

      batchSizes.push(batch.length);
      metrics.totalBatches++;

      for (const record of batch) {
        await processor(record);
        metrics.totalRecords++;
      }

      offset += config.batchSize;
      hasMore = batch.length === config.batchSize;
    }

    metrics.averageBatchSize = batchSizes.reduce((a, b) => a + b, 0) / batchSizes.length;
    metrics.executionTimeMs = Date.now() - startTime;
    metrics.throughput = (metrics.totalRecords / metrics.executionTimeMs) * 1000;

    logger.log(
      `Stream query complete: ${metrics.totalRecords} records, ` +
        `${metrics.throughput.toFixed(2)} records/sec, ` +
        `peak ${metrics.memoryPeakMb.toFixed(2)}MB`,
    );

    return metrics;
  } catch (error) {
    logger.error('Stream query failed', error);
    throw new InternalServerErrorException('Stream query failed');
  }
}

/**
 * Cursor-based pagination for efficient large dataset traversal
 */
export async function cursorPaginate<M extends Model>(
  model: ModelCtor<M>,
  config: CursorPaginationConfig,
  transaction?: Transaction,
): Promise<CursorPaginationResult<M>> {
  const logger = new Logger('StreamingOperations::cursorPaginate');

  try {
    const where: WhereOptions<Attributes<M>> = {};

    if (config.cursor) {
      const op =
        config.direction === 'forward'
          ? config.orderDirection === 'DESC'
            ? Op.lt
            : Op.gt
          : config.orderDirection === 'DESC'
            ? Op.gt
            : Op.lt;

      (where as Record<string, unknown>)[config.cursorField] = { [op]: config.cursor };
    }

    const orderDirection = config.orderDirection || 'ASC';
    const order: OrderItem[] = [[config.cursorField, orderDirection]];

    const records = await model.findAll({
      where,
      order,
      limit: config.limit + 1,
      transaction,
    });

    const hasMore = records.length > config.limit;
    const data = hasMore ? records.slice(0, config.limit) : records;

    const nextCursor = hasMore
      ? ((data[data.length - 1] as unknown as Record<string, unknown>)[config.cursorField] as
          | string
          | number)
      : null;
    const prevCursor =
      data.length > 0
        ? ((data[0] as unknown as Record<string, unknown>)[config.cursorField] as string | number)
        : null;

    logger.log(
      `Cursor paginate: ${data.length} records, hasMore: ${hasMore}, ` +
        `nextCursor: ${nextCursor}`,
    );

    return {
      data,
      hasMore,
      nextCursor,
      prevCursor,
    };
  } catch (error) {
    logger.error('Cursor pagination failed', error);
    throw new InternalServerErrorException('Cursor pagination failed');
  }
}

/**
 * Stream query results to a custom transform stream
 */
export async function streamToTransform<M extends Model>(
  model: ModelCtor<M>,
  where: WhereOptions<Attributes<M>>,
  config: StreamConfig,
  transform: (record: M) => Promise<unknown> | unknown,
): Promise<Readable> {
  const logger = new Logger('StreamingOperations::streamToTransform');

  try {
    let offset = 0;
    let hasMore = true;

    const stream = new Readable({
      objectMode: true,
      highWaterMark: config.highWaterMark || 16,
      async read() {
        try {
          if (!hasMore) {
            this.push(null);
            return;
          }

          const batch = await model.findAll({
            where,
            limit: config.batchSize,
            offset,
            transaction: config.transaction,
          });

          if (batch.length === 0) {
            hasMore = false;
            this.push(null);
            return;
          }

          offset += config.batchSize;
          hasMore = batch.length === config.batchSize;

          for (const record of batch) {
            try {
              const transformed = await transform(record);
              if (!this.push(transformed)) {
                break;
              }
            } catch (transformError) {
              logger.error('Transform error', transformError);
              this.destroy(transformError as Error);
              return;
            }
          }
        } catch (error) {
          logger.error('Stream read error', error);
          this.destroy(error as Error);
        }
      },
    });

    logger.log(`Created transform stream for ${model.name}`);
    return stream;
  } catch (error) {
    logger.error('Failed to create transform stream', error);
    throw new InternalServerErrorException('Failed to create transform stream');
  }
}

/**
 * Batch process records with streaming and memory management
 */
export async function batchProcessStream<M extends Model>(
  model: ModelCtor<M>,
  where: WhereOptions<Attributes<M>>,
  config: StreamConfig & {
    processBatch: (records: M[]) => Promise<void>;
    memoryCheckInterval?: number;
  },
): Promise<StreamingMetrics> {
  const logger = new Logger('StreamingOperations::batchProcessStream');
  const startTime = Date.now();

  const metrics: StreamingMetrics = {
    totalRecords: 0,
    totalBatches: 0,
    averageBatchSize: 0,
    executionTimeMs: 0,
    throughput: 0,
    memoryPeakMb: 0,
    backpressureEvents: 0,
  };

  try {
    let offset = 0;
    let hasMore = true;
    const batchSizes: number[] = [];
    const memoryCheckInterval = config.memoryCheckInterval || 10;

    while (hasMore) {
      // Check memory usage periodically
      if (metrics.totalBatches % memoryCheckInterval === 0) {
        const memUsage = process.memoryUsage();
        const heapUsedMb = memUsage.heapUsed / 1024 / 1024;
        metrics.memoryPeakMb = Math.max(metrics.memoryPeakMb, heapUsedMb);

        if (config.backpressureThreshold && heapUsedMb > config.backpressureThreshold) {
          logger.warn(`Backpressure: memory usage ${heapUsedMb.toFixed(2)}MB, pausing`);
          metrics.backpressureEvents++;
          await delay(100);
          if (global.gc) {
            global.gc();
          }
        }
      }

      const batch = await model.findAll({
        where,
        limit: config.batchSize,
        offset,
        transaction: config.transaction,
      });

      if (batch.length === 0) {
        hasMore = false;
        break;
      }

      batchSizes.push(batch.length);
      metrics.totalBatches++;
      metrics.totalRecords += batch.length;

      // Process the batch
      await config.processBatch(batch);

      offset += config.batchSize;
      hasMore = batch.length === config.batchSize;
    }

    metrics.averageBatchSize = batchSizes.reduce((a, b) => a + b, 0) / batchSizes.length;
    metrics.executionTimeMs = Date.now() - startTime;
    metrics.throughput = (metrics.totalRecords / metrics.executionTimeMs) * 1000;

    logger.log(
      `Batch process stream complete: ${metrics.totalRecords} records in ${metrics.totalBatches} batches, ` +
        `${metrics.throughput.toFixed(2)} records/sec, ` +
        `peak ${metrics.memoryPeakMb.toFixed(2)}MB`,
    );

    return metrics;
  } catch (error) {
    logger.error('Batch process stream failed', error);
    throw new InternalServerErrorException('Batch process stream failed');
  }
}

/**
 * Create an async iterator for streaming query results
 */
export async function* createQueryIterator<M extends Model>(
  model: ModelCtor<M>,
  where: WhereOptions<Attributes<M>>,
  config: StreamConfig,
): AsyncGenerator<M, void, unknown> {
  const logger = new Logger('StreamingOperations::createQueryIterator');

  try {
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const batch = await model.findAll({
        where,
        limit: config.batchSize,
        offset,
        transaction: config.transaction,
      });

      if (batch.length === 0) {
        hasMore = false;
        break;
      }

      for (const record of batch) {
        yield record;
      }

      offset += config.batchSize;
      hasMore = batch.length === config.batchSize;

      // Handle backpressure
      if (config.backpressureThreshold) {
        const memUsage = process.memoryUsage();
        const heapUsedMb = memUsage.heapUsed / 1024 / 1024;

        if (heapUsedMb > config.backpressureThreshold) {
          logger.warn(`Backpressure: memory usage ${heapUsedMb.toFixed(2)}MB, pausing`);
          await delay(100);
          if (global.gc) {
            global.gc();
          }
        }
      }
    }

    logger.log(`Query iterator completed for ${model.name}`);
  } catch (error) {
    logger.error('Query iterator failed', error);
    throw new InternalServerErrorException('Query iterator failed');
  }
}

/**
 * Stream records with parallel processing
 */
export async function streamWithParallelProcessing<M extends Model>(
  model: ModelCtor<M>,
  where: WhereOptions<Attributes<M>>,
  config: StreamConfig & {
    concurrency: number;
    processor: (record: M) => Promise<void>;
  },
): Promise<StreamingMetrics> {
  const logger = new Logger('StreamingOperations::streamWithParallelProcessing');
  const startTime = Date.now();

  const metrics: StreamingMetrics = {
    totalRecords: 0,
    totalBatches: 0,
    averageBatchSize: 0,
    executionTimeMs: 0,
    throughput: 0,
    memoryPeakMb: 0,
    backpressureEvents: 0,
  };

  try {
    let offset = 0;
    let hasMore = true;
    const batchSizes: number[] = [];

    while (hasMore) {
      const memUsage = process.memoryUsage();
      const heapUsedMb = memUsage.heapUsed / 1024 / 1024;
      metrics.memoryPeakMb = Math.max(metrics.memoryPeakMb, heapUsedMb);

      if (config.backpressureThreshold && heapUsedMb > config.backpressureThreshold) {
        logger.warn(`Backpressure: memory usage ${heapUsedMb.toFixed(2)}MB, pausing`);
        metrics.backpressureEvents++;
        await delay(100);
        if (global.gc) {
          global.gc();
        }
      }

      const batch = await model.findAll({
        where,
        limit: config.batchSize,
        offset,
        transaction: config.transaction,
      });

      if (batch.length === 0) {
        hasMore = false;
        break;
      }

      batchSizes.push(batch.length);
      metrics.totalBatches++;

      // Process records in parallel with limited concurrency
      const semaphore = new Array(config.concurrency).fill(null);
      let processedInBatch = 0;

      const processRecord = async (record: M): Promise<void> => {
        await config.processor(record);
        processedInBatch++;
      };

      const promises: Promise<void>[] = [];
      for (const record of batch) {
        const promise = processRecord(record);
        promises.push(promise);

        if (promises.length >= config.concurrency) {
          await Promise.race(promises);
          const completedIndex = promises.findIndex((p) => p.then(() => true).catch(() => true));
          if (completedIndex !== -1) {
            promises.splice(completedIndex, 1);
          }
        }
      }

      // Wait for remaining promises
      await Promise.all(promises);
      metrics.totalRecords += processedInBatch;

      offset += config.batchSize;
      hasMore = batch.length === config.batchSize;
    }

    metrics.averageBatchSize = batchSizes.reduce((a, b) => a + b, 0) / batchSizes.length;
    metrics.executionTimeMs = Date.now() - startTime;
    metrics.throughput = (metrics.totalRecords / metrics.executionTimeMs) * 1000;

    logger.log(
      `Parallel stream processing complete: ${metrics.totalRecords} records, ` +
        `${metrics.throughput.toFixed(2)} records/sec, ` +
        `peak ${metrics.memoryPeakMb.toFixed(2)}MB`,
    );

    return metrics;
  } catch (error) {
    logger.error('Parallel stream processing failed', error);
    throw new InternalServerErrorException('Parallel stream processing failed');
  }
}
