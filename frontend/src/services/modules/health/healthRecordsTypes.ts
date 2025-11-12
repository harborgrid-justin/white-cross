/**
 * @fileoverview Health Records Type Definitions
 * @module services/modules/health/healthRecordsTypes
 * @category Services
 *
 * Type definitions, interfaces, and enums for the health records system.
 * Provides comprehensive type safety for student health data management.
 */

import type { PaginationParams } from '@/services/types';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

/**
 * Health Record Entity
 *
 * @interface
 * @description
 * Represents a comprehensive health record entry for a student. Health records document
 * all healthcare interactions, medical events, and health-related activities. Each record
 * includes detailed information about the event, provider, treatment, and any required follow-up.
 *
 * Healthcare Context:
 * - Maintains complete health history for continuity of care
 * - Supports medical-legal documentation requirements
 * - Enables care coordination across providers
 * - Tracks follow-up requirements to prevent missed care
 * - Provides data for health trends and population health analysis
 *
 * HIPAA Compliance:
 * - All fields containing PHI (Protected Health Information)
 * - Access logged automatically per HIPAA requirements
 * - Confidential flag enables enhanced access controls
 * - Audit trail maintained for all record access and modifications
 *
 * @property {string} id - Unique identifier for the health record (UUID)
 * @property {string} studentId - Student identifier (UUID) - links to student entity
 * @property {HealthRecordType} type - Classification of health record
 * @property {string} date - ISO 8601 timestamp of when the health event occurred
 * @property {string} description - Detailed narrative description of the health event or visit
 * @property {string} [diagnosis] - Medical diagnosis or assessment (optional)
 * @property {string} [treatment] - Treatment provided or care plan (optional)
 * @property {string} [provider] - Name of healthcare provider who rendered care (optional)
 * @property {string} [providerNPI] - National Provider Identifier - 10-digit NPI number (optional)
 * @property {string} [location] - Physical location where care was provided (optional)
 * @property {string} [notes] - Additional notes, observations, or context (optional)
 * @property {string[]} [attachments] - Array of URLs to attached documents (optional)
 * @property {boolean} isConfidential - Flag indicating enhanced access controls required
 * @property {boolean} followUpRequired - Indicates whether follow-up care or review is needed
 * @property {string} [followUpDate] - ISO 8601 timestamp when follow-up is due (optional)
 * @property {Object} student - Embedded student information for display purposes
 * @property {string} student.id - Student unique identifier
 * @property {string} student.firstName - Student first name
 * @property {string} student.lastName - Student last name
 * @property {string} student.studentNumber - School-assigned student number
 * @property {string} createdBy - User ID of person who created the record
 * @property {string} createdAt - ISO 8601 timestamp of record creation
 * @property {string} updatedAt - ISO 8601 timestamp of last update
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
 * Health Record Type Classification
 *
 * @description
 * Enumeration of all supported health record types. Each type represents a different
 * category of healthcare interaction or medical event.
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
 * Health Record Creation Data
 *
 * @interface
 * @description
 * Data transfer object for creating new health records. Contains all required and
 * optional fields needed to document a healthcare event.
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
  isConfidential: boolean;
  followUpRequired: boolean;
  followUpDate?: string;
}

/**
 * Health Record Update Data
 *
 * @interface
 * @description
 * Partial update object allowing modification of any health record field.
 */
export interface HealthRecordUpdate extends Partial<HealthRecordCreate> {}

/**
 * Health Record Filter Parameters
 *
 * @interface
 * @extends PaginationParams
 * @description
 * Query parameters for filtering health records with pagination support.
 * Supports filtering by student, type, date range, confidential status, and full-text search.
 *
 * @property {string} [studentId] - Filter by specific student UUID
 * @property {HealthRecordType} [type] - Filter by record type
 * @property {string} [dateFrom] - ISO 8601 start date for date range filter
 * @property {string} [dateTo] - ISO 8601 end date for date range filter
 * @property {boolean} [isConfidential] - Filter by confidential status
 * @property {boolean} [followUpRequired] - Filter records requiring follow-up
 * @property {string} [search] - Full-text search across description, diagnosis, treatment fields
 */
export interface HealthRecordFilters extends PaginationParams {
  studentId?: string;
  type?: HealthRecordType;
  dateFrom?: string;
  dateTo?: string;
  isConfidential?: boolean;
  followUpRequired?: boolean;
  search?: string;
}

/**
 * Comprehensive Health Summary
 *
 * @interface
 * @description
 * Aggregated health summary providing a complete overview of a student's health status,
 * recent activity, upcoming appointments, and compliance status. Combines data from
 * multiple health modules to provide a unified health profile.
 *
 * Healthcare Context:
 * - Provides at-a-glance health status for clinical decision support
 * - Aggregates critical alerts and compliance issues
 * - Enables proactive care coordination
 * - Supports care planning and risk stratification
 * - Facilitates parent/guardian health communication
 *
 * HIPAA Compliance:
 * - Access to summary automatically logged as PHI access
 * - Aggregates only data user is authorized to view
 * - Excludes confidential records unless explicitly authorized
 * - Maintains audit trail for compliance reporting
 *
 * @property {string} studentId - Student identifier for this summary
 * @property {Object} student - Basic student demographic information
 * @property {Object} overview - High-level health metrics and counts
 * @property {Array} recentActivity - Recent health events (last 5 activities)
 * @property {Array} upcomingAppointments - Scheduled future appointments
 * @property {Array} alerts - Critical health alerts requiring attention
 * @property {Object} complianceStatus - Health compliance tracking
 */
