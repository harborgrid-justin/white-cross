/**
 * @fileoverview HIPAA-Compliant Audit Logging System - Action Type Definitions
 *
 * This module provides enumeration types for audit actions, resource types,
 * severity levels, and status values used throughout the HIPAA-compliant
 * audit logging system.
 *
 * @module AuditActionTypes
 * @version 1.0.0
 * @since 2025-10-21
 *
 * @description
 * The action type enumerations define:
 * - **Audit Actions**: Comprehensive enumeration of all PHI operations
 * - **Resource Types**: All auditable resource categories
 * - **Severity Levels**: Priority classification for audit events
 * - **Status Values**: Operation outcome tracking
 *
 * These types form the fundamental vocabulary of the audit system and are
 * used consistently across all audit operations for HIPAA compliance.
 *
 * @example Basic Usage
 * ```typescript
 * import { AuditAction, AuditResourceType, AuditSeverity, AuditStatus } from './action-types';
 *
 * const event = {
 *   action: AuditAction.VIEW_HEALTH_RECORD,
 *   resourceType: AuditResourceType.HEALTH_RECORD,
 *   severity: AuditSeverity.MEDIUM,
 *   status: AuditStatus.SUCCESS
 * };
 * ```
 *
 * @author Healthcare Development Team
 * @copyright 2025 White Cross Health Systems
 * @license Proprietary - Internal Use Only
 *
 * @requires TypeScript 4.5+
 * @requires HIPAA Compliance Review
 *
 * @see {@link https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html|HIPAA Security Rule}
 * @see {@link https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/index.html|HIPAA Privacy Rule}
 */

// ==========================================
// AUDIT ACTION TYPES
// ==========================================

/**
 * @enum {string} AuditAction
 * @description Comprehensive enumeration of all audit actions covering PHI operations
 * and system interactions. Each action represents a specific operation that requires
 * audit logging for HIPAA compliance.
 *
 * Actions are categorized by:
 * - **CRUD Operations**: CREATE, READ, UPDATE, DELETE
 * - **Access Control**: VIEW, ACCESS_ATTEMPT, ACCESS_DENIED
 * - **PHI Specific**: Health records, allergies, medications, etc.
 * - **Administrative**: Exports, imports, transfers, bulk operations
 *
 * @example
 * ```typescript
 * // Log a health record view
 * await auditService.log({
 *   action: AuditAction.VIEW_HEALTH_RECORD,
 *   resourceType: AuditResourceType.HEALTH_RECORD,
 *   resourceId: 'rec123'
 * });
 * ```
 *
 * @since 1.0.0
 * @readonly
 */
export enum AuditAction {
  // Health Records
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
  PRINT = 'PRINT',

  // Access Control
  VIEW = 'VIEW',
  ACCESS_ATTEMPT = 'ACCESS_ATTEMPT',
  ACCESS_DENIED = 'ACCESS_DENIED',

  // Specific PHI Operations
  VIEW_HEALTH_RECORDS = 'VIEW_HEALTH_RECORDS',
  VIEW_HEALTH_RECORD = 'VIEW_HEALTH_RECORD',
  CREATE_HEALTH_RECORD = 'CREATE_HEALTH_RECORD',
  UPDATE_HEALTH_RECORD = 'UPDATE_HEALTH_RECORD',
  DELETE_HEALTH_RECORD = 'DELETE_HEALTH_RECORD',
  EXPORT_HEALTH_RECORDS = 'EXPORT_HEALTH_RECORDS',
  IMPORT_HEALTH_RECORDS = 'IMPORT_HEALTH_RECORDS',

  // Allergies
  VIEW_ALLERGIES = 'VIEW_ALLERGIES',
  VIEW_ALLERGY = 'VIEW_ALLERGY',
  CREATE_ALLERGY = 'CREATE_ALLERGY',
  UPDATE_ALLERGY = 'UPDATE_ALLERGY',
  DELETE_ALLERGY = 'DELETE_ALLERGY',
  VERIFY_ALLERGY = 'VERIFY_ALLERGY',
  VIEW_CRITICAL_ALLERGIES = 'VIEW_CRITICAL_ALLERGIES',
  CHECK_CONTRAINDICATIONS = 'CHECK_CONTRAINDICATIONS',

  // Chronic Conditions
  VIEW_CHRONIC_CONDITIONS = 'VIEW_CHRONIC_CONDITIONS',
  VIEW_CHRONIC_CONDITION = 'VIEW_CHRONIC_CONDITION',
  CREATE_CHRONIC_CONDITION = 'CREATE_CHRONIC_CONDITION',
  UPDATE_CHRONIC_CONDITION = 'UPDATE_CHRONIC_CONDITION',
  DELETE_CHRONIC_CONDITION = 'DELETE_CHRONIC_CONDITION',
  UPDATE_CONDITION_STATUS = 'UPDATE_CONDITION_STATUS',
  VIEW_ACTIVE_CONDITIONS = 'VIEW_ACTIVE_CONDITIONS',

