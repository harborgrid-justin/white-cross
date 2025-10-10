/**
 * Unit of Work Interface
 * Manages transactions and repository access across multiple entities
 */

import { IHealthRecordRepository } from '../repositories/interfaces/IHealthRecordRepository';
import { IAllergyRepository } from '../repositories/interfaces/IAllergyRepository';
import { IChronicConditionRepository } from '../repositories/interfaces/IChronicConditionRepository';
import { IStudentRepository } from '../repositories/interfaces/IStudentRepository';
import { IAuditLogRepository } from '../repositories/interfaces/IAuditLogRepository';
import { ExecutionContext } from '../types/ExecutionContext';

/**
 * Unit of Work interface following the Unit of Work pattern
 * Provides transactional consistency across multiple repository operations
 */
export interface IUnitOfWork {
  /**
   * Health Records repository
   */
  readonly healthRecords: IHealthRecordRepository;

  /**
   * Allergies repository
   */
  readonly allergies: IAllergyRepository;

  /**
   * Chronic Conditions repository
   */
  readonly chronicConditions: IChronicConditionRepository;

  /**
   * Students repository
   */
  readonly students: IStudentRepository;

  /**
   * Audit Logs repository
   */
  readonly auditLogs: IAuditLogRepository;

  /**
   * Begin a new transaction
   */
  begin(): Promise<void>;

  /**
   * Commit the current transaction
   */
  commit(): Promise<void>;

  /**
   * Rollback the current transaction
   */
  rollback(): Promise<void>;

  /**
   * Check if currently in a transaction
   */
  isInTransaction(): boolean;

  /**
   * Execute an operation within a transaction
   * Automatically handles begin, commit, and rollback
   *
   * @param operation Function to execute within transaction
   * @param context Execution context for audit logging
   * @returns Result of the operation
   */
  executeInTransaction<T>(
    operation: (uow: IUnitOfWork) => Promise<T>,
    context: ExecutionContext
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

/**
 * Transaction isolation levels
 */
export enum TransactionIsolationLevel {
  ReadUncommitted = 'ReadUncommitted',
  ReadCommitted = 'ReadCommitted',
  RepeatableRead = 'RepeatableRead',
  Serializable = 'Serializable'
}

/**
 * Unit of Work factory interface
 */
export interface IUnitOfWorkFactory {
  /**
   * Create a new Unit of Work instance
   * @param options Transaction options
   */
  create(options?: TransactionOptions): IUnitOfWork;
}
