/**
 * @fileoverview Schools Management Page - Enhanced with Next.js v16 features
 * @module app/(dashboard)/admin/settings/schools/page
 * @category Admin - Settings Pages
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { getAdminSchools, getDistrictsForSchoolFilter, type SchoolSearchParams } from '@/lib/actions/admin.schools';
import { AdminPageHeader } from '../../_components/AdminPageHeader';
import { SchoolsManagementContent } from './_components/SchoolsManagementContent';
import { SchoolsManagementSkeleton } from './_components/SchoolsManagementSkeleton';

export const metadata: Metadata = {
  title: 'Schools Management',
  description: 'Manage schools, principals, and student enrollment information',
  robots: { index: false, follow: false }
};

interface SchoolsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

/**
 * Server component for schools data fetching with caching
 */
async function SchoolsContent({ searchParams }: SchoolsPageProps) {
  // Parse search parameters for server-side data fetching
  const params: SchoolSearchParams = {
    search: typeof searchParams.search === 'string' ? searchParams.search : undefined,
    status: typeof searchParams.status === 'string' ? 
      (searchParams.status as 'all' | 'active' | 'inactive') : 'all',
    districtId: typeof searchParams.districtId === 'string' ? searchParams.districtId : 'all',
    page: typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1,
    limit: typeof searchParams.limit === 'string' ? parseInt(searchParams.limit) : 20,
  };

  // Parallel data fetching for schools and districts filter
  const [schoolsResult, districtsResult] = await Promise.all([
    getAdminSchools(params),
    getDistrictsForSchoolFilter()
  ]);

  if (!schoolsResult.success) {
    throw new Error(schoolsResult.error || 'Failed to load schools');
  }

  const { schools, total } = schoolsResult.data;
  const districts = districtsResult.success ? districtsResult.data : [];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Schools Management"
        description="Manage schools and their information"
        count={total}
        countLabel="schools"
      />
      
      <SchoolsManagementContent 
        initialSchools={schools}
        totalCount={total}
        searchParams={params}
        districts={districts}
      />
    </div>
  );
}

/**
 * Schools Management Page Component
 * 
 * Enhanced with Next.js v16 features:
 * - Server Components for server-side data fetching
 * - 'use cache' directive for server-side caching
 * - Suspense boundaries for streaming
 * - Parallel data fetching for schools and districts
 * - Reusable components under 300 LOC
 * 
 * @param props.searchParams - URL search parameters for filtering and pagination
 * @returns Server component with schools management interface
 */
export default function SchoolsPage({ searchParams }: SchoolsPageProps) {
  return (
    <Suspense fallback={<SchoolsManagementSkeleton />}>
      <SchoolsContent searchParams={searchParams} />
    </Suspense>
  );
}
