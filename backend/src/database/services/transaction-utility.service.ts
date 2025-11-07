/**
 * Transaction Utility Service
 *
 * Provides automatic retry logic for database transactions with deadlock
 * and serialization failure handling.
 *
 * Features:
 * - Exponential backoff with jitter
 * - Configurable isolation levels
 * - Automatic retry for transient errors
 * - Comprehensive error handling
 * - Performance monitoring hooks
 *
 * Usage:
 * ```typescript
 * import { withTransactionRetry } from '@/database/services/transaction-utility.service';
 *
 * await withTransactionRetry(async (transaction) => {
 *   await Model.update(data, { where: { id }, transaction });
 *   await AuditLog.create(auditData, { transaction });
 * }, {
 *   maxRetries: 3,
 *   isolationLevel: 'READ_COMMITTED'
 * });
 * ```
 */

import { Sequelize, Transaction } from 'sequelize';
import { Logger } from '@nestjs/common';

export interface TransactionOptions {
  /**
   * Maximum number of retry attempts (default: 3)
   */
  maxRetries?: number;

  /**
   * Transaction isolation level (default: READ_COMMITTED)
   */
  isolationLevel?:
    | 'READ_UNCOMMITTED'
    | 'READ_COMMITTED'
    | 'REPEATABLE_READ'
    | 'SERIALIZABLE';

  /**
   * Custom retry delay calculator (default: exponential backoff with jitter)
   */
  calculateDelay?: (attempt: number) => number;

  /**
   * Callback invoked before each retry
   */
  onRetry?: (attempt: number, error: Error) => void;

  /**
   * Callback invoked when transaction completes successfully
   */
  onSuccess?: (duration: number) => void;

  /**
   * Callback invoked when transaction fails after all retries
   */
  onFailure?: (error: Error, attempts: number) => void;
}

export interface TransactionStats {
  attempts: number;
  totalDuration: number;
  lastError?: Error;
  retries: number;
}

/**
 * Error codes that indicate a retryable transaction failure
 */
const RETRYABLE_ERROR_CODES = new Set([
  '40P01', // PostgreSQL: deadlock_detected
  '40001', // PostgreSQL: serialization_failure
  '55P03', // PostgreSQL: lock_not_available
  'ER_LOCK_DEADLOCK', // MySQL: Deadlock found when trying to get lock
  'ER_LOCK_WAIT_TIMEOUT', // MySQL: Lock wait timeout exceeded
]);

/**
 * Determines if an error is retryable
 */
function isRetryableError(error: any): boolean {
  if (!error) return false;

  // Check PostgreSQL error codes
  if (error.code && RETRYABLE_ERROR_CODES.has(error.code)) {
    return true;
  }

  // Check MySQL error codes
  if (error.original?.code && RETRYABLE_ERROR_CODES.has(error.original.code)) {
    return true;
  }

  // Check error message patterns
  const errorMessage = error.message?.toLowerCase() || '';
  return (
    errorMessage.includes('deadlock') ||
    errorMessage.includes('serialization failure') ||
    errorMessage.includes('lock timeout') ||
    errorMessage.includes('could not serialize')
  );
}

/**
 * Calculate delay with exponential backoff and jitter
 * - 1st retry: 100-200ms
 * - 2nd retry: 300-500ms
 * - 3rd retry: 800-1200ms
 */
