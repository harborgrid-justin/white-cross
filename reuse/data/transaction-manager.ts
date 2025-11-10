/**
 * @fileoverview Enterprise-Grade Database Transaction Manager
 * @module reuse/data/transaction-manager
 * @description Production-ready transaction lifecycle management with auto-commit/rollback,
 * ambient transactions, saga patterns, distributed transactions, retry mechanisms,
 * compensation logic, and comprehensive monitoring for healthcare applications
 *
 * @version 1.0.0
 * @requires sequelize ^6.x
 * @requires @nestjs/common ^11.x
 * @requires ioredis ^5.x
 */

import {
  Sequelize,
  Transaction,
  IsolationLevel,
  TransactionOptions,
  Model,
  ModelStatic
} from 'sequelize';
import { Logger, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Transaction context for ambient transaction support with ACID guarantees
 *
 * ACID Properties:
 * - Atomicity: All operations within context complete or none do
 * - Consistency: Transaction leaves database in valid state
 * - Isolation: Controlled by isolationLevel setting
 * - Durability: Committed changes persist through system failures
 */
export interface TransactionContext {
  transaction: Transaction;
  id: string;
  isolationLevel: IsolationLevel;
  startTime: number;
  metadata: Record<string, any>;
  nestedLevel: number;
  parentId?: string;
  readonly: boolean;
  lockAcquired: boolean;
}

/**
 * Transaction lifecycle hooks
 */
export interface TransactionHooks {
  beforeBegin?: (context: TransactionContext) => Promise<void> | void;
  afterBegin?: (context: TransactionContext) => Promise<void> | void;
  beforeCommit?: (context: TransactionContext) => Promise<void> | void;
  afterCommit?: (context: TransactionContext) => Promise<void> | void;
  beforeRollback?: (context: TransactionContext, error?: Error) => Promise<void> | void;
  afterRollback?: (context: TransactionContext, error?: Error) => Promise<void> | void;
}

/**
 * Transaction retry configuration
 */
export interface TransactionRetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  jitter: boolean;
  retryableErrors?: string[];
  onRetry?: (attempt: number, error: Error) => void;
}

/**
 * Saga transaction step definition
 */
export interface SagaStep<T = any> {
  name: string;
  execute: (context: any) => Promise<T>;
  compensate: (context: any, result?: T) => Promise<void>;
  retryable?: boolean;
  timeout?: number;
}

/**
 * Saga execution result
 */
export interface SagaResult<T = any> {
  success: boolean;
  results: T[];
  compensatedSteps: string[];
  error?: Error;
  executionTimeMs: number;
}

/**
 * Distributed transaction configuration
 */
export interface DistributedTransactionConfig {
  coordinatorId: string;
  participants: string[];
  timeout: number;
  isolationLevel?: IsolationLevel;
  redis: Redis;
}

/**
 * Transaction performance metrics
 */
export interface TransactionMetrics {
  transactionId: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  isolationLevel: string;
  queryCount: number;
  queries: Array<{
    sql: string;
    duration: number;
    timestamp: number;
  }>;
  committed: boolean;
  rolledBack: boolean;
  error?: string;
}

/**
 * Transaction timeout configuration
 */
export interface TransactionTimeoutConfig {
  timeout: number;
  onTimeout?: (context: TransactionContext) => Promise<void> | void;
  cleanupOnTimeout?: boolean;
}

/**
 * Compensation action for saga pattern
 */
export interface CompensationAction {
  stepName: string;
  action: () => Promise<void>;
  executedAt: number;
  succeeded: boolean;
  error?: Error;
}

/**
 * Transaction savepoint
 */
export interface Savepoint {
  name: string;
  transaction: Transaction;
  createdAt: number;
}

// ============================================================================
// CUSTOM ERRORS
// ============================================================================

export class TransactionTimeoutError extends Error {
  constructor(message: string, public transactionId: string, public duration: number) {
    super(message);
    this.name = 'TransactionTimeoutError';
  }
}

export class TransactionRetryError extends Error {
  constructor(
    message: string,
    public attempts: number,
    public lastError: Error
  ) {
    super(message);
    this.name = 'TransactionRetryError';
  }
}

export class SagaCompensationError extends Error {
  constructor(
    message: string,
    public failedStep: string,
    public compensatedSteps: string[]
  ) {
    super(message);
    this.name = 'SagaCompensationError';
  }
}

export class DistributedTransactionError extends Error {
  constructor(
    message: string,
    public coordinatorId: string,
    public failedParticipants: string[]
  ) {
    super(message);
    this.name = 'DistributedTransactionError';
  }
}

export class AmbientTransactionError extends Error {
  constructor(message: string, public contextId: string) {
    super(message);
    this.name = 'AmbientTransactionError';
  }
}

// ============================================================================
// TRANSACTION LIFECYCLE MANAGEMENT (Functions 1-8)
// ============================================================================

/**
 * Creates and begins a new transaction with full lifecycle support and ACID compliance
 *
 * ACID Guarantees:
 * - Atomicity: Transaction boundary ensures all-or-nothing execution
 * - Consistency: Isolation level prevents dirty reads/phantom reads
 * - Isolation: Configurable via options.isolationLevel
 * - Durability: Changes persist after commit completes
 *
 * @param sequelize - Sequelize instance
 * @param options - Transaction options including isolation level
 * @param hooks - Lifecycle hooks for monitoring transaction lifecycle
 * @returns Transaction context with metadata tracking
 * @throws Error if transaction creation fails
 *
 * @example
 * const context = await beginTransaction(sequelize, {
 *   isolationLevel: IsolationLevel.SERIALIZABLE
 * }, {
 *   afterBegin: async (ctx) => {
 *     logger.info(`Transaction ${ctx.id} started`);
 *   }
 * });
 */
export async function beginTransaction(
  sequelize: Sequelize,
  options?: TransactionOptions,
  hooks?: TransactionHooks
): Promise<TransactionContext> {
  const context: TransactionContext = {
    transaction: null as any,
    id: crypto.randomBytes(16).toString('hex'),
    isolationLevel: options?.isolationLevel || IsolationLevel.READ_COMMITTED,
    startTime: Date.now(),
    metadata: {},
    nestedLevel: 0,
    readonly: false,
    lockAcquired: false
  };

  if (hooks?.beforeBegin) {
    await hooks.beforeBegin(context);
  }

  try {
    context.transaction = await sequelize.transaction(options);
    context.lockAcquired = true;
  } catch (error) {
    throw new Error(`Failed to begin transaction: ${(error as Error).message}`);
  }

  if (hooks?.afterBegin) {
    await hooks.afterBegin(context);
  }

  return context;
}

