/**
 * File: /reuse/clinic/composites/shared-types.ts
 * Locator: WC-CLINIC-SHARED-TYPES-001
 * Purpose: Shared TypeScript interfaces and types for clinic composites
 *
 * Provides strict typing to replace 'any' types across all clinic composite files.
 * Ensures type safety, better IntelliSense, and compile-time error detection.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Vital signs measurement data
 * Replaces: any (used in patient-care-services, medication-administration)
 */
export interface VitalSignsData {
  /** Temperature in Fahrenheit (90-110°F) */
  temperature?: number;

  /** Heart rate in beats per minute (30-250 bpm) */
  heartRate?: number;

  /** Blood pressure in format "systolic/diastolic" (e.g., "120/80") */
  bloodPressure?: string;

  /** Respiratory rate in breaths per minute (8-60) */
  respiratoryRate?: number;

  /** Oxygen saturation percentage (50-100%) */
  oxygenSaturation?: number;

  /** Pain level on scale of 0-10 */
  painLevel?: number;

  /** Weight in pounds */
  weight?: number;

  /** Height in inches */
  height?: number;

  /** Timestamp when vitals were taken */
  recordedAt?: Date;
}

/**
 * Audit trail change entry
 * Replaces: Record<string, any> (used in audit-compliance, medication-administration)
 */
export interface AuditChangeEntry {
  readonly field: string;
  readonly oldValue: string | number | boolean | null;
  readonly newValue: string | number | boolean | null;
  readonly changedAt: Date;
  readonly changedBy: string;
}

/**
 * Required medication specification
 * Replaces: any[] (used in patient-care-services, medication-administration)
 */
export interface RequiredMedication {
  medicationName: string;
  dosage: string;
  frequency: string;
  storageLocation: string;
  routeOfAdministration?: 'oral' | 'inhaled' | 'topical' | 'injected' | 'other';
  specialInstructions?: string;
}

/**
 * Appointment metadata
 * Replaces: Record<string, any> (used in appointment-scheduling)
 */
export interface AppointmentMetadata {
  createdBy: string;
  createdAt: Date;
  lastModifiedBy?: string;
  lastModifiedAt?: Date;
  cancellationReason?: string;
  rescheduleCount?: number;
  source?: 'nurse' | 'parent' | 'student' | 'admin' | 'system';
  tags?: string[];
}

/**
 * Audit log metadata
 * Replaces: Record<string, unknown> (used in audit-compliance)
 */
export interface AuditMetadata {
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  requestId?: string;
  duration?: number;
  httpMethod?: string;
  httpPath?: string;
  httpStatusCode?: number;
}

/**
 * Compliance metrics data
 * Replaces: any (used in audit-compliance)
 */
export interface ComplianceMetrics {
  totalRecords: number;
  compliantRecords: number;
  nonCompliantRecords: number;
  complianceRate: number;
  violations: Array<{
    violationType: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    count: number;
  }>;
  lastAuditDate: Date;
  nextAuditDue: Date;
}

/**
 * Generic query result wrapper
 * Replaces: any (used in data-archival-queries)
 */
export interface QueryResult<T> {
  data: T[];
  total: number;
  page?: number;
  pageSize?: number;
  hasMore?: boolean;
}

/**
 * Typed where clause for Sequelize queries
 * Replaces: any (used in patient-care-services, medication-administration)
 */
export interface WhereClause {
  [key: string]: string | number | boolean | Date | null | {
    [op: string]: any;
  };
}

/**
 * Generic search parameters
 */
export interface SearchParams {
  searchTerm?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
  filters?: Record<string, string | number | boolean>;
}

/**
 * Medication dosage calculation result
 */
export interface DosageCalculationResult {
  isValid: boolean;
  calculatedDosage: string;
  warnings: string[];
  requiresPhysicianReview: boolean;
  calculationMethod: string;
}

/**
 * Generic pagination result
 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Type guard to check if value is VitalSignsData
 */
export function isVitalSignsData(value: unknown): value is VitalSignsData {
  if (!value || typeof value !== 'object') return false;
  const vs = value as Partial<VitalSignsData>;

  // At least one vital sign field should be present
  return (
    vs.temperature !== undefined ||
    vs.heartRate !== undefined ||
    vs.bloodPressure !== undefined ||
    vs.respiratoryRate !== undefined ||
    vs.oxygenSaturation !== undefined ||
    vs.painLevel !== undefined
  );
}

/**
 * Type guard to check if value is AuditChangeEntry array
 */
export function isAuditChangeEntryArray(value: unknown): value is ReadonlyArray<AuditChangeEntry> {
  if (!Array.isArray(value)) return false;
  if (value.length === 0) return true;

  const firstEntry = value[0] as Partial<AuditChangeEntry>;
  return (
    typeof firstEntry.field === 'string' &&
    firstEntry.changedAt instanceof Date
  );
}

/**
 * Type guard to check if value is RequiredMedication array
 */
export function isRequiredMedicationArray(value: unknown): value is RequiredMedication[] {
  if (!Array.isArray(value)) return false;
  if (value.length === 0) return true;

  const firstMed = value[0] as Partial<RequiredMedication>;
  return (
    typeof firstMed.medicationName === 'string' &&
    typeof firstMed.dosage === 'string' &&
    typeof firstMed.frequency === 'string'
  );
}

// Re-export for convenience
export default {
  isVitalSignsData,
  isAuditChangeEntryArray,
  isRequiredMedicationArray,
};
