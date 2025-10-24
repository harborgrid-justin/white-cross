/**
 * Medications Page Type Definitions
 * Purpose: Type definitions for medication management functionality
 * Related: medicationsSlice.ts, medication components
 *
 * Provides comprehensive type safety for:
 * - Medication entities and related data
 * - Administration tracking
 * - Prescription management
 * - Inventory tracking
 * - Compliance and reporting
 */

import { StudentMedication } from '../../types/student.types';

// ============================================================================
// CORE MEDICATION TYPES
// ============================================================================

/**
 * Medication administration route
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
 * Medication frequency patterns
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
 * Medication status
 */
export type MedicationStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'DISCONTINUED'
  | 'EXPIRED'
  | 'PENDING'
  | 'SUSPENDED';

/**
 * Medication type classification
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
 * Medication administration record
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
 * Scheduled administration time
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
 * Missed dose record
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
 * Drug interaction alert
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
 * Adverse reaction report
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
 * Type guard for checking if medication is active
 */
export const isActiveMedication = (medication: StudentMedication): boolean => {
  return medication.isActive && medication.status === 'ACTIVE';
};

/**
 * Type guard for checking if medication is expired
 */
export const isExpiredMedication = (medication: StudentMedication): boolean => {
  if (!medication.endDate) return false;
  return new Date(medication.endDate) < new Date();
};

/**
 * Type guard for checking if medication requires consent
 */
export const requiresConsent = (medication: StudentMedication): boolean => {
  return medication.requiresParentConsent === true && !medication.parentConsentDate;
};
