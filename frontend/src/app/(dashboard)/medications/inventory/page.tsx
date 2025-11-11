/**
 * @fileoverview Medication Inventory Page
 * @module app/(dashboard)/medications/inventory
 *
 * Complete medication inventory management with stock tracking and alerts.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import InventoryList from '@/components/medications/InventoryList';
import { PageHeader } from '@/components/shared/PageHeader';
import { serverGet } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';

export const metadata: Metadata = {
  title: 'Medication Inventory | White Cross',
  description: 'Manage medication stock levels and inventory tracking'
};



interface InventoryPageProps {
  searchParams: {
    filter?: string;
    page?: string;
  };
}

/**
 * Fetch inventory data
 */
async function getInventoryData(searchParams: any): Promise<{
  inventory: unknown[];
  stats: Record<string, unknown>;
  alerts: unknown[];
  total: number;
}> {
  const params = new URLSearchParams({
    ...(searchParams.filter && { filter: searchParams.filter }),
    page: searchParams.page || '1',
    limit: '50'
  });

  try {
    return await serverGet(
      API_ENDPOINTS.INVENTORY.BASE,
      Object.fromEntries(params),
      { next: { tags: ['medication-inventory'], revalidate: 300 } }
    );
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return { inventory: [], stats: {}, alerts: [], total: 0 };
  }
}

/**
 * Medication Inventory Page
 */
export default async function InventoryPage({ searchParams }: InventoryPageProps) {
  const { inventory, stats, alerts, total } = await getInventoryData(searchParams);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Medication Inventory"
        subtitle="Manage stock levels, expiration dates, and inventory adjustments"
      >
        <div className="flex space-x-3">
          <Link
            href="/medications/inventory/low-stock"
            className="inline-flex items-center rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500"
          >
            Low Stock ({(stats as any).lowStockCount || 0})
          </Link>
          <Link
            href="/medications/inventory/expiring"
            className="inline-flex items-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500"
          >
            Expiring ({(stats as any).expiringSoonCount || 0})
          </Link>
        </div>
      </PageHeader>

      {/* Alerts */}
      {alerts && alerts.length > 0 && (
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                {alerts.length} inventory alert{alerts.length !== 1 ? 's' : ''}
              </h3>
              <p className="mt-1 text-sm text-yellow-700">
                Review low stock items and expiring medications.
              </p>
            </div>
          </div>
        </div>
      )}

      <Suspense fallback={<InventoryLoadingSkeleton />}>
        <InventoryList
          inventoryItems={inventory as any[]}
        />
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
      <div className="space-y-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-20 rounded border border-gray-200 bg-white"></div>
        ))}
      </div>
    </div>
  );
}
