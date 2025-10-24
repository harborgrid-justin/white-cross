/**
 * WF-COMP-NAV-001 | NavigationContext.tsx - Navigation State Management
 * Purpose: Centralized navigation state management for the application
 * Dependencies: react, react-router-dom, ../types/navigation
 * Features: Current page tracking, breadcrumbs, history, dark mode, mobile menu state
 * Last Updated: 2025-10-24
 * Agent: NAV7L5 - React Component Architect
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { BreadcrumbItem, NavigationHistoryEntry, NavigationItem } from '../types/navigation'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface NavigationContextValue {
  // Current state
  currentPath: string
  previousPath: string | null
  breadcrumbs: BreadcrumbItem[]

  // Navigation history
  history: NavigationHistoryEntry[]
  canGoBack: boolean
  canGoForward: boolean

  // UI state
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  mobileMenuOpen: boolean
  darkMode: boolean
  searchOpen: boolean
  notificationOpen: boolean

  // Recent items
  recentItems: NavigationItem[]

  // Actions
  setSidebarOpen: (open: boolean) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setMobileMenuOpen: (open: boolean) => void
  setDarkMode: (enabled: boolean) => void
  setSearchOpen: (open: boolean) => void
  setNotificationOpen: (open: boolean) => void
  addRecentItem: (item: NavigationItem) => void
  clearRecentItems: () => void
  goBack: () => void
  goForward: () => void
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void
}

interface NavigationProviderProps {
  children: ReactNode
}

// ============================================================================
// CONTEXT CREATION
// ============================================================================

const NavigationContext = createContext<NavigationContextValue | undefined>(undefined)

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

export function NavigationProvider({ children }: NavigationProviderProps) {
  const location = useLocation()
  const navigate = useNavigate()

  // Core navigation state
  const [currentPath, setCurrentPath] = useState(location.pathname)
  const [previousPath, setPreviousPath] = useState<string | null>(null)
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([])
  const [history, setHistory] = useState<NavigationHistoryEntry[]>([])

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [darkMode, setDarkModeState] = useState(() => {
    // Initialize from localStorage or system preference
    const stored = localStorage.getItem('darkMode')
    if (stored !== null) {
      return stored === 'true'
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [searchOpen, setSearchOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)

  // Recent items (max 10)
  const [recentItems, setRecentItems] = useState<NavigationItem[]>(() => {
    const stored = localStorage.getItem('recentNavItems')
    return stored ? JSON.parse(stored) : []
  })

  // Update dark mode and persist
  const setDarkMode = useCallback((enabled: boolean) => {
    setDarkModeState(enabled)
    localStorage.setItem('darkMode', String(enabled))

    // Update document class for Tailwind dark mode
    if (enabled) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  // Initialize dark mode on mount
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Track navigation changes
  useEffect(() => {
    setPreviousPath(currentPath)
    setCurrentPath(location.pathname)

    // Add to history
    const newEntry: NavigationHistoryEntry = {
      path: location.pathname,
      timestamp: Date.now(),
      state: location.state,
      scrollPosition: {
        x: window.scrollX,
        y: window.scrollY,
      },
    }

    setHistory((prev) => {
      const updated = [...prev, newEntry]
      // Keep last 50 entries
      return updated.slice(-50)
    })

    // Auto-generate breadcrumbs from path
    const pathSegments = location.pathname.split('/').filter(Boolean)
    const generatedBreadcrumbs: BreadcrumbItem[] = [
      {
        label: 'Home',
        path: '/dashboard',
        icon: 'Home',
        isActive: pathSegments.length === 0,
        isClickable: true,
      },
    ]

    let cumulativePath = ''
    pathSegments.forEach((segment, index) => {
      cumulativePath += `/${segment}`
      const isLast = index === pathSegments.length - 1

      generatedBreadcrumbs.push({
        label: segment
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        path: cumulativePath,
        isActive: isLast,
        isClickable: !isLast,
      })
    })

    setBreadcrumbs(generatedBreadcrumbs)

    // Close mobile menu on navigation
    setMobileMenuOpen(false)
  }, [location.pathname, location.state, currentPath])

  // Add recent item
  const addRecentItem = useCallback((item: NavigationItem) => {
    setRecentItems((prev) => {
      // Remove if already exists
      const filtered = prev.filter((i) => i.id !== item.id)
      // Add to front
      const updated = [item, ...filtered].slice(0, 10)
      // Persist to localStorage
      localStorage.setItem('recentNavItems', JSON.stringify(updated))
      return updated
    })
  }, [])

  // Clear recent items
  const clearRecentItems = useCallback(() => {
    setRecentItems([])
    localStorage.removeItem('recentNavItems')
  }, [])

  // Navigation helpers
  const canGoBack = history.length > 1
  const canGoForward = false // Browser forward not tracked in this implementation

  const goBack = useCallback(() => {
    if (canGoBack) {
      navigate(-1)
    }
  }, [canGoBack, navigate])

  const goForward = useCallback(() => {
    // Not implemented in this version
    navigate(1)
  }, [navigate])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setSearchOpen(false)
      setNotificationOpen(false)
    }

    if (searchOpen || notificationOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [searchOpen, notificationOpen])

  // Context value
  const value = useMemo<NavigationContextValue>(
    () => ({
      currentPath,
      previousPath,
      breadcrumbs,
      history,
      canGoBack,
      canGoForward,
      sidebarOpen,
      sidebarCollapsed,
      mobileMenuOpen,
      darkMode,
      searchOpen,
      notificationOpen,
      recentItems,
      setSidebarOpen,
      setSidebarCollapsed,
      setMobileMenuOpen,
      setDarkMode,
      setSearchOpen,
      setNotificationOpen,
      addRecentItem,
      clearRecentItems,
      goBack,
      goForward,
      setBreadcrumbs,
    }),
    [
      currentPath,
      previousPath,
      breadcrumbs,
      history,
      canGoBack,
      canGoForward,
      sidebarOpen,
      sidebarCollapsed,
      mobileMenuOpen,
      darkMode,
      searchOpen,
      notificationOpen,
      recentItems,
      addRecentItem,
      clearRecentItems,
      goBack,
      goForward,
      setDarkMode,
    ]
  )

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  )
}

// ============================================================================
// CUSTOM HOOK
// ============================================================================

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}

// Export context for advanced use cases
export { NavigationContext }
