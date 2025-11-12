/**
 * @fileoverview Vaccination DTOs
 * @module health-record/vaccination
 * @description Data Transfer Objects for vaccination operations
 */

/**
 * Vaccination creation data
 */
export interface CreateVaccinationDto {
  studentId: string;
  vaccineName: string;
  vaccineType?: string | null;
  manufacturer?: string;
  lotNumber?: string;
  cvxCode?: string;
  ndcCode?: string;
  doseNumber?: number;
  totalDoses?: number;
  administrationDate: Date;
  administeredBy: string;
  administeredByRole?: string;
  facility?: string;
  siteOfAdministration?: string;
  routeOfAdministration?: string;
  dosageAmount?: string;
  expirationDate?: Date;
  reactions?: string;
  adverseEvents?: Record<string, unknown>;
  exemptionStatus?: boolean;
  exemptionReason?: string;
  exemptionDocument?: string;
  vfcEligibility?: boolean;
  visProvided?: boolean;
  visDate?: Date;
  consentObtained?: boolean;
  consentBy?: string;
  notes?: string;
}

/**
 * Vaccination update data
 */
export interface UpdateVaccinationDto {
  vaccineName?: string;
  vaccineType?: string;
  manufacturer?: string;
  lotNumber?: string;
  cvxCode?: string;
  ndcCode?: string;
  doseNumber?: number;
  totalDoses?: number;
  administrationDate?: Date;
  administeredBy?: string;
  administeredByRole?: string;
  facility?: string;
  siteOfAdministration?: string;
  routeOfAdministration?: string;
  dosageAmount?: string;
  expirationDate?: Date;
  reactions?: string;
  adverseEvents?: Record<string, unknown>;
  exemptionStatus?: boolean;
  exemptionReason?: string;
  exemptionDocument?: string;
  vfcEligibility?: boolean;
  visProvided?: boolean;
  visDate?: Date;
  consentObtained?: boolean;
  consentBy?: string;
  notes?: string;
  seriesComplete?: boolean;
  nextDueDate?: Date | null;
  complianceStatus?: string;
}

/**
 * Exemption creation data
 */
export interface CreateExemptionDto {
  vaccineName: string;
  reason: string;
  exemptionType: string;
}

/**
 * Batch import result
 */
export interface BatchImportResult {
  successCount: number;
  errorCount: number;
  importedIds: string[];
  errors: string[];
}
