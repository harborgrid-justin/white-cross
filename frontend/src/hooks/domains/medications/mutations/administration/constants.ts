/**
 * Medication Administration Constants
 *
 * Query keys and constants for medication administration
 */

import type { AdministrationHistoryFilters } from '@/services';

/**
 * React Query cache keys for medication administration queries.
 *
 * Provides centralized, type-safe query key management for all medication
 * administration-related queries. Keys are hierarchical to enable efficient
 * cache invalidation.
 *
 * @constant
 * @example
 * ```ts
 * // Invalidate all administration queries
 * queryClient.invalidateQueries({ queryKey: administrationKeys.all });
 *
 * // Invalidate only today's administrations for specific nurse
 * queryClient.invalidateQueries({ queryKey: administrationKeys.today('nurse-123') });
 * ```
 */
export const administrationKeys = {
  /** Base key for all medication administration queries */
  all: ['medication-administration'] as const,
  /** All session-related queries */
  sessions: () => [...administrationKeys.all, 'session'] as const,
  /** Specific session by ID */
  session: (id: string) => [...administrationKeys.sessions(), id] as const,
  /** All administration history queries */
  history: () => [...administrationKeys.all, 'history'] as const,
  /** Filtered administration history */
  historyFiltered: (filters?: AdministrationHistoryFilters) =>
    [...administrationKeys.history(), filters] as const,
  /** Today's administrations, optionally filtered by nurse */
  today: (nurseId?: string) => [...administrationKeys.all, 'today', nurseId] as const,
  /** All reminder queries */
  reminders: () => [...administrationKeys.all, 'reminders'] as const,
  /** Upcoming reminders within specified hours */
  upcoming: (nurseId?: string, hours?: number) =>
    [...administrationKeys.reminders(), 'upcoming', nurseId, hours] as const,
  /** Overdue administrations requiring immediate attention */
  overdue: () => [...administrationKeys.reminders(), 'overdue'] as const,
  /** Student's medication schedule for specific date */
  schedule: (studentId: string, date?: string) =>
    [...administrationKeys.all, 'schedule', studentId, date] as const,
} as const;
