/**
 * LOC: 9BBF7F5E4C
 * WC-GEN-200 | specialOperations.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - sequelizeErrorHandler.ts (utils/sequelizeErrorHandler.ts)
 *   - index.ts (database/models/index.ts)
 *   - crudOperations.ts (services/allergy/crudOperations.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (services/allergy/index.ts)
 */

/**
 * WC-GEN-200 | specialOperations.ts - General utility functions and operations
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
 * @fileoverview Allergy Special Operations - Verification and Transaction Management
 *
 * Provides specialized allergy operations including healthcare professional verification
 * workflows and atomic transaction management for complex multi-step allergy operations.
 *
 * Verification is CRITICAL for patient safety - only verified allergies should be used
 * for medication cross-checking in production environments. Unverified allergies represent
 * parent-reported or preliminary data requiring healthcare professional confirmation.
 *
 * @module services/allergy/specialOperations
 * @security Verification operations log healthcare professional identity for accountability
 * @compliance Healthcare verification standards, data integrity requirements
 * @since 1.0.0
 */

import { Transaction } from 'sequelize';
import { logger } from '../../utils/logger';
import { handleSequelizeError } from '../../utils/sequelizeErrorHandler';
import { Allergy as AllergyModel, sequelize } from '../../database/models';
import { updateAllergy } from './crudOperations';

/**
 * Verifies an allergy record through healthcare professional confirmation.
 *
 * **CLINICAL WORKFLOW CRITICAL** - Marks an allergy as clinically verified by a licensed
 * healthcare professional (nurse, physician, etc.). Verification transforms parent-reported
 * or preliminary allergy data into clinically confirmed information suitable for medication
 * cross-checking and emergency response protocols.
 *
 * Sets verified=true, records the verifying healthcare professional's ID, and timestamps
 * the verification. All changes are logged for accountability and compliance.
 *
 * @param {string} id - Unique allergy record identifier to verify
 * @param {string} verifiedBy - User ID of licensed healthcare professional performing verification
 * @param {Transaction} [transaction] - Optional transaction for atomic verification workflows
 *
 * @returns {Promise<AllergyModel>} Updated allergy record with verification metadata
 *
 * @throws {Error} Allergy not found - if ID doesn't exist
 * @throws {Error} Database error - if update operation fails
 *
 * @security Logs healthcare professional identity for verification accountability
 * @compliance Healthcare professional verification requirement, clinical data standards
 *
 * @example
 * ```typescript
 * // Nurse verifies parent-reported peanut allergy with medical records
 * const verified = await verifyAllergy(
 *   'allergy-uuid-123',
 *   'nurse-uuid-456'
 * );
 *
 * console.log(`Allergy verified by ${verified.verifiedBy} at ${verified.verifiedAt}`);
 * console.log('Allergy now suitable for medication cross-checking');
 * ```
 *
 * @example
 * ```typescript
 * // Physician verifies allergy during health screening
 * const allergies = await getStudentAllergies('student-uuid-789');
 * const unverified = allergies.filter(a => !a.verified);
 *
 * for (const allergy of unverified) {
 *   console.log(`Verifying: ${allergy.allergen} (${allergy.severity})`);
 *   await verifyAllergy(allergy.id, 'physician-uuid-123');
 * }
 * console.log(`Verified ${unverified.length} allergy records`);
 * ```
 *
 * @remarks
 * Verification workflow:
 * 1. Healthcare professional reviews allergy information
 * 2. Confirms accuracy through patient interview, medical records, or testing
 * 3. Calls verifyAllergy() with their user ID
 * 4. System sets verified=true, verifiedBy, verifiedAt timestamp
 * 5. Allergy becomes suitable for medication cross-checking
 *
 * Verification is IRREVERSIBLE by design - once verified, the record maintains
 * verification status permanently to preserve clinical confirmation history.
 *
 * @warning Only licensed healthcare professionals should perform verification
 * @warning Verification cannot be undone - ensure accuracy before verifying
 *
 * @see {@link updateAllergy} for underlying update operation
 */
export async function verifyAllergy(
  id: string,
  verifiedBy: string,
  transaction?: Transaction
): Promise<AllergyModel> {
  try {
    return await updateAllergy(
      id,
      {
        verified: true,
        verifiedBy,
        verifiedAt: new Date()
      },
      transaction
    );
  } catch (error) {
    logger.error('Error verifying allergy:', error);
    throw handleSequelizeError(error as Error);
  }
}

/**
 * Executes a callback function within an atomic database transaction.
 *
 * Provides transaction management for complex multi-step allergy operations that must
 * succeed or fail as a complete unit. Automatically commits on success or rolls back on
 * error to maintain database consistency and data integrity.
 *
 * Use this for operations combining multiple allergy service calls that must be atomic,
 * such as bulk imports, multi-record updates, or operations that modify both allergies
 * and related records (students, health records, etc.).
 *
 * @template T - Return type of the callback function
 * @param {(transaction: Transaction) => Promise<T>} callback - Async function to execute within transaction
 * @param {Transaction} callback.transaction - Transaction object to pass to service functions
 *
 * @returns {Promise<T>} Result of callback function if transaction commits successfully
 *
 * @throws {Error} Any error thrown by callback - transaction is automatically rolled back
 * @throws {Error} Database error - if transaction commit/rollback fails
 *
 * @example
 * ```typescript
 * // Atomic bulk allergy import - all or nothing
 * const importedAllergies = await withTransaction(async (transaction) => {
 *   // All operations use same transaction
 *   const allergies = await bulkCreateAllergies(allergyData, transaction);
 *
 *   // If any operation fails, entire import is rolled back
 *   for (const allergy of allergies) {
 *     if (allergy.severity === 'LIFE_THREATENING') {
 *       await verifyAllergy(allergy.id, 'nurse-uuid-123', transaction);
 *     }
 *   }
 *
 *   return allergies;
 * });
 * // Transaction committed - all allergies created and verified
 * ```
 *
 * @example
 * ```typescript
 * // Atomic student transfer with allergy migration
 * await withTransaction(async (transaction) => {
 *   // Get all allergies from old student record
 *   const oldAllergies = await getStudentAllergies(oldStudentId, true, transaction);
 *
 *   // Create copies for new student record
 *   for (const allergy of oldAllergies) {
 *     await createAllergy({
 *       ...allergy.toJSON(),
 *       studentId: newStudentId,
 *       id: undefined // Create new ID
 *     }, transaction);
 *   }
 *
 *   // Deactivate old allergies
 *   for (const allergy of oldAllergies) {
 *     await deactivateAllergy(allergy.id, transaction);
 *   }
 * });
 * // All operations committed together
 * ```
 *
 * @remarks
 * Transaction lifecycle:
 * 1. Creates new Sequelize transaction
 * 2. Passes transaction to callback
 * 3. Callback performs operations using transaction
 * 4. On success: commits transaction, returns result
 * 5. On error: rolls back transaction, re-throws error
 *
 * Best practices:
 * - Pass transaction to ALL operations in callback
 * - Keep transactions short to minimize database locks
 * - Handle errors gracefully - rollback is automatic
 * - Avoid external API calls within transaction
 * - Test error scenarios to ensure proper rollback
 *
 * Performance considerations:
 * - Transactions hold database locks - keep them brief
 * - Batch operations when possible to reduce transaction count
 * - Monitor transaction duration in production
 *
 * @warning All operations within callback MUST use the provided transaction parameter
 * @warning Keep transaction duration short to avoid database lock contention
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
