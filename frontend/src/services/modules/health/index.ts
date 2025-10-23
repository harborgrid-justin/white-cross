/**
 * Health Services Module Facade
 *
 * Purpose: Unified interface for all health-related API services
 *
 * Architecture:
 * - Provides single import point for all health modules
 * - Maintains backward compatibility with legacy API
 * - Implements service orchestration patterns
 * - Ensures consistent error handling and logging
 *
 * @module services/modules/health
 */

// Import factory functions from all health service modules
import { createAllergiesApi } from './allergiesApi';
import { createChronicConditionsApi } from './chronicConditionsApi';
import { createVaccinationsApi } from './vaccinationsApi';
import { createScreeningsApi } from './screeningsApi';
import { createGrowthMeasurementsApi } from './growthMeasurementsApi';
import { createVitalSignsApi } from './vitalSignsApi';
import { createHealthRecordsApi } from './healthRecordsApi';

// Re-export all factory functions
export {
  createAllergiesApi,
  createChronicConditionsApi,
  createVaccinationsApi,
  createScreeningsApi,
  createGrowthMeasurementsApi,
  createVitalSignsApi,
  createHealthRecordsApi
};

// Re-export all types from individual modules
export type {
  // Allergies types
  Allergy,
  AllergySeverity,
  AllergyCreate,
  AllergyUpdate,
  AllergyFilters
} from './allergiesApi';

export type {
  // Chronic Conditions types
  ChronicCondition,
  ConditionSeverity,
  ConditionStatus,
  ChronicConditionCreate,
  ChronicConditionUpdate,
  ChronicConditionFilters,
  CarePlanUpdate
} from './chronicConditionsApi';

export type {
  // Vaccinations types
  Vaccination,
  VaccineRoute,
  ExemptionType,
  ComplianceStatus,
  VaccinationCreate,
  VaccinationUpdate,
  VaccinationFilters,
  VaccinationSchedule,
  ComplianceReport
} from './vaccinationsApi';

export type {
  // Screenings types
  Screening,
  ScreeningType,
  ScreeningResult,
  ScreeningDetails,
  ScreeningCreate,
  ScreeningUpdate,
  ScreeningFilters,
  ScreeningSchedule
} from './screeningsApi';

export type {
  // Growth Measurements types
  GrowthMeasurement,
  HeightUnit,
  WeightUnit,
  HeadUnit,
  MeasurementType,
  BMICategory,
  GrowthStandard,
  GrowthMeasurementCreate,
  GrowthMeasurementUpdate,
  GrowthMeasurementFilters,
  GrowthTrend,
  GrowthChart
} from './growthMeasurementsApi';

export type {
  // Vital Signs types
  VitalSigns,
  TemperatureUnit,
  TemperatureMethod,
  BPPosition,
  PulseMethod,
  GlucoseUnit,
  VitalSignsCreate,
  VitalSignsUpdate,
  VitalSignsFilters,
  VitalSignsTrend,
  VitalSignsAlert
} from './vitalSignsApi';

export type {
  // Health Records types
  HealthRecord,
  HealthRecordType,
  HealthRecordCreate,
  HealthRecordUpdate,
  HealthRecordFilters,
  HealthSummary,
  ExportOptions,
  ImportResult
} from './healthRecordsApi';

// ==========================================
// UNIFIED HEALTH API FACTORY
// ==========================================

import type { ApiClient } from '../../core/ApiClient';

/**
 * Unified Health API Service Factory
 * Provides orchestrated access to all health modules
 */
