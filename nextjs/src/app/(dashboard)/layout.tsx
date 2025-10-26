'use client';

/**
 * Dashboard Layout - Main application layout with sidebar and header
 *
 * Purpose: Provides the authenticated application shell for all dashboard pages
 * Features:
 * - Responsive sidebar (collapsible on desktop, drawer on mobile)
 * - Top navigation header with search, notifications, user menu
 * - Auto-generated breadcrumbs
 * - Sticky header and sidebar
 * - Dark mode support
 * - Keyboard accessible
 * - Screen reader support
 */

import { useState, ReactNode } from 'react';
import { Header } from '@/components/layouts/Header';
import { Sidebar } from '@/components/layouts/Sidebar';
import { MobileNav } from '@/components/layouts/MobileNav';
import { Breadcrumbs } from '@/components/layouts/Breadcrumbs';
import { Footer } from '@/components/layouts/Footer';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mock user data - replace with actual auth context
  const user = {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    role: 'NURSE',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>

      {/* Top Navigation Header */}
      <Header onMenuClick={() => setMobileMenuOpen(true)} user={user} />

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div className="w-64 flex flex-col">
            <Sidebar className="flex-1 h-full" />
          </div>
        </div>

        {/* Mobile Sidebar (Drawer) */}
        <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

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
