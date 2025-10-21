/**
 * WF-COMP-048 | InventoryTab.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../shared, ../../hooks/useMedicationsData, ../../utils/medications | Dependencies: lucide-react, ../shared, ../../hooks/useMedicationsData
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants | Key Features: functional component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import { Package } from 'lucide-react'
import { AlertBanner, LoadingSpinner, EmptyState } from '../../../'
import { useMedicationsData } from '../../../../hooks/useMedicationsData'
import { getExpirationStatus, getStockStatus, formatDate } from '../../../../utils/medications'
import type { MedicationInventory } from '../../../../types/api'

interface InventoryTabProps {
  onInventoryItemSelect?: (item: MedicationInventory) => void
  className?: string
  testId?: string
}

export const InventoryTab: React.FC<InventoryTabProps> = ({
  onInventoryItemSelect,
  className = '',
  testId
}) => {
  const { inventory, isLoading: inventoryLoading } = useMedicationsData()

  if (inventoryLoading) {
    return (
      <LoadingSpinner 
        size="large" 
        message="Loading inventory..." 
        testId="inventory-loading"
        className="py-12"
      />
    )
  }

  if (!inventory || inventory.length === 0) {
    return (
      <EmptyState
        icon={<Package className="h-12 w-12" />}
        title="No inventory items found"
        description="Add medication inventory to get started"
        testId="inventory-empty-state"
      />
    )
  }

  // Calculate alerts
  const expiredItems = inventory.filter(item => 
    getExpirationStatus(item.expirationDate).status === 'expired'
  )
  const nearExpiryItems = inventory.filter(item => {
    const status = getExpirationStatus(item.expirationDate).status
    return status === 'critical' || status === 'warning'
  })
  const lowStockItems = inventory.filter(item => {
    const status = getStockStatus(item.quantity, item.reorderLevel).status
    return status === 'critical' || status === 'low'
  })

  return (
    <div data-testid={testId} className={`space-y-4 ${className}`}>
      {/* Alerts */}
      {(expiredItems.length > 0 || nearExpiryItems.length > 0 || lowStockItems.length > 0) && (
        <div data-testid="inventory-alerts" className="space-y-3">
          {expiredItems.length > 0 && (
            <AlertBanner
              type="error"
              title="Expired Medications"
              message={`${expiredItems.length} medication(s) have expired and should be disposed of`}
              testId="expired-alert"
            />
          )}
          
          {nearExpiryItems.length > 0 && (
            <AlertBanner
              type="warning"
              title="Near Expiry"
              message={`${nearExpiryItems.length} medication(s) expiring within 30 days`}
              testId="near-expiry-alert"
            />
          )}

          {lowStockItems.length > 0 && (
            <AlertBanner
              type="warning"
              title="Low Stock"
              message={`${lowStockItems.length} medication(s) below reorder level`}
              testId="low-stock-alert"
            />
          )}
        </div>
      )}

      {/* Inventory Table */}
      <div className="card overflow-hidden">
        <table data-testid="inventory-table" className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Medication
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Batch Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expiration Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Supplier
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inventory.map((item) => {
              const expirationStatus = getExpirationStatus(item.expirationDate)
              const stockStatus = getStockStatus(item.quantity, item.reorderLevel)
              
              return (
                <tr 
                  key={item.id} 
                  data-testid="inventory-row" 
                  className={`hover:bg-gray-50 ${onInventoryItemSelect ? 'cursor-pointer' : ''}`}
                  onClick={() => onInventoryItemSelect?.(item)}
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {item.medication?.name || 'Unknown Medication'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.medication?.dosageForm} • {item.medication?.strength}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.batchNumber}
                  </td>
                  <td className="px-6 py-4">
                    <span 
                      className={`text-sm ${
                        stockStatus.status === 'critical' || stockStatus.status === 'low'
                          ? 'text-red-600 font-semibold' 
                          : 'text-gray-900'
                      }`}
                    >
                      {item.quantity} units
                    </span>
                    {item.reorderLevel && item.quantity <= item.reorderLevel && (
                      <div className="text-xs text-red-500">
                        Reorder at {item.reorderLevel}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {formatDate(item.expirationDate)}
                    </div>
                    <div className={`text-xs ${expirationStatus.color} px-2 py-1 rounded inline-block mt-1`}>
                      {expirationStatus.message}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span 
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${stockStatus.color}`}
                    >
                      {stockStatus.message}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {item.supplier || 'N/A'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}


