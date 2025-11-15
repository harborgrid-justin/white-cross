/**
 * MIGRATION STATUS: DEPRECATED - SCHEDULED FOR REMOVAL IN v2.0.0
 *
 * Health Records API - Main Integration
 *
 * DEPRECATION TIMELINE:
 * - Deprecated: v1.5.0 (Current)
 * - Removal: v2.0.0 (Planned Q2 2025)
 *
 * REPLACEMENT: @/lib/actions/health-records.*
 *
 * This unified API interface has been replaced by Next.js Server Actions.
 * All specialized modules (allergies, vaccinations, conditions, etc.) are now
 * available as individual Server Actions with improved type safety and security.
 *
 * @deprecated Use Server Actions from @/lib/actions/health-records.* instead. Will be removed in v2.0.0
 * @see {@link /lib/actions/health-records.actions.ts} - Main barrel export
 * @see {@link /lib/actions/health-records.crud.ts} - CRUD operations
 * @see {@link /lib/actions/health-records.allergies.ts} - Allergy management
 * @see {@link /lib/actions/health-records.immunizations.ts} - Immunization tracking
 * @see {@link ../../healthRecordsApi.ts} - Comprehensive migration guide
 * @module services/modules/healthRecords/api
 */

import type { ApiClient } from '../../../core/ApiClient';
import { apiClient } from '../../../core/ApiClient';
import { HealthRecordsApiClient } from './healthRecordsApi';
import { AllergiesApiClient } from './allergiesApi';
import { ChronicConditionsApiClient } from './chronicConditionsApi';
import { VaccinationsApiClient } from './vaccinationsApi';
import { ScreeningsApiClient } from './screeningsApi';
import { GrowthMeasurementsApiClient } from './growthMeasurementsApi';
import { VitalSignsApiClient } from './vitalSignsApi';

/**
 * Unified Health Records API Client
 *
 * Provides access to all health records operations through specialized modules:
 * - Main health records operations
 * - Allergies management
 * - Chronic conditions tracking
 * - Vaccinations and compliance
 * - Health screenings
 * - Growth measurements
 * - Vital signs monitoring
 */
export class HealthRecordsApi {
  private readonly healthRecordsClient: HealthRecordsApiClient;
  private readonly allergiesClient: AllergiesApiClient;
  private readonly conditionsClient: ChronicConditionsApiClient;
  private readonly vaccinationsClient: VaccinationsApiClient;
  private readonly screeningsClient: ScreeningsApiClient;
  private readonly growthClient: GrowthMeasurementsApiClient;
  private readonly vitalsClient: VitalSignsApiClient;

  constructor(client: ApiClient) {
    this.healthRecordsClient = new HealthRecordsApiClient(client);
    this.allergiesClient = new AllergiesApiClient(client);
    this.conditionsClient = new ChronicConditionsApiClient(client);
    this.vaccinationsClient = new VaccinationsApiClient(client);
    this.screeningsClient = new ScreeningsApiClient(client);
    this.growthClient = new GrowthMeasurementsApiClient(client);
    this.vitalsClient = new VitalSignsApiClient(client);
  }

  // ==========================================
  // MAIN HEALTH RECORDS OPERATIONS
  // ==========================================

  /**
   * Get all health records for a student
   */
  async getRecords(...args: Parameters<HealthRecordsApiClient['getRecords']>) {
    return this.healthRecordsClient.getRecords(...args);
  }

  /**
   * Get a single health record by ID
   */
  async getRecordById(...args: Parameters<HealthRecordsApiClient['getRecordById']>) {
    return this.healthRecordsClient.getRecordById(...args);
  }

  /**
   * Create a new health record
   */
  async createRecord(...args: Parameters<HealthRecordsApiClient['createRecord']>) {
    return this.healthRecordsClient.createRecord(...args);
  }

  /**
   * Update an existing health record
   */
  async updateRecord(...args: Parameters<HealthRecordsApiClient['updateRecord']>) {
    return this.healthRecordsClient.updateRecord(...args);
  }

  /**
   * Delete a health record
   */
  async deleteRecord(...args: Parameters<HealthRecordsApiClient['deleteRecord']>) {
    return this.healthRecordsClient.deleteRecord(...args);
  }

  /**
   * Get comprehensive health summary for a student
   */
  async getSummary(...args: Parameters<HealthRecordsApiClient['getSummary']>) {
    return this.healthRecordsClient.getSummary(...args);
  }

  /**
   * Search health records across all students
   */
  async searchRecords(...args: Parameters<HealthRecordsApiClient['searchRecords']>) {
    return this.healthRecordsClient.searchRecords(...args);
  }

  /**
   * Export health records for a student
   */
  async exportRecords(...args: Parameters<HealthRecordsApiClient['exportRecords']>) {
    return this.healthRecordsClient.exportRecords(...args);
  }

