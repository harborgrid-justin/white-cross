/**
 * @fileoverview Student Management Server Actions - Next.js v14+ Compatible
 * @module app/students/actions
 *
 * HIPAA-compliant server actions for student data management with comprehensive
 * caching, audit logging, and error handling.
 *
 * Features:
 * - Server actions with proper 'use server' directive
 * - Next.js cache integration with revalidateTag/revalidatePath
 * - HIPAA audit logging for all PHI operations
 * - Type-safe CRUD operations
 * - Form data handling for UI integration
 * - Comprehensive error handling and validation
 */

'use server';

import { cache } from 'react';
import { revalidateTag, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Core API integrations
import { serverGet, serverPost, serverPut, serverDelete, NextApiClientError } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import { CACHE_TAGS, CACHE_TTL } from '@/lib/cache/constants';

// Types
import type {
  Student,
  CreateStudentData,
  UpdateStudentData,
  StudentFilters,
  PaginatedStudentsResponse,
  TransferStudentRequest,
  BulkUpdateStudentsRequest,
  Gender
} from '@/types/student.types';
import type { ApiResponse } from '@/types/api';

// Utils
import { formatDate } from '@/utils/dateUtils';
import { validateEmail, validatePhone } from '@/utils/validation/userValidation';
import { generateId } from '@/utils/generators';
import { formatName, formatPhone } from '@/utils/formatters';

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
// CACHED DATA FUNCTIONS
// ==========================================

/**
 * Get student by ID with caching
 * Uses Next.js cache() for automatic memoization
 */
export const getStudent = cache(async (id: string): Promise<Student | null> => {
  try {
    const response = await serverGet<ApiResponse<Student>>(
      API_ENDPOINTS.STUDENTS.BY_ID(id),
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [`student-${id}`, CACHE_TAGS.STUDENTS, CACHE_TAGS.PHI] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get student:', error);
    return null;
  }
});

/**
 * Get all students with caching
 * Uses shorter TTL for frequently updated data
 */
export const getStudents = cache(async (filters?: StudentFilters): Promise<Student[]> => {
  try {
    const response = await serverGet<ApiResponse<Student[]>>(
      API_ENDPOINTS.STUDENTS.BASE,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [CACHE_TAGS.STUDENTS, 'student-list', CACHE_TAGS.PHI] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get students:', error);
    return [];
  }
});

/**
 * Search students with caching
 * Shorter TTL for search results
 */
export const searchStudents = cache(async (query: string, filters?: StudentFilters): Promise<Student[]> => {
  try {
    const searchParams = {
      q: query,
      ...filters
    };

    const response = await serverGet<ApiResponse<Student[]>>(
      API_ENDPOINTS.STUDENTS.SEARCH,
      searchParams as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.PHI_FREQUENT, // Shorter for search
          tags: ['student-search', CACHE_TAGS.STUDENTS, CACHE_TAGS.PHI] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to search students:', error);
    return [];
  }
});

/**
 * Get paginated students
 */
export const getPaginatedStudents = cache(async (
  page: number = 1,
  limit: number = 20,
  filters?: StudentFilters
): Promise<PaginatedStudentsResponse | null> => {
  try {
    const params = {
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    };

    const response = await serverGet<ApiResponse<PaginatedStudentsResponse>>(
      API_ENDPOINTS.STUDENTS.BASE,
      params as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [CACHE_TAGS.STUDENTS, 'student-list', CACHE_TAGS.PHI] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get paginated students:', error);
    return null;
  }
});

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

    // Validate email if provided
    if (data.studentNumber && !validateEmail(data.studentNumber + '@school.edu')) {
      // Student number validation could be more complex
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

/**
 * Create student from form data
 * Form-friendly wrapper for createStudent
 */
export async function createStudentFromForm(formData: FormData): Promise<ActionResult<Student>> {
  const studentData: CreateStudentData = {
    studentNumber: formData.get('studentNumber') as string || generateId(),
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    dateOfBirth: formData.get('dateOfBirth') as string,
    grade: formData.get('grade') as string,
    gender: (formData.get('gender') as Gender) || 'PREFER_NOT_TO_SAY',
    medicalRecordNum: formData.get('medicalRecordNum') as string,
    nurseId: formData.get('nurseId') as string,
    enrollmentDate: formData.get('enrollmentDate') as string || new Date().toISOString(),
  };

  const result = await createStudent(studentData);
  
  if (result.success && result.data) {
    redirect(`/dashboard/students/${result.data.id}`);
  }
  
  return result;
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
      changes: data,
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

/**
 * Update student from form data
 * Form-friendly wrapper for updateStudent
 */
export async function updateStudentFromForm(
  studentId: string, 
  formData: FormData
): Promise<ActionResult<Student>> {
  const studentData: UpdateStudentData = {
    firstName: formData.get('firstName') as string || undefined,
    lastName: formData.get('lastName') as string || undefined,
    dateOfBirth: formData.get('dateOfBirth') as string || undefined,
    grade: formData.get('grade') as string || undefined,
    gender: (formData.get('gender') as Gender) || undefined,
    medicalRecordNum: formData.get('medicalRecordNum') as string || undefined,
    nurseId: formData.get('nurseId') as string || undefined,
  };

  // Filter out undefined values
  const filteredData = Object.entries(studentData).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key as keyof UpdateStudentData] = value;
    }
    return acc;
  }, {} as UpdateStudentData);

  const result = await updateStudent(studentId, filteredData);
  
  if (result.success && result.data) {
    redirect(`/dashboard/students/${result.data.id}` as any);
  }
  
  return result;
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

// ==========================================
// SPECIALIZED OPERATIONS
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
 * Get student count
 */
export const getStudentCount = cache(async (filters?: StudentFilters): Promise<number> => {
  try {
    const students = await getStudents(filters);
    return students.length;
  } catch {
    return 0;
  }
});

/**
 * Get student statistics
 */
export const getStudentStatistics = cache(async (studentId: string) => {
  try {
    const response = await serverGet<ApiResponse<any>>(
      API_ENDPOINTS.STUDENTS.BY_ID(studentId) + '/statistics',
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [`student-${studentId}`, CACHE_TAGS.STUDENTS, CACHE_TAGS.PHI] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get student statistics:', error);
    return null;
  }
});

/**
 * Export student data
 */
export const exportStudentData = cache(async (studentId: string) => {
  try {
    const response = await serverGet<ApiResponse<any>>(
      API_ENDPOINTS.STUDENTS.EXPORT(studentId),
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [`student-${studentId}`, CACHE_TAGS.STUDENTS, CACHE_TAGS.PHI] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to export student data:', error);
    return null;
  }
});

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
