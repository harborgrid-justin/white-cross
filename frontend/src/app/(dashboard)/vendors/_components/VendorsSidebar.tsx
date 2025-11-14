/**
 * @fileoverview VendorsSidebar Component - Vendor Management Navigation and Quick Actions
 *
 * Comprehensive sidebar component for vendor management system providing navigation,
 * vendor analytics, quick actions, and performance monitoring. Designed for healthcare
 * platform vendor management with focus on compliance tracking and performance metrics.
 *
 * **Refactored Version** - This is a modular refactor of the original 772-line component,
 * broken down into focused sub-components for improved maintainability.
 *
 * @module app/(dashboard)/vendors/_components/VendorsSidebar
 * @category Components
 * @subcategory Navigation
 *
 * **Features:**
 * - Vendor management navigation sections
 * - Real-time vendor metrics and analytics
 * - Quick action buttons for common tasks
 * - Performance overview dashboard
 * - Compliance tracking indicators
 * - Recent vendor activity feed
 * - Alert notifications
 *
 * **Healthcare Context:**
 * - Medical supply vendor tracking
 * - Pharmaceutical compliance monitoring
 * - Emergency supplier coordination
 * - Budget and cost analysis
 * - Regulatory compliance tracking
 *
 * **Component Structure:**
 * - VendorStats: Key metrics display
 * - VendorQuickActions: Quick action buttons
 * - VendorNavigation: Expandable navigation menu
 * - VendorActivity: Recent activity feed
 * - VendorAlerts: Alert notifications
 *
 * @since 2025-11-04
 * @version 2.0.0
 */

'use client'

import React from 'react'
import {
  VendorStats,
  VendorQuickActions,
  VendorNavigation,
  VendorActivity,
  VendorAlerts,
} from './sidebar'

/**
 * VendorsSidebar Props Interface
 */
interface VendorsSidebarProps {
  /** Additional CSS classes for sidebar container */
  className?: string
  /** Whether to show stats section */
  showStats?: boolean
  /** Whether to show quick actions section */
  showQuickActions?: boolean
  /** Whether to show navigation section */
  showNavigation?: boolean
  /** Whether to show activity section */
  showActivity?: boolean
  /** Whether to show alerts section */
  showAlerts?: boolean
}

/**
 * VendorsSidebar Component
 *
 * Comprehensive vendor management sidebar with navigation sections, real-time metrics,
 * quick actions, and recent activity tracking. Provides efficient access to all vendor
 * management functions with healthcare-specific features and compliance monitoring.
 *
 * This is the refactored version that composes smaller, focused sub-components for
 * improved maintainability and testability.
 *
 * @param {VendorsSidebarProps} props - Component properties
 * @returns {React.JSX.Element} Complete vendor management sidebar interface
 *
 * @example
 * ```tsx
 * <VendorsSidebar className="w-80 border-r" />
 * ```
 *
 * @example
 * ```tsx
 * <VendorsSidebar
 *   className="w-80"
 *   showStats={true}
 *   showQuickActions={true}
 *   showNavigation={true}
 *   showActivity={true}
 *   showAlerts={true}
 * />
 * ```
 */
export default function VendorsSidebar({
  className = '',
  showStats = true,
  showQuickActions = true,
  showNavigation = true,
  showActivity = true,
  showAlerts = true,
}: VendorsSidebarProps): React.JSX.Element {
  return (
    <div
      className={`bg-white border-r border-gray-200 overflow-y-auto ${className}`}
      role="complementary"
      aria-label="Vendor management sidebar"
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <header>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Vendor Management
          </h2>
          <p className="text-sm text-gray-600">
            Healthcare vendor operations and compliance
          </p>
        </header>

        {/* Key Metrics */}
        {showStats && <VendorStats />}

        {/* Quick Actions */}
        {showQuickActions && <VendorQuickActions />}

        {/* Navigation Sections */}
        {showNavigation && <VendorNavigation />}

        {/* Recent Activity */}
        {showActivity && <VendorActivity />}

        {/* Alerts & Notifications */}
        {showAlerts && <VendorAlerts />}
      </div>
    </div>
  )
}
