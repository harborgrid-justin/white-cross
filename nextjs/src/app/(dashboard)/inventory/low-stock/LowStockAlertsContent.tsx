'use client';

/**
 * LowStockAlertsContent Component
 *
 * Dashboard view showing inventory items that are below minimum stock levels
 * or have reached their reorder point, requiring attention.
 *
 * @module LowStockAlertsContent
 */

import React, { useState, useEffect } from 'react';
import EmptyState from '@/components/ui/feedback/EmptyState';

export interface LowStockItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  minStockLevel: number;
  reorderPoint: number;
  unitOfMeasure: string;
  location: string;
  alertLevel: 'critical' | 'warning' | 'reorder';
  daysUntilOutOfStock?: number;
  lastRestockDate?: string;
}

/**
 * Low stock alerts monitoring component
 *
 * @returns Rendered low stock alerts view
 */
export default function LowStockAlertsContent() {
  const [alerts, setAlerts] = useState<LowStockItem[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<LowStockItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAlertLevel, setSelectedAlertLevel] = useState<'all' | 'critical' | 'warning' | 'reorder'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Load low stock alerts
   */
  useEffect(() => {
    const loadAlerts = async () => {
      setIsLoading(true);

      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock data
        const mockAlerts: LowStockItem[] = [
          {
            id: '1',
            name: 'Ibuprofen 200mg',
            sku: 'MED-002',
            category: 'Pain Relief',
            currentStock: 0,
            minStockLevel: 20,
            reorderPoint: 40,
            unitOfMeasure: 'tablet',
            location: 'Cabinet A, Shelf 3',
            alertLevel: 'critical',
            daysUntilOutOfStock: 0,
            lastRestockDate: '2024-01-10',
          },
          {
            id: '2',
            name: 'Bandages (Adhesive)',
            sku: 'SUP-101',
            category: 'First Aid',
            currentStock: 15,
            minStockLevel: 25,
            reorderPoint: 30,
            unitOfMeasure: 'box',
            location: 'Cabinet B, Shelf 1',
            alertLevel: 'warning',
            daysUntilOutOfStock: 5,
            lastRestockDate: '2024-01-15',
          },
          {
            id: '3',
            name: 'Antibiotic Ointment',
            sku: 'MED-010',
            category: 'First Aid',
            currentStock: 8,
            minStockLevel: 10,
            reorderPoint: 15,
            unitOfMeasure: 'tube',
            location: 'Cabinet B, Shelf 3',
            alertLevel: 'warning',
            daysUntilOutOfStock: 7,
            lastRestockDate: '2024-01-12',
          },
          {
            id: '4',
            name: 'Acetaminophen 500mg',
            sku: 'MED-001',
            category: 'Pain Relief',
            currentStock: 35,
            minStockLevel: 20,
            reorderPoint: 40,
            unitOfMeasure: 'tablet',
            location: 'Cabinet A, Shelf 2',
            alertLevel: 'reorder',
            daysUntilOutOfStock: 14,
            lastRestockDate: '2024-01-08',
          },
        ];

        setAlerts(mockAlerts);
        setFilteredAlerts(mockAlerts);
      } catch (error) {
        console.error('Error loading low stock alerts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAlerts();
  }, []);

  /**
   * Filter alerts when filters change
   */
  useEffect(() => {
    let filtered = [...alerts];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        alert =>
          alert.name.toLowerCase().includes(query) ||
          alert.sku.toLowerCase().includes(query) ||
          alert.category.toLowerCase().includes(query)
      );
    }

    // Alert level filter
    if (selectedAlertLevel !== 'all') {
      filtered = filtered.filter(alert => alert.alertLevel === selectedAlertLevel);
    }

    // Sort by severity (critical first)
    filtered.sort((a, b) => {
      const severityOrder = { critical: 0, warning: 1, reorder: 2 };
      return severityOrder[a.alertLevel] - severityOrder[b.alertLevel];
    });

    setFilteredAlerts(filtered);
  }, [alerts, searchQuery, selectedAlertLevel]);

  /**
   * Gets alert badge styling
   */
  const getAlertBadge = (level: string) => {
    const badges = {
      critical: 'bg-red-100 text-red-800 border-red-300',
      warning: 'bg-orange-100 text-orange-800 border-orange-300',
      reorder: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    };
    return badges[level as keyof typeof badges] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  /**
   * Gets alert label
   */
  const getAlertLabel = (level: string) => {
    const labels = {
      critical: 'Out of Stock',
      warning: 'Low Stock',
      reorder: 'Reorder Soon',
    };
    return labels[level as keyof typeof labels] || 'Unknown';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stock alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Low Stock Alerts</h1>
        <p className="text-gray-600 mt-2">
          Monitor inventory items that need restocking
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 mb-1">Critical (Out of Stock)</p>
              <p className="text-3xl font-bold text-red-900">
                {alerts.filter(a => a.alertLevel === 'critical').length}
              </p>
            </div>
            <div className="text-4xl text-red-600">⛔</div>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-700 mb-1">Warning (Low Stock)</p>
              <p className="text-3xl font-bold text-orange-900">
                {alerts.filter(a => a.alertLevel === 'warning').length}
              </p>
            </div>
            <div className="text-4xl text-orange-600">⚠️</div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700 mb-1">Reorder Point</p>
              <p className="text-3xl font-bold text-yellow-900">
                {alerts.filter(a => a.alertLevel === 'reorder').length}
              </p>
            </div>
            <div className="text-4xl text-yellow-600">📊</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, SKU, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setSelectedAlertLevel('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedAlertLevel === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              All ({alerts.length})
            </button>
            <button
              onClick={() => setSelectedAlertLevel('critical')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedAlertLevel === 'critical'
                  ? 'bg-red-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Critical ({alerts.filter(a => a.alertLevel === 'critical').length})
            </button>
            <button
              onClick={() => setSelectedAlertLevel('warning')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedAlertLevel === 'warning'
                  ? 'bg-orange-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Warning ({alerts.filter(a => a.alertLevel === 'warning').length})
            </button>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      {filteredAlerts.length === 0 ? (
        <EmptyState
          icon="✅"
          title="No low stock alerts"
          description={searchQuery || selectedAlertLevel !== 'all'
            ? "No items match your current filters"
            : "All inventory items are adequately stocked"}
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
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white rounded-lg shadow-sm border-2 p-4 ${
                alert.alertLevel === 'critical'
                  ? 'border-red-300'
                  : alert.alertLevel === 'warning'
                  ? 'border-orange-300'
                  : 'border-yellow-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{alert.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getAlertBadge(alert.alertLevel)}`}>
                      {getAlertLabel(alert.alertLevel)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">SKU</p>
                      <p className="font-medium text-gray-900 font-mono">{alert.sku}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Category</p>
                      <p className="font-medium text-gray-900">{alert.category}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Current Stock</p>
                      <p className={`font-bold ${
                        alert.currentStock === 0
                          ? 'text-red-600'
                          : alert.currentStock <= alert.minStockLevel
                          ? 'text-orange-600'
                          : 'text-yellow-600'
                      }`}>
                        {alert.currentStock} {alert.unitOfMeasure}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Location</p>
                      <p className="font-medium text-gray-900">{alert.location}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-6 text-sm text-gray-600">
                    <span>Min Level: <strong>{alert.minStockLevel}</strong></span>
                    <span>Reorder Point: <strong>{alert.reorderPoint}</strong></span>
                    {alert.daysUntilOutOfStock !== undefined && alert.daysUntilOutOfStock > 0 && (
                      <span className="text-orange-600">
                        ⏰ Est. {alert.daysUntilOutOfStock} days until out of stock
                      </span>
                    )}
                    {alert.lastRestockDate && (
                      <span>Last restock: {new Date(alert.lastRestockDate).toLocaleDateString()}</span>
                    )}
                  </div>

                  {/* Stock Level Bar */}
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          alert.currentStock === 0
                            ? 'bg-red-600'
                            : alert.currentStock <= alert.minStockLevel
                            ? 'bg-orange-600'
                            : 'bg-yellow-600'
                        }`}
                        style={{ width: `${Math.min((alert.currentStock / alert.reorderPoint) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => window.location.href = `/inventory/transactions/receive?itemId=${alert.id}`}
                    className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm transition-colors whitespace-nowrap"
                  >
                    Receive Stock
                  </button>
                  <button
                    onClick={() => window.location.href = `/inventory/${alert.id}`}
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
