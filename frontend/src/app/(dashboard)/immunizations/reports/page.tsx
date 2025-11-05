/**
 * @fileoverview Immunizations Reports - Advanced Filtering with SearchParams
 * @module app/(dashboard)/immunizations/reports/page
 * @category Healthcare Reporting
 *
 * Reports dashboard with advanced filtering using Next.js searchParams.
 * Demonstrates server-side filtering, pagination, and URL-based state management.
 */

import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Download, Search, TrendingUp, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

// SearchParams interface for type safety
interface ReportsPageProps {
  searchParams: Promise<{
    type?: 'compliance' | 'overdue' | 'upcoming' | 'administered';
    period?: 'week' | 'month' | 'quarter' | 'year';
    grade?: string;
    vaccine?: string;
    search?: string;
    page?: string;
    limit?: string;
    sortBy?: 'date' | 'name' | 'compliance' | 'overdue';
    sortOrder?: 'asc' | 'desc';
    export?: 'pdf' | 'excel' | 'csv';
  }>;
}

export const metadata: Metadata = {
  title: 'Immunization Reports - White Cross Healthcare',
  description: 'Comprehensive immunization reporting and analytics for healthcare compliance',
};

// Mock data generation based on searchParams
const generateReportsData = async (searchParams: Awaited<ReportsPageProps['searchParams']>) => {
  // Simulate server-side data fetching with filters
  await new Promise(resolve => setTimeout(resolve, 150));
  
  const { 
    type = 'compliance',
    period = 'month',
    grade,
    vaccine,
    search,
    page = '1',
    limit = '10',
    sortBy = 'date',
    sortOrder = 'desc'
  } = searchParams;

  // Mock reports data - in production this would come from the database
  const baseReports = [
    {
      id: 'rpt-001',
      title: 'Monthly Compliance Report',
      type: 'compliance',
      period: 'month',
      generated: '2024-11-05',
      totalStudents: 248,
      compliant: 215,
      overdue: 12,
      upcoming: 21,
      complianceRate: 86.7,
      grade: 'All Grades',
      vaccine: 'All Vaccines'
    },
    {
      id: 'rpt-002',
      title: 'COVID-19 Vaccination Status',
      type: 'administered',
      period: 'quarter',
      generated: '2024-11-04',
      totalStudents: 248,
      compliant: 232,
      overdue: 8,
      upcoming: 8,
      complianceRate: 93.5,
      grade: 'All Grades',
      vaccine: 'COVID-19'
    },
    {
      id: 'rpt-003',
      title: 'Overdue Immunizations Alert',
      type: 'overdue',
      period: 'week',
      generated: '2024-11-03',
      totalStudents: 248,
      compliant: 203,
      overdue: 25,
      upcoming: 20,
      complianceRate: 81.9,
      grade: '3rd Grade',
      vaccine: 'MMR'
    },
    {
      id: 'rpt-004',
      title: 'Flu Season Preparation',
      type: 'upcoming',
      period: 'month',
      generated: '2024-11-02',
      totalStudents: 248,
      compliant: 185,
      overdue: 15,
      upcoming: 48,
      complianceRate: 74.6,
      grade: 'All Grades',
      vaccine: 'Influenza'
    }
  ];

  // Apply server-side filtering based on searchParams
  let filteredReports = baseReports.filter(report => {
    if (type && report.type !== type) return false;
    if (grade && grade !== 'all' && !report.grade.toLowerCase().includes(grade.toLowerCase())) return false;
    if (vaccine && vaccine !== 'all' && !report.vaccine.toLowerCase().includes(vaccine.toLowerCase())) return false;
    if (search && !report.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return {
    reports: filteredReports,
    totalCount: filteredReports.length,
    summary: {
      totalReports: baseReports.length,
      thisMonth: baseReports.filter(r => r.period === 'month').length,
      avgCompliance: baseReports.reduce((sum, r) => sum + r.complianceRate, 0) / baseReports.length,
      totalOverdue: baseReports.reduce((sum, r) => sum + r.overdue, 0)
    }
  };
};

// Main content component demonstrating searchParams usage
async function ReportsContent({ searchParams }: { searchParams: Awaited<ReportsPageProps['searchParams']> }) {
  const data = await generateReportsData(searchParams);
  const { type, search } = searchParams;

  const getTypeIcon = (reportType: string) => {
    switch (reportType) {
      case 'compliance':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'overdue':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'upcoming':
        return <Calendar className="w-5 h-5 text-orange-500" />;
      case 'administered':
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      default:
        return <Users className="w-5 h-5 text-gray-500" />;
    }
  };

  const buildFilterUrl = (newParams: Record<string, string>) => {
    const params = new URLSearchParams();
    
    // Preserve existing searchParams
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    
    // Apply new params
    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    return `/immunizations/reports?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header with searchParams state */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Immunization Reports</h1>
          <p className="text-gray-600 mt-1">
            {search && (
              <span>Search results for "{search}" • </span>
            )}
            {type && type !== 'compliance' && (
              <span>Filtered by {type} • </span>
            )}
            Showing {data.reports.length} reports
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Link href="/immunizations/reports">
            <Button variant="outline" size="sm">
              Clear Filters
            </Button>
          </Link>
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick filter tabs using Link for client-side navigation */}
      <div className="flex items-center gap-1 border-b border-gray-200">
        {[
          { key: 'compliance', label: 'Compliance', count: data.summary.totalReports },
          { key: 'overdue', label: 'Overdue', count: data.summary.totalOverdue },
          { key: 'upcoming', label: 'Upcoming', count: 12 },
          { key: 'administered', label: 'Administered', count: 8 },
        ].map((filterOption) => (
          <Link
            key={filterOption.key}
            href={buildFilterUrl({ type: filterOption.key })}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              (type || 'compliance') === filterOption.key
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {filterOption.label}
            <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
              {filterOption.count}
            </span>
          </Link>
        ))}
      </div>

      {/* Search input with form submission */}
      <Card className="p-4">
        <form method="GET" action="/immunizations/reports" className="flex gap-4">
          {/* Preserve current searchParams in hidden inputs */}
          {Object.entries(searchParams).map(([key, value]) => 
            key !== 'search' && value ? (
              <input key={key} type="hidden" name={key} value={value} />
            ) : null
          )}
          
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              name="search"
              placeholder="Search reports by title..."
              className="pl-10"
              defaultValue={search || ''}
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </Card>

      {/* Reports grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.reports.map((report) => (
          <Card key={report.id} className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                {getTypeIcon(report.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-1 truncate">{report.title}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="capitalize text-xs">
                    {report.type}
                  </Badge>
                  <span className="text-xs text-gray-500">{report.grade}</span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Students:</span>
                    <span className="font-medium">{report.totalStudents}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Compliant:</span>
                    <span className="font-medium text-green-600">{report.compliant}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Compliance:</span>
                    <span className="font-medium">{report.complianceRate.toFixed(1)}%</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
                  Generated: {new Date(report.generated).toLocaleDateString()}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {data.reports.length === 0 && (
        <Card className="p-8 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
          <p className="text-gray-600 mb-4">
            {search ? `No reports match your search for "${search}"` : 'No reports available for the selected filters'}
          </p>
          <Link href="/immunizations/reports">
            <Button variant="outline">Clear Filters</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}

// Loading skeleton
function ReportsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-64" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    </div>
  );
}

// Main page component using Next.js searchParams pattern
export default async function ReportsPage(props: ReportsPageProps) {
  const searchParams = await props.searchParams;
  
  return (
    <Suspense fallback={<ReportsPageSkeleton />}>
      <ReportsContent searchParams={searchParams} />
    </Suspense>
  );
}
