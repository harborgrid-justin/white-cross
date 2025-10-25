/**
 * @fileoverview Health Assessments Controller - Advanced health analytics and screening management.
 *
 * This controller provides HTTP request handling for comprehensive health assessment operations
 * in the White Cross healthcare platform, including:
 * - Health risk assessment and scoring algorithms
 * - Health screenings (vision, hearing, scoliosis, dental)
 * - Growth tracking and percentile analysis
 * - Immunization forecasting against CDC schedules
 * - Emergency notification systems
 * - Medication interaction checking and safety alerts
 *
 * Clinical Context:
 * - Risk assessment aggregates health factors to identify high-risk students
 * - Screenings detect potential health issues requiring follow-up
 * - Growth tracking monitors developmental progress against CDC charts
 * - Immunization forecasting predicts upcoming vaccination needs
 * - Emergency notifications support rapid response to critical health events
 * - Medication interaction checking prevents dangerous drug combinations
 *
 * Advanced Features:
 * - Multi-factor health risk scoring
 * - Automated screening follow-up workflows
 * - Growth percentile calculations with trend analysis
 * - CDC-compliant immunization forecasting
 * - Emergency escalation protocols
 * - Real-time drug interaction databases
 *
 * @module routes/v1/healthcare/controllers/healthAssessments
 * @since 1.0.0
 *
 * @compliance HIPAA - 45 CFR §164.312(b) - Audit controls for PHI access
 * @compliance CDC - Immunization schedules and growth chart standards
 * @compliance FDA - Medication interaction reporting (MedWatch)
 * @compliance Emergency Care - Emergency notification protocols per healthcare standards
 *
 * @security PHI Protected - All methods handle Protected Health Information
 * @security JWT authentication required on all endpoints
 * @security RBAC: NURSE or ADMIN roles required for most operations
 *
 * @see {@link HealthRiskAssessmentService} - Risk assessment business logic
 * @see {@link MedicationInteractionService} - Drug interaction checking
 * @see {@link AdvancedFeatures} - Screening, growth, immunization, and emergency services
 * @see {@link ../routes/healthAssessments.routes} - Route definitions
 *
 * @example
 * Import and use in route definitions:
 * ```typescript
 * import { HealthAssessmentsController } from './controllers/healthAssessments.controller';
 * import { asyncHandler } from '../../../shared/utils';
 *
 * const route = {
 *   method: 'GET',
 *   path: '/api/v1/health-assessments/risk/{studentId}',
 *   handler: asyncHandler(HealthAssessmentsController.getHealthRisk)
 * };
 * ```
 */

import { ResponseToolkit } from '@hapi/hapi';
import { AuthenticatedRequest } from '../../../shared/types/route.types';
import { successResponse, createdResponse } from '../../../shared/utils';
import { logger } from '../../../../shared/logging/logger';
import { HealthRiskAssessmentService } from '../../../../services/healthRiskAssessmentService';
import { MedicationInteractionService } from '../../../../services/medicationInteractionService';
import * as AdvancedFeatures from '../../../../services/advancedFeatures';

/**
 * Health Assessments Controller - HTTP request handlers for advanced health analytics.
 *
 * Provides controller methods for health risk assessment, screenings, growth tracking,
 * immunization forecasting, emergency notifications, and medication interaction checking.
 * All methods validate authentication, delegate to specialized service layers, and format responses.
 *
 * @class HealthAssessmentsController
 * @static
 * @since 1.0.0
 *
 * @example
 * Usage in Hapi.js routes:
 * ```typescript
 * const route = {
 *   handler: asyncHandler(HealthAssessmentsController.getHealthRisk),
 *   options: { auth: 'jwt' }
 * };
 * ```
 */
export class HealthAssessmentsController {
  /**
   * ==================================================================================
   * HEALTH RISK ASSESSMENT - Multi-factor risk scoring and high-risk identification
   * ==================================================================================
   */

