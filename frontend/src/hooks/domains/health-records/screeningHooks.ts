/**
 * Screening Hooks
 *
 * React Query hooks for fetching and managing screenings.
 * Migrated to use server actions instead of deprecated healthRecordsApi.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStudentScreenings } from '@/lib/actions/health-records.cache';
import {
  createScreeningAction,
  updateScreeningAction,
  deleteScreeningAction
} from '@/lib/actions/health-records.screenings';
import { HEALTH_RECORD_META } from '../../../config/queryClient';
import toast from 'react-hot-toast';
import { healthRecordsKeys } from './queryKeys';

/**
 * Fetch screenings for a student
 */
export function useScreenings(studentId: string) {
  return useQuery({
    queryKey: healthRecordsKeys.screenings(studentId),
    queryFn: async () => {
      const screenings = await getStudentScreenings(studentId);
      return screenings;
    },
    enabled: !!studentId,
    meta: HEALTH_RECORD_META,
  });
}

/**
 * Create a new screening
 * Note: Uses server action pattern with useActionState for form handling
 */
export function useCreateScreening() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await createScreeningAction({ errors: {} }, formData);
      if (!result.success && result.errors) {
        throw new Error(result.errors._form?.[0] || 'Failed to add screening');
      }
      return result.data;
    },
    onSuccess: (data: any) => {
      if (data?.studentId) {
        queryClient.invalidateQueries({ queryKey: healthRecordsKeys.screenings(data.studentId) });
      }
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.all });
      toast.success('Screening added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add screening');
    },
  });
}

/**
 * Update a screening
 * Note: Uses server action pattern with useActionState for form handling
 */
export function useUpdateScreening() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const result = await updateScreeningAction(id, { errors: {} }, formData);
      if (!result.success && result.errors) {
        throw new Error(result.errors._form?.[0] || 'Failed to update screening');
      }
      return { id, data: result.data };
    },
    onSuccess: ({ data }: any) => {
      if (data?.studentId) {
        queryClient.invalidateQueries({ queryKey: healthRecordsKeys.screenings(data.studentId) });
      }
      toast.success('Screening updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update screening');
    },
  });
}

/**
 * Delete a screening
 */
export function useDeleteScreening() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteScreeningAction(id);
      if (!result.success && result.errors) {
        throw new Error(result.errors._form?.[0] || 'Failed to delete screening');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.all });
      toast.success('Screening deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete screening');
    },
  });
}
