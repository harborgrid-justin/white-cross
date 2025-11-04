/**
 * @fileoverview Student Form Handlers - Form Data Processing
 * @module lib/actions/students.forms
 *
 * Form-friendly wrappers for student CRUD operations.
 *
 * Features:
 * - FormData to structured data conversion
 * - Integration with Next.js redirect
 * - Type-safe form handling
 */

'use server';

import { redirect } from 'next/navigation';
import { createStudent, updateStudent } from './students.crud';
import { generateId } from '@/utils/generators';

// Types
import type {
  CreateStudentData,
  UpdateStudentData,
  Gender,
} from '@/types/domain/student.types';
import type { ActionResult } from './students.types';
import type { Student } from '@/types/domain/student.types';

// ==========================================
// FORM HANDLERS
// ==========================================

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
