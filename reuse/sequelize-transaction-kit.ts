/**
 * LOC: SEQT1234567
 * File: /reuse/sequelize-transaction-kit.ts
 *
 * UPSTREAM (imports from):
 *   - Sequelize (database ORM)
 *   - Transaction management systems
 *   - Database connection pools
 *
 * DOWNSTREAM (imported by):
 *   - Bulk data processing services
 *   - ETL pipelines
 *   - Data migration services
 *   - Batch operation handlers
 */

/**
 * File: /reuse/sequelize-transaction-kit.ts
 * Locator: WC-UTL-SEQT-006
 * Purpose: Sequelize Transaction Kit - Advanced transaction management and bulk operations
 *
 * Upstream: Sequelize ORM, database connection pools, transaction coordinators
 * Downstream: ../backend/*, ../services/*, ETL services, batch processors, data migration tools
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize 6.x
 * Exports: 45 utility functions for transaction management, bulk operations, batch processing, retry logic
 *
 * LLM Context: Advanced Sequelize transaction utilities for White Cross healthcare system.
 * Provides bulk insert/update/delete operations, batch processing with transactions, concurrent
 * transaction management, advanced retry logic with exponential backoff, deadlock detection and
 * recovery, transaction queue management, and performance monitoring. Essential for high-volume
 * data processing, ETL operations, and maintaining data consistency in healthcare applications.
 */

import {
  Sequelize,
  Transaction,
  Model,
  ModelStatic,
  IsolationLevel,
  CreateOptions,
  UpdateOptions,
  DestroyOptions,
  BulkCreateOptions,
} from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface BulkInsertOptions<T> {
  batchSize?: number;
  transaction?: Transaction;
  validate?: boolean;
  ignoreDuplicates?: boolean;
  updateOnDuplicate?: string[];
  onProgress?: (progress: BulkOperationProgress) => void;
  continueOnError?: boolean;
}

interface BulkUpdateOptions<T> {
  batchSize?: number;
  transaction?: Transaction;
  validate?: boolean;
  onProgress?: (progress: BulkOperationProgress) => void;
  continueOnError?: boolean;
  individualHooks?: boolean;
}

interface BulkDeleteOptions {
  batchSize?: number;
  transaction?: Transaction;
  force?: boolean;
  onProgress?: (progress: BulkOperationProgress) => void;
  continueOnError?: boolean;
}

interface BulkOperationProgress {
  processed: number;
  total: number;
  successful: number;
  failed: number;
  percentage: number;
  errors: Array<{ index: number; error: Error; data?: any }>;
}

interface BulkOperationResult<T> {
  successful: T[];
  failed: Array<{ index: number; error: Error; data?: any }>;
  totalProcessed: number;
  totalSuccessful: number;
  totalFailed: number;
  executionTime: number;
}

interface TransactionRetryOptions {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
  retryableErrors?: string[];
  onRetry?: (attempt: number, error: Error) => void;
  shouldRetry?: (error: Error, attempt: number) => boolean;
}

interface TransactionQueueItem {
  id: string;
  operation: (transaction: Transaction) => Promise<any>;
  priority: number;
  createdAt: Date;
  timeout?: number;
}

interface TransactionQueueConfig {
  concurrency: number;
  maxQueueSize?: number;
  defaultTimeout?: number;
  onTaskComplete?: (taskId: string, result: any) => void;
  onTaskError?: (taskId: string, error: Error) => void;
}

interface TransactionMetrics {
  transactionId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  status: 'pending' | 'committed' | 'rolled_back' | 'timeout';
  operationsCount: number;
  retryCount: number;
  isolationLevel?: IsolationLevel;
  error?: Error;
}

interface BatchProcessingOptions<T> {
  batchSize: number;
  parallelBatches?: number;
  transaction?: Transaction;
  onBatchComplete?: (batch: T[], batchIndex: number) => void;
  onBatchError?: (batch: T[], error: Error, batchIndex: number) => void;
  retryFailedBatches?: boolean;
  maxRetries?: number;
}

interface ConflictResolutionStrategy {
  strategy: 'last_write_wins' | 'first_write_wins' | 'merge' | 'manual';
  mergeFunction?: (existing: any, incoming: any) => any;
  conflictFields?: string[];
}

interface TransactionLockOptions {
  lockMode: 'UPDATE' | 'SHARE' | 'KEY_SHARE' | 'NO_KEY_UPDATE';
  timeout?: number;
  skipLocked?: boolean;
}

interface DeadlockInfo {
  isDeadlock: boolean;
  error: Error;
  retryable: boolean;
  waitTime?: number;
}

// ============================================================================
// BULK INSERT OPERATIONS
// ============================================================================

/**
 * Performs bulk insert with batch processing and progress tracking.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {Partial<T>[]} data - Array of records to insert
 * @param {BulkInsertOptions<T>} [options] - Bulk insert options
 * @returns {Promise<BulkOperationResult<T>>} Bulk operation result
 *
 * @example
 * ```typescript
 * const result = await bulkInsert(Patient, patientData, {
 *   batchSize: 500,
 *   ignoreDuplicates: true,
 *   onProgress: (progress) => console.log(`${progress.percentage}% complete`)
 * });
 * console.log(`Inserted ${result.totalSuccessful} patients`);
 * ```
 */
export const bulkInsert = async <T extends Model>(
  model: ModelStatic<T>,
  data: Partial<T>[],
  options: BulkInsertOptions<T> = {},
): Promise<BulkOperationResult<T>> => {
  const startTime = Date.now();
  const {
    batchSize = 1000,
    transaction,
    validate = true,
    ignoreDuplicates = false,
    updateOnDuplicate,
    onProgress,
    continueOnError = false,
  } = options;

  const result: BulkOperationResult<T> = {
    successful: [],
    failed: [],
    totalProcessed: 0,
    totalSuccessful: 0,
    totalFailed: 0,
    executionTime: 0,
  };

  const progress: BulkOperationProgress = {
    processed: 0,
    total: data.length,
    successful: 0,
    failed: 0,
    percentage: 0,
    errors: [],
  };

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);

    try {
      const bulkCreateOptions: BulkCreateOptions<T> = {
        transaction,
        validate,
        ignoreDuplicates,
      };

      if (updateOnDuplicate) {
        bulkCreateOptions.updateOnDuplicate = updateOnDuplicate;
      }

      const created = await model.bulkCreate(batch as any[], bulkCreateOptions);

      result.successful.push(...created);
      result.totalSuccessful += created.length;

      progress.successful += created.length;
    } catch (error) {
      if (continueOnError) {
        batch.forEach((item, idx) => {
          result.failed.push({
            index: i + idx,
            error: error as Error,
            data: item,
          });
          progress.errors.push({
            index: i + idx,
            error: error as Error,
            data: item,
          });
        });
        result.totalFailed += batch.length;
        progress.failed += batch.length;
      } else {
        throw error;
      }
    }

    progress.processed += batch.length;
    progress.percentage = Math.round((progress.processed / progress.total) * 100);
    result.totalProcessed = progress.processed;

    if (onProgress) {
      onProgress(progress);
    }
  }

  result.executionTime = Date.now() - startTime;
  return result;
};

