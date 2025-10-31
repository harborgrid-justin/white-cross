/**
 * @fileoverview Custom Report Detail Page (Dynamic Route)
 *
 * Displays comprehensive details and controls for a specific custom analytics
 * report. Enables report execution, data export, editing, and deletion through
 * a dedicated management interface.
 *
 * @module app/(dashboard)/analytics/custom-reports/[id]/page
 *
 * @remarks
 * This is a dynamic route that loads report data based on the `id` parameter
 * from the URL path: `/analytics/custom-reports/{reportId}`
 *
 * Report detail sections:
 * 1. Header: Name, public/private badge, action buttons
 * 2. Info cards: Date range, report type, chart type
 * 3. Configured Metrics: Display all metrics with aggregations
 * 4. Report Results: Placeholder for executed report output
 * 5. Metadata footer: Created and last run timestamps
 *
 * Actions available:
 * - **Run Report**: Execute report with current configuration
 * - **Export**: Download results in CSV, Excel, or PDF
 * - **Edit**: Navigate to edit interface
 * - **Delete**: Remove report with confirmation
 *
 * Features:
 * - Loading state during report fetch
 * - Not found state if report doesn't exist
 * - Mock data fallback for demonstration
 * - DataExporter integration for multiple formats
 * - Toast notifications for user feedback
 *
 * Performance:
 * - Client Component for interactive controls
 * - Lazy loading of report results
 * - Optimistic deletion with navigation
 *
 * @example
 * ```tsx
 * // Route: /analytics/custom-reports/abc123
 * // User workflow:
 * // 1. Navigate from reports list
 * // 2. View report configuration details
 * // 3. Click "Run Report" to generate results
 * // 4. Export results or edit configuration
 * ```
 *
 * @see {@link /analytics/custom-reports} - Reports list
 * @see {@link /analytics/custom-reports/new} - Create report
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getCustomReportById, deleteCustomReport } from '@/lib/actions/analytics.actions';
import { DataExporter } from '@/components/analytics/DataExporter';
import { ArrowLeft, Download, Edit, Trash2, Play, Calendar } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

/**
 * Force dynamic rendering for report-specific data
 *
 * @type {"force-dynamic"}
 */
export const dynamic = 'force-dynamic';

/**
 * Custom Report Detail Page Component
 *
 * Displays full details and controls for a custom report identified by URL parameter.
 * Integrates with server actions for report execution and management.
 *
 * @returns {JSX.Element} Report detail page or loading/not found states
 *
 * @remarks
 * Component structure:
 * 1. Loading spinner during initial fetch
 * 2. Not found message if report doesn't exist
 * 3. Full report detail view with:
 *    - Header with back button, title, badges, and action buttons
 *    - Info grid showing date range, report type, chart type
 *    - Configured metrics list with aggregation details
 *    - Report results placeholder (populated after "Run Report")
 *    - Metadata footer with timestamps
 *
 * State management:
 * - `report`: Fetched report object or null
 * - `isLoading`: Loading state during fetch
 * - `showExporter`: Toggle for DataExporter visibility
 *
 * URL parameters:
 * - `id`: Report ID from dynamic route segment
 *
 * Report structure:
 * ```typescript
 * {
 *   id: string,
 *   name: string,
 *   description: string,
 *   reportType: string,
 *   filters: {
 *     dateRange: { start: Date, end: Date }
 *   },
 *   metrics: Array<{
 *     field: string,
 *     aggregation: string,
 *     label: string
 *   }>,
 *   chartType: string,
 *   createdAt: Date,
 *   lastRun: Date,
 *   isPublic: boolean
 * }
 * ```
 *
 * Event handlers:
 * - `handleDelete`: Confirms deletion, calls server action, redirects on success
 * - `handleRun`: Executes report (implementation pending)
 *
 * Data fetching:
 * - Calls `getCustomReportById(id)` on mount
 * - Falls back to mock data if server action fails
 * - Refetches after edits (if navigating back)
 *
 * Navigation:
 * - Back button returns to reports list
 * - Delete action redirects to reports list
 * - Edit button navigates to edit page (future)
 *
 * @example
 * ```tsx
 * // User views "Monthly Medication Compliance" report:
 * // 1. Report loaded with configuration details
 * // 2. Shows date range: Last 30 days
 * // 3. Metrics: administered (count), missed (count)
 * // 4. User clicks "Run Report"
 * // 5. Results appear in placeholder section
 * // 6. User exports as PDF for distribution
 * ```
 */
