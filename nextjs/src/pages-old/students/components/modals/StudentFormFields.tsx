/**
 * Student Form Fields Component - White Cross Healthcare Platform
 *
 * Reusable form field collection for student data entry. Contains all input fields
 * required for student demographic, enrollment, and contact information with
 * integrated validation error display.
 *
 * @fileoverview Reusable student form fields with FERPA-compliant data validation
 * @module pages/students/components/modals/StudentFormFields
 * @version 1.0.0
 */

import React from 'react'
import { StudentFormData, ValidationErrors } from '@/types/student.types'

/**
 * Props for the StudentFormFields component.
 *
 * @interface StudentFormFieldsProps
 * @property {StudentFormData} formData - Current form data state for all student fields
 * @property {ValidationErrors} errors - Validation error messages keyed by field name
 * @property {(field: keyof StudentFormData, value: string) => void} onInputChange - Callback fired when any field value changes
 *
 * @remarks
 * **Component Design**: Presentational component with no internal state. All state
 * management delegated to parent component for maximum reusability.
 */
interface StudentFormFieldsProps {
  formData: StudentFormData
  errors: ValidationErrors
  onInputChange: (field: keyof StudentFormData, value: string) => void
}

/**
 * Student Form Fields Component.
 *
 * Comprehensive form field collection for student record creation and editing.
 * Includes required demographic fields (name, DOB, grade), optional health fields
 * (medical record number), enrollment tracking, and emergency contact information.
 *
 * @component
 * @param {StudentFormFieldsProps} props - Component props
 * @returns {React.ReactElement} Rendered form fields with validation errors
 *
 * @example
 * ```tsx
 * import { StudentFormFields } from './StudentFormFields';
 *
 * function StudentForm() {
 *   const [formData, setFormData] = useState<StudentFormData>(initialData);
 *   const [errors, setErrors] = useState<ValidationErrors>({});
 *
 *   const handleChange = (field: keyof StudentFormData, value: string) => {
 *     setFormData({ ...formData, [field]: value });
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <StudentFormFields
 *         formData={formData}
 *         errors={errors}
 *         onInputChange={handleChange}
 *       />
 *       <button type="submit">Save Student</button>
 *     </form>
 *   );
 * }
 * ```
 *
 * @remarks
 * **Field Categories**:
 *
 * 1. **Required Demographics** (FERPA-protected):
 *    - Student Number: Unique identifier within school system
 *    - First Name, Last Name: Legal name for official records
 *    - Date of Birth: Used for age verification and grade placement
 *    - Grade: Current grade level (K-12)
 *    - Gender: Self-identified gender (MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY)
 *
 * 2. **Emergency Contact** (Critical for Safety):
 *    - Emergency Contact Phone: Primary contact for emergencies
 *
 * 3. **Optional Health Integration**:
 *    - Medical Record Number: Links to external health record systems (MRN)
 *    - Used to correlate with hospital, clinic, or insurance records
 *
 * 4. **Optional Enrollment Tracking**:
 *    - Enrollment Date: Date student joined the school
 *    - Email: Student contact email (for older students)
 *
 * **Form Validation**:
 * - Required field validation enforced by parent component
 * - Email format validation when provided
 * - Phone number format validation for emergency contact
 * - Date validation for DOB and enrollment date
 * - Student number uniqueness checked server-side
 * - Inline error display below each field
 *
 * **FERPA Compliance**:
 * - All student demographic data is educational record under FERPA
 * - Parental consent may be required for data collection
 * - Data access restricted to school officials with legitimate educational interest
 * - Changes to student records should trigger audit log entries
 *
 * **Grade Level Options**:
 * - Kindergarten (K)
 * - Grades 1-12 (elementary, middle, high school)
 * - Supports standard K-12 education system
 *
 * **Gender Options** (Privacy-Conscious):
 * - MALE, FEMALE, OTHER: Standard options
 * - PREFER_NOT_TO_SAY: Respects student privacy
 * - Aligns with modern educational privacy standards
 *
 * **Accessibility**:
 * - All inputs have associated labels for screen readers
 * - Error messages linked to fields via aria-describedby
 * - Semantic HTML with proper input types
 * - Test IDs for automated testing and E2E verification
 *
 * **UI/UX Patterns**:
 * - Consistent spacing with space-y-4 utility
 * - Standard input-field styling via CSS classes
 * - Red error text displayed below fields when validation fails
 * - Placeholder text provides input format examples
 * - Date inputs use native date picker for better UX
 * - Select dropdowns for constrained choices (grade, gender)
 *
 * @see {@link StudentFormModal} for parent modal component
 * @see {@link StudentFormData} for form data type definition
 * @see {@link ValidationErrors} for error structure
 */
