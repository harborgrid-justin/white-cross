/**
 * useInventoryFilters Hook
 *
 * Manages filtering logic for inventory items
 *
 * @module hooks/useInventoryFilters
 */

import { useMemo } from 'react';
import type { InventoryItem, InventoryFilters } from '../types';

interface UseInventoryFiltersParams {
  items: InventoryItem[];
  filters: InventoryFilters;
}

/**
 * Custom hook for filtering inventory items
 */
export function useInventoryFilters({ items, filters }: UseInventoryFiltersParams) {
  /**
   * Filter items based on current filters
   */
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Search filter
      const matchesSearch =
        item.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(filters.searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        filters.selectedCategory === 'all' || item.category === filters.selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [items, filters]);

  return {
    filteredItems,
  };
}
