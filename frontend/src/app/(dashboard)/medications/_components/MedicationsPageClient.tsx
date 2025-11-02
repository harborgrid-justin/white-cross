/**
 * Medications Page Client Component
 *
 * Client-side interactive component for medication management dashboard.
 * Handles state management, data fetching, and user interactions.
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layouts/PageHeader';
import { PageBreadcrumbs } from '@/components/common/PageBreadcrumbs';
import { getMedicationsDashboardData } from '@/lib/actions/medications.actions';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/useToast';
import type {
  Medication,
  MedicationStats,
} from '@/types/medications';

export function MedicationsPageClient() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [stats, setStats] = useState<MedicationStats>({
    totalMedications: 0,
    activePrescriptions: 0,
    administeredToday: 0,
    adverseReactions: 0,
    lowStockCount: 0,
    expiringCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showError } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { medications: medicationsData, stats: statsData, error: dataError } =
          await getMedicationsDashboardData({ page: 1, limit: 50 });

        setMedications(medicationsData);
        setStats(statsData);

        if (dataError) {
          setError(dataError);
          showError(dataError);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching medication data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load medication data');
        showError('Failed to load medication data');
        setLoading(false);
      }
    };

    fetchData();
  }, [showError]);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageBreadcrumbs
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Medications' },
          ]}
          className="mb-4"
        />
        <PageHeader
          title="Medications"
          description="Manage and track all student medications"
        />
        <MedicationsLoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageBreadcrumbs
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Medications' },
          ]}
          className="mb-4"
        />
        <PageHeader
          title="Medications"
          description="Manage and track all student medications"
        />
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          <h3 className="font-medium">Error Loading Medications</h3>
          <p className="mt-1 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageBreadcrumbs
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Medications' },
        ]}
        className="mb-4"
      />
      <PageHeader
        title="Medications"
        description="Manage and track all student medications"
        actions={
          <Link href="/medications/new">
            <Button variant="default">Add Medication</Button>
          </Link>
        }
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <StatCard
          label="Total Medications"
          value={stats.totalMedications}
          href="/medications"
          color="blue"
        />
        <StatCard
          label="Active Prescriptions"
          value={stats.activePrescriptions}
          href="/medications?status=active"
          color="green"
        />
        <StatCard
          label="Administered Today"
          value={stats.administeredToday}
          href="/medications/administration-log"
          color="blue"
        />
        <StatCard
          label="Adverse Reactions"
          value={stats.adverseReactions}
          href="/medications/adverse-reactions"
          color="yellow"
        />
        <StatCard
          label="Low Stock"
          value={stats.lowStockCount}
          href="/medications/inventory/low-stock"
          color="orange"
        />
        <StatCard
          label="Expiring Soon"
          value={stats.expiringCount}
          href="/medications/inventory/expiring"
          color="red"
        />
      </div>

      {/* Medications List */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Medications ({medications.length})
          </h3>

          {medications.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No medications found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding your first medication to the formulary.
              </p>
              <div className="mt-6">
                <Link href="/medications/new">
                  <Button variant="default">Add Medication</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {medications.map((medication) => (
                <MedicationCard
                  key={medication.id}
                  medication={medication}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}

function MedicationCard({ medication }: { medication: Medication }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">
                {medication.name}
              </h4>
              {medication.genericName && (
                <p className="text-sm text-gray-500">
                  Generic: {medication.genericName}
                </p>
              )}
              <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                <span>{medication.dosageForm}</span>
                <span>{medication.strength}</span>
                {medication.manufacturer && (
                  <span>{medication.manufacturer}</span>
                )}
                {medication.isControlled && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                    Controlled
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link href={`/medications/${medication.id}`}>
            <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function MedicationsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Statistics Cards Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-200 bg-white p-5 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 w-20 rounded bg-gray-200 mb-2"></div>
                <div className="h-8 w-12 rounded bg-gray-200"></div>
              </div>
              <div className="h-12 w-12 rounded-full bg-gray-200"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Medications List Skeleton */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="p-6">
          <div className="h-6 w-48 rounded bg-gray-200 mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-lg p-4 animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 w-32 rounded bg-gray-200 mb-2"></div>
                    <div className="h-3 w-24 rounded bg-gray-100 mb-2"></div>
                    <div className="flex space-x-4">
                      <div className="h-3 w-16 rounded bg-gray-100"></div>
                      <div className="h-3 w-12 rounded bg-gray-100"></div>
                      <div className="h-3 w-20 rounded bg-gray-100"></div>
                    </div>
                  </div>
                  <div className="h-8 w-24 rounded bg-gray-200"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
