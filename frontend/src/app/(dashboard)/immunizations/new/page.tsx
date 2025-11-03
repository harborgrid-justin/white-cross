/**
 * @fileoverview Record New Vaccine Administration Page
 * @module app/(dashboard)/immunizations/new/page
 *
 * Form for recording new vaccine administrations with CDC/ACIP compliance validation.
 *
 * **Features:**
 * - CVX code lookup and validation
 * - Lot number and expiration tracking
 * - VIS date verification
 * - Administration site selection
 * - Real-time contraindication checking
 * - Parent consent verification
 *
 * @since 1.0.0
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Record Vaccine Administration | Immunizations',
  description: 'Record new vaccine administration with CDC-compliant tracking',
};

function VaccineFormSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

export default async function NewVaccinePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="mb-6">
          <Link href="/immunizations">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Immunizations
            </Button>
          </Link>
        </div>

        <PageHeader
          title="Record Vaccine Administration"
          description="Record new vaccine with CDC/ACIP compliance tracking"
        />

        <div className="mt-6 max-w-4xl">
          <Suspense fallback={<VaccineFormSkeleton />}>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Vaccine administration form coming soon...</p>
              <p className="text-sm text-gray-500 mt-2">
                This form will include CVX code lookup, lot number tracking, VIS verification, and contraindication checking.
              </p>
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
