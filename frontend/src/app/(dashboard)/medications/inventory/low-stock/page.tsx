/**
 * @fileoverview Low Stock Alert Page
 * @module app/(dashboard)/medications/inventory/low-stock
 *
 * Medications with stock levels at or below threshold requiring reorder.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import LowStockList from '@/components/medications/LowStockList';
import { PageHeader } from '@/components/shared/PageHeader';
import { fetchWithAuth } from '@/lib/server/fetch';
import { API_ENDPOINTS } from '@/constants/api';

export const metadata: Metadata = {
  title: 'Low Stock Alerts | White Cross',
  description: 'Medications requiring reorder due to low stock levels'
};

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";

/**
 * Fetch low stock items
 */
async function getLowStockItems() {
  try {
    const response = await fetchWithAuth(
      `${API_ENDPOINTS.MEDICATIONS.BASE}/inventory/low-stock`,
      { next: { tags: ['inventory-low-stock'], revalidate: 300 } }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch low stock items');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching low stock items:', error);
    return { items: [], total: 0, criticalCount: 0 };
  }
}

/**
 * Low Stock Page
 */
export default async function LowStockPage() {
  const { items, total, criticalCount } = await getLowStockItems();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Low Stock Alerts"
        description="Medications requiring reorder to maintain adequate stock levels"
        backLink="/medications/inventory"
        backLabel="Back to Inventory"
      />

      {/* Critical Stock Alert */}
      {criticalCount > 0 && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {criticalCount} critical stock level{criticalCount !== 1 ? 's' : ''}
              </h3>
              <p className="mt-1 text-sm text-red-700">
                Some medications are critically low. Order immediately to prevent stockouts.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Low Stock Summary */}
      {total > 0 && (
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                {total} medication{total !== 1 ? 's' : ''} with low stock
              </h3>
              <p className="mt-1 text-sm text-yellow-700">
                Review reorder quantities and place orders to maintain stock levels.
              </p>
            </div>
          </div>
        </div>
      )}

      {total === 0 && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">All stock levels adequate</h3>
              <p className="mt-1 text-sm text-green-700">
                No medications are below stock thresholds at this time.
              </p>
            </div>
          </div>
        </div>
      )}

      <Suspense fallback={<LowStockLoadingSkeleton />}>
        <LowStockList items={items} total={total} criticalCount={criticalCount} />
      </Suspense>
    </div>
  );
}

function LowStockLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-24 rounded border border-yellow-200 bg-white"></div>
      ))}
    </div>
  );
}
