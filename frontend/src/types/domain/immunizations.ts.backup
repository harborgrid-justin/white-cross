/**
 * WF-COMP-IMM | immunizations.ts - Immunization Management Types
 * Purpose: Comprehensive type definitions for vaccine administration and compliance tracking
 * Upstream: React, CDC ACIP Guidelines, VIS | Dependencies: Healthcare regulatory standards
 * Downstream: Components, pages, app routing | Called by: Immunization management system
 * Related: Students, health records, compliance reporting
 * Exports: interfaces, types, enums | Key Features: CDC-compliant vaccine tracking
 * Last Updated: 2025-11-03 | File Type: .ts
 * Critical Path: Vaccine administration → Compliance tracking → State reporting
 * LLM Context: HIPAA-compliant immunization records, CDC vaccine schedules, state requirements
 */

/**
 * HIPAA NOTICE: All immunization data is considered Protected Health Information (PHI)
 * All access and modifications must be audit logged per HIPAA requirements
 */

// ==========================================
// CDC VACCINE CODES (CVX)
// ==========================================

/**
 * CDC Vaccine Codes (CVX) - Standardized vaccine identification
 * @see https://www2a.cdc.gov/vaccines/iis/iisstandards/vaccines.asp?rpt=cvx
 */
export type VaccineCode =
  | 'CVX_03'  // MMR (Measles, Mumps, Rubella)
  | 'CVX_08'  // Hepatitis B (pediatric/adolescent)
  | 'CVX_10'  // Polio (IPV)
  | 'CVX_20'  // DTaP (Diphtheria, Tetanus, Pertussis)
  | 'CVX_21'  // Varicella (Chickenpox)
  | 'CVX_94'  // MMRV (Measles, Mumps, Rubella, Varicella)
  | 'CVX_106' // DTaP, 5 pertussis antigens
  | 'CVX_110' // DTaP-hepatitis B-IPV
  | 'CVX_114' // Meningococcal MCV4P
  | 'CVX_115' // Tdap (Tetanus, Diphtheria, Pertussis)
  | 'CVX_116' // Rotavirus, pentavalent
  | 'CVX_119' // Rotavirus, monovalent
  | 'CVX_120' // DTaP-Hib-IPV
  | 'CVX_121' // Zoster vaccine, live
  | 'CVX_122' // Rotavirus vaccine, NOS
  | 'CVX_133' // Pneumococcal conjugate PCV 13
  | 'CVX_136' // Meningococcal MCV4O
  | 'CVX_141' // Influenza, seasonal, injectable
  | 'CVX_144' // Influenza, seasonal, intradermal
  | 'CVX_149' // Influenza, live, intranasal
  | 'CVX_150' // Influenza, injectable, quadrivalent
  | 'CVX_152' // Pneumococcal conjugate, NOS
  | 'CVX_155' // Influenza, recombinant
  | 'CVX_158' // Influenza, injectable, quadrivalent
  | 'CVX_161' // Influenza, injectable, quadrivalent, preservative free
  | 'CVX_165' // HPV9 (Human Papillomavirus, 9-valent)
  | 'CVX_171' // Influenza, injectable, MDCK, preservative free
  | 'CVX_185' // Influenza, recombinant, quadrivalent
  | 'CVX_186' // Influenza, injectable, MDCK, quadrivalent, preservative free
  | 'CVX_187' // Zoster vaccine, recombinant
  | 'CVX_203' // Meningococcal B, recombinant
  | 'CVX_205' // Influenza, quadrivalent, cell culture based
  | 'CVX_207' // COVID-19, mRNA, LNP-S, PF, 30 mcg/0.3 mL dose
  | 'CVX_208' // COVID-19, mRNA, LNP-S, PF, 100 mcg/0.5 mL dose
  | 'CVX_210' // COVID-19 vaccine, vector-nr, rS-ChAdOx1, PF, 0.5 mL
  | 'CVX_211' // COVID-19, subunit, rS-nanoparticle+Matrix-M1 Adjuvant, PF, 0.5 mL
  | 'CVX_212' // COVID-19 vaccine, vector-nr, rS-Ad26, PF, 0.5 mL
  | 'CVX_213' // SARS-COV-2 (COVID-19) vaccine, UNSPECIFIED
  | 'CVX_300' // COVID-19, mRNA, LNP-S, bivalent, PF, 30 mcg/0.3 mL
  | 'CVX_301' // COVID-19, mRNA, LNP-S, bivalent, PF, 10 mcg/0.2 mL
  | 'CVX_302' // COVID-19, mRNA, LNP-S, bivalent, PF, 50 mcg/0.5 mL;

/**
 * Vaccine types for UI categorization
 */
export type VaccineType =
  | 'routine'      // Standard childhood/adolescent vaccines
  | 'catch_up'     // Catch-up schedules for missed vaccines
  | 'travel'       // Travel-related vaccines
  | 'outbreak'     // Outbreak response vaccines
  | 'occupational' // Healthcare worker vaccines
  | 'seasonal';    // Seasonal vaccines (flu, etc.)

/**
 * Vaccine categories for organizing immunization records
 */
export type VaccineCategory =
  | 'viral'
  | 'bacterial'
  | 'combination'
  | 'live_attenuated'
  | 'inactivated'
  | 'recombinant'
  | 'toxoid'
  | 'mRNA';

// ==========================================
// ADMINISTRATION & COMPLIANCE
// ==========================================

/**
 * Immunization status for tracking compliance
 */
export type ImmunizationStatus =
  | 'complete'         // All required doses administered
  | 'in_progress'      // Series started but not complete
  | 'overdue'          // Past due date for next dose
  | 'due_soon'         // Due within next 30 days
  | 'scheduled'        // Future appointment scheduled
  | 'contraindicated'  // Medical contraindication exists
  | 'exempted'         // Exemption granted
  | 'not_started'      // No doses administered
  | 'refused';         // Parent/guardian refused

