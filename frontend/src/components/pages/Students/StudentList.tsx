/**
 * @fileoverview Student List Component
 * 
 * Main list component for displaying students with loading states and empty states.
 * 
 * @module components/pages/Students/StudentList
 * @since 1.0.0
 */

'use client';

import { StudentCard } from './StudentCard';
import { Users, Loader2 } from 'lucide-react';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentNumber: string;
  grade: string;
  dateOfBirth: string;
}

interface StudentListProps {
  students: Student[];
  loading?: boolean;
  error?: string | null;
}

/**
 * Student List Component
 * 
 * Renders a list of students with proper loading and error states.
 * Handles empty states and provides accessible feedback.
 */
export function StudentList({ students, loading = false, error = null }: StudentListProps) {
  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
          <p className="mt-2 text-sm text-gray-600">Loading students...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading students
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (students.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by adding a new student or adjusting your search criteria.
        </p>
      </div>
    );
  }

  // Main list view
  return (
    <div className="bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {students.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
        
        {/* Results summary */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Showing {students.length} student{students.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  );
}
