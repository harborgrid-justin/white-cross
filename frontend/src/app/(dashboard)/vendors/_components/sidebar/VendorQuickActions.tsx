/**
 * @fileoverview VendorQuickActions Component - Quick Action Buttons
 *
 * Provides quick access buttons for common vendor management tasks.
 * Grid layout with color-coded action buttons for easy identification.
 *
 * @module app/(dashboard)/vendors/_components/sidebar/VendorQuickActions
 * @category Components
 * @subcategory Sidebar
 *
 * **Features:**
 * - Quick action buttons for common tasks
 * - Color-coded actions for visual distinction
 * - Keyboard navigation support
 * - Tooltips with action descriptions
 * - Responsive grid layout
 *
 * @since 2025-11-04
 */

'use client'

import React, { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Plus,
  FileText,
  BarChart3,
  Award,
} from 'lucide-react'
import type { QuickAction } from './types'

/**
 * Default quick actions configuration
 */
const defaultQuickActions: QuickAction[] = [
  {
    id: 'add-vendor',
    title: 'Add New Vendor',
    description: 'Register a new healthcare vendor',
    href: '/vendors/new',
    icon: Plus,
    color: 'blue',
  },
  {
    id: 'create-po',
    title: 'Create Purchase Order',
    description: 'Generate new purchase order',
    href: '/purchase-orders/new',
    icon: FileText,
    color: 'green',
  },
  {
    id: 'vendor-report',
    title: 'Generate Report',
    description: 'Create vendor performance report',
    href: '/reports/vendors',
    icon: BarChart3,
    color: 'purple',
  },
  {
    id: 'compliance-check',
    title: 'Compliance Review',
    description: 'Review vendor compliance status',
    href: '/vendors/compliance',
    icon: Award,
    color: 'yellow',
  },
]

/**
 * Get action button color classes
 */
function getActionColorClasses(color: string): string {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200',
    green: 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200',
    purple: 'bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200',
    red: 'bg-red-50 text-red-700 hover:bg-red-100 border-red-200',
  }
  return colorMap[color] || 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
}

/**
 * VendorQuickActions Props Interface
 */
interface VendorQuickActionsProps {
  /** Custom quick actions (optional) */
  actions?: QuickAction[]
  /** Additional CSS classes */
  className?: string
  /** Callback when action is clicked (optional) */
  onActionClick?: (action: QuickAction) => void
}

/**
 * VendorQuickActions Component
 *
 * Displays a grid of quick action buttons for common vendor management tasks.
 * Each button is color-coded and includes an icon and title.
 *
 * @param {VendorQuickActionsProps} props - Component properties
 * @returns {React.JSX.Element} Quick actions section
 *
 * @example
 * ```tsx
 * <VendorQuickActions />
 * ```
 *
 * @example
 * ```tsx
 * <VendorQuickActions
 *   actions={customActions}
 *   onActionClick={(action) => console.log(action)}
 * />
 * ```
 */
export default function VendorQuickActions({
  actions = defaultQuickActions,
  className = '',
  onActionClick,
}: VendorQuickActionsProps): React.JSX.Element {
  const router = useRouter()

  /**
   * Handle action button click
   */
  const handleActionClick = useCallback(
    (action: QuickAction) => {
      if (onActionClick) {
        onActionClick(action)
      } else {
        router.push(action.href)
      }
    },
    [router, onActionClick]
  )

  return (
    <div className={className}>
      <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-2" role="group" aria-label="Quick vendor actions">
        {actions.map((action) => {
          const IconComponent = action.icon
          return (
            <button
              key={action.id}
              onClick={() => handleActionClick(action)}
              className={`p-3 text-left border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${getActionColorClasses(
                action.color
              )}`}
              title={action.description}
              aria-label={action.description}
              type="button"
            >
              <div className="flex flex-col items-center">
                <IconComponent className="w-5 h-5 mb-2" aria-hidden="true" />
                <span className="text-xs font-medium text-center leading-tight">
                  {action.title}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