  // Vaccinations
  VIEW_VACCINATIONS = 'VIEW_VACCINATIONS',
  VIEW_VACCINATION = 'VIEW_VACCINATION',
  CREATE_VACCINATION = 'CREATE_VACCINATION',
  UPDATE_VACCINATION = 'UPDATE_VACCINATION',
  DELETE_VACCINATION = 'DELETE_VACCINATION',
  CHECK_VACCINATION_COMPLIANCE = 'CHECK_VACCINATION_COMPLIANCE',
  VIEW_UPCOMING_VACCINATIONS = 'VIEW_UPCOMING_VACCINATIONS',
  GENERATE_VACCINATION_REPORT = 'GENERATE_VACCINATION_REPORT',

  // Screenings
  VIEW_SCREENINGS = 'VIEW_SCREENINGS',
  VIEW_SCREENING = 'VIEW_SCREENING',
  CREATE_SCREENING = 'CREATE_SCREENING',
  UPDATE_SCREENING = 'UPDATE_SCREENING',
  DELETE_SCREENING = 'DELETE_SCREENING',

  // Growth Measurements
  VIEW_GROWTH_MEASUREMENTS = 'VIEW_GROWTH_MEASUREMENTS',
  VIEW_GROWTH_MEASUREMENT = 'VIEW_GROWTH_MEASUREMENT',
  CREATE_GROWTH_MEASUREMENT = 'CREATE_GROWTH_MEASUREMENT',
  UPDATE_GROWTH_MEASUREMENT = 'UPDATE_GROWTH_MEASUREMENT',
  DELETE_GROWTH_MEASUREMENT = 'DELETE_GROWTH_MEASUREMENT',
  VIEW_GROWTH_TRENDS = 'VIEW_GROWTH_TRENDS',
  VIEW_GROWTH_CONCERNS = 'VIEW_GROWTH_CONCERNS',
  CALCULATE_PERCENTILES = 'CALCULATE_PERCENTILES',

  // Vital Signs
  VIEW_VITAL_SIGNS = 'VIEW_VITAL_SIGNS',
  CREATE_VITAL_SIGNS = 'CREATE_VITAL_SIGNS',
  UPDATE_VITAL_SIGNS = 'UPDATE_VITAL_SIGNS',
  DELETE_VITAL_SIGNS = 'DELETE_VITAL_SIGNS',
  VIEW_LATEST_VITALS = 'VIEW_LATEST_VITALS',
  VIEW_VITAL_TRENDS = 'VIEW_VITAL_TRENDS',

  // Medications
  VIEW_MEDICATIONS = 'VIEW_MEDICATIONS',
  VIEW_MEDICATION = 'VIEW_MEDICATION',
  CREATE_MEDICATION = 'CREATE_MEDICATION',
  UPDATE_MEDICATION = 'UPDATE_MEDICATION',
  DELETE_MEDICATION = 'DELETE_MEDICATION',
  ASSIGN_MEDICATION = 'ASSIGN_MEDICATION',
  ADMINISTER_MEDICATION = 'ADMINISTER_MEDICATION',
  DEACTIVATE_MEDICATION = 'DEACTIVATE_MEDICATION',
  VIEW_MEDICATION_LOGS = 'VIEW_MEDICATION_LOGS',
  VIEW_MEDICATION_SCHEDULE = 'VIEW_MEDICATION_SCHEDULE',
  REPORT_ADVERSE_REACTION = 'REPORT_ADVERSE_REACTION',
  VIEW_ADVERSE_REACTIONS = 'VIEW_ADVERSE_REACTIONS',

  // Inventory
  VIEW_INVENTORY = 'VIEW_INVENTORY',
  UPDATE_INVENTORY = 'UPDATE_INVENTORY',
  ADD_TO_INVENTORY = 'ADD_TO_INVENTORY',

