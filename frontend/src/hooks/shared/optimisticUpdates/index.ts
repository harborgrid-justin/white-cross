/**
 * Optimistic Update Utilities - Module Index
 *
 * Re-exports all optimistic update utilities from their respective modules
 *
 * @module hooks/shared/optimisticUpdates
 */

// Types
export type { OptimisticContext } from './types';

// Core functions
export {
  createOptimisticUpdate,
  createOptimisticListAdd,
  createOptimisticListUpdate,
  createOptimisticListRemove,
  createOptimisticPaginatedUpdate,
  createMultiQueryOptimisticUpdate,
} from './core';

// Domain-specific strategies
export {
  createMedicationAdministrationOptimistic,
  createStudentCreationOptimistic,
  createHealthRecordOptimistic,
  createAppointmentSchedulingOptimistic,
} from './strategies';

// Handlers
export {
  handleOptimisticError,
  handleOptimisticSettled,
} from './handlers';
