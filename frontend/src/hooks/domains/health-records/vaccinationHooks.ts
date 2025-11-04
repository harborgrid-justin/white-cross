/**
 * Vaccination Hooks
 *
 * React Query hooks for fetching and managing vaccinations.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { healthRecordsApi } from '../../../services/modules/healthRecordsApi';
import type {
  VaccinationCreate,
  VaccinationUpdate,
} from '../../../services/modules/healthRecordsApi';
import { HEALTH_RECORD_META } from '../../../config/queryClient';
import toast from 'react-hot-toast';
import { healthRecordsKeys } from './queryKeys';

/**
 * Fetch all vaccinations for a student
 */
export function useVaccinations(studentId: string) {
  return useQuery({
    queryKey: healthRecordsKeys.vaccinations(studentId),
    queryFn: () => healthRecordsApi.getVaccinations(studentId),
    enabled: !!studentId,
    meta: HEALTH_RECORD_META,
  });
}

/**
 * Create a new vaccination
 */
export function useCreateVaccination() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VaccinationCreate) => healthRecordsApi.createVaccination(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.vaccinations(variables.studentId) });
      toast.success('Vaccination added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add vaccination');
    },
  });
}

/**
 * Update a vaccination
 */
export function useUpdateVaccination() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: VaccinationUpdate }) =>
      healthRecordsApi.updateVaccination(id, data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.vaccinations(result.studentId) });
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
    mutationFn: (id: string) => healthRecordsApi.deleteVaccination(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.all });
      toast.success('Vaccination deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete vaccination');
    },
  });
}
