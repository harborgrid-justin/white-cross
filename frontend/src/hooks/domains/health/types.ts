/**
 * Health Management Domain Types
 * Interfaces and enums for healthcare data management
 *
 * This file re-exports all types from the modularized type files.
 */

// Patient types
export type {
  Address,
  EmergencyContact,
  InsuranceInfo,
  Patient,
  Allergy,
  Medication,
  PatientFilters
} from './patient.types';

export {
  PatientStatus,
  AllergyType,
  SeverityLevel,
  MedicationStatus
} from './patient.types';

// Appointment types
export type {
  Appointment,
  AppointmentFilters
} from './appointment.types';

export {
  AppointmentStatus,
  AppointmentType
} from './appointment.types';

// Provider types
export type {
  Provider,
  Facility
} from './provider.types';

// Medical record types
export type {
  VitalSigns,
  Diagnosis,
  Procedure,
  LabResult,
  MedicalRecord,
  ClinicalAlert,
  HealthMetrics,
  MedicalRecordFilters
} from './medical-record.types';

export {
  VitalType,
  Priority
} from './medical-record.types';
