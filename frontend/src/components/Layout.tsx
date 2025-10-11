import React, { useState, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Users,
  Pill,
  Calendar,
  FileText,
  AlertTriangle,
  Phone,
  Package,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  Home,
  MessageSquare,
  Shield
} from 'lucide-react'
import { useAuthContext } from '../contexts/AuthContext'
import { PROTECTED_ROUTES } from '../constants/routes'
import { NavigationItem } from '../types/navigation'
import { filterNavigationItems, markActiveNavigationItems, getDisabledReasonMessage } from '../utils/navigationUtils'
import Breadcrumbs from './Breadcrumbs'

// Icon mapping for navigation items
const iconMap: Record<string, any> = {
  Home,
  Users,
  Pill,
  Calendar,
  FileText,
  AlertTriangle,
  Phone,
  MessageSquare,
  Package,
  BarChart3,
  Settings,
  Shield,
}

// Navigation configuration with roles and permissions
const navigationConfig: NavigationItem[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    path: PROTECTED_ROUTES.DASHBOARD,
    icon: 'Home',
    roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'READ_ONLY', 'COUNSELOR'],
    order: 1,
  },
  {
    id: 'students',
    name: 'Students',
    path: PROTECTED_ROUTES.STUDENTS,
    icon: 'Users',
    roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'READ_ONLY', 'COUNSELOR'],
    permissions: [{ resource: 'students', action: 'read' }],
    dataTestId: 'students-nav',
    order: 2,
  },
  {
    id: 'medications',
    name: 'Medications',
    path: PROTECTED_ROUTES.MEDICATIONS,
    icon: 'Pill',
    roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'READ_ONLY'],
    permissions: [{ resource: 'medications', action: 'read' }],
    order: 3,
  },
  {
    id: 'appointments',
    name: 'Appointments',
    path: PROTECTED_ROUTES.APPOINTMENTS,
    icon: 'Calendar',
    roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'READ_ONLY'],
    permissions: [{ resource: 'appointments', action: 'read' }],
    order: 4,
  },
  {
    id: 'health-records',
    name: 'Health Records',
    path: PROTECTED_ROUTES.HEALTH_RECORDS,
    icon: 'FileText',
    roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'READ_ONLY', 'COUNSELOR'],
    permissions: [{ resource: 'health_records', action: 'read' }],
    order: 5,
  },
  {
    id: 'incident-reports',
    name: 'Incident Reports',
    path: PROTECTED_ROUTES.INCIDENT_REPORTS,
    icon: 'AlertTriangle',
    roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'READ_ONLY', 'COUNSELOR'],
    permissions: [{ resource: 'incident_reports', action: 'read' }],
    order: 6,
  },
  {
    id: 'emergency-contacts',
    name: 'Emergency Contacts',
    path: PROTECTED_ROUTES.EMERGENCY_CONTACTS,
    icon: 'Phone',
    roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
    permissions: [{ resource: 'emergency_contacts', action: 'read' }],
    order: 7,
  },
  {
    id: 'communication',
    name: 'Communication',
    path: PROTECTED_ROUTES.COMMUNICATION,
    icon: 'MessageSquare',
    roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
    permissions: [{ resource: 'communication', action: 'read' }],
    order: 8,
  },
  {
    id: 'inventory',
    name: 'Inventory',
    path: PROTECTED_ROUTES.INVENTORY,
    icon: 'Package',
    roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
    permissions: [{ resource: 'inventory', action: 'read' }],
    order: 9,
  },
  {
    id: 'reports',
    name: 'Reports',
    path: PROTECTED_ROUTES.REPORTS,
    icon: 'BarChart3',
    roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'READ_ONLY'],
    permissions: [{ resource: 'reports', action: 'read' }],
    order: 10,
  },
  {
    id: 'administration',
    name: 'Administration',
    path: PROTECTED_ROUTES.ADMIN,
    icon: 'Settings',
    roles: ['ADMIN'],
    permissions: [{ resource: 'system', action: 'manage' }],
    dataTestId: 'admin-panel-link',
    order: 11,
  },
]

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuthContext()
  const location = useLocation()

  // Filter and mark active navigation items based on user permissions
  const filteredNavigation = useMemo(() => {
    const filtered = filterNavigationItems(navigationConfig, user)
    return markActiveNavigationItems(filtered, location.pathname)
  }, [user, location.pathname])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>
      {/* Mobile menu */}
      <div className={`fixed inset-0 flex z-40 lg:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ease-linear duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setSidebarOpen(false)} />
        
        <div className={`relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white transform transition ease-in-out duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div className="flex-shrink-0 flex items-center px-4">
            <div className="text-xl font-bold text-primary-600">White Cross</div>
          </div>
          
          <div className="mt-5 flex-1 h-0 overflow-y-auto">
            <nav className="px-2 space-y-1" role="navigation" aria-label="Main navigation">
              {filteredNavigation.map((item) => {
                const Icon = iconMap[item.icon]
                const tooltipMessage = !item.hasAccess
                  ? getDisabledReasonMessage(item.noAccessReason, item)
                  : item.disabledMessage

                return (
                  <div key={item.id} className="relative group/nav">
                    <Link
                      to={item.path}
                      className={`
                        group flex items-center px-2 py-2 text-sm font-medium rounded-md
                        transition-colors duration-150
                        ${item.isActive
                          ? 'bg-primary-100 text-primary-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }
                        ${!item.hasAccess ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                      onClick={(e) => {
                        if (!item.hasAccess) {
                          e.preventDefault()
                        } else {
                          setSidebarOpen(false)
                        }
                      }}
                      data-cy={item.dataTestId}
                      aria-label={`${item.name}${item.isActive ? ' (current page)' : ''}`}
                      aria-disabled={!item.hasAccess}
                      title={tooltipMessage}
                    >
                      <Icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (
                        <span
                          className={`
                            ml-2 px-2 py-0.5 text-xs font-medium rounded-full
                            ${item.badgeVariant === 'error' ? 'bg-red-100 text-red-700' :
                              item.badgeVariant === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                              item.badgeVariant === 'success' ? 'bg-green-100 text-green-700' :
                              'bg-gray-100 text-gray-700'}
                          `}
                          aria-label={`${item.badge} notifications`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>

                    {/* Tooltip for disabled items */}
                    {!item.hasAccess && tooltipMessage && (
                      <div className="
                        absolute left-full ml-2 top-1/2 -translate-y-1/2
                        hidden group-hover/nav:block
                        bg-gray-900 text-white text-xs rounded py-1 px-2
                        whitespace-nowrap z-50
                        pointer-events-none
                      ">
                        {tooltipMessage}
                        <div className="absolute right-full top-1/2 -translate-y-1/2
                          border-4 border-transparent border-r-gray-900"
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-white pt-5 pb-4 overflow-y-auto border-r border-gray-200">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="text-xl font-bold text-primary-600">White Cross</div>
          </div>
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1" role="navigation" aria-label="Main navigation">
              {filteredNavigation.map((item) => {
                const Icon = iconMap[item.icon]
                const tooltipMessage = !item.hasAccess
                  ? getDisabledReasonMessage(item.noAccessReason, item)
                  : item.disabledMessage

                return (
                  <div key={item.id} className="relative group/nav">
                    <Link
                      to={item.path}
                      className={`
                        group flex items-center px-2 py-2 text-sm font-medium rounded-md
                        transition-colors duration-150
                        ${item.isActive
                          ? 'bg-primary-100 text-primary-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }
                        ${!item.hasAccess ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                      onClick={(e) => {
                        if (!item.hasAccess) {
                          e.preventDefault()
                        }
                      }}
                      data-cy={item.dataTestId}
                      aria-label={`${item.name}${item.isActive ? ' (current page)' : ''}`}
                      aria-disabled={!item.hasAccess}
                      aria-current={item.isActive ? 'page' : undefined}
                      title={tooltipMessage}
                      tabIndex={!item.hasAccess ? -1 : 0}
                    >
                      <Icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (
                        <span
                          className={`
                            ml-2 px-2 py-0.5 text-xs font-medium rounded-full
                            ${item.badgeVariant === 'error' ? 'bg-red-100 text-red-700' :
                              item.badgeVariant === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                              item.badgeVariant === 'success' ? 'bg-green-100 text-green-700' :
                              'bg-gray-100 text-gray-700'}
                          `}
                          aria-label={`${item.badge} notifications`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>

                    {/* Tooltip for disabled items on desktop */}
                    {!item.hasAccess && tooltipMessage && (
                      <div className="
                        absolute left-full ml-2 top-1/2 -translate-y-1/2
                        hidden group-hover/nav:block
                        bg-gray-900 text-white text-xs rounded py-1 px-2
                        whitespace-nowrap z-50
                        pointer-events-none
                      ">
                        {tooltipMessage}
                        <div className="absolute right-full top-1/2 -translate-y-1/2
                          border-4 border-transparent border-r-gray-900"
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col">
        {/* Top navigation */}
        <header className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow border-b border-gray-200" role="banner">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            data-cy="mobile-menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between items-center">
            <nav className="flex-1" role="navigation" aria-label="Secondary navigation">
              <h2
                className="text-lg font-semibold text-gray-900 capitalize"
                data-cy="dashboard-title"
              >
                {location.pathname.split('/')[1] || 'Dashboard'}
              </h2>
            </nav>

            <div className="ml-4 flex items-center space-x-4" data-cy="user-menu">
              <div className="text-sm text-gray-700 user-role">
                <span className="font-medium" data-cy="user-name">{user?.firstName} {user?.lastName}</span>
                <span className="text-gray-500 ml-2" data-cy="user-role-badge">({user?.role})</span>
              </div>
              <button
                onClick={logout}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                data-cy="logout-button"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main id="main" className="flex-1" role="main">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
