/**
 * Student Server Actions
 * Server-side actions for student CRUD operations with HIPAA compliance
 *
 * @module app/students/actions
 */

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import {
  CreateStudentSchema,
  UpdateStudentSchema,
  StudentFiltersSchema,
  TransferStudentSchema,
  DeactivateStudentSchema,
  type CreateStudentInput,
  type UpdateStudentInput,
  type StudentFiltersInput,
  type TransferStudentInput,
  type DeactivateStudentInput
} from '@/lib/validations/student.schema';
import type {
  Student,
  PaginatedStudentsResponse,
  CreateStudentData,
  UpdateStudentData
} from '@/types/student.types';

/**
 * Server action result type
 */
type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
};

/**
 * Backend API base URL
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Get auth token from cookies
 */
async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value || cookieStore.get('token')?.value;
  return token;
}

/**
 * Make authenticated API request
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: response.statusText || 'Request failed'
    }));
    throw new Error(error.message || 'Request failed');
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

/**
 * Create a new student
 *
 * @param data - Student creation data
 * @returns Action result with created student or error
 *
 * @remarks
 * **HIPAA Compliance:** This action creates a new PHI record. All access is
 * audited by the backend API. Ensure proper authorization before calling.
 *
 * @example
 * ```tsx
 * const result = await createStudent({
 *   studentNumber: 'STU-2024-001',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   dateOfBirth: '2015-05-15',
 *   grade: '3',
 *   gender: 'MALE'
 * });
 * ```
 */
export async function createStudent(
  data: CreateStudentInput
): Promise<ActionResult<Student>> {
  try {
    // Validate input data
    const validation = CreateStudentSchema.safeParse(data);

    if (!validation.success) {
      return {
        success: false,
        errors: validation.error.flatten().fieldErrors
      };
    }

    // Call backend API
    const response = await apiRequest<{ student: Student }>(
      '/api/v1/students',
      {
        method: 'POST',
        body: JSON.stringify(validation.data)
      }
    );

    // Revalidate student lists
    revalidatePath('/students');
    revalidateTag('students');

    return {
      success: true,
      data: response.student
    };
  } catch (error) {
    console.error('Create student error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create student'
    };
  }
}

/**
 * Update an existing student
 *
 * @param id - Student ID
 * @param data - Student update data (partial)
 * @returns Action result with updated student or error
 *
 * @remarks
 * **HIPAA Compliance:** This action modifies PHI data. All changes are
 * audited by the backend API.
 *
 * @example
 * ```tsx
 * const result = await updateStudent('student-uuid', {
 *   grade: '4',
 *   isActive: true
 * });
 * ```
 */
