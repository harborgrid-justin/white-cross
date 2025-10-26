'use client';

/**
 * Students List Page - Next.js App Router
 *
 * Migrated from frontend/src/pages/students/Students.tsx
 *
 * Displays a searchable, filterable list of all students.
 *
 * Features:
 * - Student search and filtering
 * - Grade level filtering
 * - Quick actions (view, edit, health records)
 * - Pagination
 * - Export functionality
 *
 * @remarks
 * Client Component for interactivity and data fetching
 */

import { Suspense } from 'react';
import Students from '@/pages-old/students/Students';

export default function StudentsListPage() {
  return (
    <Suspense fallback={<StudentsLoading />}>
      <Students />
    </Suspense>
  );
}

function StudentsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-12 bg-gray-200 rounded w-full"></div>
        <div className="space-y-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
