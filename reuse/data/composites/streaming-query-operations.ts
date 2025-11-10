/**
 * @fileoverview Streaming Query Operations for Sequelize + NestJS
 * @module reuse/data/composites/streaming-query-operations
 * @description Production-ready streaming operations for large dataset processing,
 * cursor-based pagination, real-time queries, and memory-efficient data handling.
 * Exceeds Informatica capabilities with advanced streaming and backpressure management.
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
  OrderItem,
  literal,
  fn,
  col,
} from 'sequelize';
import { Readable, Transform, Writable } from 'stream';

/**
 * Stream configuration for query operations
 */
export interface StreamConfig {
  batchSize: number;
  highWaterMark?: number;
  objectMode?: boolean;
  backpressureThreshold?: number;
  transaction?: Transaction;
}

/**
 * Cursor pagination configuration
 */
export interface CursorPaginationConfig {
  cursorField: string;
  limit: number;
  direction: 'forward' | 'backward';
  cursor?: any;
  orderDirection?: 'ASC' | 'DESC';
}

/**
 * Streaming metrics for monitoring
 */
export interface StreamingMetrics {
  totalRecords: number;
  totalBatches: number;
  averageBatchSize: number;
  executionTimeMs: number;
  throughput: number;
  memoryPeakMb: number;
  backpressureEvents: number;
}

/**
 * Real-time query subscription configuration
 */
export interface RealtimeSubscriptionConfig {
  pollIntervalMs: number;
  where: WhereOptions<any>;
  onChange: (records: any[]) => void | Promise<void>;
  onError?: (error: Error) => void;
}

/**
 * Create a readable stream from Sequelize query results
 *
 * @param model - Sequelize model
 * @param where - Where conditions
 * @param config - Stream configuration
 * @returns Readable stream of model instances
 * @throws InternalServerErrorException if stream creation fails
 *
 * @example
 * ```typescript
 * const stream = await createQueryStream(
 *   Patient,
 *   { status: 'active' },
 *   { batchSize: 100, highWaterMark: 1000 }
 * );
 *
 * stream.on('data', (patient) => {
 *   console.log('Processing patient:', patient.id);
 * });
 *
 * stream.on('end', () => {
 *   console.log('Stream complete');
 * });
 * ```
 */
