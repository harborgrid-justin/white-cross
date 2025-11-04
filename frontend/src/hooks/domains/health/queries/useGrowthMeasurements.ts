/**
 * WF-COMP-131 | useGrowthMeasurements.ts - Growth measurement hooks
 * Purpose: Query and mutation hooks for growth measurement records
 * Upstream: ../services/modules/healthRecordsApi | Dependencies: @tanstack/react-query, react-hot-toast
 * Downstream: Growth tracking components | Called by: Health record growth views
 * Related: Health records services, growth measurement types
 * Exports: hooks | Key Features: Growth tracking and percentile calculation
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Component mount → Query measurements → Display trends
 * LLM Context: Growth measurement hooks with trend analysis
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { healthRecordsApi as healthRecordsApiService } from '@/services';
import type { GrowthMeasurement } from '@/types/healthRecords';
import { HealthRecordsApiError } from './types';
import { healthRecordKeys, STALE_TIME, CACHE_TIME, RETRY_CONFIG } from './healthRecordsConfig';
import { handleQueryError, shouldRetry } from './healthRecordsUtils';

/**
 * Fetches all growth measurements for a student
 * @param studentId - Student ID
 * @param options - React Query options
 * @returns Query result with growth measurements
 */
export function useGrowthMeasurements(
  studentId: string,
  options?: Omit<UseQueryOptions<GrowthMeasurement[], HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<GrowthMeasurement[], HealthRecordsApiError>({
    queryKey: healthRecordKeys.growth(studentId),
    queryFn: () => healthRecordsApiService.getGrowthMeasurements(studentId),
    enabled: !!studentId,
    staleTime: STALE_TIME.GROWTH,
    gcTime: CACHE_TIME.LONG,
    retry: shouldRetry,
    retryDelay: RETRY_CONFIG.DELAY,
    ...options,
  });
}

/**
 * Fetches a single growth measurement by ID
 * @param id - Measurement ID
 * @param options - React Query options
 * @returns Query result with growth measurement detail
 */
export function useGrowthMeasurementDetail(
  id: string,
  options?: Omit<UseQueryOptions<GrowthMeasurement, HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<GrowthMeasurement, HealthRecordsApiError>({
    queryKey: healthRecordKeys.growthMeasurement(id),
    queryFn: async () => {
      // API endpoint not implemented
      throw new HealthRecordsApiError('Growth measurement detail endpoint not implemented', 501);
    },
    enabled: !!id,
    staleTime: STALE_TIME.GROWTH,
    gcTime: CACHE_TIME.LONG,
    retry: false,
    ...options,
  });
}

/**
 * Fetches growth trends for a student
 * @param studentId - Student ID
 * @param options - React Query options
 * @returns Query result with growth trends
 */
export function useGrowthTrends(
  studentId: string,
  options?: Omit<UseQueryOptions<any, HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<any, HealthRecordsApiError>({
    queryKey: healthRecordKeys.growthTrends(studentId),
    queryFn: async () => {
      const measurements = await healthRecordsApiService.getGrowthMeasurements(studentId);

      // Calculate trends from measurements
      const sorted = [...measurements].sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      return {
        measurements: sorted,
        heightTrend: sorted.map(m => ({ date: m.date, value: parseFloat(m.height) })),
        weightTrend: sorted.map(m => ({ date: m.date, value: parseFloat(m.weight) })),
        bmiTrend: sorted.map(m => ({ date: m.date, value: parseFloat(m.bmi) })),
      };
    },
    enabled: !!studentId,
    staleTime: STALE_TIME.GROWTH,
    gcTime: CACHE_TIME.LONG,
    retry: shouldRetry,
    retryDelay: RETRY_CONFIG.DELAY,
    ...options,
  });
}

/**
 * Fetches growth concerns for a student
 * @param studentId - Student ID
 * @param options - React Query options
 * @returns Query result with growth concerns
 */
