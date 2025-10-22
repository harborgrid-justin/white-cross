/**
 * WF-COMP-098 | StudentFormModal.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ./StudentFormFields | Dependencies: react, @/types/student.types, ./StudentFormFields
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants | Key Features: functional component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

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
