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

export type SeverityLevel =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL'

export type AdverseReactionSeverity =
  | 'MILD'
  | 'MODERATE'
  | 'SEVERE'
  | 'LIFE_THREATENING'

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

// Medication-specific interface that extends base
export interface MedicationLog {
  id: string
  studentMedicationId: string
  nurseId: string
  administeredBy: string
  dosageGiven: string
  timeGiven: string
  notes?: string
  sideEffects?: string
  nurse?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  studentMedication?: StudentMedication
  createdAt: string
  updatedAt: string
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
