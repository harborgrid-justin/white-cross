/**
 * WF-COMP-131 | useAllergies.ts - Allergy-related hooks
 * Purpose: Query and mutation hooks for allergy records (SAFETY CRITICAL - NO CACHE)
 * Upstream: ../services/modules/healthRecordsApi | Dependencies: @tanstack/react-query, react-hot-toast
 * Downstream: Allergy components | Called by: Health record allergy views
 * Related: Health records services, allergy types
 * Exports: hooks | Key Features: Safety-critical allergy management
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Component mount → Query allergies → Display warnings
 * LLM Context: SAFETY CRITICAL - Allergy hooks with NO CACHE for patient safety
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  healthRecordsApi as healthRecordsApiService,
  HealthRecordFilters,
  CreateAllergyRequest,
} from '@/services';
import type { Allergy } from '@/types/healthRecords';
import { HealthRecordsApiError } from './types';
import { healthRecordKeys, STALE_TIME, CACHE_TIME } from './healthRecordsConfig';
import { handleQueryError, shouldRetry } from './healthRecordsUtils';

/**
 * Fetches all allergies for a student (NO CACHE - safety critical)
 * @param studentId - Student ID
 * @param options - React Query options
 * @returns Query result with allergies
 */
export function useAllergies(
  studentId: string,
  options?: Omit<UseQueryOptions<Allergy[], HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Allergy[], HealthRecordsApiError>({
    queryKey: healthRecordKeys.allergies(studentId),
    queryFn: () => healthRecordsApiService.getStudentAllergies(studentId),
    enabled: !!studentId,
    staleTime: STALE_TIME.ALLERGIES, // NO CACHE - always fetch fresh
    gcTime: CACHE_TIME.CRITICAL,     // NO CACHE
    retry: shouldRetry,
    ...options,
  });
}

/**
 * Fetches a single allergy by ID
 * @param id - Allergy ID
 * @param options - React Query options
 * @returns Query result with allergy detail
 */
export function useAllergyDetail(
  id: string,
  options?: Omit<UseQueryOptions<Allergy, HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Allergy, HealthRecordsApiError>({
    queryKey: healthRecordKeys.allergy(id),
    queryFn: async () => {
      // Since API doesn't have direct allergy detail endpoint, we'll need to implement this
      // For now, throw error - this should be implemented in the API
      throw new HealthRecordsApiError('Allergy detail endpoint not implemented', 501);
    },
    enabled: !!id,
    staleTime: STALE_TIME.ALLERGIES,
    gcTime: CACHE_TIME.CRITICAL,
    retry: false,
    ...options,
  });
}

/**
 * Fetches life-threatening allergies only
 * @param studentId - Student ID
 * @param options - React Query options
 * @returns Query result with critical allergies
 */
export function useCriticalAllergies(
  studentId: string,
  options?: Omit<UseQueryOptions<Allergy[], HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Allergy[], HealthRecordsApiError>({
    queryKey: healthRecordKeys.criticalAllergies(studentId),
    queryFn: async () => {
      const allergies = await healthRecordsApiService.getStudentAllergies(studentId);
      return allergies.filter(allergy => allergy.severity === 'LIFE_THREATENING');
    },
    enabled: !!studentId,
    staleTime: STALE_TIME.ALLERGIES,
    gcTime: CACHE_TIME.CRITICAL,
    retry: shouldRetry,
    ...options,
  });
}

/**
 * Checks for allergy contraindications with a medication
 * @param studentId - Student ID
 * @param medicationId - Medication ID to check
 * @param options - React Query options
 * @returns Query result with contraindications
 */
