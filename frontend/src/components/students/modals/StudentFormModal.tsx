/**
 * Student Form Modal Component
 * Add/Edit student form modal (refactored to use StudentFormFields)
 */

import React from 'react'
import { Student, StudentFormData, ValidationErrors } from '@/types/student.types'
import { StudentFormFields } from './StudentFormFields'

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
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto" data-testid="student-form-modal">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {selectedStudent ? 'Edit Student' : 'Add New Student'}
          </h3>
          <form onSubmit={onSubmit} data-testid="student-form">
            <StudentFormFields
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
            />

            <div className="flex justify-end space-x-3 mt-6">
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
                className="btn-primary"
                data-testid="save-student-button"
              >
                {selectedStudent ? 'Update Student' : 'Save Student'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
