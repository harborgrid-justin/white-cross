/**
 * @fileoverview Immunization Detail ID Route
 * @module app/(dashboard)/immunizations/[id]/page
 *
 * Individual immunization record detail view.
 *
 * @since 1.0.0
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

interface ImmunizationDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata(
  { params }: ImmunizationDetailPageProps
): Promise<Metadata> {
  const { id } = await params;
  
  return {
    title: `Immunization ${id} | White Cross Healthcare`,
    description: 'Immunization record details',
  };
}

function DetailLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-32" />
      <Skeleton className="h-48" />
      <Skeleton className="h-64" />
    </div>
  );
}

export default async function ImmunizationDetailPage({
  params,
}: ImmunizationDetailPageProps) {
  const { id } = await params;

  // TODO: Fetch immunization record by ID
  // const immunization = await getImmunizationRecord(id);
  // if (!immunization) {
  //   notFound();
  // }

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
          title={`Immunization Record #${id}`}
          description="Detailed vaccine administration record"
          actions={
            <div className="flex gap-2">
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          }
        />

        <div className="mt-6">
          <Suspense fallback={<DetailLoadingSkeleton />}>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Vaccine Information</h3>
                  <dl className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Vaccine Name</dt>
                      <dd className="mt-1 text-sm text-gray-900">COVID-19 mRNA</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">CVX Code</dt>
                      <dd className="mt-1 text-sm text-gray-900">CVX_207</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Lot Number</dt>
                      <dd className="mt-1 text-sm text-gray-900">ABC123456</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Expiration Date</dt>
                      <dd className="mt-1 text-sm text-gray-900">12/31/2025</dd>
                    </div>
                  </dl>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Administration Details</h3>
                  <p className="text-gray-600">Detailed record coming soon...</p>
                </div>
              </div>
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
