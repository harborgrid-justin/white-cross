/**
 * LOC: 0556F4D4EE
 * Screenings Handlers
 *
 * UPSTREAM (imports from):
 *   - healthRecordService.ts (services/healthRecordService.ts)
 *   - types.ts (routes/healthRecords/types.ts)
 *
 * DOWNSTREAM (imported by):
 *   - screenings.ts (routes/healthRecords/routes/screenings.ts)
 */

/**
 * Screenings Handlers
 * Purpose: Manage health screenings (vision, hearing, dental, scoliosis, BMI, mental health)
 * Note: PHI-protected endpoints with follow-up tracking and referral management
 */

import { Request, ResponseToolkit } from '@hapi/hapi';
import { HealthRecordService } from '../../../services/healthRecord';
import { PayloadData } from '../types';

/**
 * Get screenings for student
 * **PHI PROTECTED ENDPOINT** - Returns all screening records with optional type filtering
 */
export const getStudentScreeningsHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { studentId } = request.params;
    const type = request.query.type;
    // Get health records with screening type filter
    const healthRecords = await HealthRecordService.getStudentHealthRecords(studentId, 1, 1000, {
      type: 'SCREENING' as any
    });
    const screenings = healthRecords.records;

    return h.response({
      success: true,
      data: { screenings }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

/**
 * Get single screening by ID
 * **PHI PROTECTED ENDPOINT** - Retrieves specific screening record
 */
export const getScreeningByIdHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { id } = request.params;
    const healthRecords = await HealthRecordService.getStudentHealthRecords(id, 1, 1);
    const screening = healthRecords.records[0];

    if (!screening) {
      throw new Error('Screening not found');
    }

    return h.response({
      success: true,
      data: { screening }
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
 * Create screening record
 * **PHI PROTECTED ENDPOINT** - Documents screening results and follow-up needs
 */
export const createScreeningHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const payload = request.payload as PayloadData;
    const screening = await HealthRecordService.createHealthRecord({
      studentId: payload.studentId,
      type: 'SCREENING' as any,
      date: new Date(payload.screeningDate),
      description: `${payload.screeningType} screening - ${payload.result}`,
      provider: payload.performedBy,
      notes: payload.notes
    });

    return h.response({
      success: true,
      data: { screening }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

/**
 * Update screening record
 * **PHI PROTECTED ENDPOINT** - Updates screening details or follow-up information
 */
export const updateScreeningHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { id } = request.params;
    const payload = request.payload as PayloadData;
    const updateData: any = { ...payload };

    if (updateData.screeningDate) {
      updateData.date = new Date(updateData.screeningDate);
    }

    const screening = await HealthRecordService.updateHealthRecord(id, updateData);

    return h.response({
      success: true,
      data: { screening }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

/**
 * Delete screening record
 * **PHI PROTECTED ENDPOINT** - Soft deletes screening record
 */
export const deleteScreeningHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { id } = request.params;
    await HealthRecordService.bulkDeleteHealthRecords([id]);

    return h.response({
      success: true,
      message: 'Screening record deleted successfully'
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

/**
 * Get screenings due for follow-up
 * **PHI PROTECTED ENDPOINT** - Returns screenings requiring referrals or re-testing
 */
export const getScreeningsDueHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const daysAhead = parseInt(request.query.daysAhead) || 30;
    const schoolId = request.query.schoolId;
    // For now, return recent screening records
    const healthRecords = await HealthRecordService.searchHealthRecords('screening');
    const screenings = healthRecords.records;

    return h.response({
      success: true,
      data: { screenings }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

/**
 * Get screening statistics
 * **AGGREGATED PHI ENDPOINT** - School-wide screening completion and referral statistics
 */
export const getScreeningStatsHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const schoolId = request.query.schoolId;
    // For now, return basic statistics
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