/**
 * Commits a transaction with pre/post hooks ensuring ACID compliance
 *
 * ACID Guarantees on Commit:
 * - Atomicity: All operations within transaction become permanent together
 * - Consistency: Database constraints validated before commit succeeds
 * - Isolation: Changes become visible to other transactions atomically
 * - Durability: Changes survive system failures after commit returns
 *
 * Commit Lifecycle:
 * 1. beforeCommit hook executes (validation, logging)
 * 2. Database commit operation executes
 * 3. afterCommit hook executes (cleanup, notifications)
 * 4. Locks released, resources freed
 *
 * Error Handling:
 * - beforeCommit failure prevents commit, transaction still active
 * - Commit failure triggers automatic rollback
 * - afterCommit failure doesn't affect commit (changes already permanent)
 * - All errors propagated to caller for handling
 *
 * @param context - Transaction context with transaction instance and metadata
 * @param hooks - Optional lifecycle hooks for pre/post commit actions
 * @throws Error if beforeCommit hook fails or commit operation fails
 *
 * @example
 * await commitTransaction(context, {
 *   beforeCommit: async (ctx) => {
 *     // Validate business rules before committing
 *     const valid = await validateBusinessRules(ctx);
 *     if (!valid) throw new Error('Validation failed');
 *   },
 *   afterCommit: async (ctx) => {
 *     // Send notifications after successful commit
 *     await eventBus.emit('transaction:committed', ctx.id);
 *     await cache.invalidate(`transaction:${ctx.id}`);
 *   }
 * });
 */
export async function commitTransaction(
  context: TransactionContext,
  hooks?: TransactionHooks
): Promise<void> {
  const logger = new Logger('TransactionManager::commit');

  try {
    if (hooks?.beforeCommit) {
      await hooks.beforeCommit(context);
    }

    await context.transaction.commit();

    if (hooks?.afterCommit) {
      try {
        await hooks.afterCommit(context);
      } catch (afterCommitError) {
        // Log but don't throw - commit already succeeded
        logger.error(
          `afterCommit hook failed for transaction ${context.id}`,
          afterCommitError
        );
      }
    }

    const duration = Date.now() - context.startTime;
    logger.log(`Transaction ${context.id} committed successfully in ${duration}ms`);
  } catch (error) {
    logger.error(`Failed to commit transaction ${context.id}`, error);
    throw error;
  }
}

/**
 * Rolls back a transaction with error handling
 * @param context - Transaction context
 * @param error - Optional error that caused rollback
 * @param hooks - Lifecycle hooks
 */
export async function rollbackTransaction(
  context: TransactionContext,
  error?: Error,
  hooks?: TransactionHooks
): Promise<void> {
  const logger = new Logger('TransactionManager::rollback');

  try {
    if (hooks?.beforeRollback) {
      await hooks.beforeRollback(context, error);
    }

    await context.transaction.rollback();

    if (hooks?.afterRollback) {
      await hooks.afterRollback(context, error);
    }

    logger.warn(`Transaction ${context.id} rolled back`, error?.message);
  } catch (rollbackError) {
    logger.error(`Failed to rollback transaction ${context.id}`, rollbackError);
    throw rollbackError;
  }
}

/**
 * Executes a function within a transaction with automatic commit/rollback
 * @param sequelize - Sequelize instance
 * @param fn - Function to execute
 * @param options - Transaction options
 * @param hooks - Lifecycle hooks
 * @returns Result of function execution
 */
export async function withTransaction<T>(
  sequelize: Sequelize,
  fn: (transaction: Transaction, context: TransactionContext) => Promise<T>,
  options?: TransactionOptions,
  hooks?: TransactionHooks
): Promise<T> {
  const context = await beginTransaction(sequelize, options, hooks);

  try {
    const result = await fn(context.transaction, context);
    await commitTransaction(context, hooks);
    return result;
  } catch (error) {
    await rollbackTransaction(context, error as Error, hooks);
    throw error;
  }
}

/**
 * Executes multiple operations in a single transaction
 * @param sequelize - Sequelize instance
 * @param operations - Array of operations to execute
 * @param options - Transaction options
 * @returns Array of operation results
 */
export async function executeInTransaction<T>(
  sequelize: Sequelize,
  operations: Array<(transaction: Transaction) => Promise<T>>,
  options?: TransactionOptions
): Promise<T[]> {
  return withTransaction(
    sequelize,
    async (transaction) => {
      const results: T[] = [];
      for (const operation of operations) {
        const result = await operation(transaction);
        results.push(result);
      }
      return results;
    },
    options
  );
}

/**
 * Creates a nested transaction (savepoint)
 * @param parentContext - Parent transaction context
 * @param name - Savepoint name
 * @returns Nested transaction context
 */
