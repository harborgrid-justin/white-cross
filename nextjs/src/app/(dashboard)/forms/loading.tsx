/**
 * @fileoverview Forms Section Loading State - Skeleton UI for form list loading
 *
 * This loading component provides a skeleton UI that displays while the forms
 * page loads data from the API. It shows placeholders for the expected layout
 * including header, filters, and form cards in a grid pattern.
 *
 * **Loading Strategy:**
 * - Instant skeleton display prevents layout shift
 * - Shows expected grid structure before data arrives
 * - Maintains consistent spacing and card dimensions
 * - Animated pulse effect indicates active loading
 *
 * **Skeleton Components:**
 * - Page header with title and action button
 * - Filter controls (search, status, sort)
 * - Form cards in responsive grid (1/2/3 columns)
 * - Each card shows: title, description, badges, action button
 *
 * **Responsive Behavior:**
 * - Mobile: Single column
 * - Tablet: Two columns
 * - Desktop: Three columns
 * - Matches actual form card layout exactly
 *
 * **Performance Benefits:**
 * - Prevents Cumulative Layout Shift (CLS)
 * - Improves Core Web Vitals scores
 * - Reduces perceived loading time
 * - Provides immediate visual feedback
 *
 * @module app/forms/loading
 * @requires @/components/layouts/Container - Layout container component
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/loading|Next.js Loading UI}
 */

import { Container } from '@/components/layouts/Container';

/**
 * Forms Loading State Component
 *
 * Renders a skeleton UI while form list data is being fetched from the API.
 * The skeleton structure matches the actual forms page layout for smooth
 * transition when data loads.
 *
 * **Skeleton Structure:**
 * 1. **Header Section**:
 *    - Title placeholder (32px height)
 *    - Description placeholder (16px height)
 *    - "Create Form" button placeholder
 *
 * 2. **Filter Section**:
 *    - Search input placeholder
 *    - Status filter dropdown placeholder
 *    - Sort dropdown placeholder
 *
 * 3. **Forms Grid**:
 *    - 6 form card placeholders
 *    - Each card contains:
 *      - Title (24px height)
 *      - Description (2 lines)
 *      - Status badges (2 pills)
 *      - Action button
 *
 * **Animation:**
 * - Pulse animation on entire container
 * - Creates subtle pulsing effect
 * - Indicates active loading state
 * - CSS animation for performance
 *
 * **Automatic Behavior:**
 * - Next.js automatically shows this during Suspense boundaries
 * - Replaces with actual content once data loads
 * - No manual invocation required
 * - Works with React 18 Suspense
 *
 * @function FormsLoading
 * @returns {JSX.Element} Skeleton UI for forms list
 *
 * @example
 * // Next.js automatically uses this when loading.tsx exists
 * // User navigates to /forms
 * // 1. Skeleton appears immediately with grid layout
 * // 2. API call initiated for form data
 * // 3. Skeleton replaced with actual forms when loaded
 * // 4. Smooth transition with no layout shift
 */
export default function FormsLoading() {
  return (
    <Container>
      {/* Pulse animation container for entire skeleton */}
      <div className="space-y-6 animate-pulse">
        {/* Header section skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            {/* Page title placeholder */}
            <div className="h-8 w-32 bg-gray-200 rounded"></div>
            {/* Page description placeholder */}
            <div className="h-4 w-64 bg-gray-200 rounded"></div>
          </div>
          {/* "Create Form" button placeholder */}
          <div className="h-10 w-32 bg-gray-200 rounded"></div>
        </div>

        {/* Filters section skeleton */}
        <div className="flex gap-4">
          {/* Search input placeholder */}
          <div className="h-10 w-48 bg-gray-200 rounded"></div>
          {/* Status filter placeholder */}
          <div className="h-10 w-48 bg-gray-200 rounded"></div>
          {/* Sort dropdown placeholder */}
          <div className="h-10 w-48 bg-gray-200 rounded"></div>
        </div>

        {/* Forms grid skeleton - 6 form cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 space-y-4">
              {/* Form title placeholder */}
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              {/* Form description placeholder (2 lines) */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
              {/* Status badges placeholder */}
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
              </div>
              {/* Action button placeholder */}
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
