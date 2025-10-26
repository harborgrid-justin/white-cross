/**
 * WF-COMP-NAV-001 | NavigationContext.tsx - Navigation State Management
 *
 * Provides centralized navigation state management for the healthcare platform.
 * Manages routing history, breadcrumbs, UI state (sidebar, dark mode), and
 * recent navigation items for improved user experience.
 *
 * @module contexts/NavigationContext
 *
 * @remarks
 * **Features**:
 * - Navigation History: Track user navigation with timestamps and scroll positions
 * - Breadcrumbs: Auto-generated breadcrumbs from route paths
 * - UI State: Sidebar, dark mode, search, mobile menu states
 * - Recent Items: Track frequently accessed pages (max 10, persisted to localStorage)
 * - Dark Mode: System preference detection and localStorage persistence
 *
 * **Integration**:
 * - React Router: Syncs with browser navigation
 * - Local Storage: Persists dark mode preference and recent items
 * - Tailwind CSS: Dark mode class management
 *
 * **Performance**: Uses React.useMemo to optimize context value recalculation
 *
 * Dependencies: react, react-router-dom, ../types/navigation
 * Last Updated: 2025-10-26
 * Agent: JSDoc TypeScript Architect
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { BreadcrumbItem, NavigationHistoryEntry, NavigationItem } from '../types/navigation'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

/**
 * Navigation context value containing all navigation state and actions.
 *
 * @interface NavigationContextValue
 *
 * @property {string} currentPath - Current route path (e.g., '/students/123')
 * @property {string | null} previousPath - Previous route path for back navigation
 * @property {BreadcrumbItem[]} breadcrumbs - Auto-generated breadcrumb trail
 * @property {NavigationHistoryEntry[]} history - Navigation history (last 50 entries)
 * @property {boolean} canGoBack - True if navigation history allows going back
 * @property {boolean} canGoForward - True if forward navigation is possible (not implemented)
 * @property {boolean} sidebarOpen - Desktop sidebar visibility state
 * @property {boolean} sidebarCollapsed - Desktop sidebar collapsed state (icons only)
 * @property {boolean} mobileMenuOpen - Mobile menu visibility state
 * @property {boolean} darkMode - Dark mode enabled state
 * @property {boolean} searchOpen - Global search dropdown state
 * @property {boolean} notificationOpen - Notification dropdown state
 * @property {NavigationItem[]} recentItems - Recently accessed pages (max 10)
 * @property {Function} setSidebarOpen - Toggle sidebar visibility
 * @property {Function} setSidebarCollapsed - Toggle sidebar collapsed state
 * @property {Function} setMobileMenuOpen - Toggle mobile menu visibility
 * @property {Function} setDarkMode - Set dark mode state (persists to localStorage)
 * @property {Function} setSearchOpen - Toggle search dropdown
 * @property {Function} setNotificationOpen - Toggle notification dropdown
 * @property {Function} addRecentItem - Add item to recent navigation history
 * @property {Function} clearRecentItems - Clear all recent items
 * @property {Function} goBack - Navigate to previous page
 * @property {Function} goForward - Navigate forward (browser forward)
 * @property {Function} setBreadcrumbs - Manually override breadcrumbs
 */
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

/**
 * Props for NavigationProvider component.
 *
 * @interface NavigationProviderProps
 * @property {ReactNode} children - Child components to wrap with navigation context
 */
interface NavigationProviderProps {
  children: ReactNode
}

// ============================================================================
// CONTEXT CREATION
// ============================================================================

/**
 * React context for navigation state.
 * @internal
 */
const NavigationContext = createContext<NavigationContextValue | undefined>(undefined)

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

