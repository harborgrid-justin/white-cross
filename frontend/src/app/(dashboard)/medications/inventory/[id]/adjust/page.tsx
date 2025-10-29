/**
 * @fileoverview Stock Adjustment Page
 * @module app/(dashboard)/medications/inventory/[id]/adjust
 *
 * Form for adjusting medication inventory with reason and witness signature.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StockAdjustmentForm from '@/components/medications/forms/StockAdjustmentForm';
import { PageHeader } from '@/components/shared/PageHeader';
import { fetchWithAuth } from '@/lib/server/fetch';
import { API_ENDPOINTS } from '@/constants/api';

export const metadata: Metadata = {
  title: 'Adjust Stock | White Cross',
  description: 'Adjust medication inventory quantity'
};

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";

interface StockAdjustmentPageProps {
  params: {
    id: string;
  };
}

/**
 * Fetch medication for stock adjustment
 */
async function getMedicationForAdjustment(id: string) {
  try {
    const response = await fetchWithAuth(
      `${API_ENDPOINTS.MEDICATIONS.BASE}/inventory/${id}`,
      { next: { tags: [`inventory-${id}`] } }
    );

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
 * Stock Adjustment Page
 */
export default async function StockAdjustmentPage({ params }: StockAdjustmentPageProps) {
  const item = await getMedicationForAdjustment(params.id);

  if (!item) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Adjust Stock Level"
        description={`${item.medicationName} - Current: ${item.quantity} ${item.quantityUnit || 'units'}`}
        backLink={`/medications/inventory/${params.id}`}
        backLabel="Back to Item"
      />

      {/* Important Information */}
      <div className="rounded-md bg-blue-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Stock Adjustment Requirements</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc space-y-1 pl-5">
                <li>Provide detailed reason for adjustment</li>
                <li>Controlled substances require witness signature</li>
                <li>All adjustments are permanently logged with HIPAA audit trail</li>
                <li>Include lot number if adding new stock</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Suspense fallback={<FormLoadingSkeleton />}>
        <div className="mx-auto max-w-3xl">
          <StockAdjustmentForm
            medicationId={params.id}
            currentQuantity={item.quantity}
            quantityUnit={item.quantityUnit}
            isControlledSubstance={item.isControlledSubstance}
            medicationName={item.medicationName}
          />
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
          {[...Array(7)].map((_, i) => (
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
