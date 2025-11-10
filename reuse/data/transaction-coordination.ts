/**
 * LOC: TXNCOORD12345
 * File: /reuse/data/transaction-coordination.ts
 *
 * UPSTREAM (imports from):
 *   - Sequelize 6.x core
 *   - @nestjs/common for dependency injection
 *
 * DOWNSTREAM (imported by):
 *   - Backend services requiring transaction management
 *   - Database access layers
 *   - Multi-step operation handlers
 */

/**
 * File: /reuse/data/transaction-coordination.ts
 * Locator: WC-DATA-TXN-001
 * Purpose: Enterprise-grade Transaction Coordination & Management
 *
 * Upstream: Sequelize 6.x, NestJS
 * Downstream: ../backend/*, services, controllers, data access layers
 * Dependencies: TypeScript 5.x, Sequelize 6.x, @nestjs/common
 * Exports: 40 functions for multi-transaction coordination, nested transactions, savepoints, 2PC, distributed transactions
 *
 * LLM Context: Production-ready transaction management for White Cross healthcare system.
 * Provides multi-transaction coordination, nested transaction handlers, savepoint management,
 * two-phase commit patterns, distributed transaction coordination, transaction retry logic with
 * exponential backoff, transaction isolation level helpers, transaction boundary management,
 * and cross-database transaction patterns for complex healthcare workflows.
 */

import {
  Sequelize,
  Transaction,
  IsolationLevel,
  Model,
  ModelStatic
} from 'sequelize';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter } from 'events';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface TransactionConfig {
  isolationLevel?: IsolationLevel;
  type?: Transaction.TYPES;
  deferrable?: Transaction.DEFERRABLE;
  autocommit?: boolean;
  readOnly?: boolean;
  logging?: boolean | ((sql: string, timing?: number) => void);
}

export interface TransactionRetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryableErrors?: RegExp[];
  onRetry?: (attempt: number, error: Error) => void;
}

export interface SavepointConfig {
  name?: string;
  autoRelease?: boolean;
}

export interface NestedTransactionConfig {
  maxDepth?: number;
  allowRealNesting?: boolean;
  savepointPrefix?: string;
}

export interface TwoPhaseCommitConfig {
  participants: TransactionParticipant[];
  timeout?: number;
  coordinatorId?: string;
}

export interface TransactionParticipant {
  id: string;
  sequelize: Sequelize;
  prepare: (transaction: Transaction) => Promise<boolean>;
  commit: (transaction: Transaction) => Promise<void>;
  rollback: (transaction: Transaction) => Promise<void>;
}

export interface DistributedTransactionConfig {
  databases: Sequelize[];
  compensationHandlers?: Map<string, CompensationHandler>;
  sagaPattern?: boolean;
}

export interface CompensationHandler {
  name: string;
  compensate: (data: any) => Promise<void>;
}

export interface TransactionMetrics {
  totalTransactions: number;
  committedTransactions: number;
  rolledBackTransactions: number;
  activeTransactions: number;
  averageDuration: number;
  errorCount: number;
}

export interface TransactionContext {
  id: string;
  depth: number;
  savepoints: string[];
  startTime: number;
  metadata: Record<string, any>;
}

export interface TransactionBoundary {
  name: string;
  requiresNew?: boolean;
  propagation?: TransactionPropagation;
  isolationLevel?: IsolationLevel;
  readOnly?: boolean;
  timeout?: number;
}

export enum TransactionPropagation {
  REQUIRED = 'REQUIRED',
  REQUIRES_NEW = 'REQUIRES_NEW',
  SUPPORTS = 'SUPPORTS',
  NOT_SUPPORTED = 'NOT_SUPPORTED',
  MANDATORY = 'MANDATORY',
  NEVER = 'NEVER'
}

export enum TransactionState {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  PREPARED = 'PREPARED',
  COMMITTING = 'COMMITTING',
  COMMITTED = 'COMMITTED',
  ROLLING_BACK = 'ROLLING_BACK',
  ROLLED_BACK = 'ROLLED_BACK',
  FAILED = 'FAILED'
}

export class TransactionError extends Error {
  constructor(
    message: string,
    public transactionId?: string,
    public state?: TransactionState
  ) {
    super(message);
    this.name = 'TransactionError';
  }
}

export class SavepointError extends Error {
  constructor(message: string, public savepointName: string) {
    super(message);
    this.name = 'SavepointError';
  }
}

export class DistributedTransactionError extends Error {
  constructor(
    message: string,
    public failedParticipants: string[],
    public state: TransactionState
  ) {
    super(message);
    this.name = 'DistributedTransactionError';
  }
}

// ============================================================================
// BASIC TRANSACTION MANAGEMENT (Functions 1-6)
// ============================================================================

/**
 * Creates a transaction with enhanced configuration and ACID compliance
 *
 * Isolation Levels:
 * - READ_UNCOMMITTED: Lowest isolation, allows dirty reads (rarely used)
 * - READ_COMMITTED: Default, prevents dirty reads
 * - REPEATABLE_READ: Prevents non-repeatable reads
 * - SERIALIZABLE: Highest isolation, prevents phantom reads
 *
 * Transaction Types:
 * - DEFERRED: Start transaction on first query (default)
 * - IMMEDIATE: Start transaction immediately
 * - EXCLUSIVE: Lock database exclusively (SQLite only)
 *
 * @param sequelize - Sequelize instance
 * @param config - Transaction configuration with isolation level and options
 * @returns Transaction instance ready for use
 * @throws TransactionError if transaction creation fails
 *
 * @example
 * // Critical financial transaction requiring serializable isolation
 * const tx = await createTransaction(sequelize, {
 *   isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
 *   readOnly: false,
 *   logging: (sql) => logger.debug(sql)
 * });
 */
export async function createTransaction(
  sequelize: Sequelize,
  config: TransactionConfig = {}
): Promise<Transaction> {
  const {
    isolationLevel = Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    type = Transaction.TYPES.DEFERRED,
    deferrable,
    autocommit = false,
    readOnly = false,
    logging
  } = config;

  try {
    return await sequelize.transaction({
      isolationLevel,
      type,
      deferrable,
      autocommit,
      // @ts-ignore - Sequelize types may not include all options
      readOnly,
      logging
    });
  } catch (error) {
    throw new TransactionError(
      `Failed to create transaction: ${(error as Error).message}`,
      undefined,
      TransactionState.FAILED
    );
  }
}

