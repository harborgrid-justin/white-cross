/**
 * @fileoverview Health Record Service - Unified Facade for Health Management
 * @module health-record
 * @description Unified facade service providing all health record operations by
 * delegating to specialized services. Maintains backward compatibility while
 * improving maintainability through service decomposition.
 *
 * Architecture Pattern: Facade Pattern with Service Delegation
 * - Maintains existing public API
 * - Delegates to specialized services
 * - Provides single entry point for health record operations
 *
 * HIPAA CRITICAL - This service manages Protected Health Information (PHI)
 *
 * @compliance HIPAA Privacy Rule §164.308, HIPAA Security Rule §164.312
 * @compliance CDC Guidelines, ICD-10-CM Standards, CVX Vaccine Codes
 */

import { Injectable } from '@nestjs/common';
import { BaseService } from '../common/base';
import { HealthRecord   } from "../../database/models";
import { Allergy   } from "../../database/models";
import { ChronicCondition   } from "../../database/models";
import { Vaccination   } from "../../database/models";
import { BulkDeleteResults } from './interfaces/health-record-types';
import { GrowthDataPoint } from './interfaces/pagination.interface';
import { HealthRecordStatistics } from './interfaces/health-record-types';
import { HealthSummary } from './interfaces/pagination.interface';
import { ImportResults } from './interfaces/health-record-types';
import { PaginatedHealthRecords } from './interfaces/pagination.interface';
import { VitalSigns } from './interfaces/vital-signs.interface';

// DTOs
import { HealthRecordCreateDto } from './dto/create-health-record.dto';
import { HealthRecordUpdateDto } from './dto/update-health-record.dto';
import { ImportHealthRecordsDto } from './dto/import-health-records.dto';
import { HealthRecordFilterDto } from './dto/health-record-filter.dto';
import { CreateAllergyDto } from './allergy/dto/create-allergy.dto';
import { UpdateAllergyDto } from './allergy/dto/update-allergy.dto';
import { CreateChronicConditionDto } from './chronic-condition/dto/create-chronic-condition.dto';
import { UpdateChronicConditionDto } from './chronic-condition/dto/update-chronic-condition.dto';
import { CreateVaccinationDto } from './vaccination/dto/create-vaccination.dto';
import { UpdateVaccinationDto } from './vaccination/dto/update-vaccination.dto';

/**
 * Filter interface for health record queries
 */
interface HealthRecordFilters {
  type?: string;
  dateFrom?: Date;
  dateTo?: Date;
  provider?: string;
  studentId?: string;
}

// Specialized Services
import { HealthRecordCrudService } from './services/health-record-crud.service';
import { HealthRecordAllergyService } from './services/health-record-allergy.service';
import { HealthRecordChronicConditionService } from './services/health-record-chronic-condition.service';
import { HealthRecordVaccinationService } from './services/health-record-vaccination.service';
import { HealthRecordVitalsService } from './services/health-record-vitals.service';
import { HealthRecordSummaryService } from './services/health-record-summary.service';
import { HealthRecordBatchService } from './services/health-record-batch.service';

/**
 * HealthRecordService - Unified Facade
 *
 * Comprehensive HIPAA-Compliant Health Management Service
 * Delegates to specialized services for improved maintainability
 *
 * Service Architecture:
 * - HealthRecordCrudService: Basic CRUD operations
 * - HealthRecordAllergyService: Allergy management
 * - HealthRecordChronicConditionService: Chronic condition management
 * - HealthRecordVaccinationService: Vaccination management
 * - HealthRecordVitalsService: Growth tracking and vital signs
 * - HealthRecordSummaryService: Analytics, search, import/export
 * - HealthRecordBatchService: Batch operations for DataLoader
 */
@Injectable()
export class HealthRecordService extends BaseService {
  constructor(
    private readonly crudService: HealthRecordCrudService,
    private readonly allergyService: HealthRecordAllergyService,
    private readonly chronicConditionService: HealthRecordChronicConditionService,
    private readonly vaccinationService: HealthRecordVaccinationService,
    private readonly vitalsService: HealthRecordVitalsService,
    private readonly summaryService: HealthRecordSummaryService,
    private readonly batchService: HealthRecordBatchService,
  ) {
    super(HealthRecordService.name);
  }

