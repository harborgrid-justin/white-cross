/**
 * Chronic Condition Hooks
 *
 * React Query hooks for fetching and managing chronic conditions.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { healthRecordsApi } from '../../../services/modules/healthRecordsApi';
import type {
  ChronicConditionCreate,
  ChronicConditionUpdate,
} from '../../../services/modules/healthRecordsApi';
import { HEALTH_RECORD_META } from '../../../config/queryClient';
import toast from 'react-hot-toast';
import { healthRecordsKeys } from './queryKeys';

/**
 * Fetch all chronic conditions for a student
 */
export function useConditions(studentId: string) {
  return useQuery({
    queryKey: healthRecordsKeys.conditions(studentId),
    queryFn: () => healthRecordsApi.getConditions(studentId),
    enabled: !!studentId,
    meta: HEALTH_RECORD_META,
  });
}

/**
 * Create a new chronic condition
 */
export function useCreateCondition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChronicConditionCreate) => healthRecordsApi.createCondition(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.conditions(variables.studentId) });
      toast.success('Chronic condition added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add chronic condition');
    },
  });
}

/**
 * Update a chronic condition
 */
export function useUpdateCondition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ChronicConditionUpdate }) =>
      healthRecordsApi.updateCondition(id, data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.conditions(result.studentId) });
      toast.success('Chronic condition updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update chronic condition');
    },
  });
}

/**
 * Delete a chronic condition
 */
export function useDeleteCondition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => healthRecordsApi.deleteCondition(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.all });
      toast.success('Chronic condition deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete chronic condition');
    },
  });
}
