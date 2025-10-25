/**
 * LOC: 08A8246F60
 * WC-GEN-228 | businessLogic.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - sequelizeErrorHandler.ts (utils/sequelizeErrorHandler.ts)
 *   - types.ts (services/chronicCondition/types.ts)
 *   - crudOperations.ts (services/chronicCondition/crudOperations.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (services/chronicCondition/index.ts)
 */

/**
 * WC-GEN-228 | businessLogic.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../utils/sequelizeErrorHandler, ../../database/models | Dependencies: sequelize, ../../utils/logger, ../../utils/sequelizeErrorHandler
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: Various exports | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * @fileoverview Chronic Condition Business Logic Module
 *
 * Provides business logic operations for chronic disease management including:
 * - Care plan management and review tracking
 * - Bulk condition creation for data imports
 * - Transaction management for atomic operations
 * - Healthcare provider documentation support
 *
 * @module services/chronicCondition/businessLogic
 *
 * @remarks
 * PHI SENSITIVITY: This module handles protected health information (PHI) including
 * chronic disease diagnoses, care plans, and treatment protocols. All operations
 * include comprehensive audit logging for HIPAA compliance.
 *
 * Healthcare Context:
 * - Supports chronic disease management workflows
 * - Tracks care plan updates with review dates
 * - Enables IEP/504 educational accommodation coordination
 * - Maintains medication and restriction lists
 *
 * @see {@link module:services/chronicCondition/crudOperations} for basic CRUD
 * @see {@link module:services/chronicCondition/queryOperations} for search and filtering
 *
 * @since 1.0.0
 */

import { Op, Transaction } from 'sequelize';
import { logger } from '../../utils/logger';
import { handleSequelizeError } from '../../utils/sequelizeErrorHandler';
import {
  ChronicCondition,
  Student,
  sequelize
} from '../../database/models';
import { CreateChronicConditionData } from './types';
import { updateChronicCondition } from './crudOperations';

/**
 * Updates the care plan for a chronic condition and refreshes the review date.
 *
 * Care plans document the comprehensive management strategy for a student's
 * chronic condition, including treatment protocols, monitoring requirements,
 * emergency procedures, and school-based interventions.
 *
 * @param {string} id - Unique identifier of the chronic condition record
 * @param {string} carePlan - Updated care plan documentation detailing management strategies,
 *                            monitoring protocols, emergency procedures, and required accommodations
 * @param {Transaction} [transaction] - Optional Sequelize transaction for atomic operations
 *
 * @returns {Promise<ChronicCondition>} Updated chronic condition record with new care plan
 *                                       and automatically updated lastReviewDate
 *
 * @throws {Error} When chronic condition record is not found
 * @throws {SequelizeError} When database operation fails
 *
 * @example
 * ```typescript
 * // Update care plan for student with asthma
 * const updatedCondition = await updateCarePlan(
 *   'condition-uuid',
 *   'Care Plan:\n' +
 *   '1. Daily inhaler use before physical activity\n' +
 *   '2. Monitor for symptoms during recess\n' +
 *   '3. Emergency inhaler in nurse office\n' +
 *   '4. Parent notification if symptoms worsen'
 * );
 * console.log('Care plan updated:', updatedCondition.lastReviewDate);
 * ```
 *
 * @remarks
 * PHI: Contains protected health information. All care plan updates are audit logged.
 * The lastReviewDate is automatically set to the current timestamp when the care plan
 * is updated, ensuring compliance with review tracking requirements.
 */
export async function updateCarePlan(
  id: string,
  carePlan: string,
  transaction?: Transaction
): Promise<ChronicCondition> {
  try {
    return await updateChronicCondition(
      id,
      { carePlan, lastReviewDate: new Date() },
      transaction
    );
  } catch (error) {
    logger.error('Error updating care plan:', error);
    throw handleSequelizeError(error as Error);
  }
}