  /**
   * Get health risk assessment for a student.
   *
   * Calculates comprehensive health risk score by aggregating multiple factors including
   * chronic conditions, active allergies, medication regimen complexity, immunization status,
   * recent health incidents, and vital sign trends. Higher scores indicate students requiring
   * more intensive monitoring and care coordination.
   *
   * Risk factors considered:
   * - Chronic conditions (severity-weighted)
   * - Life-threatening allergies
   * - Controlled substance medications
   * - Immunization non-compliance
   * - Recent emergency incidents
   * - Abnormal vital sign trends
   * - Frequency of nurse visits
   *
   * Risk score ranges:
   * - 0-24: Low risk (routine monitoring)
   * - 25-49: Moderate risk (enhanced monitoring)
   * - 50-74: High risk (intensive monitoring)
   * - 75-100: Very high risk (critical monitoring, care plan required)
   *
   * @param {AuthenticatedRequest} request - Authenticated request with studentId param
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Health risk assessment with detailed breakdown
   * @returns {200} Success - { success: true, data: { totalScore, breakdown, recommendations } }
   *
   * @throws {NotFoundError} When student ID does not exist
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user cannot access this student's records
   * @throws {ValidationError} When studentId is not a valid UUID
   *
   * @security JWT authentication required
   * @security RBAC: User must have access to student's records
   * @compliance HIPAA - Risk assessment access is logged to audit trail
   * @hipaa HIGHLY SENSITIVE PHI - Aggregated health risk information
   *
   * @example
   * ```typescript
   * // GET /api/v1/health-assessments/risk/660e8400-e29b-41d4-a716-446655440000
   * const request = { params: { studentId: '660e8400-e29b-41d4-a716-446655440000' } };
   * const response = await HealthAssessmentsController.getHealthRisk(request, h);
   * // Returns: {
   * //   totalScore: 67,
   * //   riskLevel: "HIGH",
   * //   breakdown: {
   * //     chronicConditions: 30,
   * //     allergies: 20,
   * //     medications: 10,
   * //     immunizations: 5,
   * //     incidents: 2
   * //   },
   * //   recommendations: ["Daily health check-ins", "Care plan review needed"]
   * // }
   * ```
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

  /**
   * Get list of high-risk students requiring intensive monitoring.
   *
   * Retrieves all students with health risk scores above a specified threshold,
   * sorted by risk score (highest first). Used for prioritizing nursing resources,
   * identifying students needing care plans, and generating high-risk student reports.
   *
   * Query Parameters:
   * - minScore: Minimum risk score threshold (default: 50 for "high risk")
   *
   * @param {AuthenticatedRequest} request - Authenticated request with optional minScore query param
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} List of high-risk students with risk scores
   * @returns {200} Success - { success: true, data: [{ studentId, riskScore, riskFactors, ... }] }
   *
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ValidationError} When minScore is not a valid number
   *
   * @security JWT authentication required
   * @security RBAC: Typically restricted to NURSE and ADMIN roles
   * @compliance HIPAA - High-risk student list access is logged to audit trail
   * @hipaa HIGHLY SENSITIVE PHI - Aggregated health risk for multiple students
   *
   * @example
   * ```typescript
   * // GET /api/v1/health-assessments/high-risk?minScore=60
   * const request = { query: { minScore: 60 } };
   * const response = await HealthAssessmentsController.getHighRiskStudents(request, h);
   * // Returns array of students with risk scores ≥ 60, sorted highest first
   * // [{ studentId: "...", name: "...", riskScore: 72, primaryRiskFactors: [...] }]
   * ```
   */
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
   * ==================================================================================
   * HEALTH SCREENINGS - Vision, hearing, scoliosis, and dental screenings
   * ==================================================================================
   */

