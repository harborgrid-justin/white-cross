/**
 * Type definitions for health records
 * Provides strongly-typed interfaces for PHI data
 */

import { HealthRecordType, AllergySeverity, ConditionStatus, ConditionSeverity } from '../../database/types/enums';
import { VitalSigns } from './vital-signs.types';

/**
 * Student basic information interface
 * Used in health summaries and exports
 */
export interface StudentBasicInfo {
  id: string;
  firstName: string;
  lastName: string;
  studentNumber: string;
  dateOfBirth?: Date;
  grade?: string;
  gender?: string;
}

/**
 * Allergy information interface
 */
export interface AllergyInfo {
  id: string;
  studentId: string;
  allergen: string;
  severity: AllergySeverity;
  reaction?: string;
  treatment?: string;
  verified?: boolean;
  verifiedBy?: string;
  diagnosedDate?: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Vaccination record interface
 */
export interface VaccinationRecord {
  id: string;
  studentId: string;
  vaccineName: string;
  administrationDate: Date;
  administeredBy: string;
  cvxCode?: string;
  ndcCode?: string;
  lotNumber?: string;
  manufacturer?: string;
  doseNumber?: number;
  totalDoses?: number;
  expirationDate?: Date;
  nextDueDate?: Date;
  site?: string;
  route?: string;
  dosageAmount?: string;
  reactions?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Chronic condition information interface
 */
export interface ChronicConditionInfo {
  id: string;
  studentId: string;
  condition: string;
  diagnosisDate: Date;
  status: ConditionStatus;
  severity: ConditionSeverity;
  notes?: string;
  carePlan?: string;
  medications?: string[];
  restrictions?: string[];
  triggers?: string[];
  diagnosedBy?: string;
  lastReviewDate?: Date;
  nextReviewDate?: Date;
  icdCode?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Health record with properly typed data
 */
export interface HealthRecordInfo {
  id: string;
  studentId: string;
  type: HealthRecordType;
  date: Date;
  description: string;
  vital?: VitalSigns;
  provider?: string;
  notes?: string;
  attachments?: string[];
  followUpRequired?: boolean;
  followUpDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Health summary with properly typed arrays
 * Used for student health overview
 */
export interface HealthSummary {
  student: StudentBasicInfo;
  allergies: AllergyInfo[];
  recentVitals: VitalSigns[];
  recentVaccinations: VaccinationRecord[];
  chronicConditions?: ChronicConditionInfo[];
  recordCounts: Record<HealthRecordType, number>;
  lastVisitDate?: Date;
  upcomingAppointments?: number;
}

/**
 * Export data with properly typed health information
 */
export interface ExportData {
  exportDate: string;
  student: StudentBasicInfo;
  healthRecords: HealthRecordInfo[];
  allergies: AllergyInfo[];
  chronicConditions: ChronicConditionInfo[];
  vaccinations: VaccinationRecord[];
  growthData: GrowthDataPoint[];
}

/**
 * Growth data point for tracking physical development
 */
export interface GrowthDataPoint {
  date: Date;
  height?: number;
  weight?: number;
  bmi?: number;
  recordType: string;
  percentile?: {
    height?: number;
    weight?: number;
    bmi?: number;
  };
}

/**
 * Health data export structure
 */
export interface HealthDataExport {
  patientId: string;
  exportDate: Date;
  version: string;
  data: {
    healthRecords: HealthRecordInfo[];
    allergies: AllergyInfo[];
    vaccinations: VaccinationRecord[];
    chronicConditions: ChronicConditionInfo[];
  };
}

/**
 * Health data import structure
 */
export interface HealthDataImport {
  patientId: string;
  data: {
    healthRecords: Partial<HealthRecordInfo>[];
    allergies: Partial<AllergyInfo>[];
    vaccinations: Partial<VaccinationRecord>[];
    chronicConditions: Partial<ChronicConditionInfo>[];
  };
}

/**
 * Screening result interface
 */
export interface ScreeningResult {
  id: string;
  studentId: string;
  screeningType: string;
  screeningDate: Date;
  result: 'PASS' | 'FAIL' | 'REFER' | 'INCOMPLETE';
  details?: Record<string, unknown>;
  performedBy: string;
  notes?: string;
  followUpRequired?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
