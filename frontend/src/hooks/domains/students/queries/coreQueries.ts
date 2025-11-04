/**
 * Core Student Query Hooks
 *
 * Primary TanStack Query hooks for student data fetching with comprehensive error handling,
 * optimistic loading states, and healthcare compliance considerations.
 *
 * This file re-exports all query hooks from their respective modules.
 *
 * @module hooks/students/coreQueries
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

// Re-export types
export type {
  ApiError,
  PaginatedResponse,
  StudentProfile,
  UseStudentsReturn,
  UseStudentDetailReturn,
  UseStudentProfileReturn,
  UseInfiniteStudentsReturn,
} from './types';

// Re-export list query hooks
export { useStudents, useInfiniteStudents } from './listQueries';

// Re-export detail query hooks
export { useStudentDetail, useStudentProfile } from './detailQueries';

// Re-export specialized query hooks
export {
  useAssignedStudents,
  useRecentStudents,
  useStudentsByGrade,
} from './specializedQueries';

// Import for default export
import { useStudents, useInfiniteStudents } from './listQueries';
import { useStudentDetail, useStudentProfile } from './detailQueries';
import {
  useAssignedStudents,
  useRecentStudents,
  useStudentsByGrade,
} from './specializedQueries';

/**
 * Export all core query hooks
 */
export default {
  useStudents,
  useStudentDetail,
  useStudentProfile,
  useInfiniteStudents,
  useAssignedStudents,
  useRecentStudents,
  useStudentsByGrade,
};
