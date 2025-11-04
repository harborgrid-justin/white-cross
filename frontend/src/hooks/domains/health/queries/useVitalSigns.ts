/**
 * WF-COMP-131 | useVitalSigns.ts - Vital signs hooks
 * Purpose: Query and mutation hooks for vital signs (REAL-TIME CRITICAL - NO CACHE)
 * Upstream: ../services/modules/healthRecordsApi | Dependencies: @tanstack/react-query, react-hot-toast
 * Downstream: Vital signs components | Called by: Health record vitals views
 * Related: Health records services, vital signs types
 * Exports: hooks | Key Features: Real-time vital signs monitoring
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Component mount → Query vitals → Display real-time data
 * LLM Context: REAL-TIME CRITICAL - Vital signs hooks with NO CACHE
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  healthRecordsApi as healthRecordsApiService,
  HealthRecordFilters,
} from '@/services';
import type { HealthRecord, VitalSigns } from '@/types/healthRecords';
import { HealthRecordsApiError } from './types';
import { healthRecordKeys, STALE_TIME, CACHE_TIME, RETRY_CONFIG } from './healthRecordsConfig';
import { handleQueryError, shouldRetry } from './healthRecordsUtils';

/**
 * Fetches vital signs for a student (NO CACHE - real-time critical)
 * @param studentId - Student ID
 * @param filters - Optional filters
 * @param options - React Query options
 * @returns Query result with vital signs
 */
export function useVitalSigns(
  studentId: string,
  filters?: HealthRecordFilters,
  options?: Omit<UseQueryOptions<VitalSigns[], HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<VitalSigns[], HealthRecordsApiError>({
    queryKey: healthRecordKeys.vitals(studentId, filters),
    queryFn: () => healthRecordsApiService.getRecentVitals(studentId, 100), // Get more for filtering
    enabled: !!studentId,
    staleTime: STALE_TIME.VITALS, // NO CACHE - always fetch fresh
    gcTime: CACHE_TIME.CRITICAL,  // NO CACHE
    retry: shouldRetry,
    retryDelay: RETRY_CONFIG.DELAY,
    ...options,
  });
}

/**
 * Fetches latest vital signs for a student
 * @param studentId - Student ID
 * @param options - React Query options
 * @returns Query result with latest vitals
 */
export function useLatestVitals(
  studentId: string,
  options?: Omit<UseQueryOptions<VitalSigns | undefined, HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<VitalSigns | undefined, HealthRecordsApiError>({
    queryKey: healthRecordKeys.latestVitals(studentId),
    queryFn: async () => {
      const vitals = await healthRecordsApiService.getRecentVitals(studentId, 1);
      return vitals[0];
    },
    enabled: !!studentId,
    staleTime: STALE_TIME.VITALS,
    gcTime: CACHE_TIME.CRITICAL,
    retry: shouldRetry,
    retryDelay: RETRY_CONFIG.DELAY,
    ...options,
  });
}

/**
 * Fetches vital sign trends for analysis
 * @param studentId - Student ID
 * @param type - Type of vital sign to analyze
 * @param options - React Query options
 * @returns Query result with trend data
 */
export function useVitalTrends(
  studentId: string,
  type?: string,
  options?: Omit<UseQueryOptions<any, HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<any, HealthRecordsApiError>({
    queryKey: healthRecordKeys.vitalTrends(studentId, type),
    queryFn: async () => {
      // This should be a dedicated analytics endpoint
      throw new HealthRecordsApiError('Vital trends endpoint not implemented', 501);
    },
    enabled: false, // Disabled until endpoint is implemented
    staleTime: STALE_TIME.VITALS,
    gcTime: CACHE_TIME.DEFAULT,
    retry: false,
    ...options,
  });
}

/**
 * Records new vital signs (NO optimistic updates)
 * @param options - React Query mutation options
 * @returns Mutation result
 */
export function useCreateVitalSigns(
  options?: UseMutationOptions<
    HealthRecord,
    HealthRecordsApiError,
    { studentId: string; vitals: VitalSigns }
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    HealthRecord,
    HealthRecordsApiError,
    { studentId: string; vitals: VitalSigns }
  >({
    mutationFn: ({ studentId, vitals }) => healthRecordsApiService.recordVitals(studentId, vitals),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.vitals(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.latestVitals(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.records(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.summary(variables.studentId) });

      toast.success('Vital signs recorded successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'recording vital signs');
    },
    ...options,
  });
}

/**
 * Updates existing vital signs (NO optimistic updates)
 * @param options - React Query mutation options
 * @returns Mutation result
 */
export function useUpdateVitalSigns(
  options?: UseMutationOptions<
    HealthRecord,
    HealthRecordsApiError,
    { id: string; studentId: string; vitals: Partial<VitalSigns> }
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    HealthRecord,
    HealthRecordsApiError,
    { id: string; studentId: string; vitals: Partial<VitalSigns> }
  >({
    mutationFn: async ({ id, studentId, vitals }) => {
      // API doesn't have update vitals endpoint - should be implemented
      throw new HealthRecordsApiError('Vital signs update endpoint not implemented', 501);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.vitals(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.latestVitals(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.summary(variables.studentId) });

      toast.success('Vital signs updated successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'updating vital signs');
    },
    ...options,
  });
}

/**
 * Deletes vital signs record
 * @param options - React Query mutation options
 * @returns Mutation result
 */
export function useDeleteVitalSigns(
  options?: UseMutationOptions<void, HealthRecordsApiError, { id: string; studentId: string }>
) {
  const queryClient = useQueryClient();

  return useMutation<void, HealthRecordsApiError, { id: string; studentId: string }>({
    mutationFn: async ({ id, studentId }) => {
      // API doesn't have delete vitals endpoint - should be implemented
      throw new HealthRecordsApiError('Vital signs delete endpoint not implemented', 501);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.vitals(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.latestVitals(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.summary(variables.studentId) });

      toast.success('Vital signs deleted successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'deleting vital signs');
    },
    ...options,
  });
}

/**
 * Alias for useVitalSigns - fetches recent vitals for a student
 * @deprecated Use useVitalSigns instead
 */
export const useRecentVitals = useVitalSigns;

/**
 * Alias for useCreateVitalSigns - records new vital signs
 * @deprecated Use useCreateVitalSigns instead
 */
export const useRecordVitals = useCreateVitalSigns;
