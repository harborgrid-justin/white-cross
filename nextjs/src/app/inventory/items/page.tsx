/**
 * Inventory Items Page - Manage all inventory items
 *
 * @module app/inventory/items/page
 * @since 2025-10-26
 */

'use client'

import { useState, useEffect } from 'react'
import { Package, Plus, Search, Download } from 'lucide-react'
import { exportData } from '@/lib/admin-utils'
import toast from 'react-hot-toast'

interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  quantity: number
  reorderLevel: number
  unitCost: number
  location: string
  status: 'active' | 'inactive'
}

export default function InventoryItemsPage() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        const response = await fetch('/api/inventory/items', {
          headers: { 'Authorization': `Bearer ${token}` },
        })
        const data = await response.json()
        setItems(data.items || [])
      } catch (error) {
        console.error('Error fetching items:', error)
        toast.error('Failed to load inventory items')
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
  }, [categoryFilter])

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Inventory Items</h2>
          <p className="text-sm text-gray-600 mt-1">{filteredItems.length} items</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportData(filteredItems, { format: 'csv', filename: 'inventory-items' })}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
            <Plus className="h-4 w-4" />
            Add Item
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Categories</option>
            <option value="medical">Medical Supplies</option>
            <option value="first-aid">First Aid</option>
            <option value="medications">Medications</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500">SKU: {item.sku}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.category}</td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${
                      item.quantity <= item.reorderLevel ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {item.quantity} units
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">${item.unitCost.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.location}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
