/**
 * WF-COMP-146 | useStudentManagement.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react, @/types/student.types
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants | Key Features: useState, useEffect
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Student Management Hook
 * Centralized state management and business logic for student operations (120 LOC limit)
 */

import { useState, useEffect } from 'react'
import { Student, StudentFormData, EmergencyContactFormData, ValidationErrors, NotificationMessage } from '@/types/student.types'

const DEFAULT_FORM_DATA: StudentFormData = {
  studentNumber: '', firstName: '', lastName: '', dateOfBirth: '', grade: '', gender: 'MALE',
  emergencyContactPhone: '', medicalRecordNum: '', enrollmentDate: '', email: ''
}

export const useStudentManagement = () => {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [formData, setFormData] = useState<StudentFormData>(DEFAULT_FORM_DATA)
  const [emergencyContactData, setEmergencyContactData] = useState<EmergencyContactFormData>({
    firstName: '', phoneNumber: ''
  })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [lastNotification, setLastNotification] = useState<NotificationMessage | null>(null)

  useEffect(() => { loadStudents() }, [])

  const loadStudents = async () => {
    setLoading(true)
    try {
      // Import the studentsApi from the services module
      const { studentsApi } = await import('@/services/api')

      // Fetch all students from the API with pagination
      const response = await studentsApi.getAll({ page: 1, limit: 100 })

      // Extract students data from the API response
      if (response.success && response.data) {
        const studentsData = response.data.students || response.data
        setStudents(Array.isArray(studentsData) ? studentsData : [])
      } else {
        console.error('Failed to load students:', response)
        setStudents([])
      }
    } catch (error) {
      console.error('Error loading students:', error)
      setStudents([])
      // Optionally show error notification to user
      setLastNotification({
        type: 'error',
        message: 'Failed to load students. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData(DEFAULT_FORM_DATA)
    setErrors({})
    setSelectedStudent(null)
  }

  const resetEmergencyContact = () => {
    setEmergencyContactData({ firstName: '', phoneNumber: '' })
  }

  return {
    students, loading, selectedStudent, formData, emergencyContactData, errors, lastNotification,
    setStudents, setSelectedStudent, setFormData, setEmergencyContactData, setErrors,
    setLastNotification, loadStudents, resetForm, resetEmergencyContact
  }
}
