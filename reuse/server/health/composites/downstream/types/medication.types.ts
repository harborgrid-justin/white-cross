/**
 * Medication Types and Interfaces
 *
 * Comprehensive type definitions for medication ordering, administration,
 * reconciliation, and medication-related healthcare data structures.
 *
 * Supports the 5 Rights of Medication Administration:
 * - Right Patient
 * - Right Medication
 * - Right Dose
 * - Right Route
 * - Right Time
 *
 * @module medication.types
 * @since 1.0.0
 */

import { EntityStatus, PriorityLevel } from './common.types';

/**
 * Medication route of administration
 */
export type MedicationRoute =
  | 'PO'        // By mouth (per os)
  | 'IV'        // Intravenous
  | 'IM'        // Intramuscular
  | 'SC'        // Subcutaneous
  | 'SL'        // Sublingual
  | 'PR'        // Per rectum
  | 'TOPICAL'   // Topical/skin
  | 'INHALED'   // Inhalation
  | 'NASAL'     // Nasal
  | 'OPHTHALMIC' // Eye drops
  | 'OTIC'      // Ear drops
  | 'TRANSDERMAL' // Transdermal patch
  | 'VAGINAL'   // Vaginal
  | 'OTHER';

/**
 * Medication frequency codes
 */
export type MedicationFrequency =
  | 'ONCE'      // One time only
  | 'QD'        // Once daily
  | 'BID'       // Twice daily
  | 'TID'       // Three times daily
  | 'QID'       // Four times daily
  | 'Q4H'       // Every 4 hours
  | 'Q6H'       // Every 6 hours
  | 'Q8H'       // Every 8 hours
  | 'Q12H'      // Every 12 hours
  | 'QHS'       // At bedtime
  | 'QAM'       // Every morning
  | 'PRN'       // As needed
  | 'STAT'      // Immediately
  | 'CONTINUOUS' // Continuous infusion
  | 'OTHER';

/**
 * Medication form/formulation
 */
export type MedicationForm =
  | 'TABLET'
  | 'CAPSULE'
  | 'LIQUID'
  | 'SYRUP'
  | 'SUSPENSION'
  | 'INJECTION'
  | 'CREAM'
  | 'OINTMENT'
  | 'GEL'
  | 'PATCH'
  | 'INHALER'
  | 'SPRAY'
  | 'DROPS'
  | 'SUPPOSITORY'
  | 'POWDER'
  | 'OTHER';

/**
 * Medication order information
 *
 * @example
 * ```typescript
 * const order: MedicationOrder = {
 *   orderId: 'ORD-123',
 *   patientId: 'PAT-456',
 *   medicationId: 'MED-789',
 *   medicationName: 'Lisinopril',
 *   dose: '10mg',
 *   route: 'PO',
 *   frequency: 'QD',
 *   startDate: new Date(),
 *   orderingProvider: 'Dr. Smith',
 *   status: 'active'
 * };
 * ```
 */
export interface MedicationOrder {
  /** Unique order ID */
  orderId: string;

  /** Patient ID */
  patientId: string;

  /** Medication ID from formulary */
  medicationId: string;

  /** Medication name */
  medicationName: string;

  /** Generic name */
  genericName?: string;

  /** Brand name */
  brandName?: string;

  /** NDC (National Drug Code) */
  ndc?: string;

  /** RxNorm code */
  rxNormCode?: string;

  /** Dose (e.g., "10mg", "500mg", "1 tablet") */
  dose: string;

  /** Route of administration */
  route: MedicationRoute;

  /** Frequency */
  frequency: MedicationFrequency;

  /** Medication form */
  form?: MedicationForm;

  /** Special instructions */
  instructions?: string;

  /** Indication/reason for medication */
  indication?: string;

  /** Start date */
  startDate: Date;

  /** Stop date (if applicable) */
  stopDate?: Date;

  /** Duration (e.g., "7 days", "30 days") */
  duration?: string;

  /** Quantity */
  quantity?: number;

  /** Refills authorized */
  refillsAuthorized?: number;

  /** Ordering provider */
  orderingProvider: string;

  /** Ordering provider NPI */
  orderingProviderNPI?: string;

