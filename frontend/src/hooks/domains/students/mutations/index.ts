/**
 * Student Mutations Index
 *
 * Central export point for all student mutation hooks with backward compatibility
 *
 * @module hooks/students/mutations
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

// =====================
// TYPE EXPORTS
// =====================
export type {
  ApiError,
  StudentMutationResult,
  BulkMutationResult,
  PermanentDeleteResult,
} from './types';

// =====================
// INDIVIDUAL MUTATION HOOKS
// =====================

// CRUD Mutations
export { useCreateStudent, useUpdateStudent } from './useStudentCRUDMutations';

// Status Mutations
export { useDeactivateStudent, useReactivateStudent } from './useStudentStatusMutations';

// Transfer Mutations
export { useTransferStudent } from './useStudentTransferMutations';

// Bulk Mutations
export { useBulkUpdateStudents } from './useStudentBulkMutations';

// Delete Mutations
export { usePermanentDeleteStudent } from './useStudentDeleteMutations';

// Composite Mutations
export { useStudentMutationsComposite } from './useStudentMutationsComposite';

// =====================
// LEGACY MUTATION HOOKS
// =====================

// Re-export the original composite hooks for backward compatibility
export { useStudentMutations } from './useStudentMutations';
export { useOptimisticStudents } from './useOptimisticStudents';
export { useStudentManagement } from './useStudentManagement';

// Re-export individual mutation hooks from separate files
export { useCreateStudentMutation } from './useCreateStudentMutation';
export { useUpdateStudentMutation } from './useUpdateStudentMutation';
export { useDeleteStudentMutation } from './useDeleteStudentMutation';
export { useStudentMutationUtils } from './useStudentMutationUtils';

// =====================
// UTILITY EXPORTS
// =====================
export { invalidateStudentCache } from './utils';

// =====================
// DEFAULT EXPORT
// =====================

/**
 * Default export for backward compatibility with original mutations.ts file
 */
import {
  useCreateStudent as createStudentHook,
  useUpdateStudent as updateStudentHook,
} from './useStudentCRUDMutations';
import {
  useDeactivateStudent as deactivateStudentHook,
  useReactivateStudent as reactivateStudentHook,
} from './useStudentStatusMutations';
import { useTransferStudent as transferStudentHook } from './useStudentTransferMutations';
import { useBulkUpdateStudents as bulkUpdateStudentsHook } from './useStudentBulkMutations';
import { usePermanentDeleteStudent as permanentDeleteStudentHook } from './useStudentDeleteMutations';
import { useStudentMutationsComposite as studentMutationsCompositeHook } from './useStudentMutationsComposite';

export default {
  useCreateStudent: createStudentHook,
  useUpdateStudent: updateStudentHook,
  useDeactivateStudent: deactivateStudentHook,
  useReactivateStudent: reactivateStudentHook,
  useTransferStudent: transferStudentHook,
  useBulkUpdateStudents: bulkUpdateStudentsHook,
  usePermanentDeleteStudent: permanentDeleteStudentHook,
  useStudentMutationsComposite: studentMutationsCompositeHook,
};
