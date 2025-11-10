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
import { Sequelize, Transaction, Model, ModelStatic, IsolationLevel } from 'sequelize';
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
    errors: Array<{
        index: number;
        error: Error;
        data?: any;
    }>;
}
interface BulkOperationResult<T> {
    successful: T[];
    failed: Array<{
        index: number;
        error: Error;
        data?: any;
    }>;
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
export declare const bulkInsert: <T extends Model>(model: ModelStatic<T>, data: Partial<T>[], options?: BulkInsertOptions<T>) => Promise<BulkOperationResult<T>>;
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
export declare const concurrentBulkInsert: <T extends Model>(model: ModelStatic<T>, data: Partial<T>[], parallelBatches?: number, options?: BulkInsertOptions<T>) => Promise<BulkOperationResult<T>>;
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
export declare const insertWithAutoChunking: <T extends Model>(model: ModelStatic<T>, data: Partial<T>[], maxPayloadSizeKB?: number, options?: BulkInsertOptions<T>) => Promise<BulkOperationResult<T>>;
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
export declare const bulkUpdate: <T extends Model>(model: ModelStatic<T>, updates: Array<{
    where: any;
    values: Partial<T>;
}>, options?: BulkUpdateOptions<T>) => Promise<BulkOperationResult<number>>;
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
export declare const bulkUpdateByIds: <T extends Model>(model: ModelStatic<T>, updates: Array<{
    id: string;
    values: Partial<T>;
}>, options?: BulkUpdateOptions<T>) => Promise<BulkOperationResult<T>>;
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
export declare const bulkDelete: <T extends Model>(model: ModelStatic<T>, whereConditions: any[], options?: BulkDeleteOptions) => Promise<BulkOperationResult<number>>;
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
export declare const bulkDeleteByIds: <T extends Model>(model: ModelStatic<T>, ids: string[], options?: BulkDeleteOptions) => Promise<BulkOperationResult<number>>;
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
export declare const processBatchesWithTransactions: <T, R>(sequelize: Sequelize, data: T[], processor: (batch: T[], transaction: Transaction) => Promise<R[]>, options: BatchProcessingOptions<T>) => Promise<BulkOperationResult<R>>;
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
export declare const processWithSharedTransaction: <T, R>(sequelize: Sequelize, data: T[], processor: (item: T, transaction: Transaction) => Promise<R>, transaction?: Transaction) => Promise<BulkOperationResult<R>>;
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
export declare const executeWithExponentialBackoff: <T>(sequelize: Sequelize, operation: (transaction: Transaction) => Promise<T>, options: TransactionRetryOptions) => Promise<T>;
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
export declare const executeWithJitteredBackoff: <T>(sequelize: Sequelize, operation: (transaction: Transaction) => Promise<T>, options: TransactionRetryOptions) => Promise<T>;
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
export declare const detectDeadlock: (error: Error) => DeadlockInfo;
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
export declare const executeWithDeadlockRetry: <T>(sequelize: Sequelize, operation: (transaction: Transaction) => Promise<T>, maxRetries?: number, baseDelay?: number) => Promise<T>;
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
export declare const createTransactionQueue: (sequelize: Sequelize, config: TransactionQueueConfig) => {
    enqueue: (operation: (transaction: Transaction) => Promise<any>, priority?: number, timeout?: number) => Promise<string>;
    getQueueSize: () => number;
    getActiveCount: () => number;
    clear: () => void;
};
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
export declare const executeWithMetrics: <T>(sequelize: Sequelize, operation: (transaction: Transaction) => Promise<T>, transactionId?: string) => Promise<{
    result: T;
    metrics: TransactionMetrics;
}>;
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
export declare const trackSlowTransactions: <T>(sequelize: Sequelize, operation: (transaction: Transaction) => Promise<T>, slowThresholdMs: number, onSlowTransaction?: (metrics: TransactionMetrics) => void) => Promise<T>;
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
export declare const upsertWithConflictResolution: <T extends Model>(model: ModelStatic<T>, data: Partial<T>[], conflictFields: string[], strategy: ConflictResolutionStrategy, transaction?: Transaction) => Promise<BulkOperationResult<T>>;
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
export declare const executeWithLock: <T extends Model>(model: ModelStatic<T>, where: any, lockOptions: TransactionLockOptions, transaction: Transaction) => Promise<T[]>;
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
export declare const executeOptimisticLockingUpdate: <T extends Model>(model: ModelStatic<T>, id: string, updates: Partial<T>, expectedVersion: number, versionField?: string, transaction?: Transaction) => Promise<T>;
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
export declare const createSavepoint: (transaction: Transaction, savepointName: string, sequelize: Sequelize) => Promise<void>;
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
export declare const rollbackToSavepoint: (transaction: Transaction, savepointName: string, sequelize: Sequelize) => Promise<void>;
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
export declare const releaseSavepoint: (transaction: Transaction, savepointName: string, sequelize: Sequelize) => Promise<void>;
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
export declare const executeWithSavepoint: <T>(transaction: Transaction, sequelize: Sequelize, savepointName: string, operation: (transaction: Transaction) => Promise<T>) => Promise<T>;
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
export declare const createReadUncommittedTransaction: (sequelize: Sequelize) => Promise<Transaction>;
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
export declare const createReadCommittedTransaction: (sequelize: Sequelize) => Promise<Transaction>;
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
export declare const createRepeatableReadTransaction: (sequelize: Sequelize) => Promise<Transaction>;
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
export declare const createSerializableTransaction: (sequelize: Sequelize) => Promise<Transaction>;
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
export declare const executeWithTimeout: <T>(sequelize: Sequelize, operation: (transaction: Transaction) => Promise<T>, timeoutMs: number) => Promise<T>;
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
export declare const executeWithTimeoutRetry: <T>(sequelize: Sequelize, operation: (transaction: Transaction) => Promise<T>, timeoutMs: number, maxRetries?: number) => Promise<T>;
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
export declare const safeRollback: (transaction: Transaction) => Promise<void>;
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
export declare const conditionalRollback: (transaction: Transaction, condition: boolean | (() => boolean)) => Promise<boolean>;
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
export declare function streamBatchProcessing<T, R>(sequelize: Sequelize, dataStream: AsyncIterable<T>, processor: (batch: T[], transaction: Transaction) => Promise<R[]>, batchSize: number): AsyncGenerator<R[], void, unknown>;
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
export declare const coordinateTransactions: (sequelize: Sequelize, operations: Array<(transaction: Transaction) => Promise<any>>, sequential?: boolean) => Promise<any[]>;
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
export declare const executeCoordinatedTransaction: (sequelize: Sequelize, operations: Array<(transaction: Transaction) => Promise<any>>) => Promise<any[]>;
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
export declare const bulkUpsert: <T extends Model>(model: ModelStatic<T>, data: Partial<T>[], conflictFields: string[], updateFields: string[], transaction?: Transaction) => Promise<T[]>;
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
export declare const conditionalBulkInsert: <T extends Model>(model: ModelStatic<T>, data: Partial<T>[], predicate: (record: Partial<T>) => boolean, options?: BulkInsertOptions<T>) => Promise<BulkOperationResult<T>>;
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
export declare const transformAndBulkInsert: <T extends Model, S>(model: ModelStatic<T>, sourceData: S[], transformer: (source: S) => Partial<T>, options?: BulkInsertOptions<T>) => Promise<BulkOperationResult<T>>;
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
export declare const isTransactionActive: (transaction: Transaction) => boolean;
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
export declare const getTransactionStatus: (transaction: Transaction) => {
    finished: boolean;
    id: string;
};
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
export declare const executeParallelTransactions: (sequelize: Sequelize, operations: Array<(transaction: Transaction) => Promise<any>>, maxConcurrent?: number) => Promise<any[]>;
declare const _default: {
    bulkInsert: <T extends Model>(model: ModelStatic<T>, data: Partial<T>[], options?: BulkInsertOptions<T>) => Promise<BulkOperationResult<T>>;
    concurrentBulkInsert: <T extends Model>(model: ModelStatic<T>, data: Partial<T>[], parallelBatches?: number, options?: BulkInsertOptions<T>) => Promise<BulkOperationResult<T>>;
    insertWithAutoChunking: <T extends Model>(model: ModelStatic<T>, data: Partial<T>[], maxPayloadSizeKB?: number, options?: BulkInsertOptions<T>) => Promise<BulkOperationResult<T>>;
    bulkUpdate: <T extends Model>(model: ModelStatic<T>, updates: Array<{
        where: any;
        values: Partial<T>;
    }>, options?: BulkUpdateOptions<T>) => Promise<BulkOperationResult<number>>;
    bulkUpdateByIds: <T extends Model>(model: ModelStatic<T>, updates: Array<{
        id: string;
        values: Partial<T>;
    }>, options?: BulkUpdateOptions<T>) => Promise<BulkOperationResult<T>>;
    bulkDelete: <T extends Model>(model: ModelStatic<T>, whereConditions: any[], options?: BulkDeleteOptions) => Promise<BulkOperationResult<number>>;
    bulkDeleteByIds: <T extends Model>(model: ModelStatic<T>, ids: string[], options?: BulkDeleteOptions) => Promise<BulkOperationResult<number>>;
    processBatchesWithTransactions: <T, R>(sequelize: Sequelize, data: T[], processor: (batch: T[], transaction: Transaction) => Promise<R[]>, options: BatchProcessingOptions<T>) => Promise<BulkOperationResult<R>>;
    processWithSharedTransaction: <T, R>(sequelize: Sequelize, data: T[], processor: (item: T, transaction: Transaction) => Promise<R>, transaction?: Transaction) => Promise<BulkOperationResult<R>>;
    streamBatchProcessing: typeof streamBatchProcessing;
    executeWithExponentialBackoff: <T>(sequelize: Sequelize, operation: (transaction: Transaction) => Promise<T>, options: TransactionRetryOptions) => Promise<T>;
    executeWithJitteredBackoff: <T>(sequelize: Sequelize, operation: (transaction: Transaction) => Promise<T>, options: TransactionRetryOptions) => Promise<T>;
    detectDeadlock: (error: Error) => DeadlockInfo;
    executeWithDeadlockRetry: <T>(sequelize: Sequelize, operation: (transaction: Transaction) => Promise<T>, maxRetries?: number, baseDelay?: number) => Promise<T>;
    createTransactionQueue: (sequelize: Sequelize, config: TransactionQueueConfig) => {
        enqueue: (operation: (transaction: Transaction) => Promise<any>, priority?: number, timeout?: number) => Promise<string>;
        getQueueSize: () => number;
        getActiveCount: () => number;
        clear: () => void;
    };
    executeWithMetrics: <T>(sequelize: Sequelize, operation: (transaction: Transaction) => Promise<T>, transactionId?: string) => Promise<{
        result: T;
        metrics: TransactionMetrics;
    }>;
    trackSlowTransactions: <T>(sequelize: Sequelize, operation: (transaction: Transaction) => Promise<T>, slowThresholdMs: number, onSlowTransaction?: (metrics: TransactionMetrics) => void) => Promise<T>;
    upsertWithConflictResolution: <T extends Model>(model: ModelStatic<T>, data: Partial<T>[], conflictFields: string[], strategy: ConflictResolutionStrategy, transaction?: Transaction) => Promise<BulkOperationResult<T>>;
    executeWithLock: <T extends Model>(model: ModelStatic<T>, where: any, lockOptions: TransactionLockOptions, transaction: Transaction) => Promise<T[]>;
    executeOptimisticLockingUpdate: <T extends Model>(model: ModelStatic<T>, id: string, updates: Partial<T>, expectedVersion: number, versionField?: string, transaction?: Transaction) => Promise<T>;
    createSavepoint: (transaction: Transaction, savepointName: string, sequelize: Sequelize) => Promise<void>;
    rollbackToSavepoint: (transaction: Transaction, savepointName: string, sequelize: Sequelize) => Promise<void>;
    releaseSavepoint: (transaction: Transaction, savepointName: string, sequelize: Sequelize) => Promise<void>;
    executeWithSavepoint: <T>(transaction: Transaction, sequelize: Sequelize, savepointName: string, operation: (transaction: Transaction) => Promise<T>) => Promise<T>;
    createReadUncommittedTransaction: (sequelize: Sequelize) => Promise<Transaction>;
    createReadCommittedTransaction: (sequelize: Sequelize) => Promise<Transaction>;
    createRepeatableReadTransaction: (sequelize: Sequelize) => Promise<Transaction>;
    createSerializableTransaction: (sequelize: Sequelize) => Promise<Transaction>;
    executeWithTimeout: <T>(sequelize: Sequelize, operation: (transaction: Transaction) => Promise<T>, timeoutMs: number) => Promise<T>;
    executeWithTimeoutRetry: <T>(sequelize: Sequelize, operation: (transaction: Transaction) => Promise<T>, timeoutMs: number, maxRetries?: number) => Promise<T>;
    safeRollback: (transaction: Transaction) => Promise<void>;
    conditionalRollback: (transaction: Transaction, condition: boolean | (() => boolean)) => Promise<boolean>;
    coordinateTransactions: (sequelize: Sequelize, operations: Array<(transaction: Transaction) => Promise<any>>, sequential?: boolean) => Promise<any[]>;
    executeCoordinatedTransaction: (sequelize: Sequelize, operations: Array<(transaction: Transaction) => Promise<any>>) => Promise<any[]>;
    bulkUpsert: <T extends Model>(model: ModelStatic<T>, data: Partial<T>[], conflictFields: string[], updateFields: string[], transaction?: Transaction) => Promise<T[]>;
    conditionalBulkInsert: <T extends Model>(model: ModelStatic<T>, data: Partial<T>[], predicate: (record: Partial<T>) => boolean, options?: BulkInsertOptions<T>) => Promise<BulkOperationResult<T>>;
    transformAndBulkInsert: <T extends Model, S>(model: ModelStatic<T>, sourceData: S[], transformer: (source: S) => Partial<T>, options?: BulkInsertOptions<T>) => Promise<BulkOperationResult<T>>;
    isTransactionActive: (transaction: Transaction) => boolean;
    getTransactionStatus: (transaction: Transaction) => {
        finished: boolean;
        id: string;
    };
    executeParallelTransactions: (sequelize: Sequelize, operations: Array<(transaction: Transaction) => Promise<any>>, maxConcurrent?: number) => Promise<any[]>;
};
export default _default;
//# sourceMappingURL=sequelize-transaction-kit.d.ts.map