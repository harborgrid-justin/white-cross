/**
 * Health Records Type Definitions
 *
 * Core types for managing student health records including:
 * - Main health record entities
 * - Health summaries
 * - Bulk import operations
 *
 * @module services/modules/healthRecords/types/healthRecords.types
 */

import { PaginationParams } from '../../../types';

/**
 * Main health record entity
 */
export interface HealthRecord {
  id: string;
  studentId: string;
  type: HealthRecordType;
  date: string;
  description: string;
  diagnosis?: string;
  treatment?: string;
  provider?: string;
  providerNPI?: string;
  location?: string;
  notes?: string;
  attachments?: string[];
  isConfidential: boolean;
  followUpRequired: boolean;
  followUpDate?: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Health record type enumeration
 */
export type HealthRecordType =
  | 'GENERAL_VISIT'
  | 'INJURY'
  | 'ILLNESS'
  | 'MEDICATION'
  | 'VACCINATION'
  | 'SCREENING'
  | 'PHYSICAL_EXAM'
  | 'EMERGENCY'
  | 'MENTAL_HEALTH'
  | 'DENTAL'
  | 'VISION'
  | 'HEARING'
  | 'OTHER';

/**
 * Data required to create a new health record
 */
export interface HealthRecordCreate {
  studentId: string;
  type: HealthRecordType;
  date: string;
  description: string;
  diagnosis?: string;
  treatment?: string;
  provider?: string;
  providerNPI?: string;
  location?: string;
  notes?: string;
  attachments?: string[];
  isConfidential?: boolean;
  followUpRequired?: boolean;
  followUpDate?: string;
}

/**
 * Data for updating an existing health record
 */
export interface HealthRecordUpdate {
  type?: HealthRecordType;
  date?: string;
  description?: string;
  diagnosis?: string;
  treatment?: string;
  provider?: string;
  providerNPI?: string;
  location?: string;
  notes?: string;
  attachments?: string[];
  isConfidential?: boolean;
  followUpRequired?: boolean;
  followUpDate?: string;
}

/**
 * Filters for querying health records
 */
export interface HealthRecordFilters extends PaginationParams {
  type?: HealthRecordType;
  dateFrom?: string;
  dateTo?: string;
  provider?: string;
  followUpRequired?: boolean;
  isConfidential?: boolean;
}

/**
 * Comprehensive health summary for a student
 */
export interface HealthSummary {
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
    dateOfBirth: string;
    age: number;
    gender: string;
  };
  criticalAlerts: string[];
  allergies: unknown[]; // Will be typed properly when allergies types are imported
  criticalAllergies: unknown[];
  chronicConditions: unknown[];
  activeConditions: unknown[];
  latestVitals?: unknown;
  latestGrowth?: unknown;
  vaccinations: {
    isCompliant: boolean;
    total: number;
    overdue: number;
    upcoming: number;
  };
  recentScreenings: unknown[];
  lastPhysicalExam?: {
    date: string;
    provider: string;
  };
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
  }>;
  carePlans: string[];
  restrictions: string[];
  followUpsRequired: number;
  lastVisit?: string;
  totalVisits: number;
}

/**
 * Request for bulk importing health records
 */
export interface BulkImportRequest {
  records: HealthRecordCreate[];
  validateOnly?: boolean;
  continueOnError?: boolean;
}

/**
 * Result of bulk import operation
 */
export interface BulkImportResult {
  totalRecords: number;
  successCount: number;
  failureCount: number;
  errors: Array<{
    index: number;
    record: HealthRecordCreate;
    error: string;
    field?: string;
  }>;
  warnings: Array<{
    index: number;
    record: HealthRecordCreate;
    warning: string;
  }>;
  imported: HealthRecord[];
}

/**
 * Type alias for backward compatibility
 */
export type CreateHealthRecordRequest = HealthRecordCreate;
