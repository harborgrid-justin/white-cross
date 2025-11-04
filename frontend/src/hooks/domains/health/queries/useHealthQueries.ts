/**
 * Health Management Query Hooks - Main Export File
 * Re-exports all health query hooks from broken-down modules for backward compatibility
 *
 * This file was broken down into smaller modules:
 * - usePatientAppointmentQueries.ts (Patient and Appointment queries)
 * - useMedicalRecordProviderQueries.ts (Medical Records, Providers, and Facilities)
 * - useClinicalDataQueries.ts (Vitals, Medications, Allergies, Lab Results)
 * - useAlertAnalyticsQueries.ts (Clinical Alerts and Analytics)
 */

// Re-export all Patient and Appointment queries
export {
  usePatients,
  usePatient,
  usePatientSearch,
  useAppointments,
  useAppointment,
  useAppointmentsByPatient,
  useAppointmentsByProvider,
  useAppointmentsToday,
} from './usePatientAppointmentQueries';

// Re-export all Medical Record, Provider, and Facility queries
export {
  useMedicalRecords,
  useMedicalRecord,
  useMedicalRecordsByPatient,
  useProviders,
  useProvider,
  useProvidersByDepartment,
  useFacilities,
  useFacility,
} from './useMedicalRecordProviderQueries';

// Re-export all Clinical Data queries (Vitals, Medications, Allergies, Lab Results)
export {
  useVitalsByPatient,
  useVitalsByType,
  useMedicationsByPatient,
  useAllergiesByPatient,
  useLabResultsByPatient,
} from './useClinicalDataQueries';

// Re-export all Clinical Alert and Analytics queries
export {
  useClinicalAlertsByPatient,
  useActiveClinicalAlerts,
  useCriticalAlerts,
  useHealthMetrics,
  usePatientAnalytics,
  useAppointmentAnalytics,
  useProviderAnalytics,
} from './useAlertAnalyticsQueries';
