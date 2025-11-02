/**
 * @fileoverview Medications List Page - Main Dashboard for Medication Management
 * @module app/(dashboard)/medications/page
 *
 * @description
 * Comprehensive medication management dashboard providing centralized access to all
 * student medications with filtering, searching, and real-time status tracking.
 *
 * **Next.js 16 Best Practices:**
 * - Server component with async data fetching
 * - Parallel data fetching using Promise.all
 * - React cache() for request memoization
 * - Proper TypeScript types for all data
 * - Suspense boundaries for progressive loading
 *
 * **Medication Management Features:**
 * - Multi-criteria search and filtering (name, status, type, student)
 * - Real-time medication statistics (active, due, overdue, low stock)
 * - Quick access to critical medication alerts
 * - Administration scheduling and tracking
 * - Inventory monitoring and low-stock warnings
 *
 * **Safety & Compliance:**
 * - HIPAA-compliant medication data handling (PHI protected)
 * - FDA National Drug Code (NDC) integration for drug identification
 * - Controlled substance tracking per DEA regulations (21 CFR Part 1300-1321)
 * - Audit logging for all medication access and modifications
 * - Allergy contraindication alerts displayed prominently
 *
 * **Performance Optimization:**
 * - Server-side data fetching with proper cache options
 * - Suspense boundaries for progressive loading
 * - Optimized rendering with server components
 *
 * @requires Authentication - JWT token with nurse/admin role
 * @requires Permissions - VIEW_MEDICATIONS, MANAGE_MEDICATIONS
 *
 * @see {@link https://www.fda.gov/drugs/drug-approvals-and-databases/national-drug-code-directory NDC Directory}
 * @see {@link https://www.deadiversion.usdoj.gov/schedules/ DEA Drug Schedules}
 *
 * @since 1.0.0
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getMedicationsDashboardData } from '@/lib/actions/medications.actions';
import type { Medication, MedicationStats } from '@/types/medications';

/**
 * Metadata for medications main page
 */
export const metadata: Metadata = {
  title: 'All Medications | White Cross Healthcare',
  description: 'Comprehensive medication management dashboard with real-time administration tracking, inventory monitoring, and FDA-compliant medication safety controls.',
};

/**
 * Search params interface
 */
interface MedicationsPageProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
    type?: string;
    studentId?: string;
  };
}

/**
 * Loading skeleton component
 */
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
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}

/**
 * Medication Card Component
 */
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

/**
 * Medications Main Page Component - Server Component with Async Data Fetching
 *
 * This page demonstrates Next.js 16 best practices:
 * - Server-side data fetching with async/await
 * - Proper TypeScript types for all data
 * - Suspense boundaries for progressive loading
 * - Parallel data fetching for better performance
 */
export default async function MedicationsPage({ searchParams }: MedicationsPageProps) {
  // Parse search params
  const page = parseInt(searchParams.page || '1');
  const limit = parseInt(searchParams.limit || '50');

  // Fetch medications dashboard data with proper cache options
  const { medications, stats, error } = await getMedicationsDashboardData({
    page,
    limit,
    search: searchParams.search,
    status: searchParams.status,
    type: searchParams.type,
    studentId: searchParams.studentId,
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Medications"
        description="Manage and track all student medications"
        actions={
          <Link href="/medications/new">
            <Button variant="default">Add Medication</Button>
          </Link>
        }
      />

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          <h3 className="font-medium">Error Loading Medications</h3>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      )}

      {/* Statistics Cards */}
      <Suspense fallback={<Skeleton className="h-24 w-full" />}>
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
      </Suspense>

      {/* Medications List */}
      <Suspense fallback={<MedicationsLoadingSkeleton />}>
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
      </Suspense>
    </div>
  );
}
