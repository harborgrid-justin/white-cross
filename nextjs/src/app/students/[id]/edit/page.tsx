/**
 * Edit Student Page
 * Edit existing student with StudentForm
 *
 * @module app/students/[id]/edit/page
 */

import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getStudentById } from '../../actions';
import { StudentForm } from '@/components/features/students/StudentForm';
import { ChevronLeft } from 'lucide-react';

/**
 * Generate page metadata
 */
export async function generateMetadata({
  params
}: {
  params: { id: string };
}): Promise<Metadata> {
  const result = await getStudentById(params.id);

  if (!result.success || !result.data) {
    return {
      title: 'Edit Student | White Cross Healthcare'
    };
  }

  const student = result.data;

  return {
    title: `Edit ${student.firstName} ${student.lastName} | White Cross Healthcare`,
    description: `Edit student profile for ${student.firstName} ${student.lastName}`
  };
}

/**
 * Edit Student Page
 *
 * Server component that fetches student data and displays StudentForm
 * in edit mode for updating student information.
 */
export default async function EditStudentPage({
  params
}: {
  params: { id: string };
}) {
  // Fetch student data server-side
  const result = await getStudentById(params.id);

  // Handle not found
  if (!result.success || !result.data) {
    notFound();
  }

  const student = result.data;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Link
            href="/students"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            Students
          </Link>
          <ChevronLeft className="h-4 w-4 rotate-180 text-gray-400" />
          <Link
            href={`/students/${student.id}`}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            {student.firstName} {student.lastName}
          </Link>
          <ChevronLeft className="h-4 w-4 rotate-180 text-gray-400" />
          <span className="text-gray-900 dark:text-gray-100">Edit</span>
        </div>
      </nav>

      {/* StudentForm Component in Edit Mode */}
      <StudentForm mode="edit" student={student} />
    </div>
  );
}
