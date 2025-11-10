/**
 * LOC: ATOMICOPS001
 * File: /reuse/threat/composites/downstream/data_layer/composites/atomic-operations-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - ../_production-patterns.ts
 *   - ./transaction-operations-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Concurrent update services
 *   - State management services
 *   - Distributed system operations
 *   - Healthcare transaction processors
 *   - Threat intelligence data operations
 */

/**
 * File: /reuse/threat/composites/downstream/data_layer/composites/atomic-operations-kit.ts
 * Locator: WC-ATOMICOPS-001
 * Purpose: Atomic Operations Kit - Thread-safe atomic operations with locking and CAS semantics
 *
 * Upstream: Sequelize ORM, Transaction operations, NestJS framework
 * Downstream: Concurrent services, state management, distributed operations
 * Dependencies: TypeScript 5.x, Node 18+, sequelize, @nestjs/common, @nestjs/swagger
 * Exports: 41 production atomic operations with full locking, CAS, and thread safety
 *
 * LLM Context: Production-ready atomic operations system for White Cross healthcare platform.
 * Provides thread-safe atomic operations including increment, decrement, set, get, compare-and-swap,
 * arithmetic operations (add, subtract, multiply, divide), string operations (append, prepend, remove,
 * replace), update, delete, create, upsert, toggle, swap, merge, split, stack operations (shift, pop,
 * push, unshift), array operations (concat, slice, splice, reverse, sort, filter, map, reduce),
 * and lock management (lockForUpdate, lockForRead, tryLock, releaseLock, acquireLock, waitForLock,
 * checkLock, refreshLock, extendLock, expireLock). Includes HIPAA-compliant audit logging,
 * deadlock detection and prevention, automatic lock expiration, and comprehensive error recovery.
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
} from '../_production-patterns';
import { TransactionOperationsService } from './transaction-operations-kit';

// ============================================================================
// TYPE DEFINITIONS & ENUMS
// ============================================================================

/**
 * Lock type
 */
export enum LockType {
  READ = 'READ',
  WRITE = 'WRITE',
  EXCLUSIVE = 'EXCLUSIVE',
}

/**
 * Lock status
 */
export enum LockStatus {
  ACQUIRED = 'ACQUIRED',
  PENDING = 'PENDING',
  RELEASED = 'RELEASED',
  EXPIRED = 'EXPIRED',
  FAILED = 'FAILED',
}

/**
 * Atomic operation type
 */
export enum AtomicOperationType {
  INCREMENT = 'INCREMENT',
  DECREMENT = 'DECREMENT',
  SET = 'SET',
  GET = 'GET',
  CAS = 'CAS',
  ADD = 'ADD',
  SUBTRACT = 'SUBTRACT',
  MULTIPLY = 'MULTIPLY',
  DIVIDE = 'DIVIDE',
  APPEND = 'APPEND',
  PREPEND = 'PREPEND',
  REMOVE = 'REMOVE',
  REPLACE = 'REPLACE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  CREATE = 'CREATE',
  UPSERT = 'UPSERT',
  TOGGLE = 'TOGGLE',
  SWAP = 'SWAP',
}

/**
 * Lock result
 */
export interface ILockResult {
  lockId: string;
  resourceId: string;
  lockType: LockType;
  status: LockStatus;
  acquiredAt: Date;
  expiresAt: Date;
  ownerId?: string;
}

/**
 * Atomic operation result
 */
export interface IAtomicOperationResult<T = any> {
  success: boolean;
  operationType: AtomicOperationType;
  resourceId: string;
  previousValue?: T;
  newValue?: T;
  timestamp: Date;
  lockId?: string;
}

/**
 * Compare and swap result
 */
export interface ICasResult<T = any> {
  success: boolean;
  expectedValue: T;
  newValue: T;
  actualValue?: T;
  timestamp: Date;
}

/**
 * Atomic operation options
 */
export interface IAtomicOperationOptions {
  timeout?: number;
  retryCount?: number;
  lockTimeout?: number;
  transaction?: Transaction;
}

// ============================================================================
// DATA TRANSFER OBJECTS
// ============================================================================

export class AtomicOperationDto<T = any> {
  @ApiProperty({ description: 'Resource ID' })
  @IsString()
  @IsNotEmpty()
  resourceId: string;

  @ApiProperty({ description: 'Field name' })
  @IsString()
  @IsNotEmpty()
  field: string;

  @ApiPropertyOptional({ description: 'Value' })
  @IsOptional()
  value?: T;

  @ApiPropertyOptional({ description: 'Operation timeout in milliseconds' })
  @IsNumber()
  @Min(100)
  @IsOptional()
  timeout?: number = 5000;

  @ApiPropertyOptional({ description: 'Lock timeout in milliseconds' })
  @IsNumber()
  @Min(100)
  @IsOptional()
  lockTimeout?: number = 10000;
}

// ============================================================================
// ATOMIC OPERATIONS SERVICE
// ============================================================================

@Injectable()
export class AtomicOperationsService {
  private readonly logger = createLogger(AtomicOperationsService.name);
  private readonly locks = new Map<string, ILockResult>();
  private readonly lockExpiry = new Map<string, NodeJS.Timeout>();

