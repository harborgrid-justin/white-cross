/**
 * @fileoverview Student Table Row Component
 * @module app/(dashboard)/students/_components/StudentTableRow
 * @category Students - Components
 *
 * Desktop table row component for displaying student information
 * in a tabular format. Includes selection checkbox, student details,
 * status badges, contact information, and action buttons.
 *
 * PHI CONSIDERATION:
 * This component displays PHI including names, contact info, and health alerts
 *
 * @example
 * ```tsx
 * <StudentTableRow
 *   student={studentData}
 *   isSelected={selectedStudents.has(studentData.id)}
 *   onSelect={handleSelectStudent}
 * />
 * ```
 */

'use client';

import { memo, type FC } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Eye,
  Edit,
  Phone,
  Mail,
  AlertTriangle,
  FileText,
  UserCheck
} from 'lucide-react';
import type { Student } from '@/types/student.types';
import {
  calculateAge,
  getStatusBadgeVariant,
  getGradeBadgeColor,
  hasHealthAlerts,
  getStudentInitials,
  getEmergencyContactInfo
} from './student.utils';

/**
 * Props for the StudentTableRow component
 */
export interface StudentTableRowProps {
  /**
   * Student data object
   */
  student: Student;

  /**
   * Whether this student is currently selected
   */
  isSelected: boolean;

  /**
   * Callback when selection checkbox is toggled
   */
  onSelect: (studentId: string) => void;
}

/**
 * StudentTableRow Component
 * Renders a single student row in the desktop table view
 *
 * PERFORMANCE: Memoized to prevent unnecessary re-renders
 * ACCESSIBILITY: Proper labels for checkboxes and action buttons
 */
const StudentTableRow: FC<StudentTableRowProps> = memo(({ student, isSelected, onSelect }) => {
  const age = calculateAge(student.dateOfBirth);
  const initials = getStudentInitials(student.firstName, student.lastName);
  const contactInfo = getEmergencyContactInfo(student);
  const hasAlerts = hasHealthAlerts(student);

  return (
    <tr className="hover:bg-gray-50">
      {/* Selection Checkbox */}
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(student.id)}
          className="rounded border-gray-300"
          aria-label={`Select student ${student.firstName} ${student.lastName}`}
        />
      </td>

      {/* Student Info */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-sm font-medium text-blue-800">
                {initials}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {student.firstName} {student.lastName}
            </div>
            <div className="text-sm text-gray-500">
              ID: {student.studentNumber} • Age: {age}
            </div>
          </div>
        </div>
      </td>

      {/* Grade & Status */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="space-y-1">
          <Badge
            variant="secondary"
            className={getGradeBadgeColor(student.grade)}
          >
            {student.grade}
          </Badge>
          <div>
            <Badge variant={getStatusBadgeVariant(student.isActive)}>
              {student.isActive ? 'ACTIVE' : 'INACTIVE'}
            </Badge>
          </div>
        </div>
      </td>

      {/* Contact Info */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          <div className="flex items-center gap-1">
            <Phone className="h-3 w-3 text-gray-400" aria-hidden="true" />
            <span>{contactInfo.phone}</span>
          </div>
          <div className="flex items-center gap-1">
            <Mail className="h-3 w-3 text-gray-400" aria-hidden="true" />
            <span className="text-xs">{contactInfo.email}</span>
          </div>
        </div>
      </td>

      {/* Health & Attendance */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-gray-400" aria-hidden="true" />
            <span className="text-xs text-gray-500">
              No attendance data
            </span>
          </div>
          <div className="flex items-center gap-1">
            {hasAlerts && (
              <AlertTriangle className="h-3 w-3 text-orange-500" aria-hidden="true" />
            )}
            <span className="text-xs text-gray-500">
              Health: {hasAlerts ? 'Alerts' : 'Normal'}
            </span>
          </div>
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = `/students/${student.id}`}
            title="View student details"
            aria-label={`View details for ${student.firstName} ${student.lastName}`}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = `/students/${student.id}/edit`}
            title="Edit student"
            aria-label={`Edit ${student.firstName} ${student.lastName}`}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = `/students/${student.id}/health-records`}
            title="View health records"
            aria-label={`View health records for ${student.firstName} ${student.lastName}`}
          >
            <FileText className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
});

StudentTableRow.displayName = 'StudentTableRow';

export { StudentTableRow };
