/**
 * @fileoverview VendorActivity Component - Recent Activity Feed
 *
 * Displays recent vendor-related activities including orders, payments,
 * certifications, and performance updates with status indicators.
 *
 * @module app/(dashboard)/vendors/_components/sidebar/VendorActivity
 * @category Components
 * @subcategory Sidebar
 *
 * **Features:**
 * - Real-time activity feed
 * - Status-based color coding
 * - Type-specific icons
 * - Timestamp display
 * - Activity filtering capability
 *
 * @since 2025-11-04
 */

'use client'

import React, { ComponentType } from 'react'
import {
  Package,
  DollarSign,
  Award,
  TrendingUp,
  Phone,
  Activity,
} from 'lucide-react'
import type { VendorActivity as VendorActivityType } from './types'

/**
 * Default recent activity data
 */
const defaultRecentActivity: VendorActivityType[] = [
  {
    id: 'activity-1',
    type: 'order',
    vendor: 'Medical Supplies Inc.',
    action: 'New purchase order #PO-2025-001 created',
    timestamp: '2 hours ago',
    status: 'success',
  },
  {
    id: 'activity-2',
    type: 'certification',
    vendor: 'Pharma Distributors LLC',
    action: 'FDA certification expiring in 30 days',
    timestamp: '4 hours ago',
    status: 'warning',
  },
  {
    id: 'activity-3',
    type: 'payment',
    vendor: 'First Aid Solutions',
    action: 'Payment processed for invoice #INV-2025-045',
    timestamp: '1 day ago',
    status: 'success',
  },
  {
    id: 'activity-4',
    type: 'performance',
    vendor: 'Emergency Medical Supply',
    action: 'Performance rating updated to GOOD',
    timestamp: '2 days ago',
    status: 'info',
  },
]

/**
 * Get activity type icon
 */
function getActivityIcon(type: string): ComponentType<{ className?: string }> {
  const iconMap: Record<string, ComponentType<{ className?: string }>> = {
    order: Package,
    payment: DollarSign,
    certification: Award,
    performance: TrendingUp,
    contact: Phone,
  }
  return iconMap[type] || Activity
}

/**
 * Get activity status styling
 */
function getActivityStatusClasses(status: string): string {
  const statusMap: Record<string, string> = {
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
    info: 'text-blue-600',
  }
  return statusMap[status] || 'text-gray-600'
}

/**
 * VendorActivity Props Interface
 */
interface VendorActivityProps {
  /** Custom activity data (optional) */
  activities?: VendorActivityType[]
  /** Additional CSS classes */
  className?: string
  /** Callback for "View All" action */
  onViewAll?: () => void
  /** Maximum number of activities to display */
  maxItems?: number
}

/**
 * VendorActivity Component
 *
 * Displays a feed of recent vendor-related activities with icons,
 * status indicators, and timestamps.
 *
 * @param {VendorActivityProps} props - Component properties
 * @returns {React.JSX.Element} Recent activity section
 *
 * @example
 * ```tsx
 * <VendorActivity />
 * ```
 *
 * @example
 * ```tsx
 * <VendorActivity
 *   activities={customActivities}
 *   maxItems={5}
 *   onViewAll={() => router.push('/vendors/activity')}
 * />
 * ```
 */
export default function VendorActivity({
  activities = defaultRecentActivity,
  className = '',
  onViewAll,
  maxItems,
}: VendorActivityProps): React.JSX.Element {
  const displayActivities = maxItems ? activities.slice(0, maxItems) : activities

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">Recent Activity</h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded"
            type="button"
            aria-label="View all activities"
          >
            View All
          </button>
        )}
      </div>
      <div className="space-y-3" role="feed" aria-label="Recent vendor activities">
        {displayActivities.map((activity) => {
          const ActivityIcon = getActivityIcon(activity.type)
          return (
            <div
              key={activity.id}
              className="flex items-start space-x-3"
              role="article"
              aria-label={`${activity.vendor}: ${activity.action}`}
            >
              <div
                className={`p-1.5 rounded-full bg-gray-50 ${getActivityStatusClasses(
                  activity.status
                )}`}
              >
                <ActivityIcon className="w-3 h-3" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-gray-900 mb-1">
                  {activity.vendor}
                </div>
                <div className="text-xs text-gray-600 mb-1">{activity.action}</div>
                <time className="text-xs text-gray-400">{activity.timestamp}</time>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
