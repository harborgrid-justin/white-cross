/**
 * @fileoverview Expiring Inventory Page
 * @module app/(dashboard)/medications/inventory/expiring
 *
 * Medications expiring soon requiring replacement or disposal.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import ExpiringMedicationsList from '@/components/medications/ExpiringMedicationsList';
import { PageHeader } from '@/components/shared/PageHeader';
import { fetchWithAuth } from '@/lib/server/fetch';
import { API_ENDPOINTS } from '@/constants/api';

export const metadata: Metadata = {
  title: 'Expiring Medications | White Cross',
  description: 'Medications nearing expiration requiring action'
};



interface ExpiringPageProps {
  searchParams: {
    days?: string;
  };
}

/**
 * Fetch expiring medications
 */
async function getExpiringMedications(searchParams: any) {
  const params = new URLSearchParams({
    days: searchParams.days || '90' // Default 90-day look ahead
  });

  try {
    const response = await fetchWithAuth(
      `${API_ENDPOINTS.MEDICATIONS.BASE}/inventory/expiring?${params}`,
      { next: { tags: ['inventory-expiring'], revalidate: 3600 } }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch expiring medications');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching expiring medications:', error);
    return { expired: [], expiring30: [], expiring60: [], expiring90: [], total: 0 };
  }
}

/**
 * Expiring Medications Page
 */
export default async function ExpiringMedicationsPage({ searchParams }: ExpiringPageProps) {
  const { expired, expiring30, expiring60, expiring90, total } = await getExpiringMedications(searchParams);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expiring Medications"
        description="Medications nearing expiration date requiring replacement"
        backLink="/medications/inventory"
        backLabel="Back to Inventory"
      />

      {/* Expired Alert */}
      {expired && expired.length > 0 && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {expired.length} expired medication{expired.length !== 1 ? 's' : ''}
              </h3>
              <p className="mt-1 text-sm text-red-700">
                Remove and properly dispose of expired medications immediately. Do not administer.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Expiring Soon Warning */}
      {expiring30 && expiring30.length > 0 && (
        <div className="rounded-md bg-orange-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-orange-800">
                {expiring30.length} medication{expiring30.length !== 1 ? 's' : ''} expiring within 30 days
              </h3>
              <p className="mt-1 text-sm text-orange-700">
                Order replacements immediately to prevent gaps in medication availability.
              </p>
            </div>
          </div>
        </div>
      )}

      <Suspense fallback={<ExpiringLoadingSkeleton />}>
        <ExpiringMedicationsList
          expired={expired}
          expiring30={expiring30}
          expiring60={expiring60}
          expiring90={expiring90}
          total={total}
        />
      </Suspense>
    </div>
  );
}

function ExpiringLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Expired Section */}
      <div className="space-y-3">
        <div className="h-6 w-48 rounded bg-gray-200"></div>
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-20 rounded border border-red-200 bg-white"></div>
        ))}
      </div>
      {/* Expiring Sections */}
      {[...Array(3)].map((_, sectionIdx) => (
        <div key={sectionIdx} className="space-y-3">
          <div className="h-6 w-48 rounded bg-gray-200"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 rounded border border-orange-200 bg-white"></div>
          ))}
        </div>
      ))}
    </div>
  );
}
