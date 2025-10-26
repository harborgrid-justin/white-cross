/**
 * Medications Page Type Definitions
 *
 * Comprehensive type definitions for medication management functionality in the
 * White Cross healthcare platform. Provides type safety for medication administration,
 * inventory tracking, prescription management, and compliance reporting.
 *
 * @module pages/medications/types
 *
 * @remarks
 * HIPAA Compliance: Many types in this module contain PHI (Protected Health Information)
 * and require secure handling, audit logging, and proper access controls.
 *
 * Medication Safety: Types related to dosing, administration, and drug interactions
 * must be used with appropriate validation to ensure patient safety.
 *
 * @see {@link medicationsSlice} for state management
 * @see {@link medicationsApi} for API integration
 *
 * @since 1.0.0
 */

import { StudentMedication } from '../../types/student.types';

// ============================================================================
// CORE MEDICATION TYPES
// ============================================================================

/**
 * Medication administration route enumeration.
 *
 * Defines the standard routes of medication administration following medical
 * terminology standards. Each route requires specific administration protocols
 * and may have different absorption rates and onset times.
 *
 * @typedef {string} MedicationRoute
 *
 * @property {string} ORAL - By mouth (most common route)
 * @property {string} SUBLINGUAL - Under the tongue (e.g., nitroglycerin)
 * @property {string} TOPICAL - Applied to skin surface (creams, ointments)
 * @property {string} TRANSDERMAL - Through skin via patch (e.g., nicotine patch)
 * @property {string} INHALATION - Inhaled into lungs (e.g., asthma inhalers)
 * @property {string} INJECTION_IM - Intramuscular injection
 * @property {string} INJECTION_SC - Subcutaneous injection (e.g., insulin)
 * @property {string} INJECTION_IV - Intravenous injection (emergency only in schools)
 * @property {string} OPHTHALMIC - Eye drops or ointments
 * @property {string} OTIC - Ear drops
 * @property {string} NASAL - Nasal spray or drops
 * @property {string} RECTAL - Rectal administration (suppositories)
 * @property {string} OTHER - Other routes requiring specification
 *
 * @example
 * ```typescript
 * const route: MedicationRoute = 'ORAL';
 * const insulinRoute: MedicationRoute = 'INJECTION_SC';
 * ```
 *
 * @remarks
 * Some routes (especially injections) may require additional training certification
 * for school nurses and may require witness documentation for controlled substances.
 */
export type MedicationRoute =
  | 'ORAL'
  | 'SUBLINGUAL'
  | 'TOPICAL'
  | 'TRANSDERMAL'
  | 'INHALATION'
  | 'INJECTION_IM'
  | 'INJECTION_SC'
  | 'INJECTION_IV'
  | 'OPHTHALMIC'
  | 'OTIC'
  | 'NASAL'
  | 'RECTAL'
  | 'OTHER';

/**
 * Medication frequency patterns for scheduling administration.
 *
 * Defines standard medication dosing frequencies. These patterns are used
 * to generate administration schedules and track compliance.
 *
 * @typedef {string} MedicationFrequency
 *
 * @property {string} ONCE_DAILY - Once per day (QD)
 * @property {string} TWICE_DAILY - Twice per day (BID)
 * @property {string} THREE_TIMES_DAILY - Three times per day (TID)
 * @property {string} FOUR_TIMES_DAILY - Four times per day (QID)
 * @property {string} EVERY_4_HOURS - Every 4 hours (Q4H)
 * @property {string} EVERY_6_HOURS - Every 6 hours (Q6H)
 * @property {string} EVERY_8_HOURS - Every 8 hours (Q8H)
 * @property {string} EVERY_12_HOURS - Every 12 hours (Q12H)
 * @property {string} AS_NEEDED - As needed/PRN (requires specific conditions)
 * @property {string} WEEKLY - Once per week
 * @property {string} MONTHLY - Once per month
 * @property {string} CUSTOM - Custom schedule requiring manual configuration
 *
 * @example
 * ```typescript
 * const antibiotic: MedicationFrequency = 'TWICE_DAILY';
 * const painMed: MedicationFrequency = 'AS_NEEDED';
 * const vitamin: MedicationFrequency = 'ONCE_DAILY';
 * ```
 *
 * @remarks
 * AS_NEEDED medications require clear administration criteria and may have
 * maximum daily dose limits. CUSTOM frequencies should document specific
 * scheduling instructions.
 */
