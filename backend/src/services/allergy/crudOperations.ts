/**
 * LOC: 71DFD03220
 * WC-GEN-197 | crudOperations.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - sequelizeErrorHandler.ts (utils/sequelizeErrorHandler.ts)
 *   - types.ts (services/allergy/types.ts)
 *   - validation.ts (services/allergy/validation.ts)
 *   - auditLogging.ts (services/allergy/auditLogging.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (services/allergy/index.ts)
 *   - specialOperations.ts (services/allergy/specialOperations.ts)
 */

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
 * @fileoverview Allergy CRUD Operations - Patient Safety Critical Module
 *
 * Provides comprehensive Create, Read, Update, Delete operations for student allergy records
 * with strict validation, PHI compliance, and patient safety protocols. All operations include
 * automatic audit logging for HIPAA compliance and support medication-allergy cross-checking.
 *
 * This module is CRITICAL for patient safety as it manages life-threatening allergy information
 * that directly impacts medication administration decisions and emergency response protocols.
 *
 * @module services/allergy/crudOperations
 * @security All operations log PHI access for HIPAA compliance
 * @compliance HIPAA, healthcare allergy documentation standards
 * @since 1.0.0
 */

import { Transaction } from 'sequelize';
import { logger } from '../../utils/logger';
import { handleSequelizeError } from '../../utils/sequelizeErrorHandler';
import {
  Allergy as AllergyModel,
  Student,
  HealthRecord
} from '../../database/models';
import { CreateAllergyData, UpdateAllergyData } from './allergy.types';
import { validateAllergyData } from './validation';
import { logAllergyCreation, logAllergyRead, logAllergyUpdate, logAllergyDeactivation, logAllergyDeletion } from './auditLogging';