/**
 * Performs concurrent bulk insert with parallel batch processing.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {Partial<T>[]} data - Array of records to insert
 * @param {number} [parallelBatches] - Number of parallel batches (default: 3)
 * @param {BulkInsertOptions<T>} [options] - Bulk insert options
 * @returns {Promise<BulkOperationResult<T>>} Bulk operation result
 *
 * @example
 * ```typescript
 * const result = await concurrentBulkInsert(MedicalRecord, records, 5, {
 *   batchSize: 200,
 *   validate: true
 * });
 * ```
 */
export const concurrentBulkInsert = async <T extends Model>(
  model: ModelStatic<T>,
  data: Partial<T>[],
  parallelBatches: number = 3,
  options: BulkInsertOptions<T> = {},
): Promise<BulkOperationResult<T>> => {
  const startTime = Date.now();
  const { batchSize = 1000 } = options;

  const batches: Partial<T>[][] = [];
  for (let i = 0; i < data.length; i += batchSize) {
    batches.push(data.slice(i, i + batchSize));
  }

  const results: BulkOperationResult<T> = {
    successful: [],
    failed: [],
    totalProcessed: 0,
    totalSuccessful: 0,
    totalFailed: 0,
    executionTime: 0,
  };

  for (let i = 0; i < batches.length; i += parallelBatches) {
    const parallelPromises = batches
      .slice(i, i + parallelBatches)
      .map((batch) => bulkInsert(model, batch, { ...options, onProgress: undefined }));

    const batchResults = await Promise.allSettled(parallelPromises);

    batchResults.forEach((result) => {
      if (result.status === 'fulfilled') {
        results.successful.push(...result.value.successful);
        results.failed.push(...result.value.failed);
        results.totalSuccessful += result.value.totalSuccessful;
        results.totalFailed += result.value.totalFailed;
        results.totalProcessed += result.value.totalProcessed;
      }
    });
  }

  results.executionTime = Date.now() - startTime;
  return results;
};

/**
 * Inserts records with automatic chunking based on payload size.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {Partial<T>[]} data - Array of records to insert
 * @param {number} [maxPayloadSizeKB] - Maximum payload size in KB (default: 1024)
 * @param {BulkInsertOptions<T>} [options] - Bulk insert options
 * @returns {Promise<BulkOperationResult<T>>} Bulk operation result
 *
 * @example
 * ```typescript
 * const result = await insertWithAutoChunking(Patient, largeDataset, 512);
 * ```
 */
