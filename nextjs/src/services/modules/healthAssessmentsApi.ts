/**
 * Health Assessments API Module - Complete Implementation
 *
 * Provides comprehensive frontend access to all health assessment endpoints including:
 * - Health Risk Assessments
 * - Health Screenings (Vision, Hearing, Dental, Scoliosis, BMI)
 * - Growth Tracking and Analysis
 * - Immunization Forecasting
 * - Emergency Notifications
 * - Medication Interaction Checking
 *
 * All endpoints include:
 * - Complete TypeScript type safety
 * - Zod validation schemas for request validation
 * - HIPAA-compliant PHI access logging
 * - Comprehensive error handling
 * - JSDoc documentation
 *
 * @module HealthAssessmentsApi
 * @version 2.0.0
 * @since 2025-10-24
 */

import type { ApiClient } from '../core/ApiClient';
import { ApiResponse, PaginatedResponse, buildPaginationParams } from '../utils/apiUtils';
import { z } from 'zod';
import { createApiError } from '../core/errors';
import { auditService, AuditAction, AuditResourceType, AuditStatus } from '../audit';

// ============================================================================
// TYPESCRIPT INTERFACES
// ============================================================================

/**
 * Health Risk Assessment Types
 */
export interface HealthRiskAssessment {
  studentId: string;
  studentName: string;
  riskScore: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  riskFactors: Array<{
    factor: string;
    severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
    impact: number;
  }>;
  activeConditions: number;
  severeAllergies: number;
  medicationCount: number;
  recentIncidents: number;
  recommendations: string[];
  lastAssessmentDate: string;
  nextReviewDate?: string;
}

export interface HighRiskStudent {
  studentId: string;
  studentName: string;
  riskScore: number;
  riskLevel: 'HIGH' | 'CRITICAL';
  primaryRisks: string[];
  lastAssessmentDate: string;
  assignedNurse?: string;
  urgentActions: string[];
}

/**
 * Health Screening Types
 */
export type ScreeningType = 'VISION' | 'HEARING' | 'DENTAL' | 'SCOLIOSIS' | 'BMI' | 'BLOOD_PRESSURE' | 'DEVELOPMENTAL';
export type ScreeningResult = 'PASS' | 'FAIL' | 'REFER' | 'INCOMPLETE';

export interface HealthScreening {
  id: string;
  studentId: string;
  screeningType: ScreeningType;
  screeningDate: string;
  result: ScreeningResult;
  detailedResults?: Record<string, any>;
  followUpRequired: boolean;
  followUpNotes?: string;
  parentNotified: boolean;
  screenedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScreeningRequest {
  studentId: string;
  screeningType: ScreeningType;
  screeningDate?: string;
  result: ScreeningResult;
  detailedResults?: Record<string, any>;
  followUpRequired?: boolean;
  followUpNotes?: string;
  parentNotified?: boolean;
}

/**
 * Growth Tracking Types
 */
export interface GrowthMeasurement {
  id: string;
  studentId: string;
  measurementDate: string;
  height: number; // in cm
  weight: number; // in kg
  bmi: number;
  heightPercentile?: number;
  weightPercentile?: number;
  bmiPercentile?: number;
  headCircumference?: number;
  measuredBy: string;
  notes?: string;
  createdAt: string;
}

export interface CreateGrowthMeasurementRequest {
  height: number;
  weight: number;
  measurementDate?: string;
  headCircumference?: number;
  notes?: string;
}

export interface GrowthAnalysis {
  studentId: string;
  studentName: string;
  ageYears: number;
  currentMeasurements: {
    height: number;
    weight: number;
    bmi: number;
    measurementDate: string;
  };
  percentiles: {
    heightPercentile: number;
    weightPercentile: number;
    bmiPercentile: number;
  };
  trends: {
    heightVelocity: string;
    weightTrend: string;
    concerns: string[];
  };
  clinicalInterpretation: string;
  recommendations: string[];
  measurementHistory: Array<{
    date: string;
    height: number;
    weight: number;
    bmi: number;
  }>;
}

/**
 * Immunization Forecast Types
 */
export interface ImmunizationForecast {
  studentId: string;
  studentName: string;
  dateOfBirth: string;
  forecasts: Array<{
    vaccineName: string;
    doseNumber: number;
    dueDate: string;
    earliestDate: string;
    status: 'DUE' | 'OVERDUE' | 'UP_TO_DATE' | 'NOT_DUE';
    notes?: string;
  }>;
  upToDate: boolean;
  generatedAt: string;
  nextDueDate?: string;
  overdueCount: number;
}

/**
 * Emergency Notification Types
 */
export type EmergencyType = 'MEDICAL_EMERGENCY' | 'ALLERGIC_REACTION' | 'INJURY' | 'SEIZURE' | 'CARDIAC' | 'RESPIRATORY' | 'OTHER';
export type EmergencySeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface EmergencyNotification {
  id: string;
  studentId: string;
  studentName: string;
  emergencyType: EmergencyType;
  severity: EmergencySeverity;
  description: string;
  location: string;
  actionsTaken: string[];
  notifiedContacts: Array<{
    contactName: string;
    contactType: 'PARENT' | 'GUARDIAN' | 'EMERGENCY_CONTACT' | 'MEDICAL_STAFF';
    notifiedAt: string;
    method: 'PHONE' | 'SMS' | 'EMAIL';
  }>;
  incidentReportId?: string;
  resolvedAt?: string;
  reportedBy: string;
  createdAt: string;
}

export interface CreateEmergencyNotificationRequest {
  studentId: string;
  emergencyType: EmergencyType;
  severity: EmergencySeverity;
  description: string;
  location: string;
  actionsTaken?: string[];
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
  };
}