  /** Order date/time */
  orderDate: Date;

  /** Order status */
  status: 'pending' | 'active' | 'completed' | 'discontinued' | 'cancelled' | 'on_hold';

  /** Priority */
  priority?: PriorityLevel;

  /** Whether this is a controlled substance */
  isControlledSubstance?: boolean;

  /** DEA schedule (II, III, IV, V) */
  deaSchedule?: string;

  /** Whether this is a PRN (as needed) order */
  isPRN?: boolean;

  /** PRN reason */
  prnReason?: string;

  /** Pharmacy notes */
  pharmacyNotes?: string;
}

/**
 * Medication administration record (MAR)
 *
 * @example
 * ```typescript
 * const mar: MedicationAdministrationRecord = {
 *   administrationId: 'ADM-123',
 *   orderId: 'ORD-456',
 *   patientId: 'PAT-789',
 *   medicationId: 'MED-012',
 *   dose: '500mg',
 *   route: 'PO',
 *   scheduledTime: new Date('2025-11-10T08:00:00'),
 *   actualTime: new Date('2025-11-10T08:05:00'),
 *   administeredBy: 'NURSE-001',
 *   status: 'administered'
 * };
 * ```
 */
export interface MedicationAdministrationRecord {
  /** Unique administration record ID */
  administrationId: string;

  /** Medication order ID */
  orderId: string;

  /** Patient ID */
  patientId: string;

  /** Medication ID */
  medicationId: string;

  /** Medication name */
  medicationName: string;

  /** Dose administered */
  dose: string;

  /** Route used */
  route: MedicationRoute;

  /** Scheduled administration time */
  scheduledTime: Date;

  /** Actual administration time */
  actualTime?: Date;

  /** Who administered the medication (nurse/provider ID) */
  administeredBy?: string;

  /** Administering nurse/provider name */
  administeredByName?: string;

  /** Administration status */
  status: 'scheduled' | 'administered' | 'missed' | 'refused' | 'held' | 'not_given';

  /** Reason if not administered */
  notGivenReason?: string;

  /** Barcode scanned for verification */
  barcodeScanned?: string;

  /** Witness (for double-check medications) */
  witnessedBy?: string;

  /** Site of administration (for injections, patches, etc.) */
  administrationSite?: string;

  /** Patient response/reaction */
  patientResponse?: string;

  /** Adverse reaction occurred */
  adverseReaction?: boolean;

  /** Adverse reaction details */
  adverseReactionDetails?: string;

  /** Administration notes */
  notes?: string;

  /** Documentation time */
  documentedTime?: Date;
}

/**
 * Medication administration request DTO
 *
 * @example
 * ```typescript
 * const request: MedicationAdministrationDto = {
 *   patientId: 'PAT-123',
 *   medicationId: 'MED-456',
 *   dose: '500mg',
 *   route: 'PO',
 *   scheduledTime: new Date(),
 *   barcode: 'SCAN-789',
 *   nurseId: 'NURSE-001'
 * };
 * ```
 */
export interface MedicationAdministrationDto {
  /** Patient ID (for Right Patient verification) */
  patientId: string;

  /** Medication ID (for Right Medication verification) */
  medicationId: string;

  /** Dose amount with units (for Right Dose verification) */
  dose: string;

  /** Route of administration (for Right Route verification) */
  route: MedicationRoute;

  /** Scheduled administration time (for Right Time verification) */
  scheduledTime: Date;

  /** Actual administration time (defaults to now) */
  actualTime?: Date;

  /** Scanned barcode for verification */
  barcode: string;

  /** Administering nurse identifier */
  nurseId: string;

  /** Witness identifier (for high-risk medications) */
  witnessId?: string;

  /** Administration site */
  administrationSite?: string;

  /** Patient response */
  patientResponse?: string;

  /** Additional notes */
  notes?: string;
}

/**
 * Medication administration result
 *
 * @example
 * ```typescript
 * const result: AdministrationResult = {
 *   administrationId: 'ADM-123',
 *   recorded: true,
 *   warnings: ['Administration 15 minutes late'],
 *   auditTrailId: 'AUDIT-456'
 * };
 * ```
 */
export interface AdministrationResult {
  /** Unique ID for this administration event */
  administrationId: string;

