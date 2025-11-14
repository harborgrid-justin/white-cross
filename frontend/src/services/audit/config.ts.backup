/**
 * @fileoverview HIPAA-Compliant Audit Logging System - Configuration
 * 
 * This module provides centralized configuration for the audit logging system,
 * defining operational parameters, security settings, and compliance mappings
 * required for HIPAA-compliant healthcare data tracking.
 *
 * @module AuditConfig
 * @version 1.0.0
 * @since 2025-10-21
 * 
 * @description
 * The configuration system manages:
 * - **Performance Tuning**: Batch sizes, intervals, and retry strategies
 * - **Security Settings**: Checksum generation, PHI classification
 * - **Compliance Mapping**: Action severity levels, critical operations
 * - **Development Support**: Debug logging and console output
 * - **Operational Limits**: Storage constraints and retry policies
 * 
 * Key Configuration Areas:
 * - Batching and performance optimization
 * - Critical event identification for immediate processing
 * - PHI resource classification for compliance tracking
 * - Retry mechanisms with exponential backoff
 * - Security features for tamper detection
 * 
 * @example Basic Configuration Usage
 * ```typescript
 * import { DEFAULT_AUDIT_CONFIG, getActionSeverity } from './config';
 * 
 * // Get default configuration
 * const config = DEFAULT_AUDIT_CONFIG;
 * console.log('Batch size:', config.batchSize); // 10
 * 
 * // Check action severity
 * const severity = getActionSeverity(AuditAction.DELETE_HEALTH_RECORD);
 * console.log('Severity:', severity); // 'CRITICAL'
 * ```
 * 
 * @example Custom Configuration
 * ```typescript
 * import { AuditService } from './AuditService';
 * 
 * const customConfig = {
 *   batchSize: 20,
 *   batchInterval: 3000,
 *   enableDebug: true
 * };
 * 
 * const auditService = new AuditService(customConfig);
 * ```
 * 
 * @author Healthcare Development Team
 * @copyright 2025 White Cross Health Systems
 * @license Proprietary - Internal Use Only
 * 
 * @requires HIPAA Compliance Review
 * @requires Security Team Approval for Production Changes
 * 
 * @see {@link AuditConfig} for configuration interface
 * @see {@link AuditService} for service implementation
 * @see {@link https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html|HIPAA Security Rule}
 */

import {
  AuditConfig,
  AuditAction,
  AuditResourceType,
  AuditSeverity,
} from './types';