export const insertWithAutoChunking = async <T extends Model>(
  model: ModelStatic<T>,
  data: Partial<T>[],
  maxPayloadSizeKB: number = 1024,
  options: BulkInsertOptions<T> = {},
): Promise<BulkOperationResult<T>> => {
  const maxPayloadSizeBytes = maxPayloadSizeKB * 1024;
  const chunks: Partial<T>[][] = [];
  let currentChunk: Partial<T>[] = [];
  let currentChunkSize = 0;

  for (const record of data) {
    const recordSize = JSON.stringify(record).length;

    if (currentChunkSize + recordSize > maxPayloadSizeBytes && currentChunk.length > 0) {
      chunks.push(currentChunk);
      currentChunk = [];
      currentChunkSize = 0;
    }

    currentChunk.push(record);
    currentChunkSize += recordSize;
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  const results: BulkOperationResult<T> = {
    successful: [],
    failed: [],
    totalProcessed: 0,
    totalSuccessful: 0,
    totalFailed: 0,
    executionTime: 0,
  };

  const startTime = Date.now();

  for (const chunk of chunks) {
    const chunkResult = await bulkInsert(model, chunk, options);
    results.successful.push(...chunkResult.successful);
    results.failed.push(...chunkResult.failed);
    results.totalSuccessful += chunkResult.totalSuccessful;
    results.totalFailed += chunkResult.totalFailed;
    results.totalProcessed += chunkResult.totalProcessed;
  }

  results.executionTime = Date.now() - startTime;
  return results;
};

// ============================================================================
// BULK UPDATE OPERATIONS
// ============================================================================

/**
 * Performs bulk update with batch processing.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {Array<{ where: any; values: Partial<T> }>} updates - Array of update operations
 * @param {BulkUpdateOptions<T>} [options] - Bulk update options
 * @returns {Promise<BulkOperationResult<number>>} Bulk operation result with affected counts
 *
 * @example
 * ```typescript
 * const result = await bulkUpdate(Patient, [
 *   { where: { id: '123' }, values: { status: 'active' } },
 *   { where: { id: '456' }, values: { status: 'inactive' } }
 * ], { batchSize: 100 });
 * ```
 */
export const bulkUpdate = async <T extends Model>(
  model: ModelStatic<T>,
  updates: Array<{ where: any; values: Partial<T> }>,
  options: BulkUpdateOptions<T> = {},
): Promise<BulkOperationResult<number>> => {
  const startTime = Date.now();
  const {
    batchSize = 500,
    transaction,
    validate = true,
    onProgress,
    continueOnError = false,
    individualHooks = false,
  } = options;

  const result: BulkOperationResult<number> = {
    successful: [],
    failed: [],
    totalProcessed: 0,
    totalSuccessful: 0,
    totalFailed: 0,
    executionTime: 0,
  };

  const progress: BulkOperationProgress = {
    processed: 0,
    total: updates.length,
    successful: 0,
    failed: 0,
    percentage: 0,
    errors: [],
  };

  for (let i = 0; i < updates.length; i += batchSize) {
    const batch = updates.slice(i, i + batchSize);

    for (let j = 0; j < batch.length; j++) {
      const { where, values } = batch[j];

      try {
        const updateOptions: UpdateOptions<T> = {
          where,
          transaction,
          validate,
          individualHooks,
        };

        const [affectedCount] = await model.update(values as any, updateOptions);

        result.successful.push(affectedCount);
        result.totalSuccessful += affectedCount;
        progress.successful++;
      } catch (error) {
        if (continueOnError) {
          result.failed.push({
            index: i + j,
            error: error as Error,
            data: { where, values },
          });
          result.totalFailed++;
          progress.failed++;
          progress.errors.push({
            index: i + j,
            error: error as Error,
            data: { where, values },
          });
        } else {
          throw error;
        }
      }

      progress.processed++;
      progress.percentage = Math.round((progress.processed / progress.total) * 100);
      result.totalProcessed = progress.processed;

      if (onProgress && (progress.processed % 10 === 0 || progress.processed === progress.total)) {
        onProgress(progress);
      }
    }
  }

  result.executionTime = Date.now() - startTime;
  return result;
};

/**
 * Updates records by IDs in bulk with batching.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {Array<{ id: string; values: Partial<T> }>} updates - Array of ID-based updates
 * @param {BulkUpdateOptions<T>} [options] - Bulk update options
 * @returns {Promise<BulkOperationResult<T>>} Bulk operation result with updated records
 *
 * @example
 * ```typescript
 * const result = await bulkUpdateByIds(Patient, [
 *   { id: 'patient-123', values: { status: 'active' } },
 *   { id: 'patient-456', values: { lastVisit: new Date() } }
 * ]);
 * ```
 */
export const bulkUpdateByIds = async <T extends Model>(
  model: ModelStatic<T>,
  updates: Array<{ id: string; values: Partial<T> }>,
  options: BulkUpdateOptions<T> = {},
): Promise<BulkOperationResult<T>> => {
  const startTime = Date.now();
  const { transaction, continueOnError = false } = options;

  const result: BulkOperationResult<T> = {
    successful: [],
    failed: [],
    totalProcessed: 0,
    totalSuccessful: 0,
    totalFailed: 0,
    executionTime: 0,
  };

  for (let i = 0; i < updates.length; i++) {
    const { id, values } = updates[i];

    try {
      const record = await model.findByPk(id, { transaction });

      if (record) {
        await record.update(values as any, { transaction });
        result.successful.push(record);
        result.totalSuccessful++;
      } else {
        throw new Error(`Record with ID ${id} not found`);
      }
    } catch (error) {
      if (continueOnError) {
        result.failed.push({
          index: i,
          error: error as Error,
          data: { id, values },
        });
        result.totalFailed++;
      } else {
        throw error;
      }
    }

    result.totalProcessed++;
  }

  result.executionTime = Date.now() - startTime;
  return result;
};

// ============================================================================
// BULK DELETE OPERATIONS
// ============================================================================

/**
 * Performs bulk delete with batch processing.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {any[]} whereConditions - Array of WHERE conditions for deletions
 * @param {BulkDeleteOptions} [options] - Bulk delete options
 * @returns {Promise<BulkOperationResult<number>>} Bulk operation result with deletion counts
 *
 * @example
 * ```typescript
 * const result = await bulkDelete(Patient, [
 *   { status: 'archived', updatedAt: { [Op.lt]: oneYearAgo } },
 *   { deletedAt: { [Op.not]: null }, updatedAt: { [Op.lt]: sixMonthsAgo } }
 * ], { force: true });
 * ```
 */
export const bulkDelete = async <T extends Model>(
  model: ModelStatic<T>,
  whereConditions: any[],
  options: BulkDeleteOptions = {},
): Promise<BulkOperationResult<number>> => {
  const startTime = Date.now();
  const {
    batchSize = 500,
    transaction,
    force = false,
    onProgress,
    continueOnError = false,
  } = options;

  const result: BulkOperationResult<number> = {
    successful: [],
    failed: [],
    totalProcessed: 0,
    totalSuccessful: 0,
    totalFailed: 0,
    executionTime: 0,
  };

  const progress: BulkOperationProgress = {
    processed: 0,
    total: whereConditions.length,
    successful: 0,
    failed: 0,
    percentage: 0,
    errors: [],
  };

  for (let i = 0; i < whereConditions.length; i++) {
    const where = whereConditions[i];

    try {
      const deleteOptions: DestroyOptions<T> = {
        where,
        transaction,
        force,
      };

      const deletedCount = await model.destroy(deleteOptions);

      result.successful.push(deletedCount);
      result.totalSuccessful += deletedCount;
      progress.successful++;
    } catch (error) {
      if (continueOnError) {
        result.failed.push({
          index: i,
          error: error as Error,
          data: where,
        });
        result.totalFailed++;
        progress.failed++;
        progress.errors.push({
          index: i,
          error: error as Error,
          data: where,
        });
      } else {
        throw error;
      }
    }

    progress.processed++;
    progress.percentage = Math.round((progress.processed / progress.total) * 100);
    result.totalProcessed = progress.processed;

    if (onProgress) {
      onProgress(progress);
    }
  }

  result.executionTime = Date.now() - startTime;
  return result;
};

/**
 * Deletes records by IDs in bulk with batching.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {string[]} ids - Array of record IDs to delete
 * @param {BulkDeleteOptions} [options] - Bulk delete options
 * @returns {Promise<BulkOperationResult<number>>} Bulk operation result
 *
 * @example
 * ```typescript
 * const result = await bulkDeleteByIds(Patient, ['id1', 'id2', 'id3'], {
 *   batchSize: 100,
 *   force: true
 * });
 * ```
 */
export const bulkDeleteByIds = async <T extends Model>(
  model: ModelStatic<T>,
  ids: string[],
  options: BulkDeleteOptions = {},
): Promise<BulkOperationResult<number>> => {
  const { batchSize = 1000 } = options;
  const whereConditions = [];

  for (let i = 0; i < ids.length; i += batchSize) {
    const batchIds = ids.slice(i, i + batchSize);
    whereConditions.push({ id: batchIds });
  }

  return bulkDelete(model, whereConditions, options);
};

// ============================================================================
// BATCH PROCESSING WITH TRANSACTIONS
// ============================================================================

/**
 * Processes data in batches with individual transactions per batch.
 *
 * @template T, R
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {T[]} data - Array of data to process
 * @param {(batch: T[], transaction: Transaction) => Promise<R[]>} processor - Batch processor function
 * @param {BatchProcessingOptions<T>} options - Batch processing options
 * @returns {Promise<BulkOperationResult<R>>} Batch processing result
 *
 * @example
 * ```typescript
 * const result = await processBatchesWithTransactions(
 *   sequelize,
 *   patientData,
 *   async (batch, t) => {
 *     return await Patient.bulkCreate(batch, { transaction: t });
 *   },
 *   { batchSize: 100, parallelBatches: 3 }
 * );
 * ```
 */
export const processBatchesWithTransactions = async <T, R>(
  sequelize: Sequelize,
  data: T[],
  processor: (batch: T[], transaction: Transaction) => Promise<R[]>,
  options: BatchProcessingOptions<T>,
): Promise<BulkOperationResult<R>> => {
  const startTime = Date.now();
  const {
    batchSize,
    parallelBatches = 1,
    onBatchComplete,
    onBatchError,
    retryFailedBatches = false,
    maxRetries = 3,
  } = options;

  const batches: T[][] = [];
  for (let i = 0; i < data.length; i += batchSize) {
    batches.push(data.slice(i, i + batchSize));
  }

  const result: BulkOperationResult<R> = {
    successful: [],
    failed: [],
    totalProcessed: 0,
    totalSuccessful: 0,
    totalFailed: 0,
    executionTime: 0,
  };

  for (let i = 0; i < batches.length; i += parallelBatches) {
    const parallelPromises = batches
      .slice(i, i + parallelBatches)
      .map(async (batch, batchIndex) => {
        let retries = 0;
        let lastError: Error | null = null;

        while (retries <= (retryFailedBatches ? maxRetries : 0)) {
          try {
            const batchResult = await sequelize.transaction(async (t) => {
              return await processor(batch, t);
            });

            if (onBatchComplete) {
              onBatchComplete(batch, i + batchIndex);
            }

            return { success: true, data: batchResult, batchIndex: i + batchIndex };
          } catch (error) {
            lastError = error as Error;
            retries++;

            if (retries > maxRetries || !retryFailedBatches) {
              if (onBatchError) {
                onBatchError(batch, error as Error, i + batchIndex);
              }
              return { success: false, error: error as Error, batch, batchIndex: i + batchIndex };
            }

            await new Promise((resolve) => setTimeout(resolve, 1000 * retries));
          }
        }

        return { success: false, error: lastError!, batch, batchIndex: i + batchIndex };
      });

    const batchResults = await Promise.allSettled(parallelPromises);

    batchResults.forEach((batchResult) => {
      if (batchResult.status === 'fulfilled') {
        const { value } = batchResult;

        if (value.success && value.data) {
          result.successful.push(...value.data);
          result.totalSuccessful += value.data.length;
        } else if (!value.success) {
          result.failed.push({
            index: value.batchIndex,
            error: value.error,
            data: value.batch,
          });
          result.totalFailed += (value.batch as any[]).length;
        }

        result.totalProcessed += value.success
          ? value.data!.length
          : (value.batch as any[]).length;
      }
    });
  }

  result.executionTime = Date.now() - startTime;
  return result;
};

/**
 * Processes items sequentially with a single shared transaction.
 *
 * @template T, R
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {T[]} data - Array of data to process
 * @param {(item: T, transaction: Transaction) => Promise<R>} processor - Item processor function
 * @param {Transaction} [transaction] - Optional existing transaction
 * @returns {Promise<BulkOperationResult<R>>} Processing result
 *
 * @example
 * ```typescript
 * const result = await processWithSharedTransaction(
 *   sequelize,
 *   patients,
 *   async (patient, t) => {
 *     const created = await Patient.create(patient, { transaction: t });
 *     await MedicalRecord.create({ patientId: created.id }, { transaction: t });
 *     return created;
 *   }
 * );
 * ```
 */
export const processWithSharedTransaction = async <T, R>(
  sequelize: Sequelize,
  data: T[],
  processor: (item: T, transaction: Transaction) => Promise<R>,
  transaction?: Transaction,
): Promise<BulkOperationResult<R>> => {
  const startTime = Date.now();
  const result: BulkOperationResult<R> = {
    successful: [],
    failed: [],
    totalProcessed: 0,
    totalSuccessful: 0,
    totalFailed: 0,
    executionTime: 0,
  };

  const execute = async (t: Transaction) => {
    for (let i = 0; i < data.length; i++) {
      try {
        const processed = await processor(data[i], t);
        result.successful.push(processed);
        result.totalSuccessful++;
      } catch (error) {
        result.failed.push({
          index: i,
          error: error as Error,
          data: data[i],
        });
        result.totalFailed++;
        throw error;
      }
      result.totalProcessed++;
    }
  };

  if (transaction) {
    await execute(transaction);
  } else {
    await sequelize.transaction(execute);
  }

  result.executionTime = Date.now() - startTime;
  return result;
};

// ============================================================================
// TRANSACTION RETRY LOGIC
// ============================================================================

/**
 * Executes operation with exponential backoff retry strategy.
 *
 * @template T
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {(transaction: Transaction) => Promise<T>} operation - Operation to execute
 * @param {TransactionRetryOptions} options - Retry configuration
 * @returns {Promise<T>} Operation result
 *
 * @example
 * ```typescript
 * const result = await executeWithExponentialBackoff(
 *   sequelize,
 *   async (t) => await Patient.create(data, { transaction: t }),
 *   {
 *     maxRetries: 5,
 *     initialDelay: 100,
 *     maxDelay: 5000,
 *     backoffFactor: 2
 *   }
 * );
 * ```
 */
export const executeWithExponentialBackoff = async <T>(
  sequelize: Sequelize,
  operation: (transaction: Transaction) => Promise<T>,
  options: TransactionRetryOptions,
): Promise<T> => {
  const {
    maxRetries,
    initialDelay,
    maxDelay,
    backoffFactor,
    retryableErrors = ['DEADLOCK', 'SERIALIZATION_FAILURE', 'LOCK_TIMEOUT'],
    onRetry,
    shouldRetry,
  } = options;

  let attempt = 0;
  let lastError: Error;

  while (attempt <= maxRetries) {
    try {
      return await sequelize.transaction(operation);
    } catch (error: any) {
      lastError = error;
      attempt++;

      const isRetryable = shouldRetry
        ? shouldRetry(error, attempt)
        : retryableErrors.some((code) => error.message.includes(code));

      if (attempt > maxRetries || !isRetryable) {
        throw error;
      }

      const delay = Math.min(initialDelay * Math.pow(backoffFactor, attempt - 1), maxDelay);

      if (onRetry) {
        onRetry(attempt, error);
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
};

/**
 * Executes operation with jittered exponential backoff for better distribution.
 *
 * @template T
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {(transaction: Transaction) => Promise<T>} operation - Operation to execute
 * @param {TransactionRetryOptions} options - Retry configuration
 * @returns {Promise<T>} Operation result
 *
 * @example
 * ```typescript
 * const result = await executeWithJitteredBackoff(
 *   sequelize,
 *   async (t) => await updatePatientRecords(t),
 *   { maxRetries: 3, initialDelay: 200, maxDelay: 10000, backoffFactor: 2 }
 * );
 * ```
 */
export const executeWithJitteredBackoff = async <T>(
  sequelize: Sequelize,
  operation: (transaction: Transaction) => Promise<T>,
  options: TransactionRetryOptions,
): Promise<T> => {
  const optionsWithJitter = {
    ...options,
    shouldRetry: (error: Error, attempt: number) => {
      const baseDelay = Math.min(
        options.initialDelay * Math.pow(options.backoffFactor, attempt - 1),
        options.maxDelay,
      );
      const jitter = Math.random() * baseDelay * 0.3;
      const delay = baseDelay + jitter;

      if (options.onRetry) {
        options.onRetry(attempt, error);
      }

      return true;
    },
  };

  return executeWithExponentialBackoff(sequelize, operation, optionsWithJitter);
};

// ============================================================================
// DEADLOCK DETECTION AND RECOVERY
// ============================================================================

/**
 * Detects if error is caused by deadlock and provides recovery info.
 *
 * @param {Error} error - Database error
 * @returns {DeadlockInfo} Deadlock detection info
 *
 * @example
 * ```typescript
 * try {
 *   await transaction.commit();
 * } catch (error) {
 *   const deadlockInfo = detectDeadlock(error);
 *   if (deadlockInfo.isDeadlock && deadlockInfo.retryable) {
 *     // Retry operation
 *   }
 * }
 * ```
 */
export const detectDeadlock = (error: Error): DeadlockInfo => {
  const deadlockIndicators = [
    'DEADLOCK',
    'ER_LOCK_DEADLOCK',
    '40P01',
    '1213',
    'deadlock detected',
    'was deadlocked',
  ];

  const errorMessage = error.message.toUpperCase();
  const isDeadlock = deadlockIndicators.some((indicator) =>
    errorMessage.includes(indicator.toUpperCase()),
  );

  return {
    isDeadlock,
    error,
    retryable: isDeadlock,
  };
};

/**
 * Executes operation with automatic deadlock retry and detection.
 *
 * @template T
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {(transaction: Transaction) => Promise<T>} operation - Operation to execute
 * @param {number} [maxRetries] - Maximum retry attempts (default: 5)
 * @param {number} [baseDelay] - Base delay in ms (default: 100)
 * @returns {Promise<T>} Operation result
 *
 * @example
 * ```typescript
 * const result = await executeWithDeadlockRetry(
 *   sequelize,
 *   async (t) => {
 *     await Patient.update({ status: 'active' }, { where: { id: '123' }, transaction: t });
 *     await Grade.update({ status: 'current' }, { where: { patientId: '123' }, transaction: t });
 *     return { success: true };
 *   },
 *   10
 * );
 * ```
 */
export const executeWithDeadlockRetry = async <T>(
  sequelize: Sequelize,
  operation: (transaction: Transaction) => Promise<T>,
  maxRetries: number = 5,
  baseDelay: number = 100,
): Promise<T> => {
  return executeWithExponentialBackoff(sequelize, operation, {
    maxRetries,
    initialDelay: baseDelay,
    maxDelay: baseDelay * 32,
    backoffFactor: 2,
    shouldRetry: (error: Error, attempt: number) => {
      const deadlockInfo = detectDeadlock(error);
      return deadlockInfo.isDeadlock && deadlockInfo.retryable;
    },
    onRetry: (attempt: number, error: Error) => {
      console.warn(`Deadlock detected on attempt ${attempt}, retrying...`, error.message);
    },
  });
};

// ============================================================================
// TRANSACTION QUEUE MANAGEMENT
// ============================================================================

/**
 * Creates a transaction queue for managing concurrent transactions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {TransactionQueueConfig} config - Queue configuration
 * @returns {object} Transaction queue interface
 *
 * @example
 * ```typescript
 * const queue = createTransactionQueue(sequelize, {
 *   concurrency: 5,
 *   maxQueueSize: 1000,
 *   defaultTimeout: 30000
 * });
 *
 * await queue.enqueue(async (t) => {
 *   return await Patient.create(data, { transaction: t });
 * }, 1);
 * ```
 */
export const createTransactionQueue = (
  sequelize: Sequelize,
  config: TransactionQueueConfig,
) => {
  const { concurrency, maxQueueSize, defaultTimeout, onTaskComplete, onTaskError } = config;

  const queue: TransactionQueueItem[] = [];
  let activeCount = 0;
  let taskIdCounter = 0;

  const processNext = async () => {
    if (activeCount >= concurrency || queue.length === 0) {
      return;
    }

    queue.sort((a, b) => b.priority - a.priority);
    const task = queue.shift()!;
    activeCount++;

    try {
      const timeout = task.timeout || defaultTimeout;
      const result = await Promise.race([
        sequelize.transaction(task.operation),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Transaction timeout')), timeout),
        ),
      ]);

      if (onTaskComplete) {
        onTaskComplete(task.id, result);
      }
    } catch (error) {
      if (onTaskError) {
        onTaskError(task.id, error as Error);
      }
    } finally {
      activeCount--;
      processNext();
    }
  };

  return {
    enqueue: async (
      operation: (transaction: Transaction) => Promise<any>,
      priority: number = 0,
      timeout?: number,
    ): Promise<string> => {
      if (maxQueueSize && queue.length >= maxQueueSize) {
        throw new Error('Transaction queue is full');
      }

      const taskId = `task_${++taskIdCounter}_${Date.now()}`;
      queue.push({
        id: taskId,
        operation,
        priority,
        createdAt: new Date(),
        timeout,
      });

      processNext();
      return taskId;
    },
    getQueueSize: () => queue.length,
    getActiveCount: () => activeCount,
    clear: () => {
      queue.length = 0;
    },
  };
};

// ============================================================================
// TRANSACTION METRICS AND MONITORING
// ============================================================================

/**
 * Executes transaction with comprehensive metrics tracking.
 *
 * @template T
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {(transaction: Transaction) => Promise<T>} operation - Operation to execute
 * @param {string} [transactionId] - Optional transaction identifier
 * @returns {Promise<{ result: T; metrics: TransactionMetrics }>} Result with metrics
 *
 * @example
 * ```typescript
 * const { result, metrics } = await executeWithMetrics(
 *   sequelize,
 *   async (t) => await Patient.bulkCreate(data, { transaction: t }),
 *   'bulk_patient_insert'
 * );
 * console.log(`Transaction took ${metrics.duration}ms`);
 * ```
 */
export const executeWithMetrics = async <T>(
  sequelize: Sequelize,
  operation: (transaction: Transaction) => Promise<T>,
  transactionId?: string,
): Promise<{ result: T; metrics: TransactionMetrics }> => {
  const metrics: TransactionMetrics = {
    transactionId: transactionId || `txn_${Date.now()}`,
    startTime: new Date(),
    status: 'pending',
    operationsCount: 0,
    retryCount: 0,
  };

  try {
    const result = await sequelize.transaction(
      {
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
      },
      async (t) => {
        metrics.isolationLevel = (t as any).options?.isolationLevel;
        return await operation(t);
      },
    );

    metrics.endTime = new Date();
    metrics.duration = metrics.endTime.getTime() - metrics.startTime.getTime();
    metrics.status = 'committed';

    return { result, metrics };
  } catch (error) {
    metrics.endTime = new Date();
    metrics.duration = metrics.endTime.getTime() - metrics.startTime.getTime();
    metrics.status = 'rolled_back';
    metrics.error = error as Error;

    throw error;
  }
};

/**
 * Tracks transaction performance and logs slow transactions.
 *
 * @template T
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {(transaction: Transaction) => Promise<T>} operation - Operation to execute
 * @param {number} slowThresholdMs - Threshold for slow transaction logging (ms)
 * @param {(metrics: TransactionMetrics) => void} [onSlowTransaction] - Slow transaction callback
 * @returns {Promise<T>} Operation result
 *
 * @example
 * ```typescript
 * const result = await trackSlowTransactions(
 *   sequelize,
 *   async (t) => await processLargeDataset(t),
 *   5000,
 *   (metrics) => console.warn(`Slow transaction: ${metrics.duration}ms`)
 * );
 * ```
 */
export const trackSlowTransactions = async <T>(
  sequelize: Sequelize,
  operation: (transaction: Transaction) => Promise<T>,
  slowThresholdMs: number,
  onSlowTransaction?: (metrics: TransactionMetrics) => void,
): Promise<T> => {
  const { result, metrics } = await executeWithMetrics(sequelize, operation);

  if (metrics.duration! > slowThresholdMs) {
    console.warn(
      `Slow transaction detected: ${metrics.transactionId} took ${metrics.duration}ms`,
    );

    if (onSlowTransaction) {
      onSlowTransaction(metrics);
    }
  }

  return result;
};

// ============================================================================
// CONFLICT RESOLUTION
// ============================================================================

/**
 * Performs upsert with conflict resolution strategy.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {Partial<T>[]} data - Array of records to upsert
 * @param {string[]} conflictFields - Fields to check for conflicts
 * @param {ConflictResolutionStrategy} strategy - Conflict resolution strategy
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<BulkOperationResult<T>>} Upsert result
 *
 * @example
 * ```typescript
 * const result = await upsertWithConflictResolution(
 *   Patient,
 *   patientData,
 *   ['email'],
 *   { strategy: 'last_write_wins' }
 * );
 * ```
 */
export const upsertWithConflictResolution = async <T extends Model>(
  model: ModelStatic<T>,
  data: Partial<T>[],
  conflictFields: string[],
  strategy: ConflictResolutionStrategy,
  transaction?: Transaction,
): Promise<BulkOperationResult<T>> => {
  const startTime = Date.now();
  const result: BulkOperationResult<T> = {
    successful: [],
    failed: [],
    totalProcessed: 0,
    totalSuccessful: 0,
    totalFailed: 0,
    executionTime: 0,
  };

  for (let i = 0; i < data.length; i++) {
    const record = data[i];

    try {
      const where: any = {};
      conflictFields.forEach((field) => {
        where[field] = (record as any)[field];
      });

      const existing = await model.findOne({ where, transaction });

      if (existing) {
        let updateData: any;

        switch (strategy.strategy) {
          case 'last_write_wins':
            updateData = record;
            break;

          case 'first_write_wins':
            continue;

          case 'merge':
            if (strategy.mergeFunction) {
              updateData = strategy.mergeFunction(existing.toJSON(), record);
            } else {
              updateData = { ...existing.toJSON(), ...record };
            }
            break;

          case 'manual':
            throw new Error('Manual conflict resolution required');

          default:
            updateData = record;
        }

        await existing.update(updateData, { transaction });
        result.successful.push(existing);
        result.totalSuccessful++;
      } else {
        const created = await model.create(record as any, { transaction });
        result.successful.push(created);
        result.totalSuccessful++;
      }
    } catch (error) {
      result.failed.push({
        index: i,
        error: error as Error,
        data: record,
      });
      result.totalFailed++;
    }

    result.totalProcessed++;
  }

  result.executionTime = Date.now() - startTime;
  return result;
};

// ============================================================================
// TRANSACTION LOCKING
// ============================================================================

/**
 * Executes query with explicit row-level locking.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {any} where - WHERE clause
 * @param {TransactionLockOptions} lockOptions - Lock options
 * @param {Transaction} transaction - Transaction
 * @returns {Promise<T[]>} Locked records
 *
 * @example
 * ```typescript
 * const lockedRecords = await executeWithLock(
 *   Patient,
 *   { id: 'patient-123' },
 *   { lockMode: 'UPDATE', timeout: 5000 },
 *   transaction
 * );
 * ```
 */
export const executeWithLock = async <T extends Model>(
  model: ModelStatic<T>,
  where: any,
  lockOptions: TransactionLockOptions,
  transaction: Transaction,
): Promise<T[]> => {
  const { lockMode, skipLocked = false } = lockOptions;

  const lock: any = {
    level: Transaction.LOCK[lockMode],
  };

  if (skipLocked) {
    lock.of = model;
  }

  return model.findAll({
    where,
    lock,
    transaction,
  });
};

/**
 * Executes optimistic locking update with version checking.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {string} id - Record ID
 * @param {Partial<T>} updates - Updates to apply
 * @param {number} expectedVersion - Expected version number
 * @param {string} [versionField] - Version field name (default: 'version')
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<T>} Updated record
 * @throws {Error} If version mismatch detected
 *
 * @example
 * ```typescript
 * const updated = await executeOptimisticLockingUpdate(
 *   Patient,
 *   'patient-123',
 *   { status: 'active' },
 *   5
 * );
 * ```
 */
export const executeOptimisticLockingUpdate = async <T extends Model>(
  model: ModelStatic<T>,
  id: string,
  updates: Partial<T>,
  expectedVersion: number,
  versionField: string = 'version',
  transaction?: Transaction,
): Promise<T> => {
  const record = await model.findOne({
    where: { id } as any,
    transaction,
  });

  if (!record) {
    throw new Error(`Record with ID ${id} not found`);
  }

  const currentVersion = (record as any)[versionField];

  if (currentVersion !== expectedVersion) {
    throw new Error(
      `Version mismatch: expected ${expectedVersion}, got ${currentVersion}. ` +
        `Record was modified by another process.`,
    );
  }

  const updateData: any = {
    ...updates,
    [versionField]: currentVersion + 1,
  };

  await record.update(updateData, { transaction });

  return record;
};

// ============================================================================
// SAVEPOINT MANAGEMENT
// ============================================================================

/**
 * Creates a savepoint within a transaction for partial rollback.
 *
 * @param {Transaction} transaction - Active transaction
 * @param {string} savepointName - Savepoint identifier
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createSavepoint(transaction, 'before_update', sequelize);
 * // Perform risky operations
 * await rollbackToSavepoint(transaction, 'before_update', sequelize);
 * ```
 */
export const createSavepoint = async (
  transaction: Transaction,
  savepointName: string,
  sequelize: Sequelize,
): Promise<void> => {
  await sequelize.query(`SAVEPOINT ${savepointName}`, { transaction });
};

/**
 * Rolls back transaction to a specific savepoint.
 *
 * @param {Transaction} transaction - Active transaction
 * @param {string} savepointName - Savepoint identifier
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await rollbackToSavepoint(transaction, 'checkpoint1', sequelize);
 * ```
 */
export const rollbackToSavepoint = async (
  transaction: Transaction,
  savepointName: string,
  sequelize: Sequelize,
): Promise<void> => {
  await sequelize.query(`ROLLBACK TO SAVEPOINT ${savepointName}`, { transaction });
};

/**
 * Releases a savepoint (commits it).
 *
 * @param {Transaction} transaction - Active transaction
 * @param {string} savepointName - Savepoint identifier
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await releaseSavepoint(transaction, 'checkpoint1', sequelize);
 * ```
 */
export const releaseSavepoint = async (
  transaction: Transaction,
  savepointName: string,
  sequelize: Sequelize,
): Promise<void> => {
  await sequelize.query(`RELEASE SAVEPOINT ${savepointName}`, { transaction });
};

/**
 * Executes operation with savepoint for partial rollback capability.
 *
 * @template T
 * @param {Transaction} transaction - Active transaction
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} savepointName - Savepoint identifier
 * @param {(transaction: Transaction) => Promise<T>} operation - Operation to execute
 * @returns {Promise<T>} Operation result
 *
 * @example
 * ```typescript
 * const result = await executeWithSavepoint(
 *   transaction,
 *   sequelize,
 *   'risky_operation',
 *   async (t) => await Patient.bulkCreate(data, { transaction: t })
 * );
 * ```
 */
export const executeWithSavepoint = async <T>(
  transaction: Transaction,
  sequelize: Sequelize,
  savepointName: string,
  operation: (transaction: Transaction) => Promise<T>,
): Promise<T> => {
  await createSavepoint(transaction, savepointName, sequelize);

  try {
    const result = await operation(transaction);
    await releaseSavepoint(transaction, savepointName, sequelize);
    return result;
  } catch (error) {
    await rollbackToSavepoint(transaction, savepointName, sequelize);
    throw error;
  }
};

// ============================================================================
// TRANSACTION ISOLATION HELPERS
// ============================================================================

/**
 * Creates transaction with READ UNCOMMITTED isolation level.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Transaction>} Transaction with READ UNCOMMITTED isolation
 *
 * @example
 * ```typescript
 * const transaction = await createReadUncommittedTransaction(sequelize);
 * ```
 */
export const createReadUncommittedTransaction = async (
  sequelize: Sequelize,
): Promise<Transaction> => {
  return sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
  });
};

/**
 * Creates transaction with READ COMMITTED isolation level.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Transaction>} Transaction with READ COMMITTED isolation
 *
 * @example
 * ```typescript
 * const transaction = await createReadCommittedTransaction(sequelize);
 * ```
 */
export const createReadCommittedTransaction = async (
  sequelize: Sequelize,
): Promise<Transaction> => {
  return sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
  });
};

