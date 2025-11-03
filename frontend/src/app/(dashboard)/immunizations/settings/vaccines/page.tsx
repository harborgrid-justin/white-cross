/**
 * @fileoverview Vaccine Catalog Settings Page
 * @module app/(dashboard)/immunizations/settings/vaccines/page
 *
 * Manage vaccine inventory and CVX codes.
 *
 * @since 1.0.0
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Vaccine Catalog | Settings',
  description: 'Manage vaccine inventory and CVX codes',
};

export default async function VaccineCatalogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <PageHeader
          title="Vaccine Catalog"
          description="Manage vaccine inventory, CVX codes, and manufacturer information"
          actions={
            <Button variant="default">
              <Plus className="h-4 w-4 mr-2" />
              Add Vaccine
            </Button>
          }
        />

        <div className="mt-6">
          <Suspense fallback={<Skeleton className="h-96" />}>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Vaccine catalog management coming soon...</p>
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
