/**
 * Health Record Repository Interface
 * @description Repository interface for health record entity operations
 * Extends base repository with health record-specific methods
 */

import { IRepository } from './IRepository';

/**
 * Health record entity type (matches database model)
 */
export interface HealthRecord {
  id: string;
  studentId: string;
  type: 'VISIT' | 'SCREENING' | 'VACCINATION' | 'INJURY' | 'ILLNESS' | 'MEDICATION' | 'OTHER';
  date: Date;
  visitReason?: string;
  symptoms?: string;
  diagnosis?: string;
  diagnosisCode?: string;
  treatment?: string;
  followUpRequired?: boolean;
  followUpDate?: Date;
  vital?: any; // JSON field for vital signs
  notes?: string;
  attachments?: string[];
  createdById: string;
  updatedById?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Health record repository interface
 */
export interface IHealthRecordRepository extends IRepository<HealthRecord> {
  /**
   * Find all health records for a student
   * @param studentId - Student ID
   * @param options - Query options (pagination, filters)
   * @returns Promise resolving to student's health records
   */
  findByStudentId(studentId: string, options?: HealthRecordQueryOptions): Promise<HealthRecord[]>;

  /**
   * Find health records by date range
   * @param startDate - Range start date
   * @param endDate - Range end date
   * @param filters - Additional filters
   * @returns Promise resolving to health records in range
   */
  findByDateRange(startDate: Date, endDate: Date, filters?: HealthRecordFilters): Promise<HealthRecord[]>;

  /**
   * Find health record with vital signs
   * @param id - Health record ID
   * @returns Promise resolving to health record with vitals
   */
  findWithVitals(id: string): Promise<HealthRecord | null>;

  /**
   * Find health records requiring follow-up
   * @param beforeDate - Optional date cutoff (default: today)
   * @returns Promise resolving to records needing follow-up
   */
  findRequiringFollowUp(beforeDate?: Date): Promise<HealthRecord[]>;

  /**
   * Find health records by type
   * @param type - Record type
   * @param filters - Additional filters
   * @returns Promise resolving to records of specified type
   */
  findByType(type: HealthRecord['type'], filters?: HealthRecordFilters): Promise<HealthRecord[]>;

  /**
   * Find health records by diagnosis code
   * @param diagnosisCode - ICD-10 or other diagnosis code
   * @returns Promise resolving to records with diagnosis code
   */
  findByDiagnosisCode(diagnosisCode: string): Promise<HealthRecord[]>;

  /**
   * Find recent health records for a student
   * @param studentId - Student ID
   * @param limit - Maximum number of records
   * @returns Promise resolving to recent records
   */
  findRecentByStudent(studentId: string, limit?: number): Promise<HealthRecord[]>;

  /**
   * Get health summary for a student
   * @param studentId - Student ID
   * @returns Promise resolving to health summary
   */
  getHealthSummary(studentId: string): Promise<HealthSummary>;

  /**
   * Find health records created by a specific user
   * @param userId - User ID
   * @param options - Query options
   * @returns Promise resolving to records created by user
   */
  findByCreator(userId: string, options?: HealthRecordQueryOptions): Promise<HealthRecord[]>;

  /**
   * Count health records by type for a student
   * @param studentId - Student ID
   * @returns Promise resolving to record counts by type
   */
  countByTypeForStudent(studentId: string): Promise<Record<HealthRecord['type'], number>>;
}

/**
 * Filters for health record queries
 */
export interface HealthRecordFilters {
  studentId?: string;
  type?: HealthRecord['type'] | HealthRecord['type'][];
  dateFrom?: Date;
  dateTo?: Date;
  createdById?: string;
  followUpRequired?: boolean;
  diagnosisCode?: string;
}

/**
 * Query options for health records
 */
export interface HealthRecordQueryOptions {
  page?: number;
  limit?: number;
  includeStudent?: boolean;
  includeCreator?: boolean;
  orderBy?: 'date' | 'createdAt' | 'updatedAt';
  orderDirection?: 'ASC' | 'DESC';
}

/**
 * Health summary for a student
 */
export interface HealthSummary {
  studentId: string;
  totalRecords: number;
  recordsByType: Record<HealthRecord['type'], number>;
  lastVisitDate?: Date;
  upcomingFollowUps: HealthRecord[];
  recentDiagnoses: string[];
  chronicConditions: string[];
}

/**
 * Data for creating a new health record
 */
export interface CreateHealthRecordData {
  studentId: string;
  type: HealthRecord['type'];
  date: Date;
  visitReason?: string;
  symptoms?: string;
  diagnosis?: string;
  diagnosisCode?: string;
  treatment?: string;
  followUpRequired?: boolean;
  followUpDate?: Date;
  vital?: any;
  notes?: string;
  attachments?: string[];
  createdById: string;
}

/**
 * Data for updating a health record
 */
export interface UpdateHealthRecordData extends Partial<CreateHealthRecordData> {
  updatedById?: string;
}
