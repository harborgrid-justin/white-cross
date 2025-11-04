/**
 * Report Scheduler Query Hooks
 *
 * React Query hooks for fetching schedule data.
 *
 * @module hooks/domains/reports/scheduler/queries
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import type { ScheduleFrequency } from '@/types/schemas/reports.schema';
import { reportsQueryKeys } from '../config';
import { fetchSchedules, fetchExecutionHistory } from './api';

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Hook for fetching report schedules
 */
export function useSchedulesQuery(definitionId?: string, enabled = true) {
  return useQuery({
    queryKey: reportsQueryKeys.generation.all(),
    queryFn: () => fetchSchedules(definitionId),
    enabled
  });
}

/**
 * Hook for schedule execution history
 */
export function useScheduleHistory(scheduleId: string) {
  return useQuery({
    queryKey: ['schedule-history', scheduleId],
    queryFn: () => fetchExecutionHistory(scheduleId),
    enabled: !!scheduleId
  });
}

/**
 * Utility hook for calculating next run time
 */
export function useNextRunCalculator() {
  const calculateNextRun = useCallback((frequency: ScheduleFrequency, lastRun?: string): Date => {
    const base = lastRun ? new Date(lastRun) : new Date();
    const next = new Date(base);

    switch (frequency.type) {
      case 'daily':
        next.setDate(next.getDate() + frequency.interval);
        break;
      case 'weekly':
        next.setDate(next.getDate() + (frequency.interval * 7));
        if (frequency.dayOfWeek !== undefined) {
          const daysUntil = (frequency.dayOfWeek - next.getDay() + 7) % 7;
          next.setDate(next.getDate() + daysUntil);
        }
        break;
      case 'monthly':
        next.setMonth(next.getMonth() + frequency.interval);
        if (frequency.dayOfMonth) {
          next.setDate(frequency.dayOfMonth);
        }
        break;
      case 'quarterly':
        next.setMonth(next.getMonth() + (frequency.interval * 3));
        break;
      case 'yearly':
        next.setFullYear(next.getFullYear() + frequency.interval);
        break;
    }

    // Set time if specified
    if (frequency.time) {
      const [hours, minutes] = frequency.time.split(':').map(Number);
      next.setHours(hours, minutes, 0, 0);
    }

    return next;
  }, []);

  return { calculateNextRun };
}
