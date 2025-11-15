/**
 * @fileoverview Students API - DEPRECATED Legacy Service Layer
 *
 * ⚠️ DEPRECATION WARNING ⚠️
 * This service module is deprecated and will be removed in v2.0.0 (scheduled: 2026-06-30).
 * Please migrate to the new server actions pattern: @/lib/actions/students.*
 *
 * Migration documentation: /src/services/modules/DEPRECATED.md
 * New implementation: /src/lib/actions/students.actions.ts
 *
 * CRITICAL CHANGES REQUIRED:
 * 1. Replace client-side API calls with server actions
 * 2. Update imports from services to actions
 * 3. Adapt to new Next.js 14+ App Router patterns
 * 4. Review cache invalidation strategies
 *
 * @module services/modules/studentsApi
 * @deprecated since v1.5.0 - Use @/lib/actions/students.* instead
 */

// Re-export everything from the new modular structure
export {
  StudentsApi,
  studentsApi,
  createStudentsApi,
} from './studentsApi/index';

// Re-export types for compatibility
export type {
  Student,
  CreateStudentData,
  UpdateStudentData,
  StudentFilters,
  PaginatedStudentsResponse,
  StudentStatistics,
  TransferStudentRequest,
  BulkUpdateStudentsRequest,
  ExportStudentDataResponse,
  Gender,
  BackendApiResponse,
  StudentApiResult,
  StudentSearchParams,
  BulkOperationResponse,
  StudentValidationError,
  StudentAssignmentRequest,
  StudentEnrollmentData,
  StudentHealthSummary,
  StudentAcademicSummary,
  StudentExportOptions,
  StudentQueryBuilder,
} from './studentsApi/types';

// Re-export validation schemas and constants
export {
  VALID_GRADES,
  PHONE_REGEX,
  EMAIL_REGEX,
  MEDICAL_RECORD_REGEX,
  STUDENT_NUMBER_REGEX,
  createStudentSchema,
  updateStudentSchema,
  studentFiltersSchema,
} from './studentsApi/validation';

/**
 * Legacy default export for maximum compatibility
 * @deprecated Use named export `studentsApi` instead
 */
export { studentsApi as default } from './studentsApi/index';