/**
 * Executes a function within a managed transaction with automatic commit/rollback
 *
 * ACID Properties Enforcement:
 * - Atomicity: Function succeeds completely or rolls back entirely
 * - Consistency: Database constraints validated before commit
 * - Isolation: Controlled by config.isolationLevel parameter
 * - Durability: Successful commits are permanently recorded
 *
 * Automatic Lifecycle Management:
 * - Transaction automatically begins before function execution
 * - Commits on successful completion
 * - Rolls back on any error or exception
 * - Ensures proper cleanup in all scenarios
 *
 * @param sequelize - Sequelize instance
 * @param fn - Function to execute within transaction context
 * @param config - Transaction configuration (isolation level, logging, etc.)
 * @returns Result of function execution
 * @throws TransactionError if transaction fails or is rolled back
 *
 * @example
 * // Critical operation with serializable isolation
 * const result = await withTransaction(sequelize,
 *   async (tx) => {
 *     const account = await Account.findByPk(id, { transaction: tx, lock: true });
 *     account.balance -= amount;
 *     await account.save({ transaction: tx });
 *     return account;
 *   },
 *   {
 *     isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
 *     logging: (sql, timing) => logger.debug(`Query: ${sql} (${timing}ms)`)
 *   }
 * );
 */
export async function withTransaction<T>(
  sequelize: Sequelize,
  fn: (transaction: Transaction) => Promise<T>,
  config: TransactionConfig = {}
): Promise<T> {
  try {
    return await sequelize.transaction(
      {
        isolationLevel: config.isolationLevel,
        type: config.type,
        deferrable: config.deferrable,
        autocommit: config.autocommit,
        logging: config.logging
      },
      async (transaction) => {
        return await fn(transaction);
      }
    );
  } catch (error) {
    // Re-throw with enhanced context
    throw new TransactionError(
      `Transaction failed: ${(error as Error).message}`,
      undefined,
      TransactionState.ROLLED_BACK
    );
  }
}

/**
 * Commits a transaction with optional validation ensuring ACID compliance
 *
 * Pre-Commit Validation:
 * - Validates business rules before committing
 * - Rolls back automatically if validation fails
 * - Prevents invalid data from being persisted
 * - Ensures database consistency
 *
 * Commit Guarantees:
 * - All changes become permanent and visible to other transactions
 * - Changes survive system failures (durability)
 * - Releases all locks held by the transaction
 * - Frees resources allocated to transaction
 *
 * @param transaction - Transaction instance to commit
 * @param validate - Optional validation function executed before commit
 * @throws TransactionError if validation fails or commit unsuccessful
 *
 * @example
 * // Commit with business rule validation
 * await commitTransaction(transaction, async () => {
 *   const totalBalance = await Account.sum('balance', { transaction });
 *   if (totalBalance < 0) {
 *     logger.error('Invalid state: negative total balance');
 *     return false; // Validation failed, will rollback
 *   }
 *   return true; // Validation passed, commit proceeds
 * });
 */
export async function commitTransaction(
  transaction: Transaction,
  validate?: () => Promise<boolean>
): Promise<void> {
  if (validate) {
    const isValid = await validate();
    if (!isValid) {
      await transaction.rollback();
      throw new TransactionError(
        'Transaction validation failed, rolled back',
        undefined,
        TransactionState.ROLLED_BACK
      );
    }
  }

  try {
    await transaction.commit();
  } catch (error) {
    throw new TransactionError(
      `Failed to commit transaction: ${(error as Error).message}`,
      undefined,
      TransactionState.FAILED
    );
  }
}

/**
 * Rolls back a transaction with guaranteed cleanup and resource release
 *
 * Rollback Guarantees:
 * - All changes made within transaction are discarded
 * - Database returns to state before transaction began
 * - All locks are immediately released
 * - Resources are freed for other transactions
 *
 * Cleanup Actions:
 * - Cleanup function executes regardless of rollback success/failure
 * - Use for releasing application-level resources
 * - Helpful for cache invalidation, file cleanup, etc.
 * - Ensures no resource leaks even on error
 *
 * @param transaction - Transaction instance to rollback
 * @param cleanup - Optional cleanup function for additional resource release
 * @throws TransactionError if rollback fails (rare, usually indicates serious issue)
 *
 * @example
 * // Rollback with application cleanup
 * await rollbackTransaction(transaction, async () => {
 *   await cache.invalidate(`user:${userId}`);
 *   await eventBus.emit('transaction:rolled_back', { userId });
 *   logger.warn(`Transaction rolled back for user ${userId}`);
 * });
 */
export async function rollbackTransaction(
  transaction: Transaction,
  cleanup?: () => Promise<void>
): Promise<void> {
  const logger = new Logger('TransactionRollback');

  try {
    await transaction.rollback();
    logger.debug('Transaction rolled back successfully');
  } catch (error) {
    logger.error(`Failed to rollback transaction: ${(error as Error).message}`);
    throw new TransactionError(
      `Rollback failed: ${(error as Error).message}`,
      undefined,
      TransactionState.FAILED
    );
  } finally {
    if (cleanup) {
      try {
        await cleanup();
      } catch (cleanupError) {
        logger.error(`Cleanup failed after rollback: ${(cleanupError as Error).message}`);
        // Don't throw - rollback already completed
      }
    }
  }
}

/**
 * Checks if a transaction is still active
 * @param transaction - Transaction to check
 * @returns True if active, false otherwise
 */
export function isTransactionActive(transaction: Transaction): boolean {
  try {
    // Access internal transaction state
    return (transaction as any).finished === undefined ||
           (transaction as any).finished === false;
  } catch {
    return false;
  }
}

/**
 * Gets transaction information
 * @param transaction - Transaction to inspect
 * @returns Transaction information object
 */
export function getTransactionInfo(transaction: Transaction): {
  id: string;
  isolationLevel: string;
  readOnly: boolean;
  active: boolean;
} {
  return {
    id: (transaction as any).id || 'unknown',
    isolationLevel: (transaction as any).options?.isolationLevel || 'unknown',
    readOnly: (transaction as any).options?.readOnly || false,
    active: isTransactionActive(transaction)
  };
}

// ============================================================================
// TRANSACTION RETRY LOGIC (Functions 7-11)
// ============================================================================

