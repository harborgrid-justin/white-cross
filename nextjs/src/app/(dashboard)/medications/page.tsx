/**
 * @fileoverview Medications List Page
 * @module app/(dashboard)/medications/page
 *
 * Main medications list page with filtering, searching, and sorting.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { fetchWithAuth } from '@/lib/server/fetch';
import { API_ENDPOINTS } from '@/constants/api';
import MedicationList from '@/components/medications/core/MedicationList';
import { Button } from '@/components/ui/Button';
import { PlusIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Medications',
  description: 'View and manage all medications'
};

interface MedicationsPageProps {
  searchParams: {
    search?: string;
    status?: string;
    type?: string;
    studentId?: string;
    page?: string;
    limit?: string;
  };
}

/**
 * Fetch medications data
 */
async function getMedications(searchParams: any) {
  const params = new URLSearchParams();

  if (searchParams.search) params.set('search', searchParams.search);
  if (searchParams.status) params.set('status', searchParams.status);
  if (searchParams.type) params.set('type', searchParams.type);
  if (searchParams.studentId) params.set('studentId', searchParams.studentId);
  if (searchParams.page) params.set('page', searchParams.page);
  if (searchParams.limit) params.set('limit', searchParams.limit);

  try {
    const response = await fetchWithAuth(
      `${API_ENDPOINTS.MEDICATIONS.BASE}?${params}`,
      { next: { revalidate: 300 } } // 5 min cache
    );

    if (!response.ok) {
      throw new Error('Failed to fetch medications');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching medications:', error);
    return {
      data: [],
      pagination: { total: 0, page: 1, limit: 20, pages: 0 }
    };
  }
}

/**
 * Fetch medication statistics
 */
async function getMedicationStats() {
  try {
    const response = await fetchWithAuth(
      `${API_ENDPOINTS.MEDICATIONS.BASE}/stats`,
      { next: { revalidate: 60 } } // 1 min cache
    );

    if (!response.ok) {
      return {
        total: 0,
        active: 0,
        dueToday: 0,
        overdue: 0,
        lowStock: 0
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      total: 0,
      active: 0,
      dueToday: 0,
      overdue: 0,
      lowStock: 0
    };
  }
}

/**
 * Medications Main Page
 *
 * Server Component that displays all medications with filtering and search.
 */
export default async function MedicationsPage({
  searchParams
}: MedicationsPageProps) {
  const [medications, stats] = await Promise.all([
    getMedications(searchParams),
    getMedicationStats()
  ]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Medications"
        description="Manage and track all student medications"
        action={
          <Link href="/medications/new">
            <Button variant="primary" icon={<PlusIcon className="h-5 w-5" />}>
              Add Medication
            </Button>
          </Link>
        }
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label="Total Medications"
          value={stats.total}
          href="/medications"
          color="blue"
        />
        <StatCard
          label="Active"
          value={stats.active}
          href="/medications?status=active"
          color="green"
        />
        <StatCard
          label="Due Today"
          value={stats.dueToday}
          href="/medications/administration-due"
          color="yellow"
        />
        <StatCard
          label="Overdue"
          value={stats.overdue}
          href="/medications/administration-overdue"
          color="red"
        />
        <StatCard
          label="Low Stock"
          value={stats.lowStock}
          href="/medications/inventory/low-stock"
          color="orange"
        />
      </div>

      {/* Medications List */}
      <Suspense fallback={<MedicationsLoadingSkeleton />}>
        <MedicationList
          initialData={medications.data}
          pagination={medications.pagination}
          searchParams={searchParams}
        />
      </Suspense>
    </div>
  );
}

/**
 * Stat Card Component
 */
function StatCard({
  label,
  value,
  href,
  color
}: {
  label: string;
  value: number;
  href: string;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'orange';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    red: 'bg-red-50 text-red-700',
    orange: 'bg-orange-50 text-orange-700'
  };

  return (
    <Link
      href={href}
      className="block rounded-lg border border-gray-200 bg-white p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        <div
          className={`rounded-full p-3 ${colorClasses[color]}`}
        >
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
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}

/**
 * Loading Skeleton
 */
function MedicationsLoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="h-24 rounded-lg border border-gray-200 bg-white p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/4 rounded bg-gray-200"></div>
              <div className="h-3 w-1/3 rounded bg-gray-100"></div>
            </div>
            <div className="h-8 w-20 rounded bg-gray-200"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
