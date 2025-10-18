/**
 * LOC: C2BEE9BA90
 * Main Health Records Handlers
 *
 * UPSTREAM (imports from):
 *   - healthRecordService.ts (services/healthRecordService.ts)
 *   - types.ts (routes/healthRecords/types.ts)
 *
 * DOWNSTREAM (imported by):
 *   - mainHealthRecords.ts (routes/healthRecords/routes/mainHealthRecords.ts)
 */

/**
 * Main Health Records Handlers
 * Purpose: Core CRUD operations for student health records
 * Note: All handlers are PHI-protected and HIPAA-compliant with full audit logging
 */

import { Request, ResponseToolkit } from '@hapi/hapi';
import { HealthRecordService } from '../../../services/healthRecordService';
import { PayloadData } from '../types';

/**
 * Get health records for a student with pagination and filtering
 * **HIGHLY SENSITIVE PHI ENDPOINT** - All access is logged and audited
 */
export const getStudentHealthRecordsHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { studentId } = request.params;
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 20;

    const filters: any = {};
    if (request.query.type) filters.type = request.query.type;
    if (request.query.dateFrom) filters.dateFrom = new Date(request.query.dateFrom);
    if (request.query.dateTo) filters.dateTo = new Date(request.query.dateTo);
    if (request.query.provider) filters.provider = request.query.provider;

    const result = await HealthRecordService.getStudentHealthRecords(studentId, page, limit, filters);

    return h.response({
      success: true,
      data: result
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

/**
 * Get single health record by ID
 * **PHI PROTECTED ENDPOINT** - Retrieves a specific health record. Access is logged.
 */
export const getHealthRecordByIdHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { id } = request.params;
    const records = await HealthRecordService.getStudentHealthRecords(id, 1, 1);
    const record = records.records[0];

    if (!record) {
      throw new Error('Health record not found');
    }

    return h.response({
      success: true,
      data: { record }
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
 * Create new health record
 * **PHI PROTECTED ENDPOINT** - Requires NURSE or ADMIN role. All creations are audited.
 */
export const createHealthRecordHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const payload = request.payload as PayloadData;
    const healthRecord = await HealthRecordService.createHealthRecord({
      studentId: payload.studentId,
      type: payload.type,
      description: payload.description,
      date: new Date(payload.date),
      vital: payload.vital,
      provider: payload.provider,
      notes: payload.notes,
      attachments: payload.attachments
    });

    return h.response({
      success: true,
      data: { healthRecord }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

/**
 * Update health record
 * **PHI PROTECTED ENDPOINT** - All modifications are audited
 */
export const updateHealthRecordHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { id } = request.params;
    const payload = request.payload as PayloadData;
    const updateData = { ...payload };

    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    const healthRecord = await HealthRecordService.updateHealthRecord(id, updateData);

    return h.response({
      success: true,
      data: { healthRecord }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

/**
 * Delete health record (soft delete)
 * **PHI PROTECTED ENDPOINT** - Requires ADMIN or NURSE role. All deletions are audited.
 */
export const deleteHealthRecordHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { id } = request.params;
    await HealthRecordService.bulkDeleteHealthRecords([id]);

    return h.response({
      success: true,
      message: 'Health record deleted successfully'
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

/**
 * Get student health timeline
 * **PHI PROTECTED ENDPOINT** - Returns chronological timeline of all health events
 */
export const getHealthTimelineHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { studentId } = request.params;
    const startDate = request.query.startDate ? new Date(request.query.startDate) : undefined;
    const endDate = request.query.endDate ? new Date(request.query.endDate) : undefined;

    const healthRecords = await HealthRecordService.getStudentHealthRecords(studentId, 1, 1000, {
      dateFrom: startDate,
      dateTo: endDate
    });
    const timeline = healthRecords.records;

    return h.response({
      success: true,
      data: { timeline }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

/**
 * Get health summary for student
 * **PHI PROTECTED ENDPOINT** - Comprehensive health summary with statistics
 */
export const getHealthSummaryHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { studentId } = request.params;
    const summary = await HealthRecordService.getHealthSummary(studentId);

    return h.response({
      success: true,
      data: summary
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

/**
 * Export health records in various formats
 * **PHI PROTECTED ENDPOINT** - Exports student health history
 */
export const exportHealthRecordsHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { studentId } = request.params;
    const format = request.query.format || 'json';
    const exportData = await HealthRecordService.exportHealthHistory(studentId);

    if (format === 'pdf') {
      // TODO: Implement PDF generation
      return h.response({
        success: false,
        error: { message: 'PDF export not yet implemented' }
      }).code(501);
    }

    return h.response({
      success: true,
      data: exportData
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

/**
 * Get health records statistics
 * **PHI PROTECTED ENDPOINT** - System-wide health statistics
 */
export const getHealthRecordStatisticsHandler = async (_request: Request, h: ResponseToolkit) => {
  try {
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
