/**
 * @fileoverview Students Page - Comprehensive student management system
 * @module app/(dashboard)/students/page
 * @category Students - Main Page
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Users, Download } from 'lucide-react';
import { StudentsContent } from './_components/StudentsContent';
import { StudentsFilters } from './_components/StudentsFilters';
import { PageBreadcrumbs } from '@/components/common/PageBreadcrumbs';

export const metadata: Metadata = {
  title: 'Students',
  description: 'Comprehensive student management system for healthcare and education with health records, enrollment tracking, and medical history management.',
  keywords: [
    'students',
    'student management',
    'healthcare',
    'education',
    'enrollment',
    'student records',
    'health profiles',
    'medical history'
  ],
  openGraph: {
    title: 'Students | White Cross Healthcare',
    description: 'Comprehensive student management and health tracking system for educational healthcare services.',
    type: 'website',
  },
  robots: {
    index: false,
    follow: false,
  },
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
      <PageBreadcrumbs
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Students' },
        ]}
        className="mb-4"
      />

      <PageHeader
        title="Students"
        description="Comprehensive student management system"
        actions={
          <div className="flex gap-2" role="group" aria-label="Student page actions">
            <Button variant="outline" size="sm" aria-label="Export student data to file">
              <Download className="h-4 w-4 mr-2" aria-hidden="true" />
              Export
            </Button>
            <Button size="sm" aria-label="Add new student to system">
              <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
              Add Student
            </Button>
          </div>
        }
      />

      <main role="main" aria-label="Students management">
        <div className="space-y-6">
          <Suspense fallback={<Skeleton className="h-16 w-full" aria-label="Loading filters" />}>
            <StudentsFilters searchParams={searchParams} />
          </Suspense>

          <Suspense fallback={<StudentsPageSkeleton />}>
            <StudentsContent searchParams={searchParams} />
          </Suspense>
        </div>
      </main>
    </>
  );
}


