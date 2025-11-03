/**
 * @fileoverview Scheduled Vaccines Page
 * @module app/(dashboard)/immunizations/scheduled/page
 *
 * Upcoming scheduled vaccination appointments.
 *
 * @since 1.0.0
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Scheduled Vaccines | Immunizations',
  description: 'Upcoming vaccination appointments',
};

export default async function ScheduledVaccinesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <PageHeader
          title="Scheduled Vaccines"
          description="Upcoming vaccination appointments"
        />

        <div className="mt-6">
          <Suspense fallback={<Skeleton className="h-64" />}>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Scheduled appointments coming soon...</p>
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
