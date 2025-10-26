/**
 * @fileoverview New Prescription Page
 * @module app/(dashboard)/medications/prescriptions/new
 *
 * Add new prescription with prescriber details and DEA/NPI validation.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import PrescriptionForm from '@/components/medications/forms/PrescriptionForm';
import { PageHeader } from '@/components/shared/PageHeader';

export const metadata: Metadata = {
  title: 'New Prescription | White Cross',
  description: 'Add new prescription with prescriber information'
};

/**
 * New Prescription Page
 *
 * Server Component for adding new prescriptions.
 */
export default function NewPrescriptionPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Prescription"
        description="Enter prescription details including prescriber information and refill authorization"
        backLink="/medications/prescriptions"
        backLabel="Back to Prescriptions"
      />

      <Suspense fallback={<FormLoadingSkeleton />}>
        <div className="mx-auto max-w-4xl">
          <PrescriptionForm mode="create" />
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
