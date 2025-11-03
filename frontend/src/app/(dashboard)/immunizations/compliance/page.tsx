/**
 * @fileoverview Compliance Dashboard Page
 * @module app/(dashboard)/immunizations/compliance/page
 *
 * Comprehensive compliance tracking and monitoring dashboard.
 *
 * @since 1.0.0
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { ListChecks } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Compliance Dashboard | Immunizations',
  description: 'Overall immunization compliance tracking and monitoring',
};

function ComplianceLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}

export default async function ComplianceDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <PageHeader
          title="Compliance Dashboard"
          description="Overall immunization compliance tracking and state requirements"
          icon={<ListChecks className="h-6 w-6 text-blue-600" />}
        />

        <div className="mt-6">
          <Suspense fallback={<ComplianceLoadingSkeleton />}>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center py-12">
                <ListChecks className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Compliance Dashboard
                </h3>
                <p className="text-gray-600">
                  Comprehensive compliance tracking with state requirements and CDC guidelines.
                </p>
              </div>
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
