/**
 * WF-COMP-129 | useEmergencyContacts.mutations.ts - Mutation hooks
 * Purpose: React Query hooks for emergency contact mutations (CRUD, notifications, verification)
 * Upstream: ../services/modules/emergencyContactsApi | Dependencies: @tanstack/react-query, react-hot-toast
 * Downstream: Components, pages | Called by: React component tree
 * Related: useEmergencyContacts queries, types, constants
 * Exports: mutation hooks | Key Features: Data mutations with optimistic updates
 * Last Updated: 2025-11-04 | File Type: .ts
 * LLM Context: Mutation hooks extracted from useEmergencyContacts - Re-exports from modular files
 */

// ============================================================================
// Re-export CRUD Mutations
// ============================================================================
export {
  useCreateEmergencyContact,
  useUpdateEmergencyContact,
  useDeleteEmergencyContact,
} from './useEmergencyContacts.mutations.crud';

// ============================================================================
// Re-export Notification Mutations
// ============================================================================
export {
  useNotifyStudentContacts,
  useNotifyContact,
} from './useEmergencyContacts.mutations.notifications';

// ============================================================================
// Re-export Verification Mutations
// ============================================================================
export {
  useVerifyContact,
} from './useEmergencyContacts.mutations.verification';