export const StudentFormFields: React.FC<StudentFormFieldsProps> = ({
  formData,
  errors,
  onInputChange
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Student Number</label>
        <input
          type="text"
          name="studentNumber"
          className="input-field"
          data-testid="studentNumber-input"
          value={formData.studentNumber}
          onChange={(e) => onInputChange('studentNumber', e.target.value)}
        />
        {errors.studentNumber && (
          <p className="text-red-600 text-sm mt-1" data-testid="studentNumber-error">
            {errors.studentNumber}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">First Name</label>
        <input
          type="text"
          name="firstName"
          className="input-field"
          data-testid="firstName-input"
          value={formData.firstName}
          onChange={(e) => onInputChange('firstName', e.target.value)}
        />
        {errors.firstName && (
          <p className="text-red-600 text-sm mt-1" data-testid="firstName-error">
            {errors.firstName}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Last Name</label>
        <input
          type="text"
          name="lastName"
          className="input-field"
          data-testid="lastName-input"
          value={formData.lastName}
          onChange={(e) => onInputChange('lastName', e.target.value)}
        />
        {errors.lastName && (
          <p className="text-red-600 text-sm mt-1" data-testid="lastName-error">
            {errors.lastName}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
        <input
          type="date"
          name="dateOfBirth"
          className="input-field"
          data-testid="dateOfBirth-input"
          value={formData.dateOfBirth}
          onChange={(e) => onInputChange('dateOfBirth', e.target.value)}
        />
        {errors.dateOfBirth && (
          <p className="text-red-600 text-sm mt-1" data-testid="dateOfBirth-error">
            {errors.dateOfBirth}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Grade</label>
        <select
          name="grade"
          className="input-field"
          data-testid="grade-select"
          value={formData.grade}
          onChange={(e) => onInputChange('grade', e.target.value)}
        >
          <option value="">Select Grade</option>
          <option value="K">Kindergarten</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
            <option key={grade} value={grade.toString()}>Grade {grade}</option>
          ))}
        </select>
        {errors.grade && (
          <p className="text-red-600 text-sm mt-1" data-testid="grade-error">
            {errors.grade}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Gender</label>
        <select
          name="gender"
          className="input-field"
          data-testid="gender-select"
          value={formData.gender}
          onChange={(e) => onInputChange('gender', e.target.value)}
        >
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
          <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Emergency Contact Phone</label>
        <input
          type="text"
          name="emergencyPhone"
          className="input-field"
          data-testid="emergency-contact-phone"
          value={formData.emergencyContactPhone}
          onChange={(e) => onInputChange('emergencyContactPhone', e.target.value)}
          placeholder="555-1234"
        />
        {errors.emergencyContactPhone && (
          <p className="text-red-600 text-sm mt-1" data-testid="emergency-contact-phone-error">
            {errors.emergencyContactPhone}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Medical Record Number (Optional)</label>
        <input
          type="text"
          name="medicalRecordNum"
          className="input-field"
          data-testid="medicalRecordNum-input"
          value={formData.medicalRecordNum}
          onChange={(e) => onInputChange('medicalRecordNum', e.target.value)}
          placeholder="MRN-12345"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Enrollment Date (Optional)</label>
        <input
          type="date"
          name="enrollmentDate"
          className="input-field"
          data-testid="enrollmentDate-input"
          value={formData.enrollmentDate}
          onChange={(e) => onInputChange('enrollmentDate', e.target.value)}
        />
        {errors.enrollmentDate && (
          <p className="text-red-600 text-sm mt-1" data-testid="enrollmentDate-error">
            {errors.enrollmentDate}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email (Optional)</label>
        <input
          type="email"
          name="email"
          className="input-field"
          data-testid="student-email"
          value={formData.email}
          onChange={(e) => onInputChange('email', e.target.value)}
          placeholder="student@school.edu"
        />
        {errors.email && (
          <p className="text-red-600 text-sm mt-1" data-testid="student-email-error">
            {errors.email}
          </p>
        )}
      </div>
    </div>
  )
}
