'use client';

/**
 * Dashboard Home Page - Next.js App Router
 *
 * Migrated from frontend/src/pages/dashboard/Dashboard.tsx
 *
 * Main dashboard displaying key metrics, recent activity, and quick actions.
 *
 * Features:
 * - Student health metrics overview
 * - Upcoming appointments
 * - Medication administration schedule
 * - Recent incident reports
 * - Quick action buttons
 *
 * @remarks
 * This is a Client Component because it uses:
 * - TanStack Query for data fetching
 * - Redux for state management
 * - Interactive components
 */

import { Suspense } from 'react';
import type { Metadata } from 'next';

// Import dashboard components from existing codebase
import Dashboard from '@/pages-old/dashboard/Dashboard';

// This would normally be in the parent layout, but showing here for clarity
export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'School health management dashboard',
};

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <Dashboard />
    </Suspense>
  );
}

function DashboardLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse space-y-6">
        {/* Stats skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>

        {/* Charts skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
