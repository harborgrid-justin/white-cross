/**
 * Report Scheduler Mutation Hooks
 *
 * React Query mutation hooks for schedule operations.
 *
 * @module hooks/domains/reports/scheduler/mutations
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import type { ReportSchedule } from '@/types/schemas/reports.schema';
import { reportsQueryKeys, REPORTS_OPERATIONS } from '../config';
import {
  createScheduleAPI,
  updateScheduleAPI,
  deleteScheduleAPI,
  runScheduleNowAPI
} from './api';
import type {
  CreateScheduleRequest,
  UpdateScheduleRequest
} from './types';

// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * Hook for creating schedules
 */
export function useCreateSchedule() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: [REPORTS_OPERATIONS.SCHEDULE, 'create'],
    mutationFn: createScheduleAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reportsQueryKeys.generation.all()
      });
    }
  });

  const createSchedule = useCallback(
    async (request: CreateScheduleRequest) => {
      return mutation.mutateAsync(request);
    },
    [mutation]
  );

  return { createSchedule, ...mutation };
}

/**
 * Hook for updating schedules
 */
export function useUpdateSchedule() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: [REPORTS_OPERATIONS.SCHEDULE, 'update'],
    mutationFn: updateScheduleAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reportsQueryKeys.generation.all()
      });
    }
  });

  const updateSchedule = useCallback(
    async (request: UpdateScheduleRequest) => {
      return mutation.mutateAsync(request);
    },
    [mutation]
  );

  const toggleSchedule = useCallback(
    async (id: string, enabled: boolean): Promise<ReportSchedule> => {
      return mutation.mutateAsync({ id, enabled });
    },
    [mutation]
  );

  return { updateSchedule, toggleSchedule, ...mutation };
}

/**
 * Hook for deleting schedules
 */
export function useDeleteSchedule() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: [REPORTS_OPERATIONS.SCHEDULE, 'delete'],
    mutationFn: deleteScheduleAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reportsQueryKeys.generation.all()
      });
    }
  });

  const deleteSchedule = useCallback(
    async (id: string) => {
      await mutation.mutateAsync(id);
    },
    [mutation]
  );

  return { deleteSchedule, ...mutation };
}

/**
 * Hook for running schedule immediately
 */
export function useRunScheduleNow() {
  const mutation = useMutation({
    mutationKey: [REPORTS_OPERATIONS.SCHEDULE, 'run'],
    mutationFn: runScheduleNowAPI
  });

  const runScheduleNow = useCallback(
    async (id: string) => {
      await mutation.mutateAsync(id);
    },
    [mutation]
  );

  return { runScheduleNow, ...mutation };
}
