/**
 * @fileoverview VendorAlerts Component - Alert Notifications Display
 *
 * Displays important alerts and notifications related to vendor compliance,
 * certifications, orders, and other critical information.
 *
 * @module app/(dashboard)/vendors/_components/sidebar/VendorAlerts
 * @category Components
 * @subcategory Sidebar
 *
 * **Features:**
 * - Color-coded alert types (warning, success, error, info)
 * - Icon-based visual indicators
 * - Contextual alert messages
 * - Dismissible alerts (optional)
 * - Accessible alert announcements
 *
 * @since 2025-11-04
 */

'use client'

import React from 'react'
import {
  AlertTriangle,
  CheckCircle,
  Bell,
} from 'lucide-react'
import type { VendorAlert } from './types'

/**
 * Default alerts configuration
 */
const defaultAlerts: VendorAlert[] = [
  {
    id: 'alert-certifications',
    type: 'warning',
    title: '3 Certifications Expiring',
    description: 'Review vendor certifications expiring within 30 days',
    icon: AlertTriangle,
  },
  {
    id: 'alert-orders',
    type: 'success',
    title: 'All Orders On Track',
    description: '23 active orders are progressing as scheduled',
    icon: CheckCircle,
  },
]

/**
 * Get alert background and border color classes
 */
function getAlertColorClasses(type: string): string {
  const colorMap: Record<string, string> = {
    warning: 'bg-yellow-50 border-yellow-200',
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  }
  return colorMap[type] || 'bg-gray-50 border-gray-200'
}

/**
 * Get alert icon color classes
 */
function getAlertIconColorClasses(type: string): string {
  const colorMap: Record<string, string> = {
    warning: 'text-yellow-600',
    success: 'text-green-600',
    error: 'text-red-600',
    info: 'text-blue-600',
  }
  return colorMap[type] || 'text-gray-600'
}

/**
 * Get alert text color classes
 */
function getAlertTextColorClasses(type: string): {
  title: string
  description: string
} {
  const colorMap: Record<string, { title: string; description: string }> = {
    warning: { title: 'text-yellow-800', description: 'text-yellow-700' },
    success: { title: 'text-green-800', description: 'text-green-700' },
    error: { title: 'text-red-800', description: 'text-red-700' },
    info: { title: 'text-blue-800', description: 'text-blue-700' },
  }
  return (
    colorMap[type] || { title: 'text-gray-800', description: 'text-gray-700' }
  )
}

/**
 * Get ARIA role for alert type
 */
function getAlertRole(type: string): 'alert' | 'status' {
  return type === 'error' || type === 'warning' ? 'alert' : 'status'
}

/**
 * VendorAlerts Props Interface
 */
interface VendorAlertsProps {
  /** Custom alerts (optional) */
  alerts?: VendorAlert[]
  /** Additional CSS classes */
  className?: string
  /** Whether alerts are dismissible */
  dismissible?: boolean
  /** Callback when alert is dismissed */
  onDismiss?: (alertId: string) => void
}

/**
 * VendorAlerts Component
 *
 * Displays alert notifications with color-coded styling based on type.
 * Supports warning, success, error, and info alert types.
 *
 * @param {VendorAlertsProps} props - Component properties
 * @returns {React.JSX.Element} Alerts section
 *
 * @example
 * ```tsx
 * <VendorAlerts />
 * ```
 *
 * @example
 * ```tsx
 * <VendorAlerts
 *   alerts={customAlerts}
 *   dismissible
 *   onDismiss={(id) => console.log('Dismissed:', id)}
 * />
 * ```
 */
export default function VendorAlerts({
  alerts = defaultAlerts,
  className = '',
  dismissible = false,
  onDismiss,
}: VendorAlertsProps): React.JSX.Element {
  if (alerts.length === 0) {
    return <></>
  }

  return (
    <div className={className}>
      <div className="flex items-center mb-3">
        <Bell className="w-4 h-4 text-gray-600 mr-2" aria-hidden="true" />
        <h3 className="text-sm font-medium text-gray-900">Alerts</h3>
      </div>
      <div className="space-y-2" role="region" aria-label="Vendor alerts">
        {alerts.map((alert) => {
          const IconComponent = alert.icon
          const textColors = getAlertTextColorClasses(alert.type)

          return (
            <div
              key={alert.id}
              className={`p-3 border rounded-lg ${getAlertColorClasses(alert.type)}`}
              role={getAlertRole(alert.type)}
              aria-live={alert.type === 'error' || alert.type === 'warning' ? 'assertive' : 'polite'}
            >
              <div className="flex items-start">
                <IconComponent
                  className={`w-4 h-4 mr-2 mt-0.5 ${getAlertIconColorClasses(alert.type)}`}
                  aria-hidden="true"
                />
                <div className="flex-1">
                  <div className={`text-xs font-medium ${textColors.title}`}>
                    {alert.title}
                  </div>
                  <div className={`text-xs mt-1 ${textColors.description}`}>
                    {alert.description}
                  </div>
                </div>
                {dismissible && onDismiss && (
                  <button
                    onClick={() => onDismiss(alert.id)}
                    className={`ml-2 text-xs font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 rounded ${textColors.title}`}
                    aria-label={`Dismiss ${alert.title} alert`}
                    type="button"
                  >
                    Dismiss
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
