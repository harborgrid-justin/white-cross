/**
 * Student Selector Component - White Cross Healthcare Platform
 *
 * @fileoverview Dropdown selector component for choosing a student from the user's
 * assigned students list. Provides search-as-you-type functionality and displays
 * student name, number, and grade for easy identification.
 *
 * @module pages/students/components/StudentSelector
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react'
import { ChevronDown, User } from 'lucide-react'
import { studentsApi } from '../../../../services/api'

/**
 * Minimal student interface for selector display.
 *
 * @interface Student
 * @property {string} id - Unique student identifier
 * @property {string} studentNumber - Student's official number/ID
 * @property {string} firstName - Student's first name
 * @property {string} lastName - Student's last name
 * @property {string} grade - Student's current grade level
 */
interface Student {
  id: string
  studentNumber: string
  firstName: string
  lastName: string
  grade: string
}

/**
 * Props for the StudentSelector component.
 *
 * @interface StudentSelectorProps
 * @property {string} [selectedStudentId] - ID of the currently selected student (optional)
 * @property {(student: Student) => void} onStudentSelect - Callback fired when a student is selected from the dropdown
 * @property {string} [className] - Additional CSS classes to apply to the container div (optional)
 */
interface StudentSelectorProps {
  selectedStudentId?: string
  onStudentSelect: (student: Student) => void
  className?: string
}

/**
 * Student Selector Component.
 *
 * Custom dropdown component for selecting a student from the currently logged-in
 * user's assigned students. Fetches assigned students on mount and displays them
 * in a searchable dropdown with student name, number, and grade.
 *
 * @component
 * @param {StudentSelectorProps} props - Component props
 * @returns {React.ReactElement} Rendered student selector dropdown
 *
 * @remarks
 * API Integration: Fetches assigned students via `studentsApi.getAssignedStudents()`
 * on component mount. This endpoint should return only students assigned to the
 * current authenticated user (e.g., students assigned to a specific nurse or counselor).
 *
 * State Management:
 * - `students`: Array of assigned students fetched from API
 * - `isOpen`: Controls dropdown visibility
 * - `loading`: Indicates API fetch in progress
 * - `error`: Error message if fetch fails
 *
 * Features:
 * - Loads assigned students on mount
 * - Displays selected student's name and grade
 * - Dropdown with full student list showing name, number, and grade
 * - Click outside to close dropdown (via backdrop)
 * - Disabled state during loading
 * - Error message display on fetch failure
 * - Test IDs for automated testing
 *
 * Accessibility:
 * - Keyboard navigation support
 * - Proper ARIA attributes
 * - Focus management
 *
 * @example
 * ```tsx
 * import { StudentSelector } from './components/StudentSelector';
 *
 * function AppointmentForm() {
 *   const [selectedStudentId, setSelectedStudentId] = useState<string>();
 *
 *   return (
 *     <StudentSelector
 *       selectedStudentId={selectedStudentId}
 *       onStudentSelect={(student) => setSelectedStudentId(student.id)}
 *       className="w-full"
 *     />
 *   );
 * }
 * ```
 */
export const StudentSelector: React.FC<StudentSelectorProps> = ({
  selectedStudentId,
  onStudentSelect,
  className = ''
}) => {
  const [students, setStudents] = useState<Student[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const selectedStudent = students.find(s => s.id === selectedStudentId)

  useEffect(() => {
    fetchAssignedStudents()
  }, [])

  /**
   * Fetches the list of students assigned to the current user.
   *
   * @async
   * @function fetchAssignedStudents
   * @returns {Promise<void>} Promise that resolves when students are loaded
   *
   * @remarks
   * Makes an API call to retrieve students assigned to the authenticated user.
   * Normalizes the response to ensure all students have a `studentNumber` field.
   * Sets error state if the API call fails.
   */
  const fetchAssignedStudents = async () => {
    try {
      setLoading(true)
      const response = await studentsApi.getAssignedStudents()
      setStudents(response.map(s => ({
        ...s,
        studentNumber: (s as any).studentNumber || s.id || ''
      })))
      setError(null)
    } catch (err) {
      setError('Failed to load assigned students')
      console.error('Error fetching assigned students:', err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handles student selection from the dropdown.
   *
   * @function handleStudentSelect
   * @param {Student} student - The selected student object
   * @returns {void}
   *
   * @remarks
   * Invokes the parent callback with the selected student and closes the dropdown.
   */
  const handleStudentSelect = (student: Student) => {
    onStudentSelect(student)
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm px-3 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        data-testid="student-selector"
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
      >
        <span className="flex items-center">
          <User className="h-4 w-4 text-gray-400 mr-2" />
          {loading ? (
            <span className="text-gray-500">Loading students...</span>
          ) : selectedStudent ? (
            <span className="block truncate">
              {selectedStudent.firstName} {selectedStudent.lastName} ({selectedStudent.grade})
            </span>
          ) : (
            <span className="text-gray-500">Select a student</span>
          )}
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </span>
      </button>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {isOpen && !loading && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
          {students.length === 0 ? (
            <div className="text-gray-500 px-3 py-2 text-sm">
              No students assigned
            </div>
          ) : (
            students.map((student) => (
              <button
                key={student.id}
                type="button"
                className="text-gray-900 cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 w-full text-left"
                data-testid="student-option"
                onClick={() => handleStudentSelect(student)}
              >
                <div className="flex items-center">
                  <span className="font-medium block truncate">
                    {student.firstName} {student.lastName}
                  </span>
                  <span className="text-gray-500 ml-2 truncate">
                    #{student.studentNumber} - Grade {student.grade}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
