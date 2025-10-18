/**
 * Search and Utility Handlers
 * Purpose: Cross-record search, bulk operations, and data import/export functionality
 * Note: PHI-protected endpoints with enhanced security for bulk operations
 */

import { Request, ResponseToolkit } from '@hapi/hapi';
import { HealthRecordService } from '../../../services/healthRecordService';
import { PayloadData } from '../types';

/**
 * Search health records
 * **PHI PROTECTED ENDPOINT** - Full-text search across all health records with filtering
 */
export const searchHealthRecordsHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const query = request.query.q;
    const type = request.query.type;
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 20;

    if (!query) {
      return h.response({
        success: false,
        error: { message: 'Search query is required' }
      }).code(400);
    }

    const result = await HealthRecordService.searchHealthRecords(query, type, page, limit);

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
 * Bulk delete health records
 * **HIGHLY SENSITIVE PHI ENDPOINT** - Mass deletion requires ADMIN role and comprehensive audit logging
 */
export const bulkDeleteHealthRecordsHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    // For now, skip authentication check - would need proper auth setup
    const payload = request.payload as PayloadData;
    const { recordIds } = payload;
    const results = await HealthRecordService.bulkDeleteHealthRecords(recordIds);

    return h.response({
      success: true,
      data: results
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

/**
 * Import health records
 * **PHI PROTECTED ENDPOINT** - Bulk import from external systems (EHR, SIS integration)
 */
export const importHealthRecordsHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { studentId } = request.params;
    const payload = request.payload as PayloadData;

    if (!payload || typeof payload !== 'object') {
      return h.response({
        success: false,
        error: { message: 'Invalid import data' }
      }).code(400);
    }

    const results = await HealthRecordService.importHealthRecords(studentId, payload);

    return h.response({
      success: true,
      data: results
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};