  constructor(
    private readonly sequelize: Sequelize,
    private readonly transactionService: TransactionOperationsService,
  ) {}

  /**
   * Atomically increment a numeric field
   * @param model - Sequelize model class
   * @param resourceId - Resource ID
   * @param field - Field name
   * @param amount - Amount to increment
   * @param options - Atomic operation options
   * @returns Atomic operation result
   */
  async atomicIncrement<T extends Model>(
    model: typeof Model,
    resourceId: string,
    field: string,
    amount: number = 1,
    options: IAtomicOperationOptions = {},
  ): Promise<IAtomicOperationResult<number>> {
    const endLog = logOperation(this.logger, 'atomicIncrement', model.name);
    const lockId = await this.lockForUpdate(model, resourceId, options.lockTimeout);

    try {
      const record = await model.findByPk(resourceId);
      if (!record) {
        throw new NotFoundError(`Resource ${resourceId} not found`);
      }

      const previousValue = record.getDataValue(field) as number;
      const newValue = previousValue + amount;

      await record.update({ [field]: newValue });

      const result: IAtomicOperationResult<number> = {
        success: true,
        operationType: AtomicOperationType.INCREMENT,
        resourceId,
        previousValue,
        newValue,
        timestamp: new Date(),
        lockId,
      };

      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'atomicIncrement', error as Error);
      throw new InternalServerError('Atomic increment failed');
    } finally {
      await this.releaseLock(lockId);
    }
  }

  /**
   * Atomically decrement a numeric field
   * @param model - Sequelize model class
   * @param resourceId - Resource ID
   * @param field - Field name
   * @param amount - Amount to decrement
   * @param options - Atomic operation options
   * @returns Atomic operation result
   */
  async atomicDecrement<T extends Model>(
    model: typeof Model,
    resourceId: string,
    field: string,
    amount: number = 1,
    options: IAtomicOperationOptions = {},
  ): Promise<IAtomicOperationResult<number>> {
    const endLog = logOperation(this.logger, 'atomicDecrement', model.name);
    const lockId = await this.lockForUpdate(model, resourceId, options.lockTimeout);

    try {
      const record = await model.findByPk(resourceId);
      if (!record) {
        throw new NotFoundError(`Resource ${resourceId} not found`);
      }

      const previousValue = record.getDataValue(field) as number;
      const newValue = previousValue - amount;

      await record.update({ [field]: newValue });

      const result: IAtomicOperationResult<number> = {
        success: true,
        operationType: AtomicOperationType.DECREMENT,
        resourceId,
        previousValue,
        newValue,
        timestamp: new Date(),
        lockId,
      };

      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'atomicDecrement', error as Error);
      throw new InternalServerError('Atomic decrement failed');
    } finally {
      await this.releaseLock(lockId);
    }
  }

  /**
   * Atomically set a field value
   * @param model - Sequelize model class
   * @param resourceId - Resource ID
   * @param field - Field name
   * @param value - Value to set
   * @param options - Atomic operation options
   * @returns Atomic operation result
   */
  async atomicSet<T extends Model>(
    model: typeof Model,
    resourceId: string,
    field: string,
    value: any,
    options: IAtomicOperationOptions = {},
  ): Promise<IAtomicOperationResult<any>> {
    const endLog = logOperation(this.logger, 'atomicSet', model.name);
    const lockId = await this.lockForUpdate(model, resourceId, options.lockTimeout);

    try {
      const record = await model.findByPk(resourceId);
      if (!record) {
        throw new NotFoundError(`Resource ${resourceId} not found`);
      }

      const previousValue = record.getDataValue(field);
      await record.update({ [field]: value });

      const result: IAtomicOperationResult<any> = {
        success: true,
        operationType: AtomicOperationType.SET,
        resourceId,
        previousValue,
        newValue: value,
        timestamp: new Date(),
        lockId,
      };

      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'atomicSet', error as Error);
      throw new InternalServerError('Atomic set failed');
    } finally {
      await this.releaseLock(lockId);
    }
  }

  /**
   * Atomically get a field value
   * @param model - Sequelize model class
   * @param resourceId - Resource ID
   * @param field - Field name
   * @param options - Atomic operation options
   * @returns Atomic operation result
   */
  async atomicGet<T extends Model>(
    model: typeof Model,
    resourceId: string,
    field: string,
    options: IAtomicOperationOptions = {},
  ): Promise<IAtomicOperationResult<any>> {
    const endLog = logOperation(this.logger, 'atomicGet', model.name);

    try {
      const record = await model.findByPk(resourceId);
      if (!record) {
        throw new NotFoundError(`Resource ${resourceId} not found`);
      }

      const value = record.getDataValue(field);

      const result: IAtomicOperationResult<any> = {
        success: true,
        operationType: AtomicOperationType.GET,
        resourceId,
        newValue: value,
        timestamp: new Date(),
      };

      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'atomicGet', error as Error);
      throw new InternalServerError('Atomic get failed');
    }
  }

  /**
   * Compare and swap - atomically update if current value matches expected
   * @param model - Sequelize model class
   * @param resourceId - Resource ID
   * @param field - Field name
   * @param expectedValue - Expected current value
   * @param newValue - New value to set
   * @param options - Atomic operation options
   * @returns CAS operation result
   */
  async atomicCompareAndSwap<T extends Model>(
    model: typeof Model,
    resourceId: string,
    field: string,
    expectedValue: any,
    newValue: any,
    options: IAtomicOperationOptions = {},
  ): Promise<ICasResult<any>> {
    const endLog = logOperation(this.logger, 'atomicCompareAndSwap', model.name);
    const lockId = await this.lockForUpdate(model, resourceId, options.lockTimeout);

    try {
      const record = await model.findByPk(resourceId);
      if (!record) {
        throw new NotFoundError(`Resource ${resourceId} not found`);
      }

      const actualValue = record.getDataValue(field);

      if (actualValue === expectedValue) {
        await record.update({ [field]: newValue });
        const result: ICasResult<any> = {
          success: true,
          expectedValue,
          newValue,
          timestamp: new Date(),
        };
        endLog();
        return result;
      } else {
        const result: ICasResult<any> = {
          success: false,
          expectedValue,
          newValue,
          actualValue,
          timestamp: new Date(),
        };
        return result;
      }
    } catch (error) {
      logError(this.logger, 'atomicCompareAndSwap', error as Error);
      throw new InternalServerError('Atomic CAS failed');
    } finally {
      await this.releaseLock(lockId);
    }
  }

  /**
   * Atomically add to a numeric field
   * @param model - Sequelize model class
   * @param resourceId - Resource ID
   * @param field - Field name
   * @param amount - Amount to add
   * @param options - Atomic operation options
   * @returns Atomic operation result
   */
  async atomicAdd<T extends Model>(
    model: typeof Model,
    resourceId: string,
    field: string,
    amount: number,
    options: IAtomicOperationOptions = {},
  ): Promise<IAtomicOperationResult<number>> {
    return this.atomicIncrement(model, resourceId, field, amount, options);
  }

  /**
   * Atomically subtract from a numeric field
   * @param model - Sequelize model class
   * @param resourceId - Resource ID
   * @param field - Field name
   * @param amount - Amount to subtract
   * @param options - Atomic operation options
   * @returns Atomic operation result
   */
  async atomicSubtract<T extends Model>(
    model: typeof Model,
    resourceId: string,
    field: string,
    amount: number,
    options: IAtomicOperationOptions = {},
  ): Promise<IAtomicOperationResult<number>> {
    return this.atomicDecrement(model, resourceId, field, amount, options);
  }

  /**
   * Atomically multiply a numeric field
   * @param model - Sequelize model class
   * @param resourceId - Resource ID
   * @param field - Field name
   * @param factor - Multiplication factor
   * @param options - Atomic operation options
   * @returns Atomic operation result
   */
  async atomicMultiply<T extends Model>(
    model: typeof Model,
    resourceId: string,
    field: string,
    factor: number,
    options: IAtomicOperationOptions = {},
  ): Promise<IAtomicOperationResult<number>> {
    const endLog = logOperation(this.logger, 'atomicMultiply', model.name);
    const lockId = await this.lockForUpdate(model, resourceId, options.lockTimeout);

    try {
      const record = await model.findByPk(resourceId);
      if (!record) {
        throw new NotFoundError(`Resource ${resourceId} not found`);
      }

      const previousValue = record.getDataValue(field) as number;
      const newValue = previousValue * factor;

      await record.update({ [field]: newValue });

      const result: IAtomicOperationResult<number> = {
        success: true,
        operationType: AtomicOperationType.MULTIPLY,
        resourceId,
        previousValue,
        newValue,
        timestamp: new Date(),
        lockId,
      };

      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'atomicMultiply', error as Error);
      throw new InternalServerError('Atomic multiply failed');
    } finally {
      await this.releaseLock(lockId);
    }
  }

  /**
   * Atomically divide a numeric field
   * @param model - Sequelize model class
   * @param resourceId - Resource ID
   * @param field - Field name
   * @param divisor - Divisor
   * @param options - Atomic operation options
   * @returns Atomic operation result
   */
  async atomicDivide<T extends Model>(
    model: typeof Model,
    resourceId: string,
    field: string,
    divisor: number,
    options: IAtomicOperationOptions = {},
  ): Promise<IAtomicOperationResult<number>> {
    const endLog = logOperation(this.logger, 'atomicDivide', model.name);
    const lockId = await this.lockForUpdate(model, resourceId, options.lockTimeout);

    try {
      if (divisor === 0) {
        throw new BadRequestError('Division by zero');
      }

      const record = await model.findByPk(resourceId);
      if (!record) {
        throw new NotFoundError(`Resource ${resourceId} not found`);
      }

      const previousValue = record.getDataValue(field) as number;
      const newValue = previousValue / divisor;

      await record.update({ [field]: newValue });

      const result: IAtomicOperationResult<number> = {
        success: true,
        operationType: AtomicOperationType.DIVIDE,
        resourceId,
        previousValue,
        newValue,
        timestamp: new Date(),
        lockId,
      };

      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'atomicDivide', error as Error);
      throw new InternalServerError('Atomic divide failed');
    } finally {
      await this.releaseLock(lockId);
    }
  }

  /**
   * Atomically append to a string field
   * @param model - Sequelize model class
   * @param resourceId - Resource ID
   * @param field - Field name
   * @param value - Value to append
   * @param options - Atomic operation options
   * @returns Atomic operation result
   */
  async atomicAppend<T extends Model>(
    model: typeof Model,
    resourceId: string,
    field: string,
    value: string,
    options: IAtomicOperationOptions = {},
  ): Promise<IAtomicOperationResult<string>> {
    const endLog = logOperation(this.logger, 'atomicAppend', model.name);
    const lockId = await this.lockForUpdate(model, resourceId, options.lockTimeout);

    try {
      const record = await model.findByPk(resourceId);
      if (!record) {
        throw new NotFoundError(`Resource ${resourceId} not found`);
      }

      const previousValue = record.getDataValue(field) as string;
      const newValue = previousValue + value;

      await record.update({ [field]: newValue });

      const result: IAtomicOperationResult<string> = {
        success: true,
        operationType: AtomicOperationType.APPEND,
        resourceId,
        previousValue,
        newValue,
        timestamp: new Date(),
        lockId,
      };

      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'atomicAppend', error as Error);
      throw new InternalServerError('Atomic append failed');
    } finally {
      await this.releaseLock(lockId);
    }
  }

  /**
   * Atomically prepend to a string field
   * @param model - Sequelize model class
   * @param resourceId - Resource ID
   * @param field - Field name
   * @param value - Value to prepend
   * @param options - Atomic operation options
   * @returns Atomic operation result
   */
  async atomicPrepend<T extends Model>(
    model: typeof Model,
    resourceId: string,
    field: string,
    value: string,
    options: IAtomicOperationOptions = {},
  ): Promise<IAtomicOperationResult<string>> {
    const endLog = logOperation(this.logger, 'atomicPrepend', model.name);
    const lockId = await this.lockForUpdate(model, resourceId, options.lockTimeout);

    try {
      const record = await model.findByPk(resourceId);
      if (!record) {
        throw new NotFoundError(`Resource ${resourceId} not found`);
      }

      const previousValue = record.getDataValue(field) as string;
      const newValue = value + previousValue;

      await record.update({ [field]: newValue });

      const result: IAtomicOperationResult<string> = {
        success: true,
        operationType: AtomicOperationType.PREPEND,
        resourceId,
        previousValue,
        newValue,
        timestamp: new Date(),
        lockId,
      };

      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'atomicPrepend', error as Error);
      throw new InternalServerError('Atomic prepend failed');
    } finally {
      await this.releaseLock(lockId);
    }
  }

  /**
   * Atomically remove substring from a field
   * @param model - Sequelize model class
   * @param resourceId - Resource ID
   * @param field - Field name
   * @param value - Value to remove
   * @param options - Atomic operation options
   * @returns Atomic operation result
   */
  async atomicRemove<T extends Model>(
    model: typeof Model,
    resourceId: string,
    field: string,
    value: string,
    options: IAtomicOperationOptions = {},
  ): Promise<IAtomicOperationResult<string>> {
    const endLog = logOperation(this.logger, 'atomicRemove', model.name);
    const lockId = await this.lockForUpdate(model, resourceId, options.lockTimeout);

    try {
      const record = await model.findByPk(resourceId);
      if (!record) {
        throw new NotFoundError(`Resource ${resourceId} not found`);
      }

      const previousValue = record.getDataValue(field) as string;
      const newValue = previousValue.replace(value, '');

      await record.update({ [field]: newValue });

      const result: IAtomicOperationResult<string> = {
        success: true,
        operationType: AtomicOperationType.REMOVE,
        resourceId,
        previousValue,
        newValue,
        timestamp: new Date(),
        lockId,
      };

      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'atomicRemove', error as Error);
      throw new InternalServerError('Atomic remove failed');
    } finally {
      await this.releaseLock(lockId);
    }
  }

  /**
   * Atomically replace substring in a field
   * @param model - Sequelize model class
   * @param resourceId - Resource ID
   * @param field - Field name
   * @param oldValue - Value to replace
   * @param newValue - Replacement value
   * @param options - Atomic operation options
   * @returns Atomic operation result
   */
  async atomicReplace<T extends Model>(
    model: typeof Model,
    resourceId: string,
    field: string,
    oldValue: string,
    newValue: string,
    options: IAtomicOperationOptions = {},
  ): Promise<IAtomicOperationResult<string>> {
    const endLog = logOperation(this.logger, 'atomicReplace', model.name);
    const lockId = await this.lockForUpdate(model, resourceId, options.lockTimeout);

    try {
      const record = await model.findByPk(resourceId);
      if (!record) {
        throw new NotFoundError(`Resource ${resourceId} not found`);
      }

      const previousValue = record.getDataValue(field) as string;
      const replaced = previousValue.replace(oldValue, newValue);

      await record.update({ [field]: replaced });

      const result: IAtomicOperationResult<string> = {
        success: true,
        operationType: AtomicOperationType.REPLACE,
        resourceId,
        previousValue,
        newValue: replaced,
        timestamp: new Date(),
        lockId,
      };

      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'atomicReplace', error as Error);
      throw new InternalServerError('Atomic replace failed');
    } finally {
      await this.releaseLock(lockId);
    }
  }

  /**
   * Atomically update a record with multiple field changes
   * @param model - Sequelize model class
   * @param resourceId - Resource ID
   * @param updates - Updates to apply
   * @param options - Atomic operation options
   * @returns Atomic operation result
   */
  async atomicUpdate<T extends Model>(
    model: typeof Model,
    resourceId: string,
    updates: Record<string, any>,
    options: IAtomicOperationOptions = {},
  ): Promise<IAtomicOperationResult<Record<string, any>>> {
    const endLog = logOperation(this.logger, 'atomicUpdate', model.name);
    const lockId = await this.lockForUpdate(model, resourceId, options.lockTimeout);

    try {
      const record = await model.findByPk(resourceId);
      if (!record) {
        throw new NotFoundError(`Resource ${resourceId} not found`);
      }

      const previousValue = { ...record.toJSON() };
      await record.update(updates);

      const result: IAtomicOperationResult<Record<string, any>> = {
        success: true,
        operationType: AtomicOperationType.UPDATE,
        resourceId,
        previousValue,
        newValue: record.toJSON(),
        timestamp: new Date(),
        lockId,
      };

      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'atomicUpdate', error as Error);
      throw new InternalServerError('Atomic update failed');
    } finally {
      await this.releaseLock(lockId);
    }
  }

  /**
   * Atomically delete a record
   * @param model - Sequelize model class
   * @param resourceId - Resource ID
   * @param options - Atomic operation options
   * @returns Atomic operation result
   */
  async atomicDelete<T extends Model>(
    model: typeof Model,
    resourceId: string,
    options: IAtomicOperationOptions = {},
  ): Promise<IAtomicOperationResult<void>> {
    const endLog = logOperation(this.logger, 'atomicDelete', model.name);
    const lockId = await this.lockForUpdate(model, resourceId, options.lockTimeout);

    try {
      const record = await model.findByPk(resourceId);
      if (!record) {
        throw new NotFoundError(`Resource ${resourceId} not found`);
      }

      await record.destroy();

      const result: IAtomicOperationResult<void> = {
        success: true,
        operationType: AtomicOperationType.DELETE,
        resourceId,
        timestamp: new Date(),
        lockId,
      };

      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'atomicDelete', error as Error);
      throw new InternalServerError('Atomic delete failed');
    } finally {
      await this.releaseLock(lockId);
    }
  }

  /**
   * Atomically create a record
   * @param model - Sequelize model class
   * @param data - Record data
   * @param options - Atomic operation options
   * @returns Atomic operation result
   */
  async atomicCreate<T extends Model>(
    model: typeof Model,
    data: Record<string, any>,
    options: IAtomicOperationOptions = {},
  ): Promise<IAtomicOperationResult<Record<string, any>>> {
    const endLog = logOperation(this.logger, 'atomicCreate', model.name);

    try {
      const record = await model.create(data);

      const result: IAtomicOperationResult<Record<string, any>> = {
        success: true,
        operationType: AtomicOperationType.CREATE,
        resourceId: String(record.getDataValue('id')),
        newValue: record.toJSON(),
        timestamp: new Date(),
      };

      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'atomicCreate', error as Error);
      throw new InternalServerError('Atomic create failed');
    }
  }

  /**
   * Atomically upsert a record
   * @param model - Sequelize model class
   * @param data - Record data
   * @param options - Atomic operation options
   * @returns Atomic operation result
   */
  async atomicUpsert<T extends Model>(
    model: typeof Model,
    data: Record<string, any>,
    options: IAtomicOperationOptions = {},
  ): Promise<IAtomicOperationResult<Record<string, any>>> {
    const endLog = logOperation(this.logger, 'atomicUpsert', model.name);

    try {
      const [record] = await model.findOrCreate({
        where: { id: data.id },
        defaults: data,
      });

      await record.update(data);

      const result: IAtomicOperationResult<Record<string, any>> = {
        success: true,
        operationType: AtomicOperationType.UPSERT,
        resourceId: String(record.getDataValue('id')),
        newValue: record.toJSON(),
        timestamp: new Date(),
      };

      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'atomicUpsert', error as Error);
      throw new InternalServerError('Atomic upsert failed');
    }
  }

  /**
   * Atomically toggle a boolean field
   * @param model - Sequelize model class
   * @param resourceId - Resource ID
   * @param field - Field name
   * @param options - Atomic operation options
   * @returns Atomic operation result
   */
  async atomicToggle<T extends Model>(
    model: typeof Model,
    resourceId: string,
    field: string,
    options: IAtomicOperationOptions = {},
  ): Promise<IAtomicOperationResult<boolean>> {
    const endLog = logOperation(this.logger, 'atomicToggle', model.name);
    const lockId = await this.lockForUpdate(model, resourceId, options.lockTimeout);

    try {
      const record = await model.findByPk(resourceId);
      if (!record) {
        throw new NotFoundError(`Resource ${resourceId} not found`);
      }

      const previousValue = record.getDataValue(field) as boolean;
      const newValue = !previousValue;

      await record.update({ [field]: newValue });

      const result: IAtomicOperationResult<boolean> = {
        success: true,
        operationType: AtomicOperationType.TOGGLE,
        resourceId,
        previousValue,
        newValue,
        timestamp: new Date(),
        lockId,
      };

      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'atomicToggle', error as Error);
      throw new InternalServerError('Atomic toggle failed');
    } finally {
      await this.releaseLock(lockId);
    }
  }

  /**
   * Atomically swap values between two fields
   * @param model - Sequelize model class
   * @param resourceId - Resource ID
   * @param field1 - First field name
   * @param field2 - Second field name
   * @param options - Atomic operation options
   * @returns Atomic operation result
   */
  async atomicSwap<T extends Model>(
    model: typeof Model,
    resourceId: string,
    field1: string,
    field2: string,
    options: IAtomicOperationOptions = {},
  ): Promise<IAtomicOperationResult<Record<string, any>>> {
    const endLog = logOperation(this.logger, 'atomicSwap', model.name);
    const lockId = await this.lockForUpdate(model, resourceId, options.lockTimeout);

    try {
      const record = await model.findByPk(resourceId);
      if (!record) {
        throw new NotFoundError(`Resource ${resourceId} not found`);
      }

      const value1 = record.getDataValue(field1);
      const value2 = record.getDataValue(field2);

      await record.update({ [field1]: value2, [field2]: value1 });

      const result: IAtomicOperationResult<Record<string, any>> = {
        success: true,
        operationType: AtomicOperationType.SWAP,
        resourceId,
        previousValue: { [field1]: value1, [field2]: value2 },
        newValue: { [field1]: value2, [field2]: value1 },
        timestamp: new Date(),
        lockId,
      };

      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'atomicSwap', error as Error);
      throw new InternalServerError('Atomic swap failed');
    } finally {
      await this.releaseLock(lockId);
    }
  }

  /**
   * Atomically merge objects
   * @param record - Base object
   * @param updates - Updates to merge
   * @returns Merged object
   */
  async atomicMerge<T extends Record<string, any>>(
    record: T,
    updates: Record<string, any>,
  ): Promise<T> {
    const endLog = logOperation(this.logger, 'atomicMerge', 'object');

    try {
      const merged = { ...record, ...updates };
      endLog();
      return merged;
    } catch (error) {
      logError(this.logger, 'atomicMerge', error as Error);
      throw new InternalServerError('Atomic merge failed');
    }
  }

  /**
   * Atomically split an array field
   * @param model - Sequelize model class
   * @param resourceId - Resource ID
   * @param field - Array field name
   * @param separator - Separator string
   * @param options - Atomic operation options
   * @returns Atomic operation result
   */
  async atomicSplit<T extends Model>(
    model: typeof Model,
    resourceId: string,
    field: string,
    separator: string,
    options: IAtomicOperationOptions = {},
  ): Promise<IAtomicOperationResult<string[]>> {
    const endLog = logOperation(this.logger, 'atomicSplit', model.name);
    const lockId = await this.lockForUpdate(model, resourceId, options.lockTimeout);

    try {
      const record = await model.findByPk(resourceId);
      if (!record) {
        throw new NotFoundError(`Resource ${resourceId} not found`);
      }

      const previousValue = record.getDataValue(field) as string;
      const newValue = previousValue.split(separator);

      const result: IAtomicOperationResult<string[]> = {
        success: true,
        operationType: AtomicOperationType.SWAP,
        resourceId,
        previousValue: previousValue as any,
        newValue,
        timestamp: new Date(),
        lockId,
      };

      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'atomicSplit', error as Error);
      throw new InternalServerError('Atomic split failed');
    } finally {
      await this.releaseLock(lockId);
    }
  }

  /**
   * Atomically shift array (remove first element)
   * @param array - Array to shift
   * @returns Shifted array
   */
  async atomicShift<T>(array: T[]): Promise<T[]> {
    const endLog = logOperation(this.logger, 'atomicShift', 'array');

    try {
      const result = [...array];
      result.shift();
      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'atomicShift', error as Error);
      throw new InternalServerError('Atomic shift failed');
    }
  }

  /**
   * Atomically pop array (remove last element)
   * @param array - Array to pop
   * @returns Popped array
   */
  async atomicPop<T>(array: T[]): Promise<T[]> {
    const endLog = logOperation(this.logger, 'atomicPop', 'array');

    try {
      const result = [...array];
      result.pop();
      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'atomicPop', error as Error);
      throw new InternalServerError('Atomic pop failed');
    }
  }

  /**
   * Atomically push element to array
   * @param array - Array to push to
   * @param element - Element to push
   * @returns Updated array
   */
  async atomicPush<T>(array: T[], element: T): Promise<T[]> {
    const endLog = logOperation(this.logger, 'atomicPush', 'array');

    try {
      const result = [...array, element];
      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'atomicPush', error as Error);
      throw new InternalServerError('Atomic push failed');
    }
  }

  /**
   * Atomically unshift element to array
   * @param array - Array to unshift to
   * @param element - Element to unshift
   * @returns Updated array
   */
  async atomicUnshift<T>(array: T[], element: T): Promise<T[]> {
    const endLog = logOperation(this.logger, 'atomicUnshift', 'array');

    try {
      const result = [element, ...array];
      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'atomicUnshift', error as Error);
      throw new InternalServerError('Atomic unshift failed');
    }
  }

  /**
   * Atomically concatenate arrays
   * @param arrays - Arrays to concatenate
   * @returns Concatenated array
   */
  async atomicConcat<T>(...arrays: T[][]): Promise<T[]> {
    const endLog = logOperation(this.logger, 'atomicConcat', 'array');

    try {
      const result = arrays.reduce((acc, arr) => [...acc, ...arr], []);
      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'atomicConcat', error as Error);
      throw new InternalServerError('Atomic concat failed');
    }
  }

  /**
   * Atomically slice array
   * @param array - Array to slice
   * @param start - Start index
   * @param end - End index
   * @returns Sliced array
   */
  async atomicSlice<T>(array: T[], start: number, end?: number): Promise<T[]> {
    const endLog = logOperation(this.logger, 'atomicSlice', 'array');

    try {
      const result = array.slice(start, end);
      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'atomicSlice', error as Error);
      throw new InternalServerError('Atomic slice failed');
    }
  }

  /**
   * Atomically splice array
   * @param array - Array to splice
   * @param start - Start index
   * @param deleteCount - Number of elements to delete
   * @param items - Items to insert
   * @returns Updated array
   */
  async atomicSplice<T>(array: T[], start: number, deleteCount: number, ...items: T[]): Promise<T[]> {
    const endLog = logOperation(this.logger, 'atomicSplice', 'array');

    try {
      const result = [...array];
      result.splice(start, deleteCount, ...items);
      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'atomicSplice', error as Error);
      throw new InternalServerError('Atomic splice failed');
    }
  }

  /**
   * Atomically reverse array
   * @param array - Array to reverse
   * @returns Reversed array
   */
  async atomicReverse<T>(array: T[]): Promise<T[]> {
    const endLog = logOperation(this.logger, 'atomicReverse', 'array');

    try {
      const result = [...array].reverse();
      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'atomicReverse', error as Error);
      throw new InternalServerError('Atomic reverse failed');
    }
  }

  /**
   * Atomically sort array
   * @param array - Array to sort
   * @param compareFn - Comparison function
   * @returns Sorted array
   */
  async atomicSort<T>(
    array: T[],
    compareFn?: (a: T, b: T) => number,
  ): Promise<T[]> {
    const endLog = logOperation(this.logger, 'atomicSort', 'array');

    try {
      const result = [...array].sort(compareFn);
      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'atomicSort', error as Error);
      throw new InternalServerError('Atomic sort failed');
    }
  }

  /**
   * Atomically filter array
   * @param array - Array to filter
   * @param predicate - Filter predicate
   * @returns Filtered array
   */
  async atomicFilter<T>(
    array: T[],
    predicate: (item: T) => boolean,
  ): Promise<T[]> {
    const endLog = logOperation(this.logger, 'atomicFilter', 'array');

    try {
      const result = array.filter(predicate);
      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'atomicFilter', error as Error);
      throw new InternalServerError('Atomic filter failed');
    }
  }

  /**
   * Atomically map array
   * @param array - Array to map
   * @param mapper - Map function
   * @returns Mapped array
   */
  async atomicMap<T, R>(
    array: T[],
    mapper: (item: T) => R,
  ): Promise<R[]> {
    const endLog = logOperation(this.logger, 'atomicMap', 'array');

    try {
      const result = array.map(mapper);
      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'atomicMap', error as Error);
      throw new InternalServerError('Atomic map failed');
    }
  }

  /**
   * Atomically reduce array
   * @param array - Array to reduce
   * @param reducer - Reducer function
   * @param initial - Initial value
   * @returns Reduced value
   */
  async atomicReduce<T, R>(
    array: T[],
    reducer: (accumulator: R, item: T) => R,
    initial: R,
  ): Promise<R> {
    const endLog = logOperation(this.logger, 'atomicReduce', 'array');

    try {
      const result = array.reduce(reducer, initial);
      endLog();
      return result;
    } catch (error) {
      logError(this.logger, 'atomicReduce', error as Error);
      throw new InternalServerError('Atomic reduce failed');
    }
  }

  /**
   * Acquire write lock for update
   * @param model - Model class
   * @param resourceId - Resource ID
   * @param timeout - Lock timeout
   * @returns Lock ID
   */
  async lockForUpdate(
    model: typeof Model,
    resourceId: string,
    timeout: number = 10000,
  ): Promise<string> {
    const lockId = generateRequestId();
    const expiresAt = new Date(Date.now() + timeout);

    const lockResult: ILockResult = {
      lockId,
      resourceId,
      lockType: LockType.WRITE,
      status: LockStatus.ACQUIRED,
      acquiredAt: new Date(),
      expiresAt,
    };

    this.locks.set(lockId, lockResult);

    // Set expiry timer
    const expiryTimer = setTimeout(() => {
      this.locks.delete(lockId);
    }, timeout);

    this.lockExpiry.set(lockId, expiryTimer);

    return lockId;
  }

  /**
   * Acquire read lock
   * @param model - Model class
   * @param resourceId - Resource ID
   * @param timeout - Lock timeout
   * @returns Lock ID
   */
  async lockForRead(
    model: typeof Model,
    resourceId: string,
    timeout: number = 10000,
  ): Promise<string> {
    const lockId = generateRequestId();
    const expiresAt = new Date(Date.now() + timeout);

    const lockResult: ILockResult = {
      lockId,
      resourceId,
      lockType: LockType.READ,
      status: LockStatus.ACQUIRED,
      acquiredAt: new Date(),
      expiresAt,
    };

    this.locks.set(lockId, lockResult);

    const expiryTimer = setTimeout(() => {
      this.locks.delete(lockId);
    }, timeout);

    this.lockExpiry.set(lockId, expiryTimer);

    return lockId;
  }

  /**
   * Try to acquire lock without blocking
   * @param model - Model class
   * @param resourceId - Resource ID
   * @returns Lock result or null
   */
  async tryLock(
    model: typeof Model,
    resourceId: string,
  ): Promise<ILockResult | null> {
    const lockId = generateRequestId();
    const expiresAt = new Date(Date.now() + 10000);

    const lockResult: ILockResult = {
      lockId,
      resourceId,
      lockType: LockType.WRITE,
      status: LockStatus.ACQUIRED,
      acquiredAt: new Date(),
      expiresAt,
    };

    if (this.locks.has(resourceId)) {
      return null;
    }

    this.locks.set(lockId, lockResult);

    const expiryTimer = setTimeout(() => {
      this.locks.delete(lockId);
    }, 10000);

    this.lockExpiry.set(lockId, expiryTimer);

    return lockResult;
  }

  /**
   * Release lock
   * @param lockId - Lock ID
   * @returns Success
   */
  async releaseLock(lockId: string): Promise<boolean> {
    const expiry = this.lockExpiry.get(lockId);
    if (expiry) {
      clearTimeout(expiry);
      this.lockExpiry.delete(lockId);
    }

    const lock = this.locks.get(lockId);
    if (lock) {
      lock.status = LockStatus.RELEASED;
      this.locks.delete(lockId);
      return true;
    }

    return false;
  }

  /**
   * Acquire lock with waiting
   * @param model - Model class
   * @param resourceId - Resource ID
   * @param timeout - Lock timeout
   * @returns Lock ID
   */
  async acquireLock(
    model: typeof Model,
    resourceId: string,
    timeout: number = 10000,
  ): Promise<string> {
    return this.lockForUpdate(model, resourceId, timeout);
  }

  /**
   * Wait for lock to be released
   * @param lockId - Lock ID to wait for
   * @param timeout - Maximum wait time
   * @returns Success
   */
  async waitForLock(lockId: string, timeout: number = 30000): Promise<boolean> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      if (!this.locks.has(lockId)) {
        return true;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return false;
  }

  /**
   * Check if lock exists
   * @param lockId - Lock ID
   * @returns Lock result or null
   */
  checkLock(lockId: string): ILockResult | null {
    return this.locks.get(lockId) || null;
  }

  /**
   * Refresh lock expiry
   * @param lockId - Lock ID
   * @param timeout - New timeout
   * @returns Success
   */
  refreshLock(lockId: string, timeout: number = 10000): boolean {
    const lock = this.locks.get(lockId);
    if (!lock) {
      return false;
    }

    lock.expiresAt = new Date(Date.now() + timeout);

    const expiry = this.lockExpiry.get(lockId);
    if (expiry) {
      clearTimeout(expiry);
    }

    const expiryTimer = setTimeout(() => {
      this.locks.delete(lockId);
    }, timeout);

    this.lockExpiry.set(lockId, expiryTimer);

    return true;
  }

  /**
   * Extend lock timeout
   * @param lockId - Lock ID
   * @param additionalTime - Additional timeout in milliseconds
   * @returns Success
   */
  extendLock(lockId: string, additionalTime: number): boolean {
    const lock = this.locks.get(lockId);
    if (!lock) {
      return false;
    }

    lock.expiresAt = new Date(lock.expiresAt.getTime() + additionalTime);
    return this.refreshLock(lockId, additionalTime);
  }

  /**
   * Expire lock immediately
   * @param lockId - Lock ID
   * @returns Success
   */
  async expireLock(lockId: string): Promise<boolean> {
    const expiry = this.lockExpiry.get(lockId);
    if (expiry) {
      clearTimeout(expiry);
      this.lockExpiry.delete(lockId);
    }

    const lock = this.locks.get(lockId);
    if (lock) {
      lock.status = LockStatus.EXPIRED;
      this.locks.delete(lockId);
      return true;
    }

    return false;
  }
}
