/**
 * @fileoverview Immunizations Main Page - CDC-Compliant Vaccine Tracking
 * @module app/(dashboard)/immunizations/page
 *
 * Comprehensive immunization management dashboard providing centralized access to all
 * student vaccination records with CDC/ACIP compliance tracking, filtering, and real-time status.
 *
 * **Next.js 16 Best Practices:**
 * - Server component with async data fetching
 * - Parallel data fetching using Promise.all
 * - React cache() for request memoization
 * - Proper TypeScript types for all data
 * - Suspense boundaries for progressive loading
 *
 * **Immunization Management Features:**
 * - Multi-criteria search and filtering (student, vaccine, status, date range)
 * - Real-time compliance statistics (compliant, overdue, due soon, exempted)
 * - Quick access to CDC vaccination schedules
 * - VAERS adverse event reporting
 * - VIS (Vaccine Information Statement) tracking
 *
 * **CDC/ACIP Compliance:**
 * - CVX (vaccine) code tracking per CDC standards
 * - MVX (manufacturer) code validation
 * - Recommended vaccination schedules by age
 * - Catch-up schedule calculations
 * - Contraindication checking
 *
 * **Safety & Compliance:**
 * - HIPAA-compliant immunization data handling (PHI protected)
 * - Audit logging for all record access and modifications
 * - VIS date verification per CDC requirements
 * - VAERS reportable event tracking
 * - State immunization registry integration ready
 *
 * @requires Authentication - JWT token with nurse/admin role
 * @requires Permissions - VIEW_IMMUNIZATIONS, MANAGE_IMMUNIZATIONS
 *
 * @see {@link https://www.cdc.gov/vaccines/schedules/index.html | CDC Vaccination Schedules}
 * @see {@link https://www.cdc.gov/vaccines/hcp/vis/index.html | Vaccine Information Statements}
 *
 * @since 1.0.0
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';
import ImmunizationsContent from './_components/ImmunizationsContent';

/**
 * Metadata for immunizations main page
 */
export const metadata: Metadata = {
  title: 'All Immunizations | White Cross Healthcare',
  description: 'Comprehensive immunization management dashboard with CDC-compliant vaccine tracking, compliance monitoring, and VAERS reporting capabilities.',
};

/**
 * Search params interface
 */
interface ImmunizationsPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
    vaccineCode?: string;
    studentId?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
}

/**
 * Loading skeleton component
 */
function ImmunizationsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      
      {/* Filters */}
      <div className="flex gap-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
      
      {/* Table */}
      <div className="space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
    </div>
  );
}

/**
 * Immunizations Main Page Component
 * Server component with data fetching
 */
export default async function ImmunizationsPage({
  searchParams,
}: ImmunizationsPageProps) {
  // Await search params for Next.js 15+ compatibility
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <PageHeader
          title="Immunizations"
          description="CDC-compliant vaccine tracking and compliance monitoring"
          actions={
            <div className="flex gap-2">
              <Link href="/immunizations/compliance">
                <Button variant="outline">
                  View Compliance
                </Button>
              </Link>
              <Link href="/immunizations/new">
                <Button variant="default">
                  <Plus className="h-4 w-4 mr-2" />
                  Record Vaccine
                </Button>
              </Link>
            </div>
          }
        />

        <div className="mt-6">
          <Suspense fallback={<ImmunizationsLoadingSkeleton />}>
            <ImmunizationsContent searchParams={params} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}



