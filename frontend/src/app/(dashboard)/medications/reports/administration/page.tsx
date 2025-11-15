/**
 * @fileoverview Administration Report Page
 * @module app/(dashboard)/medications/reports/administration
 *
 * Detailed medication administration report with filtering and export.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import AdministrationReport from '@/components/medications/reports/AdministrationReport';
import { PageHeader } from '@/components/shared/PageHeader';
import { getAdministrationReports } from '@/lib/actions/medications';

export const metadata: Metadata = {
  title: 'Administration Report | White Cross',
  description: 'Detailed medication administration history and analytics'
};



interface AdministrationReportPageProps {
  searchParams: {
    startDate?: string;
    endDate?: string;
    studentId?: string;
    medicationId?: string;
    administeredBy?: string;
  };
}

/**
 * Administration Report Page
 */
export default async function AdministrationReportPage({ searchParams }: AdministrationReportPageProps) {
  const reportData = await getAdministrationReports(searchParams);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Medication Administration Report"
        description="Comprehensive administration history with analytics"
        backLink="/medications/reports"
        backLabel="Back to Reports"
      />

      <Suspense fallback={<ReportLoadingSkeleton />}>
        <AdministrationReport data={reportData} filters={searchParams} />
      </Suspense>
    </div>
  );
}

function ReportLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-64 rounded-lg border border-gray-200 bg-white p-6"></div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="h-80 rounded-lg border border-gray-200 bg-white"></div>
        <div className="h-80 rounded-lg border border-gray-200 bg-white"></div>
      </div>
      <div className="h-96 rounded-lg border border-gray-200 bg-white"></div>
    </div>
  );
}
