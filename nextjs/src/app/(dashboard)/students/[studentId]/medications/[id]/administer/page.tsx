/**
 * @fileoverview Administer Medication to Student Page
 * @module app/(dashboard)/students/[studentId]/medications/[id]/administer
 *
 * Medication administration form with Five Rights verification for specific student.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AdministrationForm from '@/components/medications/forms/AdministrationForm';
import { PageHeader } from '@/components/shared/PageHeader';
import { fetchWithAuth } from '@/lib/server/fetch';
import { API_ENDPOINTS } from '@/constants/api';

export const metadata: Metadata = {
  title: 'Administer Medication | White Cross',
  description: 'Record medication administration with Five Rights verification'
};

interface AdministerMedicationToStudentPageProps {
  params: {
    studentId: string;
    id: string;
  };
}

/**
 * Fetch student and medication for administration
 */
async function getDataForAdministration(studentId: string, medicationId: string) {
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
    console.error('Error fetching data for administration:', error);
    return null;
  }
}

/**
 * Administer Medication to Student Page
 */
export default async function AdministerMedicationToStudentPage({ params }: AdministerMedicationToStudentPageProps) {
  const data = await getDataForAdministration(params.studentId, params.id);

  if (!data) {
    notFound();
  }

  const { student, medication } = data;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Administer ${medication.name}`}
        description={`${student.firstName} ${student.lastName} - ${medication.dosage} ${medication.route}`}
        backLink={`/students/${params.studentId}/medications/${params.id}`}
        backLabel="Back to Medication"
      />

      {/* Five Rights Reminder */}
      <div className="rounded-md bg-blue-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Five Rights of Medication Administration</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc space-y-1 pl-5">
                <li><strong>Right Patient:</strong> {student.firstName} {student.lastName} ({student.studentId})</li>
                <li><strong>Right Medication:</strong> {medication.name}</li>
                <li><strong>Right Dose:</strong> {medication.dosage}</li>
                <li><strong>Right Route:</strong> {medication.route}</li>
                <li><strong>Right Time:</strong> Per schedule ({medication.frequency})</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

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
              <p className="mt-1 text-sm font-semibold text-red-700">{student.allergies.join(', ')}</p>
            </div>
          </div>
        </div>
      )}

      <Suspense fallback={<FormLoadingSkeleton />}>
        <div className="mx-auto max-w-4xl">
          <AdministrationForm
            studentId={params.studentId}
            medicationId={params.id}
            student={student}
            medication={medication}
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
          {[...Array(12)].map((_, i) => (
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
