/**
 * @fileoverview Student-Specific Medication Detail Page
 * @module app/(dashboard)/students/[studentId]/medications/[id]
 *
 * View specific medication details for a student with quick administration access.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Link } from 'next/link';
import StudentMedicationDetail from '@/components/medications/StudentMedicationDetail';
import { PageHeader } from '@/components/shared/PageHeader';
import { fetchWithAuth } from '@/lib/server/fetch';
import { API_ENDPOINTS } from '@/constants/api';

export const metadata: Metadata = {
  title: 'Medication Details | White Cross',
  description: 'Student medication details and administration'
};

interface StudentMedicationDetailPageProps {
  params: {
    studentId: string;
    id: string;
  };
}

/**
 * Fetch student and medication
 */
async function getStudentMedication(studentId: string, medicationId: string) {
  try {
    const [studentRes, medicationRes] = await Promise.all([
      fetchWithAuth(API_ENDPOINTS.STUDENTS.BY_ID(studentId), {
        next: { tags: [`student-${studentId}`] }
      }),
      fetchWithAuth(API_ENDPOINTS.MEDICATIONS.BY_ID(medicationId), {
        next: { tags: [`medication-${medicationId}`] }
      })
    ]);

    if (!studentRes.ok || !medicationRes.ok) return null;

    const student = await studentRes.json();
    const medication = await medicationRes.json();

    // Verify medication belongs to student
    if (medication.studentId !== studentId) return null;

    return { student, medication };
  } catch (error) {
    console.error('Error fetching student medication:', error);
    return null;
  }
}

/**
 * Student Medication Detail Page
 */
export default async function StudentMedicationDetailPage({ params }: StudentMedicationDetailPageProps) {
  const data = await getStudentMedication(params.studentId, params.id);

  if (!data) {
    notFound();
  }

  const { student, medication } = data;

  return (
    <div className="space-y-6">
      <PageHeader
        title={medication.name}
        description={`${student.firstName} ${student.lastName} - ${medication.dosage}`}
        backLink={`/students/${params.studentId}/medications`}
        backLabel="Back to Medications"
      >
        <Link
          href={`/students/${params.studentId}/medications/${params.id}/administer`}
          className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
        >
          <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
          </svg>
          Administer Now
        </Link>
      </PageHeader>

      <Suspense fallback={<DetailLoadingSkeleton />}>
        <StudentMedicationDetail
          student={student}
          medication={medication}
          studentId={params.studentId}
          medicationId={params.id}
        />
      </Suspense>
    </div>
  );
}

function DetailLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-64 rounded-lg border border-gray-200 bg-white p-6"></div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="h-48 rounded-lg border border-gray-200 bg-white"></div>
        <div className="h-48 rounded-lg border border-gray-200 bg-white"></div>
      </div>
      <div className="h-96 rounded-lg border border-gray-200 bg-white"></div>
    </div>
  );
}
