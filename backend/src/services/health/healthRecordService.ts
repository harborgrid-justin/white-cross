/**
 * LOC: C781387CD6
 * WC-GEN-254 | healthRecordService.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - healthRecordRepository.ts (services/health/healthRecordRepository.ts)
 *   - vitalSignsService.ts (services/health/vitalSignsService.ts)
 *   - allergiesService.ts (services/health/allergiesService.ts)
 *   - immunizationsService.ts (services/health/immunizationsService.ts)
 *   - chronicConditionsService.ts (services/health/chronicConditionsService.ts)
 *   - ... and 2 more
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-GEN-254 | healthRecordService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ./types, ./healthRecordRepository, ./vitalSignsService | Dependencies: sequelize, ./types, ./healthRecordRepository
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: constants | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Transaction } from 'sequelize';
import {
  CreateHealthRecordData,
  UpdateHealthRecordData,
  CreateAllergyData,
  UpdateAllergyData,
  CreateVaccinationData,
  UpdateVaccinationData,
  CreateChronicConditionData,
  UpdateChronicConditionData,
  HealthRecordFilters,
  AllergyFilters,
  VaccinationFilters,
  ChronicConditionFilters,
  PaginatedResponse,
  HealthSummary,
  HealthStatistics,
  VitalSigns,
  GrowthDataPoint,
  HealthDataExport,
  HealthDataImport,
  DetailedImportResult,
  ExportOptions,
  ImportOptions,
  ExportData
} from './types';

// Import all specialized services
import { HealthRecordRepository } from './healthRecordRepository';
import { VitalSignsService } from './vitalSignsService';
import { AllergiesService } from './allergiesService';
import { ImmunizationsService } from './immunizationsService';
import { ChronicConditionsService } from './chronicConditionsService';
import { AnalyticsService } from './analyticsService';
import { ImportExportService } from './importExportService';

/**
 * Main orchestrator service that coordinates all health record operations
 * This service maintains the same public API as the original monolithic service
 * while delegating to specialized services internally
 */
class HealthRecordService {
  private healthRecordRepository: HealthRecordRepository;
  private vitalSignsService: VitalSignsService;
  private allergiesService: AllergiesService;
  private immunizationsService: ImmunizationsService;
  private chronicConditionsService: ChronicConditionsService;
  private analyticsService: AnalyticsService;
  private importExportService: ImportExportService;

  constructor() {
    this.healthRecordRepository = new HealthRecordRepository();
    this.vitalSignsService = new VitalSignsService();
    this.allergiesService = new AllergiesService();
    this.immunizationsService = new ImmunizationsService();
    this.chronicConditionsService = new ChronicConditionsService();
    this.analyticsService = new AnalyticsService();
    this.importExportService = new ImportExportService();
  }

  // ============================================================================
  // HEALTH RECORDS OPERATIONS
  // ============================================================================

  /**
   * Create a new health record
   */
  async createHealthRecord(data: CreateHealthRecordData): Promise<any> {
    return this.healthRecordRepository.create(data);
  }

  /**
   * Get health record by ID
   */
  async getHealthRecord(id: string): Promise<any | null> {
    return this.healthRecordRepository.findById(id);
  }

  /**
   * Update health record
   */
  async updateHealthRecord(id: string, data: UpdateHealthRecordData): Promise<any | null> {
    return this.healthRecordRepository.update(id, data);
  }

  /**
   * Delete health record
   */
  async deleteHealthRecord(id: string): Promise<boolean> {
    return this.healthRecordRepository.delete(id);
  }

