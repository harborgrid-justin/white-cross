/**
 * WF-IDX-326 | index.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: interfaces | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

// Central types export file for the White Cross healthcare platform
// Re-exports all types from unified type system

// Re-export common types for backward compatibility
export * from './common'

// Re-export API types for convenient access
export * from './api'

// Re-export compliance types
export * from './compliance'

// Re-export appointment types
export * from './appointments'

// Re-export administration types
export * from './administration'

// Re-export communication types
export * from './communication'

// Re-export incident types
export * from './incidents'

// Re-export report types
export * from './reports'

// Re-export dashboard types
export * from './dashboard'

// Re-export access control types
export * from './accessControl'

// Re-export integration types
export * from './integrations'

// Re-export vendor types
export * from './vendors'

// Re-export purchase order types
export * from './purchaseOrders'

// Re-export inventory types
export * from './inventory'

// Re-export budget types
export * from './budget'

// Re-export state management types
export * from './state'

// Re-export navigation types
export * from './navigation'

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
