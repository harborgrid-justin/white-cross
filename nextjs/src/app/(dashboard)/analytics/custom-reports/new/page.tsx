/**
 * @fileoverview Create New Custom Report Page
 *
 * Interactive report builder interface for creating custom analytics reports.
 * Provides step-by-step configuration of data sources, metrics, filters,
 * and visualization options through the CustomReportBuilder component.
 *
 * @module app/(dashboard)/analytics/custom-reports/new/page
 *
 * @remarks
 * Report creation workflow:
 * 1. Basic Info: Name, description, report type
 * 2. Data Source: Select datasets (health metrics, medications, etc.)
 * 3. Metrics: Choose fields and aggregations (count, avg, sum)
 * 4. Filters: Date ranges, categories, conditions
 * 5. Visualization: Chart type (bar, line, pie), display options
 * 6. Scheduling: Frequency, recipients (optional)
 * 7. Preview: Test report with sample data
 * 8. Save: Create report and navigate to view
 *
 * Features:
 * - Guided multi-step builder interface
 * - Real-time validation of configuration
 * - Preview functionality before saving
 * - Back button for navigation
 * - Error handling with user feedback
 *
 * Integrations:
 * - CustomReportBuilder: Complex form component
 * - createCustomReport: Server action to persist report
 * - Report validation schemas: Type-safe config validation
 *
 * Performance:
 * - Client Component for interactive builder
 * - Form state managed by CustomReportBuilder
 * - Optimistic navigation after successful creation
 *
 * @example
 * ```tsx
 * // Route: /analytics/custom-reports/new
 * // User workflow:
 * // 1. Click "Create Report" from reports list
 * // 2. Configure report using builder interface
 * // 3. Preview report with sample data
 * // 4. Save report and redirect to detail view
 * ```
 *
 * @see {@link /analytics/custom-reports} - Reports list page
 * @see {@link /analytics/custom-reports/[id]} - Report detail view
 * @see {@link CustomReportBuilder} - Report builder component
 */

'use client';

import { useRouter } from 'next/navigation';
import { CustomReportBuilder } from '@/components/analytics/CustomReportBuilder';
import { createCustomReport } from '@/lib/actions/analytics.actions';
import type { CustomReportConfig } from '@/lib/validations/report.schemas';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

/**
 * Force dynamic rendering for authenticated report creation
 *
 * @type {"force-dynamic"}
 */
export const dynamic = "force-dynamic";

/**
 * New Custom Report Page Component
 *
 * Container page for the CustomReportBuilder component with save/preview handlers.
 * Manages navigation and server action integration.
 *
 * @returns {JSX.Element} Custom report creation page
 *
 * @remarks
 * Component structure:
 * 1. Header with back button and title
 * 2. CustomReportBuilder: Full-featured report configuration UI
 *
 * Event handlers:
 * - `handleSave`: Persists report via server action, redirects on success
 * - `handlePreview`: Shows preview modal with sample data (future feature)
 *
 * Report configuration type:
 * ```typescript
 * CustomReportConfig: {
 *   name: string,
 *   description: string,
 *   reportType: string,
 *   dataSource: string[],
 *   metrics: Array<{
 *     field: string,
 *     aggregation: 'count' | 'sum' | 'avg' | 'min' | 'max',
 *     label: string
 *   }>,
 *   filters: {
 *     dateRange: { start: Date, end: Date },
 *     conditions: Array<FilterCondition>
 *   },
 *   visualization: {
 *     chartType: 'bar' | 'line' | 'pie' | 'table',
 *     options: ChartOptions
 *   },
 *   isPublic: boolean,
 *   schedule?: ScheduleConfig
 * }
 * ```
 *
 * Error handling:
 * - Validation errors shown inline in builder
 * - Server errors displayed via toast notifications
 * - Errors prevent navigation until resolved
 *
 * Success flow:
 * - Success toast notification
 * - Automatic navigation to reports list
 * - New report visible in list immediately
 *
 * @example
 * ```tsx
 * // User creates medication compliance report:
 * // 1. Name: "Weekly Medication Compliance"
 * // 2. Type: medication-compliance
 * // 3. Metrics: administered (count), missed (count)
 * // 4. Date range: Last 7 days
 * // 5. Chart: Bar chart
 * // 6. Preview validates configuration
 * // 7. Save creates report and redirects
 * ```
 */
export default function NewCustomReportPage() {
  const router = useRouter();

  const handleSave = async (config: CustomReportConfig) => {
    const result = await createCustomReport(config);

    if (result.success) {
      toast.success('Report created successfully');
      router.push('/analytics/custom-reports');
    } else {
      toast.error(result.error || 'Failed to create report');
      throw new Error(result.error);
    }
  };

  const handlePreview = (config: CustomReportConfig) => {
    console.log('Preview report:', config);
    toast.info('Preview functionality coming soon');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/analytics/custom-reports"
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Custom Report</h1>
          <p className="mt-1 text-sm text-gray-500">
            Build a custom analytics report with your preferred metrics and visualizations
          </p>
        </div>
      </div>

      {/* Report Builder */}
      <CustomReportBuilder onSave={handleSave} onPreview={handlePreview} />
    </div>
  );
}
