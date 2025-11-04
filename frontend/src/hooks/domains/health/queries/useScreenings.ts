/**
 * WF-COMP-131 | useScreenings.ts - Health screening hooks
 * Purpose: Query and mutation hooks for health screening records
 * Upstream: ../services/modules/healthRecordsApi | Dependencies: @tanstack/react-query, react-hot-toast
 * Downstream: Screening components | Called by: Health record screening views
 * Related: Health records services, screening types
 * Exports: hooks | Key Features: Health screening tracking
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Component mount → Query screenings → Display results
 * LLM Context: Health screening hooks with due date tracking
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  healthRecordsApi as healthRecordsApiService,
  HealthRecordFilters,
} from '@/services';
import type { Screening } from '@/types/healthRecords';
import { HealthRecordsApiError } from './types';
import { healthRecordKeys, STALE_TIME, CACHE_TIME, RETRY_CONFIG } from './healthRecordsConfig';
import { handleQueryError, shouldRetry } from './healthRecordsUtils';

/**
 * Fetches all screenings for a student
 * @param studentId - Student ID
 * @param options - React Query options
 * @returns Query result with screenings
 */
export function useScreenings(
  studentId: string,
  options?: Omit<UseQueryOptions<Screening[], HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Screening[], HealthRecordsApiError>({
    queryKey: healthRecordKeys.screenings(studentId),
    queryFn: () => healthRecordsApiService.getScreenings(studentId),
    enabled: !!studentId,
    staleTime: STALE_TIME.SCREENINGS,
    gcTime: CACHE_TIME.DEFAULT,
    retry: shouldRetry,
    retryDelay: RETRY_CONFIG.DELAY,
    ...options,
  });
}

/**
 * Fetches a single screening by ID
 * @param id - Screening ID
 * @param options - React Query options
 * @returns Query result with screening detail
 */
export function useScreeningDetail(
  id: string,
  options?: Omit<UseQueryOptions<Screening, HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Screening, HealthRecordsApiError>({
    queryKey: healthRecordKeys.screening(id),
    queryFn: async () => {
      // API endpoint not implemented
      throw new HealthRecordsApiError('Screening detail endpoint not implemented', 501);
    },
    enabled: !!id,
    staleTime: STALE_TIME.SCREENINGS,
    gcTime: CACHE_TIME.DEFAULT,
    retry: false,
    ...options,
  });
}

/**
 * Fetches screenings that are due for review
 * @param options - React Query options
 * @returns Query result with screenings due
 */
export function useScreeningsDue(
  options?: Omit<UseQueryOptions<Screening[], HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Screening[], HealthRecordsApiError>({
    queryKey: healthRecordKeys.screeningsDue(),
    queryFn: async () => {
      // This should be a dedicated API endpoint
      throw new HealthRecordsApiError('Screenings due endpoint not implemented', 501);
    },
    enabled: false, // Disabled until endpoint is implemented
    staleTime: STALE_TIME.SCREENINGS,
    gcTime: CACHE_TIME.DEFAULT,
    retry: false,
    ...options,
  });
}

/**
 * Fetches screening statistics
 * @param filters - Filter options
 * @param options - React Query options
 * @returns Query result with statistics
 */
export function useScreeningStatistics(
  filters?: HealthRecordFilters,
  options?: Omit<UseQueryOptions<any, HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<any, HealthRecordsApiError>({
    queryKey: healthRecordKeys.screeningStatistics(filters),
    queryFn: async () => {
      // This should be implemented as a dedicated statistics endpoint
      throw new HealthRecordsApiError('Screening statistics endpoint not implemented', 501);
    },
    enabled: false, // Disabled until endpoint is implemented
    staleTime: STALE_TIME.STATISTICS,
    gcTime: CACHE_TIME.DEFAULT,
    retry: false,
    ...options,
  });
}

/**
 * Creates a new screening record (NO optimistic updates)
 * @param options - React Query mutation options
 * @returns Mutation result
 */
export function useCreateScreening(
  options?: UseMutationOptions<
    Screening,
    HealthRecordsApiError,
    { studentId: string; data: Omit<Screening, 'id' | 'studentId' | 'createdAt'> }
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    Screening,
    HealthRecordsApiError,
    { studentId: string; data: Omit<Screening, 'id' | 'studentId' | 'createdAt'> }
  >({
    mutationFn: ({ studentId, data }) => healthRecordsApiService.createScreening(studentId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.screenings(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.summary(variables.studentId) });

      toast.success('Screening record created successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'creating screening record');
    },
    ...options,
  });
}

/**
 * Updates an existing screening record (NO optimistic updates)
 * @param options - React Query mutation options
 * @returns Mutation result
 */
export function useUpdateScreening(
  options?: UseMutationOptions<
    Screening,
    HealthRecordsApiError,
    { id: string; studentId: string; data: Partial<Omit<Screening, 'id' | 'studentId' | 'createdAt'>> }
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    Screening,
    HealthRecordsApiError,
    { id: string; studentId: string; data: Partial<Omit<Screening, 'id' | 'studentId' | 'createdAt'>> }
  >({
    mutationFn: async ({ id, studentId, data }) => {
      // API doesn't have update endpoint - should be implemented
      throw new HealthRecordsApiError('Screening update endpoint not implemented', 501);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.screenings(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.summary(variables.studentId) });

      toast.success('Screening record updated successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'updating screening record');
    },
    ...options,
  });
}

/**
 * Deletes a screening record
 * @param options - React Query mutation options
 * @returns Mutation result
 */
export function useDeleteScreening(
  options?: UseMutationOptions<void, HealthRecordsApiError, { id: string; studentId: string }>
) {
  const queryClient = useQueryClient();

  return useMutation<void, HealthRecordsApiError, { id: string; studentId: string }>({
    mutationFn: async ({ id, studentId }) => {
      // API doesn't have delete endpoint - should be implemented
      throw new HealthRecordsApiError('Screening delete endpoint not implemented', 501);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.screenings(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.summary(variables.studentId) });

      toast.success('Screening record deleted successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'deleting screening record');
    },
    ...options,
  });
}
