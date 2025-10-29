'use client';

/**
 * WF-COMP-LAY-003 | Header.tsx - Application Header/Topbar Component
 * Purpose: Main application header with navigation, search, notifications, and user menu
 * Dependencies: react, react-router-dom, lucide-react, contexts
 * Features: Responsive, mobile menu toggle, search, notifications, user dropdown, dark mode
 * Last Updated: 2025-10-27
 * Agent: Layout Components Architect
 */

import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Menu, X, Search, Bell, User, Settings, LogOut, Moon, Sun,
  ChevronDown, Shield, HelpCircle, UserCircle
} from 'lucide-react';
import { useNavigation } from '../../contexts/NavigationContext';
import { useAuthContext } from '../../contexts/AuthContext';

// ============================================================================
// HEADER COMPONENT
// ============================================================================

/**
 * Props for Header component
 */
export interface HeaderProps {
  /** Additional CSS classes */
  className?: string;
  /** Show logo */
  showLogo?: boolean;
  /** Show search button */
  showSearch?: boolean;
  /** Show notifications */
  showNotifications?: boolean;
  /** Show user menu */
  showUserMenu?: boolean;
  /** Notification count */
  notificationCount?: number;
}

/**
 * Application header component.
 *
 * Main topbar navigation including:
 * - Mobile menu toggle
 * - Application logo and branding
 * - Global search
 * - Notifications center
 * - User profile dropdown
 * - Dark mode toggle
 * - Quick settings access
 *
 * Features:
 * - Responsive design (mobile hamburger menu)
 * - Sticky positioning
 * - Dark mode support
 * - Keyboard navigation (Tab, Escape)
 * - Accessibility (ARIA labels, roles)
 * - Dropdown menus (user, notifications)
 * - Unread notification badge
 * - User avatar with fallback
 * - Quick logout action
 * - Settings shortcut
 *
 * Layout:
 * - Left: Mobile menu toggle + Logo
 * - Center: Search (desktop only)
 * - Right: Notifications + User menu + Dark mode toggle
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes
 * @param props.showLogo - Show logo (default: true)
 * @param props.showSearch - Show search button (default: true)
 * @param props.showNotifications - Show notifications (default: true)
 * @param props.showUserMenu - Show user menu (default: true)
 * @param props.notificationCount - Unread notification count
 * @returns JSX element representing the application header
 *
 * @example
 * ```tsx
 * <Header
 *   notificationCount={5}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Header
 *   showSearch={false}
 *   showNotifications={false}
 *   className="border-b-2"
 * />
 * ```
 */
