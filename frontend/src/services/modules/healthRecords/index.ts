/**
 * Health Records API Module
 * 
 * Consolidated health records management system with complete functionality:
 * - Main health records CRUD operations
 * - Allergies management with safety features
 * - Chronic conditions and care plans
 * - Vaccinations and compliance tracking
 * - Health screenings management
 * - Growth measurements and trends
 * - Vital signs tracking and analysis
 * - Bulk import/export capabilities
 * - HIPAA-compliant PHI access logging
 *
 * @module services/modules/healthRecords
 */

import type { ApiClient } from '../../core/ApiClient';
import { apiClient } from '../../core/ApiClient';
import { MainHealthRecordsApi } from './mainApi';
import { AllergiesApi } from './allergiesApi';
import { ConditionsVaccinationsApi } from './conditionsVaccinationsApi';
import { ScreeningsGrowthVitalsApi } from './screeningsGrowthVitalsApi';

// Re-export all types for convenience
export * from './types';
export * from './schemas';

/**
 * Consolidated Health Records API Class
 * 
 * Provides unified access to all health record operations through
 * a single interface while maintaining modular architecture.
 */
export class HealthRecordsApi {
  private readonly mainApi: MainHealthRecordsApi;
  private readonly allergiesApi: AllergiesApi;
  private readonly conditionsVaccinationsApi: ConditionsVaccinationsApi;
  private readonly screeningsGrowthVitalsApi: ScreeningsGrowthVitalsApi;

  constructor(private readonly client: ApiClient) {
    this.mainApi = new MainHealthRecordsApi(client);
    this.allergiesApi = new AllergiesApi(client);
    this.conditionsVaccinationsApi = new ConditionsVaccinationsApi(client);
    this.screeningsGrowthVitalsApi = new ScreeningsGrowthVitalsApi(client);
  }

  // ==========================================
  // MAIN HEALTH RECORDS OPERATIONS
  // ==========================================

  /**
   * Get all health records for a student with optional filtering
   */
  getRecords(...args: Parameters<MainHealthRecordsApi['getRecords']>) {
    return this.mainApi.getRecords(...args);
  }

  /**
   * Get a single health record by ID
   */
  getRecordById(...args: Parameters<MainHealthRecordsApi['getRecordById']>) {
    return this.mainApi.getRecordById(...args);
  }

  /**
   * Create a new health record
   */
  createRecord(...args: Parameters<MainHealthRecordsApi['createRecord']>) {
    return this.mainApi.createRecord(...args);
  }

  /**
   * Update an existing health record
   */
  updateRecord(...args: Parameters<MainHealthRecordsApi['updateRecord']>) {
    return this.mainApi.updateRecord(...args);
  }

  /**
   * Delete a health record (soft delete)
   */
  deleteRecord(...args: Parameters<MainHealthRecordsApi['deleteRecord']>) {
    return this.mainApi.deleteRecord(...args);
  }

  /**
   * Get comprehensive health summary for a student
   */
  getSummary(...args: Parameters<MainHealthRecordsApi['getSummary']>) {
    return this.mainApi.getSummary(...args);
  }

  /**
   * Search health records across all students (admin only)
   */
  searchRecords(...args: Parameters<MainHealthRecordsApi['searchRecords']>) {
    return this.mainApi.searchRecords(...args);
  }

  /**
   * Export health records for a student
   */
  exportRecords(...args: Parameters<MainHealthRecordsApi['exportRecords']>) {
    return this.mainApi.exportRecords(...args);
  }

  /**
   * Bulk import health records with comprehensive validation
   */
  bulkImportRecords(...args: Parameters<MainHealthRecordsApi['bulkImportRecords']>) {
    return this.mainApi.bulkImportRecords(...args);
  }

  // ==========================================
  // ALLERGIES OPERATIONS
  // ==========================================

  /**
   * Get all allergies for a student
   */
  getAllergies(...args: Parameters<AllergiesApi['getAllergies']>) {
    return this.allergiesApi.getAllergies(...args);
  }

  /**
   * Get a single allergy by ID
   */
  getAllergyById(...args: Parameters<AllergiesApi['getAllergyById']>) {
    return this.allergiesApi.getAllergyById(...args);
  }

  /**
   * Create a new allergy record
   */
  createAllergy(...args: Parameters<AllergiesApi['createAllergy']>) {
    return this.allergiesApi.createAllergy(...args);
  }

  /**
   * Update an existing allergy
   */
  updateAllergy(...args: Parameters<AllergiesApi['updateAllergy']>) {
    return this.allergiesApi.updateAllergy(...args);
  }

  /**
   * Delete an allergy
   */
  deleteAllergy(...args: Parameters<AllergiesApi['deleteAllergy']>) {
    return this.allergiesApi.deleteAllergy(...args);
  }

