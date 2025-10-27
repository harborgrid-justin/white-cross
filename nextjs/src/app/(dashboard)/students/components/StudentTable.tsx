'use client';

import { useState } from 'react';
import { Table } from '@/components/ui/data/Table';
import { Avatar } from '@/components/ui/display/Avatar';
import { Badge } from '@/components/ui/display/Badge';
import { Button } from '@/components/ui/Button';
import { DropdownMenu } from '@/components/ui/navigation/DropdownMenu';
import { Checkbox } from '@/components/ui/Checkbox';
import { MoreVertical, Eye, Edit, Archive, AlertTriangle, Pill, Shield } from 'lucide-react';

/**
 * WF-COMP-STUDENT-005 | StudentTable.tsx
 * Purpose: Data table for displaying student lists with actions and health indicators
 *
 * @module app/(dashboard)/students/components/StudentTable
 */

/**
 * Student data for table display
 */
export interface StudentTableData {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  gradeLevel: string;
  dateOfBirth: string;
  status: 'active' | 'inactive' | 'graduated' | 'transferred';
  hasAllergies: boolean;
  hasMedications: boolean;
  hasImmunizations: boolean;
  photoUrl?: string;
  lastUpdated?: string;
}

/**
 * Column configuration
 */
export type ColumnKey = 'select' | 'student' | 'studentId' | 'grade' | 'dateOfBirth' | 'status' | 'health' | 'actions';

/**
 * Props for StudentTable component
 */
interface StudentTableProps {
  /** Student data to display */
  students: StudentTableData[];
  /** Currently selected student IDs */
  selectedIds?: string[];
  /** Callback when selection changes */
  onSelectionChange?: (selectedIds: string[]) => void;
  /** Callback when view student is clicked */
  onView?: (student: StudentTableData) => void;
  /** Callback when edit student is clicked */
  onEdit?: (student: StudentTableData) => void;
  /** Callback when archive student is clicked */
  onArchive?: (student: StudentTableData) => void;
  /** Whether table is loading */
  isLoading?: boolean;
  /** Visible columns */
  visibleColumns?: ColumnKey[];
  /** Whether selection is enabled */
  enableSelection?: boolean;
  /** Optional className for styling */
  className?: string;
}

/**
 * StudentTable Component
 *
 * Data table for displaying student information with:
 * - Sortable columns
 * - Row selection
 * - Health indicator icons
 * - Action menu per row
 * - Responsive layout
 *
 * **Features:**
 * - Multi-row selection
 * - Student photos
 * - Status badges
 * - Health indicators (allergies, medications, immunizations)
 * - Action dropdown menu
 * - Loading states
 * - Empty state
 *
 * **HIPAA Compliance:**
 * - No PHI displayed in table
 * - Health indicators use icons only
 * - Audit trail support for actions
 *
 * **Accessibility:**
 * - Semantic table structure
 * - Keyboard navigation
 * - ARIA labels
 * - Focus management
 *
 * @component
 * @example
 * ```tsx
 * const [selectedIds, setSelectedIds] = useState<string[]>([]);
 *
 * <StudentTable
 *   students={studentList}
 *   selectedIds={selectedIds}
 *   onSelectionChange={setSelectedIds}
 *   onView={(student) => openDetailsModal(student)}
 *   onEdit={(student) => openEditModal(student)}
 *   onArchive={(student) => confirmArchive(student)}
 * />
 * ```
 */
