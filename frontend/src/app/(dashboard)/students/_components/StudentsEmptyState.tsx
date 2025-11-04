/**
 * @fileoverview Students Empty State Component
 * @module app/(dashboard)/students/_components/StudentsEmptyState
 * @category Students - Components
 *
 * Empty state component displayed when no students are found.
 * Provides clear messaging and a call-to-action to add students.
 *
 * @example
 * ```tsx
 * {students.length === 0 && <StudentsEmptyState />}
 * ```
 */

'use client';

import { memo, type FC } from 'react';
import { Button } from '@/components/ui/button';
import { Users, Plus } from 'lucide-react';

/**
 * StudentsEmptyState Component
 * Displays when no students match the current filters or when there are no students
 *
 * UX CONSIDERATIONS:
 * - Clear icon and messaging
 * - Actionable call-to-action button
 * - Centered layout for visual balance
 *
 * PERFORMANCE: Memoized to prevent unnecessary re-renders
 * ACCESSIBILITY: Semantic heading structure and button labels
 */
const StudentsEmptyState: FC = memo(() => {
  return (
    <div className="text-center py-12">
      <Users className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by adding a new student.
      </p>
      <div className="mt-6">
        <Button
          onClick={() => window.location.href = '/students/new'}
          aria-label="Add new student"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>
    </div>
  );
});

StudentsEmptyState.displayName = 'StudentsEmptyState';

export { StudentsEmptyState };
