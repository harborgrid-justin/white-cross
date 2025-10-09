/**
 * Student Management Type Definitions
 * Centralized type definitions for student-related data structures
 */

export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'

export type AllergySeverity = 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING'

export interface EmergencyContact {
  id: string
  firstName: string
  lastName: string
  relationship: string
  phoneNumber: string
  isPrimary: boolean
}

export interface Allergy {
  id: string
  allergen: string
  severity: AllergySeverity
}

export interface Medication {
  id: string
  name: string
  dosage: string
}

export interface Student {
  id: string
  studentNumber: string
  firstName: string
  lastName: string
  dateOfBirth: string
  grade: string
  gender: Gender
  isActive: boolean
  emergencyContacts: EmergencyContact[]
  allergies: Allergy[]
  medications: Medication[]
}

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

export interface EmergencyContactFormData {
  firstName: string
  phoneNumber: string
}

export interface ValidationErrors {
  [key: string]: string
}

export interface NotificationMessage {
  type: 'success' | 'error'
  message: string
}
