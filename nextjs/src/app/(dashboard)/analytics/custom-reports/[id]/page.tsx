/**
 * View Custom Report Page
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getCustomReportById, deleteCustomReport } from '@/lib/actions/analytics.actions';
import { DataExporter } from '@/components/analytics/DataExporter';
import { ArrowLeft, Download, Edit, Trash2, Play, Calendar } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

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