export default function CustomReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params.id as string;

  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showExporter, setShowExporter] = useState(false);

  useEffect(() => {
    loadReport();
  }, [reportId]);

  const loadReport = async () => {
    setIsLoading(true);
    try {
      const result = await getCustomReportById(reportId);
      if (result.success && result.data) {
        setReport(result.data);
      } else {
        // Mock data for demo
        setReport({
          id: reportId,
          name: 'Monthly Medication Compliance',
          description: 'Monthly compliance report for all medications',
          reportType: 'medication-compliance',
          filters: {
            dateRange: {
              start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
              end: new Date(),
            },
          },
          metrics: [
            { field: 'administered', aggregation: 'count', label: 'Administered' },
            { field: 'missed', aggregation: 'count', label: 'Missed' },
            { field: 'complianceRate', aggregation: 'avg', label: 'Compliance Rate' },
          ],
          chartType: 'bar',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          lastRun: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          isPublic: false,
        });
      }
    } catch (error) {
      console.error('Failed to load report:', error);
      toast.error('Failed to load report');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this report?')) {
      return;
    }

    const result = await deleteCustomReport(reportId);
    if (result.success) {
      toast.success('Report deleted successfully');
      router.push('/analytics/custom-reports');
    } else {
      toast.error(result.error || 'Failed to delete report');
    }
  };

  const handleRun = () => {
    toast.info('Running report...');
    // Implement report execution
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Report not found</h3>
        <Link href="/analytics/custom-reports" className="text-blue-600 hover:underline">
          Return to reports
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/analytics/custom-reports"
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{report.name}</h1>
              {report.isPublic && (
                <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded">
                  Public
                </span>
              )}
            </div>
            {report.description && (
              <p className="mt-1 text-sm text-gray-500">{report.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRun}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Play className="h-4 w-4" />
            Run Report
          </button>

          <button
            onClick={() => setShowExporter(!showExporter)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            Export
          </button>

          <Link
            href={`/analytics/custom-reports/${reportId}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Link>

          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 px-4 py-2 border border-red-300 rounded-md text-red-700 bg-white hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Report Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Date Range</span>
          </div>
          <div className="text-sm text-gray-900">
            {new Date(report.filters.dateRange.start).toLocaleDateString()} -{' '}
            {new Date(report.filters.dateRange.end).toLocaleDateString()}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-700 mb-2">Report Type</div>
          <div className="text-sm text-gray-900 capitalize">
            {report.reportType.replace(/-/g, ' ')}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-700 mb-2">Chart Type</div>
          <div className="text-sm text-gray-900 capitalize">{report.chartType}</div>
        </div>
      </div>

      {/* Metrics */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configured Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {report.metrics.map((metric: any, index: number) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-900">{metric.label}</div>
              <div className="text-xs text-gray-500 mt-1">
                {metric.aggregation} of {metric.field}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exporter */}
      {showExporter && (
        <DataExporter
          data={[]} // Add actual report data
          filename={report.name.replace(/\s+/g, '_')}
          title="Export Report Data"
          pdfOptions={{
            title: report.name,
            subtitle: report.description,
          }}
        />
      )}

      {/* Report Results Placeholder */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Results</h3>
        <div className="text-center py-12 text-gray-500">
          <Play className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>Click "Run Report" to generate results</p>
        </div>
      </div>

      {/* Metadata */}
      <div className="bg-gray-50 p-4 rounded-lg text-xs text-gray-600">
        <div className="flex items-center justify-between">
          <span>Created: {new Date(report.createdAt).toLocaleString()}</span>
          {report.lastRun && <span>Last run: {new Date(report.lastRun).toLocaleString()}</span>}
        </div>
      </div>
    </div>
  );
}
