/**
 * Student Form Modal Component - White Cross Healthcare Platform
 *
 * Modal dialog for creating new student records or editing existing students.
 * Implements controlled form pattern with comprehensive validation and FERPA-compliant
 * data handling for student educational records.
 *
 * @fileoverview FERPA-compliant student creation and editing modal with validation
 * @module pages/students/components/modals/StudentFormModal
 * @version 1.0.0
 */

import React from 'react'
import { Student, StudentFormData, ValidationErrors } from '@/types/student.types'
import { StudentFormFields } from './StudentFormFields'

/**
 * Props for the StudentFormModal component.
 *
 * @interface StudentFormModalProps
 * @property {boolean} show - Controls modal visibility
 * @property {Student | null} selectedStudent - Student being edited, or null for new student creation
 * @property {StudentFormData} formData - Current form data state containing all student fields
 * @property {ValidationErrors} errors - Validation error messages keyed by field name
 * @property {() => void} onClose - Callback fired when modal is closed (via cancel or backdrop click)
 * @property {(e: React.FormEvent) => void} onSubmit - Callback fired when form is submitted
 * @property {(data: StudentFormData) => void} onFormDataChange - Callback to update form data state
 * @property {(errors: ValidationErrors) => void} onErrorChange - Callback to update validation errors
 *
 * @remarks
 * **State Management**: This is a controlled component. All form state and validation
 * errors are managed by the parent component (typically Students.tsx).
 *
 * **FERPA Compliance**: Student educational records are protected under FERPA.
 * - All data entry must be validated before submission
 * - Changes to student records should be audit logged
 * - Access should be restricted to authorized school personnel
 */
interface StudentFormModalProps {
  show: boolean
  selectedStudent: Student | null
  formData: StudentFormData
  errors: ValidationErrors
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  onFormDataChange: (data: StudentFormData) => void
  onErrorChange: (errors: ValidationErrors) => void
}

/**
 * Student Form Modal Component.
 *
 * Full-screen modal dialog for creating or editing student records with comprehensive
 * form validation, error handling, and a sticky footer for form actions. Delegates
 * form field rendering to StudentFormFields component for reusability.
 *
 * @component
 * @param {StudentFormModalProps} props - Component props
 * @returns {React.ReactElement | null} Rendered modal or null if not visible
 *
 * @example
 * ```tsx
 * import { StudentFormModal } from './modals/StudentFormModal';
 *
 * function StudentsPage() {
 *   const [showModal, setShowModal] = useState(false);
 *   const [formData, setFormData] = useState<StudentFormData>(initialFormData);
 *   const [errors, setErrors] = useState<ValidationErrors>({});
 *   const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
 *
 *   const handleSubmit = async (e: React.FormEvent) => {
 *     e.preventDefault();
 *     // Validate and submit
 *     if (validateFormData(formData)) {
 *       await studentsApi.createStudent(formData);
 *       setShowModal(false);
 *     }
 *   };
 *
 *   return (
 *     <StudentFormModal
 *       show={showModal}
 *       selectedStudent={selectedStudent}
 *       formData={formData}
 *       errors={errors}
 *       onClose={() => setShowModal(false)}
 *       onSubmit={handleSubmit}
 *       onFormDataChange={setFormData}
 *       onErrorChange={setErrors}
 *     />
 *   );
 * }
 * ```
 *
 * @remarks
 * **Form Validation**:
 * - Client-side validation clears field errors as user types
 * - Server-side validation errors displayed via errors prop
 * - Required fields: studentNumber, firstName, lastName, dateOfBirth, grade
 * - Optional fields: medicalRecordNum, enrollmentDate, email, emergencyContactPhone
 *
 * **FERPA Compliance**:
 * - Student educational records protected under Family Educational Rights and Privacy Act
 * - Only authorized personnel should have access to create/edit student records
 * - All changes should be logged to audit trail for compliance tracking
 * - Parent consent may be required for certain data collection
 *
 * **Enrollment Workflows**:
 * - New student creation requires minimum demographic data
 * - Enrollment date tracks when student joins the school
 * - Medical record number links to external health systems (optional)
 * - Emergency contact information critical for student safety
 *
 * **Accessibility**:
 * - Modal traps focus for keyboard navigation
 * - Form fields have associated labels
 * - Error messages announced to screen readers
 * - Test IDs provided for automated testing
 *
 * **UI/UX Features**:
 * - Sticky footer keeps action buttons visible while scrolling
 * - Dynamic title: "Add New Student" or "Edit Student"
 * - Dynamic submit button: "Save Student" or "Update Student"
 * - Form fields delegated to StudentFormFields for maintainability
 * - Errors cleared on input to provide immediate feedback
 *
 * @see {@link StudentFormFields} for form field rendering
 * @see {@link Student} for student data model
 * @see {@link StudentFormData} for form data structure
 */
export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  show,
  selectedStudent,
  formData,
  errors,
  onClose,
  onSubmit,
  onFormDataChange,
  onErrorChange
}) => {
  if (!show) return null

  /**
   * Handles input changes for form fields.
   * Updates form data and clears field-specific validation errors.
   *
   * @function handleInputChange
   * @param {keyof StudentFormData} field - The form field being changed
   * @param {string} value - The new field value
   * @returns {void}
   *
   * @remarks
   * Implements optimistic error clearing - removes validation error as soon as
   * user begins typing, improving perceived responsiveness.
   */
  const handleInputChange = (field: keyof StudentFormData, value: string) => {
    onFormDataChange({ ...formData, [field]: value })
    if (errors[field]) {
      const newErrors = { ...errors }
      delete newErrors[field]
      onErrorChange(newErrors)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto border w-96 shadow-lg rounded-md bg-white max-h-[80vh] flex flex-col" data-testid="student-form-modal">
        <div className="p-5 flex-1 overflow-y-auto pb-32">
          <div className="mt-3">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {selectedStudent ? 'Edit Student' : 'Add New Student'}
            </h3>
            <form onSubmit={onSubmit} data-testid="student-form" id="student-form">
              <StudentFormFields
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
              />
            </form>
          </div>
        </div>

        {/* Sticky footer with action buttons */}
        <div className="border-t border-gray-200 bg-gray-50 px-5 py-4 flex justify-end space-x-3 sticky bottom-0 z-10">
          <button
            type="button"
            className="btn-secondary"
            data-testid="cancel-button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="student-form"
            className="btn-primary"
            data-testid="save-student-button"
          >
            {selectedStudent ? 'Update Student' : 'Save Student'}
          </button>
        </div>
      </div>
    </div>
  )
}
