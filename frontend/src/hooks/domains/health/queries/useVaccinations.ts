/**
 * WF-COMP-131 | useVaccinations.ts - Vaccination record hooks
 * Purpose: Query and mutation hooks for vaccination records
 * Upstream: ../services/modules/healthRecordsApi | Dependencies: @tanstack/react-query, react-hot-toast
 * Downstream: Vaccination components | Called by: Health record vaccination views
 * Related: Health records services, vaccination types
 * Exports: hooks | Key Features: Vaccination compliance tracking
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Component mount → Query vaccinations → Display compliance
 * LLM Context: Vaccination hooks with compliance and scheduling
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  healthRecordsApi as healthRecordsApiService,
  VaccinationRecord,
  CreateVaccinationRequest,
} from '@/services';
import { HealthRecordsApiError } from './types';
import { healthRecordKeys, STALE_TIME, CACHE_TIME, RETRY_CONFIG } from './healthRecordsConfig';
import { handleQueryError, shouldRetry } from './healthRecordsUtils';

/**
 * Fetches all vaccination records for a student
 * @param studentId - Student ID
 * @param options - React Query options
 * @returns Query result with vaccination records
 */
export function useVaccinations(
  studentId: string,
  options?: Omit<UseQueryOptions<VaccinationRecord[], HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<VaccinationRecord[], HealthRecordsApiError>({
    queryKey: healthRecordKeys.vaccinations(studentId),
    queryFn: () => healthRecordsApiService.getVaccinationRecords(studentId),
    enabled: !!studentId,
    staleTime: STALE_TIME.VACCINATIONS,
    gcTime: CACHE_TIME.DEFAULT,
    retry: shouldRetry,
    retryDelay: RETRY_CONFIG.DELAY,
    ...options,
  });
}

/**
 * Fetches a single vaccination record by ID
 * @param id - Vaccination ID
 * @param options - React Query options
 * @returns Query result with vaccination detail
 */
export function useVaccinationDetail(
  id: string,
  options?: Omit<UseQueryOptions<VaccinationRecord, HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<VaccinationRecord, HealthRecordsApiError>({
    queryKey: healthRecordKeys.vaccination(id),
    queryFn: async () => {
      // API endpoint not implemented
      throw new HealthRecordsApiError('Vaccination detail endpoint not implemented', 501);
    },
    enabled: !!id,
    staleTime: STALE_TIME.VACCINATIONS,
    gcTime: CACHE_TIME.DEFAULT,
    retry: false,
    ...options,
  });
}

/**
 * Fetches vaccination compliance status
 * @param studentId - Student ID
 * @param options - React Query options
 * @returns Query result with compliance status
 */
export function useVaccinationCompliance(
  studentId: string,
  options?: Omit<UseQueryOptions<any, HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<any, HealthRecordsApiError>({
    queryKey: healthRecordKeys.vaccinationCompliance(studentId),
    queryFn: async () => {
      const vaccinations = await healthRecordsApiService.getVaccinationRecords(studentId);
      const totalRequired = vaccinations.length;
      const compliant = vaccinations.filter(v => v.compliant).length;

      return {
        totalRequired,
        compliant,
        nonCompliant: totalRequired - compliant,
        complianceRate: totalRequired > 0 ? (compliant / totalRequired) * 100 : 0,
      };
    },
    enabled: !!studentId,
    staleTime: STALE_TIME.VACCINATIONS,
    gcTime: CACHE_TIME.DEFAULT,
    retry: shouldRetry,
    retryDelay: RETRY_CONFIG.DELAY,
    ...options,
  });
}

/**
 * Fetches upcoming vaccinations due
 * @param studentId - Student ID
 * @param options - React Query options
 * @returns Query result with upcoming vaccinations
 */
export function useUpcomingVaccinations(
  studentId: string,
  options?: Omit<UseQueryOptions<VaccinationRecord[], HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<VaccinationRecord[], HealthRecordsApiError>({
    queryKey: healthRecordKeys.upcomingVaccinations(studentId),
    queryFn: async () => {
      const vaccinations = await healthRecordsApiService.getVaccinationRecords(studentId);
      const now = new Date();

      return vaccinations
        .filter(v => v.dueDate && new Date(v.dueDate) >= now && !v.compliant)
        .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());
    },
    enabled: !!studentId,
    staleTime: STALE_TIME.VACCINATIONS,
    gcTime: CACHE_TIME.DEFAULT,
    retry: shouldRetry,
    retryDelay: RETRY_CONFIG.DELAY,
    ...options,
  });
}

