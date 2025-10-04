// Central types export file for the White Cross healthcare platform
// Re-exports all types from unified type system

// Re-export common types for backward compatibility
export * from './common'

// Re-export API types for convenient access
export * from './api'

// Legacy ApiResponse interface for backward compatibility
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

// Legacy types that may still be used in older components
// These should gradually be migrated to use the unified types above

export interface LegacyMedicationWithCount {
  id: string
  name: string
  genericName?: string
  dosageForm: string
  strength: string
  manufacturer?: string
  isControlled: boolean
  _count?: {
    studentMedications: number
  }
  createdAt: string
  updatedAt: string
}