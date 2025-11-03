/**
 * @fileoverview Compliance Report Page
 * @module app/(dashboard)/immunizations/reports/compliance/page
 *
 * Detailed compliance report with vaccination coverage metrics.
 *
 * @since 1.0.0
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Compliance Report | Immunizations',
  description: 'Student compliance rates and vaccination coverage',
};

export default async function ComplianceReportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <PageHeader
          title="Compliance Report"
          description="Student compliance rates and vaccination coverage analysis"
          actions={
            <div className="flex gap-2">
              <Button variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="default">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          }
        />

        <div className="mt-6">
          <Suspense fallback={<Skeleton className="h-96" />}>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Compliance Overview</h3>
              <p className="text-gray-600">Detailed compliance metrics coming soon...</p>
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
