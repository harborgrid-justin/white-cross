/**
 * @fileoverview Compliance Dashboard Page
 * @module app/(dashboard)/immunizations/compliance/page
 *
 * Comprehensive compliance tracking and monitoring dashboard.
 *
 * @since 1.0.0
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { ListChecks, Shield, Activity } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Compliance Dashboard | Immunizations',
  description: 'Overall immunization compliance tracking and monitoring',
};

function ComplianceLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}

export default async function ComplianceDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Link href="/compliance" className="hover:text-blue-600 transition-colors flex items-center gap-1">
            <Shield className="h-4 w-4" />
            Compliance Dashboard
          </Link>
          <span>/</span>
          <Link href="/compliance/audits" className="hover:text-blue-600 transition-colors flex items-center gap-1">
            <Activity className="h-4 w-4" />
            Audit Logs
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Immunization Compliance</span>
        </div>

        <PageHeader
          title="Compliance Dashboard"
        />

        {/* Quick Links to Main Compliance System */}
        <Card className="mt-4 p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900 mb-1">
                Integrated with Organization-Wide Compliance Tracking
              </h3>
              <p className="text-xs text-blue-700">
                Immunization compliance data is monitored alongside other healthcare compliance requirements. 
                Access comprehensive audit trails and regulatory reports through the main compliance dashboard.
              </p>
            </div>
            <div className="flex gap-2 ml-4">
              <Link
                href="/compliance/audits"
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-white rounded-md hover:bg-blue-100 transition-colors"
              >
                <Activity className="h-3.5 w-3.5" />
                Audit Logs
              </Link>
              <Link
                href="/compliance"
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-white rounded-md hover:bg-blue-100 transition-colors"
              >
                <Shield className="h-3.5 w-3.5" />
                Main Dashboard
              </Link>
            </div>
          </div>
        </Card>

        <div className="mt-6">
          <Suspense fallback={<ComplianceLoadingSkeleton />}>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center py-12">
                <ListChecks className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Immunization Compliance Dashboard
                </h3>
                <p className="text-gray-600">
                  Comprehensive compliance tracking with state requirements and CDC guidelines.
                </p>
              </div>
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