/**
 * Default Sequelize associations for allergy queries.
 *
 * Includes student demographic information and optional health record linkage
 * to provide complete clinical context when retrieving allergy data.
 *
 * @constant
 * @type {Array<Object>}
 * @property {Object} student - Associated student demographic data (required)
 * @property {Object} healthRecord - Linked health record if available (optional)
 *
 * @remarks
 * Student information is always included to identify the patient. Health records
 * are optional since allergies can exist independently of comprehensive health records.
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
 * Creates a new allergy record with comprehensive validation and PHI audit logging.
 *
 * This function is CRITICAL for patient safety. It validates the student exists,
 * prevents duplicate allergy entries, and automatically logs all PHI access for
 * HIPAA compliance. The created allergy record becomes immediately available for
 * medication-allergy cross-checking to prevent adverse reactions.
 *
 * @param {CreateAllergyData} data - Complete allergy information
 * @param {string} data.studentId - Student's unique identifier
 * @param {string} data.allergen - Name of allergen (medication, food, environmental)
 * @param {string} [data.allergenType] - Category: MEDICATION, FOOD, ENVIRONMENTAL, etc.
 * @param {AllergySeverity} data.severity - Clinical severity: MILD, MODERATE, SEVERE, LIFE_THREATENING
 * @param {string} [data.reaction] - Description of allergic reaction symptoms
 * @param {string} [data.treatment] - Emergency treatment protocol
 * @param {boolean} data.verified - Whether allergy has been clinically verified
 * @param {string} [data.verifiedBy] - Healthcare professional who verified the allergy
 * @param {Date} [data.verifiedAt] - Verification timestamp (auto-set if verified=true)
 * @param {string} [data.notes] - Additional clinical notes
 * @param {string} [data.healthRecordId] - Optional link to comprehensive health record
 * @param {Transaction} [transaction] - Sequelize transaction for atomic multi-operation workflows
 *
 * @returns {Promise<AllergyModel>} Created allergy record with student and health record associations
 *
 * @throws {Error} Student not found - if studentId doesn't exist in database
 * @throws {Error} Duplicate allergy - if student already has active allergy for this allergen
 * @throws {Error} Validation error - if required fields are missing or invalid
 * @throws {Error} Database error - if Sequelize operation fails
 *
 * @security Automatically logs PHI access with allergen, severity, and student ID
 * @compliance HIPAA audit logging, allergy documentation standards
 *
 * @example
 * ```typescript
 * // Document severe penicillin allergy
 * const allergyRecord = await createAllergy({
 *   studentId: 'student-uuid-123',
 *   allergen: 'Penicillin',
 *   allergenType: 'MEDICATION',
 *   severity: 'SEVERE',
 *   reaction: 'Anaphylaxis, difficulty breathing, hives',
 *   treatment: 'Epinephrine auto-injector, call 911 immediately',
 *   verified: true,
 *   verifiedBy: 'nurse-uuid-456',
 *   notes: 'Parent-reported, confirmed by medical records'
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Document life-threatening peanut allergy
 * const peanutAllergy = await createAllergy({
 *   studentId: 'student-uuid-789',
 *   allergen: 'Peanuts',
 *   allergenType: 'FOOD',
 *   severity: 'LIFE_THREATENING',
 *   reaction: 'Anaphylactic shock',
 *   treatment: 'EpiPen on file in health office',
 *   verified: true,
 *   verifiedBy: 'nurse-uuid-456'
 * });
 * ```
 *
 * @warning Always verify severe/life-threatening allergies with healthcare professionals
 * @warning Cross-check new medication allergies against current medication administration records
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
 * Retrieves a specific allergy record by ID with automatic PHI audit logging.
 *
 * Fetches complete allergy information including associated student demographics
 * and linked health records. All PHI access is automatically logged for HIPAA
 * compliance. Use this for medication cross-checking before administration.
 *
 * @param {string} id - Unique allergy record identifier (UUID)
 * @param {Transaction} [transaction] - Optional Sequelize transaction for consistency
 *
 * @returns {Promise<AllergyModel | null>} Allergy record with associations, or null if not found
 *
 * @throws {Error} Database error - if Sequelize query fails
 *
 * @security Logs PHI access with allergy ID and student ID for audit trail
 * @compliance HIPAA audit logging requirement for PHI access
 *
 * @example
 * ```typescript
 * // Retrieve allergy for medication cross-check
 * const allergy = await getAllergyById('allergy-uuid-123');
 * if (allergy && allergy.severity === 'LIFE_THREATENING') {
 *   console.warn(`CRITICAL: Patient has life-threatening ${allergy.allergen} allergy`);
 *   // Trigger clinical decision support alert
 * }
 * ```
 *
 * @remarks
 * Returns null if allergy ID doesn't exist. Always check for null before accessing
 * properties. Includes student date of birth for age-based clinical decision support.
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
 * Updates an existing allergy record with change tracking and PHI audit logging.
 *
 * Modifies allergy information while preserving audit trail of all changes. Automatically
 * sets verification timestamp when verified status changes from false to true. All updates
 * are logged with before/after values for clinical and compliance purposes.
 *
 * @param {string} id - Unique allergy record identifier to update
 * @param {UpdateAllergyData} data - Partial allergy data to update
 * @param {string} [data.allergen] - Updated allergen name
 * @param {AllergySeverity} [data.severity] - Updated severity level
 * @param {string} [data.reaction] - Updated reaction description
 * @param {string} [data.treatment] - Updated treatment protocol
 * @param {boolean} [data.verified] - Verification status (auto-timestamps when true)
 * @param {string} [data.verifiedBy] - Healthcare professional verifying the update
 * @param {boolean} [data.isActive] - Active status flag
 * @param {string} [data.notes] - Updated clinical notes
 * @param {Transaction} [transaction] - Optional transaction for atomic operations
 *
 * @returns {Promise<AllergyModel>} Updated allergy record with current associations
 *
 * @throws {Error} Allergy not found - if ID doesn't exist
 * @throws {Error} Validation error - if update data is invalid
 * @throws {Error} Database error - if Sequelize update fails
 *
 * @security Logs old and new values for allergen, severity, and verification status
 * @compliance HIPAA audit trail for PHI modifications, allergy documentation standards
 *
 * @example
 * ```typescript
 * // Healthcare professional verifies parent-reported allergy
 * const verified = await updateAllergy('allergy-uuid-123', {
 *   verified: true,
 *   verifiedBy: 'nurse-uuid-456',
 *   notes: 'Verified with primary care physician records'
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Update severity based on new clinical information
 * const updated = await updateAllergy('allergy-uuid-789', {
 *   severity: 'LIFE_THREATENING',
 *   reaction: 'Previous reaction resulted in hospitalization',
 *   treatment: 'Updated emergency protocol - EpiPen two-pack required',
 *   verifiedBy: 'doctor-uuid-999'
 * });
 * ```
 *
 * @warning Severity changes may require medication administration protocol updates
 * @warning Always provide verifiedBy when making clinical updates
 *
 * @remarks
 * Verification timestamp is automatically set when verified changes from false to true.
 * Cannot be unset once verified=true (clinical best practice).
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
 * Soft-deletes (deactivates) an allergy record while preserving data for clinical history.
 *
 * Sets the allergy's active flag to false rather than permanently deleting the record.
 * This maintains a complete clinical history while removing the allergy from active
 * medication cross-checking. Use this when an allergy is no longer current but should
 * remain in historical records.
 *
 * @param {string} id - Unique allergy record identifier to deactivate
 * @param {Transaction} [transaction] - Optional transaction for atomic operations
 *
 * @returns {Promise<{success: boolean}>} Success status object
 *
 * @throws {Error} Allergy not found - if ID doesn't exist
 * @throws {Error} Database error - if Sequelize update fails
 *
 * @security Logs deactivation event with allergy details for audit trail
 * @compliance HIPAA audit logging, clinical history preservation requirements
 *
 * @example
 * ```typescript
 * // Deactivate resolved childhood allergy
 * const result = await deactivateAllergy('allergy-uuid-123');
 * if (result.success) {
 *   console.log('Allergy deactivated - no longer in active cross-check');
 * }
 * ```
 *
 * @remarks
 * Prefer deactivation over permanent deletion to maintain complete clinical history.
 * Deactivated allergies are excluded from active medication cross-checking but remain
 * queryable for historical review. Can be reactivated via updateAllergy if needed.
 *
 * @warning Deactivated allergies will NOT trigger medication interaction warnings
 * @warning Only deactivate allergies after clinical consultation confirming resolution
 *
 * @see {@link deleteAllergy} for permanent deletion (rarely recommended)
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
 * Permanently deletes an allergy record from the database.
 *
 * **USE WITH EXTREME CAUTION** - This is a hard delete that permanently removes the
 * allergy record. This operation should RARELY be used as it eliminates clinical history.
 * Prefer deactivateAllergy() to maintain complete patient records. Only use for data
 * correction errors or compliance requirements (e.g., patient data deletion requests).
 *
 * @param {string} id - Unique allergy record identifier to permanently delete
 * @param {Transaction} [transaction] - Optional transaction for atomic operations
 *
 * @returns {Promise<{success: boolean}>} Success status object
 *
 * @throws {Error} Allergy not found - if ID doesn't exist
 * @throws {Error} Database error - if Sequelize deletion fails
 *
 * @security Logs complete allergy data before deletion for permanent audit record
 * @compliance HIPAA audit logging, right-to-deletion compliance, clinical history standards
 *
 * @example
 * ```typescript
 * // Correct duplicate data entry error (rare use case)
 * const result = await deleteAllergy('duplicate-allergy-uuid');
 * console.warn('Permanent deletion logged for compliance audit');
 * ```
 *
 * @warning PERMANENT DELETION - Cannot be undone
 * @warning Eliminates clinical history - use deactivateAllergy() instead in most cases
 * @warning May impact medication cross-checking historical reports
 * @warning Requires appropriate authorization level in production environments
 *
 * @remarks
 * Captures allergy data (allergen, severity, student info) before deletion for audit log.
 * Deletion is logged at WARN level due to severity of action. Consider implementing
 * additional authorization checks before calling this function in production.
 *
 * @see {@link deactivateAllergy} for soft-delete (recommended approach)
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
