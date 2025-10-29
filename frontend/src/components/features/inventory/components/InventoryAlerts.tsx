'use client';

/**
 * WF-COMP-037 | InventoryAlerts.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../../types | Dependencies: react, lucide-react, ../../types
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export | Key Features: component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import React from 'react'
import { Bell } from 'lucide-react'
import { InventoryAlert } from '@/pages/inventory/store/inventorySlice'

/**
 * Props for the InventoryAlerts component
 *
 * @interface InventoryAlertsProps
 * @property {InventoryAlert[]} alerts - Array of active inventory alert records
 * @property {function} getAlertBadgeColor - Function to determine CSS classes for severity badge styling
 */
interface InventoryAlertsProps {
  alerts: InventoryAlert[]
  getAlertBadgeColor: (severity: string) => string
}

/**
 * InventoryAlerts - Displays active inventory alerts and warnings
 *
 * Renders a scrollable list of inventory alerts including low stock warnings,
 * expiring items, and critical supply shortages. Alerts are color-coded by
 * severity (CRITICAL, HIGH, MEDIUM) to help prioritize inventory management actions.
 *
 * @param {InventoryAlertsProps} props - Component props
 * @returns {JSX.Element | null} Alerts panel or null if no alerts exist
 *
 * @example
 * ```tsx
 * <InventoryAlerts
 *   alerts={[
 *     {
 *       id: '1',
 *       type: 'LOW_STOCK',
 *       severity: 'CRITICAL',
 *       message: 'Epinephrine auto-injectors below minimum stock level'
 *     }
 *   ]}
 *   getAlertBadgeColor={(severity) => {
 *     const colors = {
 *       CRITICAL: 'bg-red-100 text-red-800',
 *       HIGH: 'bg-orange-100 text-orange-800',
 *       MEDIUM: 'bg-yellow-100 text-yellow-800'
 *     }
 *     return colors[severity] || colors.MEDIUM
 *   }}
 * />
 * ```
 *
 * @remarks
 * - Returns null if alerts array is empty (component not rendered)
 * - Displays up to 10 most recent alerts, scrollable if more exist
 * - Severity levels: CRITICAL (red), HIGH (orange), MEDIUM (yellow)
 * - Alert types include: LOW_STOCK, EXPIRING_SOON, OUT_OF_STOCK, REORDER_NEEDED
 * - Background color matches severity for quick visual identification
 * - Icon (Bell) indicates alert notification functionality
 *
 * @security
 * - Alert messages should not contain sensitive pricing information
 * - Suitable for display to authorized inventory management staff
 * - Access controlled by role-based permissions
 *
 * @compliance
 * - Critical medical supply alerts support healthcare safety protocols
 * - Alert history maintained in audit trail for compliance reporting
 * - Helps ensure continuous availability of essential medical supplies
 */
export default function InventoryAlerts({ alerts, getAlertBadgeColor }: InventoryAlertsProps) {
  if (alerts.length === 0) return null

  return (
    <div className="card p-6">
      <div className="flex items-center mb-4">
        <Bell className="h-5 w-5 text-red-600 mr-2" />
        <h3 className="text-lg font-semibold">Active Alerts ({alerts.length})</h3>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {alerts.slice(0, 10).map((alert) => (
          <div
            key={alert.id}
            className={`p-3 rounded-lg border ${
              alert.severity === 'CRITICAL' ? 'border-red-200 bg-red-50' :
              alert.severity === 'HIGH' ? 'border-orange-200 bg-orange-50' :
              'border-yellow-200 bg-yellow-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getAlertBadgeColor(alert.severity)}`}>
                    {alert.severity}
                  </span>
                  <span className="text-xs text-gray-500">{alert.type.replace(/_/g, ' ')}</span>
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900">{alert.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
