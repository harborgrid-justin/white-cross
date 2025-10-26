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

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import type {
  ReportSchedule,
  ScheduleFrequency,
  DeliveryConfig,
  ReportParameters
} from '@/types/schemas/reports.schema';
import { reportsQueryKeys, REPORTS_OPERATIONS } from './config';

// ============================================================================
// TYPES
// ============================================================================

interface CreateScheduleRequest {
  definitionId: string;
  name: string;
  description?: string;
  frequency: ScheduleFrequency;
  parameters: ReportParameters;
  delivery: DeliveryConfig;
  startDate?: string;
  endDate?: string;
}

interface UpdateScheduleRequest extends Partial<CreateScheduleRequest> {
  id: string;
}

interface UseSchedulesOptions {
  definitionId?: string;
  enabled?: boolean;
}

interface UseSchedulesResult {
  schedules: ReportSchedule[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  createSchedule: (request: CreateScheduleRequest) => Promise<ReportSchedule>;
  updateSchedule: (request: UpdateScheduleRequest) => Promise<ReportSchedule>;
  deleteSchedule: (id: string) => Promise<void>;
  toggleSchedule: (id: string, enabled: boolean) => Promise<ReportSchedule>;
  runScheduleNow: (id: string) => Promise<void>;
  refetch: () => void;
}

interface ScheduleExecutionHistory {
  id: string;
  scheduleId: string;
  executedAt: string;
  status: 'success' | 'failed';
  error?: string;
  reportId?: string;
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Fetches report schedules
 */
async function fetchSchedules(definitionId?: string): Promise<ReportSchedule[]> {
  const url = definitionId
    ? `/api/reports/schedules?definitionId=${definitionId}`
    : '/api/reports/schedules';

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include'
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch schedules' }));
    throw new Error(error.message || 'Failed to fetch report schedules');
  }

  return response.json();
}

/**
 * Creates a new report schedule
 */
async function createScheduleAPI(request: CreateScheduleRequest): Promise<ReportSchedule> {
  const response = await fetch('/api/reports/schedules', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to create schedule' }));
    throw new Error(error.message || 'Failed to create report schedule');
  }

  return response.json();
}

/**
 * Updates an existing report schedule
 */
async function updateScheduleAPI(request: UpdateScheduleRequest): Promise<ReportSchedule> {
  const { id, ...data } = request;

  const response = await fetch(`/api/reports/schedules/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to update schedule' }));
    throw new Error(error.message || 'Failed to update report schedule');
  }

  return response.json();
}

/**
 * Deletes a report schedule
 */
async function deleteScheduleAPI(id: string): Promise<void> {
  const response = await fetch(`/api/reports/schedules/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to delete schedule' }));
    throw new Error(error.message || 'Failed to delete report schedule');
  }
}

/**
 * Runs a schedule immediately (manual trigger)
 */
async function runScheduleNowAPI(id: string): Promise<void> {
  const response = await fetch(`/api/reports/schedules/${id}/run`, {
    method: 'POST',
    credentials: 'include'
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to run schedule' }));
    throw new Error(error.message || 'Failed to run report schedule');
  }
}

/**
 * Fetches schedule execution history
 */
async function fetchExecutionHistory(scheduleId: string): Promise<ScheduleExecutionHistory[]> {
  const response = await fetch(`/api/reports/schedules/${scheduleId}/history`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include'
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch history' }));
    throw new Error(error.message || 'Failed to fetch execution history');
  }

  return response.json();
}

// ============================================================================
// HOOKS
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
  const queryClient = useQueryClient();

  // Query for fetching schedules
  const query = useQuery({
    queryKey: reportsQueryKeys.generation.all(),
    queryFn: () => fetchSchedules(definitionId),
    enabled
  });

  // Mutation for creating schedules
  const createMutation = useMutation({
    mutationKey: [REPORTS_OPERATIONS.SCHEDULE, 'create'],
    mutationFn: createScheduleAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reportsQueryKeys.generation.all()
      });
    }
  });

  // Mutation for updating schedules
  const updateMutation = useMutation({
    mutationKey: [REPORTS_OPERATIONS.SCHEDULE, 'update'],
    mutationFn: updateScheduleAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reportsQueryKeys.generation.all()
      });
    }
  });

  // Mutation for deleting schedules
  const deleteMutation = useMutation({
    mutationKey: [REPORTS_OPERATIONS.SCHEDULE, 'delete'],
    mutationFn: deleteScheduleAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reportsQueryKeys.generation.all()
      });
    }
  });

  // Mutation for running schedule immediately
  const runNowMutation = useMutation({
    mutationKey: [REPORTS_OPERATIONS.SCHEDULE, 'run'],
    mutationFn: runScheduleNowAPI
  });

  // Create schedule
  const createSchedule = useCallback(
    async (request: CreateScheduleRequest) => {
      return createMutation.mutateAsync(request);
    },
    [createMutation]
  );

  // Update schedule
  const updateSchedule = useCallback(
    async (request: UpdateScheduleRequest) => {
      return updateMutation.mutateAsync(request);
    },
    [updateMutation]
  );

  // Delete schedule
  const deleteSchedule = useCallback(
    async (id: string) => {
      await deleteMutation.mutateAsync(id);
    },
    [deleteMutation]
  );

  // Toggle schedule enabled/disabled
  const toggleSchedule = useCallback(
    async (id: string, enabled: boolean) => {
      return updateMutation.mutateAsync({ id, enabled });
    },
    [updateMutation]
  );

  // Run schedule now
  const runScheduleNow = useCallback(
    async (id: string) => {
      await runNowMutation.mutateAsync(id);
    },
    [runNowMutation]
  );

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
