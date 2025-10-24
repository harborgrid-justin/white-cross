/**
 * WF-COMP-329 | medications.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: interfaces, types | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

// Medication Management Types and Interfaces

// Main Types
export type MedicationTab = 'overview' | 'medications' | 'inventory' | 'reminders' | 'adverse-reactions'

/**
 * Dosage form types for medications (UI-specific)
 * Note: Backend Medication.dosageForm is a free STRING field, not enum-validated.
 * This type provides standardized options for UI dropdowns, but backend accepts any string value.
 * @see backend/src/database/models/core/Medication.ts
 */
export type DosageForm =
  | 'Tablet'
  | 'Capsule'
  | 'Liquid'
  | 'Inhaler'
  | 'Injection'
  | 'Cream'
  | 'Ointment'
  | 'Drops'
  | 'Patch'
  | 'Suppository'
  | 'Powder'
  | 'Gel'
  | 'Spray'
  | 'Lozenge'
  | 'Topical'

/**
 * Administration route types for medications (UI-specific detailed list)
 * Note: Backend StudentMedication.route is a free STRING field, not enum-validated.
 * Backend has AdministrationRoute enum with UPPERCASE values, but it's used for vaccines, not student medications.
 * This frontend type provides detailed UI options; backend accepts any string for StudentMedication.route.
 * @see backend/src/database/models/medications/StudentMedication.ts (route: STRING field)
 * @see backend/src/database/types/enums.ts:AdministrationRoute (vaccine-specific enum)
 */
export type AdministrationRoute =
  | 'Oral'
  | 'Sublingual'
  | 'Topical'
  | 'Intravenous'
  | 'Intramuscular'
  | 'Subcutaneous'
  | 'Inhalation'
  | 'Ophthalmic'
  | 'Otic'
  | 'Nasal'
  | 'Rectal'
  | 'Transdermal'

/**
 * Severity level for medication-related incidents
 * Similar to IncidentSeverity enum
 */
export type SeverityLevel =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL'

/**
 * Adverse reaction severity levels
 * @aligned_with backend/src/database/types/enums.ts:AllergySeverity
 */
export type AdverseReactionSeverity =
  | 'MILD'
  | 'MODERATE'
  | 'SEVERE'
  | 'LIFE_THREATENING'

/**
 * Medication log status types (UI-specific)
 * Note: Used for UI display. Backend MedicationLog tracks administration records without status enum.
 */
export type MedicationLogStatus =
  | 'administered'
  | 'missed'
  | 'refused'
  | 'held'

// Import types from api.ts to avoid duplication
import type {
  Medication,
  StudentMedication,
  MedicationReminder,
  AdverseReaction,
  MedicationAlert as ApiMedicationAlert,
  MedicationFormData as ApiMedicationFormData,
  StudentMedicationFormData as ApiStudentMedicationFormData,
  AdverseReactionFormData as ApiAdverseReactionFormData,
  InventoryItem,
  InventoryTransaction
} from './api'

/**
 * Medication administration log
 * @aligned_with backend/src/database/models/medications/MedicationLog.ts
 *
 * HIPAA: Contains PHI - Student medication administration records
 *
 * Records each instance of medication administration to students.
 * Provides complete audit trail for medication dispensing with timestamps,
 * dosage information, and nurse documentation. Critical for HIPAA compliance
 * and medication error prevention.
 *
 * Five Rights of Medication Administration:
 * - Right Patient (patientVerified: true)
 * - Right Medication (linked via studentMedicationId)
 * - Right Dose (dosageGiven must match prescription)
 * - Right Route (inherited from StudentMedication)
 * - Right Time (timeGiven timestamp)
 *
 * @property {string} dosageGiven - Actual dosage administered (may differ from prescribed)
 * @property {string} timeGiven - Exact date and time medication was administered
 * @property {string} administeredBy - Name of person who administered the medication
 * @property {string} notes - Additional notes about administration
 * @property {string} sideEffects - Any observed side effects or adverse reactions
 * @property {string} deviceId - Device ID used for administration (for idempotency)
 * @property {string} witnessId - Witness user ID (required for controlled substances Schedule I-II)
 * @property {string} witnessName - Name of witness who verified administration
 * @property {boolean} patientVerified - Whether patient identity was verified (Right Patient)
 * @property {boolean} allergyChecked - Whether allergies were checked before administration
 * @property {string} createdBy - User who created this log entry (audit trail)
 * @property {string} updatedBy - User who last updated this log (audit trail)
 *
 * Note: Backend model has timestamps: false for updatedAt, only createdAt is tracked
 */