  // ==================== Health Record Operations ====================

  /**
   * Get paginated health records for a student with filtering
   * @param studentId - Student UUID
   * @param page - Page number (default: 1)
   * @param limit - Records per page (default: 20)
   * @param filters - Optional filtering criteria
   * @returns Paginated health records with metadata
   */
  async getStudentHealthRecords(
    studentId: string,
    page: number = 1,
    limit: number = 20,
    filters: HealthRecordFilters = {},
  ): Promise<PaginatedHealthRecords<HealthRecord>> {
    return this.crudService.getStudentHealthRecords(studentId, page, limit, filters);
  }

  /**
   * Create new health record with comprehensive validation
   * @param data - Health record creation data
   * @returns Created health record with associations
   */
  async createHealthRecord(data: HealthRecordCreateDto): Promise<HealthRecord> {
    return this.crudService.createHealthRecord(data);
  }

  /**
   * Update existing health record with validation
   * @param id - Health record UUID
   * @param data - Updated health record data
   * @returns Updated health record with associations
   */
  async updateHealthRecord(id: string, data: HealthRecordUpdateDto): Promise<HealthRecord> {
    return this.crudService.updateHealthRecord(id, data);
  }

  /**
   * Get vaccination records for a student
   * @param studentId - Student UUID
   * @returns Array of vaccination records
   */
  async getVaccinationRecords(studentId: string): Promise<HealthRecord[]> {
    return this.crudService.getVaccinationRecords(studentId);
  }

  /**
   * Bulk delete health records
   * @param recordIds - Array of health record UUIDs
   * @returns Deletion results
   */
  async bulkDeleteHealthRecords(recordIds: string[]): Promise<BulkDeleteResults> {
    return this.crudService.bulkDeleteHealthRecords(recordIds);
  }

  // ==================== Allergy Operations ====================

  /**
   * Add allergy to student with validation
   * @param data - Allergy creation data
   * @returns Created allergy record
   */
  async addAllergy(data: CreateAllergyDto): Promise<Allergy> {
    return this.allergyService.addAllergy(data);
  }

  /**
   * Update allergy information
   * @param id - Allergy UUID
   * @param data - Updated allergy data
   * @returns Updated allergy record
   */
  async updateAllergy(id: string, data: UpdateAllergyDto): Promise<Allergy> {
    return this.allergyService.updateAllergy(id, data);
  }

  /**
   * Get student allergies
   * @param studentId - Student UUID
   * @returns Array of allergies ordered by severity
   */
  async getStudentAllergies(studentId: string): Promise<Allergy[]> {
    return this.allergyService.getStudentAllergies(studentId);
  }

  /**
   * Delete allergy (soft delete for HIPAA compliance)
   * @param id - Allergy UUID
   * @returns Success status
   */
  async deleteAllergy(id: string): Promise<{ success: boolean }> {
    return this.allergyService.deleteAllergy(id);
  }

  // ==================== Chronic Condition Operations ====================

  /**
   * Add chronic condition to student with validation and audit logging
   * @param data - Chronic condition creation data
   * @returns Created chronic condition record
   */
  async addChronicCondition(data: CreateChronicConditionDto): Promise<ChronicCondition> {
    return this.chronicConditionService.addChronicCondition(data);
  }

  /**
   * Get student chronic conditions with filtering
   * @param studentId - Student UUID
   * @returns Array of chronic conditions ordered by severity
   */
  async getStudentChronicConditions(studentId: string): Promise<any[]> {
    return this.chronicConditionService.getStudentChronicConditions(studentId);
  }

  /**
   * Update chronic condition information
   * @param id - Chronic condition UUID
   * @param data - Updated chronic condition data
   * @returns Updated chronic condition record
   */
  async updateChronicCondition(
    id: string,
    data: UpdateChronicConditionDto,
  ): Promise<ChronicCondition> {
    return this.chronicConditionService.updateChronicCondition(id, data);
  }

  /**
   * Delete chronic condition (soft delete for HIPAA compliance)
   * @param id - Chronic condition UUID
   * @returns Success status
   */
  async deleteChronicCondition(id: string): Promise<{ success: boolean }> {
    return this.chronicConditionService.deleteChronicCondition(id);
  }

