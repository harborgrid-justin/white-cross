/**
 * WF-COMP-335 | student.types.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, interfaces, types | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Student Management Type Definitions
 * Centralized type definitions for student-related data structures
 * Aligned with backend Student model and service interfaces
 */

/**
 * Gender enum matching backend Gender type
 */
export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'

/**
 * Allergy severity levels
 */
export type AllergySeverity = 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING'

/**
 * Emergency contact priority levels matching backend ContactPriority enum
 */
export enum ContactPriority {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
  EMERGENCY_ONLY = 'EMERGENCY_ONLY'
}

/**
 * Preferred contact method for notifications
 */
export enum PreferredContactMethod {
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  VOICE = 'VOICE',
  ANY = 'ANY'
}

/**
 * Contact verification status
 */
export enum VerificationStatus {
  UNVERIFIED = 'UNVERIFIED',
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  FAILED = 'FAILED'
}

/**
 * Emergency contact relationship types
 */
export type ContactRelationship =
  | 'PARENT'
  | 'GUARDIAN'
  | 'SIBLING'
  | 'GRANDPARENT'
  | 'AUNT_UNCLE'
  | 'FAMILY_FRIEND'
  | 'NEIGHBOR'
  | 'OTHER'

/**
 * Emergency contact interface matching backend EmergencyContact model
 * @aligned_with backend/src/database/models/core/EmergencyContact.ts
 *
 * PHI: firstName, lastName, phoneNumber, email, address
 */
export interface EmergencyContact {
  id: string
  studentId: string
  firstName: string
  lastName: string
  relationship: string
  phoneNumber: string
  email?: string
  address?: string
  priority: ContactPriority
  isActive: boolean
  preferredContactMethod?: PreferredContactMethod
  verificationStatus?: VerificationStatus
  lastVerifiedAt?: string
  notificationChannels?: ('sms' | 'email' | 'voice')[]
  canPickupStudent?: boolean
  notes?: string
  createdAt: string
  updatedAt: string
  // Optional associations
  student?: {
    id: string
    firstName: string
    lastName: string
    studentNumber: string
  }
}

/**
 * Helper to check if contact is primary
 */
export const isPrimaryContact = (contact: EmergencyContact): boolean => {
  return contact.priority === ContactPriority.PRIMARY
}

/**
 * Helper to get primary contact from a list
 */
export const getPrimaryContact = (contacts: EmergencyContact[]): EmergencyContact | undefined => {
  return contacts.find(c => c.priority === ContactPriority.PRIMARY && c.isActive)
}

/**
 * Emergency contact creation data
 */
export interface CreateEmergencyContactData {
  studentId: string
  firstName: string
  lastName: string
  relationship: string
  phoneNumber: string
  email?: string
  address?: string
  priority: ContactPriority
  preferredContactMethod?: PreferredContactMethod
  notificationChannels?: ('sms' | 'email' | 'voice')[]
  canPickupStudent?: boolean
  notes?: string
}

/**
 * Emergency contact update data
 */
export interface UpdateEmergencyContactData {
  firstName?: string
  lastName?: string
  relationship?: string
  phoneNumber?: string
  email?: string
  address?: string
  priority?: ContactPriority
  isActive?: boolean
  preferredContactMethod?: PreferredContactMethod
  verificationStatus?: VerificationStatus
  notificationChannels?: ('sms' | 'email' | 'voice')[]
  canPickupStudent?: boolean
  notes?: string
}

/**
 * Notification data for emergency alerts
 */
export interface EmergencyNotificationData {
  message: string
  type: 'emergency' | 'health' | 'medication' | 'general'
  priority: 'low' | 'medium' | 'high' | 'critical'
  studentId: string
  channels: ('sms' | 'email' | 'voice')[]
  attachments?: string[]
}

/**
 * Notification result for individual contact
 */
export interface EmergencyNotificationResult {
  contactId: string
  contact: {
    firstName: string
    lastName: string
    phoneNumber: string
    email?: string
  }
  channels: {
    sms?: { success: boolean; messageId?: string; error?: string }
    email?: { success: boolean; messageId?: string; error?: string }
    voice?: { success: boolean; callId?: string; error?: string }
  }
  timestamp: string
}

/**
 * Contact verification request
 */
export interface ContactVerificationRequest {
  contactId: string
  method: 'sms' | 'email' | 'voice'
}

/**
 * Contact verification response
 */
export interface ContactVerificationResponse {
  verificationCode?: string
  method: 'sms' | 'email' | 'voice'
  messageId?: string
  callId?: string
  success: boolean
}

/**
 * Emergency contact statistics
 */
export interface EmergencyContactStatistics {
  totalContacts: number
  studentsWithoutContacts: number
  byPriority: Record<string, number>
}

/**
 * Allergy interface matching backend Allergy model
 */
