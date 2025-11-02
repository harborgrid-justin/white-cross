/**
 * Student Details Page
 * Displays comprehensive student information
 *
 * @module app/students/[id]/page
 */

import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getStudent } from '@/lib/actions/students.actions';
import { StudentDetails } from '@/components/features/students/StudentDetails';
import { ChevronLeft } from 'lucide-react';

/**
 * Route Segment Configuration
 *
 * Use Incremental Static Regeneration for student detail pages.
 * Student data changes occasionally, so we use a short revalidation time.
 */
export const dynamic = 'force-dynamic';
export const revalidate = 15; // Revalidate every 15 seconds for PHI data

/**
 * Generate page metadata
 */
export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const student = await getStudent(id);

  if (!student) {
    return {
      title: 'Student Not Found | White Cross Healthcare'
    };
  }

  return {
    title: `${student.firstName} ${student.lastName} | White Cross Healthcare`,
    description: `Student profile for ${student.firstName} ${student.lastName} - Grade ${student.grade}`
  };
}

/**
 * Student Details Page
 *
 * Server component that fetches student data and displays comprehensive information
 * including demographics, emergency contacts, and health summary.
 */
export default async function StudentDetailsPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  // Await params and fetch student data server-side
  const { id } = await params;
  const student = await getStudent(id);

  // Handle not found
  if (!student) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
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

      {/* Student Details Component */}
      <StudentDetails
        student={student}
        showEmergencyContacts
        showHealthSummary
      />
    </div>
  );
}
