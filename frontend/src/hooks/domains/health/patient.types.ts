/**
 * Patient Domain Types
 * Patient-related interfaces and enums
 */

// ============================================================================
// ENUMS
// ============================================================================

export enum PatientStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DECEASED = 'deceased',
  TRANSFERRED = 'transferred'
}

export enum AllergyType {
  DRUG = 'drug',
  FOOD = 'food',
  ENVIRONMENTAL = 'environmental',
  OTHER = 'other'
}

export enum SeverityLevel {
  MILD = 'mild',
  MODERATE = 'moderate',
  SEVERE = 'severe',
  LIFE_THREATENING = 'life_threatening'
}

export enum MedicationStatus {
  ACTIVE = 'active',
  DISCONTINUED = 'discontinued',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed'
}

// ============================================================================
// SHARED INTERFACES
// ============================================================================

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  subscriberName: string;
  effectiveDate: string;
  expirationDate?: string;
}

// ============================================================================
// PATIENT INTERFACES
// ============================================================================

export interface Patient {
  id: string;
  mrn: string; // Medical Record Number
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  address: Address;
  emergencyContact: EmergencyContact;
  insuranceInfo: InsuranceInfo;
  status: PatientStatus;
  primaryPhysician?: string;
  preferredLanguage: string;
  createdAt: string;
  updatedAt: string;
}

export interface Allergy {
  id: string;
  patientId: string;
  allergen: string;
  type: AllergyType;
  severity: SeverityLevel;
  reaction: string;
  onsetDate?: string;
  notes?: string;
  verifiedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Medication {
  id: string;
  patientId: string;
  name: string;
  dosage: string;
  frequency: string;
  route: string;
  startDate: string;
  endDate?: string;
  status: MedicationStatus;
  prescribedBy: string;
  instructions: string;
  refillsRemaining: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// FILTER INTERFACES
// ============================================================================

export interface PatientFilters {
  status?: PatientStatus[];
  primaryPhysician?: string[];
  department?: string[];
  ageRange?: [number, number];
  lastVisitRange?: [string, string];
  hasInsurance?: boolean;
  hasAllergies?: boolean;
  search?: string;
}
