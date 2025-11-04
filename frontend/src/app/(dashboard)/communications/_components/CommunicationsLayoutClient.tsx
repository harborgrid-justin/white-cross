/**
 * @fileoverview Communications Layout Client Component
 * @module app/(dashboard)/communications/_components/CommunicationsLayoutClient
 * @category Communications - Components
 */

'use client';

import { type ReactNode } from 'react';
import { Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface CommunicationsLayoutClientProps {
  children: ReactNode;
  sidebar: ReactNode;
  modal: ReactNode;
}

export function CommunicationsLayoutClient({
  children,
  sidebar,
  modal
}: CommunicationsLayoutClientProps) {
  return (
    <div className="flex h-full bg-gray-50">
      {/* Sidebar */}
      <div className="flex-shrink-0">
        <Suspense fallback={<CommunicationsSidebarSkeleton />}>
          {sidebar}
        </Suspense>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 p-6 overflow-auto">
          <Suspense fallback={<CommunicationsContentSkeleton />}>
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

function CommunicationsSidebarSkeleton() {
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
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="p-4">
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Skeleton className="h-4 w-4 mr-3" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-5 w-8" />
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Stats Skeleton */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Skeleton className="h-4 w-4 mr-2" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-3 w-8" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

function CommunicationsContentSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <div className="p-6">
              <div className="flex items-center">
                <Skeleton className="h-10 w-10 rounded-lg mr-4" />
                <div className="flex-1">
                  <Skeleton className="h-3 w-20 mb-2" />
                  <Skeleton className="h-6 w-12 mb-1" />
                  <Skeleton className="h-2 w-16" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Messages List Skeleton */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-5 w-32 mb-1" />
              <Skeleton className="h-3 w-48" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Skeleton className="h-5 w-5" />
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-5 w-12" />
                      <Skeleton className="h-5 w-14" />
                    </div>
                    <Skeleton className="h-3 w-full mb-3" />
                    <div className="flex items-center gap-6">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Skeleton className="h-8 w-8" />
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