/**
 * Medication Interaction Types
 */
export interface MedicationInteraction {
  medicationA: string;
  medicationB: string;
  interactionType: 'DRUG_DRUG' | 'DRUG_FOOD' | 'DRUG_CONDITION';
  severity: 'MINOR' | 'MODERATE' | 'MAJOR' | 'CONTRAINDICATED';
  description: string;
  clinicalSignificance: string;
  managementRecommendations: string[];
}

export interface MedicationInteractionCheck {
  studentId: string;
  studentName: string;
  currentMedications: string[];
  interactions: MedicationInteraction[];
  highSeverityCount: number;
  requiresReview: boolean;
  checkedAt: string;
}

export interface CheckNewMedicationRequest {
  medicationName: string;
  dosage?: string;
  frequency?: string;
}

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

/**
 * Common Validation Patterns
 */
const uuidSchema = z.string().uuid('Must be a valid UUID');
const dateSchema = z.string().datetime({ message: 'Must be a valid ISO datetime' })
  .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be a valid date (YYYY-MM-DD)'));

/**
 * Screening Validation Schema
 */
const screeningTypeEnum = z.enum(['VISION', 'HEARING', 'DENTAL', 'SCOLIOSIS', 'BMI', 'BLOOD_PRESSURE', 'DEVELOPMENTAL'], {
  errorMap: () => ({ message: 'Invalid screening type' })
});

const screeningResultEnum = z.enum(['PASS', 'FAIL', 'REFER', 'INCOMPLETE'], {
  errorMap: () => ({ message: 'Result must be PASS, FAIL, REFER, or INCOMPLETE' })
});

export const createScreeningSchema = z.object({
  studentId: uuidSchema,
  screeningType: screeningTypeEnum,
  screeningDate: dateSchema.optional(),
  result: screeningResultEnum,
  detailedResults: z.record(z.any()).optional(),
  followUpRequired: z.boolean().optional().default(false),
  followUpNotes: z.string()
    .max(2000, 'Follow-up notes cannot exceed 2000 characters')
    .trim()
    .optional(),
  parentNotified: z.boolean().optional().default(false),
}).refine(
  (data) => {
    // If follow-up required, follow-up notes should be provided
    if (data.followUpRequired && !data.followUpNotes) {
      return false;
    }
    return true;
  },
  { message: 'Follow-up notes are required when follow-up is needed', path: ['followUpNotes'] }
);

/**
 * Growth Measurement Validation Schema
 */
export const createGrowthMeasurementSchema = z.object({
  height: z.number()
    .min(30, 'Height must be at least 30 cm')
    .max(250, 'Height cannot exceed 250 cm')
    .refine(val => val > 0, 'Height must be positive'),
  weight: z.number()
    .min(2, 'Weight must be at least 2 kg')
    .max(300, 'Weight cannot exceed 300 kg')
    .refine(val => val > 0, 'Weight must be positive'),
  measurementDate: dateSchema.optional(),
  headCircumference: z.number()
    .min(20, 'Head circumference must be at least 20 cm')
    .max(80, 'Head circumference cannot exceed 80 cm')
    .optional(),
  notes: z.string()
    .max(1000, 'Notes cannot exceed 1000 characters')
    .trim()
    .optional(),
});

