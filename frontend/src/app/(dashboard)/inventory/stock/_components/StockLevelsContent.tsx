'use client';

/**
 * StockLevelsContent Component
 *
 * Dashboard overview of current stock levels across all inventory items.
 * Provides visual indicators and analytics for inventory health.
 *
 * @module StockLevelsContent
 */

import React, { useState, useEffect } from 'react';

export interface StockLevelItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  reorderPoint: number;
  unitOfMeasure: string;
  location: string;
  stockPercentage: number;
  status: 'optimal' | 'reorder' | 'low' | 'out';
}

export interface CategorySummary {
  category: string;
  totalItems: number;
  optimalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalValue: number;
}

/**
 * Stock levels overview component
 *
 * @returns Rendered stock levels dashboard
 */
export default function StockLevelsContent() {
  const [items, setItems] = useState<StockLevelItem[]>([]);
  const [categorySummaries, setCategorySummaries] = useState<CategorySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  /**
   * Load stock level data
   */
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock data
        const mockItems: StockLevelItem[] = [
          {
            id: '1',
            name: 'Acetaminophen 500mg',
            sku: 'MED-001',
            category: 'Pain Relief',
            currentStock: 100,
            minStockLevel: 20,
            maxStockLevel: 200,
            reorderPoint: 40,
            unitOfMeasure: 'tablet',
            location: 'Cabinet A, Shelf 2',
            stockPercentage: 50,
            status: 'optimal',
          },
          {
            id: '2',
            name: 'Bandages (Adhesive)',
            sku: 'SUP-101',
            category: 'First Aid',
            currentStock: 15,
            minStockLevel: 25,
            maxStockLevel: 100,
            reorderPoint: 30,
            unitOfMeasure: 'box',
            location: 'Cabinet B, Shelf 1',
            stockPercentage: 15,
            status: 'low',
          },
          {
            id: '3',
            name: 'Digital Thermometer',
            sku: 'EQP-201',
            category: 'Diagnostic Equipment',
            currentStock: 5,
            minStockLevel: 3,
            maxStockLevel: 10,
            reorderPoint: 4,
            unitOfMeasure: 'unit',
            location: 'Equipment Cabinet',
            stockPercentage: 50,
            status: 'optimal',
          },
          {
            id: '4',
            name: 'Ibuprofen 200mg',
            sku: 'MED-002',
            category: 'Pain Relief',
            currentStock: 0,
            minStockLevel: 20,
            maxStockLevel: 200,
            reorderPoint: 40,
            unitOfMeasure: 'tablet',
            location: 'Cabinet A, Shelf 3',
            stockPercentage: 0,
            status: 'out',
          },
          {
            id: '5',
            name: 'Alcohol Swabs',
            sku: 'SUP-102',
            category: 'First Aid',
            currentStock: 200,
            minStockLevel: 50,
            maxStockLevel: 300,
            reorderPoint: 75,
            unitOfMeasure: 'piece',
            location: 'Cabinet B, Shelf 2',
            stockPercentage: 67,
            status: 'optimal',
          },
        ];

        setItems(mockItems);

        // Calculate category summaries
        const categories = Array.from(new Set(mockItems.map(item => item.category)));
        const summaries = categories.map(category => {
          const categoryItems = mockItems.filter(item => item.category === category);
          return {
            category,
            totalItems: categoryItems.length,
            optimalItems: categoryItems.filter(item => item.status === 'optimal').length,
            lowStockItems: categoryItems.filter(item => item.status === 'low' || item.status === 'reorder').length,
            outOfStockItems: categoryItems.filter(item => item.status === 'out').length,
            totalValue: categoryItems.length * 100, // Mock value
          };
        });

        setCategorySummaries(summaries);
      } catch (error) {
        console.error('Error loading stock levels:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  /**
   * Get filtered items
   */
  const filteredItems = items.filter(item => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    if (selectedStatus !== 'all' && item.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  /**
   * Gets status badge styling
   */
  const getStatusBadge = (status: string) => {
    const badges = {
      optimal: 'bg-green-100 text-green-800',
      reorder: 'bg-yellow-100 text-yellow-800',
      low: 'bg-orange-100 text-orange-800',
      out: 'bg-red-100 text-red-800',
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  /**
   * Gets status label
   */
  const getStatusLabel = (status: string) => {
    const labels = {
      optimal: 'Optimal',
      reorder: 'Reorder',
      low: 'Low Stock',
      out: 'Out of Stock',
    };
    return labels[status as keyof typeof labels] || 'Unknown';
  };

  /**
   * Calculate overall statistics
   */
  const stats = {
    totalItems: items.length,
    optimalItems: items.filter(i => i.status === 'optimal').length,
    lowStockItems: items.filter(i => i.status === 'low' || i.status === 'reorder').length,
    outOfStockItems: items.filter(i => i.status === 'out').length,
    averageStockLevel: items.length > 0
      ? Math.round(items.reduce((sum, i) => sum + i.stockPercentage, 0) / items.length)
      : 0,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stock levels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Stock Levels Overview</h1>
        <p className="text-gray-600 mt-2">
          Monitor current inventory levels across all categories
        </p>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Total Items</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalItems}</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700 mb-1">Optimal</p>
          <p className="text-3xl font-bold text-green-900">{stats.optimalItems}</p>
          <p className="text-xs text-green-600 mt-1">
            {Math.round((stats.optimalItems / stats.totalItems) * 100)}%
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-700 mb-1">Low/Reorder</p>
          <p className="text-3xl font-bold text-yellow-900">{stats.lowStockItems}</p>
          <p className="text-xs text-yellow-600 mt-1">
            {Math.round((stats.lowStockItems / stats.totalItems) * 100)}%
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700 mb-1">Out of Stock</p>
          <p className="text-3xl font-bold text-red-900">{stats.outOfStockItems}</p>
          <p className="text-xs text-red-600 mt-1">
            {Math.round((stats.outOfStockItems / stats.totalItems) * 100)}%
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700 mb-1">Avg Stock Level</p>
          <p className="text-3xl font-bold text-blue-900">{stats.averageStockLevel}%</p>
        </div>
      </div>

      {/* Category Summaries */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Stock by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categorySummaries.map(summary => (
            <div key={summary.category} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">{summary.category}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Items:</span>
                  <span className="font-medium">{summary.totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Optimal:</span>
                  <span className="font-medium text-green-600">{summary.optimalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Low Stock:</span>
                  <span className="font-medium text-orange-600">{summary.lowStockItems}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Out of Stock:</span>
                  <span className="font-medium text-red-600">{summary.outOfStockItems}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categorySummaries.map(cat => (
                <option key={cat.category} value={cat.category}>{cat.category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="optimal">Optimal</option>
              <option value="reorder">Reorder</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Min / Max
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Stock Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500 font-mono">{item.sku}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.category}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-900">
                      {item.currentStock} <span className="font-normal text-gray-600">{item.unitOfMeasure}</span>
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.minStockLevel} / {item.maxStockLevel}
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-full">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>{item.stockPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            item.status === 'optimal'
                              ? 'bg-green-600'
                              : item.status === 'reorder'
                              ? 'bg-yellow-600'
                              : item.status === 'low'
                              ? 'bg-orange-600'
                              : 'bg-red-600'
                          }`}
                          style={{ width: `${item.stockPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
                      {getStatusLabel(item.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <button
                      onClick={() => window.location.href = `/inventory/${item.id}`}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No items match the selected filters
        </div>
      )}
    </div>
  );
}

// Export both named and default for flexibility
export { StockLevelsContent }
