'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DatePicker } from '@/components/ui/Inputs/DatePicker';
import { Textarea } from '@/components/ui/Textarea';
import { FileUpload } from '@/components/ui/FileUpload';

/**
 * WF-COMP-STUDENT-MODAL-006 | StudentFormFields.tsx
 * Purpose: Reusable form field components for student enrollment and editing
 *
 * @module app/(dashboard)/students/components/modals/StudentFormFields
 */

/**
 * Student form data structure
 */
export interface StudentFormData {
  // Basic Information
  firstName: string;
  lastName: string;
  middleName?: string;
  studentId: string;
  dateOfBirth: string;
  gender: string;
  gradeLevel: string;
  status: 'active' | 'inactive' | 'graduated' | 'transferred';

  // Contact Information
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phoneNumber?: string;
  email?: string;

  // School Information
  enrollmentDate: string;
  homeroom?: string;
  locker?: string;

  // Photo
  photoFile?: File;
  photoUrl?: string;

  // Notes
  notes?: string;
}

/**
 * Props for StudentFormFields component
 */
interface StudentFormFieldsProps {
  /** React Hook Form register function */
  register: UseFormRegister<StudentFormData>;
  /** Form errors object */
  errors: FieldErrors<StudentFormData>;
  /** Whether form is disabled (e.g., during submission) */
  disabled?: boolean;
  /** Whether this is an edit form (some fields may be readonly) */
  isEditing?: boolean;
  /** Current form values for controlled components */
  values?: Partial<StudentFormData>;
  /** Callback for file upload */
  onPhotoChange?: (file: File | null) => void;
}

/**
 * StudentFormFields Component
 *
 * Reusable form field set for student enrollment and editing with:
 * - Basic information fields (name, DOB, gender)
 * - Student ID and grade level
 * - Contact information
 * - School information (enrollment, homeroom, locker)
 * - Photo upload
 * - Additional notes
 *
 * **Features:**
 * - Organized field sections
 * - Validation error display
 * - Required field indicators
 * - Date picker for DOB and enrollment
 * - Photo upload with preview
 * - Disabled state support
 * - Edit mode support
 *
 * **Validation:**
 * - Required field enforcement
 * - Date format validation
 * - Email format validation
 * - Phone number format
 * - Student ID uniqueness (handled by parent)
 *
 * **Accessibility:**
 * - Proper label associations
 * - Error announcements
 * - Required field indicators
 * - Keyboard navigation
 *
 * @component
 * @example
 * ```tsx
 * const { register, formState: { errors }, watch } = useForm<StudentFormData>();
 *
 * <StudentFormFields
 *   register={register}
 *   errors={errors}
 *   values={watch()}
 *   disabled={isSubmitting}
 * />
 * ```
 */
