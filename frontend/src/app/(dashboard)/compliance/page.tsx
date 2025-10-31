/**
 * @fileoverview Compliance Management Page - Healthcare regulatory compliance tracking
 * @module app/(dashboard)/compliance/page
 * @category Compliance - Pages
 *
 * Comprehensive compliance management system for healthcare regulatory requirements
 * including HIPAA, FERPA, OSHA, FDA, and state-specific regulations.
 *
 * **Key Features:**
 * - Multi-regulatory compliance tracking (HIPAA, FERPA, OSHA, FDA)
 * - Automated audit scheduling and reminder system
 * - Risk assessment and scoring for compliance gaps
 * - Document management for compliance evidence
 * - Staff training tracking and certification management
 * - Real-time compliance status monitoring and alerts
 * 
 * **Healthcare Compliance Areas:**
 * - Patient privacy and data protection (HIPAA)
 * - Student educational record privacy (FERPA)
 * - Workplace safety standards (OSHA)
 * - Medication handling and storage (FDA)
 * - State health department requirements
 * - Internal policy compliance and monitoring
 *
 * **Integration Points:**
 * - Health records system for HIPAA compliance verification
 * - Student information system for FERPA requirements
 * - Inventory management for FDA medication compliance
 * - Incident reporting for compliance issue tracking
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { ComplianceContent } from './_components/ComplianceContent';
import { Skeleton } from '@/components/ui/Skeleton';

export const metadata: Metadata = {
  title: 'Compliance Management | White Cross Healthcare',
  description: 'Healthcare regulatory compliance tracking with HIPAA, FERPA, OSHA, and FDA requirements monitoring',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Compliance Management | White Cross Healthcare',
    description: 'Comprehensive compliance tracking for healthcare regulatory requirements and audit management',
    type: 'website',
  },
};

export const dynamic = 'force-dynamic';

interface CompliancePageProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    category?: string;
    status?: string;
    priority?: string;
    dateRange?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

export default function CompliancePage({ searchParams }: CompliancePageProps) {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Compliance Management</h2>
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">
            Healthcare regulatory compliance tracking and audit management
          </p>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Skeleton className="h-96 col-span-4" />
              <Skeleton className="h-96 col-span-3" />
            </div>
          </div>
        }
      >
        <ComplianceContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
