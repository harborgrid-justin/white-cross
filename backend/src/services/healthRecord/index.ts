/**
 * @fileoverview Health Record Service - Unified HIPAA-Compliant Health Management Interface
 * @module services/healthRecord
 * @description Facade service providing unified access to all health record operations
 *
 * Architecture:
 * - Facade Pattern: Single entry point for all health record operations
 * - Module Delegation: Routes requests to specialized submodules
 * - Type Safety: Comprehensive TypeScript interfaces exported
 * - Backward Compatibility: Maintains stable API while modules evolve
 *
 * Service Capabilities:
 * - Health Record Management (CRUD operations)
 * - Allergy Tracking (life-threatening severity monitoring)
 * - Vaccination Records (CVX code validation, CDC compliance)
 * - Chronic Condition Management (ICD-10 codes, care plans)
 * - Vital Signs Tracking (CDC growth charts, BMI calculation)
 * - Search and Filtering (cross-student queries, advanced filters)
 * - Import/Export (JSON format, bulk operations)
 * - Statistics and Analytics (aggregated reporting)
 *
 * @compliance HIPAA Privacy Rule §164.308 - Administrative Safeguards
 * @compliance HIPAA Security Rule §164.312 - Technical Safeguards
 * @compliance FERPA §99.3 - Education records with health information
 * @compliance CDC Guidelines - Immunization and growth tracking
 * @compliance ICD-10-CM - Diagnosis coding standards
 * @security PHI - All operations tracked in audit log
 * @security Access Control - Role-based permissions required
 * @security Data Encryption - PHI encrypted at rest and in transit
 * @audit Minimum 6-year retention for HIPAA compliance
 * @audit All PHI access logged with user and timestamp
 *
 * Emergency Access:
 * - Break-glass mechanism for emergency PHI access
 * - Automatic audit log entry for emergency access
 * - Follow-up review required for all break-glass events
 *
 * Parent/Guardian Consent:
 * - Parental consent required for minors under state law
 * - Consent status tracked in student records
 * - Age of majority varies by state (typically 18)
 *
 * @requires All healthRecord submodules
 * @requires ./types
 *
 * LOC: 377BCE712E
 * WC-SVC-HLT-014 | index.ts
 * Last Updated: 2025-10-18 | File Type: .ts
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
 * @class HealthRecordService
 * @description Unified facade for all HIPAA-compliant health record operations
 * @architecture Facade pattern - delegates to specialized modules
 * @security All methods require authentication and appropriate permissions
 * @audit All PHI operations logged for HIPAA compliance
 * @encryption PHI data encrypted at rest (AES-256) and in transit (TLS 1.2+)
 *
 * Permission Model:
 * - health:read - View health records
 * - health:create - Create new health records
 * - health:update - Modify existing health records
 * - health:delete - Delete health records (use with caution)
 * - health:allergies:* - Allergy-specific permissions
 * - health:vaccinations:* - Vaccination-specific permissions
 * - health:conditions:* - Chronic condition-specific permissions
 * - health:emergency - Break-glass emergency access
 *
 * @example
 * // Typical usage in route handler
 * import { HealthRecordService } from '@/services/healthRecord';
 *
 * const records = await HealthRecordService.getStudentHealthRecords(
 *   studentId,
 *   page,
 *   limit,
 *   filters
 * );
 */
export class HealthRecordService {
  // ==================== Health Record Operations ====================

  /**
   * @method getStudentHealthRecords
   * @description Retrieve paginated health records for a student with filtering
   * @async
   * @see HealthRecordModule.getStudentHealthRecords for detailed documentation
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
