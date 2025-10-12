/**
 * Sequelize Unit of Work Implementation
 * Concrete implementation using Sequelize as the ORM
 */

import { Transaction } from 'sequelize';
import { sequelize } from '../config/sequelize';
import { IUnitOfWork, TransactionOptions, TransactionIsolationLevel } from './IUnitOfWork';
import { IHealthRecordRepository } from '../repositories/interfaces/IHealthRecordRepository';
import { IAllergyRepository } from '../repositories/interfaces/IAllergyRepository';
import { IChronicConditionRepository } from '../repositories/interfaces/IChronicConditionRepository';
import { IStudentRepository } from '../repositories/interfaces/IStudentRepository';
import { IAuditLogRepository } from '../repositories/interfaces/IAuditLogRepository';
import { HealthRecordRepository } from '../repositories/impl/HealthRecordRepository';
import { AllergyRepository } from '../repositories/impl/AllergyRepository';
import { ChronicConditionRepository } from '../repositories/impl/ChronicConditionRepository';
import { StudentRepository } from '../repositories/impl/StudentRepository';
import { AuditLogRepository } from '../repositories/impl/AuditLogRepository';
import { IAuditLogger } from '../audit/IAuditLogger';
import { ICacheManager } from '../cache/ICacheManager';
import { ExecutionContext } from '../types/ExecutionContext';
import { logger } from '../../utils/logger';

export class SequelizeUnitOfWork implements IUnitOfWork {
  private transaction: Transaction | null = null;
  private readonly auditLogger: IAuditLogger;
  private readonly cacheManager: ICacheManager;
  private readonly options: TransactionOptions;

  // Repository instances (lazy-loaded)
  private _healthRecords?: IHealthRecordRepository;
  private _allergies?: IAllergyRepository;
  private _chronicConditions?: IChronicConditionRepository;
  private _students?: IStudentRepository;
  private _auditLogs?: IAuditLogRepository;

  constructor(
    auditLogger: IAuditLogger,
    cacheManager: ICacheManager,
    options: TransactionOptions = {}
  ) {
    this.auditLogger = auditLogger;
    this.cacheManager = cacheManager;
    this.options = {
      maxWait: options.maxWait || 5000,
      timeout: options.timeout || 30000,
      isolationLevel: options.isolationLevel || TransactionIsolationLevel.ReadCommitted
    };
  }

  /**
   * Get Health Records repository
   */
  get healthRecords(): IHealthRecordRepository {
    if (!this._healthRecords) {
      this._healthRecords = new HealthRecordRepository(
        this.transaction,
        this.auditLogger,
        this.cacheManager
      );
    }
    return this._healthRecords;
  }

  /**
   * Get Allergies repository
   */
  get allergies(): IAllergyRepository {
    if (!this._allergies) {
      this._allergies = new AllergyRepository(
        this.transaction,
        this.auditLogger,
        this.cacheManager
      );
    }
    return this._allergies;
  }

  /**
   * Get Chronic Conditions repository
   */
  get chronicConditions(): IChronicConditionRepository {
    if (!this._chronicConditions) {
      this._chronicConditions = new ChronicConditionRepository(
        this.transaction,
        this.auditLogger,
        this.cacheManager
      );
    }
    return this._chronicConditions;
  }

  /**
   * Get Students repository
   */
  get students(): IStudentRepository {
    if (!this._students) {
      this._students = new StudentRepository(
        this.transaction,
        this.auditLogger,
        this.cacheManager
      );
    }
    return this._students;
  }

  /**
   * Get Audit Logs repository
   */
  get auditLogs(): IAuditLogRepository {
    if (!this._auditLogs) {
      this._auditLogs = new AuditLogRepository(this.transaction);
    }
    return this._auditLogs;
  }

  /**
   * Begin a new transaction
   */
  async begin(): Promise<void> {
    if (this.transaction) {
      throw new Error('Transaction already in progress');
    }

    this.transaction = await sequelize.transaction({
      isolationLevel: this.mapIsolationLevel(this.options.isolationLevel!),
    });

    logger.debug('Transaction begun');
  }

