/**
 * WF-COMP-117-CONSTANTS | FollowUpAction/constants.ts - Configuration constants
 * Purpose: Constants and configuration values for Follow-Up Action context
 * Upstream: None
 * Downstream: FollowUpActionProvider, helpers
 * Related: TanStack Query configuration
 * Exports: Constants and configuration objects
 * Last Updated: 2025-11-12 | File Type: .ts
 * LLM Context: Configuration constants for follow-up action management
 */

/**
 * Follow-Up Action Constants
 * Configuration values and query keys for follow-up action management
 *
 * @module FollowUpAction/constants
 */

import type { ActionFilters } from './types';

// =====================
// TANSTACK QUERY KEYS
// =====================

/**
 * Query keys for TanStack Query cache management
 * Used to identify and invalidate queries related to follow-up actions
 *
 * @example
 * ```typescript
 * // Query all actions for an incident
 * queryKey: QUERY_KEYS.actions(incidentId)
 *
 * // Query a specific action
 * queryKey: QUERY_KEYS.action(actionId)
 * ```
 */
export const QUERY_KEYS = {
  /**
   * Query key for fetching actions list
   * @param incidentId - Optional incident ID to filter actions
   * @returns Query key array
   */
  actions: (incidentId?: string) => ['followUpActions', incidentId].filter(Boolean) as string[],

  /**
   * Query key for fetching a single action
   * @param id - Action ID
   * @returns Query key array
   */
  action: (id: string) => ['followUpAction', id] as const,
} as const;

// =====================
// DEFAULT FILTERS
// =====================

/**
 * Default filter configuration
 * Applied when no filters are set or when filters are cleared
 */
export const DEFAULT_FILTERS: ActionFilters = {
  status: undefined,
  priority: undefined,
  assignedToMe: false,
  overduedOnly: false,
  incidentReportId: undefined,
};

// =====================
// OVERDUE THRESHOLDS
// =====================

/**
 * Number of days overdue before showing a warning alert
 * Actions overdue by this amount or more will show a warning severity
 */
export const OVERDUE_WARNING_DAYS = 1;

/**
 * Number of days overdue before showing a critical alert
 * Actions overdue by this amount or more will show critical severity
 */
export const OVERDUE_CRITICAL_DAYS = 3;
