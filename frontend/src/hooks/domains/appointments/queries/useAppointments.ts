/**
 * WF-COMP-127 | useAppointments.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: @tanstack/react-query, @/services/api, react-hot-toast
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, functions | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Appointments Domain Hook
 * Provides comprehensive appointment management functionality using TanStack Query
 * Implements enterprise patterns with proper caching, optimistic updates, and error handling
 */

// Re-export query keys
export { appointmentKeys } from './query-keys';

// Re-export query hooks
export {
  useAppointments,
  useUpcomingAppointments,
  useAppointmentStats,
  useWaitlist,
  useAvailability,
  useNurseAvailability,
} from './queries';

// Re-export mutation hooks
export {
  useCreateAppointment,
  useUpdateAppointment,
  useCancelAppointment,
  useMarkNoShow,
  useCreateRecurring,
  useAddToWaitlist,
  useRemoveFromWaitlist,
  useSetAvailability,
  useUpdateAvailability,
  useDeleteAvailability,
  useExportCalendar,
} from './mutations';

// Re-export composite hooks
export {
  useAppointmentDashboard,
} from './composite';
