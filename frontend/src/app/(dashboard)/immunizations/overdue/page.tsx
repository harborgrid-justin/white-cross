/**
 * @fileoverview Overdue Vaccines Page
 * @module app/(dashboard)/immunizations/overdue/page
 *
 * Dashboard for tracking and managing overdue vaccinations requiring immediate action.
 *
 * @since 1.0.0
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Overdue Vaccines | Immunizations',
  description: 'Track and manage overdue vaccinations requiring action',
};

function OverdueLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-20" />
      ))}
    </div>
  );
}

export default async function OverdueVaccinesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <PageHeader
          title="Overdue Vaccines"
          description="Vaccinations past due date requiring immediate action"
          icon={<AlertTriangle className="h-6 w-6 text-red-600" />}
        />

        <div className="mt-6">
          <Suspense fallback={<OverdueLoadingSkeleton />}>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Overdue Vaccines Dashboard
                </h3>
                <p className="text-gray-600">
                  This dashboard will show all vaccinations past their due date.
                </p>
              </div>
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
