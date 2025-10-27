/**
 * @fileoverview Inventory Loading State Component
 *
 * Skeleton UI displayed during server-side data fetching for inventory routes.
 * Provides visual feedback to users while inventory statistics, alerts, and
 * stock data are being loaded from the backend. Implements Next.js loading.tsx
 * convention for instant loading states.
 *
 * **Loading Behavior:**
 * - Displays immediately on route navigation
 * - Shows statistics skeleton for dashboard metrics
 * - Includes filter placeholders for search/filtering UI
 * - Renders 8 item placeholders for inventory lists
 *
 * **UX Considerations:**
 * - Prevents layout shift by matching content dimensions
 * - Provides perceived performance improvement
 * - Reduces user frustration during data fetching
 *
 * @module app/(dashboard)/inventory/loading
 * @requires GenericListLoadingSkeleton - Reusable loading skeleton component
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/loading} Next.js Loading UI
 */

import { GenericListLoadingSkeleton } from '@/components/loading/GenericListLoadingSkeleton';

/**
 * Inventory Loading Component
 *
 * Next.js loading state component that displays a skeleton UI while inventory
 * data is being fetched. Automatically shown by Next.js during server component
 * suspense boundaries.
 *
 * **Configuration:**
 * - `showStats={true}`: Display statistics card skeletons for metrics
 * - `showFilters={true}`: Show filter/search skeleton controls
 * - `itemCount={8}`: Render 8 placeholder items for typical page view
 *
 * @returns {JSX.Element} Skeleton loading UI matching inventory page layout
 *
 * @example
 * ```tsx
 * // Automatically rendered by Next.js during:
 * // - Initial page load
 * // - Route navigation to /inventory/*
 * // - Server component data fetching
 * ```
 */
export default function InventoryLoading() {
  return (
    <GenericListLoadingSkeleton
      showStats={true}
      showFilters={true}
      itemCount={8}
    />
  );
}
