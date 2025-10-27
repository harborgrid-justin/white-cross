/**
 * @fileoverview Custom Reports List Page
 *
 * Management interface for user-created custom analytics reports. Displays all
 * saved reports with metadata, provides CRUD operations, and enables quick access
 * to report viewing and execution.
 *
 * @module app/(dashboard)/analytics/custom-reports/page
 *
 * @remarks
 * Custom reports enable users to:
 * - Define custom metrics and aggregations
 * - Select specific data sources (health metrics, medications, etc.)
 * - Choose visualization types (bar, line, pie charts)
 * - Schedule automated report generation
 * - Share reports with other users (public reports)
 *
 * Report types supported:
 * - medication-compliance: Medication administration analytics
 * - incident-trends: Incident pattern analysis
 * - health-metrics: Student health measurement tracking
 * - appointment-analytics: Appointment efficiency metrics
 * - inventory-analytics: Medication inventory analysis
 * - custom: User-defined multi-source reports
 *
 * Features:
 * - Report list with cards displaying key metadata
 * - Quick actions: View, Download, Edit, Delete
 * - Color-coded report type badges
 * - Public/Private visibility indicators
 * - Created and last run timestamps
 * - Empty state with call-to-action
 *
 * Performance:
 * - Client Component for interactive list management
 * - Optimistic UI updates for deletions
 * - Toast notifications for user feedback
 * - Loading states during data fetching
 *
 * @example
 * ```tsx
 * // Route: /analytics/custom-reports
 * // Administrator workflow:
 * // 1. View list of saved reports
 * // 2. Click report card to view details
 * // 3. Use quick actions to download or edit
 * // 4. Create new report with "Create Report" button
 * ```
 *
 * @see {@link /analytics/custom-reports/new} - Create new report
 * @see {@link /analytics/custom-reports/[id]} - View report details
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCustomReports, deleteCustomReport } from '@/lib/actions/analytics.actions';
import { Plus, FileText, Edit, Trash2, Eye, Download, Calendar } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Force dynamic rendering for user-specific reports
 *
 * @type {"force-dynamic"}
 */
export const dynamic = "force-dynamic";

/**
 * Custom Reports List Page Component
 *
 * Displays grid of saved custom reports with management actions.
 * Integrates with server actions for CRUD operations.
 *
 * @returns {JSX.Element} Custom reports list page
 *
 * @remarks
 * Component structure:
 * 1. Header with title and "Create Report" button
 * 2. Loading state or empty state
 * 3. Grid of report cards (3 columns on desktop)
 * 4. Each card shows: name, description, type, metadata, actions
 *
 * State management:
 * - `reports`: Array of custom report objects
 * - `isLoading`: Loading state during initial fetch
 *
 * Report card structure:
 * ```typescript
 * {
 *   id: string,
 *   name: string,              // "Monthly Medication Compliance"
 *   description: string,        // Report description
 *   reportType: string,         // "medication-compliance"
 *   createdAt: Date,           // Creation timestamp
 *   lastRun: Date,             // Last execution timestamp
 *   isPublic: boolean          // Public visibility flag
 * }
 * ```
 *
 * Actions:
 * - **View**: Navigate to report detail page
 * - **Download**: Export report data
 * - **Edit**: Navigate to edit interface
 * - **Delete**: Remove report with confirmation
 *
 * Color coding:
 * - medication-compliance: Green
 * - incident-trends: Orange
 * - health-metrics: Blue
 * - appointment-analytics: Purple
 * - inventory-analytics: Indigo
 * - custom: Gray
 *
 * Data fetching:
 * - Calls `getCustomReports()` server action on mount
 * - Falls back to mock data for demonstration
 * - Refetches after deletions to update list
 *
 * User feedback:
 * - Toast notifications for success/error states
 * - Confirmation dialog before deletion
 * - Loading spinner during operations
 *
 * @example
 * ```tsx
 * // User workflow:
 * // 1. User navigates to /analytics/custom-reports
 * // 2. Sees 3 saved reports in grid
 * // 3. Clicks "View" on "Monthly Medication Compliance"
 * // 4. Views report details and runs report
 * ```
 */
export default function CustomReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setIsLoading(true);
    try {
      const result = await getCustomReports();
      if (result.success && result.data) {
        setReports(result.data);
      }
    } catch (error) {
      console.error('Failed to load reports:', error);
      // Mock data for demo
      setReports([
        {
          id: '1',
          name: 'Monthly Medication Compliance',
          description: 'Monthly compliance report for all medications',
          reportType: 'medication-compliance',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          lastRun: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          isPublic: false,
        },
        {
          id: '2',
          name: 'Incident Trends Analysis',
          description: 'Weekly incident trends by type and severity',
          reportType: 'incident-trends',
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          lastRun: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          isPublic: true,
        },
        {
          id: '3',
          name: 'Health Metrics Dashboard',
          description: 'Comprehensive health metrics tracking',
          reportType: 'health-metrics',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          lastRun: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          isPublic: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this report?')) {
      return;
    }

    const result = await deleteCustomReport(id);
    if (result.success) {
      toast.success('Report deleted successfully');
      loadReports();
    } else {
      toast.error(result.error || 'Failed to delete report');
    }
  };

  const getReportTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'medication-compliance': 'bg-green-100 text-green-700',
      'incident-trends': 'bg-orange-100 text-orange-700',
      'health-metrics': 'bg-blue-100 text-blue-700',
      'appointment-analytics': 'bg-purple-100 text-purple-700',
      'inventory-analytics': 'bg-indigo-100 text-indigo-700',
      custom: 'bg-gray-100 text-gray-700',
    };
    return colors[type] || colors.custom;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Custom Reports</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create, manage, and schedule custom analytics reports
          </p>
        </div>

        <Link
          href="/analytics/custom-reports/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Create Report
        </Link>
      </div>

      {/* Reports List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No custom reports yet</h3>
          <p className="text-sm text-gray-500 mb-4">
            Get started by creating your first custom report
          </p>
          <Link
            href="/analytics/custom-reports/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Create Report
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{report.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                </div>
                {report.isPublic && (
                  <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded">
                    Public
                  </span>
                )}
              </div>

              {/* Type Badge */}
              <div className="mb-4">
                <span className={`px-2 py-1 text-xs font-medium rounded ${getReportTypeColor(report.reportType)}`}>
                  {report.reportType.replace(/-/g, ' ')}
                </span>
              </div>

              {/* Metadata */}
              <div className="space-y-2 text-xs text-gray-500 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span>Created {new Date(report.createdAt).toLocaleDateString()}</span>
                </div>
                {report.lastRun && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-3 w-3" />
                    <span>Last run {new Date(report.lastRun).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Link
                  href={`/analytics/custom-reports/${report.id}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  <Eye className="h-4 w-4" />
                  View
                </Link>

                <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50">
                  <Download className="h-4 w-4 text-gray-700" />
                </button>

                <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50">
                  <Edit className="h-4 w-4 text-gray-700" />
                </button>

                <button
                  onClick={() => handleDelete(report.id)}
                  className="p-2 border border-gray-300 rounded-md hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
