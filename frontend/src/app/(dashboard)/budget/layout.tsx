/**
 * @fileoverview Budget Layout Component - Healthcare financial management layout
 * @module app/(dashboard)/budget/layout
 * @category Budget - Layout
 */

import { Suspense } from 'react';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

interface BudgetLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  modal: React.ReactNode;
}

export default async function BudgetLayout({
  children,
  sidebar,
  modal
}: BudgetLayoutProps) {
  return (
    <div className="flex h-full bg-gray-50">
      {/* Sidebar */}
      <div className="flex-shrink-0">
        <Suspense fallback={<BudgetSidebarSkeleton />}>
          {sidebar}
        </Suspense>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 p-6 overflow-auto">
          <Suspense fallback={<BudgetContentSkeleton />}>
            {children}
          </Suspense>
        </div>
      </div>

      {/* Modal Overlay */}
      <Suspense fallback={null}>
        {modal}
      </Suspense>
    </div>
  );
}

function BudgetSidebarSkeleton() {
  return (
    <div className="w-80 p-6 space-y-6">
      {/* Quick Actions Skeleton */}
      <Card>
        <div className="p-4">
          <Skeleton className="h-4 w-24 mb-4" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </Card>

      {/* Navigation Skeleton */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="p-4">
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Skeleton className="h-4 w-4 mr-3" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-5 w-8" />
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Summary Skeleton */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Skeleton className="h-4 w-4 mr-2" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

function BudgetContentSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <div className="p-6">
              <div className="flex items-center">
                <Skeleton className="h-10 w-10 rounded-lg mr-4" />
                <div className="flex-1">
                  <Skeleton className="h-3 w-20 mb-2" />
                  <Skeleton className="h-6 w-16 mb-1" />
                  <Skeleton className="h-2 w-12" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions Skeleton */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="p-6">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
      </Card>

      {/* Categories List Skeleton */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Skeleton className="h-5 w-5" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                    <Skeleton className="h-3 w-full mb-3" />
                    <Skeleton className="h-2 w-full mb-3" />
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Skeleton className="h-3 w-16 mb-1" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                      <div>
                        <Skeleton className="h-3 w-12 mb-1" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                      <div>
                        <Skeleton className="h-3 w-16 mb-1" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}