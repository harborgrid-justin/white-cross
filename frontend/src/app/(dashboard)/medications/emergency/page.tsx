/**
 * @fileoverview Emergency Medications Page
 * @module app/(dashboard)/medications/emergency
 *
 * Emergency medications (EpiPens, rescue inhalers, etc.) with quick access protocols.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import EmergencyMedicationsList from '@/components/medications/EmergencyMedicationsList';
import { PageHeader } from '@/components/shared/PageHeader';
import { fetchWithAuth } from '@/lib/server/fetch';
import { API_ENDPOINTS } from '@/constants/api';

export const metadata: Metadata = {
  title: 'Emergency Medications | White Cross',
  description: 'Life-saving emergency medications with quick access protocols'
};

// Force dynamic rendering due to auth requirements
export const dynamic = 'force-dynamic';

/**
 * Fetch emergency medications
 */
async function getEmergencyMedications() {
  try {
    const response = await fetchWithAuth(
      `${API_ENDPOINTS.MEDICATIONS.BASE}?type=emergency`,
      { next: { tags: ['medications-emergency'], revalidate: 180 } }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch emergency medications');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching emergency medications:', error);
    return { medications: [], total: 0, expirationAlerts: [] };
  }
}

/**
 * Emergency Medications Page
 *
 * Critical medications requiring immediate access in emergency situations.
 */
export default async function EmergencyMedicationsPage() {
  const { medications, total, expirationAlerts } = await getEmergencyMedications();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Emergency Medications"
        description="Life-saving medications with quick access protocols"
        backLink="/medications"
        backLabel="Back to Medications"
      >
        <Link
          href="/medications/new?type=emergency"
          className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
        >
          <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          Add Emergency Medication
        </Link>
      </PageHeader>

      {/* Expiration Alerts */}
      {expirationAlerts && expirationAlerts.length > 0 && (
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                {expirationAlerts.length} emergency medication{expirationAlerts.length !== 1 ? 's' : ''} expiring soon
              </h3>
              <p className="mt-1 text-sm text-yellow-700">
                Check expiration dates and replace medications to ensure readiness for emergencies.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Critical Information */}
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Emergency Protocol</h3>
            <div className="mt-2 text-sm text-red-700">
              <ul className="list-disc space-y-1 pl-5">
                <li>Call 911 for life-threatening emergencies</li>
                <li>Administer emergency medication per protocol</li>
                <li>Notify parent/guardian immediately</li>
                <li>Document administration and response</li>
                <li>Complete incident report within 24 hours</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Suspense fallback={<EmergencyLoadingSkeleton />}>
        <EmergencyMedicationsList
          medications={medications}
          total={total}
          expirationAlerts={expirationAlerts}
        />
      </Suspense>
    </div>
  );
}

function EmergencyLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-32 rounded border border-red-200 bg-white p-4">
          <div className="space-y-2">
            <div className="h-5 w-3/4 rounded bg-gray-200"></div>
            <div className="h-4 w-1/2 rounded bg-gray-100"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