/**
 * Fetches vaccination report for official documentation
 * @param studentId - Student ID
 * @param options - React Query options
 * @returns Query result with vaccination report
 */
export function useVaccinationReport(
  studentId: string,
  options?: Omit<UseQueryOptions<any, HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<any, HealthRecordsApiError>({
    queryKey: healthRecordKeys.vaccinationReport(studentId),
    queryFn: async () => {
      // This should be a dedicated API endpoint for official reports
      throw new HealthRecordsApiError('Vaccination report endpoint not implemented', 501);
    },
    enabled: false, // Disabled until endpoint is implemented
    staleTime: STALE_TIME.VACCINATIONS,
    gcTime: CACHE_TIME.DEFAULT,
    retry: false,
    ...options,
  });
}

/**
 * Fetches vaccination statistics for a school
 * @param schoolId - School ID
 * @param options - React Query options
 * @returns Query result with statistics
 */
export function useVaccinationStatistics(
  schoolId?: string,
  options?: Omit<UseQueryOptions<any, HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<any, HealthRecordsApiError>({
    queryKey: healthRecordKeys.vaccinationStatistics(schoolId),
    queryFn: async () => {
      // This should be a dedicated statistics endpoint
      throw new HealthRecordsApiError('Vaccination statistics endpoint not implemented', 501);
    },
    enabled: false, // Disabled until endpoint is implemented
    staleTime: STALE_TIME.STATISTICS,
    gcTime: CACHE_TIME.DEFAULT,
    retry: false,
    ...options,
  });
}

/**
 * Creates a new vaccination record (NO optimistic updates)
 * @param options - React Query mutation options
 * @returns Mutation result
 */
export function useCreateVaccination(
  options?: UseMutationOptions<VaccinationRecord, HealthRecordsApiError, CreateVaccinationRequest>
) {
  const queryClient = useQueryClient();

  return useMutation<VaccinationRecord, HealthRecordsApiError, CreateVaccinationRequest>({
    mutationFn: (data) => healthRecordsApiService.createVaccinationRecord(data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.vaccinations(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.upcomingVaccinations(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.vaccinationCompliance(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.summary(variables.studentId) });

      toast.success('Vaccination record created successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'creating vaccination record');
    },
    ...options,
  });
}

/**
 * Updates an existing vaccination record (NO optimistic updates)
 * @param options - React Query mutation options
 * @returns Mutation result
 */
export function useUpdateVaccination(
  options?: UseMutationOptions<
    VaccinationRecord,
    HealthRecordsApiError,
    { id: string; data: Partial<CreateVaccinationRequest> }
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    VaccinationRecord,
    HealthRecordsApiError,
    { id: string; data: Partial<CreateVaccinationRequest> }
  >({
    mutationFn: ({ id, data }) => healthRecordsApiService.updateVaccinationRecord(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.vaccinations(data.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.upcomingVaccinations(data.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.vaccinationCompliance(data.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.summary(data.studentId) });

      toast.success('Vaccination record updated successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'updating vaccination record');
    },
    ...options,
  });
}

/**
 * Deletes a vaccination record
 * @param options - React Query mutation options
 * @returns Mutation result
 */
export function useDeleteVaccination(
  options?: UseMutationOptions<void, HealthRecordsApiError, { id: string; studentId: string }>
) {
  const queryClient = useQueryClient();

  return useMutation<void, HealthRecordsApiError, { id: string; studentId: string }>({
    mutationFn: ({ id, studentId }) => healthRecordsApiService.deleteVaccinationRecord(id, studentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.vaccinations(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.upcomingVaccinations(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.vaccinationCompliance(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordKeys.summary(variables.studentId) });

      toast.success('Vaccination record deleted successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'deleting vaccination record');
    },
    ...options,
  });
}
