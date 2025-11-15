/**
 * Allergy Hooks
 *
 * React Query hooks for fetching and managing allergies.
 * Migrated to use server actions instead of deprecated healthRecordsApi.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getStudentAllergiesAction,
  createAllergyAction
} from '@/lib/actions/health-records.allergies';
import {
  updateHealthRecordAction,
  deleteHealthRecordAction
} from '@/lib/actions/health-records.crud';
import { HEALTH_RECORD_META } from '../../../config/queryClient';
import toast from 'react-hot-toast';
import { healthRecordsKeys } from './queryKeys';

/**
 * Fetch all allergies for a student
 */
export function useAllergies(studentId: string) {
  return useQuery({
    queryKey: healthRecordsKeys.allergies(studentId),
    queryFn: async () => {
      const result = await getStudentAllergiesAction(studentId);
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch allergies');
      }
      return result.data || [];
    },
    enabled: !!studentId,
    meta: HEALTH_RECORD_META,
  });
}

/**
 * Create a new allergy
 * Note: Uses dedicated allergy server action
 */
export function useCreateAllergy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await createAllergyAction({ errors: {} }, formData);
      if (!result.success && result.errors) {
        throw new Error(result.errors._form?.[0] || 'Failed to add allergy');
      }
      return result.data;
    },
    onSuccess: (data: any) => {
      if (data?.studentId) {
        queryClient.invalidateQueries({ queryKey: healthRecordsKeys.allergies(data.studentId) });
      }
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.all });
      toast.success('Allergy added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add allergy');
    },
  });
}

/**
 * Update an allergy
 * Note: Uses general health record update (no dedicated allergy update action yet)
 */
export function useUpdateAllergy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const result = await updateHealthRecordAction(id, { errors: {} }, formData);
      if (!result.success && result.errors) {
        throw new Error(result.errors._form?.[0] || 'Failed to update allergy');
      }
      return { id, data: result.data };
    },
    onSuccess: ({ data }: any) => {
      if (data?.studentId) {
        queryClient.invalidateQueries({ queryKey: healthRecordsKeys.allergies(data.studentId) });
      }
      toast.success('Allergy updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update allergy');
    },
  });
}

/**
 * Delete an allergy
 */
export function useDeleteAllergy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteHealthRecordAction(id);
      if (!result.success && result.errors) {
        throw new Error(result.errors._form?.[0] || 'Failed to delete allergy');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.all });
      toast.success('Allergy deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete allergy');
    },
  });
}
