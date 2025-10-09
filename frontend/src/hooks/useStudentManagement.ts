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
    setTimeout(() => {
      const mockStudents: Student[] = [
        { id: '0', studentNumber: 'STU100', firstName: 'John', lastName: 'Doe', dateOfBirth: '2010-05-15',
          grade: '8', gender: 'MALE', isActive: true,
          emergencyContacts: [{ id: '0', firstName: 'Jane', lastName: 'Doe', relationship: 'Mother',
            phoneNumber: '(555) 000-0000', isPrimary: true }],
          allergies: [], medications: [{ id: '0', name: 'Daily Vitamin', dosage: '1 tablet' }] },
        { id: '1', studentNumber: 'STU001', firstName: 'Emma', lastName: 'Wilson', dateOfBirth: '2010-03-15',
          grade: '8', gender: 'FEMALE', isActive: true,
          emergencyContacts: [{ id: '1', firstName: 'Jennifer', lastName: 'Wilson', relationship: 'Mother',
            phoneNumber: '(555) 123-4567', isPrimary: true }],
          allergies: [{ id: '1', allergen: 'Peanuts', severity: 'LIFE_THREATENING' }],
          medications: [{ id: '1', name: 'EpiPen', dosage: '0.3mg' }] },
        { id: '2', studentNumber: 'STU002', firstName: 'Liam', lastName: 'Davis', dateOfBirth: '2011-07-22',
          grade: '7', gender: 'MALE', isActive: true,
          emergencyContacts: [{ id: '2', firstName: 'Michael', lastName: 'Davis', relationship: 'Father',
            phoneNumber: '(555) 234-5678', isPrimary: true }],
          allergies: [], medications: [{ id: '2', name: 'Albuterol Inhaler', dosage: '90mcg' }] },
        { id: '3', studentNumber: 'STU003', firstName: 'Sophia', lastName: 'Miller', dateOfBirth: '2009-11-08',
          grade: '9', gender: 'FEMALE', isActive: true,
          emergencyContacts: [{ id: '3', firstName: 'Lisa', lastName: 'Miller', relationship: 'Mother',
            phoneNumber: '(555) 345-6789', isPrimary: true }],
          allergies: [], medications: [] },
        { id: '100', studentNumber: 'STU100-ARCHIVED', firstName: 'Archived', lastName: 'Student1',
          dateOfBirth: '2010-01-01', grade: '8', gender: 'MALE', isActive: false,
          emergencyContacts: [{ id: '100', firstName: 'Parent', lastName: 'Student1', relationship: 'Parent',
            phoneNumber: '(555) 100-0000', isPrimary: true }],
          allergies: [], medications: [] },
        { id: '101', studentNumber: 'STU101-ARCHIVED', firstName: 'Archived', lastName: 'Student2',
          dateOfBirth: '2011-02-02', grade: '7', gender: 'FEMALE', isActive: false,
          emergencyContacts: [{ id: '101', firstName: 'Parent', lastName: 'Student2', relationship: 'Parent',
            phoneNumber: '(555) 101-0000', isPrimary: true }],
          allergies: [], medications: [] },
        ...Array.from({ length: 32 }, (_, i) => ({
          id: String(i + 4), studentNumber: `STU${String(i + 4).padStart(3, '0')}`,
          firstName: ['Oliver', 'Charlotte', 'William', 'Amelia', 'James', 'Ava', 'Benjamin', 'Isabella'][i % 8],
          lastName: ['Brown', 'Garcia', 'Rodriguez', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Moore'][i % 8],
          dateOfBirth: `20${String(Math.floor(Math.random() * 5) + 8).padStart(2, '0')}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-15`,
          grade: String(Math.floor(Math.random() * 12) + 1),
          gender: (['MALE', 'FEMALE'][i % 2] as 'MALE' | 'FEMALE'),
          isActive: true,
          emergencyContacts: [{
            id: String(i + 4), firstName: 'Parent',
            lastName: ['Brown', 'Garcia', 'Rodriguez', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Moore'][i % 8],
            relationship: 'Parent',
            phoneNumber: `(555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
            isPrimary: true
          }],
          allergies: [], medications: []
        }))
      ]
      setStudents(mockStudents)
      setLoading(false)
    }, 500)
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
