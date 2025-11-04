/**
 * @fileoverview Follow-Up Utility Functions
 * @module schemas/incidents/follow-up/utils
 *
 * Helper functions for follow-up action management, validation, and calculations.
 */

import type { FollowUpAction } from './follow-up.base.schemas';
import type { FollowUpStatusEnum } from './follow-up.base.schemas';
import { VALID_FOLLOWUP_TRANSITIONS } from './follow-up.base.schemas';

// ==========================================
// STATUS TRANSITION VALIDATION
// ==========================================

/**
 * Validates if a status transition is allowed
 *
 * @param currentStatus - Current action status
 * @param newStatus - Desired new status
 * @returns true if transition is valid, false otherwise
 *
 * @example
 * ```typescript
 * isValidFollowUpTransition('PENDING', 'IN_PROGRESS') // true
 * isValidFollowUpTransition('VERIFIED', 'PENDING') // false
 * ```
 */
export function isValidFollowUpTransition(
  currentStatus: FollowUpStatusEnum,
  newStatus: FollowUpStatusEnum
): boolean {
  return VALID_FOLLOWUP_TRANSITIONS[currentStatus]?.includes(newStatus) ?? false;
}

/**
 * Gets all valid next statuses for a given current status
 *
 * @param currentStatus - Current action status
 * @returns Array of valid next statuses
 *
 * @example
 * ```typescript
 * getValidNextStatuses('PENDING') // ['IN_PROGRESS', 'CANCELLED', 'DEFERRED']
 * ```
 */
export function getValidNextStatuses(currentStatus: FollowUpStatusEnum): FollowUpStatusEnum[] {
  return VALID_FOLLOWUP_TRANSITIONS[currentStatus] ?? [];
}

// ==========================================
// DATE AND TIME CALCULATIONS
// ==========================================

/**
 * Determines if a follow-up action is overdue
 *
 * @param action - Follow-up action to check
 * @returns true if action is overdue, false otherwise
 *
 * @example
 * ```typescript
 * const action = { dueDate: '2024-01-01T00:00:00Z', status: 'PENDING', ... };
 * isOverdue(action) // true (if current date is after Jan 1, 2024)
 * ```
 */
export function isOverdue(action: FollowUpAction): boolean {
  if (action.status === 'COMPLETED' || action.status === 'VERIFIED' || action.status === 'CANCELLED') {
    return false;
  }
  return new Date(action.dueDate) < new Date();
}

/**
 * Calculates the number of days until an action is due
 *
 * @param action - Follow-up action
 * @returns Number of days until due (negative if overdue)
 *
 * @example
 * ```typescript
 * const action = { dueDate: '2024-12-31T00:00:00Z', ... };
 * daysUntilDue(action) // e.g., 15 (if current date is Dec 16, 2024)
 * ```
 */
export function daysUntilDue(action: FollowUpAction): number {
  const dueDate = new Date(action.dueDate);
  const now = new Date();
  const diffTime = dueDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Calculates hours until due
 *
 * @param action - Follow-up action
 * @returns Number of hours until due (negative if overdue)
 */
export function hoursUntilDue(action: FollowUpAction): number {
  const dueDate = new Date(action.dueDate);
  const now = new Date();
  const diffTime = dueDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60));
}

// ==========================================
// AUTO-GENERATION FUNCTIONS
// ==========================================

/**
 * Generates a unique action number based on incident number and index
 *
 * @param incidentNumber - Parent incident number (e.g., "INC-0001")
 * @param actionIndex - Sequential action index (1-based)
 * @returns Formatted action number
 *
 * @example
 * ```typescript
 * generateActionNumber('INC-0001', 1) // 'FA-INC-0001-01'
 * generateActionNumber('INC-0001', 15) // 'FA-INC-0001-15'
 * ```
 */
export function generateActionNumber(incidentNumber: string, actionIndex: number): string {
  return `FA-${incidentNumber}-${String(actionIndex).padStart(2, '0')}`;
}

// ==========================================
// PROGRESS CALCULATIONS
// ==========================================

/**
 * Determines if an action is in a terminal state (no further transitions allowed)
 *
 * @param status - Action status to check
 * @returns true if status is terminal
 */
export function isTerminalStatus(status: FollowUpStatusEnum): boolean {
  return status === 'VERIFIED' || status === 'CANCELLED';
}

/**
 * Determines if an action can be modified
 *
 * @param action - Follow-up action
 * @returns true if action can be modified
 */
export function isModifiable(action: FollowUpAction): boolean {
  return !isTerminalStatus(action.status);
}

/**
 * Calculates completion percentage based on checklist items (if provided externally)
 *
 * @param totalItems - Total number of checklist items
 * @param completedItems - Number of completed items
 * @returns Percentage complete (0-100)
 */
export function calculateChecklistProgress(totalItems: number, completedItems: number): number {
  if (totalItems === 0) return 0;
  return Math.round((completedItems / totalItems) * 100);
}

// ==========================================
// PRIORITY HELPERS
// ==========================================

/**
 * Gets numeric priority value for sorting
 *
 * @param priority - Priority enum value
 * @returns Numeric value (higher = more important)
 */
export function getPriorityWeight(priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'): number {
  const weights = {
    CRITICAL: 4,
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
  };
  return weights[priority];
}

/**
 * Determines if priority escalation is recommended based on time remaining
 *
 * @param action - Follow-up action
 * @returns true if priority should be escalated
 */
export function shouldEscalatePriority(action: FollowUpAction): boolean {
  if (action.status === 'COMPLETED' || action.status === 'VERIFIED') {
    return false;
  }

  const days = daysUntilDue(action);

  // Escalate if critical action has < 1 day
  if (action.priority === 'CRITICAL' && days < 1) return true;

  // Escalate if high priority has < 2 days
  if (action.priority === 'HIGH' && days < 2) return true;

  // Escalate if medium priority has < 3 days
  if (action.priority === 'MEDIUM' && days < 3) return true;

  return false;
}