  /**
   * Record health screening result for a student.
   *
   * Documents a health screening event (vision, hearing, scoliosis, dental, BMI, etc.)
   * with results, follow-up requirements, and recommendations. Automatically triggers
   * follow-up workflows if screening indicates potential issues requiring medical attention.
   *
   * Common screening types:
   * - VISION: Snellen chart, color blindness, lazy eye
   * - HEARING: Audiometry screening at specified frequencies
   * - SCOLIOSIS: Visual inspection and forward bend test
   * - DENTAL: Cavity detection, oral health assessment
   * - BMI: Height/weight with percentile calculation
   * - BLOOD_PRESSURE: BP screening for at-risk students
   *
   * Required fields:
   * - studentId: Student UUID
   * - screeningType: Type of screening performed
   * - screeningDate: Date screening was performed
   * - result: Screening outcome (PASS, FAIL, REFER)
   *
   * @param {AuthenticatedRequest} request - Authenticated request with screening data in payload
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Created screening record
   * @returns {201} Created - { success: true, data: { screening: {...} } }
   *
   * @throws {ValidationError} When screening data is incomplete or invalid
   * @throws {NotFoundError} When studentId does not exist
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user lacks NURSE or ADMIN role
   *
   * @security JWT authentication required (screenedBy auto-populated from JWT)
   * @security RBAC: Requires NURSE or ADMIN role
   * @compliance HIPAA - Screening recording is logged to audit trail
   * @compliance State Requirements - Many states mandate annual vision/hearing screenings
   * @hipaa PHI Protected - Creates health screening record
   *
   * @example
   * Vision screening with referral:
   * ```typescript
   * const request = {
   *   auth: { credentials: { id: 'nurse-uuid' } },
   *   payload: {
   *     studentId: "660e8400-e29b-41d4-a716-446655440000",
   *     screeningType: "VISION",
   *     screeningDate: "2025-10-23",
   *     result: "REFER",
   *     details: "Right eye: 20/40, Left eye: 20/60. Failed Snellen chart screening.",
   *     followUpRequired: true,
   *     recommendations: "Refer to optometrist for comprehensive eye exam. Possible myopia.",
   *     notes: "Student reported difficulty seeing board from back of classroom."
   *   }
   * };
   * const response = await HealthAssessmentsController.recordScreening(request, h);
   * ```
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

  /**
   * Get screening history for a student.
   *
   * Retrieves complete screening history for a student across all screening types
   * (vision, hearing, scoliosis, dental, etc.). Shows historical results, trends,
   * and pending follow-ups. Essential for tracking compliance with state-mandated
   * screening requirements and identifying recurring issues.
   *
   * @param {AuthenticatedRequest} request - Authenticated request with studentId param
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Complete screening history
   * @returns {200} Success - { success: true, data: { history: [...] } }
   *
   * @throws {NotFoundError} When student ID does not exist
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user cannot access this student's records
   * @throws {ValidationError} When studentId is not a valid UUID
   *
   * @security JWT authentication required
   * @security RBAC: User must have access to student's records
   * @compliance HIPAA - Screening history access is logged to audit trail
   * @compliance State Requirements - Screening record retention for compliance
   * @hipaa PHI Protected - Health screening history
   *
   * @example
   * ```typescript
   * // GET /api/v1/health-assessments/screenings/student/660e8400.../history
   * const request = { params: { studentId: '660e8400-e29b-41d4-a716-446655440000' } };
   * const response = await HealthAssessmentsController.getScreeningHistory(request, h);
   * // Returns: { history: [{ screeningType: "VISION", date: "...", result: "PASS", ... }] }
   * ```
   */
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
   * ==================================================================================
   * GROWTH TRACKING - Height, weight, BMI with CDC percentile analysis
   * ==================================================================================
   */