  // ==================== Vaccination Operations ====================

  /**
   * Add vaccination to student with validation and audit logging
   * @param data - Vaccination creation data
   * @returns Created vaccination record
   */
  async addVaccination(data: CreateVaccinationDto): Promise<Vaccination> {
    return this.vaccinationService.addVaccination(data);
  }

  /**
   * Get student vaccinations
   * @param studentId - Student UUID
   * @returns Array of vaccinations ordered by administration date
   */
  async getStudentVaccinations(studentId: string): Promise<Vaccination[]> {
    return this.vaccinationService.getStudentVaccinations(studentId);
  }

  /**
   * Update vaccination information
   * @param id - Vaccination UUID
   * @param data - Updated vaccination data
   * @returns Updated vaccination record
   */
  async updateVaccination(id: string, data: UpdateVaccinationDto): Promise<Vaccination> {
    return this.vaccinationService.updateVaccination(id, data);
  }

  /**
   * Delete vaccination (soft delete for HIPAA compliance)
   * @param id - Vaccination UUID
   * @returns Success status
   */
  async deleteVaccination(id: string): Promise<{ success: boolean }> {
    return this.vaccinationService.deleteVaccination(id);
  }

  // ==================== Growth and Vital Signs Operations ====================

  /**
   * Get growth chart data for student (height/weight over time)
   * @param studentId - Student UUID
   * @returns Array of growth data points
   */
  async getGrowthChartData(studentId: string): Promise<GrowthDataPoint[]> {
    return this.vitalsService.getGrowthChartData(studentId);
  }

  /**
   * Get recent vital signs for student
   * @param studentId - Student UUID
   * @param limit - Number of records to retrieve
   * @returns Array of recent vital signs
   */
  async getRecentVitals(studentId: string, limit: number = 10): Promise<VitalSigns[]> {
    return this.vitalsService.getRecentVitals(studentId, limit);
  }

  // ==================== Summary and Analytics Operations ====================

  /**
   * Get comprehensive health summary for student
   * @param studentId - Student UUID
   * @returns Health summary with aggregated data
   */
  async getHealthSummary(studentId: string): Promise<HealthSummary> {
    const summary = await this.summaryService.getHealthSummary(studentId);
    // Enhance with vitals from vitals service
    summary.recentVitals = await this.vitalsService.getRecentVitals(studentId, 5);
    return summary;
  }

