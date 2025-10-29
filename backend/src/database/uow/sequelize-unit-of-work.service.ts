/**
 * Sequelize Unit of Work Implementation
 * Injectable NestJS service for transaction management
 */

import { Injectable, Logger, Inject } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { IUnitOfWork, TransactionOptions } from './unit-of-work.interface';
import { ExecutionContext } from '../types';
import { TransactionIsolationLevel } from '../types/database.enums';
import type { IAuditLogger } from '../interfaces/audit/audit-logger.interface';

@Injectable()
export class SequelizeUnitOfWorkService implements IUnitOfWork {
  private readonly logger = new Logger(SequelizeUnitOfWorkService.name);
  private transaction: Transaction | null = null;

  constructor(
    private readonly sequelize: Sequelize,
    @Inject('IAuditLogger') private readonly auditLogger: IAuditLogger
  ) {}

  async begin(): Promise<void> {
    if (this.transaction) {
      throw new Error('Transaction already in progress');
    }

    this.transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
    });

    this.logger.debug('Transaction begun');
  }

  async commit(): Promise<void> {
    if (!this.transaction) {
      throw new Error('No transaction in progress');
    }

    await this.transaction.commit();
    this.transaction = null;
    this.logger.debug('Transaction committed');
  }

  async rollback(): Promise<void> {
    if (!this.transaction) {
      throw new Error('No transaction in progress');
    }

    await this.transaction.rollback();
    this.transaction = null;
    this.logger.debug('Transaction rolled back');
  }

  isInTransaction(): boolean {
    return this.transaction !== null;
  }

  async executeInTransaction<T>(
    operation: (uow: IUnitOfWork) => Promise<T>,
    context: ExecutionContext
  ): Promise<T> {
    const transactionId = context.transactionId || this.generateTransactionId();
    const startTime = Date.now();

    this.logger.log(`Starting transaction ${transactionId}`);

    try {
      const result = await this.sequelize.transaction(
        {
          isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
        },
        async (t) => {
          this.transaction = t;

          this.logger.debug(`Transaction ${transactionId} executing operation`);

          const operationResult = await operation(this);

          this.logger.debug(`Transaction ${transactionId} operation completed successfully`);

          return operationResult;
        }
      );

      const duration = Date.now() - startTime;

      await this.auditLogger.logTransaction('TRANSACTION_COMMIT', context, {
        transactionId,
        duration,
        success: true
      });

      this.logger.log(`Transaction ${transactionId} committed successfully (${duration}ms)`);

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      await this.auditLogger.logTransaction('TRANSACTION_ROLLBACK', context, {
        transactionId,
        duration,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      this.logger.error(
        `Transaction ${transactionId} rolled back (${duration}ms)`,
        error instanceof Error ? error.stack : String(error)
      );

      throw error;
    } finally {
      this.transaction = null;
    }
  }

  private generateTransactionId(): string {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 15);
    return `txn_${timestamp}_${randomStr}`;
  }
}
