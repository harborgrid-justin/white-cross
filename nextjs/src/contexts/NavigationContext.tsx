'use client';

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';

/**
 * Breadcrumb item interface for navigation trail
 */
export interface BreadcrumbItem {
  /** Display label for the breadcrumb */
  label: string;
  /** URL path for the breadcrumb link */
  href: string;
  /** Whether this is the current/active breadcrumb */
  isActive?: boolean;
}

/**
 * Navigation history entry for tracking user navigation
 */
export interface NavigationHistoryEntry {
  /** Route path */
  path: string;
  /** Timestamp when route was visited */
  timestamp: number;
  /** Optional route title */
  title?: string;
}

/**
 * Navigation state interface
 */
export interface NavigationState {
  /** Desktop sidebar open/closed state */
  isSidebarOpen: boolean;
  /** Mobile sidebar open/closed state */
  isMobileSidebarOpen: boolean;
  /** Currently active route path */
  activeRoute: string;
  /** Current breadcrumb trail */
  breadcrumbs: BreadcrumbItem[];
  /** Navigation history (last 50 entries) */
  navigationHistory: NavigationHistoryEntry[];
  /** Sidebar collapsed state (mini sidebar) */
  isSidebarCollapsed: boolean;
}

/**
 * Navigation context actions interface
 */
export interface NavigationActions {
  /** Toggle desktop sidebar open/closed */
  toggleSidebar: () => void;
  /** Set desktop sidebar open/closed explicitly */
  setSidebarOpen: (open: boolean) => void;
  /** Toggle mobile sidebar open/closed */
  toggleMobileSidebar: () => void;
  /** Set mobile sidebar open/closed explicitly */
  setMobileSidebarOpen: (open: boolean) => void;
  /** Set the active route */
  setActiveRoute: (route: string) => void;
  /** Set breadcrumbs for the current view */
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
  /** Add entry to navigation history */
  addToHistory: (entry: Omit<NavigationHistoryEntry, 'timestamp'>) => void;
  /** Clear navigation history */
  clearHistory: () => void;
  /** Toggle sidebar collapsed state (mini sidebar) */
  toggleSidebarCollapsed: () => void;
  /** Set sidebar collapsed state explicitly */
  setSidebarCollapsed: (collapsed: boolean) => void;
  /** Navigate back to previous route in history */
  navigateBack: () => NavigationHistoryEntry | null;
}

/**
 * Combined navigation context type
 */
export interface NavigationContextType extends NavigationState, NavigationActions {}

/**
 * Navigation context - provides navigation state and actions throughout the app
 */
const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

/**
 * Props for NavigationProvider component
 */
export interface NavigationProviderProps {
  /** Child components */
  children: React.ReactNode;
  /** Initial sidebar open state (default: true for desktop) */
  initialSidebarOpen?: boolean;
  /** Initial sidebar collapsed state (default: false) */
  initialSidebarCollapsed?: boolean;
  /** Maximum history entries to keep (default: 50) */
  maxHistoryEntries?: number;
  /** Enable localStorage persistence (default: true) */
  persistState?: boolean;
}

/**
 * Storage keys for state persistence
 */
const STORAGE_KEYS = {
  SIDEBAR_OPEN: 'navigation_sidebar_open',
  SIDEBAR_COLLAPSED: 'navigation_sidebar_collapsed',
  ACTIVE_ROUTE: 'navigation_active_route',
} as const;

/**
 * NavigationProvider - Provides navigation state and actions to the component tree
 *
 * @example
 * ```tsx
 * <NavigationProvider>
 *   <App />
 * </NavigationProvider>
 * ```
 */
