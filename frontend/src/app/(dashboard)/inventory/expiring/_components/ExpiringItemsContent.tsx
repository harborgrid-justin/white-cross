'use client';

/**
 * ExpiringItemsContent Component
 *
 * Dashboard view showing inventory items approaching their expiration dates.
 * Critical for healthcare environments to prevent use of expired medications and supplies.
 *
 * @module ExpiringItemsContent
 */

import React, { useState, useEffect } from 'react';
import EmptyState from '@/components/ui/feedback/EmptyState';

export interface ExpiringItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  type: 'medication' | 'supply' | 'equipment';
  currentStock: number;
  unitOfMeasure: string;
  lotNumber: string;
  expirationDate: string;
  daysUntilExpiration: number;
  location: string;
  alertLevel: 'expired' | 'critical' | 'warning' | 'notice';
  estimatedValue: number;
}

/**
 * Expiring items monitoring component
 *
 * @returns Rendered expiring items view
 */
export default function ExpiringItemsContent() {
  const [items, setItems] = useState<ExpiringItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ExpiringItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAlertLevel, setSelectedAlertLevel] = useState<'all' | 'expired' | 'critical' | 'warning' | 'notice'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Load expiring items
   */
  useEffect(() => {
    const loadItems = async () => {
      setIsLoading(true);

      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock data
        const mockItems: ExpiringItem[] = [
          {
            id: '1',
            name: 'Antibiotic Cream',
            sku: 'MED-020',
            category: 'Medications',
            type: 'medication',
            currentStock: 5,
            unitOfMeasure: 'tube',
            lotNumber: 'LOT2024-001',
            expirationDate: '2024-01-25',
            daysUntilExpiration: -2,
            location: 'Cabinet B, Shelf 3',
            alertLevel: 'expired',
            estimatedValue: 15.0,
          },
          {
            id: '2',
            name: 'Eye Drops',
            sku: 'MED-025',
            category: 'Medications',
            type: 'medication',
            currentStock: 3,
            unitOfMeasure: 'bottle',
            lotNumber: 'LOT2024-002',
            expirationDate: '2024-01-28',
            daysUntilExpiration: 1,
            location: 'Refrigerator',
            alertLevel: 'critical',
            estimatedValue: 12.0,
          },
          {
            id: '3',
            name: 'Ibuprofen 200mg',
            sku: 'MED-002',
            category: 'Pain Relief',
            type: 'medication',
            currentStock: 50,
            unitOfMeasure: 'tablet',
            lotNumber: 'LOT2024-003',
            expirationDate: '2024-02-15',
            daysUntilExpiration: 19,
            location: 'Cabinet A, Shelf 3',
            alertLevel: 'warning',
            estimatedValue: 7.50,
          },
          {
            id: '4',
            name: 'Sterile Gauze Pads',
            sku: 'SUP-110',
            category: 'First Aid',
            type: 'supply',
            currentStock: 20,
            unitOfMeasure: 'box',
            lotNumber: 'LOT2024-004',
            expirationDate: '2024-03-30',
            daysUntilExpiration: 64,
            location: 'Cabinet B, Shelf 1',
            alertLevel: 'notice',
            estimatedValue: 40.0,
          },
        ];

        setItems(mockItems);
        setFilteredItems(mockItems);
      } catch (error) {
        console.error('Error loading expiring items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadItems();
  }, []);

  /**
   * Filter items when filters change
   */
  useEffect(() => {
    let filtered = [...items];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        item =>
          item.name.toLowerCase().includes(query) ||
          item.sku.toLowerCase().includes(query) ||
          item.lotNumber.toLowerCase().includes(query)
      );
    }

    // Alert level filter
    if (selectedAlertLevel !== 'all') {
      filtered = filtered.filter(item => item.alertLevel === selectedAlertLevel);
    }

    // Sort by days until expiration (soonest first)
    filtered.sort((a, b) => a.daysUntilExpiration - b.daysUntilExpiration);

    setFilteredItems(filtered);
  }, [items, searchQuery, selectedAlertLevel]);

  /**
   * Gets alert badge styling
   */
  const getAlertBadge = (level: string) => {
    const badges = {
      expired: 'bg-red-100 text-red-800 border-red-300',
      critical: 'bg-orange-100 text-orange-800 border-orange-300',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      notice: 'bg-blue-100 text-blue-800 border-blue-300',
    };
    return badges[level as keyof typeof badges] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  /**
   * Gets alert label
   */
  const getAlertLabel = (item: ExpiringItem) => {
    if (item.daysUntilExpiration < 0) {
      return `Expired ${Math.abs(item.daysUntilExpiration)} days ago`;
    } else if (item.daysUntilExpiration === 0) {
      return 'Expires today';
    } else if (item.daysUntilExpiration === 1) {
      return 'Expires tomorrow';
    } else if (item.daysUntilExpiration <= 7) {
      return `Expires in ${item.daysUntilExpiration} days`;
    } else if (item.daysUntilExpiration <= 30) {
      return `Expires in ${Math.ceil(item.daysUntilExpiration / 7)} weeks`;
    } else {
      return `Expires in ${Math.ceil(item.daysUntilExpiration / 30)} months`;
    }
  };

  /**
   * Calculate total value at risk
   */
  const totalValueAtRisk = items
    .filter(item => item.alertLevel === 'expired' || item.alertLevel === 'critical')
    .reduce((sum, item) => sum + item.estimatedValue, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading expiring items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Expiring Items</h1>
        <p className="text-gray-600 mt-2">
          Monitor items approaching expiration to prevent waste and ensure safety
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 mb-1">Expired</p>
              <p className="text-3xl font-bold text-red-900">
                {items.filter(i => i.alertLevel === 'expired').length}
              </p>
            </div>
            <div className="text-4xl text-red-600">🚫</div>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-700 mb-1">Critical (7 days)</p>
              <p className="text-3xl font-bold text-orange-900">
                {items.filter(i => i.alertLevel === 'critical').length}
              </p>
            </div>
            <div className="text-4xl text-orange-600">⏰</div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700 mb-1">Warning (30 days)</p>
              <p className="text-3xl font-bold text-yellow-900">
                {items.filter(i => i.alertLevel === 'warning').length}
              </p>
            </div>
            <div className="text-4xl text-yellow-600">⚠️</div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 mb-1">Value at Risk</p>
              <p className="text-2xl font-bold text-purple-900">
                ${totalValueAtRisk.toFixed(2)}
              </p>
            </div>
            <div className="text-4xl text-purple-600">💰</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, SKU, or lot number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedAlertLevel('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedAlertLevel === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              All ({items.length})
            </button>
            <button
              onClick={() => setSelectedAlertLevel('expired')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedAlertLevel === 'expired'
                  ? 'bg-red-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Expired ({items.filter(i => i.alertLevel === 'expired').length})
            </button>
            <button
              onClick={() => setSelectedAlertLevel('critical')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedAlertLevel === 'critical'
                  ? 'bg-orange-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Critical ({items.filter(i => i.alertLevel === 'critical').length})
            </button>
          </div>
        </div>
      </div>

      {/* Items List */}
      {filteredItems.length === 0 ? (
        <EmptyState
          icon="✅"
          title="No expiring items"
          description={searchQuery || selectedAlertLevel !== 'all'
            ? "No items match your current filters"
            : "No items are approaching expiration"}
          action={searchQuery || selectedAlertLevel !== 'all'
            ? {
                label: "Clear Filters",
                onClick: () => {
                  setSearchQuery('');
                  setSelectedAlertLevel('all');
                }
              }
            : undefined
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-lg shadow-sm border-2 p-4 ${
                item.alertLevel === 'expired'
                  ? 'border-red-300'
                  : item.alertLevel === 'critical'
                  ? 'border-orange-300'
                  : item.alertLevel === 'warning'
                  ? 'border-yellow-300'
                  : 'border-blue-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getAlertBadge(item.alertLevel)}`}>
                      {getAlertLabel(item)}
                    </span>
                    {item.type === 'medication' && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                        Medication
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-gray-600">SKU</p>
                      <p className="font-medium text-gray-900 font-mono">{item.sku}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Lot Number</p>
                      <p className="font-medium text-gray-900 font-mono">{item.lotNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Expiration Date</p>
                      <p className={`font-bold ${
                        item.alertLevel === 'expired'
                          ? 'text-red-600'
                          : item.alertLevel === 'critical'
                          ? 'text-orange-600'
                          : 'text-gray-900'
                      }`}>
                        {new Date(item.expirationDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Current Stock</p>
                      <p className="font-medium text-gray-900">
                        {item.currentStock} {item.unitOfMeasure}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Est. Value</p>
                      <p className="font-medium text-gray-900">${item.estimatedValue.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>📍 {item.location}</span>
                    <span>📦 {item.category}</span>
                  </div>

                  {item.alertLevel === 'expired' && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-800 font-medium">
                        ⚠️ This item has expired and should not be used. Remove from inventory immediately.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  {item.alertLevel === 'expired' ? (
                    <button
                      onClick={() => window.location.href = `/inventory/transactions/adjustment?itemId=${item.id}&reason=expired`}
                      className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm transition-colors whitespace-nowrap"
                    >
                      Remove Expired
                    </button>
                  ) : (
                    <button
                      onClick={() => window.location.href = `/inventory/transactions/issue?itemId=${item.id}`}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm transition-colors whitespace-nowrap"
                    >
                      Issue/Use
                    </button>
                  )}
                  <button
                    onClick={() => window.location.href = `/inventory/${item.id}`}
                    className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Export both named and default for flexibility
export { ExpiringItemsContent }
