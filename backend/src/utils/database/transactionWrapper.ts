/**
 * Transaction Wrapper Utilities
 * Provides production-grade transaction management for database operations
 *
 * HIPAA Compliance: Ensures atomic operations for PHI data integrity
 * ACID Compliance: Guarantees data consistency across multi-step operations
 */

import { Transaction } from 'sequelize';
import { sequelize } from '../../database/config/sequelize';
import { logger } from '../logger';

/**
 * Transaction options for configuring isolation level and timeout
 */
export interface TransactionOptions {
  maxWait?: number; // Max time to wait for transaction start (ms)
  timeout?: number; // Max time transaction can run (ms)
  isolationLevel?: 'ReadUncommitted' | 'ReadCommitted' | 'RepeatableRead' | 'Serializable';
}

/**
 * Result wrapper for transaction operations
 */
export interface TransactionResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
}

/**
 * Execute a function within a database transaction
 * Automatically handles rollback on error and commit on success
 *
 * @param fn - Async function to execute within transaction
 * @param options - Transaction configuration options
 * @returns TransactionResult with success status and data or error
 *
 * @example
 * const result = await withTransaction(async (tx) => {
 *   const student = await Student.create({ ...studentData }, { transaction: tx });
 *   await HealthRecord.create({ studentId: student.id, ...recordData }, { transaction: tx });
 *   return student;
 * });
 *
 * if (!result.success) {
 *   logger.error('Transaction failed:', result.error);
 * }
 */
export async function withTransaction<T>(
  fn: (tx: Transaction) => Promise<T>,
  options: TransactionOptions = {}
): Promise<TransactionResult<T>> {
  const startTime = Date.now();
  const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    logger.debug(`[${transactionId}] Starting transaction`, { options });

    // Map isolation level
    let isolationLevel: Transaction.ISOLATION_LEVELS;
    switch (options.isolationLevel) {
      case 'ReadUncommitted':
        isolationLevel = Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED;
        break;
      case 'RepeatableRead':
        isolationLevel = Transaction.ISOLATION_LEVELS.REPEATABLE_READ;
        break;
      case 'Serializable':
        isolationLevel = Transaction.ISOLATION_LEVELS.SERIALIZABLE;
        break;
      case 'ReadCommitted':
      default:
        isolationLevel = Transaction.ISOLATION_LEVELS.READ_COMMITTED;
    }

    const result = await sequelize.transaction(
      { isolationLevel },
      async (tx) => {
        // Set statement timeout if specified
        if (options.timeout) {
          await sequelize.query(`SET statement_timeout = ${options.timeout}`, {
            transaction: tx,
          });
        }
        return await fn(tx);
      }
    );

    const duration = Date.now() - startTime;
    logger.debug(`[${transactionId}] Transaction completed successfully`, { duration });

    return {
      success: true,
      data: result
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(`[${transactionId}] Transaction failed`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      duration,
      stack: error instanceof Error ? error.stack : undefined
    });

    return {
      success: false,
      error: error instanceof Error ? error : new Error('Transaction failed')
    };
  }
}

/**
 * Execute multiple independent operations in parallel within a transaction
 * All operations must succeed or all will be rolled back
 *
 * @param operations - Array of async functions to execute in parallel
 * @param options - Transaction configuration options
 * @returns TransactionResult with array of results
 */
export async function withTransactionBatch<T>(
  operations: Array<(tx: Transaction) => Promise<T>>,
  options: TransactionOptions = {}
): Promise<TransactionResult<T[]>> {
  return withTransaction(async (tx) => {
    return await Promise.all(operations.map(op => op(tx)));
  }, options);
}

/**
 * Retry a transaction operation with exponential backoff
 * Useful for handling deadlocks and temporary database issues
 *
 * @param fn - Async function to execute within transaction
 * @param maxRetries - Maximum number of retry attempts
 * @param options - Transaction configuration options
 * @returns TransactionResult with final attempt result
 */
