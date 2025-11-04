/**
 * Health Records Hooks
 *
 * React Query hooks for fetching and managing health records.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { healthRecordsApi } from '../../../services/modules/healthRecordsApi';
import type {
  HealthRecordFilters,
  HealthRecordCreate,
  HealthRecordUpdate,
} from '../../../services/modules/healthRecordsApi';
import { HEALTH_RECORD_META } from '../../../config/queryClient';
import toast from 'react-hot-toast';
import { healthRecordsKeys } from './queryKeys';

/**
 * Fetch all health records for a student
 */
export function useHealthRecords(studentId: string, filters?: HealthRecordFilters) {
  return useQuery({
    queryKey: [...healthRecordsKeys.records(studentId), filters],
    queryFn: () => healthRecordsApi.getRecords(studentId, filters),
    enabled: !!studentId,
    meta: HEALTH_RECORD_META,
  });
}

/**
 * Fetch a single health record by ID
 */
export function useHealthRecord(id: string) {
  return useQuery({
    queryKey: healthRecordsKeys.record(id),
    queryFn: () => healthRecordsApi.getRecordById(id),
    enabled: !!id,
    meta: HEALTH_RECORD_META,
  });
}

/**
 * Create a new health record
 */
export function useCreateHealthRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: HealthRecordCreate) => healthRecordsApi.createRecord(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.records(variables.studentId) });
      toast.success('Health record created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create health record');
    },
  });
}

/**
 * Update a health record
 */
export function useUpdateHealthRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: HealthRecordUpdate }) =>
      healthRecordsApi.updateRecord(id, data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.records(result.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.record(result.id) });
      toast.success('Health record updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update health record');
    },
  });
}

/**
 * Delete a health record
 */
export function useDeleteHealthRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => healthRecordsApi.deleteRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.all });
      toast.success('Health record deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete health record');
    },
  });
}
