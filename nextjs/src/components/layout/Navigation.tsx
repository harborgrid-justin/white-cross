'use client';

/**
 * WF-COMP-NAV-004 | Navigation.tsx - Top Navigation Bar Component
 * Purpose: Top navigation bar with search, notifications, user menu, dark mode
 * Dependencies: react, lucide-react, contexts, components
 * Features: Responsive, keyboard accessible, role display, notifications
 * Last Updated: 2025-10-24
 * Agent: NAV7L5 - React Component Architect
 */

import React, { memo, useCallback, useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Menu, X, Search, Bell, User, LogOut, Settings as SettingsIcon,
  Moon, Sun, ChevronDown, Shield
} from 'lucide-react'
import { useAuthContext } from '../../contexts/AuthContext'
import { useNavigation } from '../../contexts/NavigationContext'
import { PROTECTED_ROUTES } from '../../constants/routes'

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Props for the UserMenu component.
 *
 * @property {() => void} onClose - Callback function to close the user menu
 */
interface UserMenuProps {
  onClose: () => void
}

/**
 * User menu dropdown component.
 *
 * Displays a dropdown menu with user information and actions including:
 * - User name and email
 * - Role badge with color coding
 * - Profile link
 * - Settings link
 * - Sign out button
 *
 * Features:
 * - Click outside to close functionality
 * - Role-based badge styling
 * - Accessible menu structure with ARIA attributes
 * - Smooth animations
 * - Dark mode support
 *
 * @param props - Component props
 * @param props.onClose - Callback to close the menu
 * @returns JSX element representing the user menu dropdown
 *
 * @example
 * ```tsx
 * <UserMenu onClose={() => setMenuOpen(false)} />
 * ```
 */
const UserMenu = memo(({ onClose }: UserMenuProps) => {
  const { user, logout } = useAuthContext()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  return (
    <div
      ref={menuRef}
      className="
        absolute right-0 mt-2 w-56 rounded-md shadow-lg
        bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5
        divide-y divide-gray-100 dark:divide-gray-700
        focus:outline-none z-50
        animate-fadeIn
      "
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="user-menu-button"
    >
      {/* User Info */}
      <div className="px-4 py-3">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {user?.firstName} {user?.lastName}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
          {user?.email}
        </p>
        <span
          className={`
            inline-flex items-center px-2 py-0.5 mt-2 rounded text-xs font-medium
            ${user?.role === 'ADMIN' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
              user?.role === 'NURSE' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
              user?.role === 'SCHOOL_ADMIN' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              user?.role === 'DISTRICT_ADMIN' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' :
              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}
          `}
        >
          {user?.role?.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Menu Items */}
      <div className="py-1">
        <Link
          to={PROTECTED_ROUTES.PROFILE}
          className="
            group flex items-center px-4 py-2 text-sm
            text-gray-700 dark:text-gray-300
            hover:bg-gray-100 dark:hover:bg-gray-700
            transition-colors duration-200
          "
          role="menuitem"
          onClick={onClose}
        >
          <User className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
          My Profile
        </Link>
        <Link
          to={PROTECTED_ROUTES.PROFILE_SETTINGS}
          className="
            group flex items-center px-4 py-2 text-sm
            text-gray-700 dark:text-gray-300
            hover:bg-gray-100 dark:hover:bg-gray-700
            transition-colors duration-200
          "
          role="menuitem"
          onClick={onClose}
        >
          <SettingsIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
          Settings
        </Link>
      </div>

      {/* Logout */}
      <div className="py-1">
        <button
          onClick={() => {
            onClose()
            logout()
          }}
          className="
            group flex items-center w-full px-4 py-2 text-sm
            text-red-700 dark:text-red-400
            hover:bg-red-50 dark:hover:bg-red-900 dark:hover:bg-opacity-20
            transition-colors duration-200
          "
          role="menuitem"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  )
})

UserMenu.displayName = 'UserMenu'

// ============================================================================
// DARK MODE TOGGLE COMPONENT
// ============================================================================

/**
 * Dark mode toggle button component.
 *
 * Provides a button to toggle between light and dark mode themes.
 * The state is managed by NavigationContext and persisted across sessions.
 *
 * Features:
 * - Smooth icon transition between sun and moon
 * - Accessible with ARIA labels
 * - Keyboard accessible
 * - Visual feedback on hover and active states
 * - Respects prefers-reduced-motion for animations
 *
 * @returns JSX element representing the dark mode toggle button
 *
 * @example
 * ```tsx
 * <DarkModeToggle />
 * ```
 */
const DarkModeToggle = memo(() => {
  const { darkMode, setDarkMode } = useNavigation()

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="
        p-2 rounded-md text-gray-500 dark:text-gray-400
        hover:bg-gray-100 dark:hover:bg-gray-800
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-900
        transition-all duration-200 ease-in-out
        active:scale-95
        motion-reduce:transition-none motion-reduce:transform-none
      "
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  )
})

DarkModeToggle.displayName = 'DarkModeToggle'

// ============================================================================
// MAIN NAVIGATION COMPONENT
// ============================================================================

/**
 * Props for the Navigation component.
 *
 * @property {string} [className] - Optional CSS classes to apply to the navigation container
 */
