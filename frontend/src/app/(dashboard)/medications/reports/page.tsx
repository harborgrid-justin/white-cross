/**
 * @fileoverview Medication Reports Dashboard
 * @module app/(dashboard)/medications/reports
 *
 * Central hub for all medication-related reports and analytics.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { Link } from 'next/link';
import ReportsDashboard from '@/components/medications/ReportsDashboard';
import { PageHeader } from '@/components/shared/PageHeader';

export const metadata: Metadata = {
  title: 'Medication Reports | White Cross',
  description: 'Generate and view medication reports and analytics'
};

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";

/**
 * Reports Dashboard Page
 */
export default function MedicationReportsPage() {
  const reports = [
    {
      id: 'administration',
      title: 'Administration Report',
      description: 'Detailed medication administration history with filters',
      icon: 'clipboard',
      href: '/medications/reports/administration',
      color: 'blue'
    },
    {
      id: 'compliance',
      title: 'Compliance Report',
      description: 'HIPAA compliance audit and adherence tracking',
      icon: 'shield-check',
      href: '/medications/reports/compliance',
      color: 'green'
    },
    {
      id: 'inventory',
      title: 'Inventory Report',
      description: 'Stock levels, usage rates, and inventory analytics',
      icon: 'cube',
      href: '/medications/reports/inventory',
      color: 'purple'
    },
    {
      id: 'expiration',
      title: 'Expiration Report',
      description: 'Medications expiring soon and expired items',
      icon: 'calendar',
      href: '/medications/reports/expiration',
      color: 'yellow'
    },
    {
      id: 'refills',
      title: 'Refills Report',
      description: 'Refill needs, pending requests, and authorization tracking',
      icon: 'arrow-path',
      href: '/medications/reports/refills',
      color: 'indigo'
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Medication Reports"
        description="Generate comprehensive reports and analytics"
        backLink="/medications"
        backLabel="Back to Medications"
      />

      <Suspense fallback={<ReportsLoadingSkeleton />}>
        <ReportsDashboard reports={reports} />
      </Suspense>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <Link
            key={report.id}
            href={report.href}
            className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 hover:border-indigo-500 hover:shadow-lg transition-all"
          >
            <div className="space-y-4">
              <div className={`inline-flex rounded-lg bg-${report.color}-100 p-3`}>
                <svg className={`h-6 w-6 text-${report.color}-600`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600">
                  {report.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {report.description}
                </p>
              </div>
            </div>
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ReportsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="animate-pulse h-48 rounded-lg border border-gray-200 bg-white p-6"></div>
      ))}
    </div>
  );
}
