/**
 * Health Records Hooks
 *
 * React Query hooks for fetching and managing health records.
 * Migrated to use server actions instead of deprecated healthRecordsApi.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getHealthRecords, getHealthRecordById } from '@/lib/actions/health-records.cache';
import {
  createHealthRecordAction,
  updateHealthRecordAction,
  deleteHealthRecordAction
} from '@/lib/actions/health-records.crud';
import { HEALTH_RECORD_META } from '../../../config/queryClient';
import toast from 'react-hot-toast';
import { healthRecordsKeys } from './queryKeys';

/**
 * Fetch all health records for a student
 */
export function useHealthRecords(studentId: string) {
  return useQuery({
    queryKey: healthRecordsKeys.records(studentId),
    queryFn: async () => {
      const records = await getHealthRecords(studentId);
      return records;
    },
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
    queryFn: async () => {
      const record = await getHealthRecordById(id);
      return record;
    },
    enabled: !!id,
    meta: HEALTH_RECORD_META,
  });
}

/**
 * Create a new health record
 * Note: Uses server action pattern with useActionState for form handling
 */
export function useCreateHealthRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await createHealthRecordAction({ errors: {} }, formData);
      if (!result.success && result.errors) {
        throw new Error(result.errors._form?.[0] || 'Failed to create health record');
      }
      return result.data;
    },
    onSuccess: (data: any) => {
      if (data?.studentId) {
        queryClient.invalidateQueries({ queryKey: healthRecordsKeys.records(data.studentId) });
      }
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.all });
      toast.success('Health record created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create health record');
    },
  });
}

/**
 * Update a health record
 * Note: Uses server action pattern with useActionState for form handling
 */
export function useUpdateHealthRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const result = await updateHealthRecordAction(id, { errors: {} }, formData);
      if (!result.success && result.errors) {
        throw new Error(result.errors._form?.[0] || 'Failed to update health record');
      }
      return { id, data: result.data };
    },
    onSuccess: ({ id, data }: any) => {
      if (data?.studentId) {
        queryClient.invalidateQueries({ queryKey: healthRecordsKeys.records(data.studentId) });
      }
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.record(id) });
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
    mutationFn: async (id: string) => {
      const result = await deleteHealthRecordAction(id);
      if (!result.success && result.errors) {
        throw new Error(result.errors._form?.[0] || 'Failed to delete health record');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.all });
      toast.success('Health record deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete health record');
    },
  });
}
