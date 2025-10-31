/**
 * @fileoverview Health Records Page - Comprehensive health record management
 * @module app/(dashboard)/health-records/page
 * @category Health Records - Main Page
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Card, CardContent } from '@/components/ui/Card';
import { Plus, FileHeart } from 'lucide-react';
import { HealthRecordsContent } from './_components/HealthRecordsContent';
import { HealthRecordsFilters } from './_components/HealthRecordsFilters';

export const metadata: Metadata = {
  title: 'Health Records | White Cross',
  description: 'Comprehensive health record management system for student healthcare',
  keywords: ['health records', 'medical history', 'immunizations', 'allergies', 'vital signs'],
};

interface HealthRecordsPageProps {
  searchParams: {
    page?: string;
    limit?: string;
    type?: string;
    status?: string;
    priority?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    studentId?: string;
    recordedBy?: string;
  };
}

function HealthRecordsPageSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-96 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function HealthRecordsPage({ searchParams }: HealthRecordsPageProps) {
  return (
    <>
      <PageHeader
        title="Health Records"
        description="Comprehensive health record management for student healthcare"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileHeart className="h-4 w-4 mr-2" />
              View Timeline
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Record
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        <Suspense fallback={<Skeleton className="h-16 w-full" />}>
          <HealthRecordsFilters totalCount={0} />
        </Suspense>

        <Suspense fallback={<HealthRecordsPageSkeleton />}>
          <HealthRecordsContent searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}