export const Header = memo(({
  className = '',
  showLogo = true,
  showSearch = true,
  showNotifications = true,
  showUserMenu = true,
  notificationCount = 0,
}: HeaderProps) => {
  const router = useRouter();
  const { user, logout } = useAuthContext();
  const {
    isMobileSidebarOpen,
    toggleMobileSidebar,
    toggleSearch,
    setNotificationsOpen,
    darkMode,
    toggleDarkMode,
  } = useNavigation();

  // User dropdown state
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle user menu toggle
  const handleUserMenuToggle = useCallback(() => {
    setUserMenuOpen(prev => !prev);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  // Handle logout
  const handleLogout = useCallback(() => {
    logout();
    router.push('/login');
  }, [logout, router]);

  // Get user initials for avatar
  const getUserInitials = useCallback(() => {
    if (!user) return 'U';

    const firstName = user.firstName || '';
    const lastName = user.lastName || '';

    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }

    if (firstName) return firstName[0].toUpperCase();
    if (lastName) return lastName[0].toUpperCase();

    return user.email?.[0]?.toUpperCase() || 'U';
  }, [user]);

  return (
    <header
      className={`
        sticky top-0 z-30 bg-white dark:bg-gray-900
        border-b border-gray-200 dark:border-gray-800
        shadow-sm
        ${className}
      `}
    >
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left Section: Mobile Menu + Logo */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={toggleMobileSidebar}
            className="
              lg:hidden p-2 rounded-md
              text-gray-600 hover:text-gray-900 hover:bg-gray-100
              dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800
              focus:outline-none focus:ring-2 focus:ring-primary-500
              transition-colors duration-200
            "
            aria-label={isMobileSidebarOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileSidebarOpen}
          >
            {isMobileSidebarOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>

          {/* Logo */}
          {showLogo && (
            <Link
              href="/dashboard"
              className="
                flex items-center space-x-2
                focus:outline-none focus:ring-2 focus:ring-primary-500
                rounded-md px-2 py-1 -mx-2
              "
              aria-label="White Cross - Go to dashboard"
            >
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <span className="hidden sm:block text-xl font-bold text-primary-600 dark:text-primary-400">
                White Cross
              </span>
            </Link>
          )}
        </div>

        {/* Right Section: Search + Notifications + User Menu */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Search Button */}
          {showSearch && (
            <button
              type="button"
              onClick={() => toggleSearch()}
              className="
                p-2 rounded-md
                text-gray-600 hover:text-gray-900 hover:bg-gray-100
                dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800
                focus:outline-none focus:ring-2 focus:ring-primary-500
                transition-colors duration-200
              "
              aria-label="Search"
              title="Search (Ctrl+K)"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </button>
          )}

          {/* Notifications Button */}
          {showNotifications && (
            <button
              type="button"
              onClick={() => setNotificationsOpen(true)}
              className="
                relative p-2 rounded-md
                text-gray-600 hover:text-gray-900 hover:bg-gray-100
                dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800
                focus:outline-none focus:ring-2 focus:ring-primary-500
                transition-colors duration-200
              "
              aria-label={`Notifications${notificationCount > 0 ? ` (${notificationCount} unread)` : ''}`}
            >
              <Bell className="h-5 w-5" aria-hidden="true" />
              {notificationCount > 0 && (
                <span
                  className="
                    absolute top-1 right-1 h-4 w-4
                    bg-red-500 text-white text-xs font-bold
                    rounded-full flex items-center justify-center
                  "
                  aria-hidden="true"
                >
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>
          )}

          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className="
              p-2 rounded-md
              text-gray-600 hover:text-gray-900 hover:bg-gray-100
              dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800
              focus:outline-none focus:ring-2 focus:ring-primary-500
              transition-colors duration-200
            "
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <Sun className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Moon className="h-5 w-5" aria-hidden="true" />
            )}
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && mounted && user && (
            <div className="relative" ref={userMenuRef} suppressHydrationWarning>
              <button
                type="button"
                onClick={handleUserMenuToggle}
                className="
                  flex items-center space-x-2 p-1.5 rounded-md
                  text-gray-700 hover:bg-gray-100
                  dark:text-gray-300 dark:hover:bg-gray-800
                  focus:outline-none focus:ring-2 focus:ring-primary-500
                  transition-colors duration-200
                "
                aria-label="User menu"
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
              >
                {/* User Avatar */}
                <div
                  className="
                    w-8 h-8 rounded-full bg-primary-600 text-white
                    flex items-center justify-center font-medium text-sm
                  "
                >
                  {getUserInitials()}
                </div>

                {/* User Name (Desktop Only) */}
                <span className="hidden md:block text-sm font-medium">
                  {user.firstName || user.email}
                </span>

                <ChevronDown
                  className={`
                    hidden md:block h-4 w-4 transition-transform duration-200
                    ${userMenuOpen ? 'rotate-180' : ''}
                  `}
                  aria-hidden="true"
                />
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div
                  className="
                    absolute right-0 mt-2 w-56 rounded-md shadow-lg
                    bg-white dark:bg-gray-800
                    border border-gray-200 dark:border-gray-700
                    ring-1 ring-black ring-opacity-5
                    divide-y divide-gray-100 dark:divide-gray-700
                  "
                  role="menu"
                  aria-orientation="vertical"
                >
                  {/* User Info */}
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Role: {user.role}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="
                        flex items-center px-4 py-2 text-sm
                        text-gray-700 hover:bg-gray-100
                        dark:text-gray-300 dark:hover:bg-gray-700
                        transition-colors duration-200
                      "
                      role="menuitem"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <UserCircle className="mr-3 h-4 w-4" aria-hidden="true" />
                      My Profile
                    </Link>

                    <Link
                      href="/settings"
                      className="
                        flex items-center px-4 py-2 text-sm
                        text-gray-700 hover:bg-gray-100
                        dark:text-gray-300 dark:hover:bg-gray-700
                        transition-colors duration-200
                      "
                      role="menuitem"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="mr-3 h-4 w-4" aria-hidden="true" />
                      Settings
                    </Link>

                    <Link
                      href="/help"
                      className="
                        flex items-center px-4 py-2 text-sm
                        text-gray-700 hover:bg-gray-100
                        dark:text-gray-300 dark:hover:bg-gray-700
                        transition-colors duration-200
                      "
                      role="menuitem"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <HelpCircle className="mr-3 h-4 w-4" aria-hidden="true" />
                      Help & Support
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="
                        flex items-center w-full px-4 py-2 text-sm text-left
                        text-red-700 hover:bg-red-50
                        dark:text-red-400 dark:hover:bg-red-900/20
                        transition-colors duration-200
                      "
                      role="menuitem"
                    >
                      <LogOut className="mr-3 h-4 w-4" aria-hidden="true" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;
