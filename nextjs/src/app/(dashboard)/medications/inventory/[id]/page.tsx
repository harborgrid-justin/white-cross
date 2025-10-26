/**
 * @fileoverview Inventory Item Detail Page
 * @module app/(dashboard)/medications/inventory/[id]
 *
 * Detailed inventory view for specific medication with history and adjustments.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Link } from 'next/link';
import InventoryItemDetail from '@/components/medications/InventoryItemDetail';
import { PageHeader } from '@/components/shared/PageHeader';
import { fetchWithAuth } from '@/lib/server/fetch';
import { API_ENDPOINTS } from '@/constants/api';

export const metadata: Metadata = {
  title: 'Inventory Details | White Cross',
  description: 'Medication inventory item details and history'
};

interface InventoryItemPageProps {
  params: {
    id: string;
  };
}

/**
 * Fetch inventory item
 */
async function getInventoryItem(id: string) {
  try {
    const response = await fetchWithAuth(
      `${API_ENDPOINTS.MEDICATIONS.BASE}/inventory/${id}`,
      { next: { tags: [`inventory-${id}`] } }
    );

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch inventory item');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    return null;
  }
}

/**
 * Inventory Item Detail Page
 */
export default async function InventoryItemPage({ params }: InventoryItemPageProps) {
  const item = await getInventoryItem(params.id);

  if (!item) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${item.medicationName} - Inventory`}
        description={`Current stock: ${item.quantity} ${item.quantityUnit || 'units'}`}
        backLink="/medications/inventory"
        backLabel="Back to Inventory"
      >
        <Link
          href={`/medications/inventory/${params.id}/adjust`}
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          Adjust Stock
        </Link>
      </PageHeader>

      {/* Low Stock Warning */}
      {item.quantity <= (item.lowStockThreshold || 10) && (
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Low stock alert</h3>
              <p className="mt-1 text-sm text-yellow-700">
                Stock level is at or below threshold. Consider reordering.
              </p>
            </div>
          </div>
        </div>
      )}

      <Suspense fallback={<ItemDetailLoadingSkeleton />}>
        <InventoryItemDetail item={item} />
      </Suspense>
    </div>
  );
}

function ItemDetailLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-64 rounded-lg border border-gray-200 bg-white p-6"></div>
      <div className="h-96 rounded-lg border border-gray-200 bg-white p-6"></div>
    </div>
  );
}