  /**
   * Bulk import health records
   */
  async bulkImportRecords(...args: Parameters<HealthRecordsApiClient['bulkImportRecords']>) {
    return this.healthRecordsClient.bulkImportRecords(...args);
  }

  // ==========================================
  // ALLERGIES OPERATIONS
  // ==========================================

  /**
   * Get all allergies for a student
   */
  async getAllergies(...args: Parameters<AllergiesApiClient['getAllergies']>) {
    return this.allergiesClient.getAllergies(...args);
  }

  /**
   * Get a single allergy by ID
   */
  async getAllergyById(...args: Parameters<AllergiesApiClient['getAllergyById']>) {
    return this.allergiesClient.getAllergyById(...args);
  }

  /**
   * Create a new allergy record
   */
  async createAllergy(...args: Parameters<AllergiesApiClient['createAllergy']>) {
    return this.allergiesClient.createAllergy(...args);
  }

  /**
   * Update an existing allergy
   */
  async updateAllergy(...args: Parameters<AllergiesApiClient['updateAllergy']>) {
    return this.allergiesClient.updateAllergy(...args);
  }

  /**
   * Delete an allergy
   */
  async deleteAllergy(...args: Parameters<AllergiesApiClient['deleteAllergy']>) {
    return this.allergiesClient.deleteAllergy(...args);
  }

  /**
   * Get critical/life-threatening allergies for a student
   */
  async getCriticalAllergies(...args: Parameters<AllergiesApiClient['getCriticalAllergies']>) {
    return this.allergiesClient.getCriticalAllergies(...args);
  }

  // ==========================================
  // CHRONIC CONDITIONS OPERATIONS
  // ==========================================

  /**
   * Get all chronic conditions for a student
   */
  async getConditions(...args: Parameters<ChronicConditionsApiClient['getConditions']>) {
    return this.conditionsClient.getConditions(...args);
  }

  /**
   * Get a single chronic condition by ID
   */
  async getConditionById(...args: Parameters<ChronicConditionsApiClient['getConditionById']>) {
    return this.conditionsClient.getConditionById(...args);
  }

  /**
   * Create a new chronic condition
   */
  async createCondition(...args: Parameters<ChronicConditionsApiClient['createCondition']>) {
    return this.conditionsClient.createCondition(...args);
  }

  /**
   * Update an existing chronic condition
   */
  async updateCondition(...args: Parameters<ChronicConditionsApiClient['updateCondition']>) {
    return this.conditionsClient.updateCondition(...args);
  }

  /**
   * Update care plan for a chronic condition
   */
  async updateCarePlan(...args: Parameters<ChronicConditionsApiClient['updateCarePlan']>) {
    return this.conditionsClient.updateCarePlan(...args);
  }

  /**
   * Delete a chronic condition
   */
  async deleteCondition(...args: Parameters<ChronicConditionsApiClient['deleteCondition']>) {
    return this.conditionsClient.deleteCondition(...args);
  }

  // ==========================================
  // VACCINATIONS OPERATIONS
  // ==========================================

  /**
   * Get all vaccinations for a student
   */
  async getVaccinations(...args: Parameters<VaccinationsApiClient['getVaccinations']>) {
    return this.vaccinationsClient.getVaccinations(...args);
  }

  /**
   * Get a single vaccination by ID
   */
  async getVaccinationById(...args: Parameters<VaccinationsApiClient['getVaccinationById']>) {
    return this.vaccinationsClient.getVaccinationById(...args);
  }

  /**
   * Create a new vaccination record
   */
  async createVaccination(...args: Parameters<VaccinationsApiClient['createVaccination']>) {
    return this.vaccinationsClient.createVaccination(...args);
  }

  /**
   * Update an existing vaccination
   */
  async updateVaccination(...args: Parameters<VaccinationsApiClient['updateVaccination']>) {
    return this.vaccinationsClient.updateVaccination(...args);
  }

  /**
   * Delete a vaccination record
   */
  async deleteVaccination(...args: Parameters<VaccinationsApiClient['deleteVaccination']>) {
    return this.vaccinationsClient.deleteVaccination(...args);
  }

  /**
   * Check vaccination compliance for a student
   */
  async checkCompliance(...args: Parameters<VaccinationsApiClient['checkCompliance']>) {
    return this.vaccinationsClient.checkCompliance(...args);
  }

  // ==========================================
  // SCREENINGS OPERATIONS
  // ==========================================

  /**
   * Get all screenings for a student
   */
  async getScreenings(...args: Parameters<ScreeningsApiClient['getScreenings']>) {
    return this.screeningsClient.getScreenings(...args);
  }