/**
 * Checks if an error is retryable with comprehensive deadlock detection
 *
 * Deadlock Prevention Strategy:
 * - Detects database-level deadlocks (circular lock dependencies)
 * - Identifies lock timeout scenarios (resource contention)
 * - Recognizes serialization failures (isolation level conflicts)
 * - Handles connection pool exhaustion
 * - Manages statement timeouts
 *
 * Best Practices to Minimize Deadlocks:
 * 1. Always access tables in the same order
 * 2. Keep transactions short and focused
 * 3. Use appropriate isolation levels (avoid SERIALIZABLE unless needed)
 * 4. Create indexes on foreign key columns
 * 5. Use FOR UPDATE NOWAIT for explicit locking
 *
 * @param error - Error to check for retry suitability
 * @param customPatterns - Additional error patterns specific to your application
 * @returns True if error indicates a transient condition suitable for retry
 *
 * @example
 * try {
 *   await transaction.commit();
 * } catch (error) {
 *   if (isRetryableError(error)) {
 *     logger.warn('Retryable error detected, will retry transaction');
 *     return await retryTransaction(sequelize, fn, retryConfig);
 *   }
 *   throw error; // Non-retryable, propagate to caller
 * }
 */
export function isRetryableError(
  error: any,
  customPatterns: RegExp[] = []
): boolean {
  const defaultPatterns = [
    // Deadlock conditions
    /deadlock detected/i,
    /deadlock found/i,
    /circular dependency/i,

    // Lock timeouts
    /lock wait timeout/i,
    /lock timeout exceeded/i,
    /timeout waiting for lock/i,

    // Serialization failures
    /could not serialize/i,
    /serialization failure/i,
    /concurrent update/i,
    /snapshot too old/i,

    // Connection issues
    /connection terminated/i,
    /connection reset/i,
    /connection refused/i,
    /connection pool exhausted/i,
    /ECONNRESET/,
    /ETIMEDOUT/,
    /ECONNREFUSED/,
    /ENOTFOUND/,

    // Sequelize-specific errors
    /SequelizeConnectionError/,
    /SequelizeConnectionRefusedError/,
    /SequelizeConnectionTimedOutError/,
    /SequelizeDatabaseError.*deadlock/i,

    // PostgreSQL error codes
    /40P01/,  // deadlock_detected
    /40001/,  // serialization_failure
    /55P03/,  // lock_not_available

    // MySQL error codes
    /ER_LOCK_DEADLOCK/,    // 1213
    /ER_LOCK_WAIT_TIMEOUT/, // 1205
    /ER_LOCK_TABLE_FULL/,   // 1206

    // Statement timeouts
    /statement timeout/i,
    /query timeout/i,
    /execution timeout/i,
  ];

  const patterns = [...defaultPatterns, ...customPatterns];
  const errorMessage = error?.message || error?.toString() || '';
  const errorCode = error?.code || error?.parent?.code || '';
  const sqlState = error?.parent?.sqlState || '';

  return patterns.some(pattern =>
    pattern.test(errorMessage) ||
    pattern.test(errorCode) ||
    pattern.test(sqlState)
  );
}

/**
 * Retries a transaction with exponential backoff and jitter for deadlock prevention
 *
 * Retry Strategy:
 * - Exponential backoff: delay *= backoffMultiplier after each retry
 * - Jitter: Random delay variation to prevent thundering herd
 * - Max delay cap: Prevents excessive wait times
 * - Selective retry: Only retries known transient errors
 *
 * Deadlock Prevention:
 * - Random jitter breaks synchronization between competing transactions
 * - Exponential backoff reduces contention over time
 * - Configurable retry limits prevent infinite loops
 *
 * @param sequelize - Sequelize instance
 * @param fn - Transaction function to execute
 * @param config - Retry configuration with backoff parameters
 * @returns Result of successful transaction execution
 * @throws TransactionError if max retries exceeded or non-retryable error
 *
 * @example
 * // Retry with aggressive backoff for high-contention scenarios
 * await retryTransaction(sequelize,
 *   async (tx) => {
 *     await Model.update({ qty: qty - 1 }, {
 *       where: { id },
 *       transaction: tx
 *     });
 *   },
 *   {
 *     maxRetries: 5,
 *     initialDelay: 50,
 *     maxDelay: 2000,
 *     backoffMultiplier: 2,
 *     onRetry: (attempt, error) => {
 *       logger.warn(`Retry attempt ${attempt} due to: ${error.message}`);
 *     }
 *   }
 * );
 */
export async function retryTransaction<T>(
  sequelize: Sequelize,
  fn: (transaction: Transaction) => Promise<T>,
  config: TransactionRetryConfig
): Promise<T> {
  const {
    maxRetries,
    initialDelay,
    maxDelay,
    backoffMultiplier,
    retryableErrors = [],
    onRetry
  } = config;

  let lastError: Error | null = null;
  const logger = new Logger('TransactionRetry');

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await sequelize.transaction(async (transaction) => {
        return await fn(transaction);
      });
    } catch (error: any) {
      lastError = error;

      // Check if error is retryable
      if (!isRetryableError(error, retryableErrors)) {
        logger.error(`Non-retryable error encountered: ${error.message}`);
        throw error;
      }

      // Check if we've exhausted retries
      if (attempt === maxRetries) {
        throw new TransactionError(
          `Transaction failed after ${maxRetries} retries: ${error.message}`,
          undefined,
          TransactionState.FAILED
        );
      }

      // Calculate delay with exponential backoff
      let delay = Math.min(
        initialDelay * Math.pow(backoffMultiplier, attempt),
        maxDelay
      );

      // Add jitter to prevent thundering herd (0.5x to 1.5x of calculated delay)
      const jitter = delay * (0.5 + Math.random());
      delay = Math.min(jitter, maxDelay);

      if (onRetry) {
        onRetry(attempt + 1, error);
      }

      logger.warn(
        `Transaction failed with retryable error (${error.message}), ` +
        `retrying in ${Math.round(delay)}ms (attempt ${attempt + 1}/${maxRetries})`
      );

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError || new TransactionError(
    'Transaction retry failed',
    undefined,
    TransactionState.FAILED
  );
}

/**
 * Executes a transaction with automatic retry on specific errors
 * @param sequelize - Sequelize instance
 * @param fn - Transaction function
 * @param maxRetries - Maximum retry attempts
 * @returns Result of transaction function
 */
export async function executeWithRetry<T>(
  sequelize: Sequelize,
  fn: (transaction: Transaction) => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  return retryTransaction(sequelize, fn, {
    maxRetries,
    initialDelay: 100,
    maxDelay: 5000,
    backoffMultiplier: 2
  });
}

