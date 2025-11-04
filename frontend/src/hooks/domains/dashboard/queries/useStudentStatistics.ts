/**
 * Student Statistics Query Hook
 *
 * Hook for fetching student statistics for dashboard display.
 *
 * @module hooks/domains/dashboard/queries/useStudentStatistics
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { studentsApi } from '@/services';
import { useApiError } from '../../../shared/useApiError';
import {
  dashboardQueryKeys,
  DASHBOARD_CACHE_CONFIG,
  type DashboardStatisticsFilters
} from '../config';

/**
 * Get student statistics for dashboard
 */
export function useStudentStatistics(
  filters?: DashboardStatisticsFilters,
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
  const { handleApiError } = useApiError();

  return useQuery({
    queryKey: dashboardQueryKeys.statistics.students(filters),
    queryFn: async () => {
      try {
        // Get total students with minimal data to get count
        const studentsResult = await studentsApi.getAll({
          page: 1,
          limit: 1,
          includeInactive: filters?.includeInactive
        });

        // Get additional student metrics if dashboard API exists
        let additionalStats = {};
        try {
          const dashboardStats = await dashboardApi.getStudentMetrics(filters);
          additionalStats = dashboardStats;
        } catch {
          // Fallback if dashboard API doesn't exist
        }

        return {
          totalStudents: studentsResult.total || 0,
          activeStudents: studentsResult.total || 0,
          newStudents: 0, // Would come from dashboardApi
          trend: 0, // Would come from dashboardApi
          ...additionalStats,
        };
      } catch (error: any) {
        throw handleApiError(error, 'fetch_student_statistics');
      }
    },
    staleTime: DASHBOARD_CACHE_CONFIG.statistics.staleTime,
    gcTime: DASHBOARD_CACHE_CONFIG.statistics.gcTime,
    ...options,
  });
}