  /** Whether administration was successfully recorded */
  recorded: boolean;

  /** Non-blocking warnings */
  warnings: string[];

  /** Audit trail entry ID */
  auditTrailId: string;

  /** Timestamp of recording */
  recordedAt: Date;
}

/**
 * Medication reconciliation entry
 *
 * @example
 * ```typescript
 * const reconciliation: MedicationReconciliation = {
 *   reconciliationId: 'REC-123',
 *   patientId: 'PAT-456',
 *   encounterType: 'admission',
 *   homeMedications: [...],
 *   facilityMedications: [...],
 *   reconciledBy: 'Dr. Smith',
 *   reconciledDate: new Date(),
 *   status: 'completed'
 * };
 * ```
 */
export interface MedicationReconciliation {
  /** Reconciliation record ID */
  reconciliationId: string;

  /** Patient ID */
  patientId: string;

  /** Encounter/visit ID */
  encounterId?: string;

  /** When reconciliation occurred */
  encounterType: 'admission' | 'discharge' | 'transfer' | 'visit';

  /** Home/outpatient medications */
  homeMedications: MedicationListEntry[];

  /** Facility/inpatient medications */
  facilityMedications: MedicationListEntry[];

  /** Discrepancies identified */
  discrepancies?: MedicationDiscrepancy[];

  /** Who performed reconciliation */
  reconciledBy: string;

  /** When reconciliation was completed */
  reconciledDate: Date;

  /** Reconciliation status */
  status: 'pending' | 'in_progress' | 'completed';

  /** Notes */
  notes?: string;
}

/**
 * Medication list entry for reconciliation
 *
 * @example
 * ```typescript
 * const med: MedicationListEntry = {
 *   medicationName: 'Lisinopril',
 *   dose: '10mg',
 *   route: 'PO',
 *   frequency: 'QD',
 *   action: 'continue',
 *   isActive: true
 * };
 * ```
 */
export interface MedicationListEntry {
  /** Medication name */
  medicationName: string;

  /** Dose */
  dose: string;

  /** Route */
  route: MedicationRoute;

  /** Frequency */
  frequency: MedicationFrequency;

  /** Action taken during reconciliation */
  action?: 'continue' | 'discontinue' | 'modify' | 'add';

  /** Modified dose (if action is 'modify') */
  modifiedDose?: string;

  /** Reason for change */
  changeReason?: string;

  /** Whether currently active */
  isActive: boolean;

  /** Prescribing provider */
  prescribingProvider?: string;

  /** Last fill date */
  lastFillDate?: Date;
}

/**
 * Medication discrepancy found during reconciliation
 *
 * @example
 * ```typescript
 * const discrepancy: MedicationDiscrepancy = {
 *   medicationName: 'Metformin',
 *   discrepancyType: 'dose_mismatch',
 *   homeDose: '1000mg BID',
 *   facilityDose: '500mg BID',
 *   resolved: true,
 *   resolution: 'Confirmed with patient - home dose is correct'
 * };
 * ```
 */
export interface MedicationDiscrepancy {
  /** Medication name */
  medicationName: string;

  /** Type of discrepancy */
  discrepancyType: 'dose_mismatch' | 'frequency_mismatch' | 'route_mismatch' | 'missing_medication' | 'duplicate' | 'other';

  /** Home medication details */
  homeDose?: string;

  /** Facility medication details */
  facilityDose?: string;

  /** Whether discrepancy has been resolved */
  resolved: boolean;

  /** How it was resolved */
  resolution?: string;

  /** Who resolved it */
  resolvedBy?: string;

  /** When it was resolved */
  resolvedDate?: Date;
}

/**
 * Medication interaction check result
 *
 * @example
 * ```typescript
 * const interaction: MedicationInteraction = {
 *   medication1: 'Warfarin',
 *   medication2: 'Aspirin',
 *   severity: 'major',
 *   interactionType: 'drug_drug',
 *   description: 'Increased bleeding risk',
 *   recommendation: 'Monitor INR closely and consider alternative'
 * };
 * ```
 */
export interface MedicationInteraction {
  /** First medication */
  medication1: string;

