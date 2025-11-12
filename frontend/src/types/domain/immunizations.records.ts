/**
 * WF-COMP-IMM | immunizations.records.ts - Core Immunization Record Interfaces
 * Purpose: Main data structures for vaccine administration and tracking
 * Upstream: CDC ACIP Guidelines, VIS requirements, VAERS reporting
 * Downstream: Components, API services, compliance tracking
 * Related: immunizations.codes.ts, immunizations.enums.ts
 * Exports: StudentImmunization, VaccineReaction, ImmunizationSchedule
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Vaccine administration → Record keeping → Compliance tracking
 * LLM Context: HIPAA-compliant immunization records with CDC-aligned structure
 */

/**
 * HIPAA NOTICE: All immunization data is considered Protected Health Information (PHI)
 * All access and modifications must be audit logged per HIPAA requirements
 */

import type { VaccineCode, VaccineType, VaccineCategory } from './immunizations.codes';
import type {
  AdministrationRoute,
  InjectionSite,
  ReactionSeverity,
  ReactionOutcome,
} from './immunizations.enums';

// ==========================================
// CORE INTERFACES
// ==========================================

/**
 * Student Immunization Record
 * Complete vaccination history for a student
 *
 * HIPAA: Contains PHI - Student health information
 */
export interface StudentImmunization {
  id: string;
  studentId: string;
  vaccineCode: VaccineCode;
  vaccineName: string;
  vaccineType: VaccineType;
  vaccineCategory: VaccineCategory;

  // Administration details
  administeredDate: string;
  administeredBy: string; // Nurse ID
  administeredByName?: string;
  administrationRoute: AdministrationRoute;
  injectionSite?: InjectionSite;
  dosageAmount: string; // e.g., "0.5 mL"

  // Vaccine product information
  manufacturer: string;
  manufacturerCode?: string; // MVX code
  lotNumber: string;
  expirationDate: string;
  ndc?: string; // National Drug Code

  // Series tracking
  seriesName?: string; // e.g., "DTaP Series"
  doseNumber: number; // Current dose in series
  totalDosesRequired: number; // Total doses in series
  intervalWeeks?: number; // Weeks until next dose
  nextDueDate?: string;

  // VIS (Vaccine Information Statement)
  visDate?: string; // VIS publication date
  visGiven: boolean; // VIS provided to parent
  visLanguage?: string; // Language of VIS provided

  // Location and provider
  facilityName?: string;
  facilityAddress?: string;
  providerId?: string;

  // Clinical notes
  notes?: string;
  contraindications?: string;
  precautions?: string;

  // Reactions and outcomes
  reactions?: VaccineReaction[];
  adverseEvent?: boolean; // VAERS reportable event
  vaersReportId?: string; // VAERS report number if filed

  // Consent and verification
  consentObtained: boolean;
  consentBy?: string; // Parent/guardian who provided consent
  consentDate?: string;
  patientVerified: boolean; // Right patient verification

  // Audit trail
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy?: string;

  // Relations
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    grade?: string;
  };
  administeredByNurse?: {
    id: string;
    firstName: string;
    lastName: string;
    credentials?: string;
  };
}

/**
 * Vaccine reaction record
 * Tracks adverse reactions to vaccines
 */
export interface VaccineReaction {
  id: string;
  immunizationId: string;
  studentId: string;

  // Reaction details
  reactionType: string; // e.g., "Local erythema", "Fever", "Anaphylaxis"
  severity: ReactionSeverity;
  onsetDate: string;
  onsetTime?: string;
  duration?: string; // e.g., "2 hours", "1 day"

  // Clinical information
  symptoms: string[];
  treatmentGiven?: string;
  outcome: ReactionOutcome;
  resolvedDate?: string;

  // Provider information
  reportedBy: string; // Nurse ID
  reportedByName?: string;
  reportedDate: string;

  // VAERS reporting
  vaersReportable: boolean;
  vaersReported: boolean;
  vaersReportId?: string;
  vaersReportDate?: string;

  // Audit
  createdAt: string;
  updatedAt?: string;
}

/**
 * Immunization schedule entry
 * Defines CDC/ACIP recommended schedule
 */
export interface ImmunizationSchedule {
  id: string;
  vaccineCode: VaccineCode;
  vaccineName: string;

  // Age requirements
  minimumAgeMonths: number;
  recommendedAgeMonths: number;
  maximumAgeMonths?: number;

  // Series information
  doseNumber: number;
  totalDoses: number;
  minimumIntervalWeeks?: number; // From previous dose

  // Catch-up schedule
  catchUpEligible: boolean;
  catchUpMinimumAgeMonths?: number;
  catchUpMaximumAgeMonths?: number;

  // Requirements
  required: boolean; // State requirement
  schoolEntryRequired: boolean;
  collegeDormRequired: boolean;

  // Notes
  notes?: string;
  contraindications?: string[];
  precautions?: string[];

  // CDC references
  cdpScheduleVersion: string;
  acipRecommendationDate: string;

  createdAt: string;
  updatedAt?: string;
}
