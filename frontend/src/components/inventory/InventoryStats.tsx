import React from 'react'
import {
  Package,
  AlertCircle,
  TrendingDown,
  ShoppingCart
} from 'lucide-react'

interface InventoryStatsProps {
  totalItems: number
  activeAlerts: number
  activeVendors: number
  pendingOrders: number
}

export default function InventoryStats({
  totalItems,
  activeAlerts,
  activeVendors,
  pendingOrders
}: InventoryStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Items</p>
            <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
          </div>
          <Package className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Active Alerts</p>
            <p className="text-2xl font-bold text-gray-900">{activeAlerts}</p>
          </div>
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Active Vendors</p>
            <p className="text-2xl font-bold text-gray-900">{activeVendors}</p>
          </div>
          <TrendingDown className="h-8 w-8 text-green-600" />
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Pending Orders</p>
            <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
          </div>
          <ShoppingCart className="h-8 w-8 text-purple-600" />
        </div>
      </div>
    </div>
  )
}