  /**
   * Get critical/life-threatening allergies for a student
   */
  getCriticalAllergies(...args: Parameters<AllergiesApi['getCriticalAllergies']>) {
    return this.allergiesApi.getCriticalAllergies(...args);
  }

  /**
   * Verify an allergy (mark as medically verified)
   */
  verifyAllergy(...args: Parameters<AllergiesApi['verifyAllergy']>) {
    return this.allergiesApi.verifyAllergy(...args);
  }

  /**
   * Mark an allergy as critical
   */
  markAllergyAsCritical(...args: Parameters<AllergiesApi['markCritical']>) {
    return this.allergiesApi.markCritical(...args);
  }

  /**
   * Get allergy statistics for a student
   */
  getAllergyStats(...args: Parameters<AllergiesApi['getAllergyStats']>) {
    return this.allergiesApi.getAllergyStats(...args);
  }

  // ==========================================
  // CHRONIC CONDITIONS OPERATIONS
  // ==========================================

  /**
   * Get all chronic conditions for a student
   */
  getConditions(...args: Parameters<ConditionsVaccinationsApi['getConditions']>) {
    return this.conditionsVaccinationsApi.getConditions(...args);
  }

  /**
   * Get a single chronic condition by ID
   */
  getConditionById(...args: Parameters<ConditionsVaccinationsApi['getConditionById']>) {
    return this.conditionsVaccinationsApi.getConditionById(...args);
  }

  /**
   * Create a new chronic condition
   */
  createCondition(...args: Parameters<ConditionsVaccinationsApi['createCondition']>) {
    return this.conditionsVaccinationsApi.createCondition(...args);
  }

  /**
   * Update an existing chronic condition
   */
  updateCondition(...args: Parameters<ConditionsVaccinationsApi['updateCondition']>) {
    return this.conditionsVaccinationsApi.updateCondition(...args);
  }

  /**
   * Update care plan for a chronic condition
   */
  updateCarePlan(...args: Parameters<ConditionsVaccinationsApi['updateCarePlan']>) {
    return this.conditionsVaccinationsApi.updateCarePlan(...args);
  }

  /**
   * Delete a chronic condition
   */
  deleteCondition(...args: Parameters<ConditionsVaccinationsApi['deleteCondition']>) {
    return this.conditionsVaccinationsApi.deleteCondition(...args);
  }

  // ==========================================
  // VACCINATIONS OPERATIONS
  // ==========================================

  /**
   * Get all vaccinations for a student
   */
  getVaccinations(...args: Parameters<ConditionsVaccinationsApi['getVaccinations']>) {
    return this.conditionsVaccinationsApi.getVaccinations(...args);
  }

  /**
   * Get a single vaccination by ID
   */
  getVaccinationById(...args: Parameters<ConditionsVaccinationsApi['getVaccinationById']>) {
    return this.conditionsVaccinationsApi.getVaccinationById(...args);
  }

  /**
   * Create a new vaccination record
   */
  createVaccination(...args: Parameters<ConditionsVaccinationsApi['createVaccination']>) {
    return this.conditionsVaccinationsApi.createVaccination(...args);
  }

  /**
   * Update an existing vaccination
   */
  updateVaccination(...args: Parameters<ConditionsVaccinationsApi['updateVaccination']>) {
    return this.conditionsVaccinationsApi.updateVaccination(...args);
  }

  /**
   * Delete a vaccination record
   */
  deleteVaccination(...args: Parameters<ConditionsVaccinationsApi['deleteVaccination']>) {
    return this.conditionsVaccinationsApi.deleteVaccination(...args);
  }

  /**
   * Check vaccination compliance for a student
   */
  checkVaccinationCompliance(...args: Parameters<ConditionsVaccinationsApi['checkCompliance']>) {
    return this.conditionsVaccinationsApi.checkCompliance(...args);
  }

  // ==========================================
  // SCREENINGS OPERATIONS
  // ==========================================

  /**
   * Get all screenings for a student
   */
  getScreenings(...args: Parameters<ScreeningsGrowthVitalsApi['getScreenings']>) {
    return this.screeningsGrowthVitalsApi.getScreenings(...args);
  }

  /**
   * Get a single screening by ID
   */
  getScreeningById(...args: Parameters<ScreeningsGrowthVitalsApi['getScreeningById']>) {
    return this.screeningsGrowthVitalsApi.getScreeningById(...args);
  }

  /**
   * Create a new screening
   */
  createScreening(...args: Parameters<ScreeningsGrowthVitalsApi['createScreening']>) {
    return this.screeningsGrowthVitalsApi.createScreening(...args);
  }

