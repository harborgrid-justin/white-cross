/**
 * @fileoverview Add Medication for Student Page
 * @module app/(dashboard)/students/[id]/medications/new
 *
 * Add new medication for specific student with pre-filled student information.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MedicationForm from '@/components/medications/forms/MedicationForm';
import { PageHeader } from '@/components/shared/PageHeader';
import { fetchWithAuth } from '@/lib/server/fetch';
import { API_ENDPOINTS } from '@/constants/api';

export const metadata: Metadata = {
  title: 'Add Medication | White Cross',
  description: 'Add new medication for student'
};

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";

interface AddMedicationForStudentPageProps {
  params: {
    id: string;
  };
}

/**
 * Fetch student
 */
async function getStudent(studentId: string) {
  try {
    const response = await fetchWithAuth(
      API_ENDPOINTS.STUDENTS.BY_ID(studentId),
      { next: { tags: [`student-${studentId}`] } }
    );

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch student');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching student:', error);
    return null;
  }
}

/**
 * Add Medication for Student Page
 */
export default async function AddMedicationForStudentPage({ params }: AddMedicationForStudentPageProps) {
  const student = await getStudent(params.id);

  if (!student) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Add Medication - ${student.firstName} ${student.lastName}`}
        description="Enter medication details with prescription and safety information"
        backLink={`/students/${params.id}/medications`}
        backLabel="Back to Student Medications"
      />

      {/* Allergies Warning */}
      {student.allergies && student.allergies.length > 0 && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Student has {student.allergies.length} known allerg{student.allergies.length === 1 ? 'y' : 'ies'}
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p className="font-semibold">{student.allergies.join(', ')}</p>
                <p className="mt-1">Ensure medication does not contain contraindicated ingredients.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Suspense fallback={<FormLoadingSkeleton />}>
        <div className="mx-auto max-w-4xl">
          <MedicationForm
            mode="create"
            studentId={params.id}
            student={student}
          />
        </div>
      </Suspense>
    </div>
  );
}

function FormLoadingSkeleton() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="animate-pulse space-y-6 rounded-lg border border-gray-200 bg-white p-6">
        <div className="space-y-4">
          {[...Array(10)].map((_, i) => (
            <div key={i}>
              <div className="mb-2 h-4 w-32 rounded bg-gray-200"></div>
              <div className="h-10 w-full rounded bg-gray-100"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
