/**
 * Reports Layout - Navigation for reports and analytics
 *
 * @module app/reports/layout
 * @since 2025-10-26
 */

'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { FileText, Shield, TrendingUp, BarChart3 } from 'lucide-react'

const reportsTabs = [
  {
    label: 'Dashboard',
    href: '/reports',
    icon: BarChart3,
  },
  {
    label: 'Compliance',
    href: '/reports/compliance',
    icon: Shield,
  },
  {
    label: 'Usage Analytics',
    href: '/reports/usage',
    icon: TrendingUp,
  },
]

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const isActiveTab = (href: string) => {
    if (href === '/reports') {
      return pathname === href
    }
    return pathname?.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="text-sm text-gray-600 mt-1">
                View compliance reports, usage analytics, and system insights
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-4" aria-label="Reports sections">
            {reportsTabs.map((tab) => {
              const Icon = tab.icon
              const isActive = isActiveTab(tab.href)

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`
                    flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-medium transition-colors
                    ${isActive
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  )
}
