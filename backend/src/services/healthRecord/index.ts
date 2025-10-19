/**
 * LOC: 377BCE712E
 * WC-SVC-HLT-014 | index.ts - Health Record Service Main Entry Point
 *
 * UPSTREAM (imports from):
 *   - All healthRecord modules (*.module.ts)
 *   - types.ts (./types.ts)
 *
 * DOWNSTREAM (imported by):
 *   - allergies.ts (routes/healthRecords/handlers/allergies.ts)
 *   - chronicConditions.ts (routes/healthRecords/handlers/chronicConditions.ts)
 *   - growthMeasurements.ts (routes/healthRecords/handlers/growthMeasurements.ts)
 *   - mainHealthRecords.ts (routes/healthRecords/handlers/mainHealthRecords.ts)
 *   - screenings.ts (routes/healthRecords/handlers/screenings.ts)
 *   - ... and 3 more
 *
 * Purpose: Unified service interface for health record operations
 * Architecture: Facade pattern - delegates to specialized modules
 * Exports: HealthRecordService class, all types and interfaces
 * HIPAA: Contains PHI operations - maintains all security and audit requirements
 * Last Updated: 2025-10-18 | File Type: .ts
 * Critical Path: Request → Service method → Module delegation → Response
 * LLM Context: Main entry point for health record services, delegates to focused modules
 */

// Export all types for external use
export * from './types';

// Import all modules
import { HealthRecordModule } from './healthRecord.module';
import { AllergyModule } from './allergy.module';
import { ChronicConditionModule } from './chronicCondition.module';
import { VaccinationModule } from './vaccination.module';
import { VitalsModule } from './vitals.module';
import { SearchModule } from './search.module';
import { ImportExportModule } from './import-export.module';
import { StatisticsModule } from './statistics.module';

import {
  CreateHealthRecordData,
  CreateAllergyData,
  CreateChronicConditionData,
  CreateVaccinationData,
  HealthRecordFilters,
  PaginatedHealthRecords,
  ImportResults,
  BulkDeleteResults,
  HealthRecordStatistics
} from './types';

/**
 * Health Record Service
 * Unified facade for all health record operations
 * Delegates to specialized modules while maintaining backward compatibility
 */
export class HealthRecordService {
  // ==================== Health Record Operations ====================

  /**
   * Get health records for a student with pagination and filters
   */
  static async getStudentHealthRecords(
    studentId: string,
    page: number = 1,
    limit: number = 20,
    filters: HealthRecordFilters = {}
  ): Promise<PaginatedHealthRecords<any>> {
    return HealthRecordModule.getStudentHealthRecords(studentId, page, limit, filters);
  }

  /**
   * Create new health record with comprehensive validation
   */
  static async createHealthRecord(data: CreateHealthRecordData): Promise<any> {
    return HealthRecordModule.createHealthRecord(data);
  }

  /**
   * Update health record with validation
   */
  static async updateHealthRecord(
    id: string,
    data: Partial<CreateHealthRecordData>
  ): Promise<any> {
    return HealthRecordModule.updateHealthRecord(id, data);
  }

  /**
   * Get vaccination records for a student
   */
  static async getVaccinationRecords(studentId: string): Promise<any[]> {
    return HealthRecordModule.getVaccinationRecords(studentId);
  }

  /**
   * Bulk delete health records
   */
  static async bulkDeleteHealthRecords(recordIds: string[]): Promise<BulkDeleteResults> {
    return HealthRecordModule.bulkDeleteHealthRecords(recordIds);
  }

  // ==================== Allergy Operations ====================

  /**
   * Add allergy to student with validation
   */
  static async addAllergy(data: CreateAllergyData): Promise<any> {
    return AllergyModule.addAllergy(data);
  }

  /**
   * Update allergy information
   */
  static async updateAllergy(id: string, data: Partial<CreateAllergyData>): Promise<any> {
    return AllergyModule.updateAllergy(id, data);
  }

