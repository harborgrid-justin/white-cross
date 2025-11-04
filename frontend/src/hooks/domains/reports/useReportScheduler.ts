/**
 * useReportScheduler Hook
 *
 * Manages report scheduling with email delivery, recurring schedules,
 * and automated report generation.
 *
 * Features:
 * - Schedule recurring reports (daily, weekly, monthly, etc.)
 * - Email delivery configuration
 * - Schedule management (create, update, delete, enable/disable)
 * - Next run calculation
 * - Execution history
 *
 * @module hooks/domains/reports/useReportScheduler
 */

'use client';

import type {
  UseSchedulesOptions,
  UseSchedulesResult
} from './scheduler/types';
import { useSchedulesQuery } from './scheduler/queries';
import {
  useCreateSchedule,
  useUpdateSchedule,
  useDeleteSchedule,
  useRunScheduleNow
} from './scheduler/mutations';

// ============================================================================
// RE-EXPORTS
// ============================================================================

// Types
export type {
  CreateScheduleRequest,
  UpdateScheduleRequest,
  UseSchedulesOptions,
  UseSchedulesResult,
  ScheduleExecutionHistory
} from './scheduler/types';

// Query hooks
export {
  useScheduleHistory,
  useNextRunCalculator
} from './scheduler/queries';

// API functions (for direct use if needed)
export {
  fetchSchedules,
  createScheduleAPI,
  updateScheduleAPI,
  deleteScheduleAPI,
  runScheduleNowAPI,
  fetchExecutionHistory
} from './scheduler/api';

// ============================================================================
// MAIN HOOK
// ============================================================================

/**
 * Hook for managing report schedules
 *
 * @example
 * ```tsx
 * const { schedules, createSchedule, toggleSchedule } = useReportSchedules({
 *   definitionId: 'health-trends-report'
 * });
 *
 * const handleCreate = async () => {
 *   await createSchedule({
 *     definitionId: 'health-trends-report',
 *     name: 'Weekly Health Report',
 *     frequency: {
 *       type: 'weekly',
 *       interval: 1,
 *       dayOfWeek: 1, // Monday
 *       time: '09:00'
 *     },
 *     delivery: {
 *       method: 'email',
 *       recipients: ['admin@school.edu'],
 *       subject: 'Weekly Health Trends Report'
 *     },
 *     parameters: {
 *       dateRange: { period: 'last-7-days' }
 *     }
 *   });
 * };
 * ```
 */
export function useReportSchedules(options: UseSchedulesOptions = {}): UseSchedulesResult {
  const { definitionId, enabled = true } = options;

  // Query for fetching schedules
  const query = useSchedulesQuery(definitionId, enabled);

  // Mutations
  const { createSchedule } = useCreateSchedule();
  const { updateSchedule, toggleSchedule } = useUpdateSchedule();
  const { deleteSchedule } = useDeleteSchedule();
  const { runScheduleNow } = useRunScheduleNow();

  return {
    schedules: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    toggleSchedule,
    runScheduleNow,
    refetch: query.refetch
  };
}
