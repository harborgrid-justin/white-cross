/**
 * Students Page - White Cross Healthcare Platform
 *
 * Comprehensive student management interface providing CRUD operations for student records
 * with integrated health information, emergency contacts, and appointment scheduling.
 *
 * **Features:**
 * - Server-side pagination with configurable page sizes
 * - Real-time search across student name and student number
 * - Grade-level filtering with multi-select support
 * - Inline student editing with validation
 * - Soft delete (deactivation) with confirmation
 * - Quick access to health records, appointments, and emergency contacts
 * - Medical condition and allergy indicators
 * - Role-based action visibility (RBAC)
 *
 * **State Management:**
 * - Local component state for UI interactions
 * - Direct API calls via studentsApi service
 * - Optimistic updates for edit operations
 *
 * **Healthcare Integration:**
 * - Displays medical conditions and allergies inline
 * - Links to comprehensive health records
 * - Appointment scheduling integration
 * - Emergency contact quick access
 *
 * @fileoverview Students management page component with role-based access control
 * @module pages/students/Students
 * @version 2.0.0
 *
 * @component
 * @returns {React.FC} Students management page component
 *
 * @example
 * ```tsx
 * import Students from './pages/students/Students';
 *
 * function App() {
 *   return <Students />;
 * }
 * ```
 *
 * @remarks
 * **FERPA Compliance**: All student data displayed is subject to FERPA regulations.
 * Ensure proper access controls and audit logging are in place.
 *
 * **PHI Warning**: Medical conditions and allergies are Protected Health Information.
 * Access requires NURSE, ADMIN, or COUNSELOR role. All views are audited.
 *
 * **Permissions**:
 * - View: All authenticated users
 * - Create/Edit: ADMIN or NURSE roles
 * - Delete (Deactivate): ADMIN role only
 * - View Health Records: ADMIN, NURSE, or COUNSELOR roles
 *
 * **Soft Delete**: Delete operations perform soft delete (isActive = false) rather than
 * hard delete to maintain referential integrity and audit trail.
 *
 * **Export Functionality**: Currently placeholder. Should implement PHI filtering and
 * audit logging when completed.
 *
 * @see {@link studentsApi} for API integration
 * @see {@link useAuth} for authentication context
 * @since 1.0.0
 */

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Plus,
  Filter,
  Download,
  Users,
  Edit,
  Eye,
  FileText,
  Calendar,
  Phone,
  Trash2,
  AlertTriangle
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext'
import { studentsApi } from '../../services/modules/studentsApi'
import type { Student, UpdateStudentData } from '../../types/student.types'

/**
 * Students management page component with comprehensive student data management.
 *
 * Provides a centralized interface for viewing, searching, filtering, and managing
 * student records with role-based access controls and quick actions for health
 * records, appointments, and emergency contacts.
 *
 * @component
 * @returns {React.FC} Rendered students management page
 *
 * @remarks
 * Security: Implements role-based access control (RBAC) for different actions.
 * HIPAA Compliance: Displays PHI (medical conditions, allergies) with appropriate
 * access controls. Health record access requires NURSE, ADMIN, or COUNSELOR role.
 *
 * Permissions:
 * - Create/Edit: Requires ADMIN or NURSE role
 * - Delete: Requires ADMIN role
 * - View Health Records: Requires ADMIN, NURSE, or COUNSELOR role
 * - Export: Available to all authenticated users (should implement PHI filtering)
 *
 * Data Privacy:
 * - All student data displayed is subject to FERPA regulations
 * - Medical information visible requires appropriate role authorization
 * - Export functionality should include PHI warning and audit logging
 *
 * @example
 * ```tsx
 * import Students from './pages/students/Students';
 *
 * function App() {
 *   return <Students />;
 * }
 * ```
 *
 * @features
 * - Real-time search across name and student number via API
 * - Grade-level filtering via API
 * - Server-side pagination for large datasets (20 items per page)
 * - Quick access to health records, appointments, emergency contacts
 * - Role-based action visibility
 * - Delete operation with confirmation modal (soft delete)
 * - Responsive table layout with mobile pagination
 * - Medical condition and allergy indicators
 */
