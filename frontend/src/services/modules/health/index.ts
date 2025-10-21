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

// Import all health service modules
import { allergiesApi } from './allergies.api';
import { chronicConditionsApi } from './chronicConditions.api';
import { vaccinationsApi } from './vaccinations.api';
import { screeningsApi } from './screenings.api';
import { growthMeasurementsApi } from './growthMeasurements.api';
import { vitalSignsApi } from './vitalSigns.api';
import { healthRecordsApi } from './healthRecords.api';

// Re-export all individual APIs
export {
  allergiesApi,
  chronicConditionsApi,
  vaccinationsApi,
  screeningsApi,
  growthMeasurementsApi,
  vitalSignsApi,
  healthRecordsApi
};

// Re-export all types from individual modules
export type {
  // Allergies types
  Allergy,
  AllergySeverity,
  AllergyCreate,
  AllergyUpdate,
  AllergyFilters
} from './allergies.api';

export type {
  // Chronic Conditions types
  ChronicCondition,
  ConditionSeverity,
  ConditionStatus,
  ChronicConditionCreate,
  ChronicConditionUpdate,
  ChronicConditionFilters,
  CarePlanUpdate
} from './chronicConditions.api';

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
} from './vaccinations.api';

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
} from './screenings.api';

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
} from './growthMeasurements.api';

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
} from './vitalSigns.api';

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
} from './healthRecords.api';

// ==========================================
// UNIFIED HEALTH API CLASS
// ==========================================

/**
 * Unified Health API Service
 * Provides orchestrated access to all health modules
 */
export class UnifiedHealthApi {
  public readonly allergies = allergiesApi;
  public readonly conditions = chronicConditionsApi;
  public readonly vaccinations = vaccinationsApi;
  public readonly screenings = screeningsApi;
  public readonly growth = growthMeasurementsApi;
  public readonly vitals = vitalSignsApi;
  public readonly records = healthRecordsApi;

