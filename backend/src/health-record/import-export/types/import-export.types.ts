/**
 * @fileoverview Type definitions for Import/Export operations
 * @module health-record/import-export/types
 * @description Strongly-typed interfaces and types for health record import/export
 * Eliminates 'any' types and provides compile-time type safety
 */

/**
 * Supported health record types in the system
 */
export type RecordType =
  | 'vaccination'
  | 'allergy'
  | 'chronic_condition'
  | 'chroniccondition'
  | 'vital_signs'
  | 'vitals'
  | 'clinic_visit'
  | 'visit';

/**
 * Normalized record type for internal processing
 */
export type NormalizedRecordType =
  | 'vaccination'
  | 'allergy'
  | 'chronic_condition'
  | 'vital_signs'
  | 'clinic_visit';

/**
 * Supported import/export formats
 */
export type DataFormat = 'JSON' | 'CSV' | 'PDF' | 'HL7' | 'XML';

/**
 * Base health record structure
 */
export interface HealthRecord {
  type: RecordType;
  studentId: string;
  [key: string]: unknown; // Allow additional type-specific properties
}

/**
 * Vaccination record data
 */
export interface VaccinationData {
  vaccineName: string;
  vaccineType: string;
  administrationDate: Date | string;
  administeredBy: string;
  lotNumber?: string;
  cvxCode?: string;
  seriesComplete?: boolean;
}

/**
 * Allergy record data
 */
export interface AllergyData {
  allergen: string;
  allergyType: string;
  severity: string;
  symptoms?: string;
  diagnosedDate: Date | string;
  active: boolean;
}

/**
 * Chronic condition record data
 */
export interface ChronicConditionData {
  condition: string;
  icdCode?: string;
  status: string;
  severity?: string;
  diagnosedDate: Date | string;
  carePlan?: string;
}

/**
 * Vital signs record data
 */
export interface VitalSignsData {
  measurementDate: Date | string;
  temperature?: number;
  heartRate?: number;
  respiratoryRate?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  isAbnormal: boolean;
}

/**
 * Clinic visit record data
 */
export interface ClinicVisitData {
  checkInTime: Date | string;
  checkOutTime?: Date | string;
  reasonForVisit: string;
  symptoms?: string;
  treatment?: string;
  disposition?: string;
  attendedBy: string;
}

/**
 * Error information for failed import records
 */
export interface ImportError {
  record: Partial<HealthRecord>;
  error: string;
}

/**
 * Result of import operation
 */
export interface ImportResult {
  imported: number;
  failed: number;
  errors: ImportError[];
  records: HealthRecord[];
}

/**
 * Date range filter for queries
 */
export interface DateRangeFilter {
  start: Date | string;
  end: Date | string;
}

/**
 * Filters for export operations
 */
export interface ExportFilters {
  studentId?: string;
  schoolId?: string;
  dateRange?: DateRangeFilter;
}

/**
 * Result of export operation
 */
export interface ExportResult {
  records?: string;
  data?: string;
  format: DataFormat;
  count?: number;
  exportedAt: Date;
  filters?: ExportFilters;
  studentId?: string;
}

/**
 * Complete student health record data
 */
export interface StudentRecordData {
  studentId: string;
  student: {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
  };
  exportedAt: Date;
  vaccinations: VaccinationData[];
  allergies: AllergyData[];
  chronicConditions: ChronicConditionData[];
  vitals: VitalSignsData[];
  visits: ClinicVisitData[];
}

/**
 * State reporting data structure
 */
export interface StateReportData {
  stateCode: string;
  formats: {
    csv: string;
    hl7: string;
  };
  summary: {
    totalRecords: number;
    schoolCount: number;
    dateRange?: DateRangeFilter;
  };
  generatedAt: Date;
}

/**
 * User information for audit logging
 */
export interface UserContext {
  id: string;
  email?: string;
  role?: string;
}

/**
 * Record grouping by type for bulk operations
 */
export type RecordsByType = Record<string, HealthRecord[]>;

/**
 * Sequelize where clause type (simplified)
 */
export interface WhereClause {
  [key: string]: unknown;
}

/**
 * Student basic information
 */
export interface StudentInfo {
  id: string;
  firstName: string;
  lastName: string;
  schoolId: string;
  dateOfBirth: Date;
}

/**
 * Vaccination report record for state reporting
 */
export interface VaccinationReportRecord {
  studentId: string;
  studentName: string;
  schoolId: string;
  dateOfBirth: Date;
  vaccineName: string;
  vaccineType: string;
  administrationDate: Date | string;
  administeredBy: string;
  cvxCode?: string;
  seriesComplete?: boolean;
}
