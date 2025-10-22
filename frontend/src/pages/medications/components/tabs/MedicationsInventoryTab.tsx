/**
 * WF-COMP-055 | MedicationsInventoryTab.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../../../hooks/useInventoryManagement, ../../../utils/medications | Dependencies: lucide-react, ../../../hooks/useInventoryManagement, ../../../utils/medications
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export | Key Features: useState, component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import React, { useState } from 'react'
import { AlertTriangle, Package, Edit3 } from 'lucide-react'
import { useInventoryManagement } from '../../../../../hooks/domains/inventory'
import { getDaysUntilExpiration } from '../../../../../utils/medications'

interface InventoryItem {
  id: string
  medication: {
    name: string
    strength: string
  }
  batchNumber: string
  quantity: number
  reorderLevel: number
  expirationDate: string
  supplier?: string
  alerts?: {
    expired?: boolean
    nearExpiry?: boolean
    lowStock?: boolean
  }
}

interface InventoryData {
  inventory?: InventoryItem[]
  alerts?: {
    expired?: InventoryItem[]
    nearExpiry?: InventoryItem[]
    lowStock?: InventoryItem[]
  }
}

interface MedicationsInventoryTabProps {
  data: InventoryData | undefined
  loading: boolean
}

export default function MedicationsInventoryTab({ data, loading }: MedicationsInventoryTabProps) {
  const [showStockUpdateModal, setShowStockUpdateModal] = useState(false)
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<InventoryItem | null>(null)
  const [stockUpdateForm, setStockUpdateForm] = useState({
    quantity: '',
    batchNumber: '',
    expirationDate: '',
    supplier: ''
  })

  const { updateInventory, isUpdating } = useInventoryManagement()

  const handleStockUpdate = (item: InventoryItem) => {
    setSelectedInventoryItem(item)
    setStockUpdateForm({
      quantity: item.quantity.toString(),
      batchNumber: item.batchNumber,
      expirationDate: item.expirationDate.split('T')[0], // Format for date input
      supplier: item.supplier || ''
    })
    setShowStockUpdateModal(true)
  }

  const handleSaveStockUpdate = async () => {
    if (!selectedInventoryItem) return

    try {
      await updateInventory({
        inventoryId: selectedInventoryItem.id,
        quantity: parseInt(stockUpdateForm.quantity, 10),
        batchNumber: stockUpdateForm.batchNumber,
        expirationDate: stockUpdateForm.expirationDate,
        supplier: stockUpdateForm.supplier,
      })

      setShowStockUpdateModal(false)
      setSelectedInventoryItem(null)
    } catch (error) {
      // Error is handled by the hook with toast notification
      console.error('Failed to update inventory:', error)
    }
  }

  const handleCloseModal = () => {
    setShowStockUpdateModal(false)
    setSelectedInventoryItem(null)
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div data-testid="loading-spinner" className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p data-testid="loading-text" className="mt-4 text-gray-600">Loading inventory...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Alerts */}
      {(data?.alerts?.expired && data.alerts.expired.length > 0) ||
       (data?.alerts?.nearExpiry && data.alerts.nearExpiry.length > 0) ||
       (data?.alerts?.lowStock && data.alerts.lowStock.length > 0) ? (
        <div data-testid="inventory-alerts" className="space-y-3">
          {data?.alerts?.expired && data.alerts.expired.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
                <div>
                  <h3 className="text-sm font-semibold text-red-900">Expired Medications</h3>
                  <p className="text-sm text-red-700 mt-1">
                    {data.alerts.expired.length} medication(s) have expired and should be disposed of
                  </p>
                </div>
              </div>
            </div>
          )}

          {data?.alerts?.nearExpiry && data.alerts.nearExpiry.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
                <div>
                  <h3 className="text-sm font-semibold text-yellow-900">Near Expiry</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    {data.alerts.nearExpiry.length} medication(s) expiring within 30 days
                  </p>
                </div>
              </div>
            </div>
          )}

          {data?.alerts?.lowStock && data.alerts.lowStock.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start">
                <Package className="h-5 w-5 text-orange-600 mt-0.5 mr-3" />
                <div>
                  <h3 className="text-sm font-semibold text-orange-900">Low Stock</h3>
                  <p className="text-sm text-orange-700 mt-1">
                    {data.alerts.lowStock.length} medication(s) below reorder level
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Inventory Table */}
      <div className="card overflow-hidden">
        <table data-testid="inventory-table" className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.inventory?.map((item) => {
              const expirationDate = new Date(item.expirationDate)
              const daysUntilExpiry = getDaysUntilExpiration(item.expirationDate)

              return (
                <tr key={item.id} data-testid="inventory-row" className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{item.medication.name}</div>
                    <div className="text-sm text-gray-500">{item.medication.strength}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.batchNumber}</td>
                  <td className="px-6 py-4">
                    <span data-testid="stock-level" className={`text-sm ${item.alerts?.lowStock ? 'text-red-600 font-semibold' : 'text-gray-900'}`}>
                      {item.quantity} / {item.reorderLevel}
                    </span>
                    {item.alerts?.lowStock && (
                      <div data-testid="low-stock-warning" className="text-xs text-red-600 font-medium">
                        Low Stock
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div data-testid="expiration-date" className={`text-sm ${
                      item.alerts?.expired ? 'text-red-600 font-semibold' :
                      item.alerts?.nearExpiry ? 'text-yellow-600 font-semibold' :
                      'text-gray-900'
                    }`}>
                      {expirationDate.toLocaleDateString()}
                    </div>
                    {!item.alerts?.expired && (
                      <div className="text-xs text-gray-500">
                        {daysUntilExpiry > 0 ? `${daysUntilExpiry} days` : 'Expired'}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.supplier || '-'}</td>
                  <td className="px-6 py-4">
                    {item.alerts?.expired && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Expired
                      </span>
                    )}
                    {item.alerts?.nearExpiry && !item.alerts?.expired && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Near Expiry
                      </span>
                    )}
                    {item.alerts?.lowStock && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800 ml-1">
                        Low Stock
                      </span>
                    )}
                    {!item.alerts?.expired && !item.alerts?.nearExpiry && !item.alerts?.lowStock && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Good
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      data-testid="update-stock-button"
                      onClick={() => handleStockUpdate(item)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Update Stock
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Stock Update Modal */}
      {showStockUpdateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div data-testid="stock-update-modal" className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Update Stock</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Medication</label>
                  <p className="text-sm text-gray-900">{selectedInventoryItem?.medication.name} - {selectedInventoryItem?.medication.strength}</p>
                </div>

                <div>
                  <label htmlFor="new-quantity" className="block text-sm font-medium text-gray-700">New Quantity</label>
                  <input
                    type="number"
                    id="new-quantity"
                    data-testid="new-quantity-input"
                    value={stockUpdateForm.quantity}
                    onChange={(e) => setStockUpdateForm({...stockUpdateForm, quantity: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="batch-number" className="block text-sm font-medium text-gray-700">Batch Number</label>
                  <input
                    type="text"
                    id="batch-number"
                    data-testid="batch-number-input"
                    value={stockUpdateForm.batchNumber}
                    onChange={(e) => setStockUpdateForm({...stockUpdateForm, batchNumber: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="expiration-date" className="block text-sm font-medium text-gray-700">Expiration Date</label>
                  <input
                    type="date"
                    id="expiration-date"
                    data-testid="expiration-date-input"
                    value={stockUpdateForm.expirationDate}
                    onChange={(e) => setStockUpdateForm({...stockUpdateForm, expirationDate: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">Supplier</label>
                  <input
                    type="text"
                    id="supplier"
                    value={stockUpdateForm.supplier}
                    onChange={(e) => setStockUpdateForm({...stockUpdateForm, supplier: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                <button
                  data-testid="save-stock-update"
                  onClick={handleSaveStockUpdate}
                  disabled={isUpdating}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

