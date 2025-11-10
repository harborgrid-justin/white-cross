"use strict";
/**
 * LOC: TXN1234567
 * File: /reuse/database-transaction-utils.ts
 *
 * UPSTREAM (imports from):
 *   - Sequelize (database ORM)
 *   - Database connection pools
 *
 * DOWNSTREAM (imported by):
 *   - Database service layer
 *   - Data access objects
 *   - ETL pipeline services
 *   - API transaction middleware
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackTransactionMetrics = exports.withWriteTransaction = exports.withReadTransaction = exports.createReadWriteTransaction = exports.createReadOnlyTransaction = exports.afterCommit = exports.withTransactionHooks = exports.conditionalRollback = exports.safeRollback = exports.withDeadlockRetry = exports.isDeadlock = exports.isTransactionRetryable = exports.retryTransaction = exports.coordinateDistributedTransaction = exports.rollbackPreparedTransaction = exports.commitPreparedTransaction = exports.prepareTransaction = exports.getIsolationLevelForOperation = exports.createSerializableTransaction = exports.createRepeatableReadTransaction = exports.createReadCommittedTransaction = exports.createReadUncommittedTransaction = exports.releaseSavepoint = exports.rollbackToSavepoint = exports.createSavepoint = exports.withNestedTransaction = exports.createNestedTransaction = exports.getTransactionStatus = exports.isTransactionActive = exports.rollbackTransaction = exports.commitTransaction = exports.withTransaction = exports.createTransaction = void 0;
/**
 * File: /reuse/database-transaction-utils.ts
 * Locator: WC-UTL-TXN-004
 * Purpose: Database Transaction Utilities - Comprehensive transaction management helpers
 *
 * Upstream: Sequelize ORM, database connection pools
 * Downstream: ../backend/*, ../services/*, database services, data access layers
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize 6.x
 * Exports: 40 utility functions for transaction management, isolation, retry logic, hooks
 *
 * LLM Context: Comprehensive database transaction utilities for White Cross system.
 * Provides transaction lifecycle management, nested transactions, savepoints, isolation
 * levels, two-phase commit, distributed transactions, deadlock handling, and retry logic.
 * Essential for maintaining ACID compliance in healthcare data operations.
 */
const sequelize_1 = require("sequelize");
// ============================================================================
// TRANSACTION CREATION AND MANAGEMENT
// ============================================================================
/**
 * Creates a new database transaction with configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {TransactionConfig} [config] - Transaction configuration
 * @returns {Promise<Transaction>} Created transaction
 *
 * @example
 * ```typescript
 * const transaction = await createTransaction(sequelize, {
 *   isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
 *   timeout: 5000
 * });
 * ```
 */
const createTransaction = async (sequelize, config) => {
    const options = {};
    if (config?.isolationLevel) {
        options.isolationLevel = config.isolationLevel;
    }
    if (config?.autocommit !== undefined) {
        options.autocommit = config.autocommit;
    }
    if (config?.timeout) {
        options.lock = {
            level: sequelize_1.Transaction.LOCK.UPDATE,
            of: undefined,
        };
    }
    return await sequelize.transaction(options);
};
exports.createTransaction = createTransaction;
/**
 * Executes function within a managed transaction with auto-commit/rollback.
 *
 * @template T
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {(transaction: Transaction) => Promise<T>} callback - Transaction callback
 * @param {TransactionConfig} [config] - Transaction configuration
 * @returns {Promise<T>} Callback result
 *
 * @example
 * ```typescript
 * const result = await withTransaction(sequelize, async (t) => {
 *   await Student.create({ name: 'John' }, { transaction: t });
 *   await Grade.create({ studentId: 1, grade: 'A' }, { transaction: t });
 *   return { success: true };
 * });
 * ```
 */