export type MedicationFrequency =
  | 'ONCE_DAILY'
  | 'TWICE_DAILY'
  | 'THREE_TIMES_DAILY'
  | 'FOUR_TIMES_DAILY'
  | 'EVERY_4_HOURS'
  | 'EVERY_6_HOURS'
  | 'EVERY_8_HOURS'
  | 'EVERY_12_HOURS'
  | 'AS_NEEDED'
  | 'WEEKLY'
  | 'MONTHLY'
  | 'CUSTOM';

/**
 * Medication status enumeration for tracking medication lifecycle.
 *
 * @typedef {string} MedicationStatus
 *
 * @property {string} ACTIVE - Currently active and being administered
 * @property {string} INACTIVE - Temporarily inactive but not discontinued
 * @property {string} DISCONTINUED - Permanently stopped by physician order
 * @property {string} EXPIRED - Prescription or medication has expired
 * @property {string} PENDING - Awaiting approval or parent consent
 * @property {string} SUSPENDED - Temporarily suspended pending review
 *
 * @example
 * ```typescript
 * const status: MedicationStatus = 'ACTIVE';
 * if (status === 'EXPIRED') {
 *   // Handle expired medication
 * }
 * ```
 */
export type MedicationStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'DISCONTINUED'
  | 'EXPIRED'
  | 'PENDING'
  | 'SUSPENDED';

/**
 * Medication type classification for regulatory and tracking purposes.
 *
 * @typedef {string} MedicationType
 *
 * @property {string} PRESCRIPTION - Prescription medication requiring physician order
 * @property {string} OTC - Over-the-counter medication (e.g., ibuprofen)
 * @property {string} EMERGENCY - Emergency medication (e.g., EpiPen, rescue inhaler)
 * @property {string} SUPPLEMENT - Dietary supplements and vitamins
 * @property {string} CONTROLLED_SUBSTANCE - DEA controlled substances requiring special tracking
 *
 * @example
 * ```typescript
 * const type: MedicationType = 'PRESCRIPTION';
 * const epipen: MedicationType = 'EMERGENCY';
 * ```
 *
 * @remarks
 * CONTROLLED_SUBSTANCE medications require witness documentation, secure storage,
 * and enhanced audit logging per DEA regulations.
 */
export type MedicationType =
  | 'PRESCRIPTION'
  | 'OTC'
  | 'EMERGENCY'
  | 'SUPPLEMENT'
  | 'CONTROLLED_SUBSTANCE';

// ============================================================================
// ADMINISTRATION TRACKING
// ============================================================================

