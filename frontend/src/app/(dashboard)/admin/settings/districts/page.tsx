/**
 * @fileoverview Districts Management Page - Enhanced with Next.js v16 features
 * @module app/(dashboard)/admin/settings/districts/page
 * @category Admin - Settings Pages
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { getAdminDistricts, type DistrictSearchParams } from '@/lib/actions/admin.districts';
import { AdminPageHeader } from '../../_components/AdminPageHeader';
import { DistrictsManagementContent } from './_components/DistrictsManagementContent';
import { DistrictsManagementSkeleton } from './_components/DistrictsManagementSkeleton';

export const metadata: Metadata = {
  title: 'Districts Management',
  description: 'Manage school districts, addresses, and contact information',
  robots: { index: false, follow: false }
};

interface DistrictsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

/**
 * Server component for districts data fetching with caching
 */
async function DistrictsContent({ searchParams }: DistrictsPageProps) {
  // Parse search parameters for server-side data fetching
  const params: DistrictSearchParams = {
    search: typeof searchParams.search === 'string' ? searchParams.search : undefined,
    status: typeof searchParams.status === 'string' ? 
      (searchParams.status as 'all' | 'active' | 'inactive') : 'all',
    page: typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1,
    limit: typeof searchParams.limit === 'string' ? parseInt(searchParams.limit) : 20,
  };

  // Server-side data fetching with 'use cache' directive
  const result = await getAdminDistricts(params);

  if (!result.success) {
    throw new Error(result.error || 'Failed to load districts');
  }

  const { districts, total } = result.data;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Districts Management"
        description="Manage school districts and their information"
        count={total}
        countLabel="districts"
      />
      
      <DistrictsManagementContent 
        initialDistricts={districts}
        totalCount={total}
        searchParams={params}
      />
    </div>
  );
}

/**
 * Districts Management Page Component
 * 
 * Enhanced with Next.js v16 features:
 * - Server Components for server-side data fetching
 * - 'use cache' directive for server-side caching
 * - Suspense boundaries for streaming
 * - Reusable components under 300 LOC
 * 
 * @param props.searchParams - URL search parameters for filtering and pagination
 * @returns Server component with districts management interface
 */
export default function DistrictsPage({ searchParams }: DistrictsPageProps) {
  return (
    <Suspense fallback={<DistrictsManagementSkeleton />}>
      <DistrictsContent searchParams={searchParams} />
    </Suspense>
  );
}
