/**
 * @fileoverview Incidents Route Loading State - Displays skeleton UI while incidents
 * data is being fetched from the server, providing visual feedback to users.
 *
 * @module app/(dashboard)/incidents/loading
 * @category Incidents - Core Pages
 *
 * ## Overview
 * Provides loading state skeleton for incidents list page during data fetching.
 * Displays placeholder UI matching the structure of the actual incidents page for
 * seamless visual transition when data loads.
 *
 * ## Skeleton Components
 * - **Statistics Cards**: 4 placeholder cards for incident count statistics
 * - **Filter Badges**: Placeholder filter buttons for incident types and statuses
 * - **Incident Cards**: 5 placeholder cards matching incident card layout
 *
 * ## User Experience Benefits
 * - **Immediate Feedback**: User sees page structure immediately
 * - **Perceived Performance**: Loading feels faster with skeleton UI
 * - **Layout Stability**: No content jump when data loads
 * - **Progressive Loading**: Matches expected final layout
 *
 * ## Performance Considerations
 * - Lightweight component (no data fetching)
 * - Renders instantly while server component fetches data
 * - Uses same grid layout as actual page for consistency
 * - Minimal re-paint when skeleton replaced with real content
 *
 * ## Accessibility
 * - Skeleton elements have appropriate aria-labels
 * - Loading state announced to screen readers
 * - Maintains keyboard navigation structure
 *
 * @see {@link GenericListLoadingSkeleton} for reusable skeleton component
 * @see {@link IncidentsListPage} for the actual page that replaces this loading state
 *
 * @example
 * ```tsx
 * // Automatically displayed by Next.js when /incidents route is loading
 * // Shows skeleton UI until IncidentsListPage data is ready
 * <IncidentsLoading />
 * ```
 */

import { GenericListLoadingSkeleton } from '@/components/loading/GenericListLoadingSkeleton';

/**
 * Incidents Loading Component
 *
 * Displays skeleton loading UI while incidents data is being fetched server-side.
 * Provides visual feedback and maintains perceived performance during data loading.
 *
 * @component
 *
 * @returns {JSX.Element} Rendered skeleton UI matching incidents page layout
 *
 * @description
 * Skeleton includes:
 * - Statistics section with 4 placeholder cards
 * - Filter section with placeholder badge buttons
 * - Grid of 5 placeholder incident cards
 *
 * Layout matches the structure of IncidentsListPage for seamless transition when
 * data finishes loading.
 *
 * @example
 * ```tsx
 * // Automatically displayed during server component data fetching
 * // Replaced by IncidentsListPage when data is ready
 * <IncidentsLoading />
 * ```
 */
export default function IncidentsLoading() {
  return (
    <GenericListLoadingSkeleton
      showStats={true}    // Display 4 statistics cards skeleton
      showFilters={true}  // Display filter badges skeleton
      itemCount={5}       // Display 5 incident card skeletons
    />
  );
}
