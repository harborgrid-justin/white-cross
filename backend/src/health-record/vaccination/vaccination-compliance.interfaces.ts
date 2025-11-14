/**
 * @fileoverview Vaccination Compliance Interfaces
 * @module health-record/vaccination
 * @description Type definitions for vaccination compliance checking and reporting
 */

/**
 * Compliance report for a student
 */
export interface ComplianceReport {
  studentId: string;
  studentName: string;
  ageInMonths: number;
  compliant: boolean;
  missing: MissingVaccination[];
  upcoming: UpcomingVaccination[];
  complete: CompleteVaccination[];
  exemptions: ExemptionInfo[];
}

/**
 * Missing vaccination information
 */
export interface MissingVaccination {
  vaccineName: string;
  requiredDoses: number;
  completedDoses: number;
  nextDose?: number;
  dueDate?: Date | null;
  status: 'NOT_STARTED' | 'OVERDUE';
}

/**
 * Upcoming vaccination information
 */
export interface UpcomingVaccination {
  vaccineName: string;
  requiredDoses: number;
  completedDoses: number;
  nextDose: number;
  dueDate: Date | null;
  status: 'IN_PROGRESS';
}

/**
 * Complete vaccination information
 */
export interface CompleteVaccination {
  vaccineName: string;
  requiredDoses: number;
  completedDoses: number;
}

/**
 * Exemption information
 */
export interface ExemptionInfo {
  vaccineName: string;
  exemptionReason?: string;
}

/**
 * Due vaccinations response
 */
export interface DueVaccinationsResponse {
  studentId: string;
  studentName: string;
  dueVaccinations: DueVaccinationInfo[];
}

/**
 * Due vaccination details
 */
export interface DueVaccinationInfo {
  vaccineName: string;
  doseNumber: number;
  totalDoses: number;
  dueDate: Date | null;
  status: 'DUE' | 'OVERDUE';
  daysOverdue?: number;
}

/**
 * Compliance report query parameters
 */
export interface ComplianceReportQuery {
  schoolId?: string;
  gradeLevel?: string;
  vaccineType?: string;
  onlyNonCompliant?: boolean;
}

/**
 * Student compliance data
 */
export interface StudentComplianceData {
  studentId: string;
  studentName: string;
  totalVaccinations: number;
  compliantCount: number;
  compliancePercentage: number;
  status: 'COMPLIANT' | 'PARTIALLY_COMPLIANT' | 'NON_COMPLIANT';
}

/**
 * Compliance report response
 */
export interface ComplianceReportResponse {
  reportDate: string;
  filters: ComplianceReportQuery;
  totalStudents: number;
  summary: {
    compliant: number;
    partiallyCompliant: number;
    nonCompliant: number;
  };
  students: StudentComplianceData[];
}
