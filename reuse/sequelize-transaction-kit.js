"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeParallelTransactions = exports.getTransactionStatus = exports.isTransactionActive = exports.transformAndBulkInsert = exports.conditionalBulkInsert = exports.bulkUpsert = exports.executeCoordinatedTransaction = exports.coordinateTransactions = exports.conditionalRollback = exports.safeRollback = exports.executeWithTimeoutRetry = exports.executeWithTimeout = exports.createSerializableTransaction = exports.createRepeatableReadTransaction = exports.createReadCommittedTransaction = exports.createReadUncommittedTransaction = exports.executeWithSavepoint = exports.releaseSavepoint = exports.rollbackToSavepoint = exports.createSavepoint = exports.executeOptimisticLockingUpdate = exports.executeWithLock = exports.upsertWithConflictResolution = exports.trackSlowTransactions = exports.executeWithMetrics = exports.createTransactionQueue = exports.executeWithDeadlockRetry = exports.detectDeadlock = exports.executeWithJitteredBackoff = exports.executeWithExponentialBackoff = exports.processWithSharedTransaction = exports.processBatchesWithTransactions = exports.bulkDeleteByIds = exports.bulkDelete = exports.bulkUpdateByIds = exports.bulkUpdate = exports.insertWithAutoChunking = exports.concurrentBulkInsert = exports.bulkInsert = void 0;
exports.streamBatchProcessing = streamBatchProcessing;
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
const sequelize_1 = require("sequelize");
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
const bulkInsert = async (model, data, options = {}) => {
    const startTime = Date.now();
    const { batchSize = 1000, transaction, validate = true, ignoreDuplicates = false, updateOnDuplicate, onProgress, continueOnError = false, } = options;
    const result = {
        successful: [],
        failed: [],
        totalProcessed: 0,
        totalSuccessful: 0,
        totalFailed: 0,
        executionTime: 0,
    };
    const progress = {
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
            const bulkCreateOptions = {
                transaction,
                validate,
                ignoreDuplicates,
            };
            if (updateOnDuplicate) {
                bulkCreateOptions.updateOnDuplicate = updateOnDuplicate;
            }
            const created = await model.bulkCreate(batch, bulkCreateOptions);
            result.successful.push(...created);
            result.totalSuccessful += created.length;
            progress.successful += created.length;
        }
        catch (error) {
            if (continueOnError) {
                batch.forEach((item, idx) => {
                    result.failed.push({
                        index: i + idx,
                        error: error,
                        data: item,
                    });
                    progress.errors.push({
                        index: i + idx,
                        error: error,
                        data: item,
                    });
                });
                result.totalFailed += batch.length;
                progress.failed += batch.length;
            }
            else {
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
exports.bulkInsert = bulkInsert;
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
const concurrentBulkInsert = async (model, data, parallelBatches = 3, options = {}) => {
    const startTime = Date.now();
    const { batchSize = 1000 } = options;
    const batches = [];
    for (let i = 0; i < data.length; i += batchSize) {
        batches.push(data.slice(i, i + batchSize));
    }
    const results = {
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
            .map((batch) => (0, exports.bulkInsert)(model, batch, { ...options, onProgress: undefined }));
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
exports.concurrentBulkInsert = concurrentBulkInsert;
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
const insertWithAutoChunking = async (model, data, maxPayloadSizeKB = 1024, options = {}) => {
    const maxPayloadSizeBytes = maxPayloadSizeKB * 1024;
    const chunks = [];
    let currentChunk = [];
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
    const results = {
        successful: [],
        failed: [],
        totalProcessed: 0,
        totalSuccessful: 0,
        totalFailed: 0,
        executionTime: 0,
    };
    const startTime = Date.now();
    for (const chunk of chunks) {
        const chunkResult = await (0, exports.bulkInsert)(model, chunk, options);
        results.successful.push(...chunkResult.successful);
        results.failed.push(...chunkResult.failed);
        results.totalSuccessful += chunkResult.totalSuccessful;
        results.totalFailed += chunkResult.totalFailed;
        results.totalProcessed += chunkResult.totalProcessed;
    }
    results.executionTime = Date.now() - startTime;
    return results;
};
exports.insertWithAutoChunking = insertWithAutoChunking;
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
const bulkUpdate = async (model, updates, options = {}) => {
    const startTime = Date.now();
    const { batchSize = 500, transaction, validate = true, onProgress, continueOnError = false, individualHooks = false, } = options;
    const result = {
        successful: [],
        failed: [],
        totalProcessed: 0,
        totalSuccessful: 0,
        totalFailed: 0,
        executionTime: 0,
    };
    const progress = {
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
                const updateOptions = {
                    where,
                    transaction,
                    validate,
                    individualHooks,
                };
                const [affectedCount] = await model.update(values, updateOptions);
                result.successful.push(affectedCount);
                result.totalSuccessful += affectedCount;
                progress.successful++;
            }
            catch (error) {
                if (continueOnError) {
                    result.failed.push({
                        index: i + j,
                        error: error,
                        data: { where, values },
                    });
                    result.totalFailed++;
                    progress.failed++;
                    progress.errors.push({
                        index: i + j,
                        error: error,
                        data: { where, values },
                    });
                }
                else {
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
exports.bulkUpdate = bulkUpdate;
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
const bulkUpdateByIds = async (model, updates, options = {}) => {
    const startTime = Date.now();
    const { transaction, continueOnError = false } = options;
    const result = {
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
                await record.update(values, { transaction });
                result.successful.push(record);
                result.totalSuccessful++;
            }
            else {
                throw new Error(`Record with ID ${id} not found`);
            }
        }
        catch (error) {
            if (continueOnError) {
                result.failed.push({
                    index: i,
                    error: error,
                    data: { id, values },
                });
                result.totalFailed++;
            }
            else {
                throw error;
            }
        }
        result.totalProcessed++;
    }
    result.executionTime = Date.now() - startTime;
    return result;
};
exports.bulkUpdateByIds = bulkUpdateByIds;
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
const bulkDelete = async (model, whereConditions, options = {}) => {
    const startTime = Date.now();
    const { batchSize = 500, transaction, force = false, onProgress, continueOnError = false, } = options;
    const result = {
        successful: [],
        failed: [],
        totalProcessed: 0,
        totalSuccessful: 0,
        totalFailed: 0,
        executionTime: 0,
    };
    const progress = {
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
            const deleteOptions = {
                where,
                transaction,
                force,
            };
            const deletedCount = await model.destroy(deleteOptions);
            result.successful.push(deletedCount);
            result.totalSuccessful += deletedCount;
            progress.successful++;
        }
        catch (error) {
            if (continueOnError) {
                result.failed.push({
                    index: i,
                    error: error,
                    data: where,
                });
                result.totalFailed++;
                progress.failed++;
                progress.errors.push({
                    index: i,
                    error: error,
                    data: where,
                });
            }
            else {
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
exports.bulkDelete = bulkDelete;
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
const bulkDeleteByIds = async (model, ids, options = {}) => {
    const { batchSize = 1000 } = options;
    const whereConditions = [];
    for (let i = 0; i < ids.length; i += batchSize) {
        const batchIds = ids.slice(i, i + batchSize);
        whereConditions.push({ id: batchIds });
    }
    return (0, exports.bulkDelete)(model, whereConditions, options);
};
exports.bulkDeleteByIds = bulkDeleteByIds;
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
const processBatchesWithTransactions = async (sequelize, data, processor, options) => {
    const startTime = Date.now();
    const { batchSize, parallelBatches = 1, onBatchComplete, onBatchError, retryFailedBatches = false, maxRetries = 3, } = options;
    const batches = [];
    for (let i = 0; i < data.length; i += batchSize) {
        batches.push(data.slice(i, i + batchSize));
    }
    const result = {
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
            let lastError = null;
            while (retries <= (retryFailedBatches ? maxRetries : 0)) {
                try {
                    const batchResult = await sequelize.transaction(async (t) => {
                        return await processor(batch, t);
                    });
                    if (onBatchComplete) {
                        onBatchComplete(batch, i + batchIndex);
                    }
                    return { success: true, data: batchResult, batchIndex: i + batchIndex };
                }
                catch (error) {
                    lastError = error;
                    retries++;
                    if (retries > maxRetries || !retryFailedBatches) {
                        if (onBatchError) {
                            onBatchError(batch, error, i + batchIndex);
                        }
                        return { success: false, error: error, batch, batchIndex: i + batchIndex };
                    }
                    await new Promise((resolve) => setTimeout(resolve, 1000 * retries));
                }
            }
            return { success: false, error: lastError, batch, batchIndex: i + batchIndex };
        });
        const batchResults = await Promise.allSettled(parallelPromises);
        batchResults.forEach((batchResult) => {
            if (batchResult.status === 'fulfilled') {
                const { value } = batchResult;
                if (value.success && value.data) {
                    result.successful.push(...value.data);
                    result.totalSuccessful += value.data.length;
                }
                else if (!value.success) {
                    result.failed.push({
                        index: value.batchIndex,
                        error: value.error,
                        data: value.batch,
                    });
                    result.totalFailed += value.batch.length;
                }
                result.totalProcessed += value.success
                    ? value.data.length
                    : value.batch.length;
            }
        });
    }
    result.executionTime = Date.now() - startTime;
    return result;
};
exports.processBatchesWithTransactions = processBatchesWithTransactions;
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
const processWithSharedTransaction = async (sequelize, data, processor, transaction) => {
    const startTime = Date.now();
    const result = {
        successful: [],
        failed: [],
        totalProcessed: 0,
        totalSuccessful: 0,
        totalFailed: 0,
        executionTime: 0,
    };
    const execute = async (t) => {
        for (let i = 0; i < data.length; i++) {
            try {
                const processed = await processor(data[i], t);
                result.successful.push(processed);
                result.totalSuccessful++;
            }
            catch (error) {
                result.failed.push({
                    index: i,
                    error: error,
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
    }
    else {
        await sequelize.transaction(execute);
    }
    result.executionTime = Date.now() - startTime;
    return result;
};
exports.processWithSharedTransaction = processWithSharedTransaction;
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
const executeWithExponentialBackoff = async (sequelize, operation, options) => {
    const { maxRetries, initialDelay, maxDelay, backoffFactor, retryableErrors = ['DEADLOCK', 'SERIALIZATION_FAILURE', 'LOCK_TIMEOUT'], onRetry, shouldRetry, } = options;
    let attempt = 0;
    let lastError;
    while (attempt <= maxRetries) {
        try {
            return await sequelize.transaction(operation);
        }
        catch (error) {
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
    throw lastError;
};
exports.executeWithExponentialBackoff = executeWithExponentialBackoff;
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
const executeWithJitteredBackoff = async (sequelize, operation, options) => {
    const optionsWithJitter = {
        ...options,
        shouldRetry: (error, attempt) => {
            const baseDelay = Math.min(options.initialDelay * Math.pow(options.backoffFactor, attempt - 1), options.maxDelay);
            const jitter = Math.random() * baseDelay * 0.3;
            const delay = baseDelay + jitter;
            if (options.onRetry) {
                options.onRetry(attempt, error);
            }
            return true;
        },
    };
    return (0, exports.executeWithExponentialBackoff)(sequelize, operation, optionsWithJitter);
};
exports.executeWithJitteredBackoff = executeWithJitteredBackoff;
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
const detectDeadlock = (error) => {
    const deadlockIndicators = [
        'DEADLOCK',
        'ER_LOCK_DEADLOCK',
        '40P01',
        '1213',
        'deadlock detected',
        'was deadlocked',
    ];
    const errorMessage = error.message.toUpperCase();
    const isDeadlock = deadlockIndicators.some((indicator) => errorMessage.includes(indicator.toUpperCase()));
    return {
        isDeadlock,
        error,
        retryable: isDeadlock,
    };
};
exports.detectDeadlock = detectDeadlock;
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
const executeWithDeadlockRetry = async (sequelize, operation, maxRetries = 5, baseDelay = 100) => {
    return (0, exports.executeWithExponentialBackoff)(sequelize, operation, {
        maxRetries,
        initialDelay: baseDelay,
        maxDelay: baseDelay * 32,
        backoffFactor: 2,
        shouldRetry: (error, attempt) => {
            const deadlockInfo = (0, exports.detectDeadlock)(error);
            return deadlockInfo.isDeadlock && deadlockInfo.retryable;
        },
        onRetry: (attempt, error) => {
            console.warn(`Deadlock detected on attempt ${attempt}, retrying...`, error.message);
        },
    });
};
exports.executeWithDeadlockRetry = executeWithDeadlockRetry;
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
const createTransactionQueue = (sequelize, config) => {
    const { concurrency, maxQueueSize, defaultTimeout, onTaskComplete, onTaskError } = config;
    const queue = [];
    let activeCount = 0;
    let taskIdCounter = 0;
    const processNext = async () => {
        if (activeCount >= concurrency || queue.length === 0) {
            return;
        }
        queue.sort((a, b) => b.priority - a.priority);
        const task = queue.shift();
        activeCount++;
        try {
            const timeout = task.timeout || defaultTimeout;
            const result = await Promise.race([
                sequelize.transaction(task.operation),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Transaction timeout')), timeout)),
            ]);
            if (onTaskComplete) {
                onTaskComplete(task.id, result);
            }
        }
        catch (error) {
            if (onTaskError) {
                onTaskError(task.id, error);
            }
        }
        finally {
            activeCount--;
            processNext();
        }
    };
    return {
        enqueue: async (operation, priority = 0, timeout) => {
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
exports.createTransactionQueue = createTransactionQueue;
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
const executeWithMetrics = async (sequelize, operation, transactionId) => {
    const metrics = {
        transactionId: transactionId || `txn_${Date.now()}`,
        startTime: new Date(),
        status: 'pending',
        operationsCount: 0,
        retryCount: 0,
    };
    try {
        const result = await sequelize.transaction({
            isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
        }, async (t) => {
            metrics.isolationLevel = t.options?.isolationLevel;
            return await operation(t);
        });
        metrics.endTime = new Date();
        metrics.duration = metrics.endTime.getTime() - metrics.startTime.getTime();
        metrics.status = 'committed';
        return { result, metrics };
    }
    catch (error) {
        metrics.endTime = new Date();
        metrics.duration = metrics.endTime.getTime() - metrics.startTime.getTime();
        metrics.status = 'rolled_back';
        metrics.error = error;
        throw error;
    }
};
exports.executeWithMetrics = executeWithMetrics;
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
const trackSlowTransactions = async (sequelize, operation, slowThresholdMs, onSlowTransaction) => {
    const { result, metrics } = await (0, exports.executeWithMetrics)(sequelize, operation);
    if (metrics.duration > slowThresholdMs) {
        console.warn(`Slow transaction detected: ${metrics.transactionId} took ${metrics.duration}ms`);
        if (onSlowTransaction) {
            onSlowTransaction(metrics);
        }
    }
    return result;
};
exports.trackSlowTransactions = trackSlowTransactions;
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
const upsertWithConflictResolution = async (model, data, conflictFields, strategy, transaction) => {
    const startTime = Date.now();
    const result = {
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
            const where = {};
            conflictFields.forEach((field) => {
                where[field] = record[field];
            });
            const existing = await model.findOne({ where, transaction });
            if (existing) {
                let updateData;
                switch (strategy.strategy) {
                    case 'last_write_wins':
                        updateData = record;
                        break;
                    case 'first_write_wins':
                        continue;
                    case 'merge':
                        if (strategy.mergeFunction) {
                            updateData = strategy.mergeFunction(existing.toJSON(), record);
                        }
                        else {
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
            }
            else {
                const created = await model.create(record, { transaction });
                result.successful.push(created);
                result.totalSuccessful++;
            }
        }
        catch (error) {
            result.failed.push({
                index: i,
                error: error,
                data: record,
            });
            result.totalFailed++;
        }
        result.totalProcessed++;
    }
    result.executionTime = Date.now() - startTime;
    return result;
};
exports.upsertWithConflictResolution = upsertWithConflictResolution;
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
const executeWithLock = async (model, where, lockOptions, transaction) => {
    const { lockMode, skipLocked = false } = lockOptions;
    const lock = {
        level: sequelize_1.Transaction.LOCK[lockMode],
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
exports.executeWithLock = executeWithLock;
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
const executeOptimisticLockingUpdate = async (model, id, updates, expectedVersion, versionField = 'version', transaction) => {
    const record = await model.findOne({
        where: { id },
        transaction,
    });
    if (!record) {
        throw new Error(`Record with ID ${id} not found`);
    }
    const currentVersion = record[versionField];
    if (currentVersion !== expectedVersion) {
        throw new Error(`Version mismatch: expected ${expectedVersion}, got ${currentVersion}. ` +
            `Record was modified by another process.`);
    }
    const updateData = {
        ...updates,
        [versionField]: currentVersion + 1,
    };
    await record.update(updateData, { transaction });
    return record;
};
exports.executeOptimisticLockingUpdate = executeOptimisticLockingUpdate;
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
const createSavepoint = async (transaction, savepointName, sequelize) => {
    await sequelize.query(`SAVEPOINT ${savepointName}`, { transaction });
};
exports.createSavepoint = createSavepoint;
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
const rollbackToSavepoint = async (transaction, savepointName, sequelize) => {
    await sequelize.query(`ROLLBACK TO SAVEPOINT ${savepointName}`, { transaction });
};
exports.rollbackToSavepoint = rollbackToSavepoint;
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
const releaseSavepoint = async (transaction, savepointName, sequelize) => {
    await sequelize.query(`RELEASE SAVEPOINT ${savepointName}`, { transaction });
};
exports.releaseSavepoint = releaseSavepoint;
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
const executeWithSavepoint = async (transaction, sequelize, savepointName, operation) => {
    await (0, exports.createSavepoint)(transaction, savepointName, sequelize);
    try {
        const result = await operation(transaction);
        await (0, exports.releaseSavepoint)(transaction, savepointName, sequelize);
        return result;
    }
    catch (error) {
        await (0, exports.rollbackToSavepoint)(transaction, savepointName, sequelize);
        throw error;
    }
};
exports.executeWithSavepoint = executeWithSavepoint;
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
const createReadUncommittedTransaction = async (sequelize) => {
    return sequelize.transaction({
        isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
    });
};
exports.createReadUncommittedTransaction = createReadUncommittedTransaction;
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
const createReadCommittedTransaction = async (sequelize) => {
    return sequelize.transaction({
        isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
};
exports.createReadCommittedTransaction = createReadCommittedTransaction;
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
const createRepeatableReadTransaction = async (sequelize) => {
    return sequelize.transaction({
        isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    });
};
exports.createRepeatableReadTransaction = createRepeatableReadTransaction;
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
const createSerializableTransaction = async (sequelize) => {
    return sequelize.transaction({
        isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    });
};
exports.createSerializableTransaction = createSerializableTransaction;
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
const executeWithTimeout = async (sequelize, operation, timeoutMs) => {
    return Promise.race([
        sequelize.transaction(operation),
        new Promise((_, reject) => setTimeout(() => reject(new Error(`Transaction timeout after ${timeoutMs}ms`)), timeoutMs)),
    ]);
};
exports.executeWithTimeout = executeWithTimeout;
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
const executeWithTimeoutRetry = async (sequelize, operation, timeoutMs, maxRetries = 3) => {
    let lastError;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await (0, exports.executeWithTimeout)(sequelize, operation, timeoutMs);
        }
        catch (error) {
            lastError = error;
            if (attempt === maxRetries || !error.message.includes('timeout')) {
                throw error;
            }
            await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
        }
    }
    throw lastError;
};
exports.executeWithTimeoutRetry = executeWithTimeoutRetry;
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
const safeRollback = async (transaction) => {
    try {
        if (!transaction.finished) {
            await transaction.rollback();
        }
    }
    catch (error) {
        console.error('Error during rollback:', error);
    }
};
exports.safeRollback = safeRollback;
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
const conditionalRollback = async (transaction, condition) => {
    const shouldRollback = typeof condition === 'function' ? condition() : condition;
    if (shouldRollback && !transaction.finished) {
        await transaction.rollback();
        return true;
    }
    return false;
};
exports.conditionalRollback = conditionalRollback;
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
async function* streamBatchProcessing(sequelize, dataStream, processor, batchSize) {
    let batch = [];
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
const coordinateTransactions = async (sequelize, operations, sequential = false) => {
    if (sequential) {
        const results = [];
        for (const operation of operations) {
            const result = await sequelize.transaction(operation);
            results.push(result);
        }
        return results;
    }
    else {
        const promises = operations.map((operation) => sequelize.transaction(operation));
        return Promise.all(promises);
    }
};
exports.coordinateTransactions = coordinateTransactions;
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
const executeCoordinatedTransaction = async (sequelize, operations) => {
    return sequelize.transaction(async (t) => {
        const results = [];
        for (const operation of operations) {
            const result = await operation(t);
            results.push(result);
        }
        return results;
    });
};
exports.executeCoordinatedTransaction = executeCoordinatedTransaction;
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
const bulkUpsert = async (model, data, conflictFields, updateFields, transaction) => {
    return model.bulkCreate(data, {
        updateOnDuplicate: updateFields,
        transaction,
        validate: true,
    });
};
exports.bulkUpsert = bulkUpsert;
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
const conditionalBulkInsert = async (model, data, predicate, options) => {
    const filteredData = data.filter(predicate);
    return (0, exports.bulkInsert)(model, filteredData, options);
};
exports.conditionalBulkInsert = conditionalBulkInsert;
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
const transformAndBulkInsert = async (model, sourceData, transformer, options) => {
    const transformedData = sourceData.map(transformer);
    return (0, exports.bulkInsert)(model, transformedData, options);
};
exports.transformAndBulkInsert = transformAndBulkInsert;
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
const isTransactionActive = (transaction) => {
    return !transaction.finished;
};
exports.isTransactionActive = isTransactionActive;
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
const getTransactionStatus = (transaction) => {
    return {
        finished: transaction.finished,
        id: transaction.id || 'unknown',
    };
};
exports.getTransactionStatus = getTransactionStatus;
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
const executeParallelTransactions = async (sequelize, operations, maxConcurrent = 5) => {
    const results = [];
    for (let i = 0; i < operations.length; i += maxConcurrent) {
        const batch = operations.slice(i, i + maxConcurrent);
        const batchPromises = batch.map((op) => sequelize.transaction(op));
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
    }
    return results;
};
exports.executeParallelTransactions = executeParallelTransactions;
exports.default = {
    // Bulk insert
    bulkInsert: exports.bulkInsert,
    concurrentBulkInsert: exports.concurrentBulkInsert,
    insertWithAutoChunking: exports.insertWithAutoChunking,
    // Bulk update
    bulkUpdate: exports.bulkUpdate,
    bulkUpdateByIds: exports.bulkUpdateByIds,
    // Bulk delete
    bulkDelete: exports.bulkDelete,
    bulkDeleteByIds: exports.bulkDeleteByIds,
    // Batch processing
    processBatchesWithTransactions: exports.processBatchesWithTransactions,
    processWithSharedTransaction: exports.processWithSharedTransaction,
    streamBatchProcessing,
    // Retry logic
    executeWithExponentialBackoff: exports.executeWithExponentialBackoff,
    executeWithJitteredBackoff: exports.executeWithJitteredBackoff,
    // Deadlock handling
    detectDeadlock: exports.detectDeadlock,
    executeWithDeadlockRetry: exports.executeWithDeadlockRetry,
    // Queue management
    createTransactionQueue: exports.createTransactionQueue,
    // Metrics
    executeWithMetrics: exports.executeWithMetrics,
    trackSlowTransactions: exports.trackSlowTransactions,
    // Conflict resolution
    upsertWithConflictResolution: exports.upsertWithConflictResolution,
    // Locking
    executeWithLock: exports.executeWithLock,
    executeOptimisticLockingUpdate: exports.executeOptimisticLockingUpdate,
    // Savepoint management
    createSavepoint: exports.createSavepoint,
    rollbackToSavepoint: exports.rollbackToSavepoint,
    releaseSavepoint: exports.releaseSavepoint,
    executeWithSavepoint: exports.executeWithSavepoint,
    // Isolation helpers
    createReadUncommittedTransaction: exports.createReadUncommittedTransaction,
    createReadCommittedTransaction: exports.createReadCommittedTransaction,
    createRepeatableReadTransaction: exports.createRepeatableReadTransaction,
    createSerializableTransaction: exports.createSerializableTransaction,
    // Timeout handling
    executeWithTimeout: exports.executeWithTimeout,
    executeWithTimeoutRetry: exports.executeWithTimeoutRetry,
    // Rollback strategies
    safeRollback: exports.safeRollback,
    conditionalRollback: exports.conditionalRollback,
    // Transaction coordination
    coordinateTransactions: exports.coordinateTransactions,
    executeCoordinatedTransaction: exports.executeCoordinatedTransaction,
    // Bulk upsert
    bulkUpsert: exports.bulkUpsert,
    // Conditional operations
    conditionalBulkInsert: exports.conditionalBulkInsert,
    transformAndBulkInsert: exports.transformAndBulkInsert,
    // State management
    isTransactionActive: exports.isTransactionActive,
    getTransactionStatus: exports.getTransactionStatus,
    // Parallel execution
    executeParallelTransactions: exports.executeParallelTransactions,
};
//# sourceMappingURL=sequelize-transaction-kit.js.map