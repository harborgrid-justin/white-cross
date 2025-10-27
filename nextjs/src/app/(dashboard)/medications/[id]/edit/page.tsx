/**
 * @fileoverview Edit Medication Page
 * @module app/(dashboard)/medications/[id]/edit
 *
 * Edit existing medication with validation and audit logging.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MedicationForm from '@/components/medications/forms/MedicationForm';
import { PageHeader } from '@/components/shared/PageHeader';
import { fetchWithAuth } from '@/lib/server/fetch';
import { API_ENDPOINTS } from '@/constants/api';

export const metadata: Metadata = {
  title: 'Edit Medication | White Cross',
  description: 'Update medication details and prescription information'
};

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";

interface EditMedicationPageProps {
  params: {
    id: string;
  };
}

/**
 * Fetch medication data server-side
 */
async function getMedication(id: string) {
  try {
    const response = await fetchWithAuth(API_ENDPOINTS.MEDICATIONS.BY_ID(id), {
      next: { tags: [`medication-${id}`] }
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch medication');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching medication:', error);
    return null;
  }
}

/**
 * Edit Medication Page
 *
 * Server Component that fetches medication data and renders edit form.
 */
export default async function EditMedicationPage({ params }: EditMedicationPageProps) {
  const medication = await getMedication(params.id);

  if (!medication) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit ${medication.name}`}
        description="Update medication details and prescription information"
        backLink={`/medications/${params.id}`}
        backLabel="Back to Medication"
      />

      <Suspense fallback={<FormLoadingSkeleton />}>
        <div className="mx-auto max-w-4xl">
          <MedicationForm
            mode="edit"
            medicationId={params.id}
            initialData={medication}
          />
        </div>
      </Suspense>
    </div>
  );
}

/**
 * Loading skeleton
 */
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
        <div className="flex justify-end space-x-3">
          <div className="h-10 w-24 rounded bg-gray-200"></div>
          <div className="h-10 w-32 rounded bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
}
