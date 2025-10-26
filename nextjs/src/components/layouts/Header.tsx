'use client';

/**
 * Header Component - Top navigation bar for dashboard
 *
 * Features:
 * - Responsive design (mobile drawer toggle, desktop search bar)
 * - Global search with keyboard shortcut (Cmd/Ctrl + K)
 * - Notifications center
 * - User menu with profile and settings
 * - Dark mode toggle
 * - Active user display with role badge
 * - Keyboard accessible
 * - Screen reader support
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Bell,
  Menu,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Shield,
} from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

export function Header({ onMenuClick, user }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === 'Escape') {
        setSearchOpen(false);
        setUserMenuOpen(false);
        setNotificationsOpen(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  }, [darkMode]);

  const getRoleBadgeClass = (role: string) => {
    const roleMap: Record<string, string> = {
      ADMIN: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      NURSE: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      SCHOOL_ADMIN: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      DISTRICT_ADMIN: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    };
    return roleMap[role] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  return (
    <>
      <header
        className="sticky top-0 z-30 flex-shrink-0 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700"
        role="banner"
      >
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left Section - Mobile Menu & Logo */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Logo (Mobile Only) */}
            <Link
              href="/dashboard"
              className="lg:hidden flex items-center gap-2"
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
              onClick={() => setSearchOpen(true)}
              className="flex items-center w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              aria-label="Open search (Keyboard shortcut: Command K)"
            >
              <Search className="h-5 w-5 mr-2" />
              <span className="text-sm">Search students, records, medications...</span>
              <kbd className="ml-auto px-2 py-1 text-xs font-semibold bg-white dark:bg-gray-900 rounded border border-gray-300 dark:border-gray-600">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Section - Actions & User */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Button (Mobile) */}
            <button
              onClick={() => setSearchOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
              </button>

              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                      Notifications
                    </h3>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                        No new notifications
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                aria-label="User menu"
                aria-expanded={userMenuOpen}
              >
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.role?.replace(/_/g, ' ')}
                  </div>
                </div>
                <div className="h-9 w-9 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium text-sm">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <ChevronDown className="hidden sm:block h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>

              {/* User Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-700 focus:outline-none z-50">
                  {/* User Info */}
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {user?.email}
                    </p>
                    {user?.role && (
                      <span className={`inline-flex items-center px-2 py-0.5 mt-2 rounded text-xs font-medium ${getRoleBadgeClass(user.role)}`}>
                        {user.role.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                      My Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                      Settings
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        // Handle logout
                      }}
                      className="group flex items-center w-full px-4 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 dark:hover:bg-opacity-20 transition-colors"
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="search-title"
        >
          <div className="flex min-h-screen items-start justify-center px-4 pt-20">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setSearchOpen(false)}
              aria-hidden="true"
            />
            <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl">
              <div className="p-4">
                <h2 id="search-title" className="sr-only">
                  Search
                </h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="search"
                    placeholder="Search students, records, medications..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    autoFocus
                  />
                </div>
                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  <p>Start typing to search...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
