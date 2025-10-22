/**
 * WF-COMP-097 | StudentFormFields.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react, @/types/student.types
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants | Key Features: functional component, arrow component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Student Form Fields Component
 * Reusable form fields for student data entry
 */

import React from 'react'
import { StudentFormData, ValidationErrors } from '@/types/student.types'

interface StudentFormFieldsProps {
  formData: StudentFormData
  errors: ValidationErrors
  onInputChange: (field: keyof StudentFormData, value: string) => void
}

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
