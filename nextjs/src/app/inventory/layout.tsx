/**
 * Inventory Layout - Navigation for inventory management sections
 *
 * @module app/inventory/layout
 * @since 2025-10-26
 */

'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Package, Box, ShoppingCart, Users, TrendingUp } from 'lucide-react'

const inventoryTabs = [
  {
    label: 'Dashboard',
    href: '/inventory',
    icon: TrendingUp,
    description: 'Overview and statistics',
  },
  {
    label: 'Items',
    href: '/inventory/items',
    icon: Package,
    description: 'Manage inventory items',
  },
  {
    label: 'Orders',
    href: '/inventory/orders',
    icon: ShoppingCart,
    description: 'Purchase orders',
  },
  {
    label: 'Vendors',
    href: '/inventory/vendors',
    icon: Users,
    description: 'Vendor management',
  },
]

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const isActiveTab = (href: string) => {
    if (href === '/inventory') {
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
            <div className="p-2 bg-green-100 rounded-lg">
              <Box className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
              <p className="text-sm text-gray-600 mt-1">
                Track medical supplies, equipment, and stock levels
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-4" aria-label="Inventory sections">
            {inventoryTabs.map((tab) => {
              const Icon = tab.icon
              const isActive = isActiveTab(tab.href)

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`
                    flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-medium transition-colors
                    ${isActive
                      ? 'border-green-600 text-green-600'
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  )
}
