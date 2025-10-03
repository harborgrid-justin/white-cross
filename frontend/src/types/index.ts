export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'ADMIN' | 'NURSE' | 'SCHOOL_ADMIN' | 'DISTRICT_ADMIN' | 'READ_ONLY' | 'COUNSELOR'
}

export interface Student {
  id: string
  studentNumber: string
  firstName: string
  lastName: string
  dateOfBirth: string
  grade: string
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'
  photo?: string
  medicalRecordNum?: string
  isActive: boolean
  enrollmentDate: string
  emergencyContacts: EmergencyContact[]
  medications: StudentMedication[]
  allergies: Allergy[]
  nurse?: {
    id: string
    firstName: string
    lastName: string
  }
}

export interface EmergencyContact {
  id: string
  firstName: string
  lastName: string
  relationship: string
  phoneNumber: string
  email?: string
  address?: string
  priority: 'PRIMARY' | 'SECONDARY' | 'EMERGENCY_ONLY'
  isActive: boolean
}

export interface Medication {
  id: string
  name: string
  genericName?: string
  dosageForm: string
  strength: string
  manufacturer?: string
  ndc?: string
  isControlled: boolean
  inventory?: MedicationInventory[]
  _count?: {
    studentMedications: number
  }
}

export interface MedicationInventory {
  id: string
  batchNumber: string
  expirationDate: string
  quantity: number
  reorderLevel: number
  costPerUnit?: number
  supplier?: string
}

export interface MedicationReminder {
  id: string
  studentMedicationId: string
  studentName: string
  medicationName: string
  dosage: string
  scheduledTime: string
  status: 'PENDING' | 'COMPLETED' | 'MISSED'
}

export interface AdverseReaction {
  id: string
  type: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  description: string
  actionsTaken: string
  occurredAt: string
  student: {
    id: string
    firstName: string
    lastName: string
  }
  reportedBy: {
    firstName: string
    lastName: string
  }
}

export interface StudentMedication {
  id: string
  dosage: string
  frequency: string
  route: string
  instructions?: string
  startDate: string
  endDate?: string
  isActive: boolean
  prescribedBy: string
  medication: Medication
  logs: MedicationLog[]
}

export interface MedicationLog {
  id: string
  dosageGiven: string
  timeGiven: string
  administeredBy: string
  notes?: string
  sideEffects?: string
  nurse: {
    firstName: string
    lastName: string
  }
}

export interface Allergy {
  id: string
  allergen: string
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING'
  reaction?: string
  treatment?: string
  verified: boolean
  verifiedBy?: string
  verifiedAt?: string
  providerName?: string
}

export interface Appointment {
  id: string
  type: 'ROUTINE_CHECKUP' | 'MEDICATION_ADMINISTRATION' | 'INJURY_ASSESSMENT' | 'ILLNESS_EVALUATION' | 'FOLLOW_UP' | 'SCREENING' | 'EMERGENCY'
  scheduledAt: string
  duration: number
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
  reason: string
  notes?: string
  student: {
    id: string
    firstName: string
    lastName: string
  }
  nurse: {
    firstName: string
    lastName: string
  }
}

export interface IncidentReport {
  id: string
  type: 'INJURY' | 'ILLNESS' | 'BEHAVIORAL' | 'MEDICATION_ERROR' | 'ALLERGIC_REACTION' | 'EMERGENCY' | 'OTHER'
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  description: string
  location: string
  witnesses: string[]
  actionsTaken: string
  parentNotified: boolean
  parentNotificationMethod?: string
  parentNotifiedAt?: string
  parentNotifiedBy?: string
  followUpRequired: boolean
  followUpNotes?: string
  attachments: string[]
  evidencePhotos: string[]
  evidenceVideos: string[]
  occurredAt: string
  insuranceClaimNumber?: string
  insuranceClaimStatus?: 'NOT_FILED' | 'FILED' | 'PENDING' | 'APPROVED' | 'DENIED' | 'CLOSED'
  legalComplianceStatus: 'PENDING' | 'COMPLIANT' | 'NON_COMPLIANT' | 'UNDER_REVIEW'
  student: {
    id: string
    firstName: string
    lastName: string
  }
  reportedBy: {
    firstName: string
    lastName: string
  }
  witnessStatements?: WitnessStatement[]
  followUpActions?: FollowUpAction[]
}

