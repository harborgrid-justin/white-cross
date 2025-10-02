export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'ADMIN' | 'NURSE' | 'SCHOOL_ADMIN' | 'DISTRICT_ADMIN'
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
  followUpRequired: boolean
  followUpNotes?: string
  attachments: string[]
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