/**
 * Prisma Unit of Work Implementation
 * Concrete implementation using Prisma as the ORM
 */

import { PrismaClient, Prisma } from '@prisma/client';
import { IUnitOfWork, TransactionOptions, TransactionIsolationLevel } from './IUnitOfWork';
import { IHealthRecordRepository } from '../repositories/interfaces/IHealthRecordRepository';
import { IAllergyRepository } from '../repositories/interfaces/IAllergyRepository';
import { IChronicConditionRepository } from '../repositories/interfaces/IChronicConditionRepository';
import { IStudentRepository } from '../repositories/interfaces/IStudentRepository';
import { IAuditLogRepository } from '../repositories/interfaces/IAuditLogRepository';
import { HealthRecordRepository } from '../repositories/implementations/HealthRecordRepository';
import { AllergyRepository } from '../repositories/implementations/AllergyRepository';
import { ChronicConditionRepository } from '../repositories/implementations/ChronicConditionRepository';
import { StudentRepository } from '../repositories/implementations/StudentRepository';
import { AuditLogRepository } from '../repositories/implementations/AuditLogRepository';
import { IAuditLogger } from '../audit/IAuditLogger';
import { ICacheManager } from '../cache/ICacheManager';
import { ExecutionContext } from '../types/ExecutionContext';
import { logger } from '../../utils/logger';

export class PrismaUnitOfWork implements IUnitOfWork {
  private transaction: Prisma.TransactionClient | null = null;
  private readonly prismaClient: PrismaClient;
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
    prismaClient: PrismaClient,
    auditLogger: IAuditLogger,
    cacheManager: ICacheManager,
    options: TransactionOptions = {}
  ) {
    this.prismaClient = prismaClient;
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
        this.getClient(),
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
        this.getClient(),
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
        this.getClient(),
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
        this.getClient(),
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
      this._auditLogs = new AuditLogRepository(this.getClient());
    }
    return this._auditLogs;
  }

  /**
   * Get current database client (transaction or main client)
   */
  private getClient(): Prisma.TransactionClient | PrismaClient {
    return this.transaction || this.prismaClient;
  }

  /**
   * Begin a new transaction
   */
  async begin(): Promise<void> {
    if (this.transaction) {
      throw new Error('Transaction already in progress');
    }
    // Transaction is started in executeInTransaction
    logger.debug('Transaction begin called - will start on executeInTransaction');
  }

  /**
   * Commit the current transaction
   */
  async commit(): Promise<void> {
    if (!this.transaction) {
      throw new Error('No transaction in progress');
    }

    // Commit is handled by Prisma interactive transaction
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

    // Rollback is handled by throwing error in Prisma interactive transaction
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
      const result = await this.prismaClient.$transaction(
        async (tx) => {
          // Set transaction client
          this.transaction = tx;

          // Clear repository cache to force recreation with transaction client
          this.clearRepositoryCache();

          logger.debug(`Transaction ${transactionId} executing operation`);

          // Execute the operation
          const operationResult = await operation(this);

          logger.debug(`Transaction ${transactionId} operation completed successfully`);

          return operationResult;
        },
        {
          maxWait: this.options.maxWait,
          timeout: this.options.timeout,
          isolationLevel: this.mapIsolationLevel(this.options.isolationLevel!)
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
   * Clear repository cache to force recreation with new client
   */
  private clearRepositoryCache(): void {
    this._healthRecords = undefined;
    this._allergies = undefined;
    this._chronicConditions = undefined;
    this._students = undefined;
    this._auditLogs = undefined;
  }

  /**
   * Map internal isolation level to Prisma isolation level
   */
  private mapIsolationLevel(
    level: TransactionIsolationLevel
  ): Prisma.TransactionIsolationLevel {
    switch (level) {
      case TransactionIsolationLevel.ReadUncommitted:
        return Prisma.TransactionIsolationLevel.ReadUncommitted;
      case TransactionIsolationLevel.ReadCommitted:
        return Prisma.TransactionIsolationLevel.ReadCommitted;
      case TransactionIsolationLevel.RepeatableRead:
        return Prisma.TransactionIsolationLevel.RepeatableRead;
      case TransactionIsolationLevel.Serializable:
        return Prisma.TransactionIsolationLevel.Serializable;
      default:
        return Prisma.TransactionIsolationLevel.ReadCommitted;
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
    this.clearRepositoryCache();
    // Note: Don't disconnect prismaClient as it may be shared
  }
}
