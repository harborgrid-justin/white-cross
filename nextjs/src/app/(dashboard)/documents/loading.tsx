/**
 * @fileoverview Documents Route Loading State - Skeleton UI for document list loading
 *
 * This loading component provides a skeleton UI that displays while the documents
 * page loads data from the API. It maintains layout stability and provides visual
 * feedback to users during data fetching, improving perceived performance.
 *
 * **Loading Strategy:**
 * - Instant skeleton display prevents layout shift
 * - Shows expected structure before data arrives
 * - Maintains consistent spacing and dimensions
 * - Provides visual feedback that loading is occurring
 *
 * **Skeleton Features:**
 * - Filter controls placeholder (search, category filters)
 * - Document card placeholders (8 items by default)
 * - Animated pulse effect for loading indication
 * - No stats section (documents don't show summary stats)
 *
 * **Performance Benefits:**
 * - Prevents Cumulative Layout Shift (CLS)
 * - Improves Core Web Vitals scores
 * - Reduces perceived loading time
 * - Provides better user experience during data fetch
 *
 * @module app/documents/loading
 * @requires @/components/loading/GenericListLoadingSkeleton - Reusable skeleton component
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/loading|Next.js Loading UI}
 */

import { GenericListLoadingSkeleton } from '@/components/loading/GenericListLoadingSkeleton';

/**
 * Documents Loading State Component
 *
 * Renders a skeleton UI while document list data is being fetched from the API.
 * Uses the GenericListLoadingSkeleton component configured for document layout.
 *
 * **Configuration:**
 * - showStats: false - Documents don't display summary statistics
 * - showFilters: true - Shows filter controls skeleton
 * - itemCount: 8 - Number of document card placeholders to display
 *
 * **Automatic Behavior:**
 * - Next.js automatically shows this during Suspense boundaries
 * - Replaces with actual content once data loads
 * - No manual invocation required
 *
 * @function DocumentsLoading
 * @returns {JSX.Element} Skeleton UI for documents list
 *
 * @example
 * // Next.js automatically uses this when loading.tsx exists
 * // User navigates to /documents
 * // 1. Skeleton appears immediately
 * // 2. API call initiated for document data
 * // 3. Skeleton replaced with actual documents when loaded
 */
export default function DocumentsLoading() {
  return (
    <GenericListLoadingSkeleton
      showStats={false}
      showFilters={true}
      itemCount={8}
    />
  );
}
