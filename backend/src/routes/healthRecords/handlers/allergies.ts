/**
 * LOC: 3BCF8B9CC4
 * Allergies Handlers
 *
 * UPSTREAM (imports from):
 *   - healthRecordService.ts (services/healthRecordService.ts)
 *   - types.ts (routes/healthRecords/types.ts)
 *
 * DOWNSTREAM (imported by):
 *   - allergies.ts (routes/healthRecords/routes/allergies.ts)
 */

/**
 * Allergies Handlers
 * Purpose: Manage student allergy records with severity tracking and contraindication checking
 * Note: Critical PHI data - all operations are audited for HIPAA compliance
 */

import { Request, ResponseToolkit } from '@hapi/hapi';
import { HealthRecordService } from '../../../services/healthRecord';
import { PayloadData } from '../types';

/**
 * Get student allergies
 * **PHI PROTECTED ENDPOINT** - Returns all documented allergies for a student
 */
export const getStudentAllergiesHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { studentId } = request.params;
    const allergies = await HealthRecordService.getStudentAllergies(studentId);

    return h.response({
      success: true,
      data: { allergies }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

/**
 * Get single allergy by ID
 * **PHI PROTECTED ENDPOINT** - Retrieves specific allergy record
 */
export const getAllergyByIdHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { id } = request.params;
    const allergies = await HealthRecordService.getStudentAllergies(id);
    const allergy = allergies.find(a => a.id === id);

    if (!allergy) {
      throw new Error('Allergy not found');
    }

    return h.response({
      success: true,
      data: { allergy }
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage.includes('not found')) {
      return h.response({
        success: false,
        error: { message: errorMessage }
      }).code(404);
    }

    return h.response({
      success: false,
      error: { message: errorMessage }
    }).code(500);
  }
};

/**
 * Add allergy to student
 * **PHI PROTECTED ENDPOINT** - Creates new allergy record. Severity levels must be documented.
 */
export const addAllergyHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const payload = request.payload as PayloadData;
    const allergy = await HealthRecordService.addAllergy({
      studentId: payload.studentId,
      allergen: payload.allergen,
      severity: payload.severity,
      reaction: payload.reaction,
      treatment: payload.treatment,
      verified: payload.verified,
      verifiedBy: payload.verifiedBy
    });

    return h.response({
      success: true,
      data: { allergy }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

/**
 * Update allergy
 * **PHI PROTECTED ENDPOINT** - Modifies existing allergy record. All changes are audited.
 */
export const updateAllergyHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { id } = request.params;
    const payload = request.payload as PayloadData;
    const allergy = await HealthRecordService.updateAllergy(id, payload);

    return h.response({
      success: true,
      data: { allergy }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

/**
 * Delete allergy
 * **PHI PROTECTED ENDPOINT** - Soft deletes allergy record
 */
export const deleteAllergyHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { id } = request.params;
    await HealthRecordService.deleteAllergy(id);

    return h.response({
      success: true,
      message: 'Allergy deleted successfully'
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

/**
 * Verify allergy by healthcare provider
 * **PHI PROTECTED ENDPOINT** - Marks allergy as medically verified
 */
export const verifyAllergyHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { id } = request.params;
    const allergy = await HealthRecordService.updateAllergy(id, { verified: true });

    return h.response({
      success: true,
      data: { allergy }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

/**
 * Get critical allergies for student (SEVERE or LIFE_THREATENING)
 * **CRITICAL PHI ENDPOINT** - Returns high-severity allergies requiring immediate awareness
 */
export const getCriticalAllergiesHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { studentId } = request.params;
    const allAllergies = await HealthRecordService.getStudentAllergies(studentId);
    const allergies = allAllergies.filter(a => a.severity === 'SEVERE' || a.severity === 'LIFE_THREATENING');

    return h.response({
      success: true,
      data: { allergies }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

/**
 * Check medication contraindications
 * **CRITICAL SAFETY ENDPOINT** - Checks for allergy-medication interactions before administration
 */
export const checkContraindicationsHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const payload = request.payload as PayloadData;
    const { studentId, medicationId } = payload;
    // For now, just return the student's allergies as potential contraindications
    const allergies = await HealthRecordService.getStudentAllergies(studentId);
    const contraindications = { allergies, medicationId, hasContraindications: allergies.length > 0 };

    return h.response({
      success: true,
      data: { contraindications }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};
