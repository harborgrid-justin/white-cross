/**
 * Unified API response types and interfaces
 * This file standardizes all API interactions across the application
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

export interface Medication extends BaseEntity {
  name: string;
  genericName?: string;
  dosageForm: string;
  strength: string;
  manufacturer?: string;
  ndc?: string;
  isControlled: boolean;
  category?: string;
  description?: string;
  sideEffects?: string[];
  contraindications?: string[];
}

export interface MedicationInventory extends BaseEntity {
  medicationId: string;
  medication?: Medication;
  batchNumber: string;
  quantity: number;
  reorderLevel: number;
  reorderQuantity?: number;
  expirationDate: string;
  costPerUnit?: number;
  supplier?: string;
  location?: string;
  notes?: string;
}

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
  isActive: boolean;
  student?: Student;
  medication?: Medication;
  administrationLogs?: MedicationAdministration[];
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