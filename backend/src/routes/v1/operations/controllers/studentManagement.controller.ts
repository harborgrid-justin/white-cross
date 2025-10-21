/**
 * Student Management Controller
 * Business logic for student photo management, academic transcripts, grade transitions, and operational features
 */

import { ResponseToolkit } from '@hapi/hapi';
import { AuthenticatedRequest } from '../../../shared/types/route.types';
import { successResponse, createdResponse } from '../../../shared/utils';
import { logger } from '../../../../shared/logging/logger';
import { StudentPhotoService } from '../../../../services/studentPhotoService';
import { AcademicTranscriptService } from '../../../../services/academicTranscriptService';
import { GradeTransitionService } from '../../../../services/gradeTransitionService';
import * as AdvancedFeatures from '../../../../services/advancedFeatures';
import * as EnterpriseFeatures from '../../../../services/enterpriseFeatures';

export class StudentManagementController {
  /**
   * STUDENT PHOTO MANAGEMENT METHODS
   */

  static async uploadPhoto(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const { imageData, metadata } = request.payload as any;
    const userId = request.auth.credentials.userId;

    const result = await StudentPhotoService.uploadPhoto({
      studentId,
      imageData,
      uploadedBy: userId,
      metadata
    });

    logger.info('Student photo uploaded', { 
      studentId,
      photoId: result.id,
      userId 
    });

    return createdResponse(h, { photo: result });
  }

  static async searchByPhoto(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { imageData, threshold = 0.85 } = request.payload as any;
    const userId = request.auth.credentials.userId;

    const matches = await StudentPhotoService.searchByPhoto(imageData, threshold);

    logger.info('Photo search performed', { 
      matchCount: matches.length,
      threshold,
      userId 
    });

    return successResponse(h, { matches });
  }

  /**
   * ACADEMIC TRANSCRIPT METHODS
   */

  static async importTranscript(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const userId = request.auth.credentials.userId;
    const transcriptData = {
      ...request.payload as any,
      studentId,
      importedBy: userId,
      importedAt: new Date()
    };

    const result = await AcademicTranscriptService.importTranscript(transcriptData);

    logger.info('Academic transcript imported', { 
      studentId,
      transcriptId: result.id,
      gradeCount: transcriptData.grades?.length || 0,
      userId 
    });

    return createdResponse(h, { transcript: result });
  }

  static async getAcademicHistory(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const userId = request.auth.credentials.userId;

    const history = await AcademicTranscriptService.getAcademicHistory(studentId);

    logger.info('Academic history retrieved', { 
      studentId,
      transcriptCount: history.transcripts?.length || 0,
      userId 
    });

    return successResponse(h, { academicHistory: history });
  }

  static async getPerformanceTrends(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const userId = request.auth.credentials.userId;

    const trends = await AcademicTranscriptService.analyzePerformanceTrends(studentId);

    logger.info('Performance trends analyzed', { 
      studentId,
      trendCount: trends.trends?.length || 0,
      userId 
    });

    return successResponse(h, { performanceTrends: trends });
  }

  /**
   * GRADE TRANSITION METHODS
   */

  static async performBulkGradeTransition(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { effectiveDate, dryRun = false, criteria } = request.payload as any;
    const userId = request.auth.credentials.userId;

    const result = await GradeTransitionService.performBulkTransition(effectiveDate, dryRun, criteria);

    const logLevel = dryRun ? 'info' : 'warn';
    logger[logLevel]('Bulk grade transition performed', { 
      effectiveDate,
      dryRun,
      studentsAffected: result.studentsProcessed,
      promoted: result.promoted,
      retained: result.retained,
      graduated: result.graduated,
      userId 
    });

    return successResponse(h, { transitionResults: result });
  }

  static async getGraduatingStudents(request: AuthenticatedRequest, h: ResponseToolkit) {
    const userId = request.auth.credentials.userId;

    const students = await GradeTransitionService.getGraduatingStudents();

    logger.info('Graduating students retrieved', { 
      studentCount: students.length,
      userId 
    });

    return successResponse(h, { graduatingStudents: students });
  }

  /**
   * BARCODE SCANNING METHODS
   */

  static async scanBarcode(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { barcodeString, scanType = 'general' } = request.payload as any;
    const userId = request.auth.credentials.userId;

    const result = await AdvancedFeatures.BarcodeScanningService.scanBarcode(barcodeString, scanType);

    logger.info('Barcode scanned', { 
      scanType,
      barcodeType: result.type,
      entityFound: !!result.entity,
      userId 
    });

    return successResponse(h, { barcodeResult: result });
  }

  static async verifyMedicationAdministration(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentBarcode, medicationBarcode, nurseBarcode } = request.payload as any;
    const userId = request.auth.credentials.userId;

    const result = await AdvancedFeatures.BarcodeScanningService.verifyMedicationAdministration(
      studentBarcode,
      medicationBarcode,
      nurseBarcode
    );

    logger.info('Medication administration verified', { 
      verificationPassed: result.verified,
      studentId: result.studentId,
      medicationId: result.medicationId,
      fiveRightsChecked: result.fiveRightsChecks,
      userId 
    });

    return successResponse(h, { verificationResult: result });
  }

  /**
   * WAITLIST MANAGEMENT METHODS
   */

  static async addToWaitlist(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId, appointmentType, priority = 'medium', notes } = request.payload as any;
    const userId = request.auth.credentials.userId;

    const result = await EnterpriseFeatures.WaitlistManagementService.addToWaitlist(
      studentId, 
      appointmentType, 
      priority,
      { addedBy: userId, notes }
    );

    logger.info('Student added to waitlist', { 
      studentId,
      appointmentType,
      priority,
      waitlistPosition: result.position,
      userId 
    });

    return createdResponse(h, { waitlistEntry: result });
  }

  static async getWaitlistStatus(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const userId = request.auth.credentials.userId;

    const status = await EnterpriseFeatures.WaitlistManagementService.getWaitlistStatus(studentId);

    logger.info('Waitlist status retrieved', { 
      studentId,
      activeWaitlists: status.waitlists?.length || 0,
      userId 
    });

    return successResponse(h, { waitlistStatus: status });
  }
}
