/**
 * @fileoverview Students Page - Comprehensive student management system
 * @module app/(dashboard)/students/page
 * @category Students - Main Page
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Card, CardContent } from '@/components/ui/Card';
import { Plus, Users, Download } from 'lucide-react';
import { StudentsContent } from './_components/StudentsContent';
import { StudentsFilters } from './_components/StudentsFilters';

export const metadata: Metadata = {
  title: 'Students | White Cross',
  description: 'Comprehensive student management system for healthcare and education',
  keywords: ['students', 'management', 'healthcare', 'education', 'enrollment'],
};

interface StudentsPageProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    grade?: string;
    status?: string;
    hasHealthAlerts?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

function StudentsPageSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
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

export default function StudentsPage({ searchParams }: StudentsPageProps) {
  return (
    <>
      <PageHeader
        title="Students"
        description="Comprehensive student management system"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        <Suspense fallback={<Skeleton className="h-16 w-full" />}>
          <StudentsFilters totalCount={0} />
        </Suspense>

        <Suspense fallback={<StudentsPageSkeleton />}>
          <StudentsContent searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}