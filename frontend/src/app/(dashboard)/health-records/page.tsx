/**
 * @fileoverview Health Records Page - Comprehensive health record management
 * @module app/(dashboard)/health-records/page
 * @category Health Records - Main Page
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, FileHeart, BarChart3 } from 'lucide-react';
import { HealthRecordsContent } from './_components/HealthRecordsContent';
import { HealthRecordsFilters } from './_components/HealthRecordsFilters';
import { getHealthRecordsAction } from '@/app/health-records/actions';

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

async function HealthRecordsFiltersWrapper({ searchParams }: { searchParams: HealthRecordsPageProps['searchParams'] }) {
  // Fetch health records to get the total count
  const result = await getHealthRecordsAction(searchParams.studentId, searchParams.type);
  const totalCount = result.success ? (result.data?.length || 0) : 0;
  
  return <HealthRecordsFilters totalCount={totalCount} />;
}

export default function HealthRecordsPage({ searchParams }: HealthRecordsPageProps) {
  return (
    <>
      <PageHeader
        title="Health Records"
        description="Comprehensive health record management for student healthcare"
        actions={
          <div className="flex gap-2">
            <Link href="/health-records/reports">
              <Button variant="outline" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                Reports
              </Button>
            </Link>
            <Link href="/health-records/timeline">
              <Button variant="outline" size="sm">
                <FileHeart className="h-4 w-4 mr-2" />
                Timeline
              </Button>
            </Link>
            <Link href="/health-records/new">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Record
              </Button>
            </Link>
          </div>
        }
      />

      <div className="space-y-6">
        <Suspense fallback={<Skeleton className="h-32 w-full" />}>
          <HealthRecordsFiltersWrapper searchParams={searchParams} />
        </Suspense>

        <Suspense fallback={<HealthRecordsPageSkeleton />}>
          <HealthRecordsContent searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}


