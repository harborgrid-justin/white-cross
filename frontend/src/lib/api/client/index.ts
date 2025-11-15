/**
 * @fileoverview Client-Side API Utilities Barrel Export
 * @module lib/api/client
 * @category API Client
 *
 * Centralized exports for all client-side API utilities including:
 * - Server-side data fetching queries (Server Components)
 * - Cache invalidation server actions
 *
 * @version 1.0.0
 * @since 2025-11-15
 */

// ==========================================
// SERVER-SIDE QUERIES (Server Components)
// ==========================================

export {
  // Type Definitions
  type QueryParams,
  type PaginatedResponse,
  type Student,
  type Medication,
  type Appointment,
  type DashboardStats,
  type User,

  // Students Queries
  getStudent,
  getStudentsList,
  prefetchStudent,
  prefetchStudentsList,
  fetchStudent,
  fetchStudentsList,

  // Medications Queries
  getMedication,
  getMedicationsList,
  getOTCMedications,

  // Appointments Queries
  getAppointment,
  getAppointmentsList,

  // Dashboard Queries
  getDashboardStats,

  // Users Queries
  getUsersList,
  getCurrentUser,

  // Composite Utilities
  prefetchDashboardPage,
} from './queries';

// ==========================================
// CACHE INVALIDATION SERVER ACTIONS
// ==========================================

export {
  invalidateAppointmentsCacheAction,
  invalidateAppointmentCacheAction,
  invalidateStudentCacheAction,
  invalidatePageCacheAction,
  emergencyCacheClearAction,
} from './cache-actions';