/**
 * Navigation Provider Component
 *
 * Wraps the application to provide centralized navigation state management.
 * Automatically syncs with React Router and manages UI state persistence.
 *
 * @param {NavigationProviderProps} props - Component props
 * @returns {JSX.Element} Provider component
 *
 * @remarks
 * **Auto-Syncing Features**:
 * - Tracks all route changes via React Router's useLocation hook
 * - Auto-generates breadcrumbs from route paths
 * - Persists dark mode preference to localStorage
 * - Persists recent items (max 10) to localStorage
 * - Closes mobile menu automatically on navigation
 * - Applies dark mode class to document element for Tailwind
 *
 * **State Persistence**:
 * - `darkMode`: localStorage key 'darkMode'
 * - `recentItems`: localStorage key 'recentNavItems'
 *
 * **Performance Optimizations**:
 * - Memoized context value to prevent unnecessary re-renders
 * - Callback functions are memoized with useCallback
 * - History limited to last 50 entries
 *
 * @example
 * ```typescript
 * import { NavigationProvider } from '@/contexts/NavigationContext';
 *
 * function App() {
 *   return (
 *     <BrowserRouter>
 *       <NavigationProvider>
 *         <AppContent />
 *       </NavigationProvider>
 *     </BrowserRouter>
 *   );
 * }
 * ```
 */
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

  /**
   * Sets dark mode state and persists to localStorage.
   *
   * @param {boolean} enabled - True to enable dark mode, false to disable
   *
   * @remarks
   * This function:
   * 1. Updates local state
   * 2. Persists preference to localStorage
   * 3. Adds/removes 'dark' class on document.documentElement for Tailwind CSS
   *
   * The dark mode state is initialized from localStorage on mount, falling back
   * to system preference if no saved value exists.
   */
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

  /**
   * Adds an item to the recent navigation history.
   *
   * @param {NavigationItem} item - Navigation item to add to recent history
   *
   * @remarks
   * **Behavior**:
   * - Removes existing item with same ID to avoid duplicates
   * - Adds new item to the front of the list
   * - Limits to 10 most recent items
   * - Automatically persists to localStorage
   *
   * **Use Cases**:
   * - Track visited student profiles
   * - Quick access to recently viewed medication records
   * - Navigation shortcuts to frequent pages
   *
   * @example
   * ```typescript
   * const { addRecentItem } = useNavigation();
   *
   * // After viewing a student profile
   * addRecentItem({
   *   id: 'student-123',
   *   label: 'John Doe',
   *   path: '/students/123',
   *   icon: 'User',
   *   type: 'student'
   * });
   * ```
   */
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

  /**
   * Clears all recent navigation items.
   *
   * @remarks
   * Removes all items from the recent history and deletes the
   * localStorage entry. Useful for privacy or testing purposes.
   *
   * @example
   * ```typescript
   * const { clearRecentItems } = useNavigation();
   *
   * // Clear history for privacy
   * clearRecentItems();
   * ```
   */
  const clearRecentItems = useCallback(() => {
    setRecentItems([])
    localStorage.removeItem('recentNavItems')
  }, [])

  // Navigation helpers
  const canGoBack = history.length > 1
  const canGoForward = false // Browser forward not tracked in this implementation

  /**
   * Navigates to the previous page in history.
   *
   * @remarks
   * Uses React Router's navigate(-1) to go back. Only triggers if
   * canGoBack is true (history has more than 1 entry).
   */
  const goBack = useCallback(() => {
    if (canGoBack) {
      navigate(-1)
    }
  }, [canGoBack, navigate])

  /**
   * Navigates forward in browser history.
   *
   * @remarks
   * Uses React Router's navigate(1) to go forward. Note that forward
   * navigation tracking is not implemented in this version, so canGoForward
   * is always false.
   */
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

/**
 * Hook to access navigation context.
 *
 * Provides access to navigation state and UI control functions.
 * Must be used within a component wrapped by NavigationProvider.
 *
 * @returns {NavigationContextValue} Navigation context value
 * @throws {Error} If used outside of NavigationProvider
 *
 * @remarks
 * **Common Use Cases**:
 * - Access current path and breadcrumbs for UI rendering
 * - Control sidebar and mobile menu state
 * - Toggle dark mode
 * - Add items to recent navigation history
 * - Access navigation history for back/forward buttons
 *
 * **Performance**: The returned context value is memoized, so destructuring
 * specific properties is preferred to using the entire context object.
 *
 * @example
 * ```typescript
 * function Header() {
 *   const {
 *     darkMode,
 *     setDarkMode,
 *     breadcrumbs,
 *     sidebarOpen,
 *     setSidebarOpen
 *   } = useNavigation();
 *
 *   return (
 *     <header>
 *       <button onClick={() => setSidebarOpen(!sidebarOpen)}>
 *         Toggle Sidebar
 *       </button>
 *       <button onClick={() => setDarkMode(!darkMode)}>
 *         Toggle Dark Mode
 *       </button>
 *       <Breadcrumbs items={breadcrumbs} />
 *     </header>
 *   );
 * }
 * ```
 */
export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}

/**
 * Export navigation context for advanced use cases.
 * @see {@link useNavigation} for standard usage
 */
export { NavigationContext }
