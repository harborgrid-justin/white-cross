'use client';

/**
 * WF-COMP-NAV-003 | Sidebar.tsx - Application Sidebar Component
 * Purpose: Collapsible sidebar with categorized navigation for all 21 domains
 * Dependencies: react, react-router-dom, lucide-react, navigation config, contexts
 * Features: Collapsible sections, active states, icons, responsive, dark mode
 * Last Updated: 2025-10-24
 * Agent: NAV7L5 - React Component Architect
 */

import React, { useState, useMemo, useCallback, memo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Home, Users, FileHeart, Pill, Calendar, DollarSign, Package, ShoppingCart,
  Store, MessageSquare, FileText, BarChart3, AlertTriangle, Phone, Shield,
  Lock, CheckCircle, Settings, Plug, ChevronDown, ChevronRight, List,
  TrendingUp, Activity, UserCog, Send, UserPlus, CalendarPlus, AlertCircle,
  Clock, X
} from 'lucide-react'
import { useAuthContext } from '../../contexts/AuthContext'
import { useNavigation } from '../../contexts/NavigationContext'
import { NAVIGATION_SECTIONS, QUICK_ACCESS_ITEMS } from '../../config/navigationConfig'
import { filterNavigationItems, markActiveNavigationItems } from '../../utils/navigationUtils'
import type { NavigationItem, NavigationSection } from '../../types/navigation'

// ============================================================================
// ICON MAPPING
// ============================================================================

const iconMap: Record<string, any> = {
  Home, Users, FileHeart, Pill, Calendar, DollarSign, Package, ShoppingCart,
  Store, MessageSquare, FileText, BarChart3, AlertTriangle, Phone, Shield,
  Lock, CheckCircle, Settings, Plug, List, TrendingUp, Activity, UserCog,
  Send, UserPlus, CalendarPlus, AlertCircle, Clock,
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Props for the NavItem component.
 *
 * @property {NavigationItem & { hasAccess?: boolean; isActive?: boolean }} item - Navigation item with access and active state
 * @property {number} [depth=0] - Nesting depth for visual indentation
 * @property {() => void} [onClick] - Optional callback when item is clicked
 */
interface NavItemProps {
  item: NavigationItem & { hasAccess?: boolean; isActive?: boolean }
  depth?: number
  onClick?: () => void
}

/**
 * Navigation item component with support for nested children.
 *
 * Renders a single navigation link with:
 * - Icon and label
 * - Active state highlighting
 * - Access control (disabled if no access)
 * - Badge indicators (counts, alerts)
 * - Expandable/collapsible children
 * - Visual depth indication through indentation
 *
 * Features:
 * - Hierarchical navigation with expand/collapse
 * - Visual feedback for active routes
 * - Badge support with color variants (error, warning, success)
 * - Accessibility with ARIA attributes
 * - Keyboard navigation support
 * - Dark mode support
 * - Smooth animations
 *
 * @param props - Component props
 * @param props.item - Navigation item data including path, icon, name, and children
 * @param props.depth - Nesting level for indentation (0 = top level)
 * @param props.onClick - Callback when navigation occurs
 * @returns JSX element representing the navigation item
 *
 * @example
 * ```tsx
 * <NavItem
 *   item={{
 *     id: 'students',
 *     name: 'Students',
 *     path: '/students',
 *     icon: 'Users',
 *     isActive: true,
 *     hasAccess: true
 *   }}
 *   depth={0}
 *   onClick={() => console.log('Navigated')}
 * />
 * ```
 */
const NavItem = memo(({ item, depth = 0, onClick }: NavItemProps) => {
  const [expanded, setExpanded] = useState(false)
  const Icon = iconMap[item.icon] || Home
  const hasChildren = item.children && item.children.length > 0

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!item.hasAccess) {
      e.preventDefault()
      return
    }

    if (hasChildren) {
      e.preventDefault()
      setExpanded(!expanded)
    }

    onClick?.()
  }, [item.hasAccess, hasChildren, expanded, onClick])

  const paddingLeft = depth === 0 ? 'pl-3' : depth === 1 ? 'pl-8' : 'pl-12'

  return (
    <>
      <Link
        to={item.path}
        onClick={handleClick}
        className={`
          group flex items-center px-2 py-2.5 text-sm font-medium rounded-md
          transition-all duration-200 ease-in-out
          ${paddingLeft}
          ${item.isActive
            ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          }
          ${!item.hasAccess ? 'opacity-50 cursor-not-allowed' : ''}
          hover:shadow-sm
          active:scale-[0.98]
          motion-reduce:transition-none motion-reduce:transform-none
        `}
        data-testid={item.dataTestId}
        aria-label={`${item.name}${item.isActive ? ' (current page)' : ''}`}
        aria-disabled={!item.hasAccess}
        aria-current={item.isActive ? 'page' : undefined}
        aria-expanded={hasChildren ? expanded : undefined}
      >
        <Icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
        <span className="flex-1 truncate">{item.name}</span>

        {item.badge && (
          <span
            className={`
              ml-2 px-2 py-0.5 text-xs font-medium rounded-full
              ${item.badgeVariant === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200' :
                item.badgeVariant === 'warning' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200' :
                item.badgeVariant === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' :
                'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}
            `}
          >
            {item.badge}
          </span>
        )}

        {hasChildren && (
          <span className="ml-2">
            {expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </span>
        )}
      </Link>

      {hasChildren && expanded && (
        <div className="mt-1 space-y-1">
          {item.children?.map((child) => (
            <NavItem
              key={child.id}
              item={child}
              depth={depth + 1}
              onClick={onClick}
            />
          ))}
        </div>
      )}
    </>
  )
})

