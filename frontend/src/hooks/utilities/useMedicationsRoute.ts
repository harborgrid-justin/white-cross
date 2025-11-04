/**
 * WF-ROUTE-002 | useMedicationsRoute.ts - Route-level hook composition (Re-export)
 * Purpose: Unified medication management hook for the Medications route
 * Upstream: @/hooks, @/services, @/pages/Medications/hooks | Dependencies: React Query, custom hooks
 * Downstream: Pages/Medications | Called by: Medications page components
 * Related: useOptimisticMedications, useMedicationsData, useMedicationAdministration
 * Exports: useMedicationsRoute | Key Features: Route-level composition, medication management
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Route load → Data fetch → Medication operations → Optimistic updates
 * LLM Context: Route-level hook composition for medication management
 *
 * NOTE: This file has been refactored into separate modules under ./useMedicationsRoute/
 * This file now serves as a re-export for backward compatibility.
 */

export * from './useMedicationsRoute';
export { useMedicationsRoute } from './useMedicationsRoute';
