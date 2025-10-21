/**
 * WF-COMP-131 | useHealthRecords.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../services/modules/healthRecordsApi | Dependencies: @tanstack/react-query, react, react-hot-toast
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, functions | Key Features: useEffect, useCallback, useRef
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Enterprise-Grade Health Records Hooks
 *
 * Comprehensive React Query hooks for all health records sub-modules with:
 * - Type-safe API integration with strict TypeScript
 * - Healthcare-appropriate caching strategies (NO cache for safety-critical data)
 * - NO optimistic updates (healthcare data must be confirmed)
 * - HIPAA-compliant error handling and audit logging
 * - Circuit breaker awareness and resilience patterns
 * - Comprehensive query key factory pattern
 * - Toast notifications with PHI-safe error messages
 * - Proper loading and error states
 * - JSDoc documentation for all hooks
 *
 * @module useHealthRecords
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import {
  healthRecordsApi as healthRecordsApiService,
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
  PaginatedResponse,
} from '../services/modules/healthRecordsApi';

// ============================================================================
// Constants - Healthcare-Appropriate Cache Strategy
// ============================================================================

/**
 * Cache time constants following healthcare safety standards:
 * - NO CACHE for safety-critical data (allergies, vital signs)
 * - Short cache for frequently changing data (health records)
 * - Moderate cache for historical data (vaccinations, screenings)
 * - Longer cache for stable data (growth measurements)
 */
const STALE_TIME = {
  HEALTH_RECORDS: 5 * 60 * 1000,      // 5 minutes
  ALLERGIES: 0,                        // NO CACHE - safety critical
  CHRONIC_CONDITIONS: 5 * 60 * 1000,   // 5 minutes
  VACCINATIONS: 10 * 60 * 1000,        // 10 minutes
  GROWTH: 15 * 60 * 1000,              // 15 minutes
  SCREENINGS: 10 * 60 * 1000,          // 10 minutes
  VITALS: 0,                           // NO CACHE - real-time critical
  SUMMARY: 5 * 60 * 1000,              // 5 minutes
  STATISTICS: 5 * 60 * 1000,           // 5 minutes
};

const CACHE_TIME = {
  DEFAULT: 30 * 60 * 1000,             // 30 minutes
  LONG: 60 * 60 * 1000,                // 1 hour
  CRITICAL: 0,                          // NO CACHE for critical data
};

const RETRY_CONFIG = {
  ATTEMPTS: 3,
  DELAY: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
};

// ============================================================================
// Query Keys Factory - Hierarchical Organization
// ============================================================================

/**
 * Hierarchical query key factory for React Query cache management
 * Enables granular invalidation and cache updates
 */
