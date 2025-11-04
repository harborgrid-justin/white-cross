/**
 * @fileoverview VendorNavigation Component - Expandable Navigation Menu
 *
 * Comprehensive navigation menu for vendor management with expandable sections,
 * active state indicators, and badges for counts and alerts.
 *
 * @module app/(dashboard)/vendors/_components/sidebar/VendorNavigation
 * @category Components
 * @subcategory Sidebar
 *
 * **Features:**
 * - Expandable/collapsible navigation sections
 * - Active route highlighting
 * - Badge indicators for counts and alerts
 * - Keyboard navigation support
 * - ARIA labels for accessibility
 * - Nested navigation items
 *
 * @since 2025-11-04
 */

'use client'

import React from 'react'
import Link from 'next/link'
import {
  Building2,
  BarChart3,
  Plus,
  FileText,
  Award,
  Package,
  Clock,
  TrendingUp,
  Star,
  AlertTriangle,
  Filter,
  Download,
  Settings,
  DollarSign,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { useActiveNavigation, useSidebarSections, useBadgeStyling } from './hooks'
import type { VendorSection } from './types'

/**
 * Default vendor navigation sections
 */
const defaultVendorSections: VendorSection[] = [
  {
    id: 'overview',
    title: 'Vendor Overview',
    icon: Building2,
    href: '/vendors',
    badge: 47,
    badgeColor: 'blue',
  },
  {
    id: 'management',
    title: 'Vendor Management',
    icon: Settings,
    isExpandable: true,
    items: [
      {
        id: 'all-vendors',
        title: 'All Vendors',
        href: '/vendors',
        icon: Building2,
        badge: 47,
        badgeColor: 'blue',
        description: 'Complete vendor directory',
      },
      {
        id: 'add-vendor',
        title: 'Add New Vendor',
        href: '/vendors/new',
        icon: Plus,
        badgeColor: 'green',
        description: 'Register new vendor',
      },
      {
        id: 'vendor-categories',
        title: 'Categories',
        href: '/vendors/categories',
        icon: Filter,
        badge: 8,
        badgeColor: 'gray',
        description: 'Manage vendor categories',
      },
    ],
  },
  {
    id: 'performance',
    title: 'Performance Analytics',
    icon: BarChart3,
    isExpandable: true,
    items: [
      {
        id: 'performance-dashboard',
        title: 'Performance Dashboard',
        href: '/vendors/performance',
        icon: TrendingUp,
        description: 'Vendor performance metrics',
      },
      {
        id: 'delivery-tracking',
        title: 'Delivery Tracking',
        href: '/vendors/delivery',
        icon: Package,
        badge: '96%',
        badgeColor: 'green',
        description: 'On-time delivery rates',
      },
      {
        id: 'quality-metrics',
        title: 'Quality Metrics',
        href: '/vendors/quality',
        icon: Star,
        badge: '4.7/5',
        badgeColor: 'yellow',
        description: 'Quality ratings and scores',
      },
    ],
  },
  {
    id: 'compliance',
    title: 'Compliance Tracking',
    icon: Award,
    badge: 3,
    badgeColor: 'yellow',
    isExpandable: true,
    items: [
      {
        id: 'certifications',
        title: 'Certifications',
        href: '/vendors/certifications',
        icon: Award,
        badge: 15,
        badgeColor: 'green',
        description: 'Active certifications',
      },
      {
        id: 'expiring-certs',
        title: 'Expiring Soon',
        href: '/vendors/expiring',
        icon: AlertTriangle,
        badge: 3,
        badgeColor: 'yellow',
        description: 'Certifications expiring soon',
      },
      {
        id: 'documentation',
        title: 'Documentation',
        href: '/vendors/documentation',
        icon: FileText,
        badge: 42,
        badgeColor: 'blue',
        description: 'Compliance documents',
      },
    ],
  },
  {
    id: 'orders',
    title: 'Purchase Orders',
    icon: Package,
    badge: 23,
    badgeColor: 'green',
    isExpandable: true,
    items: [
      {
        id: 'active-orders',
        title: 'Active Orders',
        href: '/purchase-orders/active',
        icon: Package,
        badge: 23,
        badgeColor: 'green',
        description: 'Currently active orders',
      },
      {
        id: 'create-order',
        title: 'Create New Order',
        href: '/purchase-orders/new',
        icon: Plus,
        description: 'Generate purchase order',
      },
      {
        id: 'order-history',
        title: 'Order History',
        href: '/purchase-orders/history',
        icon: Clock,
        badge: 156,
        badgeColor: 'gray',
        description: 'Past orders and invoices',
      },
    ],
  },
  {
    id: 'reports',
    title: 'Reports & Analytics',
    icon: FileText,
    isExpandable: true,
    items: [
      {
        id: 'vendor-reports',
        title: 'Vendor Reports',
        href: '/reports/vendors',
        icon: BarChart3,
        description: 'Performance and compliance reports',
      },
      {
        id: 'spend-analysis',
        title: 'Spend Analysis',
        href: '/reports/spend',
        icon: DollarSign,
        badge: '$125K',
        badgeColor: 'green',
        description: 'Budget and spending analytics',
      },
      {
        id: 'export-data',
        title: 'Export Data',
        href: '/vendors/export',
        icon: Download,
        description: 'Export vendor data',
      },
    ],
  },
]

/**
 * VendorNavigation Props Interface
 */
interface VendorNavigationProps {
  /** Custom navigation sections (optional) */
  sections?: VendorSection[]
  /** Default expanded section IDs */
  defaultExpanded?: string[]
  /** Additional CSS classes */
  className?: string
}

/**
 * VendorNavigation Component
 *
 * Displays hierarchical navigation menu with expandable sections,
 * active state highlighting, and badge indicators.
 *
 * @param {VendorNavigationProps} props - Component properties
 * @returns {React.JSX.Element} Navigation menu
 *
 * @example
 * ```tsx
 * <VendorNavigation />
 * ```
 *
 * @example
 * ```tsx
 * <VendorNavigation
 *   sections={customSections}
 *   defaultExpanded={['management', 'compliance']}
 * />
 * ```
 */
export default function VendorNavigation({
  sections = defaultVendorSections,
  defaultExpanded = ['management'],
  className = '',
}: VendorNavigationProps): React.JSX.Element {
  const { isActive } = useActiveNavigation()
  const { toggleSection, isExpanded } = useSidebarSections(defaultExpanded)
  const getBadgeClasses = useBadgeStyling()

  return (
    <div className={className}>
      <h3 className="text-sm font-medium text-gray-900 mb-3">Navigation</h3>
      <nav className="space-y-2" aria-label="Vendor management navigation">
        {sections.map((section) => {
          const SectionIcon = section.icon
          const expanded = isExpanded(section.id)
          const sectionIsActive = section.href
            ? isActive(section.href)
            : section.items?.some((item) => isActive(item.href)) || false

          return (
            <div key={section.id} className="space-y-1">
              {/* Section Header */}
              {section.isExpandable ? (
                <button
                  onClick={() => toggleSection(section.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    sectionIsActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  aria-expanded={expanded}
                  aria-controls={`section-${section.id}`}
                  type="button"
                >
                  <div className="flex items-center">
                    <SectionIcon className="w-4 h-4 mr-3" aria-hidden="true" />
                    <span>{section.title}</span>
                    {section.badge && (
                      <span
                        className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${getBadgeClasses(
                          section.badgeColor || 'gray'
                        )}`}
                      >
                        {section.badge}
                      </span>
                    )}
                  </div>
                  {expanded ? (
                    <ChevronDown className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              ) : section.href ? (
                <Link
                  href={section.href}
                  className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isActive(section.href)
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  aria-current={isActive(section.href) ? 'page' : undefined}
                >
                  <div className="flex items-center">
                    <SectionIcon className="w-4 h-4 mr-3" aria-hidden="true" />
                    <span>{section.title}</span>
                  </div>
                  {section.badge && (
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${getBadgeClasses(
                        section.badgeColor || 'gray'
                      )}`}
                    >
                      {section.badge}
                    </span>
                  )}
                </Link>
              ) : (
                <div
                  className={`flex items-center justify-between px-3 py-2 text-sm font-medium ${
                    sectionIsActive ? 'text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    <SectionIcon className="w-4 h-4 mr-3" aria-hidden="true" />
                    <span>{section.title}</span>
                  </div>
                  {section.badge && (
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${getBadgeClasses(
                        section.badgeColor || 'gray'
                      )}`}
                    >
                      {section.badge}
                    </span>
                  )}
                </div>
              )}

              {/* Section Items */}
              {section.items && expanded && (
                <div
                  id={`section-${section.id}`}
                  className="ml-4 space-y-1"
                  role="group"
                  aria-label={`${section.title} submenu`}
                >
                  {section.items.map((item) => {
                    const ItemIcon = item.icon
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        className={`flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                          isActive(item.href)
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                        title={item.description}
                        aria-current={isActive(item.href) ? 'page' : undefined}
                      >
                        <div className="flex items-center">
                          {ItemIcon && <ItemIcon className="w-3 h-3 mr-2" aria-hidden="true" />}
                          <span>{item.title}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`px-1.5 py-0.5 text-xs font-medium rounded-full ${getBadgeClasses(
                              item.badgeColor || 'gray'
                            )}`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </div>
  )
}
