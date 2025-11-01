/**
 * @fileoverview Compliance Report Page
 * @module app/(dashboard)/medications/reports/compliance
 *
 * HIPAA compliance audit report with adherence tracking and violations.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import ComplianceReport from '@/components/medications/reports/ComplianceReport';
import { PageHeader } from '@/components/shared/PageHeader';
import { fetchWithAuth } from '@/lib/server/fetch';
import { API_ENDPOINTS } from '@/constants/api';

export const metadata: Metadata = {
  title: 'Compliance Report | White Cross',
  description: 'HIPAA compliance and medication adherence tracking'
};



interface ComplianceReportPageProps {
  searchParams: {
    startDate?: string;
    endDate?: string;
    studentId?: string;
  };
}

/**
 * Fetch compliance report data
 */
async function getComplianceReportData(searchParams: any) {
  const params = new URLSearchParams({
    startDate: searchParams.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: searchParams.endDate || new Date().toISOString().split('T')[0],
    ...(searchParams.studentId && { studentId: searchParams.studentId })
  });

  try {
    const response = await fetchWithAuth(
      `${API_ENDPOINTS.MEDICATIONS.BASE}/reports/compliance?${params}`,
      { next: { revalidate: 900 } } // 15 min cache
    );

    if (!response.ok) {
      throw new Error('Failed to fetch compliance report');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching compliance report:', error);
    return { complianceScore: 0, adherence: {}, violations: [], auditLog: [] };
  }
}

/**
 * Compliance Report Page
 *
 * Critical report for HIPAA audit compliance and medication adherence.
 */
export default async function ComplianceReportPage({ searchParams }: ComplianceReportPageProps) {
  const reportData = await getComplianceReportData(searchParams);

  return (
    <div className="space-y-6">
      <PageHeader
        title="HIPAA Compliance & Adherence Report"
        description="Audit compliance, medication adherence, and violation tracking"
        backLink="/medications/reports"
        backLabel="Back to Reports"
      />

      {/* Compliance Score Banner */}
      {reportData.complianceScore < 90 && (
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Compliance score below target: {reportData.complianceScore}%
              </h3>
              <p className="mt-1 text-sm text-yellow-700">
                Target compliance score is 95%. Review violations and implement corrective actions.
              </p>
            </div>
          </div>
        </div>
      )}

      <Suspense fallback={<ComplianceLoadingSkeleton />}>
        <ComplianceReport data={reportData} filters={searchParams} />
      </Suspense>
    </div>
  );
}

function ComplianceLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 rounded-lg border border-gray-200 bg-white"></div>
        ))}
      </div>
      <div className="h-96 rounded-lg border border-gray-200 bg-white"></div>
      <div className="h-64 rounded-lg border border-gray-200 bg-white"></div>
    </div>
  );
}
