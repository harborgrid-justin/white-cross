/**
 * @fileoverview VendorsSidebar Component - Vendor Management Navigation and Quick Actions
 *
 * Comprehensive sidebar component for vendor management system providing navigation,
 * vendor analytics, quick actions, and performance monitoring. Designed for healthcare
 * platform vendor management with focus on compliance tracking and performance metrics.
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
 * - Expandable/collapsible sections
 *
 * **Healthcare Context:**
 * - Medical supply vendor tracking
 * - Pharmaceutical compliance monitoring
 * - Emergency supplier coordination
 * - Budget and cost analysis
 * - Regulatory compliance tracking
 *
 * @since 2025-10-31
 */

'use client'

import React, { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Building2,
  BarChart3,
  Plus,
  FileText,
  Award,
  DollarSign,
  Package,
  Clock,
  TrendingUp,
  Star,
  CheckCircle,
  AlertTriangle,
  Phone,
  ChevronDown,
  ChevronRight,
  Filter,
  Download,
  Settings,
  Bell,
  Activity,
} from 'lucide-react'

/**
 * Vendor sidebar section interface
 */
interface VendorSection {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
  badge?: string | number
  badgeColor?: 'blue' | 'green' | 'yellow' | 'red' | 'gray'
  items?: VendorSubItem[]
  isExpandable?: boolean
}

/**
 * Vendor sidebar sub-item interface
 */
interface VendorSubItem {
  id: string
  title: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  badge?: string | number
  badgeColor?: 'blue' | 'green' | 'yellow' | 'red' | 'gray'
  description?: string
}

/**
 * Vendor metric interface for analytics display
 */
interface VendorMetric {
  id: string
  label: string
  value: string | number
  change: string
  changeType: 'increase' | 'decrease' | 'neutral'
  icon: React.ComponentType<{ className?: string }>
}

/**
 * Quick action interface for vendor operations
 */
interface QuickAction {
  id: string
  title: string
  description: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'red'
}

/**
 * Recent activity interface for vendor tracking
 */
interface VendorActivity {
  id: string
  type: 'order' | 'payment' | 'certification' | 'performance' | 'contact'
  vendor: string
  action: string
  timestamp: string
  status: 'success' | 'warning' | 'error' | 'info'
}

/**
 * Mock vendor metrics data
 */
