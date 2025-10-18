/**
 * WC-GEN-111 | IHealthRecordRepository.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ./IRepository, ../../types/QueryTypes | Dependencies: ./IRepository, ../../types/QueryTypes
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: interfaces, types | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Health Record Repository Interface
 * Domain-specific repository for health records management
 */

import { IRepository } from './IRepository';
import { QueryOptions } from '../../types/QueryTypes';

export interface HealthRecord {
  id: string;
  studentId: string;
  type: HealthRecordType;
  date: Date;
  description: string;
  vital?: VitalSigns;
  provider?: string;
  notes?: string;
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type HealthRecordType =
  | 'CHECKUP'
  | 'VACCINATION'
  | 'ILLNESS'
  | 'INJURY'
  | 'SCREENING'
  | 'PHYSICAL_EXAM'
  | 'MENTAL_HEALTH'
  | 'DENTAL'
  | 'VISION'
  | 'HEARING';

export interface VitalSigns {
  temperature?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  height?: number;
  weight?: number;
  bmi?: number;
}

export interface CreateHealthRecordDTO {
  studentId: string;
  type: HealthRecordType;
  date: Date;
  description: string;
  vital?: VitalSigns;
  provider?: string;
  notes?: string;
  attachments?: string[];
}

export interface UpdateHealthRecordDTO {
  type?: HealthRecordType;
  date?: Date;
  description?: string;
  vital?: VitalSigns;
  provider?: string;
  notes?: string;
  attachments?: string[];
}

export interface HealthRecordFilters {
  type?: HealthRecordType;
  dateFrom?: Date;
  dateTo?: Date;
  provider?: string;
  hasVitals?: boolean;
  hasAttachments?: boolean;
}

export interface DateRangeFilter {
  startDate: Date;
  endDate: Date;
}

export interface SearchCriteria {
  query: string;
  type?: HealthRecordType;
  studentIds?: string[];
  includeArchived?: boolean;
}

export interface VitalSignsHistory {
  date: Date;
  vitals: VitalSigns;
  recordType: HealthRecordType;
  provider?: string;
}

export interface HealthSummary {
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
    dateOfBirth: Date;
    gender: string;
  };
  allergies: any[];
  chronicConditions: any[];
  recentVitals: VitalSignsHistory[];
  recentVaccinations: HealthRecord[];
  recordCounts: Record<HealthRecordType, number>;
  lastCheckup?: Date;
  upcomingReviews: any[];
}

export interface IHealthRecordRepository
  extends IRepository<HealthRecord, CreateHealthRecordDTO, UpdateHealthRecordDTO> {
  /**
   * Find health records for a specific student
   * @param studentId Student identifier
   * @param filters Filter criteria
   * @param options Query options with pagination
   */
  findByStudentId(
    studentId: string,
    filters: HealthRecordFilters,
    options?: QueryOptions
  ): Promise<any>;

  /**
   * Find health records by type within date range
   * @param type Health record type
   * @param filters Date range filter
   * @param options Query options
   */
  findByType(
    type: HealthRecordType,
    filters: DateRangeFilter,
    options?: QueryOptions
  ): Promise<HealthRecord[]>;

  /**
   * Get vital signs history for a student
   * @param studentId Student identifier
   * @param limit Maximum number of records to return
   */
  findVitalSignsHistory(studentId: string, limit: number): Promise<VitalSignsHistory[]>;

  /**
   * Search health records across all students
   * @param query Search criteria
   * @param options Query options
   */
  searchRecords(query: SearchCriteria, options?: QueryOptions): Promise<any>;

  /**
   * Count health records by type for a student
   * @param studentId Student identifier
   * @returns Record counts by type
   */
  countByType(studentId: string): Promise<Record<HealthRecordType, number>>;

  /**
   * Get comprehensive health summary for a student
   * @param studentId Student identifier
   * @returns Complete health summary including allergies, conditions, vitals
   */
  getHealthSummary(studentId: string): Promise<HealthSummary>;

  /**
   * Get vaccination records for a student
   * @param studentId Student identifier
   */
  getVaccinationRecords(studentId: string): Promise<HealthRecord[]>;

  /**
   * Bulk delete health records
   * @param recordIds Array of record identifiers
   * @param context Execution context
   */
  bulkDelete(recordIds: string[], context: any): Promise<{ deleted: number; notFound: number }>;
}
