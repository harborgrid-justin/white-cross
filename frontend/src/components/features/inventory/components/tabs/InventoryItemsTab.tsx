'use client';

/**
 * WF-COMP-041 | InventoryItemsTab.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../../../types | Dependencies: react, lucide-react, ../../../types
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export | Key Features: component, arrow component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import React from 'react'
import { Search } from 'lucide-react'
import type { InventoryItem } from '@/types/inventory'

/**
 * Props for the InventoryItemsTab component
 *
 * @interface InventoryItemsTabProps
 * @property {InventoryItem[]} items - Array of inventory items to display
 * @property {string[]} categories - Array of available item categories for filtering
 * @property {string} searchQuery - Current search query string
 * @property {string} selectedCategory - Currently selected category filter ("all" for no filter)
 * @property {function} onSearchChange - Callback when search query changes
 * @property {function} onCategoryChange - Callback when category filter changes
 */
interface InventoryItemsTabProps {
  items: InventoryItem[]
  categories: string[]
  searchQuery: string
  selectedCategory: string
  onSearchChange: (query: string) => void
  onCategoryChange: (category: string) => void
}

/**
 * InventoryItemsTab - Inventory items list with search and filtering
 *
 * Displays a searchable, filterable table of all inventory items including stock
 * levels, reorder points, costs, locations, and status. Supports real-time search
 * by item name or category, and category-based filtering for efficient inventory management.
 *
 * @param {InventoryItemsTabProps} props - Component props
 * @returns {JSX.Element} Inventory items table with search and filter controls
 *
 * @example
 * ```tsx
 * <InventoryItemsTab
 *   items={inventoryItems}
 *   categories={['Medical Supplies', 'First Aid', 'Medications', 'Equipment']}
 *   searchQuery={searchQuery}
 *   selectedCategory={selectedCategory}
 *   onSearchChange={setSearchQuery}
 *   onCategoryChange={setSelectedCategory}
 * />
 * ```
 *
 * @remarks
 * - Search filters by item name and category (case-insensitive)
 * - Category filter supports "all" option to show all items
 * - Stock levels color-coded: red (below reorder level), green (adequate stock)
 * - Status badges show active/inactive items
 * - Table columns: Item, Category, Stock, Reorder Level, Unit Cost, Location, Status
 * - SKU displayed as secondary text under item name if available
 * - Hover effect on table rows for better interactivity
 * - Responsive table with horizontal scroll on smaller screens
 *
 * @security
 * - Item details visible to authorized inventory management staff only
 * - Cost information may be restricted based on user role
 * - Access controlled by role-based permissions
 *
 * @compliance
 * - Supports medical supply tracking for healthcare compliance
 * - Reorder level tracking helps maintain adequate stock of critical items
 * - Location tracking aids in inventory audits
 * - Status tracking prevents use of inactive/discontinued items
 */
export default function InventoryItemsTab({
  items,
  categories,
  searchQuery,
  selectedCategory,
  onSearchChange,
  onCategoryChange
}: InventoryItemsTabProps) {
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Items Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reorder Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Cost</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  {item.sku && <div className="text-xs text-gray-500">SKU: {item.sku}</div>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${
                    (item.currentStock || 0) <= item.reorderLevel ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {item.currentStock || 0}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.reorderLevel}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${item.unitCost?.toFixed(2) || '0.00'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.location || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {item.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

