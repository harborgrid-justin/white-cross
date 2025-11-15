/**
 * Vital Signs Hooks
 *
 * React Query hooks for fetching and managing vital signs.
 * Migrated to use server actions instead of deprecated healthRecordsApi.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStudentVitalSigns } from '@/lib/actions/health-records.cache';
import {
  createVitalSignsAction,
  updateVitalSignsAction,
  deleteVitalSignsAction
} from '@/lib/actions/health-records.vital-signs';
import HEALTH_RECORD_META from '../../../config/queryClient';
import toast from 'react-hot-toast';
import { healthRecordsKeys } from './queryKeys';

/**
 * Fetch vital signs for a student
 */
export function useVitalSigns(studentId: string) {
  return useQuery({
    queryKey: healthRecordsKeys.vitalSigns(studentId),
    queryFn: async () => {
      const vitalSigns = await getStudentVitalSigns(studentId);
      return vitalSigns;
    },
    enabled: !!studentId,
    meta: HEALTH_RECORD_META,
  });
}

/**
 * Create new vital signs record
 * Note: Uses server action pattern with useActionState for form handling
 */
export function useCreateVitalSigns() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await createVitalSignsAction({ errors: {} }, formData);
      if (!result.success && result.errors) {
        throw new Error(result.errors._form?.[0] || 'Failed to record vital signs');
      }
      return result.data;
    },
    onSuccess: (data: any) => {
      if (data?.studentId) {
        queryClient.invalidateQueries({ queryKey: healthRecordsKeys.vitalSigns(data.studentId) });
      }
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.all });
      toast.success('Vital signs recorded successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to record vital signs');
    },
  });
}

/**
 * Update vital signs
 * Note: Uses server action pattern with useActionState for form handling
 */
export function useUpdateVitalSigns() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const result = await updateVitalSignsAction(id, { errors: {} }, formData);
      if (!result.success && result.errors) {
        throw new Error(result.errors._form?.[0] || 'Failed to update vital signs');
      }
      return { id, data: result.data };
    },
    onSuccess: ({ data }: any) => {
      if (data?.studentId) {
        queryClient.invalidateQueries({ queryKey: healthRecordsKeys.vitalSigns(data.studentId) });
      }
      toast.success('Vital signs updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update vital signs');
    },
  });
}

/**
 * Delete vital signs
 */
export function useDeleteVitalSigns() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteVitalSignsAction(id);
      if (!result.success && result.errors) {
        throw new Error(result.errors._form?.[0] || 'Failed to delete vital signs');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.all });
      toast.success('Vital signs deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete vital signs');
    },
  });
}