const vendorMetrics: VendorMetric[] = [
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
 * Mock quick actions data
 */
const quickActions: QuickAction[] = [
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
 * Mock recent activity data
 */
const recentActivity: VendorActivity[] = [
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
 * Vendor navigation sections configuration
 */
const vendorSections: VendorSection[] = [
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
 * VendorsSidebar Props Interface
 */
interface VendorsSidebarProps {
  className?: string
}

/**
 * VendorsSidebar Component
 *
 * Comprehensive vendor management sidebar with navigation sections, real-time metrics,
 * quick actions, and recent activity tracking. Provides efficient access to all vendor
 * management functions with healthcare-specific features and compliance monitoring.
 *
 * @param {VendorsSidebarProps} props - Component properties
 * @returns {React.JSX.Element} Complete vendor management sidebar interface
 *
 * @example
 * ```tsx
 * <VendorsSidebar className="w-80 border-r" />
 * ```
 */
export default function VendorsSidebar({ className = '' }: VendorsSidebarProps): React.JSX.Element {
  const router = useRouter()
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['management']))

  /**
   * Toggle expansion state of sidebar sections
   */
  const toggleSection = (sectionId: string): void => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId)
      } else {
        newSet.add(sectionId)
      }
      return newSet
    })
  }

  /**
   * Check if a navigation item is currently active
   */
  const isActive = (href: string): boolean => {
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  /**
   * Get badge styling classes based on color
   */
  const getBadgeClasses = (color: string): string => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-700',
      green: 'bg-green-100 text-green-700',
      yellow: 'bg-yellow-100 text-yellow-700',
      red: 'bg-red-100 text-red-700',
      gray: 'bg-gray-100 text-gray-700',
    }
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-100 text-gray-700'
  }

  /**
   * Get activity status icon based on type
   */
  const getActivityIcon = (type: string): React.ComponentType<{ className?: string }> => {
    const iconMap = {
      order: Package,
      payment: DollarSign,
      certification: Award,
      performance: TrendingUp,
      contact: Phone,
    }
    return iconMap[type as keyof typeof iconMap] || Activity
  }

  /**
   * Get activity status styling
   */
  const getActivityStatus = (status: string): string => {
    const statusMap = {
      success: 'text-green-600',
      warning: 'text-yellow-600',
      error: 'text-red-600',
      info: 'text-blue-600',
    }
    return statusMap[status as keyof typeof statusMap] || 'text-gray-600'
  }

  /**
   * Get quick action button styling
   */
  const getActionColor = (color: string): string => {
    const colorMap = {
      blue: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200',
      green: 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200',
      yellow: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200',
      purple: 'bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200',
      red: 'bg-red-50 text-red-700 hover:bg-red-100 border-red-200',
    }
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
  }

  return (
    <div className={`bg-white border-r border-gray-200 overflow-y-auto ${className}`}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Vendor Management
          </h2>
          <p className="text-sm text-gray-600">
            Healthcare vendor operations and compliance
          </p>
        </div>

        {/* Key Metrics */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Key Metrics</h3>
          <div className="space-y-3">
            {vendorMetrics.map((metric) => {
              const IconComponent = metric.icon
              return (
                <div key={metric.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-gray-50 rounded-lg mr-3">
                      <IconComponent className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {metric.value}
                      </div>
                      <div className="text-xs text-gray-500">{metric.label}</div>
                    </div>
                  </div>
                  <div className={`text-xs font-medium ${
                    metric.changeType === 'increase' ? 'text-green-600' :
                    metric.changeType === 'decrease' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {metric.change}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => {
              const IconComponent = action.icon
              return (
                <button
                  key={action.id}
                  onClick={() => router.push(action.href)}
                  className={`p-3 text-left border rounded-lg transition-colors ${getActionColor(action.color)}`}
                  title={action.description}
                >
                  <div className="flex flex-col items-center">
                    <IconComponent className="w-5 h-5 mb-2" />
                    <span className="text-xs font-medium text-center leading-tight">
                      {action.title}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Navigation Sections */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Navigation</h3>
          <nav className="space-y-2">
            {vendorSections.map((section) => {
              const SectionIcon = section.icon
              const isExpanded = expandedSections.has(section.id)
              const sectionIsActive = section.href ? isActive(section.href) : 
                section.items?.some(item => isActive(item.href)) || false

              return (
                <div key={section.id} className="space-y-1">
                  {/* Section Header */}
                  {section.isExpandable ? (
                    <button
                      onClick={() => toggleSection(section.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        sectionIsActive
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <SectionIcon className="w-4 h-4 mr-3" />
                        <span>{section.title}</span>
                        {section.badge && (
                          <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${getBadgeClasses(section.badgeColor || 'gray')}`}>
                            {section.badge}
                          </span>
                        )}
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  ) : section.href ? (
                    <Link
                      href={section.href}
                      className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive(section.href)
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <SectionIcon className="w-4 h-4 mr-3" />
                        <span>{section.title}</span>
                      </div>
                      {section.badge && (
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getBadgeClasses(section.badgeColor || 'gray')}`}>
                          {section.badge}
                        </span>
                      )}
                    </Link>
                  ) : (
                    <div className={`flex items-center justify-between px-3 py-2 text-sm font-medium ${
                      sectionIsActive ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      <div className="flex items-center">
                        <SectionIcon className="w-4 h-4 mr-3" />
                        <span>{section.title}</span>
                      </div>
                      {section.badge && (
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getBadgeClasses(section.badgeColor || 'gray')}`}>
                          {section.badge}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Section Items */}
                  {section.items && isExpanded && (
                    <div className="ml-4 space-y-1">
                      {section.items.map((item) => {
                        const ItemIcon = item.icon
                        return (
                          <Link
                            key={item.id}
                            href={item.href}
                            className={`flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                              isActive(item.href)
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                            title={item.description}
                          >
                            <div className="flex items-center">
                              {ItemIcon && <ItemIcon className="w-3 h-3 mr-2" />}
                              <span>{item.title}</span>
                            </div>
                            {item.badge && (
                              <span className={`px-1.5 py-0.5 text-xs font-medium rounded-full ${getBadgeClasses(item.badgeColor || 'gray')}`}>
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

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Recent Activity</h3>
            <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity) => {
              const ActivityIcon = getActivityIcon(activity.type)
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-1.5 rounded-full bg-gray-50 ${getActivityStatus(activity.status)}`}>
                    <ActivityIcon className="w-3 h-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-900 mb-1">
                      {activity.vendor}
                    </div>
                    <div className="text-xs text-gray-600 mb-1">
                      {activity.action}
                    </div>
                    <div className="text-xs text-gray-400">
                      {activity.timestamp}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div>
          <div className="flex items-center mb-3">
            <Bell className="w-4 h-4 text-gray-600 mr-2" />
            <h3 className="text-sm font-medium text-gray-900">Alerts</h3>
          </div>
          <div className="space-y-2">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2 mt-0.5" />
                <div>
                  <div className="text-xs font-medium text-yellow-800">
                    3 Certifications Expiring
                  </div>
                  <div className="text-xs text-yellow-700 mt-1">
                    Review vendor certifications expiring within 30 days
                  </div>
                </div>
              </div>
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5" />
                <div>
                  <div className="text-xs font-medium text-green-800">
                    All Orders On Track
                  </div>
                  <div className="text-xs text-green-700 mt-1">
                    23 active orders are progressing as scheduled
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}