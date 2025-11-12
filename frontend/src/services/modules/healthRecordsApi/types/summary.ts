/**
 * Health Records API - Summary and Bulk Operation Type Definitions
 *
 * Types for comprehensive health summaries and bulk data operations
 *
 * @module services/modules/healthRecordsApi/types/summary
 */

import type { StudentReferenceWithDemographics } from './base';
import type { Allergy } from './allergies';
import type { ChronicCondition } from './conditions';
import type { Screening } from './screenings';
import type { VitalSigns, GrowthMeasurement } from './measurements';
import type { HealthRecord, HealthRecordCreate } from './healthRecords';

// ==========================================
// HEALTH SUMMARY
// ==========================================

/**
 * Medication summary information
 * Simplified medication data for health summary display
 */
export interface MedicationSummary {
  /** Name of the medication */
  name: string;
  /** Dosage amount and form */
  dosage: string;
  /** Frequency of administration */
  frequency: string;
}

/**
 * Physical examination summary
 * Basic information about the most recent physical exam
 */
export interface PhysicalExamSummary {
  /** Date of the physical exam (ISO 8601 format) */
  date: string;
  /** Name of the healthcare provider who performed the exam */
  provider: string;
}

/**
 * Vaccination summary statistics
 * Overview of vaccination compliance status
 */
export interface VaccinationSummary {
  /** Whether the student is compliant with all required vaccinations */
  isCompliant: boolean;
  /** Total number of vaccination records */
  total: number;
  /** Number of overdue vaccinations */
  overdue: number;
  /** Number of vaccinations with upcoming due dates */
  upcoming: number;
}

/**
 * Comprehensive health summary for a student
 * Aggregates key health information from multiple sources for quick reference
 */
export interface HealthSummary {
  /** Student reference with required demographic information */
  student: StudentReferenceWithDemographics & {
    /** Calculated age from date of birth */
    age: number;
  };
  /** Critical alerts requiring immediate attention */
  criticalAlerts: string[];
  /** All allergy records for the student */
  allergies: Allergy[];
  /** Subset of allergies marked as critical/life-threatening */
  criticalAllergies: Allergy[];
  /** All chronic condition records for the student */
  chronicConditions: ChronicCondition[];
  /** Subset of chronic conditions that are currently active */
  activeConditions: ChronicCondition[];
  /** Most recent vital signs measurement */
  latestVitals?: VitalSigns;
  /** Most recent growth measurement */
  latestGrowth?: GrowthMeasurement;
  /** Vaccination compliance summary */
  vaccinations: VaccinationSummary;
  /** Recent screening results */
  recentScreenings: Screening[];
  /** Information about most recent physical examination */
  lastPhysicalExam?: PhysicalExamSummary;
  /** Current medications being taken */
  medications: MedicationSummary[];
  /** Active care plans (list of condition names with care plans) */
  carePlans: string[];
  /** Current physical or activity restrictions */
  restrictions: string[];
  /** Number of health records requiring follow-up */
  followUpsRequired: number;
  /** Date of most recent health visit (ISO 8601 format) */
  lastVisit?: string;
  /** Total number of health visits on record */
  totalVisits: number;
}

// ==========================================
// BULK OPERATIONS
// ==========================================

/**
 * Error details for a failed bulk import record
 */
export interface BulkImportError {
  /** Index of the record in the import array that failed */
  index: number;
  /** The record data that failed to import */
  record: HealthRecordCreate;
  /** Error message describing why the import failed */
  error: string;
  /** Specific field that caused the error, if applicable */
  field?: string;
}

/**
 * Warning details for a bulk import record
 */
export interface BulkImportWarning {
  /** Index of the record in the import array */
  index: number;
  /** The record data that generated a warning */
  record: HealthRecordCreate;
  /** Warning message */
  warning: string;
}

/**
 * Request to bulk import health records
 * Allows importing multiple records in a single operation
 */
export interface BulkImportRequest {
  /** Array of health records to import */
  records: HealthRecordCreate[];
  /** If true, validate records without actually importing them */
  validateOnly?: boolean;
  /** If true, continue processing remaining records after an error */
  continueOnError?: boolean;
}

/**
 * Result of a bulk import operation
 * Provides detailed feedback about the import process
 */
export interface BulkImportResult {
  /** Total number of records in the import request */
  totalRecords: number;
  /** Number of records successfully imported */
  successCount: number;
  /** Number of records that failed to import */
  failureCount: number;
  /** Detailed error information for failed records */
  errors: BulkImportError[];
  /** Warning messages for records that imported but had issues */
  warnings: BulkImportWarning[];
  /** Successfully imported health records */
  imported: HealthRecord[];
}
