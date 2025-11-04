/**
 * @fileoverview Student CRUD Operations - Create, Read, Update, Delete
 * @module lib/actions/students.crud
 *
 * HIPAA-compliant CRUD operations for student data management.
 *
 * Features:
 * - Create, update, delete operations
 * - HIPAA audit logging for all PHI operations
 * - Cache invalidation with revalidateTag/revalidatePath
 * - Comprehensive error handling and validation
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { serverPost, serverPut, serverDelete, NextApiClientError } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import { CACHE_TAGS } from '@/lib/cache/constants';

// Types
import type {
  Student,
  CreateStudentData,
  UpdateStudentData,
} from '@/types/domain/student.types';
import type { ApiResponse } from '@/types';
import type { ActionResult } from './students.types';

// Utils
import { formatName } from '@/utils/formatters';

// ==========================================
// CREATE OPERATIONS
// ==========================================

/**
 * Create a new student
 * Includes HIPAA audit logging and cache invalidation
 */
export async function createStudent(data: CreateStudentData): Promise<ActionResult<Student>> {
  try {
    // Validate required fields
    if (!data.firstName || !data.lastName || !data.dateOfBirth || !data.grade) {
      return {
        success: false,
        error: 'Missing required fields: firstName, lastName, dateOfBirth, grade'
      };
    }

    const response = await serverPost<ApiResponse<Student>>(
      API_ENDPOINTS.STUDENTS.BASE,
      data,
      {
        cache: 'no-store',
        next: { tags: [CACHE_TAGS.STUDENTS, CACHE_TAGS.PHI] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create student');
    }

    // HIPAA AUDIT LOG - Mandatory for PHI creation
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_STUDENT,
      resource: 'Student',
      resourceId: response.data.id,
      details: `Created student record for ${formatName(data.firstName, data.lastName)}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(CACHE_TAGS.STUDENTS, 'default');
    revalidateTag('student-list', 'default');
    revalidatePath('/dashboard/students');

    return {
      success: true,
      data: response.data,
      message: 'Student created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create student';

    // HIPAA AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_STUDENT,
      resource: 'Student',
      details: `Failed to create student record: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// UPDATE OPERATIONS
// ==========================================

/**
 * Update student information
 * Includes HIPAA audit logging and cache invalidation
 */
export async function updateStudent(
  studentId: string,
  data: UpdateStudentData
): Promise<ActionResult<Student>> {
  try {
    if (!studentId) {
      return {
        success: false,
        error: 'Student ID is required'
      };
    }

    const response = await serverPut<ApiResponse<Student>>(
      API_ENDPOINTS.STUDENTS.BY_ID(studentId),
      data,
      {
        cache: 'no-store',
        next: { tags: [CACHE_TAGS.STUDENTS, `student-${studentId}`, CACHE_TAGS.PHI] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update student');
    }

    // HIPAA AUDIT LOG - Mandatory for PHI modification
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_STUDENT,
      resource: 'Student',
      resourceId: studentId,
      details: `Updated student record`,
      changes: data as Record<string, unknown>,
      success: true
    });

    // Cache invalidation
    revalidateTag(CACHE_TAGS.STUDENTS, 'default');
    revalidateTag(`student-${studentId}`, 'default');
    revalidateTag('student-list', 'default');
    revalidatePath('/dashboard/students');
    revalidatePath(`/dashboard/students/${studentId}` as any);

    return {
      success: true,
      data: response.data,
      message: 'Student updated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to update student';

    // HIPAA AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_STUDENT,
      resource: 'Student',
      resourceId: studentId,
      details: `Failed to update student record: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// DELETE OPERATIONS
// ==========================================

/**
 * Delete student (soft delete)
 * Includes HIPAA audit logging and cache invalidation
 */
export async function deleteStudent(studentId: string): Promise<ActionResult<void>> {
  try {
    if (!studentId) {
      return {
        success: false,
        error: 'Student ID is required'
      };
    }

    await serverDelete<ApiResponse<void>>(
      API_ENDPOINTS.STUDENTS.BY_ID(studentId),
      {
        cache: 'no-store',
        next: { tags: [CACHE_TAGS.STUDENTS, `student-${studentId}`, CACHE_TAGS.PHI] }
      }
    );

    // HIPAA AUDIT LOG - Mandatory for PHI deletion
    await auditLog({
      action: AUDIT_ACTIONS.DELETE_STUDENT,
      resource: 'Student',
      resourceId: studentId,
      details: `Deleted student record (soft delete)`,
      success: true
    });

    // Cache invalidation
    revalidateTag(CACHE_TAGS.STUDENTS, 'default');
    revalidateTag(`student-${studentId}`, 'default');
    revalidateTag('student-list', 'default');
    revalidatePath('/dashboard/students');

    return {
      success: true,
      message: 'Student deleted successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to delete student';

    // HIPAA AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.DELETE_STUDENT,
      resource: 'Student',
      resourceId: studentId,
      details: `Failed to delete student record: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}
