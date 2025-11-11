/**
 * Health Records API Type Definitions
 * 
 * Comprehensive type definitions for all health record related entities:
 * - Health Records
 * - Allergies
 * - Chronic Conditions
 * - Vaccinations
 * - Screenings
 * - Growth Measurements
 * - Vital Signs
 * - Health Summaries
 * - Bulk Import/Export
 *
 * @module services/modules/healthRecords/types
 */

import type { PaginationParams, PaginatedResponse } from '../../types';

// ==========================================
// HEALTH RECORD TYPES
// ==========================================

export interface HealthRecord {
  id: string;
  studentId: string;
  type: HealthRecordType;
  date: string;
  description: string;
  diagnosis?: string;
  treatment?: string;
  provider?: string;
  providerNPI?: string;
  location?: string;
  notes?: string;
  attachments?: string[];
  isConfidential: boolean;
  followUpRequired: boolean;
  followUpDate?: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type HealthRecordType =
  | 'GENERAL_VISIT'
  | 'INJURY'
  | 'ILLNESS'
  | 'MEDICATION'
  | 'VACCINATION'
  | 'SCREENING'
  | 'PHYSICAL_EXAM'
  | 'EMERGENCY'
  | 'MENTAL_HEALTH'
  | 'DENTAL'
  | 'VISION'
  | 'HEARING'
  | 'OTHER';

export interface HealthRecordCreate {
  studentId: string;
  type: HealthRecordType;
  date: string;
  description: string;
  diagnosis?: string;
  treatment?: string;
  provider?: string;
  providerNPI?: string;
  location?: string;
  notes?: string;
  attachments?: string[];
  isConfidential?: boolean;
  followUpRequired?: boolean;
  followUpDate?: string;
}

export interface HealthRecordUpdate {
  type?: HealthRecordType;
  date?: string;
  description?: string;
  diagnosis?: string;
  treatment?: string;
  provider?: string;
  providerNPI?: string;
  location?: string;
  notes?: string;
  attachments?: string[];
  isConfidential?: boolean;
  followUpRequired?: boolean;
  followUpDate?: string;
}

export interface HealthRecordFilters extends PaginationParams {
  type?: HealthRecordType;
  dateFrom?: string;
  dateTo?: string;
  provider?: string;
  followUpRequired?: boolean;
  isConfidential?: boolean;
}

// ==========================================
// ALLERGY TYPES
// ==========================================

export interface Allergy {
  id: string;
  studentId: string;
  allergen: string;
  allergyType: AllergyType;
  severity: AllergySeverity;
  reaction?: string;
  symptoms?: string[];
  treatment?: string;
  onsetDate?: string;
  diagnosedBy?: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  isCritical: boolean;
  notes?: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
  createdAt: string;
  updatedAt: string;
}

export enum AllergyType {
  MEDICATION = 'MEDICATION',
  FOOD = 'FOOD',
  ENVIRONMENTAL = 'ENVIRONMENTAL',
  INSECT = 'INSECT',
  LATEX = 'LATEX',
  OTHER = 'OTHER'
}

export enum AllergySeverity {
  MILD = 'MILD',
  MODERATE = 'MODERATE',
  SEVERE = 'SEVERE',
  LIFE_THREATENING = 'LIFE_THREATENING'
}

export interface AllergyCreate {
  studentId: string;
  allergen: string;
  allergyType: AllergyType;
  severity: AllergySeverity;
  reaction?: string;
  symptoms?: string[];
  treatment?: string;
  onsetDate?: string;
  diagnosedBy?: string;
  verified?: boolean;
  isCritical?: boolean;
  notes?: string;
}

export interface AllergyUpdate {
  allergen?: string;
  allergyType?: AllergyType;
  severity?: AllergySeverity;
  reaction?: string;
  symptoms?: string[];
  treatment?: string;
  onsetDate?: string;
  diagnosedBy?: string;
  verified?: boolean;
  isCritical?: boolean;
  notes?: string;
}

// ==========================================
// CHRONIC CONDITION TYPES
// ==========================================

export interface ChronicCondition {
  id: string;
  studentId: string;
  condition: string;
  icdCode?: string;
  diagnosedDate: string;
  status: ConditionStatus;
  severity: ConditionSeverity;
  notes?: string;
  carePlan?: string;
  medications?: string[];
  restrictions?: string[];
  triggers?: string[];
  diagnosedBy?: string;
  lastReviewDate?: string;
  nextReviewDate?: string;
  emergencyProtocol?: string;
  isActive: boolean;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
  createdAt: string;
  updatedAt: string;
}

export enum ConditionStatus {
  ACTIVE = 'ACTIVE',
  MANAGED = 'MANAGED',
  IN_REMISSION = 'IN_REMISSION',
  RESOLVED = 'RESOLVED',
  UNDER_OBSERVATION = 'UNDER_OBSERVATION'
}

export enum ConditionSeverity {
  MILD = 'MILD',
  MODERATE = 'MODERATE',
  SEVERE = 'SEVERE',
  CRITICAL = 'CRITICAL'
}

export interface ChronicConditionCreate {
  studentId: string;
  condition: string;
  icdCode?: string;
  diagnosedDate: string;
  status: ConditionStatus;
  severity: ConditionSeverity;
  notes?: string;
  carePlan?: string;
  medications?: string[];
  restrictions?: string[];
  triggers?: string[];
  diagnosedBy?: string;
  nextReviewDate?: string;
  emergencyProtocol?: string;
}

export interface ChronicConditionUpdate {
  condition?: string;
  icdCode?: string;
  diagnosedDate?: string;
  status?: ConditionStatus;
  severity?: ConditionSeverity;
  notes?: string;
  carePlan?: string;
  medications?: string[];
  restrictions?: string[];
  triggers?: string[];
  diagnosedBy?: string;
  lastReviewDate?: string;
  nextReviewDate?: string;
  emergencyProtocol?: string;
  isActive?: boolean;
}

export interface CarePlanUpdate {
  carePlan: string;
  medications?: string[];
  restrictions?: string[];
  triggers?: string[];
  emergencyProtocol?: string;
  nextReviewDate?: string;
}

// ==========================================
// VACCINATION TYPES
// ==========================================

export interface Vaccination {
  id: string;
  studentId: string;
  vaccineName: string;
  vaccineType: string;
  cvxCode?: string;
  doseNumber?: number;
  totalDoses?: number;
  administeredDate: string;
  expirationDate?: string;
  lotNumber?: string;
  manufacturer?: string;
  administeredBy?: string;
  administeredByNPI?: string;
  site?: string;
  route?: string;
  dosage?: string;
  status: VaccinationStatus;
  reactions?: string[];
  notes?: string;
  nextDueDate?: string;
  isCompliant: boolean;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
  createdAt: string;
  updatedAt: string;
}

export enum VaccinationStatus {
  COMPLETED = 'COMPLETED',
  PARTIAL = 'PARTIAL',
  OVERDUE = 'OVERDUE',
  EXEMPTED = 'EXEMPTED',
  NOT_REQUIRED = 'NOT_REQUIRED'
}

export interface VaccinationCreate {
  studentId: string;
  vaccineName: string;
  vaccineType: string;
  cvxCode?: string;
  doseNumber?: number;
  totalDoses?: number;
  administeredDate: string;
  expirationDate?: string;
  lotNumber?: string;
  manufacturer?: string;
  administeredBy?: string;
  administeredByNPI?: string;
  site?: string;
  route?: string;
  dosage?: string;
  status?: VaccinationStatus;
  reactions?: string[];
  notes?: string;
  nextDueDate?: string;
}

export interface VaccinationUpdate {
  vaccineName?: string;
  vaccineType?: string;
  cvxCode?: string;
  doseNumber?: number;
  totalDoses?: number;
  administeredDate?: string;
  expirationDate?: string;
  lotNumber?: string;
  manufacturer?: string;
  administeredBy?: string;
  administeredByNPI?: string;
  site?: string;
  route?: string;
  dosage?: string;
  status?: VaccinationStatus;
  reactions?: string[];
  notes?: string;
  nextDueDate?: string;
}

export interface VaccinationCompliance {
  studentId: string;
  isCompliant: boolean;
  requiredVaccinations: Array<{
    name: string;
    status: VaccinationStatus;
    dueDate?: string;
    completedDoses: number;
    requiredDoses: number;
  }>;
  missingVaccinations: string[];
  upcomingDue: Array<{
    name: string;
    dueDate: string;
  }>;
  exemptions?: Array<{
    vaccineName: string;
    exemptionType: string;
    reason?: string;
  }>;
}

// ==========================================
// SCREENING TYPES
// ==========================================

export interface Screening {
  id: string;
  studentId: string;
  screeningType: ScreeningType;
  screeningDate: string;
  performedBy: string;
  outcome: ScreeningOutcome;
  results?: string;
  measurements?: Record<string, string | number | boolean>;
  referralRequired: boolean;
  referralTo?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  notes?: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
  createdAt: string;
  updatedAt: string;
}

export enum ScreeningType {
  VISION = 'VISION',
  HEARING = 'HEARING',
  DENTAL = 'DENTAL',
  SCOLIOSIS = 'SCOLIOSIS',
  BMI = 'BMI',
  BLOOD_PRESSURE = 'BLOOD_PRESSURE',
  MENTAL_HEALTH = 'MENTAL_HEALTH',
  DEVELOPMENTAL = 'DEVELOPMENTAL',
  OTHER = 'OTHER'
}

export enum ScreeningOutcome {
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  REFER = 'REFER',
  INCONCLUSIVE = 'INCONCLUSIVE',
  DECLINED = 'DECLINED'
}

export interface ScreeningCreate {
  studentId: string;
  screeningType: ScreeningType;
  screeningDate: string;
  performedBy: string;
  outcome: ScreeningOutcome;
  results?: string;
  measurements?: Record<string, string | number | boolean>;
  referralRequired?: boolean;
  referralTo?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
  notes?: string;
}

export interface ScreeningUpdate {
  screeningType?: ScreeningType;
  screeningDate?: string;
  performedBy?: string;
  outcome?: ScreeningOutcome;
  results?: string;
  measurements?: Record<string, string | number | boolean>;
  referralRequired?: boolean;
  referralTo?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
  notes?: string;
}

export interface ScreeningsDueItem {
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
  screeningType: ScreeningType;
  lastScreeningDate?: string;
  dueDate: string;
  daysOverdue: number;
}

// ==========================================
// GROWTH MEASUREMENT TYPES
// ==========================================

export interface GrowthMeasurement {
  id: string;
  studentId: string;
  measurementDate: string;
  height?: number; // in cm
  weight?: number; // in kg
  headCircumference?: number; // in cm
  bmi?: number;
  bmiPercentile?: number;
  heightPercentile?: number;
  weightPercentile?: number;
  measuredBy: string;
  notes?: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
    dateOfBirth: string;
    gender: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface GrowthMeasurementCreate {
  studentId: string;
  measurementDate: string;
  height?: number;
  weight?: number;
  headCircumference?: number;
  measuredBy: string;
  notes?: string;
}

export interface GrowthMeasurementUpdate {
  measurementDate?: string;
  height?: number;
  weight?: number;
  headCircumference?: number;
  measuredBy?: string;
  notes?: string;
}

export interface GrowthTrend {
  studentId: string;
  measurements: GrowthMeasurement[];
  trends: {
    heightTrend: 'increasing' | 'stable' | 'decreasing';
    weightTrend: 'increasing' | 'stable' | 'decreasing';
    bmiTrend: 'increasing' | 'stable' | 'decreasing';
  };
  concerns: string[];
  recommendations: string[];
}

// ==========================================
// VITAL SIGNS TYPES
// ==========================================

export interface VitalSigns {
  id: string;
  studentId: string;
  recordDate: string;
  temperature?: number; // in Celsius
  temperatureMethod?: 'oral' | 'axillary' | 'tympanic' | 'temporal';
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number; // beats per minute
  respiratoryRate?: number; // breaths per minute
  oxygenSaturation?: number; // percentage
  pain?: number; // 0-10 scale
  glucose?: number; // mg/dL
  weight?: number; // in kg
  height?: number; // in cm
  notes?: string;
  recordedBy: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface VitalSignsCreate {
  studentId: string;
  recordDate: string;
  temperature?: number;
  temperatureMethod?: 'oral' | 'axillary' | 'tympanic' | 'temporal';
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  pain?: number;
  glucose?: number;
  weight?: number;
  height?: number;
  notes?: string;
  recordedBy: string;
}

export interface VitalSignsUpdate {
  recordDate?: string;
  temperature?: number;
  temperatureMethod?: 'oral' | 'axillary' | 'tympanic' | 'temporal';
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  pain?: number;
  glucose?: number;
  weight?: number;
  height?: number;
  notes?: string;
}

export interface VitalSignsTrend {
  studentId: string;
  vitalType: 'temperature' | 'bloodPressure' | 'heartRate' | 'respiratoryRate' | 'oxygenSaturation';
  measurements: Array<{
    date: string;
    value: number;
    systolic?: number;
    diastolic?: number;
  }>;
  average: number;
  min: number;
  max: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  alerts: string[];
}

export interface VitalSignsFilters {
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
}

// ==========================================
// HEALTH SUMMARY TYPES
// ==========================================

export interface HealthSummary {
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
    dateOfBirth: string;
    age: number;
    gender: string;
  };
  criticalAlerts: string[];
  allergies: Allergy[];
  criticalAllergies: Allergy[];
  chronicConditions: ChronicCondition[];
  activeConditions: ChronicCondition[];
  latestVitals?: VitalSigns;
  latestGrowth?: GrowthMeasurement;
  vaccinations: {
    isCompliant: boolean;
    total: number;
    overdue: number;
    upcoming: number;
  };
  recentScreenings: Screening[];
  lastPhysicalExam?: {
    date: string;
    provider: string;
  };
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
  }>;
  carePlans: string[];
  restrictions: string[];
  followUpsRequired: number;
  lastVisit?: string;
  totalVisits: number;
}

// ==========================================
// BULK IMPORT/EXPORT TYPES
// ==========================================

export interface BulkImportRequest {
  records: HealthRecordCreate[];
  validateOnly?: boolean;
  continueOnError?: boolean;
}

export interface BulkImportResult {
  totalRecords: number;
  successCount: number;
  failureCount: number;
  errors: Array<{
    index: number;
    record: HealthRecordCreate;
    error: string;
    field?: string;
  }>;
  warnings: Array<{
    index: number;
    record: HealthRecordCreate;
    warning: string;
  }>;
  imported: HealthRecord[];
}

// ==========================================
// BACKWARD COMPATIBILITY ALIASES
// ==========================================

export type VaccinationRecord = Vaccination;
export type CreateHealthRecordRequest = HealthRecordCreate;
export type CreateAllergyRequest = AllergyCreate;
export type CreateChronicConditionRequest = ChronicConditionCreate;
export type CreateVaccinationRequest = VaccinationCreate;
