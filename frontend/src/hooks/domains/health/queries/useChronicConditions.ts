/**
 * WF-COMP-131 | useChronicConditions.ts - Chronic condition hooks
 * Purpose: Query and mutation hooks for chronic condition records
 * Upstream: ../services/modules/healthRecordsApi | Dependencies: @tanstack/react-query, react-hot-toast
 * Downstream: Chronic condition components | Called by: Health record condition views
 * Related: Health records services, chronic condition types
 * Exports: hooks | Key Features: Chronic condition management
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Component mount → Query conditions → Display status
 * LLM Context: Chronic condition hooks with status tracking
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  healthRecordsApi as healthRecordsApiService,
  HealthRecordFilters,
  CreateChronicConditionRequest,
} from '@/services';
import type { ChronicCondition } from '@/types/healthRecords';
import { HealthRecordsApiError } from './types';
import { healthRecordKeys, STALE_TIME, CACHE_TIME, RETRY_CONFIG } from './healthRecordsConfig';
import { handleQueryError, shouldRetry } from './healthRecordsUtils';

/**
 * Fetches all chronic conditions for a student
 * @param studentId - Student ID
 * @param options - React Query options
 * @returns Query result with chronic conditions
 */
export function useChronicConditions(
  studentId: string,
  options?: Omit<UseQueryOptions<ChronicCondition[], HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<ChronicCondition[], HealthRecordsApiError>({
    queryKey: healthRecordKeys.chronicConditions(studentId),
    queryFn: () => healthRecordsApiService.getStudentChronicConditions(studentId),
    enabled: !!studentId,
    staleTime: STALE_TIME.CHRONIC_CONDITIONS,
    gcTime: CACHE_TIME.DEFAULT,
    retry: shouldRetry,
    retryDelay: RETRY_CONFIG.DELAY,
    ...options,
  });
}

/**
 * Fetches a single chronic condition by ID
 * @param id - Condition ID
 * @param options - React Query options
 * @returns Query result with condition detail
 */
export function useConditionDetail(
  id: string,
  options?: Omit<UseQueryOptions<ChronicCondition, HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<ChronicCondition, HealthRecordsApiError>({
    queryKey: healthRecordKeys.condition(id),
    queryFn: async () => {
      // API endpoint not implemented - should be added
      throw new HealthRecordsApiError('Condition detail endpoint not implemented', 501);
    },
    enabled: !!id,
    staleTime: STALE_TIME.CHRONIC_CONDITIONS,
    gcTime: CACHE_TIME.DEFAULT,
    retry: false,
    ...options,
  });
}

/**
 * Fetches active chronic conditions only
 * @param studentId - Student ID
 * @param options - React Query options
 * @returns Query result with active conditions
 */
export function useActiveConditions(
  studentId: string,
  options?: Omit<UseQueryOptions<ChronicCondition[], HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<ChronicCondition[], HealthRecordsApiError>({
    queryKey: healthRecordKeys.activeConditions(studentId),
    queryFn: async () => {
      const conditions = await healthRecordsApiService.getStudentChronicConditions(studentId);
      return conditions.filter(condition => condition.status === 'ACTIVE');
    },
    enabled: !!studentId,
    staleTime: STALE_TIME.CHRONIC_CONDITIONS,
    gcTime: CACHE_TIME.DEFAULT,
    retry: shouldRetry,
    retryDelay: RETRY_CONFIG.DELAY,
    ...options,
  });
}

/**
 * Fetches conditions needing review
 * @param options - React Query options
 * @returns Query result with conditions needing review
 */
export function useConditionsNeedingReview(
  options?: Omit<UseQueryOptions<ChronicCondition[], HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<ChronicCondition[], HealthRecordsApiError>({
    queryKey: healthRecordKeys.conditionsNeedingReview(),
    queryFn: async () => {
      // This should be a dedicated API endpoint
      throw new HealthRecordsApiError('Conditions needing review endpoint not implemented', 501);
    },
    enabled: false, // Disabled until endpoint is implemented
    staleTime: STALE_TIME.CHRONIC_CONDITIONS,
    gcTime: CACHE_TIME.DEFAULT,
    retry: false,
    ...options,
  });
}

/**
 * Fetches chronic condition statistics
 * @param filters - Filter options
 * @param options - React Query options
 * @returns Query result with statistics
 */
export function useConditionStatistics(
  filters?: HealthRecordFilters,
  options?: Omit<UseQueryOptions<any, HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<any, HealthRecordsApiError>({
    queryKey: healthRecordKeys.conditionStatistics(filters),
    queryFn: async () => {
      // This should be implemented as a dedicated statistics endpoint
      throw new HealthRecordsApiError('Condition statistics endpoint not implemented', 501);
    },
    enabled: false, // Disabled until endpoint is implemented
    staleTime: STALE_TIME.STATISTICS,
    gcTime: CACHE_TIME.DEFAULT,
    retry: false,
    ...options,
  });
}

/**
 * Creates a new chronic condition (NO optimistic updates)
 * @param options - React Query mutation options
 * @returns Mutation result
 */
export function useCreateCondition(
  options?: UseMutationOptions<ChronicCondition, HealthRecordsApiError, CreateChronicConditionRequest>
) {
  const queryClient = useQueryClient();

  return useMutation<ChronicCondition, HealthRecordsApiError, CreateChronicConditionRequest>({
    mutationFn: (data) => healthRecordsApiService.createChronicCondition(data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.chronicConditions(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.activeConditions(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.summary(variables.studentId) });

      toast.success('Chronic condition added successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'creating chronic condition');
    },
    ...options,
  });
}

/**
 * Updates an existing chronic condition (NO optimistic updates)
 * @param options - React Query mutation options
 * @returns Mutation result
 */
export function useUpdateCondition(
  options?: UseMutationOptions<
    ChronicCondition,
    HealthRecordsApiError,
    { id: string; data: Partial<CreateChronicConditionRequest> }
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    ChronicCondition,
    HealthRecordsApiError,
    { id: string; data: Partial<CreateChronicConditionRequest> }
  >({
    mutationFn: ({ id, data }) => healthRecordsApiService.updateChronicCondition(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.chronicConditions(data.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.activeConditions(data.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.summary(data.studentId) });

      toast.success('Chronic condition updated successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'updating chronic condition');
    },
    ...options,
  });
}

/**
 * Deletes a chronic condition
 * @param options - React Query mutation options
 * @returns Mutation result
 */
export function useDeleteCondition(
  options?: UseMutationOptions<void, HealthRecordsApiError, { id: string; studentId: string }>
) {
  const queryClient = useQueryClient();

  return useMutation<void, HealthRecordsApiError, { id: string; studentId: string }>({
    mutationFn: ({ id, studentId }) => healthRecordsApiService.deleteChronicCondition(id, studentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.chronicConditions(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.activeConditions(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.summary(variables.studentId) });

      toast.success('Chronic condition deleted successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'deleting chronic condition');
    },
    ...options,
  });
}

/**
 * Updates chronic condition status
 * @param options - React Query mutation options
 * @returns Mutation result
 */
export function useUpdateConditionStatus(
  options?: UseMutationOptions<
    ChronicCondition,
    HealthRecordsApiError,
    { id: string; status: ChronicCondition['status'] }
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    ChronicCondition,
    HealthRecordsApiError,
    { id: string; status: ChronicCondition['status'] }
  >({
    mutationFn: ({ id, status }) => healthRecordsApiService.updateChronicCondition(id, { status }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.chronicConditions(data.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.activeConditions(data.studentId) });

      toast.success('Condition status updated successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'updating condition status');
    },
    ...options,
  });
}
