/**
 * Allergy Hooks
 *
 * React Query hooks for fetching and managing allergies.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { healthRecordsApi } from '../../../services/modules/healthRecordsApi';
import type {
  AllergyCreate,
  AllergyUpdate,
} from '../../../services/modules/healthRecordsApi';
import { HEALTH_RECORD_META } from '../../../config/queryClient';
import toast from 'react-hot-toast';
import { healthRecordsKeys } from './queryKeys';

/**
 * Fetch all allergies for a student
 */
export function useAllergies(studentId: string) {
  return useQuery({
    queryKey: healthRecordsKeys.allergies(studentId),
    queryFn: () => healthRecordsApi.getAllergies(studentId),
    enabled: !!studentId,
    meta: HEALTH_RECORD_META,
  });
}

/**
 * Create a new allergy
 */
export function useCreateAllergy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AllergyCreate) => healthRecordsApi.createAllergy(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.allergies(variables.studentId) });
      toast.success('Allergy added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add allergy');
    },
  });
}

/**
 * Update an allergy
 */
export function useUpdateAllergy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AllergyUpdate }) =>
      healthRecordsApi.updateAllergy(id, data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.allergies(result.studentId) });
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
    mutationFn: (id: string) => healthRecordsApi.deleteAllergy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.all });
      toast.success('Allergy deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete allergy');
    },
  });
}
