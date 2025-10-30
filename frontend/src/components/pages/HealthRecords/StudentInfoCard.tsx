/**
 * @fileoverview Student Information Card Component
 * 
 * Card component displaying student information for health record detail page.
 * 
 * @module components/pages/HealthRecords/StudentInfoCard
 * @since 1.0.0
 */

import Link from 'next/link';
import { User } from 'lucide-react';
import { Card } from '@/components/ui/layout/Card';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentNumber: string;
  grade: string;
  dateOfBirth: string;
}

interface StudentInfoCardProps {
  student: Student;
}

/**
 * Student Information Card Component
 * 
 * Renders student information in a card layout for health record context.
 */
export function StudentInfoCard({ student }: StudentInfoCardProps) {
  return (
    <Card>
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <User className="h-5 w-5 text-gray-400 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Student Information</h2>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Student Name</p>
            <Link
              href={`/students/${student.id}`}
              className="mt-1 text-sm text-blue-600 hover:text-blue-800"
            >
              {student.firstName} {student.lastName}
            </Link>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Student Number</p>
            <p className="mt-1 text-sm text-gray-900">{student.studentNumber}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Grade</p>
            <p className="mt-1 text-sm text-gray-900">{student.grade}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