  /**
   * Get paginated health records for a student
   */
  async getHealthRecords(
    studentId: string,
    filters: HealthRecordFilters = {},
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<any>> {
    return this.healthRecordRepository.findByStudent(studentId, filters, page, limit);
  }

  /**
   * Search health records
   */
  async searchHealthRecords(
    query: string,
    filters: HealthRecordFilters = {},
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<any>> {
    return this.healthRecordRepository.search(query, filters, page, limit);
  }

  // ============================================================================
  // VITAL SIGNS OPERATIONS
  // ============================================================================

  /**
   * Record vital signs
   */
  async recordVitalSigns(studentId: string, vitals: VitalSigns, notes?: string): Promise<any> {
    return this.vitalSignsService.recordVitalSigns(studentId, vitals, notes);
  }

  /**
   * Get latest vital signs
   */
  async getLatestVitalSigns(studentId: string): Promise<any | null> {
    return this.vitalSignsService.getLatestVitalSigns(studentId);
  }

  /**
   * Get vital signs history
   */
  async getVitalSignsHistory(
    studentId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<any>> {
    return this.vitalSignsService.getVitalSignsHistory(studentId, page, limit);
  }

  /**
   * Get growth data
   */
  async getGrowthData(studentId: string): Promise<GrowthDataPoint[]> {
    return this.vitalSignsService.getGrowthData(studentId);
  }

  /**
   * Get vital signs trends
   */
  async getVitalSignsTrends(studentId: string, days: number = 30): Promise<any> {
    return this.vitalSignsService.getVitalSignsTrends(studentId, days);
  }

  /**
   * Check for abnormal vital signs
   */
  async checkAbnormalVitals(studentId: string): Promise<any[]> {
    return this.vitalSignsService.checkAbnormalVitals(studentId);
  }

  // ============================================================================
  // ALLERGIES OPERATIONS
  // ============================================================================

  /**
   * Create allergy record
   */
  async createAllergy(data: CreateAllergyData): Promise<any> {
    return this.allergiesService.createAllergy(data);
  }

  /**
   * Update allergy record
   */
  async updateAllergy(id: string, data: UpdateAllergyData): Promise<any | null> {
    return this.allergiesService.updateAllergy(id, data);
  }

  /**
   * Delete allergy record
   */
  async deleteAllergy(id: string): Promise<boolean> {
    return this.allergiesService.deleteAllergy(id);
  }

  /**
   * Get student allergies
   */
  async getStudentAllergies(
    studentId: string,
    filters: AllergyFilters = {},
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<any>> {
    return this.allergiesService.getStudentAllergies(studentId, filters, page, limit);
  }

  /**
   * Get critical allergies
   */
  async getCriticalAllergies(studentId: string): Promise<any[]> {
    return this.allergiesService.getCriticalAllergies(studentId);
  }

  /**
   * Verify allergy
   */
  async verifyAllergy(id: string, verifiedBy: string): Promise<any | null> {
    return this.allergiesService.verifyAllergy(id, verifiedBy);
  }

  // ============================================================================
  // VACCINATIONS OPERATIONS
  // ============================================================================

  /**
   * Create vaccination record
   */
  async createVaccination(data: CreateVaccinationData): Promise<any> {
    return this.immunizationsService.createVaccination(data);
  }

  /**
   * Update vaccination record
   */
  async updateVaccination(id: string, data: UpdateVaccinationData): Promise<any | null> {
    return this.immunizationsService.updateVaccination(id, data);
  }

  /**
   * Delete vaccination record
   */
  async deleteVaccination(id: string): Promise<boolean> {
    return this.immunizationsService.deleteVaccination(id);
  }

  /**
   * Get student vaccinations
   */
  async getStudentVaccinations(
    studentId: string,
    filters: VaccinationFilters = {},
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<any>> {
    return this.immunizationsService.getStudentVaccinations(studentId, filters, page, limit);
  }

  /**
   * Get vaccination compliance
   */
  async getVaccinationCompliance(studentId: string): Promise<any> {
    return this.immunizationsService.getVaccinationCompliance(studentId);
  }

  /**
   * Get overdue vaccinations
   */
  async getOverdueVaccinations(studentId: string): Promise<any[]> {
    return this.immunizationsService.getOverdueVaccinations(studentId);
  }

  // ============================================================================
  // CHRONIC CONDITIONS OPERATIONS
  // ============================================================================

  /**
   * Create chronic condition record
   */
  async createChronicCondition(data: CreateChronicConditionData): Promise<any> {
    return this.chronicConditionsService.createChronicCondition(data);
  }

  /**
   * Update chronic condition record
   */
  async updateChronicCondition(id: string, data: UpdateChronicConditionData): Promise<any | null> {
    return this.chronicConditionsService.updateChronicCondition(id, data);
  }

  /**
   * Delete chronic condition record
   */
  async deleteChronicCondition(id: string): Promise<boolean> {
    return this.chronicConditionsService.deleteChronicCondition(id);
  }

  /**
   * Get student chronic conditions
   */
  async getStudentChronicConditions(
    studentId: string,
    filters: ChronicConditionFilters = {},
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<any>> {
    return this.chronicConditionsService.getStudentChronicConditions(studentId, filters, page, limit);
  }

  /**
   * Get active chronic conditions
   */
  async getActiveChronicConditions(studentId: string): Promise<any[]> {
    return this.chronicConditionsService.getActiveChronicConditions(studentId);
  }

  /**
   * Schedule condition review
   */
  async scheduleConditionReview(id: string, reviewDate: Date): Promise<any | null> {
    return this.chronicConditionsService.scheduleConditionReview(id, reviewDate);
  }

  // ============================================================================
  // ANALYTICS AND REPORTING
  // ============================================================================

  /**
   * Get health summary for student
   */
  async getHealthSummary(studentId: string): Promise<HealthSummary> {
    return this.analyticsService.getHealthSummary(studentId);
  }

  /**
   * Get health statistics
   */
  async getHealthStatistics(studentId?: string): Promise<HealthStatistics> {
    return this.analyticsService.getHealthStatistics(studentId);
  }

  /**
   * Generate health report
   */
  async generateHealthReport(studentId: string): Promise<any> {
    return this.analyticsService.generateHealthReport(studentId);
  }

  /**
   * Get compliance report
   */
  async getComplianceReport(studentIds?: string[]): Promise<any> {
    return this.analyticsService.getComplianceReport(studentIds);
  }

  // ============================================================================
  // IMPORT/EXPORT OPERATIONS
  // ============================================================================

  /**
   * Export student health data
   */
  async exportStudentData(studentId: string, options: ExportOptions = {}): Promise<HealthDataExport> {
    return this.importExportService.exportPatientData(studentId, options);
  }

  /**
   * Export data in specific format
   */
  async exportToFormat(
    studentId: string,
    format: 'json' | 'csv' | 'pdf' | 'hl7',
    options: ExportOptions = {}
  ): Promise<string | Buffer> {
    return this.importExportService.exportToFormat(studentId, format, options);
  }

  /**
   * Import student health data
   */
  async importStudentData(
    importData: HealthDataImport,
    options: ImportOptions = {}
  ): Promise<DetailedImportResult> {
    return this.importExportService.importPatientData(importData, options);
  }

  /**
   * Bulk export for multiple students
   */
  async bulkExport(
    studentIds: string[],
    options: ExportOptions = {}
  ): Promise<{ [studentId: string]: HealthDataExport }> {
    return this.importExportService.bulkExport(studentIds, options);
  }

  // ============================================================================
  // BULK OPERATIONS
  // ============================================================================

  /**
   * Bulk create health records
   */
  async bulkCreateHealthRecords(records: CreateHealthRecordData[]): Promise<any[]> {
    return this.healthRecordRepository.bulkCreate(records);
  }

  /**
   * Bulk delete health records
   */
  async bulkDeleteHealthRecords(ids: string[]): Promise<any> {
    return this.healthRecordRepository.bulkDelete(ids);
  }

  // ============================================================================
  // LEGACY COMPATIBILITY METHODS
  // ============================================================================

  /**
   * Legacy method for backward compatibility
   * @deprecated Use specific service methods instead
   */
  async getStudentHealthData(studentId: string): Promise<ExportData> {
    const healthRecords = await this.getHealthRecords(studentId);
    const allergies = await this.getStudentAllergies(studentId);
    const vaccinations = await this.getStudentVaccinations(studentId);
    const chronicConditions = await this.getStudentChronicConditions(studentId);
    const growthData = await this.getGrowthData(studentId);

    // Mock student data - in real implementation, this would come from student service
    const student = { id: studentId, firstName: '', lastName: '', studentNumber: '' };

    return {
      exportDate: new Date().toISOString(),
      student,
      healthRecords: healthRecords.records || [],
      allergies: allergies.records || [],
      chronicConditions: chronicConditions.records || [],
      vaccinations: vaccinations.records || [],
      growthData
    };
  }

  /**
   * Legacy search method
   * @deprecated Use searchHealthRecords instead
   */
  async searchRecords(query: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<any>> {
    return this.searchHealthRecords(query, {}, page, limit);
  }
}

// Export singleton instance
export const healthRecordService = new HealthRecordService();
export { HealthRecordService };