  /**
   * Commit the current transaction
   */
  async commit(): Promise<void> {
    if (!this.transaction) {
      throw new Error('No transaction in progress');
    }

    await this.transaction.commit();
    this.transaction = null;
    this.clearRepositoryCache();
    logger.debug('Transaction committed');
  }

  /**
   * Rollback the current transaction
   */
  async rollback(): Promise<void> {
    if (!this.transaction) {
      throw new Error('No transaction in progress');
    }

    await this.transaction.rollback();
    this.transaction = null;
    this.clearRepositoryCache();
    logger.debug('Transaction rolled back');
  }

  /**
   * Check if currently in a transaction
   */
  isInTransaction(): boolean {
    return this.transaction !== null;
  }

  /**
   * Execute operation within a transaction
   * Provides automatic transaction management with proper error handling
   */
  async executeInTransaction<T>(
    operation: (uow: IUnitOfWork) => Promise<T>,
    context: ExecutionContext
  ): Promise<T> {
    const transactionId = context.transactionId || this.generateTransactionId();
    const startTime = Date.now();

    logger.info(`Starting transaction ${transactionId}`);

    try {
      const result = await sequelize.transaction(
        {
          isolationLevel: this.mapIsolationLevel(this.options.isolationLevel!),
          // Note: Sequelize doesn't have maxWait, only timeout
        },
        async (t) => {
          // Set transaction
          this.transaction = t;

          // Clear repository cache to force recreation with transaction
          this.clearRepositoryCache();

          logger.debug(`Transaction ${transactionId} executing operation`);

          // Set statement timeout if specified
          if (this.options.timeout) {
            await sequelize.query(`SET statement_timeout = ${this.options.timeout}`, {
              transaction: t,
            });
          }

          // Execute the operation
          const operationResult = await operation(this);

          logger.debug(`Transaction ${transactionId} operation completed successfully`);

          return operationResult;
        }
      );

      const duration = Date.now() - startTime;

      // Log successful transaction
      await this.auditLogger.logTransaction('TRANSACTION_COMMIT', context, {
        transactionId,
        duration,
        success: true
      });

      logger.info(`Transaction ${transactionId} committed successfully (${duration}ms)`);

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      // Log failed transaction
      await this.auditLogger.logTransaction('TRANSACTION_ROLLBACK', context, {
        transactionId,
        duration,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      logger.error(
        `Transaction ${transactionId} rolled back (${duration}ms)`,
        error instanceof Error ? error : new Error(String(error))
      );

      throw error;
    } finally {
      this.transaction = null;
      this.clearRepositoryCache();
    }
  }

  /**
   * Clear repository cache to force recreation with new transaction
   */
  private clearRepositoryCache(): void {
    this._healthRecords = undefined;
    this._allergies = undefined;
    this._chronicConditions = undefined;
    this._students = undefined;
    this._auditLogs = undefined;
  }

  /**
   * Map internal isolation level to Sequelize isolation level
   */
  private mapIsolationLevel(
    level: TransactionIsolationLevel
  ): Transaction.ISOLATION_LEVELS {
    switch (level) {
      case TransactionIsolationLevel.ReadUncommitted:
        return Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED;
      case TransactionIsolationLevel.ReadCommitted:
        return Transaction.ISOLATION_LEVELS.READ_COMMITTED;
      case TransactionIsolationLevel.RepeatableRead:
        return Transaction.ISOLATION_LEVELS.REPEATABLE_READ;
      case TransactionIsolationLevel.Serializable:
        return Transaction.ISOLATION_LEVELS.SERIALIZABLE;
      default:
        return Transaction.ISOLATION_LEVELS.READ_COMMITTED;
    }
  }

  /**
   * Generate unique transaction ID
   */
  private generateTransactionId(): string {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 15);
    return `txn_${timestamp}_${randomStr}`;
  }

  /**
   * Dispose of resources
   */
  async dispose(): Promise<void> {
    if (this.transaction) {
      await this.rollback();
    }
    this.clearRepositoryCache();
  }
}
