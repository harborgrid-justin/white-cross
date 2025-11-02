/**
 * @fileoverview Analytics Layout - Healthcare analytics dashboard with parallel routes
 * @module app/(dashboard)/analytics/layout
 * @category Analytics - Layout
 */

import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AnalyticsSidebar } from './_components/AnalyticsSidebar';

interface AnalyticsLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
  sidebar: React.ReactNode;
}

// Loading skeleton for analytics content
function AnalyticsContentSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Stats grid skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 border rounded-lg">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions skeleton */}
      <div className="p-6 border rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>

      {/* Metrics grid skeleton */}
      <div className="p-6 border rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex items-center gap-1">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <div className="flex items-baseline gap-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-4 w-8" />
                </div>
                <Skeleton className="h-4 w-full" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom grid skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 border rounded-lg">
          <div className="flex items-center mb-4">
            <Skeleton className="h-5 w-5 mr-2" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 border rounded-lg">
          <div className="flex items-center mb-4">
            <Skeleton className="h-5 w-5 mr-2" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading skeleton for analytics sidebar
function AnalyticsSidebarSkeleton() {
  return (
    <div className="w-80 flex-shrink-0 space-y-6">
      {/* Analytics modules skeleton */}
      <div className="p-4 border rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-6 w-6" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg border">
              <Skeleton className="h-5 w-5 mt-0.5" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-6" />
                </div>
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions skeleton */}
      <div className="p-4 border rounded-lg">
        <Skeleton className="h-5 w-24 mb-4" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </div>

      {/* Quick stats skeleton */}
      <div className="p-4 border rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-6 w-6" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
              <Skeleton className="h-4 w-4" />
            </div>
          ))}
        </div>
      </div>

      {/* Filters skeleton */}
      <div className="p-4 border rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-6 w-6" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((section) => (
            <div key={section}>
              <Skeleton className="h-4 w-16 mb-2" />
              <div className="space-y-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsLayout({ 
  children, 
  modal, 
  sidebar 
}: AnalyticsLayoutProps) {
  return (
    <div className="flex h-full bg-gray-50">
      {/* Sidebar - Custom Analytics Sidebar */}
      <div className="flex-shrink-0">
        <Suspense fallback={<AnalyticsSidebarSkeleton />}>
          <AnalyticsSidebar />
        </Suspense>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <Suspense fallback={<AnalyticsContentSkeleton />}>
              {children}
            </Suspense>
          </div>
        </div>
      </div>

      {/* Modal Slot */}
      <Suspense fallback={null}>
        {modal}
      </Suspense>

      {/* Parallel Route Sidebar Slot (if needed for additional sidebars) */}
      <Suspense fallback={null}>
        {sidebar}
      </Suspense>
    </div>
  );
}


