/**
 * @fileoverview Communications Loading State - Skeleton UI
 *
 * **Purpose**: Provides skeleton loading UI for communications pages during initial data fetch
 * or navigation. Improves perceived performance by showing content placeholders instead of
 * blank screens while message data loads.
 *
 * **Features**:
 * - Generic list skeleton with filters
 * - Displays 10 placeholder items
 * - Matches layout of actual inbox
 * - No stats section (suitable for message lists)
 *
 * **Performance Benefits**:
 * - Reduces layout shift during loading
 * - Provides immediate visual feedback
 * - Improves perceived load time
 * - Maintains UI structure consistency
 *
 * **Next.js Integration**:
 * - Automatically shown by Next.js during Suspense boundaries
 * - Rendered while async data fetching occurs
 * - Replaced with actual content when data loads
 *
 * @module CommunicationsLoading
 * @requires @/components/loading/GenericListLoadingSkeleton
 *
 * @example
 * ```tsx
 * // Automatically used by Next.js for /communications route
 * // When navigating or on initial load, this component shows
 * // until the main page data is ready
 * ```
 *
 * @see {@link GenericListLoadingSkeleton} - Reusable skeleton component
 *
 * @since 1.0.0
 */

import { GenericListLoadingSkeleton } from '@/components/loading/GenericListLoadingSkeleton';

/**
 * Communications Loading Component
 *
 * Displays a skeleton UI that matches the communications inbox layout.
 * Shows filter placeholders and 10 message thread skeletons.
 *
 * @returns {JSX.Element} Skeleton loading UI for communications
 *
 * @example
 * ```tsx
 * // Used automatically by Next.js during route loading
 * export default function CommunicationsLoading() {
 *   return <GenericListLoadingSkeleton showFilters={true} itemCount={10} />;
 * }
 * ```
 */
export default function CommunicationsLoading() {
  return (
    <GenericListLoadingSkeleton
      showStats={false}
      showFilters={true}
      itemCount={10}
    />
  );
}
