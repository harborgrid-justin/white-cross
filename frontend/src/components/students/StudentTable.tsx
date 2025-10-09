/**
 * Student Table Component
 * Displays student data in a tabular format with action buttons
 */

import React from 'react'
import { Edit, Trash2, AlertTriangle, Pill } from 'lucide-react'
import { Student } from '@/types/student.types'

interface StudentTableProps {
  students: Student[]
  loading: boolean
  showArchived: boolean
  selectedStudents: string[]
  canEdit: boolean
  canDelete: boolean
  onViewDetails: (student: Student) => void
  onEdit: (student: Student, e: React.MouseEvent) => void
  onDelete: (studentId: string, e: React.MouseEvent) => void
  onRestore: (studentId: string, e: React.MouseEvent) => void
  onSelectStudent: (studentId: string) => void
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  loading,
  showArchived,
  selectedStudents,
  canEdit,
  canDelete,
  onViewDetails,
  onEdit,
  onDelete,
  onRestore,
  onSelectStudent
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8" data-testid="loading-spinner">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div data-testid={showArchived ? "archived-students-list" : undefined}>
      <div className="overflow-x-auto overflow-y-visible">
        <table className="min-w-full divide-y divide-gray-200" data-testid="student-table">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Select
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID/Grade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Medical Alerts
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Emergency Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8" data-testid="no-results-message">
                  <p className="text-gray-500">No students found</p>
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  data-testid={showArchived ? "archived-student-row" : "student-row"}
                  onClick={() => onViewDetails(student)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onViewDetails(student)
                    }
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      data-testid="student-checkbox"
                      className="rounded"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => onSelectStudent(student.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-700">
                          {student.firstName[0]}{student.lastName[0]}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900" data-testid="student-name">
                          <span data-testid="student-firstName">{student.firstName}</span>{' '}
                          <span data-testid="student-lastName">{student.lastName}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          DOB: {new Date(student.dateOfBirth).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.studentNumber}</div>
                    <div className="text-sm text-gray-500" data-testid="student-grade">Grade {student.grade}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {student.allergies.length > 0 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800" data-testid="allergy-indicator">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Allergies
                        </span>
                      )}
                      {student.medications.length > 0 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800" data-testid="medication-indicator">
                          <Pill className="h-3 w-3 mr-1" />
                          Medications
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.emergencyContacts.find(c => c.isPrimary) && (
                      <div className="text-sm text-gray-900">
                        {student.emergencyContacts.find(c => c.isPrimary)?.firstName}{' '}
                        {student.emergencyContacts.find(c => c.isPrimary)?.lastName}
                        <div className="text-xs text-gray-500">
                          {student.emergencyContacts.find(c => c.isPrimary)?.phoneNumber}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      student.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {student.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                    {showArchived ? (
                      <button
                        className="text-green-600 hover:text-green-900 inline-flex items-center"
                        data-testid="restore-student-button"
                        onClick={(e) => onRestore(student.id, e)}
                      >
                        Restore
                      </button>
                    ) : (
                      <div className="flex items-center justify-end gap-2 min-w-[80px]">
                        {canEdit && (
                          <button
                            className="text-blue-600 hover:text-blue-900 p-1"
                            data-testid="edit-student-button"
                            onClick={(e) => onEdit(student, e)}
                            aria-label="Edit student"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            className="text-red-600 hover:text-red-900 p-1"
                            data-testid="delete-student-button"
                            onClick={(e) => onDelete(student.id, e)}
                            aria-label="Delete student"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
