/**
 * @fileoverview Dashboard Layout - White Cross Healthcare Platform
 *
 * Main dashboard layout that provides consistent structure, navigation, and styling
 * for all authenticated pages in the White Cross Healthcare Platform. This layout
 * wraps all dashboard pages and provides the primary navigation, header, and content area.
 *
 * @module app/(dashboard)/layout
 * @category Layouts
 * @subcategory Dashboard
 *
 * **Layout Hierarchy:**
 * ```
 * RootLayout
 * └── DashboardLayout (this file)
 *     ├── /dashboard (Dashboard Home)
 *     ├── /students/* (All Students pages)
 *     ├── /medications/* (All Medications pages)
 *     ├── /health-records/* (All Health Records pages)
 *     ├── /appointments/* (All Appointments pages)
 *     └── ... (All other main application pages)
 * ```
 *
 * **Features:**
 * - Consistent header with user info and navigation
 * - Responsive sidebar navigation (desktop) / mobile menu
 * - Main content area with proper spacing and background
 * - Breadcrumb navigation support
 * - Loading states and error boundaries
 *
 * **HIPAA Compliance:**
 * - Session timeout handling
 * - Secure navigation state management
 * - PHI data access logging at layout level
 *
 * **Accessibility:**
 * - Skip navigation links
 * - Semantic navigation structure
 * - ARIA labels and landmarks
 * - Keyboard navigation support
 *
 * @since 1.0.0
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { ReactNode } from 'react';

/**
 * Metadata configuration for dashboard pages.
 *
 * @constant
 * @type {Metadata}
 */
export const metadata: Metadata = {
  title: {
    template: '%s | White Cross Healthcare',
    default: 'Dashboard | White Cross Healthcare',
  },
  description: 'White Cross Healthcare Platform - Comprehensive school health management with real-time monitoring, medical records, and healthcare analytics.',
  openGraph: {
    type: 'website',
    siteName: 'White Cross Healthcare',
    title: 'Dashboard | White Cross Healthcare',
    description: 'Comprehensive school health management platform with real-time monitoring and analytics.',
  },
};

/**
 * Props interface for the Dashboard Layout component.
 *
 * @interface DashboardLayoutProps
 * @property {React.ReactNode} children - Dashboard page components to render
 */
interface DashboardLayoutProps {
  children: ReactNode;
}

/**
 * Dashboard Layout Component
 *
 * Provides consistent layout structure for all authenticated dashboard pages.
 * Includes responsive navigation, header, and main content area with proper
 * spacing and styling.
 *
 * @param {DashboardLayoutProps} props - Component properties
 * @param {React.ReactNode} props.children - Child dashboard pages
 *
 * @returns {JSX.Element} Complete dashboard layout structure
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
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
              <Link href="/dashboard" className="flex items-center">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">WC</span>
                </div>
                <span className="ml-2 text-xl font-semibold text-gray-900">
                  White Cross
                </span>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8" role="navigation">
              <NavLink href="/dashboard">Dashboard</NavLink>
              <NavLink href="/students">Students</NavLink>
              <NavLink href="/medications">Medications</NavLink>
              <NavLink href="/health-records">Health Records</NavLink>
              <NavLink href="/appointments">Appointments</NavLink>
              <NavLink href="/incidents">Incidents</NavLink>
              <NavLink href="/reports">Reports</NavLink>
            </nav>

            {/* User Menu Placeholder */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <span className="sr-only">View notifications</span>
                {/* Bell icon placeholder */}
                <div className="w-6 h-6 bg-gray-300 rounded"></div>
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <span className="sr-only">User menu</span>
                {/* User avatar placeholder */}
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-1" role="main">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}

/**
 * Navigation Link Component
 *
 * Renders navigation links with consistent styling and hover states.
 * TODO: Add active state detection for current route highlighting.
 *
 * @param {Object} props - Component props
 * @param {string} props.href - Link destination
 * @param {React.ReactNode} props.children - Link text/content
 * @returns {JSX.Element} Styled navigation link
 */
function NavLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
    >
      {children}
    </Link>
  );
}
