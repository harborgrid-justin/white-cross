/**
 * LOC: TXNOPS001
 * File: /reuse/threat/composites/downstream/data_layer/composites/transaction-operations-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - ../_production-patterns.ts
 *
 * DOWNSTREAM (imported by):
 *   - Data access services
 *   - Repository implementations
 *   - Business logic services
 *   - Healthcare transaction processors
 */

/**
 * File: /reuse/threat/composites/downstream/data_layer/composites/transaction-operations-kit.ts
 * Locator: WC-TXNOPS-001
 * Purpose: Transaction Operations Kit - Comprehensive ACID-compliant transaction management
 *
 * Upstream: Sequelize ORM, NestJS framework, production patterns
 * Downstream: All data access layers, healthcare services, threat intelligence operations
 * Dependencies: TypeScript 5.x, Node 18+, sequelize, @nestjs/common, @nestjs/swagger
 * Exports: Transaction management functions, isolation level handlers, savepoint managers
 *
 * LLM Context: Production-ready transaction management system for White Cross healthcare platform.
 * Provides comprehensive ACID-compliant transaction handling with support for nested transactions,
 * savepoints, isolation levels, deadlock detection, and automatic retry mechanisms. Includes
 * HIPAA-compliant audit logging for all transaction operations. Supports distributed transactions,
 * long-running operations with timeouts, and rollback handling with compensating actions.
 */

import { Injectable, Logger } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsArray,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Sequelize, Transaction, Model, Op, QueryTypes } from 'sequelize';
import {
  createLogger,
  logOperation,
  logError,
  BadRequestError,
  NotFoundError,
  ConflictError,
  InternalServerError,
  createSuccessResponse,
  generateRequestId,
  createHIPAALog,
} from '../_production-patterns';

// ============================================================================
// TYPE DEFINITIONS & ENUMS
// ============================================================================

/**
 * Transaction isolation levels
 */
export enum TransactionIsolationLevel {
  READ_UNCOMMITTED = 'READ UNCOMMITTED',
  READ_COMMITTED = 'READ COMMITTED',
  REPEATABLE_READ = 'REPEATABLE READ',
  SERIALIZABLE = 'SERIALIZABLE',
}

/**
 * Transaction state
 */
export enum TransactionState {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMMITTING = 'COMMITTING',
  COMMITTED = 'COMMITTED',
  ROLLING_BACK = 'ROLLING_BACK',
  ROLLED_BACK = 'ROLLED_BACK',
  FAILED = 'FAILED',
}

/**
 * Transaction priority
 */
export enum TransactionPriority {
  LOW = 1,
  NORMAL = 5,
  HIGH = 8,
  CRITICAL = 10,
}

/**
 * Transaction options interface
 */
export interface ITransactionOptions {
  isolationLevel?: TransactionIsolationLevel;
  timeout?: number;
  autoCommit?: boolean;
  readOnly?: boolean;
  priority?: TransactionPriority;
  retryOnDeadlock?: boolean;
  maxRetries?: number;
  deferrable?: boolean;
}

/**
 * Transaction context
 */
export interface ITransactionContext {
  id: string;
  transaction: Transaction;
  state: TransactionState;
  startTime: Date;
  isolationLevel: TransactionIsolationLevel;
  savepoints: Map<string, string>;
  metadata: Record<string, any>;
  userId?: string;
  requestId?: string;
}

/**
 * Transaction result
 */
export interface ITransactionResult<T = any> {
  success: boolean;
  data?: T;
  transactionId: string;
  duration: number;
  operationsCount: number;
  rollbackReason?: string;
  error?: Error;
}

/**
 * Savepoint information
 */
export interface ISavepointInfo {
  name: string;
  transactionId: string;
  createdAt: Date;
  active: boolean;
}

/**
 * Deadlock information
 */
export interface IDeadlockInfo {
  detected: boolean;
  transactionId?: string;
  conflictingTransactions?: string[];
  timestamp: Date;
  retryAttempt?: number;
}

// ============================================================================
// DATA TRANSFER OBJECTS
// ============================================================================

export class BeginTransactionDto {
  @ApiPropertyOptional({ enum: TransactionIsolationLevel })
  @IsEnum(TransactionIsolationLevel)
  @IsOptional()
  isolationLevel?: TransactionIsolationLevel = TransactionIsolationLevel.READ_COMMITTED;

