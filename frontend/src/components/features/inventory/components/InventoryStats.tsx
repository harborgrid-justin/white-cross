/**
 * WF-COMP-038 | InventoryStats.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react, lucide-react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export | Key Features: component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import React from 'react'
import {
  Package,
  AlertCircle,
  TrendingDown,
  ShoppingCart
} from 'lucide-react'

/**
 * Props for the InventoryStats component
 *
 * @interface InventoryStatsProps
 * @property {number} totalItems - Total number of inventory items tracked
 * @property {number} activeAlerts - Number of active inventory alerts (low stock, expiring items, etc.)
 * @property {number} activeVendors - Number of active vendor relationships
 * @property {number} pendingOrders - Number of purchase orders pending fulfillment
 */
interface InventoryStatsProps {
  totalItems: number
  activeAlerts: number
  activeVendors: number
  pendingOrders: number
}

/**
 * InventoryStats - Displays inventory management statistics in a dashboard grid
 *
 * Renders a responsive grid showing key inventory metrics including total items,
 * active alerts, active vendors, and pending orders. Used in the inventory
 * management dashboard to provide at-a-glance insights into medical supply inventory status.
 *
 * @param {InventoryStatsProps} props - Component props
 * @returns {JSX.Element} Statistics grid with four metric cards
 *
 * @example
 * ```tsx
 * <InventoryStats
 *   totalItems={342}
 *   activeAlerts={12}
 *   activeVendors={8}
 *   pendingOrders={5}
 * />
 * ```
 *
 * @remarks
 * - Grid layout adapts from 1 column (mobile) to 4 columns (desktop)
 * - Color-coded icons: blue (items), red (alerts), green (vendors), purple (orders)
 * - Each card displays metric name, count, and associated icon
 * - Active alerts indicate items requiring attention (low stock, expiring, etc.)
 * - Pending orders show purchase orders awaiting vendor fulfillment
 *
 * @security
 * - Does not display sensitive vendor pricing information
 * - Statistics are aggregated counts only, no detailed item data
 * - Suitable for dashboard displays with appropriate role-based access
 */
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