export interface HealthSummary {
  studentId: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    grade: string;
    studentNumber: string;
  };
  overview: {
    totalRecords: number;
    lastVisit?: string;
    nextScheduledVisit?: string;
    activeConditions: number;
    activeAllergies: number;
    currentMedications: number;
  };
  recentActivity: Array<{
    date: string;
    type: string;
    description: string;
  }>;
  upcomingAppointments: Array<{
    date: string;
    type: string;
    provider?: string;
  }>;
  alerts: Array<{
    type: 'ALLERGY' | 'CONDITION' | 'MEDICATION' | 'VACCINATION' | 'FOLLOW_UP';
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
    message: string;
  }>;
  complianceStatus: {
    vaccinations: 'COMPLIANT' | 'PARTIAL' | 'NON_COMPLIANT';
    screenings: 'UP_TO_DATE' | 'DUE' | 'OVERDUE';
    physicalExam: 'CURRENT' | 'DUE' | 'EXPIRED';
  };
}

/**
 * Export Options
 *
 * @interface
 * @description
 * Configuration options for exporting health records in various formats.
 * Supports selective data inclusion and multiple export formats.
 *
 * @property {string} studentId - UUID of student whose records to export
 * @property {'PDF' | 'JSON' | 'CSV' | 'CCD'} format - Export format
 * @property {HealthRecordType[]} [includeTypes] - Optional specific record types to include
 * @property {string} [dateFrom] - Optional start date for date range filter
 * @property {string} [dateTo] - Optional end date for date range filter
 * @property {boolean} [includeConfidential] - Whether to include confidential records
 * @property {boolean} [includeSummary] - Include health summary overview
 * @property {boolean} [includeAllergies] - Include allergy records
 * @property {boolean} [includeConditions] - Include chronic condition records
 * @property {boolean} [includeVaccinations] - Include vaccination records
 * @property {boolean} [includeVitals] - Include vital signs data
 * @property {boolean} [includeMedications] - Include medication records
 */
export interface ExportOptions {
  studentId: string;
  format: 'PDF' | 'JSON' | 'CSV' | 'CCD';
  includeTypes?: HealthRecordType[];
  dateFrom?: string;
  dateTo?: string;
  includeConfidential?: boolean;
  includeSummary?: boolean;
  includeAllergies?: boolean;
  includeConditions?: boolean;
  includeVaccinations?: boolean;
  includeVitals?: boolean;
  includeMedications?: boolean;
}

/**
 * Import Result
 *
 * @interface
 * @description
 * Result object returned after importing health records from external sources.
 * Provides detailed success/failure statistics and error messages.
 *
 * @property {boolean} success - Overall import success status
 * @property {number} recordsImported - Count of successfully imported records
 * @property {number} recordsFailed - Count of records that failed to import
 * @property {string[]} errors - Array of error messages for failed imports
 * @property {string[]} warnings - Array of warning messages for import issues
 */
export interface ImportResult {
  success: boolean;
  recordsImported: number;
  recordsFailed: number;
  errors: string[];
  warnings: string[];
}

/**
 * Search Parameters
 *
 * @interface
 * @description
 * Extended search parameters for cross-student health record searches.
 */
export interface HealthRecordSearchParams extends PaginationParams {
  query: string;
  type?: HealthRecordType;
  dateFrom?: string;
  dateTo?: string;
  schoolId?: string;
  includeConfidential?: boolean;
}

/**
 * Follow-Up Completion Data
 *
 * @interface
 * @description
 * Data required to mark a follow-up as complete.
 *
 * @property {string} completionDate - ISO 8601 timestamp when follow-up was completed
 * @property {string} notes - Notes about the follow-up completion
 * @property {string} [nextFollowUpDate] - Optional next follow-up date if additional care needed
 */
export interface FollowUpCompletionData {
  completionDate: string;
  notes: string;
  nextFollowUpDate?: string;
}

/**
 * Document Attachment Result
 *
 * @interface
 * @description
 * Result object returned after attaching a document to a health record.
 *
 * @property {string} url - URL where the document can be accessed
 * @property {string} id - Unique identifier for the attachment
 */
export interface DocumentAttachmentResult {
  url: string;
  id: string;
}

/**
 * Health Statistics
 *
 * @interface
 * @description
 * Aggregated health statistics for a school or district.
 *
 * @property {number} totalRecords - Total count of health records
 * @property {Record<HealthRecordType, number>} byType - Count of records by type
 * @property {Array} topDiagnoses - Most common diagnoses with counts
 * @property {Array} visitTrends - Health office visit trends over time
 * @property {number} emergencyRate - Percentage of emergency visits
 * @property {number} followUpCompletionRate - Percentage of completed follow-ups
 */
export interface HealthStatistics {
  totalRecords: number;
  byType: Record<HealthRecordType, number>;
  topDiagnoses: Array<{ diagnosis: string; count: number }>;
  visitTrends: Array<{ date: string; count: number }>;
  emergencyRate: number;
  followUpCompletionRate: number;
}