export function createUnifiedHealthApi(client: ApiClient) {
  const allergiesApi = createAllergiesApi(client);
  const chronicConditionsApi = createChronicConditionsApi(client);
  const vaccinationsApi = createVaccinationsApi(client);
  const screeningsApi = createScreeningsApi(client);
  const growthMeasurementsApi = createGrowthMeasurementsApi(client);
  const vitalSignsApi = createVitalSignsApi(client);
  const healthRecordsApi = createHealthRecordsApi(client);

  return {
    allergies: allergiesApi,
    conditions: chronicConditionsApi,
    vaccinations: vaccinationsApi,
    screenings: screeningsApi,
    growth: growthMeasurementsApi,
    vitals: vitalSignsApi,
    records: healthRecordsApi,

    /**
     * Get comprehensive health overview for a student
     */
    async getComprehensiveHealthProfile(studentId: string) {
      try {
        // Fetch all health data in parallel for performance
        const [
          summary,
          allergiesData,
          conditions,
          latestVitals,
          latestGrowth,
          complianceReport,
          recentScreenings
        ] = await Promise.all([
          healthRecordsApi.getHealthSummary(studentId),
          allergiesApi.getStudentAllergies(studentId),
          chronicConditionsApi.getActiveConditions(studentId),
          vitalSignsApi.getLatestVitalSigns(studentId),
          growthMeasurementsApi.getLatestMeasurement(studentId),
          vaccinationsApi.getComplianceReport(studentId),
          screeningsApi.getStudentScreenings(studentId, {}).then(result => result.slice(0, 5))
        ]);

        return {
          summary,
          allergies: allergiesData,
          activeConditions: conditions,
          latestVitals,
          latestGrowthMeasurement: latestGrowth,
          vaccinationCompliance: complianceReport,
          recentScreenings,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        console.error('Failed to fetch comprehensive health profile:', error);
        throw error;
      }
    },

    /**
     * Check for any critical health alerts
     */
    async getCriticalAlerts(studentId: string) {
      try {
        const [
          criticalAllergies,
          severeConditions,
          overdueVaccinations,
          abnormalVitals
        ] = await Promise.all([
          allergiesApi.getCriticalAllergies(studentId),
          chronicConditionsApi.getStudentConditions(studentId, {
            severity: 'CRITICAL'
          }),
          vaccinationsApi.getStudentVaccinations(studentId, {
            overdue: true
          }),
          vitalSignsApi.getUnacknowledgedAlerts()
        ]);

        return {
          criticalAllergies,
          severeConditions,
          overdueVaccinations,
          abnormalVitals: abnormalVitals.filter(a => a.studentId === studentId),
          hasAlerts: criticalAllergies.length > 0 ||
                    severeConditions.length > 0 ||
                    overdueVaccinations.length > 0 ||
                    abnormalVitals.some(a => a.studentId === studentId)
        };
      } catch (error) {
        console.error('Failed to fetch critical alerts:', error);
        throw error;
      }
    },

    /**
     * Perform pre-medication safety check
     */
    async performMedicationSafetyCheck(
      studentId: string,
      medicationName: string
    ) {
      try {
        const [allergyConflicts, conditions] = await Promise.all([
          allergiesApi.checkMedicationConflicts(studentId, medicationName),
          chronicConditionsApi.getActiveConditions(studentId)
        ]);

        return {
          safe: !allergyConflicts.hasConflict,
          allergyConflicts: allergyConflicts.conflicts,
          relevantConditions: conditions,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        console.error('Failed to perform medication safety check:', error);
        throw error;
      }
    },

    /**
     * Get all items requiring follow-up
     */
    async getFollowUpItems(schoolId?: string) {
      try {
        const [
          healthRecordsData,
          screeningsData,
          conditionsData
        ] = await Promise.all([
          healthRecordsApi.getFollowUpRequired(schoolId),
          screeningsApi.getScreeningsRequiringFollowUp(schoolId),
          chronicConditionsApi.getConditionsForReview()
        ]);

        return {
          healthRecords: healthRecordsData.data,
          screenings: screeningsData.data,
          conditions: conditionsData.data,
          totalItems: healthRecordsData.total + screeningsData.total + conditionsData.total
        };
      } catch (error) {
        console.error('Failed to fetch follow-up items:', error);
        throw error;
      }
    },

    /**
     * Generate comprehensive health report
     */
    async generateComprehensiveReport(
      studentId: string,
      options: {
        format?: 'PDF' | 'JSON';
        dateFrom?: string;
        dateTo?: string;
        includeAll?: boolean;
      } = {}
    ): Promise<Blob | any> {
      try {
        if (options.format === 'PDF') {
          return await healthRecordsApi.exportRecords({
            studentId,
            format: 'PDF',
            dateFrom: options.dateFrom,
            dateTo: options.dateTo,
            includeAllergies: options.includeAll ?? true,
            includeConditions: options.includeAll ?? true,
            includeVaccinations: options.includeAll ?? true,
            includeVitals: options.includeAll ?? true,
            includeMedications: options.includeAll ?? true,
            includeSummary: true
          });
        } else {
          // Return structured JSON data
          const profile = await this.getComprehensiveHealthProfile(studentId);
          return {
            ...profile,
            exportDate: new Date().toISOString(),
            exportedBy: 'System'
          };
        }
      } catch (error) {
        console.error('Failed to generate comprehensive report:', error);
        throw error;
      }
    }
  };
}

// ==========================================
// LEGACY COMPATIBILITY LAYER
// ==========================================

/**
 * Legacy HealthRecordsApi Factory
 * Maintains backward compatibility with existing code
 * @deprecated Use createUnifiedHealthApi or individual API factories instead
 */
export function createHealthRecordsApi_Legacy(client: ApiClient) {
  const unified = createUnifiedHealthApi(client);

  // Display deprecation warning
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
    console.warn(
      '[DEPRECATION] createHealthRecordsApi_Legacy: This monolithic API is deprecated. ' +
      'Please migrate to createUnifiedHealthApi or individual API factories:\n' +
      '- createAllergiesApi\n' +
      '- createChronicConditionsApi\n' +
      '- createVaccinationsApi\n' +
      '- createScreeningsApi\n' +
      '- createGrowthMeasurementsApi\n' +
      '- createVitalSignsApi\n' +
      '- createHealthRecordsApi\n' +
      'Import from: @/services/modules/health'
    );
  }

  return {
    // Main health records operations
    getRecords: unified.records.getStudentRecords.bind(unified.records),
    getRecordById: unified.records.getById.bind(unified.records),
    createRecord: unified.records.create.bind(unified.records),
    updateRecord: unified.records.update.bind(unified.records),
    deleteRecord: unified.records.delete.bind(unified.records),
    getSummary: unified.records.getHealthSummary.bind(unified.records),
    searchRecords: unified.records.searchRecords.bind(unified.records),
    exportRecords: unified.records.exportRecords.bind(unified.records),
    importRecords: unified.records.importRecords.bind(unified.records),

    // Allergies operations
    getAllergies: unified.allergies.getStudentAllergies.bind(unified.allergies),
    getAllergyById: unified.allergies.getById.bind(unified.allergies),
    createAllergy: unified.allergies.create.bind(unified.allergies),
    updateAllergy: unified.allergies.update.bind(unified.allergies),
    deleteAllergy: unified.allergies.delete.bind(unified.allergies),
    getCriticalAllergies: unified.allergies.getCriticalAllergies.bind(unified.allergies),
    checkMedicationConflicts: unified.allergies.checkMedicationConflicts.bind(unified.allergies),

    // Chronic conditions operations
    getConditions: unified.conditions.getStudentConditions.bind(unified.conditions),
    getConditionById: unified.conditions.getById.bind(unified.conditions),
    createCondition: unified.conditions.create.bind(unified.conditions),
    updateCondition: unified.conditions.update.bind(unified.conditions),
    deleteCondition: unified.conditions.delete.bind(unified.conditions),
    updateCarePlan: unified.conditions.updateCarePlan.bind(unified.conditions),

    // Vaccinations operations
    getVaccinations: unified.vaccinations.getStudentVaccinations.bind(unified.vaccinations),
    getVaccinationById: unified.vaccinations.getById.bind(unified.vaccinations),
    createVaccination: unified.vaccinations.create.bind(unified.vaccinations),
    updateVaccination: unified.vaccinations.update.bind(unified.vaccinations),
    deleteVaccination: unified.vaccinations.delete.bind(unified.vaccinations),
    getComplianceReport: unified.vaccinations.getComplianceReport.bind(unified.vaccinations),
    checkStateCompliance: unified.vaccinations.checkStateCompliance.bind(unified.vaccinations),

    // Screenings operations
    getScreenings: unified.screenings.getStudentScreenings.bind(unified.screenings),
    getScreeningById: unified.screenings.getById.bind(unified.screenings),
    createScreening: unified.screenings.create.bind(unified.screenings),
    updateScreening: unified.screenings.update.bind(unified.screenings),
    deleteScreening: unified.screenings.delete.bind(unified.screenings),
    getLatestScreening: unified.screenings.getLatestScreening.bind(unified.screenings),

    // Growth measurements operations
    getGrowthMeasurements: unified.growth.getStudentMeasurements.bind(unified.growth),
    getGrowthMeasurementById: unified.growth.getById.bind(unified.growth),
    createGrowthMeasurement: unified.growth.create.bind(unified.growth),
    updateGrowthMeasurement: unified.growth.update.bind(unified.growth),
    deleteGrowthMeasurement: unified.growth.delete.bind(unified.growth),
    getGrowthTrend: unified.growth.getGrowthTrend.bind(unified.growth),
    getGrowthChart: unified.growth.getGrowthChart.bind(unified.growth),

    // Vital signs operations
    getVitalSigns: unified.vitals.getStudentVitalSigns.bind(unified.vitals),
    getVitalSignsById: unified.vitals.getById.bind(unified.vitals),
    createVitalSigns: unified.vitals.create.bind(unified.vitals),
    updateVitalSigns: unified.vitals.update.bind(unified.vitals),
    deleteVitalSigns: unified.vitals.delete.bind(unified.vitals),
    getLatestVitals: unified.vitals.getLatestVitalSigns.bind(unified.vitals),
    getVitalTrends: unified.vitals.getVitalTrends.bind(unified.vitals),

    // Legacy method aliases for backward compatibility
    get getHealthRecordById() { return this.getRecordById; },
    get getHealthSummary() { return this.getSummary; },
    get searchHealthRecords() { return this.searchRecords; },
    get createHealthRecord() { return this.createRecord; },
    get updateHealthRecord() { return this.updateRecord; },
    get deleteHealthRecord() { return this.deleteRecord; },
    get getStudentAllergies() { return this.getAllergies; },
    get getStudentChronicConditions() { return this.getConditions; },
    get createChronicCondition() { return this.createCondition; },
    get updateChronicCondition() { return this.updateCondition; },
    get deleteChronicCondition() { return this.deleteCondition; },
    get getVaccinationRecords() { return this.getVaccinations; }
  };
}

// Default export for maximum compatibility
export default createUnifiedHealthApi;
