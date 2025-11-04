/**
 * Medication Administration Utility Hooks
 *
 * Additional hooks for medication administration features
 */

import { useQuery } from '@tanstack/react-query';
import { medicationAdministrationApi as administrationApi } from '@/services';
import type { AdministrationHistoryFilters } from '@/services';
import { administrationKeys } from './constants';

/**
 * Get administration history hook
 *
 * @param filters - Optional filters for administration history
 * @returns Query result with administration history
 */
export function useAdministrationHistory(filters?: AdministrationHistoryFilters) {
  return useQuery({
    queryKey: administrationKeys.historyFiltered(filters),
    queryFn: () => administrationApi.getAdministrationHistory(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get student schedule hook
 *
 * @param studentId - Student ID to get schedule for
 * @param date - Optional date for schedule (defaults to today)
 * @returns Query result with student medication schedule
 */
export function useStudentSchedule(studentId: string | undefined, date?: string) {
  return useQuery({
    queryKey: administrationKeys.schedule(studentId!, date),
    queryFn: () => administrationApi.getStudentSchedule(studentId!, date),
    enabled: !!studentId,
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000,
  });
}
