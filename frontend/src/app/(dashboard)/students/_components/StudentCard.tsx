/**
 * @fileoverview Student Card Component
 * @module app/(dashboard)/students/_components/StudentCard
 * @category Students - Components
 *
 * Mobile-optimized card component for displaying student information.
 * Provides a compact, touch-friendly layout with all essential
 * student details and actions.
 *
 * PHI CONSIDERATION:
 * This component displays PHI including names, contact info, and health alerts
 *
 * @example
 * ```tsx
 * <StudentCard
 *   student={studentData}
 *   isSelected={selectedStudents.has(studentData.id)}
 *   onSelect={handleSelectStudent}
 * />
 * ```
 */

'use client';

import { memo, type FC } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Eye,
  Edit,
  Phone,
  Mail,
  AlertTriangle,
  FileText
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
 * Props for the StudentCard component
 */
export interface StudentCardProps {
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
 * StudentCard Component
 * Renders a single student card in the mobile view
 *
 * RESPONSIVE DESIGN:
 * - Optimized for touch interactions
 * - Compact layout for smaller screens
 * - Full student information in card format
 *
 * PERFORMANCE: Memoized to prevent unnecessary re-renders
 * ACCESSIBILITY: Proper labels for checkboxes and action buttons
 */
const StudentCard: FC<StudentCardProps> = memo(({ student, isSelected, onSelect }) => {
  const age = calculateAge(student.dateOfBirth);
  const initials = getStudentInitials(student.firstName, student.lastName);
  const contactInfo = getEmergencyContactInfo(student);
  const hasAlerts = hasHealthAlerts(student);

  return (
    <Card className="p-4">
      <div className="flex items-start space-x-3">
        {/* Checkbox */}
        <div className="flex-shrink-0 pt-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(student.id)}
            className="rounded border-gray-300"
            aria-label={`Select student ${student.firstName} ${student.lastName}`}
          />
        </div>

        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-lg font-medium text-blue-800">
              {initials}
            </span>
          </div>
        </div>

        {/* Student Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {student.firstName} {student.lastName}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                ID: {student.studentNumber} • Age: {age}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge
                  variant="secondary"
                  className={getGradeBadgeColor(student.grade)}
                >
                  {student.grade}
                </Badge>
                <Badge variant={getStatusBadgeVariant(student.isActive)}>
                  {student.isActive ? 'ACTIVE' : 'INACTIVE'}
                </Badge>
                {hasAlerts && (
                  <Badge variant="destructive">
                    <AlertTriangle className="h-3 w-3 mr-1" aria-hidden="true" />
                    Health Alert
                  </Badge>
                )}
              </div>

              {/* Contact Info */}
              <div className="mt-3 space-y-1">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-3 w-3 mr-2" aria-hidden="true" />
                  <span>{contactInfo.phone}</span>
                </div>
                {contactInfo.email !== 'N/A' && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-3 w-3 mr-2" aria-hidden="true" />
                    <span className="truncate">{contactInfo.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = `/students/${student.id}`}
              className="flex-1"
              aria-label={`View details for ${student.firstName} ${student.lastName}`}
            >
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = `/students/${student.id}/edit`}
              className="flex-1"
              aria-label={`Edit ${student.firstName} ${student.lastName}`}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = `/students/${student.id}/health-records`}
              className="flex-1"
              aria-label={`View health records for ${student.firstName} ${student.lastName}`}
            >
              <FileText className="h-4 w-4 mr-2" />
              Health
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
});

StudentCard.displayName = 'StudentCard';

export { StudentCard };
