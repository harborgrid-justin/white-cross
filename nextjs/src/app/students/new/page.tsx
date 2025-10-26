/**
 * New Student Page
 * Create a new student with StudentForm
 *
 * @module app/students/new/page
 */

import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { StudentForm } from '@/components/features/students/StudentForm';
import { ChevronLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'New Student | White Cross Healthcare',
  description: 'Enroll a new student in the healthcare management system'
};

/**
 * New Student Page
 *
 * Displays StudentForm in create mode for enrolling new students.
 * On successful creation, redirects to the student's detail page.
 */
export default function NewStudentPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6">
        <Link
          href="/students"
          className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Students
        </Link>
      </nav>

      {/* StudentForm Component */}
      <StudentForm mode="create" />
    </div>
  );
}
