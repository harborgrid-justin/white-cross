/**
 * HIPAA-Compliant Audit Logging System - Configuration
 *
 * Purpose: Centralized configuration for audit logging system
 * HIPAA Requirements:
 * - Define which operations require audit logging
 * - Set criticality levels for different operations
 * - Configure batching and retry behavior
 *
 * Last Updated: 2025-10-21
 */

import {
  AuditConfig,
  AuditAction,
  AuditResourceType,
  AuditSeverity,
} from './types';

/**
 * Default audit service configuration
 * Optimized for HIPAA compliance and performance
 */
export const DEFAULT_AUDIT_CONFIG: AuditConfig = {
  // Batching Configuration
  batchSize: 10, // Send batch after 10 events
  batchInterval: 5000, // Or after 5 seconds, whichever comes first

  // Storage Configuration
  maxLocalStorage: 1000, // Store up to 1000 events locally
  localStorageKey: 'whitecross_audit_queue',

  // Retry Configuration
  maxRetries: 5, // Retry up to 5 times
  retryDelay: 2000, // Start with 2 second delay
  retryBackoff: 2, // Double the delay each retry (exponential backoff)

  // Critical Events - Must be logged immediately, never batched
  criticalActions: [
    // Deletions - must be logged immediately
    AuditAction.DELETE,
    AuditAction.DELETE_HEALTH_RECORD,
    AuditAction.DELETE_ALLERGY,
    AuditAction.DELETE_CHRONIC_CONDITION,
    AuditAction.DELETE_VACCINATION,
    AuditAction.DELETE_SCREENING,
    AuditAction.DELETE_GROWTH_MEASUREMENT,
    AuditAction.DELETE_VITAL_SIGNS,
    AuditAction.DELETE_MEDICATION,
    AuditAction.DELETE_STUDENT,

    // Exports - sensitive operations
    AuditAction.EXPORT,
    AuditAction.EXPORT_HEALTH_RECORDS,
    AuditAction.EXPORT_STUDENT_DATA,
    AuditAction.GENERATE_VACCINATION_REPORT,

    // Access denials - security events
    AuditAction.ACCESS_DENIED,

    // Medication administration - critical for patient safety
    AuditAction.ADMINISTER_MEDICATION,
    AuditAction.REPORT_ADVERSE_REACTION,

    // Sensitive mental health access
    AuditAction.VIEW_STUDENT_MENTAL_HEALTH,
  ],

  criticalSeverities: [
    AuditSeverity.CRITICAL,
    AuditSeverity.HIGH,
  ],

  // PHI Protection
  autoDetectPHI: true,
  phiResourceTypes: [
    AuditResourceType.HEALTH_RECORD,
    AuditResourceType.ALLERGY,
    AuditResourceType.CHRONIC_CONDITION,
    AuditResourceType.VACCINATION,
    AuditResourceType.SCREENING,
    AuditResourceType.GROWTH_MEASUREMENT,
    AuditResourceType.VITAL_SIGNS,
    AuditResourceType.MEDICATION,
    AuditResourceType.STUDENT_MEDICATION,
    AuditResourceType.MEDICATION_LOG,
    AuditResourceType.ADVERSE_REACTION,
    AuditResourceType.STUDENT,
  ],

  // Security
  enableChecksum: true, // Enable checksums for tamper detection
  enableSignature: false, // Signatures not implemented yet

  // Performance
  enableAsync: true, // Don't block the UI
  enableCompression: false, // Not implemented yet

  // Development
  enableDebug: import.meta.env.DEV || false,
  enableConsoleLog: import.meta.env.DEV || false,
};

/**
 * Action to Severity Mapping
 * Defines the default severity level for each audit action
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
 * Resource Type to PHI Flag Mapping
 * Automatically determines if a resource contains PHI
 */
export const RESOURCE_PHI_MAP: Record<AuditResourceType, boolean> = {
  [AuditResourceType.HEALTH_RECORD]: true,
  [AuditResourceType.ALLERGY]: true,
  [AuditResourceType.CHRONIC_CONDITION]: true,
  [AuditResourceType.VACCINATION]: true,
  [AuditResourceType.SCREENING]: true,
  [AuditResourceType.GROWTH_MEASUREMENT]: true,
  [AuditResourceType.VITAL_SIGNS]: true,
  [AuditResourceType.MEDICATION]: true,
  [AuditResourceType.STUDENT_MEDICATION]: true,
  [AuditResourceType.MEDICATION_LOG]: true,
  [AuditResourceType.ADVERSE_REACTION]: true,
  [AuditResourceType.STUDENT]: true,
  [AuditResourceType.EMERGENCY_CONTACT]: true,
  [AuditResourceType.DOCUMENT]: false, // Depends on content
  [AuditResourceType.REPORT]: false, // Depends on content
  [AuditResourceType.EXPORT]: true, // Exports likely contain PHI
  [AuditResourceType.INVENTORY]: false,
};

/**
 * Helper function to determine if an action is critical
 */
export function isCriticalAction(action: AuditAction): boolean {
  return DEFAULT_AUDIT_CONFIG.criticalActions.includes(action);
}

/**
 * Helper function to determine if a severity is critical
 */
export function isCriticalSeverity(severity: AuditSeverity): boolean {
  return DEFAULT_AUDIT_CONFIG.criticalSeverities.includes(severity);
}

/**
 * Helper function to get the default severity for an action
 */
export function getActionSeverity(action: AuditAction): AuditSeverity {
  return ACTION_SEVERITY_MAP[action] || AuditSeverity.MEDIUM;
}

/**
 * Helper function to determine if a resource type contains PHI
 */
export function isResourcePHI(resourceType: AuditResourceType): boolean {
  return RESOURCE_PHI_MAP[resourceType] || false;
}

/**
 * Helper function to determine if immediate flush is required
 */
export function requiresImmediateFlush(action: AuditAction, severity: AuditSeverity): boolean {
  return isCriticalAction(action) || isCriticalSeverity(severity);
}
