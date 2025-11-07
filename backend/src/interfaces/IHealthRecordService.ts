/**
 * Health Record Service Interface
 * @description Interface for health record service defining contract for dependency injection
 * Enables testability, mocking, and future service implementations
 */

import {
  HealthRecord,
  CreateHealthRecordData,
  UpdateHealthRecordData,
  HealthSummary,
  HealthRecordFilters,
} from '../database/repositories/interfaces/health-record.repository.interface';

/**
 * Health record list result with pagination
 */
export interface HealthRecordListResult {
  records: HealthRecord[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

/**
 * Health Record Service Interface
 * Defines all public methods for health record management
 */
export interface IHealthRecordService {
  /**
   * Get paginated list of health records
   * @param page - Page number
   * @param limit - Items per page
   * @param filters - Optional filters
   * @returns Promise resolving to health record list result
   */
  getHealthRecords(
    page?: number,
    limit?: number,
    filters?: HealthRecordFilters,
  ): Promise<HealthRecordListResult>;

  /**
   * Get a single health record by ID
   * @param id - Health record ID
   * @returns Promise resolving to health record or null
   */
  getHealthRecordById(id: string): Promise<HealthRecord | null>;

  /**
   * Get all health records for a student
   * @param studentId - Student ID
   * @param limit - Maximum records to return
   * @returns Promise resolving to student's health records
   */
  getStudentHealthRecords(
    studentId: string,
    limit?: number,
  ): Promise<HealthRecord[]>;

  /**
   * Get health summary for a student
   * @param studentId - Student ID
   * @returns Promise resolving to health summary
   */
  getStudentHealthSummary(studentId: string): Promise<HealthSummary>;

  /**
   * Create a new health record
   * @param data - Health record data
   * @returns Promise resolving to created health record
   */
  createHealthRecord(data: CreateHealthRecordData): Promise<HealthRecord>;

  /**
   * Update an existing health record
   * @param id - Health record ID
   * @param data - Updated health record data
   * @returns Promise resolving to updated health record
   */
  updateHealthRecord(
    id: string,
    data: UpdateHealthRecordData,
  ): Promise<HealthRecord>;

  /**
   * Delete a health record
   * @param id - Health record ID
   * @returns Promise resolving when deletion is complete
   */
  deleteHealthRecord(id: string): Promise<void>;

  /**
   * Get health records by type
   * @param type - Health record type
   * @param studentId - Optional student ID filter
   * @returns Promise resolving to health records of specified type
   */
  getHealthRecordsByType(
    type: HealthRecord['type'],
    studentId?: string,
  ): Promise<HealthRecord[]>;

  /**
   * Get health records requiring follow-up
   * @param beforeDate - Optional date cutoff
   * @returns Promise resolving to records needing follow-up
   */
  getRecordsRequiringFollowUp(beforeDate?: Date): Promise<HealthRecord[]>;

  /**
   * Get health records by date range
   * @param startDate - Range start date
   * @param endDate - Range end date
   * @param filters - Additional filters
   * @returns Promise resolving to health records in range
   */
  getHealthRecordsByDateRange(
    startDate: Date,
    endDate: Date,
    filters?: HealthRecordFilters,
  ): Promise<HealthRecord[]>;
}

/**
 * Health Record CRUD Service Interface
 * Segregated interface for basic CRUD operations (ISP compliance)
 */
export interface IHealthRecordCrudService {
  getHealthRecords(
    page?: number,
    limit?: number,
    filters?: HealthRecordFilters,
  ): Promise<HealthRecordListResult>;
  getHealthRecordById(id: string): Promise<HealthRecord | null>;
  createHealthRecord(data: CreateHealthRecordData): Promise<HealthRecord>;
  updateHealthRecord(
    id: string,
    data: UpdateHealthRecordData,
  ): Promise<HealthRecord>;
  deleteHealthRecord(id: string): Promise<void>;
}

/**
 * Health Record Query Service Interface
 * Segregated interface for query operations (ISP compliance)
 */
export interface IHealthRecordQueryService {
  getStudentHealthRecords(
    studentId: string,
    limit?: number,
  ): Promise<HealthRecord[]>;
  getStudentHealthSummary(studentId: string): Promise<HealthSummary>;
  getHealthRecordsByType(
    type: HealthRecord['type'],
    studentId?: string,
  ): Promise<HealthRecord[]>;
  getRecordsRequiringFollowUp(beforeDate?: Date): Promise<HealthRecord[]>;
  getHealthRecordsByDateRange(
    startDate: Date,
    endDate: Date,
    filters?: HealthRecordFilters,
  ): Promise<HealthRecord[]>;
}
