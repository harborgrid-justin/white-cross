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
 *
 * Implements the Unit of Work pattern for managing database transactions and
 * coordinating multiple repository operations with transactional consistency.
 * Ensures ACID properties across complex, multi-entity business operations.
 *
 * @interface IUnitOfWork
 *
 * @example
 * ```typescript
 * // Transfer student and update health records atomically
 * await unitOfWork.executeInTransaction(async (uow) => {
 *   await uow.students.update(studentId, { schoolId: newSchoolId });
 *   await uow.healthRecords.create({ studentId, type: 'TRANSFER', ... });
 *   await uow.auditLogs.create({ action: 'TRANSFER', entityId: studentId });
 * }, executionContext);
 * ```
 *
 * @see {@link IUnitOfWorkFactory} for creating UoW instances
 * @see {@link TransactionOptions} for transaction configuration
 */

import { IHealthRecordRepository } from '../repositories/interfaces/IHealthRecordRepository';
import { IAllergyRepository } from '../repositories/interfaces/IAllergyRepository';
import { IChronicConditionRepository } from '../repositories/interfaces/IChronicConditionRepository';
import { IStudentRepository } from '../repositories/interfaces/IStudentRepository';
import { IAuditLogRepository } from '../repositories/interfaces/IAuditLogRepository';
import { ExecutionContext } from '../types/ExecutionContext';

/**
 * Unit of Work interface following the Unit of Work pattern.
 *
 * Provides transactional consistency across multiple repository operations.
 * All repositories share the same transaction context, ensuring that either
 * all operations succeed or all are rolled back together.
 *
 * @interface IUnitOfWork
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
   * Begins a new database transaction.
   *
   * Must be called before performing any repository operations within a transaction.
   * All subsequent repository operations will be part of this transaction until
   * commit() or rollback() is called.
   *
   * @returns {Promise<void>} Resolves when transaction is started
   *
   * @throws {Error} If transaction is already active
   *
   * @example
   * ```typescript
   * const uow = unitOfWorkFactory.create();
   * await uow.begin();
   * try {
   *   await uow.students.create(studentData);
   *   await uow.commit();
   * } catch (error) {
   *   await uow.rollback();
   * }
   * ```
   */
  begin(): Promise<void>;

  /**
   * Commits the current transaction.
   *
   * Persists all changes made during the transaction to the database.
   * Once committed, changes are permanent and visible to other transactions.
   *
   * @returns {Promise<void>} Resolves when transaction is committed
   *
   * @throws {Error} If no active transaction or commit fails
   *
   * @see {@link rollback} to cancel transaction changes
   */
  commit(): Promise<void>;

  /**
   * Rolls back the current transaction.
   *
   * Discards all changes made during the transaction. Used when an error occurs
   * or when business logic determines the transaction should not be committed.
   *
   * @returns {Promise<void>} Resolves when transaction is rolled back
   *
   * @throws {Error} If no active transaction
   *
   * @example
   * ```typescript
   * try {
   *   await uow.students.update(id, data);
   *   if (!isValid(data)) {
   *     await uow.rollback();
   *     return;
   *   }
   *   await uow.commit();
   * } catch (error) {
   *   await uow.rollback();
   *   throw error;
   * }
   * ```
   */
  rollback(): Promise<void>;

  /**
   * Checks if currently within an active transaction.
   *
   * @returns {boolean} True if transaction is active, false otherwise
   *
   * @example
   * ```typescript
   * if (uow.isInTransaction()) {
   *   console.log('Transaction active');
   * } else {
   *   await uow.begin();
   * }
   * ```
   */
  isInTransaction(): boolean;

  /**
   * Executes an operation within a transaction with automatic lifecycle management.
   *
   * Provides a convenient wrapper that automatically:
   * - Begins a transaction
   * - Executes the operation
   * - Commits on success
   * - Rolls back on error
   * - Logs transaction to audit trail
   *
   * Preferred over manual begin/commit/rollback for most use cases.
   *
   * @template T - Return type of the operation
   * @param {(uow: IUnitOfWork) => Promise<T>} operation - Function to execute within transaction
   * @param {ExecutionContext} context - Execution context for audit logging
   *
   * @returns {Promise<T>} Result of the operation if transaction succeeds
   *
   * @throws {Error} If operation fails (transaction is automatically rolled back)
   *
   * @example
   * ```typescript
   * // Complex multi-entity operation with automatic transaction management
   * const result = await unitOfWork.executeInTransaction(async (uow) => {
   *   // Transfer student to new school
   *   const student = await uow.students.update(studentId, {
   *     schoolId: newSchoolId,
   *     enrollmentDate: new Date()
   *   });
   *
   *   // Update health records with transfer note
   *   await uow.healthRecords.create({
   *     studentId,
   *     notes: 'Student transferred to new school',
   *     recordType: 'TRANSFER'
   *   });
   *
   *   // Log the transfer
   *   await uow.auditLogs.create({
   *     action: 'TRANSFER',
   *     entityType: 'Student',
   *     entityId: studentId
   *   });
   *
   *   return student;
   * }, executionContext);
   * // Transaction automatically committed if no errors
   * // Transaction automatically rolled back if any operation throws
   * ```
   *
   * @remarks
   * This is the recommended approach for transactional operations as it handles
   * all error cases and cleanup automatically. The transaction is logged to
   * the audit trail for HIPAA compliance.
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
