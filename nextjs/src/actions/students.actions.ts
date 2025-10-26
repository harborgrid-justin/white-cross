/**
 * @fileoverview Server Actions for Student Management
 * @module actions/students
 *
 * Next.js Server Actions for student CRUD operations.
 * Provides server-side data mutations with built-in caching and revalidation.
 *
 * @example
 * ```typescript
 * 'use client';
 *
 * import { createStudent, updateStudent } from '@/actions/students.actions';
 *
 * async function handleCreateStudent(data: CreateStudentData) {
 *   const result = await createStudent(data);
 *   if (result.success) {
 *     router.push(`/students/${result.data.id}`);
 *   } else {
 *     showError(result.error);
 *   }
 * }
 * ```
 */

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { apiClient } from '@/services/core/ApiClient';
import { API_ENDPOINTS } from '@/constants/api';
import type {
  Student,
  CreateStudentData,
  UpdateStudentData,
  TransferStudentRequest,
  BulkUpdateStudentsRequest
} from '@/types/student.types';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ==========================================
// CREATE OPERATIONS
// ==========================================

/**
 * Create a new student
 */
export async function createStudent(data: CreateStudentData): Promise<ActionResult<Student>> {
  try {
    const response = await apiClient.post<Student>(
      API_ENDPOINTS.STUDENTS.BASE,
      data
    );

    // Revalidate student list pages
    revalidateTag('students');
    revalidatePath('/students');

    return {
      success: true,
      data: response.data,
      message: 'Student created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create student';
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Create multiple students (bulk import)
 */
export async function createStudentsBulk(students: CreateStudentData[]): Promise<ActionResult<Student[]>> {
  try {
    const response = await apiClient.post<Student[]>(
      `${API_ENDPOINTS.STUDENTS.BASE}/bulk`,
      { students }
    );

    revalidateTag('students');
    revalidatePath('/students');

    return {
      success: true,
      data: response.data,
      message: `Successfully created ${response.data.length} students`
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create students';
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
 */
export async function updateStudent(
  studentId: string,
  data: UpdateStudentData
): Promise<ActionResult<Student>> {
  try {
    const response = await apiClient.put<Student>(
      API_ENDPOINTS.STUDENTS.BY_ID(studentId),
      data
    );

    revalidateTag('students');
    revalidateTag(`student-${studentId}`);
    revalidatePath('/students');
    revalidatePath(`/students/${studentId}`);

    return {
      success: true,
      data: response.data,
      message: 'Student updated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update student';
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Bulk update students
 */
export async function updateStudentsBulk(request: BulkUpdateStudentsRequest): Promise<ActionResult<{ updated: number }>> {
  try {
    const response = await apiClient.put<{ updated: number }>(
      `${API_ENDPOINTS.STUDENTS.BASE}/bulk`,
      request
    );

    revalidateTag('students');
    revalidatePath('/students');

    return {
      success: true,
      data: response.data,
      message: `Successfully updated ${response.data.updated} students`
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update students';
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
 */
export async function deleteStudent(studentId: string): Promise<ActionResult<void>> {
  try {
    await apiClient.delete(API_ENDPOINTS.STUDENTS.BY_ID(studentId));

    revalidateTag('students');
    revalidateTag(`student-${studentId}`);
    revalidatePath('/students');

    return {
      success: true,
      message: 'Student deleted successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete student';
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Deactivate student
 */
export async function deactivateStudent(studentId: string, reason?: string): Promise<ActionResult<Student>> {
  try {
    const response = await apiClient.post<Student>(
      API_ENDPOINTS.STUDENTS.DEACTIVATE(studentId),
      { reason }
    );

    revalidateTag('students');
    revalidateTag(`student-${studentId}`);
    revalidatePath('/students');
    revalidatePath(`/students/${studentId}`);

    return {
      success: true,
      data: response.data,
      message: 'Student deactivated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to deactivate student';
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Reactivate student
 */
export async function reactivateStudent(studentId: string): Promise<ActionResult<Student>> {
  try {
    const response = await apiClient.post<Student>(
      `${API_ENDPOINTS.STUDENTS.BY_ID(studentId)}/reactivate`,
      {}
    );

    revalidateTag('students');
    revalidateTag(`student-${studentId}`);
    revalidatePath('/students');
    revalidatePath(`/students/${studentId}`);

    return {
      success: true,
      data: response.data,
      message: 'Student reactivated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to reactivate student';
    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// TRANSFER & ASSIGNMENT OPERATIONS
// ==========================================

/**
 * Transfer student to different school/nurse
 */
export async function transferStudent(request: TransferStudentRequest): Promise<ActionResult<Student>> {
  try {
    const response = await apiClient.post<Student>(
      `${API_ENDPOINTS.STUDENTS.BY_ID(request.studentId)}/transfer`,
      request
    );

    revalidateTag('students');
    revalidateTag(`student-${request.studentId}`);
    revalidatePath('/students');
    revalidatePath(`/students/${request.studentId}`);

    return {
      success: true,
      data: response.data,
      message: 'Student transferred successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to transfer student';
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Assign student to nurse
 */
export async function assignStudentToNurse(
  studentId: string,
  nurseId: string
): Promise<ActionResult<Student>> {
  try {
    const response = await apiClient.post<Student>(
      `${API_ENDPOINTS.STUDENTS.BY_ID(studentId)}/assign`,
      { nurseId }
    );

    revalidateTag('students');
    revalidateTag(`student-${studentId}`);
    revalidatePath('/students');
    revalidatePath(`/students/${studentId}`);

    return {
      success: true,
      data: response.data,
      message: 'Student assigned to nurse successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to assign student';
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Bulk assign students to nurse
 */
export async function assignStudentsToNurseBulk(
  studentIds: string[],
  nurseId: string
): Promise<ActionResult<{ assigned: number }>> {
  try {
    const response = await apiClient.post<{ assigned: number }>(
      `${API_ENDPOINTS.STUDENTS.BASE}/assign-bulk`,
      { studentIds, nurseId }
    );

    revalidateTag('students');
    revalidatePath('/students');

    return {
      success: true,
      data: response.data,
      message: `Successfully assigned ${response.data.assigned} students`
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to assign students';
    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// UTILITY OPERATIONS
// ==========================================

/**
 * Upload student photo
 */
export async function uploadStudentPhoto(
  studentId: string,
  file: File
): Promise<ActionResult<{ photoUrl: string }>> {
  try {
    const formData = new FormData();
    formData.append('photo', file);

    const response = await fetch(`/api/proxy/students/${studentId}/photo`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload photo');
    }

    const data = await response.json();

    revalidateTag(`student-${studentId}`);
    revalidatePath(`/students/${studentId}`);

    return {
      success: true,
      data: { photoUrl: data.photoUrl },
      message: 'Photo uploaded successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload photo';
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Export student data
 */
export async function exportStudentData(
  studentId: string,
  format: 'pdf' | 'csv' | 'json' = 'pdf'
): Promise<ActionResult<{ downloadUrl: string }>> {
  try {
    const response = await apiClient.get<{ downloadUrl: string }>(
      `${API_ENDPOINTS.STUDENTS.BY_ID(studentId)}/export?format=${format}`
    );

    return {
      success: true,
      data: response.data,
      message: 'Export ready for download'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to export data';
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Generate student report card
 */
export async function generateStudentReportCard(
  studentId: string
): Promise<ActionResult<{ reportUrl: string }>> {
  try {
    const response = await apiClient.post<{ reportUrl: string }>(
      `${API_ENDPOINTS.STUDENTS.BY_ID(studentId)}/report-card`,
      {}
    );

    return {
      success: true,
      data: response.data,
      message: 'Report card generated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate report card';
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Verify student eligibility
 */
export async function verifyStudentEligibility(
  studentId: string
): Promise<ActionResult<{ eligible: boolean; reasons?: string[] }>> {
  try {
    const response = await apiClient.get<{ eligible: boolean; reasons?: string[] }>(
      `${API_ENDPOINTS.STUDENTS.BY_ID(studentId)}/verify-eligibility`
    );

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to verify eligibility';
    return {
      success: false,
      error: errorMessage
    };
  }
}
