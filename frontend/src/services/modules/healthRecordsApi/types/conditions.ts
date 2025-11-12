/**
 * Health Records API - Chronic Condition Type Definitions
 *
 * Types for managing chronic health conditions and care plans
 *
 * @module services/modules/healthRecordsApi/types/conditions
 */

import type { StudentReference } from './base';

/**
 * Status of a chronic condition
 * Indicates the current state of the condition and its management
 */
export enum ConditionStatus {
  /** Condition is currently active and symptomatic */
  ACTIVE = 'ACTIVE',
  /** Condition is active but well-managed with current treatment */
  MANAGED = 'MANAGED',
  /** Condition symptoms are temporarily absent but condition still exists */
  IN_REMISSION = 'IN_REMISSION',
  /** Condition has been cured or permanently resolved */
  RESOLVED = 'RESOLVED',
  /** Condition is being monitored but not yet requiring active treatment */
  UNDER_OBSERVATION = 'UNDER_OBSERVATION'
}

/**
 * Severity levels for chronic conditions
 * Indicates the impact of the condition on daily life and health
 */
export enum ConditionSeverity {
  /** Minimal impact on daily activities */
  MILD = 'MILD',
  /** Noticeable impact requiring regular management */
  MODERATE = 'MODERATE',
  /** Significant impact requiring intensive management */
  SEVERE = 'SEVERE',
  /** Life-threatening or requiring immediate ongoing care */
  CRITICAL = 'CRITICAL'
}

/**
 * Complete chronic condition record entity
 * Represents a long-term health condition requiring ongoing management
 */
export interface ChronicCondition {
  /** Unique identifier for the condition record */
  id: string;
  /** ID of the student with this condition */
  studentId: string;
  /** Name or description of the condition */
  condition: string;
  /** ICD-10 diagnostic code if applicable */
  icdCode?: string;
  /** Date when condition was diagnosed (ISO 8601 format) */
  diagnosedDate: string;
  /** Current status of the condition */
  status: ConditionStatus;
  /** Severity level of the condition */
  severity: ConditionSeverity;
  /** Additional notes about the condition */
  notes?: string;
  /** Detailed care plan for managing the condition */
  carePlan?: string;
  /** List of medications used to manage the condition */
  medications?: string[];
  /** Physical or activity restrictions due to the condition */
  restrictions?: string[];
  /** Known triggers that worsen the condition */
  triggers?: string[];
  /** Name of healthcare provider who diagnosed the condition */
  diagnosedBy?: string;
  /** Date of most recent care plan review (ISO 8601 format) */
  lastReviewDate?: string;
  /** Scheduled date for next care plan review (ISO 8601 format) */
  nextReviewDate?: string;
  /** Emergency response protocol for acute episodes */
  emergencyProtocol?: string;
  /** Whether the condition is currently active (not resolved) */
  isActive: boolean;
  /** Reference to the student */
  student: StudentReference;
  /** Timestamp when record was created (ISO 8601 format) */
  createdAt: string;
  /** Timestamp when record was last updated (ISO 8601 format) */
  updatedAt: string;
}

/**
 * Data required to create a new chronic condition record
 * Excludes system-generated fields like id, timestamps, and student reference
 */
export interface ChronicConditionCreate {
  /** ID of the student with this condition */
  studentId: string;
  /** Name or description of the condition */
  condition: string;
  /** ICD-10 diagnostic code if applicable */
  icdCode?: string;
  /** Date when condition was diagnosed (ISO 8601 format) */
  diagnosedDate: string;
  /** Current status of the condition */
  status: ConditionStatus;
  /** Severity level of the condition */
  severity: ConditionSeverity;
  /** Additional notes about the condition */
  notes?: string;
  /** Detailed care plan for managing the condition */
  carePlan?: string;
  /** List of medications used to manage the condition */
  medications?: string[];
  /** Physical or activity restrictions due to the condition */
  restrictions?: string[];
  /** Known triggers that worsen the condition */
  triggers?: string[];
  /** Name of healthcare provider who diagnosed the condition */
  diagnosedBy?: string;
  /** Scheduled date for next care plan review (ISO 8601 format) */
  nextReviewDate?: string;
  /** Emergency response protocol for acute episodes */
  emergencyProtocol?: string;
}

/**
 * Fields that can be updated on an existing chronic condition record
 * All fields are optional to support partial updates
 */
export interface ChronicConditionUpdate {
  /** Name or description of the condition */
  condition?: string;
  /** ICD-10 diagnostic code if applicable */
  icdCode?: string;
  /** Date when condition was diagnosed (ISO 8601 format) */
  diagnosedDate?: string;
  /** Current status of the condition */
  status?: ConditionStatus;
  /** Severity level of the condition */
  severity?: ConditionSeverity;
  /** Additional notes about the condition */
  notes?: string;
  /** Detailed care plan for managing the condition */
  carePlan?: string;
  /** List of medications used to manage the condition */
  medications?: string[];
  /** Physical or activity restrictions due to the condition */
  restrictions?: string[];
  /** Known triggers that worsen the condition */
  triggers?: string[];
  /** Name of healthcare provider who diagnosed the condition */
  diagnosedBy?: string;
  /** Date of most recent care plan review (ISO 8601 format) */
  lastReviewDate?: string;
  /** Scheduled date for next care plan review (ISO 8601 format) */
  nextReviewDate?: string;
  /** Emergency response protocol for acute episodes */
  emergencyProtocol?: string;
  /** Whether the condition is currently active (not resolved) */
  isActive?: boolean;
}

/**
 * Specialized update for care plan components only
 * Used when updating care plan without modifying other condition details
 */
export interface CarePlanUpdate {
  /** Detailed care plan for managing the condition */
  carePlan: string;
  /** List of medications used to manage the condition */
  medications?: string[];
  /** Physical or activity restrictions due to the condition */
  restrictions?: string[];
  /** Known triggers that worsen the condition */
  triggers?: string[];
  /** Emergency response protocol for acute episodes */
  emergencyProtocol?: string;
  /** Scheduled date for next care plan review (ISO 8601 format) */
  nextReviewDate?: string;
}
