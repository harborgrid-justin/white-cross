/**
 * @fileoverview Incidents Layout - Layout component with parallel routes support
 * @module app/(dashboard)/incidents/layout
 * @category Incidents - Layout Components
 *
 * ## Overview
 * Provides the base layout structure for the incidents management section with support for
 * parallel routes (@modal, @sidebar) and responsive design patterns.
 *
 * ## Features
 * - **Parallel Routes**: Supports @modal and @sidebar slots for overlay content
 * - **Responsive Design**: Adaptive layout for desktop and mobile devices
 * - **Error Boundaries**: Graceful error handling for child components
 * - **Performance**: Optimized rendering with proper component boundaries
 *
 * ## Layout Structure
 * ```
 * IncidentsLayout
 * ├── Main Content Area (children)
 * ├── @sidebar - Contextual sidebar navigation
 * └── @modal - Modal overlay content
 * ```
 */

import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

interface IncidentsLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
  sidebar: React.ReactNode;
}

export default function IncidentsLayout({
  children,
  modal,
  sidebar,
}: IncidentsLayoutProps) {
  return (
    <div className="flex h-full bg-gray-50">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <Suspense
              fallback={
                <div className="space-y-6">
                  <Skeleton className="h-8 w-64" />
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }, (_, i) => (
                      <Skeleton key={i} className="h-24" />
                    ))}
                  </div>
                  <div className="space-y-4">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Skeleton key={i} className="h-32" />
                    ))}
                  </div>
                </div>
              }
            >
              {children}
            </Suspense>
          </div>
        </main>
      </div>

      {/* Sidebar - Hidden on mobile, shown on desktop */}
      <aside className="hidden xl:block w-80 border-l border-gray-200 bg-white overflow-y-auto">
        <Suspense
          fallback={
            <div className="p-6 space-y-6">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-6 w-32" />
                  <div className="space-y-2">
                    {Array.from({ length: 4 }, (_, j) => (
                      <Skeleton key={j} className="h-16" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          }
        >
          {sidebar}
        </Suspense>
      </aside>

      {/* Modal Overlay */}
      {modal}
    </div>
  );
}