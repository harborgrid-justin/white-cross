/**
 * @fileoverview Exemption Tracking Report Page
 * @module app/(dashboard)/immunizations/reports/exemptions/page
 *
 * Exemption statistics and trend analysis.
 *
 * @since 1.0.0
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Exemption Tracking | Immunizations',
  description: 'Exemption statistics and trends',
};

export default async function ExemptionTrackingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <PageHeader
          title="Exemption Tracking Report"
          description="Exemption statistics, trends, and approval status"
        />

        <div className="mt-6">
          <Suspense fallback={<Skeleton className="h-96" />}>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Exemption tracking report coming soon...</p>
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
