/**
 * @fileoverview Medication Detail Loading Skeletons
 * @module app/(dashboard)/medications/[id]/_components/MedicationDetailSkeleton
 *
 * @description
 * Loading skeleton components for medication detail page.
 * Displays animated placeholders while data loads for better perceived performance.
 *
 * **Features:**
 * - Animated pulse effect
 * - Matches layout of actual content
 * - Improves perceived performance
 * - Reduces layout shift
 *
 * **Components:**
 * - `DetailsSkeleton`: Loading state for MedicationDetails component
 * - `LogSkeleton`: Loading state for administration log
 *
 * @since 1.0.0
 */

/**
 * MedicationDetails Loading Skeleton
 *
 * Displays animated placeholder while medication details load.
 * Matches the layout structure of the MedicationDetails component.
 *
 * **Visual Design:**
 * - Card with border
 * - Animated pulse effect
 * - Gray placeholder bars
 * - Spacing matches actual content
 *
 * **Performance:**
 * - Pure presentational component
 * - No data fetching
 * - Lightweight rendering
 *
 * @component
 * @returns {JSX.Element} Rendered details skeleton
 *
 * @example
 * ```tsx
 * <Suspense fallback={<DetailsSkeleton />}>
 *   <MedicationDetails medication={data} />
 * </Suspense>
 * ```
 */
export function DetailsSkeleton(): JSX.Element {
  return (
    <div className="animate-pulse rounded-lg border border-gray-200 bg-white p-6">
      <div className="space-y-4">
        {/* Heading placeholder */}
        <div className="h-6 w-1/4 rounded bg-gray-200"></div>

        {/* Content placeholders */}
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-gray-100"></div>
          <div className="h-4 w-5/6 rounded bg-gray-100"></div>
        </div>
      </div>
    </div>
  );
}

DetailsSkeleton.displayName = 'DetailsSkeleton';

/**
 * Administration Log Loading Skeleton
 *
 * Displays animated placeholder while administration log loads.
 * Shows 5 skeleton rows to match typical log display.
 *
 * **Visual Design:**
 * - Stacked rows with borders
 * - Animated pulse effect
 * - Gray placeholder bars
 * - Status badge placeholder
 *
 * **Performance:**
 * - Pure presentational component
 * - No data fetching
 * - Lightweight rendering
 *
 * @component
 * @returns {JSX.Element} Rendered log skeleton
 *
 * @example
 * ```tsx
 * <Suspense fallback={<LogSkeleton />}>
 *   <AdministrationLog records={data} />
 * </Suspense>
 * ```
 */
export function LogSkeleton(): JSX.Element {
  return (
    <div className="space-y-3 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between border-b border-gray-100 pb-3"
        >
          {/* Left side - date and nurse info */}
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 rounded bg-gray-200"></div>
            <div className="h-3 w-1/4 rounded bg-gray-100"></div>
          </div>

          {/* Right side - status badge */}
          <div className="h-6 w-16 rounded bg-gray-200"></div>
        </div>
      ))}
    </div>
  );
}

LogSkeleton.displayName = 'LogSkeleton';
