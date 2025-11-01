/**
 * Optimistic Students Hook Exports
 *
 * Re-exports comprehensive optimistic student hooks from domain mutations
 */

// Re-export all hooks from domain students mutations
export {
  useOptimisticStudentCreate,
  useOptimisticStudentUpdate,
  useOptimisticStudentDeactivate,
  useOptimisticStudentReactivate,
  useOptimisticStudentTransfer,
  useOptimisticStudentPermanentDelete,
  useOptimisticEmergencyContactCreate,
  useOptimisticEmergencyContactUpdate,
  useOptimisticEmergencyContactDelete,
  useOptimisticStudents,
  studentKeys,
} from './domains/students/mutations/useOptimisticStudents';

// Re-export default for backward compatibility
export { useOptimisticStudents as default } from './domains/students/mutations/useOptimisticStudents';