  // Students
  VIEW_STUDENT = 'VIEW_STUDENT',
  VIEW_STUDENTS = 'VIEW_STUDENTS',
  CREATE_STUDENT = 'CREATE_STUDENT',
  UPDATE_STUDENT = 'UPDATE_STUDENT',
  DELETE_STUDENT = 'DELETE_STUDENT',
  DEACTIVATE_STUDENT = 'DEACTIVATE_STUDENT',
  REACTIVATE_STUDENT = 'REACTIVATE_STUDENT',
  TRANSFER_STUDENT = 'TRANSFER_STUDENT',
  EXPORT_STUDENT_DATA = 'EXPORT_STUDENT_DATA',
  VIEW_STUDENT_HEALTH_RECORDS = 'VIEW_STUDENT_HEALTH_RECORDS',
  VIEW_STUDENT_MENTAL_HEALTH = 'VIEW_STUDENT_MENTAL_HEALTH',
  BULK_UPDATE_STUDENTS = 'BULK_UPDATE_STUDENTS',

  // Summary Views
  VIEW_HEALTH_SUMMARY = 'VIEW_HEALTH_SUMMARY',
  VIEW_HEALTH_TIMELINE = 'VIEW_HEALTH_TIMELINE',
}

/**
 * @enum {string} AuditResourceType
 * @description Enumeration of all resource types that can be audited in the system.
 * These types correspond to different data entities and are used to categorize
 * audit events for reporting and compliance tracking.
 *
 * Resource types are automatically mapped to PHI classification based on
 * the RESOURCE_PHI_MAP configuration. PHI resources require additional
 * security measures and audit detail.
 *
 * @example
 * ```typescript
 * // Check if a resource type contains PHI
 * const isPHI = isResourcePHI(AuditResourceType.HEALTH_RECORD); // true
 * const isNotPHI = isResourcePHI(AuditResourceType.INVENTORY); // false
 * ```
 *
 * @since 1.0.0
 * @readonly
 * @see {@link RESOURCE_PHI_MAP} for PHI classification mapping
 */
export enum AuditResourceType {
  HEALTH_RECORD = 'HEALTH_RECORD',
  ALLERGY = 'ALLERGY',
  CHRONIC_CONDITION = 'CHRONIC_CONDITION',
  VACCINATION = 'VACCINATION',
  SCREENING = 'SCREENING',
  GROWTH_MEASUREMENT = 'GROWTH_MEASUREMENT',
  VITAL_SIGNS = 'VITAL_SIGNS',
  MEDICATION = 'MEDICATION',
  STUDENT_MEDICATION = 'STUDENT_MEDICATION',
  MEDICATION_LOG = 'MEDICATION_LOG',
  ADVERSE_REACTION = 'ADVERSE_REACTION',
  INVENTORY = 'INVENTORY',
  STUDENT = 'STUDENT',
  EMERGENCY_CONTACT = 'EMERGENCY_CONTACT',
  DOCUMENT = 'DOCUMENT',
  REPORT = 'REPORT',
  EXPORT = 'EXPORT',
}

/**
 * @enum {string} AuditSeverity
 * @description Severity levels for audit events, determining priority and handling.
 * Higher severity events may trigger immediate alerts, require immediate flush
 * to backend, or demand manual review.
 *
 * **Severity Levels:**
 * - **LOW**: Routine operations, bulk logged
 * - **MEDIUM**: Important operations, normal processing
 * - **HIGH**: Sensitive operations, priority handling
 * - **CRITICAL**: Security events, immediate attention required
 *
 * @example
 * ```typescript
 * // Critical events are flushed immediately
 * const isCritical = isCriticalSeverity(AuditSeverity.CRITICAL); // true
 *
 * // Get default severity for an action
 * const severity = getActionSeverity(AuditAction.DELETE_HEALTH_RECORD); // CRITICAL
 * ```
 *
 * @since 1.0.0
 * @readonly
 * @see {@link ACTION_SEVERITY_MAP} for action-to-severity mapping
 */
export enum AuditSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/**
 * @enum {string} AuditStatus
 * @description Status values indicating the outcome of an audited operation.
 * Used to track both successful operations and various failure modes
 * for compliance reporting and system monitoring.
 *
 * **Status Values:**
 * - **SUCCESS**: Operation completed successfully
 * - **FAILURE**: Operation failed due to business logic or validation
 * - **PENDING**: Operation in progress (async operations)
 * - **QUEUED**: Operation queued for processing
 * - **ERROR**: Technical error occurred during operation
 *
 * @example
 * ```typescript
 * // Log successful operation
 * await auditService.logSuccess({
 *   action: AuditAction.CREATE_ALLERGY,
 *   resourceType: AuditResourceType.ALLERGY,
 *   status: AuditStatus.SUCCESS // automatically set by logSuccess
 * });
 *
 * // Log failed operation
 * await auditService.logFailure(params, error);
 * ```
 *
 * @since 1.0.0
 * @readonly
 */
export enum AuditStatus {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  PENDING = 'PENDING',
  QUEUED = 'QUEUED',
  ERROR = 'ERROR',
}