export interface MedicationLog {
  id: string
  studentMedicationId: string
  nurseId: string
  administeredBy: string
  dosageGiven: string
  timeGiven: string
  notes?: string
  sideEffects?: string
  deviceId?: string
  witnessId?: string
  witnessName?: string
  patientVerified: boolean
  allergyChecked: boolean
  nurse?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  studentMedication?: StudentMedication
  createdAt: string

  // Audit fields
  createdBy?: string
  updatedBy?: string
}

// Form Data Interfaces (medication-specific extensions)
export interface MedicationFormData extends ApiMedicationFormData {
  // Additional medication-specific form fields can be added here
}

export interface StudentMedicationFormData extends ApiStudentMedicationFormData {
  // Additional student medication-specific form fields can be added here
}

export interface AdverseReactionFormData extends ApiAdverseReactionFormData {
  // Additional adverse reaction-specific form fields can be added here
}

export interface MedicationAdministrationData {
  studentMedicationId: string
  nurseId?: string
  dosageGiven: string
  timeGiven: string
  notes?: string
  sideEffects?: string
  deviceId?: string
}

export interface AdverseReactionData {
  studentMedicationId: string
  reportedBy?: string
  severity: AdverseReactionSeverity
  reaction: string
  actionTaken: string
  notes?: string
  reportedAt: string
}

export interface PrescriptionData {
  studentId: string
  medicationId: string
  dosage: string
  frequency: string
  route: string
  instructions?: string
  startDate: string
  endDate?: string
  prescribedBy: string
}

// Remove duplicate - this is already defined above as an extension of ApiAdverseReactionFormData

export interface InventoryFormData {
  medicationId: string
  batchNumber: string
  quantity: number
  reorderLevel: number
  expirationDate: string
  costPerUnit?: number
  supplier?: string
}

// Form Error Types
export interface FormErrors {
  [key: string]: string
}

export interface MedicationFormErrors {
  name?: string
  genericName?: string
  dosageForm?: string
  strength?: string
  manufacturer?: string
  ndc?: string
}

export interface StudentMedicationFormErrors {
  studentId?: string
  medicationId?: string
  dosage?: string
  frequency?: string
  route?: string
  instructions?: string
  startDate?: string
  endDate?: string
  prescribedBy?: string
}

export interface AdverseReactionFormErrors {
  studentMedicationId?: string
  severity?: string
  description?: string
  reaction?: string
  actionsTaken?: string
  occurredAt?: string
  notes?: string
}

