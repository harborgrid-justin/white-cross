/**
 * @fileoverview Immunization Reports Hub
 * @module app/(dashboard)/immunizations/reports/page
 *
 * Central hub for all immunization reports and analytics.
 *
 * @since 1.0.0
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileText, CheckCircle, XCircle, TrendingUp, Download } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Reports | Immunizations',
  description: 'Immunization reports and analytics',
};

export default async function ReportsPage() {
  const reports = [
    {
      title: 'Compliance Report',
      description: 'Student compliance rates and vaccination coverage',
      href: '/immunizations/reports/compliance',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Exemption Tracking',
      description: 'Exemption statistics, trends, and approval status',
      href: '/immunizations/reports/exemptions',
      icon: XCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Vaccination Rates',
      description: 'Vaccination rates by vaccine type and time period',
      href: '/immunizations/reports/vaccination-rates',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'State Reporting',
      description: 'State immunization registry export and submission',
      href: '/immunizations/reports/state-reporting',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <PageHeader
          title="Immunization Reports"
          description="Comprehensive immunization reports and analytics"
          actions={
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export All Data
            </Button>
          }
        />

        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reports.map((report) => {
              const Icon = report.icon;
              return (
                <Link key={report.href} href={report.href}>
                  <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${report.bgColor}`}>
                        <Icon className={`h-6 w-6 ${report.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {report.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {report.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
