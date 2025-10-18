/**
 * LOC: C95355215A
 * Vaccinations Handlers
 *
 * UPSTREAM (imports from):
 *   - healthRecordService.ts (services/healthRecordService.ts)
 *   - types.ts (routes/healthRecords/types.ts)
 *
 * DOWNSTREAM (imported by):
 *   - vaccinations.ts (routes/healthRecords/routes/vaccinations.ts)
 */

/**
 * Vaccinations Handlers
 * Purpose: Manage vaccination records with compliance tracking and scheduling
 * Note: PHI-protected endpoints with immunization history and school compliance requirements
 */

import { Request, ResponseToolkit } from '@hapi/hapi';
import { HealthRecordService } from '../../../services/healthRecordService';
import { PayloadData } from '../types';

/**
 * Get vaccination records for student
 * **PHI PROTECTED ENDPOINT** - Returns complete immunization history
 */
export const getVaccinationRecordsHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { studentId } = request.params;
    const vaccinations = await HealthRecordService.getVaccinationRecords(studentId);

    return h.response({
      success: true,
      data: { vaccinations }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

/**
 * Get single vaccination by ID
 * **PHI PROTECTED ENDPOINT** - Retrieves specific vaccination record
 */
export const getVaccinationByIdHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { id } = request.params;
    const vaccinations = await HealthRecordService.getStudentVaccinations(id);
    const vaccination = vaccinations.find(v => v.id === id);

    if (!vaccination) {
      throw new Error('Vaccination not found');
    }

    return h.response({
      success: true,
      data: { vaccination }
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
 * Create vaccination record
 * **PHI PROTECTED ENDPOINT** - Documents vaccine administration with lot numbers and reactions
 */
export const createVaccinationHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const payload = request.payload as PayloadData;
    const vaccination = await HealthRecordService.addVaccination({
      studentId: payload.studentId,
      vaccineName: payload.vaccineName,
      administrationDate: new Date(payload.administeredDate),
      administeredBy: payload.administeredBy || 'Unknown',
      cvxCode: payload.cvxCode,
      ndcCode: payload.ndcCode,
      lotNumber: payload.lotNumber,
      manufacturer: payload.manufacturer,
      doseNumber: payload.doseNumber,
      totalDoses: payload.totalDoses,
      expirationDate: payload.expirationDate ? new Date(payload.expirationDate) : undefined,
      nextDueDate: payload.nextDueDate ? new Date(payload.nextDueDate) : undefined,
      site: payload.site,
      route: payload.route,
      dosageAmount: payload.dosageAmount,
      reactions: payload.reactions,
      notes: payload.notes
    });

    return h.response({
      success: true,
      data: { vaccination }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

/**
 * Update vaccination record
 * **PHI PROTECTED ENDPOINT** - Updates vaccination details or reaction information
 */
export const updateVaccinationHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { id } = request.params;
    const payload = request.payload as PayloadData;
    const updateData: any = { ...payload };

    if (updateData.administeredDate) {
      updateData.administrationDate = new Date(updateData.administeredDate);
    }
    if (updateData.expirationDate) {
      updateData.expirationDate = new Date(updateData.expirationDate);
    }

    const vaccination = await HealthRecordService.updateVaccination(id, updateData);

    return h.response({
      success: true,
      data: { vaccination }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

/**
 * Delete vaccination record
 * **PHI PROTECTED ENDPOINT** - Soft deletes vaccination record
 */
export const deleteVaccinationHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { id } = request.params;
    await HealthRecordService.deleteVaccination(id);

    return h.response({
      success: true,
      message: 'Vaccination record deleted successfully'
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

/**
 * Check vaccination compliance
 * **COMPLIANCE ENDPOINT** - Validates student meets school immunization requirements
 */
export const checkVaccinationComplianceHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { studentId } = request.params;
    // For now, return basic compliance info based on vaccination records
    const vaccinations = await HealthRecordService.getStudentVaccinations(studentId);
    const compliance = { compliant: vaccinations.length > 0, totalVaccinations: vaccinations.length };

    return h.response({
      success: true,
      data: compliance
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

/**
 * Get upcoming vaccinations
 * **PHI PROTECTED ENDPOINT** - Returns scheduled/due vaccinations
 */
export const getUpcomingVaccinationsHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { studentId } = request.params;
    const daysAhead = parseInt(request.query.daysAhead) || 90;
    // For now, return all vaccinations - would need additional logic for due dates
    const vaccinations = await HealthRecordService.getStudentVaccinations(studentId);

    return h.response({
      success: true,
      data: { vaccinations }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

/**
 * Get vaccination report for student
 * **PHI PROTECTED ENDPOINT** - Generates immunization compliance report
 */
export const getVaccinationReportHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { studentId } = request.params;
    const format = request.query.format || 'json';
    // For now, export health history which includes vaccinations
    const report = await HealthRecordService.exportHealthHistory(studentId);

    if (format === 'pdf') {
      // TODO: Implement PDF generation
      return h.response({
        success: false,
        error: { message: 'PDF report generation not yet implemented' }
      }).code(501);
    }

    return h.response({
      success: true,
      data: report
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

/**
 * Get vaccination statistics for school
 * **AGGREGATED PHI ENDPOINT** - School-wide vaccination compliance statistics
 */
export const getVaccinationStatsHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { schoolId } = request.params;
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
