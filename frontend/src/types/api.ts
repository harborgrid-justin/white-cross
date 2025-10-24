/**
 * @fileoverview Unified API types and interfaces for all API interactions
 * @module types/api
 * @category Types
 * 
 * Standardized TypeScript interfaces for all API request/response payloads
 * across the healthcare platform, ensuring type safety and consistency.
 * 
 * Type Organization:
 * - **Medications**: Medication entities, inventory, administration logs
 * - **Students**: Student profiles, demographics, relationships
 * - **Health Records**: Medical history, allergies, conditions, vaccinations
 * - **Appointments**: Appointment scheduling and management
 * - **Incidents**: Incident reporting and tracking
 * - **Communication**: Messages, notifications, templates
 * - **Administration**: Users, schools, districts, settings
 * 
 * Design Principles:
 * - Extends BaseEntity for common fields (id, createdAt, updatedAt)
 * - Optional fields use ? operator
 * - Related entities use optional composition
 * - Enums for fixed value sets (imported from common.ts)
 * - PHI fields clearly marked in documentation
 * 
 * HIPAA Considerations:
 * - All patient data interfaces contain PHI
 * - Medication interfaces contain PHI when linked to students
 * - Audit logging required for all PHI access
 * - No PHI in error messages or logs
 * 
 * @example
 * ```typescript
 * // Type-safe API calls
 * const medication: Medication = await api.get<Medication>('/medications/123');
 * 
 * // Type-safe request payloads
 * const createData: CreateMedicationRequest = {
 *   name: 'Ibuprofen',
 *   dosageForm: 'tablet',
 *   strength: '200mg'
 * };
 * const created = await api.post<Medication>('/medications', createData);
 * 
 * // Type-safe with relations
 * const studentMed: StudentMedication = {
 *   studentId: 'student-123',
 *   medicationId: 'med-456',
 *   dosage: '200mg',
 *   frequency: 'twice daily',
 *   route: MedicationRoute.ORAL,
 *   startDate: '2025-01-01',
 *   prescribedBy: 'Dr. Smith',
 *   isActive: true
 * };
 * ```
 */

import type {
  User,
  Student,
  Priority,
  AppointmentType,
  AppointmentStatus,
  IncidentType,
  AllergySeverity,
  MedicationRoute,
  BaseEntity,
  PaginationParams,
  DateRangeFilter
} from './common';

// =====================
// MEDICATIONS MODULE
// =====================

/**
 * Medication entity representing a medication in the formulary
 * @aligned_with backend/src/database/models/core/Medication.ts
 */
export interface Medication extends BaseEntity {
  name: string;
  genericName?: string;
  dosageForm: string;
  strength: string;
  manufacturer?: string;
  ndc?: string; // National Drug Code
  isControlled: boolean;
  deaSchedule?: 'I' | 'II' | 'III' | 'IV' | 'V'; // DEA Schedule for controlled substances
  requiresWitness: boolean; // Whether administration requires witness (typically Schedule I-II)
  category?: string;
  description?: string;
  sideEffects?: string[];
  contraindications?: string[];
}

/**
 * Medication inventory tracking
 * @aligned_with backend/src/database/models/medications/MedicationInventory.ts
 *
 * Tracks medication stock levels with batch numbers, expiration dates, and costs.
 * Critical for DEA controlled substance requirements, FDA batch tracking, and recall management.
 *
 * @property {string} batchNumber - Manufacturer batch/lot number (required for FDA recalls)
 * @property {number} quantity - Current stock quantity (updated on dispensing/receiving)
 * @property {number} reorderLevel - Minimum threshold for reorder alerts (default: 10)
 * @property {string} expirationDate - Cannot dispense after this date (regulatory violation)
 * @property {number} costPerUnit - Cost per unit for budget tracking (DECIMAL(10,2))
 * @property {string} supplier - Supplier/pharmacy name (must have DEA registration for controlled substances)
 * @property {string} createdBy - User who created the inventory record (audit trail)
 * @property {string} updatedBy - User who last updated the record (tracks quantity adjustments)
 */
