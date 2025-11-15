/**
 * @fileoverview Controlled Substances Page
 * @module app/(dashboard)/medications/controlled-substances
 *
 * DEA-regulated controlled substances with enhanced security and witness requirements.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import ControlledSubstancesList from '@/components/medications/ControlledSubstancesList';
import { PageHeader } from '@/components/shared/PageHeader';
import { getControlledSubstances } from '@/lib/actions/medications.actions';
import { API_ENDPOINTS } from '@/constants/api';

export const metadata: Metadata = {
  title: 'Controlled Substances | White Cross',
  description: 'Manage DEA-regulated controlled substances with enhanced security'
};



/**
 * Fetch controlled substances
 */
async function getControlledSubstances() {
  try {
    const result = await getControlledSubstances();
    if (!result) {
      return { medications: [], total: 0, inventoryStats: {} };
    }
    return {
      medications: result.data || [],
      total: result.total || 0,
      inventoryStats: {} // TODO: Add inventory stats to action
    };
  } catch (error) {
    console.error('Error fetching controlled substances:', error);
    return { medications: [], total: 0, inventoryStats: {} };
  }
}

/**
 * Controlled Substances Page
 *
 * High-security page for DEA Schedule I-V controlled substances.
 */
export default async function ControlledSubstancesPage() {
  const { medications, total, inventoryStats } = await getControlledSubstances();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Controlled Substances"
        description="DEA-regulated medications with enhanced security protocols"
        backLink="/medications"
        backLabel="Back to Medications"
      >
        <Link
          href="/medications/new?type=controlled_substance"
          className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
        >
          <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          Add Controlled Substance
        </Link>
      </PageHeader>

      {/* Security Warning */}
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Enhanced Security Required</h3>
            <div className="mt-2 text-sm text-red-700">
              <ul className="list-disc space-y-1 pl-5">
                <li>All administrations require witness signature</li>
                <li>Inventory count verification required</li>
                <li>Enhanced HIPAA audit logging in effect</li>
                <li>DEA compliance protocols active</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Suspense fallback={<ControlledSubstancesLoadingSkeleton />}>
        <ControlledSubstancesList
          medications={medications}
          total={total}
          inventoryStats={inventoryStats}
        />
      </Suspense>
    </div>
  );
}

function ControlledSubstancesLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 rounded-lg border border-red-200 bg-white"></div>
        ))}
      </div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-28 rounded border border-red-200 bg-white"></div>
        ))}
      </div>
    </div>
  );
}
