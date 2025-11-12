/**
 * Chronic Conditions Type Definitions
 *
 * Types for managing student chronic conditions including:
 * - Chronic condition entities
 * - Condition status and severity levels
 * - Care plan management
 *
 * @module services/modules/healthRecords/types/chronicConditions.types
 */

/**
 * Chronic condition record entity
 */
export interface ChronicCondition {
  id: string;
  studentId: string;
  condition: string;
  icdCode?: string;
  diagnosedDate: string;
  status: ConditionStatus;
  severity: ConditionSeverity;
  notes?: string;
  carePlan?: string;
  medications?: string[];
  restrictions?: string[];
  triggers?: string[];
  diagnosedBy?: string;
  lastReviewDate?: string;
  nextReviewDate?: string;
  emergencyProtocol?: string;
  isActive: boolean;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Chronic condition status enumeration
 */
export enum ConditionStatus {
  ACTIVE = 'ACTIVE',
  MANAGED = 'MANAGED',
  IN_REMISSION = 'IN_REMISSION',
  RESOLVED = 'RESOLVED',
  UNDER_OBSERVATION = 'UNDER_OBSERVATION'
}

/**
 * Condition severity levels
 */
export enum ConditionSeverity {
  MILD = 'MILD',
  MODERATE = 'MODERATE',
  SEVERE = 'SEVERE',
  CRITICAL = 'CRITICAL'
}

/**
 * Data required to create a new chronic condition
 */
export interface ChronicConditionCreate {
  studentId: string;
  condition: string;
  icdCode?: string;
  diagnosedDate: string;
  status: ConditionStatus;
  severity: ConditionSeverity;
  notes?: string;
  carePlan?: string;
  medications?: string[];
  restrictions?: string[];
  triggers?: string[];
  diagnosedBy?: string;
  nextReviewDate?: string;
  emergencyProtocol?: string;
}

/**
 * Data for updating an existing chronic condition
 */
export interface ChronicConditionUpdate {
  condition?: string;
  icdCode?: string;
  diagnosedDate?: string;
  status?: ConditionStatus;
  severity?: ConditionSeverity;
  notes?: string;
  carePlan?: string;
  medications?: string[];
  restrictions?: string[];
  triggers?: string[];
  diagnosedBy?: string;
  lastReviewDate?: string;
  nextReviewDate?: string;
  emergencyProtocol?: string;
  isActive?: boolean;
}

/**
 * Data for updating a care plan
 */
export interface CarePlanUpdate {
  carePlan: string;
  medications?: string[];
  restrictions?: string[];
  triggers?: string[];
  emergencyProtocol?: string;
  nextReviewDate?: string;
}

/**
 * Type alias for backward compatibility
 */
export type CreateChronicConditionRequest = ChronicConditionCreate;
