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
import { Transaction, Sequelize, IsolationLevel } from 'sequelize';
interface TransactionConfig {
    isolationLevel?: IsolationLevel;
    autocommit?: boolean;
    deferrable?: boolean;
    timeout?: number;
    readOnly?: boolean;
}
interface TransactionHooks {
    beforeCommit?: (transaction: Transaction) => Promise<void> | void;
    afterCommit?: (transaction: Transaction) => Promise<void> | void;
    beforeRollback?: (transaction: Transaction) => Promise<void> | void;
    afterRollback?: (transaction: Transaction) => Promise<void> | void;
}
interface RetryConfig {
    maxRetries: number;
    retryDelay: number;
    backoffMultiplier?: number;
    retryableErrors?: string[];
}
interface SavepointInfo {
    name: string;
    transaction: Transaction;
    timestamp: Date;
}
interface TransactionMetrics {
    startTime: Date;
    endTime?: Date;
    duration?: number;
    status: 'pending' | 'committed' | 'rolled_back';
    queriesExecuted: number;
    error?: Error;
}
interface DistributedTransactionConfig {
    coordinatorId: string;
    participantIds: string[];
    timeout: number;
    preparePhaseTimeout?: number;
}
interface TwoPhaseCommitResult {
    success: boolean;
    preparedCount: number;
    committedCount: number;
    failedParticipants: string[];
    error?: Error;
}
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
export declare const createTransaction: (sequelize: Sequelize, config?: TransactionConfig) => Promise<Transaction>;
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
export declare const withTransaction: <T>(sequelize: Sequelize, callback: (transaction: Transaction) => Promise<T>, config?: TransactionConfig) => Promise<T>;
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
export declare const commitTransaction: (transaction: Transaction) => Promise<void>;
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
export declare const rollbackTransaction: (transaction: Transaction) => Promise<void>;
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
 * // Result: { finished: false, committed: false, rolledBack: false }
 * ```
 */
export declare const getTransactionStatus: (transaction: Transaction) => {
    finished: any;
    id: any;
    options: any;
};
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
export declare const createNestedTransaction: (parentTransaction: Transaction, sequelize: Sequelize) => Promise<Transaction>;
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
export declare const withNestedTransaction: <T>(parentTransaction: Transaction, sequelize: Sequelize, callback: (transaction: Transaction) => Promise<T>) => Promise<T>;
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
export declare const createSavepoint: (transaction: Transaction, savepointName: string) => Promise<SavepointInfo>;
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
export declare const rollbackToSavepoint: (transaction: Transaction, savepointName: string) => Promise<void>;
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
export declare const releaseSavepoint: (transaction: Transaction, savepointName: string) => Promise<void>;
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
 * // Only reads committed changes (prevents dirty reads)
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
 * // Prevents dirty reads and non-repeatable reads
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
 * // Highest isolation level, prevents all anomalies
 * ```
 */
