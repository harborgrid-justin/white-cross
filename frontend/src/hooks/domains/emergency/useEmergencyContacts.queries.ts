/**
 * WF-COMP-129 | useEmergencyContacts.queries.ts - Query hooks
 * Purpose: React Query hooks for fetching emergency contact data
 * Upstream: ../services/modules/emergencyContactsApi | Dependencies: @tanstack/react-query
 * Downstream: Components, pages | Called by: React component tree
 * Related: useEmergencyContacts mutations, types, constants
 * Exports: query hooks | Key Features: Data fetching with caching
 * Last Updated: 2025-11-04 | File Type: .ts
 * LLM Context: Query hooks extracted from useEmergencyContacts
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { emergencyContactsApi } from '@/services';
import {
  EmergencyContact,
  EmergencyContactStatistics,
} from './useEmergencyContacts.types';
import {
  emergencyContactsKeys,
  STALE_TIME,
  CACHE_TIME,
  RETRY_CONFIG,
  shouldRetry,
} from './useEmergencyContacts.constants';

// ============================================================================
// Emergency Contacts Queries
// ============================================================================

/**
 * Hook to fetch emergency contacts for a specific student
 *
 * @param studentId - The ID of the student
 * @param options - Additional query options
 * @returns Query result with contacts data
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useEmergencyContacts(studentId);
 * const contacts = data?.contacts || [];
 * ```
 */
export function useEmergencyContacts(
  studentId: string,
  options?: Omit<UseQueryOptions<{ contacts: EmergencyContact[] }, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<{ contacts: EmergencyContact[] }, Error>({
    queryKey: emergencyContactsKeys.contacts(studentId),
    queryFn: () => emergencyContactsApi.getByStudent(studentId),
    enabled: !!studentId,
    staleTime: STALE_TIME.CONTACTS,
    gcTime: CACHE_TIME.DEFAULT,
    retry: shouldRetry,
    retryDelay: RETRY_CONFIG.DELAY,
    ...options,
  });
}

/**
 * Hook to fetch emergency contact statistics
 *
 * @param options - Additional query options
 * @returns Query result with statistics data
 *
 * @example
 * ```tsx
 * const { data: statistics } = useEmergencyContactStatistics();
 * ```
 */
export function useEmergencyContactStatistics(
  options?: Omit<UseQueryOptions<EmergencyContactStatistics, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<EmergencyContactStatistics, Error>({
    queryKey: emergencyContactsKeys.statistics(),
    queryFn: () => emergencyContactsApi.getStatistics(),
    staleTime: STALE_TIME.STATISTICS,
    gcTime: CACHE_TIME.DEFAULT,
    retry: shouldRetry,
    retryDelay: RETRY_CONFIG.DELAY,
    ...options,
  });
}
