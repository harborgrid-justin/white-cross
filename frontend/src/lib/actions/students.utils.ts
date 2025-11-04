/**
 * @fileoverview Student Utility Functions - Helper and Support Functions
 * @module lib/actions/students.utils
 *
 * Utility functions for student operations.
 *
 * Features:
 * - Student existence checks
 * - Cache management
 * - Helper functions
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache/constants';
import { getStudent } from './students.cache';

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Check if student exists
 */
export async function studentExists(studentId: string): Promise<boolean> {
  const student = await getStudent(studentId);
  return student !== null;
}

/**
 * Clear student cache
 */
export async function clearStudentCache(studentId?: string): Promise<void> {
  if (studentId) {
    revalidateTag(`student-${studentId}`, 'default');
  }
  revalidateTag(CACHE_TAGS.STUDENTS, 'default');
  revalidateTag('student-list', 'default');
  revalidateTag('student-search', 'default');
  revalidatePath('/dashboard/students');
}
