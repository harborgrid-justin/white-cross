/**
 * WF-LOADING-002 | GenericDetailLoadingSkeleton.tsx - Generic Detail Page Loading Skeleton
 * Purpose: Reusable skeleton for detail pages (student detail, medication detail)
 * Upstream: Route loading.tsx files | Dependencies: React
 * Downstream: Better perceived performance
 * Related: Route-specific loading states
 * Exports: GenericDetailLoadingSkeleton component
 * Last Updated: 2025-10-27 | File Type: .tsx
 */

import React from 'react';

export interface GenericDetailLoadingSkeletonProps {
  showTabs?: boolean;
  tabCount?: number;
  className?: string;
}

export const GenericDetailLoadingSkeleton: React.FC<
  GenericDetailLoadingSkeletonProps
> = ({ showTabs = true, tabCount = 4, className = '' }) => {
  return (
    <div className={`space-y-6 ${className}`} role="status" aria-live="polite">
      <span className="sr-only">Loading...</span>

      {/* Back Button Skeleton */}
      <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>

      {/* Header Section Skeleton */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 animate-pulse">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* Avatar/Photo Skeleton */}
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="flex-1 space-y-3">
              <div className="h-7 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      {showTabs && (
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-6">
            {[...Array(tabCount)].map((_, i) => (
              <div
                key={i}
                className="h-10 w-28 bg-gray-200 dark:bg-gray-700 rounded-t animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      )}

      {/* Content Section Skeleton */}
      <div className="space-y-4">
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 animate-pulse"
            >
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>

        {/* Large Content Block */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 animate-pulse">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

GenericDetailLoadingSkeleton.displayName = 'GenericDetailLoadingSkeleton';

export default GenericDetailLoadingSkeleton;