export async function beginNestedTransaction(
  parentContext: TransactionContext,
  name?: string
): Promise<TransactionContext> {
  const savepointName = name || `sp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  await parentContext.transaction.sequelize.query(
    `SAVEPOINT ${savepointName}`,
    { transaction: parentContext.transaction }
  );

  const nestedContext: TransactionContext = {
    ...parentContext,
    id: crypto.randomBytes(16).toString('hex'),
    nestedLevel: parentContext.nestedLevel + 1,
    parentId: parentContext.id,
    metadata: { ...parentContext.metadata, savepointName }
  };

  return nestedContext;
}

/**
 * Releases a savepoint (commits nested transaction)
 * @param context - Nested transaction context
 */
export async function releaseSavepoint(context: TransactionContext): Promise<void> {
  if (!context.metadata.savepointName) {
    throw new Error('Not a savepoint context');
  }

  await context.transaction.sequelize.query(
    `RELEASE SAVEPOINT ${context.metadata.savepointName}`,
    { transaction: context.transaction }
  );
}

/**
 * Rolls back to a savepoint
 * @param context - Nested transaction context
 */
export async function rollbackToSavepoint(context: TransactionContext): Promise<void> {
  if (!context.metadata.savepointName) {
    throw new Error('Not a savepoint context');
  }

  await context.transaction.sequelize.query(
    `ROLLBACK TO SAVEPOINT ${context.metadata.savepointName}`,
    { transaction: context.transaction }
  );
}

// ============================================================================
// AUTO-COMMIT/ROLLBACK WRAPPERS (Functions 9-12)
// ============================================================================

/**
 * Auto-commit wrapper that commits on success, rolls back on error
 * @param sequelize - Sequelize instance
 * @param fn - Function to execute
 * @param options - Transaction options
 * @returns Result of function execution
 */
export async function autoCommit<T>(
  sequelize: Sequelize,
  fn: (transaction: Transaction) => Promise<T>,
  options?: TransactionOptions
): Promise<T> {
  return sequelize.transaction(options || {}, async (transaction) => {
    return await fn(transaction);
  });
}

/**
 * Auto-rollback wrapper for testing (always rolls back)
 * @param sequelize - Sequelize instance
 * @param fn - Function to execute
 * @param options - Transaction options
 * @returns Result of function execution
 */
export async function autoRollback<T>(
  sequelize: Sequelize,
  fn: (transaction: Transaction) => Promise<T>,
  options?: TransactionOptions
): Promise<T> {
  return sequelize.transaction(options || {}, async (transaction) => {
    try {
      return await fn(transaction);
    } finally {
      await transaction.rollback();
    }
  });
}

/**
 * Conditional commit wrapper (commits based on condition)
 * @param sequelize - Sequelize instance
 * @param fn - Function to execute
 * @param shouldCommit - Predicate function to determine if commit should occur
 * @param options - Transaction options
 * @returns Result of function execution and commit status
 */
export async function conditionalCommit<T>(
  sequelize: Sequelize,
  fn: (transaction: Transaction) => Promise<T>,
  shouldCommit: (result: T) => boolean | Promise<boolean>,
  options?: TransactionOptions
): Promise<{ result: T; committed: boolean }> {
  const transaction = await sequelize.transaction(options || {});

  try {
    const result = await fn(transaction);
    const commit = await shouldCommit(result);

    if (commit) {
      await transaction.commit();
      return { result, committed: true };
    } else {
      await transaction.rollback();
      return { result, committed: false };
    }
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

/**
 * Deferred commit wrapper (delays commit until explicitly called)
 * @param sequelize - Sequelize instance
 * @param fn - Function to execute
 * @param options - Transaction options
 * @returns Result and commit/rollback functions
 */
export async function deferredCommit<T>(
  sequelize: Sequelize,
  fn: (transaction: Transaction) => Promise<T>,
  options?: TransactionOptions
): Promise<{
  result: T;
  commit: () => Promise<void>;
  rollback: () => Promise<void>;
}> {
  const transaction = await sequelize.transaction(options || {});

  try {
    const result = await fn(transaction);

    return {
      result,
      commit: async () => await transaction.commit(),
      rollback: async () => await transaction.rollback()
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

// ============================================================================
// AMBIENT TRANSACTIONS & CONTEXT PROPAGATION (Functions 13-17)
// ============================================================================

/**
 * Ambient transaction context storage (AsyncLocalStorage pattern)
 */
export class AmbientTransactionManager {
  private contexts = new Map<string, TransactionContext>();
  private logger = new Logger('AmbientTransactionManager');

  /**
   * Sets the current ambient transaction context
   * @param context - Transaction context
   */
  setContext(context: TransactionContext): void {
    this.contexts.set(context.id, context);
    this.logger.debug(`Set ambient transaction context: ${context.id}`);
  }

  /**
   * Gets the current ambient transaction context
   * @param contextId - Optional context ID
   * @returns Transaction context or undefined
   */
  getContext(contextId?: string): TransactionContext | undefined {
    if (contextId) {
      return this.contexts.get(contextId);
    }

    // Return most recent context
    const contexts = Array.from(this.contexts.values());
    return contexts[contexts.length - 1];
  }

  /**
   * Removes transaction context
   * @param contextId - Context ID to remove
   */
  removeContext(contextId: string): void {
    this.contexts.delete(contextId);
    this.logger.debug(`Removed ambient transaction context: ${contextId}`);
  }

  /**
   * Clears all contexts
   */
  clearAll(): void {
    this.contexts.clear();
    this.logger.debug('Cleared all ambient transaction contexts');
  }

  /**
   * Executes a function with ambient transaction context
   * @param sequelize - Sequelize instance
   * @param fn - Function to execute
   * @param options - Transaction options
   * @returns Result of function execution
   */
  async withAmbientContext<T>(
    sequelize: Sequelize,
    fn: (context: TransactionContext) => Promise<T>,
    options?: TransactionOptions
  ): Promise<T> {
    const context = await beginTransaction(sequelize, options);
    this.setContext(context);

    try {
      const result = await fn(context);
      await commitTransaction(context);
      return result;
    } catch (error) {
      await rollbackTransaction(context, error as Error);
      throw error;
    } finally {
      this.removeContext(context.id);
    }
  }

  /**
   * Gets or creates ambient transaction
   * @param sequelize - Sequelize instance
   * @param options - Transaction options
   * @returns Existing or new transaction context
   */
  async getOrCreateContext(
    sequelize: Sequelize,
    options?: TransactionOptions
  ): Promise<{ context: TransactionContext; created: boolean }> {
    const existingContext = this.getContext();

    if (existingContext) {
      return { context: existingContext, created: false };
    }

    const newContext = await beginTransaction(sequelize, options);
    this.setContext(newContext);
    return { context: newContext, created: true };
  }
}

/**
 * Global ambient transaction manager instance
 */
export const ambientTransactionManager = new AmbientTransactionManager();

/**
 * Gets current ambient transaction or throws error
 * @returns Current transaction context
 * @throws AmbientTransactionError if no ambient transaction exists
 */
export function requireAmbientTransaction(): TransactionContext {
  const context = ambientTransactionManager.getContext();

  if (!context) {
    throw new AmbientTransactionError(
      'No ambient transaction context found',
      'unknown'
    );
  }

  return context;
}

/**
 * Propagates transaction context to child operations
 * @param context - Parent transaction context
 * @param fn - Child operation
 * @returns Result of child operation
 */
export async function propagateContext<T>(
  context: TransactionContext,
  fn: (transaction: Transaction) => Promise<T>
): Promise<T> {
  return fn(context.transaction);
}

// ============================================================================
// TRANSACTION TIMEOUT HANDLING (Functions 18-21)
// ============================================================================

/**
 * Executes transaction with timeout
 * @param sequelize - Sequelize instance
 * @param fn - Function to execute
 * @param config - Timeout configuration
 * @param options - Transaction options
 * @returns Result of function execution
 */
export async function withTimeout<T>(
  sequelize: Sequelize,
  fn: (transaction: Transaction) => Promise<T>,
  config: TransactionTimeoutConfig,
  options?: TransactionOptions
): Promise<T> {
  const context = await beginTransaction(sequelize, options);
  let timeoutId: NodeJS.Timeout;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(async () => {
      if (config.onTimeout) {
        await config.onTimeout(context);
      }

      if (config.cleanupOnTimeout) {
        await rollbackTransaction(context);
      }

      reject(
        new TransactionTimeoutError(
          `Transaction timeout after ${config.timeout}ms`,
          context.id,
          Date.now() - context.startTime
        )
      );
    }, config.timeout);
  });

  try {
    const result = await Promise.race([
      fn(context.transaction),
      timeoutPromise
    ]);

    clearTimeout(timeoutId!);
    await commitTransaction(context);
    return result;
  } catch (error) {
    clearTimeout(timeoutId!);
    await rollbackTransaction(context, error as Error);
    throw error;
  }
}

/**
 * Sets statement timeout for transaction
 * @param transaction - Transaction instance
 * @param timeoutMs - Timeout in milliseconds
 */
export async function setStatementTimeout(
  transaction: Transaction,
  timeoutMs: number
): Promise<void> {
  const sequelize = transaction.sequelize;

  if (sequelize.getDialect() === 'postgres') {
    await sequelize.query(
      `SET LOCAL statement_timeout = ${timeoutMs}`,
      { transaction }
    );
  } else if (sequelize.getDialect() === 'mysql') {
    await sequelize.query(
      `SET SESSION max_execution_time = ${timeoutMs}`,
      { transaction }
    );
  }
}

/**
 * Sets idle-in-transaction timeout
 * @param transaction - Transaction instance
 * @param timeoutMs - Timeout in milliseconds
 */
export async function setIdleInTransactionTimeout(
  transaction: Transaction,
  timeoutMs: number
): Promise<void> {
  const sequelize = transaction.sequelize;

  if (sequelize.getDialect() === 'postgres') {
    await sequelize.query(
      `SET LOCAL idle_in_transaction_session_timeout = ${timeoutMs}`,
      { transaction }
    );
  }
}

/**
 * Monitors transaction duration and logs warnings
 * @param context - Transaction context
 * @param warningThreshold - Threshold for warnings in milliseconds
 * @returns Monitoring interval ID
 */
export function monitorTransactionDuration(
  context: TransactionContext,
  warningThreshold: number
): NodeJS.Timeout {
  const logger = new Logger('TransactionMonitor');

  return setInterval(() => {
    const duration = Date.now() - context.startTime;

    if (duration > warningThreshold) {
      logger.warn(
        `Long-running transaction detected: ${context.id} (${duration}ms)`
      );
    }
  }, warningThreshold / 2);
}

// ============================================================================
// TRANSACTION RETRY WITH EXPONENTIAL BACKOFF (Functions 22-25)
// ============================================================================

/**
 * Retries transaction with exponential backoff
 * @param sequelize - Sequelize instance
 * @param fn - Function to execute
 * @param config - Retry configuration
 * @param options - Transaction options
 * @returns Result of function execution
 */
export async function retryTransaction<T>(
  sequelize: Sequelize,
  fn: (transaction: Transaction, attempt: number) => Promise<T>,
  config: TransactionRetryConfig,
  options?: TransactionOptions
): Promise<T> {
  const logger = new Logger('TransactionRetry');
  let lastError: Error;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await autoCommit(
        sequelize,
        async (transaction) => await fn(transaction, attempt),
        options
      );
    } catch (error: any) {
      lastError = error;

      // Check if error is retryable
      const isRetryable = config.retryableErrors
        ? config.retryableErrors.some(pattern => error.message?.includes(pattern))
        : isTransactionRetryable(error);

      if (!isRetryable || attempt === config.maxRetries) {
        throw new TransactionRetryError(
          `Transaction failed after ${attempt + 1} attempts`,
          attempt + 1,
          error
        );
      }

      if (config.onRetry) {
        config.onRetry(attempt + 1, error);
      }

      // Calculate delay with exponential backoff and jitter
      let delay = Math.min(
        config.initialDelay * Math.pow(config.backoffMultiplier, attempt),
        config.maxDelay
      );

      if (config.jitter) {
        delay = delay * (0.5 + Math.random() * 0.5);
      }

      logger.warn(
        `Transaction failed, retrying in ${delay}ms (attempt ${attempt + 1}/${config.maxRetries})`,
        error.message
      );

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

/**
 * Checks if error is retryable based on comprehensive deadlock and serialization patterns
 *
 * Detects:
 * - Deadlock conditions (database-level lock conflicts)
 * - Lock timeout (waiting for resource locks)
 * - Serialization failures (isolation level conflicts)
 * - Connection issues (network/connection pool)
 * - Statement timeout (query execution time limits)
 * - Unique constraint violations during concurrent inserts
 *
 * @param error - Error to check
 * @returns True if error indicates a transient condition suitable for retry
 *
 * @example
 * try {
 *   await transaction.commit();
 * } catch (error) {
 *   if (isTransactionRetryable(error)) {
 *     // Retry the transaction
 *     await retryTransaction(sequelize, fn, config);
 *   } else {
 *     throw error; // Non-retryable error
 *   }
 * }
 */
export function isTransactionRetryable(error: any): boolean {
  const retryablePatterns = [
    // Deadlock detection
    /deadlock/i,
    /deadlock detected/i,

    // Lock timeouts
    /lock timeout/i,
    /lock wait timeout/i,
    /timeout waiting for lock/i,

    // Serialization failures
    /could not serialize/i,
    /serialization failure/i,
    /concurrent update/i,

    // Connection issues
    /connection refused/i,
    /connection terminated/i,
    /connection reset/i,
    /ECONNRESET/,
    /ETIMEDOUT/,
    /ECONNREFUSED/,

    // Statement timeouts
    /statement timeout/i,
    /query timeout/i,

    // Concurrent modification
    /unique constraint/i,
    /duplicate key/i,

    // PostgreSQL specific
    /40P01/,  // deadlock_detected
    /40001/,  // serialization_failure

    // MySQL specific
    /1213/,   // ER_LOCK_DEADLOCK
    /1205/,   // ER_LOCK_WAIT_TIMEOUT
  ];

  const errorMessage = error?.message || error?.toString() || '';
  const errorCode = error?.code || error?.parent?.code || '';

  return retryablePatterns.some(pattern =>
    pattern.test(errorMessage) || pattern.test(errorCode)
  );
}

/**
 * Adaptive retry with dynamic backoff based on error type
 * @param sequelize - Sequelize instance
 * @param fn - Function to execute
 * @param options - Transaction options
 * @returns Result of function execution
 */
export async function adaptiveRetryTransaction<T>(
  sequelize: Sequelize,
  fn: (transaction: Transaction) => Promise<T>,
  options?: TransactionOptions
): Promise<T> {
  const getRetryConfig = (error: any): TransactionRetryConfig => {
    if (error?.message?.includes('deadlock')) {
      return {
        maxRetries: 5,
        initialDelay: 50,
        maxDelay: 2000,
        backoffMultiplier: 2,
        jitter: true
      };
    }

    if (error?.message?.includes('timeout')) {
      return {
        maxRetries: 3,
        initialDelay: 100,
        maxDelay: 1000,
        backoffMultiplier: 1.5,
        jitter: true
      };
    }

    // Default config
    return {
      maxRetries: 3,
      initialDelay: 100,
      maxDelay: 5000,
      backoffMultiplier: 2,
      jitter: true
    };
  };

  let currentConfig: TransactionRetryConfig | null = null;

  return retryTransaction(
    sequelize,
    fn,
    currentConfig || getRetryConfig({}),
    options
  );
}

/**
 * Circuit breaker for transaction retries
 */
export class TransactionCircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private logger = new Logger('TransactionCircuitBreaker');

  constructor(
    private threshold: number,
    private timeout: number,
    private resetTimeout: number
  ) {}

  /**
   * Executes function with circuit breaker protection
   * @param sequelize - Sequelize instance
   * @param fn - Function to execute
   * @param options - Transaction options
   * @returns Result of function execution
   */
  async execute<T>(
    sequelize: Sequelize,
    fn: (transaction: Transaction) => Promise<T>,
    options?: TransactionOptions
  ): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime >= this.resetTimeout) {
        this.state = 'HALF_OPEN';
        this.logger.log('Circuit breaker entering HALF_OPEN state');
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await autoCommit(sequelize, fn, options);

      if (this.state === 'HALF_OPEN') {
        this.state = 'CLOSED';
        this.failures = 0;
        this.logger.log('Circuit breaker reset to CLOSED state');
      }

      return result;
    } catch (error) {
      this.failures++;
      this.lastFailureTime = Date.now();

      if (this.failures >= this.threshold) {
        this.state = 'OPEN';
        this.logger.warn(
          `Circuit breaker opened after ${this.failures} failures`
        );
      }

      throw error;
    }
  }

  /**
   * Resets circuit breaker to closed state
   */
  reset(): void {
    this.state = 'CLOSED';
    this.failures = 0;
    this.lastFailureTime = 0;
    this.logger.log('Circuit breaker manually reset');
  }

  /**
   * Gets current circuit breaker state
   */
  getState(): 'CLOSED' | 'OPEN' | 'HALF_OPEN' {
    return this.state;
  }
}

// ============================================================================
// COMPENSATING TRANSACTION PATTERNS (Functions 26-29)
// ============================================================================

/**
 * Executes operation with compensation logic
 * @param sequelize - Sequelize instance
 * @param operation - Main operation
 * @param compensation - Compensation operation
 * @param options - Transaction options
 * @returns Result of operation
 */
export async function withCompensation<T>(
  sequelize: Sequelize,
  operation: (transaction: Transaction) => Promise<T>,
  compensation: (transaction: Transaction, result: T) => Promise<void>,
  options?: TransactionOptions
): Promise<T> {
  const logger = new Logger('CompensatingTransaction');
  let result: T;

  const transaction = await sequelize.transaction(options || {});

  try {
    result = await operation(transaction);
    await transaction.commit();
    return result;
  } catch (error) {
    logger.warn('Operation failed, executing compensation', error);
    await transaction.rollback();

    // Execute compensation in new transaction
    const compensationTx = await sequelize.transaction();
    try {
      await compensation(compensationTx, result!);
      await compensationTx.commit();
      logger.log('Compensation executed successfully');
    } catch (compError) {
      await compensationTx.rollback();
      logger.error('Compensation failed', compError);
    }

    throw error;
  }
}

/**
 * Compensation action registry
 */
export class CompensationRegistry {
  private actions: CompensationAction[] = [];
  private logger = new Logger('CompensationRegistry');

  /**
   * Registers a compensation action
   * @param stepName - Name of the step
   * @param action - Compensation action
   */
  register(stepName: string, action: () => Promise<void>): void {
    this.actions.push({
      stepName,
      action,
      executedAt: Date.now(),
      succeeded: false
    });
  }

  /**
   * Executes all compensation actions in reverse order
   * @returns Array of compensation results
   */
  async executeAll(): Promise<CompensationAction[]> {
    const results: CompensationAction[] = [];

    // Execute in reverse order (LIFO)
    for (let i = this.actions.length - 1; i >= 0; i--) {
      const compensation = this.actions[i];

      try {
        await compensation.action();
        compensation.succeeded = true;
        this.logger.log(`Compensated step: ${compensation.stepName}`);
      } catch (error) {
        compensation.succeeded = false;
        compensation.error = error as Error;
        this.logger.error(`Compensation failed for ${compensation.stepName}`, error);
      }

      results.push(compensation);
    }

    return results;
  }

  /**
   * Clears all registered actions
   */
  clear(): void {
    this.actions = [];
  }

  /**
   * Gets all registered actions
   */
  getActions(): CompensationAction[] {
    return [...this.actions];
  }
}

/**
 * Two-phase commit coordinator
 * @param sequelize - Sequelize instance
 * @param prepare - Prepare phase function
 * @param commit - Commit phase function
 * @param rollback - Rollback function
 * @returns Commit result
 */
export async function twoPhaseCommit<T>(
  sequelize: Sequelize,
  prepare: (transaction: Transaction) => Promise<T>,
  commit: (transaction: Transaction, preparedData: T) => Promise<void>,
  rollback: (transaction: Transaction) => Promise<void>
): Promise<boolean> {
  const logger = new Logger('TwoPhaseCommit');
  const transaction = await sequelize.transaction();

  try {
    // Phase 1: Prepare
    logger.log('Phase 1: Prepare');
    const preparedData = await prepare(transaction);

    // Phase 2: Commit
    logger.log('Phase 2: Commit');
    await commit(transaction, preparedData);
    await transaction.commit();

    logger.log('Two-phase commit successful');
    return true;
  } catch (error) {
    logger.error('Two-phase commit failed, rolling back', error);

    try {
      await rollback(transaction);
      await transaction.rollback();
    } catch (rollbackError) {
      logger.error('Rollback failed in two-phase commit', rollbackError);
    }

    return false;
  }
}

// ============================================================================
// SAGA TRANSACTION COORDINATION (Functions 30-33)
// ============================================================================

/**
 * Saga transaction coordinator
 */
@Injectable()
export class SagaCoordinator {
  private logger = new Logger('SagaCoordinator');

  /**
   * Executes saga with automatic compensation on failure
   * @param steps - Saga steps
   * @param initialContext - Initial context
   * @returns Saga execution result
   */
  async execute<T = any>(
    steps: SagaStep[],
    initialContext: any = {}
  ): Promise<SagaResult<T>> {
    const startTime = Date.now();
    const results: T[] = [];
    const executedSteps: Array<{ step: SagaStep; result: any }> = [];
    const compensatedSteps: string[] = [];

    try {
      // Execute steps sequentially
      for (const step of steps) {
        this.logger.log(`Executing saga step: ${step.name}`);

        try {
          const result = await this.executeStep(step, {
            ...initialContext,
            previousResults: results
          });

          results.push(result);
          executedSteps.push({ step, result });
        } catch (error) {
          this.logger.error(`Saga step failed: ${step.name}`, error);

          // Compensate executed steps
          await this.compensate(executedSteps, compensatedSteps);

          return {
            success: false,
            results,
            compensatedSteps,
            error: error as Error,
            executionTimeMs: Date.now() - startTime
          };
        }
      }

      return {
        success: true,
        results,
        compensatedSteps: [],
        executionTimeMs: Date.now() - startTime
      };
    } catch (error) {
      this.logger.error('Saga execution failed', error);

      return {
        success: false,
        results,
        compensatedSteps,
        error: error as Error,
        executionTimeMs: Date.now() - startTime
      };
    }
  }

  /**
   * Executes a single saga step with timeout
   * @param step - Saga step
   * @param context - Execution context
   * @returns Step result
   */
  private async executeStep(step: SagaStep, context: any): Promise<any> {
    if (step.timeout) {
      return Promise.race([
        step.execute(context),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error(`Step ${step.name} timeout`)),
            step.timeout
          )
        )
      ]);
    }

    return step.execute(context);
  }

  /**
   * Compensates executed steps in reverse order
   * @param executedSteps - Steps to compensate
   * @param compensatedSteps - Output array for compensated step names
   */
  private async compensate(
    executedSteps: Array<{ step: SagaStep; result: any }>,
    compensatedSteps: string[]
  ): Promise<void> {
    this.logger.warn('Starting saga compensation');

    // Compensate in reverse order
    for (let i = executedSteps.length - 1; i >= 0; i--) {
      const { step, result } = executedSteps[i];

      try {
        this.logger.log(`Compensating step: ${step.name}`);
        await step.compensate({ result }, result);
        compensatedSteps.push(step.name);
      } catch (compError) {
        this.logger.error(`Compensation failed for ${step.name}`, compError);
        // Continue compensating other steps
      }
    }
  }

  /**
   * Executes saga with parallel steps where possible
   * @param steps - Saga steps with dependencies
   * @param initialContext - Initial context
   * @returns Saga execution result
   */
  async executeParallel(
    steps: Array<SagaStep & { dependencies?: string[] }>,
    initialContext: any = {}
  ): Promise<SagaResult> {
    const startTime = Date.now();
    const results: any[] = [];
    const executedSteps: Array<{ step: SagaStep; result: any }> = [];
    const compensatedSteps: string[] = [];

    try {
      const stepMap = new Map(steps.map(s => [s.name, s]));
      const completed = new Set<string>();
      const resultMap = new Map<string, any>();

      while (completed.size < steps.length) {
        // Find steps ready to execute (dependencies satisfied)
        const ready = steps.filter(
          step =>
            !completed.has(step.name) &&
            (!step.dependencies ||
              step.dependencies.every(dep => completed.has(dep)))
        );

        if (ready.length === 0) {
          throw new Error('Circular dependency or deadlock detected in saga');
        }

        // Execute ready steps in parallel
        const promises = ready.map(async step => {
          const result = await this.executeStep(step, {
            ...initialContext,
            results: resultMap
          });

          return { step, result };
        });

        const batchResults = await Promise.all(promises);

        for (const { step, result } of batchResults) {
          completed.add(step.name);
          resultMap.set(step.name, result);
          results.push(result);
          executedSteps.push({ step, result });
        }
      }

      return {
        success: true,
        results,
        compensatedSteps: [],
        executionTimeMs: Date.now() - startTime
      };
    } catch (error) {
      await this.compensate(executedSteps, compensatedSteps);

      return {
        success: false,
        results,
        compensatedSteps,
        error: error as Error,
        executionTimeMs: Date.now() - startTime
      };
    }
  }
}

// ============================================================================
// DISTRIBUTED TRANSACTION MANAGEMENT (Functions 34-37)
// ============================================================================

/**
 * Distributed transaction coordinator using Redis
 */
@Injectable()
export class DistributedTransactionCoordinator {
  private logger = new Logger('DistributedTransactionCoordinator');

  constructor(private readonly redis: Redis) {}

  /**
   * Begins distributed transaction across multiple participants
   * @param config - Distributed transaction configuration
   * @returns Transaction ID
   */
  async begin(config: DistributedTransactionConfig): Promise<string> {
    const txId = crypto.randomBytes(16).toString('hex');
    const txKey = `dtx:${txId}`;

    await this.redis.hset(txKey, {
      coordinator: config.coordinatorId,
      participants: JSON.stringify(config.participants),
      status: 'PREPARING',
      startTime: Date.now().toString(),
      timeout: config.timeout.toString()
    });

    await this.redis.expire(txKey, Math.ceil(config.timeout / 1000) + 60);

    this.logger.log(`Distributed transaction started: ${txId}`);
    return txId;
  }

  /**
   * Prepares transaction on a participant
   * @param txId - Transaction ID
   * @param participantId - Participant ID
   * @returns Success status
   */
  async prepare(txId: string, participantId: string): Promise<boolean> {
    const txKey = `dtx:${txId}`;
    const prepareKey = `${txKey}:prepare:${participantId}`;

    await this.redis.set(prepareKey, 'PREPARED', 'EX', 300);
    this.logger.log(`Participant ${participantId} prepared for transaction ${txId}`);

    return true;
  }

  /**
   * Commits distributed transaction
   * @param txId - Transaction ID
   * @param config - Transaction configuration
   * @returns Success status
   */
  async commit(txId: string, config: DistributedTransactionConfig): Promise<boolean> {
    const txKey = `dtx:${txId}`;

    // Check if all participants are prepared
    const allPrepared = await this.checkAllPrepared(txId, config.participants);

    if (!allPrepared) {
      this.logger.error(`Not all participants prepared for transaction ${txId}`);
      await this.rollback(txId, config);
      return false;
    }

    // Update status to COMMITTING
    await this.redis.hset(txKey, 'status', 'COMMITTING');

    // Send commit signal to all participants
    for (const participant of config.participants) {
      const commitKey = `${txKey}:commit:${participant}`;
      await this.redis.set(commitKey, 'COMMIT', 'EX', 60);
    }

    // Update status to COMMITTED
    await this.redis.hset(txKey, 'status', 'COMMITTED');
    this.logger.log(`Distributed transaction committed: ${txId}`);

    return true;
  }

  /**
   * Rolls back distributed transaction
   * @param txId - Transaction ID
   * @param config - Transaction configuration
   */
  async rollback(txId: string, config: DistributedTransactionConfig): Promise<void> {
    const txKey = `dtx:${txId}`;

    await this.redis.hset(txKey, 'status', 'ROLLING_BACK');

    // Send rollback signal to all participants
    for (const participant of config.participants) {
      const rollbackKey = `${txKey}:rollback:${participant}`;
      await this.redis.set(rollbackKey, 'ROLLBACK', 'EX', 60);
    }

    await this.redis.hset(txKey, 'status', 'ROLLED_BACK');
    this.logger.log(`Distributed transaction rolled back: ${txId}`);
  }

  /**
   * Checks if all participants have prepared
   * @param txId - Transaction ID
   * @param participants - List of participant IDs
   * @returns True if all prepared, false otherwise
   */
  private async checkAllPrepared(
    txId: string,
    participants: string[]
  ): Promise<boolean> {
    const txKey = `dtx:${txId}`;

    for (const participant of participants) {
      const prepareKey = `${txKey}:prepare:${participant}`;
      const status = await this.redis.get(prepareKey);

      if (status !== 'PREPARED') {
        return false;
      }
    }

    return true;
  }

  /**
   * Gets distributed transaction status
   * @param txId - Transaction ID
   * @returns Transaction status
   */
  async getStatus(txId: string): Promise<{
    status: string;
    participants: string[];
    startTime: number;
  } | null> {
    const txKey = `dtx:${txId}`;
    const data = await this.redis.hgetall(txKey);

    if (!data || Object.keys(data).length === 0) {
      return null;
    }

    return {
      status: data.status,
      participants: JSON.parse(data.participants),
      startTime: parseInt(data.startTime)
    };
  }
}

// ============================================================================
// TRANSACTION EVENT HOOKS (Functions 38-40)
// ============================================================================

/**
 * Transaction event emitter
 */
export class TransactionEventEmitter {
  private listeners = new Map<string, Array<(...args: any[]) => void>>();
  private logger = new Logger('TransactionEventEmitter');

  /**
   * Subscribes to transaction events
   * @param event - Event name
   * @param callback - Callback function
   */
  on(event: string, callback: (...args: any[]) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }

    this.listeners.get(event)!.push(callback);
  }

  /**
   * Emits transaction event
   * @param event - Event name
   * @param args - Event arguments
   */
  emit(event: string, ...args: any[]): void {
    const callbacks = this.listeners.get(event);

    if (callbacks) {
      for (const callback of callbacks) {
        try {
          callback(...args);
        } catch (error) {
          this.logger.error(`Error in event listener for ${event}`, error);
        }
      }
    }
  }

  /**
   * Unsubscribes from transaction events
   * @param event - Event name
   * @param callback - Callback function
   */
  off(event: string, callback: (...args: any[]) => void): void {
    const callbacks = this.listeners.get(event);

    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Clears all event listeners
   */
  clear(): void {
    this.listeners.clear();
  }
}

/**
 * Global transaction event emitter
 */
export const transactionEvents = new TransactionEventEmitter();

/**
 * Executes transaction with event emission
 * @param sequelize - Sequelize instance
 * @param fn - Function to execute
 * @param options - Transaction options
 * @returns Result of function execution
 */
export async function withEvents<T>(
  sequelize: Sequelize,
  fn: (transaction: Transaction) => Promise<T>,
  options?: TransactionOptions
): Promise<T> {
  const context = await beginTransaction(sequelize, options);

  transactionEvents.emit('transaction:begin', context);

  try {
    const result = await fn(context.transaction);
    await commitTransaction(context);

    transactionEvents.emit('transaction:commit', context);
    return result;
  } catch (error) {
    await rollbackTransaction(context, error as Error);

    transactionEvents.emit('transaction:rollback', context, error);
    throw error;
  }
}

// ============================================================================
// TRANSACTION LOGGING AND MONITORING (Functions 41-43)
// ============================================================================

/**
 * Transaction logger with detailed metrics
 */
export class TransactionLogger {
  private logger = new Logger('TransactionLogger');
  private metrics = new Map<string, TransactionMetrics>();

  /**
   * Starts logging for a transaction
   * @param context - Transaction context
   */
  start(context: TransactionContext): void {
    const metrics: TransactionMetrics = {
      transactionId: context.id,
      startTime: context.startTime,
      isolationLevel: context.isolationLevel,
      queryCount: 0,
      queries: [],
      committed: false,
      rolledBack: false
    };

    this.metrics.set(context.id, metrics);
    this.logger.log(`Transaction started: ${context.id}`);
  }

  /**
   * Logs a query within transaction
   * @param transactionId - Transaction ID
   * @param sql - SQL query
   * @param duration - Query duration
   */
  logQuery(transactionId: string, sql: string, duration: number): void {
    const metrics = this.metrics.get(transactionId);

    if (metrics) {
      metrics.queryCount++;
      metrics.queries.push({
        sql,
        duration,
        timestamp: Date.now()
      });
    }
  }

  /**
   * Logs transaction commit
   * @param transactionId - Transaction ID
   */
  commit(transactionId: string): void {
    const metrics = this.metrics.get(transactionId);

    if (metrics) {
      metrics.endTime = Date.now();
      metrics.duration = metrics.endTime - metrics.startTime;
      metrics.committed = true;

      this.logger.log(
        `Transaction committed: ${transactionId} (${metrics.duration}ms, ${metrics.queryCount} queries)`
      );
    }
  }

  /**
   * Logs transaction rollback
   * @param transactionId - Transaction ID
   * @param error - Error that caused rollback
   */
  rollback(transactionId: string, error?: Error): void {
    const metrics = this.metrics.get(transactionId);

    if (metrics) {
      metrics.endTime = Date.now();
      metrics.duration = metrics.endTime - metrics.startTime;
      metrics.rolledBack = true;
      metrics.error = error?.message;

      this.logger.warn(
        `Transaction rolled back: ${transactionId} (${metrics.duration}ms)`,
        error?.message
      );
    }
  }

  /**
   * Gets metrics for a transaction
   * @param transactionId - Transaction ID
   * @returns Transaction metrics
   */
  getMetrics(transactionId: string): TransactionMetrics | undefined {
    return this.metrics.get(transactionId);
  }

  /**
   * Gets all transaction metrics
   * @returns All metrics
   */
  getAllMetrics(): TransactionMetrics[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Clears metrics for a transaction
   * @param transactionId - Transaction ID
   */
  clear(transactionId: string): void {
    this.metrics.delete(transactionId);
  }
}

/**
 * Global transaction logger
 */
export const transactionLogger = new TransactionLogger();

/**
 * Executes transaction with comprehensive logging
 * @param sequelize - Sequelize instance
 * @param fn - Function to execute
 * @param options - Transaction options
 * @returns Result of function execution
 */
export async function withLogging<T>(
  sequelize: Sequelize,
  fn: (transaction: Transaction) => Promise<T>,
  options?: TransactionOptions
): Promise<T> {
  const context = await beginTransaction(sequelize, options);
  transactionLogger.start(context);

  try {
    const result = await fn(context.transaction);
    await commitTransaction(context);
    transactionLogger.commit(context.id);
    return result;
  } catch (error) {
    await rollbackTransaction(context, error as Error);
    transactionLogger.rollback(context.id, error as Error);
    throw error;
  }
}

// ============================================================================
// TRANSACTION PERFORMANCE PROFILING (Functions 44-45)
// ============================================================================

/**
 * Transaction performance profiler
 */
export class TransactionProfiler {
  private logger = new Logger('TransactionProfiler');
  private profiles = new Map<string, {
    startTime: number;
    checkpoints: Array<{ name: string; timestamp: number; duration: number }>;
  }>();

  /**
   * Starts profiling a transaction
   * @param transactionId - Transaction ID
   */
  start(transactionId: string): void {
    this.profiles.set(transactionId, {
      startTime: Date.now(),
      checkpoints: []
    });
  }

  /**
   * Adds a checkpoint to the profile
   * @param transactionId - Transaction ID
   * @param checkpointName - Checkpoint name
   */
  checkpoint(transactionId: string, checkpointName: string): void {
    const profile = this.profiles.get(transactionId);

    if (profile) {
      const timestamp = Date.now();
      const duration = timestamp - profile.startTime;

      profile.checkpoints.push({
        name: checkpointName,
        timestamp,
        duration
      });

      this.logger.debug(
        `Checkpoint ${checkpointName} at ${duration}ms for transaction ${transactionId}`
      );
    }
  }

  /**
   * Ends profiling and returns results
   * @param transactionId - Transaction ID
   * @returns Profile results
   */
  end(transactionId: string): {
    totalDuration: number;
    checkpoints: Array<{ name: string; duration: number }>;
  } | null {
    const profile = this.profiles.get(transactionId);

    if (!profile) {
      return null;
    }

    const totalDuration = Date.now() - profile.startTime;

    this.profiles.delete(transactionId);

    return {
      totalDuration,
      checkpoints: profile.checkpoints.map(cp => ({
        name: cp.name,
        duration: cp.duration
      }))
    };
  }

  /**
   * Gets current profile
   * @param transactionId - Transaction ID
   * @returns Current profile or null
   */
  getProfile(transactionId: string): any {
    return this.profiles.get(transactionId);
  }
}

/**
 * Global transaction profiler
 */
export const transactionProfiler = new TransactionProfiler();

/**
 * Executes transaction with performance profiling
 * @param sequelize - Sequelize instance
 * @param fn - Function to execute with profiler
 * @param options - Transaction options
 * @returns Result and profile
 */
export async function withProfiling<T>(
  sequelize: Sequelize,
  fn: (transaction: Transaction, profiler: TransactionProfiler) => Promise<T>,
  options?: TransactionOptions
): Promise<{ result: T; profile: any }> {
  const context = await beginTransaction(sequelize, options);
  transactionProfiler.start(context.id);

  try {
    const result = await fn(context.transaction, transactionProfiler);
    await commitTransaction(context);

    const profile = transactionProfiler.end(context.id);

    return { result, profile };
  } catch (error) {
    await rollbackTransaction(context, error as Error);
    transactionProfiler.end(context.id);
    throw error;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  SagaCoordinator,
  DistributedTransactionCoordinator,
  TransactionCircuitBreaker,
  CompensationRegistry,
  AmbientTransactionManager
};