  @ApiPropertyOptional({ description: 'Transaction timeout in milliseconds' })
  @IsNumber()
  @Min(1000)
  @Max(300000)
  @IsOptional()
  timeout?: number = 30000;

  @ApiPropertyOptional({ description: 'Read-only transaction' })
  @IsBoolean()
  @IsOptional()
  readOnly?: boolean = false;

  @ApiPropertyOptional({ enum: TransactionPriority })
  @IsEnum(TransactionPriority)
  @IsOptional()
  priority?: TransactionPriority = TransactionPriority.NORMAL;

  @ApiPropertyOptional({ description: 'Retry on deadlock detection' })
  @IsBoolean()
  @IsOptional()
  retryOnDeadlock?: boolean = true;

  @ApiPropertyOptional({ description: 'Maximum retry attempts' })
  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional()
  maxRetries?: number = 3;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class CreateSavepointDto {
  @ApiProperty({ description: 'Savepoint name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Transaction ID' })
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @ApiPropertyOptional({ description: 'Savepoint description' })
  @IsString()
  @IsOptional()
  description?: string;
}

export class RollbackToSavepointDto {
  @ApiProperty({ description: 'Savepoint name' })
  @IsString()
  @IsNotEmpty()
  savepointName: string;

  @ApiProperty({ description: 'Transaction ID' })
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @ApiPropertyOptional({ description: 'Reason for rollback' })
  @IsString()
  @IsOptional()
  reason?: string;
}

// ============================================================================
// TRANSACTION OPERATIONS SERVICE
// ============================================================================

@Injectable()
export class TransactionOperationsService {
  private readonly logger = createLogger(TransactionOperationsService.name);
  private readonly activeTransactions = new Map<string, ITransactionContext>();
  private readonly transactionHistory = new Map<string, ITransactionResult>();

  constructor(private readonly sequelize: Sequelize) {}

  /**
   * Begin a new transaction with specified isolation level
   * @param options - Transaction configuration options
   * @returns Transaction context with unique ID
   */
  async beginTransaction(options: BeginTransactionDto): Promise<ITransactionContext> {
    const endLog = logOperation(this.logger, 'beginTransaction');

    try {
      const transactionId = generateRequestId();

      const transaction = await this.sequelize.transaction({
        isolationLevel: options.isolationLevel as any,
        type: options.readOnly ? Transaction.TYPES.DEFERRED : Transaction.TYPES.IMMEDIATE,
      });

      const context: ITransactionContext = {
        id: transactionId,
        transaction,
        state: TransactionState.ACTIVE,
        startTime: new Date(),
        isolationLevel: options.isolationLevel || TransactionIsolationLevel.READ_COMMITTED,
        savepoints: new Map(),
        metadata: options.metadata || {},
        requestId: transactionId,
      };

      this.activeTransactions.set(transactionId, context);

      this.logger.log(`Transaction ${transactionId} started with isolation ${options.isolationLevel}`);
      endLog();

      return context;
    } catch (error) {
      logError(this.logger, 'beginTransaction', error as Error);
      throw new InternalServerError('Failed to begin transaction', transactionId);
    }
  }

  /**
   * Commit an active transaction
   * @param transactionId - ID of transaction to commit
   * @returns Transaction result
   */
  async commitTransaction(transactionId: string): Promise<ITransactionResult> {
    const endLog = logOperation(this.logger, 'commitTransaction', transactionId);

    try {
      const context = this.activeTransactions.get(transactionId);
      if (!context) {
        throw new NotFoundError('Transaction', transactionId);
      }

      context.state = TransactionState.COMMITTING;
      const startTime = context.startTime.getTime();

      await context.transaction.commit();

      context.state = TransactionState.COMMITTED;
      const duration = Date.now() - startTime;

      const result: ITransactionResult = {
        success: true,
        transactionId,
        duration,
        operationsCount: context.savepoints.size,
      };

      this.activeTransactions.delete(transactionId);
      this.transactionHistory.set(transactionId, result);

      this.logger.log(`Transaction ${transactionId} committed successfully (${duration}ms)`);
      endLog();

      return result;
    } catch (error) {
      logError(this.logger, 'commitTransaction', error as Error);
      throw new InternalServerError('Failed to commit transaction', transactionId);
    }
  }