  /** Second medication (or allergen, condition, etc.) */
  medication2: string;

  /** Severity level */
  severity: 'contraindicated' | 'major' | 'moderate' | 'minor';

  /** Type of interaction */
  interactionType: 'drug_drug' | 'drug_allergy' | 'drug_condition' | 'drug_food' | 'drug_lab';

  /** Description of the interaction */
  description: string;

  /** Clinical recommendation */
  recommendation: string;

  /** Source/reference */
  source?: string;

  /** Evidence level */
  evidenceLevel?: 'high' | 'moderate' | 'low';
}

/**
 * Medication allergy check result
 *
 * @example
 * ```typescript
 * const allergyCheck: MedicationAllergyCheck = {
 *   medicationName: 'Amoxicillin',
 *   allergyFound: true,
 *   allergen: 'Penicillin',
 *   severity: 'severe',
 *   reaction: 'Anaphylaxis',
 *   canAdminister: false
 * };
 * ```
 */
export interface MedicationAllergyCheck {
  /** Medication being checked */
  medicationName: string;

  /** Whether an allergy was found */
  allergyFound: boolean;

  /** Allergen that matches */
  allergen?: string;

  /** Allergy severity */
  severity?: 'mild' | 'moderate' | 'severe' | 'life_threatening';

  /** Previous reaction */
  reaction?: string;

  /** Whether the medication can be administered */
  canAdminister: boolean;

  /** Warning message */
  warningMessage?: string;

  /** Override authorization (if applicable) */
  overrideAuthorization?: {
    authorizedBy: string;
    reason: string;
    timestamp: Date;
  };
}

/**
 * Medication formulary entry
 *
 * @example
 * ```typescript
 * const formularyMed: MedicationFormularyEntry = {
 *   medicationId: 'MED-123',
 *   name: 'Lisinopril',
 *   genericName: 'Lisinopril',
 *   brandNames: ['Prinivil', 'Zestril'],
 *   ndc: '12345-678-90',
 *   rxNormCode: 'RXN-123',
 *   therapeuticClass: 'ACE Inhibitor',
 *   isFormulary: true,
 *   requiresAuthorization: false
 * };
 * ```
 */
export interface MedicationFormularyEntry {
  /** Medication ID */
  medicationId: string;

  /** Medication name */
  name: string;

  /** Generic name */
  genericName: string;

  /** Brand names */
  brandNames?: string[];

  /** NDC code */
  ndc?: string;

  /** RxNorm code */
  rxNormCode?: string;

  /** GPI (Generic Product Identifier) */
  gpi?: string;

  /** Therapeutic class */
  therapeuticClass?: string;

  /** Available strengths */
  strengths?: string[];

  /** Available forms */
  forms?: MedicationForm[];

  /** Whether on formulary */
  isFormulary: boolean;

  /** Whether prior authorization required */
  requiresAuthorization: boolean;

  /** Preferred alternative (if not on formulary) */
  preferredAlternative?: string;

  /** Whether controlled substance */
  isControlledSubstance: boolean;

  /** DEA schedule */
  deaSchedule?: string;

  /** Whether requires refrigeration */
  requiresRefrigeration?: boolean;

  /** Special handling instructions */
  specialHandling?: string;
}

/**
 * 5 Rights verification result
 *
 * @example
 * ```typescript
 * const verification: FiveRightsVerification = {
 *   rightPatient: true,
 *   rightMedication: true,
 *   rightDose: true,
 *   rightRoute: true,
 *   rightTime: false,
 *   allVerified: false,
 *   failures: ['Scheduled for 08:00, administering at 08:45 (45 min late)']
 * };
 * ```
 */
export interface FiveRightsVerification {
  /** Right Patient verified */
  rightPatient: boolean;

  /** Right Medication verified */
  rightMedication: boolean;

  /** Right Dose verified */
  rightDose: boolean;

  /** Right Route verified */
  rightRoute: boolean;

  /** Right Time verified (within acceptable window) */
  rightTime: boolean;

  /** All rights verified */
  allVerified: boolean;

  /** Verification failures */
  failures: string[];

  /** Warnings (non-blocking) */
  warnings?: string[];

  /** When verification was performed */
  verifiedAt: Date;
}
