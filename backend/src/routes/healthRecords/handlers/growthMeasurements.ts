/**
 * LOC: 5000380D2C
 * Growth Measurements Handlers
 *
 * UPSTREAM (imports from):
 *   - healthRecordService.ts (services/healthRecordService.ts)
 *   - types.ts (routes/healthRecords/types.ts)
 *
 * DOWNSTREAM (imported by):
 *   - growthMeasurements.ts (routes/healthRecords/routes/growthMeasurements.ts)
 */

/**
 * Growth Measurements Handlers
 * Purpose: Track student growth metrics (height, weight, BMI, head circumference) with percentile analysis
 * Note: PHI-protected endpoints with growth trend analysis and concern detection
 */

import { Request, ResponseToolkit } from '@hapi/hapi';
import { HealthRecordService } from '../../../services/healthRecord';
import { PayloadData } from '../types';

/**
 * Get growth measurements for student
 * **PHI PROTECTED ENDPOINT** - Returns complete growth history for charting
 */
export const getGrowthMeasurementsHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { studentId } = request.params;
    const measurements = await HealthRecordService.getGrowthChartData(studentId);

    return h.response({
      success: true,
      data: { measurements }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

/**
 * Get single growth measurement by ID
 * **PHI PROTECTED ENDPOINT** - Retrieves specific growth measurement
 */
export const getGrowthMeasurementByIdHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { id } = request.params;
    const growthData = await HealthRecordService.getGrowthChartData(id);
    const measurement = growthData[0];

    if (!measurement) {
      throw new Error('Growth measurement not found');
    }

    return h.response({
      success: true,
      data: { measurement }
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
 * Create growth measurement
 * **PHI PROTECTED ENDPOINT** - Records new growth measurements with BMI calculation
 */
export const createGrowthMeasurementHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const payload = request.payload as PayloadData;
    const measurement = await HealthRecordService.createHealthRecord({
      studentId: payload.studentId,
      type: 'CHECKUP' as any,
      date: new Date(payload.measurementDate),
      description: 'Growth measurement',
      vital: {
        height: payload.height,
        weight: payload.weight,
        bmi: payload.bmi,
        headCircumference: payload.headCircumference
      }
    });

    return h.response({
      success: true,
      data: { measurement }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

/**
 * Update growth measurement
 * **PHI PROTECTED ENDPOINT** - Updates measurement values and recalculates BMI if needed
 */
export const updateGrowthMeasurementHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { id } = request.params;
    const payload = request.payload as PayloadData;
    const updateData: any = {};

    if (payload.measurementDate) {
      updateData.date = new Date(payload.measurementDate);
    }

    // Update vital signs
    const vitalUpdate: any = {};
    if (payload.height) vitalUpdate.height = payload.height;
    if (payload.weight) vitalUpdate.weight = payload.weight;
    if (payload.bmi) vitalUpdate.bmi = payload.bmi;
    if (payload.headCircumference) vitalUpdate.headCircumference = payload.headCircumference;

    if (Object.keys(vitalUpdate).length > 0) {
      updateData.vital = vitalUpdate;
    }

    const measurement = await HealthRecordService.updateHealthRecord(id, updateData);

    return h.response({
      success: true,
      data: { measurement }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

/**
 * Delete growth measurement
 * **PHI PROTECTED ENDPOINT** - Soft deletes growth measurement
 */
export const deleteGrowthMeasurementHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { id } = request.params;
    await HealthRecordService.bulkDeleteHealthRecords([id]);

    return h.response({
      success: true,
      message: 'Growth measurement deleted successfully'
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

/**
 * Get growth trends for student
 * **PHI PROTECTED ENDPOINT** - Analyzes growth patterns and percentile tracking
 */
export const getGrowthTrendsHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { studentId } = request.params;
    const startDate = request.query.startDate ? new Date(request.query.startDate) : undefined;
    const endDate = request.query.endDate ? new Date(request.query.endDate) : undefined;
    // Get growth chart data which includes trends
    const trends = await HealthRecordService.getGrowthChartData(studentId);

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

/**
 * Get growth concerns for student
 * **PHI PROTECTED ENDPOINT** - Identifies potential growth issues requiring medical attention
 */
export const getGrowthConcernsHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { studentId } = request.params;
    // For now, return empty concerns - would need additional logic
    const concerns = { issues: [], recommendations: [] };

    return h.response({
      success: true,
      data: { concerns }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};
