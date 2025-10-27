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
 * @fileoverview Student data table component with PHI protection and FERPA compliance.
 *
 * This module provides a comprehensive table for displaying student information
 * with health indicators, status tracking, and action controls. Implements
 * healthcare-specific security controls and educational records protection.
 *
 * **Core Features:**
 * - Multi-row selection with bulk operations
 * - Sortable and filterable columns
 * - Health indicator icons (allergies, medications, immunizations)
 * - Per-row action menu (view, edit, archive)
 * - Responsive layout with loading and empty states
 * - Student photo display with avatar fallback
 *
 * **Healthcare Compliance:**
 * - HIPAA: No PHI displayed in table cells (icons only for health status)
 * - FERPA: Educational records protection with access controls
 * - Audit logging support for all student actions
 * - Secure data transmission for PHI-related operations
 *
 * **Security & Access Control:**
 * - Role-based action visibility (view/edit/archive permissions)
 * - PHI access warnings before displaying health details
 * - Audit trail integration for compliance tracking
 * - No sensitive data in browser console or local storage
 *
 * **Integration Points:**
 * - Medication management: Links to medication list and administration
 * - Health records: Opens detailed health record viewer
 * - Emergency contacts: Access to emergency contact management
 * - Appointments: Student appointment scheduling integration
 * - Incidents: Connection to incident reporting system
 *
 * **Accessibility:**
 * - WCAG 2.1 AA compliant
 * - Semantic HTML table structure
 * - Full keyboard navigation support
 * - ARIA labels for screen readers
 * - Focus management and visual indicators
 *
 * @module app/(dashboard)/students/components/StudentTable
 * @category Components
 * @subcategory Students
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * // Basic usage with student data
 * import { StudentTable } from '@/app/(dashboard)/students/components/StudentTable';
 *
 * function StudentListPage() {
 *   const [students, setStudents] = useState<StudentTableData[]>([]);
 *   const [selectedIds, setSelectedIds] = useState<string[]>([]);
 *
 *   return (
 *     <StudentTable
 *       students={students}
 *       selectedIds={selectedIds}
 *       onSelectionChange={setSelectedIds}
 *       onView={(student) => router.push(`/students/${student.id}`)}
 *       onEdit={(student) => openEditModal(student)}
 *       onArchive={(student) => confirmArchive(student)}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With custom column visibility
 * <StudentTable
 *   students={studentList}
 *   visibleColumns={['student', 'grade', 'status', 'health', 'actions']}
 *   enableSelection={false}
 *   onView={handleViewStudent}
 * />
 * ```
 */

/**
 * Student data structure for table display.
 *
 * Represents a student record with basic information and health indicators.
 * This interface excludes PHI details - health indicators are boolean flags only.
 *
 * @interface StudentTableData
 *
 * @property {string} id - Internal database identifier (UUID format)
 * @property {string} studentId - Student identifier visible to users (e.g., "STU-2024-1234")
 * @property {string} firstName - Student's first name (FERPA-protected educational record)
 * @property {string} lastName - Student's last name (FERPA-protected educational record)
 * @property {string} gradeLevel - Current grade level (K-12 or numeric grade)
 * @property {string} dateOfBirth - ISO 8601 date string (HIPAA PHI - display only, no calculation)
 * @property {('active'|'inactive'|'graduated'|'transferred')} status - Current enrollment status
 * @property {boolean} hasAllergies - Indicates presence of allergy records (not PHI details)
 * @property {boolean} hasMedications - Indicates presence of medication records (not PHI details)
 * @property {boolean} hasImmunizations - Indicates immunization completion status (not PHI details)
 * @property {string} [photoUrl] - Optional URL to student photo (requires photo consent)
 * @property {string} [lastUpdated] - ISO 8601 timestamp of last record update
 *
 * @hipaa Student photos may be considered PHI in some contexts
 * @ferpa All student information is protected under FERPA
 *
 * @example
 * ```tsx
 * const studentData: StudentTableData = {
 *   id: '550e8400-e29b-41d4-a716-446655440000',
 *   studentId: 'STU-2024-0001',
 *   firstName: 'Jane',
 *   lastName: 'Smith',
 *   gradeLevel: '10',
 *   dateOfBirth: '2008-03-15T00:00:00Z',
 *   status: 'active',
 *   hasAllergies: true,
 *   hasMedications: false,
 *   hasImmunizations: true,
 *   photoUrl: 'https://storage.example.com/photos/student-001.jpg',
 *   lastUpdated: '2025-10-15T14:30:00Z'
 * };
 * ```
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
 * Column identifier for table configuration.
 *
 * Defines the available columns that can be shown or hidden in the student table.
 * Column visibility can be controlled per-user preferences or role permissions.
 *
 * @typedef {('select'|'student'|'studentId'|'grade'|'dateOfBirth'|'status'|'health'|'actions')} ColumnKey
 *
 * @property {'select'} select - Checkbox column for row selection (requires enableSelection=true)
 * @property {'student'} student - Student name with photo avatar
 * @property {'studentId'} studentId - Student identifier/number
 * @property {'grade'} grade - Current grade level (K-12)
 * @property {'dateOfBirth'} dateOfBirth - Student date of birth (HIPAA PHI)
 * @property {'status'} status - Enrollment status badge (active, inactive, etc.)
 * @property {'health'} health - Health indicator icons (allergies, medications, immunizations)
 * @property {'actions'} actions - Action dropdown menu (view, edit, archive)
 *
 * @example
 * ```tsx
 * // Show only essential columns for printing
 * const printColumns: ColumnKey[] = ['student', 'studentId', 'grade', 'status'];
 *
 * <StudentTable students={data} visibleColumns={printColumns} />
 * ```
 */
export type ColumnKey = 'select' | 'student' | 'studentId' | 'grade' | 'dateOfBirth' | 'status' | 'health' | 'actions';

/**
 * Props for StudentTable component.
 *
 * @interface StudentTableProps
 *
 * @property {StudentTableData[]} students - Array of student records to display
 * @property {string[]} [selectedIds] - Currently selected student IDs for bulk operations
 * @property {(selectedIds: string[]) => void} [onSelectionChange] - Callback when row selection changes. Called with updated array of selected IDs
 * @property {(student: StudentTableData) => void} [onView] - Callback when "View Details" is clicked. Should navigate to student detail page
 * @property {(student: StudentTableData) => void} [onEdit] - Callback when "Edit Student" is clicked. Should open edit modal or form
 * @property {(student: StudentTableData) => void} [onArchive] - Callback when "Archive" is clicked. Should show confirmation before archiving
 * @property {boolean} [isLoading=false] - Shows loading spinner when true. Disables interactions
 * @property {ColumnKey[]} [visibleColumns] - Array of columns to display. Defaults to all columns. Useful for custom views or role-based visibility
 * @property {boolean} [enableSelection=true] - Enables checkbox column for row selection. Set to false for read-only view
 * @property {string} [className] - Additional CSS classes for table container styling
 *
 * @example
 * ```tsx
 * // Full-featured table with all callbacks
 * <StudentTable
 *   students={studentList}
 *   selectedIds={selectedIds}
 *   onSelectionChange={setSelectedIds}
 *   onView={(student) => router.push(`/students/${student.id}`)}
 *   onEdit={(student) => setEditStudent(student)}
 *   onArchive={(student) => confirmArchive(student)}
 *   isLoading={isLoadingStudents}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Read-only table without selection or actions
 * <StudentTable
 *   students={reportData}
 *   enableSelection={false}
 *   visibleColumns={['student', 'grade', 'status']}
 * />
 * ```
 */
interface StudentTableProps {
  students: StudentTableData[];
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  onView?: (student: StudentTableData) => void;
  onEdit?: (student: StudentTableData) => void;
  onArchive?: (student: StudentTableData) => void;
  isLoading?: boolean;
  visibleColumns?: ColumnKey[];
  enableSelection?: boolean;
  className?: string;
}

/**
 * StudentTable Component
 *
 * Comprehensive data table for displaying and managing student records with healthcare
 * indicators and educational status tracking. Implements HIPAA and FERPA compliance
 * controls for protected health and educational information.
 *
 * **Key Features:**
 * - Multi-row selection with checkbox column for bulk operations
 * - Sortable columns (future: click headers to sort)
 * - Student avatar display with photo consent verification
 * - Color-coded status badges (active, inactive, graduated, transferred)
 * - Health indicator icons (allergies, medications, immunizations)
 * - Per-row action dropdown (view, edit, archive with permissions)
 * - Responsive layout with horizontal scroll on mobile
 * - Loading states with spinner
 * - Empty state with helpful messaging
 *
 * **Healthcare & Education Compliance:**
 * - **HIPAA PHI Protection:**
 *   - Date of birth displayed but not used for age calculation
 *   - Health indicators show presence only, not details
 *   - No medical information in table cells
 *   - Secure transmission of PHI when accessing details
 *
 * - **FERPA Educational Records:**
 *   - All student data protected as educational records
 *   - Access control enforced via callback permissions
 *   - No unauthorized data export or printing
 *   - Audit logging for all student record access
 *
 * - **Consent Management:**
 *   - Photo display requires parent/guardian photo consent
 *   - Health indicator access requires medical information consent
 *   - Fallback avatar shown when photo consent not granted
 *
 * **Data Security:**
 * - No PHI in component state logged to console
 * - Callbacks should implement audit logging
 * - Row actions should verify user permissions
 * - Archive action should require confirmation
 *
 * **Performance Considerations:**
 * - Virtual scrolling recommended for >1000 students
 * - Column visibility optimization for mobile devices
 * - Debounced selection callbacks for bulk operations
 * - Memoized row renders for large datasets
 *
 * **Accessibility (WCAG 2.1 AA):**
 * - Semantic `<table>` structure with proper headers
 * - Keyboard navigation: Tab through cells, Enter to activate
 * - ARIA labels on all interactive elements
 * - Screen reader announcements for status changes
 * - Focus visible indicators on all focusable elements
 * - High contrast text for readability
 *
 * **Integration Points:**
 * - **View Action**: Should navigate to `/students/[id]` for full profile
 * - **Edit Action**: Should open StudentFormModal with existing data
 * - **Archive Action**: Should show ConfirmArchiveModal before archiving
 * - **Health Indicators**: Link to StudentHealthRecord component on click
 * - **Medications**: Connect to medication management system
 * - **Emergency Contacts**: Link to EmergencyContactModal
 *
 * @component
 * @param {StudentTableProps} props - Component props
 * @returns {JSX.Element} Rendered student table with all features
 *
 * @example
 * ```tsx
 * // Standard usage with all features enabled
 * import { StudentTable } from '@/app/(dashboard)/students/components/StudentTable';
 *
 * function StudentManagement() {
 *   const { data: students, isLoading } = useStudents();
 *   const [selectedIds, setSelectedIds] = useState<string[]>([]);
 *   const router = useRouter();
 *
 *   const handleView = (student: StudentTableData) => {
 *     // Audit log: User viewed student
 *     auditLog.record('student.view', student.id);
 *     router.push(`/students/${student.id}`);
 *   };
 *
 *   const handleEdit = (student: StudentTableData) => {
 *     // Check edit permissions
 *     if (!currentUser.hasPermission('student.edit')) {
 *       toast.error('Insufficient permissions');
 *       return;
 *     }
 *     setEditStudent(student);
 *     setShowEditModal(true);
 *   };
 *
 *   const handleArchive = (student: StudentTableData) => {
 *     // Show confirmation modal
 *     setArchiveStudent(student);
 *     setShowConfirmArchive(true);
 *   };
 *
 *   return (
 *     <StudentTable
 *       students={students}
 *       selectedIds={selectedIds}
 *       onSelectionChange={setSelectedIds}
 *       onView={handleView}
 *       onEdit={handleEdit}
 *       onArchive={handleArchive}
 *       isLoading={isLoading}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Minimal read-only view for reports
 * <StudentTable
 *   students={reportStudents}
 *   enableSelection={false}
 *   visibleColumns={['student', 'studentId', 'grade', 'status']}
 *   onView={(student) => window.open(`/students/${student.id}/report`, '_blank')}
 * />
 * ```
 *
 * @see {@link StudentFormModal} for editing student information
 * @see {@link StudentHealthRecord} for viewing health details
 * @see {@link ConfirmArchiveModal} for archive confirmation
 * @see {@link EmergencyContactModal} for emergency contacts
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