/**
 * Implements circuit breaker pattern for transactions
 * @param sequelize - Sequelize instance
 * @param fn - Transaction function
 * @param failureThreshold - Number of failures before opening circuit
 * @param resetTimeout - Time before attempting to close circuit
 * @returns Result of transaction function
 */
export async function executeWithCircuitBreaker<T>(
  sequelize: Sequelize,
  fn: (transaction: Transaction) => Promise<T>,
  failureThreshold: number = 5,
  resetTimeout: number = 60000
): Promise<T> {
  const breaker = CircuitBreakerRegistry.getOrCreate(
    'transaction',
    failureThreshold,
    resetTimeout
  );

  if (breaker.isOpen()) {
    throw new TransactionError('Circuit breaker is open');
  }

  try {
    const result = await sequelize.transaction(async (transaction) => {
      return await fn(transaction);
    });

    breaker.recordSuccess();
    return result;
  } catch (error) {
    breaker.recordFailure();
    throw error;
  }
}

/**
 * Creates a resilient transaction wrapper with retry and timeout
 * @param sequelize - Sequelize instance
 * @param fn - Transaction function
 * @param timeout - Transaction timeout in milliseconds
 * @param retryConfig - Retry configuration
 * @returns Result of transaction function
 */
export async function resilientTransaction<T>(
  sequelize: Sequelize,
  fn: (transaction: Transaction) => Promise<T>,
  timeout: number = 30000,
  retryConfig?: Partial<TransactionRetryConfig>
): Promise<T> {
  const config: TransactionRetryConfig = {
    maxRetries: 3,
    initialDelay: 100,
    maxDelay: 5000,
    backoffMultiplier: 2,
    ...retryConfig
  };

  return retryTransaction(
    sequelize,
    async (transaction) => {
      return await Promise.race([
        fn(transaction),
        new Promise<T>((_, reject) =>
          setTimeout(
            () => reject(new TransactionError('Transaction timeout')),
            timeout
          )
        )
      ]);
    },
    config
  );
}

// ============================================================================
// SAVEPOINT MANAGEMENT (Functions 12-17)
// ============================================================================

/**
 * Creates a savepoint within a transaction for partial rollback capability
 *
 * Savepoint Benefits:
 * - Allows rolling back part of a transaction without losing all work
 * - Enables try-catch blocks within longer transactions
 * - Supports nested transaction-like behavior
 * - Maintains ACID properties for parent transaction
 *
 * Use Cases:
 * - Multi-step operations where early steps shouldn't be lost
 * - Trying optional operations that might fail
 * - Complex workflows with checkpoints
 * - Nested business logic requiring isolation
 *
 * Database Support:
 * - PostgreSQL: Full support
 * - MySQL: Full support
 * - SQLite: Full support (SAVEPOINT command)
 *
 * @param transaction - Active transaction to create savepoint within
 * @param config - Savepoint configuration (optional custom name)
 * @returns Savepoint identifier for later rollback/release operations
 * @throws SavepointError if savepoint creation fails
 *
 * @example
 * // Create savepoint before risky operation
 * const sp = await createSavepoint(transaction);
 * try {
 *   await performRiskyOperation(transaction);
 *   await releaseSavepoint(transaction, sp); // Success, release savepoint
 * } catch (error) {
 *   await rollbackToSavepoint(transaction, sp); // Failure, rollback to savepoint
 *   logger.warn('Risky operation failed, rolled back to savepoint');
 * }
 */