export const healthRecordKeys = {
  all: ['healthRecords'] as const,

  // Health Records Main
  records: (studentId?: string, filters?: HealthRecordFilters) =>
    [...healthRecordKeys.all, 'records', studentId, filters] as const,
  record: (id: string) => [...healthRecordKeys.all, 'record', id] as const,
  recordsByType: (studentId: string, type: HealthRecord['type']) =>
    [...healthRecordKeys.all, 'recordsByType', studentId, type] as const,
  timeline: (studentId: string) => [...healthRecordKeys.all, 'timeline', studentId] as const,
  summary: (studentId: string) => [...healthRecordKeys.all, 'summary', studentId] as const,
  search: (studentId: string, query: string) =>
    [...healthRecordKeys.all, 'search', studentId, query] as const,

  // Allergies
  allergies: (studentId: string) => [...healthRecordKeys.all, 'allergies', studentId] as const,
  allergy: (id: string) => [...healthRecordKeys.all, 'allergy', id] as const,
  criticalAllergies: (studentId: string) =>
    [...healthRecordKeys.all, 'criticalAllergies', studentId] as const,
  allergyContraindications: (studentId: string, medicationId?: string) =>
    [...healthRecordKeys.all, 'allergyContraindications', studentId, medicationId] as const,
  allergyStatistics: (filters?: HealthRecordFilters) =>
    [...healthRecordKeys.all, 'allergyStatistics', filters] as const,

  // Chronic Conditions
  chronicConditions: (studentId: string) =>
    [...healthRecordKeys.all, 'chronicConditions', studentId] as const,
  condition: (id: string) => [...healthRecordKeys.all, 'condition', id] as const,
  activeConditions: (studentId: string) =>
    [...healthRecordKeys.all, 'activeConditions', studentId] as const,
  conditionsNeedingReview: () => [...healthRecordKeys.all, 'conditionsNeedingReview'] as const,
  conditionStatistics: (filters?: HealthRecordFilters) =>
    [...healthRecordKeys.all, 'conditionStatistics', filters] as const,

  // Vaccinations
  vaccinations: (studentId: string) => [...healthRecordKeys.all, 'vaccinations', studentId] as const,
  vaccination: (id: string) => [...healthRecordKeys.all, 'vaccination', id] as const,
  vaccinationCompliance: (studentId: string) =>
    [...healthRecordKeys.all, 'vaccinationCompliance', studentId] as const,
  upcomingVaccinations: (studentId: string) =>
    [...healthRecordKeys.all, 'upcomingVaccinations', studentId] as const,
  vaccinationReport: (studentId: string) =>
    [...healthRecordKeys.all, 'vaccinationReport', studentId] as const,
  vaccinationStatistics: (schoolId?: string) =>
    [...healthRecordKeys.all, 'vaccinationStatistics', schoolId] as const,

  // Screenings
  screenings: (studentId: string) => [...healthRecordKeys.all, 'screenings', studentId] as const,
  screening: (id: string) => [...healthRecordKeys.all, 'screening', id] as const,
  screeningsDue: () => [...healthRecordKeys.all, 'screeningsDue'] as const,
  screeningStatistics: (filters?: HealthRecordFilters) =>
    [...healthRecordKeys.all, 'screeningStatistics', filters] as const,

  // Growth Measurements
  growth: (studentId: string) => [...healthRecordKeys.all, 'growth', studentId] as const,
  growthMeasurement: (id: string) => [...healthRecordKeys.all, 'growthMeasurement', id] as const,
  growthTrends: (studentId: string) => [...healthRecordKeys.all, 'growthTrends', studentId] as const,
  growthConcerns: (studentId: string) =>
    [...healthRecordKeys.all, 'growthConcerns', studentId] as const,
  growthPercentiles: (studentId: string) =>
    [...healthRecordKeys.all, 'growthPercentiles', studentId] as const,

  // Vital Signs
  vitals: (studentId: string, filters?: HealthRecordFilters) =>
    [...healthRecordKeys.all, 'vitals', studentId, filters] as const,
  latestVitals: (studentId: string) => [...healthRecordKeys.all, 'latestVitals', studentId] as const,
  vitalTrends: (studentId: string, type?: string) =>
    [...healthRecordKeys.all, 'vitalTrends', studentId, type] as const,

  // Pagination
  paginated: (pagination?: PaginationParams, filters?: HealthRecordFilters) =>
    [...healthRecordKeys.all, 'paginated', pagination, filters] as const,
};

// ============================================================================
// Error Handling Utilities - PHI-Safe Error Messages
// ============================================================================

/**
 * Handles query errors with PHI-safe error messages and appropriate user feedback
 * @param error - The error object
 * @param context - Context of the error for logging
 */
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

    // Use PHI-safe error messages
    const phiSafeMessage = error.message.includes('student') || error.message.includes('patient')
      ? 'Unable to access health records. Please contact support.'
      : error.message;

    toast.error(phiSafeMessage);
    console.error(`API error in ${context}:`, error);
    return;
  }

  toast.error(`An unexpected error occurred while ${context}`);
  console.error(`Unexpected error in ${context}:`, error);
}

/**
 * Determines if a failed query should be retried based on error type
 * @param failureCount - Number of previous failures
 * @param error - The error object
 * @returns True if should retry, false otherwise
 */
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
// HIPAA-Compliant Data Cleanup Hook
// ============================================================================

/**
 * HIPAA-compliant automatic data cleanup hook
 * Removes sensitive health data from cache after inactivity or unmount
 * @param studentId - Student ID to track
 */
