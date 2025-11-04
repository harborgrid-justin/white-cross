/**
 * System Statistics Query Hooks
 *
 * Hooks for fetching system-related statistics (inventory, alerts) for dashboard display.
 *
 * @module hooks/domains/dashboard/queries/useSystemStatistics
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { inventoryApi } from '@/services';
import { useApiError } from '../../../shared/useApiError';
import {
  dashboardQueryKeys,
  DASHBOARD_CACHE_CONFIG,
  type DashboardStatisticsFilters
} from '../config';

/**
 * Get inventory statistics for dashboard
 */
export function useInventoryStatistics(
  filters?: DashboardStatisticsFilters,
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
  const { handleApiError } = useApiError();

  return useQuery({
    queryKey: dashboardQueryKeys.statistics.inventory(filters),
    queryFn: async () => {
      try {
        const [statsResult, alertsResult] = await Promise.all([
          inventoryApi.getStats().catch(() => ({})),
          inventoryApi.getAlerts().catch(() => []),
        ]);

        return {
          totalItems: statsResult.totalItems || 0,
          lowStockItems: statsResult.lowStockCount || 0,
          criticalAlerts: Array.isArray(alertsResult)
            ? alertsResult.filter((alert: any) => alert.severity === 'critical').length
            : 0,
          alertsTrend: 0, // Would need historical data
          inventoryValue: statsResult.totalValue || 0,
        };
      } catch (error: any) {
        throw handleApiError(error, 'fetch_inventory_statistics');
      }
    },
    staleTime: DASHBOARD_CACHE_CONFIG.statistics.staleTime,
    gcTime: DASHBOARD_CACHE_CONFIG.statistics.gcTime,
    ...options,
  });
}

/**
 * Hook specifically for inventory alerts (used by dashboard components)
 */
export function useInventoryAlerts(
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
  const { handleApiError } = useApiError();

  return useQuery({
    queryKey: dashboardQueryKeys.alerts.byType('inventory'),
    queryFn: async () => {
      try {
        const alerts = await inventoryApi.getAlerts();

        return {
          alerts: Array.isArray(alerts) ? alerts : [],
          loading: false,
          error: null,
          refresh: async () => {
            // This would normally be handled by react-query refetch
          },
          criticalAlerts: Array.isArray(alerts)
            ? alerts.filter((alert: any) => alert.severity === 'critical').length
            : 0,
          alertsTrend: 0, // Would need historical comparison
        };
      } catch (error: any) {
        throw handleApiError(error, 'fetch_inventory_alerts');
      }
    },
    staleTime: DASHBOARD_CACHE_CONFIG.alerts.staleTime,
    gcTime: DASHBOARD_CACHE_CONFIG.alerts.gcTime,
    ...options,
  });
}
