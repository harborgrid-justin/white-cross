/**
 * @fileoverview Server-Side Utilities Index
 * @module lib/server
 * @category Server
 *
 * Centralized export point for all server-side utilities.
 *
 * **Module Organization:**
 * - `queries.ts` - React cache() wrapped data fetching with TanStack Query prefetching
 * - `fetch.ts` - Legacy server fetch utilities (deprecated)
 * - `api-client.ts` - Simple API client for Server Actions (deprecated)
 *
 * **Recommended Usage:**
 * - For Server Components: Use functions from `queries.ts` or `@/lib/api/nextjs-client`
 * - For Server Actions: Use functions from `@/lib/api/nextjs-client`
 *
 * @version 1.0.0
 * @since 2025-11-04
 */

// ==========================================
// QUERIES (RECOMMENDED)
// ==========================================

// Export all query functions (React cache() wrapped)
export {
  // Students
  getStudent,
  getStudentsList,
  prefetchStudent,
  prefetchStudentsList,
  fetchStudent,
  fetchStudentsList,

  // Medications
  getMedication,
  getMedicationsList,
  prefetchMedication,
  prefetchMedicationsList,
  fetchMedication,
  fetchMedicationsList,

  // Appointments
  getAppointment,
  getAppointmentsList,
  prefetchAppointment,
  prefetchAppointmentsList,
  fetchAppointment,
  fetchAppointmentsList,

  // Incidents
  getIncidentsList,
  prefetchIncidentsList,
  fetchIncidentsList,

  // Dashboard
  getDashboardStats,
  prefetchDashboardStats,
  fetchDashboardStats,

  // Users
  getUsersList,
  getCurrentUser,
  prefetchUsersList,
  prefetchCurrentUser,
  fetchUsersList,
  fetchCurrentUser,

  // Composite prefetch utilities
  prefetchDashboardPage,
  prefetchStudentsPage,
  prefetchMedicationsPage,
  prefetchAppointmentsPage,
} from './queries';

// Export query types
export type {
  QueryParams,
  PaginatedResponse,
} from './queries';

// ==========================================
// LEGACY FETCH UTILITIES (DEPRECATED)
// ==========================================

// Export legacy fetch utilities (for backward compatibility)
export {
  serverFetch as legacyServerFetch,
  serverGet as legacyServerGet,
  serverPost as legacyServerPost,
  serverPut as legacyServerPut,
  serverPatch as legacyServerPatch,
  serverDelete as legacyServerDelete,
  fetchWithAuth as legacyFetchWithAuth,
} from './fetch';

// Export legacy types
export type {
  LegacyServerFetchOptions,
  LegacyServerApiError,
} from './fetch';

// ==========================================
// SERVER ACTION API CLIENT (DEPRECATED)
// ==========================================

// Export server action client utilities
export {
  serverFetch as actionServerFetch,
  serverGet as actionServerGet,
  serverPost as actionServerPost,
  serverPut as actionServerPut,
  serverDelete as actionServerDelete,
  getBackendUrl,
} from './api-client';

// Export server action types
export type {
  ServerActionFetchOptions,
  ServerActionApiResponse,
} from './api-client';

// ==========================================
// DEFAULT EXPORT
// ==========================================

/**
 * Default export with all server utilities
 */
export { default } from './queries';
