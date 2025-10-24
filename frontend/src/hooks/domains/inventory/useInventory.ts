/**
 * Inventory Management Hooks
 *
 * Provides comprehensive hooks for managing inventory items, stock levels,
 * alerts, statistics, and stock history tracking. Integrates with inventory
 * API and handles loading states, error handling, and real-time updates.
 *
 * @module hooks/domains/inventory/useInventory
 */

import { useState, useEffect, useCallback } from 'react';
import { inventoryApi } from '@/services';
import toast from 'react-hot-toast';

/**
 * Filter criteria for inventory queries.
 *
 * Supports pagination, category/supplier filtering, location-based queries,
 * and stock level/maintenance status filtering.
 *
 * @interface InventoryFilters
 * @property {number} [page] - Page number for pagination (1-indexed)
 * @property {number} [limit] - Items per page (default: 20)
 * @property {string} [category] - Filter by category ID or name
 * @property {string} [supplier] - Filter by supplier/vendor ID
 * @property {string} [location] - Filter by storage location ID
 * @property {boolean} [lowStock] - Show only low stock items (below reorder point)
 * @property {boolean} [needsMaintenance] - Show items requiring maintenance
 * @property {boolean} [isActive] - Filter by active/inactive status
 */
export interface InventoryFilters {
  page?: number;
  limit?: number;
  category?: string;
  supplier?: string;
  location?: string;
  lowStock?: boolean;
  needsMaintenance?: boolean;
  isActive?: boolean;
}

/**
 * Hook for fetching and managing inventory items with filtering and pagination.
 *
 * Automatically fetches items on mount and when filters change. Provides
 * CRUD operations (create, update, delete) with optimistic UI updates and
 * automatic refresh after mutations.
 *
 * @param {InventoryFilters} [filters] - Optional filter criteria for inventory queries
 * @returns Object containing items, loading state, pagination, and CRUD methods
 *
 * @example
 * ```tsx
 * const { items, loading, createItem, updateItem, deleteItem, refresh } = useInventory({
 *   category: 'medical-supplies',
 *   lowStock: true,
 *   page: 1,
 *   limit: 20
 * });
 *
 * // Create new item
 * await createItem({ name: 'Bandages', quantity: 100, reorderPoint: 20 });
 *
 * // Update existing item
 * await updateItem('item-id', { quantity: 150 });
 *
 * // Delete item
 * await deleteItem('item-id');
 * ```
 */
export function useInventory(filters?: InventoryFilters) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await inventoryApi.getAll(filters);

      if (response.success) {
        setItems(response.data?.items || []);
        setPagination(response.data?.pagination || {
          page: 1,
          limit: 20,
          total: 0,
          pages: 0
        });
      } else {
        throw new Error(response.error?.message || 'Failed to fetch inventory items');
      }
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error(error.message || 'Failed to load inventory items');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const createItem = async (itemData: any) => {
    try {
      const response = await inventoryApi.create(itemData);
      if (response.success) {
        toast.success('Inventory item created successfully');
        await fetchItems();
        return response.data?.item;
      } else {
        throw new Error(response.error?.message || 'Failed to create item');
      }
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || 'Failed to create item');
      throw error;
    }
  };

  const updateItem = async (id: string, itemData: any) => {
    try {
      const response = await inventoryApi.update(id, itemData);
      if (response.success) {
        toast.success('Inventory item updated successfully');
        await fetchItems();
        return response.data?.item;
      } else {
        throw new Error(response.error?.message || 'Failed to update item');
      }
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || 'Failed to update item');
      throw error;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const response = await inventoryApi.delete(id);
      if (response.success) {
        toast.success('Inventory item deleted successfully');
        await fetchItems();
      } else {
        throw new Error(response.error?.message || 'Failed to delete item');
      }
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || 'Failed to delete item');
      throw error;
    }
  };

  return {
    items,
    loading,
    error,
    pagination,
    refresh: fetchItems,
    createItem,
    updateItem,
    deleteItem
  };
}

/**
 * Hook for fetching a single inventory item by ID.
 *
 * Automatically fetches item details when ID changes. Returns null if ID is not provided.
 * Ideal for detail views and edit forms.
 *
 * @param {string | null} id - Inventory item ID, or null to skip fetching
 * @returns Object containing item data, loading state, and refresh method
 *
 * @example
 * ```tsx
 * const { item, loading, error, refresh } = useInventoryItem(itemId);
 *
 * if (loading) return <LoadingSpinner />;
 * if (error) return <ErrorMessage error={error} />;
 * if (!item) return <NotFound />;
 *
 * return (
 *   <div>
 *     <h1>{item.name}</h1>
 *     <p>Stock: {item.quantity}</p>
 *     <p>Reorder Point: {item.reorderPoint}</p>
 *   </div>
 * );
 * ```
 */