  /**
   * Record growth measurement for a student.
   *
   * Records height, weight, and BMI measurements with automatic CDC percentile
   * calculations based on age and gender. Tracks developmental progress and identifies
   * students with growth concerns (underweight, overweight, abnormal growth patterns).
   *
   * Measurements recorded:
   * - Height (with unit: inches or cm)
   * - Weight (with unit: lbs or kg)
   * - BMI (automatically calculated)
   * - BMI percentile (CDC charts by age/gender)
   * - Height percentile (CDC charts)
   * - Weight percentile (CDC charts)
   *
   * Percentile ranges:
   * - <5th percentile: Underweight/short stature (medical evaluation recommended)
   * - 5th-85th percentile: Healthy range
   * - 85th-95th percentile: Overweight risk
   * - >95th percentile: Obesity (intervention recommended)
   *
   * @param {AuthenticatedRequest} request - Authenticated request with measurement data in payload
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Created growth measurement with percentiles
   * @returns {201} Created - { success: true, data: { measurement: {...} } }
   *
   * @throws {ValidationError} When measurement data is invalid
   * @throws {NotFoundError} When studentId does not exist
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user lacks NURSE or ADMIN role
   *
   * @security JWT authentication required (measuredBy auto-populated from JWT)
   * @security RBAC: Requires NURSE or ADMIN role
   * @compliance HIPAA - Growth measurement recording is logged to audit trail
   * @compliance CDC - Percentiles calculated using CDC growth charts
   * @hipaa PHI Protected - Creates growth tracking record
   *
   * @example
   * ```typescript
   * const request = {
   *   auth: { credentials: { id: 'nurse-uuid' } },
   *   params: { studentId: '660e8400-e29b-41d4-a716-446655440000' },
   *   payload: {
   *     height: 62,
   *     heightUnit: "inches",
   *     weight: 105,
   *     weightUnit: "lbs",
   *     measurementDate: "2025-10-23"
   *   }
   * };
   * const response = await HealthAssessmentsController.recordGrowthMeasurement(request, h);
   * // Returns measurement with calculated BMI (19.2) and percentiles (height: 60th, weight: 55th, BMI: 65th)
   * ```
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

  /**
   * Get growth analysis and trend tracking for a student.
   *
   * Analyzes historical growth measurements to identify trends, calculate growth velocity,
   * and detect abnormal patterns. Compares student's growth trajectory against CDC norms
   * and identifies students with growth concerns requiring medical evaluation.
   *
   * Analysis includes:
   * - Growth velocity (cm/year or inches/year)
   * - Percentile trends (stable, increasing, decreasing)
   * - BMI trajectory and obesity risk
   * - Growth pattern classification (normal, accelerated, delayed)
   * - Recommendations for intervention if needed
   *
   * Concerning patterns flagged:
   * - Percentile crossing (>2 percentile lines in 6 months)
   * - Growth velocity outside normal ranges
   * - BMI percentile rapidly increasing
   * - Height percentile declining
   *
   * @param {AuthenticatedRequest} request - Authenticated request with studentId param
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Growth trend analysis with recommendations
   * @returns {200} Success - { success: true, data: { analysis: {...} } }
   *
   * @throws {NotFoundError} When student ID does not exist or insufficient growth data
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user cannot access this student's records
   * @throws {ValidationError} When studentId is not a valid UUID
   *
   * @security JWT authentication required
   * @security RBAC: User must have access to student's records
   * @compliance HIPAA - Growth analysis access is logged to audit trail
   * @compliance CDC - Trend analysis using CDC growth chart standards
   * @hipaa PHI Protected - Growth trends and health analysis
   *
   * @example
   * ```typescript
   * // GET /api/v1/health-assessments/growth/student/660e8400.../analysis
   * const request = { params: { studentId: '660e8400-e29b-41d4-a716-446655440000' } };
   * const response = await HealthAssessmentsController.getGrowthAnalysis(request, h);
   * // Returns: {
   * //   analysis: {
   * //     growthVelocity: "5.2 cm/year",
   * //     percentileTrend: "STABLE",
   * //     bmiTrajectory: "INCREASING",
   * //     concerns: ["BMI percentile increased from 65th to 82nd in 6 months"],
   * //     recommendations: ["Monitor nutrition and physical activity", "Follow-up in 3 months"]
   * //   }
   * // }
   * ```
   */
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
   * ==================================================================================
   * IMMUNIZATION FORECAST - CDC schedule-based vaccination forecasting
   * ==================================================================================
   */

