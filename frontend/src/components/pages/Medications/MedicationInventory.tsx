'use client';

import React, { useState } from 'react';

/**
 * Interface for medication inventory item
 */
interface MedicationInventoryItem {
  id: string;
  medicationId: string;
  medicationName: string;
  strength: string;
  form: string;
  lotNumber: string;
  expirationDate: string;
  quantity: number;
  minThreshold: number;
  maxThreshold: number;
  cost: number;
  supplier: string;
  location: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'expired' | 'recalled';
  lastRestocked: string;
  notes?: string;
}

/**
 * Interface for inventory filters
 */
interface InventoryFilters {
  status: string;
  location: string;
  expirationRange: string;
  searchTerm: string;
}

/**
 * Props for the MedicationInventory component
 */
interface MedicationInventoryProps {
  /** Array of inventory items to display */
  inventoryItems?: MedicationInventoryItem[];
  /** Whether the component is in loading state */
  loading?: boolean;
  /** Error message to display */
  error?: string;
  /** Callback when inventory item is updated */
  onUpdateInventory?: (itemId: string, updates: Partial<MedicationInventoryItem>) => void;
  /** Callback when new stock is added */
  onRestockItem?: (itemId: string, quantity: number, lotNumber: string, expirationDate: string) => void;
  /** Callback when item is removed from inventory */
  onRemoveItem?: (itemId: string) => void;
  /** Callback when inventory report is generated */
  onGenerateReport?: (filters: InventoryFilters) => void;
}

/**
 * MedicationInventory component for managing medication stock levels and inventory tracking
 * 
 * Features:
 * - Real-time inventory tracking with stock levels
 * - Expiration date monitoring and alerts
 * - Low stock warnings and notifications
 * - Batch/lot number tracking for safety
 * - Multi-location inventory management
 * - Cost tracking and supplier information
 * - Restock management and history
 * - Inventory reporting and analytics
 * 
 * @param props - The component props
 * @returns JSX element representing the medication inventory interface
 */