/**
 * Bulk creates multiple chronic condition records in a single atomic operation.
 *
 * This operation is optimized for data imports, school year transitions, or
 * batch updates from healthcare providers. All student IDs are validated before
 * creation to ensure referential integrity.
 *
 * @param {CreateChronicConditionData[]} conditionsData - Array of chronic condition records to create.
 *                                                         Each record must include valid studentId,
 *                                                         condition name, diagnosis date, and status
 * @param {Transaction} [transaction] - Optional Sequelize transaction. If provided, all creates
 *                                       occur within the transaction; otherwise a new transaction
 *                                       is created internally
 *
 * @returns {Promise<ChronicCondition[]>} Array of created chronic condition records with
 *                                         auto-generated IDs and timestamps
 *
 * @throws {Error} When one or more student IDs are invalid or not found
 * @throws {ValidationError} When condition data fails validation (missing required fields, invalid ICD codes)
 * @throws {SequelizeError} When database bulk create operation fails
 *
 * @example
 * ```typescript
 * // Import chronic conditions from healthcare provider
 * const conditionsToImport = [
 *   {
 *     studentId: 'student-1-uuid',
 *     condition: 'Type 1 Diabetes',
 *     icdCode: 'E10.9',
 *     diagnosedDate: new Date('2023-05-15'),
 *     diagnosedBy: 'Dr. Sarah Johnson',
 *     status: 'ACTIVE',
 *     severity: 'High',
 *     carePlan: 'Blood glucose monitoring protocol...',
 *     medications: ['Insulin - Humalog', 'Insulin - Lantus'],
 *     requiresIEP: true
 *   },
 *   {
 *     studentId: 'student-2-uuid',
 *     condition: 'Asthma',
 *     icdCode: 'J45.909',
 *     diagnosedDate: new Date('2022-08-20'),
 *     status: 'MANAGED',
 *     medications: ['Albuterol Inhaler'],
 *     triggers: ['Exercise', 'Cold air', 'Pollen']
 *   }
 * ];
 *
 * const createdConditions = await bulkCreateChronicConditions(conditionsToImport);
 * console.log(`Successfully imported ${createdConditions.length} conditions`);
 * ```
 *
 * @remarks
 * PHI: Contains protected health information. Bulk operations are audit logged with
 * student count and IDs for compliance tracking.
 *
 * Performance: Uses Sequelize bulkCreate with validation enabled. For large datasets
 * (>1000 records), consider batching into smaller chunks to avoid timeout issues.
 *
 * HIPAA Compliance: All created records are logged with timestamp, count, and affected
 * student IDs for audit trail purposes.
 */
export async function bulkCreateChronicConditions(
  conditionsData: CreateChronicConditionData[],
  transaction?: Transaction
): Promise<ChronicCondition[]> {
  try {
    // Validate all student IDs
    const studentIds = [...new Set(conditionsData.map(c => c.studentId))];
    const students = await Student.findAll({
      where: { id: { [Op.in]: studentIds } },
      attributes: ['id'],
      transaction
    });

    if (students.length !== studentIds.length) {
      throw new Error('One or more student IDs are invalid');
    }

    const conditions = await ChronicCondition.bulkCreate(conditionsData as any[], {
      transaction,
      validate: true
    });

    // PHI Audit Log
    logger.info('PHI Access - Chronic Conditions Bulk Created', {
      action: 'CREATE',
      entity: 'ChronicCondition',
      count: conditions.length,
      studentIds,
      timestamp: new Date().toISOString()
    });

    logger.info(`Bulk created ${conditions.length} chronic condition records`);
    return conditions;
  } catch (error) {
    logger.error('Error bulk creating chronic conditions:', error);
    throw handleSequelizeError(error as Error);
  }
}

/**
 * Executes a callback function within a Sequelize transaction with automatic rollback on error.
 *
 * Provides transaction management for complex operations requiring multiple database
 * operations to succeed or fail atomically. Automatically commits on success and rolls
 * back on any error, ensuring data consistency.
 *
 * @template T - Return type of the callback function
 *
 * @param {(transaction: Transaction) => Promise<T>} callback - Async function that receives
 *                                                               the transaction object and performs
 *                                                               database operations within the transaction
 *
 * @returns {Promise<T>} Result from the callback function if transaction commits successfully
 *
 * @throws {Error} Any error thrown by the callback function, after transaction rollback
 * @throws {SequelizeError} When transaction commit or rollback fails
 *
 * @example
 * ```typescript
 * // Create condition and update student health record atomically
 * const result = await withTransaction(async (transaction) => {
 *   const condition = await createChronicCondition({
 *     studentId: 'student-uuid',
 *     condition: 'Epilepsy',
 *     icdCode: 'G40.909',
 *     diagnosedDate: new Date(),
 *     status: 'ACTIVE',
 *     emergencyProtocol: 'Seizure management protocol...'
 *   }, transaction);
 *
 *   const healthRecord = await HealthRecord.update(
 *     { hasChronicConditions: true },
 *     { where: { studentId: 'student-uuid' }, transaction }
 *   );
 *
 *   return { condition, healthRecord };
 * });
 *
 * console.log('Transaction completed:', result);
 * ```
 *
 * @remarks
 * Transaction Lifecycle:
 * 1. Creates new Sequelize transaction
 * 2. Executes callback with transaction object
 * 3. On success: commits transaction and returns result
 * 4. On error: rolls back transaction and re-throws error
 *
 * Best Practices:
 * - Use for operations that modify multiple related records
 * - Always pass transaction to nested service calls
 * - Avoid long-running operations within transactions
 * - Keep transaction scope as narrow as possible
 */
export async function withTransaction<T>(
  callback: (transaction: Transaction) => Promise<T>
): Promise<T> {
  const transaction = await sequelize.transaction();
  try {
    const result = await callback(transaction);
    await transaction.commit();
    return result;
  } catch (error) {
    await transaction.rollback();
    logger.error('Transaction rolled back:', error);
    throw error;
  }
}