export interface MedicationInventory extends BaseEntity {
  medicationId: string;
  medication?: Medication;
  batchNumber: string;
  quantity: number;
  reorderLevel: number;
  expirationDate: string;
  costPerUnit?: number;
  supplier?: string;

  // Audit fields
  createdBy?: string;
  updatedBy?: string;
}

/**
 * Student medication assignment (prescription)
 * @aligned_with backend/src/database/models/medications/StudentMedication.ts
 *
 * HIPAA: Contains PHI - Student medication information
 *
 * Manages medication prescriptions assigned to individual students.
 * Links students with specific medications and tracks prescription details.
 * HIPAA-compliant with audit trail for all prescription changes.
 *
 * @property {string} dosage - Medication dosage (e.g., "10mg", "2 tablets")
 * @property {string} frequency - Administration frequency (e.g., "Once daily", "Twice daily", "As needed")
 * @property {MedicationRoute} route - Administration route (backend: string, frontend: enum for type safety)
 * @property {string} startDate - Date when medication regimen begins
 * @property {string} endDate - Date when medication regimen ends (null for ongoing)
 * @property {string} instructions - Special instructions for medication administration
 * @property {string} prescribedBy - Name of prescribing healthcare provider
 * @property {string} prescriptionNumber - Prescription number for tracking and verification
 * @property {number} refillsRemaining - Number of refills remaining (0-12)
 * @property {boolean} isActive - Whether this prescription is currently active
 * @property {string} createdBy - User who created the prescription (audit trail)
 * @property {string} updatedBy - User who last updated the prescription
 */
export interface StudentMedication extends BaseEntity {
  studentId: string;
  medicationId: string;
  dosage: string;
  frequency: string;
  route: MedicationRoute;
  startDate: string;
  endDate?: string;
  instructions?: string;
  prescribedBy: string;
  prescriptionNumber?: string;
  refillsRemaining?: number;
  isActive: boolean;
  student?: Student;
  medication?: Medication;
  administrationLogs?: MedicationAdministration[];

  // Audit fields
  createdBy?: string;
  updatedBy?: string;
}

export interface MedicationAdministration extends BaseEntity {
  studentMedicationId: string;
  administeredBy: string;
  administeredAt: string;
  dosageGiven: string;
  route: MedicationRoute;
  notes?: string;
  sideEffects?: string;
  wasEffective?: boolean;
  studentMedication?: StudentMedication;
  administeredByUser?: User;
}

export interface MedicationReminder extends BaseEntity {
  studentMedicationId: string;
  studentId: string;
  studentName: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  scheduledTime: string;
  status: 'PENDING' | 'COMPLETED' | 'MISSED' | 'CANCELLED';
  reminderSent?: boolean;
  completedAt?: string;
  completedBy?: string;
  notes?: string;
}

export interface AdverseReaction extends BaseEntity {
  studentId: string;
  medicationId: string;
  studentMedicationId?: string;
  reaction: string;
  severity: Priority;
  onset: string;
  duration?: string;
  treatment?: string;
  resolved: boolean;
  resolvedAt?: string;
  reportedBy: string;
  reportedById: string;
  followUpRequired: boolean;
  followUpNotes?: string;
  student?: Student;
  medication?: Medication;
  reportedByUser?: User;
}

export interface MedicationAlert extends BaseEntity {
  type: 'LOW_STOCK' | 'EXPIRED' | 'NEAR_EXPIRY' | 'ADVERSE_REACTION' | 'MISSED_DOSE' | 'DRUG_INTERACTION';
  severity: Priority;
  title: string;
  message: string;
  medicationId?: string;
  studentId?: string;
  inventoryId?: string;
  actionRequired: boolean;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  dueDate?: string;
}

// =====================
// APPOINTMENTS MODULE
// =====================

