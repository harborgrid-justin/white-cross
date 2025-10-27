/**
 * @fileoverview Appointments Route Loading State Component
 * @module app/appointments/loading
 *
 * Displays a skeleton loading UI while appointment data is being fetched from the server.
 * This component provides immediate visual feedback during the data loading phase,
 * improving perceived performance and user experience. The skeleton layout matches
 * the actual appointments interface structure.
 *
 * **Performance Strategy:**
 * - Renders instantly while server components fetch data
 * - Uses Next.js Suspense boundaries for automatic loading state management
 * - Prevents layout shift by matching the final UI structure
 * - Provides visual continuity during navigation between appointment views
 *
 * **Healthcare UX Considerations:**
 * - Shows statistics placeholders to indicate appointment counts will load
 * - Displays filter section skeleton to prepare users for filtering capabilities
 * - Uses 6 item placeholders representing typical appointment list length
 * - Maintains consistent UI structure for better workflow predictability
 *
 * **Accessibility:**
 * - Skeleton elements use appropriate ARIA labels for loading state
 * - Screen readers announce "Loading appointments" to keep users informed
 * - Respects user's motion preferences (no excessive animation)
 *
 * @see {@link GenericListLoadingSkeleton} for the base skeleton component
 *
 * @example
 * ```tsx
 * // Next.js automatically uses this component during server component loading:
 * // In app/(dashboard)/appointments/layout.tsx or page.tsx:
 * <Suspense fallback={<AppointmentsLoading />}>
 *   <AppointmentsList />
 * </Suspense>
 *
 * // The loading component will display while:
 * // - Server is fetching appointment data
 * // - Database queries are executing
 * // - Authentication is being verified
 * ```
 */

import { GenericListLoadingSkeleton } from '@/components/loading/GenericListLoadingSkeleton';

/**
 * Appointments Loading State Component
 *
 * Renders a skeleton UI that mirrors the structure of the appointments list interface.
 * This component is automatically displayed by Next.js during server-side data fetching
 * operations in the appointments route segment.
 *
 * **Component Configuration:**
 * - `showStats={true}`: Displays skeleton for appointment statistics (total, scheduled, etc.)
 * - `showFilters={true}`: Shows skeleton for filter controls (status, date range, search)
 * - `itemCount={6}`: Renders 6 appointment item placeholders (typical page size)
 *
 * **Loading Scenarios:**
 * - Initial page load when fetching all appointments
 * - Navigation between appointment views (calendar, list, today, upcoming)
 * - Filter/search operations that trigger server-side data refetch
 * - Date range changes that require new appointment data
 *
 * **Visual Design:**
 * - Uses shimmer animation for polished loading experience
 * - Gray placeholder blocks maintain spacing and layout
 * - Matches grid/flex layout of actual appointment components
 *
 * @returns {JSX.Element} Skeleton loading UI matching appointments interface structure
 *
 * @example
 * ```tsx
 * // Automatic usage by Next.js (no manual instantiation):
 * // 1. User navigates to /appointments/list
 * // 2. Next.js displays <AppointmentsLoading /> immediately
 * // 3. Server fetches appointment data in background
 * // 4. Once data loads, skeleton is replaced with actual content
 * ```
 */
export default function AppointmentsLoading() {
  return (
    <GenericListLoadingSkeleton
      showStats={true}
      showFilters={true}
      itemCount={6}
    />
  );
}
