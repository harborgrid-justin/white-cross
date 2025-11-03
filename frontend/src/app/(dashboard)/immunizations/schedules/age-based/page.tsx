/**
 * @fileoverview Age-Based Recommendations Page
 * @module app/(dashboard)/immunizations/schedules/age-based/page
 *
 * Age-specific vaccination recommendations per CDC/ACIP.
 *
 * @since 1.0.0
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Age-Based Recommendations | Immunizations',
  description: 'Age-specific vaccination recommendations',
};

export default async function AgeBasedRecommendationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <PageHeader
          title="Age-Based Recommendations"
          description="CDC/ACIP vaccination recommendations by age"
        />

        <div className="mt-6">
          <Suspense fallback={<Skeleton className="h-64" />}>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Age-based recommendations coming soon...</p>
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