/**
 * Emergency Notification Validation Schema
 */
const emergencyTypeEnum = z.enum([
  'MEDICAL_EMERGENCY',
  'ALLERGIC_REACTION',
  'INJURY',
  'SEIZURE',
  'CARDIAC',
  'RESPIRATORY',
  'OTHER'
], {
  errorMap: () => ({ message: 'Invalid emergency type' })
});

const emergencySeverityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], {
  errorMap: () => ({ message: 'Severity must be LOW, MEDIUM, HIGH, or CRITICAL' })
});

export const createEmergencyNotificationSchema = z.object({
  studentId: uuidSchema,
  emergencyType: emergencyTypeEnum,
  severity: emergencySeverityEnum,
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description cannot exceed 5000 characters')
    .trim(),
  location: z.string()
    .min(3, 'Location must be at least 3 characters')
    .max(500, 'Location cannot exceed 500 characters')
    .trim(),
  actionsTaken: z.array(z.string()).optional(),
  vitalSigns: z.object({
    bloodPressure: z.string()
      .regex(/^\d{2,3}\/\d{2,3}$/, 'Blood pressure must be in format XXX/YYY')
      .optional(),
    heartRate: z.number()
      .int()
      .min(30, 'Heart rate must be at least 30 bpm')
      .max(250, 'Heart rate cannot exceed 250 bpm')
      .optional(),
    temperature: z.number()
      .min(32, 'Temperature must be at least 32°C')
      .max(45, 'Temperature cannot exceed 45°C')
      .optional(),
    respiratoryRate: z.number()
      .int()
      .min(5, 'Respiratory rate must be at least 5 breaths/min')
      .max(60, 'Respiratory rate cannot exceed 60 breaths/min')
      .optional(),
    oxygenSaturation: z.number()
      .int()
      .min(50, 'Oxygen saturation must be at least 50%')
      .max(100, 'Oxygen saturation cannot exceed 100%')
      .optional(),
  }).optional(),
});

/**
 * Medication Interaction Check Validation Schema
 */
export const checkNewMedicationSchema = z.object({
  medicationName: z.string()
    .min(2, 'Medication name must be at least 2 characters')
    .max(200, 'Medication name cannot exceed 200 characters')
    .trim(),
  dosage: z.string()
    .max(100, 'Dosage cannot exceed 100 characters')
    .trim()
    .optional(),
  frequency: z.string()
    .max(200, 'Frequency cannot exceed 200 characters')
    .trim()
    .optional(),
});

// ============================================================================
// HEALTH ASSESSMENTS API SERVICE
// ============================================================================

/**
 * Health Assessments API Service
 * Handles all health assessment related API calls with comprehensive validation and PHI protection
 */
export class HealthAssessmentsApi {
  constructor(private readonly client: ApiClient) {}

  // ==========================================================================
  // HEALTH RISK ASSESSMENTS
  // ==========================================================================

  /**
   * Get health risk assessment for a specific student
   *
   * Calculates comprehensive risk score based on:
   * - Active chronic conditions
   * - Severe allergies
   * - Current medications
   * - Recent health incidents
   *
   * @param studentId - Student UUID
   * @returns Health risk assessment with recommendations
   * @throws {ApiError} If student not found or calculation fails
   *
   * @example
   * ```typescript
   * const assessment = await healthAssessmentsApi.getHealthRisk('student-uuid');
   * console.log(`Risk Level: ${assessment.riskLevel}`);
   * console.log(`Recommendations: ${assessment.recommendations.join(', ')}`);
   * ```
   */
  async getHealthRisk(studentId: string): Promise<HealthRiskAssessment> {
    try {
      if (!studentId) throw new Error('Student ID is required');

      const response = await this.client.get<ApiResponse<{ assessment: HealthRiskAssessment }>>(
        `/api/v1/health-assessments/risk/${studentId}`
      );

      // Audit PHI access
      await auditService.log({
        action: AuditAction.VIEW_HEALTH_RECORD,
        resourceType: AuditResourceType.HEALTH_RECORD,
        resourceId: studentId,
        studentId,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        metadata: {
          assessmentType: 'health_risk',
          riskLevel: response.data.data.assessment.riskLevel,
        },
      });

      return response.data.data.assessment;
    } catch (error) {
      await auditService.log({
        action: AuditAction.VIEW_HEALTH_RECORD,
        resourceType: AuditResourceType.HEALTH_RECORD,
        resourceId: studentId,
        studentId,
        status: AuditStatus.FAILURE,
        isPHI: true,
        context: { error: (error as Error).message },
      });
      throw createApiError(error, 'Failed to fetch health risk assessment');
    }
  }

