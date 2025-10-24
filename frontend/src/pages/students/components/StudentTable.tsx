/**
 * Student Table Component - Tabular Student Data Display
 *
 * @fileoverview Comprehensive student table with role-based actions and medical alerts
 * @module pages/students/components/StudentTable
 * @version 1.0.0
 */

import React from 'react'
import { Edit, Trash2, AlertTriangle, Pill } from 'lucide-react'
import { Student, getPrimaryContact } from '@/types/student.types'

/**
 * Props for the Student Table component.
 *
 * @interface StudentTableProps
 * @property {Student[]} students - Array of student records to display
 * @property {boolean} loading - Loading state indicator
 * @property {boolean} showArchived - Whether displaying archived students
 * @property {string[]} selectedStudents - Array of selected student IDs
 * @property {boolean} canEdit - Whether current user can edit students
 * @property {boolean} canDelete - Whether current user can delete students
 * @property {(student: Student) => void} onViewDetails - Callback when student row is clicked
 * @property {(student: Student, e: React.MouseEvent) => void} onEdit - Callback for edit action
 * @property {(studentId: string, e: React.MouseEvent) => void} onDelete - Callback for delete action
 * @property {(studentId: string, e: React.MouseEvent) => void} onRestore - Callback for restore action
 * @property {(studentId: string) => void} onSelectStudent - Callback for student selection
 *
 * @remarks
 * Security: Role-based actions controlled by canEdit and canDelete props.
 * HIPAA Compliance: Medical alerts (allergies, medications) are displayed with visual indicators.
 */
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

/**
 * Student Table Component.
 *
 * Displays student data in a comprehensive table format with medical alerts,
 * emergency contacts, and role-based action buttons.
 *
 * @component
 * @param {StudentTableProps} props - Component props
 * @returns {React.ReactElement} Rendered table component
 *
 * @remarks
 * HIPAA Compliance:
 * - Displays Protected Health Information (allergies, medications)
 * - Medical alerts shown with color-coded badges
 * - All PHI visibility should be logged
 *
 * Accessibility:
 * - Keyboard navigation support (Enter/Space to view details)
 * - ARIA labels on action buttons
 * - Proper table semantics for screen readers
 * - Test IDs for automated testing
 *
 * Features:
 * - Avatar initials for quick identification
 * - Date of birth display
 * - Medical alert badges (allergies, medications)
 * - Emergency contact quick view
 * - Active/Inactive status indicators
 * - Bulk selection checkboxes
 * - Clickable rows for detail view
 * - Edit/Delete actions with event propagation control
 * - Restore functionality for archived students
 * - Loading spinner during data fetch
 * - Empty state message
 *
 * @example
 * ```tsx
 * import { StudentTable } from './components/StudentTable';
 *
 * function StudentsList() {
 *   const { students, loading } = useStudents();
 *   const { user } = useAuth();
 *   const [selected, setSelected] = useState<string[]>([]);
 *
 *   return (
 *     <StudentTable
 *       students={students}
 *       loading={loading}
 *       showArchived={false}
 *       selectedStudents={selected}
 *       canEdit={user.role === 'ADMIN' || user.role === 'NURSE'}
 *       canDelete={user.role === 'ADMIN'}
 *       onViewDetails={(student) => navigate(`/students/${student.id}`)}
 *       onEdit={(student, e) => {
 *         e.stopPropagation();
 *         openEditModal(student);
 *       }}
 *       onDelete={(id, e) => {
 *         e.stopPropagation();
 *         confirmDelete(id);
 *       }}
 *       onRestore={(id) => restoreStudent(id)}
 *       onSelectStudent={(id) => toggleSelection(id)}
 *     />
 *   );
 * }
 * ```
 */
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
                    {student.emergencyContacts && getPrimaryContact(student.emergencyContacts) && (
                      <div className="text-sm text-gray-900">
                        {getPrimaryContact(student.emergencyContacts)?.firstName}{' '}
                        {getPrimaryContact(student.emergencyContacts)?.lastName}
                        <div className="text-xs text-gray-500">
                          {getPrimaryContact(student.emergencyContacts)?.phoneNumber}
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