export function MedicationInventory({
  inventoryItems = [],
  loading = false,
  error,
  onUpdateInventory,
  onRestockItem,
  onRemoveItem,
  onGenerateReport
}: MedicationInventoryProps) {
  const [filters, setFilters] = useState<InventoryFilters>({
    status: 'all',
    location: 'all',
    expirationRange: 'all',
    searchTerm: ''
  });
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showRestockModal, setShowRestockModal] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'quantity' | 'expiration' | 'status'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  /**
   * Get status badge styling
   */
  const getStatusBadge = (status: MedicationInventoryItem['status']) => {
    const badges = {
      'in-stock': 'bg-green-100 text-green-800 border-green-200',
      'low-stock': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'out-of-stock': 'bg-red-100 text-red-800 border-red-200',
      'expired': 'bg-gray-100 text-gray-800 border-gray-200',
      'recalled': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return badges[status] || badges['in-stock'];
  };

  /**
   * Get days until expiration
   */
  const getDaysUntilExpiration = (expirationDate: string): number => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = expDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  /**
   * Filter and sort inventory items
   */
  const filteredAndSortedItems = React.useMemo(() => {
    const filtered = inventoryItems.filter(item => {
      const matchesSearch = item.medicationName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                           item.lotNumber.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const matchesStatus = filters.status === 'all' || item.status === filters.status;
      const matchesLocation = filters.location === 'all' || item.location === filters.location;
      
      let matchesExpiration = true;
      if (filters.expirationRange !== 'all') {
        const daysUntilExp = getDaysUntilExpiration(item.expirationDate);
        switch (filters.expirationRange) {
          case 'expired':
            matchesExpiration = daysUntilExp < 0;
            break;
          case '30-days':
            matchesExpiration = daysUntilExp >= 0 && daysUntilExp <= 30;
            break;
          case '90-days':
            matchesExpiration = daysUntilExp >= 0 && daysUntilExp <= 90;
            break;
          case 'future':
            matchesExpiration = daysUntilExp > 90;
            break;
        }
      }

      return matchesSearch && matchesStatus && matchesLocation && matchesExpiration;
    });

    // Sort items
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'name':
          aValue = a.medicationName;
          bValue = b.medicationName;
          break;
        case 'quantity':
          aValue = a.quantity;
          bValue = b.quantity;
          break;
        case 'expiration':
          aValue = new Date(a.expirationDate).getTime();
          bValue = new Date(b.expirationDate).getTime();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = a.medicationName;
          bValue = b.medicationName;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [inventoryItems, filters, sortBy, sortOrder]);

  /**
   * Get inventory statistics
   */
  const inventoryStats = React.useMemo(() => {
    const total = inventoryItems.length;
    const inStock = inventoryItems.filter(item => item.status === 'in-stock').length;
    const lowStock = inventoryItems.filter(item => item.status === 'low-stock').length;
    const outOfStock = inventoryItems.filter(item => item.status === 'out-of-stock').length;
    const expired = inventoryItems.filter(item => item.status === 'expired').length;
    const totalValue = inventoryItems.reduce((sum, item) => sum + (item.quantity * item.cost), 0);

    return { total, inStock, lowStock, outOfStock, expired, totalValue };
  }, [inventoryItems]);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Loading Inventory</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Medication Inventory</h2>
          <p className="mt-1 text-sm text-gray-500">Manage medication stock levels and inventory tracking</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={() => onGenerateReport?.(filters)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Items</p>
              <p className="text-2xl font-semibold text-gray-900">{inventoryStats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">In Stock</p>
              <p className="text-2xl font-semibold text-gray-900">{inventoryStats.inStock}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Low Stock</p>
              <p className="text-2xl font-semibold text-gray-900">{inventoryStats.lowStock}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Out of Stock</p>
              <p className="text-2xl font-semibold text-gray-900">{inventoryStats.outOfStock}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Value</p>
              <p className="text-2xl font-semibold text-gray-900">${inventoryStats.totalValue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search-inventory" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              id="search-inventory"
              type="text"
              placeholder="Search by medication name or lot number..."
              value={filters.searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setFilters(prev => ({ ...prev, searchTerm: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Search inventory by medication name or lot number"
            />
          </div>

          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status-filter"
              value={filters.status}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                setFilters(prev => ({ ...prev, status: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by inventory status"
            >
              <option value="all">All Status</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
              <option value="expired">Expired</option>
              <option value="recalled">Recalled</option>
            </select>
          </div>

          <div>
            <label htmlFor="location-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <select
              id="location-filter"
              value={filters.location}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                setFilters(prev => ({ ...prev, location: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by inventory location"
            >
              <option value="all">All Locations</option>
              <option value="main-pharmacy">Main Pharmacy</option>
              <option value="nurses-station">Nurse&apos;s Station</option>
              <option value="emergency-kit">Emergency Kit</option>
              <option value="refrigerated">Refrigerated Storage</option>
              <option value="controlled-substances">Controlled Substances</option>
            </select>
          </div>

          <div>
            <label htmlFor="expiration-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Expiration
            </label>
            <select
              id="expiration-filter"
              value={filters.expirationRange}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                setFilters(prev => ({ ...prev, expirationRange: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by expiration date range"
            >
              <option value="all">All Items</option>
              <option value="expired">Expired</option>
              <option value="30-days">Expires in 30 days</option>
              <option value="90-days">Expires in 90 days</option>
              <option value="future">Future expiration</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Inventory Items ({filteredAndSortedItems.length})
            </h3>
            <div className="flex items-center space-x-2">
              <label htmlFor="sort-by" className="text-sm text-gray-500">Sort by:</label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                  setSortBy(e.target.value as typeof sortBy)
                }
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Sort inventory items by"
              >
                <option value="name">Name</option>
                <option value="quantity">Quantity</option>
                <option value="expiration">Expiration</option>
                <option value="status">Status</option>
              </select>
              <button
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="p-1 text-gray-400 hover:text-gray-600"
                aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
              >
                <svg className={`w-4 h-4 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {filteredAndSortedItems.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No inventory items found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filters.searchTerm || filters.status !== 'all' || filters.location !== 'all' || filters.expirationRange !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : 'Get started by adding medication inventory items.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medication
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedItems.map((item) => {
                  const daysUntilExpiration = getDaysUntilExpiration(item.expirationDate);
                  const isExpiringSoon = daysUntilExpiration <= 30 && daysUntilExpiration >= 0;
                  const isExpired = daysUntilExpiration < 0;

                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.medicationName}</div>
                          <div className="text-sm text-gray-500">{item.strength} - {item.form}</div>
                          <div className="text-xs text-gray-400">Lot: {item.lotNumber}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(item.status)}`}>
                          {item.status.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.quantity}</div>
                        <div className="text-xs text-gray-500">
                          Min: {item.minThreshold} | Max: {item.maxThreshold}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${isExpired ? 'text-red-600 font-medium' : isExpiringSoon ? 'text-yellow-600' : 'text-gray-900'}`}>
                          {new Date(item.expirationDate).toLocaleDateString()}
                        </div>
                        <div className={`text-xs ${isExpired ? 'text-red-500' : isExpiringSoon ? 'text-yellow-500' : 'text-gray-500'}`}>
                          {isExpired ? `Expired ${Math.abs(daysUntilExpiration)} days ago` : `${daysUntilExpiration} days remaining`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.location.replace('-', ' ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${(item.quantity * item.cost).toLocaleString()}</div>
                        <div className="text-xs text-gray-500">${item.cost}/unit</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setShowRestockModal(item.id)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          aria-label={`Restock ${item.medicationName}`}
                        >
                          Restock
                        </button>
                        <button
                          onClick={() => onRemoveItem?.(item.id)}
                          className="text-red-600 hover:text-red-900"
                          aria-label={`Remove ${item.medicationName} from inventory`}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Restock Modal */}
      {showRestockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Restock Item</h3>
            {/* Restock form would go here */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRestockModal(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle restock
                  setShowRestockModal(null);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Restock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationInventory;
