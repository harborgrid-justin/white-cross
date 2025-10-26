/**
 * Admin Monitoring Layout
 *
 * Layout wrapper for all monitoring pages with navigation tabs.
 *
 * @module app/admin/monitoring/layout
 * @since 2025-10-26
 */

import Link from 'next/link'
import { Activity, TrendingUp, AlertTriangle, BarChart3, Users } from 'lucide-react'

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
