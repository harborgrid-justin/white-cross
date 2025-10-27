/**
 * @fileoverview Admin Monitoring Layout
 *
 * Shared layout wrapper for all admin monitoring pages, providing consistent
 * navigation tabs, header, and page structure. Includes tabs for system health,
 * performance metrics, error logs, analytics, and active sessions.
 *
 * @module app/admin/monitoring/layout
 * @requires next/link
 * @requires lucide-react
 *
 * @security RBAC - Requires 'admin' or 'system_administrator' role
 * @audit Monitoring section access logged for compliance
 * @compliance HIPAA - System monitoring required for operational compliance
 *
 * @architecture Layout Component - Wraps all monitoring child pages
 * @rendering Server Component with client-side navigation
 *
 * @since 2025-10-26
 */

import type { Metadata } from 'next';

import Link from 'next/link'
import { Activity, TrendingUp, AlertTriangle, BarChart3, Users } from 'lucide-react'

/**
 * Configuration for monitoring navigation tabs.
 *
 * Each tab represents a major monitoring category with its own dedicated page.
 * Icons are from lucide-react for consistent visual design.
 *
 * @constant
 * @type {Array<{name: string, href: string, icon: React.ComponentType}>}
 */
const monitoringTabs = [
  {
    name: 'System Health',
    href: '/admin/monitoring/health',
    icon: Activity,
  },
  {
    name: 'Performance',
    href: '/admin/monitoring/performance',
    icon: TrendingUp,
  },
  {
    name: 'Errors',
    href: '/admin/monitoring/errors',
    icon: AlertTriangle,
  },
  {
    name: 'Analytics',
    href: '/admin/monitoring/analytics',
    icon: BarChart3,
  },
  {
    name: 'Sessions',
    href: '/admin/monitoring/sessions',
    icon: Users,
  },
]

/**
 * Admin monitoring layout component providing consistent navigation and structure.
 *
 * Wraps all monitoring child pages with a shared header and tab navigation,
 * enabling easy switching between monitoring categories while maintaining
 * visual consistency and user context.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child page content to render
 * @returns {JSX.Element} Monitoring layout with navigation and content area
 *
 * @security Admin-only section - RBAC enforced at route level
 * @accessibility Navigation uses semantic HTML with aria-label for screen readers
 *
 * @example
 * ```tsx
 * // Automatically wraps child routes like:
 * // /admin/monitoring/health -> renders SystemHealthPage within this layout
 * // /admin/monitoring/performance -> renders PerformancePage within this layout
 * ```
 */
/**
 * Metadata configuration for Admin Monitoring layout
 */
export const metadata: Metadata = {
  title: 'System Monitoring | Admin | White Cross',
  description: 'Monitor system health, performance metrics, and operational status.',
};

export default function MonitoringLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Monitoring</h1>
        <p className="mt-2 text-gray-600">
          Monitor system health, performance, and usage metrics
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Monitoring tabs">
          {monitoringTabs.map((tab) => {
            const Icon = tab.icon
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className="flex items-center gap-2 px-1 py-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors"
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{tab.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Content */}
      <div>{children}</div>
    </div>
  )
}