export function useInventoryItem(id: string | null) {
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchItem = useCallback(async () => {
    if (!id) {
      setItem(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await inventoryApi.getById(id);

      if (response.success) {
        setItem(response.data?.item);
      } else {
        throw new Error(response.error?.message || 'Failed to fetch inventory item');
      }
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error(error.message || 'Failed to load inventory item');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  return {
    item,
    loading,
    error,
    refresh: fetchItem
  };
}

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

/**
 * Hook for fetching stock transaction history for a specific inventory item.
 *
 * Tracks all stock movements including:
 * - Stock adjustments (manual corrections)
 * - Receiving transactions (purchase orders)
 * - Issuing transactions (consumption/usage)
 * - Transfers between locations
 * - Returns and write-offs
 *
 * History is paginated for performance with large transaction volumes.
 *
 * @param {string | null} itemId - Inventory item ID, or null to skip fetching
 * @param {number} [page=1] - Page number for pagination
 * @param {number} [limit=50] - Transactions per page
 * @returns Object containing history array, pagination info, loading state, and refresh method
 *
 * @example
 * ```tsx
 * const { history, pagination, loading } = useStockHistory(itemId, 1, 25);
 *
 * return (
 *   <div>
 *     <h2>Stock History</h2>
 *     <table>
 *       <thead>
 *         <tr>
 *           <th>Date</th>
 *           <th>Type</th>
 *           <th>Quantity</th>
 *           <th>Balance</th>
 *           <th>User</th>
 *         </tr>
 *       </thead>
 *       <tbody>
 *         {history.map(transaction => (
 *           <tr key={transaction.id}>
 *             <td>{formatDate(transaction.date)}</td>
 *             <td>{transaction.type}</td>
 *             <td className={transaction.quantity > 0 ? 'positive' : 'negative'}>
 *               {transaction.quantity > 0 ? '+' : ''}{transaction.quantity}
 *             </td>
 *             <td>{transaction.balance}</td>
 *             <td>{transaction.user}</td>
 *           </tr>
 *         ))}
 *       </tbody>
 *     </table>
 *     <Pagination {...pagination} />
 *   </div>
 * );
 * ```
 */
export function useStockHistory(itemId: string | null, page: number = 1, limit: number = 50) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0
  });

  const fetchHistory = useCallback(async () => {
    if (!itemId) {
      setHistory([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await inventoryApi.getStockHistory(itemId, page, limit);

      if (response.success) {
        setHistory(response.data?.history || []);
        setPagination(response.data?.pagination || {
          page: 1,
          limit: 50,
          total: 0,
          pages: 0
        });
      } else {
        throw new Error(response.error?.message || 'Failed to fetch stock history');
      }
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error(error.message || 'Failed to load stock history');
    } finally {
      setLoading(false);
    }
  }, [itemId, page, limit]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    history,
    loading,
    error,
    pagination,
    refresh: fetchHistory
  };
}

/**
 * Hook for performing manual stock adjustments.
 *
 * Used for correcting inventory discrepancies, cycle count adjustments,
 * or recording stock changes not captured by normal transactions.
 *
 * Validation Rules:
 * - Quantity can be positive (increase) or negative (decrease)
 * - Reason is required for audit trail
 * - Adjustment cannot result in negative stock
 *
 * @returns Object containing adjustStock mutation function and loading state
 *
 * @example
 * ```tsx
 * const { adjustStock, loading } = useStockAdjustment();
 *
 * const handleCycleCount = async () => {
 *   const physicalCount = 45;
 *   const systemCount = 50;
 *   const difference = physicalCount - systemCount; // -5
 *
 *   try {
 *     await adjustStock(itemId, difference, 'Cycle count adjustment - physical count variance');
 *     console.log('Stock adjusted successfully');
 *   } catch (error) {
 *     console.error('Failed to adjust stock:', error);
 *   }
 * };
 *
 * // Increase stock
 * await adjustStock('item-123', 10, 'Found additional units in storage');
 *
 * // Decrease stock
 * await adjustStock('item-123', -5, 'Damaged units removed from inventory');
 * ```
 */
export function useStockAdjustment() {
  const [loading, setLoading] = useState(false);

  /**
   * Adjusts stock quantity for an inventory item.
   *
   * @param {string} itemId - Inventory item ID
   * @param {number} quantity - Adjustment amount (positive to increase, negative to decrease)
   * @param {string} reason - Reason for adjustment (required for audit trail)
   * @returns Promise resolving to adjustment response data
   * @throws {Error} If adjustment fails or would result in negative stock
   */
  const adjustStock = async (itemId: string, quantity: number, reason: string) => {
    try {
      setLoading(true);
      const response = await inventoryApi.adjustStock(itemId, quantity, reason);

      if (response.success) {
        toast.success(`Stock adjusted successfully: ${quantity > 0 ? '+' : ''}${quantity}`);
        return response.data;
      } else {
        throw new Error(response.error?.message || 'Failed to adjust stock');
      }
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || 'Failed to adjust stock');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    adjustStock,
    loading
  };
}