export async function createSavepoint(
  transaction: Transaction,
  config: SavepointConfig = {}
): Promise<string> {
  const savepointName = config.name ||
    `sp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    // Use dialect-appropriate syntax
    const dialect = transaction.sequelize.getDialect();
    const savepointSQL = dialect === 'postgres' || dialect === 'mysql' || dialect === 'sqlite'
      ? `SAVEPOINT "${savepointName}"`
      : `SAVEPOINT ${savepointName}`;

    await transaction.sequelize.query(savepointSQL, { transaction });

    return savepointName;
  } catch (error: any) {
    throw new SavepointError(
      `Failed to create savepoint '${savepointName}': ${error.message}`,
      savepointName
    );
  }
}

/**
 * Rolls back transaction to a specific savepoint, undoing subsequent work
 *
 * Rollback Behavior:
 * - Discards all changes made after savepoint was created
 * - Keeps changes made before savepoint
 * - Savepoint remains valid and can be used again
 * - Parent transaction continues to be active
 * - Locks acquired after savepoint are released
 *
 * ACID Implications:
 * - Atomicity: Partial rollback maintains transaction atomicity
 * - Consistency: Database returns to consistent savepoint state
 * - Isolation: Isolation level maintained for parent transaction
 * - Durability: Nothing committed yet, so no durability impact
 *
 * @param transaction - Transaction containing the savepoint
 * @param savepointName - Name/identifier of savepoint to rollback to
 * @throws SavepointError if savepoint doesn't exist or rollback fails
 *
 * @example
 * const sp1 = await createSavepoint(transaction);
 * await operation1(transaction); // This will be kept
 *
 * const sp2 = await createSavepoint(transaction);
 * await operation2(transaction); // This will be rolled back
 *
 * await rollbackToSavepoint(transaction, sp2); // Undo operation2
 * await operation3(transaction); // Try alternative approach
 * await commitTransaction(transaction); // Commits operation1 and operation3
 */
export async function rollbackToSavepoint(
  transaction: Transaction,
  savepointName: string
): Promise<void> {
  try {
    const dialect = transaction.sequelize.getDialect();
    const rollbackSQL = dialect === 'postgres' || dialect === 'mysql' || dialect === 'sqlite'
      ? `ROLLBACK TO SAVEPOINT "${savepointName}"`
      : `ROLLBACK TO SAVEPOINT ${savepointName}`;

    await transaction.sequelize.query(rollbackSQL, { transaction });
  } catch (error: any) {
    throw new SavepointError(
      `Failed to rollback to savepoint '${savepointName}': ${error.message}`,
      savepointName
    );
  }
}

/**
 * Releases a savepoint, committing nested work within parent transaction
 *
 * Release Behavior:
 * - Destroys the savepoint (can no longer rollback to it)
 * - Makes savepoint changes part of parent transaction
 * - Does NOT commit parent transaction
 * - Frees resources associated with savepoint
 * - Subsequent rollback won't undo these changes
 *
 * When to Release:
 * - After successful completion of savepoint block
 * - When savepoint is no longer needed
 * - To free resources in long-running transactions
 * - When certain that changes should persist with parent transaction
 *
 * Performance Consideration:
 * - Releasing savepoints frees memory and reduces overhead
 * - Important in transactions with many savepoints
 * - Not strictly required (parent commit releases all)
 * - Good practice for explicit resource management
 *
 * @param transaction - Transaction containing the savepoint
 * @param savepointName - Name/identifier of savepoint to release
 * @throws SavepointError if savepoint doesn't exist or release fails
 *
 * @example
 * const sp = await createSavepoint(transaction);
 * try {
 *   await performOperation(transaction);
 *   await releaseSavepoint(transaction, sp); // Success, commit nested work
 * } catch (error) {
 *   await rollbackToSavepoint(transaction, sp); // Failure, undo nested work
 *   // Savepoint still exists, can rollback again if needed
 * }
 */
export async function releaseSavepoint(
  transaction: Transaction,
  savepointName: string
): Promise<void> {
  try {
    const dialect = transaction.sequelize.getDialect();
    const releaseSQL = dialect === 'postgres' || dialect === 'mysql' || dialect === 'sqlite'
      ? `RELEASE SAVEPOINT "${savepointName}"`
      : `RELEASE SAVEPOINT ${savepointName}`;

    await transaction.sequelize.query(releaseSQL, { transaction });
  } catch (error: any) {
    throw new SavepointError(
      `Failed to release savepoint '${savepointName}': ${error.message}`,
      savepointName
    );
  }
}

/**
 * Executes a function with savepoint protection
 * @param transaction - Transaction to use
 * @param fn - Function to execute
 * @param savepointName - Optional savepoint name
 * @returns Result of function execution
 */
export async function withSavepoint<T>(
  transaction: Transaction,
  fn: () => Promise<T>,
  savepointName?: string
): Promise<T> {
  const spName = await createSavepoint(transaction, { name: savepointName });

  try {
    const result = await fn();
    await releaseSavepoint(transaction, spName);
    return result;
  } catch (error) {
    await rollbackToSavepoint(transaction, spName);
    throw error;
  }
}

/**
 * Creates a savepoint stack for nested operations
 * @param transaction - Transaction to use
 * @returns Savepoint stack manager
 */
export function createSavepointStack(transaction: Transaction): SavepointStack {
  return new SavepointStack(transaction);
}

/**
 * Manages a stack of savepoints for complex operations
 */
export class SavepointStack {
  private stack: string[] = [];

  constructor(private transaction: Transaction) {}

  /**
   * Pushes a new savepoint onto the stack
   * @param name - Optional savepoint name
   * @returns Savepoint name
   */
  async push(name?: string): Promise<string> {
    const savepointName = await createSavepoint(this.transaction, { name });
    this.stack.push(savepointName);
    return savepointName;
  }

  /**
   * Pops and releases the top savepoint
   * @returns Released savepoint name
   */
  async pop(): Promise<string> {
    if (this.stack.length === 0) {
      throw new SavepointError('Savepoint stack is empty', '');
    }

    const savepointName = this.stack.pop()!;
    await releaseSavepoint(this.transaction, savepointName);
    return savepointName;
  }

  /**
   * Rolls back to the top savepoint without popping
   * @returns Savepoint name
   */
  async rollbackTop(): Promise<string> {
    if (this.stack.length === 0) {
      throw new SavepointError('Savepoint stack is empty', '');
    }

    const savepointName = this.stack[this.stack.length - 1];
    await rollbackToSavepoint(this.transaction, savepointName);
    return savepointName;
  }

  /**
   * Gets the current stack depth
   */
  get depth(): number {
    return this.stack.length;
  }

  /**
   * Clears the entire stack
   */
  async clear(): Promise<void> {
    while (this.stack.length > 0) {
      await this.pop();
    }
  }
}

// ============================================================================
// NESTED TRANSACTION HANDLERS (Functions 18-22)
// ============================================================================

/**
 * Nested transaction manager
 */
@Injectable()
export class NestedTransactionManager {
  private readonly logger = new Logger(NestedTransactionManager.name);
  private contexts = new Map<string, TransactionContext>();

  /**
   * Begins a nested transaction (using savepoints)
   * @param transaction - Parent transaction
   * @param config - Nested transaction configuration
   * @returns Savepoint name representing the nested transaction
   */
  async begin(
    transaction: Transaction,
    config: NestedTransactionConfig = {}
  ): Promise<string> {
    const {
      maxDepth = 10,
      savepointPrefix = 'nested_'
    } = config;

    const contextId = this.getTransactionId(transaction);
    let context = this.contexts.get(contextId);

    if (!context) {
      context = {
        id: contextId,
        depth: 0,
        savepoints: [],
        startTime: Date.now(),
        metadata: {}
      };
      this.contexts.set(contextId, context);
    }

    if (context.depth >= maxDepth) {
      throw new TransactionError(
        `Maximum nested transaction depth (${maxDepth}) exceeded`,
        contextId
      );
    }

    const savepointName = `${savepointPrefix}${context.depth}`;
    await createSavepoint(transaction, { name: savepointName });

    context.depth++;
    context.savepoints.push(savepointName);

    this.logger.debug(
      `Created nested transaction at depth ${context.depth}: ${savepointName}`
    );

    return savepointName;
  }

  /**
   * Commits a nested transaction
   * @param transaction - Transaction containing the nested transaction
   * @param savepointName - Savepoint name of the nested transaction
   */
  async commit(transaction: Transaction, savepointName: string): Promise<void> {
    const contextId = this.getTransactionId(transaction);
    const context = this.contexts.get(contextId);

    if (!context) {
      throw new TransactionError('No transaction context found', contextId);
    }

    await releaseSavepoint(transaction, savepointName);

    const index = context.savepoints.indexOf(savepointName);
    if (index > -1) {
      context.savepoints.splice(index, 1);
      context.depth--;
    }

    if (context.depth === 0) {
      this.contexts.delete(contextId);
    }

    this.logger.debug(`Committed nested transaction: ${savepointName}`);
  }

  /**
   * Rolls back a nested transaction
   * @param transaction - Transaction containing the nested transaction
   * @param savepointName - Savepoint name of the nested transaction
   */
  async rollback(
    transaction: Transaction,
    savepointName: string
  ): Promise<void> {
    const contextId = this.getTransactionId(transaction);
    const context = this.contexts.get(contextId);

    if (!context) {
      throw new TransactionError('No transaction context found', contextId);
    }

    await rollbackToSavepoint(transaction, savepointName);

    const index = context.savepoints.indexOf(savepointName);
    if (index > -1) {
      context.savepoints.splice(index, 1);
      context.depth--;
    }

    this.logger.debug(`Rolled back nested transaction: ${savepointName}`);
  }

  /**
   * Executes a function within a nested transaction
   * @param transaction - Parent transaction
   * @param fn - Function to execute
   * @param config - Nested transaction configuration
   * @returns Result of function execution
   */
  async execute<T>(
    transaction: Transaction,
    fn: (savepointName: string) => Promise<T>,
    config?: NestedTransactionConfig
  ): Promise<T> {
    const savepointName = await this.begin(transaction, config);

    try {
      const result = await fn(savepointName);
      await this.commit(transaction, savepointName);
      return result;
    } catch (error) {
      await this.rollback(transaction, savepointName);
      throw error;
    }
  }

  /**
   * Gets the current nesting depth
   * @param transaction - Transaction to check
   * @returns Current nesting depth
   */
  getDepth(transaction: Transaction): number {
    const contextId = this.getTransactionId(transaction);
    const context = this.contexts.get(contextId);
    return context?.depth || 0;
  }

  private getTransactionId(transaction: Transaction): string {
    return (transaction as any).id || 'unknown';
  }
}

// ============================================================================
// TWO-PHASE COMMIT PATTERNS (Functions 23-27)
// ============================================================================

/**
 * Two-phase commit coordinator
 */
@Injectable()
export class TwoPhaseCommitCoordinator {
  private readonly logger = new Logger(TwoPhaseCommitCoordinator.name);
  private readonly eventEmitter = new EventEmitter();

  /**
   * Executes a two-phase commit across multiple participants
   * @param config - Two-phase commit configuration
   * @returns True if all participants committed, false otherwise
   */
  async execute(config: TwoPhaseCommitConfig): Promise<boolean> {
    const { participants, timeout = 30000, coordinatorId = 'coordinator' } = config;

    const transactions = new Map<string, Transaction>();
    const preparedParticipants: string[] = [];
    const state: TransactionState = TransactionState.PENDING;

    try {
      // Phase 1: Prepare
      this.logger.log('Starting Phase 1: PREPARE');
      this.eventEmitter.emit('phase', { phase: 1, state: TransactionState.PREPARING });

      for (const participant of participants) {
        const transaction = await participant.sequelize.transaction();
        transactions.set(participant.id, transaction);

        const prepared = await Promise.race([
          participant.prepare(transaction),
          new Promise<boolean>((_, reject) =>
            setTimeout(() => reject(new Error('Prepare timeout')), timeout)
          )
        ]);

        if (prepared) {
          preparedParticipants.push(participant.id);
          this.logger.debug(`Participant ${participant.id} prepared successfully`);
        } else {
          throw new Error(`Participant ${participant.id} failed to prepare`);
        }
      }

      // All participants prepared successfully
      this.eventEmitter.emit('phase', { phase: 1, state: TransactionState.PREPARED });

      // Phase 2: Commit
      this.logger.log('Starting Phase 2: COMMIT');
      this.eventEmitter.emit('phase', { phase: 2, state: TransactionState.COMMITTING });

      for (const participant of participants) {
        const transaction = transactions.get(participant.id)!;

        await Promise.race([
          participant.commit(transaction),
          new Promise<void>((_, reject) =>
            setTimeout(() => reject(new Error('Commit timeout')), timeout)
          )
        ]);

        this.logger.debug(`Participant ${participant.id} committed successfully`);
      }

      this.eventEmitter.emit('phase', { phase: 2, state: TransactionState.COMMITTED });
      this.logger.log('Two-phase commit completed successfully');
      return true;

    } catch (error: any) {
      // Rollback all participants
      this.logger.error(`Two-phase commit failed: ${error.message}`);
      this.eventEmitter.emit('phase', { phase: 2, state: TransactionState.ROLLING_BACK });

      for (const participant of participants) {
        const transaction = transactions.get(participant.id);
        if (transaction) {
          try {
            await participant.rollback(transaction);
            this.logger.debug(`Participant ${participant.id} rolled back`);
          } catch (rollbackError: any) {
            this.logger.error(
              `Failed to rollback participant ${participant.id}: ${rollbackError.message}`
            );
          }
        }
      }

      this.eventEmitter.emit('phase', { phase: 2, state: TransactionState.ROLLED_BACK });
      throw new DistributedTransactionError(
        'Two-phase commit failed',
        participants.map(p => p.id).filter(id => !preparedParticipants.includes(id)),
        TransactionState.ROLLED_BACK
      );
    } finally {
      // Ensure all transactions are closed
      for (const [id, transaction] of transactions) {
        try {
          if (isTransactionActive(transaction)) {
            await transaction.rollback();
          }
        } catch (error) {
          this.logger.warn(`Error closing transaction for participant ${id}`);
        }
      }
    }
  }

  /**
   * Subscribes to phase change events
   * @param listener - Event listener
   */
  onPhaseChange(
    listener: (event: { phase: number; state: TransactionState }) => void
  ): void {
    this.eventEmitter.on('phase', listener);
  }

  /**
   * Prepares a single participant for commit
   * @param participant - Participant to prepare
   * @param transaction - Transaction to use
   * @returns True if prepared successfully
   */
  async prepareParticipant(
    participant: TransactionParticipant,
    transaction: Transaction
  ): Promise<boolean> {
    try {
      return await participant.prepare(transaction);
    } catch (error: any) {
      this.logger.error(
        `Failed to prepare participant ${participant.id}: ${error.message}`
      );
      return false;
    }
  }

  /**
   * Commits a single participant
   * @param participant - Participant to commit
   * @param transaction - Transaction to use
   */
  async commitParticipant(
    participant: TransactionParticipant,
    transaction: Transaction
  ): Promise<void> {
    await participant.commit(transaction);
  }

  /**
   * Rolls back a single participant
   * @param participant - Participant to rollback
   * @param transaction - Transaction to use
   */
  async rollbackParticipant(
    participant: TransactionParticipant,
    transaction: Transaction
  ): Promise<void> {
    await participant.rollback(transaction);
  }
}

// ============================================================================
// DISTRIBUTED TRANSACTION COORDINATION (Functions 28-32)
// ============================================================================

/**
 * Distributed transaction coordinator with SAGA pattern support
 */
@Injectable()
export class DistributedTransactionCoordinator {
  private readonly logger = new Logger(DistributedTransactionCoordinator.name);

  /**
   * Executes a distributed transaction across multiple databases
   * @param config - Distributed transaction configuration
   * @param operations - Operations to execute per database
   * @returns Results from all databases
   */
  async execute<T>(
    config: DistributedTransactionConfig,
    operations: Map<Sequelize, (transaction: Transaction) => Promise<T>>
  ): Promise<Map<Sequelize, T>> {
    const { databases, compensationHandlers } = config;
    const transactions = new Map<Sequelize, Transaction>();
    const results = new Map<Sequelize, T>();
    const completedDatabases: Sequelize[] = [];

    try {
      // Start transactions on all databases
      for (const db of databases) {
        const transaction = await db.transaction();
        transactions.set(db, transaction);
      }

      // Execute operations
      for (const [db, operation] of operations) {
        const transaction = transactions.get(db);
        if (!transaction) {
          throw new Error(`No transaction found for database`);
        }

        const result = await operation(transaction);
        results.set(db, result);
        completedDatabases.push(db);
      }

      // Commit all transactions
      for (const [db, transaction] of transactions) {
        await transaction.commit();
        this.logger.debug(`Committed transaction on database`);
      }

      return results;

    } catch (error: any) {
      this.logger.error(`Distributed transaction failed: ${error.message}`);

      // Rollback all transactions
      for (const [db, transaction] of transactions) {
        try {
          if (isTransactionActive(transaction)) {
            await transaction.rollback();
          }
        } catch (rollbackError: any) {
          this.logger.error(
            `Failed to rollback transaction: ${rollbackError.message}`
          );
        }
      }

      // Execute compensation handlers if SAGA pattern is enabled
      if (config.sagaPattern && compensationHandlers) {
        await this.executeCompensations(
          compensationHandlers,
          results
        );
      }

      throw new DistributedTransactionError(
        'Distributed transaction failed',
        databases.map((_, idx) => `db_${idx}`),
        TransactionState.FAILED
      );
    }
  }

  /**
   * Executes compensation handlers for failed transactions
   * @param handlers - Compensation handlers
   * @param completedOperations - Operations that completed successfully
   */
  private async executeCompensations(
    handlers: Map<string, CompensationHandler>,
    completedOperations: Map<Sequelize, any>
  ): Promise<void> {
    this.logger.log('Executing compensation handlers');

    for (const [name, handler] of handlers) {
      try {
        const data = Array.from(completedOperations.values());
        await handler.compensate(data);
        this.logger.debug(`Executed compensation handler: ${name}`);
      } catch (error: any) {
        this.logger.error(
          `Compensation handler ${name} failed: ${error.message}`
        );
      }
    }
  }

  /**
   * Implements SAGA pattern for long-running distributed transactions
   * @param steps - SAGA steps to execute
   * @returns Results from all steps
   */
  async executeSaga<T>(
    steps: SagaStep<T>[]
  ): Promise<T[]> {
    const results: T[] = [];
    const completedSteps: number[] = [];

    try {
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const result = await step.execute();
        results.push(result);
        completedSteps.push(i);

        this.logger.debug(`Completed SAGA step ${i + 1}/${steps.length}: ${step.name}`);
      }

      return results;

    } catch (error: any) {
      this.logger.error(`SAGA failed at step ${completedSteps.length + 1}: ${error.message}`);

      // Execute compensations in reverse order
      for (let i = completedSteps.length - 1; i >= 0; i--) {
        const stepIndex = completedSteps[i];
        const step = steps[stepIndex];

        if (step.compensate) {
          try {
            await step.compensate(results[i]);
            this.logger.debug(`Compensated SAGA step ${stepIndex + 1}: ${step.name}`);
          } catch (compensationError: any) {
            this.logger.error(
              `Failed to compensate step ${stepIndex + 1}: ${compensationError.message}`
            );
          }
        }
      }

      throw error;
    }
  }

  /**
   * Executes parallel distributed operations with timeout
   * @param operations - Operations to execute
   * @param timeout - Operation timeout
   * @returns Results from all operations
   */
  async executeParallel<T>(
    operations: Array<() => Promise<T>>,
    timeout: number = 30000
  ): Promise<T[]> {
    const promises = operations.map(op =>
      Promise.race([
        op(),
        new Promise<T>((_, reject) =>
          setTimeout(() => reject(new Error('Operation timeout')), timeout)
        )
      ])
    );

    return await Promise.all(promises);
  }

  /**
   * Coordinates cross-database transaction with ordered execution
   * @param databases - Array of Sequelize instances
   * @param fn - Function to execute on each database
   * @returns Array of results
   */
  async coordinateSequential<T>(
    databases: Sequelize[],
    fn: (db: Sequelize, transaction: Transaction, index: number) => Promise<T>
  ): Promise<T[]> {
    const results: T[] = [];
    const transactions: Transaction[] = [];

    try {
      // Execute sequentially
      for (let i = 0; i < databases.length; i++) {
        const db = databases[i];
        const transaction = await db.transaction();
        transactions.push(transaction);

        const result = await fn(db, transaction, i);
        results.push(result);
      }

      // Commit all transactions
      for (const transaction of transactions) {
        await transaction.commit();
      }

      return results;

    } catch (error) {
      // Rollback all transactions
      for (const transaction of transactions) {
        try {
          if (isTransactionActive(transaction)) {
            await transaction.rollback();
          }
        } catch (rollbackError) {
          this.logger.error('Failed to rollback transaction:', rollbackError);
        }
      }

      throw error;
    }
  }
}

/**
 * SAGA step definition
 */
export interface SagaStep<T> {
  name: string;
  execute: () => Promise<T>;
  compensate?: (result: T) => Promise<void>;
}

// ============================================================================
// ISOLATION LEVEL HELPERS (Functions 33-36)
// ============================================================================

/**
 * Gets appropriate isolation level for operation type
 * @param operationType - Type of operation
 * @returns Recommended isolation level
 */
export function getIsolationLevelForOperation(
  operationType: 'read' | 'write' | 'critical' | 'reporting'
): IsolationLevel {
  const levels: Record<string, IsolationLevel> = {
    read: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    write: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    critical: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    reporting: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED
  };

  return levels[operationType] || Transaction.ISOLATION_LEVELS.READ_COMMITTED;
}

/**
 * Creates a read-only transaction
 * @param sequelize - Sequelize instance
 * @param fn - Function to execute
 * @returns Result of function execution
 */
export async function readOnlyTransaction<T>(
  sequelize: Sequelize,
  fn: (transaction: Transaction) => Promise<T>
): Promise<T> {
  return withTransaction(
    sequelize,
    fn,
    {
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
      readOnly: true
    }
  );
}

/**
 * Creates a serializable transaction for critical operations
 * @param sequelize - Sequelize instance
 * @param fn - Function to execute
 * @returns Result of function execution
 */
export async function serializableTransaction<T>(
  sequelize: Sequelize,
  fn: (transaction: Transaction) => Promise<T>
): Promise<T> {
  return withTransaction(
    sequelize,
    fn,
    {
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
    }
  );
}

/**
 * Validates isolation level compatibility
 * @param requiredLevel - Required isolation level
 * @param actualLevel - Actual isolation level
 * @returns True if compatible, false otherwise
 */
export function isIsolationLevelCompatible(
  requiredLevel: IsolationLevel,
  actualLevel: IsolationLevel
): boolean {
  const levels = [
    Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
    Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    Transaction.ISOLATION_LEVELS.SERIALIZABLE
  ];

  const requiredIndex = levels.indexOf(requiredLevel);
  const actualIndex = levels.indexOf(actualLevel);

  return actualIndex >= requiredIndex;
}

// ============================================================================
// TRANSACTION BOUNDARY MANAGEMENT (Functions 37-40)
// ============================================================================

/**
 * Transaction boundary decorator for methods
 * @param boundary - Transaction boundary configuration
 * @returns Method decorator
 */
export function Transactional(boundary: TransactionBoundary) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const sequelize = this.sequelize || this.getSequelize();

      if (!sequelize) {
        throw new Error('Sequelize instance not found');
      }

      const existingTransaction = args.find(arg => arg instanceof Transaction);

      // Handle propagation
      if (boundary.propagation === TransactionPropagation.NEVER) {
        if (existingTransaction) {
          throw new TransactionError(
            'Transaction exists but propagation is NEVER'
          );
        }
        return originalMethod.apply(this, args);
      }

      if (boundary.propagation === TransactionPropagation.MANDATORY) {
        if (!existingTransaction) {
          throw new TransactionError(
            'Transaction required but none found'
          );
        }
        return originalMethod.apply(this, args);
      }

      if (boundary.propagation === TransactionPropagation.NOT_SUPPORTED) {
        // Remove transaction from args
        const filteredArgs = args.filter(arg => !(arg instanceof Transaction));
        return originalMethod.apply(this, filteredArgs);
      }

      if (boundary.propagation === TransactionPropagation.SUPPORTS) {
        return originalMethod.apply(this, args);
      }

      // REQUIRED or REQUIRES_NEW
      const requiresNew =
        boundary.requiresNew ||
        boundary.propagation === TransactionPropagation.REQUIRES_NEW;

      if (existingTransaction && !requiresNew) {
        return originalMethod.apply(this, args);
      }

      // Create new transaction
      return withTransaction(
        sequelize,
        async (transaction) => {
          const newArgs = [...args, transaction];
          return originalMethod.apply(this, newArgs);
        },
        {
          isolationLevel: boundary.isolationLevel,
          readOnly: boundary.readOnly
        }
      );
    };

    return descriptor;
  };
}

/**
 * Transaction boundary manager
 */
@Injectable()
export class TransactionBoundaryManager {
  private readonly logger = new Logger(TransactionBoundaryManager.name);
  private boundaries = new Map<string, TransactionBoundary>();

  /**
   * Registers a transaction boundary
   * @param name - Boundary name
   * @param boundary - Boundary configuration
   */
  registerBoundary(name: string, boundary: TransactionBoundary): void {
    this.boundaries.set(name, boundary);
    this.logger.debug(`Registered transaction boundary: ${name}`);
  }

  /**
   * Executes a function within a transaction boundary
   * @param boundaryName - Name of the boundary
   * @param sequelize - Sequelize instance
   * @param fn - Function to execute
   * @param existingTransaction - Existing transaction if any
   * @returns Result of function execution
   */
  async executeWithinBoundary<T>(
    boundaryName: string,
    sequelize: Sequelize,
    fn: (transaction?: Transaction) => Promise<T>,
    existingTransaction?: Transaction
  ): Promise<T> {
    const boundary = this.boundaries.get(boundaryName);

    if (!boundary) {
      throw new TransactionError(
        `Transaction boundary not found: ${boundaryName}`
      );
    }

    // Handle propagation logic
    const shouldCreateNew =
      boundary.requiresNew ||
      boundary.propagation === TransactionPropagation.REQUIRES_NEW ||
      (boundary.propagation === TransactionPropagation.REQUIRED &&
        !existingTransaction);

    if (shouldCreateNew) {
      return withTransaction(
        sequelize,
        async (transaction) => fn(transaction),
        {
          isolationLevel: boundary.isolationLevel,
          readOnly: boundary.readOnly
        }
      );
    }

    return fn(existingTransaction);
  }

  /**
   * Gets boundary configuration
   * @param name - Boundary name
   * @returns Boundary configuration or undefined
   */
  getBoundary(name: string): TransactionBoundary | undefined {
    return this.boundaries.get(name);
  }

  /**
   * Removes a transaction boundary
   * @param name - Boundary name
   */
  removeBoundary(name: string): void {
    this.boundaries.delete(name);
  }
}

// ============================================================================
// UTILITY CLASSES
// ============================================================================

/**
 * Circuit breaker for transaction execution
 */
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private readonly failureThreshold: number,
    private readonly resetTimeout: number
  ) {}

  isOpen(): boolean {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = 'HALF_OPEN';
        return false;
      }
      return true;
    }
    return false;
  }

  recordSuccess(): void {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  recordFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }
}

/**
 * Circuit breaker registry
 */
class CircuitBreakerRegistry {
  private static breakers = new Map<string, CircuitBreaker>();

  static getOrCreate(
    key: string,
    failureThreshold: number,
    resetTimeout: number
  ): CircuitBreaker {
    let breaker = this.breakers.get(key);

    if (!breaker) {
      breaker = new CircuitBreaker(failureThreshold, resetTimeout);
      this.breakers.set(key, breaker);
    }

    return breaker;
  }
}

// Export all classes and utilities
export {
  NestedTransactionManager,
  TwoPhaseCommitCoordinator,
  DistributedTransactionCoordinator,
  TransactionBoundaryManager,
  SavepointStack
};