interface NavigationProps {
  className?: string
}

/**
 * Top navigation bar component.
 *
 * Provides the main navigation header for the application including:
 * - Mobile menu toggle
 * - Application logo
 * - Global search (desktop and mobile)
 * - Dark mode toggle
 * - Notifications with badge indicator
 * - User menu with profile and settings
 *
 * Layout:
 * - Sticky positioning at top of viewport
 * - Responsive design with mobile and desktop layouts
 * - Desktop: Logo hidden, search bar visible, full user info
 * - Mobile: Hamburger menu, logo visible, search icon only
 *
 * Features:
 * - Keyboard shortcuts (⌘K for search)
 * - Notification badge indicator
 * - Role-based user information display
 * - Accessible with ARIA labels and semantic HTML
 * - Dark mode support
 * - Smooth transitions and hover states
 *
 * @param props - Component props
 * @param props.className - Optional CSS classes for the navigation container
 * @returns JSX element representing the top navigation bar
 *
 * @example
 * ```tsx
 * <Navigation />
 * ```
 *
 * @example
 * ```tsx
 * <Navigation className="custom-shadow" />
 * ```
 */
export const Navigation = memo(({ className = '' }: NavigationProps) => {
  const { user } = useAuthContext()
  const {
    mobileMenuOpen,
    setMobileMenuOpen,
    setSearchOpen,
    setNotificationOpen
  } = useNavigation()

  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(!mobileMenuOpen)
  }, [mobileMenuOpen, setMobileMenuOpen])

  const openSearch = useCallback(() => {
    setSearchOpen(true)
  }, [setSearchOpen])

  const openNotifications = useCallback(() => {
    setNotificationOpen(true)
  }, [setNotificationOpen])

  const toggleUserMenu = useCallback(() => {
    setUserMenuOpen(!userMenuOpen)
  }, [userMenuOpen])

  return (
    <header
      className={`
        sticky top-0 z-30 flex-shrink-0 bg-white dark:bg-gray-900
        shadow-sm border-b border-gray-200 dark:border-gray-700
        ${className}
      `}
      role="banner"
    >
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Section - Mobile Menu & Logo */}
        <div className="flex items-center">
          {/* Mobile Menu Button */}
          <button
            type="button"
            className="
              lg:hidden p-2 rounded-md text-gray-500 dark:text-gray-400
              hover:bg-gray-100 dark:hover:bg-gray-800
              focus:outline-none focus:ring-2 focus:ring-primary-500
              transition-colors duration-200
            "
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            data-testid="mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Logo (Mobile) */}
          <Link
            to={PROTECTED_ROUTES.DASHBOARD}
            className="lg:hidden ml-3 flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
              White Cross
            </span>
          </Link>
        </div>

        {/* Center Section - Search (Desktop) */}
        <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
          <button
            onClick={openSearch}
            className="
              flex items-center w-full px-4 py-2 rounded-lg
              bg-gray-100 dark:bg-gray-800
              text-gray-500 dark:text-gray-400
              hover:bg-gray-200 dark:hover:bg-gray-700
              focus:outline-none focus:ring-2 focus:ring-primary-500
              transition-all duration-200
            "
            aria-label="Open search"
          >
            <Search className="h-5 w-5 mr-2" />
            <span className="text-sm">Search students, records, medications...</span>
            <kbd className="
              ml-auto px-2 py-1 text-xs font-semibold
              bg-white dark:bg-gray-900 rounded border border-gray-300 dark:border-gray-600
            ">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Section - Actions & User */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Search Button (Mobile) */}
          <button
            onClick={openSearch}
            className="
              lg:hidden p-2 rounded-md text-gray-500 dark:text-gray-400
              hover:bg-gray-100 dark:hover:bg-gray-800
              focus:outline-none focus:ring-2 focus:ring-primary-500
              transition-colors duration-200
            "
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Dark Mode Toggle */}
          <DarkModeToggle />

          {/* Notifications */}
          <button
            onClick={openNotifications}
            className="
              relative p-2 rounded-md text-gray-500 dark:text-gray-400
              hover:bg-gray-100 dark:hover:bg-gray-800
              focus:outline-none focus:ring-2 focus:ring-primary-500
              transition-colors duration-200
            "
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {/* Badge */}
            <span className="
              absolute top-1 right-1 block h-2 w-2
              rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900
            " />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={toggleUserMenu}
              className="
                flex items-center space-x-3 p-2 rounded-md
                hover:bg-gray-100 dark:hover:bg-gray-800
                focus:outline-none focus:ring-2 focus:ring-primary-500
                transition-colors duration-200
              "
              aria-label="User menu"
              aria-expanded={userMenuOpen}
              id="user-menu-button"
              data-testid="user-menu"
            >
              <div className="hidden sm:block text-right">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.role?.replace(/_/g, ' ')}
                </div>
              </div>
              <div className="
                h-9 w-9 rounded-full bg-primary-600 flex items-center justify-center
                text-white font-medium text-sm
              ">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <ChevronDown className="hidden sm:block h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>

            {userMenuOpen && <UserMenu onClose={() => setUserMenuOpen(false)} />}
          </div>
        </div>
      </div>
    </header>
  )
})

Navigation.displayName = 'Navigation'

export default Navigation
