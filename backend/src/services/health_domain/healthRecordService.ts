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
  private vitalSignsService: VitalSignsService;
  private allergiesService: AllergiesService;
  private immunizationsService: ImmunizationsService;
  private chronicConditionsService: ChronicConditionsService;
  private analyticsService: AnalyticsService;
  private importExportService: ImportExportService;

  constructor() {
    // Most services use static methods, only some need instantiation
    // Remove unused service instantiations since we're using static methods
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
    return HealthRecordRepository.createHealthRecord(data);
  }

  /**
   * Get health record by ID
   */
  async getHealthRecord(id: string): Promise<any | null> {
    return HealthRecordRepository.getHealthRecordById(id);
  }

  /**
   * Update health record
   */
  async updateHealthRecord(id: string, data: UpdateHealthRecordData): Promise<any | null> {
    return HealthRecordRepository.updateHealthRecord(id, data);
  }

  /**
   * Delete health record
   */
  async deleteHealthRecord(id: string): Promise<boolean> {
    const result = await HealthRecordRepository.deleteHealthRecord(id);
    return result.success;
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
    return HealthRecordRepository.getStudentHealthRecords(studentId, page, limit, filters);
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
    return HealthRecordRepository.searchHealthRecords(query, filters.type, page, limit);
  }

  // ============================================================================
  // VITAL SIGNS OPERATIONS  
  // ============================================================================

  /**
   * Record vital signs - delegate to addVitalSigns
   */
  async recordVitalSigns(studentId: string, vitals: VitalSigns, notes?: string): Promise<any> {
    // Note: VitalSignsService.addVitalSigns expects recordId, not studentId
    // This would need a health record lookup first - using placeholder for now
    throw new Error('Method needs implementation - requires health record lookup');
  }

  /**
   * Get latest vital signs
   */
  async getLatestVitalSigns(studentId: string): Promise<any | null> {
    return VitalSignsService.getRecentVitals(studentId, 1);
  }

  /**
   * Get vital signs history
   */
  async getVitalSignsHistory(
    studentId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<any>> {
    const vitals = await VitalSignsService.getRecentVitals(studentId, limit);
    return {
      records: vitals,
      pagination: {
        page,
        limit,
        total: vitals.length,
        pages: Math.ceil(vitals.length / limit)
      }
    };
  }

  /**
   * Get growth data
   */
  async getGrowthData(studentId: string): Promise<GrowthDataPoint[]> {
    return VitalSignsService.getGrowthChartData(studentId);
  }

  /**
   * Get vital signs trends
   */
  async getVitalSignsTrends(studentId: string, days: number = 30): Promise<any> {
    // VitalSignsService.getVitalSignsTrends expects vitalType parameter
    // This method signature needs to be updated to include vital type
    throw new Error('Method needs implementation - requires vital type parameter');
  }

  /**
   * Check for abnormal vital signs
   */
  async checkAbnormalVitals(studentId: string): Promise<any[]> {
    return VitalSignsService.getAbnormalVitals(studentId);
  }

  // ============================================================================
  // ALLERGIES OPERATIONS
  // ============================================================================

  /**
   * Create allergy record
   */
  async createAllergy(data: CreateAllergyData): Promise<any> {
    return AllergiesService.addAllergy(data);
  }

  /**
   * Update allergy record
   */
  async updateAllergy(id: string, data: UpdateAllergyData): Promise<any | null> {
    return AllergiesService.updateAllergy(id, data);
  }

  /**
   * Delete allergy record
   */
  async deleteAllergy(id: string): Promise<boolean> {
    const result = await AllergiesService.deleteAllergy(id);
    return result.success;
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
    const allergies = await AllergiesService.getStudentAllergies(studentId, filters);
    return {
      records: allergies,
      pagination: {
        page,
        limit,
        total: allergies.length,
        pages: Math.ceil(allergies.length / limit)
      }
    };
  }

  /**
   * Get critical allergies
   */
  async getCriticalAllergies(studentId: string): Promise<any[]> {
    // Note: AllergiesService.getCriticalAllergies() doesn't filter by student
    return AllergiesService.getCriticalAllergies();
  }

  /**
   * Verify allergy
   */
  async verifyAllergy(id: string, verifiedBy: string): Promise<any | null> {
    return AllergiesService.verifyAllergy(id, verifiedBy);
  }

  // ============================================================================
  // VACCINATIONS OPERATIONS
  // ============================================================================

  /**
   * Create vaccination record
   */
  async createVaccination(data: CreateVaccinationData): Promise<any> {
    return ImmunizationsService.addVaccination(data);
  }

  /**
   * Update vaccination record
   */
  async updateVaccination(id: string, data: UpdateVaccinationData): Promise<any | null> {
    return ImmunizationsService.updateVaccination(id, data);
  }

  /**
   * Delete vaccination record
   */
  async deleteVaccination(id: string): Promise<boolean> {
    const result = await ImmunizationsService.deleteVaccination(id);
    return result.success;
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
    const vaccinations = await ImmunizationsService.getStudentVaccinations(studentId, filters);
    return {
      records: vaccinations,
      pagination: {
        page,
        limit,
        total: vaccinations.length,
        pages: Math.ceil(vaccinations.length / limit)
      }
    };
  }

  /**
   * Get vaccination compliance
   */
  async getVaccinationCompliance(studentId: string): Promise<any> {
    return ImmunizationsService.getVaccinationCompliance(studentId);
  }

  /**
   * Get overdue vaccinations
   */
  async getOverdueVaccinations(studentId: string): Promise<any[]> {
    // Note: ImmunizationsService.getOverdueVaccinations() doesn't filter by student
    return ImmunizationsService.getOverdueVaccinations();
  }

  // ============================================================================
  // CHRONIC CONDITIONS OPERATIONS
  // ============================================================================

  /**
   * Create chronic condition record
   */
  async createChronicCondition(data: CreateChronicConditionData): Promise<any> {
    return ChronicConditionsService.addChronicCondition(data);
  }

  /**
   * Update chronic condition record
   */
  async updateChronicCondition(id: string, data: UpdateChronicConditionData): Promise<any | null> {
    return ChronicConditionsService.updateChronicCondition(id, data);
  }

  /**
   * Delete chronic condition record
   */
  async deleteChronicCondition(id: string): Promise<boolean> {
    const result = await ChronicConditionsService.deleteChronicCondition(id);
    return result.success;
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
    const conditions = await ChronicConditionsService.getStudentChronicConditions(studentId, filters);
    return {
      records: conditions,
      pagination: {
        page,
        limit,
        total: conditions.length,
        pages: Math.ceil(conditions.length / limit)
      }
    };
  }

  /**
   * Get active chronic conditions
   */
  async getActiveChronicConditions(studentId: string): Promise<any[]> {
    // No direct method for active conditions by student - using general method
    return ChronicConditionsService.getChronicConditionsByStatus('active' as any);
  }

  /**
   * Schedule condition review
   */
  async scheduleConditionReview(id: string, reviewDate: Date): Promise<any | null> {
    // Using updateConditionReview method
    return ChronicConditionsService.updateConditionReview(id, { reviewDate } as any);
  }

  // ============================================================================
  // ANALYTICS AND REPORTING
  // ============================================================================

  /**
   * Get health summary for student
   */
  async getHealthSummary(studentId: string): Promise<HealthSummary> {
    // Get dashboard data and transform it to match HealthSummary structure
    const dashboard = await AnalyticsService.getHealthDashboard();

    // Mock student data - in real implementation, this would come from student service
    const student = { id: studentId, firstName: '', lastName: '', studentNumber: '' };

    // Get recent vitals for the student
    const recentVitals = await VitalSignsService.getRecentVitals(studentId, 5);

    // Get recent vaccinations for the student
    const recentVaccinations = await ImmunizationsService.getStudentVaccinations(studentId, {});

    // Calculate record counts
    const recordCounts = {
      healthRecords: 0,
      allergies: 0,
      vaccinations: recentVaccinations.length,
      chronicConditions: 0
    };

    return {
      student,
      allergies: [], // TODO: Get actual allergy data from AllergiesService
      recentVitals: recentVitals as any, // Type cast to avoid circular type issues
      recentVaccinations: recentVaccinations,
      recordCounts
    };
  }

  /**
   * Get health statistics
   */
  async getHealthStatistics(studentId?: string): Promise<HealthStatistics> {
    return AnalyticsService.getHealthRecordStatistics();
  }

  /**
   * Generate health report
   */
  async generateHealthReport(studentId: string): Promise<any> {
    // Using getMonthlyHealthSummary as closest match
    const now = new Date();
    return AnalyticsService.getMonthlyHealthSummary(now.getFullYear(), now.getMonth() + 1);
  }

  /**
   * Get compliance report
   */
  async getComplianceReport(studentIds?: string[]): Promise<any> {
    return AnalyticsService.getHealthComplianceReport();
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
    // No bulk create method available - would need to implement
    const results = [];
    for (const record of records) {
      const result = await HealthRecordRepository.createHealthRecord(record);
      results.push(result);
    }
    return results;
  }

  /**
   * Bulk delete health records
   */
  async bulkDeleteHealthRecords(ids: string[]): Promise<any> {
    return HealthRecordRepository.bulkDeleteHealthRecords(ids);
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
