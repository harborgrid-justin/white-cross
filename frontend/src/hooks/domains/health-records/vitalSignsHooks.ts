/**
 * Vital Signs Hooks
 *
 * React Query hooks for fetching and managing vital signs.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { healthRecordsApi } from '../../../services/modules/healthRecordsApi';
import type {
  VitalSignsCreate,
  VitalSignsUpdate,
} from '../../../services/modules/healthRecordsApi';
import { HEALTH_RECORD_META } from '../../../config/queryClient';
import toast from 'react-hot-toast';
import { healthRecordsKeys } from './queryKeys';

/**
 * Fetch vital signs for a student
 */
export function useVitalSigns(studentId: string) {
  return useQuery({
    queryKey: healthRecordsKeys.vitalSigns(studentId),
    queryFn: () => healthRecordsApi.getVitalSigns(studentId),
    enabled: !!studentId,
    meta: HEALTH_RECORD_META,
  });
}

/**
 * Create new vital signs record
 */
export function useCreateVitalSigns() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VitalSignsCreate) => healthRecordsApi.createVitalSigns(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.vitalSigns(variables.studentId) });
      toast.success('Vital signs recorded successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to record vital signs');
    },
  });
}

/**
 * Update vital signs
 */
export function useUpdateVitalSigns() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: VitalSignsUpdate }) =>
      healthRecordsApi.updateVitalSigns(id, data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.vitalSigns(result.studentId) });
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
    mutationFn: (id: string) => healthRecordsApi.deleteVitalSigns(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.all });
      toast.success('Vital signs deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete vital signs');
    },
  });
}