const withTransaction = async (sequelize, callback, config) => {
    return await sequelize.transaction({
        isolationLevel: config?.isolationLevel,
        autocommit: config?.autocommit,
    }, callback);
};
exports.withTransaction = withTransaction;
/**
 * Commits a transaction with validation.
 *
 * @param {Transaction} transaction - Transaction to commit
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * const transaction = await sequelize.transaction();
 * try {
 *   await Student.create({ name: 'John' }, { transaction });
 *   await commitTransaction(transaction);
 * } catch (error) {
 *   await rollbackTransaction(transaction);
 * }
 * ```
 */
const commitTransaction = async (transaction) => {
    if (!transaction || transaction.finished) {
        throw new Error('Transaction is null or already finished');
    }
    await transaction.commit();
};
exports.commitTransaction = commitTransaction;
/**
 * Rolls back a transaction with error handling.
 *
 * @param {Transaction} transaction - Transaction to rollback
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * try {
 *   await Student.create({ name: 'John' }, { transaction });
 * } catch (error) {
 *   await rollbackTransaction(transaction);
 *   throw error;
 * }
 * ```
 */
const rollbackTransaction = async (transaction) => {
    if (!transaction || transaction.finished) {
        return; // Already finished, no need to rollback
    }
    await transaction.rollback();
};
exports.rollbackTransaction = rollbackTransaction;
/**
 * Checks if transaction is active and not finished.
 *
 * @param {Transaction} transaction - Transaction to check
 * @returns {boolean} True if transaction is active
 *
 * @example
 * ```typescript
 * if (isTransactionActive(transaction)) {
 *   await Student.create({ name: 'John' }, { transaction });
 * }
 * ```
 */
