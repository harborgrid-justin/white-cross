/**
 * Inventory Query Hooks
 *
 * Provides hooks for fetching inventory items and item details.
 * Handles list queries with filtering/pagination and single item queries.
 *
 * @module hooks/domains/inventory/useInventory.queries
 */

import { useState, useEffect, useCallback } from 'react';
import { inventoryApi } from '@/services';
import toast from 'react-hot-toast';
import type { InventoryFilters } from './types';

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