/**
 * Medication administration record for tracking doses given to students.
 *
 * Represents a single instance of medication administration, capturing all required
 * data for compliance tracking, safety monitoring, and audit purposes.
 *
 * @interface MedicationAdministration
 *
 * @property {string} id - Unique identifier for the administration record
 * @property {string} medicationId - Reference to the medication catalog entry
 * @property {string} studentId - Student receiving the medication (PHI)
 * @property {string} studentMedicationId - Reference to the student's medication prescription
 * @property {string} administeredAt - ISO timestamp of administration
 * @property {string} administeredBy - User ID of the nurse administering medication
 * @property {string} [administeredByName] - Full name of administering nurse for display
 * @property {string} dosageGiven - Actual dosage administered (e.g., "10mg", "2 tablets", "5mL")
 * @property {MedicationRoute} route - Route of administration
 * @property {string} [notes] - Additional administration notes or observations
 * @property {boolean} [wasRefused] - True if student refused to take medication
 * @property {string} [refusalReason] - Reason for refusal (required if wasRefused is true)
 * @property {string[]} [sideEffectsReported] - List of side effects reported by student
 * @property {string} [witnessedBy] - User ID of witnessing nurse (required for controlled substances)
 * @property {string} [witnessedByName] - Full name of witnessing nurse for display
 * @property {string} createdAt - ISO timestamp of record creation
 * @property {string} updatedAt - ISO timestamp of last update
 *
 * @example
 * ```typescript
 * const administration: MedicationAdministration = {
 *   id: 'admin-12345',
 *   medicationId: 'med-67890',
 *   studentId: 'student-54321',
 *   studentMedicationId: 'studentmed-11111',
 *   administeredAt: '2025-10-26T10:30:00Z',
 *   administeredBy: 'nurse-98765',
 *   administeredByName: 'Sarah Johnson, RN',
 *   dosageGiven: '10mg',
 *   route: 'ORAL',
 *   notes: 'Student took medication with water as directed',
 *   wasRefused: false,
 *   createdAt: '2025-10-26T10:30:00Z',
 *   updatedAt: '2025-10-26T10:30:00Z'
 * };
 * ```
 *
 * @remarks
 * PHI Warning: This interface contains protected health information requiring secure
 * handling per HIPAA regulations.
 *
 * Medication Safety: Administration records must be created immediately after giving
 * medication and cannot be backdated. Any refusals require parent notification.
 *
 * Audit Logging: All administration records are automatically logged for compliance
 * tracking and reporting.
 *
 * @see {@link MedicationSchedule} for scheduled administration times
 * @see {@link MissedDose} for tracking missed administrations
 */
