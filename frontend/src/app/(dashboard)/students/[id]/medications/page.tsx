/**
 * @fileoverview Student Medications List Page
 * @module app/(dashboard)/students/[id]/medications
 *
 * View all medications for a specific student with administration history.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Link } from 'next/link';
import StudentMedicationsList from '@/components/medications/StudentMedicationsList';
import { PageHeader } from '@/components/shared/PageHeader';
import { fetchWithAuth } from '@/lib/server/fetch';
import { API_ENDPOINTS } from '@/constants/api';

export const metadata: Metadata = {
  title: 'Student Medications | White Cross',
  description: 'View all medications for this student'
};

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";

interface StudentMedicationsPageProps {
  params: {
    id: string;
  };
  searchParams: {
    status?: string;
  };
}

/**
 * Fetch student and their medications
 */
async function getStudentMedications(studentId: string, searchParams: any) {
  try {
    const [studentRes, medicationsRes] = await Promise.all([
      fetchWithAuth(API_ENDPOINTS.STUDENTS.BY_ID(studentId), {
        next: { tags: [`student-${studentId}`] }
      }),
      fetchWithAuth(
        `${API_ENDPOINTS.STUDENTS.BY_ID(studentId)}/medications?${new URLSearchParams({ status: searchParams.status || 'active' })}`,
        { next: { tags: [`student-medications-${studentId}`], revalidate: 300 } }
      )
    ]);

    if (!studentRes.ok) return null;

    const student = await studentRes.json();
    const medications = medicationsRes.ok ? await medicationsRes.json() : { medications: [], stats: {} };

    return { student, ...medications };
  } catch (error) {
    console.error('Error fetching student medications:', error);
    return null;
  }
}

/**
 * Student Medications Page
 */
export default async function StudentMedicationsPage({ params, searchParams }: StudentMedicationsPageProps) {
  const data = await getStudentMedications(params.id, searchParams);

  if (!data) {
    notFound();
  }

  const { student, medications, stats } = data;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${student.firstName} ${student.lastName} - Medications`}
        description={`Medication management for ${student.firstName}`}
        backLink={`/students/${params.id}`}
        backLabel="Back to Student"
      >
        <Link
          href={`/students/${params.id}/medications/new`}
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          Add Medication
        </Link>
      </PageHeader>

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
              <h3 className="text-sm font-medium text-red-800">Known Allergies</h3>
              <div className="mt-2 text-sm text-red-700">
                <p className="font-semibold">{student.allergies.join(', ')}</p>
                <p className="mt-1">Check for contraindications before administering any medication.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Suspense fallback={<MedicationsLoadingSkeleton />}>
        <StudentMedicationsList
          studentId={params.id}
          student={student}
          medications={medications}
          stats={stats}
        />
      </Suspense>
    </div>
  );
}

function MedicationsLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 rounded-lg border border-gray-200 bg-white"></div>
        ))}
      </div>
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 rounded border border-gray-200 bg-white"></div>
        ))}
      </div>
    </div>
  );
}
