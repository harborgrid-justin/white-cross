/**
 * @fileoverview Compliance Layout - Layout component with parallel routes for compliance management
 * @module app/(dashboard)/compliance/layout
 * @category Compliance - Layout
 */

import { Suspense } from 'react';

interface ComplianceLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  modal: React.ReactNode;
}

export default function ComplianceLayout({
  children,
  sidebar,
  modal
}: ComplianceLayoutProps) {
  return (
    <div className="flex h-full">
      <div className="flex-1">
        <Suspense fallback={
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        }>
          {children}
        </Suspense>
        {modal}
      </div>
      <div className="w-80 flex-shrink-0">
        <Suspense fallback={
          <div className="h-full bg-gray-50 border-l border-gray-200 p-4">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        }>
          {sidebar}
        </Suspense>
      </div>
    </div>
  );
}