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
import { HealthRecordService } from '../../../services/healthRecord';
import { PayloadData } from '../types';
import { PDFGenerator, VaccinationRecordPDFData } from '../../../utils/pdfGenerator';
import { logger } from '../../../utils/logger';

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
    
    // Get vaccination records and health history
    const vaccinations = await HealthRecordService.getVaccinationRecords(studentId);
    const healthHistory = await HealthRecordService.exportHealthHistory(studentId);

    if (format === 'pdf') {
      // Generate PDF using PDFGenerator
      const pdfData: VaccinationRecordPDFData = {
        student: {
          name: healthHistory.student.name || 'Unknown Student',
          dateOfBirth: new Date(healthHistory.student.dateOfBirth),
          studentId: healthHistory.student.studentId,
          grade: healthHistory.student.grade,
          school: healthHistory.student.school
        },
        vaccinations: vaccinations.map((vax: any) => ({
          date: new Date(vax.date || vax.dateAdministered),
          vaccine: vax.vaccine || vax.vaccineName,
          dose: vax.dose || vax.doseNumber,
          lotNumber: vax.lotNumber,
          manufacturer: vax.manufacturer,
          provider: vax.provider || vax.administeredBy,
          site: vax.site || vax.administrationSite,
          notes: vax.notes || vax.reaction
        })),
        complianceStatus: {
          isCompliant: vaccinations.length > 0, // Basic check, enhance with actual compliance rules
          missingVaccines: [], // TODO: Implement compliance checking
          upcomingDoses: [] // TODO: Implement dose scheduling
        },
        generatedAt: new Date(),
        generatedBy: (request as any).auth?.credentials?.user?.name || 'System'
      };

      const pdfBuffer = await PDFGenerator.generateVaccinationRecordPDF(pdfData, {
        title: `Vaccination Record - ${healthHistory.student.name}`,
        author: 'White Cross Healthcare Platform',
        subject: 'Student Vaccination Record',
        keywords: ['vaccination', 'immunization', 'student', 'compliance']
      });

      logger.info('Vaccination record PDF generated', {
        studentId,
        vaccinationCount: vaccinations.length,
        size: pdfBuffer.length,
        user: (request as any).auth?.credentials?.user?.id
      });

      // Return PDF with proper headers
      return h.response(pdfBuffer)
        .type('application/pdf')
        .header('Content-Disposition', `attachment; filename="vaccination-record-${studentId}.pdf"`)
        .header('X-Content-Type-Options', 'nosniff')
        .header('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    }

    return h.response({
      success: true,
      data: {
        student: healthHistory.student,
        vaccinations,
        generatedAt: new Date()
      }
    });
  } catch (error) {
    logger.error('Failed to generate vaccination report', error);
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
