/**
 * @fileoverview Catch-Up Schedules Page
 * @module app/(dashboard)/immunizations/schedules/catch-up/page
 *
 * CDC catch-up schedules for missed vaccinations.
 *
 * @since 1.0.0
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Catch-Up Schedules | Immunizations',
  description: 'CDC catch-up schedules for missed vaccinations',
};

export default async function CatchUpSchedulesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <PageHeader
          title="Catch-Up Schedules"
          description="CDC catch-up schedules for students with missed vaccinations"
        />

        <div className="mt-6">
          <Suspense fallback={<Skeleton className="h-64" />}>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Catch-up schedule information coming soon...</p>
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
