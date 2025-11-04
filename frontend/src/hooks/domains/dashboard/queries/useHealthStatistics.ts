/**
 * Health Statistics Query Hooks
 *
 * Hooks for fetching health-related statistics for dashboard display.
 *
 * @module hooks/domains/dashboard/queries/useHealthStatistics
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import {
  healthRecordsApi,
  medicationsApi,
  incidentReportsApi
} from '@/services';
import { useApiError } from '../../../shared/useApiError';
import {
  dashboardQueryKeys,
  DASHBOARD_CACHE_CONFIG,
  type DashboardStatisticsFilters
} from '../config';

/**
 * Get health records statistics for dashboard
 */
export function useHealthRecordsStatistics(
  filters?: DashboardStatisticsFilters,
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
  const { handleApiError } = useApiError();

  return useQuery({
    queryKey: dashboardQueryKeys.statistics.health(filters),
    queryFn: async () => {
      try {
        // Since there's no direct statistics endpoint, we'll aggregate from available APIs
        const [recordsResult] = await Promise.all([
          healthRecordsApi.getRecords('', {
            page: 1,
            limit: 1,
            dateFrom: filters?.dateRange?.startDate,
            dateTo: filters?.dateRange?.endDate,
          }).catch(() => ({ records: [], total: 0 })),
        ]);

        return {
          totalHealthRecords: recordsResult.total || 0,
          pendingHealthScreenings: 0, // Would need specific endpoint
          completedScreenings: 0, // Would need specific endpoint
          screeningsTrend: 0, // Would need historical data
          alertsCount: 0, // Would need alerts endpoint
        };
      } catch (error: any) {
        throw handleApiError(error, 'fetch_health_statistics');
      }
    },
    staleTime: DASHBOARD_CACHE_CONFIG.statistics.staleTime,
    gcTime: DASHBOARD_CACHE_CONFIG.statistics.gcTime,
    ...options,
  });
}

/**
 * Get medication statistics for dashboard
 */
export function useMedicationStatistics(
  filters?: DashboardStatisticsFilters,
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
  const { handleApiError } = useApiError();

  return useQuery({
    queryKey: dashboardQueryKeys.statistics.medications(filters),
    queryFn: async () => {
      try {
        // Get medication data from available endpoints
        const [medicationsResult, scheduleResult] = await Promise.all([
          medicationsApi.getAll({ page: 1, limit: 1 }).catch(() => ({ medications: [], total: 0 })),
          medicationsApi.getSchedule(
            filters?.dateRange?.startDate,
            filters?.dateRange?.endDate,
            filters?.nurseId
          ).catch(() => ({ schedule: [] })),
        ]);

        return {
          activePrescriptions: medicationsResult.pagination?.total || 0,
          scheduledToday: scheduleResult.schedule?.length || 0,
          completedToday: 0, // Would need completion tracking
          prescriptionsTrend: 0, // Would need historical data
          adherenceRate: 0, // Would need adherence tracking
        };
      } catch (error: any) {
        throw handleApiError(error, 'fetch_medication_statistics');
      }
    },
    staleTime: DASHBOARD_CACHE_CONFIG.statistics.staleTime,
    gcTime: DASHBOARD_CACHE_CONFIG.statistics.gcTime,
    ...options,
  });
}

/**
 * Get incident statistics for dashboard
 */
export function useIncidentStatistics(
  filters?: DashboardStatisticsFilters,
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
  const { handleApiError } = useApiError();

  return useQuery({
    queryKey: dashboardQueryKeys.statistics.incidents(filters),
    queryFn: async () => {
      try {
        const incidentsResult = await incidentReportsApi.getAll({
          page: 1,
          limit: 1,
          startDate: filters?.dateRange?.startDate,
          endDate: filters?.dateRange?.endDate,
        }).catch(() => ({ incidents: [], total: 0 }));

        return {
          totalIncidents: incidentsResult.total || 0,
          openIncidents: 0, // Would need status filtering
          resolvedIncidents: 0, // Would need status filtering
          incidentsTrend: 0, // Would need historical data
          severity: {
            low: 0,
            medium: 0,
            high: 0,
            critical: 0,
          },
        };
      } catch (error: any) {
        throw handleApiError(error, 'fetch_incident_statistics');
      }
    },
    staleTime: DASHBOARD_CACHE_CONFIG.statistics.staleTime,
    gcTime: DASHBOARD_CACHE_CONFIG.statistics.gcTime,
    ...options,
  });
}
