/**
 * @fileoverview Incident Validation Utilities
 * @module schemas/incidents/incident.validation
 *
 * Business logic validation for incident workflows, including status transitions
 * and field-level validation rules.
 */

import type { IncidentStatusEnum } from './incident.enums.schemas';

// ==========================================
// STATUS TRANSITION VALIDATION
// ==========================================

/**
 * Valid Status Transitions for Workflow Enforcement
 *
 * @remarks
 * Defines allowed state transitions to ensure proper incident workflow:
 * - PENDING_REVIEW: Initial state, can move to investigation, resolution, or archive
 * - UNDER_INVESTIGATION: Active work, can escalate to action needed, resolve, or return to pending
 * - REQUIRES_ACTION: Waiting for action, can return to investigation or resolve
 * - RESOLVED: Closed state, can be archived or reopened for investigation
 * - ARCHIVED: Terminal state, no transitions allowed (permanent record)
 *
 * This enforces legal compliance and audit trail requirements.
 */
export const VALID_STATUS_TRANSITIONS: Record<IncidentStatusEnum, IncidentStatusEnum[]> = {
  PENDING_REVIEW: ['UNDER_INVESTIGATION', 'RESOLVED', 'ARCHIVED'],
  UNDER_INVESTIGATION: ['REQUIRES_ACTION', 'RESOLVED', 'PENDING_REVIEW'],
  REQUIRES_ACTION: ['UNDER_INVESTIGATION', 'RESOLVED'],
  RESOLVED: ['ARCHIVED', 'UNDER_INVESTIGATION'], // Can reopen
  ARCHIVED: [], // Terminal state
};

/**
 * Validates if a status transition is allowed
 *
 * @param currentStatus - Current incident status
 * @param newStatus - Proposed new status
 * @returns True if transition is valid, false otherwise
 *
 * @example
 * ```typescript
 * const canTransition = isValidStatusTransition('PENDING_REVIEW', 'UNDER_INVESTIGATION');
 * // Returns: true
 *
 * const cannotTransition = isValidStatusTransition('ARCHIVED', 'RESOLVED');
 * // Returns: false
 * ```
 */
export function isValidStatusTransition(
  currentStatus: IncidentStatusEnum,
  newStatus: IncidentStatusEnum
): boolean {
  return VALID_STATUS_TRANSITIONS[currentStatus]?.includes(newStatus) ?? false;
}

/**
 * Gets all valid next statuses for a given current status
 *
 * @param currentStatus - Current incident status
 * @returns Array of valid next statuses
 *
 * @example
 * ```typescript
 * const nextStatuses = getValidNextStatuses('PENDING_REVIEW');
 * // Returns: ['UNDER_INVESTIGATION', 'RESOLVED', 'ARCHIVED']
 * ```
 */
export function getValidNextStatuses(currentStatus: IncidentStatusEnum): IncidentStatusEnum[] {
  return VALID_STATUS_TRANSITIONS[currentStatus] ?? [];
}

/**
 * Checks if a status is terminal (no further transitions allowed)
 *
 * @param status - Status to check
 * @returns True if status is terminal
 *
 * @example
 * ```typescript
 * const isTerminal = isTerminalStatus('ARCHIVED');
 * // Returns: true
 * ```
 */
export function isTerminalStatus(status: IncidentStatusEnum): boolean {
  return VALID_STATUS_TRANSITIONS[status]?.length === 0;
}

// ==========================================
// FIELD VALIDATION RULES
// ==========================================

/**
 * Validates that required fields for incident type are present
 *
 * @remarks
 * Different incident types have different required fields.
 * This function provides runtime validation beyond schema validation.
 */
export function validateIncidentTypeFields(
  type: string,
  data: Record<string, unknown>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  switch (type) {
    case 'INJURY':
      if (!data.injuryType) errors.push('Injury type is required for injury incidents');
      if (!data.injuryLocation) errors.push('Injury location is required for injury incidents');
      if (!data.treatmentProvided) errors.push('Treatment details are required for injury incidents');
      break;

    case 'ILLNESS':
      if (!data.symptoms || !Array.isArray(data.symptoms) || data.symptoms.length === 0) {
        errors.push('At least one symptom is required for illness incidents');
      }
      if (!data.onsetTime) errors.push('Symptom onset time is required for illness incidents');
      break;

    case 'BEHAVIORAL':
      if (!data.behaviorType) errors.push('Behavior type is required for behavioral incidents');
      if (!data.interventionsUsed || !Array.isArray(data.interventionsUsed) || data.interventionsUsed.length === 0) {
        errors.push('At least one intervention must be documented for behavioral incidents');
      }
      break;

    case 'SAFETY':
      if (!data.hazardType) errors.push('Hazard type is required for safety incidents');
      if (!data.immediateMitigation) errors.push('Immediate mitigation steps are required for safety incidents');
      break;

    case 'EMERGENCY':
      if (!data.emergencyType) errors.push('Emergency type is required for emergency incidents');
      if (!data.emergencyServicesContacted) {
        errors.push('Emergency services contact status is required for emergency incidents');
      }
      if (!data.firstResponders || !Array.isArray(data.firstResponders) || data.firstResponders.length === 0) {
        errors.push('First responders must be documented for emergency incidents');
      }
      break;
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
