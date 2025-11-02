/**
 * Lazy-loaded Calendar Components
 *
 * This module provides lazy-loaded wrappers for FullCalendar library.
 * FullCalendar is a large dependency (~150KB) used primarily in appointment
 * scheduling. Lazy loading reduces initial bundle size significantly.
 *
 * PERFORMANCE IMPACT:
 * - FullCalendar bundle size: ~158KB (gzipped: ~45KB)
 * - Initial load improvement: Calendar loads only when needed
 * - Route-based code splitting: Appointment pages load calendar separately
 *
 * USAGE:
 * ```tsx
 * import { LazyAppointmentCalendar } from '@/components/lazy/LazyCalendar'
 *
 * function AppointmentsPage() {
 *   return (
 *     <Suspense fallback={<CalendarSkeleton />}>
 *       <LazyAppointmentCalendar />
 *     </Suspense>
 *   )
 * }
 * ```
 *
 * @module components/lazy/LazyCalendar
 * @since 1.1.0
 */

'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/feedback';

/**
 * Loading fallback for calendar components
 * Provides skeleton UI matching calendar layout
 */
const CalendarLoadingFallback = () => (
  <div className="w-full h-[600px] border rounded-lg p-4">
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    </div>
  </div>
);

/**
 * Lazy-loaded Appointment Calendar
 * Primary calendar component for appointment scheduling
 */
export const LazyAppointmentCalendar = dynamic(
  () => import('@/components/appointments/AppointmentCalendar').then((mod) => mod.default),
  {
    loading: () => <CalendarLoadingFallback />,
    ssr: false, // Calendar is interactive and doesn't benefit from SSR
  }
);

/**
 * Calendar Skeleton Component
 * Export for use in other loading states
 */
export { CalendarLoadingFallback as CalendarSkeleton };
