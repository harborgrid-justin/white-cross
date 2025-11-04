/**
 * Appointment Statistics Query Hook
 *
 * Hook for fetching appointment statistics for dashboard display.
 *
 * @module hooks/domains/dashboard/queries/useAppointmentStatistics
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { appointmentsApi } from '@/services';
import { useApiError } from '../../../shared/useApiError';
import {
  dashboardQueryKeys,
  DASHBOARD_CACHE_CONFIG,
  type DashboardStatisticsFilters
} from '../config';

/**
 * Get appointment statistics for dashboard
 */
export function useAppointmentStatistics(
  filters?: DashboardStatisticsFilters,
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: dashboardQueryKeys.statistics.appointments(filters),
    queryFn: async () => {
      try {
        const result = await appointmentsApi.getStatistics({
          dateFrom: filters?.dateRange?.startDate,
          dateTo: filters?.dateRange?.endDate,
          nurseId: filters?.nurseId,
        });

        // Transform to consistent format - using safe property access
        return {
          totalAppointments: result.total || result.totalCount || 0,
          completedAppointments: result.completed || result.completedCount || 0,
          upcomingAppointments: result.upcoming || result.upcomingCount || 0,
          cancelledAppointments: result.cancelled || result.cancelledCount || 0,
          completionRate: result.completionRate || 0,
          trend: result.trend || result.percentageChange || 0,
          completionsTrend: result.completionRate || 0,
        };
      } catch (error: any) {
        throw handleError(error, 'fetch_appointment_statistics');
      }
    },
    staleTime: DASHBOARD_CACHE_CONFIG.statistics.staleTime,
    gcTime: DASHBOARD_CACHE_CONFIG.statistics.gcTime,
    ...options,
  });
}
