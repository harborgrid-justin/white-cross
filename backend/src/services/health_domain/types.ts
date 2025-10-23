/**
 * LOC: 91A8A03CD4
 * WC-GEN-257 | types.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - enums.ts (database/types/enums.ts)
 *
 * DOWNSTREAM (imported by):
 *   - analyticsService.ts (services/health/analyticsService.ts)
 *   - vitalSignsService.ts (services/health/vitalSignsService.ts)
 */

/**
 * WC-GEN-257 | types.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../database/types/enums | Dependencies: ../../database/types/enums
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: interfaces | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { HealthRecordType, AllergySeverity, ConditionStatus, ConditionSeverity } from '../../database/types/enums';
import { VitalSigns } from '../../types/health';
import type {
  StudentBasicInfo,
  AllergyInfo,
  VaccinationRecord,
  HealthRecordInfo,
  ChronicConditionInfo
} from '../../types/health/health-record.types';

// Type augmentations for model associations
declare module '../../database/models' {
  interface HealthRecord {
    student?: Student;
    vital?: VitalSigns;
    type: HealthRecordType;
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

// Core data interfaces
export interface CreateHealthRecordData {
  studentId: string;
  type: HealthRecordType;
  date: Date;
  description: string;
  vital?: VitalSigns;
  provider?: string;
  notes?: string;
  attachments?: string[];
}

export interface UpdateHealthRecordData {
  type?: HealthRecordType;
  date?: Date;
  description?: string;
  vital?: VitalSigns;
  provider?: string;
  notes?: string;
  attachments?: string[];
}

export interface CreateAllergyData {
  studentId: string;
  allergen: string;
  severity: AllergySeverity;
  reaction?: string;
  treatment?: string;
  verified?: boolean;
  verifiedBy?: string;
}

export interface UpdateAllergyData {
  allergen?: string;
  severity?: AllergySeverity;
  reaction?: string;
  treatment?: string;
  verified?: boolean;
  verifiedBy?: string;
}

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

export interface UpdateChronicConditionData {
  condition?: string;
  diagnosisDate?: Date;
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

export interface UpdateVaccinationData {
  vaccineName?: string;
  administrationDate?: Date;
  administeredBy?: string;
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

// Re-export VitalSigns from centralized types
export { VitalSigns } from '../../types/health';

// Filter interfaces
export interface HealthRecordFilters {
  type?: HealthRecordType;
  dateFrom?: Date;
  dateTo?: Date;
  provider?: string;
}

export interface AllergyFilters {
  severity?: AllergySeverity;
  verified?: boolean;
  allergen?: string;
}

export interface ChronicConditionFilters {
  status?: ConditionStatus;
  severity?: ConditionSeverity;
  condition?: string;
}

export interface VaccinationFilters {
  vaccineName?: string;
  dateFrom?: Date;
  dateTo?: Date;
  cvxCode?: string;
  seriesComplete?: boolean;
}

// Response interfaces
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  records?: T[];
  items?: T[];
  data?: T[];
  pagination: PaginationInfo;
}

export interface HealthSummary {
  student: StudentBasicInfo;
  allergies: AllergyInfo[];
  recentVitals: VitalSigns[];
  recentVaccinations: VaccinationRecord[];
  recordCounts: Record<HealthRecordType | string, number>;
}

export interface GrowthDataPoint {
  date: Date;
  height?: number;
  weight?: number;
  bmi?: number;
  recordType: string;
}

export interface HealthStatistics {
  totalRecords: number;
  activeAllergies: number;
  chronicConditions: number;
  vaccinationsDue: number;
  recentRecords: number;
}

export interface ImportResult {
  imported: number;
  skipped: number;
  errors: string[];
}

export interface BulkDeleteResult {
  deleted: number;
  notFound: number;
  success: boolean;
}

export interface ExportData {
  exportDate: string;
  student: StudentBasicInfo;
  healthRecords: HealthRecordInfo[];
  allergies: AllergyInfo[];
  chronicConditions: ChronicConditionInfo[];
  vaccinations: VaccinationRecord[];
  growthData: GrowthDataPoint[];
}

// Additional export/import interfaces
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

export interface HealthDataImport {
  patientId: string;
  data: {
    healthRecords: Partial<HealthRecordInfo>[];
    allergies: Partial<AllergyInfo>[];
    vaccinations: Partial<VaccinationRecord>[];
    chronicConditions: Partial<ChronicConditionInfo>[];
  };
}

export interface ExportOptions {
  includeHealthRecords?: boolean;
  includeAllergies?: boolean;
  includeVaccinations?: boolean;
  includeChronicConditions?: boolean;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}

export interface ImportOptions {
  validateData?: boolean;
  skipDuplicates?: boolean;
  overwriteExisting?: boolean;
}

export interface DetailedImportResult {
  success: boolean;
  imported: {
    healthRecords: number;
    allergies: number;
    vaccinations: number;
    chronicConditions: number;
  };
  errors: string[];
  warnings: string[];
}
