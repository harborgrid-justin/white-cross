/**
 * @fileoverview HIPAA-Compliant Audit Logging System - Severity Classification
 *
 * This module provides severity classification for audit actions, including comprehensive
 * mappings and utility functions to determine the priority and criticality of audit events.
 *
 * @module AuditConfig/Severity
 * @version 1.0.0
 * @since 2025-10-21
 *
 * @description
 * The severity classification system manages:
 * - **Action-to-Severity Mapping**: Comprehensive mapping of all audit actions to severity levels
 * - **Severity Evaluation**: Utility functions to assess severity criticality
 * - **Priority Determination**: Automated priority assignment for audit processing
 * - **Compliance Support**: Severity-based compliance reporting and alerting
 *
 * Severity Levels:
 * - **CRITICAL**: Irreversible operations, security events, patient safety
 * - **HIGH**: PHI modifications, administrative operations, sensitive access
 * - **MEDIUM**: Important operations, trend analysis, compliance checks
 * - **LOW**: Routine access, read operations, basic queries
 *
 * @example Getting Action Severity
 * ```typescript
 * import { getActionSeverity, AuditAction } from './config.severity';
 *
 * const severity = getActionSeverity(AuditAction.DELETE_HEALTH_RECORD);
 * console.log(severity); // 'CRITICAL'
 * ```
 *
 * @example Checking Critical Severity
 * ```typescript
 * import { isCriticalSeverity, AuditSeverity } from './config.severity';
 *
 * if (isCriticalSeverity(AuditSeverity.CRITICAL)) {
 *   await priorityQueue.add(event);
 * }
 * ```
 *
 * @author Healthcare Development Team
 * @copyright 2025 White Cross Health Systems
 * @license Proprietary - Internal Use Only
 *
 * @requires HIPAA Compliance Review
 *
 * @see {@link AuditSeverity} for severity level definitions
 * @see {@link AuditAction} for audit action types
 */

import {
  AuditAction,
  AuditSeverity,
} from './types';
import { DEFAULT_AUDIT_CONFIG } from './config.defaults';

/**
 * @constant {Record<AuditAction, AuditSeverity>} ACTION_SEVERITY_MAP
 * @description Comprehensive mapping of audit actions to their default severity levels.
 * This mapping ensures consistent severity classification across the system and
 * supports automated critical event detection for HIPAA compliance.
 *
 * **Severity Classification:**
 * - **CRITICAL**: Irreversible operations, security events, patient safety
 * - **HIGH**: PHI modifications, administrative operations, sensitive access
 * - **MEDIUM**: Important operations, trend analysis, compliance checks
 * - **LOW**: Routine access, read operations, basic queries
 *
 * **Usage in System:**
 * - Automatic severity assignment during audit event creation
 * - Critical event detection for immediate processing
 * - Compliance reporting and alerting thresholds
 * - Priority-based processing and storage
 *
 * **Critical Operations Include:**
 * - All deletion operations (irreversible data loss)
 * - Medication administration (patient safety)
 * - Access denial events (security incidents)
 * - Adverse reaction reporting (patient safety)
 *
 * @example Getting Action Severity
 * ```typescript
 * import { ACTION_SEVERITY_MAP, AuditAction } from './config.severity';
 *
 * const deleteAction = ACTION_SEVERITY_MAP[AuditAction.DELETE_HEALTH_RECORD];
 * console.log(deleteAction); // 'CRITICAL'
 *
 * const viewAction = ACTION_SEVERITY_MAP[AuditAction.VIEW_STUDENT];
 * console.log(viewAction); // 'LOW'
 * ```
 *
 * @example Filtering Critical Actions
 * ```typescript
 * import { ACTION_SEVERITY_MAP, AuditSeverity } from './config.severity';
 *
 * const criticalActions = Object.entries(ACTION_SEVERITY_MAP)
 *   .filter(([_, severity]) => severity === AuditSeverity.CRITICAL)
 *   .map(([action, _]) => action);
 *
 * console.log('Critical actions:', criticalActions);
 * ```
 *
 * @since 1.0.0
 * @readonly
 * @see {@link getActionSeverity} for helper function
 * @see {@link AuditSeverity} for severity level definitions
 */
