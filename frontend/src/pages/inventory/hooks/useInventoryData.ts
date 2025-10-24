/**
 * useInventoryData Hook
 * Purpose: Custom hook for inventory data management with Redux integration
 * Features: Data fetching, filtering, pagination, real-time updates
 *
 * Provides comprehensive inventory management functionality including:
 * - Items, transactions, and alerts
 * - Statistics and analytics
 * - Vendor and maintenance data
 * - Search and filtering
 */

import { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import {
  fetchInventoryItems,
  fetchInventoryItemById,
  fetchInventoryAlerts,
  fetchInventoryStats,
  fetchStockHistory,
  fetchMaintenanceSchedule,
  fetchUsageAnalytics,
  fetchSupplierPerformance,
  fetchInventoryValuation,
  searchInventoryItems,
  selectInventoryItems,
  selectItemsLoading,
  selectItemsError,
  selectPagination,
  selectFilters,
  selectInventoryAlerts,
  selectInventoryStats,
  selectLowStockItems,
  selectActiveItems,
  selectExpiringItems,
  setFilters,
  clearItemsError,
  type InventoryFilters
} from '../store/inventorySlice';

/**
 * Hook options interface
 */
export interface UseInventoryDataOptions {
  /**
   * Auto-fetch data on mount
   */
  autoFetch?: boolean;

  /**
   * Polling interval in milliseconds (0 to disable)
   */
  pollingInterval?: number;

  /**
   * Initial filters to apply
   */
  initialFilters?: Partial<InventoryFilters>;

  /**
   * Fetch alerts on mount
   */
  fetchAlerts?: boolean;

  /**
   * Fetch statistics on mount
   */
  fetchStats?: boolean;
}

/**
 * Hook return value interface
 */
export interface UseInventoryDataReturn {
  // Data
  items: any[];
  allItems: any[];
  lowStockItems: any[];
  activeItems: any[];
  expiringItems: any[];
  alerts: any[];
  stats: any | null;

  // State
  isLoading: boolean;
  error: string | null;

  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  // Filters
  filters: InventoryFilters;

  // Actions
  fetchItems: (filters?: Partial<InventoryFilters>) => Promise<void>;
  fetchItemById: (id: string) => Promise<void>;
  fetchAlerts: () => Promise<void>;
  fetchStatistics: () => Promise<void>;
  searchItems: (query: string) => Promise<void>;
  setItemFilters: (filters: Partial<InventoryFilters>) => void;
  clearError: () => void;
  refetch: () => Promise<void>;

  // Analytics
  fetchHistory: (itemId: string, page?: number, limit?: number) => Promise<void>;
  fetchMaintenance: (startDate?: string, endDate?: string) => Promise<void>;
  fetchAnalytics: (startDate?: string, endDate?: string) => Promise<void>;
  fetchValuation: () => Promise<void>;
}

/**
 * Custom hook for inventory data management
 *
 * Provides comprehensive access to inventory data with automatic state management,
 * real-time updates, and convenient utility functions.
 *
 * @param options - Configuration options for the hook
 * @returns Inventory data and management functions
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { items, isLoading, fetchItems } = useInventoryData();
 *
 * // With auto-fetch and alerts
 * const { items, alerts } = useInventoryData({
 *   autoFetch: true,
 *   fetchAlerts: true,
 *   fetchStats: true
 * });
 *
 * // With filtering and polling
 * const { items } = useInventoryData({
 *   autoFetch: true,
 *   initialFilters: { category: 'MEDICATION', lowStock: true },
 *   pollingInterval: 60000 // Poll every minute
 * });
 * ```
 */
export const useInventoryData = (
  options: UseInventoryDataOptions = {}
): UseInventoryDataReturn => {
  const {
    autoFetch = true,
    pollingInterval = 0,
    initialFilters = {},
    fetchAlerts: autoFetchAlerts = false,
    fetchStats: autoFetchStats = false
  } = options;

  const dispatch = useDispatch<AppDispatch>();

  // Select data from Redux store
  const items = useSelector(selectInventoryItems);
  const isLoading = useSelector(selectItemsLoading);
  const error = useSelector(selectItemsError);
  const pagination = useSelector(selectPagination);
  const currentFilters = useSelector(selectFilters);
  const alerts = useSelector(selectInventoryAlerts);
  const stats = useSelector(selectInventoryStats);
  const lowStockItems = useSelector(selectLowStockItems);
  const activeItems = useSelector(selectActiveItems);

  // Get expiring items (30 days default)
  const expiringItems = useSelector((state: RootState) => selectExpiringItems(state, 30));

  /**
   * Fetch inventory items with filters
   */
  const fetchItems = useCallback(async (filters?: Partial<InventoryFilters>) => {
    const finalFilters = { ...currentFilters, ...filters };
    await dispatch(fetchInventoryItems(finalFilters)).unwrap();
  }, [dispatch, currentFilters]);

  /**
   * Fetch single inventory item by ID
   */
  const fetchItemById = useCallback(async (id: string) => {
    await dispatch(fetchInventoryItemById(id)).unwrap();
  }, [dispatch]);

  /**
   * Fetch inventory alerts
   */
  const fetchAlertsData = useCallback(async () => {
    await dispatch(fetchInventoryAlerts()).unwrap();
  }, [dispatch]);

  /**
   * Fetch inventory statistics
   */
  const fetchStatistics = useCallback(async () => {
    await dispatch(fetchInventoryStats()).unwrap();
  }, [dispatch]);

  /**
   * Search inventory items
   */
  const searchItems = useCallback(async (query: string, limit: number = 10) => {
    await dispatch(searchInventoryItems({ query, limit })).unwrap();
  }, [dispatch]);

  /**
   * Set filters for inventory items
   */
  const setItemFilters = useCallback((filters: Partial<InventoryFilters>) => {
    dispatch(setFilters(filters));
  }, [dispatch]);

  /**
   * Clear current error
   */
  const clearError = useCallback(() => {
    dispatch(clearItemsError());
  }, [dispatch]);

  /**
   * Refetch with current filters
   */
  const refetch = useCallback(async () => {
    await fetchItems();
    if (autoFetchAlerts) {
      await fetchAlertsData();
    }
    if (autoFetchStats) {
      await fetchStatistics();
    }
  }, [fetchItems, fetchAlertsData, fetchStatistics, autoFetchAlerts, autoFetchStats]);

  /**
   * Fetch stock history for an item
   */
  const fetchHistory = useCallback(async (
    itemId: string,
    page: number = 1,
    limit: number = 20
  ) => {
    await dispatch(fetchStockHistory({ id: itemId, page, limit })).unwrap();
  }, [dispatch]);

  /**
   * Fetch maintenance schedule
   */
  const fetchMaintenance = useCallback(async (
    startDate?: string,
    endDate?: string
  ) => {
    await dispatch(fetchMaintenanceSchedule({ startDate, endDate })).unwrap();
  }, [dispatch]);

  /**
   * Fetch usage analytics
   */
  const fetchAnalytics = useCallback(async (
    startDate?: string,
    endDate?: string
  ) => {
    await dispatch(fetchUsageAnalytics({ startDate, endDate })).unwrap();
  }, [dispatch]);

  /**
   * Fetch inventory valuation
   */
  const fetchValuation = useCallback(async () => {
    await dispatch(fetchInventoryValuation()).unwrap();
  }, [dispatch]);

  // Apply initial filters on mount
  useEffect(() => {
    if (Object.keys(initialFilters).length > 0) {
      setItemFilters(initialFilters);
    }
  }, []); // Only run once on mount

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchItems();
    }
    if (autoFetchAlerts) {
      fetchAlertsData();
    }
    if (autoFetchStats) {
      fetchStatistics();
    }
  }, [autoFetch, autoFetchAlerts, autoFetchStats]); // Only run on mount

  // Set up polling if interval is specified
  useEffect(() => {
    if (pollingInterval > 0) {
      const intervalId = setInterval(() => {
        refetch();
      }, pollingInterval);

      return () => clearInterval(intervalId);
    }
  }, [pollingInterval, refetch]);

  return {
    // Data
    items,
    allItems: items,
    lowStockItems,
    activeItems,
    expiringItems,
    alerts,
    stats,

    // State
    isLoading,
    error,

    // Pagination
    pagination,

    // Filters
    filters: currentFilters,

    // Actions
    fetchItems,
    fetchItemById,
    fetchAlerts: fetchAlertsData,
    fetchStatistics,
    searchItems,
    setItemFilters,
    clearError,
    refetch,

    // Analytics
    fetchHistory,
    fetchMaintenance,
    fetchAnalytics,
    fetchValuation,
  };
};

/**
 * Default export for convenience
 */
export default useInventoryData;
