/**
 * WF-IDX-218 | index.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ./hooks/useInventoryData, ./hooks/useInventoryFilters, ./components/InventoryHeader | Dependencies: @/hooks/useRouteState, ./hooks/useInventoryData, ./hooks/useInventoryFilters
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export | Key Features: useState, component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Inventory Page - Enterprise Implementation
 *
 * Complete inventory management system with:
 * - Real-time stock tracking
 * - Automated reorder alerts
 * - Vendor management
 * - Purchase order tracking
 * - Budget monitoring
 * - Analytics and reporting
 *
 * @module pages/Inventory
 */

import React, { useState } from 'react';
import { usePersistedFilters, usePageState, useSortState } from '@/hooks/useRouteState';
import { useInventoryData } from './hooks/useInventoryData';
import { useInventoryFilters } from './hooks/useInventoryFilters';
import InventoryHeader from './components/InventoryHeader';
import InventoryStatistics from './components/InventoryStatistics';
import InventoryAlerts from './components/InventoryAlerts';
import InventoryTabs from './components/InventoryTabs';
import InventoryLoadingState from './components/InventoryLoadingState';
import InventoryItemsTab from '../../components/features/inventory/components/tabs/InventoryItemsTab';
import InventoryVendorsTab from '../../components/features/inventory/components/tabs/InventoryVendorsTab';
import InventoryOrdersTab from '../../components/features/inventory/components/tabs/InventoryOrdersTab';
import InventoryBudgetTab from '../../components/features/inventory/components/tabs/InventoryBudgetTab';
import InventoryAnalyticsTab from '../../components/features/inventory/components/tabs/InventoryAnalyticsTab';
import type { InventoryTab, InventorySortColumn, InventoryFilters } from './types';

/**
 * Main Inventory Page Component.
 *
 * Comprehensive medical inventory management system for school health offices.
 * Provides real-time stock tracking, automated reorder alerts, vendor management,
 * purchase order tracking, budget monitoring, and analytics.
 *
 * @component
 *
 * @example
 * ```tsx
 * <Inventory />
 * ```
 *
 * @remarks
 * **RBAC Requirements:**
 * - Requires 'admin' or 'inventory.view' permission to access
 * - 'inventory.manage' permission required for add/edit/delete operations
 *
 * **Features:**
 * - **Items Management**: Real-time stock tracking with category organization
 * - **Vendor Management**: Vendor directory with contact and performance tracking
 * - **Purchase Orders**: Order creation, approval workflow, and receiving tracking
 * - **Budget Monitoring**: Category-based budget allocation and spending analysis
 * - **Analytics**: Usage trends, cost analysis, and inventory optimization
 * - **Automated Alerts**: Low stock warnings, expiration notifications, budget alerts
 *
 * **State Management:**
 * - **Filter Persistence**: usePersistedFilters with localStorage and URL sync
 * - **Pagination**: usePageState with configurable page sizes (10, 20, 50, 100)
 * - **Sorting**: useSortState with persistent user preferences
 * - **Data Fetching**: Custom useInventoryData hook with conditional loading
 *
 * **Advanced Features:**
 * - Tab-based navigation (Items, Vendors, Orders, Budget, Analytics)
 * - Multi-criteria filtering (search, category, alert level, stock status)
 * - Real-time statistics dashboard
 * - URL state synchronization for shareable links
 * - Debounced search (300ms) for performance
 *
 * **Accessibility:**
 * - Tab navigation with keyboard support (Arrow keys, Home, End)
 * - Screen reader-friendly table headers and labels
 * - ARIA attributes for interactive elements
 * - Focus management in modals and dropdowns
 * - High-contrast status indicators
 *
 * **Performance Optimizations:**
 * - Conditional data fetching (load only active tab data)
 * - Filter debouncing to reduce API calls
 * - Pagination to limit rendered items
 * - Memoized filter logic via useInventoryFilters
 * - Automatic reset to page 1 on filter changes
 *
 * @returns {JSX.Element} The rendered inventory management interface
 *
 * @see {@link useInventoryData} for data fetching hook
 * @see {@link useInventoryFilters} for filtering logic
 * @see {@link usePersistedFilters} for filter persistence
 */
export default function Inventory() {
  // =====================
  // STATE MANAGEMENT
  // =====================
  const [activeTab, setActiveTab] = useState<InventoryTab>('items');
  const [showAddModal, setShowAddModal] = useState(false);

  // Filter persistence
  const { filters, updateFilter, clearFilters, isRestored } =
    usePersistedFilters<InventoryFilters>({
      storageKey: 'inventory-filters',
      defaultFilters: {
        searchQuery: '',
        selectedCategory: 'all',
        alertLevel: 'all',
        stockStatus: 'all',
      },
      syncWithUrl: true,
      debounceMs: 300,
    });

  // Pagination state
  const { page, pageSize, setPage, setPageSize } = usePageState({
    defaultPage: 1,
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
    resetOnFilterChange: true,
  });

  // Sort state
  const { column, direction, toggleSort } = useSortState<InventorySortColumn>({
    validColumns: ['name', 'category', 'quantity', 'reorderLevel'],
    defaultColumn: 'name',
    defaultDirection: 'asc',
    persistPreference: true,
    storageKey: 'inventory-sort-preference',
  });

  // =====================
  // DATA FETCHING
  // =====================
  const {
    inventoryItems,
    alerts,
    vendors,
    purchaseOrders,
    budgetCategories,
    categories,
    loading,
    refetchData,
  } = useInventoryData({
    activeTab,
    isRestored,
  });

  // Filter inventory items
  const { filteredItems } = useInventoryFilters({
    items: inventoryItems,
    filters,
  });

  // =====================
  // HELPER FUNCTIONS
  // =====================
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'RECEIVED':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // =====================
  // LOADING STATE
  // =====================
  const isLoadingState = loading || !isRestored;

  // =====================
  // RENDER
  // =====================
  return (
    <div className="space-y-6">
      {/* Header */}
      <InventoryHeader onAddItem={() => setShowAddModal(true)} />

      {/* Statistics Cards */}
      <InventoryStatistics
        inventoryItems={inventoryItems}
        alerts={alerts}
        vendors={vendors}
        purchaseOrders={purchaseOrders}
      />

      {/* Alerts Section */}
      <InventoryAlerts alerts={alerts} />

      {/* Tabs Navigation */}
      <InventoryTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content Area */}
      <div className="card p-6">
        {isLoadingState ? (
          <InventoryLoadingState />
        ) : (
          <>
            {activeTab === 'items' && (
              <InventoryItemsTab
                items={inventoryItems}
                categories={categories}
                searchQuery={filters.searchQuery}
                selectedCategory={filters.selectedCategory}
                onSearchChange={(value) => updateFilter('searchQuery', value)}
                onCategoryChange={(value) => updateFilter('selectedCategory', value)}
              />
            )}

            {activeTab === 'vendors' && <InventoryVendorsTab vendors={vendors} />}

            {activeTab === 'orders' && (
              <InventoryOrdersTab
                orders={purchaseOrders}
                getStatusBadgeColor={getStatusBadgeColor}
              />
            )}

            {activeTab === 'budget' && <InventoryBudgetTab categories={budgetCategories} />}

            {activeTab === 'analytics' && <InventoryAnalyticsTab />}
          </>
        )}
      </div>
    </div>
  );
}