export const ACTION_SEVERITY_MAP: Record<AuditAction, AuditSeverity> = {
  // Critical Operations - CRITICAL severity
  [AuditAction.DELETE]: AuditSeverity.CRITICAL,
  [AuditAction.DELETE_HEALTH_RECORD]: AuditSeverity.CRITICAL,
  [AuditAction.DELETE_ALLERGY]: AuditSeverity.CRITICAL,
  [AuditAction.DELETE_CHRONIC_CONDITION]: AuditSeverity.CRITICAL,
  [AuditAction.DELETE_VACCINATION]: AuditSeverity.CRITICAL,
  [AuditAction.DELETE_SCREENING]: AuditSeverity.CRITICAL,
  [AuditAction.DELETE_GROWTH_MEASUREMENT]: AuditSeverity.CRITICAL,
  [AuditAction.DELETE_VITAL_SIGNS]: AuditSeverity.CRITICAL,
  [AuditAction.DELETE_MEDICATION]: AuditSeverity.CRITICAL,
  [AuditAction.DELETE_STUDENT]: AuditSeverity.CRITICAL,
  [AuditAction.ADMINISTER_MEDICATION]: AuditSeverity.CRITICAL,
  [AuditAction.REPORT_ADVERSE_REACTION]: AuditSeverity.CRITICAL,
  [AuditAction.ACCESS_DENIED]: AuditSeverity.CRITICAL,

  // High Priority Operations - HIGH severity
  [AuditAction.CREATE]: AuditSeverity.HIGH,
  [AuditAction.UPDATE]: AuditSeverity.HIGH,
  [AuditAction.EXPORT]: AuditSeverity.HIGH,
  [AuditAction.CREATE_HEALTH_RECORD]: AuditSeverity.HIGH,
  [AuditAction.UPDATE_HEALTH_RECORD]: AuditSeverity.HIGH,
  [AuditAction.EXPORT_HEALTH_RECORDS]: AuditSeverity.HIGH,
  [AuditAction.IMPORT_HEALTH_RECORDS]: AuditSeverity.HIGH,
  [AuditAction.CREATE_ALLERGY]: AuditSeverity.HIGH,
  [AuditAction.UPDATE_ALLERGY]: AuditSeverity.HIGH,
  [AuditAction.VERIFY_ALLERGY]: AuditSeverity.HIGH,
  [AuditAction.CREATE_CHRONIC_CONDITION]: AuditSeverity.HIGH,
  [AuditAction.UPDATE_CHRONIC_CONDITION]: AuditSeverity.HIGH,
  [AuditAction.CREATE_VACCINATION]: AuditSeverity.HIGH,
  [AuditAction.UPDATE_VACCINATION]: AuditSeverity.HIGH,
  [AuditAction.CREATE_MEDICATION]: AuditSeverity.HIGH,
  [AuditAction.UPDATE_MEDICATION]: AuditSeverity.HIGH,
  [AuditAction.ASSIGN_MEDICATION]: AuditSeverity.HIGH,
  [AuditAction.DEACTIVATE_MEDICATION]: AuditSeverity.HIGH,
  [AuditAction.CREATE_STUDENT]: AuditSeverity.HIGH,
  [AuditAction.UPDATE_STUDENT]: AuditSeverity.HIGH,
  [AuditAction.DEACTIVATE_STUDENT]: AuditSeverity.HIGH,
  [AuditAction.REACTIVATE_STUDENT]: AuditSeverity.HIGH,
  [AuditAction.TRANSFER_STUDENT]: AuditSeverity.HIGH,
  [AuditAction.EXPORT_STUDENT_DATA]: AuditSeverity.HIGH,
  [AuditAction.BULK_UPDATE_STUDENTS]: AuditSeverity.HIGH,
  [AuditAction.VIEW_STUDENT_MENTAL_HEALTH]: AuditSeverity.HIGH,
  [AuditAction.GENERATE_VACCINATION_REPORT]: AuditSeverity.HIGH,
  [AuditAction.UPDATE_CONDITION_STATUS]: AuditSeverity.HIGH,

  // Medium Priority Operations - MEDIUM severity
  [AuditAction.VIEW_CRITICAL_ALLERGIES]: AuditSeverity.MEDIUM,
  [AuditAction.CHECK_CONTRAINDICATIONS]: AuditSeverity.MEDIUM,
  [AuditAction.CHECK_VACCINATION_COMPLIANCE]: AuditSeverity.MEDIUM,
  [AuditAction.VIEW_UPCOMING_VACCINATIONS]: AuditSeverity.MEDIUM,
  [AuditAction.CREATE_SCREENING]: AuditSeverity.MEDIUM,
  [AuditAction.UPDATE_SCREENING]: AuditSeverity.MEDIUM,
  [AuditAction.CREATE_GROWTH_MEASUREMENT]: AuditSeverity.MEDIUM,
  [AuditAction.UPDATE_GROWTH_MEASUREMENT]: AuditSeverity.MEDIUM,
  [AuditAction.CREATE_VITAL_SIGNS]: AuditSeverity.MEDIUM,
  [AuditAction.UPDATE_VITAL_SIGNS]: AuditSeverity.MEDIUM,
  [AuditAction.VIEW_GROWTH_TRENDS]: AuditSeverity.MEDIUM,
  [AuditAction.VIEW_GROWTH_CONCERNS]: AuditSeverity.MEDIUM,
  [AuditAction.CALCULATE_PERCENTILES]: AuditSeverity.MEDIUM,
  [AuditAction.VIEW_VITAL_TRENDS]: AuditSeverity.MEDIUM,
  [AuditAction.VIEW_MEDICATION_SCHEDULE]: AuditSeverity.MEDIUM,
  [AuditAction.VIEW_ADVERSE_REACTIONS]: AuditSeverity.MEDIUM,
  [AuditAction.UPDATE_INVENTORY]: AuditSeverity.MEDIUM,
  [AuditAction.ADD_TO_INVENTORY]: AuditSeverity.MEDIUM,
  [AuditAction.VIEW_STUDENT_HEALTH_RECORDS]: AuditSeverity.MEDIUM,
  [AuditAction.IMPORT]: AuditSeverity.MEDIUM,
  [AuditAction.PRINT]: AuditSeverity.MEDIUM,

  // Low Priority Operations - LOW severity
  [AuditAction.READ]: AuditSeverity.LOW,
  [AuditAction.VIEW]: AuditSeverity.LOW,
  [AuditAction.ACCESS_ATTEMPT]: AuditSeverity.LOW,
  [AuditAction.VIEW_HEALTH_RECORDS]: AuditSeverity.LOW,
  [AuditAction.VIEW_HEALTH_RECORD]: AuditSeverity.LOW,
  [AuditAction.VIEW_ALLERGIES]: AuditSeverity.LOW,
  [AuditAction.VIEW_ALLERGY]: AuditSeverity.LOW,
  [AuditAction.VIEW_CHRONIC_CONDITIONS]: AuditSeverity.LOW,
  [AuditAction.VIEW_CHRONIC_CONDITION]: AuditSeverity.LOW,
  [AuditAction.VIEW_ACTIVE_CONDITIONS]: AuditSeverity.LOW,
  [AuditAction.VIEW_VACCINATIONS]: AuditSeverity.LOW,
  [AuditAction.VIEW_VACCINATION]: AuditSeverity.LOW,
  [AuditAction.VIEW_SCREENINGS]: AuditSeverity.LOW,
  [AuditAction.VIEW_SCREENING]: AuditSeverity.LOW,
  [AuditAction.VIEW_GROWTH_MEASUREMENTS]: AuditSeverity.LOW,
  [AuditAction.VIEW_GROWTH_MEASUREMENT]: AuditSeverity.LOW,
  [AuditAction.VIEW_VITAL_SIGNS]: AuditSeverity.LOW,
  [AuditAction.VIEW_LATEST_VITALS]: AuditSeverity.LOW,
  [AuditAction.VIEW_HEALTH_SUMMARY]: AuditSeverity.LOW,
  [AuditAction.VIEW_HEALTH_TIMELINE]: AuditSeverity.LOW,
  [AuditAction.VIEW_MEDICATIONS]: AuditSeverity.LOW,
  [AuditAction.VIEW_MEDICATION]: AuditSeverity.LOW,
  [AuditAction.VIEW_MEDICATION_LOGS]: AuditSeverity.LOW,
  [AuditAction.VIEW_INVENTORY]: AuditSeverity.LOW,
  [AuditAction.VIEW_STUDENT]: AuditSeverity.LOW,
  [AuditAction.VIEW_STUDENTS]: AuditSeverity.LOW,
};