export function useAllergyContraindications(
  studentId: string,
  medicationId: string | undefined,
  options?: Omit<UseQueryOptions<Allergy[], HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Allergy[], HealthRecordsApiError>({
    queryKey: healthRecordKeys.allergyContraindications(studentId, medicationId),
    queryFn: async () => {
      // This would require medication data - implement based on medication API integration
      const allergies = await healthRecordsApiService.getStudentAllergies(studentId);
      // Filter allergies that contraindicate with the medication
      // This logic should be implemented in the backend
      return allergies;
    },
    enabled: !!studentId && !!medicationId,
    staleTime: STALE_TIME.ALLERGIES,
    gcTime: CACHE_TIME.CRITICAL,
    retry: shouldRetry,
    ...options,
  });
}

/**
 * Fetches allergy statistics
 * @param filters - Filter options
 * @param options - React Query options
 * @returns Query result with statistics
 */
export function useAllergyStatistics(
  filters?: HealthRecordFilters,
  options?: Omit<UseQueryOptions<any, HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<any, HealthRecordsApiError>({
    queryKey: healthRecordKeys.allergyStatistics(filters),
    queryFn: async () => {
      // This should be implemented as a dedicated statistics endpoint
      throw new HealthRecordsApiError('Allergy statistics endpoint not implemented', 501);
    },
    enabled: false, // Disabled until endpoint is implemented
    staleTime: STALE_TIME.STATISTICS,
    gcTime: CACHE_TIME.DEFAULT,
    retry: false,
    ...options,
  });
}

/**
 * Creates a new allergy record (NO optimistic updates)
 * @param options - React Query mutation options
 * @returns Mutation result
 */
export function useCreateAllergy(
  options?: UseMutationOptions<Allergy, HealthRecordsApiError, CreateAllergyRequest>
) {
  const queryClient = useQueryClient();

  return useMutation<Allergy, HealthRecordsApiError, CreateAllergyRequest>({
    mutationFn: (data) => healthRecordsApiService.createAllergy(data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.allergies(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.criticalAllergies(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.summary(variables.studentId) });

      toast.success('Allergy added successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'creating allergy');
    },
    ...options,
  });
}

/**
 * Updates an existing allergy (NO optimistic updates)
 * @param options - React Query mutation options
 * @returns Mutation result
 */
export function useUpdateAllergy(
  options?: UseMutationOptions<
    Allergy,
    HealthRecordsApiError,
    { id: string; data: Partial<CreateAllergyRequest> }
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    Allergy,
    HealthRecordsApiError,
    { id: string; data: Partial<CreateAllergyRequest> }
  >({
    mutationFn: ({ id, data }) => healthRecordsApiService.updateAllergy(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.allergies(data.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.criticalAllergies(data.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.summary(data.studentId) });

      toast.success('Allergy updated successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'updating allergy');
    },
    ...options,
  });
}

/**
 * Deletes an allergy record
 * @param options - React Query mutation options
 * @returns Mutation result
 */
export function useDeleteAllergy(
  options?: UseMutationOptions<void, HealthRecordsApiError, { id: string; studentId: string }>
) {
  const queryClient = useQueryClient();

  return useMutation<void, HealthRecordsApiError, { id: string; studentId: string }>({
    mutationFn: ({ id, studentId }) => healthRecordsApiService.deleteAllergy(id, studentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.allergies(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.criticalAllergies(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.summary(variables.studentId) });

      toast.success('Allergy deleted successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'deleting allergy');
    },
    ...options,
  });
}

/**
 * Verifies an allergy record
 * @param options - React Query mutation options
 * @returns Mutation result
 */
export function useVerifyAllergy(
  options?: UseMutationOptions<Allergy, HealthRecordsApiError, { id: string; verifiedBy: string }>
) {
  const queryClient = useQueryClient();

  return useMutation<Allergy, HealthRecordsApiError, { id: string; verifiedBy: string }>({
    mutationFn: ({ id, verifiedBy }) => healthRecordsApiService.verifyAllergy(id, verifiedBy),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.allergies(data.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.criticalAllergies(data.studentId) });

      toast.success('Allergy verified successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'verifying allergy');
    },
    ...options,
  });
}
