/**
 * @fileoverview Medications Type Definitions
 * @module types/medications
 *
 * @description
 * TypeScript type definitions for medications management.
 * Provides type safety for medication data structures.
 *
 * @since 1.0.0
 */

export interface Medication {
  id: string | number
  name: string
  genericName?: string
  brandName?: string
  dosage?: string
  form?: string
  route?: string
  frequency?: string
  status: 'active' | 'inactive' | 'discontinued'
  prescribedBy?: string
  prescribedDate?: string | Date
  startDate?: string | Date
  endDate?: string | Date
  quantity?: number
  refills?: number
  instructions?: string
  warnings?: string[]
  sideEffects?: string[]
  interactions?: string[]
  studentId?: string | number
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface MedicationStats {
  totalMedications: number
  activePrescriptions: number
  administeredToday: number
  adverseReactions: number
  lowStockCount?: number
  expiringCount?: number
}

export interface MedicationsResponse {
  medications: Medication[]
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
  stats?: MedicationStats
}

export interface MedicationAdministration {
  id: string | number
  medicationId: string | number
  medication?: Medication
  studentId: string | number
  administeredBy: string
  administeredAt: string | Date
  dosageGiven: string
  notes?: string
  witnessed?: boolean
  witnessedBy?: string
  status: 'completed' | 'missed' | 'refused' | 'cancelled'
}

export interface MedicationAllergy {
  id: string | number
  medicationName: string
  reactionType: string
  severity: 'mild' | 'moderate' | 'severe' | 'life-threatening'
  symptoms?: string[]
  notes?: string
}
