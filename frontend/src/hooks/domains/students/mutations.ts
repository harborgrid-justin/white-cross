/**
 * Mutations Re-export
 * Re-exports from mutations directory for backwards compatibility
 */

// Export the newer enterprise hooks (from useStudentMutations.ts)
export { useStudentMutations } from './mutations/useStudentMutations';

// Export the broken-down mutation hooks from the original mutations.ts
export {
  useCreateStudent,
  useUpdateStudent,
  useDeactivateStudent,
  useReactivateStudent,
  useTransferStudent,
  useBulkUpdateStudents,
  usePermanentDeleteStudent,
  useStudentMutationsComposite,
  invalidateStudentCache,
} from './mutations';

// Export types
export type {
  ApiError,
  StudentMutationResult,
  BulkMutationResult,
  PermanentDeleteResult,
} from './mutations';