// API Response Interfaces
export interface MedicationsResponse {
  medications: Medication[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface StudentMedicationsResponse {
  logs: MedicationLog[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface InventoryResponse {
  inventory: InventoryItem[]
  alerts: {
    expired: InventoryItem[]
    nearExpiry: InventoryItem[]
    lowStock: InventoryItem[]
  }
}

export interface RemindersResponse {
  reminders: MedicationReminder[]
}

export interface AdverseReactionsResponse {
  reactions: AdverseReaction[]
}

export interface MedicationScheduleResponse {
  schedule: StudentMedication[]
}

export interface MedicationAlert {
  id: string
  type: 'LOW_STOCK' | 'EXPIRING' | 'MISSED_DOSE'
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  message: string
  medicationId?: string
  medicationName?: string
  currentQuantity?: number
  reorderLevel?: number
  expirationDate?: string
  daysUntilExpiry?: number
  studentName?: string
  dosage?: string
  scheduledTime?: string
}

export interface MedicationAlertsResponse {
  lowStock: MedicationAlert[]
  expiring: MedicationAlert[]
  missedDoses: MedicationAlert[]
}

export interface MedicationFormOptions {
  dosageForms: string[]
  categories: string[]
  strengthUnits: string[]
  routes: string[]
  frequencies: string[]
}

// Tab Configuration Interface
export interface MedicationTabConfig {
  id: MedicationTab
  label: string
  icon: any // Lucide icon component
}

// Statistics Interface
export interface MedicationStats {
  totalMedications: number
  activePrescriptions: number
  administeredToday: number
  adverseReactions: number
  lowStockCount: number
  expiringCount: number
}

// Search and Filter Interfaces
export interface MedicationSearchFilters {
  searchTerm: string
  dosageForm?: DosageForm
  isControlled?: boolean
  manufacturer?: string
}

export interface InventoryFilters {
  alertType?: 'expired' | 'nearExpiry' | 'lowStock' | 'all'
  supplier?: string
  medicationName?: string
}

// Event Handler Types
export interface MedicationEventHandlers {
  onAddMedication: () => void
  onEditMedication: (medication: Medication) => void
  onViewMedication: (medication: Medication) => void
  onDeleteMedication: (medicationId: string) => void
}

export interface InventoryEventHandlers {
  onUpdateStock: (itemId: string, quantity: number) => void
  onReorderItem: (itemId: string) => void
  onDisposeExpired: (itemId: string) => void
}

export interface ReminderEventHandlers {
  onMarkCompleted: (reminderId: string) => void
  onMarkMissed: (reminderId: string) => void
  onReschedule: (reminderId: string, newTime: string) => void
}

export interface AdverseReactionEventHandlers {
  onReportReaction: () => void
  onViewReaction: (reaction: AdverseReaction) => void
  onEditReaction: (reaction: AdverseReaction) => void
  onDeleteReaction: (reactionId: string) => void
}

// Component Props Interfaces
export interface TabContentProps {
  searchTerm?: string
  onSearchChange?: (term: string) => void
  isLoading?: boolean
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  errors?: FormErrors
}

export interface MedicationModalProps extends ModalProps {
  medication?: Medication | null
}

export interface AdverseReactionModalProps extends ModalProps {
  reaction?: AdverseReaction | null
}

// Five Rights Validation Interface
export interface FiveRightsValidation {
  rightPatient: boolean
  rightMedication: boolean
  rightDose: boolean
  rightRoute: boolean
  rightTime: boolean
  allergyChecked: boolean
  errors?: string[]
}

// Hook Return Types
export interface UseMedicationsDataReturn {
  // Data
  medications: Medication[]
  studentMedications: StudentMedication[]
  medicationLogs: MedicationLog[]
  inventory: InventoryItem[]
  reminders: MedicationReminder[]
  adverseReactions: AdverseReaction[]
  alerts: MedicationAlertsResponse | null
  stats: MedicationStats | null
  formOptions: MedicationFormOptions | null

  // Loading states
  medicationsLoading: boolean
  inventoryLoading: boolean
  remindersLoading: boolean
  adverseReactionsLoading: boolean
  logsLoading: boolean

  // CRUD operations
  createMedication: (data: MedicationFormData) => Promise<boolean>
  updateMedication: (id: string, data: Partial<MedicationFormData>) => Promise<boolean>
  deleteMedication: (id: string) => Promise<boolean>

  // Student medication operations
  assignMedication: (data: StudentMedicationFormData) => Promise<boolean>
  deactivateStudentMedication: (id: string, reason?: string) => Promise<boolean>

  // Administration operations
  logAdministration: (data: MedicationAdministrationData) => Promise<boolean>
  getStudentLogs: (studentId: string, page?: number, limit?: number) => Promise<void>

  // Inventory operations
  addToInventory: (data: InventoryFormData) => Promise<boolean>
  updateInventoryQuantity: (id: string, quantity: number, reason?: string) => Promise<boolean>

  // Schedule operations
  getSchedule: (startDate?: string, endDate?: string, nurseId?: string) => Promise<StudentMedication[]>
  getReminders: (date?: string) => Promise<MedicationReminder[]>

  // Adverse reaction operations
  reportAdverseReaction: (data: AdverseReactionData) => Promise<boolean>
  getAdverseReactions: (medicationId?: string, studentId?: string) => Promise<AdverseReaction[]>

  // Statistics and alerts
  getStats: () => Promise<MedicationStats>
  getAlerts: () => Promise<MedicationAlertsResponse>
  getFormOptions: () => Promise<MedicationFormOptions>

  // Data loading
  loadMedications: (page?: number, limit?: number, search?: string) => void
  loadInventory: () => void
  loadReminders: () => void
  loadAdverseReactions: () => void
}

export interface UseFormValidationReturn {
  errors: FormErrors
  validateMedicationForm: (data: MedicationFormData) => FormErrors
  validateStudentMedicationForm: (data: StudentMedicationFormData) => FormErrors
  validateAdverseReactionForm: (data: AdverseReactionFormData) => FormErrors
  validateInventoryForm: (data: InventoryFormData) => FormErrors
  validateFiveRights: (data: MedicationAdministrationData, prescription: StudentMedication) => FiveRightsValidation
  clearErrors: () => void
  setFieldError: (field: string, error: string) => void
  displayValidationErrors: (errors: FormErrors, prefix?: string) => void
}

export interface UseToastReturn {
  showSuccess: (message: string) => void
  showError: (message: string) => void
  showWarning: (message: string) => void
  showInfo: (message: string) => void
}
