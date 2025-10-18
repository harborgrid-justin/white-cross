/**
 * WC-GEN-197 | crudOperations.ts - General utility functions and operations
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
 * Allergy CRUD Operations Module
 *
 * Handles basic Create, Read, Update, Delete operations for allergies
 *
 * @module services/allergy/crudOperations
 */

import { Transaction } from 'sequelize';
import { logger } from '../../utils/logger';
import { handleSequelizeError } from '../../utils/sequelizeErrorHandler';
import {
  Allergy as AllergyModel,
  Student,
  HealthRecord
} from '../../database/models';
import { CreateAllergyData, UpdateAllergyData } from './types';
import { validateAllergyData } from './validation';
import { logAllergyCreation, logAllergyRead, logAllergyUpdate, logAllergyDeactivation, logAllergyDeletion } from './auditLogging';

/**
 * Defines the associations to include when fetching allergies
 */
const DEFAULT_INCLUDES = [
  {
    model: Student,
    as: 'student',
    attributes: ['id', 'firstName', 'lastName', 'studentNumber']
  },
  {
    model: HealthRecord,
    as: 'healthRecord',
    required: false
  }
];

/**
 * Creates a new allergy record with validation and PHI audit logging
 *
 * @param data - Allergy data
 * @param transaction - Optional transaction for atomic operations
 * @returns Created allergy record with associations
 */
export async function createAllergy(
  data: CreateAllergyData,
  transaction?: Transaction
): Promise<AllergyModel> {
  try {
    // Validate data
    await validateAllergyData(data, transaction);

    // Create allergy record
    const allergy = await AllergyModel.create(
      {
        ...data,
        verifiedAt: data.verified ? (data.verifiedAt || new Date()) : undefined
      } as any,
      { transaction }
    );

    // Reload with associations
    await allergy.reload({
      include: DEFAULT_INCLUDES,
      transaction
    });

    // PHI Audit Log
    logAllergyCreation(allergy, data);

    logger.info(`Allergy created: ${data.allergen} (${data.severity}) for student ${data.studentId}`);
    return allergy;
  } catch (error) {
    logger.error('Error creating allergy:', error);
    throw handleSequelizeError(error as Error);
  }
}

/**
 * Retrieves an allergy record by ID with PHI audit logging
 *
 * @param id - Allergy ID
 * @param transaction - Optional transaction
 * @returns Allergy record or null
 */
export async function getAllergyById(
  id: string,
  transaction?: Transaction
): Promise<AllergyModel | null> {
  try {
    const allergy = await AllergyModel.findByPk(id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'dateOfBirth']
        },
        {
          model: HealthRecord,
          as: 'healthRecord',
          required: false
        }
      ],
      transaction
    });

    if (allergy) {
      // PHI Audit Log
      logAllergyRead(id, allergy.studentId);
    }

    return allergy;
  } catch (error) {
    logger.error('Error retrieving allergy:', error);
    throw handleSequelizeError(error as Error);
  }
}

/**
 * Updates an allergy record with validation and PHI audit logging
 *
 * @param id - Allergy ID
 * @param data - Update data
 * @param transaction - Optional transaction
 * @returns Updated allergy record
 */
export async function updateAllergy(
  id: string,
  data: UpdateAllergyData,
  transaction?: Transaction
): Promise<AllergyModel> {
  try {
    const allergy = await AllergyModel.findByPk(id, {
      include: [{ model: Student, as: 'student' }],
      transaction
    });

    if (!allergy) {
      throw new Error('Allergy not found');
    }

    // If verification status is being changed, update timestamp
    const updateData: any = { ...data };
    if (data.verified && !allergy.verified) {
      updateData.verifiedAt = new Date();
    }

    // Store old values for audit
    const oldValues = {
      allergen: allergy.allergen,
      severity: allergy.severity,
      verified: allergy.verified
    };

    await allergy.update(updateData, { transaction });

    // Reload with associations
    await allergy.reload({
      include: DEFAULT_INCLUDES,
      transaction
    });

    // PHI Audit Log
    logAllergyUpdate(allergy, oldValues, data.verifiedBy);

    logger.info(`Allergy updated: ${allergy.allergen} for student ${allergy.studentId}`);
    return allergy;
  } catch (error) {
    logger.error('Error updating allergy:', error);
    throw handleSequelizeError(error as Error);
  }
}

/**
 * Soft deletes (deactivates) an allergy record
 *
 * @param id - Allergy ID
 * @param transaction - Optional transaction
 * @returns Success status
 */
export async function deactivateAllergy(
  id: string,
  transaction?: Transaction
): Promise<{ success: boolean }> {
  try {
    const allergy = await AllergyModel.findByPk(id, {
      include: [{ model: Student, as: 'student' }],
      transaction
    });

    if (!allergy) {
      throw new Error('Allergy not found');
    }

    await allergy.update({ active: false }, { transaction });

    // PHI Audit Log
    logAllergyDeactivation(id, allergy.studentId, allergy.allergen);

    logger.info(`Allergy deactivated: ${allergy.allergen} for student ${allergy.studentId}`);
    return { success: true };
  } catch (error) {
    logger.error('Error deactivating allergy:', error);
    throw handleSequelizeError(error as Error);
  }
}

/**
 * Hard deletes an allergy record (use with caution - PHI compliance)
 *
 * @param id - Allergy ID
 * @param transaction - Optional transaction
 * @returns Success status
 */
export async function deleteAllergy(
  id: string,
  transaction?: Transaction
): Promise<{ success: boolean }> {
  try {
    const allergy = await AllergyModel.findByPk(id, {
      include: [{ model: Student, as: 'student' }],
      transaction
    });

    if (!allergy) {
      throw new Error('Allergy not found');
    }

    // Store data for audit before deletion
    const auditData = {
      allergen: allergy.allergen,
      severity: allergy.severity,
      studentId: allergy.studentId,
      studentName: allergy.student ? `${allergy.student.firstName} ${allergy.student.lastName}` : 'Unknown'
    };

    await allergy.destroy({ transaction });

    // PHI Audit Log
    logAllergyDeletion(id, auditData);

    logger.warn(`Allergy permanently deleted: ${auditData.allergen} for ${auditData.studentName}`);
    return { success: true };
  } catch (error) {
    logger.error('Error deleting allergy:', error);
    throw handleSequelizeError(error as Error);
  }
}