  /**
   * Get immunization forecast for a student.
   *
   * Generates personalized immunization forecast based on student's current age,
   * vaccination history, and CDC immunization schedules. Predicts upcoming vaccinations,
   * identifies overdue vaccines, and provides catch-up vaccination recommendations.
   *
   * Forecast includes:
   * - Upcoming vaccines by due date
   * - Overdue vaccinations requiring immediate attention
   * - Catch-up schedule for incomplete vaccine series
   * - Age-appropriate vaccine recommendations
   * - School enrollment immunization requirements
   *
   * CDC schedules supported:
   * - Birth through 6 years (early childhood)
   * - 7-18 years (school-age and adolescent)
   * - Catch-up immunization schedules
   * - Special populations (immunocompromised, etc.)
   *
   * @param {AuthenticatedRequest} request - Authenticated request with studentId param
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Immunization forecast with upcoming and overdue vaccines
   * @returns {200} Success - { success: true, data: { forecast: {...} } }
   *
   * @throws {NotFoundError} When student ID does not exist
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user cannot access this student's records
   * @throws {ValidationError} When studentId is not a valid UUID
   *
   * @security JWT authentication required
   * @security RBAC: User must have access to student's records
   * @compliance HIPAA - Immunization forecast access is logged to audit trail
   * @compliance CDC - Forecast based on current CDC immunization schedules
   * @compliance State Requirements - State-specific school immunization requirements
   * @hipaa PHI Protected - Vaccination history and health status
   *
   * @example
   * ```typescript
   * // GET /api/v1/health-assessments/immunizations/student/660e8400.../forecast
   * const request = { params: { studentId: '660e8400-e29b-41d4-a716-446655440000' } };
   * const response = await HealthAssessmentsController.getImmunizationForecast(request, h);
   * // Returns: {
   * //   forecast: {
   * //     upcoming: [
   * //       { vaccine: "Tdap", dueDate: "2026-03-15", ageGroup: "11-12 years" },
   * //       { vaccine: "HPV (dose 2)", dueDate: "2026-06-15", series: "2 of 3" }
   * //     ],
   * //     overdue: [{ vaccine: "Meningococcal", overdueSince: "2025-09-01" }],
   * //     nextReviewDate: "2026-01-01"
   * //   }
   * // }
   * ```
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
   * ==================================================================================
   * EMERGENCY NOTIFICATIONS - Critical health event communication system
   * ==================================================================================
   */