export interface Allergy {
  id: string
  studentId: string
  allergen: string
  allergyType: string
  severity: AllergySeverity
  reaction?: string
  treatment?: string
  diagnosedDate?: string
  notes?: string
  active: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Chronic condition interface
 */
export interface ChronicCondition {
  id: string
  studentId: string
  conditionName: string
  diagnosisDate?: string
  managementPlan?: string
  medications?: string
  notes?: string
  active: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Medication details from Medication table
 */
export interface MedicationDetails {
  id: string
  name: string
  genericName?: string
  dosageForm: string
  strength?: string
}

/**
 * Student medication interface matching backend StudentMedication model
 */
export interface StudentMedication {
  id: string
  studentId: string
  medicationId: string
  dosage: string
  frequency: string
  route: string
  startDate: string
  endDate?: string
  prescribedBy?: string
  instructions?: string
  sideEffects?: string
  isActive: boolean
  requiresParentConsent: boolean
  parentConsentDate?: string
  medication?: MedicationDetails
  logs?: MedicationLog[]
  createdAt: string
  updatedAt: string
}

/**
 * Medication log entry
 */
export interface MedicationLog {
  id: string
  studentMedicationId: string
  administeredAt: string
  administeredBy: string
  dosageGiven: string
  notes?: string
  nurse?: {
    id: string
    firstName: string
    lastName: string
  }
}

/**
 * Health record interface
 */
export interface HealthRecord {
  id: string
  studentId: string
  recordType: string
  recordDate: string
  provider?: string
  notes?: string
  attachments?: string[]
  createdAt: string
  updatedAt: string
}

/**
 * Appointment interface
 */
export interface Appointment {
  id: string
  studentId: string
  nurseId: string
  scheduledAt: string
  duration: number
  type: string
  reason?: string
  status: string
  notes?: string
  nurse?: {
    id: string
    firstName: string
    lastName: string
  }
  createdAt: string
  updatedAt: string
}

/**
 * Incident report interface
 */
export interface IncidentReport {
  id: string
  studentId: string
  reportedById: string
  occurredAt: string
  incidentType: string
  severity: string
  location?: string
  description: string
  actionTaken?: string
  followUpRequired: boolean
  reportedBy?: {
    id: string
    firstName: string
    lastName: string
  }
  createdAt: string
  updatedAt: string
}

/**
 * Nurse/User reference
 */
export interface NurseReference {
  id: string
  firstName: string
  lastName: string
  email: string
}

/**
 * Complete student interface matching backend Student model with associations
 * @aligned_with backend/src/database/models/core/Student.ts
 *
 * PHI: firstName, lastName, dateOfBirth, photo, medicalRecordNum
 */
export interface Student {
  id: string
  studentNumber: string
  firstName: string
  lastName: string
  dateOfBirth: string
  grade: string
  gender: Gender
  photo?: string
  medicalRecordNum?: string
  isActive: boolean
  enrollmentDate: string
  nurseId?: string
  createdBy?: string
  updatedBy?: string
  createdAt: string
  updatedAt: string
  // Associations (populated based on query)
  emergencyContacts?: EmergencyContact[]
  allergies?: Allergy[]
  chronicConditions?: ChronicCondition[]
  medications?: StudentMedication[]
  healthRecords?: HealthRecord[]
  appointments?: Appointment[]
  incidentReports?: IncidentReport[]
  nurse?: NurseReference
}

/**
 * Create student data interface matching backend CreateStudentData
 */
export interface CreateStudentData {
  studentNumber: string
  firstName: string
  lastName: string
  dateOfBirth: string
  grade: string
  gender: Gender
  photo?: string
  medicalRecordNum?: string
  nurseId?: string
  enrollmentDate?: string
  createdBy?: string
}

/**
 * Update student data interface matching backend UpdateStudentData
 */
export interface UpdateStudentData {
  studentNumber?: string
  firstName?: string
  lastName?: string
  dateOfBirth?: string
  grade?: string
  gender?: Gender
  photo?: string
  medicalRecordNum?: string
  nurseId?: string
  isActive?: boolean
  enrollmentDate?: string
  updatedBy?: string
}

/**
 * Student filters interface matching backend StudentFilters
 */
export interface StudentFilters {
  search?: string
  grade?: string
  isActive?: boolean
  nurseId?: string
  hasAllergies?: boolean
  hasMedications?: boolean
  gender?: Gender
  page?: number
  limit?: number
}

/**
 * Pagination metadata matching backend pagination response
 */
export interface PaginationMetadata {
  page: number
  limit: number
  total: number
  pages: number
}

/**
 * Paginated student response
 */
export interface PaginatedStudentsResponse {
  students: Student[]
  pagination: PaginationMetadata
}

/**
 * Student statistics response
 */
export interface StudentStatistics {
  healthRecords: number
  allergies: number
  medications: number
  appointments: number
  incidents: number
}

/**
 * Transfer student request
 */
export interface TransferStudentRequest {
  nurseId: string
}

/**
 * Bulk update request
 */
export interface BulkUpdateStudentsRequest {
  studentIds: string[]
  updateData: Partial<UpdateStudentData>
}

/**
 * Export student data response
 */
export interface ExportStudentDataResponse {
  exportDate: string
  student: Student
  statistics: StudentStatistics
}

/**
 * Student form data for UI forms (legacy support)
 */
export interface StudentFormData {
  studentNumber: string
  firstName: string
  lastName: string
  dateOfBirth: string
  grade: string
  gender: Gender
  emergencyContactPhone: string
  medicalRecordNum: string
  enrollmentDate: string
  email: string
}

/**
 * Emergency contact form data for UI forms
 */
export interface EmergencyContactFormData {
  firstName: string
  lastName: string
  relationship: string
  phoneNumber: string
  email?: string
  address?: string
  priority: ContactPriority
  preferredContactMethod?: PreferredContactMethod
  notificationChannels?: ('sms' | 'email' | 'voice')[]
  canPickupStudent?: boolean
  notes?: string
}

/**
 * Validation errors for form handling
 */
export interface ValidationErrors {
  [key: string]: string
}

/**
 * Notification message for UI feedback
 */
export interface NotificationMessage {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
}
