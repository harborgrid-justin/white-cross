/**
 * Health Assessments API - Main Entry Point
 *
 * Unified API for all health assessment features with comprehensive
 * type safety, validation, and HIPAA-compliant audit logging.
 *
 * @module HealthAssessments
 * @version 2.0.0
 * @since 2025-10-24
 *
 * @example
 * ```typescript
 * // Import singleton instance (recommended)
 * import { healthAssessmentsApi } from '@/services/modules/healthAssessments';
 *
 * // Or import individual modules
 * import { RiskAssessmentsApi, ScreeningsApi } from '@/services/modules/healthAssessments';
 *
 * // Or import types only
 * import type { HealthRiskAssessment, HealthScreening } from '@/services/modules/healthAssessments';
 * ```
 */

// ============================================================================
// RE-EXPORT ALL TYPES
// ============================================================================

export type {
  // Risk Assessment Types
  RiskLevel,
  RiskFactor,
  HealthRiskAssessment,
  HighRiskStudent,
  // Screening Types
  ScreeningType,
  ScreeningResult,
  VisionScreeningResults,
  HearingScreeningResults,
  DentalScreeningResults,
  ScoliosisScreeningResults,
  BMIScreeningResults,
  ScreeningDetailedResults,
  HealthScreening,
  CreateScreeningRequest,
  // Growth Tracking Types
  GrowthMeasurement,
  CreateGrowthMeasurementRequest,
  CurrentMeasurements,
  GrowthPercentiles,
  GrowthTrends,
  MeasurementHistoryPoint,
  GrowthAnalysis,
  // Immunization Types
  ImmunizationStatus,
  VaccineForecast,
  ImmunizationForecast,
  // Emergency Notification Types
  EmergencyType,
  EmergencySeverity,
  ContactType,
  NotificationMethod,
  NotifiedContact,
  VitalSigns,
  EmergencyNotification,
  CreateEmergencyNotificationRequest,
  // Medication Interaction Types
  InteractionType,
  InteractionSeverity,
  MedicationInteraction,
  MedicationInteractionCheck,
  CheckNewMedicationRequest,
} from './types';

// ============================================================================
// RE-EXPORT VALIDATION SCHEMAS
// ============================================================================

export {
  uuidSchema,
  dateSchema,
  createScreeningSchema,
  createGrowthMeasurementSchema,
  createEmergencyNotificationSchema,
  checkNewMedicationSchema,
} from './validationSchemas';

// ============================================================================
// RE-EXPORT API MODULES
// ============================================================================

export { RiskAssessmentsApi } from './riskAssessmentsApi';
export type { HighRiskStudentsQueryParams } from './riskAssessmentsApi';

export { ScreeningsApi } from './screeningsApi';
export type { ScreeningHistoryQueryParams } from './screeningsApi';

export { GrowthTrackingApi } from './growthTrackingApi';
export type { GrowthAnalysisQueryParams } from './growthTrackingApi';

export { ImmunizationApi } from './immunizationApi';
export type { ImmunizationForecastQueryParams } from './immunizationApi';

export { EmergencyNotificationApi } from './emergencyNotificationApi';
export type { EmergencyHistoryQueryParams } from './emergencyNotificationApi';

export { MedicationInteractionApi } from './medicationInteractionApi';

// ============================================================================
// UNIFIED API CLASS
// ============================================================================

import type { ApiClient } from '../../core/ApiClient';
import { RiskAssessmentsApi } from './riskAssessmentsApi';
import { ScreeningsApi } from './screeningsApi';
import { GrowthTrackingApi } from './growthTrackingApi';
import { ImmunizationApi } from './immunizationApi';
import { EmergencyNotificationApi } from './emergencyNotificationApi';
import { MedicationInteractionApi } from './medicationInteractionApi';

/**
 * Unified Health Assessments API
 *
 * Provides a single interface to all health assessment functionality
 * while maintaining separation of concerns internally.
 *
 * @example
 * ```typescript
 * import { apiClient } from '@/services/core/ApiClient';
 * import { HealthAssessmentsApi } from '@/services/modules/healthAssessments';
 *
 * const healthApi = new HealthAssessmentsApi(apiClient);
 *
 * // Access risk assessments
 * const riskAssessment = await healthApi.getHealthRisk('student-id');
 *
 * // Access screenings
 * const screening = await healthApi.recordScreening({...});
 *
 * // Access growth tracking
 * const measurement = await healthApi.recordGrowthMeasurement('student-id', {...});
 * ```
 */
export class HealthAssessmentsApi {
  private readonly riskAssessments: RiskAssessmentsApi;
  private readonly screenings: ScreeningsApi;
  private readonly growthTracking: GrowthTrackingApi;
  private readonly immunization: ImmunizationApi;
  private readonly emergencyNotification: EmergencyNotificationApi;
  private readonly medicationInteraction: MedicationInteractionApi;

  constructor(client: ApiClient) {
    this.riskAssessments = new RiskAssessmentsApi(client);
    this.screenings = new ScreeningsApi(client);
    this.growthTracking = new GrowthTrackingApi(client);
    this.immunization = new ImmunizationApi(client);
    this.emergencyNotification = new EmergencyNotificationApi(client);
    this.medicationInteraction = new MedicationInteractionApi(client);
  }

