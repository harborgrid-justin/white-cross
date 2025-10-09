/**
 * Student Validation Utilities
 * Centralized validation logic for student data
 */

import { StudentFormData, ValidationErrors, Student } from '@/types/student.types'

export const validateStudentForm = (
  formData: StudentFormData,
  students: Student[],
  selectedStudent: Student | null
): ValidationErrors => {
  const errors: ValidationErrors = {}

  // Required field validations
  if (!formData.studentNumber) {
    errors.studentNumber = 'Student number is required'
  }

  // First name validation
  if (!formData.firstName) {
    errors.firstName = 'First name is required'
  } else if (formData.firstName.length < 2) {
    errors.firstName = 'First name must be at least 2 characters (minimum length not met)'
  } else if (formData.firstName.length > 50) {
    errors.firstName = 'First name cannot exceed 50 characters (maximum length exceeded)'
  }

  // Last name validation
  if (!formData.lastName) {
    errors.lastName = 'Last name is required'
  } else if (formData.lastName.length < 2) {
    errors.lastName = 'Last name must be at least 2 characters (minimum length not met)'
  } else if (formData.lastName.length > 50) {
    errors.lastName = 'Last name cannot exceed 50 characters (maximum length exceeded)'
  }

  // Date of birth validation
  if (!formData.dateOfBirth) {
    errors.dateOfBirth = 'Date of birth is required'
  } else {
    const dob = new Date(formData.dateOfBirth)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (dob > today) {
      errors.dateOfBirth = 'Date of birth cannot be in the future'
    } else {
      const age = Math.floor((today.getTime() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
      if (age < 4 || age > 19) {
        errors.dateOfBirth = 'Student must be between 4 and 19 years old'
      }
    }
  }

  // Grade validation
  if (!formData.grade) {
    errors.grade = 'Grade is required'
  }

  // Emergency contact phone validation
  if (formData.emergencyContactPhone && formData.emergencyContactPhone.trim() !== '') {
    const phoneRegex = /^[\d\s\-\(\)]+$/
    if (!phoneRegex.test(formData.emergencyContactPhone) || formData.emergencyContactPhone.length < 7) {
      errors.emergencyContactPhone = 'Invalid phone number format'
    }
  }

  // Email validation
  if (formData.email && formData.email.trim() !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Invalid email format'
    }
  }

  // Enrollment date validation
  if (formData.enrollmentDate && formData.dateOfBirth) {
    const enrollDate = new Date(formData.enrollmentDate)
    const dob = new Date(formData.dateOfBirth)
    if (enrollDate < dob) {
      errors.enrollmentDate = 'Enrollment date must be after date of birth'
    }
  }

  return errors
}

export const checkDuplicateStudentNumber = (
  studentNumber: string,
  students: Student[],
  selectedStudent: Student | null
): boolean => {
  const existingStudent = students.find(
    s => s.studentNumber === studentNumber && s.id !== selectedStudent?.id
  )
  return !!existingStudent
}

export const scrollToFirstError = (): void => {
  setTimeout(() => {
    const firstError = document.querySelector('[data-testid$="-error"]')
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, 100)
}