  /**
   * Get comprehensive health overview for a student
   */
  async getComprehensiveHealthProfile(studentId: string) {
    try {
      // Fetch all health data in parallel for performance
      const [
        summary,
        allergies,
        conditions,
        latestVitals,
        latestGrowth,
        complianceReport,
        recentScreenings
      ] = await Promise.all([
        this.records.getHealthSummary(studentId),
        this.allergies.getStudentAllergies(studentId),
        this.conditions.getActiveConditions(studentId),
        this.vitals.getLatestVitalSigns(studentId),
        this.growth.getLatestMeasurement(studentId),
        this.vaccinations.getComplianceReport(studentId),
        this.screenings.getStudentScreenings(studentId, { limit: 5 })
      ]);

      return {
        summary,
        allergies,
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
  }

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
        this.allergies.getCriticalAllergies(studentId),
        this.conditions.getStudentConditions(studentId, {
          severity: 'CRITICAL'
        }),
        this.vaccinations.getStudentVaccinations(studentId, {
          overdue: true
        }),
        this.vitals.getUnacknowledgedAlerts()
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
  }

  /**
   * Perform pre-medication safety check
   */
  async performMedicationSafetyCheck(
    studentId: string,
    medicationName: string
  ) {
    try {
      const [allergyConflicts, conditions] = await Promise.all([
        this.allergies.checkMedicationConflicts(studentId, medicationName),
        this.conditions.getActiveConditions(studentId)
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
  }

  /**
   * Get all items requiring follow-up
   */
  async getFollowUpItems(schoolId?: string) {
    try {
      const [
        healthRecords,
        screenings,
        conditions
      ] = await Promise.all([
        this.records.getFollowUpRequired(schoolId),
        this.screenings.getScreeningsRequiringFollowUp(schoolId),
        this.conditions.getConditionsForReview()
      ]);

      return {
        healthRecords: healthRecords.data,
        screenings: screenings.data,
        conditions: conditions.data,
        totalItems: healthRecords.total + screenings.total + conditions.total
      };
    } catch (error) {
      console.error('Failed to fetch follow-up items:', error);
      throw error;
    }
  }

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
        return await this.records.exportRecords({
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
}

// ==========================================
// SINGLETON INSTANCES
// ==========================================

export const unifiedHealthApi = new UnifiedHealthApi();

// ==========================================
// LEGACY COMPATIBILITY LAYER
// ==========================================

/**
 * Legacy HealthRecordsApi compatible interface
 * Maintains backward compatibility with existing code
 */
export class HealthRecordsApi {
  private unified = unifiedHealthApi;

  // Main health records operations
  getRecords = this.unified.records.getStudentRecords.bind(this.unified.records);
  getRecordById = this.unified.records.getById.bind(this.unified.records);
  createRecord = this.unified.records.create.bind(this.unified.records);
  updateRecord = this.unified.records.update.bind(this.unified.records);
  deleteRecord = this.unified.records.delete.bind(this.unified.records);
  getSummary = this.unified.records.getHealthSummary.bind(this.unified.records);
  searchRecords = this.unified.records.searchRecords.bind(this.unified.records);
  exportRecords = this.unified.records.exportRecords.bind(this.unified.records);
  importRecords = this.unified.records.importRecords.bind(this.unified.records);

  // Allergies operations
  getAllergies = this.unified.allergies.getStudentAllergies.bind(this.unified.allergies);
  getAllergyById = this.unified.allergies.getById.bind(this.unified.allergies);
  createAllergy = this.unified.allergies.create.bind(this.unified.allergies);
  updateAllergy = this.unified.allergies.update.bind(this.unified.allergies);
  deleteAllergy = this.unified.allergies.delete.bind(this.unified.allergies);
  getCriticalAllergies = this.unified.allergies.getCriticalAllergies.bind(this.unified.allergies);
  checkMedicationConflicts = this.unified.allergies.checkMedicationConflicts.bind(this.unified.allergies);

  // Chronic conditions operations
  getConditions = this.unified.conditions.getStudentConditions.bind(this.unified.conditions);
  getConditionById = this.unified.conditions.getById.bind(this.unified.conditions);
  createCondition = this.unified.conditions.create.bind(this.unified.conditions);
  updateCondition = this.unified.conditions.update.bind(this.unified.conditions);
  deleteCondition = this.unified.conditions.delete.bind(this.unified.conditions);
  updateCarePlan = this.unified.conditions.updateCarePlan.bind(this.unified.conditions);

  // Vaccinations operations
  getVaccinations = this.unified.vaccinations.getStudentVaccinations.bind(this.unified.vaccinations);
  getVaccinationById = this.unified.vaccinations.getById.bind(this.unified.vaccinations);
  createVaccination = this.unified.vaccinations.create.bind(this.unified.vaccinations);
  updateVaccination = this.unified.vaccinations.update.bind(this.unified.vaccinations);
  deleteVaccination = this.unified.vaccinations.delete.bind(this.unified.vaccinations);
  getComplianceReport = this.unified.vaccinations.getComplianceReport.bind(this.unified.vaccinations);
  checkStateCompliance = this.unified.vaccinations.checkStateCompliance.bind(this.unified.vaccinations);

  // Screenings operations
  getScreenings = this.unified.screenings.getStudentScreenings.bind(this.unified.screenings);
  getScreeningById = this.unified.screenings.getById.bind(this.unified.screenings);
  createScreening = this.unified.screenings.create.bind(this.unified.screenings);
  updateScreening = this.unified.screenings.update.bind(this.unified.screenings);
  deleteScreening = this.unified.screenings.delete.bind(this.unified.screenings);
  getLatestScreening = this.unified.screenings.getLatestScreening.bind(this.unified.screenings);

  // Growth measurements operations
  getGrowthMeasurements = this.unified.growth.getStudentMeasurements.bind(this.unified.growth);
  getGrowthMeasurementById = this.unified.growth.getById.bind(this.unified.growth);
  createGrowthMeasurement = this.unified.growth.create.bind(this.unified.growth);
  updateGrowthMeasurement = this.unified.growth.update.bind(this.unified.growth);
  deleteGrowthMeasurement = this.unified.growth.delete.bind(this.unified.growth);
  getGrowthTrend = this.unified.growth.getGrowthTrend.bind(this.unified.growth);
  getGrowthChart = this.unified.growth.getGrowthChart.bind(this.unified.growth);

  // Vital signs operations
  getVitalSigns = this.unified.vitals.getStudentVitalSigns.bind(this.unified.vitals);
  getVitalSignsById = this.unified.vitals.getById.bind(this.unified.vitals);
  createVitalSigns = this.unified.vitals.create.bind(this.unified.vitals);
  updateVitalSigns = this.unified.vitals.update.bind(this.unified.vitals);
  deleteVitalSigns = this.unified.vitals.delete.bind(this.unified.vitals);
  getLatestVitals = this.unified.vitals.getLatestVitalSigns.bind(this.unified.vitals);
  getVitalTrends = this.unified.vitals.getVitalTrends.bind(this.unified.vitals);

  // Legacy method aliases for backward compatibility
  getHealthRecordById = this.getRecordById;
  getHealthSummary = this.getSummary;
  searchHealthRecords = this.searchRecords;
  createHealthRecord = this.createRecord;
  updateHealthRecord = this.updateRecord;
  deleteHealthRecord = this.deleteRecord;
  getStudentAllergies = this.getAllergies;
  getStudentChronicConditions = this.getConditions;
  createChronicCondition = this.createCondition;
  updateChronicCondition = this.updateCondition;
  deleteChronicCondition = this.deleteCondition;
  getVaccinationRecords = this.getVaccinations;

  /**
   * Display deprecation warning for legacy usage
   */
  constructor() {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[DEPRECATION] HealthRecordsApi: This monolithic API is deprecated. ' +
        'Please migrate to the modular health services:\n' +
        '- allergiesApi\n' +
        '- chronicConditionsApi\n' +
        '- vaccinationsApi\n' +
        '- screeningsApi\n' +
        '- growthMeasurementsApi\n' +
        '- vitalSignsApi\n' +
        '- healthRecordsApi\n' +
        'Import from: @/services/modules/health'
      );
    }
  }
}

// Export legacy compatible instance
export const legacyHealthRecordsApi = new HealthRecordsApi();

// Default export for maximum compatibility
export default unifiedHealthApi;