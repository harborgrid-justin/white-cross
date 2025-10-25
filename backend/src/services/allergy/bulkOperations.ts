/**
 * LOC: CAB336B6D1
 * WC-GEN-196 | bulkOperations.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - sequelizeErrorHandler.ts (utils/sequelizeErrorHandler.ts)
 *   - index.ts (database/models/index.ts)
 *   - types.ts (services/allergy/types.ts)
 *   - validation.ts (services/allergy/validation.ts)
 *   - ... and 1 more
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (services/allergy/index.ts)
 */

/**
 * WC-GEN-196 | bulkOperations.ts - General utility functions and operations
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
 * @fileoverview Allergy Bulk Operations - Data Migration and Import
 *
 * Provides atomic bulk creation operations for allergy records. Designed for data
 * migration, initial system setup, and batch import workflows. All bulk operations
 * validate data integrity and support transactions for all-or-nothing guarantees.
 *
 * @module services/allergy/bulkOperations
 * @security Bulk operations log aggregate counts and student IDs for audit trail
 * @compliance HIPAA audit logging for bulk PHI operations
 * @since 1.0.0
 */

import { Op, Transaction } from 'sequelize';
import { logger } from '../../utils/logger';
import { handleSequelizeError } from '../../utils/sequelizeErrorHandler';
import { Allergy as AllergyModel, Student } from '../../database/models';
import { CreateAllergyData } from './types';
import { validateBulkStudentIds } from './validation';
import { logBulkAllergiesCreation } from './auditLogging';

/**
 * Creates multiple allergy records atomically in a single bulk operation.
 *
 * Validates all student IDs exist before creating any records to ensure data integrity.
 * Uses Sequelize bulkCreate for performance, with model-level validation enabled.
 * All-or-nothing: if any validation fails, no records are created.
 *
 * @param {CreateAllergyData[]} allergiesData - Array of complete allergy data objects
 * @param {Transaction} [transaction] - Optional transaction for atomic multi-step workflows
 *
 * @returns {Promise<AllergyModel[]>} Array of created allergy records
 *
 * @throws {Error} "One or more student IDs are invalid" - if any studentId doesn't exist
 * @throws {Error} Validation error - if any allergy data is invalid
 * @throws {Error} Database error - if bulk creation fails
 *
 * @security Logs bulk creation count and affected student IDs for HIPAA audit trail
 * @compliance HIPAA audit logging for bulk PHI creation operations
 *
 * @example
 * ```typescript
 * // Import allergies during system migration
 * const importData = [
 *   {
 *     studentId: 'student-1',
 *     allergen: 'Penicillin',
 *     severity: 'SEVERE',
 *     verified: false
 *   },
 *   {
 *     studentId: 'student-2',
 *     allergen: 'Peanuts',
 *     severity: 'LIFE_THREATENING',
 *     verified: true,
 *     verifiedBy: 'nurse-uuid-123'
 *   }
 * ];
 *
 * const created = await bulkCreateAllergies(importData);
 * console.log(`Successfully imported ${created.length} allergy records`);
 * ```
 *
 * @warning Does NOT check for duplicate allergies - validate uniqueness before bulk import
 * @warning Large bulk operations may cause performance issues - batch in groups of 100-500
 * @warning Always use within transaction for data migration to enable rollback
 *
 * @remarks
 * Best practices for bulk operations:
 * - Batch large imports into chunks of 100-500 records
 * - Use transactions for atomic all-or-nothing behavior
 * - Validate data format before calling this function
 * - Consider duplicate checking if importing from external sources
 * - Monitor performance and adjust batch size accordingly
 *
 * Performance considerations:
 * - bulkCreate is significantly faster than individual creates
 * - Validation still runs on each record (model-level)
 * - Database indexes may slow very large bulk operations
 * - Transaction overhead increases with batch size
 */
export async function bulkCreateAllergies(
  allergiesData: CreateAllergyData[],
  transaction?: Transaction
): Promise<AllergyModel[]> {
  try {
    // Validate all student IDs exist
    const studentIds = [...new Set(allergiesData.map(a => a.studentId))];
    await validateBulkStudentIds(studentIds, transaction);

    const allergies = await AllergyModel.bulkCreate(allergiesData as any[], {
      transaction,
      validate: true
    });

    // PHI Audit Log
    logBulkAllergiesCreation(allergies.length, studentIds);

    logger.info(`Bulk created ${allergies.length} allergy records`);
    return allergies;
  } catch (error) {
    logger.error('Error bulk creating allergies:', error);
    throw handleSequelizeError(error as Error);
  }
}