  /**
   * Send emergency notification for a critical health event.
   *
   * Initiates emergency notification workflow when a student experiences a critical
   * health event requiring immediate attention. Automatically notifies parents/guardians,
   * designated emergency contacts, school administrators, and healthcare providers based
   * on severity level and notification protocols.
   *
   * Emergency types:
   * - SEVERE_ALLERGIC_REACTION: Anaphylaxis, EpiPen administered
   * - SEIZURE: Seizure activity, emergency medication given
   * - INJURY: Serious injury requiring medical transport
   * - DIABETIC_EMERGENCY: Severe hypoglycemia or hyperglycemia
   * - RESPIRATORY_DISTRESS: Severe asthma attack, difficulty breathing
   * - CARDIAC_EVENT: Chest pain, abnormal heart rhythm
   * - MENTAL_HEALTH_CRISIS: Self-harm, severe anxiety/panic
   * - OTHER: Other critical health emergencies
   *
   * Severity levels and notification scope:
   * - CRITICAL: 911 called, all emergency contacts, administrators (immediate)
   * - HIGH: Parent/guardian, emergency contacts, school nurse supervisor
   * - MODERATE: Parent/guardian, designated contact, documentation
   *
   * @param {AuthenticatedRequest} request - Authenticated request with emergency notification data
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Created emergency notification with delivery status
   * @returns {201} Created - { success: true, data: { notification: {...} } }
   *
   * @throws {ValidationError} When emergency data is incomplete or invalid
   * @throws {NotFoundError} When studentId does not exist
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user lacks NURSE or ADMIN role
   *
   * @security JWT authentication required (sentBy auto-populated from JWT)
   * @security RBAC: Requires NURSE or ADMIN role
   * @security Emergency protocols bypass normal access restrictions
   * @compliance HIPAA - Emergency notifications logged with complete audit trail
   * @compliance Emergency Care - Notifications per emergency response protocols
   * @hipaa CRITICAL PHI - Emergency health event with protected information
   *
   * @example
   * Severe allergic reaction emergency:
   * ```typescript
   * const request = {
   *   auth: { credentials: { id: 'nurse-uuid' } },
   *   payload: {
   *     studentId: "660e8400-e29b-41d4-a716-446655440000",
   *     emergencyType: "SEVERE_ALLERGIC_REACTION",
   *     severity: "CRITICAL",
   *     description: "Student experienced anaphylaxis after exposure to peanuts in cafeteria. EpiPen administered at 12:15 PM.",
   *     actionsTaken: "EpiPen administered to right thigh. 911 called. Student conscious and breathing. Second EpiPen available if needed. Parent contacted.",
   *     vitalSigns: "BP: 100/65, HR: 110, RR: 24, SpO2: 94%",
   *     emsNotified: true,
   *     emsArrivalTime: "12:28 PM",
   *     location: "School cafeteria",
   *     witnessIds: ["teacher-uuid-1", "staff-uuid-2"]
   *   }
   * };
   * const response = await HealthAssessmentsController.sendEmergencyNotification(request, h);
   * ```
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

  /**
   * Get emergency notification history for a student.
   *
   * Retrieves complete history of all emergency health events and notifications
   * for a student. Essential for identifying patterns, reviewing emergency response
   * effectiveness, and supporting care plan development for high-risk students.
   *
   * @param {AuthenticatedRequest} request - Authenticated request with studentId param
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Complete emergency event history
   * @returns {200} Success - { success: true, data: { emergencyHistory: [...] } }
   *
   * @throws {NotFoundError} When student ID does not exist
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user cannot access this student's records
   * @throws {ValidationError} When studentId is not a valid UUID
   *
   * @security JWT authentication required
   * @security RBAC: User must have access to student's records
   * @compliance HIPAA - Emergency history access is logged to audit trail
   * @hipaa CRITICAL PHI - Complete emergency health event history
   *
   * @example
   * ```typescript
   * // GET /api/v1/health-assessments/emergency/student/660e8400.../history
   * const request = { params: { studentId: '660e8400-e29b-41d4-a716-446655440000' } };
   * const response = await HealthAssessmentsController.getEmergencyHistory(request, h);
   * // Returns: { emergencyHistory: [{ type: "SEVERE_ALLERGIC_REACTION", date: "...", ... }] }
   * ```
   */
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
   * ==================================================================================
   * MEDICATION INTERACTIONS - Drug interaction checking and safety alerts
   * ==================================================================================
   */

