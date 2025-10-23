/**
 * Medication Domain Types
 * Type definitions for medication domain objects
 */

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  studentId: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'paused' | 'completed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicationAdministration {
  id: string;
  medicationId: string;
  studentId: string;
  administeredAt: string;
  administeredBy: string;
  dosageGiven: string;
  notes?: string;
}

export interface MedicationFormState {
  name: string;
  dosage: string;
  frequency: string;
  studentId: string;
  startDate: string;
  endDate?: string;
  notes?: string;
}

export interface MedicationValidationErrors {
  name?: string;
  dosage?: string;
  frequency?: string;
  studentId?: string;
  startDate?: string;
  endDate?: string;
}
