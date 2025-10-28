/**
 * Data interfaces for PDF generation
 */

export interface AllergyData {
  allergen: string;
  severity: string;
  reaction?: string;
}

export interface MedicationData {
  name: string;
  dosage: string;
  frequency: string;
  route: string;
}

export interface ChronicConditionData {
  diagnosisName: string;
}

export interface StudentHealthSummaryData {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date | string;
  grade?: string;
  studentNumber?: string;
  allergies?: AllergyData[];
  medications?: MedicationData[];
  chronicConditions?: ChronicConditionData[];
}

export interface MedicationAdministrationData {
  administeredAt: Date | string;
  administeredBy: string;
  verifiedBy?: string;
  notes?: string;
}

export interface MedicationLogData {
  id: string;
  name: string;
  studentName: string;
  dosage: string;
  route: string;
  frequency: string;
  administrations?: MedicationAdministrationData[];
}

export interface ImmunizationStudentData {
  firstName: string;
  lastName: string;
  grade?: string;
  compliant: boolean;
  missingVaccines?: string[];
}

export interface ImmunizationReportData {
  organizationName: string;
  totalStudents: number;
  compliantStudents: number;
  complianceRate: number;
  students?: ImmunizationStudentData[];
}

export interface IncidentReportData {
  id: string;
  incidentDateTime: Date | string;
  location: string;
  severity: string;
  studentName: string;
  grade?: string;
  description: string;
  actionsTaken?: string;
}

export interface CustomReportTable {
  title?: string;
  headers: string[];
  rows: any[][];
}

export interface CustomReportData {
  title: string;
  subtitle?: string;
  metadata?: Record<string, string>;
  tables?: CustomReportTable[];
}

export interface WatermarkOptions {
  text?: string;
  imagePath?: string;
  x?: number;
  y?: number;
  size?: number;
  opacity?: number;
  rotate?: number;
}

export interface SignatureOptions {
  certificateData?: string;
  signatureName?: string;
  signatureReason?: string;
  signatureLocation?: string;
}