export async function withTransactionRetry<T>(
  fn: (tx: Transaction) => Promise<T>,
  maxRetries: number = 3,
  options: TransactionOptions = {}
): Promise<TransactionResult<T>> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const result = await withTransaction(fn, options);

    if (result.success) {
      return result;
    }

    lastError = result.error;

    // Check if error is retryable (deadlock, timeout, etc.)
    const isRetryable = result.error?.message.includes('deadlock') ||
                       result.error?.message.includes('timeout') ||
                       result.error?.message.includes('serialize');

    if (!isRetryable || attempt === maxRetries) {
      break;
    }

    // Exponential backoff: 100ms, 200ms, 400ms, etc.
    const delay = Math.min(1000, 100 * Math.pow(2, attempt - 1));
    logger.warn(`Transaction attempt ${attempt} failed, retrying in ${delay}ms`, {
      error: result.error?.message
    });

    await new Promise(resolve => setTimeout(resolve, delay));
  }

  return {
    success: false,
    error: lastError || new Error('Transaction failed after retries')
  };
}

/**
 * Validation wrapper for transaction operations
 * Validates input data before executing transaction
 *
 * @param validationFn - Function to validate input data
 * @param transactionFn - Transaction function to execute if validation passes
 * @param options - Transaction configuration options
 * @returns TransactionResult with validation and execution results
 */
export async function withValidatedTransaction<TInput, TOutput>(
  input: TInput,
  validationFn: (data: TInput) => Promise<void> | void,
  transactionFn: (tx: Transaction, data: TInput) => Promise<TOutput>,
  options: TransactionOptions = {}
): Promise<TransactionResult<TOutput>> {
  try {
    // Validate input before starting transaction
    await validationFn(input);
  } catch (error) {
    logger.warn('Transaction validation failed', {
      error: error instanceof Error ? error.message : 'Validation error'
    });

    return {
      success: false,
      error: error instanceof Error ? error : new Error('Validation failed')
    };
  }

  return withTransaction(tx => transactionFn(tx, input), options);
}

/**
 * Savepoint manager for nested transactions
 * Allows partial rollback within a larger transaction
 */
export class SavepointManager {
  private savepoints: string[] = [];

  /**
   * Create a savepoint within current transaction
   */
  async createSavepoint(tx: Transaction, name?: string): Promise<string> {
    const savepointName = name || `sp_${Date.now()}_${this.savepoints.length}`;
    await sequelize.query(`SAVEPOINT ${savepointName}`, { transaction: tx });
    this.savepoints.push(savepointName);
    logger.debug(`Savepoint created: ${savepointName}`);
    return savepointName;
  }

  /**
   * Rollback to a specific savepoint
   */
  async rollbackToSavepoint(tx: Transaction, name: string): Promise<void> {
    await sequelize.query(`ROLLBACK TO SAVEPOINT ${name}`, { transaction: tx });
    // Remove this savepoint and all subsequent ones
    const index = this.savepoints.indexOf(name);
    if (index !== -1) {
      this.savepoints = this.savepoints.slice(0, index);
    }
    logger.debug(`Rolled back to savepoint: ${name}`);
  }

  /**
   * Release a savepoint (commit partial work)
   */
  async releaseSavepoint(tx: Transaction, name: string): Promise<void> {
    await sequelize.query(`RELEASE SAVEPOINT ${name}`, { transaction: tx });
    const index = this.savepoints.indexOf(name);
    if (index !== -1) {
      this.savepoints.splice(index, 1);
    }
    logger.debug(`Released savepoint: ${name}`);
  }
}

/**
 * Transaction context for passing metadata through transaction operations
 */
export interface TransactionContext {
  userId?: string;
  requestId?: string;
  ipAddress?: string;
  userAgent?: string;
  reason?: string;
}

/**
 * Execute transaction with audit context
 * Automatically logs transaction start, completion, and rollback events
 *
 * @param context - Audit context information
 * @param fn - Transaction function to execute
 * @param options - Transaction configuration options
 * @returns TransactionResult with operation result
 */
export async function withAuditedTransaction<T>(
  context: TransactionContext,
  fn: (tx: Transaction, ctx: TransactionContext) => Promise<T>,
  options: TransactionOptions = {}
): Promise<TransactionResult<T>> {
  const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  logger.info('Transaction started', {
    transactionId,
    userId: context.userId,
    requestId: context.requestId,
    reason: context.reason
  });

  const result = await withTransaction(tx => fn(tx, context), options);

  if (result.success) {
    logger.info('Transaction committed', {
      transactionId,
      userId: context.userId,
      requestId: context.requestId
    });
  } else {
    logger.error('Transaction rolled back', {
      transactionId,
      userId: context.userId,
      requestId: context.requestId,
      error: result.error?.message
    });
  }

  return result;
}

// Export sequelize instance for direct usage if needed
export { sequelize };
