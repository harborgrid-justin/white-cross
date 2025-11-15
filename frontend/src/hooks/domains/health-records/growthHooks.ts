/**
 * Growth Measurement Hooks
 *
 * React Query hooks for fetching and managing growth measurements.
 * Migrated to use server actions instead of deprecated healthRecordsApi.
 * Note: Uses general health records actions since no dedicated growth measurement actions exist yet.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getHealthRecordsAction,
  createHealthRecordAction,
  updateHealthRecordAction,
  deleteHealthRecordAction
} from '@/lib/actions/health-records.crud';
import { HEALTH_RECORD_META } from '../../../config/queryClient';
import toast from 'react-hot-toast';
import { healthRecordsKeys } from './queryKeys';

/**
 * Fetch growth measurements for a student
 */
export function useGrowthMeasurements(studentId: string) {
  return useQuery({
    queryKey: healthRecordsKeys.growthMeasurements(studentId),
    queryFn: async () => {
      const result = await getHealthRecordsAction(studentId, 'GROWTH_MEASUREMENT');
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch growth measurements');
      }
      return result.data || [];
    },
    enabled: !!studentId,
    meta: HEALTH_RECORD_META,
  });
}

/**
 * Create a new growth measurement
 * Note: Uses general health record creation with recordType='GROWTH_MEASUREMENT'
 */
export function useCreateGrowthMeasurement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      // Ensure recordType is set to GROWTH_MEASUREMENT
      formData.set('recordType', 'GROWTH_MEASUREMENT');
      const result = await createHealthRecordAction({ errors: {} }, formData);
      if (!result.success && result.errors) {
        throw new Error(result.errors._form?.[0] || 'Failed to add growth measurement');
      }
      return result.data;
    },
    onSuccess: (data: any) => {
      if (data?.studentId) {
        queryClient.invalidateQueries({ queryKey: healthRecordsKeys.growthMeasurements(data.studentId) });
      }
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.all });
      toast.success('Growth measurement added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add growth measurement');
    },
  });
}

/**
 * Update a growth measurement
 * Note: Uses general health record update
 */
export function useUpdateGrowthMeasurement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const result = await updateHealthRecordAction(id, { errors: {} }, formData);
      if (!result.success && result.errors) {
        throw new Error(result.errors._form?.[0] || 'Failed to update growth measurement');
      }
      return { id, data: result.data };
    },
    onSuccess: ({ data }: any) => {
      if (data?.studentId) {
        queryClient.invalidateQueries({ queryKey: healthRecordsKeys.growthMeasurements(data.studentId) });
      }
      toast.success('Growth measurement updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update growth measurement');
    },
  });
}

/**
 * Delete a growth measurement
 */
export function useDeleteGrowthMeasurement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteHealthRecordAction(id);
      if (!result.success && result.errors) {
        throw new Error(result.errors._form?.[0] || 'Failed to delete growth measurement');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.all });
      toast.success('Growth measurement deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete growth measurement');
    },
  });
}