/**
 * @constant {AuditConfig} DEFAULT_AUDIT_CONFIG
 * @description Default configuration for the audit service, optimized for HIPAA
 * compliance, performance, and security in healthcare environments.
 * 
 * This configuration balances:
 * - **Performance**: Efficient batching to minimize backend calls
 * - **Compliance**: Immediate processing of critical events
 * - **Reliability**: Robust retry mechanisms with exponential backoff
 * - **Security**: Tamper detection and PHI protection
 * - **Development**: Debug support and console logging
 * 
 * **Batching Strategy:**
 * - Batch size of 10 events for optimal network utilization
 * - 5-second interval to prevent indefinite queuing
 * - Critical events bypass batching for immediate compliance
 * 
 * **Retry Strategy:**
 * - Up to 5 retry attempts with exponential backoff
 * - Starting delay of 2 seconds, doubling each retry
 * - Local storage backup for offline resilience
 * 
 * **Security Features:**
 * - Checksum generation for tamper detection
 * - Automatic PHI classification
 * - Critical action identification
 * 
 * @example Accessing Configuration
 * ```typescript
 * import { DEFAULT_AUDIT_CONFIG } from './config';
 * 
 * console.log('Batch size:', DEFAULT_AUDIT_CONFIG.batchSize); // 10
 * console.log('Retry delay:', DEFAULT_AUDIT_CONFIG.retryDelay); // 2000ms
 * console.log('Debug enabled:', DEFAULT_AUDIT_CONFIG.enableDebug); // true in dev
 * ```
 * 
 * @example Custom Configuration Override
 * ```typescript
 * import { AuditService } from './AuditService';
 * import { DEFAULT_AUDIT_CONFIG } from './config';
 * 
 * const customConfig = {
 *   ...DEFAULT_AUDIT_CONFIG,
 *   batchSize: 25,        // Larger batches for high-volume
 *   batchInterval: 3000,  // More frequent flushes
 *   enableDebug: true     // Force debug in production
 * };
 * 
 * const service = new AuditService(customConfig);
 * ```
 * 
 * @since 1.0.0
 * @readonly
 * @see {@link AuditConfig} for configuration interface details
 * @see {@link AuditService} for service implementation
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
  enableDebug: process.env.NODE_ENV === 'development' || false,
  enableConsoleLog: process.env.NODE_ENV === 'development' || false,
};

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
 * import { ACTION_SEVERITY_MAP, AuditAction } from './config';
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
 * import { ACTION_SEVERITY_MAP, AuditSeverity } from './config';
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
 * @constant {Record<AuditResourceType, boolean>} RESOURCE_PHI_MAP
 * @description Mapping of resource types to their PHI (Protected Health Information)
 * classification status. This mapping enables automatic PHI detection and ensures
 * appropriate handling of sensitive healthcare data under HIPAA regulations.
 * 
 * **PHI Classification Logic:**
 * - **true**: Resource contains or may contain PHI data
 * - **false**: Resource does not typically contain PHI data
 * - **Context-dependent**: Documents and reports may contain PHI based on content
 * 
 * **HIPAA PHI Definition:**
 * PHI includes any individually identifiable health information held or transmitted
 * by a covered entity or business associate, including:
 * - Health records, allergies, conditions, medications
 * - Student health information and emergency contacts
 * - Growth measurements, vital signs, screening results
 * - Medical history, treatment records, and care plans
 * 
 * **System Impact:**
 * - Automatic isPHI flag setting during audit event creation
 * - Enhanced security measures for PHI resources
 * - Specialized audit trails for compliance reporting
 * - Access control and authorization enforcement
 * 
 * @example PHI Classification Check
 * ```typescript
 * import { RESOURCE_PHI_MAP, AuditResourceType } from './config';
 * 
 * const isHealthRecordPHI = RESOURCE_PHI_MAP[AuditResourceType.HEALTH_RECORD];
 * console.log(isHealthRecordPHI); // true
 * 
 * const isInventoryPHI = RESOURCE_PHI_MAP[AuditResourceType.INVENTORY];
 * console.log(isInventoryPHI); // false
 * ```
 * 
 * @example Finding All PHI Resources
 * ```typescript
 * import { RESOURCE_PHI_MAP } from './config';
 * 
 * const phiResources = Object.entries(RESOURCE_PHI_MAP)
 *   .filter(([_, isPHI]) => isPHI)
 *   .map(([resourceType, _]) => resourceType);
 * 
 * console.log('PHI resource types:', phiResources);
 * ```
 * 
 * @since 1.0.0
 * @readonly
 * @see {@link isResourcePHI} for helper function
 * @see {@link https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/index.html|HIPAA Privacy Rule}
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
 * @function isCriticalAction
 * @description Determines if an audit action is classified as critical and requires
 * immediate processing. Critical actions bypass normal batching mechanisms and are
 * sent to the backend immediately for compliance and security reasons.
 * 
 * **Critical Action Categories:**
 * - **Deletions**: Irreversible data operations
 * - **Exports**: Sensitive data extraction operations
 * - **Security Events**: Access denials and security violations
 * - **Patient Safety**: Medication administration and adverse reactions
 * - **Mental Health**: Sensitive mental health data access
 * 
 * @param {AuditAction} action - The audit action to evaluate
 * @returns {boolean} True if the action is critical, false otherwise
 * 
 * @example Check Critical Actions
 * ```typescript
 * import { isCriticalAction, AuditAction } from './config';
 * 
 * const isDeleteCritical = isCriticalAction(AuditAction.DELETE_HEALTH_RECORD);
 * console.log(isDeleteCritical); // true
 * 
 * const isViewCritical = isCriticalAction(AuditAction.VIEW_STUDENT);
 * console.log(isViewCritical); // false
 * ```
 * 
 * @example Conditional Processing
 * ```typescript
 * if (isCriticalAction(action)) {
 *   await auditService.flush(); // Immediate send
 * } else {
 *   // Normal batching process
 * }
 * ```
 * 
 * @since 1.0.0
 * @see {@link DEFAULT_AUDIT_CONFIG.criticalActions} for the complete list
 * @see {@link requiresImmediateFlush} for combined action/severity checking
 */
export function isCriticalAction(action: AuditAction): boolean {
  return DEFAULT_AUDIT_CONFIG.criticalActions.includes(action);
}

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
 * import { isCriticalSeverity, AuditSeverity } from './config';
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
 * import { getActionSeverity, AuditAction } from './config';
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

