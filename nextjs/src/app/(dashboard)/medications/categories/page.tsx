/**
 * @fileoverview Medication Categories Page
 * @module app/(dashboard)/medications/categories
 *
 * Manage medication categories, types, and classification system.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import MedicationCategories from '@/components/medications/MedicationCategories';
import { PageHeader } from '@/components/shared/PageHeader';
import { fetchWithAuth } from '@/lib/server/fetch';
import { API_ENDPOINTS } from '@/constants/api';

export const metadata: Metadata = {
  title: 'Medication Categories | White Cross',
  description: 'Manage medication categories and classification'
};

/**
 * Fetch categories
 */
async function getCategories() {
  try {
    const response = await fetchWithAuth(
      `${API_ENDPOINTS.MEDICATIONS.BASE}/categories`,
      { next: { tags: ['medication-categories'], revalidate: 600 } }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { categories: [], stats: {} };
  }
}

/**
 * Medication Categories Page
 */
export default async function MedicationCategoriesPage() {
  const { categories, stats } = await getCategories();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Medication Categories"
        description="Manage medication categories and types for better organization"
        backLink="/medications/settings"
        backLabel="Back to Settings"
      />

      <div className="rounded-md bg-blue-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Category Management</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Categories help organize medications for easier searching and reporting. Default categories include:
                Prescription, OTC, Controlled Substances, Emergency, PRN, Supplements.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Suspense fallback={<CategoriesLoadingSkeleton />}>
        <MedicationCategories categories={categories} stats={stats} />
      </Suspense>
    </div>
  );
}

function CategoriesLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 rounded-lg border border-gray-200 bg-white p-4"></div>
        ))}
      </div>
    </div>
  );
}
