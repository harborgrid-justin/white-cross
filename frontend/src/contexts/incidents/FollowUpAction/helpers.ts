/**
 * WF-COMP-117-HELPERS | FollowUpAction/helpers.ts - Utility functions
 * Purpose: Pure utility functions for follow-up action processing
 * Upstream: @/types/domain/incidents
 * Downstream: FollowUpActionProvider
 * Related: Date calculations, sorting algorithms
 * Exports: Pure utility functions
 * Last Updated: 2025-11-12 | File Type: .ts
 * LLM Context: Helper functions for action status, sorting, and overdue detection
 */

/**
 * Follow-Up Action Helper Functions
 * Pure utility functions for processing and analyzing follow-up actions
 *
 * @module FollowUpAction/helpers
 */

import type { FollowUpAction } from '@/types/domain/incidents';
import { ActionStatus, ActionPriority } from '@/types/domain/incidents';
import { OVERDUE_WARNING_DAYS, OVERDUE_CRITICAL_DAYS } from './constants';

// =====================
// OVERDUE DETECTION
// =====================

/**
 * Calculate if an action is overdue
 * An action is considered overdue if:
 * - It is not completed or cancelled
 * - Its due date is in the past
 *
 * @param action - The follow-up action to check
 * @returns True if the action is overdue
 *
 * @example
 * ```typescript
 * const action = { status: ActionStatus.PENDING, dueDate: '2025-01-01', ... };
 * const overdue = isOverdue(action); // true if past Jan 1, 2025
 * ```
 */
export function isOverdue(action: FollowUpAction): boolean {
  // Completed or cancelled actions are never overdue
  if (action.status === ActionStatus.COMPLETED || action.status === ActionStatus.CANCELLED) {
    return false;
  }

  // Check if due date is in the past
  return new Date(action.dueDate) < new Date();
}

/**
 * Calculate the number of days an action is overdue
 * Returns 0 if the action is not overdue
 *
 * @param action - The follow-up action to check
 * @returns Number of days overdue (0 if not overdue)
 *
 * @example
 * ```typescript
 * const action = { status: ActionStatus.PENDING, dueDate: '2025-01-01', ... };
 * const days = getDaysOverdue(action); // e.g., 5 if 5 days past due date
 * ```
 */
export function getDaysOverdue(action: FollowUpAction): number {
  if (!isOverdue(action)) {
    return 0;
  }

  const now = new Date();
  const dueDate = new Date(action.dueDate);
  const diffTime = Math.abs(now.getTime() - dueDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * Get the severity level for an overdue action
 * - 'warning': 1-2 days overdue
 * - 'critical': 3+ days overdue
 *
 * @param daysOverdue - Number of days the action is overdue
 * @returns Severity level
 *
 * @example
 * ```typescript
 * const severity = getOverdueSeverity(5); // 'critical'
 * const severity = getOverdueSeverity(2); // 'warning'
 * ```
 */
export function getOverdueSeverity(daysOverdue: number): 'warning' | 'critical' {
  return daysOverdue >= OVERDUE_CRITICAL_DAYS ? 'critical' : 'warning';
}

// =====================
// SORTING FUNCTIONS
// =====================

/**
 * Sort actions by priority level
 * Priority order: URGENT > HIGH > MEDIUM > LOW
 *
 * @param a - First action to compare
 * @param b - Second action to compare
 * @param order - Sort order ('asc' or 'desc')
 * @returns Comparison result for Array.sort()
 *
 * @example
 * ```typescript
 * actions.sort((a, b) => sortByPriority(a, b, 'desc'));
 * // Results in: [URGENT, HIGH, MEDIUM, LOW]
 * ```
 */
export function sortByPriority(
  a: FollowUpAction,
  b: FollowUpAction,
  order: 'asc' | 'desc'
): number {
  // Define numeric priority weights
  const priorityOrder: Record<ActionPriority, number> = {
    [ActionPriority.URGENT]: 4,
    [ActionPriority.HIGH]: 3,
    [ActionPriority.MEDIUM]: 2,
    [ActionPriority.LOW]: 1,
  };

  const diff = priorityOrder[a.priority] - priorityOrder[b.priority];
  return order === 'asc' ? diff : -diff;
}

/**
 * Sort actions by date field
 * Supports sorting by dueDate or createdAt
 *
 * @param a - First action to compare
 * @param b - Second action to compare
 * @param field - Date field to sort by ('dueDate' or 'createdAt')
 * @param order - Sort order ('asc' or 'desc')
 * @returns Comparison result for Array.sort()
 *
 * @example
 * ```typescript
 * actions.sort((a, b) => sortByDate(a, b, 'dueDate', 'asc'));
 * // Results in actions sorted by due date (earliest first)
 * ```
 */
export function sortByDate(
  a: FollowUpAction,
  b: FollowUpAction,
  field: 'dueDate' | 'createdAt',
  order: 'asc' | 'desc'
): number {
  const dateA = new Date(a[field]).getTime();
  const dateB = new Date(b[field]).getTime();
  const diff = dateA - dateB;

  return order === 'asc' ? diff : -diff;
}