/**
 * Creates transaction with REPEATABLE READ isolation level.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Transaction>} Transaction with REPEATABLE READ isolation
 *
 * @example
 * ```typescript
 * const transaction = await createRepeatableReadTransaction(sequelize);
 * ```
 */
export const createRepeatableReadTransaction = async (
  sequelize: Sequelize,
): Promise<Transaction> => {
  return sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  });
};

/**
 * Creates transaction with SERIALIZABLE isolation level.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Transaction>} Transaction with SERIALIZABLE isolation
 *
 * @example
 * ```typescript
 * const transaction = await createSerializableTransaction(sequelize);
 * ```
 */
export const createSerializableTransaction = async (
  sequelize: Sequelize,
): Promise<Transaction> => {
  return sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  });
};

// ============================================================================
// TRANSACTION TIMEOUT HANDLING
// ============================================================================

/**
 * Executes transaction with timeout.
 *
 * @template T
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {(transaction: Transaction) => Promise<T>} operation - Operation to execute
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {Promise<T>} Operation result
 * @throws {Error} If transaction times out
 *
 * @example
 * ```typescript
 * const result = await executeWithTimeout(
 *   sequelize,
 *   async (t) => await processLargeDataset(t),
 *   30000
 * );
 * ```
 */
export const executeWithTimeout = async <T>(
  sequelize: Sequelize,
  operation: (transaction: Transaction) => Promise<T>,
  timeoutMs: number,
): Promise<T> => {
  return Promise.race([
    sequelize.transaction(operation),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Transaction timeout after ${timeoutMs}ms`)), timeoutMs),
    ),
  ]);
};

/**
 * Executes transaction with automatic timeout and retry.
 *
 * @template T
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {(transaction: Transaction) => Promise<T>} operation - Operation to execute
 * @param {number} timeoutMs - Timeout in milliseconds
 * @param {number} maxRetries - Maximum retry attempts
 * @returns {Promise<T>} Operation result
 *
 * @example
 * ```typescript
 * const result = await executeWithTimeoutRetry(
 *   sequelize,
 *   async (t) => await bulkProcessData(t),
 *   60000,
 *   3
 * );
 * ```
 */
export const executeWithTimeoutRetry = async <T>(
  sequelize: Sequelize,
  operation: (transaction: Transaction) => Promise<T>,
  timeoutMs: number,
  maxRetries: number = 3,
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await executeWithTimeout(sequelize, operation, timeoutMs);
    } catch (error: any) {
      lastError = error;

      if (attempt === maxRetries || !error.message.includes('timeout')) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }

  throw lastError!;
};

// ============================================================================
// ROLLBACK STRATEGIES
// ============================================================================

/**
 * Safely rolls back transaction with error handling.
 *
 * @param {Transaction} transaction - Transaction to rollback
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await safeRollback(transaction);
 * ```
 */
export const safeRollback = async (transaction: Transaction): Promise<void> => {
  try {
    if (!transaction.finished) {
      await transaction.rollback();
    }
  } catch (error) {
    console.error('Error during rollback:', error);
  }
};

/**
 * Conditionally rolls back transaction based on predicate.
 *
 * @param {Transaction} transaction - Transaction to potentially rollback
 * @param {boolean | (() => boolean)} condition - Condition to check
 * @returns {Promise<boolean>} True if rolled back
 *
 * @example
 * ```typescript
 * const rolledBack = await conditionalRollback(transaction, hasErrors);
 * ```
 */
export const conditionalRollback = async (
  transaction: Transaction,
  condition: boolean | (() => boolean),
): Promise<boolean> => {
  const shouldRollback = typeof condition === 'function' ? condition() : condition;

  if (shouldRollback && !transaction.finished) {
    await transaction.rollback();
    return true;
  }

  return false;
};

// ============================================================================
// BATCH STREAMING OPERATIONS
// ============================================================================

/**
 * Streams data in batches with transaction-per-batch strategy.
 *
 * @template T, R
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {AsyncIterable<T>} dataStream - Async iterable data stream
 * @param {(batch: T[], transaction: Transaction) => Promise<R[]>} processor - Batch processor
 * @param {number} batchSize - Batch size
 * @returns {AsyncGenerator<R[], void, unknown>} Stream of processed results
 *
 * @example
 * ```typescript
 * for await (const results of streamBatchProcessing(
 *   sequelize,
 *   dataStream,
 *   async (batch, t) => await Patient.bulkCreate(batch, { transaction: t }),
 *   100
 * )) {
 *   console.log(`Processed batch: ${results.length} records`);
 * }
 * ```
 */
export async function* streamBatchProcessing<T, R>(
  sequelize: Sequelize,
  dataStream: AsyncIterable<T>,
  processor: (batch: T[], transaction: Transaction) => Promise<R[]>,
  batchSize: number,
): AsyncGenerator<R[], void, unknown> {
  let batch: T[] = [];

  for await (const item of dataStream) {
    batch.push(item);

    if (batch.length >= batchSize) {
      const result = await sequelize.transaction(async (t) => {
        return await processor(batch, t);
      });

      yield result;
      batch = [];
    }
  }

  if (batch.length > 0) {
    const result = await sequelize.transaction(async (t) => {
      return await processor(batch, t);
    });

    yield result;
  }
}

// ============================================================================
// TRANSACTION COORDINATION
// ============================================================================

/**
 * Coordinates multiple transactions across different operations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Array<(transaction: Transaction) => Promise<any>>} operations - Operations to coordinate
 * @param {boolean} [sequential] - Execute sequentially (default: false)
 * @returns {Promise<any[]>} Results from all operations
 *
 * @example
 * ```typescript
 * const results = await coordinateTransactions(sequelize, [
 *   async (t) => await Patient.create(patientData, { transaction: t }),
 *   async (t) => await MedicalRecord.create(recordData, { transaction: t })
 * ], true);
 * ```
 */
export const coordinateTransactions = async (
  sequelize: Sequelize,
  operations: Array<(transaction: Transaction) => Promise<any>>,
  sequential: boolean = false,
): Promise<any[]> => {
  if (sequential) {
    const results: any[] = [];

    for (const operation of operations) {
      const result = await sequelize.transaction(operation);
      results.push(result);
    }

    return results;
  } else {
    const promises = operations.map((operation) => sequelize.transaction(operation));
    return Promise.all(promises);
  }
};

/**
 * Executes multiple operations in a single coordinated transaction.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Array<(transaction: Transaction) => Promise<any>>} operations - Operations to execute
 * @returns {Promise<any[]>} Results from all operations
 *
 * @example
 * ```typescript
 * const results = await executeCoordin atedTransaction(sequelize, [
 *   async (t) => await createPatient(t),
 *   async (t) => await createMedicalHistory(t),
 *   async (t) => await assignDoctor(t)
 * ]);
 * ```
 */
export const executeCoordinatedTransaction = async (
  sequelize: Sequelize,
  operations: Array<(transaction: Transaction) => Promise<any>>,
): Promise<any[]> => {
  return sequelize.transaction(async (t) => {
    const results: any[] = [];

    for (const operation of operations) {
      const result = await operation(t);
      results.push(result);
    }

    return results;
  });
};

// ============================================================================
// BULK UPSERT OPERATIONS
// ============================================================================

/**
 * Performs bulk upsert with conflict handling.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {Partial<T>[]} data - Array of records to upsert
 * @param {string[]} conflictFields - Fields to check for conflicts
 * @param {string[]} updateFields - Fields to update on conflict
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<T[]>} Upserted records
 *
 * @example
 * ```typescript
 * const upserted = await bulkUpsert(
 *   Patient,
 *   patientData,
 *   ['email'],
 *   ['firstName', 'lastName', 'phone']
 * );
 * ```
 */
export const bulkUpsert = async <T extends Model>(
  model: ModelStatic<T>,
  data: Partial<T>[],
  conflictFields: string[],
  updateFields: string[],
  transaction?: Transaction,
): Promise<T[]> => {
  return model.bulkCreate(data as any[], {
    updateOnDuplicate: updateFields,
    transaction,
    validate: true,
  });
};

// ============================================================================
// CONDITIONAL BATCH OPERATIONS
// ============================================================================

/**
 * Performs conditional bulk insert based on predicate.
 *
 * @template T
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {Partial<T>[]} data - Array of records
 * @param {(record: Partial<T>) => boolean} predicate - Filter predicate
 * @param {BulkInsertOptions<T>} [options] - Bulk insert options
 * @returns {Promise<BulkOperationResult<T>>} Operation result
 *
 * @example
 * ```typescript
 * const result = await conditionalBulkInsert(
 *   Patient,
 *   patients,
 *   (p) => p.age >= 18,
 *   { batchSize: 500 }
 * );
 * ```
 */
export const conditionalBulkInsert = async <T extends Model>(
  model: ModelStatic<T>,
  data: Partial<T>[],
  predicate: (record: Partial<T>) => boolean,
  options?: BulkInsertOptions<T>,
): Promise<BulkOperationResult<T>> => {
  const filteredData = data.filter(predicate);
  return bulkInsert(model, filteredData, options);
};

/**
 * Transforms and inserts data in bulk.
 *
 * @template T, S
 * @param {ModelStatic<T>} model - Sequelize model
 * @param {S[]} sourceData - Source data array
 * @param {(source: S) => Partial<T>} transformer - Data transformer function
 * @param {BulkInsertOptions<T>} [options] - Bulk insert options
 * @returns {Promise<BulkOperationResult<T>>} Operation result
 *
 * @example
 * ```typescript
 * const result = await transformAndBulkInsert(
 *   Patient,
 *   csvData,
 *   (row) => ({
 *     firstName: row.first_name,
 *     lastName: row.last_name,
 *     email: row.email_address
 *   })
 * );
 * ```
 */
export const transformAndBulkInsert = async <T extends Model, S>(
  model: ModelStatic<T>,
  sourceData: S[],
  transformer: (source: S) => Partial<T>,
  options?: BulkInsertOptions<T>,
): Promise<BulkOperationResult<T>> => {
  const transformedData = sourceData.map(transformer);
  return bulkInsert(model, transformedData, options);
};

// ============================================================================
// TRANSACTION STATE MANAGEMENT
// ============================================================================

/**
 * Checks if transaction is still active.
 *
 * @param {Transaction} transaction - Transaction to check
 * @returns {boolean} True if transaction is active
 *
 * @example
 * ```typescript
 * if (isTransactionActive(transaction)) {
 *   await performOperation(transaction);
 * }
 * ```
 */
export const isTransactionActive = (transaction: Transaction): boolean => {
  return !transaction.finished;
};

/**
 * Gets transaction status information.
 *
 * @param {Transaction} transaction - Transaction to inspect
 * @returns {object} Transaction status details
 *
 * @example
 * ```typescript
 * const status = getTransactionStatus(transaction);
 * console.log(`Transaction ${status.id} is ${status.finished ? 'finished' : 'active'}`);
 * ```
 */
export const getTransactionStatus = (transaction: Transaction): {
  finished: boolean;
  id: string;
} => {
  return {
    finished: transaction.finished,
    id: (transaction as any).id || 'unknown',
  };
};

// ============================================================================
// PARALLEL TRANSACTION EXECUTION
// ============================================================================

/**
 * Executes multiple independent transactions in parallel.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Array<(transaction: Transaction) => Promise<any>>} operations - Operations to execute
 * @param {number} [maxConcurrent] - Maximum concurrent transactions (default: 5)
 * @returns {Promise<any[]>} Results from all operations
 *
 * @example
 * ```typescript
 * const results = await executeParallelTransactions(sequelize, [
 *   async (t) => await processPatientBatch1(t),
 *   async (t) => await processPatientBatch2(t),
 *   async (t) => await processPatientBatch3(t)
 * ], 3);
 * ```
 */
export const executeParallelTransactions = async (
  sequelize: Sequelize,
  operations: Array<(transaction: Transaction) => Promise<any>>,
  maxConcurrent: number = 5,
): Promise<any[]> => {
  const results: any[] = [];

  for (let i = 0; i < operations.length; i += maxConcurrent) {
    const batch = operations.slice(i, i + maxConcurrent);
    const batchPromises = batch.map((op) => sequelize.transaction(op));
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }

  return results;
};

export default {
  // Bulk insert
  bulkInsert,
  concurrentBulkInsert,
  insertWithAutoChunking,

  // Bulk update
  bulkUpdate,
  bulkUpdateByIds,

  // Bulk delete
  bulkDelete,
  bulkDeleteByIds,

  // Batch processing
  processBatchesWithTransactions,
  processWithSharedTransaction,
  streamBatchProcessing,

  // Retry logic
  executeWithExponentialBackoff,
  executeWithJitteredBackoff,

  // Deadlock handling
  detectDeadlock,
  executeWithDeadlockRetry,

  // Queue management
  createTransactionQueue,

  // Metrics
  executeWithMetrics,
  trackSlowTransactions,

  // Conflict resolution
  upsertWithConflictResolution,

  // Locking
  executeWithLock,
  executeOptimisticLockingUpdate,

  // Savepoint management
  createSavepoint,
  rollbackToSavepoint,
  releaseSavepoint,
  executeWithSavepoint,

  // Isolation helpers
  createReadUncommittedTransaction,
  createReadCommittedTransaction,
  createRepeatableReadTransaction,
  createSerializableTransaction,

  // Timeout handling
  executeWithTimeout,
  executeWithTimeoutRetry,

  // Rollback strategies
  safeRollback,
  conditionalRollback,

  // Transaction coordination
  coordinateTransactions,
  executeCoordinatedTransaction,

  // Bulk upsert
  bulkUpsert,

  // Conditional operations
  conditionalBulkInsert,
  transformAndBulkInsert,

  // State management
  isTransactionActive,
  getTransactionStatus,

  // Parallel execution
  executeParallelTransactions,
};
