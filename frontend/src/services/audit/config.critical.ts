/**
 * @fileoverview HIPAA-Compliant Audit Logging System - Critical Event Determination
 *
 * This module provides utilities for determining critical audit events that require
 * immediate processing, bypassing normal batching mechanisms for HIPAA compliance
 * and patient safety.
 *
 * @module AuditConfig/Critical
 * @version 1.0.0
 * @since 2025-10-21
 *
 * @description
 * The critical event determination system manages:
 * - **Critical Action Identification**: Determines if an action is critical
 * - **Immediate Processing**: Ensures critical events bypass batching
 * - **Combined Evaluation**: Checks both action type and severity level
 * - **Compliance Support**: Real-time monitoring for HIPAA compliance
 *
 * Critical Event Categories:
 * - **Deletions**: Irreversible data operations
 * - **Exports**: Sensitive data extraction operations
 * - **Security Events**: Access denials and security violations
 * - **Patient Safety**: Medication administration and adverse reactions
 * - **Mental Health**: Sensitive mental health data access
 *
 * @example Check Critical Actions
 * ```typescript
 * import { isCriticalAction, AuditAction } from './config.critical';
 *
 * const isDeleteCritical = isCriticalAction(AuditAction.DELETE_HEALTH_RECORD);
 * console.log(isDeleteCritical); // true
 * ```
 *
 * @example Immediate Flush Requirements
 * ```typescript
 * import { requiresImmediateFlush } from './config.critical';
 *
 * if (requiresImmediateFlush(action, severity)) {
 *   await auditService.flush(); // Send immediately
 * }
 * ```
 *
 * @author Healthcare Development Team
 * @copyright 2025 White Cross Health Systems
 * @license Proprietary - Internal Use Only
 *
 * @requires HIPAA Compliance Review
 *
 * @see {@link AuditAction} for audit action types
 * @see {@link AuditSeverity} for severity level definitions
 */

import { AuditAction, AuditSeverity } from './types';
import { DEFAULT_AUDIT_CONFIG } from './config.defaults';
import { isCriticalSeverity } from './config.severity';

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
 * import { isCriticalAction, AuditAction } from './config.critical';
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
 * import { requiresImmediateFlush, AuditAction, AuditSeverity } from './config.critical';
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