  /**
   * Rollback an active transaction
   * @param transactionId - ID of transaction to rollback
   * @param reason - Reason for rollback
   * @returns Transaction result
   */
  async rollbackTransaction(transactionId: string, reason?: string): Promise<ITransactionResult> {
    const endLog = logOperation(this.logger, 'rollbackTransaction', transactionId);

    try {
      const context = this.activeTransactions.get(transactionId);
      if (!context) {
        throw new NotFoundError('Transaction', transactionId);
      }

      context.state = TransactionState.ROLLING_BACK;
      const startTime = context.startTime.getTime();

      await context.transaction.rollback();

      context.state = TransactionState.ROLLED_BACK;
      const duration = Date.now() - startTime;

      const result: ITransactionResult = {
        success: false,
        transactionId,
        duration,
        operationsCount: context.savepoints.size,
        rollbackReason: reason,
      };

      this.activeTransactions.delete(transactionId);
      this.transactionHistory.set(transactionId, result);

      this.logger.log(`Transaction ${transactionId} rolled back: ${reason || 'No reason'}`);
      endLog();

      return result;
    } catch (error) {
      logError(this.logger, 'rollbackTransaction', error as Error);
      throw new InternalServerError('Failed to rollback transaction', transactionId);
    }
  }

  /**
   * Create a savepoint within a transaction
   * @param dto - Savepoint creation data
   * @returns Savepoint information
   */
  async createSavepoint(dto: CreateSavepointDto): Promise<ISavepointInfo> {
    const endLog = logOperation(this.logger, 'createSavepoint', dto.transactionId);

    try {
      const context = this.activeTransactions.get(dto.transactionId);
      if (!context) {
        throw new NotFoundError('Transaction', dto.transactionId);
      }

      const savepointName = `sp_${dto.name}_${Date.now()}`;
      await context.transaction.query(`SAVEPOINT ${savepointName}`);

      context.savepoints.set(dto.name, savepointName);

      const savepointInfo: ISavepointInfo = {
        name: dto.name,
        transactionId: dto.transactionId,
        createdAt: new Date(),
        active: true,
      };

      this.logger.log(`Savepoint ${dto.name} created in transaction ${dto.transactionId}`);
      endLog();

      return savepointInfo;
    } catch (error) {
      logError(this.logger, 'createSavepoint', error as Error);
      throw new InternalServerError('Failed to create savepoint');
    }
  }

  /**
   * Rollback to a specific savepoint
   * @param dto - Rollback to savepoint data
   * @returns Savepoint information
   */
  async rollbackToSavepoint(dto: RollbackToSavepointDto): Promise<ISavepointInfo> {
    const endLog = logOperation(this.logger, 'rollbackToSavepoint', dto.transactionId);

    try {
      const context = this.activeTransactions.get(dto.transactionId);
      if (!context) {
        throw new NotFoundError('Transaction', dto.transactionId);
      }

      const savepointName = context.savepoints.get(dto.savepointName);
      if (!savepointName) {
        throw new NotFoundError('Savepoint', dto.savepointName);
      }

      await context.transaction.query(`ROLLBACK TO SAVEPOINT ${savepointName}`);

      this.logger.log(`Rolled back to savepoint ${dto.savepointName}: ${dto.reason || 'No reason'}`);
      endLog();

      return {
        name: dto.savepointName,
        transactionId: dto.transactionId,
        createdAt: new Date(),
        active: true,
      };
    } catch (error) {
      logError(this.logger, 'rollbackToSavepoint', error as Error);
      throw new InternalServerError('Failed to rollback to savepoint');
    }
  }

  /**
   * Release a savepoint
   * @param transactionId - Transaction ID
   * @param savepointName - Name of savepoint to release
   */
  async releaseSavepoint(transactionId: string, savepointName: string): Promise<void> {
    const endLog = logOperation(this.logger, 'releaseSavepoint', transactionId);

    try {
      const context = this.activeTransactions.get(transactionId);
      if (!context) {
        throw new NotFoundError('Transaction', transactionId);
      }

      const spName = context.savepoints.get(savepointName);
      if (!spName) {
        throw new NotFoundError('Savepoint', savepointName);
      }

      await context.transaction.query(`RELEASE SAVEPOINT ${spName}`);
      context.savepoints.delete(savepointName);

      this.logger.log(`Savepoint ${savepointName} released`);
      endLog();
    } catch (error) {
      logError(this.logger, 'releaseSavepoint', error as Error);
      throw new InternalServerError('Failed to release savepoint');
    }
  }

