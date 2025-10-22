/**
 * WF-COMP-133 | useInventory.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../services/api | Dependencies: react, ../services/api, react-hot-toast
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: functions, interfaces | Key Features: useState, useEffect, useCallback
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import { useState, useEffect, useCallback } from 'react';
import { inventoryApi } from '@/services';
import toast from 'react-hot-toast';

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

export function useStockAdjustment() {
  const [loading, setLoading] = useState(false);

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
