/**
 * Health Records API - Health Record Type Definitions
 *
 * Core health record types for tracking student medical visits and encounters
 *
 * @module services/modules/healthRecordsApi/types/healthRecords
 */

import type { PaginationParams } from '../../../types';
import type { StudentReference } from './base';

/**
 * Types of health records that can be created in the system
 * Categorizes different kinds of medical encounters and documentation
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
 * Complete health record entity with all fields
 * Represents a single medical encounter or health-related event for a student
 */
export interface HealthRecord {
  /** Unique identifier for the health record */
  id: string;
  /** ID of the student this record belongs to */
  studentId: string;
  /** Type of health record/encounter */
  type: HealthRecordType;
  /** Date of the health encounter (ISO 8601 format) */
  date: string;
  /** Brief description of the visit or encounter */
  description: string;
  /** Medical diagnosis if applicable */
  diagnosis?: string;
  /** Treatment provided or prescribed */
  treatment?: string;
  /** Name of the healthcare provider */
  provider?: string;
  /** National Provider Identifier for the healthcare provider */
  providerNPI?: string;
  /** Location where care was provided */
  location?: string;
  /** Additional notes about the encounter */
  notes?: string;
  /** Array of attachment file identifiers or URLs */
  attachments?: string[];
  /** Whether this record contains confidential information */
  isConfidential: boolean;
  /** Whether follow-up care is required */
  followUpRequired: boolean;
  /** Scheduled date for follow-up (ISO 8601 format) */
  followUpDate?: string;
  /** Reference to the student */
  student: StudentReference;
  /** ID of the user who created this record */
  createdBy: string;
  /** Timestamp when record was created (ISO 8601 format) */
  createdAt: string;
  /** Timestamp when record was last updated (ISO 8601 format) */
  updatedAt: string;
}

/**
 * Data required to create a new health record
 * Excludes system-generated fields like id, timestamps, and student reference
 */
export interface HealthRecordCreate {
  /** ID of the student this record belongs to */
  studentId: string;
  /** Type of health record/encounter */
  type: HealthRecordType;
  /** Date of the health encounter (ISO 8601 format) */
  date: string;
  /** Brief description of the visit or encounter */
  description: string;
  /** Medical diagnosis if applicable */
  diagnosis?: string;
  /** Treatment provided or prescribed */
  treatment?: string;
  /** Name of the healthcare provider */
  provider?: string;
  /** National Provider Identifier for the healthcare provider */
  providerNPI?: string;
  /** Location where care was provided */
  location?: string;
  /** Additional notes about the encounter */
  notes?: string;
  /** Array of attachment file identifiers or URLs */
  attachments?: string[];
  /** Whether this record contains confidential information (default: false) */
  isConfidential?: boolean;
  /** Whether follow-up care is required (default: false) */
  followUpRequired?: boolean;
  /** Scheduled date for follow-up (ISO 8601 format) */
  followUpDate?: string;
}

/**
 * Fields that can be updated on an existing health record
 * All fields are optional to support partial updates
 */
export interface HealthRecordUpdate {
  /** Type of health record/encounter */
  type?: HealthRecordType;
  /** Date of the health encounter (ISO 8601 format) */
  date?: string;
  /** Brief description of the visit or encounter */
  description?: string;
  /** Medical diagnosis if applicable */
  diagnosis?: string;
  /** Treatment provided or prescribed */
  treatment?: string;
  /** Name of the healthcare provider */
  provider?: string;
  /** National Provider Identifier for the healthcare provider */
  providerNPI?: string;
  /** Location where care was provided */
  location?: string;
  /** Additional notes about the encounter */
  notes?: string;
  /** Array of attachment file identifiers or URLs */
  attachments?: string[];
  /** Whether this record contains confidential information */
  isConfidential?: boolean;
  /** Whether follow-up care is required */
  followUpRequired?: boolean;
  /** Scheduled date for follow-up (ISO 8601 format) */
  followUpDate?: string;
}

/**
 * Query filters for retrieving health records
 * Extends pagination parameters with health record-specific filters
 */
export interface HealthRecordFilters extends PaginationParams {
  /** Filter by specific health record type */
  type?: HealthRecordType;
  /** Filter by records on or after this date (ISO 8601 format) */
  dateFrom?: string;
  /** Filter by records on or before this date (ISO 8601 format) */
  dateTo?: string;
  /** Filter by healthcare provider name */
  provider?: string;
  /** Filter by follow-up requirement status */
  followUpRequired?: boolean;
  /** Filter by confidentiality status */
  isConfidential?: boolean;
}