  /**
   * Get list of high-risk students
   *
   * Returns students with elevated health risk scores requiring
   * proactive monitoring and intervention.
   *
   * @param params - Filter parameters
   * @returns Paginated list of high-risk students
   * @throws {ApiError} If query fails
   *
   * @example
   * ```typescript
   * const highRiskStudents = await healthAssessmentsApi.getHighRiskStudents({
   *   minRiskScore: 70,
   *   page: 1,
   *   limit: 20
   * });
   * ```
   */
  async getHighRiskStudents(params?: {
    minRiskScore?: number;
    schoolId?: string;
    gradeLevel?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<HighRiskStudent>> {
    try {
      const paginationParams = buildPaginationParams(params?.page, params?.limit);
      const allParams = params ? { ...paginationParams, ...params } : paginationParams;

      const response = await this.client.get<PaginatedResponse<HighRiskStudent>>(
        '/api/v1/health-assessments/high-risk-students',
        { params: allParams }
      );

      // Audit bulk PHI access
      await auditService.log({
        action: AuditAction.VIEW_HEALTH_RECORD,
        resourceType: AuditResourceType.HEALTH_RECORD,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        metadata: {
          queryType: 'high_risk_students',
          resultCount: response.data.data.length,
          minRiskScore: params?.minRiskScore,
        },
      });

      return response.data;
    } catch (error) {
      await auditService.log({
        action: AuditAction.VIEW_HEALTH_RECORD,
        resourceType: AuditResourceType.HEALTH_RECORD,
        status: AuditStatus.FAILURE,
        isPHI: true,
        context: { error: (error as Error).message },
      });
      throw createApiError(error, 'Failed to fetch high-risk students');
    }
  }

  // ==========================================================================
  // HEALTH SCREENINGS
  // ==========================================================================

  /**
   * Record health screening results
   *
   * Documents results from various screening types including vision,
   * hearing, dental, scoliosis, and BMI assessments.
   *
   * @param screeningData - Screening information
   * @returns Created screening record
   * @throws {ValidationError} If validation fails
   * @throws {ApiError} If creation fails
   *
   * @example
   * ```typescript
   * const screening = await healthAssessmentsApi.recordScreening({
   *   studentId: 'student-uuid',
   *   screeningType: 'VISION',
   *   result: 'REFER',
   *   detailedResults: {
   *     leftEye: '20/40',
   *     rightEye: '20/60'
   *   },
   *   followUpRequired: true,
   *   followUpNotes: 'Refer to optometrist for comprehensive exam'
   * });
   * ```
   */
  async recordScreening(screeningData: CreateScreeningRequest): Promise<HealthScreening> {
    try {
      // Validate request data
      createScreeningSchema.parse(screeningData);

      const response = await this.client.post<ApiResponse<HealthScreening>>(
        '/api/v1/health-assessments/screenings',
        screeningData
      );

      const screening = response.data.data!;

      // Audit PHI creation
      await auditService.log({
        action: AuditAction.CREATE_SCREENING,
        resourceType: AuditResourceType.SCREENING,
        resourceId: screening.id,
        studentId: screeningData.studentId,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        metadata: {
          screeningType: screeningData.screeningType,
          result: screeningData.result,
          followUpRequired: screeningData.followUpRequired,
        },
      });

      return screening;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createApiError(error, `Validation error: ${error.errors[0].message}`);
      }

      await auditService.log({
        action: AuditAction.CREATE_SCREENING,
        resourceType: AuditResourceType.SCREENING,
        studentId: screeningData.studentId,
        status: AuditStatus.FAILURE,
        isPHI: true,
        context: { error: (error as Error).message },
      });
      throw createApiError(error, 'Failed to record screening');
    }
  }

  /**
   * Get screening history for a student
   *
   * Retrieves complete screening history with filtering options.
   *
   * @param studentId - Student UUID
   * @param params - Filter and pagination parameters
   * @returns Paginated screening history
   * @throws {ApiError} If query fails
   *
   * @example
   * ```typescript
   * const screenings = await healthAssessmentsApi.getScreeningHistory('student-uuid', {
   *   screeningType: 'VISION',
   *   startDate: '2025-01-01',
   *   endDate: '2025-12-31',
   *   page: 1,
   *   limit: 10
   * });
   * ```
   */
  async getScreeningHistory(studentId: string, params?: {
    screeningType?: ScreeningType;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<HealthScreening>> {
    try {
      if (!studentId) throw new Error('Student ID is required');

      const paginationParams = buildPaginationParams(params?.page, params?.limit);
      const allParams = params ? { ...paginationParams, ...params } : paginationParams;

      const response = await this.client.get<PaginatedResponse<HealthScreening>>(
        `/api/v1/health-assessments/screenings/${studentId}`,
        { params: allParams }
      );

      // Audit PHI access
      await auditService.log({
        action: AuditAction.VIEW_SCREENINGS,
        resourceType: AuditResourceType.SCREENING,
        studentId,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        metadata: {
          screeningType: params?.screeningType,
          resultCount: response.data.data.length,
        },
      });

      return response.data;
    } catch (error) {
      await auditService.log({
        action: AuditAction.VIEW_SCREENINGS,
        resourceType: AuditResourceType.SCREENING,
        studentId,
        status: AuditStatus.FAILURE,
        isPHI: true,
        context: { error: (error as Error).message },
      });
      throw createApiError(error, 'Failed to fetch screening history');
    }
  }

  // ==========================================================================
  // GROWTH TRACKING
  // ==========================================================================

  /**
   * Record growth measurement for a student
   *
   * Records height, weight, BMI, and optional head circumference.
   * Automatically calculates percentiles based on age and gender.
   *
   * @param studentId - Student UUID
   * @param measurementData - Growth measurement data
   * @returns Created growth measurement with calculated percentiles
   * @throws {ValidationError} If validation fails
   * @throws {ApiError} If recording fails
   *
   * @example
   * ```typescript
   * const measurement = await healthAssessmentsApi.recordGrowthMeasurement('student-uuid', {
   *   height: 155.5,
   *   weight: 48.2,
   *   measurementDate: '2025-10-24',
   *   notes: 'Regular checkup'
   * });
   * ```
   */
  async recordGrowthMeasurement(
    studentId: string,
    measurementData: CreateGrowthMeasurementRequest
  ): Promise<GrowthMeasurement> {
    try {
      if (!studentId) throw new Error('Student ID is required');

      // Validate request data
      createGrowthMeasurementSchema.parse(measurementData);

      const response = await this.client.post<ApiResponse<GrowthMeasurement>>(
        `/api/v1/health-assessments/growth/${studentId}`,
        measurementData
      );

      const measurement = response.data.data!;

      // Audit PHI creation
      await auditService.log({
        action: AuditAction.CREATE_GROWTH_MEASUREMENT,
        resourceType: AuditResourceType.GROWTH_MEASUREMENT,
        resourceId: measurement.id,
        studentId,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        metadata: {
          height: measurementData.height,
          weight: measurementData.weight,
          bmi: measurement.bmi,
        },
      });

      return measurement;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createApiError(error, `Validation error: ${error.errors[0].message}`);
      }

      await auditService.log({
        action: AuditAction.CREATE_GROWTH_MEASUREMENT,
        resourceType: AuditResourceType.GROWTH_MEASUREMENT,
        studentId,
        status: AuditStatus.FAILURE,
        isPHI: true,
        context: { error: (error as Error).message },
      });
      throw createApiError(error, 'Failed to record growth measurement');
    }
  }

  /**
   * Get growth analysis for a student
   *
   * Provides comprehensive growth trend analysis including percentile
   * tracking, velocity calculations, and clinical recommendations.
   *
   * @param studentId - Student UUID
   * @param params - Analysis parameters
   * @returns Growth analysis with trends and recommendations
   * @throws {ApiError} If analysis fails or insufficient data
   *
   * @example
   * ```typescript
   * const analysis = await healthAssessmentsApi.getGrowthAnalysis('student-uuid', {
   *   includeHistory: true,
   *   monthsBack: 24
   * });
   * console.log(`BMI Percentile: ${analysis.percentiles.bmiPercentile}`);
   * console.log(`Recommendations: ${analysis.recommendations.join(', ')}`);
   * ```
   */
  async getGrowthAnalysis(studentId: string, params?: {
    includeHistory?: boolean;
    monthsBack?: number;
  }): Promise<GrowthAnalysis> {
    try {
      if (!studentId) throw new Error('Student ID is required');

      const response = await this.client.get<ApiResponse<GrowthAnalysis>>(
        `/api/v1/health-assessments/growth/${studentId}/analysis`,
        { params }
      );

      // Audit PHI access
      await auditService.log({
        action: AuditAction.VIEW_GROWTH_TRENDS,
        resourceType: AuditResourceType.GROWTH_MEASUREMENT,
        studentId,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        metadata: {
          includeHistory: params?.includeHistory,
          monthsBack: params?.monthsBack,
        },
      });

      return response.data.data!;
    } catch (error) {
      await auditService.log({
        action: AuditAction.VIEW_GROWTH_TRENDS,
        resourceType: AuditResourceType.GROWTH_MEASUREMENT,
        studentId,
        status: AuditStatus.FAILURE,
        isPHI: true,
        context: { error: (error as Error).message },
      });
      throw createApiError(error, 'Failed to fetch growth analysis');
    }
  }

  // ==========================================================================
  // IMMUNIZATION FORECASTING
  // ==========================================================================

  /**
   * Get immunization forecast for a student
   *
   * Generates immunization schedule based on current status, age,
   * and CDC guidelines. Shows overdue, due soon, and future immunizations.
   *
   * @param studentId - Student UUID
   * @param params - Forecast parameters
   * @returns Immunization forecast with due dates
   * @throws {ApiError} If forecast generation fails
   *
   * @example
   * ```typescript
   * const forecast = await healthAssessmentsApi.getImmunizationForecast('student-uuid', {
   *   includeHistory: true
   * });
   * const overdue = forecast.forecasts.filter(f => f.status === 'OVERDUE');
   * console.log(`Overdue vaccinations: ${overdue.length}`);
   * ```
   */
  async getImmunizationForecast(studentId: string, params?: {
    includeHistory?: boolean;
  }): Promise<ImmunizationForecast> {
    try {
      if (!studentId) throw new Error('Student ID is required');

      const response = await this.client.get<ApiResponse<ImmunizationForecast>>(
        `/api/v1/health-assessments/immunizations/${studentId}/forecast`,
        { params }
      );

      // Audit PHI access
      await auditService.log({
        action: AuditAction.VIEW_HEALTH_RECORD,
        resourceType: AuditResourceType.HEALTH_RECORD,
        studentId,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        metadata: {
          queryType: 'immunization_forecast',
          overdueCount: response.data.data!.overdueCount,
        },
      });

      return response.data.data!;
    } catch (error) {
      await auditService.log({
        action: AuditAction.VIEW_HEALTH_RECORD,
        resourceType: AuditResourceType.HEALTH_RECORD,
        studentId,
        status: AuditStatus.FAILURE,
        isPHI: true,
        context: { error: (error as Error).message },
      });
      throw createApiError(error, 'Failed to fetch immunization forecast');
    }
  }

  // ==========================================================================
  // EMERGENCY NOTIFICATIONS
  // ==========================================================================

  /**
   * Send emergency health notification
   *
   * CRITICAL: Triggers emergency notification system for urgent health
   * situations. Automatically contacts parents, emergency contacts, and
   * medical staff based on severity.
   *
   * @param notificationData - Emergency notification details
   * @returns Created emergency notification with contact confirmations
   * @throws {ValidationError} If validation fails
   * @throws {ApiError} If notification fails to send
   *
   * @example
   * ```typescript
   * const notification = await healthAssessmentsApi.sendEmergencyNotification({
   *   studentId: 'student-uuid',
   *   emergencyType: 'ALLERGIC_REACTION',
   *   severity: 'CRITICAL',
   *   description: 'Student experiencing anaphylaxis after peanut exposure',
   *   location: 'Cafeteria',
   *   actionsTaken: [
   *     'Administered EpiPen',
   *     'Called 911',
   *     'Student lying down with feet elevated'
   *   ],
   *   vitalSigns: {
   *     bloodPressure: '90/60',
   *     heartRate: 120,
   *     oxygenSaturation: 94
   *   }
   * });
   * ```
   */
  async sendEmergencyNotification(
    notificationData: CreateEmergencyNotificationRequest
  ): Promise<EmergencyNotification> {
    try {
      // Validate request data
      createEmergencyNotificationSchema.parse(notificationData);

      const response = await this.client.post<ApiResponse<EmergencyNotification>>(
        '/api/v1/health-assessments/emergency/notify',
        notificationData
      );

      const notification = response.data.data!;

      // CRITICAL: Immediate audit log for emergency
      await auditService.log({
        action: AuditAction.CREATE_INCIDENT_REPORT,
        resourceType: AuditResourceType.INCIDENT_REPORT,
        resourceId: notification.id,
        studentId: notificationData.studentId,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        metadata: {
          emergencyType: notificationData.emergencyType,
          severity: notificationData.severity,
          location: notificationData.location,
          contactsNotified: notification.notifiedContacts.length,
        },
      });

      return notification;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createApiError(error, `Validation error: ${error.errors[0].message}`);
      }

      // CRITICAL: Log failed emergency notification attempt
      await auditService.log({
        action: AuditAction.CREATE_INCIDENT_REPORT,
        resourceType: AuditResourceType.INCIDENT_REPORT,
        studentId: notificationData.studentId,
        status: AuditStatus.FAILURE,
        isPHI: true,
        context: {
          error: (error as Error).message,
          emergencyType: notificationData.emergencyType,
          severity: notificationData.severity,
        },
      });
      throw createApiError(error, 'CRITICAL: Failed to send emergency notification');
    }
  }

  /**
   * Get emergency notification history for a student
   *
   * Retrieves history of emergency notifications including incident
   * details, response times, and outcomes.
   *
   * @param studentId - Student UUID
   * @param params - Filter and pagination parameters
   * @returns Paginated emergency notification history
   * @throws {ApiError} If query fails
   *
   * @example
   * ```typescript
   * const emergencies = await healthAssessmentsApi.getEmergencyHistory('student-uuid', {
   *   startDate: '2025-01-01',
   *   severity: 'HIGH',
   *   page: 1,
   *   limit: 20
   * });
   * ```
   */
  async getEmergencyHistory(studentId: string, params?: {
    startDate?: string;
    endDate?: string;
    severity?: EmergencySeverity;
    emergencyType?: EmergencyType;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<EmergencyNotification>> {
    try {
      if (!studentId) throw new Error('Student ID is required');

      const paginationParams = buildPaginationParams(params?.page, params?.limit);
      const allParams = params ? { ...paginationParams, ...params } : paginationParams;

      const response = await this.client.get<PaginatedResponse<EmergencyNotification>>(
        `/api/v1/health-assessments/emergency/${studentId}`,
        { params: allParams }
      );

      // Audit PHI access
      await auditService.log({
        action: AuditAction.VIEW_INCIDENT_REPORTS,
        resourceType: AuditResourceType.INCIDENT_REPORT,
        studentId,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        metadata: {
          resultCount: response.data.data.length,
          severity: params?.severity,
        },
      });

      return response.data;
    } catch (error) {
      await auditService.log({
        action: AuditAction.VIEW_INCIDENT_REPORTS,
        resourceType: AuditResourceType.INCIDENT_REPORT,
        studentId,
        status: AuditStatus.FAILURE,
        isPHI: true,
        context: { error: (error as Error).message },
      });
      throw createApiError(error, 'Failed to fetch emergency history');
    }
  }

  // ==========================================================================
  // MEDICATION INTERACTIONS
  // ==========================================================================

  /**
   * Get comprehensive medication interactions for a student
   *
   * Analyzes all current medications, supplements, and known allergies
   * for potential interactions including drug-drug, drug-food, and
   * drug-condition interactions.
   *
   * @param studentId - Student UUID
   * @returns Medication interaction analysis
   * @throws {ApiError} If analysis fails
   *
   * @example
   * ```typescript
   * const interactions = await healthAssessmentsApi.getMedicationInteractions('student-uuid');
   * const major = interactions.interactions.filter(i => i.severity === 'MAJOR');
   * if (major.length > 0) {
   *   console.warn('Major interactions found:', major);
   * }
   * ```
   */
  async getMedicationInteractions(studentId: string): Promise<MedicationInteractionCheck> {
    try {
      if (!studentId) throw new Error('Student ID is required');

      const response = await this.client.get<ApiResponse<MedicationInteractionCheck>>(
        `/api/v1/health-assessments/medication-interactions/${studentId}`
      );

      // Audit PHI access
      await auditService.log({
        action: AuditAction.VIEW_MEDICATIONS,
        resourceType: AuditResourceType.MEDICATION,
        studentId,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        metadata: {
          queryType: 'medication_interactions',
          interactionCount: response.data.data!.interactions.length,
          highSeverityCount: response.data.data!.highSeverityCount,
        },
      });

      return response.data.data!;
    } catch (error) {
      await auditService.log({
        action: AuditAction.VIEW_MEDICATIONS,
        resourceType: AuditResourceType.MEDICATION,
        studentId,
        status: AuditStatus.FAILURE,
        isPHI: true,
        context: { error: (error as Error).message },
      });
      throw createApiError(error, 'Failed to fetch medication interactions');
    }
  }

  /**
   * Check interactions for a potential new medication
   *
   * Validates potential interactions before adding a new medication
   * to a student's regimen. Includes severity assessment and
   * management recommendations.
   *
   * @param studentId - Student UUID
   * @param medicationData - New medication details
   * @returns Interaction check results
   * @throws {ValidationError} If validation fails
   * @throws {ApiError} If check fails
   *
   * @example
   * ```typescript
   * const check = await healthAssessmentsApi.checkNewMedicationInteractions('student-uuid', {
   *   medicationName: 'Amoxicillin',
   *   dosage: '500mg',
   *   frequency: 'three times daily'
   * });
   *
   * if (check.requiresReview) {
   *   console.warn('Pharmacist review required before prescribing');
   * }
   * ```
   */
  async checkNewMedicationInteractions(
    studentId: string,
    medicationData: CheckNewMedicationRequest
  ): Promise<MedicationInteractionCheck> {
    try {
      if (!studentId) throw new Error('Student ID is required');

      // Validate request data
      checkNewMedicationSchema.parse(medicationData);

      const response = await this.client.post<ApiResponse<MedicationInteractionCheck>>(
        `/api/v1/health-assessments/medication-interactions/${studentId}/check`,
        medicationData
      );

      // Audit PHI access and check
      await auditService.log({
        action: AuditAction.VIEW_MEDICATIONS,
        resourceType: AuditResourceType.MEDICATION,
        studentId,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        metadata: {
          queryType: 'check_new_medication',
          medicationName: medicationData.medicationName,
          interactionCount: response.data.data!.interactions.length,
          requiresReview: response.data.data!.requiresReview,
        },
      });

      return response.data.data!;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createApiError(error, `Validation error: ${error.errors[0].message}`);
      }

      await auditService.log({
        action: AuditAction.VIEW_MEDICATIONS,
        resourceType: AuditResourceType.MEDICATION,
        studentId,
        status: AuditStatus.FAILURE,
        isPHI: true,
        context: {
          error: (error as Error).message,
          medicationName: medicationData.medicationName,
        },
      });
      throw createApiError(error, 'Failed to check medication interactions');
    }
  }
}

// ============================================================================
// FACTORY FUNCTION
// ============================================================================

/**
 * Factory function for creating HealthAssessmentsApi instances
 *
 * @param client - Configured ApiClient instance
 * @returns HealthAssessmentsApi instance
 *
 * @example
 * ```typescript
 * import { apiClient } from '@/services/core/ApiClient';
 * import { createHealthAssessmentsApi } from '@/services/modules/healthAssessmentsApi';
 *
 * const healthAssessmentsApi = createHealthAssessmentsApi(apiClient);
 * ```
 */
export function createHealthAssessmentsApi(client: ApiClient): HealthAssessmentsApi {
  return new HealthAssessmentsApi(client);
}

// Export singleton instance
import { apiClient } from '../core/ApiClient'
export const healthAssessmentsApi = createHealthAssessmentsApi(apiClient)

// Default export
export default HealthAssessmentsApi;
