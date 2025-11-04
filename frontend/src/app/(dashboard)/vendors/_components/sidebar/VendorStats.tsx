/**
 * @fileoverview VendorStats Component - Vendor Key Metrics Display
 *
 * Displays key vendor metrics and performance indicators in a compact,
 * scannable format with trend indicators.
 *
 * @module app/(dashboard)/vendors/_components/sidebar/VendorStats
 * @category Components
 * @subcategory Sidebar
 *
 * **Features:**
 * - Real-time vendor metrics display
 * - Trend indicators (increase/decrease)
 * - Icon-based visual representation
 * - Responsive metric cards
 *
 * @since 2025-11-04
 */

'use client'

import React from 'react'
import {
  Building2,
  Package,
  DollarSign,
  Clock,
} from 'lucide-react'
import type { VendorMetric } from './types'

/**
 * Default vendor metrics data
 */
const defaultVendorMetrics: VendorMetric[] = [
  {
    id: 'total-vendors',
    label: 'Total Vendors',
    value: 47,
    change: '+3 this month',
    changeType: 'increase',
    icon: Building2,
  },
  {
    id: 'active-orders',
    label: 'Active Orders',
    value: 23,
    change: '+15%',
    changeType: 'increase',
    icon: Package,
  },
  {
    id: 'total-spend',
    label: 'Total Spend',
    value: '$125K',
    change: '+8.2%',
    changeType: 'increase',
    icon: DollarSign,
  },
  {
    id: 'avg-delivery',
    label: 'Avg Delivery',
    value: '5.2 days',
    change: '-0.5 days',
    changeType: 'decrease',
    icon: Clock,
  },
]

/**
 * VendorStats Props Interface
 */
interface VendorStatsProps {
  /** Custom metrics data (optional) */
  metrics?: VendorMetric[]
  /** Additional CSS classes */
  className?: string
}

/**
 * VendorStats Component
 *
 * Displays key vendor performance metrics with trend indicators.
 * Each metric shows current value, label, icon, and change indicator.
 *
 * @param {VendorStatsProps} props - Component properties
 * @returns {React.JSX.Element} Vendor statistics section
 *
 * @example
 * ```tsx
 * <VendorStats />
 * ```
 *
 * @example
 * ```tsx
 * <VendorStats metrics={customMetrics} className="mb-4" />
 * ```
 */
export default function VendorStats({
  metrics = defaultVendorMetrics,
  className = '',
}: VendorStatsProps): React.JSX.Element {
  return (
    <div className={className}>
      <h3 className="text-sm font-medium text-gray-900 mb-3">Key Metrics</h3>
      <div className="space-y-3">
        {metrics.map((metric) => {
          const IconComponent = metric.icon
          return (
            <div
              key={metric.id}
              className="flex items-center justify-between"
              role="status"
              aria-label={`${metric.label}: ${metric.value}, ${metric.change}`}
            >
              <div className="flex items-center">
                <div className="p-2 bg-gray-50 rounded-lg mr-3">
                  <IconComponent className="w-4 h-4 text-gray-600" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {metric.value}
                  </div>
                  <div className="text-xs text-gray-500">{metric.label}</div>
                </div>
              </div>
              <div
                className={`text-xs font-medium ${
                  metric.changeType === 'increase'
                    ? 'text-green-600'
                    : metric.changeType === 'decrease'
                    ? 'text-red-600'
                    : 'text-gray-600'
                }`}
              >
                {metric.change}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
