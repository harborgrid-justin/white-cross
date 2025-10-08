import React, { useState, useEffect } from 'react'
import { ChevronDown, User } from 'lucide-react'
import { studentsApi } from '../services/api'

interface Student {
  id: string
  studentNumber: string
  firstName: string
  lastName: string
  grade: string
}

interface StudentSelectorProps {
  selectedStudentId?: string
  onStudentSelect: (student: Student) => void
  className?: string
}

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