  // ==========================================================================
  // HEALTH RISK ASSESSMENTS - Delegate to RiskAssessmentsApi
  // ==========================================================================

  /**
   * Get health risk assessment for a specific student
   * @see RiskAssessmentsApi.getHealthRisk
   */
  async getHealthRisk(studentId: string) {
    return this.riskAssessments.getHealthRisk(studentId);
  }

  /**
   * Get list of high-risk students
   * @see RiskAssessmentsApi.getHighRiskStudents
   */
  async getHighRiskStudents(params?: Parameters<RiskAssessmentsApi['getHighRiskStudents']>[0]) {
    return this.riskAssessments.getHighRiskStudents(params);
  }

  // ==========================================================================
  // HEALTH SCREENINGS - Delegate to ScreeningsApi
  // ==========================================================================

  /**
   * Record health screening results
   * @see ScreeningsApi.recordScreening
   */
  async recordScreening(screeningData: Parameters<ScreeningsApi['recordScreening']>[0]) {
    return this.screenings.recordScreening(screeningData);
  }

  /**
   * Get screening history for a student
   * @see ScreeningsApi.getScreeningHistory
   */
  async getScreeningHistory(
    studentId: string,
    params?: Parameters<ScreeningsApi['getScreeningHistory']>[1]
  ) {
    return this.screenings.getScreeningHistory(studentId, params);
  }

  // ==========================================================================
  // GROWTH TRACKING - Delegate to GrowthTrackingApi
  // ==========================================================================

  /**
   * Record growth measurement for a student
   * @see GrowthTrackingApi.recordGrowthMeasurement
   */
  async recordGrowthMeasurement(
    studentId: string,
    measurementData: Parameters<GrowthTrackingApi['recordGrowthMeasurement']>[1]
  ) {
    return this.growthTracking.recordGrowthMeasurement(studentId, measurementData);
  }

  /**
   * Get growth analysis for a student
   * @see GrowthTrackingApi.getGrowthAnalysis
   */
  async getGrowthAnalysis(
    studentId: string,
    params?: Parameters<GrowthTrackingApi['getGrowthAnalysis']>[1]
  ) {
    return this.growthTracking.getGrowthAnalysis(studentId, params);
  }

  // ==========================================================================
  // IMMUNIZATION FORECASTING - Delegate to ImmunizationApi
  // ==========================================================================

  /**
   * Get immunization forecast for a student
   * @see ImmunizationApi.getImmunizationForecast
   */
  async getImmunizationForecast(
    studentId: string,
    params?: Parameters<ImmunizationApi['getImmunizationForecast']>[1]
  ) {
    return this.immunization.getImmunizationForecast(studentId, params);
  }

  // ==========================================================================
  // EMERGENCY NOTIFICATIONS - Delegate to EmergencyNotificationApi
  // ==========================================================================

  /**
   * Send emergency health notification
   * @see EmergencyNotificationApi.sendEmergencyNotification
   */
  async sendEmergencyNotification(
    notificationData: Parameters<EmergencyNotificationApi['sendEmergencyNotification']>[0]
  ) {
    return this.emergencyNotification.sendEmergencyNotification(notificationData);
  }

  /**
   * Get emergency notification history for a student
   * @see EmergencyNotificationApi.getEmergencyHistory
   */
  async getEmergencyHistory(
    studentId: string,
    params?: Parameters<EmergencyNotificationApi['getEmergencyHistory']>[1]
  ) {
    return this.emergencyNotification.getEmergencyHistory(studentId, params);
  }

  // ==========================================================================
  // MEDICATION INTERACTIONS - Delegate to MedicationInteractionApi
  // ==========================================================================

  /**
   * Get comprehensive medication interactions for a student
   * @see MedicationInteractionApi.getMedicationInteractions
   */
  async getMedicationInteractions(studentId: string) {
    return this.medicationInteraction.getMedicationInteractions(studentId);
  }

  /**
   * Check interactions for a potential new medication
   * @see MedicationInteractionApi.checkNewMedicationInteractions
   */
  async checkNewMedicationInteractions(
    studentId: string,
    medicationData: Parameters<MedicationInteractionApi['checkNewMedicationInteractions']>[1]
  ) {
    return this.medicationInteraction.checkNewMedicationInteractions(studentId, medicationData);
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
 * import { createHealthAssessmentsApi } from '@/services/modules/healthAssessments';
 *
 * const healthAssessmentsApi = createHealthAssessmentsApi(apiClient);
 * ```
 */
export function createHealthAssessmentsApi(client: ApiClient): HealthAssessmentsApi {
  return new HealthAssessmentsApi(client);
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

/**
 * Default singleton instance of HealthAssessmentsApi
 *
 * @example
 * ```typescript
 * import { healthAssessmentsApi } from '@/services/modules/healthAssessments';
 *
 * const riskAssessment = await healthAssessmentsApi.getHealthRisk('student-uuid');
 * ```
 */
import { apiClient } from '../../core/ApiClient';
export const healthAssessmentsApi = createHealthAssessmentsApi(apiClient);

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

/**
 * Default export for convenience
 */
export default HealthAssessmentsApi;
