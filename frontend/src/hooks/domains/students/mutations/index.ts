/**
 * Student Mutations Index
 *
 * Central export point for all student mutation hooks with backward compatibility
 *
 * @module hooks/students/mutations
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

// Export all individual hooks from the broken-down mutations.ts file
export { useCreateStudent, useUpdateStudent } from './useStudentCRUDMutations';
export { useDeactivateStudent, useReactivateStudent } from './useStudentStatusMutations';
export { useTransferStudent } from './useStudentTransferMutations';
export { useBulkUpdateStudents } from './useStudentBulkMutations';
export { usePermanentDeleteStudent } from './useStudentDeleteMutations';
export { useStudentMutationsComposite } from './useStudentMutationsComposite';

// Re-export the existing useStudentMutations hook for backward compatibility
export { useStudentMutations } from './useStudentMutations';

// Export types
export type {
  ApiError,
  StudentMutationResult,
  BulkMutationResult,
  PermanentDeleteResult,
} from './types';

// Export utilities
export { invalidateStudentCache } from './utils';

// Default export for backward compatibility with original mutations.ts file
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
