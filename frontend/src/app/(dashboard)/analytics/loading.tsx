/**
 * @fileoverview Analytics Route Loading State Component
 *
 * Provides a skeleton UI placeholder while analytics data is being fetched
 * and charts are being rendered. Implements Next.js Suspense boundary pattern
 * for streaming server components and provides visual feedback during data loading.
 *
 * @module app/(dashboard)/analytics/loading
 *
 * @remarks
 * This loading component is automatically displayed by Next.js when:
 * - Analytics pages are loading (Server Component data fetching)
 * - Navigation occurs to/within analytics routes
 * - Suspense boundaries are triggered during streaming
 *
 * Accessibility features:
 * - `role="status"` - Announces loading state to screen readers
 * - `aria-live="polite"` - Screen reader announces when content changes
 * - `.sr-only` text provides context for assistive technologies
 * - Animated pulse effects provide visual loading feedback
 *
 * Performance considerations:
 * - Lightweight skeleton prevents layout shift (CLS optimization)
 * - Matches actual page layout for smooth transitions
 * - Uses Tailwind's `animate-pulse` for efficient CSS animations
 *
 * @example
 * ```tsx
 * // Automatically used by Next.js App Router
 * // Route: /analytics/health-metrics
 * // Displays while page.tsx is loading data
 * ```
 *
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming|Next.js Loading UI}
 * @see {@link https://web.dev/cls/|Cumulative Layout Shift (CLS)}
 */

import React from 'react';

/**
 * Analytics Loading Skeleton Component
 *
 * Server Component that renders a loading skeleton matching the analytics
 * page layout. Provides immediate visual feedback during data fetching.
 *
 * @returns {JSX.Element} Skeleton UI with accessibility attributes
 *
 * @remarks
 * Layout structure matches typical analytics pages:
 * - Page header with title and action buttons
 * - 5 key metric cards in responsive grid
 * - 2 large chart containers (side-by-side on desktop)
 * - Detailed table/list section
 *
 * Responsive design:
 * - Mobile: Stacked single column
 * - Tablet (sm): 2-column grid for metrics
 * - Desktop (lg): 5-column grid, side-by-side charts
 *
 * Dark mode support:
 * - Uses `dark:bg-gray-700` for skeleton elements
 * - Provides consistent experience across themes
 *
 * @example
 * ```tsx
 * // This component is automatically rendered during:
 * // 1. Initial page load of analytics routes
 * // 2. Navigation between analytics pages
 * // 3. Data refetching after mutations
 * ```
 */
export default function AnalyticsLoading() {
  return (
    <div className="space-y-6" role="status" aria-live="polite">
      <span className="sr-only">Loading analytics...</span>

      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="flex gap-3">
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-28 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
          ></div>
        ))}
      </div>

      {/* Large Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
      </div>

      {/* Detailed Table */}
      <div className="space-y-4">
        <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
      </div>
    </div>
  );
}