/**
 * @function isResourcePHI
 * @description Determines if a resource type contains Protected Health Information (PHI)
 * according to HIPAA regulations. This classification affects security handling,
 * audit requirements, and access control policies.
 * 
 * **PHI Determination Logic:**
 * - Uses RESOURCE_PHI_MAP for predefined classifications
 * - Defaults to false for unknown resource types (conservative approach)
 * - Supports context-dependent resources (documents, reports)
 * 
 * **HIPAA Compliance Impact:**
 * - PHI resources require enhanced audit trails
 * - Additional security measures and access controls
 * - Specialized reporting and retention policies
 * - Breach notification requirements
 * 
 * @param {AuditResourceType} resourceType - The resource type to evaluate
 * @returns {boolean} True if the resource type contains PHI, false otherwise
 * 
 * @example PHI Classification
 * ```typescript
 * import { isResourcePHI, AuditResourceType } from './config';
 * 
 * const isHealthRecordPHI = isResourcePHI(AuditResourceType.HEALTH_RECORD);
 * console.log(isHealthRecordPHI); // true
 * 
 * const isInventoryPHI = isResourcePHI(AuditResourceType.INVENTORY);
 * console.log(isInventoryPHI); // false
 * ```
 * 
 * @example Conditional Security Handling
 * ```typescript
 * function handleResourceAccess(resourceType: AuditResourceType) {
 *   if (isResourcePHI(resourceType)) {
 *     // Enhanced security measures
 *     await validateHIPAACompliance();
 *     await logDetailedAuditTrail();
 *   } else {
 *     // Standard access logging
 *     await logBasicAccess();
 *   }
 * }
 * ```
 * 
 * @example Automatic PHI Flagging
 * ```typescript
 * function createAuditEvent(params: AuditLogParams) {
 *   return {
 *     ...params,
 *     isPHI: params.isPHI ?? isResourcePHI(params.resourceType),
 *     // ... other fields
 *   };
 * }
 * ```
 * 
 * @since 1.0.0
 * @see {@link RESOURCE_PHI_MAP} for complete resource classification
 * @see {@link https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/index.html|HIPAA Privacy Rule}
 */
export function isResourcePHI(resourceType: AuditResourceType): boolean {
  return RESOURCE_PHI_MAP[resourceType] || false;
}

/**
 * @function requiresImmediateFlush
 * @description Determines if an audit event requires immediate processing based on
 * either the action type or severity level. This function combines critical action
 * and critical severity checks to ensure comprehensive immediate processing logic.
 * 
 * **Immediate Flush Triggers:**
 * - Critical action types (deletions, exports, security events)
 * - Critical severity levels (CRITICAL, HIGH)
 * - Patient safety operations (medication administration)
 * - Compliance-sensitive operations (PHI access, mental health)
 * 
 * **System Impact:**
 * - Bypasses normal batching mechanisms
 * - Triggers immediate backend transmission
 * - Ensures real-time compliance monitoring
 * - Supports audit trail integrity
 * 
 * @param {AuditAction} action - The audit action being performed
 * @param {AuditSeverity} severity - The severity level of the event
 * @returns {boolean} True if immediate flush is required, false otherwise
 * 
 * @example Check Immediate Flush Requirements
 * ```typescript
 * import { requiresImmediateFlush, AuditAction, AuditSeverity } from './config';
 * 
 * // Critical action - requires immediate flush
 * const deleteRequiresFlush = requiresImmediateFlush(
 *   AuditAction.DELETE_HEALTH_RECORD,
 *   AuditSeverity.CRITICAL
 * );
 * console.log(deleteRequiresFlush); // true
 * 
 * // Regular action with low severity - normal batching
 * const viewRequiresFlush = requiresImmediateFlush(
 *   AuditAction.VIEW_STUDENT,
 *   AuditSeverity.LOW
 * );
 * console.log(viewRequiresFlush); // false
 * 
 * // Regular action but critical severity - requires immediate flush
 * const highSeverityFlush = requiresImmediateFlush(
 *   AuditAction.VIEW_STUDENT,
 *   AuditSeverity.CRITICAL
 * );
 * console.log(highSeverityFlush); // true
 * ```
 * 
 * @example Audit Service Usage
 * ```typescript
 * async function processAuditEvent(event: AuditEvent) {
 *   if (requiresImmediateFlush(event.action, event.severity)) {
 *     await auditService.flush(); // Send immediately
 *     console.log('Critical event sent immediately');
 *   } else {
 *     // Event added to batch for later processing
 *     console.log('Event queued for batch processing');
 *   }
 * }
 * ```
 * 
 * @since 1.0.0
 * @see {@link isCriticalAction} for action-based critical determination
 * @see {@link isCriticalSeverity} for severity-based critical determination
 * @see {@link AuditService.queueEvent} for implementation usage
 */
export function requiresImmediateFlush(action: AuditAction, severity: AuditSeverity): boolean {
  return isCriticalAction(action) || isCriticalSeverity(severity);
}
