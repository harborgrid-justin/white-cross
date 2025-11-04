/**
 * Health Management Query Keys
 * TanStack Query key factory for healthcare data management
 */

import type { PatientFilters, AppointmentFilters, MedicalRecordFilters, VitalType } from './types';

// ============================================================================
// QUERY KEY FACTORY
// ============================================================================

export const healthKeys = {
  // Base keys
  all: ['health'] as const,

  // Patients
  patients: () => [...healthKeys.all, 'patients'] as const,
  patient: (id: string) => [...healthKeys.patients(), id] as const,
  patientsByFilters: (filters: PatientFilters) => [...healthKeys.patients(), 'filtered', filters] as const,
  patientSearch: (query: string) => [...healthKeys.patients(), 'search', query] as const,

  // Appointments
  appointments: () => [...healthKeys.all, 'appointments'] as const,
  appointment: (id: string) => [...healthKeys.appointments(), id] as const,
  appointmentsByFilters: (filters: AppointmentFilters) => [...healthKeys.appointments(), 'filtered', filters] as const,
  appointmentsByPatient: (patientId: string) => [...healthKeys.appointments(), 'patient', patientId] as const,
  appointmentsByProvider: (providerId: string) => [...healthKeys.appointments(), 'provider', providerId] as const,
  appointmentsToday: () => [...healthKeys.appointments(), 'today'] as const,

  // Medical Records
  medicalRecords: () => [...healthKeys.all, 'medical-records'] as const,
  medicalRecord: (id: string) => [...healthKeys.medicalRecords(), id] as const,
  medicalRecordsByPatient: (patientId: string) => [...healthKeys.medicalRecords(), 'patient', patientId] as const,
  medicalRecordsByFilters: (filters: MedicalRecordFilters) => [...healthKeys.medicalRecords(), 'filtered', filters] as const,

  // Providers
  providers: () => [...healthKeys.all, 'providers'] as const,
  provider: (id: string) => [...healthKeys.providers(), id] as const,
  providersByDepartment: (department: string) => [...healthKeys.providers(), 'department', department] as const,

  // Facilities
  facilities: () => [...healthKeys.all, 'facilities'] as const,
  facility: (id: string) => [...healthKeys.facilities(), id] as const,

  // Vitals
  vitals: () => [...healthKeys.all, 'vitals'] as const,
  vitalsByPatient: (patientId: string) => [...healthKeys.vitals(), 'patient', patientId] as const,
  vitalsByType: (patientId: string, type: VitalType) => [...healthKeys.vitals(), 'patient', patientId, 'type', type] as const,

  // Medications
  medications: () => [...healthKeys.all, 'medications'] as const,
  medicationsByPatient: (patientId: string) => [...healthKeys.medications(), 'patient', patientId] as const,

  // Allergies
  allergies: () => [...healthKeys.all, 'allergies'] as const,
  allergiesByPatient: (patientId: string) => [...healthKeys.allergies(), 'patient', patientId] as const,

  // Lab Results
  labResults: () => [...healthKeys.all, 'lab-results'] as const,
  labResultsByPatient: (patientId: string) => [...healthKeys.labResults(), 'patient', patientId] as const,

  // Clinical Alerts
  clinicalAlerts: () => [...healthKeys.all, 'clinical-alerts'] as const,
  clinicalAlertsByPatient: (patientId: string) => [...healthKeys.clinicalAlerts(), 'patient', patientId] as const,
  activeClinicalAlerts: () => [...healthKeys.clinicalAlerts(), 'active'] as const,
  criticalAlerts: () => [...healthKeys.clinicalAlerts(), 'critical'] as const,

  // Analytics
  metrics: () => [...healthKeys.all, 'metrics'] as const,
  patientAnalytics: () => [...healthKeys.all, 'analytics', 'patients'] as const,
  appointmentAnalytics: () => [...healthKeys.all, 'analytics', 'appointments'] as const,
  providerAnalytics: () => [...healthKeys.all, 'analytics', 'providers'] as const
} as const;
