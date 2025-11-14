/**
 * WF-COMP-IMM | immunizations.forms.ts - Form Data Interfaces
 * Purpose: Type definitions for immunization-related form submissions
 * Upstream: User input, forms, workflows
 * Downstream: API services, validation, data processing
 * Related: immunizations.records.ts, immunizations.enums.ts
 * Exports: VaccineAdministrationFormData, ReactionReportFormData, ExemptionRequestFormData
 * Last Updated: 2025-11-12 | File Type: .ts
 * LLM Context: Form data structures for vaccine administration and exemption workflows
 */

import type { VaccineCode } from './immunizations.codes';
import type {
  AdministrationRoute,
  InjectionSite,
  ReactionSeverity,
  ReactionOutcome,
  ExemptionType,
} from './immunizations.enums';

// ==========================================
// FORM DATA INTERFACES
// ==========================================

/**
 * Form data for recording vaccine administration
 */
export interface VaccineAdministrationFormData {
  studentId: string;
  vaccineCode: VaccineCode;
  vaccineName: string;

  administeredDate: string;
  administrationRoute: AdministrationRoute;
  injectionSite?: InjectionSite;
  dosageAmount: string;

  manufacturer: string;
  lotNumber: string;
  expirationDate: string;
  ndc?: string;

  doseNumber: number;
  totalDosesRequired: number;

  visDate?: string;
  visGiven: boolean;
  visLanguage?: string;

  facilityName?: string;
  providerId?: string;

  notes?: string;
  contraindications?: string;
  precautions?: string;

  consentObtained: boolean;
  consentBy?: string;
  consentDate?: string;
  patientVerified: boolean;
}

/**
 * Form data for reporting adverse reactions
 */
export interface ReactionReportFormData {
  immunizationId: string;
  studentId: string;

  reactionType: string;
  severity: ReactionSeverity;
  onsetDate: string;
  onsetTime?: string;
  duration?: string;

  symptoms: string[];
  treatmentGiven?: string;
  outcome: ReactionOutcome;

  vaersReportable: boolean;
}

/**
 * Form data for requesting exemption
 */
export interface ExemptionRequestFormData {
  studentId: string;
  vaccineCode?: VaccineCode;

  exemptionType: ExemptionType;
  reason: string;

  contraindication?: string;
  providerId?: string;
  providerName?: string;
  providerLicense?: string;

  documentationReceived: boolean;

  effectiveDate: string;
  expirationDate?: string;

  requestedBy: string;
}
