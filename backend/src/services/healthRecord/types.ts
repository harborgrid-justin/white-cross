/**
 * LOC: 3F8A92C1D4
 * WC-SVC-HLT-TYPES | types.ts - Health Record Type Definitions
 *
 * UPSTREAM (imports from):
 *   - enums.ts (database/types/enums.ts)
 *   - models (database/models)
 *
 * DOWNSTREAM (imported by):
 *   - All healthRecord modules
 *
 * Purpose: Centralized type definitions for health record services
 * Exports: Interfaces for all health record data structures
 * HIPAA: Contains PHI structure definitions - medical records, vitals, allergies
 * Last Updated: 2025-10-18 | File Type: .ts
 */

import { HealthRecordType, AllergySeverity, ConditionStatus, ConditionSeverity } from '../../database/types/enums';
import { Student } from '../../database/models';

// Type augmentations for model associations
declare module '../../database/models' {
  interface HealthRecord {
    student?: Student;
    vital?: any;
    type: any;
    date: Date;
  }

  interface Allergy {
    student?: Student;
    allergen: string;
  }

  interface ChronicCondition {
    student?: Student;
    condition: string;
  }

  interface Vaccination {
    student?: Student;
    vaccineName: string;
    administrationDate: Date;
    expirationDate?: Date;
    doseNumber?: number;
    totalDoses?: number;
  }

  interface Student {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  }
}

/**
 * Health Record Creation Data
 */
export interface CreateHealthRecordData {
  studentId: string;
  type: HealthRecordType;
  date: Date;
  description: string;
  vital?: any; // JSON data for vitals
  provider?: string;
  notes?: string;
  attachments?: string[];
}

/**
 * Allergy Creation Data
 */
export interface CreateAllergyData {
  studentId: string;
  allergen: string;
  severity: AllergySeverity;
  reaction?: string;
  treatment?: string;
  verified?: boolean;
  verifiedBy?: string;
}

/**
 * Chronic Condition Creation Data
 */
export interface CreateChronicConditionData {
  studentId: string;
  condition: string;
  diagnosisDate: Date;
  status?: ConditionStatus;
  severity?: ConditionSeverity;
  notes?: string;
  carePlan?: string;
  medications?: string[];
  restrictions?: string[];
  triggers?: string[];
  diagnosedBy?: string;
  lastReviewDate?: Date;
  nextReviewDate?: Date;
  icdCode?: string;
}

/**
 * Vaccination Creation Data
 */
export interface CreateVaccinationData {
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
}

/**
 * Vital Signs Data Structure
 */
export interface VitalSigns {
  temperature?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  height?: number;
  weight?: number;
  bmi?: number;
}

/**
 * Health Record Filter Options
 */
export interface HealthRecordFilters {
  type?: 'CHECKUP' | 'VACCINATION' | 'ILLNESS' | 'INJURY' | 'SCREENING' | 'PHYSICAL_EXAM' | 'MENTAL_HEALTH' | 'DENTAL' | 'VISION' | 'HEARING';
  dateFrom?: Date;
  dateTo?: Date;
  provider?: string;
}

/**
 * Pagination Result Structure
 */
export interface PaginationResult {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/**
 * Paginated Health Records Response
 */
export interface PaginatedHealthRecords<T> {
  records: T[];
  pagination: PaginationResult;
}

/**
 * Growth Data Point
 */
export interface GrowthDataPoint {
  date: Date;
  height?: number;
  weight?: number;
  bmi?: number;
  recordType: any;
}

/**
 * Health Summary Response
 */
export interface HealthSummary {
  student: any;
  allergies: any[];
  recentVitals: any[];
  recentVaccinations: any[];
  recordCounts: Record<string, number>;
}

/**
 * Import Results
 */
export interface ImportResults {
  imported: number;
  skipped: number;
  errors: string[];
}

/**
 * Bulk Delete Results
 */
export interface BulkDeleteResults {
  deleted: number;
  notFound: number;
  success: boolean;
}

/**
 * Health Record Statistics
 */
export interface HealthRecordStatistics {
  totalRecords: number;
  activeAllergies: number;
  chronicConditions: number;
  vaccinationsDue: number;
  recentRecords: number;
}
