/**
 * @fileoverview Inventory Report Page
 * @module app/(dashboard)/medications/reports/inventory
 *
 * Comprehensive medication inventory report with stock levels and usage analytics.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import InventoryReport from '@/components/medications/reports/InventoryReport';
import { PageHeader } from '@/components/shared/PageHeader';
import { fetchWithAuth } from '@/lib/server/fetch';
import { API_ENDPOINTS } from '@/constants/api';

export const metadata: Metadata = {
  title: 'Inventory Report | White Cross',
  description: 'Medication stock levels, usage rates, and inventory analytics'
};

// Force dynamic rendering due to auth requirements
export const dynamic = 'force-dynamic';

/**
 * Fetch inventory report data
 */
async function getInventoryReportData() {
  try {
    const response = await fetchWithAuth(
      `${API_ENDPOINTS.MEDICATIONS.BASE}/reports/inventory`,
      { next: { revalidate: 300 } } // 5 min cache
    );

    if (!response.ok) {
      throw new Error('Failed to fetch inventory report');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching inventory report:', error);
    return { inventory: [], lowStock: [], expiringSoon: [], usageStats: {} };
  }
}

/**
 * Inventory Report Page
 */
export default async function InventoryReportPage() {
  const reportData = await getInventoryReportData();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Medication Inventory Report"
        description="Stock levels, usage analytics, and reorder recommendations"
        backLink="/medications/reports"
        backLabel="Back to Reports"
      />

      {/* Low Stock Alert */}
      {reportData.lowStock && reportData.lowStock.length > 0 && (
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                {reportData.lowStock.length} medication{reportData.lowStock.length !== 1 ? 's' : ''} low on stock
              </h3>
              <p className="mt-1 text-sm text-yellow-700">
                Reorder medications to maintain adequate inventory levels.
              </p>
            </div>
          </div>
        </div>
      )}

      <Suspense fallback={<InventoryLoadingSkeleton />}>
        <InventoryReport data={reportData} />
      </Suspense>
    </div>
  );
}

function InventoryLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 rounded-lg border border-gray-200 bg-white"></div>
        ))}
      </div>
      <div className="h-96 rounded-lg border border-gray-200 bg-white"></div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="h-64 rounded-lg border border-gray-200 bg-white"></div>
        <div className="h-64 rounded-lg border border-gray-200 bg-white"></div>
      </div>
    </div>
  );
}