  /**
   * Get a single screening by ID
   */
  async getScreeningById(...args: Parameters<ScreeningsApiClient['getScreeningById']>) {
    return this.screeningsClient.getScreeningById(...args);
  }

  /**
   * Create a new screening
   */
  async createScreening(...args: Parameters<ScreeningsApiClient['createScreening']>) {
    return this.screeningsClient.createScreening(...args);
  }

  /**
   * Update an existing screening
   */
  async updateScreening(...args: Parameters<ScreeningsApiClient['updateScreening']>) {
    return this.screeningsClient.updateScreening(...args);
  }

  /**
   * Delete a screening
   */
  async deleteScreening(...args: Parameters<ScreeningsApiClient['deleteScreening']>) {
    return this.screeningsClient.deleteScreening(...args);
  }

  /**
   * Get screenings that are due for review
   */
  async getScreeningsDue(...args: Parameters<ScreeningsApiClient['getScreeningsDue']>) {
    return this.screeningsClient.getScreeningsDue(...args);
  }

  // ==========================================
  // GROWTH MEASUREMENTS OPERATIONS
  // ==========================================

  /**
   * Get all growth measurements for a student
   */
  async getGrowthMeasurements(...args: Parameters<GrowthMeasurementsApiClient['getGrowthMeasurements']>) {
    return this.growthClient.getGrowthMeasurements(...args);
  }

  /**
   * Get a single growth measurement by ID
   */
  async getGrowthMeasurementById(...args: Parameters<GrowthMeasurementsApiClient['getGrowthMeasurementById']>) {
    return this.growthClient.getGrowthMeasurementById(...args);
  }

  /**
   * Create a new growth measurement
   */
  async createGrowthMeasurement(...args: Parameters<GrowthMeasurementsApiClient['createGrowthMeasurement']>) {
    return this.growthClient.createGrowthMeasurement(...args);
  }

  /**
   * Update an existing growth measurement
   */
  async updateGrowthMeasurement(...args: Parameters<GrowthMeasurementsApiClient['updateGrowthMeasurement']>) {
    return this.growthClient.updateGrowthMeasurement(...args);
  }

  /**
   * Delete a growth measurement
   */
  async deleteGrowthMeasurement(...args: Parameters<GrowthMeasurementsApiClient['deleteGrowthMeasurement']>) {
    return this.growthClient.deleteGrowthMeasurement(...args);
  }

  /**
   * Get growth trends for a student
   */
  async getGrowthTrends(...args: Parameters<GrowthMeasurementsApiClient['getGrowthTrends']>) {
    return this.growthClient.getGrowthTrends(...args);
  }

  // ==========================================
  // VITAL SIGNS OPERATIONS
  // ==========================================

  /**
   * Get vital signs for a student
   */
  async getVitalSigns(...args: Parameters<VitalSignsApiClient['getVitalSigns']>) {
    return this.vitalsClient.getVitalSigns(...args);
  }

  /**
   * Get vital signs by ID
   */
  async getVitalSignsById(...args: Parameters<VitalSignsApiClient['getVitalSignsById']>) {
    return this.vitalsClient.getVitalSignsById(...args);
  }

  /**
   * Create new vital signs record
   */
  async createVitalSigns(...args: Parameters<VitalSignsApiClient['createVitalSigns']>) {
    return this.vitalsClient.createVitalSigns(...args);
  }

  /**
   * Update vital signs
   */
  async updateVitalSigns(...args: Parameters<VitalSignsApiClient['updateVitalSigns']>) {
    return this.vitalsClient.updateVitalSigns(...args);
  }

  /**
   * Delete vital signs
   */
  async deleteVitalSigns(...args: Parameters<VitalSignsApiClient['deleteVitalSigns']>) {
    return this.vitalsClient.deleteVitalSigns(...args);
  }

  /**
   * Get vital signs trends
   */
  async getVitalTrends(...args: Parameters<VitalSignsApiClient['getVitalTrends']>) {
    return this.vitalsClient.getVitalTrends(...args);
  }
}

/**
 * Factory function to create a new HealthRecordsApi instance
 *
 * @param client - The API client to use
 * @returns A new HealthRecordsApi instance
 */
export function createHealthRecordsApi(client: ApiClient): HealthRecordsApi {
  return new HealthRecordsApi(client);
}

/**
 * Singleton instance of HealthRecordsApi
 * Pre-configured with the default apiClient
 */
export const healthRecordsApi = createHealthRecordsApi(apiClient);

// Export specialized clients for advanced use cases
export {
  HealthRecordsApiClient,
  AllergiesApiClient,
  ChronicConditionsApiClient,
  VaccinationsApiClient,
  ScreeningsApiClient,
  GrowthMeasurementsApiClient,
  VitalSignsApiClient,
};