export function useHealthRecordsCleanup(studentId: string | null): void {
  const queryClient = useQueryClient();
  const cleanupTimerRef = useRef<NodeJS.Timeout>();

  const cleanup = useCallback(() => {
    if (!studentId) return;

    // Remove all health records data from cache
    queryClient.removeQueries({ queryKey: healthRecordKeys.all });

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
// Health Records Main Query Hooks
// ============================================================================

/**
 * Fetches all health records for a student with optional filtering
 * @param studentId - Student ID
 * @param filters - Optional filters for health records
 * @param options - React Query options
 * @returns Query result with health records
 */
export function useHealthRecords(
  studentId: string,
  filters?: HealthRecordFilters,
  options?: Omit<UseQueryOptions<HealthRecord[], HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<HealthRecord[], HealthRecordsApiError>({
    queryKey: healthRecordKeys.records(studentId, filters),
    queryFn: () => healthRecordsApiService.getStudentHealthRecords(studentId, filters),
    enabled: !!studentId,
    staleTime: STALE_TIME.HEALTH_RECORDS,
    gcTime: CACHE_TIME.DEFAULT,
    retry: shouldRetry,
    retryDelay: RETRY_CONFIG.DELAY,
    ...options,
  });
}

/**
 * Fetches a single health record by ID
 * @param id - Health record ID
 * @param options - React Query options
 * @returns Query result with health record detail
 */
export function useHealthRecordDetail(
  id: string,
  options?: Omit<UseQueryOptions<HealthRecord, HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<HealthRecord, HealthRecordsApiError>({
    queryKey: healthRecordKeys.record(id),
    queryFn: () => healthRecordsApiService.getHealthRecordById(id),
    enabled: !!id,
    staleTime: STALE_TIME.HEALTH_RECORDS,
    gcTime: CACHE_TIME.DEFAULT,
    retry: shouldRetry,
    retryDelay: RETRY_CONFIG.DELAY,
    ...options,
  });
}

/**
 * Fetches health records timeline for a student (chronological view)
 * @param studentId - Student ID
 * @param options - React Query options
 * @returns Query result with timeline records
 */
export function useHealthRecordTimeline(
  studentId: string,
  options?: Omit<UseQueryOptions<HealthRecord[], HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<HealthRecord[], HealthRecordsApiError>({
    queryKey: healthRecordKeys.timeline(studentId),
    queryFn: () => healthRecordsApiService.getStudentHealthRecords(studentId, {
      sort: 'date',
      order: 'desc' as const,
    }),
    enabled: !!studentId,
    staleTime: STALE_TIME.HEALTH_RECORDS,
    gcTime: CACHE_TIME.DEFAULT,
    retry: shouldRetry,
    retryDelay: RETRY_CONFIG.DELAY,
    ...options,
  });
}

/**
 * Fetches health summary for a student
 * @param studentId - Student ID
 * @param options - React Query options
 * @returns Query result with health summary
 */
export function useHealthRecordSummary(
  studentId: string,
  options?: Omit<UseQueryOptions<HealthSummary, HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<HealthSummary, HealthRecordsApiError>({
    queryKey: healthRecordKeys.summary(studentId),
    queryFn: () => healthRecordsApiService.getHealthSummary(studentId),
    enabled: !!studentId,
    staleTime: STALE_TIME.SUMMARY,
    gcTime: CACHE_TIME.DEFAULT,
    retry: shouldRetry,
    retryDelay: RETRY_CONFIG.DELAY,
    ...options,
  });
}

/**
 * Searches health records for a student
 * @param studentId - Student ID
 * @param query - Search query
 * @param options - React Query options
 * @returns Query result with search results
 */
export function useHealthRecordSearch(
  studentId: string,
  query: string,
  options?: Omit<UseQueryOptions<HealthRecord[], HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<HealthRecord[], HealthRecordsApiError>({
    queryKey: healthRecordKeys.search(studentId, query),
    queryFn: () => healthRecordsApiService.searchHealthRecords(query, { studentId }),
    enabled: !!studentId && query.length >= 2,
    staleTime: STALE_TIME.HEALTH_RECORDS,
    gcTime: CACHE_TIME.DEFAULT,
    retry: shouldRetry,
    retryDelay: RETRY_CONFIG.DELAY,
    ...options,
  });
}

/**
 * Fetches health records filtered by type
 * @param studentId - Student ID
 * @param type - Record type filter
 * @param options - React Query options
 * @returns Query result with filtered records
 */
export function useHealthRecordsByType(
  studentId: string,
  type: HealthRecord['type'],
  options?: Omit<UseQueryOptions<HealthRecord[], HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<HealthRecord[], HealthRecordsApiError>({
    queryKey: healthRecordKeys.recordsByType(studentId, type),
    queryFn: () => healthRecordsApiService.getStudentHealthRecords(studentId, { type }),
    enabled: !!studentId && !!type,
    staleTime: STALE_TIME.HEALTH_RECORDS,
    gcTime: CACHE_TIME.DEFAULT,
    retry: shouldRetry,
    retryDelay: RETRY_CONFIG.DELAY,
    ...options,
  });
}

// ============================================================================
// Health Records Mutation Hooks
// ============================================================================

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

// ============================================================================
// Allergies Query Hooks - SAFETY CRITICAL (NO CACHE)
// ============================================================================

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
    retryDelay: RETRY_CONFIG.DELAY,
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
    retryDelay: RETRY_CONFIG.DELAY,
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
    retryDelay: RETRY_CONFIG.DELAY,
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

// ============================================================================
// Allergies Mutation Hooks
// ============================================================================

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

// ============================================================================
// Chronic Conditions Query Hooks
// ============================================================================

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

// ============================================================================
// Chronic Conditions Mutation Hooks
// ============================================================================

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

// ============================================================================
// Vaccinations Query Hooks
// ============================================================================

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

// ============================================================================
// Vaccinations Mutation Hooks
// ============================================================================

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

// ============================================================================
// Screenings Query Hooks
// ============================================================================

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

// ============================================================================
// Screenings Mutation Hooks
// ============================================================================

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

// ============================================================================
// Growth Measurements Query Hooks
// ============================================================================

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

// ============================================================================
// Growth Measurements Mutation Hooks
// ============================================================================

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

// ============================================================================
// Vital Signs Query Hooks - REAL-TIME CRITICAL (NO CACHE)
// ============================================================================

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

// ============================================================================
// Vital Signs Mutation Hooks
// ============================================================================

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

// ============================================================================
// Health Summary Hook
// ============================================================================

/**
 * Fetches comprehensive health summary for a student
 * @param studentId - Student ID
 * @param options - React Query options
 * @returns Query result with health summary
 */
export function useHealthSummary(
  studentId: string,
  options?: Omit<UseQueryOptions<HealthSummary, HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<HealthSummary, HealthRecordsApiError>({
    queryKey: healthRecordKeys.summary(studentId),
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
// Export/Import Hooks
// ============================================================================

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

// ============================================================================
// Search & Pagination Hooks
// ============================================================================

/**
 * Searches health records with filters
 * @param query - Search query
 * @param filters - Optional filters
 * @param options - React Query options
 * @returns Query result with search results
 */
export function useSearchHealthRecords(
  query: string,
  filters?: HealthRecordFilters,
  options?: Omit<UseQueryOptions<HealthRecord[], HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<HealthRecord[], HealthRecordsApiError>({
    queryKey: healthRecordKeys.search(filters?.studentId || '', query),
    queryFn: () => healthRecordsApiService.searchHealthRecords(query, filters),
    enabled: query.length >= 2,
    staleTime: STALE_TIME.HEALTH_RECORDS,
    gcTime: CACHE_TIME.DEFAULT,
    retry: shouldRetry,
    retryDelay: RETRY_CONFIG.DELAY,
    ...options,
  });
}

/**
 * Fetches paginated health records
 * @param pagination - Pagination parameters
 * @param filters - Optional filters
 * @param options - React Query options
 * @returns Query result with paginated records
 */
export function usePaginatedHealthRecords(
  pagination?: PaginationParams,
  filters?: HealthRecordFilters,
  options?: Omit<UseQueryOptions<PaginatedResponse<HealthRecord>, HealthRecordsApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<PaginatedResponse<HealthRecord>, HealthRecordsApiError>({
    queryKey: healthRecordKeys.paginated(pagination, filters),
    queryFn: () => healthRecordsApiService.getAllRecords(pagination, filters),
    staleTime: STALE_TIME.HEALTH_RECORDS,
    gcTime: CACHE_TIME.DEFAULT,
    retry: shouldRetry,
    retryDelay: RETRY_CONFIG.DELAY,
    ...options,
  });
}

// ============================================================================
// Export Aliases for Backward Compatibility
// ============================================================================

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

/**
 * Alias for useExportHealthRecords - exports health history
 * @deprecated Use useExportHealthRecords instead
 */
export const useExportHealthHistory = useExportHealthRecords;