export interface Appointment extends BaseEntity {
  studentId: string;
  nurseId: string;
  type: AppointmentType;
  scheduledAt: string;
  duration: number; // in minutes
  status: AppointmentStatus;
  reason: string;
  notes?: string;
  privateNotes?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  student?: Student;
  nurse?: User;
  vitals?: VitalSigns;
  documentation?: AppointmentDocumentation[];
}

export interface VitalSigns extends BaseEntity {
  appointmentId: string;
  temperature?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  height?: number; // in cm
  weight?: number; // in kg
  bmi?: number;
  notes?: string;
  takenBy: string;
  takenAt: string;
}

export interface AppointmentDocumentation extends BaseEntity {
  appointmentId: string;
  type: 'ASSESSMENT' | 'TREATMENT' | 'REFERRAL' | 'FOLLOW_UP' | 'OTHER';
  title: string;
  content: string;
  isPrivate: boolean;
  attachments?: string[];
  createdBy: string;
}

// =====================
// HEALTH RECORDS MODULE
// =====================

export interface HealthRecord extends BaseEntity {
  studentId: string;
  type: 'VISIT' | 'SCREENING' | 'VACCINATION' | 'PHYSICAL' | 'EMERGENCY' | 'OTHER';
  date: string;
  provider?: string;
  diagnosis?: string;
  treatment?: string;
  medications?: string;
  followUp?: string;
  notes?: string;
  attachments?: string[];
  isPrivate: boolean;
  student?: Student;
  recordedBy: string;
  recordedByUser?: User;
}

export interface Allergy extends BaseEntity {
  studentId: string;
  allergen: string;
  severity: AllergySeverity;
  reaction?: string;
  treatment?: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  providerName?: string;
  notes?: string;
  student?: Student;
}

export interface ChronicCondition extends BaseEntity {
  studentId: string;
  condition: string;
  diagnosedDate?: string;
  severity?: Priority;
  status: 'ACTIVE' | 'MANAGED' | 'RESOLVED' | 'MONITORING';
  treatment?: string;
  medications?: string;
  restrictions?: string;
  emergencyPlan?: string;
  lastReview?: string;
  nextReview?: string;
  providerId?: string;
  providerName?: string;
  notes?: string;
  student?: Student;
}

export interface Vaccination extends BaseEntity {
  studentId: string;
  vaccineName: string;
  manufacturer?: string;
  lotNumber?: string;
  administeredDate: string;
  administeredBy?: string;
  doseNumber?: number;
  boosterRequired?: boolean;
  nextDueDate?: string;
  site?: string;
  reaction?: string;
  notes?: string;
  student?: Student;
}

// =====================
// INCIDENT REPORTS MODULE
// =====================
// NOTE: Comprehensive incident types are now defined in incidents.ts
// The types below are kept for backward compatibility only
// New code should import from '../types/incidents' instead

export type {
  IncidentReport,
  WitnessStatement,
  FollowUpAction
} from './incidents';

// =====================
// INVENTORY MODULE
// =====================

export interface InventoryItem extends BaseEntity {
  name: string;
  category: string;
  description?: string;
  sku?: string;
  barcode?: string;
  unitOfMeasure?: string;
  currentStock: number;
  reorderLevel: number;
  reorderQuantity: number;
  maxStock?: number;
  unitCost?: number;
  totalValue?: number;
  supplier?: string;
  supplierContact?: string;
  location?: string;
  notes?: string;
  isActive: boolean;
  lastRestocked?: string;
  earliestExpiration?: string;
  transactions?: InventoryTransaction[];
}

export interface InventoryTransaction extends BaseEntity {
  inventoryItemId: string;
  type: 'PURCHASE' | 'USAGE' | 'ADJUSTMENT' | 'TRANSFER' | 'DISPOSAL' | 'EXPIRED';
  quantity: number;
  unitCost?: number;
  totalCost?: number;
  reason?: string;
  batchNumber?: string;
  expirationDate?: string;
  reference?: string;
  performedBy: string;
  notes?: string;
  inventoryItem?: InventoryItem;
  performedByUser?: User;
}

