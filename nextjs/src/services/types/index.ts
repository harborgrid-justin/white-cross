/**
 * WF-IDX-301 | index.ts - Service types re-export module
 * Purpose: Re-exports types from main types directory to avoid duplication
 * Upstream: @/types | Dependencies: Main type definitions
 * Downstream: Service modules | Called by: API service files
 * Related: @/types, service modules
 * Exports: Re-exported types | Key Features: Type unification
 * Last Updated: 2025-10-20 | File Type: .ts
 * Critical Path: Import types → Use in services → Return to components
 * LLM Context: Central re-export point for service layer types
 */

// Re-export all types from the main types directory to ensure consistency
// This prevents type incompatibilities between services and components

export * from '../../types'

// Re-export specific types that might be needed by services
export type {
  ApiResponse,
  LegacyMedicationWithCount
} from '../../types'
