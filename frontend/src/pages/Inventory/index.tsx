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
import InventoryItemsTab from '../../components/inventory/tabs/InventoryItemsTab';
import InventoryVendorsTab from '../../components/inventory/tabs/InventoryVendorsTab';
import InventoryOrdersTab from '../../components/inventory/tabs/InventoryOrdersTab';
import InventoryBudgetTab from '../../components/inventory/tabs/InventoryBudgetTab';
import InventoryAnalyticsTab from '../../components/inventory/tabs/InventoryAnalyticsTab';
import type { InventoryTab, InventorySortColumn, InventoryFilters } from './types';

/**
 * Main Inventory Page Component
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
