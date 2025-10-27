/**
 * @fileoverview Medication Detail Page
 * @module app/(dashboard)/medications/[id]/page
 *
 * Displays detailed information about a single medication.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/layouts/PageHeader';
import { fetchWithAuth } from '@/lib/server/fetch';
import { API_ENDPOINTS } from '@/constants/api';
import MedicationDetails from '@/components/medications/core/MedicationDetails';
import AdministrationLog from '@/components/medications/administration/AdministrationLog';
import { Button } from '@/components/ui/Button';

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";

import {
  PencilIcon,
  ClockIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

interface MedicationDetailPageProps {
  params: {
    id: string;
  };
}

/**
 * Generate metadata for medication detail page
 */
export async function generateMetadata({
  params
}: MedicationDetailPageProps): Promise<Metadata> {
  const medication = await getMedication(params.id);

  if (!medication) {
    return {
      title: 'Medication Not Found'
    };
  }

  return {
    title: medication.name,
    description: `${medication.name} medication details and administration history`
  };
}

/**
 * Fetch medication data
 */
async function getMedication(id: string) {
  try {
    const response = await fetchWithAuth(
      API_ENDPOINTS.MEDICATIONS.DETAIL(id),
      { next: { revalidate: 60 } } // 1 min cache
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
 * Fetch recent administrations
 */
async function getRecentAdministrations(medicationId: string) {
  try {
    const response = await fetchWithAuth(
      `${API_ENDPOINTS.ADMINISTRATION_LOG.BY_MEDICATION(medicationId)}?limit=10`,
      { next: { revalidate: 30 } } // 30 sec cache
    );

    if (!response.ok) {
      throw new Error('Failed to fetch administrations');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching administrations:', error);
    return { data: [] };
  }
}

/**
 * Medication Detail Page
 *
 * Server Component displaying comprehensive medication information.
 */
export default async function MedicationDetailPage({
  params
}: MedicationDetailPageProps) {
  const medication = await getMedication(params.id);

  if (!medication) {
    notFound();
  }

  const administrations = await getRecentAdministrations(params.id);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={medication.name}
        description={medication.genericName || 'Medication details and administration'}
        backLink="/medications"
        backLabel="Back to Medications"
        action={
          <div className="flex gap-2">
            <Link href={`/medications/${params.id}/edit`}>
              <Button variant="secondary" icon={<PencilIcon className="h-5 w-5" />}>
                Edit
              </Button>
            </Link>
            <Link href={`/medications/${params.id}/administer`}>
              <Button variant="primary" icon={<ClockIcon className="h-5 w-5" />}>
                Record Administration
              </Button>
            </Link>
            <Link href="/medications/interactions">
              <Button
                variant="secondary"
                icon={<BeakerIcon className="h-5 w-5" />}
              >
                Check Interactions
              </Button>
            </Link>
          </div>
        }
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Medication Details */}
        <div className="lg:col-span-2 space-y-6">
          <Suspense fallback={<DetailsSkeleton />}>
            <MedicationDetails medication={medication} />
          </Suspense>

          {/* Recent Administration Log */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Administrations
              </h2>
              <Link
                href={`/medications/${params.id}/administration-log`}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View All →
              </Link>
            </div>
            <Suspense fallback={<LogSkeleton />}>
              <AdministrationLog
                medicationId={params.id}
                initialData={administrations.data}
                limit={10}
              />
            </Suspense>
          </div>
        </div>

        {/* Right Column - Quick Actions & Info */}
        <div className="space-y-6">
          {/* Quick Info Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 font-semibold text-gray-900">Quick Info</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      medication.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {medication.status}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Dosage</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {medication.dosage}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Route</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {medication.route}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Frequency</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {medication.frequency}
                </dd>
              </div>
              {medication.nextDue && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Next Due</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(medication.nextDue).toLocaleString()}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Student Info */}
          {medication.student && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="mb-4 font-semibold text-gray-900">
                Student Information
              </h3>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <span className="text-lg font-semibold">
                      {medication.student.firstName[0]}
                      {medication.student.lastName[0]}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <Link
                    href={`/students/${medication.student.id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    {medication.student.firstName} {medication.student.lastName}
                  </Link>
                  <p className="text-xs text-gray-500">
                    Grade {medication.student.gradeLevel}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 font-semibold text-gray-900">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                href={`/medications/${params.id}/administration-log`}
                className="block rounded-md bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                View Full Administration Log
              </Link>
              <Link
                href={`/medications/${params.id}/edit`}
                className="block rounded-md bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Edit Medication
              </Link>
              <Link
                href={`/medications/schedule?medicationId=${params.id}`}
                className="block rounded-md bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                View Schedule
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Details Loading Skeleton
 */
function DetailsSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-gray-200 bg-white p-6">
      <div className="space-y-4">
        <div className="h-6 w-1/4 rounded bg-gray-200"></div>
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-gray-100"></div>
          <div className="h-4 w-5/6 rounded bg-gray-100"></div>
        </div>
      </div>
    </div>
  );
}

/**
 * Log Loading Skeleton
 */
function LogSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-3">
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
