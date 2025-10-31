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
import { fetchWithAuth } from '@/lib/server/fetch';
import { API_ENDPOINTS } from '@/constants/api';

export const metadata: Metadata = {
  title: 'Administration Report | White Cross',
  description: 'Detailed medication administration history and analytics'
};

// Force dynamic rendering due to auth requirements
export const dynamic = 'force-dynamic';

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
 * Fetch administration report data
 */
async function getAdministrationReportData(searchParams: any) {
  const params = new URLSearchParams({
    startDate: searchParams.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: searchParams.endDate || new Date().toISOString().split('T')[0],
    ...(searchParams.studentId && { studentId: searchParams.studentId }),
    ...(searchParams.medicationId && { medicationId: searchParams.medicationId }),
    ...(searchParams.administeredBy && { administeredBy: searchParams.administeredBy })
  });

  try {
    const response = await fetchWithAuth(
      `${API_ENDPOINTS.MEDICATIONS.BASE}/reports/administration?${params}`,
      { next: { revalidate: 600 } } // 10 min cache
    );

    if (!response.ok) {
      throw new Error('Failed to fetch administration report');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching administration report:', error);
    return { records: [], stats: {}, charts: {} };
  }
}

/**
 * Administration Report Page
 */
export default async function AdministrationReportPage({ searchParams }: AdministrationReportPageProps) {
  const reportData = await getAdministrationReportData(searchParams);

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