  /**
   * Update an existing screening
   */
  updateScreening(...args: Parameters<ScreeningsGrowthVitalsApi['updateScreening']>) {
    return this.screeningsGrowthVitalsApi.updateScreening(...args);
  }

  /**
   * Delete a screening
   */
  deleteScreening(...args: Parameters<ScreeningsGrowthVitalsApi['deleteScreening']>) {
    return this.screeningsGrowthVitalsApi.deleteScreening(...args);
  }

  /**
   * Get screenings that are due for review
   */
  getScreeningsDue(...args: Parameters<ScreeningsGrowthVitalsApi['getScreeningsDue']>) {
    return this.screeningsGrowthVitalsApi.getScreeningsDue(...args);
  }

  // ==========================================
  // GROWTH MEASUREMENTS OPERATIONS
  // ==========================================

  /**
   * Get all growth measurements for a student
   */
  getGrowthMeasurements(...args: Parameters<ScreeningsGrowthVitalsApi['getGrowthMeasurements']>) {
    return this.screeningsGrowthVitalsApi.getGrowthMeasurements(...args);
  }

  /**
   * Get a single growth measurement by ID
   */
  getGrowthMeasurementById(...args: Parameters<ScreeningsGrowthVitalsApi['getGrowthMeasurementById']>) {
    return this.screeningsGrowthVitalsApi.getGrowthMeasurementById(...args);
  }

  /**
   * Create a new growth measurement
   */
  createGrowthMeasurement(...args: Parameters<ScreeningsGrowthVitalsApi['createGrowthMeasurement']>) {
    return this.screeningsGrowthVitalsApi.createGrowthMeasurement(...args);
  }

  /**
   * Update an existing growth measurement
   */
  updateGrowthMeasurement(...args: Parameters<ScreeningsGrowthVitalsApi['updateGrowthMeasurement']>) {
    return this.screeningsGrowthVitalsApi.updateGrowthMeasurement(...args);
  }

  /**
   * Delete a growth measurement
   */
  deleteGrowthMeasurement(...args: Parameters<ScreeningsGrowthVitalsApi['deleteGrowthMeasurement']>) {
    return this.screeningsGrowthVitalsApi.deleteGrowthMeasurement(...args);
  }

  /**
   * Get growth trends for a student
   */
  getGrowthTrends(...args: Parameters<ScreeningsGrowthVitalsApi['getGrowthTrends']>) {
    return this.screeningsGrowthVitalsApi.getGrowthTrends(...args);
  }

  // ==========================================
  // VITAL SIGNS OPERATIONS
  // ==========================================

  /**
   * Get vital signs for a student with optional filtering
   */
  getVitalSigns(...args: Parameters<ScreeningsGrowthVitalsApi['getVitalSigns']>) {
    return this.screeningsGrowthVitalsApi.getVitalSigns(...args);
  }

  /**
   * Get vital signs by ID
   */
  getVitalSignsById(...args: Parameters<ScreeningsGrowthVitalsApi['getVitalSignsById']>) {
    return this.screeningsGrowthVitalsApi.getVitalSignsById(...args);
  }

  /**
   * Create new vital signs record
   */
  createVitalSigns(...args: Parameters<ScreeningsGrowthVitalsApi['createVitalSigns']>) {
    return this.screeningsGrowthVitalsApi.createVitalSigns(...args);
  }

  /**
   * Update vital signs
   */
  updateVitalSigns(...args: Parameters<ScreeningsGrowthVitalsApi['updateVitalSigns']>) {
    return this.screeningsGrowthVitalsApi.updateVitalSigns(...args);
  }

  /**
   * Delete vital signs
   */
  deleteVitalSigns(...args: Parameters<ScreeningsGrowthVitalsApi['deleteVitalSigns']>) {
    return this.screeningsGrowthVitalsApi.deleteVitalSigns(...args);
  }

  /**
   * Get vital signs trends
   */
  getVitalTrends(...args: Parameters<ScreeningsGrowthVitalsApi['getVitalTrends']>) {
    return this.screeningsGrowthVitalsApi.getVitalTrends(...args);
  }
}

/**
 * Factory function to create a HealthRecordsApi instance
 */
export function createHealthRecordsApi(client: ApiClient): HealthRecordsApi {
  return new HealthRecordsApi(client);
}

/**
 * Singleton instance of HealthRecordsApi
 * Pre-configured with the default apiClient
 */
export const healthRecordsApi = createHealthRecordsApi(apiClient);

// Export individual API classes for advanced usage
export { MainHealthRecordsApi } from './mainApi';
export { AllergiesApi } from './allergiesApi';
export { ConditionsVaccinationsApi } from './conditionsVaccinationsApi';
export { ScreeningsGrowthVitalsApi } from './screeningsGrowthVitalsApi';

// Backward compatibility aliases
export default healthRecordsApi;