export function useGrowthConcerns(
  studentId: string,
  options?: Omit<UseQueryOptions<any[], HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<any[], HealthRecordsApiError>({
    queryKey: healthRecordKeys.growthConcerns(studentId),
    queryFn: async () => {
      // This should be a dedicated API endpoint with medical logic
      throw new HealthRecordsApiError('Growth concerns endpoint not implemented', 501);
    },
    enabled: false, // Disabled until endpoint is implemented
    staleTime: STALE_TIME.GROWTH,
    gcTime: CACHE_TIME.DEFAULT,
    retry: false,
    ...options,
  });
}

/**
 * Fetches growth percentiles for a student
 * @param studentId - Student ID
 * @param options - React Query options
 * @returns Query result with percentiles
 */
export function useGrowthPercentiles(
  studentId: string,
  options?: Omit<UseQueryOptions<any, HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<any, HealthRecordsApiError>({
    queryKey: healthRecordKeys.growthPercentiles(studentId),
    queryFn: async () => {
      const measurements = await healthRecordsApiService.getGrowthMeasurements(studentId);

      // Get latest measurement with percentiles
      const latest = measurements
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

      return latest?.percentiles || null;
    },
    enabled: !!studentId,
    staleTime: STALE_TIME.GROWTH,
    gcTime: CACHE_TIME.LONG,
    retry: shouldRetry,
    retryDelay: RETRY_CONFIG.DELAY,
    ...options,
  });
}

/**
 * Creates a new growth measurement (NO optimistic updates)
 * @param options - React Query mutation options
 * @returns Mutation result
 */
export function useCreateGrowthMeasurement(
  options?: UseMutationOptions<
    GrowthMeasurement,
    HealthRecordsApiError,
    { studentId: string; data: Omit<GrowthMeasurement, 'id' | 'studentId' | 'createdAt'> }
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    GrowthMeasurement,
    HealthRecordsApiError,
    { studentId: string; data: Omit<GrowthMeasurement, 'id' | 'studentId' | 'createdAt'> }
  >({
    mutationFn: ({ studentId, data }) => healthRecordsApiService.createGrowthMeasurement(studentId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.growth(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.growthTrends(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.growthPercentiles(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.summary(variables.studentId) });

      toast.success('Growth measurement added successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'creating growth measurement');
    },
    ...options,
  });
}

/**
 * Updates an existing growth measurement (NO optimistic updates)
 * @param options - React Query mutation options
 * @returns Mutation result
 */
export function useUpdateGrowthMeasurement(
  options?: UseMutationOptions<
    GrowthMeasurement,
    HealthRecordsApiError,
    { id: string; studentId: string; data: Partial<Omit<GrowthMeasurement, 'id' | 'studentId' | 'createdAt'>> }
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    GrowthMeasurement,
    HealthRecordsApiError,
    { id: string; studentId: string; data: Partial<Omit<GrowthMeasurement, 'id' | 'studentId' | 'createdAt'>> }
  >({
    mutationFn: async ({ id, studentId, data }) => {
      // API doesn't have update endpoint - should be implemented
      throw new HealthRecordsApiError('Growth measurement update endpoint not implemented', 501);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.growth(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.growthTrends(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.growthPercentiles(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.summary(variables.studentId) });

      toast.success('Growth measurement updated successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'updating growth measurement');
    },
    ...options,
  });
}

/**
 * Deletes a growth measurement
 * @param options - React Query mutation options
 * @returns Mutation result
 */
export function useDeleteGrowthMeasurement(
  options?: UseMutationOptions<void, HealthRecordsApiError, { id: string; studentId: string }>
) {
  const queryClient = useQueryClient();

  return useMutation<void, HealthRecordsApiError, { id: string; studentId: string }>({
    mutationFn: async ({ id, studentId }) => {
      // API doesn't have delete endpoint - should be implemented
      throw new HealthRecordsApiError('Growth measurement delete endpoint not implemented', 501);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.growth(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.growthTrends(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.growthPercentiles(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.summary(variables.studentId) });

      toast.success('Growth measurement deleted successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'deleting growth measurement');
    },
    ...options,
  });
}