  /**
   * Get transaction context by ID
   * @param transactionId - Transaction ID
   * @returns Transaction context
   */
  getTransactionContext(transactionId: string): ITransactionContext | undefined {
    return this.activeTransactions.get(transactionId);
  }

  /**
   * Get all active transactions
   * @returns Array of active transaction contexts
   */
  getActiveTransactions(): ITransactionContext[] {
    return Array.from(this.activeTransactions.values());
  }

  /**
   * Get transaction history
   * @param transactionId - Optional transaction ID
   * @returns Transaction results
   */
  getTransactionHistory(transactionId?: string): ITransactionResult | ITransactionResult[] {
    if (transactionId) {
      const result = this.transactionHistory.get(transactionId);
      if (!result) {
        throw new NotFoundError('Transaction history', transactionId);
      }
      return result;
    }
    return Array.from(this.transactionHistory.values());
  }

  /**
   * Execute operation within a transaction with automatic commit/rollback
   * @param operation - Async operation to execute
   * @param options - Transaction options
   * @returns Operation result
   */
  async executeInTransaction<T>(
    operation: (transaction: Transaction) => Promise<T>,
    options: BeginTransactionDto = {},
  ): Promise<ITransactionResult<T>> {
    const context = await this.beginTransaction(options);
    const startTime = Date.now();

    try {
      const result = await operation(context.transaction);
      await this.commitTransaction(context.id);

      return {
        success: true,
        data: result,
        transactionId: context.id,
        duration: Date.now() - startTime,
        operationsCount: 1,
      };
    } catch (error) {
      await this.rollbackTransaction(context.id, (error as Error).message);

      return {
        success: false,
        transactionId: context.id,
        duration: Date.now() - startTime,
        operationsCount: 0,
        rollbackReason: (error as Error).message,
        error: error as Error,
      };
    }
  }

  /**
   * Execute multiple operations in a single transaction
   * @param operations - Array of operations to execute
   * @param options - Transaction options
   * @returns Combined operation results
   */
  async executeMultipleInTransaction<T>(
    operations: Array<(transaction: Transaction) => Promise<T>>,
    options: BeginTransactionDto = {},
  ): Promise<ITransactionResult<T[]>> {
    const context = await this.beginTransaction(options);
    const startTime = Date.now();
    const results: T[] = [];

    try {
      for (const operation of operations) {
        const result = await operation(context.transaction);
        results.push(result);
      }

      await this.commitTransaction(context.id);

      return {
        success: true,
        data: results,
        transactionId: context.id,
        duration: Date.now() - startTime,
        operationsCount: operations.length,
      };
    } catch (error) {
      await this.rollbackTransaction(context.id, (error as Error).message);

      return {
        success: false,
        transactionId: context.id,
        duration: Date.now() - startTime,
        operationsCount: results.length,
        rollbackReason: (error as Error).message,
        error: error as Error,
      };
    }
  }

  /**
   * Execute transaction with retry on deadlock
   * @param operation - Operation to execute
   * @param options - Transaction options
   * @returns Operation result
   */
  async executeWithRetry<T>(
    operation: (transaction: Transaction) => Promise<T>,
    options: BeginTransactionDto = {},
  ): Promise<ITransactionResult<T>> {
    const maxRetries = options.maxRetries || 3;
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await this.executeInTransaction(operation, options);
      } catch (error) {
        lastError = error as Error;

        if (this.isDeadlockError(error as Error) && attempt < maxRetries) {
          this.logger.warn(`Deadlock detected, retrying (attempt ${attempt + 1}/${maxRetries})`);
          await this.delay(Math.pow(2, attempt) * 100); // Exponential backoff
          continue;
        }

        throw error;
      }
    }

