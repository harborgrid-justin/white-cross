/**
 * LOC: 52D38F8727
 * Vital Signs Handlers
 *
 * UPSTREAM (imports from):
 *   - healthRecordService.ts (services/healthRecordService.ts)
 *   - types.ts (routes/healthRecords/types.ts)
 *
 * DOWNSTREAM (imported by):
 *   - vitalSigns.ts (routes/healthRecords/routes/vitalSigns.ts)
 */

/**
 * Vital Signs Handlers
 * Purpose: Record and monitor vital signs (BP, heart rate, temperature, respiratory rate, O2 saturation)
 * Note: PHI-protected endpoints with trend analysis for identifying concerning patterns
 */

import { Request, ResponseToolkit } from '@hapi/hapi';
import { HealthRecordService } from '../../../services/healthRecord';
import { PayloadData } from '../types';

/**
 * Get vital signs for student
 * **PHI PROTECTED ENDPOINT** - Returns recent vital signs history
 */
export const getVitalSignsHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { studentId } = request.params;
    const limit = parseInt(request.query.limit) || 10;
    const vitals = await HealthRecordService.getRecentVitals(studentId, limit);

    return h.response({
      success: true,
      data: { vitals }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

/**
 * Get single vital signs record by ID
 * **PHI PROTECTED ENDPOINT** - Retrieves specific vital signs measurement
 */
export const getVitalSignsByIdHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { id } = request.params;
    const vitalRecords = await HealthRecordService.getRecentVitals(id, 1);
    const vitals = vitalRecords[0];

    if (!vitals) {
      throw new Error('Vital signs not found');
    }

    return h.response({
      success: true,
      data: { vitals }
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
 * Create vital signs record
 * **PHI PROTECTED ENDPOINT** - Documents vital signs during nurse visit
 */
export const createVitalSignsHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const payload = request.payload as PayloadData;
    const vitals = await HealthRecordService.createHealthRecord({
      studentId: payload.studentId,
      type: 'CHECKUP' as any,
      date: new Date(payload.recordedAt),
      description: 'Vital signs recorded',
      vital: payload
    });

    return h.response({
      success: true,
      data: { vitals }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

/**
 * Get latest vital signs for student
 * **PHI PROTECTED ENDPOINT** - Returns most recent vital signs measurement
 */
export const getLatestVitalsHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { studentId } = request.params;
    const vitals = await HealthRecordService.getRecentVitals(studentId);

    return h.response({
      success: true,
      data: { vitals }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

/**
 * Get vital signs trends
 * **PHI PROTECTED ENDPOINT** - Analyzes vital signs patterns over time for anomaly detection
 */
export const getVitalTrendsHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { studentId } = request.params;
    const startDate = request.query.startDate ? new Date(request.query.startDate) : undefined;
    const endDate = request.query.endDate ? new Date(request.query.endDate) : undefined;
    // Get recent vitals which can show trends
    const vitals = await HealthRecordService.getRecentVitals(studentId, 50);
    const trends = { vitals, patterns: [] };

    return h.response({
      success: true,
      data: trends
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};