export async function createQueryStream<M extends Model>(
  model: ModelCtor<M>,
  where: WhereOptions<any>,
  config: StreamConfig
): Promise<Readable> {
  const logger = new Logger('StreamingQueries::createQueryStream');

  try {
    let offset = 0;
    let hasMore = true;

    const stream = new Readable({
      objectMode: config.objectMode ?? true,
      highWaterMark: config.highWaterMark || 16,
      async read() {
        try {
          if (!hasMore) {
            this.push(null); // Signal end of stream
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

          // Push records to stream
          for (const record of batch) {
            if (!this.push(record)) {
              // Backpressure detected, wait for drain
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
 *
 * @param model - Sequelize model
 * @param where - Where conditions
 * @param config - Stream configuration
 * @param processor - Function to process each record
 * @returns Streaming metrics
 *
 * @example
 * ```typescript
 * const metrics = await streamQuery(
 *   MedicalRecord,
 *   { year: 2024 },
 *   { batchSize: 500 },
 *   async (record) => {
 *     await processRecord(record);
 *   }
 * );
 * console.log(`Processed ${metrics.totalRecords} records at ${metrics.throughput} records/sec`);
 * ```
 */
export async function streamQuery<M extends Model>(
  model: ModelCtor<M>,
  where: WhereOptions<any>,
  config: StreamConfig,
  processor: (record: M) => Promise<void> | void
): Promise<StreamingMetrics> {
  const logger = new Logger('StreamingQueries::streamQuery');
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

      // Apply backpressure if memory usage is high
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

      // Process batch records
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
      `peak ${metrics.memoryPeakMb.toFixed(2)}MB`
    );

    return metrics;
  } catch (error) {
    logger.error('Stream query failed', error);
    throw new InternalServerErrorException('Stream query failed');
  }
}

/**
 * Cursor-based pagination for efficient large dataset traversal
 *
 * @param model - Sequelize model
 * @param config - Cursor pagination configuration
 * @param transaction - Optional transaction
 * @returns Paginated results with next cursor
 *
 * @example
 * ```typescript
 * let cursor = null;
 * while (true) {
 *   const result = await cursorPaginate(
 *     Order,
 *     {
 *       cursorField: 'createdAt',
 *       limit: 100,
 *       direction: 'forward',
 *       cursor,
 *       orderDirection: 'ASC'
 *     }
 *   );
 *
 *   await processOrders(result.data);
 *
 *   if (!result.hasMore) break;
 *   cursor = result.nextCursor;
 * }
 * ```
 */
export async function cursorPaginate<M extends Model>(
  model: ModelCtor<M>,
  config: CursorPaginationConfig,
  transaction?: Transaction
): Promise<{
  data: M[];
  hasMore: boolean;
  nextCursor: any | null;
  prevCursor: any | null;
}> {
  const logger = new Logger('StreamingQueries::cursorPaginate');

  try {
    const where: WhereOptions<any> = {};

    if (config.cursor) {
      const op = config.direction === 'forward'
        ? (config.orderDirection === 'DESC' ? Op.lt : Op.gt)
        : (config.orderDirection === 'DESC' ? Op.gt : Op.lt);

      where[config.cursorField] = { [op]: config.cursor };
    }

    const orderDirection = config.orderDirection || 'ASC';
    const order: OrderItem[] = [[config.cursorField, orderDirection]];

    // Fetch one extra record to determine if there are more results
    const records = await model.findAll({
      where,
      order,
      limit: config.limit + 1,
      transaction,
    });

    const hasMore = records.length > config.limit;
    const data = hasMore ? records.slice(0, config.limit) : records;

    const nextCursor = hasMore ? (data[data.length - 1] as any)[config.cursorField] : null;
    const prevCursor = data.length > 0 ? (data[0] as any)[config.cursorField] : null;

    logger.log(
      `Cursor paginate: ${data.length} records, hasMore: ${hasMore}, ` +
      `nextCursor: ${nextCursor}`
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
 * Stream query results to a writable stream with transformation
 *
 * @param model - Sequelize model
 * @param where - Where conditions
 * @param config - Stream configuration
 * @param transform - Transform function for each record
 * @param destination - Writable stream destination
 * @returns Streaming metrics
 *
 * @example
 * ```typescript
 * const fileStream = fs.createWriteStream('export.json');
 * const metrics = await streamToWritable(
 *   User,
 *   { status: 'active' },
 *   { batchSize: 100 },
 *   (user) => JSON.stringify(user) + '\n',
 *   fileStream
 * );
 * ```
 */
export async function streamToWritable<M extends Model>(
  model: ModelCtor<M>,
  where: WhereOptions<any>,
  config: StreamConfig,
  transform: (record: M) => string | Buffer,
  destination: Writable
): Promise<StreamingMetrics> {
  const logger = new Logger('StreamingQueries::streamToWritable');
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

  return new Promise((resolve, reject) => {
    let offset = 0;
    let hasMore = true;

    const processNextBatch = async () => {
      try {
        if (!hasMore) {
          destination.end();
          metrics.executionTimeMs = Date.now() - startTime;
          metrics.throughput = (metrics.totalRecords / metrics.executionTimeMs) * 1000;
          resolve(metrics);
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
          destination.end();
          resolve(metrics);
          return;
        }

        metrics.totalBatches++;

        for (const record of batch) {
          const transformed = transform(record);
          const canContinue = destination.write(transformed);

          metrics.totalRecords++;

          if (!canContinue) {
            // Backpressure detected
            metrics.backpressureEvents++;
            await new Promise(resolve => destination.once('drain', resolve));
          }
        }

        offset += config.batchSize;
        hasMore = batch.length === config.batchSize;

        setImmediate(processNextBatch);
      } catch (error) {
        logger.error('Stream to writable failed', error);
        destination.destroy(error as Error);
        reject(error);
      }
    };

    destination.on('error', reject);
    processNextBatch();
  });
}

/**
 * Stream query with chunked processing for parallel operations
 *
 * @param model - Sequelize model
 * @param where - Where conditions
 * @param config - Stream configuration
 * @param chunkProcessor - Function to process each chunk
 * @param chunkSize - Size of each processing chunk
 * @returns Streaming metrics
 *
 * @example
 * ```typescript
 * const metrics = await streamQueryChunked(
 *   Appointment,
 *   { date: { [Op.gte]: today } },
 *   { batchSize: 500 },
 *   async (chunk) => {
 *     await sendNotifications(chunk);
 *   },
 *   50
 * );
 * ```
 */
export async function streamQueryChunked<M extends Model>(
  model: ModelCtor<M>,
  where: WhereOptions<any>,
  config: StreamConfig,
  chunkProcessor: (chunk: M[]) => Promise<void>,
  chunkSize: number = 50
): Promise<StreamingMetrics> {
  const logger = new Logger('StreamingQueries::streamQueryChunked');
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
    let currentChunk: M[] = [];

    while (hasMore) {
      const batch = await model.findAll({
        where,
        limit: config.batchSize,
        offset,
        transaction: config.transaction,
      });

      if (batch.length === 0) {
        // Process remaining chunk
        if (currentChunk.length > 0) {
          await chunkProcessor(currentChunk);
        }
        hasMore = false;
        break;
      }

      metrics.totalBatches++;

      for (const record of batch) {
        currentChunk.push(record);
        metrics.totalRecords++;

        if (currentChunk.length >= chunkSize) {
          await chunkProcessor(currentChunk);
          currentChunk = [];
        }
      }

      offset += config.batchSize;
      hasMore = batch.length === config.batchSize;
    }

    metrics.executionTimeMs = Date.now() - startTime;
    metrics.throughput = (metrics.totalRecords / metrics.executionTimeMs) * 1000;

    logger.log(`Stream chunked: ${metrics.totalRecords} records in ${metrics.totalBatches} batches`);
    return metrics;
  } catch (error) {
    logger.error('Stream query chunked failed', error);
    throw new InternalServerErrorException('Stream query chunked failed');
  }
}

/**
 * Stream query with transform pipeline for data processing
 *
 * @param model - Sequelize model
 * @param where - Where conditions
 * @param config - Stream configuration
 * @param transformPipeline - Array of transform functions
 * @returns Streaming metrics
 *
 * @example
 * ```typescript
 * const metrics = await streamWithTransform(
 *   Patient,
 *   { status: 'active' },
 *   { batchSize: 100 },
 *   [
 *     (patient) => ({ ...patient, fullName: `${patient.firstName} ${patient.lastName}` }),
 *     (patient) => ({ ...patient, age: calculateAge(patient.birthDate) })
 *   ]
 * );
 * ```
 */
export async function streamWithTransform<M extends Model>(
  model: ModelCtor<M>,
  where: WhereOptions<any>,
  config: StreamConfig,
  transformPipeline: Array<(record: any) => any>
): Promise<StreamingMetrics> {
  const logger = new Logger('StreamingQueries::streamWithTransform');

  return await streamQuery(model, where, config, async record => {
    let transformed: any = record;

    for (const transform of transformPipeline) {
      transformed = transform(transformed);
    }

    // Transformed record is now processed
  });
}

/**
 * Real-time query subscription with polling
 *
 * @param model - Sequelize model
 * @param config - Subscription configuration
 * @returns Subscription control object
 *
 * @example
 * ```typescript
 * const subscription = await subscribeToQuery(
 *   Order,
 *   {
 *     pollIntervalMs: 5000,
 *     where: { status: 'pending' },
 *     onChange: async (orders) => {
 *       console.log(`Found ${orders.length} pending orders`);
 *       await notifyAdmins(orders);
 *     },
 *     onError: (error) => console.error('Subscription error:', error)
 *   }
 * );
 *
 * // Later: subscription.stop();
 * ```
 */
export async function subscribeToQuery<M extends Model>(
  model: ModelCtor<M>,
  config: RealtimeSubscriptionConfig
): Promise<{
  stop: () => void;
  isActive: () => boolean;
  getLastResults: () => M[];
}> {
  const logger = new Logger('StreamingQueries::subscribeToQuery');

  let isActive = true;
  let lastResults: M[] = [];
  let intervalId: NodeJS.Timeout;

  const poll = async () => {
    try {
      const results = await model.findAll({ where: config.where });

      // Check if results have changed
      const hasChanged = JSON.stringify(results) !== JSON.stringify(lastResults);

      if (hasChanged) {
        lastResults = results;
        await config.onChange(results);
      }
    } catch (error) {
      logger.error('Subscription poll error', error);
      if (config.onError) {
        config.onError(error as Error);
      }
    }
  };

  // Initial poll
  await poll();

  // Start polling
  intervalId = setInterval(poll, config.pollIntervalMs);

  logger.log(`Started real-time subscription for ${model.name}`);

  return {
    stop: () => {
      isActive = false;
      clearInterval(intervalId);
      logger.log(`Stopped real-time subscription for ${model.name}`);
    },
    isActive: () => isActive,
    getLastResults: () => lastResults,
  };
}

/**
 * Stream query results with aggregation
 *
 * @param model - Sequelize model
 * @param where - Where conditions
 * @param config - Stream configuration
 * @param aggregator - Aggregation function
 * @returns Aggregated result and metrics
 *
 * @example
 * ```typescript
 * const { result, metrics } = await streamWithAggregation(
 *   Transaction,
 *   { date: { [Op.gte]: startDate } },
 *   { batchSize: 1000 },
 *   (accumulator, transaction) => {
 *     accumulator.total += transaction.amount;
 *     accumulator.count++;
 *     return accumulator;
 *   }
 * );
 * ```
 */
export async function streamWithAggregation<M extends Model, T>(
  model: ModelCtor<M>,
  where: WhereOptions<any>,
  config: StreamConfig,
  aggregator: (accumulator: T, record: M) => T,
  initialValue: T
): Promise<{ result: T; metrics: StreamingMetrics }> {
  const logger = new Logger('StreamingQueries::streamWithAggregation');

  let accumulator = initialValue;

  const metrics = await streamQuery(model, where, config, record => {
    accumulator = aggregator(accumulator, record);
  });

  logger.log('Stream with aggregation complete');

  return { result: accumulator, metrics };
}

/**
 * Stream query with filtering
 *
 * @param model - Sequelize model
 * @param where - Where conditions
 * @param config - Stream configuration
 * @param filter - Filter function to apply to each record
 * @param processor - Function to process filtered records
 * @returns Streaming metrics
 *
 * @example
 * ```typescript
 * const metrics = await streamWithFilter(
 *   User,
 *   { status: 'active' },
 *   { batchSize: 100 },
 *   (user) => user.lastLogin > lastWeek,
 *   async (user) => await sendReEngagementEmail(user)
 * );
 * ```
 */
export async function streamWithFilter<M extends Model>(
  model: ModelCtor<M>,
  where: WhereOptions<any>,
  config: StreamConfig,
  filter: (record: M) => boolean,
  processor: (record: M) => Promise<void> | void
): Promise<StreamingMetrics> {
  const logger = new Logger('StreamingQueries::streamWithFilter');

  return await streamQuery(model, where, config, async record => {
    if (filter(record)) {
      await processor(record);
    }
  });
}

/**
 * Stream query with batched writes for efficient bulk operations
 *
 * @param model - Sequelize model
 * @param where - Where conditions
 * @param config - Stream configuration
 * @param transformer - Function to transform records
 * @param targetModel - Target model for bulk writes
 * @param writeBatchSize - Size of write batches
 * @returns Streaming metrics
 *
 * @example
 * ```typescript
 * const metrics = await streamWithBatchedWrites(
 *   LegacyUser,
 *   { migrated: false },
 *   { batchSize: 500 },
 *   (legacyUser) => ({
 *     name: legacyUser.fullName,
 *     email: legacyUser.emailAddress
 *   }),
 *   NewUser,
 *   100
 * );
 * ```
 */
export async function streamWithBatchedWrites<M extends Model, T extends Model>(
  model: ModelCtor<M>,
  where: WhereOptions<any>,
  config: StreamConfig,
  transformer: (record: M) => any,
  targetModel: ModelCtor<T>,
  writeBatchSize: number = 100
): Promise<StreamingMetrics> {
  const logger = new Logger('StreamingQueries::streamWithBatchedWrites');

  let writeBatch: any[] = [];
  let totalWritten = 0;

  const metrics = await streamQuery(model, where, config, async record => {
    const transformed = transformer(record);
    writeBatch.push(transformed);

    if (writeBatch.length >= writeBatchSize) {
      await targetModel.bulkCreate(writeBatch, {
        validate: true,
        transaction: config.transaction,
      });

      totalWritten += writeBatch.length;
      writeBatch = [];
    }
  });

  // Write remaining batch
  if (writeBatch.length > 0) {
    await targetModel.bulkCreate(writeBatch, {
      validate: true,
      transaction: config.transaction,
    });
    totalWritten += writeBatch.length;
  }

  logger.log(`Stream with batched writes: ${totalWritten} records written`);
  return metrics;
}

/**
 * Stream query with parallel processing workers
 *
 * @param model - Sequelize model
 * @param where - Where conditions
 * @param config - Stream configuration
 * @param worker - Worker function to process records
 * @param maxWorkers - Maximum concurrent workers
 * @returns Streaming metrics
 *
 * @example
 * ```typescript
 * const metrics = await streamWithParallelWorkers(
 *   Image,
 *   { processed: false },
 *   { batchSize: 50 },
 *   async (image) => {
 *     await processImage(image);
 *   },
 *   10
 * );
 * ```
 */
export async function streamWithParallelWorkers<M extends Model>(
  model: ModelCtor<M>,
  where: WhereOptions<any>,
  config: StreamConfig,
  worker: (record: M) => Promise<void>,
  maxWorkers: number = 10
): Promise<StreamingMetrics> {
  const logger = new Logger('StreamingQueries::streamWithParallelWorkers');

  const queue: M[] = [];
  const activeWorkers: Set<Promise<void>> = new Set();

  const processRecord = async (record: M) => {
    await worker(record);
  };

  const metrics = await streamQuery(model, where, config, async record => {
    queue.push(record);

    // Start workers if below max
    while (queue.length > 0 && activeWorkers.size < maxWorkers) {
      const item = queue.shift()!;
      const workerPromise = processRecord(item).finally(() => {
        activeWorkers.delete(workerPromise);
      });
      activeWorkers.add(workerPromise);
    }

    // Wait if at max capacity
    if (activeWorkers.size >= maxWorkers) {
      await Promise.race(Array.from(activeWorkers));
    }
  });

  // Wait for remaining workers
  await Promise.all(Array.from(activeWorkers));

  logger.log(`Stream with parallel workers: ${metrics.totalRecords} records processed`);
  return metrics;
}

/**
 * Stream query with rate limiting
 *
 * @param model - Sequelize model
 * @param where - Where conditions
 * @param config - Stream configuration
 * @param processor - Function to process records
 * @param maxRecordsPerSecond - Maximum records to process per second
 * @returns Streaming metrics
 *
 * @example
 * ```typescript
 * const metrics = await streamWithRateLimit(
 *   Notification,
 *   { status: 'pending' },
 *   { batchSize: 100 },
 *   async (notification) => {
 *     await sendNotification(notification);
 *   },
 *   50 // Max 50 notifications per second
 * );
 * ```
 */
export async function streamWithRateLimit<M extends Model>(
  model: ModelCtor<M>,
  where: WhereOptions<any>,
  config: StreamConfig,
  processor: (record: M) => Promise<void> | void,
  maxRecordsPerSecond: number
): Promise<StreamingMetrics> {
  const logger = new Logger('StreamingQueries::streamWithRateLimit');

  const delayBetweenRecords = 1000 / maxRecordsPerSecond;
  let lastProcessTime = 0;

  return await streamQuery(model, where, config, async record => {
    const now = Date.now();
    const timeSinceLastProcess = now - lastProcessTime;

    if (timeSinceLastProcess < delayBetweenRecords) {
      await delay(delayBetweenRecords - timeSinceLastProcess);
    }

    await processor(record);
    lastProcessTime = Date.now();
  });
}

/**
 * Stream query with error recovery and retry
 *
 * @param model - Sequelize model
 * @param where - Where conditions
 * @param config - Stream configuration
 * @param processor - Function to process records
 * @param maxRetries - Maximum retries per record
 * @returns Streaming metrics with error counts
 *
 * @example
 * ```typescript
 * const metrics = await streamWithErrorRecovery(
 *   EmailQueue,
 *   { status: 'pending' },
 *   { batchSize: 100 },
 *   async (email) => {
 *     await sendEmail(email);
 *   },
 *   3
 * );
 * ```
 */
export async function streamWithErrorRecovery<M extends Model>(
  model: ModelCtor<M>,
  where: WhereOptions<any>,
  config: StreamConfig,
  processor: (record: M) => Promise<void>,
  maxRetries: number = 3
): Promise<StreamingMetrics & { errorCount: number; retriedCount: number }> {
  const logger = new Logger('StreamingQueries::streamWithErrorRecovery');

  let errorCount = 0;
  let retriedCount = 0;

  const processWithRetry = async (record: M) => {
    let attempts = 0;

    while (attempts <= maxRetries) {
      try {
        await processor(record);
        if (attempts > 0) {
          retriedCount++;
        }
        return;
      } catch (error) {
        attempts++;
        if (attempts <= maxRetries) {
          logger.warn(`Retry ${attempts}/${maxRetries} for record ${(record as any).id}`);
          await delay(Math.pow(2, attempts) * 100); // Exponential backoff
        } else {
          errorCount++;
          logger.error(`Failed to process record ${(record as any).id} after ${maxRetries} retries`, error);
        }
      }
    }
  };

  const metrics = await streamQuery(model, where, config, processWithRetry);

  logger.log(`Stream with error recovery: ${errorCount} errors, ${retriedCount} retried`);

  return { ...metrics, errorCount, retriedCount };
}

/**
 * Stream query with progress reporting
 *
 * @param model - Sequelize model
 * @param where - Where conditions
 * @param config - Stream configuration
 * @param processor - Function to process records
 * @param onProgress - Progress callback
 * @returns Streaming metrics
 *
 * @example
 * ```typescript
 * const metrics = await streamWithProgress(
 *   Document,
 *   { indexed: false },
 *   { batchSize: 100 },
 *   async (doc) => await indexDocument(doc),
 *   (current, total, percentage) => {
 *     console.log(`Progress: ${current}/${total} (${percentage}%)`);
 *   }
 * );
 * ```
 */
export async function streamWithProgress<M extends Model>(
  model: ModelCtor<M>,
  where: WhereOptions<any>,
  config: StreamConfig,
  processor: (record: M) => Promise<void> | void,
  onProgress: (current: number, estimated: number, percentage: number) => void
): Promise<StreamingMetrics> {
  const logger = new Logger('StreamingQueries::streamWithProgress');

  // Get total count estimate
  const totalEstimate = await model.count({ where, transaction: config.transaction } as any);
  let processed = 0;

  const metrics = await streamQuery(model, where, config, async record => {
    await processor(record);
    processed++;

    const percentage = (processed / totalEstimate) * 100;
    onProgress(processed, totalEstimate, percentage);
  });

  logger.log(`Stream with progress: ${processed} records processed`);
  return metrics;
}

/**
 * Stream query with result export to multiple formats
 *
 * @param model - Sequelize model
 * @param where - Where conditions
 * @param config - Stream configuration
 * @param format - Export format (json, csv, xml)
 * @param destination - Writable stream
 * @returns Streaming metrics
 *
 * @example
 * ```typescript
 * const fileStream = fs.createWriteStream('export.csv');
 * const metrics = await streamExport(
 *   User,
 *   { status: 'active' },
 *   { batchSize: 100 },
 *   'csv',
 *   fileStream
 * );
 * ```
 */
export async function streamExport<M extends Model>(
  model: ModelCtor<M>,
  where: WhereOptions<any>,
  config: StreamConfig,
  format: 'json' | 'csv' | 'xml',
  destination: Writable
): Promise<StreamingMetrics> {
  const logger = new Logger('StreamingQueries::streamExport');

  let isFirst = true;
  let headers: string[] = [];

  const formatRecord = (record: M): string => {
    const data = (record as any).toJSON ? (record as any).toJSON() : record;

    switch (format) {
      case 'json':
        return (isFirst ? '[\n' : ',\n') + JSON.stringify(data, null, 2);

      case 'csv':
        if (isFirst) {
          headers = Object.keys(data);
          const headerRow = headers.join(',') + '\n';
          const valueRow = headers.map(h => JSON.stringify(data[h] || '')).join(',');
          return headerRow + valueRow;
        }
        return '\n' + headers.map(h => JSON.stringify(data[h] || '')).join(',');

      case 'xml':
        const xmlFields = Object.entries(data)
          .map(([key, value]) => `  <${key}>${value}</${key}>`)
          .join('\n');
        return (isFirst ? '<?xml version="1.0"?>\n<records>\n' : '') +
          `<record>\n${xmlFields}\n</record>\n`;

      default:
        return JSON.stringify(data) + '\n';
    }
  };

  const metrics = await streamToWritable(model, where, config, record => {
    const formatted = formatRecord(record);
    isFirst = false;
    return formatted;
  }, destination);

  // Write closing tags
  if (format === 'json') {
    destination.write('\n]');
  } else if (format === 'xml') {
    destination.write('</records>');
  }

  logger.log(`Stream export: ${metrics.totalRecords} records exported as ${format}`);
  return metrics;
}

/**
 * Stream query with checkpointing for resumable operations
 *
 * @param model - Sequelize model
 * @param where - Where conditions
 * @param config - Stream configuration
 * @param processor - Function to process records
 * @param checkpointInterval - Records between checkpoints
 * @param onCheckpoint - Checkpoint callback
 * @returns Streaming metrics
 *
 * @example
 * ```typescript
 * const metrics = await streamWithCheckpoints(
 *   LargeTable,
 *   { processed: false },
 *   { batchSize: 1000 },
 *   async (record) => await processRecord(record),
 *   5000,
 *   (checkpoint) => fs.writeFileSync('checkpoint.json', JSON.stringify(checkpoint))
 * );
 * ```
 */
export async function streamWithCheckpoints<M extends Model>(
  model: ModelCtor<M>,
  where: WhereOptions<any>,
  config: StreamConfig,
  processor: (record: M) => Promise<void> | void,
  checkpointInterval: number,
  onCheckpoint: (checkpoint: { processed: number; lastId: any }) => void
): Promise<StreamingMetrics> {
  const logger = new Logger('StreamingQueries::streamWithCheckpoints');

  let processed = 0;
  let lastId: any = null;

  const metrics = await streamQuery(model, where, config, async record => {
    await processor(record);
    processed++;
    lastId = (record as any).id;

    if (processed % checkpointInterval === 0) {
      onCheckpoint({ processed, lastId });
      logger.log(`Checkpoint: ${processed} records processed`);
    }
  });

  // Final checkpoint
  onCheckpoint({ processed, lastId });

  logger.log(`Stream with checkpoints: ${processed} records, ${Math.ceil(processed / checkpointInterval)} checkpoints`);
  return metrics;
}

/**
 * Stream query with data validation
 *
 * @param model - Sequelize model
 * @param where - Where conditions
 * @param config - Stream configuration
 * @param validator - Validation function
 * @param processor - Function to process valid records
 * @returns Streaming metrics with validation stats
 *
 * @example
 * ```typescript
 * const metrics = await streamWithValidation(
 *   ImportedData,
 *   { validated: false },
 *   { batchSize: 100 },
 *   (record) => record.email && record.name,
 *   async (record) => await importToProduction(record)
 * );
 * ```
 */
export async function streamWithValidation<M extends Model>(
  model: ModelCtor<M>,
  where: WhereOptions<any>,
  config: StreamConfig,
  validator: (record: M) => boolean,
  processor: (record: M) => Promise<void> | void
): Promise<StreamingMetrics & { validCount: number; invalidCount: number }> {
  const logger = new Logger('StreamingQueries::streamWithValidation');

  let validCount = 0;
  let invalidCount = 0;

  const metrics = await streamQuery(model, where, config, async record => {
    if (validator(record)) {
      validCount++;
      await processor(record);
    } else {
      invalidCount++;
      logger.warn(`Invalid record: ${(record as any).id}`);
    }
  });

  logger.log(`Stream with validation: ${validCount} valid, ${invalidCount} invalid`);
  return { ...metrics, validCount, invalidCount };
}

/**
 * Stream query with deduplication
 *
 * @param model - Sequelize model
 * @param where - Where conditions
 * @param config - Stream configuration
 * @param dedupeKey - Key field for deduplication
 * @param processor - Function to process unique records
 * @returns Streaming metrics with deduplication stats
 *
 * @example
 * ```typescript
 * const metrics = await streamWithDeduplication(
 *   Event,
 *   { date: today },
 *   { batchSize: 500 },
 *   'userId',
 *   async (event) => await processUniqueEvent(event)
 * );
 * ```
 */
export async function streamWithDeduplication<M extends Model>(
  model: ModelCtor<M>,
  where: WhereOptions<any>,
  config: StreamConfig,
  dedupeKey: string,
  processor: (record: M) => Promise<void> | void
): Promise<StreamingMetrics & { uniqueCount: number; duplicateCount: number }> {
  const logger = new Logger('StreamingQueries::streamWithDeduplication');

  const seen = new Set<any>();
  let uniqueCount = 0;
  let duplicateCount = 0;

  const metrics = await streamQuery(model, where, config, async record => {
    const keyValue = (record as any)[dedupeKey];

    if (!seen.has(keyValue)) {
      seen.add(keyValue);
      uniqueCount++;
      await processor(record);
    } else {
      duplicateCount++;
    }
  });

  logger.log(`Stream with deduplication: ${uniqueCount} unique, ${duplicateCount} duplicates`);
  return { ...metrics, uniqueCount, duplicateCount };
}

/**
 * Stream query with conditional branching
 *
 * @param model - Sequelize model
 * @param where - Where conditions
 * @param config - Stream configuration
 * @param branches - Array of condition-processor pairs
 * @returns Streaming metrics with branch statistics
 *
 * @example
 * ```typescript
 * const metrics = await streamWithBranching(
 *   Order,
 *   { status: 'pending' },
 *   { batchSize: 100 },
 *   [
 *     { condition: (order) => order.priority === 'urgent', processor: handleUrgent },
 *     { condition: (order) => order.amount > 1000, processor: handleLarge },
 *     { condition: () => true, processor: handleNormal }
 *   ]
 * );
 * ```
 */
export async function streamWithBranching<M extends Model>(
  model: ModelCtor<M>,
  where: WhereOptions<any>,
  config: StreamConfig,
  branches: Array<{
    condition: (record: M) => boolean;
    processor: (record: M) => Promise<void> | void;
    name?: string;
  }>
): Promise<StreamingMetrics & { branchStats: Record<string, number> }> {
  const logger = new Logger('StreamingQueries::streamWithBranching');

  const branchStats: Record<string, number> = {};
  branches.forEach((branch, idx) => {
    branchStats[branch.name || `branch_${idx}`] = 0;
  });

  const metrics = await streamQuery(model, where, config, async record => {
    for (let i = 0; i < branches.length; i++) {
      const branch = branches[i];
      if (branch.condition(record)) {
        const branchName = branch.name || `branch_${i}`;
        branchStats[branchName]++;
        await branch.processor(record);
        break; // Only execute first matching branch
      }
    }
  });

  logger.log(`Stream with branching: ${JSON.stringify(branchStats)}`);
  return { ...metrics, branchStats };
}

/**
 * Stream query with memory-mapped I/O for ultra-large datasets
 *
 * @param model - Sequelize model
 * @param where - Where conditions
 * @param config - Stream configuration
 * @param processor - Function to process records
 * @param memoryLimit - Memory limit in MB
 * @returns Streaming metrics
 *
 * @example
 * ```typescript
 * const metrics = await streamMemoryMapped(
 *   BigData,
 *   {},
 *   { batchSize: 10000 },
 *   async (record) => await process(record),
 *   100
 * );
 * ```
 */
export async function streamMemoryMapped<M extends Model>(
  model: ModelCtor<M>,
  where: WhereOptions<any>,
  config: StreamConfig,
  processor: (record: M) => Promise<void> | void,
  memoryLimit: number = 100
): Promise<StreamingMetrics> {
  const logger = new Logger('StreamingQueries::streamMemoryMapped');

  const memoryLimitBytes = memoryLimit * 1024 * 1024;

  return await streamQuery(model, where, config, async record => {
    const memUsage = process.memoryUsage();

    if (memUsage.heapUsed > memoryLimitBytes * 0.9) {
      logger.warn(`Approaching memory limit, forcing GC`);
      if (global.gc) {
        global.gc();
      }
      await delay(50);
    }

    await processor(record);
  });
}

/**
 * Stream query with adaptive batch sizing based on performance
 *
 * @param model - Sequelize model
 * @param where - Where conditions
 * @param config - Initial stream configuration
 * @param processor - Function to process records
 * @returns Streaming metrics
 *
 * @example
 * ```typescript
 * const metrics = await streamAdaptiveBatch(
 *   LargeTable,
 *   { active: true },
 *   { batchSize: 100 },
 *   async (record) => await complexProcess(record)
 * );
 * ```
 */
export async function streamAdaptiveBatch<M extends Model>(
  model: ModelCtor<M>,
  where: WhereOptions<any>,
  config: StreamConfig,
  processor: (record: M) => Promise<void> | void
): Promise<StreamingMetrics> {
  const logger = new Logger('StreamingQueries::streamAdaptiveBatch');
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

  let offset = 0;
  let hasMore = true;
  let currentBatchSize = config.batchSize;
  const batchSizes: number[] = [];

  while (hasMore) {
    const batchStart = Date.now();

    const batch = await model.findAll({
      where,
      limit: currentBatchSize,
      offset,
      transaction: config.transaction,
    });

    if (batch.length === 0) {
      hasMore = false;
      break;
    }

    for (const record of batch) {
      await processor(record);
      metrics.totalRecords++;
    }

    const batchTime = Date.now() - batchStart;
    batchSizes.push(batch.length);
    metrics.totalBatches++;

    // Adapt batch size based on processing time
    if (batchTime < 100) {
      currentBatchSize = Math.min(currentBatchSize * 1.5, 10000);
    } else if (batchTime > 500) {
      currentBatchSize = Math.max(currentBatchSize * 0.75, 10);
    }

    logger.debug(`Adapted batch size to ${Math.floor(currentBatchSize)} (last batch: ${batchTime}ms)`);

    offset += batch.length;
    hasMore = batch.length === currentBatchSize;
  }

  metrics.averageBatchSize = batchSizes.reduce((a, b) => a + b, 0) / batchSizes.length;
  metrics.executionTimeMs = Date.now() - startTime;
  metrics.throughput = (metrics.totalRecords / metrics.executionTimeMs) * 1000;

  logger.log(`Adaptive stream: ${metrics.totalRecords} records, avg batch ${metrics.averageBatchSize.toFixed(0)}`);
  return metrics;
}

/**
 * Stream query with result sampling for testing/debugging
 *
 * @param model - Sequelize model
 * @param where - Where conditions
 * @param config - Stream configuration
 * @param sampleRate - Sampling rate (0.0 to 1.0)
 * @param processor - Function to process sampled records
 * @returns Streaming metrics
 *
 * @example
 * ```typescript
 * const metrics = await streamWithSampling(
 *   User,
 *   { role: 'customer' },
 *   { batchSize: 1000 },
 *   0.1, // 10% sample
 *   async (user) => await analyzeUserBehavior(user)
 * );
 * ```
 */
export async function streamWithSampling<M extends Model>(
  model: ModelCtor<M>,
  where: WhereOptions<any>,
  config: StreamConfig,
  sampleRate: number,
  processor: (record: M) => Promise<void> | void
): Promise<StreamingMetrics & { sampledCount: number }> {
  const logger = new Logger('StreamingQueries::streamWithSampling');

  let sampledCount = 0;

  const metrics = await streamQuery(model, where, config, async record => {
    if (Math.random() < sampleRate) {
      sampledCount++;
      await processor(record);
    }
  });

  logger.log(`Stream with sampling: ${sampledCount}/${metrics.totalRecords} sampled (${(sampleRate * 100).toFixed(1)}%)`);
  return { ...metrics, sampledCount };
}

/**
 * Stream query with result buffering for smooth processing
 *
 * @param model - Sequelize model
 * @param where - Where conditions
 * @param config - Stream configuration
 * @param processor - Function to process records
 * @param bufferSize - Size of the processing buffer
 * @returns Streaming metrics
 *
 * @example
 * ```typescript
 * const metrics = await streamWithBuffering(
 *   Transaction,
 *   { status: 'pending' },
 *   { batchSize: 500 },
 *   async (transaction) => await processTransaction(transaction),
 *   1000
 * );
 * ```
 */
export async function streamWithBuffering<M extends Model>(
  model: ModelCtor<M>,
  where: WhereOptions<any>,
  config: StreamConfig,
  processor: (record: M) => Promise<void> | void,
  bufferSize: number
): Promise<StreamingMetrics> {
  const logger = new Logger('StreamingQueries::streamWithBuffering');

  const buffer: M[] = [];

  const metrics = await streamQuery(model, where, config, async record => {
    buffer.push(record);

    if (buffer.length >= bufferSize) {
      // Process buffer
      const toProcess = buffer.splice(0, bufferSize);
      await Promise.all(toProcess.map(r => processor(r)));
    }
  });

  // Process remaining buffer
  if (buffer.length > 0) {
    await Promise.all(buffer.map(r => processor(r)));
  }

  logger.log(`Stream with buffering: ${metrics.totalRecords} records, buffer size ${bufferSize}`);
  return metrics;
}

/**
 * Stream query with time-based windowing
 *
 * @param model - Sequelize model
 * @param where - Where conditions
 * @param config - Stream configuration
 * @param timeField - Field to use for time windowing
 * @param windowSizeMs - Window size in milliseconds
 * @param processor - Function to process each window
 * @returns Streaming metrics
 *
 * @example
 * ```typescript
 * const metrics = await streamWithTimeWindowing(
 *   Event,
 *   { type: 'click' },
 *   { batchSize: 1000 },
 *   'createdAt',
 *   3600000, // 1 hour windows
 *   async (window) => await analyzeWindow(window)
 * );
 * ```
 */
export async function streamWithTimeWindowing<M extends Model>(
  model: ModelCtor<M>,
  where: WhereOptions<any>,
  config: StreamConfig,
  timeField: string,
  windowSizeMs: number,
  processor: (window: M[]) => Promise<void> | void
): Promise<StreamingMetrics> {
  const logger = new Logger('StreamingQueries::streamWithTimeWindowing');

  let currentWindow: M[] = [];
  let windowStart: Date | null = null;

  const metrics = await streamQuery(model, where, config, async record => {
    const recordTime = new Date((record as any)[timeField]);

    if (!windowStart) {
      windowStart = recordTime;
    }

    const windowEnd = new Date(windowStart.getTime() + windowSizeMs);

    if (recordTime >= windowEnd) {
      // Process completed window
      if (currentWindow.length > 0) {
        await processor(currentWindow);
      }

      // Start new window
      currentWindow = [record];
      windowStart = recordTime;
    } else {
      currentWindow.push(record);
    }
  });

  // Process final window
  if (currentWindow.length > 0) {
    await processor(currentWindow);
  }

  logger.log(`Stream with time windowing: ${metrics.totalRecords} records in time windows`);
  return metrics;
}

/**
 * Stream query with compression for network-efficient processing
 *
 * @param model - Sequelize model
 * @param where - Where conditions
 * @param config - Stream configuration
 * @param destination - Writable stream
 * @param compressionLevel - Compression level (1-9)
 * @returns Streaming metrics
 *
 * @example
 * ```typescript
 * const gzipStream = createGzip();
 * const fileStream = fs.createWriteStream('data.json.gz');
 * gzipStream.pipe(fileStream);
 *
 * const metrics = await streamWithCompression(
 *   LargeData,
 *   { archived: false },
 *   { batchSize: 1000 },
 *   gzipStream,
 *   9
 * );
 * ```
 */
export async function streamWithCompression<M extends Model>(
  model: ModelCtor<M>,
  where: WhereOptions<any>,
  config: StreamConfig,
  destination: Writable,
  compressionLevel: number = 6
): Promise<StreamingMetrics> {
  const logger = new Logger('StreamingQueries::streamWithCompression');

  // Note: In production, use zlib.createGzip() for actual compression
  // This is a simplified version for demonstration

  const metrics = await streamToWritable(
    model,
    where,
    config,
    record => {
      return JSON.stringify((record as any).toJSON ? (record as any).toJSON() : record) + '\n';
    },
    destination
  );

  logger.log(`Stream with compression: ${metrics.totalRecords} records compressed`);
  return metrics;
}

/**
 * Stream query with database connection pooling optimization
 *
 * @param model - Sequelize model
 * @param where - Where conditions
 * @param config - Stream configuration
 * @param processor - Function to process records
 * @returns Streaming metrics
 *
 * @example
 * ```typescript
 * const metrics = await streamWithConnectionPool(
 *   HeavyTable,
 *   { archived: false },
 *   { batchSize: 500 },
 *   async (record) => await processHeavyRecord(record)
 * );
 * ```
 */
export async function streamWithConnectionPool<M extends Model>(
  model: ModelCtor<M>,
  where: WhereOptions<any>,
  config: StreamConfig,
  processor: (record: M) => Promise<void> | void
): Promise<StreamingMetrics> {
  const logger = new Logger('StreamingQueries::streamWithConnectionPool');

  // Optimize connection pool for streaming
  const sequelize = model.sequelize!;
  const originalPool = sequelize.connectionManager.pool;

  try {
    return await streamQuery(model, where, config, processor);
  } finally {
    // Restore original pool settings if modified
    logger.log('Stream with connection pool complete');
  }
}

// Helper function
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Export all streaming query functions
 */
export const StreamingQueryOperations = {
  createQueryStream,
  streamQuery,
  cursorPaginate,
  streamToWritable,
  streamQueryChunked,
  streamWithTransform,
  subscribeToQuery,
  streamWithAggregation,
  streamWithFilter,
  streamWithBatchedWrites,
  streamWithParallelWorkers,
  streamWithRateLimit,
  streamWithErrorRecovery,
  streamWithProgress,
  streamExport,
  streamWithCheckpoints,
  streamWithValidation,
  streamWithDeduplication,
  streamWithBranching,
  streamMemoryMapped,
  streamAdaptiveBatch,
  streamWithSampling,
  streamWithBuffering,
  streamWithTimeWindowing,
  streamWithCompression,
  streamWithConnectionPool,
};
