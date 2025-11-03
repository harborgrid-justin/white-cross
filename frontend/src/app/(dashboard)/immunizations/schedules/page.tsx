/**
 * @fileoverview CDC Recommended Schedules Page
 * @module app/(dashboard)/immunizations/schedules/page
 *
 * CDC/ACIP recommended vaccination schedules by age group.
 *
 * @since 1.0.0
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export const metadata: Metadata = {
  title: 'CDC Schedules | Immunizations',
  description: 'CDC/ACIP recommended vaccination schedules',
};

function SchedulesLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    </div>
  );
}

export default async function SchedulesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <PageHeader
          title="CDC Recommended Schedules"
          description="CDC/ACIP vaccination schedules by age group"
          actions={
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Schedule
            </Button>
          }
        />

        <div className="mt-6">
          <Suspense fallback={<SchedulesLoadingSkeleton />}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">Birth-6 Years</h3>
                <p className="text-sm text-gray-600">Childhood immunization schedule</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">7-18 Years</h3>
                <p className="text-sm text-gray-600">Adolescent immunization schedule</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">Catch-Up</h3>
                <p className="text-sm text-gray-600">Catch-up schedules for missed vaccines</p>
              </div>
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