  /**
   * Get student allergies
   */
  static async getStudentAllergies(studentId: string): Promise<any[]> {
    return AllergyModule.getStudentAllergies(studentId);
  }

  /**
   * Delete allergy
   */
  static async deleteAllergy(id: string): Promise<{ success: boolean }> {
    return AllergyModule.deleteAllergy(id);
  }

  // ==================== Chronic Condition Operations ====================

  /**
   * Add chronic condition to student with validation
   */
  static async addChronicCondition(data: CreateChronicConditionData): Promise<any> {
    return ChronicConditionModule.addChronicCondition(data);
  }

  /**
   * Get student chronic conditions
   */
  static async getStudentChronicConditions(studentId: string): Promise<any[]> {
    return ChronicConditionModule.getStudentChronicConditions(studentId);
  }

  /**
   * Update chronic condition
   */
  static async updateChronicCondition(
    id: string,
    data: Partial<CreateChronicConditionData>
  ): Promise<any> {
    return ChronicConditionModule.updateChronicCondition(id, data);
  }

  /**
   * Delete chronic condition
   */
  static async deleteChronicCondition(id: string): Promise<{ success: boolean }> {
    return ChronicConditionModule.deleteChronicCondition(id);
  }

  // ==================== Vaccination Operations ====================

  /**
   * Add vaccination record with comprehensive validation
   */
  static async addVaccination(data: CreateVaccinationData): Promise<any> {
    return VaccinationModule.addVaccination(data);
  }

  /**
   * Get student vaccinations
   */
  static async getStudentVaccinations(studentId: string): Promise<any[]> {
    return VaccinationModule.getStudentVaccinations(studentId);
  }

  /**
   * Update vaccination record
   */
  static async updateVaccination(
    id: string,
    data: Partial<CreateVaccinationData>
  ): Promise<any> {
    return VaccinationModule.updateVaccination(id, data);
  }

  /**
   * Delete vaccination record
   */
  static async deleteVaccination(id: string): Promise<{ success: boolean }> {
    return VaccinationModule.deleteVaccination(id);
  }

  // ==================== Vitals and Growth Tracking Operations ====================

  /**
   * Get growth chart data for a student
   */
  static async getGrowthChartData(studentId: string): Promise<any[]> {
    return VitalsModule.getGrowthChartData(studentId);
  }

  /**
   * Get recent vital signs for a student
   */
  static async getRecentVitals(studentId: string, limit: number = 10): Promise<any[]> {
    return VitalsModule.getRecentVitals(studentId, limit);
  }

  /**
   * Get health summary for a student
   */
  static async getHealthSummary(studentId: string): Promise<any> {
    return VitalsModule.getHealthSummary(studentId);
  }

  // ==================== Search and Filtering Operations ====================

  /**
   * Search health records across all students
   */
  static async searchHealthRecords(
    query: string,
    type?:
      | 'CHECKUP'
      | 'VACCINATION'
      | 'ILLNESS'
      | 'INJURY'
      | 'SCREENING'
      | 'PHYSICAL_EXAM'
      | 'MENTAL_HEALTH'
      | 'DENTAL'
      | 'VISION'
      | 'HEARING',
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedHealthRecords<any>> {
    return SearchModule.searchHealthRecords(query, type, page, limit);
  }

  // ==================== Import/Export Operations ====================

  /**
   * Export health history for a student (JSON format)
   */
  static async exportHealthHistory(studentId: string): Promise<any> {
    return ImportExportModule.exportHealthHistory(studentId);
  }

  /**
   * Import health records from JSON (basic import functionality)
   */
  static async importHealthRecords(
    studentId: string,
    importData: any
  ): Promise<ImportResults> {
    return ImportExportModule.importHealthRecords(studentId, importData);
  }

  // ==================== Statistics and Analytics Operations ====================

  /**
   * Get health records statistics
   */
  static async getHealthRecordStatistics(): Promise<HealthRecordStatistics> {
    return StatisticsModule.getHealthRecordStatistics();
  }
}
