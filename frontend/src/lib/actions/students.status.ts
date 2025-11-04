/**
 * @fileoverview Student Status Operations - Activation and Deactivation
 * @module lib/actions/students.status
 *
 * HIPAA-compliant student activation and deactivation operations.
 *
 * Features:
 * - Student reactivation (restore inactive students)
 * - Student deactivation (soft delete alternative)
 * - HIPAA audit logging for all status changes
 * - Cache invalidation
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { serverPost, NextApiClientError } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import { CACHE_TAGS } from '@/lib/cache/constants';

// Types
import type { Student } from '@/types/domain/student.types';
import type { ApiResponse } from '@/types';
import type { ActionResult } from './students.types';

// ==========================================
// STATUS OPERATIONS
// ==========================================

/**
 * Activate/Reactivate student
 */
export async function reactivateStudent(studentId: string): Promise<ActionResult<Student>> {
  try {
    const response = await serverPost<ApiResponse<Student>>(
      API_ENDPOINTS.STUDENTS.REACTIVATE(studentId),
      {},
      {
        cache: 'no-store',
        next: { tags: [CACHE_TAGS.STUDENTS, `student-${studentId}`, CACHE_TAGS.PHI] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to reactivate student');
    }

    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_STUDENT,
      resource: 'Student',
      resourceId: studentId,
      details: 'Reactivated student record',
      changes: { isActive: true },
      success: true
    });

    revalidateTag(CACHE_TAGS.STUDENTS, 'default');
    revalidateTag(`student-${studentId}`, 'default');
    revalidatePath('/dashboard/students');
    revalidatePath(`/dashboard/students/${studentId}` as any);

    return {
      success: true,
      data: response.data,
      message: 'Student reactivated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to reactivate student';

    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_STUDENT,
      resource: 'Student',
      resourceId: studentId,
      details: `Failed to reactivate student: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Deactivate student (soft delete alternative)
 */
export async function deactivateStudent(studentId: string): Promise<ActionResult<Student>> {
  try {
    const response = await serverPost<ApiResponse<Student>>(
      API_ENDPOINTS.STUDENTS.DEACTIVATE(studentId),
      {},
      {
        cache: 'no-store',
        next: { tags: [CACHE_TAGS.STUDENTS, `student-${studentId}`, CACHE_TAGS.PHI] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to deactivate student');
    }

    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_STUDENT,
      resource: 'Student',
      resourceId: studentId,
      details: 'Deactivated student record',
      changes: { isActive: false },
      success: true
    });

    revalidateTag(CACHE_TAGS.STUDENTS, 'default');
    revalidateTag(`student-${studentId}`, 'default');
    revalidatePath('/dashboard/students');

    return {
      success: true,
      data: response.data,
      message: 'Student deactivated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to deactivate student';

    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_STUDENT,
      resource: 'Student',
      resourceId: studentId,
      details: `Failed to deactivate student: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}
