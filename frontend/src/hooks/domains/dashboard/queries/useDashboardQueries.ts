/**
 * Dashboard Query Hooks
 * 
 * General dashboard data fetching hooks for overview, analytics, and activities.
 * 
 * @module hooks/domains/dashboard/queries/useDashboardQueries
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { useApiError } from '../../../shared/useApiError';
import { serverGet } from '@/lib/api/server';
import { DASHBOARD_ENDPOINTS, ANALYTICS_ENDPOINTS, COMPLIANCE_ENDPOINTS } from '@/constants/api/admin';
import { 
  dashboardQueryKeys, 
  DASHBOARD_CACHE_CONFIG,
  type DashboardStatisticsFilters
} from '../config';

/**
 * Get general dashboard statistics
 */
export function useDashboardStatistics(
  filters?: DashboardStatisticsFilters,
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: dashboardQueryKeys.statistics.global(filters),
    queryFn: async () => {
      try {
        const response = await serverGet(DASHBOARD_ENDPOINTS.STATS, {
          params: filters,
        });
        return response.data;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    staleTime: DASHBOARD_CACHE_CONFIG.statistics.staleTime,
    gcTime: DASHBOARD_CACHE_CONFIG.statistics.gcTime,
    meta: {
      errorMessage: 'Failed to load dashboard statistics'
    },
    ...options,
  });
}

/**
 * Get dashboard overview data
 */
export function useDashboardOverview(
  userId?: string,
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: dashboardQueryKeys.overview.byUser(userId || 'current'),
    queryFn: async () => {
      try {
        const response = await serverGet(DASHBOARD_ENDPOINTS.STATS, {
          params: { userId },
        });
        return response.data;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    staleTime: DASHBOARD_CACHE_CONFIG.overview.staleTime,
    gcTime: DASHBOARD_CACHE_CONFIG.overview.gcTime,
    meta: {
      errorMessage: 'Failed to load dashboard overview'
    },
    ...options,
  });
}

/**
 * Get dashboard analytics data
 */
export function useDashboardAnalytics(
  period: string = 'week',
  filters?: DashboardStatisticsFilters,
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: dashboardQueryKeys.analytics.metrics(period, filters),
    queryFn: async () => {
      try {
        const response = await serverGet(ANALYTICS_ENDPOINTS.DASHBOARD, {
          params: { period, ...filters },
        });
        return response.data;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    staleTime: DASHBOARD_CACHE_CONFIG.analytics.staleTime,
    gcTime: DASHBOARD_CACHE_CONFIG.analytics.gcTime,
    meta: {
      errorMessage: 'Failed to load dashboard analytics'
    },
    ...options,
  });
}

/**
 * Get dashboard metrics for specific time period
 */
export function useDashboardMetrics(
  period: string = 'today',
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: dashboardQueryKeys.analytics.metrics(period),
    queryFn: async () => {
      try {
        const response = await serverGet(ANALYTICS_ENDPOINTS.METRICS, {
          params: { period },
        });
        return response.data;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    staleTime: DASHBOARD_CACHE_CONFIG.analytics.staleTime,
    gcTime: DASHBOARD_CACHE_CONFIG.analytics.gcTime,
    meta: {
      errorMessage: 'Failed to load dashboard metrics'
    },
    ...options,
  });
}

/**
 * Get dashboard chart data
 */
export function useDashboardCharts(
  chartType: string,
  filters?: DashboardStatisticsFilters,
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: dashboardQueryKeys.analytics.charts(chartType, filters),
    queryFn: async () => {
      try {
        const response = await serverGet(DASHBOARD_ENDPOINTS.CHART_DATA, {
          params: { type: chartType, ...filters },
        });
        return response.data;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    staleTime: DASHBOARD_CACHE_CONFIG.analytics.staleTime,
    gcTime: DASHBOARD_CACHE_CONFIG.analytics.gcTime,
    meta: {
      errorMessage: 'Failed to load dashboard charts'
    },
    ...options,
  });
}

/**
 * Get dashboard alerts
 */
export function useDashboardAlerts(
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: dashboardQueryKeys.alerts.all(),
    queryFn: async () => {
      try {
        const response = await serverGet(COMPLIANCE_ENDPOINTS.ALERTS);
        return response.data;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    staleTime: DASHBOARD_CACHE_CONFIG.alerts.staleTime,
    gcTime: DASHBOARD_CACHE_CONFIG.alerts.gcTime,
    meta: {
      errorMessage: 'Failed to load dashboard alerts'
    },
    ...options,
  });
}

/**
 * Get recent dashboard activities
 */
export function useDashboardActivities(
  limit: number = 10,
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: dashboardQueryKeys.activities.recent(limit),
    queryFn: async () => {
      try {
        const response = await serverGet(DASHBOARD_ENDPOINTS.RECENT_ACTIVITIES, {
          params: { limit },
        });
        return response.data;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    staleTime: DASHBOARD_CACHE_CONFIG.activities.staleTime,
    gcTime: DASHBOARD_CACHE_CONFIG.activities.gcTime,
    meta: {
      errorMessage: 'Failed to load dashboard activities'
    },
    ...options,
  });
}
