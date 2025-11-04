/**
 * WF-COMP-131 | useHealthRecordsQueries.ts - Core health records query hooks
 * Purpose: Read-only query hooks for health records
 * Upstream: ../services/modules/healthRecordsApi | Dependencies: @tanstack/react-query, react
 * Downstream: Components, pages | Called by: Health record components
 * Related: Health records services, types
 * Exports: query hooks | Key Features: useQuery hooks
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Component mount → Query → Display health records
 * LLM Context: Core health records read operations with React Query
 */

import { useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import {
  healthRecordsApi as healthRecordsApiService,
  HealthRecordFilters,
  HealthSummary,
} from '@/services';
import type { HealthRecord } from '@/types/healthRecords';
import { HealthRecordsApiError, PaginationParams, PaginatedResponse } from './types';
import { healthRecordKeys, STALE_TIME, CACHE_TIME, RETRY_CONFIG } from './healthRecordsConfig';
import { shouldRetry } from './healthRecordsUtils';

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
