/**
 * WF-COMP-042 | InventoryOrdersTab.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../../../types | Dependencies: react, lucide-react, ../../../types
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export | Key Features: component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import React from 'react'
import { Plus } from 'lucide-react'
import type { PurchaseOrder } from '@/types/inventory'

/**
 * Props for the InventoryOrdersTab component
 *
 * @interface InventoryOrdersTabProps
 * @property {PurchaseOrder[]} orders - Array of purchase orders to display
 * @property {function} getStatusBadgeColor - Function to determine CSS classes for status badge styling
 */
interface InventoryOrdersTabProps {
  orders: PurchaseOrder[]
  getStatusBadgeColor: (status: string) => string
}

/**
 * InventoryOrdersTab - Purchase order management and tracking interface
 *
 * Displays a table of purchase orders with details including order number, vendor,
 * date, total cost, status, and item count. Supports creation of new purchase orders
 * and tracking of order fulfillment status from vendors.
 *
 * @param {InventoryOrdersTabProps} props - Component props
 * @returns {JSX.Element} Purchase orders table with creation button
 *
 * @example
 * ```tsx
 * <InventoryOrdersTab
 *   orders={purchaseOrders}
 *   getStatusBadgeColor={(status) => {
 *     const colors = {
 *       PENDING: 'bg-yellow-100 text-yellow-800',
 *       APPROVED: 'bg-blue-100 text-blue-800',
 *       ORDERED: 'bg-purple-100 text-purple-800',
 *       RECEIVED: 'bg-green-100 text-green-800',
 *       CANCELLED: 'bg-red-100 text-red-800'
 *     }
 *     return colors[status] || colors.PENDING
 *   }}
 * />
 * ```
 *
 * @remarks
 * - "Create Order" button initiates new purchase order workflow
 * - Table columns: Order #, Vendor, Date, Total, Status, Items
 * - Order dates formatted using browser locale settings
 * - Total amounts displayed with currency formatting (2 decimal places)
 * - Status badges color-coded based on order state
 * - Item count shows number of line items in each order
 * - Hover effect on table rows for better interactivity
 * - Responsive table with horizontal scroll on smaller screens
 * - Typical order statuses: PENDING, APPROVED, ORDERED, RECEIVED, CANCELLED
 *
 * @security
 * - Purchase order data visible to authorized procurement staff only
 * - Vendor information and pricing restricted by role-based permissions
 * - Order creation requires appropriate authorization
 *
 * @compliance
 * - Purchase order history provides audit trail for procurement
 * - Supports tracking of medical supply ordering for compliance
 * - Vendor relationship documentation for healthcare facility audits
 * - Order records retained according to regulatory requirements
 */
export default function InventoryOrdersTab({ orders, getStatusBadgeColor }: InventoryOrdersTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Purchase Orders</h3>
        <button className="btn-primary flex items-center text-sm">
          <Plus className="h-4 w-4 mr-2" />
          Create Order
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.orderNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.vendor?.name || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.orderDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  ${order.total?.toFixed(2) || '0.00'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.items?.length || 0} items
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