NavItem.displayName = 'NavItem'

// ============================================================================
// SIDEBAR SECTION COMPONENT
// ============================================================================

/**
 * Props for the SidebarSection component.
 *
 * @property {NavigationSection} section - Section configuration with title and navigation items
 * @property {() => void} [onItemClick] - Optional callback when any item in section is clicked
 */
interface SidebarSectionProps {
  section: NavigationSection
  onItemClick?: () => void
}

/**
 * Sidebar section component for grouping related navigation items.
 *
 * Groups navigation items under a common section heading with:
 * - Section title header
 * - Optional collapse/expand functionality
 * - Role-based access filtering
 * - Active route highlighting
 * - Automatic hiding if no accessible items
 *
 * Features:
 * - Collapsible sections to manage navigation density
 * - Automatic filtering based on user permissions
 * - Active state management for items
 * - Smooth expand/collapse animations
 * - Accessible section headers
 *
 * @param props - Component props
 * @param props.section - Section configuration including title, items, and collapse settings
 * @param props.onItemClick - Callback when any navigation item is clicked
 * @returns JSX element representing the navigation section, or null if no accessible items
 *
 * @example
 * ```tsx
 * <SidebarSection
 *   section={{
 *     title: 'Clinical',
 *     items: [...],
 *     collapsible: true,
 *     defaultCollapsed: false
 *   }}
 *   onItemClick={() => setMobileMenuOpen(false)}
 * />
 * ```
 */
const SidebarSection = memo(({ section, onItemClick }: SidebarSectionProps) => {
  const { user } = useAuthContext()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(section.defaultCollapsed || false)

  // Filter and mark active items
  const filteredItems = useMemo(() => {
    const filtered = filterNavigationItems(section.items, user)
    return markActiveNavigationItems(filtered, location.pathname)
  }, [section.items, user, location.pathname])

  // Check if user has access to any item in this section
  const hasAccessToSection = filteredItems.some(item => item.hasAccess)

  if (!hasAccessToSection) {
    return null
  }

  const toggleCollapsed = useCallback(() => {
    if (section.collapsible) {
      setCollapsed(!collapsed)
    }
  }, [section.collapsible, collapsed])

  return (
    <div className="mb-4">
      {section.title && (
        <button
          type="button"
          onClick={toggleCollapsed}
          className={`
            w-full flex items-center justify-between px-3 py-2 text-xs font-semibold
            text-gray-500 dark:text-gray-400 uppercase tracking-wider
            ${section.collapsible ? 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-300' : 'cursor-default'}
            transition-colors duration-200
          `}
          disabled={!section.collapsible}
          aria-expanded={section.collapsible ? !collapsed : undefined}
        >
          <span>{section.title}</span>
          {section.collapsible && (
            collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )
          )}
        </button>
      )}

      {!collapsed && (
        <nav className="space-y-1 mt-1" role="navigation" aria-label={section.title}>
          {filteredItems.map((item) => (
            <NavItem key={item.id} item={item} onClick={onItemClick} />
          ))}
        </nav>
      )}
    </div>
  )
})

SidebarSection.displayName = 'SidebarSection'

// ============================================================================
// MAIN SIDEBAR COMPONENT
// ============================================================================

/**
 * Props for the Sidebar component.
 *
 * @property {string} [className] - Optional CSS classes for the sidebar container
 * @property {() => void} [onNavigate] - Optional callback when navigation occurs
 */
