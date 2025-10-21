/**
 * Health Assessments Controller
 * Business logic for health risk assessments, screenings, growth tracking, and emergency notifications
 */

import { ResponseToolkit } from '@hapi/hapi';
import { AuthenticatedRequest } from '../../../shared/types/route.types';
import { successResponse, createdResponse } from '../../../shared/utils';
import { logger } from '../../../../shared/logging/logger';
import { HealthRiskAssessmentService } from '../../../../services/healthRiskAssessmentService';
import { MedicationInteractionService } from '../../../../services/medicationInteractionService';
import * as AdvancedFeatures from '../../../../services/advancedFeatures';

export class HealthAssessmentsController {
  /**
   * HEALTH RISK ASSESSMENT METHODS
   */

  static async getHealthRisk(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const userId = request.auth.credentials.userId;

    const assessment = await HealthRiskAssessmentService.calculateRiskScore(studentId);
    
    logger.info('Health risk assessment calculated', { 
      studentId, 
      riskScore: assessment.totalScore || assessment.score,
      userId 
    });

    return successResponse(h, assessment);
  }

  static async getHighRiskStudents(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { minScore = 50 } = request.query;
    const userId = request.auth.credentials.userId;

    const students = await HealthRiskAssessmentService.getHighRiskStudents(minScore);
    
    logger.info('High-risk students retrieved', { 
      count: students.length,
      minScore,
      userId 
    });

    return successResponse(h, students);
  }

  /**
   * HEALTH SCREENINGS METHODS
   */

  static async recordScreening(request: AuthenticatedRequest, h: ResponseToolkit) {
    const userId = request.auth.credentials.id;
    const screeningData = {
      ...request.payload as any,
      screenedBy: userId,
      recordedAt: new Date()
    };

    const result = await AdvancedFeatures.ScreeningService.recordScreening(screeningData);
    
    logger.info('Health screening recorded', { 
      studentId: screeningData.studentId,
      screeningType: screeningData.screeningType,
      followUpRequired: screeningData.followUpRequired,
      userId 
    });

    return createdResponse(h, { screening: result });
  }

  static async getScreeningHistory(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const userId = request.auth.credentials.id;

    const history = await AdvancedFeatures.ScreeningService.getScreeningHistory(studentId);
    
    logger.info('Screening history retrieved', { 
      studentId,
      recordCount: history.length,
      userId 
    });

    return successResponse(h, { history });
  }

  /**
   * GROWTH TRACKING METHODS
   */

  static async recordGrowthMeasurement(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const userId = request.auth.credentials.id;
    const measurementData = {
      ...request.payload as any,
      studentId,
      measuredBy: userId,
      recordedAt: new Date()
    };

    const result = await AdvancedFeatures.GrowthChartService.recordMeasurement(measurementData);
    
    logger.info('Growth measurement recorded', { 
      studentId,
      height: measurementData.height,
      weight: measurementData.weight,
      userId 
    });

    return createdResponse(h, { measurement: result });
  }

  static async getGrowthAnalysis(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const userId = request.auth.credentials.id;

    const analysis = await AdvancedFeatures.GrowthChartService.analyzeGrowthTrend(studentId);
    
    logger.info('Growth analysis generated', { 
      studentId,
      trendsFound: analysis.trends?.length || 0,
      userId 
    });

    return successResponse(h, { analysis });
  }

  /**
   * IMMUNIZATION FORECAST METHODS
   */

  static async getImmunizationForecast(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const userId = request.auth.credentials.id;

    const forecast = await AdvancedFeatures.ImmunizationForecastService.getForecast(studentId);
    
    logger.info('Immunization forecast generated', { 
      studentId,
      upcomingCount: forecast.upcoming?.length || 0,
      userId 
    });

    return successResponse(h, { forecast });
  }

  /**
   * EMERGENCY NOTIFICATION METHODS
   */

  static async sendEmergencyNotification(request: AuthenticatedRequest, h: ResponseToolkit) {
    const userId = request.auth.credentials.id;
    const notificationData = {
      ...request.payload as any,
      sentBy: userId,
      sentAt: new Date()
    };

    const result = await AdvancedFeatures.EmergencyNotificationService.sendEmergencyNotification(notificationData);
    
    logger.warn('Emergency notification sent', { 
      studentId: notificationData.studentId,
      emergencyType: notificationData.emergencyType,
      severity: notificationData.severity,
      notificationId: result.id,
      userId 
    });

    return createdResponse(h, { notification: result });
  }

  static async getEmergencyHistory(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const userId = request.auth.credentials.id;

    const history = await AdvancedFeatures.EmergencyNotificationService.getEmergencyHistory(studentId);
    
    logger.info('Emergency history retrieved', { 
      studentId,
      emergencyCount: history.length,
      userId 
    });

    return successResponse(h, { emergencyHistory: history });
  }

  /**
   * MEDICATION INTERACTIONS METHODS
   */

  static async getMedicationInteractions(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const userId = request.auth.credentials.id;

    const result = await MedicationInteractionService.checkStudentMedications(studentId);
    
    logger.info('Medication interactions checked', { 
      studentId,
      interactionCount: result.interactions?.length || 0,
      userId 
    });

    return successResponse(h, { interactions: result });
  }

  static async checkNewMedicationInteractions(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const { medicationName } = request.payload as any;
    const userId = request.auth.credentials.id;

    const result = await MedicationInteractionService.checkNewMedication(studentId, medicationName);
    
    logger.info('New medication interaction check', { 
      studentId,
      medicationName,
      hasInteractions: result.hasInteractions,
      userId 
    });

    return successResponse(h, { interactionCheck: result });
  }
}