export function StudentFormFields({
  register,
  errors,
  disabled = false,
  isEditing = false,
  values,
  onPhotoChange
}: StudentFormFieldsProps) {
  /**
   * US States for dropdown
   */
  const usStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  return (
    <div className="space-y-6">
      {/* Basic Information Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="firstName"
              {...register('firstName')}
              disabled={disabled}
              error={errors.firstName?.message}
            />
          </div>

          <div>
            <label htmlFor="middleName" className="block text-sm font-medium text-gray-700 mb-1">
              Middle Name
            </label>
            <Input
              id="middleName"
              {...register('middleName')}
              disabled={disabled}
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="lastName"
              {...register('lastName')}
              disabled={disabled}
              error={errors.lastName?.message}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
              Student ID <span className="text-red-500">*</span>
            </label>
            <Input
              id="studentId"
              {...register('studentId')}
              disabled={disabled || isEditing}
              error={errors.studentId?.message}
              placeholder="e.g., STU-2024-001"
            />
            {isEditing && (
              <p className="mt-1 text-xs text-gray-500">Student ID cannot be changed</p>
            )}
          </div>

          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <Input
              id="dateOfBirth"
              type="date"
              {...register('dateOfBirth')}
              disabled={disabled}
              error={errors.dateOfBirth?.message}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
              Gender <span className="text-red-500">*</span>
            </label>
            <Select
              id="gender"
              {...register('gender')}
              disabled={disabled}
            >
              <option value="">Select gender...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </Select>
            {errors.gender && (
              <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="gradeLevel" className="block text-sm font-medium text-gray-700 mb-1">
              Grade Level <span className="text-red-500">*</span>
            </label>
            <Select
              id="gradeLevel"
              {...register('gradeLevel')}
              disabled={disabled}
            >
              <option value="">Select grade...</option>
              <option value="K">Kindergarten</option>
              <option value="1">1st Grade</option>
              <option value="2">2nd Grade</option>
              <option value="3">3rd Grade</option>
              <option value="4">4th Grade</option>
              <option value="5">5th Grade</option>
              <option value="6">6th Grade</option>
              <option value="7">7th Grade</option>
              <option value="8">8th Grade</option>
              <option value="9">9th Grade</option>
              <option value="10">10th Grade</option>
              <option value="11">11th Grade</option>
              <option value="12">12th Grade</option>
            </Select>
            {errors.gradeLevel && (
              <p className="mt-1 text-sm text-red-600">{errors.gradeLevel.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <Select
              id="status"
              {...register('status')}
              disabled={disabled}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="graduated">Graduated</option>
              <option value="transferred">Transferred</option>
            </Select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Street Address
          </label>
          <Input
            id="address"
            {...register('address')}
            disabled={disabled}
            placeholder="123 Main Street"
          />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <Input
              id="city"
              {...register('city')}
              disabled={disabled}
              placeholder="City"
            />
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <Select
              id="state"
              {...register('state')}
              disabled={disabled}
            >
              <option value="">Select state...</option>
              {usStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
              ZIP Code
            </label>
            <Input
              id="zipCode"
              {...register('zipCode')}
              disabled={disabled}
              placeholder="12345"
              maxLength={5}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <Input
              id="phoneNumber"
              type="tel"
              {...register('phoneNumber')}
              disabled={disabled}
              placeholder="(555) 123-4567"
              error={errors.phoneNumber?.message}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              disabled={disabled}
              placeholder="student@example.com"
              error={errors.email?.message}
            />
          </div>
        </div>
      </div>

      {/* School Information Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">School Information</h3>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="enrollmentDate" className="block text-sm font-medium text-gray-700 mb-1">
              Enrollment Date <span className="text-red-500">*</span>
            </label>
            <Input
              id="enrollmentDate"
              type="date"
              {...register('enrollmentDate')}
              disabled={disabled}
              error={errors.enrollmentDate?.message}
            />
          </div>

          <div>
            <label htmlFor="homeroom" className="block text-sm font-medium text-gray-700 mb-1">
              Homeroom
            </label>
            <Input
              id="homeroom"
              {...register('homeroom')}
              disabled={disabled}
              placeholder="Room 101"
            />
          </div>

          <div>
            <label htmlFor="locker" className="block text-sm font-medium text-gray-700 mb-1">
              Locker Number
            </label>
            <Input
              id="locker"
              {...register('locker')}
              disabled={disabled}
              placeholder="A-123"
            />
          </div>
        </div>
      </div>

      {/* Photo Upload Section */}
      {onPhotoChange && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Photo</h3>
          <FileUpload
            accept="image/*"
            maxSize={5 * 1024 * 1024} // 5MB
            onChange={onPhotoChange}
            disabled={disabled}
            preview={values?.photoUrl}
          />
          <p className="mt-2 text-xs text-gray-500">
            Maximum file size: 5MB. Accepted formats: JPG, PNG, GIF
          </p>
        </div>
      )}

      {/* Additional Notes Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h3>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <Textarea
          id="notes"
          {...register('notes')}
          rows={4}
          disabled={disabled}
          placeholder="Any additional information about the student..."
        />
      </div>
    </div>
  );
}
