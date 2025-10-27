/**
 * @fileoverview Dashboard Layout - Main Application Shell
 *
 * The primary authenticated layout for the White Cross Healthcare Platform, providing
 * a consistent application shell with sidebar navigation, header, breadcrumbs, and footer
 * for all dashboard pages. This layout is used by all authenticated users and wraps
 * the main application features.
 *
 * @module app/(dashboard)/layout
 * @category Core
 * @subcategory Layouts
 *
 * **Layout Position in Hierarchy:**
 * ```
 * RootLayout (app/layout.tsx)
 * └── DashboardLayout (this file) - wraps (dashboard) route group
 *     ├── Dashboard Home (dashboard/page.tsx)
 *     ├── Medications (medications/layout.tsx → pages)
 *     ├── Students (students/page.tsx)
 *     ├── Appointments (appointments/page.tsx)
 *     └── [Other dashboard features...]
 * ```
 *
 * **Key Features:**
 * - **Responsive Sidebar**: Desktop (fixed, 256px), Mobile (drawer)
 * - **Top Navigation**: Search, notifications, user menu
 * - **Auto-generated Breadcrumbs**: Dynamic based on current route
 * - **Sticky Header**: Fixed positioning during scroll
 * - **Dark Mode Support**: Full theme integration
 * - **Skip Navigation**: Keyboard accessibility (WCAG 2.4.1)
 * - **Footer**: Copyright and compliance information
 *
 * **Responsive Behavior:**
 * - Desktop (lg+): Sidebar visible, fixed width (w-64)
 * - Mobile/Tablet: Sidebar hidden, accessible via hamburger menu
 * - Main content: Flex-grow to fill available space
 * - Overflow handling: Vertical scroll in main content area
 *
 * **State Management:**
 * - NavigationContext: Manages sidebar open/close state
 * - Header component: Handles mobile menu toggle, user dropdown
 * - MobileNav component: Controls drawer visibility
 * - Sidebar component: Manages navigation active states
 *
 * **Accessibility Features:**
 * - Skip-to-content link (keyboard users)
 * - ARIA roles and labels
 * - Keyboard navigation support
 * - Screen reader announcements
 * - Focus management
 *
 * @see {@link Header} for top navigation implementation
 * @see {@link Sidebar} for sidebar navigation
 * @see {@link MobileNav} for mobile drawer
 * @see {@link Breadcrumbs} for dynamic breadcrumb generation
 * @see {@link Footer} for footer content
 *
 * @example
 * ```tsx
 * // This layout automatically wraps all pages in app/(dashboard)/
 * // File structure:
 * // app/(dashboard)/
 * //   layout.tsx (this file)
 * //   dashboard/page.tsx (wrapped by this layout)
 * //   medications/
 * //     layout.tsx (nested, also wrapped by this layout)
 * //     page.tsx
 * ```
 *
 * @since 1.0.0
 */

import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/layouts/Header';
import { Sidebar } from '@/components/layouts/Sidebar';
import { MobileNav } from '@/components/layouts/MobileNav';
import { Breadcrumbs } from '@/components/layouts/Breadcrumbs';
import { Footer } from '@/components/layouts/Footer';

/**
 * Metadata configuration for Dashboard layout
 */
export const metadata: Metadata = {
  title: {
    template: '%s | Dashboard | White Cross',
    default: 'Dashboard | White Cross Healthcare',
  },
  description: 'White Cross Healthcare Platform dashboard for managing students, medications, appointments, and health records.',
};

/**
 * Props interface for the Dashboard Layout component.
 *
 * @interface DashboardLayoutProps
 * @property {React.ReactNode} children - Child page components to render within the layout
 */
interface DashboardLayoutProps {
  children: ReactNode;
}

/**
 * Dashboard Layout Component
 *
 * Provides the main authenticated application shell with sidebar, header, breadcrumbs,
 * and footer. This is a Server Component that renders the static layout structure, with
 * client-side interactivity delegated to child components.
 *
 * **Layout Structure:**
 * ```
 * ┌─────────────────────────────────────────┐
 * │ Header (search, notifications, user)    │
 * ├──────────┬──────────────────────────────┤
 * │          │ Breadcrumbs                  │
 * │ Sidebar  ├──────────────────────────────┤
 * │ (fixed)  │                              │
 * │          │ Main Content                 │
 * │          │ (scrollable)                 │
 * │          │                              │
 * │          ├──────────────────────────────┤
 * │          │ Footer                       │
 * └──────────┴──────────────────────────────┘
 * ```
 *
 * **Component Responsibilities:**
 * - Render skip-to-content link for accessibility
 * - Render header with navigation and user controls
 * - Render desktop sidebar (hidden on mobile)
 * - Render mobile navigation drawer
 * - Render breadcrumbs for route context
 * - Render main content area with vertical scroll
 * - Render footer with copyright and links
 *
 * **Client-Side State:**
 * This Server Component does not manage state directly. Interactive features
 * are handled by client components:
 * - `<Header />` - Mobile menu toggle, user dropdown
 * - `<MobileNav />` - Drawer open/close state
 * - `<Sidebar />` - Navigation active states
 * All state coordination happens through NavigationContext.
 *
 * @param {DashboardLayoutProps} props - Component properties
 * @param {React.ReactNode} props.children - Child page components
 *
 * @returns {JSX.Element} The dashboard layout structure with all UI components
 *
 * @example
 * ```tsx
 * // Next.js automatically applies this layout to (dashboard) routes:
 * <DashboardLayout>
 *   <DashboardPage /> // or <MedicationsPage />, <StudentsPage />, etc.
 * </DashboardLayout>
 * ```
 *
 * @example
 * ```tsx
 * // The rendered structure:
 * <div className="min-h-screen bg-gray-50">
 *   <a href="#main-content">Skip to main content</a>
 *   <Header />
 *   <div className="flex flex-1">
 *     <Sidebar /> // Desktop only
 *     <MobileNav /> // Mobile only
 *     <main id="main-content">
 *       <Breadcrumbs />
 *       <div className="py-6">
 *         {children} // Your page content
 *       </div>
 *       <Footer />
 *     </main>
 *   </div>
 * </div>
 * ```
 *
 * @remarks
 * This is a Next.js Server Component. It does not use hooks, state, or browser APIs.
 * All interactive features are implemented in client components that are rendered
 * as children of this layout.
 *
 * The layout uses Tailwind CSS for styling with responsive breakpoints:
 * - Mobile: Default styles
 * - Tablet: sm (640px+)
 * - Desktop: lg (1024px+)
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  // Note: Header and MobileNav manage their own state through NavigationContext
  // No local state needed here - this is a pure server component

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>

      {/* Top Navigation Header - Manages its own state via NavigationContext */}
      <Header />

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div className="w-64 flex flex-col">
            <Sidebar className="flex-1 h-full" />
          </div>
        </div>

        {/* Mobile Sidebar (Drawer) - Manages its own state via NavigationContext */}
        <MobileNav />

        {/* Main Content */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto focus:outline-none"
          role="main"
          tabIndex={-1}
        >
          {/* Breadcrumbs */}
          <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-3">
            <Breadcrumbs />
          </div>

          {/* Page Content */}
          <div className="py-6">
            {children}
          </div>

          {/* Footer */}
          <Footer />
        </main>
      </div>
    </div>
  );
}