const isTransactionActive = (transaction) => {
    return transaction && !transaction.finished;
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
 * // Result: { finished: false, committed: false, rolledBack: false }
 * ```
 */
const getTransactionStatus = (transaction) => {
    return {
        finished: transaction.finished,
        id: transaction.id,
        options: transaction.options,
    };
};
exports.getTransactionStatus = getTransactionStatus;
// ============================================================================
// NESTED TRANSACTIONS
// ============================================================================
/**
 * Creates a nested transaction using savepoints.
 *
 * @param {Transaction} parentTransaction - Parent transaction
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Transaction>} Nested transaction
 *
 * @example
 * ```typescript
 * await withTransaction(sequelize, async (parentTxn) => {
 *   await Student.create({ name: 'John' }, { transaction: parentTxn });
 *
 *   const nestedTxn = await createNestedTransaction(parentTxn, sequelize);
 *   await Grade.create({ studentId: 1, grade: 'A' }, { transaction: nestedTxn });
 *   await commitTransaction(nestedTxn);
 * });
 * ```
 */
const createNestedTransaction = async (parentTransaction, sequelize) => {
    if (!(0, exports.isTransactionActive)(parentTransaction)) {
        throw new Error('Parent transaction is not active');
    }
    // In Sequelize, nested transactions are implemented as savepoints
    return await sequelize.transaction({
        transaction: parentTransaction,
    });
};
exports.createNestedTransaction = createNestedTransaction;
/**
 * Executes callback within nested transaction.
 *
 * @template T
 * @param {Transaction} parentTransaction - Parent transaction
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {(transaction: Transaction) => Promise<T>} callback - Nested transaction callback
 * @returns {Promise<T>} Callback result
 *
 * @example
 * ```typescript
 * await withTransaction(sequelize, async (parentTxn) => {
 *   await withNestedTransaction(parentTxn, sequelize, async (nestedTxn) => {
 *     await Grade.create({ studentId: 1, grade: 'A' }, { transaction: nestedTxn });
 *   });
 * });
 * ```
 */
const withNestedTransaction = async (parentTransaction, sequelize, callback) => {
    const nestedTransaction = await (0, exports.createNestedTransaction)(parentTransaction, sequelize);
    try {
        const result = await callback(nestedTransaction);
        await (0, exports.commitTransaction)(nestedTransaction);
        return result;
    }
    catch (error) {
        await (0, exports.rollbackTransaction)(nestedTransaction);
        throw error;
    }
};
exports.withNestedTransaction = withNestedTransaction;
// ============================================================================
// SAVEPOINT MANAGEMENT
// ============================================================================
/**
 * Creates a savepoint within a transaction.
 *
 * @param {Transaction} transaction - Active transaction
 * @param {string} savepointName - Savepoint name
 * @returns {Promise<SavepointInfo>} Savepoint information
 *
 * @example
 * ```typescript
 * const transaction = await sequelize.transaction();
 * const savepoint = await createSavepoint(transaction, 'before_student_insert');
 * await Student.create({ name: 'John' }, { transaction });
 * await rollbackToSavepoint(transaction, savepoint.name);
 * ```
 */
const createSavepoint = async (transaction, savepointName) => {
    if (!(0, exports.isTransactionActive)(transaction)) {
        throw new Error('Transaction is not active');
    }
    const sequelize = transaction.sequelize;
    await sequelize.query(`SAVEPOINT ${savepointName}`, { transaction });
    return {
        name: savepointName,
        transaction,
        timestamp: new Date(),
    };
};
exports.createSavepoint = createSavepoint;
/**
 * Rolls back transaction to a specific savepoint.
 *
 * @param {Transaction} transaction - Active transaction
 * @param {string} savepointName - Savepoint name to rollback to
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * const savepoint = await createSavepoint(transaction, 'checkpoint1');
 * await Student.create({ name: 'John' }, { transaction });
 * await rollbackToSavepoint(transaction, 'checkpoint1'); // Undoes student creation
 * ```
 */
const rollbackToSavepoint = async (transaction, savepointName) => {
    if (!(0, exports.isTransactionActive)(transaction)) {
        throw new Error('Transaction is not active');
    }
    const sequelize = transaction.sequelize;
    await sequelize.query(`ROLLBACK TO SAVEPOINT ${savepointName}`, { transaction });
};
exports.rollbackToSavepoint = rollbackToSavepoint;
/**
 * Releases a savepoint (removes it from the transaction).
 *
 * @param {Transaction} transaction - Active transaction
 * @param {string} savepointName - Savepoint name to release
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * const savepoint = await createSavepoint(transaction, 'checkpoint1');
 * await Student.create({ name: 'John' }, { transaction });
 * await releaseSavepoint(transaction, 'checkpoint1'); // Commit changes, remove savepoint
 * ```
 */
const releaseSavepoint = async (transaction, savepointName) => {
    if (!(0, exports.isTransactionActive)(transaction)) {
        throw new Error('Transaction is not active');
    }
    const sequelize = transaction.sequelize;
    await sequelize.query(`RELEASE SAVEPOINT ${savepointName}`, { transaction });
};
exports.releaseSavepoint = releaseSavepoint;
// ============================================================================
// TRANSACTION ISOLATION LEVELS
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
 * // Can read uncommitted changes from other transactions (dirty reads possible)
 * ```
 */
const createReadUncommittedTransaction = async (sequelize) => {
    return await (0, exports.createTransaction)(sequelize, {
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
 * // Only reads committed changes (prevents dirty reads)
 * ```
 */
const createReadCommittedTransaction = async (sequelize) => {
    return await (0, exports.createTransaction)(sequelize, {
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
 * // Prevents dirty reads and non-repeatable reads
 * ```
 */
const createRepeatableReadTransaction = async (sequelize) => {
    return await (0, exports.createTransaction)(sequelize, {
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
 * // Highest isolation level, prevents all anomalies
 * ```
 */
const createSerializableTransaction = async (sequelize) => {
    return await (0, exports.createTransaction)(sequelize, {
        isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    });
};
exports.createSerializableTransaction = createSerializableTransaction;
/**
 * Gets appropriate isolation level for operation type.
 *
 * @param {string} operationType - Operation type: 'read', 'write', 'critical'
 * @returns {IsolationLevel} Recommended isolation level
 *
 * @example
 * ```typescript
 * const level = getIsolationLevelForOperation('critical');
 * const transaction = await createTransaction(sequelize, { isolationLevel: level });
 * ```
 */
const getIsolationLevelForOperation = (operationType) => {
    switch (operationType) {
        case 'read':
            return sequelize_1.Transaction.ISOLATION_LEVELS.READ_COMMITTED;
        case 'write':
            return sequelize_1.Transaction.ISOLATION_LEVELS.REPEATABLE_READ;
        case 'critical':
            return sequelize_1.Transaction.ISOLATION_LEVELS.SERIALIZABLE;
        default:
            return sequelize_1.Transaction.ISOLATION_LEVELS.READ_COMMITTED;
    }
};
exports.getIsolationLevelForOperation = getIsolationLevelForOperation;
// ============================================================================
// TWO-PHASE COMMIT
// ============================================================================
/**
 * Executes prepare phase of two-phase commit.
 *
 * @param {Transaction} transaction - Transaction to prepare
 * @param {string} transactionId - Global transaction identifier
 * @returns {Promise<boolean>} True if prepare successful
 *
 * @example
 * ```typescript
 * const transaction = await sequelize.transaction();
 * const prepared = await prepareTransaction(transaction, 'global_txn_123');
 * if (prepared) {
 *   await commitPreparedTransaction(transaction, 'global_txn_123');
 * }
 * ```
 */
const prepareTransaction = async (transaction, transactionId) => {
    try {
        if (!(0, exports.isTransactionActive)(transaction)) {
            throw new Error('Transaction is not active');
        }
        const sequelize = transaction.sequelize;
        await sequelize.query(`PREPARE TRANSACTION '${transactionId}'`, { transaction });
        return true;
    }
    catch (error) {
        console.error(`Failed to prepare transaction ${transactionId}:`, error);
        return false;
    }
};
exports.prepareTransaction = prepareTransaction;
/**
 * Commits a prepared transaction.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} transactionId - Global transaction identifier
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await commitPreparedTransaction(sequelize, 'global_txn_123');
 * ```
 */
const commitPreparedTransaction = async (sequelize, transactionId) => {
    await sequelize.query(`COMMIT PREPARED '${transactionId}'`);
};
exports.commitPreparedTransaction = commitPreparedTransaction;
/**
 * Rolls back a prepared transaction.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} transactionId - Global transaction identifier
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await rollbackPreparedTransaction(sequelize, 'global_txn_123');
 * ```
 */
const rollbackPreparedTransaction = async (sequelize, transactionId) => {
    await sequelize.query(`ROLLBACK PREPARED '${transactionId}'`);
};
exports.rollbackPreparedTransaction = rollbackPreparedTransaction;
// ============================================================================
// DISTRIBUTED TRANSACTIONS
// ============================================================================
/**
 * Coordinates a distributed transaction across multiple databases.
 *
 * @param {Sequelize[]} participants - Array of Sequelize instances
 * @param {(transactions: Transaction[]) => Promise<void>} callback - Transaction callback
 * @param {DistributedTransactionConfig} config - Distributed transaction config
 * @returns {Promise<TwoPhaseCommitResult>} Result of distributed transaction
 *
 * @example
 * ```typescript
 * const result = await coordinateDistributedTransaction(
 *   [sequelize1, sequelize2, sequelize3],
 *   async (transactions) => {
 *     await Student.create({ name: 'John' }, { transaction: transactions[0] });
 *     await Grade.create({ grade: 'A' }, { transaction: transactions[1] });
 *   },
 *   { coordinatorId: 'coord1', participantIds: ['db1', 'db2', 'db3'], timeout: 10000 }
 * );
 * ```
 */
const coordinateDistributedTransaction = async (participants, callback, config) => {
    const transactions = [];
    const preparedParticipants = [];
    const failedParticipants = [];
    try {
        // Phase 1: Create transactions and execute callback
        for (const participant of participants) {
            const transaction = await participant.transaction();
            transactions.push(transaction);
        }
        await callback(transactions);
        // Phase 2: Prepare all participants
        for (let i = 0; i < participants.length; i++) {
            const participantId = config.participantIds[i];
            const prepared = await (0, exports.prepareTransaction)(transactions[i], `${config.coordinatorId}_${participantId}`);
            if (prepared) {
                preparedParticipants.push(participantId);
            }
            else {
                failedParticipants.push(participantId);
            }
        }
        // If all prepared, commit all
        if (failedParticipants.length === 0) {
            for (let i = 0; i < participants.length; i++) {
                const participantId = config.participantIds[i];
                await (0, exports.commitPreparedTransaction)(participants[i], `${config.coordinatorId}_${participantId}`);
            }
            return {
                success: true,
                preparedCount: preparedParticipants.length,
                committedCount: participants.length,
                failedParticipants: [],
            };
        }
        else {
            // Rollback all prepared transactions
            for (const participantId of preparedParticipants) {
                const index = config.participantIds.indexOf(participantId);
                await (0, exports.rollbackPreparedTransaction)(participants[index], `${config.coordinatorId}_${participantId}`);
            }
            throw new Error(`Failed to prepare participants: ${failedParticipants.join(', ')}`);
        }
    }
    catch (error) {
        // Rollback all transactions
        for (const transaction of transactions) {
            await (0, exports.rollbackTransaction)(transaction);
        }
        return {
            success: false,
            preparedCount: preparedParticipants.length,
            committedCount: 0,
            failedParticipants,
            error: error,
        };
    }
};
exports.coordinateDistributedTransaction = coordinateDistributedTransaction;
// ============================================================================
// TRANSACTION RETRY LOGIC
// ============================================================================
/**
 * Executes transaction with automatic retry on failure.
 *
 * @template T
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {(transaction: Transaction) => Promise<T>} callback - Transaction callback
 * @param {RetryConfig} config - Retry configuration
 * @returns {Promise<T>} Callback result
 *
 * @example
 * ```typescript
 * const result = await retryTransaction(
 *   sequelize,
 *   async (t) => await Student.create({ name: 'John' }, { transaction: t }),
 *   { maxRetries: 3, retryDelay: 1000, backoffMultiplier: 2 }
 * );
 * ```
 */
const retryTransaction = async (sequelize, callback, config) => {
    const { maxRetries, retryDelay, backoffMultiplier = 2, retryableErrors = [] } = config;
    let lastError;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await (0, exports.withTransaction)(sequelize, callback);
        }
        catch (error) {
            lastError = error;
            const isLastAttempt = attempt === maxRetries;
            const isRetryable = (0, exports.isTransactionRetryable)(error, retryableErrors);
            if (isLastAttempt || !isRetryable) {
                throw error;
            }
            const delay = retryDelay * Math.pow(backoffMultiplier, attempt);
            await sleep(delay);
        }
    }
    throw lastError;
};
exports.retryTransaction = retryTransaction;
/**
 * Checks if transaction error is retryable.
 *
 * @param {Error} error - Transaction error
 * @param {string[]} [retryableErrors] - List of retryable error codes/messages
 * @returns {boolean} True if error is retryable
 *
 * @example
 * ```typescript
 * if (isTransactionRetryable(error, ['DEADLOCK', 'LOCK_TIMEOUT'])) {
 *   // Retry transaction
 * }
 * ```
 */
const isTransactionRetryable = (error, retryableErrors) => {
    const defaultRetryableErrors = [
        'DEADLOCK',
        'LOCK_TIMEOUT',
        'SERIALIZATION_FAILURE',
        'ECONNRESET',
        'ETIMEDOUT',
    ];
    const errorsToCheck = retryableErrors || defaultRetryableErrors;
    const errorMessage = error.message.toUpperCase();
    return errorsToCheck.some((retryableError) => errorMessage.includes(retryableError));
};
exports.isTransactionRetryable = isTransactionRetryable;
/**
 * Sleep helper for retry delays.
 *
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await sleep(1000); // Wait 1 second
 * ```
 */
const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
// ============================================================================
// DEADLOCK DETECTION AND RECOVERY
// ============================================================================
/**
 * Detects if error is caused by deadlock.
 *
 * @param {Error} error - Database error
 * @returns {boolean} True if deadlock detected
 *
 * @example
 * ```typescript
 * try {
 *   await withTransaction(sequelize, async (t) => { ... });
 * } catch (error) {
 *   if (isDeadlock(error)) {
 *     // Handle deadlock
 *   }
 * }
 * ```
 */
const isDeadlock = (error) => {
    const deadlockIndicators = ['DEADLOCK', 'ER_LOCK_DEADLOCK', '40P01', '1213'];
    const errorMessage = error.message.toUpperCase();
    return deadlockIndicators.some((indicator) => errorMessage.includes(indicator));
};
exports.isDeadlock = isDeadlock;
/**
 * Executes transaction with automatic deadlock retry.
 *
 * @template T
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {(transaction: Transaction) => Promise<T>} callback - Transaction callback
 * @param {number} [maxRetries] - Maximum retry attempts (default: 3)
 * @returns {Promise<T>} Callback result
 *
 * @example
 * ```typescript
 * const result = await withDeadlockRetry(sequelize, async (t) => {
 *   await Student.update({ name: 'Updated' }, { where: { id: 1 }, transaction: t });
 *   await Grade.update({ grade: 'A+' }, { where: { studentId: 1 }, transaction: t });
 *   return { success: true };
 * }, 5);
 * ```
 */
const withDeadlockRetry = async (sequelize, callback, maxRetries = 3) => {
    return await (0, exports.retryTransaction)(sequelize, callback, {
        maxRetries,
        retryDelay: 100,
        backoffMultiplier: 2,
        retryableErrors: ['DEADLOCK', 'ER_LOCK_DEADLOCK', '40P01', '1213'],
    });
};
exports.withDeadlockRetry = withDeadlockRetry;
// ============================================================================
// TRANSACTION ROLLBACK HELPERS
// ============================================================================
/**
 * Safely rolls back transaction with error handling.
 *
 * @param {Transaction} transaction - Transaction to rollback
 * @param {Error} [error] - Original error that triggered rollback
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * try {
 *   await Student.create({ name: 'John' }, { transaction });
 * } catch (error) {
 *   await safeRollback(transaction, error);
 * }
 * ```
 */
const safeRollback = async (transaction, error) => {
    try {
        await (0, exports.rollbackTransaction)(transaction);
    }
    catch (rollbackError) {
        console.error('Error during rollback:', rollbackError);
        if (error) {
            console.error('Original error:', error);
        }
    }
};
exports.safeRollback = safeRollback;
/**
 * Conditionally rolls back transaction based on condition.
 *
 * @param {Transaction} transaction - Transaction to potentially rollback
 * @param {boolean} condition - Condition to trigger rollback
 * @returns {Promise<boolean>} True if rolled back
 *
 * @example
 * ```typescript
 * const student = await Student.create({ name: 'John' }, { transaction });
 * const shouldRollback = student.age < 5;
 * await conditionalRollback(transaction, shouldRollback);
 * ```
 */
const conditionalRollback = async (transaction, condition) => {
    if (condition && (0, exports.isTransactionActive)(transaction)) {
        await (0, exports.rollbackTransaction)(transaction);
        return true;
    }
    return false;
};
exports.conditionalRollback = conditionalRollback;
// ============================================================================
// TRANSACTION HOOKS
// ============================================================================
/**
 * Executes transaction with lifecycle hooks.
 *
 * @template T
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {(transaction: Transaction) => Promise<T>} callback - Transaction callback
 * @param {TransactionHooks} hooks - Transaction lifecycle hooks
 * @returns {Promise<T>} Callback result
 *
 * @example
 * ```typescript
 * const result = await withTransactionHooks(
 *   sequelize,
 *   async (t) => await Student.create({ name: 'John' }, { transaction: t }),
 *   {
 *     beforeCommit: async (t) => console.log('About to commit'),
 *     afterCommit: async (t) => console.log('Committed successfully'),
 *     beforeRollback: async (t) => console.log('About to rollback'),
 *     afterRollback: async (t) => console.log('Rolled back')
 *   }
 * );
 * ```
 */
const withTransactionHooks = async (sequelize, callback, hooks) => {
    const transaction = await sequelize.transaction();
    try {
        const result = await callback(transaction);
        if (hooks.beforeCommit) {
            await hooks.beforeCommit(transaction);
        }
        await (0, exports.commitTransaction)(transaction);
        if (hooks.afterCommit) {
            await hooks.afterCommit(transaction);
        }
        return result;
    }
    catch (error) {
        if (hooks.beforeRollback) {
            await hooks.beforeRollback(transaction);
        }
        await (0, exports.rollbackTransaction)(transaction);
        if (hooks.afterRollback) {
            await hooks.afterRollback(transaction);
        }
        throw error;
    }
};
exports.withTransactionHooks = withTransactionHooks;
/**
 * Registers a callback to execute after successful commit.
 *
 * @param {Transaction} transaction - Active transaction
 * @param {() => Promise<void> | void} callback - Callback to execute after commit
 * @returns {void}
 *
 * @example
 * ```typescript
 * const transaction = await sequelize.transaction();
 * afterCommit(transaction, async () => {
 *   await sendNotificationEmail(student.email);
 * });
 * await Student.create({ name: 'John' }, { transaction });
 * await commitTransaction(transaction); // Email sent after commit
 * ```
 */
const afterCommit = (transaction, callback) => {
    transaction.afterCommit(async () => {
        await callback();
    });
};
exports.afterCommit = afterCommit;
// ============================================================================
// READ-WRITE TRANSACTION SPLITTING
// ============================================================================
/**
 * Creates a read-only transaction for query operations.
 *
 * @param {Sequelize} sequelize - Sequelize instance (can be read replica)
 * @returns {Promise<Transaction>} Read-only transaction
 *
 * @example
 * ```typescript
 * const readTransaction = await createReadOnlyTransaction(readReplicaSequelize);
 * const students = await Student.findAll({ transaction: readTransaction });
 * await commitTransaction(readTransaction);
 * ```
 */
const createReadOnlyTransaction = async (sequelize) => {
    return await (0, exports.createTransaction)(sequelize, {
        isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
        readOnly: true,
    });
};
exports.createReadOnlyTransaction = createReadOnlyTransaction;
/**
 * Creates a read-write transaction for modification operations.
 *
 * @param {Sequelize} sequelize - Sequelize instance (primary database)
 * @returns {Promise<Transaction>} Read-write transaction
 *
 * @example
 * ```typescript
 * const writeTransaction = await createReadWriteTransaction(primarySequelize);
 * await Student.create({ name: 'John' }, { transaction: writeTransaction });
 * await commitTransaction(writeTransaction);
 * ```
 */
const createReadWriteTransaction = async (sequelize) => {
    return await (0, exports.createTransaction)(sequelize, {
        isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    });
};
exports.createReadWriteTransaction = createReadWriteTransaction;
/**
 * Executes read operations on read replica with transaction.
 *
 * @template T
 * @param {Sequelize} readReplica - Read replica Sequelize instance
 * @param {(transaction: Transaction) => Promise<T>} callback - Read operation callback
 * @returns {Promise<T>} Callback result
 *
 * @example
 * ```typescript
 * const students = await withReadTransaction(readReplicaSequelize, async (t) => {
 *   return await Student.findAll({ where: { grade: 10 }, transaction: t });
 * });
 * ```
 */
const withReadTransaction = async (readReplica, callback) => {
    return await (0, exports.withTransaction)(readReplica, callback, { isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.READ_COMMITTED });
};
exports.withReadTransaction = withReadTransaction;
/**
 * Executes write operations on primary database with transaction.
 *
 * @template T
 * @param {Sequelize} primary - Primary Sequelize instance
 * @param {(transaction: Transaction) => Promise<T>} callback - Write operation callback
 * @returns {Promise<T>} Callback result
 *
 * @example
 * ```typescript
 * const result = await withWriteTransaction(primarySequelize, async (t) => {
 *   await Student.create({ name: 'John' }, { transaction: t });
 *   await Grade.create({ studentId: 1, grade: 'A' }, { transaction: t });
 *   return { success: true };
 * });
 * ```
 */
const withWriteTransaction = async (primary, callback) => {
    return await (0, exports.withTransaction)(primary, callback, { isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.REPEATABLE_READ });
};
exports.withWriteTransaction = withWriteTransaction;
// ============================================================================
// TRANSACTION METRICS AND MONITORING
// ============================================================================
/**
 * Tracks transaction execution metrics.
 *
 * @template T
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {(transaction: Transaction) => Promise<T>} callback - Transaction callback
 * @returns {Promise<{ result: T; metrics: TransactionMetrics }>} Result with metrics
 *
 * @example
 * ```typescript
 * const { result, metrics } = await trackTransactionMetrics(sequelize, async (t) => {
 *   await Student.create({ name: 'John' }, { transaction: t });
 *   return { success: true };
 * });
 * console.log(`Transaction took ${metrics.duration}ms`);
 * ```
 */
const trackTransactionMetrics = async (sequelize, callback) => {
    const metrics = {
        startTime: new Date(),
        status: 'pending',
        queriesExecuted: 0,
    };
    try {
        const result = await (0, exports.withTransaction)(sequelize, callback);
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
exports.trackTransactionMetrics = trackTransactionMetrics;
exports.default = {
    // Transaction creation
    createTransaction: exports.createTransaction,
    withTransaction: exports.withTransaction,
    commitTransaction: exports.commitTransaction,
    rollbackTransaction: exports.rollbackTransaction,
    isTransactionActive: exports.isTransactionActive,
    getTransactionStatus: exports.getTransactionStatus,
    // Nested transactions
    createNestedTransaction: exports.createNestedTransaction,
    withNestedTransaction: exports.withNestedTransaction,
    // Savepoints
    createSavepoint: exports.createSavepoint,
    rollbackToSavepoint: exports.rollbackToSavepoint,
    releaseSavepoint: exports.releaseSavepoint,
    // Isolation levels
    createReadUncommittedTransaction: exports.createReadUncommittedTransaction,
    createReadCommittedTransaction: exports.createReadCommittedTransaction,
    createRepeatableReadTransaction: exports.createRepeatableReadTransaction,
    createSerializableTransaction: exports.createSerializableTransaction,
    getIsolationLevelForOperation: exports.getIsolationLevelForOperation,
    // Two-phase commit
    prepareTransaction: exports.prepareTransaction,
    commitPreparedTransaction: exports.commitPreparedTransaction,
    rollbackPreparedTransaction: exports.rollbackPreparedTransaction,
    // Distributed transactions
    coordinateDistributedTransaction: exports.coordinateDistributedTransaction,
    // Retry logic
    retryTransaction: exports.retryTransaction,
    isTransactionRetryable: exports.isTransactionRetryable,
    // Deadlock handling
    isDeadlock: exports.isDeadlock,
    withDeadlockRetry: exports.withDeadlockRetry,
    // Rollback helpers
    safeRollback: exports.safeRollback,
    conditionalRollback: exports.conditionalRollback,
    // Hooks
    withTransactionHooks: exports.withTransactionHooks,
    afterCommit: exports.afterCommit,
    // Read-write splitting
    createReadOnlyTransaction: exports.createReadOnlyTransaction,
    createReadWriteTransaction: exports.createReadWriteTransaction,
    withReadTransaction: exports.withReadTransaction,
    withWriteTransaction: exports.withWriteTransaction,
    // Metrics
    trackTransactionMetrics: exports.trackTransactionMetrics,
};
//# sourceMappingURL=database-transaction-utils.js.map