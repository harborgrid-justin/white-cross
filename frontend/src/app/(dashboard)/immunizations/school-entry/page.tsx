/**
 * @fileoverview School Entry Requirements Page
 * @module app/(dashboard)/immunizations/school-entry/page
 *
 * School entry immunization requirements and compliance verification.
 *
 * @since 1.0.0
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'School Entry Requirements | Immunizations',
  description: 'School entry immunization requirements and compliance',
};

export default async function SchoolEntryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <PageHeader
          title="School Entry Requirements"
          description="State-specific school entry immunization requirements"
        />

        <div className="mt-6">
          <Suspense fallback={<Skeleton className="h-64" />}>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">School entry requirements coming soon...</p>
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
