/**
 * useOrderFilters Hook
 *
 * Custom hook for managing purchase order filtering, searching, and sorting state
 */

'use client';

import { useState, useMemo, useCallback } from 'react';
import type { PurchaseOrder, PurchaseOrderStatus } from '@/types/domain/purchaseOrders';

export type SortField = 'orderDate' | 'total' | 'status';
export type SortOrder = 'asc' | 'desc';

export interface OrderFilters {
  searchQuery: string;
  statusFilter: PurchaseOrderStatus | 'ALL';
  sortBy: SortField;
  sortOrder: SortOrder;
}

export interface UseOrderFiltersReturn {
  // Filter state
  searchQuery: string;
  statusFilter: PurchaseOrderStatus | 'ALL';
  sortBy: SortField;
  sortOrder: SortOrder;

  // Filter setters
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: PurchaseOrderStatus | 'ALL') => void;
  setSortBy: (field: SortField) => void;
  setSortOrder: (order: SortOrder) => void;
  setSortByWithOrder: (value: string) => void;

  // Filter operations
  resetFilters: () => void;
  applyFilters: (orders: PurchaseOrder[]) => PurchaseOrder[];
}

const DEFAULT_FILTERS: OrderFilters = {
  searchQuery: '',
  statusFilter: 'ALL',
  sortBy: 'orderDate',
  sortOrder: 'desc',
};

/**
 * Hook for managing purchase order filters
 */
export function useOrderFilters(): UseOrderFiltersReturn {
  const [searchQuery, setSearchQuery] = useState(DEFAULT_FILTERS.searchQuery);
  const [statusFilter, setStatusFilter] = useState<PurchaseOrderStatus | 'ALL'>(
    DEFAULT_FILTERS.statusFilter
  );
  const [sortBy, setSortBy] = useState<SortField>(DEFAULT_FILTERS.sortBy);
  const [sortOrder, setSortOrder] = useState<SortOrder>(DEFAULT_FILTERS.sortOrder);

  // Reset all filters to defaults
  const resetFilters = useCallback(() => {
    setSearchQuery(DEFAULT_FILTERS.searchQuery);
    setStatusFilter(DEFAULT_FILTERS.statusFilter);
    setSortBy(DEFAULT_FILTERS.sortBy);
    setSortOrder(DEFAULT_FILTERS.sortOrder);
  }, []);

  // Set sort field and order from combined value (e.g., "orderDate-desc")
  const setSortByWithOrder = useCallback((value: string) => {
    const [field, order] = value.split('-');
    setSortBy(field as SortField);
    setSortOrder(order as SortOrder);
  }, []);

  // Apply filters to orders array
  const applyFilters = useCallback(
    (orders: PurchaseOrder[]): PurchaseOrder[] => {
      return orders
        .filter((order) => {
          // Search filter
          const matchesSearch =
            searchQuery === '' ||
            order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.vendor?.name?.toLowerCase().includes(searchQuery.toLowerCase());

          // Status filter
          const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;

          return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
          let comparison = 0;

          // Sort by selected field
          if (sortBy === 'orderDate') {
            comparison =
              new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
          } else if (sortBy === 'total') {
            comparison = a.total - b.total;
          } else if (sortBy === 'status') {
            comparison = a.status.localeCompare(b.status);
          }

          // Apply sort order
          return sortOrder === 'asc' ? comparison : -comparison;
        });
    },
    [searchQuery, statusFilter, sortBy, sortOrder]
  );

  return {
    searchQuery,
    statusFilter,
    sortBy,
    sortOrder,
    setSearchQuery,
    setStatusFilter,
    setSortBy,
    setSortOrder,
    setSortByWithOrder,
    resetFilters,
    applyFilters,
  };
}