/**
 * @function isCriticalSeverity
 * @description Determines if an audit severity level is classified as critical
 * and requires immediate processing. Critical severities trigger immediate
 * flush operations regardless of the specific action type.
 *
 * **Critical Severity Levels:**
 * - **CRITICAL**: Security events, system failures, compliance violations
 * - **HIGH**: Important operations requiring priority handling
 *
 * @param {AuditSeverity} severity - The audit severity to evaluate
 * @returns {boolean} True if the severity is critical, false otherwise
 *
 * @example Check Critical Severities
 * ```typescript
 * import { isCriticalSeverity, AuditSeverity } from './config.severity';
 *
 * const isCritical = isCriticalSeverity(AuditSeverity.CRITICAL);
 * console.log(isCritical); // true
 *
 * const isLowCritical = isCriticalSeverity(AuditSeverity.LOW);
 * console.log(isLowCritical); // false
 * ```
 *
 * @example Priority Processing
 * ```typescript
 * const event = createAuditEvent(params);
 * if (isCriticalSeverity(event.severity)) {
 *   await priorityQueue.add(event);
 * } else {
 *   await normalQueue.add(event);
 * }
 * ```
 *
 * @since 1.0.0
 * @see {@link DEFAULT_AUDIT_CONFIG.criticalSeverities} for configured levels
 * @see {@link requiresImmediateFlush} for combined action/severity checking
 */
