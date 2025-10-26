/**
 * @fileoverview Prescription Detail Page
 * @module app/(dashboard)/medications/prescriptions/[id]
 *
 * Detailed view of prescription with refill history and management.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Link } from 'next/link';
import PrescriptionDetails from '@/components/medications/PrescriptionDetails';
import { PageHeader } from '@/components/shared/PageHeader';
import { fetchWithAuth } from '@/lib/server/fetch';
import { API_ENDPOINTS } from '@/constants/api';

export const metadata: Metadata = {
  title: 'Prescription Details | White Cross',
  description: 'View prescription details and refill history'
};

interface PrescriptionDetailPageProps {
  params: {
    id: string;
  };
}

/**
 * Fetch prescription
 */
async function getPrescription(id: string) {
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
 * Prescription Detail Page
 */
export default async function PrescriptionDetailPage({ params }: PrescriptionDetailPageProps) {
  const prescription = await getPrescription(params.id);

  if (!prescription) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Prescription #${prescription.prescriptionNumber}`}
        description={`Prescribed by ${prescription.prescribedBy}`}
        backLink="/medications/prescriptions"
        backLabel="Back to Prescriptions"
      >
        <Link
          href={`/medications/prescriptions/${params.id}/refill`}
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          Request Refill
        </Link>
      </PageHeader>

      <Suspense fallback={<DetailLoadingSkeleton />}>
        <PrescriptionDetails prescription={prescription} />
      </Suspense>
    </div>
  );
}

function DetailLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-64 rounded-lg border border-gray-200 bg-white p-6"></div>
      <div className="h-48 rounded-lg border border-gray-200 bg-white p-6"></div>
    </div>
  );
}