function calculateDefaultDelay(attempt: number): number {
  const baseDelay = Math.min(1000, 100 * Math.pow(2, attempt));
  const jitter = Math.random() * baseDelay;
  return Math.floor(baseDelay + jitter);
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Get Sequelize isolation level constant
 */
function getIsolationLevel(level: string): Transaction.ISOLATION_LEVELS {
  const isolationLevels: Record<string, Transaction.ISOLATION_LEVELS> = {
    READ_UNCOMMITTED: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
    READ_COMMITTED: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    REPEATABLE_READ: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    SERIALIZABLE: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  };

  return isolationLevels[level] || Transaction.ISOLATION_LEVELS.READ_COMMITTED;
}

/**
 * Execute a function within a database transaction with automatic retry logic
 *
 * @param sequelize - Sequelize instance
 * @param callback - Function to execute within transaction
 * @param options - Transaction options
 * @returns Promise resolving to callback result
 * @throws Error if transaction fails after all retries
 */
export async function withTransactionRetry<T>(
  sequelize: Sequelize,
  callback: (transaction: Transaction) => Promise<T>,
  options: TransactionOptions = {},
): Promise<T> {
  const {
    maxRetries = 3,
    isolationLevel = 'READ_COMMITTED',
    calculateDelay = calculateDefaultDelay,
    onRetry,
    onSuccess,
    onFailure,
  } = options;

  const logger = new Logger('TransactionUtility');
  const stats: TransactionStats = {
    attempts: 0,
    totalDuration: 0,
    retries: 0,
  };

  const startTime = Date.now();

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    stats.attempts++;

    try {
      // Execute transaction with specified isolation level
      const result = await sequelize.transaction(
        {
          isolationLevel: getIsolationLevel(isolationLevel),
        },
        async (transaction: Transaction) => {
          return await callback(transaction);
        },
      );

      // Success - calculate duration and invoke callback
      const duration = Date.now() - startTime;
      stats.totalDuration = duration;

      if (onSuccess) {
        onSuccess(duration);
      }

      // Log performance warning if transaction took too long
      if (duration > 500) {
        logger.warn(
          `Long-running transaction: ${duration}ms (attempts: ${stats.attempts})`,
        );
      }

      // Log retry success if this wasn't the first attempt
      if (attempt > 0) {
        logger.log(
          `Transaction succeeded after ${attempt} retries (${duration}ms total)`,
        );
      }

      return result;
    } catch (error) {
      stats.lastError = error as Error;

      // Check if this is a retryable error
      const shouldRetry = isRetryableError(error) && attempt < maxRetries;

      if (shouldRetry) {
        stats.retries++;
        const delay = calculateDelay(attempt);

        logger.warn(
          `Transaction failed (attempt ${attempt + 1}/${maxRetries + 1}): ${
            error.message
          }. Retrying in ${delay}ms...`,
        );

        // Invoke retry callback
        if (onRetry) {
          onRetry(attempt, error as Error);
        }

        // Wait before retrying
        await sleep(delay);
        continue;
      }

      // Non-retryable error or max retries exceeded
      const duration = Date.now() - startTime;
      stats.totalDuration = duration;

      if (onFailure) {
        onFailure(error as Error, stats.attempts);
      }

      if (attempt >= maxRetries && isRetryableError(error)) {
        logger.error(
          `Transaction failed after ${maxRetries} retries (${duration}ms total): ${error.message}`,
        );
        throw new Error(
          `Transaction failed after ${maxRetries} retries due to ${
            error.message
          }. This may indicate high database contention.`,
        );
      }

      // Re-throw non-retryable errors immediately
      throw error;
    }
  }

  // Should never reach here, but TypeScript needs it
  throw new Error(
    'Transaction retry logic error: exceeded max attempts without throwing',
  );
}

/**
 * Convenience wrapper that uses the default Sequelize instance
 * Inject sequelize instance via dependency injection in your service
 *
 * Example usage in a NestJS service:
 * ```typescript
 * constructor(private sequelize: Sequelize) {}
 *
 * async someMethod() {
 *   return withTransactionRetry(this.sequelize, async (t) => {
 *     // Your transactional operations
 *   });
 * }
 * ```
 */

/**
 * Transaction helper for common patterns
 */
export class TransactionHelper {
  private logger = new Logger('TransactionHelper');

  constructor(private sequelize: Sequelize) {}

  /**
   * Execute callback with default retry settings
   */
  async withRetry<T>(
    callback: (transaction: Transaction) => Promise<T>,
    options?: TransactionOptions,
  ): Promise<T> {
    return withTransactionRetry(this.sequelize, callback, options);
  }

  /**
   * Execute callback with REPEATABLE_READ isolation (for financial operations)
   */
  async withRepeatableRead<T>(
    callback: (transaction: Transaction) => Promise<T>,
    options?: Omit<TransactionOptions, 'isolationLevel'>,
  ): Promise<T> {
    return withTransactionRetry(this.sequelize, callback, {
      ...options,
      isolationLevel: 'REPEATABLE_READ',
    });
  }

  /**
   * Execute callback with SERIALIZABLE isolation (for critical operations)
   */
  async withSerializable<T>(
    callback: (transaction: Transaction) => Promise<T>,
    options?: Omit<TransactionOptions, 'isolationLevel'>,
  ): Promise<T> {
    return withTransactionRetry(this.sequelize, callback, {
      ...options,
      isolationLevel: 'SERIALIZABLE',
      maxRetries: options?.maxRetries || 5, // More retries for SERIALIZABLE
    });
  }

  /**
   * Execute multiple operations in parallel within a transaction
   * Only use when operations are independent and order doesn't matter
   */
  async withParallel<T>(
    callbacks: Array<(transaction: Transaction) => Promise<any>>,
    options?: TransactionOptions,
  ): Promise<T[]> {
    return withTransactionRetry(
      this.sequelize,
      async (transaction) => {
        return Promise.all(callbacks.map((cb) => cb(transaction)));
      },
      options,
    );
  }

  /**
   * Execute operations sequentially within a transaction
   * Use when order matters or operations depend on each other
   */
  async withSequential<T>(
    callbacks: Array<(transaction: Transaction) => Promise<any>>,
    options?: TransactionOptions,
  ): Promise<T[]> {
    return withTransactionRetry(
      this.sequelize,
      async (transaction) => {
        const results: any[] = [];
        for (const callback of callbacks) {
          const result = await callback(transaction);
          results.push(result);
        }
        return results;
      },
      options,
    );
  }
}

/**
 * Export for testing and monitoring
 */
export const __testing__ = {
  isRetryableError,
  calculateDefaultDelay,
  RETRYABLE_ERROR_CODES,
};