export function isCriticalSeverity(severity: AuditSeverity): boolean {
  return DEFAULT_AUDIT_CONFIG.criticalSeverities.includes(severity);
}

/**
 * @function getActionSeverity
 * @description Retrieves the default severity level for a given audit action.
 * This function provides consistent severity classification across the system
 * and supports automated priority handling and compliance reporting.
 *
 * **Severity Assignment Logic:**
 * - Uses ACTION_SEVERITY_MAP for predefined mappings
 * - Defaults to MEDIUM severity for unmapped actions
 * - Ensures consistent classification across the application
 *
 * **Use Cases:**
 * - Automatic severity assignment during event creation
 * - Priority-based processing and storage
 * - Compliance reporting and alerting
 * - Resource allocation for audit processing
 *
 * @param {AuditAction} action - The audit action to get severity for
 * @returns {AuditSeverity} The default severity level for the action
 *
 * @example Get Action Severities
 * ```typescript
 * import { getActionSeverity, AuditAction } from './config.severity';
 *
 * const deleteSeverity = getActionSeverity(AuditAction.DELETE_HEALTH_RECORD);
 * console.log(deleteSeverity); // 'CRITICAL'
 *
 * const viewSeverity = getActionSeverity(AuditAction.VIEW_STUDENT);
 * console.log(viewSeverity); // 'LOW'
 *
 * const unknownSeverity = getActionSeverity('UNKNOWN_ACTION' as AuditAction);
 * console.log(unknownSeverity); // 'MEDIUM' (default)
 * ```
 *
 * @example Automated Event Creation
 * ```typescript
 * function createAuditEvent(action: AuditAction, resourceType: AuditResourceType) {
 *   return {
 *     action,
 *     resourceType,
 *     severity: getActionSeverity(action), // Automatic severity assignment
 *     timestamp: new Date().toISOString(),
 *     // ... other fields
 *   };
 * }
 * ```
 *
 * @since 1.0.0
 * @see {@link ACTION_SEVERITY_MAP} for complete action-to-severity mapping
 * @see {@link AuditSeverity} for severity level definitions
 */
export function getActionSeverity(action: AuditAction): AuditSeverity {
  return ACTION_SEVERITY_MAP[action] || AuditSeverity.MEDIUM;
}
