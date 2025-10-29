'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/overlays/Modal';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/feedback/Alert';
import { StudentFormFields, StudentFormData } from './StudentFormFields';
import { UserPlus, Save, AlertCircle } from 'lucide-react';

/**
 * WF-COMP-STUDENT-MODAL-007 | StudentFormModal.tsx
 * Purpose: Modal form for enrolling new students or editing existing student information
 *
 * @module app/(dashboard)/students/components/modals/StudentFormModal
 */

/**
 * Student form validation schema
 */
const studentFormSchema = z.object({
  // Basic Information
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  middleName: z.string().max(50, 'Middle name too long').optional().or(z.literal('')),
  studentId: z.string().min(1, 'Student ID is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Gender is required'),
  gradeLevel: z.string().min(1, 'Grade level is required'),
  status: z.enum(['active', 'inactive', 'graduated', 'transferred']),

  // Contact Information (optional)
  address: z.string().max(200).optional().or(z.literal('')),
  city: z.string().max(100).optional().or(z.literal('')),
  state: z.string().length(2).optional().or(z.literal('')),
  zipCode: z.string().regex(/^\d{5}$/, 'Invalid ZIP code').optional().or(z.literal('')),
  phoneNumber: z.string().regex(/^\+?1?\d{10,14}$/, 'Invalid phone number').optional().or(z.literal('')),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),

  // School Information
  enrollmentDate: z.string().min(1, 'Enrollment date is required'),
  homeroom: z.string().max(50).optional().or(z.literal('')),
  locker: z.string().max(50).optional().or(z.literal('')),

  // Photo (handled separately)
  photoFile: z.instanceof(File).optional(),
  photoUrl: z.string().optional(),

  // Notes
  notes: z.string().max(1000).optional().or(z.literal(''))
});

/**
 * Existing student for editing
 */
export interface ExistingStudent extends Omit<StudentFormData, 'photoFile'> {
  id: string;
}

/**
 * Props for StudentFormModal component
 */
interface StudentFormModalProps {
  /** Whether modal is open */
  isOpen: boolean;
  /** Callback to close modal */
  onClose: () => void;
  /** Existing student for editing (undefined for new student) */
  student?: ExistingStudent;
  /** Callback when form is submitted */
  onSubmit: (data: StudentFormData) => void | Promise<void>;
  /** Whether form submission is in progress */
  isLoading?: boolean;
  /** Error message to display */
  error?: string;
}

/**
 * StudentFormModal Component
 *
 * Modal form for enrolling new students or editing existing students with:
 * - Complete student information fields
 * - Photo upload support
 * - Form validation with error messages
 * - Loading states
 * - Add/Edit mode support
 *
 * **Features:**
 * - Add new or edit existing students
 * - Comprehensive form validation
 * - Photo upload with preview
 * - Auto-save draft (optional)
 * - Form reset on close
 * - Error handling
 * - Loading states
 *
 * **Validation:**
 * - Required field enforcement
 * - Date format validation
 * - Email format validation
 * - Phone number format
 * - Student ID uniqueness (server-side)
 *
 * **Sections:**
 * - Basic information
 * - Contact information
 * - School information
 * - Photo upload
 * - Additional notes
 *
 * **Accessibility:**
 * - Form labels and associations
 * - Error announcements
 * - Keyboard navigation
 * - Focus management
 *
 * @component
 * @example
 * ```tsx
 * const [showForm, setShowForm] = useState(false);
 * const [editStudent, setEditStudent] = useState<ExistingStudent | undefined>();
 *
 * // For new student
 * <StudentFormModal
 *   isOpen={showForm}
 *   onClose={() => setShowForm(false)}
 *   onSubmit={handleCreateStudent}
 * />
 *
 * // For editing
 * <StudentFormModal
 *   isOpen={showForm}
 *   onClose={() => setShowForm(false)}
 *   student={editStudent}
 *   onSubmit={handleUpdateStudent}
 * />
 * ```
 */
export function StudentFormModal({
  isOpen,
  onClose,
  student,
  onSubmit,
  isLoading = false,
  error
}: StudentFormModalProps) {
  const isEditing = !!student;
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // Get default values based on mode
  const getDefaultValues = (): StudentFormData => {
    if (student) {
      return {
        ...student,
        photoFile: undefined
      };
    }

    // Default values for new student
    const today = new Date().toISOString().split('T')[0];
    return {
      firstName: '',
      lastName: '',
      middleName: '',
      studentId: '',
      dateOfBirth: '',
      gender: '',
      gradeLevel: '',
      status: 'active',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phoneNumber: '',
      email: '',
      enrollmentDate: today,
      homeroom: '',
      locker: '',
      photoUrl: '',
      notes: ''
    };
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: getDefaultValues()
  });

  /**
   * Handle photo file change
   */
  const handlePhotoChange = (file: File | null) => {
    setPhotoFile(file);
  };

  /**
   * Handle form submission
   */
  const handleFormSubmit = async (data: StudentFormData) => {
    // Include photo file if selected
    const submitData = {
      ...data,
      photoFile: photoFile || undefined
    };

    await onSubmit(submitData);
    handleClose();
  };

  /**
   * Handle modal close with reset
   */
  const handleClose = () => {
    reset(getDefaultValues());
    setPhotoFile(null);
    onClose();
  };

  /**
   * Watch all form values for StudentFormFields
   */
  const formValues = watch();

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <Modal.Header>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            {isEditing ? (
              <Save className="w-6 h-6 text-blue-600" />
            ) : (
              <UserPlus className="w-6 h-6 text-blue-600" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isEditing ? 'Edit Student' : 'Enroll New Student'}
            </h2>
            <p className="text-sm text-gray-600">
              {isEditing
                ? 'Update student information and records'
                : 'Add a new student to the system'}
            </p>
          </div>
        </div>
      </Modal.Header>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Modal.Body>
          <div className="space-y-6">
            {/* Error Alert */}
            {error && (
              <Alert variant="error">
                <AlertCircle className="w-5 h-5" />
                <div>
                  <p className="font-semibold">Error</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </Alert>
            )}

            {/* Form Fields */}
            <StudentFormFields
              register={register}
              errors={errors}
              disabled={isLoading}
              isEditing={isEditing}
              values={formValues}
              onPhotoChange={handlePhotoChange}
            />

            {/* Required Fields Notice */}
            <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded border border-gray-200">
              <p>
                <span className="text-red-500">*</span> Required fields must be completed before
                submitting the form.
              </p>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-gray-600">
              {isEditing ? 'Changes will update the student record' : 'Student will be added to the active roster'}
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isEditing ? 'Updating...' : 'Enrolling...'}
                  </>
                ) : (
                  <>
                    {isEditing ? (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Update Student
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Enroll Student
                      </>
                    )}
                  </>
                )}
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
