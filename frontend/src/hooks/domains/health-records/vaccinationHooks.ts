/**
 * Vaccination Hooks
 *
 * React Query hooks for fetching and managing vaccinations (immunizations).
 * Migrated to use server actions instead of deprecated healthRecordsApi.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createImmunizationAction } from '@/lib/actions/health-records.immunizations';
import {
  getHealthRecordsAction,
  updateHealthRecordAction,
  deleteHealthRecordAction
} from '@/lib/actions/health-records.crud';
import { HEALTH_RECORD_META } from '../../../config/queryClient';
import toast from 'react-hot-toast';
import { healthRecordsKeys } from './queryKeys';

/**
 * Fetch all vaccinations for a student
 */
export function useVaccinations(studentId: string) {
  return useQuery({
    queryKey: healthRecordsKeys.vaccinations(studentId),
    queryFn: async () => {
      const result = await getHealthRecordsAction(studentId, 'IMMUNIZATION');
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch vaccinations');
      }
      return result.data || [];
    },
    enabled: !!studentId,
    meta: HEALTH_RECORD_META,
  });
}

/**
 * Create a new vaccination
 * Note: Uses dedicated immunization server action
 */
export function useCreateVaccination() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await createImmunizationAction({ errors: {} }, formData);
      if (!result.success && result.errors) {
        throw new Error(result.errors._form?.[0] || 'Failed to add vaccination');
      }
      return result.data;
    },
    onSuccess: (data: any) => {
      if (data?.studentId) {
        queryClient.invalidateQueries({ queryKey: healthRecordsKeys.vaccinations(data.studentId) });
      }
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.all });
      toast.success('Vaccination added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add vaccination');
    },
  });
}

/**
 * Update a vaccination
 * Note: Uses general health record update (no dedicated immunization update action yet)
 */
export function useUpdateVaccination() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const result = await updateHealthRecordAction(id, { errors: {} }, formData);
      if (!result.success && result.errors) {
        throw new Error(result.errors._form?.[0] || 'Failed to update vaccination');
      }
      return { id, data: result.data };
    },
    onSuccess: ({ data }: any) => {
      if (data?.studentId) {
        queryClient.invalidateQueries({ queryKey: healthRecordsKeys.vaccinations(data.studentId) });
      }
      toast.success('Vaccination updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update vaccination');
    },
  });
}

/**
 * Delete a vaccination
 */
export function useDeleteVaccination() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteHealthRecordAction(id);
      if (!result.success && result.errors) {
        throw new Error(result.errors._form?.[0] || 'Failed to delete vaccination');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.all });
      toast.success('Vaccination deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete vaccination');
    },
  });
}
