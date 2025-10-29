/**
 * Query Hooks Index
 *
 * Central export point for all TanStack Query hooks
 *
 * @module lib/query/hooks
 * @version 1.0.0
 */

// Dashboard hooks
export * from './useDashboard';

// Student hooks
export * from './useStudents';

// Appointment hooks
export * from './useAppointments';

// Medication hooks
export * from './useMedications';

// Re-export query keys for convenience
export { studentsKeys } from './useStudents';
export { dashboardKeys } from './useDashboard';
export { appointmentsKeys } from './useAppointments';
export { medicationsKeys } from './useMedications';
