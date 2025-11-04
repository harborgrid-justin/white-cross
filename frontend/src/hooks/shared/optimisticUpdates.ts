/**
 * Optimistic Update Utilities
 *
 * Reusable patterns for optimistic updates with automatic rollback on error.
 * Follows React Query best practices for optimistic UI.
 *
 * @deprecated Use individual imports from './optimisticUpdates/*' modules
 * This file now re-exports from the modularized structure for backward compatibility
 *
 * @module hooks/utils/optimisticUpdates
 */

// Re-export everything from the new modular structure
export type { OptimisticContext } from './optimisticUpdates/types';

export {
  createOptimisticUpdate,
  createOptimisticListAdd,
  createOptimisticListUpdate,
  createOptimisticListRemove,
  createOptimisticPaginatedUpdate,
  createMultiQueryOptimisticUpdate,
} from './optimisticUpdates/core';

export {
  createMedicationAdministrationOptimistic,
  createStudentCreationOptimistic,
  createHealthRecordOptimistic,
  createAppointmentSchedulingOptimistic,
} from './optimisticUpdates/strategies';

export {
  handleOptimisticError,
  handleOptimisticSettled,
} from './optimisticUpdates/handlers';
