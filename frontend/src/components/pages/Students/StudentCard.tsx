/**
 * @fileoverview Student Card Component
 * 
 * Card component for displaying student information in list views.
 * 
 * @module components/pages/Students/StudentCard
 * @since 1.0.0
 */

import Link from 'next/link';
import { User } from 'lucide-react';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentNumber: string;
  grade: string;
  dateOfBirth: string;
}

interface StudentCardProps {
  student: Student;
}

/**
 * Student Card Component
 * 
 * Renders student information in a card format for list views.
 */
export function StudentCard({ student }: StudentCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <User className="h-8 w-8 text-gray-400" />
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-center justify-between">
              <Link
                href={`/students/${student.id}`}
                className="text-lg font-medium text-blue-600 hover:text-blue-800"
              >
                {student.firstName} {student.lastName}
              </Link>
              <span className="text-sm text-gray-500">Grade {student.grade}</span>
            </div>
            <div className="mt-1">
              <p className="text-sm text-gray-600">
                Student ID: {student.studentNumber}
              </p>
              <p className="text-sm text-gray-600">
                DOB: {new Date(student.dateOfBirth).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
