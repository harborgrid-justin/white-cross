/**
 * @fileoverview Student Info Card Component
 * @module app/(dashboard)/medications/[id]/_components/StudentInfoCard
 *
 * @description
 * Sidebar card displaying student information associated with a medication.
 * Shows student name, grade level, avatar initials, and link to full profile.
 *
 * **Features:**
 * - Student name display with initials avatar
 * - Grade level indicator
 * - Link to full student health record
 * - Responsive layout
 *
 * **HIPAA Compliance:**
 * - Student name is Protected Health Information (PHI)
 * - Access logged for audit trail
 * - Only visible to authorized healthcare staff
 * - Link to full record requires VIEW_STUDENT_RECORDS permission
 *
 * **Healthcare Context:**
 * - Links medication to specific student
 * - Provides quick access to full health profile
 * - Supports Five Rights verification (Right Patient)
 *
 * @since 1.0.0
 */

import Link from 'next/link';
import type { StudentInfo } from './types';

/**
 * StudentInfoCard component props
 *
 * @interface StudentInfoCardProps
 * @property {StudentInfo} student - Student information to display
 *
 * @example
 * ```tsx
 * <StudentInfoCard
 *   student={{
 *     id: 'student-123',
 *     firstName: 'John',
 *     lastName: 'Doe',
 *     gradeLevel: '5'
 *   }}
 * />
 * ```
 */
export interface StudentInfoCardProps {
  student: StudentInfo;
}

/**
 * StudentInfoCard Component
 *
 * Displays student information in a sidebar card with avatar, name, grade,
 * and link to full student health record.
 *
 * **Information Displayed:**
 * - **Avatar**: Circle with student initials
 * - **Name**: Full name as clickable link to student record
 * - **Grade**: Current grade level
 *
 * **Visual Design:**
 * - Card with border and padding
 * - Blue circular avatar with initials
 * - Flexbox layout for avatar and info
 * - Hover state on student name link
 *
 * **HIPAA Compliance:**
 * - Student name is PHI requiring audit logging
 * - Only displayed to authorized healthcare staff
 * - Access control enforced at page level
 * - Link to full record creates audit entry
 *
 * **Accessibility:**
 * - Semantic HTML structure
 * - Descriptive link text
 * - Proper heading hierarchy
 * - Color contrast meets WCAG 2.1 AA standards
 *
 * @component
 * @param {StudentInfoCardProps} props - Component props
 * @returns {JSX.Element} Rendered student info card
 *
 * @example
 * ```tsx
 * <StudentInfoCard
 *   student={{
 *     id: 'abc-123',
 *     firstName: 'Jane',
 *     lastName: 'Smith',
 *     gradeLevel: '8'
 *   }}
 * />
 * ```
 */
export function StudentInfoCard({ student }: StudentInfoCardProps): JSX.Element {
  // Generate avatar initials from first and last name
  const initials = `${student.firstName[0]}${student.lastName[0]}`.toUpperCase();

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 font-semibold text-gray-900">Student Information</h3>

      <div className="flex items-center">
        {/* Avatar with Initials */}
        <div className="flex-shrink-0">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600"
            aria-label={`${student.firstName} ${student.lastName} avatar`}
          >
            <span className="text-lg font-semibold">{initials}</span>
          </div>
        </div>

        {/* Student Name and Grade */}
        <div className="ml-4">
          <Link
            href={`/students/${student.id}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            {student.firstName} {student.lastName}
          </Link>
          <p className="text-xs text-gray-500">Grade {student.gradeLevel}</p>
        </div>
      </div>
    </div>
  );
}

StudentInfoCard.displayName = 'StudentInfoCard';