  /**
   * Search health records by keyword
   * @param query - Search query string
   * @param type - Optional record type filter
   * @param page - Page number
   * @param limit - Records per page
   * @returns Paginated search results
   */
  async searchHealthRecords(
    query: string,
    type?: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedHealthRecords<HealthRecord>> {
    return this.summaryService.searchHealthRecords(query, type, page, limit);
  }

  /**
   * Export complete health history for student
   * @param studentId - Student UUID
   * @returns Complete health data export
   */
  async exportHealthHistory(studentId: string): Promise<any> {
    return this.summaryService.exportHealthHistory(studentId);
  }

  /**
   * Import health records from external source
   * @param studentId - Student UUID
   * @param importData - Import data structure
   * @returns Import operation results
   */
  async importHealthRecords(
    studentId: string,
    importData: ImportHealthRecordsDto,
  ): Promise<ImportResults> {
    return this.summaryService.importHealthRecords(studentId, importData);
  }

  /**
   * Get all health records with optional filtering and pagination
   * @param page - Page number (default: 1)
   * @param limit - Records per page (default: 20)
   * @param filters - Optional filtering criteria
   * @returns Paginated health records across all students
   */
  async getAllHealthRecords(
    page: number = 1,
    limit: number = 20,
    filters: {
      type?: string;
      dateFrom?: Date;
      dateTo?: Date;
      provider?: string;
      studentId?: string;
    } = {},
  ): Promise<PaginatedHealthRecords<HealthRecord>> {
    return this.crudService.getAllHealthRecords(page, limit, filters);
  }

  /**
   * Get health record statistics
   * @returns System-wide health record statistics
   */
  async getHealthRecordStatistics(): Promise<HealthRecordStatistics> {
    return this.summaryService.getHealthRecordStatistics();
  }

  /**
   * Get health record for a specific student
   * @param studentId - Student identifier
   * @returns Health record or null if not found
   */
  async getHealthRecord(studentId: string): Promise<HealthRecord | null> {
    return this.crudService.getHealthRecord(studentId);
  }

  /**
   * Get health record by its ID
   * @param id - Health record identifier
   * @returns Health record or null if not found
   */
  async getHealthRecordById(id: string): Promise<HealthRecord | null> {
    return this.crudService.getHealthRecordById(id);
  }

  /**
   * Delete a specific health record
   * @param id - Health record identifier
   */
  async deleteHealthRecord(id: string): Promise<void> {
    return this.crudService.deleteHealthRecord(id);
  }

  /**
   * Get complete health profile for a student
   * @param studentId - Student identifier
   * @returns Complete health profile with all related data
   */
  async getCompleteHealthProfile(studentId: string): Promise<any> {
    return this.summaryService.getCompleteHealthProfile(studentId);
  }

  // ==================== GraphQL Resolver Helper Methods ====================

  /**
   * Find all health records with pagination and filters (alias for GraphQL resolver)
   * @param page - Page number
   * @param limit - Records per page
   * @param filters - Optional filters
   * @returns Paginated health records
   */
  async findAll(
    page: number = 1,
    limit: number = 20,
    filters: HealthRecordFilterDto = {},
  ): Promise<any> {
    return this.getAllHealthRecords(page, limit, filters);
  }

  /**
   * Find single health record by ID (alias for GraphQL resolver)
   * @param id - Health record UUID
   * @returns Health record or null
   */
  async findOne(id: string): Promise<HealthRecord | null> {
    return this.getHealthRecordById(id);
  }

  /**
   * Find health records by student ID (alias for GraphQL resolver)
   * @param studentId - Student UUID
   * @param page - Page number
   * @param limit - Records per page
   * @param filters - Optional filters
   * @returns Paginated health records for student
   */
  async findByStudent(
    studentId: string,
    page: number = 1,
    limit: number = 20,
    filters: HealthRecordFilterDto = {},
  ): Promise<any> {
    return this.getStudentHealthRecords(studentId, page, limit, filters);
  }

  /**
   * Create health record (alias for GraphQL resolver)
   * @param data - Health record creation data
   * @returns Created health record
   */
  async create(data: HealthRecordCreateDto): Promise<HealthRecord> {
    return this.createHealthRecord(data);
  }

  /**
   * Update health record (alias for GraphQL resolver)
   * @param id - Health record UUID
   * @param data - Update data
   * @returns Updated health record
   */
  async update(id: string, data: HealthRecordUpdateDto): Promise<HealthRecord> {
    return this.updateHealthRecord(id, data);
  }

  /**
   * Remove health record (alias for GraphQL resolver)
   * @param id - Health record UUID
   * @returns void
   */
  async remove(id: string): Promise<void> {
    return this.deleteHealthRecord(id);
  }

  // ==================== Batch Query Methods (DataLoader Support) ====================

  /**
   * Batch find health records by IDs (for DataLoader)
   * Returns health records in the same order as requested IDs
   *
   * OPTIMIZATION: Eliminates N+1 queries when fetching multiple health records
   * Before: 1 + N queries (1 per record)
   * After: 1 query with IN clause
   * Performance improvement: ~99% query reduction for batch operations
   */
  async findByIds(ids: string[]): Promise<(HealthRecord | null)[]> {
    return this.batchService.findByIds(ids);
  }

  /**
   * Batch find health records by student IDs (for DataLoader)
   * Returns array of health record arrays for each student ID
   *
   * OPTIMIZATION: Eliminates N+1 queries when fetching health records for multiple students
   * Before: 1 + N queries (1 per student)
   * After: 1 query with IN clause
   * Performance improvement: ~99% query reduction for batch operations
   *
   * Example use case: Fetching health records for all students in a class or school
   */
  async findByStudentIds(studentIds: string[]): Promise<HealthRecord[][]> {
    return this.batchService.findByStudentIds(studentIds);
  }
}
