/**
 * @fileoverview Analytics Page - Healthcare data analytics and reporting dashboard
 * @module app/(dashboard)/analytics/page
 * @category Analytics - Pages
 */

import { Suspense } from 'react';
import { AnalyticsContent } from './_components/AnalyticsContent';

interface AnalyticsPageProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    dateRange?: string;
    metric?: string;
    department?: string;
    reportType?: string;
    sortBy?: string;
    sortOrder?: string;
    time_range?: string;
    metric_category?: string;
    report_status?: string;
  };
}

export const metadata = {
  title: 'Healthcare Analytics | White Cross',
  description: 'Comprehensive healthcare data analytics, performance metrics, and custom reporting dashboard for school health management.',
};

export default function AnalyticsPage({ searchParams }: AnalyticsPageProps) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <AnalyticsContent searchParams={searchParams} />
    </Suspense>
  );
}