/**
 * StudentFormModal - MIGRATED EXAMPLE with HIPAA Compliance
 *
 * Complete example of a PHI form migration with:
 * - React Hook Form + Zod validation
 * - HIPAA audit logging via useFormAudit
 * - PHI field marking
 * - Reusable form components
 * - Full CRUD operations
 *
 * This form contains PHI and requires audit logging.
 */

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { X, Loader2 } from 'lucide-react';

// Import validation schema and types
import {
  createStudentSchema,
  updateStudentSchema,
  zodResolver,
  type CreateStudent,
  type UpdateStudent,
  GENDERS,
  GRADE_LEVELS,
  STUDENT_PHI_FIELDS
} from '@/lib/validations';

// Import HIPAA audit hook
import { useFormAudit } from '@/lib/hipaa';

// Import reusable form components
import {
  FormInput,
  FormSelect,
  FormTextArea,
  FormDatePicker
} from '@/components/forms';

// Import API
import { studentsApi } from '@/services/modules/studentsApi';

interface StudentFormModalProps {
  /** Student to edit (null for create mode) */
  student?: any | null;

  /** Close modal callback */
  onClose: () => void;

  /** Success callback */
  onSuccess: () => void;
}

/**
 * StudentFormModal Component
 */
export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  student,
  onClose,
  onSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!student;

  // Initialize React Hook Form with Zod validation
  const form = useForm<CreateStudent | UpdateStudent>({
    resolver: zodResolver(isEditMode ? updateStudentSchema : createStudentSchema),
    defaultValues: isEditMode
      ? {
          id: student.id,
          firstName: student.firstName || '',
          lastName: student.lastName || '',
          middleName: student.middleName || '',
          dateOfBirth: student.dateOfBirth || '',
          gender: student.gender || 'prefer_not_to_say',
          gradeLevel: student.gradeLevel || 'kindergarten',
          schoolId: student.schoolId || '',
          email: student.email || '',
          phone: student.phone || '',
          address: student.address || {
            street: '',
            street2: '',
            city: '',
            state: 'CA',
            zipCode: ''
          },
          notes: student.notes || ''
        }
      : {
          firstName: '',
          lastName: '',
          middleName: '',
          dateOfBirth: '',
          gender: 'prefer_not_to_say',
          gradeLevel: 'kindergarten',
          schoolId: '',
          email: '',
          phone: '',
          address: {
            street: '',
            street2: '',
            city: '',
            state: 'CA',
            zipCode: ''
          },
          enrollmentDate: new Date().toISOString().split('T')[0],
          notes: ''
        }
  });

  const { register, handleSubmit, formState: { errors } } = form;

  // Initialize HIPAA audit logging
  const { logSubmission, logCancel } = useFormAudit({
    formName: isEditMode ? 'edit-student-form' : 'create-student-form',
    phiFields: STUDENT_PHI_FIELDS,
    form,
    enabled: true
  });

  /**
   * Form submission handler
   */
  const onSubmit = async (data: CreateStudent | UpdateStudent) => {
    try {
      setIsSubmitting(true);

      // Log submission for HIPAA compliance
      await logSubmission(data);

      // Call appropriate API
      if (isEditMode) {
        await studentsApi.update(data.id as string, data as UpdateStudent);
        toast.success('Student updated successfully');
      } else {
        await studentsApi.create(data as CreateStudent);
        toast.success('Student created successfully');
      }

      // Trigger success callback
      onSuccess();

      // Close modal
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save student');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle cancel
   */
  const handleCancel = async () => {
    // Log cancellation for HIPAA compliance
    await logCancel();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={handleCancel}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-4xl overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h3 className="text-lg font-medium text-gray-900">
              {isEditMode ? 'Edit Student' : 'Add New Student'}
            </h3>
            <button
              type="button"
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
              {/* PHI Warning */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800">
                  <strong>Protected Health Information (PHI):</strong> This form contains
                  sensitive student information. All access and modifications are logged for
                  HIPAA compliance.
                </p>
              </div>

              {/* Basic Information */}
              <div className="mb-6">
                <h4 className="text-md font-semibold mb-4">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormInput
                    name="firstName"
                    label="First Name"
                    required
                    isPhi
                    error={errors.firstName}
                    register={register}
                    disabled={isSubmitting}
                  />

                  <FormInput
                    name="middleName"
                    label="Middle Name"
                    isPhi
                    error={errors.middleName}
                    register={register}
                    disabled={isSubmitting}
                  />

                  <FormInput
                    name="lastName"
                    label="Last Name"
                    required
                    isPhi
                    error={errors.lastName}
                    register={register}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Demographics */}
              <div className="mb-6">
                <h4 className="text-md font-semibold mb-4">Demographics</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormDatePicker
                    name="dateOfBirth"
                    label="Date of Birth"
                    required
                    isPhi
                    error={errors.dateOfBirth}
                    register={register}
                    disabled={isSubmitting}
                  />

                  <FormSelect
                    name="gender"
                    label="Gender"
                    required
                    options={GENDERS.map((g) => ({
                      value: g,
                      label: g.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
                    }))}
                    error={errors.gender}
                    register={register}
                    disabled={isSubmitting}
                  />

                  <FormSelect
                    name="gradeLevel"
                    label="Grade Level"
                    required
                    options={GRADE_LEVELS.map((g) => ({
                      value: g,
                      label: g.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
                    }))}
                    error={errors.gradeLevel}
                    register={register}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-6">
                <h4 className="text-md font-semibold mb-4">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    name="email"
                    label="Email"
                    type="email"
                    isPhi
                    error={errors.email}
                    register={register}
                    disabled={isSubmitting}
                  />

                  <FormInput
                    name="phone"
                    label="Phone"
                    type="tel"
                    isPhi
                    error={errors.phone}
                    register={register}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <FormInput
                    name="address.street"
                    label="Street Address"
                    required
                    isPhi
                    error={errors.address?.street}
                    register={register}
                    disabled={isSubmitting}
                  />

                  <FormInput
                    name="address.city"
                    label="City"
                    required
                    isPhi
                    error={errors.address?.city}
                    register={register}
                    disabled={isSubmitting}
                  />

                  <FormInput
                    name="address.state"
                    label="State"
                    required
                    isPhi
                    error={errors.address?.state}
                    register={register}
                    disabled={isSubmitting}
                  />

                  <FormInput
                    name="address.zipCode"
                    label="ZIP Code"
                    required
                    isPhi
                    error={errors.address?.zipCode}
                    register={register}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Notes */}
              <FormTextArea
                name="notes"
                label="Notes"
                rows={3}
                error={errors.notes}
                register={register}
                disabled={isSubmitting}
              />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {isEditMode ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>{isEditMode ? 'Update Student' : 'Create Student'}</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
