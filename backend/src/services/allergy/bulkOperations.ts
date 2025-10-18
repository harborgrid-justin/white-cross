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
 * Allergy Bulk Operations Module
 *
 * Handles bulk operations for allergies (useful for data migration or imports)
 *
 * @module services/allergy/bulkOperations
 */

import { Op, Transaction } from 'sequelize';
import { logger } from '../../utils/logger';
import { handleSequelizeError } from '../../utils/sequelizeErrorHandler';
import { Allergy as AllergyModel, Student } from '../../database/models';
import { CreateAllergyData } from './types';
import { validateBulkStudentIds } from './validation';
import { logBulkAllergiesCreation } from './auditLogging';

/**
 * Bulk creates allergies (useful for data migration or imports)
 *
 * @param allergiesData - Array of allergy data
 * @param transaction - Optional transaction
 * @returns Array of created allergy records
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
