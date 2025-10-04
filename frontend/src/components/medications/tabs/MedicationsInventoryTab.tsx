import React from 'react'
import { AlertTriangle, Package } from 'lucide-react'

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
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.inventory?.map((item) => {
              const expirationDate = new Date(item.expirationDate)
              const daysUntilExpiry = Math.ceil((expirationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{item.medication.name}</div>
                    <div className="text-sm text-gray-500">{item.medication.strength}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.batchNumber}</td>
                  <td className="px-6 py-4">
                    <span className={`text-sm ${item.alerts?.lowStock ? 'text-red-600 font-semibold' : 'text-gray-900'}`}>
                      {item.quantity} / {item.reorderLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`text-sm ${
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
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
