/**
 * Student Composite Hook
 *
 * High-level student management hook that combines all CRUD operations
 * with intelligent caching and relationship management.
 *
 * @module hooks/domains/students/useStudents
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

// Re-export types
export type {
  StudentOperations,
  UseStudentsOptions,
} from './useStudents.types';

// Re-export main hook
export { useStudents } from './useStudents.operations';

// Re-export convenience hooks
export {
  useStudentList,
  useStudentCrud,
  useStudentSearch,
} from './useStudents.convenience';
