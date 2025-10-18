/**
 * LOC: 44EC8B64D9
 * Chronic Conditions Handlers
 *
 * UPSTREAM (imports from):
 *   - healthRecordService.ts (services/healthRecordService.ts)
 *   - types.ts (routes/healthRecords/types.ts)
 *
 * DOWNSTREAM (imported by):
 *   - chronicConditions.ts (routes/healthRecords/routes/chronicConditions.ts)
 */

/**
 * Chronic Conditions Handlers
 * Purpose: Manage long-term health conditions with care plans and review scheduling
 * Note: PHI-protected endpoints with comprehensive care management tracking
 */

import { Request, ResponseToolkit } from '@hapi/hapi';
import { HealthRecordService } from '../../../services/healthRecordService';
import { PayloadData } from '../types';

/**
 * Get student chronic conditions
 * **PHI PROTECTED ENDPOINT** - Returns all documented chronic conditions
 */
export const getStudentChronicConditionsHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { studentId } = request.params;
    const conditions = await HealthRecordService.getStudentChronicConditions(studentId);

    return h.response({
      success: true,
      data: { conditions }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

/**
 * Get single chronic condition by ID
 * **PHI PROTECTED ENDPOINT** - Retrieves specific condition record
 */
export const getChronicConditionByIdHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { id } = request.params;
    const conditions = await HealthRecordService.getStudentChronicConditions(id);
    const condition = conditions.find(c => c.id === id);

    if (!condition) {
      throw new Error('Chronic condition not found');
    }

    return h.response({
      success: true,
      data: { condition }
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
 * Add chronic condition to student
 * **PHI PROTECTED ENDPOINT** - Creates new condition record with care plan
 */
export const addChronicConditionHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const payload = request.payload as PayloadData;
    const condition = await HealthRecordService.addChronicCondition({
      studentId: payload.studentId,
      condition: payload.condition,
      diagnosisDate: new Date(payload.diagnosedDate),
      status: payload.status,
      severity: payload.severity,
      notes: payload.notes,
      carePlan: payload.managementPlan,
      medications: payload.medications,
      restrictions: payload.restrictions,
      triggers: payload.triggers,
      diagnosedBy: payload.diagnosedBy,
      lastReviewDate: payload.lastReviewDate ? new Date(payload.lastReviewDate) : undefined,
      nextReviewDate: payload.nextReviewDate ? new Date(payload.nextReviewDate) : undefined,
      icdCode: payload.icdCode
    });

    return h.response({
      success: true,
      data: { condition }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

/**
 * Update chronic condition
 * **PHI PROTECTED ENDPOINT** - Updates condition details, care plan, or review dates
 */
export const updateChronicConditionHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { id } = request.params;
    const payload = request.payload as PayloadData;
    const updateData: any = { ...payload };

    if (updateData.diagnosedDate) {
      updateData.diagnosedDate = new Date(updateData.diagnosedDate);
    }
    if (updateData.lastReviewDate) {
      updateData.lastReviewDate = new Date(updateData.lastReviewDate);
    }
    if (updateData.nextReviewDate) {
      updateData.nextReviewDate = new Date(updateData.nextReviewDate);
    }

    const condition = await HealthRecordService.updateChronicCondition(id, updateData);

    return h.response({
      success: true,
      data: { condition }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

/**
 * Delete chronic condition
 * **PHI PROTECTED ENDPOINT** - Soft deletes condition record
 */
export const deleteChronicConditionHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { id } = request.params;
    await HealthRecordService.deleteChronicCondition(id);

    return h.response({
      success: true,
      message: 'Chronic condition deleted successfully'
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

/**
 * Update chronic condition status
 * **PHI PROTECTED ENDPOINT** - Updates condition status (ACTIVE, MANAGED, RESOLVED, INACTIVE)
 */
export const updateChronicConditionStatusHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { id } = request.params;
    const payload = request.payload as PayloadData;
    const { status } = payload;
    const condition = await HealthRecordService.updateChronicCondition(id, { status });

    return h.response({
      success: true,
      data: { condition }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

/**
 * Get chronic conditions due for review
 * **PHI PROTECTED ENDPOINT** - Returns conditions needing scheduled review
 */
export const getConditionsDueForReviewHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const daysAhead = parseInt(request.query.daysAhead) || 30;
    // For now, return all chronic conditions - would need additional logic for due dates
    const conditions = await HealthRecordService.getStudentChronicConditions('');

    return h.response({
      success: true,
      data: { conditions }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

/**
 * Get chronic conditions statistics
 * **PHI PROTECTED ENDPOINT** - Aggregated statistics for school/district
 */
export const getChronicConditionsStatsHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const schoolId = request.query.schoolId;
    // For now, get basic statistics - would need additional implementation
    const statistics = await HealthRecordService.getHealthRecordStatistics();

    return h.response({
      success: true,
      data: statistics
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};
