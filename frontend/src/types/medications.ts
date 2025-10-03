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

export type SeverityLevel = 
  | 'LOW'
  | 'MEDIUM' 
  | 'HIGH'
  | 'CRITICAL'

export type ReminderStatus = 
  | 'PENDING'
  | 'COMPLETED'
  | 'MISSED'

// Medication Interfaces
export interface Medication {
  id: string
  name: string
  genericName?: string
  dosageForm: DosageForm
  strength: string
  manufacturer?: string
  isControlled: boolean
  inventory?: InventoryItem[]
  _count?: {
    studentMedications: number
  }
  createdAt: string
  updatedAt: string
}

export interface InventoryItem {
  id: string
  medicationId: string
  medication: Medication
  batchNumber: string
  quantity: number
  reorderLevel: number
  expirationDate: string
  supplier?: string
  alerts?: {
    expired: boolean
    nearExpiry: boolean
    lowStock: boolean
  }
  createdAt: string
  updatedAt: string
}

export interface MedicationReminder {
  id: string
  studentId: string
  studentName: string
  medicationId: string
  medicationName: string
  dosage: string
  scheduledTime: string
  status: ReminderStatus
  notes?: string
  administeredAt?: string
  administeredBy?: string
  createdAt: string
  updatedAt: string
}

export interface AdverseReaction {
  id: string
  studentId: string
  medicationId: string
  severity: SeverityLevel
  description: string
  actionsTaken: string
  occurredAt: string
  reportedById: string
  student: {
    id: string
    firstName: string
    lastName: string
  }
  medication: {
    id: string
    name: string
  }
  reportedBy: {
    id: string
    firstName: string
    lastName: string
  }
  createdAt: string
  updatedAt: string
}

// Form Data Interfaces
export interface MedicationFormData {
  name: string
  genericName: string
  dosageForm: string
  strength: string
  manufacturer: string
  isControlled: boolean
}

export interface AdverseReactionFormData {
  studentId: string
  medicationId: string
  severity: SeverityLevel
  description: string
  actionsTaken: string
  occurredAt: string
}

export interface InventoryFormData {
  medicationId: string
  batchNumber: string
  quantity: number
  reorderLevel: number
  expirationDate: string
  supplier: string
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
}

export interface AdverseReactionFormErrors {
  studentId?: string
  medicationId?: string
  severity?: string
  description?: string
  actionsTaken?: string
  occurredAt?: string
}

// API Response Interfaces
export interface MedicationsResponse {
  medications: Medication[]
  total: number
  page: number
  limit: number
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
  total: number
}

export interface AdverseReactionsResponse {
  reactions: AdverseReaction[]
  total: number
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
  controlledSubstances: number
  activePrescriptions: number
  lowStockItems: number
  expiringItems: number
  todayReminders: number
  adverseReactions: number
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

// Hook Return Types
export interface UseMedicationsDataReturn {
  // Data
  medications: Medication[]
  inventory: InventoryItem[]
  reminders: MedicationReminder[]
  adverseReactions: AdverseReaction[]
  stats: MedicationStats | null
  
  // Loading states
  medicationsLoading: boolean
  inventoryLoading: boolean
  remindersLoading: boolean
  adverseReactionsLoading: boolean
  
  // CRUD operations
  createMedication: (data: MedicationFormData) => Promise<boolean>
  updateMedication: (id: string, data: Partial<MedicationFormData>) => Promise<boolean>
  deleteMedication: (id: string) => Promise<boolean>
  
  // Inventory operations
  updateStock: (itemId: string, quantity: number) => Promise<boolean>
  disposeExpired: (itemId: string) => Promise<boolean>
  
  // Reminder operations
  markReminderCompleted: (reminderId: string) => Promise<boolean>
  markReminderMissed: (reminderId: string) => Promise<boolean>
  
  // Adverse reaction operations
  reportAdverseReaction: (data: AdverseReactionFormData) => Promise<boolean>
  updateAdverseReaction: (id: string, data: Partial<AdverseReactionFormData>) => Promise<boolean>
  
  // Data loading
  loadMedications: (page?: number, limit?: number, search?: string) => void
  loadInventory: () => void
  loadReminders: () => void
  loadAdverseReactions: () => void
}

export interface UseFormValidationReturn {
  errors: FormErrors
  validateMedicationForm: (data: MedicationFormData) => FormErrors
  validateAdverseReactionForm: (data: AdverseReactionFormData) => FormErrors
  validateInventoryForm: (data: InventoryFormData) => FormErrors
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