/**
 * Dashboard Page - Healthcare platform main dashboard
 *
 * Features:
 * - Comprehensive health statistics with server-side data fetching
 * - Real-time alerts and notifications
 * - Student health overview with parallel data loading
 * - Quick access to common actions
 * - System status and recent activities
 *
 * Next.js 16 Best Practices:
 * - Async page component for server-side data fetching
 * - Parallel data fetching using Promise.all
 * - Proper TypeScript typing for all data
 * - Suspense boundaries for progressive loading
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import DashboardContent from './_components/DashboardContent';
import DashboardSidebar from './_components/DashboardSidebar';

/**
 * Page metadata for SEO and browser display
 */
export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Comprehensive healthcare dashboard with real-time student health monitoring, critical alerts, appointment tracking, and system-wide health analytics.',
  keywords: [
    'healthcare dashboard',
    'student health monitoring',
    'health analytics',
    'medical dashboard',
    'school health overview',
    'real-time alerts',
    'health statistics'
  ],
  openGraph: {
    title: 'Dashboard | White Cross Healthcare',
    description: 'Real-time healthcare dashboard for comprehensive student health management and monitoring.',
    type: 'website',
  },
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Loading skeleton for dashboard content
 */
function DashboardLoading() {
  return (
    <div className="flex h-full animate-pulse">
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          <div className="h-8 w-48 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="w-80 border-l bg-gray-50/50 overflow-auto p-6">
        <div className="space-y-4">
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Dashboard Page Component - Server Component with Client-Side Data Fetching
 *
 * Uses client-side data fetching to avoid server-side rendering issues
 * with authentication and data serialization.
 */
export default function DashboardPage() {
  return (
    <div className="flex h-full">
      <main
        className="flex-1 overflow-auto"
        role="main"
        aria-label="Dashboard main content"
      >
        <Suspense fallback={<DashboardLoading />}>
          <DashboardContent />
        </Suspense>
      </main>
      <aside
        className="w-80 border-l bg-gray-50/50 overflow-auto"
        role="complementary"
        aria-label="Dashboard sidebar"
      >
        <div className="p-6">
          <Suspense fallback={<div className="animate-pulse h-64 bg-gray-200 rounded" />}>
            <DashboardSidebar />
          </Suspense>
        </div>
      </aside>
    </div>
  );
}
