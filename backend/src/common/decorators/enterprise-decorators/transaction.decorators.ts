/**
 * Enterprise Transaction Decorators
 *
 * Provides database transaction management with support for
 * nested transactions, rollback strategies, and deadlock handling.
 */

import { Injectable, Inject, SetMetadata } from '@nestjs/common';
import { TransactionOptions } from './types';

/**
 * Metadata key for transaction configuration
 */
export const TRANSACTION_METADATA = 'enterprise:transaction';

/**
 * Transaction manager interface
 */
export interface IEnterpriseTransactionManager {
  beginTransaction(options?: TransactionOptions): Promise<any>;
  commitTransaction(transaction: any): Promise<void>;
  rollbackTransaction(transaction: any): Promise<void>;
  executeInTransaction<T>(
    operation: (transaction: any) => Promise<T>,
    options?: TransactionOptions
  ): Promise<T>;
  isInTransaction(): boolean;
}

/**
 * Sequelize-based transaction manager
 */
@Injectable()
export class SequelizeTransactionManager implements IEnterpriseTransactionManager {
  constructor(
    @Inject('SEQUELIZE') private readonly sequelize: any,
  ) {}

  async beginTransaction(options?: TransactionOptions): Promise<any> {
    const transactionOptions: any = {};

    if (options?.isolationLevel) {
      transactionOptions.isolationLevel = this.mapIsolationLevel(options.isolationLevel);
    }

    return await this.sequelize.transaction(transactionOptions);
  }

  async commitTransaction(transaction: any): Promise<void> {
    await transaction.commit();
  }

  async rollbackTransaction(transaction: any): Promise<void> {
    await transaction.rollback();
  }

  async executeInTransaction<T>(
    operation: (transaction: any) => Promise<T>,
    options?: TransactionOptions
  ): Promise<T> {
    const transaction = await this.beginTransaction(options);

    try {
      const result = await operation(transaction);
      await this.commitTransaction(transaction);
      return result;
    } catch (error) {
      await this.rollbackTransaction(transaction);

      // Retry on deadlock if enabled
      if (options?.retryOnDeadlock && this.isDeadlockError(error)) {
        return await this.retryOperation(operation, options);
      }

      throw error;
    }
  }

  isInTransaction(): boolean {
    // This is a simplified check - in practice, you'd track transaction context
    return false;
  }

  private mapIsolationLevel(level: string): any {
    const levels = {
      'READ_UNCOMMITTED': 'READ_UNCOMMITTED',
      'READ_COMMITTED': 'READ_COMMITTED',
      'REPEATABLE_READ': 'REPEATABLE_READ',
      'SERIALIZABLE': 'SERIALIZABLE'
    };
    return levels[level] || 'READ_COMMITTED';
  }

  private isDeadlockError(error: any): boolean {
    return error?.name === 'SequelizeDatabaseError' &&
           error?.original?.code === 'ER_LOCK_DEADLOCK';
  }

  private async retryOperation<T>(
    operation: (transaction: any) => Promise<T>,
    options: TransactionOptions
  ): Promise<T> {
    const maxRetries = options.maxRetries || 3;
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.executeInTransaction(operation, {
          ...options,
          retryOnDeadlock: false // Prevent infinite recursion
        });
      } catch (error) {
        lastError = error;
        if (!this.isDeadlockError(error) || attempt === maxRetries) {
          break;
        }

        // Exponential backoff
        const delay = Math.pow(2, attempt) * 100;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }
}

/**
 * Transaction decorator for methods
 */
export function Transaction(options: TransactionOptions = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const methodName = `${target.constructor.name}.${propertyKey}`;

    descriptor.value = async function (...args: any[]) {
      const transactionManager = (this as any).transactionManager as IEnterpriseTransactionManager;

      if (!transactionManager) {
        console.warn(`No transaction manager available for ${methodName}`);
        return await originalMethod.apply(this, args);
      }

      // Check if already in a transaction
      if (transactionManager.isInTransaction() && !options.isolationLevel) {
        // Use existing transaction
        return await originalMethod.apply(this, args);
      }

      return await transactionManager.executeInTransaction(
        async (transaction) => {
          // Inject transaction into method context
          const transactionContext = { ...this, transaction };
          return await originalMethod.apply(transactionContext, args);
        },
        options
      );
    };

    SetMetadata(TRANSACTION_METADATA, options)(target, propertyKey, descriptor);
  };
}

/**
 * Nested transaction decorator
 */
export function NestedTransaction(options: TransactionOptions = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const methodName = `${target.constructor.name}.${propertyKey}`;

    descriptor.value = async function (...args: any[]) {
      const transactionManager = (this as any).transactionManager as IEnterpriseTransactionManager;

      if (!transactionManager) {
        return await originalMethod.apply(this, args);
      }

      // Always create a new transaction context, even if nested
      return await transactionManager.executeInTransaction(
        async (transaction) => {
          const transactionContext = { ...this, transaction };
          return await originalMethod.apply(transactionContext, args);
        },
        options
      );
    };

    SetMetadata('enterprise:nested-transaction', options)(target, propertyKey, descriptor);
  };
}

/**
 * Read-only transaction decorator
 */
export function ReadOnlyTransaction() {
  return Transaction({
    isolationLevel: 'READ_COMMITTED'
    // Additional read-only optimizations could be added here
  });
}

/**
 * Transaction timeout decorator
 */
export function TransactionTimeout(timeoutMs: number) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`Transaction timeout after ${timeoutMs}ms`)), timeoutMs);
      });

      return await Promise.race([
        originalMethod.apply(this, args),
        timeoutPromise
      ]);
    };
  };
}

/**
 * Transaction boundary decorator for service methods
 */
export function TransactionBoundary(options: TransactionOptions = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    // This decorator marks a method as a transaction boundary
    // The actual transaction management is handled by the Transaction decorator
    SetMetadata('enterprise:transaction-boundary', options)(target, propertyKey, descriptor);
  };
}