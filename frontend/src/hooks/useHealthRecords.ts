/**
 * Custom React Query Hooks for Health Records
 *
 * Enterprise-grade hooks with:
 * - Type-safe API integration
 * - Automatic caching and invalidation
 * - Optimistic updates for better UX
 * - Error handling and retry strategies
 * - HIPAA-compliant data cleanup
 * - Circuit breaker awareness
 *
 * @module useHealthRecords
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import {
  healthRecordsApiService,
  HealthRecord,
  Allergy,
  ChronicCondition,
  VaccinationRecord,
  GrowthMeasurement,
  Screening,
  HealthSummary,
  VitalSigns,
  HealthRecordFilters,
  PaginationParams,
  CreateHealthRecordRequest,
  CreateAllergyRequest,
  CreateChronicConditionRequest,
  CreateVaccinationRequest,
  HealthRecordsApiError,
  CircuitBreakerError,
} from '../services/modules/healthRecordsApi.enhanced';

// ============================================================================
// Constants
// ============================================================================

const STALE_TIME = {
  HEALTH_RECORDS: 5 * 60 * 1000, // 5 minutes
  ALLERGIES: 10 * 60 * 1000, // 10 minutes (critical data, cache longer)
  CHRONIC_CONDITIONS: 10 * 60 * 1000,
  VACCINATIONS: 5 * 60 * 1000,
  GROWTH: 30 * 60 * 1000, // 30 minutes (historical data)
  SCREENINGS: 30 * 60 * 1000,
  SUMMARY: 2 * 60 * 1000, // 2 minutes (frequently updated)
};

const CACHE_TIME = {
  DEFAULT: 30 * 60 * 1000, // 30 minutes
  LONG: 60 * 60 * 1000, // 1 hour
};

const RETRY_CONFIG = {
  ATTEMPTS: 3,
  DELAY: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
};

// ============================================================================
// Query Keys Factory
// ============================================================================

export const healthRecordsKeys = {
  all: ['healthRecords'] as const,
  records: (studentId?: string, filters?: HealthRecordFilters) =>
    [...healthRecordsKeys.all, 'records', studentId, filters] as const,
  record: (id: string) => [...healthRecordsKeys.all, 'record', id] as const,
  allergies: (studentId: string) => [...healthRecordsKeys.all, 'allergies', studentId] as const,
  chronicConditions: (studentId: string) =>
    [...healthRecordsKeys.all, 'chronicConditions', studentId] as const,
  vaccinations: (studentId: string) => [...healthRecordsKeys.all, 'vaccinations', studentId] as const,
  growth: (studentId: string) => [...healthRecordsKeys.all, 'growth', studentId] as const,
  screenings: (studentId: string) => [...healthRecordsKeys.all, 'screenings', studentId] as const,
  vitals: (studentId: string, limit?: number) =>
    [...healthRecordsKeys.all, 'vitals', studentId, limit] as const,
  summary: (studentId: string) => [...healthRecordsKeys.all, 'summary', studentId] as const,
  search: (query: string, filters?: HealthRecordFilters) =>
    [...healthRecordsKeys.all, 'search', query, filters] as const,
  paginated: (pagination?: PaginationParams, filters?: HealthRecordFilters) =>
    [...healthRecordsKeys.all, 'paginated', pagination, filters] as const,
};

// ============================================================================
// Error Handling Utilities
// ============================================================================

function handleQueryError(error: unknown, context: string): void {
  if (error instanceof CircuitBreakerError) {
    toast.error('Service temporarily unavailable. Please try again in a few moments.', {
      duration: 5000,
      id: 'circuit-breaker',
    });
    console.error(`Circuit breaker open for ${context}:`, error);
    return;
  }

  if (error instanceof HealthRecordsApiError) {
    if (error.statusCode === 401) {
      toast.error('Session expired. Please log in again.');
      // Trigger session expiration flow
      window.location.href = '/login';
      return;
    }

    if (error.statusCode === 403) {
      toast.error('You do not have permission to access this resource.');
      return;
    }

    toast.error(error.message);
    console.error(`API error in ${context}:`, error);
    return;
  }

  toast.error(`An unexpected error occurred while ${context}`);
  console.error(`Unexpected error in ${context}:`, error);
}

function shouldRetry(failureCount: number, error: unknown): boolean {
  // Don't retry on certain errors
  if (error instanceof HealthRecordsApiError) {
    const noRetryStatuses = [400, 401, 403, 404, 422];
    if (error.statusCode && noRetryStatuses.includes(error.statusCode)) {
      return false;
    }
  }

  return failureCount < RETRY_CONFIG.ATTEMPTS;
}

// ============================================================================
// HIPAA-Compliant Data Cleanup
// ============================================================================

export function useHealthRecordsCleanup(studentId: string | null): void {
  const queryClient = useQueryClient();
  const cleanupTimerRef = useRef<NodeJS.Timeout>();

  const cleanup = useCallback(() => {
    if (!studentId) return;

    // Remove all health records data from cache
    queryClient.removeQueries({ queryKey: healthRecordsKeys.all });

    // Clear any sensitive data from memory
    queryClient.clear();

    console.log('Health records data cleaned up for HIPAA compliance');
  }, [studentId, queryClient]);

  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      if (cleanupTimerRef.current) {
        clearTimeout(cleanupTimerRef.current);
      }
      cleanup();
    };
  }, [cleanup]);

  // Set timeout for automatic cleanup after 15 minutes of inactivity
  useEffect(() => {
    const resetTimer = () => {
      if (cleanupTimerRef.current) {
        clearTimeout(cleanupTimerRef.current);
      }

      cleanupTimerRef.current = setTimeout(() => {
        cleanup();
        toast.error('Session timed out. Data has been cleared for security.');
      }, 15 * 60 * 1000); // 15 minutes
    };

    // Reset timer on user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [cleanup]);
}

// ============================================================================
// Health Records Queries
// ============================================================================

export function useHealthRecords(
  studentId: string,
  filters?: HealthRecordFilters,
  options?: Omit<UseQueryOptions<HealthRecord[], HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<HealthRecord[], HealthRecordsApiError>({
    queryKey: healthRecordsKeys.records(studentId, filters),
    queryFn: () => healthRecordsApiService.getStudentHealthRecords(studentId, filters),
    enabled: !!studentId,
    staleTime: STALE_TIME.HEALTH_RECORDS,
    gcTime: CACHE_TIME.DEFAULT,
    retry: shouldRetry,
    retryDelay: RETRY_CONFIG.DELAY,
    ...options,
  });
}

export function useHealthRecord(
  id: string,
  options?: Omit<UseQueryOptions<HealthRecord, HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<HealthRecord, HealthRecordsApiError>({
    queryKey: healthRecordsKeys.record(id),
    queryFn: () => healthRecordsApiService.getHealthRecordById(id),
    enabled: !!id,
    staleTime: STALE_TIME.HEALTH_RECORDS,
    gcTime: CACHE_TIME.DEFAULT,
    retry: shouldRetry,
    retryDelay: RETRY_CONFIG.DELAY,
    ...options,
  });
}

export function useCreateHealthRecord(
  options?: UseMutationOptions<HealthRecord, HealthRecordsApiError, CreateHealthRecordRequest>
) {
  const queryClient = useQueryClient();

  return useMutation<HealthRecord, HealthRecordsApiError, CreateHealthRecordRequest>({
    mutationFn: (data) => healthRecordsApiService.createHealthRecord(data),
    onSuccess: (data, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.records(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.summary(variables.studentId) });

      toast.success('Health record created successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'creating health record');
    },
    ...options,
  });
}

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
    onMutate: async ({ id }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: healthRecordsKeys.record(id) });

      // Snapshot previous value
      const previousRecord = queryClient.getQueryData<HealthRecord>(healthRecordsKeys.record(id));

      return { previousRecord };
    },
    onSuccess: (data, variables) => {
      // Update cache
      queryClient.setQueryData(healthRecordsKeys.record(variables.id), data);
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.records(data.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.summary(data.studentId) });

      toast.success('Health record updated successfully');
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousRecord) {
        queryClient.setQueryData(healthRecordsKeys.record(variables.id), context.previousRecord);
      }
      handleQueryError(error, 'updating health record');
    },
    ...options,
  });
}

export function useDeleteHealthRecord(
  options?: UseMutationOptions<void, HealthRecordsApiError, string>
) {
  const queryClient = useQueryClient();

  return useMutation<void, HealthRecordsApiError, string>({
    mutationFn: (id) => healthRecordsApiService.deleteHealthRecord(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: healthRecordsKeys.record(id) });
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.all });

      toast.success('Health record deleted successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'deleting health record');
    },
    ...options,
  });
}

// ============================================================================
// Allergies Queries
// ============================================================================

export function useAllergies(
  studentId: string,
  options?: Omit<UseQueryOptions<Allergy[], HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Allergy[], HealthRecordsApiError>({
    queryKey: healthRecordsKeys.allergies(studentId),
    queryFn: () => healthRecordsApiService.getStudentAllergies(studentId),
    enabled: !!studentId,
    staleTime: STALE_TIME.ALLERGIES,
    gcTime: CACHE_TIME.LONG, // Critical data, cache longer
    retry: shouldRetry,
    retryDelay: RETRY_CONFIG.DELAY,
    ...options,
  });
}

export function useCreateAllergy(
  options?: UseMutationOptions<Allergy, HealthRecordsApiError, CreateAllergyRequest>
) {
  const queryClient = useQueryClient();

  return useMutation<Allergy, HealthRecordsApiError, CreateAllergyRequest>({
    mutationFn: (data) => healthRecordsApiService.createAllergy(data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.allergies(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.summary(variables.studentId) });

      toast.success('Allergy added successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'creating allergy');
    },
    ...options,
  });
}

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
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.allergies(data.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.summary(data.studentId) });

      toast.success('Allergy updated successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'updating allergy');
    },
    ...options,
  });
}

export function useDeleteAllergy(
  options?: UseMutationOptions<void, HealthRecordsApiError, { id: string; studentId: string }>
) {
  const queryClient = useQueryClient();

  return useMutation<void, HealthRecordsApiError, { id: string; studentId: string }>({
    mutationFn: ({ id, studentId }) => healthRecordsApiService.deleteAllergy(id, studentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.allergies(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.summary(variables.studentId) });

      toast.success('Allergy deleted successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'deleting allergy');
    },
    ...options,
  });
}

export function useVerifyAllergy(
  options?: UseMutationOptions<Allergy, HealthRecordsApiError, { id: string; verifiedBy: string }>
) {
  const queryClient = useQueryClient();

  return useMutation<Allergy, HealthRecordsApiError, { id: string; verifiedBy: string }>({
    mutationFn: ({ id, verifiedBy }) => healthRecordsApiService.verifyAllergy(id, verifiedBy),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.allergies(data.studentId) });

      toast.success('Allergy verified successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'verifying allergy');
    },
    ...options,
  });
}

// ============================================================================
// Chronic Conditions Queries
// ============================================================================

export function useChronicConditions(
  studentId: string,
  options?: Omit<UseQueryOptions<ChronicCondition[], HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<ChronicCondition[], HealthRecordsApiError>({
    queryKey: healthRecordsKeys.chronicConditions(studentId),
    queryFn: () => healthRecordsApiService.getStudentChronicConditions(studentId),
    enabled: !!studentId,
    staleTime: STALE_TIME.CHRONIC_CONDITIONS,
    gcTime: CACHE_TIME.LONG,
    retry: shouldRetry,
    retryDelay: RETRY_CONFIG.DELAY,
    ...options,
  });
}

export function useCreateChronicCondition(
  options?: UseMutationOptions<ChronicCondition, HealthRecordsApiError, CreateChronicConditionRequest>
) {
  const queryClient = useQueryClient();

  return useMutation<ChronicCondition, HealthRecordsApiError, CreateChronicConditionRequest>({
    mutationFn: (data) => healthRecordsApiService.createChronicCondition(data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: healthRecordsKeys.chronicConditions(variables.studentId),
      });
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.summary(variables.studentId) });

      toast.success('Chronic condition added successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'creating chronic condition');
    },
    ...options,
  });
}

export function useUpdateChronicCondition(
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
      queryClient.invalidateQueries({
        queryKey: healthRecordsKeys.chronicConditions(data.studentId),
      });
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.summary(data.studentId) });

      toast.success('Chronic condition updated successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'updating chronic condition');
    },
    ...options,
  });
}

export function useDeleteChronicCondition(
  options?: UseMutationOptions<void, HealthRecordsApiError, { id: string; studentId: string }>
) {
  const queryClient = useQueryClient();

  return useMutation<void, HealthRecordsApiError, { id: string; studentId: string }>({
    mutationFn: ({ id, studentId }) =>
      healthRecordsApiService.deleteChronicCondition(id, studentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: healthRecordsKeys.chronicConditions(variables.studentId),
      });
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.summary(variables.studentId) });

      toast.success('Chronic condition deleted successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'deleting chronic condition');
    },
    ...options,
  });
}

// ============================================================================
// Vaccinations Queries
// ============================================================================

export function useVaccinations(
  studentId: string,
  options?: Omit<UseQueryOptions<VaccinationRecord[], HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<VaccinationRecord[], HealthRecordsApiError>({
    queryKey: healthRecordsKeys.vaccinations(studentId),
    queryFn: () => healthRecordsApiService.getVaccinationRecords(studentId),
    enabled: !!studentId,
    staleTime: STALE_TIME.VACCINATIONS,
    gcTime: CACHE_TIME.DEFAULT,
    retry: shouldRetry,
    retryDelay: RETRY_CONFIG.DELAY,
    ...options,
  });
}

export function useCreateVaccination(
  options?: UseMutationOptions<VaccinationRecord, HealthRecordsApiError, CreateVaccinationRequest>
) {
  const queryClient = useQueryClient();

  return useMutation<VaccinationRecord, HealthRecordsApiError, CreateVaccinationRequest>({
    mutationFn: (data) => healthRecordsApiService.createVaccinationRecord(data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.vaccinations(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.summary(variables.studentId) });

      toast.success('Vaccination record created successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'creating vaccination record');
    },
    ...options,
  });
}

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
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.vaccinations(data.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.summary(data.studentId) });

      toast.success('Vaccination record updated successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'updating vaccination record');
    },
    ...options,
  });
}

export function useDeleteVaccination(
  options?: UseMutationOptions<void, HealthRecordsApiError, { id: string; studentId: string }>
) {
  const queryClient = useQueryClient();

  return useMutation<void, HealthRecordsApiError, { id: string; studentId: string }>({
    mutationFn: ({ id, studentId }) =>
      healthRecordsApiService.deleteVaccinationRecord(id, studentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.vaccinations(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.summary(variables.studentId) });

      toast.success('Vaccination record deleted successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'deleting vaccination record');
    },
    ...options,
  });
}

// ============================================================================
// Growth Measurements Queries
// ============================================================================

export function useGrowthMeasurements(
  studentId: string,
  options?: Omit<UseQueryOptions<GrowthMeasurement[], HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<GrowthMeasurement[], HealthRecordsApiError>({
    queryKey: healthRecordsKeys.growth(studentId),
    queryFn: () => healthRecordsApiService.getGrowthMeasurements(studentId),
    enabled: !!studentId,
    staleTime: STALE_TIME.GROWTH,
    gcTime: CACHE_TIME.LONG,
    retry: shouldRetry,
    retryDelay: RETRY_CONFIG.DELAY,
    ...options,
  });
}

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
    mutationFn: ({ studentId, data }) =>
      healthRecordsApiService.createGrowthMeasurement(studentId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.growth(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.summary(variables.studentId) });

      toast.success('Growth measurement added successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'creating growth measurement');
    },
    ...options,
  });
}

// ============================================================================
// Screenings Queries
// ============================================================================

export function useScreenings(
  studentId: string,
  options?: Omit<UseQueryOptions<Screening[], HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Screening[], HealthRecordsApiError>({
    queryKey: healthRecordsKeys.screenings(studentId),
    queryFn: () => healthRecordsApiService.getScreenings(studentId),
    enabled: !!studentId,
    staleTime: STALE_TIME.SCREENINGS,
    gcTime: CACHE_TIME.DEFAULT,
    retry: shouldRetry,
    retryDelay: RETRY_CONFIG.DELAY,
    ...options,
  });
}

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
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.screenings(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.summary(variables.studentId) });

      toast.success('Screening record added successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'creating screening record');
    },
    ...options,
  });
}

// ============================================================================
// Vitals Queries
// ============================================================================

export function useRecentVitals(
  studentId: string,
  limit: number = 10,
  options?: Omit<UseQueryOptions<VitalSigns[], HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<VitalSigns[], HealthRecordsApiError>({
    queryKey: healthRecordsKeys.vitals(studentId, limit),
    queryFn: () => healthRecordsApiService.getRecentVitals(studentId, limit),
    enabled: !!studentId,
    staleTime: STALE_TIME.HEALTH_RECORDS,
    gcTime: CACHE_TIME.DEFAULT,
    retry: shouldRetry,
    retryDelay: RETRY_CONFIG.DELAY,
    ...options,
  });
}

export function useRecordVitals(
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
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.vitals(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.records(variables.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.summary(variables.studentId) });

      toast.success('Vital signs recorded successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'recording vital signs');
    },
    ...options,
  });
}

// ============================================================================
// Health Summary Query
// ============================================================================

export function useHealthSummary(
  studentId: string,
  options?: Omit<UseQueryOptions<HealthSummary, HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<HealthSummary, HealthRecordsApiError>({
    queryKey: healthRecordsKeys.summary(studentId),
    queryFn: () => healthRecordsApiService.getHealthSummary(studentId),
    enabled: !!studentId,
    staleTime: STALE_TIME.SUMMARY,
    gcTime: CACHE_TIME.DEFAULT,
    retry: shouldRetry,
    retryDelay: RETRY_CONFIG.DELAY,
    ...options,
  });
}

// ============================================================================
// Search & Export Queries
// ============================================================================

export function useSearchHealthRecords(
  query: string,
  filters?: HealthRecordFilters,
  options?: Omit<UseQueryOptions<HealthRecord[], HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<HealthRecord[], HealthRecordsApiError>({
    queryKey: healthRecordsKeys.search(query, filters),
    queryFn: () => healthRecordsApiService.searchHealthRecords(query, filters),
    enabled: query.length >= 2,
    staleTime: STALE_TIME.HEALTH_RECORDS,
    gcTime: CACHE_TIME.DEFAULT,
    retry: shouldRetry,
    retryDelay: RETRY_CONFIG.DELAY,
    ...options,
  });
}

export function useExportHealthHistory(
  options?: UseMutationOptions<Blob, HealthRecordsApiError, { studentId: string; format: 'pdf' | 'json' }>
) {
  return useMutation<Blob, HealthRecordsApiError, { studentId: string; format: 'pdf' | 'json' }>({
    mutationFn: ({ studentId, format }) =>
      healthRecordsApiService.exportHealthHistory(studentId, format),
    onSuccess: (blob, variables) => {
      // Trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `health-history-${variables.studentId}.${variables.format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Health history exported successfully');
    },
    onError: (error) => {
      handleQueryError(error, 'exporting health history');
    },
    ...options,
  });
}

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
    mutationFn: ({ studentId, file }) =>
      healthRecordsApiService.importHealthRecords(studentId, file),
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.all });

      if (result.errors.length > 0) {
        toast.success(
          `Imported ${result.imported} records with ${result.errors.length} errors. Check console for details.`
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
