'use client';

/**
 * WF-COMP-NAV-011 | AppLayout.tsx - Main Application Layout Component
 * Purpose: Comprehensive application layout with navigation, sidebar, and all features
 * Dependencies: react, react-router-dom, all layout components, NavigationProvider
 * Features: Responsive, dark mode, role-based navigation, 21 domains
 * Last Updated: 2025-10-24
 * Agent: NAV7L5 - React Component Architect
 */

import React, { ReactNode, memo } from 'react'
import { NavigationProvider } from '../../contexts/NavigationContext'
import Navigation from './Navigation'
import Sidebar from './Sidebar'
import Footer from './Footer'
import SearchBar from './SearchBar'
import NotificationCenter from './NotificationCenter'

// ============================================================================
// MAIN APP LAYOUT COMPONENT
// ============================================================================

/**
 * Props for the AppLayout component.
 *
 * @property {ReactNode} children - Child components to be rendered within the main content area
 */
interface AppLayoutProps {
  children: ReactNode
}

/**
 * Main application layout component content.
 *
 * Provides the foundational structure for the entire application including:
 * - Top navigation bar with search, notifications, and user menu
 * - Responsive sidebar with navigation for all 21 domains
 * - Main content area with skip-to-content accessibility
 * - Footer with application information
 * - Global modals (search, notifications)
 *
 * Features:
 * - Responsive design with mobile overlay sidebar
 * - Dark mode support throughout
 * - Accessibility features (skip links, ARIA labels, keyboard navigation)
 * - Sticky navigation header
 * - Flexible main content area
 *
 * @param props - Component props
 * @param props.children - Content to render in the main content area
 * @returns JSX element representing the application layout
 *
 * @example
 * ```tsx
 * <AppLayoutContent>
 *   <DashboardPage />
 * </AppLayoutContent>
 * ```
 */
const AppLayoutContent = memo(({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="
          sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
          bg-primary-600 text-white px-4 py-2 rounded-md z-50
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        "
      >
        Skip to main content
      </a>

      {/* Top Navigation Bar */}
      <Navigation />

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div className="w-64 flex flex-col">
            <Sidebar className="flex-1 h-full" />
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        <MobileSidebar />

        {/* Main Content */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto focus:outline-none"
          role="main"
          tabIndex={-1}
        >
          <div className="min-h-full">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Global Modals */}
      <SearchBar />
      <NotificationCenter />
    </div>
  )
})

AppLayoutContent.displayName = 'AppLayoutContent'

// ============================================================================
// MOBILE SIDEBAR COMPONENT
// ============================================================================

/**
 * Mobile sidebar overlay component.
 *
 * Displays a slide-out sidebar navigation overlay on mobile devices (< lg breakpoint).
 * Includes a backdrop overlay that closes the sidebar when clicked.
 *
 * Features:
 * - Slide-in animation with CSS transitions
 * - Backdrop overlay with opacity transition
 * - Auto-closes on navigation
 * - Controlled by NavigationContext mobile menu state
 * - Responsive max width for optimal mobile UX
 *
 * @returns JSX element representing the mobile sidebar overlay, or null if closed
 *
 * @example
 * ```tsx
 * // Used internally by AppLayout
 * <MobileSidebar />
 * ```
 */
const MobileSidebar = memo(() => {
  const { mobileMenuOpen, setMobileMenuOpen } = useNavigation()

  if (!mobileMenuOpen) return null

  return (
    <div className="lg:hidden fixed inset-0 z-40 flex">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar Panel */}
      <div className="
        relative flex-1 flex flex-col max-w-xs w-full
        bg-white dark:bg-gray-900
        transform transition ease-in-out duration-300
      ">
        <Sidebar
          className="flex-1 h-full overflow-y-auto"
          onNavigate={() => setMobileMenuOpen(false)}
        />
      </div>
    </div>
  )
})

MobileSidebar.displayName = 'MobileSidebar'

// Import useNavigation for mobile sidebar
import { useNavigation } from '../../contexts/NavigationContext'

// ============================================================================
// MAIN EXPORT WITH NAVIGATION PROVIDER
// ============================================================================

/**
 * Main application layout component with navigation context provider.
 *
 * Root layout component that wraps the entire authenticated application.
 * Provides navigation state management through NavigationProvider and
 * renders the complete application shell including navigation, sidebar,
 * and content areas.
 *
 * This component should wrap all authenticated routes in the application.
 * It manages:
 * - Navigation state (mobile menu, search, notifications)
 * - Dark mode preferences
 * - Sidebar collapse state
 * - Recent navigation items
 *
 * @param props - Component props
 * @param props.children - Application content to render (typically route-based pages)
 * @returns JSX element representing the full application layout with context providers
 *
 * @example
 * ```tsx
 * <AppLayout>
 *   <Routes>
 *     <Route path="/dashboard" element={<Dashboard />} />
 *     <Route path="/students" element={<Students />} />
 *   </Routes>
 * </AppLayout>
 * ```
 */
export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <NavigationProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </NavigationProvider>
  )
}