export interface WitnessStatement {
  id: string
  witnessName: string
  witnessType: 'STUDENT' | 'STAFF' | 'PARENT' | 'OTHER'
  witnessContact?: string
  statement: string
  verified: boolean
  verifiedBy?: string
  verifiedAt?: string
}

export interface FollowUpAction {
  id: string
  action: string
  dueDate: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  assignedTo?: string
  completedAt?: string
  completedBy?: string
  notes?: string
}

// Inventory Management Types
export interface InventoryItem {
  id: string
  name: string
  category: string
  description?: string
  sku?: string
  supplier?: string
  unitCost?: number
  reorderLevel: number
  reorderQuantity: number
  location?: string
  notes?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  currentStock?: number
  earliestExpiration?: string
}

export interface InventoryTransaction {
  id: string
  type: 'PURCHASE' | 'USAGE' | 'ADJUSTMENT' | 'TRANSFER' | 'DISPOSAL'
  quantity: number
  unitCost?: number
  reason?: string
  batchNumber?: string
  expirationDate?: string
  notes?: string
  createdAt: string
  inventoryItem: InventoryItem
  performedBy: {
    firstName: string
    lastName: string
  }
}

export interface MaintenanceLog {
  id: string
  type: 'ROUTINE' | 'REPAIR' | 'CALIBRATION' | 'INSPECTION' | 'CLEANING'
  description: string
  cost?: number
  nextMaintenanceDate?: string
  vendor?: string
  notes?: string
  createdAt: string
  inventoryItem: InventoryItem
  performedBy: {
    firstName: string
    lastName: string
  }
}

export interface InventoryAlert {
  id: string
  type: 'LOW_STOCK' | 'EXPIRED' | 'NEAR_EXPIRY' | 'MAINTENANCE_DUE' | 'OUT_OF_STOCK'
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  message: string
  itemId: string
  itemName: string
  daysUntilAction?: number
}

export interface Vendor {
  id: string
  name: string
  contactName?: string
  email?: string
  phone?: string
  address?: string
  website?: string
  taxId?: string
  paymentTerms?: string
  notes?: string
  isActive: boolean
  rating?: number
  createdAt: string
  updatedAt: string
}

export interface PurchaseOrder {
  id: string
  orderNumber: string
  status: 'PENDING' | 'APPROVED' | 'ORDERED' | 'PARTIALLY_RECEIVED' | 'RECEIVED' | 'CANCELLED'
  orderDate: string
  expectedDate?: string
  receivedDate?: string
  subtotal: number
  tax: number
  shipping: number
  total: number
  notes?: string
  approvedBy?: string
  approvedAt?: string
  createdAt: string
  updatedAt: string
  vendor: Vendor
  items: PurchaseOrderItem[]
}

export interface PurchaseOrderItem {
  id: string
  quantity: number
  unitCost: number
  totalCost: number
  receivedQty: number
  notes?: string
  inventoryItemId: string
  inventoryItem?: InventoryItem
}

export interface BudgetCategory {
  id: string
  name: string
  description?: string
  fiscalYear: number
  allocatedAmount: number
  spentAmount: number
  remainingAmount?: number
  utilizationPercentage?: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  transactions?: BudgetTransaction[]
}

export interface BudgetTransaction {
  id: string
  amount: number
  description: string
  transactionDate: string
  referenceId?: string
  referenceType?: string
  notes?: string
  createdAt: string
  category: BudgetCategory
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    message: string
  }
  errors?: Array<{
    field: string
    message: string
  }>
}