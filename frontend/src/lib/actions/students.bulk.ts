/**
 * @fileoverview Student Bulk Operations - Transfer and Bulk Updates
 * @module lib/actions/students.bulk
 *
 * HIPAA-compliant bulk operations and student transfers.
 *
 * Features:
 * - Student transfer between nurses
 * - Bulk update operations for multiple students
 * - HIPAA audit logging for all bulk operations
 * - Cache invalidation for affected records
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { serverPost, NextApiClientError } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import { CACHE_TAGS } from '@/lib/cache/constants';

// Types
import type {
  Student,
  TransferStudentRequest,
  BulkUpdateStudentsRequest,
} from '@/types/domain/student.types';
import type { ApiResponse } from '@/types';
import type { ActionResult } from './students.types';

// ==========================================
// BULK OPERATIONS
// ==========================================

/**
 * Transfer student to different nurse
 */
export async function transferStudent(
  studentId: string,
  transferData: TransferStudentRequest
): Promise<ActionResult<Student>> {
  try {
    if (!studentId || !transferData.nurseId) {
      return {
        success: false,
        error: 'Student ID and nurse ID are required'
      };
    }

    const response = await serverPost<ApiResponse<Student>>(
      API_ENDPOINTS.STUDENTS.TRANSFER(studentId),
      transferData,
      {
        cache: 'no-store',
        next: { tags: [CACHE_TAGS.STUDENTS, `student-${studentId}`, CACHE_TAGS.PHI] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to transfer student');
    }

    // HIPAA AUDIT LOG
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_STUDENT,
      resource: 'Student',
      resourceId: studentId,
      details: `Transferred student to nurse ${transferData.nurseId}`,
      changes: { nurseId: transferData.nurseId },
      success: true
    });

    // Cache invalidation
    revalidateTag(CACHE_TAGS.STUDENTS, 'default');
    revalidateTag(`student-${studentId}`, 'default');
    revalidatePath('/dashboard/students');
    revalidatePath(`/dashboard/students/${studentId}` as any);

    return {
      success: true,
      data: response.data,
      message: 'Student transferred successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to transfer student';

    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_STUDENT,
      resource: 'Student',
      resourceId: studentId,
      details: `Failed to transfer student: ${errorMessage}`,
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
 * Bulk update students
 */
export async function bulkUpdateStudents(
  request: BulkUpdateStudentsRequest
): Promise<ActionResult<Student[]>> {
  try {
    if (!request.studentIds || request.studentIds.length === 0) {
      return {
        success: false,
        error: 'Student IDs are required'
      };
    }

    const response = await serverPost<ApiResponse<Student[]>>(
      API_ENDPOINTS.STUDENTS.ASSIGN_BULK,
      request,
      {
        cache: 'no-store',
        next: { tags: [CACHE_TAGS.STUDENTS, CACHE_TAGS.PHI] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to bulk update students');
    }

    // HIPAA AUDIT LOG
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_STUDENT,
      resource: 'Student',
      details: `Bulk updated ${request.studentIds.length} students`,
      changes: request.updateData,
      success: true
    });

    // Cache invalidation
    revalidateTag(CACHE_TAGS.STUDENTS, 'default');
    revalidateTag('student-list', 'default');
    request.studentIds.forEach(id => {
      revalidateTag(`student-${id}`, 'default');
    });
    revalidatePath('/dashboard/students');

    return {
      success: true,
      data: response.data,
      message: `Successfully updated ${request.studentIds.length} students`
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to bulk update students';

    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_STUDENT,
      resource: 'Student',
      details: `Failed to bulk update students: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}
