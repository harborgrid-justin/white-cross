/**
 * OrderFilters Component
 *
 * Search, filter, and sort controls for purchase orders
 */

'use client';

import { Search } from 'lucide-react';
import type { PurchaseOrderStatus } from '@/types/domain/purchaseOrders';
import type { SortField, SortOrder } from './use-order-filters';

export interface OrderFiltersProps {
  searchQuery: string;
  statusFilter: PurchaseOrderStatus | 'ALL';
  sortBy: SortField;
  sortOrder: SortOrder;
  onSearchChange: (query: string) => void;
  onStatusChange: (status: PurchaseOrderStatus | 'ALL') => void;
  onSortChange: (value: string) => void;
  className?: string;
}

/**
 * Filter controls for purchase orders
 */
export function OrderFilters({
  searchQuery,
  statusFilter,
  sortBy,
  sortOrder,
  onSearchChange,
  onStatusChange,
  onSortChange,
  className = '',
}: OrderFiltersProps) {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="relative col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by PO number or vendor..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            aria-label="Search purchase orders"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as PurchaseOrderStatus | 'ALL')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          aria-label="Filter by status"
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="ORDERED">Ordered</option>
          <option value="PARTIALLY_RECEIVED">Partially Received</option>
          <option value="RECEIVED">Received</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        {/* Sort Selector */}
        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          aria-label="Sort purchase orders"
        >
          <option value="orderDate-desc">Newest First</option>
          <option value="orderDate-asc">Oldest First</option>
          <option value="total-desc">Highest Value</option>
          <option value="total-asc">Lowest Value</option>
          <option value="status-asc">Status A-Z</option>
        </select>
      </div>
    </div>
  );
}
