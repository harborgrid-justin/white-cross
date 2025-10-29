/**
 * @fileoverview Appointments Components Index - Dynamically Loaded
 * @module components/appointments
 *
 * This file provides dynamically loaded exports for heavy appointment components.
 * FullCalendar is ~200KB gzipped, so we lazy load it to reduce initial bundle size.
 */

import dynamic from 'next/dynamic';
import CalendarSkeleton from './CalendarSkeleton';

/**
 * Dynamically imported AppointmentCalendar component
 *
 * Benefits:
 * - Reduces initial bundle by ~200KB (gzipped)
 * - Improves First Contentful Paint (FCP)
 * - Improves Time to Interactive (TTI)
 * - Only loads when calendar is actually rendered
 *
 * Trade-off:
 * - Slight delay when first displaying calendar
 * - Mitigated by loading skeleton
 */
export const AppointmentCalendar = dynamic(
  () => import('./AppointmentCalendar'),
  {
    loading: () => <CalendarSkeleton />,
    ssr: false, // FullCalendar uses window object
  }
);

// Export the skeleton separately for custom loading states
export { default as CalendarSkeleton } from './CalendarSkeleton';

// Re-export other appointment components normally (not heavy)
// Add more exports here as needed
