/**
 * WF-COMP-IMM | immunizations.compliance.ts - Compliance and Exemption Management
 * Purpose: Type definitions for immunization compliance tracking and exemptions
 * Upstream: State immunization requirements, school entry rules
 * Downstream: Compliance dashboards, exemption workflows, reporting
 * Related: immunizations.records.ts, immunizations.enums.ts
 * Exports: ImmunizationExemption, StudentComplianceSummary, VaccineInventory
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Compliance tracking → School entry decisions → State reporting
 * LLM Context: HIPAA-compliant exemption tracking and compliance monitoring
 */

/**
 * HIPAA NOTICE: Medical exemptions contain Protected Health Information (PHI)
 * All access and modifications must be audit logged per HIPAA requirements
 */

import type { VaccineCode } from './immunizations.codes';
import type {
  ComplianceLevel,
  ExemptionType,
  ExemptionStatus,
  ExemptionApprovalStatus,
  InventoryStatus,
  InventoryAlertLevel,
  InventoryUnitOfMeasure,
} from './immunizations.enums';

// ==========================================
// COMPLIANCE & EXEMPTIONS
// ==========================================

/**
 * Immunization exemption
 * Tracks exemptions from vaccination requirements
 *
 * HIPAA: Contains PHI - Medical exemptions contain health information
 */
export interface ImmunizationExemption {
  id: string;
  studentId: string;
  vaccineCode?: VaccineCode; // null for blanket exemption
  vaccineName?: string;

  // Exemption details
  exemptionType: ExemptionType;
  status: ExemptionStatus;
  reason: string;

  // Medical exemption specifics
  contraindication?: string;
  providerId?: string;
  providerName?: string;
  providerLicense?: string;

  // Documentation
  documentationReceived: boolean;
  documentUrl?: string;

  // Validity period
  effectiveDate: string;
  expirationDate?: string; // null for permanent medical exemption

  // Approval workflow
  requestedBy: string; // Parent/guardian name
  requestedDate: string;
  reviewedBy?: string; // School nurse/administrator ID
  reviewedByName?: string;
  reviewedDate?: string;
  approvalStatus: ExemptionApprovalStatus;
  approvalNotes?: string;

  // Audit
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  updatedBy?: string;

  // Relations
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    grade?: string;
  };
}

/**
 * Compliance summary for a student
 * Overall immunization compliance status
 */
export interface StudentComplianceSummary {
  studentId: string;
  studentName: string;
  grade?: string;
  dateOfBirth: string;

  // Overall status
  complianceLevel: ComplianceLevel;
  compliantVaccines: number;
  requiredVaccines: number;
  compliancePercentage: number;

  // Status breakdown
  completeVaccines: string[]; // Vaccine names
  overdueVaccines: string[];
  dueSoonVaccines: string[];
  missingVaccines: string[];
  exemptedVaccines: string[];

  // Next actions
  nextDueVaccine?: string;
  nextDueDate?: string;
  urgentActionRequired: boolean;

  // School entry compliance
  schoolEntryCompliant: boolean;
  conditionalAdmission: boolean;
  admissionDeadline?: string;

  // Exemptions
  hasExemptions: boolean;
  activeExemptions: number;

  lastUpdated: string;
}

/**
 * Vaccine inventory item
 * Tracks vaccine stock in school clinic
 */
export interface VaccineInventory {
  id: string;
  vaccineCode: VaccineCode;
  vaccineName: string;

  // Product information
  manufacturer: string;
  manufacturerCode?: string; // MVX code
  lotNumber: string;
  ndc?: string;

  // Quantity and storage
  quantityOnHand: number;
  quantityAllocated: number; // Reserved for scheduled appointments
  quantityAvailable: number; // On hand - allocated
  unitOfMeasure: InventoryUnitOfMeasure;
  dosesPerVial?: number;

  // Dates
  receivedDate: string;
  expirationDate: string;
  daysUntilExpiration: number;

  // Storage requirements
  storageTemperatureMin: number; // Celsius
  storageTemperatureMax: number; // Celsius
  storageLocation: string; // e.g., "Refrigerator A, Shelf 2"

  // Ordering
  reorderPoint: number;
  reorderQuantity: number;
  supplier?: string;
  costPerDose?: number;

  // Status
  status: InventoryStatus;
  alertLevel: InventoryAlertLevel;

  // Audit
  createdAt: string;
  updatedAt?: string;
  lastStockCheckDate?: string;
}