interface SidebarProps {
  className?: string
  onNavigate?: () => void
}

/**
 * Main application sidebar component.
 *
 * Provides comprehensive navigation for all 21 domains in the application:
 * - Clinical: Students, Health Records, Medications, Appointments
 * - Operations: Billing, Inventory, Purchasing, Vendors
 * - Communication: Messages, Documents, Reports, Incidents
 * - Security & Compliance: Permissions, Roles, Audits
 * - System: Settings, Integrations
 *
 * Layout Structure:
 * - Application logo and branding at top
 * - Quick Actions grid for common tasks
 * - Categorized navigation sections
 * - Recent items footer
 *
 * Features:
 * - Role-based access control for all navigation items
 * - Active route highlighting across nested items
 * - Collapsible navigation sections
 * - Quick action buttons for common workflows
 * - Recent items tracking (max 5)
 * - Icon-based visual hierarchy
 * - Badge indicators for alerts and counts
 * - Responsive design (desktop sidebar, mobile overlay)
 * - Dark mode support
 * - Smooth animations and transitions
 * - Keyboard navigation support
 * - ARIA labels for accessibility
 *
 * @param props - Component props
 * @param props.className - Optional CSS classes for styling
 * @param props.onNavigate - Callback triggered on navigation (e.g., to close mobile menu)
 * @returns JSX element representing the sidebar navigation, or null if collapsed
 *
 * @example
 * ```tsx
 * // Desktop sidebar
 * <Sidebar className="flex-1 h-full" />
 * ```
 *
 * @example
 * ```tsx
 * // Mobile sidebar with close on navigate
 * <Sidebar
 *   className="flex-1 h-full overflow-y-auto"
 *   onNavigate={() => setMobileMenuOpen(false)}
 * />
 * ```
 */
export const Sidebar = memo(({ className = '', onNavigate }: SidebarProps) => {
  const { user } = useAuthContext()
  const { recentItems, clearRecentItems, sidebarCollapsed } = useNavigation()
  const location = useLocation()

  // Filter recent items
  const filteredRecentItems = useMemo(() => {
    const filtered = filterNavigationItems(recentItems, user)
    return markActiveNavigationItems(filtered, location.pathname)
  }, [recentItems, user, location.pathname])

  // Filter quick access items
  const filteredQuickAccess = useMemo(() => {
    return QUICK_ACCESS_ITEMS.filter(item => {
      if (!item.roles || item.roles.length === 0) return true
      return user?.role && item.roles.includes(user.role)
    })
  }, [user])

  if (sidebarCollapsed) {
    return null
  }

  return (
    <aside
      className={`
        flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200
        dark:border-gray-700 overflow-y-auto
        ${className}
      `}
      aria-label="Main navigation sidebar"
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="text-xl font-bold text-primary-600 dark:text-primary-400">
            White Cross
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {filteredQuickAccess.length > 0 && (
        <div className="px-3 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 mb-2">
            Quick Actions
          </div>
          <div className="grid grid-cols-2 gap-2">
            {filteredQuickAccess.map((item) => {
              const Icon = iconMap[item.icon] || Home
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={onNavigate}
                  className="
                    flex flex-col items-center justify-center p-2 rounded-md
                    bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700
                    transition-all duration-200 ease-in-out
                    hover:shadow-md active:scale-95
                    motion-reduce:transition-none motion-reduce:transform-none
                  "
                  title={item.description}
                >
                  <Icon className="h-5 w-5 text-gray-600 dark:text-gray-300 mb-1" />
                  <span className="text-xs text-gray-700 dark:text-gray-300 text-center">
                    {item.name}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Main Navigation Sections */}
      <div className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {NAVIGATION_SECTIONS.map((section) => (
          <SidebarSection
            key={section.title}
            section={section}
            onItemClick={onNavigate}
          />
        ))}
      </div>

      {/* Recent Items */}
      {filteredRecentItems.length > 0 && (
        <div className="px-3 py-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Recent
            </span>
            <button
              onClick={clearRecentItems}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              title="Clear recent items"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
          <nav className="space-y-1" role="navigation" aria-label="Recent items">
            {filteredRecentItems.slice(0, 5).map((item) => {
              const Icon = iconMap[item.icon] || Clock
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={onNavigate}
                  className="
                    flex items-center px-3 py-2 text-sm rounded-md
                    text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800
                    transition-colors duration-200
                  "
                >
                  <Icon className="h-4 w-4 mr-2" />
                  <span className="truncate">{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </aside>
  )
})

Sidebar.displayName = 'Sidebar'

export default Sidebar