/**
 * Immunization compliance level
 */
export type ComplianceLevel =
  | 'compliant'        // 100% up-to-date
  | 'partially_compliant' // Some required vaccines missing
  | 'non_compliant'    // Multiple required vaccines missing
  | 'exempt'           // Valid exemption on file
  | 'pending_review';  // Awaiting compliance review

/**
 * Administration route for vaccine delivery
 * @aligned_with CDC ACIP guidelines
 */
export type AdministrationRoute =
  | 'INTRAMUSCULAR'    // IM - Most common for vaccines
  | 'SUBCUTANEOUS'     // SubQ - Some live vaccines
  | 'INTRADERMAL'      // ID - BCG, some allergy tests
  | 'ORAL'             // PO - Rotavirus, typhoid
  | 'INTRANASAL';      // IN - FluMist

/**
 * Injection site for intramuscular vaccines
 */
export type InjectionSite =
  | 'LEFT_DELTOID'     // Left upper arm (deltoid)
  | 'RIGHT_DELTOID'    // Right upper arm (deltoid)
  | 'LEFT_THIGH'       // Left thigh (vastus lateralis)
  | 'RIGHT_THIGH'      // Right thigh (vastus lateralis)
  | 'LEFT_GLUTEAL'     // Left buttock (not recommended)
  | 'RIGHT_GLUTEAL';   // Right buttock (not recommended)

/**
 * Vaccine reaction severity
 * @aligned_with VAERS reporting guidelines
 */
export type ReactionSeverity =
  | 'NONE'             // No reaction
  | 'MILD'             // Minor local reaction
  | 'MODERATE'         // Notable but not severe
  | 'SEVERE'           // Significant medical attention needed
  | 'LIFE_THREATENING' // Anaphylaxis or similar
  | 'DEATH';           // Fatal outcome (requires immediate VAERS report)

/**
 * Exemption types for immunization requirements
 */
export type ExemptionType =
  | 'medical'          // Medical contraindication
  | 'religious'        // Religious beliefs
  | 'philosophical'    // Personal/philosophical beliefs
  | 'temporary_medical'; // Temporary medical delay

/**
 * Exemption status
 */
export type ExemptionStatus =
  | 'active'
  | 'expired'
  | 'pending_review'
  | 'denied'
  | 'revoked';

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
  outcome: 'resolved' | 'ongoing' | 'permanent_injury' | 'death';
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
  approvalStatus: 'pending' | 'approved' | 'denied' | 'revoked';
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
  unitOfMeasure: 'doses' | 'vials';
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
  status: 'active' | 'expired' | 'recalled' | 'quarantined';
  alertLevel: 'normal' | 'low' | 'critical' | 'expired';
  
  // Audit
  createdAt: string;
  updatedAt?: string;
  lastStockCheckDate?: string;
}

// ==========================================
// DASHBOARD & STATISTICS
// ==========================================

/**
 * Immunization dashboard statistics
 */
export interface ImmunizationDashboardStats {
  // Overall compliance
  totalStudents: number;
  compliantStudents: number;
  partiallyCompliantStudents: number;
  nonCompliantStudents: number;
  exemptStudents: number;
  complianceRate: number; // Percentage
  
  // Status breakdown
  dueToday: number;
  dueThisWeek: number;
  dueThisMonth: number;
  overdue: number;
  
  // Administration stats
  administeredToday: number;
  administeredThisWeek: number;
  administeredThisMonth: number;
  administeredThisYear: number;
  
  // Vaccine-specific
  topVaccineDue: string[];
  mostCommonReaction: string;
  
  // Exemptions
  activeExemptions: number;
  medicalExemptions: number;
  religiousExemptions: number;
  philosophicalExemptions: number;
  
  // Inventory alerts
  lowStockVaccines: number;
  expiringVaccines: number; // Within 30 days
  expiredVaccines: number;
  
  // Trends
  complianceTrend: 'improving' | 'declining' | 'stable';
  administrationTrend: 'increasing' | 'decreasing' | 'stable';
  
  lastUpdated: string;
}

/**
 * Vaccine-specific statistics
 */
export interface VaccineStatistics {
  vaccineCode: VaccineCode;
  vaccineName: string;
  
  // Administration counts
  totalAdministered: number;
  administeredThisYear: number;
  administeredThisMonth: number;
  
  // Compliance
  studentsRequired: number;
  studentsCompliant: number;
  studentsOverdue: number;
  studentsExempted: number;
  complianceRate: number;
  
  // Reactions
  totalReactions: number;
  mildReactions: number;
  moderateReactions: number;
  severeReactions: number;
  adverseEvents: number;
  
  // Inventory
  currentStock: number;
  daysOfSupply: number;
  needsReorder: boolean;
  
  lastUpdated: string;
}

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
  outcome: 'resolved' | 'ongoing' | 'permanent_injury' | 'death';
  
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

// ==========================================
// ACTION RESULTS
// ==========================================

/**
 * Generic action result wrapper
 */
export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

/**
 * Paginated immunization records response
 */
export interface PaginatedImmunizationsResponse {
  immunizations: StudentImmunization[];
  pagination: PaginationMeta;
}

/**
 * Compliance report response
 */
export interface ComplianceReportResponse {
  summary: ImmunizationDashboardStats;
  studentCompliance: StudentComplianceSummary[];
  vaccineStatistics: VaccineStatistics[];
  generatedAt: string;
}

// Re-export for convenience
export type {
  StudentImmunization as Immunization,
  StudentImmunization as ImmunizationRecord,
};
