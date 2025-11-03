/**
 * @fileoverview State Reporting Page
 * @module app/(dashboard)/immunizations/reports/state-reporting/page
 *
 * State immunization registry export and submission.
 *
 * @since 1.0.0
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

export const metadata: Metadata = {
  title: 'State Reporting | Immunizations',
  description: 'State immunization registry reporting',
};

export default async function StateReportingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <PageHeader
          title="State Reporting"
          description="State immunization registry export and submission"
          actions={
            <Button variant="default">
              <Upload className="h-4 w-4 mr-2" />
              Submit to Registry
            </Button>
          }
        />

        <div className="mt-6">
          <Suspense fallback={<Skeleton className="h-96" />}>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">State reporting interface coming soon...</p>
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
