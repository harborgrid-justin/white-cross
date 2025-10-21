/**
 * LOC: 5A9D38C9A4
 * WC-GEN-131 | IUnitOfWork.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - IHealthRecordRepository.ts (database/repositories/interfaces/IHealthRecordRepository.ts)
 *   - IAllergyRepository.ts (database/repositories/interfaces/IAllergyRepository.ts)
 *   - IChronicConditionRepository.ts (database/repositories/interfaces/IChronicConditionRepository.ts)
 *   - IStudentRepository.ts (database/repositories/interfaces/IStudentRepository.ts)
 *   - IAuditLogRepository.ts (database/repositories/interfaces/IAuditLogRepository.ts)
 *   - ... and 1 more
 *
 * DOWNSTREAM (imported by):
 *   - SequelizeUnitOfWork.ts (database/uow/SequelizeUnitOfWork.ts)
 */

/**
 * WC-GEN-131 | IUnitOfWork.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../repositories/interfaces/IHealthRecordRepository, ../repositories/interfaces/IAllergyRepository, ../repositories/interfaces/IChronicConditionRepository | Dependencies: ../repositories/interfaces/IHealthRecordRepository, ../repositories/interfaces/IAllergyRepository, ../repositories/interfaces/IChronicConditionRepository
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: interfaces | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

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
