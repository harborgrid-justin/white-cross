'use client';

/**
 * @fileoverview Dashboard Layout Client Component - White Cross Healthcare Platform
 *
 * Client component containing all interactive elements of the dashboard layout.
 * This component handles navigation, dropdowns, and other interactive UI elements.
 *
 * @module app/(dashboard)/layout-client
 * @category Layouts
 * @subcategory Dashboard
 */

import Link from 'next/link';
import { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';

/**
 * Props interface for the Dashboard Layout Client component.
 *
 * @interface DashboardLayoutClientProps
 * @property {React.ReactNode} children - Dashboard page components to render
 */
interface DashboardLayoutClientProps {
  children: ReactNode;
}

/**
 * NavLink Component
 *
 * Styled navigation link with active state handling.
 *
 * @param {Object} props - Component props
 * @param {string} props.href - Link destination
 * @param {React.ReactNode} props.children - Link content
 * @returns {JSX.Element} Navigation link
 */
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
    >
      {children}
    </Link>
  );
}

/**
 * MoreModulesDropdown Component
 *
 * Dropdown menu for additional navigation modules.
 *
 * @returns {JSX.Element} Dropdown menu
 */
function MoreModulesDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
          More
          <ChevronDown className="ml-1 h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/reports">Reports</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/compliance">Compliance</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">Settings</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/admin">Admin Panel</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Dashboard Layout Client Component
 *
 * Provides consistent layout structure for all authenticated dashboard pages.
 * Includes responsive navigation, header, and main content area with proper
 * spacing and styling. All interactive elements are contained here.
 *
 * @param {DashboardLayoutClientProps} props - Component properties
 * @param {React.ReactNode} props.children - Child dashboard pages
 *
 * @returns {JSX.Element} Complete dashboard layout structure
 */
export default function DashboardLayoutClient({ children }: DashboardLayoutClientProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skip Navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-primary-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center" aria-label="White Cross Healthcare - Go to dashboard">
                <div
                  className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center"
                  aria-hidden="true"
                >
                  <span className="text-white font-bold text-sm">WC</span>
                </div>
                <span className="ml-2 text-xl font-semibold text-gray-900">
                  White Cross
                </span>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-4" role="navigation">
              {/* Primary Navigation */}
              <NavLink href="/dashboard">Dashboard</NavLink>
              <NavLink href="/students">Students</NavLink>
              <NavLink href="/health-records">Health Records</NavLink>
              <NavLink href="/appointments">Appointments</NavLink>
              <NavLink href="/medications">Medications</NavLink>

              {/* Dropdown for more modules */}
              <MoreModulesDropdown />
            </nav>

            {/* User Menu Placeholder */}
            <div className="flex items-center space-x-4">
              <button
                className="text-gray-500 hover:text-gray-700"
                aria-label="View notifications"
              >
                <span className="sr-only">View notifications</span>
                {/* Bell icon placeholder */}
                <div className="h-5 w-5 bg-gray-300 rounded"></div>
              </button>

              {/* User dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                    <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                    <span className="text-sm font-medium">User</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">Settings</Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/logout">Sign out</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        id="main-content"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        role="main"
        aria-label="Dashboard main content"
      >
        {children}
      </main>
    </div>
  );
}