'use client';

/**
 * InventoryItemsContent Component
 *
 * Main inventory items list/table view with search, filtering, and sorting.
 * Displays all inventory items with stock status and quick actions.
 *
 * @module InventoryItemsContent
 */

import React, { useState, useEffect } from 'react';
import EmptyState from '@/components/ui/feedback/EmptyState';

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  type: 'medication' | 'supply' | 'equipment';
  currentStock: number;
  minStockLevel: number;
  reorderPoint: number;
  unitOfMeasure: string;
  location: string;
  expirationDate?: string;
  isControlledSubstance: boolean;
}

/**
 * Inventory items list component with search and filtering
 *
 * @returns Rendered inventory items table
 */
export function InventoryItemsContent() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'sku'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  /**
   * Load inventory items
   */
  useEffect(() => {
    const loadItems = async () => {
      setIsLoading(true);

      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock data
        const mockItems: InventoryItem[] = [
          {
            id: '1',
            name: 'Acetaminophen 500mg',
            sku: 'MED-001',
            category: 'Pain Relief',
            type: 'medication',
            currentStock: 100,
            minStockLevel: 20,
            reorderPoint: 40,
            unitOfMeasure: 'tablet',
            location: 'Cabinet A, Shelf 2',
            expirationDate: '2025-12-31',
            isControlledSubstance: false,
          },
          {
            id: '2',
            name: 'Bandages (Adhesive)',
            sku: 'SUP-101',
            category: 'First Aid',
            type: 'supply',
            currentStock: 15,
            minStockLevel: 25,
            reorderPoint: 30,
            unitOfMeasure: 'box',
            location: 'Cabinet B, Shelf 1',
            isControlledSubstance: false,
          },
          {
            id: '3',
            name: 'Digital Thermometer',
            sku: 'EQP-201',
            category: 'Diagnostic Equipment',
            type: 'equipment',
            currentStock: 5,
            minStockLevel: 3,
            reorderPoint: 4,
            unitOfMeasure: 'unit',
            location: 'Equipment Cabinet',
            isControlledSubstance: false,
          },
          {
            id: '4',
            name: 'Ibuprofen 200mg',
            sku: 'MED-002',
            category: 'Pain Relief',
            type: 'medication',
            currentStock: 0,
            minStockLevel: 20,
            reorderPoint: 40,
            unitOfMeasure: 'tablet',
            location: 'Cabinet A, Shelf 3',
            expirationDate: '2025-06-30',
            isControlledSubstance: false,
          },
          {
            id: '5',
            name: 'Alcohol Swabs',
            sku: 'SUP-102',
            category: 'First Aid',
            type: 'supply',
            currentStock: 200,
            minStockLevel: 50,
            reorderPoint: 75,
            unitOfMeasure: 'piece',
            location: 'Cabinet B, Shelf 2',
            isControlledSubstance: false,
          },
        ];

        setItems(mockItems);
        setFilteredItems(mockItems);
      } catch (error) {
        console.error('Error loading inventory items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadItems();
  }, []);

  /**
   * Filter and sort items when filters change
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
          item.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.type === selectedType);
    }

    // Stock status filter
    if (stockFilter === 'low') {
      filtered = filtered.filter(item => item.currentStock <= item.minStockLevel);
    } else if (stockFilter === 'reorder') {
      filtered = filtered.filter(item => item.currentStock <= item.reorderPoint);
    } else if (stockFilter === 'out') {
      filtered = filtered.filter(item => item.currentStock === 0);
    }

    // Sort
    filtered.sort((a, b) => {
      let compareValue = 0;

      if (sortBy === 'name') {
        compareValue = a.name.localeCompare(b.name);
      } else if (sortBy === 'sku') {
        compareValue = a.sku.localeCompare(b.sku);
      } else if (sortBy === 'stock') {
        compareValue = a.currentStock - b.currentStock;
      }

      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    setFilteredItems(filtered);
  }, [items, searchQuery, selectedCategory, selectedType, stockFilter, sortBy, sortOrder]);

  /**
   * Gets stock status with color coding
   */
  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock === 0) {
      return { label: 'Out of Stock', color: 'red' };
    } else if (item.currentStock <= item.minStockLevel) {
      return { label: 'Low Stock', color: 'orange' };
    } else if (item.currentStock <= item.reorderPoint) {
      return { label: 'Reorder', color: 'yellow' };
    } else {
      return { label: 'In Stock', color: 'green' };
    }
  };

  /**
   * Get unique categories
   */
  const categories = Array.from(new Set(items.map(item => item.category))).sort();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inventory items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Items</h1>
          <p className="text-gray-600 mt-1">Manage all inventory items and stock levels</p>
        </div>
        <button
          onClick={() => window.location.href = '/inventory/new'}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add New Item
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Total Items</p>
          <p className="text-2xl font-bold text-gray-900">{items.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Low Stock</p>
          <p className="text-2xl font-bold text-orange-600">
            {items.filter(item => item.currentStock <= item.minStockLevel).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Needs Reorder</p>
          <p className="text-2xl font-bold text-yellow-600">
            {items.filter(item => item.currentStock <= item.reorderPoint && item.currentStock > item.minStockLevel).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Out of Stock</p>
          <p className="text-2xl font-bold text-red-600">
            {items.filter(item => item.currentStock === 0).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Search by name, SKU, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="medication">Medications</option>
              <option value="supply">Supplies</option>
              <option value="equipment">Equipment</option>
            </select>
          </div>

          {/* Stock Filter */}
          <div>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Stock Levels</option>
              <option value="out">Out of Stock</option>
              <option value="low">Low Stock</option>
              <option value="reorder">Needs Reorder</option>
            </select>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex gap-4 mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'stock' | 'sku')}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Name</option>
              <option value="sku">SKU</option>
              <option value="stock">Stock Level</option>
            </select>
          </div>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors"
          >
            {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
          </button>
          <div className="ml-auto text-sm text-gray-600">
            Showing {filteredItems.length} of {items.length} items
          </div>
        </div>
      </div>

      {/* Items Table */}
      {filteredItems.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No items found"
          description={searchQuery || selectedCategory !== 'all' || selectedType !== 'all' || stockFilter !== 'all'
            ? "Try adjusting your filters to find what you're looking for"
            : "Get started by adding your first inventory item"}
          action={searchQuery || selectedCategory !== 'all' || selectedType !== 'all' || stockFilter !== 'all'
            ? {
                label: "Clear Filters",
                onClick: () => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedType('all');
                  setStockFilter('all');
                }
              }
            : {
                label: "Add Item",
                onClick: () => window.location.href = '/inventory/new'
              }
          }
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Current Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredItems.map((item) => {
                  const status = getStockStatus(item);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          {item.isControlledSubstance && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded">
                              Controlled
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                        {item.sku}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.category}
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize text-sm text-gray-900">{item.type}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <span className="font-medium">{item.currentStock}</span> {item.unitOfMeasure}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium bg-${status.color}-100 text-${status.color}-800`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.location}
                      </td>
                      <td className="px-6 py-4 text-right text-sm space-x-2">
                        <button
                          onClick={() => window.location.href = `/inventory/${item.id}`}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          View
                        </button>
                        <button
                          onClick={() => window.location.href = `/inventory/${item.id}/edit`}
                          className="text-gray-600 hover:text-gray-700"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