// ==========================================
// MIGRATION GUIDE - Students API
// ==========================================
// Complete migration path from legacy service to new server actions
// Removal date: v2.0.0 (June 30, 2026)
//
// NEW ARCHITECTURE:
// - Server actions with 'use server' directive
// - Next.js cache integration (revalidateTag/revalidatePath)
// - HIPAA-compliant audit logging
// - Improved type safety and error handling
// - Better performance with built-in caching
//
// ==========================================
// CRUD OPERATIONS MIGRATION
// ==========================================
//
// CREATE STUDENT
// --------------
// Before:
//   import { studentsApi } from '@/services/modules/studentsApi';
//   const result = await studentsApi.create({
//     firstName: 'John',
//     lastName: 'Doe',
//     dateOfBirth: '2010-05-15',
//     grade: '5',
//     gender: 'MALE'
//   });
//
// After:
//   import { createStudent } from '@/lib/actions/students.crud';
//   const result = await createStudent({
//     firstName: 'John',
//     lastName: 'Doe',
//     dateOfBirth: '2010-05-15',
//     grade: '5',
//     gender: 'MALE'
//   });
//   // Returns: ActionResult<Student> with success/error handling
//
// UPDATE STUDENT
// --------------
// Before:
//   const updated = await studentsApi.update('student-id', { grade: '6' });
//
// After:
//   import { updateStudent } from '@/lib/actions/students.crud';
//   const updated = await updateStudent('student-id', { grade: '6' });
//
// DELETE STUDENT (Soft Delete)
// -----------------------------
// Before:
//   const result = await studentsApi.deactivate('student-id');
//
// After:
//   import { deleteStudent } from '@/lib/actions/students.crud';
//   const result = await deleteStudent('student-id');
//   // OR use deactivateStudent for explicit soft delete
//   import { deactivateStudent } from '@/lib/actions/students.status';
//   const result = await deactivateStudent('student-id');
//
// ==========================================
// READ OPERATIONS MIGRATION
// ==========================================
//
// GET ALL STUDENTS (with filtering and pagination)
// -------------------------------------------------
// Before:
//   const response = await studentsApi.getAll({
//     grade: '5',
//     isActive: true,
//     page: 1,
//     limit: 20
//   });
//   const students = response.data;
//
// After:
//   import { getStudents } from '@/lib/actions/students.cache';
//   const result = await getStudents({
//     grade: '5',
//     isActive: true
//   });
//   const students = result.data; // Cached with Next.js
//
//   // OR for paginated results:
//   import { getPaginatedStudents } from '@/lib/actions/students.cache';
//   const result = await getPaginatedStudents({ page: 1, limit: 20 });
//
// GET STUDENT BY ID
// -----------------
// Before:
//   const student = await studentsApi.getById('student-id');
//
// After:
//   import { getStudent } from '@/lib/actions/students.cache';
//   const result = await getStudent('student-id');
//   if (result.success) {
//     const student = result.data;
//   }
//
// SEARCH STUDENTS
// ---------------
// Before:
//   const results = await studentsApi.search('john doe', 10);
//   // OR
//   const results = await studentsApi.advancedSearch({
//     search: 'john',
//     grade: '5',
//     hasAllergies: true
//   });
//
// After:
//   import { searchStudents } from '@/lib/actions/students.cache';
//   const result = await searchStudents({
//     query: 'john doe',
//     limit: 10
//   });
//   // Advanced search uses same function with more filters
//   const advancedResult = await searchStudents({
//     query: 'john',
//     filters: { grade: '5', hasAllergies: true }
//   });
//
// ==========================================
// BULK OPERATIONS MIGRATION
// ==========================================
//
// TRANSFER STUDENT TO NURSE
// --------------------------
// Before:
//   const transferred = await studentsApi.transfer('student-id', {
//     nurseId: 'nurse-id',
//     reason: 'Workload redistribution'
//   });
//
// After:
//   import { transferStudent } from '@/lib/actions/students.bulk';
//   const result = await transferStudent('student-id', {
//     nurseId: 'nurse-id',
//     reason: 'Workload redistribution'
//   });
//
// BULK UPDATE STUDENTS
// --------------------
// Before:
//   const bulkResult = await studentsApi.bulkUpdate({
//     studentIds: ['id1', 'id2', 'id3'],
//     updates: { grade: '6', nurseId: 'new-nurse-id' }
//   });
//
// After:
//   import { bulkUpdateStudents } from '@/lib/actions/students.bulk';
//   const result = await bulkUpdateStudents({
//     studentIds: ['id1', 'id2', 'id3'],
//     updateData: { grade: '6', nurseId: 'new-nurse-id' }
//   });
//
// ==========================================
// STATUS OPERATIONS MIGRATION
// ==========================================
//
// REACTIVATE STUDENT
// ------------------
// Before:
//   const student = await studentsApi.reactivate('student-id');
//
// After:
//   import { reactivateStudent } from '@/lib/actions/students.status';
//   const result = await reactivateStudent('student-id');
//
// ==========================================
// SPECIALIZED OPERATIONS MIGRATION
// ==========================================
//
// GET ASSIGNED STUDENTS (for nurses)
// -----------------------------------
// Before:
//   const myStudents = await studentsApi.getAssignedStudents();
//
// After:
//   import { getStudents } from '@/lib/actions/students.cache';
//   // Backend automatically filters by current nurse
//   const result = await getStudents({ assignedToMe: true });
//
// GET STATISTICS
// --------------
// Before:
//   const stats = await studentsApi.getStatistics('student-id');
//
// After:
//   import { getStudentStatistics } from '@/lib/actions/students.cache';
//   const result = await getStudentStatistics('student-id');
//
// EXPORT STUDENT DATA
// -------------------
// Before:
//   const exportData = await studentsApi.exportStudentData('student-id', {
//     format: 'pdf',
//     includePHI: true
//   });
//
// After:
//   import { exportStudentData } from '@/lib/actions/students.cache';
//   const result = await exportStudentData('student-id', {
//     format: 'pdf',
//     includePHI: true
//   });
//
// ==========================================
// FORM INTEGRATION MIGRATION
// ==========================================
//
// CLIENT COMPONENT WITH FORMS
// ----------------------------
// Before:
//   'use client';
//   import { studentsApi } from '@/services/modules/studentsApi';
//
//   async function handleSubmit(formData: FormData) {
//     const data = Object.fromEntries(formData);
//     await studentsApi.create(data);
//   }
//
// After (Option 1 - Direct form action):
//   'use client';
//   import { useActionState } from 'react';
//   import { createStudentFromForm } from '@/lib/actions/students.forms';
//
//   export function StudentForm() {
//     const [state, formAction, isPending] = useActionState(
//       createStudentFromForm,
//       { success: false }
//     );
//
//     return (
//       <form action={formAction}>
//         {/* form fields */}
//         <button type="submit" disabled={isPending}>
//           {isPending ? 'Creating...' : 'Create Student'}
//         </button>
//         {state.error && <div className="error">{state.error}</div>}
//       </form>
//     );
//   }
//
// After (Option 2 - Manual submission):
//   'use client';
//   import { useState } from 'react';
//   import { createStudent } from '@/lib/actions/students.crud';
//
//   export function StudentForm() {
//     const [pending, setPending] = useState(false);
//
//     async function handleSubmit(e: FormEvent) {
//       e.preventDefault();
//       setPending(true);
//       const formData = new FormData(e.currentTarget);
//       const result = await createStudent({
//         firstName: formData.get('firstName') as string,
//         // ... other fields
//       });
//       setPending(false);
//       if (result.success) {
//         // Handle success
//       }
//     }
//
//     return <form onSubmit={handleSubmit}>{/* fields */}</form>;
//   }
//
// ==========================================
// TYPE IMPORTS MIGRATION
// ==========================================
//
// Before:
//   import type { Student, CreateStudentData } from '@/services/modules/studentsApi';
//
// After:
//   import type { Student, CreateStudentData } from '@/types/domain/student.types';
//   // OR if using ActionResult wrapper:
//   import type { ActionResult } from '@/lib/actions/students.types';
//
// ==========================================
// UTILITY FUNCTIONS MIGRATION
// ==========================================
//
// Before:
//   import { studentExists, clearStudentCache } from '@/services/modules/studentsApi';
//
// After:
//   import { studentExists, clearStudentCache } from '@/lib/actions/students.utils';
//
// ==========================================
// CACHE INVALIDATION
// ==========================================
//
// The new server actions automatically handle cache invalidation using:
// - revalidateTag(CACHE_TAGS.STUDENTS)
// - revalidatePath('/dashboard/students')
// No manual cache management required!
//
// ==========================================
// ERROR HANDLING CHANGES
// ==========================================
//
// Before (throws exceptions):
//   try {
//     const student = await studentsApi.getById('id');
//   } catch (error) {
//     console.error(error);
//   }
//
// After (returns result object):
//   const result = await getStudent('id');
//   if (!result.success) {
//     console.error(result.error);
//   } else {
//     const student = result.data;
//   }
//
// ==========================================
// MIGRATION CHECKLIST
// ==========================================
// [ ] Update all student API imports to new actions
// [ ] Replace studentsApi.method() with new action functions
// [ ] Update error handling from try/catch to result checking
// [ ] Replace manual cache invalidation with automatic revalidation
// [ ] Update form integrations to use useActionState
// [ ] Update type imports to use @/types/domain
// [ ] Test HIPAA audit logging still works correctly
// [ ] Update unit tests to mock server actions
// [ ] Verify cache behavior in production
// [ ] Remove old service imports after migration complete
//
// ==========================================
// BREAKING CHANGES SUMMARY
// ==========================================
// 1. API methods now return ActionResult<T> instead of throwing
// 2. Some method names changed (e.g., getAll → getStudents)
// 3. Bulk update structure changed (updates → updateData)
// 4. Cache management now automatic (no manual cache clearing)
// 5. Forms should use useActionState for better UX
// 6. Server-side only - no client-side API calls
//
// ==========================================
// SUPPORT & QUESTIONS
// ==========================================
// For migration assistance, see:
// - /src/services/modules/DEPRECATED.md (comprehensive guide)
// - /src/lib/actions/students.actions.ts (new implementation)
// - Team migration channel: #api-migration-support
//
// Deprecation Timeline:
// - v1.5.0 (Nov 2025): Deprecation warnings added
// - v1.8.0 (Mar 2026): Warning level increased
// - v2.0.0 (Jun 2026): Complete removal
