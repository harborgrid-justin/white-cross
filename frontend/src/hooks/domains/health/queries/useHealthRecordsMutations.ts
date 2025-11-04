/**
 * WF-COMP-131 | useHealthRecordsMutations.ts - Core health records mutation hooks
 * Purpose: Write operations for health records (create, update, delete, import/export)
 * Upstream: ../services/modules/healthRecordsApi | Dependencies: @tanstack/react-query, react-hot-toast
 * Downstream: Components, pages | Called by: Health record forms
 * Related: Health records services, types
 * Exports: mutation hooks | Key Features: useMutation hooks
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: User action → Mutation → Server update → Cache invalidation
 * LLM Context: Core health records write operations with NO optimistic updates
 */

import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  healthRecordsApi as healthRecordsApiService,
  CreateHealthRecordRequest,
} from '@/services';
import type { HealthRecord } from '@/types/healthRecords';
import { HealthRecordsApiError } from './types';
import { healthRecordKeys } from './healthRecordsConfig';
import { handleQueryError } from './healthRecordsUtils';

/**
 * Creates a new health record (NO optimistic updates for healthcare safety)
 * @param options - React Query mutation options
 * @returns Mutation result
 */
export function useCreateHealthRecord(
  options?: UseMutationOptions<HealthRecord, HealthRecordsApiError, CreateHealthRecordRequest>
) {
  const queryClient = useQueryClient();

  return useMutation<HealthRecord, HealthRecordsApiError, CreateHealthRecordRequest>({
    mutationFn: (data) => healthRecordsApiService.createHealthRecord(data),
    onSuccess: (data, variables) => {
      // Invalidate and refetch - NO optimistic updates for healthcare data
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.records(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.summary(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.timeline(variables.studentId) });

      toast.success('Health record created successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'creating health record');
    },
    ...options,
  });
}

/**
 * Updates an existing health record (NO optimistic updates)
 * @param options - React Query mutation options
 * @returns Mutation result
 */
export function useUpdateHealthRecord(
  options?: UseMutationOptions<
    HealthRecord,
    HealthRecordsApiError,
    { id: string; data: Partial<CreateHealthRecordRequest> }
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    HealthRecord,
    HealthRecordsApiError,
    { id: string; data: Partial<CreateHealthRecordRequest> }
  >({
    mutationFn: ({ id, data }) => healthRecordsApiService.updateHealthRecord(id, data),
    onSuccess: (data, variables) => {
      // Update cache after successful server response
      queryClient.setQueryData(healthRecordKeys.record(variables.id), data);
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.records(data.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.summary(data.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.timeline(data.studentId) });

      toast.success('Health record updated successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'updating health record');
    },
    ...options,
  });
}

/**
 * Deletes a health record
 * @param options - React Query mutation options
 * @returns Mutation result
 */
export function useDeleteHealthRecord(
  options?: UseMutationOptions<void, HealthRecordsApiError, string>
) {
  const queryClient = useQueryClient();

  return useMutation<void, HealthRecordsApiError, string>({
    mutationFn: (id) => healthRecordsApiService.deleteHealthRecord(id),
    onSuccess: (_, id) => {
      // Remove from cache and invalidate related queries
      queryClient.removeQueries({ queryKey: healthRecordKeys.record(id) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.all });

      toast.success('Health record deleted successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'deleting health record');
    },
    ...options,
  });
}

/**
 * Exports health records to specified format
 * @param options - React Query mutation options
 * @returns Mutation result
 */
export function useExportHealthRecords(
  options?: UseMutationOptions<Blob, HealthRecordsApiError, { studentId: string; format: 'pdf' | 'json' }>
) {
  return useMutation<Blob, HealthRecordsApiError, { studentId: string; format: 'pdf' | 'json' }>({
    mutationFn: ({ studentId, format }) => healthRecordsApiService.exportHealthHistory(studentId, format),
    onSuccess: (blob, variables) => {
      // Trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `health-records-${variables.studentId}-${new Date().toISOString().split('T')[0]}.${variables.format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Health records exported successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'exporting health records');
    },
    ...options,
  });
}

/**
 * Imports health records from file
 * @param options - React Query mutation options
 * @returns Mutation result
 */
export function useImportHealthRecords(
  options?: UseMutationOptions<
    { imported: number; errors: any[] },
    HealthRecordsApiError,
    { studentId: string; file: File }
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    { imported: number; errors: any[] },
    HealthRecordsApiError,
    { studentId: string; file: File }
  >({
    mutationFn: ({ studentId, file }) => healthRecordsApiService.importHealthRecords(studentId, file),
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.all });

      if (result.errors.length > 0) {
        toast.success(
          `Imported ${result.imported} records with ${result.errors.length} errors. Check console for details.`,
          { duration: 6000 }
        );
        console.error('Import errors:', result.errors);
      } else {
        toast.success(`Successfully imported ${result.imported} health records`);
      }
    },
    onError: (error) => {
      handleQueryError(error, 'importing health records');
    },
    ...options,
  });
}

/**
 * Alias for useExportHealthRecords - exports health history
 * @deprecated Use useExportHealthRecords instead
 */
export const useExportHealthHistory = useExportHealthRecords;
