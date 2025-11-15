/**
 * @fileoverview Administration Rules Page
 * @module app/(dashboard)/medications/administration-rules
 *
 * Configure medication administration timing rules, safety protocols, and Five Rights enforcement.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import AdministrationRules from '@/components/medications/AdministrationRules';
import { PageHeader } from '@/components/shared/PageHeader';
import { getAdministrationRules } from '@/lib/actions/medications.actions';
import { API_ENDPOINTS } from '@/constants/api';

export const metadata: Metadata = {
  title: 'Administration Rules | White Cross',
  description: 'Configure medication administration rules and safety protocols'
};



/**
 * Fetch administration rules
 */
async function getAdministrationRules() {
  try {
    return await getAdministrationRules();
  } catch (error) {
    console.error('Error fetching administration rules:', error);
    return { rules: [], defaults: {} };
  }
}

/**
 * Administration Rules Page
 */
export default async function AdministrationRulesPage() {
  const { rules, defaults } = await getAdministrationRules();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Medication Administration Rules"
        description="Configure timing rules, safety protocols, and Five Rights enforcement"
        backLink="/medications/settings"
        backLabel="Back to Settings"
      />

      {/* Important Safety Notice */}
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Critical Safety Rules</h3>
            <div className="mt-2 text-sm text-red-700">
              <ul className="list-disc space-y-1 pl-5">
                <li>Five Rights verification is MANDATORY for all administrations</li>
                <li>Witness signature required for controlled substances</li>
                <li>Minimum time intervals between doses must be enforced</li>
                <li>Parent consent required for OTC medications</li>
                <li>Emergency protocols must be followed for emergency medications</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-md bg-blue-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Administration Rule Types</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="space-y-1">
                <li><strong>Timing Rules:</strong> Administration windows, intervals, max daily doses</li>
                <li><strong>Safety Rules:</strong> Contraindications, drug interactions, allergies</li>
                <li><strong>Consent Rules:</strong> Parent consent, physician orders, authorization</li>
                <li><strong>Documentation Rules:</strong> Required fields, witness signatures, audit logs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Suspense fallback={<RulesLoadingSkeleton />}>
        <AdministrationRules rules={rules} defaults={defaults} />
      </Suspense>
    </div>
  );
}

function RulesLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="h-96 rounded-lg border border-gray-200 bg-white p-6"></div>
        <div className="h-96 rounded-lg border border-gray-200 bg-white p-6"></div>
      </div>
      <div className="h-64 rounded-lg border border-gray-200 bg-white p-6"></div>
    </div>
  );
}
