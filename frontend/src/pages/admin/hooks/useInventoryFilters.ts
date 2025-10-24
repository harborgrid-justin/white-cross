/**
 * WF-HOOK-278 | useInventoryFilters.ts - Inventory filtering hook
 * Purpose: Custom hook for filtering inventory items based on criteria
 * Last Updated: 2025-10-24 | File Type: .ts
 */

import { useMemo } from 'react';
import type { InventoryItem, InventoryFilters } from '../types';

/**
 * Hook parameters interface
 * @interface UseInventoryFiltersParams
 */
interface UseInventoryFiltersParams {
  /** Array of inventory items to filter */
  items: InventoryItem[];
  /** Filter criteria */
  filters: InventoryFilters;
}

/**
 * Hook return type interface
 * @interface UseInventoryFiltersReturn
 */
interface UseInventoryFiltersReturn {
  /** Filtered array of inventory items */
  filteredItems: InventoryItem[];
  /** Count of filtered items */
  filteredCount: number;
  /** Total count before filtering */
  totalCount: number;
  /** Whether any filters are active */
  hasActiveFilters: boolean;
}

/**
 * Custom hook for filtering inventory items
 * Applies various filters to inventory items including search, category,
 * alert level, and stock status filters.
 *
 * @param {UseInventoryFiltersParams} params - Hook parameters
 * @returns {UseInventoryFiltersReturn} Filtered items and metadata
 *
 * @example
 * ```tsx
 * const { filteredItems, filteredCount, hasActiveFilters } = useInventoryFilters({
 *   items: inventoryItems,
 *   filters: {
 *     searchQuery: 'bandage',
 *     selectedCategory: 'Medical Supplies',
 *     alertLevel: 'all',
 *     stockStatus: 'low-stock'
 *   }
 * });
 * ```
 */
export const useInventoryFilters = ({
  items,
  filters
}: UseInventoryFiltersParams): UseInventoryFiltersReturn => {
  /**
   * Determines if an item matches the search query
   * Searches across name, category, and supplier fields
   */
  const matchesSearch = (item: InventoryItem, query: string): boolean => {
    if (!query || query.trim() === '') return true;

    const searchLower = query.toLowerCase().trim();

    return (
      item.name.toLowerCase().includes(searchLower) ||
      item.category.toLowerCase().includes(searchLower) ||
      (item.supplier?.toLowerCase().includes(searchLower) ?? false)
    );
  };

  /**
   * Determines if an item matches the category filter
   */
  const matchesCategory = (item: InventoryItem, category: string): boolean => {
    if (!category || category === 'all') return true;
    return item.category === category;
  };

  /**
   * Determines if an item matches the alert level filter
   */
  const matchesAlertLevel = (item: InventoryItem, alertLevel: string): boolean => {
    if (!alertLevel || alertLevel === 'all') return true;

    const stockPercentage = (item.quantity / item.reorderLevel) * 100;

    switch (alertLevel) {
      case 'critical':
        // Critical: out of stock
        return item.quantity === 0;
      case 'low':
        // Low: below reorder level but not zero
        return item.quantity > 0 && item.quantity < item.reorderLevel;
      case 'adequate':
        // Adequate: at or above reorder level
        return item.quantity >= item.reorderLevel;
      default:
        return true;
    }
  };

  /**
   * Determines if an item matches the stock status filter
   */
  const matchesStockStatus = (item: InventoryItem, stockStatus: string): boolean => {
    if (!stockStatus || stockStatus === 'all') return true;

    switch (stockStatus) {
      case 'in-stock':
        return item.quantity >= item.reorderLevel;
      case 'low-stock':
        return item.quantity > 0 && item.quantity < item.reorderLevel;
      case 'out-of-stock':
        return item.quantity === 0;
      default:
        return true;
    }
  };

  /**
   * Check if any filters are actively being used
   */
  const hasActiveFilters = useMemo(() => {
    return (
      (filters.searchQuery && filters.searchQuery.trim() !== '') ||
      (filters.selectedCategory && filters.selectedCategory !== 'all') ||
      (filters.alertLevel && filters.alertLevel !== 'all') ||
      (filters.stockStatus && filters.stockStatus !== 'all')
    );
  }, [filters]);

  /**
   * Apply all filters to the items array
   * Uses useMemo for performance optimization
   */
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      return (
        matchesSearch(item, filters.searchQuery) &&
        matchesCategory(item, filters.selectedCategory) &&
        matchesAlertLevel(item, filters.alertLevel) &&
        matchesStockStatus(item, filters.stockStatus)
      );
    });
  }, [items, filters]);

  /**
   * Calculate counts
   */
  const filteredCount = filteredItems.length;
  const totalCount = items.length;

  return {
    filteredItems,
    filteredCount,
    totalCount,
    hasActiveFilters
  };
};
