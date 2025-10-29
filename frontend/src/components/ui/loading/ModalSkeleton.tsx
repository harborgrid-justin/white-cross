'use client';

/**
 * ModalSkeleton - Loading skeleton for modal/dialog components
 *
 * Provides a placeholder UI while lazy-loaded modals are being fetched.
 * Matches the visual structure of typical modal dialogs in the application.
 *
 * @module components/ui/loading/ModalSkeleton
 */

import React from 'react';

export interface ModalSkeletonProps {
  /** Show header section */
  showHeader?: boolean;
  /** Show footer section */
  showFooter?: boolean;
  /** Number of content rows to display */
  contentRows?: number;
  /** Modal size */
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Modal loading skeleton component
 *
 * @example
 * ```tsx
 * <Suspense fallback={<ModalSkeleton size="lg" contentRows={5} />}>
 *   <StudentDetailsModal />
 * </Suspense>
 * ```
 */
export function ModalSkeleton({
  showHeader = true,
  showFooter = true,
  contentRows = 4,
  size = 'md',
}: ModalSkeletonProps) {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className={`
          bg-white dark:bg-gray-900 rounded-lg shadow-xl
          w-full ${sizeClasses[size]} mx-4
          animate-pulse
        `}
      >
        {/* Header */}
        {showHeader && (
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          {Array.from({ length: contentRows }).map((_, i) => (
            <div key={`skeleton-row-${i}`} className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            </div>
          ))}
        </div>

        {/* Footer */}
        {showFooter && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24" />
            <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-24" />
          </div>
        )}
      </div>
    </div>
  );
}

ModalSkeleton.displayName = 'ModalSkeleton';

export default ModalSkeleton;