  /**
   * Get medication interactions for a student's current medications.
   *
   * Analyzes all active medications for a student to identify potential drug interactions,
   * contraindications, and safety concerns. Checks for drug-drug interactions, duplicate
   * therapies, and dosing conflicts. Critical for medication safety and preventing
   * adverse drug events.
   *
   * Interaction types detected:
   * - SEVERE: Life-threatening interactions requiring immediate intervention
   * - MODERATE: Significant interactions requiring monitoring or dosage adjustment
   * - MILD: Minor interactions with minimal clinical significance
   *
   * Checks include:
   * - Drug-drug interactions (pharmacokinetic and pharmacodynamic)
   * - Duplicate active ingredients across different medications
   * - Contraindications based on allergies and chronic conditions
   * - Age-inappropriate medications
   * - Dosing conflicts and timing issues
   *
   * @param {AuthenticatedRequest} request - Authenticated request with studentId param
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Medication interaction analysis with safety alerts
   * @returns {200} Success - { success: true, data: { interactions: {...} } }
   *
   * @throws {NotFoundError} When student ID does not exist
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user cannot access this student's records
   * @throws {ValidationError} When studentId is not a valid UUID
   *
   * @security JWT authentication required
   * @security RBAC: User must have access to student's records
   * @compliance HIPAA - Medication interaction check is logged to audit trail
   * @compliance FDA - Drug interaction reporting per FDA MedWatch guidelines
   * @hipaa HIGHLY SENSITIVE PHI - Complete medication regimen and health conditions
   *
   * @example
   * ```typescript
   * // GET /api/v1/health-assessments/medications/student/660e8400.../interactions
   * const request = { params: { studentId: '660e8400-e29b-41d4-a716-446655440000' } };
   * const response = await HealthAssessmentsController.getMedicationInteractions(request, h);
   * // Returns: {
   * //   interactions: [
   * //     {
   * //       severity: "MODERATE",
   * //       medications: ["Ibuprofen 200mg", "Aspirin 81mg"],
   * //       description: "Increased risk of gastrointestinal bleeding",
   * //       recommendation: "Monitor for GI symptoms. Consider alternative pain reliever."
   * //     }
   * //   ],
   * //   totalInteractions: 1,
   * //   severeCount: 0,
   * //   moderateCount: 1
   * // }
   * ```
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

  /**
   * Check interactions for a new medication before prescribing.
   *
   * Performs prospective drug interaction checking before adding a new medication
   * to a student's regimen. Analyzes potential interactions with current active
   * medications, existing allergies, and chronic conditions. Essential for safe
   * medication prescribing and preventing adverse drug events.
   *
   * Prospective checks include:
   * - Interactions with all current active medications
   * - Known allergies to medication or ingredients
   * - Contraindications based on chronic conditions
   * - Age-appropriateness of medication and dosage
   * - Duplicate therapy detection
   * - Alternative medication suggestions if interactions found
   *
   * @param {AuthenticatedRequest} request - Authenticated request with studentId and new medication name
   * @param {ResponseToolkit} h - Hapi.js response toolkit
   *
   * @returns {Promise<ResponseObject>} Interaction check results with safety recommendations
   * @returns {200} Success - { success: true, data: { interactionCheck: {...} } }
   *
   * @throws {NotFoundError} When student ID does not exist
   * @throws {ValidationError} When medication name is missing or invalid
   * @throws {UnauthorizedError} When JWT token is missing or invalid
   * @throws {ForbiddenError} When user cannot access this student's records
   *
   * @security JWT authentication required
   * @security RBAC: User must have access to student's records
   * @compliance HIPAA - Medication interaction check is logged to audit trail
   * @compliance FDA - Prospective drug interaction checking per safety guidelines
   * @hipaa HIGHLY SENSITIVE PHI - Medication regimen and health conditions
   *
   * @example
   * Check new medication before prescribing:
   * ```typescript
   * const request = {
   *   params: { studentId: '660e8400-e29b-41d4-a716-446655440000' },
   *   payload: { medicationName: "Amoxicillin 500mg" }
   * };
   * const response = await HealthAssessmentsController.checkNewMedicationInteractions(request, h);
   * // Returns: {
   * //   interactionCheck: {
   * //     safe: false,
   * //     hasInteractions: true,
   * //     interactions: [
   * //       {
   * //         severity: "MODERATE",
   * //         conflictingMedication: "Oral contraceptive",
   * //         description: "Amoxicillin may reduce effectiveness of oral contraceptives",
   * //         recommendation: "Advise patient to use backup contraception during treatment"
   * //       }
   * //     ],
   * //     allergyConflicts: [],
   * //     conditionConflicts: [],
   * //     alternatives: ["Azithromycin", "Clarithromycin"],
   * //     recommendation: "PROCEED WITH CAUTION - Monitor for reduced contraceptive effectiveness"
   * //   }
   * // }
   * ```
   */
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