export declare const createSerializableTransaction: (sequelize: Sequelize) => Promise<Transaction>;
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
export declare const getIsolationLevelForOperation: (operationType: "read" | "write" | "critical") => IsolationLevel;
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
export declare const prepareTransaction: (transaction: Transaction, transactionId: string) => Promise<boolean>;
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
export declare const commitPreparedTransaction: (sequelize: Sequelize, transactionId: string) => Promise<void>;
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
export declare const rollbackPreparedTransaction: (sequelize: Sequelize, transactionId: string) => Promise<void>;
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
export declare const coordinateDistributedTransaction: (participants: Sequelize[], callback: (transactions: Transaction[]) => Promise<void>, config: DistributedTransactionConfig) => Promise<TwoPhaseCommitResult>;
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
export declare const retryTransaction: <T>(sequelize: Sequelize, callback: (transaction: Transaction) => Promise<T>, config: RetryConfig) => Promise<T>;
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
export declare const isTransactionRetryable: (error: Error, retryableErrors?: string[]) => boolean;
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
export declare const isDeadlock: (error: Error) => boolean;
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
export declare const withDeadlockRetry: <T>(sequelize: Sequelize, callback: (transaction: Transaction) => Promise<T>, maxRetries?: number) => Promise<T>;
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
export declare const safeRollback: (transaction: Transaction, error?: Error) => Promise<void>;
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
export declare const conditionalRollback: (transaction: Transaction, condition: boolean) => Promise<boolean>;
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
export declare const withTransactionHooks: <T>(sequelize: Sequelize, callback: (transaction: Transaction) => Promise<T>, hooks: TransactionHooks) => Promise<T>;
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
export declare const afterCommit: (transaction: Transaction, callback: () => Promise<void> | void) => void;
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
export declare const createReadOnlyTransaction: (sequelize: Sequelize) => Promise<Transaction>;
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
export declare const createReadWriteTransaction: (sequelize: Sequelize) => Promise<Transaction>;
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
export declare const withReadTransaction: <T>(readReplica: Sequelize, callback: (transaction: Transaction) => Promise<T>) => Promise<T>;
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
export declare const withWriteTransaction: <T>(primary: Sequelize, callback: (transaction: Transaction) => Promise<T>) => Promise<T>;
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
export declare const trackTransactionMetrics: <T>(sequelize: Sequelize, callback: (transaction: Transaction) => Promise<T>) => Promise<{
    result: T;
    metrics: TransactionMetrics;
}>;
declare const _default: {
    createTransaction: (sequelize: Sequelize, config?: TransactionConfig) => Promise<Transaction>;
    withTransaction: <T>(sequelize: Sequelize, callback: (transaction: Transaction) => Promise<T>, config?: TransactionConfig) => Promise<T>;
    commitTransaction: (transaction: Transaction) => Promise<void>;
    rollbackTransaction: (transaction: Transaction) => Promise<void>;
    isTransactionActive: (transaction: Transaction) => boolean;
    getTransactionStatus: (transaction: Transaction) => {
        finished: any;
        id: any;
        options: any;
    };
    createNestedTransaction: (parentTransaction: Transaction, sequelize: Sequelize) => Promise<Transaction>;
    withNestedTransaction: <T>(parentTransaction: Transaction, sequelize: Sequelize, callback: (transaction: Transaction) => Promise<T>) => Promise<T>;
    createSavepoint: (transaction: Transaction, savepointName: string) => Promise<SavepointInfo>;
    rollbackToSavepoint: (transaction: Transaction, savepointName: string) => Promise<void>;
    releaseSavepoint: (transaction: Transaction, savepointName: string) => Promise<void>;
    createReadUncommittedTransaction: (sequelize: Sequelize) => Promise<Transaction>;
    createReadCommittedTransaction: (sequelize: Sequelize) => Promise<Transaction>;
    createRepeatableReadTransaction: (sequelize: Sequelize) => Promise<Transaction>;
    createSerializableTransaction: (sequelize: Sequelize) => Promise<Transaction>;
    getIsolationLevelForOperation: (operationType: "read" | "write" | "critical") => IsolationLevel;
    prepareTransaction: (transaction: Transaction, transactionId: string) => Promise<boolean>;
    commitPreparedTransaction: (sequelize: Sequelize, transactionId: string) => Promise<void>;
    rollbackPreparedTransaction: (sequelize: Sequelize, transactionId: string) => Promise<void>;
    coordinateDistributedTransaction: (participants: Sequelize[], callback: (transactions: Transaction[]) => Promise<void>, config: DistributedTransactionConfig) => Promise<TwoPhaseCommitResult>;
    retryTransaction: <T>(sequelize: Sequelize, callback: (transaction: Transaction) => Promise<T>, config: RetryConfig) => Promise<T>;
    isTransactionRetryable: (error: Error, retryableErrors?: string[]) => boolean;
    isDeadlock: (error: Error) => boolean;
    withDeadlockRetry: <T>(sequelize: Sequelize, callback: (transaction: Transaction) => Promise<T>, maxRetries?: number) => Promise<T>;
    safeRollback: (transaction: Transaction, error?: Error) => Promise<void>;
    conditionalRollback: (transaction: Transaction, condition: boolean) => Promise<boolean>;
    withTransactionHooks: <T>(sequelize: Sequelize, callback: (transaction: Transaction) => Promise<T>, hooks: TransactionHooks) => Promise<T>;
    afterCommit: (transaction: Transaction, callback: () => Promise<void> | void) => void;
    createReadOnlyTransaction: (sequelize: Sequelize) => Promise<Transaction>;
    createReadWriteTransaction: (sequelize: Sequelize) => Promise<Transaction>;
    withReadTransaction: <T>(readReplica: Sequelize, callback: (transaction: Transaction) => Promise<T>) => Promise<T>;
    withWriteTransaction: <T>(primary: Sequelize, callback: (transaction: Transaction) => Promise<T>) => Promise<T>;
    trackTransactionMetrics: <T>(sequelize: Sequelize, callback: (transaction: Transaction) => Promise<T>) => Promise<{
        result: T;
        metrics: TransactionMetrics;
    }>;
};
export default _default;
//# sourceMappingURL=database-transaction-utils.d.ts.map