export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
  initialSidebarOpen = true,
  initialSidebarCollapsed = false,
  maxHistoryEntries = 50,
  persistState = true,
}) => {
  // Initialize state from localStorage if persistence is enabled
  const getInitialSidebarOpen = useCallback((): boolean => {
    if (typeof window === 'undefined' || !persistState) {
      return initialSidebarOpen;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SIDEBAR_OPEN);
      return stored !== null ? stored === 'true' : initialSidebarOpen;
    } catch (error) {
      console.warn('Failed to read sidebar state from localStorage:', error);
      return initialSidebarOpen;
    }
  }, [initialSidebarOpen, persistState]);

  const getInitialSidebarCollapsed = useCallback((): boolean => {
    if (typeof window === 'undefined' || !persistState) {
      return initialSidebarCollapsed;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED);
      return stored !== null ? stored === 'true' : initialSidebarCollapsed;
    } catch (error) {
      console.warn('Failed to read sidebar collapsed state from localStorage:', error);
      return initialSidebarCollapsed;
    }
  }, [initialSidebarCollapsed, persistState]);

  const getInitialActiveRoute = useCallback((): string => {
    if (typeof window === 'undefined') {
      return '/';
    }

    if (persistState) {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_ROUTE);
        if (stored) return stored;
      } catch (error) {
        console.warn('Failed to read active route from localStorage:', error);
      }
    }

    return window.location.pathname;
  }, [persistState]);

  // State management
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(getInitialSidebarOpen);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [activeRoute, setActiveRouteState] = useState<string>(getInitialActiveRoute);
  const [breadcrumbs, setBreadcrumbsState] = useState<BreadcrumbItem[]>([]);
  const [navigationHistory, setNavigationHistory] = useState<NavigationHistoryEntry[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(getInitialSidebarCollapsed);

  // Persist sidebar state to localStorage
  useEffect(() => {
    if (!persistState || typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEYS.SIDEBAR_OPEN, String(isSidebarOpen));
    } catch (error) {
      console.warn('Failed to persist sidebar state:', error);
    }
  }, [isSidebarOpen, persistState]);

  // Persist sidebar collapsed state to localStorage
  useEffect(() => {
    if (!persistState || typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, String(isSidebarCollapsed));
    } catch (error) {
      console.warn('Failed to persist sidebar collapsed state:', error);
    }
  }, [isSidebarCollapsed, persistState]);

  // Persist active route to localStorage
  useEffect(() => {
    if (!persistState || typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ROUTE, activeRoute);
    } catch (error) {
      console.warn('Failed to persist active route:', error);
    }
  }, [activeRoute, persistState]);

  // Close mobile sidebar when switching to desktop view
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileSidebarOpen) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileSidebarOpen]);

  /**
   * Toggle desktop sidebar open/closed
   */
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  /**
   * Set desktop sidebar open/closed explicitly
   */
  const setSidebarOpen = useCallback((open: boolean) => {
    setIsSidebarOpen(open);
  }, []);

  /**
   * Toggle mobile sidebar open/closed
   */
  const toggleMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen((prev) => !prev);
  }, []);

  /**
   * Set mobile sidebar open/closed explicitly
   */
  const setMobileSidebarOpen = useCallback((open: boolean) => {
    setIsMobileSidebarOpen(open);
  }, []);

  /**
   * Set the active route and update navigation history
   */
  const setActiveRoute = useCallback((route: string) => {
    setActiveRouteState(route);

    // Add to history
    setNavigationHistory((prev) => {
      const newEntry: NavigationHistoryEntry = {
        path: route,
        timestamp: Date.now(),
      };

      // Avoid duplicate consecutive entries
      if (prev.length > 0 && prev[prev.length - 1].path === route) {
        return prev;
      }

      // Keep only maxHistoryEntries
      const updated = [...prev, newEntry];
      return updated.slice(-maxHistoryEntries);
    });
  }, [maxHistoryEntries]);

  /**
   * Set breadcrumbs for the current view
   */
  const setBreadcrumbs = useCallback((newBreadcrumbs: BreadcrumbItem[]) => {
    setBreadcrumbsState(newBreadcrumbs);
  }, []);

  /**
   * Add entry to navigation history
   */
  const addToHistory = useCallback((entry: Omit<NavigationHistoryEntry, 'timestamp'>) => {
    setNavigationHistory((prev) => {
      const newEntry: NavigationHistoryEntry = {
        ...entry,
        timestamp: Date.now(),
      };

      // Avoid duplicate consecutive entries
      if (prev.length > 0 && prev[prev.length - 1].path === entry.path) {
        return prev;
      }

      const updated = [...prev, newEntry];
      return updated.slice(-maxHistoryEntries);
    });
  }, [maxHistoryEntries]);

  /**
   * Clear navigation history
   */
  const clearHistory = useCallback(() => {
    setNavigationHistory([]);
  }, []);

  /**
   * Toggle sidebar collapsed state (mini sidebar)
   */
  const toggleSidebarCollapsed = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev);
  }, []);

  /**
   * Set sidebar collapsed state explicitly
   */
  const setSidebarCollapsed = useCallback((collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  }, []);

  /**
   * Navigate back to previous route in history
   * Returns the previous navigation entry or null if history is empty
   */
  const navigateBack = useCallback((): NavigationHistoryEntry | null => {
    if (navigationHistory.length <= 1) {
      return null;
    }

    // Get the previous entry (second to last)
    const previousEntry = navigationHistory[navigationHistory.length - 2];

    // Remove the current entry from history
    setNavigationHistory((prev) => prev.slice(0, -1));

    return previousEntry;
  }, [navigationHistory]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<NavigationContextType>(
    () => ({
      // State
      isSidebarOpen,
      isMobileSidebarOpen,
      activeRoute,
      breadcrumbs,
      navigationHistory,
      isSidebarCollapsed,
      // Actions
      toggleSidebar,
      setSidebarOpen,
      toggleMobileSidebar,
      setMobileSidebarOpen,
      setActiveRoute,
      setBreadcrumbs,
      addToHistory,
      clearHistory,
      toggleSidebarCollapsed,
      setSidebarCollapsed,
      navigateBack,
    }),
    [
      isSidebarOpen,
      isMobileSidebarOpen,
      activeRoute,
      breadcrumbs,
      navigationHistory,
      isSidebarCollapsed,
      toggleSidebar,
      setSidebarOpen,
      toggleMobileSidebar,
      setMobileSidebarOpen,
      setActiveRoute,
      setBreadcrumbs,
      addToHistory,
      clearHistory,
      toggleSidebarCollapsed,
      setSidebarCollapsed,
      navigateBack,
    ]
  );

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
};

/**
 * useNavigation hook - Access navigation state and actions
 *
 * @throws {Error} If used outside of NavigationProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isSidebarOpen, toggleSidebar, setActiveRoute } = useNavigation();
 *
 *   return (
 *     <button onClick={toggleSidebar}>
 *       Toggle Sidebar
 *     </button>
 *   );
 * }
 * ```
 */
export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);

  if (context === undefined) {
    throw new Error(
      'useNavigation must be used within a NavigationProvider. ' +
      'Wrap your component tree with <NavigationProvider> to use navigation features.'
    );
  }

  return context;
};

/**
 * NavigationErrorBoundary - Error boundary for navigation-related errors
 *
 * @example
 * ```tsx
 * <NavigationErrorBoundary fallback={<ErrorDisplay />}>
 *   <NavigationProvider>
 *     <App />
 *   </NavigationProvider>
 * </NavigationErrorBoundary>
 * ```
 */
export class NavigationErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('NavigationContext Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div role="alert" style={{ padding: '20px', color: 'red' }}>
          <h2>Navigation Error</h2>
          <p>{this.state.error?.message || 'An error occurred in the navigation system'}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Default export for convenience
export default NavigationContext;
