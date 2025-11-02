/**
 * StudentForm Component
 * Comprehensive form for creating and editing students
 *
 * @module components/features/students/StudentForm
 */

'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  StudentFormSchema,
  type StudentFormInput
} from '@/lib/validations/student.schema';
import { createStudent, updateStudent } from '@/app/students/actions';
import type { Student } from '@/types/student.types';

// UI Components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Loader2, Save, X } from 'lucide-react';

/**
 * StudentForm props
 */
export interface StudentFormProps {
  /** Student data for edit mode */
  student?: Student;
  /** Form mode */
  mode?: 'create' | 'edit';
  /** Cancel handler */
  onCancel?: () => void;
  /** Success handler */
  onSuccess?: (student: Student) => void;
  /** Custom className */
  className?: string;
}

/**
 * StudentForm - Create/Edit student form with validation
 *
 * @example
 * ```tsx
 * // Create mode
 * <StudentForm mode="create" onSuccess={(student) => console.log('Created:', student.id)} />
 *
 * // Edit mode
 * <StudentForm mode="edit" student={existingStudent} onSuccess={() => router.push('/students')} />
 * ```
 */
export const StudentForm: React.FC<StudentFormProps> = ({
  student,
  mode = 'create',
  onCancel,
  onSuccess,
  className
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isEditMode = mode === 'edit' && student !== undefined;

  // Form state with react-hook-form + Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<StudentFormInput>({
    resolver: zodResolver(StudentFormSchema),
    defaultValues: isEditMode
      ? {
          studentNumber: student.studentNumber,
          firstName: student.firstName,
          lastName: student.lastName,
          dateOfBirth: student.dateOfBirth.split('T')[0], // Format for input[type="date"]
          grade: student.grade,
          gender: student.gender,
          photo: student.photo || '',
          medicalRecordNum: student.medicalRecordNum || '',
          nurseId: student.nurseId || '',
          enrollmentDate: student.enrollmentDate?.split('T')[0] || ''
        }
      : {
          studentNumber: '',
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          grade: '',
          gender: 'PREFER_NOT_TO_SAY',
          photo: '',
          medicalRecordNum: '',
          nurseId: '',
          enrollmentDate: new Date().toISOString().split('T')[0]
        }
  });

  /**
   * Form submission handler
   */
  const onSubmit = async (data: StudentFormInput) => {
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      try {
        let result;

        if (isEditMode) {
          // Update existing student
          result = await updateStudent(student.id, data);
        } else {
          // Create new student
          result = await createStudent(data);
        }

        if (result.success && result.data) {
          setSuccess(true);

          if (onSuccess) {
            onSuccess(result.data);
          } else {
            // Default: redirect to student details
            router.push(`/students/${result.data.id}`);
          }
        } else {
          setError(result.error || 'An error occurred');
        }
      } catch (err) {
        console.error('Form submission error:', err);
        setError(err instanceof Error ? err.message : 'Failed to save student');
      }
    });
  };

  /**
   * Cancel handler
   */
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  return (
    <Card className={className}>
      <div className="p-6">
        {/* Form Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {isEditMode ? 'Edit Student' : 'New Student'}
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {isEditMode
              ? 'Update student demographic and enrollment information'
              : 'Enter student demographic and enrollment information'}
          </p>
        </div>

        {/* Success Alert */}
        {success && (
          <Alert variant="success" className="mb-6">
            Student {isEditMode ? 'updated' : 'created'} successfully!
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Number */}
              <div>
                <label htmlFor="studentNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Student Number <span className="text-red-600">*</span>
                </label>
                <input
                  {...register('studentNumber')}
                  type="text"
                  id="studentNumber"
                  placeholder="STU-2024-001"
                  disabled={isEditMode} // Student number typically shouldn't change
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                />
                {errors.studentNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.studentNumber.message}</p>
                )}
              </div>

              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name <span className="text-red-600">*</span>
                </label>
                <input
                  {...register('firstName')}
                  type="text"
                  id="firstName"
                  placeholder="John"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name <span className="text-red-600">*</span>
                </label>
                <input
                  {...register('lastName')}
                  type="text"
                  id="lastName"
                  placeholder="Doe"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date of Birth <span className="text-red-600">*</span>
                </label>
                <input
                  {...register('dateOfBirth')}
                  type="date"
                  id="dateOfBirth"
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
                )}
              </div>

              {/* Grade */}
              <div>
                <label htmlFor="grade" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Grade <span className="text-red-600">*</span>
                </label>
                <select
                  {...register('grade')}
                  id="grade"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select grade</option>
                  <option value="K">Kindergarten</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => (
                    <option key={grade} value={String(grade)}>
                      Grade {grade}
                    </option>
                  ))}
                </select>
                {errors.grade && (
                  <p className="mt-1 text-sm text-red-600">{errors.grade.message}</p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Gender <span className="text-red-600">*</span>
                </label>
                <select
                  {...register('gender')}
                  id="gender"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                  <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Additional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Enrollment Date */}
              <div>
                <label htmlFor="enrollmentDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enrollment Date
                </label>
                <input
                  {...register('enrollmentDate')}
                  type="date"
                  id="enrollmentDate"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.enrollmentDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.enrollmentDate.message}</p>
                )}
              </div>

              {/* Medical Record Number */}
              <div>
                <label htmlFor="medicalRecordNum" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Medical Record Number
                </label>
                <input
                  {...register('medicalRecordNum')}
                  type="text"
                  id="medicalRecordNum"
                  placeholder="MRN-12345"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.medicalRecordNum && (
                  <p className="mt-1 text-sm text-red-600">{errors.medicalRecordNum.message}</p>
                )}
              </div>

              {/* Photo URL */}
              <div>
                <label htmlFor="photo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Photo URL
                </label>
                <input
                  {...register('photo')}
                  type="url"
                  id="photo"
                  placeholder="https://example.com/photo.jpg"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.photo && (
                  <p className="mt-1 text-sm text-red-600">{errors.photo.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Enter a valid URL to a student photo
                </p>
              </div>

              {/* Assigned Nurse */}
              <div>
                <label htmlFor="nurseId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assigned Nurse ID
                </label>
                <input
                  {...register('nurseId')}
                  type="text"
                  id="nurseId"
                  placeholder="Nurse UUID (optional)"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.nurseId && (
                  <p className="mt-1 text-sm text-red-600">{errors.nurseId.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Leave blank to assign later
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={isPending || isSubmitting}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || isSubmitting}
            >
              {isPending || isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditMode ? 'Update Student' : 'Create Student'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};

StudentForm.displayName = 'StudentForm';

export default StudentForm;




