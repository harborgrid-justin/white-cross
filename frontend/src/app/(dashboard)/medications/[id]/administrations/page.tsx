/**
 * @fileoverview Medication Administrations History Page
 * @module app/(dashboard)/medications/[id]/administrations/page
 *
 * Displays complete administration history for a medication.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/layouts/PageHeader';
import { fetchWithAuth } from '@/lib/server/fetch';
import { API_ENDPOINTS } from '@/constants/api';
import AdministrationLog from '@/components/medications/administration/AdministrationLog';
import AdherenceTracker from '@/components/medications/advanced/AdherenceTracker';
import { Button } from '@/components/ui/Button';
import { ClockIcon, ChartBarIcon } from '@heroicons/react/24/outline';

// Force dynamic rendering due to auth requirements
export const dynamic = 'force-dynamic';


interface AdministrationsPageProps {
  params: {
    id: string;
  };
  searchParams: {
    page?: string;
    limit?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
  };
}

/**
 * Generate metadata
 */
export async function generateMetadata({
  params
}: AdministrationsPageProps): Promise<Metadata> {
  const medication = await getMedication(params.id);

  return {
    title: `Administration History - ${medication?.name || 'Medication'}`,
    description: 'Complete administration history and adherence tracking'
  };
}

/**
 * Fetch medication data
 */
async function getMedication(id: string) {
  try {
    const response = await fetchWithAuth(
      API_ENDPOINTS.MEDICATIONS.DETAIL(id),
      { next: { revalidate: 300 } }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch medication');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching medication:', error);
    return null;
  }
}

/**
 * Fetch administration history
 */
async function getAdministrations(medicationId: string, searchParams: any) {
  const params = new URLSearchParams();

  if (searchParams.page) params.set('page', searchParams.page);
  if (searchParams.limit) params.set('limit', searchParams.limit);
  if (searchParams.startDate) params.set('startDate', searchParams.startDate);
  if (searchParams.endDate) params.set('endDate', searchParams.endDate);
  if (searchParams.status) params.set('status', searchParams.status);

  try {
    const response = await fetchWithAuth(
      `${API_ENDPOINTS.ADMINISTRATION_LOG.BY_MEDICATION(medicationId)}?${params}`,
      { next: { revalidate: 30 } } // 30 sec cache for real-time feel
    );

    if (!response.ok) {
      throw new Error('Failed to fetch administrations');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching administrations:', error);
    return {
      data: [],
      pagination: { total: 0, page: 1, limit: 50, pages: 0 },
      stats: {}
    };
  }
}

/**
 * Fetch adherence data
 */
async function getAdherenceData(medicationId: string) {
  try {
    const response = await fetchWithAuth(
      `${API_ENDPOINTS.MEDICATIONS.DETAIL(medicationId)}/adherence`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      return { rate: 0, streak: 0, missed: 0 };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching adherence:', error);
    return { rate: 0, streak: 0, missed: 0 };
  }
}

/**
 * Medication Administrations Page
 *
 * Complete administration history with filtering and adherence tracking.
 */
export default async function MedicationAdministrationsPage({
  params,
  searchParams
}: AdministrationsPageProps) {
  const medication = await getMedication(params.id);

  if (!medication) {
    notFound();
  }

  const [administrations, adherence] = await Promise.all([
    getAdministrations(params.id, searchParams),
    getAdherenceData(params.id)
  ]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={`${medication.name} - Administration History`}
        description="Complete administration log and adherence tracking"
        backLink={`/medications/${params.id}`}
        backLabel="Back to Medication"
        action={
          <Link href={`/medications/${params.id}/administer`}>
            <Button variant="primary" icon={<ClockIcon className="h-5 w-5" />}>
              Record Administration
            </Button>
          </Link>
        }
      />

      {/* Adherence Overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Adherence Rate</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {adherence.rate}%
              </p>
            </div>
            <div className="rounded-full bg-green-100 p-3 text-green-600">
              <ChartBarIcon className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Streak</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {adherence.streak} days
              </p>
            </div>
            <div className="rounded-full bg-blue-100 p-3 text-blue-600">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Missed Doses</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {adherence.missed}
              </p>
            </div>
            <div className="rounded-full bg-red-100 p-3 text-red-600">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Adherence Chart */}
      <Suspense fallback={<ChartSkeleton />}>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Adherence Trend
          </h2>
          <AdherenceTracker
            medicationId={params.id}
            dateRange={30} // Last 30 days
          />
        </div>
      </Suspense>

      {/* Administration Log */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Administration History
        </h2>
        <Suspense fallback={<LogSkeleton />}>
          <AdministrationLog
            medicationId={params.id}
            initialData={administrations.data}
            pagination={administrations.pagination}
            stats={administrations.stats}
            searchParams={searchParams}
            realtime={true}
          />
        </Suspense>
      </div>

      {/* Statistics Summary */}
      {administrations.stats && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Summary Statistics
          </h2>
          <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Total Administrations
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {administrations.stats.total || 0}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">On Time</dt>
              <dd className="mt-1 text-2xl font-semibold text-green-600">
                {administrations.stats.onTime || 0}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Late</dt>
              <dd className="mt-1 text-2xl font-semibold text-yellow-600">
                {administrations.stats.late || 0}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Missed</dt>
              <dd className="mt-1 text-2xl font-semibold text-red-600">
                {administrations.stats.missed || 0}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}

/**
 * Chart Loading Skeleton
 */
function ChartSkeleton() {
  return (
    <div className="h-64 animate-pulse rounded-lg bg-gray-100"></div>
  );
}

/**
 * Log Loading Skeleton
 */
function LogSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between border-b border-gray-100 pb-3"
        >
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 rounded bg-gray-200"></div>
            <div className="h-3 w-1/4 rounded bg-gray-100"></div>
          </div>
          <div className="h-6 w-16 rounded bg-gray-200"></div>
        </div>
      ))}
    </div>
  );
}