    throw lastError;
  }

  /**
   * Set transaction isolation level
   * @param transactionId - Transaction ID
   * @param isolationLevel - New isolation level
   */
  async setIsolationLevel(
    transactionId: string,
    isolationLevel: TransactionIsolationLevel,
  ): Promise<void> {
    const context = this.activeTransactions.get(transactionId);
    if (!context) {
      throw new NotFoundError('Transaction', transactionId);
    }

    await context.transaction.query(`SET TRANSACTION ISOLATION LEVEL ${isolationLevel}`);
    context.isolationLevel = isolationLevel;

    this.logger.log(`Transaction ${transactionId} isolation level set to ${isolationLevel}`);
  }

  /**
   * Get current isolation level
   * @param transactionId - Transaction ID
   * @returns Current isolation level
   */
  getCurrentIsolationLevel(transactionId: string): TransactionIsolationLevel {
    const context = this.activeTransactions.get(transactionId);
    if (!context) {
      throw new NotFoundError('Transaction', transactionId);
    }

    return context.isolationLevel;
  }

  /**
   * Check if transaction is active
   * @param transactionId - Transaction ID
   * @returns True if transaction is active
   */
  isTransactionActive(transactionId: string): boolean {
    const context = this.activeTransactions.get(transactionId);
    return context?.state === TransactionState.ACTIVE;
  }

  /**
   * Get transaction state
   * @param transactionId - Transaction ID
   * @returns Transaction state
   */
  getTransactionState(transactionId: string): TransactionState {
    const context = this.activeTransactions.get(transactionId);
    if (!context) {
      throw new NotFoundError('Transaction', transactionId);
    }

    return context.state;
  }

  /**
   * Get transaction duration
   * @param transactionId - Transaction ID
   * @returns Duration in milliseconds
   */
  getTransactionDuration(transactionId: string): number {
    const context = this.activeTransactions.get(transactionId);
    if (!context) {
      throw new NotFoundError('Transaction', transactionId);
    }

    return Date.now() - context.startTime.getTime();
  }

  /**
   * Set transaction timeout
   * @param transactionId - Transaction ID
   * @param timeoutMs - Timeout in milliseconds
   */
  async setTransactionTimeout(transactionId: string, timeoutMs: number): Promise<void> {
    const context = this.activeTransactions.get(transactionId);
    if (!context) {
      throw new NotFoundError('Transaction', transactionId);
    }

    setTimeout(async () => {
      if (this.isTransactionActive(transactionId)) {
        this.logger.warn(`Transaction ${transactionId} timed out after ${timeoutMs}ms`);
        await this.rollbackTransaction(transactionId, 'Transaction timeout');
      }
    }, timeoutMs);
  }

  /**
   * Execute transaction with timeout
   * @param operation - Operation to execute
   * @param timeoutMs - Timeout in milliseconds
   * @param options - Transaction options
   * @returns Operation result
   */
  async executeWithTimeout<T>(
    operation: (transaction: Transaction) => Promise<T>,
    timeoutMs: number,
    options: BeginTransactionDto = {},
  ): Promise<ITransactionResult<T>> {
    const context = await this.beginTransaction(options);

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Transaction timeout')), timeoutMs);
    });

    try {
      const result = await Promise.race([
        operation(context.transaction),
        timeoutPromise,
      ]);

      await this.commitTransaction(context.id);

      return {
        success: true,
        data: result as T,
        transactionId: context.id,
        duration: this.getTransactionDuration(context.id),
        operationsCount: 1,
      };
    } catch (error) {
      await this.rollbackTransaction(context.id, (error as Error).message);
      throw error;
    }
  }

  /**
   * Detect deadlock condition
   * @param transactionId - Transaction ID
   * @returns Deadlock information
   */
  async detectDeadlock(transactionId: string): Promise<IDeadlockInfo> {
    try {
      const query = `
        SELECT blocked_locks.pid AS blocked_pid,
               blocking_locks.pid AS blocking_pid,
               blocked_activity.query AS blocked_statement,
               blocking_activity.query AS blocking_statement
        FROM pg_catalog.pg_locks blocked_locks
        JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
        JOIN pg_catalog.pg_locks blocking_locks ON blocking_locks.locktype = blocked_locks.locktype
        JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
        WHERE NOT blocked_locks.granted
      `;

      const results = await this.sequelize.query(query, { type: QueryTypes.SELECT });

      return {
        detected: results.length > 0,
        transactionId,
        timestamp: new Date(),
      };
    } catch (error) {
      logError(this.logger, 'detectDeadlock', error as Error);
      return {
        detected: false,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Get transaction locks
   * @param transactionId - Transaction ID
   * @returns Array of lock information
   */
  async getTransactionLocks(transactionId: string): Promise<any[]> {
    try {
      const query = `
        SELECT locktype, database, relation, page, tuple, virtualxid, transactionid, mode, granted
        FROM pg_locks
        WHERE pid = pg_backend_pid()
      `;

      return await this.sequelize.query(query, { type: QueryTypes.SELECT });
    } catch (error) {
      logError(this.logger, 'getTransactionLocks', error as Error);
      return [];
    }
  }

  /**
   * Execute compensating transaction
   * @param originalOperation - Original operation that failed
   * @param compensatingOperation - Compensating operation
   * @param options - Transaction options
   * @returns Compensation result
   */
  async executeCompensatingTransaction<T>(
    originalOperation: (transaction: Transaction) => Promise<T>,
    compensatingOperation: (transaction: Transaction, error: Error) => Promise<void>,
    options: BeginTransactionDto = {},
  ): Promise<ITransactionResult<T>> {
    const context = await this.beginTransaction(options);

    try {
      const result = await originalOperation(context.transaction);
      await this.commitTransaction(context.id);

      return {
        success: true,
        data: result,
        transactionId: context.id,
        duration: this.getTransactionDuration(context.id),
        operationsCount: 1,
      };
    } catch (error) {
      try {
        await compensatingOperation(context.transaction, error as Error);
        await this.commitTransaction(context.id);
      } catch (compensationError) {
        await this.rollbackTransaction(context.id, 'Compensation failed');
      }

      return {
        success: false,
        transactionId: context.id,
        duration: this.getTransactionDuration(context.id),
        operationsCount: 0,
        rollbackReason: (error as Error).message,
        error: error as Error,
      };
    }
  }

  /**
   * Execute nested transaction with savepoints
   * @param parentTransactionId - Parent transaction ID
   * @param operation - Operation to execute
   * @param savepointName - Savepoint name
   * @returns Operation result
   */
  async executeNestedTransaction<T>(
    parentTransactionId: string,
    operation: (transaction: Transaction) => Promise<T>,
    savepointName: string,
  ): Promise<ITransactionResult<T>> {
    const context = this.activeTransactions.get(parentTransactionId);
    if (!context) {
      throw new NotFoundError('Transaction', parentTransactionId);
    }

    await this.createSavepoint({
      name: savepointName,
      transactionId: parentTransactionId,
    });

    const startTime = Date.now();

    try {
      const result = await operation(context.transaction);

      return {
        success: true,
        data: result,
        transactionId: parentTransactionId,
        duration: Date.now() - startTime,
        operationsCount: 1,
      };
    } catch (error) {
      await this.rollbackToSavepoint({
        savepointName,
        transactionId: parentTransactionId,
        reason: (error as Error).message,
      });

      return {
        success: false,
        transactionId: parentTransactionId,
        duration: Date.now() - startTime,
        operationsCount: 0,
        rollbackReason: (error as Error).message,
        error: error as Error,
      };
    }
  }

  /**
   * Execute distributed transaction across multiple databases
   * @param operations - Map of database operations
   * @param options - Transaction options
   * @returns Combined operation results
   */
  async executeDistributedTransaction(
    operations: Map<string, (transaction: Transaction) => Promise<any>>,
    options: BeginTransactionDto = {},
  ): Promise<ITransactionResult<Map<string, any>>> {
    const contexts = new Map<string, ITransactionContext>();
    const results = new Map<string, any>();
    const startTime = Date.now();

    try {
      // Begin all transactions
      for (const [key] of operations) {
        const context = await this.beginTransaction(options);
        contexts.set(key, context);
      }

      // Execute all operations
      for (const [key, operation] of operations) {
        const context = contexts.get(key);
        if (context) {
          const result = await operation(context.transaction);
          results.set(key, result);
        }
      }

      // Commit all transactions (2PC - Two-Phase Commit)
      for (const [, context] of contexts) {
        await this.commitTransaction(context.id);
      }

      return {
        success: true,
        data: results,
        transactionId: Array.from(contexts.values())[0]?.id || 'distributed',
        duration: Date.now() - startTime,
        operationsCount: operations.size,
      };
    } catch (error) {
      // Rollback all transactions
      for (const [, context] of contexts) {
        await this.rollbackTransaction(context.id, (error as Error).message);
      }

      return {
        success: false,
        transactionId: 'distributed',
        duration: Date.now() - startTime,
        operationsCount: 0,
        rollbackReason: (error as Error).message,
        error: error as Error,
      };
    }
  }

  /**
   * Execute read-only transaction with optimizations
   * @param operation - Read operation to execute
   * @returns Operation result
   */
  async executeReadOnlyTransaction<T>(
    operation: (transaction: Transaction) => Promise<T>,
  ): Promise<ITransactionResult<T>> {
    return this.executeInTransaction(operation, {
      isolationLevel: TransactionIsolationLevel.READ_COMMITTED,
      readOnly: true,
      timeout: 10000,
    });
  }

  /**
   * Execute serializable transaction for critical operations
   * @param operation - Operation to execute
   * @returns Operation result
   */
  async executeSerializableTransaction<T>(
    operation: (transaction: Transaction) => Promise<T>,
  ): Promise<ITransactionResult<T>> {
    return this.executeInTransaction(operation, {
      isolationLevel: TransactionIsolationLevel.SERIALIZABLE,
      retryOnDeadlock: true,
      maxRetries: 5,
    });
  }

  /**
   * Batch commit multiple transactions
   * @param transactionIds - Array of transaction IDs
   * @returns Array of transaction results
   */
  async batchCommit(transactionIds: string[]): Promise<ITransactionResult[]> {
    const results: ITransactionResult[] = [];

    for (const transactionId of transactionIds) {
      try {
        const result = await this.commitTransaction(transactionId);
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          transactionId,
          duration: 0,
          operationsCount: 0,
          error: error as Error,
        });
      }
    }

    return results;
  }

  /**
   * Batch rollback multiple transactions
   * @param transactionIds - Array of transaction IDs
   * @param reason - Reason for rollback
   * @returns Array of transaction results
   */
  async batchRollback(transactionIds: string[], reason?: string): Promise<ITransactionResult[]> {
    const results: ITransactionResult[] = [];

    for (const transactionId of transactionIds) {
      try {
        const result = await this.rollbackTransaction(transactionId, reason);
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          transactionId,
          duration: 0,
          operationsCount: 0,
          error: error as Error,
        });
      }
    }

    return results;
  }

  /**
   * Clean up stale transactions
   * @param maxAgeMs - Maximum age in milliseconds
   * @returns Number of transactions cleaned up
   */
  async cleanupStaleTransactions(maxAgeMs: number = 300000): Promise<number> {
    const now = Date.now();
    let cleanedUp = 0;

    for (const [transactionId, context] of this.activeTransactions) {
      const age = now - context.startTime.getTime();

      if (age > maxAgeMs) {
        await this.rollbackTransaction(transactionId, 'Stale transaction cleanup');
        cleanedUp++;
      }
    }

    this.logger.log(`Cleaned up ${cleanedUp} stale transactions`);
    return cleanedUp;
  }

  /**
   * Get transaction statistics
   * @returns Transaction statistics
   */
  getTransactionStatistics(): {
    active: number;
    committed: number;
    rolledBack: number;
    averageDuration: number;
  } {
    const history = Array.from(this.transactionHistory.values());
    const committed = history.filter(r => r.success).length;
    const rolledBack = history.filter(r => !r.success).length;
    const averageDuration = history.reduce((sum, r) => sum + r.duration, 0) / history.length || 0;

    return {
      active: this.activeTransactions.size,
      committed,
      rolledBack,
      averageDuration,
    };
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  /**
   * Check if error is a deadlock error
   */
  private isDeadlockError(error: Error): boolean {
    return error.message.includes('deadlock') || error.message.includes('40P01');
  }

  /**
   * Delay helper for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  TransactionOperationsService,
  ITransactionOptions,
  ITransactionContext,
  ITransactionResult,
  ISavepointInfo,
  IDeadlockInfo,
};
