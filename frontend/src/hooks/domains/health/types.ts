/**
 * Health Management Domain Types
 * Interfaces and enums for healthcare data management
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

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show'
}

export enum AppointmentType {
  CONSULTATION = 'consultation',
  FOLLOW_UP = 'follow_up',
  PROCEDURE = 'procedure',
  DIAGNOSTIC = 'diagnostic',
  EMERGENCY = 'emergency',
  PREVENTIVE = 'preventive'
}

export enum VitalType {
  BLOOD_PRESSURE = 'blood_pressure',
  HEART_RATE = 'heart_rate',
  TEMPERATURE = 'temperature',
  WEIGHT = 'weight',
  HEIGHT = 'height',
  OXYGEN_SATURATION = 'oxygen_saturation',
  BLOOD_GLUCOSE = 'blood_glucose',
  RESPIRATORY_RATE = 'respiratory_rate'
}

export enum MedicationStatus {
  ACTIVE = 'active',
  DISCONTINUED = 'discontinued',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed'
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

export enum Priority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
  CRITICAL = 'critical'
}

// ============================================================================
// INTERFACES
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

export interface Provider {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  specialty: string;
  licenseNumber: string;
  email: string;
  phone: string;
  department: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Facility {
  id: string;
  name: string;
  type: string;
  address: Address;
  phone: string;
  email: string;
  capacity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  providerId: string;
  facilityId: string;
  type: AppointmentType;
  status: AppointmentStatus;
  scheduledDateTime: string;
  duration: number; // minutes
  reason: string;
  notes?: string;
  checkedInAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  patient?: Patient;
  provider?: Provider;
  facility?: Facility;
}

export interface VitalSigns {
  id: string;
  patientId: string;
  type: VitalType;
  value: number;
  unit: string;
  recordedAt: string;
  recordedBy: string;
  notes?: string;
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

export interface Diagnosis {
  id: string;
  patientId: string;
  code: string; // ICD-10 code
  description: string;
  type: string; // primary, secondary, etc.
  status: string;
  onsetDate?: string;
  resolvedDate?: string;
  diagnosedBy: string;
  confidence: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Procedure {
  id: string;
  patientId: string;
  code: string; // CPT code
  description: string;
  performedDate: string;
  performedBy: string;
  facility: string;
  duration?: number;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LabResult {
  id: string;
  patientId: string;
  testName: string;
  testCode: string;
  result: string;
  unit?: string;
  referenceRange: string;
  status: string;
  orderedDate: string;
  resultDate: string;
  orderedBy: string;
  labFacility: string;
  isAbnormal: boolean;
  isCritical: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  providerId: string;
  visitDate: string;
  visitType: string;
  chiefComplaint: string;
  historyOfPresentIllness: string;
  assessment: string;
  plan: string;
  vitals: VitalSigns[];
  medications: Medication[];
  allergies: Allergy[];
  diagnoses: Diagnosis[];
  procedures: Procedure[];
  labResults: LabResult[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClinicalAlert {
  id: string;
  patientId: string;
  type: string;
  priority: Priority;
  message: string;
  source: string;
  triggeredAt: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  isActive: boolean;
}

export interface HealthMetrics {
  totalPatients: number;
  activePatients: number;
  appointmentsToday: number;
  criticalAlerts: number;
  avgAppointmentDuration: number;
  patientSatisfactionScore: number;
  noShowRate: number;
  departmentUtilization: Record<string, number>;
  providerWorkload: Record<string, number>;
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

export interface AppointmentFilters {
  status?: AppointmentStatus[];
  type?: AppointmentType[];
  providerId?: string[];
  facilityId?: string[];
  dateRange?: [string, string];
  patientId?: string;
  search?: string;
}

export interface MedicalRecordFilters {
  patientId?: string;
  providerId?: string[];
  visitDateRange?: [string, string];
  diagnosisCode?: string[];
  hasLabResults?: boolean;
  hasProcedures?: boolean;
  search?: string;
}
