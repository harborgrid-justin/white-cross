/**
 * WF-COMP-325 | incidents/utils.ts - Utility functions and type guards
 * Purpose: Helper functions for incident type operations
 * Upstream: None | Dependencies: Enums
 * Downstream: All components using incidents | Called by: UI components, validation
 * Related: enums.ts, entities.ts
 * Exports: Utility functions, type guards | Key Features: Type validation, UI helpers
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Type validation → UI rendering → User feedback
 * LLM Context: Utility functions for incident type operations and UI helpers
 */

/**
 * Incident Reports Module - Utility Functions
 * Type guards, validation helpers, and UI utility functions
 */

import type {
  IncidentType,
  IncidentSeverity,
  WitnessType,
  ActionStatus,
  ActionPriority,
} from './enums';

// =====================
// TYPE GUARDS
// =====================

/**
 * Type guard for checking if value is valid IncidentType
 * @param value - String value to check
 * @returns True if value is a valid IncidentType
 */
export function isIncidentType(value: string): value is IncidentType {
  return Object.values(IncidentType).includes(value as IncidentType);
}

/**
 * Type guard for checking if value is valid IncidentSeverity
 * @param value - String value to check
 * @returns True if value is a valid IncidentSeverity
 */
export function isIncidentSeverity(value: string): value is IncidentSeverity {
  return Object.values(IncidentSeverity).includes(value as IncidentSeverity);
}

/**
 * Type guard for checking if value is valid WitnessType
 * @param value - String value to check
 * @returns True if value is a valid WitnessType
 */
export function isWitnessType(value: string): value is WitnessType {
  return Object.values(WitnessType).includes(value as WitnessType);
}

/**
 * Type guard for checking if value is valid ActionStatus
 * @param value - String value to check
 * @returns True if value is a valid ActionStatus
 */
export function isActionStatus(value: string): value is ActionStatus {
  return Object.values(ActionStatus).includes(value as ActionStatus);
}

// =====================
// LABEL HELPERS
// =====================

/**
 * Helper function to get human-readable incident type label
 * @param type - IncidentType enum value
 * @returns Human-readable label for the incident type
 */
export function getIncidentTypeLabel(type: IncidentType): string {
  const labels: Record<IncidentType, string> = {
    [IncidentType.INJURY]: 'Injury',
    [IncidentType.ILLNESS]: 'Illness',
    [IncidentType.BEHAVIORAL]: 'Behavioral',
    [IncidentType.MEDICATION_ERROR]: 'Medication Error',
    [IncidentType.ALLERGIC_REACTION]: 'Allergic Reaction',
    [IncidentType.EMERGENCY]: 'Emergency',
    [IncidentType.OTHER]: 'Other',
  };
  return labels[type] || type;
}

/**
 * Helper function to get human-readable severity label
 * @param severity - IncidentSeverity enum value
 * @returns Human-readable label for the severity level
 */
export function getIncidentSeverityLabel(severity: IncidentSeverity): string {
  const labels: Record<IncidentSeverity, string> = {
    [IncidentSeverity.LOW]: 'Low',
    [IncidentSeverity.MEDIUM]: 'Medium',
    [IncidentSeverity.HIGH]: 'High',
    [IncidentSeverity.CRITICAL]: 'Critical',
  };
  return labels[severity] || severity;
}

// =====================
// UI COLOR HELPERS
// =====================

/**
 * Helper function to get severity color class for UI
 * @param severity - IncidentSeverity enum value
 * @returns Tailwind CSS classes for severity color styling
 */
export function getIncidentSeverityColor(severity: IncidentSeverity): string {
  const colors: Record<IncidentSeverity, string> = {
    [IncidentSeverity.LOW]: 'text-green-600 bg-green-100',
    [IncidentSeverity.MEDIUM]: 'text-yellow-600 bg-yellow-100',
    [IncidentSeverity.HIGH]: 'text-orange-600 bg-orange-100',
    [IncidentSeverity.CRITICAL]: 'text-red-600 bg-red-100',
  };
  return colors[severity] || 'text-gray-600 bg-gray-100';
}

/**
 * Helper function to get action priority color class for UI
 * @param priority - ActionPriority enum value
 * @returns Tailwind CSS classes for priority color styling
 */
export function getActionPriorityColor(priority: ActionPriority): string {
  const colors: Record<ActionPriority, string> = {
    [ActionPriority.LOW]: 'text-blue-600 bg-blue-100',
    [ActionPriority.MEDIUM]: 'text-yellow-600 bg-yellow-100',
    [ActionPriority.HIGH]: 'text-orange-600 bg-orange-100',
    [ActionPriority.URGENT]: 'text-red-600 bg-red-100',
  };
  return colors[priority] || 'text-gray-600 bg-gray-100';
}

/**
 * Helper function to get action status color class for UI
 * @param status - ActionStatus enum value
 * @returns Tailwind CSS classes for status color styling
 */
export function getActionStatusColor(status: ActionStatus): string {
  const colors: Record<ActionStatus, string> = {
    [ActionStatus.PENDING]: 'text-gray-600 bg-gray-100',
    [ActionStatus.IN_PROGRESS]: 'text-blue-600 bg-blue-100',
    [ActionStatus.COMPLETED]: 'text-green-600 bg-green-100',
    [ActionStatus.CANCELLED]: 'text-red-600 bg-red-100',
  };
  return colors[status] || 'text-gray-600 bg-gray-100';
}
