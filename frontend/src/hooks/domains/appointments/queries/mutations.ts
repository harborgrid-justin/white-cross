/**
 * WF-COMP-127 | mutations.ts - Appointment mutation hooks
 * Purpose: TanStack Query hooks for appointment data mutations
 * Upstream: React, TanStack Query | Dependencies: @tanstack/react-query, @/services/api, react-hot-toast
 * Downstream: Components, forms | Called by: React component tree
 * Related: queries.ts, query-keys.ts
 * Exports: Mutation hooks | Key Features: Optimistic updates, cache invalidation
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: User action → Mutation → Cache update → UI refresh
 * LLM Context: TanStack Query hooks for appointment mutations with optimistic updates
 */

// =====================
// RE-EXPORTS
// =====================

// Appointment mutations
export {
  useCreateAppointment,
  useUpdateAppointment,
  useCancelAppointment,
  useMarkNoShow,
  useCreateRecurring,
} from './appointment-mutations';

// Waitlist mutations
export {
  useAddToWaitlist,
  useRemoveFromWaitlist,
} from './waitlist-mutations';

// Availability mutations
export {
  useSetAvailability,
  useUpdateAvailability,
  useDeleteAvailability,
} from './availability-mutations';

// Calendar mutations
export {
  useExportCalendar,
} from './calendar-mutations';
