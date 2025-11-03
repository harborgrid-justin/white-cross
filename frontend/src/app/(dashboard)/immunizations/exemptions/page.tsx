/**
 * @fileoverview Exemptions Management Page
 * @module app/(dashboard)/immunizations/exemptions/page
 *
 * Manage medical, religious, and philosophical vaccination exemptions.
 *
 * @since 1.0.0
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Exemptions | Immunizations',
  description: 'Manage vaccination exemptions and documentation',
};

function ExemptionsLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-24" />
      ))}
    </div>
  );
}

export default async function ExemptionsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <PageHeader
          title="Immunization Exemptions"
          description="Manage medical, religious, and philosophical vaccination exemptions"
          actions={
            <Button variant="default">
              <Plus className="h-4 w-4 mr-2" />
              New Exemption Request
            </Button>
          }
        />

        <div className="mt-6">
          <Suspense fallback={<ExemptionsLoadingSkeleton />}>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Exemption Management
                </h3>
                <p className="text-gray-600 mb-4">
                  Track and manage vaccination exemptions with approval workflows.
                </p>
                <div className="flex gap-2 justify-center">
                  <Link href="/immunizations/exemptions/pending">
                    <Button variant="outline">View Pending</Button>
                  </Link>
                  <Link href="/immunizations/exemptions/approved">
                    <Button variant="outline">View Approved</Button>
                  </Link>
                </div>
              </div>
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
