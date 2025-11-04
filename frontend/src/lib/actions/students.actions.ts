/**
 * @fileoverview Student Management Server Actions - Next.js v14+ Compatible
 * @module app/students/actions
 *
 * HIPAA-compliant server actions for student data management with comprehensive
 * caching, audit logging, and error handling.
 *
 * Features:
 * - Server actions with proper 'use server' directive in submodules
 * - Next.js cache integration with revalidateTag/revalidatePath
 * - HIPAA audit logging for all PHI operations
 * - Type-safe CRUD operations
 * - Form data handling for UI integration
 * - Comprehensive error handling and validation
 *
 * This module serves as the main entry point and re-exports all student-related
 * operations from specialized submodules for better code organization.
 *
 * Note: This file does NOT have 'use server' directive to allow re-exports.
 * Each submodule has its own 'use server' directive.
 */

// ==========================================
// TYPE EXPORTS
// ==========================================
export type { ActionResult } from './students.types';

// ==========================================
// CACHED READ OPERATIONS
// ==========================================
export {
  getStudent,
  getStudents,
  searchStudents,
  getPaginatedStudents,
  getStudentCount,
  getStudentStatistics,
  exportStudentData,
} from './students.cache';

// ==========================================
// CRUD OPERATIONS
// ==========================================
export {
  createStudent,
  updateStudent,
  deleteStudent,
} from './students.crud';

// ==========================================
// FORM HANDLERS
// ==========================================
export {
  createStudentFromForm,
  updateStudentFromForm,
} from './students.forms';

// ==========================================
// STATUS OPERATIONS
// ==========================================
export {
  reactivateStudent,
  deactivateStudent,
} from './students.status';

// ==========================================
// BULK OPERATIONS
// ==========================================
export {
  transferStudent,
  bulkUpdateStudents,
} from './students.bulk';

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
export {
  studentExists,
  clearStudentCache,
} from './students.utils';