export interface MedicationAdministration {
  id: string;
  medicationId: string;
  studentId: string;
  studentMedicationId: string;
  administeredAt: string;
  administeredBy: string;
  administeredByName?: string;
  dosageGiven: string;
  route: MedicationRoute;
  notes?: string;
  wasRefused?: boolean;
  refusalReason?: string;
  sideEffectsReported?: string[];
  witnessedBy?: string;
  witnessedByName?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Scheduled administration time for recurring medication doses.
 *
 * Defines when a medication should be administered, supporting both one-time
 * and recurring schedules with flexible frequency patterns.
 *
 * @interface MedicationSchedule
 *
 * @property {string} id - Unique identifier for the schedule
 * @property {string} studentMedicationId - Reference to the student's medication prescription
 * @property {string} scheduledTime - Time of day for administration (HH:mm format, e.g., "09:00", "13:30")
 * @property {string} dosage - Dosage amount for this schedule (e.g., "5mg", "1 tablet")
 * @property {MedicationRoute} route - Administration route
 * @property {string} [instructions] - Special instructions for this dose time
 * @property {boolean} isRecurring - True for recurring schedules, false for one-time doses
 * @property {MedicationFrequency} [frequency] - Frequency pattern (required if isRecurring is true)
 * @property {number[]} [daysOfWeek] - Days schedule is active (0-6, Sunday-Saturday). Optional for custom schedules
 * @property {string} startDate - ISO date when schedule becomes active
 * @property {string} [endDate] - ISO date when schedule ends (optional for ongoing medications)
 * @property {boolean} isActive - True if schedule is currently active
 * @property {string} createdAt - ISO timestamp of record creation
 * @property {string} updatedAt - ISO timestamp of last update
 *
 * @example
 * ```typescript
 * // Morning and afternoon antibiotic doses
 * const morningDose: MedicationSchedule = {
 *   id: 'sched-001',
 *   studentMedicationId: 'studentmed-123',
 *   scheduledTime: '09:00',
 *   dosage: '250mg',
 *   route: 'ORAL',
 *   instructions: 'Give with food',
 *   isRecurring: true,
 *   frequency: 'TWICE_DAILY',
 *   daysOfWeek: [1, 2, 3, 4, 5], // Monday-Friday (school days)
 *   startDate: '2025-10-26',
 *   endDate: '2025-11-09', // 2-week antibiotic course
 *   isActive: true,
 *   createdAt: '2025-10-26T08:00:00Z',
 *   updatedAt: '2025-10-26T08:00:00Z'
 * };
 * ```
 *
 * @remarks
 * Medication Safety: Schedule times should account for school hours and avoid
 * administration during classes when possible. Ensure adequate spacing between
 * doses per medication guidelines.
 *
 * Scheduling Logic: The system generates administration reminders based on
 * scheduledTime and daysOfWeek. School holidays are automatically excluded.
 *
 * @see {@link MedicationFrequency} for available frequency patterns
 * @see {@link MedicationAdministration} for actual administration records
 */
export interface MedicationSchedule {
  id: string;
  studentMedicationId: string;
  scheduledTime: string;
  dosage: string;
  route: MedicationRoute;
  instructions?: string;
  isRecurring: boolean;
  frequency?: MedicationFrequency;
  daysOfWeek?: number[]; // 0-6, Sunday-Saturday
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Missed dose record for tracking when scheduled medications are not administered.
 *
 * Documents instances where a scheduled medication dose was missed, including
 * the reason and any follow-up actions taken.
 *
 * @interface MissedDose
 *
 * @property {string} id - Unique identifier for the missed dose record
 * @property {string} studentMedicationId - Reference to the student's medication prescription
 * @property {string} scheduledTime - ISO timestamp of when dose was scheduled
 * @property {string} missedAt - ISO timestamp when miss was recorded
 * @property {string} reason - Reason for missed dose (e.g., "Student absent", "Medication unavailable", "Parent refused")
 * @property {string} reportedBy - User ID of person reporting the missed dose
 * @property {string} [reportedByName] - Full name of reporting person for display
 * @property {string} [actionTaken] - Follow-up action taken (e.g., "Rescheduled for later", "Parent contacted")
 * @property {boolean} [parentNotified] - True if parent was notified about missed dose
 * @property {string} [parentNotifiedAt] - ISO timestamp of parent notification
 * @property {string} createdAt - ISO timestamp of record creation
 *
 * @example
 * ```typescript
 * const missedDose: MissedDose = {
 *   id: 'missed-789',
 *   studentMedicationId: 'studentmed-123',
 *   scheduledTime: '2025-10-26T09:00:00Z',
 *   missedAt: '2025-10-26T09:30:00Z',
 *   reason: 'Student absent from school',
 *   reportedBy: 'nurse-456',
 *   reportedByName: 'Jane Doe, RN',
 *   actionTaken: 'Parent contacted to administer at home',
 *   parentNotified: true,
 *   parentNotifiedAt: '2025-10-26T10:00:00Z',
 *   createdAt: '2025-10-26T09:30:00Z'
 * };
 * ```
 *
 * @remarks
 * Medication Safety: Frequent missed doses may indicate compliance issues requiring
 * intervention. Critical medications (e.g., seizure meds) require immediate parent
 * notification and documented follow-up.
 *
 * Reporting: Missed doses affect adherence calculations and compliance metrics.
 *
 * @see {@link MedicationSchedule} for scheduled administration times
 * @see {@link AdherenceData} for adherence calculations
 */
export interface MissedDose {
  id: string;
  studentMedicationId: string;
  scheduledTime: string;
  missedAt: string;
  reason: string;
  reportedBy: string;
  reportedByName?: string;
  actionTaken?: string;
  parentNotified?: boolean;
  parentNotifiedAt?: string;
  createdAt: string;
}

// ============================================================================
// PRESCRIPTION MANAGEMENT
// ============================================================================

/**
 * Prescription record
 */
export interface Prescription {
  id: string;
  studentId: string;
  medicationName: string;
  genericName?: string;
  prescriberId: string;
  prescriberName: string;
  prescriberPhone?: string;
  prescriptionNumber?: string;
  dosage: string;
  frequency: MedicationFrequency;
  route: MedicationRoute;
  quantity: number;
  unit: string;
  refillsAllowed: number;
  refillsRemaining: number;
  prescribedDate: string;
  expirationDate: string;
  instructions?: string;
  warnings?: string[];
  isActive: boolean;
  isControlled?: boolean;
  controlledSubstanceSchedule?: string;
  pharmacyName?: string;
  pharmacyPhone?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Prescription refill request
 */
export interface RefillRequest {
  id: string;
  prescriptionId: string;
  requestedAt: string;
  requestedBy: string;
  requestedByName?: string;
  status: 'PENDING' | 'APPROVED' | 'DENIED' | 'FILLED';
  approvedAt?: string;
  approvedBy?: string;
  deniedAt?: string;
  deniedBy?: string;
  denialReason?: string;
  filledAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// MEDICATION INVENTORY
// ============================================================================

/**
 * Medication inventory record
 */
export interface MedicationInventory {
  id: string;
  medicationId: string;
  medicationName: string;
  batchNumber?: string;
  expirationDate: string;
  quantity: number;
  unit: string;
  location: string;
  minimumQuantity: number;
  maximumQuantity?: number;
  costPerUnit: number;
  supplier?: string;
  lastRestocked?: string;
  isExpired: boolean;
  isLowStock: boolean;
  needsReorder: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Inventory adjustment record
 */
export interface InventoryAdjustment {
  id: string;
  inventoryId: string;
  adjustmentType: 'ADD' | 'REMOVE' | 'CORRECTION' | 'EXPIRATION' | 'DISPOSAL';
  quantityBefore: number;
  quantityAfter: number;
  quantityChanged: number;
  reason: string;
  performedBy: string;
  performedByName?: string;
  batchNumber?: string;
  expirationDate?: string;
  notes?: string;
  createdAt: string;
}

// ============================================================================
// DRUG INTERACTIONS & SAFETY
// ============================================================================

/**
 * Drug interaction alert for identifying potential medication conflicts.
 *
 * Represents a detected or potential interaction between two medications,
 * including severity assessment and recommended actions.
 *
 * @interface DrugInteraction
 *
 * @property {string} id - Unique identifier for the interaction alert
 * @property {string} medication1Id - First medication involved in interaction
 * @property {string} medication1Name - Name of first medication for display
 * @property {string} medication2Id - Second medication involved in interaction
 * @property {string} medication2Name - Name of second medication for display
 * @property {'MINOR' | 'MODERATE' | 'MAJOR' | 'CONTRAINDICATED'} severity - Interaction severity level
 * @property {string} description - Detailed description of the interaction and potential effects
 * @property {string} recommendation - Recommended action (e.g., "Monitor closely", "Avoid combination", "Consult physician")
 * @property {string} [source] - Source of interaction data (e.g., "FDA", "DrugBank", "Clinical pharmacist")
 * @property {string} [studentId] - Student ID if interaction detected for specific student (PHI)
 * @property {string} [acknowledgedBy] - User ID of healthcare provider who acknowledged alert
 * @property {string} [acknowledgedAt] - ISO timestamp of acknowledgment
 * @property {string} createdAt - ISO timestamp of alert creation
 *
 * @example
 * ```typescript
 * const interaction: DrugInteraction = {
 *   id: 'interaction-001',
 *   medication1Id: 'med-ibuprofen',
 *   medication1Name: 'Ibuprofen 200mg',
 *   medication2Id: 'med-aspirin',
 *   medication2Name: 'Aspirin 81mg',
 *   severity: 'MODERATE',
 *   description: 'Concurrent use may increase risk of gastrointestinal bleeding',
 *   recommendation: 'Monitor for signs of bleeding. Consider alternative pain management.',
 *   source: 'FDA Drug Interaction Database',
 *   studentId: 'student-123',
 *   createdAt: '2025-10-26T10:00:00Z'
 * };
 * ```
 *
 * @remarks
 * Medication Safety: CONTRAINDICATED interactions must prevent medication administration
 * until physician review. MAJOR interactions require documented clinical decision.
 *
 * Alert Management: All interactions should be reviewed by licensed healthcare provider.
 * Acknowledgment is required before proceeding with administration.
 *
 * @see {@link InteractionChecker} component for interaction checking UI
 * @see {@link InteractionAlerts} component for displaying active alerts
 */
export interface DrugInteraction {
  id: string;
  medication1Id: string;
  medication1Name: string;
  medication2Id: string;
  medication2Name: string;
  severity: 'MINOR' | 'MODERATE' | 'MAJOR' | 'CONTRAINDICATED';
  description: string;
  recommendation: string;
  source?: string;
  studentId?: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  createdAt: string;
}

/**
 * Medication contraindication
 */
export interface Contraindication {
  id: string;
  medicationId: string;
  medicationName: string;
  conditionType: 'ALLERGY' | 'MEDICAL_CONDITION' | 'PREGNANCY' | 'AGE' | 'OTHER';
  condition: string;
  severity: 'MINOR' | 'MODERATE' | 'MAJOR' | 'ABSOLUTE';
  description: string;
  recommendation: string;
  createdAt: string;
}

/**
 * Adverse reaction report for documenting medication side effects and allergic reactions.
 *
 * Critical safety record documenting any adverse effects experienced by a student
 * after medication administration, including severity assessment and response actions.
 *
 * @interface AdverseReaction
 *
 * @property {string} id - Unique identifier for the adverse reaction report
 * @property {string} studentMedicationId - Reference to the student's medication prescription
 * @property {string} studentId - Student who experienced the reaction (PHI)
 * @property {string} medicationName - Name of medication that caused reaction
 * @property {string} reactionType - Type of reaction (e.g., "Allergic", "Side effect", "Toxicity")
 * @property {'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING'} severity - Severity classification
 * @property {string[]} symptoms - List of symptoms observed (e.g., ["Rash", "Itching", "Nausea"])
 * @property {string} onsetTime - ISO timestamp when reaction began
 * @property {string} [duration] - Duration of reaction (e.g., "30 minutes", "2 hours")
 * @property {string} [treatmentGiven] - Treatment provided for the reaction
 * @property {string} reportedBy - User ID of healthcare provider who documented reaction
 * @property {string} [reportedByName] - Full name of reporting provider
 * @property {boolean} reportedToPhysician - True if prescribing physician was notified
 * @property {string} [reportedToPhysicianAt] - ISO timestamp of physician notification
 * @property {boolean} parentNotified - True if parent/guardian was notified
 * @property {string} [parentNotifiedAt] - ISO timestamp of parent notification
 * @property {boolean} medicationDiscontinued - True if medication was stopped due to reaction
 * @property {string} [notes] - Additional clinical notes about the reaction and response
 * @property {string} createdAt - ISO timestamp of report creation
 * @property {string} updatedAt - ISO timestamp of last update
 *
 * @example
 * ```typescript
 * const reaction: AdverseReaction = {
 *   id: 'reaction-001',
 *   studentMedicationId: 'studentmed-456',
 *   studentId: 'student-789',
 *   medicationName: 'Amoxicillin 250mg',
 *   reactionType: 'Allergic',
 *   severity: 'MODERATE',
 *   symptoms: ['Hives', 'Itching', 'Facial swelling'],
 *   onsetTime: '2025-10-26T10:45:00Z',
 *   duration: '2 hours',
 *   treatmentGiven: 'Diphenhydramine 25mg given, monitored in health office',
 *   reportedBy: 'nurse-123',
 *   reportedByName: 'Sarah Johnson, RN',
 *   reportedToPhysician: true,
 *   reportedToPhysicianAt: '2025-10-26T11:00:00Z',
 *   parentNotified: true,
 *   parentNotifiedAt: '2025-10-26T11:15:00Z',
 *   medicationDiscontinued: true,
 *   notes: 'Student stable after treatment. Allergy added to student record.',
 *   createdAt: '2025-10-26T10:50:00Z',
 *   updatedAt: '2025-10-26T13:00:00Z'
 * };
 * ```
 *
 * @remarks
 * Critical Safety: SEVERE and LIFE_THREATENING reactions require immediate emergency
 * response (911) and must be reported to physician and parent immediately.
 *
 * Documentation: All adverse reactions must be thoroughly documented and may require
 * incident reports per school policy. Reactions should be added to student allergy list.
 *
 * Follow-up: Physician must provide alternative medication orders before resuming treatment.
 *
 * @see {@link Contraindication} for known contraindications
 * @see {@link DrugInteraction} for interaction-related adverse effects
 */
export interface AdverseReaction {
  id: string;
  studentMedicationId: string;
  studentId: string;
  medicationName: string;
  reactionType: string;
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';
  symptoms: string[];
  onsetTime: string;
  duration?: string;
  treatmentGiven?: string;
  reportedBy: string;
  reportedByName?: string;
  reportedToPhysician: boolean;
  reportedToPhysicianAt?: string;
  parentNotified: boolean;
  parentNotifiedAt?: string;
  medicationDiscontinued: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// COMPLIANCE & REPORTING
// ============================================================================

/**
 * Adherence tracking data
 */
export interface AdherenceData {
  studentMedicationId: string;
  studentId: string;
  studentName: string;
  medicationName: string;
  totalScheduled: number;
  totalAdministered: number;
  totalMissed: number;
  totalRefused: number;
  adherenceRate: number; // Percentage
  period: {
    start: string;
    end: string;
  };
}

/**
 * Medication audit log entry
 */
export interface MedicationAuditLog {
  id: string;
  entityType: 'MEDICATION' | 'ADMINISTRATION' | 'PRESCRIPTION' | 'INVENTORY';
  entityId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'ADMINISTER' | 'REFILL' | 'ADJUST';
  performedBy: string;
  performedByName?: string;
  performedByRole?: string;
  changesBefore?: Record<string, any>;
  changesAfter?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  notes?: string;
  createdAt: string;
}

/**
 * Compliance report data
 */
export interface ComplianceReport {
  reportId: string;
  generatedAt: string;
  generatedBy: string;
  period: {
    start: string;
    end: string;
  };
  summary: {
    totalMedications: number;
    totalAdministrations: number;
    totalMissedDoses: number;
    totalRefusals: number;
    averageAdherence: number;
    studentsWithMedications: number;
  };
  byMedication: Array<{
    medicationName: string;
    administrations: number;
    missed: number;
    refused: number;
    adherenceRate: number;
  }>;
  byStudent: Array<{
    studentId: string;
    studentName: string;
    medications: number;
    administrations: number;
    missed: number;
    refused: number;
    adherenceRate: number;
  }>;
  alerts: Array<{
    type: string;
    severity: string;
    message: string;
    relatedEntity?: string;
  }>;
}

// ============================================================================
// STATISTICS & METRICS
// ============================================================================

/**
 * Medication statistics
 */
export interface MedicationStatistics {
  totalActive: number;
  totalInactive: number;
  totalExpired: number;
  dueToday: number;
  dueNow: number;
  overdue: number;
  expiringSoon: number;
  lowStock: number;
  byType: Record<MedicationType, number>;
  byRoute: Record<MedicationRoute, number>;
  byFrequency: Record<MedicationFrequency, number>;
  topMedications: Array<{
    medicationName: string;
    studentCount: number;
    administrationCount: number;
  }>;
  alerts?: Array<{
    type: string;
    title: string;
    message: string;
    severity: string;
  }>;
}

// ============================================================================
// FILTERS & SEARCH
// ============================================================================

/**
 * Medication filters
 */
export interface MedicationFilters {
  studentId?: string;
  medicationId?: string;
  status?: MedicationStatus;
  type?: MedicationType;
  route?: MedicationRoute;
  frequency?: MedicationFrequency;
  isActive?: boolean;
  requiresParentConsent?: boolean;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
  searchTerm?: string;
  page?: number;
  limit?: number;
}

/**
 * Administration filters
 */
export interface AdministrationFilters {
  studentId?: string;
  medicationId?: string;
  administeredBy?: string;
  dateFrom?: string;
  dateTo?: string;
  includeRefusals?: boolean;
  page?: number;
  limit?: number;
}

/**
 * Prescription filters
 */
export interface PrescriptionFilters {
  studentId?: string;
  prescriberId?: string;
  isActive?: boolean;
  isControlled?: boolean;
  expiringWithinDays?: number;
  needsRefill?: boolean;
  page?: number;
  limit?: number;
}

// ============================================================================
// UI STATE & PROPS
// ============================================================================

/**
 * Medication form data
 */
export interface MedicationFormData {
  studentId: string;
  medicationId?: string;
  medicationName: string;
  genericName?: string;
  dosage: string;
  frequency: MedicationFrequency;
  route: MedicationRoute;
  startDate: string;
  endDate?: string;
  prescribedBy?: string;
  instructions?: string;
  sideEffects?: string;
  warnings?: string[];
  requiresParentConsent?: boolean;
  isEmergency?: boolean;
  isControlled?: boolean;
}

/**
 * Medication view mode
 */
export type MedicationViewMode = 'list' | 'grid' | 'calendar' | 'timeline';

/**
 * Medication sort options
 */
export type MedicationSortBy =
  | 'name'
  | 'student'
  | 'startDate'
  | 'endDate'
  | 'frequency'
  | 'status'
  | 'createdAt';

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc';

// ============================================================================
// EXPORT TYPE GUARDS
// ============================================================================

/**
 * Type guard for checking if a medication is currently active.
 *
 * Validates that a medication is both flagged as active and has an ACTIVE status,
 * ensuring it can be administered according to current orders.
 *
 * @param {StudentMedication} medication - The medication to check
 * @returns {boolean} True if medication is active and can be administered
 *
 * @example
 * ```typescript
 * const medication = getMedication('med-123');
 * if (isActiveMedication(medication)) {
 *   // Proceed with administration
 * } else {
 *   // Show inactive medication warning
 * }
 * ```
 *
 * @remarks
 * Medication Safety: Only active medications should be available for administration.
 * Inactive or discontinued medications require physician reauthorization.
 */
export const isActiveMedication = (medication: StudentMedication): boolean => {
  return medication.isActive && medication.status === 'ACTIVE';
};

/**
 * Type guard for checking if a medication prescription has expired.
 *
 * Determines if a medication's end date has passed, indicating the prescription
 * is no longer valid and requires renewal.
 *
 * @param {StudentMedication} medication - The medication to check
 * @returns {boolean} True if medication has expired based on end date
 *
 * @example
 * ```typescript
 * const medication = getMedication('med-123');
 * if (isExpiredMedication(medication)) {
 *   alert('This medication prescription has expired. Contact prescriber for renewal.');
 * }
 * ```
 *
 * @remarks
 * Medication Safety: Expired medications cannot be administered. System should
 * alert nurses before expiration to ensure continuity of care.
 *
 * Compliance: Administering expired medications violates school health protocols
 * and may have liability implications.
 */
export const isExpiredMedication = (medication: StudentMedication): boolean => {
  if (!medication.endDate) return false;
  return new Date(medication.endDate) < new Date();
};

/**
 * Type guard for checking if a medication requires parent/guardian consent.
 *
 * Identifies medications that require documented parent consent but do not yet
 * have consent on file, preventing administration until consent is obtained.
 *
 * @param {StudentMedication} medication - The medication to check
 * @returns {boolean} True if consent is required but not yet provided
 *
 * @example
 * ```typescript
 * const medication = getMedication('med-123');
 * if (requiresConsent(medication)) {
 *   // Show consent form to parent
 *   // Block administration until consent obtained
 * }
 * ```
 *
 * @remarks
 * Legal Requirement: Many schools require written parent consent for all medications,
 * especially PRN (as-needed) medications and controlled substances.
 *
 * Medication Safety: Administering medication without required consent may violate
 * school policy and create liability issues.
 *
 * Consent Tracking: Once consent is obtained, parentConsentDate should be set to
 * indicate compliance.
 */
export const requiresConsent = (medication: StudentMedication): boolean => {
  return medication.requiresParentConsent === true && !medication.parentConsentDate;
};
