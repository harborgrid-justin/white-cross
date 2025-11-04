/**
 * @fileoverview Students Content Component (Refactored)
 * @module app/(dashboard)/students/_components/StudentsContent
 * @category Students - Components
 *
 * Main content area for student management with refactored architecture.
 * This component orchestrates multiple sub-components for better maintainability:
 * - StudentStatsCard: Statistics display
 * - BulkActionBar: Bulk operations and actions
 * - StudentTableRow: Desktop table view
 * - StudentCard: Mobile card view
 * - StudentsEmptyState: Empty state UI
 * - useStudentData: Custom hook for data management
 *
 * REFACTORING IMPROVEMENTS:
 * - Reduced from 643 lines to ~200 lines
 * - Separated concerns into focused components
 * - Extracted business logic into custom hook
 * - Improved testability and maintainability
 *
 * @example
 * ```tsx
 * <StudentsContent searchParams={{ grade: '10th', status: 'ACTIVE' }} />
 * ```
 */

'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users,
  GraduationCap,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { useStudentData } from './useStudentData';
import { StudentStatsCard } from './StudentStatsCard';
import { BulkActionBar } from './BulkActionBar';
import { StudentTableRow } from './StudentTableRow';
import { StudentCard } from './StudentCard';
import { StudentsEmptyState } from './StudentsEmptyState';

/**
 * Props for the StudentsContent component
 */
interface StudentsContentProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    grade?: string;
    status?: string;
    hasHealthAlerts?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

/**
 * Main StudentsContent Component
 * Orchestrates student data display and interactions
 *
 * ARCHITECTURE:
 * - Uses custom hook for data management
 * - Delegates rendering to specialized components
 * - Maintains clean separation of concerns
 *
 * PERFORMANCE:
 * - Memoized sub-components prevent unnecessary re-renders
 * - Optimized data fetching with custom hook
 */
export function StudentsContent({ searchParams }: StudentsContentProps) {
  // Custom hook handles all data fetching, selection, and export logic
  const {
    students,
    loading,
    selectedStudents,
    handleSelectStudent,
    handleSelectAll,
    handleExport,
    stats
  } = useStudentData(searchParams);

  // Loading state with skeleton UI
  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-lg">
                  <Skeleton className="h-6 w-16 mb-2" />
                  <Skeleton className="h-8 w-12" />
                </div>
              ))}
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StudentStatsCard
          label="Total Students"
          value={stats.totalStudents}
          icon={Users}
          iconColor="text-blue-600"
        />
        <StudentStatsCard
          label="Present Today"
          value={stats.presentToday}
          icon={UserCheck}
          iconColor="text-green-600"
        />
        <StudentStatsCard
          label="Health Alerts"
          value={stats.healthAlertsCount}
          icon={AlertTriangle}
          iconColor="text-orange-600"
        />
        <StudentStatsCard
          label="Active"
          value={stats.activeStudents}
          icon={GraduationCap}
          iconColor="text-blue-600"
        />
      </div>

      {/* Students Table/List */}
      <Card>
        <div className="p-6">
          {/* Bulk Action Bar */}
          <BulkActionBar
            selectedCount={selectedStudents.size}
            onExport={handleExport}
          />

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedStudents.size === students.length && students.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                      aria-label="Select all students"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade & Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Health & Attendance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <StudentTableRow
                    key={student.id}
                    student={student}
                    isSelected={selectedStudents.has(student.id)}
                    onSelect={handleSelectStudent}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {/* Select All for Mobile */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedStudents.size === students.length && students.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  Select All ({students.length})
                </span>
              </label>
              <span className="text-sm text-gray-500">
                {selectedStudents.size} selected
              </span>
            </div>

            {/* Student Cards */}
            {students.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                isSelected={selectedStudents.has(student.id)}
                onSelect={handleSelectStudent}
              />
            ))}
          </div>

          {/* Empty State */}
          {students.length === 0 && <StudentsEmptyState />}
        </div>
      </Card>
    </div>
  );
}