export interface InventoryAlert {
  id: string;
  type: 'LOW_STOCK' | 'OUT_OF_STOCK' | 'EXPIRING_SOON' | 'EXPIRED';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  itemId: string;
  itemName: string;
  message: string;
  quantity?: number;
  reorderLevel?: number;
  expirationDate?: string;
  createdAt: string;
}

export interface Vendor extends BaseEntity {
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  taxId?: string;
  paymentTerms?: string;
  accountNumber?: string;
  notes?: string;
  isActive: boolean;
  rating?: number;
}

export interface PurchaseOrder extends BaseEntity {
  orderNumber: string;
  vendorId: string;
  vendor?: Vendor;
  orderDate: string;
  expectedDeliveryDate?: string;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'ORDERED' | 'RECEIVED' | 'CANCELLED';
  totalAmount: number;
  notes?: string;
  orderedBy: string;
  approvedBy?: string;
  receivedBy?: string;
  receivedDate?: string;
  total?: number;
  items?: unknown[];
}

export interface BudgetCategory extends BaseEntity {
  name: string;
  description?: string;
  allocatedAmount: number;
  spentAmount: number;
  fiscalYear: number;
  isActive: boolean;
  utilizationPercentage?: number;
}

// =====================
// API REQUEST/RESPONSE TYPES
// =====================

// Medication API
export interface MedicationFilters extends PaginationParams {
  search?: string;
  isControlled?: boolean;
  category?: string;
  expirationWarning?: boolean;
  lowStock?: boolean;
}

export interface MedicationStatsResponse {
  totalMedications: number;
  activePrescriptions: number;
  lowStockAlerts: number;
  expirationAlerts: number;
  adverseReactions: number;
  administrationsToday: number;
  pendingReminders: number;
}

// Appointment API
export interface AppointmentFilters extends PaginationParams, DateRangeFilter {
  status?: AppointmentStatus;
  type?: AppointmentType;
  nurseId?: string;
  studentId?: string;
}

export interface AppointmentStatsResponse {
  totalAppointments: number;
  todayAppointments: number;
  completedToday: number;
  cancelledToday: number;
  noShowToday: number;
  upcomingThisWeek: number;
  completionRate: number;
  noShowRate: number;
}

// Health Records API
export interface HealthRecordFilters extends PaginationParams, DateRangeFilter {
  studentId?: string;
  type?: string;
  provider?: string;
  isPrivate?: boolean;
  sensitive?: boolean;
}

// Incident Reports API - re-exported from incidents.ts
export type { IncidentReportFilters } from './incidents';

// Form Data Types
export interface MedicationFormData {
  name: string;
  genericName?: string;
  dosageForm: string;
  strength: string;
  manufacturer?: string;
  ndc?: string;
  isControlled: boolean;
  category?: string;
  description?: string;
}

export interface StudentMedicationFormData {
  studentId: string;
  medicationId: string;
  dosage: string;
  frequency: string;
  route: MedicationRoute;
  startDate: string;
  endDate?: string;
  instructions?: string;
  prescribedBy: string;
  prescriptionNumber?: string;
}

export interface AdverseReactionFormData {
  studentId: string;
  medicationId: string;
  studentMedicationId?: string;
  reaction: string;
  severity: Priority;
  onset: string;
  duration?: string;
  treatment?: string;
  followUpRequired: boolean;
  followUpNotes?: string;
}

export interface AppointmentFormData {
  studentId: string;
  type: AppointmentType;
  scheduledAt: string;
  duration: number;
  reason: string;
  notes?: string;
  followUpRequired: boolean;
  followUpDate?: string;
}

// Export unified types for backward compatibility
export type {
  User,
  Student,
  EmergencyContact,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  DateRangeFilter,
  Priority
} from './common';