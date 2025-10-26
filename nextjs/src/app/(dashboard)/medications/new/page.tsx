/**
 * @fileoverview New Medication Page
 * @module app/(dashboard)/medications/new
 *
 * Add new medication form with validation, safety checks, and HIPAA audit logging.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import MedicationForm from '@/components/medications/forms/MedicationForm';
import { PageHeader } from '@/components/shared/PageHeader';

export const metadata: Metadata = {
  title: 'Add New Medication | White Cross',
  description: 'Add a new medication with prescription details and safety information'
};

/**
 * New Medication Page
 *
 * Server Component that renders the form for adding new medications.
 * Includes Five Rights safety verification and parent consent workflows.
 */
export default function NewMedicationPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Medication"
        description="Enter medication details with prescription information and safety data"
        backLink="/medications"
        backLabel="Back to Medications"
      />

      <Suspense fallback={<FormLoadingSkeleton />}>
        <div className="mx-auto max-w-4xl">
          <MedicationForm mode="create" />
        </div>
      </Suspense>
    </div>
  );
}

/**
 * Loading skeleton for form
 */
function FormLoadingSkeleton() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="animate-pulse space-y-6 rounded-lg border border-gray-200 bg-white p-6">
        <div className="space-y-4">
          {/* Form fields skeleton */}
          {[...Array(8)].map((_, i) => (
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
