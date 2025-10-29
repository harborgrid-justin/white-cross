/**
 * Admin Settings Layout - Navigation and structure for settings pages
 *
 * Provides tab-based navigation for all settings sections including users,
 * districts, schools, integrations, and audit logs.
 *
 * @module app/admin/settings/layout
 * @since 2025-10-26
 */

'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Users,
  Building2,
  School,
  Plug,
  FileText,
  Settings,
  Shield,
  Database
} from 'lucide-react'

const settingsTabs = [
  {
    label: 'Overview',
    href: '/admin/settings',
    icon: Settings,
    description: 'System overview and statistics',
  },
  {
    label: 'Users',
    href: '/admin/settings/users',
    icon: Users,
    description: 'Manage system users and roles',
  },
  {
    label: 'Districts',
    href: '/admin/settings/districts',
    icon: Building2,
    description: 'Manage school districts',
  },
  {
    label: 'Schools',
    href: '/admin/settings/schools',
    icon: School,
    description: 'Manage schools and facilities',
  },
  {
    label: 'Integrations',
    href: '/admin/settings/integrations',
    icon: Plug,
    description: 'Third-party integrations',
  },
  {
    label: 'Audit Logs',
    href: '/admin/settings/audit-logs',
    icon: FileText,
    description: 'View system audit trail',
  },
  {
    label: 'Configuration',
    href: '/admin/settings/configuration',
    icon: Database,
    description: 'System configuration',
  },
]

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const isActiveTab = (href: string) => {
    if (href === '/admin/settings') {
      return pathname === href
    }
    return pathname?.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage system configuration, users, and integrations
              </p>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-4 overflow-x-auto scrollbar-hide" aria-label="Settings sections">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon
              const isActive = isActiveTab(tab.href)

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`
                    flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-medium whitespace-nowrap transition-colors
                    ${isActive
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  )
}
