/**
 * WF-LOADING-001 | GenericListLoadingSkeleton.tsx - Generic List Loading Skeleton
 * Purpose: Reusable skeleton for list pages (medications, students, appointments)
 * Upstream: Route loading.tsx files | Dependencies: React
 * Downstream: Better perceived performance
 * Related: Route-specific loading states
 * Exports: GenericListLoadingSkeleton component
 * Last Updated: 2025-10-27 | File Type: .tsx
 */

import React from 'react';

export interface GenericListLoadingSkeletonProps {
  showStats?: boolean;
  showFilters?: boolean;
  itemCount?: number;
  className?: string;
}

export const GenericListLoadingSkeleton: React.FC<
  GenericListLoadingSkeletonProps
> = ({
  showStats = true,
  showFilters = true,
  itemCount = 5,
  className = '',
}) => {
  return (
    <div className={`space-y-6 ${className}`} role="status" aria-live="polite">
      <span className="sr-only">Loading...</span>

      {/* Page Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>

      {/* Stats Cards Skeleton */}
      {showStats && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      )}

      {/* Filters Skeleton */}
      {showFilters && (
        <div className="flex gap-3">
          <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      )}

      {/* List Items Skeleton */}
      <div className="space-y-4">
        {[...Array(itemCount)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 animate-pulse"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

GenericListLoadingSkeleton.displayName = 'GenericListLoadingSkeleton';

export default GenericListLoadingSkeleton;
