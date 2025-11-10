/**
 * Unit of Work Interface
 * Implements the Unit of Work pattern for managing database transactions
 */

import { ExecutionContext } from '../types';
import { TransactionIsolationLevel } from '../types/database.enums';

/**
 * Unit of Work interface following the Unit of Work pattern
 * Provides transactional consistency across multiple repository operations
 */
export interface IUnitOfWork {
  /**
   * Begins a new database transaction
   */
  begin(): Promise<void>;

  /**
   * Commits the current transaction
   */
  commit(): Promise<void>;

  /**
   * Rolls back the current transaction
   */
  rollback(): Promise<void>;

  /**
   * Checks if currently within an active transaction
   */
  isInTransaction(): boolean;

  /**
   * Executes an operation within a transaction with automatic lifecycle management
   */
  executeInTransaction<T>(
    operation: (uow: IUnitOfWork) => Promise<T>,
    context: ExecutionContext,
  ): Promise<T>;
}

/**
 * Transaction options
 */
export interface TransactionOptions {
  /**
   * Maximum time to wait for transaction to start (milliseconds)
   */
  maxWait?: number;

  /**
   * Maximum time for transaction to complete (milliseconds)
   */
  timeout?: number;

  /**
   * Transaction isolation level
   */
  isolationLevel?: TransactionIsolationLevel;
}
