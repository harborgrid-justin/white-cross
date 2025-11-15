/**
 * Chronic Condition Hooks
 *
 * React Query hooks for fetching and managing chronic conditions.
 * Migrated to use server actions instead of deprecated healthRecordsApi.
 * Note: Uses general health records actions since no dedicated condition actions exist yet.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getHealthRecordsAction } from '@/lib/actions/health-records.crud';
import {
  createHealthRecordAction,
  updateHealthRecordAction,
  deleteHealthRecordAction
} from '@/lib/actions/health-records.crud';
import HEALTH_RECORD_META from '../../../config/queryClient';
import toast from 'react-hot-toast';
import { healthRecordsKeys } from './queryKeys';

/**
 * Fetch all chronic conditions for a student
 */
export function useConditions(studentId: string) {
  return useQuery({
    queryKey: healthRecordsKeys.conditions(studentId),
    queryFn: async () => {
      const result = await getHealthRecordsAction(studentId, 'CONDITION');
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch conditions');
      }
      return result.data || [];
    },
    enabled: !!studentId,
    meta: HEALTH_RECORD_META,
  });
}

/**
 * Create a new chronic condition
 * Note: Uses general health record creation with recordType='CONDITION'
 */
export function useCreateCondition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      // Ensure recordType is set to CONDITION
      formData.set('recordType', 'CONDITION');
      const result = await createHealthRecordAction({ errors: {} }, formData);
      if (!result.success && result.errors) {
        throw new Error(result.errors._form?.[0] || 'Failed to add chronic condition');
      }
      return result.data;
    },
    onSuccess: (data: any) => {
      if (data?.studentId) {
        queryClient.invalidateQueries({ queryKey: healthRecordsKeys.conditions(data.studentId) });
      }
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.all });
      toast.success('Chronic condition added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add chronic condition');
    },
  });
}

/**
 * Update a chronic condition
 * Note: Uses general health record update
 */
export function useUpdateCondition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const result = await updateHealthRecordAction(id, { errors: {} }, formData);
      if (!result.success && result.errors) {
        throw new Error(result.errors._form?.[0] || 'Failed to update chronic condition');
      }
      return { id, data: result.data };
    },
    onSuccess: ({ data }: any) => {
      if (data?.studentId) {
        queryClient.invalidateQueries({ queryKey: healthRecordsKeys.conditions(data.studentId) });
      }
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
    mutationFn: async (id: string) => {
      const result = await deleteHealthRecordAction(id);
      if (!result.success && result.errors) {
        throw new Error(result.errors._form?.[0] || 'Failed to delete chronic condition');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.all });
      toast.success('Chronic condition deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete chronic condition');
    },
  });
}
