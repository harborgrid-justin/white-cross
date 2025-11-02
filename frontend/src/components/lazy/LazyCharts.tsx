/**
 * Lazy-loaded Chart Components
 *
 * This module provides lazy-loaded wrappers for heavy chart libraries (recharts).
 * Charts are typically used in analytics/dashboard pages and don't need to be in
 * the initial bundle. This reduces the main bundle size by ~100KB.
 *
 * PERFORMANCE IMPACT:
 * - Recharts bundle size: ~92KB (gzipped: ~28KB)
 * - Initial load improvement: Charts load only when needed
 * - Route-based code splitting: Analytics pages load charts separately
 *
 * USAGE:
 * ```tsx
 * import { LazyLineChart, LazyBarChart } from '@/components/lazy/LazyCharts'
 *
 * function AnalyticsPage() {
 *   return (
 *     <Suspense fallback={<ChartSkeleton />}>
 *       <LazyLineChart data={data} />
 *     </Suspense>
 *   )
 * }
 * ```
 *
 * @module components/lazy/LazyCharts
 * @since 1.1.0
 */

'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/feedback';

/**
 * Loading fallback for chart components
 * Provides skeleton UI while chart library is being loaded
 */
const ChartLoadingFallback = () => (
  <div className="w-full h-64 flex items-center justify-center">
    <div className="space-y-3 w-full">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-32 w-full" />
    </div>
  </div>
);

/**
 * Lazy-loaded Line Chart component
 * Uses dynamic import with loading fallback
 */
export const LazyLineChart = dynamic(
  () => import('@/components/ui/charts/LineChart').then((mod) => mod.LineChart),
  {
    loading: () => <ChartLoadingFallback />,
    ssr: false, // Charts don't need SSR - they're data visualization
  }
);

/**
 * Lazy-loaded Bar Chart component
 */
export const LazyBarChart = dynamic(
  () => import('@/components/ui/charts/BarChart').then((mod) => mod.BarChart),
  {
    loading: () => <ChartLoadingFallback />,
    ssr: false,
  }
);

/**
 * Lazy-loaded Pie Chart component
 */
export const LazyPieChart = dynamic(
  () => import('@/components/ui/charts/PieChart').then((mod) => mod.PieChart),
  {
    loading: () => <ChartLoadingFallback />,
    ssr: false,
  }
);

/**
 * Lazy-loaded Area Chart component
 */
export const LazyAreaChart = dynamic(
  () => import('@/components/ui/charts/AreaChart').then((mod) => mod.AreaChart),
  {
    loading: () => <ChartLoadingFallback />,
    ssr: false,
  }
);

/**
 * Lazy-loaded Composed Chart component
 * For complex multi-series charts
 */
export const LazyComposedChart = dynamic(
  () => import('@/components/ui/charts/ComposedChart').then((mod) => mod.ComposedChart),
  {
    loading: () => <ChartLoadingFallback />,
    ssr: false,
  }
);

/**
 * Chart Skeleton Component
 * Export for use in other loading states
 */
export { ChartLoadingFallback as ChartSkeleton };
