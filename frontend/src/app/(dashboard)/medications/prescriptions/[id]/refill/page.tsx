/**
 * @fileoverview Prescription Refill Request Page
 * @module app/(dashboard)/medications/prescriptions/[id]/refill
 *
 * Request prescription refill with pharmacy selection and urgency level.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import RefillRequestForm from '@/components/medications/forms/RefillRequestForm';
import { PageHeader } from '@/components/shared/PageHeader';
import { fetchWithAuth } from '@/lib/server/fetch';
import { API_ENDPOINTS } from '@/constants/api';

export const metadata: Metadata = {
  title: 'Request Refill | White Cross',
  description: 'Submit prescription refill request'
};



interface RefillRequestPageProps {
  params: {
    id: string;
  };
}

/**
 * Fetch prescription for refill
 */
async function getPrescriptionForRefill(id: string) {
  try {
    const response = await fetchWithAuth(
      `${API_ENDPOINTS.MEDICATIONS.BASE}/prescriptions/${id}`,
      { next: { tags: [`prescription-${id}`] } }
    );

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch prescription');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching prescription:', error);
    return null;
  }
}

/**
 * Refill Request Page
 */
export default async function RefillRequestPage({ params }: RefillRequestPageProps) {
  const prescription = await getPrescriptionForRefill(params.id);

  if (!prescription) {
    notFound();
  }

  // Check if refills are available
  if (prescription.refillsRemaining <= 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="No Refills Available"
          description={`Prescription #${prescription.prescriptionNumber}`}
          backLink={`/medications/prescriptions/${params.id}`}
          backLabel="Back to Prescription"
        />

        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">No refills remaining</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  This prescription has no remaining refills. Please contact the prescriber ({prescription.prescribedBy})
                  to request a new prescription.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Request Prescription Refill"
        description={`${prescription.refillsRemaining} refill${prescription.refillsRemaining !== 1 ? 's' : ''} remaining`}
        backLink={`/medications/prescriptions/${params.id}`}
        backLabel="Back to Prescription"
      />

      <Suspense fallback={<FormLoadingSkeleton />}>
        <div className="mx-auto max-w-3xl">
          <RefillRequestForm prescription={prescription} prescriptionId={params.id} />
        </div>
      </Suspense>
    </div>
  );
}

function FormLoadingSkeleton() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="animate-pulse space-y-6 rounded-lg border border-gray-200 bg-white p-6">
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
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
