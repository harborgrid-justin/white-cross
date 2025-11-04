/**
 * Screening Hooks
 *
 * React Query hooks for fetching and managing screenings.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { healthRecordsApi } from '../../../services/modules/healthRecordsApi';
import type {
  ScreeningCreate,
  ScreeningUpdate,
} from '../../../services/modules/healthRecordsApi';
import { HEALTH_RECORD_META } from '../../../config/queryClient';
import toast from 'react-hot-toast';
import { healthRecordsKeys } from './queryKeys';

/**
 * Fetch screenings for a student
 */
export function useScreenings(studentId: string) {
  return useQuery({
    queryKey: healthRecordsKeys.screenings(studentId),
    queryFn: () => healthRecordsApi.getScreenings(studentId),
    enabled: !!studentId,
    meta: HEALTH_RECORD_META,
  });
}

/**
 * Create a new screening
 */
export function useCreateScreening() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ScreeningCreate) => healthRecordsApi.createScreening(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.screenings(variables.studentId) });
      toast.success('Screening added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add screening');
    },
  });
}

/**
 * Update a screening
 */
export function useUpdateScreening() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ScreeningUpdate }) =>
      healthRecordsApi.updateScreening(id, data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.screenings(result.studentId) });
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
    mutationFn: (id: string) => healthRecordsApi.deleteScreening(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.all });
      toast.success('Screening deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete screening');
    },
  });
}
