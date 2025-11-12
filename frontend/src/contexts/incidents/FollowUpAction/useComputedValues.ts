/**
 * WF-COMP-117-COMPUTED | FollowUpAction/useComputedValues.ts - Computed values hook
 * Purpose: Computed values and derived state for follow-up actions
 * Upstream: ./helpers, @/types/domain/incidents
 * Downstream: FollowUpActionProvider
 * Related: Filtering, sorting, statistics
 * Exports: useComputedValues custom hook
 * Last Updated: 2025-11-12 | File Type: .ts
 * LLM Context: Memoized computed values for action filtering, sorting, and statistics
 */

/**
 * Follow-Up Action Computed Values
 * Custom hook for computing derived state from follow-up actions
 *
 * @module FollowUpAction/useComputedValues
 */

import { useMemo } from 'react';
import type { FollowUpAction } from '@/types/domain/incidents';
import { ActionStatus } from '@/types/domain/incidents';
import type { ActionFilters, OverdueAlert } from './types';
import type { User } from '@/identity-access/types/auth';
import {
  isOverdue,
  getDaysOverdue,
  getOverdueSeverity,
  sortByPriority,
  sortByDate,
} from './helpers';

// =====================
// TYPE DEFINITIONS
// =====================

/**
 * Return type for useComputedValues hook
 */
export interface UseComputedValuesReturn {
  /** Filtered and sorted actions */
  filteredAndSortedActions: FollowUpAction[];
  /** Overdue actions with alert metadata */
  overdueActions: OverdueAlert[];
  /** Statistics about actions */
  stats: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    overdue: number;
  };
}

// =====================
// CUSTOM HOOK
// =====================

/**
 * Custom hook for computing derived values from follow-up actions
 * Handles filtering, sorting, overdue detection, and statistics
 *
 * @param actions - The raw list of follow-up actions
 * @param filters - Active filter configuration
 * @param sortBy - Field to sort by
 * @param sortOrder - Sort direction
 * @param user - Current authenticated user (for filtering)
 * @returns Computed values including filtered actions, overdue alerts, and stats
 *
 * @example
 * ```typescript
 * const { filteredAndSortedActions, overdueActions, stats } = useComputedValues(
 *   actions,
 *   filters,
 *   'dueDate',
 *   'asc',
 *   user
 * );
 * ```
 */
export function useComputedValues(
  actions: FollowUpAction[],
  filters: ActionFilters,
  sortBy: 'dueDate' | 'priority' | 'createdAt',
  sortOrder: 'asc' | 'desc',
  user: User | null
): UseComputedValuesReturn {
  /**
   * Filter and sort actions based on current state
   */
  const filteredAndSortedActions = useMemo(() => {
    let filtered = [...actions];

    // Apply filters
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter((action) => filters.status!.includes(action.status));
    }

    if (filters.priority && filters.priority.length > 0) {
      filtered = filtered.filter((action) => filters.priority!.includes(action.priority));
    }

    if (filters.assignedToMe && user) {
      filtered = filtered.filter((action) => action.assignedTo === user.id);
    }

    if (filters.overduedOnly) {
      filtered = filtered.filter(isOverdue);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'priority') {
        return sortByPriority(a, b, sortOrder);
      } else {
        return sortByDate(a, b, sortBy, sortOrder);
      }
    });

    return filtered;
  }, [actions, filters, sortBy, sortOrder, user]);

  /**
   * Calculate overdue actions with alerts
   */
  const overdueActions = useMemo<OverdueAlert[]>(() => {
    return actions
      .filter(isOverdue)
      .map((action) => {
        const daysOverdue = getDaysOverdue(action);
        return {
          action,
          daysOverdue,
          severity: getOverdueSeverity(daysOverdue),
        };
      })
      .sort((a, b) => b.daysOverdue - a.daysOverdue);
  }, [actions]);

  /**
   * Calculate statistics
   */
  const stats = useMemo(() => {
    return {
      total: actions.length,
      pending: actions.filter((a) => a.status === ActionStatus.PENDING).length,
      inProgress: actions.filter((a) => a.status === ActionStatus.IN_PROGRESS).length,
      completed: actions.filter((a) => a.status === ActionStatus.COMPLETED).length,
      cancelled: actions.filter((a) => a.status === ActionStatus.CANCELLED).length,
      overdue: overdueActions.length,
    };
  }, [actions, overdueActions]);

  return {
    filteredAndSortedActions,
    overdueActions,
    stats,
  };
}
