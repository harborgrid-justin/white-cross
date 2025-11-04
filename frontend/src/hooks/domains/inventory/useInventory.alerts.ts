/**
 * Inventory Alerts and Statistics Hooks
 *
 * Provides hooks for fetching inventory alerts (low stock, expiring items, maintenance)
 * and inventory statistics/metrics.
 *
 * @module hooks/domains/inventory/useInventory.alerts
 */

import { useState, useEffect, useCallback } from 'react';
import { inventoryApi } from '@/services';
import toast from 'react-hot-toast';

/**
 * Hook for fetching inventory alerts (low stock, expiring items, maintenance needed).
 *
 * Automatically fetches alerts on mount. Alerts are critical notifications that
 * require attention, such as:
 * - Low stock items below reorder point
 * - Items approaching expiration
 * - Equipment requiring maintenance
 * - Inactive items taking up space
 *
 * Note: Errors are logged to console rather than showing toast notifications
 * to avoid disrupting user experience with non-critical alerts.
 *
 * @returns Object containing alerts array, loading state, and refresh method
 *
 * @example
 * ```tsx
 * const { alerts, loading, refresh } = useInventoryAlerts();
 *
 * return (
 *   <div>
 *     <h2>Inventory Alerts ({alerts.length})</h2>
 *     {alerts.map(alert => (
 *       <Alert key={alert.id} severity={alert.severity}>
 *         {alert.message}
 *       </Alert>
 *     ))}
 *   </div>
 * );
 * ```
 */
export function useInventoryAlerts() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await inventoryApi.getAlerts();

      if (response.success) {
        setAlerts(response.data?.alerts || []);
      } else {
        throw new Error(response.error?.message || 'Failed to fetch alerts');
      }
    } catch (err) {
      const error = err as Error;
      setError(error);
      // Don't show toast for alerts - it's not critical
      console.error('Failed to load inventory alerts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  return {
    alerts,
    loading,
    error,
    refresh: fetchAlerts
  };
}

/**
 * Hook for fetching inventory statistics and metrics.
 *
 * Provides high-level metrics for inventory overview dashboards:
 * - Total items count
 * - Total inventory value
 * - Low stock items count
 * - Items requiring maintenance
 * - Average stock levels
 * - Category-wise breakdowns
 *
 * @returns Object containing statistics data, loading state, and refresh method
 *
 * @example
 * ```tsx
 * const { stats, loading, error } = useInventoryStats();
 *
 * if (loading) return <LoadingSpinner />;
 *
 * return (
 *   <div className="metrics-grid">
 *     <MetricCard title="Total Items" value={stats.totalItems} />
 *     <MetricCard title="Total Value" value={`$${stats.totalValue}`} />
 *     <MetricCard title="Low Stock" value={stats.lowStockCount} severity="warning" />
 *     <MetricCard title="Needs Maintenance" value={stats.maintenanceCount} severity="error" />
 *   </div>
 * );
 * ```
 */
export function useInventoryStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await inventoryApi.getStats();

      if (response.success) {
        setStats(response.data);
      } else {
        throw new Error(response.error?.message || 'Failed to fetch statistics');
      }
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error(error.message || 'Failed to load inventory statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refresh: fetchStats
  };
}
