/**
 * @fileoverview Medication Settings Page
 * @module app/(dashboard)/medications/settings
 *
 * Global medication module settings and configuration.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import MedicationSettings from '@/components/medications/MedicationSettings';
import { PageHeader } from '@/components/shared/PageHeader';
import { fetchWithAuth } from '@/lib/server/fetch';
import { API_ENDPOINTS } from '@/constants/api';

export const metadata: Metadata = {
  title: 'Medication Settings | White Cross',
  description: 'Configure medication module settings and preferences'
};

// Force dynamic rendering due to auth requirements
export const dynamic = 'force-dynamic';

/**
 * Fetch settings
 */
async function getSettings() {
  try {
    const response = await fetchWithAuth(
      `${API_ENDPOINTS.MEDICATIONS.BASE}/settings`,
      { next: { tags: ['medication-settings'], revalidate: 600 } }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch settings');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching settings:', error);
    return { settings: {}, defaults: {} };
  }
}

/**
 * Medication Settings Page
 */
export default async function MedicationSettingsPage() {
  const { settings, defaults } = await getSettings();

  const settingsLinks = [
    {
      id: 'categories',
      title: 'Medication Categories',
      description: 'Manage medication categories and types',
      href: '/medications/categories',
      icon: 'folder',
      color: 'blue'
    },
    {
      id: 'administration-rules',
      title: 'Administration Rules',
      description: 'Configure administration timing and safety rules',
      href: '/medications/administration-rules',
      icon: 'shield-check',
      color: 'green'
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Medication Settings"
        description="Configure medication module settings and preferences"
        backLink="/medications"
        backLabel="Back to Medications"
      />

      {/* Quick Settings Links */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {settingsLinks.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 hover:border-indigo-500 hover:shadow-lg transition-all"
          >
            <div className="space-y-4">
              <div className={`inline-flex rounded-lg bg-${link.color}-100 p-3`}>
                <svg className={`h-6 w-6 text-${link.color}-600`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600">
                  {link.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {link.description}
                </p>
              </div>
            </div>
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      <Suspense fallback={<SettingsLoadingSkeleton />}>
        <MedicationSettings settings={settings} defaults={defaults} />
      </Suspense>
    </div>
  );
}

function SettingsLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-64 rounded-lg border border-gray-200 bg-white p-6"></div>
      <div className="h-96 rounded-lg border border-gray-200 bg-white p-6"></div>
    </div>
  );
}