export async function updateStudent(
  id: string,
  data: UpdateStudentInput
): Promise<ActionResult<Student>> {
  try {
    // Validate input data
    const validation = UpdateStudentSchema.safeParse(data);

    if (!validation.success) {
      return {
        success: false,
        errors: validation.error.flatten().fieldErrors
      };
    }

    // Call backend API
    const response = await apiRequest<{ student: Student }>(
      `/api/v1/students/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(validation.data)
      }
    );

    // Revalidate student pages
    revalidatePath('/students');
    revalidatePath(`/students/${id}`);
    revalidateTag('students');
    revalidateTag(`student-${id}`);

    return {
      success: true,
      data: response.student
    };
  } catch (error) {
    console.error('Update student error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update student'
    };
  }
}

/**
 * Deactivate a student (soft delete)
 *
 * @param id - Student ID
 * @param reason - Deactivation reason
 * @returns Action result with success status or error
 *
 * @remarks
 * **HIPAA Compliance:** Soft delete preserves audit trail. All historical
 * health records are maintained per compliance requirements.
 *
 * @example
 * ```tsx
 * const result = await deactivateStudent(
 *   'student-uuid',
 *   'Student graduated and transferred to middle school'
 * );
 * ```
 */
export async function deactivateStudent(
  id: string,
  reason: string
): Promise<ActionResult<Student>> {
  try {
    // Validate input data
    const validation = DeactivateStudentSchema.safeParse({ reason });

    if (!validation.success) {
      return {
        success: false,
        errors: validation.error.flatten().fieldErrors
      };
    }

    // Call backend API
    const response = await apiRequest<{ student: Student }>(
      `/api/v1/students/${id}/deactivate`,
      {
        method: 'POST',
        body: JSON.stringify(validation.data)
      }
    );

    // Revalidate student pages
    revalidatePath('/students');
    revalidatePath(`/students/${id}`);
    revalidateTag('students');
    revalidateTag(`student-${id}`);

    return {
      success: true,
      data: response.student
    };
  } catch (error) {
    console.error('Deactivate student error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to deactivate student'
    };
  }
}

/**
 * Delete a student permanently
 *
 * @param id - Student ID
 * @returns Action result with success status or error
 *
 * @remarks
 * **⚠️ HIPAA COMPLIANCE WARNING:** This is a hard delete and violates HIPAA audit trail requirements.
 * **DO NOT USE IN PRODUCTION.** Use deactivateStudent() instead to maintain audit compliance.
 *
 * @deprecated Use deactivateStudent instead for HIPAA compliance (see lines 240-278)
 * @security HIPAA-NON-COMPLIANT - Hard delete removes audit trail
 */
export async function deleteStudent(id: string): Promise<ActionResult<void>> {
  // Runtime warning for HIPAA compliance
  console.warn(
    '⚠️ HIPAA COMPLIANCE WARNING: deleteStudent() is deprecated and non-compliant. ' +
    'Use deactivateStudent() instead to maintain audit trail. ' +
    'This function will be removed in a future version.'
  );

  try {
    await apiRequest<void>(`/api/v1/students/${id}`, {
      method: 'DELETE'
    });

    // Revalidate student pages
    revalidatePath('/students');
    revalidateTag('students');

    return {
      success: true
    };
  } catch (error) {
    console.error('Delete student error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete student'
    };
  }
}

/**
 * Get students with pagination and filtering
 *
 * @param filters - Filter criteria, pagination params
 * @returns Action result with students array or error
 *
 * @remarks
 * **HIPAA Compliance:** All data access is audited. Filters are applied
 * server-side for data minimization.
 *
 * @example
 * ```tsx
 * const result = await getStudents({
 *   grade: '5',
 *   isActive: true,
 *   page: 1,
 *   limit: 20
 * });
 * ```
 */
export async function getStudents(
  filters?: StudentFiltersInput
): Promise<ActionResult<PaginatedStudentsResponse>> {
  try {
    // Validate filters
    const validation = filters
      ? StudentFiltersSchema.safeParse(filters)
      : { success: true, data: {} };

    if (!validation.success) {
      return {
        success: false,
        errors: validation.error.flatten().fieldErrors
      };
    }

    // Build query string
    const params = new URLSearchParams();
    if (validation.data) {
      Object.entries(validation.data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    // Call backend API
    const queryString = params.toString();
    const response = await apiRequest<PaginatedStudentsResponse>(
      `/api/v1/students${queryString ? `?${queryString}` : ''}`,
      {
        method: 'GET',
        next: { tags: ['students'] }
      }
    );

    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error('Get students error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch students'
    };
  }
}

/**
 * Get a single student by ID
 *
 * @param id - Student ID
 * @returns Action result with student data or error
 *
 * @remarks
 * **HIPAA Compliance:** Accessing complete student profile with PHI.
 * All access is audited.
 *
 * @example
 * ```tsx
 * const result = await getStudentById('student-uuid');
 * if (result.success) {
 *   console.log(result.data.firstName, result.data.lastName);
 * }
 * ```
 */
export async function getStudentById(
  id: string
): Promise<ActionResult<Student>> {
  try {
    const response = await apiRequest<{ student: Student }>(
      `/api/v1/students/${id}`,
      {
        method: 'GET',
        next: { tags: [`student-${id}`] }
      }
    );

    return {
      success: true,
      data: response.student
    };
  } catch (error) {
    console.error('Get student error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch student'
    };
  }
}

/**
 * Transfer student to a different nurse
 *
 * @param id - Student ID
 * @param data - Transfer data with new nurse ID
 * @returns Action result with updated student or error
 *
 * @remarks
 * **HIPAA Compliance:** Care handoff is audited. Previous nurse retains
 * read-only access to historical records.
 *
 * @example
 * ```tsx
 * const result = await transferStudent('student-uuid', {
 *   nurseId: 'new-nurse-uuid'
 * });
 * ```
 */
export async function transferStudent(
  id: string,
  data: TransferStudentInput
): Promise<ActionResult<Student>> {
  try {
    // Validate input data
    const validation = TransferStudentSchema.safeParse(data);

    if (!validation.success) {
      return {
        success: false,
        errors: validation.error.flatten().fieldErrors
      };
    }

    // Call backend API
    const response = await apiRequest<{ student: Student }>(
      `/api/v1/students/${id}/transfer`,
      {
        method: 'POST',
        body: JSON.stringify(validation.data)
      }
    );

    // Revalidate student pages
    revalidatePath('/students');
    revalidatePath(`/students/${id}`);
    revalidateTag('students');
    revalidateTag(`student-${id}`);

    return {
      success: true,
      data: response.student
    };
  } catch (error) {
    console.error('Transfer student error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to transfer student'
    };
  }
}

/**
 * Search students by name or student number
 *
 * @param query - Search query string
 * @returns Action result with matching students or error
 *
 * @example
 * ```tsx
 * const result = await searchStudents('smith');
 * if (result.success) {
 *   result.data.forEach(student => {
 *     console.log(student.firstName, student.lastName);
 *   });
 * }
 * ```
 */
export async function searchStudents(
  query: string
): Promise<ActionResult<Student[]>> {
  try {
    if (!query || query.trim().length === 0) {
      return {
        success: false,
        error: 'Search query is required'
      };
    }

    const response = await apiRequest<{ students: Student[] }>(
      `/api/v1/students/search/${encodeURIComponent(query)}`,
      {
        method: 'GET'
      }
    );

    return {
      success: true,
      data: response.students
    };
  } catch (error) {
    console.error('Search students error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to search students'
    };
  }
}

/**
 * Get students by grade level
 *
 * @param grade - Grade level (K, 1-12)
 * @returns Action result with students in that grade or error
 *
 * @example
 * ```tsx
 * const result = await getStudentsByGrade('5');
 * ```
 */
export async function getStudentsByGrade(
  grade: string
): Promise<ActionResult<Student[]>> {
  try {
    const response = await apiRequest<{ students: Student[] }>(
      `/api/v1/students/grade/${encodeURIComponent(grade)}`,
      {
        method: 'GET'
      }
    );

    return {
      success: true,
      data: response.students
    };
  } catch (error) {
    console.error('Get students by grade error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch students by grade'
    };
  }
}

/**
 * Get students assigned to the current nurse
 *
 * @returns Action result with assigned students or error
 *
 * @remarks
 * Automatically filters by authenticated user's nurse ID.
 *
 * @example
 * ```tsx
 * const result = await getAssignedStudents();
 * ```
 */
export async function getAssignedStudents(): Promise<ActionResult<Student[]>> {
  try {
    const response = await apiRequest<{ students: Student[] }>(
      '/api/v1/students/assigned',
      {
        method: 'GET',
        next: { tags: ['students', 'assigned-students'] }
      }
    );

    return {
      success: true,
      data: response.students
    };
  } catch (error) {
    console.error('Get assigned students error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch assigned students'
    };
  }
}

/**
 * Create student and redirect to details page
 *
 * @param data - Student creation data
 * @returns Never (redirects or throws)
 *
 * @remarks
 * This action creates a student and immediately redirects to the student's
 * detail page on success. Use for form submissions.
 */
export async function createStudentAndRedirect(
  data: CreateStudentInput
): Promise<never> {
  const result = await createStudent(data);

  if (result.success && result.data) {
    redirect(`/students/${result.data.id}`);
  } else {
    throw new Error(result.error || 'Failed to create student');
  }
}

/**
 * Update student and redirect to details page
 *
 * @param id - Student ID
 * @param data - Student update data
 * @returns Never (redirects or throws)
 *
 * @remarks
 * This action updates a student and immediately redirects to the student's
 * detail page on success. Use for form submissions.
 */
export async function updateStudentAndRedirect(
  id: string,
  data: UpdateStudentInput
): Promise<never> {
  const result = await updateStudent(id, data);

  if (result.success && result.data) {
    redirect(`/students/${result.data.id}`);
  } else {
    throw new Error(result.error || 'Failed to update student');
  }
}