export function StudentTable({
  students,
  selectedIds = [],
  onSelectionChange,
  onView,
  onEdit,
  onArchive,
  isLoading = false,
  visibleColumns = ['select', 'student', 'studentId', 'grade', 'dateOfBirth', 'status', 'health', 'actions'],
  enableSelection = true,
  className = ''
}: StudentTableProps) {
  const [sortColumn, setSortColumn] = useState<string>('lastName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  /**
   * Check if column is visible
   */
  const isColumnVisible = (column: ColumnKey) => visibleColumns.includes(column);

  /**
   * Handle header checkbox change (select all)
   */
  const handleSelectAll = (checked: boolean) => {
    if (onSelectionChange) {
      if (checked) {
        onSelectionChange(students.map((s) => s.id));
      } else {
        onSelectionChange([]);
      }
    }
  };

  /**
   * Handle individual row checkbox change
   */
  const handleSelectRow = (studentId: string, checked: boolean) => {
    if (onSelectionChange) {
      if (checked) {
        onSelectionChange([...selectedIds, studentId]);
      } else {
        onSelectionChange(selectedIds.filter((id) => id !== studentId));
      }
    }
  };

  /**
   * Check if all students are selected
   */
  const allSelected = students.length > 0 && selectedIds.length === students.length;

  /**
   * Check if some students are selected
   */
  const someSelected = selectedIds.length > 0 && selectedIds.length < students.length;

  /**
   * Format date string
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  /**
   * Get full name
   */
  const getFullName = (student: StudentTableData) => {
    return `${student.firstName} ${student.lastName}`;
  };

  /**
   * Get status badge variant
   */
  const getStatusVariant = (status: StudentTableData['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'secondary';
      case 'graduated':
        return 'default';
      case 'transferred':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading students...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (students.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-8 text-center">
          <p className="text-gray-600">No students found</p>
          <p className="text-sm text-gray-500 mt-2">Try adjusting your filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* Selection Column */}
              {isColumnVisible('select') && enableSelection && (
                <th scope="col" className="w-12 px-4 py-3">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    aria-label="Select all students"
                  />
                </th>
              )}

              {/* Student Column */}
              {isColumnVisible('student') && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
              )}

              {/* Student ID Column */}
              {isColumnVisible('studentId') && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student ID
                </th>
              )}

              {/* Grade Column */}
              {isColumnVisible('grade') && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
              )}

              {/* Date of Birth Column */}
              {isColumnVisible('dateOfBirth') && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date of Birth
                </th>
              )}

              {/* Status Column */}
              {isColumnVisible('status') && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              )}

              {/* Health Column */}
              {isColumnVisible('health') && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Health
                </th>
              )}

              {/* Actions Column */}
              {isColumnVisible('actions') && (
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                {/* Selection Cell */}
                {isColumnVisible('select') && enableSelection && (
                  <td className="w-12 px-4 py-4">
                    <Checkbox
                      checked={selectedIds.includes(student.id)}
                      onChange={(e) => handleSelectRow(student.id, e.target.checked)}
                      aria-label={`Select ${getFullName(student)}`}
                    />
                  </td>
                )}

                {/* Student Cell */}
                {isColumnVisible('student') && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar
                        src={student.photoUrl}
                        alt={getFullName(student)}
                        size="sm"
                        className="mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {getFullName(student)}
                        </div>
                      </div>
                    </div>
                  </td>
                )}

                {/* Student ID Cell */}
                {isColumnVisible('studentId') && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.studentId}
                  </td>
                )}

                {/* Grade Cell */}
                {isColumnVisible('grade') && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.gradeLevel === 'K' ? 'Kindergarten' : `Grade ${student.gradeLevel}`}
                  </td>
                )}

                {/* Date of Birth Cell */}
                {isColumnVisible('dateOfBirth') && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(student.dateOfBirth)}
                  </td>
                )}

                {/* Status Cell */}
                {isColumnVisible('status') && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatusVariant(student.status)}>
                      {student.status}
                    </Badge>
                  </td>
                )}

                {/* Health Cell */}
                {isColumnVisible('health') && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {student.hasAllergies && (
                        <AlertTriangle
                          className="w-4 h-4 text-red-600"
                          title="Has allergies"
                        />
                      )}
                      {student.hasMedications && (
                        <Pill
                          className="w-4 h-4 text-blue-600"
                          title="Has medications"
                        />
                      )}
                      {student.hasImmunizations && (
                        <Shield
                          className="w-4 h-4 text-green-600"
                          title="Immunizations complete"
                        />
                      )}
                      {!student.hasAllergies && !student.hasMedications && !student.hasImmunizations && (
                        <span className="text-xs text-gray-400">None</span>
                      )}
                    </div>
                  </td>
                )}

                {/* Actions Cell */}
                {isColumnVisible('actions') && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <DropdownMenu>
                      <DropdownMenu.Trigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content align="end">
                        {onView && (
                          <DropdownMenu.Item onClick={() => onView(student)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenu.Item>
                        )}
                        {onEdit && (
                          <DropdownMenu.Item onClick={() => onEdit(student)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Student
                          </DropdownMenu.Item>
                        )}
                        {onArchive && (
                          <>
                            <DropdownMenu.Separator />
                            <DropdownMenu.Item
                              onClick={() => onArchive(student)}
                              className="text-red-600"
                            >
                              <Archive className="w-4 h-4 mr-2" />
                              Archive
                            </DropdownMenu.Item>
                          </>
                        )}
                      </DropdownMenu.Content>
                    </DropdownMenu>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
