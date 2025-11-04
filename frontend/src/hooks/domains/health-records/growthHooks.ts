/**
 * Growth Measurement Hooks
 *
 * React Query hooks for fetching and managing growth measurements.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { healthRecordsApi } from '../../../services/modules/healthRecordsApi';
import type {
  GrowthMeasurementCreate,
  GrowthMeasurementUpdate,
} from '../../../services/modules/healthRecordsApi';
import { HEALTH_RECORD_META } from '../../../config/queryClient';
import toast from 'react-hot-toast';
import { healthRecordsKeys } from './queryKeys';

/**
 * Fetch growth measurements for a student
 */
export function useGrowthMeasurements(studentId: string) {
  return useQuery({
    queryKey: healthRecordsKeys.growthMeasurements(studentId),
    queryFn: () => healthRecordsApi.getGrowthMeasurements(studentId),
    enabled: !!studentId,
    meta: HEALTH_RECORD_META,
  });
}

/**
 * Create a new growth measurement
 */
export function useCreateGrowthMeasurement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GrowthMeasurementCreate) => healthRecordsApi.createGrowthMeasurement(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.growthMeasurements(variables.studentId) });
      toast.success('Growth measurement added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add growth measurement');
    },
  });
}

/**
 * Update a growth measurement
 */
export function useUpdateGrowthMeasurement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: GrowthMeasurementUpdate }) =>
      healthRecordsApi.updateGrowthMeasurement(id, data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.growthMeasurements(result.studentId) });
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
    mutationFn: (id: string) => healthRecordsApi.deleteGrowthMeasurement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.all });
      toast.success('Growth measurement deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete growth measurement');
    },
  });
}