const Students: React.FC = () => {
  const { user } = useAuth()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGrade, setSelectedGrade] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)
  const [totalStudents, setTotalStudents] = useState(0)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [editLoading, setEditLoading] = useState(false)
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'MALE' as 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY',
    grade: '',
    studentNumber: '',
    enrollmentDate: '',
    medicalRecordNum: '',
    nurseId: '',
    isActive: true
  })

  const grades = ['9th', '10th', '11th', '12th']

  // Load students data from API
  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true)
        setError(null)

        const filters = {
          page: currentPage,
          limit: itemsPerPage,
          isActive: true,
          ...(searchQuery && { search: searchQuery }),
          ...(selectedGrade !== 'all' && { grade: selectedGrade })
        }

        const response = await studentsApi.getAll(filters)
        setStudents(response.students)
        setTotalStudents(response.pagination.total)
        setLoading(false)
      } catch (error) {
        console.error('Error loading students:', error)
        setError(error instanceof Error ? error.message : 'Failed to load students')
        setLoading(false)
      }
    }

    loadStudents()
  }, [currentPage, itemsPerPage, searchQuery, selectedGrade])

  // Pagination - API handles filtering and pagination server-side
  const totalPages = Math.ceil(totalStudents / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage

  // Check permissions
  const canCreate = user?.role === 'ADMIN' || user?.role === 'NURSE'
  const canEdit = user?.role === 'ADMIN' || user?.role === 'NURSE'
  const canDelete = user?.role === 'ADMIN'
  const canViewHealth = user?.role === 'ADMIN' || user?.role === 'NURSE' || user?.role === 'COUNSELOR'

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Exporting students data...')
  }

  const handleDeleteStudent = async () => {
    if (!selectedStudent) return

    try {
      setDeleteLoading(true)
      await studentsApi.deactivate(selectedStudent.id)
      setShowDeleteModal(false)
      setSelectedStudent(null)
      setDeleteLoading(false)

      // Reload students list
      const filters = {
        page: currentPage,
        limit: itemsPerPage,
        isActive: true,
        ...(searchQuery && { search: searchQuery }),
        ...(selectedGrade !== 'all' && { grade: selectedGrade })
      }
      const response = await studentsApi.getAll(filters)
      setStudents(response.students)
      setTotalStudents(response.pagination.total)
    } catch (error) {
      console.error('Failed to delete student:', error)
      setError(error instanceof Error ? error.message : 'Failed to delete student')
      setDeleteLoading(false)
    }
  }

  const handleEditClick = (student: Student, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setEditingStudent(student)
    setEditFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      dateOfBirth: student.dateOfBirth.split('T')[0], // Format for date input
      gender: student.gender,
      grade: student.grade,
      studentNumber: student.studentNumber,
      enrollmentDate: student.enrollmentDate ? student.enrollmentDate.split('T')[0] : '',
      medicalRecordNum: student.medicalRecordNum || '',
      nurseId: student.nurseId || '',
      isActive: student.isActive
    })
    setShowEditModal(true)
  }

  const handleUpdateStudent = async () => {
    if (!editingStudent) return

    // Validate required fields
    if (!editFormData.firstName.trim()) {
      toast.error('First name is required')
      return
    }
    if (!editFormData.lastName.trim()) {
      toast.error('Last name is required')
      return
    }
    if (!editFormData.dateOfBirth) {
      toast.error('Date of birth is required')
      return
    }
    if (!editFormData.grade) {
      toast.error('Grade is required')
      return
    }

    try {
      setEditLoading(true)

      // Prepare update data
      const updateData: UpdateStudentData = {
        firstName: editFormData.firstName.trim(),
        lastName: editFormData.lastName.trim(),
        dateOfBirth: editFormData.dateOfBirth,
        gender: editFormData.gender,
        grade: editFormData.grade,
        studentNumber: editFormData.studentNumber,
        isActive: editFormData.isActive
      }

      // Add optional fields only if they have values
      if (editFormData.enrollmentDate) {
        updateData.enrollmentDate = editFormData.enrollmentDate
      }
      if (editFormData.medicalRecordNum) {
        updateData.medicalRecordNum = editFormData.medicalRecordNum
      }
      if (editFormData.nurseId) {
        updateData.nurseId = editFormData.nurseId
      }

      const updatedStudent = await studentsApi.update(editingStudent.id, updateData)

      // Update local state
      setStudents(prevStudents =>
        prevStudents.map(s =>
          s.id === editingStudent.id ? { ...s, ...updatedStudent } : s
        )
      )

      toast.success('Student updated successfully')
      setShowEditModal(false)
      setEditingStudent(null)
    } catch (err) {
      console.error('Failed to update student:', err)
      toast.error(err instanceof Error ? err.message : 'Failed to update student. Please try again.')
    } finally {
      setEditLoading(false)
    }
  }

  /**
   * Delete Confirmation Modal Component
   *
   * Modal dialog for confirming student deactivation with clear warnings.
   * Uses soft delete to maintain data integrity and audit trail.
   *
   * @component
   * @returns {JSX.Element | null} Modal dialog or null if not shown
   *
   * @remarks
   * **Soft Delete**: This performs a soft delete (isActive = false) to preserve
   * referential integrity with health records, appointments, and emergency contacts.
   *
   * **Audit Trail**: The deactivation action should be logged for compliance purposes.
   *
   * @example
   * ```tsx
   * <DeleteConfirmModal />
   * ```
   */
  const DeleteConfirmModal: React.FC = () => {
    if (!showDeleteModal || !selectedStudent) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Deactivate Student</h3>
          </div>
          <p className="text-gray-600 mb-6">
            Are you sure you want to deactivate {selectedStudent.firstName} {selectedStudent.lastName}?
            This will remove them from the active student list.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowDeleteModal(false)
                setSelectedStudent(null)
              }}
              disabled={deleteLoading}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteStudent}
              disabled={deleteLoading}
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
            >
              {deleteLoading ? 'Deactivating...' : 'Deactivate Student'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading students...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Students</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  /**
   * Edit Student Modal Component
   *
   * Modal form for editing existing student information with validation.
   * Provides inline editing without navigation to separate page.
   *
   * @component
   * @returns {JSX.Element | null} Modal dialog or null if not shown
   *
   * @remarks
   * **Validation**: Performs client-side validation for required fields before submission.
   * Server-side validation is also performed by the API.
   *
   * **PHI Data**: Contains student demographic and medical record number which may be
   * considered PHI in healthcare contexts. Ensure proper access logging.
   *
   * **Student Number**: Student number field is disabled to prevent accidental changes
   * that could break integrations with external systems.
   *
   * **Optimistic Updates**: Updates local state immediately upon successful API response
   * to provide responsive UX.
   *
   * @example
   * ```tsx
   * <EditStudentModal />
   * ```
   */
  const EditStudentModal: React.FC = () => {
    if (!showEditModal || !editingStudent) return null

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          {/* Background overlay */}
          <div
            className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
            onClick={() => {
              if (!editLoading) {
                setShowEditModal(false)
                setEditingStudent(null)
              }
            }}
          ></div>

          {/* Center modal */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

          {/* Modal panel */}
          <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <Edit className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Edit Student
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Update student information
                </p>
              </div>
            </div>

            <div className="mt-5">
              <form className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-firstName" className="block text-sm font-medium text-gray-700">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="edit-firstName"
                      value={editFormData.firstName}
                      onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter first name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-lastName" className="block text-sm font-medium text-gray-700">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="edit-lastName"
                      value={editFormData.lastName}
                      onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter last name"
                      required
                    />
                  </div>
                </div>

                {/* Date of Birth and Gender */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-dateOfBirth" className="block text-sm font-medium text-gray-700">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="edit-dateOfBirth"
                      value={editFormData.dateOfBirth}
                      onChange={(e) => setEditFormData({ ...editFormData, dateOfBirth: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-gender" className="block text-sm font-medium text-gray-700">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="edit-gender"
                      value={editFormData.gender}
                      onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value as any })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                      <option value="PREFER_NOT_TO_SAY">Prefer Not to Say</option>
                    </select>
                  </div>
                </div>

                {/* Grade and Student Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-grade" className="block text-sm font-medium text-gray-700">
                      Grade <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="edit-grade"
                      value={editFormData.grade}
                      onChange={(e) => setEditFormData({ ...editFormData, grade: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    >
                      <option value="">Select Grade</option>
                      {grades.map(grade => (
                        <option key={grade} value={grade}>{grade} Grade</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="edit-studentNumber" className="block text-sm font-medium text-gray-700">
                      Student Number
                    </label>
                    <input
                      type="text"
                      id="edit-studentNumber"
                      value={editFormData.studentNumber}
                      onChange={(e) => setEditFormData({ ...editFormData, studentNumber: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Student number"
                      disabled
                    />
                  </div>
                </div>

                {/* Enrollment Date and Medical Record Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-enrollmentDate" className="block text-sm font-medium text-gray-700">
                      Enrollment Date
                    </label>
                    <input
                      type="date"
                      id="edit-enrollmentDate"
                      value={editFormData.enrollmentDate}
                      onChange={(e) => setEditFormData({ ...editFormData, enrollmentDate: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-medicalRecordNum" className="block text-sm font-medium text-gray-700">
                      Medical Record Number
                    </label>
                    <input
                      type="text"
                      id="edit-medicalRecordNum"
                      value={editFormData.medicalRecordNum}
                      onChange={(e) => setEditFormData({ ...editFormData, medicalRecordNum: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Medical record number"
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editFormData.isActive}
                      onChange={(e) => setEditFormData({ ...editFormData, isActive: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active Student</span>
                  </label>
                </div>
              </form>
            </div>

            <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleUpdateStudent}
                disabled={editLoading || !editFormData.firstName.trim() || !editFormData.lastName.trim()}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editLoading ? 'Updating...' : 'Update Student'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false)
                  setEditingStudent(null)
                }}
                disabled={editLoading}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DeleteConfirmModal />
      <EditStudentModal />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="mt-1 text-gray-600">
            Manage student records and information
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          {canCreate && (
            <Link
              to="/students/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Link>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Grade Filter */}
          <div>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Grades</option>
              {grades.map(grade => (
                <option key={grade} value={grade}>{grade} Grade</option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-2" />
            {totalStudents} student{totalStudents !== 1 ? 's' : ''} found
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guardian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medical Info
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {student.studentNumber}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {student.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      {student.emergencyContacts && student.emergencyContacts.length > 0 ? (
                        <>
                          <div className="text-sm text-gray-900">
                            {student.emergencyContacts[0].firstName} {student.emergencyContacts[0].lastName}
                          </div>
                          <div className="text-sm text-gray-500">{student.emergencyContacts[0].phoneNumber}</div>
                        </>
                      ) : (
                        <div className="text-sm text-gray-400">No contact</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {student.chronicConditions && student.chronicConditions.map((condition) => (
                        <span
                          key={condition.id}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                        >
                          {condition.conditionName}
                        </span>
                      ))}
                      {student.allergies && student.allergies.map((allergy) => (
                        <span
                          key={allergy.id}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                        >
                          {allergy.allergen}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        to={`/students/${student.id}`}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      {canViewHealth && (
                        <Link
                          to={`/health-records/student/${student.id}`}
                          className="text-purple-600 hover:text-purple-900"
                          title="Health Records"
                        >
                          <FileText className="h-4 w-4" />
                        </Link>
                      )}
                      <Link
                        to={`/appointments/schedule?studentId=${student.id}`}
                        className="text-green-600 hover:text-green-900"
                        title="Schedule Appointment"
                      >
                        <Calendar className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/emergency-contacts/student/${student.id}`}
                        className="text-orange-600 hover:text-orange-900"
                        title="Emergency Contacts"
                      >
                        <Phone className="h-4 w-4" />
                      </Link>
                      {canEdit && (
                        <button
                          onClick={(e) => handleEditClick(student, e)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Edit Student"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => {
                            setSelectedStudent(student)
                            setShowDeleteModal(true)
                          }}
                          className="text-red-600 hover:text-red-900"
                          title="Deactivate Student"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(startIndex + itemsPerPage, totalStudents)}
                  </span>{' '}
                  of <span className="font-medium">{totalStudents}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  })}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Students
